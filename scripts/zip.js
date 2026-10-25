// Deterministic, uncompressed ZIP writer. No platform archive executable is needed.
import { Buffer } from 'node:buffer';
function crc32(bytes) {
  let crc=0xffffffff;
  for(const byte of bytes) {crc^=byte;for(let i=0;i<8;i++) crc=(crc>>>1)^((crc&1)?0xedb88320:0);}
  return (crc^0xffffffff)>>>0;
}
export function zip(files) {
  const entries=[...files].sort(([a],[b])=>a<b?-1:a>b?1:0), local=[],central=[];
  let offset=0,centralSize=0;
  if(entries.length>65535) throw new Error('ZIP64 is not supported.');
  for(const [name,data] of entries) {
    if(name.startsWith('/') || name.includes('\\') || name.split('/').some(p=>!p || p==='..')) throw new Error('Unsafe archive path.');
    const filename=Buffer.from(name),bytes=Buffer.from(data),crc=crc32(bytes);
    const header=Buffer.alloc(30); header.writeUInt32LE(0x04034b50);header.writeUInt16LE(20,4);header.writeUInt16LE(0x800,6);header.writeUInt16LE(33,12);header.writeUInt32LE(crc,14);header.writeUInt32LE(bytes.length,18);header.writeUInt32LE(bytes.length,22);header.writeUInt16LE(filename.length,26);
    local.push(header,filename,bytes);
    const record=Buffer.alloc(46);record.writeUInt32LE(0x02014b50);record.writeUInt16LE(20,4);record.writeUInt16LE(20,6);record.writeUInt16LE(0x800,8);record.writeUInt16LE(33,14);record.writeUInt32LE(crc,16);record.writeUInt32LE(bytes.length,20);record.writeUInt32LE(bytes.length,24);record.writeUInt16LE(filename.length,28);record.writeUInt32LE(offset,42);
    central.push(record,filename);centralSize+=record.length+filename.length;offset+=header.length+filename.length+bytes.length;
  }
  const end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(entries.length,8);end.writeUInt16LE(entries.length,10);end.writeUInt32LE(centralSize,12);end.writeUInt32LE(offset,16);
  return Buffer.concat([...local,...central,end]);
}
