#!/usr/bin/env bash
# Build Gmsh's flat C API to WebAssembly.
#   1. configure + build libgmsh.a with emcmake (headless, single-thread)
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

# --- 1. Configure gmsh -----------------------------------------------------
occ_args=(-DENABLE_OCC=OFF)
occ_link_libs=()
if [ "$GMSH_ENABLE_OCC" = "ON" ]; then
  if [ ! -d "$OCCT_PREFIX/lib" ]; then
    echo "OCC requested but OCCT not built ($OCCT_PREFIX). Run scripts/build-occt.sh." >&2
    exit 1
  fi
  occ_args=(
    -DENABLE_OCC=ON -DENABLE_OCC_STATIC=ON -DENABLE_OCC_CAF=ON
    -DOCC_INC="$OCCT_PREFIX/include/opencascade"
    # The emscripten toolchain restricts find_library to its sysroot; widen it
    # so gmsh's FindOCC can locate our WASM libTK*.a.
    -DCMAKE_FIND_ROOT_PATH="$OCCT_PREFIX"
    -DCMAKE_LIBRARY_PATH="$OCCT_PREFIX/lib"
  )
  # OCCT static libs are not embedded in libgmsh.a; add them to the final link.
  # Listed twice to satisfy circular inter-toolkit references.
  mapfile -t _tk < <(ls "$OCCT_PREFIX"/lib/libTK*.a)
  occ_link_libs=("${_tk[@]}" "${_tk[@]}")
fi

# TODO: Enable more flags for future developments
emcmake cmake -S "$GMSH_SRC" -B "$GMSH_BUILD" \
  -DCMAKE_BUILD_TYPE=Release \
  -DCMAKE_CXX_FLAGS="-fexceptions" \
  -DENABLE_BUILD_LIB=ON -DENABLE_BUILD_SHARED=OFF -DENABLE_BUILD_DYNAMIC=OFF \
  -DENABLE_FLTK=OFF -DENABLE_GRAPHICS=OFF -DENABLE_OS_SPECIFIC_INSTALL=OFF \
  -DENABLE_OPENMP=OFF -DENABLE_MPI=OFF \
  -DENABLE_EIGEN=ON -DENABLE_BLAS_LAPACK=OFF \
  -DENABLE_PETSC=OFF -DENABLE_SLEPC=OFF -DENABLE_MUMPS=OFF \
  -DENABLE_MED=OFF -DENABLE_CGNS=OFF -DENABLE_HDF5=OFF \
  -DENABLE_MESH=ON -DENABLE_PARSER=ON -DENABLE_POST=ON \
  -DENABLE_TESTS=OFF \
  "${occ_args[@]}"

cmake --build "$GMSH_BUILD" --target lib -- -j"$(nproc)"

LIBGMSH="$(find "$GMSH_BUILD" -name 'libgmsh.a' | head -1)"
[ -n "$LIBGMSH" ] || { echo "libgmsh.a not produced" >&2; exit 1; }
echo ">> Built $LIBGMSH"

# --- 2. Determine exported functions --------------------------------------
EXPORTS="$ROOT/generated/exported_functions.json"
if [ ! -f "$EXPORTS" ]; then
  EXPORTS="$ROOT/scripts/exported_functions.default.json"
  echo ">> Using fallback export list ($EXPORTS); run scripts/gen-bindings.sh for the full surface."
fi

# --- 3. emcc link (shared flags) ------------------------------------------
common_flags=(
  "$OPT" -fexceptions
  -sMODULARIZE=1 -sEXPORT_NAME=initGmsh
  -sALLOW_MEMORY_GROWTH=1 -sINITIAL_MEMORY=64MB -sMAXIMUM_MEMORY=4GB
  -sMALLOC=emmalloc
  -sFORCE_FILESYSTEM=1
  -sEXPORTED_RUNTIME_METHODS=FS,ccall,cwrap,getValue,setValue,UTF8ToString,stringToUTF8,lengthBytesUTF8
  -sEXPORTED_FUNCTIONS=@"$EXPORTS"
  -sENVIRONMENT=node,web
)

echo ">> Linking ESM (dist/gmsh.mjs)"
emcc "$LIBGMSH" "${occ_link_libs[@]}" "${common_flags[@]}" \
  -sEXPORT_ES6=1 \
  -o "$DIST/gmsh.mjs"

echo ">> Linking CJS (dist/gmsh.cjs)"
emcc "$LIBGMSH" "${occ_link_libs[@]}" "${common_flags[@]}" \
  -o "$DIST/gmsh.cjs"

# Both links emit a gmsh.wasm; they are identical. Keep one.
ls -la "$DIST"
echo ">> Done."
