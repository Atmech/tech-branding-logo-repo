import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { onboarding, uninstall } from '../cli/install.js';
import { doctor } from '../cli/doctor.js';

function tempProject() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'branded-'));
}

test('generic onboarding installs the skill and doctor passes', async () => {
  const cwd = tempProject();
  await onboarding({ cwd, agentArg: 'generic' });
  assert.ok(fs.existsSync(path.join(cwd, 'skills/branded/SKILL.md')));
  assert.ok(fs.existsSync(path.join(cwd, 'skills/branded/references')));
  for (const file of ['domains/technology.md', 'domains/food-hospitality.md', 'domains/real-estate.md', 'domains/fashion-apparel.md', 'overlays/b2b.md', 'campaign-direction.md', 'brand-application.md']) {
    assert.ok(fs.existsSync(path.join(cwd, 'skills/branded/references', file)), file);
  }
  assert.equal(doctor({ cwd }), true);
});

test('uninstall removes only the installer-created skill directory', async () => {
  const cwd = tempProject();
  fs.writeFileSync(path.join(cwd, 'keep.txt'), 'mine');
  await onboarding({ cwd, agentArg: 'generic' });
  await uninstall({ cwd });
  assert.equal(fs.existsSync(path.join(cwd, 'skills/branded')), false);
  assert.equal(fs.readFileSync(path.join(cwd, 'keep.txt'), 'utf8'), 'mine');
});
