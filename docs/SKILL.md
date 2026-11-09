---
name: prisma-effect
description: Extend Prisma with a small, seamless media treatment for RGBA images and video.
---
# Add a Prisma effect

Create `src/effects/<name>.js`, exporting a default object with `name`, `title`, `description`, and a GLSL ES 3.00 `fragment` string. Define `vec4 effect(vec2 uv)`. Do not define main or a version directive. Export it from `src/index.js`, declare its type in `src/index.d.ts`, and include it in `demo/app.js` and `test/browser.html`.

Available inputs:

- `sampleMedia(uv)`: cover-cropped, clamp-to-edge RGBA source, with vertical orientation handled by the uploader.
- `uPhase`: periodic 0–2π. Use only periodic functions or integer multiples so phase 0 and 2π meet.
- `uDetail`: effect-specific 0–1 control; default 0.5. Give the module a `detailLabel`, `family`, and `useCase` for the gallery.
- `uAmount`: 0–1, already multiplied by the interaction envelope. At zero return the original source.
- `uPointer`: pointer in UV coordinates, origin bottom-left.
- `uAspect`: host width / height.

Keep the shader to one pass and a small number of texture reads. Preserve alpha. Use aspect correction for circular shapes. Avoid unbounded or texture-sampling shader loops. A fixed small math-only neighborhood is allowed when needed for an effect such as glass shards. Avoid runtime random seeds, global time discontinuities and hardcoded pixel sizes. Sampling outside the media clamps at its boundary, so keep displacement modest.

The renderer owns source upload, sizing, lifecycle, observer suspension, fallbacks, interaction, reduced motion and scheduling. Effects must not add their own RAF or DOM listeners.

Run `npm test` and `npm run size`. Chrome tests must paint, change source pixels, change across phase, close the loop, and keep all lifecycle tests passing. Inspect the effect on an image and video at desktop and phone dimensions. Before claiming mobile performance, measure on a real mobile GPU. Document limitations rather than assuming that a small bundle guarantees smoothness.

Geometry effects may supply a GLSL ES 3 vertex shader in `vertex` and a bounded `vertices` count. Output original source coordinates as `vUv`; the renderer clears transparent each draw. `impact: true` provides `uProgress` and a latched hit-point `uPointer`. Click progress goes from 0 to 1 and holds; reset restores 0. Reduced motion forces 0. Test intact coverage, real alpha gaps, pause, reset, and the click lifecycle.
