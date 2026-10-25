import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { buildRelease } from '../scripts/build-release.js';
import { payload } from '../cli/payload.js';
import { hash } from '../cli/safety.js';
import { version } from '../cli/config.js';
function python(args) {
  for(const name of (process.platform==='win32'?['python','python3']:['python3','python'])) {const result=spawnSync(name,args,{encoding:'utf8'});if(!result.error) return result;}
  throw new Error('Python 3 is required for independent archive verification in development/CI.');
}
test('built ZIPs are deterministic, valid and contain the full canonical payload',t=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'tbl-zip-test-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
  const release=buildRelease(dir,{pack:false});
  const zip=path.join(dir,`tech-branding-logo-${version}-skill.zip`),first=fs.readFileSync(zip);
  buildRelease(dir,{pack:false});assert.deepEqual(fs.readFileSync(zip),first);
  const extracted=path.join(dir,'extracted');fs.mkdirSync(extracted);
  const result=python(['-c','import zipfile,sys; z=zipfile.ZipFile(sys.argv[1]); assert z.testzip() is None; z.extractall(sys.argv[2])',zip,extracted]);assert.equal(result.status,0,result.stderr);
  for(const [name,bytes] of payload()) assert.deepEqual(fs.readFileSync(path.join(extracted,'tech-branding-logo',name)),bytes,name);
  const pluginZip=path.join(dir,`tech-branding-logo-${version}-plugin.zip`),plugin=path.join(dir,'plugin');fs.mkdirSync(plugin);
  const pluginResult=python(['-c','import zipfile,sys; z=zipfile.ZipFile(sys.argv[1]); assert z.testzip() is None; z.extractall(sys.argv[2])',pluginZip,plugin]);assert.equal(pluginResult.status,0,pluginResult.stderr);
  for(const manifest of ['plugin.json','.codex-plugin/plugin.json','.claude-plugin/plugin.json']) {const data=JSON.parse(fs.readFileSync(path.join(plugin,manifest),'utf8'));assert.equal(data.version,version);assert.equal(data.name,'tech-branding-logo');}
  for(const [name,bytes] of payload()) assert.deepEqual(fs.readFileSync(path.join(plugin,'skills/tech-branding-logo',name)),bytes,name);
  for(const artifact of release.artifacts) assert.equal(hash(fs.readFileSync(path.join(dir,artifact.name))),artifact.sha256);
});
test('npm tarball installs and verifies using only its packaged contents',t=>{
  assert.ok(process.env.npm_execpath,'Run npm test for package verification.');
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'tbl-tar-test-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
  buildRelease(dir);const extract=path.join(dir,'unpacked');fs.mkdirSync(extract);
  const result=python(['-c','import tarfile,sys; t=tarfile.open(sys.argv[1]); assert all(n.name.startswith("package/") and ".." not in n.name.split("/") and not n.issym() and not n.islnk() for n in t); t.extractall(sys.argv[2])',path.join(dir,`tech-branding-logo-${version}.tgz`),extract]);assert.equal(result.status,0,result.stderr);
  const pack=path.join(extract,'package');assert.equal(fs.existsSync(path.join(pack,'test')),false);assert.equal(fs.existsSync(path.join(pack,'site')),false);
  assert.ok(fs.existsSync(path.join(pack,'agents/openai.yaml')));assert.ok(fs.existsSync(path.join(pack,'build-source.json')));
  const project=path.join(dir,'project');fs.mkdirSync(project);const cli=path.join(pack,'bin/tech-branding-logo.js');
  for(const args of [['install','--agent','codex,cursor,grok'],['doctor'],['update'],['uninstall']]) {
    const proc=spawnSync(process.execPath,[cli,...args],{cwd:project,encoding:'utf8'});assert.equal(proc.status,0,`${args.join(' ')}\n${proc.stdout}\n${proc.stderr}`);
  }
  assert.equal(fs.existsSync(path.join(project,'.agents/skills/tech-branding-logo/SKILL.md')),false);
});
