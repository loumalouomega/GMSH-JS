# Concepts

## The API mirrors the Gmsh C API

`gmsh-wasm` exposes Gmsh's flat C API (`gmshc.h`), reorganised into a nested
object tree that matches the module hierarchy:

| C symbol | JavaScript |
|----------|------------|
| `gmshInitialize` | `gmsh.initialize()` |
| `gmshModelAdd` | `gmsh.model.add()` |
| `gmshModelGeoAddPoint` | `gmsh.model.geo.addPoint()` |
| `gmshModelMeshGenerate` | `gmsh.model.mesh.generate()` |
| `gmshModelOccImportShapes` | `gmsh.model.occ.importShapes()` |
| `gmshOptionSetNumber` | `gmsh.option.setNumber()` |

The modules are: top-level `gmsh`, `gmsh.option`, `gmsh.model`,
`gmsh.model.geo`, `gmsh.model.occ`, `gmsh.model.mesh` (and `mesh.field`),
`gmsh.logger`, `gmsh.onelab`, `gmsh.plugin`, `gmsh.parser`. The GUI modules
(`fltk`, `graphics`, `view`) are **excluded** by design.

## Error handling

Every Gmsh C function takes a trailing `int* ierr`. The wrapper allocates it,
checks it after each call, and—on a non-zero code—reads the Gmsh error message
and throws a JavaScript `Error`. You never see `ierr`.

```js
try {
  gmsh.model.geo.addPlaneSurface([999999]); // non-existent curve loop
  gmsh.model.geo.synchronize();
} catch (err) {
  console.error(err.message); // "gmshModelGeoSynchronize: Unknown curve loop ..."
}
```

## Return values

The wrapper translates the C output conventions into ordinary JS values:

- **Scalar return** (e.g. an entity tag): returned directly.
  ```js
  const tag = gmsh.model.geo.addPoint(0, 0, 0); // number
  ```
- **Output parameters** (C `T**`+size): returned as an **object** keyed by the
  output names.
  ```js
  const { nodeTags, coord, parametricCoord } = gmsh.model.mesh.getNodes();
  // nodeTags: number[], coord: number[] (x,y,z,...)
  ```
- **Nested outputs** (C `T***`): returned as arrays of arrays.
  ```js
  const { elementTypes, elementTags, nodeTags } = gmsh.model.mesh.getElements();
  // elementTags: number[][], one inner array per element type
  ```

See [Marshalling](../api/marshalling.md) for the full mapping.

## The two geometry kernels

Gmsh has two independent CAD kernels. **Pick one per model** and call its
`synchronize()` to push the CAD into the Gmsh model before meshing.

### `geo` — built-in kernel

Lightweight, scriptable boundary representation: points, lines, curves, surface
loops, volumes. Best for parametric, procedurally-built geometry.

```js
gmsh.model.geo.addPoint(0, 0, 0, 0.1);
// ...
gmsh.model.geo.synchronize();
```

### `occ` — OpenCASCADE kernel

A full CAD kernel: primitives (`addBox`, `addCylinder`, `addSphere`), boolean
operations (`fuse`, `cut`, `intersect`), fillets, and **STEP / IGES / BREP
import** via `importShapes`.

```js
gmsh.model.occ.addBox(0, 0, 0, 1, 1, 1);
gmsh.model.occ.synchronize();
```

!!! note
    `geo` and `occ` are separate; entity tags are not shared between them. Build
    a model with one kernel, synchronize, then mesh.

## Dimensions and `(dim, tag)` pairs

Entities are identified by a `(dim, tag)` pair: `dim` ∈ {0,1,2,3} for
point/curve/surface/volume. APIs that take or return lists of pairs use a
**flat** array `[dim0, tag0, dim1, tag1, ...]`:

```js
const { dimTags } = gmsh.model.getEntities(); // [0,1, 0,2, 1,1, ...]
```

## Lifecycle

```js
const gmsh = await initialize(); // 1. load WASM (once)
gmsh.initialize();               // 2. start Gmsh
// ... build, mesh, read/write ...
gmsh.clear();                    //    optional: reset the model
gmsh.finalize();                 // 3. shut down Gmsh
```

You can reuse a single loaded module across many `initialize()`/`finalize()`
cycles; instantiating the WASM module is the expensive part.
