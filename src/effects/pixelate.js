export default { family:'Digital', detailLabel:'Pixel density', name:'pixelate', title:'Pixelate', description:'A breathing mosaic that resolves from chunky pixels into detail.', fragment:`
vec4 effect(vec2 uv){
 vec4 source=sampleMedia(uv);
 float cells=mix(12.0,60.0,uDetail);
 vec2 grid=vec2(cells*uAspect,cells);
 vec4 coarse=sampleMedia((floor(uv*grid)+0.5)/grid);
 vec4 fine=sampleMedia((floor(uv*grid*2.0)+0.5)/(grid*2.0));
 vec4 pixel=mix(coarse,fine,0.5+0.5*sin(uPhase));
 return mix(source,pixel,uAmount);
}` };
