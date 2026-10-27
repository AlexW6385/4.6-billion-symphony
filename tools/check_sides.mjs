// Every side story hangs at an existing entry, in eras that entry has.   node tools/check_sides.mjs
import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const require = createRequire(import.meta.url); globalThis.window = {};
for (const f of ['wiki', 'wiki3', 'wiki4']) require(path.join(ROOT, 'data', f + '.js'));
const W = Object.fromEntries(window.WIKI.map(w => [w.id, w]));
const src = fs.readFileSync(path.join(ROOT, 'src', '74_sides.js'), 'utf8');
const S = (0, eval)(src.match(/const SIDES=(\[[\s\S]*?\]);const sideFound/)[1]);
let bad = 0; const ids = new Set();
for (const s of S) {
  if (ids.has(s.id)) { console.log('duplicate id', s.id); bad++ } ids.add(s.id);
  const w = W[s.at]; if (!w) { console.log('no entry', s.id, s.at); bad++; continue }
  if (!s.e.every(e => w.e.includes(e))) { console.log('era outside entry', s.id, s.e, w.e); bad++ }
  if (s.d.length < 2) { console.log('too short', s.id); bad++ }
}
console.log(S.length, 'side stories,', bad, 'problems'); process.exit(bad ? 1 : 0);
