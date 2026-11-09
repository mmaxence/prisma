export default { family:'Digital', detailLabel:'Separation', name:'rgbSplit', title:'RGB split', description:'Three color plates slip out of register, then find each other again.', fragment:`
vec4 effect(vec2 uv){
 vec4 source=sampleMedia(uv);
 vec2 direction=vec2(cos(uPhase),sin(uPhase))/vec2(uAspect,1.0);
 vec2 offset=direction*((0.004+0.025*uDetail)+0.014*(0.5+0.5*sin(uPhase)))*uAmount;
 vec4 red=sampleMedia(uv+offset),blue=sampleMedia(uv-offset);
 return vec4(red.r,source.g,blue.b,source.a);
}` };
