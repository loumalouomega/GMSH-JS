# Meshing

After geometry is synchronized, generate a mesh up to a target dimension.

```js
gmsh.model.mesh.generate(3); // 1D -> 2D -> 3D
```

`generate(dim)` runs all lower dimensions first, so `generate(3)` also produces
the 1D and 2D meshes.

## Reading the mesh

### Nodes

```js
const { nodeTags, coord } = gmsh.model.mesh.getNodes();
// nodeTags: number[]      — N node ids
// coord:    number[]      — 3N values, [x0,y0,z0, x1,y1,z1, ...]
for (let i = 0; i < nodeTags.length; i++) {
  const [x, y, z] = coord.slice(i * 3, i * 3 + 3);
}
```

### Elements

```js
const { elementTypes, elementTags, nodeTags } = gmsh.model.mesh.getElements();
// elementTypes: number[]    — one entry per element type present
// elementTags:  number[][]  — element ids, grouped by type
// nodeTags:     number[][]  — connectivity, grouped by type (flattened per element)
```

Common element type ids: `1` = 2-node line, `2` = 3-node triangle, `3` = 4-node
quad, `4` = 4-node tetrahedron, `5` = 8-node hexahedron.

```js
const triIdx = elementTypes.indexOf(2);
const numTriangles = triIdx >= 0 ? elementTags[triIdx].length : 0;
```

## Algorithms and options

Set options **before** `generate()` with `gmsh.option.setNumber`.

| Option | Meaning | Notable values |
|--------|---------|----------------|
| `Mesh.Algorithm` | 2D algorithm | `1` MeshAdapt, `5` Delaunay, `6` Frontal-Delaunay (default), `8` Frontal-Quad |
| `Mesh.Algorithm3D` | 3D algorithm | `1` Delaunay (default), `4` Frontal, `10` HXT |
| `Mesh.MeshSizeMin` / `Mesh.MeshSizeMax` | global size bounds | |
| `Mesh.MeshSizeFactor` | scale all sizes | |
| `Mesh.Optimize` | optimise tets | `0`/`1` |
| `Mesh.ElementOrder` | element order | `1` linear, `2` quadratic, ... |
| `General.Verbosity` | log level | `0` silent … `5` debug |

```js
gmsh.option.setNumber('Mesh.MeshSizeMax', 0.1);
gmsh.option.setNumber('Mesh.Algorithm3D', 4);
gmsh.model.mesh.generate(3);
```

!!! warning "Known issue — 3D Delaunay on re-imported CAD"
    In the WASM build, the **default 3D Delaunay** boundary recovery can fail
    (zero tetrahedra) when meshing geometry round-tripped through **STEP/IGES
    import**. Native `occ`/`geo` solids are unaffected. Workaround — use the
    Frontal algorithm:

    ```js
    gmsh.option.setNumber('Mesh.Algorithm3D', 4); // Frontal
    gmsh.model.mesh.generate(3);
    ```

    See [Troubleshooting](../troubleshooting.md).

## Higher-order and optimisation

```js
gmsh.option.setNumber('Mesh.ElementOrder', 2);     // quadratic elements
gmsh.model.mesh.generate(3);
gmsh.model.mesh.optimize('Netgen');                // optimise
```

## Size fields

For non-uniform sizing, use the `field` submodule:

```js
const f = gmsh.model.mesh.field.add('Distance');
gmsh.model.mesh.field.setNumbers(f, 'PointsList', [p1, p2]);

const t = gmsh.model.mesh.field.add('Threshold');
gmsh.model.mesh.field.setNumber(t, 'InField', f);
gmsh.model.mesh.field.setNumber(t, 'SizeMin', 0.01);
gmsh.model.mesh.field.setNumber(t, 'SizeMax', 0.2);
gmsh.model.mesh.field.setNumber(t, 'DistMin', 0.1);
gmsh.model.mesh.field.setNumber(t, 'DistMax', 0.5);

gmsh.model.mesh.field.setAsBackgroundMesh(t);
gmsh.model.mesh.generate(2);
```

## Threads

This build is **OpenMP-enabled** (pthreads). Gmsh still defaults to 1 thread;
opt in per session:

```js
gmsh.option.setNumber('General.NumThreads', 0); // 0 = all cores, or an explicit count
```

Per-stage limits are available via `Mesh.MaxNumThreads1D`, `Mesh.MaxNumThreads2D`
and `Mesh.MaxNumThreads3D`. The `OMP_NUM_THREADS` environment variable does not
exist in the browser (and is not read by the WASM module) — use the options.

In the browser, threads require a cross-origin-isolated page (COOP/COEP
headers) — see [Browser usage](browser.md#threads-headers). Avoid setting the
thread count above `navigator.hardwareConcurrency`: the pthread worker pool is
sized to the core count, and oversubscribing it can deadlock the main thread.

The OpenMP-parallel 3D mesher is HXT (`Mesh.Algorithm3D = 10`). For CAD
re-imported through STEP/IGES, Frontal (`4`) remains the recommended algorithm
in this build (see [Known issues](../troubleshooting.md)); HXT under WASM
threads should be considered experimental.
