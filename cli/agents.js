import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const skill = 'tech-branding-logo';
const adapter = (label, base, markers, commands, personal = base, extra = {}) => ({ label, dir: `${base}/${skill}`, userDir: personal ? `${personal}/${skill}` : null, markers, commands, ...extra });
export const AGENTS = {
  codex: adapter('Codex', '.agents/skills', ['AGENTS.md', '.agents'], ['codex'], '.agents/skills', { invoke: 'Run /skills or mention $tech-branding-logo.' }),
  claude: adapter('Claude Code', '.claude/skills', ['CLAUDE.md', '.claude'], ['claude'], '.claude/skills', { invoke: 'Run /tech-branding-logo.' }),
  grok: adapter('Grok coding agent', '.grok/skills', ['.grok'], ['grok'], '.grok/skills', { sharedUser: '.agents/skills/tech-branding-logo', invoke: 'Run /tech-branding-logo. Grok Bot uses a separate skill library.' }),
  cursor: adapter('Cursor', '.cursor/skills', ['.cursor'], ['cursor'], '.cursor/skills', { sharedProject: '.agents/skills/tech-branding-logo', sharedUser: '.agents/skills/tech-branding-logo', invoke: 'Find tech-branding-logo in the / menu.' }),
  windsurf: adapter('Windsurf', '.windsurf/skills', ['.windsurf'], ['windsurf'], '.codeium/windsurf/skills', { invoke: 'Select tech-branding-logo in Cascade skills.' }),
  gemini: adapter('Gemini CLI', '.gemini/skills', ['GEMINI.md', '.gemini'], ['gemini'], '.gemini/skills', { sharedProject: '.agents/skills/tech-branding-logo', sharedUser: '.agents/skills/tech-branding-logo', invoke: 'Run /skills list and select tech-branding-logo.' }),
  generic: adapter('Manual / other agent', 'skills', [], [], null, { invoke: 'Explicitly load SKILL.md and its referenced files; automatic discovery is unverified.' }),
};
function commandExists(command) {
  return spawnSync(process.platform === 'win32' ? 'where' : 'which', [command], { stdio: 'ignore' }).status === 0;
}
export function detectAgents(cwd = process.cwd()) {
  return Object.entries(AGENTS).filter(([key, agent]) => key !== 'generic' && (agent.markers.some(marker=>fs.existsSync(path.join(cwd,marker))) || agent.commands.some(commandExists))).map(([key])=>key);
}
export function parseAgentList(value) {
  if (!value) return [];
  const keys=[...new Set(value.split(',').map(v=>v.trim().toLowerCase()).filter(Boolean))];
  if (!keys.length || keys.some(key=>!AGENTS[key])) throw new Error(`Unknown agent target(s): ${value}`);
  return keys;
}
