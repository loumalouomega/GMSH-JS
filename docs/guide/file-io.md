# File I/O

Gmsh reads and writes files through Emscripten's in-memory filesystem
(**MEMFS**). You hand it input files and retrieve output files via `gmsh.FS`,
which is Emscripten's `FS` object.

## Writing a mesh / model

```js
gmsh.model.mesh.generate(3);

gmsh.write('/out.msh');          // format inferred from extension
gmsh.write('/out.vtk');
gmsh.write('/out.stl');

// read the bytes back out of MEMFS
const msh = gmsh.FS.readFile('/out.msh');                    // Uint8Array
const txt = gmsh.FS.readFile('/out.msh', { encoding: 'utf8' }); // string
```

`gmsh.write(path)` chooses the writer from the file extension. Supported output
formats include `.msh` (Gmsh), `.vtk`, `.stl`, `.ply`, `.unv`, `.bdf` (Nastran),
`.step` / `.iges` (via OCC), and more.

## Reading an input file

Write your input into MEMFS first, then `open` or `merge` it (or import via the
OCC kernel for CAD).

```js
import { readFileSync } from 'node:fs';

// 1. stage the input file in MEMFS
const bytes = readFileSync('part.step');
gmsh.FS.writeFile('/part.step', bytes);

// 2a. CAD import via OpenCASCADE
gmsh.model.occ.importShapes('/part.step');
gmsh.model.occ.synchronize();

// 2b. ...or open a .geo / .msh directly
gmsh.open('/model.geo');
```

In the browser, fetch the file and pass the `Uint8Array`:

```js
const buf = new Uint8Array(await (await fetch('/part.step')).arrayBuffer());
gmsh.FS.writeFile('/part.step', buf);
gmsh.model.occ.importShapes('/part.step');
gmsh.model.occ.synchronize();
```

## STEP / IGES / BREP (OpenCASCADE)

CAD exchange formats require the `occ` kernel (`importShapes`). A full
round-trip:

```js
gmsh.model.add('box');
gmsh.model.occ.addBox(0, 0, 0, 1, 1, 1);
gmsh.model.occ.synchronize();

gmsh.write('/box.step');                 // export STEP

gmsh.clear();
gmsh.model.add('imported');
const { outDimTags } = gmsh.model.occ.importShapes('/box.step'); // [3, 1]
gmsh.model.occ.synchronize();

gmsh.model.mesh.generate(3);
```

## Helper for output strings

A small convenience for the common "mesh to string" case:

```js
function meshToString(gmsh, format = '/m.msh') {
  gmsh.write(format);
  const s = gmsh.FS.readFile(format, { encoding: 'utf8' });
  gmsh.FS.unlink(format);
  return s;
}
```

## Notes

- MEMFS lives in WASM memory; large meshes consume heap. See
  [Memory & limits](browser.md#memory).
- Paths are arbitrary in MEMFS (`/out.msh` is fine); they do not touch the host
  filesystem.
