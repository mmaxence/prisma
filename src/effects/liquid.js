export default { family:'Distortion', detailLabel:'Flow scale', name: 'liquid', title: 'Liquid', description: 'A slow, refractive current moving through the image.', fragment: `
vec4 effect(vec2 uv) {
 vec2 p=uv*mix(3.0,12.0,uDetail);
 vec2 d=vec2(sin(p.y+uPhase+sin(p.x-uPhase)), cos(p.x-uPhase+cos(p.y+uPhase)));
 return sampleMedia(uv+d*0.035*uAmount);
}` };
