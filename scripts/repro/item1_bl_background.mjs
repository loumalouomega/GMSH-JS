// Item 1 repro (WASM): mirror of item1_bl_background.py.
// usage: node scripts/repro/item1_bl_background.mjs
import initialize from '../../dist/gmsh.mjs';

const gmsh = await initialize({ print() {}, printErr() {} });
gmsh.initialize();
gmsh.option.setNumber('General.NumThreads', 1);
const F = gmsh.model.mesh.field;

function stats(tag, err) {
  if (err) return { case: tag, error: err };
  const { nodeTags, coord } = gmsh.model.mesh.getNodes();
  const ysSet = new Set();
  for (let i = 0; i < coord.length; i += 3) if (coord[i + 1] < 0.5 + 1e-9) ysSet.add(Math.round(coord[i + 1] * 1e6) / 1e6);
  const ys = [...ysSet].sort((a, b) => a - b);
  const els = gmsh.model.mesh.getElements(2);
  const cnt = {};
  els.elementTypes.forEach((t, i) => { cnt[t] = els.elementTags[i].length; });
  const gaps = ys.slice(1).map((y, i) => y - ys[i]);
  const ratios = [];
  for (let i = 0; i < Math.min(gaps.length - 1, 5); i++) ratios.push(Math.round(gaps[i + 1] / gaps[i] * 1e6) / 1e6);
  return { case: tag, tris: cnt[2] || 0, quads: cnt[3] || 0, nodes: nodeTags.length, rows_y: ys.slice(0, 8), row_ratios: ratios };
}

function build({ bl, bg, order = 'bl-first' }) {
  gmsh.clear();
  gmsh.model.add('r');
  gmsh.model.occ.addRectangle(0, 0, 0, 10, 4);
  gmsh.model.occ.synchronize();
  const mkBl = (curves, fans) => {
    const f = F.add('BoundaryLayer');
    F.setNumbers(f, 'CurvesList', curves);
    F.setNumber(f, 'hwall_n', 0.05);
    F.setNumber(f, 'ratio', 1.2);
    F.setNumber(f, 'thickness', 0.5);
    F.setNumber(f, 'Quads', 1);
    F.setNumbers(f, 'FanPointsList', fans);
    F.setAsBoundaryLayer(f);
  };
  const mkBg = () => {
    if (bg === 'threshold' || bg === 'threshold-only') {
      const d = F.add('Distance'); F.setNumbers(d, 'CurvesList', [1]); F.setNumber(d, 'Sampling', 100);
      const t = F.add('Threshold'); F.setNumber(t, 'InField', d);
      F.setNumber(t, 'SizeMin', 0.2); F.setNumber(t, 'SizeMax', 1.0);
      F.setNumber(t, 'DistMin', 0.5); F.setNumber(t, 'DistMax', 3.0);
      if (bg === 'threshold') { const m = F.add('Min'); F.setNumbers(m, 'FieldsList', [t]); F.setAsBackgroundMesh(m); }
      else F.setAsBackgroundMesh(t);
    } else if (bg === 'constant') {
      const c = F.add('MathEval'); F.setString(c, 'F', '0.3'); F.setAsBackgroundMesh(c);
    }
  };
  if (order === 'bg-first') mkBg();
  if (bl === 'one') mkBl([1], [1, 2]);
  else if (bl === 'two-disjoint') { mkBl([1], [1, 2]); mkBl([3], [3, 4]); }
  else if (bl === 'two-shared') { mkBl([1], [1, 2]); mkBl([2], [2, 3]); }
  if (order !== 'bg-first') mkBg();
  gmsh.option.setNumber('Mesh.Algorithm', 6);
  gmsh.option.setNumber('Mesh.MeshSizeMax', 1.0);
}

function run(tag, opts = {}) {
  try {
    build(opts);
    gmsh.model.mesh.generate(2);
    console.log(JSON.stringify(stats(tag)));
  } catch (e) {
    const lines = String(e.message).trim().split('\n');
    console.log(JSON.stringify(stats(tag, lines[lines.length - 1])));
  }
}

run('plain');
run('bl', { bl: 'one' });
run('bl+threshold(bl-first)', { bl: 'one', bg: 'threshold' });
run('bl+threshold(bg-first)', { bl: 'one', bg: 'threshold', order: 'bg-first' });
run('threshold-only', { bg: 'threshold-only' });
run('constant-only', { bg: 'constant' });
run('two-layers-disjoint', { bl: 'two-disjoint' });
run('two-layers-shared-fan', { bl: 'two-shared' });
gmsh.finalize();
