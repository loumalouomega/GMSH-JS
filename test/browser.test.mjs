// Browser-target verification: serve dist/ + the example page and drive it in a
// headless Chromium via Playwright. Confirms the ESM build actually loads,
// fetches gmsh-core.wasm, and meshes in a real browser (not just Node).
//
// Skips automatically when Playwright isn't installed (`npm i -D playwright`
// + `npx playwright install chromium`). Run via `npm run test:browser`.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname, normalize } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const MIME = {
  '.html': 'text/html', '.mjs': 'text/javascript', '.js': 'text/javascript',
  '.cjs': 'text/javascript', '.wasm': 'application/wasm', '.json': 'application/json',
};

function startServer() {
  const server = createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      const filePath = normalize(join(ROOT, urlPath));
      if (!filePath.startsWith(ROOT)) { res.writeHead(403).end(); return; }
      const body = await readFile(filePath);
      res.writeHead(200, { 'content-type': MIME[extname(filePath)] || 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404).end('not found');
    }
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

async function loadPlaywright() {
  try { return (await import('playwright')).chromium; }
  catch { return null; }
}

test('browser: ESM build meshes a square in headless Chromium', async (t) => {
  const chromium = await loadPlaywright();
  if (!chromium) { t.skip('playwright not installed (run: npm i -D playwright && npx playwright install chromium)'); return; }

  const { server, port } = await startServer();
  let browser;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(`http://127.0.0.1:${port}/examples/browser/index.html`);

    const el = await page.waitForSelector('#result[data-status]', { timeout: 30000 });
    const status = await el.getAttribute('data-status');
    const text = await el.textContent();
    assert.equal(status, 'ok', `example failed in browser: ${text} ${errors.join('; ')}`);

    const nodes = Number(await el.getAttribute('data-nodes'));
    assert.ok(nodes > 0, 'meshed nodes in browser');
    console.log(`  ✓ browser: ${text}`);
  } finally {
    if (browser) await browser.close();
    server.close();
  }
});
