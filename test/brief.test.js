import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createBrief } from '../cli/brief.js';
import { defaultState } from '../cli/state.js';

function project(t) {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'branding-brief-'));
  t.after(() => fs.rmSync(cwd, { recursive: true, force: true }));
  return cwd;
}

for (const scope of ['brand-identity', 'campaign-direction', 'brand-application']) {
  test(`creates usable ${scope} context with two prompts`, async (t) => {
    const cwd = project(t);
    const supplied = ['Instagram campaign for oversized tees; college students should buy.', 'Keep our logo and exact garment photos.'];
    let calls = 0;
    const state = await createBrief({ cwd, scope, prompt: async () => supplied[calls++] });
    assert.equal(calls, 2);
    assert.equal(state.scope, scope);
    assert.equal(state.mode, scope === 'brand-identity' ? 'zero-to-brand' : null);
    assert.deepEqual(state.answers, { request: supplied[0], context: supplied[1] });
    const saved = JSON.parse(fs.readFileSync(path.join(cwd, '.branding/state.json')));
    assert.deepEqual(saved, state);
    const context = fs.readFileSync(path.join(cwd, '.branding/context.md'), 'utf8');
    for (const answer of supplied) assert.ok(context.includes(answer));
  });
}

test('legacy project is resumed byte-for-byte without asking or replacing decisions', async (t) => {
  const cwd = project(t);
  const dir = path.join(cwd, '.branding');
  fs.mkdirSync(dir);
  const legacy = defaultState('name-to-brand', 'Existing');
  delete legacy.scope;
  legacy.stage = 'refinement';
  legacy.completedStages = ['discovery', 'foundation'];
  legacy.custom = { approved: true };
  const files = { 'state.json': JSON.stringify(legacy), 'context.md': 'Original brief', 'decisions.md': 'Keep the wordmark', 'handoff.md': 'Resume refinement' };
  for (const [name, contents] of Object.entries(files)) fs.writeFileSync(path.join(dir, name), contents);
  const result = await createBrief({ cwd, scope: 'campaign-direction', prompt: () => { throw new Error('Unexpected repeated intake'); } });
  assert.deepEqual(result, legacy);
  for (const [name, contents] of Object.entries(files)) assert.equal(fs.readFileSync(path.join(dir, name), 'utf8'), contents);
});

test('invalid scope and identity-mode/campaign combination fail before writes or questions', async (t) => {
  const cwd = project(t);
  const prompt = () => { throw new Error('Unexpected intake'); };
  await assert.rejects(createBrief({ cwd, scope: 'unknown', prompt }), /Unknown scope/);
  await assert.rejects(createBrief({ cwd, scope: 'campaign-direction', mode: 'brand-evolution', prompt }), /applies only/);
  assert.equal(fs.existsSync(path.join(cwd, '.branding')), false);
});
