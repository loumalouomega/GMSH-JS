#!/usr/bin/env python3
"""Item 1 repro (native): 2D boundary layer + background size field.
Prints one JSON line per case; scripts/repro/item1_bl_background.mjs does the
same on the WASM build so the two outputs can be diffed."""
import json, math, sys
import gmsh

def stats(tag, err=None):
    r = {"case": tag}
    if err:
        r["error"] = err
        return r
    ntags, coord, _ = gmsh.model.mesh.getNodes()
    ys = sorted({round(coord[i + 1], 6) for i in range(0, len(coord), 3) if coord[i + 1] < 0.5 + 1e-9})
    types, tags, _n = gmsh.model.mesh.getElements(2)
    cnt = {int(t): len(e) for t, e in zip(types, tags)}
    r["tris"] = cnt.get(2, 0)
    r["quads"] = cnt.get(3, 0)
    r["nodes"] = len(ntags)
    r["rows_y"] = ys[:8]
    gaps = [ys[i + 1] - ys[i] for i in range(len(ys) - 1)]
    r["row_ratios"] = [round(gaps[i + 1] / gaps[i], 6) for i in range(min(len(gaps) - 1, 5))] if len(gaps) > 1 else []
    return r

def build(bl=None, bg=None, order="bl-first"):
    gmsh.clear()
    gmsh.model.add("r")
    gmsh.model.occ.addRectangle(0, 0, 0, 10, 4)
    gmsh.model.occ.synchronize()
    F = gmsh.model.mesh.field
    def mk_bl(curves, fans):
        f = F.add("BoundaryLayer")
        F.setNumbers(f, "CurvesList", curves)
        F.setNumber(f, "hwall_n", 0.05)
        F.setNumber(f, "ratio", 1.2)
        F.setNumber(f, "thickness", 0.5)
        F.setNumber(f, "Quads", 1)
        F.setNumbers(f, "FanPointsList", fans)
        F.setAsBoundaryLayer(f)
        return f
    def mk_bg():
        if bg == "threshold":
            d = F.add("Distance"); F.setNumbers(d, "CurvesList", [1]); F.setNumber(d, "Sampling", 100)
            t = F.add("Threshold"); F.setNumber(t, "InField", d)
            F.setNumber(t, "SizeMin", 0.2); F.setNumber(t, "SizeMax", 1.0)
            F.setNumber(t, "DistMin", 0.5); F.setNumber(t, "DistMax", 3.0)
            m = F.add("Min"); F.setNumbers(m, "FieldsList", [t])
            F.setAsBackgroundMesh(m)
        elif bg == "threshold-only":
            d = F.add("Distance"); F.setNumbers(d, "CurvesList", [1]); F.setNumber(d, "Sampling", 100)
            t = F.add("Threshold"); F.setNumber(t, "InField", d)
            F.setNumber(t, "SizeMin", 0.2); F.setNumber(t, "SizeMax", 1.0)
            F.setNumber(t, "DistMin", 0.5); F.setNumber(t, "DistMax", 3.0)
            F.setAsBackgroundMesh(t)
        elif bg == "constant":
            c = F.add("MathEval"); F.setString(c, "F", "0.3")
            F.setAsBackgroundMesh(c)
    if order == "bg-first": mk_bg()
    if bl == "one": mk_bl([1], [1, 2])
    elif bl == "two-disjoint": mk_bl([1], [1, 2]); mk_bl([3], [3, 4])
    elif bl == "two-shared": mk_bl([1], [1, 2]); mk_bl([2], [2, 3])
    if order != "bg-first": mk_bg()
    gmsh.option.setNumber("Mesh.Algorithm", 6)
    gmsh.option.setNumber("Mesh.MeshSizeMax", 1.0)

def run(tag, **kw):
    try:
        build(**kw)
        gmsh.model.mesh.generate(2)
        print(json.dumps(stats(tag)))
    except Exception as e:
        print(json.dumps(stats(tag, str(e).strip().splitlines()[-1] if str(e).strip() else repr(e))))

gmsh.initialize()
gmsh.option.setNumber("General.Terminal", 0)
gmsh.option.setNumber("General.NumThreads", 1)
run("plain")
run("bl", bl="one")
run("bl+threshold(bl-first)", bl="one", bg="threshold")
run("bl+threshold(bg-first)", bl="one", bg="threshold", order="bg-first")
run("threshold-only", bg="threshold-only")
run("constant-only", bg="constant")
run("two-layers-disjoint", bl="two-disjoint")
run("two-layers-shared-fan", bl="two-shared")
gmsh.finalize()
