import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const tty = Boolean(input.isTTY && output.isTTY);
const c = {
  bold: (s) => tty ? `\x1b[1m${s}\x1b[0m` : s,
  dim: (s) => tty ? `\x1b[2m${s}\x1b[0m` : s,
  green: (s) => tty ? `\x1b[32m${s}\x1b[0m` : s,
  yellow: (s) => tty ? `\x1b[33m${s}\x1b[0m` : s,
};

export function intro(subtitle = 'AI-native branding for technology products') {
  console.log(`\n${c.bold('Tech Branding & Logo')}\n${c.dim(subtitle)}\n`);
}

export function ok(message) { console.log(`${c.green('✓')} ${message}`); }
export function warn(message) { console.log(`${c.yellow('!')} ${message}`); }
export function info(message) { console.log(`  ${message}`); }
export function section(message) { console.log(`\n${c.bold(message)}`); }

export async function ask(question, { required = false, defaultValue = '' } = {}) {
  if (!tty) return defaultValue;
  const rl = readline.createInterface({ input, output });
  try {
    while (true) {
      const suffix = defaultValue ? ` (${defaultValue})` : '';
      const value = (await rl.question(`${question}${suffix}\n> `)).trim() || defaultValue;
      if (!required || value) return value;
      warn('Please enter a value.');
    }
  } finally {
    rl.close();
  }
}

export async function choose(question, options, defaultIndex = 0) {
  if (!tty) return options[defaultIndex].value;
  console.log(question);
  options.forEach((option, i) => console.log(`  ${i === defaultIndex ? '›' : ' '} ${i + 1}. ${option.label}`));
  const answer = await ask('Choose', { defaultValue: String(defaultIndex + 1) });
  const index = Math.max(0, Math.min(options.length - 1, Number.parseInt(answer, 10) - 1 || 0));
  return options[index].value;
}

export async function confirm(question, defaultYes = true) {
  const value = (await ask(`${question} ${defaultYes ? '[Y/n]' : '[y/N]'}`, { defaultValue: defaultYes ? 'y' : 'n' })).toLowerCase();
  return value === 'y' || value === 'yes';
}
