import {createEffect} from '@prisma-fx/media/core';
import zoomIn from '@prisma-fx/media/effects/zoomIn';
import noise from '@prisma-fx/media/effects/noise';

// Standalone example application. These helpers are not library exports/adapters.
const root=document.querySelector('[data-example]');
const image=document.querySelector('[data-image]'),video=document.querySelector('[data-video]');
const imageHost=document.querySelector('[data-image-host]'),videoHost=document.querySelector('[data-video-host]');
const kindControl=document.querySelector('[data-kind]'),amount=document.querySelector('[data-amount]');
const status=document.querySelector('[data-status]'),stats=document.querySelector('[data-stats]');
const effectPause=document.querySelector('[data-effect-pause]'),playVideo=document.querySelector('[data-video-play]'),pauseVideo=document.querySelector('[data-video-pause]');
const destroyButton=document.querySelector('[data-destroy]'),mountButton=document.querySelector('[data-mount]'),failButton=document.querySelector('[data-fail]'),restoreButton=document.querySelector('[data-restore]');
if(!(root instanceof HTMLElement)||!(image instanceof HTMLImageElement)||!(video instanceof HTMLVideoElement)||!(imageHost instanceof HTMLElement)||!(videoHost instanceof HTMLElement)||!(kindControl instanceof HTMLSelectElement)||!(amount instanceof HTMLInputElement)||!(status instanceof HTMLElement)||!(stats instanceof HTMLElement)||![effectPause,playVideo,pauseVideo,destroyButton,mountButton,failButton,restoreButton].every(x=>x instanceof HTMLButtonElement))throw Error('Example markup is incomplete');
// The explicit guards also make these examples checkable against installed declarations.
if(!(effectPause instanceof HTMLButtonElement)||!(playVideo instanceof HTMLButtonElement)||!(pauseVideo instanceof HTMLButtonElement)||!(destroyButton instanceof HTMLButtonElement)||!(mountButton instanceof HTMLButtonElement)||!(failButton instanceof HTMLButtonElement)||!(restoreButton instanceof HTMLButtonElement))throw Error('Example controls are incomplete');
const events=new AbortController(),reduced=matchMedia('(prefers-reduced-motion: reduce)');
/** @type {import('@prisma-fx/media').Controller|null} */
let fx=null;
let kind='image',effectPaused=false,disposed=false,errorText='';
const activeMedia=()=>kind==='video'?video:image;
const layers=()=>[{effect:zoomIn,amount:0.35,detail:0.3},{effect:noise,amount:Number(amount.value),blendMode:/** @type {const} */('soft-light')}];
const paint=()=>{
 status.textContent=`${fx?(fx.stats.fallback?'Native fallback.':'Controller mounted.'):'Effect destroyed; native media visible.'} Effect phase ${effectPaused?'paused':'running'}. Video ${video.paused?'paused':'playing'}. ${reduced.matches?'Reduced motion enabled.':''} ${errorText}`;
 effectPause.setAttribute('aria-pressed',String(effectPaused));effectPause.textContent=effectPaused?'Resume effect phase':'Pause effect phase';
 playVideo.disabled=pauseVideo.disabled=kind!=='video';
 // External semantic video buttons remain available while native pixels/controls are enhanced.
 video.controls=!(kind==='video'&&fx&&!fx.stats.fallback);
 stats.textContent=fx?JSON.stringify(fx.stats,null,2):'No renderer mounted.';
};
const mount=()=>{
 if(disposed)return;
 fx?.destroy();
 fx=createEffect(activeMedia(),{layers:layers(),trigger:'loop',duration:8,onError:error=>{errorText=error.message;paint();}});
 if(effectPaused)fx.pause();
 paint();
};
kindControl.addEventListener('change',()=>{fx?.destroy();fx=null;video.pause();kind=kindControl.value;imageHost.hidden=kind!=='image';videoHost.hidden=kind!=='video';errorText='';mount();},{signal:events.signal});
amount.addEventListener('input',()=>{fx?.set({layers:layers()});paint();},{signal:events.signal});
effectPause.addEventListener('click',()=>{effectPaused=!effectPaused;if(effectPaused)fx?.pause();else fx?.play();paint();},{signal:events.signal});
playVideo.addEventListener('click',async()=>{try{await video.play();if(!disposed)errorText='';}catch{if(!disposed)errorText='Playback was blocked or unavailable; use native fallback or another source.';}if(!disposed)paint();},{signal:events.signal});
pauseVideo.addEventListener('click',()=>{video.pause();paint();},{signal:events.signal});
destroyButton.addEventListener('click',()=>{fx?.destroy();fx=null;paint();},{signal:events.signal});
mountButton.addEventListener('click',mount,{signal:events.signal});
failButton.addEventListener('click',()=>{activeMedia().src='./missing-media-resource';},{signal:events.signal});
restoreButton.addEventListener('click',()=>{errorText='';if(kind==='image')image.src='./pattern.svg';else{video.src='./motion.webm';video.load();}paint();},{signal:events.signal});
for(const media of [image,video])media.addEventListener(media===image?'load':'loadeddata',()=>{if(media===activeMedia()){errorText='';fx?.set({});paint();}},{signal:events.signal});
for(const event of ['play','pause','timeupdate','error'])video.addEventListener(event,paint,{signal:events.signal});
reduced.addEventListener('change',paint,{signal:events.signal});
export const snapshotExample=()=>{return{kind,effectPaused,videoPaused:video.paused,stats:fx?{...fx.stats}:null};}
export const disposeExample=()=>{if(disposed)return;disposed=true;events.abort();fx?.destroy();fx=null;video.pause();video.controls=true;paint();}
window.addEventListener('pagehide',disposeExample,{once:true,signal:events.signal});
mount();
