import {cp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
// Only public site assets, runtime source, and documentation enter the Pages artifact.
await rm('site-dist',{recursive:true,force:true});
await mkdir('site-dist',{recursive:true});
for(const entry of ['performance','demo','src','docs','documentation','README.md','LICENSE','ASSETS.md','llms.txt','agent-guide.md','sitemap.xml']){
 await cp(entry,`site-dist/${entry}`,{recursive:true,filter:path=>!/^demo\/[^/]+\.(jpg|png)$/.test(path)});
}
await writeFile('site-dist/.nojekyll','');
const landing=await readFile('demo/index.html','utf8');
await writeFile('site-dist/index.html',landing.replace('<head>','<head><base href="./demo/">'));
const exports=await readFile('src/index.js','utf8');
const effects=[...exports.matchAll(/default as (\w+) } from '([^']+)'/g)].map(([,name,path])=>({name,module:new URL(path,'https://mmaxence.github.io/prisma/src/index.js').href}));
const catalog=await Promise.all(effects.map(async entry=>{const effect=(await import('../src/effects/'+entry.name+'.js')).default;return {...entry,title:effect.title,family:effect.family,description:effect.description,useCase:effect.useCase};}));
const escape=value=>String(value).replace(/[&<>"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[char]));
const docs=await readFile('documentation/index.html','utf8');
await writeFile('site-dist/documentation/index.html',docs.replace('<div id="effect-reference"></div>','<div id="effect-reference">'+catalog.map(effect=>`<article class="reference-card"><h3>${escape(effect.title)}</h3><code>${escape(effect.name)}</code><p>${escape(effect.description)}</p></article>`).join('')+'</div>').replace('<script type="module" src="reference.js"></script>',''));
await writeFile('site-dist/effects.json',JSON.stringify({name:'Living Frame',alternateName:'Prisma',version:'0.1.0-alpha.1',effects:catalog},null,2)+'\n');

console.log('Built GitHub Pages site in site-dist/');
