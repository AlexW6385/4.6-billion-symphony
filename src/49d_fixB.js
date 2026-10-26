/* ================================================================
   49d_fixB: bodies rebuilt to match the book (audit group B).
   造脑怪, 丛林侏儒, 僵怪, 光龙, 大气史莱姆, 尘魔, 熔岩蝾, 银鳞巨兽, 脚鲸, 白星, 超级英雄,
   有智慧的家禽, 骨架幼苗, plus smaller fixes: 白骸龙 armour, 坚甲龙, 血雾大师, 混肢兽, 钩虫.
   Same conventions as 30_creatures: +x forward, +y up, ground at y=0.
   ================================================================ */
const fxB_cnt={};function fxB_next(k){return fxB_cnt[k]=(fxB_cnt[k]||0)+1}
const fxB_TAU=Math.PI*2;
/* cross-section of a loft spec at x (spec sorted by x either way): [y, ry, rz] */
function fxB_sec(spec,x){for(let i=0;i<spec.length-1;i++){const a=spec[i],b=spec[i+1];const lo=Math.min(a[0],b[0]),hi=Math.max(a[0],b[0]);if(x>=lo&&x<=hi){const k=(x-a[0])/((b[0]-a[0])||1);return[a[1]+(b[1]-a[1])*k,a[3]+(b[3]-a[3])*k,a[4]+(b[4]-a[4])*k]}}
 const e=Math.abs(x-spec[0][0])<Math.abs(x-spec[spec.length-1][0])?spec[0]:spec[spec.length-1];return[e[1],e[3],e[4]]}
/* a spider-style leg: the first segment rises up and out from the hip, the second drops to the ground.
   s = side (+1 → +z), th1 = angle of the first segment from hanging straight down, phi = angle of the second */
function fxB_spiderLeg(l1,l2,r,mat,s,th1,phi,tip){const hip=new THREE.Group();const lift=new THREE.Group();hip.add(lift);lift.rotation.x=-s*th1;
 const a=cyl(r,r*.8,l1,mat,6);a.position.y=-l1/2;lift.add(a);const kn=new THREE.Group();kn.position.y=-l1;kn.rotation.x=s*(th1-phi);lift.add(kn);kn.add(sph(0,r*1.15,r*1.15,r*1.15,9,mat));
 const b=cyl(r*.8,r*.3,l2,mat,6);b.position.y=-l2/2;kn.add(b);if(tip){const c=cone(r*.35,r*2.2,tip,4);c.position.y=-l2-r;c.rotation.x=Math.PI;kn.add(c)}
 hip.userData.lift=lift;hip.userData.th1=th1;hip.userData.s=s;return hip}
/* walk a set of hinged legs: {m, base, ph, a, kb, ka} — hip swing about z, knee lifts on the forward stroke */
function fxB_walk(L,t,fq){for(const l of L){const p=t*fq+l.ph;l.m.rotation.z=(l.base||0)+Math.sin(p)*(l.a||.4);const k=l.m.userData.knee;if(k)k.rotation.z=(l.kb||0)+Math.max(0,Math.sin(p+1.4))*(l.ka===undefined?.5:l.ka)}}
/* level a jleg/jarm foot after the hip and knee were set by hand */
function fxB_footFlat(leg,hip,bend){const k=leg.userData.knee;if(k&&k.children[3])k.children[3].rotation.z=-(hip+bend)}
/* x of the front surface of a loft spec at height y, side z */
function fxB_front(spec,y,z){let hi=-1e9;for(const p of spec)hi=Math.max(hi,p[0]);for(let x=hi;x>hi-2;x-=.004){const c=fxB_sec(spec,x);const a=(y-c[0])/c[1],b=z/c[2];if(a*a+b*b<=1)return x}return hi}
/* fold the static meshes of a group into one mesh per material (fewer objects to build, bake and draw) */
function fxB_flat(grp){const out=new THREE.Group();const by=new Map();grp.updateMatrixWorld(true);
 grp.traverse(c=>{if(!c.isMesh)return;const g0=c.geometry.index?c.geometry.toNonIndexed():c.geometry.clone();if(g0.attributes.uv)g0.deleteAttribute('uv');g0.applyMatrix4(c.matrixWorld);(by.get(c.material)||by.set(c.material,[]).get(c.material)).push(g0)});
 const U=THREE.BufferGeometryUtils;for(const [m,list] of by){if(U&&list.length>1)out.add(new THREE.Mesh(U.mergeBufferGeometries(list),m));else list.forEach(g0=>out.add(new THREE.Mesh(g0,m)))}return out}
const fxB_smooth=(a,b,x)=>{const t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t)};

/* ---------------- 造脑怪: a fat yellow oval on eight jointed legs, eight eyes, a flat mouth of saw teeth ---------------- */
function fxB_zaonao(f){const g=new THREE.Group();const body=new THREE.Group();g.add(body);
 const SPEC=[[-1.5,1.0,0,.03,.03],[-1.42,1.01,0,.4,.46],[-1.15,1.03,0,.68,.78],[-.6,1.04,0,.82,.95],[.2,1.0,0,.8,.92],[.8,.94,0,.68,.8],[1.12,.9,0,.56,.68],[1.24,.89,0,.38,.48],[1.28,.89,0,.03,.03]];
 body.add(loft(SPEC,{n:40,r:20,back:'#d2ae36',belly:'#efe1a2',spots:34,spotC:'#a88a2a',rough:.5}));
 const FACE=M('#d9b947',{roughness:.45}),DARK=M('#2a1a10',{roughness:.6}),TOOTH=M('#f4ecd8',{roughness:.3}),EYE=M('#0a0806',{roughness:.05});
 // eight eyes in two curved rows across the upper face
 const RIM=M('#8a6a1a',{roughness:.6});
 for(let i=0;i<8;i++){const row=i<4?0:1,j=(i%4)-1.5;const r=row?.055:.075;const z=j*(row?.24:.17),y=1.02+row*.16-Math.abs(j)*.035;const x=fxB_front(SPEC,y,z);
  const e=sph(0,r,r,r,12,EYE);e.position.set(x-r*.25,y,z);body.add(e);const rim=sph(0,r*.5,r*1.25,r*1.25,10,RIM);rim.position.set(x-r*.6,y,z);body.add(rim)}
 // the flat mouth pressed onto the face: a wide slit with an upper and a lower row of saw teeth
 const mX=fxB_front(SPEC,.8,0)-.03;const mouth=new THREE.Group();mouth.position.set(mX,.8,0);body.add(mouth);
 const cav=sph(0,.06,.075,.4,14,DARK);mouth.add(cav);const lipU=sph(0,.08,.05,.44,14,FACE);lipU.position.set(.01,.08,0);mouth.add(lipU);
 const jaw=new THREE.Group();mouth.add(jaw);const lipL=sph(0,.08,.05,.42,14,FACE);lipL.position.set(.01,-.08,0);jaw.add(lipL);
 for(let row=0;row<2;row++)for(let i=0;i<11;i++){const z=(i/10-.5)*.66;const tu=cone(.022,.07,TOOTH,4);tu.position.set(.04-row*.035,.04,z);tu.rotation.z=Math.PI;mouth.add(tu);const tl=cone(.022,.07,TOOTH,4);tl.position.set(.04-row*.035,-.04,z);jaw.add(tl)}
 // short feelers all over the hide, and longer ones around the mouth that keep feeling about
 const FEEL=M('#b08a26',{roughness:.55}),fg=new THREE.CylinderGeometry(.01,.03,.28,5);fg.translate(0,.12,0);
 const fxB_fz=new THREE.Group();for(let i=0;i<70;i++){const u=h3(i,4,1),v=h3(i,5,2);const a=u*fxB_TAU,el=(v*.9-.1)*Math.PI/2;const x=-.15+Math.cos(el)*Math.cos(a)*1.15,y=1.0+Math.sin(el)*.78,z=Math.cos(el)*Math.sin(a)*.9;if(x>1.0&&y<1.2)continue;
  const m=new THREE.Mesh(fg,FEEL);m.position.set(x,y,z);m.quaternion.setFromUnitVectors(V3(0,1,0),V3(x+.15,(y-1)*1.6,z).normalize());fxB_fz.add(m)}body.add(fxB_flat(fxB_fz));
 const feelers=[];for(let i=0;i<12;i++){const a=(i/12)*fxB_TAU;const fl=new THREE.Group();fl.position.set(mX+.02-Math.abs(Math.cos(a))*.06,.8+Math.sin(a)*.14,Math.cos(a)*.48);fl.add(tubeAlong([V3(0,0,0),V3(.1,Math.sin(a)*.05,Math.cos(a)*.04),V3(.2,Math.sin(a)*.03-.05,Math.cos(a)*.07)],.014,FEEL,6));body.add(fl);feelers.push(fl)}
 // eight jointed legs under the body, spread like a spider's
 const LEG=M('#c8a238',{roughness:.5}),TIP=M('#3a2a14',{roughness:.4});const legs=[];
 [-.85,-.3,.25,.75].forEach((x,i)=>{for(const s of[-1,1]){const l=fxB_spiderLeg(.62,1.12,.075,LEG,s,2.0,.42,TIP);l.position.set(x,.72,s*.8);const base=s*(i-1.5)*.32;l.rotation.y=base;g.add(l);legs.push({m:l,base,s,ph:((i+(s>0?0:1))%2)*Math.PI})}});
 g.userData.anim=t=>{const fq=4.5;for(const l of legs){const p=t*fq+l.ph;l.m.rotation.y=l.base+Math.sin(p)*.2*l.s;l.m.userData.lift.rotation.x=-l.s*(l.m.userData.th1+Math.max(0,Math.cos(p))*.22)}
  body.position.y=Math.sin(t*fq*2)*.02;body.rotation.x=Math.sin(t*fq)*.02;jaw.position.y=-Math.max(0,Math.sin(t*.9))*.05;
  feelers.forEach((fl,i)=>{fl.rotation.y=Math.sin(t*3+i)*.4;fl.rotation.z=Math.cos(t*2.3+i*1.3)*.35})};
 return g}

/* ---------------- 丛林侏儒: half a metre, black and scaleless, a big round head with a flat face and no snout,
   short clawed limbs, a stub of a tail, and a hollow blowpipe ---------------- */
function fxB_zhuru(f,o){o=o||{};const g=new THREE.Group();const root=new THREE.Group();g.add(root);
 const SK=M('#1c1918',{roughness:.5}),FACE=M('#26211f',{roughness:.55});
 root.add(loft([[-.1,.36,0,.13,.14],[-.04,.5,0,.19,.18],[.03,.66,0,.17,.16],[.07,.78,0,.1,.1]],{n:16,r:12,back:'#141211',belly:'#2c2624',stripe:0,rough:.5}));
 const hg=new THREE.Group();hg.position.set(.1,.98,0);root.add(hg);
 hg.add(sph(0,.25,.25,.28,16,SK));
 const face=sph(0,.07,.2,.23,14,FACE);face.position.set(.19,-.03,0);hg.add(face);   // flat face, no muzzle at all
 for(const z of[-1,1]){const e=sph(0,.05,.05,.05,10,M('#d6c25a',{roughness:.1}));e.position.set(.235,.04,z*.095);hg.add(e);const p=sph(0,.022,.03,.022,7,M('#050505',{roughness:.05}));p.position.set(.28,.04,z*.095);hg.add(p);
  const n=sph(0,.012,.012,.012,5,M('#050505'));n.position.set(.26,-.04,z*.025);hg.add(n)}
 const mth=sph(0,.015,.016,.11,9,M('#060404'));mth.position.set(.245,-.12,0);hg.add(mth);
 const cheeks=[];for(const z of[-1,1]){const c=sph(0,.09,.075,.07,10,SK);c.position.set(.13,-.13,z*.16);hg.add(c);cheeks.push(c)}   // cheek pouches for carrying things
 const tail=sph(0,.12,.05,.05,9,SK);tail.position.set(-.2,.33,0);tail.rotation.z=-.6;root.add(tail);
 const legs=[];for(const z of[-1,1]){const l=jleg(.2,.2,.05,SK,-1.0,{claws:1});l.position.set(-.02,.4,z*.1);l.rotation.z=.6;fxB_footFlat(l,.6,-1.0);root.add(l);legs.push({m:l,base:.6,ph:z>0?0:Math.PI,a:.45,kb:-1.0,ka:.5})}
 const arms=[];for(const z of[-1,1]){const a=jarm(.15,.14,.04,SK,-1.2);a.position.set(.08,.74,z*.17);a.rotation.z=.5;root.add(a);arms.push(a)}
 // the blowpipe: a straight round hollow stick with a dart inside
 const pipe=new THREE.Group();pipe.position.set(.16,.62,.12);root.add(pipe);const pp=cyl(.018,.02,.72,M('#6a5232',{roughness:.8}),6);pp.rotation.z=-Math.PI/2;pp.position.x=.3;pipe.add(pp);
 const bore=sph(0,.004,.014,.014,7,M('#120c06'));bore.position.x=.66;pipe.add(bore);
 if(o.bone){const b=sph(0,.06,.06,.06,9,M('#d8ccb0'));b.position.set(.28,-.02,0);hg.add(b)}
 if(o.chief){const sh=new THREE.Mesh(new THREE.SphereGeometry(.31,14,8,0,fxB_TAU,0,Math.PI*.45),M('#e8e0cc',{roughness:.7}));sh.position.y=.04;hg.add(sh);pipe.visible=false;
  const st=cyl(.015,.015,1.3,M('#5a3a20'),5);st.position.set(.25,.65,-.2);root.add(st);const sk=sph(0,.09,.07,.07,9,EM('#cfe8a0',.9));sk.position.set(.25,1.33,-.2);root.add(sk)}
 g.userData.anim=t=>{const P=7,u=((t%P)+P)%P;const shoot=fxB_smooth(4.6,5.0,u)*(1-fxB_smooth(6.4,6.8,u));const walk=1-shoot;
  fxB_walk(legs,t,9);legs.forEach(l=>{l.m.rotation.z=l.base+(l.m.rotation.z-l.base)*walk});
  root.position.y=Math.abs(Math.sin(t*9))*.03*walk;root.rotation.z=-.15*walk;
  // raise the pipe to the lips, puff the cheeks
  pipe.rotation.z=-.3*(1-shoot)+.04*shoot;pipe.position.set(.12+.22*shoot,.6+.26*shoot,.14-.14*shoot);
  arms[0].rotation.z=.5+Math.sin(t*9)*.4*walk+.9*shoot;arms[1].rotation.z=.5-Math.sin(t*9)*.4*walk+.9*shoot;
  const puff=shoot*Math.max(0,Math.sin((u-5)*6));cheeks.forEach(c=>c.scale.set(.09+puff*.04,.075+puff*.03,.07+puff*.04));hg.rotation.z=Math.sin(t*1.3)*.08*walk-.1*shoot};
 return g}

/* ---------------- 僵怪: six metres, grey as the sand, no arms, no face or any organ to be seen;
   it wobbles on two legs with huge frog-like feet whose soles are barbed sucking mouths ---------------- */
function fxB_frogFoot(mat,sole,barb,s){const ft=new THREE.Group();
 const pad=sph(0,.5,.13,.42,12,mat);pad.position.set(.28,-.02,0);ft.add(pad);
 const web=new THREE.Mesh(new THREE.CircleGeometry(1.05,12,-.75,1.5),M('#7f817b',{roughness:.95,side:THREE.DoubleSide}));web.rotation.x=-Math.PI/2;web.position.set(.3,-.08,0);ft.add(web);
 for(let i=0;i<4;i++){const a=(i/3-.5)*1.3;const tg2=new THREE.Group();tg2.position.set(.45,-.05,0);tg2.rotation.y=a;ft.add(tg2);const toe=sph(0,.48,.07,.1,9,mat);toe.position.x=.42;tg2.add(toe);const tip=sph(0,.13,.07,.13,9,mat);tip.position.x=.9;tg2.add(tip)}
 // the mouth on the sole: a dark sucker ringed with backward hooks
 const m=new THREE.Mesh(new THREE.CircleGeometry(.3,14),sole);m.rotation.x=Math.PI/2;m.position.set(.28,-.152,0);ft.add(m);
 for(let i=0;i<14;i++){const a=i/14*fxB_TAU;const b=cone(.03,.11,barb,4);b.position.set(.28+Math.cos(a)*.25,-.17,Math.sin(a)*.25);b.rotation.set(Math.sin(a)*.6,0,-Math.cos(a)*.6+Math.PI);ft.add(b)}
 // a freshly pressed ball of sand, pushed out of the sole mouth as the foot comes up
 const ball=sph(0,.17,.17,.17,9,M('#9a968a',{roughness:1}));ball.position.set(.28,-.3,0);ft.add(ball);ft.userData.ball=ball;
 return ft}
function fxB_jiangguai(f){const g=new THREE.Group();const root=new THREE.Group();g.add(root);
 const MAT=M('#8b8d88',{roughness:.95}),SOLE=M('#2a2420',{roughness:.7,side:THREE.DoubleSide}),BARB=M('#d8d0bc',{roughness:.5}),FUN=M('#c8c8a6',{roughness:1});
 // one lumpy mass on top of the legs, hunched forward a little: no head, no eyes, no mouth
 const PR=[[0,1.82],[.38,1.88],[.62,2.05],[.8,2.4],[.84,2.8],[.78,3.25],[.64,3.65],[.44,3.98],[.22,4.18],[0,4.26]];
 const body=new THREE.Mesh(new THREE.LatheGeometry(PR.map(p=>new THREE.Vector2(p[0],p[1])),18),MAT);body.scale.set(1,1,1.05);root.add(body);const RR=y=>{for(let i=0;i<PR.length-1;i++)if(y>=PR[i][1]&&y<=PR[i+1][1])return PR[i][0]+(PR[i+1][0]-PR[i][0])*(y-PR[i][1])/(PR[i+1][1]-PR[i][1]);return 0};
 for(let i=0;i<11;i++){const a=h3(i,1,9)*fxB_TAU,y=2.2+h3(i,2,9)*1.8;const r=RR(y)*.96;const l=sph(0,.24,.16,.22,9,MAT);l.position.set(Math.cos(a)*r,y,Math.sin(a)*r*1.05);l.quaternion.setFromUnitVectors(V3(0,1,0),V3(Math.cos(a),.3,Math.sin(a)).normalize());root.add(l)}
 for(let i=0;i<8;i++){const a=h3(i,3,9)*fxB_TAU,y=2.4+h3(i,4,9)*1.4;const r=RR(y);const c=sph(0,.09,.06,.09,7,FUN);c.position.set(Math.cos(a)*r,y,Math.sin(a)*r*1.05);root.add(c)}   // parasitic fungus
 const legs=[];for(const z of[-1,1]){const hip=new THREE.Group();hip.position.set(0,2.05,z*.45);root.add(hip);
  hip.add(sph(0,.4,.4,.4,10,MAT));hip.add(new THREE.Mesh(muscle(1.05,.32,THIGH),MAT));
  const kn=new THREE.Group();kn.position.y=-1.05;hip.add(kn);kn.add(sph(0,.27,.27,.27,10,MAT));kn.add(new THREE.Mesh(muscle(.92,.28,SHIN),MAT));
  const an=new THREE.Group();an.position.y=-.92;kn.add(an);const ft=fxB_frogFoot(MAT,SOLE,BARB,z);ft.position.y=-.05;an.add(ft);
  legs.push({hip,kn,an,ft,ph:z>0?0:Math.PI,z})}
 g.userData.anim=t=>{const fq=1.6;for(const l of legs){const p=t*fq+l.ph;const lift=Math.max(0,Math.sin(p));
   l.hip.rotation.z=.12+Math.cos(p)*.32;l.kn.rotation.z=-.25-lift*.9;l.an.rotation.z=-(l.hip.rotation.z+l.kn.rotation.z)+lift*.9;l.hip.rotation.x=l.z*.05;
   const b=l.ft.userData.ball,k=Math.max(0,Math.sin(p-.4));b.visible=k>.05;b.scale.setScalar(.17*Math.min(1,k*1.6));b.position.y=-.2-k*.12}  // a lifted foot turns its sole forward
  root.rotation.x=Math.sin(t*fq)*.07;root.rotation.z=-.08+Math.sin(t*fq*2)*.03;root.position.y=-Math.abs(Math.sin(t*fq))*.05;body.rotation.y=Math.sin(t*.7)*.05};
 return g}

/* a flexible tube along x (head at +x): prof(u) gives [ry,rz] with u=0 at the head, 1 at the tail.
   bend(x,t) → [dy,dz] offsets the rings each frame, so the whole body can undulate. */
function fxB_tube(L,prof,N,S,mat){const pos=new Float32Array((N+1)*S*3+6),base=[],idx=[];
 for(let i=0;i<=N;i++){const u=i/N,x=L*(.5-u);const [ry,rz]=prof(u);for(let j=0;j<S;j++){const a=j/S*fxB_TAU;base.push(x,Math.sin(a)*ry,Math.cos(a)*rz)}}
 base.push(L*.5+.001,0,0,-L*.5-.001,0,0);pos.set(base);
 for(let i=0;i<N;i++)for(let j=0;j<S;j++){const a=i*S+j,b=i*S+(j+1)%S,c=(i+1)*S+j,d=(i+1)*S+(j+1)%S;idx.push(a,b,c,b,d,c)}
 const hc=(N+1)*S,tc=hc+1;for(let j=0;j<S;j++){idx.push(hc,(j+1)%S,j);idx.push(tc,N*S+j,N*S+(j+1)%S)}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setIndex(idx);geo.computeVertexNormals();
 const m=new THREE.Mesh(geo,mat);m.frustumCulled=false;
 m.userData.bend=(fn,t)=>{const P=geo.attributes.position.array;
  for(let k=0;k<base.length/3;k++){const x=base[k*3];const o=fn(x,t);P[k*3]=x;P[k*3+1]=base[k*3+1]+o[0];P[k*3+2]=base[k*3+2]+o[1]}geo.attributes.position.needsUpdate=true};
 return m}

/* ---------------- 光龙: a hundred-metre airborne eel, nearly see-through, two great light organs on the head,
   no wings; it swims through the sky with slow eel-like waves and swallows what it has burned ---------------- */
function fxB_guanglong(f){const g=new THREE.Group();const L=7.6;
 const skin=new THREE.MeshStandardMaterial({color:f.col||'#fff2b0',emissive:'#ffe6a8',emissiveIntensity:.45,transparent:true,opacity:.42,roughness:.15,depthWrite:false});
 const inner=new THREE.MeshBasicMaterial({color:'#fff4d0',transparent:true,opacity:.2,side:THREE.BackSide,depthWrite:false});
 const prof=u=>{const head=Math.sqrt(Math.min(1,u/.05)),tail=Math.pow(1-u,.8);const r=.38*head*(u<.5?1:tail/Math.pow(.5,.8));return[r*1.02,r*.96]};
 const body=fxB_tube(L,prof,70,16,skin);g.add(body);const back=fxB_tube(L,u=>prof(u).map(v=>v*.9),70,12,inner);g.add(back);
 const wave=(x,t)=>{const u=.5-x/L;const A=.08+.42*u*u;return[Math.sin(t*1.1-u*5)*.05*u,Math.sin(t*1.6-u*9.5)*A]};
 const rides=[];const ride=(o,x,y,z)=>{o.position.set(x,y,z);g.add(o);rides.push([o,x,y,z])};
 // gas-filled hollows through the body, faintly visible through the skin
 const GAS=new THREE.MeshBasicMaterial({color:'#fffbe8',transparent:true,opacity:.18,depthWrite:false});
 for(let i=0;i<26;i++){const u=.08+i/26*.82;const r=prof(u)[0];const sc=r*(.35+h3(i,2,5)*.3);const b=sph(0,sc*1.6,sc,sc,9,GAS);ride(b,L*(.5-u),(h3(i,3,5)-.5)*r*.6,(h3(i,4,5)-.5)*r*.7)}
 // a faint gut line along the core
 for(let i=0;i<14;i++){const u=.1+i/14*.6;const d=sph(0,.14,.05,.05,7,new THREE.MeshBasicMaterial({color:'#c8a870',transparent:true,opacity:.35,depthWrite:false}));ride(d,L*(.5-u),-.05,0)}
 // light-gathering patches along the back
 const PATCH=GL('#fff0b8',.7);for(let i=0;i<16;i++){const u=.12+i/16*.7;const r=prof(u)[0];for(const z of[-1,1]){const p=sph(0,.09,.02,.05,7,PATCH);ride(p,L*(.5-u),r*.82,z*r*.42)}}
 // squeeze-jets for pushing air, a row along each flank
 const JET=M('#e8d8a8',{roughness:.4,transparent:true,opacity:.55,depthWrite:false});for(let i=0;i<10;i++){const u=.15+i/10*.6;const r=prof(u)[1];for(const z of[-1,1]){const j=new THREE.Mesh(new THREE.TorusGeometry(.05,.015,5,10),JET);j.rotation.y=Math.PI/2;ride(j,L*(.5-u),0,z*r*.98)}}
 // the head: a blunt rounded front, a wide round mouth and the two big light organs
 const hx=L*.5-.2;const mouth=new THREE.Mesh(new THREE.CircleGeometry(.2,18),new THREE.MeshBasicMaterial({color:'#5a4020',transparent:true,opacity:.55,depthWrite:false}));mouth.rotation.y=Math.PI/2;ride(mouth,L*.5+.005,-.04,0);
 const lip=new THREE.Mesh(new THREE.TorusGeometry(.23,.035,6,18),M('#f0dca0',{roughness:.3,transparent:true,opacity:.7,depthWrite:false}));lip.rotation.y=Math.PI/2;ride(lip,L*.5-.01,-.04,0);
 const ORG=new THREE.MeshStandardMaterial({color:'#fffdf0',emissive:'#fff4c0',emissiveIntensity:1.6,roughness:.05,transparent:true,opacity:.95});
 for(const z of[-1,1]){const o=sph(0,.16,.15,.15,16,ORG);ride(o,hx-.12,.2,z*.24);const halo=glowSprite('#fff0b0',1.1,.55);ride(halo,hx-.08,.22,z*.3);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.16,.025,6,16),M('#e8d090',{roughness:.3}));ring.rotation.y=Math.PI/2-z*.6;ride(ring,hx-.05,.2,z*.27)}
 for(let i=0;i<3;i++){const aura=glowSprite('#ffe8b0',2.6,.14);ride(aura,L*(.3-i*.3),0,0)}
 g.userData.anim=t=>{body.userData.bend(wave,t);back.userData.bend(wave,t);for(const [o,x,y,z] of rides){const w=wave(x,t);o.position.set(x,y+w[0],z+w[1])}
  const op=.5+Math.sin(t*.7)*.3;mouth.scale.set(1,op+.4,op+.4);lip.scale.set(1,.6+op*.5,.6+op*.5)};
 g.userData.noShadow=1;return g}

/* ---------------- 大气史莱姆: a see-through, cloud-soft ray about five metres across; it barely flaps,
   mostly rides the wind, and may carry up to three swallowed fish inside ---------------- */
/* the ray's outline, as points around its centre (x forward, z to the side), angles increasing 0..PI */
const fxB_RAY=[[.62,0],[.66,.14],[.5,.28],[.3,.55],[.08,1.0],[-.3,1.62],[-.42,1.78],[-.52,1.5],[-.58,1.0],[-.6,.5],[-.52,.16],[-.58,0]];
function fxB_rayAt(a){const A=Math.abs(a),s=a<0?-1:1;const P=fxB_RAY;for(let i=0;i<P.length-1;i++){const a0=Math.atan2(P[i][1],P[i][0]),a1=Math.atan2(P[i+1][1],P[i+1][0]);if(A>=a0-1e-6&&A<=a1+1e-6){const k=(A-a0)/((a1-a0)||1);return[P[i][0]+(P[i+1][0]-P[i][0])*k,s*(P[i][1]+(P[i+1][1]-P[i][1])*k)]}}return[P[P.length-1][0],0]}
const fxB_rayGeo=(()=>{let G=null;return()=>{if(G)return G;const g=new THREE.SphereGeometry(1,48,16);const p=g.attributes.position;
 for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);const rho=Math.sqrt(x*x+z*z);const a=Math.atan2(z,x);const o=fxB_rayAt(a);
  const px=o[0]*rho,pz=o[1]*rho;const span=Math.min(1,Math.abs(pz)/1.75);const th=.24*(1-.82*Math.pow(span,.7))*(1-.3*Math.max(0,-px));
  p.setXYZ(i,px,y*th,pz)}
 g.computeVertexNormals();G=g;return g}})();
function fxB_daqi(f){const g=new THREE.Group();const k=fxB_next('daqi');
 const base=fxB_rayGeo(),geo=base.clone();const B=base.attributes.position.array;
 const mat=new THREE.MeshStandardMaterial({color:f.col||'#e8f6ff',emissive:'#cfe6ff',emissiveIntensity:.12,transparent:true,opacity:.45,roughness:.2,side:THREE.DoubleSide,depthWrite:false});
 const body=new THREE.Mesh(geo,mat);g.add(body);
 const tail=cone(.05,.9,mat,5);tail.rotation.z=Math.PI/2;tail.position.x=-1.0;g.add(tail);
 // a soft core of thicker jelly and a few drifting cells
 const core=sph(0,.55,.12,.4,14,new THREE.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:.18,depthWrite:false}));core.position.x=-.05;g.add(core);
 // cloud wisps trailing from the wing edges
 const puffs=[];for(let i=0;i<16;i++){const z=(h3(i,4,k)-.5)*3.2;const sp=glowSprite('#ffffff',.6+h3(i,1,k)*.7,.12);sp.position.set(-.1-Math.abs(z)*.3+(h3(i,5,k)-.5)*.6,0,z);g.add(sp);puffs.push([sp,z])}
 // parasitic algae speckles
 for(let i=0;i<9;i++){const a=sph(0,.05,.015,.05,7,M('#7aa07a',{transparent:true,opacity:.6,depthWrite:false}));a.position.set((h3(i,2,k)-.5)*.7,.07,(h3(i,3,k)-.5)*.9);g.add(a)}
 // swallowed fish, up to three, slowly digesting
 const nf=k%4;const FISH=new THREE.MeshStandardMaterial({color:'#5a7a8a',transparent:true,opacity:.75,roughness:.4,depthWrite:false});
 for(let i=0;i<nf;i++){const fg=new THREE.Group();fg.add(sph(0,.16,.05,.035,9,FISH));const tl=cone(.04,.08,FISH,3);tl.rotation.z=Math.PI/2;tl.position.x=-.18;fg.add(tl);fg.position.set(-.1+i*.18,0,(i-1)*.22);fg.rotation.y=i*1.3;g.add(fg)}
 g.userData.anim=t=>{const P=geo.attributes.position.array;const fl=Math.sin(t*1.5+k);for(let i=0;i<P.length;i+=3){const x=B[i],z=B[i+2];const az=Math.abs(z);
   P[i]=x;P[i+2]=z;P[i+1]=B[i+1]+Math.pow(az,1.6)*.2*Math.sin(t*1.5+k-az*.9)+Math.sin(t*1.1+x*2.5)*.03}
  geo.attributes.position.needsUpdate=true;puffs.forEach(([sp,z],i)=>{const az=Math.abs(z);sp.position.y=Math.pow(az,1.6)*.2*Math.sin(t*1.5+k-az*.9);sp.material.opacity=.1+Math.sin(t*.7+i)*.04});
  g.rotation.z=Math.sin(t*.4+k)*.08;g.rotation.x=Math.sin(t*.33+k)*.1};
 return g}

/* a band of leather wrapped round a loft at x */
function fxB_band(spec,x,w,mat,tilt){const c=fxB_sec(spec,x);const b=new THREE.Mesh(new THREE.TorusGeometry(1,w,4,22),mat);b.rotation.y=Math.PI/2;b.scale.set(c[2]*1.04,c[1]*1.04,1);
 const g=new THREE.Group();g.position.set(x,c[0],0);g.rotation.z=tilt||0;g.add(b);return g}
/* a five-fingered hand hanging along -y, palm facing -x */
function fxB_hand(r,mat){const h=new THREE.Group();h.add(sph(0,r*.45,r,r*.85,9,mat));for(let i=0;i<4;i++){const f=cyl(r*.2,r*.16,r*1.1,mat,5);f.position.set(0,-r*1.3,(i-1.5)*r*.42);f.rotation.x=(i-1.5)*.08;h.add(f)}
 const th=cyl(r*.22,r*.16,r*.8,mat,5);th.position.set(r*.25,-r*.5,r*.85);th.rotation.x=-.8;h.add(th);return h}

/* ---------------- 尘魔: about two metres, low and frog-like on four thick limbs, with a thick flat fish tail and
   fish scales, sand-coloured, the whole body and even the mouth bound up in leather straps ---------------- */
function fxB_chenmo(f){const g=new THREE.Group();const root=new THREE.Group();g.add(root);
 const SKIN=M('#b89256',{roughness:.8}),STRAP=M('#6a4a2c',{roughness:.85}),BUCK=M('#9a8a6a',{roughness:.4,metalness:.5});
 const BODY=[[-.8,.5,0,.28,.3],[-.5,.52,0,.36,.44],[-.1,.52,0,.4,.52],[.3,.52,0,.38,.5],[.62,.55,0,.3,.4],[.72,.56,0,.08,.1]];
 root.add(loft(BODY,{n:24,r:16,back:'#b08a50',belly:'#dcc894',spots:40,spotC:'#8a6a3a',rough:.8}));
 // fish-like scales: overlapping rows of flat plates along the flanks
 const SC=M('#a8844c',{roughness:.6}),scg=new THREE.SphereGeometry(1,6,4);
 const scG=new THREE.Group();for(let i=0;i<9;i++)for(let r=0;r<3;r++)for(const z of[-1,1]){const x=-.65+i*.15,c=fxB_sec(BODY,x);const a=.35+r*.38;const m=new THREE.Mesh(scg,SC);m.scale.set(.07,.05,.015);
   m.position.set(x,c[0]+Math.sin(a)*c[1]*.98,z*Math.cos(a)*c[2]*.98);m.lookAt(V3(x,c[0],0));scG.add(m)}root.add(fxB_flat(scG));
 // straps: hoops round the trunk, a pair crossing over the back, a buckle each
 for(const x of[-.55,-.2,.15,.45]){const b=fxB_band(BODY,x,.035,STRAP,(x*7%2-1)*.15);root.add(b);const bk=fxB_box(.05,.07,.04,BUCK);bk.position.set(x,BODY[2][1]+fxB_sec(BODY,x)[1]*1.02,0);root.add(bk)}
 for(const z of[-1,1]){const cr=tubeAlong([V3(-.6,.62,z*.38),V3(-.2,.92,z*.05),V3(.25,.92,-z*.15),V3(.55,.7,-z*.36)],.03,STRAP,12);root.add(cr)}
 // the tail: thick, flattened from side to side like a fish's, ending in a short fin
 const tail=new THREE.Group();tail.position.set(-.75,.5,0);root.add(tail);
 tail.add(loft([[.05,0,0,.26,.24],[-.35,0,0,.24,.16],[-.75,.02,0,.18,.09],[-1.05,.04,0,.12,.05],[-1.18,.05,0,.04,.02]],{n:16,r:12,back:'#a88248',belly:'#d0bc88',rough:.8}));
 const fin=new THREE.Mesh(new THREE.ShapeGeometry((()=>{const sh=new THREE.Shape();sh.moveTo(0,0);sh.quadraticCurveTo(-.25,.32,-.42,.36);sh.lineTo(-.3,0);sh.lineTo(-.42,-.3);sh.quadraticCurveTo(-.2,-.25,0,0);return sh})()),M('#a07a42',{roughness:.7,side:THREE.DoubleSide}));fin.position.set(-1.1,.05,0);tail.add(fin);
 tail.add(fxB_band([[-.3,0,0,.25,.2],[-.6,0,0,.2,.12]],-.45,.03,STRAP));
 // the head: broad and flat like a frog's, eyes up top, the wide mouth strapped shut
 const head=new THREE.Group();head.position.set(.62,.6,0);root.add(head);
 const HEAD=[[-.05,0,0,.26,.36],[.15,.0,0,.22,.36],[.35,-.03,0,.16,.3],[.5,-.06,0,.08,.18],[.54,-.06,0,.02,.04]];head.add(loft(HEAD,{n:16,r:14,back:'#b08a50',belly:'#dcc894',rough:.8}));
 const lipl=tubeAlong([V3(.5,-.1,0),V3(.36,-.1,.27),V3(.12,-.08,.36)],.012,M('#5a4228'),8);head.add(lipl);const lipr=lipl.clone();lipr.scale.z=-1;head.add(lipr);
 for(const z of[-1,1]){const bump=sph(0,.09,.08,.08,10,SKIN);bump.position.set(.2,.17,z*.17);head.add(bump);const e=sph(0,.05,.05,.05,10,M('#2a2018',{roughness:.1}));e.position.set(.25,.2,z*.19);head.add(e)}
 for(const x of[.32,.44]){const b=fxB_band(HEAD,x,.03,STRAP);head.add(b)}
 const ch=tubeAlong([V3(.38,.12,0),V3(.2,.2,0),V3(-.05,.25,0)],.025,STRAP,6);head.add(ch);
 // four thick limbs, splayed: short heavy forelegs, bigger hind legs
 const legs=[];const LEGM=M('#b08a50',{roughness:.8});
 for(const [x,l1,l2,r,ph] of[[.4,.24,.26,.13,0],[-.52,.3,.28,.16,Math.PI]])for(const z of[-1,1]){const l=jleg(l1,l2,r,LEGM,-1.2,{claws:1});l.position.set(x,.48,z*.38);l.rotation.x=-z*.55;root.add(l);
   const band=new THREE.Mesh(new THREE.TorusGeometry(r*1.1,.025,4,12),STRAP);band.rotation.x=Math.PI/2;band.position.y=-l1*.45;l.add(band);
   legs.push({m:l,ph:ph+(z>0?0:Math.PI),base:.5,a:.35,kb:-1.2,ka:.4})}
 g.userData.anim=t=>{const P=9,u=((t%P)+P)%P;const call=fxB_smooth(5.5,6.2,u)*(1-fxB_smooth(7.6,8.3,u));const w=1-call;
  for(const l of legs){const p=t*5+l.ph;l.m.rotation.z=l.base+Math.sin(p)*l.a*w;const k=l.m.userData.knee;k.rotation.z=l.kb+Math.max(0,Math.sin(p+1.4))*l.ka*w;fxB_footFlat(l.m,l.m.rotation.z,k.rotation.z)}
  tail.rotation.y=Math.sin(t*5)*.18*w+Math.sin(t*1.3)*.08;root.rotation.y=Math.sin(t*5)*.04*w;root.rotation.z=-.22*call;root.position.y=.06*call;
  head.rotation.z=.75*call+Math.sin(t*5)*.03*w;head.scale.y=1+Math.max(0,Math.sin((u-6.2)*9))*call*.06};
 return g}

function fxB_box(w,h,d,mat){return new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat)}

/* a jaw's worth of teeth along a curve in the x–z plane: pts are [x,z] pairs, dir +1 points them up, -1 down */
function fxB_teeth(par,pts,y,h,r,mat,dir){for(const [x,z] of pts){const c=cone(r,h,mat,4);c.position.set(x,y+dir*h*.4,z);if(dir<0)c.rotation.z=Math.PI;par.add(c)}}
/* n points round the front of a jaw: from x0 at the corners to x1 at the tip, w wide */
function fxB_arc(x0,x1,w,n){const o=[];for(let i=0;i<n;i++){const a=(i/(n-1)-.5)*Math.PI;o.push([x1-(x1-x0)*Math.abs(Math.sin(a)),Math.sin(a)*w])}return o}

/* ---------------- 熔岩蝾: a three-metre amphibian swimmer: oval head with huge toothed jaws, a long flat tail,
   two pairs of thick fleshy limbs that end in blades, and a back that glows like lava ---------------- */
function fxB_rongyanrong(f){const g=new THREE.Group();const root=new THREE.Group();g.add(root);
 const BODY=[[-.45,0,0,.22,.3],[-.1,.01,0,.26,.36],[.35,.02,0,.25,.34],[.7,.03,0,.22,.3]];
 root.add(loft(BODY,{n:20,r:16,back:'#3a2824',belly:'#7a5a48',spots:30,spotC:'#241814',rough:.6}));
 const LAVA=EM(f.col||'#ff5a2a',1.8),TOOTH=M('#efe6d0',{roughness:.3}),SK=M('#3e2c26',{roughness:.6}),BLADE=M('#d8cdb0',{roughness:.25,metalness:.2});
 // the glowing stripe down the back, carried on into the tail
 const stripe=tubeAlong([V3(.85,.27,0),V3(.4,.29,0),V3(-.1,.28,0),V3(-.45,.23,0)],.05,LAVA,16);stripe.scale.z=1.6;root.add(stripe);
 for(let i=0;i<10;i++)for(const z of[-1,1]){const x=.75-i*.13,c=fxB_sec(BODY,x);const sp=sph(0,.04,.02,.03,7,LAVA);sp.position.set(x,c[0]+c[1]*.82,z*c[2]*.4);root.add(sp)}
 // head: an oval skull, upper jaw fixed, lower jaw hinged; both rows full of teeth
 const head=new THREE.Group();head.position.set(.72,.04,0);root.add(head);
 const sk=sph(0,.42,.2,.32,16,SK);sk.position.set(.3,.06,0);head.add(sk);
 const up=sph(0,.38,.07,.3,14,SK);up.position.set(.38,-.06,0);head.add(up);
 fxB_teeth(head,fxB_arc(.05,.72,.27,13),-.12,.09,.022,TOOTH,-1);
 const jaw=new THREE.Group();jaw.position.set(.02,-.08,0);head.add(jaw);const lj=sph(0,.38,.07,.28,14,M('#6a4a3a',{roughness:.6}));lj.position.set(.36,-.06,0);jaw.add(lj);
 fxB_teeth(jaw,fxB_arc(.05,.68,.24,12),-.02,.08,.02,TOOTH,1);
 const mouthIn=sph(0,.34,.05,.24,10,M('#4a1410'));mouthIn.position.set(.36,-.04,0);jaw.add(mouthIn);
 for(const z of[-1,1]){const e=sph(0,.05,.05,.05,10,M('#ffb040',{emissive:'#ff7a20',emissiveIntensity:.8,roughness:.1}));e.position.set(.42,.18,z*.2);head.add(e)}
 const st2=tubeAlong([V3(.55,.24,0),V3(.25,.27,0),V3(0,.27,0)],.035,LAVA,8);st2.scale.z=1.5;head.add(st2);
 // the long tail, flattened side to side with a fin crest above and below; it drives the swimming
 const tail=new THREE.Group();tail.position.set(-.42,0,0);root.add(tail);const t2=new THREE.Group();t2.position.x=-.6;
 tail.add(loft([[0,0,0,.21,.26],[-.35,0,0,.18,.15],[-.62,0,0,.15,.09]],{n:12,r:12,back:'#3a2824',belly:'#6a4a3a',rough:.6}));tail.add(t2);
 t2.add(loft([[.02,0,0,.15,.09],[-.4,0,0,.12,.05],[-.8,0,0,.06,.025],[-1.0,0,0,.02,.01]],{n:12,r:10,back:'#3a2824',belly:'#6a4a3a',rough:.6}));
 const finM=M('#5a3a2e',{roughness:.6,side:THREE.DoubleSide});const crest=sh=>{const S=new THREE.Shape();S.moveTo(0,0);S.quadraticCurveTo(-.5,sh,-1.0,.02);S.lineTo(0,0);return new THREE.ShapeGeometry(S,6)};
 const f1=new THREE.Mesh(crest(.28),finM);f1.position.y=.08;t2.add(f1);const f2=new THREE.Mesh(crest(.2),finM);f2.scale.y=-1;f2.position.y=-.06;t2.add(f2);
 tail.add(tubeAlong([V3(0,.2,0),V3(-.3,.18,0),V3(-.62,.14,0)],.035,LAVA,8));t2.add(tubeAlong([V3(.02,.14,0),V3(-.4,.11,0),V3(-.8,.06,0)],.025,LAVA,8));
 // two pairs of thick fleshy limbs, each tipped with a curved blade
 const limbs=[];for(const [x,r,len] of[[.45,.09,.42],[-.3,.1,.46]])for(const z of[-1,1]){const l=new THREE.Group();l.position.set(x,-.08,z*.3);root.add(l);
   const u=new THREE.Mesh(muscle(len*.55,r,THIGH),SK);l.add(u);const k=new THREE.Group();k.position.y=-len*.55;l.add(k);k.add(sph(0,r*.8,r*.8,r*.8,9,SK));k.add(new THREE.Mesh(muscle(len*.45,r*.85,SHIN),SK));
   const bl=new THREE.Mesh(new THREE.ConeGeometry(r*.6,len*.55,4),BLADE);bl.scale.z=.3;bl.position.set(r*.4,-len*.45-len*.26,0);bl.rotation.z=Math.PI+.5;k.add(bl);
   l.rotation.x=-z*1.1;l.userData.knee=k;limbs.push({m:l,z,ph:(x>0?0:Math.PI)+(z>0?0:Math.PI)})}
 const glow=glowSprite('#ff7a3a',1.4,.35);glow.position.set(.2,.3,0);root.add(glow);
 g.userData.anim=t=>{const w=t*4;tail.rotation.y=Math.sin(w)*.35;t2.rotation.y=Math.sin(w-1)*.5;root.rotation.y=-Math.sin(w+.5)*.08;head.rotation.y=-Math.sin(w+.8)*.06;
  for(const l of limbs){l.m.rotation.z=-.6+Math.sin(w*.5+l.ph)*.4;l.m.userData.knee.rotation.z=.5+Math.sin(w*.5+l.ph+1)*.3}
  const P=5,u=((t%P)+P)%P;jaw.rotation.z=-.5*fxB_smooth(3.6,4.0,u)*(1-fxB_smooth(4.4,4.6,u))-.05;LAVA.emissiveIntensity=1.5+Math.sin(t*2)*.4};
 g.userData.swim=1;return g}

/* ---------------- 银鳞巨兽: a sea giant whose head alone is over twenty metres: a long snout lined with teeth,
   shining white-silver scales, film-covered eyes with silver pupils, two long-clawed forelimbs, a long silver tail ---------------- */
function fxB_xmsilver(f){const g=new THREE.Group();const root=new THREE.Group();g.add(root);
 const SC=M('#e8eef2',{roughness:.25,metalness:.22}),SC2=M('#cdd6dc',{roughness:.28,metalness:.28}),BEL=M('#f2f4f2',{roughness:.35,metalness:.3}),TOOTH=M('#f6f2e4',{roughness:.3}),CLAW=M('#2e3236',{roughness:.3,metalness:.4});
 const BODY=[[-1.2,0,0,.42,.46],[-.6,.02,0,.55,.6],[0,.03,0,.6,.66],[.6,.04,0,.56,.6],[1.05,.06,0,.44,.48]];
 const bm=loft(BODY,{n:26,r:20,back:'#cfd8de',belly:'#f4f6f4',rough:.25});bm.material=bm.material.clone();bm.material.metalness=.5;bm.material.roughness=.25;root.add(bm);
 // rows of shining scales over the back and flanks
 const sg=new THREE.SphereGeometry(1,6,4),scG=new THREE.Group();for(let i=0;i<16;i++)for(let r=0;r<5;r++)for(const z of[-1,1]){const x=-1.1+i*.14;const c=fxB_sec(BODY,x);const a=.15+r*.3+(i%2)*.15;const m=new THREE.Mesh(sg,r%2?SC2:SC);m.scale.set(.12,.08,.014);
   m.position.set(x,c[0]+Math.sin(a)*c[1]*.99,z*Math.cos(a)*c[2]*.99);m.lookAt(V3(x,c[0],0));scG.add(m)}root.add(fxB_flat(scG));
 // the head and long snout: upper jaw fixed, lower jaw hinged, teeth showing along the closed lips
 const head=new THREE.Group();head.position.set(1.05,.06,0);root.add(head);
 head.add(loft([[-.05,.02,0,.44,.48],[.35,.04,0,.36,.4],[.7,0,0,.22,.27],[1.3,-.04,0,.13,.16],[1.62,-.04,0,.09,.11],[1.7,-.04,0,.02,.03]],{n:20,r:16,back:'#d8e0e6',belly:'#f4f6f4',rough:.25}));
 const jaw=new THREE.Group();jaw.position.set(.3,-.12,0);head.add(jaw);
 jaw.add(loft([[0,0,0,.18,.36],[.5,-.02,0,.1,.2],[1.05,-.04,0,.06,.12],[1.32,-.04,0,.02,.04]],{n:16,r:12,back:'#e8ecec',belly:'#f6f6f2',rough:.3}));
 const ut=[],lt=[];for(let i=0;i<14;i++){const k=i/13;const x=.55+k*1.05;const w=(1-k)*.2+.08;for(const z of[-1,1]){ut.push([x,z*w]);lt.push([x-.3,z*(w-.02)])}}
 fxB_teeth(head,ut,-.1,.1,.022,TOOTH,-1);fxB_teeth(jaw,lt,.02,.09,.02,TOOTH,1);
 for(const z of[-1,1]){const e=sph(0,.11,.11,.11,14,M('#d0dce4',{roughness:.05,metalness:.6}));e.position.set(.32,.2,z*.34);head.add(e);
  const pu=sph(0,.03,.08,.02,9,M('#9aa8b2',{roughness:.05,metalness:.9}));pu.position.set(.4,.2,z*.43);pu.lookAt(V3(.4,.2,z*2));head.add(pu);
  const film=sph(0,.125,.125,.125,14,new THREE.MeshStandardMaterial({color:'#eef6ff',transparent:true,opacity:.35,roughness:.05,depthWrite:false}));film.position.copy(e.position);head.add(film);
  const brow=sph(0,.16,.06,.1,10,SC2);brow.position.set(.3,.3,z*.3);head.add(brow)}
 // two forelimbs ending in long pointed claws
 const arms=[];for(const z of[-1,1]){const a=new THREE.Group();a.position.set(.75,-.32,z*.45);root.add(a);a.add(new THREE.Mesh(muscle(.5,.13,UPARM),SC));
  const k=new THREE.Group();k.position.y=-.5;a.add(k);k.add(sph(0,.11,.11,.11,10,SC));k.add(new THREE.Mesh(muscle(.45,.11,FOREARM),SC));
  const hnd=new THREE.Group();hnd.position.y=-.45;k.add(hnd);hnd.add(sph(0,.12,.07,.12,10,SC));
  for(let i=0;i<4;i++){const c=cone(.028,.36,CLAW,5);c.position.set(.12,-.12,(i-1.5)*.06);c.rotation.z=Math.PI*.7;hnd.add(c)}
  a.rotation.x=-z*.35;a.userData.knee=k;a.userData.hand=hnd;arms.push(a)}
 // small rear paddles and the long tail with a low fin
 for(const z of[-1,1]){const pd=sph(0,.28,.04,.12,9,SC2);pd.position.set(-.95,-.3,z*.45);pd.rotation.y=z*.5;root.add(pd)}
 const tail=new THREE.Group();tail.position.set(-1.15,0,0);root.add(tail);const t2=new THREE.Group();t2.position.x=-1;tail.add(t2);
 tail.add(loft([[0,0,0,.42,.45],[-.5,0,0,.32,.3],[-1.02,0,0,.22,.18]],{n:14,r:16,back:'#cfd8de',belly:'#f4f6f4',rough:.25}));
 t2.add(loft([[.02,0,0,.22,.18],[-.6,0,0,.14,.1],[-1.2,0,0,.06,.04],[-1.4,0,0,.02,.015]],{n:14,r:12,back:'#c8d2d8',belly:'#eef0ee',rough:.25}));
 const fs=new THREE.Shape();fs.moveTo(0,0);fs.quadraticCurveTo(-.6,.5,-1.3,.05);fs.quadraticCurveTo(-.6,-.45,0,0);const fin=new THREE.Mesh(new THREE.ShapeGeometry(fs,8),M('#c0ccd4',{roughness:.3,metalness:.5,side:THREE.DoubleSide}));fin.position.x=-.2;t2.add(fin);
 g.userData.anim=t=>{const w=t*1.4;tail.rotation.y=Math.sin(w)*.22;t2.rotation.y=Math.sin(w-1)*.35;root.rotation.y=-Math.sin(w+.6)*.05;head.rotation.y=-Math.sin(w+.9)*.04;
  arms.forEach((a,i)=>{a.rotation.z=.9+Math.sin(w*.5+i*Math.PI)*.25;a.userData.knee.rotation.z=.3+Math.sin(w*.5+i)*.2});
  const P=8,u=((t%P)+P)%P;jaw.rotation.z=-.35*fxB_smooth(5,5.5,u)*(1-fxB_smooth(6.5,7.2,u))};
 g.userData.swim=1;return g}

/* ---------------- 脚鲸: a whale made to grow back arms with hands and legs with feet, but kept whale-sized ---------------- */
function fxB_jiaojing(f){const g=new THREE.Group();const root=new THREE.Group();g.add(root);
 const SK=M(f.col||'#5a6a7a',{roughness:.45}),BEL=M('#c8ccd0',{roughness:.5});
 const BODY=[[-1.9,.05,0,.12,.1],[-1.5,.05,0,.3,.28],[-.8,.03,0,.52,.5],[0,0,0,.62,.6],[.8,.02,0,.6,.58],[1.4,.0,0,.5,.5],[1.75,-.02,0,.32,.36],[1.9,-.02,0,.04,.06]];
 root.add(loft(BODY,{n:32,r:20,back:'#56667a',belly:'#c8ccd0',rough:.45}));
 // throat grooves, a small eye and a long mouth line
 for(let i=0;i<7;i++){const gr=tubeAlong([V3(1.6,-.3+i*.0,(i-3)*.07),V3(1.0,-.5,(i-3)*.09),V3(.4,-.55,(i-3)*.1)],.012,M('#9aa0a6'),8);root.add(gr)}
 for(const z of[-1,1]){const ml=tubeAlong([V3(1.88,-.06,0),V3(1.6,-.12,z*.3),V3(1.15,-.16,z*.5)],.014,M('#2a3038'),10);root.add(ml);const e=sph(0,.04,.04,.04,9,M('#0a0a0c',{roughness:.1}));e.position.set(1.1,-.02,z*.53);root.add(e)}
 const bh=sph(0,.05,.02,.03,7,M('#2a3038'));bh.position.set(1.2,.5,0);root.add(bh);
 // arms with five-fingered hands just behind the head, where flippers would be
 const arms=[];for(const z of[-1,1]){const a=new THREE.Group();a.position.set(.95,-.28,z*.5);root.add(a);a.add(new THREE.Mesh(muscle(.55,.13,UPARM),SK));
  const k=new THREE.Group();k.position.y=-.55;a.add(k);k.add(sph(0,.1,.1,.1,10,SK));k.add(new THREE.Mesh(muscle(.5,.1,FOREARM),SK));
  const h=fxB_hand(.12,SK);h.position.y=-.55;k.add(h);a.rotation.x=-z*.5;a.userData.knee=k;arms.push(a)}
 // legs with broad feet under the rear of the body
 const legs=[];for(const z of[-1,1]){const l=jleg(.5,.48,.13,SK,-.4);l.position.set(-.85,-.35,z*.32);l.rotation.x=-z*.15;root.add(l);legs.push(l)}
 // the tail stock and flukes
 const tail=new THREE.Group();tail.position.set(-1.7,.05,0);root.add(tail);
 const fl=new THREE.Shape();fl.moveTo(0,0);fl.quadraticCurveTo(-.15,.45,-.55,.85);fl.quadraticCurveTo(-.4,.4,-.45,.0);fl.quadraticCurveTo(-.4,-.4,-.55,-.85);fl.quadraticCurveTo(-.15,-.45,0,0);
 const fluke=new THREE.Mesh(new THREE.ShapeGeometry(fl,8),M('#4e5e70',{roughness:.45,side:THREE.DoubleSide}));fluke.rotation.x=Math.PI/2;fluke.position.x=-.15;tail.add(fluke);
 g.userData.anim=t=>{const w=t*1.6;tail.rotation.z=Math.sin(w)*.35;root.rotation.z=Math.sin(w+1.2)*.04;
  arms.forEach((a,i)=>{a.rotation.z=.6+Math.sin(w)*.55;a.userData.knee.rotation.z=-.3-Math.max(0,Math.sin(w+.6))*.6});
  legs.forEach((l,i)=>{const p=w*1+i*Math.PI;l.rotation.z=-.9+Math.sin(p)*.4;l.userData.knee.rotation.z=-.6+Math.max(0,Math.sin(p+1.2))*.6})};
 g.userData.swim=1;return g}

/* ---------------- a plain human-proportioned figure (feet at y=0, facing +x) used by the 尔什 folk below ----------------
   o: {h, suit, skin, head, hands, feet}; returns a group with userData.P = {root, hips[2], knees[2], sh[2], el[2], head, torso} */
function fxB_human(o){const H=o.h||1.8;const g=new THREE.Group();const root=new THREE.Group();g.add(root);const S=o.suit,HD=o.head||S,HA=o.hands||S,FT=o.feet||S;
 const torso=new THREE.Group();torso.position.y=.52*H;root.add(torso);
 // one smooth trunk from hips to shoulders, flattened front to back
 const PR=[[0,-.03],[.075,-.02],[.09,.03],[.08,.1],[.074,.15],[.09,.22],[.1,.27],[.085,.31],[.035,.335],[0,.34]].map(p=>new THREE.Vector2(p[0]*H,p[1]*H));
 const tr=new THREE.Mesh(new THREE.LatheGeometry(PR,16),S);tr.scale.set(.62,1,1);torso.add(tr);const nk=cyl(.022*H,.026*H,.06*H,HD,8);nk.position.y=.33*H;torso.add(nk);
 const head=new THREE.Group();head.position.y=.36*H;torso.add(head);const hm=sph(0,.06*H,.072*H,.055*H,16,HD);hm.position.y=.055*H;head.add(hm);
 const hips=[],knees=[],sh=[],el=[];
 for(const z of[-1,1]){const hp=new THREE.Group();hp.position.set(0,.52*H,z*.05*H);root.add(hp);hp.add(new THREE.Mesh(muscle(.245*H,.034*H,THIGH),S));
  const kn=new THREE.Group();kn.position.y=-.245*H;hp.add(kn);kn.add(sph(0,.026*H,.026*H,.026*H,9,S));kn.add(new THREE.Mesh(muscle(.245*H,.03*H,SHIN),S));
  const ft=sph(0,.05*H,.02*H,.026*H,9,FT);ft.position.set(.025*H,-.25*H,0);kn.add(ft);hips.push(hp);knees.push(kn);
  const s0=new THREE.Group();s0.position.set(0,.29*H,z*.12*H);torso.add(s0);s0.add(sph(0,.032*H,.032*H,.032*H,9,S));s0.add(new THREE.Mesh(muscle(.17*H,.024*H,UPARM),S));
  const e0=new THREE.Group();e0.position.y=-.17*H;s0.add(e0);e0.add(new THREE.Mesh(muscle(.16*H,.02*H,FOREARM),S));const hd=sph(0,.02*H,.032*H,.014*H,9,HA);hd.position.y=-.18*H;e0.add(hd);
  s0.rotation.x=-z*.08;sh.push(s0);el.push(e0)}
 g.userData.P={root,torso,head,hips,knees,sh,el,H};return g}
function fxB_walkHuman(P,t,fq,a){const s=Math.sin(t*fq);for(let i=0;i<2;i++){const k=i?-1:1;P.hips[i].rotation.z=s*a*k;P.knees[i].rotation.z=-Math.max(0,Math.sin(t*fq+(i?Math.PI:0)+1.3))*a*1.4;P.sh[i].rotation.z=-s*a*.8*k;P.el[i].rotation.z=.25}
 P.root.position.y=Math.abs(Math.cos(t*fq))*.012*P.H}

/* ---------------- 超级英雄: a tall 尔什 in a skin-tight red suit, bounding from roof to roof in long leaps ---------------- */
function fxB_hero(f){const RED=M(f.col||'#d03a30',{roughness:.45}),DK=M('#7a1a18',{roughness:.5}),LENS=M('#f4f4ee',{roughness:.1,metalness:.3}),BELT=M('#e8c040',{roughness:.3,metalness:.6});
 const g=fxB_human({h:1.9,suit:RED,hands:DK,feet:DK});const P=g.userData.P,H=P.H;
 for(const z of[-1,1]){const l=sph(0,.012*H,.018*H,.022*H,9,LENS);l.position.set(.056*H,.065*H,z*.024*H);l.rotation.y=z*.3;P.head.add(l)}
 const bl=new THREE.Mesh(new THREE.TorusGeometry(.085*H,.012*H,5,18),BELT);bl.rotation.x=Math.PI/2;bl.position.y=.035*H;bl.scale.set(.75,1.1,1);P.torso.add(bl);
 const em=new THREE.Mesh(new THREE.CircleGeometry(.045*H,5),M('#f0e8d0',{roughness:.4}));em.rotation.y=Math.PI/2;em.position.set(.071*H,.22*H,0);P.torso.add(em);
 for(const z of[-1,1]){const st=sph(0,.06*H,.03*H,.012*H,9,DK);st.position.set(.0,.2*H,z*.07*H);P.torso.add(st)}
 for(let i=0;i<2;i++){const bt=cyl(.033*H,.03*H,.1*H,DK,8);bt.position.y=-.2*H;P.knees[i].add(bt);const gl=cyl(.024*H,.021*H,.07*H,DK,8);gl.position.y=-.13*H;P.el[i].add(gl)}
 const k=fxB_next('hero');
 g.userData.anim=t=>{const T=2.6,u=(((t+k*.9)%T)+T)%T/T;let y=0,crouch=0,air=0;
  if(u<.16){crouch=Math.sin(u/.16*Math.PI)}else if(u<.84){const s=(u-.16)/.68;y=4*s*(1-s)*1.5*H;air=Math.sin(s*Math.PI)}else{crouch=Math.sin((u-.84)/.16*Math.PI)}
  P.root.position.y=y-crouch*.14*H;P.root.rotation.z=-.35*air-.25*crouch;
  P.hips[0].rotation.z=.9*crouch+1.1*air;P.knees[0].rotation.z=-1.6*crouch-1.4*air;P.hips[1].rotation.z=.9*crouch-.3*air;P.knees[1].rotation.z=-1.6*crouch-.5*air;
  P.sh[0].rotation.z=2.6*air-.6*crouch;P.el[0].rotation.z=.1;P.sh[1].rotation.z=-.7*air-.6*crouch;P.el[1].rotation.z=.6*air+.3;P.head.rotation.z=.35*air};
 return g}

/* ---------------- 白星: shaped like a young 尔什 but glowing pure white all over, with no face and no hair;
   tentacles hang from its head in place of hair ---------------- */
function fxB_baixing(f){const W=new THREE.MeshStandardMaterial({color:'#f6f9ff',emissive:'#e8f2ff',emissiveIntensity:.55,roughness:.25,metalness:.1});
 const g=fxB_human({h:1.55,suit:W});const P=g.userData.P,H=P.H;const tents=[];
 for(let i=0;i<14;i++){const a=(i/14)*Math.PI*1.6-Math.PI*.3;const tg=new THREE.Group();tg.position.set(-Math.cos(a)*.035*H,.1*H,Math.sin(a)*.05*H);P.head.add(tg);
  const L=(.12+h3(i,1,4)*.08)*H;const pts=[];for(let j=0;j<=4;j++){const v=j/4;pts.push(V3(-.012*H*j-Math.cos(a)*.02*H*v,-L*v,Math.sin(a)*.025*H*v))}
  tg.add(tubeAlong(pts,.01*H,W,8));const tip=sph(0,.009*H,.009*H,.009*H,7,W);tip.position.copy(pts[4]);tg.add(tip);tents.push(tg)}
 const gl=glowSprite('#e8f4ff',1.6*H,.25);gl.position.y=.6*H;g.add(gl);const k=fxB_next('baixing');
 g.userData.anim=t=>{fxB_walkHuman(P,t+k,5,.45);P.head.rotation.y=Math.sin(t*.6+k)*.3;tents.forEach((tg,i)=>{tg.rotation.z=Math.sin(t*2.2+i*.7)*.18-.05;tg.rotation.x=Math.cos(t*1.7+i)*.15})};
 return g}

/* ---------------- 有智慧的家禽: geese, quail, turkeys and dodos; they walk with nodding heads and now and then flap ---------------- */
function fxB_bird(f){const k=fxB_next('bird');const kind=['goose','dodo','turkey','quail','goose','dodo'][(k-1)%6];
 const D={goose:{b:'#f2efe6',w:'#e4e0d6',beak:'#f08a2a',leg:'#f08a2a',neck:.3,legL:.3,sz:1,bodyS:[.26,.17,.15],beakL:.12,head:'#f2efe6'},
  dodo:{b:'#8a8c94',w:'#6e7078',beak:'#c8b868',leg:'#d8c050',neck:.16,legL:.2,sz:1.05,bodyS:[.27,.25,.22],beakL:.2,head:'#9a9ca4'},
  turkey:{b:'#3e3024',w:'#5a4430',beak:'#c8b090',leg:'#b8a080',neck:.26,legL:.32,sz:1.1,bodyS:[.27,.22,.19],beakL:.06,head:'#8ab0d0'},
  quail:{b:'#8a6a48',w:'#7a5a3a',beak:'#3a2a20',leg:'#c8a070',neck:.06,legL:.18,sz:.5,bodyS:[.2,.15,.14],beakL:.05,head:'#7a5a3a'}}[kind];
 const g=new THREE.Group();const root=new THREE.Group();root.scale.setScalar(D.sz);g.add(root);const B=M(D.b,{roughness:.85}),Wm=M(D.w,{roughness:.85}),BK=M(D.beak,{roughness:.4}),LG=M(D.leg,{roughness:.5});
 const LL=D.legL,BY=LL+.1;const body=new THREE.Group();body.position.y=BY;root.add(body);const [bx,by,bz]=D.bodyS;body.add(sph(0,bx,by,bz,14,B));
 // neck and head
 const neck=new THREE.Group();neck.position.set(bx*.75,by*.35,0);body.add(neck);const nl=D.neck;
 neck.add(tubeAlong([V3(0,0,0),V3(nl*.25,nl*.55,0),V3(nl*.3,nl,0)],kind==='goose'?.05:.06,kind==='turkey'?M(D.head,{roughness:.6}):B,8));
 const hd=new THREE.Group();hd.position.set(nl*.3,nl+.02,0);neck.add(hd);const hs=kind==='dodo'?1.35:1;hd.add(sph(0,.07*hs,.06*hs,.055*hs,10,M(D.head,{roughness:.7})));
 const bk=cone(kind==='dodo'?.065:.025,D.beakL,BK,6);bk.rotation.z=-Math.PI/2;bk.position.x=.06+D.beakL/2;if(kind==='dodo'){bk.scale.set(1,1,.8);const hook=sph(0,.05,.045,.04,9,BK);hook.position.set(.04+D.beakL,-.025,0);hd.add(hook)}hd.add(bk);
 for(const z of[-1,1]){const e=sph(0,.013,.013,.013,7,M('#0a0a0a',{roughness:.1}));e.position.set(.04,.02,z*.045);hd.add(e)}
 if(kind==='goose'){const kn=sph(0,.02,.025,.015,7,M('#2a2a2a'));kn.position.set(.075,.03,0);hd.add(kn)}
 if(kind==='turkey'){const sn=tubeAlong([V3(.08,.02,0),V3(.1,-.04,0),V3(.09,-.09,0)],.012,M('#c82a2a',{roughness:.5}),6);hd.add(sn);const wt=sph(0,.025,.05,.02,9,M('#c82a2a',{roughness:.5}));wt.position.set(.03,-.07,0);hd.add(wt)}
 if(kind==='quail'){const pl=tubeAlong([V3(0,.05,0),V3(.04,.11,0),V3(.08,.1,0)],.008,M('#2a1a10'),6);hd.add(pl)}
 // tail: a goose's short wedge, a turkey's fan, a dodo's curly tuft
 const tail=new THREE.Group();tail.position.set(-bx*.9,by*.2,0);body.add(tail);
 if(kind==='turkey'){for(let i=0;i<11;i++){const a=(i/10-.5)*2.4;const fth=sph(0,.03,.22,.06,7,M(i%2?'#4a3826':'#6a5034',{roughness:.8}));fth.position.set(-.02,Math.cos(a)*.18,Math.sin(a)*.18);fth.rotation.x=-a;tail.add(fth)}tail.rotation.z=.15}
 else if(kind==='dodo'){for(let i=0;i<4;i++){const c=tubeAlong([V3(0,0,0),V3(-.05,.08,(i-1.5)*.03),V3(-.02,.15,(i-1.5)*.04)],.018,M('#e8e4d8'),6);tail.add(c)}}
 else{const tw=cone(.08,.14,Wm,5);tw.rotation.z=Math.PI/2+.4;tail.add(tw)}
 // wings, folded on the flanks; they open and beat for a moment now and then
 const wings=[];for(const z of[-1,1]){const w=new THREE.Group();w.position.set(bx*.25,by*.45,z*bz*.85);body.add(w);const sm=kind==='dodo'?.45:1;
  const m=sph(0,bx*.85*sm,.04,bz*.55*sm,10,Wm);m.position.set(-bx*.35*sm,0,z*bz*.4*sm);w.add(m);w.userData.z=z;wings.push(w)}
 // legs: a short thigh hidden in the body, a long shank bending forward at the ankle, three toes forward and one back
 const legs=[];for(const z of[-1,1]){const hp=new THREE.Group();hp.position.set(-.02,LL,z*.07);root.add(hp);const sh=cyl(.016,.012,LL*.62,LG,5);sh.position.y=-LL*.31;hp.add(sh);
  const an=new THREE.Group();an.position.y=-LL*.62;hp.add(an);const sh2=cyl(.012,.01,LL*.38,LG,5);sh2.position.y=-LL*.19;an.add(sh2);const ft=new THREE.Group();ft.position.y=-LL*.38;an.add(ft);
  for(const a of[-.5,0,.5]){const t2=cyl(.008,.006,.07,LG,4);t2.rotation.z=-Math.PI/2;t2.rotation.y=a;t2.position.set(Math.cos(a)*.035,0,-Math.sin(a)*.035);ft.add(t2)}
  if(kind==='goose'){const web=new THREE.Mesh(new THREE.CircleGeometry(.065,6,-.6,1.2),M(D.leg,{side:THREE.DoubleSide}));web.rotation.x=-Math.PI/2;web.position.y=.002;ft.add(web)}
  const bt=cyl(.006,.005,.04,LG,4);bt.rotation.z=Math.PI/2;bt.position.x=-.02;ft.add(bt);legs.push({hp,an,ft,ph:z>0?0:Math.PI})}
 g.userData.anim=t=>{const fq=kind==='quail'?11:6;const P=7+(k%3),u=(((t+k*1.7)%P)+P)%P;const flap=fxB_smooth(5.2,5.4,u)*(1-fxB_smooth(6.3,6.6,u));const walk=1-flap*.7;
  for(const l of legs){const p=t*fq+l.ph;l.hp.rotation.z=Math.sin(p)*.45*walk;l.an.rotation.z=.25+Math.max(0,Math.sin(p+1.2))*.7*walk;l.ft.rotation.z=-(l.hp.rotation.z+l.an.rotation.z)}
  body.position.y=BY+Math.abs(Math.cos(t*fq))*.015+flap*.05;body.rotation.z=Math.sin(t*fq*2)*.03+flap*.25;body.rotation.x=Math.sin(t*fq)*.04;
  neck.rotation.z=Math.sin(t*fq*2)*.12*walk;hd.rotation.z=-Math.sin(t*fq*2)*.1;hd.position.x=nl*.3+Math.max(0,Math.sin(t*fq*2))*.02;
  wings.forEach(w=>{w.rotation.x=-w.userData.z*flap*(1.1+Math.sin(t*16)*.6);w.rotation.y=w.userData.z*flap*.2})};
 return g}

/* ---------------- 骨架幼苗: a meat-eating seedling that grew in an animal's bones and now walks wearing the skeleton:
   skull, spine, ribs and four bony legs, with green stems and leaves twined through them ---------------- */
function fxB_gujia(f){const g=new THREE.Group();const root=new THREE.Group();g.add(root);const k=fxB_next('gujia');
 const BONE=M(f.col||'#efe6d0',{roughness:.65}),DARK=M('#2a2018'),STEM=M('#4a8a3a',{roughness:.6}),STEM2=M('#6a5a2a',{roughness:.7}),LEAF=M('#5aa048',{roughness:.6,side:THREE.DoubleSide}),FLESH=M('#3e7a34',{roughness:.5});
 // the spine: a row of vertebrae from neck to tail, with ribs hanging round a green core
 const sp=[];for(let i=0;i<14;i++){const x=.55-i*.09,y=.72+Math.sin(i*.35)*.03-(i>9?(i-9)*.03:0);sp.push(V3(x,y,0));const v=sph(0,.035,.04,.035,7,BONE);v.position.set(x,y,0);root.add(v);if(i<9){const pr=cone(.015,.07,BONE,4);pr.position.set(x,y+.05,0);root.add(pr)}}
 for(let i=0;i<6;i++){const x=.38-i*.08,r=.18-Math.abs(i-2)*.02;for(const z of[-1,1]){const rib=tubeAlong([V3(x,.72,z*.02),V3(x-.01,.7,z*r),V3(x-.03,.55,z*r*1.05),V3(x-.04,.45,z*r*.5)],.012,BONE,8);root.add(rib)}}
 const core=sph(0,.22,.11,.12,10,FLESH);core.position.set(.15,.6,0);root.add(core);
 const pel=sph(0,.08,.05,.11,9,BONE);pel.position.set(-.25,.7,0);root.add(pel);
 // the skull with empty eye holes and a jaw of teeth
 const sk=new THREE.Group();sk.position.set(.6,.74,0);root.add(sk);const cr=sph(0,.12,.08,.08,10,BONE);cr.position.x=.08;sk.add(cr);const sn=sph(0,.11,.045,.055,10,BONE);sn.position.set(.2,-.02,0);sk.add(sn);
 for(const z of[-1,1]){const e=sph(0,.03,.028,.02,9,DARK);e.position.set(.12,.03,z*.06);sk.add(e)}
 const jaw=new THREE.Group();jaw.position.set(.04,-.05,0);sk.add(jaw);const jb=sph(0,.14,.02,.05,9,BONE);jb.position.x=.14;jaw.add(jb);
 for(let i=0;i<6;i++)for(const z of[-1,1]){const t=cone(.01,.035,BONE,4);t.position.set(.12+i*.03,.02,z*.035);jaw.add(t);const t2=cone(.01,.03,BONE,4);t2.position.set(.13+i*.03,-.06,z*.04);t2.rotation.z=Math.PI;sk.add(t2)}
 // four bony legs with clawed toes; stems wind down each one
 const legs=[];for(const [x,ph] of[[.4,0],[-.25,Math.PI]])for(const z of[-1,1]){const l=new THREE.Group();l.position.set(x,.68,z*.12);root.add(l);const b1=cyl(.018,.014,.34,BONE,5);b1.position.y=-.17;l.add(b1);l.add(sph(0,.03,.03,.03,7,BONE));
  const kn=new THREE.Group();kn.position.y=-.34;l.add(kn);kn.add(sph(0,.025,.025,.025,7,BONE));const b2=cyl(.014,.01,.32,BONE,5);b2.position.y=-.16;kn.add(b2);
  for(let c=-1;c<=1;c++){const cl=cone(.008,.06,BONE,4);cl.position.set(.03,-.32,c*.02);cl.rotation.z=-Math.PI/2-.4;kn.add(cl)}
  l.add(tubeAlong([V3(.01,0,.015),V3(-.015,-.1,-.01),V3(.015,-.22,.012),V3(-.01,-.33,0)],.008,STEM,8));kn.add(tubeAlong([V3(.012,0,0),V3(-.012,-.12,.01),V3(.01,-.3,-.01)],.007,STEM,8));
  legs.push({m:l,kn,ph:ph+(z>0?0:Math.PI)*(x>0?1:1)+(z>0?0:Math.PI)})}
 // stems twined along the spine, out through the ribs, with leaves and one bud on top
 root.add(tubeAlong(sp.map((p,i)=>V3(p.x,p.y+.02+Math.sin(i*1.3)*.03,Math.cos(i*1.3)*.04)),.014,STEM,40));root.add(tubeAlong(sp.slice(0,10).map((p,i)=>V3(p.x,p.y-.06+Math.cos(i*1.1)*.03,Math.sin(i*1.1)*.06)),.01,STEM2,30));
 const lg=new THREE.Shape();lg.moveTo(0,0);lg.quadraticCurveTo(.05,.04,.13,0);lg.quadraticCurveTo(.05,-.04,0,0);const lgeo=new THREE.ShapeGeometry(lg,4);
 const leaves=[];for(let i=0;i<12;i++){const lf=new THREE.Mesh(lgeo,LEAF);const p=sp[(i*3)%12];lf.position.set(p.x,p.y+.03,(i%2?1:-1)*.04);lf.rotation.set((i%2?1:-1)*1.0,h3(i,2,k)*6,.5);root.add(lf);leaves.push(lf)}
 for(let i=0;i<5;i++){const t=tubeAlong([V3(.3-i*.12,.5,(i%2?1:-1)*.1),V3(.28-i*.12,.62,(i%2?1:-1)*.2),V3(.3-i*.12,.74,(i%2?1:-1)*.24)],.008,STEM,6);root.add(t);const lf=new THREE.Mesh(lgeo,LEAF);lf.position.set(.3-i*.12,.74,(i%2?1:-1)*.24);lf.rotation.set(0,(i%2?1:-1)*1.2,.6);root.add(lf)}
 const bud=sph(0,.04,.06,.04,9,M('#a84a5a',{roughness:.5}));bud.position.set(.1,.9,0);root.add(bud);root.add(tubeAlong([V3(.15,.74,0),V3(.12,.82,.01),V3(.1,.88,0)],.01,STEM,6));
 g.userData.anim=t=>{const fq=8;for(const l of legs){const p=t*fq+l.ph;l.m.rotation.z=Math.sin(p)*.45;l.kn.rotation.z=-.15-Math.max(0,Math.sin(p+1.3))*.5}
  root.position.y=Math.abs(Math.sin(t*fq))*.02;root.rotation.x=Math.sin(t*fq)*.03;sk.rotation.z=Math.sin(t*fq*.5)*.06;jaw.rotation.z=-Math.max(0,Math.sin(t*3))*.3;
  leaves.forEach((lf,i)=>lf.rotation.y+=Math.sin(t*6+i)*.004);bud.rotation.z=Math.sin(t*2)*.2};
 return g}

/* ---------------- 白骸龙: their armour is forged teal metal, polished and shining, not bone; the spear has a plain metal head ---------------- */
const fxB_baihai0=bDragonkin2;
function fxB_baihai(f){const g=fxB_baihai0(f);const TEAL=M('#4cb4aa',{metalness:.5,roughness:.22}),TEAL2=M('#3a9c94',{metalness:.5,roughness:.26}),TIP=M('#a8c0bc',{metalness:.5,roughness:.2});
 const bone=new Set(['#d8ceb4','#b0a690','#e8dcc4','#9a9080','#9a968c']);const glow=GL('#9ff2ff');let n=0;
 g.traverse(c=>{if(!c.isMesh)return;const m=c.material;if(m===glow){c.material=TIP;return}if(m&&m.color&&!m.vertexColors&&bone.has('#'+m.color.getHexString())){c.material=(n++%2)?TEAL2:TEAL}});
 return g}

/* ---------------- 坚甲龙: the 白骸龙's heavy beast: two metres high, eight long, thick black armour over everything
   down to the eyelids, blade-like plates along the back and a bony club at the end of the tail ---------------- */
function fxB_jianjia(f){const g=new THREE.Group();const root=new THREE.Group();g.add(root);
 const AR=M('#25262a',{roughness:.45,metalness:.25}),AR2=M('#34353a',{roughness:.5,metalness:.2}),SK=M('#3e3a36',{roughness:.8}),BL=M('#4a4a50',{roughness:.3,metalness:.4});
 const BODY=[[-1.0,.95,0,.4,.5],[-.4,1.05,0,.55,.72],[.3,1.02,0,.52,.68],[.85,.92,0,.38,.48],[1.1,.85,0,.22,.3]];
 root.add(loft(BODY,{n:22,r:18,back:'#2a2a2e',belly:'#4a4640',rough:.5}));
 // overlapping armour plates in rows over the back, each row a ring of slabs
 const plG=new THREE.Group(),PB=new THREE.BoxGeometry(.2,.05,.24);for(let i=0;i<9;i++){const x=-.9+i*.22;const c=fxB_sec(BODY,x);for(let r=-3;r<=3;r++){const a=Math.PI/2+r*.36;const p=new THREE.Mesh(PB,(i+r)%2?AR:AR2);
   p.position.set(x,c[0]+Math.sin(a)*c[1]*1.02,Math.cos(a)*c[2]*1.02);p.rotation.x=-(a-Math.PI/2)*1.0;plG.add(p)}
  // blade-like ridges along the spine and down each flank
  for(const r of[-2,0,2]){const a=Math.PI/2+r*.36;const b=cone(.07,.34-Math.abs(r)*.06,BL,4);b.scale.z=.25;b.position.set(x,c[0]+Math.sin(a)*c[1]*1.05+.12,Math.cos(a)*c[2]*1.05);b.rotation.x=-(a-Math.PI/2);b.rotation.z=-.35;plG.add(b)}}root.add(fxB_flat(plG));
 // the head: low, wide and armoured, with plated lids over the eyes and a blunt beak
 const head=new THREE.Group();head.position.set(1.1,.82,0);root.add(head);
 head.add(loft([[-.05,0,0,.24,.3],[.25,-.02,0,.22,.27],[.48,-.06,0,.14,.18],[.56,-.08,0,.03,.05]],{n:12,r:14,back:'#2a2a2e',belly:'#4a4640',rough:.5}));
 const cap=sph(0,.3,.12,.3,12,AR);cap.position.set(.15,.14,0);head.add(cap);
 for(const z of[-1,1]){const e=sph(0,.035,.035,.035,9,M('#c8a040',{roughness:.1}));e.position.set(.28,.08,z*.22);head.add(e);const lid=sph(0,.07,.04,.06,9,AR2);lid.position.set(.29,.12,z*.22);head.add(lid);
  const hn=cone(.06,.22,BL,4);hn.position.set(-.05,.12,z*.26);hn.rotation.set(z*1.0,0,1.2);head.add(hn)}
 // four pillar legs with armoured shins
 const legs=[];for(const [x,ph] of[[.65,0],[-.6,Math.PI]])for(const z of[-1,1]){const l=jleg(.38,.4,.17,SK,-.25);l.position.set(x,.82,z*.48);root.add(l);const gr=cyl(.19,.17,.3,AR,8);gr.position.y=-.2;l.userData.knee.add(gr);legs.push({m:l,ph:ph+(z>0?0:Math.PI)})}
 // the tail and its club
 const tail=new THREE.Group();tail.position.set(-1.0,.95,0);root.add(tail);
 tail.add(loft([[0,0,0,.36,.42],[-.7,-.12,0,.2,.24],[-1.4,-.2,0,.11,.13],[-1.8,-.22,0,.08,.09]],{n:16,r:12,back:'#2a2a2e',belly:'#4a4640',rough:.5}));
 for(let i=0;i<5;i++){const b=cone(.06,.22,BL,4);b.scale.z=.25;b.position.set(-.25-i*.3,.3-i*.06,0);b.rotation.z=.5;tail.add(b)}
 const club=sph(0,.3,.2,.34,12,AR);club.position.set(-1.95,-.22,0);tail.add(club);for(const z of[-1,1]){const k=sph(0,.14,.13,.12,9,AR2);k.position.set(-1.95,-.22,z*.3);tail.add(k)}
 g.userData.anim=t=>{const fq=2.2;for(const l of legs){const p=t*fq+l.ph;l.m.rotation.z=Math.sin(p)*.28;l.m.userData.knee.rotation.z=-.25+Math.max(0,Math.sin(p+1.4))*.35;fxB_footFlat(l.m,l.m.rotation.z,l.m.userData.knee.rotation.z)}
  root.position.y=Math.abs(Math.sin(t*fq))*.02;tail.rotation.y=Math.sin(t*fq*.5)*.25;head.rotation.y=Math.sin(t*.7)*.12};
 return g}
const fxB_dachuo0=bDachuo;
/* this record covers both beasts: the odd ones are 大鸵龙, the even ones 坚甲龙 */
function fxB_dachuolong(f){return fxB_next('dachuolong')%2?fxB_dachuo0(f):fxB_jianjia(f)}

/* ---------------- 血雾大师: a very fat crystal-skinned 翡翠龙 wrapped in a heavy black cloak (no red scarf) ---------------- */
const fxB_xuewu0=bDragonkin2;
function fxB_xuewu(f){const g=fxB_xuewu0(f);const red=new Set(['c8302a']);const drop=[];
 g.traverse(c=>{if(c.isMesh&&c.material&&c.material.color&&red.has(c.material.color.getHexString()))drop.push(c)});drop.forEach(c=>c.parent.remove(c));
 // remove the crystal pin that held the scarf (an emissive red bead near the throat)
 const pins=[];g.traverse(c=>{if(c.isMesh&&c.material&&c.material.emissive&&c.material.emissiveIntensity>.3&&c.position.y>1.5&&c.position.y<1.95&&c.parent===g)pins.push(c)});pins.forEach(c=>g.remove(c));
 const SKN=M('#2f8a58',{roughness:.35,metalness:.35});
 const belly=sph(0,.48,.5,.5,16,SKN);belly.position.set(.12,1.22,0);g.add(belly);const jowl=sph(0,.22,.18,.26,12,SKN);jowl.position.set(.3,1.78,0);g.add(jowl);
 // the cloak: a heavy black hooded shell over the shoulders and back, open at the front
 const CL=M('#141416',{roughness:.9,side:THREE.DoubleSide});
 const cloak=new THREE.Mesh(new THREE.CylinderGeometry(.34,.72,1.25,20,3,true,Math.PI*.18,Math.PI*1.64),CL);cloak.rotation.y=Math.PI/2;cloak.position.set(-.02,1.3,0);g.add(cloak);
 const hood=new THREE.Mesh(new THREE.SphereGeometry(.3,14,10,Math.PI*.15,Math.PI*1.7,0,Math.PI*.62),CL);hood.rotation.y=Math.PI/2;hood.position.set(.18,2.02,0);g.add(hood);
 const clasp=sph(0,.05,.05,.03,9,M('#b89a40',{metalness:.8,roughness:.3}));clasp.position.set(.36,1.86,0);g.add(clasp);
 const a0=g.userData.anim;g.userData.anim=t=>{a0&&a0(t);cloak.rotation.z=Math.sin(t*1.3)*.03;belly.scale.y=.5+Math.sin(t*2.2)*.012};
 return g}

/* ---------------- 混肢兽: about a metre, like a fish with no fins; every one grows a different set of three to ten
   limbs (claws, tentacles, legs) and scrambles along on them ---------------- */
function fxB_hunzhi(f){const g=new THREE.Group();const root=new THREE.Group();g.add(root);const k=fxB_next('hunzhi');let sd=k*97.3+11;const Rn=()=>{sd+=1.618;return h3(sd,k,3.1)};
 const SK=M(f.col||'#6b5a6e',{roughness:.5}),CL=M('#e8dcc8',{roughness:.35});
 const BODY=[[-.75,.5,0,.05,.04],[-.5,.52,0,.16,.12],[-.1,.55,0,.25,.2],[.35,.56,0,.24,.2],[.62,.54,0,.15,.13],[.7,.53,0,.03,.03]];
 root.add(loft(BODY,{n:20,r:14,back:'#5a4a5e',belly:'#a89aa8',spots:20,spotC:'#3a2a3e',rough:.5}));
 for(const z of[-1,1]){const e=sph(0,.04,.04,.04,9,M('#e8e0a0',{roughness:.1}));e.position.set(.56,.6,z*.09);root.add(e)}
 const mouth=tubeAlong([V3(.69,.5,0),V3(.6,.48,.09),V3(.5,.48,.12)],.01,M('#2a1a2a'),6);root.add(mouth);const m2=mouth.clone();m2.scale.z=-1;root.add(m2);
 const n=3+Math.floor(Rn()*8);const limbs=[];
 for(let i=0;i<n;i++){const x=.45-(i/(n-1||1))*.95+(Rn()-.5)*.1;const side=i%2?1:-1;const c=fxB_sec(BODY,x);const ang=(.2+Rn()*.9)*side;const kind=Rn();
  const l=new THREE.Group();l.position.set(x,c[0]-c[1]*.4,side*c[2]*.8);l.rotation.x=-ang;root.add(l);let knee=null;
  if(kind<.4){const a=cyl(.035,.028,.28,SK,6);a.position.y=-.14;l.add(a);knee=new THREE.Group();knee.position.y=-.28;l.add(knee);knee.add(sph(0,.035,.035,.035,7,SK));const b=cyl(.028,.018,.26,SK,6);b.position.y=-.13;knee.add(b);knee.rotation.z=-.6}
  else if(kind<.7){l.add(tubeAlong([V3(0,0,0),V3(.06,-.15,0),V3(-.03,-.3,0),V3(.05,-.42,0)],.025,SK,10))}
  else{const a=cyl(.04,.032,.22,SK,6);a.position.y=-.11;l.add(a);knee=new THREE.Group();knee.position.y=-.22;l.add(knee);knee.rotation.z=.9;const pc=new THREE.Group();pc.position.y=-.06;knee.add(pc);
   pc.add(sph(0,.07,.05,.04,9,SK));const u=cone(.025,.14,CL,4);u.position.set(.05,-.09,0);u.rotation.z=.4;pc.add(u);const d=cone(.022,.12,CL,4);d.position.set(-.03,-.1,0);d.rotation.z=-.3;pc.add(d)}
  limbs.push({l,knee,ph:Rn()*6.28,kb:kind<.4?-.6:.9,kd:kind<.4?1:-1})}
 g.userData.anim=t=>{for(const L of limbs){const p=t*9+L.ph;L.l.rotation.z=Math.sin(p)*.45;if(L.knee)L.knee.rotation.z=L.kb+Math.max(0,Math.sin(p+1.2))*.3*L.kd}
  root.position.y=Math.abs(Math.sin(t*9))*.02;root.rotation.y=Math.sin(t*3)*.08;root.rotation.x=Math.sin(t*4.5)*.05};
 return g}

/* ---------------- 钩虫: a flat oval arthropod with a row of leaf-like flaps down each side and a pair of barbed hooks on its head ---------------- */
function fxB_gouchong(f){const g=new THREE.Group();const root=new THREE.Group();g.add(root);
 const SH=M(f.col||'#5a6a5a',{roughness:.45}),DK=M('#3a443a',{roughness:.5}),FL=M('#7a8a6a',{roughness:.6,side:THREE.DoubleSide}),HK=M('#c8bc98',{roughness:.35});
 const body=sph(0,.75,.13,.42,18,SH);root.add(body);
 for(let i=0;i<8;i++){const x=.55-i*.16;const seg=new THREE.Mesh(new THREE.TorusGeometry(1,.012,4,24,Math.PI),DK);seg.rotation.y=Math.PI/2;const w=.42*Math.sqrt(Math.max(0,1-Math.pow(x/.75,2)));seg.scale.set(w,.13*Math.sqrt(Math.max(0,1-Math.pow(x/.75,2)))*1.02,1);seg.position.x=x;root.add(seg)}
 for(const z of[-1,1]){const e=sph(0,.04,.04,.04,9,M('#101410',{roughness:.05}));e.position.set(.6,.08,z*.13);root.add(e)}
 // the leaf-like flaps: one per segment on each side, beating in a wave
 const leaf=new THREE.Shape();leaf.moveTo(0,-.06);leaf.quadraticCurveTo(.16,-.07,.22,0);leaf.quadraticCurveTo(.16,.07,0,.06);leaf.lineTo(0,-.06);const lg=new THREE.ShapeGeometry(leaf,5);lg.rotateX(Math.PI/2);lg.rotateY(-Math.PI/2);
 const flaps=[];for(let i=0;i<8;i++)for(const z of[-1,1]){const x=.5-i*.15;const w=.42*Math.sqrt(Math.max(0,1-Math.pow(x/.75,2)));const fl=new THREE.Group();fl.position.set(x,0,z*w*.95);root.add(fl);const m=new THREE.Mesh(lg,FL);if(z<0)m.scale.z=-1;fl.add(m);flaps.push({fl,z,i})}
 // the two hooks: jointed arms reaching forward, each ending in a curved, barbed hook
 const hooks=[];for(const z of[-1,1]){const h=new THREE.Group();h.position.set(.68,.02,z*.1);root.add(h);
  const a=tubeAlong([V3(0,0,0),V3(.16,.04,z*.03),V3(.3,.02,z*.05),V3(.38,-.06,z*.04),V3(.36,-.14,z*.02)],.022,HK,12);h.add(a);
  for(let b=0;b<4;b++){const sp=cone(.012,.05,HK,4);sp.position.set(.12+b*.07,.0-(b>2?.06:0),z*(.04+b*.006));sp.rotation.z=-2.3;h.add(sp)}hooks.push(h)}
 g.userData.anim=t=>{flaps.forEach(o=>{o.fl.rotation.x=o.z*Math.sin(t*6-o.i*.7)*.5});hooks.forEach((h,i)=>{h.rotation.z=Math.sin(t*1.5+i)*.15;h.rotation.y=(i?-1:1)*.1+Math.sin(t*1.1+i*2)*.08});root.rotation.z=Math.sin(t*2)*.03};
 g.userData.swim=1;return g}

/* ================= registration ================= */




{const fxB_brain0=bBrain;bBrain=f=>f&&f.w==='zaonao'?fxB_zaonao(f):fxB_brain0(f)}
