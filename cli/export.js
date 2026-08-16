import fs from 'node:fs';
import path from 'node:path';
import { intro, ok, info } from './ui.js';
import { ensureDir, statePaths } from './state.js';

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

export function exportBrand({ cwd = process.cwd(), out = 'brand-kit' } = {}) {
  intro('Export');
  const paths = statePaths(cwd);
  if (!fs.existsSync(paths.state)) throw new Error('No brand project found. Run `tech-branding-logo brief` first.');
  const dest = path.resolve(cwd, out);
  ensureDir(dest);

  for (const file of ['context.md', 'state.json', 'decisions.md', 'handoff.md']) {
    const src = path.join(paths.root, file);
    if (fs.existsSync(src)) fs.copyFileSync(src, path.join(dest, file));
  }
  copyDir(paths.outputs, path.join(dest, 'outputs'));
  copyDir(paths.inputs, path.join(dest, 'inputs'));

  fs.writeFileSync(path.join(dest, 'README.md'), '# Brand kit\n\nExported by Tech Branding & Logo.\n\n- `context.md` — original project context\n- `decisions.md` — decision trail and rejected directions\n- `state.json` — machine-readable project status\n- `outputs/` — generated brand artifacts\n- `inputs/` — source assets used during the project\n');
  ok(`Exported to ${path.relative(cwd, dest) || '.'}`);
  info('This export is portable; the working .branding/ directory remains untouched.');
  return dest;
}
