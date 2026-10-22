/* ================================================================
   easter eggs: each one is found by a small playful action in the world, never by opening a card.
   - egz_choose(p) is called from choose() for every touch of a marker: click counters, toggles, conditions
   - a few tiny additions to the worlds, hung on a space right after it is built (see egz_built)
   - a slow watcher for the "be somewhere" eggs (zoom to a spot, stay still, visit every world)
   every top-level name here starts with egz_ (all sources share one scope)
   ================================================================ */
const egz_C={},egz_pend=new Set();let egz_pt='mouse',egz_shk=0,egz_maoT=0,egz_cry=null;
// a run of clicks on the same thing: the count starts again after a few seconds without one
function egz_cnt(k,ms){const now=performance.now();let c=egz_C[k];if(!c||now-c.t>(ms||4000))c=egz_C[k]={n:0};c.n++;c.t=now;return c.n}
function egz_reset(k){delete egz_C[k]}
// a custom toast is showing: the egg's own toast follows it a moment later, instead of being overwritten by it
function egz_late(id,ms){if(found.has(id)||egz_pend.has(id))return;egz_pend.add(id);setTimeout(()=>{egz_pend.delete(id);egg(id)},ms||2600)}
const egz_BRAIN6=['“电影放完了，大家还在发呆，我已经在天地间翻滚。”','“飞跃，翻滚，再重击！”'];
const egz_YAO=['“树不会咬杀，它只会打杀。”','“那就先砸烂，再咬杀。”','“世上的东西只有两种：能咬杀的，和不能咬杀的。”'];
const egz_HELLO=['“你好呀！”“很好哦。”','“今天天气真好。”“好舒服。”','“过得舒服吗？”“舒服极了。”'];
const egz_ROAR=['“吼——！”','“吼吼吼——！！”','“蒙特祖玛！翻滚着出来！”'];
const egz_VINE=['往上爬了一段……藤蔓还在往云里伸。','云层就在头顶了……','快到顶了……'];
let egz_yi=0,egz_hi=0,egz_ri=0;
addEventListener('pointerdown',e=>{egz_pt=e.pointerType||'mouse'},{capture:true,passive:true});

/* ---------- touches ---------- */
function egz_choose(p){const w=p.w,id=w.id,sp=CUR;if(!sp)return false;const pl=sp.id;
 // 毛玉 sink into the salt when looked at; a finger cannot hover, so a tap does the same
 if(p.mao&&(NOHOVER||egz_pt!=='mouse')){maoyuHover=true;clearTimeout(egz_maoT);egz_maoT=setTimeout(()=>{maoyuHover=false},2600);if(!found.has('maoyu'))setTimeout(()=>egg('maoyu'),380)}
 if(pl==='rongqiu'){
  if(id==='lvtan_beast'){if(egz_cnt('lev')===3)egg('lev')}
  else if(id==='shawurm'){if(egz_cnt('train')===3)egg('train')}
  else if(id==='jiaozhang'){if(egz_cnt('wanted')===3)egg('wanted')}
  else if(id==='longqimu'){if(dirLL(-4,-86).dot(sp.sunDir)<-.05)egg('soul')}
  else if(id==='rongqiu_form'){const c=proxCenter(p);if(c&&c.clone().normalize().dot(sp.sunDir)<-.05)egg('fluff')}
  else if(id==='crystalcave'){egz_late('art',1500)}
  else if(id==='zaonao'){egz_yao()}
  else if(id==='inca'&&ERA===2){const n=egz_cnt('si');if(n<3)toast('印加虫群','死！');else if(n===3)egg('si')}
  else if(id==='shenshabus'&&(ERA===2||ERA===3)){if(egz_cnt('bus')===3)egg('bus')}
  else if(id==='inca_pit'&&ERA===4&&sp.moonT){egz_streak(sp,proxCenter(p));hint('一枚弹头拖着光，从巨坑里冲向月……',3000);egz_late('landing',2800)}
  else if(id==='rq_xuewu'&&ERA===8){egz_crystal(sp,proxCenter(p))}
  else if(id==='baoxiao'&&ERA>=3&&ERA<=5){egz_shk=1;const n=egz_cnt('roar',3500);toast('爆哮虫',egz_ROAR[egz_ri++%egz_ROAR.length]);if(n===5)egz_late('roar',1400)}
  else if(id==='creator'&&ERA===3){if(found.has('brain'))egg('dichun')}
  else if(id==='c_maya'&&ERA>=6){const L=BRAIN.concat(egz_BRAIN6);toast('玛雅',L[brainI++%L.length])}}
 else if(pl==='void'){
  if(id==='v_huijin'){egz_yao()}
  else if(id==='v_vine'){const o=sp.ents&&sp.ents.v_vine;if(!o)return false;
   // climbing the beanstalk: every touch takes you a quarter further up, the fourth reaches the top
   const k=Math.min(4,egz_cnt('vine',20000)),c=o.position,h=(w.kp&&w.kp.len)||520;open(id);flyTo(-c.z,c.x,150,1.5,c.y-h/2+k*h/4);
   if(k<4)hint(egz_VINE[k-1],2400);else{egz_reset('vine');egz_late('zanke',1700)}return true}
  else if(id==='ex_birds'){if(found.has('bbq'))egg('goose')}
  else if(id==='v_feng'){const n=egz_cnt('push',6000);if(n<9)hint(`${n} 号凤凰选手冲了上去——推不动。`,2200);else if(n===9)egg('push')}
  else if(id==='v_phoenix'&&p.egzPlat){const n=egz_cnt('vote',8000);if(n<7)hint(`第 ${n} 票`,1800);else if(n===7)egg('vote')}}
 else if(pl==='erxi'){
  if(id==='ex_tiangong'){const n=egz_cnt('veronica');toast('天宫学院','“维罗尼卡同学？”');if(n===5)egz_late('veronica',1500)}}
 else if(pl==='dream'){
  if(id==='dr_manzhu'){const t=egz_garden(sp);if(t){const n=egz_cnt('manzhu',12000);hint(t.flowers?'叶子落了，花又开了。':'花谢了，叶子长了出来。',2400);if(n===2)egz_late('manzhu',1500)}}
  else if(id==='dr_sweet'){const n=egz_cnt('salty',1600);if(n===1)hint('甜点机咕噜了一声……',1600);else if(n===2)egg('salty')}
  else if(id==='dr_mengli'&&p.egzShip){egg('faith')}
  else if(id==='dr_tako'){if(found.has('fluff')||found.has('snowfluff'))egg('tako2')}}
 else if(pl==='buke'){
  if(id==='bk_caiyun'){const n=egz_cnt('weather');toast('彩云',egz_HELLO[egz_hi++%egz_HELLO.length]);if(n===3)egz_late('weather',2200)}
  else if(id==='bk_room'){if(found.has('sarin'))egg('sarin2');else hint('观星室里好像在等谁。先去见见最初的那道金光。',3200)}}
 return false}
function egz_yao(){const n=egz_cnt('yaosha');toast('造脑怪',egz_YAO[egz_yi++%egz_YAO.length]);if(n===3)egz_late('yaosha',2200)}

/* ---------- small things added to the worlds ---------- */
const egz_v=V3(),egz_v2=V3();
const egz_gs0=getSpace;getSpace=function(id){const had=!!SP[id];const sp=egz_gs0(id);if(!had)try{egz_built(sp)}catch(e){console.warn('eggs',id,e)}return sp};
function egz_built(sp){if(sp.id==='rongqiu')egz_rongqiu(sp);else if(sp.id==='void')egz_void(sp);else if(sp.id==='dream')egz_dream(sp)}
function egz_spr(col,s,op){const g=glowSprite(col,s,op);g.userData.noBatch=1;return g}
function egz_rongqiu(sp){
 // the camera shudders when 爆哮虫 roars
 anim(sp,null,(t,dt)=>{if(egz_shk<=0)return;egz_shk=Math.max(0,egz_shk-dt*2.2);const a=egz_shk*egz_shk*clamp(rig.alt*.012,.25,6);camera.position.add(egz_v.set(Math.random()-.5,Math.random()-.5,Math.random()-.5).multiplyScalar(a));camera.updateMatrixWorld()});
 // the great cold: an old dragon's hut at the edge of the broken dragonroost woods, a fire at the door and a snowball with fur
 let la=-7.6,lo=-84.6;for(let rr=0;rr<=3;rr+=.25){let ok=false;for(let k=0;k<12;k++){const a=k/12*6.283,l2=-7.6+Math.cos(a)*rr,o2=-84.6+Math.sin(a)*rr;if(sp.gh(l2,o2)>2.2){la=l2;lo=o2;ok=true;break}}if(ok)break}
 const hut=new THREE.Group();const wood=M('#6a4a32',{roughness:.95}),snow=M('#f2f6fa',{roughness:1});
 const body=new THREE.Mesh(new THREE.BoxGeometry(3.2,2.2,2.8),wood);body.position.y=1.1;hut.add(body);
 const roof=new THREE.Mesh(new THREE.ConeGeometry(2.7,1.7,4),snow);roof.position.y=3.05;roof.rotation.y=Math.PI/4;hut.add(roof);
 const door=new THREE.Mesh(new THREE.PlaneGeometry(.9,1.4),new THREE.MeshBasicMaterial({color:'#ffb060'}));door.position.set(0,.72,1.41);hut.add(door);
 const fire=egz_spr('#ffa040',4.5,.8);fire.position.set(.9,.5,2.2);hut.add(fire);
 const fl=bFluff({w:'rq_piaoliu'});fl.scale.setScalar(.42);fl.position.set(-.9,.42,2.2);hut.add(fl);
 const heap=new THREE.Mesh(new THREE.SphereGeometry(.7,10,6),snow);heap.scale.set(1,.3,1);heap.position.set(-.9,0,2.2);hut.add(heap);
 frameLL(sp,la,lo,0,2.2,hut);sp.scene.add(hut);hut.updateWorldMatrix(false,true);
 const fp=fl.getWorldPosition(V3()),hp=hut.position.clone();hut.visible=false;
 anim(sp,null,t=>{const on=ERA===4&&camera.position.distanceTo(hp)<320;hut.visible=on;if(on){fire.material.opacity=.6+.25*Math.sin(t*9)*Math.sin(t*5.3);fl.userData.anim(t)}});
 prox(sp,'tako',fp,1.6,{e:[4],only:1,hide:()=>!hut.visible,click:()=>egg('snowfluff')})}
// a finished animation leaves the list after the frame (the loop over the list must not shrink under it)
function egz_drop(sp,a){a.f=()=>{};setTimeout(()=>{const j=sp.anims.indexOf(a);if(j>=0)sp.anims.splice(j,1)},0)}
// a shell from the pit races up toward the moon
function egz_streak(sp,from){if(!from)return;const g=new THREE.Group();const S=[];for(let i=0;i<7;i++){const s=egz_spr(i?'#ffd890':'#ffffff',i?9-i:12,i?.6-i*.07:.95);g.add(s);S.push(s)}sp.scene.add(g);
 const to=sp.moon?sp.moon.position.clone():from.clone().multiplyScalar(3);const t0=T;const P=[];
 const a={o:null,f:()=>{const k=Math.min(1,(T-t0)/3.2),e=k*k*(3-2*k)*.85+k*.15;egz_v2.copy(from).lerp(to,e*e);P.unshift(egz_v2.clone());if(P.length>14)P.length=14;S.forEach((s,i)=>{s.position.copy(P[Math.min(P.length-1,i*2)]);s.material.opacity*=k>.85?.9:1});
  if(k>=1){sp.scene.remove(g);egz_drop(sp,a)}}};sp.anims.push(a)}
// 血雾大师's prize: a red crystal that floats up out of reach; touch it to catch it
function egz_crystal(sp,c){if(!c||egz_cry)return;const up=c.clone().normalize();const g=new THREE.Group();const m=new THREE.Mesh(new THREE.OctahedronGeometry(1,0),new THREE.MeshStandardMaterial({color:'#ff3a3a',emissive:'#c01010',emissiveIntensity:.8,roughness:.25,metalness:.2}));m.scale.set(.8,1.3,.8);g.add(m);g.add(egz_spr('#ff5a4a',7,.7));
 const base=c.clone().addScaledVector(up,2.5);g.position.copy(base);sp.scene.add(g);const o={g,t0:T,got:0};egz_cry=o;hint('一颗红结晶从奖坑里飘了起来，越飘越高……',2800);
 const px0=prox(sp,'rq_xuewu',()=>g.position,2.6,{only:1,hide:()=>o.got||o.done,click:()=>{if(o.got)return;o.got=T;egg('shell')}});
 const a={o:null,f:()=>{const age=T-o.t0;let h=2.5+14*sm(0,6,age)+Math.sin(age*1.6)*.6;if(o.got)h+=(T-o.got)*(T-o.got)*14;g.position.copy(base).addScaledVector(up,h-2.5);m.rotation.y=age*1.4;
  if((o.got&&T-o.got>1.6)||age>45){o.done=1;sp.scene.remove(g);egz_drop(sp,a);const q=sp.prox.indexOf(px0);if(q>=0)sp.prox.splice(q,1);egz_cry=null}}};sp.anims.push(a)}
function egz_void(sp){const E=sp.ents||{};
 // the shadow at the end shrinks as you come near, down to the size of a fluffball
 const sh=E.v_wufa;if(sh){const c=sh.position.clone();anim(sp,null,()=>{const d=camera.position.distanceTo(c);sh.scale.setScalar(.08+.92*sm(60,420,d));if(d<110&&!found.has('shadow'))egg('shadow')})}
 // while climbing the vine, the stretch in front of you can be touched too (the vine's own marker sits at its middle)
 const vn=E.v_vine;if(vn){const c=vn.position,h=(W.v_vine.kp||{}).len||520,v=V3();prox(sp,'v_vine',()=>v.set(c.x,clamp(rig.y,c.y-h/2,c.y+h/2),c.z),24,{egzVine:1,maxD:3000})}
 // the platforms round the phoenix star can be touched one by one
 const ph=E.v_phoenix;if(ph){const g=ph.children[0];g.children.filter(c=>c.isGroup&&c.children.length===7).forEach(pl=>{const v=V3();prox(sp,'v_phoenix',()=>g.localToWorld(v.copy(pl.position)),16,{egzPlat:1,maxD:4000})})}}
function egz_dream(sp){const E=sp.ents||{};
 // the sailboats on the mud sea
 const ml=E.dr_mengli;if(ml){const g=ml.children[0];g.children.filter(c=>c.isMesh&&c.geometry&&c.geometry.type==='PlaneGeometry'&&c.material&&c.material.color&&c.material.color.getHexString()==='e8dcc0').forEach(s=>{const v=V3();prox(sp,'dr_mengli',()=>g.localToWorld(v.copy(s.position)),11,{egzShip:1,maxD:4000})})}
 // the spider lilies of the garden (one merged mesh from dreamDeco), and the leaves that take their turn
 const mz=E.dr_manzhu;if(mz){const g=mz.children[0],r=((W.dr_manzhu.kp||{}).r)||44,Rn=rnd(4646),n=90;
  let fm=g.children.find(c=>c.isMesh&&c.material&&c.material.vertexColors);
  if(!fm){fm=new THREE.InstancedMesh(new THREE.SphereGeometry(.5,6,4),M('#d8203a',{emissive:'#801018',emissiveIntensity:.45}),n);const o=new THREE.Object3D();for(let i=0;i<n;i++){const a=Rn()*6.28,d=Math.sqrt(Rn())*r*.8;o.position.set(Math.cos(a)*d,r*.06+.8,Math.sin(a)*d);o.scale.setScalar(1.4);o.updateMatrix();fm.setMatrixAt(i,o.matrix)}fm.frustumCulled=false;g.add(fm)}
  const lm=new THREE.InstancedMesh(new THREE.ConeGeometry(.25,2.2,3),M('#62b04c',{roughness:.7,emissive:'#1f4a16',emissiveIntensity:.6}),n);const o=new THREE.Object3D();
  for(let i=0;i<n;i++){const a=Rn()*6.28,d=r*.05+r*.8*Math.sqrt(Rn()),s=1.3+Rn()*1.2;o.position.set(Math.cos(a)*d,r*.06+s*.8,Math.sin(a)*d);o.rotation.set((Rn()-.5)*.9,Rn()*3,(Rn()-.5)*.9);o.scale.set(s,s,s*.35);o.updateMatrix();lm.setMatrixAt(i,o.matrix)}
  lm.frustumCulled=false;lm.visible=false;g.add(lm);sp.egzGarden={fm,lm,flowers:true}}}
function egz_garden(sp){const G=sp.egzGarden;if(!G)return null;G.flowers=!G.flowers;G.fm.visible=G.flowers;G.lm.visible=!G.flowers;return G}

/* ---------- being somewhere ---------- */
const egz_SAR=dirLL(-2,46),egz_ALL=MAPL.map(m=>m.id);const egz_seenSp=new Set(store.get('rq_egz_sp',[]));
setInterval(()=>{if(!CUR||busy||document.hidden)return;const sp=CUR;
 if(!egz_seenSp.has(sp.id)){egz_seenSp.add(sp.id);store.set('rq_egz_sp',[...egz_seenSp]);if(egz_ALL.every(id=>egz_seenSp.has(id)))setTimeout(()=>egg('corner'),3200)}
 if(sp.id!=='rongqiu')return;
 // at sea level, at the foot of the golden beam
 if(ERA===1&&!found.has('sarin')&&rig.alt<60&&angDeg(dirLL(rig.a,rig.b,egz_v),egz_SAR)<1.1)egg('sarin');
 // right inside 苏苏米's palace
 if(ERA===3&&!found.has('emerald')){const p=sp.prox.find(q=>q.w.id==='emeraldcity');if(p&&camera.position.distanceTo(p.pos)<34)egg('emerald')}
 // as far out as you can go, the moon close, and nothing touched for a while: looking back at home
 if(ERA===4&&!found.has('name')&&sp.moonK>.7&&!tw&&rig.alt>altMax()*.96&&performance.now()-lastInput>6000)egg('name')},250);

/* ---------- words and stories ---------- */
// the password, said in the library's search box
setTimeout(()=>{const q=$('#q');if(q)q.addEventListener('input',()=>{if(q.value.replace(/[\s，。！？、,.!?~～…“”"'‘’：:;；·—-]/g,'')==='天空是有顶的')egg('tianding')})},0);
// both fried-egg side stories read
const egz_os0=openSide;openSide=function(id){egz_os0(id);if((id==='sd_fizz'||id==='sd_eggseller')&&sideFound.has('sd_fizz')&&sideFound.has('sd_eggseller'))egz_late('egg',2200)};
