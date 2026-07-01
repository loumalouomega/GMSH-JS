# gmsh-wasm

**[Gmsh](https://gmsh.info)** — a three-dimensional finite-element mesh generator
— compiled to **WebAssembly** and exposed to JavaScript/TypeScript through its
flat `extern "C"` API. Geometry kernels (built-in `geo` + OpenCASCADE `occ`) and
the mesh module, with full mesh I/O. **No GUI / visualization.**

Runs in **Node** and the **browser** (single-threaded — no `SharedArrayBuffer`
requirement), loaded asynchronously.

```js
import initialize from '@loumalouomega/gmsh-wasm';

const gmsh = await initialize();
gmsh.initialize();
gmsh.model.add('demo');

// a unit square with the built-in geo kernel
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
console.log(`meshed ${nodeTags.length} nodes`);

gmsh.write('/out.msh');
gmsh.finalize();
```

## Why this exists

Gmsh ships a flat C API (`gmshc.h`) where every function takes a trailing
`int* ierr` error out-parameter and returns array outputs as malloc'd pointers
the caller must free. This package compiles that C API to WebAssembly and wraps
it in a **typed, ergonomic JavaScript layer** that hides the `ierr` checking and
all manual memory management — so you write `gmsh.model.mesh.generate(3)`, not
pointer arithmetic.

## Highlights

- **Full C API surface** — all 341 non-GUI functions, generated from Gmsh's own
  API definition, so the bindings never drift from the upstream version.
- **TypeScript types** — a complete `.d.ts` ships with the package.
- **Both geometry kernels** — built-in `geo` and OpenCASCADE `occ`
  (STEP / IGES / BREP import).
- **Node + browser** — dual ESM/CJS entry points; the `.wasm` is a separate
  asset, not inlined.

## Where to next

<div class="grid cards" markdown>

- :material-rocket-launch: **[Getting started](getting-started.md)** — install and mesh your first model
- :material-book-open-variant: **[Guide](guide/concepts.md)** — concepts, geometry, meshing, file I/O
- :material-api: **[API reference](api/reference.md)** — every function, generated
- :material-hammer-wrench: **[Building from source](building.md)** — emsdk, OCCT, the WASM build
- :material-scale-balance: **[Licensing](licensing.md)** — GPL-2.0-or-later (important)

</div>

!!! warning "Licensing"
    Gmsh is **GPL-2.0-or-later**. Because this package statically links Gmsh and
    OpenCASCADE into the `.wasm`, the package and its artifacts are likewise
    **GPL-2.0-or-later**. See [Licensing](licensing.md).
