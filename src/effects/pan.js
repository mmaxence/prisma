export default {family:'Motion',name:'pan',title:'Gentle pan',detailLabel:'Travel distance',description:'A slow left-to-right camera drift with a soft return and protected edges.',fragment:`
vec4 effect(vec2 uv){float crop=uAmount*(0.035+uDetail*0.13); vec2 p=(uv-0.5)/(1.0+crop*2.0)+0.5; p.x+=sin(uPhase)*crop*0.82; return sampleMedia(p);}
`};
