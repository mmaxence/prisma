import {build,version} from 'esbuild';
import {gzipSync,brotliCompressSync} from 'node:zlib';
import {writeFile} from 'node:fs/promises';
const bundles=[];
for(const [name,exports] of [['Film grain',['createEffect','noise']],['Cinematic',['createEffect','zoomIn','noise','rgbSplit']],['All effects',['*']]]){
 const result=await build({stdin:{contents:`export ${exports[0]==='*'?'*':'{'+exports.join(',')+'}'} from './src/index.js';`,resolveDir:process.cwd()},bundle:true,minify:true,format:'esm',target:'es2020',write:false});
 const bytes=result.outputFiles[0].contents;bundles.push({name,bytes:bytes.length,gzip:gzipSync(bytes,{level:9}).length,brotli:brotliCompressSync(bytes).length});
}
const report={tool:`esbuild ${version}`,target:'es2020',format:'esm',minified:true,units:'bytes',runtimeDependencies:0,bundles};
await writeFile('performance/sizes.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
