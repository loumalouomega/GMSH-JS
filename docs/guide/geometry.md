# Building geometry

Choose a kernel (`geo` or `occ`), construct entities, then `synchronize()`.

## Built-in `geo` kernel

The `geo` kernel builds a boundary representation bottom-up.

```js
gmsh.model.add('lshape');

const lc = 0.05;
const pts = [
  [0, 0], [2, 0], [2, 1], [1, 1], [1, 2], [0, 2],
].map(([x, y]) => gmsh.model.geo.addPoint(x, y, 0, lc));

const lines = pts.map((_, i) =>
  gmsh.model.geo.addLine(pts[i], pts[(i + 1) % pts.length]));

const loop = gmsh.model.geo.addCurveLoop(lines);
const surf = gmsh.model.geo.addPlaneSurface([loop]);

gmsh.model.geo.synchronize();
```

Common `geo` constructors (see the [reference](../api/reference.md#gmshmodelgeo)):

| Method | Purpose |
|--------|---------|
| `addPoint(x, y, z, meshSize?, tag?)` | a geometric point; `meshSize` sets local element size |
| `addLine(start, end, tag?)` | a straight segment between two points |
| `addCircleArc(start, center, end, tag?)` | a circular arc |
| `addCurveLoop(curveTags[], tag?, reorient?)` | a closed loop of curves |
| `addPlaneSurface(wireTags[], tag?)` | a plane surface bounded by loops (first = outer, rest = holes) |
| `addSurfaceLoop(surfaceTags[], tag?)` | a shell |
| `addVolume(shellTags[], tag?)` | a volume bounded by shells |
| `extrude(dimTags[], dx, dy, dz, ...)` | extrude entities |

### Holes

The first curve loop of a plane surface is the outer boundary; subsequent loops
are holes:

```js
const outer = gmsh.model.geo.addCurveLoop(outerLines);
const hole = gmsh.model.geo.addCurveLoop(holeLines);
gmsh.model.geo.addPlaneSurface([outer, hole]);
```

## OpenCASCADE `occ` kernel

The `occ` kernel offers CAD primitives and boolean operations.

```js
gmsh.model.add('part');

const box = gmsh.model.occ.addBox(0, 0, 0, 1, 1, 1);
const cyl = gmsh.model.occ.addCylinder(0.5, 0.5, -0.1, 0, 0, 1.2, 0.2);

// subtract the cylinder from the box
gmsh.model.occ.cut([[3, box]], [[3, cyl]]);

gmsh.model.occ.synchronize();
gmsh.model.mesh.generate(3);
```

Selected `occ` operations (see the [reference](../api/reference.md#gmshmodelocc)):

| Method | Purpose |
|--------|---------|
| `addBox / addCylinder / addSphere / addCone / addTorus` | primitives |
| `addWedge / addRectangle / addDisk` | more primitives |
| `fuse(objects, tools)` | boolean union |
| `cut(objects, tools)` | boolean difference |
| `intersect(objects, tools)` | boolean intersection |
| `fragment(objects, tools)` | general fragmentation (shared interfaces) |
| `fillet / chamfer` | edge blends |
| `importShapes(fileName)` | import STEP / IGES / BREP — see [File I/O](file-io.md) |

Boolean operations take and return **flat `(dim, tag)` arrays**:

```js
const out = gmsh.model.occ.fuse([[3, a]], [[3, b]]);
// out.outDimTags: [3, newTag, ...]
```

## Physical groups

Tag entities for export / boundary conditions:

```js
const g = gmsh.model.addPhysicalGroup(2, [surf], -1, 'plate');
gmsh.model.setPhysicalName(2, g, 'plate');
```

## Mesh size control

- Per-point size via the `meshSize` argument of `addPoint`.
- Global bounds: `gmsh.option.setNumber('Mesh.MeshSizeMin', 0.01)` /
  `'Mesh.MeshSizeMax'`.
- Size fields (`gmsh.model.mesh.field.*`) for distance-based and threshold
  sizing. See [Meshing](meshing.md).
