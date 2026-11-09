import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.md':'text/plain','.json':'application/json','.webm':'video/webm','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp'};
export function server(result){return createServer(async(req,res)=>{
 if(req.method==='POST'&&req.url==='/__result'&&result){let body='';for await(const chunk of req)body+=chunk;result(JSON.parse(body));res.end('ok');return;}
 if(req.url==='/'){res.writeHead(302,{Location:'/demo/index.html'});res.end();return;}
 let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);res.end('Invalid URL');return;}
 const path=resolve(root,'.'+(pathname==='/'?'/demo/index.html':pathname));
 if(!path.startsWith(root+'/')){res.writeHead(403);res.end();return;}
 try{res.setHeader('Content-Type',types[extname(path)]||'application/octet-stream');res.end(await readFile(path));}catch{res.writeHead(404);res.end('Not found');}
});}
if(process.argv[1]===new URL(import.meta.url).pathname)server().listen(4410,'127.0.0.1',()=>console.log('Prisma: http://127.0.0.1:4410/demo/index.html'));
