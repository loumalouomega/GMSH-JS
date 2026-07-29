# API overview

The public API is a nested object returned by `await initialize()`. It mirrors
the Gmsh C API module tree, with one JavaScript method per C function.

## Naming

C symbol → JS path, by stripping the `gmsh` prefix and lowercasing the first
module segment:

```
gmshModelMeshGenerate   ->  gmsh.model.mesh.generate
gmshModelGeoAddPoint    ->  gmsh.model.geo.addPoint
gmshOptionSetNumber     ->  gmsh.option.setNumber
gmshLoggerGetLastError  ->  gmsh.logger.getLastError
```

## Modules

| JS path | Purpose |
|---------|---------|
| `gmsh` | initialize/finalize, open/merge/write/clear |
| `gmsh.option` | get/set numeric, string and colour options |
| `gmsh.model` | model entities, physical groups, boundary queries |
| `gmsh.model.geo` | built-in CAD kernel |
| `gmsh.model.occ` | OpenCASCADE CAD kernel (incl. STEP/IGES/BREP) |
| `gmsh.model.mesh` | mesh generation, queries, optimisation |
| `gmsh.model.mesh.field` | size fields |
| `gmsh.logger` | timing, memory, last error |
| `gmsh.onelab` | ONELAB parameter interface |
| `gmsh.plugin` | post-processing plugins |
| `gmsh.parser` | `.geo` parser access |

GUI/visualization modules (`fltk`, `graphics`, `view`) are intentionally
**excluded** — this build has no GUI.

## Calling conventions

- **Errors** are thrown as JavaScript `Error`s (the C `ierr` is hidden).
- **Scalar returns** come back directly; **output parameters** come back as an
  object keyed by output name; **nested outputs** as arrays of arrays.
- **Optional arguments** may be omitted (their Gmsh defaults apply).
- **`(dim, tag)` lists** are flat `number[]` arrays: `[dim0,tag0,dim1,tag1,...]`.

See [Marshalling](marshalling.md) for the precise rules and the full
[API reference](reference.md) for every function.

## Not exposed

- GUI/FLTK, OpenGL graphics, and on-screen post-processing views.

## Mesh size callback

`gmsh.model.mesh.setSizeCallback(fn)` marshals a JS function into a native
function-pointer callback that Gmsh invokes once per mesh vertex during
`mesh.generate()`. It is the one function whose argument is a JS function
rather than a plain value/array; see [Marshalling](marshalling.md).

**Main-thread only.** The callback's WebAssembly table slot lives in the
instance that created it and is not visible to OpenMP worker pthreads, so it
only works reliably with `General.NumThreads` set to `1` (Gmsh's default). Set
a callback while multithreaded meshing is enabled and the runtime logs a
one-time warning; workers invoking the slot during meshing may fail.
