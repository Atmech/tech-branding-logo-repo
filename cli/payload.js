import fs from 'node:fs';
import path from 'node:path';
import { packageRoot, skillName } from './config.js';
import { hash, safePath } from './safety.js';

export const payloadEntries = ['SKILL.md', 'references', 'schemas', 'templates', 'agents', 'assets', 'LICENSE'];
export function payload(root = packageRoot) {
  const files = new Map();
  function walk(rel) {
    const full = safePath(root, rel);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) for (const name of fs.readdirSync(full).sort()) walk(`${rel}/${name}`);
    else if (stat.isFile()) files.set(rel, fs.readFileSync(full));
    else throw new Error(`Unsupported payload entry: ${rel}`);
  }
  for (const entry of payloadEntries) walk(entry);
  const skill = files.get('SKILL.md').toString();
  if (!skill.startsWith('---\n') || !skill.includes(`\nname: ${skillName}\n`) || !/\ndescription: \S/.test(skill)) throw new Error('Invalid skill frontmatter.');
  for (const [name, bytes] of files) {
    if (name.endsWith('.json')) JSON.parse(bytes.toString());
    if (name.endsWith('.md')) {
      for (const match of bytes.toString().matchAll(/`((?:references|schemas|templates|agents)\/[a-zA-Z0-9_./-]+\.(?:md|json|yaml))`/g)) {
        if (!files.has(match[1])) throw new Error(`Missing payload reference in ${name}: ${match[1]}`);
      }
    }
  }
  return files;
}
export function payloadDigest(files) {
  return hash([...files].sort(([a],[b])=>a<b?-1:a>b?1:0).map(([name, bytes])=>`${name}\0${hash(bytes)}`).join('\n'));
}
