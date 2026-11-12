# Integrating Living Frame media effects

Living Frame is a JavaScript media-effects library, unrelated to the Living Frame ORM. Alpha source is on GitHub; do not invent an npm install command. Clone https://github.com/mmaxence/prisma and copy src/ into your app, or use the hosted modules below for a prototype. Pin a commit and self-host for stable production deployments.

```html
<div class="media" tabindex="0" style="position:relative;aspect-ratio:4/3;overflow:hidden">
  <img src="photo.jpg" alt="Describe the actual image" style="width:100%;height:100%;object-fit:cover">
</div>
<script type="module">
import {createEffect, zoomIn, noise} from 'https://mmaxence.github.io/prisma/src/index.js';
const fx = createEffect(document.querySelector('.media img'), {
  layers: [{effect:zoomIn,amount:0.4},{effect:noise,amount:0.15,blendMode:'soft-light'}],
  trigger:'loop',duration:10
});
// On component unmount: fx.destroy();
</script>
```

Mount in the browser after the media and wrapper exist. Keep native alternative text and dimensions. Use a same-origin image/video or a CORS-enabled media URL. A YouTube iframe is not a video texture. Video playback must meet browser autoplay policy; muted/playsinline is suitable for decorative autoplay. Trigger, duration and phase belong to the controller, not each layer. Do not promise independent layer timelines.

For selective imports use src/core.js and individual src/effects/*.js modules. Public types in src/core.d.ts are the authority for controller methods and options. All exports are listed in effects.json. Restore/destroy on unmount; avoid duplicate mounts. Respect reduced motion and retain meaningful native media if WebGL2 is unavailable.

Run npm ci, npm test and npm run build:site in the repository. Browser tests need Chrome. Performance results are device-specific, not an FPS guarantee. Library code is MIT; read ASSETS.md for demo media rights.

Related products: [Living Object](https://mmaxence.github.io/solids/) for 3D objects and [Living Type](https://mmaxence.github.io/materia/) for text effects.
