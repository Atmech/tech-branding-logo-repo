import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { onboarding, uninstall, recoverInstallation } from '../cli/install.js';
import { doctor } from '../cli/doctor.js';
import { context } from '../cli/config.js';
import { payload } from '../cli/payload.js';
import { hash } from '../cli/safety.js';
import { parse } from '../cli/index.js';
import { transact } from '../cli/transaction.js';
const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const cli=path.join(repo,'bin/tech-branding-logo.js');
function project(t) {const dir=fs.mkdtempSync(path.join(os.tmpdir(),'tbl-lifecycle-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));return fs.realpathSync(dir);}
const read=(cwd)=>JSON.parse(fs.readFileSync(context({cwd}).manifestFile,'utf8'));

test('repeat install and adding targets preserve ownership and later user files',async t=>{
  const cwd=project(t);await onboarding({cwd,agentArg:'generic'});
  const added=path.join(cwd,'skills/tech-branding-logo/user-notes.md');fs.writeFileSync(added,'mine');
  await onboarding({cwd,agentArg:'generic'});assert.equal(read(cwd).installs[0].createdDirectory,true);
  await onboarding({cwd,agentArg:'claude'});assert.equal(read(cwd).installs.length,2);
  fs.mkdirSync(path.join(cwd,'.branding'));fs.writeFileSync(path.join(cwd,'.branding/decisions.md'),'approved');
  await uninstall({cwd});assert.equal(fs.readFileSync(added,'utf8'),'mine');assert.equal(fs.readFileSync(path.join(cwd,'.branding/decisions.md'),'utf8'),'approved');
});
test('update uses saved targets without detection and rejects edited payload before changes',async t=>{
  const cwd=project(t);await onboarding({cwd,agentArg:'generic'});fs.mkdirSync(path.join(cwd,'.claude'));
  await onboarding({cwd,update:true});assert.deepEqual(read(cwd).installs.map(i=>i.agent),['generic']);
  const file=path.join(cwd,'skills/tech-branding-logo/SKILL.md');fs.appendFileSync(file,'\nmy edit');
  const before=fs.readFileSync(context({cwd}).manifestFile);
  await assert.rejects(onboarding({cwd,update:true}),/Modified file preserved/);assert.deepEqual(fs.readFileSync(context({cwd}).manifestFile),before);
  assert.equal(doctor({cwd}),false);await uninstall({cwd});assert.match(fs.readFileSync(file,'utf8'),/my edit/);
});
test('obsolete unchanged files are removed and modified obsolete files are kept',async t=>{
  const cwd=project(t);await onboarding({cwd,agentArg:'generic'});const ctx=context({cwd}),m=read(cwd),target=m.installs[0].target;
  for(const [name,contents] of [['old.md','old'],['edited.md','before']]) {const rel=`${target}/${name}`;fs.writeFileSync(path.join(cwd,rel),contents);m.installs[0].files.push({path:rel,hash:hash(Buffer.from(contents)),owned:true});}
  fs.appendFileSync(path.join(cwd,target,'edited.md'),' edit');fs.writeFileSync(ctx.manifestFile,JSON.stringify(m));
  await onboarding({cwd,update:true});assert.equal(fs.existsSync(path.join(cwd,target,'old.md')),false);assert.equal(fs.readFileSync(path.join(cwd,target,'edited.md'),'utf8'),'before edit');
});
test('personal installation and project root selection keep branding data local',async t=>{
  const cwd=project(t),home=project(t);fs.mkdirSync(path.join(cwd,'.git'));const nested=path.join(cwd,'packages/web');fs.mkdirSync(nested,{recursive:true});
  await onboarding({cwd:nested,agentArg:'codex'});assert.ok(fs.existsSync(path.join(cwd,'.agents/skills/tech-branding-logo/SKILL.md')));assert.equal(fs.existsSync(path.join(nested,'.agents')),false);
  await onboarding({cwd,home,installScope:'user',agentArg:'claude'});const ctx=context({cwd,home,installScope:'user'});
  assert.equal(JSON.parse(fs.readFileSync(ctx.manifestFile)).scope,'user');assert.ok(fs.existsSync(path.join(home,'.claude/skills/tech-branding-logo/SKILL.md')));assert.equal(fs.existsSync(path.join(home,'.branding')),false);
  await uninstall({cwd,home,installScope:'user'});assert.ok(fs.existsSync(path.join(cwd,'.agents/skills/tech-branding-logo/SKILL.md')));
});
test('manual target and shared host paths are supported without duplicate copies',async t=>{
  const cwd=project(t);await onboarding({cwd,agentArg:'codex,cursor'});assert.equal(read(cwd).installs.length,1);assert.deepEqual(read(cwd).installs[0].agents,['codex','cursor']);
  await onboarding({cwd,target:'custom/branding'});assert.ok(fs.existsSync(path.join(cwd,'custom/branding/SKILL.md')));
  await assert.rejects(onboarding({cwd,target:'../escape'}),/Unsafe|escapes/);await assert.rejects(onboarding({cwd,target:'.branding'}),/Target/);
});
test('untracked files require explicit identical adoption; preexisting directory survives removal',async t=>{
  const cwd=project(t),target=path.join(cwd,'skills/tech-branding-logo');fs.mkdirSync(target,{recursive:true});
  fs.writeFileSync(path.join(target,'SKILL.md'),payload().get('SKILL.md'));
  await assert.rejects(onboarding({cwd,agentArg:'generic'}),/Untracked file/);
  await onboarding({cwd,agentArg:'generic',adopt:true});await uninstall({cwd});assert.equal(fs.existsSync(target),true);
});
test('dry runs have no filesystem side effects',async t=>{
  const cwd=project(t);await onboarding({cwd,agentArg:'grok',dryRun:true});assert.deepEqual(fs.readdirSync(cwd),[]);
  await onboarding({cwd,agentArg:'grok'});const before=fs.readFileSync(context({cwd}).manifestFile);await uninstall({cwd,dryRun:true});assert.deepEqual(fs.readFileSync(context({cwd}).manifestFile),before);
});
test('legacy migration preserves modified files and recognizes unchanged legacy content',async t=>{
  const cwd=project(t);await onboarding({cwd,agentArg:'generic'});const ctx=context({cwd}),m=read(cwd);
  m.schemaVersion=1;m.installs[0].files=m.installs[0].files.map(f=>f.path);delete m.scope;fs.writeFileSync(ctx.manifestFile,JSON.stringify(m));
  await onboarding({cwd,update:true});assert.equal(read(cwd).schemaVersion,2);
});
test('tampered records and symlink escapes are rejected before removal',async t=>{
  const cwd=project(t),outside=project(t);await onboarding({cwd,agentArg:'generic'});const ctx=context({cwd}),m=read(cwd);const original=fs.readFileSync(ctx.manifestFile);
  m.installs[0].files[0].path='../outside';fs.writeFileSync(ctx.manifestFile,JSON.stringify(m));await assert.rejects(uninstall({cwd}),/Invalid|Unsafe/);
  fs.writeFileSync(ctx.manifestFile,original);const target=path.join(cwd,'skills/tech-branding-logo');fs.renameSync(target,path.join(cwd,'saved'));fs.symlinkSync(outside,target,process.platform==='win32'?'junction':'dir');
  await assert.rejects(uninstall({cwd}),/symlink/);assert.deepEqual(fs.readdirSync(outside),[]);
});
test('write failure rolls back every change and prior manifest',async t=>{
  const cwd=project(t);await assert.rejects(onboarding({cwd,agentArg:'generic',transactionOptions:{afterWrite:()=>{throw new Error('injected disk failure');}}}),/injected/);
  assert.equal(fs.existsSync(context({cwd}).manifestFile),false);assert.equal(fs.existsSync(path.join(cwd,'skills/tech-branding-logo')),false);
});
test('crashed transaction can be recovered and active lock cannot be stolen',t=>{
  const cwd=project(t),ctx=context({cwd});const moduleUrl=new URL('../cli/transaction.js',import.meta.url).href;
  const child=spawnSync(process.execPath,['--input-type=module','-e',`import {transact} from ${JSON.stringify(moduleUrl)};transact(${JSON.stringify(ctx)},['skills/test'],()=>[{path:'skills/test/file',bytes:Buffer.from('new')}],{afterWrite:()=>process.exit(42)});`],{encoding:'utf8'});
  assert.equal(child.status,42);assert.equal(fs.readFileSync(path.join(cwd,'skills/test/file'),'utf8'),'new');recoverInstallation({cwd});assert.equal(fs.existsSync(path.join(cwd,'skills/test/file')),false);
  fs.mkdirSync(`${ctx.manifestFile}.lock`);fs.writeFileSync(`${ctx.manifestFile}.lock/owner.json`,JSON.stringify({pid:process.pid}));assert.throws(()=>recoverInstallation({cwd}),/still active/);
});
test('recovery refuses edits made after interrupted operation',t=>{
  const cwd=project(t),ctx=context({cwd}),moduleUrl=new URL('../cli/transaction.js',import.meta.url).href;
  spawnSync(process.execPath,['--input-type=module','-e',`import {transact} from ${JSON.stringify(moduleUrl)};transact(${JSON.stringify(ctx)},['skills/test'],()=>[{path:'skills/test/file',bytes:Buffer.from('new')}],{afterWrite:()=>process.exit(42)});`]);
  fs.writeFileSync(path.join(cwd,'skills/test/file'),'user edit');assert.throws(()=>recoverInstallation({cwd}),/Recovery conflict/);assert.equal(fs.readFileSync(path.join(cwd,'skills/test/file'),'utf8'),'user edit');assert.ok(fs.existsSync(`${ctx.manifestFile}.journal`));
});
test('strict CLI parsing and unhealthy doctor status',t=>{
  assert.equal(parse(['install','--agent','grok','--global']).flags.global,true);assert.throws(()=>parse(['--globall']),/Unknown option/);assert.throws(()=>parse(['--agent']),/requires/);assert.throws(()=>parse(['--global','--install-scope=project']),/conflicts/);assert.throws(()=>parse(['update','--agent=codex']),/not supported/);assert.throws(()=>parse(['brief','--dry-run']),/not supported/);
  const cwd=project(t);assert.equal(spawnSync(process.execPath,[cli,'doctor'],{cwd}).status,1);assert.equal(spawnSync(process.execPath,[cli,'install'],{cwd}).status,1);
});
test('empty install lists fail doctor and unsafe journals cannot recover',async t=>{
  const cwd=project(t);await onboarding({cwd,agentArg:'generic'});const ctx=context({cwd}),m=read(cwd);m.installs=[];fs.writeFileSync(ctx.manifestFile,JSON.stringify(m));assert.equal(doctor({cwd}),false);
  fs.writeFileSync(`${ctx.manifestFile}.journal`,JSON.stringify({schemaVersion:1,targets:['skills/test'],createdDirs:[],operations:[{path:'../secret',before:null,after:null}]}));assert.throws(()=>recoverInstallation({cwd}),/Unsafe/);
});
test('legacy edits block update and survive uninstall without claiming ownership',async t=>{
  const cwd=project(t);await onboarding({cwd,agentArg:'generic'});const ctx=context({cwd}),m=read(cwd),file=path.join(cwd,m.installs[0].target,'SKILL.md');
  m.schemaVersion=1;m.installs[0].files=m.installs[0].files.map(f=>f.path);fs.writeFileSync(ctx.manifestFile,JSON.stringify(m));fs.appendFileSync(file,'\nlegacy user edit');
  await assert.rejects(onboarding({cwd,update:true}),/Modified file/);await uninstall({cwd});assert.match(fs.readFileSync(file,'utf8'),/legacy user edit/);
});
test('all targets are preflighted before a conflicting multi-target install changes files',async t=>{
  const cwd=project(t),bad=path.join(cwd,'.claude/skills/tech-branding-logo');fs.mkdirSync(bad,{recursive:true});fs.writeFileSync(path.join(bad,'SKILL.md'),'my workflow');
  await assert.rejects(onboarding({cwd,agentArg:'codex,claude'}),/Untracked file/);assert.equal(fs.existsSync(path.join(cwd,'.agents')),false);assert.equal(fs.readFileSync(path.join(bad,'SKILL.md'),'utf8'),'my workflow');
});
test('filesystem doctor catches a missing required reference',async t=>{
  const cwd=project(t);await onboarding({cwd,agentArg:'generic'});fs.unlinkSync(path.join(cwd,'skills/tech-branding-logo/references/qc.md'));assert.equal(doctor({cwd}),false);
});
test('explicit non-Git roots and platform-specific personal records resolve predictably',async t=>{
  const cwd=project(t),home=project(t),nested=path.join(cwd,'nested');fs.mkdirSync(nested);
  await onboarding({cwd,project:'nested',agentArg:'grok'});assert.ok(fs.existsSync(path.join(nested,'.grok/skills/tech-branding-logo/SKILL.md')));
  for(const [platform,record] of [['darwin','Library/Application Support'],['linux','.local/share'],['win32','AppData/Local']]) assert.ok(context({cwd,home,installScope:'user',platform}).record.startsWith(record));
});
test('Grok personal installation reuses a tracked Codex shared copy',async t=>{
  const cwd=project(t),home=project(t),opts={cwd,home,installScope:'user'};
  await onboarding({...opts,agentArg:'codex,grok,gemini'});const m=JSON.parse(fs.readFileSync(context(opts).manifestFile));assert.equal(m.installs.length,1);assert.deepEqual(m.installs[0].agents,['codex','grok','gemini']);assert.equal(fs.existsSync(path.join(home,'.grok')),false);
});
