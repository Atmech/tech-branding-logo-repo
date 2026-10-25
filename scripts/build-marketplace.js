import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { packageRoot } from '../cli/config.js';
import { pluginFiles } from './plugin-package.js';

export function buildMarketplace({ check = false, destination = path.join(packageRoot, 'plugins/branded') } = {}) {
  const files = pluginFiles();
  files.set('GENERATED.md', Buffer.from('# Generated branded plugin\n\nDo not edit this bundle directly. Edit the canonical root skill, metadata or guides, then run `npm run build:marketplace`. Release ZIPs use the same source. CI rejects stale or unexpected files.\n'));
  const existing = [];
  function walk(dir, prefix = '') {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const name = `${prefix}${entry.name}`;
      if (entry.isSymbolicLink()) throw new Error(`Unexpected symlink in generated plugin: ${name}`);
      if (entry.isDirectory()) walk(path.join(dir, entry.name), `${name}/`);
      else existing.push(name);
    }
  }
  walk(destination);
  if (check) {
    for (const [name, bytes] of files) {
      const full = path.join(destination, name);
      if (!fs.existsSync(full) || !fs.readFileSync(full).equals(bytes)) throw new Error(`Stale plugin bundle: ${name}. Run npm run build:marketplace.`);
    }
    for (const name of existing) if (!files.has(name)) throw new Error(`Unexpected plugin bundle file: ${name}`);
  } else {
    // This path is a generated, version-controlled bundle, never an installed user skill.
    for (const name of existing) if (!files.has(name)) fs.unlinkSync(path.join(destination, name));
    for (const [name, bytes] of files) {
      const full = path.join(destination, name);
      fs.mkdirSync(path.dirname(full), { recursive: true });
      fs.writeFileSync(full, bytes);
    }
  }
  return files;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const files = buildMarketplace({ check: process.argv.includes('--check') });
  console.log(`${process.argv.includes('--check') ? 'Verified' : 'Built'} repository plugin: ${files.size} files.`);
}
