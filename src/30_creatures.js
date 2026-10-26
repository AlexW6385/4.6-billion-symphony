/* ================================================================
   creatures: built part by part from the novel's descriptions.
   Convention: faces +x, up +y, about 2–3 units long; herds scale by f.s*2.2.
   ================================================================ */
const MC={};
function M(c,o){const k=c+'|'+(o?JSON.stringify(o):'');return MC[k]||(MC[k]=new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.72,metalness:0},o||{})))}
function EM(c,i,o){return M(c,Object.assign({emissive:c,emissiveIntensity:i===undefined?1:i},o||{}))}
const GLC={};function GL(c,op){const k=c+(op||1);return GLC[k]||(GLC[k]=new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:op===undefined?1:op,blending:THREE.AdditiveBlending,depthWrite:false}))}
function TR(c,op,o){return new THREE.MeshStandardMaterial(Object.assign({color:c,transparent:true,opacity:op,roughness:.25,depthWrite:false},o||{}))}
const _sg={};function sgeo(seg){return _sg[seg]||(_sg[seg]=new THREE.SphereGeometry(1,seg,Math.max(6,seg*.7|0)))}
function sph(c,sx,sy,sz,seg,mat){const m=new THREE.Mesh(sgeo(seg||14),mat||M(c));m.scale.set(sx,sy,sz);return m}
function at(o,x,y,z){o.position.set(x,y,z);return o}
function rz(o,a){o.rotation.z=a;return o}
function cyl(r0,r1,h,mat,seg){return new THREE.Mesh(new THREE.CylinderGeometry(r0,r1,h,seg||8),mat)}
function cone(r,h,mat,seg){return new THREE.Mesh(new THREE.ConeGeometry(r,h,seg||7),mat)}
function limb(len,r0,r1,mat){const g=new THREE.Group();const m=cyl(r0,r1,len,mat,6);m.position.y=-len/2;g.add(m);g.userData.len=len;return g}
function leg2(l1,l2,r,mat,bend){const g=limb(l1,r,r*.8,mat);const k=limb(l2,r*.8,r*.5,mat);k.position.y=-l1;k.rotation.z=bend||0;g.add(k);g.userData.knee=k;return g}
function tubeAlong(pts,r,mat,seg){return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),seg||20,r,6,false),mat)}
function wingGeo(span,chord,kind){const s=new THREE.Shape();
 if(kind==='bat'){s.moveTo(0,0);s.lineTo(span*.35,chord*.55);s.lineTo(span,chord*.25);s.quadraticCurveTo(span*.82,-chord*.05,span*.7,-chord*.2);s.quadraticCurveTo(span*.55,-chord*.02,span*.42,-chord*.32);s.quadraticCurveTo(span*.25,-chord*.05,0,-chord*.35);s.lineTo(0,0)}
 else if(kind==='insect'){s.moveTo(0,0);s.quadraticCurveTo(span*.5,chord*.5,span,chord*.1);s.quadraticCurveTo(span*.6,-chord*.4,0,-chord*.12)}
 else if(kind==='fin'){s.moveTo(0,0);s.lineTo(span,-chord*.6);s.lineTo(span*.25,-chord);s.lineTo(0,0)}
 else{s.moveTo(0,0);s.quadraticCurveTo(span*.45,chord*.7,span,chord*.05);s.quadraticCurveTo(span*.5,-chord*.25,0,-chord*.3)}
 const g=new THREE.ShapeGeometry(s,8);g.rotateX(Math.PI/2);return g}   // lies in the x–z plane, span along +z
function wing(span,chord,mat,kind){const m=new THREE.Mesh(wingGeo(span,chord,kind),mat);const g=new THREE.Group();g.add(m);return g}
function mergeColored(parts){const gs=parts.map(([g,c])=>{g=g.index?g.toNonIndexed():g;const n=g.attributes.position.count,col=new Float32Array(n*3),cc=C(c);for(let i=0;i<n;i++){col[i*3]=cc.r;col[i*3+1]=cc.g;col[i*3+2]=cc.b}g.setAttribute('color',new THREE.BufferAttribute(col,3));if(g.attributes.uv)g.deleteAttribute('uv');return g});
 return THREE.BufferGeometryUtils?THREE.BufferGeometryUtils.mergeBufferGeometries(gs):gs[0]}
function tg(g,f){g.applyMatrix4(new THREE.Matrix4().compose(V3(...(f.p||[0,0,0])),new THREE.Quaternion().setFromEuler(new THREE.Euler(...(f.r||[0,0,0]))),V3(...(f.s||[1,1,1]))));return g}
// animation helpers
function addLegs(g,list){g.userData.legs=(g.userData.legs||[]).concat(list)}
function addWings(g,list){g.userData.wings=(g.userData.wings||[]).concat(list)}
function stdAnim(g,o){o=o||{};const fq=o.fq||7,amp=o.amp||.45,wf=o.wf||5,wa=o.wa||.5;
 g.userData.anim=(t)=>{const L=g.userData.legs;if(L)for(const l of L){l.m.rotation.z=Math.sin(t*fq+l.ph)*amp*(l.a||1);if(l.m.userData.knee)l.m.userData.knee.rotation.z=(l.k||-.3)+Math.max(0,Math.sin(t*fq+l.ph+1.4))*.5}
  const Wg=g.userData.wings;if(Wg)for(const w of Wg){w.m.rotation.x=(w.base||0)+w.s*Math.sin(t*(w.f||wf)+(w.ph||0))*(w.a||wa)}
  const Tl=g.userData.tails;if(Tl)for(const tl of Tl){tl.m.rotation.y=Math.sin(t*(tl.f||2)+(tl.ph||0))*(tl.a||.3)}
  if(o.extra)o.extra(t)}}

/* ---------------- sea & sky giants ---------------- */
function bLeviathan(f){const g=new THREE.Group();const skin=M(f.col||'#41606a',{roughness:.5}),plate=M('#24343a',{roughness:.35,metalness:.25}),bone=M('#e9e2cc');
 const sac=new THREE.MeshStandardMaterial({color:'#c8f2e8',emissive:'#5fd6c0',emissiveIntensity:.55,transparent:true,opacity:.5,roughness:.2,depthWrite:false});
 const segs=[];for(let i=0;i<7;i++){const s=sph(0,.5-i*.035,.4-i*.03,.46-i*.03,16,skin);s.position.x=1.05-i*.42;g.add(s);segs.push(s);
  const p=cone(.11,.34,plate,5);p.position.set(1.05-i*.42,.38-i*.03,0);p.rotation.z=-.35;g.add(p);
  for(const z of[-1,1]){const q=cone(.07,.22,plate,4);q.position.set(1.05-i*.42,.18,z*(.38-i*.025));q.rotation.x=z*1.1;g.add(q)}}
 const hd=sph(0,.48,.36,.4,16,skin);hd.position.x=1.55;g.add(hd);
 const jaw=cone(.24,.62,plate,6);jaw.rotation.z=-Math.PI/2;jaw.position.set(2.0,.02,0);jaw.scale.z=.8;g.add(jaw);
 for(let i=0;i<6;i++){const tth=cone(.025,.12,bone,4);tth.position.set(1.78+i*.06,-.12,(i%2?1:-1)*.12);tth.rotation.x=Math.PI;g.add(tth)}
 for(const z of[-1,1]){const e=sph(0,.06,.06,.06,8,GL('#d6fff4'));e.position.set(1.82,.17,z*.24);g.add(e)}
 const stalk=tubeAlong([V3(1.6,.3,0),V3(1.85,.62,0),V3(2.2,.6,0),V3(2.32,.45,0)],.025,skin,12);g.add(stalk);
 const lan=sph(0,.09,.09,.09,10,GL('#c6fff0'));lan.position.set(2.33,.42,0);g.add(lan);const lg=glowSprite('#9fffe8',1.1,.55);lg.position.copy(lan.position);g.add(lg);
 for(let i=0;i<3;i++){const s=sph(0,.32-i*.05,.24-i*.04,.28-i*.04,14,sac);s.position.set(.75-i*.55,.52,0);g.add(s)}
 const wings=[];for(const z of[-1,1]){const w=wing(1.6,.95,new THREE.MeshStandardMaterial({color:'#8fb8bc',transparent:true,opacity:.75,side:THREE.DoubleSide,roughness:.4}),'bat');w.position.set(.55,.28,z*.38);if(z<0)w.scale.z=-1;g.add(w);wings.push({m:w,s:z,a:.45,f:2.2})}
 addWings(g,wings);
 const tents=[];for(let i=0;i<6;i++){const tg2=new THREE.Group();const pts=[];for(let j=0;j<=5;j++)pts.push(V3(-j*.12,-j*.28,Math.sin(j)*.05));tg2.add(tubeAlong(pts,.035,skin,10));tg2.position.set(.6-(i%3)*.45,-.32,(i<3?-1:1)*.18);g.add(tg2);tents.push(tg2)}
 const tail=cone(.16,1.1,skin,8);tail.rotation.z=Math.PI/2;tail.position.x=-2.1;g.add(tail);
 g.userData.anim=(t)=>{segs.forEach((s,i)=>{s.position.y=Math.sin(t*2-i*.7)*.045});for(const w of wings)w.m.rotation.x=w.s*Math.sin(t*2.2)*.45;tents.forEach((tt,i)=>{tt.rotation.z=Math.sin(t*1.6+i)*.25;tt.rotation.x=Math.cos(t*1.3+i)*.2});tail.rotation.y=Math.sin(t*1.8)*.2;lg.material.opacity=.4+Math.sin(t*3)*.15};
 return g}
function sharkGeo(len,r,flat){const prof=[];for(let i=0;i<=18;i++){const t=i/18;const rr=Math.sin(Math.PI*Math.pow(t,.78))*r*(1-.42*t);prof.push(new THREE.Vector2(Math.max(.004,rr),(.5-t)*len))}
 const geo=new THREE.LatheGeometry(prof,20);geo.rotateZ(-Math.PI/2);geo.scale(1,1,flat||.82);return geo}
function bBehemoth(f){const g=new THREE.Group();const skin=M(f.col||'#7c8f86',{roughness:.55}),dark=M('#3a4644',{roughness:.5}),belly=M('#c9d6cc');
 const body=new THREE.Mesh(sharkGeo(5,.62,.8),skin);g.add(body);
 const bel=new THREE.Mesh(sharkGeo(4.2,.5,.7),belly);bel.position.set(.1,-.12,0);bel.scale.set(1,.7,1);g.add(bel);
 const sac=new THREE.Mesh(sgeo(16),new THREE.MeshStandardMaterial({color:'#dff4ec',emissive:'#7fd8c4',emissiveIntensity:.35,transparent:true,opacity:.45,roughness:.15,depthWrite:false}));sac.scale.set(1.7,.36,.42);sac.position.set(.1,.48,0);g.add(sac);
 const df=new THREE.Mesh(wingGeo(.8,.9,'fin'),dark);df.rotation.set(-Math.PI/2,0,Math.PI);df.position.set(.2,.55,0);g.add(df);
 const fins=[];for(let i=0;i<3;i++)for(const z of[-1,1]){const fn=wing(.9-i*.12,.5,M('#6e8079',{side:THREE.DoubleSide}),'fin');fn.position.set(.9-i*.85,-.15,z*.42);if(z<0)fn.scale.z=-1;fn.rotation.y=z*.4;g.add(fn);fins.push({m:fn,s:z,a:.18,f:1.6,ph:i})}
 addWings(g,fins);
 const tailG=new THREE.Group();const tf=new THREE.Mesh(wingGeo(.9,1.1,'fin'),dark);tf.rotation.set(0,0,0);tf.geometry=tf.geometry.clone().rotateX(-Math.PI/2);tailG.add(tf);
 const tf2=tf.clone();tf2.scale.y=-1;tailG.add(tf2);tailG.position.x=-2.4;g.add(tailG);
 const noz=cyl(.16,.22,.35,dark,12);noz.rotation.z=Math.PI/2;noz.position.x=-2.25;g.add(noz);
 const jet=sph(0,.14,.14,.14,10,GL('#9fd8ff'));jet.position.x=-2.45;g.add(jet);const js=glowSprite('#8fd0ff',1.4,.6);js.position.x=-2.55;g.add(js);
 for(let i=0;i<5;i++)for(const z of[-1,1]){const gl=new THREE.Mesh(new THREE.BoxGeometry(.03,.22,.02),dark);gl.position.set(1.35-i*.08,.0,z*.46);g.add(gl)}
 for(let i=0;i<4;i++){const h=new THREE.Mesh(new THREE.BoxGeometry(.28,.04,.18),dark);h.position.set(.8-i*.55,-.5,0);g.add(h)}
 for(const z of[-1,1]){const e=sph(0,.05,.05,.05,8,GL('#e8ffef'));e.position.set(1.9,.1,z*.28);g.add(e)}
 g.userData.anim=(t)=>{tailG.rotation.y=Math.sin(t*1.4)*.3;for(const fn of fins)fn.m.rotation.x=fn.s*Math.sin(t*1.6+fn.ph)*.18;g.rotation.x=Math.sin(t*.5)*.03;js.material.opacity=.45+Math.sin(t*9)*.1};
 return g}
function bFlyShark(f){const g=new THREE.Group();const skin=M(f.col||'#c8d8e0');g.add(new THREE.Mesh(sharkGeo(2.4,.32,.78),skin));
 const df=new THREE.Mesh(wingGeo(.4,.45,'fin'),skin);df.rotation.set(-Math.PI/2,0,Math.PI);df.position.set(.1,.28,0);g.add(df);
 const tl=new THREE.Group();const tf=new THREE.Mesh(wingGeo(.45,.55,'fin').rotateX(-Math.PI/2),skin);tl.add(tf);const t2=tf.clone();t2.scale.y=-1;tl.add(t2);tl.position.x=-1.15;g.add(tl);
 const fog=emitter({n:70,life:3,speed:.5,spread:1.6,size:2.2,dir:[-1,0,0],col:'#e8f0f4',op:.25,add:false,tex:smokeTex,area:[.4,.2,.2]});fog.position.x=.3;g.add(fog);
 g.userData.anim=(t)=>{tl.rotation.y=Math.sin(t*3)*.35};return g}
function bSkyWhale(f){const g=new THREE.Group();const m=new THREE.MeshStandardMaterial({color:f.col||'#eaf4ff',transparent:true,opacity:.42,roughness:.9,emissive:'#bcd8ff',emissiveIntensity:.15,depthWrite:false});
 g.add(new THREE.Mesh(sharkGeo(3.4,.6,.9),m));const gut=sph(0,.9,.25,.25,12,TR('#ffc8b0',.35));gut.position.x=.1;g.add(gut);
 const fins=[];for(const z of[-1,1]){const fn=wing(1.1,.6,new THREE.MeshStandardMaterial({color:'#f4f9ff',transparent:true,opacity:.35,side:THREE.DoubleSide,depthWrite:false}),'fin');fn.position.set(.5,-.1,z*.5);if(z<0)fn.scale.z=-1;g.add(fn);fins.push({m:fn,s:z,a:.3,f:1})}
 addWings(g,fins);const tl=new THREE.Group();const tf=new THREE.Mesh(new THREE.PlaneGeometry(.9,.9),new THREE.MeshStandardMaterial({color:'#f4f9ff',transparent:true,opacity:.35,side:THREE.DoubleSide,depthWrite:false}));tf.rotation.x=Math.PI/2;tl.add(tf);tl.position.x=-1.9;g.add(tl);
 const mist=emitter({n:50,life:4,speed:.3,spread:1.2,size:3,dir:[1,0,0],col:'#ffffff',op:.2,add:false,tex:smokeTex,area:[.3,.3,.3]});mist.position.x=1.7;g.add(mist);
 g.userData.anim=(t)=>{tl.rotation.z=Math.sin(t*1.2)*.35;for(const fn of fins)fn.m.rotation.x=fn.s*Math.sin(t)*.3};return g}
function bJelly(f){const g=new THREE.Group();const big=f.w==='haikong',slime=f.w==='daqi';
 const prof=[];for(let i=0;i<=12;i++){const t=i/12;prof.push(new THREE.Vector2(Math.sin(t*Math.PI*.55)*(1+.12*Math.pow(t,6)),Math.cos(t*Math.PI*.5)*.9-(t>.9?(t-.9)*1.2:0)))}
 const bm=new THREE.MeshStandardMaterial({color:f.col,emissive:f.col,emissiveIntensity:slime?.15:.35,transparent:true,opacity:slime?.35:.55,side:THREE.DoubleSide,roughness:.15,depthWrite:false});
 const bell=new THREE.Mesh(slime?sgeo(18):new THREE.LatheGeometry(prof,22),bm);if(slime)bell.scale.set(1,.7,1);g.add(bell);
 const core=sph(0,.35,.3,.35,12,GL(big?'#9fe0ff':'#f4fff8',.55));core.position.y=.25;g.add(core);
 if(!slime){for(let i=0;i<8;i++){const o=sph(0,.06,.18,.06,6,GL(f.col,.6));const a=i/8*6.28;o.position.set(Math.cos(a)*.55,.35,Math.sin(a)*.55);o.rotation.z=Math.cos(a)*.6;g.add(o)}}
 const NT=big?16:slime?0:11,NS=10,tp=new Float32Array(NT*NS*2*3);const tgeo=new THREE.BufferGeometry();tgeo.setAttribute('position',new THREE.BufferAttribute(tp,3));
 const tl=new THREE.LineSegments(tgeo,new THREE.LineBasicMaterial({color:f.col,transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false}));tl.frustumCulled=false;if(NT)g.add(tl);
 if(big){const rope=new THREE.LineBasicMaterial({color:'#8a7a5a'});const bk=new THREE.Mesh(new THREE.CylinderGeometry(.35,.28,.3,8,1,true),M('#7a5a3a',{side:THREE.DoubleSide}));bk.position.y=-3.2;g.add(bk);
  for(let i=0;i<4;i++){const a=i/4*6.28;g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([V3(Math.cos(a)*.6,-.1,Math.sin(a)*.6),V3(Math.cos(a)*.32,-3.05,Math.sin(a)*.32)]),rope))}
  const rider=sph('#f0ece0',.08,.14,.08,8);rider.position.y=-2.95;g.add(rider)}
 if(slime){const sp=sparkles(Array.from({length:30},()=>V3((Math.random()-.5)*1.4,(Math.random()-.5)*.8,(Math.random()-.5)*1.4)),'#d8f0ff',.6,.9);g.add(sp)}
 g.userData.anim=(t)=>{const k=1+Math.sin(t*1.8)*.09;bell.scale.set(slime?1/k:k,slime?.7*k:1/k*.98,slime?1/k:k);
  if(NT){let q=0;for(let i=0;i<NT;i++){const a=i/NT*6.28,r0=.78;let px=Math.cos(a)*r0,pz=Math.sin(a)*r0,py=-.05;for(let j=0;j<NS;j++){const nx=px+Math.sin(t*1.4+i+j*.5)*.05,nz=pz+Math.cos(t*1.2+i*1.3+j*.4)*.05,ny=py-(big?.42:.26);
     tp[q++]=px;tp[q++]=py;tp[q++]=pz;tp[q++]=nx;tp[q++]=ny;tp[q++]=nz;px=nx*.97;py=ny;pz=nz*.97}}tgeo.attributes.position.needsUpdate=true}};
 return g}

/* ---------------- 绒球 itself, the brain-bugs ---------------- */
function bFluff(f){const g=new THREE.Group();const warm=f.w==='rq_piaoliu'?'#f4f6f8':(f.col||'#fff2d8');
 const core=sph(0,.82,.82,.82,20,new THREE.MeshStandardMaterial({color:warm,emissive:f.w==='rq_piaoliu'?'#000000':'#ffd9a0',emissiveIntensity:.35,roughness:1}));g.add(core);
 const n=700,pa=new Float32Array(n*6),ca=new Float32Array(n*6);const c0=C(f.w==='rq_piaoliu'?'#cfd6dc':'#e8b878'),c1=C('#fffaf0');
 for(let i=0;i<n;i++){const v=V3(Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize();const L=.8+Math.random()*.55;pa.set([v.x*.78,v.y*.78,v.z*.78,v.x*L,v.y*L,v.z*L],i*6);ca.set([c0.r,c0.g,c0.b,c1.r,c1.g,c1.b],i*6)}
 const hg=new THREE.BufferGeometry();hg.setAttribute('position',new THREE.BufferAttribute(pa,3));hg.setAttribute('color',new THREE.BufferAttribute(ca,3));
 const hair=new THREE.LineSegments(hg,new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:.85}));g.add(hair);
 if(f.w!=='rq_piaoliu'){const gl=glowSprite('#ffe4b0',3.6,.35);g.add(gl)}
 g.userData.anim=(t)=>{hair.rotation.y=t*.15;const s=1+Math.sin(t*1.7)*.03;hair.scale.setScalar(s);core.position.y=Math.sin(t*1.3)*.06};
 return g}
function brainGeo(){let geo=new THREE.IcosahedronGeometry(1,40);geo.deleteAttribute('normal');geo.deleteAttribute('uv');geo=THREE.BufferGeometryUtils.mergeVertices(geo);const p=geo.attributes.position,n=p.count,col=new Float32Array(n*3);const lo=C('#7a2a3a'),hi=C('#e09aa8'),tmp=new THREE.Color();
 // folds: narrow winding grooves (sulci) between broad rounded ridges, and the deep cleft between the halves
 for(let i=0;i<n;i++){const v=V3(p.getX(i),p.getY(i),p.getZ(i)).normalize();const d=Math.sin(v.x*14+Math.sin(v.y*9.3)*1.9)+Math.sin(v.y*15.5+Math.sin(v.z*10.1)*1.9)+Math.sin(v.z*14.7+Math.sin(v.x*8.9)*1.9);const gq=Math.abs(d);const sul=1-sm(0,.5,gq);
  const cleft=Math.exp(-Math.pow(v.z/.06,2))*(v.y>-.35?1:0);const r=1-sul*.07-cleft*.16+.03*(1-gq);v.multiplyScalar(r);p.setXYZ(i,v.x*1.15,v.y*.85,v.z);tmp.copy(hi).lerp(lo,Math.max(sul*.75,cleft*.8));col.set([tmp.r,tmp.g,tmp.b],i*3)}
 geo.setAttribute('color',new THREE.BufferAttribute(col,3));geo.computeVertexNormals();return geo}
let _brain=null;
/* 脑袋虫 (玛雅): what Lin first sees is a white oval lump about a metre long, soft, with no shell and no limbs; under the
   skin a layer of muscle (it gets about by squirming, and by rolling over), a few breathing holes, a small mouth pressed
   flat underneath, small eyes. the brain that makes up most of it is inside, not on show */
function wormGeo(){let geo=new THREE.IcosahedronGeometry(1,22);geo.deleteAttribute('normal');geo.deleteAttribute('uv');geo=THREE.BufferGeometryUtils.mergeVertices(geo);const p=geo.attributes.position,n=p.count,col=new Float32Array(n*3);
 const base=C('#f4f0e8'),belly=C('#e4d8cc'),fold=C('#dccfc4'),tmp=new THREE.Color();
 for(let i=0;i<n;i++){const v=V3(p.getX(i),p.getY(i),p.getZ(i)).normalize();const band=Math.sin(v.x*17+Math.sin(v.z*3)*.6);const lump=Math.sin(v.x*5.1+v.y*3.3)*Math.sin(v.z*4.7+1.3)*.025;
  const r=1+lump-.012*Math.max(0,-band);let x=v.x*r*1.28,y=v.y*r*.8,z=v.z*r*.94;if(y<-.5)y=-.5+(y+.5)*.3;p.setXYZ(i,x,y,z);
  tmp.copy(base).lerp(belly,sm(-.1,-.55,v.y)*.8).lerp(fold,Math.max(0,-band)*.35);col.set([tmp.r,tmp.g,tmp.b],i*3)}
 geo.setAttribute('color',new THREE.BufferAttribute(col,3));geo.computeVertexNormals();return geo}
let _worm=null;
function bMaya(){const g=new THREE.Group();_worm=_worm||wormGeo();const holder=new THREE.Group();g.add(holder);
 const b=new THREE.Mesh(_worm,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.42,emissive:'#3a2420',emissiveIntensity:.06}));holder.add(b);
 // eyes: small, dark and wet, set low on the front
 for(const s of[1,-1]){const e=sph(0,.085,.085,.085,12,M('#141010',{roughness:.08}));e.position.set(1.17,.2,s*.3);b.add(e);const lid=sph(0,.11,.06,.11,10,M('#e8dfd4',{roughness:.5}));lid.position.set(1.13,.25,s*.3);b.add(lid)}
 // breathing holes along the back
 const hg=new THREE.CircleGeometry(.05,10),hm=M('#7a645a',{roughness:.9});[[.45,.62,.32],[.05,.72,.36],[-.4,.64,.3],[.45,.62,-.32],[.05,.72,-.36],[-.4,.64,-.3]].forEach(q=>{const h=new THREE.Mesh(hg,hm);const v=V3(q[0]/1.28,q[1]/.8,q[2]/.94).normalize();h.position.set(v.x*1.28*1.004,v.y*.8*1.004,v.z*.94*1.004);h.lookAt(h.position.clone().multiply(V3(1/1.64,1/.64,1/.88)).add(h.position));b.add(h)});
 // the mouth: a short line pressed shut on the underside, near the front
 {const m=new THREE.Mesh(new THREE.TorusGeometry(.09,.012,4,10,Math.PI),M('#9a7a70'));m.position.set(.95,-.46,0);m.rotation.set(Math.PI/2,0,0);b.add(m)}
 const RA=1.28,RB=.8,lowY=.5;
 // most of the time it squirms in place, now and then it rolls over a couple of times (that is how it gets anywhere)
 g.userData.roll=b;g.userData.anim=t=>{const ph=(t*.9)%7;let rot=0;if(ph<1.6){const k=ph/1.6;rot=-(k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2)*Math.PI*2}
  b.rotation.z=rot;const sn=Math.sin(rot),cs=Math.cos(rot);holder.position.y=Math.sqrt(Math.pow(RA*sn,2)+Math.pow(RB*cs,2))-(RB-lowY)*Math.abs(cs);
  const sq=ph>=1.6?Math.sin(t*3.1)*.04:0;b.scale.set(1+sq,1-sq*.8,1-sq*.3);holder.rotation.y=ph>=1.6?Math.sin(t*.7)*.25:0};return g}
function bBrain(f){const g=new THREE.Group();_brain=_brain||brainGeo();const yellow=f.w==='zaonao';
 const b=new THREE.Mesh(_brain,yellow?M('#d8b850',{roughness:.6}):new THREE.MeshStandardMaterial({vertexColors:true,roughness:.55,emissive:'#401018',emissiveIntensity:.2}));
 const holder=new THREE.Group();holder.position.y=yellow?1.3:.95;holder.add(b);if(yellow){b.scale.set(1.3,.9,1.1)}g.add(holder);
 const eye=sph(0,.26,.26,.26,12,M('#ffffff',{roughness:.2}));eye.position.set(1.02,1.18,0);const pu=sph(0,.12,.12,.12,8,M('#111111',{roughness:.1}));pu.position.set(1.22,1.2,0);
 if(!yellow){g.add(eye);g.add(pu)}
 if(yellow){const fat=sph('#c8a040',1.3,.75,1,16);fat.position.y=.75;g.add(fat);const L=[];for(let i=0;i<8;i++){const s=i%2?1:-1;const l=leg2(.5,.45,.07,M('#a08a30'),.6);l.position.set(.7-Math.floor(i/2)*.45,.6,s*.75);l.rotation.x=s*.5;g.add(l);L.push({m:l,ph:i*1.3})}addLegs(g,L);
  const brain2=new THREE.Mesh(_brain,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.55}));brain2.scale.setScalar(.35);brain2.position.set(.3,1.6,0);g.add(brain2)}
 g.userData.roll=b;stdAnim(g,{fq:9,amp:.35,extra:(t)=>{if(!yellow)b.rotation.z=-t*3.2;else holder.rotation.y=Math.sin(t)*.2}});return g}

/* ---------------- dragonkin: 骸龙 · 翡翠龙 · 白骸龙 and kin ---------------- */
function bDragonkin(f){const g=new THREE.Group();const id=f.w;
 const P={gulong:{c:'#8f8a80',st:'#ece6d4',sp:1},baihai:{c:'#ece8de',eye:'#8fffe8',sp:1,staff:1},emerald:{c:'#2e9a5e',m:.35,round:1,sp:1},rq_xuewu:{c:'#2f8a58',m:.35,round:1,scarf:1},
  ex_baixing:{c:'#f4f8ff',eye:'#bfe8ff',glow:1},zhuru:{c:'#3a2a20',small:1,pipe:1},dianzhuru:{c:'#3e3450',small:1,teeth:1},huojilong:{c:'#c84a2a',small:1,beak:1},banyu:{c:'#6a8a8a',fish:1}}[id]||{c:f.col||'#8a8070'};
 const skin=M(P.c,{roughness:P.m?.35:.7,metalness:P.m||0,emissive:P.glow?P.c:'#000000',emissiveIntensity:P.glow?.4:0});
 const torso=sph(0,.42,.62,.38,14,skin);torso.position.set(0,1.25,0);torso.rotation.z=-.35;g.add(torso);
 if(P.st){for(let i=0;i<4;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(.36-i*.02,.025,4,16,Math.PI),M(P.st));r.position.set(-.05+i*.05,1.0+i*.17,0);r.rotation.set(0,Math.PI/2,-.35);g.add(r)}}
 const neck=cyl(.12,.17,.45,skin,8);neck.position.set(.25,1.78,0);neck.rotation.z=-.5;g.add(neck);
 const head=sph(0,P.round?.32:.36,P.round?.3:.24,P.round?.3:.22,14,skin);head.position.set(.48,2.02,0);g.add(head);
 const snout=sph(0,.2,.12,.15,10,skin);snout.position.set(.75,1.97,0);if(!P.round)g.add(snout);
 if(P.fish){const fin=cone(.2,.4,skin,4);fin.position.set(.35,2.25,0);g.add(fin)}
 for(const z of[-1,1]){const e=sph(0,.05,.05,.04,8,P.eye?GL(P.eye):M('#10100c'));e.position.set(P.round?.7:.66,2.08,z*.13);g.add(e)}
 if(P.teeth){const m=sph(0,.12,.04,.12,8,GL('#ffe46a'));m.position.set(.76,1.9,0);g.add(m)}
 if(P.beak){snout.material=M('#e8b040')}
 const tail=tubeAlong([V3(-.2,1.0,0),V3(-.7,.85,0),V3(-1.2,.75,0),V3(-1.6,.8,0)],.09,skin,10);const tlg=new THREE.Group();tlg.add(tail);g.add(tlg);
 const L=[];for(const z of[-1,1]){const l=leg2(.55,.6,.1,skin,.5);l.position.set(-.05,.98,z*.22);g.add(l);L.push({m:l,ph:z>0?0:Math.PI,a:1})}
 const arms=[];for(const z of[-1,1]){const a=leg2(.38,.32,.06,skin,-.9);a.position.set(.28,1.55,z*.3);g.add(a);arms.push(a)}
 if(P.sp||P.staff){const s=cyl(.02,.02,2.1,M('#6a4a2a'),5);s.position.set(.55,1.25,.36);s.rotation.z=P.staff?.1:-.9;g.add(s);const tip=cone(.05,.16,P.staff?GL('#9ff2ff'):M('#8a8a80'),4);tip.position.set(P.staff?.65:1.4,P.staff?2.3:1.75,.36);tip.rotation.z=P.staff?0:-.9;g.add(tip)}
 if(P.pipe){const s=cyl(.015,.015,.7,M('#5a4a2a'),4);s.position.set(.85,1.95,0);s.rotation.z=-1.3;g.add(s)}
 if(P.scarf){const sc=new THREE.Mesh(new THREE.TorusGeometry(.18,.06,6,14),M('#c8302a'));sc.position.set(.26,1.75,0);sc.rotation.y=Math.PI/2;g.add(sc);const tailS=new THREE.Mesh(new THREE.PlaneGeometry(.5,.12),M('#c8302a',{side:THREE.DoubleSide}));tailS.position.set(-.05,1.7,-.1);g.add(tailS);const cr=sph(0,.08,.12,.05,6,EM('#ff5a5a',.8));cr.position.set(.38,1.45,0);g.add(cr)}
 if(P.small)g.scale.setScalar(.7);addLegs(g,L);g.userData.tails=[{m:tlg,a:.25,f:3}];stdAnim(g,{fq:8,amp:.5,extra:(t)=>{arms.forEach((a,i)=>a.rotation.z=.3+Math.sin(t*8+i*Math.PI)*.3);head.rotation.z=Math.sin(t*1.3)*.1}});
 return g}
function bRaptor(f){const g=new THREE.Group();const big=f.w==='baojun',skin=M(f.col||'#8a6a3a',{roughness:.6});
 const body=sph(0,.75,.36,.32,14,skin);body.position.y=1.15;g.add(body);
 const neck=cyl(.14,.2,.5,skin,8);neck.position.set(.7,1.35,0);neck.rotation.z=-1;g.add(neck);
 const head=sph(0,big?.42:.3,big?.24:.15,big?.22:.14,12,skin);head.position.set(1.05,1.55,0);g.add(head);
 const jaw=sph(0,big?.32:.22,.06,big?.17:.1,8,M('#5a3a2a'));jaw.position.set(1.1,1.43,0);g.add(jaw);
 if(big)for(let i=0;i<6;i++){const tt=cone(.025,.1,M('#f0e8d0'),4);tt.position.set(.9+i*.08,1.42,(i%2?1:-1)*.12);tt.rotation.x=Math.PI;g.add(tt)}
 for(const z of[-1,1]){const e=sph(0,.04,.04,.04,6,M(big?'#ffcc33':'#151510'));e.position.set(1.2,1.62,z*.12);g.add(e)}
 const tlg=new THREE.Group();tlg.add(tubeAlong([V3(-.6,1.2,0),V3(-1.2,1.2,0),V3(-1.9,1.25,0)],.12,skin,8));g.add(tlg);
 const L=[];for(const z of[-1,1]){const l=leg2(.55,.6,big?.16:.1,skin,.6);l.position.set(-.1,1.05,z*.22);g.add(l);L.push({m:l,ph:z>0?0:Math.PI})}
 if(!big){for(let i=0;i<5;i++){const fe=cone(.04,.25,M('#c8a060'),3);fe.position.set(-.2+i*.15,1.5,0);fe.rotation.z=.6;g.add(fe)}}
 for(const z of[-1,1]){const a=leg2(.25,.2,.04,skin,-1);a.position.set(.55,1.1,z*.2);g.add(a)}
 addLegs(g,L);g.userData.tails=[{m:tlg,a:.2,f:4}];stdAnim(g,{fq:9,amp:.6});return g}
function bSauropod(f){const g=new THREE.Group();const skin=M(f.col||'#7a7a62',{roughness:.75}),pois=f.w==='bosaidong';
 const body=sph(0,1.0,.6,.55,16,skin);body.position.y=1.35;g.add(body);
 const neckPts=[V3(.8,1.6,0),V3(1.4,2.3,0),V3(1.75,3.2,0),V3(1.9,3.9,0)];const ng=new THREE.Group();ng.add(tubeAlong(neckPts,.17,skin,14));
 const head=sph(0,pois?.28:.32,pois?.17:.24,.18,12,skin);head.position.set(2.05,4.0,0);ng.add(head);ng.position.set(0,0,0);g.add(ng);
 for(const z of[-1,1]){const e=sph(0,.04,.04,.04,6,M('#151510'));e.position.set(2.15,4.08,z*.12);ng.add(e)}
 const tlg=new THREE.Group();tlg.add(tubeAlong([V3(-.8,1.4,0),V3(-1.6,1.2,0),V3(-2.4,.9,0),V3(-3.1,.7,0)],.17,skin,14));g.add(tlg);
 const L=[];for(const[x,z]of[[.55,-1],[.55,1],[-.55,-1],[-.55,1]]){const l=limb(1.05,.16,.15,skin);l.position.set(x,1.05,z*.32);g.add(l);L.push({m:l,ph:(x>0?0:Math.PI)+(z>0?Math.PI:0),a:.6})}
 if(f.armor){const pl=new THREE.Mesh(new THREE.BoxGeometry(.9,.12,.9),M('#6a5a40'));pl.position.y=2;g.add(pl)}
 addLegs(g,L);g.userData.tails=[{m:tlg,a:.15,f:1.2}];stdAnim(g,{fq:3.5,amp:.3,extra:(t)=>{ng.rotation.z=Math.sin(t*.5)*.06;ng.rotation.y=Math.sin(t*.37)*.12}});return g}
function bCeratops(f){const g=new THREE.Group();const skin=M(f.col||'#7a6a4a',{roughness:.7}),horn=M('#ece2c8'),black=f.w==='xm_heijiao';if(black)skin.metalness=.4;
 const body=sph(0,.95,.5,.5,16,skin);body.position.y=.9;g.add(body);
 const head=sph(0,.38,.3,.3,12,skin);head.position.set(1.05,.95,0);g.add(head);const beak=cone(.12,.28,M('#3a3020'),5);beak.rotation.z=-Math.PI/2;beak.position.set(1.42,.86,0);g.add(beak);
 const frill=new THREE.Mesh(new THREE.CircleGeometry(.55,18,0,Math.PI),M(f.col||'#7a6a4a',{side:THREE.DoubleSide,roughness:.7}));frill.position.set(.82,1.18,0);frill.rotation.set(0,Math.PI/2,0);frill.rotation.z=.25;g.add(frill);
 const many=f.w==='duoji'||black;
 if(many)for(let i=0;i<7;i++){const a=(i/6)*Math.PI;const sp=cone(.05,.32,horn,4);sp.position.set(.82,1.18+Math.sin(a)*.6,Math.cos(a)*.6);sp.rotation.x=-Math.cos(a)*1.4;sp.rotation.z=.25;g.add(sp)}
 const h1=cone(.06,many?.4:.7,horn,5);h1.position.set(1.3,1.18,0);h1.rotation.z=-.9;g.add(h1);
 if(many)for(const z of[-1,1]){const h=cone(.05,.45,horn,5);h.position.set(1.15,1.25,z*.18);h.rotation.z=-1.1;h.rotation.x=z*.3;g.add(h)}
 for(const z of[-1,1]){const e=sph(0,.04,.04,.04,6,M('#151510'));e.position.set(1.25,1.05,z*.2);g.add(e)}
 const tl=cone(.15,.9,skin,6);tl.rotation.z=Math.PI/2+.15;tl.position.set(-1.25,.85,0);g.add(tl);
 const L=[];for(const[x,z]of[[.5,-1],[.5,1],[-.55,-1],[-.55,1]]){const l=limb(.6,.13,.11,skin);l.position.set(x,.62,z*.34);g.add(l);L.push({m:l,ph:(x>0?0:Math.PI)+(z>0?Math.PI:0),a:.7})}
 if(black){for(let i=0;i<3;i++){const sp=cone(.04,.9,M('#101012'),4);sp.position.set(.3-i*.2,1.6,0);sp.rotation.z=.4;g.add(sp)}}
 addLegs(g,L);stdAnim(g,{fq:6,amp:.4});return g}
function bShellBeast(f){const g=new THREE.Group();const turtle=f.w==='jingzhui';const skin=M(turtle?'#6a7a5a':(f.col||'#6a5a40'));
 const shell=new THREE.Mesh(new THREE.SphereGeometry(1,16,10,0,Math.PI*2,0,Math.PI/2),M(turtle?'#5a6a4a':'#7a6a4a',{roughness:.6}));shell.scale.set(1.1,.7,.9);shell.position.y=.6;g.add(shell);
 if(turtle){const xm=new THREE.MeshStandardMaterial({color:'#bff4ff',emissive:'#3ab0d0',emissiveIntensity:.7,roughness:.1,flatShading:true});for(let i=0;i<9;i++){const c=cone(.09,.7+Math.random()*.5,xm,5);const a=i*2.4,d=.3+(i%3)*.18;c.position.set(Math.cos(a)*d,1.3,Math.sin(a)*d*.8);c.rotation.set(Math.sin(a)*.3,0,-Math.cos(a)*.3);g.add(c)}}
 else{for(let i=0;i<10;i++){const b=new THREE.Mesh(new THREE.BoxGeometry(.06,.35,.3),M('#c8c0a8'));b.position.set(.8-i*.18,1.25,0);b.rotation.x=(i%2-.5)*.2;g.add(b)}}
 const head=sph(0,.25,.2,.2,10,skin);head.position.set(1.15,.6,0);g.add(head);
 const L=[];for(const[x,z]of[[.55,-1],[.55,1],[-.55,-1],[-.55,1]]){const l=limb(.45,.13,.12,skin);l.position.set(x,.5,z*.55);g.add(l);L.push({m:l,ph:(x>0?0:Math.PI)+(z>0?Math.PI:0),a:.5})}
 addLegs(g,L);stdAnim(g,{fq:3,amp:.3});return g}
function bQuadSmall(f){const g=new THREE.Group();const id=f.w;const ape=id==='lanxing',sal=id==='tairong',cloud=id==='yunbuchong';
 const skin=cloud?new THREE.MeshStandardMaterial({color:'#f4f8ff',transparent:true,opacity:.6,roughness:1,emissive:'#d8e8ff',emissiveIntensity:.2}):M(f.col||'#6a8a5a',{roughness:ape?1:.6});
 const body=sph(0,ape?.6:.75,ape?.45:.25,ape?.38:.28,14,skin);body.position.y=ape?.9:.42;if(ape)body.rotation.z=-.4;g.add(body);
 const head=sph(0,ape?.3:.22,ape?.28:.14,ape?.28:.16,12,skin);head.position.set(ape?.55:.85,ape?1.28:.48,0);g.add(head);
 for(const z of[-1,1]){const e=sph(0,.04,.04,.04,6,M(sal?'#e8d040':'#151515'));e.position.set(ape?.78:1.0,ape?1.33:.55,z*(ape?.13:.1));g.add(e)}
 if(ape){const fur=new THREE.Points(new THREE.BufferGeometry().setFromPoints(Array.from({length:160},()=>{const v=V3(Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize();return V3(v.x*.62,v.y*.48+.9,v.z*.4)})),new THREE.PointsMaterial({color:'#7aa8ff',size:.12}));g.add(fur);
  const tl=sph(0,.25,.25,.25,8,skin);tl.position.set(-.7,.9,0);tl.scale.set(.6,.4,.4);g.add(tl)}
 else{const tl=cone(.12,.9,skin,6);tl.rotation.z=Math.PI/2;tl.position.set(-1.05,.42,0);g.add(tl)}
 const L=[];for(const[x,z]of[[.4,-1],[.4,1],[-.4,-1],[-.4,1]]){const l=limb(ape&&x>0?.8:.4,.06,.05,skin);l.position.set(x,ape?.8:.4,z*.22);if(sal)l.rotation.x=z*.7;g.add(l);L.push({m:l,ph:(x>0?0:Math.PI)+(z>0?Math.PI:0),a:.7})}
 addLegs(g,L);stdAnim(g,{fq:sal?6:8,amp:.5});return g}
function bChameleon(f){const g=bQuadSmall(Object.assign({},f,{w:'tairong'}));const m=g.children[0].material.clone();g.traverse(o=>{if(o.isMesh&&o.material&&o.material.color&&o.material.color.getHexString()===C(f.col||'#6a8a5a').getHexString())o.material=m});
 const a0=g.userData.anim;g.userData.anim=(t)=>{a0(t);m.color.setHSL(.3+Math.sin(t*.4)*.08,.4,.32+Math.sin(t*.7)*.05)};return g}

/* ---------------- arthropods ---------------- */
function bScorpion(f){const g=new THREE.Group();const id=f.w,skin=M(f.col||'#a0703e',{roughness:.45,metalness:.1});
 const bus=id==='shenshabus',L=[];const n=bus?7:4;
 for(let i=0;i<n;i++){const s=sph(0,bus?.42:.36,bus?.18:.22,bus?.55:.34,12,skin);s.position.set(.9-i*(bus?.42:.38),.5,0);g.add(s);
  const pl=new THREE.Mesh(new THREE.BoxGeometry(bus?.3:.28,.04,bus?1.0:.6),M('#6a4a2a',{roughness:.4}));pl.position.set(.9-i*(bus?.42:.38),.68,0);g.add(pl)}
 for(let i=0;i<(bus?12:8);i++){const s=i%2?1:-1,k=Math.floor(i/2);const l=leg2(.45,.5,.04,skin,.9);l.position.set(.8-k*(bus?.42:.38),.5,s*(bus?.5:.32));l.rotation.x=s*1.0;g.add(l);L.push({m:l,ph:k*1.1+(s>0?Math.PI:0),a:.5})}
 const head=sph(0,.3,.18,.3,10,skin);head.position.set(1.3,.48,0);g.add(head);
 for(const z of[-1,1]){const arm=leg2(.4,.35,.05,skin,-1.2);arm.position.set(1.3,.5,z*.25);arm.rotation.set(z*.5,0,-1.2);g.add(arm);const cl=sph(0,.2,.09,.12,8,skin);cl.position.set(0,-.35-.4,0);arm.userData.knee.add(cl);
  const pin=cone(.05,.25,skin,4);pin.position.set(.12,-.85,0);pin.rotation.z=-.4;arm.userData.knee.add(pin)}
 const tl=new THREE.Group();if(bus){const pts=[];for(let i=0;i<=40;i++){const a=i/40*6.28*3;pts.push(V3(-i*.025,Math.cos(a)*.15,Math.sin(a)*.15))}tl.add(tubeAlong(pts,.045,skin,80))}
 else{let prev=V3(0,0,0);for(let i=0;i<5;i++){const s=sph(0,.14-i*.012,.14-i*.012,.14-i*.012,8,skin);const a=i*.45;s.position.set(-Math.cos(a)*i*.22,Math.sin(a)*i*.25,0);tl.add(s)}}
 tl.position.set(.9-n*(bus?.42:.38)+.2,.55,0);g.add(tl);
 addLegs(g,L);g.userData.tails=[{m:tl,a:.15,f:2}];stdAnim(g,{fq:10,amp:.4});return g}
function bBeetle(f){const g=new THREE.Group();const id=f.w;const roach=id==='heijiao',saw=id==='liedizhe';
 const skin=M(f.col||'#3a5a3a',{roughness:.25,metalness:roach?.35:.2,emissive:saw?'#5a3a20':'#000000',emissiveIntensity:saw?.25:0});
 const body=sph(0,roach?.9:.72,roach?.25:.4,roach?.5:.5,16,skin);body.position.y=.5;g.add(body);
 const seam=new THREE.Mesh(new THREE.BoxGeometry(roach?1.6:1.2,.02,.02),M('#0e0e0c'));seam.position.y=roach?.75:.9;g.add(seam);
 const head=sph(0,.25,.2,.28,10,skin);head.position.set(roach?.9:.75,.45,0);g.add(head);
 if(roach)for(const z of[-1,1])g.add(tubeAlong([V3(1,.5,z*.1),V3(1.5,.8,z*.4),V3(2.1,.7,z*.7)],.012,M('#2a2018'),10));
 if(saw)for(const z of[-1,1]){const j=new THREE.Group();const blade=new THREE.Mesh(new THREE.BoxGeometry(1.1,.08,.12),M('#5a4030',{metalness:.3}));blade.position.x=.55;j.add(blade);for(let i=0;i<7;i++){const tt=cone(.04,.14,M('#e8dcc0'),3);tt.position.set(.15+i*.14,0,-z*.08);tt.rotation.x=z*Math.PI/2;j.add(tt)}j.position.set(.95,.42,z*.22);j.rotation.y=z*.35;g.add(j);g.userData.jaws=(g.userData.jaws||[]).concat([{m:j,z}])}
 const L=[];for(let i=0;i<6;i++){const s=i%2?1:-1,k=Math.floor(i/2);const l=leg2(.35,.4,.04,M('#1a1a14'),.8);l.position.set(.35-k*.35,.42,s*.4);l.rotation.x=s*1.1;g.add(l);L.push({m:l,ph:k*1.2+(s>0?Math.PI:0),a:.5})}
 addLegs(g,L);stdAnim(g,{fq:11,amp:.45,extra:(t)=>{if(g.userData.jaws)for(const j of g.userData.jaws)j.m.rotation.y=j.z*(.35+Math.sin(t*4)*.25)}});return g}
function bUpright(f){const g=new THREE.Group();const plant=f.w==='rq_gujia';const skin=M(f.col||'#b08a5a',{roughness:.45});
 const torso=sph(0,.32,.7,.3,12,skin);torso.position.y=1.35;g.add(torso);
 if(plant){for(let i=0;i<5;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(.32,.03,4,12,Math.PI),skin);r.position.set(0,1.0+i*.18,0);r.rotation.y=Math.PI/2;g.add(r)}}
 const head=sph(0,.22,.2,.24,10,skin);head.position.set(.15,2.05,0);g.add(head);
 for(const z of[-1,1]){const e=sph(0,.04,.04,.04,6,GL(plant?'#a0ff80':'#ffd040'));e.position.set(.33,2.1,z*.1);g.add(e)}
 const arms=[];for(const z of[-1,1]){const a=leg2(.4,.4,.05,skin,-1.4);a.position.set(.15,1.7,z*.3);g.add(a);const cl=sph(0,.16,.08,.1,8,skin);cl.position.y=-.8;a.userData.knee.add(cl);arms.push(a)}
 if(!plant){const tl=new THREE.Group();for(let i=0;i<5;i++){const s=sph(0,.1,.1,.1,8,skin);s.position.set(-.25-i*.12,1.05+Math.sin(i*.6)*i*.18,0);tl.add(s)}g.add(tl);
  if(f.e&&f.e.includes(3)){const cr=new THREE.Mesh(new THREE.OctahedronGeometry(.16,0),EM('#bff4ff',.6,{roughness:.1}));cr.position.set(.45,1.2,.3);g.add(cr)}}
 const L=[];for(const z of[-1,1]){const l=leg2(.5,.55,.07,skin,.4);l.position.set(0,.95,z*.18);g.add(l);L.push({m:l,ph:z>0?0:Math.PI})}
 for(let i=0;i<4;i++){const s=i%2?1:-1;const l=limb(.4,.03,.02,skin);l.position.set(-.1,.9,s*.25);l.rotation.x=s*1.2;g.add(l)}
 addLegs(g,L);stdAnim(g,{fq:7,amp:.45,extra:(t)=>arms.forEach((a,i)=>a.rotation.z=-.4+Math.sin(t*3+i)*.25)});return g}
function bHunzhi(f){const g=new THREE.Group();const skin=M(f.col||'#6b5a6e',{roughness:.5});g.add(at(sph(0,.7,.35,.35,12,skin),0,.6,0));
 const Rn=rnd(hashStr(f.w)+((Math.random()*999)|0));const L=[];const nl=3+((Rn()*7)|0);
 for(let i=0;i<nl;i++){const kind=Rn();const a=Rn()*6.28;let l;if(kind<.33){l=leg2(.4,.4,.05,skin,.6)}else if(kind<.66){l=new THREE.Group();l.add(tubeAlong([V3(0,0,0),V3(.2,-.3,.1),V3(.1,-.7,.3)],.04,skin,8))}else{l=leg2(.3,.3,.06,skin,-1);const cl=sph(0,.14,.07,.08,6,skin);cl.position.y=-.6;l.userData.knee.add(cl)}
  l.position.set(Math.cos(a)*.4,.5,Math.sin(a)*.3);l.rotation.x=Math.sin(a)*.8;g.add(l);L.push({m:l,ph:Rn()*6})}
 const e=sph(0,.06,.06,.06,6,M('#e8e0a0'));e.position.set(.65,.72,.12);g.add(e);addLegs(g,L);stdAnim(g,{fq:9,amp:.5});return g}

/* ---------------- flyers ---------------- */
function bDragonfly(f){const g=new THREE.Group();const bomb=f.w==='hongzhazhe',bee=f.w==='jufeng';const skin=M(f.col||'#3a6a8a',{roughness:.3,metalness:.25});
 const th=sph(0,.28,.24,.24,12,skin);th.position.set(.3,0,0);g.add(th);
 const hd=sph(0,.2,.2,.24,10,skin);hd.position.set(.6,.02,0);g.add(hd);for(const z of[-1,1]){const e=sph(0,.12,.13,.12,10,M('#101820',{roughness:.05,metalness:.5}));e.position.set(.66,.08,z*.15);g.add(e)}
 const segs=bee?4:8;for(let i=0;i<segs;i++){const s=sph(0,bee?.24:.1,bee?.22:.09,bee?.22:.09,8,bee&&i%2?M('#1a1408'):(bomb&&i>=segs-3?M('#5a6a3a'):skin));s.position.set(-i*(bee?.28:.2)+(bee?-.05:0),0,0);if(bomb&&i>=segs-3)s.scale.multiplyScalar(1.9);g.add(s)}
 if(bomb){const tip=sph(0,.14,.14,.14,8,GL('#ffb050'));tip.position.set(-1.65,0,0);g.add(tip)}
 const wm=new THREE.MeshStandardMaterial({color:bee?'#e8f0ff':'#cfe8ff',transparent:true,opacity:.32,side:THREE.DoubleSide,roughness:.1,metalness:.6,depthWrite:false});
 const W2=[];if(bomb){for(const z of[-1,1]){const s=sph(0,.28,.24,.32,10,TR('#e8fff0',.45,{emissive:'#a0e0c0',emissiveIntensity:.3}));s.position.set(.25,.25,z*.38);g.add(s)}}
 else for(let k=0;k<(bee?1:2);k++)for(const z of[-1,1]){const w=wing(bee?.9:1.3,bee?.45:.32,wm,'insect');w.position.set(.35-k*.22,.15,z*.1);if(z<0)w.scale.z=-1;g.add(w);W2.push({m:w,s:z,a:.6,f:30,ph:k})}
 if(bee)for(const z of[-1,1]){const j=cone(.04,.2,M('#2a1a08'),4);j.position.set(.82,-.06,z*.08);j.rotation.z=-1.8;g.add(j)}
 addWings(g,W2);stdAnim(g,{wf:30,wa:.6});return g}
function bDragon(f){const g=new THREE.Group();const id=f.w;const lightD=id==='guanglong',bat=id==='xm_tiefu';
 const skin=lightD?new THREE.MeshStandardMaterial({color:'#fff4d8',emissive:'#ffd890',emissiveIntensity:.9,transparent:true,opacity:.75,depthWrite:false}):M(f.col||'#6a7a5a',{roughness:bat?.3:.6,metalness:bat?.6:0});
 const body=sph(0,.6,.28,.3,14,skin);g.add(body);
 const neck=tubeAlong([V3(.45,.05,0),V3(.8,.25,0),V3(1.1,.32,0)],.1,skin,10);if(!bat)g.add(neck);
 const head=sph(0,.24,.14,.14,12,skin);head.position.set(bat?.6:1.25,bat?.1:.34,0);g.add(head);
 const jaw=cone(.08,.3,skin,5);jaw.rotation.z=-Math.PI/2;jaw.position.set(bat?.85:1.5,bat?.08:.3,0);g.add(jaw);
 for(const z of[-1,1]){if(!bat){const h=cone(.03,.22,M('#e8e0c8'),4);h.position.set(1.15,.48,z*.08);h.rotation.z=.9;g.add(h)}const e=sph(0,.035,.035,.035,6,GL(lightD?'#ffffff':'#ffe060'));e.position.set(bat?.75:1.36,bat?.16:.4,z*.08);g.add(e)}
 const tlg=new THREE.Group();tlg.add(tubeAlong([V3(-.5,0,0),V3(-1.1,-.05,0),V3(-1.8,.05,0),V3(-2.3,.0,0)],.07,skin,12));const tp=cone(.12,.2,skin,3);tp.position.set(-2.35,0,0);tp.rotation.z=Math.PI/2;tlg.add(tp);if(!bat)g.add(tlg);
 const wm=lightD?new THREE.MeshBasicMaterial({color:'#ffe8b0',transparent:true,opacity:.35,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false}):M(bat?'#5a6068':(f.col2||'#8a7a6a'),{side:THREE.DoubleSide,roughness:.6,metalness:bat?.6:0});
 const W2=[];for(const z of[-1,1]){const w=wing(bat?1.5:1.7,bat?.8:.9,wm,'bat');w.position.set(.1,.1,z*.22);if(z<0)w.scale.z=-1;g.add(w);W2.push({m:w,s:z,a:.6,f:bat?6:3.2})}
 if(f.rider){const r=sph('#2e9a5e',.12,.2,.12,8);r.position.set(.1,.42,0);g.add(r);const rh=sph('#2e9a5e',.1,.09,.09,8);rh.position.set(.18,.66,0);g.add(rh)}
 if(lightD){const gl=glowSprite('#ffe0a0',3.5,.45);g.add(gl)}
 addWings(g,W2);g.userData.tails=[{m:tlg,a:.25,f:2.4}];stdAnim(g,{wf:3.2,wa:.6});return g}
function bPterosaur(f){const g=new THREE.Group();const skin=M(f.col||'#b8643a',{roughness:.6});
 g.add(sph(0,.45,.18,.18,12,skin));const head=sph(0,.2,.12,.1,10,skin);head.position.set(.6,.12,0);g.add(head);
 const beak=cone(.07,.9,M('#d8c090'),5);beak.rotation.z=-Math.PI/2;beak.position.set(1.15,.08,0);g.add(beak);
 const crest=new THREE.Mesh(wingGeo(.5,.4,'fin').rotateX(-Math.PI/2),M('#d83a2a',{side:THREE.DoubleSide}));crest.position.set(.5,.2,0);crest.rotation.z=2.4;g.add(crest);
 const W2=[];for(const z of[-1,1]){const w=wing(2.1,.7,M('#c8845a',{side:THREE.DoubleSide,roughness:.7}),'bat');w.position.set(.15,.05,z*.15);if(z<0)w.scale.z=-1;g.add(w);W2.push({m:w,s:z,a:.45,f:2})}
 addWings(g,W2);stdAnim(g,{wf:2,wa:.45});return g}

/* ---------------- fish & sea folk ---------------- */
function fishGeo(len,r,flat){return sharkGeo(len,r,flat)}
function bFish(f){const g=new THREE.Group();const id=f.w;const glow=f.glow;
 const skin=glow?new THREE.MeshStandardMaterial({color:f.col,emissive:f.col,emissiveIntensity:1.1,roughness:.4}):M(f.col||'#55606a',{roughness:.35,metalness:.2});
 if(id==='jianshi'){const sh=cone(.35,1.6,M('#c9b58f',{roughness:.5}),10);sh.rotation.z=Math.PI/2;sh.position.x=-.4;g.add(sh);for(let i=0;i<10;i++){const a=i/10*6.28;const t=tubeAlong([V3(.4,0,0),V3(.8,Math.cos(a)*.15,Math.sin(a)*.15),V3(1.2,Math.cos(a)*.25,Math.sin(a)*.25)],.025,M('#a89068'),8);g.add(t)}
  for(const z of[-1,1]){const e=sph(0,.06,.06,.06,6,M('#101010'));e.position.set(.42,.12,z*.18);g.add(e)}g.userData.anim=(t)=>{g.children.forEach((c,i)=>{if(i>0&&i<11)c.rotation.x=Math.sin(t*3+i)*.15})};return g}
 if(id==='haigui'){const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(.7,1),M('#5a544c',{roughness:.95}));rock.scale.set(1.1,.7,.9);g.add(rock);const tube=cyl(.08,.1,.9,M('#3a3430'),8);tube.position.set(-.1,.75,0);g.add(tube);
  const flame=cone(.12,.4,GL('#ffb040'),6);flame.position.set(-.1,1.35,0);g.add(flame);const fl=glowSprite('#ff9030',2.6,.75);fl.position.set(-.1,1.35,0);g.add(fl);
  const shell=sph(0,.16,.3,.16,8,TR('#ffffff',.25));shell.position.set(-.1,1.3,0);g.add(shell);g.userData.anim=(t)=>{flame.scale.y=1+Math.sin(t*12)*.2;fl.material.opacity=.6+Math.sin(t*9)*.15};g.userData.swim=1;return g}
 const body=new THREE.Mesh(fishGeo(id==='shanyao'?3.2:2.2,id==='dengshi'?.42:.32,.62),skin);g.add(body);
 if(id==='shanyao')body.scale.set(1,.45,.6);
 if(id==='dengshi'){const plate=new THREE.Mesh(new THREE.SphereGeometry(.45,12,8,0,Math.PI*2,0,Math.PI/1.6),M('#3a4248',{roughness:.3,metalness:.4}));plate.rotation.z=-Math.PI/2.4;plate.position.set(.6,.05,0);plate.scale.set(1,1,.8);g.add(plate);
  const jaw=new THREE.Mesh(new THREE.BoxGeometry(.5,.06,.4),M('#2a2a28'));jaw.position.set(.85,-.18,0);g.add(jaw)}
 if(id==='chongfeng'){const horn=cone(.07,1.1,M('#e8e4d8'),6);horn.rotation.z=-Math.PI/2;horn.position.set(1.6,0,0);g.add(horn)}
 if(id==='rongyanrong'){const back=new THREE.Mesh(new THREE.BoxGeometry(1.4,.06,.18),EM('#ff4a1a',2));back.position.set(0,.2,0);g.add(back);body.material=M('#3a2a24')}
 if(id==='gouchong'){body.scale.set(1,.35,1.4);for(let i=0;i<8;i++)for(const z of[-1,1]){const p=new THREE.Mesh(new THREE.PlaneGeometry(.22,.12),M('#6a7a6a',{side:THREE.DoubleSide}));p.position.set(.6-i*.18,0,z*.45);p.rotation.x=Math.PI/2;g.add(p)}
  for(const z of[-1,1]){const h=tubeAlong([V3(1,0,z*.1),V3(1.35,.05,z*.2),V3(1.5,0,0)],.04,M('#2a2a20'),8);g.add(h)}}
 if(id==='rq_maojing'){const fur=new THREE.Points(new THREE.BufferGeometry().setFromPoints(Array.from({length:220},()=>V3((Math.random()-.5)*1.8,(Math.random()-.5)*.5,(Math.random()-.5)*.5))),new THREE.PointsMaterial({color:'#f4f0e4',size:.09}));g.add(fur)}
 if(id==='shanyao'){g.add(sparkles(Array.from({length:40},(_,i)=>V3(1.4-i*.07,(Math.random()-.5)*.18,(Math.random()-.5)*.18)),'#bfe8ff',.5,1))}
 const dor=new THREE.Mesh(wingGeo(.35,.4,'fin'),skin);dor.rotation.set(-Math.PI/2,0,Math.PI);dor.position.set(.1,.25,0);g.add(dor);
 const tl=new THREE.Group();const tf=new THREE.Mesh(wingGeo(.4,.5,'fin').rotateX(-Math.PI/2),skin);tl.add(tf);const t2=tf.clone();t2.scale.y=-1;tl.add(t2);tl.position.x=-1.05;g.add(tl);
 for(const z of[-1,1]){const fn=new THREE.Mesh(wingGeo(.3,.25,'fin'),skin);fn.position.set(.35,-.1,z*.18);fn.rotation.y=z*-.5;if(z<0)fn.scale.z=-1;g.add(fn);const e=sph(0,.05,.05,.05,6,M('#0a0a0a',{roughness:.1}));e.position.set(.8,.08,z*.14);g.add(e)}
 g.userData.anim=(t)=>{tl.rotation.y=Math.sin(t*5)*.4;body.rotation.y=Math.sin(t*5+.5)*.06};if(!f.sky)g.userData.swim=1;return g}
function bSquid(f){const g=new THREE.Group();const skin=new THREE.MeshStandardMaterial({color:f.col||'#c86a5a',roughness:.4,emissive:'#5a2a8a',emissiveIntensity:.2});
 const mantle=cone(.32,1.4,skin,12);mantle.rotation.z=Math.PI/2;mantle.position.x=-.3;g.add(mantle);
 for(const z of[-1,1]){const fn=new THREE.Mesh(wingGeo(.3,.4,'fin'),skin);fn.position.set(-.85,0,z*.1);if(z<0)fn.scale.z=-1;g.add(fn);const e=sph(0,.09,.09,.09,8,M('#f0f0e0',{roughness:.1}));e.position.set(.45,.12,z*.2);g.add(e)}
 const head=sph(0,.25,.24,.26,10,skin);head.position.x=.45;g.add(head);
 const arms=[];for(let i=0;i<8;i++){const a=i/8*6.28;const ag=new THREE.Group();ag.add(tubeAlong([V3(0,0,0),V3(.3,Math.cos(a)*.08,Math.sin(a)*.08),V3(.7,Math.cos(a)*.18,Math.sin(a)*.18),V3(1.0,Math.cos(a)*.12,Math.sin(a)*.12)],.03,skin,10));ag.position.x=.6;g.add(ag);arms.push(ag)}
 g.userData.anim=(t)=>{arms.forEach((a,i)=>{a.rotation.y=Math.sin(t*2+i)*.25;a.rotation.z=Math.cos(t*1.7+i)*.2});skin.emissive.setHSL((t*.05)%1,.6,.25)};g.userData.swim=1;return g}

/* ---------------- worms: chains of segments driven by the herd path ---------------- */
function bWorm(f){const g=new THREE.Group();g.userData.segs=[];g.userData.free=1;const id=f.w;const n=id==='shawurm'?14:id==='lianyu'?13:12;
 const mats={shawurm:M('#b98b5c',{roughness:.5}),mwrc:M('#7f7a6a'),lianyu:M('#3a2620',{roughness:.9,emissive:'#ff4a10',emissiveIntensity:.35}),bingjing:new THREE.MeshStandardMaterial({color:'#e6fbff',emissive:'#5fd0f0',emissiveIntensity:.5,roughness:.05,transparent:true,opacity:.8,flatShading:true}),
  yanshiguai:M('#7a7068',{roughness:.95,flatShading:true}),pangshou:M('#c8b080',{roughness:.6})};const mm=mats[id]||M(f.col||'#8a7a6a');
 for(let i=0;i<n;i++){const s=new THREE.Group();let core;
  if(id==='bingjing')core=new THREE.Mesh(new THREE.OctahedronGeometry(.7-i*.03,0),mm);
  else if(id==='yanshiguai'){core=new THREE.Mesh(new THREE.DodecahedronGeometry(.68-i*.02,0),mm);if(i>0&&i<n-1)for(const z of[-1,1]){const l=new THREE.Mesh(new THREE.DodecahedronGeometry(.22,0),mm);l.position.set(0,-.3,z*.75);s.add(l);const b=cone(.06,.25,mm,4);b.position.set(.1,-.5,z*.85);s.add(b)}}
  else core=new THREE.Mesh(sgeo(12),mm),core.scale.setScalar(.7-i*.035);
  s.add(core);
  if((id==='shawurm'||id==='pangshou')&&i>0){const ring=new THREE.Mesh(new THREE.TorusGeometry(.66-i*.033,.07,5,14),M(id==='pangshou'?'#a89060':'#8a6a44',{roughness:.4}));ring.rotation.y=Math.PI/2;s.add(ring)}
  if(i===0){if(id==='shawurm'||id==='mwrc'){for(let k=0;k<10;k++){const a=k/10*6.28;const tt=cone(.06,.3,M('#efe6d0'),4);tt.position.set(.45,Math.cos(a)*.42,Math.sin(a)*.42);tt.rotation.set(0,0,-Math.PI/2);tt.rotateX(a);s.add(tt)}const mouth=new THREE.Mesh(new THREE.CircleGeometry(.4,14),M('#2a1010'));mouth.rotation.y=Math.PI/2;mouth.position.x=.62;s.add(mouth)}
   if(id==='lianyu'){const m=sph(0,.3,.3,.3,10,GL('#ffb040'));m.position.x=.55;s.add(m)}}
  g.add(s);g.userData.segs.push(s)}
 return g}
function bWheel(f){const g=new THREE.Group();const skin=M(f.col||'#6a4a2a',{roughness:.45});const w=new THREE.Group();
 for(let i=0;i<14;i++){const a=i/14*6.28;const s=sph(0,.18,.16,.28,8,skin);s.position.set(Math.cos(a)*.75,Math.sin(a)*.75,0);s.rotation.z=a;w.add(s);const sp=cone(.05,.22,M('#d8c8a0'),4);sp.position.set(Math.cos(a)*.98,Math.sin(a)*.98,0);sp.rotation.z=a-Math.PI/2;w.add(sp)}
 w.position.y=.95;g.add(w);g.userData.anim=(t)=>{w.rotation.z=-t*6};return g}

/* ---------------- odd folk ---------------- */
function bGolem(f){const g=new THREE.Group();const id=f.w;
 if(id==='laoshu'){const bark=M('#5a4632',{roughness:.9});g.add(at(cyl(.18,.3,1.6,bark,7),0,1.4,0));for(let i=0;i<5;i++){const c=sph(0,.55,.4,.55,10,M('#4a7a3a'));c.position.set((Math.random()-.5)*.6,2.3+Math.random()*.5,(Math.random()-.5)*.6);g.add(c)}
  const L=[];for(let i=0;i<4;i++){const a=i/4*6.28+.4;const l=leg2(.45,.5,.06,bark,.9);l.position.set(Math.cos(a)*.15,.85,Math.sin(a)*.15);l.rotation.x=Math.sin(a)*.8;l.rotation.z=-Math.cos(a)*.8;g.add(l);L.push({m:l,ph:i*1.6,a:.4})}addLegs(g,L);stdAnim(g,{fq:3,amp:.3});return g}
 if(id==='chenmo'){const body=sph(0,.5,.8,.45,12,new THREE.MeshStandardMaterial({color:'#c8a060',transparent:true,opacity:.55,roughness:1,depthWrite:false}));body.position.y=1.1;g.add(body);
  const d=emitter({n:90,life:2,speed:.6,spread:1.4,size:1.3,dir:[-.6,.3,0],col:'#d8b070',op:.35,add:false,tex:smokeTex,area:[.8,1.4,.8]});d.position.y=1;g.add(d);
  for(const z of[-1,1]){const e=sph(0,.06,.06,.06,6,GL('#ffd080'));e.position.set(.38,1.55,z*.15);g.add(e)}g.userData.anim=(t)=>{body.scale.set(.5+Math.sin(t*3)*.05,.8,.45)};return g}
 if(id==='zhenjunguai'){const skin=M('#c9b8d6',{roughness:.85});const body=sph(0,.55,.75,.5,12,skin);body.position.y=1.35;g.add(body);
  for(let i=0;i<6;i++){const cap=new THREE.Mesh(new THREE.SphereGeometry(.22,8,5,0,Math.PI*2,0,Math.PI/2),M(i%2?'#efe6f6':'#a87ab8'));cap.position.set(-.2+Math.random()*.3,1.6+Math.random()*.5,(Math.random()-.5)*.6);cap.rotation.z=(Math.random()-.5)*.8;g.add(cap)}
  const arms=[];for(const z of[-1,1]){const a=leg2(.55,.55,.12,skin,-.6);a.position.set(.2,1.8,z*.5);g.add(a);arms.push(a)}
  const L=[];for(const z of[-1,1]){const l=leg2(.45,.45,.14,skin,.3);l.position.set(0,.9,z*.25);g.add(l);L.push({m:l,ph:z>0?0:Math.PI})}addLegs(g,L);
  stdAnim(g,{fq:4,amp:.35,extra:t=>arms.forEach((a,i)=>a.rotation.z=.4+Math.sin(t*2+i*2)*.6)});return g}
 // 僵怪 and default: tall smooth figure with frog feet and no face
 const skin=M(f.col||'#8a9090',{roughness:.55});const body=new THREE.Mesh(THREE.CapsuleGeometry?new THREE.CapsuleGeometry(.3,1.1,6,12):sgeo(14),skin);if(!THREE.CapsuleGeometry)body.scale.set(.32,.85,.3);body.position.y=1.9;g.add(body);
 const head=sph(0,.25,.28,.25,12,skin);head.position.y=2.85;g.add(head);
 const L=[];for(const z of[-1,1]){const l=leg2(.6,.65,.09,skin,.3);l.position.set(0,1.35,z*.18);g.add(l);L.push({m:l,ph:z>0?0:Math.PI,a:.6});const ft=sph(0,.35,.06,.22,8,skin);ft.position.set(.15,-.68,0);l.userData.knee.add(ft)}
 const arms=[];for(const z of[-1,1]){const a=limb(1.2,.06,.04,skin);a.position.set(0,2.3,z*.35);g.add(a);arms.push(a)}
 addLegs(g,L);stdAnim(g,{fq:2.6,amp:.4,extra:t=>arms.forEach((a,i)=>a.rotation.z=Math.sin(t*2.6+i*Math.PI)*.35)});return g}
function bRaft(f){const g=new THREE.Group();const shell=M('#5a6a5a',{roughness:.5}),L=[];
 for(let i=0;i<16;i++){const x=(i%4-1.5)*1.05,z=(Math.floor(i/4)-1.5)*1.05;const s=sph(0,.5,.22,.5,10,shell);s.position.set(x,.1,z);g.add(s);
  for(const zz of[-1,1]){const l=limb(.3,.03,.02,M('#2a3020'));l.position.set(x,0,z+zz*.4);l.rotation.x=zz*1.3;g.add(l);L.push({m:l,ph:i+(zz>0?Math.PI:0),a:.6})}}
 for(let i=0;i<5;i++){const t=cone(.25,.7,M('#3a6a3a'),5);t.position.set((Math.random()-.5)*3,.6,(Math.random()-.5)*3);g.add(t)}
 for(let i=0;i<4;i++){const c=sph(['#7a6a4a','#9a958a','#2c9a5c'][i%3],.15,.2,.12,8);c.position.set((Math.random()-.5)*2.4,.42,(Math.random()-.5)*2.4);g.add(c)}
 addLegs(g,L);stdAnim(g,{fq:4,amp:.5});g.userData.swim=1;return g}
function bFungalDragon(f){const g=new THREE.Group();const skin=M(f.col||'#8a7a8a',{roughness:.85});const body=sph(0,1.4,.65,.65,16,skin);body.position.y=1.5;g.add(body);
 const neck=tubeAlong([V3(1.2,1.6,0),V3(1.8,2.0,0),V3(2.1,2.1,0)],.25,skin,10);g.add(neck);const stump=sph(0,.3,.3,.3,10,M('#6a3a5a',{emissive:'#a02a6a',emissiveIntensity:.3}));stump.position.set(2.15,2.1,0);g.add(stump);
 for(let i=0;i<22;i++){const cap=new THREE.Mesh(new THREE.SphereGeometry(.18+Math.random()*.15,8,5,0,Math.PI*2,0,Math.PI/2),M(['#efe6f6','#c8a0d8','#a87ab8'][i%3]));const a=Math.random()*6.28;cap.position.set((Math.random()-.5)*2.4,1.8+Math.sin(a)*.5,Math.cos(a)*.6);g.add(cap)}
 const sp=emitter({n:80,life:4,speed:.3,spread:1.5,size:1.4,dir:[0,1,0],col:'#d8b8f0',op:.5,area:[2.4,.6,1.2]});sp.position.y=2;g.add(sp);
 const L=[];for(const[x,z]of[[.8,-1],[.8,1],[-.8,-1],[-.8,1]]){const l=limb(1.1,.22,.2,skin);l.position.set(x,1.1,z*.45);g.add(l);L.push({m:l,ph:(x>0?0:Math.PI)+(z>0?Math.PI:0),a:.4})}
 const tlg=new THREE.Group();tlg.add(tubeAlong([V3(-1.2,1.5,0),V3(-2,1.2,0),V3(-2.8,.9,0)],.2,skin,10));g.add(tlg);addLegs(g,L);g.userData.tails=[{m:tlg,a:.15,f:1}];stdAnim(g,{fq:2.5,amp:.3});return g}
function bLandShip(f){const g=new THREE.Group();const id=f.w;const silver=M(f.col||'#dfe7ec',{roughness:.22,metalness:.85});
 if(id==='xm_train'){const b=new THREE.Mesh(sharkGeo(3.4,.32,1),silver);b.scale.set(1,.7,1);g.add(b);const st=new THREE.Mesh(new THREE.BoxGeometry(3,.04,.02),GL('#9ad8ff'));st.position.set(0,.05,.31);g.add(st);const st2=st.clone();st2.position.z=-.31;g.add(st2);return g}
 if(id==='ex_fleet'){const h=new THREE.Mesh(sharkGeo(2.6,.3,.6),silver);g.add(h);for(const z of[-1,1]){const w=new THREE.Mesh(wingGeo(.8,.6,'fin'),silver);w.position.set(-.2,0,z*.2);if(z<0)w.scale.z=-1;g.add(w)}const e=sph(0,.12,.12,.12,8,GL('#9ad8ff'));e.position.x=-1.3;g.add(e);g.add(at(glowSprite('#8ad0ff',1.2,.6),-1.4,0,0));return g}
 const hull=new THREE.Mesh(new THREE.BoxGeometry(2.4,.45,.8),silver);hull.position.y=.4;g.add(hull);
 const ram=cone(.28,.9,silver,4);ram.rotation.z=-Math.PI/2;ram.position.set(1.6,.35,0);g.add(ram);
 const deck=new THREE.Mesh(new THREE.BoxGeometry(1,.4,.6),silver);deck.position.set(-.4,.82,0);g.add(deck);
 for(let i=0;i<5;i++){const sh=new THREE.Mesh(new THREE.BoxGeometry(.25,.25,.05),M('#c8d4dc',{metalness:.8,roughness:.2}));sh.position.set(.8-i*.4,.55,.42);g.add(sh);const s2=sh.clone();s2.position.z=-.42;g.add(s2)}
 const L=[];for(let i=0;i<8;i++){const s=i%2?1:-1,k=Math.floor(i/2);const l=leg2(.3,.3,.04,silver,.8);l.position.set(.8-k*.5,.25,s*.38);l.rotation.x=s*.9;g.add(l);L.push({m:l,ph:k+(s>0?Math.PI:0),a:.4})}
 // crew in silver on deck, a ballista at the bow, a banner at the stern
 const crew=[];const SV=M('#e8eef2',{metalness:.9,roughness:.2});for(let i=0;i<4;i++){const c=new THREE.Group();const b=cyl(.07,.09,.3,SV,6);b.position.y=.15;c.add(b);const h=sph(0,.08,.07,.07,8,SV);h.position.set(.04,.36,0);c.add(h);const ln=sph(0,.03,.025,.06,6,M('#0a0c10',{metalness:.9,roughness:.1}));ln.position.set(.1,.37,0);c.add(ln);
  c.position.set(i<2?.55-i*.3:-.1-(i-2)*.55,.63+(i>=2?.0:0),(i%2?.22:-.22));if(i===3)c.position.set(-.4,1.02,0);g.add(c);crew.push(c)}
 const bal=new THREE.Group();bal.position.set(1.0,.66,0);g.add(bal);const bb=new THREE.Mesh(new THREE.BoxGeometry(.5,.06,.06),M('#6a5a4a'));bb.position.x=.15;bal.add(bb);const arm=new THREE.Mesh(new THREE.BoxGeometry(.06,.04,.6),M('#5a4a3a'));arm.position.x=.3;bal.add(arm);
 const pole=cyl(.015,.015,.8,M('#c8d0d8'),4);pole.position.set(-.85,1.0,0);g.add(pole);const flag=new THREE.Mesh(new THREE.PlaneGeometry(.4,.22,6,1),M('#3a5aa8',{side:THREE.DoubleSide}));flag.position.set(-1.05,1.28,0);g.add(flag);const fp=flag.geometry.attributes.position,fx=Float32Array.from(fp.array);
 addLegs(g,L);stdAnim(g,{fq:6,amp:.4});g.userData.swim=1;const a0=g.userData.anim;g.userData.anim=t=>{a0&&a0(t);bal.rotation.y=Math.sin(t*.3)*.5;crew.forEach((c,i)=>{c.rotation.y=Math.sin(t*.5+i*1.7)*.8});for(let i=0;i<fp.count;i++){const x=fx[i*3];fp.array[i*3+2]=Math.sin(t*6-x*12)*.12*(.2-x)}fp.needsUpdate=true};return g}
function bSaucer(f){const g=new THREE.Group();const met=M('#d4dde3',{roughness:.2,metalness:.9});const d=sph(0,1.6,.28,1.6,24,met);g.add(d);
 const dome=new THREE.Mesh(new THREE.SphereGeometry(.55,16,8,0,Math.PI*2,0,Math.PI/2),TR('#a8e8ff',.6,{emissive:'#3ab0d0',emissiveIntensity:.5}));dome.position.y=.18;g.add(dome);
 const lights=new THREE.Group();for(let i=0;i<10;i++){const a=i/10*6.28;const l=sph(0,.07,.07,.07,6,GL(i%2?'#ff5a5a':'#ffe0a0'));l.position.set(Math.cos(a)*1.45,0,Math.sin(a)*1.45);lights.add(l)}g.add(lights);
 const beam=new THREE.Mesh(new THREE.CylinderGeometry(.1,.8,3,12,1,true),new THREE.MeshBasicMaterial({color:'#cfe6ff',transparent:true,opacity:.12,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));beam.position.y=-1.6;g.add(beam);
 g.userData.anim=(t)=>{lights.rotation.y=t*1.5;beam.material.opacity=.08+Math.sin(t*2)*.05};return g}
function bArk(f){const g=new THREE.Group();const skin=M(f.col||'#6a7a7a',{roughness:.6});const body=new THREE.Mesh(sharkGeo(4.6,.7,.95),skin);g.add(body);
 for(let i=0;i<3;i++){const deck=new THREE.Mesh(new THREE.BoxGeometry(2.4-i*.6,.12,1.0-i*.2),M('#5a5048'));deck.position.set(-.1,.55+i*.18,0);g.add(deck)}
 for(let i=0;i<6;i++){const hill=cone(.25,.4,M('#7a6a58',{flatShading:true}),5);hill.position.set(1-i*.4,.95,(i%2-.5)*.4);g.add(hill)}
 for(let i=0;i<12;i++){const w=sph(0,.04,.04,.04,6,GL('#ffd090'));w.position.set(1.4-i*.25,.2,.62*(i%2?1:-1));g.add(w)}
 const pl=new THREE.PointLight(0xffc080,.6,40);pl.position.y=1;g.add(pl);g.userData.swim=1;return g}
function bCube(f){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),M('#121418',{metalness:.7,roughness:.3}));g.add(b);
 g.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.01,1.01,1.01)),new THREE.LineBasicMaterial({color:0x6ad8ff,transparent:true,opacity:.9})));
 for(let i=0;i<16;i++){const p=new THREE.Mesh(new THREE.PlaneGeometry(.12,.12),GL(i%3?'#5ac8ff':'#ff5a5a',.8));const f2=i%6;p.position.set([.505,-.505,0,0,0,0][f2]||(Math.random()-.5)*.8,[0,0,.505,-.505,0,0][f2]||(Math.random()-.5)*.8,[0,0,0,0,.505,-.505][f2]||(Math.random()-.5)*.8);
  if(f2<2)p.rotation.y=Math.PI/2;else if(f2<4)p.rotation.x=Math.PI/2;g.add(p)}
 g.userData.anim=(t)=>{g.children[0].rotation.y=0};g.userData.spin=1;return g}
function bBurner(f){const g=new THREE.Group();const em=new THREE.MeshStandardMaterial({color:'#3a2a24',emissive:f.col||'#ff7a3a',emissiveIntensity:.6,roughness:.7,flatShading:true});
 const b=cone(.7,3,em,8);b.rotation.x=Math.PI;b.position.y=1.5;g.add(b);const hd=sph(0,.75,.75,.75,14,em);hd.position.y=3.3;g.add(hd);
 for(let i=0;i<3;i++){const h=sph(0,.17,.17,.17,8,M('#060302'));h.position.set(.63,3.45+(i===2?-.34:0),i===2?0:(i-.5)*.56);g.add(h)}
 const fl=emitter({n:90,life:1.6,speed:1.2,spread:.6,size:2.2,dir:[0,-1,0],col:'#ffb050',col2:'#ff3010',op:.8,area:[.6,.3,.6]});g.add(fl);
 g.add(at(glowSprite('#ff6a2a',6,.4),0,1.5,0));g.userData.anim=(t)=>{hd.rotation.y=Math.sin(t*.4)*.3};return g}
function bSwarm(f){const n=f.w==='huangchong'?260:f.w==='hongshidie'?140:180,g=new THREE.BufferGeometry(),a=new Float32Array(n*3);g.setAttribute('position',new THREE.BufferAttribute(a,3));
 const glowy=f.w==='hongshidie'||f.w==='kuangfeng';const p=new THREE.Points(g,new THREE.PointsMaterial({map:dotTex,color:f.col,size:f.alt?(glowy?1.8:1.3):.9,transparent:true,depthWrite:false,blending:glowy?THREE.AdditiveBlending:THREE.NormalBlending,opacity:glowy?1:.9}));
 p.userData.swarm=a;p.userData.free=1;return p}
function bMaoyu(f){const n=50;const geo=mergeColored([[new THREE.IcosahedronGeometry(.5,1),'#ffffff'],[tg(new THREE.ConeGeometry(.12,.25,4),{p:[.05,.48,.2]}),'#f4f0ea'],[tg(new THREE.ConeGeometry(.12,.25,4),{p:[.05,.48,-.2]}),'#f4f0ea'],[tg(new THREE.SphereGeometry(.07,6,4),{p:[.42,.12,.15]}),'#1a1a1a'],[tg(new THREE.SphereGeometry(.07,6,4),{p:[.42,.12,-.15]}),'#1a1a1a']]);
 const g=new THREE.InstancedMesh(geo,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,flatShading:true}),n);g.userData.maoyu=n;g.userData.free=1;return g}
function bIsland(f){return bRaft(f)}
const SPEC={lvtan_beast:fxA_leviathan,xm_silver:fxB_xmsilver,ex_jiaojing:fxB_jiaojing,behemoth:bBehemoth2,tianjing:bSkyWhale,xm_huanwu:q4b_fogShark,
 kongshuimu:fxA_airJelly,haikong:q5m_jelly,daqi:q4b_daqi,rongqiu_form:bFluff,rq_piaoliu:bFluff,naodai:bMaya,zaonao:fxB_zaonao,
 gulong:fxA_gulong,baihai:fxB_baihai,emerald:(f)=>f.kind==='flyer'?bDragon(Object.assign({},f,{col:'#4f9a6a',rider:1})):bDragonkin(f),rq_xuewu:fxB_xuewu,ex_baixing:fxB_baixing,zhuru:f=>fxB_zhuru(f),dianzhuru:fxA_dianzhuru,huojilong:bDragonkin2,banyu:fxA_banyu,
 sulong:bRaptor2,baojun:bRaptor2,yuandinglong:bSauropod2,bosaidong:fxA_bosaidong,jiaolong:fxA_jiaolong,duoji:bCeratops2,xm_heijiao:fxA_kentao,
 jingzhui:fxA_jingzhui,dachuolong:fxB_dachuolong,tairong:q5m_quad,lanxing:fxA_lanxing,yunbuchong:fxA_yunbu,cishazhe:fxA_cishazhe,
 shaxie:q5m_scorpion,shenshabus:fxA_shenshabus,heijiao:q5m_beetle,liedizhe:q5m_beetle,shitaijia:q4b_mossBeetle,lixie:q5m_upright,rq_gujia:fxB_gujia,rq_hunzhi:fxB_hunzhi,
 jumai:q5m_dragonfly,hongzhazhe:q5m_dragonfly,jufeng:q5m_dragonfly,feilong:fxA_wyvern,yalong:fxA_wyvern,guanglong:q4b_guanglong,xm_tiefu:bDragon,ex_hero:fxB_hero,yilong:fxA_yilong,
 julunchong:q5m_wheel,laoshu:fxA_laoshu,chenmo:fxB_chenmo,zhenjunguai:fxA_zhenjun,jiangguai:fxB_jiangguai,changyou:fxA_changyou,wenyizhishou:bFungalDragon,
 yinjia:(f)=>f.kind==='ship'?bLandShip(f):bDragonkin(f),xm_train:q4b_train,ex_fleet:bLandShip,xumin:bSaucer,fangzhou:q4a_bArk,xm_cube:bCube,rq_ranjin:q4b_burner,
 bingjing:fxA_bingjing,
 mwrc:fxA_mistWorm,
 shawurm:fxA_mistWorm,
 lianyu:fxA_lavaWorm,
 guyou:fxA_guyou,
 jianshi:fxA_jianshi,
 sanyechong:fxA_sanye,
 rongyanrong:fxB_rongyanrong,
 ex_birds:fxB_bird,
 gouchong:fxB_gouchong};
const KIND={jelly:q5m_jelly,leviathan:bLeviathan2,behemoth:bBehemoth2,fluff:bFluff,brain:bBrain,worm:bWorm,swarm:q5m_swarm,flyer:bDragon,fish:q5m_fish,squid:q5m_squid,arthro:q5m_scorpion,
 quad:(f)=>f.horn?bCeratops(f):f.biped?bDragonkin(f):f.big?bSauropod(f):f.shell?bShellBeast(f):bQuadSmall(f),maoyu:bMaoyu,island:bRaft,dragon:bFungalDragon,ship:bLandShip,golem:bGolem,ufo:bSaucer,ark:q4a_bArk,cube:bCube,burner:bBurner};
function buildCreature(f){const fn=SPEC[f.w]||KIND[f.kind];if(!fn)return null;if(f.kind==='worm'&&!SPEC[f.w])return bWorm(f);if(f.kind==='swarm')return bSwarm(f);if(f.kind==='fish'&&!SPEC[f.w])return bFish(f);if(f.kind==='squid')return bSquid(f);return fn(f)}

/* ---------------- herds ---------------- */
const NOCARRY=new Set(['xumin','ev_xumin','creator2','tianchuan']);
function makeHerds(list,sp){const hs=[];list.forEach((f,fi)=>{if(f.kind==='none')return;const L=[];for(let i=0;i<f.n;i++){const o=buildCreature(f);if(!o)return;if(f.w)o.userData.pick=f.w;if(f.swim)o.userData.swim=1;if(!o.userData.free&&!f.swim&&!(f.alt>1.5)&&!/jelly|flyer|burner|fish|squid|swarm|fluff/.test(f.kind||'')&&!o.userData.segs&&!o.userData.noShadow){const bb=new THREE.Box3().setFromObject(o);if(!bb.isEmpty()&&bb.min.y>-.5&&bb.min.y<1.2)o.add(shadow(Math.max(.4,Math.max(bb.max.x-bb.min.x,bb.max.z-bb.min.z)*.42)))}if(!o.userData.free){skinify(o);bake(o)}if(!o.userData.free)o.scale.multiplyScalar(f.s*2.2);o.userData.wid=f.w;sp.scene.add(o);
  L.push({o,ph:i*2.1+fi,sp:(.035+((fi*7+i)%5)*.011)*(f.kind==='flyer'||f.kind==='jelly'?1.5:1)})}
 if(!L.length)return;const h={f,list:L};hs.push(h)});return hs}
function herdVisible(sp,h,e){const fe=h.f.e;if(fe.includes(e)||(e===13&&fe.includes(12)))return true;return sp.id==='rongqiu'&&e>=6&&fe.includes(5)&&!fe.some(z=>z>=6)&&!NOCARRY.has(h.f.w)}
const tmpO=new THREE.Object3D(),pA=V3(),pB=V3(),m4=new THREE.Matrix4();
function routeAt(f,u){let R0=f._rc;if(!R0){const r=f.route;let L=0;const c=[0];for(let i=0;i<r.length;i++){const a=r[i],b=r[(i+1)%r.length];L+=Math.hypot(b[0]-a[0],(b[1]-a[1])*Math.cos((a[0]+b[0])*.5*D2R));c.push(L)}R0=f._rc={c,L}}
 const d=(((u%1)+1)%1)*R0.L;let i=0;while(i<f.route.length-1&&R0.c[i+1]<d)i++;const a=f.route[i],b=f.route[(i+1)%f.route.length];const k=(d-R0.c[i])/Math.max(1e-6,R0.c[i+1]-R0.c[i]);
 const q=k*k*(3-2*k)*.5+k*.5;return[a[0]+(b[0]-a[0])*q,a[1]+(b[1]-a[1])*q]}
const GRAZE=/quad|biped|kin|ceratops|sauropod|raptor/;
function herdPos(f,x,t){if(f.route){const [la,lo]=routeAt(f,t*(f.rsp||.004)+x.ph*.004);const s=f.spread||.5;return[la+Math.sin(x.ph*3.1+t*.2)*s,lo+Math.cos(x.ph*1.7+t*.17)*s/Math.cos(la*D2R)]}
 if(!f.track&&!f.alt&&GRAZE.test(f.kind))t=t+2.6*Math.sin(.38*t+x.ph);// stop to forage, then move on
 const a=t*x.sp+x.ph;const wob=f.track?0:Math.sin(a*2.3+x.ph)*f.rad*.15;return[f.at[0]+f.rad*Math.cos(a)*.7+wob,f.at[1]+(f.rad*Math.sin(a))/Math.cos(f.at[0]*D2R)]}
let maoyuSink=0,maoyuHover=false;
function updateHerds(sp,t){const ghf=sp.gh;for(const h of sp.herds){const f=h.f;if(!h.list.length||h.eraVis===false)continue;
 // herds far from the camera are neither moved nor drawn
 const c0=h.c0||(h.c0=dirLL(f.at[0],f.at[1]).multiplyScalar(R));const near=camera.position.distanceTo(c0)<1500+f.rad*40;if(h.near!==near){h.near=near;h.list.forEach(x=>x.o.visible=near)}if(!near)continue;
 for(const x of h.list){const o=x.o;const [la,lo]=herdPos(f,x,t);const [la2,lo2]=herdPos(f,x,t+.4);
  const swim=o.userData.swim;const base=swim?0:ghf(la,lo);const alt=f.alt+(swim?0.3:0)+(f.kind==='jelly'||f.kind==='burner'?Math.sin(t*1.3+x.ph)*2:0);
  dirLL(la,lo,pA).multiplyScalar(R+Math.max(base,0)+alt);dirLL(la2,lo2,pB).multiplyScalar(R+Math.max(swim?0:ghf(la2,lo2),0)+alt);
  if(o.userData.segs){/* each segment follows the head's path a body-length behind the one before it, however fast the herd moves */const dts=clamp(f.s*1.9/Math.max(pA.distanceTo(pB)/.4,.01),.08,8);o.userData.segs.forEach((s,i)=>{const [a,b]=herdPos(f,x,t-i*dts);const [a2,b2]=herdPos(f,x,t-i*dts+.05);const d=dirLL(a,b);const g=ghf(a,b);
    s.position.copy(d).multiplyScalar(R+Math.max(g,0)+f.alt+Math.sin(t*3-i*.6)*f.s*.7-f.s*.25);s.scale.setScalar(f.s*1.8);
    const d2=dirLL(a2,b2).multiplyScalar(R+Math.max(ghf(a2,b2),0));const fw=d2.sub(s.position).normalize();const u=d.clone();const sd=fw.clone().cross(u).normalize();const u2=sd.clone().cross(fw);m4.makeBasis(fw,u2,sd);s.quaternion.setFromRotationMatrix(m4)});continue}
  if(o.userData.swarm){const a=o.userData.swarm;tmpO.position.set(0,0,0);dirLL(la,lo,up_);const nr=V3(0,1,0).addScaledVector(up_,-up_.y).normalize();const ea=nr.clone().cross(up_);
   for(let i=0;i<a.length/3;i++){const r=f.s*12*Math.sqrt(((i*37)%100)/100),an=i*2.4+t*(f.alt?1.2:.3);const ox=Math.cos(an)*r,oz=Math.sin(an)*r,oy=(f.alt?Math.sin(i+t*2)*3:0)+.4;
    a[i*3]=pA.x+ea.x*ox+nr.x*oz+up_.x*oy;a[i*3+1]=pA.y+ea.y*ox+nr.y*oz+up_.y*oy;a[i*3+2]=pA.z+ea.z*ox+nr.z*oz+up_.z*oy}o.geometry.attributes.position.needsUpdate=true;o.geometry.computeBoundingSphere();continue}
  if(o.userData.maoyu){const n=o.userData.maoyu;for(let i=0;i<n;i++){const a2=i*2.4,r=Math.sqrt(i/n)*1.1;const ml=f.at[0]+Math.cos(a2)*r,mo=f.at[1]+Math.sin(a2)*r;frameLL(sp,ml,mo,.4+Math.abs(Math.sin(t*5+i))*.4*(1-maoyuSink)-maoyuSink*1.2,i,tmpO);tmpO.scale.setScalar(1-maoyuSink*.7);tmpO.updateMatrix();o.setMatrixAt(i,tmpO.matrix)}o.instanceMatrix.needsUpdate=true;continue}
  o.position.copy(pA);const up2=pA.clone().normalize(),fwd=pB.clone().sub(pA);fwd.addScaledVector(up2,-fwd.dot(up2));if(fwd.lengthSq()<1e-6){fwd.copy(o.userData._lf||V3(1,0,0));fwd.addScaledVector(up2,-fwd.dot(up2))}fwd.normalize();o.userData._lf=(o.userData._lf||V3()).copy(fwd);const side=fwd.clone().cross(up2);m4.makeBasis(fwd,up2,side);o.quaternion.setFromRotationMatrix(m4);
  if(o.userData.spin)o.rotateY(t*.3+x.ph);if(o.userData.anim)o.userData.anim((!f.route&&!f.track&&!f.alt&&GRAZE.test(f.kind)?t+2.6*Math.sin(.38*t+x.ph):t)+x.ph)}}}
const up_=V3();
