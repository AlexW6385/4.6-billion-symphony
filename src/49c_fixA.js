/* ================================================================
   fixA: creatures rebuilt to follow the book more closely.
   every name here starts with fxA_ ; models are swapped in through SPEC at the end.
   ================================================================ */
/* a tube whose radius follows rf(t) (t 0..1 along the curve) */
function fxA_taper(pts,rf,mat,seg,rad){const cv=pts.isCurve?pts:new THREE.CatmullRomCurve3(pts);seg=seg||16;rad=rad||8;const geo=new THREE.TubeGeometry(cv,seg,1,rad,false);const p=geo.attributes.position,P=V3(),c=V3();
 for(let i=0;i<=seg;i++){cv.getPointAt(i/seg,c);const r=typeof rf==='function'?rf(i/seg):rf;for(let j=0;j<=rad;j++){const k=i*(rad+1)+j;P.fromBufferAttribute(p,k).sub(c).multiplyScalar(r).add(c);p.setXYZ(k,P.x,P.y,P.z)}}
 geo.computeVertexNormals();const m=new THREE.Mesh(geo,mat);m.userData.curve=cv;return m}
/* a rod from a to b (radius r0 at a, r1 at b) */
const fxA_Y=V3(0,1,0);
function fxA_rod(a,b,r0,r1,mat,seg){const d=b.clone().sub(a);const m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r0,d.length(),seg||7),mat);m.position.copy(a).addScaledVector(d,.5);m.quaternion.setFromUnitVectors(fxA_Y,d.normalize());return m}
function fxA_point(o,dir){o.quaternion.setFromUnitVectors(fxA_Y,dir.clone().normalize());return o}
/* a jointed limb through points P[0..n]; returns a group placed at P[0] (so it can swing about its root) */
function fxA_jlimb(P,rs,mat,jm){const g=new THREE.Group();const o=P[0];for(let i=0;i<P.length-1;i++){g.add(fxA_rod(P[i].clone().sub(o),P[i+1].clone().sub(o),rs[i],rs[i+1],mat,7));if(i>0){const j=sph(0,rs[i]*1.25,rs[i]*1.25,rs[i]*1.25,8,jm||mat);j.position.copy(P[i]).sub(o);g.add(j)}}g.position.copy(o);return g}

/* ---------- 利维坦: the first design, a wide hard disc that swims by jets ----------
   a ring of thirty jets round the rim and a big intake on top, hatches for the troops it carries,
   six heavy muscular tentacles underneath, each ending in a mouth of hooked teeth with suckers along it,
   eyes on stalks below and a lantern in front; for the land, three pairs of jointed legs (the back two pairs heavier);
   for the air, one pair of broad wings, butterfly-like, that open out of slits in the back */
function fxA_leviathan(f){const g=new THREE.Group();const col=f.col||'#41606a';const top=C(col),bel=C(col).lerp(C('#d8e8e0'),.52);
 const skin=M(col,{roughness:.5}),flesh=M(C(col).lerp(C('#b8786a'),.3).getStyle(),{roughness:.55}),bone=M('#efe6cf',{roughness:.3}),dark=M('#120c0c',{roughness:.95}),
  rimM=M(C(col).multiplyScalar(.6).getStyle(),{roughness:.4,metalness:.2,side:THREE.DoubleSide}),shellM=M(C(col).multiplyScalar(.72).getStyle(),{roughness:.36,metalness:.18}),
  sucM=M(C(col).lerp(C('#efe0d0'),.6).getStyle(),{roughness:.6});
 const RD=1.6,discY=r=>{const t=Math.asin(Math.min(1,r/RD))/(Math.PI/2);return(1-t*t)*.4};
 // the disc: domed above, flatter and pale below, the hard shell marked by plate seams
 const prof=[];for(let i=0;i<=18;i++){const t=i/18;prof.push(new THREE.Vector2(Math.max(.01,Math.sin(t*Math.PI*.5)*RD),(1-t*t)*.4))}
 for(let i=18;i>=0;i--){const t=i/18;prof.push(new THREE.Vector2(Math.max(.01,Math.sin(t*Math.PI*.5)*RD*.97),-(1-t*t)*.27-.03))}
 prof.reverse();const dg=new THREE.LatheGeometry(prof,40);{const pc=dg.attributes.position,cc=[];for(let i=0;i<pc.count;i++){const x=pc.getX(i),y=pc.getY(i),z=pc.getZ(i);const r=Math.hypot(x,z),a=Math.atan2(z,x);const c=bel.clone().lerp(top,sm(-.1,.1,y));
  if(y>.02&&(Math.abs(Math.sin(a*5))<.16||Math.abs(r-RD*.58)<.07||Math.abs(r-RD*.86)<.05))c.multiplyScalar(.62);if(y<-.02&&Math.abs(r-RD*.6)<.06)c.multiplyScalar(.85);cc.push(c.r,c.g,c.b)}
  dg.setAttribute('color',new THREE.Float32BufferAttribute(cc,3));dg.computeVertexNormals()}
 const body=new THREE.Mesh(dg,skinMat({rough:.42,metal:.12}));g.add(body);
 // thirty jets round the rim
 const nzG=new THREE.CylinderGeometry(.052,.08,.13,7,1,true),nzI=new THREE.CircleGeometry(.05,7);
 for(let i=0;i<30;i++){const a=i/30*6.283;const d=V3(Math.cos(a),0,Math.sin(a));const n=new THREE.Mesh(nzG,rimM);n.position.copy(d).multiplyScalar(RD-.01);fxA_point(n,d);g.add(n);
  const h=new THREE.Mesh(nzI,dark);h.position.copy(d).multiplyScalar(RD-.03);h.lookAt(h.position.clone().add(d));g.add(h)}
 // a heavier gas jet at the back
 {const d=V3(-1,0,0);const n=new THREE.Mesh(new THREE.CylinderGeometry(.11,.16,.2,9,1,true),rimM);n.position.set(-RD+.02,.02,0);fxA_point(n,d);g.add(n);const h=new THREE.Mesh(new THREE.CircleGeometry(.1,9),dark);h.position.set(-RD-.02,.02,0);h.rotation.y=-Math.PI/2;g.add(h)}
 // the intake on top: a raised collar round a dark mouth with a grille
 {const ip=[[.56,discY(.56)-.04],[.5,.5],[.44,.57],[.37,.58],[.33,.52],[.31,.46]].map(p=>new THREE.Vector2(p[0],p[1]));const col2=new THREE.Mesh(new THREE.LatheGeometry(ip,26),shellM);g.add(col2);
  const hole=new THREE.Mesh(new THREE.CircleGeometry(.32,20),dark);hole.rotation.x=-Math.PI/2;hole.position.y=.47;g.add(hole);
  for(let i=0;i<4;i++){const b=new THREE.Mesh(new THREE.BoxGeometry(.6,.03,.035),rimM);b.position.y=.49;b.rotation.y=i/4*Math.PI;g.add(b)}}
 // hatches the troops come out of
 for(let i=0;i<6;i++){const a=i/6*6.283+.52;const r=.98;const y=discY(r);const hm=sph(0,.15,.035,.1,10,dark);hm.position.set(Math.cos(a)*r,y+.005,Math.sin(a)*r);hm.rotation.y=-a;g.add(hm);
  const lip=sph(0,.18,.04,.13,10,shellM);lip.position.set(Math.cos(a)*r,y-.012,Math.sin(a)*r);lip.rotation.y=-a;g.add(lip)}
 // the slits the wings come out of
 for(const z of[-1,1]){const s=new THREE.Mesh(new THREE.BoxGeometry(.9,.04,.05),dark);s.position.set(.05,discY(.72)+.01,z*.72);s.rotation.x=-z*.25;g.add(s)}
 // eyes on short stalks beneath, a lantern in front
 const eyes=[];for(let i=0;i<5;i++){const a=i/5*6.283+.3;g.add(tubeAlong([V3(Math.cos(a)*.45,-.26,Math.sin(a)*.45),V3(Math.cos(a)*.62,-.5,Math.sin(a)*.62)],.03,skin,6));const e=sph(0,.08,.08,.08,10,GL('#d6fff4'));e.position.set(Math.cos(a)*.64,-.55,Math.sin(a)*.64);g.add(e);eyes.push(e)}
 g.add(tubeAlong([V3(1.25,-.05,0),V3(1.75,-.12,0),V3(2.05,-.4,0)],.028,skin,10));const lan=sph(0,.11,.13,.11,10,GL('#c6fff0'));lan.position.set(2.07,-.48,0);g.add(lan);const lg=glowSprite('#9fffe8',1.3,.55);lg.position.copy(lan.position);g.add(lg);
 // eyeballs that float alongside and do most of the looking
 const floats=[];for(let i=0;i<3;i++){const fe=new THREE.Group();const w=sph(0,.09,.09,.09,10,M('#f4f2ea',{roughness:.2}));fe.add(w);const pu=sph(0,.045,.045,.03,8,M('#101418',{roughness:.1}));pu.position.x=.075;fe.add(pu);g.add(fe);floats.push(fe)}
 // six tentacles of solid muscle, a toothed mouth at the end of each, suckers on the inner side
 const tents=[];const sucG=new THREE.CylinderGeometry(1,.8,1,7);const toothG=new THREE.ConeGeometry(.022,.11,4);const mouthG=new THREE.CircleGeometry(.1,10);
 for(let i=0;i<6;i++){const a=i/6*6.283+Math.PI/6;const d=V3(Math.cos(a),0,Math.sin(a));const tg2=new THREE.Group();tg2.position.copy(d).multiplyScalar(.72).setY(-.24);g.add(tg2);
  const pts=[V3(0,0,0),d.clone().multiplyScalar(.12).setY(-.45),d.clone().multiplyScalar(.3).setY(-.95),d.clone().multiplyScalar(.55).setY(-1.3),d.clone().multiplyScalar(.85).setY(-1.42),d.clone().multiplyScalar(1.05).setY(-1.3)];
  const rf=t=>.17*(1-t*.5)*(1+.12*Math.sin(t*9));const tm=fxA_taper(pts,rf,flesh,20,9);tg2.add(tm);const cv=tm.userData.curve;
  // suckers in two rows on the side facing the middle
  const T=V3(),P=V3();for(let k=0;k<8;k++){const t=.2+k*.085;cv.getPointAt(t,P);cv.getTangentAt(t,T);const n=d.clone().negate().addScaledVector(T,-T.dot(d.clone().negate())).normalize();const b=T.clone().cross(n).normalize();
   for(const sd of[-1,1]){const s=new THREE.Mesh(sucG,sucM);const r=rf(t);s.position.copy(P).addScaledVector(n,r*.92).addScaledVector(b,sd*r*.42);fxA_point(s,n);s.scale.set(r*.32,.03,r*.32);tg2.add(s)}}
  // the mouth: a swollen tip, dark inside, a ring of hooked teeth
  const end=cv.getPointAt(1),te=cv.getTangentAt(1);const mg=new THREE.Group();mg.position.copy(end);mg.quaternion.setFromUnitVectors(V3(0,0,1),te);tg2.add(mg);
  const bulb=sph(0,.14,.14,.16,12,flesh);mg.add(bulb);const mo=new THREE.Mesh(mouthG,dark);mo.position.z=.15;mg.add(mo);
  for(let k=0;k<9;k++){const b2=k/9*6.283;const t2=new THREE.Mesh(toothG,bone);t2.position.set(Math.cos(b2)*.105,Math.sin(b2)*.105,.13);fxA_point(t2,V3(-Math.cos(b2)*.8,-Math.sin(b2)*.8,.5));mg.add(t2)}
  tents.push({m:tg2,a})}
 // three pairs of jointed legs for the land: the front pair slim, the two pairs behind it heavy, with broad feet
 const legM=shellM,L=[];
 for(const[x,r]of[[.85,.045],[0,.075],[-.8,.08]])for(const z of[-1,1]){const zr=Math.sqrt(RD*RD-x*x)*.86;const P0=V3(x,-.1,z*zr*.92),P1=V3(x+.05,.28,z*(zr+.38)),P2=V3(x+.1,-.55,z*(zr+.72)),P3=V3(x+.12,-1.42,z*(zr+.82));
  const l=fxA_jlimb([P0,P1,P2,P3],[r*1.2,r,r*.9,r*(x<.5?1.3:.6)],legM);if(x<.5){const ft=sph(0,r*2.2,r*.8,r*1.8,8,legM);ft.position.copy(P3).sub(P0);l.add(ft)}else{const c=cone(r*.7,.16,bone,5);c.position.copy(P3).sub(P0).add(V3(0,-.06,0));c.rotation.x=Math.PI;l.add(c)}
  g.add(l);L.push({m:l,ph:(x*2)+(z>0?Math.PI:0),a:.12})}
 // broad wings, rounded like a butterfly's, veined
 const wingShape=s=>{const sh=new THREE.Shape();sh.moveTo(.45,0);sh.bezierCurveTo(1.0,.9*s,1.25,2.2*s,.75,2.95*s);sh.bezierCurveTo(.45,3.25*s,-.05,3.15*s,-.25,2.55*s);sh.quadraticCurveTo(-.2,2.0*s,-.32,1.75*s);
  sh.bezierCurveTo(-1.15,2.2*s,-1.85,1.6*s,-1.55,.85*s);sh.quadraticCurveTo(-1.25,.25*s,-.45,0);sh.lineTo(.45,0);const geo=new THREE.ShapeGeometry(sh,10);geo.rotateX(Math.PI/2);return geo};
 const wOut=new THREE.MeshStandardMaterial({color:C(col).lerp(C('#2a3a3a'),.4),transparent:true,opacity:.86,side:THREE.DoubleSide,roughness:.45,depthWrite:false}),
  wIn=new THREE.MeshStandardMaterial({color:C(col).lerp(C('#d8f0e8'),.55),emissive:C(col).lerp(C('#8fe0d0'),.5),emissiveIntensity:.12,transparent:true,opacity:.62,side:THREE.DoubleSide,roughness:.3,depthWrite:false}),
  vM=new THREE.LineBasicMaterial({color:C(col).multiplyScalar(.55),transparent:true,opacity:.7});
 const wings=[];for(const z of[-1,1]){const wg=new THREE.Group();wg.position.set(.05,discY(.72)+.03,z*.72);g.add(wg);const wo=new THREE.Mesh(wingShape(z),wOut);wg.add(wo);
  const wi=new THREE.Mesh(wingShape(z),wIn);wi.scale.set(.8,1,.8);wi.position.set(.05,.006,z*.22);wg.add(wi);
  const vp=[];for(const[ex,ey]of[[.8,2.7],[.2,3.0],[-.25,2.4],[-.9,1.9],[-1.4,1.1],[-.9,.35],[.85,1.6]]){vp.push(V3(0,.01,0),V3(ex*.92,.01,z*ey*.92))}wg.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(vp),vM));
  wings.push({m:wg,z})}
 addLegs(g,L);g.userData.noSkin=1;
 g.userData.anim=(t)=>{for(const w of wings)w.m.rotation.x=-w.z*(.22+Math.sin(t*1.5)*.42);
  tents.forEach((tt,i)=>{tt.m.rotation.z=Math.sin(t*1.3+i)*.18;tt.m.rotation.x=Math.cos(t*1.1+i*.7)*.18});
  for(const l of L)l.m.rotation.z=Math.sin(t*1.2+l.ph)*l.a;
  floats.forEach((fe,i)=>{const a=t*.4+i*2.1;fe.position.set(Math.cos(a)*2.2,-.2+Math.sin(t*1.3+i)*.25,Math.sin(a)*2.2);fe.rotation.y=-a-Math.PI/2});
  body.rotation.z=Math.sin(t*.7)*.03;lg.material.opacity=.4+Math.sin(t*3)*.15};
 return g}

/* ---------- 冰晶怪: a big flat trilobite-like crawler in a shell like white crystal ----------
   a round head shield, a long flat tail, thick forelimbs ending in curved saw-edged blades,
   four walking legs and a last pair bent backwards with open tips that can squirt water */
function fxA_bingjing(f){const g=new THREE.Group();
 const xm=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.1,metalness:.08,flatShading:true,emissive:'#2a7a98',emissiveIntensity:.22});
 const xs=new THREE.MeshStandardMaterial({color:'#eefbff',roughness:.06,metalness:.1,flatShading:true,emissive:'#4ab8d8',emissiveIntensity:.3});
 const xd=new THREE.MeshStandardMaterial({color:'#a8d4e4',roughness:.18,metalness:.05,flatShading:true,emissive:'#1a5a78',emissiveIntensity:.2});
 const spec=[[1.85,.3,0,.05,.3],[1.6,.36,0,.17,.82],[1.15,.42,0,.25,1.02],[.6,.43,0,.27,.86],[.05,.41,0,.25,.74],[-.55,.37,0,.21,.6],[-1.15,.31,0,.15,.47],[-1.75,.25,0,.09,.4],[-2.25,.21,0,.05,.43],[-2.6,.2,0,.025,.24]];
 const bodyG=loftGeo(spec,{n:44,r:10,back:'#f6fcff',belly:'#9cc4d4'});const body=new THREE.Mesh(bodyG,xm);g.add(body);
 const at2=x=>{for(let i=0;i<spec.length-1;i++){const a=spec[i],b=spec[i+1];if(x<=a[0]&&x>=b[0]){const k=(a[0]-x)/(a[0]-b[0]);return[a[1]+(b[1]-a[1])*k,a[3]+(b[3]-a[3])*k,a[4]+(b[4]-a[4])*k]}}return[.3,.1,.3]};
 // the raised middle lobe and the segment ridges across the back
 g.add(loft([[1.3,.6,0,.08,.2],[.7,.66,0,.1,.26],[0,.62,0,.09,.24],[-.8,.53,0,.07,.18],[-1.7,.4,0,.04,.12],[-2.2,.3,0,.02,.06]],{n:30,r:8,back:'#ffffff',belly:'#d8eef8'}));
 for(let i=0;i<10;i++){const x=.75-i*.3;const[y,ry,rz]=at2(x);for(const z of[-1,1]){const r=new THREE.Mesh(new THREE.BoxGeometry(.07,.05,rz*.82),xd);r.position.set(x,y+ry*.72,z*rz*.48);r.rotation.x=-z*.32;g.add(r)}
  const c=new THREE.Mesh(ko(1),xs);c.position.set(x,y+ry+.08,0);c.scale.set(.09,.12+(i<4?.06:0),.07);g.add(c)}
 // crystal shards rising from the head shield
 for(let i=0;i<7;i++){const a=(i/6-.5)*2.2;const c=new THREE.Mesh(ko(1),xs);c.position.set(1.2+Math.cos(a)*.45,.62,Math.sin(a)*.62);c.scale.set(.07,.2+(i%2)*.08,.06);c.rotation.set(Math.sin(a)*.5,0,-.3);g.add(c)}
 // the head's front edge, a rim of sharp crystal
 for(let i=0;i<9;i++){const a=(i/8-.5)*2.6;const c=new THREE.Mesh(ko(1),xs);c.position.set(1.45+Math.cos(a)*.38,.3,Math.sin(a)*.95);c.scale.set(.12,.05,.08);c.rotation.y=-a;g.add(c)}
 // forelimbs: thick, the last joint a curved blade with a saw edge on the inside
 const bladeShape=new THREE.Shape();{const q=(p0,p1,p2,t)=>[(1-t)*(1-t)*p0[0]+2*(1-t)*t*p1[0]+t*t*p2[0],(1-t)*(1-t)*p0[1]+2*(1-t)*t*p1[1]+t*t*p2[1]];
  const O=[[0,.08],[.62,.16],[.86,-.55]],I=[[0,-.1],[.46,-.02],[.86,-.55]];bladeShape.moveTo(0,.08);for(let k=1;k<=10;k++){const p=q(O[0],O[1],O[2],k/10);bladeShape.lineTo(p[0],p[1])}
  for(let k=10;k>=0;k--){const p=q(I[0],I[1],I[2],k/10);const tooth=k%2?.06:0;bladeShape.lineTo(p[0]-tooth*.4,p[1]-tooth)}}
 const bladeG=new THREE.ExtrudeGeometry(bladeShape,{depth:.05,bevelEnabled:false});bladeG.translate(0,0,-.025);
 const arms=[];for(const z of[-1,1]){const P0=V3(1.3,.28,z*.62),P1=V3(1.75,.5,z*.95),P2=V3(2.25,.42,z*.78);const a=fxA_jlimb([P0,P1,P2],[.13,.11,.09],xd,xs);const bl=new THREE.Mesh(bladeG,xs);bl.position.copy(P2).sub(P0);bl.rotation.y=z*.35;bl.scale.setScalar(1.15);a.add(bl);g.add(a);arms.push({m:a,z})}
 // four walking legs, then two bent back with open tips
 const L=[];for(const[x,ph]of[[.65,0],[.05,1.7]])for(const z of[-1,1]){const P0=V3(x,.28,z*.62);const l=fxA_jlimb([P0,V3(x+.05,.58,z*1.12),V3(x+.15,.05,z*1.42),V3(x+.2,0,z*1.5)],[.09,.075,.055,.03],xd,xs);g.add(l);L.push({m:l,ph:ph+(z>0?Math.PI:0),a:.28})}
 for(const z of[-1,1]){const P0=V3(-.5,.27,z*.5);const l=new THREE.Group();l.position.copy(P0);const pts=[V3(0,0,0),V3(-.15,.25,z*.42),V3(-.6,.2,z*.68),V3(-1.15,.08,z*.72)];l.add(fxA_taper(pts,t=>.085-t*.03,xd,12,7));
  const n=new THREE.Mesh(new THREE.CylinderGeometry(.075,.06,.16,8,1,true),new THREE.MeshStandardMaterial({color:'#eefbff',roughness:.1,flatShading:true,side:THREE.DoubleSide}));n.position.set(-1.2,.07,z*.72);fxA_point(n,V3(-1,-.1,0));l.add(n);
  const h=new THREE.Mesh(new THREE.CircleGeometry(.06,8),M('#0c1a22'));h.position.set(-1.2,.07,z*.72);h.rotation.y=-Math.PI/2;l.add(h);g.add(l);L.push({m:l,ph:3+(z>0?Math.PI:0),a:.12})}
 addLegs(g,L);g.userData.noSkin=1;
 g.userData.anim=(t)=>{for(const l of L)l.m.rotation.z=Math.sin(t*3.2+l.ph)*l.a;for(const a of arms){a.m.rotation.z=.08+Math.sin(t*1.1+a.z)*.1;a.m.rotation.y=a.z*Math.sin(t*.9)*.08}body.rotation.y=Math.sin(t*1.6)*.015};
 return g}

/* fold every mesh under `root` into one mesh per material (worm segments are moved by the herd code and never baked) */
function fxA_merge(root){if(!THREE.BufferGeometryUtils)return root;root.updateMatrixWorld(true);const inv=root.matrixWorld.clone().invert(),by=new Map(),m4=new THREE.Matrix4();
 root.traverse(c=>{if(!c.isMesh)return;m4.multiplyMatrices(inv,c.matrixWorld);let q=c.geometry.index?c.geometry.toNonIndexed():c.geometry.clone();
  for(const k of Object.keys(q.attributes))if(k!=='position'&&k!=='normal'&&!(k==='color'&&c.material.vertexColors))q.deleteAttribute(k);q.applyMatrix4(m4);(by.get(c.material)||by.set(c.material,[]).get(c.material)).push(q)});
 while(root.children.length)root.remove(root.children[0]);for(const[mat,list]of by){const geo=list.length>1?THREE.BufferGeometryUtils.mergeBufferGeometries(list):list[0];if(geo)root.add(new THREE.Mesh(geo,mat))}return root}
/* ---------- worms: one group per segment, the herd moves and turns each segment; +x is forward in each ---------- */
const fxA_barrelG={};function fxA_barrel(r,len,rad,ridge){const k=[r,len,rad,ridge].join('|');if(fxA_barrelG[k])return fxA_barrelG[k];
 const p=[[r*.72,-len/2],[r*.92,-len*.32],[r,-len*.05],[r*(1+(ridge||0)),len*.12],[r*.95,len*.3],[r*.8,len/2]].map(q=>new THREE.Vector2(q[0],q[1]));const geo=new THREE.LatheGeometry(p,rad||14);geo.rotateZ(-Math.PI/2);return fxA_barrelG[k]=geo}
/* a ring of barbed spikes raked backwards round a segment */
function fxA_barbRing(s,x,r,n,len,mat,ph){const cg=new THREE.ConeGeometry(len*.2,len,4);for(let k=0;k<n;k++){const a=k/n*6.283+(ph||0);const d=V3(-.62,Math.cos(a),Math.sin(a)).normalize();const c=new THREE.Mesh(cg,mat);c.position.set(x,Math.cos(a)*r,Math.sin(a)*r).addScaledVector(d,len*.4);fxA_point(c,d);s.add(c);
  const b=new THREE.Mesh(cg,mat);const d2=V3(-.95,Math.cos(a)*.3,Math.sin(a)*.3).normalize();b.scale.setScalar(.45);b.position.copy(c.position).addScaledVector(d,len*.15).addScaledVector(d2,len*.15);fxA_point(b,d2);s.add(b)}}
/* 迷雾蠕虫 (and the same worms in the desert): heavy armour all over, a huge blunt armoured head like a Dunkleosteus,
   rings of barbed spikes on every segment, a mouth full of hooked teeth */
function fxA_mistWorm(f){const g=new THREE.Group();g.userData.segs=[];g.userData.free=1;const sand=f.w==='shawurm';const n=sand?14:12;const col=f.col||(sand?'#b98b5c':'#7f7a6a');
 const arm=M(col,{roughness:.55,metalness:.08}),arm2=M(C(col).multiplyScalar(.72).getStyle(),{roughness:.45,metalness:.1}),spk=M(C(col).lerp(C('#efe4c8'),.6).getStyle(),{roughness:.4}),dark=M('#1c0e0c',{roughness:.9}),tooth=M('#f2ead4',{roughness:.3});
 for(let i=0;i<n;i++){const s=new THREE.Group();const k=new THREE.Group();k.scale.setScalar(1-i*.032);s.add(k);
  if(i===0){// the head: bony upper and lower shields hinged at the back, open on a dark mouth lined with hooks
   k.scale.setScalar(1.28);const hemi=new THREE.SphereGeometry(1,18,8,0,Math.PI*2,0,Math.PI/2);
   const up=new THREE.Group();up.position.x=-.45;up.rotation.z=.2;k.add(up);const u=new THREE.Mesh(hemi,arm2);u.scale.set(.95,.52,.66);u.position.x=.45;up.add(u);
   const lo=new THREE.Group();lo.position.x=-.45;lo.rotation.z=-.24;k.add(lo);const l=new THREE.Mesh(hemi,arm);l.scale.set(.9,-.42,.62);l.position.x=.45;lo.add(l);
   // the armour plates of the skull, a ridge, the jaw blades
   const cap=sph(0,.5,.22,.42,12,arm);cap.position.set(.05,.36,0);up.add(cap);const crest=new THREE.Mesh(new THREE.BoxGeometry(.7,.08,.06),arm2);crest.position.set(.1,.55,0);up.add(crest);
   for(const z of[-1,1]){const pl=sph(0,.4,.2,.12,10,arm);pl.position.set(.5,.14,z*.5);pl.rotation.y=-z*.5;up.add(pl);const jb=sph(0,.42,.07,.1,8,arm2);jb.position.set(.62,-.05,z*.42);jb.rotation.y=-z*.55;lo.add(jb)}
   const tg=new THREE.ConeGeometry(.035,.17,4);for(let j=0;j<13;j++){const a=(j/12-.5)*Math.PI*1.05;const px=.45+Math.cos(a)*.92,pz=Math.sin(a)*.62;
    const tu=new THREE.Mesh(tg,tooth);tu.position.set(px,-.06,pz);fxA_point(tu,V3(-Math.cos(a)*.3,-1,-Math.sin(a)*.3));up.add(tu);
    const tl=new THREE.Mesh(tg,tooth);tl.position.set(px*.97,.06,pz*.97);fxA_point(tl,V3(-Math.cos(a)*.3,1,-Math.sin(a)*.3));lo.add(tl)}
   const throat=sph(0,.55,.3,.45,12,dark);throat.position.x=.1;k.add(throat);
   for(let j=0;j<10;j++){const a=j/10*6.283;const t=new THREE.Mesh(tg,tooth);t.position.set(.28,Math.cos(a)*.22,Math.sin(a)*.3);fxA_point(t,V3(-.5,-Math.cos(a),-Math.sin(a)));t.scale.setScalar(.8);k.add(t)}
   const collar=new THREE.Mesh(fxA_barrel(.66,.5,14,.06),arm);collar.position.x=-.62;k.add(collar);fxA_barbRing(k,-.6,.66,9,.3,spk,.3)}
  else{const core=new THREE.Mesh(fxA_barrel(.66,1.0,14,.07),i%2?arm:arm2);k.add(core);
   const band=new THREE.Mesh(new THREE.TorusGeometry(.69,.045,4,16),arm2);band.rotation.y=Math.PI/2;band.position.x=.12;k.add(band);
   if(i<n-1)fxA_barbRing(k,.12,.68,8,.32,spk,i*.4);else{const tip=cone(.3,.7,arm2,8);tip.rotation.z=Math.PI/2;tip.position.x=-.6;k.add(tip)}}
  fxA_merge(k);g.add(s);g.userData.segs.push(s)}
 return g}
/* 炼狱蠕虫: armour like stacked layers of rock, segment on segment; a head over ten metres across,
   two pairs of sickle limbs at its sides, a toothless mouth worn smooth, ten red eyes across the brow */
function fxA_lavaWorm(f){const g=new THREE.Group();g.userData.segs=[];g.userData.free=1;const n=13;
 const rock=new THREE.MeshStandardMaterial({color:'#4a3a30',roughness:.95,flatShading:true}),rock2=new THREE.MeshStandardMaterial({color:'#5e4a3c',roughness:.9,flatShading:true}),rock3=new THREE.MeshStandardMaterial({color:'#33271f',roughness:.95,flatShading:true});
 const smooth=M('#7a665a',{roughness:.18,metalness:.05}),dark=M('#140a06',{roughness:1}),eye=EM('#ff2a12',.9,{roughness:.2}),claw=M('#2e231c',{roughness:.5});
 const jag=(geo,amt,seed)=>{const p=geo.attributes.position;const R=rnd(seed);for(let i=0;i<p.count;i++){const k=1+(R()-.5)*amt;p.setXYZ(i,p.getX(i),p.getY(i)*k,p.getZ(i)*k)}geo.computeVertexNormals();return geo};
 const segG=jag(fxA_barrel(.7,1.0,9,.05).clone(),.12,11),plateG=jag(new THREE.CylinderGeometry(.8,.74,.32,9,1,true).rotateZ(-Math.PI/2),.1,7);
 for(let i=0;i<n;i++){const s=new THREE.Group();const k=new THREE.Group();k.scale.setScalar(1-i*.03);s.add(k);
  if(i===0){k.scale.setScalar(1.55);
   // a blunt rock head of overlapping layers
   const hd=new THREE.Mesh(jag(new THREE.CylinderGeometry(.72,.8,1.0,10,2,false).rotateZ(-Math.PI/2),.1,3),rock);k.add(hd);
   for(let j=0;j<3;j++){const pl=new THREE.Mesh(plateG,j%2?rock2:rock3);pl.position.x=-.35+j*.3;pl.scale.set(1,1.04+j*.02,1.04+j*.02);k.add(pl)}
   // the mouth: round, no teeth, the inner rim worn glass-smooth, heat deep in the throat
   const rim=new THREE.Mesh(new THREE.TorusGeometry(.48,.12,8,20),smooth);rim.rotation.y=Math.PI/2;rim.position.x=.52;k.add(rim);
   const mo=new THREE.Mesh(new THREE.CircleGeometry(.5,18),dark);mo.rotation.y=Math.PI/2;mo.position.x=.5;k.add(mo);
   const th=sph(0,.04,.2,.2,10,EM('#ff5a18',.7));th.position.x=.47;k.add(th);
   // ten red eyes across the brow, in two arcs
   for(let j=0;j<10;j++){const row=j<5?0:1,c=(j%5)-2;const a=c*.32;const e=sph(0,.055,.055,.055,8,eye);e.position.set(.48-row*.12,.62+row*.1-Math.abs(c)*.04,Math.sin(a)*.55);g.userData.eyes=1;k.add(e)}
   // two pairs of sickles beside the head
   for(const z of[-1,1])for(const[y,len]of[[.3,1.0],[-.3,.85]]){const pts=[V3(-.1,y,z*.72),V3(.35,y*1.3,z*1.05),V3(.85,y*1.1,z*1.05),V3(1.15*len,y*.6,z*.8)];const sk=fxA_taper(pts,t=>.1*(1-t*.75),claw,12,6);k.add(sk);const tp=cone(.04,.28,claw,5);tp.position.copy(pts[3]);fxA_point(tp,V3(.3,-y*.6,-z*.9));k.add(tp)}}
  else{const core=new THREE.Mesh(segG,i%2?rock:rock2);k.add(core);const pl=new THREE.Mesh(plateG,i%3?rock3:rock);pl.position.x=.3;k.add(pl);
   if(i===n-1){const tip=cone(.38,.8,rock3,8);tip.rotation.z=Math.PI/2;tip.position.x=-.7;k.add(tip)}}
  fxA_merge(k);g.add(s);g.userData.segs.push(s)}
 return g}

/* ---------- swap them in ---------- */
SPEC.lvtan_beast=fxA_leviathan;SPEC.bingjing=fxA_bingjing;SPEC.mwrc=fxA_mistWorm;SPEC.shawurm=fxA_mistWorm;SPEC.lianyu=fxA_lavaWorm;

/* ---------- 古鱿: tiny, a round body under a thin membrane, ten tentacles, and colour that never sits still ----------
   it changes colour to hide, to talk and to show what it feels (white, red, yellow, black when afraid);
   one of them carries a shard of bone to fight with */
const fxA_GYP=['#8a7a64','#f2f2ee','#d8302a','#e8c030','#8a7a64','#141414','#b98aa0'].map(c=>C(c));
function fxA_guyou(f){const g=new THREE.Group();const ph=Math.random()*20;
 const skin=new THREE.MeshStandardMaterial({color:f.col||'#b98aa0',roughness:.45}),mem=new THREE.MeshStandardMaterial({color:'#ffffff',transparent:true,opacity:.2,roughness:.05,metalness:.1,depthWrite:false});
 const body=sph(0,.42,.4,.42,16,skin);body.position.set(-.05,.55,0);g.add(body);const mb=sph(0,.48,.46,.48,16,mem);mb.position.copy(body.position);g.add(mb);
 const wh=M('#f4f0e6',{roughness:.2}),pu=M('#0a0a0c',{roughness:.05});
 for(const z of[-1,1]){const e=sph(0,.1,.11,.1,10,wh);e.position.set(.24,.66,z*.26);g.add(e);const p=sph(0,.05,.07,.05,8,pu);p.position.set(.32,.66,z*.3);g.add(p)}
 const beak=cone(.05,.12,M('#2a1c18',{roughness:.3}),5);beak.position.set(.36,.36,0);beak.rotation.z=-Math.PI/2-.5;g.add(beak);
 const tents=[];const d0=V3(.8,-.6,0).normalize();const b1=V3(0,0,1),b2=d0.clone().cross(b1).normalize();
 for(let i=0;i<10;i++){const a=i/10*6.283;const off=b1.clone().multiplyScalar(Math.cos(a)).addScaledVector(b2,Math.sin(a));const root=V3(.22,.36,0).addScaledVector(off,.17);
  const tg2=new THREE.Group();tg2.position.copy(root);g.add(tg2);const out=d0.clone().addScaledVector(off,.55).normalize();
  const pts=[V3(0,0,0),out.clone().multiplyScalar(.3),out.clone().multiplyScalar(.6).add(V3(-.05,-.08,0)).addScaledVector(off,.08),out.clone().multiplyScalar(.85).add(V3(-.18,-.12,0)).addScaledVector(off,.15)];
  tg2.add(fxA_taper(pts,t=>.055*(1-t*.75),skin,10,6));
  if(i===2){const sh=cone(.03,.32,M('#ece4cc',{roughness:.6}),4);sh.position.copy(pts[3]);fxA_point(sh,V3(1,.3,0));tg2.add(sh)}
  tents.push({m:tg2,a})}
 g.userData.noSkin=1;g.userData.swim=1;const cc=new THREE.Color();
 g.userData.anim=t=>{const u=(t+ph)/3.2,k=Math.floor(u),fr=sm(.65,1,u-k);cc.copy(fxA_GYP[k%fxA_GYP.length]).lerp(fxA_GYP[(k+1)%fxA_GYP.length],fr);skin.color.copy(cc);
  tents.forEach((q,i)=>{q.m.rotation.z=Math.sin(t*3+i)*.22;q.m.rotation.y=Math.cos(t*2.4+i*.8)*.2});body.scale.set(.42,.4+Math.sin(t*2.2)*.02,.42)};
 return g}

/* ---------- 箭石: three metres, a long cone of shell, ten thick tentacles whose suckers have toothed rims,
   two of them longer for snatching, a hard beak in the middle and a water jet on the head ---------- */
function fxA_jianshi(f){const g=new THREE.Group();const col=f.col||'#c9b58f';
 const prof=[];for(let i=0;i<=16;i++){const t=i/16;prof.push(new THREE.Vector2(Math.max(.004,.44*Math.pow(t,.7)),-1.75+t*2.05))}
 const sg=new THREE.LatheGeometry(prof,18);{const p=sg.attributes.position,cc=[];const a=C(col),b=C(col).multiplyScalar(.72),c2=new THREE.Color();for(let i=0;i<p.count;i++){const y=p.getY(i);c2.copy(Math.sin(y*16)>.55?b:a).lerp(C('#efe6d2'),sm(-.1,.3,p.getX(i))*.25);cc.push(c2.r,c2.g,c2.b)}sg.setAttribute('color',new THREE.Float32BufferAttribute(cc,3))}
 sg.rotateZ(-Math.PI/2);sg.computeVertexNormals();const shell=new THREE.Mesh(sg,skinMat({rough:.35}));shell.position.y=.6;g.add(shell);
 const flesh=M(C(col).lerp(C('#c87a6a'),.45).getStyle(),{roughness:.5}),suc=M('#f0dcc8',{roughness:.5}),dark=M('#1a1010',{roughness:.3});
 const head=sph(0,.36,.34,.36,14,flesh);head.position.set(.42,.6,0);g.add(head);
 for(const z of[-1,1]){const e=sph(0,.1,.1,.1,10,M('#e8e4d8',{roughness:.2}));e.position.set(.55,.72,z*.27);g.add(e);const p=sph(0,.05,.06,.05,8,dark);p.position.set(.62,.73,z*.31);g.add(p)}
 const sip=new THREE.Mesh(new THREE.CylinderGeometry(.06,.09,.25,8,1,true),flesh);sip.position.set(.25,.93,0);sip.rotation.z=.9;g.add(sip);
 const beak=cone(.07,.18,dark,5);beak.position.set(.8,.6,0);beak.rotation.z=-Math.PI/2;g.add(beak);
 const sucG=new THREE.CylinderGeometry(1,.8,1,7),rimG=new THREE.TorusGeometry(1,.25,3,8);const tents=[];
 for(let i=0;i<10;i++){const a=i/10*6.283;const long=i===2||i===7;const off=V3(0,Math.cos(a),Math.sin(a));const tg2=new THREE.Group();tg2.position.set(.62,.6,0).addScaledVector(off,.2);g.add(tg2);
  const L=long?2.1:1.15;const pts=[V3(0,0,0),V3(L*.3,0,0).addScaledVector(off,.12),V3(L*.65,-.05,0).addScaledVector(off,.2),V3(L,-.12,0).addScaledVector(off,.22)];
  const rf=long?(t=>t>.8?.07:.05*(1-t*.3)):(t=>.085*(1-t*.75));const tm=fxA_taper(pts,rf,flesh,12,7);tg2.add(tm);const cv=tm.userData.curve;const P=V3(),T=V3();
  for(let k=0;k<(long?3:5);k++){const t=long?.82+k*.06:.25+k*.15;cv.getPointAt(t,P);cv.getTangentAt(t,T);const n=off.clone().negate().addScaledVector(T,-T.dot(off.clone().negate())).normalize();const r=rf(t);
   const s=new THREE.Mesh(sucG,suc);s.position.copy(P).addScaledVector(n,r*.9);fxA_point(s,n);s.scale.set(r*.5,.02,r*.5);tg2.add(s);const rr=new THREE.Mesh(rimG,dark);rr.position.copy(s.position);rr.lookAt(rr.position.clone().add(n));rr.scale.setScalar(r*.5);tg2.add(rr)}
  tents.push({m:tg2,i,long})}
 g.userData.swim=1;
 g.userData.anim=t=>{for(const q of tents){q.m.rotation.y=Math.sin(t*1.6+q.i)*.12;q.m.rotation.z=Math.cos(t*1.3+q.i*.7)*.12;if(q.long){const s=.75+.25*Math.max(0,Math.sin(t*.9));q.m.scale.set(s,1,1)}}shell.rotation.x=Math.sin(t*.8)*.04};
 return g}

/* ---------- 空水母: a closed oval sac about two metres long floating in the air, thin tentacles of a metre underneath,
   and the small jet holes round the body that push it along; no eyes ---------- */
function fxA_airJelly(f){const g=new THREE.Group();const col=f.col||'#bfe9ff';
 const bm=new THREE.MeshStandardMaterial({color:col,emissive:col,emissiveIntensity:.3,transparent:true,opacity:.5,side:THREE.DoubleSide,roughness:.12,depthWrite:false});
 const sac=new THREE.Mesh(new THREE.SphereGeometry(1,22,16),bm);sac.scale.set(1,.68,.8);sac.position.y=.45;g.add(sac);
 const core=sph(0,.45,.3,.36,12,GL('#f4fff8',.5));core.position.y=.45;g.add(core);
 const vein=new THREE.MeshBasicMaterial({color:C(col).lerp(C('#ffffff'),.4),transparent:true,opacity:.35,depthWrite:false});
 for(let i=0;i<6;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(1,.012,4,30),vein);r.position.y=.45;r.rotation.y=i/6*Math.PI;r.scale.set(1.002,.682,.802);g.add(r)}
 const pore=M('#4a6a7a',{roughness:.4}),rim=TR(C(col).lerp(C('#ffffff'),.5).getStyle(),.7);
 for(let i=0;i<10;i++){const a=i/10*6.283;const x=Math.cos(a)*.99,z=Math.sin(a)*.79;const p=new THREE.Mesh(new THREE.TorusGeometry(.06,.02,4,10),rim);p.position.set(x,.43,z);p.lookAt(V3(x*2,.43,z*2));g.add(p);const h=sph(0,.04,.04,.04,6,pore);h.position.set(x*.985,.43,z*.985);g.add(h)}
 const NT=14,NS=8,tp=new Float32Array(NT*NS*6);const tgeo=new THREE.BufferGeometry();tgeo.setAttribute('position',new THREE.BufferAttribute(tp,3));
 const tl=new THREE.LineSegments(tgeo,new THREE.LineBasicMaterial({color:col,transparent:true,opacity:.6,blending:THREE.AdditiveBlending,depthWrite:false}));tl.frustumCulled=false;g.add(tl);
 const puffs=emitter({n:30,life:1.2,speed:.5,spread:.3,size:.35,dir:[-1,0,0],col:'#ffffff',op:.25,area:[.05,.05,.3]});puffs.position.set(-1,.43,0);g.add(puffs);
 g.userData.anim=t=>{const k=1+Math.sin(t*1.6)*.05;sac.scale.set(k,.68/k,.8*k);let q=0;for(let i=0;i<NT;i++){const a=i/NT*6.283,r0=.2+.25*((i*7)%3)/2;let px=Math.cos(a)*r0,pz=Math.sin(a)*r0*.8,py=.02;
   for(let j=0;j<NS;j++){const nx=px+Math.sin(t*1.3+i+j*.6)*.04,nz=pz+Math.cos(t*1.1+i*1.3+j*.5)*.04,ny=py-.13;tp[q++]=px;tp[q++]=py;tp[q++]=pz;tp[q++]=nx;tp[q++]=ny;tp[q++]=nz;px=nx;py=ny;pz=nz}}tgeo.attributes.position.needsUpdate=true};
 return g}

/* ---------- 巨脉蜻蜓: as before, but with the three pairs of legs on its thick chest ---------- */
function fxA_jumai(f){const g=bDragonfly(f);const lm=M(C(f.col||'#3a6a8a').multiplyScalar(.6).getStyle(),{roughness:.4,metalness:.2});
 for(const[x,sw]of[[.44,.5],[.32,0],[.2,-.5]])for(const z of[-1,1]){const P0=V3(x,-.16,z*.1);g.add(fxA_jlimb([P0,V3(x+sw*.2,-.3,z*.3),V3(x+sw*.35-.05,-.55,z*.36),V3(x+sw*.45-.12,-.62,z*.34)],[.03,.026,.018,.01],lm))}
 return g}

/* ---------- 深沙巴士: its spring-like tail has no shell, only bare red muscle wound in coils ---------- */
function fxA_shenshabus(f){const g=bScorpion(f);const tl=g.userData.tails&&g.userData.tails[0]&&g.userData.tails[0].m;if(!tl)return g;
 while(tl.children.length)tl.remove(tl.children[0]);const mus=M('#a8322a',{roughness:.48}),mus2=M('#7a1e1a',{roughness:.6});
 const pts=[];for(let i=0;i<=72;i++){const a=i/72*6.283*3.5;const r=.24-i/72*.06;pts.push(V3(-.1-i*.016,Math.cos(a)*r,Math.sin(a)*r))}
 tl.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),180,.085,8,false),mus));
 const core=new THREE.Mesh(new THREE.CylinderGeometry(.08,.05,1.15,8),mus2);core.rotation.z=Math.PI/2;core.position.x=-.65;tl.add(core);
 const tip=sph(0,.14,.12,.12,10,mus);tip.position.x=-1.28;tl.add(tip);return g}

/* ---------- 骸龙: the forelimbs are almost as long as the hind legs ---------- */
function fxA_gulong(f){const g=bDragonkin2(f);for(const c of g.children)if(c.isGroup&&Math.abs(c.position.x-.25)<1e-6&&Math.abs(c.position.y-1.62)<1e-6)c.scale.set(1.15,1.5,1.15);return g}
/* ---------- 炸弹翼龙: no red crest ---------- */
function fxA_yilong(f){const g=bPterosaur(f);const cm=M('#d83a2a',{side:THREE.DoubleSide});for(const c of g.children.slice())if(c.material===cm)g.remove(c);return g}
/* ---------- 三叶虫: real trilobites instead of a cloud of dots ---------- */
function fxA_sanye(f){const g=bTrilobite({col:f.col});g.userData.swim=1;return g}

SPEC.guyou=fxA_guyou;SPEC.jianshi=fxA_jianshi;SPEC.kongshuimu=fxA_airJelly;SPEC.jumai=fxA_jumai;SPEC.shenshabus=fxA_shenshabus;SPEC.gulong=fxA_gulong;SPEC.yilong=fxA_yilong;SPEC.sanyechong=fxA_sanye;

/* a frill: a part of a sphere's cap tipped back by `tilt`, flattened to `flat`, with n knobs/spikes made by mk(i,outwardDir) along its rim */
function fxA_shield(R,th,flat,mat,n,mk,pos,tilt){const fg=new THREE.Group();fg.position.copy(pos);fg.rotation.set(0,Math.PI/2,Math.PI/2+tilt);
 const fr=new THREE.Mesh(new THREE.SphereGeometry(R,22,8,0,Math.PI,0,Math.PI*th),mat);fr.scale.set(1,1,flat);fg.add(fr);const T=Math.PI*th;
 for(let i=0;i<n;i++){const ph=i/(n-1)*Math.PI;const d=V3(-Math.cos(ph)*Math.sin(T),Math.cos(T),Math.sin(ph)*Math.sin(T)*flat);const b=mk(i,V3(-Math.cos(ph),0,Math.sin(ph)*flat).normalize());b.position.copy(d).multiplyScalar(R);fg.add(b)}return fg}
/* ---------- 角龙: three metres and heavy, a shield-like frill behind the head and one long sharp horn on the nose
   (no brow horns) ---------- */
function fxA_jiaolong(f){const g=new THREE.Group();const col=f.col||'#7a6a4a';const o={back:col,belly:C(col).lerp(C('#e0d4b8'),.4).getStyle(),stripe:5};const mat=M(col,{roughness:.7}),horn=M('#ece2c8',{roughness:.35});
 g.add(loft([[-1.45,1.0,0,.36,.34],[-.75,1.2,0,.64,.62],[0,1.24,0,.7,.68],[.65,1.12,0,.6,.56],[1.05,1.0,0,.42,.4]],Object.assign({n:26},o)));
 const hg=new THREE.Group();hg.position.set(1.0,1.02,0);g.add(hg);
 hg.add(loft([[0,0,0,.4,.38],[.35,-.04,0,.36,.32],[.7,-.15,0,.25,.2],[.95,-.3,0,.12,.1]],Object.assign({n:16},o,{stripe:0})));
 const beak=cone(.11,.32,M('#2e261c',{roughness:.4}),6);beak.rotation.z=-Math.PI/2-.35;beak.position.set(1.05,-.38,0);hg.add(beak);mouthEye(hg,.45,.12,.25,.045);
 // the shield behind the head: broad, a little cupped, rimmed with knobs
 hg.add(fxA_shield(.95,.42,.5,M(C(col).lerp(C('#b8784a'),.22).getStyle(),{side:THREE.DoubleSide,roughness:.6}),13,i=>sph(0,.065,.065,.065,6,horn),V3(-.12,.28,0),.55));
 // the one long horn
 const nh=cone(.1,.95,horn,8);nh.position.set(.72,.3,0);nh.rotation.z=-.55;hg.add(nh);const nb=sph(0,.13,.1,.11,8,mat);nb.position.set(.62,.02,0);hg.add(nb);
 const tl=new THREE.Group();tl.position.set(-1.4,1.0,0);g.add(tl);tl.add(loft([[0,0,0,.34,.32],[-.6,-.12,0,.2,.18],[-1.2,-.22,0,.08,.08],[-1.55,-.22,0,.02,.02]],Object.assign({n:14},o)));
 const L=[];for(const[x,z]of[[.62,-1],[.62,1],[-.75,-1],[-.75,1]]){const l=jleg(.42,.4,.16,mat,x>0?.3:-.25,{});l.position.set(x,.9,z*.46);l.rotation.x=z*.08;g.add(l);L.push({m:l,ph:(x>0?0:Math.PI)+(z>0?Math.PI:0),a:.55,k:x>0?.3:-.25})}
 addLegs(g,L);g.userData.tails=[{m:tl,a:.25,f:3}];stdAnim(g,{fq:5.5,amp:.35,extra:t=>{hg.rotation.z=Math.sin(t*.9)*.06;hg.rotation.y=Math.sin(t*.6)*.1}});return g}

/* ---------- 肯陶 (the black ceratops of the black metal): nine metres, built wholly of black metal, no head at all —
   under a wide shield one horn over two metres long; on its back, fused into the same body, a barrel-shaped
   rider with two arms, three fingers on each hand, each hand gripping a spear ---------- */
function fxA_kentao(f){const g=new THREE.Group();const met=M('#2e2e34',{roughness:.34,metalness:.32}),met2=M('#3a3a42',{roughness:.28,metalness:.38}),seam=M('#0a0a0c',{roughness:.5,metalness:.6}),tip=M('#4a4a52',{roughness:.15,metalness:.9});
 const o={back:'#34343a',belly:'#1c1c20',metal:.32,rough:.34};
 const body=loft([[-1.5,1.05,0,.38,.36],[-.8,1.25,0,.66,.66],[0,1.3,0,.72,.72],[.7,1.2,0,.64,.62],[1.12,1.08,0,.48,.46]],Object.assign({n:26,r:12},o));g.add(body);
 // plate seams across the back
 for(let i=0;i<6;i++){const x=-1.1+i*.42;const r=new THREE.Mesh(new THREE.TorusGeometry(.7-Math.abs(x)*.12,.018,3,18,Math.PI),seam);r.position.set(x,1.22,0);r.rotation.y=Math.PI/2;g.add(r)}
 // the front: no head, a broad shield and the horn beneath it
 g.add(fxA_shield(1.05,.45,.45,M('#36363c',{roughness:.28,metalness:.38,side:THREE.DoubleSide}),11,(i,d)=>{const b=cone(.05,.24,met2,4);fxA_point(b,d);return b},V3(1.12,1.25,0),.25));
 const boss=sph(0,.3,.26,.28,12,met);boss.position.set(1.32,1.0,0);g.add(boss);const hn=cone(.13,1.25,tip,8);hn.position.set(1.95,1.02,0);hn.rotation.z=-Math.PI/2+.08;g.add(hn);
 // tail
 const tl=new THREE.Group();tl.position.set(-1.45,1.05,0);g.add(tl);tl.add(loft([[0,0,0,.34,.32],[-.6,-.1,0,.2,.18],[-1.2,-.2,0,.08,.08],[-1.5,-.2,0,.02,.02]],Object.assign({n:14,r:10},o)));
 // legs: heavy pillars of metal
 const L=[];for(const[x,z]of[[.7,-1],[.7,1],[-.8,-1],[-.8,1]]){const l=jleg(.46,.44,.19,met,x>0?.3:-.25,{});l.position.set(x,.95,z*.5);g.add(l);L.push({m:l,ph:(x>0?0:Math.PI)+(z>0?Math.PI:0),a:.6,k:x>0?.3:-.25})}
 // the rider half: a barrel growing out of the back
 const rd=new THREE.Group();rd.position.set(-.15,1.85,0);g.add(rd);
 const bp=[[.5,-.35],[.36,-.15],[.34,.1],[.36,.4],[.34,.62],[.25,.76],[.01,.8]].map(p=>new THREE.Vector2(p[0],p[1]));rd.add(new THREE.Mesh(new THREE.LatheGeometry(bp,16),met));
 for(const y of[.05,.38,.62]){const b=new THREE.Mesh(new THREE.TorusGeometry(.36,.025,4,18),seam);b.rotation.x=Math.PI/2;b.position.y=y;rd.add(b)}
 const arms=[];for(const z of[-1,1]){const sg2=new THREE.Group();sg2.position.set(0,.55,z*.36);rd.add(sg2);sg2.add(sph(0,.11,.11,.11,10,met2));
  const up=new THREE.Group();sg2.add(up);up.add(fxA_rod(V3(0,0,0),V3(.05,-.38,z*.1),.07,.06,met,7));const el=new THREE.Group();el.position.set(.05,-.38,z*.1);up.add(el);el.add(sph(0,.075,.075,.075,8,met2));
  el.add(fxA_rod(V3(0,0,0),V3(.36,.05,0),.06,.05,met,7));const hand=new THREE.Group();hand.position.set(.38,.05,0);el.add(hand);hand.add(sph(0,.07,.06,.07,8,met2));
  for(let k=0;k<3;k++){const a=(k-1)*.9;hand.add(fxA_rod(V3(0,0,0),V3(.07,Math.cos(a)*.09,Math.sin(a)*.09),.022,.016,met2,5))}
  const spear=new THREE.Group();spear.position.set(.06,0,0);hand.add(spear);spear.add(fxA_rod(V3(-.9,-.25,0),V3(1.1,.3,0),.03,.03,met,6));const sp=cone(.06,.32,tip,4);sp.position.set(1.22,.34,0);fxA_point(sp,V3(2,.55,0));spear.add(sp);
  arms.push({up,el,z})}
 addLegs(g,L);g.userData.tails=[{m:tl,a:.2,f:3}];
 stdAnim(g,{fq:5,amp:.38,extra:t=>{for(const a of arms){const w=Math.sin(t*1.4+(a.z>0?0:2.2));a.up.rotation.z=a.z>0?-.2-Math.max(0,w)*1.6:.15+w*.15;a.el.rotation.z=a.z>0?.4+Math.max(0,w)*.5:.2}rd.rotation.y=Math.sin(t*.7)*.18}});
 g.userData.noSkin=1;return g}

/* ---------- 晶锥陆龟: twenty metres, a tortoise sheathed in crystal with several great crystal spikes on its back
   (two that point forward can be fired), a Dunkleosteus-like mouth with no teeth but blade-sharp lips; eats crystal trees ---------- */
function fxA_jingzhui(f){const g=new THREE.Group();const col=f.col||'#7a8a7a';
 const skin=M(C(col).multiplyScalar(.85).getStyle(),{roughness:.75}),xt=new THREE.MeshStandardMaterial({color:C(col).lerp(C('#cfeee8'),.55),roughness:.15,metalness:.1,flatShading:true,emissive:'#2a5a58',emissiveIntensity:.2}),
  xc=new THREE.MeshStandardMaterial({color:'#dff8ff',roughness:.05,metalness:.15,flatShading:true,emissive:'#5ac8d8',emissiveIntensity:.35}),bone=M('#d8d0b8',{roughness:.35});
 // the shell: a faceted dome of crystal plates
 const sg=new THREE.IcosahedronGeometry(1,2);{const p=sg.attributes.position;const R=rnd(5);for(let i=0;i<p.count;i++){let y=p.getY(i);if(y<-.05)y=-.05+(y+.05)*.15;p.setXYZ(i,p.getX(i)*1.55,y*.85,p.getZ(i)*1.15)}sg.computeVertexNormals()}
 const shell=new THREE.Mesh(sg,xt);shell.position.y=.78;g.add(shell);
 const rim=new THREE.Mesh(new THREE.TorusGeometry(1,.09,5,26),xt);rim.rotation.x=Math.PI/2;rim.scale.set(1.56,1.16,1);rim.position.y=.73;g.add(rim);
 for(let i=0;i<22;i++){const a=i*2.4,r=.35+((i*7)%10)/10*.6;const x=Math.cos(a)*r*1.4,z=Math.sin(a)*r*1.05;const y=.78+Math.sqrt(Math.max(0,1-(x/1.55)**2-(z/1.15)**2))*.85;const c=new THREE.Mesh(ko(1),xt);c.position.set(x,y,z);c.scale.set(.12,.16,.12);c.rotation.set(a,a*.5,0);g.add(c)}
 // the great spikes: two set forward, the rest raked up and back
 const spG=new THREE.ConeGeometry(.16,1,6);const spikes=[];
 for(const[x,z,dx,dy,dz,L]of[[.75,-.42,1,.55,-.15,1.05],[.75,.42,1,.55,.15,1.05],[.1,0,-.2,1,0,1.25],[-.25,-.55,-.4,1,-.35,1.0],[-.25,.55,-.4,1,.35,1.0],[-.85,0,-.7,.8,0,.9],[.3,-.7,0,1,-.6,.8],[.3,.7,0,1,.6,.8]]){
  const y=.78+Math.sqrt(Math.max(0,1-(x/1.55)**2-(z/1.15)**2))*.85;const s=new THREE.Mesh(spG,xc);const d=V3(dx,dy,dz).normalize();s.position.set(x,y,z).addScaledVector(d,L*.42);fxA_point(s,d);s.scale.set(1,L,1);g.add(s);spikes.push(s);
  const base=new THREE.Mesh(new THREE.CylinderGeometry(.2,.24,.12,6),xt);base.position.set(x,y,z);fxA_point(base,d);g.add(base)}
 // head: armoured like a Dunkleosteus, the jaw lips grown into blades
 const hg=new THREE.Group();hg.position.set(1.55,.6,0);g.add(hg);hg.add(fxA_taper([V3(-.45,0,0),V3(-.15,.02,0),V3(.1,.04,0)],t=>.3-t*.05,skin,6,10));
 const hd=new THREE.Mesh(new THREE.IcosahedronGeometry(1,1),xt);hd.scale.set(.42,.3,.3);hd.position.set(.32,.08,0);hg.add(hd);
 const jaw=new THREE.Group();jaw.position.set(.18,-.05,0);hg.add(jaw);const lj=sph(0,.38,.12,.26,10,skin);lj.position.set(.18,-.1,0);jaw.add(lj);
 const bl=new THREE.Shape();bl.moveTo(0,0);bl.lineTo(.5,0);bl.lineTo(.62,-.16);bl.lineTo(.42,-.06);bl.lineTo(0,-.05);const blG=new THREE.ExtrudeGeometry(bl,{depth:.04,bevelEnabled:false});
 for(const z of[-1,1]){const u=new THREE.Mesh(blG,bone);u.position.set(.18,-.01,z*.2);u.rotation.y=-z*.35;hg.add(u);const d=new THREE.Mesh(blG,bone);d.scale.y=-1;d.position.set(.1,-.12,z*.18);d.rotation.y=-z*.35;jaw.add(d)}
 for(const z of[-1,1]){const e=sph(0,.05,.05,.05,8,M('#1a1a12',{roughness:.1}));e.position.set(.45,.2,z*.22);hg.add(e)}
 // legs: thick columns with crystal scales, a short tail
 const L=[];for(const[x,z]of[[.95,-1],[.95,1],[-.9,-1],[-.9,1]]){const l=new THREE.Group();l.position.set(x,.72,z*1.0);g.add(l);const c=cyl(.3,.34,.68,skin,9);c.position.y=-.34;c.rotation.x=z*.25;l.add(c);
  for(let k=0;k<3;k++){const sc=new THREE.Mesh(ko(1),xt);sc.position.set(.22,-.15-k*.18,z*.14);sc.scale.set(.11,.13,.11);l.add(sc)}const ft=sph(0,.38,.12,.36,10,skin);ft.position.set(0,-.66,z*.08);l.add(ft);L.push({m:l,ph:(x>0?0:Math.PI)+(z>0?Math.PI:0),a:.18})}
 const tl=cone(.18,.5,skin,7);tl.rotation.z=Math.PI/2+.3;tl.position.set(-1.7,.5,0);g.add(tl);
 addLegs(g,L);stdAnim(g,{fq:2.2,amp:.18,extra:t=>{hg.rotation.z=-.05+Math.sin(t*.7)*.08;hg.rotation.y=Math.sin(t*.45)*.18;jaw.rotation.z=-Math.max(0,Math.sin(t*1.3))*.3}});
 g.userData.noSkin=1;return g}

/* ---------- 畅游者: an "island" two hundred metres by one hundred that is really many flat round beetles,
   each about ten metres across with eight limbs for rowing, their shells grown together into one;
   a thick layer of sand and grit (sprayed up through holes in their backs) keeps the fungus off; animals ride on top ---------- */
function fxA_changyou(f){const g=new THREE.Group();const sh=M('#17171a',{roughness:.35,metalness:.15}),sh2=M('#26262a',{roughness:.45}),legM=M('#2a2a2e',{roughness:.5}),pad=M('#3a3a40',{roughness:.6,side:THREE.DoubleSide});
 const A=2.3,B=1.25,units=[];const sp=.5;for(let i=-6;i<=6;i++)for(let j=-4;j<=4;j++){const x=i*sp+(j%2?sp/2:0),z=j*sp*.87;const e=(x/A)**2+(z/B)**2;if(e<=1)units.push([x,z,e])}
 const uG=new THREE.SphereGeometry(1,14,8,0,Math.PI*2,0,Math.PI/2);const parts=[];
 for(const[x,z,e]of units){const m=new THREE.Mesh(uG,e>.55?sh:sh2);m.position.set(x,.12,z);m.scale.set(.3,.16,.3);g.add(m)}
 // the sand blanket over the middle, lumpy, with a few rocks and small passengers
 const sg=new THREE.SphereGeometry(1,32,12,0,Math.PI*2,0,Math.PI/2);{const p=sg.attributes.position,cc=[];const R=rnd(9);const a=C('#c8b088'),b=C('#a89068'),c2=new THREE.Color();for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);const n=Math.sin(x*9)*Math.cos(z*7)*.08+Math.sin(x*23+z*17)*.03;p.setY(i,y*(1+n));c2.copy(a).lerp(b,.5+n*4);cc.push(c2.r,c2.g,c2.b)}sg.setAttribute('color',new THREE.Float32BufferAttribute(cc,3));sg.computeVertexNormals()}
 const sand=new THREE.Mesh(sg,skinMat({rough:.95}));sand.scale.set(A*.86,.42,B*.84);sand.position.y=.16;g.add(sand);
 for(let i=0;i<7;i++){const a=i*2.2,r=.3+(i%3)*.35;const rk=new THREE.Mesh(new THREE.DodecahedronGeometry(1,0),M('#6a645a',{roughness:.95,flatShading:true}));rk.position.set(Math.cos(a)*r*1.4,.5,Math.sin(a)*r*.7);rk.scale.set(.12+(i%2)*.08,.1,.1);rk.rotation.set(i,i*2,0);g.add(rk)}
 for(let i=0;i<10;i++){const a=i*1.7,r=.2+(i%4)*.25;const rp=sph(['#7a6a4a','#5a7a4a','#8a7a60'][i%3],.06,.035,.03,6);rp.position.set(Math.cos(a)*r*1.5,.56,Math.sin(a)*r*.7);rp.rotation.y=a;g.add(rp)}
 for(let i=0;i<5;i++){const a=i*1.3+.4;const h=sph(0,.035,.02,.035,6,M('#0a0a0a'));h.position.set(Math.cos(a)*A*.8,.24,Math.sin(a)*B*.78);g.add(h)}
 // rowing limbs round the rim: each rim beetle shows its outer limbs, ending in flat paddles
 const L=[];const padG=new THREE.CircleGeometry(.09,7);
 for(const[x,z,e]of units){if(e<.55)continue;const out=V3(x/A/A,0,z/B/B).normalize();const tan=V3(-out.z,0,out.x);
  for(const k of[-1,1]){const l=new THREE.Group();l.position.set(x,.08,z).addScaledVector(out,.22).addScaledVector(tan,k*.1);l.rotation.y=Math.atan2(-out.z,out.x);g.add(l);
   l.add(fxA_rod(V3(0,0,0),V3(.18,-.04,0),.02,.016,legM,5));l.add(fxA_rod(V3(.18,-.04,0),V3(.3,-.16,0),.016,.012,legM,5));const pd=new THREE.Mesh(padG,pad);pd.position.set(.32,-.18,0);pd.rotation.x=Math.PI/2;pd.scale.set(1,1.6,1);l.add(pd);
   L.push({l,ph:Math.atan2(z,x)*3+k})}}
 g.userData.swim=1;g.userData.noSkin=0;
 g.userData.anim=t=>{for(const q of L){q.l.children.forEach(c=>{});q.l.rotation.z=Math.sin(t*2+q.ph)*.25}g.rotation.z=Math.sin(t*.4)*.01;g.rotation.x=Math.sin(t*.33)*.012};
 return g}

/* ---------- 飞龙 / 亚龙: the forelimbs are the wings (membrane stretched from the arm and a long finger), stout hind legs to stand on,
   a round head with a mouth full of sharp teeth, a long lizard body and tail; no horns. 亚龙 is black-scaled with shorter hind legs ---------- */
function fxA_wyvern(f){const g=new THREE.Group();const ya=f.w==='yalong';const col=f.col||(ya?'#24242a':'#6a5a4a');
 const o={back:col,belly:C(col).lerp(C(ya?'#5a5a60':'#d8c8a8'),.45).getStyle(),stripe:ya?0:6};const skin=M(col,{roughness:ya?.42:.6,metalness:ya?.12:0}),
  memM=M(C(col).lerp(C(ya?'#4a3a40':'#b08a6a'),.45).getStyle(),{side:THREE.DoubleSide,roughness:.7,emissive:C(col).multiplyScalar(.5).getStyle(),emissiveIntensity:.5}),tooth=M('#f2ecd8',{roughness:.3}),claw=M('#1a1612',{roughness:.4});
 g.add(loft([[-.6,0,0,.19,.2],[-.15,.03,0,.26,.27],[.3,.08,0,.24,.24],[.62,.18,0,.15,.15],[.88,.32,0,.12,.12]],Object.assign({n:24},o)));
 // round head, toothed jaws a little open
 const hg=new THREE.Group();hg.position.set(.95,.38,0);g.add(hg);const hd=sph(0,.2,.17,.17,14,skin);hd.position.x=.08;hg.add(hd);
 const up=sph(0,.17,.07,.12,10,skin);up.position.set(.28,-.02,0);hg.add(up);const jaw=new THREE.Group();jaw.position.set(.1,-.07,0);hg.add(jaw);const lo=sph(0,.2,.05,.1,10,skin);lo.position.set(.16,-.04,0);jaw.add(lo);
 const mo=sph(0,.17,.03,.09,8,M('#4a1a1a'));mo.position.set(.24,-.08,0);hg.add(mo);
 for(let i=0;i<7;i++){const x=.16+i*.045,z=.1-i*.008;for(const s of[-1,1]){const t1=cone(.012,.05,tooth,4);t1.position.set(x,-.07,s*z);t1.rotation.x=Math.PI;hg.add(t1);const t2=cone(.011,.045,tooth,4);t2.position.set(x-.1,.0,s*z*.9);jaw.add(t2)}}
 for(const z of[-1,1]){const e=sph(0,.035,.035,.03,8,M(ya?'#d8a020':'#e8c040',{roughness:.1,emissive:ya?'#a06010':'#000000',emissiveIntensity:.4}));e.position.set(.2,.08,z*.12);hg.add(e)}
 // tail
 const tl=new THREE.Group();tl.position.set(-.55,0,0);g.add(tl);tl.add(loft([[0,0,0,.18,.19],[-.6,-.02,0,.11,.11],[-1.2,0,0,.05,.05],[-1.7,.02,0,.012,.012]],Object.assign({n:18},o)));
 const tf=new THREE.Mesh(wingGeo(.25,.28,'fin').rotateX(-Math.PI/2),memM);tf.position.set(-1.62,.02,0);tf.rotation.z=Math.PI;tl.add(tf);
 // the arm-wings
 const W=[];for(const z of[-1,1]){const wg=new THREE.Group();wg.position.set(.42,.12,z*.18);g.add(wg);
  const S=V3(0,0,0),E=V3(-.12,.04,z*.5),Wr=V3(.12,.02,z*.95),T=V3(-.5,-.02,z*1.9),T2=V3(-.35,-.02,z*1.3);
  wg.add(fxA_rod(S,E,.06,.045,skin,7));wg.add(fxA_rod(E,Wr,.045,.035,skin,7));wg.add(fxA_rod(Wr,T,.03,.01,skin,6));wg.add(fxA_rod(Wr,T2,.022,.008,skin,5));
  for(let k=0;k<3;k++){const c=cone(.012,.07,claw,4);c.position.copy(Wr).add(V3(.04,.0,z*k*.03));fxA_point(c,V3(1,-.3,0));wg.add(c)}
  const shp=new THREE.Shape();shp.moveTo(S.x+.05,0);shp.lineTo(E.x,E.z*z);shp.lineTo(Wr.x,Wr.z*z);shp.lineTo(T.x,T.z*z);shp.quadraticCurveTo(-.95,1.35,-.95,.6);shp.quadraticCurveTo(-.95,.25,-.85,.05);shp.lineTo(-.8,0);shp.lineTo(S.x+.05,0);
  const mg=new THREE.ShapeGeometry(shp,8);mg.rotateX(Math.PI/2);if(z<0)mg.scale(1,1,-1);const mm=new THREE.Mesh(mg,memM);wg.add(mm);W.push({m:wg,z})}
 // stout hind legs, tucked back when flying
 const legs=[];const hl=ya?.6:1;for(const z of[-1,1]){const P0=V3(-.45,-.05,z*.2);const l=fxA_jlimb([P0,V3(-.4,-.28*hl,z*.24),V3(-.62,-.45*hl,z*.24),V3(-.72,-.52*hl,z*.24)],[.09,.075,.045,.03],skin);g.add(l);
  for(let k=-1;k<=1;k++){const c=cone(.015,.08,claw,4);c.position.set(-.27,-.47*hl,k*.035);fxA_point(c,V3(-1,-.5,0));l.add(c)}legs.push(l)}
 g.userData.tails=[{m:tl,a:.2,f:2}];
 g.userData.anim=t=>{const fl=Math.sin(t*3.2);for(const w of W)w.m.rotation.x=-w.z*(.05+fl*.55);/* the bob goes on the parts, not the root: the herd sets the root's position (q4c) */for(const ch of g.children){if(ch.userData.y0===undefined)ch.userData.y0=ch.position.y;ch.position.y=ch.userData.y0-fl*.06}hg.rotation.z=Math.sin(t*.9)*.08;jaw.rotation.z=-.1-Math.max(0,Math.sin(t*1.1))*.25;tl.rotation.y=Math.sin(t*2)*.18;for(const l of legs)l.rotation.z=.5+Math.sin(t*3.2+1)*.08};
 return g}

SPEC.jiaolong=fxA_jiaolong;SPEC.xm_heijiao=fxA_kentao;SPEC.jingzhui=fxA_jingzhui;SPEC.changyou=fxA_changyou;SPEC.feilong=fxA_wyvern;SPEC.yalong=fxA_wyvern;

/* ---------- 刺杀者: a hunter-type arthropod a metre and a half long: six limbs, the front two pairs ending in blades,
   two more blade-claws on the back, a pair of thin limbs with open needle tips for shooting poison darts;
   no tail, and its colour keeps shifting to blend in ---------- */
function fxA_cishazhe(f){const g=new THREE.Group();const ph=Math.random()*30;
 const sk=new THREE.MeshStandardMaterial({color:f.col||'#5a6a4a',roughness:.4,metalness:.1}),dk=new THREE.MeshStandardMaterial({color:'#2a3226',roughness:.45}),bl=M('#d8dcd0',{roughness:.2,metalness:.4});
 const th=sph(0,.42,.2,.24,12,sk);th.position.set(.15,.55,0);g.add(th);const ab=sph(0,.5,.22,.3,12,sk);ab.position.set(-.55,.58,0);ab.rotation.z=.08;g.add(ab);
 for(let i=0;i<4;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(.27-i*.03,.02,3,14,Math.PI),dk);r.position.set(-.3-i*.2,.6,0);r.rotation.y=Math.PI/2;r.scale.y=.8;g.add(r)}
 const hd=sph(0,.2,.15,.17,10,sk);hd.position.set(.62,.58,0);g.add(hd);for(const z of[-1,1]){const e=sph(0,.06,.05,.05,8,M('#0c0c0c',{roughness:.05}));e.position.set(.72,.65,z*.11);g.add(e);
  const md=cone(.025,.14,bl,4);md.position.set(.82,.5,z*.06);md.rotation.z=-Math.PI/2-.4;g.add(md)}
 const bladeG=new THREE.ConeGeometry(.07,.55,3);bladeG.scale(1,1,.25);
 const L=[];[[.38,1,.3],[.18,1,.1],[-.08,0,-.2]].forEach(([x,blade,sw],k)=>{for(const z of[-1,1]){const P0=V3(x,.5,z*.18),P1=V3(x+.08+sw*.15,.66,z*.42),P2=V3(x+.12+sw*.35,.06,z*.52);const l=fxA_jlimb([P0,P1,P2],[.055,.045,.03],sk,dk);
   if(blade){const b=new THREE.Mesh(bladeG,bl);b.position.copy(P2).sub(P0).add(V3(.08,.02,0));fxA_point(b,V3(1,-.6,0));l.add(b)}g.add(l);L.push({m:l,ph:k*1.9+(z>0?Math.PI:0),a:.3})}});
 // the two blade-claws on the back, folded forward over the body
 const bk=[];for(const z of[-1,1]){const P0=V3(0,.72,z*.14);const l=fxA_jlimb([P0,V3(-.1,1.05,z*.25),V3(.35,1.15,z*.22)],[.04,.032,.02],sk,dk);const b=new THREE.Mesh(bladeG,bl);b.scale.set(1.2,1.5,1.2);b.position.set(.55,1.05-.72,z*.08);fxA_point(b,V3(1,-.4,0));l.add(b);g.add(l);bk.push(l)}
 // the needle limbs: thin, long, the tip an open tube
 const nd=[];for(const z of[-1,1]){const P0=V3(.3,.52,z*.12);const l=fxA_jlimb([P0,V3(.55,.42,z*.2),V3(1.05,.48,z*.16)],[.018,.014,.01],dk);const tp=new THREE.Mesh(new THREE.CylinderGeometry(.012,.006,.12,6,1,true),bl);tp.position.set(.81,-.03,z*.04);tp.rotation.z=-Math.PI/2;l.add(tp);g.add(l);nd.push(l)}
 addLegs(g,L);g.userData.noSkin=1;const base=C(f.col||'#5a6a4a'),cc=new THREE.Color();
 stdAnim(g,{fq:5,amp:.35,extra:t=>{const u=t+ph;cc.setHSL((.25+.12*Math.sin(u*.21)+.06*Math.sin(u*.53))%1,.25+.15*Math.sin(u*.31),.28+.1*Math.sin(u*.17));sk.color.copy(base).lerp(cc,.75);
  bk.forEach((l,i)=>l.rotation.z=Math.sin(t*.8+i)*.08);nd.forEach((l,i)=>{l.rotation.y=(i?-1:1)*(.15+.15*Math.sin(t*1.2))})}});
 return g}

/* ---------- 真菌怪: three metres tall and six long, walking on four thick legs; no skin to see, only a thick coat of purple
   mycelium, swollen sacs all over the back, no mouth, two pairs of yellow eyes; it can rear up and swing its forelimbs ---------- */
function fxA_zhenjun(f){const g=new THREE.Group();const col=f.col||'#8a5aa8';
 const myc=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.95}),sac=M('#b88ac8',{roughness:.5}),sac2=M('#d8b8e0',{roughness:.4}),eye=EM('#ffd23a',.9,{roughness:.2});
 const shag=(geo,amt,seed)=>{const p=geo.attributes.position,cc=[];const R=rnd(seed);const a=C('#6a3a8a'),b=C('#a878c0'),c2=new THREE.Color();for(let i=0;i<p.count;i++){const k=1+(R()-.5)*amt;p.setXYZ(i,p.getX(i)*k,p.getY(i)*k,p.getZ(i)*k);c2.copy(a).lerp(b,R());cc.push(c2.r,c2.g,c2.b)}geo.setAttribute('color',new THREE.Float32BufferAttribute(cc,3));geo.computeVertexNormals();return geo};
 const fr=new THREE.Group();fr.position.set(-.9,1.0,0);g.add(fr);// everything pivots about the hips so it can rear
 const bodyG=shag(new THREE.IcosahedronGeometry(1,3),.12,3);const body=new THREE.Mesh(bodyG,myc);body.scale.set(1.45,.62,.62);body.position.set(.95,.42,0);fr.add(body);
 const hdG=shag(new THREE.IcosahedronGeometry(1,2),.14,5);const hd=new THREE.Mesh(hdG,myc);hd.scale.set(.42,.36,.36);hd.position.set(2.35,.55,0);fr.add(hd);
 for(const[y,z]of[[.66,.16],[.5,.2]])for(const s of[-1,1]){const e=sph(0,.055,.05,.05,8,eye);e.position.set(2.7,y,s*z);fr.add(e)}
 for(let i=0;i<11;i++){const x=.1+((i*37)%10)/10*1.8,z=(((i*53)%10)/10-.5)*.8;const r=.14+((i*13)%5)*.03;const b=sph(0,r,r*.85,r,10,i%3?sac:sac2);b.position.set(x,.95+Math.cos(z*2)*.08-Math.abs(x-.95)*.12,z);fr.add(b)}
 const legG=shag(new THREE.CylinderGeometry(.2,.24,1,8,4),.14,7);const L=[],fore=[];
 for(const[x,z]of[[1.85,-1],[1.85,1],[.25,-1],[.25,1]]){const l=new THREE.Group();l.position.set(x,.3,z*.42);fr.add(l);const m=new THREE.Mesh(legG,myc);m.position.y=-.6;m.scale.set(1,1.25,1);l.add(m);const ft=sph(0,.28,.12,.26,8,myc);ft.position.y=-1.28;l.add(ft);
  if(x>1)fore.push(l);L.push({m:l,ph:(x>1?0:Math.PI)+(z>0?Math.PI:0),a:.3})}
 const legs=L;g.userData.noSkin=1;
 g.userData.anim=t=>{const c=t%11,up=sm(6,7,c)*(1-sm(9.2,10.2,c));fr.rotation.z=up*.85;fr.position.y=1.0+up*.12;
  for(const l of legs){const isF=fore.includes(l);l.m.rotation.z=isF&&up>.3?-(.6+Math.sin(t*6)*.7)*up:Math.sin(t*2.6+l.ph)*l.a*(1-up)+(isF?0:-up*.8)}
  body.scale.set(1.45,.62+Math.sin(t*1.7)*.015,.62)};
 return g}

/* ---------- 电侏儒: only thirty centimetres; like the dwarves but smaller, a big head with a flat face, sharp claws on all four limbs,
   a tiny short tail, and teeth that spark with electricity ---------- */
function fxA_dianzhuru(f){const g=new THREE.Group();const col=f.col||'#4a3a5a';const sk=M(col,{roughness:.6}),sk2=M(C(col).lerp(C('#c8b8c8'),.35).getStyle(),{roughness:.6}),cl=M('#e8e0d0',{roughness:.3});
 const bd=sph(0,.26,.34,.24,12,sk);bd.position.set(0,.62,0);bd.rotation.z=-.15;g.add(bd);const bl=sph(0,.2,.26,.2,10,sk2);bl.position.set(.08,.58,0);g.add(bl);
 const hg=new THREE.Group();hg.position.set(.08,1.08,0);g.add(hg);const hd=sph(0,.3,.27,.3,14,sk);hg.add(hd);const face=sph(0,.06,.22,.25,12,sk2);face.position.x=.25;hg.add(face);
 for(const z of[-1,1]){const e=sph(0,.06,.06,.06,8,M('#f0e8a0',{roughness:.1,emissive:'#806010',emissiveIntensity:.4}));e.position.set(.29,.08,z*.12);hg.add(e);const p=sph(0,.02,.035,.02,6,M('#000'));p.position.set(.34,.08,z*.12);hg.add(p);
  const ear=cone(.06,.14,sk,4);ear.position.set(-.02,.24,z*.2);ear.rotation.x=z*.6;hg.add(ear)}
 const mo=sph(0,.04,.06,.17,10,M('#1a0a10'));mo.position.set(.3,-.12,0);hg.add(mo);const tm=EM('#fff6a8',1.2);
 for(let i=0;i<8;i++){const z=-.13+i*.037;for(const s of[-1,1]){const t1=cone(.012,.05,tm,4);t1.position.set(.32,-.12+s*.035,z);t1.rotation.z=s>0?Math.PI:0;hg.add(t1)}}
 const spark=glowSprite('#e8f0ff',.45,.8);spark.position.set(.36,-.12,0);hg.add(spark);
 const arcs=new THREE.LineSegments(new THREE.BufferGeometry(),new THREE.LineBasicMaterial({color:'#e8f4ff',transparent:true,opacity:.9,blending:THREE.AdditiveBlending,depthWrite:false}));arcs.position.set(.34,-.12,0);hg.add(arcs);const ap=new Float32Array(6*6);arcs.geometry.setAttribute('position',new THREE.BufferAttribute(ap,3));
 const L=[];for(const z of[-1,1]){const lg=fxA_jlimb([V3(-.05,.42,z*.14),V3(.1,.24,z*.17),V3(-.02,.04,z*.17)],[.07,.055,.04],sk);for(let k=-1;k<=1;k++){const c=cone(.014,.07,cl,4);c.position.set(.06,-.36,k*.03);fxA_point(c,V3(1,-.4,0));lg.add(c)}g.add(lg);L.push({m:lg,ph:z>0?0:Math.PI,a:.5})}
 const arms=[];for(const z of[-1,1]){const a=fxA_jlimb([V3(.1,.82,z*.22),V3(.22,.62,z*.28),V3(.38,.6,z*.25)],[.05,.04,.03],sk);for(let k=-1;k<=1;k++){const c=cone(.012,.08,cl,4);c.position.set(.34,-.24,z*.03+k*.025);fxA_point(c,V3(1,-.2,0));a.add(c)}g.add(a);arms.push(a)}
 const tl=cone(.06,.14,sk,6);tl.position.set(-.27,.5,0);tl.rotation.z=Math.PI/2+.6;g.add(tl);
 addLegs(g,L);g.userData.noSkin=0;
 stdAnim(g,{fq:9,amp:.5,extra:t=>{arms.forEach((a,i)=>a.rotation.z=Math.sin(t*9+i*Math.PI)*.35);hg.rotation.z=Math.sin(t*2.1)*.1;
  const on=Math.sin(t*7.3)+Math.sin(t*11.1)>.6;spark.material.opacity=on?.9:.25;arcs.visible=on;if(on){for(let i=0;i<6;i++){ap[i*6]=0;ap[i*6+1]=(Math.random()-.5)*.08;ap[i*6+2]=(Math.random()-.5)*.3;ap[i*6+3]=.08+Math.random()*.1;ap[i*6+4]=(Math.random()-.5)*.2;ap[i*6+5]=(Math.random()-.5)*.35}arcs.geometry.attributes.position.needsUpdate=true}}});
 return g}

/* ---------- 半鱼: a metre long, black and smooth-skinned like a sea creature; a fin down the back, a flat half-metre tail for swimming,
   sucker pads on all four limbs, gills, broad webbed feet; it looks like a finned salamander and can half stand ---------- */
function fxA_banyu(f){const g=new THREE.Group();const col='#1e2428';const o={back:col,belly:'#4a5458',stripe:0,rough:.22};const sk=M(col,{roughness:.22,metalness:.05}),fin=M('#3e5054',{roughness:.3,side:THREE.DoubleSide,emissive:'#1a2a2e',emissiveIntensity:.5}),pad=M('#6a7478',{roughness:.4});
 g.add(loft([[-.42,.5,0,.15,.16],[-.15,.66,0,.2,.2],[.12,.86,0,.18,.18],[.28,1.02,0,.13,.14]],Object.assign({n:20},o)));
 const hg=new THREE.Group();hg.position.set(.32,1.08,0);g.add(hg);const hd=sph(0,.2,.1,.18,12,sk);hd.position.x=.1;hg.add(hd);const jw=sph(0,.18,.05,.16,10,sk);jw.position.set(.12,-.06,0);hg.add(jw);
 for(const z of[-1,1]){const e=sph(0,.035,.035,.035,8,M('#c8d020',{roughness:.05}));e.position.set(.17,.07,z*.12);hg.add(e);
  for(let k=0;k<3;k++){const gl=new THREE.Mesh(wingGeo(.16,.06,'fin').rotateX(-Math.PI/2),M('#a83a3a',{side:THREE.DoubleSide,roughness:.5}));gl.position.set(-.06,.02-k*.04,z*.15);gl.rotation.set(0,z*(1.2+k*.2),0);hg.add(gl)}}
 // dorsal fin along the back
 const dsh=new THREE.Shape();dsh.moveTo(0,0);dsh.quadraticCurveTo(.2,.3,.5,.22);dsh.quadraticCurveTo(.62,.12,.72,0);dsh.lineTo(0,0);const df=new THREE.Mesh(new THREE.ShapeGeometry(dsh,8),fin);df.position.set(-.42,.6,0);df.rotation.z=.6;g.add(df);
 // the flat paddle tail, held upright like a newt's
 const tl=new THREE.Group();tl.position.set(-.4,.5,0);g.add(tl);tl.add(loft([[0,0,0,.13,.08],[-.25,-.08,0,.14,.05],[-.5,-.12,0,.11,.03],[-.65,-.12,0,.04,.012]],Object.assign({n:14},o)));
 const tsh=new THREE.Shape();tsh.moveTo(0,0);tsh.quadraticCurveTo(-.35,.2,-.68,.02);tsh.quadraticCurveTo(-.35,-.18,0,0);const tf=new THREE.Mesh(new THREE.ShapeGeometry(tsh,8),fin);tf.position.set(0,-.04,0);tl.add(tf);
 const webG=new THREE.CircleGeometry(.1,8,-.9,1.8);const L=[];
 for(const[x,y,z,ln,arm]of[[-.3,.55,1,.5,0],[-.3,.55,-1,.5,0],[.2,.9,1,.42,1],[.2,.9,-1,.42,1]]){const P0=V3(x,y,z*.15);const P1=arm?V3(x+.12,y-.2,z*.24):V3(x+.12,y-.25,z*.26),P2=arm?V3(x+.3,y-.38,z*.22):V3(x-.02,.04,z*.26);const l=fxA_jlimb([P0,P1,P2],[.06,.045,.035],sk);
  const ft=new THREE.Mesh(webG,fin);ft.position.copy(P2).sub(P0);ft.rotation.x=-Math.PI/2;ft.scale.set(arm?.8:1.3,arm?.8:1.4,1);l.add(ft);for(let k=-1;k<=1;k++){const s=new THREE.Mesh(new THREE.CircleGeometry(.018,6),pad);s.position.copy(P2).sub(P0).add(V3(.06,-.004+(arm?0:.002),k*.04));s.rotation.x=Math.PI/2;l.add(s)}
  g.add(l);L.push({m:l,ph:(arm?0:Math.PI)+(z>0?Math.PI:0),a:.4})}
 addLegs(g,L);g.userData.tails=[{m:tl,a:.4,f:3.5}];stdAnim(g,{fq:6,amp:.35,extra:t=>{hg.rotation.z=Math.sin(t*1.3)*.08}});return g}

/* ---------- the scholar's flying machine: really a wooden frame, a rotor turning on top (it creaks as if about to fall apart),
   seat for one, a pull-lever, the engine the only part not of wood and driven by living power ---------- */
function fxA_tlant3(f){const g=new THREE.Group();const wd=M('#8a6a44',{roughness:.85}),wd2=M('#6a5034',{roughness:.9}),rope=M('#c8b080',{roughness:.9}),eng=M('#9a5a4a',{roughness:.5});
 const R=(a,b,r,m)=>g.add(fxA_rod(V3(...a),V3(...b),r||.03,r||.03,m||wd,5));
 const X=[.55,-.55],Y=[.05,.85],Z=[.32,-.32];
 for(const x of X)for(const z of Z)R([x,Y[0],z],[x,Y[1],z]);
 for(const y of Y){for(const z of Z)R([X[0],y,z],[X[1],y,z]);for(const x of X)R([x,y,Z[0]],[x,y,Z[1]])}
 for(const z of Z){R([X[0],Y[0],z],[X[1],Y[1],z],.02,wd2);R([X[1],Y[0],z],[0,.45,z],.02,wd2)}
 R([.55,.85,.32],[.55,.05,-.32],.02,wd2);R([-.55,.85,.32],[-.55,.05,-.32],.02,wd2);
 // skids
 for(const z of[-.38,.38]){R([.75,-.18,z],[-.7,-.18,z],.035);R([.4,-.18,z],[.4,.05,z*.84],.025);R([-.4,-.18,z],[-.4,.05,z*.84],.025);const tipM=fxA_rod(V3(.75,-.18,z),V3(.88,-.08,z),.035,.03,wd,5);g.add(tipM)}
 // seat, lever, gauge
 const seat=new THREE.Mesh(kb(.36,.06,.4),wd2);seat.position.set(-.1,.3,0);g.add(seat);const back=new THREE.Mesh(kb(.06,.4,.4),wd2);back.position.set(-.3,.5,0);g.add(back);
 R([.18,.3,.08],[.3,.62,.08],.015,wd2);g.add(at(sph(0,.03,.03,.03,6,M('#3a2a1a')),.3,.63,.08));
 const dial=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.02,12),wd);dial.rotation.z=Math.PI/2;dial.position.set(.5,.7,-.1);g.add(dial);const ndl=new THREE.Mesh(kb(.005,.06,.008),M('#c8c8c8',{metalness:.8,roughness:.3}));ndl.position.set(.512,.7,-.1);g.add(ndl);
 const pilot=bFig({h:.5,skin:'#b8c8c8',cloth:'#5a6a7a',head:'big'});pilot.position.set(-.08,.33,0);g.add(pilot);
 // the living engine behind the seat, and the shaft up to the rotor
 const en=sph(0,.2,.17,.2,12,eng);en.position.set(-.35,.95,0);g.add(en);for(let i=0;i<3;i++){const b=new THREE.Mesh(new THREE.TorusGeometry(.2,.015,4,14),rope);b.rotation.y=Math.PI/2;b.position.set(-.35+(i-1)*.1,.95,0);b.scale.set(1,.85,1);g.add(b)}
 R([-.2,.85,0],[-.2,1.45,0],.035);R([.2,.85,.3],[-.2,1.3,0],.015,rope);R([.2,.85,-.3],[-.2,1.3,0],.015,rope);
 const rot=new THREE.Group();rot.position.set(-.2,1.48,0);g.add(rot);rot.add(cyl(.06,.06,.08,wd2,8));for(const s of[-1,1]){const bl=new THREE.Mesh(kb(1.6,.02,.12),wd);bl.position.x=s*.82;bl.rotation.x=s*.08;rot.add(bl)}
 // tail boom: two rods to a small tail rotor
 R([-.55,.85,.2],[-1.65,.7,0],.025);R([-.55,.45,.2],[-1.65,.7,0],.02,wd2);R([-.55,.85,-.2],[-1.65,.7,0],.025);R([-.55,.45,-.2],[-1.65,.7,0],.02,wd2);
 for(let i=1;i<4;i++){const x=-.55-i*.27,k=1-i/4;R([x,.85-i*.04,.2*k],[x,.45+i*.06,-.2*k],.012,wd2)}
 const tr=new THREE.Group();tr.position.set(-1.68,.7,.04);g.add(tr);for(const s of[-1,1]){const b=new THREE.Mesh(kb(.03,.32,.05),wd);b.position.y=s*.16;tr.add(b)}
 g.userData.noSkin=1;g.userData.anim=t=>{rot.rotation.y=t*11;tr.rotation.z=t*20;ndl.rotation.x=Math.sin(t*3)*.6;g.rotation.z=Math.sin(t*.8)*.05;g.rotation.x=Math.sin(t*1.7)*.03;g.position.y=Math.sin(t*9)*.008};return g}

/* ---------- 酪树: an infected tree that survived and now walks on its roots; brainless but full of linked nerve knots,
   and in a fight it swats with its thick branches ---------- */
function fxA_laoshu(f){const g=new THREE.Group();const bark=M('#5a4632',{roughness:.95}),bark2=M('#4a3828',{roughness:.95}),knot=M('#7a6048',{roughness:.7}),lf=M(f.col||'#5a7a3a',{roughness:.8}),lf2=M(C(f.col||'#5a7a3a').lerp(C('#a8b84a'),.3).getStyle(),{roughness:.8});
 const tr=fxA_taper([V3(0,.7,0),V3(.03,1.4,0),V3(-.02,2.1,0),V3(.02,2.6,0)],t=>.32-t*.14,bark,10,9);g.add(tr);
 for(let i=0;i<6;i++){const a=i*2.1;const k=sph(0,.07,.09,.05,8,knot);k.position.set(Math.cos(a)*.27,1.0+i*.25,Math.sin(a)*.27);k.lookAt(V3(0,k.position.y,0));g.add(k)}
 // crown
 for(let i=0;i<9;i++){const a=i*2.4,r=.25+(i%3)*.25;const c=sph(0,.55,.38,.55,10,i%2?lf:lf2);c.position.set(Math.cos(a)*r,2.75+((i*5)%3)*.18,Math.sin(a)*r);g.add(c)}
 for(let i=0;i<4;i++){const a=i/4*6.283+.5;g.add(fxA_taper([V3(0,2.3,0),V3(Math.cos(a)*.35,2.55,Math.sin(a)*.35),V3(Math.cos(a)*.6,2.75,Math.sin(a)*.6)],t=>.1-t*.06,bark2,6,6))}
 // two heavy branch-arms
 const arms=[];for(const z of[-1,1]){const ag=new THREE.Group();ag.position.set(.05,1.9,z*.2);g.add(ag);ag.add(fxA_taper([V3(0,0,0),V3(.15,.05,z*.45),V3(.35,-.25,z*.8),V3(.55,-.7,z*.9)],t=>.14-t*.08,bark,10,7));
  for(const[px,py,pz]of[[.42,-.4,.86],[.55,-.72,.9],[.25,-.1,.65]]){const tw=fxA_taper([V3(px,py,z*pz),V3(px+.15,py-.05,z*(pz+.12)),V3(px+.25,py+.05,z*(pz+.15))],t=>.04-t*.03,bark2,4,5);ag.add(tw)}
  const lc=sph(0,.22,.18,.22,8,lf);lc.position.set(.5,-.5,z*.98);ag.add(lc);arms.push({m:ag,z})}
 // root legs
 const L=[];for(let i=0;i<5;i++){const a=i/5*6.283+.3;const d=V3(Math.cos(a),0,Math.sin(a));const P0=V3(0,.75,0).addScaledVector(d,.2);
  const l=fxA_jlimb([P0,V3(0,.55,0).addScaledVector(d,.55),V3(0,.02,0).addScaledVector(d,.72),V3(0,0,0).addScaledVector(d,.9)],[.13,.1,.07,.03],bark);g.add(l);L.push({m:l,ph:i*1.3,a:.15})}
 addLegs(g,L);g.userData.noSkin=0;
 g.userData.anim=t=>{for(const l of L){l.m.rotation.z=Math.sin(t*2+l.ph)*l.a;l.m.rotation.x=Math.cos(t*2+l.ph)*l.a*.6}for(const a of arms){a.m.rotation.x=a.z*(Math.sin(t*1.1+a.z)*.2);a.m.rotation.z=Math.sin(t*.9+a.z*2)*.15}tr.rotation.z=Math.sin(t*.7)*.02};
 return g}

/* ---------- 波塞冬龙 in the war: the emerald dragons fitted armour to their chests and a simple wooden tower on their backs
   with crossbowmen in it; half of them are shown so geared ---------- */
let fxA_bsdN=0;
function fxA_bosaidong(f){const g=bSauropod2(Object.assign({},f,{armor:0}));if((fxA_bsdN++)%2)return g;
 const arm=M('#7a6248',{roughness:.55,metalness:.15}),riv=M('#c8b890',{roughness:.3,metalness:.5}),wd=M('#8a6a44',{roughness:.85}),wd2=M('#6a5034',{roughness:.9}),strap=M('#4a3a28',{roughness:.9});
 const chest=new THREE.Mesh(new THREE.SphereGeometry(1,16,10,-Math.PI*.42,Math.PI*.84,Math.PI*.3,Math.PI*.42),arm);chest.material.side=THREE.DoubleSide;chest.scale.set(.78,.82,.74);chest.position.set(1.05,2.2,0);chest.rotation.y=Math.PI/2;g.add(chest);
 for(let i=0;i<10;i++){const a=(i/9-.5)*2.4;const r=sph(0,.04,.04,.04,6,riv);r.position.set(1.05+Math.cos(a)*.79,2.12+(i%2)*.18,Math.sin(a)*.6);g.add(r)}
 const col=new THREE.Mesh(new THREE.TorusGeometry(.5,.07,6,16),arm);col.position.set(1.42,2.5,0);col.rotation.set(0,Math.PI/2,.7);g.add(col);
 for(const x of[-.5,.45]){const b=new THREE.Mesh(new THREE.TorusGeometry(.84,.03,4,22),strap);b.position.set(x,2.2,0);b.rotation.y=Math.PI/2;b.scale.set(.92,1,1);g.add(b)}
 const R=(a,b,r,m)=>g.add(fxA_rod(V3(...a),V3(...b),r||.03,r||.03,m||wd,5));
 const tw=new THREE.Group();g.add(tw);const deck=new THREE.Mesh(kb(1.2,.07,.95),wd2);deck.position.set(-.05,3.12,0);g.add(deck);
 for(const x of[.5,-.6])for(const z of[.42,-.42]){R([x,3.12,z],[x,3.85,z],.035);}
 for(const y of[3.45,3.85]){R([.5,y,.42],[-.6,y,.42],.022);R([.5,y,-.42],[-.6,y,-.42],.022);R([.5,y,.42],[.5,y,-.42],.022);R([-.6,y,.42],[-.6,y,-.42],.022)}
 const roof=new THREE.Mesh(new THREE.ConeGeometry(.85,.35,4),wd2);roof.position.set(-.05,4.05,0);roof.rotation.y=Math.PI/4;roof.scale.set(1,1,.8);g.add(roof);
 const em=M('#2e9a5e',{roughness:.55}),bow=M('#5a4028',{roughness:.8});
 for(const[x,z]of[[.25,.2],[-.3,-.2],[.25,-.25]]){const b=sph(0,.09,.16,.09,8,em);b.position.set(x,3.32,z);g.add(b);const h=sph(0,.08,.07,.07,8,em);h.position.set(x+.05,3.54,z);g.add(h);const sn=sph(0,.06,.035,.04,6,em);sn.position.set(x+.13,3.53,z);g.add(sn);
  R([x+.08,3.4,z],[x+.38,3.48,z],.012,bow);R([x+.32,3.47,z-.1],[x+.32,3.47,z+.1],.01,bow)}
 return g}

/* ---------- 蓝猩: two metres long, covered in blue fur, with a fluffy blue tail and nimble limbs (descended from the fluffballs) ---------- */
function fxA_furGeo(det,amt,seed){const geo=new THREE.IcosahedronGeometry(1,det);const p=geo.attributes.position;const R=rnd(seed),map={};for(let i=0;i<p.count;i++){const k=[p.getX(i),p.getY(i),p.getZ(i)].map(v=>v.toFixed(3)).join();const s=map[k]||(map[k]=1+R()*amt);p.setXYZ(i,p.getX(i)*s,p.getY(i)*s,p.getZ(i)*s)}geo.computeVertexNormals();return geo}
function fxA_lanxing(f){const g=new THREE.Group();const col=f.col||'#5a8ad8';const fur=M(col,{roughness:.95}),fur2=M(C(col).lerp(C('#c8dcff'),.35).getStyle(),{roughness:.95}),face=M('#3a4a6a',{roughness:.6});
 const FG=fxA_furGeo(2,.18,4),FG2=fxA_furGeo(1,.25,8);const F=(m,sx,sy,sz,x,y,z,geo)=>{const o=new THREE.Mesh(geo||FG,m);o.scale.set(sx,sy,sz);o.position.set(x,y,z);return o};
 g.add(F(fur,.55,.4,.36,-.05,.95,0));g.add(F(fur,.4,.38,.34,.35,1.08,0));
 const hg=new THREE.Group();hg.position.set(.72,1.25,0);g.add(hg);hg.add(F(fur,.24,.22,.22,0,0,0));hg.add(F(face,.1,.13,.15,.18,-.02,0,sgeo(10)));
 for(const z of[-1,1]){const e=sph(0,.035,.035,.035,8,M('#ffffff',{roughness:.1}));e.position.set(.25,.04,z*.07);hg.add(e);const p=sph(0,.02,.022,.02,6,M('#0a0a12'));p.position.set(.28,.04,z*.07);hg.add(p);hg.add(F(fur,.07,.09,.05,-.02,.16,z*.18))}
 // long nimble limbs, front ones a little longer for climbing
 const L=[];for(const[x,z,fr]of[[.42,1,1],[.42,-1,1],[-.42,1,0],[-.42,-1,0]]){const l=new THREE.Group();l.position.set(x,1.0,z*.24);g.add(l);const ln=fr?1.05:.95;
  l.add(F(fur,.11,ln*.3,.11,0,-ln*.25,0,FG2));const k=new THREE.Group();k.position.y=-ln*.5;l.add(k);k.add(F(fur,.08,ln*.28,.08,0,-ln*.25,0,FG2));const hd2=sph(0,.09,.05,.08,8,face);hd2.position.set(.04,-ln*.5,0);k.add(hd2);
  l.userData.knee=k;L.push({m:l,ph:(fr?0:Math.PI)+(z>0?Math.PI:0),a:.55,k:fr?.3:-.4})}
 // the big fluffy tail curling up
 const tl=new THREE.Group();tl.position.set(-.55,1.05,0);g.add(tl);for(let i=0;i<7;i++){const a=i/6;const r=.13+Math.sin(a*Math.PI)*.12;tl.add(F(i%2?fur:fur2,r,r,r,-.12-a*.55,.05+a*a*.7,0,FG2))}
 addLegs(g,L);g.userData.tails=[{m:tl,a:.3,f:1.8}];stdAnim(g,{fq:6,amp:.45,extra:t=>{hg.rotation.y=Math.sin(t*.8)*.3;hg.rotation.z=Math.sin(t*1.3)*.08;tl.rotation.z=Math.sin(t*1.5)*.12}});return g}

/* ---------- 云步虫: a five-metre creature that is soft as cloud in body and step, half see-through; the general rides one above the cloud sea ---------- */
function fxA_yunbu(f){const g=new THREE.Group();const cm=new THREE.MeshStandardMaterial({color:'#f4f8ff',emissive:'#c8d8f0',emissiveIntensity:.35,transparent:true,opacity:.62,roughness:.9,depthWrite:false}),cm2=new THREE.MeshStandardMaterial({color:'#ffffff',emissive:'#e0e8ff',emissiveIntensity:.4,transparent:true,opacity:.45,roughness:.9,depthWrite:false});
 const geo=sgeo(14);const puffs=[];const P=(m,r,x,y,z,par)=>{const o=new THREE.Mesh(geo,m);o.scale.setScalar(r);o.position.set(x,y,z);(par||g).add(o);puffs.push({o,r,ph:x*3+z*5+y});return o};
 for(let i=0;i<9;i++){const x=1.2-i*.32;P(i%2?cm:cm2,.42-Math.abs(i-3)*.03,x,1.15+Math.sin(i*.9)*.08,(i%3-1)*.12)}
 for(let i=0;i<8;i++){const a=i*1.9;P(cm2,.25,.9-i*.28,1.45+Math.sin(a)*.05,Math.sin(a)*.25)}
 const hg=new THREE.Group();hg.position.set(1.5,1.3,0);g.add(hg);P(cm,.32,0,0,0,hg);P(cm2,.2,.22,.1,0,hg);for(const z of[-1,1]){const e=sph(0,.05,.05,.05,8,GL('#9ac8ff',.8));e.position.set(.26,.08,z*.15);hg.add(e)}
 const L=[];for(let i=0;i<6;i++){const x=.9-Math.floor(i/2)*.75,z=i%2?1:-1;const l=new THREE.Group();l.position.set(x,1.0,z*.3);g.add(l);for(let k=0;k<3;k++)P(cm,.17-k*.02,0,-.25-k*.27,0,l);P(cm2,.2,.05,-.9,0,l);L.push({m:l,ph:i*1.1+(z>0?Math.PI:0),a:.35})}
 addLegs(g,L);g.userData.noSkin=1;stdAnim(g,{fq:2.2,amp:.35,extra:t=>{for(const p of puffs)p.o.scale.setScalar(p.r*(1+Math.sin(t*1.4+p.ph)*.06));hg.rotation.z=Math.sin(t*.8)*.08}});return g}

/* ---------- 白骸龙 riders: add a saddle and reins to the running mount ---------- */
function fxA_baihaiRider(f){const g=bOstrichRider(f);const body=g.children[0];if(!body)return g;const lea=M('#6a4a2a',{roughness:.8}),lea2=M('#8a6a3a',{roughness:.8});
 const sd=sph(0,.34,.07,.38,12,lea);sd.position.set(-.05,2.48,0);body.add(sd);for(const z of[-1,1]){const fl=new THREE.Mesh(kb(.4,.36,.03),lea2);fl.position.set(-.05,2.3,z*.42);fl.rotation.x=z*.2;body.add(fl);
  body.add(fxA_rod(V3(.1,2.25,z*.4),V3(.12,1.95,z*.38),.012,.012,lea,4))}
 const gb=new THREE.Mesh(new THREE.TorusGeometry(.44,.02,4,16),lea);gb.position.set(.05,2.1,0);gb.rotation.y=Math.PI/2;gb.scale.set(1,.98,.98);body.add(gb);
 for(const z of[-1,1])body.add(tubeAlong([V3(.22,2.95,z*.12),V3(.6,2.95,z*.1),V3(1.0,3.08,z*.07),V3(1.22,3.1,z*.05)],.01,lea,10));
 const bt=new THREE.Mesh(new THREE.TorusGeometry(.13,.015,4,12),lea);bt.position.set(1.18,3.12,0);bt.rotation.y=Math.PI/2;body.add(bt);return g}

SPEC.cishazhe=fxA_cishazhe;SPEC.zhenjunguai=fxA_zhenjun;SPEC.dianzhuru=fxA_dianzhuru;SPEC.banyu=fxA_banyu;SPEC.rq_tlant3=fxA_tlant3;SPEC.laoshu=fxA_laoshu;SPEC.bosaidong=fxA_bosaidong;SPEC.lanxing=fxA_lanxing;SPEC.yunbuchong=fxA_yunbu;SPEC.baihai_rider=fxA_baihaiRider;
if(ENT.rq_tlant3)ENT.rq_tlant3=[fxA_tlant3,ENT.rq_tlant3[1],ENT.rq_tlant3[2]];
