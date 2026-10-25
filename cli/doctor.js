import fs from 'node:fs';
import path from 'node:path';
import { context } from './config.js';
import { AGENTS } from './agents.js';
import { loadManifest } from './manifest.js';
import { payload } from './payload.js';
import { fileBytes, hash } from './safety.js';
import { pendingTransaction } from './transaction.js';
import { intro, ok, warn, info } from './ui.js';

export function doctor(options={}) {
  intro('Doctor — check installed files (host invocation is a separate check)');
  let healthy=true;
  try {
    const ctx=context(options), manifest=loadManifest(ctx), expected=payload();
    if(pendingTransaction(ctx)) throw new Error('Interrupted or active installation. Run recover after the installer stops.');
    if(!manifest?.installs.length) throw new Error('No installed targets recorded. Run install first.');
    if(manifest.schemaVersion!==2) throw new Error('Legacy ownership records need migration. Run update; modified files will be preserved.');
    for(const install of manifest.installs) {
      const tracked=new Map(install.files.map(f=>[f.path,f]));
      for(const [name] of expected) {
        const rel=`${install.target}/${name}`, bytes=fileBytes(ctx.root,rel), record=tracked.get(rel);
        if(!bytes || !record || hash(bytes)!==record.hash) {warn(`Missing, untracked or modified payload: ${rel}`); healthy=false;}
      }
      for(const record of install.files) {
        const bytes=fileBytes(ctx.root,record.path);
        if(!bytes || hash(bytes)!==record.hash) {warn(`Tracked file differs: ${record.path}`); healthy=false;}
      }
      const skill=fileBytes(ctx.root,`${install.target}/SKILL.md`)?.toString()||'';
      if(!skill.startsWith('---\n') || !skill.includes('\nname: branded\n') || !/\ndescription: \S/.test(skill)) {warn('Invalid installed skill metadata.'); healthy=false;}
      info(`${install.agent}: ${path.join(ctx.root,install.target)}`);
      info(AGENTS[install.agent]?.invoke||'Explicitly load this skill in your agent.');
    }
    const locations=new Set();
    for(const scope of ['project','user']) {
      const diagnostic=context({...options,installScope:scope});
      for(const adapter of Object.values(AGENTS)) {
        const rel=scope==='user'?adapter.userDir:adapter.dir;
        if(rel && fs.existsSync(path.join(diagnostic.root,rel,'SKILL.md'))) locations.add(path.join(diagnostic.root,rel));
      }
    }
    if(locations.size>1) warn(`Multiple copies found: ${[...locations].join(', ')}. Check the host selector for duplicate versions.`);
    const state=path.join(ctx.workspace,'.branding/state.json');
    if(fs.existsSync(state)) {JSON.parse(fs.readFileSync(state,'utf8')); info('Branding project state found.'); if(!fs.existsSync(path.join(ctx.workspace,'.branding/handoff.md'))) {warn('Project handoff missing.'); healthy=false;}}
    else info('No branding project yet; that is fine.');
  } catch(e) {warn(e.message); healthy=false;}
  if(healthy) ok('Filesystem checks passed. Confirm the skill appears in your agent and run a small branding prompt.');
  else warn('Some checks need attention. Review the messages before updating.');
  return healthy;
}
