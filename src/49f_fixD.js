/* ================================================================
   fixD: bodies rebuilt to match the book (void worlds, Ersh, Midgard, the frozen void, the dream).
   Everything here is prefixed fxD_. Shared: fxD_xumin(o) — the six-limbed 虚民 figure.
   ================================================================ */
const fxD_sh=(hex,k)=>{const c=C(hex);c.multiplyScalar(k);return '#'+c.getHexString()};
// lumpy closed blob geometry (smooth normals)
function fxD_lump(r,amp,fq,seed,det,sx,sy,sz){let geo=new THREE.IcosahedronGeometry(1,det||3);geo.deleteAttribute('normal');geo.deleteAttribute('uv');if(THREE.BufferGeometryUtils)geo=THREE.BufferGeometryUtils.mergeVertices(geo);
 const p=geo.attributes.position;for(let i=0;i<p.count;i++){const v=V3(p.getX(i),p.getY(i),p.getZ(i));const k=1+amp*(n3(v.x*fq+seed,v.y*fq+seed*.7,v.z*fq)-.5)*2;v.multiplyScalar(r*k);p.setXYZ(i,v.x*(sx||1),v.y*(sy||1),v.z*(sz||1))}geo.computeVertexNormals();return geo}
// three equal fingers at the end of a limb (parent: the lower limb group, y: its length)
function fxD_fingers(par,len,r,mat,fwd){for(let k=0;k<3;k++){const f=cone(r*.55,r*2.6,mat,5);f.position.set(r*.9*(fwd||1),-len-r*.6,(k-1)*r*.9);f.rotation.z=(fwd||1)*-(Math.PI/2+.5);f.rotation.x=(k-1)*.35;par.add(f)}}

/* ---------- 虚民: about 3 m standing; six limbs of one thickness with the same fingers, a sealed shell-like
   skeleton like the flying dragons', and a skull carrying hard little horns that hold the brain.
   On a world with weight they walk on two pairs and keep the front pair as hands.
   o: {skin, cloth, cloth2, medals, hat:'cap', hatc, cape, armor, crack, book, bag, belt} ---------- */
function fxD_xumin(o){o=Object.assign({skin:'#8e9aa8'},o||{});const g=new THREE.Group();g.userData.noSkin=1;
 const sk=M(o.skin,{roughness:.4,metalness:.1}),pl=M(fxD_sh(o.skin,.7),{roughness:.36,metalness:.12}),hn=M(fxD_sh(o.skin,1.25),{roughness:.3,metalness:.1});
 const R=.125;
 // body: a low rear trunk on four legs, a fore-trunk leaning forward with two arms
 const rear=sph(0,.62,.38,.4,16,sk);rear.position.set(-.55,1.05,0);rear.rotation.z=.06;g.add(rear);
 const mid=sph(0,.36,.4,.36,14,sk);mid.position.set(-.02,1.2,0);g.add(mid);
 const chest=new THREE.Group();chest.position.set(.22,1.66,0);chest.rotation.z=-.38;g.add(chest);
 const tor=sph(0,.32,.5,.33,16,sk);chest.add(tor);
 for(let i=0;i<8;i++){const q=i/7;const x=-1.05+q*1.3;const p=sph(0,.12,.05,.17-.04*Math.abs(q-.5),8,pl);p.position.set(x,(x<-.1?1.43:1.43+(x+.1)*.9)-(x<-.6?(x+.6)*-.15:0),0);p.rotation.z=x<-.1?.05:-.75;g.add(p)}
 g.add(tubeAlong([V3(-1.1,1.07,0),V3(-1.45,.95,0),V3(-1.78,.72,0)],.08,sk,10));
 const legs=[];const LP=[[-.02,1.02,1],[-.98,1.0,1],[-.02,1.02,-1],[-.98,1.0,-1]];
 LP.forEach(([x,y,z],i)=>{const l=leg2(.48,.52,R,sk,-.5);l.position.set(x,y,z*.29);l.rotation.z=.25;l.rotation.x=z*.08;g.add(l);fxD_fingers(l.userData.knee,.52,R,sk,1);
  const kn=sph(0,R*1.2,R*1.2,R*1.2,8,pl);kn.position.y=-.48;l.add(kn);legs.push({m:l,ph:(i%2?Math.PI:0)+(z>0?0:Math.PI),a:.25,k:-.5})});
 const arms=[];for(const z of[-1,1]){const sh=sph(0,.13,.12,.13,10,pl);sh.position.set(0,.42,z*.3);chest.add(sh);
  const a=leg2(.48,.44,R,sk,1.0);a.position.set(0,.4,z*.32);a.rotation.z=.55;a.rotation.x=z*.12;chest.add(a);fxD_fingers(a.userData.knee,.44,R,sk,1);arms.push(a)}
 // short thick neck and the long dragon-like skull crowned with hard horn knobs
 g.add(tubeAlong([V3(.38,2.0,0),V3(.52,2.16,0),V3(.7,2.24,0)],.1,sk,10));
 const head=new THREE.Group();head.position.set(.74,2.27,0);g.add(head);
 const sku=sph(0,.3,.18,.19,14,sk);sku.position.set(.12,.04,0);head.add(sku);
 const sn=cone(.12,.36,sk,10);sn.rotation.z=-Math.PI/2;sn.position.set(.56,-.02,0);sn.scale.z=.85;head.add(sn);
 const jaw=sph(0,.25,.055,.11,10,pl);jaw.position.set(.3,-.12,0);head.add(jaw);
 for(const z of[-1,1]){const e=eye(.034,'#141014');e.position.set(.34,.07,z*.13);head.add(e)}
 const HP=[[-.1,.17,0,.2],[.02,.2,.08,.17],[.02,.2,-.08,.17],[-.14,.12,.13,.17],[-.14,.12,-.13,.17],[.14,.19,0,.13],[-.22,.05,.05,.16],[-.22,.05,-.05,.16],[-.02,.1,.18,.12],[-.02,.1,-.18,.12],[.1,.15,.13,.1],[.1,.15,-.13,.1]];
 HP.forEach(([x,y,z,h])=>{const c=cone(.045,h,hn,6);c.position.set(x,y+h*.38,z);c.rotation.set(z*3,0,.6);head.add(c);const b=sph(0,.05,.03,.05,6,hn);b.position.set(x,y,z);head.add(b)});
 for(let i=0;i<5;i++){const a=HP[i],b=HP[i+5];head.add(tubeAlong([V3(a[0],a[1]+.01,a[2]),V3((a[0]+b[0])/2,Math.max(a[1],b[1])+.03,(a[2]+b[2])/2),V3(b[0],b[1]+.01,b[2])],.008,pl,4))}
 // clothing
 const ex=(y,z)=>.33*Math.sqrt(Math.max(0,1-(y/.5)**2-(z/.33)**2));
 if(o.cloth){const cl=M(o.cloth,{roughness:.8}),c2=M(o.cloth2||fxD_sh(o.cloth,.7),{roughness:.8});
  const tun=sph(0,.35,.47,.36,14,cl);tun.position.y=-.04;chest.add(tun);
  const dr=new THREE.Mesh(new THREE.SphereGeometry(1,16,8,0,Math.PI*2,0,1.25),c2);dr.scale.set(.66,.42,.43);dr.position.set(-.55,1.05,0);dr.rotation.z=.06;g.add(dr);
  const bl=new THREE.Mesh(new THREE.TorusGeometry(.33,.04,6,18),M(o.belt||'#2a2420',{roughness:.5,metalness:o.belt?.4:0}));bl.rotation.x=Math.PI/2;bl.position.y=-.38;bl.scale.set(1.05,1.08,1);chest.add(bl);
  const col=new THREE.Mesh(new THREE.TorusGeometry(.13,.035,6,14),c2);col.rotation.x=Math.PI/2;col.position.y=.45;chest.add(col)}
 if(o.armor){const am=M(o.armor,{metalness:.45,roughness:.42});const ap=sph(0,.36,.48,.37,14,am);ap.position.y=-.03;chest.add(ap);
  const ar=new THREE.Mesh(new THREE.SphereGeometry(1,16,8,0,Math.PI*2,0,1.2),am);ar.scale.set(.66,.43,.44);ar.position.set(-.55,1.05,0);g.add(ar);
  for(const z of[-1,1]){const pd=sph(0,.17,.1,.16,10,am);pd.position.set(0,.45,z*.3);chest.add(pd)}
  if(o.crack){const ck=M('#140a08',{roughness:.9});const pts=[];for(let i=0;i<=8;i++){const q=i/8;const y=.4-q*.75,z=.24-q*.42+Math.sin(q*9)*.03;pts.push(V3(ex(y,z)*1.12+.02,y,z))}chest.add(tubeAlong(pts,.018,ck,24));
   for(let i=1;i<7;i+=2){const p=pts[i];const z2=p.z+(i%4?.08:-.08),y2=p.y-.06;chest.add(tubeAlong([p,V3(ex(y2,z2)*1.12+.02,y2,z2)],.009,ck,3))}
   const bd=M('#4a1410',{roughness:.7});for(let i=0;i<7;i++){const p=pts[1+i];const y=p.y-.04-h3(i,1,9)*.05,z=p.z+(h3(i,2,9)-.5)*.12;const b=sph(0,.055,.035,.016,6,bd);b.position.set(ex(y,z)*1.12+.02,y,z);b.rotation.y=Math.PI/2;chest.add(b)}}}
 if(o.medals)for(let i=0;i<8;i++){const y=.12-Math.floor(i/4)*.1,z=(i%4-1.5)*.075;const md=sph(0,.032,.032,.015,6,M(i%3?'#e8c040':'#c0c8d0',{metalness:.6,roughness:.3}));md.rotation.y=Math.PI/2;md.position.set(ex(y,z)*1.08+.03,y,z);chest.add(md)}
 if(o.hat==='cap'){const hc=M(o.hatc||'#2a2a34');const cp=new THREE.Mesh(new THREE.CylinderGeometry(.13,.15,.1,14),hc);cp.position.set(.28,.21,0);cp.rotation.z=-.1;head.add(cp);const br=new THREE.Mesh(new THREE.CylinderGeometry(.1,.1,.02,14),M('#1a1a20'));br.position.set(.39,.16,0);br.scale.z=.8;head.add(br)}
 if(o.cape){const cm=M(o.cape,{side:THREE.DoubleSide,roughness:.8});const pg=new THREE.PlaneGeometry(1,1,6,8);const P=pg.attributes.position;for(let i=0;i<P.count;i++){const u=P.getX(i),v=P.getY(i)+.5,z=u*(.62+v*.25);const x=.06-v*1.0,y=2.12-v*.62+Math.sin(v*Math.PI)*.06-Math.pow(Math.abs(z)/.45,2)*.3*(.3+v);P.setXYZ(i,x,y,z)}pg.computeVertexNormals();const cp=new THREE.Mesh(pg,cm);g.add(cp)}
 if(o.bag){const bm=M(o.bag,{roughness:.85});const b=sph(0,.2,.17,.08,10,bm);b.position.set(-.5,.98,.43);g.add(b);const st=new THREE.Mesh(new THREE.TorusGeometry(.42,.02,4,20),bm);st.position.set(-.3,1.15,0);st.rotation.set(0,0,.5);st.scale.set(1,1.05,1.02);g.add(st)}
 if(o.book){const bk=new THREE.Mesh(kb(.2,.26,.05),M('#8a3a2a'));bk.position.set(.12,-.46,0);bk.rotation.set(.2,0,-.9);arms[1].userData.knee.add(bk)}
 g.add(shadow(1,-.4,0));
 addLegs(g,legs);
 g.userData.anim=t=>{const L=g.userData.legs;if(L)for(const l of L){l.m.rotation.z=.25+Math.sin(t*3+l.ph)*.25;l.m.userData.knee.rotation.z=-.5-Math.max(0,Math.sin(t*3+l.ph+1.4))*.4}
  tor.scale.y=1+Math.sin(t*1.6)*.02;head.rotation.z=Math.sin(t*.7)*.06;head.rotation.y=Math.sin(t*.45)*.12;arms.forEach((a,i)=>{a.rotation.z=.55+Math.sin(t*1.1+i*1.9)*.1});};
 g.userData.xmShoulder=V3(.34,2.2,.34);return g}
const fxD_scholar=()=>fxD_xumin({cloth:'#3a4a5a',cloth2:'#2a3440',book:1,bag:'#5a4a3a'});

/* ---------- a small mechanical 爆哮虫 (Maya's loudspeaker), metal grey ---------- */
function fxD_mechRoarer(){const g=bRoarer({col:'#8a929a'});const rep={};g.traverse(c=>{if(!c.isMesh||!c.material||!c.material.isMeshStandardMaterial||c.material.transparent)return;const m=c.material;const k=m.uuid;
  if(!rep[k]){const l=m.color.r*.3+m.color.g*.55+m.color.b*.15;rep[k]=l<.08?m:M(l>.6?'#c8d0d8':l>.3?'#a0a8b0':'#5a5e66',{metalness:.45,roughness:.3})}c.material=rep[k]});
 const rv=M('#6a7078',{metalness:.45,roughness:.25});for(let i=0;i<10;i++){const a=i/10*6.283;const r=sph(0,.06,.06,.06,6,rv);r.position.set(Math.cos(a)*.2,1+Math.sin(a)*.86,(i%2?1:-1)*.75+Math.cos(a)*.1);g.add(r)}
 for(const z of[-1,1]){const ln=glowEye(.07,'#7ae0ff');ln.position.set(.88,1.75,z*.3);g.add(ln)}
 const seam=new THREE.Mesh(new THREE.TorusGeometry(1.0,.025,4,32),M('#3a3e44',{metalness:.45}));seam.rotation.y=Math.PI/2;seam.position.y=1;seam.scale.set(1,.9,1);g.add(seam);g.userData.noSkin=1;return g}

/* ---------- 护核者: a floating mass of light, larger than a brain-spirit, trailing threads of light ---------- */
function fxD_huhe(){const g=new THREE.Group();const body=new THREE.Group();body.position.y=2.3;g.add(body);
 const core=new THREE.Mesh(fxD_lump(.55,.25,1.6,3.1,3),EM('#9fe0ff',.9,{roughness:.3}));body.add(core);
 const shell=new THREE.Mesh(fxD_lump(.95,.28,1.2,7.7,3),new THREE.MeshStandardMaterial({color:'#7fc8f0',emissive:'#3a90d0',emissiveIntensity:.5,transparent:true,opacity:.35,roughness:.2,depthWrite:false}));body.add(shell);
 body.add(glowSprite('#7fc8ff',3.6,.45));
 const thr=new THREE.Group();body.add(thr);const tm=GL('#a8e4ff',.55);
 for(let i=0;i<14;i++){const a=i/14*6.283,b=(h3(i,1,4)-.5)*2.2;const d=V3(Math.cos(a)*Math.cos(b),Math.sin(b),Math.sin(a)*Math.cos(b));const s=V3(-d.z,0,d.x).multiplyScalar(.5);
  const L=1.6+h3(i,2,4)*1.4;thr.add(tubeAlong([d.clone().multiplyScalar(.6),d.clone().multiplyScalar(L*.45).add(s),d.clone().multiplyScalar(L).add(s.clone().multiplyScalar(-.6)).add(V3(0,-.4,0))],.022,tm,14))}
 body.add(swarmPts(70,2.2,'#e8fbff',.09,9));
 g.userData.anim=t=>{body.position.y=2.3+Math.sin(t*.8)*.25;body.position.x=Math.sin(t*.37)*.2;core.scale.setScalar(1+Math.sin(t*2.1)*.06);shell.scale.setScalar(1+Math.sin(t*1.3+1)*.07);shell.rotation.y=t*.2;thr.rotation.y=-t*.15;thr.rotation.x=Math.sin(t*.5)*.15};return g}

/* ---------- 咕咕噶: a crystal being about 3 m tall standing like an emerald dragon; four feet, four fingered hands,
   a head like a dragonfly's ---------- */
function fxD_gugu(){const g=new THREE.Group();const cr=new THREE.MeshStandardMaterial({color:'#8fe0c8',emissive:'#1f7a6a',emissiveIntensity:.3,roughness:.12,metalness:.25,flatShading:true});
 const cr2=new THREE.MeshStandardMaterial({color:'#bff4e4',emissive:'#3aa890',emissiveIntensity:.45,roughness:.08,metalness:.2,flatShading:true});
 const eyeM=new THREE.MeshStandardMaterial({color:'#2a5a6a',emissive:'#0a3a4a',emissiveIntensity:.4,roughness:.1,metalness:.5,flatShading:true});
 const ico=new THREE.IcosahedronGeometry(1,1);const part=(m,sx,sy,sz,x,y,z,rz)=>{const o=new THREE.Mesh(ico,m);o.scale.set(sx,sy,sz);o.position.set(x,y,z);if(rz)o.rotation.z=rz;g.add(o);return o};
 part(cr,.62,.4,.42,-.45,1.05,0,.1);part(cr,.36,.42,.36,.05,1.3,0);const tor=part(cr,.3,.55,.32,.2,1.9,0,-.12);
 g.add(tubeAlong([V3(-.95,1.0,0),V3(-1.4,.72,0),V3(-1.75,.4,.1)],.16,cr,10));g.add(at(Sc(cone(.12,.4,cr,6),1,1,1),-1.85,.3,.12));
 for(let i=0;i<9;i++){const s=new THREE.Mesh(ko(.12),cr2);s.scale.set(.7,1.8,.5);s.position.set(-1.0+i*.15,1.4+i*.1,0);s.rotation.z=.4;g.add(s)}
 const legs=[];for(const [x,z] of [[0,1],[0,-1],[-.85,1],[-.85,-1]]){const l=leg2(.52,.55,.13,cr,-.6);l.position.set(x,1.02,z*.3);l.rotation.z=.3;l.rotation.x=z*.12;g.add(l);fxD_fingers(l.userData.knee,.55,.13,cr,1);legs.push(l)}
 const arms=[];[[2.18,.32,.3],[1.88,.36,-.1]].forEach(([y,zz,rz],row)=>{for(const z of[-1,1]){const a=leg2(.5,.46,.085,cr,.8+row*.4);a.position.set(.22,y,z*zz);a.rotation.z=rz;a.rotation.x=z*(.25+row*.2);g.add(a);fxD_fingers(a.userData.knee,.46,.085,cr,1);arms.push(a)}});
 g.add(tubeAlong([V3(.24,2.3,0),V3(.36,2.5,0),V3(.5,2.62,0)],.08,cr,8));
 const head=new THREE.Group();head.position.set(.56,2.66,0);g.add(head);
 const hb=new THREE.Mesh(ico,cr);hb.scale.set(.2,.18,.19);head.add(hb);
 for(const z of[-1,1]){const e=new THREE.Mesh(new THREE.IcosahedronGeometry(1,2),eyeM);e.scale.set(.2,.22,.19);e.position.set(.12,.05,z*.18);head.add(e)}
 for(const z of[-1,1]){const md=cone(.03,.12,cr2,4);md.position.set(.2,-.12,z*.04);md.rotation.z=Math.PI*.85;head.add(md)}
 for(const z of[-1,1]){const an=tubeAlong([V3(.12,.14,z*.04),V3(.2,.26,z*.08),V3(.26,.32,z*.14)],.008,cr2,5);head.add(an)}
 g.add(at(glowSprite('#9ff2e0',2.6,.25),.1,1.8,0));g.add(shadow(1,-.4,0));
 g.userData.anim=t=>{head.rotation.z=Math.sin(t*.9)*.08;head.rotation.y=Math.sin(t*.6)*.25;arms.forEach((a,i)=>a.rotation.y=Math.sin(t*1.3+i)*.12);tor.rotation.z=-.12+Math.sin(t*1.5)*.02};return g}

/* ---------- 灰烬造脑怪: fat oval eight-legged bodies of grey-black ash, shedding dust; two of them on a volcano top ---------- */
function fxD_zaonao(col){const g=new THREE.Group();const ash=detailMat(M(col||'#6d6a66',{roughness:1}).clone(),{bump:1.4,freq:5});const dk=M('#2e2b29',{roughness:1});
 const b=new THREE.Mesh(fxD_lump(.62,.12,2.2,col?5:2,3,1.15,.78,.85),ash);b.position.y=.72;g.add(b);
 for(let i=0;i<14;i++){const v=V3(h3(i,1,5)-.5,h3(i,2,5)*.8,h3(i,3,5)-.5).normalize();const s=sph(0,.09,.05,.09,6,dk);s.position.set(v.x*.7,.72+v.y*.48,v.z*.52);s.lookAt(V3(0,.72,0));g.add(s)}
 for(const z of[-1,1]){const e=glowEye(.045,'#ffb070');e.position.set(.66,.86,z*.17);g.add(e)}
 const L=[];for(let i=0;i<8;i++){const s=i%2?1:-1,k=Math.floor(i/2);const l=leg2(.26,.3,.06,ash,.7);l.position.set(.45-k*.3,.5,s*.42);l.rotation.x=s*.75;g.add(l);L.push({m:l,ph:k*1.3+(s>0?Math.PI:0)})}
 const d=emitter({n:50,life:2.6,speed:.35,spread:.7,size:.55,dir:[0,-1,0],col:'#5a5654',op:.55,add:false,tex:smokeTex,area:[1.2,.5,.8]});d.position.y=.6;g.add(d);
 const fl=emitter({n:40,life:2,speed:.6,spread:.9,size:.07,dir:[0,-1,0],col:'#2a2624',op:.9,add:false,area:[1.2,.6,.9],wander:.3});fl.position.y=.7;g.add(fl);
 g.userData.L=L;g.userData.b=b;return g}
function fxD_ashPair(){const g=new THREE.Group();const vm=detailMat(M('#2a2420',{roughness:.95,flatShading:true}).clone(),{bump:1});
 const T=1.7;const vol=new THREE.Mesh(new THREE.CylinderGeometry(1.5,3.4,T,12,3),vm);vol.position.y=T/2;g.add(vol);
 const lava=new THREE.Mesh(new THREE.CircleGeometry(.45,14),GL('#ff6a2a',.9));lava.rotation.x=-Math.PI/2;lava.position.set(-.75,T+.02,0);g.add(lava);
 for(let i=0;i<5;i++){const a=i*1.3+.6;const r=tubeAlong([V3(-.75+Math.cos(a)*.45,T+.03,Math.sin(a)*.45),V3(-.75+Math.cos(a)*1.3,T-.15,Math.sin(a)*1.3),V3(Math.cos(a)*2.6,.3,Math.sin(a)*2.6)],.05,GL('#ff7a30',.8),10);g.add(r)}
 const zs=[];for(const z of[-1,1]){const zn=fxD_zaonao(z>0?'#5f5c59':null);zn.scale.setScalar(1.25);zn.position.set(.4,T,z*.68);zn.rotation.y=z*-.25;g.add(zn);zs.push(zn)}
 g.add(at(emitter({n:70,life:4,speed:1.4,spread:.4,size:2,dir:[0,1,0],col:'#3a3030',op:.45,add:false,tex:smokeTex,area:[.6,.2,.6]}),-.75,T,0));g.add(at(glowSprite('#ff5a2a',2.6,.5),-.75,T+.2,0));
 g.userData.anim=t=>zs.forEach((zn,j)=>{const k=Math.max(0,Math.sin(t*3+j*1.7));zn.position.y=T+k*.12;zn.userData.b.scale.set(1+k*.03,1-k*.05,1+k*.03);zn.userData.L.forEach(l=>{l.m.rotation.z=Math.sin(t*6+l.ph)*.25;l.m.userData.knee.rotation.z=.7+Math.sin(t*6+l.ph+1)*.2})});return g}

/* ---------- 巴士生物母体: over 10 m long, floating in a tank; elephant-like build, plain white shell with no organs,
   four jointed limbs and one tentacle-like limb ---------- */
function fxD_mother(){const g=new THREE.Group();const W=7.2,H=3.6,D=3.4;
 const base=new THREE.Mesh(kb(W+.4,.3,D+.4),M('#5a6068',{metalness:.6,roughness:.35}));base.position.y=.15;g.add(base);
 const top=new THREE.Mesh(kb(W+.4,.18,D+.4),M('#5a6068',{metalness:.6,roughness:.35}));top.position.y=H+.39;g.add(top);
 const fm=M('#3a4048',{metalness:.7,roughness:.3});for(const x of[-1,1])for(const z of[-1,1]){const p=new THREE.Mesh(kb(.12,H,.12),fm);p.position.set(x*W/2,H/2+.3,z*D/2);g.add(p)}
 const water=new THREE.Mesh(kb(W,H-.1,D),new THREE.MeshStandardMaterial({color:'#7ab8d8',transparent:true,opacity:.2,roughness:.05,metalness:.1,depthWrite:false,side:THREE.BackSide}));water.position.y=H/2+.3;g.add(water);
 const glass=new THREE.Mesh(kb(W,H-.1,D),new THREE.MeshStandardMaterial({color:'#cfefff',transparent:true,opacity:.14,roughness:.05,metalness:.2,depthWrite:false}));glass.position.copy(water.position);glass.renderOrder=3;g.add(glass);
 const cr=new THREE.Group();cr.position.set(0,2.15,0);g.add(cr);const wh=M('#f1efe8',{roughness:.28,metalness:.05});g.userData.noSkin=1;
 const bd=sph(0,1.7,.95,.95,22,wh);cr.add(bd);const hd=sph(0,.72,.66,.62,18,wh);hd.position.set(1.62,.2,0);cr.add(hd);
 const lg=[];for(const [x,z] of [[.85,1],[.85,-1],[-.9,1],[-.9,-1]]){const l=leg2(.55,.55,.2,wh,.6);l.position.set(x,-.55,z*.55);l.rotation.z=.2;cr.add(l);const j=sph(0,.21,.21,.21,10,wh);j.position.y=-.55;l.add(j);lg.push(l)}
 const ten=new THREE.Group();ten.position.set(2.2,.1,0);cr.add(ten);const segs=[];let par=ten;for(let i=0;i<7;i++){const s=new THREE.Group();const c=cyl(.21-i*.022,.19-i*.022,.34,wh,10);c.rotation.z=Math.PI/2;c.position.x=.17;s.add(c);s.position.x=i?.32:0;par.add(s);par=s;segs.push(s)}
 const bub=emitter({n:60,life:4,speed:.6,spread:.15,size:.12,dir:[0,1,0],col:'#e8f8ff',op:.7,area:[W*.9,.1,D*.8]});bub.position.y=.5;g.add(bub);
 g.add(at(glowSprite('#bfe8ff',8,.12),0,2,0));
 g.userData.anim=t=>{cr.position.y=2.15+Math.sin(t*.5)*.15;cr.position.x=Math.sin(t*.23)*.4;cr.rotation.z=Math.sin(t*.4)*.03;lg.forEach((l,i)=>{l.rotation.z=.2+Math.sin(t*.9+i*1.6)*.25;l.userData.knee.rotation.z=.6+Math.sin(t*.9+i*1.6+1)*.3});
  segs.forEach((s,i)=>{s.rotation.z=-.16+Math.sin(t*1.1-i*.6)*.3;s.rotation.y=Math.cos(t*.8-i*.5)*.22})};return g}

/* ---------- 蜈手: one palm-sized, palm-shaped kin of the centipedes ---------- */
function fxD_wushou(){const g=new THREE.Group();const ch=M('#8a4a2a',{roughness:.28,metalness:.1}),c2=M('#6a3420',{roughness:.3}),lm=M('#c8905a',{roughness:.5});
 const palm=new THREE.Group();palm.position.y=.16;g.add(palm);palm.add(sph(0,.42,.08,.4,16,ch));
 for(let i=0;i<4;i++){const p=sph(0,.1,.045,.36-Math.abs(i-1.5)*.04,10,i%2?ch:c2);p.position.set(-.27+i*.18,.05,0);palm.add(p)}
 for(let i=0;i<16;i++){const a=Math.PI*.55+i/15*Math.PI*.9;for(const s of[1,-1]){if(s<0&&i>13)continue;const aa=s>0?a:-a;const l=limb(.16,.016,.01,lm);l.position.set(Math.cos(aa)*.4,-.01,Math.sin(aa)*.38);l.rotation.set(Math.sin(aa)*1.7,0,-Math.cos(aa)*1.7);palm.add(l)}}
 const hd=sph(0,.15,.07,.17,10,c2);hd.position.x=-.48;palm.add(hd);
 for(const z of[-1,1]){palm.add(tubeAlong([V3(-.56,-.02,z*.07),V3(-.66,-.03,z*.09),V3(-.69,-.03,z*.02)],.018,M('#2a1408',{roughness:.3}),6));palm.add(tubeAlong([V3(-.58,.03,z*.06),V3(-.8,.1,z*.2),V3(-.95,.08,z*.32)],.008,lm,6))}
 const fingers=[];const FA=[[.36,-.27,.1,5],[.4,-.09,0,5],[.4,.09,0,5],[.36,.27,-.1,5],[-.02,.4,-.95,4]];
 FA.forEach(([x,z,ang,n],fi)=>{const f=new THREE.Group();f.position.set(x,0,z);f.rotation.y=ang;palm.add(f);let par=f;const ss=[];const sl=fi<4?.14:.13;
  for(let i=0;i<n;i++){const s=new THREE.Group();s.position.x=i?sl:0;const b=sph(0,sl*.62,.05,.075-i*.007,8,i%2?c2:ch);b.position.x=sl*.5;s.add(b);for(const zz of[-1,1]){const l=limb(.13,.012,.008,lm);l.position.set(sl*.5,-.02,zz*.065);l.rotation.x=zz*1.8;s.add(l)}par.add(s);par=s;ss.push(s)}
  const tip=cone(.035,.09,c2,5);tip.rotation.z=-Math.PI/2;tip.position.x=sl+.03;par.add(tip);fingers.push(ss)});
 g.add(shadow(.9));
 g.userData.anim=t=>{palm.position.x=Math.sin(t*.5)*.12;fingers.forEach((ss,fi)=>ss.forEach((s,i)=>{s.rotation.z=-.04+Math.sin(t*3+fi*.9+i*.7)*.08;s.rotation.y=Math.sin(t*2+fi+i*.5)*.07}))};return g}

/* ---------- 瑟: about 1 m, oval, six-limbed and nearly unable to move; they live sealed inside alloy walkers.
   One walker with its pilot visible under a window, one 瑟 crawled out carrying the small dream-energy device ---------- */
function fxD_seBody(){const g=new THREE.Group();const sk=M('#c8b8e8',{roughness:.45}),dk=M('#8a7aa8',{roughness:.5});
 const b=sph(0,.32,.2,.24,14,sk);b.position.y=.2;g.add(b);for(let i=0;i<3;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(.2,.02,4,14),dk);r.rotation.y=Math.PI/2;r.position.set(-.15+i*.15,.21,0);r.scale.set(1,.85-.1*Math.abs(i-1),1.15);g.add(r)}
 for(const z of[-1,1]){const e=eye(.03,'#2a1a3a');e.position.set(.3,.26,z*.08);g.add(e)}
 for(let i=0;i<6;i++){const z=i%2?1:-1,k=Math.floor(i/2);const l=leg2(.09,.08,.025,sk,.8);l.position.set(.16-k*.16,.14,z*.2);l.rotation.x=z*1.1;g.add(l)}return g}
function fxD_se(){const g=new THREE.Group();g.userData.noSkin=1;const al=M('#a4a2b0',{metalness:.45,roughness:.35}),al2=M('#6a6878',{metalness:.45,roughness:.38});
 const hull=sph(0,1.35,.62,.85,20,al);hull.position.set(0,1.5,0);g.add(hull);
 for(let i=0;i<4;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(1,.035,5,28),al2);r.rotation.y=Math.PI/2;r.position.set(-.9+i*.55,1.5,0);const k=Math.sqrt(Math.max(.1,1-Math.pow((-.9+i*.55)/1.35,2)));r.scale.set(.86*k,.63*k,1);g.add(r)}
 const win=new THREE.Mesh(new THREE.SphereGeometry(.42,16,10,0,Math.PI*2,0,Math.PI/2),TR('#cfe8ff',.3,{metalness:.3}));win.position.set(.55,1.98,0);win.rotation.z=-.35;win.renderOrder=3;g.add(win);
 const pilot=fxD_seBody();pilot.scale.setScalar(.85);pilot.position.set(.5,1.82,0);g.add(pilot);
 const lamp=new THREE.Mesh(ko(.08),EM('#c8a8ff',.9));lamp.position.set(.2,2.0,0);g.add(lamp);
 const legs=[];for(let i=0;i<6;i++){const z=i%2?1:-1,k=Math.floor(i/2);const l=leg2(.8,.95,.1,al,.9);l.position.set(.8-k*.8,1.3,z*.7);l.rotation.x=z*.6;l.rotation.z=-.3;g.add(l);const ft=sph(0,.14,.06,.12,8,al2);ft.position.y=-.95;l.userData.knee.add(ft);legs.push(l)}
 for(const z of[-1,1]){const s=sph(0,.12,.12,.12,8,EM('#c8a8ff',.6));s.position.set(1.32,1.58,z*.25);g.add(s)}
 const out=fxD_seBody();out.position.set(1.6,0,1.25);out.rotation.y=-.6;g.add(out);
 const dev=new THREE.Mesh(ko(.11),EM('#c8a8ff',.95,{flatShading:true}));dev.position.set(1.95,.42,1.1);dev.scale.y=1.4;g.add(dev);const dg=glowSprite('#c8a8ff',1.1,.75);dg.position.copy(dev.position);g.add(dg);
 const hatch=new THREE.Mesh(new THREE.SphereGeometry(.4,12,8,0,Math.PI*2,0,1.0),al2);hatch.position.set(.4,2.3,.3);hatch.rotation.set(-.9,0,-.3);g.add(hatch);
 g.add(shadow(1.8));g.userData.anim=t=>{hull.position.y=1.5+Math.sin(t*.6)*.02;pilot.rotation.y=Math.sin(t*.4)*.1;out.scale.y=1+Math.sin(t*.9)*.03;dev.rotation.y=t*.8;dg.material.opacity=.6+Math.sin(t*2.3)*.2};return g}

/* ---------- 原灵: caterpillar-like bodies under soft armour, sealed in liquid inside clear domes on a white wall; the small machines that call themselves gods ---------- */
function fxD_yuanling(){const g=new THREE.Group();const wm=M('#eceee8',{roughness:.7});
 const wall=new THREE.Mesh(kb(.4,3.6,6.4),wm);wall.position.set(-.3,1.8,0);g.add(wall);const fl=new THREE.Mesh(kb(3,.12,6.4),wm);fl.position.set(1,.06,0);g.add(fl);
 const domeG=new THREE.SphereGeometry(.78,18,10,0,Math.PI*2,0,Math.PI/2);const glass=TR('#e4f4ff',.22,{metalness:.2});const liq=TR('#cfe8c8',.28);
 const flesh=M('#e6d2b4',{roughness:.5}),armor=M('#c4ae8c',{roughness:.45});const segG=sgeo(12);
 const bugs=[];for(let r=0;r<2;r++)for(let c=0;c<3;c++){const y=1.0+r*1.65,z=(c-1)*2;const d=new THREE.Mesh(domeG,glass);d.rotation.z=-Math.PI/2;d.position.set(-.1,y,z);d.renderOrder=3;g.add(d);
  const l=new THREE.Mesh(new THREE.SphereGeometry(.72,16,8,0,Math.PI*2,.25,Math.PI/2-.25),liq);l.rotation.z=-Math.PI/2;l.position.set(-.1,y,z);g.add(l);
  const rim=new THREE.Mesh(new THREE.TorusGeometry(.79,.05,6,24),M('#d0d4d0',{metalness:.4,roughness:.3}));rim.rotation.y=Math.PI/2;rim.position.set(-.1,y,z);g.add(rim);
  const bug=new THREE.Group();bug.position.set(.18,y,z);g.add(bug);for(let i=0;i<7;i++){const a=-1.9+i*.6;const rr=.36;const s=new THREE.Mesh(segG,flesh);const sc=.13-.01*Math.abs(i-3);s.scale.set(sc,sc*1.05,sc);s.position.set(.05+Math.sin(i*.9)*.05,Math.sin(a)*rr,Math.cos(a)*rr);bug.add(s);
   const p=new THREE.Mesh(segG,armor);p.scale.set(sc*1.05,sc*.6,sc*.8);p.position.copy(s.position).add(V3(.04,0,0).add(V3(0,Math.sin(a),Math.cos(a)).multiplyScalar(-.0)));p.position.x+=.05;bug.add(p)}
  const hd=new THREE.Mesh(segG,flesh);hd.scale.setScalar(.1);hd.position.set(.08,Math.sin(2.3)*.36,Math.cos(2.3)*.36);bug.add(hd);bug.rotation.x=(r*3+c)*1.1;bugs.push(bug)}
 const mm=[];const mmat=M('#c0c8d0',{metalness:.45,roughness:.3});for(let i=0;i<28;i++){const m=new THREE.Mesh(kb(.07,.07,.07),mmat);g.add(m);mm.push(m)}
 g.add(at(glowSprite('#f4fff0',6,.12),.3,1.8,0));
 g.userData.anim=t=>{bugs.forEach((b,i)=>{b.position.x=.18+Math.sin(t*.4+i)*.03;b.rotation.x=i*1.1+Math.sin(t*.25+i)*.15});mm.forEach((m,i)=>{m.position.set(1.2+Math.sin(i*1.7+t*.7)*.9,.9+Math.abs(Math.sin(i*.9+t*.9))*2.4,Math.cos(i*1.3+t*.6)*2.6);m.rotation.set(t+i,t*.7,0)})};return g}

/* ---------- 浮岛寄主: a host living inside a floating rock; the rock is riddled with holes, lights sit in the holes ---------- */
function fxD_fudao(){const g=new THREE.Group();const R=new THREE.Group();R.position.y=2.6;g.add(R);
 const geo=fxD_lump(1.9,.28,1.1,4.2,3,1.35,.82,1.1);const rock=new THREE.Mesh(geo,detailMat(M('#7a6e62',{roughness:.95}).clone(),{bump:1.2,freq:2.5}));R.add(rock);
 const pit=M('#120c0a',{roughness:1}),lip=M('#5e544a',{roughness:.95});const P=geo.attributes.position,N=geo.attributes.normal;const used=[];const holes=[];
 for(let i=0;i<P.count&&holes.length<26;i+=7){const v=V3(P.getX(i),P.getY(i),P.getZ(i)),n=V3(N.getX(i),N.getY(i),N.getZ(i));if(used.some(u=>u.distanceTo(v)<.62))continue;used.push(v);holes.push({v,n})}
 holes.forEach((h,i)=>{const r=.14+h3(i,1,3)*.2;const d=sph(0,r,r,r*.6,10,pit);d.position.copy(h.v).addScaledVector(h.n,-r*.25);d.lookAt(d.position.clone().add(h.n));R.add(d);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(r*1.02,r*.22,5,12),lip);ring.position.copy(h.v);ring.lookAt(h.v.clone().add(h.n));R.add(ring);
  if(i%3===0){const o=sph(0,r*.55,r*.55,r*.55,8,GL('#ffd890',.95));o.position.copy(h.v).addScaledVector(h.n,-r*.05);R.add(o);const s=glowSprite('#ffc870',r*5,.6);s.position.copy(o.position);R.add(s)}});
 // the big opening underneath where the host shows, and its roots reaching out of a few holes
 const op=sph(0,.95,.6,.8,16,pit);op.position.set(.2,-1.25,0);R.add(op);
 const host=sph(0,.8,.5,.66,16,M('#b07a68',{roughness:.45,emissive:'#5a2a2a',emissiveIntensity:.25}));host.position.set(.2,-1.32,0);R.add(host);
 for(let i=0;i<8;i++){const h=holes[(i*3+1)%holes.length];const a=h.v.clone();const b=a.clone().addScaledVector(h.n,.35).add(V3(0,-.2,0));const c=b.clone().addScaledVector(h.n,.25).add(V3((h3(i,1,8)-.5)*.6,-.4,(h3(i,2,8)-.5)*.6));R.add(tubeAlong([a.clone().addScaledVector(h.n,-.1),b,c],.035,M('#9a6252',{roughness:.5}),10))}
 g.add(at(glowSprite('#ffd8a0',7,.15),0,2.6,0));
 g.userData.anim=t=>{R.position.y=2.6+Math.sin(t*.4)*.3;R.rotation.y=t*.05;host.scale.setScalar(1+Math.sin(t)*.06)};return g}

/* ---------- 藏忆者: tiny six-limbed folk (four to walk, two to grip); memories kept in 10 cm metal cubes set into a wall ---------- */
function fxD_tiny6(col){const g=new THREE.Group();const sk=M(col||'#8a7a62',{roughness:.6});
 const b=sph(0,.12,.07,.07,10,sk);b.position.set(-.06,.15,0);g.add(b);const tr=sph(0,.06,.1,.06,10,sk);tr.position.set(.06,.24,0);g.add(tr);const hd=sph(0,.06,.055,.055,10,sk);hd.position.set(.1,.36,0);g.add(hd);
 for(const z of[-1,1]){const e=eye(.012);e.position.set(.15,.37,z*.025);g.add(e)}
 const L=[];for(const [x,z] of [[.02,1],[.02,-1],[-.13,1],[-.13,-1]]){const l=leg2(.07,.08,.016,sk,-.4);l.position.set(x,.15,z*.05);l.rotation.z=.2;l.rotation.x=z*.25;g.add(l);L.push(l)}
 const A=[];for(const z of[-1,1]){const a=leg2(.07,.07,.013,sk,1.3);a.position.set(.08,.3,z*.06);a.rotation.z=.5;g.add(a);A.push(a)}g.userData.L=L;g.userData.A=A;return g}
function fxD_cangyi(){const g=new THREE.Group();const st=detailMat(M('#4a4a52',{roughness:.9}).clone(),{bump:.8,freq:3});
 const wall=new THREE.Mesh(kb(.5,2.6,4.4),st);wall.position.set(-.25,1.3,0);g.add(wall);
 const nx=12,ny=7,cs=.24,gap=.31;g.userData.noSkin=1;const cube=new THREE.InstancedMesh(kb(cs,cs,cs),M('#b4bcc4',{metalness:.45,roughness:.3}),nx*ny);let n=0;const mt=new THREE.Matrix4();const lit=[];
 for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){if(h3(i,j,2)<.1)continue;mt.makeTranslation(.06,.35+j*gap,(i-(nx-1)/2)*gap);cube.setMatrixAt(n++,mt);if(h3(i,j,5)<.22)lit.push(V3(.19,.35+j*gap,(i-(nx-1)/2)*gap))}cube.count=n;g.add(cube);
 g.add(sparkles(lit,'#8ac8ff',.08,1,1));
 const crane=new THREE.Group();const cm=M('#6a6e74',{metalness:.6,roughness:.4});const cp=cyl(.04,.05,1.9,cm,6);cp.position.y=.95;crane.add(cp);const arm=new THREE.Group();arm.position.y=1.85;crane.add(arm);const ab=new THREE.Mesh(kb(.7,.05,.05),cm);ab.position.x=-.3;arm.add(ab);
 const held=new THREE.Mesh(kb(cs,cs,cs),M('#9aa2aa',{metalness:.75,roughness:.28}));held.position.set(-.62,-.15,0);arm.add(held);crane.position.set(.9,0,.9);g.add(crane);
 const fl=new THREE.Mesh(kb(2.2,.04,4.4),M('#3a3a40',{roughness:.9}));fl.position.set(.9,.02,0);g.add(fl);
 const folk=[];for(let i=0;i<7;i++){const f=fxD_tiny6(i%3?'#8a7a62':'#9a8a70');f.scale.setScalar(1.25);f.userData.p=[.6+h3(i,1,7)*1.2,(h3(i,2,7)-.5)*3.6];f.position.set(f.userData.p[0],.04,f.userData.p[1]);g.add(f);folk.push(f)}
 const carry=new THREE.Mesh(kb(cs*.8,cs*.8,cs*.8),M('#9aa2aa',{metalness:.75,roughness:.28}));carry.position.set(.2,.46,0);folk[0].add(carry);folk[0].userData.A.forEach(a=>a.rotation.z=1.2);
 g.userData.anim=t=>{folk.forEach((f,i)=>{const w=i%2===0;const q=t*.35+i;if(w){f.position.z=f.userData.p[1]+Math.sin(q)*.6;f.rotation.y=Math.cos(q)>0?-Math.PI/2:Math.PI/2}f.userData.L.forEach((l,k)=>{l.rotation.z=.2+(w?Math.sin(t*8+k*Math.PI*.5+i)*.4:0)});if(i)f.userData.A.forEach((a,k)=>a.rotation.z=.5+Math.sin(t*2+k+i)*.3)});arm.rotation.y=Math.sin(t*.3)*.8;arm.position.y=1.5+Math.sin(t*.5)*.3};return g}

/* ---------- 最接近尔什的生物: an old soft-bodied cephalopod with no shell; its skin keeps shifting colour ---------- */
function fxD_closest(){const g=bSquid({col:'#7a6a8a'});g.scale.setScalar(1.2);g.userData.noSkin=1;const mats=new Set();g.traverse(c=>{if(c.isMesh&&c.material&&c.material.emissive&&c.material.color.getHexString()==='7a6a8a')mats.add(c.material)});
 const a0=g.userData.anim;g.userData.anim=t=>{a0(t);for(const m of mats)m.color.setHSL((.75+t*.06)%1,.45,.42)};return g}

/* ---------- 岩皮: rock-skinned, with glowing blue eyes ---------- */
function fxD_yanpi(){const g=bRockSkin();for(const z of[-1,1]){const e=glowEye(.075,'#5ac8ff');e.position.set(1.37,.72,z*.2);g.add(e);g.add(at(glowSprite('#5ac8ff',.55,.8),1.4,.72,z*.2))}return g}

/* ---------- 银河舰长: a creature shaped like a galaxy, over 10 m across, made of countless white and blue points ---------- */
function fxD_galaxy(){const g=new THREE.Group();const disc=new THREE.Group();disc.position.y=3.2;disc.rotation.x=.45;disc.rotation.z=.15;g.add(disc);
 const wp=[],bp=[],cp=[];const Rn=rnd(77);for(let arm=0;arm<3;arm++)for(let i=0;i<420;i++){const q=Math.pow(Rn(),.8);const r=.35+q*4.6;const a=arm/3*6.283+Math.log(r+.3)*2.4+(Rn()-.5)*.45*(1-q*.4);const sp=(Rn()-.5)*.5*(1-q*.6);
  const v=V3(Math.cos(a)*r+sp,(Rn()-.5)*.22*(1.2-q),Math.sin(a)*r+sp);(Rn()<.45?bp:wp).push(v)}
 for(let i=0;i<260;i++){const v=V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize().multiplyScalar(Math.pow(Rn(),2)*1.1);v.y*=.5;cp.push(v)}
 const W=sparkles(wp,'#f4f8ff',.22,1,1),B=sparkles(bp,'#6a9eff',.26,1,1),Cc=sparkles(cp,'#ffffff',.24,1,1);disc.add(W);disc.add(B);disc.add(Cc);
 const hz=new THREE.Mesh(new THREE.CircleGeometry(4.8,48),new THREE.MeshBasicMaterial({color:'#3a5aa8',transparent:true,opacity:.05,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));hz.rotation.x=-Math.PI/2;disc.add(hz);
 const core=glowSprite('#dfeaff',2.2,.8);disc.add(core);disc.add(glowSprite('#6a9aff',6,.18));
 g.userData.anim=t=>{disc.rotation.y=t*.12;const k=1+Math.sin(t*1.4)*.05;disc.scale.set(k,1,k);core.material.opacity=.7+Math.sin(t*1.4)*.2;disc.position.y=3.2+Math.sin(t*.5)*.15};return g}

/* ---------- 花朵 · 爆吞: the drifting flower world, and the shark-shaped hunter hundreds of metres long that eats flowers ---------- */
function fxD_baotun(){const g=new THREE.Group();const sk=M('#3e4250',{roughness:.45,metalness:.15}),bel=M('#9aa0aa',{roughness:.5}),dk=M('#1a0a0c',{roughness:.8});
 const b=new THREE.Mesh(sharkGeo(7,.95,.85),sk);g.add(b);const bl=new THREE.Mesh(sharkGeo(5.6,.7,.7),bel);bl.position.set(.3,-.28,0);bl.scale.y=.6;g.add(bl);
 const df=new THREE.Mesh(wingGeo(1.4,1.4,'fin'),sk);df.rotation.x=-Math.PI/2;df.position.set(.2,.75,0);g.add(df);
 const tl=new THREE.Group();tl.position.x=-3.2;g.add(tl);for(const s of[1,-1]){const f=new THREE.Mesh(wingGeo(1.6,1.2,'fin'),sk);f.rotation.x=s*-Math.PI/2;f.rotation.z=s>0?.3:-.5;tl.add(f)}
 for(const z of[-1,1]){const p=new THREE.Mesh(wingGeo(1.3,.9,'fin'),sk);p.position.set(1.2,-.35,z*.55);p.rotation.y=z*-.4;p.rotation.x=z*.3;if(z<0)p.scale.z=-1;g.add(p);const e=eye(.07,'#d8e8f0');e.position.set(2.75,.25,z*.42);g.add(e)}
 const mouth=new THREE.Mesh(new THREE.SphereGeometry(.5,14,8),dk);mouth.scale.set(.5,.35,.6);mouth.position.set(3.05,-.12,0);g.add(mouth);const tm=M('#f0ece0');for(let i=0;i<10;i++){const t=cone(.03,.12,tm,4);const a=i/10*Math.PI*2;t.position.set(3.2,-.12+Math.sin(a)*.18,Math.cos(a)*.27);t.rotation.z=Math.sin(a)>0?Math.PI:0;g.add(t)}
 g.userData.tl=tl;return g}
function fxD_huaduo(){const g=bFlowerWorld();const hunter=g.children[g.children.length-1];g.remove(hunter);const s=fxD_baotun();s.scale.setScalar(1.1);g.add(s);
 const a0=g.userData.anim;g.userData.anim=t=>{a0(t);const a=t*.18+2.2;s.position.set(Math.cos(a)*7.5,2.2+Math.sin(t*.4)*.6,Math.sin(a)*7.5);s.rotation.y=-a-Math.PI/2+.12;s.rotation.z=Math.sin(t*.7)*.06;s.userData.tl.rotation.y=Math.sin(t*2.4)*.35};return g}

/* ---------- 雪原 · 雪光: one-metre limbless hoppers in a band on the white plain; the leader carries a living torch on its head ---------- */
function fxD_snow(){const g=new THREE.Group();const plain=new THREE.Mesh(new THREE.CircleGeometry(5.5,40),M('#f4f4f0',{roughness:1}));plain.rotation.x=-Math.PI/2;plain.position.y=.03;g.add(plain);
 const prof=[];for(let i=0;i<=12;i++){const q=i/12;prof.push(new THREE.Vector2(Math.max(.01,Math.sin(Math.PI*Math.pow(q,.75))*.36*(1-.25*q)),q*1.0))}const geo=new THREE.LatheGeometry(prof,16);
 const skin=M('#dde4ea',{roughness:.5}),dk=M('#3a4048',{roughness:.3});const hop=[];
 for(let i=0;i<16;i++){const b=new THREE.Group();const m=new THREE.Mesh(geo,skin);b.add(m);for(const z of[-1,1]){const e=sph(0,.04,.05,.03,6,dk);e.position.set(.28,.68,z*.1);b.add(e)}
  b.scale.setScalar(1.2);const a=i*2.4,r=i?1.1+Math.sqrt(i)*.75:0;b.userData.p=[-Math.abs(Math.cos(a))*r-(i?.3:0),Math.sin(a)*r];b.position.set(b.userData.p[0],0,b.userData.p[1]);g.add(b);hop.push(b)}
 const lead=hop[0];const tc=new THREE.Group();tc.position.y=.95;lead.add(tc);const tm=M('#7a3a2a',{roughness:.6});const st=cyl(.06,.09,.5,tm,7);st.position.y=.25;tc.add(st);for(let k=0;k<3;k++){const r=new THREE.Mesh(new THREE.TorusGeometry(.085,.02,4,10),M('#5a2a1a'));r.rotation.x=Math.PI/2;r.position.y=.1+k*.13;tc.add(r)}
 for(let k=0;k<4;k++){const ro=tubeAlong([V3(0,.05,0),V3(Math.cos(k*1.6)*.12,-.05,Math.sin(k*1.6)*.12),V3(Math.cos(k*1.6)*.2,-.25,Math.sin(k*1.6)*.2)],.015,tm,5);tc.add(ro)}
 const fc=cone(.1,.3,EM('#ffb040',1.2),8);fc.position.y=.62;tc.add(fc);const fl=emitter({n:40,life:.8,speed:.6,spread:.3,size:.5,dir:[0,1,0],col:'#ffd070',col2:'#ff5010',op:.9,area:[.12,.06,.12]});fl.position.y=.62;tc.add(fl);tc.add(at(glowSprite('#ffb050',3,.6),0,.65,0));
 const halo=new THREE.Mesh(new THREE.CircleGeometry(3.2,40),new THREE.MeshBasicMaterial({color:'#ffcf8a',transparent:true,opacity:.14,depthWrite:false}));halo.rotation.x=-Math.PI/2;halo.position.set(-1,.05,0);g.add(halo);
 const mt3=new THREE.Mesh(new THREE.ConeGeometry(2.2,5.5,10),M('#e8eef0',{roughness:.9}));mt3.position.set(-5.5,2.75,-4.5);g.add(mt3);
 g.userData.anim=t=>hop.forEach((b,i)=>{const q=(t*1.4+i*.37)%1;const h=Math.sin(q*Math.PI);b.position.y=h*.5;const sq=q<.12?1-(.12-q)*2:1;b.scale.set(1.2*(1+(1-sq)*.6),1.2*sq*(1+h*.08),1.2*(1+(1-sq)*.6));b.position.x=b.userData.p[0]+((t*.3)%1)*0});return g}

/* ---------- 尘鳄: crocodile-like, a soft white skin glittering like crystal that sheds white dust as it walks.
   o.mech: the mechanical kind; o.tiny: the little mechanical one with a name written by its mouth ---------- */
function fxD_croc(o){o=o||{};const g=new THREE.Group();if(o.mech)g.userData.noSkin=1;const sk=o.mech?M('#a0a8b0',{metalness:.45,roughness:.3}):M('#f2f2f6',{roughness:.3,metalness:.05});const sk2=o.mech?M('#6a7078',{metalness:.45,roughness:.35}):M('#e4e4ec',{roughness:.35});
 const bg=sharkGeo(3.2,.45,1.1);const b=new THREE.Mesh(bg,sk);b.position.y=.45;b.scale.y=.6;g.add(b);
 const sn=cyl(.1,.24,.95,sk,12);sn.rotation.z=-Math.PI/2;sn.scale.set(.5,1,1);sn.position.set(1.8,.44,0);g.add(sn);const nt=sph(0,.08,.05,.08,8,sk);nt.position.set(2.27,.46,0);g.add(nt);const lj=cyl(.06,.18,.88,sk2,10);lj.rotation.z=-Math.PI/2;lj.scale.set(.4,1,1);lj.position.set(1.76,.33,0);g.add(lj);
 const tth=M('#ffffff',{roughness:.3});for(let i=0;i<7;i++)for(const z of[-1,1]){const t=cone(.015,.05,tth,4);t.position.set(1.5+i*.1,.39,z*(.14-i*.015));t.rotation.x=Math.PI;g.add(t)}
 for(const z of[-1,1]){const br=sph(0,.12,.08,.09,8,sk);br.position.set(1.22,.6,z*.15);g.add(br);const e=o.mech?glowEye(.05,'#ff5a3a'):eye(.045,'#2a2a30');e.position.set(1.27,.65,z*.16);g.add(e)}
 for(let i=0;i<6;i++){const r=sph(0,.16,.04,.1,8,sk2);r.position.set(.7-i*.38,.7-i*.015,0);g.add(r)}
 const L=[];for(const[x,z]of[[.6,-1],[.6,1],[-.6,-1],[-.6,1]]){const l=leg2(.25,.25,.07,sk,.9);l.position.set(x,.4,z*.35);l.rotation.x=z*.9;g.add(l);L.push({m:l,ph:(x>0?0:Math.PI)+(z>0?Math.PI:0),a:.5})}
 const tl=new THREE.Group();tl.add(tubeAlong([V3(-1.5,.4,0),V3(-2.3,.35,0),V3(-3,.3,0)],.11,sk,10));g.add(tl);
 if(o.mech){const sm=M('#3a3e44',{metalness:.5,roughness:.3});for(let i=0;i<4;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(.4-Math.abs(i-1)*.06,.018,4,20),sm);r.rotation.y=Math.PI/2;r.position.set(.8-i*.6,.45,0);r.scale.set(1,.6,1.1);g.add(r)}}
 else{const pts=[];const P=bg.attributes.position;for(let i=0;i<P.count;i+=3){if(P.getY(i)<-.1)continue;pts.push(V3(P.getX(i),P.getY(i)*.6+.45,P.getZ(i)).multiplyScalar(1.01))}g.add(sparkles(pts,'#ffffff',.06,1,1));
  const d=emitter({n:60,life:2.4,speed:.35,spread:.6,size:.7,dir:[0,-1,0],col:'#f6f4ee',op:.6,add:false,tex:smokeTex,area:[2.4,.3,.6]});d.position.y=.4;g.add(d)}
 if(o.tiny){const cv=canvasTex(160,40,x=>{x.clearRect(0,0,160,40);x.fillStyle='#f4e8c0';x.font='26px serif';x.fillText('斯拉哥达毕',6,30)});const tx=new THREE.Mesh(new THREE.PlaneGeometry(.7,.175),new THREE.MeshBasicMaterial({map:cv,transparent:true,side:THREE.DoubleSide,depthWrite:false}));tx.position.set(1.62,.42,.2);tx.rotation.y=-.18;g.add(tx);const tx2=tx.clone();tx2.position.z=-.2;tx2.rotation.y=Math.PI+.18;tx2.rotation.y=Math.PI;g.add(tx2)}
 addLegs(g,L);g.userData.tails=[{m:tl,a:.25,f:2.5}];stdAnim(g,{fq:5,amp:.4});g.add(shadow(1.4));return g}

/* ---------- 玛雅的爆哮虫: small and mechanical, riding on the scholar's shoulder ---------- */
function fxD_baoxiao(){const g=fxD_scholar();const r=fxD_mechRoarer();r.scale.setScalar(.24);r.position.copy(g.userData.xmShoulder);r.rotation.y=.3;g.add(r);const a0=g.userData.anim;g.userData.anim=t=>{a0(t);r.userData.anim(t)};return g}
function fxD_xuezhe(){const g=fxD_scholar();const r=fxD_mechRoarer();r.scale.setScalar(.2);r.position.copy(g.userData.xmShoulder);g.add(r);const c=fxD_croc({mech:1});c.scale.setScalar(.45);c.position.set(-1.2,0,1.2);g.add(c);
 const a0=g.userData.anim;g.userData.anim=t=>{a0(t);r.userData.anim(t);c.userData.anim(t)};return g}

/* ---------- 跳跃者: a 骸龙 leaping down with an axe bigger than itself onto a boat chased by a whirlwind ---------- */
function fxD_jumper(){const g=new THREE.Group();const wood=M('#7a5a3a',{roughness:.8});
 const boat=new THREE.Mesh(sharkGeo(3,.5,1.2),wood);boat.position.set(1.2,.2,0);boat.scale.y=.5;g.add(boat);const mast=cyl(.04,.05,2.4,wood,6);mast.position.set(1.3,1.4,0);g.add(mast);
 const sail=new THREE.Mesh(new THREE.PlaneGeometry(1.2,1.5),M('#efe6d0',{side:THREE.DoubleSide,roughness:.9}));sail.position.set(1.3,1.6,.02);g.add(sail);const emb=new THREE.Mesh(new THREE.CircleGeometry(.3,18),M('#fff8ec',{side:THREE.DoubleSide,emissive:'#fff0d0',emissiveIntensity:.4}));emb.position.set(1.3,1.65,.04);g.add(emb);
 for(let i=0;i<3;i++){const d=bDragonkin({w:'gulong'});d.scale.setScalar(.3);d.position.set(.4+i*.55,.35,(i-1)*.25);d.rotation.y=.5;g.add(d)}
 const sea=new THREE.Mesh(new THREE.CircleGeometry(5,32),M('#3a5a7a',{roughness:.15,metalness:.2}));sea.rotation.x=-Math.PI/2;sea.position.y=.02;g.add(sea);
 const wind=emitter({n:120,life:2,speed:.4,spread:.2,size:.9,dir:[0,1,0],col:'#d8e0e8',op:.35,add:false,tex:smokeTex,area:[.6,3,.6],wander:1});wind.position.set(-2.6,1.5,0);g.add(wind);
 const j=new THREE.Group();g.add(j);const d=bDragonkin({w:'gulong'});d.scale.setScalar(.62);j.add(d);
 const ax=new THREE.Group();ax.position.set(.3,1.2,.3);j.add(ax);const hdl=cyl(.045,.045,2.6,M('#5a3a22'),6);hdl.position.y=.7;ax.add(hdl);const bm=M('#d0d4d8',{metalness:.45,roughness:.25});
 for(const s of[1,-1]){const sh=new THREE.Shape();sh.moveTo(0,-.1);sh.quadraticCurveTo(s*.5,-.55,s*.85,-.5);sh.quadraticCurveTo(s*.6,.2,s*.85,.65);sh.quadraticCurveTo(s*.5,.55,0,.12);const bl=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:.05,bevelEnabled:false}),bm);bl.scale.setScalar(1.25);bl.position.set(0,1.75,-.03);ax.add(bl)}
 const tr=[];for(let i=0;i<16;i++){const q=i/15;tr.push(V3(-2.4+q*3.2,.6+Math.sin(q*Math.PI)*2.8,0))}g.add(sparkles(tr,'#fff4d0',.25,1,1));
 g.userData.anim=t=>{const q=.25+((t*.25)%1)*.6;j.position.set(-2.4+q*3.2,.3+Math.sin(q*Math.PI)*2.8,0);j.rotation.z=-.4+q*.5;ax.rotation.z=1.6-q*3.2;d.userData.anim&&d.userData.anim(t);sail.rotation.y=Math.sin(t*1.2)*.05};return g}

/* ---------- 奇布查虫 (the site): a grey stone spire about a metre tall full of holes, sounding like a flute;
   tiny many-coloured four-legged beetles crawl on it and lift off ---------- */
function fxD_chibcha2(){const g=new THREE.Group();const st=detailMat(M('#8a8884',{roughness:.95}).clone(),{bump:1.2,freq:4});
 const prof=[];for(let i=0;i<=14;i++){const q=i/14;prof.push(new THREE.Vector2(Math.max(.02,.42*(1-q)*(1-q*.25)+.03*Math.sin(q*14)),q*2.2))}const sp=new THREE.Mesh(new THREE.LatheGeometry(prof,14),st);g.add(sp);
 const pit=M('#0e0c0a',{roughness:1});for(let i=0;i<22;i++){const q=.05+h3(i,1,1)*.8;const r=.42*(1-q)*(1-q*.25)+.02;const a=h3(i,2,1)*6.283;const hs=.05+h3(i,3,1)*.05;const h=sph(0,hs,hs*1.3,hs*.5,8,pit);h.position.set(Math.cos(a)*r,q*2.2,Math.sin(a)*r);h.lookAt(V3(Math.cos(a)*5,q*2.2,Math.sin(a)*5));g.add(h)}
 const cols=['#e84a4a','#f0c030','#4a9ae8','#4ac870','#b060e0','#ff8a3a','#40d8d0'];const bugs=[];const wm=new THREE.MeshStandardMaterial({color:'#e8f0ff',transparent:true,opacity:.45,side:THREE.DoubleSide,depthWrite:false});
 for(let i=0;i<18;i++){const b=new THREE.Group();b.scale.setScalar(2.2);const sh=sph(0,.07,.045,.055,8,M(cols[i%cols.length],{roughness:.25,metalness:.2}));sh.position.y=.04;b.add(sh);const hd=sph(0,.025,.022,.025,6,M('#1a1a1a'));hd.position.set(.07,.04,0);b.add(hd);
  for(let k=0;k<4;k++){const l=limb(.05,.006,.004,M('#1a1a1a'));l.position.set(k<2?.03:-.03,.03,(k%2?1:-1)*.04);l.rotation.x=(k%2?1:-1)*1;b.add(l)}
  const ws=[];for(const z of[-1,1]){const w=wing(.12,.05,wm,'insect');w.position.set(0,.07,z*.02);if(z<0)w.scale.z=-1;b.add(w);ws.push(w)}b.userData.ws=ws;b.userData.fly=i%3!==0;b.userData.ph=i/18;b.userData.a=h3(i,4,2)*6.283;g.add(b);bugs.push(b)}
 const fm=M('#1e2a24',{roughness:.8}),cap=M('#2e3a30',{roughness:.7});for(let i=0;i<4;i++){const a=i*1.57+.5,r=1.9+h3(i,1,3)*.4,hh=.6+h3(i,2,3)*.5;const s=cyl(.03,.05,hh,fm,6);s.position.set(Math.cos(a)*r,hh/2,Math.sin(a)*r);g.add(s);const c=sph(0,.22,.09,.22,10,cap);c.position.set(Math.cos(a)*r,hh,Math.sin(a)*r);g.add(c)}
 const sw=bSoundWave({col:'#a8ffd8'});sw.scale.setScalar(.3);sw.position.set(0,2.1,0);g.add(sw);g.add(swarmPts(40,1.6,'#d8d0b8',.04,3));g.add(shadow(.8));
 g.userData.anim=t=>{sw.userData.anim&&sw.userData.anim(t);bugs.forEach((b,i)=>{const a=b.userData.a;if(b.userData.fly){const q=(t*.18+b.userData.ph)%1;const r=.35+q*1.4;b.position.set(Math.cos(a+q*4)*r,.2+q*2.6,Math.sin(a+q*4)*r);b.rotation.y=-(a+q*4)-Math.PI/2;b.userData.ws.forEach((w,k)=>w.rotation.x=(k?-1:1)*(.3+Math.sin(t*40+i)*.6))}
  else{const q=.15+((t*.04+b.userData.ph)%1)*.6;const r=.42*(1-q)*(1-q*.25)+.04;b.position.set(Math.cos(a)*r,q*2.2,Math.sin(a)*r);b.rotation.set(0,-a,Math.PI/2*.8);b.userData.ws.forEach(w=>w.rotation.x=0)}})};return g}

/* ---------- 暗藻: its spreading neural net on the sea, and the later obsidian body like a stegosaur, about 30 m:
   six thick clawed limbs, bone spikes along the back, hooked spikes on the tail ---------- */
function fxD_stego(){const g=new THREE.Group();const ob=M('#0c0c12',{roughness:.1,metalness:.6}),bone=M('#e6dec8',{roughness:.6}),cl=M('#2a2a30',{roughness:.3,metalness:.6});
 const b=sph(0,1.7,1.0,.85,20,ob);b.position.set(0,1.6,0);g.add(b);const nk=sph(0,.6,.42,.4,12,ob);nk.position.set(1.55,1.15,0);g.add(nk);const hd=sph(0,.42,.24,.25,12,ob);hd.position.set(2.1,.85,0);hd.rotation.z=-.3;g.add(hd);
 for(const z of[-1,1]){const e=eye(.035,'#6a2aff');e.position.set(2.32,.95,z*.15);g.add(e)}
 const tail=[V3(-1.4,1.6,0),V3(-2.3,1.4,0),V3(-3.1,1.0,0),V3(-3.7,.8,.2)];g.add(tubeAlong(tail,.22,ob,16));const tc=new THREE.CatmullRomCurve3(tail);
 for(let i=0;i<8;i++){const p=tc.getPoint(.2+i*.1);for(const z of[-1,1]){const h=tubeAlong([V3(0,0,0),V3(0,.18,z*.12),V3(.12,.3,z*.16)],.025,bone,5);h.position.copy(p);g.add(h)}}
 for(let i=0;i<14;i++){const x=-1.45+i*.22;const hh=.3+Math.sin(i/13*Math.PI)*.45;for(const z of[-1,0,1]){const s=cone(.05,hh*(z?1:1.2),bone,5);const top=1.6+Math.sqrt(Math.max(0,1-Math.pow(x/1.7,2)))*(z?.85:1)-(z?.05:0);s.position.set(x+(z?.1:0),top+hh*.3,z*.3);s.rotation.x=z*.5;g.add(s)}}
 for(let i=0;i<6;i++){const z=i%2?1:-1,k=Math.floor(i/2);const l=leg2(.6,.62,.24,ob,.4);l.position.set(1-k*1,1.25,z*.55);l.rotation.z=-.15;l.rotation.x=z*.2;g.add(l);for(let c=0;c<3;c++){const cw=cone(.05,.2,cl,4);cw.position.set(.16,-.64,(c-1)*.1);cw.rotation.z=-Math.PI/2-.4;l.userData.knee.add(cw)}}
 g.add(shadow(2.2));return g}
function fxD_anzao(){const g=bAlgaeNet();const s=fxD_stego();s.scale.setScalar(.85);s.position.set(.2,0,.4);s.rotation.y=.4;g.add(s);return g}

/* ---------- 珀岩记录者: an opaque rock over a hundred metres tall wandering the plain; its brain grows out of its back
   like amber branches, breaks off into heaps and sometimes melts into an amber lake that the riders live beside ---------- */
function fxD_poyan(){const g=new THREE.Group();const geo=fxD_lump(2.4,.22,1.0,9.3,3,1.3,1,1.05);const P=geo.attributes.position;for(let i=0;i<P.count;i++){if(P.getY(i)>1.5)P.setY(i,1.5+(P.getY(i)-1.5)*.15)}geo.computeVertexNormals();
 const rk=new THREE.Mesh(geo,detailMat(M('#6e6458',{roughness:.95}).clone(),{bump:1.4,freq:2}));rk.position.y=2.7;g.add(rk);
 const lm=M('#544a40',{roughness:.95});const L=[];for(let i=0;i<6;i++){const s=i%2?1:-1,k=Math.floor(i/2);const l=leg2(.7,.75,.38,lm,.4);l.position.set(1.4-k*1.4,1.4,s*1.3);l.rotation.x=s*.25;g.add(l);L.push({m:l,ph:k+(s>0?Math.PI:0),a:.12})}
 const am=new THREE.MeshStandardMaterial({color:'#e8a030',emissive:'#a85a10',emissiveIntensity:.55,roughness:.2,metalness:.1});const am2=new THREE.MeshStandardMaterial({color:'#f0b848',emissive:'#c87018',emissiveIntensity:.8,roughness:.1,transparent:true,opacity:.9});
 const top=4.2;const pool=new THREE.Mesh(new THREE.CircleGeometry(.9,24),am2);pool.rotation.x=-Math.PI/2;pool.position.set(.6,top+.03,.4);g.add(pool);g.add(at(glowSprite('#ffb040',2.6,.4),.6,top+.2,.4));
 const br=(p,d,len,r,lv)=>{const e=p.clone().addScaledVector(d,len);g.add(tubeAlong([p,p.clone().lerp(e,.5).add(V3((h3(lv,p.x,1)-.5)*.1,0,(h3(lv,p.z,2)-.5)*.1)),e],r,am,6));if(lv<3){for(let k=0;k<2;k++){const nd=d.clone().add(V3((h3(lv,k,p.x)-.5)*1.4,.2,(h3(k,lv,p.z)-.5)*1.4)).normalize();br(e,nd,len*.68,r*.65,lv+1)}}else{const t=sph(0,r*2,r*2,r*2,6,am);t.position.copy(e);g.add(t)}};
 [[-1.2,-.5],[-.6,.9],[-1.7,.7]].forEach(([x,z],i)=>br(V3(x,top-.05,z),V3((h3(i,1,1)-.5)*.3,1,(h3(i,2,1)-.5)*.3).normalize(),.8,.07,0));
 for(let i=0;i<14;i++){const c=new THREE.Mesh(ko(.1+h3(i,3,2)*.1),am);c.position.set(-.6+(h3(i,1,2)-.5)*1.1,top+.05+h3(i,4,2)*.25,-.9+(h3(i,2,2)-.5)*.8);c.rotation.set(i,i*2,0);g.add(c)}
 for(let i=0;i<6;i++){const h=new THREE.Mesh(geoC('house','#c8b898','#7a5a3a'),VC());const a=i/6*6.283;h.position.set(.6+Math.cos(a)*1.25,top,.4+Math.sin(a)*1.1);h.scale.setScalar(.28);h.rotation.y=-a;g.add(h)}
 addLegs(g,L);stdAnim(g,{fq:1.2,amp:.12,extra:t=>{rk.position.y=2.7+Math.sin(t*2.4)*.03;am2.emissiveIntensity=.7+Math.sin(t*.8)*.2}});g.add(shadow(3));return g}

/* ---------- 粘粉圆木: a hollow log with no legs drifting through dust; sticky threads inside, a mouth that opens ---------- */
function fxD_zhanfen(){const g=new THREE.Group();const lg=new THREE.Group();lg.position.y=1.5;g.add(lg);
 const bark=detailMat(M('#6a5a4a',{roughness:.95,side:THREE.DoubleSide}).clone(),{bump:1.4,freq:2});const tube=new THREE.Mesh(new THREE.CylinderGeometry(1,1.08,4.6,16,4,true),bark);tube.rotation.z=Math.PI/2;lg.add(tube);
 const inner=new THREE.Mesh(new THREE.CylinderGeometry(.9,.98,4.55,16,1,true),M('#8a7050',{roughness:.6,side:THREE.BackSide,emissive:'#3a2a10',emissiveIntensity:.25}));inner.rotation.z=Math.PI/2;lg.add(inner);
 const tm=new THREE.MeshStandardMaterial({color:'#e8d870',emissive:'#6a5a10',emissiveIntensity:.35,transparent:true,opacity:.6,roughness:.15,depthWrite:false});
 for(let i=0;i<22;i++){const x=-2+h3(i,1,6)*4,a=h3(i,2,6)*6.283,b2=a+2+h3(i,3,6)*2.3;const p=V3(x,Math.cos(a)*.9,Math.sin(a)*.9),q=V3(x+(h3(i,4,6)-.5)*1.2,Math.cos(b2)*.9,Math.sin(b2)*.9);const m=p.clone().lerp(q,.5).multiplyScalar(1).setX((p.x+q.x)/2);m.y*=.6;m.z*=.6;m.y-=.12;lg.add(tubeAlong([p,m,q],.012+h3(i,5,6)*.014,tm,8))}
 for(let i=0;i<10;i++){const d=sph(0,.06,.09,.06,6,tm);d.position.set(-2+h3(i,7,6)*4,-.6+h3(i,8,6)*.3,(h3(i,9,6)-.5)*.8);lg.add(d)}
 const mouth=new THREE.Group();mouth.position.x=2.3;lg.add(mouth);const lip=new THREE.Mesh(new THREE.TorusGeometry(.95,.16,8,24),M('#7a5a4a',{roughness:.6}));lip.rotation.y=Math.PI/2;mouth.add(lip);
 const pg=new THREE.BufferGeometry().setFromPoints([V3(0,0,-.52),V3(0,0,.52),V3(0,-.95,0)]);pg.computeVertexNormals();const pm=M('#8a6a50',{side:THREE.DoubleSide,roughness:.7});const fl=[];
 for(let i=0;i<6;i++){const f=new THREE.Group();f.rotation.x=i/6*6.283;mouth.add(f);const h=new THREE.Group();h.position.y=.95;f.add(h);h.add(new THREE.Mesh(pg,pm));fl.push(h)}
 const back=new THREE.Mesh(new THREE.CircleGeometry(.95,16),M('#c8c070',{roughness:.2,emissive:'#5a5a1a',emissiveIntensity:.3}));back.rotation.y=Math.PI/2;back.position.x=-2.2;lg.add(back);
 const dust=emitter({n:120,life:4,speed:.3,spread:1,size:2.2,dir:[1,0,0],col:'#c8b898',op:.3,add:false,tex:smokeTex,area:[7,3,4],wander:.5});dust.position.y=1.5;g.add(dust);
 const suck=emitter({n:50,life:1.6,speed:1.2,spread:.2,size:.2,dir:[-1,0,0],col:'#d8c8a0',op:.7,add:false,area:[.4,1.4,1.4]});suck.position.set(3.4,0,0);lg.add(suck);
 g.userData.anim=t=>{lg.position.y=1.5+Math.sin(t*.5)*.25;lg.rotation.x=t*.08;lg.rotation.z=Math.sin(t*.3)*.05;g.position.x=Math.sin(t*.2)*.3;const k=Math.max(0,Math.sin(t*.9));fl.forEach(h=>h.rotation.z=.15+k*1.25)};return g}

/* ---------- the three moons by Midgard's exit: the first turning to glittering orange crystal, the second orange-red
   and boiling through cracks, the third cut down to a hemisphere with tangled vine-like growth over the cut ---------- */
function fxD_moons(){const g0=new THREE.Group();const g=new THREE.Group();g.position.y=1.6;g0.add(g);
 const m1=sph(0,1.3,1.3,1.3,24,M('#b8784a',{roughness:.7}));m1.position.set(-4.2,.3,0);g.add(m1);const cm=new THREE.MeshStandardMaterial({color:'#ffb050',emissive:'#c86010',emissiveIntensity:.6,roughness:.1,metalness:.3,flatShading:true});
 for(let i=0;i<46;i++){const v=V3(h3(i,1,4)-.5,h3(i,2,4)-.5,h3(i,3,4)-.5).normalize();const c=new THREE.Mesh(ko(.1+h3(i,4,4)*.16),cm);c.position.copy(v).multiplyScalar(1.28).add(m1.position);c.quaternion.setFromUnitVectors(V3(0,1,0),v);c.scale.y=1.8;g.add(c)}
 g.add(sparkles(Array.from({length:60},(_,i)=>V3(h3(i,5,4)-.5,h3(i,6,4)-.5,h3(i,7,4)-.5).normalize().multiplyScalar(1.33).add(V3(-4.2,.3,0))),'#ffe0a0',.12,1,1));
 const ctex=canvasTex(512,256,x=>{x.fillStyle='#8a2a10';x.fillRect(0,0,512,256);for(let i=0;i<70;i++){let px=Math.random()*512,py=Math.random()*256;x.strokeStyle=i%3?'#ffb040':'#ff6a20';x.lineWidth=1+Math.random()*3;x.beginPath();x.moveTo(px,py);for(let k=0;k<6;k++){px+=(Math.random()-.5)*60;py+=(Math.random()-.5)*40;x.lineTo(px,py)}x.stroke()}});
 const m2m=new THREE.MeshStandardMaterial({color:'#c8502a',map:ctex,emissive:'#ffffff',emissiveMap:ctex,emissiveIntensity:.5,roughness:.8});const m2=new THREE.Mesh(sgeo(28),m2m);m2.scale.setScalar(1.15);m2.position.set(0,-.2,0);g.add(m2);g.add(at(glowSprite('#ff7a30',4,.35),0,-.2,0));
 const sp=emitter({n:60,life:1.4,speed:.8,spread:1,size:.25,dir:[0,1,0],col:'#ffb040',col2:'#ff3a10',op:.9,area:[2,2,2],grav:.6});sp.position.copy(m2.position);g.add(sp);
 const h=new THREE.Group();h.position.set(4,.4,0);h.rotation.set(.3,-.9,1.25);g.add(h);const hm=M('#9ab0b8',{roughness:.8});const hs=new THREE.Mesh(new THREE.SphereGeometry(1.1,24,12,0,Math.PI*2,0,Math.PI/2),hm);h.add(hs);
 const face=new THREE.Mesh(new THREE.CircleGeometry(1.1,32),M('#4a3a2a',{roughness:.9,side:THREE.DoubleSide}));face.rotation.x=Math.PI/2;h.add(face);
 const vm=M('#4a6a3a',{roughness:.7}),vm2=M('#6a7a4a',{roughness:.7});for(let i=0;i<26;i++){const a=h3(i,1,9)*6.283,b=a+1.5+h3(i,2,9)*3;const r1=.2+h3(i,3,9)*.85,r2=.2+h3(i,4,9)*.85;const p=V3(Math.cos(a)*r1,-.02,Math.sin(a)*r1),q=V3(Math.cos(b)*r2,-.02,Math.sin(b)*r2);const m=p.clone().lerp(q,.5);m.y=-.08-h3(i,5,9)*.12;h.add(tubeAlong([p,m,q],.02+h3(i,6,9)*.06,i%2?vm:vm2,8))}
 g.userData.anim=t=>{m1.rotation.y=t*.08;m2.rotation.y=t*.06;m2m.emissiveIntensity=.45+Math.max(0,Math.sin(t*1.7))*.35+Math.sin(t*5.3)*.05;h.rotation.y=-.9+t*.03};g0.userData.anim=g.userData.anim;return g0}

/* ---------- 边缘之地: the half-metre winding road over the dark; at its end a black metal gate, the pass is a small glowing ball
   pushed into a hole at the foot of the gate; past it the branching light-net ---------- */
function fxD_edge(){const g=new THREE.Group();const pts=[];for(let i=0;i<=40;i++){const t=i/40;pts.push(V3(t*10-5,Math.sin(t*9)*.8*(1-t*.6),Math.sin(t*6)*1.4*(1-t)))}const c=new THREE.CatmullRomCurve3(pts);const geo=new THREE.TubeGeometry(c,160,.12,4,false);geo.scale(1,.3,1);g.add(new THREE.Mesh(geo,GL('#ffe2a0',.8)));
 g.add(sparkles(pts.map(p=>p.clone().add(V3(0,.15,0))),'#fff4d0',.25,1,1));const end=pts[40];
 const gm=M('#202028',{metalness:.5,roughness:.3});const gt=new THREE.Group();gt.position.copy(end).add(V3(.3,0,0));g.add(gt);
 for(const z of[-1,1]){const p=new THREE.Mesh(kb(.25,2.6,.25),gm);p.position.set(0,1.2,z*.75);gt.add(p)}const li=new THREE.Mesh(kb(.35,.3,1.85),gm);li.position.y=2.55;gt.add(li);
 const door=new THREE.Group();gt.add(door);const dp=new THREE.Mesh(kb(.1,2.3,1.25),M('#18181e',{metalness:.5,roughness:.35}));dp.position.y=1.15;door.add(dp);for(let i=0;i<4;i++){const r=new THREE.Mesh(kb(.12,.04,1.2),gm);r.position.y=.4+i*.55;door.add(r)}
 const hole=new THREE.Mesh(new THREE.CircleGeometry(.07,12),M('#000000'));hole.rotation.y=-Math.PI/2;hole.position.set(-.06,.18,0);door.add(hole);
 const ball=sph(0,.09,.09,.09,10,GL('#fff2c0',1));g.add(ball);const bg=glowSprite('#fff0c0',.9,.85);g.add(bg);
 const net=[];const grow=(p,d,len,lv)=>{const e=p.clone().addScaledVector(d,len);net.push(p,e);if(lv<4)for(const s of[-1,1]){const nd=d.clone().applyAxisAngle(V3(0,1,0),s*(.4+h3(lv,p.z,s)*.4)).add(V3(0,(h3(p.x,lv,s)-.5)*.3,0)).normalize();grow(e,nd,len*.75,lv+1)}};
 grow(end.clone().add(V3(.6,.1,0)),V3(1,0,0),1.4,0);const nl=new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(net),new THREE.LineBasicMaterial({color:'#ffe8b0',transparent:true,opacity:.8,blending:THREE.AdditiveBlending,depthWrite:false}));g.add(nl);
 g.add(sparkles(net,'#fff4d0',.18,1,1));
 g.userData.anim=t=>{const q=(t*.12)%1;const pr=Math.min(1,q/.5);const bp=c.getPoint(.55+pr*.45);if(q<.5){ball.position.copy(bp).add(V3(0,.25,0))}else{ball.position.copy(end).add(V3(.24,.18,0))}bg.position.copy(ball.position);
  const up=q<.55?0:Math.min(1,(q-.55)/.3);door.position.y=up*2.2;nl.material.opacity=.15+.75*up};return g}

/* ---------- 导师 · 大蚊: the six-metre crane flies (no smoke), and a scaled ball for the mentor that made them ---------- */
function fxD_daowen(){const g=new THREE.Group();const m=bMosquito();for(const c of m.children.slice())if(c.isPoints)m.remove(c);g.add(m);
 const ball=new THREE.Group();ball.position.set(-3.6,5.2,-3.4);g.add(ball);const bm=M('#6a6070',{roughness:.45,metalness:.2}),bm2=M('#8a7e90',{roughness:.4,metalness:.2});const core=sph(0,1.5,1.5,1.5,18,bm);ball.add(core);
 for(let i=0;i<90;i++){const y=1-2*(i+.5)/90,r=Math.sqrt(1-y*y),a=i*2.39996;const v=V3(Math.cos(a)*r,y,Math.sin(a)*r);const s=sph(0,.34,.34,.08,8,i%2?bm2:bm);s.position.copy(v).multiplyScalar(1.5);s.lookAt(v.clone().multiplyScalar(3));s.rotateX(.35);ball.add(s)}
 const a0=m.userData.anim;g.userData.anim=t=>{a0&&a0(t);ball.rotation.y=t*.1;ball.position.y=5.2+Math.sin(t*.4)*.2};return g}

/* ---------- small fixes: 修炼生物 with big swords; the finger-like 舰长 floats ---------- */
function fxD_xiulian(){const g=new THREE.Group();const bl=M('#e0e4e8',{metalness:.45,roughness:.25}),hi=M('#4a3a2a'),gd=M('#3ab8b0',{metalness:.45,roughness:.3});
 for(let i=0;i<5;i++){const f=bFig({h:2,skin:'#c8b898',cloth:'#2a9a9a',cloth2:'#1a6a6a',hat:'helm',hatc:'#3ab8b0',head:'round'});const sw=new THREE.Group();const b=new THREE.Mesh(kb(.07,1.9,.24),bl);b.position.y=1.05;sw.add(b);const tp=cone(.12,.25,bl,4);tp.position.y=2.1;tp.scale.z=.3;sw.add(tp);const gu=new THREE.Mesh(kb(.1,.08,.6),gd);sw.add(gu);const h=cyl(.04,.04,.4,hi,6);h.position.y=-.22;sw.add(h);
  sw.position.set(.45,1.05,.38);sw.rotation.set(.15,0,-.35);f.add(sw);f.position.set((i-2)*1.4,0,Math.abs(i-2)*.5);g.add(f)}
 g.userData.anim=t=>g.children.forEach((c,i)=>{if(c.userData.anim)c.userData.anim(t*2+i);c.rotation.y=Math.sin(t*1.5+i)*.4});return g}
function fxD_jianzhang(){const g=bFingerCaptain();for(const c of g.children.slice())if(c.material===shadowMat)g.remove(c);const a0=g.userData.anim;g.userData.anim=t=>{a0(t);g.position.y=1.1+Math.sin(t*.7)*.25};return g}

/* ---------- the table ---------- */
Object.assign(ENT,{
 xm_general:[()=>fxD_xumin({cloth:'#c83a3a',cloth2:'#8a2a2a',medals:1,hat:'cap',hatc:'#8a2a2a',cape:'#8a2a2a',belt:'#e8c040'}),1],
 xm_nemo:[()=>fxD_xumin({armor:'#5a5e62',crack:1}),1],
 tlant:[fxD_scholar,1],
 c_xuezhe:[fxD_xuezhe,1],
 c_baoxiao:[fxD_baoxiao,1,{isle:1}],
 v_huhe_guard:[fxD_huhe,1,{isle:1}],
 v_gugu:[fxD_gugu,1,{isle:1}],
 v_huijin:[fxD_ashPair,1],
 ex_mother:[fxD_mother,1.3],
 ex_wushou:[fxD_wushou,1],
 v_se:[fxD_se,1,{isle:1}],
 v_yuanling:[fxD_yuanling,1.1],
 v_fudao:[fxD_fudao,1.1],
 v_cangyi:[fxD_cangyi,1.1,{isle:1}],
 ex_closest:[fxD_closest,1.1,{alt:.3,sea:1}],
 v_yanpi:[fxD_yanpi,1,{isle:1}],
 ng_galaxy:[fxD_galaxy,1.2],
 v_huaduo:[fxD_huaduo,1.1],
 ng_snow:[fxD_snow,1.1],
 mg_chene:[()=>fxD_croc({}),1.2,{walk:1}],
 mg_mini:[()=>fxD_croc({tiny:1,mech:1}),.7],
 dr_jumper:[fxD_jumper,1.1],
 v_chibcha2:[fxD_chibcha2,1.2,{isle:1}],
 v_anzao:[fxD_anzao,1.1],
 v_poyan:[fxD_poyan,1.1],
 v_zhanfen:[fxD_zhanfen,1,{isle:1}],
 mg_exit:[fxD_moons,2],
 dr_edge:[fxD_edge,1.4],
 bk_daowen:[fxD_daowen,1.1],
 mg_xiulian:[fxD_xiulian,1.1],
 ng_jianzhang:[fxD_jianzhang,1,{isle:1}],
});
