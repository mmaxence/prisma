export default { family:'Analog', detailLabel:'Line density', name:'scanlines', title:'Scanlines', description:'Phosphor lines and a traveling refresh band, like a quiet analog display.', fragment:`
vec4 effect(vec2 uv){
 vec4 source=sampleMedia(uv);
 float frequency=min(mix(50.0,300.0,uDetail),0.35/max(fwidth(uv.y),0.0001));
 float lines=0.76+0.24*cos(uv.y*frequency*6.283185);
 float band=pow(0.5+0.5*sin(uv.y*6.283185-uPhase),12.0);
 vec3 color=source.rgb*lines*(0.85+0.45*band);
 return vec4(mix(source.rgb,color,uAmount),source.a);
}` };
