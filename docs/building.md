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

The pinned **Emscripten SDK**, **OpenCASCADE**, and **LLVM OpenMP runtime**
versions are set in `scripts/env.sh`.

## One-shot build

```bash
npm run setup        # install + activate the pinned emsdk into .emsdk/
npm run build:libomp # build LLVM's OpenMP runtime (libomp) -> wasm32 static lib
npm run build:occt   # build OpenCASCADE -> static WASM libs (slow, ~once)
npm run build:wasm   # generate bindings, build gmsh, link + assemble dist/
npm test             # Node test suite
npm run test:browser # headless-Chromium test (needs playwright + chromium)
```

`npm run build` runs `build:libomp`, `build:occt`, then `build:wasm`.

## The pipeline

```
scripts/setup-emsdk.sh   emsdk (pinned) -> .emsdk/
scripts/build-libomp.sh  LLVM openmp source -> libomp.a in build/libomp-install/
scripts/build-occt.sh    OCCT source -> static libTK*.a in build/occt-install/
scripts/build-wasm.sh    gen_js.py  -> generated/ (exports, descriptor, .d.ts)
                         emcmake gmsh -> build/gmsh/libgmsh.a
                         emcc link  -> dist/gmsh-core.{mjs,cjs,wasm}
                         assemble.mjs -> dist/gmsh.{mjs,cjs}, runtime, descriptor
```

See [Architecture](architecture.md) for details.

## Key flags

Gmsh CMake (headless, OCC-enabled, OpenMP):

```
-DCMAKE_C_FLAGS="-pthread" -DCMAKE_CXX_FLAGS="-fexceptions -pthread"
-DENABLE_BUILD_LIB=ON -DENABLE_FLTK=OFF -DENABLE_GRAPHICS=OFF
-DENABLE_OPENMP=ON -DENABLE_MPI=OFF
-DOpenMP_C_FLAGS="-fopenmp -pthread -I<libomp>/include" -DOpenMP_C_LIB_NAMES=omp
-DOpenMP_CXX_FLAGS="-fopenmp -pthread -I<libomp>/include" -DOpenMP_CXX_LIB_NAMES=omp
-DOpenMP_omp_LIBRARY=<libomp>/lib/libomp.a
-DENABLE_EIGEN=ON -DENABLE_BLAS_LAPACK=OFF
-DENABLE_OCC=ON -DENABLE_OCC_STATIC=ON -DENABLE_OCC_CAF=ON
-DENABLE_MESH=ON -DENABLE_PARSER=ON -DENABLE_POST=ON
```

The explicit `OpenMP_*` variables are required because Emscripten ships no
OpenMP runtime, so CMake's `FindOpenMP` cannot autodetect one — without them
gmsh silently falls back to a serial build (`build-wasm.sh` asserts that
`OpenMP` appears in the generated `GMSH_CONFIG_OPTIONS` after configure to
catch this). Every object linked into the
shared-memory module must be compiled with `-pthread` (gmsh, OCCT, libomp
alike), or `wasm-ld` rejects the link.

Emscripten link:

```
-O3 -fexceptions -pthread
-sMODULARIZE=1 -sEXPORT_NAME=initGmsh -sEXPORT_ES6=1 (ESM)
-sALLOW_MEMORY_GROWTH=1 -sINITIAL_MEMORY=64MB -sMAXIMUM_MEMORY=4GB -sMALLOC=emmalloc
-sSTACK_SIZE=4MB -sDEFAULT_PTHREAD_STACK_SIZE=2MB
-sALLOW_TABLE_GROWTH=1
-sPTHREAD_POOL_SIZE=(typeof navigator!=='undefined'&&navigator.hardwareConcurrency)||4
-sFORCE_FILESYSTEM=1
-sEXPORTED_RUNTIME_METHODS=...,addFunction,removeFunction
-sEXPORTED_FUNCTIONS=@generated/exported_functions.json
-sENVIRONMENT=node,web,worker
```

`-sSTACK_SIZE`/`-sDEFAULT_PTHREAD_STACK_SIZE` raise Emscripten's 64KB default
(both stacks live in linear memory, not an OS stack) — Gmsh's tetgen-derived
3D boundary recovery (default Delaunay and HXT) recurses deep enough to
silently corrupt memory at the default size. `-sALLOW_TABLE_GROWTH` +
`addFunction`/`removeFunction` support `gmsh.model.mesh.setSizeCallback`,
which marshals a JS function into a native function-pointer callback; see
[Architecture](architecture.md#the-native-build).

A no-OCC build (faster, smaller, no STEP/IGES) is available with:

```bash
GMSH_ENABLE_OCC=OFF npm run build:wasm
```

## Build without OpenCASCADE

OCC roughly quadruples the `.wasm` size. If you do not need STEP/IGES/BREP
import or the `occ` kernel, build with `GMSH_ENABLE_OCC=OFF` for a ~12 MB
artifact (vs ~45 MB).
