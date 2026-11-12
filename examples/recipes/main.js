import {createEffect} from '@prisma-fx/media/core';
import {recipes,loadEffect} from './definitions.js';
/** @param {string} selector */
const need=selector=>{const node=document.querySelector(selector);if(!(node instanceof HTMLElement))throw Error('Missing '+selector);return node;};
const picker=/** @type {HTMLSelectElement} */(need('#recipe')),caption=/** @type {HTMLTextAreaElement} */(need('#caption'));
const amount=/** @type {HTMLInputElement} */(need('#amount'));
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),state=need('#state'),error=need('#source-error');
/** @type {{dispose:()=>void,select:(id:string)=>void,snapshot:()=>object}|undefined} */
let app;
// These functions own an example, not a new library adapter/runtime API.
export function mountRecipes(){
 if(app)return app;
 const events=new AbortController();let disposed=false,generation=0,selectionVersion=0,selected='hero',nativeChoice=false,effectPaused=false,requestedPlay=false,onScreen=true,loading=false,errorText='',comparisonMode='both',reducedMotion=reduced.matches;
 /** @type {import('@prisma-fx/media').Controller|null} */
 let fx=null;
 /** @type {import('@strata-ui/core').SceneController|null} */
 let space=null;
 /** @type {HTMLImageElement|HTMLVideoElement|null} */
 let ownedMedia=null;
 /** @type {HTMLImageElement|HTMLVideoElement|null} */
 let lastFailedMedia=null;
 /** @type {IntersectionObserver|null} */
 let observer=null;
 let renderEvents=new AbortController();const policyPauses=new WeakSet(),programmaticPlays=new WeakSet();
 document.documentElement.classList.add('recipes-ready');
 const panel=()=>need('[data-recipe="'+selected+'"]');
 const video=()=>{const node=panel().querySelector('[data-video]');return node instanceof HTMLVideoElement?node:null;};
 const image=()=>{const node=panel().querySelector('[data-media]');if(!(node instanceof HTMLImageElement))throw Error('Missing source image');return node;};
 const blocked=()=>reducedMotion||document.hidden||!onScreen;
 const stopVideos=()=>{for(const node of document.querySelectorAll('[data-video]'))if(node instanceof HTMLVideoElement&&!node.paused){policyPauses.add(node);node.pause();}};
 const teardown=()=>{renderEvents.abort();renderEvents=new AbortController();fx?.destroy();fx=null;space?.destroy();space=null;ownedMedia=null;};
 const paint=()=>{
  for(const id of ['effect-pause','native','remount','fail','restore','replace'])/** @type {HTMLButtonElement} */(need('#'+id)).disabled=disposed||(id==='replace'&&!!video());
  need('#effect-pause').textContent=effectPaused?'Resume effect phase':'Pause effect phase';need('#effect-pause').setAttribute('aria-pressed',String(effectPaused));
  need('#native').textContent=nativeChoice?'Enable treatment':'Show original';need('#native').setAttribute('aria-pressed',String(nativeChoice));
  for(const n of document.querySelectorAll('[data-view]'))if(n instanceof HTMLButtonElement){n.disabled=disposed;n.setAttribute('aria-pressed',String(n.dataset.view===comparisonMode));}
  const v=video();if(v)v.controls=!fx||!!fx.stats.fallback;
  state.textContent=disposed?'Recipes disposed. Original media retained.':loading?'Loading selected recipe…':`${selected}: ${fx?(fx.stats.fallback?'native fallback':'treatment mounted'):'original media'}. Effect phase ${effectPaused?'paused':'running'}. ${v?`Video ${v.paused?'paused':'playing'}${requestedPlay&&blocked()?' (playback held by policy)':''}.`:''} ${reducedMotion?'Reduced preference: original still.':''} ${errorText}`;
 };
 const sync=async()=>{
  const current=++generation;teardown();stopVideos();loading=false;
  const p=panel(),v=video(),play=!!v&&requestedPlay&&!blocked();
  const videoHost=p.querySelector('.video-host'),coverHost=p.querySelector('.cover-host');
  if(videoHost instanceof HTMLElement)videoHost.hidden=!play;if(coverHost instanceof HTMLElement)coverHost.hidden=play;
  if(disposed){paint();return;}
  const spec=recipes[/** @type {keyof typeof recipes} */(selected)];
  const comparisonOriginal=selected==='comparison'&&comparisonMode==='original';
  const enhance=!nativeChoice&&!reducedMotion&&!comparisonOriginal&&!(selected==='ambient'&&!play);
  const media=play&&v?v:image();
  loading=enhance;paint();
  try{
   const effect=enhance?await loadEffect(spec.effect):null;
   const spatial=enhance&&selected==='spatial'?await import('@strata-ui/core'):null;
   if(disposed||current!==generation)return;
   if(spatial){const scene=p.querySelector('.scene');if(!(scene instanceof HTMLElement))throw Error('Missing scene');space=spatial.createScene(scene,{compactWidth:1600});}
   if(effect){ownedMedia=media;fx=createEffect(media,{effect,amount:Number(amount.value),detail:spec.detail,trigger:spec.trigger,duration:18,phase:.5,pixelRatio:1,onError:failure=>{if(!disposed&&current===generation){errorText='Treatment unavailable; original media retained.';paint();}}});if(effectPaused)fx.pause();for(const type of ['webglcontextlost','webglcontextrestored'])fx.canvas.addEventListener(type,paint,{signal:renderEvents.signal});}
   loading=false;paint();
   if(play&&v){try{if(v.paused)programmaticPlays.add(v);await v.play();if(disposed||current!==generation)return;errorText='';}catch{programmaticPlays.delete(v);if(disposed||current!==generation)return;requestedPlay=false;errorText='Playback unavailable. Cover retained; retry with a supported source.';void sync();return;}paint();}
  }catch{if(disposed||current!==generation)return;teardown();stopVideos();loading=false;errorText='Treatment could not load; original media retained.';paint();}
 };
 const select=/** @param {string} id */id=>{
  if(disposed||!(id in recipes))return;
  ++selectionVersion;observer?.disconnect();selected=id;picker.value=id;requestedPlay=false;errorText='';error.hidden=true;onScreen=true;
  for(const n of document.querySelectorAll('[data-recipe]'))if(n instanceof HTMLElement)n.hidden=n.dataset.recipe!==id;
  const spec=recipes[/** @type {keyof typeof recipes} */(id)];amount.value=String(spec.amount);
  caption.value=panel().querySelector('[data-caption]')?.textContent||'';
  const epoch=selectionVersion;observer=new IntersectionObserver(entries=>{if(disposed||epoch!==selectionVersion)return;const visible=entries[entries.length-1].isIntersecting;if(visible===onScreen)return;onScreen=visible;if(video()&&requestedPlay)void sync();});observer.observe(panel().querySelector('figure')||panel());
  void sync();
 };
 const listen=/** @param {HTMLElement} node @param {string} type @param {()=>void} fn */(node,type,fn)=>node.addEventListener(type,fn,{signal:events.signal});
 listen(picker,'change',()=>select(picker.value));
 listen(caption,'input',()=>{const n=panel().querySelector('[data-caption]');if(n)n.textContent=caption.value;});
 listen(amount,'input',()=>{fx?.set({amount:Number(amount.value)});paint();});
 listen(need('#effect-pause'),'click',()=>{effectPaused=!effectPaused;if(effectPaused)fx?.pause();else fx?.play();paint();});
 listen(need('#native'),'click',()=>{nativeChoice=!nativeChoice;void sync();});
 listen(need('#remount'),'click',()=>void sync());
 for(const button of document.querySelectorAll('[data-view]'))if(button instanceof HTMLButtonElement)listen(button,'click',()=>{comparisonMode=button.dataset.view||'both';const p=need('[data-recipe=comparison]'),before=p.querySelector('[data-before]'),after=p.querySelector('[data-after]');if(before instanceof HTMLElement)before.hidden=comparisonMode==='treated';if(after instanceof HTMLElement)after.hidden=comparisonMode==='original';if(selected==='comparison')void sync();else paint();});
 // Record original application sources/alternatives before any source replacement.
 for(const n of document.querySelectorAll('[data-media],[data-video]'))if(n instanceof HTMLImageElement||n instanceof HTMLVideoElement){n.dataset.original=n.getAttribute('src')||'';if(n instanceof HTMLImageElement)n.dataset.originalAlt=n.alt;}
 const mediaNow=()=>ownedMedia??(requestedPlay&&video()&&!blocked()?video():image());
 listen(need('#fail'),'click',()=>{const n=mediaNow();if(n){n.src='./missing-media-resource';if(n instanceof HTMLVideoElement)n.load();}});
 listen(need('#restore'),'click',()=>{errorText='';error.hidden=true;const n=lastFailedMedia??video()??mediaNow();lastFailedMedia=null;if(n){n.src=n.dataset.original||'';if(n instanceof HTMLVideoElement)n.load();else n.alt=n.dataset.originalAlt||n.alt;fx?.set({});paint();}});
 listen(need('#replace'),'click',()=>{teardown();const old=image(),next=/** @type {HTMLImageElement} */(old.cloneNode(false));next.src='../media/pattern.svg';next.alt='Replacement original mountain illustration';old.replaceWith(next);void sync();});
 for(const button of document.querySelectorAll('[data-play]'))if(button instanceof HTMLElement)listen(button,'click',()=>{if(button.closest('[data-recipe]')!==panel())return;requestedPlay=true;errorText='';void sync();});
 for(const button of document.querySelectorAll('[data-stop]'))if(button instanceof HTMLElement)listen(button,'click',()=>{if(button.closest('[data-recipe]')!==panel())return;requestedPlay=false;void sync();});
 for(const button of document.querySelectorAll('[data-action]'))if(button instanceof HTMLElement)listen(button,'click',()=>{if(button.closest('[data-recipe]')!==panel())return;if(selected==='spatial')space?.focus('notes');else{const out=panel().querySelector('[data-result]');if(out)out.textContent='Study selected locally';}});
 // Delegation handles image nodes replaced through the application action too.
 document.addEventListener('load',e=>{if(disposed||!(e.target instanceof HTMLImageElement)||!panel().contains(e.target))return;error.hidden=true;errorText='';fx?.set({});paint();},{capture:true,signal:events.signal});
 document.addEventListener('error',e=>{if(disposed||!(e.target instanceof HTMLImageElement||e.target instanceof HTMLVideoElement)||!panel().contains(e.target))return;lastFailedMedia=e.target;error.hidden=false;errorText='Source load failed; caption retained.';if(e.target instanceof HTMLVideoElement){requestedPlay=false;e.target.pause();}paint();},{capture:true,signal:events.signal});
 for(const v of document.querySelectorAll('[data-video]'))if(v instanceof HTMLVideoElement)for(const type of ['loadeddata','play','pause'])v.addEventListener(type,()=>{const policyPause=type==='pause'&&policyPauses.delete(v),appPlay=type==='play'&&programmaticPlays.delete(v);if(disposed||v!==video())return;if(type==='loadeddata'){error.hidden=true;errorText='';fx?.set({});}if(type==='play'&&!appPlay)requestedPlay=true;if(type==='pause'&&!policyPause){requestedPlay=false;if(document.activeElement===v)/** @type {HTMLElement|null} */(panel().querySelector('[data-play]'))?.focus({preventScroll:true});void sync();return;}paint();},{signal:events.signal});
 /** @param {MediaQueryListEvent} event */
 const onPreference=event=>{reducedMotion=event.matches;void sync();};
 reduced.addEventListener('change',onPreference);
 document.addEventListener('visibilitychange',()=>{if(video()&&requestedPlay)void sync();},{signal:events.signal});
 const dispose=()=>{if(disposed)return;disposed=true;++generation;reduced.removeEventListener('change',onPreference);events.abort();observer?.disconnect();teardown();stopVideos();comparisonMode='both';paint();for(const n of document.querySelectorAll('[data-recipe],.video-host,.cover-host,[data-before],[data-after]'))if(n instanceof HTMLElement)n.hidden=false;for(const v of document.querySelectorAll('[data-video]'))if(v instanceof HTMLVideoElement)v.controls=true;document.documentElement.classList.remove('recipes-ready');app=undefined;};
 window.addEventListener('pagehide',e=>{if(!e.persisted)dispose();},{signal:events.signal});
 app={dispose,select,snapshot:()=>({selected,loading,subscriptionsAborted:events.signal.aborted,generation,onScreen,reduced:reducedMotion,documentHidden:document.hidden,nativeChoice,effectPaused,requestedPlay,policyBlocked:blocked(),videoPaused:video()?.paused??true,videoTime:video()?.currentTime??0,kind:ownedMedia instanceof HTMLVideoElement?'video':'image',stats:fx?{...fx.stats}:null,space:space?.state??null,errorText})};
 const initial=location.hash.slice(1);select(initial in recipes?initial:'hero');return app;
}
export const snapshotRecipes=()=>app?.snapshot()??null;
export const disposeRecipes=()=>app?.dispose();
mountRecipes();
