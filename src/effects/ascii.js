export default {description:'Luminance becomes a field of terminal characters under a slow phosphor sweep.',name:'ascii',title:'ASCII terminal',family:'Digital',useCase:'Developer launch pages, terminal aesthetics, and editorial portraits.',detailLabel:'Character density',fragment:`
vec4 effect(vec2 uv){
 vec4 source=sampleMedia(uv);float rows=mix(0.45,1.0,uDetail)*min(72.0,0.14/max(fwidth(uv.y),0.0001));
 vec2 grid=vec2(rows*uAspect*0.65,rows),cell=floor(uv*grid),p=fract(uv*grid);
 vec4 c=sampleMedia((cell+0.5)/grid);float lum=dot(c.rgb,vec3(0.2126,0.7152,0.0722));
 float horizontal=1.0-smoothstep(0.07,0.13,abs(p.y-0.5));
 float vertical=1.0-smoothstep(0.07,0.13,abs(p.x-0.5));
 float dotGlyph=1.0-smoothstep(0.10,0.17,length(p-vec2(0.5,0.25)));
 float cross=max(horizontal,vertical);
 float hashGlyph=max(1.0-smoothstep(0.05,0.1,abs(abs(p.x-0.5)-0.19)),1.0-smoothstep(0.05,0.1,abs(abs(p.y-0.5)-0.19)));
 float glyph=mix(dotGlyph,horizontal,smoothstep(0.16,0.24,lum));
 glyph=mix(glyph,cross,smoothstep(0.36,0.44,lum));
 glyph=mix(glyph,hashGlyph,smoothstep(0.61,0.69,lum));
 glyph*=step(0.12,p.x)*step(p.x,0.88)*step(0.12,p.y)*step(p.y,0.88);
 float sweep=0.8+0.2*sin(uPhase+uv.y*6.283185);
 vec3 color=vec3(0.015,0.025,0.02)+vec3(0.66,0.98,0.72)*glyph*(0.25+lum*0.75)*sweep;
 return vec4(mix(source.rgb,color,uAmount),source.a);
}`};
