export default { family: 'Surface', name: 'fluted', title: 'Fluted glass', description: 'Sculptural glass ribs with moving refraction and dispersion.', fragment: `
vec4 effect(vec2 uv) {
 float rib=sin(uv.x*94.24778+sin(uPhase)*1.6);
 vec2 d=vec2(rib*0.022*uAmount,0.0);
 vec4 c=sampleMedia(uv+d);
 c.r=sampleMedia(uv+d*1.18).r; c.b=sampleMedia(uv+d*0.82).b;
 c.rgb*=1.0+pow(max(rib,0.0),12.0)*0.22*uAmount;
 return c;
}` };
