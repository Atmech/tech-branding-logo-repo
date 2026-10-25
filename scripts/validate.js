import { payload, payloadDigest } from '../cli/payload.js';
const files=payload();
console.log(`Validated ${files.size} skill files. SHA-256: ${payloadDigest(files)}`);
