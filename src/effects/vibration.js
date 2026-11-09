export default {family:'Motion',name:'vibration',title:'Interval vibration',detailLabel:'Burst length',description:'A brief damped shake between quiet holds, with a safe crop to hide the edges.',fragment:`
vec4 effect(vec2 uv){float t=mod(uPhase+0.55,6.2831853); float span=mix(0.7,2.6,uDetail); float gate=sin(clamp(t/span,0.0,1.0)*3.14159265); gate*=gate; vec2 shift=vec2(sin(t*32.0),cos(t*39.0))*gate*uAmount*0.014; return sampleMedia((uv-0.5)/(1.0+0.04*uAmount)+0.5+shift);}
`};
