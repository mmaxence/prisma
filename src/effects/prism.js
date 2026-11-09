export default { family: 'Distortion', name: 'prism', title: 'Prism', description: 'Chromatic glass. Light separates along a breathing lens.', fragment: `
vec4 effect(vec2 uv) {
 vec2 p=uv-uPointer; float r=length(p); float lens=exp(-r*r*5.0);
 vec2 d=p*lens*(0.16+0.09*sin(uPhase))*uAmount;
 vec4 c=sampleMedia(uv+d);
 c.r=sampleMedia(uv+d*1.30).r;
 c.b=sampleMedia(uv+d*0.70).b;
 return c;
}` };
