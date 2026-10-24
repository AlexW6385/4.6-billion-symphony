# Which entries each chapter mentions: recount data/links.js "ce" from the full novel txt (8 volumes).
#   NOVEL=/path/full.txt python3 tools/chapter_links.py [--all] [--write] [--extra=entries.json]
# By default only chapters with no counted entries yet are filled (chapters new to the index, and the ones a new entry
# appears in); --all recounts every chapter. Each chapter keeps its five most-mentioned entries. Entries count only in the
# eras they belong to. Without --write it prints how the counts compare with the current table.
# --extra: {"<chapter index>": {"ents": [ids]}} — entries a reader noted for a chapter; those the count missed are added
# (with a count of 1) to the chapters being filled.
import os, re, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _common import ROOT, chapters_full, load_data
D = load_data(); W = {w['id']: w for w in D['W']}; L = D['L']; CHERA = D['E']
STOP = {'学院', '绿洲', '首都', '工厂', '废土', '寒地', '松果', '雾湖', '研究所', '观测室', '安全区', '火箭', '高楼', '露西', '虚空', '巴士', '母球'}
def era(k):
    e = 1
    for i, s in enumerate(CHERA):
        if k >= s: e = i + 1
    return e
def names(w):
    out = set()
    for p in re.split(r'\s*·\s*', w['n']):
        p = re.sub(r'[（(].*?[)）]', '', p).strip('“”" ')
        if 2 <= len(p) <= 10 and p not in STOP: out.add(p)
    return out
ids = list(L['ids'])
for w in D['W']:
    if w['id'] not in ids: ids.append(w['id'])
IX = {x: i for i, x in enumerate(ids)}
PAT = sorted({(n, w['id']) for w in D['W'] for n in names(w)}, key=lambda x: -len(x[0]))
REX = re.compile('|'.join(re.escape(n) for n, _ in PAT)); N2 = {}
for n, i in PAT: N2.setdefault(n, []).append(i)
CH = chapters_full()
total = sum(len(v) for v in D['C'].values())
assert len(CH) == total, (len(CH), total)
def count(k):
    e = era(k); sc = {}; first = {}
    for m in REX.finditer(CH[k][3]):
        for i in N2[m.group(0)]:
            we = W[i].get('e') or []
            if we and e not in we: continue
            sc[i] = sc.get(i, 0) + 1; first.setdefault(i, m.start())
    top = sorted(sc, key=lambda i: (-sc[i], first[i]))[:5]
    out = []
    for i in top: out += [IX[i], sc[i]]
    return out
EXTRA = {}
for a in sys.argv:
    if a.startswith('--extra='): EXTRA = json.load(open(a[8:], encoding='utf-8'))
allm = '--all' in sys.argv; ce = list(L['ce']) + [[] for _ in range(len(CH) - len(L['ce']))]
same = tot = filled = 0
for k in range(len(CH)):
    if ce[k] and not allm:
        if k % 97 == 0:
            a = {ids[ce[k][j]] for j in range(0, len(ce[k]), 2)}; b = {ids[x] for x in count(k)[0::2]}
            tot += len(a); same += len(a & b)
        continue
    ce[k] = count(k); filled += 1
    have = set(ce[k][0::2])
    for i in (EXTRA.get(str(k)) or {}).get('ents', []):
        if i in IX and IX[i] not in have and len(ce[k]) < 14: ce[k] += [IX[i], 1]; have.add(IX[i])
print('filled %d chapters; agreement with the existing counts on a sample: %d/%d' % (filled, same, tot))
if '--write' in sys.argv:
    L['ids'] = ids; L['ce'] = ce
    head = open(os.path.join(ROOT, 'data/links.js'), encoding='utf-8').read().split('\n', 1)[0]
    open(os.path.join(ROOT, 'data/links.js'), 'w', encoding='utf-8').write(head + '\nwindow.LINKS=' + json.dumps(L, ensure_ascii=False, separators=(',', ':')) + ';\n')
    print('written')
