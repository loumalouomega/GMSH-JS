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

  // 3D meshing of re-imported geometry: this used to hang under the default
  // 3D algorithm (Delaunay) because Gmsh's tetgen-derived boundary recovery
  // recurses deeper than Emscripten's 64KB default stack, silently corrupting
  // memory (fixed by -sSTACK_SIZE in scripts/build-wasm.sh).
  gmsh.model.mesh.generate(3);
  const vol = gmsh.model.mesh.getElements(3);
  const tetIdx = vol.elementTypes.indexOf(4);
  assert.ok(tetIdx >= 0 && vol.elementTags[tetIdx].length > 0, 'meshed tets from STEP (default Delaunay)');

  gmsh.finalize();
  console.log(`  ✓ STEP round-trip: ${surf.elementTags[triIdx].length} tris, ${vol.elementTags[tetIdx].length} tets (Delaunay)`);
});

test('occ kernel: HXT (Algorithm3D=10) on STEP-reimported geometry', async (t) => {
  const gmsh = await initialize();
  if (!occAvailable(gmsh)) {
    t.skip('OCC not compiled into this build');
    return;
  }
  gmsh.initialize();
  gmsh.model.add('box');
  gmsh.model.occ.addBox(0, 0, 0, 1, 1, 1);
  gmsh.model.occ.synchronize();
  gmsh.write('/box-hxt.step');
  gmsh.clear();
  gmsh.model.add('imported');
  gmsh.model.occ.importShapes('/box-hxt.step');
  gmsh.model.occ.synchronize();

  // HXT shares the same recursive tetgen-derived boundary recovery as the
  // default Delaunay path — same stack-size fix, verify it separately.
  gmsh.option.setNumber('Mesh.Algorithm3D', 10);
  gmsh.model.mesh.generate(3);
  const vol = gmsh.model.mesh.getElements(3);
  const tetIdx = vol.elementTypes.indexOf(4);
  assert.ok(tetIdx >= 0 && vol.elementTags[tetIdx].length > 0, 'meshed tets from STEP (HXT)');
  gmsh.finalize();
  console.log(`  ✓ HXT on STEP round-trip: ${vol.elementTags[tetIdx].length} tets`);
});

test('mesh size callback: setSizeCallback drives local refinement', async (t) => {
  const gmsh = await initialize();
  if (typeof gmsh.module.addFunction !== 'function') {
    t.skip('dist built without addFunction support (stale dist/)');
    return;
  }
  gmsh.initialize();
  // The callback's table slot is only reachable from the thread that
  // installed it (see docs/api/overview.md), so meshing must stay serial.
  gmsh.option.setNumber('General.NumThreads', 1);
  gmsh.model.add('square');
  const lc = 0.5;
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
  gmsh.model.geo.addPlaneSurface([gmsh.model.geo.addCurveLoop(l)]);
  gmsh.model.geo.synchronize();
  gmsh.option.setNumber('Mesh.MeshSizeMax', lc);

  gmsh.model.mesh.generate(2);
  const baseline = gmsh.model.mesh.getNodes().nodeTags.length;

  let calls = 0;
  gmsh.model.mesh.setSizeCallback((dim, tag, x, y, z, meshLc) => {
    calls++;
    return 0.05;
  });
  gmsh.model.mesh.clear();
  gmsh.model.mesh.generate(2);
  const refined = gmsh.model.mesh.getNodes().nodeTags.length;
  assert.ok(calls > 0, 'callback was invoked during meshing');
  assert.ok(refined > baseline * 4, `callback drove refinement (${baseline} -> ${refined} nodes)`);

  gmsh.model.mesh.removeSizeCallback();
  gmsh.model.mesh.clear();
  gmsh.model.mesh.generate(2);
  const afterRemove = gmsh.model.mesh.getNodes().nodeTags.length;
  assert.ok(
    Math.abs(afterRemove - baseline) <= baseline * 0.5,
    `removeSizeCallback restored coarse sizing (${afterRemove} vs baseline ${baseline})`
  );

  gmsh.finalize();
  console.log(`  ✓ size callback: ${baseline} -> ${refined} nodes (${calls} calls) -> ${afterRemove} after removal`);
});

test('threads: OpenMP engages pthread pool workers', async () => {
  const gmsh = await initialize();
  gmsh.initialize();
  gmsh.option.setNumber('General.NumThreads', 2);
  assert.equal(gmsh.option.getNumber('General.NumThreads').value, 2);

  gmsh.model.add('threaded-square');
  const lc = 0.05;
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
  gmsh.model.geo.addPlaneSurface([gmsh.model.geo.addCurveLoop(l)]);
  gmsh.model.geo.synchronize();
  gmsh.model.mesh.generate(2);

  // libomp parks its team on pool pthreads after the first parallel region.
  const workers = gmsh.module.PThread.runningWorkers.length;
  assert.ok(workers >= 1, `expected OpenMP to occupy pool workers, got ${workers}`);
  gmsh.finalize();
  console.log(`  ✓ threads: ${workers} pool worker(s) engaged`);
});

test('occ kernel: experimental hex-dominant mesh (Algorithm3D=9 RTree)', async (t) => {
  const gmsh = await initialize();
  if (!occAvailable(gmsh)) {
    t.skip('OCC not compiled into this build');
    return;
  }
  gmsh.initialize();
  gmsh.model.add('box');
  gmsh.model.occ.addBox(0, 0, 0, 1, 1, 1);
  gmsh.model.occ.synchronize();

  // Upstream Gmsh only reaches meshCombine3D (the hex-tet hybrid recombiner)
  // via the experimental RTree algorithm — see docs/guide/meshing.md. Also
  // exercised the same recursive boundary recovery the stack-size fix
  // addresses, so this doubles as a regression check for that fix.
  gmsh.option.setNumber('Mesh.Algorithm3D', 9);
  gmsh.option.setNumber('Mesh.Recombine3DAll', 1);
  gmsh.model.mesh.generate(3);

  const vol = gmsh.model.mesh.getElements(3);
  const tetIdx = vol.elementTypes.indexOf(4);
  const hexIdx = vol.elementTypes.indexOf(5);
  assert.ok(tetIdx >= 0 && vol.elementTags[tetIdx].length > 0, 'has tets');
  assert.ok(hexIdx >= 0 && vol.elementTags[hexIdx].length > 0, 'has hexes');
  gmsh.finalize();
  console.log(`  ✓ hex-dominant (RTree): ${vol.elementTags[tetIdx].length} tets, ${vol.elementTags[hexIdx].length} hexes`);
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
