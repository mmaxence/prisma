# Prisma

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

[Solids](https://mmaxence.github.io/solids/) — interactive 3D. [Materia](https://mmaxence.github.io/materia/) — living typography. [Prisma](https://mmaxence.github.io/prisma/) — media in motion.

[Maxence Mauduit](https://mmaxence.me/)
