#!/usr/bin/env python3
"""Generate the markdown API reference (docs/api/reference.md) from the same
descriptor that drives the runtime, so the docs cannot drift from the build.

Each function is rendered with its ergonomic JS call form, the underlying Gmsh
C symbol, a typed parameter table, the return shape, and the upstream doc text.
Grouped by module (gmsh, gmsh.model, gmsh.model.geo, ...). GUI modules are
already filtered out of the descriptor by gen_js.py.
"""

import os
import sys
import json

ROOT = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "scripts"))
from gen_js import ts_signature, INPUT_TS  # reuse the .d.ts type mapping

GEN = os.path.join(ROOT, "generated", "gmsh-api.json")
OUT = os.path.join(ROOT, "docs", "api", "reference.md")


def dotted(path):
    return ".".join(["gmsh"] + path)


def input_params(fn):
    """[(name, ts_type, default_or_None)] for the caller-visible inputs."""
    rows = []
    for a in fn["args"]:
        if a["output"] or a["kind"] == "iargcargv":
            continue
        rows.append((a["name"], INPUT_TS.get(a["kind"], "number"), a["default"]))
    return rows


def main():
    data = json.load(open(GEN))
    funcs = [f for f in data["functions"] if not f["unsupported"]]

    # group by module path (tuple)
    groups = {}
    for f in funcs:
        groups.setdefault(tuple(f["path"]), []).append(f)

    lines = [
        "# API reference",
        "",
        "!!! note",
        "    This page is generated from the Gmsh API definition "
        f"(version **{data['version']}**) by `scripts/gen_docs_api.py` and is "
        "regenerated in CI. Every function hides the C `ierr` out-parameter and "
        "all manual memory management; see [Marshalling](marshalling.md) for how "
        "arguments and return values are converted.",
        "",
        f"**{len(funcs)} functions** across "
        f"{len(groups)} modules. GUI/visualization functions "
        "(`fltk`, `graphics`, `view`) are intentionally excluded.",
        "",
        "Conventions:",
        "",
        "- Optional parameters (those with a default) are marked `?` and may be omitted.",
        "- Functions with output parameters return an **object** keyed by the output names;",
        "  a function with a single scalar return (e.g. an entity tag) returns that value directly.",
        "",
    ]

    def module_title(path):
        return dotted(list(path)) if path else "gmsh (top level)"

    for path in sorted(groups, key=lambda p: (len(p), p)):
        fns = sorted(groups[path], key=lambda f: f["js"])
        lines.append(f"## `{module_title(path)}`")
        lines.append("")
        for fn in fns:
            params, ret = ts_signature(fn)
            call = f"{dotted(fn['path'])}.{fn['js']}({', '.join(params)})"
            lines.append(f"### `{fn['js']}`")
            lines.append("")
            lines.append("```ts")
            lines.append(f"{call}: {ret}")
            lines.append("```")
            lines.append("")
            if fn["doc"]:
                lines.append(fn["doc"])
                lines.append("")
            rows = input_params(fn)
            if rows:
                lines.append("| Parameter | Type | Default |")
                lines.append("|-----------|------|---------|")
                for name, ts, dflt in rows:
                    d = "*required*" if dflt is None else f"`{dflt}`"
                    lines.append(f"| `{name}` | `{ts}` | {d} |")
                lines.append("")
            lines.append(f"<small>Gmsh C symbol: `{fn['c']}`</small>")
            lines.append("")

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w") as f:
        f.write("\n".join(lines))
    print(f"wrote {OUT}: {len(funcs)} functions, {len(groups)} modules")


if __name__ == "__main__":
    main()
