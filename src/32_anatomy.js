/* ================================================================
   anatomy: smooth lofted bodies (one continuous skin from snout to tail tip),
   jointed legs with knees, ankles and feet, darker backs and paler bellies.
   these replace the old ball-and-stick dinosaurs and dragon-folk.
   ================================================================ */
/* spec: [[x,y,z, ry (half height), rz (half width)], ...] along the spine; o: {n rings, r sides, back, belly, stripe, spots, cap} */
function loftGeo(spec,o){o=o||{};const pts=spec.map(s=>V3(s[0],s[1],s[2]));const cur=new THREE.CatmullRomCurve3(pts,false,'centripetal');const N=o.n||Math.max(16,spec.length*8),S=o.r||14;
 const RY=new THREE.CatmullRomCurve3(spec.map((s,i)=>V3(i,s[3],0))),RZ=new THREE.CatmullRomCurve3(spec.map((s,i)=>V3(i,s[4],0)));
 const pos=[],col=[],idx=[];const back=C(o.back||'#6a6a52'),belly=C(o.belly||'#b8b09a'),cc=new THREE.Color(),T=V3(),U=V3(),Sd=V3(),up=V3(0,1,0);const L=spec.length-1;
 for(let i=0;i<=N;i++){const t=i/N;const p=cur.getPoint(t);cur.getTangent(t,T);U.copy(up).addScaledVector(T,-T.dot(up));if(U.lengthSq()<1e-6)U.set(1,0,0).addScaledVector(T,-T.x);U.normalize();Sd.copy(T).cross(U).normalize();
  const ry=Math.max(.004,RY.getPoint(t).y),rz=Math.max(.004,RZ.getPoint(t).y);
  for(let j=0;j<S;j++){const a=j/S*Math.PI*2;const sa=Math.sin(a),ca=Math.cos(a);pos.push(p.x+U.x*sa*ry+Sd.x*ca*rz,p.y+U.y*sa*ry+Sd.y*ca*rz,p.z+U.z*sa*ry+Sd.z*ca*rz);
   let k=sm(-.55,.45,sa);cc.copy(belly).lerp(back,k);
   if(o.stripe&&sa>-.1){const st=Math.sin(t*o.stripe*6.283+(o.ph||0));if(st>.35)cc.multiplyScalar(.78)}
   if(o.spots&&sa>-.2&&h3(Math.round(t*o.spots),j,7)>.82)cc.lerp(C(o.spotC||'#3a3020'),.55);
   col.push(cc.r,cc.g,cc.b)}}
 for(let i=0;i<N;i++)for(let j=0;j<S;j++){const a=i*S+j,b=i*S+(j+1)%S,c=(i+1)*S+j,d=(i+1)*S+(j+1)%S;idx.push(a,c,b,b,c,d)}
 // close both ends
 for(const end of[0,N]){const p=cur.getPoint(end/N);const ci=pos.length/3;pos.push(p.x,p.y,p.z);const c0=end?back:belly;col.push(c0.r,c0.g,c0.b);for(let j=0;j<S;j++){const a=end*S+j,b=end*S+(j+1)%S;if(end)idx.push(a,b,ci);else idx.push(a,ci,b)}}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.setIndex(idx);g.computeVertexNormals();return g}
const SKINM={};function skinMat(o){o=o||{};const k=(o.rough||.68)+'|'+(o.metal||0)+'|'+(o.em||'');return SKINM[k]||(SKINM[k]=new THREE.MeshStandardMaterial({vertexColors:true,roughness:o.rough||.68,metalness:o.metal||0,emissive:o.em||'#000000',emissiveIntensity:o.em?.35:0}))}
function loft(spec,o){return new THREE.Mesh(loftGeo(spec,o),skinMat(o))}
/* a leg that bends at the knee: thigh, knee, shin, ankle and a broad foot; keeps the {knee} hook stdAnim uses */
/* a muscled segment: a lathe whose radius swells near the top and thins to the joint, hanging down from y=0 */
const _segC=new Map();function muscle(len,r,prof,seg){const key=len.toFixed(3)+'|'+r.toFixed(3)+'|'+prof.join(',');let g=_segC.get(key);if(!g){const n=prof.length-1;g=new THREE.LatheGeometry(prof.map((k,i)=>new THREE.Vector2(Math.max(.002,k*r),-len*i/n)),seg||12);_segC.set(key,g)}return g}
const THIGH=[.55,1.05,1.22,1.12,.95,.8,.72],SHIN=[.72,.86,.82,.7,.6,.52,.5],UPARM=[.6,1.05,1.12,.95,.8,.7],FOREARM=[.7,.82,.78,.66,.56,.5];
function jleg(l1,l2,r,mat,bend,foot){const g=new THREE.Group();const th=new THREE.Mesh(muscle(l1,r,THIGH),mat);g.add(th);const hip=sph(0,r*1.15,r*1.15,r*1.15,10,mat);g.add(hip);
 const k=new THREE.Group();k.position.y=-l1;k.rotation.z=bend||0;g.add(k);const kn=sph(0,r*.8,r*.8,r*.8,10,mat);k.add(kn);const sh=new THREE.Mesh(muscle(l2,r,SHIN),mat);k.add(sh);
 // a hint of the calf behind the shin
 const cf=sph(0,r*.55,r*.85,r*.55,8,mat);cf.position.set(-r*.35,-l2*.28,0);k.add(cf);
 const ft=new THREE.Group();ft.position.y=-l2;ft.rotation.z=-(bend||0);k.add(ft);const fm=foot&&foot.mat||mat;const CL=M('#e8dcc0',{roughness:.4});
 if(foot&&foot.claws){const pad=sph(0,r*.9,r*.38,r*.75,10,fm);pad.position.set(r*.45,-r*.05,0);ft.add(pad);
  for(let i=-1;i<=1;i++){const toe=new THREE.Mesh(muscle(r*1.1,r*.32,[.9,1,.8,.55],6),fm);toe.rotation.z=Math.PI/2+.15;toe.position.set(r*.7,-r*.12,i*r*.42);toe.rotation.y=-i*.25;ft.add(toe);const c=cone(r*.15,r*.55,CL,5);c.position.set(r*1.85,-r*.3,i*r*.5);c.rotation.z=-Math.PI/2-.55;ft.add(c)}
  const dc=cone(r*.12,r*.4,CL,4);dc.position.set(-r*.45,-r*.05,0);dc.rotation.z=Math.PI/2+.4;ft.add(dc)}
 else{const pad=sph(0,r*1.1,r*.42,r*1.05,10,fm);pad.position.set(r*.25,-r*.1,0);ft.add(pad);for(let i=-1;i<=1;i++){const n=sph(0,r*.25,r*.18,r*.22,6,M('#3a3428'));n.position.set(r*1.15,-r*.2,i*r*.55);ft.add(n)}}
 g.userData.knee=k;g.userData.len=l1+l2;return g}
/* an arm: upper arm, elbow, forearm, a hand of three clawed fingers and a thumb */
function jarm(l1,l2,r,mat,bend){const g=new THREE.Group();g.add(new THREE.Mesh(muscle(l1,r,UPARM),mat));g.add(sph(0,r*1.25,r*1.2,r*1.2,10,mat));
 const k=new THREE.Group();k.position.y=-l1;k.rotation.z=bend||0;g.add(k);k.add(sph(0,r*.8,r*.8,r*.8,8,mat));k.add(new THREE.Mesh(muscle(l2,r,FOREARM),mat));
 const h=new THREE.Group();h.position.y=-l2;k.add(h);h.add(sph(0,r*.75,r*.55,r*.7,8,mat));const CL=M('#e8dcc0',{roughness:.4});
 for(let i=-1;i<=1;i++){const f=new THREE.Group();f.position.set(r*.2,-r*.3,i*r*.38);f.rotation.set(i*.25,0,.35);h.add(f);f.add(new THREE.Mesh(muscle(r*1.1,r*.26,[1,.9,.7],5),mat));const c=cone(r*.12,r*.4,CL,4);c.position.y=-r*1.25;c.rotation.z=Math.PI+.4;f.add(c)}
 const th=new THREE.Group();th.position.set(-r*.3,-r*.2,0);th.rotation.z=-.7;h.add(th);th.add(new THREE.Mesh(muscle(r*.7,r*.26,[1,.85,.6],5),mat));
 g.userData.knee=k;g.userData.hand=h;return g}
function mouthEye(g,x,y,z,r,c){for(const s of[-1,1]){const e=sph(0,r,r,r,10,M(c||'#0c0c10',{roughness:.08}));e.position.set(x,y,s*z);g.add(e);const lid=new THREE.Mesh(new THREE.SphereGeometry(r*1.25,10,6,0,Math.PI*2,0,Math.PI*.42),M('#4a4434'));lid.position.set(x,y+r*.15,s*z);lid.rotation.z=-.4;g.add(lid)}}

/* ---------- long-necked giants ---------- */
function bSauropod2(f){const g=new THREE.Group();const col=f.col||'#7a7a62',pois=f.w==='bosaidong';const o={back:col,belly:C(col).lerp(C('#e8e0c8'),.45).getStyle(),stripe:pois?0:7,spots:pois?40:0,spotC:'#2a4a2a'};const mat=M(col,{roughness:.72});
 const body=loft([[-1.7,1.95,0,.5,.45],[-1,2.15,0,.78,.7],[0,2.25,0,.88,.78],[.85,2.15,0,.8,.7],[1.5,2.25,0,.5,.45]],Object.assign({n:28},o));g.add(body);
 const ng=new THREE.Group();ng.position.set(1.3,2.2,0);g.add(ng);
 ng.add(loft([[0,0,0,.48,.42],[.55,.5,0,.32,.3],[.95,1.25,0,.24,.23],[1.2,2.0,0,.2,.19],[1.42,2.5,0,.17,.16],[1.62,2.72,0,.15,.14]],Object.assign({n:30},o,{stripe:0})));
 const head=loft([[1.5,2.7,0,.17,.16],[1.78,2.78,0,.2,.17],[2.05,2.72,0,.15,.13],[2.25,2.62,0,.09,.09]],Object.assign({n:16},o,{stripe:0}));ng.add(head);mouthEye(ng,1.95,2.82,.13,.035);
 const mouth=new THREE.Mesh(new THREE.TorusGeometry(.12,.012,4,12,Math.PI),M('#3a2a22'));mouth.position.set(2.1,2.62,0);mouth.rotation.set(Math.PI/2,0,-.4);ng.add(mouth);
 const tlg=new THREE.Group();tlg.position.set(-1.6,1.95,0);g.add(tlg);tlg.add(loft([[0,0,0,.48,.42],[-.9,-.3,0,.3,.27],[-1.9,-.6,0,.16,.15],[-2.9,-.75,0,.08,.08],[-3.7,-.72,0,.03,.03]],Object.assign({n:28},o)));
 if(!pois)for(let i=0;i<12;i++){const sp=cone(.07,.22,M(C(col).multiplyScalar(.7).getStyle()),4);sp.position.set(-1.4+i*.25,2.25+Math.sin(i*.26+.2)*.9*0+(.88-Math.abs(i-5.5)*.05),0);g.add(sp)}
 const L=[];for(const[x,z]of[[.9,-1],[.9,1],[-1.05,-1],[-1.05,1]]){const l=jleg(.95,.95,.25,mat,x>0?.12:-.18,{});l.position.set(x,1.92,z*.46);g.add(l);L.push({m:l,ph:(x>0?0:Math.PI)+(z>0?Math.PI:0),a:.42,k:x>0?.12:-.18})}
 if(f.armor){const pl=new THREE.Mesh(new THREE.BoxGeometry(1.2,.14,1.1),M('#6a5a40'));pl.position.y=3.1;g.add(pl)}
 g.scale.setScalar(.88);addLegs(g,L);g.userData.tails=[{m:tlg,a:.12,f:1.2}];stdAnim(g,{fq:3.2,amp:.26,extra:(t)=>{ng.rotation.z=Math.sin(t*.5)*.08;ng.rotation.y=Math.sin(t*.37)*.16;tlg.rotation.z=Math.sin(t*.8)*.04}});return g}

/* ---------- horned and frilled ---------- */
function bCeratops2(f){const g=new THREE.Group();const col=f.col||'#7a6a4a',black=f.w==='xm_heijiao',many=f.w==='duoji'||black;const o={back:col,belly:C(col).lerp(C('#e0d4b8'),.4).getStyle(),stripe:5,metal:black?.4:0,rough:black?.35:.68};const mat=M(col,{roughness:.7,metalness:black?.4:0}),horn=M('#ece2c8',{roughness:.4});
 g.add(loft([[-1.45,1.0,0,.36,.34],[-.75,1.18,0,.62,.6],[0,1.22,0,.68,.66],[.65,1.12,0,.6,.56],[1.05,1.0,0,.42,.4]],Object.assign({n:26},o)));
 const hg=new THREE.Group();hg.position.set(1.0,1.02,0);g.add(hg);
 hg.add(loft([[0,0,0,.4,.38],[.35,-.04,0,.36,.32],[.7,-.15,0,.25,.2],[.95,-.3,0,.12,.1]],Object.assign({n:16},o,{stripe:0})));
 const beak=cone(.11,.32,M('#2e261c',{roughness:.4}),6);beak.rotation.z=-Math.PI/2-.35;beak.position.set(1.05,-.38,0);hg.add(beak);mouthEye(hg,.45,.12,.25,.045);
 // the frill: a curved shield with a beaded rim
 const fr=new THREE.Mesh(new THREE.SphereGeometry(.85,20,8,0,Math.PI,0,Math.PI*.42),M(C(col).lerp(C('#c8704a'),.25).getStyle(),{side:THREE.DoubleSide,roughness:.6}));fr.rotation.set(0,Math.PI/2,0);fr.rotation.z=Math.PI/2+.5;fr.position.set(-.1,.25,0);fr.scale.set(1,1,.55);hg.add(fr);
 for(let i=0;i<11;i++){const a=(i/10)*Math.PI;const b=many?cone(.05,.32,horn,4):sph(0,.06,.06,.06,6,horn);b.position.set(-.38+Math.sin(a)*.05,.25+Math.sin(a)*.8,Math.cos(a)*.8);b.rotation.x=-Math.cos(a)*1.3;b.rotation.z=.6;hg.add(b)}
 const nh=cone(.07,many?.32:.42,horn,6);nh.position.set(.82,.0,0);nh.rotation.z=-.5;hg.add(nh);
 for(const z of[-1,1]){const h=tubeAlong([V3(.35,.32,z*.18),V3(.6,.65,z*.24),V3(.95,.85,z*.2)],.05,horn,8);hg.add(h);const tip=cone(.04,.14,horn,5);tip.position.set(.98,.88,z*.2);tip.rotation.z=-1.2;hg.add(tip)}
 const tl=new THREE.Group();tl.position.set(-1.4,1.0,0);g.add(tl);tl.add(loft([[0,0,0,.34,.32],[-.6,-.12,0,.2,.18],[-1.2,-.22,0,.08,.08],[-1.55,-.22,0,.02,.02]],Object.assign({n:14},o)));
 if(black){for(let i=0;i<3;i++){const sp=cone(.04,.9,M('#101012'),4);sp.position.set(.3-i*.3,1.85,0);sp.rotation.z=.4;g.add(sp)}}
 const L=[];for(const[x,z]of[[.62,-1],[.62,1],[-.75,-1],[-.75,1]]){const l=jleg(.42,.4,.15,mat,x>0?.3:-.25,{});l.position.set(x,.9,z*.44);l.rotation.x=z*.08;g.add(l);L.push({m:l,ph:(x>0?0:Math.PI)+(z>0?Math.PI:0),a:.55,k:x>0?.3:-.25})}
 addLegs(g,L);g.userData.tails=[{m:tl,a:.25,f:3}];stdAnim(g,{fq:5.5,amp:.35,extra:t=>{hg.rotation.z=Math.sin(t*.9)*.06;hg.rotation.y=Math.sin(t*.6)*.1}});return g}

/* ---------- running hunters on two legs ---------- */
function bRaptor2(f){const g=new THREE.Group();const big=f.w==='baojun';const col=f.col||'#8a6a3a';const o={back:col,belly:C(col).lerp(C('#e8dcc4'),.45).getStyle(),stripe:big?0:9};const mat=M(col,{roughness:.62});
 const k=big?1.25:1;
 g.add(loft([[-.55,1.22*k,0,.24*k,.2*k],[-.1,1.28*k,0,.36*k,.3*k],[.35,1.33*k,0,.36*k,.3*k],[.62,1.45*k,0,.24*k,.2*k],[.8,1.66*k,0,.15*k,.14*k]],Object.assign({n:22},o)));
 const hg=new THREE.Group();hg.position.set(.8,1.7*k,0);g.add(hg);const hk=big?1.7:1;
 hg.add(loft([[-.05,0,0,.15*hk,.13*hk],[.18*hk,.05,0,.16*hk,.13*hk],[.42*hk,.0,0,.11*hk,.1*hk],[.6*hk,-.04*hk,0,.06*hk,.06*hk]],Object.assign({n:16},o,{stripe:0})));
 const jaw=new THREE.Group();jaw.position.set(.05*hk,-.07*hk,0);hg.add(jaw);jaw.add(loft([[0,0,0,.06*hk,.1*hk],[.3*hk,-.03*hk,0,.05*hk,.08*hk],[.52*hk,-.03*hk,0,.03*hk,.05*hk]],{n:10,back:'#6a4a3a',belly:'#c8a890'}));
 for(let i=0;i<(big?9:6);i++)for(const z of[-1,1]){const tt=cone(.012*hk,.05*hk,M('#f4ecd8'),4);tt.position.set((.12+i*.05)*hk,-.06*hk,z*.07*hk);tt.rotation.x=Math.PI;hg.add(tt)}
 mouthEye(hg,.24*hk,.08*hk,.1*hk,.026*hk,big?'#d8a020':null);
 const tlg=new THREE.Group();tlg.position.set(-.5,1.22*k,0);g.add(tlg);tlg.add(loft([[0,0,0,.24*k,.2*k],[-.6*k,.02,0,.14*k,.12*k],[-1.3*k,.06,0,.06*k,.06*k],[-1.8*k,.08,0,.015,.015]],Object.assign({n:20},o)));
 if(!big){const fm=M(C(col).lerp(C('#e0b060'),.4).getStyle(),{side:THREE.DoubleSide});for(let i=0;i<9;i++){const fe=new THREE.Mesh(new THREE.PlaneGeometry(.06,.26),fm);fe.position.set(.55-i*.16,1.5-Math.abs(i-2)*.02,0);fe.rotation.z=.9;g.add(fe)}}
 const L=[];for(const z of[-1,1]){const l=jleg(.5*k,.62*k,.11*k,mat,.75,{claws:1});l.position.set(-.05,1.0*k,z*.2*k);g.add(l);L.push({m:l,ph:z>0?0:Math.PI,a:.7,k:.75})}
 for(const z of[-1,1]){const a=leg2(.22*k,.2*k,.035*k,mat,-1.1);a.position.set(.55,1.38*k,z*.2*k);g.add(a);const cl=cone(.015*k,.08*k,M('#e8dcc0'),4);cl.position.y=-.2*k;cl.rotation.z=Math.PI;a.userData.knee.add(cl)}
 addLegs(g,L);g.userData.tails=[{m:tlg,a:.18,f:4}];stdAnim(g,{fq:8,amp:.55,extra:t=>{jaw.rotation.z=-Math.max(0,Math.sin(t*1.7))*.25;hg.rotation.z=Math.sin(t*1.1)*.08}});return g}

/* ---------- dragon-folk: upright, long-snouted, with tails ---------- */
function bDragonkin2(f){const g=new THREE.Group();const id=f.w;
 const P={gulong:{c:'#8f8a80',st:'#ece6d4',sp:1},baihai:{c:'#ece8de',eye:'#8fffe8',sp:1,staff:1,patch:1,st:'#9a968c'},emerald:{c:'#2e9a5e',m:.35,round:1,sp:1,skull:1},rq_xuewu:{c:'#2f8a58',m:.35,round:1,scarf:1},
  ex_baixing:{c:'#f4f8ff',eye:'#bfe8ff',glow:1},zhuru:{c:'#3a2a20',small:1,pipe:1},dianzhuru:{c:'#3e3450',small:1,teeth:1},huojilong:{c:'#c84a2a',small:1,beak:1},banyu:{c:'#6a8a8a',fish:1},yinjia:{c:'#a4b0b8',m:.7,sp:1,silver:1}}[id]||{c:f.col||'#8a8070'};
 const col=P.c;const o={back:col,belly:C(col).lerp(C(P.glow?'#ffffff':'#f0e6cc'),.4).getStyle(),stripe:P.round?0:6,metal:P.m||0,rough:P.m?.35:.66,em:P.glow?col:''};const mat=M(col,{roughness:P.m?.35:.66,metalness:P.m||0});
 // torso leaning forward, neck curving up, a long snout
 g.add(loft([[-.12,.95,0,.3,.27],[0,1.25,0,.36,.32],[.12,1.55,0,.34,.3],[.22,1.8,0,.22,.2],[.36,1.98,0,.14,.13]],Object.assign({n:22},o)));
 const hg=new THREE.Group();hg.position.set(.38,2.02,0);g.add(hg);
 const hs=P.round?1.1:1;hg.add(loft(P.round?[[-.08,0,0,.2,.19],[.12,.03,0,.23,.2],[.32,0,0,.17,.15],[.45,-.04,0,.08,.08]]:[[-.08,0,0,.16,.15],[.14,.03,0,.17,.15],[.4,-.03,0,.1,.1],[.62,-.07,0,.06,.06]],Object.assign({n:16},o,{stripe:0})));
 if(P.st)for(let i=0;i<4;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(.3-i*.02,.025,4,16,Math.PI),M(P.st));r.position.set(.05+i*.04,1.0+i*.16,0);r.rotation.set(0,Math.PI/2,-.3);g.add(r)}
 if(P.fish){const fin=cone(.2,.4,mat,4);fin.position.set(0,.28,0);hg.add(fin)}
 mouthEye(hg,P.round?.24:.2,.09,P.round?.14:.11,.04,P.eye?null:null);if(P.eye)for(const z of[-1,1]){const e=sph(0,.045,.045,.045,8,GL(P.eye));e.position.set(P.round?.26:.22,.09,z*(P.round?.14:.11));hg.add(e)}
 for(const z of[-1,1]){const h=cone(.035,.22,M(C(col).multiplyScalar(.6).getStyle()),5);h.position.set(-.08,.18,z*.08);h.rotation.set(z*.3,0,.9);hg.add(h)}
 if(P.teeth){const m=sph(0,.12,.04,.12,8,GL('#ffe46a'));m.position.set(.4,-.08,0);hg.add(m)}
 if(P.beak){const bk=cone(.07,.22,M('#e8b040'),5);bk.rotation.z=-Math.PI/2;bk.position.set(.6,-.05,0);hg.add(bk)}
 const tlg=new THREE.Group();tlg.position.set(-.15,1.0,0);g.add(tlg);tlg.add(loft([[0,0,0,.26,.24],[-.5,-.15,0,.17,.15],[-1.05,-.24,0,.09,.09],[-1.55,-.18,0,.03,.03]],Object.assign({n:18},o)));
 const L=[];for(const z of[-1,1]){const l=jleg(.52,.5,.13,mat,.5,{claws:1});l.position.set(-.05,1.0,z*.21);g.add(l);L.push({m:l,ph:z>0?0:Math.PI,a:.9,k:.5})}
 // a row of small spines down the back and the tail
 {const SPN=M(C(col).multiplyScalar(.62).getStyle(),{roughness:.5});for(let i=0;i<9;i++){const t=i/8;const sp2=cone(.03+.025*(1-Math.abs(t-.35)),.12+.1*(1-Math.abs(t-.35)),SPN,4);sp2.position.set(.32-t*1.55,2.0-t*1.15+(t>.45?-(t-.45)*.2:0),0);sp2.rotation.z=.5+t*.6;g.add(sp2)}}
 const arms=[];for(const z of[-1,1]){const a=jarm(.36,.32,.07,mat,-.9);a.position.set(.25,1.62,z*.29);g.add(a);arms.push(a)}
 if(P.sp||P.staff){const s=cyl(.02,.02,2.1,M('#6a4a2a'),5);s.position.set(.55,1.25,.36);s.rotation.z=P.staff?.1:-.9;g.add(s);const tip=cone(.05,.16,P.staff?GL('#9ff2ff'):M('#8a8a80'),4);tip.position.set(P.staff?.65:1.4,P.staff?2.3:1.75,.36);tip.rotation.z=P.staff?0:-.9;g.add(tip)}
 if(P.pipe){const s=cyl(.015,.015,.7,M('#5a4a2a'),4);s.position.set(.85,1.95,0);s.rotation.z=-1.3;g.add(s)}
 if(P.scarf){const sc=new THREE.Mesh(new THREE.TorusGeometry(.17,.06,6,14),M('#c8302a'));sc.position.set(.26,1.78,0);sc.rotation.y=Math.PI/2;g.add(sc);const tailS=new THREE.Mesh(new THREE.PlaneGeometry(.5,.12),M('#c8302a',{side:THREE.DoubleSide}));tailS.position.set(-.05,1.7,-.1);g.add(tailS);const cr=sph(0,.08,.12,.05,6,EM('#ff5a5a',.8));cr.position.set(.38,1.45,0);g.add(cr)}
 // ---- per-race gear, after the book ----
 const BONE=M('#e9e1cc',{roughness:.8});const box=(x,y,z,m)=>new THREE.Mesh(new THREE.BoxGeometry(x,y,z),m);
 if(P.skull){// a horned skull worn as a helmet, a necklace of teeth, the spear tipped with a horn
  const sk=sph(0,.22,.14,.2,10,BONE);sk.position.set(.05,.22,0);hg.add(sk);const sn=sph(0,.14,.07,.09,8,BONE);sn.position.set(.27,.2,0);hg.add(sn);for(const z of[-1,1]){const hn=cone(.05,.42,BONE,5);hn.position.set(.12,.36,z*.13);hn.rotation.set(z*.5,0,-.7);hg.add(hn);const so=sph(0,.045,.04,.03,6,M('#2a2018'));so.position.set(.2,.24,z*.1);hg.add(so)}
  const nk=new THREE.Mesh(new THREE.TorusGeometry(.2,.014,4,16),M('#6a4a2a'));nk.position.set(.18,1.66,0);nk.rotation.set(0,Math.PI/2,-.35);g.add(nk);for(let i=0;i<9;i++){const a=Math.PI*(.15+.7*i/8);const t=cone(.018,.07,BONE,4);t.position.set(.18+Math.sin(a)*.2*Math.sin(.35)+.05,1.66-Math.sin(a)*.2*.94,Math.cos(a)*.2);t.rotation.z=Math.PI;g.add(t)}}
 if(P.patch){// crude pieced armour: mismatched plates lashed on
  const PC=['#d8ceb4','#b0a690','#e8dcc4','#9a9080'];for(let i=0;i<9;i++){const b=box(.24+(i%3)*.06,.2+(i%2)*.07,.06,M(PC[i%4],{roughness:.9}));const a=(i/9-.5)*3;b.position.set(.08+Math.cos(a)*.33,1.1+(i%3)*.2,Math.sin(a)*.33);b.rotation.set(0,-a+Math.PI/2,(i%2?.2:-.15));g.add(b)}
  const bl=new THREE.Mesh(new THREE.TorusGeometry(.32,.02,4,18),M('#5a4a34'));bl.position.set(0,1.2,0);bl.rotation.x=Math.PI/2;g.add(bl)}
 if(P.silver){// silver plate that throws back the light, a bright shield, dark lenses over the eyes
  const SV=M('#e8eef2',{metalness:.95,roughness:.18});const cu=new THREE.Mesh(new THREE.LatheGeometry([[.25,0],[.37,.18],[.38,.38],[.33,.58],[.22,.72]].map(p=>new THREE.Vector2(p[0],p[1])),16),SV);cu.position.set(.03,.98,0);cu.rotation.z=-.15;g.add(cu);
  const hm=sph(0,.2,.16,.19,12,SV);hm.position.set(.08,.08,0);hg.add(hm);const cr=box(.36,.05,.02,SV);cr.position.set(.05,.24,0);hg.add(cr);
  for(const z of[-1,1]){const ln=sph(0,.05,.045,.03,10,M('#0a0c10',{metalness:.9,roughness:.08}));ln.position.set(P.round?.26:.22,.1,z*.12);hg.add(ln)}
  const sh=new THREE.Mesh(new THREE.CylinderGeometry(.34,.34,.04,20),M('#f4f8fa',{metalness:1,roughness:.1}));sh.rotation.x=Math.PI/2;sh.position.set(.35,1.35,-.42);g.add(sh);const bs=sph(0,.07,.07,.05,8,M('#9ab4c4',{metalness:1,roughness:.2}));bs.position.set(.35,1.35,-.45);g.add(bs);
  for(const z of[-1,1]){const pd=sph(0,.14,.08,.12,8,SV);pd.position.set(.22,1.72,z*.3);g.add(pd)}}
 if(P.small)g.scale.setScalar(.7);addLegs(g,L);g.userData.tails=[{m:tlg,a:.25,f:3}];stdAnim(g,{fq:8,amp:.5,extra:(t)=>{arms.forEach((a,i)=>a.rotation.z=.3+Math.sin(t*8+i*Math.PI)*.3);hg.rotation.z=Math.sin(t*1.3)*.1}});
 return g}
/* swap the new bodies in wherever the herds and entries ask for the old ones */
bSauropod=bSauropod2;bCeratops=bCeratops2;bRaptor=bRaptor2;bDragonkin=bDragonkin2;

/* ---------- Lin's flagship: a shark of the air with a hold full of soldiers ---------- */
function bBehemoth2(f){const g=new THREE.Group();const col=f.col||'#6c7d6a';const o={back:C(col).offsetHSL(0,0,.06).getStyle(),belly:C(col).lerp(C('#eef4ee'),.65).getStyle(),stripe:0,spots:60,spotC:C(col).multiplyScalar(.6).getStyle(),rough:.55,em:C(col).multiplyScalar(.75).getStyle()};
 const dark=M(C(col).multiplyScalar(.6).getStyle(),{roughness:.5}),fin=M(C(col).getStyle(),{roughness:.55,side:THREE.DoubleSide});
 g.add(loft([[2.55,.02,0,.06,.06],[2.25,.06,0,.3,.32],[1.7,.1,0,.5,.55],[.9,.14,0,.64,.72],[0,.12,0,.66,.74],[-.9,.08,0,.56,.6],[-1.7,.04,0,.36,.36],[-2.3,.02,0,.18,.17],[-2.6,0,0,.1,.1]],Object.assign({n:60,r:20},o)));
 // the underside: a long pale keel and the doors of the troop hold
 const keel=loft([[1.6,-.32,0,.12,.4],[0,-.42,0,.16,.55],[-1.5,-.3,0,.1,.32]],{back:'#c8d4cc',belly:'#a8b4ac',n:20});g.add(keel);
 for(let i=0;i<4;i++){const d=new THREE.Mesh(new THREE.BoxGeometry(.42,.03,.3),dark);d.position.set(.9-i*.55,-.57,0);g.add(d);for(const z of[-1,1]){const h=new THREE.Mesh(new THREE.BoxGeometry(.04,.04,.04),M('#d8c890'));h.position.set(.9-i*.55,-.58,z*.13);g.add(h)}}
 // gas sacs along the spine, glowing faintly, and ribs between them
 const sacM=new THREE.MeshStandardMaterial({color:'#dff4ec',emissive:'#7fd8c4',emissiveIntensity:.4,transparent:true,opacity:.55,roughness:.15,depthWrite:false});const sacs=[];
 for(let i=0;i<4;i++){const s=sph(0,.42-i*.05,.2,.3-i*.03,14,sacM);s.position.set(.95-i*.62,.66-i*.04,0);g.add(s);sacs.push(s);const rb=new THREE.Mesh(new THREE.TorusGeometry(.3-i*.03,.025,4,14,Math.PI),dark);rb.position.set(.64-i*.62,.6-i*.04,0);rb.rotation.y=Math.PI/2;g.add(rb)}
 const df=new THREE.Mesh(wingGeo(.7,.85,'fin'),fin);df.rotation.set(-Math.PI/2,0,Math.PI);df.position.set(-1.05,.5,0);g.add(df);
 // three pairs of fins for flight, the front pair largest
 const fins=[];for(let i=0;i<3;i++)for(const z of[-1,1]){const fn=wing(1.15-i*.22,.62-i*.08,fin,'fin');fn.position.set(1.05-i*.8,-.12,z*.56);if(z<0)fn.scale.z=-1;fn.rotation.set(z*-.25,z*.35,-.1);g.add(fn);fins.push({m:fn,s:z,a:.2,f:1.3,ph:i*.8})}
 addWings(g,fins);
 // a tall shark tail and the jet throat inside it
 const tailG=new THREE.Group();tailG.position.x=-2.45;g.add(tailG);const up=new THREE.Mesh(wingGeo(.95,.7,'fin'),fin);up.rotation.set(Math.PI/2,0,.5);up.position.set(-.05,.05,0);tailG.add(up);
 const lo=new THREE.Mesh(wingGeo(.6,.5,'fin'),fin);lo.rotation.set(-Math.PI/2,0,-.6+Math.PI);lo.position.set(-.05,-.05,0);tailG.add(lo);
 const noz=cyl(.13,.2,.3,dark,14);noz.rotation.z=Math.PI/2;noz.position.x=-.18;tailG.add(noz);const ring=new THREE.Mesh(new THREE.TorusGeometry(.18,.03,6,16),M('#4a5a58',{metalness:.6,roughness:.3}));ring.rotation.y=Math.PI/2;ring.position.x=-.33;tailG.add(ring);
 const jet=sph(0,.12,.12,.12,10,GL('#9fd8ff'));jet.position.x=-.36;tailG.add(jet);const js=glowSprite('#8fd0ff',1.6,.6);js.position.x=-.5;tailG.add(js);
 const plume=emitter({n:90,life:1.2,speed:2.2,spread:.18,size:1.2,dir:[-1,0,0],col:'#bfe8ff',col2:'#5a8aff',op:.5,area:[.1,.1,.1]});plume.position.x=-.4;tailG.add(plume);
 // gills, eyes, a mouth line with small teeth
 for(let i=0;i<5;i++)for(const z of[-1,1]){const gl=new THREE.Mesh(new THREE.BoxGeometry(.035,.3-i*.02,.02),dark);gl.position.set(1.52-i*.09,.0,z*.55);gl.rotation.x=z*.15;g.add(gl)}
 for(const z of[-1,1]){const e=sph(0,.065,.065,.05,10,GL('#e8ffef'));e.position.set(2.05,.16,z*.27);g.add(e);const lid=new THREE.Mesh(new THREE.TorusGeometry(.075,.015,4,12),dark);lid.position.copy(e.position);lid.rotation.y=Math.PI/2+z*.4;g.add(lid)}
 const mouth=tubeAlong([V3(2.4,-.08,0),V3(2.15,-.16,.22),V3(1.85,-.12,.34)],.012,M('#2a2420'),10);g.add(mouth);const m2=mouth.clone();m2.scale.z=-1;g.add(m2);
 for(let i=0;i<7;i++)for(const z of[-1,1]){const t=cone(.012,.05,M('#ece4d0'),3);const u=i/6;t.position.set(2.38-u*.5,-.12-u*.04,z*(.04+u*.3));t.rotation.x=Math.PI;g.add(t)}
 // lights along the flank: portholes of the hold
 for(let i=0;i<8;i++)for(const z of[-1,1]){const p=sph(0,.03,.03,.03,6,GL('#ffe6a0'));p.position.set(1.2-i*.32,-.08,z*(.66-Math.abs(i-3)*.025));g.add(p)}
 g.userData.noSkin=1;g.userData.anim=(t)=>{tailG.rotation.y=Math.sin(t*1.2)*.28;for(const fn of fins)fn.m.rotation.x=fn.s*(-.25+Math.sin(t*1.3+fn.ph)*.2);js.material.opacity=.45+Math.sin(t*9)*.1;sacs.forEach((s,i)=>s.scale.y=.2*(1+Math.sin(t*1.5+i)*.08))};
 return g}

/* ---------- the leviathan as the book has it: a broad disc three metres and more across, eyes hung beneath,
   feeling tentacles, gas sacs, a lantern; later a shell over the back and wings that unfold from slits in its sides ---------- */
function bLeviathan2(f){const g=new THREE.Group();const col=f.col||'#41606a';const top=C(col),bel=C(col).lerp(C('#d8e8e0'),.55);
 const shellM=M(C(col).multiplyScalar(.75).getStyle(),{roughness:.4,metalness:.15}),skin=M(col,{roughness:.5}),bone=M('#e9e2cc',{roughness:.4});
 // the disc: a lathe, thick in the middle, thin at the rim, darker above and pale below
 const prof=[];for(let i=0;i<=16;i++){const t=i/16;const r=Math.sin(t*Math.PI*.5)*1.6;const y=(1-t)*.42+t*0;prof.push(new THREE.Vector2(Math.max(.01,r),y))}
 for(let i=16;i>=0;i--){const t=i/16;const r=Math.sin(t*Math.PI*.5)*1.6;prof.push(new THREE.Vector2(Math.max(.01,r*.96),-(1-t)*.3-.02))}
 const dg=new THREE.LatheGeometry(prof,32);const pc=dg.attributes.position,cc=[];for(let i=0;i<pc.count;i++){const y=pc.getY(i);const k=sm(-.15,.2,y);const c=bel.clone().lerp(top,k);const a=Math.atan2(pc.getZ(i),pc.getX(i));if(y>0&&Math.sin(a*9)>.6)c.multiplyScalar(.82);cc.push(c.r,c.g,c.b)}
 dg.setAttribute('color',new THREE.Float32BufferAttribute(cc,3));dg.computeVertexNormals();const body=new THREE.Mesh(dg,skinMat({rough:.5,em:C(col).multiplyScalar(.6).getStyle()}));body.scale.set(1.15,1,1);g.add(body);
 // the shell plates grown over the back, a ring of short spines round the rim
 for(let i=0;i<7;i++){const a=i/7*6.283;const p=new THREE.Mesh(new THREE.SphereGeometry(1,12,6,0,Math.PI*2,0,Math.PI*.3),shellM);p.scale.set(.62,.5,.42);p.position.set(Math.cos(a)*.75,.26,Math.sin(a)*.75);p.rotation.set(Math.sin(a)*.5,0,-Math.cos(a)*.5);g.add(p)}
 const cap=new THREE.Mesh(new THREE.SphereGeometry(1,16,8,0,Math.PI*2,0,Math.PI*.35),shellM);cap.scale.set(.75,.55,.75);cap.position.y=.25;g.add(cap);
 for(let i=0;i<16;i++){const a=i/16*6.283;const sp=cone(.05,.28,bone,4);sp.position.set(Math.cos(a)*1.78,.02,Math.sin(a)*1.6);sp.rotation.set(Math.sin(a)*1.4,0,-Math.cos(a)*1.4);g.add(sp)}
 // gas sacs riding on top
 const sacM=new THREE.MeshStandardMaterial({color:'#c8f2e8',emissive:'#5fd6c0',emissiveIntensity:.55,transparent:true,opacity:.5,roughness:.2,depthWrite:false});const sacs=[];
 for(let i=0;i<3;i++){const s=sph(0,.32,.24,.28,12,sacM);s.position.set(-.5+i*.5,.62,(i-1)*.3);g.add(s);sacs.push(s)}
 // eyes hung beneath on short stalks, a lantern on a long one
 const eyes=[];for(let i=0;i<5;i++){const a=i/5*6.283+.3;const st=tubeAlong([V3(Math.cos(a)*.5,-.3,Math.sin(a)*.5),V3(Math.cos(a)*.7,-.55,Math.sin(a)*.7)],.03,skin,6);g.add(st);const e=sph(0,.09,.09,.09,10,GL('#d6fff4'));e.position.set(Math.cos(a)*.72,-.6,Math.sin(a)*.72);g.add(e);eyes.push(e)}
 const lst=tubeAlong([V3(1.2,0,0),V3(1.7,-.2,0),V3(1.9,-.55,0)],.025,skin,10);g.add(lst);const lan=sph(0,.11,.13,.11,10,GL('#c6fff0'));lan.position.set(1.92,-.62,0);g.add(lan);const lg=glowSprite('#9fffe8',1.4,.55);lg.position.copy(lan.position);g.add(lg);
 // feeling tentacles trailing below
 const tents=[];for(let i=0;i<8;i++){const a=i/8*6.283;const t=new THREE.Group();const pts=[];for(let j=0;j<=6;j++)pts.push(V3(Math.cos(a)*j*.06,-j*.32,Math.sin(a)*j*.06));t.add(tubeAlong(pts,.04-.003*i%2,skin,12));t.position.set(Math.cos(a)*1.05,-.25,Math.sin(a)*1.05);g.add(t);tents.push(t)}
 // wings that open out of the slits in its sides
 const wings=[];for(const z of[-1,1]){const w=wing(2,1.1,new THREE.MeshStandardMaterial({color:'#8fb8bc',transparent:true,opacity:.78,side:THREE.DoubleSide,roughness:.4}),'bat');w.position.set(0,.05,z*1.45);if(z<0)w.scale.z=-1;g.add(w);wings.push({m:w,s:z,a:.45,f:2.2})}
 {const arms2=[];for(const z of[-1,1]){const pts=[];for(let j=0;j<=10;j++){const t=j/10;pts.push(V3(1.1+t*1.6,-.3-Math.sin(t*2.6)*.5,z*(.4+t*.25)))}const tg2=new THREE.Group();const arm=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),40,.09,8,false),skin);tg2.add(arm);
   const cv=new THREE.CatmullRomCurve3(pts);for(let k=2;k<18;k++){const q=cv.getPointAt(k/19);const su=sph(0,.04,.02,.04,6,M('#d8c8b8',{roughness:.5}));su.position.copy(q).add(V3(0,-.07,0));tg2.add(su)}g.add(tg2);arms2.push(tg2)}
  const TE=M('#f4ecd8',{roughness:.3});for(let i=0;i<14;i++){const a=i/14*6.283;const t=cone(.035,.16,TE,4);t.position.set(.8+Math.cos(a)*.22,-.34,Math.sin(a)*.22);t.rotation.set(Math.sin(a)*.6,0,Math.PI+Math.cos(a)*.6);g.add(t)}
  const mo=sph(0,.24,.06,.24,12,M('#3a1a1a',{roughness:.6}));mo.position.set(.8,-.32,0);g.add(mo);
  for(let i=0;i<4;i++){const a=(i/4-.375)*2.2;const cn=new THREE.Mesh(new THREE.CylinderGeometry(.1,.14,.3,10,1,true),shellM);cn.position.set(Math.cos(a)*.95,.42,Math.sin(a)*.95);cn.rotation.set(Math.sin(a)*.4,0,-Math.cos(a)*.6-.4);g.add(cn);const ins=sph(0,.08,.03,.08,8,EM('#ff9a3a',.6));ins.position.copy(cn.position).add(V3(Math.cos(a)*.08,.12,Math.sin(a)*.08));g.add(ins)}
  g.userData.arms2=arms2}
 addWings(g,wings);g.userData.noSkin=1;
 g.userData.anim=(t)=>{for(const w of wings)w.m.rotation.x=w.s*Math.sin(t*2.2)*.5;tents.forEach((tt,i)=>{tt.rotation.z=Math.sin(t*1.5+i)*.3;tt.rotation.x=Math.cos(t*1.2+i*.7)*.3});
  sacs.forEach((s,i)=>s.scale.y=.24*(1+Math.sin(t*1.6+i)*.1));(g.userData.arms2||[]).forEach((a,i)=>{a.rotation.y=Math.sin(t*.9+i*2)*.15;a.rotation.z=Math.sin(t*1.1+i)*.08});body.rotation.z=Math.sin(t*.7)*.05;lg.material.opacity=.4+Math.sin(t*3)*.15};
 return g}
/* 大鸵龙: the white dragons' two-legged mount — a big running dinosaur with a hide pad on its back,
   a rope bridle tied round its head and reins to pull it straight; some carry a rider */
function bDachuo(f){const g=bRaptor2(Object.assign({},f,{w:'dachuo',col:f.col||'#8a7a5a'}));const HIDE=M('#6a4a30',{roughness:.9}),ROPE=M('#c8b080',{roughness:.9});
 const pad=new THREE.Mesh(new THREE.SphereGeometry(1,14,8,0,Math.PI*2,0,Math.PI*.32),HIDE);pad.scale.set(.62,.5,.42);pad.position.set(-.05,1.5,0);g.add(pad);
 for(const z of[-1,1]){const fr=new THREE.Mesh(new THREE.PlaneGeometry(.5,.35),M('#5a3a24',{side:THREE.DoubleSide}));fr.position.set(-.05,1.35,z*.36);fr.rotation.x=z*.25;g.add(fr)}
 const br=new THREE.Mesh(new THREE.TorusGeometry(.17,.018,4,14),ROPE);br.position.set(1.05,1.72,0);br.rotation.y=Math.PI/2;g.add(br);
 for(const z of[-1,1])g.add(tubeAlong([V3(1.05,1.72,z*.16),V3(.6,1.75,z*.22),V3(.1,1.62,z*.2)],.012,ROPE,8));
 if(f.rider!==false){const r=bDragonkin2({w:'baihai',col:'#ece8de'});r.scale.setScalar(.7);r.position.set(-.15,1.0,0);r.userData.anim=null;g.add(r)}
 return g}

bBehemoth=bBehemoth2;bLeviathan=bLeviathan2;
