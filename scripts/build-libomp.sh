#!/usr/bin/env bash
# Build LLVM's OpenMP runtime (libomp) as a static wasm32 library.
# Emscripten ships no OpenMP runtime or omp.h; gmsh's -fopenmp code links
# against this (see the OpenMP_* hint variables in build-wasm.sh).
#
# Output: libomp.a + omp.h under $LIBOMP_PREFIX.

set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/env.sh"
activate_emsdk

# --- Acquire pinned LLVM openmp source (per-project release tarballs) -------
# The standalone openmp build expects LLVM's shared cmake modules in a sibling
# ../cmake directory, so fetch both.
BASE="https://github.com/llvm/llvm-project/releases/download/llvmorg-$LLVM_OPENMP_VERSION"
if [ ! -f "$LIBOMP_SRC/openmp/CMakeLists.txt" ]; then
  echo ">> Fetching LLVM openmp $LLVM_OPENMP_VERSION"
  mkdir -p "$LIBOMP_SRC"
  for part in openmp cmake; do
    tarball="$THIRD_PARTY/$part-$LLVM_OPENMP_VERSION.src.tar.xz"
    curl -fL -o "$tarball" "$BASE/$part-$LLVM_OPENMP_VERSION.src.tar.xz"
    rm -rf "${LIBOMP_SRC:?}/$part"
    mkdir -p "$LIBOMP_SRC/$part"
    tar -xJf "$tarball" -C "$LIBOMP_SRC/$part" --strip-components=1
    rm -f "$tarball"
  done
fi

# llvm/llvm-project#116552: z_Linux_util.cpp uses PAGESIZE, which Emscripten's
# headers don't define. Wasm memory pages are 64 KiB.
zlu="$LIBOMP_SRC/openmp/runtime/src/z_Linux_util.cpp"
if grep -q 'PAGESIZE' "$zlu" && ! grep -q '#define PAGESIZE' "$zlu"; then
  sed -i '1i #ifndef PAGESIZE\n#define PAGESIZE 65536\n#endif' "$zlu"
  echo ">> Patched $zlu (PAGESIZE, llvm#116552)"
fi

# --- Configure (static, wasm32, pthreads) -----------------------------------
# -pthread: libomp objects must carry the atomics/bulk-memory features to be
# linkable into the shared-memory (pthread) module; must match gmsh/OCCT/emcc.
emcmake cmake -S "$LIBOMP_SRC/openmp" -B "$LIBOMP_BUILD" \
  -DCMAKE_BUILD_TYPE=Release \
  -DCMAKE_INSTALL_PREFIX="$LIBOMP_PREFIX" \
  -DCMAKE_C_FLAGS="-pthread" \
  -DCMAKE_CXX_FLAGS="-pthread" \
  -DOPENMP_STANDALONE_BUILD=ON \
  -DOPENMP_ENABLE_LIBOMPTARGET=OFF \
  -DLIBOMP_ARCH=wasm32 \
  -DLIBOMP_ENABLE_SHARED=OFF \
  -DLIBOMP_OMPT_SUPPORT=OFF \
  -DLIBOMP_USE_DEBUGGER=OFF \
  -DLIBOMP_FORTRAN_MODULES=OFF

# --- Build + install ---------------------------------------------------------
cmake --build "$LIBOMP_BUILD" -- -j"$(nproc)"
cmake --install "$LIBOMP_BUILD"

test -f "$LIBOMP_PREFIX/lib/libomp.a" \
  || { echo "libomp.a not produced" >&2; exit 1; }
test -f "$LIBOMP_PREFIX/include/omp.h" \
  || { echo "omp.h not installed" >&2; exit 1; }
echo ">> libomp installed to $LIBOMP_PREFIX"
