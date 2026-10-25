import fs from 'node:fs';
import path from 'node:path';
import { version } from './config.js';

export const BRANDING_DIR = '.branding';
export const INSTALL_DIR = '.tech-branding-logo';

export function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }
export function readJson(file) { return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null; }
export function writeJson(file, value) { ensureDir(path.dirname(file)); fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`); }

export function statePaths(cwd = process.cwd()) {
  const root = path.join(cwd, BRANDING_DIR);
  return {
    root,
    state: path.join(root, 'state.json'),
    context: path.join(root, 'context.md'),
    decisions: path.join(root, 'decisions.md'),
    handoff: path.join(root, 'handoff.md'),
    inputs: path.join(root, 'inputs'),
    outputs: path.join(root, 'outputs'),
  };
}

export function installManifestPath(cwd = process.cwd()) {
  return path.join(cwd, INSTALL_DIR, 'install.json');
}

export function defaultState(mode, projectName = '', scope = 'brand-identity') {
  return {
    schemaVersion: 1,
    skill: 'tech-branding-logo',
    skillVersion: version,
    scope,
    mode,
    domains: [],
    overlays: [],
    projectName,
    stage: 'discovery',
    completedStages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
