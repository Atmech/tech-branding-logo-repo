import fs from 'node:fs';
import path from 'node:path';
import { metadata, packageRoot, skillName, version } from '../cli/config.js';
import { payload } from '../cli/payload.js';

// One source for release ZIPs and the checked-in repository marketplace bundle.
export function pluginFiles() {
  const files = payload();
  const plugin = new Map([...files].map(([name, bytes]) => [`skills/${skillName}/${name}`, bytes]));
  const identity = { name: skillName, version, description: metadata.description, author: { name: 'Atmech' }, homepage: 'https://github.com/Atmech/tech-branding-logo-repo', repository: 'https://github.com/Atmech/tech-branding-logo-repo', license: 'MIT' };
  const openai = JSON.parse(fs.readFileSync(path.join(packageRoot, 'plugins/openai-interface.json'), 'utf8'));
  const json = value => Buffer.from(`${JSON.stringify(value, null, 2)}\n`);
  plugin.set('plugin.json', json({ $schema: 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json', ...identity, extensions: { 'com.openai': { interface: openai } } }));
  plugin.set('.codex-plugin/plugin.json', json({ ...identity, skills: './skills/', interface: openai }));
  plugin.set('.claude-plugin/plugin.json', json({ ...identity, skills: './skills/' }));
  for (const name of ['branded-icon.png', 'branded-logo.svg']) plugin.set(`assets/${name}`, files.get(`assets/${name}`));
  plugin.set('LICENSE', files.get('LICENSE'));
  plugin.set('INSTALL.md', Buffer.from('# Install branded\n\nInstall branded from the repository marketplace in Codex or Claude Code. See docs/QUICKSTART.md for one-line installation and docs/NATIVE_INSTALL.md for native plugin controls.\n'));
  for (const name of fs.readdirSync(path.join(packageRoot, 'docs')).filter(name => name.endsWith('.md')).sort()) plugin.set(`docs/${name}`, fs.readFileSync(path.join(packageRoot, 'docs', name)));
  plugin.set('PLUGIN_PUBLISHING.md', fs.readFileSync(path.join(packageRoot, 'PLUGIN_PUBLISHING.md')));
  return plugin;
}
