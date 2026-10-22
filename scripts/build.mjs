// Build the exhibition.
//   node scripts/build.mjs                 -> dist/  (page fragment + data, readable)
//   node scripts/build.mjs --min           -> dist/  (minified)
//   node scripts/build.mjs --site --min    -> site/  (full standalone HTML document, for GitHub Pages)
// The page is one HTML file assembled from src/ in the order listed in scripts/order.txt;
// the big data tables (entries, chapter index, links) stay as separate scripts next to it.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = new Set(process.argv.slice(2));
const MIN = args.has('--min');
const SITE = args.has('--site');
const OUT = path.join(ROOT, SITE ? 'site' : 'dist');
const DATA = ['wiki.js', 'wiki3.js', 'wiki4.js', 'chapters.js', 'links.js'];

const order = fs.readFileSync(path.join(ROOT, 'scripts/order.txt'), 'utf8').split(/\s+/).filter(Boolean);
let html = order.map(f => fs.readFileSync(path.join(ROOT, 'src', f), 'utf8')).join('\n') + '\n';

let esbuild = null;
if (MIN) {
  try { esbuild = await import('esbuild'); }
  catch { console.error('esbuild is not installed: run `npm install` first, or build without --min'); process.exit(1); }
  // the whole app is the last inline <script> block: one IIFE
  const marker = '<script>\n(function(){';
  const i = html.lastIndexOf(marker), j = html.lastIndexOf('</script>');
  if (i < 0 || j < i) throw new Error('could not find the main script block');
  const js = html.slice(i + '<script>'.length, j);
  const out = esbuild.transformSync(js, { minify: true, loader: 'js', target: 'es2019', charset: 'utf8', legalComments: 'none' }).code;
  if (out.includes('</script')) throw new Error('minified code contains </script');
  html = html.slice(0, i) + '<script>' + out + html.slice(j);
}

if (SITE) {
  // the source is a page fragment (the hosting page used to supply the document skeleton)
  html = '<!doctype html>\n<html lang="zh-CN">\n<head>\n<meta charset="utf-8">\n' + html + '\n</html>\n';
}

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), html);
for (const f of DATA) {
  let s = fs.readFileSync(path.join(ROOT, 'data', f), 'utf8');
  if (esbuild) s = esbuild.transformSync(s, { minifyWhitespace: true, minifySyntax: true, loader: 'js', charset: 'utf8', legalComments: 'none' }).code;
  fs.writeFileSync(path.join(OUT, f), s);
}
if (SITE) fs.writeFileSync(path.join(OUT, '.nojekyll'), '');

const kb = f => (fs.statSync(path.join(OUT, f)).size / 1024).toFixed(0) + ' KB';
console.log(`built ${path.relative(ROOT, OUT)}/ ${MIN ? '(minified)' : ''}`);
for (const f of ['index.html', ...DATA]) console.log('  ' + f.padEnd(12) + kb(f));
