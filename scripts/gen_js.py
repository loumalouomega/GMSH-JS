#!/usr/bin/env python3
"""Generate the JavaScript/TypeScript binding artifacts for gmsh-wasm from
Gmsh's own declarative API definition (gmsh/api/gen.py + GenApi.py) -- the same
source that emits the Python/Julia/Fortran bindings.

Outputs (into generated/):
  - exported_functions.json : Emscripten -sEXPORTED_FUNCTIONS list (full C API
                              surface, minus GUI; plus malloc/free/gmshFree).
  - gmsh-api.json           : descriptor table consumed by src/runtime.mjs --
                              one entry per function (module path, JS name, C
                              symbol, return kind, typed args + defaults).
  - gmsh.d.ts               : TypeScript declarations for the typed wrapper.

We do NOT hand-marshal per function: the runtime interprets the descriptor.
GUI/visualization modules (fltk, graphics, view) are filtered out.
"""

import os
import sys
import json
import math

ROOT = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
API_DIR = os.path.join(ROOT, "gmsh", "api")
OUT_DIR = os.path.join(ROOT, "generated")

GUI_MODULES = {"fltk", "graphics", "view"}

# ---------------------------------------------------------------------------
# Load the API definition, tagging every arg with a `.kind` as it is created.
# ---------------------------------------------------------------------------
def load_api():
    sys.path.insert(0, API_DIR)
    import GenApi  # noqa: E402

    # Wrap the input/output factory functions so each produced arg records its
    # kind. The three scalar-output *classes* (oint/osize/odouble) are tagged
    # via their __init__ and also recognised by identity when used as rtype.
    factory_names = [
        "ibool", "iint", "isize", "idouble", "istring", "ivoidstar",
        "iargcargv", "isizefun",
        "ivectorint", "ivectorsize", "ivectordouble", "ivectorstring",
        "ivectorpair", "ivectorvectorint", "ivectorvectorsize",
        "ivectorvectordouble",
        "ostring", "ovectorint", "ovectorsize", "ovectordouble",
        "ovectorstring", "ovectorpair", "ovectorvectorint",
        "ovectorvectorsize", "ovectorvectordouble", "ovectorvectorpair",
    ]
    for fname in factory_names:
        fn = getattr(GenApi, fname)

        def make(fn, kind):
            def wrapper(*a, **k):
                r = fn(*a, **k)
                r.kind = kind
                return r
            return wrapper
        setattr(GenApi, fname, make(fn, fname))

    for cls_name in ("oint", "osize", "odouble"):
        cls = getattr(GenApi, cls_name)
        # Tag the class itself: these are passed as the class (not an instance)
        # when used as a return type, e.g. geo.add('addPoint', doc, oint, ...).
        cls.kind = cls_name
        orig_init = cls.__init__

        def make_init(orig_init, kind):
            def __init__(self, *a, **k):
                orig_init(self, *a, **k)
                self.kind = kind
            return __init__
        cls.__init__ = make_init(orig_init, cls_name)

    src = open(os.path.join(API_DIR, "gen.py")).read()
    src = src.split("api.write_cpp()")[0]
    g = {"__name__": "gmsh_gen_loaded", "__file__": os.path.join(API_DIR, "gen.py")}
    exec(compile(src, os.path.join(API_DIR, "gen.py"), "exec"), g)
    return g["api"], GenApi


# ---------------------------------------------------------------------------
# Default value: C++ literal -> JS literal source (string) or None.
# ---------------------------------------------------------------------------
def js_default(v):
    if v is None:
        return None
    if v in ("true", "false"):
        return v
    if v.startswith('"') and v.endswith('"'):
        return json.dumps(v[1:-1])
    if "vector" in v or "vectorpair" in v:
        return "[1]" if v == "std::vector<int>(1, 1)" else "[]"
    try:
        val = eval(v.replace("M_PI", "math.pi"), {"math": math, "__builtins__": {}})
        if isinstance(val, float):
            return repr(val)
        return repr(int(val))
    except Exception:
        return None


# Map arg kind -> TypeScript input type and whether it is an output.
INPUT_TS = {
    "ibool": "boolean", "iint": "number", "isize": "number",
    "idouble": "number", "istring": "string", "ivoidstar": "number",
    "ivectorint": "number[]", "ivectorsize": "number[]",
    "ivectordouble": "number[]", "ivectorstring": "string[]",
    "ivectorpair": "number[]", "ivectorvectorint": "number[][]",
    "ivectorvectorsize": "number[][]", "ivectorvectordouble": "number[][]",
    "isizefun": "(dim: number, tag: number, x: number, y: number, z: number, lc: number) => number",
}
OUTPUT_KINDS = {
    "oint", "osize", "odouble", "ostring", "ovectorint", "ovectorsize",
    "ovectordouble", "ovectorstring", "ovectorpair", "ovectorvectorint",
    "ovectorvectorsize", "ovectorvectordouble", "ovectorvectorpair",
}
OUTPUT_TS = {
    "oint": "number", "osize": "number", "odouble": "number",
    "ostring": "string", "ovectorint": "number[]", "ovectorsize": "number[]",
    "ovectordouble": "number[]", "ovectorstring": "string[]",
    "ovectorpair": "number[]", "ovectorvectorint": "number[][]",
    "ovectorvectorsize": "number[][]", "ovectorvectordouble": "number[][]",
    "ovectorvectorpair": "number[][]",
}
RET_TS = {"oint": "number", "osize": "number", "odouble": "number"}


def cname(c_namespace, name):
    return c_namespace + name[0].upper() + name[1:]


def collect(api):
    """Walk the module tree, returning a flat list of function descriptors."""
    funcs = []

    def walk(module, c_namespace, path):
        if module.name in GUI_MODULES:
            return
        c_ns = module.name if not c_namespace else c_namespace + module.name[0].upper() + module.name[1:]
        # top-level module is 'gmsh'; its path prefix is empty (functions hang
        # off the root object), submodules contribute their name to the path.
        mod_path = path if module.name == "gmsh" else path + [module.name]
        for rtype, name, args, doc, special in module.fs:
            c = cname(c_ns, name)
            ret_kind = getattr(rtype, "kind", None) if rtype is not None else None
            desc_args = []
            unsupported = False
            for a in args:
                kind = getattr(a, "kind", None)
                desc_args.append({
                    "name": a.name,
                    "kind": kind,
                    "output": kind in OUTPUT_KINDS,
                    "default": js_default(getattr(a, "value", None)),
                })
            funcs.append({
                "path": mod_path,
                "js": name,
                "c": c,
                "ret": ret_kind,          # None | oint | osize | odouble
                "args": desc_args,
                "doc": " ".join(doc.split()),
                "unsupported": unsupported,
            })
        for s in module.submodules:
            walk(s, c_ns, mod_path)

    for m in api.modules:
        walk(m, "", [])
    return funcs


# ---------------------------------------------------------------------------
# TypeScript declaration emitter
# ---------------------------------------------------------------------------
def ts_signature(fn):
    params = []
    seen_optional = False
    for a in fn["args"]:
        if a["output"]:
            continue
        if a["kind"] in ("iargcargv",):
            continue
        ts = INPUT_TS.get(a["kind"], "number")
        optional = a["default"] is not None
        seen_optional = seen_optional or optional
        params.append(f"{a['name']}{'?' if optional else ''}: {ts}")
    # return type
    outputs = [a for a in fn["args"] if a["output"]]
    has_ret = fn["ret"] is not None
    if outputs:
        fields = [f"{o['name']}: {OUTPUT_TS[o['kind']]}" for o in outputs]
        if has_ret:
            fields.insert(0, f"value: {RET_TS[fn['ret']]}")
        ret = "{ " + "; ".join(fields) + " }"
    elif has_ret:
        ret = RET_TS[fn["ret"]]
    else:
        ret = "void"
    return params, ret


def build_ts_tree(funcs):
    """Nest functions under their module path -> dict tree."""
    tree = {"__funcs__": []}
    for fn in funcs:
        if fn["unsupported"]:
            continue
        node = tree
        for p in fn["path"]:
            node = node.setdefault(p, {"__funcs__": []})
        node["__funcs__"].append(fn)
    return tree


def emit_ts(tree, version):
    lines = [
        "// AUTO-GENERATED by scripts/gen_js.py from the Gmsh API definition.",
        "// Do not edit by hand.",
        f"// Gmsh API version {version}.",
        "",
        "export interface GmshFS {",
        "  writeFile(path: string, data: Uint8Array | string): void;",
        "  readFile(path: string, opts?: { encoding?: 'utf8' }): Uint8Array | string;",
        "  unlink(path: string): void;",
        "}",
        "",
    ]

    def emit_node(node, iface_name, depth):
        members = []
        for fn in node["__funcs__"]:
            params, ret = ts_signature(fn)
            doc = fn["doc"]
            members.append(f"  /** {doc} */")
            members.append(f"  {fn['js']}({', '.join(params)}): {ret};")
        sub_ifaces = []
        for key in sorted(node.keys()):
            if key == "__funcs__":
                continue
            child_iface = iface_name + key[0].upper() + key[1:]
            members.append(f"  {key}: {child_iface};")
            sub_ifaces.append((key, child_iface))
        block = [f"export interface {iface_name} {{"] + members + ["}", ""]
        out = []
        for key, child_iface in sub_ifaces:
            out += emit_node(node[key], child_iface, depth + 1)
        return out + block

    body = emit_node(tree, "Gmsh", 0)
    lines += body
    lines += [
        "export declare function initialize(",
        "  moduleOverrides?: Record<string, unknown>",
        "): Promise<Gmsh & { FS: GmshFS; finalize(): void }>;",
        "",
        "export default initialize;",
        "",
    ]
    return "\n".join(lines)


def main():
    api, GenApi = load_api()
    version = f"{api.version_major}.{api.version_minor}.{api.version_patch}"
    funcs = collect(api)

    os.makedirs(OUT_DIR, exist_ok=True)

    # 1. exported functions
    symbols = ["_" + f["c"] for f in funcs]
    symbols += ["_malloc", "_free", "_gmshFree", "_gmshMalloc"]
    symbols = sorted(set(symbols))
    with open(os.path.join(OUT_DIR, "exported_functions.json"), "w") as f:
        json.dump(symbols, f, indent=0)
        f.write("\n")

    # 2. descriptor table
    with open(os.path.join(OUT_DIR, "gmsh-api.json"), "w") as f:
        json.dump({"version": version, "functions": funcs}, f, indent=1)
        f.write("\n")

    # 3. TypeScript declarations
    tree = build_ts_tree(funcs)
    with open(os.path.join(OUT_DIR, "gmsh.d.ts"), "w") as f:
        f.write(emit_ts(tree, version))

    n_gui = "filtered: " + ", ".join(sorted(GUI_MODULES))
    n_unsup = sum(1 for f in funcs if f["unsupported"])
    print(f"gmsh-wasm bindings: {len(funcs)} functions "
          f"({len(symbols)} exported symbols), {n_unsup} unsupported (callbacks). {n_gui}")
    # sanity: no GUI symbols
    bad = [s for s in symbols if any(g in s.lower() for g in ("fltk", "graphics"))]
    if bad:
        print("WARNING: GUI symbols leaked:", bad, file=sys.stderr)


if __name__ == "__main__":
    main()
