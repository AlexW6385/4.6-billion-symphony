// Screenshots at fixed viewpoints, on a virtual clock with a seeded Math.random, so two builds can be compared.
//   node tests/shots.cjs outdir            one PNG per viewpoint (tests/viewpoints.json)
//   VP='[…]' node tests/shots.cjs outdir  only the viewpoints given
//   node tests/shots.cjs --diff dirA dirB  per-viewpoint share of pixels that differ (needs pngjs: npm i --no-save pngjs)
const fs = require('fs'), path = require('path');

if (process.argv[2] === '--diff') {
  const { PNG } = require('pngjs');
  const A = process.argv[3], B = process.argv[4]; let worst = 0;
  for (const f of fs.readdirSync(A).filter(f => f.endsWith('.png'))) {
    if (!fs.existsSync(path.join(B, f))) { console.log('missing', f); continue; }
    const a = PNG.sync.read(fs.readFileSync(path.join(A, f))), b = PNG.sync.read(fs.readFileSync(path.join(B, f)));
    if (a.width !== b.width || a.height !== b.height) { console.log('size differs', f); worst = 1; continue; }
    let n = 0; for (let i = 0; i < a.data.length; i += 4) { const d = Math.abs(a.data[i] - b.data[i]) + Math.abs(a.data[i + 1] - b.data[i + 1]) + Math.abs(a.data[i + 2] - b.data[i + 2]); if (d > 24) n++; }
    const r = n / (a.width * a.height); worst = Math.max(worst, r);
    console.log((r > .01 ? 'DIFF ' : 'same ') + f.padEnd(28) + (r * 100).toFixed(2) + '%');
  }
  process.exit(worst > .01 ? 1 : 0);
}

const { chromium } = require('playwright');
const DIST = (process.env.DIST || path.join(__dirname, '..', 'dist')) + '/';
const OUT = process.argv[2] || 'shots'; fs.mkdirSync(OUT, { recursive: true });
// VP='[{"name":"x","space":"void","go":"id"}]' takes the viewpoints from the environment instead (a quick look at new entries)
const VIEWS = process.env.VP ? JSON.parse(process.env.VP) : JSON.parse(fs.readFileSync(path.join(__dirname, 'viewpoints.json'), 'utf8'));
(async () => {
  const b = await chromium.launch({ ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}), args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 960, height: 600 }, deviceScaleFactor: 1 });
  await p.addInitScript(() => { try { localStorage.setItem('rq_era', '3'); localStorage.setItem('rq_seen', '["x"]'); localStorage.setItem('rq_snd', 'false') } catch (e) { }
    let s = 12345; Math.random = () => { s = (s * 16807) % 2147483647; return s / 2147483647 }; window.__noAdapt = true;
    window.requestIdleCallback = f => setTimeout(() => f({ didTimeout: false, timeRemaining: () => 8 }), 30); window.cancelIdleCallback = id => clearTimeout(id); });
  await p.addInitScript({ path: path.join(__dirname, 'vclock.js') });
  // only the frames right before a screenshot are drawn (software rendering is slow); the others just advance the world
  await p.addInitScript(() => { window.__noRender = true; const iv = setInterval(() => { const q = window.__rq; if (q && q.ren && !q.ren.__p) { const r = q.ren, o = r.render.bind(r); r.render = function (sc, cam) { if (window.__noRender) { if (sc.autoUpdate !== false) sc.updateMatrixWorld(); if (cam.parent === null) cam.updateMatrixWorld(); return } return o(sc, cam) }; r.__p = 1; clearInterval(iv) } }, 5) });
  const errs = []; p.on('pageerror', e => errs.push('PAGEERR ' + e.message));
  await p.route('**/*', r => { const u = r.request().url();
    if (u.includes('three.min.js')) return r.fulfill({ path: path.join(__dirname, '..', 'node_modules', 'three', 'build', 'three.min.js') });
    const m = u.match(/three@0\.128\.0\/(examples\/js\/.*)$/); if (m) return r.fulfill({ path: path.join(__dirname, '..', 'node_modules', 'three', m[1]) });
    for (const f of ['links.js', 'wiki.js', 'wiki3.js', 'wiki4.js', 'chapters.js']) if (u.endsWith('/' + f)) return r.fulfill({ path: DIST + f, contentType: 'application/javascript' });
    if (u.endsWith('/index.html')) return r.fulfill({ body: '<!doctype html><html><head><meta charset=utf8></head><body>' + fs.readFileSync(DIST + 'index.html', 'utf8') + '</body></html>', contentType: 'text/html' });
    if (u.includes('fonts.g')) return r.fulfill({ body: '' }); return r.continue() });
  const step = n => p.evaluate(k => { for (let j = 0; j < k; j++) window.__step(50) }, n);
  await p.goto('http://x.test/index.html');
  for (let i = 0; i < 80; i++) { await step(2); if (await p.evaluate(() => !!(window.__rq && window.__rq.CUR))) break }
  await step(60);
  for (const v of VIEWS) {
    await p.evaluate(v => { const q = window.__rq; if (q.CUR.id !== v.space) q.enterSpace(v.space) }, v); await step(160);
    if (v.go) { await p.evaluate(id => window.__rq.go(id), v.go); await step(200); }
    if (v.close) { await p.evaluate(() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))); await step(40); }
    await p.evaluate(() => { window.__noRender = false }); await step(3); await p.evaluate(() => { window.__noRender = true });
    await p.screenshot({ path: path.join(OUT, v.name + '.png') }); console.log('shot', v.name);
  }
  if (errs.length) console.log(errs.slice(0, 10).join('\n'));
  await b.close();
})();
