# Architecture

How the package is produced, end to end.

```
                 Gmsh API definition (gmsh/api/gen.py + GenApi.py)
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │ scripts/gen_js.py         │                           │
        ▼                           ▼                           ▼
generated/exported_functions.json  generated/gmsh-api.json   generated/gmsh.d.ts
   (Emscripten export list)        (runtime descriptor)        (TypeScript types)
        │                           │
        │                           └──────────────┐
        ▼                                          ▼
   emcc link  ◀── build/gmsh/libgmsh.a       src/runtime.mjs (generic marshaller)
        │            ▲                              │
        │   emcmake gmsh (+ OCCT static libs)       │
        ▼                                          ▼
dist/gmsh-core.{mjs,cjs,wasm}  ──── assemble.mjs ──▶ dist/gmsh.{mjs,cjs} + .d.ts
                                                    (typed wrapper entry points)
```

## Binding generation (`scripts/gen_js.py`)

Rather than hand-writing 341 wrappers, the bindings are **generated from Gmsh's
own declarative API definition** — the same source that emits the Python, Julia,
and Fortran bindings. The generator loads that definition, tags each argument
with its kind, and emits three artifacts:

1. **`exported_functions.json`** — the `-sEXPORTED_FUNCTIONS` list (every non-GUI
   C symbol, plus `malloc`/`free`/`gmshFree`/`gmshMalloc`).
2. **`gmsh-api.json`** — a descriptor table: for each function, its module path,
   JS name, C symbol, return kind, and typed argument list with defaults.
3. **`gmsh.d.ts`** — TypeScript declarations.

GUI modules (`fltk`, `graphics`, `view`) are filtered out. Because everything
derives from the upstream definition, the bindings cannot drift from the Gmsh
version in the submodule.

## The runtime (`src/runtime.mjs`)

A single, hand-written generic marshaller interprets the descriptor at load
time, building the nested API object. It is the **only** place pointer/heap
marshalling lives — the generator emits data, never marshalling code. This keeps
the complex `T***` output handling in one tested implementation. See
[Marshalling](api/marshalling.md).

## The native build

- **Gmsh** is compiled to a static `libgmsh.a` with `emcmake cmake` — GUI off,
  Eigen for linear algebra, OpenMP-threaded (pthreads), C++17.
- **libomp** (LLVM's OpenMP runtime) is built separately to a static wasm32
  library by `scripts/build-libomp.sh` — Emscripten ships no OpenMP runtime, so
  gmsh's `-fopenmp` code links against this.
- **OpenCASCADE** is built separately to static WASM libraries (modeling +
  data-exchange toolkits only; no visualization). Gmsh links against them.
  All of gmsh, OCCT and libomp are compiled with `-pthread` — `wasm-ld` rejects
  mixing non-atomics objects into a shared-memory link.
- `emcc` links `libgmsh.a` (+ the OCCT `libTK*.a` + `libomp.a`) with `-pthread`
  into a `MODULARIZE`d reactor module, emitted as both ESM and CJS sharing one
  `gmsh-core.wasm`.
- **Stack size** is raised from Emscripten's 64KB default to
  `-sSTACK_SIZE=4MB` (main thread) and `-sDEFAULT_PTHREAD_STACK_SIZE=2MB`
  (OpenMP worker pthreads) — both stacks live in linear memory, not an OS
  stack. Gmsh's tetgen-derived 3D boundary recovery (shared by the default
  Delaunay algorithm and HXT) recurses deep enough that the 64KB default
  silently corrupted adjacent memory at `-O3` (no stack checks), surfacing as
  a hang or an empty mesh rather than a crash — reproducible even on small,
  non-degenerate geometry.
- **`-sALLOW_TABLE_GROWTH=1`** plus `addFunction`/`removeFunction` in
  `-sEXPORTED_RUNTIME_METHODS` support `gmsh.model.mesh.setSizeCallback`, the
  one JS→WASM function-pointer callback in the API (`isizefun` in the
  descriptor). `Module.addFunction` table slots are per-thread, so the
  callback only works reliably with `General.NumThreads=1` — see
  `src/runtime.mjs`'s `isizefun` case and
  [Marshalling](api/marshalling.md).

## Assembly (`scripts/assemble.mjs`)

Wraps the emcc core with the descriptor + runtime into the public dual ESM/CJS
entry points (`dist/gmsh.mjs` / `dist/gmsh.cjs`), inlines the descriptor as a
module, and copies the typings. The result is what consumers import.

## Documentation

This site is built with **MkDocs + Material**. The [API reference](api/reference.md)
is generated from `generated/gmsh-api.json` by `scripts/gen_docs_api.py`, so it
stays in sync with the build. CI builds and deploys the site to GitHub Pages.
