export default { family:'Print', detailLabel:'Dot density', name:'dither', title:'Dither', description:'A four-tone ordered print, with a slow exposure sweep.', fragment:`
float bayer(vec2 p){
 ivec2 q=ivec2(mod(p,4.0));
 int values[16]=int[16](0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5);
 return (float(values[q.y*4+q.x])+0.5)/16.0;
}
vec4 effect(vec2 uv){
 vec4 source=sampleMedia(uv);
 float cells=min(mix(70.0,260.0,uDetail),0.5/max(fwidth(uv.y),0.0001));
 vec2 grid=vec2(cells*uAspect,cells);
 vec4 cell=sampleMedia((floor(uv*grid)+0.5)/grid);
 float luminance=dot(cell.rgb,vec3(0.2126,0.7152,0.0722));
 luminance=clamp(luminance+0.13*sin(uPhase+uv.y*6.283185),0.0,1.0);
 float tone=floor(luminance*3.0+bayer(floor(uv*grid)))/3.0;
 vec3 ink=mix(vec3(0.025,0.07,0.075),vec3(0.94,0.95,0.78),tone);
 return vec4(mix(source.rgb,ink,uAmount),source.a);
}` };
