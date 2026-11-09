import {cp,mkdir,writeFile,rm} from 'node:fs/promises';
// Only public site assets, runtime source, and documentation enter the Pages artifact.
await rm('site-dist',{recursive:true,force:true});
await mkdir('site-dist',{recursive:true});
for(const entry of ['performance','demo','src','docs','documentation','README.md','LICENSE','ASSETS.md']){
 await cp(entry,`site-dist/${entry}`,{recursive:true,filter:path=>!/^demo\/[^/]+\.(jpg|png)$/.test(path)});
}
await writeFile('site-dist/.nojekyll','');
await writeFile('site-dist/index.html','<!doctype html><html lang="en"><meta charset="utf-8"><title>Prisma — Media effects</title><meta http-equiv="refresh" content="0;url=demo/index.html"><link rel="canonical" href="https://mmaxence.github.io/prisma/demo/index.html"><a href="demo/index.html">Open Prisma</a></html>');
console.log('Built GitHub Pages site in site-dist/');
