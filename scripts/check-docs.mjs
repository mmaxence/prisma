import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {build} from 'esbuild';
const read=file=>readFile(file,'utf8');
const pkg=JSON.parse(await read('package.json'));
assert.equal(pkg.name,'@prisma-fx/media');assert.equal(pkg.version,'0.1.0-alpha.1');assert.equal(pkg.sideEffects,false);assert(!pkg.dependencies);
const readme=await read('README.md'),types=await read('src/index.d.ts');
const controller=types.split('export interface Controller {')[1].split('readonly stats:')[0];
const methods=[...controller.matchAll(/(\w+)\([^)]*\): void/g)].map(x=>x[1]);
for(const name of methods)assert(readme.includes(name+'('),'missing method '+name);
const snippets=[...readme.matchAll(/```js\n([\s\S]*?)```/g)];
for(const [,contents]of snippets)await build({stdin:{contents,resolveDir:process.cwd()},bundle:true,write:false,format:'esm',logLevel:'silent'});
for(const name of ['README.md','agent-guide.md']){
 const text=await read(name);
 for(const [,target]of text.matchAll(/\]\(([^)]+)\)/g))if(!target.includes('://')&&!target.startsWith('#'))await stat(new URL(target,new URL('../'+name,import.meta.url)));
}
const source=await read('src/index.js');const effectNames=[...source.matchAll(/default as (\w+) } from/g)].map(x=>x[1]);assert.equal(effectNames.length,25);
const example=await read('examples/media/index.html'),map=JSON.parse(example.match(/<script type="importmap">([\s\S]*?)<\/script>/)[1]);
for(const target of Object.values(map.imports))await stat(new URL(target,new URL('../examples/media/index.html',import.meta.url)));
assert(!/fonts\.googleapis|stillwater|https?:\/\//.test(example),'example must use local media and system fonts');
assert.deepEqual(await readFile('examples/media/motion.webm'),await readFile('test/motion.webm'),'synthetic video copy drifted');
const built=await read('site-dist/examples/media/main.js');assert.equal(built,await read('examples/media/main.js'));
for(const rel of ['README.md','agent-guide.md','src/index.d.ts','src/core.js','examples/media/index.html','examples/media/style.css','examples/media/pattern.svg','ASSETS.md'])assert.equal(await read('site-dist/'+rel),await read(rel),rel+' built-site mismatch');
for(const file of ['index.html','main.js','definitions.js','style.css','product.svg','portrait.svg'])assert.equal(await read('site-dist/examples/recipes/'+file),await read('examples/recipes/'+file));
assert.equal(await read('site-dist/docs/recipes.md'),await read('docs/recipes.md'));
const recipeGuide=await read('docs/recipes.md');for(const key of ['Product hero','Editorial image','Video cover','Gallery card','Before/after','Portrait treatment','Ambient media','Media in spatial panels'])assert(recipeGuide.includes(key),key);
console.log(JSON.stringify({pass:true,version:pkg.version,documentedControllerMethods:methods.length,compiledReadmeSnippets:snippets.length,effects:effectNames.length,localAndBuiltExample:true,syntheticVideoCopy:true,recipeCases:8}));
