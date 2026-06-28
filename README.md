# gmsh-wasm

[Gmsh](https://gmsh.info) — a three-dimensional finite element mesh generator —
compiled to **WebAssembly** and exposed to JavaScript/TypeScript through its flat
`extern "C"` API. Geometry kernels (`geo` built-in + `occ` OpenCASCADE) and the
mesh module only; **no GUI / visualization**.

Works in **Node** and the **browser** (single-threaded, no `SharedArrayBuffer`
requirement), loaded asynchronously:

```js
import initGmsh from 'gmsh-wasm';

const gmsh = await initGmsh();
// ... build geometry, mesh, read/write .msh via the API ...
```

## Documentation

Full documentation — getting started, guides (geometry, meshing, file I/O,
browser, TypeScript), the complete generated API reference, and build/architecture
notes — is published at **<https://loumalouomega.github.io/GMSH-JS/>** (built from
[`docs/`](docs/) with MkDocs Material and deployed by CI).

## Status

Early / pre-release (`0.x`). Built from the pinned Gmsh submodule (version 5.0.0
dev) with Emscripten. See `scripts/` for how the artifact is produced.

## Building from source

```bash
npm run setup        # install + activate the pinned Emscripten SDK
npm run build:occt   # build OpenCASCADE to static WASM libs (needed for OCC)
npm run build:wasm   # build Gmsh's C API to dist/gmsh.{mjs,cjs,wasm}
npm test
```

## Filesystem

Gmsh reads/writes files (`.geo`, `.msh`, `.step`, `.stl`, …) through Emscripten's
in-memory filesystem (MEMFS). Hand it an input and retrieve the output via
`Module.FS`:

```js
const gmsh = await initGmsh();
gmsh.FS.writeFile('/in.step', stepBytes);     // Uint8Array
// ... import + mesh via the API, write '/out.msh' ...
const mesh = gmsh.FS.readFile('/out.msh');    // Uint8Array
```

## Known issues

- **3D Delaunay boundary recovery on re-imported CAD.** The default 3D meshing
  algorithm (Delaunay) can fail boundary recovery — producing zero tetrahedra —
  when meshing geometry that was round-tripped through STEP/IGES import in the
  WASM build. Native OCC and `geo` solids mesh fine with the default. Workaround:
  select the Frontal algorithm before generating:

  ```js
  gmsh.option.setNumber('Mesh.Algorithm3D', 4); // Frontal
  gmsh.model.mesh.generate(3);
  ```

  This is specific to the Emscripten target (native builds recover the boundary
  reliably) and is tracked for a future fix.

## Licensing — important

Gmsh is distributed under the **GNU General Public License, version 2 or later**
(GPL-2.0-or-later), with a linking exception covering Netgen, METIS, OpenCASCADE
and ParaView. Because this package **statically links** Gmsh (and OpenCASCADE)
into the `.wasm`, the resulting artifact and this package are likewise governed by
the **GPL-2.0-or-later**. Any software that distributes this package inherits
those obligations. A separate **commercial license** for Gmsh is available from
its authors — see <https://gmsh.info>.

This is an independent packaging effort and is **not** affiliated with or endorsed
by the Gmsh authors.

### Attribution

- Gmsh — C. Geuzaine and J.-F. Remacle. https://gmsh.info — GPL-2.0-or-later.
- OpenCASCADE Technology (OCCT) — https://dev.opencascade.org — LGPL-2.1 with
  exception.

See [LICENSE](LICENSE) and the upstream `gmsh/LICENSE.txt`.
