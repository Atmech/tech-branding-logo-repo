#!/usr/bin/env node

import { run } from '../cli/index.js';

run(process.argv.slice(2)).catch((error) => {
  console.error(`\n✗ ${error.message}`);
  if (process.env.DEBUG) console.error(error.stack);
  process.exitCode = 1;
});
