// Assemble the publishable dist/ from the emcc core + generated descriptor +
// hand-written runtime. Produces dual ESM/CJS entry points that expose the
// ergonomic `initialize()` API, plus the .d.ts.
//
// Inputs (must already exist):
//   dist/gmsh-core.mjs, dist/gmsh-core.cjs, dist/gmsh-core.wasm  (from emcc)
//   generated/gmsh-api.json, generated/gmsh.d.ts                 (from gen_js.py)
//   src/runtime.mjs                                              (marshaller)
// Outputs:
//   dist/runtime.mjs, dist/runtime.cjs
//   dist/gmsh-descriptor.mjs, dist/gmsh-descriptor.cjs
//   dist/gmsh.mjs, dist/gmsh.cjs, dist/gmsh.d.ts

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const GEN = join(ROOT, 'generated');

// 1. runtime: emit ESM (as-is) and a mechanically-derived CJS variant.
const runtimeSrc = readFileSync(join(ROOT, 'src', 'runtime.mjs'), 'utf8');
writeFileSync(join(DIST, 'runtime.mjs'), runtimeSrc);
const runtimeCjs = runtimeSrc.replace(
  /export function buildApi/, 'function buildApi'
) + '\nmodule.exports = { buildApi };\n';
writeFileSync(join(DIST, 'runtime.cjs'), runtimeCjs);

// 2. descriptor: inline the JSON as a module (avoids JSON-import/asset issues).
const descriptor = readFileSync(join(GEN, 'gmsh-api.json'), 'utf8').trimEnd();
writeFileSync(join(DIST, 'gmsh-descriptor.mjs'), `export default ${descriptor};\n`);
writeFileSync(join(DIST, 'gmsh-descriptor.cjs'), `module.exports = ${descriptor};\n`);

// 3. typings
writeFileSync(join(DIST, 'gmsh.d.ts'), readFileSync(join(GEN, 'gmsh.d.ts'), 'utf8'));

// 4. entry points
const esm = `// AUTO-GENERATED entry (ESM). See scripts/assemble.mjs.
import createCore from './gmsh-core.mjs';
import { buildApi } from './runtime.mjs';
import descriptor from './gmsh-descriptor.mjs';

export async function initialize(moduleOverrides = {}) {
  const Module = await createCore(moduleOverrides);
  const api = buildApi(Module, descriptor);
  api.FS = Module.FS;        // MEMFS access for file I/O
  api.module = Module;       // raw Emscripten module (escape hatch)
  return api;
}

export default initialize;
`;
writeFileSync(join(DIST, 'gmsh.mjs'), esm);

const cjs = `// AUTO-GENERATED entry (CJS). See scripts/assemble.mjs.
const createCore = require('./gmsh-core.cjs');
const { buildApi } = require('./runtime.cjs');
const descriptor = require('./gmsh-descriptor.cjs');

async function initialize(moduleOverrides = {}) {
  const Module = await createCore(moduleOverrides);
  const api = buildApi(Module, descriptor);
  api.FS = Module.FS;
  api.module = Module;
  return api;
}

module.exports = initialize;
module.exports.initialize = initialize;
module.exports.default = initialize;
`;
writeFileSync(join(DIST, 'gmsh.cjs'), cjs);

console.log('assembled dist/: gmsh.mjs, gmsh.cjs, runtime.{mjs,cjs}, gmsh-descriptor.{mjs,cjs}, gmsh.d.ts');
