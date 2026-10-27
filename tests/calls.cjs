// Draw calls and triangles per frame (every pass: shadow map, scene, post), per space and view, plus the share of the
// scene's meshes that are drawn. Rendering is real (SwiftShader) but only a few frames are drawn per view, so it is quick.
//   node tests/calls.cjs [space,space…]
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const DIST = (process.env.DIST || path.join(__dirname, '..', 'dist')) + '/';
const SP = (process.argv[2] || 'rongqiu,void,ximin,erxi,dream,under,midgard,tunnel,buke').split(',');
(async () => {
  const b = await chromium.launch({ ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}), args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 320, height: 200 } });
  await p.addInitScript(BRK => { try { localStorage.setItem('rq_era', '3'); localStorage.setItem('rq_seen', '["x"]'); localStorage.setItem('rq_snd', 'false') } catch (e) { } window.__rp = performance.now.bind(performance); window.__noAdapt = true; window.__noRender = true; window.__brk = BRK; window.__brk2 = BRK === 2;
    const iv = setInterval(() => { const q = window.__rq; if (q && q.ren && !q.ren.__p) { const r = q.ren, o = r.render.bind(r); r.render = function (sc, cam) { if (window.__noRender) { if (sc.autoUpdate !== false) sc.updateMatrixWorld(); if (cam.parent === null) cam.updateMatrixWorld(); return } return o(sc, cam) }; r.__p = 1; clearInterval(iv) } }, 5) }, +(process.env.BREAK || 0));
  await p.addInitScript({ path: path.join(__dirname, 'vclock.js') });
  const errs = []; p.on('pageerror', e => errs.push('PAGEERR ' + e.message));
  await p.route('**/*', r => { const u = r.request().url();
    if (u.includes('three.min.js')) return r.fulfill({ path: path.join(__dirname, '..', 'node_modules', 'three', 'build', 'three.min.js') });
    const m = u.match(/three@0\.128\.0\/(examples\/js\/.*)$/); if (m) return r.fulfill({ path: path.join(__dirname, '..', 'node_modules', 'three', m[1]) });
    for (const f of ['links.js', 'wiki.js', 'wiki3.js', 'wiki4.js', 'chapters.js']) if (u.endsWith('/' + f)) return r.fulfill({ path: DIST + f, contentType: 'application/javascript' });
    if (u.includes('/index.html')) return r.fulfill({ body: '<!doctype html><html><head><meta charset=utf8></head><body>' + fs.readFileSync(DIST + 'index.html', 'utf8') + '</body></html>', contentType: 'text/html' });
    if (u.includes('fonts.g')) return r.fulfill({ body: '' }); return r.continue() });
  await p.goto('http://x.test/index.html');
  for (let i = 0; i < 120; i++) { await p.evaluate(() => window.__step(50)); if (await p.evaluate(() => !!(window.__rq && window.__rq.CUR))) break }
  const BREAK = !!process.env.BREAK;
  const measure = async label => {
    for (let i = 0; i < 40; i++) await p.evaluate(() => window.__step(50));
    const r = await p.evaluate(() => { const q = window.__rq, ren = q.ren; window.__noRender = false; ren.info.autoReset = false;
      window.__step(16.7); const fr = []; for (let k = 0; k < 4; k++) { ren.info.reset(); window.__step(16.7); fr.push(ren.info.render.calls + '/' + Math.round(ren.info.render.triangles / 1000) + 'k') } ren.info.reset(); window.__step(16.7); window.__step(16.7); const i = ren.info.render;
      const out = { calls: i.calls / 2, tris: Math.round(i.triangles / 2), progs: ren.info.programs.length, fr };
      let meshes = 0, vis = 0; q.CUR.scene.traverse(o => { if (o.isMesh || o.isPoints || o.isSprite || o.isLine) { meshes++; let v = o.visible, p = o.parent; while (v && p) { v = p.visible; p = p.parent } if (v) vis++ } });
      out.objects = meshes; out.visible = vis; ren.info.autoReset = true;
      if (window.__brk) { const B = {}; const o0 = ren.renderBufferDirect; ren.renderBufferDirect = function (cam, sc, geo, mat, obj, grp) { const pass = mat.isMeshDepthMaterial || mat.isMeshDistanceMaterial || cam.isOrthographicCamera && !cam.userData.post ? 'shadow' : (sc && sc.isScene && sc.children.length < 3 ? 'post' : 'main');
          const ix = geo.index ? geo.index.count : geo.attributes.position ? geo.attributes.position.count : 0; const n = (obj.isInstancedMesh ? obj.count : 1) * (grp ? grp.count : ix) / 3;
          let nm = obj.name || ''; let q = obj; while (!nm && q.parent) { q = q.parent; nm = q.name || (q.userData && q.userData.wid) || '' } nm = pass + ':' + (nm || obj.type) + ':' + (mat.type || '') + (window.__brk2 ? ':' + geo.uuid.slice(0, 4) + ':' + ix + (obj.isInstancedMesh ? 'x' + obj.count : '') + (obj.castShadow ? ':cs' : '') + ':' + (obj.parent && obj.parent.name || obj.parent && obj.parent.type) : '');
          const e = B[nm] || (B[nm] = { c: 0, t: 0 }); e.c++; e.t += n; return o0.apply(this, arguments) };
        const ev = q.dbg.SHD.every; q.dbg.SHD.every = 1; window.__step(16.7); q.dbg.SHD.every = ev; ren.renderBufferDirect = o0; out.top = Object.entries(B).sort((a, b) => b[1].t - a[1].t).slice(0, 14).map(([k, v]) => k + ' ' + v.c + ' calls ' + Math.round(v.t / 1000) + 'k').concat(['-- by calls']).concat(Object.entries(B).sort((a, b) => b[1].c - a[1].c).slice(0, 10).map(([k, v]) => k + ' ' + v.c + ' calls ' + Math.round(v.t / 1000) + 'k'));
        const per = {}; for (const [k, v] of Object.entries(B)) { const ps = k.split(':')[0]; per[ps] = per[ps] || { c: 0, t: 0 }; per[ps].c += v.c; per[ps].t += v.t } out.per = per }
      window.__noRender = true; return out });
    if (r.per) { console.log(JSON.stringify(r.per)); console.log(r.top.map(x => '   ' + x).join('\n')) }
    console.log(label.padEnd(26), 'calls', String(r.calls).padStart(5), ' tris', String(r.tris).padStart(8), ' objects', r.visible + '/' + r.objects, ' frames', (r.fr || []).join(' '));
  };
  for (const s of SP) {
    await p.evaluate(s => window.__rq.enterSpace(s), s);
    for (let i = 0; i < 80; i++) { await p.evaluate(() => window.__step(50)); if (await p.evaluate(s => window.__rq.CUR && window.__rq.CUR.id === s && document.querySelector('#load.done'), s)) break }
    await measure(s + ' (arrival)');
    if (s === 'rongqiu') { await p.evaluate(() => Object.assign(window.__rq.rig, { a: 3, b: 2, alt: 40, head: .6 })); await measure('rongqiu meadow'); await p.evaluate(() => { window.__rq.setEra(6); Object.assign(window.__rq.rig, { a: -14, b: 63, alt: 70, head: .3 }) }); await measure('rongqiu town'); }
  }
  if (errs.length) console.log(errs.slice(0, 5).join('\n'));
  await b.close();
})();
