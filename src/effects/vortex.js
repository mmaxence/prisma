export default { family: 'Distortion', name: 'vortex', title: 'Vortex', description: 'A localized gravity well twisting the surface of the image.', fragment: `
vec4 effect(vec2 uv) {
 vec2 p=(uv-uPointer)*vec2(uAspect,1.0);
 float a=exp(-dot(p,p)*7.0)*(0.65+0.45*sin(uPhase))*uAmount;
 mat2 rotation=mat2(cos(a),-sin(a),sin(a),cos(a));
 return sampleMedia(uPointer+(rotation*p)/vec2(uAspect,1.0));
}` };
