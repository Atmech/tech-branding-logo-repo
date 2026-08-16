import fs from 'node:fs';
import path from 'node:path';
import { ask, choose, intro, ok, section } from './ui.js';
import { defaultState, ensureDir, statePaths, writeJson, readJson } from './state.js';

const MODE_OPTIONS = [
  { value: 'zero-to-brand', label: 'Starting from scratch' },
  { value: 'name-to-brand', label: 'I already have a name' },
  { value: 'brand-evolution', label: 'Rebranding something existing' },
];

const COMMON = [
  ['product', 'What are you building or branding?'],
  ['audience', 'Who is it mainly for?'],
  ['job', 'What job/problem does it solve for them?'],
  ['alternatives', 'What do people use instead today?'],
  ['difference', 'What makes your approach meaningfully different?'],
];

const QUESTIONS = {
  'zero-to-brand': [
    ...COMMON,
    ['desiredFeeling', 'What should the brand make people feel?'],
    ['antiFeeling', 'What should it absolutely not feel like?'],
    ['future', 'Where might the product/company expand in the next 2–5 years?'],
    ['constraints', 'Any market, accessibility, technical, or visual constraints?'],
  ],
  'name-to-brand': [
    ['name', 'What is the existing name?'],
    ...COMMON,
    ['nameOrigin', 'Why was the name chosen, if there is a real reason?'],
    ['nameFixed', 'How fixed is the name: final, strongly preferred, or still reconsiderable?'],
    ['existingMeaning', 'Does the name already mean anything to customers?'],
    ['desiredFeeling', 'What should the name and identity come to represent?'],
    ['constraints', 'Any pronunciation, spelling, market, technical, or visual constraints?'],
  ],
  'brand-evolution': [
    ['name', 'What is the current product/company name?'],
    ...COMMON,
    ['whyNow', 'Why are you changing the brand now?'],
    ['working', 'What parts of the current identity are working or recognized?'],
    ['failing', 'Where does the current identity fail?'],
    ['mustKeep', 'What, if anything, must survive the rebrand?'],
    ['desiredShift', 'What perception should change after the rebrand?'],
    ['assets', 'Where are the current assets/guidelines/screenshots located?'],
  ],
};

function markdown(mode, answers) {
  const title = answers.name || answers.product || 'Brand project';
  const rows = Object.entries(answers).map(([key, value]) => `## ${key}\n\n${value || '_Unknown / to be clarified by the agent_'}\n`).join('\n');
  return `# ${title}\n\nMode: \`${mode}\`\n\nThis file captures user context, not branding conclusions. The agent must use the installed Tech Branding & Logo skill for methodology and ask only additional questions that could materially change the direction.\n\n${rows}`;
}

function handoff(mode, answers) {
  const project = answers.name || answers.product || 'this project';
  return `# Agent handoff\n\nUse the installed \`tech-branding-logo\` skill in \`${mode}\` mode for **${project}**.\n\nRead \`.branding/context.md\` and \`.branding/state.json\` first. Treat those files as user context, not as branding conclusions. Continue discovery adaptively: ask only questions whose answers could materially change positioning, naming, identity direction, rebrand scope, or constraints. Surface contradictions instead of forcing a questionnaire.\n\nOnce context is sufficient, summarize the brief, state assumptions and unresolved risks, update \`.branding/state.json\`, and proceed through the skill's staged methodology. Preserve decisions and rejected directions in \`.branding/decisions.md\`.\n`;
}

export async function createBrief({ cwd = process.cwd(), mode: modeArg = '' } = {}) {
  intro('Project brief — context for the branding skill');
  const mode = modeArg || await choose('What are we doing?', MODE_OPTIONS);
  if (!QUESTIONS[mode]) throw new Error(`Unknown mode: ${mode}`);

  section('A few high-leverage questions');
  const answers = {};
  for (const [key, question] of QUESTIONS[mode]) answers[key] = await ask(question, { required: ['product', 'name', 'audience'].includes(key) });

  const paths = statePaths(cwd);
  ensureDir(paths.root); ensureDir(paths.inputs); ensureDir(paths.outputs);
  fs.writeFileSync(paths.context, markdown(mode, answers));
  fs.writeFileSync(paths.handoff, handoff(mode, answers));
  if (!fs.existsSync(paths.decisions)) fs.writeFileSync(paths.decisions, '# Decisions and rejected directions\n\n');
  const state = defaultState(mode, answers.name || answers.product || '');
  state.contextCompleteness = Object.values(answers).filter(Boolean).length / Object.keys(answers).length;
  state.answers = answers;
  writeJson(paths.state, state);

  ok('Created .branding/context.md');
  ok('Created .branding/state.json');
  ok('Created .branding/handoff.md');
  console.log('\nOpen your agent and say:');
  console.log('  "Read .branding/handoff.md and continue the brand project."');
  return state;
}

export function resumeBrief({ cwd = process.cwd() } = {}) {
  intro('Resume');
  const paths = statePaths(cwd);
  const state = readJson(paths.state);
  if (!state) throw new Error('No .branding/state.json found. Run `tech-branding-logo brief` first.');
  console.log(`Project: ${state.projectName || 'Unnamed'}\nMode: ${state.mode}\nCurrent stage: ${state.stage}\n`);
  if (state.completedStages?.length) console.log(`Completed: ${state.completedStages.join(', ')}\n`);
  console.log('Open your agent and say:');
  console.log('  "Read .branding/handoff.md and .branding/state.json, then resume from the current stage."');
  return state;
}
