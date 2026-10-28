/* ================================================================
   q4c: going to an entry — framing by real size, exact centring, a clear line of sight, moving things kept in the middle.
   One path for every kind of entry: a click on a creature, a card link, a library row, a label, an arc button, a tour stop.
   ================================================================ */
const q4c_tmpV=new THREE.Vector3(),q4c_tmpB=new THREE.Box3(),q4c_tmpB2=new THREE.Box3(),q4c_rc=new THREE.Raycaster();
q4c_rc.params.Points.threshold=0;q4c_rc.params.Line.threshold=0;
const q4c_REG=Object.fromEntries(REGIONS.map(r=>[r.id,r]));
const q4c_solid=m=>!!(m&&!m.transparent&&m.depthWrite!==false&&m.blending!==THREE.AdditiveBlending&&m.visible!==false);
let q4c_last={id:null,t:-1e9};
/* the body that stands for an entry in the current scene: the pick-tagged root nearest the focus point (a shown one if any) */
/* (the pick-tagged objects of a scene, by entry id: one walk per change of the scene's contents, not one per jump) */
function q4c_picks(sc,fresh){const a=q5s_adds(sc);let I=sc.__q4cPick;if(fresh||!I||I.a!==a){const m=new Map();sc.traverse(o=>{const k=o.userData&&o.userData.pick;if(k&&!o.isInstancedMesh){let L=m.get(k);if(!L)m.set(k,L=[]);L.push(o)}});I=sc.__q4cPick={a,m}}return I.m}
function q4c_body(id,c,fresh){if(!id)return null;let best=null,bd=1e18,bestH=null,bdH=1e18;const sc=CUR.scene;
 (q4c_picks(sc,fresh).get(id)||[]).forEach(o=>{if(o.userData.pick!==id)return;let top=o;while(top.parent)top=top.parent;if(top!==sc)return;let v=o,vis=true;while(v){if(v.visible===false){vis=false;break}v=v.parent}o.getWorldPosition(q4c_tmpV);const d=c?q4c_tmpV.distanceToSquared(c):0;
  if(vis){if(d<bd){bd=d;best=o}}else if(d<bdH){bdH=d;bestH=o}});const r=best||bestH;return r||fresh?r:q4c_body(id,c,true)}
/* its bounding size, measured once in its own frame (centre offset + radius), so a moving creature is cheap to follow */
function q4c_bounds(o){const u=o.userData;if(u._q4c)return u._q4c;o.updateMatrixWorld(true);const B=q4c_tmpB.makeEmpty();
 o.traverse(m=>{if(!m.isMesh||m.isInstancedMesh||m.visible===false)return;const mt=Array.isArray(m.material)?m.material[0]:m.material;if(!mt||mt.visible===false||mt.blending===THREE.AdditiveBlending||(mt.transparent&&mt.opacity<.25))return;const g=m.geometry;if(!g||!g.attributes||!g.attributes.position)return;if(!g.boundingBox)g.computeBoundingBox();
  q4c_tmpB2.copy(g.boundingBox).applyMatrix4(m.matrixWorld);const s=q4c_tmpB2.getSize(q4c_tmpV);if(Math.max(s.x,s.y,s.z)>1600)return;B.union(q4c_tmpB2)});
 if(B.isEmpty()){u._q4c={r:0,cl:null};return u._q4c}const ctr=B.getCenter(new THREE.Vector3());const sz=B.getSize(q4c_tmpV);const r=Math.max(sz.x,sz.y,sz.z)*.5;
 u._q4c={r,cl:o.worldToLocal(ctr.clone())};return u._q4c}
/* what we are going to look at: a live centre, a size, whether it moves */
function q4c_subject(id,p){const w=W[id];if(!w&&!p)return null;const t=CUR.type;
 if(!p&&w)p=CUR.prox.find(x=>x.w.id===id&&!x.side&&(!x.hide||!x.hide())&&eraOk(x.e))||CUR.prox.find(x=>x.w.id===id&&!x.side&&eraOk(x.e))||null;
 const c0=p?proxCenter(p):(w?posOf(w):null);if(!c0)return null;
 const S={id,w,p,rp:p?p.r:Math.max(8,w?sizeOf(w)*.5:8),moving:!!(p&&p.c),reg:0,planetLevel:false,obj:null,r:0,cl:null};
 if(w&&t==='planet'){const rg=q4c_REG[w.id];if(rg&&rg.rad&&w.c==='地理')S.reg=rg.rad;if(w.id===CUR.id||w.id==='ex_planet'||w.id==='xm_planet')S.planetLevel=true}
 const o=q4c_body(id,c0);if(o){const b=q4c_bounds(o);if(b.r>0){S.obj=o;S.r=b.r;S.cl=b.cl}}
 if(!S.r){S.r=S.rp;if(!p&&w&&w.k&&w.k!=='none')S.r=Math.max(S.r,sizeOf(w)*.6)}S.rc=Math.max(S.rp,S.r*.6);
 // live centre: the measured body centre follows the moving root; a hidden body (a herd not yet near) falls back to its marker
 const fb=c0.clone();S.c=()=>{let c=S.p?proxCenter(S.p):null;if(!c||c.lengthSq()<1)c=fb;if(S.obj&&S.cl&&S.obj.visible){const b=S.obj.localToWorld(q4c_tmpV.copy(S.cl));
  // a herd's bodies are shared: one that has wandered far from this member's own spot now stands for someone else
  if(b.distanceTo(c)<Math.max(40,S.r*6))return b.clone()}return c.clone()};
 return S}
/* height of a point above the ground it stands over */
function q4c_above(c){const t=CUR.type;if(t==='planet'){const ll=llDir(c);return c.length()-R-Math.max(0,CUR.gh(ll[0],ll[1]))}
 if(t==='tube'){const ang=Math.atan2(-c.x,-c.y)/D2R;const d=CUR.wallR?Math.max(0,CUR.wallR(c.z,ang)):0;return CUR.Rt-Math.hypot(c.x,c.y)-d}return 0}
/* where on the screen the thing should sit, and how big it may be: the middle, unless the open card would cover it —
   then the middle of the free part (on a phone the card takes the lower half, so things go into the upper half) */
function q4c_want(){const Wd=innerWidth,Hd=innerHeight;rigPose();const v=TG.clone().project(camera);let wx=v.z<1?clamp(v.x,-.7,.7):0,wy=v.z<1?clamp(v.y,-.7,.7):0;let fill=.5,vo=false;
 const touring=document.body.classList.contains('touring')&&!document.body.classList.contains('tourcard');const cap=document.querySelector('#cap');
 if(cap&&cap.classList.contains('on')&&!touring){const L=cap.offsetLeft,T=cap.offsetTop,Rr=L+cap.offsetWidth,B=T+cap.offsetHeight;if(Rr>L&&B>T){
  if(Wd<=760){// a phone: the picture itself slides up (voTarget), the thing stays at the look-at point and only has to fit the free strip
   vo=true;fill=Math.min(fill,.55*Math.min(Wd,Math.max(80,T-8))/Hd)}
  else{const px=(wx*.5+.5)*Wd,py=(-wy*.5+.5)*Hd,ex=fill*Hd*.5+28;
   if(px+ex>L&&px-ex<Rr&&py+ex>T&&py-ex<B){// a narrow window: pick the roomiest free strip beside or above the card
    const C=[{x0:0,y0:0,x1:Wd,y1:T},{x0:Rr,y0:0,x1:Wd,y1:Hd},{x0:0,y0:0,x1:L,y1:Hd},{x0:0,y0:B,x1:Wd,y1:Hd}].map(r=>({...r,m:Math.min(r.x1-r.x0,r.y1-r.y0)})).sort((a,b)=>b.m-a.m)[0];
    if(C.m>80){wx=((C.x0+C.x1)/2)/Wd*2-1;wy=clamp(1-((C.y0+C.y1)/2)/Hd*2,-.45,.45);fill=Math.min(fill,.55*C.m/Hd)}}}}}
 return{wx,wy,fill:Math.max(.1,fill),vo}}
/* where the look-at point shows right now (the picture may be sliding): what a thing that sits on it must aim for */
function q4c_voNow(F){rigPose();const v=TG.clone().project(camera);if(v.z<1){F.wx=clamp(v.x,-.7,.7);F.wy=clamp(v.y,-.7,.7)}}
/* how high to stand so a thing of radius r fills a fair part of the view (small things a little less, big ones a little more).
   the view rests on the ground at a tilt, so the distance to the thing depends on where on the screen it is to sit (wy) and,
   on a planet, on how high it flies; the height is solved for that distance, not for the distance to the look-at point */
// trenches and pits: looked into from higher up, or their walls hide them
const Q4C_DEEP=new Set(['canyon','rift','inca_pit','abyss']);
function q4c_altFor(S,fill,c,wy){const t=CUR.type;if(S.planetLevel)return 2600;if(S.reg)return clamp(S.reg*D2R*R*2.2,420,1400);
 // close enough that the thing is the subject of the picture: a third of the view or more (a place with no body of its own, a little less)
 const r=S.r;let f=Math.min(fill,lerp(.16,.45,sm(3,40,r)));if(!S.obj)f=Math.min(f,S.w&&S.w.c==='地理'?.28:.34);
 const tn=Math.tan(camera.fov*D2R/2),D=r/(f*tn);const h=t==='planet'?Math.max(0,q4c_above(c)):0;let alt=D;
 for(let i=0;i<4;i++){const tl=tiltOf(t,alt);const phi=clamp(Math.atan((wy||0)*tn),-.5,Math.max(0,Math.min(.6,1.3-tl)));alt=(D*Math.cos(tl+phi)+h)/((1+tl*.2)*Math.max(.25,Math.cos(tl)))}
 // a place seen too low hides behind its own rims and walls
 if(t==='planet'&&S.w&&S.w.c==='地理'&&!S.obj)alt=Math.max(alt,80,r*(Q4C_DEEP.has(S.w.id)?15:7.5));
 return clamp(alt,altMin()+8,altMax())}
/* the rig pose that puts point P at screen position (wx,wy) for a given height and heading: a few Newton steps on (a,b).
   the ground under the target is taken as it is there (not the smoothed value from where the camera stands now) */
function q4c_aim(P,alt,head,wx,wy,y,init,iters){const t=CUR.type;const sv={a:rig.a,b:rig.b,alt:rig.alt,head:rig.head,y:rig.y};const gs=_gS,gt=_gT;
 let a,b;if(t==='planet'){const ll=llDir(P);a=ll[0];b=ll[1];y=0}else if(t==='tube'){a=P.z;b=Math.atan2(-P.x,-P.y)/D2R;if(y===undefined)y=clamp(q4c_above(P),0,CUR.Rt*.7)}else{a=-P.z;b=P.x;if(y===undefined)y=clamp(P.y,-400,400)}
 if(init){a=init.a;b=init.b}
 Object.assign(rig,{a,b,alt,head,y});const lim=()=>{if(t==='planet')rig.a=clamp(rig.a,-86,86);else if(t==='tube')rig.a=clamp(rig.a,CUR.zr[0],CUR.zr[1]);else{const L=CUR.bound||7000;rig.a=clamp(rig.a,-L,L);rig.b=clamp(rig.b,-L,L)}};
 const pr=()=>{_gS=null;rigPose();const v=q4c_tmpV.copy(P).project(camera);return v.z<1&&isFinite(v.x)?[v.x,v.y]:null};
 for(let i=0,n=iters||5;i<n;i++){const e=pr();if(!e)break;const ex=e[0]-wx,ey=e[1]-wy;if(Math.abs(ex)<.003&&Math.abs(ey)<.003)break;
  const da=t==='planet'?alt/(R*D2R)*.04:alt*.04,db=t==='planet'?da/Math.max(.2,Math.cos(rig.a*D2R)):t==='tube'?alt*.04/(CUR.Rt*D2R):da;
  const a0=rig.a,b0=rig.b;rig.a=a0+da;const ea=pr();rig.a=a0;rig.b=b0+db;const eb=pr();rig.b=b0;if(!ea||!eb)break;
  const j11=(ea[0]-e[0])/da,j21=(ea[1]-e[1])/da,j12=(eb[0]-e[0])/db,j22=(eb[1]-e[1])/db;const det=j11*j22-j12*j21;if(Math.abs(det)<1e-12)break;
  let sa=-( j22*ex-j12*ey)/det,sb=-(-j21*ex+j11*ey)/det;const mx=12;sa=clamp(sa,-da*mx,da*mx);sb=clamp(sb,-db*mx,db*mx);rig.a+=sa;rig.b+=sb;lim()}
 const e=pr();const out={a:rig.a,b:rig.b,alt,head,y:rig.y,err:e?Math.hypot(e[0]-wx,e[1]-wy):9};Object.assign(rig,sv);_gS=gs;_gT=gt;rigPose();return out}
/* a clear line of sight: rays from the camera to several points of the thing, stopped at its own hull; its own body never counts,
   and small things that the cutaway will sink while the card is open do not count either */
let q4c_occ=null;
const q4c_own=(o,id)=>{let v=o;while(v){if(v.userData&&v.userData.pick===id)return true;v=v.parent}return false};
/* (st, deadline: resumable — after the deadline it keeps its place in st and returns null; at least one ray per call) */
function q4c_vis(S,c,skipCut,beat,st,deadline){const cam=camera;const dist=cam.position.distanceTo(c);if(!(dist>1))return 0;
 const dir=c.clone().sub(cam.position).normalize();const rt=new THREE.Vector3().crossVectors(dir,cam.up).normalize(),up=new THREE.Vector3().crossVectors(rt,dir).normalize();
 const nrm=CUR.type==='planet'?c.clone().normalize():CUR.type==='tube'?tubeUp(Math.atan2(-c.x,-c.y)/D2R):new THREE.Vector3(0,1,0);
 const rr=Math.max(S.r,1.5);const pts=[c,c.clone().addScaledVector(rt,rr*.6),c.clone().addScaledVector(rt,-rr*.6),c.clone().addScaledVector(up,rr*.6),c.clone().addScaledVector(up,-rr*.45),c.clone().addScaledVector(nrm,rr*.8)];
 let clear=st?st.clear:0;const k0=st?st.i:0;const hull=new THREE.Sphere(c,rr*1.08);
 let left=pts.length-k0;const goal=beat===undefined?-1:beat*pts.length;// (with beat: stop as soon as this pose can no longer do better than the best so far)
 for(let k=k0;k<pts.length;k++){const Q=pts[k];if(clear+left<=goal)break;if(st&&deadline&&k>k0&&q5s_now()>deadline){st.i=k;st.clear=clear;return null}left--;const d=Q.clone().sub(cam.position);const L=d.length();d.normalize();q4c_rc.set(cam.position,d);q4c_rc.camera=cam;
  let far=L-1;if(q4c_rc.ray.intersectSphere(hull,q4c_tmpV))far=Math.min(far,cam.position.distanceTo(q4c_tmpV)-.5);q4c_rc.far=Math.max(.5,far);
  let blocked=false;for(const h of occCast(q4c_occ,q4c_rc)){const o=h.object;if(!o.isMesh||q4c_own(o,S.id))continue;if(o===CUR.ocean)continue;// the sea is seen through, it never hides what swims in it
  const m=Array.isArray(o.material)?o.material[0]:o.material;if(!q4c_solid(m))continue;if(!q4c_occ&&!isVis(o))continue;if(skipCut&&!CUT.off&&dist<700&&cuttable(o,S.rc))continue;blocked=true;break}
  if(!blocked)clear++}
 return clear/pts.length}
/* the camera itself must stand in the open: not under the ground, not inside a wall, a trunk or a crown */
function q4c_camFree(S,c){const cam=camera;if(CUR.type==='planet'){const ll=llDir(cam.position);if(cam.position.length()-R-Math.max(0,CUR.gh(ll[0],ll[1]))<6)return false}
 const d=cam.position.clone().sub(c);const L=d.length();d.normalize();const r0=Math.min(L*.5,Math.max(S.r,1.5)*1.1);q4c_rc.set(c.clone().addScaledVector(d,r0),d);q4c_rc.far=L-r0+5;q4c_rc.camera=cam;
 const bad=o=>{if(!o.isMesh||q4c_own(o,S.id))return false;const m=Array.isArray(o.material)?o.material[0]:o.material;return q4c_solid(m)&&(q4c_occ||isVis(o))};
 for(const h of occCast(q4c_occ,q4c_rc)){if(bad(h.object)&&Math.abs(h.distance-(L-r0))<7)return false}
 for(const dd of[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]){q4c_rc.set(cam.position,q4c_tmpV.set(dd[0],dd[1],dd[2]));q4c_rc.far=4;for(const h of occCast(q4c_occ,q4c_rc))if(bad(h.object))return false}
 return true}
/* search for a pose with a clear view: the heading turns first; the height changes (down as well as up) only when turning is not enough */
/* the search, in steps: each step tries poses for at most a few milliseconds and puts the camera back, so a jump can start
   flying at once and let the search finish over the next frames (lite: fewer poses; lite 2: the given pose only) */
function q4c_search(S,c,base,wx,wy,lite){const t=CUR.type;let occ=null;const occR=Math.max(260,S.r*6,Math.min(2600,base.alt*3.2));/* (the occluders, gathered on the first step: as far out as the camera may stand — a cloud next to the lens hides everything) */
 const heads=lite===2?[0]:lite?[0,.8,-.8,1.6,-1.6]:[0,.8,-.8,1.6,-1.6,2.5,-2.5];const mults=lite===2?[1]:lite?[1,1.3,.75,.5]:t==='tube'?[1,.75,1.4,.5,1.9]:[1,.7,1.4,.5,2,.35,3];
 const L=[];for(const m of mults)for(const h of heads)L.push([m,h]);
 let i=0,pass=0,best=null,bs=-1,done=false;
 // each pose is looked at in two parts (can the thing be seen; is the camera itself in the open), each part one unit of
 // work, so a step never runs much past its budget
 let pend=null;
 const place=pose=>{Object.assign(rig,{a:pose.a,b:pose.b,alt:pose.alt,head:pose.head,y:pose.y});_gS=null;rigPose()};
 const fin=(x,sc)=>{if(window.__q4cDbg)window.__q4cDbg.push([x.m,+x.h.toFixed(1),+(sc+x.pen).toFixed(2),x.cf]);if(sc>bs){bs=sc;best=x.pose}return sc>=.95};
 const partA=(m,h)=>{const alt=clamp(base.alt*m,altMin()+8,altMax());const pose=q4c_aim(c,alt,base.head+h,wx,wy,base.y);place(pose);
  // a pose that cannot put the thing where it belongs on screen (the camera held by the ground or a height limit) is no pose at
  // all; one that only nearly can pays for the miss
  const onScr=pose.err<.3;
  const pen=Math.abs(h)*.012+Math.abs(Math.log(m))*.05+pose.err*.8;const x={m,h,pose,pen,sc:0,cf:null,st:{i:0,clear:0},ph:onScr?'vis':'end'};pend=x;return false};
 const partB=dl=>{const x=pend;place(x.pose);
  if(x.ph==='vis'){const v=q4c_vis(S,c,true,bs+x.pen,x.st,dl);if(v===null)return false;x.sc=v;x.ph=v>0&&v-x.pen>bs?'free':'end';return false}
  if(x.ph==='free'){x.cf=q4c_camFree(S,c);x.ph='end';return false}
  pend=null;return fin(x,(x.cf===false?0:x.sc)-x.pen)};
 let occQ=null;
 return{step(ms){if(done)return true;if(!(ms>0))return false;if(!occ){if(!occQ)occQ=occListSteps(c,occR);if(!occQ.step(ms))return false;occ=occQ.L;if(ms<1e9)return false}const t0=q5s_now();const sv={a:rig.a,b:rig.b,alt:rig.alt,head:rig.head,y:rig.y};const gs=_gS,gt=_gT;const big0=CUT.big;q4c_occ=occ;if(pass)CUT.big=true;
   try{while(pend||i<L.length){if(!(ms>0)||q5s_now()-t0>ms)break;let hit;if(pend)hit=partB(t0+ms);else{const [m,h]=L[i++];hit=partA(m,h)}if(hit){done=true;break}}
    // enclosed on every side (a creature deep in a clump of trees): let the cutaway take bigger things and look again
    if(!done&&!pend&&i>=L.length){if(bs<=0&&!lite&&S.id&&!CUT.off&&!pass){pass=1;i=0}else done=true}}
   finally{q4c_occ=null;CUT.big=big0;Object.assign(rig,sv);_gS=gs;_gT=gt;rigPose()}return done},
  result(){const r=best||base;r.sc=bs;r.big=!!pass;return r}}}
function q4c_clear(S,c,base,wx,wy,lite){const q=q4c_search(S,c,base,wx,wy,lite);while(!q.step(1e9));return q.result()}
/* how long a flight takes: a short hop for something already in view, up to a few seconds across a world */
function q4c_dist(to){const t=CUR.type;if(t==='planet')return angDeg(dirLL(rig.a,rig.b),dirLL(to.a,to.b))*R*D2R;if(t==='tube')return Math.hypot(to.a-rig.a,wrap180(to.b-rig.b)*CUR.Rt*D2R,(to.y||0)-rig.y);return Math.hypot(to.a-rig.a,to.b-rig.b,(to.y||0)-rig.y)}
function q4c_dur(to){const d=q4c_dist(to);const za=Math.abs(Math.log(to.alt/rig.alt)),dh=Math.abs(((to.head-rig.head+Math.PI*3)%(Math.PI*2))-Math.PI);const rel=d/Math.max(40,rig.alt,to.alt);
 return clamp(.5+Math.min(2.2,rel*.55+Math.sqrt(d)/40)+za*.35+dh*.2,.6,3.4)}
function q4c_same(to){return q4c_dist(to)<rig.alt*.02&&Math.abs(Math.log(to.alt/rig.alt))<.04&&Math.abs(((to.head-rig.head+Math.PI*3)%(Math.PI*2))-Math.PI)<.03}
/* go and look at an entry (the card is already open when this is called, so the free part of the screen is known) */
function q4c_goto(id,p,opt){opt=opt||{};if(!CUR)return;if(CUR.camOv)moonRelease();// (a jump from the moon view — a card link, the tour, a shared link — used to be ignored until a click)
 const w=W[id];
 if(CUR.type==='planet'&&CUR.id!=='yue'&&w&&(w.moon||w.id==='moon'||w.id==='moon_bus'||w.id==='ex_moon')){if(!moonView(w))flyTo(18,-25,2600,1.8);return}
 // a herd member: the one that was clicked, else the member nearest the camera (not the herd's home spot)
 if(!p&&w&&CUR.type==='planet'){const L=CUR.prox.filter(x=>x.w.id===id&&x.herd&&!x.side&&eraOk(x.e)&&herdVisible(CUR,x.herd,ERA));if(L.length){const D=[];for(const x of L){const c=proxCenter(x);if(c)D.push([c.distanceToSquared(camera.position),x])}D.sort((a,b)=>a[0]-b[0]);
  // of the few nearest members, the one that can be seen most clearly (trees no longer step aside for the camera)
  let bs=-1;const wt0=q4c_want();for(const [,x] of D.slice(0,4)){const S0=q4c_subject(id,x);if(!S0)continue;const c0=S0.c();const a0=q4c_altFor(S0,wt0.fill,c0,wt0.vo?0:wt0.wy);const ps=q4c_clear(S0,c0,q4c_aim(c0,a0,rig.head,wt0.wx,wt0.wy),wt0.wx,wt0.wy,2);if(ps.sc>bs+.05){bs=ps.sc;p=x}}}}
 const S=q4c_subject(id,p);if(!S)return;if(S.p&&sel===id)selP=S.p;q4c_last={id,t:performance.now()};
 if(CUR.TU&&CUR.canyonTo!==undefined&&Math.abs(CUR.TU.uCanyon.value-CUR.canyonTo)>1e-3){CUR.TU.uCanyon.value=CUR.canyonTo;if(CUR.ocean)CUR.ocean.material.uniforms.uCanyon.value=CUR.canyonTo;if(CUR.cyStep)CUR.cyStep()}
 const c=S.c();const wt=q4c_want();const alt=opt.alt||q4c_altFor(S,wt.fill,c,wt.vo?0:wt.wy);
 let pose=q4c_aim(c,alt,opt.head!==undefined?opt.head:rig.head,wt.wx,wt.wy);
 // a clear view: searched for a few milliseconds now; what is left runs over the next frames while the camera is already on
 // its way, and the flight's end is moved to the clear pose (early in a flight the move does not show)
 let srch=null;if(!opt.noClear&&!S.planetLevel){const q=q4c_search(S,c,pose,wt.wx,wt.wy,!!S.reg);if(q.step(window.__q4cSync?1e9:0))pose=q.result();else srch=q}// (a region too: a cloud or a peak in the way is turned away from)
 const req=CUT.req={P:c.clone(),r:S.rc,id,big:!!pose.big};
 CUR.follow=null;
 const fly=pz=>{flyTo(pz.a,pz.b,pz.alt,q4c_dur(pz),pz.y,pz.head);tw.track={S,wx:wt.wx,wy:wt.wy,vo:wt.vo,live:false,settle:S.moving}};
 if(q4c_same(pose))tw=null;else fly(pose);
 if(srch){const sp=CUR,mine=tw;q5s_job('view:'+id,lim=>{if(CUR!==sp||q4c_last.id!==id||(tw&&tw!==mine))return true;if(!srch.step(Math.min(lim||3,3)))return false;
  const b=srch.result();req.big=!!b.big;if(q4c_same(b))return true;
  if(tw&&tw===mine){if(tw.t<.3)q4c_retarget(b);else if(tw.track)tw.track.after=b}else fly(b);return true})}}
/* a better view found while the camera is already flying. Early in the flight the end point moves and the start point is
   moved with it so that the pose of this frame stays exactly where it is (no jump); the height of the hop is kept. Later
   the flight finishes as planned and one short, gentle move to the better view follows on arrival (changing the end of
   a flight that is under way would jump, restarting it would stop the camera dead in mid-air) */
function q4c_retarget(pz){const e0=tw.t,k=Math.min(1,e0),e=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;tw.hopV=hopOf();
 const f=tw.from,o=tw.to,t=CUR.type,n={a:pz.a,b:pz.b,alt:pz.alt||o.alt,head:pz.head===undefined?o.head:pz.head,y:pz.y===undefined?o.y:pz.y};
 if(t==='planet'||t==='tube')n.b=o.b+wrap180(n.b-o.b);n.head=o.head+((n.head-o.head+Math.PI*3)%(Math.PI*2)-Math.PI);
 const re=(fv,ov,nv)=>{const cur=fv+(ov-fv)*e;return e<.999?(cur-e*nv)/(1-e):cur};
 const la=re(Math.log(f.alt),Math.log(o.alt),Math.log(n.alt));
 tw.from={...f,a:re(f.a,o.a,n.a),b:re(f.b,o.b,n.b),y:re(f.y,o.y,n.y),head:re(f.head,o.head,n.head),alt:Math.exp(la)};tw.to=n}
function q4c_arrive(tr){if(!tr)return;if(tr.after&&CUR&&q4c_last.id===(tr.S&&tr.S.id)&&!q4c_same(tr.after)){const b=tr.after;flyTo(b.a,b.b,b.alt,1.1,b.y,b.head);tw.track={S:tr.S,wx:tr.wx,wy:tr.wy,vo:tr.vo,live:false,settle:tr.settle};return}
 if(tr.settle)q4c_settle(tr)}
/* a moving thing has gone on a little while the camera flew: one short, gentle correction on arrival, then the camera stays */
function q4c_settle(k){if(!k||!k.S||sel!==k.S.id)return;if(k.vo)q4c_voNow(k);const c=k.S.c();if(!c)return;if(c.distanceTo(TG)>Math.max(60,rig.alt*1.5))return;// (a correction is a small step, never a leap to somewhere else)
 const pose=q4c_aim(c,rig.alt,rig.head,k.wx,k.wy);if(pose.err<.12||q4c_same(pose))return;flyTo(pose.a,pose.b,pose.alt,.9,pose.y,pose.head);tw.track={S:k.S,wx:k.wx,wy:k.wy,vo:k.vo,live:false,settle:false}}
/* the same for a bare point (a side story's spot): keep the height, just make sure it can be seen */
function q4c_gotoPoint(P,r){if(!CUR)return;if(CUR.camOv)moonRelease();const S={id:null,w:null,p:null,rp:r,r,rc:r,moving:false,c:()=>P.clone()};const wt=q4c_want();const base=tw?tw.to:rig;
 let pose=q4c_aim(P,base.alt,base.head,wt.wx,wt.wy);pose=q4c_clear(S,P,pose,wt.wx,wt.wy);
 if(tw){tw.track=null;Object.assign(tw.to,{a:pose.a,alt:pose.alt,y:pose.y});tw.to.b=CUR.type==='planet'||CUR.type==='tube'?tw.from.b+wrap180(pose.b-tw.from.b):pose.b;tw.to.head=tw.from.head+((pose.head-tw.from.head+Math.PI*3)%(Math.PI*2)-Math.PI)}
 else if(!q4c_same(pose))flyTo(pose.a,pose.b,pose.alt,q4c_dur(pose),pose.y,pose.head)}
/* the pose to arrive at when another world is entered for an entry (worked out once that world is built) */
function q4c_entryRig(id){MW_ALL=true;CUR.scene.updateMatrixWorld(true);const S=q4c_subject(id,null);if(!S)return null;const c=S.c();const wt=q4c_want();const alt=q4c_altFor(S,wt.fill,c,wt.vo?0:wt.wy);return q4c_aim(c,alt,0,wt.wx,wt.wy)}
/* a flight toward something that moves keeps its destination on the thing */
function q4c_retrack(){const k=tw.track;if(!k||!k.S)return;if(k.vo)q4c_voNow(k);else if(!k.live)return;const c=k.live?k.S.c():(k.c0||(k.c0=k.S.c()));if(!c)return;/* a moving thing is aimed at where it was when the flight began */const pose=q4c_aim(c,tw.to.alt,tw.to.head,k.wx,k.wy,undefined,tw.to);
 tw.to.a=pose.a;tw.to.y=pose.y;tw.to.b=CUR.type==='planet'||CUR.type==='tube'?tw.from.b+wrap180(pose.b-tw.from.b):pose.b}
/* following: the pose that centres the thing is worked out every frame and the rig carries it forward, so the residual error
   decays while the thing's own motion is followed exactly; a blocked view turns the heading, height rises only within a cap */
function q4c_follow(dt){const F=CUR.follow;if(!F||tw||drag||pinch)return;if(sel!==F.id||(F.p&&F.p.hide&&F.p.hide())){CUR.follow=null;return}
 if(!F.S){const S=q4c_subject(F.id,F.p);if(!S){CUR.follow=null;return}F.S=S;const wt=q4c_want();F.wx=wt.wx;F.wy=wt.wy;F.vo=wt.vo;F.fill=wt.fill;F.alt0=rig.alt}
 if(F.vo)q4c_voNow(F);
 const c=F.S.c();if(!c||!(dt>0))return;const t=CUR.type;
 if(F.gAlt!==undefined){const k=1-Math.exp(-dt*2.2);rig.alt+=(F.gAlt-rig.alt)*k;rig.head+=(F.gHead-rig.head)*k;if(Math.abs(F.gAlt-rig.alt)<1&&Math.abs(F.gHead-rig.head)<.01)F.gAlt=undefined}
 const pose=q4c_aim(c,rig.alt,rig.head,F.wx,F.wy,undefined,F.prev||undefined,F.prev?2:5);const dB=x=>t==='planet'||t==='tube'?wrap180(x):x;
 // never let the camera end up on top of the thing it follows (a herd member that walked under it)
 if(F.gAlt===undefined&&camera.position.distanceTo(c)<Math.max(3,F.S.r*1.2)){F.gAlt=Math.min(altMax(),Math.max(rig.alt*1.5,q4c_altFor(F.S,F.fill||.26,c,F.vo?0:F.wy)));F.gHead=rig.head}
 if(pose.err>.4&&F.gAlt===undefined){F.gAlt=Math.min(altMax(),Math.max(rig.alt*1.4,q4c_altFor(F.S,F.fill||.26,c,F.vo?0:F.wy)));F.gHead=rig.head}
 if(F.prev){const da=pose.a-F.prev.a,db=dB(pose.b-F.prev.b),dy=pose.y-F.prev.y;const u=t==='planet'?R*D2R:1,cs=t==='planet'?Math.max(.15,Math.cos(pose.a*D2R)):1;
  if(Math.hypot(da*u,db*(t==='tube'?CUR.Rt*D2R:u*cs),dy)>Math.max(60,rig.alt*1.5)){F.prev=null;flyTo(pose.a,pose.b,rig.alt,1.2,pose.y,rig.head);tw.track={S:F.S,wx:F.wx,wy:F.wy,vo:F.vo,live:true};return}
  const k=1-Math.exp(-dt*3.5);rig.a=pose.a+(rig.a-F.prev.a)*(1-k);rig.b=pose.b+dB(rig.b-F.prev.b)*(1-k);rig.y=t==='planet'||t==='tube'?pose.y:pose.y+(rig.y-F.prev.y)*(1-k)}
 else Object.assign(rig,{a:pose.a,b:pose.b,y:pose.y});
 F.prev=pose;if(t==='planet')rig.a=clamp(rig.a,-86,86);else if(t==='tube')rig.a=clamp(rig.a,CUR.zr[0],CUR.zr[1]);
 // every so often: is it still in sight, and still the right size? a blocked view turns first, then goes lower or (within a cap) higher
 F.chk=(F.chk||0)+dt;if(F.chk>.6&&F.gAlt===undefined&&performance.now()-(F.adj||0)>3000){F.chk=0;rigPose();q4c_occ=occList(c,Math.max(260,F.S.r*6));let vis;try{vis=q4c_vis(F.S,c,true)}finally{q4c_occ=null}
  const cap=Math.min(altMax(),Math.max(F.alt0*1.6,F.S.r*20));const want=q4c_altFor(F.S,F.fill||.26,c,F.vo?0:F.wy);
  if(vis<.6){let b=q4c_clear(F.S,c,{alt:rig.alt,head:rig.head,y:rig.y},F.wx,F.wy,true);const now=performance.now();if(b.sc<.5&&now-(F.full||0)>2500){F.full=now;b=q4c_clear(F.S,c,{alt:Math.min(cap,Math.max(rig.alt,want)),head:rig.head,y:rig.y},F.wx,F.wy)}
   if(b.big&&!CUT.big){CUT.big=true;CUT.t=2}if(b.sc>vis+.25&&(Math.abs(b.head-rig.head)>.05||Math.abs(Math.log(b.alt/rig.alt))>.15)){F.gAlt=Math.min(cap,b.alt);F.gHead=b.head;F.adj=performance.now()}}
  else if(rig.alt<want*.75){F.gAlt=Math.min(cap,want);F.gHead=rig.head;F.adj=performance.now()}else if(rig.alt>want*2.4&&vis>.9){F.gAlt=Math.max(want*1.5,rig.alt*.7);F.gHead=rig.head;F.adj=performance.now()}}}

/* ---------- 5 · the camera keeps out of walls, pillars, roots and ridges ----------
   after the rig has placed the camera: a few rays from just above the point looked at back toward the camera, against the solid
   things near it (the same short list the view-clearing uses, less foliage); the camera slides in along its own arm to the first
   thing hit, quickly, and eases back out when the way is clear again */
const Q4P={L:null,t:0,c:V3(),k:0,sp:null,by:new Map()},_q4r=new THREE.Raycaster(),_q4a=V3(),_q4b=V3(),_q4c=V3(),_q4h=[];
function q4a_solids(sp,P,rr){const L=occList(P,rr),out=[];Q4P.by.clear();
 for(const e of L){const m=Array.isArray(e.material)?e.material[0]:e.material;if(!m)continue;const src=e.src||e;if(src===sp.ocean||src.userData.noPush||src.isPoints||src.isSprite)continue;
  // the thing being looked at, and anything alive and moving, never pushes the camera (its moving body made the view pump in and out)
  {let v=src,skip=false;while(v){const u=v.userData;if(u&&((sel&&u.pick===sel)||u.anim||u.herd)){skip=true;break}v=v.parent}if(skip)continue}
  const key=m.customProgramCacheKey?m.customProgramCacheKey():'';if(/sway|q2grass|q2flw/.test(key))continue;out.push(e);Q4P.by.set(src,e)}
 if(sp.terr&&!Q4P.by.has(sp.terr)){out.push(sp.terr);Q4P.by.set(sp.terr,sp.terr)}return out}
/* is the camera inside the thing this ray entered? the ray back from the camera toward the entry point finds no face of it
   if so (its inside faces are not drawn, nor hit); a thing wholly between the camera and the ground is left alone */
function q4a_inside(h,dist){const e=Q4P.by.get(h.object);if(!e)return false;_q4h.length=0;const o=_q4r.ray.origin,d=_q4r.ray.direction;
 const o0=o.clone(),d0=d.clone();o.copy(o0).addScaledVector(d0,dist);d.negate();_q4r.far=dist-h.distance+.1;/* (the entry face is a back face from this side, so only a real exit counts; +.1 keeps a grazing clip from reading as inside) */e.raycast(_q4r,_q4h);o.copy(o0);d.copy(d0);_q4r.far=dist;
 let gap=1e9;for(const q of _q4h)if(q.distance<_q4r.far&&(h.instanceId===undefined||q.instanceId===h.instanceId)&&q.distance<gap)gap=q.distance;
 return gap>1e8||gap<4}// (no face found on the way back: inside it; a face close behind the lens counts too)
function q4a_push(){const sp=CUR;if(!sp||sp.type!=='planet'||sp.camOv||window.__view||window.__q4nopush){Q4P.k=0;return}if(tw){Q4P.k*=.85;return}const alt=rig.alt;if(alt>160){Q4P.k=0;return}
 const now=performance.now();
 if(!Q4P.L||Q4P.sp!==sp||now-Q4P.t>1500||Q4P.c.distanceTo(TG)>30){Q4P.sp=sp;Q4P.t=now;Q4P.c.copy(TG);try{Q4P.L=q4a_solids(sp,TG,Math.max(80,alt*2.5))}catch(e){Q4P.L=[]}}
 _q4a.copy(TG).addScaledVector(UP,1.2);_q4b.copy(camera.position).sub(_q4a);const dist=_q4b.length();if(dist<3||!Q4P.L.length){Q4P.k*=.8;return}_q4b.divideScalar(dist);
 _q4r.near=0;_q4r.far=dist;_q4r.camera=camera;let best=dist;
 _q4c.crossVectors(_q4b,UP);const side=_q4c.lengthSq()>1e-6?_q4c.normalize():null;
 for(let s=-1;s<=1;s++){if(s!==0&&!side)continue;_q4r.ray.origin.copy(_q4a);if(s!==0)_q4r.ray.origin.addScaledVector(side,s*1.1);_q4r.ray.direction.copy(_q4b);_q4r.far=dist;
  const hits=_q4r.intersectObjects(Q4P.L,false);let n=0;for(const h of hits){if(h.distance<=.5)continue;if(++n>4)break;const ins=q4a_inside(h,dist);if(window.__q4dbg)window.__q4dbg.push([s,+h.distance.toFixed(1),+dist.toFixed(1),h.object.geometry&&h.object.geometry.type,h.instanceId,ins,_q4h.length]);if(ins){if(h.distance<best)best=h.distance;break}}}
 const want=best<dist?Math.max(dist*.12,best-1.6):dist;const tgt=1-want/dist;
 // eased, and small changes ignored, so a ray grazing a surface cannot make the view twitch
 if(Math.abs(tgt-Q4P.k)>.04)Q4P.k+=(tgt-Q4P.k)*(tgt>Q4P.k?.25:.06);else if(tgt<.01)Q4P.k*=.9;
 if(Q4P.k>1e-3){camera.position.copy(_q4a).addScaledVector(_q4b,dist*(1-Q4P.k));camera.lookAt(TG);camera.updateMatrixWorld()}}

function cutStep(dt){try{q4a_push();q4a_fill()}catch(e){}cutStepBase(dt)}
/* the building fill follows the sun of the world you are in */
function q4a_fill(){const sp=CUR;if(!sp)return;if(sp.type==='planet'&&sp.sunL){const d=sp.dayK===undefined?1:sp.dayK;Q4FILL.value.copy(sp.sunL.color).multiplyScalar(sp.sunL.intensity*.19*(.3+.7*d));Q4FILL.value.addScalar(.02)}else Q4FILL.value.setScalar(.1)}

window.__q4a={push:Q4P,fill:Q4FILL,town:q4a_town};
