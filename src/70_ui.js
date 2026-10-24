/* ================================================================
   interface: names under the cursor, a story when touched, a hairline of time, a book in the corner.
   moving: drag the ground, wheel toward what you look at; pull back far enough and you leave a world, lean into one and you enter it.
   ================================================================ */
const ERAN=Object.fromEntries(ERAS.map(e=>[e.id,e.n]));
const ARCGO=['origin','ev_ext1','icesea','landing','naodai','ev_war','canyon','fungus','emeraldcity','creator','ev_snow','cloudsea'];
const BRAIN=['“琳，没有威胁。”','“翻滚，逃跑。”','“身体疲倦，需要休息。”','“快去翻滚着睡觉，愚钝的小东西。”','“天空，水。”','“族群通道：前方三米，蕨类下面的地里。”'];let brainI=0;
{const st=document.createElement('style');st.textContent=`#labels{position:fixed;inset:0;pointer-events:none;z-index:2}
#labels .lab{position:absolute;left:0;top:0;white-space:nowrap;pointer-events:auto;cursor:pointer;font-family:var(--f-d);font-size:13px;letter-spacing:.34em;color:rgba(233,240,234,.66);text-shadow:0 0 8px rgba(0,0,0,.95),0 0 2px #000,0 1px 1px #000;transition:opacity .5s,color .3s;opacity:0}
#labels .lab.on{opacity:1}#labels .lab:hover{color:var(--gold)}
#hint{position:fixed;left:50%;bottom:calc(env(safe-area-inset-bottom,0px) + 52px);transform:translateX(-50%);z-index:5;font-size:12px;letter-spacing:.14em;color:var(--faint);pointer-events:none;opacity:0;transition:opacity .6s;white-space:normal;text-align:center;max-width:88vw;width:max-content;line-height:1.6;text-shadow:0 1px 6px #000}
#hint.on{opacity:1}`;document.head.appendChild(st)}
const labRoot=document.createElement('div');labRoot.id='labels';document.body.appendChild(labRoot);
const hintEl=document.createElement('div');hintEl.id='hint';document.body.appendChild(hintEl);

/* ---------- small helpers ---------- */
function placeName(w){const m=mapOf(w);const mn=MB[m].n;let r='';if(w.ng)r='凝固虚空';else if(m==='void'&&w.sec)r=SECTORS[w.sec].n.split(' · ')[0];else if(RN[w.r])r=RN[w.r];return r&&r!==mn?`${mn} · ${r}`:mn}
function bestEra(w,mapId){const me=MB[mapId].e;let L=(w.e||[]).filter(e=>me.includes(e));if(!L.length)return null;
 // a creature that lives as a herd: arrive in an age when the herd is actually there
 {const F=(window.FAUNA||[]).filter(f=>f.w===w.id&&(f.m||'rongqiu')===mapId);if(F.length){const L2=L.filter(e=>F.some(f=>!f.e||f.e.includes(e)));if(L2.length)L=L2}}if(L.includes(ERA))return ERA;return L.reduce((a,b)=>Math.abs(b-ERA)<Math.abs(a-ERA)?b:a)}
function isVis(o){let p=o;while(p){if(p.visible===false)return false;p=p.parent}return true}
let tT=0;function toast(t,s){const el=$('#toast');el.innerHTML=(t?`<b>${t}</b>`:'')+(s||'');el.classList.add('on');clearTimeout(tT);tT=setTimeout(()=>el.classList.remove('on'),5200)}
function egg(id,silent){const g=EGGS.find(e=>e.id===id);if(!g)return;const n=!found.has(id);if(n){found.add(id);store.set('rq_eggs',[...found]);$('#book').classList.add('new');if(libTab==='egg'&&$('#lib').classList.contains('on'))renderLib()}if(!silent&&(n||g.t))toast((n?'彩蛋 · ':'')+g.n,g.t)}
function markSeen(id){if(!seen.has(id)){seen.add(id);store.set('rq_seen',[...seen])}}
let titleT=0;function showTitle(a,b,ms){const el=$('#title');el.querySelector('b').textContent=a;el.querySelector('span').textContent=b||'';el.classList.add('on');clearTimeout(titleT);titleT=setTimeout(()=>el.classList.remove('on'),ms||4200)}
let hintT=0;function hint(s,ms){hintEl.textContent=s;hintEl.classList.add('on');clearTimeout(hintT);hintT=setTimeout(()=>hintEl.classList.remove('on'),ms||2600)}

/* ---------- moving between spaces ---------- */
let busy=false,fadeK=0,fadeTo=0;
function spaceTitle(sp){const m=MB[sp.id];return[m.n,`${m.sub} · ${ERAN[ERA]}`]}
let pendEnter=null;
function enterSpace(id,opt){opt=opt||{};if(busy){pendEnter=[id,opt];pendGo=null;return}if(CUR&&CUR.camOv)CUR.camOv=null;const m=MB[id];if(!m)return;busy=true;fadeTo=1;closeCap(true);
 const go=()=>{const first=!SP[id];const run=()=>{const sp=getSpace(id);if(CUR&&CUR!==sp)CUR.saved={...rig,era:ERA};const prev=CUR;CUR=sp;if(renderPass)renderPass.scene=sp.scene;sp.scene.add(selRing);
   tw=null;vel.a=vel.b=0;
   // a space you have been to before comes back in the age you left it in; only a first visit takes the nearest age to the current one
   if(!opt.era&&!opt.home&&sp.saved&&sp.saved.era&&eraListFor(sp).includes(sp.saved.era))opt.era=sp.saved.era;
   const want=opt.era&&eraListFor(sp).includes(opt.era)?opt.era:null;
   // a remembered spot is only reused when it belongs to the era we are arriving in
   let s=opt.rig||(sp.saved&&!opt.home&&(sp.type==='planet'||!want||sp.saved.era===want)?sp.saved:(sp.type!=='planet'&&want?eraSpot(sp,want):homeFor(sp,want||ERA)));Object.assign(rig,{a:s.a,b:s.b,alt:s.alt,head:s.head||0,y:s.y||0});
   if(sp.type==='planet'){if(opt.portal&&sp.saved&&sp.saved.era)opt.era=sp.saved.era;ERA=opt.era&&MB[id].e.includes(opt.era)?opt.era:clampEra(sp,ERA);store.set('rq_era',ERA);applyPlanetEra(sp,ERA)}else if(opt.era&&eraListFor(sp).includes(opt.era)){ERA=opt.era}
   // arriving for an entry: its exact framing can only be worked out once the world is built
   if(opt.rigFn){let s2=null;try{s2=opt.rigFn()}catch(e){console.warn('rigFn',e)}if(s2)Object.assign(rig,{a:s2.a,b:s2.b,alt:s2.alt,head:s2.head||0,y:s2.y||0})}
   if(sp.type!=='planet'){rigPose();const e=sp.eraAt?sp.eraAt(S_):null;if(e&&!(opt.era&&eraListFor(sp).includes(opt.era)))ERA=e}
   buildLabels(sp);buildTime();rigPose();pushOut=0;
   document.body.classList.toggle('pale',!!MB[id].white);const[t1,t2]=spaceTitle(sp);setTimeout(()=>showTitle(t1,t2),350);
   MW_ALL=true;sp.scene.updateMatrixWorld();try{renderer.compile(sp.scene,camera)}catch(e){}if(first&&window.__bvhIdle)setTimeout(()=>window.__bvhIdle(sp.scene),1500);
   fadeTo=0;busy=false;requestAnimationFrame(()=>$('#load').classList.add('done'));
   // a newer request came in while this one was loading: that one wins, this one's follow-up is dropped
   if(pendGo){const g=pendGo;pendGo=null;pendEnter=null;setTimeout(()=>goLater(g),60);return}
   if(pendEnter){const [i2,o2]=pendEnter;pendEnter=null;setTimeout(()=>enterSpace(i2,o2),60);return}if(opt.after)setTimeout(opt.after,250)};
  if(first&&id!=='rongqiu'){$('#load').classList.remove('done');$('#load p').textContent=`正在前往「${m.n}」`;setTimeout(run,60)}else run()};
 if(!CUR)go();else setTimeout(go,SP[id]?380:480)}
function exitToVoid(){const sp=CUR;const pid=PORTAL[sp.id];if(!pid)return;const w=W[pid];const p=posOf(w);const s=sizeOf(w);
 enterSpace('void',{rig:{a:-p.z-s*2.2,b:p.x,alt:Math.max(260,s*7.5),head:0,y:p.y},era:ERA})}
function enterPortal(w){const id=w.go;enterSpace(id,{era:ERA,portal:1})}

/* ---------- labels for continents and star-regions ---------- */
let labs=[];
function buildLabels(sp){labRoot.innerHTML='';labs=[];sp.labels.forEach(L=>{if(!L.pos)return;const el=document.createElement('div');el.className='lab';el.textContent=L.n;labRoot.appendChild(el);
 el.onclick=()=>{if(L.id&&W[L.id]){go(L.id)}else if(L.sector||L.era){const c=L.pos;flyTo(-c.z,c.x,1600,2,clamp(c.y-340,-200,200))}};labs.push({L,el})})}
const _pj=V3();
const _labCam=new THREE.Vector3();
/* labels follow their spot on screen; the page is only touched when a label moves by a pixel or turns on or off */
function updateLabels(){const Wd=innerWidth,Hd=innerHeight;const camR=camera.position.length();_labCam.copy(camera.position).normalize();for(const x of labs){const L=x.L;let on=rig.alt>L.minAlt&&(!L.e||L.e.includes(ERA));
 if(on&&CUR.type==='planet'){_pj.copy(L.pos).normalize();if(_pj.dot(_labCam)<R/camR+.05)on=false}
 if(on){_pj.copy(L.pos).project(camera);if(_pj.z>1||Math.abs(_pj.x)>1.1||Math.abs(_pj.y)>1.1)on=false;else{const tx=Math.round((_pj.x*.5+.5)*Wd),ty=Math.round((-_pj.y*.5+.5)*Hd);if(tx!==x.tx||ty!==x.ty){x.tx=tx;x.ty=ty;x.el.style.transform=`translate(${tx}px,${ty}px) translate(-50%,-50%)`}}}
 if(on!==x.on){x.on=on;x.el.classList.toggle('on',on);x.el.style.pointerEvents=on?'auto':'none'}}}

/* ---------- the hairline of time ---------- */
function eraListFor(sp){return MB[sp.id].e}
function buildTime(){const L=eraListFor(CUR);const tr=$('#time .track');tr.innerHTML='';$('#time').classList.toggle('off',L.length<2);
 L.forEach((e,i)=>{const b=document.createElement('button');b.className='tk'+(e===6&&i>0?' vol':'');b.dataset.e=e;b.style.left=(L.length===1?50:i/(L.length-1)*100)+'%';b.innerHTML=`<span>${ERAN[e]}</span>`;b.setAttribute('aria-label',ERAN[e]);b.title=EB[e].ch;tr.appendChild(b)});
 syncTime()}
function syncTime(){$('#time .cur').textContent=ERAN[ERA]||'';[...$('#time .track').children].forEach(b=>b.classList.toggle('on',+b.dataset.e===ERA))}
$('#time .track').addEventListener('click',e=>{const b=e.target.closest('.tk');if(!b)return;timeTo(+b.dataset.e)});
function timeTo(e){const ok=MB[CUR.id]&&MB[CUR.id].e;if(ok&&ok.length&&!ok.includes(e))e=ok.reduce((b,x)=>Math.abs(x-e)<Math.abs(b-e)?x:b,ok[0]);if(CUR.type==='planet'){if(e===ERA)return;setEra(e)}else{ERA=e;syncTime();const tgt=eraSpot(CUR,e);if(tgt)flyTo(tgt.a,tgt.b,tgt.alt,2.4,tgt.y)}}
function eraSpot(sp,e){if(sp.id==='void'){const c=e===10&&false?NG_C:SECTORS[e].c;return{a:-c[2],b:c[0],alt:2200,y:0}}const h=homeFor(sp,e);
 // in a tube, stand at the middle of that era's stretch so the era indicator agrees with where you are
 if(sp.type==='tube'){const ok=MB[sp.id].e;const L=WIKI.filter(w=>mapOf(w)===sp.id&&(w.e.find(x=>ok.includes(x))||w.e[0])===e);if(L.length)h.a=L.reduce((s,w)=>s+(w.z||0),0)/L.length}
 return h}
function setEra(e){cutNow();if(CUR.type!=='planet'){ERA=e;syncTime();return}ERA=e;store.set('rq_era',e);applyPlanetEra(CUR,e);syncTime();showTitle(MB[CUR.id].n,`${EB[e].n} · ${EB[e].ch}`,3600);if(sel&&!eraOk(W[sel].e))closeCap()}

/* ---------- the story card ---------- */
let sel=null,selP=null;const cap=$('#cap');
function open(id){const w=W[id];if(!w)return;sel=id;delete cap.dataset.side;markSeen(id);
 const E=w.e||[];const eras=E.length>3?`${ERAN[E[0]]} — ${ERAN[E[E.length-1]]}`:E.map(e=>ERAN[e]).join(' · ');const here=mapOf(w)===CUR.id;
 const relA=r=>`<a data-rel="${r}">${W[r].n}${mapOf(W[r])!==mapOf(w)?`<i>${MB[mapOf(W[r])].n}</i>`:''}</a>`;const R0=(w.rel||[]).filter(r=>W[r]);
 const R1=((window.__RELX||{})[id]||[]).filter(r=>!R0.includes(r)&&r!==id).slice(0,8);
 const rel=R0.map(relA).join('')+(R1.length?`${R1.map(relA).join('')}`:'');
 const goL=w.go&&MB[w.go]?`<a class="go" data-go="${w.go}">进入「${MB[w.go].n}」 →</a>`:'';
 const away=!(here&&(CUR.type!=='planet'||eraOk(w.e)));const goT=away&&!goL?`<a class="go" data-goto="${id}">前往「${MB[mapOf(w)].n}」看看 →</a>`:'';
 cap.innerHTML=`<button class="x" aria-label="关闭">×</button><div class="eb ${CATK(w.c)}">${w.c} · ${placeName(w)}</div><h2>${w.n}</h2><p class="s">${w.s}</p>${w.d.split('\n').map(x=>`<p class="d">${x}</p>`).join('')}<div class="meta">${eras}</div>${chapHTML(id)}${rel?`<div class="sec">相关</div><div class="rel">${rel}</div>`:''}${sideHintHTML(id)}${goL}${goT}${cardNavHTML(id)}`;
 cap.classList.add('on');cap.scrollTop=0;
 selP=CUR.prox.find(p=>p.w.id===id&&!p.side&&(!p.hide||!p.hide()))||CUR.prox.find(p=>p.w.id===id&&!p.side&&eraOk(p.e))||null}
function closeCap(quiet){cap.classList.remove('on');sel=null;selP=null}
cap.addEventListener('click',e=>{if(e.target.closest('.x'))return closeCap();const sdh=e.target.closest('[data-sidehint]');if(sdh)return openSide(sdh.dataset.sidehint);const ch=e.target.closest('[data-ch]');if(ch)return openRd(+ch.dataset.ch,sel);const nv=e.target.closest('[data-nav]');if(nv)return cardStep(+nv.dataset.nav);const gt=e.target.closest('[data-goto]');if(gt)return go(gt.dataset.goto);const r=e.target.closest('[data-rel]');if(r)return go(r.dataset.rel);const g=e.target.closest('[data-go]');if(g){const w=W[sel];enterPortal(w)}});
/* after a jump, make sure the thing is actually in sight: if a wall, a tower or a trunk is in the way,
   or the camera would sit inside something, try going round it or a little higher */
const _crc=new THREE.Raycaster();
function cuttable(o,r){if(o.userData.noCut)return false;if(o.isInstancedMesh)return o.count>3;const g=o.geometry;if(!g)return false;if(!g.boundingSphere)g.computeBoundingSphere();const bs=g.boundingSphere;if(!bs)return false;const k=o.getWorldScale(_cs0).x;return bs.radius*k<Math.max(CUT.big?130:45,r*3)&&bs.center.length()<bs.radius*1.2}
const _cs0=new THREE.Vector3();
/* occluder list: only what is near the target, instanced sets cut down to their nearby instances.
   Raycasting the whole scene (every tree instance) 100+ times on arrival froze the page for most of a second. */
const _oiM=new THREE.Matrix4(),_oiW=new THREE.Matrix4(),_oiS=new THREE.Sphere(),_oiMesh=new THREE.Mesh(),_oiHits=[];
// world-space bounding spheres of every instance, kept until the instances move
function instCenters(o,g){const v=o.instanceMatrix.version,c=o.userData._ic;if(c&&c.v===v&&c.n===o.count&&c.w.equals(o.matrixWorld))return c.C;
 const C=new Float32Array(o.count*4);for(let i=0;i<o.count;i++){o.getMatrixAt(i,_oiM);_oiW.multiplyMatrices(o.matrixWorld,_oiM);_oiS.copy(g.boundingSphere).applyMatrix4(_oiW);C[i*4]=_oiS.center.x;C[i*4+1]=_oiS.center.y;C[i*4+2]=_oiS.center.z;C[i*4+3]=_oiS.radius}
 o.userData._ic={v,n:o.count,w:o.matrixWorld.clone(),C};return C}
function occList(P,R){const L=[];const sc=CUR.scene;
 sc.traverseVisible(o=>{if(!o.isMesh||!o.geometry)return;const m=Array.isArray(o.material)?o.material[0]:o.material;if(!m||m.transparent||m.depthWrite===false||m.blending===THREE.AdditiveBlending||m.visible===false)return;
  const g=o.geometry;if(!g.boundingSphere)g.computeBoundingSphere();if(!g.boundingSphere)return;
  if(o.isInstancedMesh){const idx=[];const C=instCenters(o,g);const n=Math.min(o.count,C.length>>2);for(let i=0;i<n;i++){const k=i*4,dx=C[k]-P.x,dy=C[k+1]-P.y,dz=C[k+2]-P.z,rr=R+C[k+3];if(dx*dx+dy*dy+dz*dz<rr*rr)idx.push(i)}
   if(idx.length)L.push({isMesh:true,layers:o.layers,src:o,material:o.material,raycast(rc,out){const mw=o.matrixWorld;_oiMesh.geometry=o.geometry;_oiMesh.material=o.material;const ro=rc.ray.origin,rd=rc.ray.direction,far=rc.far;for(const i of idx){const k=i*4,ex=C[k]-ro.x,ey=C[k+1]-ro.y,ez=C[k+2]-ro.z,rr=C[k+3];let t=ex*rd.x+ey*rd.y+ez*rd.z;if(t<-rr||t>far+rr)continue;t=Math.max(0,Math.min(far,t));const qx=ex-rd.x*t,qy=ey-rd.y*t,qz=ez-rd.z*t;if(qx*qx+qy*qy+qz*qz>rr*rr)continue;o.getMatrixAt(i,_oiM);_oiMesh.matrixWorld.multiplyMatrices(mw,_oiM);_oiHits.length=0;_oiMesh.raycast(rc,_oiHits);for(const h of _oiHits){h.instanceId=i;h.object=o;out.push(h)}}}});return}
  _oiS.copy(g.boundingSphere).applyMatrix4(o.matrixWorld);if(o.userData.terr||_oiS.radius>R*4||_oiS.center.distanceTo(P)<R+_oiS.radius){if(_oiS.radius>R*4)L.push(o);else{const cx=_oiS.center.x,cy=_oiS.center.y,cz=_oiS.center.z,rr=_oiS.radius;L.push({isMesh:true,layers:o.layers,src:o,material:o.material,raycast(rc,out){const ro=rc.ray.origin,rd=rc.ray.direction,ex=cx-ro.x,ey=cy-ro.y,ez=cz-ro.z;let t=ex*rd.x+ey*rd.y+ez*rd.z;if(t<-rr||t>rc.far+rr)return;t=Math.max(0,Math.min(rc.far,t));const qx=ex-rd.x*t,qy=ey-rd.y*t,qz=ez-rd.z*t;if(qx*qx+qy*qy+qz*qz>rr*rr)return;o.raycast(rc,out)}})}}});
 return L}
// a line-of-sight test over the whole world: only shown, solid meshes are tried (the callers skip everything else anyway)
const _vcS=[];function visCast(rc,root){const out=[];const st=_vcS;st.length=0;st.push(root);while(st.length){const o=st.pop();if(!o.visible)continue;
  if(o.isMesh&&o.geometry){const m=Array.isArray(o.material)?o.material[0]:o.material;if(m&&!m.transparent&&m.depthWrite!==false&&m.blending!==THREE.AdditiveBlending&&m.visible!==false&&o.layers.test(rc.layers))o.raycast(rc,out)}
  const ch=o.children;for(let i=0;i<ch.length;i++)st.push(ch[i])}
 out.sort((a,b)=>a.distance-b.distance);return out}
function occCast(L){return L?_crc.intersectObjects(L,false):visCast(_crc,CUR.scene)}

/* after a jump, make sure the thing is actually in sight (the search itself lives in 49o_nav.js: q4c_goto / q4c_clear).
   a bare point (a side story's spot) keeps the height of the flight under way and only turns or rises if something is in the way */
function ensureClear(id,F){if(CUR.camOv)return;if(!id&&F&&F.P){q4c_gotoPoint(F.P,F.r||10);return}if(!id)return;
 if(q4c_last.id===id&&performance.now()-q4c_last.t<800)return;q4c_goto(id,F&&F.p||null)}
/* cutaway: canopy, spires or huts still standing between the camera and a small thing sink into the ground
   while its card is open, and grow back when it closes */
const CUT={L:[],s:0,goal:0,req:null,sp:null,off:true};const _cn=new THREE.Vector3(),_cn2=new THREE.Vector3();const _cm=new THREE.Matrix4(),_cp=new THREE.Vector3(),_cq=new THREE.Quaternion(),_cs=new THREE.Vector3();
function cutSet(c,k){k=Math.max(.001,k);if(c.im){c.m0.decompose(_cp,_cq,_cs);_cs.multiplyScalar(k);_cm.compose(_cp,_cq,_cs);c.im.setMatrixAt(c.i,_cm);const ic=c.im.userData._ic,v0=c.im.instanceMatrix.version;c.im.instanceMatrix.needsUpdate=true;if(ic&&ic.v===v0)ic.v=c.im.instanceMatrix.version}else c.o.scale.copy(c.s0).multiplyScalar(k)}
function cutNow(){for(const c of CUT.L)cutSet(c,1);CUT.L=[];CUT.keys=new Set();CUT.goal=0;CUT.job=null;CUT.big=false}
function cutRun(){if(!CUT.job)return;try{if(CUT.job.next().done)CUT.job=null}catch(e){CUT.job=null}}
function cutFind(P,r){const g=cutJob(P,r);while(!g.next().done);}
// the same search spread over a few frames: the list of nearby solids first, then a few rays at a time
function* cutJob(P,r){const cam=camera;const dist=cam.position.distanceTo(P);if(dist>700)return;const dir=P.clone().sub(cam.position).normalize();CUT.keys=CUT.keys||new Set();const seen=CUT.keys;
 const rt=new THREE.Vector3().crossVectors(dir,cam.up).normalize(),up=new THREE.Vector3().crossVectors(rt,dir);const cp=cam.position.clone();const OL=occList(P,Math.min(dist,700));yield;let nr=0;
 for(const [x,y] of [[0,0],[1,0],[-1,0],[0,1],[0,-1],[.7,.7],[-.7,.7],[.7,-.7],[-.7,-.7],[0,-1.6],[0,1.6]]){if(nr++%3===2)yield;const rr=Math.max(r*1.2,5),T=P.clone().addScaledVector(rt,x*rr).addScaledVector(up,y*rr);const d=T.clone().sub(cp);const L=d.length();
  _crc.set(cp,d.normalize());_crc.far=Math.max(1,L-Math.max(r*1.6,6));_crc.camera=cam;
  for(const h of occCast(OL)){const o=h.object;if(!o.isMesh)continue;const m=Array.isArray(o.material)?o.material[0]:o.material;if(!m||m.transparent||m.depthWrite===false||m.blending===THREE.AdditiveBlending||m.visible===false)continue;
   // the ground the thing stands on (paving, plates, a city's floor tiles) is not in the way: a ray that meets it near the thing and not above it stops there
   if(CUR.type==='planet'&&h.point.distanceTo(P)<Math.max(r*3,30)&&_cn.copy(h.point).sub(P).dot(_cn2.copy(P).normalize())<r*.3)break;
   if(!cuttable(o,r))break;if(o.isInstancedMesh){if(h.instanceId==null)continue;const key=o.uuid+':'+h.instanceId;if(seen.has(key))continue;seen.add(key);const m0=new THREE.Matrix4();o.getMatrixAt(h.instanceId,m0);CUT.L.push({im:o,i:h.instanceId,m0,s:0})}
   else{if(seen.has(o.uuid))continue;seen.add(o.uuid);CUT.L.push({o,s0:o.scale.clone(),s:0})}if(CUT.L.length>220)return}}}
function cutStep(dt){if(CUT.off){if(CUT.L.length||CUT.req){CUT.req=null;cutNow()}return}if(CUT.sp!==CUR){cutNow();CUT.sp=CUR}if(CUT.req){if(tw||CUR.camOv){CUT.goal=0}else{const q=CUT.req;CUT.req=null;cutNow();if(sel===q.id){CUT.big=!!q.big;CUT.job=cutJob(q.P,q.r);cutRun();CUT.id=q.id;CUT.goal=1;CUT.t=0}}}else cutRun();
 if(CUT.goal===1&&sel!==CUT.id)CUT.goal=0;
 // following something that moves: every second, whatever new got in the way sinks too
 const F=CUR.follow;if(CUT.goal===1&&F&&F.id===CUT.id&&!tw){CUT.t=(CUT.t||0)+dt;if(CUT.t>1&&!CUT.job){CUT.t=0;const c=proxCenter(F.p);if(c){CUT.job=cutJob(c.clone(),F.p.r||4);cutRun()}}}
 let any=false;for(const c of CUT.L){const g=CUT.goal;if(c.s!==g){c.s=g>c.s?Math.min(1,c.s+dt*2.4):Math.max(0,c.s-dt*2.4);cutSet(c,1-c.s)}if(c.s>0)any=true}
 if(!any&&CUT.goal===0&&CUT.L.length){CUT.L=[];CUT.keys=new Set()}}
window.__cut=CUT;
/* arriving somewhere in deep night: let the day turn there, so what you came to see is lit (the sun glides, it doesn't jump) */
function dayFor(P){const sp=CUR;if(sp.type!=='planet'||sp.sunLon===undefined||!(sp.dayLen<1e11)||!P)return;const d=P.clone().normalize();if(d.dot(sp.sunDir)>-.05)return;
 const ll=llDir(P);const cur=sp.sunLon+T*360/sp.dayLen;const tgt=ll[1]+32;let dl=((tgt-cur)%360+540)%360-180;sp._sunTw={a:sp.sunLon,b:sp.sunLon+dl,t0:T}}
/* moving things (herds, trains, fliers): after arriving, the camera keeps them in view while their card is open (49o_nav.js: q4c_follow) */
function startFollow(p,id){if(!p||!p.c||CUR.camOv)return;CUR.follow={p,id,prev:null}}
function stopFollow(){if(CUR)CUR.follow=null}
['pointerdown','wheel','keydown'].forEach(t=>addEventListener(t,e=>{if(e.target&&e.target.closest&&e.target.closest('#cap,#lib,#rd,#book,#time,#snd'))return;stopFollow()},{passive:true,capture:true}));
function followStep(dt){q4c_follow(dt)}
/* go to an entry wherever it is */
let pendGo=null;function goLater(id){go(id)}
function go(id){const w=W[id];if(!w)return;if(busy){pendGo=id;pendEnter=null;return}const m=mapOf(w);const be=bestEra(w,m);
 // the card opens first, so the free part of the screen is known when the view is framed
 const arrive=()=>{if(CUR.type==='planet'&&be&&be!==ERA)setEra(be);else if(CUR.type!=='planet'&&be)ERA=be,syncTime();open(id);q4c_goto(id,null)};
 if(m!==CUR.id){const h=entryRig(w,SP[m]);enterSpace(m,{era:be||undefined,rig:h,rigFn:()=>q4c_entryRig(id),after:()=>{open(id);q4c_goto(id,null)}});return}arrive()}
/* a first guess at where to arrive for an entry in a world that is not built yet (the exact framing follows once it is) */
function entryRig(w,sp){const t=MB[mapOf(w)].type;if(t==='planet'){const ll=w.ll||[18,-25];const alt=w.c==='地理'?520:300;return{a:ll[0]-alt/200,b:ll[1],alt,head:0,y:0}}
 const p=posOf(w),s=sizeOf(w);if(t==='tube')return{a:w.z-Math.min(160,40+s*2),b:w.ang||0,alt:Math.min(520,120+s*2.4),head:0,y:Math.min(TUBE_R[mapOf(w)]*.7,Math.abs(w.h||0))};
 return{a:-p.z,b:p.x,alt:Math.max(170,Math.min(1600,s*6+120)),head:0,y:clamp(p.y,-400,400)}}
function flyEntry(w){q4c_goto(w.id,null)}

/* ---------- the book ---------- */
let libTab='ent',openGroups=new Set();
$('#book').onclick=()=>{const L=$('#lib');const on=!L.classList.contains('on');L.classList.toggle('on',on);if(on){$('#book').classList.remove('new');if(!openGroups.size)openGroups.add(CUR.id);renderLib();if(innerWidth>760)setTimeout(()=>$('#q').focus({preventScroll:true}),80)}};
$('#lib nav').addEventListener('click',e=>{const b=e.target.closest('[data-t]');if(!b)return;libTab=b.dataset.t;[...$('#lib nav').children].forEach(x=>x.classList.toggle('on',x===b));renderLib()});
$('#q').addEventListener('input',()=>{if(libTab!=='ent'&&libTab!=='ch'&&libTab!=='side'){libTab='ent';[...$('#lib nav').children].forEach(x=>x.classList.toggle('on',x.dataset.t==='ent'))}renderLib()});
const esc=s=>String(s).replace(/[<>&"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]));
function itemHTML(w,sub){return`<button class="it${seen.has(w.id)?' seen':''}" data-id="${w.id}"><i class="${CATK(w.c)}"></i>${esc(w.n)}<small>${esc(sub)}</small></button>`}
function subOf(w,m){if(m==='void'){if(w.ng)return'凝固虚空';return w.sec?`${ERAN[w.sec]} · ${SECTORS[w.sec].n.split(' · ')[0]}`:'虚空'}if(MB[m].type==='planet'){return RN[w.r]||(w.moon?'月':MB[m].n)}return ERAN[w.e[0]]}
function renderLib(){const body=$('#libbody');const q=$('#q').value.trim();
 if(libTab==='ent'){if(q){const L=WIKI.filter(w=>(w.n+w.s+w.d).includes(q));body.innerHTML=`<div class="count">${L.length} 条</div>`+L.map(w=>itemHTML(w,MB[mapOf(w)].n)).join('');return}
  body.innerHTML=`<div class="count">已读 ${WIKI.filter(w=>seen.has(w.id)).length} / ${WIKI.length}</div>`+MAPL.map(m=>{const L=WIKI.filter(w=>mapOf(w)===m.id);const opn=openGroups.has(m.id);
   let inner='';if(opn){const g={};L.forEach(w=>{const k=subOf(w,m.id);(g[k]=g[k]||[]).push(w)});const keys=Object.keys(g);
    if(m.id==='void')keys.sort((a,b)=>(g[a][0].sec||10.5)-(g[b][0].sec||10.5));
    inner=keys.map(k=>`<div class="sub">${esc(k)}</div>`+g[k].map(w=>itemHTML(w,ERAN[w.e[0]])).join('')).join('')}
   return`<button class="grp${opn?' open':''}" data-g="${m.id}">${m.n}<small>${m.sub} · ${L.length}</small></button>${inner}`}).join('');return}
 if(libTab==='ch'){body.innerHTML=chapLibHTML(q);return}
 if(libTab==='side'){body.innerHTML=sideLibHTML(q);return}
 if(libTab==='arc'){body.innerHTML='<button class="tourall" data-tour="0">▶　按故事顺序导览全书</button><div class="vol">卷一 – 卷五　绒球</div>'+ARCS.map((a,i)=>(i===12?'<div class="vol">卷六 – 卷八　虚空</div>':'')+`<div class="arcw"><button class="arc" data-i="${i}"><b>${esc(a.t)}<small>${esc(a.ch)} · ${ERAN[a.e]}</small></b><span>${esc(a.d)}</span></button><button class="tourb" data-tour="${i}" aria-label="从这里开始导览">▶</button></div>`).join('');return}
 body.innerHTML=`<div class="count">已发现 ${found.size} / ${EGGS.length}</div>`+EGGS.map(g=>`<div class="egg${found.has(g.id)?' f':''}"><i>${found.has(g.id)?'✦':'·'}</i><div><b>${found.has(g.id)?esc(g.n):'未发现'}</b><small>${esc(g.hint)}</small></div></div>`).join('')}
$('#libbody').addEventListener('click',e=>{const tb=e.target.closest('[data-tour]');if(tb){const act=+tb.dataset.tour;const k=TOUR.findIndex(s=>s.act===act);tourStart(Math.max(0,k));return}const g=e.target.closest('[data-g]');if(g){const id=g.dataset.g;openGroups.has(id)?openGroups.delete(id):openGroups.add(id);renderLib();return}
 const rc=e.target.closest('[data-rch]');if(rc){$('#lib').classList.remove('on');openRd(+rc.dataset.rch);return}const ce=e.target.closest('[data-ce]');if(ce){const k=+ce.dataset.ce;chOpen.has(k)?chOpen.delete(k):chOpen.add(k);renderLib();return}
 const it=e.target.closest('[data-id]');if(it){cardCtx={ids:[...$('#libbody').querySelectorAll('[data-id]')].map(x=>x.dataset.id),label:'列表'};if(innerWidth<760)$('#lib').classList.remove('on');go(it.dataset.id);setTimeout(renderLib,600);return}
 const sg=e.target.closest('[data-sg]');if(sg){const m=sg.dataset.sg;sideOpen.has(m)?sideOpen.delete(m):sideOpen.add(m);renderLib();return}
 const sd=e.target.closest('[data-side]');if(sd){if(innerWidth<760)$('#lib').classList.remove('on');goSide(sd.dataset.side);return}
 const a=e.target.closest('[data-i]');if(a){const A=ARCS[+a.dataset.i];const id=A.go||ARCGO[+a.dataset.i];const w=W[id];if(!w)return;if(innerWidth<760)$('#lib').classList.remove('on');
  const m=mapOf(w);if(m!==CUR.id){enterSpace(m,{era:MB[m].e.includes(A.e)?A.e:undefined,rig:entryRig(w),rigFn:()=>q4c_entryRig(id),after:()=>{open(id);q4c_goto(id,null)}})}else{if(CUR.type==='planet'&&A.e!==ERA&&MB[m].e.includes(A.e))setEra(A.e);open(id);q4c_goto(id,null)}}});

/* ---------- pointer: hover, touch, drag, wheel ---------- */
const mouse={x:-1,y:-1,in:false};let hov=null,hovPlace=null,drag=null,pinch=null,pushOut=0,spins=0;const ptrs=new Map();
canvas.addEventListener('contextmenu',e=>e.preventDefault());
// no page zoom on phones: two fingers always go to the world, wherever they land
['gesturestart','gesturechange','gestureend'].forEach(t=>document.addEventListener(t,e=>e.preventDefault(),{passive:false}));document.addEventListener('touchmove',e=>{if(e.touches.length>1)e.preventDefault()},{passive:false});
canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
 if(ptrs.size===2){const[a,b]=[...ptrs.values()];pinch={d:Math.hypot(a.x-b.x,a.y-b.y),ang:Math.atan2(b.y-a.y,b.x-a.x),cx:(a.x+b.x)/2,cy:(a.y+b.y)/2,rot:0,rotOn:false};drag=null;zq.v=0;tw=null;vel.a=vel.b=0;return}
 drag={x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY,btn:e.button,t:performance.now(),moved:0};tw=null;vel.a=vel.b=0;canvas.classList.add('drag')});
canvas.addEventListener('pointermove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;mouse.in=true;if(ptrs.has(e.pointerId))ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
 if(ptrs.size===2&&pinch)return;
 if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.x=e.clientX;drag.y=e.clientY;drag.moved+=Math.abs(dx)+Math.abs(dy);
 if(drag.btn===2||e.shiftKey){rig.head-=dx*.006;return}
 const k=dragK(),ch=Math.cos(rig.head),sh=Math.sin(rig.head);const dN=(dy*ch-dx*sh)*k,dE=(-dx*ch-dy*sh)*k;const a0=rig.a,b0=rig.b;moveBy(dN,dE);const nw=performance.now(),fr=clamp((nw-(drag.lt||nw-16))/16.7,.5,4);drag.lt=nw;vel.a=lerp(vel.a,(rig.a-a0)/fr,.55);vel.b=lerp(vel.b,(CUR.type==='planet'?wrap180(rig.b-b0):rig.b-b0)/fr,.55)});
canvas.addEventListener('pointerleave',()=>{mouse.in=false});
function endPtr(e,cancel){ptrs.delete(e.pointerId);if(ptrs.size===1&&pinch){const r=[...ptrs.values()][0];pinch=null;drag={x:r.x,y:r.y,sx:-999,sy:-999,btn:0,t:0,moved:99,nf:1};vel.a=vel.b=0;return}if(ptrs.size<2)pinch=null;canvas.classList.remove('drag');if(drag&&(drag.nf||drag.lt&&performance.now()-drag.lt>90)){vel.a=vel.b=0}
 if(!cancel&&drag&&drag.moved<(e.pointerType==='mouse'?6:14)&&performance.now()-drag.t<600)tap(e.clientX,e.clientY,e.pointerType);
 if(drag&&CUR.type==='planet'&&Math.abs(vel.b)>3.5&&rig.alt>1500){spins++;if(spins>=3)egg('spin')}drag=null}
canvas.addEventListener('pointerup',e=>endPtr(e));canvas.addEventListener('pointercancel',e=>endPtr(e,true));
function dragK(){const t=CUR.type;return rig.alt*(t==='planet'?.957:t==='tube'?1.05:1.1)/innerHeight}
/* the wheel feeds a queue that drains smoothly, so zooming glides instead of stepping */
const zq={v:0,cx:0,cy:0};
canvas.addEventListener('wheel',e=>{e.preventDefault();
 /* a two-finger sideways swipe on a trackpad turns the view, like dragging with the right button */
 if(!e.ctrlKey&&Math.abs(e.deltaX)>Math.abs(e.deltaY)*1.2){if(!busy){rig.head+=e.deltaX*(e.deltaMode===1?33:1)*.004;tw=null;vel.a=vel.b=0}return}
 let dy=e.deltaY*(e.deltaMode===1?33:e.deltaMode===2?400:1);zq.v=clamp(zq.v+clamp(dy,-240,240)*.0016,-2.2,2.2);zq.cx=e.clientX;zq.cy=e.clientY;tw=null},{passive:false});
/* two fingers, handled once per frame from both fingers' latest positions:
   the ground under the fingers' midpoint stays under it while it zooms, pans and (past a small dead zone) turns */
function pinchStep(){if(!pinch||ptrs.size!==2||busy)return;const[a,b]=[...ptrs.values()];const d=Math.hypot(a.x-b.x,a.y-b.y),ang=Math.atan2(b.y-a.y,b.x-a.x),cx=(a.x+b.x)/2,cy=(a.y+b.y)/2;
 if(d<24||pinch.d<24){Object.assign(pinch,{d,ang,cx,cy});return}
 // light smoothing of the raw finger data takes out the per-event jitter of real touch screens
 const sm2=pinch.s||(pinch.s={d,ang,cx,cy});const k=.55;sm2.d+=(d-sm2.d)*k;let dA=ang-sm2.ang;dA=Math.atan2(Math.sin(dA),Math.cos(dA));sm2.ang+=dA*k;sm2.cx+=(cx-sm2.cx)*k;sm2.cy+=(cy-sm2.cy)*k;
 const p0=pinch.p||(pinch.p={d:sm2.d,ang:sm2.ang,cx:sm2.cx,cy:sm2.cy});
 let f=clamp(p0.d/sm2.d,.8,1.25);let da=sm2.ang-p0.ang;da=Math.atan2(Math.sin(da),Math.cos(da));if(Math.abs(da)>.4)da=0;const mdx=sm2.cx-p0.cx,mdy=sm2.cy-p0.cy;
 Object.assign(p0,{d:sm2.d,ang:sm2.ang,cx:sm2.cx,cy:sm2.cy});
 tw=null;vel.a=vel.b=0;
 // turning starts only after a clear twist, so a plain pinch never spins the view
 pinch.rot+=da;if(!pinch.rotOn&&Math.abs(pinch.rot)>.22)pinch.rotOn=true;if(pinch.rotOn)rig.head+=da;
 // the two fingers move the ground like one finger does
 if(Math.abs(mdx)+Math.abs(mdy)>.05){const kk=dragK(),ch=Math.cos(rig.head),sh=Math.sin(rig.head);moveBy((mdy*ch-mdx*sh)*kk,(-mdx*ch-mdy*sh)*kk)}
 // and spreading them brings the camera straight in toward the middle of the view
 if(Math.abs(f-1)>1e-4){const mx=altMax(),mn=altMin();if(f>1&&rig.alt>=mx*.995&&CUR.id!=='void'&&PORTAL[CUR.id]){zoomAt(f,cx,cy);return}if(f<1)pushOut=0;rig.alt=clamp(rig.alt*f,mn,mx);checkEnter(f,cx,cy)}}
function drainZoom(dt){if(Math.abs(zq.v)<1e-4){zq.v=0;return}const k=1-Math.exp(-dt*9);const st=zq.v*k;zq.v-=st;zoomAt(Math.exp(st),zq.cx,zq.cy)}
canvas.addEventListener('dblclick',e=>{clearTimeout(tapTO);const h=surfHit(e.clientX,e.clientY);if(!h)return;const lo=CUR.type==='planet'?40:CUR.type==='tube'?30:100;flyTo(h.a,h.b,Math.max(lo,rig.alt*.38),1.2)});
/* zoom toward the point under the cursor; at the edges, leave or enter */
function zoomAt(f,cx,cy){if(busy)return;tw=null;const mx=altMax(),mn=altMin();
 if(f>1&&rig.alt>=mx*.995&&CUR.id!=='void'&&PORTAL[CUR.id]){pushOut+=Math.log(f);if(pushOut>.05&&pushOut<.4)hint('继续后退，回到虚空');if(pushOut>.55){pushOut=0;exitToVoid()}return}
 if(f<1)pushOut=0;
 const h0=surfHit(cx,cy);const a0=rig.alt;rig.alt=clamp(rig.alt*f,mn,mx);if(!h0||Math.abs(rig.alt-a0)<1e-6){checkEnter(f,cx,cy);return}
 rigPose();const h1=surfHit(cx,cy);if(h1){const k=CUR.type==='planet'&&rig.alt>2400?.4:1;const da=(h0.a-h1.a)*k,db=(CUR.type==='planet'||CUR.type==='tube'?wrap180(h0.b-h1.b):h0.b-h1.b)*k;
  if(CUR.type==='planet'){rig.a=clamp(rig.a+da,-86,86);rig.b+=db}else if(CUR.type==='tube'){rig.a=clamp(rig.a+da,CUR.zr[0],CUR.zr[1]);rig.b+=db}else{const L=CUR.bound||7000;rig.a=clamp(rig.a+da,-L,L);rig.b=clamp(rig.b+db,-L,L)}}
 checkEnter(f,cx,cy)}
/* zooming into the void enters a world only when you dive at the world itself, not anywhere in the wide box round it:
   a long pipe (米德加尔特) counts from its axis and its own girth, so the things floating round it can still be looked at closely */
function portalCore(P){const w=P.w,kp=w.kp||{};if(w.k==='tube'){const L=(kp.len||600)/2,r=(kp.r||40)*1.4;return{L,r}}return{L:0,r:P.r}}
function checkEnter(f,cx,cy){if(CUR.id!=='void'||f>=1)return;surf(CUR,rig.a,rig.b);const t=S_;for(const P of CUR.portals){const c=P.core||(P.core=portalCore(P));const dx=Math.max(0,Math.abs(P.pos.x-t.x)-c.L),d=Math.hypot(dx,P.pos.z-t.z);
  if(d<c.r*(c.L?1.3:2.6)&&rig.alt<c.r*(c.L?2.6:4.2)){if(c.L&&cx!==undefined){const hit=pickProx(cx,cy,true);if(!hit||hit.w!==P.w)continue}enterPortal(P.w);return}}
 // leaning in toward a portal under the cursor pulls the view to it
 const p=pickProx(cx,cy,true);const pc=p&&CUR.portals.find(P=>P.w===p.w);const pr=pc?(pc.core||(pc.core=portalCore(pc))).r:p&&p.r;if(p&&rig.alt<pr*(pc&&pc.core.L?5:14)){const c=proxCenter(p);rig.a=lerp(rig.a,-c.z,.18);rig.b=lerp(rig.b,c.x,.18);rig.y=lerp(rig.y,c.y,.18)}}
/* a touch or a click */
let tapTO=0;
function tap(cx,cy,ptype){pickProx.mesh=1;pickProx.touch=ptype==='touch'||ptype==='pen';const p=pickProx(cx,cy);pickProx.mesh=0;pickProx.touch=false;if(p){choose(p);return}
 // empty ground: wait a moment, so a double-click (fly in) doesn't also open the region under it
 clearTimeout(tapTO);tapTO=setTimeout(()=>{if(CUR.type==='planet'){const pl=placeAt(cx,cy);if(pl){go(pl.id);return}}closeCap()},ptype==='mouse'?260:0)}
function choose(p){const w=p.w;if(p.click)p.click();if(p.only)return;if(p.egg)egg(p.egg);if(egz_choose(p))return;
 if(w.id==='naodai'){toast('脑袋虫',BRAIN[brainI++%BRAIN.length]);egz_late('brain')}
 if((w.id==='moon'||w.id==='moon_bus')&&CUR.id==='rongqiu'){CUR.moonT=CUR.moonT?0:1;if(CUR.moonT){toast('星空翻滚者','“月，与鸣石共鸣。鸣石，让一切升腾。”');egz_late('moon');clearTimeout(moonTO);moonTO=setTimeout(()=>{if(SP.rongqiu)SP.rongqiu.moonT=0},90000)}open(w.id);return}
 open(w.id);
 // the thing that was touched (a particular member of a herd, a particular marker) is what the view goes to and stays on
 q4c_goto(w.id,p)}
let moonTO=0;
/* which named place is under a point on a planet */
const REGB=Object.fromEntries(REGIONS.map(r=>[r.id,r]));const GEO={};WIKI.forEach(w=>{if(w.c==='地理'&&w.ll){const m=mapOf(w);(GEO[m]=GEO[m]||[]).push({w,d:dirLL(w.ll[0],w.ll[1])})}});
function placeAt(cx,cy){const h=surfHit(cx,cy);if(!h)return null;const d=dirLL(h.a,h.b);let best=null,bs=1e9;
 for(const g of (GEO[CUR.id]||[])){const w=g.w;if(w.id===CUR.id||w.ng)continue;if(!eraOk(w.e))continue;const reg=REGB[w.id];const lim=reg?(reg.rad||0)*.85:3.6;if(!lim)continue;
  const a=angDeg(d,g.d);if(a>lim)continue;const sc=a/lim+(reg?.6:0);if(sc<bs){bs=sc;best=w}}
 if(!best&&rig.alt>1800&&W[PLANET_ENT[CUR.id]])best=W[PLANET_ENT[CUR.id]];return best}

/* ---------- keys ---------- */
const keys={};addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'){if(e.code==='Escape')$('#lib').classList.remove('on');return}keys[e.code]=true;if(e.code==='Escape'){if($('#rd').classList.contains('on'))return;if($('#lib').classList.contains('on'))$('#lib').classList.remove('on');else closeCap()}});addEventListener('keyup',e=>keys[e.code]=false);addEventListener('blur',()=>{for(const k in keys)keys[k]=false});

/* ---------- hover, every frame ---------- */
const hoverEl=$('#hover');let hovFrame=0;
const NOHOVER=matchMedia('(hover: none)').matches;
function updateHover(){if(!mouse.in||drag||ptrs.size>1||busy||NOHOVER){if(hov||hovPlace){hov=null;hovPlace=null;hoverEl.classList.remove('on');canvas.classList.remove('point')}return}
 if(++hovFrame%2)return;const p=pickProx(mouse.x,mouse.y);let place=null;if(!p&&CUR.type==='planet')place=placeAt(mouse.x,mouse.y);
 if(p!==hov||place!==hovPlace){hov=p;hovPlace=place;maoyuHover=!!(p&&p.mao);if(p&&p.mao&&!found.has('maoyu'))setTimeout(()=>{if(maoyuHover)egg('maoyu')},380);
  if(p){hoverEl.className='on';hoverEl.innerHTML=`${esc(p.w.n)}<small>${esc(p.w.c)}</small>`}else if(place){hoverEl.className='on place';hoverEl.innerHTML=esc(place.n)}else hoverEl.className=''}
 canvas.classList.toggle('point',!!(p||place));
 if(p||place){const x=Math.min(mouse.x+16,innerWidth-hoverEl.offsetWidth-8),y=Math.min(mouse.y+14,innerHeight-34);hoverEl.style.transform=place&&!p?`translate(${mouse.x-hoverEl.offsetWidth/2}px,${mouse.y-34}px)`:`translate(${x}px,${y}px)`}}

/* ---------- motes and the selection ring ---------- */
function updateMotes(){const L=CUR.motes;if(L)for(const m of L){if(!m.visible)continue;const d=camera.position.distanceTo(m.position);const w=m.userData.w;const md=CUR.type==='planet'?(w.c==='地理'?3200:1400):3800;
 let op=1-sm(md*.55,md,d);if(CUR.type==='planet'){const cp=camera.position.clone().normalize();if(m.position.clone().normalize().dot(cp)<R/camera.position.length()-.01)op=0}
 const hv=hov&&hov.mote===m;m.material.opacity=op*(seen.has(w.id)?.55:.95)*(.8+.2*Math.sin(GT.value*2+m.userData.ph));const s=m.userData.base*(hv?1.7:1)*(sel===w.id?1.4:1);m.scale.set(s,s,1)}
 if(selP&&cap.classList.contains('on')&&(!selP.hide||!selP.hide())){const c=proxCenter(selP);if(c){selRing.position.copy(c);selRing.material.opacity=.75+.2*Math.sin(GT.value*3);const s=.05+.01*Math.sin(GT.value*3);selRing.scale.set(s,s,1)}}else selRing.material.opacity=0}

/* ---------- adaptive quality ---------- */
const perf={t:0,n:0,lvl:0,hold:0};
/* quality levels: resolution goes first, shadows last, and a level is won back when the frame rate stays high.
   a one-off long frame (a world being built in the background, a shader compiling) is not slowness */
const PR0=PR;
/* shadows are never switched off: at the low levels they get a smaller map, a shorter reach and fewer redraws instead */
function applyLevel(){const L=perf.lvl;PR=Math.min(PR0,[PR0,1.5,1.25,1,.8][L]);SHD.on=true;SHD.ms=L>=4?512:(L>=3||COARSE)?1024:2048;SHD.max=[1500,1500,1000,600,400][L];SHD.every=[2,2,3,3,4][L];if(bloomPass){bloomPass.strength=L>=2?.45:.62;bloomPass.enabled=L<4}resize()}
function adapt(dt){if(window.__noAdapt)return;if(perf.skip>0){perf.skip--;return}perf.t+=dt;perf.n++;if(dt>.07&&dt<.5&&!busy)perf.slow=(perf.slow||0)+1;if(perf.t<2.5)return;const fps=perf.n/perf.t,slow=perf.slow||0;perf.t=0;perf.n=0;perf.slow=0;if(perf.hold>0){perf.hold--;return}
 if((fps<34||slow>=8)&&perf.lvl<4){perf.lvl++;perf.hold=1;perf.good=0;applyLevel()}
 else if(fps>56&&slow<=1&&perf.lvl>0){if(++perf.good>=4){perf.lvl--;perf.hold=2;perf.good=0;applyLevel()}}else perf.good=0}

/* while a card is open, the picture slides so what you chose sits in the free part of the screen, not under the card */
const VO={x:0,y:0};
function voTarget(){let tx=0,ty=0;const W=innerWidth,H=innerHeight;
 const tourP=document.body.classList.contains('touring')&&$('#tour')&&$('#tour').classList.contains('on');
 if(tourP){const r=$('#tour').getBoundingClientRect();return [0,r.top/2-H/2]}
 // on a wide screen an entry card leaves the picture where it is (it sits beside what you look at); on a phone it covers the
 // lower half, so the picture slides up and what you chose stays in the free part above it. the open book always makes room
 const pane=$('#rd')&&$('#rd').classList.contains('on')?$('#rd'):null;
 if(pane){const r=pane.getBoundingClientRect();if(W>760){if(r.left<W*.5)tx=(r.right+W)/2-W/2;else tx=r.left/2-W/2}else{ty=r.top/2-H/2}}
 else if(W<=760&&cap.classList.contains('on')&&!document.body.classList.contains('touring')){const top=cap.offsetTop;if(top>H*.3)ty=(top-8)/2-H/2}return [tx,ty]}
function updViewOff(dt){const W=innerWidth,H=innerHeight;const [tx,ty]=voTarget();
 const k=1-Math.exp(-dt*5);VO.x+=(tx-VO.x)*k;VO.y+=(ty-VO.y)*k;
 if(Math.abs(VO.x)<.5&&Math.abs(VO.y)<.5){if(camera.view&&camera.view.enabled){camera.clearViewOffset()}return}
 camera.setViewOffset(W,H,-VO.x,-VO.y,W,H)}
/* the other worlds are built (and their shaders made) ahead of time, one at a time, while a page covers the picture, the
   tour lingers on a stop, or nobody has touched anything for a few seconds, so going there later is quick. a phone keeps fewer */
const PRE={coarse:matchMedia('(pointer:coarse)').matches,order:['void','rongqiu','ximin','erxi','midgard','dream','tunnel','buke']};
function preNext(){const C=[];if(TVS.on){for(let k=1;k<=3;k++){const s=TOUR[TVS.i+k];if(s){const m=mapOf(W[s.id]);if(m)C.push(m)}}}
 if(CUR.id!=='void')C.push('void');if(!PRE.coarse||TVS.on)C.push(...PRE.order);
 const built=Object.keys(SP).length;if(PRE.coarse&&built>=4)return null;return C.find(id=>BUILDERS[id]&&!SP[id])||null}
setInterval(q5s_preTick,1800);// (49p_stable: the build only in covered or long-idle moments, the shaders in slices after)
/* ---------- the loop ---------- */
let T=0,last=performance.now(),eraTick=0;
/* saving power: nothing to draw while a chapter or the library covers the phone screen; fewer frames while a panel
   covers part of a big screen, or when nobody has touched anything for a while and nothing is moving */
let lastInput=performance.now();['pointerdown','pointermove','wheel','keydown','touchstart'].forEach(t=>addEventListener(t,()=>{lastInput=performance.now()},{passive:true,capture:true}));
function frameCap(now){const rdOn=$('#rd').classList.contains('on'),libOn=$('#lib').classList.contains('on');
 if(busy||tw||drag||pinch||fadeK>.01&&fadeTo<fadeK)return 60;
 if((rdOn||libOn)&&innerWidth<760)return 0;
 if(rdOn||libOn)return 24;
 const moving=Math.abs(vel.a)+Math.abs(vel.b)>1e-4||Math.abs(zq.v)>1e-3||(CUR&&CUR.follow);
 if(!moving&&now-lastInput>15000)return 30;return 60}
function loop(now){if(q5s_halt)return;const fc=frameCap(now);
 if(fc===0){last=now;setTimeout(()=>requestAnimationFrame(loop),300);return}
 if(fc<60&&now-last<1000/fc-4){requestAnimationFrame(loop);return}
 const rawDt=(now-last)/1000,dt=Math.min(.05,rawDt);last=now;MW_ALL=busy;MW_TICK++;T+=dt;GT.value=T;q5s_begin();if(CUR&&!CUR._sides&&!busy)placeSides(CUR);if(CUR&&!busy&&(CUR._sbN===undefined||now-CUR._sbN>5000)&&CUR._sbA!==q5s_adds(CUR.scene)&&!q5s_blown()){CUR._sbN=now;try{batchSprites(CUR);noStaleCull(CUR)}catch(e){console.warn('batch',e)}CUR._sbA=q5s_adds(CUR.scene)}
 if(tw){if(tw.track)q4c_retrack();tw.t+=dt/tw.dur;const k=Math.min(1,tw.t),e=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;const hop=Math.pow(Math.sin(k*Math.PI),2)*hopOf()*.8;
  rig.a=lerp(tw.from.a,tw.to.a,e);rig.b=lerp(tw.from.b,tw.to.b,e);rig.y=lerp(tw.from.y,tw.to.y,e);rig.head=lerp(tw.from.head,tw.to.head,e);rig.alt=Math.min(altMax(),Math.exp(lerp(Math.log(tw.from.alt),Math.log(tw.to.alt),e))+hop);if(k>=1){const tr=tw.track;tw=null;if(tr&&tr.settle)q4c_settle(tr)}}
 else if(!drag&&!pinch){if(Math.abs(vel.a)+Math.abs(vel.b)>1e-5){rig.a+=vel.a*dt*60;rig.b+=vel.b*dt*60;if(CUR.type==='planet')rig.a=clamp(rig.a,-86,86);else if(CUR.type==='tube')rig.a=clamp(rig.a,CUR.zr[0],CUR.zr[1]);else{const L=CUR.bound||7000;rig.a=clamp(rig.a,-L,L);rig.b=clamp(rig.b,-L,L)}const dk=Math.exp(-dt*5.5);vel.a*=dk;vel.b*=dk}}
 if(!busy){pinchStep();drainZoom(dt)}
 if(!busy){const kk=dragK()*5*dt*60,ch=Math.cos(rig.head),sh=Math.sin(rig.head);if(keys.KeyW||keys.ArrowUp)moveBy(kk*ch,-kk*sh);if(keys.KeyS||keys.ArrowDown)moveBy(-kk*ch,kk*sh);if(keys.KeyD||keys.ArrowRight)moveBy(kk*sh,kk*ch);if(keys.KeyA||keys.ArrowLeft)moveBy(-kk*sh,-kk*ch);
  if(keys.KeyQ)rig.head-=dt*1.2;if(keys.KeyE)rig.head+=dt*1.2;if(keys.KeyR){zq.v-=dt*1.6;zq.cx=innerWidth/2;zq.cy=innerHeight/2}if(keys.KeyF){zq.v+=dt*1.6;zq.cx=innerWidth/2;zq.cy=innerHeight/2}}
 followStep(dt);rigPose();q5s_mark('cut');cutStep(dt);q5s_mark('update');
 if(CUR._sunTw){const o=CUR._sunTw,k=Math.min(1,(T-o.t0)/2.4),e=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;CUR.sunLon=o.a+(o.b-o.a)*e;if(k>=1)CUR._sunTw=null}
 if(CUR.update)q5s_guard(CUR,'update',()=>CUR.update(T,dt));q5s_mark('pool');poolStep(CUR,now);
 q5s_mark('anims');q5s_farCull(CUR);q5s_anims(CUR,T,dt);q5s_mark('jobs');q5s_jobs();
 q5s_mark('ui');updViewOff(dt);updateBooms(dt);updateHover();updateMotes();updateLabels();
 if(CUR.type!=='planet'&&CUR.eraAt&&++eraTick%20===0){const e=CUR.eraAt(S_);if(e&&e!==ERA){ERA=e;syncTime()}}
 fadeK+=(fadeTo-fadeK)*Math.min(1,dt*(fadeTo>fadeK?7:3.2));setFade(fadeK);if(finalPass)finalPass.uniforms.uTime.value=T;
 q5s_mark('render');if(composer&&POST.on)composer.render();else renderer.render(CUR.scene,camera);q5s_end();
 // quality only adapts to frames that were not held back on purpose
 if(rawDt<1&&fc===60&&loop.pf===60)adapt(rawDt);else{perf.t=0;perf.n=0;perf.slow=0}loop.pf=fc;requestAnimationFrame(loop)}

/* ---------- start ---------- */
initPost();resize();addEventListener('resize',resize);
const firstVisit=!seen.size&&store.get('rq_era',null)===null;
setTimeout(()=>{
 if(firstVisit)ERA=1;
 enterSpace('rongqiu',{rig:firstVisit?{a:12,b:-10,alt:4900,head:0,y:0}:null,home:true,era:ERA,after:()=>{
  if(firstVisit){const tc=matchMedia('(pointer:coarse)').matches;const H=[[1800,tc?'单指拖动转动世界，双指缩放':'拖动转动世界，滚轮缩放',3400],[9800,'下方的时间轴可以换一个时代看看',3400],[15000,'靠近以后，发光的小点都是词条，点一下',3600],[21000,'右下角是图书馆：词条、故事、原著章节和番外',3800]];H.forEach(([d,t,ms])=>setTimeout(()=>{if(!$('#cap.on')&&CUR&&CUR.id==='rongqiu'&&!$('#lib.on'))hint(t,ms)},d));flyTo(18,-25,2600,7);setTimeout(()=>{$('#time').classList.add('open');setEra(2);setTimeout(()=>$('#time').classList.remove('open'),5200)},3600)}}});
 requestAnimationFrame(t=>{last=t;loop(t)})},30);
window.__rq={bc:buildCreature,fll:frameLL,cam:camera,ren:renderer,place(a,b,alt,head){tw=null;vel.a=vel.b=0;Object.assign(rig,{a,b,alt,head:head||0})},stop(){tw=null},go,open,setEra,enterSpace,exitToVoid,flyTo,rig,get CUR(){return CUR},get ERA(){return ERA},SP,timeTo,zoomAt,pickProx,egg,get tw(){return tw}};
Object.assign(window.__rq,{dbg:{selP:()=>selP,posOf,sizeOf,proxCenter,rigPose,flyEntry,ensureClear,q4c:{aim:q4c_aim,vis:q4c_vis,want:q4c_want,subject:q4c_subject,goto:q4c_goto,clear:q4c_clear},busy:()=>busy,pickProx,eraOk,dayFor,SHD,getSpace,sunAt:lon=>{CUR.sunLon=lon-T*360/CUR.dayLen}}});
