// Build site/ and serve it at http://localhost:8080 (PORT=... to change).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = path.join(ROOT, 'site');
const args = ['scripts/build.mjs', '--site'];
if (!process.argv.includes('--dev')) args.push('--min');
const b = spawnSync(process.execPath, args, { cwd: ROOT, stdio: 'inherit' });
if (b.status) process.exit(b.status);

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.txt': 'text/plain; charset=utf-8' };
const PORT = +(process.env.PORT || 8080);
http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(SITE, path.normalize(p));
  if (!f.startsWith(SITE) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('not found'); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream', 'cache-control': 'no-cache' });
  fs.createReadStream(f).pipe(res);
}).listen(PORT, () => console.log(`http://localhost:${PORT}/`));
