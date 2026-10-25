import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { assertTarget, fileBytes, hash, safePath, slash } from './safety.js';

const digest = value => value === null ? null : hash(value);
function atomic(root, rel, bytes) {
  const dest = safePath(root, rel);
  if (bytes === null) { if (fs.existsSync(dest)) fs.unlinkSync(dest); return; }
  fs.mkdirSync(path.dirname(dest), {recursive:true});
  const temporary = `${rel}.${randomUUID()}.tmp`;
  const file = safePath(root, temporary);
  try {
    const fd=fs.openSync(file,'wx');
    try { fs.writeFileSync(fd,bytes); fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
    fs.renameSync(file,dest);
  } finally { if (fs.existsSync(file)) fs.unlinkSync(file); }
}
function paths(ctx) {
  return { journal: `${ctx.record}.journal`, lock: `${ctx.record}.lock` };
}
function acquire(ctx, recovering) {
  const {lock}=paths(ctx), directory=safePath(ctx.root,lock);
  fs.mkdirSync(path.dirname(directory),{recursive:true});
  if (fs.existsSync(directory)) {
    if (!recovering) throw new Error('Another operation or an interrupted operation holds the install lock. Run recover after it stops.');
    const ownerFile=safePath(ctx.root,`${lock}/owner.json`);
    const owner=JSON.parse(fs.readFileSync(ownerFile,'utf8'));
    if (!Number.isInteger(owner.pid) || owner.pid < 1) throw new Error('Invalid lock owner; inspect it manually.');
    let alive=true;
    try {process.kill(owner.pid,0);} catch(e) {if(e.code==='ESRCH') alive=false;}
    if (alive) throw new Error('An installer process is still active; recovery refused.');
    fs.unlinkSync(ownerFile); fs.rmdirSync(directory);
  }
  fs.mkdirSync(directory);
  fs.writeFileSync(path.join(directory,'owner.json'),JSON.stringify({pid:process.pid}),{flag:'wx'});
  return ()=>{ fs.unlinkSync(safePath(ctx.root,`${lock}/owner.json`)); fs.rmdirSync(directory); };
}
function validateJournal(ctx, journal) {
  if (journal.schemaVersion!==1 || !Array.isArray(journal.targets) || !Array.isArray(journal.operations) || !Array.isArray(journal.createdDirs)) throw new Error('Invalid recovery journal.');
  for(const target of journal.targets) {assertTarget(target); safePath(ctx.root,target); if (target === path.posix.dirname(ctx.record) || path.posix.dirname(ctx.record).startsWith(`${target}/`)) throw new Error('Invalid journal target.');}
  const seen = new Set();
  for(const op of journal.operations) {
    if(seen.has(op.path)) throw new Error('Duplicate recovery operation.');
    seen.add(op.path);
    safePath(ctx.root,op.path);
    if(op.path!==ctx.record && !journal.targets.some(t=>op.path.startsWith(`${t}/`))) throw new Error('Invalid journal operation path.');
    for(const key of ['before','after']) if(op[key]!==null && (typeof op[key]!=='string' || Buffer.from(op[key],'base64').toString('base64')!==op[key])) throw new Error('Invalid journal content.');
  }
  for(const rel of journal.createdDirs) {
    safePath(ctx.root,rel);
    if(!journal.operations.some(op=>op.path.startsWith(`${rel}/`))) throw new Error('Invalid recovery directory.');
  }
  return journal;
}
function rollback(ctx, journal) {
  validateJournal(ctx,journal);
  // Preflight everything before reverting anything; retain the journal on a conflict.
  for (const op of journal.operations) {
    const current=digest(fileBytes(ctx.root,op.path));
    if(current!==digest(op.before===null?null:Buffer.from(op.before,'base64')) && current!==digest(op.after===null?null:Buffer.from(op.after,'base64'))) throw new Error(`Recovery conflict; preserve journal and inspect ${op.path}`);
  }
  for(const op of [...journal.operations].reverse()) atomic(ctx.root,op.path,op.before===null?null:Buffer.from(op.before,'base64'));
  for(const rel of [...journal.createdDirs].sort((a,b)=>b.length-a.length)) {
    const dir=safePath(ctx.root,rel);
    if(fs.existsSync(dir) && fs.readdirSync(dir).length===0) fs.rmdirSync(dir);
  }
}
export function pendingTransaction(ctx) {
  const p=paths(ctx);
  return fs.existsSync(safePath(ctx.root,p.journal)) || fs.existsSync(safePath(ctx.root,p.lock));
}
export function recover(ctx) {
  const release=acquire(ctx,true);
  try {
    const {journal}=paths(ctx), bytes=fileBytes(ctx.root,journal);
    if(bytes) {rollback(ctx,JSON.parse(bytes)); fs.unlinkSync(safePath(ctx.root,journal));}
  } finally {release();}
}
export function transact(ctx, targets, plan, {afterWrite} = {}) {
  const release=acquire(ctx,false);
  const journalPath=paths(ctx).journal;
  try {
    if(fs.existsSync(safePath(ctx.root,journalPath))) throw new Error('Interrupted transaction found. Run recover.');
    // Planning under the lock prevents competing installers from using stale ownership records.
    const operations=plan();
    const createdDirs=new Set();
    const ops=operations.map(op=>{
      const before=fileBytes(ctx.root,op.path);
      let dir=path.posix.dirname(op.path);
      while(dir!=='.' && !fs.existsSync(safePath(ctx.root,dir))) {createdDirs.add(slash(dir)); dir=path.posix.dirname(dir);}
      return {path:op.path,before:before===null?null:before.toString('base64'),after:op.bytes===null?null:op.bytes.toString('base64')};
    });
    const journal={schemaVersion:1,targets:typeof targets==='function'?targets():targets,createdDirs:[...createdDirs],operations:ops};
    validateJournal(ctx,journal);
    atomic(ctx.root,journalPath,Buffer.from(JSON.stringify(journal)));
    try {
      for(const [i,op] of operations.entries()) {
        const current=digest(fileBytes(ctx.root,op.path));
        const before=ops[i].before===null?null:Buffer.from(ops[i].before,'base64');
        if(current!==digest(before)) throw new Error(`File changed during installation: ${op.path}`);
        atomic(ctx.root,op.path,op.bytes); afterWrite?.(i);
      }
    } catch(e) {rollback(ctx,journal); fs.unlinkSync(safePath(ctx.root,journalPath)); throw e;}
    fs.unlinkSync(safePath(ctx.root,journalPath));
  } finally {release();}
}
