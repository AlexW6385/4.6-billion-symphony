// What a world switch costs: for each space in turn, the longest frames around entering it, the build and compile
// spans the profiler saw, and how many shader programs the switch made. Real clock, real rendering (slow in software).
//   node tests/switch.cjs [space,space,...]
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const DIST = (process.env.DIST || path.join(__dirname, '..', 'dist')) + '/';
const IDS = (process.argv[2] || 'void,ximin,erxi,dream,under,midgard,tunnel,buke,rongqiu,void').split(',');
(async () => {
  const b = await chromium.launch({ ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}), args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: +(process.env.VW || 800), height: +(process.env.VH || 500) } });
  await p.addInitScript(() => { try { localStorage.setItem('rq_era', '3'); localStorage.setItem('rq_seen', '["x"]'); localStorage.setItem('rq_snd', 'false') } catch (e) { } window.__noAdapt = true;
    // every frame's wall time, from rAF to rAF
    const raf = window.requestAnimationFrame.bind(window); let last = 0; window.__ft = [];
    window.requestAnimationFrame = cb => raf(t => { if (last) window.__ft.push([t, t - last]); last = t; cb(t) }); });
  const errs = []; p.on('pageerror', e => errs.push('PAGEERR ' + e.message));
  await p.route('**/*', r => { const u = r.request().url();
    if (u.includes('three.min.js')) return r.fulfill({ path: path.join(__dirname, '..', 'node_modules', 'three', 'build', 'three.min.js') });
    const m = u.match(/three@0\.128\.0\/(examples\/js\/.*)$/); if (m) return r.fulfill({ path: path.join(__dirname, '..', 'node_modules', 'three', m[1]) });
    for (const f of ['links.js', 'wiki.js', 'wiki3.js', 'wiki4.js', 'chapters.js']) if (u.endsWith('/' + f)) return r.fulfill({ path: DIST + f, contentType: 'application/javascript' });
    if (u.endsWith('/index.html')) return r.fulfill({ body: '<!doctype html><html><head><meta charset=utf8></head><body>' + fs.readFileSync(DIST + 'index.html', 'utf8') + '</body></html>', contentType: 'text/html' });
    if (u.includes('fonts.g')) return r.fulfill({ body: '' }); return r.continue() });
  await p.goto('http://x.test/index.html');
  await p.waitForFunction(() => window.__rq && window.__rq.CUR && !window.__rq.dbg.busy(), null, { timeout: 300000 });
  await p.waitForTimeout(3000);
  for (const id of IDS) {
    const r = await p.evaluate(async id => {
      const q = window.__rq, R = q.ren, P = window.__q5prof; const p0 = R.info.programs.length; window.__ft.length = 0; P.long.length = 0; P.mid.length = 0;
      const t0 = performance.now(); q.enterSpace(id);
      while (q.dbg.busy() || q.CUR.id !== id) await new Promise(r => setTimeout(r, 50));
      const tIn = performance.now() - t0; await new Promise(r => setTimeout(r, 2500));
      const ft = window.__ft.map(x => x[1]); ft.sort((a, b) => b - a);
      return { id, inMs: Math.round(tIn), progs: R.info.programs.length - p0, worst: ft.slice(0, 4).map(x => Math.round(x)), over50: ft.filter(x => x > 50).length, long: P.long.concat(P.mid).sort((a, b) => b.ms - a.ms).slice(0, 3).map(x => Math.round(x.ms) + 'ms[' + x.sp + ']') };
    }, id);
    console.log(JSON.stringify(r));
  }
  if (errs.length) console.log(errs.slice(0, 10).join('\n'));
  await b.close();
})();
