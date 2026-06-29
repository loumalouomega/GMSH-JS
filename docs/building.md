# Building from source

Consumers do **not** need to build — the npm package ships a prebuilt `.wasm`.
Build from source only to change build flags, bump Gmsh/OCCT, or develop the
package.

## Prerequisites

- Linux/macOS, `git`, `cmake` ≥ 3.16, `python3`, `node` ≥ 18
- Disk: several GB (OCCT + Gmsh build trees)
- The Gmsh git submodule checked out:
  ```bash
  git submodule update --init --recursive
  ```

The pinned **Emscripten SDK** and **OpenCASCADE** versions are set in
`scripts/env.sh`.

## One-shot build

```bash
npm run setup        # install + activate the pinned emsdk into .emsdk/
npm run build:occt   # build OpenCASCADE -> static WASM libs (slow, ~once)
npm run build:wasm   # generate bindings, build gmsh, link + assemble dist/
npm test             # Node test suite
npm run test:browser # headless-Chromium test (needs playwright + chromium)
```

`npm run build` runs `build:occt` then `build:wasm`.

## The pipeline

```
scripts/setup-emsdk.sh   emsdk (pinned) -> .emsdk/
scripts/build-occt.sh    OCCT source -> static libTK*.a in build/occt-install/
scripts/build-wasm.sh    gen_js.py  -> generated/ (exports, descriptor, .d.ts)
                         emcmake gmsh -> build/gmsh/libgmsh.a
                         emcc link  -> dist/gmsh-core.{mjs,cjs,wasm}
                         assemble.mjs -> dist/gmsh.{mjs,cjs}, runtime, descriptor
```

See [Architecture](architecture.md) for details.

## Key flags

Gmsh CMake (headless, OCC-enabled):

```
-DENABLE_BUILD_LIB=ON -DENABLE_FLTK=OFF -DENABLE_GRAPHICS=OFF
-DENABLE_OPENMP=OFF -DENABLE_MPI=OFF
-DENABLE_EIGEN=ON -DENABLE_BLAS_LAPACK=OFF
-DENABLE_OCC=ON -DENABLE_OCC_STATIC=ON -DENABLE_OCC_CAF=ON
-DENABLE_MESH=ON -DENABLE_PARSER=ON -DENABLE_POST=ON
```

Emscripten link:

```
-O3 -fexceptions
-sMODULARIZE=1 -sEXPORT_NAME=initGmsh -sEXPORT_ES6=1 (ESM)
-sALLOW_MEMORY_GROWTH=1 -sINITIAL_MEMORY=64MB -sMAXIMUM_MEMORY=4GB -sMALLOC=emmalloc
-sFORCE_FILESYSTEM=1
-sEXPORTED_FUNCTIONS=@generated/exported_functions.json
-sENVIRONMENT=node,web
```

A no-OCC build (faster, smaller, no STEP/IGES) is available with:

```bash
GMSH_ENABLE_OCC=OFF npm run build:wasm
```

## Build without OpenCASCADE

OCC roughly quadruples the `.wasm` size. If you do not need STEP/IGES/BREP
import or the `occ` kernel, build with `GMSH_ENABLE_OCC=OFF` for a ~12 MB
artifact (vs ~45 MB).
