# gmsh-wasm

[![build](https://github.com/loumalouomega/GMSH-JS/actions/workflows/build.yml/badge.svg)](https://github.com/loumalouomega/GMSH-JS/actions/workflows/build.yml)
[![docs](https://github.com/loumalouomega/GMSH-JS/actions/workflows/docs.yml/badge.svg)](https://loumalouomega.github.io/GMSH-JS/)
[![npm version](https://img.shields.io/npm/v/%40loumalouomega%2Fgmsh-wasm.svg?logo=npm&color=cb3837)](https://www.npmjs.com/package/@loumalouomega/gmsh-wasm)
[![npm downloads](https://img.shields.io/npm/dm/%40loumalouomega%2Fgmsh-wasm.svg)](https://www.npmjs.com/package/@loumalouomega/gmsh-wasm)
[![types](https://img.shields.io/badge/types-included-3178c6?logo=typescript&logoColor=white)](https://loumalouomega.github.io/GMSH-JS/guide/typescript/)
[![node](https://img.shields.io/badge/node-%E2%89%A518-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![WebAssembly](https://img.shields.io/badge/WebAssembly-654ff0?logo=webassembly&logoColor=white)](https://webassembly.org)
[![license](https://img.shields.io/badge/license-GPL--2.0--or--later-blue.svg)](LICENSE)

[Gmsh](https://gmsh.info) — a three-dimensional finite-element mesh generator — compiled to **WebAssembly** and exposed to JavaScript/TypeScript through its flat `extern "C"` API. Geometry kernels (built-in `geo` + OpenCASCADE `occ`, incl. STEP/IGES/BREP import) and the full mesh module; **no GUI / visualization**.

- ⚡ Runs in **Node** and the **browser** — **multithreaded** (OpenMP via pthreads). Browser pages must be cross-origin isolated: serve with
  `Cross-Origin-Opener-Policy: same-origin` +
  `Cross-Origin-Embedder-Policy: require-corp`
- 🧩 **Typed, ergonomic API** — hides the C `ierr` out-parameter and all manual memory management
- 🤖 **342 functions generated** from Gmsh's own API definition, so the bindings never drift from the upstream version; ships a complete `.d.ts`
- 📦 Dual **ESM + CJS** entry points; the `.wasm` is a separate asset

> **📚 Full documentation:** <https://loumalouomega.github.io/GMSH-JS/>

## Install

```bash
npm install @loumalouomega/gmsh-wasm
```

No build step for consumers — the package ships a prebuilt `.wasm`, dual ESM/CJS entries, and TypeScript types.

## Quick start

```js
import initialize from '@loumalouomega/gmsh-wasm';

const gmsh = await initialize(); // load the WASM module
gmsh.initialize();               // start the Gmsh library
gmsh.model.add('square');

const lc = 0.1;
const p = [
  gmsh.model.geo.addPoint(0, 0, 0, lc),
  gmsh.model.geo.addPoint(1, 0, 0, lc),
  gmsh.model.geo.addPoint(1, 1, 0, lc),
  gmsh.model.geo.addPoint(0, 1, 0, lc),
];
const l = [
  gmsh.model.geo.addLine(p[0], p[1]),
  gmsh.model.geo.addLine(p[1], p[2]),
  gmsh.model.geo.addLine(p[2], p[3]),
  gmsh.model.geo.addLine(p[3], p[0]),
];
gmsh.model.geo.addPlaneSurface([gmsh.model.geo.addCurveLoop(l)]);
gmsh.model.geo.synchronize();
gmsh.model.mesh.generate(2);

const { nodeTags } = gmsh.model.mesh.getNodes();
console.log(`${nodeTags.length} nodes`);

gmsh.write('/out.msh');
const msh = gmsh.FS.readFile('/out.msh', { encoding: 'utf8' });

gmsh.finalize();
```

CommonJS: `const initialize = require('@loumalouomega/gmsh-wasm');` then the same calls.

### Two `initialize` steps

`await initialize()` loads the WASM module; `gmsh.initialize()` starts the Gmsh library (mirrors `gmsh::initialize()` in the C++/Python APIs). Pair with `gmsh.finalize()`.

### Threads

The build is OpenMP-enabled (pthreads). Gmsh defaults to 1 thread; opt into parallelism per session:

```js
gmsh.option.setNumber('General.NumThreads', 0); // 0 = all cores (or set an explicit count)
```

Node needs no special flags. In the **browser**, threads require `SharedArrayBuffer`, so the page must be served with the COOP/COEP headers above — see the [browser guide](https://loumalouomega.github.io/GMSH-JS/guide/browser/).

## File I/O (MEMFS)

Gmsh reads/writes files through Emscripten's in-memory filesystem. Stage inputs and read outputs via `gmsh.FS`:

```js
gmsh.FS.writeFile('/in.step', stepBytes);        // Uint8Array
gmsh.model.occ.importShapes('/in.step');
gmsh.model.occ.synchronize();
gmsh.model.mesh.generate(3);
gmsh.write('/out.msh');
const mesh = gmsh.FS.readFile('/out.msh');       // Uint8Array
```

## Project structure

```
gmsh/                  Gmsh source (git submodule, pinned)
third_party/occt/      OpenCASCADE source (fetched, pinned via scripts/env.sh)
scripts/               build + codegen scripts
src/runtime.mjs        hand-written generic marshaller
generated/             gen_js.py output: exports, descriptor, .d.ts  (committed)
dist/                  build artifacts (gitignored; produced by CI)
test/                  Node + headless-browser tests
docs/                  MkDocs documentation site
examples/browser/      runnable browser example
```

## Building from source

Only needed to change build flags, bump Gmsh/OCCT, or develop the package.
Requires `git`, `cmake`, `python3`, `node` ≥ 18, and several GB of disk.

```bash
git submodule update --init --recursive
npm run setup        # install + activate the pinned Emscripten SDK -> .emsdk/
npm run build:libomp # build LLVM's OpenMP runtime (libomp) to wasm32
npm run build:occt   # build OpenCASCADE to static WASM libs (slow, ~once)
npm run build:wasm   # gen bindings, build gmsh, link + assemble dist/
npm test
```

`npm run build` runs `build:libomp`, `build:occt`, then `build:wasm`. For a smaller artifact without STEP/IGES (≈12 MB vs ≈45 MB): `GMSH_ENABLE_OCC=OFF npm run build:wasm`.

## npm scripts

| Script | Does |
|--------|------|
| `npm run setup` | install + activate pinned emsdk |
| `npm run build:libomp` | build LLVM's OpenMP runtime (libomp) → wasm32 static lib |
| `npm run build:occt` | build OpenCASCADE → static WASM libs |
| `npm run build:wasm` | generate bindings, build gmsh, assemble `dist/` |
| `npm run build` | `build:libomp` + `build:occt` + `build:wasm` |
| `npm run gen` | regenerate bindings (`generated/`) from the Gmsh API definition |
| `npm test` | Node test suite (geo, occ, STEP round-trip, error path) |
| `npm run test:browser` | headless-Chromium test (needs Playwright + Chromium) |
| `npm run docs:build` | regenerate API ref + build the docs site |
| `npm run docs:serve` | live-preview the docs locally |

VS Code users: the same actions are available as tasks (**Terminal → Run Task**).

## Known issues

- **Hex-dominant recombination (`Mesh.Recombine3DAll`) is only reachable via the experimental RTree algorithm.** Upstream Gmsh only invokes its hex-tet hybrid recombiner (`meshCombine3D`) when `Mesh.Algorithm3D = 9` (RTree); the `Mesh.Recombine3DLevel`/`Mesh.Recombine3DConformity` options are dead code, and combining `Mesh.RecombineAll` with the Frontal 3D algorithm throws `"Cannot use frontal 3D algorithm with quadrangles on boundary"` (an ordering bug in upstream Gmsh, not specific to this build). This is not a gap in this WASM build — `HAVE_DOMHEX`/`HAVE_HXT` are both enabled — it is how Gmsh itself gates the feature. See [Meshing](https://loumalouomega.github.io/GMSH-JS/guide/meshing/) for a working example.

## Licensing — important

Gmsh is distributed under the **GNU General Public License, version 2 or later** (GPL-2.0-or-later), with a linking exception covering Netgen, METIS, OpenCASCADE and ParaView. Because this package **statically links** Gmsh (and OpenCASCADE)
into the `.wasm`, the resulting artifact and this package are likewise governed by the **GPL-2.0-or-later**. Any software that distributes this package inherits those obligations. A separate **commercial license** for Gmsh is available from its authors — see <https://gmsh.info>.

This is an independent packaging effort and is **not** affiliated with or endorsed by the Gmsh authors.

### Attribution

- Gmsh — C. Geuzaine and J.-F. Remacle. <https://gmsh.info> — GPL-2.0-or-later.
- OpenCASCADE Technology (OCCT) — <https://dev.opencascade.org> — LGPL-2.1 with exception.

See [LICENSE](LICENSE) and the upstream `gmsh/LICENSE.txt`.
