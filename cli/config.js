import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

export const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const metadata = JSON.parse(fs.readFileSync(path.join(packageRoot, 'package.json'), 'utf8'));
export const skillName = 'branded';
export const version = metadata.version;

export function projectRoot(cwd = process.cwd(), explicit) {
  if (explicit) {
    const root = path.resolve(cwd, explicit);
    if (!fs.statSync(root).isDirectory()) throw new Error('Project must be an existing directory.');
    return fs.realpathSync(root);
  }
  let current = fs.realpathSync(cwd);
  for (;;) {
    if (fs.existsSync(path.join(current, '.git'))) return current;
    const parent = path.dirname(current);
    if (parent === current) return fs.realpathSync(cwd);
    current = parent;
  }
}

export function context({ cwd = process.cwd(), project, installScope = 'project', home = os.homedir(), platform = process.platform } = {}) {
  if (!['project', 'user'].includes(installScope)) throw new Error('Installation scope must be project or user.');
  const workspace = projectRoot(cwd, project);
  const root = installScope === 'user' ? fs.realpathSync(home) : workspace;
  const data = platform === 'darwin' ? 'Library/Application Support' : platform === 'win32' ? 'AppData/Local' : '.local/share';
  const record = installScope === 'user' ? path.posix.join(data, skillName, 'install.json') : '.branded/install.json';
  return { root, workspace, scope: installScope, record, manifestFile: path.join(root, record) };
}

export function sourceProvenance() {
  const embedded=path.join(packageRoot,'build-source.json');
  if(fs.existsSync(embedded)) return JSON.parse(fs.readFileSync(embedded,'utf8'));
  if(fs.existsSync(path.join(packageRoot,'.git'))) {
    const result=spawnSync('git',['rev-parse','HEAD'],{cwd:packageRoot,encoding:'utf8'});
    const status=spawnSync('git',['status','--porcelain'],{cwd:packageRoot,encoding:'utf8'});
    if(result.status===0) return {revision:result.stdout.trim(),dirty:status.status!==0 || Boolean(status.stdout.trim())};
  }
  return {revision:process.env.BRANDED_SOURCE_REVISION||process.env.TBL_SOURCE_REVISION||'unrecorded-local-build',dirty:true};
}
