// M4 tests: drive the assembled public entry (dist/gmsh.mjs) — the typed
// wrapper a consumer gets from `await initialize()`. Exercises the geo kernel,
// nested vectorvector outputs (getElements), the OCC kernel + STEP round-trip
// (skipped if OCC isn't in this build), and the error path.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import initialize from '../dist/gmsh.mjs';

const occAvailable = (gmsh) => typeof gmsh.module._gmshModelOccAddBox === 'function';

test('geo kernel: 2D square, getNodes + getElements (vectorvector)', async () => {
  const gmsh = await initialize();
  gmsh.initialize();
  gmsh.model.add('square');

  const lc = 0.2;
  const p = [
    gmsh.model.geo.addPoint(0, 0, 0, lc),
    gmsh.model.geo.addPoint(1, 0, 0, lc),
    gmsh.model.geo.addPoint(1, 1, 0, lc),
    gmsh.model.geo.addPoint(0, 1, 0, lc),
  ];
  const l = [
    gmsh.model.geo.addLine(p[0], p[1]),
    gmsh.model.geo.addLine(p[1], p[2]),
    gmsh.model.geo.addLine(p[2], p[3]),
    gmsh.model.geo.addLine(p[3], p[0]),
  ];
  const cl = gmsh.model.geo.addCurveLoop(l);
  gmsh.model.geo.addPlaneSurface([cl]);
  gmsh.model.geo.synchronize();
  gmsh.model.mesh.generate(2);

  const nodes = gmsh.model.mesh.getNodes();
  assert.ok(nodes.nodeTags.length > 0);
  assert.equal(nodes.coord.length, nodes.nodeTags.length * 3);

  // getElements: { elementTypes: number[], elementTags: number[][], nodeTags: number[][] }
  const els = gmsh.model.mesh.getElements();
  assert.ok(Array.isArray(els.elementTypes) && els.elementTypes.length > 0);
  assert.ok(Array.isArray(els.elementTags) && Array.isArray(els.elementTags[0]),
    'elementTags is number[][] (vectorvector)');
  const triIdx = els.elementTypes.indexOf(2); // 2 == 3-node triangle
  assert.ok(triIdx >= 0 && els.elementTags[triIdx].length > 0, 'has triangles');

  gmsh.finalize();
  console.log(`  ✓ geo 2D: ${nodes.nodeTags.length} nodes, ${els.elementTags[triIdx].length} triangles`);
});

test('occ kernel: native 3D box mesh (default Delaunay)', async (t) => {
  const gmsh = await initialize();
  if (!occAvailable(gmsh)) {
    t.skip('OCC not compiled into this build');
    return;
  }
  gmsh.initialize();
  gmsh.model.add('box');
  gmsh.model.occ.addBox(0, 0, 0, 1, 1, 1);
  gmsh.model.occ.synchronize();
  gmsh.model.mesh.generate(3);                  // default 3D algorithm

  const els = gmsh.model.mesh.getElements(3);
  const tetIdx = els.elementTypes.indexOf(4);   // 4 == 4-node tetrahedron
  assert.ok(tetIdx >= 0 && els.elementTags[tetIdx].length > 0, 'meshed tets from OCC solid');
  gmsh.finalize();
  console.log(`  ✓ occ box: ${els.elementTags[tetIdx].length} tetrahedra (default Delaunay)`);
});

test('occ kernel: STEP write -> import round-trip + mesh', async (t) => {
  const gmsh = await initialize();
  if (!occAvailable(gmsh)) {
    t.skip('OCC not compiled into this build');
    return;
  }
  gmsh.initialize();
  gmsh.model.add('box');
  gmsh.model.occ.addBox(0, 0, 0, 1, 1, 1);
  gmsh.model.occ.synchronize();

  // write STEP, clear, re-import — exercises OCC DataExchange (TKDESTEP).
  gmsh.write('/box.step');
  const step = gmsh.module.FS.readFile('/box.step', { encoding: 'utf8' });
  assert.match(step, /ISO-10303-21/, 'wrote a STEP file');
  assert.match(step, /MANIFOLD_SOLID|ADVANCED_BREP/, 'STEP contains a solid');

  gmsh.clear();
  gmsh.model.add('imported');
  const imp = gmsh.model.occ.importShapes('/box.step');
  assert.deepEqual(imp.outDimTags, [3, 1], 'imported one 3D solid (dim=3, tag=1)');
  gmsh.model.occ.synchronize();

  // Surface meshing the re-imported solid proves the geometry imported intact.
  gmsh.model.mesh.generate(2);
  const surf = gmsh.model.mesh.getElements(2);
  const triIdx = surf.elementTypes.indexOf(2);
  assert.ok(triIdx >= 0 && surf.elementTags[triIdx].length > 0, 'surface-meshed imported solid');

  // 3D meshing of re-imported geometry: the default Delaunay boundary recovery
  // is currently fragile in the WASM build (see KNOWN ISSUES in README); the
  // Frontal algorithm (3) recovers it reliably.
  gmsh.option.setNumber('Mesh.Algorithm3D', 4);
  gmsh.model.mesh.generate(3);
  const vol = gmsh.model.mesh.getElements(3);
  const tetIdx = vol.elementTypes.indexOf(4);
  assert.ok(tetIdx >= 0 && vol.elementTags[tetIdx].length > 0, 'meshed tets from STEP (Frontal 3D)');

  gmsh.finalize();
  console.log(`  ✓ STEP round-trip: ${surf.elementTags[triIdx].length} tris, ${vol.elementTags[tetIdx].length} tets (Frontal)`);
});

test('error path: surfaces over a missing curve loop throws a JS Error', async () => {
  const gmsh = await initialize();
  gmsh.initialize();
  gmsh.model.add('bad');
  // referencing a non-existent curve loop must surface as a thrown Error,
  // not a wasm trap or silent failure.
  assert.throws(() => {
    gmsh.model.geo.addPlaneSurface([424242]);
    gmsh.model.geo.synchronize();
  }, /gmsh|error|loop|not/i);
  gmsh.finalize();
});
