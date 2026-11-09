export default {family:'Motion',name:'zoomOut',title:'Slow zoom out',detailLabel:'Zoom range',description:'Start close, pull back, and ease into the next loop.',fragment:`
vec4 effect(vec2 uv){float t=0.5-0.5*sin(uPhase); float z=1.0+uAmount*(0.05+uDetail*0.3)*(0.15+0.85*t); return sampleMedia((uv-0.5)/z+0.5);}
`};
