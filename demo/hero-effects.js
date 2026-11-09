import {zoomIn,glitch,rgbSplit,noise} from '../src/index.js';

// One slow camera cycle; eight short signal accents and 40 grain refreshes/sec.
// Derive every clock from the renderer phase so pause/reduced motion stay unified.
const burst='pow(max(0.0,sin(uPhase*8.0)),24.0)';
function signal(effect){
 return {...effect,name:`hero-${effect.name}`,fragment:effect.fragment
  .replaceAll('uPhase','(uPhase*8.0)')
  .replaceAll('uAmount',`(uAmount*${burst})`)};
}
export const heroOptions={
 layers:[
  {effect:zoomIn,amount:.5,detail:.35},
  {effect:signal(glitch),amount:.75,detail:.6},
  {effect:signal(rgbSplit),amount:.4,detail:.35},
  {effect:{...noise,name:'hero-noise',fragment:noise.fragment.replaceAll('uPhase','(uPhase*8.0)')},amount:.18,detail:.15}
 ],
 trigger:'loop',duration:48
};

// A soft, localized pixel/color lens. The renderer supplies the real pointer UV.
export const cursorTreatment={name:'hero-cursor',fragment:`
vec4 effect(vec2 uv){
 vec4 source=sampleMedia(uv);
 float distance=length((uv-uPointer)*vec2(uAspect,1.0));
 float mask=(1.0-smoothstep(0.045,0.24,distance))*uAmount;
 vec2 grid=vec2(uAspect,1.0)*64.0;
 vec2 cell=(floor(uv*grid)+0.5)/grid;
 vec3 pixel=sampleMedia(cell).rgb;
 float luminance=dot(pixel,vec3(0.2126,0.7152,0.0722));
 vec3 tint=mix(vec3(0.22,0.45,0.9),vec3(1.0,0.42,0.25),luminance);
 vec3 color=mix(2.0*pixel*tint,1.0-2.0*(1.0-pixel)*(1.0-tint),step(vec3(0.5),pixel));
 return vec4(mix(source.rgb,mix(pixel,color,0.32),mask*0.88),source.a);
}`};
