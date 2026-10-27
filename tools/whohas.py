# Which entries mention a name (in their name, summary or body) — to tell a missing place from one covered under another name.
#   python3 tools/whohas.py 名字 名字 ...
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _common import entries
E = entries()
for q in sys.argv[1:]:
    inname = [f"{w['id']}({w['n']})" for w in E if q in w['n']]
    indesc = [f"{w['id']}({w['n']})" for w in E if q not in w['n'] and (q in (w.get('d') or '') or q in (w.get('s') or ''))]
    print(f"{q}: name[{' '.join(inname[:6])}] desc[{' '.join(indesc[:6])}{' …' if len(indesc) > 6 else ''}]")
