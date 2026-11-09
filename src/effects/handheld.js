export default {family:'Motion',name:'handheld',title:'Handheld',detailLabel:'Drift character',description:'Subtle camera movement for stills, with periodic organic sway instead of random jitter.',fragment:`
vec4 effect(vec2 uv){float a=uAmount*(0.004+uDetail*0.016); float angle=a*0.5*sin(uPhase*2.0); vec2 p=(uv-0.5)/(1.0+a*5.0); p=mat2(cos(angle),-sin(angle),sin(angle),cos(angle))*p; p+=vec2(sin(uPhase)+0.25*sin(3.0*uPhase),cos(2.0*uPhase)*0.6)*a; return sampleMedia(p+0.5);}
`};
