import { onboarding, uninstall, recoverInstallation } from './install.js';
import { createBrief, resumeBrief } from './brief.js';
import { doctor } from './doctor.js';
import { exportBrand } from './export.js';
import { projectRoot, version } from './config.js';

const valueFlags=new Set(['agent','install-scope','project','target','scope','mode','out']);
const booleanFlags=new Set(['dry-run','force','adopt','global','help','version']);
const commands=new Set(['install','onboarding','update','uninstall','recover','doctor','brief','resume','export','help']);
export function parse(argv) {
  const flags={}, positionals=[];
  for(let i=0;i<argv.length;i++) {
    const arg=argv[i];
    if(arg==='--') continue;
    if(!arg.startsWith('--')) {positionals.push(arg);continue;}
    const [key,...parts]=arg.slice(2).split('=');
    if(!valueFlags.has(key) && !booleanFlags.has(key)) throw new Error(`Unknown option --${key}`);
    if(key in flags) throw new Error(`Repeated option --${key}`);
    if(booleanFlags.has(key)) {if(parts.length) throw new Error(`--${key} does not take a value.`); flags[key]=true;}
    else {const value=parts.length?parts.join('='):argv[++i]; if(!value || value.startsWith('--')) throw new Error(`--${key} requires a value.`);flags[key]=value;}
  }
  if(positionals.length>1) throw new Error('Only one command is allowed.');
  const command=positionals[0]||'onboarding';
  if(!commands.has(command)) throw new Error(`Unknown command: ${command}`);
  if(flags.global && flags['install-scope'] && flags['install-scope']!=='user') throw new Error('--global conflicts with --install-scope=project.');
  if(flags['install-scope'] && !['user','project'].includes(flags['install-scope'])) throw new Error('--install-scope must be user or project.');
  const allowed={
    install:['agent','target','adopt','force','install-scope','global','dry-run'], onboarding:['agent','target','adopt','force','install-scope','global','dry-run'],
    update:['force','install-scope','global','dry-run'],uninstall:['install-scope','global','dry-run'], recover:['install-scope','global'],doctor:['install-scope','global'],
    brief:['scope','mode'],resume:[],export:['out'],help:[],
  };
  for(const key of Object.keys(flags)) if(!['help','version','project'].includes(key) && !allowed[command].includes(key)) throw new Error(`--${key} is not supported by ${command}.`);
  return {command,flags};
}
function help() {
  console.log(`Tech Branding & Logo ${version}

Commands:
  install / onboarding  Install the portable skill (default)
  update                Update saved targets; preserve local edits
  uninstall             Remove unchanged tracked files
  recover               Roll back an interrupted installation
  doctor                Check installed files; then verify in your host
  brief / resume        Create or resume project memory (optional)
  export                Export a brand kit

Installation options:
  --agent codex,claude,grok,cursor,windsurf,gemini,generic
  --install-scope project|user  This project / all local projects
  --global                      Alias for --install-scope=user
  --project <directory>         Explicit project, including non-Git folders
  --target <directory>          Manual target inside project or home
  --adopt                       Track an existing identical payload
  --dry-run                     Preview install, update or uninstall
  --force                       Compatibility flag; never overwrites edits

Branding options:
  --scope brand-identity|campaign-direction|brand-application
  --mode zero-to-brand|name-to-brand|brand-evolution
  --out <directory>             Export destination

Both --key=value and --key value work. Noninteractive installation requires
--agent or --target. Personal installation does not sync to cloud sessions.
Grok Bot uses its own skill library; see docs/COMPATIBILITY.md.`);
}
export async function run(argv=[]) {
  const {command,flags}=parse(argv);
  if(flags.help || command==='help') return help();
  if(flags.version) {console.log(version);return;}
  const opts={agentArg:flags.agent||'',installScope:flags.global?'user':flags['install-scope'],project:flags.project,target:flags.target,adopt:Boolean(flags.adopt),force:Boolean(flags.force),dryRun:Boolean(flags['dry-run']),mode:flags.mode||'',scope:flags.scope||'',out:flags.out||'brand-kit'};
  switch(command) {
    case 'onboarding':case 'install':return onboarding(opts);
    case 'update':return onboarding({...opts,update:true});
    case 'uninstall':return uninstall(opts);
    case 'recover':return recoverInstallation(opts);
    case 'doctor': {const result=doctor(opts);if(!result) process.exitCode=1;return result;}
    case 'brief':return createBrief({...opts,cwd:projectRoot(process.cwd(),flags.project)});
    case 'resume':return resumeBrief({...opts,cwd:projectRoot(process.cwd(),flags.project)});
    case 'export':return exportBrand({...opts,cwd:projectRoot(process.cwd(),flags.project)});
  }
}
