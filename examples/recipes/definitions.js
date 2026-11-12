// Application presets. No effect aliases or new runtime APIs.
const load=/** @param {string} name */async name=>{
 switch(name){
  case 'zoomIn':return (await import('@prisma-fx/media/effects/zoomIn')).default;
  case 'noise':return (await import('@prisma-fx/media/effects/noise')).default;
  case 'halftone':return (await import('@prisma-fx/media/effects/halftone')).default;
  case 'duotone':return (await import('@prisma-fx/media/effects/duotone')).default;
  case 'pan':return (await import('@prisma-fx/media/effects/pan')).default;
  default:throw Error('Unknown preset');
 }
};
export const recipes=Object.freeze({
 hero:{title:'Product hero',effect:'zoomIn',amount:.2,detail:.25,trigger:/** @type {const} */('still')},
 editorial:{title:'Editorial image',effect:'halftone',amount:.2,detail:.6,trigger:/** @type {const} */('still')},
 cover:{title:'Video cover',effect:'duotone',amount:.18,detail:.45,trigger:/** @type {const} */('still')},
 gallery:{title:'Gallery card',effect:'duotone',amount:.12,detail:.45,trigger:/** @type {const} */('hover')},
 comparison:{title:'Before / after',effect:'duotone',amount:.55,detail:.45,trigger:/** @type {const} */('still')},
 portrait:{title:'Portrait treatment',effect:'duotone',amount:.3,detail:.45,trigger:/** @type {const} */('still')},
 ambient:{title:'Ambient media',effect:'pan',amount:.12,detail:.2,trigger:/** @type {const} */('loop')},
 spatial:{title:'Media in flat spatial panels',effect:'zoomIn',amount:.12,detail:.2,trigger:/** @type {const} */('still')},
});
export const loadEffect=load;
