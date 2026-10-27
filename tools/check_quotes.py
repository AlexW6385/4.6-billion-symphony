# Quotes in entry texts mean the book's own words: list every “…” span (2–14 characters) in an entry's summary or body
# that does not occur in the novel, punctuation ignored. Coined terms should not be quoted; long quoted speech is ours.
#   NOVEL=/path/novel.txt python3 tools/check_quotes.py
import re, sys
from _common import entries, novel_nows
N = re.sub(r'[\s，。！？、…：；,.!?‘’“”]', '', open(novel_nows(), encoding='utf-8').read())
n = 0
for w in entries():
    t = (w.get('s') or '') + (w.get('d') or '')
    for m in re.finditer(r'“([^”]{2,14})”', t):
        q = re.sub(r'[\s，。！？、…：；,.!?‘’]', '', m.group(1))
        if re.search(r'[一-鿿]', q) and q not in N:
            print(w['id'], m.group(1), sep='\t'); n += 1
print(n, 'quoted spans not in the novel', file=sys.stderr)
