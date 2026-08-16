import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export const AGENTS = {
  codex: { label: 'Codex / OpenAI', dir: '.agents/skills/tech-branding-logo', markers: ['AGENTS.md', '.agents'], commands: ['codex'] },
  claude: { label: 'Claude Code', dir: '.claude/skills/tech-branding-logo', markers: ['CLAUDE.md', '.claude'], commands: ['claude'] },
  cursor: { label: 'Cursor', dir: '.cursor/skills/tech-branding-logo', markers: ['.cursor'], commands: ['cursor'] },
  windsurf: { label: 'Windsurf', dir: '.windsurf/skills/tech-branding-logo', markers: ['.windsurf'], commands: ['windsurf'] },
  gemini: { label: 'Gemini CLI', dir: '.gemini/skills/tech-branding-logo', markers: ['.gemini'], commands: ['gemini'] },
  generic: { label: 'Generic agent', dir: 'skills/tech-branding-logo', markers: [], commands: [] },
};

function commandExists(command) {
  const finder = process.platform === 'win32' ? 'where' : 'which';
  return spawnSync(finder, [command], { stdio: 'ignore' }).status === 0;
}

export function detectAgents(cwd = process.cwd()) {
  return Object.entries(AGENTS)
    .filter(([key, agent]) => key !== 'generic' && (
      agent.markers.some((marker) => fs.existsSync(path.join(cwd, marker))) ||
      agent.commands.some(commandExists)
    ))
    .map(([key]) => key);
}

export function parseAgentList(value) {
  if (!value) return [];
  const requested = value.split(',').map((v) => v.trim().toLowerCase()).filter(Boolean);
  const unknown = requested.filter((key) => !AGENTS[key]);
  if (unknown.length) throw new Error(`Unknown agent target(s): ${unknown.join(', ')}`);
  return [...new Set(requested)];
}
