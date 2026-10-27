# The coverage index of DESIGN Phase 1: every place name the novel uses often enough to matter, which space it belongs to
# (or needs), whether the exhibition already has an entry for it, and how important it is in the book.
#   NOVEL=/path/novel.txt [REVIEW=review.json] python3 tools/coverage.py OUT.md [OUT.json]
# Search-first, never a read-through: place names are found by their endings (…城, …岛, …星, …之地 and so on), kept when
# they recur and usually stand after a word boundary, and counted per chapter. Nothing of the text is written out except
# the names themselves and chapter numbers. The output belongs in the private source repo (rongqiu-source/exhibition/),
# not here.
import os, re, sys, json, collections
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _common import chapters_full, load_data

OUT = sys.argv[1] if len(sys.argv) > 1 else 'coverage.md'
OUTJ = sys.argv[2] if len(sys.argv) > 2 else os.path.splitext(OUT)[0] + '.json'

D = load_data(); WIKI = D['W']; W = {w['id']: w for w in WIKI}; L = D['L']; IDS = L['ids']
SPACE_TYPE = {'rongqiu': 'planet', 'ximin': 'planet', 'erxi': 'planet', 'void': 'space', 'ningu': 'space(void)', 'dream': 'dream',
              'buke': 'dream', 'under': 'tube', 'midgard': 'tube', 'tunnel': 'tube'}
mapof = lambda w: w.get('m') or 'rongqiu'

CH = chapters_full()                       # [(vol, num, title, text)] in book order, one to one with data/chapters.js
print('chapters', len(CH), file=sys.stderr)

# ---- the place each chapter happens in (data/links.js cp; negative values inherit from an earlier chapter) ----
def chap_place(k, seen=None):
    v = L['cp'][k] if k < len(L['cp']) else -1
    if v >= 0: return IDS[v]
    if v == -1: return None
    j = -v - 2
    return chap_place(j) if 0 <= j < k else None
CPLACE = [chap_place(k) for k in range(len(CH))]
CSPACE = [mapof(W[p]) if p and p in W else None for p in CPLACE]

# ---- candidate place names: a short name in front of a place word ----
SUF = ('星系 星云 星球 母星 母球 星 群岛 岛 大陆 山脉 雪山 火山 峡谷 裂谷 山谷 山 峰 海沟 海峡 海湾 海 洋 湖 河 江 瀑布 谷 森林 丛林 林 '
       '草原 高原 平原 荒原 冰原 雪原 盆地 沙漠 荒漠 洞窟 洞穴 洞 宫殿 神殿 宫 殿 塔 港 基地 城市 城 镇 村 之地 王国 帝国 联邦 联盟 国 '
       '空间 通道 遗迹 废墟 要塞 堡垒 圣地 乐园 深渊 墓场 巢穴 部落 世界 站').split()
SUFRE = '|'.join(sorted(SUF, key=len, reverse=True))
CJK = r'[一-鿿]'
PAT = re.compile(r'(?=(' + CJK + r'{1,5}?(?:' + SUFRE + r')))')
BOUND = set('，。、；：？！“”‘’「」『』（）《》…—\n 　的在到了向从往去回是和与跟对把被将于至离进出过上下里内外中前后叫称为个座片颗条名这那此该其每各一两几')
GENERIC = set('''世界 星球 星系 星云 城市 森林 丛林 大陆 海洋 大海 山脉 宇宙 空间 通道 基地 王国 帝国 国家 部落 遗迹 废墟 沙漠 草原 平原 高原 洞穴 洞窟
 这个世界 那个世界 整个世界 新世界 旧世界 外面的世界 另一个世界 新的世界 其他世界 别的世界 原来的世界 那个星球 这个星球 整个星球 母星 母球
 小岛 岛屿 海岛 大城 城中 城里 城外 进城 山上 山下 山顶 山中 海上 海中 海里 海底 湖中 河里 河边 林中 树林 雪山 火山 港口 宫殿 神殿 古城 主城 都城 京城
 地球 天空 天下 世上 人间 人世 地下世界 陆地 星空 太空 平原上 沙漠里 森林里 丛林里 一座城 一座山 一片海 这座城 那座城 这座山 那座山 那片海 这片海 两座城
 三座城 大山 高山 深山 小山 山峰 高峰 大河 小河 河流 江河 湖泊 大湖 小湖 深海 浅海 内海 外海 公海 地底世界 精神世界 梦中世界 内心世界 新大陆 那片大陆
 这片大陆 整片大陆 一片大陆 原始森林 这片森林 那片森林 一个世界 两个世界 一个星球 这颗星球 那颗星球 一颗星球 整颗星球 各个星球 另一颗星球 这颗星 那颗星
 恒星 行星 卫星 彗星 流星 星星 星光 小行星 双星 明星 救星 火星 零星 寿星 克星 福星 灾星 金星 木星 水星 土星 群星 繁星 晨星 新星 巨星 红星 白星 黑星
 帝国 王国 联邦 联盟 公国 大国 小国 祖国 本国 外国 各国 两国 全国 敌国 盟国 王宫 皇宫 后宫 寝宫 迷宫 子宫 东宫 冷宫 天宫 地宫 龙宫 月宫
 中心城 城墙 城门 城堡 长城 城池 卫城 内城 外城 全城 满城 小镇 城镇 乡镇 村庄 山村 小村 全村 部落'''.split())

def is_place_like(s):
    return not any(ch in s for ch in '的了着过是不也都就还又在把被和与很太更最这那哪么呢吗吧啊呀他她它们我你挖入进开而如没距建立因为所以但若离回来去往到达抵穿') and s not in ('脑海','漏洞','汪洋','沿海','如山','火海','人海','苦海','星海','血海','学海','云海','雾海')

cnt = collections.Counter(); bnd = collections.Counter(); per_ch = collections.defaultdict(collections.Counter)
for k, (v, n, t, text) in enumerate(CH):
    for m in PAT.finditer(text):
        s = m.group(1); p = m.start()
        # only the shortest name ending at this place word, and every longer one ending at the same spot
        cnt[s] += 1; per_ch[s][k] += 1
        if p == 0 or text[p - 1] in BOUND: bnd[s] += 1
print('raw candidates', len(cnt), file=sys.stderr)
# names the book puts in quotes once and then uses as names ("…"), when they are also gone to, entered or left
QPAT = re.compile(r'[‘“](' + CJK + r'{2,8})[’”]')
GO = re.compile(r'(?:到|去|在|进入|离开|来到|前往|回到|通往|飞往|返回|抵达|到达|穿过|位于)(' + CJK + r'{2,8})')
quoted = collections.Counter()
for k, (v, n, t, text) in enumerate(CH):
    for m in QPAT.finditer(text): quoted[m.group(1)] += 1
qset = {q for q, c in quoted.items() if c >= 2}
goes = collections.Counter()
for k, (v, n, t, text) in enumerate(CH):
    for m in GO.finditer(text):
        g = m.group(1)
        for q in (g[:i] for i in range(2, len(g) + 1)):
            if q in qset: goes[q] += 1
for q, gc in goes.most_common(500):
    if gc < 2 or q in cnt: continue
    # count every use of the name, quoted or not
    c = 0; pc = collections.Counter()
    for k, (v, n, t, text) in enumerate(CH):
        x = text.count(q)
        if x: c += x; pc[k] += x
    # a name is quoted a fair share of the times it is used; an ordinary word quoted now and then is not
    fq = quoted[q] / max(1, c)
    if c >= 6 and quoted[q] >= 3 and fq >= (.2 if len(q) == 2 else .06): cnt[q] = c; bnd[q] = c; per_ch[q] = pc
print('with quoted names', len(cnt), file=sys.stderr)

# a counting word or a pointer in front is not part of the name: "一座银之城", "这个星球" -> "银之城", "星球"
LEAD2 = set('进入 距离 建立 没有 因为 所以 但是 而且 如果 离开 回到 来到 前往 通往 到达 抵达 穿过 一个 一座 一颗 一片 一处 整个 整座 整片 整颗 这个 那个 这座 那座 这颗 那颗 这片 那片 这处 那处 每个 每座 各个 某个 几个 两个 三个 所有 其他 其它 另外 一些 这些 那些 好几 无数 不少 许多 很多 原来 以前 曾经 后来 最后 第一 第二 唯一 整整 一整'.split())
LEAD1 = set('个座颗片处些整每各某那这此该其全半另别本诸数几一二两三四五六七八九十百千万块种层条群道枚间')
def norm(x):
    while len(x) >= 2:
        if x[:2] in LEAD2: x = x[2:]; continue
        if x[0] in LEAD1: x = x[1:]; continue
        break
    return x
# a name made of one plain word in front of the place word is a description, not a name ("大洞", "小空间", "高塔", "地下洞穴")
PLAIN = set('大小高低深浅长短宽窄古远近新旧老巨微浅暗亮明深热冷寒冰火石岩土沙泥木铁钢金银铜白黑红黄蓝绿紫灰透空坑地天水山林海湖河岛城国星原外内上下中前后左右东西南北主分子母副旁边'
            '圆方尖平弯斜破残死活真假奇怪异神秘危险安全巨型小型大型中型地底地面地上天上水下水中海底海面湖底深处远处近处附近周围中心中央边缘外围内部外部底部顶部'.split()) | set('大小高低深浅长短宽窄古远近新旧老巨微暗亮明热冷寒冰火石岩土沙泥木铁钢金银铜白黑红黄蓝绿紫灰透空坑地天水山林海湖河岛城国星原外内上下中前后左右东西南北主分子母副旁边圆方尖平弯斜破残死活真假奇怪异')
def plain(x):
    for suf in sorted(SUF, key=len, reverse=True):
        if x.endswith(suf):
            pre = x[:-len(suf)]
            return pre == '' or pre in PLAIN or all(ch in PLAIN for ch in pre)
    return False
cnt2 = collections.Counter(); bnd2 = collections.Counter(); per2 = collections.defaultdict(collections.Counter)
for s0, c0 in cnt.items():
    s1 = norm(s0)
    lead = s1 != s0
    cnt2[s1] += c0; bnd2[s1] += c0 if lead else bnd[s0]
    for k, v in per_ch[s0].items(): per2[s1][k] += v
cnt, bnd, per_ch = cnt2, bnd2, per2
# keep names that recur, mostly stand after a boundary, and read as names
cands = {}
for s, c in cnt.items():
    if plain(s): continue
    if c < 6 or s in GENERIC or not is_place_like(s): continue
    nch = len(per_ch[s])
    if nch < 2: continue
    b = bnd[s] / c
    if b < .45: continue
    cands[s] = (c, nch, b)
# a name that is only ever part of a longer kept name ("之城" inside "银之城") is dropped; a longer name seen only inside
# the same contexts as its tail is kept and the tail dropped when the tail has no life of its own
names = sorted(cands, key=lambda s: -cands[s][0])
drop = set()
for s in names:
    for t in names:
        if t != s and t.endswith(s) and cands[t][0] >= cands[s][0] * .8: drop.add(s)
for s in drop: cands.pop(s, None)
print('kept', len(cands), file=sys.stderr)

# ---- what the exhibition already has: entry names and their parts, region names, space names ----
known = {}
def addk(name, ref):
    for part in re.split(r'[·・（）()/、\s]', name):
        part = part.strip()
        if len(part) >= 2: known.setdefault(part, ref)
for w in WIKI: addk(w['n'], ('entry', w['id']))
for r in D.get('R', []) or []: pass
for mp in ['rongqiu', 'void', 'ximin', 'erxi', 'dream', 'buke', 'under', 'midgard', 'tunnel']: pass
def covered(s):
    if s in known: return known[s]
    for k2, ref in known.items():
        if len(k2) >= 2 and (s in k2 or (k2 in s and len(k2) >= len(s) - 1)): return ref
    return None

rows = []
for s, (c, nch, b) in cands.items():
    sp = collections.Counter(CSPACE[k] for k in per_ch[s] if CSPACE[k])
    vols = collections.Counter(CH[k][0] for k in per_ch[s])
    top = [f'v{CH[k][0]}·{CH[k][1]}' for k, _ in per_ch[s].most_common(6)]
    first = min(per_ch[s]); cov = covered(s)
    rows.append({'name': s, 'count': c, 'chapters': nch, 'first': f'v{CH[first][0]}·{CH[first][1]}', 'top': top,
                 'vols': dict(sorted(vols.items())), 'space': sp.most_common(1)[0][0] if sp else None, 'spaces': dict(sp.most_common(3)),
                 'entry': cov[1] if cov else None, 'score': round(c ** .5 * nch ** .5, 1)})
rows.sort(key=lambda r: -r['score'])
json.dump(rows, open(OUTJ, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)

# ---- the manual review (REVIEW=review.json: name -> [status, space or entry, note]) ----
# status: missing (a real place with no entry), minor (a real place, too small to need one now), have / have-alias (covered,
# the second field names the entry), not (not a place). Names the review adds from elsewhere (the encyclopedia index) are
# counted here so they rank with the rest.
RV = json.load(open(os.environ['REVIEW'], encoding='utf-8')) if os.environ.get('REVIEW') else {}
byname = {r['name']: r for r in rows}
for n in RV:
    if n not in byname:
        hits = collections.Counter({k: t[3].count(n) for k, t in enumerate(CH) if n in t[3]})
        if not hits: continue
        sp = collections.Counter(CSPACE[k] for k in hits if CSPACE[k])
        r = {'name': n, 'count': sum(hits.values()), 'chapters': len(hits), 'first': f'v{CH[min(hits)][0]}·{CH[min(hits)][1]}',
             'top': [f'v{CH[k][0]}·{CH[k][1]}' for k, _ in hits.most_common(6)],
             'vols': dict(sorted(collections.Counter(CH[k][0] for k in hits).items())), 'space': sp.most_common(1)[0][0] if sp else None,
             'spaces': dict(sp.most_common(3)), 'entry': None, 'score': round(sum(hits.values()) ** .5 * len(hits) ** .5, 1), 'extra': 1}
        rows.append(r); byname[n] = r
for r in rows:
    if r['name'] in RV: r['review'] = RV[r['name']]
rows.sort(key=lambda r: -r['score'])
json.dump(rows, open(OUTJ, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)

# ---- the markdown ----
miss = [r for r in rows if not r['entry']]; have = [r for r in rows if r['entry']]
o = ['# Coverage index (Phase 1)', '',
     f'Generated by `4.6-billion-symphony/tools/coverage.py` from `novel.txt` ({len(CH)} chapters). Names only — no text.',
     f'{len(rows)} recurring place names; {len(have)} have an entry in the exhibition, {len(miss)} do not.', '',
     'Columns: score (√mentions·√chapters), mentions, chapters, first chapter, the space its chapters mostly happen in '
     '(from the chapter-place table), volumes, the chapters it is densest in. Names are candidates found by their endings: '
     'some are not places (a title, a figure of speech); they are marked when checked.', '',
     ]
if RV:
    c = collections.Counter((r.get('review') or ['unreviewed'])[0] for r in rows if not r['entry'])
    o += [f"Of those without an entry, the review found {c['missing']} missing places, {c['minor']} minor ones, "
          f"{c['have'] + c['have-alias']} covered inside another entry and {c['not']} that are not places; {c['unreviewed']} unreviewed.", '']
if not RV: o += ['## Missing — ranked by importance', '', '| # | name | score | mentions | ch | first | space | volumes | densest | note |', '|---|---|---|---|---|---|---|---|---|---|']
for i, r in enumerate([] if RV else miss, 1):
    o.append(f"| {i} | {r['name']} | {r['score']} | {r['count']} | {r['chapters']} | {r['first']} | {r['space'] or '?'} | "
             f"{' '.join(f'{k}:{v}' for k, v in r['vols'].items())} | {' '.join(r['top'][:4])} | |")
if RV:
    st = lambda r: (r.get('review') or [None])[0]
    o += ['', '## Verified missing — the curated list (from the review)', '',
          'Real places the exhibition has no entry for, checked one by one, most important first; space is where it belongs '
          '(an existing space, or one that does not exist yet).', '',
          '| # | name | score | mentions | ch | first | space | note |', '|---|---|---|---|---|---|---|---|']
    for i, r in enumerate([r for r in rows if st(r) == 'missing'], 1):
        o.append(f"| {i} | {r['name']} | {r['score']} | {r['count']} | {r['chapters']} | {r['first']} | {r['review'][1] or r['space'] or '?'} | {r['review'][2]} |")
    o += ['', '## Covered inside another entry', '', '| name | score | entry |', '|---|---|---|']
    for r in rows:
        if st(r) in ('have', 'have-alias') and not r['entry']: o.append(f"| {r['name']} | {r['score']} | {r['review'][1]} |")
    mi = [r for r in rows if st(r) == 'minor']
    o += ['', f'## Minor places ({len(mi)}) — real, but too small to need an entry yet', '',
          ', '.join(f"{r['name']} ({r['count']})" for r in mi)]
    no = [r for r in rows if st(r) == 'not']
    o += ['', f'## Not places ({len(no)}) — candidates the review rejected', '', ', '.join(r['name'] for r in no)]
    un = [r for r in rows if not r['entry'] and not st(r)]
    o += ['', f'## Unreviewed ({len(un)})', '', ', '.join(r['name'] for r in un) or '—']
# thin place entries: geography entries with a short description, ranked by how much the book talks about them
THIN = int(os.environ.get('THIN', '140'))
thin = []
for w in WIKI:
    if w.get('c') != '地理' or len(w.get('d') or '') >= THIN: continue
    keys = [k for k in re.split(r'\s*[·（）()]\s*', w['n']) if len(k) >= 2]
    hits = collections.Counter()
    for k in keys:
        for i, t in enumerate(CH):
            n = t[3].count(k)
            if n: hits[i] += n
    thin.append((sum(hits.values()) ** .5 * len(hits) ** .5, sum(hits.values()), len(hits), w))
thin.sort(key=lambda x: -x[0])
o += ['', f'## Thin place entries — under {THIN} characters of description, most-discussed first', '',
      'Enterable already (one can jump to them), but shallower than the book; candidates for Phase 3.', '',
      '| # | entry | name | space | description length | mentions | ch |', '|---|---|---|---|---|---|---|']
for i, (sc, c, n, w) in enumerate(thin, 1):
    o.append(f"| {i} | {w['id']} | {w['n']} | {mapof(w)} | {len(w['d'])} | {c} | {n} |")
o += ['', '## Present — the entry that covers each name', '', '| name | score | mentions | ch | space (book) | entry | entry space |', '|---|---|---|---|---|---|---|']
for r in have:
    e = W.get(r['entry']);
    o.append(f"| {r['name']} | {r['score']} | {r['count']} | {r['chapters']} | {r['space'] or '?'} | {r['entry']} {e['n'] if e else ''} | {mapof(e) if e else ''} |")
open(OUT, 'w', encoding='utf-8').write('\n'.join(o) + '\n')
print('wrote', OUT, len(miss), 'missing', len(have), 'present', file=sys.stderr)
