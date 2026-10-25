// The current branded preview is pinned while the rename/identity stack awaits merge.
// Switch to a reviewed tag (or remove the ref for main) after that stack lands.
export const distribution = {
  repository: 'Atmech/tech-branding-logo-repo',
  skillRef: '6359f0a',
  marketplaceRef: 'codex/easy-install',
  marketplace: 'branded',
};
export const installAgents = {
  codex: { label: 'Codex', directory: '.agents/skills', prompt: 'Mention $branded in your next chat.' },
  claude: { label: 'Claude Code', directory: '.claude/skills', prompt: 'Use /branded in a new Claude Code session.' },
  cursor: { label: 'Cursor', directory: '.cursor/skills', prompt: 'Find branded in the / menu.' },
  grok: { label: 'Grok coding agent', directory: '.grok/skills', prompt: 'Use /branded. Grok Bot has a separate skill library.' },
  gemini: { label: 'Gemini CLI', directory: '.gemini/skills', prompt: 'Use /skills list and select branded.' },
  windsurf: { label: 'Windsurf', directory: '.codeium/windsurf/skills', projectDirectory: '.windsurf/skills', prompt: 'Select branded in Cascade skills.' },
};
export function installCommand(agent = 'codex', { project = false } = {}) {
  if (!Object.hasOwn(installAgents, agent)) throw new Error('Choose a supported agent.');
  return `npx -y github:${distribution.repository}#${distribution.skillRef} --agent ${agent}${project ? '' : ' --global'}`;
}
export function nativePluginCommand(agent) {
  const source = distribution.repository;
  if (agent === 'codex') return `codex plugin marketplace add ${source} --ref ${distribution.marketplaceRef} && codex plugin add branded@${distribution.marketplace}`;
  if (agent === 'claude') return `claude plugin marketplace add ${source}#${distribution.marketplaceRef} && claude plugin install branded@${distribution.marketplace}`;
  throw new Error('Native plugin setup is supported for Codex and Claude Code.');
}
