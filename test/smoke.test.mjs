// M1 smoke test: load the WASM module, build a unit square with the built-in
// `geo` kernel, mesh it in 2D, write a .msh, and assert we got nodes back.
// Uses the raw C exports directly (the typed wrapper comes in M3).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import initGmsh from '../dist/gmsh.mjs';
import { makeHelpers } from './raw-helpers.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

test('geo kernel: mesh a unit square in 2D', async () => {
  const Module = await initGmsh();
  const h = makeHelpers(Module);

  h.checked('gmshInitialize', (ierr) =>
    Module._gmshInitialize(0, 0, 0, 0, ierr));

  const name = h.cstr('square');
  h.checked('gmshModelAdd', (ierr) => Module._gmshModelAdd(name, ierr));
  h.free(name);

  const lc = 0.2;
  const p1 = h.checked('addPoint', (e) => Module._gmshModelGeoAddPoint(0, 0, 0, lc, -1, e));
  const p2 = h.checked('addPoint', (e) => Module._gmshModelGeoAddPoint(1, 0, 0, lc, -1, e));
  const p3 = h.checked('addPoint', (e) => Module._gmshModelGeoAddPoint(1, 1, 0, lc, -1, e));
  const p4 = h.checked('addPoint', (e) => Module._gmshModelGeoAddPoint(0, 1, 0, lc, -1, e));

  const l1 = h.checked('addLine', (e) => Module._gmshModelGeoAddLine(p1, p2, -1, e));
  const l2 = h.checked('addLine', (e) => Module._gmshModelGeoAddLine(p2, p3, -1, e));
  const l3 = h.checked('addLine', (e) => Module._gmshModelGeoAddLine(p3, p4, -1, e));
  const l4 = h.checked('addLine', (e) => Module._gmshModelGeoAddLine(p4, p1, -1, e));

  const loopArr = h.intArray([l1, l2, l3, l4]);
  const cl = h.checked('addCurveLoop', (e) =>
    Module._gmshModelGeoAddCurveLoop(loopArr, 4, -1, 0, e));
  h.free(loopArr);

  const wireArr = h.intArray([cl]);
  h.checked('addPlaneSurface', (e) =>
    Module._gmshModelGeoAddPlaneSurface(wireArr, 1, -1, e));
  h.free(wireArr);

  h.checked('synchronize', (e) => Module._gmshModelGeoSynchronize(e));
  h.checked('generate(2)', (e) => Module._gmshModelMeshGenerate(2, e));

  // getNodes: 6 output pointer slots + dim/tag/includeBoundary/parametric.
  const slots = Array.from({ length: 6 }, () => h.malloc(4));
  const [pTags, pTagsN, pCoord, pCoordN, pParam, pParamN] = slots;
  h.checked('getNodes', (e) =>
    Module._gmshModelMeshGetNodes(pTags, pTagsN, pCoord, pCoordN, pParam, pParamN, -1, -1, 0, 0, e));
  const nNodes = h.readInt(pTagsN);
  // release gmsh-allocated arrays
  for (const slot of [pTags, pCoord, pParam]) Module._gmshFree(h.readInt(slot));
  for (const slot of slots) h.free(slot);

  assert.ok(nNodes > 0, `expected nodes, got ${nNodes}`);

  // Write and read back the mesh file from MEMFS.
  const outPath = '/out.msh';
  const out = h.cstr(outPath);
  h.checked('gmshWrite', (e) => Module._gmshWrite(out, e));
  h.free(out);

  const msh = Module.FS.readFile(outPath, { encoding: 'utf8' });
  assert.match(msh, /\$Nodes/, 'written .msh should contain a $Nodes section');

  h.checked('gmshFinalize', (e) => Module._gmshFinalize(e));

  console.log(`  ✓ meshed unit square: ${nNodes} nodes, ${msh.length} bytes of .msh`);
});
