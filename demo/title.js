import './vendor/materia/brand.js';
import {createTextEffect} from './vendor/materia/lib/index.js';
import {spatialTitle} from './vendor/materia/showcase-hero.js';
const host=document.querySelector('.hero-type');
const button=document.querySelector('#showcase-motion');
let fx,visible=false;
function sync(){fx?.setFrozen(!visible || button.getAttribute('aria-pressed')==='true');}
function mount(){if(fx)return;fx=createTextEffect(host.querySelector('h1'),{host,effect:spatialTitle,auto:true});sync();}
const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});
observer.observe(host);
button.addEventListener('click',()=>{const paused=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',String(paused));button.setAttribute('aria-label',paused?'Resume title motion':'Pause title motion');button.title=button.getAttribute('aria-label');button.textContent=paused?'▷':'Ⅱ';sync();});
mount();
window.addEventListener('pagehide',()=>{fx?.destroy();fx=undefined;});
window.addEventListener('pageshow',mount);
