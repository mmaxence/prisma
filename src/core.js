const blendModes = ['normal','multiply','screen','overlay','soft-light','hard-light','difference','exclusion','darken','lighten'];
const TAU = Math.PI * 2;
const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
const number = (value, fallback, min, max) => Number.isFinite(Number(value)) ? clamp(Number(value), min, max) : fallback;
const vertex = `#version 300 es
out vec2 vUv;
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);vUv=p;gl_Position=vec4(p*2.0-1.0,0,1);}`;
const prelude = `#version 300 es
precision highp float;
in vec2 vUv;out vec4 fragColor;
uniform sampler2D uMedia;
uniform int uBlendMode;
uniform vec2 uCover,uPointer;
uniform float uPhase,uAmount,uAspect,uDetail,uProgress;
vec4 sampleMedia(vec2 uv){return texture(uMedia,clamp((uv-0.5)*uCover+0.5,vec2(0.001),vec2(0.999)));}
`;

const composite = `
vec3 overlayBlend(vec3 a,vec3 b){return mix(2.0*a*b,1.0-2.0*(1.0-a)*(1.0-b),step(vec3(0.5),a));}
void main(){
 vec4 result=effect(vUv);
 if(uBlendMode==0||uAmount<=0.0){fragColor=result;return;}
 vec3 base=sampleMedia(vUv).rgb,b=clamp(result.rgb,0.0,1.0),color=b;
 if(uBlendMode==1)color=base*b;
 else if(uBlendMode==2)color=1.0-(1.0-base)*(1.0-b);
 else if(uBlendMode==3)color=overlayBlend(base,b);
 else if(uBlendMode==4){vec3 d=mix(((16.0*base-12.0)*base+4.0)*base,sqrt(base),step(vec3(0.25),base));color=mix(base-(1.0-2.0*b)*base*(1.0-base),base+(2.0*b-1.0)*(d-base),step(vec3(0.5),b));}
 else if(uBlendMode==5)color=overlayBlend(b,base);
 else if(uBlendMode==6)color=abs(base-b);
 else if(uBlendMode==7)color=base+b-2.0*base*b;
 else if(uBlendMode==8)color=min(base,b);
 else if(uBlendMode==9)color=max(base,b);
 fragColor=vec4(mix(result.rgb,color,clamp(uAmount,0.0,1.0)),result.a);
}`;

function validate(config){
 const entries=config.layers===undefined?[{effect:config.effect}]:config.layers;
 if(!Array.isArray(entries)||entries.some(layer=>!layer||typeof layer.effect?.fragment!=='string'))throw new TypeError('Pass an effect module or an array of valid layers');
}

/** Enhance an existing image or video. The original remains the accessible fallback. */
export function createEffect(media, options = {}) {
 if (!(media instanceof HTMLImageElement || media instanceof HTMLVideoElement)) throw new TypeError('Expected an HTMLImageElement or HTMLVideoElement');
 const host = media.parentElement;
 if (!host) throw new Error('Media must be mounted inside a wrapper');
 validate(options);
 const canvas = document.createElement('canvas');
 canvas.setAttribute('aria-hidden','true');
 Object.assign(canvas.style,{position:'absolute',inset:'0',width:'100%',height:'100%',pointerEvents:'none',opacity:'0'});
 const previousPosition = host.style.position, previousOpacity = media.style.opacity;
 if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
 host.append(canvas);
 const video = media instanceof HTMLVideoElement;
 const motion = matchMedia('(prefers-reduced-motion: reduce)');
 const passthrough={name:'original',fragment:'vec4 effect(vec2 uv){return sampleMedia(uv);}'};
 let cache=new Map(),targets=[],targetSize='',previewLayer=null;
 let config = {...options}, gl, program, texture, uniforms, raf=0, disposed=false, failed=false, visible=true, paused=false;
 let impactProgress=0, phase=0, strength=0, target=0, last=0, dirty=true, uploaded=false, lastVideoTime=-1, clickStart=-1, lost=false;
 let impact=[0.5,0.5],pointer=[0.5,0.5], frames=0, cpuMs=0;
 const listeners=[];
 const on=(el,name,fn)=>{el.addEventListener(name,fn);listeners.push(()=>el.removeEventListener(name,fn));};
 const layers=()=>config.layers?config.layers.filter(l=>l.enabled!==false):[{effect:config.effect,amount:config.amount,detail:config.detail,blendMode:config.blendMode}];
 const mode=()=>['loop','hover','click','scroll','still'].includes(config.trigger)?config.trigger:'loop';
 const opts=()=>({amount:number(config.amount,0.8,0,1),duration:number(config.duration,6,0.2,120),dpr:number(config.pixelRatio,Math.min(devicePixelRatio,1.5),0.5,2)});
 function report(error){failed=true;cancelAnimationFrame(raf);raf=0;canvas.style.opacity='0';media.style.opacity=previousOpacity;config.onError?.(error);host.dispatchEvent(new CustomEvent('prismaerror',{detail:error}));}
 function compile(type, source){const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){const error=gl.getShaderInfoLog(shader);gl.deleteShader(shader);throw new Error(error);}return shader;}
 function makeProgram(effect){
  if(cache.has(effect)){const item=cache.get(effect);cache.delete(effect);cache.set(effect,item);({program,uniforms}=item);gl.useProgram(program);return;}
  const shaders=[];let next;
  try {shaders.push(compile(gl.VERTEX_SHADER,effect.vertex||vertex));shaders.push(compile(gl.FRAGMENT_SHADER,prelude+effect.fragment+composite));next=gl.createProgram();shaders.forEach(s=>gl.attachShader(next,s));gl.linkProgram(next);if(!gl.getProgramParameter(next,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(next));}
  catch(error){if(next)gl.deleteProgram(next);throw error;}
  finally{shaders.forEach(s=>gl.deleteShader(s));}
  program=next;gl.useProgram(program);
  uniforms=Object.fromEntries(['uBlendMode','uMedia','uCover','uPointer','uPhase','uAmount','uAspect','uDetail','uProgress'].map(n=>[n,gl.getUniformLocation(program,n)]));
  cache.set(effect,{program,uniforms});
  // Bound the shader cache while retaining recently auditioned treatments.
  if(cache.size>24){const [key,item]=cache.entries().next().value;gl.deleteProgram(item.program);cache.delete(key);}
 }
 function releaseTargets(){
  for(const t of targets){gl.deleteTexture(t.texture);gl.deleteFramebuffer(t.framebuffer);}
  targets=[];targetSize='';
 }
 function allocateTargets(width,height){
  releaseTargets();
  try{
   for(let i=0;i<2;i++){
    const t={texture:gl.createTexture(),framebuffer:gl.createFramebuffer()};targets.push(t);
    gl.bindTexture(gl.TEXTURE_2D,t.texture);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,width,height,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.bindFramebuffer(gl.FRAMEBUFFER,t.framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,t.texture,0);
    if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)throw new Error('Unable to allocate effect stack');
   }
   targetSize=width+'x'+height;
  }catch(error){releaseTargets();throw error;}
  finally{gl.bindFramebuffer(gl.FRAMEBUFFER,null);}
 }
 function init(){
  gl=canvas.getContext('webgl2',{alpha:true,antialias:false,depth:false,premultipliedAlpha:false,preserveDrawingBuffer:false});
  if(!gl)throw new Error('WebGL2 unavailable; native media retained');
  cache=new Map();targets=[];targetSize='';
  makeProgram(layers()[0]?.effect||passthrough);texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);uploaded=false;dirty=true;failed=false;
 }
 function wake(){dirty=true;if(!raf&&!disposed&&!failed&&!lost&&visible&&!document.hidden)raf=requestAnimationFrame(draw);}
 function draw(now){
  raf=0;if(disposed||failed||lost||!visible||document.hidden)return;
  const start=performance.now(), dt=last?Math.min((now-last)/1000,0.05):0;last=now;
  const {amount,duration,dpr}=opts(), m=mode(), reduced=motion.matches;
  const rect=host.getBoundingClientRect();
  if(!rect.width||!rect.height)return;
  const width=Math.max(1,Math.round(rect.width*dpr)),height=Math.max(1,Math.round(rect.height*dpr));
  if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;dirty=true;}
  const mw=video?media.videoWidth:media.naturalWidth,mh=video?media.videoHeight:media.naturalHeight;
  if(!mw||!mh||(video&&media.readyState<2))return;
  if(m==='loop'||m==='still')target=1;
  if(m==='scroll'){target=clamp((innerHeight-rect.top)/(innerHeight+rect.height),0,1);strength=target;}
  if(m==='click')target=clickStart<0?0:Math.sin(Math.PI*clamp((now-clickStart)/(duration*1000),0,1));
  if(reduced){strength=target;phase=0;}else if(!paused){strength+=(target-strength)*(1-Math.exp(-dt*12));if(m==='loop'||m==='hover'||m==='click')phase=(phase+dt/duration*TAU)%TAU;if(m==='scroll')phase=target*TAU;}
  if(m==='still'){phase=number(config.phase,0,0,1)*TAU;strength=1;}
  const videoChanged=video&&media.currentTime!==lastVideoTime;
  if(dirty||!uploaded||videoChanged||(!paused&&!reduced&&m!=='still')){
   try {
    gl.useProgram(program);gl.bindTexture(gl.TEXTURE_2D,texture);
    if(!uploaded||videoChanged){gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,media);uploaded=true;lastVideoTime=media.currentTime;}
    const active=layers();if(previewLayer)active.push(previewLayer);if(!active.length)active.push({effect:passthrough,amount:0});

    if(active.length>1&&targetSize!==width+'x'+height)allocateTargets(width,height);
    if(active.length===1&&!previewLayer&&targets.length)releaseTargets();
    const hasImpact=active.some(l=>l!==previewLayer&&l.effect.impact);
    if(!paused)impactProgress=hasImpact?(m==='click'?(clickStart<0?0:clamp((now-clickStart)/(duration*1000),0,1)):(0.5-0.5*Math.cos(phase))*(m==='hover'?strength:1)):0;
    for(const [index,layer] of active.entries()){
    makeProgram(layer.effect);gl.bindTexture(gl.TEXTURE_2D,index?targets[(index-1)%2].texture:texture);gl.bindFramebuffer(gl.FRAMEBUFFER,index===active.length-1?null:targets[index%2].framebuffer);
    gl.viewport(0,0,width,height);const a=rect.width/rect.height,ma=mw/mh;
    gl.uniform2f(uniforms.uCover,index?1:Math.min(a/ma,1),index?1:Math.min(ma/a,1));gl.uniform2f(uniforms.uPointer,...(layer.effect.impact?impact:pointer));
    gl.uniform1i(uniforms.uBlendMode,Math.max(0,blendModes.indexOf(layer.blendMode??config.blendMode)));
    gl.uniform1f(uniforms.uProgress,layer===previewLayer?0.65:reduced?0:impactProgress);
    gl.uniform1f(uniforms.uDetail,number(layer.detail??config.detail,0.5,0,1));gl.uniform1f(uniforms.uPhase,layer===previewLayer?phase+Math.PI/2:phase);gl.uniform1f(uniforms.uAmount,number(layer.amount,amount,0,1)*(layer===previewLayer||layer.effect.impact?1:strength));gl.uniform1f(uniforms.uAspect,a);gl.uniform1i(uniforms.uMedia,0);
    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLES,0,layer.effect.vertices||3);
    }
    canvas.style.opacity='1';media.style.opacity='0';frames++;dirty=false;
   }catch(error){report(error);return;}
  }
  cpuMs=performance.now()-start;
  const moving=(layers().length>0||previewLayer)&&!paused&&!reduced&&(m==='loop'||(m==='hover'&&(target>0||strength>0.001))||(m==='click'&&clickStart>=0&&now-clickStart<duration*1000+500));
  if(moving||(video&&!media.paused&&!media.ended))raf=requestAnimationFrame(draw);
 }
 on(host,'pointermove',e=>{const r=host.getBoundingClientRect();pointer=[clamp((e.clientX-r.left)/r.width,0,1),1-clamp((e.clientY-r.top)/r.height,0,1)];if(mode()!=='still'&&layers().some(l=>!l.effect.impact))wake();});
 on(host,'pointerenter',()=>{if(mode()==='hover'){target=1;wake();}});
 on(host,'pointerleave',()=>{if(mode()==='hover'){target=0;wake();}});
 on(host,'focusin',()=>{if(mode()==='hover'){target=1;wake();}});
 on(host,'focusout',()=>{if(mode()==='hover'){target=0;wake();}});
 function trigger(){impactProgress=0;impact=[...pointer];clickStart=performance.now();last=0;wake();}
 on(host,'click',e=>{if(mode()==='click'){if(e.detail){const r=host.getBoundingClientRect();pointer=[clamp((e.clientX-r.left)/r.width,0,1),1-clamp((e.clientY-r.top)/r.height,0,1)];}trigger();}});
 on(host,'keydown',e=>{if(mode()==='click'&&(e.key==='Enter'||e.key===' ')){e.preventDefault();trigger();}});
 on(window,'scroll',()=>{if(mode()==='scroll')wake();});
 on(document,'visibilitychange',()=>{last=0;if(document.hidden){cancelAnimationFrame(raf);raf=0;}else wake();});
 on(motion,'change',wake);
 on(media,video?'loadeddata':'load',()=>{uploaded=false;wake();});
 if(video)for(const event of ['play','pause','seeked','timeupdate'])on(media,event,wake);
 on(canvas,'webglcontextlost',e=>{e.preventDefault();lost=true;cancelAnimationFrame(raf);raf=0;canvas.style.opacity='0';media.style.opacity=previousOpacity;});
 on(canvas,'webglcontextrestored',()=>{lost=false;program=null;try{init();wake();}catch(error){report(error);}});
 const resize=new ResizeObserver(wake);resize.observe(host);
 const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=0;if(visible)wake();else{cancelAnimationFrame(raf);raf=0;}});intersection.observe(host);
 try{init();wake();}catch(error){report(error);}
 return {
  canvas,
  preview(layer=null){if(disposed)return;if(layer)validate({layers:[layer]});previewLayer=layer;wake();},
  reset(){config.phase=0;impactProgress=0;clickStart=-1;phase=0;strength=0;last=0;wake();},
  set(next){if(disposed)return;validate({...config,...next});const old=config.effect,oldTrigger=config.trigger;config={...config,...next};if(next.trigger&&next.trigger!==oldTrigger){target=0;strength=0;clickStart=-1;}try{if(failed&&gl&&!lost){failed=false;uploaded=false;if(!texture)init();else makeProgram(layers()[0]?.effect||passthrough);}else if(next.effect&&next.effect!==old&&!config.layers&&!lost)makeProgram(next.effect);wake();}catch(error){report(error);}},
  pause(){paused=true;wake();},play(){paused=false;last=0;wake();},trigger,
  get stats(){return {frames,cpuMs,width:canvas.width,height:canvas.height,active:!!raf,fallback:failed||lost,programs:cache.size,intermediateTextures:targets.length};},
  destroy(){if(disposed)return;disposed=true;cancelAnimationFrame(raf);resize.disconnect();intersection.disconnect();listeners.forEach(fn=>fn());if(gl){gl.deleteTexture(texture);for(const item of cache.values())gl.deleteProgram(item.program);releaseTargets();cache.clear();}canvas.remove();media.style.opacity=previousOpacity;host.style.position=previousPosition;}
 };
}
