// List the entries with the shortest descriptions (candidates for enriching).
//   node tools/thin.mjs 20
import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const require = createRequire(import.meta.url); globalThis.window = {};
for (const f of ['wiki', 'wiki3', 'wiki4']) require(path.join(ROOT, 'data', f + '.js'));
const sf = path.join(ROOT, 'tools', 'thin_skip.txt');
const skip = new Set(fs.existsSync(sf) ? fs.readFileSync(sf, 'utf8').split(/\s+/) : []);
(window.WIKI || []).filter(w => w.d && w.c !== '事件' && !skip.has(w.id))
  .map(w => [w.id, w.n, w.d.length]).sort((a, b) => a[2] - b[2])
  .slice(0, +process.argv[2] || 10).forEach(x => console.log(x.join(' | ')));
