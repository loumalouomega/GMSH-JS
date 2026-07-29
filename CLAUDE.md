# CLAUDE.md

Guidance for working in this repository with Claude Code. Keep it short; record
only what isn't obvious from the code.

Every time you change code in this repo, check whether `docs/`, `README.md`,
and this file need updating too — and update them if they do.

## What this is

`gmsh-wasm` compiles the **Gmsh** mesher's flat C API (`gmsh/api/gmshc.h`) to
WebAssembly with Emscripten and wraps it in a typed JS/TS API. Geometry (`geo` +
OpenCASCADE `occ`) and meshing only — **no GUI** (`fltk`/`graphics`/`view` are
filtered out everywhere). Targets Node and the browser; multithreaded via
OpenMP/pthreads (browsers need COOP/COEP headers for `SharedArrayBuffer`).

## Architecture (how a change flows)

```
gmsh/api/gen.py (Gmsh's own API definition)
  └─ scripts/gen_js.py  → generated/exported_functions.json  (emcc -sEXPORTED_FUNCTIONS)
                          generated/gmsh-api.json            (runtime descriptor)
                          generated/gmsh.d.ts                (TypeScript types)
  scripts/build-libomp.sh → build/libomp-install/ (static libomp.a, LLVM OpenMP runtime)
  scripts/build-occt.sh → build/occt-install/ (static libTK*.a)
  scripts/build-wasm.sh → emcmake gmsh → libgmsh.a → emcc link → dist/gmsh-core.{mjs,cjs,wasm}
  scripts/assemble.mjs  → dist/gmsh.{mjs,cjs} (typed wrapper) + descriptor + runtime + .d.ts
  scripts/gen_docs_api.py → docs/api/reference.md (from the descriptor)
```

- **`src/runtime.mjs`** is the ONLY place marshalling lives. It interprets the
  descriptor generically. The generator emits **data, never marshalling code**.
- **Never hand-edit `generated/`** — regenerate with `npm run gen`.

## Key commands

| Task | Command |
|------|---------|
| Install/activate emsdk (pinned) | `npm run setup` |
| Build libomp (OpenMP runtime) → WASM | `npm run build:libomp` |
| Build OpenCASCADE → WASM libs | `npm run build:occt` |
| Build gmsh + assemble dist | `npm run build:wasm` (`GMSH_ENABLE_OCC=OFF` for no-OCC) |
| Regenerate bindings | `npm run gen` |
| Node tests | `npm test` |
| Browser test | `npm run test:browser` |
| Docs build | `npm run docs:build` |

emsdk is **not on PATH**; the scripts activate it via `scripts/env.sh`
(`activate_emsdk`). Pinned versions (emsdk, OCCT, LLVM openmp) live in
`scripts/env.sh`.

## Repo conventions

- `generated/` is **committed** (CI verifies it's in sync via `git diff`).
- `dist/`, `.emsdk/`, `build/`, `third_party/occt/`, `site/` are **gitignored**;
  `dist/` is produced in CI before publish.
- The public API requires **two init calls**: `await initialize()` (load WASM)
  then `gmsh.initialize()` (start Gmsh); finish with `gmsh.finalize()`.

## Gotchas (learned the hard way)

- **Do not edit a shell script while it is running.** Bash reads scripts by byte
  offset; inserting lines mid-run shifts offsets and corrupts the resumed parse
  (seen as a bogus `-build: command not found`). Let builds finish first.
- **OCC detection under Emscripten:** gmsh's `find_library` is restricted to the
  sysroot. `build-wasm.sh` works around it with `CASROOT`, `CMAKE_FIND_ROOT_PATH`,
  and `CMAKE_FIND_ROOT_PATH_MODE_LIBRARY=BOTH`. OCCT 7.8 uses consolidated
  toolkit names (`TKDESTEP`, `TKDEIGES`, …).
- **OCCT install is tolerant by design:** the `ExpToCasExe` dev tool has no
  `.wasm`, so `build-occt.sh` ignores that install error and instead verifies the
  required `libTK*.a` + headers exist.
- **OpenMP under Emscripten needs our own libomp.** emcc ships no OpenMP
  runtime/`omp.h`, so `find_package(OpenMP)` cannot autodetect and gmsh would
  *silently* fall back to serial. `build-wasm.sh` presets the `OpenMP_*` hint
  variables (pointing at `build/libomp-install/`) and greps ` OpenMP ` out of
  `GMSH_CONFIG_OPTIONS` in the generated `GmshConfig.h` after configure to
  refuse a serial build (gmsh has no `#define HAVE_OPENMP`; sources test the
  compiler's `_OPENMP`).
- **Every object in the pthread link must be `-pthread`-compiled** (gmsh, HXT,
  OCCT, libomp), or wasm-ld fails with `--shared-memory is disallowed by ...`.
  Keep the `-pthread` flags in build-libomp.sh / build-occt.sh / build-wasm.sh
  in sync, and clean-rebuild OCCT after toggling them.
- **wasm32 stacks live in linear memory; Emscripten's default is 64KB** for both
  the main thread and pthreads. Gmsh's tetgen-derived 3D boundary recovery
  (shared by the default Delaunay algorithm and HXT) is recursive; at `-O3`
  with no stack checks, overflowing 64KB silently corrupts adjacent memory
  instead of trapping — it showed up as a hang or an empty mesh (`getElements`
  returning nothing), even on small, non-degenerate geometry. Fixed by
  `-sSTACK_SIZE=4MB -sDEFAULT_PTHREAD_STACK_SIZE=2MB` in `build-wasm.sh`. If a
  similar hang/empty-mesh symptom reappears, suspect this class of bug first
  (check whether a new code path recurses deeper) before assuming it's an
  algorithm-correctness issue.
- **`Module.addFunction` table slots are per-`WebAssembly.Instance`**, i.e.
  per pthread worker — there is no Emscripten mechanism to sync a growable
  table across threads outside `MAIN_MODULE` builds. `setSizeCallback` (the
  one JS→WASM callback in this codebase) only works reliably at
  `General.NumThreads=1` (Gmsh's default); `src/runtime.mjs` warns once if it
  isn't.
- **Python is externally-managed (PEP 668).** For local docs builds install with
  `pip install --user --break-system-packages -r docs/requirements.txt` (CI uses
  a clean runner so it's fine there).
- Builds are **long** (OCCT especially). Run them in the background and watch the
  log; don't block.

## Decisions (fixed for v1)

Eigen (not BLAS/LAPACK) · `-fexceptions` · OpenMP + pthreads (libomp built from
LLVM sources by `scripts/build-libomp.sh`) · MEMFS for I/O ·
`MODULARIZE`+`EXPORT_ES6` · OCC enabled. Rationale is in `docs/architecture.md`
and `docs/building.md`.
