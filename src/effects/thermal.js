export default {description:'A moving violet-to-gold false-color palette driven by image brightness.',name:'thermal',title:'False color',family:'Color',useCase:'Sci-fi visuals, poster treatments, and dramatic image reveals.',detailLabel:'Contrast',fragment:`
vec4 effect(vec2 uv){
 vec4 source=sampleMedia(uv);float lum=dot(source.rgb,vec3(0.2126,0.7152,0.0722));
 float t=clamp((lum-0.5)*mix(0.8,2.0,uDetail)+0.5+0.10*sin(uPhase+uv.y*6.283185),0.0,1.0);
 vec3 cold=mix(vec3(0.03,0.01,0.22),vec3(0.45,0.02,0.7),smoothstep(0.0,0.35,t));
 vec3 warm=mix(vec3(0.95,0.05,0.12),vec3(1.0,0.86,0.15),smoothstep(0.55,0.85,t));
 vec3 color=mix(cold,warm,smoothstep(0.3,0.6,t));color=mix(color,vec3(1.0,0.98,0.8),smoothstep(0.85,1.0,t));
 return vec4(mix(source.rgb,color,uAmount),source.a);
}`};
