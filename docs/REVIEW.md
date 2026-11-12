# Consolidation review — 2026-11-06

## Scope

Reviewed the Living Frame renderer, demo state, composition editing, media lifecycle, accessibility, CSS, and package. Compared the local sibling sources under `lab/materia/public/type-lab` and `lab/solids/site/src` without modifying either sibling.

## Resolved

- Repeated auditions discarded compiled shaders. A bounded 24-entry recency cache now reuses programs.
- Empty stacks ran an animation loop. They now sleep while native video updates remain supported.
- Intermediate textures survived a return to one pass. They are released, and failed allocation cleans up partially created resources.
- A glass layer froze the pointer used by other effects. Pointer uniforms are now chosen per layer; impact progress is calculated once per frame.
- Shader failures could permanently disable an instance. A valid subsequent configuration can recover it.
- Invalid layer configuration could fail after mutation. Validation now occurs before changes.
- Range changes rebuilt all layer controls. Unchanged row structure is retained, and structural edits restore keyboard focus.
- Composition edits lacked recovery. Undo/Redo keeps up to 50 in-memory states; uploads are excluded.
- Accumulated CSS overrides obscured the layout. Replaced them with one token-based stylesheet and removed obsolete preset markup and handlers.
- Added product-family navigation, native-select caret spacing, a skip link, visible focus styles, forced-colors support, and larger mobile controls, drawing on sibling conventions.
- Added sample-image MIME types and safe handling of malformed development-server URL encoding.

## Verification

268 browser checks passed, including reduced motion, context restoration, video stacks, blend math, preview restoration, cache reuse, empty-stack suspension, failure recovery, Undo/Redo, and DOM/focus retention. TypeScript validation and npm package dry run passed. Visually reviewed desktop and 390px layout; no horizontal overflow at 390px.

## Limits

No push, publication, or deployment. No physical mobile GPU benchmark was performed. Six layers remain the playground cap; motion timing is shared. YouTube embeds remain playback-only and cannot feed the renderer. Undo history is session-only and does not store media files.
