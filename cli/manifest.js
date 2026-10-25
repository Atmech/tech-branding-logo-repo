import path from 'node:path';
import { AGENTS } from './agents.js';
import { assertTarget, fileBytes, hash, safePath } from './safety.js';
import { skillName } from './config.js';

export function validateManifest(value, ctx) {
  if (!value || ![1, 2].includes(value.schemaVersion) || value.package !== skillName || typeof value.version !== 'string' || !Array.isArray(value.installs)) throw new Error('Invalid install manifest.');
  if (value.schemaVersion === 2 && ['installedAt','updatedAt','sourceRevision'].some(key=>typeof value[key]!=='string' || !value[key])) throw new Error('Invalid manifest metadata.');
  if (value.schemaVersion === 2 && (value.scope !== ctx.scope || typeof value.payloadDigest !== 'string' || !/^[a-f0-9]{64}$/.test(value.payloadDigest))) throw new Error('Invalid manifest scope or payload digest.');
  const seen = new Set();
  for (const install of value.installs) {
    if (!install || !(AGENTS[install.agent] || install.agent === 'custom') || typeof install.createdDirectory !== 'boolean' || !Array.isArray(install.files) || !install.files.length) throw new Error('Invalid installation record.');
    assertTarget(install.target); safePath(ctx.root, install.target);
    const metadataDir = path.posix.dirname(ctx.record).replaceAll(path.sep, '/');
    if (install.target === metadataDir || install.target.startsWith(`${metadataDir}/`) || metadataDir.startsWith(`${install.target}/`)) throw new Error('Target overlaps installer records.');
    for (const other of seen) if (install.target === other || install.target.startsWith(`${other}/`) || other.startsWith(`${install.target}/`)) throw new Error('Overlapping installation targets.');
    seen.add(install.target);
    if(install.directories !== undefined && (!Array.isArray(install.directories) || install.directories.some(rel=>typeof rel!=='string' || !(rel===install.target || rel.startsWith(`${install.target}/`))))) throw new Error('Invalid owned directory.');
    for(const rel of install.directories||[]) safePath(ctx.root,rel);
    if(install.agents !== undefined && (!Array.isArray(install.agents) || install.agents.some(key=>!(AGENTS[key] || key==='custom')))) throw new Error('Invalid host aliases.');
    const paths = new Set();
    for (const entry of install.files) {
      const rel = value.schemaVersion === 1 ? entry : entry?.path;
      if (typeof rel !== 'string' || !rel.startsWith(`${install.target}/`) || paths.has(rel)) throw new Error('Invalid or duplicate owned file.');
      safePath(ctx.root, rel); paths.add(rel);
      if (value.schemaVersion === 2 && (!/^[a-f0-9]{64}$/.test(entry.hash) || entry.owned !== true)) throw new Error('Invalid file ownership hash.');
    }
  }
  return value;
}
export function loadManifest(ctx) {
  const bytes = fileBytes(ctx.root, ctx.record);
  return bytes ? validateManifest(JSON.parse(bytes), ctx) : null;
}
export function migrateManifest(manifest, files) {
  if (!manifest || manifest.schemaVersion === 2) return manifest;
  return { ...manifest, schemaVersion: 2, installs: manifest.installs.map(install => ({
    ...install,
    files: install.files.flatMap(rel => {
      const name = rel.slice(install.target.length + 1);
      // Legacy records have no historical hashes. Only current payload content is safe to recognize.
      return files.has(name) ? [{ path: rel, hash: hash(files.get(name)), owned: true }] : [];
    }),
  })) };
}
