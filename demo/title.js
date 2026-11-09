import './vendor/materia/brand.js';
import {createEffect} from '../src/index.js';
import {heroOptions,cursorTreatment} from './hero-effects.js?v=full-frame';
const media=document.querySelector('.hero-media img');
const button=document.querySelector('#showcase-motion');
let fx,hoverFrame=0,hoverAmount=0,hoverTarget=0,previous=0;
const host=media.parentElement;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const layers=()=>[...heroOptions.layers,{effect:cursorTreatment,amount:hoverAmount,enabled:hoverAmount>0}];
function setHover(value){
 hoverTarget=value;
 if(reduced.matches){hoverAmount=value;fx?.set({layers:layers()});return;}
 if(hoverFrame)return;
 previous=performance.now();
 function step(now){
  const dt=Math.min(64,now-previous);previous=now;
  hoverAmount+=(hoverTarget-hoverAmount)*(1-Math.exp(-dt/65));
  if(Math.abs(hoverAmount-hoverTarget)<.005)hoverAmount=hoverTarget;
  fx?.set({layers:layers()});
  hoverFrame=hoverAmount!==hoverTarget?requestAnimationFrame(step):0;
 }
 hoverFrame=requestAnimationFrame(step);
}
host.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch')setHover(1);});
host.addEventListener('pointerleave',()=>setHover(0));
host.addEventListener('pointercancel',()=>setHover(0));
window.addEventListener('blur',()=>setHover(0));
function mount(){if(fx)return;fx=createEffect(media,{...heroOptions,layers:layers()});if(button.getAttribute('aria-pressed')==='true')fx.pause();}
button.addEventListener('click',()=>{const paused=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',String(paused));button.setAttribute('aria-label',paused?'Resume hero motion':'Pause hero motion');button.title=button.getAttribute('aria-label');button.textContent=paused?'▷':'Ⅱ';if(paused)fx?.pause();else if(!media.parentElement.classList.contains('show-original'))fx?.play();});
mount();
window.addEventListener('pagehide',()=>{cancelAnimationFrame(hoverFrame);hoverFrame=0;hoverAmount=hoverTarget=0;fx?.destroy();fx=undefined;});
window.addEventListener('pageshow',mount);

const original=document.querySelector('.hero-original');
original.addEventListener('click',()=>{const show=original.getAttribute('aria-pressed')!=='true';original.setAttribute('aria-pressed',String(show));original.textContent=show?'Restore motion':'View original';media.parentElement.classList.toggle('show-original',show);if(show)fx?.pause();else if(button.getAttribute('aria-pressed')!=='true')fx?.play();});
