# Which chapters no entry cites: a finder for parts of the book the exhibition does not tell yet.
#   NOVEL=/path/full.txt python3 tools/uncited.py [MIN_RUN]
# Prints, per volume, how many chapters no entry's `ch` names, then every run of at least MIN_RUN (default 5) consecutive
# uncited chapters with their book-order indexes, per-volume numbers and titles. `《title@n》` in `ch` is the per-volume number.
import os, re, sys, collections
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _common import chapters_full, entries

MIN = int(sys.argv[1]) if len(sys.argv) > 1 else 5
CH = chapters_full()
by_title, by_num = collections.defaultdict(list), {}
for k, (v, n, t, _) in enumerate(CH):
    by_title[(int(v), t)].append(k)
    by_num[(int(v), int(n))] = k
cited = set()
for w in entries():
    for m in re.finditer(r'卷([一二三四五六七八])((?:《[^》]+》)+)', w.get('ch') or ''):
        v = ' 一二三四五六七八'.index(m.group(1))
        for t in re.findall(r'《([^》]+)》', m.group(2)):
            if '@' in t:
                n = t.split('@')[1]
                if n.isdigit() and (v, int(n)) in by_num:
                    cited.add(by_num[(v, int(n))])
            else:
                cited.update(by_title.get((v, t), []))
tot, un = collections.Counter(), collections.Counter()
for k, c in enumerate(CH):
    tot[c[0]] += 1
    if k not in cited:
        un[c[0]] += 1
print('uncited per volume:', {v: f'{un[v]}/{tot[v]}' for v in tot})
k = 0
while k < len(CH):
    if k in cited:
        k += 1
        continue
    j = k
    while j < len(CH) and j not in cited:
        j += 1
    if j - k >= MIN:
        print(f'v{CH[k][0]} [{k}-{j - 1}] (ch {CH[k][1]}-{CH[j - 1][1]}) n={j - k} | ' + ' '.join(CH[i][2] for i in range(k, min(j, k + 30))))
    k = j
