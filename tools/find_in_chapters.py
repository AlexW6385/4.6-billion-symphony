# For each entry id, look inside the chapters listed in its `ch` field and show where the entry's name appears.
# Used to check that an entry's chapter references are right before (re)writing its description.
#   NOVEL=/path/novel.txt N=400 python3 tools/find_in_chapters.py v_gouluo bk_jilu
import os, re, sys
from _common import novel, entries
nov = novel()
W = {w['id']: w for w in entries()}
H = [(m.start(), m.end(), m.group(1)) for m in re.finditer(r'\n\s*第[零一二三四五六七八九十百千0-9]+章\s*([^\n]+?)\s*\n', nov)]
def chap(t):
    return [nov[b:H[i + 1][0] if i + 1 < len(H) else len(nov)] for i, (a, b, tt) in enumerate(H) if tt.strip() == t]
N = int(os.environ.get('N', '260'))
for wid in sys.argv[1:]:
    w = W[wid]; kws = [x.strip() for x in re.split(r'[·（）()]', w['n']) if x.strip()]
    print('##', wid, w['n'], '|', w.get('ch'))
    for t in re.findall(r'《([^》]+)》', w.get('ch') or ''):
        cs = chap(t)
        if not cs: print('  [%s] NO CHAPTER' % t); continue
        for j, c in enumerate(cs):
            hit = next(((k, c.find(k)) for k in kws if c.find(k) >= 0), None)
            if hit:
                k, i = hit; print('  [%s#%d] hit %s: %s' % (t, j, k, c[max(0, i - 60):i + N].replace('\n', '／')))
            else:
                print('  [%s#%d] no-hit (len %d)' % (t, j, len(c)))
