/* ================================================================
   fixes C: bodies rebuilt so they follow what the book says about them.
   every name here starts with fxC_ (all files share one scope)
   ================================================================ */
/* a tube that thins (or swells) from r0 at its start to r1 at its end */
function fxC_taper(pts,r0,r1,seg,rs){seg=seg||16;rs=rs||6;const cu=new THREE.CatmullRomCurve3(pts);const geo=new THREE.TubeGeometry(cu,seg,1,rs,false);const p=geo.attributes.position,c=V3(),v=V3();
 for(let i=0;i<=seg;i++){cu.getPointAt(i/seg,c);const k=r0+(r1-r0)*i/seg;for(let j=0;j<=rs;j++){const n=i*(rs+1)+j;v.set(p.getX(n),p.getY(n),p.getZ(n)).sub(c).multiplyScalar(k).add(c);p.setXYZ(n,v.x,v.y,v.z)}}
 geo.computeVertexNormals();return geo}
/* many copies of one small geometry; list of [pos,quat|euler,scale] */
const _fxC_o=new THREE.Object3D();
function fxC_inst(geo,mat,list){const m=new THREE.InstancedMesh(geo,mat,list.length);list.forEach((q,i)=>{_fxC_o.position.copy(q[0]);if(q[1]&&q[1].isQuaternion)_fxC_o.quaternion.copy(q[1]);else _fxC_o.rotation.set(...(q[1]||[0,0,0]));const s=q[2]===undefined?1:q[2];if(typeof s==='number')_fxC_o.scale.setScalar(s);else _fxC_o.scale.copy(s);_fxC_o.updateMatrix();m.setMatrixAt(i,_fxC_o.matrix)});m.instanceMatrix.needsUpdate=true;return m}
const _fxC_up=V3(0,1,0);
function fxC_q(dir){return new THREE.Quaternion().setFromUnitVectors(_fxC_up,dir.clone().normalize())}

/* ---------- 奇布查虫: crystal-shelled beetles on four legs, the front pair ending in open tubes that fire crystal splinters;
   most carry a white ball of fungus. their pipes of crystal run into a ten-metre crystal disc, and inside the disc lives
   the white oval brain (the same kind as the 脑袋虫) ---------- */
function fxC_chibchaBug(shell,leg,fung){const b=new THREE.Group();const body=sph(0,.17,.09,.12,10,shell);body.position.y=.12;b.add(body);
 const hd=sph(0,.06,.05,.07,8,shell);hd.position.set(.17,.11,0);b.add(hd);
 const ridge=new THREE.Mesh(ko(.05),shell);ridge.scale.set(2.6,.6,.6);ridge.position.set(-.01,.2,0);b.add(ridge);
 const L=[];for(const z of[-1,1]){// front legs: reach forward, ending in a hollow tube
  const f=leg2(.09,.09,.014,leg,-.9);f.position.set(.1,.1,z*.07);f.rotation.set(z*.9,0,-.5);b.add(f);const tb=cyl(.016,.012,.06,shell,6);tb.position.y=-.11;f.userData.knee.add(tb);
  const hole=sph(0,.009,.003,.009,6,M('#0a1418'));hole.position.y=-.14;f.userData.knee.add(hole);
  const r=leg2(.09,.1,.014,leg,.9);r.position.set(-.07,.1,z*.07);r.rotation.x=z*.9;b.add(r);L.push({m:f,ph:z>0?0:Math.PI,a:.4},{m:r,ph:z>0?Math.PI:0,a:.4})}
 if(fung){const fb=sph(0,.11,.1,.11,10,fung);fb.position.set(-.04,.29,0);b.add(fb)}
 b.userData.L=L;return b}
function fxC_chibcha(){const g=new THREE.Group();
 const crys=new THREE.MeshStandardMaterial({color:'#bfefff',emissive:'#4ab0d8',emissiveIntensity:.35,roughness:.08,metalness:.25,transparent:true,opacity:.42,depthWrite:false,side:THREE.DoubleSide});
 const crysS=new THREE.MeshStandardMaterial({color:'#cdf4ff',emissive:'#5ac0e0',emissiveIntensity:.3,roughness:.1,metalness:.3,flatShading:true});
 // the disc: a flattened crystal lens, faceted, with the brain lying in its round hollow
 const disc=new THREE.Mesh(new THREE.SphereGeometry(1.25,18,10),crys);disc.scale.y=.42;disc.position.y=.55;g.add(disc);
 const rim=new THREE.Mesh(new THREE.TorusGeometry(1.22,.06,5,28),crysS);rim.rotation.x=Math.PI/2;rim.position.y=.55;g.add(rim);
 for(let i=0;i<10;i++){const a=i/10*6.28;const c=new THREE.Mesh(ko(.14),crysS);c.scale.y=2;c.position.set(Math.cos(a)*1.15,.25,Math.sin(a)*1.15);c.rotation.z=Math.cos(a)*.4;g.add(c)}
 const br=bMaya();br.scale.setScalar(.3);br.position.set(0,.43,0);g.add(br);
 // crystal pipes running out from the disc, some arching over the floor, carrying the bugs
 const shell=new THREE.MeshStandardMaterial({color:'#c8f0ff',emissive:'#3a9ac8',emissiveIntensity:.35,roughness:.1,metalness:.35,flatShading:true});
 const leg=M('#3a4a5a',{roughness:.5}),fung=M('#f4f2ea',{roughness:.95});
 // pipes: some run along the floor to a second, smaller disc, some climb away toward the roof of the cave,
 // some sag across between; together a net like blood vessels, the discs like hearts
 const d2=new THREE.Mesh(disc.geometry,crys);d2.scale.set(.6,.25,.6);d2.position.set(3.4,.35,-1.6);g.add(d2);const r2=new THREE.Mesh(rim.geometry,crysS);r2.rotation.x=Math.PI/2;r2.scale.setScalar(.6);r2.position.copy(d2.position);g.add(r2);
 const P=[[V3(1.2,.55,-.2),V3(2.2,.9,-.8),V3(2.8,.4,-1.4)],[V3(.6,.4,-1),V3(1.6,.15,-1.9),V3(2.7,.25,-1.9)],
  [V3(-.9,.7,-.8),V3(-1.6,1.6,-1.4),V3(-1.9,2.9,-1.7)],[V3(-1.1,.6,.5),V3(-2.2,.9,1.1),V3(-3,.2,1.6)],[V3(.3,.8,1.1),V3(.5,2,1.9),V3(.2,3.1,2.3)],
  [V3(3.6,.45,-1.2),V3(3.9,1.6,-.6),V3(4.1,2.8,-.2)],[V3(-1.6,1.6,-1.4),V3(-.6,2.2,.6),V3(.5,2,1.9)],[V3(1.1,.4,.6),V3(2,.3,1.3),V3(2.6,1.2,1.9),V3(2.7,2.6,2.2)]];
 const bugs=[];P.forEach((pts,i)=>{const cu=new THREE.CatmullRomCurve3(pts);g.add(new THREE.Mesh(new THREE.TubeGeometry(cu,24,.11,7,false),crys));
  const e=pts[pts.length-1];if(e.y>1.5){const end=new THREE.Mesh(kcy(.16,.12,.14,8),crysS);end.position.copy(e);g.add(end)}
  for(let k=0;k<(i<6?3:2);k++){const b=fxC_chibchaBug(shell,leg,(k+i)%3?fung:null);g.add(b);bugs.push({b,cu,o:k/3+i*.13,sp:(.05+(k%2)*.02)*(i%2?1:-1)})}});
 for(let i=0;i<9;i++){const c=new THREE.Mesh(ko(.12+h3(i,1,9)*.1),crysS);c.scale.y=2.2;c.position.set((h3(i,2,9)-.5)*7,.02,(h3(i,3,9)-.5)*5);if(c.position.length()<1.5)c.position.x+=2.5;c.rotation.z=(h3(i,4,9)-.5);g.add(c)}
 // a few walking the floor about the disc
 for(let i=0;i<4;i++){const b=fxC_chibchaBug(shell,leg,i%2?fung:null);g.add(b);bugs.push({b,ring:1,a:i/4*6.28,o:i*.2})}
 g.add(swarmPts(26,1.8,'#e0fbff',.05,2));g.add(shadow(1.5));
 const L=[];bugs.forEach(x=>x.b.userData.L.forEach(l=>L.push(Object.assign({},l,{ph:l.ph+x.o*9}))));addLegs(g,L);
 const tmp=V3(),tg2=V3(),X=V3(1,0,0);
 stdAnim(g,{fq:9,amp:.35,extra:t=>{br.userData.anim&&br.userData.anim(t*.5);
  for(const x of bugs){if(x.ring){const a=x.a+t*.3;x.b.position.set(Math.cos(a)*1.7,0,Math.sin(a)*1.7);x.b.rotation.set(0,-a-Math.PI/2,0);continue}
   const u=((x.o+t*x.sp)%1+1)%1;x.cu.getPointAt(u,tmp);x.cu.getTangentAt(u,tg2);x.b.position.copy(tmp);x.b.position.y+=.1;
   x.b.quaternion.setFromUnitVectors(X,tg2)}}});
 return g}

/* ---------- 蒙特祖玛二世's ship: a wooden hull of chewed-and-glued timber, a hundred-odd metres by thirty, open inside and
   crawling with black eyeless bugs; its three masts all snapped halfway in a storm, so it only drifts.
   蒙特祖玛二世 itself, a big queen-like bug with two pairs of wings, sits in the middle ---------- */
function fxC_bow(x){return x>0?1-.75*Math.pow(x,2.2):1-.25*Math.pow(-x,3)}
function fxC_hullGeo(){const geo=new THREE.SphereGeometry(1,40,12,0,Math.PI*2,Math.PI/2,Math.PI/2);const p=geo.attributes.position;
 for(let i=0;i<p.count;i++){let x=p.getX(i),y=p.getY(i),z=p.getZ(i);z*=fxC_bow(x);y*=(x>0?1-.15*x:1);p.setXYZ(i,x*3.3,y*.8+Math.pow(Math.abs(x),3)*.25,z)}
 geo.computeVertexNormals();return geo}
function fxC_bugGeo(){return mergeColored([[new THREE.SphereGeometry(1,7,5).scale(.07,.035,.04),'#141210'],[new THREE.SphereGeometry(1,6,4).scale(.03,.025,.03).translate(.08,.005,0),'#1c1814'],
 [new THREE.ConeGeometry(.012,.05,3).rotateZ(-Math.PI/2).translate(.12,0,.015),'#2a2018'],[new THREE.ConeGeometry(.012,.05,3).rotateZ(-Math.PI/2).translate(.12,0,-.015),'#2a2018']])}
function fxC_mtzm2(){const g=new THREE.Group();const ship=new THREE.Group();g.add(ship);
 const wood=detailMat(M('#7a5a3a',{roughness:.9,side:THREE.DoubleSide}).clone(),{bump:1,freq:5});
 const hull=new THREE.Mesh(fxC_hullGeo(),wood);hull.position.y=.75;ship.add(hull);
 // a ring of rough gunwale timber and a few cross beams
 const gw=[];for(let i=0;i<40;i++){const a=i/40*6.28;const x=Math.cos(a),z=Math.sin(a);gw.push(V3(x*3.3,.76+Math.pow(Math.abs(x),3)*.25,z*fxC_bow(x)))}
 ship.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(gw,true),80,.06,5,true),M('#5a4028',{roughness:.95})));
 const beam=M('#6a4a2e',{roughness:.95});for(const x of[-1.8,-.6,1.6]){const b=new THREE.Mesh(kb(.12,.08,1.9*fxC_bow(x/3.3)),beam);b.position.set(x,.72,0);ship.add(b)}
 // the crowd: a black carpet of bugs over the inside of the hull
 const bl=[];for(let i=0;i<700;i++){const u=(h3(i,1,31)-.5)*1.86,x=u*3.3;const w=Math.sqrt(Math.max(0,1-Math.pow(.2/.8,2)-u*u))*fxC_bow(u);const z=(h3(i,2,31)-.5)*1.9*w;if(Math.hypot(x,z)<.5)continue;
  bl.push([V3(x,.58+h3(i,4,31)*.12+Math.pow(Math.abs(u),3)*.2,z),[0,h3(i,3,31)*6.28,0],1+h3(i,5,31)*.7])}
 {const sh=new THREE.Shape();for(let i=0;i<=48;i++){const a=i/48*6.283,x=Math.cos(a)*.93;const w=Math.sqrt(Math.max(0,.96-x*x))*fxC_bow(x)*.97;i?sh.lineTo(x*3.3,-Math.sin(a)*w):sh.moveTo(x*3.3,0)}const fl=new THREE.Mesh(new THREE.ShapeGeometry(sh,1),M('#16120e',{roughness:.6}));fl.rotation.x=-Math.PI/2;fl.position.y=.6;ship.add(fl)}
 ship.add(fxC_inst(fxC_bugGeo(),new THREE.MeshStandardMaterial({vertexColors:true,roughness:.35,metalness:.2}),bl));
 // three masts, each broken off with a splintered top; the broken upper halves and torn sail scraps lie across the hull
 const mast=M('#5e4430',{roughness:.9});[[1.5,1.1],[0,1.3],[-1.6,.9]].forEach(([x,h],i)=>{const m=cyl(.07,.09,h,mast,7);m.position.set(x,.6+h/2,0);ship.add(m);
  for(let k=0;k<5;k++){const sp=cone(.03,.16+h3(i,k,3)*.12,mast,3);const a=k*1.25;sp.position.set(x+Math.cos(a)*.04,.6+h+.05,Math.sin(a)*.04);sp.rotation.set(Math.sin(a)*.3,0,Math.cos(a)*.3);ship.add(sp)}
  const top=cyl(.06,.07,1.5,mast,7);top.position.set(x+.35,.85,(i-1)*.35+.2);top.rotation.set(.3,0,1.25+i*.1);ship.add(top);
  const rag=new THREE.Mesh(new THREE.PlaneGeometry(.6,.45,3,2),M('#c8b48a',{side:THREE.DoubleSide,roughness:1}));rag.position.set(x+.1,.6+h*.7,.05);rag.rotation.set(.2,.4,.15);ship.add(rag)});
 // 蒙特祖玛二世: black, armoured, swollen abdomen like a queen's, sawtoothed mandibles, antennae, two pairs of wings
 const q=new THREE.Group();const qs=M('#1a1614',{roughness:.3,metalness:.25});const ab=sph(0,.34,.2,.22,14,qs);ab.position.set(-.25,0,0);q.add(ab);
 for(let i=0;i<4;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(.2-i*.02,.012,4,14),M('#3a2a20'));r.rotation.y=Math.PI/2;r.scale.set(1,.95,1.15);r.position.set(-.05-i*.13,0,0);q.add(r)}
 const th=sph(0,.14,.12,.12,10,qs);th.position.set(.15,.04,0);q.add(th);const hd=sph(0,.1,.08,.1,10,qs);hd.position.set(.33,.06,0);q.add(hd);
 for(const z of[-1,1]){const md=cone(.025,.14,M('#3a2c22'),4);md.rotation.set(z*.5,0,-Math.PI/2+.2);md.position.set(.44,.02,z*.05);q.add(md);
  q.add(tubeAlong([V3(.4,.12,z*.04),V3(.55,.3,z*.12),V3(.7,.36,z*.22)],.008,qs,8));
  for(let k=0;k<3;k++){const l=leg2(.12,.14,.012,qs,.8);l.position.set(.18-k*.08,0,z*.09);l.rotation.x=z*1.1;q.add(l)}}
 const wm=new THREE.MeshStandardMaterial({color:'#3a3a40',transparent:true,opacity:.55,side:THREE.DoubleSide,roughness:.3,depthWrite:false});const qw=[];
 for(const z of[-1,1])for(let k=0;k<2;k++){const w=wing(.55-k*.1,.18,wm,'insect');w.position.set(.12-k*.12,.12,z*.06);w.rotation.y=k?-.6:-.3;if(z<0)w.scale.z=-1;q.add(w);qw.push({w,z,k})}
 const orb=sph(0,.07,.07,.07,10,M('#d8c8a8',{roughness:.6}));orb.position.set(-.2,-.05,.28);q.add(orb);
 q.scale.setScalar(1.5);q.position.set(0,.74,0);ship.add(q);{const mound=sph(0,.55,.12,.4,12,M('#16120e',{roughness:.6}));mound.position.set(-.1,.62,0);ship.add(mound)}
 g.userData.anim=t=>{ship.rotation.x=Math.sin(t*.7)*.05;ship.rotation.z=Math.sin(t*.5+1)*.03;ship.position.y=Math.sin(t*.9)*.05;
  qw.forEach(x=>{x.w.rotation.x=x.z*(.15+Math.sin(t*2+x.k)*.12)});q.rotation.y=Math.sin(t*.3)*.4};
 return g}

/* ---------- 开拓者: a 73 m armoured worm, six across, the same thickness from end to end; no legs. its head is a
   ridged drill that is also its mouth and opens to show rows of hooked teeth; it digs by spinning its whole body.
   three 30 m helper worms ride in grooves let into its side armour ---------- */
function fxC_kaituo(){const g=new THREE.Group();const N=16,L=6.6,R=.3;
 const arm=detailMat(M('#5a4434',{roughness:.45,metalness:.25}).clone(),{bump:.6,freq:4}),seam=M('#2a1e16',{roughness:.6}),hm=M('#7a6656',{roughness:.5,metalness:.15}),hwm=M('#8a8a72',{roughness:.45});
 // the body lies along a gentle S; each armour ring turns about its own axis when it drills
 const path=new THREE.CatmullRomCurve3([V3(L/2,0,0),V3(L/6,0,.35),V3(-L/6,0,-.3),V3(-L/2,0,.15)]);const plen=path.getLength();
 const sg=new THREE.CylinderGeometry(R,R,plen/N*1.02,16,1).rotateZ(Math.PI/2),rg=new THREE.TorusGeometry(R*1.01,.028,4,18).rotateY(Math.PI/2);
 const grooveG=new THREE.BoxGeometry(plen/N*1.02,.04,.13),hwG=new THREE.CylinderGeometry(.06,.06,plen/N*1.03,8).rotateZ(Math.PI/2);
 const spin=[];const place=(o,u)=>{const p=path.getPointAt(u),tg=path.getTangentAt(u);o.position.set(p.x,R,p.z);o.rotation.y=-Math.atan2(-tg.z,-tg.x)};
 for(let i=0;i<N;i++){const s=new THREE.Group();place(s,(i+.5)/N);g.add(s);const c=new THREE.Group();s.add(c);spin.push(c);c.add(new THREE.Mesh(sg,arm));const r=new THREE.Mesh(rg,seam);r.position.x=plen/N*.5;c.add(r);
  for(let k=0;k<3;k++){const a=k/3*6.283;const gr=new THREE.Mesh(grooveG,seam);gr.position.set(0,Math.cos(a)*R*.96,Math.sin(a)*R*.96);gr.rotation.x=-a;c.add(gr);
   // the helper worms (about 30 m each, so a bit under half the length) lie in the grooves of the front half
   if(i>=1&&i<=7){const h=new THREE.Mesh(hwG,hwm);h.position.set(0,Math.cos(a)*R*1.0,Math.sin(a)*R*1.0);c.add(h);if(i===1){const wh=cone(.06,.16,hwm,8);wh.rotation.z=-Math.PI/2;wh.position.set(plen/N*.5+.08,Math.cos(a)*R,Math.sin(a)*R);c.add(wh)}}}}
 // the drill head: a cone with spiral ridges, split into three jaws that can part to show hooked teeth
 const hs=new THREE.Group();place(hs,0);hs.position.x+=.02;g.add(hs);const head=new THREE.Group();hs.add(head);spin.push(head);const jaws=[];
 for(let k=0;k<3;k++){const j=new THREE.Group();const geo=new THREE.ConeGeometry(R,1.05,12,4,false,k/3*6.283,6.283/3).rotateZ(-Math.PI/2).translate(.52,0,0);j.add(new THREE.Mesh(geo,hm));
  for(let s2=0;s2<3;s2++){const pts=[];for(let i=0;i<=8;i++){const u=i/8,a=k/3*6.283+u*2.1+s2*.7;const rr=R*(1-u)*1.02+.01;pts.push(V3(u*1.05,Math.cos(a)*rr,Math.sin(a)*rr))}j.add(tubeAlong(pts,.024,seam,10))}
  for(let i=0;i<5;i++){const a=(k+.5)/3*6.283;const tt=cone(.035,.14,M('#e8dcc0'),4);const u=.12+i*.15;tt.position.set(u,Math.cos(a)*R*(1-u)*.75,Math.sin(a)*R*(1-u)*.75);tt.rotation.set(-a+Math.PI,0,-.6);j.add(tt)}
  head.add(j);jaws.push({j,a:(k+.5)/3*6.283})}
 head.add(sph(0,.05,R*.85,R*.85,12,M('#3a1418',{roughness:.6})));
 const ey=sph(0,.05,.05,.05,8,GL('#ffe8a0'));ey.position.set(.3,.2,0);head.add(ey);const lamp=glowSprite('#ffe0a0',.8,.4);lamp.position.set(1.2,0,0);hs.add(lamp);
 const ts=new THREE.Group();place(ts,1);g.add(ts);ts.add(sph(0,.12,R,R,12,arm));
 g.add(shadow(1.6));
 const grit=emitter({n:50,life:1.2,speed:1.6,spread:.9,size:.5,dir:[1,.3,0],col:'#9a8a70',op:.55,add:false,tex:smokeTex,area:[.3,.3,.3]});grit.position.set(L/2+1,R,0);g.add(grit);
 g.userData.anim=t=>{const sp=t*2.2;spin.forEach(c=>c.rotation.x=sp);
  const op=Math.max(0,Math.sin(t*.8+.6))**3;jaws.forEach(x=>{x.j.position.set(0,Math.cos(x.a)*op*.12,Math.sin(x.a)*op*.12);x.j.rotation.set(0,-Math.sin(x.a)*op*.4,Math.cos(x.a)*op*.4)})};
 g.userData.anim(0);return g}

/* ---------- 圆盾蠕虫: a hard half-dome of a head it smashes ice with, the mouth a hole ringed with small blades; a long
   tube of a body ridged like a screw thread; ten jointed limbs, all under the head, each ending in a toothed pincer ---------- */
function fxC_yuandun(){const g=new THREE.Group();const dome=detailMat(M('#8e8678',{roughness:.4,metalness:.15}).clone(),{bump:.5,freq:3}),skin=M('#8a7664',{roughness:.55}),ridge=M('#5e4e40',{roughness:.5}),lim=M('#6e6456',{roughness:.4,metalness:.1}),bl=M('#efe6d0',{metalness:.3,roughness:.3});
 const hd=new THREE.Group();hd.position.set(1.25,1.05,0);g.add(hd);
 const dm=new THREE.Mesh(new THREE.SphereGeometry(.85,28,12,0,Math.PI*2,0,Math.PI/2),dome);dm.rotation.z=-Math.PI/2;dm.scale.set(1,.62,1);hd.add(dm);
 for(let i=1;i<4;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(.85*Math.sin(i*.36),.018,4,32),ridge);r.rotation.y=Math.PI/2;r.position.x=.53*Math.cos(i*.36);hd.add(r)}
 const back=new THREE.Mesh(new THREE.CircleGeometry(.85,28),M('#5a4c40'));back.rotation.y=-Math.PI/2;hd.add(back);
 const mouth=new THREE.Mesh(new THREE.CircleGeometry(.2,18),M('#1a0808'));mouth.rotation.y=Math.PI/2;mouth.position.x=.525;hd.add(mouth);
 for(let i=0;i<14;i++){const a=i/14*6.28;const b=cone(.035,.16,bl,3);b.position.set(.52,Math.cos(a)*.21,Math.sin(a)*.21);b.quaternion.copy(fxC_q(V3(.5,-Math.cos(a),-Math.sin(a))));hd.add(b)}
 // the body: one long cylinder with a raised screw-thread ridge, trailing back and bending away
 const pts=[];for(let i=0;i<=10;i++){const u=i/10;pts.push(V3(1.15-u*5.6,.95-u*.45+Math.sin(u*4)*.05,Math.sin(u*3.2)*.55))}
 const cu=new THREE.CatmullRomCurve3(pts);g.add(new THREE.Mesh(new THREE.TubeGeometry(cu,60,.45,14,false),skin));
 const sp=[];const fr=cu.computeFrenetFrames(400,false);for(let i=0;i<=400;i++){const u=i/400,a=u*120;const c=cu.getPointAt(u);sp.push(c.clone().addScaledVector(fr.normals[i],Math.cos(a)*.455).addScaledVector(fr.binormals[i],Math.sin(a)*.455))}
 g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(sp),900,.05,4,false),ridge));
 const endc=sph(0,.45,.45,.45,10,skin);endc.position.copy(pts[10]);g.add(endc);
 // ten jointed limbs, five a side, all set under the rim of the head, each ending in a pincer with teeth on its inner edges
 const L=[];for(let k=0;k<5;k++)for(const z of[-1,1]){const a=(k-2)/2*1.0;const l=leg2(.55,.6,.055,lim,-1.1);l.position.set(1.15,.62+Math.abs(k-2)*.06,z*(.12+k*.1));l.rotation.set(z*(.35+k*.12),0,.55-k*.12);g.add(l);
  const pin=new THREE.Group();for(const s of[-1,1]){const p=cone(.04,.26,lim,4);p.position.set(0,-.12,s*.045);p.rotation.set(Math.PI+s*.3,0,0);pin.add(p);for(let i=0;i<3;i++){const tt=cone(.012,.05,bl,3);tt.position.set(0,-.06-i*.05,s*.02);tt.rotation.x=-s*Math.PI/2;pin.add(tt)}}
  pin.position.y=-.6;l.userData.knee.add(pin);L.push({m:l,ph:k*.9+(z>0?0:Math.PI),a:.22,k:-1.1})}
 addLegs(g,L);g.add(shadow(2,-1));stdAnim(g,{fq:3,amp:.3});return g}

/* ---------- 螳螂虾 (the land-going one): six metres, grey and half see-through shell, eyes coloured like a rainbow on
   stalks, thick walking limbs on its sides, swimming legs grown sturdy, a tail it coils before launching itself ---------- */
function fxC_rainbowEye(){const geo=new THREE.SphereGeometry(1,14,10);const p=geo.attributes.position,c=new Float32Array(p.count*3),t=new THREE.Color();
 for(let i=0;i<p.count;i++){const y=p.getY(i);t.setHSL(((y+1)*.42+.02)%1,.85,.55);c.set([t.r,t.g,t.b],i*3)}geo.setAttribute('color',new THREE.BufferAttribute(c,3));return geo}
let _fxC_rbe=null;
function fxC_tanglangxia(){const g=new THREE.Group();
 const shell=new THREE.MeshStandardMaterial({color:'#7e868e',transparent:true,opacity:.6,roughness:.15,metalness:.2}),inner=M('#6a5a5e',{roughness:.6}),lim=new THREE.MeshStandardMaterial({color:'#7a8088',transparent:true,opacity:.85,roughness:.2,metalness:.15});
 const body=new THREE.Group();body.position.y=.7;g.add(body);
 // inner flesh glimpsed through the shell
 const fl=sph(0,1.1,.22,.25,12,inner);fl.position.x=-.1;body.add(fl);
 const segs=[];for(let i=0;i<8;i++){const s=sph(0,.24,.27-i*.012,.36-i*.018,14,shell);s.position.set(.85-i*.3,0,0);body.add(s);segs.push(s)}
 const cara=sph(0,.42,.2,.34,14,shell);cara.position.set(.95,.1,0);body.add(cara);
 const tail=new THREE.Group();tail.position.set(-1.45,0,0);body.add(tail);const tf=new THREE.Mesh(wingGeo(.55,.55,'fin').rotateX(-Math.PI/2),new THREE.MeshStandardMaterial({color:'#9aa2aa',transparent:true,opacity:.75,side:THREE.DoubleSide,roughness:.2}));tf.rotation.y=Math.PI;tf.position.x=-.1;tail.add(tf);
 for(const z of[-1,1]){const u=new THREE.Mesh(wingGeo(.35,.3,'fin').rotateX(-Math.PI/2),tf.material);u.rotation.y=Math.PI+z*.5;tail.add(u)}
 _fxC_rbe=_fxC_rbe||fxC_rainbowEye();const em=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.05,metalness:.3,emissive:'#202030',emissiveIntensity:.3});
 const eyes=[];for(const z of[-1,1]){const st=cyl(.035,.045,.3,lim,6);st.position.set(1.3,.32,z*.1);st.rotation.set(z*.35,0,-.3);body.add(st);const e=new THREE.Mesh(_fxC_rbe,em);e.scale.set(.09,.12,.09);e.position.set(1.36,.48,z*.16);body.add(e);eyes.push(e)}
 for(const z of[-1,1])body.add(tubeAlong([V3(1.3,.1,z*.08),V3(1.7,.25,z*.3),V3(2.1,.15,z*.5)],.012,lim,8));
 // raptorial claws folded under the head
 const claws=[];for(const z of[-1,1]){const c=leg2(.38,.42,.07,lim,-2.6);c.position.set(1.1,-.05,z*.2);c.rotation.set(z*.2,0,-1.1);body.add(c);const club=sph(0,.09,.07,.07,8,lim);club.position.y=-.42;c.userData.knee.add(club);claws.push(c)}
 // thick walking limbs on the sides, and sturdy flattened swimmerets behind
 const L=[];for(let k=0;k<3;k++)for(const z of[-1,1]){const l=leg2(.45,.5,.075,lim,.9);l.position.set(.7-k*.3,-.05,z*.3);l.rotation.x=z*.9;body.add(l);L.push({m:l,ph:k*1.3+(z>0?0:Math.PI),a:.35})}
 for(let k=0;k<4;k++)for(const z of[-1,1]){const l=leg2(.3,.32,.07,lim,.6);l.children[0].scale.set(1.4,1,.5);l.position.set(-.25-k*.27,-.1,z*.25);l.rotation.x=z*.7;body.add(l);L.push({m:l,ph:k+.5+(z>0?0:Math.PI),a:.3})}
 addLegs(g,L);g.add(shadow(1.6));
 stdAnim(g,{fq:4,amp:.3,extra:t=>{const c=Math.max(0,Math.sin(t*.6));tail.rotation.z=-c*1.2;segs.forEach((s,i)=>{if(i>3)s.position.y=-c*(i-3)*.03});claws.forEach((c2,i)=>c2.rotation.z=-1.1+Math.max(0,Math.sin(t*1.1+i))**8*1.4);eyes.forEach((e,i)=>e.rotation.y=Math.sin(t*1.3+i*2)*.6)}});
 return g}

/* ---------- 死亡尖刺: a straight row of purple trunks a metre thick and fifty tall, reaching from the cave floor to its
   roof, bristling with red spikes so sticky that whatever touches them is held and slowly dissolved ---------- */
function fxC_siwang(){const g=new THREE.Group();const bark=detailMat(M('#5a2a6a',{roughness:.6}).clone(),{bump:.8,freq:5}),rock=detailMat(M('#5a544c',{roughness:.95,flatShading:true}).clone(),{bump:1.2,freq:3});
 const spk=new THREE.MeshStandardMaterial({color:'#c8202a',roughness:.15,metalness:.1,emissive:'#4a0808',emissiveIntensity:.3});const sg=new THREE.ConeGeometry(.035,.32,4);
 const H=6.2,list=[],stuck=[];
 for(let i=0;i<9;i++){const x=(i-4)*.62,z=(h3(i,1,5)-.5)*.18;const r=.11+h3(i,2,5)*.03;const tr=cyl(r*.9,r*1.15,H,bark,8);tr.position.set(x,H/2,z);g.add(tr);
  const fo=cyl(r*1.15,r*1.8,.4,bark,8);fo.position.set(x,.2,z);g.add(fo);const fo2=cyl(r*1.9,r*.9,.5,bark,8);fo2.position.set(x,H-.25,z);g.add(fo2);
  for(let k=0;k<46;k++){const y=.4+h3(i,k,7)*(H-.9),a=h3(k,i,8)*6.28;const d=V3(Math.cos(a),(h3(i,k,9)-.5)*.6,Math.sin(a));list.push([V3(x+Math.cos(a)*r,y,z+Math.sin(a)*r).addScaledVector(d.clone().normalize(),.14),fxC_q(d),.8+h3(k,i,3)*.5])}
  if(i%3===1){const y=1+h3(i,3,3)*3;stuck.push([x+.22,y,z+.05])}}
 g.add(fxC_inst(sg,spk,list));
 // the cave roof the trunks hold up
 const roof=new THREE.Mesh(new THREE.BoxGeometry(6.6,.35,1.1,8,1,2),rock);roof.position.set(0,H+.1,0);g.add(roof);
 for(let i=0;i<7;i++){const s=new THREE.Mesh(kd(.25+h3(i,1,6)*.15),rock);s.scale.y=1.8;s.position.set((i-3)*.95+.2,H-.25,(h3(i,2,6)-.5)*.6);g.add(s)}
 // golden dragonflies caught on the spikes
 const df=M('#c8a030',{roughness:.3,metalness:.4}),dw=new THREE.MeshStandardMaterial({color:'#f4e8b0',transparent:true,opacity:.5,side:THREE.DoubleSide,depthWrite:false});
 stuck.forEach(([x,y,z],i)=>{const d=new THREE.Group();d.add(sph(0,.16,.035,.035,8,df));for(const s of[-1,1]){const w=new THREE.Mesh(new THREE.PlaneGeometry(.12,.3),dw);w.position.set(.03,.01,s*.16);w.rotation.x=Math.PI/2;d.add(w)}d.position.set(x,y,z);d.rotation.set(.4,1.2+i,.9);g.add(d)});
 // black bees tending the roots
 const bee=M('#141210',{roughness:.35,metalness:.2});const bees=[];for(let i=0;i<4;i++){const b=grp(sph(0,.09,.05,.06,8,bee),at(sph(0,.05,.04,.045,8,bee),.1,0,0));b.position.set((i-1.5)*1.3,.06,.45);g.add(b);bees.push(b)}
 g.add(shadow(3.4));
 g.userData.anim=t=>bees.forEach((b,i)=>{b.position.x=(i-1.5)*1.3+Math.sin(t*.7+i*2)*.4;b.rotation.y=Math.cos(t*.7+i*2)>0?Math.PI:0});return g}

/* ---------- 蔓藤蕨: a fern with no leaves at all, only bending green stalks like tentacles, a hand's breadth thick and ten
   to fifteen metres tall, grown so thick it turned a desert green ---------- */
function fxC_manteng(){const g=new THREE.Group();const cols=['#4a8a34','#5a9a3c','#6aa844','#3f7a2e'];const mats=cols.map(c=>M(c,{roughness:.6}));const st=[];
 for(let i=0;i<34;i++){const r=Math.sqrt(h3(i,1,4))*2.2,a=h3(i,2,4)*6.28;const x=Math.cos(a)*r,z=Math.sin(a)*r;const h=3.2+h3(i,3,4)*1.6;const ba=h3(i,4,4)*6.28,bend=.5+h3(i,5,4)*.9;
  const pts=[];for(let k=0;k<=6;k++){const u=k/6;const lean=Math.pow(u,1.6)*bend;pts.push(V3(Math.cos(ba)*lean+Math.sin(u*5+i)*.06,u*h-Math.pow(u,3)*bend*.4,Math.sin(ba)*lean))}
  // the tip curls over like a tentacle
  const e=pts[6],d=V3(Math.cos(ba),0,Math.sin(ba));pts.push(e.clone().addScaledVector(d,.25).add(V3(0,-.12,0)),e.clone().addScaledVector(d,.3).add(V3(0,-.38,0)));
  const m=new THREE.Mesh(fxC_taper(pts,.09,.018,18,6),mats[i%4]);const s=new THREE.Group();s.add(m);s.position.set(x,0,z);g.add(s);st.push(s)}
 const ground=new THREE.Mesh(new THREE.CircleGeometry(2.8,24),M('#c8b07a',{roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=.02;g.add(ground);
 g.userData.anim=t=>st.forEach((s,i)=>{s.rotation.z=Math.sin(t*.9+i*.7)*.04;s.rotation.x=Math.cos(t*.7+i)*.03});return g}

ENT.chibcha=[fxC_chibcha,1];
ENT.mtzm2=[fxC_mtzm2,1.6,{alt:.3,sea:1}];
ENT.kaituo=[fxC_kaituo,1.8];
ENT.yuandun=[fxC_yuandun,1.8];
ENT.tanglangxia=[fxC_tanglangxia,1.4,{sea:1}];
ENT.shijun=[()=>{const g=bAmoeba({col:'#3a9ad8'});const s=bScorpion({w:'x',col:'#7a9a5a'});s.scale.setScalar(.4);s.position.set(2,0,0);g.add(s);return g},1.4];
ENT.siwangjianci=[fxC_siwang,1.6];
ENT.manteng=[fxC_manteng,3];

/* ---------- 鳞甲虫 and 锯蜓: the first a four-metre grazer, an oval body shingled with square plates like a trilobite,
   shovelling ferns with thick legs; the second a huge flyer with four broad leaf-like wings (butterfly rather than
   dragonfly), a narrow body about two metres across and five long, big eyes, three coiled saw-toothed feeding tentacles
   at its mouth and hooked legs beneath to grab with ---------- */
function fxC_scaleBug(col,col2){const g=new THREE.Group();const sh=M(col,{roughness:.4,metalness:.15}),dk=M(col2,{roughness:.55}),lg=M('#3a3424',{roughness:.5});
 const body=new THREE.Group();body.position.y=.42;g.add(body);
 const under=sph(0,.62,.2,.42,14,dk);body.add(under);
 // rows of square plates across the back, three lobes like a trilobite
 const pg=new THREE.BoxGeometry(.17,.05,.15);const pl=[];
 for(let r=0;r<7;r++){const x=.5-r*.16;const w=.42*Math.sqrt(Math.max(.05,1-Math.pow(x/.66,2)));const n=5;
  for(let c=0;c<n;c++){const zz=(c/(n-1)-.5)*2*w*.9;const ang=Math.asin(Math.max(-.95,Math.min(.95,zz/(w+.01))));const y=.18*Math.cos(ang)*Math.sqrt(Math.max(0,1-Math.pow(x/.7,2)))+.03;
   pl.push([V3(x,y,zz),[ang*.9,0,-x*.25],V3(1,1,(w*1.9/n)/.15*1.05)])}}
 body.add(fxC_inst(pg,sh,pl));
 const head=new THREE.Mesh(new THREE.SphereGeometry(.36,16,8,0,Math.PI*2,0,Math.PI/2),sh);head.scale.set(.75,.45,1.05);head.position.set(.62,-.02,0);body.add(head);
 for(const z of[-1,1]){const e=sph(0,.04,.03,.04,8,M('#141410',{roughness:.1}));e.position.set(.72,.1,z*.15);body.add(e)}
 const tl=sph(0,.12,.06,.18,10,sh);tl.position.set(-.62,0,0);body.add(tl);
 const L=[];for(let k=0;k<5;k++)for(const z of[-1,1]){const l=leg2(.2,.25,.045,lg,.7);l.position.set(.4-k*.2,-.05,z*.3);l.rotation.x=z*.9;body.add(l);L.push({m:l,ph:k*.8+(z>0?0:Math.PI),a:.35})}
 addLegs(g,L);g.add(shadow(.8));stdAnim(g,{fq:5,amp:.25,extra:t=>{head.rotation.z=-.1+Math.sin(t*2.2)*.12}});return g}
function fxC_sawFly(){const g=new THREE.Group();const sk=M('#4a4a36',{roughness:.45}),dk=M('#2a2a1e',{roughness:.4});
 const th=sph(0,.42,.22,.26,14,sk);g.add(th);const ab=sph(0,.7,.17,.2,14,sk);ab.position.x=-.95;g.add(ab);
 for(let i=0;i<5;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(.18-i*.02,.012,4,14),dk);r.rotation.y=Math.PI/2;r.position.x=-.5-i*.22;g.add(r)}
 const hd=sph(0,.2,.18,.22,12,sk);hd.position.x=.5;g.add(hd);
 for(const z of[-1,1]){const e=sph(0,.12,.12,.11,12,M('#1a1418',{roughness:.05,metalness:.4}));e.position.set(.56,.06,z*.17);g.add(e)}
 // three coiled tentacles at the mouth, saw-teeth along them
 const tm=M('#6a5a3a',{roughness:.5}),tt=M('#e8dcc0');const tent=[];for(let k=0;k<3;k++){const a=k/3*6.28;const tg2=new THREE.Group();const pts=[];
  for(let i=0;i<=14;i++){const u=i/14,ang=u*7+a;const r=.04+u*.05;pts.push(V3(u*.35+.02,-u*.12+Math.cos(ang)*r,Math.sin(ang)*r))}tg2.add(new THREE.Mesh(fxC_taper(pts,.025,.012,28,5),tm));
  for(let i=2;i<14;i+=2){const s=cone(.008,.03,tt,3);s.position.copy(pts[i]);s.rotation.z=-1;tg2.add(s)}tg2.position.set(.66,-.06,(k-1)*.03);g.add(tg2);tent.push(tg2)}
 // hooked legs folded under
 for(let k=0;k<3;k++)for(const z of[-1,1]){const l=leg2(.12,.14,.025,dk,-1.6);l.position.set(.15-k*.15,-.15,z*.12);l.rotation.set(z*.4,0,.5);g.add(l);const h=cone(.02,.07,dk,4);h.position.y=-.15;h.rotation.z=2.2;l.userData.knee.add(h)}
 // four broad leaf-shaped wings
 const wm=M('#9a7a42',{side:THREE.DoubleSide,roughness:.7});const vm=M('#4a3a22');const spm=M('#3a2a1a',{side:THREE.DoubleSide});const W=[];
 const wg=(span,chord)=>{const s=new THREE.Shape();s.moveTo(0,0);s.bezierCurveTo(span*.25,chord*.9,span*.85,chord*.85,span,chord*.15);s.bezierCurveTo(span*.85,-chord*.6,span*.3,-chord*.55,0,-chord*.1);const geo=new THREE.ShapeGeometry(s,10);geo.rotateX(Math.PI/2);geo.rotateY(-Math.PI/2);return geo};
 [[.15,2.2,1.2,0],[-.3,1.7,1,1]].forEach(([x,span,ch,k])=>{for(const z of[-1,1]){const w=new THREE.Group();const m=new THREE.Mesh(wg(span,ch),wm);w.add(m);
  for(let v=0;v<3;v++){const vv=tubeAlong([V3(0,.01,0),V3((v-1)*ch*.25,.01,span*.5),V3((v-1)*ch*.3,.01,span*.85)],.012,vm,6);w.add(vv)}const spot=new THREE.Mesh(new THREE.CircleGeometry(ch*.18,14),spm);spot.rotation.x=-Math.PI/2;spot.position.set(-ch*.05,.015,span*.62);w.add(spot);
  w.position.set(x,.12,z*.15);w.rotation.y=k?.45:-.2;if(z<0)w.scale.z=-1;g.add(w);W.push({m:w,s:z,a:.5,f:2.2,ph:k*.6})}});
 addWings(g,W);stdAnim(g,{wf:2.2,wa:.5,extra:t=>tent.forEach((x,i)=>x.rotation.x=Math.sin(t*3+i*2)*.4)});g.userData.noSkin=1;return g}
function fxC_linjia(){const g=new THREE.Group();const a=fxC_scaleBug('#6e6a4a','#4a4430');a.position.set(0,0,-.7);g.add(a);const b=fxC_scaleBug('#7a6e4e','#4a4430');b.position.set(-1.3,0,.8);b.rotation.y=.9;g.add(b);
 const fernG=G([[new THREE.ConeGeometry(.05,.3,3).translate(0,.15,0),'#5a8a3a'],[new THREE.ConeGeometry(.05,.25,3).translate(0,.12,0).rotateZ(.5),'#6a9a44'],[new THREE.ConeGeometry(.05,.25,3).translate(0,.12,0).rotateZ(-.5),'#4a7a30']]);
 const fl=[];for(let i=0;i<60;i++)fl.push([V3((h3(i,1,3)-.5)*5,0,(h3(i,2,3)-.5)*4),[0,h3(i,3,3)*6,0],.8+h3(i,4,3)*.8]);g.add(fxC_inst(fernG,M('#ffffff',{vertexColors:true}),fl));
 const f=fxC_sawFly();f.scale.setScalar(.8);g.add(f);
 g.userData.anim=t=>{a.userData.anim(t);b.userData.anim(t+1.3);const u=t*.45;f.position.set(Math.cos(u)*2.2,2.3+Math.sin(t*1.1)*.25,Math.sin(u)*2.2);f.rotation.set(0,-u-Math.PI/2,Math.sin(u*2)*.1);f.userData.anim(t)};g.userData.anim(0);return g}

/* ---------- 黑蜂 · 肥虫 · 眼虫: eyeless black-shelled bees that feel their way with antennae and carry the others about;
   fat oval worms with no legs of their own, riding on the bees' backs and spitting sticky threads; and the eye-bug,
   a swollen silver-white lump half a metre long with one huge eye, also carried by bees ---------- */
function fxC_bee(sh,wm){const b=new THREE.Group();b.scale.setScalar(1.45);const ab=sph(0,.16,.1,.11,10,sh);ab.position.set(-.14,.12,0);b.add(ab);const th=sph(0,.09,.08,.08,10,sh);th.position.y=.13;b.add(th);
 const hd=sph(0,.06,.055,.065,8,sh);hd.position.set(.12,.12,0);b.add(hd);
 for(const z of[-1,1]){const md=cone(.012,.06,sh,3);md.rotation.set(z*.4,0,-Math.PI/2-.3);md.position.set(.18,.09,z*.025);b.add(md);b.add(tubeAlong([V3(.15,.16,z*.02),V3(.22,.24,z*.06),V3(.3,.25,z*.1)],.005,sh,6));
  const w=new THREE.Mesh(new THREE.PlaneGeometry(.26,.08),wm);w.rotation.set(-Math.PI/2,0,z*.25);w.position.set(-.12,.2,z*.06);b.add(w)}
 const L=[];for(let k=0;k<3;k++)for(const z of[-1,1]){const l=leg2(.07,.09,.01,sh,.8);l.position.set(.04-k*.04,.11,z*.05);l.rotation.x=z*1;b.add(l);L.push({m:l,ph:k*2+(z>0?0:Math.PI),a:.5})}
 b.userData.L=L;return b}
function fxC_heifeng(){const g=new THREE.Group();const sh=M('#121110',{roughness:.3,metalness:.3}),wm=new THREE.MeshStandardMaterial({color:'#4a4a52',transparent:true,opacity:.7,side:THREE.DoubleSide,depthWrite:false,roughness:.3});
 const teams=[],L=[];const team=(cargo,n,x,z,ry)=>{const t=new THREE.Group();for(let i=0;i<n;i++){const b=fxC_bee(sh,wm);b.position.set((i%2?-1:1)*.15,0,(i-(n-1)/2)*.28);t.add(b);b.userData.L.forEach(l=>L.push(Object.assign({},l,{ph:l.ph+i+x})))}
  cargo.position.y=.42;t.add(cargo);t.position.set(x,0,z);t.rotation.y=ry;g.add(t);teams.push(t);return t};
 // the eye-bug
 const eb=new THREE.Group();const lump=new THREE.Mesh(new THREE.IcosahedronGeometry(1,3),M('#e8eaee',{roughness:.3,metalness:.35}));lump.scale.set(.3,.22,.24);eb.add(lump);
 for(let i=0;i<5;i++){const s=sph(0,.09,.07,.08,8,lump.material);s.position.set((h3(i,1,1)-.5)*.35,.06+h3(i,2,1)*.08,(h3(i,3,1)-.5)*.3);eb.add(s)}
 const eyeW=sph(0,.2,.2,.2,18,M('#f6f2e4',{roughness:.06}));eyeW.position.set(.16,.1,0);eb.add(eyeW);const iris=sph(0,.06,.13,.13,14,M('#7a5018',{roughness:.1}));iris.position.set(.33,.1,0);eb.add(iris);const pu=sph(0,.03,.07,.07,12,M('#060606',{roughness:.05}));pu.position.set(.375,.1,0);eb.add(pu);
 team(eb,4,0,0,0);
 // two fat worms, each spitting a sticky thread up at the sky
 const fm=M('#e4d8b8',{roughness:.5}),silk=new THREE.MeshBasicMaterial({color:'#fbf8f0',transparent:true,opacity:.85});const threads=[];
 [[-.9,-.9,.6],[.8,-1.1,-.4]].forEach(([x,z,ry],k)=>{const w=new THREE.Group();const bd=sph(0,.42,.17,.18,14,fm);w.add(bd);for(let i=0;i<6;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(1,.06,4,16),M('#b8a47c'));r.rotation.y=Math.PI/2;const x=-.3+i*.12;const k=Math.sqrt(1-Math.pow(x/.42,2));r.scale.set(.18*k,.17*k,1);r.position.x=x;w.add(r)}
  const mo=new THREE.Mesh(new THREE.CircleGeometry(.05,10),M('#5a3a2a'));mo.position.set(.4,.06,0);mo.rotation.set(0,1.2,0);mo.rotation.z=.6;w.add(mo);w.rotation.z=.5;
  const tl=team(w,3,x,z,ry);const ln=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V3(.4,.6,0),V3(.8,1.4,.05),V3(1.1,2.4,0)]),12,.012,4,false),silk);tl.add(ln);threads.push(ln)});
 // a few loose bees dragging prey
 const loose=[];for(let i=0;i<3;i++){const b=fxC_bee(sh,wm);g.add(b);loose.push(b);b.userData.L.forEach(l=>L.push(Object.assign({},l,{ph:l.ph+i*3})))}
 addLegs(g,L);g.add(shadow(1.6));
 stdAnim(g,{fq:12,amp:.4,extra:t=>{teams.forEach((tm,i)=>{tm.position.y=Math.abs(Math.sin(t*6+i))*.01});eyeW.rotation.y=Math.sin(t*.8)*.5;iris.position.z=Math.sin(t*.8)*.04;pu.position.z=iris.position.z*1.05;
  threads.forEach((l,i)=>{l.visible=Math.sin(t*1.4+i*2)>-.3});loose.forEach((b,i)=>{const a=t*.4+i*2.1;b.position.set(Math.cos(a)*1.5,0,Math.sin(a)*1.3);b.rotation.y=-a-Math.PI/2})}});
 return g}

/* ---------- 暗影怪: built unlike the other swarm types: lizard-like, armoured all over in black chitin, long legs, two blade
   claws on each front foot, a very long tail and a big head (a bigger brain); about two metres; fast and secretive ---------- */
function fxC_anying(){const g=new THREE.Group();const sh=M('#151518',{roughness:.28,metalness:.35}),pl=M('#24242a',{roughness:.35,metalness:.3}),bl=M('#8a8a96',{roughness:.15,metalness:.7});
 const body=new THREE.Group();body.position.y=.42;g.add(body);
 const tor=sph(0,.42,.15,.15,14,sh);body.add(tor);for(let i=0;i<6;i++){const p=new THREE.Mesh(kb(.12,.04,.18-i*.01),pl);p.position.set(.32-i*.13,.13,0);p.rotation.z=-.1;body.add(p)}
 const nk=sph(0,.14,.08,.08,10,sh);nk.position.set(.48,.06,0);body.add(nk);
 const hd=new THREE.Group();hd.position.set(.72,.1,0);body.add(hd);const sk=sph(0,.26,.17,.19,14,sh);hd.add(sk);const sn=sph(0,.17,.09,.12,10,sh);sn.position.set(.22,-.04,0);hd.add(sn);
 const crest=sph(0,.22,.08,.16,10,pl);crest.position.set(-.03,.12,0);hd.add(crest);for(const z of[-1,1]){const e=sph(0,.025,.02,.025,8,M('#3a3020',{roughness:.05,metalness:.5}));e.position.set(.17,.05,z*.12);hd.add(e)}
 const tail=new THREE.Group();tail.position.set(-.4,0,0);body.add(tail);const tp=[];for(let i=0;i<=8;i++)tp.push(V3(-i*.2,-i*.04+Math.sin(i*.5)*.04,0));const tm=new THREE.Mesh(fxC_taper(tp,.1,.015,24,6),sh);tail.add(tm);
 const L=[];for(const z of[-1,1]){const f=leg2(.36,.38,.045,sh,-.7);f.position.set(.32,-.02,z*.13);f.rotation.set(z*.7,0,.45+(z>0?.25:-.1));body.add(f);
  for(const s of[-1,1]){const c=new THREE.Mesh(fxC_taper([V3(0,0,0),V3(.13,-.05,0),V3(.27,.04,0)],.025,.002,8,4),bl);c.position.set(.02,-.37,s*.03);f.userData.knee.add(c)}
  const r=leg2(.4,.42,.05,sh,.9);r.position.set(-.3,-.02,z*.13);r.rotation.set(z*.7,0,-.35+(z>0?-.2:.15));body.add(r);
  L.push({m:f,ph:z>0?0:.6,a:.6},{m:r,ph:z>0?Math.PI:Math.PI+.6,a:.6})}
 addLegs(g,L);g.add(shadow(1));
 stdAnim(g,{fq:9,amp:.5,extra:t=>{body.position.y=.42+Math.abs(Math.sin(t*9))*.02;tail.rotation.y=Math.sin(t*4.5)*.18;tail.rotation.z=Math.sin(t*9)*.05;hd.rotation.y=Math.sin(t*.9)*.25}});return g}

/* ---------- 喷沙虫: a giant that gulps sand at the mouth, swells its abdomen with it and blasts it out of the abdomen's
   rear, as dust screens or as packed sand balls, turning the abdomen to aim (up at fliers, or to lob) ---------- */
function fxC_pensha(){const g=new THREE.Group();const sk=M('#a8865a',{roughness:.55}),dk=M('#6a4e34',{roughness:.5}),pale=M('#c8a878',{roughness:.6});
 const th=sph(0,.55,.42,.48,14,sk);th.position.set(.5,.95,0);g.add(th);for(let i=0;i<3;i++){const p=new THREE.Mesh(kb(.2,.06,.7),dk);p.position.set(.75-i*.25,1.34,0);p.rotation.z=-.1;g.add(p)}
 const hd=sph(0,.36,.32,.4,12,sk);hd.position.set(1.15,.8,0);g.add(hd);
 const mo=new THREE.Mesh(new THREE.TorusGeometry(.17,.05,6,14),dk);mo.rotation.y=Math.PI/2;mo.position.set(1.48,.66,0);g.add(mo);const mh=new THREE.Mesh(new THREE.CircleGeometry(.16,14),M('#2a1a10'));mh.rotation.y=Math.PI/2;mh.position.set(1.47,.66,0);g.add(mh);
 for(const z of[-1,1]){const md=cone(.06,.3,dk,4);md.position.set(1.52,.6,z*.18);md.rotation.set(z*.4,0,-Math.PI/2-.4);g.add(md)}
 // the abdomen, swollen with stored sand, ending in a nozzle at its rear
 const abd=new THREE.Group();abd.position.set(-.05,1.05,0);g.add(abd);const ab=sph(0,1.15,.85,.9,18,pale);ab.position.x=-1;abd.add(ab);
 for(let i=0;i<5;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(1,.035,4,24),dk);r.rotation.y=Math.PI/2;const x=-.35-i*.35;const k=Math.sqrt(Math.max(0,1-Math.pow((x+1)/1.15,2)));r.scale.set(.9*k,.85*k,1);r.position.x=x;abd.add(r)}
 const noz=new THREE.Group();noz.position.set(-2.12,.1,0);noz.rotation.z=-.5;abd.add(noz);const nz=cyl(.16,.3,.45,dk,10);nz.rotation.z=Math.PI/2;nz.position.x=-.12;noz.add(nz);
 const lip=new THREE.Mesh(new THREE.TorusGeometry(.16,.04,6,12),dk);lip.rotation.y=Math.PI/2;lip.position.x=-.35;noz.add(lip);const hole=new THREE.Mesh(new THREE.CircleGeometry(.15,12),M('#1a120a'));hole.rotation.y=-Math.PI/2;hole.position.x=-.34;noz.add(hole);
 const sp=emitter({n:140,life:2,speed:5,spread:.35,size:1.8,dir:[-1,.6,0],col:'#e0bb84',op:.55,add:false,tex:smokeTex,area:[.15,.15,.15]});sp.position.set(-2.5,1.4,0);g.add(sp);
 const L=[];for(let k=0;k<3;k++)for(const z of[-1,1]){const l=leg2(.6,.7,.07,dk,.9);l.position.set(.8-k*.3,.8,z*.4);l.rotation.x=z*.8;g.add(l);L.push({m:l,ph:k+(z>0?Math.PI:0),a:.25})}
 addLegs(g,L);g.add(shadow(1.8,-.6));
 stdAnim(g,{fq:3,amp:.25,extra:t=>{const k=(Math.sin(t*.9)+1)/2;ab.scale.set(1.15+k*.12,.85+k*.1,.9+k*.1);abd.rotation.z=Math.sin(t*.4)*.12}});return g}

/* ---------- 真菌领主: a huge fat larva of a lower body dragged along on eight pairs of legs, with a mantis-like upper body
   reared up four metres, three pairs of sharp claws, three big compound eyes on top of the head and antennae that give
   off signals; shell of the fungus's purple, the soft-looking belly in fact hard ---------- */
function fxC_zhenjun(){const g=new THREE.Group();const pur=M('#6a3a7a',{roughness:.35,metalness:.2}),belly=M('#7a5a82',{roughness:.4,metalness:.2}),dk=M('#3a2040',{roughness:.4});
 const segs=[];for(let i=0;i<7;i++){const r=.62-Math.abs(i-2)*.06;const s=sph(0,.34,r*.85,r,14,belly);s.position.set(-.1-i*.42,r*.8,0);g.add(s);segs.push(s);
  const band=new THREE.Mesh(new THREE.TorusGeometry(r*.98,.03,4,20),dk);band.rotation.y=Math.PI/2;band.scale.y=.85;band.position.copy(s.position).add(V3(.2,0,0));g.add(band)}
 const tip=sph(0,.3,.3,.32,10,belly);tip.position.set(-3.1,.3,0);g.add(tip);
 // eight pairs of short legs along the larva body
 const L=[];for(let k=0;k<8;k++)for(const z of[-1,1]){const l=leg2(.2,.22,.045,dk,.9);l.position.set(.1-k*.38,.3,z*.5);l.rotation.x=z*1.1;g.add(l);L.push({m:l,ph:k*.7+(z>0?0:Math.PI),a:.25})}
 // the reared mantis-like upper body
 const up=new THREE.Group();up.position.set(.25,.75,0);g.add(up);
 const t1=sph(0,.32,.5,.34,14,pur);t1.position.set(.05,.35,0);up.add(t1);const t2=sph(0,.24,.42,.26,12,pur);t2.position.set(.2,1.0,0);up.add(t2);
 const hd=new THREE.Group();hd.position.set(.34,1.5,0);up.add(hd);hd.add(sph(0,.26,.22,.26,12,pur));
 const ce=new THREE.MeshStandardMaterial({color:'#3a2a3a',roughness:.15,metalness:.4,flatShading:true});for(let i=0;i<3;i++){const e=new THREE.Mesh(new THREE.IcosahedronGeometry(.13,1),ce);e.position.set(.08+(i===1?-.08:0),.2,(i-1)*.15);hd.add(e)}
 for(const z of[-1,1]){hd.add(tubeAlong([V3(.15,.2,z*.06),V3(.45,.6,z*.2),V3(.7,.75,z*.35),V3(.95,.7,z*.42)],.012,dk,10));const md=cone(.04,.16,dk,4);md.position.set(.28,-.12,z*.06);md.rotation.z=-2.4;hd.add(md)}
 // three pairs of claws
 const arms=[];[[.95,.75],[.6,.62],[.25,.5]].forEach(([y,s],k)=>{for(const z of[-1,1]){const a=leg2(.55*s/.75,.6*s/.75,.06,pur,-1.9+k*.25);a.position.set(.3,y,z*(.26+k*.05));a.rotation.set(z*(.35+k*.3),0,1.2);up.add(a);
  const bl=cone(.05,.32*s/.75,M('#d8c8d8',{roughness:.3,metalness:.3}),4);bl.position.y=-.6*s/.75;bl.rotation.z=Math.PI;a.userData.knee.add(bl);
  for(let i=0;i<3;i++){const sp=cone(.012,.06,dk,3);sp.position.set(.04,-.15-i*.13,0);sp.rotation.z=-1.3;a.userData.knee.add(sp)}arms.push({a,k,z})}});
 addLegs(g,L);g.add(shadow(2.2,-1.2));
 stdAnim(g,{fq:3,amp:.25,extra:t=>{up.rotation.z=Math.sin(t*.6)*.06;hd.rotation.y=Math.sin(t*.5)*.3;arms.forEach(x=>x.a.rotation.z=1.2+Math.sin(t*1.5+x.k*1.1)*.2);segs.forEach((s,i)=>s.scale.y=1+Math.sin(t*2-i*.8)*.03)}});return g}

/* ---------- 伊卡: a stranded ancient squid wrapped in a cut-off piece of grey-brown shark skin, which keeps it (and its
   gills) from drying, holding a sharp stone; its water hole beside it ---------- */
function fxC_yika(){const g=bSquid({col:'#8a6a9a'});g.scale.setScalar(.9);
 const skin=detailMat(M('#7a7064',{roughness:.85,side:THREE.DoubleSide}).clone(),{bump:.6,freq:7});
 const wr=new THREE.Mesh(new THREE.CylinderGeometry(.24,.4,1.05,16,3,true,.4,5.4),skin);wr.rotation.z=Math.PI/2;wr.position.set(-.2,.02,0);g.add(wr);
 const pa=wr.geometry.attributes.position;for(let i=0;i<pa.count;i++){const y=pa.getY(i);if(Math.abs(y)>.5)pa.setY(i,y+(h3(i,1,2)-.5)*.12)}pa.needsUpdate=true;wr.geometry.computeVertexNormals();
 const belly=new THREE.Mesh(new THREE.CylinderGeometry(.245,.405,.9,10,1,true,3.5,1.2),M('#c8c0b0',{roughness:.8,side:THREE.DoubleSide}));belly.rotation.z=Math.PI/2;belly.position.copy(wr.position);g.add(belly);
 const fin=new THREE.Mesh(wingGeo(.35,.4,'fin').rotateX(-Math.PI/2).rotateY(Math.PI),skin);fin.position.set(-.1,.36,0);g.add(fin);
 const st=new THREE.Mesh(kd(.08),M('#8a8478',{flatShading:true}));st.scale.set(2,.8,.8);st.position.set(1.4,.1,.12);g.add(st);
 const pit=new THREE.Mesh(new THREE.CircleGeometry(1.4,24),new THREE.MeshStandardMaterial({color:'#3a6a8a',roughness:.05,metalness:.2}));pit.rotation.x=-Math.PI/2;pit.position.set(-1.8,.04,.8);
 const w=grp(g,pit,shadow(1.3));w.userData.anim=t=>g.userData.anim&&g.userData.anim(t);g.position.y=.4;return w}

/* ---------- 粘蝎: a scorpion-like ranged trooper of the swarm whose curled tail ends not in a sting but in a gun-mouth,
   lobbing balls of glue that nothing can dissolve ---------- */
function fxC_zhanxie(){const g=new THREE.Group();const sh=M('#3a3028',{roughness:.35,metalness:.2}),pl=M('#2a221c',{roughness:.4});
 for(let i=0;i<4;i++){const s=sph(0,.34,.2,.32,12,sh);s.position.set(.75-i*.36,.45,0);g.add(s);const p=new THREE.Mesh(kb(.28,.04,.56),pl);p.position.set(.75-i*.36,.62,0);g.add(p)}
 const hd=sph(0,.28,.17,.28,10,sh);hd.position.set(1.15,.43,0);g.add(hd);
 const L=[];for(let k=0;k<4;k++)for(const z of[-1,1]){const l=leg2(.42,.46,.04,sh,.9);l.position.set(.7-k*.34,.45,z*.3);l.rotation.x=z;g.add(l);L.push({m:l,ph:k*1.1+(z>0?Math.PI:0),a:.45})}
 for(const z of[-1,1]){const a=leg2(.36,.32,.05,sh,-1.2);a.position.set(1.15,.45,z*.24);a.rotation.set(z*.5,0,-1.2);g.add(a);const cl=sph(0,.18,.08,.11,8,sh);cl.position.y=-.7;a.userData.knee.add(cl)}
 // the tail arches up over the back and ends in a barrel pointing forward
 const tl=new THREE.Group();tl.position.set(-.45,.5,0);g.add(tl);const tp=[V3(0,0,0),V3(-.35,.25,0),V3(-.45,.75,0),V3(-.2,1.1,0),V3(.15,1.2,0)];tl.add(new THREE.Mesh(fxC_taper(tp,.13,.09,20,8),sh));
 for(let i=1;i<5;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(.11,.02,4,12),pl);const c=new THREE.CatmullRomCurve3(tp);const u=i/5;r.position.copy(c.getPointAt(u));r.quaternion.setFromUnitVectors(V3(0,0,1),c.getTangentAt(u));tl.add(r)}
 const bar=cyl(.1,.14,.36,sh,10);bar.rotation.z=-Math.PI/2;bar.position.set(.32,1.2,0);tl.add(bar);const mz=new THREE.Mesh(new THREE.TorusGeometry(.1,.03,6,12),pl);mz.rotation.y=Math.PI/2;mz.position.set(.5,1.2,0);tl.add(mz);
 const ho=new THREE.Mesh(new THREE.CircleGeometry(.08,10),M('#0a0806'));ho.rotation.y=Math.PI/2;ho.position.set(.51,1.2,0);tl.add(ho);
 const ball=sph(0,.11,.11,.11,10,new THREE.MeshStandardMaterial({color:'#d8e8a0',roughness:.15,emissive:'#5a6a20',emissiveIntensity:.2}));g.add(ball);
 addLegs(g,L);g.add(shadow(1.1));
 stdAnim(g,{fq:8,amp:.35,extra:t=>{const q=(t*.5)%1;const rec=q<.08?Math.sin(q/.08*Math.PI)*.12:0;tl.rotation.z=-rec;tl.rotation.y=Math.sin(t*.7)*.1;
  ball.visible=q<.7;const x=.05+q*4.5;ball.position.set(x,1.7+q*1.6-q*q*4.2,0)}});return g}

/* ---------- 爆炸尖球: a plant like a ball on the ground about a metre across, crowded with ten-centimetre green spikes
   (themselves bristling with finer ones); when something passes close, the spikes shoot out and pierce it ---------- */
function fxC_baozha(){const g=new THREE.Group();const b=sph(0,.9,.86,.9,18,M('#4a6a2a',{roughness:.6}));b.position.y=.88;g.add(b);
 const sg=mergeColored([[new THREE.ConeGeometry(.022,.15,4).translate(0,.075,0),'#7ab03a'],[new THREE.ConeGeometry(.006,.05,3).rotateZ(1.1).translate(.02,.1,0),'#a8d060'],[new THREE.ConeGeometry(.006,.05,3).rotateZ(-1.1).translate(-.02,.14,0),'#a8d060']]);
 const sm2=M('#ffffff',{vertexColors:true,roughness:.5});const N=520,dirs=[];for(let i=0;i<N;i++){const y=1-2*(i+.5)/N,r=Math.sqrt(1-y*y),a=i*2.39996;dirs.push(V3(Math.cos(a)*r,y,Math.sin(a)*r))}
 const C0=V3(0,.88,0);const im=fxC_inst(sg,sm2,dirs.map(d=>[C0.clone().addScaledVector(d,.88),fxC_q(d),1]));g.add(im);
 g.add(shadow(1));const o=new THREE.Object3D();
 g.userData.anim=t=>{const k=Math.max(0,Math.sin(t*.7))**40;if(k<.001&&im.userData.k===0)return;im.userData.k=k<.001?0:k;
  dirs.forEach((d,i)=>{const e=(i%3===0)?k:k*.35;o.position.copy(C0).addScaledVector(d,.88+e*.5);o.quaternion.copy(fxC_q(d));o.scale.set(1,1+e*8,1);o.updateMatrix();im.setMatrixAt(i,o.matrix)});im.instanceMatrix.needsUpdate=true};
 return g}

/* ---------- 巨陷虫 · 驱赶者: the trap is the whole animal: a big hard oval shell buried in the sand, its head end a smooth
   pit left open at the surface; at the tail only a small ring of swimming tentacles and a water jet. above it float
   the 驱赶者, round jet-swimmers covered in stinging threads that keep other creatures off ---------- */
function fxC_juxian(){const g=new THREE.Group();const sand=M('#d0b486',{roughness:1}),shell=M('#8a7a62',{roughness:.25,metalness:.15}),inner=M('#6a5a48',{roughness:.15,metalness:.2,side:THREE.DoubleSide});
 const bed=new THREE.Mesh(new THREE.CircleGeometry(3.3,32),sand);bed.rotation.x=-Math.PI/2;bed.position.y=.01;g.add(bed);
 // the shell, buried so only its smooth crown shows, with sand banked round it
 const sh=new THREE.Mesh(new THREE.SphereGeometry(1,28,14),shell);sh.scale.set(2,.8,1.2);sh.position.y=-.45;g.add(sh);
 const lip=new THREE.Mesh(new THREE.TorusGeometry(1,.3,6,32),sand);lip.rotation.x=Math.PI/2;lip.scale.set(1.95,1.2,.35);lip.position.y=.02;g.add(lip);
 // the trap mouth at the head end: a smooth-walled pit open to the surface
 const mz=new THREE.Group();mz.position.set(1.05,.24,0);mz.rotation.z=-.33;g.add(mz);
 const rim=new THREE.Mesh(new THREE.TorusGeometry(.5,.07,6,24),shell);rim.rotation.x=Math.PI/2;mz.add(rim);
 const hole=new THREE.Mesh(new THREE.CircleGeometry(.5,24),M('#1e160e',{roughness:.6}));hole.rotation.x=-Math.PI/2;hole.position.y=-.6;mz.add(hole);
 const pitW=new THREE.Mesh(new THREE.CylinderGeometry(.5,.4,.6,20,1,true),inner);pitW.position.y=-.3;mz.add(pitW);
 // the tail end just breaking the sand: a little jet and a ring of small tentacles
 const tail=new THREE.Group();tail.position.set(-2.02,-.05,0);g.add(tail);const jet=cyl(.08,.12,.14,M('#4a3a2a'),10);jet.rotation.z=Math.PI/2;jet.position.x=-.04;tail.add(jet);
 const tn=[];for(let i=0;i<10;i++){const a=i/10*6.28;const t2=new THREE.Group();t2.add(new THREE.Mesh(fxC_taper([V3(0,0,0),V3(-.15,0,0),V3(-.3,.05,0)],.025,.006,6,4),M('#b08a6a')));t2.position.set(-.05,.1+Math.cos(a)*.14,Math.sin(a)*.22);t2.rotation.set(a,0,0);tail.add(t2);tn.push(t2)}
 // 驱赶者 hovering over the mouth
 const dr=[];const dm=new THREE.MeshStandardMaterial({color:'#9ac8e0',transparent:true,opacity:.75,roughness:.2,emissive:'#3a7a9a',emissiveIntensity:.2}),thr=M('#e0f0ff');
 for(let i=0;i<7;i++){const d=new THREE.Group();d.add(sph(0,.2,.17,.2,12,dm));for(let k=0;k<14;k++){const v=V3(h3(i,k,1)-.5,h3(i,k,2)-.6,h3(i,k,3)-.5).normalize();const t3=cyl(.008,.003,.35,thr,3);t3.position.copy(v).multiplyScalar(.28);t3.quaternion.copy(fxC_q(v));d.add(t3)}
  g.add(d);dr.push({d,a:i/7*6.28,r:.6+(i%3)*.45})}
 g.userData.anim=t=>{dr.forEach((x,i)=>{x.d.position.set(1.05+Math.cos(x.a+t*.3)*x.r,1.2+Math.sin(t*1.7+i)*.18,Math.sin(x.a+t*.3)*x.r)});tn.forEach((x,i)=>x.rotation.z=Math.sin(t*2+i)*.3)};return g}

ENT.linjia=[fxC_linjia,1.3];
ENT.heifeng=[fxC_heifeng,1.4];
ENT.anying=[fxC_anying,1.3,{dll:[.7,-1]}];
ENT.pensha=[fxC_pensha,1.4];
ENT.zhenjunlz=[fxC_zhenjun,1.8];
ENT.yika=[fxC_yika,1,{sea:1}];
ENT.zhanxie=[fxC_zhanxie,1.1];
ENT.baozhajq=[fxC_baozha,1];
ENT.juxian=[fxC_juxian,1.4];

/* ---------- 爆甲: swarm beetles that mix fluids inside them and blow themselves up; they open their wing cases and fly
   (later kinds also drive themselves with a jet) ---------- */
function fxC_baojia(){const g=new THREE.Group();const bs=[];const em=M('#6a2a1e',{roughness:.3,metalness:.25}),wm=new THREE.MeshStandardMaterial({color:'#d8c8b0',transparent:true,opacity:.45,side:THREE.DoubleSide,depthWrite:false});
 for(let i=0;i<6;i++){const k=new THREE.Group();const b=bBeetle({w:'x',col:'#8a3a2a'});k.add(b);const bel=sph(0,.3,.22,.26,10,EM('#ff8a3a',.7));bel.position.set(-.4,.45,0);k.add(bel);
  const W=[];for(const z of[-1,1]){const el=sph(0,.55,.06,.24,10,em);el.position.set(-.05,.95,z*.3);el.rotation.set(z*.7,0,.35);k.add(el);
   const w=wing(1.1,.45,wm,'insect');w.position.set(.15,.9,z*.15);if(z<0)w.scale.z=-1;k.add(w);W.push({w,z})}
  if(i%2){const j=emitter({n:20,life:.4,speed:3,spread:.2,size:.5,dir:[-1,0,0],col:'#fff0b0',col2:'#ff6020',op:.85,area:[.05,.05,.05]});j.position.set(-.95,.5,0);k.add(j)}
  k.scale.setScalar(.45);k.rotation.z=.15;g.add(k);bs.push({k,b,W,bel,ph:i*1.3,y:.8+(i%3)*.6,x:(i%3-1)*1.1,z:(Math.floor(i/3)-.5)*1.3})}
 g.userData.anim=t=>bs.forEach((x,i)=>{x.b.userData.anim&&x.b.userData.anim(t+i);x.k.position.set(x.x+Math.sin(t*.6+x.ph)*.25,x.y+Math.sin(t*1.7+x.ph)*.12,x.z);x.W.forEach(w=>w.w.rotation.x=w.z*Math.sin(t*28+x.ph)*.6);x.bel.scale.set(.3,.22,.26).multiplyScalar(1+.12*Math.sin(t*6+i))});
 g.userData.anim(0);return g}

/* ---------- 空降仓: a drop pod; on landing it splits slowly and a three-metre 粉碎者 walks out, a heavy beetle-like trooper
   whose cone of a horn springs out to strike ---------- */
function fxC_smasher(){const g=bBeetle({w:'x',col:'#6a5a3a'});const hm=M('#4a3a28',{roughness:.3,metalness:.35});const horn=new THREE.Group();const c=cone(.16,.6,hm,10);c.rotation.z=-Math.PI/2;c.position.x=.3;horn.add(c);
 const sl=cyl(.1,.12,.25,M('#8a7a5a'),8);sl.rotation.z=Math.PI/2;horn.add(sl);horn.position.set(.95,.5,0);g.add(horn);const a0=g.userData.anim;g.userData.anim=t=>{a0(t);const k=Math.max(0,Math.sin(t*1.3))**12;horn.position.x=.95+k*.35};return g}
function fxC_kongjiang(){const g=new THREE.Group();const sh=detailMat(M('#7a6a4a',{roughness:.5}).clone(),{bump:.6,freq:3}),inn=M('#c8d8a0',{roughness:.3,side:THREE.DoubleSide});
 const halves=[];for(const z of[-1,1]){const h=new THREE.Group();const m=new THREE.Mesh(new THREE.SphereGeometry(1.1,16,10,0,Math.PI),sh);m.rotation.y=z>0?0:Math.PI;h.add(m);const lin=new THREE.Mesh(new THREE.CircleGeometry(1.08,18),inn);h.add(lin);h.position.set(0,1,z*.3);h.rotation.x=z*.5;g.add(h);halves.push(h)}
 const goo=sph(0,.9,.25,.8,12,new THREE.MeshStandardMaterial({color:'#c8e0a0',transparent:true,opacity:.55,roughness:.1,depthWrite:false}));goo.position.y=.2;g.add(goo);
 const s=fxC_smasher();s.scale.setScalar(.9);g.add(s);g.add(shadow(1.6));
 g.userData.anim=t=>{s.userData.anim(t);s.position.x=.4+((t*.25)%1)*1.6};return g}

/* ---------- 滚雷: Lin's rolling trooper: armour that can be charged with current, set with hooked barbs ---------- */
function fxC_gunlei(){const g=bThunderBall();const b=g.children[0];const bm=M('#c8d0d8',{metalness:.6,roughness:.25});const hg=new THREE.ConeGeometry(.05,.28,4).translate(0,.14,0).rotateZ(.35);
 const L=[];for(let i=0;i<60;i++){const y=1-2*(i+.5)/60,r=Math.sqrt(1-y*y),a=i*2.4;const d=V3(Math.cos(a)*r,y,Math.sin(a)*r);L.push([d.clone().multiplyScalar(.97),fxC_q(d),1])}
 const im=fxC_inst(hg,bm,L);im.scale.setScalar(1/1);b.add(im);return g}

/* ---------- 声探者: small, simply built probes, made in numbers, that walk about sounding out caves for traps ---------- */
function fxC_shengtan(){const g=new THREE.Group();const sk=M('#8aa8b8',{roughness:.4}),sac=EM('#9ad8ff',.45,{roughness:.2});const ws=[];const L=[];
 for(let i=0;i<5;i++){const w=new THREE.Group();const b=sph(0,.22,.16,.18,12,sk);b.position.y=.32;w.add(b);const s=sph(0,.12,.12,.12,10,sac);s.position.set(.14,.42,0);w.add(s);
  const h=cyl(.05,.09,.12,sk,8);h.rotation.z=-Math.PI/2;h.position.set(.28,.36,0);w.add(h);
  for(let k=0;k<2;k++)for(const z of[-1,1]){const l=leg2(.14,.18,.025,sk,.7);l.position.set(.08-k*.16,.28,z*.12);l.rotation.x=z*.6;w.add(l);L.push({m:l,ph:k*Math.PI+(z>0?0:Math.PI/2)+i,a:.5})}
  w.position.set((i%3-1)*.9,0,(Math.floor(i/3)-.5)*1);w.rotation.y=i*1.3;g.add(w);ws.push({w,s})}
 const rings=[];for(let i=0;i<3;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(1,.02,4,40),new THREE.MeshBasicMaterial({color:'#9ad8ff',transparent:true,opacity:.5,blending:THREE.AdditiveBlending,depthWrite:false}));r.rotation.x=Math.PI/2;r.position.y=.4;g.add(r);rings.push(r)}addLegs(g,L);g.add(shadow(1.2));
 stdAnim(g,{fq:10,amp:.5,extra:t=>{rings.forEach((r,i)=>{const q=(t*.5+i/3)%1;r.scale.setScalar(.3+q*1.8);r.material.opacity=.5*(1-q)});ws.forEach((x,i)=>{x.s.scale.setScalar(.12*(1+Math.max(0,Math.sin(t*5+i))*.25))});}});return g}

/* ---------- 第三次不完全大灭绝: spring came, everything warmed and woke — and then the giant bugs died. warm green ground,
   flowers, soft sun, and the great insects lying dead on their backs ---------- */
function fxC_ext3(){const g=new THREE.Group();const gr=new THREE.Mesh(new THREE.CircleGeometry(3.6,32),M('#7ab04a',{roughness:.9}));gr.rotation.x=-Math.PI/2;gr.position.y=.02;g.add(gr);
 for(let i=0;i<8;i++){const c=bBeetle({w:i%2?'heijiao':'x',col:i%3?'#5a4a3a':'#6a5a2a'});c.scale.setScalar(.6+h3(i,1,4)*.5);c.rotation.set(Math.PI,h3(i,2,4)*6,(h3(i,3,4)-.5)*.4);c.position.set((h3(i,4,4)-.5)*5,.55,(h3(i,5,4)-.5)*5);c.userData.anim=null;
  c.traverse(m=>{if(m.isMesh&&m.material&&m.material.color&&!m.material.transparent){m.material=m.material.clone();m.material.color.lerp(C('#8a8a7a'),.35)}});g.add(c)}
 const fg=G([[new THREE.CylinderGeometry(.01,.01,.25,3).translate(0,.12,0),'#4a8a3a'],[new THREE.SphereGeometry(.05,6,4).translate(0,.26,0),'#ffe060']]);const fl=[];
 for(let i=0;i<120;i++)fl.push([V3((h3(i,1,6)-.5)*6.4,0,(h3(i,2,6)-.5)*6.4),[0,0,0],.8+h3(i,3,6)*.6]);const fm=fxC_inst(fg,M('#ffffff',{vertexColors:true,roughness:.7}),fl);g.add(fm);
 const fg2=G([[new THREE.CylinderGeometry(.01,.01,.2,3).translate(0,.1,0),'#4a8a3a'],[new THREE.SphereGeometry(.05,6,4).translate(0,.21,0),'#f08ab0']]);const fl2=[];for(let i=0;i<80;i++)fl2.push([V3((h3(i,4,6)-.5)*6.4,0,(h3(i,5,6)-.5)*6.4),[0,0,0],1]);g.add(fxC_inst(fg2,fm.material,fl2));
 g.add(emitter({n:60,life:6,speed:.3,spread:1,size:2.2,dir:[1,.2,0],col:'#fff2c8',op:.18,add:false,tex:smokeTex,area:[6,1.5,6],wander:.5}));g.add(at(glowSprite('#fff0b0',4,.22),0,2.2,0));return g}

ENT.baojia=[fxC_baojia,1.2];
ENT.kongjiang=[fxC_kongjiang,1.3];
ENT.gunlei=[fxC_gunlei,1];
ENT.shengtan=[fxC_shengtan,1];
ENT.ev_ext3=[fxC_ext3,2.2];
/* 琳 and 观察者: the first cells were nearly see-through, with grey nuclei */
ENT.lin=[()=>{const g=bCells({n:34,col:'#e6f2ee',core:'#626464',size:1.1,glow:'#eaf6f2'});const ring=new THREE.Mesh(new THREE.TorusGeometry(1.8,.03,4,48),GL('#e8f4f0',.4));ring.rotation.x=Math.PI/2;g.add(ring);
 const a0=g.userData.anim;g.userData.anim=t=>{a0&&a0(t);ring.scale.setScalar(1+Math.sin(t*.8)*.08);g.rotation.y=t*.05};return g},1.4,{alt:1.5}];
ENT.guanchazhe=[()=>{const g=bCrystalCell();const mem=g.children[0],nu=g.children[1];mem.material=new THREE.MeshStandardMaterial({color:'#eef6f4',transparent:true,opacity:.3,roughness:.08,emissive:'#a8c8c0',emissiveIntensity:.12,depthWrite:false});
 nu.material=M('#7e8080',{roughness:.5});g.traverse(o=>{if(o.isLineSegments)o.material=new THREE.LineBasicMaterial({color:'#d8e8e4',transparent:true,opacity:.7})});return g},1.1,{alt:1}];
