/* ================================================================
   the tour: the book's story in order, act by act (one act per story in the library),
   a few stops in each. The camera flies to each stop, lingers and turns slowly while
   a line or two says what happened there, then moves on. Pause, step, or leave at any time.
   ================================================================ */
const TOUR_STOPS=[
 ['origin','shilijj','jingjun'],['ev_ext1','hangmu','yuandun'],['lvtan_beast','abyss','jjzs'],['ev_ext2','landing','spires','desert'],
 ['crystalcave','naodai','hometree'],['aztec','under','inca','mingshikt'],['canyon','ev_ext3','tiankong'],['mistsea','skull','tako','plague'],
 ['rqzj','emeraldcity','susumi','scorpion'],['whiteisle','jingkuang','creator','greenpool'],['ev_snow','fangzhou','frozentree'],
 ['jadeport','silvercity','capital','cloudpeak','creator2'],
 ['xm_train','xm_diwo','xm_oasis','xm_coral'],['dr_brainspirit','dr_prison','dr_road','xm_jiale'],['v_starbus','v_yushi','moon_bus'],
 ['rq_south','rq_blackcity','rq_mayaship'],['v_naoling'],['v_huhe','v_se','xm_fungus','v_shenmin','v_erxi'],['v_lianjie','v_dijing','v_yuanhuan','v_buhuo'],
 ['v_yinli','v_fear','v_nuchong','v_zhimeng','v_zhengteng'],['rq_xuewu','rq_cuihai','rq_neilin','v_shijing'],['v_jing','v_qishi','v_shuiyin'],
 ['v_midgard','mg_chene','mg_tripod','v_rongui'],['v_guanzhuang','v_dust','ex_tiangong','c_bilu'],['dr_doom','dr_vampire','dr_manzhu','ex_split'],
 ['v_midgard2','v_jili','v_guangyin','v_jianci'],['v_handi','v_shizu','v_shenyan','v_anzao','v_zhouluo'],['v_hongtian','v_gem','ng_overview','ex_frozen','ng_death'],
 ['ng_qiushen','v_phoenix','v_feng','ng_snow'],['tn_xianqu','tn_sand','v_wuyi','tn_wuxing'],['bk_home','v_bone','v_bridge','v_warbus','dr_dreamshaper'],
 ['v_pain','v_kuding','v_amber','v_dongchuang'],['v_liquid','v_xingyan','v_ranxing','v_nospace'],['v_xiaoerxi','v_qijizhidu','v_haishen'],
 ['dr_mengli','dr_hope','dr_doll'],['bk_mengerxi','bk_crying','bk_hang','bk_abyss'],['c_sarin','bk_simu','bk_order','bk_pig'],
 ['v_benglie','v_huanxiang','v_hunhe','v_yingzhe'],['v_renzhi','v_keli','v_piaobo','v_collide'],
 ['j1_jisuan','j1_jijing','j1_ningqiu','j1_yongshuo'],['j1_shizong','j1_guzhan','j1_benyuan','j1_tunshi'],['j1_chezhan','j1_wohliu','j1_jiaotong','j1_jilu'],['j1_jingju','j1_guodong','j1_yongye','j1_biri'],['j2_dalie','j2_huanxu','j2_xuying','j2_guanli'],['j2_lvying','j2_heini','j2_shiti','j2_lianjun'],['j2_lukuai','j2_jiejing','j2_juxingyun','j2_heiheng','j2_anmian'],['j3_jingjing','j3_lunhui','j3_xiwang','j3_yingui'],['j3_eyevoid','j3_nongwu','j3_zhongmo','j3_genchu','j3_baigaoworld'],['j3_zhihui','j3_ronger','j3_farnuo','j3_end']];
const CN_NUM=n=>{const d='零一二三四五六七八九';if(n<=10)return n===10?'十':d[n];if(n<20)return '十'+d[n-10];return d[Math.floor(n/10)]+'十'+(n%10?d[n%10]:'')};
const TOUR=(()=>{const L=[];(window.ARCS||[]).forEach((a,i)=>{const S=(TOUR_STOPS[i]||[]).filter(id=>W[id]);(S.length?S:[a.go||ARCGO[i]].filter(id=>id&&W[id])).forEach((id,k)=>L.push({act:i,first:k===0,id}))});return L})();
const tourEl=document.createElement('div');tourEl.id='tour';tourEl.className='glass';document.body.appendChild(tourEl);
const TVS={on:false,i:0,paused:false,phase:'',t:0,dwell:0,raf:0,last:0,card:false,cardP:false};
/* the entry card stays out of the way during the tour; the 词条 button shows it and hides it again (and the tour waits while it is open) */
function tourCard(on){TVS.card=on;document.body.classList.toggle('tourcard',on);if(on){if(!TVS.paused){TVS.paused=true;TVS.cardP=true}const s=TOUR[TVS.i];if(s&&!cap.classList.contains('on'))open(s.id)}else if(TVS.cardP){TVS.cardP=false;TVS.paused=false}tourDraw()}
function tourStart(i){if(!TOUR.length)return;TVS.on=true;TVS.i=clamp(i||0,0,TOUR.length-1);TVS.paused=false;document.body.classList.add('touring');if(innerWidth<760)$('#lib').classList.remove('on');else $('#lib').classList.remove('on');
 hint(matchMedia('(pointer:coarse)').matches?'导览中：碰一下画面暂停，左右滑动面板换一站':'导览中：拖动画面会暂停；空格 暂停 / 继续，PageUp / PageDown 换一站',4200);tourGo();if(!TVS.raf){TVS.last=performance.now();TVS.raf=requestAnimationFrame(tourTick)}}
function tourStop(){TVS.on=false;TVS.card=false;TVS.cardP=false;document.body.classList.remove('touring','tourcard');tourEl.classList.remove('on');cancelAnimationFrame(TVS.raf);TVS.raf=0}
function tourGo(){const s=TOUR[TVS.i];if(!s)return tourStop();const a=ARCS[s.act];const w=W[s.id];
 // the act's own era where the stop belongs to it, otherwise the stop's own
 const m=mapOf(w);if(m===CUR.id&&CUR.type==='planet'&&(w.e||[]).includes(a.e)&&ERA!==a.e)setEra(a.e);
 TVS.card=false;TVS.cardP=false;document.body.classList.remove('tourcard');go(s.id);TVS.phase='fly';TVS.t=0;TVS.dwell=Math.min(16,7+((w.s||'').length+(s.first?(a.d||'').length*.5:0))*.06);tourDraw()}
function tourDraw(){const s=TOUR[TVS.i];if(!s){tourEl.classList.remove('on');return}const a=ARCS[s.act],w=W[s.id];const ac=TOUR.filter(x=>x.act===s.act),k=ac.indexOf(s);
 tourEl.innerHTML=`<div class="th"><span class="act">第${CN_NUM(s.act+1)}幕 · ${esc(a.t)}</span><span class="ch">${esc(a.ch||'')}</span></div>
  ${s.first?`<p class="ad">${esc(a.d||'')}</p>`:''}
  <div class="stop"><b>${esc(w.n)}</b>${w.s?`<span>${esc(w.s)}</span>`:''}</div>
  <div class="tb"><button data-tv="-1" aria-label="上一站">‹</button><button data-tp aria-label="${TVS.paused?'继续':'暂停'}">${TVS.paused?'▶':'❚❚'}</button><button data-tv="1" aria-label="下一站">›</button>
   <span class="dots">${ac.map((x,j)=>`<i class="${j===k?'on':j<k?'past':''}"></i>`).join('')}</span><span class="n">${TVS.i+1} / ${TOUR.length}</span><button data-tc aria-label="${TVS.card?'收起词条':'展开词条'}"${TVS.card?' class="on"':''}>${TVS.card?'收起':'词条'}</button><button data-tx aria-label="结束导览">×</button></div>
  <div class="bar"><i style="width:${(TVS.phase==='dwell'?Math.min(1,TVS.t/TVS.dwell):0)*100}%"></i></div>`;tourEl.classList.add('on')}
function tourTick(now){const dt=Math.min(.1,(now-TVS.last)/1000);TVS.last=now;if(!TVS.on){TVS.raf=0;return}TVS.raf=requestAnimationFrame(tourTick);
 // the card was closed with its own ×: back to the tour as it was
 if(TVS.card&&!cap.classList.contains('on'))tourCard(false);
 if(TVS.paused)return;
 if(TVS.phase==='fly'){if(!busy&&!tw){TVS.t+=dt;if(TVS.t>.6){TVS.phase='dwell';TVS.t=0}}return}
 if(TVS.phase==='dwell'){TVS.t+=dt;if(!drag&&!pinch&&!(CUR.follow))rig.head+=dt*.035;const b=tourEl.querySelector('.bar i');if(b)b.style.width=Math.min(100,TVS.t/TVS.dwell*100)+'%';
  if(TVS.t>=TVS.dwell){if(TVS.i>=TOUR.length-1){tourStop();toast('导览结束','从单细胞到两个虚空的碰撞。');return}TVS.i++;tourGo()}}}
tourEl.addEventListener('click',e=>{const v=e.target.closest('[data-tv]');if(v){TVS.i=clamp(TVS.i+ +v.dataset.tv,0,TOUR.length-1);TVS.paused=false;tourGo();return}
 if(e.target.closest('[data-tp]')){TVS.paused=!TVS.paused;TVS.cardP=false;tourDraw();return}if(e.target.closest('[data-tx]')){tourStop();return}
 if(e.target.closest('[data-tc]')){tourCard(!TVS.card);return}});
// taking the controls pauses the tour; the card comes back while paused
canvas.addEventListener('pointerdown',()=>{if(TVS.on&&!TVS.paused&&TVS.phase==='dwell'){TVS.paused=true;tourDraw()}});
addEventListener('keydown',e=>{if(!TVS.on||e.target.closest&&e.target.closest('input,textarea'))return;if(e.code==='Space'){e.preventDefault();TVS.paused=!TVS.paused;TVS.cardP=false;tourDraw()}else if(e.key==='Escape'){tourStop()}
 else if(e.key==='PageDown'||(e.key==='ArrowRight'&&e.shiftKey)){TVS.i=Math.min(TOUR.length-1,TVS.i+1);tourGo()}else if(e.key==='PageUp'||(e.key==='ArrowLeft'&&e.shiftKey)){TVS.i=Math.max(0,TVS.i-1);tourGo()}},true);
swipeable(tourEl,d=>{TVS.i=clamp(TVS.i+d,0,TOUR.length-1);TVS.paused=false;tourGo()});
Object.assign(window.__rq,{tourStart,tourStop,TVS,TOUR,entShape:id=>{const b=entBody(W[id],CUR);return b&&b.root}});
