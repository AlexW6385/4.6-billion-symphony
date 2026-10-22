/* ================================================================
   chapters: every card links to the chapters it comes from; every chapter knows the entries it
   mentions and the place it happens, so the book and the world point at each other both ways.
   the text itself is read from the reader's own copy, kept only in their browser.
   ================================================================ */
const QD_CAT='https://m.qidian.com/book/2718601/catalog/';
const VOLN={1:'卷一',2:'卷二',3:'卷三'};
const CH=[],CHI={1:{},2:{},3:{}},VOLLEN={1:0,2:0,3:0};
if(window.CHAPS)['1','2','3'].forEach(v=>{const L=CHAPS[v]||[];VOLLEN[v]=L.length;L.forEach((t,i)=>{const n=i+1;
 const e=v==='1'?(n<=75?1:n<=240?2:3):v==='2'?(606+n<=705?4:5):(n<=530?6:n<=1090?7:n<=1670?8:n<=2270?9:n<=2870?10:n<=3450?11:12);
 const k=CH.length;const pv=CH[k-1];let d=t,dup=0;const st=t.replace(/\s*[，,]：?$/,'').replace(/。$/,'');
 if(pv&&pv.v===+v&&st!==t&&(pv.t===st||pv.raw===st+'。')){d=pv.t;dup=1}else if(/\s+[，,]：$/.test(t)){d=st;dup=1}
 d=d.replace(/^[一二三四五六七八九十]\s{2,}/,'').replace(/^(\\t|\s)+/,'').replace(/[（(]修改[)）]$/,'');CH.push({v:+v,n,t:d,raw:t,dup,e,ents:[]});(CHI[v][t]=CHI[v][t]||[]).push(k);if(d!==t)(CHI[v][d]=CHI[v][d]||[]).push(k)})});
const ENTCH={};
WIKI.forEach(w=>{if(!w.ch)return;let v='1';const out=[];const re=/卷([一二三])|《([^》]+)》/g;let m;
 while((m=re.exec(w.ch))){if(m[1]){v={'一':'1','二':'2','三':'3'}[m[1]];continue}let L=CHI[v]&&CHI[v][m[2]];if(!L)for(const k of['1','2','3'])if(CHI[k][m[2]]){L=CHI[k][m[2]];break}if(!L)continue;
  const e=w.e||[];const best=L.find(k=>e.includes(CH[k].e));const k=best===undefined?L[0]:best;if(!out.includes(k))out.push(k)}
 out.sort((a,b)=>a-b);ENTCH[w.id]=out;out.forEach(k=>CH[k].ents.push(w.id))});
/* the book's own index (links.js): which entries each chapter mentions, how often, and where the chapter happens.
   counted from the cleaned text; it holds no text, only chapter numbers and entry ids */
const LK=window.LINKS||null;const CHM=[],CHP=[],ENTX={},RELX={};
if(LK){const ids=LK.ids;LK.ce.forEach((a,k)=>{if(!CH[k])return;const L=[];for(let i=0;i<a.length;i+=2){const id=ids[a[i]];if(W[id])L.push([id,a[i+1]])}CHM[k]=L;L.forEach(([id,n])=>{(ENTX[id]=ENTX[id]||[]).push([k,n])})});
 LK.cp.forEach((v,k)=>{if(v===-1||!CH[k]){CHP[k]=null;return}const inh=v<-1;const id=ids[inh?-v-2:v];CHP[k]=W[id]?{id,inh}:null});
 for(const i in LK.rel){const id=ids[+i];if(W[id])RELX[id]=LK.rel[i].map(j=>ids[j]).filter(x=>W[x])}}
window.__RELX=RELX;
/* the entries of a chapter: those whose cards list it first, then the ones counted in the text (with how many times) */
function chEnts(k){const out=[],at={};for(const id of CH[k].ents)if(W[id]&&!(id in at)){at[id]=out.length;out.push([id,0,1])}
 for(const [id,n] of (CHM[k]||[])){if(id in at)out[at[id]][1]=n;else{at[id]=out.length;out.push([id,n,0])}}return out}
const shortN=n=>n.split(/\s*·\s*/)[0];
/* go to where a chapter happens, in that chapter's era */
function goChapterPlace(k){const P=CHP[k];if(!P)return;const c=CH[k],id=P.id,w=W[id],m=mapOf(w);const e=(w.e||[]).includes(c.e)&&MB[m].e.includes(c.e)?c.e:null;
 if(m!==CUR.id){if(e){enterSpace(m,{era:e,rig:entryRig(w,SP[m]),after:()=>open(id)});return}go(id);return}
 if(e&&e!==ERA){if(CUR.type==='planet')setEra(e);else{ERA=e;syncTime()}}go(id)}

/* ---------- on the card: the chapters, and a way to page through neighbouring cards ---------- */
const chA=k=>`<a data-ch="${k}">《${esc(CH[k].t)}》<i>${VOLN[CH[k].v]} · 第${CH[k].n}章</i></a>`;
function chapHTML(id){const cur=[...new Set(ENTCH[id]||[])].sort((a,b)=>a-b);const X=(ENTX[id]||[]).filter(([k])=>!cur.includes(k));const w=W[id];
 if(!cur.length&&!X.length)return w&&w.ch?`<div class="sec">原文</div><div class="meta" style="margin-top:4px">${esc(w.ch)}</div>`:'';
 let h=`<div class="sec">原文章节</div>`;if(cur.length)h+=`<div class="chs">${cur.map(chA).join('')}</div>`;
 if(X.length){const tot=X.length+cur.length;const top=X.slice().sort((a,b)=>b[1]-a[1]).slice(0,cur.length?6:10).map(x=>x[0]).sort((a,b)=>a-b);
  h+=`<div class="chs">${top.map(chA).join('')}</div>`;
  if(tot>top.length+cur.length)h+=`<button class="more" data-allch="${id}">更多章节 ▾</button>`}
 return h}
function allChHTML(id){const L=[...new Set([...(ENTCH[id]||[]),...(ENTX[id]||[]).map(x=>x[0])])].sort((a,b)=>a-b);const n={};for(const [k,c] of (ENTX[id]||[]))n[k]=c;let h='<div class="chn">',lv=0;
 for(const k of L){const c=CH[k];if(c.v!==lv){h+=`<b>${VOLN[c.v]}</b>`;lv=c.v}h+=`<a data-ch="${k}" title="《${esc(c.t)}》${n[k]?' · 提到 '+n[k]+' 次':''}" class="${(ENTCH[id]||[]).includes(k)?'key':''}">${c.n}</a>`}return h+'</div>'}
cap.addEventListener('click',e=>{const b=e.target.closest('[data-allch]');if(!b)return;e.stopPropagation();b.outerHTML=allChHTML(b.dataset.allch)},true);
let cardCtx=null;
function cardList(id){if(cardCtx&&cardCtx.ids.includes(id))return cardCtx;const w=W[id];const m=mapOf(w);
 const ids=WIKI.filter(x=>mapOf(x)===m&&x.c===w.c).sort((a,b)=>(a.e[0]-b.e[0])||(((ENTCH[a.id]||[])[0]??1e9)-((ENTCH[b.id]||[])[0]??1e9))).map(x=>x.id);return{ids,label:`${MB[m].n} · ${w.c}`}}
function cardNavHTML(id){const L=cardList(id);if(L.ids.length<2)return'';const i=L.ids.indexOf(id);return`<div class="cnav"><button data-nav="-1" aria-label="上一张">‹</button><span>${esc(L.label)}　${i+1} / ${L.ids.length}</span><button data-nav="1" aria-label="下一张">›</button></div>`}
function cardStep(dir){if(!sel)return;const L=cardList(sel);const i=L.ids.indexOf(sel);if(i<0)return;const id=L.ids[(i+dir+L.ids.length)%L.ids.length];const w=W[id];cardCtx=L;
 go(id);cardCtx=L;cap.classList.remove('slide-l','slide-r');void cap.offsetWidth;cap.classList.add(dir>0?'slide-l':'slide-r')}
/* swipe sideways on a card (or a chapter) to move to the next one */
function swipeable(el,fn){let s=null;el.addEventListener('pointerdown',e=>{if(e.target.closest('a,button,input'))return;s={x:e.clientX,y:e.clientY,id:e.pointerId}});
 el.addEventListener('pointermove',e=>{if(!s||e.pointerId!==s.id)return;const dx=e.clientX-s.x,dy=e.clientY-s.y;if(Math.abs(dx)>12&&Math.abs(dx)>Math.abs(dy)*1.3){el.style.transform=`translateX(${dx*.35}px)`;el.style.opacity=String(1-Math.min(.5,Math.abs(dx)/500))}});
 const end=e=>{if(!s||e.pointerId!==s.id)return;const dx=e.clientX-s.x,dy=e.clientY-s.y;s=null;el.style.transform='';el.style.opacity='';if(Math.abs(dx)>56&&Math.abs(dx)>Math.abs(dy)*1.4)fn(dx<0?1:-1)};
 el.addEventListener('pointerup',end);el.addEventListener('pointercancel',e=>{s=null;el.style.transform='';el.style.opacity=''})}
swipeable(cap,d=>{if(cap.dataset.side){const i=SIDES.findIndex(s=>s.id===cap.dataset.side);goSide(SIDES[(i+d+SIDES.length)%SIDES.length].id);return}cardStep(d)});

/* ---------- your own copy of the book: read from a file on this device, kept only in this browser ---------- */
let NOVEL=null;// {txt, at:[start offsets aligned to CH], end:[...]}
const IDB={db:null,open(){return new Promise((res,rej)=>{try{const r=indexedDB.open('rq_novel',1);r.onupgradeneeded=()=>r.result.createObjectStore('f');r.onsuccess=()=>{this.db=r.result;res(this.db)};r.onerror=()=>rej(r.error)}catch(e){rej(e)}})},
 async get(k){try{const db=this.db||await this.open();return await new Promise((res)=>{const q=db.transaction('f').objectStore('f').get(k);q.onsuccess=()=>res(q.result);q.onerror=()=>res(null)})}catch(e){return null}},
 async put(k,v){try{const db=this.db||await this.open();await new Promise((res)=>{const t=db.transaction('f','readwrite');t.objectStore('f').put(v,k);t.oncomplete=res;t.onerror=res})}catch(e){}},
 async del(k){try{const db=this.db||await this.open();db.transaction('f','readwrite').objectStore('f').delete(k)}catch(e){}}};
function decodeNovel(buf){try{return new TextDecoder('utf-8',{fatal:true}).decode(buf)}catch(e){try{return new TextDecoder('gbk').decode(buf)}catch(e2){return new TextDecoder('utf-8').decode(buf)}}}
const HEADRE=/^[ \t\u3000]*(第[零一二三四五六七八九十百千万两〇0-9]+章[^\r\n]{0,36})\r?$/gm;
const CLEANSIG='《进化的四十六亿重奏》·整理版',HEADX=/^(第[零一二三四五六七八九十百千万两〇0-9]+章[^\r\n]{0,40})\r?$/gm;
function parseNovel(txt){if(txt.startsWith(CLEANSIG)){const heads=[];let m;HEADX.lastIndex=0;while((m=HEADX.exec(txt)))heads.push({s:m.index,e:m.index+m[0].length,t:m[1].trim()});
  if(heads.length===CH.length)return{txt,heads,at:heads.map((_,i)=>i),clean:true}}
 const heads=[];let m;HEADRE.lastIndex=0;while((m=HEADRE.exec(txt))){const t=m[1].trim();const sh=t.replace(/^第[零一二三四五六七八九十百千万两〇0-9]+章\s*/,'').trim();heads.push({s:m.index,e:m.index+m[0].length,t,sh})}
 if(heads.length<50)return null;const at=new Array(CH.length).fill(-1);let j=0;
 for(let k=0;k<CH.length;k++){const want=CH[k].raw||CH[k].t;for(let q=j;q<Math.min(heads.length,j+40);q++){if(heads[q].sh===want||heads[q].t===want||heads[q].t.endsWith(want)){at[k]=q;j=q+1;break}}}
 return{txt,heads,at}}
async function loadNovelFile(file){const buf=await file.arrayBuffer();const txt=decodeNovel(new Uint8Array(buf));const N=parseNovel(txt);if(!N){toast('没认出章节','这个文件里没有找到“第……章”这样的章节标题。');return false}
 NOVEL=N;IDB.put('novel',buf);const hit=N.at.filter(x=>x>=0).length;toast('原文已载入',N.clean?`整理版，${CH.length} 章全部对上。文件只存在这台设备的浏览器里。`:`认出 ${N.heads.length} 个章节标题，对上了 ${hit} / ${CH.length} 章。换成整理版可以全部对上。文件只存在这台设备的浏览器里。`);return true}
let novelTried=false;async function ensureNovel(){if(NOVEL||novelTried)return NOVEL;novelTried=true;const buf=await IDB.get('novel');if(buf){try{NOVEL=parseNovel(decodeNovel(new Uint8Array(buf)))}catch(e){NOVEL=null}}return NOVEL}
/* names in the text become links to their cards */
let NAMERE=null,NAMEID=null;function nameRe(){if(NAMERE)return NAMERE;NAMEID={};const L=[];for(const w of WIKI){for(const part of w.n.split(/\s*[·（）()]\s*/)){const t=part.trim();if(t.length<2||t.length>10||NAMEID[t])continue;NAMEID[t]=w.id;L.push(t)}}
 L.sort((a,b)=>b.length-a.length);NAMERE=new RegExp(L.map(x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'g');return NAMERE}
function chapterText(k){if(!NOVEL)return null;const q=NOVEL.at[k];if(q<0)return null;const h=NOVEL.heads[q],nx=NOVEL.heads[q+1];const raw=NOVEL.txt.slice(h.e,nx?nx.s:NOVEL.txt.length);const re=nameRe();
 return raw.split(/\r?\n/).map(l=>l.replace(/^[\s\u3000]+|[\s\u3000]+$/g,'')).filter(l=>l&&!/^【卷[一二三]】$/.test(l)).map(l=>{if(l==='……')return'<p class="sep">……</p>';if(/^【第.+】$/.test(l))return`<h4 class="subh">${esc(l.slice(1,-1))}</h4>`;
  const e=esc(l);return`<p>${e.replace(re,m=>`<a data-nm="${NAMEID[m]}">${m}</a>`)}</p>`}).join('')}

/* ---------- the reader ---------- */
/* the txt's own chapter numbers skip and repeat in places; when they differ from our running count, show what the file says */
function cnNum(s){if(/^[0-9]+$/.test(s))return +s;const D={'零':0,'〇':0,'一':1,'二':2,'两':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9};let n=0,cur=0;for(const ch of s){if(ch in D)cur=D[ch];else if(ch==='十'){n+=(cur||1)*10;cur=0}else if(ch==='百'){n+=cur*100;cur=0}else if(ch==='千'){n+=cur*1000;cur=0}}return n+cur}
function origNo(k){if(!NOVEL||!NOVEL.at)return'';const q=NOVEL.at[k];const h=q>=0&&NOVEL.heads[q];if(!h)return'';const m=/^第([零一二三四五六七八九十百千万两〇0-9]+)章/.exec(h.t);if(!m||cnNum(m[1])===CH[k].n)return'';return` · 原文标为“第${esc(m[1])}章”`}
const rd=$('#rd');let rdK=-1,rdFrom=null;
let rdToc=false;
async function openRd(k,from){if(!CH[k])return;rdK=k;if(from!==undefined)rdFrom=from;if(!NOVEL&&!novelTried){if(!rd.classList.contains('on')){rd.innerHTML='<button class="x" aria-label="关闭">×</button><p class="sec">翻开中…</p>';rd.classList.add('on')}await ensureNovel()}if(rdK!==k)return;const c=CH[k];const vl=VOLLEN[c.v];const body=NOVEL?chapterText(k):null;
 const ents=chEnts(k);const pl=CHP[k];let near='';try{localStorage.setItem('rq_lastch',String(k))}catch(e){}
 if(!ents.length){let a=-1,b=-1;for(let j=k-1;j>=0&&j>k-400;j--)if(chEnts(j).length){a=j;break}for(let j=k+1;j<CH.length&&j<k+400;j++)if(chEnts(j).length){b=j;break}
  near=`<p class="none">这一章还没有收录条目。${a>=0||b>=0?'离它最近、收录了条目的章节：':''}</p><div class="chips">${[a,b].filter(x=>x>=0).map(x=>`<a data-rk="${x}">《${esc(CH[x].t)}》<i>第${CH[x].n}章</i></a>`).join('')}</div>`}
 const whereH=pl?`<div class="where">${pl.inh?'故事仍在':'故事发生在'} <a data-gp="${k}">${esc(shortN(W[pl.id].n))} →</a></div>`:'';
 const chipsH=ents.length?`<div class="chips">${ents.slice(0,12).map(([id])=>`<a class="e" data-re="${id}">${esc(shortN(W[id].n))}</a>`).join('')}</div>`:'';
 const toc=[];for(let j=Math.max(0,k-6);j<=Math.min(CH.length-1,k+6);j++){const x=CH[j];toc.push(`<li data-rk="${j}" class="${j===k?'cur':''}"><b>${x.v!==c.v?VOLN[x.v]+' ':''}${x.n}</b>${esc(x.t)}</li>`)}
 rd.innerHTML=`<button class="x" aria-label="关闭">×</button>${rdFrom&&W[rdFrom]?`<a class="back" data-back>‹ 回到「${esc(W[rdFrom].n)}」</a>`:''}
  <div class="eb">${VOLN[c.v]} · 第 ${c.n} 章 · ${ERAN[c.e]}${origNo(k)}${c.dup?' · 目录重复':''}</div><h2>${esc(c.t)}</h2>${body?'':whereH+chipsH}
  <div class="rdnav"><button data-rs="-1">‹ 上一章</button><span>${c.n} / ${vl}</span><button data-rs="1">下一章 ›</button></div><div class="bar"><i style="width:${(c.n/vl*100).toFixed(1)}%"></i></div>
  ${!ents.length&&!body?near:''}
  ${body?`<div class="txt">${body}</div>${whereH}${chipsH}<div class="rdnav end"><button data-rs="-1">‹ 上一章</button><button data-toc>目录</button><button data-rs="1">下一章 ›</button></div>`:''}
  ${body&&!rdToc?'':`<div class="sec">前后章节</div><ol>${toc.join('')}</ol>`}
  ${NOVEL?(body?'':`<p class="note">在你载入的原文里没有对上这一章的标题。</p>`)+`<p class="note">原文来自你自己设备上的文件，只保存在这个浏览器里，不会随页面分享出去。<a class="lnk" data-unload>移除原文</a></p>`
   +(NOVEL.clean?'':`<label class="qd load">换成整理版原文（全部章节都能对上）<input type="file" accept=".txt,text/plain" data-file hidden></label>`)
   :`<label class="qd load">载入原文 txt，在这里逐章阅读<input type="file" accept=".txt,text/plain" data-file hidden></label>
  <p class="note">最好选整理版（《进化的四十六亿重奏》·整理版.txt），全部章节都能对上；原来那份 txt（UTF-8 或 GBK）也可以。文件只在这台设备的浏览器里读取和保存，不会上传，也不会出现在分享出去的页面里。之后点任何条目的章节，都会直接翻到原文那一章。</p>
  <a class="lnk" href="${QD_CAT}" target="_blank" rel="noopener">也可以去起点中文网的目录 ↗</a>`}`;
 rd.classList.add('on','read');rd.classList.toggle('read',!!body);rd.scrollTop=0}
function closeRd(){rd.classList.remove('on');rdK=-1}
rd.addEventListener('change',async e=>{const f=e.target.closest('[data-file]');if(!f||!f.files||!f.files[0])return;const ok=await loadNovelFile(f.files[0]);if(ok)openRd(rdK)});
rd.addEventListener('click',e=>{if(e.target.closest('.x'))return closeRd();if(e.target.closest('[data-toc]')){rdToc=!rdToc;return openRd(rdK)}if(e.target.closest('[data-unload]')){NOVEL=null;IDB.del('novel');toast('已移除原文','');return openRd(rdK)}
 const nm=e.target.closest('[data-nm]');if(nm){const id=nm.dataset.nm;rdFrom=null;if(innerWidth<760)closeRd();go(id);return}if(e.target.closest('[data-back]')){const id=rdFrom;closeRd();if(id)open(id);return}
 const s=e.target.closest('[data-rs]');if(s)return openRd(clamp(rdK+ +s.dataset.rs,0,CH.length-1));const r=e.target.closest('[data-rk]');if(r)return openRd(+r.dataset.rk);
 const gp=e.target.closest('[data-gp]');if(gp){if(innerWidth<760)closeRd();goChapterPlace(+gp.dataset.gp);return}
 const en=e.target.closest('[data-re]');if(en){if(innerWidth<760)closeRd();cardCtx={ids:chEnts(rdK).map(x=>x[0]),label:`第${CH[rdK].n}章`};go(en.dataset.re);return}});
swipeable(rd,d=>{if(rdK>=0)openRd(clamp(rdK+d,0,CH.length-1))});
/* pull down to leave: once a card or a chapter is scrolled to the very top, keep pulling down and it slides away */
function pullClose(el,close){let y0=null,dy=0,top=false;const reset=()=>{el.style.transition='transform .22s,opacity .22s';el.style.transform='';el.style.opacity='';setTimeout(()=>{el.style.transition=''},240)};
 el.addEventListener('touchstart',e=>{if(e.touches.length!==1||!el.classList.contains('on'))return;y0=e.touches[0].clientY;dy=0;top=el.scrollTop<=0},{passive:true});
 el.addEventListener('touchmove',e=>{if(y0===null)return;const d=e.touches[0].clientY-y0;if(!top){if(el.scrollTop<=0&&d<0)y0=e.touches[0].clientY;top=el.scrollTop<=0;return}
  if(d>0){dy=d;e.preventDefault();el.style.transition='';el.style.transform=`translateY(${d*.55}px)`;el.style.opacity=String(1-Math.min(.55,d/420))}else if(d<-4){top=false;y0=null;reset()}},{passive:false});
 const end=()=>{if(y0===null)return;y0=null;if(top&&dy>90){el.style.transition='transform .2s,opacity .2s';el.style.transform=`translateY(${Math.max(140,dy)}px)`;el.style.opacity='0';setTimeout(()=>{close();el.style.transition='';el.style.transform='';el.style.opacity=''},190)}else if(dy>0)reset();dy=0};
 el.addEventListener('touchend',end);el.addEventListener('touchcancel',()=>{y0=null;dy=0;reset()});
 // mouse wheel: a separate upward flick that starts while already at the top
 let acc=0,last=0,armed=false;el.addEventListener('wheel',e=>{if(!el.classList.contains('on'))return;const now=performance.now();const gap=now-last;last=now;
  if(gap>350){armed=el.scrollTop<=0;acc=0}if(!armed||el.scrollTop>0||e.deltaY>=0){if(e.deltaY>0){armed=false;acc=0;if(el.style.transform)reset()}return}
  acc+=-e.deltaY;el.style.transition='transform .12s';el.style.transform=`translateY(${Math.min(120,acc*.25)}px)`;clearTimeout(el._pc);el._pc=setTimeout(()=>{if(acc<360)reset();acc=0},360);
  if(acc>=360){armed=false;acc=0;el.style.transition='transform .2s,opacity .2s';el.style.transform='translateY(160px)';el.style.opacity='0';setTimeout(()=>{close();el.style.transition='';el.style.transform='';el.style.opacity=''},190)}},{passive:true})}
pullClose(cap,()=>closeCap());pullClose(rd,()=>closeRd());
addEventListener('keydown',e=>{if(e.code==='Escape'&&rd.classList.contains('on'))closeRd()});

/* ---------- the library's chapter tab: the whole book by era, with what each chapter holds ---------- */
const chOpen=new Set();
function chapLibHTML(q){if(q){const L=[];CH.forEach((c,k)=>{if(!c.dup&&c.t.includes(q))L.push(k)});return L.slice(0,300).map(k=>chRow(k,true)).join('')}
 let last=-1;try{last=+localStorage.getItem('rq_lastch')}catch(e){}
 let h=(CH[last]?`<button class="chr cont" data-rch="${last}"><b>继续读</b>${esc(CH[last].t)}<s>${VOLN[CH[last].v]} 第${CH[last].n}章</s></button>`:'');let lastV=0;
 for(const E of ERAS){const ks=[];CH.forEach((c,k)=>{if(c.e===E.id)ks.push(k)});if(!ks.length)continue;const v=CH[ks[0]].v;if(v!==lastV){h+=`<div class="vol">${VOLN[v]}</div>`;lastV=v}
  h+=`<button class="chg" data-ce="${E.id}">${chOpen.has(E.id)?'▾':'▸'} ${esc(E.n)}<small>第${CH[ks[0]].n}–${CH[ks[ks.length-1]].n}章</small></button>`;
  if(chOpen.has(E.id))h+=ks.filter(k=>!CH[k].dup).map(k=>chRow(k)).join('')}
 return h}
function chRow(k,vol){const c=CH[k],n=chEnts(k).length,pl=CHP[k];return`<button class="chr" data-rch="${k}"><b>${vol?VOLN[c.v]+' ':''}${c.n}</b>${esc(c.t)}${pl&&!pl.inh?`<em>${esc(shortN(W[pl.id].n))}</em>`:''}</button>`}
Object.assign(window.__rq,{openRd,loadNovelFile,CH,chEnts,CHP,goChapterPlace});
Object.assign(window.__rq,{cardStep:d=>cardStep(d),sel:()=>sel,chapLibHTML,W});

/* look for a stored copy of the book while the visitor is still looking around, so the first chapter opens at once */
(window.requestIdleCallback||((f)=>setTimeout(f,2500)))(()=>{ensureNovel()},{timeout:6000});
