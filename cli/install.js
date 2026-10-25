import fs from 'node:fs';
import path from 'node:path';
import { AGENTS, detectAgents, parseAgentList } from './agents.js';
import { context, skillName, version, sourceProvenance } from './config.js';
import { choose, intro, info, ok, warn } from './ui.js';
import { assertTarget, fileBytes, hash, safePath, slash } from './safety.js';
import { loadManifest, migrateManifest, validateManifest } from './manifest.js';
import { payload, payloadDigest } from './payload.js';
import { pendingTransaction, recover, transact } from './transaction.js';

function existing(ctx, files) {
  const old=loadManifest(ctx);
  if(old?.schemaVersion===1) warn('Migrating legacy tracking conservatively. Unknown or modified legacy files will be preserved.');
  return migrateManifest(old,files);
}
function customTarget(ctx,value) {
  const relative=slash(path.relative(ctx.root,path.resolve(ctx.workspace,value)));
  assertTarget(relative); safePath(ctx.root,relative); return relative;
}
function destination(ctx, agent, requested) {
  const adapter=AGENTS[agent];
  const native=ctx.scope==='user'?adapter.userDir:adapter.dir;
  if(!native) throw new Error(`${adapter.label} has no personal discovery path. Use --target inside the installation root.`);
  const shared=ctx.scope==='user'?adapter.sharedUser:adapter.sharedProject;
  if(shared && !fileBytes(ctx.root,`${native}/SKILL.md`) && (requested.includes('codex') || fileBytes(ctx.root,`${shared}/SKILL.md`))) return shared;
  return native;
}
export async function onboarding(options = {}) {
  intro(options.update ? 'Update saved installation targets' : 'Install once, use from your agent');
  let installScope=options.installScope;
  if(!installScope && process.stdin.isTTY && process.stdout.isTTY && !options.update) installScope=await choose('Where should the skill be available?', [{value:'project',label:'This project'},{value:'user',label:'All my projects on this computer'}]);
  const ctx=context({...options,installScope:installScope||'project'});
  const files=payload();
  if(pendingTransaction(ctx)) throw new Error('Installation is locked or interrupted. Run recover with the same project and installation scope.');
  const initial=existing(ctx,files);
  let agents=parseAgentList(options.agentArg);
  if(options.target && agents.length) throw new Error('Choose --target or --agent, not both.');
  if(options.update && (agents.length || options.target)) throw new Error('Update uses saved targets. Use install to add an agent.');
  if(options.update && !initial?.installs.length) throw new Error('No saved installations to update.');
  if(!options.update && !agents.length && !options.target) {
    if(!process.stdin.isTTY || !process.stdout.isTTY) throw new Error('Noninteractive installation requires --agent or --target.');
    const detected=detectAgents(ctx.workspace);
    if(detected.length) info(`Suggested: ${detected.join(', ')}. Choose the host you want to use.`);
    agents=[await choose('Install for which agent?',Object.entries(AGENTS).map(([value,a])=>({value,label:a.label})))];
  }
  let desired=options.update ? initial.installs.map(i=>({agent:i.agent,target:i.target})) : options.target ? [{agent:'custom',target:customTarget(ctx,options.target)}] : agents.map(agent=>({agent,target:destination(ctx,agent,agents)}));
  let result, transactionTargets=[];
  function plan() {
    const old=existing(ctx,files);
    if(options.update) {
      if(!old?.installs.length) throw new Error('Installation records changed. Run install first.');
      desired=old.installs.map(i=>({agent:i.agent,target:i.target}));
    }
    transactionTargets=[...new Set([...(old?.installs||[]).map(i=>i.target),...desired.map(i=>i.target)])];
    const installs=(old?.installs||[]).map(i=>({...i,files:i.files.map(f=>({...f}))}));
    const operations=[];
    for(const desiredInstall of desired) {
      const {agent,target}=desiredInstall;
      assertTarget(target); safePath(ctx.root,target);
      info(`${agent} → ${path.join(ctx.root,target)} (${ctx.scope})`);
      const previous=installs.find(i=>i.target===target);
      const known=new Map((previous?.files||[]).map(f=>[f.path,f]));
      const records=[];
      for(const [name,bytes] of files) {
        const rel=`${target}/${name}`, current=fileBytes(ctx.root,rel), tracked=known.get(rel), digest=hash(bytes);
        if(current && !tracked && !options.adopt) throw new Error(`Untracked file: ${rel}. Use --adopt only to take ownership of an identical payload.`);
        if(current && !tracked && hash(current)!==digest) throw new Error(`Cannot adopt modified file: ${rel}`);
        if(current && tracked && hash(current)!==tracked.hash) throw new Error(`Modified file preserved: ${rel}. Move your edit aside or merge it before updating.`);
        if(!current || hash(current)!==digest) operations.push({path:rel,bytes});
        records.push({path:rel,hash:digest,owned:true});
      }
      for(const record of known.values()) {
        if(records.some(r=>r.path===record.path)) continue;
        const current=fileBytes(ctx.root,record.path);
        if(current && hash(current)===record.hash) operations.push({path:record.path,bytes:null});
        else if(current) {warn(`Preserving edited obsolete file: ${record.path}`); records.push(record);}
      }
      const directories=new Set(previous?.directories || (previous?.createdDirectory ? [target] : []));
      for(const [name] of files) {
        let dir=path.posix.dirname(`${target}/${name}`);
        while(dir===target || dir.startsWith(`${target}/`)) {
          if(!fs.existsSync(safePath(ctx.root,dir))) directories.add(dir);
          dir=path.posix.dirname(dir);
        }
      }
      const entry={directories:[...directories],agent:previous?.agent||agent,agents:[...new Set([...(previous?.agents||[previous?.agent||agent]),agent])],target,version,payloadDigest:payloadDigest(files),createdDirectory:previous?.createdDirectory??!fs.existsSync(safePath(ctx.root,target)),files:records};
      if(previous) installs[installs.indexOf(previous)]=entry; else installs.push(entry);
    }
    result={schemaVersion:2,package:skillName,version,scope:ctx.scope,installedAt:old?.installedAt||new Date().toISOString(),updatedAt:new Date().toISOString(),sourceRevision:sourceProvenance().revision,sourceDirty:sourceProvenance().dirty,payloadDigest:payloadDigest(files),installs};
    validateManifest(result,ctx);
    operations.push({path:ctx.record,bytes:Buffer.from(`${JSON.stringify(result,null,2)}\n`)});
    return [...new Map(operations.map(op=>[op.path,op])).values()];
  }
  if(options.dryRun) {const ops=plan(); info(`Preview: ${ops.length} file changes; nothing written.`); return {dryRun:true,targets:desired};}
  transact(ctx,()=>transactionTargets,plan,options.transactionOptions);
  ok('Skill files installed. Host invocation still needs verification.');
  for(const agent of agents) info(AGENTS[agent].invoke);
  info('In your project, ask your agent to use tech-branding-logo. Initialize project memory with templates/initialize-project.md or the optional brief command.');
  return result;
}
export async function uninstall(options = {}) {
  intro('Uninstall — preserve edited and untracked files');
  const ctx=context(options), files=payload();
  if(pendingTransaction(ctx)) throw new Error('Installation is locked or interrupted. Run recover first.');
  const initial=existing(ctx,files);
  if(!initial?.installs.length) throw new Error('No saved installations to remove.');
  let preserved=[], currentManifest=initial;
  function plan() {
    const manifest=existing(ctx,files);
    if(!manifest?.installs.length) throw new Error('Installation records changed. Nothing to remove.');
    currentManifest=manifest; const operations=[]; preserved=[];
    for(const install of manifest.installs) for(const record of install.files) {
      const bytes=fileBytes(ctx.root,record.path);
      if(bytes && hash(bytes)===record.hash) operations.push({path:record.path,bytes:null});
      else if(bytes) preserved.push(record.path);
    }
    operations.push({path:ctx.record,bytes:null});
    return [...new Map(operations.map(op=>[op.path,op])).values()];
  }
  if(options.dryRun) {const ops=plan(); info(`Would remove ${ops.length-1} unchanged tracked files. No files changed.`);}
  else {
    transact(ctx,()=>currentManifest.installs.map(i=>i.target),plan,options.transactionOptions);
    for(const install of currentManifest.installs) {
      const directories=install.directories || (install.createdDirectory ? [install.target] : []);
      for(const rel of [...directories].sort((a,b)=>b.length-a.length)) {
        const dir=safePath(ctx.root,rel);
        if(fs.existsSync(dir) && fs.readdirSync(dir).length===0) fs.rmdirSync(dir);
      }
    }
    ok('Removed unchanged tracked files. Branding project memory was preserved.');
  }
  for(const rel of preserved) warn(`Preserved modified file: ${rel}`);
  return {preserved};
}
export function recoverInstallation(options={}) {
  const ctx=context(options); recover(ctx); ok('Interrupted changes rolled back. Re-run the intended operation.');
}
