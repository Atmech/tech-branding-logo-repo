import { onboarding, uninstall } from './install.js';
import { createBrief, resumeBrief } from './brief.js';
import { doctor } from './doctor.js';
import { exportBrand } from './export.js';

function parse(argv) {
  const positional = [];
  const flags = {};
  for (const arg of argv) {
    if (!arg.startsWith('--')) positional.push(arg);
    else {
      const [rawKey, ...rest] = arg.slice(2).split('=');
      flags[rawKey] = rest.length ? rest.join('=') : true;
    }
  }
  return { command: positional[0] || 'onboarding', flags };
}

function help() {
  console.log(`\nTech Branding & Logo\n\nUsage:\n  tech-branding-logo                 Run installation onboarding\n  tech-branding-logo onboarding      Install into detected IDE/agent environments\n  tech-branding-logo brief           Create persistent project context\n  tech-branding-logo resume          Resume an existing brand project\n  tech-branding-logo doctor          Verify installation and project state\n  tech-branding-logo update          Refresh known skill files safely\n  tech-branding-logo export          Export a portable brand-kit/\n  tech-branding-logo uninstall       Remove only installer-tracked files\n\nOptions:\n  --agent=codex,claude,cursor         Override auto-detected install targets\n  --mode=zero-to-brand               Set brief mode explicitly\n  --out=brand-kit                     Export destination\n  --dry-run                           Show planned install/uninstall changes\n  --force                             Refresh existing known skill files\n  --help                              Show this help\n\nOnboarding means installation/setup. Project discovery begins with \`brief\`.\n`);
}

export async function run(argv = []) {
  const { command, flags } = parse(argv);
  if (flags.help || command === 'help' || command === '--help') return help();
  const opts = {
    agentArg: typeof flags.agent === 'string' ? flags.agent : '',
    mode: typeof flags.mode === 'string' ? flags.mode : '',
    out: typeof flags.out === 'string' ? flags.out : 'brand-kit',
    dryRun: Boolean(flags['dry-run']),
    force: Boolean(flags.force),
  };

  switch (command) {
    case 'onboarding': return onboarding(opts);
    case 'install': return onboarding(opts);
    case 'update': return onboarding({ ...opts, force: true });
    case 'brief': return createBrief(opts);
    case 'resume': return resumeBrief(opts);
    case 'doctor': return doctor(opts);
    case 'export': return exportBrand(opts);
    case 'uninstall': return uninstall(opts);
    default:
      help();
      throw new Error(`Unknown command: ${command}`);
  }
}
