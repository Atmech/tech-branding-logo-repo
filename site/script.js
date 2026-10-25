const agentSelect = document.querySelector('#install-agent');
const scopeSelect = document.querySelector('#install-scope');
const commandOutput = document.querySelector('#install-command');
const copyStatus = document.querySelector('#copy-status');
const projectPaths = { codex: '.agents/skills', claude: '.claude/skills', grok: '.grok/skills', cursor: '.cursor/skills', windsurf: '.windsurf/skills', gemini: '.gemini/skills', generic: 'skills' };
const personalPaths = { codex: '.agents/skills', claude: '.claude/skills', grok: '.grok/skills', cursor: '.cursor/skills', windsurf: '.codeium/windsurf/skills', gemini: '.gemini/skills' };
function updateInstall() {
  if (!agentSelect || !scopeSelect || !commandOutput) return;
  // Generic has no automatic personal discovery path in the CLI.
  const userOption = scopeSelect.querySelector('option[value="user"]');
  userOption.disabled = agentSelect.value === 'generic';
  if (userOption.disabled) scopeSelect.value = 'project';
  const scope = scopeSelect.value;
  commandOutput.textContent = `node /path/to/tech-branding-logo-repo/bin/branded.js install --agent ${agentSelect.value}${scope === 'user' ? ' --install-scope user' : ''}`;
  const relative = (scope === 'user' ? personalPaths : projectPaths)[agentSelect.value];
  const detail = document.querySelector('#install-detail');
  detail.textContent = `${scope === 'user' ? 'Personal skill: ~/' : 'Project skill: '}${relative}/branded. Project memory stays in .branding/.`;
  if (agentSelect.value === 'grok') detail.textContent += ' Grok Bot uses a separate skill library.';
  if (agentSelect.value === 'generic') detail.textContent += ' Load SKILL.md explicitly; automatic discovery is unverified.';
  copyStatus.textContent = '';
}
agentSelect?.addEventListener('change', updateInstall);
scopeSelect?.addEventListener('change', updateInstall);
document.querySelector('#copy-install')?.addEventListener('click', async () => {
  const command = commandOutput.textContent;
  try {
    await navigator.clipboard.writeText(command);
    copyStatus.textContent = 'Copied. Replace the checkout path before running.';
  } catch {
    const range = document.createRange();
    range.selectNodeContents(commandOutput);
    const selection = window.getSelection();
    selection.removeAllRanges(); selection.addRange(range);
    copyStatus.textContent = 'Command selected. Copy it with your keyboard.';
  }
});
updateInstall();
