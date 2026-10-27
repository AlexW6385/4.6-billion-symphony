# A few short snippets around a name, from the chapters it is densest in — for checking what a coverage candidate is.
#   NOVEL=/path/novel.txt N=2 W=34 python3 tools/ctx.py 名字 名字 ...
# Prints to the terminal only (working use; never paste the output into this repository).
import os, re, sys, collections
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _common import chapters_full
CH = chapters_full(); N = int(os.environ.get('N', '2')); WD = int(os.environ.get('W', '34'))
for name in sys.argv[1:]:
    hits = collections.Counter()
    for k, (v, n, t, text) in enumerate(CH):
        c = text.count(name)
        if c: hits[k] = c
    out = []
    for k, _ in hits.most_common(N):
        v, n, t, text = CH[k]; i = text.find(name)
        out.append(f'v{v}·{n}《{t}》 …' + re.sub(r'\s+', '', text[max(0, i - WD):i + len(name) + WD]) + '…')
    print(f'## {name} ({sum(hits.values())}x/{len(hits)}ch)'); print('\n'.join('  ' + o for o in out))
