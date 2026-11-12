# Integrating Living Frame

Living Things · **@prisma-fx/media 0.1.0-alpha.1**. Source/local-tarball alpha; not published to npm and registry ownership/availability is unverified. This is the media-effects project, unrelated to Prisma ORM. Keep legacy identities, imports, events and browser URLs.

## Choose the delivery

Pack a reviewed repository checkout with npm pack, then install the actual local tarball path. Or self-host src/ with LICENSE. Bare package imports require a bundler/import map; native URLs use explicit .js paths. Existing `https://mmaxence.github.io/prisma/src/*` modules are mutable prototypes and may lag local fixes. Do not invent a registry/CDN install or treat a Pages build as an npm release.

[Runnable image/video example](examples/media/index.html) is self-contained: original SVG, already-documented synthetic test video, no remote media/font. It has separate effect/video controls and failure/restore buttons. Source and built-site paths use the same import map. Example helpers are application code, not runtime exports. The runtime tarball excludes its assets/code.

## Minimal selective imports

```js
import {createEffect} from '@prisma-fx/media/core';
import zoomIn from '@prisma-fx/media/effects/zoomIn';
import noise from '@prisma-fx/media/effects/noise';
const media = document.querySelector('#photo');
const fx = createEffect(media, {
  layers: [{effect:zoomIn,amount:0.35},{effect:noise,amount:0.14,blendMode:'soft-light'}],
  trigger:'loop', duration:8,
  onError(error) { console.warn('Native fallback:', error.message); },
});
// Register fx.destroy() in your client cleanup before removing/replacing the host.
```

For native source, use the real `.js` paths under your copy of src and explicit media HTML/dimensions/alt text; see [README](README.md). Root includes named catalog exports; /core + /effects/* default imports are selective. [index.d.ts](src/index.d.ts), [core.d.ts](src/core.d.ts) and package.json define the versioned public API. Imports are SSR-safe, mounting requires browser DOM/media; no CommonJS/SSR renderer promise.

## Ownership and updates

- One controller per real image/video with a dedicated wrapper. Duplicate initialization/shared-wrapper style restoration is caller responsibility. Canvas is decorative; source opacity and temporary wrapper positioning are controller-owned. Keep semantic controls outside that wrapper.
- Mount after nodes exist; media can still be loading. Preserve native labels/alt/poster/adjacent source explanation. A YouTube iframe is not a texture source. Dimensions/cover-style layout matter; test actual fit.
- Use set(partialOptions) for configuration/layer changes; source URL load events are observed. Layers take precedence over effect. Each layer is effect/amount/detail/blendMode/enabled; no per-layer trigger or timing. Playground six-layer limit is not a runtime limit.
- Empty layers are passthrough, not resource disposal. Destroy on unmount or when replacing media/host; idempotent cleanup restores styles and releases resources, but does not force physical context reclamation.
- set, preview, pause, play, trigger, reset, destroy, canvas and stats are the public controller. No generic pause-all-media, seek, video source management, shared scheduler or renderer/object texture bridge is provided.

## Effect motion is not playback intent

pause()/play() control the effect phase only. A playing source video can keep RAF/texture updates while effect phase is paused, still or reduced-motion. Use video.pause()/play() explicitly for owned source content, handle play() rejection and preserve a user's pause across visibility changes. Never auto-resume borrowed/user-paused media.

The renderer observes document hidden/offscreen and live reduced preference; source decoding/playback policy is separate. Native video controls can be visually hidden by source opacity while enhanced: use visible external semantic buttons and restore native controls in fallback. Example controls demonstrate this narrow owned-media policy, not a complete user-intent adapter for every application.

## Failure and recovery

Invalid source resources restore native visibility, set stats.fallback and report through onError/prismaerror. A later good load can recover automatically. Missing content still needs useful alt/poster/explanation. CORS-enabled remote textures require crossorigin before src and permissive headers. Correct a tainted source/configuration and use set({}) or remount; a loaded native image does not prove texture access.

WebGL2 unavailable leaves native media. Context loss also reveals source; browser restoration rebuilds the renderer. Not every context event produces onError/prismaerror, and recovery timing is not guaranteed. This is not a software effect or missing-DOM polyfill. Stats are counters/snapshots: active is a pending RAF, cpuMs is CPU submission rather than GPU frame time. More layers/context count/resolution need actual budgets.

## Verify before claiming compatibility

Check the actual images/video codec, replacement failure, CORS and context restore, load/resize/DPR, explicit phase pause versus video playback, live preference/user pause, repeated cleanup, focus/keyboard, native/no-JS content and contrast. Browser bounding rectangles are not inverse perspective coordinates. Software-renderer/local transfer checks do not certify physical phones, Safari/Firefox, thermal/memory or multi-library performance.

Repository: npm test, npm run measure:size, npm run check:docs, npm run check:examples, npm run build:site. Chrome is required for browser checks; set CHROME. Preserve MIT and ASSETS notices; do not assume other products' images inherit runtime-code rights. Local docs are not live publication.

Related: [Living Type](https://mmaxence.github.io/materia/) · [Living Object](https://mmaxence.github.io/solids/) · [Living Space](https://mmaxence.github.io/strata/). Independent controllers do not automatically compose.
