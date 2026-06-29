# Troubleshooting

## 3D Delaunay produces zero tetrahedra on imported CAD

**Symptom.** After `importShapes` (STEP/IGES) + `generate(3)`, the log shows
`Meshing 3D...` and then `Recovering boundary`, but `getElements(3)` is empty.

**Cause.** The default 3D Delaunay boundary-recovery step is fragile in the WASM
build for geometry round-tripped through CAD import. Native `occ`/`geo` solids
are unaffected.

**Fix.** Use the Frontal 3D algorithm:

```js
gmsh.option.setNumber('Mesh.Algorithm3D', 4); // Frontal
gmsh.model.mesh.generate(3);
```

## A call throws `Error: <fn>: is not exported in this build`

You called a function that is not in the export list of this `.wasm` (e.g. a
no-OCC build calling `gmsh.model.occ.*`). Use an OCC-enabled build, or avoid the
function.

## A call throws a Gmsh error message

That is expected — Gmsh reported a problem via its error mechanism and the
wrapper rethrew it as a JS `Error`. The message is the Gmsh message (e.g.
`Unknown curve loop ...`). Check your tags and that you called the kernel's
`synchronize()` before meshing.

## "forgot to call `gmsh.initialize()`"

`await initialize()` only loads the WASM module. You must then call
`gmsh.initialize()` before model operations, and `gmsh.finalize()` when done.
See [Getting started](getting-started.md#two-initialize-calls).

## Browser: `.wasm` fails to load / wrong MIME

The server must serve the `.wasm` with `Content-Type: application/wasm` for
streaming instantiation. With a bundler this is automatic; for a hand-rolled
server set the MIME type, or override `locateFile`
([Browser usage](guide/browser.md#locatefile)).

## Out-of-memory on large meshes

The heap grows to a 4 GB ceiling (`MAXIMUM_MEMORY`). Very large models can
exhaust it — coarsen the mesh (`Mesh.MeshSizeMax`), split the work, or
free/reuse the module between runs.

## Build from source: OCCT install "error" but libraries present

`build-occt.sh` tolerates a benign install failure for a developer codegen
executable (`ExpToCasExe`) that Emscripten doesn't emit a `.wasm` for; it then
verifies the required toolkits and headers. This is expected and the build
succeeds.
