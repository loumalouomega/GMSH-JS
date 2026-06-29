#!/usr/bin/env bash
# Build a minimal OpenCASCADE (OCCT) to static WASM libraries: the foundation,
# modeling, and data-exchange (STEP/IGES/BREP) toolkits that Gmsh's OCC kernel
# links against. Visualization / Draw / fonts are disabled.
#
# Output: static libTK*.a + headers under $OCCT_PREFIX.

set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/env.sh"
activate_emsdk

# --- Acquire pinned OCCT source (tarball, not a heavy submodule) ------------
OCCT_TAG="V${OCCT_VERSION//./_}"   # 7.8.1 -> V7_8_1
if [ ! -f "$OCCT_SRC/CMakeLists.txt" ]; then
  echo ">> Fetching OCCT $OCCT_TAG"
  mkdir -p "$THIRD_PARTY"
  tarball="$THIRD_PARTY/occt-$OCCT_TAG.tar.gz"
  curl -fL -o "$tarball" \
    "https://github.com/Open-Cascade-SAS/OCCT/archive/refs/tags/$OCCT_TAG.tar.gz"
  rm -rf "$OCCT_SRC"
  mkdir -p "$OCCT_SRC"
  tar -xzf "$tarball" -C "$OCCT_SRC" --strip-components=1
  rm -f "$tarball"
fi

# --- Configure (static, headless) ------------------------------------------
# -fexceptions: OCCT relies on C++ exceptions; must match the gmsh/emcc setting.
emcmake cmake -S "$OCCT_SRC" -B "$OCCT_BUILD" \
  -DCMAKE_BUILD_TYPE=Release \
  -DCMAKE_INSTALL_PREFIX="$OCCT_PREFIX" \
  -DCMAKE_CXX_FLAGS="-fexceptions" \
  -DBUILD_LIBRARY_TYPE=Static \
  -DBUILD_MODULE_Draw=OFF \
  -DBUILD_MODULE_Visualization=OFF \
  -DBUILD_MODULE_ApplicationFramework=ON \
  -DBUILD_MODULE_DataExchange=ON \
  -DBUILD_MODULE_ModelingAlgorithms=ON \
  -DBUILD_MODULE_ModelingData=ON \
  -DBUILD_MODULE_FoundationClasses=ON \
  -DBUILD_DOC_Overview=OFF \
  -DBUILD_USE_PCH=OFF \
  -DUSE_FREETYPE=OFF \
  -DUSE_TK=OFF \
  -DUSE_TCL=OFF \
  -DUSE_OPENGL=OFF \
  -DUSE_GLES2=OFF \
  -DUSE_RAPIDJSON=OFF \
  -DUSE_DRACO=OFF \
  -DUSE_VTK=OFF \
  -DUSE_FREEIMAGE=OFF \
  -DUSE_OPENVR=OFF \
  -DINSTALL_TEST_CASES=OFF

# --- Build + install -------------------------------------------------------
cmake --build "$OCCT_BUILD" -- -j"$(nproc)"

# The install target also tries to install a developer codegen executable
# (ExpToCasExe) whose emscripten .wasm companion isn't emitted -- harmless, and
# we don't need it. Tolerate that, then verify the libraries/headers we DO need.
cmake --install "$OCCT_BUILD" \
  || echo ">> (install reported errors; verifying required artifacts instead)"

required="TKDESTEP TKDEIGES TKXSBase TKOffset TKFeat TKFillet TKBool TKMesh \
TKHLR TKBO TKPrim TKShHealing TKTopAlgo TKGeomAlgo TKBRep TKGeomBase TKG3d \
TKG2d TKMath TKernel"
missing=0
for t in $required; do
  if [ ! -f "$OCCT_PREFIX/lib/lib$t.a" ]; then
    echo "MISSING required toolkit: lib$t.a" >&2; missing=1
  fi
done
if [ ! -f "$OCCT_PREFIX/include/opencascade/Standard_Version.hxx" ]; then
  echo "MISSING OCCT headers (Standard_Version.hxx)" >&2; missing=1
fi
if [ "$missing" != 0 ]; then
  echo "OCCT install incomplete: required toolkits/headers missing" >&2
  exit 1
fi

echo ">> OCCT installed to $OCCT_PREFIX ($(ls "$OCCT_PREFIX"/lib/libTK*.a | wc -l) toolkits)"
