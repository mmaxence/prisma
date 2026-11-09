export default { family:'Color', detailLabel:'Contrast', name:'duotone', title:'Duotone', description:'Cobalt shadows and warm paper highlights, with a rolling tonal wash.', fragment:`
vec4 effect(vec2 uv){
 vec4 source=sampleMedia(uv);
 float luminance=dot(source.rgb,vec3(0.2126,0.7152,0.0722));
 float tone=smoothstep(0.05,0.90,(luminance-0.5)*mix(0.7,1.8,uDetail)+0.5+0.12*sin(uPhase+uv.y*6.283185));
 vec3 color=mix(vec3(0.08,0.08,0.42),vec3(1.0,0.78,0.48),tone);
 return vec4(mix(source.rgb,color,uAmount),source.a);
}` };
