# Copyright guard: report any run of VN (default 12) CJK characters in the entry texts or side stories
# that also appears verbatim in the novel. Everything written for the exhibition must be paraphrase.
#   NOVEL=/path/novel.txt python3 tools/check_overlap.py        (exit code 1 if anything overlaps)
import os, re, sys, subprocess
from _common import ROOT, CACHE, novel_nows
N = int(os.environ.get('VN', '12'))
nf = novel_nows()
files = [os.path.join(ROOT, 'data', f) for f in ('wiki.js', 'wiki3.js', 'wiki4.js')] + [os.path.join(ROOT, 'src', '74_sides.js')]
pat = {}
for f in files:
    s = open(f, encoding='utf-8').read()
    for p in re.split(r"(?=\{\s*id:\s*['\"])", s):
        mm = re.match(r"\{\s*id:\s*['\"]([^'\"]+)", p)
        if not mm: continue
        p = re.sub(r"\bch:\s*'[^']*'", '', p)  # chapter-title lists are references, not prose
        txt = re.sub(r'[\s\'"]', '', p)
        for seg in re.findall(r'[一-鿿，。！？、…：；“”‘’]{%d,}' % N, txt):
            for i in range(0, len(seg) - N + 1):
                pat.setdefault(seg[i:i + N], set()).add(os.path.basename(f) + ':' + mm.group(1))
pf = os.path.join(CACHE, 'overlap_patterns.txt')
open(pf, 'w', encoding='utf-8').write('\n'.join(pat))
out = subprocess.run(['grep', '-oFf', pf, nf], capture_output=True, text=True).stdout.split('\n')
by = {}
for o in set(out):
    for k in pat.get(o, ()): by.setdefault(k, []).append(o)
for k in sorted(by): print(k, len(by[k]), ' | '.join(by[k][:2]))
print(len(by), 'entries with overlaps', file=sys.stderr)
sys.exit(1 if by else 0)
