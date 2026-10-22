// Test runner.
//   npm test            build dist/ (minified), then UI tests (desktop + mobile) and the smoke run through every space
//   npm run test:quick  UI tests on desktop only
// Needs Playwright's Chromium (npx playwright install chromium) or CHROMIUM_PATH pointing at one.
// The reader's "load txt" test uses tests/fixtures/novel_sample.txt (generated, placeholder text only)
// unless NOVEL_TXT points at your own copy of the novel.
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const T = p => path.join(ROOT, 'tests', p);
const quick = process.argv.includes('--quick');
const run = (args, env = {}) => spawnSync(process.execPath, args, { cwd: ROOT, env: { ...process.env, ...env }, encoding: 'utf8', maxBuffer: 64 << 20 });

let bad = 0;
const check = (name, r, needPass) => {
  const out = (r.stdout || '') + (r.stderr || '');
  const lines = out.split('\n');
  const pass = lines.filter(l => /^(PASS|js>)/.test(l)).length;
  const fails = lines.filter(l => /^FAIL|PAGEERR/.test(l));
  const ok = r.status === 0 && !fails.length && pass >= needPass;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}: ${pass} checks passed${fails.length ? ', ' + fails.length + ' failed' : ''}`);
  if (!ok) { bad++; console.log((fails.length ? fails : lines.slice(-30)).join('\n')); }
};

console.log('build'); const b = run(['scripts/build.mjs', '--min']); if (b.status) { console.log(b.stdout, b.stderr); process.exit(1); }
if (!process.env.NOVEL_TXT && !fs.existsSync(T('fixtures/novel_sample.txt'))) run([T('make_fixture.cjs')]);

check('ui desktop', run([T('uiv.cjs'), 'desk']), 55);
if (!quick) {
  check('ui mobile', run([T('uiv.cjs'), 'mob']), 50);
  const steps = fs.readFileSync(T('smoke.json'), 'utf8');
  check('smoke (all spaces)', run([T('run4.cjs'), steps], { NOINTRO: '1', WAIT: '12000' }), 5);
}
process.exit(bad ? 1 : 0);
