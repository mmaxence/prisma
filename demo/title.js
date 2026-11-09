import './vendor/materia/brand.js';
import {createEffect,zoomIn,liquid,prism} from '../src/index.js';
const media=document.querySelector('.hero-media img');
const button=document.querySelector('#showcase-motion');
let fx;
function mount(){if(fx)return;fx=createEffect(media,{layers:[{effect:zoomIn,amount:.65,detail:.45},{effect:liquid,amount:.22,detail:.25},{effect:prism,amount:.18,detail:.5}],trigger:'loop',duration:12});if(button.getAttribute('aria-pressed')==='true')fx.pause();}
button.addEventListener('click',()=>{const paused=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',String(paused));button.setAttribute('aria-label',paused?'Resume hero motion':'Pause hero motion');button.title=button.getAttribute('aria-label');button.textContent=paused?'▷':'Ⅱ';if(paused)fx?.pause();else if(!media.parentElement.classList.contains('show-original'))fx?.play();});
mount();
window.addEventListener('pagehide',()=>{fx?.destroy();fx=undefined;});
window.addEventListener('pageshow',mount);

const original=document.querySelector('.hero-original');
original.addEventListener('click',()=>{const show=original.getAttribute('aria-pressed')!=='true';original.setAttribute('aria-pressed',String(show));original.textContent=show?'Restore motion':'View original';media.parentElement.classList.toggle('show-original',show);if(show)fx?.pause();else if(button.getAttribute('aria-pressed')!=='true')fx?.play();});
