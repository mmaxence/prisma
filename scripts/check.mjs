import {server} from './serve.mjs';
import {spawn} from 'node:child_process';
import {writeFileSync,mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import './size.mjs';
const reduced=process.argv.includes('reduced');
let done;const result=new Promise(r=>done=r),srv=server(done);await new Promise(r=>srv.listen(0,'127.0.0.1',r));
const profile=mkdtempSync(tmpdir()+'/prisma-check-');
const child=spawn(process.env.CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',[...(reduced?['--force-prefers-reduced-motion']:[]),'--headless=new','--no-first-run','--no-sandbox','--disable-gpu','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required','--user-data-dir='+profile,`http://127.0.0.1:${srv.address().port}/test/${reduced?'reduced':'browser'}.html`],{stdio:'ignore'});
let timer;
try{const report=await Promise.race([result,new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('Browser tests timed out')),60000);child.on('error',reject);})]);writeFileSync(reduced?'test/reduced-results.json':'test/results.json',JSON.stringify(report,null,2));for(const r of report.results)console.log((r.pass?'PASS ':'FAIL ')+r.name+(r.pass?'':' '+JSON.stringify(r.detail)));if(report.results.some(x=>!x.pass))process.exitCode=1;else console.log('ok');}
finally{clearTimeout(timer);child.kill('SIGKILL');srv.close();setTimeout(()=>rmSync(profile,{recursive:true,force:true,maxRetries:3,retryDelay:200}),500);}
