# Troubleshooting

## 3D meshing (Delaunay/HXT) hangs or produces zero tetrahedra on imported CAD

**If you hit this, you're on a `dist/` built before the `-sSTACK_SIZE` fix** (see
[architecture.md](architecture.md#the-native-build)) — rebuild from a current
checkout. Historically: after `importShapes` (STEP/IGES) + `generate(3)`, the
log would show `Meshing 3D...`, then `Tetrahedrizing N nodes...`, and either
hang indefinitely or (less often) complete with `getElements(3)` empty.

**Cause.** Gmsh's tetgen-derived 3D boundary recovery (shared by the default
Delaunay algorithm and HXT) recurses deeper than Emscripten's 64KB default
stack. At `-O3` with no stack checks, the overflow silently corrupted adjacent
linear memory instead of trapping, which surfaced as a hang or an empty mesh
rather than a crash — reproducible even on small (~200-node), non-degenerate
geometry, not just pathological inputs. `scripts/build-wasm.sh` now links with
`-sSTACK_SIZE=4MB -sDEFAULT_PTHREAD_STACK_SIZE=2MB`.

If you still see this on a current build, please file an issue with the
geometry and `Mesh.Algorithm3D` value — it likely needs a larger stack still
(`OPT` and stack-size env overrides are documented in
[building.md](building.md)).

## A call throws `Error: <fn>: is not exported in this build`

You called a function that is not in the export list of this `.wasm` (e.g. a
no-OCC build calling `gmsh.model.occ.*`). Use an OCC-enabled build, or avoid the
function.

## A call throws a Gmsh error message

That is expected — Gmsh reported a problem via its error mechanism and the
wrapper rethrew it as a JS `Error`. The message is the Gmsh message (e.g.
`Unknown curve loop ...`). Check your tags and that you called the kernel's
`synchronize()` before meshing.

## "forgot to call `gmsh.initialize()`"

`await initialize()` only loads the WASM module. You must then call
`gmsh.initialize()` before model operations, and `gmsh.finalize()` when done.
See [Getting started](getting-started.md#two-initialize-calls).

## Browser: `SharedArrayBuffer is not defined` / hangs at `initialize()`

This is a threaded (pthreads) build: browsers only expose `SharedArrayBuffer`
on **cross-origin-isolated** pages. The server must send both headers on the
document:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

Verify with `crossOriginIsolated === true` in the console. See
[Browser usage](guide/browser.md#threads-headers) for server snippets and the
`coi-serviceworker` workaround for header-less static hosts.

## Browser: `.wasm` fails to load / wrong MIME

The server must serve the `.wasm` with `Content-Type: application/wasm` for
streaming instantiation. With a bundler this is automatic; for a hand-rolled
server set the MIME type, or override `locateFile`
([Browser usage](guide/browser.md#locatefile)).

## Out-of-memory on large meshes

The heap grows to a 4 GB ceiling (`MAXIMUM_MEMORY`). Very large models can
exhaust it — coarsen the mesh (`Mesh.MeshSizeMax`), split the work, or
free/reuse the module between runs.

## Build from source: OCCT install "error" but libraries present

`build-occt.sh` tolerates a benign install failure for a developer codegen
executable (`ExpToCasExe`) that Emscripten doesn't emit a `.wasm` for; it then
verifies the required toolkits and headers. This is expected and the build
succeeds.
