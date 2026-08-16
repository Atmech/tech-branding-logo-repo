import fs from 'node:fs';
import path from 'node:path';
import { intro, ok, warn, info } from './ui.js';
import { installManifestPath, readJson, statePaths } from './state.js';

export function doctor({ cwd = process.cwd() } = {}) {
  intro('Doctor — verify the skill is actually usable');
  let healthy = true;
  const manifest = readJson(installManifestPath(cwd));
  if (!manifest) {
    warn('No install manifest found. Run onboarding first.');
    healthy = false;
  } else {
    ok(`Install manifest found (${manifest.version || 'unknown version'})`);
    for (const install of manifest.installs || []) {
      const skill = path.join(cwd, install.target, 'SKILL.md');
      const refs = path.join(cwd, install.target, 'references');
      if (fs.existsSync(skill)) ok(`${install.agent}: SKILL.md visible at ${install.target}`);
      else { warn(`${install.agent}: SKILL.md missing at ${install.target}`); healthy = false; }
      if (fs.existsSync(refs) && fs.readdirSync(refs).length) ok(`${install.agent}: references present`);
      else { warn(`${install.agent}: references missing`); healthy = false; }
    }
  }

  const paths = statePaths(cwd);
  if (fs.existsSync(paths.state)) {
    const state = readJson(paths.state);
    ok(`Brand project state found: ${state.projectName || 'Unnamed'} (${state.stage || 'unknown stage'})`);
    if (fs.existsSync(paths.handoff)) ok('Agent handoff found');
    else { warn('.branding/handoff.md is missing'); healthy = false; }
  } else {
    info('No brand project yet — that is fine. Run `tech-branding-logo brief` when needed.');
  }

  console.log(healthy ? '\nReady.' : '\nSome checks need attention. Re-run onboarding with --force if the install is incomplete.');
  return healthy;
}
