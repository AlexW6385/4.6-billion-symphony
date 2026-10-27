/* ================================================================
   q5s: stability — a frame-time profiler (window.__q5prof), error guards, context loss, era switches and
   world prebuilds cut into slices, far things animated less, a steadier quality control (window.__q5log).
   ================================================================ */
/* ---- the real clock (the test harness swaps performance.now for a virtual one and keeps the real one in __rp) ---- */
const q5s_now=window.__rp||performance.now.bind(performance);
/* ---- profiler: per-stage time of the frame loop, the last frame's breakdown, a ring of recent frames, long frames ---- */
const q5s_P={stage:null,t0:0,cur:{},last:null,ring:[],long:[],mid:[],spans:[],frame:0,lastMs:0,prevMs:0,n:0};
window.__q5prof=q5s_P;
function q5s_mark(name){const t=q5s_now();if(q5s_P.stage)q5s_P.cur[q5s_P.stage]=(q5s_P.cur[q5s_P.stage]||0)+(t-q5s_P.t0);q5s_P.stage=name;q5s_P.t0=t}
function q5s_begin(){q5s_P.cur={};q5s_P.stage=null;q5s_P.fs=q5s_now();if(q5s_P.spans.length){q5s_P.spans=q5s_P.spans.filter(x=>!x[2]);for(const x of q5s_P.spans)x[2]=1}q5s_mark('update')}
function q5s_end(){q5s_mark(null);const P=q5s_P,ms=q5s_now()-P.fs;P.prevMs=P.lastMs;P.lastMs=ms;P.frame++;P.n++;const c=P.cur;c.total=ms;P.last=c;P.ring.push(ms);if(P.ring.length>600)P.ring.shift();
 if(ms>30){const L=ms>100?P.long:P.mid;L.push({f:P.frame,ms:+ms.toFixed(1),st:Object.fromEntries(Object.entries(c).map(([k,v])=>[k,typeof v==='number'?+v.toFixed(1):v])),sp:P.spans.map(s=>s[0]+':'+s[1].toFixed(0)).join(' ')});if(L.length>60)L.shift()}}
/* a named piece of work outside the loop's stages (a world being built, a shader compile, an era switch) */
function q5s_span(name,f){const a=q5s_now();try{return f()}finally{const d=q5s_now()-a;if(d>2){q5s_P.spans.push([name,d,0]);if(q5s_P.spans.length>40)q5s_P.spans.shift()}}}
window.__q5log=[];function q5s_log(ev,o){const L=window.__q5log;L.push(Object.assign({t:+(q5s_now()/1000).toFixed(1),ev},o||{}));if(L.length>200)L.shift()}
/* the frame budget: was the previous frame already long? then optional work waits */
function q5s_blown(){return q5s_P.lastMs>40}
/* ---- error guards: a throwing stage is logged once and skipped, a throwing anim is switched off, instead of killing the frame loop ---- */
function q5s_guard(owner,key,f){try{return f()}catch(e){const u=owner.__q5err||(owner.__q5err={});if(!u[key]){u[key]=1;console.warn('q5s: '+key+' failed, disabled',e);q5s_log('err',{what:key,msg:String(e&&e.message||e).slice(0,120)})}}}// (a world's own update keeps being called: a passing error must not stop its sun and sky for good)
let q5s_anims=null;// (the anim pass, below: each callback guarded, far things at a lower rate)
/* ---- spans round the big one-off jobs, so a long frame says what it was doing ---- */
function applyPlanetEra(sp,e){return q5s_span('era:'+sp.id+':'+e,()=>applyPlanetEraBase(sp,e))}

/* ---- what was added to which scene: a per-root counter, so one world being built in the background no longer makes
   the shown world rescan itself (poolScan / batchSprites / noStaleCull walked all of it: 30-45 ms spikes) ---- */
{const f0=THREE.Object3D.prototype.add;THREE.Object3D.prototype.add=function(o){const r=f0.apply(this,arguments);if(o&&o.userData&&o.userData.q5quiet)return r;let p=this;while(p.parent)p=p.parent;p.__q5adds=(p.__q5adds||0)+1;return r}}
// the selection ring moves from world to world with every arrival: that is not new content
if(typeof selRing!=='undefined'&&selRing)selRing.userData.q5quiet=1;
function q5s_adds(sc){return sc.__q5adds||0}
function poolStep(sp,now){const lp=sp._lp;if(lp){if(lp.a!==SG_ADDS&&q5s_adds(sp.scene)===(lp.q5a||0))lp.a=SG_ADDS;if(lp.a!==SG_ADDS&&q5s_blown())return}const r=poolStepBase(sp,now);const l2=sp._lp;if(l2&&l2.a===SG_ADDS)l2.q5a=q5s_adds(sp.scene);return r}

/* ---- per-frame job queue: small slices of deferred work (shader compiles, recolours), ≤ 6 ms a frame, nothing on a frame
   that follows a long one ---- */
const q5s_J=[];
function q5s_job(name,step){q5s_J.push({name,step})}
function q5s_jobs(){if(!q5s_J.length||q5s_blown()||busy)return;const t0=q5s_now(),lim=COARSE?4:6;while(q5s_J.length&&q5s_now()-t0<lim){const j=q5s_J[0];let done=true;try{done=j.step(lim-(q5s_now()-t0))}catch(e){console.warn('q5s job',j.name,e);done=true}if(done)q5s_J.shift()}}

/* ---- shader programs made a few at a time: renderer.compile over a slice of the scene's top-level branches (the lights' own
   branches always included, so every slice sees the same light set and makes the same programs the real render will ask for) ---- */
const q5s_compileRaw=renderer.compile.bind(renderer);// (the untouched three.js compile)
function q5s_compileQueue(sc,cam){if(q5s_J.some(j=>j.sc===sc))return;sc.__q5c=1;const props=renderer.properties;const LR=new Set();sc.traverseVisible(o=>{if(o.isLight){let p=o;while(p.parent&&p.parent!==sc)p=p.parent;LR.add(p)}});
 const items=sc.children.filter(c=>!LR.has(c));const lights=[...LR];let i=0,k=1,nb=600;const fresh=o=>{let n=0,c=0;o.traverse(m=>{c++;const ms=m.material;if(!ms)return;for(const x of Array.isArray(ms)?ms:[ms])if(x&&!props.get(x).currentProgram)n++});return[n,c]};
 const j={name:'compile:'+(sc.__q5id||''),sc,step(){if(i>=items.length){q5s_log('compiled',{sc:sc.__q5id,n:items.length});return true}const batch=[];let nf=0,no=0;while(i<items.length&&no<nb&&nf<k){const o=items[i++];batch.push(o);const f=fresh(o);nf+=f[0];no+=f[1]}
   const all=sc.children;const t0=q5s_now();sc.children=lights.concat(batch);try{q5s_compileRaw(sc,cam||camera)}finally{sc.children=all}const d=q5s_now()-t0;if(d>8){k=1;nb=Math.max(100,nb>>1)}else if(d<3){k=Math.min(4,k+1);nb=Math.min(6000,nb*2)}return i>=items.length}};
 q5s_J.push(j)}
/* the whole-scene compile stays for a first arrival (it happens under the loading screen); a world seen before only gets
   its new materials, in slices, instead of a 200-300 ms walk over everything again */
renderer.compile=function(sc,cam){if(sc.__q5c){q5s_compileQueue(sc,cam);return}sc.__q5c=1;return q5s_span('compile',()=>q5s_compileRaw(sc,cam))};
// in a slice the span is the job itself

/* ---- when a world or an age changes: a quiet period for the quality control and the background builder ---- */
let q5s_swT=-1e9;function q5s_switched(){q5s_swT=q5s_now()}
function q5s_enterSpace(id,opt){q5s_switched();if(SP[id])SP[id].__q5t=q5s_now();return enterSpaceBase(id,opt)}
 function setEra(e){q5s_switched();return setEraBase(e)}


/* ---- no world is built ahead of time: a build is one piece of 0.3-2 s of script, and there is no moment it would not be
   felt (behind the library or the reader it froze their scrolling; in the open, the picture). a first visit builds under
   the loading cover; a world seen before only makes its new shaders in slices ---- */

/* ---- things far away animate at a tenth of the rate (a creature a few pixels across does not need 60 poses a second);
   anything big, anything without a known size and anything with no object keeps its full rate. sp.anims entries may carry
   an explicit radius r ---- */
const q5s_FAR={planet:1300,space:3000,tube:1600,path:2200,dream:2200};
function q5s_animR(a){if(window.__q5noFar)return null;if(a.q5r!==undefined)return a.q5r;let r=null;if(a.r)r=a.r;else if(a.o){let p=a.o,id=null;for(let k=0;k<4&&p&&!id;k++){id=p.userData&&p.userData.pick;p=p.parent}const w=id&&W[id];if(w&&LIVING[w.c]){const s=sizeOf(w);if(s<60)r=Math.max(q5s_FAR[CUR&&CUR.type]||1500,s*40)}}return a.q5r=r}
q5s_anims=function(sp,T,dt){const AN=sp.anims,cp=camera.position,fr=q5s_P.frame;for(let i=0,n=AN.length;i<n;i++){const a=AN[i];if(a.dead)continue;if(a.o&&!isVis(a.o))continue;
 let d=dt;const r=q5s_animR(a);if(r!==null){const e=a.o.matrixWorld.elements;const dx=e[12]-cp.x,dy=e[13]-cp.y,dz=e[14]-cp.z;if(dx*dx+dy*dy+dz*dz>r*r){a.q5dt=(a.q5dt||0)+dt;if((fr+i)%6)continue;d=a.q5dt;a.q5dt=0}else if(a.q5dt){d+=a.q5dt;a.q5dt=0}}
 if(q5s_P.deep){const t0=q5s_now();try{a.f(T,d)}catch(e){a.dead=1}const ms=q5s_now()-t0;if(ms>(q5s_P.cur.animTopMs||1.5)){q5s_P.cur.animTopMs=+ms.toFixed(1);q5s_P.cur.animTop=String(a.f).slice(0,90)}continue}
 try{a.f(T,d)}catch(e){a.dead=1;console.warn('q5s: anim disabled',e);q5s_log('err',{what:'anim',msg:String(e&&e.message||e).slice(0,120)})}}};

/* ---- off the planets nothing was ever hidden by distance: every creature of the void (8000 objects) had its matrices and
   animations run from anywhere. small living things now sleep when the camera is far beyond their marker's reach ---- */
function q5s_farCull(sp){if(sp.cover&&!sp.cover.__q5w){sp.cover.__q5w=1;const u=sp.cover.update;sp.cover.update=()=>q5s_span('cover',u)}q5s_warm(sp);if(sp.type==='planet'||!sp.scene||window.__q5noFar)return;const sc=sp.scene;if(!sc.__q5fc||sc.__q5fcA!==q5s_adds(sc)){sc.__q5fcA=q5s_adds(sc);const L=[];for(const c of sc.children){const id=c.userData&&c.userData.pick;const w=id&&W[id];if(!w||c.isInstancedMesh||c.isPoints)continue;const s=sizeOf(w),ep=sp.entPos&&sp.entPos[id];const live=LIVING[w.c]&&s<60;L.push({o:c,r:ep?ep.r:s*.6,far:live?Math.max(3600,s*80)*1.15:1e9,near:live?Math.max(3600,s*80):1e9})}sc.__q5fc=L}
 // besides the distance rule for small living things, anything whose radius would be under a pixel and a half on screen
 // is a speck and not drawn (a far entry is still shown by its mote); a tenth closer and it is back
 const pxk=innerHeight/(2*Math.tan(camera.fov*Math.PI/360))/1.5;
 const cp=camera.position,F=sp.follow,fid=F&&F.id,sid=sel;for(const x of sc.__q5fc){const o=x.o,e=o.matrixWorld.elements;const dx=e[12]-cp.x,dy=e[13]-cp.y,dz=e[14]-cp.z,d2=dx*dx+dy*dy+dz*dz;const id=o.userData.pick;
  const tf=x.r*pxk,far=Math.min(x.far,tf*1.1),near=Math.min(x.near,tf);
  if(o.userData.q5far){if(d2<near*near||id===fid||id===sid){o.userData.q5far=0;o.visible=o.userData.q5vis!==false}}
  else if(d2>far*far&&id!==fid&&id!==sid&&!(CUT.id===id&&CUT.goal)){o.userData.q5vis=o.visible;o.userData.q5far=1;o.visible=false}
  if(!o.userData.q5far&&o.visible)q5s_detail(x,Math.sqrt(d2),pxk,id===fid||id===sid)}}
/* the small parts of a model far away (an eye, a claw, a strut) are under a pixel in radius: they are not drawn. The parts are
   listed once, biggest first, with the radius each covers in the world; only parts this hid are shown again */
function q5s_detail(x,d,pxk,keep,k){let P=x.parts;if(!P){P=x.parts=[];const s=new THREE.Vector3(),sp=new THREE.Sphere();x.o.updateMatrixWorld(true);
  x.o.traverse(m=>{if(!(m.isMesh||m.isPoints)||m.isInstancedMesh||!m.geometry)return;const g=m.geometry;if(!g.boundingSphere)g.computeBoundingSphere();if(!g.boundingSphere)return;m.matrixWorld.decompose(_q5dp,_q5dq,s);P.push({m,r:g.boundingSphere.radius*Math.max(s.x,s.y,s.z),off:false})});
  P.sort((a,b)=>b.r-a.r);x.pi=P.length}
 // parts with r*pxk < d go; P is sorted, so find the first one that is too small
 const lim=keep?0:d*(k||1)/(pxk*1.5);let i=0;while(i<P.length&&P[i].r>=lim)i++;
 for(let k=0;k<i&&k<x.pi;k++){const q=P[k];if(q.off){q.off=false;q.m.visible=true}}
 for(let k=i;k<P.length;k++){const q=P[k];if(!q.off&&q.m.visible){q.off=true;q.m.visible=false}}x.pi=i}
const _q5dp=new THREE.Vector3(),_q5dq=new THREE.Quaternion();

/* ---- the occluder list (line-of-sight tests while following, the cutaway): the same list is reused for half a second when
   asked again for nearly the same spot, and a frame that follows a long one gets the last list rather than a fresh walk ---- */
let q5s_occC=null;function occList(P,Rr){const now=q5s_now();if(q5s_occC&&q5s_occC.sp===CUR&&q5s_occC.R===Rr&&(now-q5s_occC.t<500||q5s_blown()&&now-q5s_occC.t<2500)&&q5s_occC.P.distanceToSquared(P)<(Rr*.15)*(Rr*.15))return q5s_occC.L;const L=q5s_span('occList',()=>occListBase(P,Rr));q5s_occC={sp:CUR,R:Rr,P:P.clone(),t:now,L};return L}
/* the first occluder list of a world worked out the bounds of every instance of every instanced set (tens of thousands) in one go:
   that is done ahead, a few sets per frame, after arriving */
function q5s_warm(sp){const sc=sp.scene;if(sc.__q5warm===q5s_adds(sc))return;sc.__q5warm=q5s_adds(sc);const L=[];sc.traverse(o=>{if(o.isMesh&&o.geometry&&(!o.geometry.boundingSphere||o.isInstancedMesh&&o.count>3))L.push(o)});let i=0;if(L.length)q5s_job('warm:'+sp.id,lim=>{const t0=q5s_now();while(i<L.length&&q5s_now()-t0<(lim||3)){const o=L[i++];try{const g=o.geometry;if(!g.boundingSphere)g.computeBoundingSphere();if(g.boundingSphere&&o.isInstancedMesh&&o.count>3)instCenters(o,g)}catch(e){}}return i>=L.length})}// (every mesh's bounds too: the first jump in a world used to work them all out at once, 50-150 ms)

/* ---- an age change on a planet: the near patch took its new colours in one go (every vertex of a 20k-vertex patch re-sampled);
   now ~3000 vertices a frame, the crossfade covering the rest ---- */
function q2_recolour(P){const cu=P.cur;if(!cu||cu.B.nv<4000)return q2_recolourBase(P);const sp=P.sp,B=cu.B,n=cu.n,Gd=sp.G,M=Gd.M,GN=Gd.N,ca=sp.terr.geometry.attributes.color.array,cb=sp.terr.geometry.attributes.aCol2.array;const d=V3();let vi=0;
 const step=(lim)=>{if(P.cur!==cu){return true}const t0=q5s_now(),tl=lim||q5s_slice();let e=Math.min(B.nv,vi+256);for(;vi<e;vi++){if(vi===e-1&&e<B.nv&&q5s_now()-t0<tl)e=Math.min(B.nv,e+256);d.set(B.pos[vi*3],B.pos[vi*3+1],B.pos[vi*3+2]).normalize();const fi=faceOf(d),f=FACES[fi],dn=d.dot(f.n);const a=Math.atan(d.dot(f.u)/dn)*1.2732395,b=Math.atan(d.dot(f.v)/dn)*1.2732395;
   const x=clamp((a+1)*.5*GN,0,GN-1e-4),y=clamp((b+1)*.5*GN,0,GN-1e-4);const ci=x|0,cj=y|0,fx=x-ci,fy=y-cj;const k=fi*M*M+cj*M+ci;const wE=B.wE[vi];
   let ta,tb,tc,td;if(fx+fy<1){ta=1-fx-fy;tb=fx;tc=fy;td=0}else{ta=0;tb=1-fy;tc=1-fx;td=fx+fy-1}const wa=ta+((1-fx)*(1-fy)-ta)*wE,wb=tb+(fx*(1-fy)-tb)*wE,wc=tc+((1-fx)*fy-tc)*wE,wd=td+(fx*fy-td)*wE;
   for(let q=0;q<3;q++){B.ca[vi*3+q]=ca[k*3+q]*wa+ca[(k+1)*3+q]*wb+ca[(k+M)*3+q]*wc+ca[(k+M+1)*3+q]*wd;B.cb[vi*3+q]=cb[k*3+q]*wa+cb[(k+1)*3+q]*wb+cb[(k+M)*3+q]*wc+cb[(k+M+1)*3+q]*wd}if(B.tw[vi]>0)q4a_tread(B,vi,B.tw[vi])}
  B.geo.attributes.color.needsUpdate=true;B.geo.attributes.aCol2.needsUpdate=true;return vi>=B.nv};
 step(2);if(vi<B.nv)q5s_job('recolour',step)}

/* ---- quality control, steadier: a level goes down only after two slow windows in a row, comes back only after six fast ones,
   never within 4 s of a world or age change, and a level that was just left for being slow is not tried again for a minute
   (twice as long each time it flips back). resolution (and so the render targets) only changes when the level's resolution differs ---- */
function applyLevel(){const L=perf.lvl,p0=PR;PR=Math.min(PR0,[PR0,1.3,1.15,1,.8][L]);SHD.on=true;SHD.ms=L>=4?512:(L>=3||COARSE)?1024:2048;SHD.max=[1500,1500,1000,600,400][L];SHD.every=[2,2,3,3,4][L];if(bloomPass){bloomPass.strength=L>=2?.45:.62;bloomPass.enabled=L<4}if(PR!==p0)window.__q5resize=1}// (the resize waits for the next frame's render: done here, after this frame was drawn, it left one blank frame — a black flash)
function adapt(dt){if(window.__noAdapt)return;if(perf.skip>0){perf.skip--;return}const now=q5s_now();if(now-q5s_swT<4000){perf.t=0;perf.n=0;perf.slow=0;perf.bad=0;return}
 perf.t+=dt;perf.n++;if(dt>.07&&dt<.5&&!busy)perf.slow=(perf.slow||0)+1;if(dt>.026&&dt<.5&&!busy)perf.jank=(perf.jank||0)+1;if(perf.t<2.5)return;const fps=perf.n/perf.t,slow=perf.slow||0,jank=(perf.jank||0)/perf.n;perf.t=0;perf.n=0;perf.slow=0;perf.jank=0;if(perf.hold>0){perf.hold--;return}
 const up=perf.q5up||(perf.q5up={});perf.bad=perf.bad||0;perf.good=perf.good||0;
 if((fps<Q5DOWN||slow>=8||jank>.1)&&perf.lvl<4){perf.good=0;if(++perf.bad>=2){perf.bad=0;up[perf.lvl]=now;perf.lvl++;perf.hold=1;applyLevel();q5s_log('level',{to:perf.lvl,fps:+fps.toFixed(0),slow,jank:+jank.toFixed(2),why:'slow'})}}
 else if(fps>57&&slow<=1&&jank<.02&&perf.lvl>0){perf.bad=0;const back=perf.lvl-1,wait=60000*Math.pow(2,perf.q5osc||0);if(up[back]&&now-up[back]<wait){perf.good=0;return}
  if(++perf.good>=6){perf.good=0;if(up[back])perf.q5osc=(perf.q5osc||0)+1;perf.lvl--;perf.hold=2;applyLevel();q5s_log('level',{to:perf.lvl,fps:+fps.toFixed(0),slow,why:'fast'})}}
 else{perf.good=0;if(!(fps<Q5DOWN||slow>=8||jank>.1))perf.bad=0}}
/* a modest phone starts one step down (a phone already caps its resolution at 1.3, its shadow map at 1024, and its detail two steps below the best) */
if(COARSE&&((navigator.deviceMemory&&navigator.deviceMemory<=4)||(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4)))setTimeout(()=>{if(perf.lvl===0){perf.lvl=1;applyLevel();q5s_log('level',{to:1,why:'phone'})}},0);

/* ---- a lost WebGL context: the loop stops, a quiet notice shows, the picture comes back on restore (three.js rebuilds its
   GL state; every world's shaders are made again in slices) or the page reloads after 3 s ---- */
let q5s_halt=false,q5s_ctxT=0;
const q5s_notice=document.createElement('div');q5s_notice.id='q5note';q5s_notice.textContent='画面重新载入中';q5s_notice.style.cssText='position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:30;font-size:14px;letter-spacing:.3em;color:rgba(233,240,234,.7);background:rgba(2,4,6,.7);padding:12px 22px;border-radius:12px;opacity:0;pointer-events:none;transition:opacity .6s';document.body.appendChild(q5s_notice);
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();q5s_halt=true;q5s_notice.style.opacity=1;q5s_log('ctxlost');console.warn('q5s: WebGL context lost');clearTimeout(q5s_ctxT);q5s_ctxT=setTimeout(()=>{if(q5s_halt)location.reload()},window.__q5ctxWait||3000)},false);
canvas.addEventListener('webglcontextrestored',()=>{clearTimeout(q5s_ctxT);if(!q5s_halt)return;q5s_halt=false;q5s_log('ctxrestored');for(const id in SP){const sc=SP[id].scene;sc.__q5c=0;if(SP[id]===CUR)try{renderer.compile(sc,camera)}catch(e){}}try{renderer.shadowMap.needsUpdate=true}catch(e){}
 q5s_switched();perf.skip=5;setTimeout(()=>{q5s_notice.style.opacity=0},600);last=performance.now();requestAnimationFrame(loop)},false);
window.__q5ctx={x:null,lose(){const x=this.x=renderer.getContext().getExtension('WEBGL_lose_context');if(x)x.loseContext();return !!x},restore(){if(this.x)this.x.restoreContext()}};// (test hook; the extension object is kept: getExtension returns null while the context is lost)

/* ---- memory: on a phone or a small-memory machine, a world not visited for three minutes is let go (its geometry and
   materials freed, its spot remembered), keeping 绒球 and the current one; it is built again on the next visit ---- */
const q5s_saved={};const q5s_tight=COARSE||(navigator.deviceMemory&&navigator.deviceMemory<=4);
function q5s_dispose(id){const sp=SP[id];if(!sp||sp===CUR)return;q5s_saved[id]=sp.saved||q5s_saved[id];const seenG=new Set(),seenM=new Set();let ng=0,nm=0;
 sp.scene.traverse(o=>{if(o.geometry&&!seenG.has(o.geometry)){seenG.add(o.geometry);try{o.geometry.dispose();ng++}catch(e){}}const ms=o.material?(Array.isArray(o.material)?o.material:[o.material]):[];for(const m of ms){if(!m||seenM.has(m))continue;seenM.add(m);try{m.dispose();nm++}catch(e){}}});
 try{if(sp.sunL&&sp.sunL.shadow&&sp.sunL.shadow.map){sp.sunL.shadow.map.dispose()}}catch(e){}
 for(const j of q5s_J.slice())if(j.sc===sp.scene)q5s_J.splice(q5s_J.indexOf(j),1);
 delete SP[id];if(typeof BSP!=='undefined'&&BSP===sp)BSP=CUR&&CUR.type==='planet'?CUR:null;q5s_log('dispose',{id,ng,nm})}
setInterval(()=>{if(!q5s_tight||!CUR||busy)return;const ids=Object.keys(SP);if(ids.length<4)return;const now=q5s_now();let old=null;for(const id of ids){const sp=SP[id];if(sp===CUR||id==='rongqiu')continue;const t=sp.__q5t||0;if(now-t<180000)continue;if(!old||t<(SP[old].__q5t||0))old=id}if(old)q5s_dispose(old)},30000);
window.__q5s={dispose:q5s_dispose,jobs:q5s_J,farCull:q5s_farCull,get halt(){return q5s_halt},adapt:dt=>adapt(dt),get perf(){return perf},switched:q5s_switched,quiet(){q5s_swT=-1e9},saved:q5s_saved};

/* ---- the near shadow map is redrawn every second or third frame; after a long frame the last map stays one more frame
   (nothing visible changes: the box only moves with the view), unless it is already half a second old ---- */
let q5s_shLastT=0;function shadowFollow(sp,sun,sdot){q4b_shadowFollow(sp,sun,sdot);if(renderer.shadowMap.needsUpdate){const now=q5s_now();if(q5s_blown()&&!busy&&!tw&&now-q5s_shLastT<500)renderer.shadowMap.needsUpdate=false;else q5s_shLastT=now}}

/* ---- the shadow map only needs what can throw a shadow into its box: before it is drawn, every culled set (a stand of trees,
   a town, a herd's ground) whose sphere lies wholly outside the column the box casts along the sun is hidden, and shown
   again for the picture itself. Without this the shadow pass drew nearly the whole visible planet a second time, every
   other frame, so those frames took twice as long as the ones between them ---- */
/* ---- and the picture only needs what is in front of the camera: the culled sets are instanced or merged meshes that three.js
   cannot cull itself (an instanced set's bounds are one instance's), so just before the frame is drawn every set whose
   sphere is outside the view — and outside the column the shadow box casts along the sun, where it could still throw a
   shadow into view — is hidden, and shown again once the frame is drawn (the camera's flight planning and the
   line-of-sight tests still see them). On a meadow this halves what is drawn ---- */
const q5s_fout=[],q5s_fr=new THREE.Frustum(),q5s_fm=new THREE.Matrix4(),q5s_fs=new THREE.Sphere();
function q5s_frustumHide(sp,cam){q5s_frustumShow();if(window.__q5noFC||!sp||sp.type!=='planet'||!sp.culls)return;cam.updateMatrixWorld();q5s_fm.multiplyMatrices(cam.projectionMatrix,cam.matrixWorldInverse);q5s_fr.setFromProjectionMatrix(q5s_fm);
 const sun=sp.sunL,shd=sun&&SHD.on&&!sun.userData.pk,C=shd&&sun.target.position,h=shd?sun.shadow.camera.right*1.42:0;let dx=0,dy=0,dz=0;
 if(shd){dx=sun.position.x-C.x;dy=sun.position.y-C.y;dz=sun.position.z-C.z;const l=Math.hypot(dx,dy,dz)||1;dx/=l;dy/=l;dz/=l}
 const test=(o,cc,r)=>{if(!o.visible)return;q5s_fs.center.copy(cc);q5s_fs.radius=r;if(q5s_fr.intersectsSphere(q5s_fs))return;
  if(shd){const x=cc.x-C.x,y=cc.y-C.y,z=cc.z-C.z,al=x*dx+y*dy+z*dz,pp=x*x+y*y+z*z-al*al,lim=h+r;if(pp<=lim*lim&&al>=-(r+h*1.2))return}
  o.visible=false;q5s_fout.push(o)};
 for(const c of sp.culls)test(c.o,c.c,c.r);
 // the entries' own models (a creature, a town, a tree) the same way, with a margin for the parts that move
 if(sp.entL){const pxk=innerHeight/(2*Math.tan(camera.fov*Math.PI/360))/1.5,cp=camera.position;for(const x of sp.entL){test(x.root,x.c,x.r*1.3+4);
  if(x.root.visible){if(!x.o)x.o=x.root;const id=x.root.userData.pick;q5s_detail(x,cp.distanceTo(x.c),pxk,id===sel||(sp.follow&&sp.follow.id===id))}}}}
function q5s_frustumShow(){for(const o of q5s_fout)o.visible=true;q5s_fout.length=0}
{const _shR=renderer.shadowMap.render;const _hid=[],_v=new THREE.Vector3();
 const shadowPass=function(lights,scene,cam){const sp=CUR;
  if(!sp||sp.type!=='planet'||!sp.culls||!sp.sunL||!this.enabled||(this.autoUpdate===false&&this.needsUpdate===false)||window.__q5shAll)return _shR.call(this,lights,scene,cam);
  const sun=sp.sunL;if(sun.userData.pk)return _shR.call(this,lights,scene,cam);
  const C=sun.target.position,h=sun.shadow.camera.right*1.42,dir=_v.copy(sun.position).sub(C).normalize();
  for(const c of sp.culls){const o=c.o;if(!o.visible)continue;const x=c.c.x-C.x,y=c.c.y-C.y,z=c.c.z-C.z;const al=x*dir.x+y*dir.y+z*dir.z;const pp=x*x+y*y+z*z-al*al;const lim=h+c.r;
   if(pp>lim*lim||al<-(c.r+h*1.2)){o.visible=false;_hid.push(o)}}
  try{return _shR.call(this,lights,scene,cam)}finally{for(const o of _hid)o.visible=true;_hid.length=0}};
 renderer.shadowMap.render=shadowPass}

/* ---- how long one slice of a background rebuild (the near patch, its grass, the ground cover) may take in a frame ---- */
function q5s_slice(){return q5s_blown()?1.5:COARSE?3.5:5}
function q2_jobStart(P,c,T,ti){return q5s_span('q2start',()=>q2_jobStartBase(P,c,T,ti))}
 function q2_jobStep(J){const st=J.stage;return q5s_span('q2s'+st,()=>q2_jobStepBase(J))}
function q2_lines(sp,c,deg){return q5s_span('q2lines',()=>q2_linesBase(sp,c,deg))}

/* ---- quality defaults: an exhibition first, smooth and quick before anything else.
   shadows always stay (their map, reach and redraw rate step down with the quality level); grass, the near ground patch,
   ambient occlusion, cloud self-shadow, micro-grain and close tree detail start one step below the best (a phone two);
   the quality drops a step as soon as the frame rate stays under Q5DOWN, or more than one frame in ten misses its refresh
   (a steady 45 fps judders more than it looks in an average); it comes back only when frames are nearly all on time ---- */
function Q5OFF(){return window.__q5off!==undefined?window.__q5off:1}
const Q5DOWN=52;
setTimeout(()=>{try{Object.assign(window.__rq.dbg,{post:()=>({bloomPass,composer,finalPass,fxaaPass}),setLvl:L=>{perf.lvl=L;applyLevel()},perf:()=>perf,tw:()=>tw})}catch(e){}},0);
