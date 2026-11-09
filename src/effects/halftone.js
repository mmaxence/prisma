export default { family:'Print', detailLabel:'Dot density', name: 'halftone', title: 'Halftone', description: 'A living print screen, with ink shaped by luminance.', fragment: `
vec4 effect(vec2 uv) {
 float cells=min(mix(25.0,130.0,uDetail),0.28/max(fwidth(uv.y),0.0001)); vec2 grid=vec2(cells*uAspect,cells);
 vec2 center=(floor(uv*grid)+0.5)/grid;
 vec4 c=sampleMedia(center);
 float lum=dot(c.rgb,vec3(0.2126,0.7152,0.0722));
 float radius=sqrt(max(lum,0.0))*0.65;
 float dist=length(fract(uv*grid)-0.5);
 float aa=max(fwidth(dist),0.015);
 float dotMask=1.0-smoothstep(radius-aa,radius+aa,dist);
 vec3 ink=mix(vec3(0.018),c.rgb*1.4,dotMask);
 ink*=1.0+0.12*sin(uPhase+uv.y*6.28318);
 return vec4(mix(sampleMedia(uv).rgb,ink,uAmount),c.a);
}` };
