import { installAgents, installCommand, nativePluginCommand } from './install-options.js';

const agentSelect = document.querySelector('#install-agent');
const commandOutput = document.querySelector('#install-command');
const copyStatus = document.querySelector('#copy-status');
function updateInstall() {
  if (!agentSelect || !commandOutput) return;
  const agent = agentSelect.value;
  commandOutput.textContent = installCommand(agent);
  document.querySelector('#project-install-command').textContent = installCommand(agent, { project: true });
  document.querySelector('#install-detail').textContent = `Installs for all projects. ${installAgents[agent].prompt}`;
  copyStatus.textContent = '';
}
async function copyCommand(id, status) {
  const element = document.getElementById(id);
  try {
    await navigator.clipboard.writeText(element.textContent);
    status.textContent = 'Copied. Paste into your terminal.';
  } catch {
    const range = document.createRange();
    range.selectNodeContents(element);
    const selection = window.getSelection();
    selection.removeAllRanges(); selection.addRange(range);
    status.textContent = 'Command selected. Copy it with your keyboard.';
  }
}
agentSelect?.addEventListener('change', updateInstall);
document.querySelector('#copy-install')?.addEventListener('click', () => copyCommand('install-command', copyStatus));
for (const button of document.querySelectorAll('[data-copy]')) {
  button.addEventListener('click', () => copyCommand(button.dataset.copy, document.getElementById(button.dataset.copy === 'project-install-command' ? 'project-copy-status' : 'native-copy-status')));
}
for (const agent of ['codex', 'claude']) {
  const element = document.getElementById(`native-${agent}`);
  if (element) element.textContent = nativePluginCommand(agent);
}
updateInstall();
