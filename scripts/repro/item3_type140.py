#!/usr/bin/env python3
"""Item 3 repro (native): hex-dominant mesh (Algorithm3D 9 + Recombine3DAll) on a
3x4x5 STEP block; inspect element type 140 and the signed volumes."""
import json, os, tempfile
import gmsh

gmsh.initialize()
gmsh.option.setNumber("General.Terminal", 0)
gmsh.option.setNumber("General.NumThreads", 1)
gmsh.model.add("b")
gmsh.model.occ.addBox(0, 0, 0, 3, 4, 5)
gmsh.model.occ.synchronize()
step = os.path.join(tempfile.mkdtemp(), "block.step")
gmsh.write(step)
gmsh.clear(); gmsh.model.add("b2")
gmsh.model.occ.importShapes(step)
gmsh.model.occ.synchronize()
gmsh.option.setNumber("Mesh.Algorithm3D", 9)
gmsh.option.setNumber("Mesh.Recombine3DAll", 1)
gmsh.option.setNumber("Mesh.MeshSizeMax", 1)
gmsh.option.setNumber("Mesh.MeshSizeMin", 1)
gmsh.model.mesh.generate(3)
out = {}
types, tags, nodes = gmsh.model.mesh.getElements(3)
out["types"] = {int(t): len(e) for t, e in zip(types, tags)}
try:
    out["props140"] = list(gmsh.model.mesh.getElementProperties(140))
except Exception as e:
    out["props140"] = "ERROR: " + str(e).strip().splitlines()[-1]
# signed volumes via jacobians (det of the first-order map at the element centre)
tot = {}
for t, tg in zip(types, tags):
    try:
        jac, det, pts = gmsh.model.mesh.getJacobians(int(t), [0.0, 0.0, 0.0] if int(t) in (4, 5, 6, 7) else [0.0, 0.0, 0.0])
    except Exception as e:
        tot[int(t)] = "ERROR: " + str(e).strip().splitlines()[-1]
        continue
    tot[int(t)] = sum(det)
out["jacobian_det_sum"] = tot
print(json.dumps(out))
gmsh.finalize()
