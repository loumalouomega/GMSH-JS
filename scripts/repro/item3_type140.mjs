// Item 3 repro (WASM): mirror of item3_type140.py
import initialize from '../../dist/gmsh.mjs';
const gmsh = await initialize({ print() {}, printErr() {} });
gmsh.initialize();
gmsh.option.setNumber('General.NumThreads', 1);
gmsh.model.add('b');
gmsh.model.occ.addBox(0, 0, 0, 3, 4, 5);
gmsh.model.occ.synchronize();
gmsh.write('/block.step');
gmsh.clear(); gmsh.model.add('b2');
gmsh.model.occ.importShapes('/block.step');
gmsh.model.occ.synchronize();
gmsh.option.setNumber('Mesh.Algorithm3D', 9);
gmsh.option.setNumber('Mesh.Recombine3DAll', 1);
gmsh.option.setNumber('Mesh.MeshSizeMax', 1);
gmsh.option.setNumber('Mesh.MeshSizeMin', 1);
gmsh.model.mesh.generate(3);
const out = {};
const els = gmsh.model.mesh.getElements(3);
out.types = {};
els.elementTypes.forEach((t, i) => { out.types[t] = els.elementTags[i].length; });
try { out.props140 = gmsh.model.mesh.getElementProperties(140); } catch (e) { out.props140 = 'ERROR: ' + String(e.message).trim().split('\n').pop(); }
console.log(JSON.stringify(out));
gmsh.finalize();
