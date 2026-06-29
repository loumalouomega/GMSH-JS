# Marshalling

How JavaScript values cross the WASM boundary to the Gmsh C API and back. This
is handled entirely by `src/runtime.mjs`, driven by the generated descriptor —
you do not write any of this, but understanding it explains the API shapes.

## Inputs

| Gmsh argument | You pass | Sent to C as |
|---------------|----------|--------------|
| `bool` | `boolean` | `int` (0/1) |
| `int`, `size_t` | `number` | `int` / `size_t` |
| `double` | `number` | `double` |
| `string` | `string` | `const char*` (UTF-8, heap-allocated) |
| `vector<int>` | `number[]` | `const int*, size_t n` |
| `vector<double>` | `number[]` | `const double*, size_t n` |
| `vector<string>` | `string[]` | `const char* const*, size_t n` |
| `vector<pair>` | `number[]` flat | `const int*, size_t n` (n = flattened length) |
| `vector<vector<int>>` | `number[][]` | `const int* const*, const size_t*, size_t nn` |

All temporary heap allocations for inputs are freed after the call.

## Outputs

Output parameters are allocated by the wrapper, filled by Gmsh (which mallocs
the arrays), copied into JS values, and then released with `gmshFree`.

| Gmsh output | You receive |
|-------------|-------------|
| `int*` / `size_t*` / `double*` | `number` |
| `char**` | `string` |
| `int**`+`size_t*` (vector) | `number[]` |
| `char***`+`size_t*` (vector of strings) | `string[]` |
| `int***`+`size_t**`+`size_t*` (vector of vectors) | `number[][]` |

## Return shape rules

For a function `f`:

1. **No outputs, no scalar return** → returns `undefined`.
2. **Scalar return only** (e.g. `addPoint` → a tag) → returns that `number`.
3. **One or more output parameters** → returns an **object** keyed by each
   output's name. If the function also has a scalar return, it is included as
   `value`.

```js
// rule 2
const tag = gmsh.model.geo.addPoint(0, 0, 0);          // number

// rule 3
const { nodeTags, coord } = gmsh.model.mesh.getNodes(); // object
```

## Memory & numeric notes

- The boundary is **wasm32**: pointers and `size_t` are 4 bytes; `double` is 8.
- `size_t` outputs are read unsigned (`HEAPU32`), so large tags/counts up to
  2³² are represented correctly.
- Heap views are re-fetched on every access, so memory growth during a call
  cannot leave a stale typed-array view.
- Errors are surfaced by reading `gmshLoggerGetLastError` and throwing.
