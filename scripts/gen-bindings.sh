#!/usr/bin/env bash
# Regenerate the JS/TS binding artifacts (descriptor, typings, export list)
# from the Gmsh API definition. Run after bumping the gmsh submodule.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
python3 "$ROOT/scripts/gen_js.py"
