# shared helpers for the content tools (python 3, no dependencies)
import os, re, json, subprocess
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, '.cache')

def novel_path():
    """Your own copy of the novel (UTF-8). Never committed: set NOVEL=... or put it at ./novel.txt."""
    p = os.environ.get('NOVEL') or os.path.join(ROOT, 'novel.txt')
    if not os.path.exists(p):
        raise SystemExit('need the novel text: set NOVEL=/path/to/novel.txt or put it at ./novel.txt (it is gitignored)')
    return p

def novel():
    return open(novel_path(), encoding='utf-8').read()

def novel_nows():
    """The novel with all whitespace removed, cached in .cache/."""
    os.makedirs(CACHE, exist_ok=True)
    src = novel_path(); out = os.path.join(CACHE, 'novel_nows.txt')
    if not os.path.exists(out) or os.path.getmtime(out) < os.path.getmtime(src):
        open(out, 'w', encoding='utf-8').write(re.sub(r'\s', '', novel()))
    return out

def entries():
    """All wiki entries as dicts (id, n, c, ch, d, k ...)."""
    js = ('global.window={};for(const f of ["wiki","wiki3","wiki4"])require(%r+"/"+f+".js");'
          'console.log(JSON.stringify(window.WIKI))') % os.path.join(ROOT, 'data')
    r = subprocess.run(['node', '-e', js], capture_output=True, text=True, check=True)
    return json.loads(r.stdout)

def chapters_full():
    """The chapters of the full novel txt (8 volumes), in book order: [(volume, number, title, text)]. They line up one to one
    with data/chapters.js."""
    t = novel()
    V = [(m.start(), m.group(1)) for m in re.finditer(r'(?m)^\s*第([一二三四五六七八九十]+)卷\s*[^\n]*', t)]
    CN = '一二三四五六七八九十'
    out = []
    for i, (a, vn) in enumerate(V):
        b = V[i + 1][0] if i + 1 < len(V) else len(t)
        H = [(m.start() + a, m.group(1).strip()) for m in re.finditer(r'(?m)^[ \t　]*第[零一二三四五六七八九十百千0-9]+章[ \t　]*([^\n]*)', t[a:b])]
        for j, (p, tt) in enumerate(H):
            q = H[j + 1][0] if j + 1 < len(H) else b
            out.append((CN.index(vn) + 1, j + 1, tt, t[p:q]))
    return out

def load_data():
    """WIKI, CHAPS, CHERA and LINKS from data/*.js."""
    js = ('global.window={};for(const f of ["wiki","wiki3","wiki4","chapters","links"])require(%r+"/"+f+".js");'
          'console.log(JSON.stringify({W:window.WIKI,C:window.CHAPS,E:window.CHERA,V:window.VOLS,L:window.LINKS}))') % os.path.join(ROOT, 'data')
    return json.loads(subprocess.run(['node', '-e', js], capture_output=True, text=True, check=True).stdout)
