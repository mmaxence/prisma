import {createEffect, prism, noise, retroTv, matrix, vhs, glitch, ascii, thermal, dither, pixelate, rgbSplit, glassBreak, duotone, scanlines, type Options} from '../src/index.js';
import {createEffect as core} from '../src/core.js';
import liquid from '../src/effects/liquid.js';
const opts: Options={effect:prism,trigger:'hover'};
const fx=createEffect(document.createElement('img'),opts);
fx.set({effect:liquid,trigger:'scroll'});
core(document.createElement('video'),{effect:liquid}).destroy();
fx.stats.frames.toFixed();
fx.destroy();

for (const effect of [noise,retroTv,matrix,vhs,glitch,ascii,thermal,dither,pixelate,rgbSplit,glassBreak,duotone,scanlines]) fx.set({effect,detail:.7});

fx.set({blendMode:'soft-light'});
// @ts-expect-error unsupported blend mode
fx.set({blendMode:'invalid'});

const composed=createEffect(document.createElement('img'),{layers:[{effect:noise,amount:.3},{effect:duotone,blendMode:'screen',enabled:true}]});
composed.set({layers:[]});composed.destroy();
