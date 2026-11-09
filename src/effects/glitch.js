export default {description:'Short horizontal tears and displaced color blocks that settle back into the source.',name:'glitch',title:'Signal glitch',family:'Digital',useCase:'Short hover accents, click feedback, and punchy transitions.',detailLabel:'Corruption',fragment:`
float glitchHash(float x){return fract(sin(x*127.1)*43758.5453);}
vec4 effect(vec2 uv){
 vec4 source=sampleMedia(uv);float row=floor(uv.y*mix(16.0,64.0,uDetail));
 float seed=glitchHash(row);float pulse=pow(max(0.0,sin(uPhase*2.0+seed*6.283185)),18.0);
 float shift=(seed-0.5)*pulse*(0.025+0.12*uDetail);
 vec2 q=uv+vec2(shift,0.0);vec4 c=sampleMedia(q);
 c.r=sampleMedia(q+vec2(pulse*0.010,0.0)).r;c.b=sampleMedia(q-vec2(pulse*0.010,0.0)).b;
 float tiles=step(0.8,glitchHash(row+floor(uv.x*12.0)*29.0));
 c.rgb=mix(c.rgb,vec3(c.g,c.b,c.r),tiles*pulse*0.4);
 return vec4(mix(source.rgb,c.rgb,uAmount),source.a);
}`};
