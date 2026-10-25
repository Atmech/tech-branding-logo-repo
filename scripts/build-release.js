import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { metadata, packageRoot, skillName, version, sourceProvenance } from '../cli/config.js';
import { payload, payloadDigest } from '../cli/payload.js';
import { hash } from '../cli/safety.js';
import { zip } from './zip.js';

export function buildRelease(out=path.join(packageRoot,'dist'), {pack=true}={}) {
  fs.mkdirSync(out,{recursive:true});
  const files=payload(), plain=new Map([...files].map(([name,bytes])=>[`${skillName}/${name}`,bytes]));
  const plugin=new Map([...files].map(([name,bytes])=>[`skills/${skillName}/${name}`,bytes]));
  const identity={name:skillName,version,description:metadata.description,author:{name:'Atmech'},homepage:'https://github.com/Atmech/tech-branding-logo-repo',repository:'https://github.com/Atmech/tech-branding-logo-repo',license:'MIT'};
  const openai=JSON.parse(fs.readFileSync(path.join(packageRoot,'plugins/openai-interface.json'),'utf8'));
  const json=value=>Buffer.from(`${JSON.stringify(value,null,2)}\n`);
  plugin.set('plugin.json',json({$schema:'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json',...identity,extensions:{'com.openai':{interface:openai}}}));
  plugin.set('.codex-plugin/plugin.json',json({...identity,skills:'./skills/',interface:openai}));
  plugin.set('.claude-plugin/plugin.json',json({...identity,skills:'./skills/'}));
  plugin.set('LICENSE',files.get('LICENSE'));
  plugin.set('INSTALL.md',Buffer.from('# Install Tech Branding & Logo\n\nSee docs/NATIVE_INSTALL.md for native installation and docs/COMPATIBILITY.md for host checks.\n'));
  for(const name of fs.readdirSync(path.join(packageRoot,'docs')).sort()) plugin.set(`docs/${name}`,fs.readFileSync(path.join(packageRoot,'docs',name)));
  plugin.set('PLUGIN_PUBLISHING.md',fs.readFileSync(path.join(packageRoot,'PLUGIN_PUBLISHING.md')));
  fs.writeFileSync(path.join(out,`${skillName}-${version}-skill.zip`),zip(plain));
  fs.writeFileSync(path.join(out,`${skillName}-${version}-plugin.zip`),zip(plugin));
  const source=sourceProvenance();
  if(pack) {
    if(!process.env.npm_execpath) throw new Error('Run npm run build:release so npm can package the CLI.');
    const staging=fs.mkdtempSync(path.join(os.tmpdir(),'tbl-package-'));
    try {
      for(const entry of ['package.json','package-lock.json',...metadata.files.filter(p=>p!=='build-source.json')]) {
        const src=path.join(packageRoot,entry);
        if(fs.existsSync(src)) fs.cpSync(src,path.join(staging,entry),{recursive:true});
      }
      fs.writeFileSync(path.join(staging,'build-source.json'),json(source));
      const packed=spawnSync(process.execPath,[process.env.npm_execpath,'pack','--ignore-scripts','--json','--cache',path.join(staging,'.npm-cache'),'--pack-destination',path.resolve(out)],{cwd:staging,encoding:'utf8'});
      if(packed.status!==0) throw new Error(packed.stderr||'npm pack failed');
    } finally {fs.rmSync(staging,{recursive:true,force:true});}
  }
  const names=[`${skillName}-${version}-skill.zip`,`${skillName}-${version}-plugin.zip`,...(pack?[`${skillName}-${version}.tgz`]:[])];
  const release={version,sourceRevision:source.revision,sourceDirty:source.dirty,payloadDigest:payloadDigest(files),hostVerification:'Documentation and filesystem tests only; see docs/COMPATIBILITY.md for host checks.',artifacts:names.map(name=>({name,sha256:hash(fs.readFileSync(path.join(out,name)))}))};
  fs.writeFileSync(path.join(out,'release.json'),json(release));
  fs.writeFileSync(path.join(out,'SHA256SUMS'),[...release.artifacts,{name:'release.json',sha256:hash(fs.readFileSync(path.join(out,'release.json')))}].map(a=>`${a.sha256}  ${a.name}`).join('\n')+'\n');
  return release;
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) console.log(JSON.stringify(buildRelease(),null,2));
