# Asset and license provenance

The project's MIT license uses Maxence Mauduit's copyright notice, matching the existing Solids project and Max's explicit MIT licensing direction for this family.

- `src/`, the demo, scripts, documentation, and tests were authored for this project in this working session. The media-effects runtime contains no third-party library implementation or copied shader source. The terminal glyphs and code-rain symbols are procedural original shapes; no film assets, logos, character font atlases, or third-party textures are included. The standard Bayer threshold matrix and common Voronoi-neighborhood technique are implemented directly here.
- `demo/assets/alpine.svg` is an original illustration authored for this project, not a downloaded photograph. It is included under this project's MIT license.
- `demo/assets/alpine-loop.webm` is a locally generated animation of the original Alpine illustration, with no third-party footage or soundtrack. Its generator is `scripts/make-video.mjs`; it is included under this project’s MIT license.
- `test/motion.webm` was generated locally from FFmpeg's synthetic `testsrc2` filter. It contains no captured people, licensed footage, or soundtrack. The generator itself is not bundled; its own license is not replaced by this project's license.
- `demo/preview.jpg`, `demo/treatments.jpg`, and `demo/digital-treatments.jpg` capture this project's gallery and illustration. External font renderings are visible in the capture.
- The optional demo fonts, DM Sans, are fetched from Google Fonts. Font binaries are not redistributed in this repository, and the project's MIT notice does not relicense them. System fonts are the fallback.
- Media selected by a playground visitor stays in their browser and retains its owner's rights. It is not copied into the repository or covered by this license.

This review is limited to the files bundled in Prisma. It does not change licensing in Materia, Solids, or any external project. Prisma and the proposed npm package name remain provisional; availability and trademark clearance have not been established.

## Additional demo media

`coast.jpg`, `drawing.jpg`, and `sculpture.jpg` are original AI-generated sample images created with OpenAI image generation for this project. Prompts are recorded in `demo/assets/PROMPTS.md`.


## Materia site effects

`demo/vendor/materia/` contains the MIT-licensed wordmark effect and their transitive modules from [Materia](https://github.com/mmaxence/materia), copyright 2026 Maxence Mauduit. Its license is retained in that directory. `demo/materia-title.css` provides the original hero layout styling; `demo/family.css` adapts the same public-site palette. These demo-only modules are not part of the media library package.
