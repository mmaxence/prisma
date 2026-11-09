export default {name:'glassBreak',title:'Glass impact',family:'Surface',detailLabel:'Fracture density',description:'An impact sends sharp cracks across the surface. The fractured glass stays in place.',useCase:'Click-driven glass impacts with persistent radial fractures.',impact:true,fragment:`
float crackHash(float n){return fract(sin(n*127.1)*43758.5453);}
// Closest fracture carries its direction: opposing faces catch different light.
void fracture(vec2 p,vec2 a,vec2 b,inout vec3 nearest){
 vec2 d=b-a;float t=clamp(dot(p-a,d)/max(dot(d,d),0.000001),0.0,1.0);
 vec2 delta=p-a-d*t;float dist=length(delta);
 if(dist<nearest.x){vec2 n=normalize(vec2(-d.y,d.x));nearest=vec3(dist,n*sign(dot(delta,n)));}
}
vec2 crackPoint(float i,float step,float count){
 float angle=(i+0.64*(crackHash(i+3.0)-0.5))*6.283185/count;
 vec2 ray=vec2(cos(angle),sin(angle)),normal=vec2(-ray.y,ray.x);
 float radius=step*step*0.038;
 return ray*radius+normal*(crackHash(i*19.0+step*7.0)-0.5)*min(radius*0.28,0.085);
}
vec4 effect(vec2 uv){
 vec4 source=sampleMedia(uv);
 if(uProgress<=0.0||uAmount<=0.0)return source;
 vec2 p=(uv-uPointer)*vec2(uAspect,1.0);
 float count=floor(mix(7.0,12.0,uDetail));
 float reach=uProgress*3.5;
 vec3 nearest=vec3(10.0,0.0,0.0);
 for(int i=0;i<12;i++){
  if(float(i)>=count)break;
  float fi=float(i),seed=crackHash(fi+3.0);
  vec2 a=vec2(0.0);
  for(int j=1;j<=9;j++){
   float fj=float(j);vec2 b=crackPoint(fi,fj,count);
   float ra=length(a),rb=length(b);
   if(ra<reach){vec2 tip=mix(a,b,clamp((reach-ra)/max(rb-ra,0.001),0.0,1.0));fracture(p,a,tip,nearest);}
   // Sparse forked tips diverge from primary radial stress fractures.
   if(j>=2&&j<=5&&crackHash(fi*31.0+fj)>0.65&&reach>rb){
    vec2 d=normalize(b-a),n=vec2(-d.y,d.x)*(seed>0.5?1.0:-1.0);
    vec2 c=b+(d+n*0.65)*(0.04+seed*0.12);
    float growth=clamp((reach-rb)/0.25,0.0,1.0);
    fracture(p,b,mix(b,c,growth),nearest);
    if(growth>0.6)fracture(p,c,mix(c,c+(d+n*0.2)*0.08,(growth-0.6)/0.4),nearest);
   }
   // Discontinuous polygonal stress rings near impact; never a regular web.
   if(j<=3&&crackHash(fi*13.0+fj*43.0)>0.28&&reach>rb){
    vec2 adjacent=crackPoint(mod(fi+1.0,count),fj,count);
    vec2 elbow=mix(b,adjacent,0.45)+normalize(b+adjacent)*0.009*(seed-0.5);
    float growth=clamp((reach-rb)/0.16,0.0,1.0);
    fracture(p,b,mix(b,elbow,min(growth*2.0,1.0)),nearest);
    if(growth>0.5)fracture(p,elbow,mix(elbow,adjacent,(growth-0.5)*2.0),nearest);
   }
   a=b;
  }
 }
 float aa=max(fwidth(nearest.x),0.00028);
 float line=1.0-smoothstep(0.00018,0.00018+aa,nearest.x);
 float edge=1.0-smoothstep(0.00065,0.0028+aa,nearest.x);
 float light=dot(nearest.yz,normalize(vec2(-0.6,0.8)));
 // Refraction stays within a hairline bevel, preserving the stationary image.
 vec2 offset=nearest.yz*edge*0.0016*uAmount/vec2(uAspect,1.0);
 vec3 color=sampleMedia(uv+offset).rgb;
 color=mix(color,color*0.34,line*0.65*uAmount);
 color+=vec3(0.8,0.89,0.95)*max(light,0.0)*max(edge-line*0.4,0.0)*0.58*uAmount;
 color*=1.0-max(-light,0.0)*edge*0.24*uAmount;
 float r=length(p),angle=atan(p.y,p.x);
 float chipRadius=0.004+0.003*crackHash(floor(angle*11.0));
 float chip=(1.0-smoothstep(chipRadius,chipRadius+aa,r))*smoothstep(0.0,0.025,uProgress);
 color=mix(color,vec3(0.72,0.79,0.81),chip*0.6*uAmount);
 return vec4(clamp(color,0.0,1.0),source.a);
}`};
