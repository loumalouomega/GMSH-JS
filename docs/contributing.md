# Contributing

## Repository layout

```
gmsh/                  Gmsh source (git submodule, pinned)
third_party/occt/      OpenCASCADE source (fetched, pinned via scripts/env.sh)
scripts/               build + codegen scripts
src/runtime.mjs        hand-written generic marshaller
generated/             gen_js.py output (exports, descriptor, .d.ts) — committed
dist/                  build artifacts (gitignored; produced by CI)
test/                  Node + browser tests
docs/                  this documentation site (MkDocs)
```

## Bumping the Gmsh version

```bash
cd gmsh && git fetch && git checkout <tag-or-commit> && cd ..
npm run gen          # regenerate bindings from the new API definition
npm run build        # rebuild OCCT (if needed) + gmsh
npm test
git add gmsh generated/
```

`generated/` is committed so CI can verify it stays in sync (the docs build and
the `git diff --exit-code generated/` check both depend on it).

## Regenerating bindings only

```bash
npm run gen          # -> generated/{exported_functions.json, gmsh-api.json, gmsh.d.ts}
python3 scripts/gen_docs_api.py   # -> docs/api/reference.md
```

## Tests

```bash
npm test             # Node: geo, occ, STEP round-trip, error path
npm run test:browser # headless Chromium (needs: npm i -D playwright && npx playwright install chromium)
```

## CI

- **`.github/workflows/build.yml`** — installs the pinned emsdk (cached), builds
  OCCT (cached) and gmsh, verifies `generated/` is in sync, runs Node + browser
  tests, uploads `dist/`, and publishes to npm on a `v*` tag.
- **`.github/workflows/docs.yml`** — builds this MkDocs site and deploys it to
  GitHub Pages on pushes to `master`.

## Conventions

- The generator emits **data**; never hand-edit `generated/`.
- Marshalling changes go in `src/runtime.mjs` (one place, tested).
- New documentation pages: add the markdown under `docs/` and list it in
  `mkdocs.yml`'s `nav`.
