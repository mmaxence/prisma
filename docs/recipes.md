# Eight practical Frame recipes

Local/source alpha 0.1.0-alpha.1, not a registry or live-site release. Run [the gallery](../examples/recipes/index.html) from an HTTP server. Select a recipe or open its hash: #hero, #editorial, #cover, #gallery, #comparison, #portrait, #ambient, #spatial. All source sections and native video controls remain usable without JavaScript. Examples/fixtures/media are excluded from the runtime tarball; this guide is included. No new media service, external font or source upload is involved.

## Choose by the task

| Recipe | Preset | Native meaning and useful action |
| --- | --- | --- |
| Product hero | zoomIn, amount .2, detail .25, still phase .5 | Original vector lamp/books illustration, caption and a semantic local selection button. This is not product photography. |
| Editorial image | halftone, .2 / .6, still | Existing original mountain/sun illustration, article/caption in HTML. Low print texture, not perpetual distortion. |
| Video cover | duotone, .18 / .45, still | Illustrated cover first; Play explicitly switches to the existing silent synthetic color-pattern video. Source controls stay outside the effect wrapper. |
| Gallery card | duotone, .12 / .45, hover | A real anchor/disclosure supplies navigation. Hover treatment is optional feedback; keyboard controls work without it. |
| Before/after | duotone, .55 / .45, still | Labelled original and treated views, with native view buttons with pressed states for both/original/treated. No drag-only reveal or canvas-only labels. Original-only destroys the treatment. |
| Portrait treatment | duotone, .3 / .45, still | An original stylized vector person, not authentic photography or a likeness claim. Native alt/caption remains the description. |
| Ambient media | pan, .12 / .2, loop duration 18 | A still until Play. Pause video/use still clears playback intent. Source/phase pause, original view, reduced policy and visibility are separate. |
| Media in spatial panels | zoomIn, .12 / .2, still | Real flat Space panels with dedicated Frame wrapper, native note/selection and child-before-parent disposal. No projected-pointer qualification. |

These are application presets, not new effects/aliases. Reuse a low-strength color treatment for cover/card/portrait, print texture for editorial, and camera motion only for the appropriate image or explicitly opted-in ambient video. Do not add layers merely to differentiate examples. All eight use one selected effect/context, at most one active controller at a time. An actual multi-layer composition is still available in the minimal media example; each additional layer can require another pass/target. All 25 existing effects and imports stay intact.

## Consistent options and updates

Every definition uses the actual effect descriptor, amount/detail (0–1), trigger, duration, phase and pixelRatio. There is no new strength/speed/global timeline option. Amount is treatment intensity, not media opacity; detail is effect-specific, not a universal quality setting. The guide's still phase is a shader phase, not video currentTime. duration is seconds for the shared effect envelope, not video playback speed. The gallery uses pixelRatio:1 as a local example cost choice, not a new library default.

Frame set({amount}) updates a mounted controller. A source URL may update on the same media; the existing load/error handlers and set({}) retry handle it. Replacing the actual img/video/wrapper requires destroy/remount. Replace image source demonstrates that transaction: destroy child/parent, clone a new native image with a truthful alternate description, replace the node, mount the new source. Native note/caption controls remain the same nodes. Source/caption edits are application-owned; ensure the description still fits replacement content.

The controller owns source opacity, its canvas and temporary wrapper position. One controller per source and a dedicated wrapper are caller responsibilities; duplicate/shared ownership is not automatically guarded. Keep semantic actions, video controls, comparison view buttons and forms outside the wrapper. Do not concurrently write controller-owned styles. Original/treated image aspect-ratio and object-fit:cover match the renderer's cover treatment; arbitrary contain/orientation/layout assumptions need separate tests.

## Source playback is not effect phase

Pause effect phase only calls controller.pause/play. A playing video can keep advancing, uploading textures and requesting renderer frames while phase is paused, still, or the runtime sees reduced preference. Phase pause is not source-video pause or zero-RAF. The gallery's Play/Pause source buttons own the video API and handle rejected play promises. The source is muted/playsinline, but no autoplay or codec availability is promised. Ambient playback never begins without explicit intent.

The owner tracks requested playback, effect pause, original-view intent, reduced preference, document visibility and figure intersection separately. Preference state is cached from its change event, so state inspection uses the same policy snapshot rather than reevaluating a live media query during notification. Reduced/hidden/offscreen policy pauses owned video and shows its cover; clearing a gate may resume only prior explicit playback intent. Pause video clears that intent. Application-issued media events are distinguished from native play/pause events, so temporary policy pauses do not become user pauses, and a native/user pause cannot be undone by a preference/visibility change. A requested play while blocked is held, not silently treated as successful playback.

Show original destroys only the effect. It can show a user-requested native video still playing, with native controls restored. For a static result choose Pause video/show cover (and, for images, original view or a still trigger). Reduced policy chooses original stills and destroys enhancement rather than relying on runtime phase changes to stop video. The effect pause choice survives controller/source/policy remounts. These are application policies/helpers, not a shared runtime or generic borrowed-video adapter.

Each play/import completion checks its generation/disposed state before changing UI or mounting resources. Native playback belongs to this example; borrowed/user media must not be automatically resumed by another host. Cleanup aborts app/render-canvas listeners and the figure observer, destroys Frame before Space, pauses owned videos, restores native controls/sections and removes application presentation state. mountRecipes/disposeRecipes/snapshotRecipes are app functions, not package exports.

## Loading, failure, context and native content

Keep meaningful alt/aria-label, poster, figcaption and adjacent content before enhancement. Native media remains visible until usable data and successful processing. Missing bytes cannot be repaired by a fallback: Test missing source retains caption/description and Restore source retries the actual failing node. Video errors clear playback intent; recovery does not silently autoplay. Replacing an element is distinct from changing its URL. No-JS mode has original images and genuine native video controls, not a canvas placeholder.

Frame's onError/prismaerror report resource/shader/upload/init failures; stats.fallback also covers context loss. Context events are not all onError callbacks. The gallery listens on each current canvas so source controls reflect fallback/restoration, and aborts those listeners on every teardown. WebGL2 loss restores the native source and hides the canvas; restoration rebuilds resources. Native source/video intent is separate. Permanent no-WebGL uses native media; there is no CPU shader renderer. Tainted/cross-origin uploads need correct source permissions/headers; set({}) can retry after correction, not grant access. The existing minimal example tests the CORS path separately.

Native comparison labels/view choices, alt/caption, note/input identity and keyboard action controls carry meaning regardless of effects. No new live region is updated every frame. Synthetic videos contain no soundtrack or captured footage. The original vector portrait/product drawings are clearly illustrations; no photography authenticity, depicted-person permission or extra asset-rights grant is invented.

## Spatial and measurement boundaries

The example includes unmodified licensed Space source pinned to 4ecc9e5 (runtime 6e9e052), separately imported with its CSS and excluded from the Frame tarball. compactWidth:1600 within a gallery capped at 1000px keeps it flat. Mount parent layout, then the child in its dedicated visual-leaf wrapper; destroy child then parent. Keep native source/note nodes and focus semantics. No blur/opacity/filter is added to a preserving camera ancestor.

A parent's pause is not a child/media scheduler. Rectangle normalization is not inverse projection for rotated/perspective/nested zoom geometry. These flat checks do not establish arbitrary projected pointers, dragging/touch arbitration, shared textures/depth or full VIS-11/VIS-61 certification.

More pixels, higher DPR, larger video/codec cost and effect layers raise cost. cpuMs is CPU submission work, not GPU time. Byte counts, software-renderer checks and emulated viewports do not prove physical phones, Safari/Firefox, assistive technology, p95 FPS/memory/thermals/battery or codec coverage. Preserve independent registry/import/version boundaries; source/local tarball availability is not npm ownership or publication approval.

## Reproduce locally

With Node 22 and local Chrome (CHROME selects it): npm test, npm run build:site, npm run check:docs, npm run check:examples, npm run check:recipes, npm run size. The recipe checker uses actual source/built-site/offline-installed Frame consumers and a separate pinned Space fixture. It verifies the eight cases, keyboard/content/resize/source replacement, load/error/recovery, context, native/reduced/no-WebGL/no-JS, playback ownership, late async completion and cleanup. This local build does not publish. The original media, licenses, source imports and existing analytics/consent remain unchanged.
