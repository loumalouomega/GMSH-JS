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
- Function-pointer callbacks (e.g. a custom mesh-size callback) — these C
  functions are present in the binary but omitted from the wrapper for v1.
