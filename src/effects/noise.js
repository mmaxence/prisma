export default {name:'noise',title:'Film noise',family:'Analog',description:'Fine, independently changing grain with luminance-sensitive strength.',useCase:'Editorial imagery, cinematic backgrounds, and breaking up flat gradients.',detailLabel:'Grain size',fragment:`
float grainHash(vec3 p){p=fract(p*0.1031);p+=dot(p,p.yzx+33.33);return fract((p.x+p.y)*p.z);}
vec4 effect(vec2 uv){
 vec4 source=sampleMedia(uv);
 float cellSize=mix(1.0,3.2,uDetail);
 vec2 cell=floor(gl_FragCoord.xy/cellSize);
 float frame=mod(floor(uPhase/6.283185*240.0+0.0001),240.0);
 float grain=(grainHash(vec3(cell,frame))+grainHash(vec3(cell+17.0,frame+91.0))-1.0)*0.17;
 float lum=dot(source.rgb,vec3(0.2126,0.7152,0.0722));
 float response=0.25+0.75*sin(clamp(lum,0.0,1.0)*3.141593);
 return vec4(clamp(source.rgb+grain*response*uAmount,0.0,1.0),source.a);
}`};
