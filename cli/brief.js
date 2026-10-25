import fs from 'node:fs';
import { ask, intro, ok, section } from './ui.js';
import { defaultState, ensureDir, statePaths, writeJson, readJson } from './state.js';

const MODE_OPTIONS = [
  { value: 'zero-to-brand', label: 'Starting from scratch' },
  { value: 'name-to-brand', label: 'I already have a name' },
  { value: 'brand-evolution', label: 'Rebranding something existing' },
];

const SCOPES = ['brand-identity', 'campaign-direction', 'brand-application'];

export async function createBrief({ cwd = process.cwd(), mode: modeArg = '', scope: scopeArg = '', prompt = ask } = {}) {
  intro('Project brief — context for the branding skill');
  const paths = statePaths(cwd);
  // A new intake must never overwrite an existing project's decisions or progress.
  if (fs.existsSync(paths.state)) return resumeBrief({ cwd });
  const scope = scopeArg || 'brand-identity';
  if (!SCOPES.includes(scope)) throw new Error(`Unknown scope: ${scope}`);
  if (modeArg && !MODE_OPTIONS.some(({ value }) => value === modeArg)) throw new Error(`Unknown mode: ${modeArg}`);
  if (modeArg && scope !== 'brand-identity') throw new Error('--mode applies only to brand-identity; use --scope for campaigns or applications.');
  const mode = scope === 'brand-identity' ? (modeArg || 'zero-to-brand') : null;

  section('A short starting brief; your agent will infer details and ask only what is missing');
  const answers = {
    request: await prompt('What are we making, and what do you want people to do after seeing it?', { required: true }),
  };
  answers.context = await prompt('Anything else to add: existing assets, references or fixed requirements? (optional)');
  ensureDir(paths.root); ensureDir(paths.inputs); ensureDir(paths.outputs);
  fs.writeFileSync(paths.context, `# Brand project\n\nScope hint: ${scope}\nIdentity mode hint: ${mode || 'not applicable'}\n\n## Request\n\n${answers.request || '_Not supplied_'}\n\n## Additional context\n\n${answers.context || '_Not supplied_'}\n\nUser context, not branding conclusions. Infer scope and relevant expertise from the actual request.\n`);
  fs.writeFileSync(paths.handoff, `# Agent handoff\n\nUse the installed branded skill. Read context.md, state.json and decisions.md in .branding before starting. Infer scope and domain from the request; initial CLI scope/mode are hints. Preserve approved decisions and resume the recorded stage. Ask only consequential unanswered questions, usually 1–3 and at most five at once. An answer may supply several fields. Begin when enough is known; label assumptions for fast drafts. Keep campaign overrides and outputs separate from the master identity. Update state without deleting unknown fields.\n`);
  if (!fs.existsSync(paths.decisions)) fs.writeFileSync(paths.decisions, '# Decisions and rejected directions\n\n');
  const state = defaultState(mode, '', scope);
  state.answers = answers;
  writeJson(paths.state, state);
  ok('Created .branding context, state and handoff');
  console.log('Open your agent and say: "Read .branding/handoff.md and continue the brand project."');
  return state;
}

export function resumeBrief({ cwd = process.cwd() } = {}) {
  intro('Resume');
  const paths = statePaths(cwd);
  const state = readJson(paths.state);
  if (!state) throw new Error('No .branding/state.json found. Run `branded brief` first.');
  console.log(`Project: ${state.projectName || 'Unnamed'}\nScope: ${state.scope || 'brand-identity'}\nMode: ${state.mode || 'not applicable'}\nCurrent stage: ${state.stage}\n`);
  if (state.completedStages?.length) console.log(`Completed: ${state.completedStages.join(', ')}\n`);
  console.log('Open your agent and say:');
  console.log('  "Read .branding/handoff.md and .branding/state.json, then resume from the current stage."');
  return state;
}
