export default { family:'Distortion', detailLabel:'Wave density', name: 'ripple', title: 'Ripple', description: 'Concentric waves radiate from your point of contact.', fragment: `
vec4 effect(vec2 uv) {
 vec2 p=(uv-uPointer)*vec2(uAspect,1.0); float r=length(p);
 float wave=sin(r*mix(18.0,64.0,uDetail)-uPhase*2.0)*exp(-r*3.0);
 vec2 d=p/max(r,0.001)*wave*0.022*uAmount/vec2(uAspect,1.0);
 vec4 c=sampleMedia(uv+d);
 c.rgb*=1.0+wave*0.055*uAmount;
 return c;
}` };
