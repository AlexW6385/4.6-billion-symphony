/* ================================================================
   fix H: void, dream, midgard, tunnel, ningu and buke entries that the generic shape kit drew wrongly.
   Each entry listed in fxH_SH gets its own model (built in the shape's own frame, S = its kp.r or kp.s);
   every other entry still goes through the original kit. A lone k:'bird' is a phoenix now, never a dragon.
   ================================================================ */
const fxH_make0=makeShape;
const fxH_SH={};
// the kit's flags that had no shape behind them now pick the model made for them
const fxH_FLAG={ribs:'ng_lost',bridges:'ng_qiushen',scales:'ng_pinecone',barnacle:'bk_tenghu',peel:'bk_crying',gun:'v_chuanxing',rust:'v_zhengteng'};
makeShape=function(w,sp,frozen){const kp=w.kp||{};let f=fxH_SH[w.id];if(!f)for(const k in fxH_FLAG)if(kp[k]){f=fxH_SH[fxH_FLAG[k]];break}if(!f&&w.k==='bird'&&(kp.n||12)===1&&!kp.brick)f=fxH_phoenixShape;if(!f)return fxH_make0(w,sp,frozen);
 const seed=hashStr(w.id);const x={w,sp,kp,frozen,seed,Rn:rnd(seed),S:kp.r||kp.s||20,c:kp.c||'#9fb4c8',c2:kp.c2||'#4a5a6a'};const g=new THREE.Group();let an=null;
 try{an=f(g,x)}catch(e){console.warn('fxH shape',w.id,e);return fxH_make0(w,sp,frozen)}
 if(an&&!frozen)anim(sp,g,an);return g};
/* ---------- small helpers ---------- */
// a lumpy, faceted ball: icosahedron pushed in and out by noise
function fxH_lumpGeo(R,det,amp,seed,sq){const g=new THREE.IcosahedronGeometry(R,det);const p=g.attributes.position,v=V3();const o=(seed%37)*.31;
 for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);const n=fbm(v.x/R*1.7+o,v.y/R*1.7,v.z/R*1.7,4);v.multiplyScalar(1-amp+n*amp*2);if(sq)v.multiply(sq);p.setXYZ(i,v.x,v.y,v.z)}g.computeVertexNormals();return g}
// a wing in the x–z plane: span out along +z, chord along x
function fxH_wingGeo(span,chord){const g=wingGeo(span,chord);const p=g.attributes.position;for(let i=0;i<p.count;i++){const a=p.getX(i),b=p.getZ(i);p.setXYZ(i,b,0,a)}g.computeVertexNormals();return g}
function fxH_addMat(col,op){return new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:op,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide})}
// an instanced mesh with a colour per instance
function fxH_inst(geo,mat,n,set,cols){const im=new THREE.InstancedMesh(geo,mat,n),o=new THREE.Object3D(),cc=new THREE.Color();for(let i=0;i<n;i++){o.position.set(0,0,0);o.rotation.set(0,0,0);o.quaternion.identity();o.scale.set(1,1,1);set(o,i);o.updateMatrix();im.setMatrixAt(i,o.matrix);if(cols)im.setColorAt(i,cc.set(cols[i%cols.length]))}im.frustumCulled=false;return im}
const fxH_UP=V3(0,1,0);
// a plain faceless figure: head, body and four limbs, standing on y=0 and about h tall
function fxH_faceless(h,mat,trim){const g=new THREE.Group();const H=h;
 const hd=sph(0,H*.075,H*.09,H*.075,16,mat);hd.position.y=H*.9;g.add(hd);
 const tor=sph(0,H*.13,H*.2,H*.1,16,mat);tor.position.y=H*.64;g.add(tor);const hip=sph(0,H*.11,H*.08,H*.09,12,trim||mat);hip.position.y=H*.47;g.add(hip);
 const arms=[];for(const z of[-1,1]){const a=new THREE.Group();a.position.set(0,H*.8,z*H*.15);const u=cyl(H*.035,H*.03,H*.32,mat,8);u.position.y=-H*.16;a.add(u);const l=cyl(H*.03,H*.022,H*.3,trim||mat,8);l.position.y=-H*.46;a.add(l);a.rotation.x=z*.12;g.add(a);arms.push(a)
  const lg=new THREE.Group();lg.position.set(0,H*.46,z*H*.07);const t=cyl(H*.05,H*.04,H*.24,mat,8);t.position.y=-H*.12;lg.add(t);const s=cyl(H*.04,H*.03,H*.22,trim||mat,8);s.position.y=-H*.35;lg.add(s);g.add(lg)}
 if(trim){const sh=new THREE.Mesh(new THREE.TorusGeometry(H*.11,H*.018,6,20),trim);sh.rotation.x=Math.PI/2;sh.position.y=H*.76;g.add(sh)}
 g.userData.arms=arms;return g}

/* ---------- the phoenix: a round, rugby-ball body and two broad wings of light. No head, no tail, no feet ---------- */
function fxH_phoenix(S,col,o){o=o||{};const g=new THREE.Group();
 const body=new THREE.Mesh(new THREE.SphereGeometry(S*.3,24,16),mt(col,{emissive:col,emissiveIntensity:o.star?1.4:.9,roughness:.4}));body.scale.set(1.45,.85,.85);g.add(body);
 const core=new THREE.Mesh(new THREE.SphereGeometry(S*.2,16,12),new THREE.MeshBasicMaterial({color:'#fff2c8'}));core.scale.set(1.5,.8,.8);g.add(core);
 const wings=[];const WM=fxH_addMat(col,.5),WI=fxH_addMat('#ffe8a8',.45);
 for(const z of[-1,1]){const wg=new THREE.Group();wg.position.set(S*.05,S*.05,z*S*.18);
  const a=new THREE.Mesh(fxH_wingGeo(S*1.5,S*.95),WM);const b=new THREE.Mesh(fxH_wingGeo(S*1.05,S*.55),WI);b.position.set(S*.06,S*.01,0);wg.add(a,b);
  // ribs of flame along the wing
  for(let i=0;i<5;i++){const r=new THREE.Mesh(kcy(S*.012,S*.03,S*(1.25-i*.17),5),fxH_addMat('#ffd080',.5));r.rotation.x=Math.PI/2;r.rotation.z=(i-2)*.16;r.position.set((i-2)*S*.09,0,S*(1.25-i*.17)/2);wg.add(r)}
  if(z<0)wg.scale.z=-1;g.add(wg);wings.push({wg,z})}
 const halo=glowSprite(col,S*(o.star?5:3.2),o.star?.75:.55);g.add(halo);if(o.star)g.add(glowSprite('#fff0c8',S*1.8,.9));
 for(const z of[-1,1]){const fe=emitter({n:o.star?120:70,life:1.4,speed:S*.25,spread:.6,size:S*(o.star?.22:.16),dir:[-1,.3,0],col:'#ffd070',col2:'#ff3010',op:.75,area:[S*.5,S*.05,S*1.2]});fe.position.set(0,0,z*S*.75);g.add(fe)}
 g.userData.anim=t=>{for(const k of wings)k.wg.rotation.x=k.z*(Math.sin(t*1.6)*.28-.05);halo.material.opacity=(o.star?.7:.5)+Math.sin(t*3.1)*.08};return g}
function fxH_phoenixShape(g,x){const {S,kp}=x;const star=!!kp.starry;const col=star?'#ffb040':(kp.c||'#ff7a2a');const p=fxH_phoenix(S*(star?1:1.1),col,{star});g.add(p);
 if(star){g.add(new THREE.PointLight(C('#ffc070'),1.2,S*30));g.add(swarmPts(160,S*2.2,'#ffe8b0',S*.06,x.seed))}
 // the factory's hero carries an e-book on one wing, showing a small hero in light
 if(x.w.id==='ng_phoenixhero'){const bk=new THREE.Group();const cv=new THREE.Mesh(kb(S*.32,S*.03,S*.24),mt('#2a2a30',{roughness:.5}));bk.add(cv);const scr=new THREE.Mesh(kb(S*.28,S*.005,S*.2),new THREE.MeshBasicMaterial({color:'#bfe8ff'}));scr.position.y=S*.018;bk.add(scr);
  const holo=fxH_faceless(S*.34,mt('#9fe8ff',{emissive:'#5ad0ff',emissiveIntensity:.9,transparent:true,opacity:.7,depthWrite:false}));holo.position.y=S*.03;bk.add(holo);bk.add(at(glowSprite('#9fe8ff',S*.6,.5),0,S*.2,0));
  bk.position.set(S*.05,S*.08,S*.75);g.add(bk)}
 return t=>{p.userData.anim(t);g.position.y=Math.sin(t*.6)*S*.15}}
fxH_SH.v_guanxing=fxH_phoenixShape;fxH_SH.ng_phoenixhero=fxH_phoenixShape;

/* ---------- the void bus: a ball of ice tens of kilometres across, a crack across it for a mouth, three jointed limbs on each side of the crack ---------- */
function fxH_iceBus(g,x,station){const {S,Rn,seed}=x;
 const body=new THREE.Mesh(fxH_lumpGeo(S,3,.12,seed),detailMat(mt('#eef6fa',{roughness:.35,metalness:.05,flatShading:true,emissive:'#9ac8e0',emissiveIntensity:.08}),{bump:.5,freq:.6}));g.add(body);
 g.add(new THREE.Mesh(new THREE.SphereGeometry(S*1.06,32,24),rimMat('#9ac8e0',3,.55)));
 // the crack: a dark canyon running round the front of the ball
 const path=[];for(let i=0;i<=24;i++){const u=-1+i/12,a=u*1.05;path.push(V3(Math.cos(a)*S*.93,Math.sin(u*2.4)*S*.06-S*.05,Math.sin(a)*S*.93))}
 const crack=new THREE.Mesh(ktube(path,S*.07,60,8),mt('#0a1622',{roughness:.9}));crack.scale.set(1,.55,1);g.add(crack);
 const lip=new THREE.Mesh(ktube(path.map(p=>p.clone().multiplyScalar(1.025)),S*.025,60,6),new THREE.MeshBasicMaterial({color:'#3a6a8a'}));lip.scale.set(1,.55,1);g.add(lip);
 // jointed, barbed limbs, three above the crack and three below
 const LM=mt('#cfe2ec',{roughness:.4,flatShading:true}),BM=mt('#e8f2f6',{roughness:.3});const limbs=[];
 for(let i=0;i<6;i++){const up=i<3?1:-1,k=i%3;const cu=new THREE.CatmullRomCurve3(path);const P=cu.getPointAt(.3+k*.2);const N=P.clone().normalize();
  const L=new THREE.Group();L.position.copy(P).addScaledVector(fxH_UP,up*S*.05);L.quaternion.setFromUnitVectors(fxH_UP,N);
  const a=cyl(S*.035,S*.028,S*.3,LM,6);a.position.y=S*.15;const j=new THREE.Group();j.position.y=S*.3;const jb=sph(0,S*.045,S*.045,S*.045,8,LM);j.add(jb);
  const b=cyl(S*.026,S*.012,S*.28,LM,6);b.position.y=S*.14;j.add(b);for(let q=0;q<3;q++){const br=cone(S*.018,S*.08,BM,4);br.position.set(0,S*(.06+q*.08),S*.02);br.rotation.x=.9;j.add(br)}
  j.rotation.z=up*.9;L.add(a,j);const seg=new THREE.Group();seg.add(L);seg.rotation.x=up*.35;g.add(seg);limbs.push({j,L,ph:i*1.1,up})}
 g.add(swarmPts(80,S*1.5,'#e8f8ff',S*.04,seed));
 if(station){const st=new THREE.Mesh(kb(S*1.1,S*.35,S*.6),mt('#8a9098',{metalness:.6,roughness:.35}));st.position.y=S*.98;g.add(st);const tw=new THREE.Mesh(kcy(S*.08,S*.12,S*.5,8),mt('#6a7078',{metalness:.6}));tw.position.set(S*.3,S*1.3,0);g.add(tw);g.add(at(glowSprite('#ffd27a',S*.6,.8),0,S*1.25,0))}
 return t=>{g.rotation.y=Math.sin(t*.05)*.3;for(const l of limbs)l.j.rotation.z=l.up*(.9+Math.sin(t*.7+l.ph)*.25)}}
fxH_SH.v_xukongbus=(g,x)=>fxH_iceBus(g,x,false);
fxH_SH.v_buhuo=(g,x)=>fxH_iceBus(g,x,true);

/* ---------- 星界之门: a half arch built of organs, standing on its two feet ---------- */
fxH_SH.v_gate=(g,x)=>{const {S,Rn}=x;const fl=detailMat(mt('#b85a5a',{roughness:.5,metalness:0,emissive:'#5a1418',emissiveIntensity:.3}),{bump:.7,freq:2/Math.max(1,S/20)});
 const arch=new THREE.Mesh(new THREE.TorusGeometry(S,S*.16,14,48,Math.PI),fl);g.add(arch);
 for(const s of[-1,1]){const ft=sph(0,S*.3,S*.18,S*.3,14,fl);ft.position.set(s*S,-S*.05,0);g.add(ft)}
 const OC=['#9a3a3a','#c87070','#7a2a3a','#d8908a','#a8505a'];const org=[];
 for(let i=0;i<18;i++){const a=(i+.5)/18*Math.PI,r=S*(1+(Rn()-.5)*.12);const m=new THREE.Mesh(fxH_lumpGeo(S*(.1+Rn()*.09),1,.2,i+3),mt(OC[i%5],{roughness:.45,emissive:'#4a0a10',emissiveIntensity:.25}));m.position.set(Math.cos(a)*r,Math.sin(a)*r,(Rn()-.5)*S*.22);m.scale.set(1,1.3,1);g.add(m);org.push({m,ph:Rn()*6})}
 const vm=mt('#5a1a2a',{roughness:.4});for(let k=0;k<4;k++){const pts=[];for(let i=0;i<=14;i++){const a=i/14*Math.PI,r=S*(.86+k*.09);pts.push(V3(Math.cos(a)*r,Math.sin(a)*r,(k%2?1:-1)*S*.14+Math.sin(i*1.3+k)*S*.03))}g.add(new THREE.Mesh(ktube(pts,S*.018,40,5),vm))}
 const d=new THREE.Mesh(new THREE.CircleGeometry(S*.84,48,0,Math.PI),new THREE.MeshBasicMaterial({map:swirlTex,color:x.kp.glow||'#8ab8ff',transparent:true,opacity:.4,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));g.add(d);
 return t=>{for(const o of org){const k=1+Math.sin(t*1.4+o.ph)*.06;o.m.scale.set(k,1.3*k,k)}d.material.opacity=.3+Math.sin(t*.9)*.1}};

/* ---------- 穿星者: itself a gun barrel over a hundred metres long, with a ring of eyes round the muzzle ---------- */
fxH_SH.v_chuanxing=(g,x)=>{const {S,c}=x;const L=S*3.8,r=S*.42;const hull=mt(c,{metalness:.7,roughness:.25});
 const bar=new THREE.Group();g.add(bar);
 const out=new THREE.Mesh(new THREE.CylinderGeometry(r,r*1.15,L,32,6,true),detailMat(hull,{bump:.35,freq:.6}));bar.add(out);
 const inn=new THREE.Mesh(new THREE.CylinderGeometry(r*.72,r*.72,L*.98,32,1,true),mt('#140c0a',{side:THREE.BackSide,emissive:'#ff7a3a',emissiveIntensity:.25}));bar.add(inn);
 const lip=new THREE.Mesh(new THREE.TorusGeometry(r*.86,r*.15,10,40),hull);lip.rotation.x=Math.PI/2;lip.position.y=L/2;bar.add(lip);
 const breech=new THREE.Mesh(new THREE.SphereGeometry(r*1.15,24,12,0,Math.PI*2,Math.PI/2,Math.PI/2),hull);breech.position.y=-L/2;bar.add(breech);
 for(let i=0;i<4;i++){const band=new THREE.Mesh(new THREE.TorusGeometry(r*(1.02+i*.03),r*.05,6,40),mt('#2a3430',{metalness:.6,roughness:.4}));band.rotation.x=Math.PI/2;band.position.y=-L*.35+i*L*.2;bar.add(band)}
 const bore=new THREE.Mesh(new THREE.CircleGeometry(r*.7,32),new THREE.MeshBasicMaterial({color:'#ffb070'}));bore.rotation.x=-Math.PI/2;bore.position.y=L*.1;bar.add(bore);
 const bg=glowSprite('#ffb070',r*3,.5);bg.position.y=L/2;bar.add(bg);
 const ew=mt('#f2eee2',{roughness:.2}),ep=new THREE.MeshBasicMaterial({color:'#1a0c06'}),eyes=[];
 for(let i=0;i<12;i++){const a=i/12*6.283;const e=new THREE.Group();e.position.set(Math.cos(a)*r*1.12,L/2-r*.35,Math.sin(a)*r*1.12);const b=sph(0,r*.15,r*.15,r*.15,10,ew);e.add(b);const p=sph(0,r*.075,r*.075,r*.05,8,ep);p.position.set(Math.cos(a)*r*.12,r*.04,Math.sin(a)*r*.12);e.add(p);bar.add(e);eyes.push(e)}
 bar.rotation.z=-Math.PI/2;
 return t=>{bar.rotation.y=Math.sin(t*.2)*.05;bg.material.opacity=.4+.2*Math.sin(t*2.3);const bl=(t%7)<.18;for(const e of eyes)e.scale.y=bl?.15:1}};

/* ---------- 文明平台: a metal ball that gathers the debris around it, growing as it goes ---------- */
fxH_SH.v_civplat=(g,x)=>{const {S,Rn,seed}=x;const R=S*.62;
 const ball=new THREE.Mesh(fxH_lumpGeo(R,3,.05,seed),detailMat(mt('#8a9098',{metalness:.7,roughness:.35}),{bump:.4,freq:1}));g.add(ball);
 const N=150,WC=['#6a6a70','#8a8478','#4a4a50','#a09888','#5a5048','#7a7a82'];
 g.add(fxH_inst(lumpRock(1,11),mt('#ffffff',{roughness:.7,metalness:.4,flatShading:true}),N,(o,i)=>{const v=V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize();const near=i<90;o.position.copy(v).multiplyScalar(R*(near?.96+Rn()*.12:1.15+Rn()*.6));o.rotation.set(Rn()*3,Rn()*3,Rn()*3);const s=S*(near?.06+Rn()*.1:.03+Rn()*.06);o.scale.set(s*(.6+Rn()),s*(.5+Rn()*.6),s*(.6+Rn()))},WC));
 // a few branching growths on the crust, coral-like
 const cm=mt('#9a948a',{metalness:.5,roughness:.5});for(let i=0;i<14;i++){const v=V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize();const b=new THREE.Group();b.position.copy(v).multiplyScalar(R*.98);b.quaternion.setFromUnitVectors(fxH_UP,v);const h=S*(.12+Rn()*.14);const s=cyl(S*.012,S*.03,h,cm,5);s.position.y=h/2;b.add(s);for(const q of[-1,1]){const t=cyl(S*.008,S*.015,h*.5,cm,4);t.position.set(q*h*.12,h*.75,0);t.rotation.z=-q*.6;b.add(t)}g.add(b)}
 g.add(swarmPts(60,S*1.6,'#c8d0d8',S*.03,seed,false));return t=>{g.rotation.y=t*.02}};

/* ---------- 圆环之城: very long, like a giant worm made of many rings (but no worm) ---------- */
fxH_SH.v_yuanhuan=(g,x)=>{const {S,c}=x;const N=22,L=S*8;const rm=mt(c,{metalness:.5,roughness:.35});const R=[];
 const P=u=>V3((u-.5)*L,Math.sin(u*7)*S*.5,Math.sin(u*4.5+1)*S*.9);
 for(let i=0;i<N;i++){const u=i/(N-1);const tp=Math.sin(Math.PI*(.08+u*.84));const m=new THREE.Mesh(new THREE.TorusGeometry(S*.42*(.35+tp*.65),S*.07*(.5+tp*.5),8,28),rm);g.add(m);R.push({m,u})}
 const lp=[];for(let i=0;i<60;i++)lp.push(P(i/59));g.add(sparkles(lp,'#ffe0a8',S*.08,1,.6));
 const place=t=>{for(const k of R){const u=k.u,ph=t*.6;const p=P(u);p.y+=Math.sin(u*12-ph)*S*.12;const q=P(Math.min(1,u+.01)).sub(P(Math.max(0,u-.01))).normalize();k.m.position.copy(p);k.m.quaternion.setFromUnitVectors(V3(0,0,1),q)}};place(0);
 return t=>place(t)};

/* ---------- 蒸腾者: from outside a heap of rusted metal, the size of a grown void bus; small fliers keep merging into it ---------- */
fxH_SH.v_zhengteng=(g,x)=>{const {S,Rn,seed}=x;const geo=fxH_lumpGeo(S,3,.22,seed,V3(1.2,.8,1));const p=geo.attributes.position,cc=[],a=C('#7a4a2a'),b=C('#a8683a'),d=C('#4a2a18'),t3=new THREE.Color();
 for(let i=0;i<p.count;i++){const n=n3(p.getX(i)/S*4,p.getY(i)/S*4,p.getZ(i)/S*4);t3.copy(a).lerp(n>.55?b:d,Math.abs(n-.5)*1.6);cc.push(t3.r,t3.g,t3.b)}geo.setAttribute('color',new THREE.Float32BufferAttribute(cc,3));
 g.add(new THREE.Mesh(geo,detailMat(VC({roughness:.95,metalness:.25,flatShading:true}),{bump:.9,freq:1})));
 g.add(fxH_inst(lumpRock(1,5),mt('#ffffff',{roughness:.9,metalness:.3,flatShading:true}),70,(o,i)=>{const v=V3(Rn()-.5,(Rn()-.5)*.6,Rn()-.5).normalize();o.position.copy(v).multiplyScalar(S*(.92+Rn()*.12));o.rotation.set(Rn()*3,Rn()*3,Rn()*3);o.scale.setScalar(S*(.06+Rn()*.12))},['#8a5030','#6a3a1e','#b0703e']));
 // small rusty fliers drifting in to join the heap
 const N=40,F=[];const fm=fxH_inst(kd(1),mt('#9a5a30',{roughness:.9,flatShading:true}),N,()=>{});g.add(fm);for(let i=0;i<N;i++)F.push({v:V3(Rn()-.5,(Rn()-.5)*.7,Rn()-.5).normalize(),ph:Rn(),s:S*(.02+Rn()*.03)});
 const o=new THREE.Object3D();const step=t=>{for(let i=0;i<N;i++){const f=F[i];const u=(f.ph+t*.03)%1;o.position.copy(f.v).multiplyScalar(S*(2.6-u*1.6));o.rotation.set(t*.5+i,i,0);o.scale.setScalar(f.s*(u>.95?(1-u)*20:1));o.updateMatrix();fm.setMatrixAt(i,o.matrix)}fm.instanceMatrix.needsUpdate=true};step(0);
 return t=>{step(t);g.rotation.y=t*.01}};

/* ---------- 宙螺: shaped like the arrow-stone, a pointed cone with many tentacles at the thick end, six hundred metres long ---------- */
fxH_SH.v_zhouluo=(g,x)=>{const b=(SPEC.jianshi||fxA_jianshi)({col:x.c});b.scale.setScalar(x.S*.95);b.position.y=-x.S*.55;g.add(b);
 return t=>{b.userData.anim&&b.userData.anim(t*.5);g.rotation.y=Math.sin(t*.1)*.3;g.position.y=Math.sin(t*.4)*x.S*.1}};

/* ---------- 海参 · 秩序之域: a pitch-black sea cucumber hundreds of kilometres long, covered in short thick spikes ---------- */
fxH_SH.v_haishen=(g,x)=>{const {S,Rn}=x;const L=S*4.6,R=S*.75;const prof=[];for(let i=0;i<=24;i++){const t=i/24;prof.push(new THREE.Vector2(Math.max(.01,R*Math.pow(Math.sin(Math.PI*t),.55)*(1+.08*Math.sin(t*19))),(t-.5)*L))}
 const geo=new THREE.LatheGeometry(prof,28);geo.rotateZ(-Math.PI/2);geo.scale(1,.85,1);const skin=detailMat(mt('#18181a',{roughness:.55,metalness:.1}),{bump:.8,freq:.4});const body=new THREE.Mesh(geo,skin);g.add(body);
 g.add(fxH_inst(kc(1,1,6),mt('#26262a',{roughness:.6}),260,(o,i)=>{const t=.04+Rn()*.92,a=Rn()*6.283;const rr=R*Math.pow(Math.sin(Math.PI*t),.55);const n=V3(0,Math.cos(a)*.85,Math.sin(a));o.position.set((t-.5)*L,Math.cos(a)*rr*.85,Math.sin(a)*rr);o.quaternion.setFromUnitVectors(fxH_UP,n.normalize());const s=S*(.07+Rn()*.05);o.scale.set(s,s*(1.4+Rn()),s);o.translateY(s*.5)}));
 for(const s of[-1,1]){const m=new THREE.Mesh(new THREE.CircleGeometry(R*.18,16),new THREE.MeshBasicMaterial({color:'#000000'}));m.position.x=s*L*.5;m.rotation.y=s*Math.PI/2;g.add(m)}
 return t=>{g.rotation.x=Math.sin(t*.15)*.06;g.rotation.y=Math.sin(t*.08)*.1}};

/* ---------- 集粒 · 长方堡: a rectangular block a thousand kilometres long, covered in dull city-like protrusions ---------- */
fxH_SH.v_jili=(g,x)=>{const {S,Rn}=x;const A=S*2.4,B=A*.5,Hh=A*.3;const dm=detailMat(mt('#3a3a40',{roughness:.85,metalness:.25}),{bump:.4,freq:.5});
 g.add(new THREE.Mesh(kb(A,Hh,B),dm));
 g.add(fxH_inst(kb(1,1,1),mt('#ffffff',{roughness:.85,metalness:.2}),420,(o,i)=>{const top=i<330;const h=S*(.02+Rn()*Rn()*.16),w=S*(.03+Rn()*.07);if(top){o.position.set((Rn()-.5)*A*.97,Hh/2+h/2,(Rn()-.5)*B*.96);o.scale.set(w,h,w*(.6+Rn()*.8))}else{const s=Rn()<.5?1:-1;o.position.set((Rn()-.5)*A*.97,(Rn()-.5)*Hh*.9,s*(B/2+h/2));o.scale.set(w,w*(.6+Rn()),h)}},['#45454c','#34343a','#50505a','#2c2c32']));
 return t=>{g.position.y=Math.sin(t*.12)*S*.05}};

/* ---------- 焰锯: single round saws about a metre across, toothed rims, not solid, glowing red like a flickering hologram ---------- */
function fxH_sawGeo(teeth,inner){return new THREE.ShapeGeometry(fxH_sawShape(teeth,inner),1)}
function fxH_sawShape(teeth,inner){const s=new THREE.Shape();for(let i=0;i<teeth*2;i++){const a=i/(teeth*2)*Math.PI*2,r=i%2?.82:1;const X=Math.cos(a)*r,Y=Math.sin(a)*r;i?s.lineTo(X,Y):s.moveTo(X,Y)}s.closePath();const h=new THREE.Path();h.absarc(0,0,inner,0,Math.PI*2,true);if(inner>0)s.holes.push(h);return s}
fxH_SH.v_yanju=(g,x)=>{const {S,Rn,kp}=x;const N=kp.n||60;const m=fxH_addMat('#ff4a2a',.75);const im=new THREE.InstancedMesh(fxH_sawGeo(14,.7),m,N);im.frustumCulled=false;g.add(im);
 const P=[];for(let i=0;i<N;i++)P.push({p:V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize().multiplyScalar(S*Math.cbrt(Rn())),r:V3(Rn()*3,Rn()*3,Rn()*3),s:S*(.05+Rn()*.04),ph:Rn()*6});
 g.add(glowSprite('#ff4a2a',S*2.2,.18));const o=new THREE.Object3D();
 const step=t=>{for(let i=0;i<N;i++){const q=P[i];o.position.copy(q.p).add(V3(Math.sin(t*.4+q.ph)*S*.08,Math.cos(t*.3+q.ph)*S*.06,0));o.rotation.set(q.r.x,q.r.y,q.r.z+t*3);o.scale.setScalar(q.s);o.updateMatrix();im.setMatrixAt(i,o.matrix)}im.instanceMatrix.needsUpdate=true;m.opacity=.45+.25*Math.sin(t*23)*Math.sin(t*7.3)};step(0);return step};

/* ---------- 旋风生物: a whirlwind; debris turning round a small central ball, darkening ---------- */
fxH_SH.v_xuanfeng=(g,x)=>{const {S,Rn}=x;const core=new THREE.Mesh(new THREE.SphereGeometry(S*.14,16,12),mt('#2a2420',{roughness:.6}));g.add(core);
 const layers=[];const WC=['#2a2620','#3a3630','#4a4640','#1a1816','#5a5650'];
 for(let k=0;k<3;k++){const n=110;const im=fxH_inst(lumpRock(1,k+3),mt('#ffffff',{roughness:.9,flatShading:true}),n,(o,i)=>{const h=Rn(),a=Rn()*6.283,rr=S*(.15+h*h*1.1+k*.08)*(.85+Rn()*.3);o.position.set(Math.cos(a)*rr,(h-.45)*S*2.6,Math.sin(a)*rr);o.rotation.set(Rn()*3,Rn()*3,Rn()*3);o.scale.setScalar(S*(.015+Rn()*.035))},WC);g.add(im);layers.push({im,sp:.9-k*.25})}
 g.add(emitter({n:90,life:4,speed:S*.15,spread:.6,size:S*.4,dir:[0,1,0],col:'#3a342c',op:.35,add:false,tex:smokeTex,area:[S*.8,S*2,S*.8]}));
 return t=>{for(const l of layers)l.im.rotation.y=t*l.sp}};

/* ---------- 修理者: a heap of black and white square plates, each tens of metres, kilometres across in all ---------- */
fxH_SH.v_xiuli=(g,x)=>{const {S,Rn}=x;const N=190;
 g.add(fxH_inst(kb(1,.06,1),mt('#ffffff',{roughness:.6,metalness:.1}),N,(o,i)=>{const v=V3(Rn()-.5,(Rn()-.5)*.7,Rn()-.5);const d=Math.cbrt(Rn());v.normalize().multiplyScalar(S*d);o.position.copy(v);o.rotation.set((Rn()-.5)*1.4,Rn()*3,(Rn()-.5)*1.4);o.scale.setScalar(S*(.12+Rn()*.1))},['#141414','#e8e8e8']));
 // one or two white plates fired off and coming back
 const sh=[];for(let i=0;i<3;i++){const m=new THREE.Mesh(kb(S*.18,S*.012,S*.18),mt('#f2f2f2',{roughness:.5}));g.add(m);sh.push({m,a:i*2.1})}
 return t=>{for(const k of sh){const u=(t*.15+k.a/6.28)%1,r=S*(.6+Math.sin(u*Math.PI)*1.8);k.m.position.set(Math.cos(k.a)*r,Math.sin(u*6.28)*S*.3,Math.sin(k.a)*r);k.m.rotation.set(t,t*.7,0)}}};

/* ---------- 荆棘世界: no world at all, a thorn bush grown in the void, tangled into a ball ---------- */
fxH_SH.v_jingji=(g,x)=>{const {S,Rn}=x;const vm=detailMat(mt('#3a3020',{roughness:.85}),{bump:.6,freq:2/Math.max(1,S/20)}),tm=mt('#4a4228',{roughness:.7});const thorns=[];
 for(let k=0;k<34;k++){let v=V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize();const ax=V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize();const pts=[];let r=S*(.25+Rn()*.75);for(let i=0;i<10;i++){v.applyAxisAngle(ax,.32).normalize();r=Math.min(S*1.05,Math.max(S*.15,r+(Rn()-.5)*S*.18));pts.push(v.clone().multiplyScalar(r))}
  g.add(new THREE.Mesh(ktube(pts,S*(.012+Rn()*.016),30,5),k%3?vm:mt('#2a3a22',{roughness:.85})));const cu=new THREE.CatmullRomCurve3(pts);for(let j=0;j<12;j++){const u=Rn();thorns.push([cu.getPointAt(u),cu.getTangentAt(u)])}}
 g.add(fxH_inst(kc(1,1,4),tm,thorns.length,(o,i)=>{const [p,tn]=thorns[i];const side=V3(Rn()-.5,Rn()-.5,Rn()-.5).cross(tn).normalize();o.position.copy(p);o.quaternion.setFromUnitVectors(fxH_UP,side);const s=S*(.012+Rn()*.01);o.scale.set(s,s*(5+Rn()*6),s);o.translateY(s*3)}));
 return t=>{g.rotation.y=t*.01}};

/* ---------- 苦钉民: nail-shaped warships, really pins with a ball for a head ---------- */
fxH_SH.v_kuding=(g,x)=>{const {S,Rn,kp}=x;const n=Math.max(1,Math.min(kp.n||1,12));const mm=mt(x.c,{metalness:.65,roughness:.3});
 for(let i=0;i<n;i++){const p=new THREE.Group();const sh=new THREE.Mesh(kcy(S*.06,S*.05,S*2.8,10),mm);sh.rotation.z=Math.PI/2;p.add(sh);const tip=new THREE.Mesh(kc(S*.05,S*.6,10),mm);tip.rotation.z=-Math.PI/2;tip.position.x=S*1.7;p.add(tip);
  const hd=new THREE.Mesh(new THREE.SphereGeometry(S*.32,20,14),mm);hd.position.x=-S*1.5;p.add(hd);p.add(at(glowSprite(kp.glow||'#cfe8ff',S*.9,.55),-S*1.85,0,0));
  if(n>1){p.position.set((Rn()-.5)*S*7,(Rn()-.5)*S*2.5,(Rn()-.5)*S*7);p.rotation.y=(Rn()-.5)*.4}g.add(p)}
 return t=>{g.position.y=Math.sin(t*.5+x.seed)*S*.2}};

/* ---------- 尖刺舰队: every ship has many spikes or is a spike: spikes, saws, urchins, claws ---------- */
fxH_SH.v_jianci=(g,x)=>{const {S,Rn,kp}=x;const n=kp.n||9;const mm=mt(x.c,{metalness:.55,roughness:.35}),dk=mt('#7a6a48',{metalness:.5,roughness:.4});
 for(let i=0;i<n;i++){const s=new THREE.Group();const kind=i%4;
  if(kind===0){const sp=new THREE.Mesh(kc(S*.3,S*3,8),mm);sp.rotation.z=-Math.PI/2;s.add(sp);for(let k=0;k<6;k++){const b=new THREE.Mesh(kc(S*.06,S*.5,5),dk);const a=k/6*6.28;b.position.set(-S*.9,Math.cos(a)*S*.2,Math.sin(a)*S*.2);b.quaternion.setFromUnitVectors(fxH_UP,V3(-.4,Math.cos(a),Math.sin(a)).normalize());s.add(b)}}
  else if(kind===1){s.add(new THREE.Mesh(new THREE.SphereGeometry(S*.45,16,12),mm));s.add(fxH_inst(kc(1,1,5),dk,40,(o,k)=>{const v=V3(h3(i,k,1)-.5,h3(i,k,2)-.5,h3(i,k,3)-.5).normalize();o.position.copy(v).multiplyScalar(S*.42);o.quaternion.setFromUnitVectors(fxH_UP,v);o.scale.set(S*.06,S*(.6+h3(i,k,4)*.5),S*.06);o.translateY(.5)}))}
  else if(kind===2){const d=new THREE.Mesh(new THREE.ExtrudeGeometry(fxH_sawShape(16,0),{depth:.12,bevelEnabled:false}),mm);d.scale.setScalar(S*.9);s.add(d);const hub=new THREE.Mesh(kcy(S*.2,S*.2,S*.3,12),dk);hub.rotation.x=Math.PI/2;s.add(hub);s.userData.spin=1}
  else{const b=new THREE.Mesh(sharkGeo(S*2,S*.3,.7),mm);s.add(b);for(const z of[-1,1]){const pts=[];for(let k=0;k<=8;k++){const a=k/8;pts.push(V3(S*(.6+a*1.1),Math.sin(a*2.6)*S*.5,z*S*(.25+a*.3)))}s.add(new THREE.Mesh(ktube(pts,S*.06,16,5),dk))}}
  s.position.set((Rn()-.5)*S*9,(Rn()-.5)*S*3,(Rn()-.5)*S*9);s.rotation.y=Rn()*.6-.3;g.add(s)}
 return t=>{g.position.y=Math.sin(t*.5+x.seed)*S*.2;g.children.forEach((c,i)=>{if(c.userData.spin)c.rotation.z=t*1.5;else c.rotation.x=Math.sin(t*.7+i)*.05})}};

/* ---------- 愈石: crystal-like, shining cones over ten metres tall in the cracks of deep blue rock ---------- */
fxH_SH.v_yushi=(g,x)=>{const {Rn,kp}=x;const r=kp.r||110,s=kp.s||12,n=kp.n||60;
 g.add(fxH_inst(kd(1),detailMat(mt('#24304a',{roughness:.9,flatShading:true}),{bump:.5,freq:3}),n,(o,i)=>{const a=Rn()*6.28,d=r*Math.sqrt(Rn());o.position.set(Math.cos(a)*d,(Rn()-.5)*r*.3,Math.sin(a)*d);o.scale.set(s*(.6+Rn()*1.4),s*(.4+Rn()*.8),s*(.6+Rn()*1.4));o.rotation.set(Rn()*3,Rn()*3,Rn()*3)},['#24304a','#1a2440','#2e3a58']));
 const cr=[];for(let i=0;i<n*3;i++){const a=Rn()*6.28,d=r*Math.sqrt(Rn());cr.push(V3(Math.cos(a)*d,(Rn()-.5)*r*.3,Math.sin(a)*d))}
 g.add(fxH_inst(kc(1,1,6),mt('#d8f4e8',{roughness:.05,metalness:.2,transparent:true,opacity:.85,emissive:'#8affc0',emissiveIntensity:.35,flatShading:true}),cr.length,(o,i)=>{o.position.copy(cr[i]);o.rotation.set((Rn()-.5)*.8,Rn()*3,(Rn()-.5)*.8);const k=s*(.12+Rn()*.18);o.scale.set(k,k*(3+Rn()*3),k);o.translateY(k*1.5)}));
 g.add(swarmPts(80,r*.8,kp.glow||'#8affc0',s*.6,x.seed));return t=>{g.rotation.y=t*.01}};

/* ---------- 地镜: a colony of tiny pyramids, crystal-like and mirror-bright ---------- */
fxH_SH.v_dijing=(g,x)=>{const {S,Rn}=x;const pm=mt('#e8f4ff',{metalness:.92,roughness:.05,emissive:'#8ab8d8',emissiveIntensity:.08,flatShading:true});
 g.add(fxH_inst(new THREE.ConeGeometry(1,1.3,4),pm,70,(o,i)=>{const a=Rn()*6.28,d=S*Math.sqrt(Rn());o.position.set(Math.cos(a)*d,0,Math.sin(a)*d);o.rotation.y=Rn()*1.6;const k=S*(.05+Rn()*.12);o.scale.setScalar(k);o.translateY(k*.65)}));
 const base=new THREE.Mesh(new THREE.CylinderGeometry(S*1.05,S*.8,S*.12,24),mt('#5a6068',{roughness:.9}));base.position.y=-S*.06;g.add(base);
 g.add(glowSprite('#ffffff',S*2.4,.18));g.add(swarmPts(40,S*1.1,'#ffffff',S*.05,x.seed));return t=>{g.rotation.y=t*.04}};

/* ---------- 洒菌鸥: white, bird-like, a metre across the wings, in a flock ---------- */
fxH_SH.v_sajun=(g,x)=>{const {Rn,kp}=x;const n=Math.min(kp.n||40,60),s=4,orb=(kp.s||20);const geo=G([[new THREE.SphereGeometry(1,8,6),'#f4f4f0',{s:[.6,.3,.3]}],[wingGeo(1.4,.6),'#ffffff',{p:[0,0,.1]}],[wingGeo(1.4,.6),'#ffffff',{p:[0,0,-.1],s:[1,1,-1]}]]);
 const im=new THREE.InstancedMesh(geo,VC({side:THREE.DoubleSide,roughness:.8}),n);im.frustumCulled=false;g.add(im);const P=[];for(let i=0;i<n;i++)P.push({r:orb*(.4+Rn()*.8),y:(Rn()-.5)*orb*.6,ph:Rn()*6.28,sp:.2+Rn()*.2});
 const o=new THREE.Object3D();const step=t=>{for(let i=0;i<n;i++){const q=P[i],a=q.ph+t*q.sp;o.position.set(Math.cos(a)*q.r,q.y+Math.sin(t+i)*2,Math.sin(a)*q.r);o.rotation.set(0,-a-Math.PI/2,0);o.scale.set(s,s*(Math.abs(Math.sin(t*5+i))*.6+.5),s);o.updateMatrix();im.setMatrixAt(i,o.matrix)}im.instanceMatrix.needsUpdate=true};step(0);
 g.add(swarmPts(60,orb,'#f0f0e8',1.2,x.seed));return step};

/* ================= the frozen void (ningu) ================= */
/* ---------- 死亡战舰: a sword-shaped hull kilometres long, its whole skin packed with wreckage, bones and ruins; one of them skull-shaped ---------- */
function fxH_wreckSkin(par,Rn,N,place,s){const WC=['#3a332c','#4a4038','#2a2624','#6a5a48','#bdb29a','#57504a'];par.add(fxH_inst(lumpRock(1,17),mt('#ffffff',{roughness:.95,flatShading:true}),N,(o,i)=>{place(o,i);o.rotation.set(Rn()*3,Rn()*3,Rn()*3);const k=s*(.5+Rn()*1.2);o.scale.set(k*(.7+Rn()*.9),k*(.5+Rn()*.6),k*(.7+Rn()*.6))},WC))}
fxH_SH.ng_death=(g,x)=>{const {S,Rn}=x;const hm=mt('#2a2624',{roughness:.9}),bm=mt('#cfc5ae',{roughness:.8});
 for(let i=0;i<4;i++){const s=new THREE.Group();const L=S*(4-i*.6),W=L*.3,T=L*.08;
  // a blade: a long flat diamond tapering to a point
  const sh=new THREE.Shape();sh.moveTo(L*.5,0);sh.lineTo(L*.2,W*.5);sh.lineTo(-L*.45,W*.42);sh.lineTo(-L*.5,0);sh.lineTo(-L*.45,-W*.42);sh.lineTo(L*.2,-W*.5);sh.closePath();
  const bg=new THREE.ExtrudeGeometry(sh,{depth:T,bevelEnabled:true,bevelThickness:T*.4,bevelSize:W*.08,bevelSegments:1});bg.translate(0,0,-T/2);bg.rotateX(Math.PI/2);s.add(new THREE.Mesh(bg,hm));
  fxH_wreckSkin(s,Rn,120,(o)=>{const u=Rn()*2-1,v=Rn()*2-1;const xx=u*L*.47,hw=W*.45*(xx>L*.2?(L*.5-xx)/(L*.3):1);o.position.set(xx,(Rn()<.5?1:-1)*T*.6,v*hw)},S*.06);
  for(let k=0;k<10;k++){const b=new THREE.Mesh(new THREE.ConeGeometry(S*.03,S*(.3+Rn()*.4),5),bm);b.position.set((Rn()-.5)*L*.8,T*.6,(Rn()-.5)*W*.6);b.rotation.set((Rn()-.5)*.8,0,(Rn()-.5)*.8);s.add(b)}
  s.position.set((i-1.5)*S*.9,(Rn()-.5)*S*.8,(i%2?1:-1)*S*.7+(Rn()-.5)*S*.4);s.rotation.set((Rn()-.5)*.3,(Rn()-.5)*.8,(Rn()-.5)*.2);g.add(s)}
 // the skull-shaped one
 const sk=new THREE.Group();const bone=mt('#b8ad94',{roughness:.85});const hd=new THREE.Mesh(new THREE.SphereGeometry(S*.9,24,18),bone);hd.scale.set(1.15,.95,1);sk.add(hd);const jaw=new THREE.Mesh(kb(S*1.1,S*.35,S*.9),bone);jaw.position.set(S*.45,-S*.8,0);sk.add(jaw);
 for(const z of[-1,1]){const e=new THREE.Mesh(new THREE.SphereGeometry(S*.24,12,10),new THREE.MeshBasicMaterial({color:'#0a0606'}));e.position.set(S*.85,S*.08,z*S*.36);sk.add(e);sk.add(at(glowSprite('#ff3a2a',S*.5,.6),S*1,S*.08,z*S*.36))}
 fxH_wreckSkin(sk,Rn,90,(o)=>{const v=V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize();o.position.copy(v).multiply(V3(S*1.05,S*.9,S*.95))},S*.07);
 sk.position.set(S*1.6,S*1.1,-S*1.2);g.add(sk);return null};

/* ---------- 失落军团 · 真菌区域: floating ribs wrapped in mycelium, mycelium bridges with burning mushrooms, all tied to a mycelium-wrapped ball ---------- */
fxH_SH.ng_lost=(g,x)=>{const {S,Rn,seed}=x;const base=fxH_make0(x.w,x.sp,true);g.add(base);
 const rib=mt('#d8ccb8',{roughness:.8}),fuzz=mt('#c8b8a8',{roughness:1,transparent:true,opacity:.55,depthWrite:false});const ends=[];
 for(let i=0;i<9;i++){const q=new THREE.Group();q.position.set(0,0,(i-4)*S*.42);q.rotation.z=(Rn()-.5)*.3;const R=S*(2-Math.abs(i-4)*.12),arc=Math.PI*.95;
  const t=new THREE.Mesh(new THREE.TorusGeometry(R,S*.05,6,40,arc),rib);t.rotation.z=Math.PI*.5-arc/2+Math.PI;q.add(t);const f=new THREE.Mesh(new THREE.TorusGeometry(R,S*.085,6,40,arc),fuzz);f.rotation.z=t.rotation.z;q.add(f);
  for(const s of[0,1]){const a=t.rotation.z+s*arc;ends.push(q.position.clone().add(V3(Math.cos(a)*R,Math.sin(a)*R,0).applyAxisAngle(V3(0,0,1),q.rotation.z)))}
  const a2=t.rotation.z+arc*.5;ends.push(q.position.clone().add(V3(Math.cos(a2)*R,Math.sin(a2)*R,0).applyAxisAngle(V3(0,0,1),q.rotation.z)));g.add(q)}
 // bridges: ribs to ribs and ribs to the ball, each with a few burning mushrooms
 const bm=mt('#bfae98',{roughness:1}),cap=mt('#e8d8c0',{roughness:.8});const fl=[];
 for(let i=0;i<ends.length;i++){const a=ends[i],b=i%3===2?V3(0,0,0).add(a.clone().normalize().multiplyScalar(S*.95)):ends[(i+3)%ends.length];const mid=a.clone().lerp(b,.5).addScaledVector(fxH_UP,-S*.15);
  g.add(new THREE.Mesh(ktube([a,mid,b],S*.02,16,4),bm));for(let k=1;k<=2;k++){const p=new THREE.CatmullRomCurve3([a,mid,b]).getPointAt(k/3);const m=new THREE.Mesh(new THREE.SphereGeometry(S*.05,8,5,0,6.283,0,1.5),cap);m.position.copy(p).addScaledVector(fxH_UP,S*.03);g.add(m);fl.push(m.position.clone().addScaledVector(fxH_UP,S*.06))}}
 g.add(sparkles(fl,'#ffa040',S*.12,1,1));for(let i=0;i<fl.length;i+=4){const s=glowSprite('#ff8a3a',S*.4,.6);s.position.copy(fl[i]);g.add(s)}
 const bugs=[];for(let i=0;i<120;i++)bugs.push(V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize().multiplyScalar((x.kp.r||22)*1.01));g.add(sparkles(bugs,'#9fe8ff',S*.05,1,.6));
 return null};

/* ---------- 球神的世界: overpasses ten kilometres wide criss-cross its sky, carrying cities ---------- */
fxH_SH.ng_qiushen=(g,x)=>{const {Rn}=x;const r=x.kp.r||90;const base=fxH_make0(x.w,x.sp,true);g.add(base);
 const bm=mt('#b0a494',{roughness:.6,metalness:.3,side:THREE.DoubleSide,emissive:'#3a342c',emissiveIntensity:.3}),pm=mt('#5a524a',{roughness:.8});const lots=[];
 for(let i=0;i<9;i++){const R=r*(1.1+Rn()*.14),th=.9+Rn()*1.3,w=r*(.07+Rn()*.05);const band=new THREE.Group();band.quaternion.setFromUnitVectors(fxH_UP,V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize());band.rotateY(Rn()*6.28);
  band.add(new THREE.Mesh(new THREE.CylinderGeometry(R,R,w,64,1,true,0,th),bm));
  for(const a of[0,th]){const d=V3(Math.sin(a),0,Math.cos(a));const p=new THREE.Mesh(kcy(w*.25,w*.35,R-r*.98,6),pm);p.position.copy(d).multiplyScalar((R+r*.98)/2);p.quaternion.setFromUnitVectors(fxH_UP,d);band.add(p)}
  band.updateMatrix();for(let k=0;k<40;k++){const a=Rn()*th,d=V3(Math.sin(a),0,Math.cos(a));lots.push({m:band.matrix.clone(),d,R,y:(Rn()-.5)*w*.8,h:r*(.012+Rn()*.03)})}g.add(band)}
 g.add(fxH_inst(kb(1,1,1),mt('#ffffff',{roughness:.6,emissive:'#ffd890',emissiveIntensity:.45}),lots.length,(o,i)=>{const L=lots[i];o.position.copy(L.d).multiplyScalar(L.R+L.h/2);o.position.y=L.y;o.quaternion.setFromUnitVectors(fxH_UP,L.d);o.scale.set(r*.018,L.h,r*.018);o.updateMatrix();o.applyMatrix4(L.m)},['#c8b8a0','#a89880','#e8d8b8']));
 return null};

/* ---------- 松果: a pine-cone body; its skin is scales with canyon-deep gaps between them ---------- */
fxH_SH.ng_pinecone=(g,x)=>{const {Rn}=x;const r=x.kp.r||30;const H=r*2.6;const prof=[];for(let i=0;i<=20;i++){const t=i/20;prof.push(new THREE.Vector2(Math.max(.01,r*Math.sin(Math.PI*Math.pow(t,.8))*(1-t*.35)),(t-.45)*H))}
 g.add(new THREE.Mesh(new THREE.LatheGeometry(prof,24),mt('#1a120a',{roughness:1})));
 const cu=new THREE.SplineCurve(prof);const N=260;const GA=Math.PI*(3-Math.sqrt(5));
 const sc=new THREE.SphereGeometry(1,10,6,0,Math.PI*2,0,Math.PI/2);sc.scale(1,.25,1);
 g.add(fxH_inst(sc,mt('#ffffff',{roughness:.85,flatShading:true}),N,(o,i)=>{const t=.03+i/N*.92;const p=cu.getPoint(t),p2=cu.getPoint(Math.min(1,t+.01));const a=i*GA;const rad=V3(Math.cos(a),0,Math.sin(a));
  o.position.set(rad.x*p.x,p.y,rad.z*p.x);const dx=p2.x-p.x,dy=p2.y-p.y,L=Math.hypot(dx,dy)||1;const nrm=rad.clone().multiplyScalar(dy/L).addScaledVector(fxH_UP,-dx/L).normalize();
  nrm.addScaledVector(fxH_UP,-.35).normalize();o.quaternion.setFromUnitVectors(fxH_UP,nrm);const k=r*(.16+.12*Math.sin(Math.PI*t));o.scale.set(k*1.1,k,k*.85)},['#6a5038','#5a4430','#7a5c40','#3a2818']));
 return null};

/* ---------- 合造的世界: an earth with its sea cut into blocks that float in the air like slices of cake, over a dry seabed ---------- */
fxH_SH.ng_hezao=(g,x)=>{const {Rn}=x;const r=x.kp.r||30;g.add(fxH_make0(x.w,x.sp,true));
 const wm=new THREE.MeshStandardMaterial({color:'#3a8ab8',transparent:true,opacity:.6,roughness:.1,metalness:.1,emissive:'#1a4a6a',emissiveIntensity:.3,depthWrite:false});
 for(let i=0;i<16;i++){const d=V3(Rn()-.5,(Rn()-.5)*1.4,Rn()-.5).normalize();const R=r*(1.18+Rn()*.12);const sl=new THREE.Mesh(new THREE.CylinderGeometry(r*(.12+Rn()*.08),r*(.12+Rn()*.08),r*.06,3+(i%3),1),wm);sl.position.copy(d).multiplyScalar(R);sl.quaternion.setFromUnitVectors(fxH_UP,d);sl.rotateY(Rn()*3);g.add(sl)}
 return null};

/* ================= the unforeseeable land (buke) ================= */
/* ---------- 碎裂的大地: one floating land, six hundred kilometres, its cracked skin peeling off into fragments ---------- */
fxH_SH.bk_crying=(g,x)=>{const {S,Rn,seed}=x;const geo=fxH_lumpGeo(S*.8,3,.16,seed,V3(1.3,.6,1.1));g.add(new THREE.Mesh(geo,detailMat(mt('#8a8070',{roughness:.95,flatShading:true}),{bump:.9,freq:.8})));
 const cm=new THREE.MeshBasicMaterial({color:'#2a241e'});for(let k=0;k<12;k++){const pts=[];let v=V3(Rn()-.5,Rn()*.4+.1,Rn()-.5).normalize();for(let i=0;i<9;i++){v=v.clone().add(V3(Rn()-.5,(Rn()-.5)*.3,Rn()-.5).multiplyScalar(.18)).normalize();pts.push(v.clone().multiply(V3(S*1.06,S*.5,S*.9)))}g.add(new THREE.Mesh(ktube(pts,S*.008,24,4),cm))}
 const N=90,F=[];const fm=fxH_inst(lumpRock(1,9),mt('#8a8070',{roughness:.95,flatShading:true}),N,()=>{});g.add(fm);for(let i=0;i<N;i++)F.push({v:V3(Rn()-.5,(Rn()-.5)*.8,Rn()-.5).normalize(),ph:Rn(),s:S*(.015+Rn()*.03),sp:.02+Rn()*.03});
 const o=new THREE.Object3D();const step=t=>{for(let i=0;i<N;i++){const f=F[i],u=(f.ph+t*f.sp)%1;o.position.copy(f.v).multiply(V3(S*1.05,S*.55,S*.9)).multiplyScalar(1+u*1.4);o.rotation.set(t*.2+i,i*2,0);o.scale.setScalar(f.s*(u<.05?u*20:1));o.updateMatrix();fm.setMatrixAt(i,o.matrix)}fm.instanceMatrix.needsUpdate=true};step(0);return step};

/* ---------- 藤壶礁: a reef rock that is really a precise craft, crowded with barnacle-like residents ---------- */
fxH_SH.bk_tenghu=(g,x)=>{const {Rn,seed}=x;const r=x.kp.r||40;const geo=fxH_lumpGeo(r*.6,3,.2,seed,V3(1.4,.7,1));g.add(new THREE.Mesh(geo,detailMat(mt('#8a8a7a',{roughness:.9,flatShading:true}),{bump:.8,freq:1})));
 const p=geo.attributes.position;const sites=[];for(let i=0;i<800;i++){const k=(Rn()*p.count)|0;const v=V3(p.getX(k),p.getY(k),p.getZ(k));sites.push(v)}
 const shell=new THREE.CylinderGeometry(.45,1,1.1,8,1,true);shell.translate(0,.55,0);
 g.add(fxH_inst(shell,mt('#c8c0a8',{roughness:.7,side:THREE.DoubleSide}),sites.length,(o,i)=>{const v=sites[i];o.position.copy(v);o.quaternion.setFromUnitVectors(fxH_UP,v.clone().normalize());const s=r*(.014+Rn()*.02);o.scale.set(s,s*(.8+Rn()*.6),s)},['#c8c0a8','#b8b098','#d8d0b8']));
 g.add(fxH_inst(new THREE.SphereGeometry(1,8,6),mt('#c88a7a',{roughness:.5}),sites.length,(o,i)=>{const v=sites[i];o.position.copy(v).addScaledVector(v.clone().normalize(),r*.03);o.scale.setScalar(r*.007)}));
 return t=>{g.rotation.y=t*.02}};

/* ---------- 奇迹制裁: pure white, shaped like a flute a hundred kilometres long, many round holes in it; phoenixes fly round it ---------- */
fxH_SH.bk_qiji=(g,x)=>{const {S,Rn}=x;const L=S*9,r=S*.32;const fm=mt('#f6f6f2',{roughness:.35,emissive:'#fff8e8',emissiveIntensity:.12});
 const t=new THREE.Mesh(new THREE.CylinderGeometry(r,r,L,28,1,true),fm);t.rotation.z=Math.PI/2;g.add(t);for(const s of[-1,1]){const cp=new THREE.Mesh(new THREE.SphereGeometry(r,20,10),fm);cp.position.x=s*L/2;cp.scale.x=.4;g.add(cp)}
 g.add(fxH_inst(new THREE.CircleGeometry(1,14),new THREE.MeshBasicMaterial({color:'#1a1814'}),72,(o,i)=>{const row=i%3,k=(i/3)|0;const a=(row-1)*.7+Math.PI/2;const xx=-L*.45+k*L*.9/23;const d=V3(0,Math.sin(a),Math.cos(a));o.position.set(xx,d.y*r*1.005,d.z*r*1.005);o.quaternion.setFromUnitVectors(V3(0,0,1),d);o.scale.setScalar(r*(.16+((k*7+row)%3)*.04))}));
 const ph=[];for(let i=0;i<18;i++){const s=glowSprite('#ffb060',S*.35,.9);g.add(s);ph.push({s,a:Rn()*6.28,x:(Rn()-.5)*L*.9,rr:r*(2+Rn()*2),sp:.4+Rn()*.4})}
 g.add(glowSprite('#fff4e0',L*.5,.12));return tt=>{for(const k of ph){const a=k.a+tt*k.sp;k.s.position.set(k.x+Math.sin(tt*.2+k.a)*S,Math.cos(a)*k.rr,Math.sin(a)*k.rr)}}};

/* ---------- 悬挂之城: a disc of dream residue a kilometre up; threads hang from it, each ending in a cube or ball house; a low residue wall below ---------- */
fxH_SH.bk_hang=(g,x)=>{const {S,Rn}=x;const Y=S*.9;const dm=mt('#e8dcb8',{roughness:.7});
 const disc=new THREE.Mesh(kcy(S,S*.96,S*.06,48),dm);disc.position.y=Y;g.add(disc);const under=new THREE.Mesh(new THREE.CircleGeometry(S*.96,48),mt('#c8bca0',{roughness:.8}));under.rotation.x=Math.PI/2;under.position.y=Y-S*.031;g.add(under);
 const pos=[],H=[];for(let i=0;i<70;i++){const a=Rn()*6.28,d=Math.sqrt(Rn())*S*.9;const len=S*(.15+Rn()*.6);const xx=Math.cos(a)*d,zz=Math.sin(a)*d;pos.push(xx,Y-S*.03,zz,xx,Y-len,zz);H.push([xx,Y-len,zz,i%2])}
 const lg=new THREE.BufferGeometry();lg.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.add(new THREE.LineSegments(lg,new THREE.LineBasicMaterial({color:'#e8dcc0',transparent:true,opacity:.8})));
 const hm=mt('#f6f0e0',{roughness:.6});const cubes=H.filter(h=>!h[3]),balls=H.filter(h=>h[3]);
 g.add(fxH_inst(kb(1,1,1),hm,cubes.length,(o,i)=>{const h=cubes[i];const s=S*(.03+Rn()*.03);o.position.set(h[0],h[1]-s/2,h[2]);o.scale.setScalar(s);o.rotation.y=Rn()*3}));
 g.add(fxH_inst(new THREE.SphereGeometry(1,12,8),hm,balls.length,(o,i)=>{const h=balls[i];const s=S*(.02+Rn()*.02);o.position.set(h[0],h[1]-s,h[2]);o.scale.setScalar(s)}));
 const wl=[];for(let i=0;i<H.length;i+=3)wl.push(V3(H[i][0],H[i][1]-S*.02,H[i][2]));g.add(sparkles(wl,'#ffe0a8',S*.04,1,.5));
 const gr=new THREE.Mesh(kcy(S*1.15,S*1.1,S*.05,40),mt('#8a8274',{roughness:.95}));gr.position.y=-S*.025;g.add(gr);
 const wall=new THREE.Mesh(new THREE.CylinderGeometry(S*1.05,S*1.05,S*.05,64,1,true),mt('#d8d0c0',{roughness:.9,side:THREE.DoubleSide}));wall.position.y=S*.025;g.add(wall);
 return t=>{disc.position.y=Y+Math.sin(t*.4)*S*.01}};

/* ---------- 资料室: a crown-of-thorns starfish: ten arms, covered in spines ---------- */
fxH_SH.bk_ziliao=(g,x)=>{const {S,c,Rn}=x;const am=detailMat(mt(c,{roughness:.75}),{bump:.6,freq:1}),spm=mt('#e8a890',{roughness:.6});const sp=[];
 {const cb=new THREE.Mesh(new THREE.SphereGeometry(S*.6,20,12),am);cb.scale.set(1,.35,1);g.add(cb)}
 for(let i=0;i<10;i++){const a=i/10*6.283;const arm=new THREE.Mesh(new THREE.ConeGeometry(S*.26,S*1.6,10),am);arm.rotation.z=-Math.PI/2;arm.position.x=S*.95;arm.scale.set(.55,1,1);const q=new THREE.Group();q.add(arm);q.rotation.y=a;q.rotation.z=-.08;g.add(q);
  for(let k=0;k<16;k++){const u=Rn();const rr=S*.26*(1-u)*.9;const b=Rn()*Math.PI;sp.push({a,x:S*(.2+u*1.55),y:Math.sin(b)*rr*.55,z:Math.cos(b)*rr})}}
 g.add(fxH_inst(kc(1,1,5),spm,sp.length,(o,i)=>{const s=sp[i];const p=V3(s.x,s.y,s.z).applyAxisAngle(fxH_UP,s.a);o.position.copy(p);const n=V3(0,s.y,s.z).normalize().applyAxisAngle(fxH_UP,s.a);if(n.lengthSq()<.5)n.set(0,1,0);o.quaternion.setFromUnitVectors(fxH_UP,n);const k=S*.022;o.scale.set(k,k*4.5,k);o.translateY(k*1.8)}));
 return t=>{g.rotation.y=t*.03}};

/* ---------- 秩序守护者: great dream beings that look made of platinum and bronze; one is a faceless white-gold humanoid ---------- */
fxH_SH.bk_order=(g,x)=>{const {S}=x;const pl=mt('#e4e0d4',{metalness:.85,roughness:.25}),br=mt('#b07a3a',{metalness:.8,roughness:.3}),wg=mt('#f0e2b8',{metalness:.85,roughness:.2,emissive:'#5a4a20',emissiveIntensity:.2});const F=[];
 [[0,0,1.5,wg],[-S*.9,-S*.2,1.1,pl],[S*.9,-S*.25,1,pl]].forEach(([xx,zz,k,m],i)=>{const f=fxH_faceless(S*k,m,br);f.position.set(xx,-S*.6,zz);f.rotation.y=-.3+i*.3;g.add(f);F.push(f)});
 g.add(swarmPts(60,S*1.6,'#f4f0e0',S*.03,x.seed));
 return t=>{F.forEach((f,i)=>{f.position.y=-S*.6+Math.sin(t*.4+i)*S*.04;const ar=f.userData.arms;ar[0].rotation.z=Math.sin(t*.5+i)*.15;ar[1].rotation.z=-Math.sin(t*.5+i)*.15})}};

/* ---------- 攀天城: an ellipsoid over a hundred kilometres, made all of writhing tentacles, silver skin that looks metallic ---------- */
fxH_SH.v_pantian=(g,x)=>{const {S,Rn,seed}=x;const sm2=mt('#b8bcc4',{metalness:.8,roughness:.3});const core=new THREE.Mesh(fxH_lumpGeo(S,3,.08,seed,V3(1.5,.85,1)),sm2);g.add(core);
 const groups=[];for(let k=0;k<6;k++){const q=new THREE.Group();g.add(q);groups.push(q)}
 for(let i=0;i<110;i++){const n=V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize();const base=n.clone().multiply(V3(S*1.45,S*.82,S*.96));const t1=V3(Rn()-.5,Rn()-.5,Rn()-.5).cross(n).normalize(),t2=n.clone().cross(t1);const L=S*(.3+Rn()*.5),pts=[];
  for(let j=0;j<=8;j++){const u=j/8,a=u*5+Rn();pts.push(base.clone().addScaledVector(n,u*L).addScaledVector(t1,Math.cos(a)*S*.08*u).addScaledVector(t2,Math.sin(a)*S*.08*u))}
  groups[i%6].add(new THREE.Mesh(ktube(pts,S*(.02+Rn()*.04)*(1),14,5),sm2))}
 return t=>{groups.forEach((q,i)=>{q.rotation.set(Math.sin(t*.5+i)*.03,Math.sin(t*.4+i*2)*.03,Math.cos(t*.45+i)*.03)});g.rotation.y=t*.01}};

/* ---------- 颗粒生物: white grains a few centimetres across, never touching, gathered into bodies, here a three-metre figure ---------- */
fxH_SH.v_keli=(g,x)=>{const {S,Rn}=x;const H=S*1.4,pts=[];const add=(cx,cy,cz,rx,ry,rz,n)=>{for(let i=0;i<n;i++){const v=V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize().multiplyScalar(Math.cbrt(Rn()));pts.push(V3(cx+v.x*rx,cy+v.y*ry,cz+v.z*rz))}};
 add(0,H*.9,0,H*.07,H*.08,H*.07,60);add(0,H*.64,0,H*.11,H*.18,H*.08,170);for(const z of[-1,1]){add(0,H*.62,z*H*.17,H*.03,H*.2,H*.03,45);add(0,H*.25,z*H*.07,H*.04,H*.24,H*.04,70)}
 const p=sparkles(pts,'#f4f4f8',S*.05,1,.3);p.position.y=-H*.5;g.add(p);g.add(swarmPts(80,S*1.2,'#e0e0ea',S*.03,x.seed));return t=>{p.rotation.y=Math.sin(t*.3)*.6}};

/* ================= dream ================= */
/* ---------- 微缩银河: a pitch-black disc ten kilometres across, a vortex of countless points of light printed on its face ---------- */
fxH_SH.dr_galaxy=(g,x)=>{const {Rn}=x;const r=x.kp.r||46;const disc=new THREE.Mesh(kcy(r,r,r*.035,64),mt('#050508',{roughness:.45,metalness:.2}));g.add(disc);
 const pts=[];for(let i=0;i<1400;i++){const t=i/1400,ang=t*6.28*4+(i%2)*Math.PI,rr=r*(.06+t*.9);pts.push(V3(Math.cos(ang)*rr+(Rn()-.5)*r*.05,r*.02,Math.sin(ang)*rr+(Rn()-.5)*r*.05))}
 const sp=sparkles(pts,x.c,r*.03,1,.4);g.add(sp);g.add(at(glowSprite('#ffffff',r*.3,.7),0,r*.03,0));g.rotation.x=.35;
 return t=>{sp.rotation.y=-t*.06}};

/* ---------- 熔链: countless rings that link into giant chains round a dark centre ---------- */
fxH_SH.dr_ronglian=(g,x)=>{const {Rn}=x;const r=x.kp.r||30;g.add(new THREE.Mesh(new THREE.SphereGeometry(r*.35,24,16),mt('#120808',{roughness:.6})));g.add(glowSprite('#ff6a2a',r*1.2,.25));
 const rm=mt(x.c,{metalness:.5,roughness:.35,emissive:x.c,emissiveIntensity:.5});const chains=[];
 for(let k=0;k<3;k++){const q=new THREE.Group();q.rotation.set(Rn()*1.2,Rn()*3,Rn()*1.2);const N=26,R=r*(.85+k*.22);for(let i=0;i<N;i++){const a=i/N*6.283;const l=new THREE.Mesh(new THREE.TorusGeometry(r*.11,r*.025,6,16),rm);l.position.set(Math.cos(a)*R,0,Math.sin(a)*R);l.lookAt(l.position.clone().add(V3(-Math.sin(a),0,Math.cos(a))));l.rotateY(Math.PI/2);if(i%2)l.rotateX(Math.PI/2);q.add(l)}g.add(q);chains.push(q)}
 return t=>{chains.forEach((q,i)=>q.rotateY(.002*(i%2?1:-1)))}};

/* ---------- 脑灵: seen as a crowd of jostling clusters of light ---------- */
fxH_SH.dr_brainspirit=(g,x)=>{const {Rn}=x;const r=x.kp.r||40;const B=[];for(let i=0;i<14;i++){const q=new THREE.Group();q.position.set((Rn()-.5)*r*1.6,(Rn()-.5)*r*.8,(Rn()-.5)*r*1.6);q.add(glowSprite(x.c,r*.35,.6));q.add(swarmPts(30,r*.12,'#f0e0ff',r*.025,i+3));g.add(q);B.push({q,p:q.position.clone(),ph:Rn()*6})}
 return t=>{for(const b of B)b.q.position.set(b.p.x+Math.sin(t*.8+b.ph)*r*.08,b.p.y+Math.cos(t*.7+b.ph)*r*.06,b.p.z+Math.sin(t*.6+b.ph*2)*r*.08)}};

/* ---------- 最后之地: white houses tens of metres tall, pyramids, shells and stacked cubes on a golden plain ---------- */
fxH_SH.dr_lastland=(g,x)=>{const {Rn}=x;const r=x.kp.r||44;const base=fxH_make0(x.w,x.sp,x.frozen);g.add(base);const wm=mt('#f4f2ec',{roughness:.6});
 for(let i=0;i<18;i++){const a=Rn()*6.28,d=Math.sqrt(Rn())*r*.75,h=r*(.04+Rn()*.05);const p=V3(Math.cos(a)*d,r*.06,Math.sin(a)*d);let m;
  if(i%3===0){m=new THREE.Mesh(kc(h*.8,h*1.4,4),wm);m.position.copy(p).add(V3(0,h*.7,0))}else if(i%3===1){m=new THREE.Mesh(new THREE.SphereGeometry(h*.7,12,8,0,6.283,0,Math.PI/2),wm);m.scale.set(1,1.3,1.6);m.position.copy(p)}
  else{m=new THREE.Group();for(let k=0;k<3;k++){const b=new THREE.Mesh(kb(h*.6,h*.6,h*.6),wm);b.position.set(k===2?h*.15:(k?h*.3:-h*.0),h*.3+(k===2?h*.6:0),k===1?h*.2:0);b.rotation.y=k*.6;m.add(b)}m.position.copy(p)}
  base.add(m)}
 return null};

/* ================= midgard and the white tunnel ================= */
/* ---------- 三腿柱: over two metres, a black cylinder on three legs, no arms, one glowing dot at the middle of its body ---------- */
fxH_SH.mg_tripod=(g,x)=>{const {S}=x;const bm=mt('#141416',{metalness:.4,roughness:.35});
 for(let i=0;i<3;i++){const a=i/3*6.28;const l=new THREE.Mesh(kcy(S*.05,S*.08,S*2,8),bm);l.position.set(Math.cos(a)*S*.42,S*.95,Math.sin(a)*S*.42);l.rotation.set(Math.sin(a)*.28,0,-Math.cos(a)*.28);g.add(l)}
 const b=new THREE.Mesh(kcy(S*.38,S*.38,S*1.5,20),bm);b.position.y=S*2.6;g.add(b);const top=new THREE.Mesh(new THREE.SphereGeometry(S*.38,20,8,0,6.283,0,Math.PI/2),bm);top.position.y=S*3.35;g.add(top);
 const e=new THREE.Mesh(new THREE.SphereGeometry(S*.07,10,8),new THREE.MeshBasicMaterial({color:'#ff6a4a'}));e.position.set(S*.38,S*2.6,0);g.add(e);const eg=glowSprite('#ff5a4a',S*.7,.9);eg.position.copy(e.position);g.add(eg);
 return t=>{eg.material.opacity=.7+Math.sin(t*2)*.2}};

/* ---------- 构造堡垒: a black liquid hidden underground like a pool of mud; when needed it rises into a huge structure that turns out armies ---------- */
fxH_SH.mg_fortress=(g,x)=>{const {S,Rn,seed}=x;const blk=mt('#0a0a0c',{roughness:.08,metalness:.35});
 const pg=new THREE.CircleGeometry(S*1.4,40);{const p=pg.attributes.position;for(let i=1;i<p.count;i++){const a=Math.atan2(p.getY(i),p.getX(i)),r=Math.hypot(p.getX(i),p.getY(i));const k=1+Math.sin(a*5+1)*.08+Math.sin(a*11)*.05;p.setXY(i,Math.cos(a)*r*k,Math.sin(a)*r*k)}}pg.rotateX(-Math.PI/2);const pool=new THREE.Mesh(pg,blk);pool.position.y=S*.01;g.add(pool);
 // the mass rising out of it: a dark heap that grows spikes and a crude hall
 const mass=new THREE.Mesh(fxH_lumpGeo(S*.55,3,.25,seed,V3(1,1.6,1)),blk);mass.position.y=S*.55;g.add(mass);
 g.add(fxH_inst(kc(1,1,5),blk,40,(o,i)=>{const v=V3(Rn()-.5,Rn()*.9,Rn()-.5).normalize();o.position.copy(v).multiply(V3(S*.5,S*.85,S*.5)).add(V3(0,S*.55,0));o.quaternion.setFromUnitVectors(fxH_UP,v);const k=S*(.04+Rn()*.05);o.scale.set(k,k*(5+Rn()*6),k);o.translateY(k*2)}));
 for(let i=0;i<5;i++){const a=i/5*6.28+.3;const p=new THREE.Mesh(kcy(S*.06,S*.12,S*(.8+Rn()*.7),6),blk);p.position.set(Math.cos(a)*S*.7,S*.4,Math.sin(a)*S*.7);p.rotation.set(Math.sin(a)*.3,0,-Math.cos(a)*.3);g.add(p)}
 // the first of the army it is making, walking out over the mud
 const sol=[];const sm3=mt('#2a2626',{roughness:.6});for(let i=0;i<10;i++){const s=new THREE.Group();const b=sph(0,S*.05,S*.06,S*.04,8,sm3);b.position.y=S*.07;s.add(b);for(let k=0;k<4;k++){const l=cyl(S*.008,S*.006,S*.07,sm3,4);l.position.set((k%2-.5)*S*.06,S*.035,(k<2?-1:1)*S*.03);s.add(l)}g.add(s);sol.push({s,a:i/10*6.28,ph:Rn()})}
 const ex=emitter({n:50,life:3,speed:S*.08,spread:.3,size:S*.12,dir:[0,1,0],col:'#1a1a1e',op:.5,add:false,tex:smokeTex,area:[S*.8,S*.1,S*.8]});ex.position.y=S*.4;g.add(ex);
 return t=>{mass.scale.y=1+Math.sin(t*.5)*.04;for(const k of sol){const u=(k.ph+t*.05)%1,r=S*(.6+u*1.1);k.s.position.set(Math.cos(k.a)*r,0,Math.sin(k.a)*r);k.s.rotation.y=-k.a}}};

/* ---------- 无形: shapeless; the form Lin meets is thirty metres, roughly a person, all white, without a face ---------- */
fxH_SH.tn_wuxing=(g,x)=>{const {S}=x;const wm=mt('#f2f2ee',{roughness:.45,emissive:'#e8e8e0',emissiveIntensity:.15});const f=fxH_faceless(S*2.2,wm);g.add(f);g.add(at(glowSprite('#ffffff',S*2.4,.18),0,S*1.2,0));
 return t=>{const k=Math.sin(t*.9);f.scale.set(1+k*.06,1-k*.04,1+Math.cos(t*.7)*.06);f.rotation.y=Math.sin(t*.3)*.3;const ar=f.userData.arms;ar[0].rotation.z=Math.sin(t*1.1)*.3;ar[1].rotation.z=Math.cos(t*.8)*.3}};

/* ---------- 先驱: beings of strong cold light about a hundred metres across; a jar a metre high is only a fragment of one ---------- */
fxH_SH.tn_xianqu=(g,x)=>{const {S,Rn}=x;const o=new THREE.Mesh(new THREE.SphereGeometry(S*1.1,32,24),new THREE.MeshBasicMaterial({color:'#f4f2e8'}));o.position.y=S*2.6;g.add(o);
 const h1=glowSprite('#fffbe8',S*3.6,.55),h2=glowSprite('#e8f0ff',S*8,.16);h1.position.y=h2.position.y=S*2.6;g.add(h1,h2);
 const sw=swarmPts(80,S*2.2,'#f8f8ff',S*.08,x.seed);sw.position.y=S*2.6;g.add(sw);
 const pts=[];for(let i=0;i<=14;i++){const t=i/14;pts.push(new THREE.Vector2(S*.3*(.35+Math.sin(t*Math.PI)*.5+(t>.85?.15:0)),t*S*.6))}const jar=new THREE.Mesh(new THREE.LatheGeometry(pts,20),mt('#f4f0e8',{side:THREE.DoubleSide,roughness:.4,emissive:'#fff4d8',emissiveIntensity:.2}));jar.position.set(S*1.4,0,S*.6);g.add(jar);
 return t=>{h1.material.opacity=.5+Math.sin(t*1.3)*.08;sw.rotation.y=t*.1}};

/* ================= a few smaller ones in the frozen void and midgard ================= */
/* 巴士海葵: an upright barrel with a crown of tentacles */
fxH_SH.ng_haikui=(g,x)=>{const {S}=x;const fm=mt(x.c,{roughness:.5,emissive:x.c,emissiveIntensity:.15});const b=new THREE.Mesh(kcy(S*.5,S*.6,S*1.4,16),fm);b.position.y=S*.7;g.add(b);
 for(let i=0;i<16;i++){const a=i/16*6.28,pts=[];for(let j=0;j<=6;j++){const u=j/6;pts.push(V3(Math.cos(a)*S*(.45+u*.5),S*(1.4+u*.8)-u*u*S*.4,Math.sin(a)*S*(.45+u*.5)))}g.add(new THREE.Mesh(ktube(pts,S*.05*(1),10,5),fm))}return null};
/* 气球生物: hard balls with long tails */
fxH_SH.ng_qiqiu=(g,x)=>{const {Rn,kp}=x;const s=kp.s||50,n=kp.n||40;const bm=mt(x.c,{roughness:.5});const P=[];for(let i=0;i<n;i++)P.push(V3((Rn()-.5)*s*2,(Rn()-.5)*s,(Rn()-.5)*s*2));
 g.add(fxH_inst(new THREE.SphereGeometry(1,12,8),bm,n,(o,i)=>{o.position.copy(P[i]);o.scale.setScalar(s*(.05+Rn()*.05))}));
 g.add(fxH_inst(kc(1,1,5),mt('#d8c8b8',{roughness:.6}),n,(o,i)=>{const k=s*(.05+((i*7)%5)*.01);o.position.copy(P[i]).add(V3(0,-k*3.2,0));o.rotation.set(Math.PI+(Rn()-.5)*.4,0,(Rn()-.5)*.4);o.scale.set(k*.18,k*5,k*.18)}));return null};
/* 黑鹑的砖墙: a still wall of black bricks */
fxH_SH.ng_heichun=(g,x)=>{const {S}=x;const W=S*4,Hh=S*2.2,bw=S*.2,bh=S*.06;const n=Math.floor(W/bw)*Math.floor(Hh/bh);const cols=Math.floor(W/bw);
 g.add(fxH_inst(kb(bw*.95,bh*.9,S*.08),mt('#ffffff',{roughness:.8}),n,(o,i)=>{const r=(i/cols)|0,k=i%cols;o.position.set(-W/2+k*bw+(r%2)*bw/2,-Hh/2+r*bh,0)},['#141414','#1c1c1e','#0e0e10']));return null};
/* 有名的蛋: just hatched; the shell is broken open */
fxH_SH.mg_egg=(g,x)=>{const {S,c,Rn}=x;const sm4=mt(c,{roughness:.35,side:THREE.DoubleSide});const lo=new THREE.Mesh(new THREE.SphereGeometry(S,28,16,0,6.283,Math.PI*.55,Math.PI*.45),sm4);lo.scale.y=1.35;lo.position.y=S*1.35;g.add(lo);
 for(let i=0;i<7;i++){const a=i/7*6.28+Rn();const f=new THREE.Mesh(new THREE.SphereGeometry(S,6,4,0,.9,0,.8),sm4);f.scale.set(.5,.5,.5);f.position.set(Math.cos(a)*S*1.4,S*.05,Math.sin(a)*S*1.4);f.rotation.set(Rn()*2,Rn()*3,Rn());g.add(f)}
 const goo=new THREE.Mesh(new THREE.CircleGeometry(S*.7,20),mt('#e8d890',{roughness:.1}));goo.rotation.x=-Math.PI/2;goo.position.y=S*.8;g.add(goo);return null};
