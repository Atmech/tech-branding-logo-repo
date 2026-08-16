import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { AGENTS, detectAgents, parseAgentList } from './agents.js';
import { ask, choose, confirm, intro, info, ok, section, warn } from './ui.js';
import { ensureDir, installManifestPath, readJson, writeJson } from './state.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(here, '..');
const skillFiles = ['SKILL.md', 'references'];

function copyRecursive(src, dest, createdFiles) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    ensureDir(dest);
    for (const entry of fs.readdirSync(src)) copyRecursive(path.join(src, entry), path.join(dest, entry), createdFiles);
    return;
  }
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
  createdFiles.push(dest);
}

function relative(cwd, p) { return path.relative(cwd, p) || '.'; }

export async function onboarding({ cwd = process.cwd(), agentArg = '', force = false, dryRun = false } = {}) {
  intro('Onboarding — install once, use from your agent');
  const detected = detectAgents(cwd);
  let targets = parseAgentList(agentArg);

  if (!targets.length && detected.length) {
    section('Detected');
    detected.forEach((key) => ok(AGENTS[key].label));
    info('I’ll install into the detected environments. Use --agent=... to override.');
    targets = detected;
  }

  if (!targets.length) {
    const selected = await choose('I could not confidently detect an agent. Where should I install?', [
      ...Object.entries(AGENTS).map(([value, agent]) => ({ value, label: agent.label })),
    ]);
    targets = [selected];
  }

  const existingManifest = readJson(installManifestPath(cwd));
  if (existingManifest && !force) {
    warn('This project already has a Tech Branding & Logo install manifest.');
    if (!(await confirm('Update the existing installation?', true))) return existingManifest;
    force = true;
  }

  section(dryRun ? 'Plan' : 'Installing');
  const installs = [];
  for (const key of targets) {
    const target = path.join(cwd, AGENTS[key].dir);
    const existedBefore = fs.existsSync(target);
    if (existedBefore && !force) {
      warn(`${AGENTS[key].label}: ${relative(cwd, target)} already exists; skipped (use --force to update known skill files).`);
      continue;
    }

    info(`${AGENTS[key].label} → ${relative(cwd, target)}`);
    if (dryRun) continue;

    const createdFiles = [];
    for (const entry of skillFiles) copyRecursive(path.join(packageRoot, entry), path.join(target, entry), createdFiles);
    installs.push({ agent: key, target: relative(cwd, target), createdDirectory: !existedBefore, files: createdFiles.map((f) => relative(cwd, f)) });
    ok(`${AGENTS[key].label} ready`);
  }

  if (dryRun) {
    info('No files changed.');
    return { dryRun: true, targets };
  }

  const manifest = {
    schemaVersion: 1,
    package: 'tech-branding-logo',
    version: '1.0.0',
    installedAt: new Date().toISOString(),
    cwd,
    installs,
  };
  writeJson(installManifestPath(cwd), manifest);

  console.log('\nReady. Next, create a project brief when you actually want to brand something:');
  console.log('  npx tech-branding-logo brief');
  console.log('\nOr open your agent and say:');
  console.log('  "Use tech-branding-logo for this product."');
  return manifest;
}

export async function uninstall({ cwd = process.cwd(), dryRun = false } = {}) {
  intro('Uninstall');
  const file = installManifestPath(cwd);
  const manifest = readJson(file);
  if (!manifest) throw new Error('No install manifest found in this project. Nothing was removed.');

  for (const install of manifest.installs || []) {
    const target = path.join(cwd, install.target);
    if (install.createdDirectory) {
      info(`${dryRun ? 'Would remove' : 'Removing'} ${install.target}`);
      if (!dryRun && fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: true });
    } else {
      for (const rel of install.files || []) {
        const p = path.join(cwd, rel);
        info(`${dryRun ? 'Would remove' : 'Removing'} ${rel}`);
        if (!dryRun && fs.existsSync(p)) fs.rmSync(p, { force: true });
      }
    }
  }
  if (!dryRun) {
    fs.rmSync(path.dirname(file), { recursive: true, force: true });
    ok('Removed only files tracked by the install manifest.');
  }
}
