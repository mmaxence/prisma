export default {family:'Motion',name:'zoomIn',title:'Slow zoom in',detailLabel:'Zoom range',description:'A slow push in with an eased return. A seamless breathing loop for editorial images.',fragment:`
vec4 effect(vec2 uv){float t=0.5+0.5*sin(uPhase); float z=1.0+uAmount*(0.05+uDetail*0.3)*(0.15+0.85*t); return sampleMedia((uv-0.5)/z+0.5);}
`};
