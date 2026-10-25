import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { packageRoot } from '../cli/config.js';
import { payload } from '../cli/payload.js';
import { pluginFiles } from '../scripts/plugin-package.js';
import { buildMarketplace } from '../scripts/build-marketplace.js';
import { installAgents, installCommand, nativePluginCommand } from '../site/install-options.js';
import { AGENTS } from '../cli/agents.js';
import { parse } from '../cli/index.js';

test('one-line website commands target real adapters and retain scope without a checkout path', () => {
  for (const [agent, display] of Object.entries(installAgents)) {
    assert.ok(AGENTS[agent], agent);
    assert.equal(`${display.directory}/branded`, AGENTS[agent].userDir);
    for (const project of [false, true]) {
      const command = installCommand(agent, { project });
      assert.ok(command.startsWith('npx -y github:Atmech/tech-branding-logo-repo#'));
      assert.ok(!command.includes('/path/to/'));
      const parsed = parse(command.split(' ').slice(3));
      assert.equal(parsed.flags.agent, agent);
      assert.equal(Boolean(parsed.flags.global), !project);
    }
  }
  assert.throws(() => installCommand('generic'), /supported agent/);
  assert.throws(() => installCommand('constructor'), /supported agent/);
  assert.throws(() => nativePluginCommand('cursor'), /Codex and Claude/);
});

test('both repository catalogs resolve the same plugin and complete canonical skill', () => {
  const codex = JSON.parse(fs.readFileSync(path.join(packageRoot, '.agents/plugins/marketplace.json')));
  const claude = JSON.parse(fs.readFileSync(path.join(packageRoot, '.claude-plugin/marketplace.json')));
  assert.equal(codex.name, claude.name);
  assert.equal(codex.plugins[0].source.path, claude.plugins[0].source);
  assert.equal(codex.plugins[0].name, 'branded');
  const folder = path.resolve(packageRoot, codex.plugins[0].source.path);
  const files = buildMarketplace({ check: true, destination: folder });
  for (const [name, bytes] of payload()) assert.deepEqual(files.get(`skills/branded/${name}`), bytes, name);
  for (const manifest of ['plugin.json', '.codex-plugin/plugin.json', '.claude-plugin/plugin.json']) {
    assert.equal(JSON.parse(files.get(manifest)).name, codex.plugins[0].name);
  }
  const rootManifest = JSON.parse(files.get('plugin.json'));
  for (const key of ['logo', 'composerIcon']) assert.ok(files.has(rootManifest.extensions['com.openai'].interface[key].replace(/^\.\//, '')));
  for (const [name, bytes] of pluginFiles()) assert.deepEqual(files.get(name), bytes, name);
});

test('repository plugin drift check rejects edits and unexpected files', t => {
  const destination = fs.mkdtempSync(path.join(os.tmpdir(), 'branded-plugin-drift-'));
  t.after(() => fs.rmSync(destination, { recursive: true, force: true }));
  buildMarketplace({ destination });
  const skill = path.join(destination, 'skills/branded/SKILL.md');
  fs.appendFileSync(skill, '\nlocal edit');
  assert.throws(() => buildMarketplace({ check: true, destination }), /Stale plugin/);
  buildMarketplace({ destination });
  fs.writeFileSync(path.join(destination, 'unexpected.txt'), 'unexpected');
  assert.throws(() => buildMarketplace({ check: true, destination }), /Unexpected plugin/);
});
