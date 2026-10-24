# Where each chapter happens: recount data/links.js "cp" from the chapter text.
#   NOVEL=/path/full.txt python3 tools/chapter_places.py [--write] [--show=768,1164] [--fresh=k,k,…|--fresh=@file]
# The full txt (8 volumes) has one header per chapter, in the same order as data/chapters.js (4881).
# --fresh: chapters whose current place is only a placeholder (new to the index); their place is worked out from scratch.
# For every chapter the place names (地理 / 文明 entries, their name parts, plus the short forms below) are counted,
# longest name first so "三层云海" is not also counted as "云海"; places from another era of the book are ignored;
# broad regions count for less than a named spot. A chapter with no clear place inherits the one before it
# (cp = -(index)-2), as the old table did. Without --write it only prints how the result differs from the current table.
import os, re, sys, json, subprocess
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _common import chapters_full

def load_js():
    js = ('global.window={};for(const f of ["wiki","wiki3","wiki4","chapters","links"])require(%r+"/"+f+".js");'
          'console.log(JSON.stringify({W:window.WIKI,C:window.CHAPS,E:window.CHERA,L:window.LINKS}))') % os.path.join(ROOT, 'data')
    return json.loads(subprocess.run(['node', '-e', js], capture_output=True, text=True, check=True).stdout)

D = load_js(); W = {w['id']: w for w in D['W']}; L = D['L']; IDS = L['ids']; IX = {x: i for i, x in enumerate(IDS)}

# the era of a chapter (same rule as src/72_reader.js: where each era begins, CHERA)
def era(k):
    e = 1
    for i, s in enumerate(D['E']):
        if k >= s: e = i + 1
    return e
VOLS = sorted(D['C'], key=int)
CH = []
for v in VOLS:
    for i, _ in enumerate(D['C'][v]): CH.append((v, i + 1, era(len(CH))))

# short forms the book uses for places whose entry names are longer
EXTRA = {
    'cloudsea': ['云海', '天之海'], 'cloudpeak': ['云中山峰', '云海之峰'], 'capital': ['创造之城'], 'silvercity': ['银之城'],
    'jadeport': ['翡翠港'], 'emeraldcity': ['翡翠龙之城', '巨蛋石'], 'whiteisle': ['白骸龙之岛', '灰白之城'],
    'desert': ['荒漠', '沙漠'], 'canyon': ['峡谷之海'], 'jungle': ['扭曲丛林'], 'glow': ['闪光林地', '黑暗之原'],
    'mistsea': ['迷雾之海'], 'under': ['地下世界'], 'spires': ['尖柱林'], 'hometree': ['家园树'], 'isles': ['空中群岛'],
    'inca_pit': ['印加巨坑', '沙漠巨口'], 'crystalcave': ['结晶虫穴'], 'longqimu': ['龙栖木'], 'salt': ['盐地', '白色荒漠'],
    'rift': ['大裂谷'], 'twin': ['双子岛'], 'skull': ['骷髅岛'], 'fungus': ['真菌之岛', '瘟疫五岛'], 'echo': ['回音之岛'],
    'scorpion': ['立蝎之城'], 'greenpool': ['绿色深潭'], 'dieye': ['地眼之湖', '地眼'], 'tianguo': ['天国之林', '天空城堡'],
    'xueqiu': ['血球树', '苔藓之原'], 'rq_neilin': ['内林城', '内林'], 'v_starbus': ['恒星巴士'], 'v_naoling': ['脑灵核心'],
    'ex_tiangong': ['天宫市', '天宫学院'], 'ex_niuyao': ['扭腰城', '扭腰'], 'ex_ameirun': ['阿美润根'], 'ex_xiafeng': ['峡风要塞'],
    'mg_overview': ['米德加尔特'], 'mg_city': ['尘鳄之城'], 'tn_overview': ['白色通道', '虚空隧道'], 'ng_overview': ['凝固虚空'],
    'bk_overview': ['不可预见之地'], 'xm_diwo': ['迪喔'], 'xm_jiale': ['加勒市', '加勒'], 'xm_planet': ['虚民母球'],
    'v_atlan': ['阿特兰'], 'ex_planet': ['尔什'], 'v_void': ['虚空'], 'rongqiu': ['绒球'],
}
# broad regions: a mention says less about where a chapter happens than a named spot does
BROAD = {'rongqiu': .15, 'v_void': .1, 'ex_planet': .15, 'xm_planet': .3, 'north': .5, 'west': .5, 'east': .5, 'south': .5,
         'rq_south': .5, 'desert': .5, 'mg_overview': .5, 'ng_overview': .5, 'bk_overview': .5, 'tn_overview': .5,
         'v_rongqiu': .1, 'v_erxi': .1, 'v_ximin': .1, 'ex_south': .5, 'ex_north': .5, 'origin': .6}

# name parts that are ordinary words, or shared by places in different worlds
STOP = {'学院', '绿洲', '首都', '工厂', '废土', '寒地', '松果', '雾湖', '研究所', '观测室', '安全区', '火箭', '高楼', '露西'}

def names(w):
    out = set()
    for p in re.split(r'\s*·\s*', w['n']):
        p = re.sub(r'[（(].*?[)）]', '', p).strip('“”" ')
        if len(p) >= 2 and p not in STOP: out.add(p)
    out.update(EXTRA.get(w['id'], []))
    return out

PL = [w for w in D['W'] if w['c'] in ('地理', '文明') and w['id'] in IX]
PAT = sorted({(n, w['id']) for w in PL for n in names(w)}, key=lambda x: -len(x[0]))
REX = re.compile('|'.join(re.escape(n) for n, _ in PAT))
NAME2 = {}
for n, i in PAT: NAME2.setdefault(n, []).append(i)

def chapters():
    T = chapters_full()
    assert len(T) == len(CH), (len(T), len(CH))
    return [x[3] for x in T]

def place_of(text, e):
    sc = {}
    n = len(text) or 1
    for m in REX.finditer(text):
        for i in NAME2[m.group(0)]:
            w = W[i]
            if w.get('e') and e not in w['e']: continue
            # where it is said matters a little: the opening of a chapter usually sets the scene
            k = BROAD.get(i, 1) * (.3 if w['c'] == '文明' else 1) * (1.6 if m.start() < n * .2 else 1)
            sc[i] = sc.get(i, 0) + k
    return sc

FRESH = set()
for a in sys.argv:
    if a.startswith('--fresh='):
        x = a[8:]; x = open(x[1:]).read() if x.startswith('@') else x
        FRESH = {int(y) for y in re.split(r'[,\s]+', x.strip()) if y}

def main():
    T = chapters(); old = L['cp']; new = []; diff = []
    RAW = [place_of(text, CH[k][2]) for k, text in enumerate(T)]
    # a chapter that names no place is usually still where its neighbours are: blend in the chapters around it
    # who a chapter follows: the entry (not a place) it names most. the book switches between storylines, so only
    # neighbours that follow the same one are blended in
    def dom(k):
        a = L['ce'][k]; best = None; bn = 0
        for i in range(0, len(a), 2):
            w = W.get(IDS[a[i]])
            if w and w['c'] not in ('地理', '文明') and a[i + 1] > bn: best, bn = IDS[a[i]], a[i + 1]
        return best
    DOM = [dom(k) for k in range(len(RAW))]
    def near(k):
        out = {}
        for d, wgt in ((-3, .2), (-2, .3), (-1, .5), (0, 1), (1, .5), (2, .3), (3, .2)):
            j = k + d
            if 0 <= j < len(RAW) and CH[j][0] == CH[k][0] and (d == 0 or (DOM[j] and DOM[j] == DOM[k])):
                for i, x in RAW[j].items():
                    if not W[i].get('e') or CH[k][2] in W[i]['e']: out[i] = out.get(i, 0) + x * wgt
        return out
    for k, text in enumerate(T):
        v, n, e = CH[k]
        sc = near(k)
        o = old[k] if k < len(old) else -1; oid = None if o == -1 or k in FRESH else IDS[o if o >= 0 else -o - 2]
        best = max(sc, key=sc.get) if sc else None; s = sc.get(best, 0) if best else 0; so = sc.get(oid, 0) if oid else 0
        val = o
        # only overrule the old table when the text clearly says somewhere else
        # a broad region, a people, or 绒球 (also the name of Lin's own body) never overrules it
        geo = {i: x for i, x in sc.items() if W[i]['c'] == '地理' and BROAD.get(i, 1) >= .5}
        if geo: best = max(geo, key=geo.get); s = geo[best]
        else: best = None; s = 0
        mapch = best and oid and (W[best].get('m') or 'rongqiu') != (W[oid].get('m') or 'rongqiu')
        if best and best != oid and s >= 3.5 and s >= (6 if mapch else 3) * max(so, .5):
            val = IX[best]
        elif oid is None and best and s >= 2.5:
            val = IX[best]
        new.append(val)
        nn = None if val == -1 else IDS[val if val >= 0 else -val - 2]
        if nn != oid: diff.append((k, v, n, oid or '-', nn or '-', round(s, 1), round(so, 1)))
    show = set()
    for a in sys.argv:
        if a.startswith('--show='): show = {int(x) for x in a[7:].split(',')}
    print('changed place in %d of %d chapters' % (len(diff), len(T)))
    for d in diff[:int(os.environ.get('N', '40'))]: print('  k%d 卷%s第%d章  %s -> %s (%.1f vs %.1f)' % d)
    for k in sorted(show):
        v, n, e = CH[k]; val = new[k]
        print('show k%d 卷%s第%d章 era %d -> %s' % (k, v, n, e, IDS[val if val >= 0 else -val - 2] if val != -1 else '-'))
    if '--write' in sys.argv:
        L['cp'] = new
        head = open(os.path.join(ROOT, 'data/links.js'), encoding='utf-8').read().split('\n', 1)[0]
        open(os.path.join(ROOT, 'data/links.js'), 'w', encoding='utf-8').write(head + '\nwindow.LINKS=' + json.dumps(L, ensure_ascii=False, separators=(',', ':')) + ';\n')
        print('written')

main()
