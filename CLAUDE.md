# CLAUDE.md

Guidance for working in this repository with Claude Code. Keep it short; record
only what isn't obvious from the code.

## What this is

`gmsh-wasm` compiles the **Gmsh** mesher's flat C API (`gmsh/api/gmshc.h`) to
WebAssembly with Emscripten and wraps it in a typed JS/TS API. Geometry (`geo` +
OpenCASCADE `occ`) and meshing only — **no GUI** (`fltk`/`graphics`/`view` are
filtered out everywhere). Targets Node and the browser; single-threaded.

## Architecture (how a change flows)

```
gmsh/api/gen.py (Gmsh's own API definition)
  └─ scripts/gen_js.py  → generated/exported_functions.json  (emcc -sEXPORTED_FUNCTIONS)
                          generated/gmsh-api.json            (runtime descriptor)
                          generated/gmsh.d.ts                (TypeScript types)
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
| Build OpenCASCADE → WASM libs | `npm run build:occt` |
| Build gmsh + assemble dist | `npm run build:wasm` (`GMSH_ENABLE_OCC=OFF` for no-OCC) |
| Regenerate bindings | `npm run gen` |
| Node tests | `npm test` |
| Browser test | `npm run test:browser` |
| Docs build | `npm run docs:build` |

emsdk is **not on PATH**; the scripts activate it via `scripts/env.sh`
(`activate_emsdk`). Pinned versions (emsdk, OCCT) live in `scripts/env.sh`.

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
- **3D Delaunay on re-imported CAD fails boundary recovery** in WASM (zero tets).
  Use `gmsh.option.setNumber('Mesh.Algorithm3D', 4)` (Frontal). Native geometry
  is fine. Tests use the Frontal path for the STEP round-trip.
- **Python is externally-managed (PEP 668).** For local docs builds install with
  `pip install --user --break-system-packages -r docs/requirements.txt` (CI uses
  a clean runner so it's fine there).
- Builds are **long** (OCCT especially). Run them in the background and watch the
  log; don't block.

## Decisions (fixed for v1)

Eigen (not BLAS/LAPACK) · `-fexceptions` · single-threaded · MEMFS for I/O ·
`MODULARIZE`+`EXPORT_ES6` · OCC enabled. Rationale is in `docs/architecture.md`
and `docs/building.md`.
