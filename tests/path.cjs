// The interaction path of DESIGN §11 Phase 0, walked on a virtual clock: for every step, the script time of the action
// itself and the longest frame in the second after it (no drawing; JS cost only, like perf5). Also checks that a shared
// link (#e=id) opens on its entry.
//   node tests/path.cjs [mob]
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const DIST = (process.env.DIST || path.join(__dirname, '..', 'dist')) + '/';
const MOB = process.argv[2] === 'mob';
(async () => {
  const b = await chromium.launch({ ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}), args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage(MOB ? { viewport: { width: 390, height: 780 }, hasTouch: true, isMobile: true } : { viewport: { width: 1100, height: 700 } });
  await p.addInitScript(() => { try { localStorage.setItem('rq_era', '3'); localStorage.setItem('rq_seen', '["x"]'); localStorage.setItem('rq_snd', 'false') } catch (e) { } window.__rp = performance.now.bind(performance); window.__noAdapt = true; });
  await p.addInitScript({ path: path.join(__dirname, 'vclock.js') });
  await p.addInitScript(() => { window.__noRender = true; const iv = setInterval(() => { const q = window.__rq; if (q && q.ren && !q.ren.__p) { const r = q.ren; r.render = function (sc, cam) { if (sc.autoUpdate !== false) sc.updateMatrixWorld(); if (cam.parent === null) cam.updateMatrixWorld() }; r.__p = 1; clearInterval(iv) } }, 5) });
  const errs = []; p.on('pageerror', e => errs.push('PAGEERR ' + e.message));
  await p.route('**/*', r => { const u = r.request().url();
    if (u.includes('three.min.js')) return r.fulfill({ path: path.join(__dirname, '..', 'node_modules', 'three', 'build', 'three.min.js') });
    const m = u.match(/three@0\.128\.0\/(examples\/js\/.*)$/); if (m) return r.fulfill({ path: path.join(__dirname, '..', 'node_modules', 'three', m[1]) });
    for (const f of ['links.js', 'wiki.js', 'wiki3.js', 'wiki4.js', 'chapters.js']) if (u.endsWith('/' + f)) return r.fulfill({ path: DIST + f, contentType: 'application/javascript' });
    if (u.includes('/index.html')) return r.fulfill({ body: '<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(DIST + 'index.html', 'utf8') + '</body></html>', contentType: 'text/html' });
    if (u.includes('fonts.g')) return r.fulfill({ body: '' }); return r.continue() });
  const frames = n => p.evaluate(n => { const o = []; for (let i = 0; i < n; i++) { const a = window.__rp(); window.__step(16.7); o.push(window.__rp() - a) } return Math.max(...o) }, n);
  let bad = 0;
  // a step over LIM ms (script time on this machine; a test VM is several times slower than a desktop) is reported as slow.
  // a first visit to a world builds it under the loading cover: reported, not counted
  const LIM = +(process.env.SLOW || 50);
  const step = async (name, fn, n, cover) => { const t = await p.evaluate(fn); const f = await frames(n || 60); const worst = Math.max(t || 0, f);
    const slow = worst > LIM && !cover;
    console.log((slow ? 'SLOW ' : cover ? 'load ' : 'ok   ') + name.padEnd(30) + ' action ' + (t || 0).toFixed(0).padStart(4) + ' ms, worst frame ' + f.toFixed(0).padStart(4) + ' ms'); if (slow) bad++ };
  const act = js => new Function('const a=window.__rp();' + js + ';return window.__rp()-a');
  await p.goto('http://x.test/index.html#e=naodai');
  for (let i = 0; i < 120; i++) { await p.evaluate(() => { for (let j = 0; j < 4; j++)window.__step(50) }); if (await p.evaluate(() => !!(window.__rq && window.__rq.CUR && document.querySelector('#cap.on')))) break }
  const linked = await p.evaluate(() => document.querySelector('#cap.on h2') && document.querySelector('#cap.on h2').textContent);
  console.log((linked ? 'ok   ' : 'FAIL ') + 'shared link opens its entry: ' + linked); if (!linked) bad++;
  await frames(120);
  await step('card: related entry', act("document.querySelector('#cap [data-rel]').click()"), 150);
  await step('card: share', act("document.querySelector('#cap [data-share]').click()"));
  await step('card: chapter chip -> reader', act("document.querySelector('#cap [data-ch]').click()"));
  await step('reader: back to card', act("const b=document.querySelector('#rd [data-back]');if(b)b.click()"));
  await step('close card', act("document.querySelector('#cap .x').click()"));
  await step('library opens', act("document.querySelector('#book').click()"));
  await step('library: chapters tab', act("document.querySelector('#lib nav [data-t=\"ch\"]').click()"));
  await step('library: open an age', act("document.querySelector('#libbody [data-ce=\"2\"]').click()"));
  await step('library: chapter -> reader', act("document.querySelector('#libbody [data-rch]').click()"));
  await step('reader closes', act("document.querySelector('#rd .x').click()"));
  await step('library: an entry row', act("document.querySelector('#book').click();document.querySelector('#lib nav [data-t]').click();const r=document.querySelector('#libbody [data-id]');if(r)r.click()"), 150);
  await step('enter the void (first visit)', act("window.__rq.enterSpace('void')"), 400, true);
  await step('void: go to an entry', act("window.__rq.go('v_lianjie')"), 200);
  await step('void: card related', act("const r=document.querySelector('#cap [data-rel]');if(r)r.click()"), 200);
  await step('back to 绒球', act("window.__rq.enterSpace('rongqiu')"), 400);
  await step('绒球: go to an entry', act("window.__rq.go('hometree')"), 200);
  if (errs.length) { console.log(errs.slice(0, 10).join('\n')); bad++ }
  console.log(bad ? `FAIL ${bad} slow or broken steps` : 'PASS'); await b.close(); process.exit(bad ? 1 : 0);
})();
