#!/usr/bin/env bash
# Install and activate a pinned Emscripten SDK into <root>/.emsdk.
# Idempotent: re-running with the same EMSDK_VERSION is a no-op fast path.

set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/env.sh"

if [ ! -d "$EMSDK_DIR" ]; then
  echo ">> Cloning emsdk into $EMSDK_DIR"
  git clone https://github.com/emscripten-core/emsdk.git "$EMSDK_DIR"
fi

cd "$EMSDK_DIR"
git fetch --tags --quiet || true

echo ">> Installing emsdk $EMSDK_VERSION"
./emsdk install "$EMSDK_VERSION"
./emsdk activate "$EMSDK_VERSION"

# shellcheck disable=SC1091
source "$EMSDK_DIR/emsdk_env.sh"

echo ">> Toolchain ready:"
emcc --version | head -1
emcmake cmake --version | head -1
