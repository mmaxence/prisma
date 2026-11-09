import {icon} from './icons.js';
import {createEffect,noise,retroTv,matrix,vhs,glitch,ascii,thermal,dither,pixelate,rgbSplit,glassBreak,duotone,scanlines,halftone,liquid,ripple,prism,fluted,vortex,zoomIn,zoomOut,vibration,pan,handheld,tiltShift} from '../src/index.js';
const effects=[retroTv,noise,matrix,vhs,glitch,ascii,thermal,dither,pixelate,rgbSplit,glassBreak,halftone,duotone,scanlines,liquid,ripple,prism,fluted,vortex,zoomIn,zoomOut,vibration,pan,handheld,tiltShift];
const $=s=>document.querySelector(s);
let selected=retroTv, media=$('#media'), handle, fileURL, paused=false;
let stack=[{effect:retroTv,amount:.8,detail:.5,blendMode:'normal',enabled:true}],activeLayer=0;
const history=[];let historyIndex=-1,restoring=false,layerSignature='';
function checkpoint(){
 if(restoring)return;
 const state=JSON.stringify({layers:stack.map(l=>({...l,effect:l.effect.name})),activeLayer,motion:Object.fromEntries(['trigger','duration','phase'].map(id=>[id,$('#'+id).value]))});
 if(history[historyIndex]){const previous=JSON.parse(history[historyIndex]),current=JSON.parse(state);previous.activeLayer=current.activeLayer;if(JSON.stringify(previous)===state)return;}
 history.splice(historyIndex+1);history.push(state);if(history.length>50)history.shift();historyIndex=history.length-1;syncHistory();
}
function syncHistory(){const embedded=media.tagName==='IFRAME';$('#undo').disabled=embedded||historyIndex<=0;$('#redo').disabled=embedded||historyIndex>=history.length-1;}
function restoreHistory(direction){
 if(historyIndex+direction<0||historyIndex+direction>=history.length)return;
 endPreview();historyIndex+=direction;const state=JSON.parse(history[historyIndex]);restoring=true;
 stack=state.layers.map(l=>({...l,effect:effects.find(e=>e.name===l.effect)}));
 for(const [id,value] of Object.entries(state.motion))$('#'+id).value=value;
 selectLayer(state.activeLayer);restoring=false;syncHistory();
}
$('#undo').onclick=()=>restoreHistory(-1);$('#redo').onclick=()=>restoreHistory(1);
const settings=()=>({layers:stack.map(l=>({...l})),effect:selected,blendMode:$('#blend-mode').value,trigger:$('#trigger').value,amount:$('#amount').value/100,detail:$('#detail').value/100,duration:Number($('#duration').value),phase:$('#phase').value/100,onError:e=>{$('#status').textContent='Native media shown: '+e.message;}});
let previewCard=null;
function endPreview(){
 if(!previewCard)return;
 previewCard.classList.remove('previewing');previewCard=null;handle?.preview(null);
 $('#effect-label').textContent=stack.filter(l=>l.enabled).map(l=>l.effect.title).join(' → ')||'ORIGINAL MEDIA';
}
function startPreview(button,effect){
 if(button.disabled||!handle||stack.length>=6||!$('.catalog').open)return;
 endPreview();previewCard=button;button.classList.add('previewing');
 handle.preview({effect,amount:effect.impact?1:.65,detail:.5,blendMode:'normal',enabled:true});
 $('#effect-label').textContent='PREVIEW · '+effect.title+' · click to add';
}
$('.catalog').addEventListener('toggle',()=>{if(!$('.catalog').open)endPreview();});
window.addEventListener('blur',endPreview);
function release(){endPreview();if(!handle)return;const gl=handle.canvas.getContext('webgl2');handle.destroy();gl?.getExtension('WEBGL_lose_context')?.loseContext();handle=null;}
function mount(){release();if(media.tagName==='IFRAME')return;handle=createEffect(media,settings());paused=false;$('#pause').textContent='Pause motion';}
function update(event){endPreview();if(stack[activeLayer])Object.assign(stack[activeLayer],{amount:$('#amount').value/100,detail:$('#detail').value/100,blendMode:$('#blend-mode').value});handle?.set(settings());renderLayers();$('#amount-value').textContent=$('#amount').value+'%';$('#duration-value').textContent=$('#duration').value+'s';$('#phase-value').textContent=$('#phase').value+'%';$('#detail-value').textContent=$('#detail').value+'%';$('#detail-name').textContent=selected.detailLabel||'Detail';$('#phase').disabled=$('#trigger').value!=='still';$('#hint').textContent={loop:'A seamless loop. Try another treatment.',hover:'Hover or focus to wake the effect.',click:'Click, tap, or press Enter.',scroll:'Scroll the page to move the effect.',still:'A moment, held in place.'}[$('#trigger').value];const imports=[...new Set(stack.map(l=>l.effect.name))];$('#code').textContent=`import { createEffect${imports.length?', '+imports.join(', '):''} } from 'https://mmaxence.github.io/prisma/src/index.js';\n\nconst fx = createEffect(document.querySelector('${media.tagName==='VIDEO'?'video':'img'}'), {\n  layers: [\n${stack.map(l=>`    { effect: ${l.effect.name}, amount: ${l.amount}, detail: ${l.detail}, blendMode: '${l.blendMode}', enabled: ${l.enabled} }`).join(',\n')}\n  ],\n  trigger: '${$('#trigger').value}',\n  duration: ${$('#duration').value},\n  phase: ${$('#phase').value/100}\n});\n\n// On unmount\nfx.destroy();`;if(!(event instanceof Event&&event.type==='input'))checkpoint();syncHistory();}
function selectLayer(index){
 activeLayer=index;const layer=stack[index];$('.catalog').open=false;$('.inspector').open=true;
 $('.inspector').hidden=!layer;if(!layer){selected=retroTv;update();return;}
 selected=layer.effect;$('#amount').value=layer.amount*100;$('#detail').value=layer.detail*100;$('#blend-mode').value=layer.blendMode;
 $('#title').textContent=selected.title;$('#description').textContent=selected.description;$('#reset-glass').hidden=!stack.some(l=>l.effect.impact);
 update();
}
function renderLayers(){
 $('#reset-glass').hidden=!stack.some(l=>l.effect.impact);
 const signature=JSON.stringify([activeLayer,stack.map(l=>[l.effect.name,l.enabled])]);
 if(signature===layerSignature)return;layerSignature=signature;
 const focused=document.activeElement?.closest('.layer-row');const focusIndex=focused?[...focused.children].indexOf(document.activeElement):-1;
 $('#layers').replaceChildren();$('#layer-count').textContent=stack.length+' / 6';
 $('#effect-label').textContent=stack.filter(l=>l.enabled).map(l=>l.effect.title).join(' → ')||'ORIGINAL MEDIA';
 stack.forEach((layer,index)=>{
  const row=document.createElement('div');row.className='layer-row'+(index===activeLayer?' selected':'');
  const select=document.createElement('button');select.className='layer-select';select.textContent=String(index+1).padStart(2,'0')+'  '+layer.effect.title;select.setAttribute('aria-pressed',String(index===activeLayer));select.onclick=()=>selectLayer(index);row.append(select);
  const action=(label,text,fn,disabled=false)=>{const b=document.createElement('button');b.innerHTML=icon(text);b.title=label;b.setAttribute('aria-label',label+' '+layer.effect.title);b.disabled=disabled;b.onclick=fn;row.append(b);return b;};
  action('Bypass',layer.enabled?'eye':'hidden',()=>{layer.enabled=!layer.enabled;update();}).setAttribute('aria-pressed',String(!layer.enabled));
  action('Move up','up',()=>{[stack[index-1],stack[index]]=[stack[index],stack[index-1]];selectLayer(index-1);},index===0);
  action('Move down','down',()=>{[stack[index+1],stack[index]]=[stack[index],stack[index+1]];selectLayer(index+1);},index===stack.length-1);
  action('Remove','remove',()=>{stack.splice(index,1);selectLayer(Math.min(index,stack.length-1));if(!stack.length)$('.catalog').open=true;});$('#layers').append(row);
 });
 $('.inspector').hidden=!stack.length;
 if(!stack.length)$('#layers').textContent='Original media. Add an effect to begin.';
 if(focusIndex>=0){const row=$('#layers').children[Math.max(0,activeLayer)],control=row?.children[focusIndex];(control&&!control.disabled?control:row?.firstElementChild)?.focus({preventScroll:true});}
}
for(const [index,effect] of effects.entries()){
 const button=document.createElement('button');button.className='effect';button.innerHTML=`<div class="thumb"><img src="assets/alpine.svg" alt="" loading="lazy"></div><span class="effect-title">${effect.title}<small>${String(index+1).padStart(2,'0')}</small></span>`;
 $('.effects').append(button);
 button.dataset.family=effect.family||(effect.name==='fluted'?'Surface':'Distortion');
 button.title=effect.description;button.setAttribute('aria-label','Add '+effect.title);
 button.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')startPreview(button,effect);});
 button.addEventListener('pointerleave',()=>{if(previewCard===button)endPreview();});
 button.addEventListener('focus',()=>{if(button.matches(':focus-visible'))startPreview(button,effect);});
 button.addEventListener('blur',()=>{if(previewCard===button)endPreview();});
 button.addEventListener('keydown',e=>{if(e.key==='Escape')endPreview();});
 button.onclick=()=>{endPreview();if(stack.length>=6){$('#status').textContent='Six layers maximum. Remove a layer to add another.';return;}$('#status').textContent='';stack.push({effect,amount:effect.impact?1:.65,detail:.5,blendMode:'normal',enabled:true});if(effect.family==='Motion'){$('#trigger').value='loop';$('#duration').value=effect.name==='vibration'?'4':'10';}if(effect.impact){$('#trigger').value='click';$('#duration').value='1';handle?.reset();}selectLayer(stack.length-1);};
}
$('.inspector>summary span').innerHTML=icon('settings');
$('#description').textContent=retroTv.description;mount();update();
for(const id of ['trigger','amount','detail','duration','phase','blend-mode']){$('#'+id).addEventListener('input',update);$('#'+id).addEventListener('change',checkpoint);}
$('#pause').onclick=()=>{paused=!paused;paused?handle.pause():handle.play();$('#pause').textContent=paused?'Resume motion':'Pause motion';};
const compare=on=>{if(!handle)return;handle.canvas.style.visibility=on?'hidden':'visible';$('.stage').classList.toggle('comparing',on);if(on)handle.pause();else if(!paused)handle.play();$('#compare').setAttribute('aria-pressed',String(on));};
$('#compare').onpointerdown=e=>{e.currentTarget.setPointerCapture(e.pointerId);compare(true);};
for(const event of ['pointerup','pointercancel','lostpointercapture','blur'])$('#compare').addEventListener(event,()=>compare(false));
$('#compare').onkeydown=e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();compare(true);}};$('#compare').onkeyup=()=>compare(false);
$('#copy').onclick=async()=>{try{await navigator.clipboard.writeText($('#code').textContent);$('#copy').textContent='Copied ✓';}catch{$('#status').textContent='Select and copy the code below.';}};
function setSource(kind,src,name){
 release();if(media instanceof HTMLVideoElement){media.pause();media.removeAttribute('src');media.load();}
 $('.stage').classList.remove('comparing');$('#compare').setAttribute('aria-pressed','false');
 $('#image-choice').hidden=kind!=='image';
 const isVideo=kind==='video'||(kind==='upload'&&name.type.startsWith('video/'));
 const next=document.createElement(isVideo?'video':'img');next.id='media';
 const label=kind==='upload'?name.name:kind==='image'?$('#image-choice').selectedOptions[0].textContent:'Alpine lake — original Prisma sample';
 if(isVideo){next.muted=true;next.loop=true;next.playsInline=true;next.preload='auto';next.setAttribute('aria-label',label);}else next.alt=label;
 next.src=src;media.replaceWith(next);media=next;
 document.querySelectorAll('[data-source]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.source===kind)));
 $('#video-play').hidden=!isVideo;$('#video-play').textContent='Play video';
 $('#source-note').textContent=kind==='upload'?label:isVideo?'Original sample · 6-second loop · muted':label;
 $('#status').textContent='';setEmbedControls(false);mount();update();
 if(isVideo){
  const sync=()=>$('#video-play').textContent=next.paused?'Play video':'Pause video';
  next.addEventListener('play',sync);next.addEventListener('pause',sync);
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches)next.play().catch(()=>{$('#status').textContent='Press Play video to start playback.';});
 }
 next.onerror=()=>{$('#status').textContent='This media could not be decoded. Choose Image or another upload.';};
}
$('#source-image').onclick=()=>{setSource('image','assets/'+$('#image-choice').value);$('#source-note').textContent=$('#image-choice').selectedOptions[0].textContent;};
$('#image-choice').onchange=()=>$('#source-image').click();
function setEmbedControls(disabled){
 document.querySelectorAll('aside select, aside input:not([type=file]), aside button, .effect, #compare, #copy').forEach(el=>el.disabled=disabled);if(!disabled){layerSignature='';renderLayers();syncHistory();}
}
$('#source-video').onclick=()=>setSource('video','assets/alpine-loop.webm');
$('#video-play').onclick=()=>{if(!(media instanceof HTMLVideoElement))return;if(media.paused)media.play().catch(()=>{$('#status').textContent='Video playback failed.';});else media.pause();};
$('#upload').onclick=()=>$('#file').click();
$('#file').onchange=()=>{
 const file=$('#file').files[0];if(!file)return;
 if(!/^(image|video)\//.test(file.type)){$('#status').textContent='Choose an image or video.';return;}
 const previousURL=fileURL;fileURL=URL.createObjectURL(file);setSource('upload',fileURL,file);
 if(previousURL)URL.revokeObjectURL(previousURL);$('#file').value='';
};
window.addEventListener('pagehide',()=>{release();if(fileURL)URL.revokeObjectURL(fileURL);});

// Render static thumbnails sequentially with one temporary context, then release it.
async function renderThumbnails(){
 const host=document.createElement('div');Object.assign(host.style,{position:'fixed',top:'0',left:'0',width:'360px',height:'180px',opacity:'0',pointerEvents:'none'});
 const source=new Image();source.src='assets/alpine.svg';host.append(source);document.body.append(host);let renderer;
 try{await source.decode();renderer=createEffect(source,{effect:effects[0],trigger:'still',amount:.9,phase:.2,pixelRatio:1});
 for(const [i,effect] of effects.entries()){
  renderer.set({effect});
  await new Promise(resolve=>requestAnimationFrame(()=>{if(!renderer.stats.fallback)document.querySelectorAll('.thumb img')[i].src=renderer.canvas.toDataURL('image/png');resolve();}));
 }
 }finally{const gl=renderer?.canvas.getContext('webgl2');renderer?.destroy();gl?.getExtension('WEBGL_lose_context')?.loseContext();host.remove();}
}
renderThumbnails().catch(()=>{});
function filterEffects(){endPreview();let count=0;document.querySelectorAll('.effect').forEach(button=>{button.hidden=($('#family').value!=='All'&&button.dataset.family!==$('#family').value)||!button.textContent.toLowerCase().includes($('#effect-search').value.toLowerCase());if(!button.hidden)count++;});$('#no-effects').hidden=count>0;}$('#family').onchange=filterEffects;$('#effect-search').oninput=filterEffects;
$('#reset-glass').onclick=()=>{$('#phase').value='0';handle?.reset();update();};
