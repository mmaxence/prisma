# Living Frame

Part of **Living Things — Libraries for a living web**. Formerly **Prisma**. Existing repository URLs, package names, imports and APIs remain unchanged.


Lightweight, composable effects for images and video. 25 treatments, five motion triggers, one WebGL2 renderer, and no runtime dependencies.

[Playground](https://mmaxence.github.io/prisma/) · [Documentation](https://mmaxence.github.io/prisma/documentation/index.html)

Slow zooms, interval vibration, animated tilt-shift, pan, handheld motion, film grain, analog video, digital interference, print, color, and glass effects. Compose layers with independent intensity and blend modes.

[Performance lab](https://mmaxence.github.io/prisma/performance/index.html) — reproducible bundle sizes, image/video measurements, and a benchmark for your device.

## Develop

```sh
npm ci
npm run dev
npm test
npm run measure:size
npm run build:site
```

Open http://127.0.0.1:4410/demo/index.html. The runtime has no dependencies; esbuild is a development-only size measurement tool. Tests require Chrome (`CHROME` can override its executable path).

Native ES modules and TypeScript declarations are in `src/`. This alpha is distributed through GitHub; it is not published to npm. See the documentation for hosted and self-hosted imports.

## License

MIT, copyright 2026 Maxence Mauduit. See [LICENSE](LICENSE) and [asset notices](ASSETS.md). Uploaded media stays in the visitor’s browser.

## The family

[Living Object](https://mmaxence.github.io/solids/) — interactive 3D. [Living Type](https://mmaxence.github.io/materia/) — living typography. [Living Space](https://mmaxence.github.io/strata/) — spatial HTML interfaces.

[Maxence Mauduit](https://mmaxence.me/)

## Media failures

A failed image/video resource restores native media visibility, sets `stats.fallback`, calls `onError` when provided, and emits the existing `prismaerror` event. A subsequent successful load recovers the effect. Preserve image alt text and provide video labels, controls/poster or adjacent fallback content; the renderer cannot repair an unavailable resource. For CORS/upload or shader failures, resolve the source/configuration issue and use `set(...)` or remount.
