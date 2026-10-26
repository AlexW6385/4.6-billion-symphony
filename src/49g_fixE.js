/* ================================================================
   rebuilt bodies (set E): models brought back in line with what the novel describes.
   Each builder replaces an ENT entry at the end of this file. +x forward, +y up, ground y=0.
   ================================================================ */
// a soft ring of sound with its own material, so each ring can fade on its own
function fxE_soundRing(r,col,tube){return new THREE.Mesh(new THREE.TorusGeometry(r,tube||.035,4,32),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.5,blending:THREE.AdditiveBlending,depthWrite:false}))}
// point `o` (built along +y) along direction v
const fxE_UP=V3(0,1,0);
function fxE_aim(o,v){o.quaternion.setFromUnitVectors(fxE_UP,v.clone().normalize());return o}

/* ---------- 回音虫: a worm giant standing half upright, red head, short yellow feelers, a sucker mouth ringed with teeth ---------- */
function fxE_huiyin(){const g=new THREE.Group();
 const fl=M('#9a5a50',{roughness:.55}),fl2=M('#86483f',{roughness:.6}),red=M('#c8302a',{roughness:.45}),yel=M('#e8c440',{roughness:.5}),dark=M('#2a0606',{roughness:.3}),lipM=M('#a8242a',{roughness:.4}),tooth=M('#f0e8d4',{roughness:.3});
 // the long hind body lies on the ground in a lazy S
 const tr=new THREE.CatmullRomCurve3([V3(.05,.4,0),V3(-1.1,.4,.55),V3(-2.4,.36,.35),V3(-3.5,.32,-.55),V3(-4.6,.25,-.9),V3(-5.4,.2,-.6)]);
 for(let i=0;i<16;i++){const t=i/15;const p=tr.getPoint(t),d=tr.getTangent(t);const r=.47*(1-t*.6);const s=sph(0,r,r*.72,r,12,i%2?fl:fl2);s.position.set(p.x,r*.9,p.z);s.rotation.y=-Math.atan2(d.z,d.x);s.scale.x=r*.82;g.add(s)}
 // the raised front: a chain of ring segments, each joint bends a little
 const base=new THREE.Group();base.position.set(.15,.42,0);g.add(base);const NS=9,SL=.42,chain=[],rest=[];let par=base;
 for(let i=0;i<NS;i++){const j=new THREE.Group();if(i>0)j.position.y=SL;par.add(j);const r=.47-i*.008;const s=sph(0,r,SL*.66,r,12,i%2?fl:fl2);s.position.y=SL*.5;j.add(s);chain.push(j);rest.push(i<4?.02:-.13);par=j}
 const hd=new THREE.Group();hd.position.y=SL;par.add(hd);const HR=.62;const head=sph(0,HR,HR*.95,HR,18,red);head.position.y=HR*.7;hd.add(head);
 // short yellow feelers over the back and sides of the head
 for(let i=0;i<34;i++){const u=h3(i,3,1)*2-1,a=h3(i,7,2)*6.283;const v=V3(Math.sqrt(1-u*u)*Math.cos(a),u,Math.sqrt(1-u*u)*Math.sin(a));if(v.y>.45)continue;const c=cone(.035,.2+h3(i,1,1)*.12,yel,4);c.position.set(v.x*HR*.98,HR*.7+v.y*HR*.93,v.z*HR*.98);fxE_aim(c,v);c.translateY(.08);hd.add(c)}
 // the sucker mouth at the tip: a fleshy lip, a dark pit and rings of inward teeth
 const mo=new THREE.Group();mo.position.y=HR*.7+HR*.82;hd.add(mo);const lip=new THREE.Mesh(new THREE.TorusGeometry(.42,.11,8,24),lipM);lip.rotation.x=Math.PI/2;mo.add(lip);
 const pit=new THREE.Mesh(new THREE.CircleGeometry(.4,20),dark);pit.rotation.x=-Math.PI/2;pit.position.y=-.06;mo.add(pit);
 [[.36,14,.13],[.25,11,.11],[.14,7,.09]].forEach(([r,n,h],k)=>{for(let i=0;i<n;i++){const a=(i+k*.5)/n*6.283;const c=cone(.028,h,tooth,4);c.position.set(Math.cos(a)*r,-.02-k*.03,Math.sin(a)*r);fxE_aim(c,V3(-Math.cos(a),.55,-Math.sin(a)));mo.add(c)}});
 // a scream leaves the mouth as widening rings
 const rings=[];for(let i=0;i<3;i++){const r=fxE_soundRing(.5,'#ffd8a0',.04);r.rotation.x=Math.PI/2;mo.add(r);rings.push(r)}
 g.add(shadow(1.6,-.4,0),shadow(1.4,-2.6,.2),shadow(1.1,-4.6,-.7));
 g.userData.anim=t=>{const k=Math.max(0,Math.sin(t*.9));chain.forEach((j,i)=>{const w=i/NS;j.rotation.z=rest[i]+Math.sin(t*1.1-i*.45)*.045*w-k*.02*w;j.rotation.x=Math.sin(t*.7-i*.35)*.06*w});hd.rotation.z=-1.05+Math.sin(t*1.3)*.08-k*.15;hd.rotation.x=Math.sin(t*.9)*.1;
  lip.scale.setScalar(1+k*.25);rings.forEach((r,i)=>{const q=(t*.6+i/3)%1;r.position.y=.1+q*2.6;r.scale.setScalar(.8+q*3.2);r.material.opacity=.55*(1-q)*(.25+k*.75)})};
 return g}

/* ---------- 蝗群领主: a thirty-metre flat sea beetle; blue ring membranes on its back swell and burst into locusts; a spout hole on the head ---------- */
function fxE_queen(){const g=new THREE.Group();const A=2.7,B=.72,Cz=1.8,Y0=.2;
 const shell=M('#2a2a30',{roughness:.35,metalness:.15}),under=M('#4a4038',{roughness:.6}),gill=M('#7a3a3a',{roughness:.5}),ringM=M('#3a8aff',{emissive:'#1a5ad8',emissiveIntensity:.7,roughness:.3});
 const body=sph(0,A,B,Cz,28,shell);body.position.y=Y0;g.add(body);const bel=sph(0,A*.96,.32,Cz*.94,20,under);bel.position.y=Y0-.05;g.add(bel);
 // a seam down the middle of the back
 const seam=tubeAlong([V3(-A*.95,Y0+B*.25,0),V3(-A*.5,Y0+B*.88,0),V3(.3,Y0+B,0),V3(A*.7,Y0+B*.75,0)],.025,M('#16161a'),16);g.add(seam);
 // the head: a low dome in front, a round spout hole on top, short mandibles
 const hd=sph(0,.95,.45,1.05,18,shell);hd.position.set(A*.92,Y0+.05,0);g.add(hd);const hole=new THREE.Mesh(new THREE.CircleGeometry(.24,18),M('#060608'));hole.rotation.x=-Math.PI/2;hole.position.set(A*.98,Y0+.46,0);g.add(hole);
 const hrim=new THREE.Mesh(new THREE.TorusGeometry(.26,.06,6,20),shell);hrim.rotation.x=Math.PI/2;hrim.position.copy(hole.position);g.add(hrim);
 for(const z of[-1,1]){const md=cone(.08,.5,under,5);md.rotation.set(z*.4,0,-Math.PI/2-.2);md.position.set(A*.92+.95,Y0-.05,z*.35);g.add(md);const e=sph(0,.09,.07,.09,8,M('#0a0a0c',{roughness:.1}));e.position.set(A*.92+.6,Y0+.22,z*.62);g.add(e)}
 // gill slits along both flanks (it breathes water, the locusts breathe air)
 for(let i=0;i<6;i++)for(const z of[-1,1]){const x=1.4-i*.5;const zz=Cz*Math.sqrt(Math.max(0,1-(x/A)**2))*.98;const s=new THREE.Mesh(kb(.06,.16,.34),gill);s.position.set(x,Y0+.1,z*zz);s.rotation.y=z*.25;g.add(s)}
 // paddle legs, mostly under the water line
 for(let i=0;i<3;i++)for(const z of[-1,1]){const l=sph(0,.5,.06,.18,8,under);l.position.set(1-i*.9,Y0-.15,z*(Cz*.98));l.rotation.y=z*(.5-i*.4);g.add(l)}
 // the ring membranes: a blue rim around a thin sac that fills, bursts and grows back
 const surf=(x,z)=>{const q=1-(x/A)**2-(z/Cz)**2;const y=Y0+B*Math.sqrt(Math.max(.02,q));const n=V3(x/(A*A),(y-Y0)/(B*B),z/(Cz*Cz)).normalize();return{p:V3(x,y,z),n}};
 const spots=[[1.4,0],[.9,.75],[.9,-.75],[.2,1.05],[.2,-1.05],[.4,0],[-.5,.6],[-.5,-.6],[-1.2,0],[-1.25,1.0],[-1.25,-1.0],[-1.9,.45],[-1.9,-.45]];
 const memM=new THREE.MeshStandardMaterial({color:'#7ab8ff',emissive:'#2a6ad8',emissiveIntensity:.35,transparent:true,opacity:.55,roughness:.15,depthWrite:false});
 const domeG=new THREE.SphereGeometry(1,14,7,0,6.283,0,Math.PI/2);const mems=[];
 spots.forEach(([x,z],i)=>{const {p,n}=surf(x,z);const r=.27;const rg=new THREE.Group();rg.position.copy(p);fxE_aim(rg,n);g.add(rg);const rim=new THREE.Mesh(new THREE.TorusGeometry(r,.045,6,22),ringM);rim.rotation.x=Math.PI/2;rg.add(rim);
  const inner=new THREE.Mesh(new THREE.CircleGeometry(r,18),M('#1a3a6a',{roughness:.4}));inner.rotation.x=-Math.PI/2;inner.position.y=.005;rg.add(inner);const dm=new THREE.Mesh(domeG,memM);dm.scale.set(r,r*.2,r);rg.add(dm);mems.push({rg,dm,r,ph:h3(i,2,9)})});
 // locusts thrown out by a bursting sac
 const NL=14,lp=new Float32Array(mems.length*NL*3);const lg=new THREE.BufferGeometry();lg.setAttribute('position',new THREE.BufferAttribute(lp,3));
 const loc=new THREE.Points(lg,new THREE.PointsMaterial({map:dotTex,color:'#5a5a32',size:.16,transparent:true,depthWrite:false}));loc.frustumCulled=false;g.add(loc);
 const dirs=[];for(let i=0;i<NL;i++)dirs.push(V3(h3(i,1,4)-.5,.6+h3(i,2,4)*.8,h3(i,3,4)-.5));const wp=V3();
 // a water ball shot from the head hole now and then
 const wb=sph(0,.22,.22,.22,12,new THREE.MeshStandardMaterial({color:'#cfefff',transparent:true,opacity:.6,roughness:.05,depthWrite:false}));g.add(wb);
 g.userData.anim=t=>{mems.forEach((m,i)=>{const q=(t*.16+m.ph)%1;let s;if(q<.6)s=.2+q/.6*1.1;else if(q<.66)s=1.3+(q-.6)*5;else s=0;m.dm.visible=s>0;if(s>0)m.dm.scale.set(m.r*(.95+s*.15),m.r*s,m.r*(.95+s*.15));
   for(let k=0;k<NL;k++){const o=(i*NL+k)*3;if(q>.6){const f=(q-.6)/.4;const d=dirs[(k+i)%NL];wp.copy(m.rg.position);wp.x+=d.x*f*3.4+Math.sin(t*9+k)*.06;wp.y+=d.y*f*3.2;wp.z+=d.z*f*3.4+Math.cos(t*8+k)*.06;lp[o]=wp.x;lp[o+1]=wp.y;lp[o+2]=wp.z}else{lp[o]=m.rg.position.x;lp[o+1]=m.rg.position.y-.05;lp[o+2]=m.rg.position.z}}});lg.attributes.position.needsUpdate=true;
  const w=(t*.2)%1;wb.visible=w<.35;if(wb.visible){const f=w/.35;wb.position.set(hole.position.x+f*2.2,hole.position.y+.2+f*2.8-f*f*1.6,0);wb.scale.setScalar(.22*(.6+f*.8))}
  g.position.y=Math.sin(t*.5)*.04};
 return g}

/* ---------- 间谍: a walking-upright scorpion (立蝎) copy whose shell glows ---------- */
function fxE_spy(){const g=bUpright({w:'lixie',col:'#b08a5a',e:[3]});const fm=M('#a8986a',{roughness:.4,emissive:'#38e8b0',emissiveIntensity:.32});
 g.traverse(c=>{if(c.isMesh&&c.material&&c.material.color&&c.material.emissive&&c.material.emissive.getHex()===0&&c.material.color.getHexString()==='b08a5a')c.material=fm});
 // the hooked tail it stings with, curling up behind
 {const tp=[V3(-.25,1.0,0),V3(-.6,.95,0),V3(-.85,1.25,0),V3(-.85,1.65,0),V3(-.6,1.85,0)];const cv=new THREE.CatmullRomCurve3(tp);for(let i=0;i<15;i++){const t=i/14;const p=cv.getPoint(t);const r=.12-t*.05;const s2=sph(0,r,r,r,10,fm);s2.position.copy(p);g.add(s2)}const st=cone(.05,.22,M('#3a3020',{roughness:.3}),5);st.position.set(-.45,1.8,0);st.rotation.z=-2.2;g.add(st)}
 // a few brighter glowing plates down the back
 for(let i=0;i<5;i++){const s=sph(0,.09,.05,.12,8,EM('#7affe0',.9));s.position.set(-.28,1.05+i*.16,0);g.add(s)}
 g.add(at(glowSprite('#7affd8',2.6,.16),0,1.4,0));g.add(shadow(.7));return g}

/* ---------- 杜美莎树: a thick rough trunk with bare branches, from which glowing pale-blue tentacles hang almost to the ground ---------- */
function fxE_medusa(){const g=new THREE.Group();const bark=detailMat(M('#5a4a3c',{roughness:1}).clone(),{bump:1.4,freq:5});
 const glowT=M('#6ab8f0',{emissive:'#4aa0e8',emissiveIntensity:.9,roughness:.4}),rootM=M('#5a5a5e',{emissive:'#4a90c8',emissiveIntensity:.45,roughness:.8});
 // the trunk: a lathe that flares at the foot, its surface roughened
 const prof=[];for(let i=0;i<=10;i++){const y=i/10*3.3;const r=.62-.25*Math.min(1,i/6)+(i<2?.25*(1-i/2):0);prof.push(new THREE.Vector2(r,y))}
 const tg=new THREE.LatheGeometry(prof,12);const p=tg.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);const n=1+(h3(Math.round(Math.atan2(z,x)*3),Math.round(y*4),3)-.5)*.16;p.setX(i,x*n);p.setZ(i,z*n)}tg.computeVertexNormals();
 const trunk=new THREE.Mesh(tg,bark);g.add(trunk);
 // bare branches spreading from the crown; tentacles hang from along them
 const tents=[];
 for(let b=0;b<8;b++){const a=b/8*6.283+h3(b,1,1)*.5;const L=1.4+h3(b,2,1)*.9;const ca=Math.cos(a),sa=Math.sin(a);const y0=2.7+h3(b,3,1)*.5;
  const pts=[V3(ca*.2,y0,sa*.2),V3(ca*L*.45,y0+.6,sa*L*.45),V3(ca*L*.8,y0+.85,sa*L*.8),V3(ca*L,y0+.75+h3(b,4,1)*.3,sa*L)];g.add(tubeAlong(pts,b%2?.09:.11,bark,10));
  g.add(tubeAlong([pts[2],V3(ca*L*.9+sa*.3,y0+1.3,sa*L*.9-ca*.3)],.04,bark,4));
  const cur=new THREE.CatmullRomCurve3(pts);for(let k=0;k<4;k++){const q=.35+k*.2;const at0=cur.getPoint(q);const hang=at0.y-.15-h3(b,k,5)*.4;const tg2=new THREE.Group();tg2.position.copy(at0);g.add(tg2);
   const sw=(h3(b,k,6)-.5)*.6;const tp=[V3(0,0,0),V3(sw*.3,-hang*.3,.05),V3(sw*.6+.15,-hang*.62,-.1),V3(sw*.4-.05,-hang*.86,.12),V3(sw*.55+.1,-hang*.96,.25)];
   tg2.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(tp),12,.035,5,false),glowT));tents.push({m:tg2,ph:b*1.3+k*.7})}}
 // thick roots breaking the surface, glowing like the tentacles
 for(let i=0;i<7;i++){const a=i/7*6.283+.3;const L=1.6+h3(i,1,8)*1.1;g.add(tubeAlong([V3(Math.cos(a)*.5,.25,Math.sin(a)*.5),V3(Math.cos(a)*L*.5,.18,Math.sin(a)*L*.5),V3(Math.cos(a+.2)*L,.06,Math.sin(a+.2)*L)],.11-i%2*.03,rootM,10))}
 // the water it leaves out to lure the thirsty
 const pool=new THREE.Mesh(new THREE.RingGeometry(1.7,2.9,32),new THREE.MeshStandardMaterial({color:'#2a4a5a',roughness:.05,metalness:.3}));pool.rotation.x=-Math.PI/2;pool.position.y=.03;g.add(pool);
 g.add(at(glowSprite('#9ad8ff',7,.28),0,2.4,0));g.add(shadow(1.8));
 g.userData.anim=t=>tents.forEach(x=>{x.m.rotation.x=Math.sin(t*.7+x.ph)*.07;x.m.rotation.z=Math.cos(t*.55+x.ph*1.3)*.06});
 return g}

/* ---------- 勇者啤尔: a 莫斯 in stone armour, a stone greatsword trailing from the waist, a stone slab it writes its diary on ---------- */
function fxE_pier(){const H=.9;const g=bFig({h:1.8,skin:'#a08a6a',cloth:'#8a857a',cloth2:'#6f6a60',head:'pointed',ears:1,belt:'#4a4238'});
 const st=M('#8a857a',{roughness:.95,flatShading:true}),st2=M('#76716a',{roughness:.95,flatShading:true});
 // armour plates over chest, shoulders and hips
 const chest=sph(0,H*.29,H*.33,H*.25,9,st);chest.position.y=H*1.3;g.add(chest);
 for(const z of[-1,1]){const pa=new THREE.Mesh(new THREE.SphereGeometry(H*.15,8,5,0,6.283,0,Math.PI*.55),st2);pa.position.set(0,H*1.58,z*H*.26);pa.rotation.x=z*.5;g.add(pa)}
 const sk=new THREE.Mesh(new THREE.CylinderGeometry(H*.25,H*.31,H*.26,9,1,true),M('#76716a',{roughness:.95,flatShading:true,side:THREE.DoubleSide}));sk.position.y=H*.92;g.add(sk);
 const gor=new THREE.Mesh(new THREE.TorusGeometry(H*.12,H*.05,5,9),st2);gor.rotation.x=Math.PI/2;gor.position.y=H*1.66;g.add(gor);
 // the stone greatsword hangs from the left hip and drags behind on the ground
 const sw=new THREE.Group();sw.position.set(-H*.02,H*1.08,H*.34);sw.rotation.set(.12,0,-.98);g.add(sw);
 const blade=new THREE.Mesh(kb(.07,1.45,.24),st);blade.position.y=-.86;sw.add(blade);const tip=new THREE.Mesh(new THREE.ConeGeometry(.12,.22,4),st);tip.scale.set(.3,1,1);tip.rotation.set(Math.PI,Math.PI/4,0);tip.position.y=-1.69;sw.add(tip);
 const gd=new THREE.Mesh(kb(.1,.08,.46),st2);gd.position.y=-.1;sw.add(gd);const hilt=cyl(.03,.03,.24,M('#4a3a2a'),6);hilt.position.y=.04;sw.add(hilt);const pom=sph(0,.05,.05,.05,6,st2);pom.position.y=.18;sw.add(pom);
 // arms held forward: the slab in both hands, a stone stylus in the right
 const arms=[];g.children.forEach(c=>{if(c.userData&&c.userData.knee&&c.position.y>H*1.3)arms.push(c)});
 const slab=new THREE.Group();slab.position.set(H*.56,H*1.28,0);slab.rotation.z=.5;g.add(slab);slab.add(new THREE.Mesh(kb(.04,.38,.42),st2));
 for(let i=0;i<5;i++){const ln=new THREE.Mesh(kb(.01,.012,.24+h3(i,1,1)*.1),M('#3a3630'));ln.position.set(-.024,.12-i*.06,-.02);slab.add(ln)}
 const tor=g.children.find(c=>c.isMesh&&Math.abs(c.position.y-H*1.28)<1e-6);
 const a0=g.userData.anim;g.userData.anim=t=>{a0(t);if(tor)tor.scale.y=H*.38*(1+Math.sin(t*1.8)*.02);arms.forEach((a,i)=>{a.rotation.z=.5+Math.sin(t*1.5+i)*.03;a.rotation.x=(a.position.z>0?-1:1)*.18;a.userData.knee.rotation.z=1.15+(i===1?Math.sin(t*4)*.12:0)})};
 return g}


// a straight stick between two points
function fxE_stick(p,q,r,mat,seg){const d=q.clone().sub(p);const m=cyl(r,r,d.length(),mat,seg||5);m.position.copy(p).add(q).multiplyScalar(.5);fxE_aim(m,d);return m}
// a woven texture (wicker / plaited fibre), drawn once and shared
let fxE_weaveT=null;function fxE_weave(){if(fxE_weaveT)return fxE_weaveT;fxE_weaveT=canvasTex(64,64,(x)=>{x.fillStyle='#6a4e2c';x.fillRect(0,0,64,64);for(let r=0;r<8;r++)for(let c=0;c<8;c++){const o=(r+c)%2;x.fillStyle=o?'#a8844e':'#8e6c3c';if(o)x.fillRect(c*8+1,r*8+2,6,4);else x.fillRect(c*8+2,r*8+1,4,6)}});fxE_weaveT.wrapS=fxE_weaveT.wrapT=THREE.RepeatWrapping;return fxE_weaveT}

// a rowing-fin leaf lying in the x-z plane, reaching out along +z
let fxE_lg=null;function fxE_leafG(){if(fxE_lg)return fxE_lg;const s=new THREE.Shape();s.moveTo(-.12,.05);s.lineTo(.22,.05);s.quadraticCurveTo(.42,.6,.12,1.08);s.lineTo(-.38,.85);s.quadraticCurveTo(-.32,.3,-.12,.05);fxE_lg=new THREE.ShapeGeometry(s,6);fxE_lg.rotateX(Math.PI/2);return fxE_lg}
/* ---------- 空鱼艇: a woven fish-shaped gondola hung under a great half-dome bag of sealed seaweed; two small bags lashed on,
   bone-and-weed fins along the sides that the crew row, a big tail fin, and a fishbone crossbow on the bow ---------- */
function fxE_skyboat(){const root=new THREE.Group(),g=new THREE.Group();const L=4.2,W=1.15,D=.7;g.position.y=D+.05;root.add(g);
 const wick=new THREE.MeshStandardMaterial({map:fxE_weave(),roughness:.95,side:THREE.DoubleSide}),bone=M('#e6ddc6',{roughness:.6}),rope=M('#5a4a30',{roughness:1});
 // the hull: an open half-shell, wide and blunt at the bow, narrowing to the tail
 const wid=t=>W*Math.pow(Math.sin(Math.PI*(.06+.9*Math.pow(t,1.25))),.55),dep=t=>D*(.45+.55*Math.pow(Math.sin(Math.PI*(.05+.92*t)),.5));
 const N=22,S=12,pos=[],uv=[],idx=[];for(let i=0;i<=N;i++){const t=i/N,x=-L/2+t*L;for(let j=0;j<=S;j++){const a=j/S*Math.PI;pos.push(x,-dep(t)*Math.sin(a),wid(t)*Math.cos(a));uv.push(t*7,j/S*3)}}
 for(let i=0;i<N;i++)for(let j=0;j<S;j++){const a=i*(S+1)+j,b=a+1,c=a+S+1,d=c+1;idx.push(a,c,b,b,c,d)}
 const hg=new THREE.BufferGeometry();hg.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));hg.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));hg.setIndex(idx);hg.computeVertexNormals();g.add(new THREE.Mesh(hg,wick));
 // a rim and a few hoops of bound twigs
 const rim=[];for(let i=0;i<=24;i++){const t=i/24;rim.push(V3(-L/2+t*L,0,wid(t)))}for(let i=23;i>0;i--){const t=i/24;rim.push(V3(-L/2+t*L,0,-wid(t)))}
 g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rim,true),60,.045,5,true),rope));
 for(let k=1;k<6;k++){const t=k/6;const pts=[];for(let j=0;j<=8;j++){const a=j/8*Math.PI;pts.push(V3(-L/2+t*L,-dep(t)*Math.sin(a)*1.01,wid(t)*Math.cos(a)*1.01))}g.add(tubeAlong(pts,.025,rope,10))}
 const keel=[];for(let i=0;i<=10;i++){const t=i/10;keel.push(V3(-L/2+t*L,-dep(t)-.02,0))}g.add(tubeAlong(keel,.05,bone,16));
 // the main bag: a half dome of thin, airtight seaweed, larger than the basket; jellyfish doze inside it
 const BY=1.45,BR=[2.75,1.7,1.75];const bagM=new THREE.MeshStandardMaterial({color:'#4f5a2a',emissive:'#1a2008',emissiveIntensity:.3,transparent:true,opacity:.72,roughness:.55,side:THREE.DoubleSide,depthWrite:false});
 const bag=new THREE.Group();bag.position.y=BY;g.add(bag);const dome=new THREE.Mesh(new THREE.SphereGeometry(1,28,10,0,6.283,0,Math.PI/2),bagM);dome.scale.set(...BR);bag.add(dome);
 const base=new THREE.Mesh(new THREE.CircleGeometry(1,28),bagM);base.rotation.x=Math.PI/2;base.scale.set(BR[0],BR[2],1);bag.add(base);
 const vein=M('#2e3618',{roughness:.8});for(let k=0;k<10;k++){const a=k/10*6.283;const pts=[];for(let j=0;j<=8;j++){const e=j/8*Math.PI/2*.98;pts.push(V3(Math.cos(a)*Math.cos(e)*BR[0]*1.005,Math.sin(e)*BR[1]*1.005,Math.sin(a)*Math.cos(e)*BR[2]*1.005))}bag.add(tubeAlong(pts,.025,vein,10))}
 const hem=new THREE.Mesh(new THREE.TorusGeometry(1,.035,5,40),vein);hem.rotation.x=Math.PI/2;hem.scale.set(BR[0],BR[2],1);bag.add(hem);
 const jel=[];const jm=new THREE.MeshBasicMaterial({color:'#9ad4e8',transparent:true,opacity:.35,depthWrite:false});for(let i=0;i<3;i++){const j=new THREE.Mesh(new THREE.SphereGeometry(1,12,6,0,6.283,0,Math.PI/2),jm);j.scale.set(.45,.32,.45);j.position.set(-1.1+i*1.1,.35+(i%2)*.25,(i-1)*.35);bag.add(j);jel.push(j)}
 // ropes from the bag's hem down to the rim
 const rp=[];for(let k=0;k<10;k++){const t=.08+k%5*.21,s=k<5?1:-1;const a=V3(-L/2+t*L,0,s*wid(t)),b=V3((-L/2+t*L)*1.05,BY,s*BR[2]*Math.sqrt(Math.max(0,1-((-L/2+t*L)*1.05/BR[0])**2))*.95);rp.push(a,b)}
 g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(rp),new THREE.LineBasicMaterial({color:'#4a3c26'})));
 // two small bags tied to the sides, let go to come down
 for(const z of[-1,1]){const sb=new THREE.Group();sb.position.set(-.5,.95,z*(W+.45));g.add(sb);const d2=new THREE.Mesh(new THREE.SphereGeometry(.5,16,8),bagM);d2.scale.set(1.1,.85,.8);sb.add(d2);const kn=sph(0,.06,.06,.06,6,rope);kn.position.y=-.43;sb.add(kn);
  g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints([V3(-.5,.52,z*(W+.42)),V3(-.5,0,z*wid(.42)),V3(-.5,.52,z*(W+.42)),V3(-.15,0,z*wid(.5))]),new THREE.LineBasicMaterial({color:'#4a3c26'})))}
 // the rowing fins: a bone spar with a leaf of seaweed, two each side
 const leafM=M('#5a6a2e',{roughness:.7,side:THREE.DoubleSide});const fins=[];
 for(const x of[.75,-.45])for(const z of[-1,1]){const t=(x+L/2)/L;const fg=new THREE.Group();fg.position.set(x,-.05,z*wid(t));g.add(fg);const sp=cyl(.03,.02,1.1,bone,5);sp.rotation.x=z*Math.PI/2;sp.position.z=z*.55;fg.add(sp);
  const lf=new THREE.Mesh(fxE_leafG(),leafM);lf.scale.z=z;fg.add(lf);for(let r=0;r<3;r++){const ry=cyl(.012,.012,.7,bone,3);ry.rotation.set(z*Math.PI/2,0,-.35-r*.3);ry.position.set(-.12-r*.06,0,z*(.35+r*.12));fg.add(ry)}fins.push({fg,z,ph:x})}
 // the tail fin, worked from the stern
 const tf=new THREE.Group();tf.position.set(-L/2,-.15,0);g.add(tf);const tsh=new THREE.Shape();tsh.moveTo(0,0);tsh.lineTo(-1.1,.85);tsh.quadraticCurveTo(-.85,0,-1.1,-.75);tsh.lineTo(0,0);
 const tm=new THREE.Mesh(new THREE.ShapeGeometry(tsh,6),leafM);tf.add(tm);for(let r=0;r<5;r++){const a=-.6+r*.3;const ry=cyl(.018,.012,1.2,bone,3);ry.rotation.z=Math.PI/2+a;ry.position.set(-Math.cos(a)*.55,-Math.sin(a)*.55*-1,0);tf.add(ry)}
 // the bow crossbow of a great fish bone, loaded with a barbed bolt
 const cb=new THREE.Group();cb.position.set(L/2-.3,.12,0);g.add(cb);cb.add(fxE_stick(V3(-.55,0,0),V3(.45,0,0),.05,bone));
 const bow=[];for(let j=0;j<=8;j++){const u=j/8*2-1;bow.push(V3(.38-Math.abs(u)**1.6*.28,0,u*.72))}cb.add(tubeAlong(bow,.035,bone,12));
 cb.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints([V3(.1,0,.72),V3(-.32,0,0),V3(-.32,0,0),V3(.1,0,-.72)]),new THREE.LineBasicMaterial({color:'#d8ccb0'})));
 const bolt=cyl(.018,.018,1.15,M('#8a7a5a'),4);bolt.rotation.z=Math.PI/2;bolt.position.set(.25,.05,0);cb.add(bolt);const bh=cone(.05,.14,bone,4);bh.rotation.z=-Math.PI/2;bh.position.set(.88,.05,0);cb.add(bh);
 for(let k=0;k<3;k++)for(const z of[-1,1]){const b=cone(.012,.09,bone,3);b.position.set(.78-k*.05,.05,z*.03);b.rotation.set(z*-2.3,0,0);cb.add(b)}
 const post=cyl(.04,.05,.3,bone,5);post.position.set(L/2-.35,-.05,0);g.add(post);
 // the crew: nine to row and steer, one on watch (a few shown)
 const crew=[[.75,.55],[-.45,-.6],[-1.5,0],[1.4,.2]];crew.forEach(([x,z],i)=>{const c=bDragonkin({w:'baihai'});c.scale.setScalar(.24);c.position.set(x,-.48,z*.85);c.rotation.y=i===3?-.3:(i===2?Math.PI:0);c.userData.anim=null;g.add(c)});
 g.userData.anim=t=>{bag.position.y=BY+Math.sin(t*.8)*.03;
  fins.forEach(f=>{f.fg.rotation.x=f.z*(Math.sin(t*1.6+f.ph)*.45);f.fg.rotation.y=Math.sin(t*1.6+f.ph+1.2)*.2});tf.rotation.y=Math.sin(t*.9)*.3;jel.forEach((j,i)=>j.scale.y=.32*(1+Math.sin(t*.7+i)*.08))};
 root.userData.anim=g.userData.anim;g.userData.anim=null;return root}

/* ---------- 学者的直升机: a single-seat helicopter that is little more than a lattice of wooden sticks, an engine behind the seat and a rotor on top ---------- */
function fxE_heli(){const g=new THREE.Group();const wd=M('#9a7448',{roughness:.85}),wd2=M('#7a5634',{roughness:.9}),knot=M('#3a2a1a',{roughness:1});const S=(a,b,r,m)=>g.add(fxE_stick(a,b,r||.03,m||wd));
 // the cabin cage
 const X0=-.45,X1=.55,Z=.36,Y0=.3,Y1=1.25;const cn=[];for(const x of[X0,X1])for(const y of[Y0,Y1])for(const z of[-Z,Z])cn.push(V3(x,y,z));
 const c=(x,y,z)=>V3(x?X1:X0,y?Y1:Y0,z?Z:-Z);for(const a of[0,1])for(const b of[0,1]){S(c(0,a,b),c(1,a,b));S(c(a,0,b),c(a,1,b));S(c(a,b,0),c(a,b,1))}
 // braces across the sides
 for(const z of[0,1]){S(c(0,0,z),c(1,1,z),.02,wd2);S(c(0,1,z),c(1,0,z),.02,wd2)}S(c(0,0,0),c(0,1,1),.02,wd2);
 // a nose of sticks, a floor of slats, a seat
 const nose=V3(X1+.35,Y0+.35,0);for(const y of[0,1])for(const z of[0,1])S(c(1,y,z),nose,.02);
 for(let i=0;i<5;i++){const s=new THREE.Mesh(kb(.12,.025,Z*2),wd2);s.position.set(X0+.1+i*.2,Y0+.01,0);g.add(s)}
 const seat=new THREE.Mesh(kb(.32,.05,.4),wd2);seat.position.set(-.05,Y0+.32,0);g.add(seat);const back=new THREE.Mesh(kb(.05,.4,.4),wd2);back.position.set(-.22,Y0+.55,0);g.add(back);
 // the engine behind the seat, the one part not made of wood
 const eng=new THREE.Mesh(kb(.34,.34,.34),M('#4a4a50',{metalness:.6,roughness:.4}));eng.position.set(X0+.02,Y0+.5,0);g.add(eng);const tank=cyl(.08,.08,.3,M('#7a3a5a',{roughness:.4}),8);tank.rotation.x=Math.PI/2;tank.position.set(X0+.02,Y0+.78,0);g.add(tank);
 // the tail boom: three rails converging, cross-braced, ending in a small rotor
 const T=V3(-2.15,Y1-.15,0);const tr=[V3(X0,Y1,-Z*.6),V3(X0,Y1,Z*.6),V3(X0,Y0+.35,0)];tr.forEach(p=>S(p,T,.025));
 for(let k=1;k<5;k++){const f=k/5;const q=tr.map(p=>p.clone().lerp(T,f));S(q[0],q[1],.015,wd2);S(q[1],q[2],.015,wd2);S(q[2],q[0],.015,wd2)}
 const tfin=new THREE.Mesh(kb(.25,.35,.02),wd2);tfin.position.set(-2.05,Y1+.05,0);g.add(tfin);
 const trot=new THREE.Group();trot.position.set(-2.12,Y1-.05,.08);g.add(trot);for(let i=0;i<2;i++){const b=new THREE.Mesh(kb(.05,.5,.012),wd);b.rotation.z=i*Math.PI/2;trot.add(b)}
 // mast, hub and two long wooden blades
 S(V3(0,Y1,0),V3(0,Y1+.32,0),.045,wd2);S(V3(X0,Y1,-Z),V3(0,Y1+.2,0),.018,wd2);S(V3(X0,Y1,Z),V3(0,Y1+.2,0),.018,wd2);S(V3(X1,Y1,-Z),V3(0,Y1+.2,0),.018,wd2);S(V3(X1,Y1,Z),V3(0,Y1+.2,0),.018,wd2);
 const rot=new THREE.Group();rot.position.set(0,Y1+.34,0);g.add(rot);rot.add(cyl(.07,.07,.06,knot,8));for(const s of[-1,1]){const b=new THREE.Mesh(kb(1.55,.025,.14),wd);b.position.x=s*.82;b.rotation.x=s*.08;rot.add(b)}
 // skids
 for(const z of[-1,1]){S(V3(X0-.25,0,z*Z*1.15),V3(X1+.3,0,z*Z*1.15),.03);const tip=V3(X1+.42,.08,z*Z*1.15);S(V3(X1+.3,0,z*Z*1.15),tip,.03);S(V3(X0+.05,0,z*Z*1.15),c(0,0,z>0?1:0),.022);S(V3(X1-.05,0,z*Z*1.15),c(1,0,z>0?1:0),.022)}
 // lashings at the joints
 for(const p of cn){const k=sph(0,.04,.04,.04,6,knot);k.position.copy(p);g.add(k)}
 // the scholar at the controls
 const pilot=bFig({h:.62,skin:'#b8c8c8',cloth:'#5a6a7a',head:'big'});pilot.position.set(-.05,Y0+.12,0);pilot.children.forEach(ch=>{if(ch.material===shadowMat)ch.visible=false});g.add(pilot);
 const stick=fxE_stick(V3(.2,Y0,0),V3(.12,Y0+.35,.05),.012,knot);g.add(stick);
 g.userData.noSkin=1;
 g.userData.anim=t=>{rot.rotation.y=t*13;trot.rotation.z=t*21};
 return g}

/* ---------- 绒之海 · 浓雾: a ten-metre mat of white fluff woven by drifting fluffballs, carrying the scholar through a sudden fog among sharp rocks ---------- */
function fxE_fograft(){const g=new THREE.Group();const R=2.6;const white=M('#eef1f2',{roughness:1});
 const mat=new THREE.Mesh(new THREE.CylinderGeometry(R,R*.9,.3,40,1),white);mat.position.y=.05;g.add(mat);
 // the woven surface: coils of plaited fibre and loose strands
 const coil=M('#e2e6e8',{roughness:1});for(let k=1;k<6;k++){const r=k/6*R;const tor=new THREE.Mesh(new THREE.TorusGeometry(r,.07,5,Math.max(16,k*10)),coil);tor.rotation.x=Math.PI/2;tor.position.y=.21;g.add(tor)}
 const n=900,pa=new Float32Array(n*6);for(let i=0;i<n;i++){const a=h3(i,1,6)*6.283,r=Math.sqrt(h3(i,2,6))*R*1.04,a2=a+(h3(i,3,6)-.5)*.6,l=.15+h3(i,4,6)*.35;const x=Math.cos(a)*r,z=Math.sin(a)*r;pa.set([x,.2,z,x+Math.cos(a2)*l,.2+h3(i,5,6)*.18,z+Math.sin(a2)*l],i*6)}
 const hg=new THREE.BufferGeometry();hg.setAttribute('position',new THREE.BufferAttribute(pa,3));g.add(new THREE.LineSegments(hg,new THREE.LineBasicMaterial({color:'#ffffff',transparent:true,opacity:.75})));
 // the fluffballs that wove it ride at the edge
 const balls=[];for(let i=0;i<4;i++){const b=bFluff({w:'rq_piaoliu'});b.scale.setScalar(.42+h3(i,1,1)*.12);const a=i/4*6.283+.6;b.position.set(Math.cos(a)*(R-.15),.4,Math.sin(a)*(R-.15));g.add(b);balls.push(b)}
 // the scholar sits near the middle with its notes
 const sc=bFig({h:.8,skin:'#b8c8c8',cloth:'#4a5a6a',head:'big',book:1});sc.children.forEach(ch=>{if(ch.userData&&ch.userData.knee&&ch.position.y<.5){ch.rotation.z=1.45;ch.userData.knee.rotation.z=-1.5}if(ch.material===shadowMat)ch.visible=false});sc.position.set(-.3,.2-.4*.45,0);g.add(sc);
 g.add(emitter({n:120,life:6,speed:.6,spread:1,size:6,dir:[0,1,0],col:'#e4ecee',op:.35,add:false,tex:smokeTex,area:[16,2,16],wander:1.5}));
 for(let i=0;i<5;i++){const s=cone(.6,3,M('#5a5650',{flatShading:true}),5);s.position.set((i-2)*3.5,1,4+Math.sin(i)*2);g.add(s)}
 g.userData.anim=t=>{balls.forEach((b,i)=>{b.userData.anim&&b.userData.anim(t+i);b.position.y=.4+Math.sin(t*1.1+i*1.7)*.05});g.rotation.y=Math.sin(t*.1)*.2;g.rotation.x=Math.sin(t*.5)*.012;g.rotation.z=Math.cos(t*.43)*.012};
 return g}

/* ---------- 原角龙: a small hornless ceratopsian with a neck shield, a pincer-like beak for digging out roots, and a tail ---------- */
function fxE_yuanjiao(){const g=bCeratops2({w:'x',col:'#8a7a5a'});
 g.traverse(c=>{if(!c.geometry)return;const p=c.geometry.parameters||{};if(c.geometry.type==='TubeGeometry')c.visible=false;if(c.geometry.type==='ConeGeometry'&&Math.abs((p.height||0)-.32)>1e-3)c.visible=false});
 g.add(shadow(1.1));return g}

/* ---------- 石兽龙 and 盾头龙: a fat, hornless, frill-less browser with two long digging tusks; a half-size follower whose head has hardened into a ball ---------- */
function fxE_stoneBeast(){const g=new THREE.Group();const col='#7a6a52';const o={back:col,belly:'#b8a888',stripe:0};const mat=M(col,{roughness:.75});
 g.add(loft([[-1.25,.95,0,.42,.42],[-.65,1.12,0,.8,.82],[.1,1.15,0,.86,.9],[.7,1.02,0,.68,.7],[1.08,.92,0,.42,.4]],Object.assign({n:26,r:16},o)));
 const hg=new THREE.Group();hg.position.set(1.05,.9,0);g.add(hg);hg.add(loft([[0,0,0,.38,.36],[.3,-.08,0,.33,.3],[.58,-.2,0,.24,.2],[.78,-.3,0,.14,.12]],Object.assign({n:16},o)));
 mouthEye(hg,.4,.08,.24,.045);const tusk=M('#efe6d0',{roughness:.35});for(const z of[-1,1])hg.add(tubeAlong([V3(.6,-.3,z*.12),V3(.78,-.5,z*.17),V3(.98,-.58,z*.2),V3(1.18,-.5,z*.2)],.045,tusk,10));
 for(const z of[-1,1]){const tp=cone(.04,.12,tusk,5);tp.position.set(1.21,-.47,z*.2);tp.rotation.z=-1.1;hg.add(tp)}
 const tl=new THREE.Group();tl.position.set(-1.2,.95,0);g.add(tl);tl.add(loft([[0,0,0,.4,.4],[-.55,-.15,0,.25,.24],[-1.1,-.3,0,.12,.12],[-1.5,-.32,0,.03,.03]],Object.assign({n:14},o)));
 const L=[];for(const[x,z]of[[.62,-1],[.62,1],[-.7,-1],[-.7,1]]){const l=jleg(.34,.32,.18,mat,x>0?.25:-.2,{});l.position.set(x,.72,z*.55);l.rotation.x=-z*.06;g.add(l);L.push({m:l,ph:(x>0?0:Math.PI)+(z>0?Math.PI:0),a:.4,k:x>0?.25:-.2})}
 addLegs(g,L);g.userData.tails=[{m:tl,a:.15,f:1.5}];
 // the shield-head that follows it for the crumbs
 const sm=new THREE.Group();const so={back:'#8a7a5a',belly:'#c8b898',stripe:0};const smm=M('#8a7a5a',{roughness:.7});
 sm.add(loft([[-.6,.45,0,.2,.2],[-.25,.52,0,.32,.32],[.15,.52,0,.32,.32],[.45,.48,0,.22,.2]],Object.assign({n:16},so)));
 const sh=new THREE.Group();sh.position.set(.5,.5,0);sm.add(sh);const ball=sph(0,.3,.28,.28,16,M('#a89a7a',{roughness:.35}));ball.position.set(.18,.08,0);sh.add(ball);
 for(let i=0;i<9;i++){const v=V3(h3(i,1,4)-.3,h3(i,2,4)-.2,h3(i,3,4)-.5).normalize();const k=sph(0,.05,.04,.05,6,M('#9a8c6c',{roughness:.4}));k.position.set(.18+v.x*.29,.08+v.y*.27,v.z*.27);sh.add(k)}
 const sn=sph(0,.1,.08,.09,8,smm);sn.position.set(.44,-.06,0);sh.add(sn);mouthEye(sh,.36,.04,.13,.03);
 const stl=new THREE.Group();stl.position.set(-.55,.45,0);sm.add(stl);stl.add(loft([[0,0,0,.18,.18],[-.35,-.08,0,.1,.1],[-.7,-.12,0,.02,.02]],Object.assign({n:10},so)));
 for(const[x,z]of[[.3,-1],[.3,1],[-.35,-1],[-.35,1]]){const l=jleg(.18,.17,.07,smm,x>0?.2:-.2,{});l.position.set(x,.36,z*.22);sm.add(l)}
 sm.position.set(1.9,0,1.05);sm.rotation.y=-.5;g.add(sm);g.add(shadow(1.5),shadow(.6,1.9,1.05));
 stdAnim(g,{fq:3,amp:.25,extra:t=>{hg.rotation.z=-.15+Math.sin(t*.9)*.12;sh.rotation.z=-.2+Math.max(0,Math.sin(t*2.2))*-.35;tl.rotation.y=Math.sin(t*1.5)*.15;stl.rotation.y=Math.sin(t*3)*.3}});
 return g}


/* ---------- 掘渊者: a three-metre digging beetle; drill-tipped forelimbs, a second pair of hollow tubes that suck up the spoil,
   which is pressed into a ball of salt and shot out behind; it gives off its own light in the tunnels ---------- */
function fxE_digger(){const g=new THREE.Group();const shell=M('#4e4438',{roughness:.35,metalness:.2}),dk=M('#2e2822',{roughness:.5}),glowM=EM('#d8f0ff',.9);
 g.add(loft([[-1.15,.72,0,.3,.42],[-.6,.9,0,.52,.68],[.15,.92,0,.54,.7],[.7,.82,0,.42,.55],[.95,.76,0,.3,.4]],{n:24,r:16,back:'#4e4438',belly:'#7a6a58',stripe:0,rough:.35}));
 g.add(tubeAlong([V3(-1.1,.95,0),V3(-.5,1.42,0),V3(.2,1.46,0),V3(.68,1.22,0)],.022,dk,14));
 const pro=sph(0,.38,.3,.48,14,shell);pro.position.set(.95,.85,0);g.add(pro);const hd=sph(0,.25,.2,.3,12,shell);hd.position.set(1.28,.78,0);g.add(hd);
 for(const z of[-1,1]){const e=sph(0,.06,.06,.06,8,glowM);e.position.set(1.45,.86,z*.16);g.add(e)}
 // light-giving spots along the flanks
 for(let i=0;i<5;i++)for(const z of[-1,1]){const sp=sph(0,.06,.04,.06,6,glowM);sp.position.set(.6-i*.35,.75,z*(.62-Math.abs(i-1.5)*.04));g.add(sp)}
 g.add(at(glowSprite('#d8f0ff',3.2,.35),1.4,.9,0));
 // forelimbs ending in drills
 const drills=[];for(const z of[-1,1]){const arm=new THREE.Group();arm.position.set(1.15,.7,z*.32);g.add(arm);arm.add(fxE_stick(V3(0,0,0),V3(.35,-.15,z*.1),.07,shell));arm.add(fxE_stick(V3(.35,-.15,z*.1),V3(.75,-.42,z*.12),.06,shell));
  const dr=new THREE.Group();dr.position.set(.75,-.42,z*.12);fxE_aim(dr,V3(.8,-.6,0));arm.add(dr);const bit=new THREE.Group();dr.add(bit);const cn=cone(.13,.55,M('#8a8478',{metalness:.5,roughness:.3}),10);cn.position.y=.3;bit.add(cn);
  const hp=[];for(let k=0;k<=24;k++){const t=k/24;const r=.13*(1-t)+.01;const a=t*6.283*3;hp.push(V3(Math.cos(a)*r,.03+t*.55,Math.sin(a)*r))}bit.add(tubeAlong(hp,.018,dk,48));drills.push({bit,arm,z})}
 // the second pair: hollow tubes reaching down to the ground ahead
 const tubeM=M('#5e5446',{roughness:.4,side:THREE.DoubleSide});const tubes=[];for(const z of[-1,1]){const tg=new THREE.Group();tg.position.set(.85,.6,z*.5);g.add(tg);const pts=[V3(0,0,0),V3(.25,-.2,z*.12),V3(.55,-.45,z*.1),V3(.75,-.56,z*.05)];
  tg.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),12,.055,8,false),tubeM));const mo=new THREE.Mesh(new THREE.TorusGeometry(.065,.02,5,10),dk);mo.position.copy(pts[3]);mo.rotation.x=Math.PI/2;tg.add(mo);tubes.push(tg)}
 // walking legs
 const L=[];for(const[x,ph]of[[.3,0],[-.45,Math.PI]])for(const z of[-1,1]){const l=leg2(.55,.6,.065,shell,.8);l.position.set(x,.7,z*.55);l.rotation.x=-z*.85;g.add(l);L.push({m:l,ph:ph+(z>0?Math.PI:0),a:.3,k:.9})}
 // the spout behind and the salt ball it fires
 const sp=cyl(.12,.18,.25,dk,10);sp.rotation.z=Math.PI/2;sp.position.set(-1.2,.72,0);g.add(sp);
 const saltM=M('#f2f0ea',{roughness:.55,flatShading:true});const ball=new THREE.Mesh(new THREE.IcosahedronGeometry(.3,1),saltM);g.add(ball);
 const spoil=[];for(let i=0;i<10;i++){const c=new THREE.Mesh(ko(.04+h3(i,1,3)*.03),saltM);g.add(c);spoil.push(c)}
 addLegs(g,L);stdAnim(g,{fq:5,amp:.3,extra:t=>{drills.forEach((d,i)=>{d.bit.rotation.y=t*18*(i?1:-1);d.arm.rotation.z=Math.sin(t*2+i*1.5)*.12});
  const q=(t*.25)%1;if(q<.65){const s=.35+q/.65*.65;ball.scale.setScalar(s);ball.position.set(-1.35-.3*s,.72,0);ball.rotation.set(t,t*.7,0)}else{const f=(q-.65)/.35;ball.scale.setScalar(1);ball.position.set(-1.65-f*4,.72+f*1.6-f*f*2.2,0)}
  spoil.forEach((c,i)=>{const k=((t*.9+i/10)%1);const tg=tubes[i%2];c.position.set(.85+.75*(1-k),.06+k*.5,tg.position.z+(i%2?-.05:.05)*(1-k));c.visible=k<.9})}});
 g.add(shadow(1.5));return g}

/* ---------- 爆哮虫: a fat bug that is mostly mouth, with a sound sac at the throat that swells before each roar ---------- */
function fxE_roarer(){const g=new THREE.Group();const sk=M('#7a6e4a',{roughness:.5}),pl=M('#5a4e34',{roughness:.4,metalness:.1}),lip=M('#9a3a34',{roughness:.45}),dark=M('#200808',{roughness:.4}),tooth=M('#efe6d2',{roughness:.3});
 g.add(loft([[-1.15,.78,0,.48,.52],[-.55,.98,0,.88,.92],[.15,1.02,0,.95,.98],[.65,1.0,0,.82,.84],[.95,1.05,0,.62,.62]],{n:26,r:18,back:'#6a5e3c',belly:'#a8987a',stripe:4}));
 // armour bands across the back
 for(let i=0;i<5;i++){const x=-.8+i*.38;const r=.9-Math.abs(i-2.2)*.09;const b=new THREE.Mesh(new THREE.TorusGeometry(r,.06,5,18,Math.PI),pl);b.position.set(x,.95,0);b.rotation.y=Math.PI/2;b.scale.y=1.02;g.add(b)}
 // the mouth: a wide funnel opening forward and up, rings of small teeth inside
 const mo=new THREE.Group();mo.position.set(1.05,1.2,0);mo.rotation.z=-.35;g.add(mo);
 const fun=new THREE.Mesh(new THREE.CylinderGeometry(.7,.5,.45,22,1,true),M('#8a5a44',{roughness:.5,side:THREE.DoubleSide}));fun.rotation.z=-Math.PI/2;fun.position.x=.12;mo.add(fun);
 const lp=new THREE.Mesh(new THREE.TorusGeometry(.7,.11,8,26),lip);lp.rotation.y=Math.PI/2;lp.position.x=.34;mo.add(lp);const pit=new THREE.Mesh(new THREE.CircleGeometry(.52,22),dark);pit.rotation.y=Math.PI/2;pit.position.x=-.08;mo.add(pit);
 for(const[r,n,x]of[[.62,18,.3],[.5,14,.12]])for(let i=0;i<n;i++){const a=i/n*6.283;const c=cone(.03,.12,tooth,4);c.position.set(x,Math.sin(a)*r,Math.cos(a)*r);fxE_aim(c,V3(-.3,-Math.sin(a),-Math.cos(a)));mo.add(c)}
 for(const z of[-1,1]){const e=sph(0,.07,.07,.07,8,M('#0c0c10',{roughness:.1}));e.position.set(.75,1.78,z*.32);g.add(e)}
 // the throat sac, translucent and veined
 const sacM=new THREE.MeshStandardMaterial({color:'#e8a0a0',emissive:'#6a2020',emissiveIntensity:.25,transparent:true,opacity:.7,roughness:.25,depthWrite:false});const sac=sph(0,.5,.45,.55,18,sacM);sac.position.set(1.02,.55,0);g.add(sac);
 // six stubby legs
 const L=[];for(let i=0;i<3;i++)for(const z of[-1,1]){const l=leg2(.3,.32,.08,pl,.5);l.position.set(.55-i*.6,.55,z*.72);l.rotation.x=-z*.5;g.add(l);L.push({m:l,ph:i*2+(z>0?Math.PI:0),a:.25,k:.5})}
 const rings=[];for(let i=0;i<3;i++){const r=fxE_soundRing(.75,'#ffe0c0',.05);r.rotation.y=Math.PI/2;mo.add(r);rings.push(r)}
 addLegs(g,L);stdAnim(g,{fq:3,amp:.2,extra:t=>{const q=(t*.33)%1;const fill=q<.55?q/.55:Math.max(0,1-(q-.55)/.12);const roar=q>.55?Math.sin(Math.min(1,(q-.55)/.45)*Math.PI):0;
  sac.scale.set(.42+fill*.45,.36+fill*.45,.46+fill*.5);mo.scale.setScalar(.85+roar*.3);mo.rotation.z=-.35-roar*.2;
  rings.forEach((r,i)=>{const k=(q-.55)/.45*1.6-i*.3;const on=k>0&&k<1;r.visible=on;if(on){r.position.x=.4+k*3.2;r.scale.setScalar(1+k*2.2);r.material.opacity=.6*(1-k)}})}});
 g.add(shadow(1.2));return g}

/* ---------- 叫树: a little tree with brown leaves, grown in a heap of earth; a swollen knot on its root records sounds and plays them back ---------- */
function fxE_calltree(){const g=new THREE.Group();const bark=M('#5a4430',{roughness:.95}),soil=M('#4a3a2a',{roughness:1});
 const heap=sph(0,.75,.28,.7,16,soil);heap.position.y=0;g.add(heap);
 // the swollen recording knot, pushed half out of the soil
 const bulbM=M('#7a5a3e',{roughness:.45});const bulb=sph(0,.24,.2,.22,14,bulbM);bulb.position.set(.12,.22,.08);g.add(bulb);
 for(let i=0;i<4;i++){const a=i*1.6+.3;g.add(tubeAlong([V3(.12,.15,.08),V3(.12+Math.cos(a)*.3,.12,.08+Math.sin(a)*.3),V3(.12+Math.cos(a)*.55,.03,.08+Math.sin(a)*.55)],.035,bark,6))}
 const tr=[V3(.1,.3,.06),V3(.05,.7,.02),V3(.1,1.05,-.04),V3(.02,1.35,0)];g.add(tubeAlong(tr,.05,bark,10));
 const leafG=new THREE.SphereGeometry(1,6,4);const LC=['#8a5a32','#a06a3a','#6a4426','#94643a'].map(c=>M(c,{roughness:.8,side:THREE.DoubleSide}));
 for(let b=0;b<6;b++){const a=b*1.05+h3(b,1,1);const y0=.7+b*.11;const tip=V3(Math.cos(a)*.42,y0+.25,Math.sin(a)*.42);g.add(tubeAlong([V3(.05,y0,0),V3(Math.cos(a)*.22,y0+.12,Math.sin(a)*.22),tip],.022,bark,6));
  for(let k=0;k<7;k++){const lf=new THREE.Mesh(leafG,LC[(b+k)%4]);lf.scale.set(.09,.018,.05);lf.position.set(tip.x+(h3(b,k,2)-.5)*.3,tip.y+(h3(b,k,3)-.4)*.2,tip.z+(h3(b,k,4)-.5)*.3);lf.rotation.set(h3(b,k,5)*2,h3(b,k,6)*6,h3(b,k,7)-.5);g.add(lf)}}
 const rings=[];for(let i=0;i<3;i++){const r=fxE_soundRing(.25,'#ffe8b0',.02);r.rotation.x=Math.PI/2;r.position.copy(bulb.position);g.add(r);rings.push(r)}
 g.add(shadow(.8));
 g.userData.anim=t=>{const q=(t*.4)%1;const k=q<.5?Math.sin(q*2*Math.PI):0;bulb.scale.set(.24*(1+k*.12),.2*(1+k*.15),.22*(1+k*.12));
  rings.forEach((r,i)=>{const f=((t*.8+i/3)%1);r.scale.setScalar(1+f*5);r.material.opacity=.5*(1-f)*(q<.6?1:.15)})};
 return g}

/* ---------- 剑蚤: a tiny flea-like thing that lives in a host's fluids; it moves by squirting water, bites with small fangs, and holds prey with barbed legs under its belly ---------- */
function fxE_flea(){const root=new THREE.Group(),g=new THREE.Group();root.add(g);g.position.y=1.0;root.userData.swim=1;
 const sh=M('#8a5a32',{roughness:.25,metalness:.15}),sh2=M('#6a4224',{roughness:.3}),fang=M('#efe2c4',{roughness:.3});
 const body=sph(0,.62,.5,.3,16,sh);g.add(body);for(let i=0;i<4;i++){const b=new THREE.Mesh(new THREE.TorusGeometry(1,.035,4,20),sh2);const x=.3-i*.22;const f=Math.sqrt(Math.max(0,1-(x/.62)**2));b.scale.set(.5*f,.5*f,.3*f);b.position.x=x;b.rotation.y=Math.PI/2;b.scale.set(.3*f,.5*f,1);g.add(b)}
 const hd=sph(0,.22,.2,.17,12,sh);hd.position.set(.62,.02,0);g.add(hd);for(const z of[-1,1]){const e=sph(0,.035,.035,.035,6,M('#0a0a0a',{roughness:.1}));e.position.set(.76,.08,z*.1);g.add(e);
  const f=cone(.025,.12,fang,4);f.position.set(.8,-.12,z*.05);f.rotation.z=Math.PI-.5;g.add(f)}
 // barbed legs under the belly, opening and snapping shut
 const legs=[];for(let i=0;i<5;i++)for(const z of[-1,1]){const l=leg2(.28,.3,.025,sh2,-.9);l.position.set(.35-i*.18,-.35,z*.12);l.rotation.x=-z*.35;g.add(l);for(let k=0;k<3;k++){const b=cone(.012,.06,fang,3);b.position.set(.02,-.08-k*.08,0);b.rotation.z=-1.2;l.userData.knee.add(b)}legs.push({l,ph:i*.5,z})}
 // the jet it swims by
 const jet=emitter({n:40,life:.9,speed:1.6,spread:.15,size:.25,dir:[-1,0,0],col:'#d8f4ff',op:.5,area:[.05,.05,.05]});jet.position.set(-.62,0,0);g.add(jet);
 root.userData.anim=t=>{const p=(t*1.2)%1;const kick=Math.max(0,1-p*3);g.position.set(Math.sin(t*.5)*.1,1.0+Math.sin(t*.8)*.12,0);g.rotation.z=Math.sin(t*.8)*.08-kick*.05;
  legs.forEach(x=>{const o=.5+.5*Math.sin(t*2.2+x.ph);x.l.rotation.z=-.4-o*.5;x.l.userData.knee.rotation.z=-.6-o*.6})};
 return root}

/* ---------- 焰生花: a low leafy shrub with one red, six-petalled flower; when it opens its sap catches fire, burns the moths and everything nearby, and flings its seeds into the ash ---------- */
function fxE_fireflower(){const g=new THREE.Group();const leaf=M('#3a6a2a',{roughness:.7,flatShading:true}),leaf2=M('#2e5a22',{roughness:.7,flatShading:true}),stem=M('#4a5a2a');
 const litter=new THREE.Mesh(new THREE.CircleGeometry(1.7,24),M('#6a5232',{roughness:1}));litter.rotation.x=-Math.PI/2;litter.position.y=.02;g.add(litter);
 for(let i=0;i<26;i++){const a=h3(i,1,1)*6.283,r=.3+h3(i,2,1)*1.3;const l=sph(0,.09,.012,.05,5,M(['#8a6a3a','#5a4222','#7a5a2e'][i%3]));l.position.set(Math.cos(a)*r,.04,Math.sin(a)*r);l.rotation.y=h3(i,3,1)*6;g.add(l)}
 // the bush: crowded clumps of leaves
 const lg=new THREE.IcosahedronGeometry(1,1);for(let i=0;i<11;i++){const a=i/11*6.283+h3(i,1,2),r=i?.25+h3(i,2,2)*.3:0;const m=new THREE.Mesh(lg,i%2?leaf:leaf2);const s=.28+h3(i,3,2)*.14;m.scale.set(s,s*.8,s);m.position.set(Math.cos(a)*r,.3+h3(i,4,2)*.35,Math.sin(a)*r);g.add(m)}
 // the one branch with the flower
 const br=[V3(0,.4,0),V3(.1,.8,.05),V3(.05,1.1,0)];g.add(tubeAlong(br,.035,stem,8));const fl=new THREE.Group();fl.position.set(.05,1.12,0);g.add(fl);
 const petG=new THREE.SphereGeometry(1,8,5);const petM=M('#d42a24',{roughness:.5,emissive:'#5a0a04',emissiveIntensity:.2,side:THREE.DoubleSide});const pets=[];
 for(let i=0;i<6;i++){const pv=new THREE.Group();pv.rotation.y=i/6*6.283;fl.add(pv);const h=new THREE.Group();pv.add(h);const p=new THREE.Mesh(petG,petM);p.scale.set(.26,.04,.12);p.position.x=.24;h.add(p);pets.push(h)}
 const sap=sph(0,.08,.05,.08,10,M('#e8b040',{roughness:.05,emissive:'#8a5a10',emissiveIntensity:.3}));sap.position.y=.04;fl.add(sap);
 const fire=emitter({n:60,life:1.1,speed:1.6,spread:.45,size:1.0,dir:[0,1,0],col:'#ffd060',col2:'#ff3010',op:.9,area:[.25,.05,.25]});fire.position.y=.1;fl.add(fire);
 const ground=emitter({n:60,life:.9,speed:.8,spread:.6,size:.8,dir:[0,1,0],col:'#ffb040',col2:'#c02008',op:.8,disc:1.4,area:[0,.05,0]});ground.position.y=.05;g.add(ground);
 const gl=glowSprite('#ff7a3a',3,.5);gl.position.y=1.2;g.add(gl);
 // moths drawn to the scent, and seeds that pop out of the flames
 const mothM=M('#3a3430',{side:THREE.DoubleSide});const mothG=new THREE.Group();const moths=[];for(let i=0;i<5;i++){const m=new THREE.Group();for(const z of[-1,1]){const w=new THREE.Mesh(new THREE.CircleGeometry(.08,5,0,Math.PI),mothM);w.rotation.x=-Math.PI/2;w.scale.z=z;m.add(w)}mothG.add(m);moths.push(m)}g.add(mothG);
 const seeds=[];for(let i=0;i<6;i++){const s=sph(0,.03,.025,.03,6,M('#2a2018'));g.add(s);seeds.push({s,a:i/6*6.283+.3,v:1.6+h3(i,1,5)})}
 g.userData.anim=t=>{const q=(t*.08)%1;const open=q<.3?q/.3:q<.85?1:1-(q-.85)/.15;const burn=q>.38&&q<.8?Math.sin((q-.38)/.42*Math.PI):0;
  pets.forEach(h=>h.rotation.z=.15+open*1.1);fire.visible=ground.visible=burn>.05;fire.scale.setScalar(.4+burn*.8);ground.scale.setScalar(.5+burn*.7);gl.material.opacity=.05+burn*.55;sap.visible=q>.2&&q<.45;
  moths.forEach((m,i)=>{const a=t*(1.4+i*.2)+i*1.3,r=.35+i*.07;m.position.set(.05+Math.cos(a)*r,1.35+i*.08+Math.sin(t*3+i)*.05-(burn>.5&&i<2?(burn-.5)*1.5:0),Math.sin(a)*r);m.rotation.y=-a;m.children.forEach((w,k)=>w.rotation.x=-Math.PI/2+(k?1:-1)*Math.sin(t*20+i)*.6);m.visible=!(q>.6&&q<.85&&i<2)});
  seeds.forEach(x=>{const f=(q-.55)/.2;x.s.visible=f>0&&f<1;if(x.s.visible){const d=f*x.v;x.s.position.set(.05+Math.cos(x.a)*d,1.15+f*1.2-f*f*2.2,Math.sin(x.a)*d)}})};
 return g}

/* ---------- 泡壳虾: a three-metre shrimp of the sea-scorpion line; it lays its eggs inside air bubbles stuck to the floor, sealed with tough slime ---------- */
function fxE_bubbleShrimp(){const g=new THREE.Group();const sk=M('#d8906a',{roughness:.35}),sk2=M('#b8704e',{roughness:.4});
 const sh=new THREE.Group();sh.position.y=.55;g.add(sh);
 sh.add(loft([[-1.7,.05,0,.1,.22],[-1.2,.12,0,.2,.28],[-.5,.2,0,.3,.36],[.3,.25,0,.36,.4],[.9,.22,0,.3,.32],[1.25,.15,0,.16,.18]],{n:30,r:14,back:'#c87a54',belly:'#f0c0a0',stripe:7}));
 const fan=new THREE.Group();fan.position.set(-1.72,.05,0);sh.add(fan);for(let i=0;i<5;i++){const a=(i-2)*.35;const p=sph(0,.28,.02,.08,6,sk);p.position.set(-.22*Math.cos(a),0,-.22*Math.sin(a)*1.4);p.rotation.y=a;fan.add(p)}
 for(const z of[-1,1]){sh.add(tubeAlong([V3(1.2,.2,z*.08),V3(1.9,.6,z*.35),V3(2.6,.55,z*.7)],.014,sk,10));const cl=new THREE.Group();cl.position.set(1.0,.05,z*.25);sh.add(cl);cl.add(fxE_stick(V3(0,0,0),V3(.4,-.15,z*.15),.04,sk2));const pc=sph(0,.14,.06,.07,8,sk);pc.position.set(.52,-.18,z*.18);cl.add(pc)}
 for(const z of[-1,1]){const e=sph(0,.05,.05,.05,8,M('#101010',{roughness:.1}));e.position.set(1.18,.32,z*.13);sh.add(e)}
 const L=[];for(let i=0;i<5;i++)for(const z of[-1,1]){const l=leg2(.32,.36,.025,sk2,.9);l.position.set(.7-i*.3,0,z*.26);l.rotation.x=-z*.9;sh.add(l);L.push({m:l,ph:i*.9+(z>0?Math.PI:0),a:.25,k:.9})}
 // the egg bubbles: stuck down with a collar of slime, a clutch of oval eggs inside each
 const bubM=new THREE.MeshStandardMaterial({color:'#e8f8ff',transparent:true,opacity:.28,roughness:.05,metalness:.3,depthWrite:false});const slime=M('#d8d4a8',{roughness:.3,transparent:true,opacity:.75});const eggM=M('#f08a48',{roughness:.3,emissive:'#6a2a08',emissiveIntensity:.3});
 const bubs=[];[[-.8,1.25,.5],[.1,1.45,.6],[.95,1.2,.45],[-.2,-1.3,.5]].forEach(([x,z,r],i)=>{const b=new THREE.Group();b.position.set(x,0,z);g.add(b);const s=sph(0,r,r*.92,r,18,bubM);s.position.y=r*.85;b.add(s);
  const col=new THREE.Mesh(new THREE.TorusGeometry(r*.62,r*.12,6,18),slime);col.rotation.x=Math.PI/2;col.position.y=r*.12;b.add(col);
  for(let k=0;k<9;k++){const a=k/9*6.283+i,d=(k%3)*.1*r+.08;const e=sph(0,.12,.08,.08,8,eggM);e.position.set(Math.cos(a)*d,.1+(k%2)*.09,Math.sin(a)*d);e.rotation.y=-a;b.add(e)}bubs.push({s,r,ph:i})});
 addLegs(g,L);stdAnim(g,{fq:4,amp:.22,extra:t=>{fan.rotation.z=Math.sin(t*1.5)*.15;bubs.forEach(b=>{const k=1+Math.sin(t*.9+b.ph)*.025;b.s.scale.set(b.r*k,b.r*.92/k,b.r*k)})}});
 g.add(shadow(1.3));return g}

/* ---------- 梦连者: shaped exactly like the abyss squid (古鱿), blue rings and all ---------- */
function fxE_dreamlink(){return bSquids({n:3,s:.6})}

// the scholar's flyer also roams the map as a fauna record; give it the same body



