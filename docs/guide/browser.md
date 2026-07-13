# Browser usage

The package targets the browser as a first-class environment: the ESM build is
emitted with `-sENVIRONMENT=node,web,worker` and `EXPORT_ES6`, and the `.wasm`
is a separate asset (not inlined).

> **Requires cross-origin isolation.** This is a threaded (OpenMP/pthreads)
> build: it needs `SharedArrayBuffer`, which browsers only expose on pages
> served with the COOP/COEP headers — see
> [Threads / headers](#threads-headers) below.

## With a bundler (Vite, webpack, Rollup, esbuild)

```js
import initialize from '@loumalouomega/gmsh-wasm';

const gmsh = await initialize();
gmsh.initialize();
// ... build + mesh ...
```

Modern bundlers resolve the `.wasm` automatically because the Emscripten loader
references it relative to the module URL. If your bundler needs an explicit
asset URL, the `.wasm` is exported as a subpath:

```js
import wasmUrl from '@loumalouomega/gmsh-wasm/gmsh-core.wasm?url'; // Vite
const gmsh = await initialize({ locateFile: () => wasmUrl });
```

## Without a bundler (native ESM)

Serve `dist/` and import the entry directly. The server **must** send
`Content-Type: application/wasm` for the `.wasm` so streaming instantiation
works:

```html
<script type="module">
  import initialize from '/node_modules/@loumalouomega/gmsh-wasm/dist/gmsh.mjs';
  const gmsh = await initialize();
  gmsh.initialize();
  // ...
</script>
```

A runnable example lives in
[`examples/browser/`](https://github.com/loumalouomega/GMSH-JS/tree/master/examples/browser)
in the repository, exercised by a headless-Chromium test in CI.

## locateFile

To host the `.wasm` somewhere other than next to the JS (CDN, hashed asset
path), override `locateFile`:

```js
const gmsh = await initialize({
  locateFile: (path) =>
    path.endsWith('.wasm') ? `https://cdn.example.com/${path}` : path,
});
```

## Threads / headers

This is a **multithreaded** build (OpenMP over pthreads). It requires
`SharedArrayBuffer`, which browsers only expose on **cross-origin-isolated**
pages: the server must send both headers on the document (and its scripts):

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

Verify in the page: `crossOriginIsolated === true`. Without these headers the
module fails to instantiate (typically `SharedArrayBuffer is not defined`).

Configuration snippets:

```nginx
# nginx
add_header Cross-Origin-Opener-Policy same-origin;
add_header Cross-Origin-Embedder-Policy require-corp;
```

```js
// vite.config.js
export default {
  server: { headers: {
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'require-corp',
  } },
};
```

Consequences to be aware of:

- The package no longer runs on static hosts that can't set headers. For
  GitHub Pages and similar, the
  [`coi-serviceworker`](https://github.com/gzuidhof/coi-serviceworker)
  workaround can inject the headers client-side.
- `COEP: require-corp` restricts loading cross-origin subresources (images,
  scripts) to those served with CORS/CORP headers.
- Worker threads are spawned from the module's own URL
  (`new Worker(new URL(import.meta.url), { type: 'module' })`); Vite and
  webpack 5 handle this pattern natively.

Thread count is a Gmsh option (default 1 = serial):

```js
gmsh.option.setNumber('General.NumThreads', 0); // 0 = all cores
```

## Memory

The module is configured with:

- `ALLOW_MEMORY_GROWTH=1` — heap grows on demand
- `INITIAL_MEMORY=64MB`, `MAXIMUM_MEMORY=4GB`
- `MALLOC=emmalloc`

Large meshes can use a lot of memory (geometry, the CAD kernel, and the mesh all
live in the WASM heap). If you hit an allocation failure, the model was likely
too large for the 4 GB ceiling — split the work or coarsen the mesh. You can
reuse one loaded module across many `initialize()`/`finalize()` cycles to avoid
repeated instantiation cost.
