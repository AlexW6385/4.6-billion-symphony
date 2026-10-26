// A deterministic fingerprint of what the page builds, for refactors that must not change behaviour
// (folding patch layers, moving code between files).
//   node tests/fingerprint.cjs out.json [space,space,...]
//   node tests/fingerprint.cjs --diff a.json b.json
// Math.random is seeded and the clock is virtual, so two runs of the same build give the same file.
// Recorded: the source of every final builder in SPEC / ENT / KIND and of the main entry points, and for every
// space, after it is entered and has had time to finish its idle work, a line per object in its scene
// (type, name, geometry size, rounded transform, material and shader text hashes).
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const h = s => crypto.createHash('sha1').update(String(s)).digest('hex').slice(0, 10);

if (process.argv[2] === '--diff') {
  const A = JSON.parse(fs.readFileSync(process.argv[3], 'utf8')), B = JSON.parse(fs.readFileSync(process.argv[4], 'utf8'));
  let bad = 0;
  for (const sec of ['fns', 'tables', 'models']) for (const k of new Set([...Object.keys(A[sec]), ...Object.keys(B[sec])]))
    if (A[sec][k] !== B[sec][k]) { bad++; if (bad < 60) console.log('DIFF', sec, k, A[sec][k], B[sec][k]); }
  for (const sp of new Set([...Object.keys(A.spaces), ...Object.keys(B.spaces)])) {
    const a = A.spaces[sp], b = B.spaces[sp];
    if (!a || !b) { bad++; console.log('DIFF space missing', sp); continue; }
    if (a.hash === b.hash) { console.log('same', sp, a.n, 'objects'); continue; }
    bad++; console.log('DIFF space', sp, a.n, '->', b.n);
    // first differing lines
    let shown = 0; const n = Math.max(a.lines.length, b.lines.length);
    for (let i = 0; i < n && shown < 12; i++) if (a.lines[i] !== b.lines[i]) { console.log('   -', a.lines[i]); console.log('   +', b.lines[i]); shown++; }
  }
  console.log(bad ? `FAIL ${bad} differences` : 'PASS identical');
  process.exit(bad ? 1 : 0);
}

const { chromium } = require('playwright');
const DIST = (process.env.DIST || path.join(__dirname, '..', 'dist')) + '/';
const OUT = process.argv[2] || 'fingerprint.json';
const ONLY = process.argv[3] ? process.argv[3].split(',') : null;
(async () => {
  const b = await chromium.launch({ ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}), args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1100, height: 700 } });
  await p.addInitScript(() => { try { localStorage.setItem('rq_era', '3'); localStorage.setItem('rq_seen', '["x"]'); localStorage.setItem('rq_snd', 'false') } catch (e) { }
    let s = 12345; Math.random = () => { s = (s * 16807) % 2147483647; return s / 2147483647 };
    // idle work gets a fixed budget, so how much of it is done never depends on how busy the machine is
    window.requestIdleCallback = f => setTimeout(() => f({ didTimeout: false, timeRemaining: () => 8 }), 30); window.cancelIdleCallback = id => clearTimeout(id); });
  await p.addInitScript({ path: path.join(__dirname, 'vclock.js') });
  await p.addInitScript(() => { window.__sig = (root) => { const out = [];
      const r = x => Math.round(x * 100) / 100;
      const sh = s => { let a = 0; s = String(s); for (let i = 0; i < s.length; i++)a = (a * 31 + s.charCodeAt(i)) | 0; return (a >>> 0).toString(36) };
      const mat = m => { if (!m) return '-'; if (Array.isArray(m)) return m.map(mat).join('/'); return [m.type, m.color ? m.color.getHexString() : '', m.emissive ? m.emissive.getHexString() : '', r(m.opacity), m.transparent ? 't' : '', m.side, m.blending, m.vertexShader ? sh(m.vertexShader + m.fragmentShader) : '', m.onBeforeCompile && m.onBeforeCompile.toString() !== 'function(){}' ? sh(m.onBeforeCompile.toString()) : '', m.map ? 'map' + (m.map.image ? m.map.image.width : '') : ''].join(',') };
      const walk = (o, d) => { const g = o.geometry; const ga = g && g.attributes && g.attributes.position;
        out.push([d, o.type, o.name || '', ga ? ga.count : '', g && g.index ? g.index.count : '', o.isInstancedMesh ? o.count : '', o.position.toArray().map(r).join(' '), o.scale.toArray().map(r).join(' '), r(o.rotation.x) + ' ' + r(o.rotation.y) + ' ' + r(o.rotation.z), o.visible ? '' : 'h', mat(o.material)].join('|'));
        for (const c of o.children) walk(c, d + 1) };
      walk(root, 0); return out } });
  await p.addInitScript(() => { window.__noRender = true; window.__noAdapt = true; const iv = setInterval(() => { const q = window.__rq; if (q && q.ren && !q.ren.__p) { const r = q.ren; r.render = function (sc, cam) { if (sc.autoUpdate !== false) sc.updateMatrixWorld(); if (cam.parent === null) cam.updateMatrixWorld() }; r.__p = 1; clearInterval(iv) } }, 5) });
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
  const res = { fns: {}, tables: {}, models: {}, spaces: {} };
  if (!(await p.evaluate(() => !!window.__rq))) { console.log(errs.join("\n")); process.exit(1) }
  const t = await p.evaluate(() => { const T = window.__rq.dbg.tables(); const o = {}; for (const k of Object.keys(T)) for (const n of Object.keys(T[k])) { const v = T[k][n]; o[k + '.' + n] = typeof v === 'function' ? v.toString() : Array.isArray(v) ? String(v[0]) + JSON.stringify(v.slice(1)) : JSON.stringify(v) } return o });
  for (const k of Object.keys(t)) res.tables[k] = h(t[k]);
  if (!ONLY) {
    const m = await p.evaluate(() => { const q = window.__rq, T = q.dbg.tables(), o = {}; const H = a => { let x = 0; const s = a.join('\n'); for (let i = 0; i < s.length; i++)x = (x * 31 + s.charCodeAt(i)) | 0; return a.length + ':' + (x >>> 0).toString(36) };
      (window.FAUNA || []).forEach((f, i) => { let g = null; try { g = q.bc(f) } catch (e) { o['fauna.' + i + '.' + f.w] = 'ERR ' + e.message; return } o['fauna.' + i + '.' + f.w] = g ? H(window.__sig(g)) : 'null' });
      for (const k of Object.keys(T.ENT)) { let g = null; try { g = T.ENT[k][0]() } catch (e) { o['ent.' + k] = 'ERR ' + e.message; continue } o['ent.' + k] = g ? H(window.__sig(g)) : 'null' }
      return o });
    res.models = m; }
  const ids = ONLY || ['rongqiu', 'void', 'ximin', 'erxi', 'dream', 'under', 'midgard', 'tunnel', 'buke'];
  for (const id of ids) {
    if (id !== 'rongqiu' || ONLY) { await p.evaluate(s => window.__rq.enterSpace(s), id); }
    await step(400);
    const lines = await p.evaluate(() => window.__sig(window.__rq.CUR.scene));
    res.spaces[id] = { n: lines.length, hash: h(lines.join('\n')), lines };
    console.log(id, lines.length);
  }
  if (errs.length) console.log(errs.slice(0, 10).join('\n'));
  fs.writeFileSync(OUT, JSON.stringify(res));
  await b.close();
})();
