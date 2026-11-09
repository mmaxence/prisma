export default {description:'Color bleed, tracking noise, and a traveling tape tear with adjustable wear.',name:'vhs',title:'VHS tape',family:'Analog',useCase:'Home-video memories, music promos, and worn title sequences.',detailLabel:'Tape wear',fragment:`
vec4 effect(vec2 uv){
 vec4 source=sampleMedia(uv);
 float roll=sin(uv.y*6.283185+uPhase);float tear=pow(max(roll,0.0),36.0);
 float wobble=(sin(uv.y*34.0+uPhase*2.0)*0.0015+tear*0.035)*uDetail;
 vec2 q=uv+vec2(wobble,0.0);vec4 c=sampleMedia(q);
 c.r=sampleMedia(q+vec2(0.006+uDetail*0.009,0.0)).r;c.b=sampleMedia(q-vec2(0.003,0.0)).b;
 float noise=sin(dot(floor(uv*vec2(540.0,320.0)),vec2(12.9898,78.233))+sin(uPhase)*18.0);
 float tracking=pow(0.5+0.5*sin(uv.y*6.283185-uPhase),48.0);
 vec3 color=c.rgb*vec3(1.04,0.96,0.91)+noise*0.035*uDetail+tracking*0.13*uDetail;
 return vec4(mix(source.rgb,color,uAmount),source.a);
}`};
