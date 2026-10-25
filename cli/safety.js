import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

export const hash = data => createHash('sha256').update(data).digest('hex');
export const slash = p => p.split(path.sep).join('/');
export function safePath(root, relative) {
  if (typeof relative !== 'string' || !relative || relative.includes('\\') || relative.includes('\0') || /[:\x00-\x1f]/.test(relative) || path.posix.isAbsolute(relative) || /^[a-z]:/i.test(relative) || relative.split('/').some(p => !p || p === '.' || p === '..')) throw new Error(`Unsafe relative path: ${relative}`);
  const full = path.resolve(root, relative);
  if (!full.startsWith(`${root}${path.sep}`)) throw new Error(`Path escapes installation root: ${relative}`);
  let current = root;
  if (fs.lstatSync(root).isSymbolicLink()) throw new Error('Installation root cannot be a symlink.');
  for (const part of relative.split('/')) {
    current = path.join(current, part);
    try {
      const stat = fs.lstatSync(current);
      if (stat.isSymbolicLink()) throw new Error(`Refusing symlink: ${current}`);
      if (current !== full && !stat.isDirectory()) throw new Error(`Parent is not a directory: ${current}`);
    } catch (e) { if (e.code !== 'ENOENT') throw e; }
  }
  return full;
}
export function fileBytes(root, relative) {
  const file = safePath(root, relative);
  try {
    if (!fs.statSync(file).isFile()) throw new Error(`Expected a file: ${relative}`);
    return fs.readFileSync(file);
  } catch (e) { if (e.code === 'ENOENT') return null; throw e; }
}
export function assertTarget(target) {
  if (typeof target !== 'string' || ['.branding', '.branded', '.tech-branding-logo', '.git'].some(p => target === p || target.startsWith(`${p}/`))) throw new Error('Target cannot contain branding state, Git data, or installer records.');
}
