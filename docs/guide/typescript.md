# TypeScript

The package ships a complete `gmsh.d.ts` generated from the Gmsh API
definition, so every function, parameter, and return shape is typed.

```ts
import initialize from '@loumalouomega/gmsh-wasm';

const gmsh = await initialize();
gmsh.initialize();
gmsh.model.add('m');

const tag: number = gmsh.model.geo.addPoint(0, 0, 0, 0.1);

// output-parameter functions return typed objects
const nodes: { nodeTags: number[]; coord: number[]; parametricCoord: number[] } =
  gmsh.model.mesh.getNodes();
```

## Types reflect the marshalling

| Gmsh type | TS input | TS output |
|-----------|----------|-----------|
| `int` / `size_t` | `number` | `number` |
| `double` | `number` | `number` |
| `bool` | `boolean` | — |
| `string` | `string` | `string` |
| `vector<int/size/double>` | `number[]` | `number[]` |
| `vector<string>` | `string[]` | `string[]` |
| `vector<pair<int,int>>` | `number[]` (flat) | `number[]` (flat) |
| `vector<vector<...>>` | `number[][]` | `number[][]` |

Optional parameters (those with a Gmsh default) are marked optional (`?`).

## The returned object

`initialize()` resolves to the API tree augmented with:

```ts
interface Gmsh {
  // ... all modules: model, option, logger, ... ...
  FS: GmshFS;          // Emscripten in-memory filesystem
  module: any;         // raw Emscripten Module (escape hatch)
  finalize(): void;    // gmsh::finalize
}
```

`GmshFS` exposes `writeFile`, `readFile`, and `unlink` for
[file I/O](file-io.md).

## Regenerating types

The `.d.ts`, the runtime descriptor, and the Emscripten export list are all
produced by `scripts/gen_js.py` from the vendored Gmsh API definition. After
bumping the Gmsh submodule:

```bash
npm run gen     # regenerate generated/{gmsh.d.ts, gmsh-api.json, exported_functions.json}
```

See [Architecture](../architecture.md) for how generation works.
