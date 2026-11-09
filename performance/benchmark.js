import {createEffect,noise,zoomIn,rgbSplit,duotone,halftone,tiltShift,retroTv} from '../src/index.js';
const scenarios=[
 {name:'Film grain',effects:[noise]},
 {name:'Cinematic · 3 layers',effects:[zoomIn,noise,rgbSplit]},
 {name:'Mixed · 6 layers',effects:[zoomIn,duotone,halftone,noise,rgbSplit,tiltShift]},
 {name:'Tilt-shift',effects:[tiltShift]},
 {name:'Video · 3 layers',effects:[zoomIn,retroTv,noise],video:true}
];
const frame=()=>new Promise(resolve=>requestAnimationFrame(resolve));
const percentile=(values,p)=>{const ordered=[...values].sort((a,b)=>a-b);return +ordered[Math.floor((ordered.length-1)*p)].toFixed(3);};
export async function benchmark(host,{onProgress=()=>{},signal}={}){
 let fx,media,renderError,interruptions=0;
 const visibility=()=>{if(document.hidden)interruptions++;};
 const check=()=>{if(renderError)throw renderError;if(matchMedia('(prefers-reduced-motion: reduce)').matches)throw new Error('Animation benchmark requires reduced motion to be disabled.');if(signal?.aborted)throw new Error('Benchmark stopped.');if(document.hidden||interruptions)throw new Error('Benchmark interrupted: keep this tab visible and run again.');};
 document.addEventListener('visibilitychange',visibility);
 const report={schema:1,measuredAt:new Date().toISOString(),userAgent:navigator.userAgent,hardwareConcurrency:navigator.hardwareConcurrency,devicePixelRatio,renderer:'unavailable',protocol:{warmupFrames:30,sampleFrames:120,source:'Bundled orbital JPEG / Alpine WebM',note:'Frame intervals measure browser scheduling, not GPU execution. CPU submission excludes asynchronous GPU work. Narrow viewport runs use this same desktop device.'},runs:[]};
 try{
  for(const size of [{width:960,height:540,pixelRatio:1},{width:390,height:480,pixelRatio:1.5}])for(const scenario of scenarios){
   check();onProgress(`${scenario.name} · ${size.width} × ${size.height} · DPR ${size.pixelRatio}`);
   host.style.width=size.width+'px';host.style.height=size.height+'px';
   media=document.createElement(scenario.video?'video':'img');
   if(scenario.video){media.muted=true;media.loop=true;media.playsInline=true;}
   media.src=scenario.video?'../demo/assets/alpine-loop.webm':'../demo/assets/hero-orbit.jpg';media.setAttribute('aria-label','Benchmark source');host.replaceChildren(media);
   if(scenario.video){await new Promise((resolve,reject)=>{media.onloadeddata=resolve;media.onerror=()=>reject(new Error('Video could not load'));});await media.play();}else await media.decode();
   host.scrollIntoView({block:'center'});await frame();check();
   const start=performance.now();fx=createEffect(media,{layers:scenario.effects.map(effect=>({effect,amount:.6,detail:.5})),duration:6,pixelRatio:size.pixelRatio,onError:error=>{renderError=error;}});
   while(!fx.stats.frames){await frame();check();if(performance.now()-start>10000)throw new Error('Renderer did not draw.');}
   const firstFrameMs=performance.now()-start;
   const gl=fx.canvas.getContext('webgl2'),debug=gl.getExtension('WEBGL_debug_renderer_info');report.renderer=debug?gl.getParameter(debug.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER);
   for(let i=0;i<30;i++){await frame();check();}
   let previous=await frame(),previousCount=fx.stats.frames;const intervals=[],cpu=[];let renderedFrames=0;
   for(let i=0;i<120;i++){const now=await frame();check();intervals.push(now-previous);previous=now;const stats=fx.stats;if(stats.frames>previousCount){cpu.push(stats.cpuMs);renderedFrames+=stats.frames-previousCount;}previousCount=stats.frames;}
   const stats=fx.stats;
   report.runs.push({name:scenario.name,source:scenario.video?'video':'image',effects:scenario.effects.map(e=>e.name),...size,backingWidth:stats.width,backingHeight:stats.height,firstFrameMs:+firstFrameMs.toFixed(3),frameIntervalP50:percentile(intervals,.5),frameIntervalP95:percentile(intervals,.95),cpuSubmissionP50:percentile(cpu,.5),cpuSubmissionP95:percentile(cpu,.95),samples:intervals.length,renderedFrames,textureUploads:stats.textureUploads,sourceTextureAllocations:stats.sourceTextureAllocations,intermediateTextures:stats.intermediateTextures,intermediateBytes:stats.width*stats.height*4*stats.intermediateTextures});
   fx.destroy();fx=null;media.pause?.();gl.getExtension('WEBGL_lose_context')?.loseContext();
  }
  report.visibilityInterruptions=interruptions;return report;
 }finally{fx?.destroy();media?.pause?.();document.removeEventListener('visibilitychange',visibility);}
}
