import './vendor/materia/brand.js';
import {createEffect,zoomIn,tiltShift,noise} from '../src/index.js';
const media=document.querySelector('.hero-media img');
const button=document.querySelector('#showcase-motion');
let fx;
function mount(){if(fx)return;fx=createEffect(media,{layers:[{effect:zoomIn,amount:.65,detail:.45},{effect:tiltShift,amount:.4,detail:.6},{effect:noise,amount:.12,detail:.2}],trigger:'loop',duration:12});if(button.getAttribute('aria-pressed')==='true')fx.pause();}
button.addEventListener('click',()=>{const paused=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',String(paused));button.setAttribute('aria-label',paused?'Resume hero motion':'Pause hero motion');button.title=button.getAttribute('aria-label');button.textContent=paused?'▷':'Ⅱ';if(paused)fx?.pause();else fx?.play();});
mount();
window.addEventListener('pagehide',()=>{fx?.destroy();fx=undefined;});
window.addEventListener('pageshow',mount);
