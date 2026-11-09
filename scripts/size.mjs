import {readFileSync,readdirSync} from 'node:fs';
import {gzipSync} from 'node:zlib';
const core=readFileSync('src/core.js');
const all=Buffer.concat([core,readFileSync('src/index.js'),...readdirSync('src/effects').filter(x=>x.endsWith('.js')).map(x=>readFileSync('src/effects/'+x))]);
console.log(JSON.stringify({coreGzip:gzipSync(core).length,allSourceGzip:gzipSync(all).length,allSourceBytes:all.length},null,2));
if(gzipSync(all).length>12000)throw new Error('12 KB gzip budget exceeded');
