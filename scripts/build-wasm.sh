#!/usr/bin/env bash
# Build Gmsh's flat C API to WebAssembly.
#   1. configure + build libgmsh.a with emcmake (headless, OpenMP-threaded
#      via pthreads + a wasm32 libomp from scripts/build-libomp.sh)
#   2. emcc-link libgmsh.a (+ OCCT static libs when OCC is on) into a
#      MODULARIZE'd reactor module, emitted as both ESM (.mjs) and CJS (.cjs)
#      sharing one gmsh.wasm.
#
# Env knobs:
#   GMSH_ENABLE_OCC=ON|OFF   (default ON; M1 derisk build uses OFF)
#   OPT=-O3                  (override for faster/debug builds, e.g. -O0 -g)

set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/env.sh"
activate_emsdk

GMSH_ENABLE_OCC="${GMSH_ENABLE_OCC:-ON}"
OPT="${OPT:--O3}"
GMSH_SRC="$ROOT/gmsh"

mkdir -p "$DIST"

if [ ! -f "$LIBOMP_PREFIX/lib/libomp.a" ]; then
  echo "libomp not built ($LIBOMP_PREFIX). Run scripts/build-libomp.sh." >&2
  exit 1
fi

# --- 1. Configure gmsh -----------------------------------------------------
occ_args=(-DENABLE_OCC=OFF)
occ_link_libs=()
if [ "$GMSH_ENABLE_OCC" = "ON" ]; then
  if [ ! -d "$OCCT_PREFIX/lib" ]; then
    echo "OCC requested but OCCT not built ($OCCT_PREFIX). Run scripts/build-occt.sh." >&2
    exit 1
  fi
  # gmsh's FindOCC reads $OCC_INC/Standard_Version.hxx and find_library()s each
  # TKxxx toolkit with `HINTS ENV CASROOT PATH_SUFFIXES lib`. The emscripten
  # toolchain sets CMAKE_FIND_ROOT_PATH_MODE_LIBRARY=ONLY (sysroot only), which
  # would hide our libs — relax it to BOTH and point CASROOT/library path at the
  # WASM OCCT install.
  export CASROOT="$OCCT_PREFIX"
  occ_args=(
    -DENABLE_OCC=ON -DENABLE_OCC_STATIC=ON -DENABLE_OCC_CAF=ON
    -DOCC_INC="$OCCT_PREFIX/include/opencascade"
    -DCMAKE_FIND_ROOT_PATH="$OCCT_PREFIX"
    -DCMAKE_LIBRARY_PATH="$OCCT_PREFIX/lib"
    -DCMAKE_FIND_ROOT_PATH_MODE_LIBRARY=BOTH
    -DCMAKE_FIND_ROOT_PATH_MODE_INCLUDE=BOTH
  )
  # OCCT static libs are not embedded in libgmsh.a; add them to the final link.
  # Listed twice to satisfy circular inter-toolkit references.
  mapfile -t _tk < <(ls "$OCCT_PREFIX"/lib/libTK*.a)
  occ_link_libs=("${_tk[@]}" "${_tk[@]}")
fi

# TODO: Enable more flags for future developments
# find_package(OpenMP) cannot autodetect under the Emscripten toolchain (its
# try_compile fails to link — no libomp in the sysroot), and gmsh then silently
# falls back to a serial build. Presetting all OpenMP_* variables makes
# FindOpenMP accept our wasm32 libomp; the HAVE_OPENMP grep below guards
# against any silent fallback.
emcmake cmake -S "$GMSH_SRC" -B "$GMSH_BUILD" \
  -DCMAKE_BUILD_TYPE=Release \
  -DCMAKE_C_FLAGS="-pthread" \
  -DCMAKE_CXX_FLAGS="-fexceptions -pthread" \
  -DCMAKE_EXE_LINKER_FLAGS="-pthread" \
  -DENABLE_BUILD_LIB=ON -DENABLE_BUILD_SHARED=OFF -DENABLE_BUILD_DYNAMIC=OFF \
  -DENABLE_FLTK=OFF -DENABLE_GRAPHICS=OFF -DENABLE_OS_SPECIFIC_INSTALL=OFF \
  -DENABLE_OPENMP=ON -DENABLE_MPI=OFF \
  -DOpenMP_C_FLAGS="-fopenmp -pthread -I$LIBOMP_PREFIX/include" \
  -DOpenMP_C_LIB_NAMES="omp" \
  -DOpenMP_CXX_FLAGS="-fopenmp -pthread -I$LIBOMP_PREFIX/include" \
  -DOpenMP_CXX_LIB_NAMES="omp" \
  -DOpenMP_omp_LIBRARY="$LIBOMP_PREFIX/lib/libomp.a" \
  -DENABLE_EIGEN=ON -DENABLE_BLAS_LAPACK=OFF \
  -DENABLE_PETSC=OFF -DENABLE_SLEPC=OFF -DENABLE_MUMPS=OFF \
  -DENABLE_MED=OFF -DENABLE_CGNS=OFF -DENABLE_HDF5=OFF \
  -DENABLE_MESH=ON -DENABLE_PARSER=ON -DENABLE_POST=ON \
  -DENABLE_TESTS=OFF \
  "${occ_args[@]}"

# HAVE_OPENMP is only a CMake variable (gmsh sources test the compiler's
# _OPENMP); the generated config records enabled options in a string.
grep -q '#define GMSH_CONFIG_OPTIONS.* OpenMP ' "$GMSH_BUILD/src/common/GmshConfig.h" \
  || { echo "OpenMP NOT enabled in gmsh configure (FindOpenMP fell back to serial) — refusing to build" >&2; exit 1; }

cmake --build "$GMSH_BUILD" --target lib -- -j"$(nproc)"

LIBGMSH="$(find "$GMSH_BUILD" -name 'libgmsh.a' | head -1)"
[ -n "$LIBGMSH" ] || { echo "libgmsh.a not produced" >&2; exit 1; }
echo ">> Built $LIBGMSH"

# --- 2. Generate bindings + determine exported functions ------------------
# Regenerate the descriptor / typings / export list from the Gmsh API
# definition so the link surface stays in sync with the submodule.
python3 "$ROOT/scripts/gen_js.py"
EXPORTS="$ROOT/generated/exported_functions.json"
if [ ! -f "$EXPORTS" ]; then
  EXPORTS="$ROOT/scripts/exported_functions.default.json"
  echo ">> Using fallback export list ($EXPORTS)."
fi

# --- 3. emcc link (shared flags) ------------------------------------------
# -pthread implies shared memory; emcc prints an advisory warning about
# ALLOW_MEMORY_GROWTH + pthreads (JS-side heap-access overhead) — expected.
# The pthread pool is pre-spawned: libomp's fork spin-waits on the calling
# thread, and browsers cannot start brand-new Workers while the main thread is
# blocked, so on-demand spawning would deadlock. Browsers size the pool from
# hardwareConcurrency; Node <21.1 has no `navigator` and falls back to 4.
#
# STACK_SIZE / DEFAULT_PTHREAD_STACK_SIZE: emscripten's default is 64KB for
# both the main thread and pthreads. Gmsh's tetgen-derived 3D boundary
# recovery (tetgenBR.cxx, used by both the default Delaunay algorithm and
# HXT) is recursive; at -O3 with no stack checks, overflowing 64KB silently
# corrupts adjacent linear memory instead of trapping, which manifests as
# hangs/zero-tet output rather than a crash. Both stacks live in linear
# memory (INITIAL_MEMORY/growth), not the OS stack, so raise them explicitly.
#
# ALLOW_TABLE_GROWTH + addFunction/removeFunction: required for
# gmsh.model.mesh.setSizeCallback, which marshals a JS mesh-size function into
# a native function-pointer callback via Module.addFunction(). Table growth
# and addFunction() are per-`WebAssembly.Instance` (i.e. per-thread) with no
# emscripten mechanism to sync across pthread workers outside MAIN_MODULE
# builds — callbacks only work reliably when General.NumThreads=1 (gmsh's
# default), see src/runtime.mjs.
common_flags=(
  "$OPT" -fexceptions -pthread
  -sMODULARIZE=1 -sEXPORT_NAME=initGmsh
  -sALLOW_MEMORY_GROWTH=1 -sINITIAL_MEMORY=64MB -sMAXIMUM_MEMORY=4GB
  -sMALLOC=emmalloc
  -sSTACK_SIZE=4MB -sDEFAULT_PTHREAD_STACK_SIZE=2MB
  -sALLOW_TABLE_GROWTH=1
  "-sPTHREAD_POOL_SIZE=(typeof navigator!=='undefined'&&navigator.hardwareConcurrency)||4"
  -sFORCE_FILESYSTEM=1
  -sEXPORTED_RUNTIME_METHODS=FS,ccall,cwrap,getValue,setValue,UTF8ToString,stringToUTF8,lengthBytesUTF8,PThread,wasmMemory,addFunction,removeFunction
  -sEXPORTED_FUNCTIONS=@"$EXPORTS"
  -sENVIRONMENT=node,web,worker
)

echo ">> Linking ESM core (dist/gmsh-core.mjs)"
emcc "$LIBGMSH" "${occ_link_libs[@]}" "$LIBOMP_PREFIX/lib/libomp.a" \
  "${common_flags[@]}" \
  -sEXPORT_ES6=1 \
  -o "$DIST/gmsh-core.mjs"

echo ">> Linking CJS core (dist/gmsh-core.cjs)"
emcc "$LIBGMSH" "${occ_link_libs[@]}" "$LIBOMP_PREFIX/lib/libomp.a" \
  "${common_flags[@]}" \
  -o "$DIST/gmsh-core.cjs"

# Both links emit an identical gmsh-core.wasm. Assemble the public entries
# (typed wrapper over the core, dual ESM/CJS) on top.
node "$ROOT/scripts/assemble.mjs"

ls -la "$DIST"
echo ">> Done."
