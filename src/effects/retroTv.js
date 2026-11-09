export default {description:'Curved tube edges, phosphor lines, soft color bleed, and a moving refresh band.',name:'retroTv',title:'Retro TV',family:'Analog',useCase:'Archive clips, music visuals, and nostalgic product stories.',detailLabel:'Tube character',fragment:`
vec4 effect(vec2 uv){
 vec4 source=sampleMedia(uv);vec2 p=uv*2.0-1.0;
 vec2 screen=p*(1.0+dot(p,p)*(0.025+0.055*uDetail));vec2 q=screen*0.5+0.5;
 float lineCount=min(330.0,0.4/max(fwidth(uv.y),0.0001));
 float lines=0.87+0.13*cos(q.y*lineCount*6.283185);
 float refresh=0.92+0.12*pow(0.5+0.5*sin(q.y*6.283185-uPhase),8.0);
 vec4 c=sampleMedia(q);c.r=sampleMedia(q+vec2(0.0025*uDetail,0.0)).r;c.b=sampleMedia(q-vec2(0.0025*uDetail,0.0)).b;
 float vignette=1.0-0.22*dot(p,p);float edge=1.0-smoothstep(0.97,1.0,max(abs(screen.x),abs(screen.y)));
 vec3 color=c.rgb*lines*refresh*vignette*edge;
 return vec4(mix(source.rgb,color,uAmount),source.a);
}`};
