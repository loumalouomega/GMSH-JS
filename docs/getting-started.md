# Getting started

## Install

```bash
npm install gmsh-wasm
```

The package ships a prebuilt `.wasm` plus dual ESM/CJS entry points and
TypeScript types. There is **no build step** for consumers — Emscripten is only
needed if you build the package from source ([Building](building.md)).

!!! info "Package size"
    The OpenCASCADE-enabled `.wasm` is large (tens of MB) because it statically
    links the OCC CAD kernel. It is gzip-compressed in transit and instantiated
    once per process.

## Your first mesh (Node, ESM)

```js
import initialize from 'gmsh-wasm';

const gmsh = await initialize(); // instantiate the WASM module
gmsh.initialize();               // initialise the Gmsh library
gmsh.model.add('square');

const lc = 0.1; // target element size
const p1 = gmsh.model.geo.addPoint(0, 0, 0, lc);
const p2 = gmsh.model.geo.addPoint(1, 0, 0, lc);
const p3 = gmsh.model.geo.addPoint(1, 1, 0, lc);
const p4 = gmsh.model.geo.addPoint(0, 1, 0, lc);

const l1 = gmsh.model.geo.addLine(p1, p2);
const l2 = gmsh.model.geo.addLine(p2, p3);
const l3 = gmsh.model.geo.addLine(p3, p4);
const l4 = gmsh.model.geo.addLine(p4, p1);

const cl = gmsh.model.geo.addCurveLoop([l1, l2, l3, l4]);
gmsh.model.geo.addPlaneSurface([cl]);
gmsh.model.geo.synchronize();

gmsh.model.mesh.generate(2);

const { nodeTags, coord } = gmsh.model.mesh.getNodes();
console.log(`${nodeTags.length} nodes`);

gmsh.write('/square.msh');                      // write to the in-memory FS
const msh = gmsh.FS.readFile('/square.msh', { encoding: 'utf8' });
console.log(msh.split('\n').slice(0, 3));

gmsh.finalize();
```

### Two `initialize` calls?

There are deliberately two steps:

| Call | What it does |
|------|--------------|
| `await initialize()` | Loads and instantiates the WASM module, returns the typed API object. |
| `gmsh.initialize()` | Initialises the **Gmsh library** itself (mirrors `gmsh::initialize()` in the C++/Python APIs). Call it before any model operation. |

Pair it with `gmsh.finalize()` when done.

## CommonJS

```js
const initialize = require('gmsh-wasm');

(async () => {
  const gmsh = await initialize();
  gmsh.initialize();
  // ... same as above ...
  gmsh.finalize();
})();
```

## Browser

```html
<script type="module">
  import initialize from 'https://unpkg.com/gmsh-wasm/dist/gmsh.mjs';
  const gmsh = await initialize();
  gmsh.initialize();
  // ... build + mesh ...
</script>
```

With a bundler the `.wasm` is resolved as an asset automatically. See
[Browser usage](guide/browser.md) for bundler specifics and asset hosting.

## Next

- [Concepts](guide/concepts.md) — how the API is shaped and the two kernels
- [Meshing](guide/meshing.md) — 2D/3D generation, algorithms, options
- [API reference](api/reference.md) — every function
