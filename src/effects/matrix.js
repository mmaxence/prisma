export default {description:'Green procedural glyphs reveal the image beneath looping columns of falling code.',name:'matrix',title:'Code rain',family:'Digital',useCase:'Cyberpunk intros, developer portfolios, and data-themed reveals.',detailLabel:'Code density',fragment:`
float codeHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
vec4 effect(vec2 uv){
 vec4 source=sampleMedia(uv);float rows=mix(0.45,1.0,uDetail)*min(72.0,0.14/max(fwidth(uv.y),0.0001));
 vec2 grid=vec2(rows*uAspect*0.65,rows),cell=floor(uv*grid),local=fract(uv*grid);
 float lum=dot(sampleMedia((cell+0.5)/grid).rgb,vec3(0.2126,0.7152,0.0722));
 float seed=codeHash(vec2(cell.x,3.0));float speed=1.0+floor(seed*3.0);
 float trail=fract(uv.y+uPhase/6.283185*speed+seed);
 float rain=exp(-trail*7.0)*smoothstep(0.0,0.055,trail);float head=exp(-pow((trail-0.065)/0.035,2.0));
 vec2 pixel=floor(local*vec2(5.0,7.0));
 float symbol=step(0.45,codeHash(cell*13.0+pixel));
 vec2 aa=max(fwidth(local),vec2(0.015));
 symbol*=smoothstep(0.08,0.08+aa.x,local.x)*(1.0-smoothstep(0.88-aa.x,0.88,local.x))*smoothstep(0.06,0.06+aa.y,local.y)*(1.0-smoothstep(0.9-aa.y,0.9,local.y));
 float ink=symbol*(0.10+lum*0.85)*(0.3+rain*1.5);
 vec3 color=vec3(0.025,0.95,0.23)*ink+vec3(0.55,1.0,0.67)*head*symbol*0.55;
 return vec4(mix(source.rgb,color,uAmount),source.a);
}`};
