# Living Frame

Part of **Living Things — Libraries for a living web**. Formerly Prisma; this is the media-effects library, unrelated to Prisma ORM. Existing repository URLs, browser paths, package imports and APIs remain unchanged.

**0.1.0-alpha.1 · source/local-tarball alpha.** 25 effects for native images/video, ordered layers, five shared motion triggers, one WebGL2 context per controller and zero runtime dependencies. `@prisma-fx/media` is not published to npm; ownership/availability is unverified. Missing private:true is not publication approval.

[Documentation](https://mmaxence.github.io/prisma/documentation/index.html) · [Agent guide](agent-guide.md) · [Runnable image/video example](examples/media/index.html) · [Performance lab](https://mmaxence.github.io/prisma/performance/index.html)

## Install source or a local tarball

In a repository checkout with Node 22:

```sh
npm ci
npm pack
```

Install the actual generated tarball path in an application:

```sh
npm install /absolute/path/to/prisma-fx-media-0.1.0-alpha.1.tgz
```

Or copy `src/` with [LICENSE](LICENSE). Package imports below need a bundler/import map; native browser source URLs need explicit `.js` paths. Source imports are SSR-safe; **mount only in the browser** after native media and a dedicated wrapper exist. The hosted `/prisma/src/*` URLs are mutable prototypes, not pinned releases. Pin a reviewed source commit and self-host for reproducibility; local fixes/docs may differ from the currently deployed site. Do not substitute an unverified registry/CDN install.

## Compose two effects

Keep source dimensions, a meaningful alt description and a dedicated wrapper. This renderer fits a cover-style media image to the wrapper; do not assume every object-fit/layout will match without testing.

```html
<div id="media-host" style="position:relative;aspect-ratio:8/5;overflow:hidden">
  <img id="photo" src="your-cleared-image.svg" alt="Describe the actual content"
       style="display:block;width:100%;height:100%;object-fit:cover">
</div>
```

```js
import {createEffect} from '@prisma-fx/media/core';
import zoomIn from '@prisma-fx/media/effects/zoomIn';
import noise from '@prisma-fx/media/effects/noise';

const media = document.querySelector('#photo');
const fx = createEffect(media, {
  layers: [
    {effect: zoomIn, amount: 0.35, detail: 0.3},
    {effect: noise, amount: 0.14, blendMode: 'soft-light'},
  ],
  trigger: 'loop',
  duration: 8,
  onError(error) { console.warn('Enhancement unavailable:', error.message); },
});
fx.set({duration: 12});
// Register in your client unmount cleanup, before removing/replacing the wrapper:
// fx.destroy();
```

Root `@prisma-fx/media` exposes createEffect and all 25 named effects; `/core` plus default imports from `/effects/*` selects modules without importing the catalog. Both factory entries reference the same function. Public types: [index.d.ts](src/index.d.ts), [core.d.ts](src/core.d.ts). No CommonJS or server-side rendering/mounting contract is provided.

Use **one controller per media element and a dedicated wrapper**. Duplicate mounts/shared style ownership are not guarded/reference counted. The controller owns the decorative canvas, source opacity and temporary wrapper position. Keep controls outside that wrapper, do not concurrently write those owned styles, and destroy before removing/reparenting nodes. Replacing the media element/wrapper requires remounting; source URLs and settings can update in place. Images may mount before load; native source remains until usable data exists.

## Eight practical use cases

[Run the recipe gallery](examples/recipes/index.html) from source or the local built site; [the choice/ownership guide](docs/recipes.md) documents all eight presets and limits. They are application recipes, not effect aliases or new APIs.

| Use case | Restrained default | Meaning stays native |
| --- | --- | --- |
| Product hero | zoomIn .2, still | Original vector product illustration, caption/selection |
| Editorial image | halftone .2, still | Article, alt and figure caption |
| Video cover | duotone .18, still | Cover and explicitly played synthetic source video |
| Gallery card | duotone .12, hover | Actual link/disclosure; keyboard navigation |
| Before/after | duotone .55, still | Labelled original/treated views; native view buttons |
| Portrait treatment | duotone .3, still | Original vector portrait; no photography claim |
| Ambient media | pan .12, loop only after Play | Initial still, source play/pause intent |
| Media in spatial panels | zoomIn .12, still | Real flat Space layout and native note input |

One active Frame controller, consistent amount/detail/trigger options and explicit reverse-order cleanup. Original view removes effects; source-video pause is a separate action. Reduced preference chooses native stills and pauses owned video. Async generations and media-event ownership protect user intent on replacement, visibility and teardown. A pinned MIT Space fixture is example-only, not a Frame dependency or projected/device composition certification. Examples/media are excluded from the tarball; this choice guide is included. Local copies are not live documentation parity. Run npm run check:recipes after building.

## Layers, options and timing

Layers apply in array order, each sampling the previous result. `layers` takes precedence over `effect`. Update through set({layers:...}); mutating a layer object alone is not the update contract. An empty layer array displays passthrough but still owns a canvas/context and can update a playing video. The playground's six-layer limit is UI policy, **not a runtime maximum**. No independent per-layer triggers, phases or timelines.

| Option | Default / meaning |
| --- | --- |
| effect or layers | Imported effect descriptor or array; supply one. No string-name lookup |
| amount / detail | 0.8 / 0.5, each clamped 0–1. Detail's meaning belongs to the effect |
| trigger | loop; alternatives hover, click, scroll, still |
| duration | 6 seconds, clamped 0.2–120; shared cycle/envelope |
| phase | 0–1 still-frame position; not video currentTime |
| blendMode | normal; layer can override |
| pixelRatio | min(device DPR, 1.5), clamped 0.5–2 |
| onError | Receives reported initialization/shader/upload/media failures; not every context event |

Layer keys: effect, amount, detail, blendMode, enabled. False enabled excludes a layer. Blend modes: normal, multiply, screen, overlay, soft-light, hard-light, difference, exclusion, darken, lighten. Use normal for camera motion to avoid an extra blended double image. Triggers are shared: loop is periodic, hover reacts to hover/focus, click reacts to pointer/Enter/Space on an appropriate focusable target, scroll uses wrapper viewport passage, still renders a selected phase. Isolate interactive trigger zones from nested forms/native controls; wrapper key handling is not a complete accessible widget.

| Controller member | Meaning |
| --- | --- |
| set(partialOptions) | Update options/layers; after correcting an upload/CORS/config failure, set({}) can retry |
| pause() / play() | Freeze/resume effect phase; **do not control source video playback** |
| trigger() | Restart a click envelope; not a video playback command |
| reset() | Reset phase/click/impact state |
| preview(layer) / preview(null) | Append a temporary preview, then remove it |
| destroy() | Idempotent canvas/listener/observer/program/texture/target cleanup and source-style restoration |
| canvas | Decorative aria-hidden, pointer-events:none output canvas |
| stats | Snapshot counters/diagnostics; not stable performance/health certification |

Stats: frames, cpuMs, width, height, active, fallback, programs, intermediateTextures, textureUploads, sourceTextureAllocations. cpuMs is CPU submission/draw work, not asynchronous GPU frame time. active reports a pending renderer RAF, not user playback intent. Destroy clears it but does not explicitly force WebGL context loss or prove immediate physical memory reclamation.

## Video, reduced motion and ownership

A playing video can continue texture updates/RAF **while the effect is paused, still, or reduced-motion**. The controller never calls video.play()/pause(). Use the video's own API, handle play() rejection/autoplay/codec restrictions and retain an appropriate poster/label/fallback. Muted/playsinline do not guarantee autoplay. Effect duration/phase do not change source playback speed/time.

```js
export async function playOwnedVideo(video) {
  try { await video.play(); return true; }
  catch { return false; } // Show a useful control/fallback in your application.
}
```

Native video controls may be visually hidden when Frame sets source opacity to zero. Provide visible semantic controls outside the wrapper while enhanced, and restore native controls for native/fallback mode. The runnable example does this for its own video and never automatically resumes playback. Its disposeExample/snapshotExample helpers are application code, not library exports or a general borrowed-media adapter.

Hidden documents and offscreen wrappers suspend the renderer; source playback/decoding intent is separate. Reduced-motion changes suppress time-driven shader motion, not a user's video content. Applications needing fully static/offscreen video must explicitly pause owned media and preserve user intent before any resume. Do not auto-play borrowed or user-paused media because visibility changed. Parent-library pause does not automatically pause Frame.

## Resource, CORS and context failures

- Missing/invalid replacement image/video restores the original native opacity, hides the canvas, sets stats.fallback and reports through onError and the existing wrapper prismaerror event. A later successful native load can recover. The renderer cannot repair missing bytes; alt/poster/adjacent content must remain useful.
- Remote textures require both the correct crossorigin attribute **before src** and permitting response headers. A source can load natively yet fail GPU upload. Resolve the source/server and use set({}) or remount; no code can grant CORS permission.
- Unavailable WebGL2/shader failure keeps native media. This is not a CPU shader fallback or missing-DOM-feature polyfill.
- Context loss reveals native source and sets fallback. Context restoration reinitializes the renderer, when the browser supplies it. It need not emit onError/prismaerror; those are not a comprehensive live error stream. Do not infer recovery timing or a guaranteed context budget.

The example has explicit failure/restore controls for both native media types. Its original SVG and existing FFmpeg synthetic video have documented origins; it uses no third-party footage/font or Type photograph. Reproduction: npm run dev, then `/examples/media/index.html` on localhost:4410. It is excluded from the runtime tarball and copied only into the local site build until an authorized publication.

## Cost, limits and checks

One context per controller; another active layer adds a render pass. The implementation reuses up to two intermediate targets, caches programs and reuses video texture allocation as dimensions permit. More layers, multi-sample effects and higher pixel ratio still cost work; pixel area grows with the square of pixel ratio. Width/height/DPR and source dimensions must be measured in the real composition. ResizeObserver does not guarantee DPR-only or transform-only change detection while asleep; explicit set({}) can wake an eligible resized source. Bounding-rectangle pointer normalization does not invert arbitrary rotated/perspective transforms.

npm run size enforces the existing 12,000-byte gzip concatenated-runtime check; npm run measure:size reports selected minified bundles. Neither measure is tarball size, FPS, hardware GPU cost or a universal mobile budget. Real mobile/Safari/Firefox/thermal/long-session and complete cross-library integration remain separate evidence. Source semantics alone do not certify contrast/keyboard/assistive-tech access.

From this repository checkout (not an installed tarball):

```sh
npm test
npm run measure:size
npm run check:docs
npm run check:examples # requires Chrome; set CHROME to your executable
npm run check:recipes  # eight practical local source/built/installed cases
npm run build:site
```

check:examples uses Node 22 and local Chrome/CDP. It packs/installs offline and bundles actual installed example imports, with no new runtime dependencies. Source/local builds do not publish; live guides/source may remain older until reviewed reconciliation/release.

## License and family

MIT, copyright 2026 Maxence Mauduit; preserve [LICENSE](LICENSE) and [asset notices](ASSETS.md). Library packages exclude demo/test/example media and fonts. Visitor uploads retain their owners' rights and stay in the browser. Existing demo provenance is not a new rights grant or independent rights certification.

[Living Type](https://mmaxence.github.io/materia/) · [Living Object](https://mmaxence.github.io/solids/) · [Living Space](https://mmaxence.github.io/strata/) · [Maxence Mauduit](https://mmaxence.me/)
