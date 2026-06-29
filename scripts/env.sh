#!/usr/bin/env bash
# Shared environment for all build scripts. Source this; do not execute.
# Pins every external toolchain/version for reproducibility (CI + local).

set -euo pipefail

# Repo root (this file lives in <root>/scripts)
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# --- Pinned versions -------------------------------------------------------
# Emscripten SDK. Bump deliberately; CI caches keyed on this.
EMSDK_VERSION="${EMSDK_VERSION:-3.1.74}"
# OpenCASCADE technology release (modeling + data exchange only).
OCCT_VERSION="${OCCT_VERSION:-7.8.1}"

# --- Locations -------------------------------------------------------------
EMSDK_DIR="${EMSDK_DIR:-$ROOT/.emsdk}"
THIRD_PARTY="$ROOT/third_party"
OCCT_SRC="$THIRD_PARTY/occt"
BUILD_DIR="$ROOT/build"
OCCT_BUILD="$BUILD_DIR/occt"
OCCT_PREFIX="$BUILD_DIR/occt-install"   # WASM OCCT install prefix
GMSH_BUILD="$BUILD_DIR/gmsh"
DIST="$ROOT/dist"

export ROOT EMSDK_VERSION OCCT_VERSION EMSDK_DIR THIRD_PARTY OCCT_SRC \
       BUILD_DIR OCCT_BUILD OCCT_PREFIX GMSH_BUILD DIST

# Activate emsdk if present (emcc/emcmake on PATH, EMSDK set).
activate_emsdk() {
  if [ -f "$EMSDK_DIR/emsdk_env.sh" ]; then
    # shellcheck disable=SC1091
    source "$EMSDK_DIR/emsdk_env.sh" >/dev/null 2>&1
  else
    echo "emsdk not found at $EMSDK_DIR — run scripts/setup-emsdk.sh first" >&2
    return 1
  fi
}
