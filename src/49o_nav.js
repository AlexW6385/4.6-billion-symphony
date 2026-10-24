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
function q4c_body(id,c){if(!id)return null;let best=null,bd=1e18,bestH=null,bdH=1e18;const sc=CUR.scene;
 sc.traverse(o=>{if(!o.userData||o.userData.pick!==id||o.isInstancedMesh)return;let v=o,vis=true;while(v){if(v.visible===false){vis=false;break}v=v.parent}o.getWorldPosition(q4c_tmpV);const d=c?q4c_tmpV.distanceToSquared(c):0;
  if(vis){if(d<bd){bd=d;best=o}}else if(d<bdH){bdH=d;bestH=o}});return best||bestH}
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
 const fb=c0.clone();S.c=()=>{let c=S.p?proxCenter(S.p):null;if(!c||c.lengthSq()<1)c=fb;if(S.obj&&S.cl&&S.obj.visible)return S.obj.localToWorld(q4c_tmpV.copy(S.cl)).clone();return c.clone()};
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
function q4c_vis(S,c,skipCut){const cam=camera;const dist=cam.position.distanceTo(c);if(!(dist>1))return 0;
 const dir=c.clone().sub(cam.position).normalize();const rt=new THREE.Vector3().crossVectors(dir,cam.up).normalize(),up=new THREE.Vector3().crossVectors(rt,dir).normalize();
 const nrm=CUR.type==='planet'?c.clone().normalize():CUR.type==='tube'?tubeUp(Math.atan2(-c.x,-c.y)/D2R):new THREE.Vector3(0,1,0);
 const rr=Math.max(S.r,1.5);const pts=[c,c.clone().addScaledVector(rt,rr*.6),c.clone().addScaledVector(rt,-rr*.6),c.clone().addScaledVector(up,rr*.6),c.clone().addScaledVector(up,-rr*.45),c.clone().addScaledVector(nrm,rr*.8)];
 let clear=0;const hull=new THREE.Sphere(c,rr*1.08);
 for(const Q of pts){const d=Q.clone().sub(cam.position);const L=d.length();d.normalize();q4c_rc.set(cam.position,d);q4c_rc.camera=cam;
  let far=L-1;if(q4c_rc.ray.intersectSphere(hull,q4c_tmpV))far=Math.min(far,cam.position.distanceTo(q4c_tmpV)-.5);q4c_rc.far=Math.max(.5,far);
  let blocked=false;for(const h of occCast(q4c_occ)){const o=h.object;if(!o.isMesh||q4c_own(o,S.id))continue;if(o===CUR.ocean)continue;// the sea is seen through, it never hides what swims in it
  const m=Array.isArray(o.material)?o.material[0]:o.material;if(!q4c_solid(m))continue;if(!q4c_occ&&!isVis(o))continue;if(skipCut&&!CUT.off&&dist<700&&cuttable(o,S.rc))continue;blocked=true;break}
  if(!blocked)clear++}
 return clear/pts.length}
/* the camera itself must stand in the open: not under the ground, not inside a wall, a trunk or a crown */
function q4c_camFree(S,c){const cam=camera;if(CUR.type==='planet'){const ll=llDir(cam.position);if(cam.position.length()-R-Math.max(0,CUR.gh(ll[0],ll[1]))<6)return false}
 const d=cam.position.clone().sub(c);const L=d.length();d.normalize();const r0=Math.min(L*.5,Math.max(S.r,1.5)*1.1);q4c_rc.set(c.clone().addScaledVector(d,r0),d);q4c_rc.far=L-r0+5;q4c_rc.camera=cam;
 const bad=o=>{if(!o.isMesh||q4c_own(o,S.id))return false;const m=Array.isArray(o.material)?o.material[0]:o.material;return q4c_solid(m)&&(q4c_occ||isVis(o))};
 for(const h of occCast(q4c_occ)){if(bad(h.object)&&Math.abs(h.distance-(L-r0))<7)return false}
 for(const dd of[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]){q4c_rc.set(cam.position,q4c_tmpV.set(dd[0],dd[1],dd[2]));q4c_rc.far=4;for(const h of occCast(q4c_occ))if(bad(h.object))return false}
 return true}
/* search for a pose with a clear view: the heading turns first; the height changes (down as well as up) only when turning is not enough */
function q4c_clear(S,c,base,wx,wy,lite){const sv={a:rig.a,b:rig.b,alt:rig.alt,head:rig.head,y:rig.y};const gs=_gS,gt=_gT;const t=CUR.type;const big0=CUT.big;
 q4c_occ=occList(c,Math.max(260,S.r*6));let best=null,bs=-1,big=false;try{
  const heads=lite?[0,.8,-.8,1.6,-1.6]:[0,.8,-.8,1.6,-1.6,2.5,-2.5];const mults=lite?[1,1.3,.75,.5]:t==='tube'?[1,.75,1.4,.5,1.9]:[1,.7,1.4,.5,2,.35,3];
  const run=()=>{outer:for(const m of mults)for(const h of heads){const alt=clamp(base.alt*m,altMin()+8,altMax());const pose=q4c_aim(c,alt,base.head+h,wx,wy,base.y);Object.assign(rig,{a:pose.a,b:pose.b,alt:pose.alt,head:pose.head,y:pose.y});_gS=null;rigPose();
   let sc=q4c_vis(S,c,true);const cf=sc>0?q4c_camFree(S,c):null;if(cf===false)sc=0;if(window.__q4cDbg)window.__q4cDbg.push([m,+h.toFixed(1),+sc.toFixed(2),cf]);sc-=Math.abs(h)*.012+Math.abs(Math.log(m))*.05;
   if(sc>bs){bs=sc;best=pose}if(sc>=.95)break outer}};
  run();
  // enclosed on every side (a creature deep in a clump of trees): let the cutaway take bigger things and look again
  if(bs<=0&&!lite&&S.id&&!CUT.off){CUT.big=true;big=true;run()}
 }finally{q4c_occ=null;CUT.big=big0;Object.assign(rig,sv);_gS=gs;_gT=gt;rigPose()}
 best=best||base;best.sc=bs;best.big=big;return best}
/* how long a flight takes: a short hop for something already in view, up to a few seconds across a world */
function q4c_dist(to){const t=CUR.type;if(t==='planet')return angDeg(dirLL(rig.a,rig.b),dirLL(to.a,to.b))*R*D2R;if(t==='tube')return Math.hypot(to.a-rig.a,wrap180(to.b-rig.b)*CUR.Rt*D2R,(to.y||0)-rig.y);return Math.hypot(to.a-rig.a,to.b-rig.b,(to.y||0)-rig.y)}
function q4c_dur(to){const d=q4c_dist(to);const za=Math.abs(Math.log(to.alt/rig.alt)),dh=Math.abs(((to.head-rig.head+Math.PI*3)%(Math.PI*2))-Math.PI);const rel=d/Math.max(40,rig.alt,to.alt);
 return clamp(.5+Math.min(2.2,rel*.55+Math.sqrt(d)/40)+za*.35+dh*.2,.6,3.4)}
function q4c_same(to){return q4c_dist(to)<rig.alt*.02&&Math.abs(Math.log(to.alt/rig.alt))<.04&&Math.abs(((to.head-rig.head+Math.PI*3)%(Math.PI*2))-Math.PI)<.03}
/* go and look at an entry (the card is already open when this is called, so the free part of the screen is known) */
function q4c_goto(id,p,opt){opt=opt||{};if(!CUR||CUR.camOv)return;const w=W[id];
 if(CUR.type==='planet'&&w&&(w.moon||w.id==='moon'||w.id==='moon_bus'||w.id==='ex_moon')){if(!moonView(w))flyTo(18,-25,2600,1.8);return}
 // a herd member: the one that was clicked, else the member nearest the camera (not the herd's home spot)
 if(!p&&w&&CUR.type==='planet'){const L=CUR.prox.filter(x=>x.w.id===id&&x.herd&&!x.side&&eraOk(x.e)&&herdVisible(CUR,x.herd,ERA));if(L.length){const D=[];for(const x of L){const c=proxCenter(x);if(c)D.push([c.distanceToSquared(camera.position),x])}D.sort((a,b)=>a[0]-b[0]);
  // of the few nearest members, the one that can be seen most clearly (trees no longer step aside for the camera)
  let bs=-1;const wt0=q4c_want();for(const [,x] of D.slice(0,4)){const S0=q4c_subject(id,x);if(!S0)continue;const c0=S0.c();const a0=q4c_altFor(S0,wt0.fill,c0,wt0.vo?0:wt0.wy);const ps=q4c_clear(S0,c0,q4c_aim(c0,a0,rig.head,wt0.wx,wt0.wy),wt0.wx,wt0.wy,true);if(ps.sc>bs+.05){bs=ps.sc;p=x}}}}
 const S=q4c_subject(id,p);if(!S)return;if(S.p&&sel===id)selP=S.p;q4c_last={id,t:performance.now()};
 if(CUR.TU&&CUR.canyonTo!==undefined&&Math.abs(CUR.TU.uCanyon.value-CUR.canyonTo)>1e-3){CUR.TU.uCanyon.value=CUR.canyonTo;if(CUR.ocean)CUR.ocean.material.uniforms.uCanyon.value=CUR.canyonTo;if(CUR.cyStep)CUR.cyStep()}
 const c=S.c();const wt=q4c_want();const alt=opt.alt||q4c_altFor(S,wt.fill,c,wt.vo?0:wt.wy);
 let pose=q4c_aim(c,alt,opt.head!==undefined?opt.head:rig.head,wt.wx,wt.wy);
 if(!opt.noClear&&!S.planetLevel&&!S.reg)pose=q4c_clear(S,c,pose,wt.wx,wt.wy);
 CUT.req={P:c.clone(),r:S.rc,id,big:!!pose.big};
 CUR.follow=null;
 if(q4c_same(pose)){tw=null;return}
 flyTo(pose.a,pose.b,pose.alt,q4c_dur(pose),pose.y,pose.head);tw.track={S,wx:wt.wx,wy:wt.wy,vo:wt.vo,live:false,settle:S.moving}}
/* a moving thing has gone on a little while the camera flew: one short, gentle correction on arrival, then the camera stays */
function q4c_settle(k){if(!k||!k.S||sel!==k.S.id)return;if(k.vo)q4c_voNow(k);const c=k.S.c();if(!c)return;const pose=q4c_aim(c,rig.alt,rig.head,k.wx,k.wy);if(pose.err<.12||q4c_same(pose))return;flyTo(pose.a,pose.b,pose.alt,.9,pose.y,pose.head);tw.track={S:k.S,wx:k.wx,wy:k.wy,vo:k.vo,live:false,settle:false}}
/* the same for a bare point (a side story's spot): keep the height, just make sure it can be seen */
function q4c_gotoPoint(P,r){if(!CUR||CUR.camOv)return;const S={id:null,w:null,p:null,rp:r,r,rc:r,moving:false,c:()=>P.clone()};const wt=q4c_want();const base=tw?tw.to:rig;
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
