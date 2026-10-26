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

function sharkGeo(len,r,flat){const prof=[];for(let i=0;i<=18;i++){const t=i/18;const rr=Math.sin(Math.PI*Math.pow(t,.78))*r*(1-.42*t);prof.push(new THREE.Vector2(Math.max(.004,rr),(.5-t)*len))}
 const geo=new THREE.LatheGeometry(prof,20);geo.rotateZ(-Math.PI/2);geo.scale(1,1,flat||.82);return geo}
function bSkyWhale(f){const g=new THREE.Group();const m=new THREE.MeshStandardMaterial({color:f.col||'#eaf4ff',transparent:true,opacity:.42,roughness:.9,emissive:'#bcd8ff',emissiveIntensity:.15,depthWrite:false});
 g.add(new THREE.Mesh(sharkGeo(3.4,.6,.9),m));const gut=sph(0,.9,.25,.25,12,TR('#ffc8b0',.35));gut.position.x=.1;g.add(gut);
 const fins=[];for(const z of[-1,1]){const fn=wing(1.1,.6,new THREE.MeshStandardMaterial({color:'#f4f9ff',transparent:true,opacity:.35,side:THREE.DoubleSide,depthWrite:false}),'fin');fn.position.set(.5,-.1,z*.5);if(z<0)fn.scale.z=-1;g.add(fn);fins.push({m:fn,s:z,a:.3,f:1})}
 addWings(g,fins);const tl=new THREE.Group();const tf=new THREE.Mesh(new THREE.PlaneGeometry(.9,.9),new THREE.MeshStandardMaterial({color:'#f4f9ff',transparent:true,opacity:.35,side:THREE.DoubleSide,depthWrite:false}));tf.rotation.x=Math.PI/2;tl.add(tf);tl.position.x=-1.9;g.add(tl);
 const mist=emitter({n:50,life:4,speed:.3,spread:1.2,size:3,dir:[1,0,0],col:'#ffffff',op:.2,add:false,tex:smokeTex,area:[.3,.3,.3]});mist.position.x=1.7;g.add(mist);
 g.userData.anim=(t)=>{tl.rotation.z=Math.sin(t*1.2)*.35;for(const fn of fins)fn.m.rotation.x=fn.s*Math.sin(t)*.3};return g}
function bJellyPlain(f){const g=new THREE.Group();const big=f.w==='haikong',slime=f.w==='daqi';
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
function bBrainPlain(f){const g=new THREE.Group();_brain=_brain||brainGeo();const yellow=f.w==='zaonao';
 const b=new THREE.Mesh(_brain,yellow?M('#d8b850',{roughness:.6}):new THREE.MeshStandardMaterial({vertexColors:true,roughness:.55,emissive:'#401018',emissiveIntensity:.2}));
 const holder=new THREE.Group();holder.position.y=yellow?1.3:.95;holder.add(b);if(yellow){b.scale.set(1.3,.9,1.1)}g.add(holder);
 const eye=sph(0,.26,.26,.26,12,M('#ffffff',{roughness:.2}));eye.position.set(1.02,1.18,0);const pu=sph(0,.12,.12,.12,8,M('#111111',{roughness:.1}));pu.position.set(1.22,1.2,0);
 if(!yellow){g.add(eye);g.add(pu)}
 if(yellow){const fat=sph('#c8a040',1.3,.75,1,16);fat.position.y=.75;g.add(fat);const L=[];for(let i=0;i<8;i++){const s=i%2?1:-1;const l=leg2(.5,.45,.07,M('#a08a30'),.6);l.position.set(.7-Math.floor(i/2)*.45,.6,s*.75);l.rotation.x=s*.5;g.add(l);L.push({m:l,ph:i*1.3})}addLegs(g,L);
  const brain2=new THREE.Mesh(_brain,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.55}));brain2.scale.setScalar(.35);brain2.position.set(.3,1.6,0);g.add(brain2)}
 g.userData.roll=b;stdAnim(g,{fq:9,amp:.35,extra:(t)=>{if(!yellow)b.rotation.z=-t*3.2;else holder.rotation.y=Math.sin(t)*.2}});return g}

function bShellBeast(f){const g=new THREE.Group();const turtle=f.w==='jingzhui';const skin=M(turtle?'#6a7a5a':(f.col||'#6a5a40'));
 const shell=new THREE.Mesh(new THREE.SphereGeometry(1,16,10,0,Math.PI*2,0,Math.PI/2),M(turtle?'#5a6a4a':'#7a6a4a',{roughness:.6}));shell.scale.set(1.1,.7,.9);shell.position.y=.6;g.add(shell);
 if(turtle){const xm=new THREE.MeshStandardMaterial({color:'#bff4ff',emissive:'#3ab0d0',emissiveIntensity:.7,roughness:.1,flatShading:true});for(let i=0;i<9;i++){const c=cone(.09,.7+Math.random()*.5,xm,5);const a=i*2.4,d=.3+(i%3)*.18;c.position.set(Math.cos(a)*d,1.3,Math.sin(a)*d*.8);c.rotation.set(Math.sin(a)*.3,0,-Math.cos(a)*.3);g.add(c)}}
 else{for(let i=0;i<10;i++){const b=new THREE.Mesh(new THREE.BoxGeometry(.06,.35,.3),M('#c8c0a8'));b.position.set(.8-i*.18,1.25,0);b.rotation.x=(i%2-.5)*.2;g.add(b)}}
 const head=sph(0,.25,.2,.2,10,skin);head.position.set(1.15,.6,0);g.add(head);
 const L=[];for(const[x,z]of[[.55,-1],[.55,1],[-.55,-1],[-.55,1]]){const l=limb(.45,.13,.12,skin);l.position.set(x,.5,z*.55);g.add(l);L.push({m:l,ph:(x>0?0:Math.PI)+(z>0?Math.PI:0),a:.5})}
 addLegs(g,L);stdAnim(g,{fq:3,amp:.3});return g}
function bQuadSmallPlain(f){const g=new THREE.Group();const id=f.w;const ape=id==='lanxing',sal=id==='tairong',cloud=id==='yunbuchong';
 const skin=cloud?new THREE.MeshStandardMaterial({color:'#f4f8ff',transparent:true,opacity:.6,roughness:1,emissive:'#d8e8ff',emissiveIntensity:.2}):M(f.col||'#6a8a5a',{roughness:ape?1:.6});
 const body=sph(0,ape?.6:.75,ape?.45:.25,ape?.38:.28,14,skin);body.position.y=ape?.9:.42;if(ape)body.rotation.z=-.4;g.add(body);
 const head=sph(0,ape?.3:.22,ape?.28:.14,ape?.28:.16,12,skin);head.position.set(ape?.55:.85,ape?1.28:.48,0);g.add(head);
 for(const z of[-1,1]){const e=sph(0,.04,.04,.04,6,M(sal?'#e8d040':'#151515'));e.position.set(ape?.78:1.0,ape?1.33:.55,z*(ape?.13:.1));g.add(e)}
 if(ape){const fur=new THREE.Points(new THREE.BufferGeometry().setFromPoints(Array.from({length:160},()=>{const v=V3(Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize();return V3(v.x*.62,v.y*.48+.9,v.z*.4)})),new THREE.PointsMaterial({color:'#7aa8ff',size:.12}));g.add(fur);
  const tl=sph(0,.25,.25,.25,8,skin);tl.position.set(-.7,.9,0);tl.scale.set(.6,.4,.4);g.add(tl)}
 else{const tl=cone(.12,.9,skin,6);tl.rotation.z=Math.PI/2;tl.position.set(-1.05,.42,0);g.add(tl)}
 const L=[];for(const[x,z]of[[.4,-1],[.4,1],[-.4,-1],[-.4,1]]){const l=limb(ape&&x>0?.8:.4,.06,.05,skin);l.position.set(x,ape?.8:.4,z*.22);if(sal)l.rotation.x=z*.7;g.add(l);L.push({m:l,ph:(x>0?0:Math.PI)+(z>0?Math.PI:0),a:.7})}
 addLegs(g,L);stdAnim(g,{fq:sal?6:8,amp:.5});return g}

function bUprightPlain(f){const g=new THREE.Group();const plant=f.w==='rq_gujia';const skin=M(f.col||'#b08a5a',{roughness:.45});
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

/* ---------------- fish & sea folk ---------------- */
function fishGeo(len,r,flat){return sharkGeo(len,r,flat)}
function bFishPlain(f){const g=new THREE.Group();const id=f.w;const glow=f.glow;
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
function bMaoyu(f){const n=50;const geo=mergeColored([[new THREE.IcosahedronGeometry(.5,1),'#ffffff'],[tg(new THREE.ConeGeometry(.12,.25,4),{p:[.05,.48,.2]}),'#f4f0ea'],[tg(new THREE.ConeGeometry(.12,.25,4),{p:[.05,.48,-.2]}),'#f4f0ea'],[tg(new THREE.SphereGeometry(.07,6,4),{p:[.42,.12,.15]}),'#1a1a1a'],[tg(new THREE.SphereGeometry(.07,6,4),{p:[.42,.12,-.15]}),'#1a1a1a']]);
 const g=new THREE.InstancedMesh(geo,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,flatShading:true}),n);g.userData.maoyu=n;g.userData.free=1;return g}
const SPEC={lvtan_beast:fxA_leviathan,xm_silver:fxB_xmsilver,ex_jiaojing:fxB_jiaojing,behemoth:bBehemoth,tianjing:bSkyWhale,xm_huanwu:q4b_fogShark,
 kongshuimu:fxA_airJelly,haikong:bJelly,daqi:q4b_daqi,rongqiu_form:bFluff,rq_piaoliu:bFluff,naodai:bMaya,zaonao:fxB_zaonao,
 gulong:fxA_gulong,baihai:fxB_baihai,emerald:(f)=>f.kind==='flyer'?bDragon(Object.assign({},f,{col:'#4f9a6a',rider:1})):bDragonkin(f),rq_xuewu:fxB_xuewu,ex_baixing:fxB_baixing,zhuru:f=>fxB_zhuru(f),dianzhuru:fxA_dianzhuru,huojilong:bDragonkin,banyu:fxA_banyu,
 sulong:bRaptor,baojun:bRaptor,yuandinglong:bSauropod,bosaidong:fxA_bosaidong,jiaolong:fxA_jiaolong,duoji:bCeratops,xm_heijiao:fxA_kentao,
 jingzhui:fxA_jingzhui,dachuolong:fxB_dachuolong,tairong:bQuadSmall,lanxing:fxA_lanxing,yunbuchong:fxA_yunbu,cishazhe:fxA_cishazhe,
 shaxie:bScorpion,shenshabus:fxA_shenshabus,heijiao:bBeetle,liedizhe:bBeetle,shitaijia:q4b_mossBeetle,lixie:bUpright,rq_gujia:fxB_gujia,rq_hunzhi:fxB_hunzhi,
 jumai:bDragonfly,hongzhazhe:bDragonfly,jufeng:bDragonfly,feilong:fxA_wyvern,yalong:fxA_wyvern,guanglong:q4b_guanglong,xm_tiefu:bDragon,ex_hero:fxB_hero,yilong:fxA_yilong,
 julunchong:bWheel,laoshu:fxA_laoshu,chenmo:fxB_chenmo,zhenjunguai:fxA_zhenjun,jiangguai:fxB_jiangguai,changyou:fxA_changyou,wenyizhishou:bFungalDragon,
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
const KIND={jelly:bJelly,leviathan:bLeviathan,behemoth:bBehemoth,fluff:bFluff,brain:bBrainPlain,worm:bWorm,swarm:bSwarm,flyer:bDragon,fish:bFish,squid:bSquid,arthro:bScorpion,
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

/* ================================================================
   bodies rebuilt to follow the book (first pass): 冰鲸, 雾蠕虫, 熔岩蠕虫, 骨鱿, 剑鳍鲨, 空水母, 古龙, 翼龙 and more
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

/* ---------- 深沙巴士: its spring-like tail has no shell, only bare red muscle wound in coils ---------- */
function fxA_shenshabus(f){const g=bScorpion(f);const tl=g.userData.tails&&g.userData.tails[0]&&g.userData.tails[0].m;if(!tl)return g;
 while(tl.children.length)tl.remove(tl.children[0]);const mus=M('#a8322a',{roughness:.48}),mus2=M('#7a1e1a',{roughness:.6});
 const pts=[];for(let i=0;i<=72;i++){const a=i/72*6.283*3.5;const r=.24-i/72*.06;pts.push(V3(-.1-i*.016,Math.cos(a)*r,Math.sin(a)*r))}
 tl.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),180,.085,8,false),mus));
 const core=new THREE.Mesh(new THREE.CylinderGeometry(.08,.05,1.15,8),mus2);core.rotation.z=Math.PI/2;core.position.x=-.65;tl.add(core);
 const tip=sph(0,.14,.12,.12,10,mus);tip.position.x=-1.28;tl.add(tip);return g}

/* ---------- 骸龙: the forelimbs are almost as long as the hind legs ---------- */
function fxA_gulong(f){const g=bDragonkin(f);for(const c of g.children)if(c.isGroup&&Math.abs(c.position.x-.25)<1e-6&&Math.abs(c.position.y-1.62)<1e-6)c.scale.set(1.15,1.5,1.15);return g}
/* ---------- 炸弹翼龙: no red crest ---------- */
function fxA_yilong(f){const g=bPterosaur(f);const cm=M('#d83a2a',{side:THREE.DoubleSide});for(const c of g.children.slice())if(c.material===cm)g.remove(c);return g}
/* ---------- 三叶虫: real trilobites instead of a cloud of dots ---------- */
function fxA_sanye(f){const g=bTrilobite({col:f.col});g.userData.swim=1;return g}

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
function fxA_bosaidong(f){const g=bSauropod(Object.assign({},f,{armor:0}));if((fxA_bsdN++)%2)return g;
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

/* ================================================================
   bodies rebuilt to follow the book (second pass): 造脑怪, 僵怪, 光龙, 大气史莱姆, 尘魔, 熔岩蝾, 白骸龙, 大鸵龙 and more
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
function fxB_baihai(f){const g=bDragonkin(f);const TEAL=M('#4cb4aa',{metalness:.5,roughness:.22}),TEAL2=M('#3a9c94',{metalness:.5,roughness:.26}),TIP=M('#a8c0bc',{metalness:.5,roughness:.2});
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
/* this record covers both beasts: the odd ones are 大鸵龙, the even ones 坚甲龙 */
function fxB_dachuolong(f){return fxB_next('dachuolong')%2?bDachuo(f):fxB_jianjia(f)}

/* ---------------- 血雾大师: a very fat crystal-skinned 翡翠龙 wrapped in a heavy black cloak (no red scarf) ---------------- */
function fxB_xuewu(f){const g=bDragonkin(f);const red=new Set(['c8302a']);const drop=[];
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

function bBrain(f){return f&&f.w==='zaonao'?fxB_zaonao(f):bBrainPlain(f)}

/* ================================================================
   the generic bodies most herds use, lofted and jointed on a strict triangle budget (q5m_)
   ================================================================ */
const q5m_DARK=M('#141210',{roughness:.3}),q5m_EYEW=M('#f4f2ec',{roughness:.25}),q5m_TOOTH=M('#efe8d6',{roughness:.35});
const q5m_fm=new THREE.Matrix4();
/* geometry is shared: a herd builds the same body several times, and each build would otherwise loft, tessellate and
   merge it all again (the parts only differ by material). Everything made through q5m_gc is marked shared and never
   changed afterwards; q5m_fuse reuses a merge whose parts are all shared */
const q5m_GC=new Map();function q5m_gc(k,mk){let g=q5m_GC.get(k);if(!g){g=mk();g.userData.q5m=1;q5m_GC.set(k,g)}return g}
const q5m_nk=a=>a.map(v=>typeof v==='number'?+v.toFixed(4):v).join(',');
function q5m_cone(r,h,mat,seg){return new THREE.Mesh(q5m_gc('co'+q5m_nk([r,h,seg||7]),()=>new THREE.ConeGeometry(r,h,seg||7)),mat)}
function q5m_cyl(r0,r1,h,mat,seg){return new THREE.Mesh(q5m_gc('cy'+q5m_nk([r0,r1,h,seg||8]),()=>new THREE.CylinderGeometry(r0,r1,h,seg||8)),mat)}
function q5m_mus(l,r,prof,seg){const g=muscle(l,r,prof,seg);g.userData.q5m=1;return g}
function q5m_box(a,b,c){return q5m_gc('bx'+q5m_nk([a,b,c]),()=>new THREE.BoxGeometry(a,b,c))}
function q5m_sphG(...a){return q5m_gc('sp'+q5m_nk(a),()=>new THREE.SphereGeometry(...a))}
function q5m_wg(span,chord,kind,rx){return q5m_gc('wg'+q5m_nk([span,chord,kind,rx||0]),()=>{const g=wingGeo(span,chord,kind);if(rx)g.rotateX(rx);return g})}
/* round beads: icosahedra (the segment boost leaves them alone) with smooth normals; 20 triangles at detail 0, 80 at 1 */
const q5m_IG=[];function q5m_ico(d){if(!q5m_IG[d]){const g=new THREE.IcosahedronGeometry(1,d),p=g.attributes.position,n=g.attributes.normal,v=V3();for(let i=0;i<p.count;i++){v.set(p.getX(i),p.getY(i),p.getZ(i)).normalize();n.setXYZ(i,v.x,v.y,v.z)}g.userData.q5m=1;q5m_IG[d]=g}return q5m_IG[d]}
function q5m_bead(r,mat,d){const m=new THREE.Mesh(q5m_ico(d||0),mat);m.scale.setScalar(r);return m}
function q5m_pale(col,k){return C(col).lerp(C('#efe8d4'),k===undefined?.45:k).getStyle()}
function q5m_dk(col,k){return C(col).multiplyScalar(k===undefined?.6:k).getStyle()}
/* the loft skin: the creature's own colour sits on the material (other files find it and recolour it by that colour); the
   vertex colours only shade it — a darker back, stripes and spots */
const q5m_SK={};function q5m_skin(col,o){o=o||{};const k=col+'|'+(o.rough||.6)+'|'+(o.metal||0)+'|'+(o.em||'')+'|'+(o.emI||0);
 return q5m_SK[k]||(q5m_SK[k]=new THREE.MeshStandardMaterial({color:col,vertexColors:true,roughness:o.rough||.6,metalness:o.metal||0,emissive:o.em||'#000000',emissiveIntensity:o.em?(o.emI||.35):0}))}
function q5m_loft(spec,col,o){o=o||{};const lo=Object.assign({},o,{back:o.backK||'#cfcac0',belly:o.bellyK||'#ffffff',spotC:o.spotK||'#6a6660'});delete lo.mat;
 const g=o.fresh?loftGeo(spec,lo):q5m_gc('lf'+JSON.stringify(spec)+JSON.stringify(lo),()=>loftGeo(spec,lo));return new THREE.Mesh(g,o.mat||q5m_skin(col,o))}
/* a thin ribbon along a path (fins, frills): a loft that is tall and almost flat */
function q5m_ribbon(pts,h,col,o){return q5m_loft(pts.map((p,i)=>[p[0],p[1],p[2],typeof h==='function'?h(i/(pts.length-1)):h,.012]),col,Object.assign({n:Math.max(4,pts.length*2),r:4},o||{}))}
function q5m_eyes(par,x,y,z,r,mat,d){for(const s of[-1,1]){const e=q5m_bead(r,mat||q5m_DARK,d===undefined?1:d);e.position.set(x,y,s*z);par.add(e)}}
/* a thin whip (antennae, bones): three sides, which the segment boost leaves as they are */
function q5m_tube(pts,r,mat,n){return new THREE.Mesh(q5m_gc('tb'+q5m_nk(pts.flatMap(p=>[p.x,p.y,p.z]).concat([r,n||6])),()=>new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),n||6,r,3,false)),mat)}
/* a jointed leg for the +z side (mirror it with scale.z=-1): the femur rises out from the hip, the tibia and the tarsus reach
   down so the tip lands on the ground h below the hip. hip.rotation.z is the fore-and-aft splay (the walk swings round it),
   userData.knee the tibia joint (lowering its rotation.x lifts the foot). o: up femur rise, tar tarsus angle from the
   vertical, rz splay, spines, toes, knee (a bead at the knee) */
function q5m_ileg(l1,l2,l3,r,mat,o){o=o||{};const up=o.up===undefined?.4:o.up,g2=o.tar===undefined?.8:o.tar,rz=o.rz||0,H=(o.h||.4)/Math.max(.5,Math.cos(rz));
 const ext=o.toes?r*.55:r*.75*Math.cos(g2);let cb=(H+l1*Math.sin(up)-l3*Math.cos(g2)-ext)/l2;cb=Math.min(1,Math.max(-.3,cb));const b=Math.acos(cb);
 const hip=new THREE.Group();hip.rotation.z=rz;const g=new THREE.Group();hip.add(g);g.rotation.x=-(Math.PI/2+up);g.add(new THREE.Mesh(q5m_mus(l1,r,[1,1.1,.92,.78],6),mat));
 const k=new THREE.Group();k.position.y=-l1;k.rotation.x=Math.PI/2+up-b;g.add(k);if(o.knee)k.add(q5m_bead(r*.85,mat));k.add(new THREE.Mesh(q5m_mus(l2,r*.8,[1,.82,.58],6),mat));
 for(let i=0;i<(o.spines||0);i++){const s=q5m_cone(r*.22,r*1.1,mat,3);s.position.set(0,-l2*(.35+i*.3),-r*.45);s.rotation.x=.6;k.add(s)}
 const a=new THREE.Group();a.position.y=-l2;a.rotation.x=b-g2;k.add(a);a.add(new THREE.Mesh(q5m_mus(l3,r*.45,[1,.62],6),mat));
 if(o.toes){const ft=new THREE.Group();ft.position.y=-l3;ft.rotation.x=g2;a.add(ft);const pad=q5m_bead(1,mat);pad.scale.set(r*1.3,r*.4,r*1.15);pad.position.y=-r*.15;ft.add(pad);
  for(let i=0;i<o.toes;i++){const u=(i/(o.toes-1)-.5)*1.5;const d=V3(Math.sin(u),-.12,Math.cos(u)).normalize();const t=q5m_cone(r*.2,r*1.5,o.toeMat||mat,4);t.quaternion.setFromUnitVectors(V3(0,1,0),d);t.position.copy(d).multiplyScalar(r*1.15);t.position.y-=r*.2;ft.add(t)}}
 else{const cl=q5m_cone(r*.25,r*.9,o.clawMat||mat,4);cl.position.y=-l3-r*.3;cl.rotation.z=Math.PI;a.add(cl)}
 hip.userData.knee=k;hip.userData.len=l1+l2+l3;return hip}
/* walk cycle for jointed legs: each hip swings round its own splay, the foot lifts on the forward swing */
function q5m_crawl(g,o){o=o||{};const fq=o.fq||8,amp=o.amp||.35,lift=o.lift||.5;
 g.userData.anim=t=>{const L=g.userData.legs;if(L)for(const l of L){const k=l.m.userData.knee;if(l.rz===undefined){l.rz=l.m.rotation.z;l.kx=k?k.rotation.x:0}l.m.rotation.z=l.rz+Math.sin(t*fq+l.ph)*amp*(l.a||1);if(k)k.rotation.x=l.kx-Math.max(0,Math.cos(t*fq+l.ph))*lift*(l.a||1)}
  const Wg=g.userData.wings;if(Wg)for(const w of Wg){w.m.rotation.x=(w.base||0)+w.s*Math.sin(t*(w.f||5)+(w.ph||0))*(w.a||.5)}
  const Tl=g.userData.tails;if(Tl)for(const tl of Tl){tl.m.rotation.y=Math.sin(t*(tl.f||2)+(tl.ph||0))*(tl.a||.3)}
  if(o.extra)o.extra(t)}}
/* wingGeo's span really runs along +x; this one lies in x–z with the span along +z and the leading edge forward */
function q5m_wingGeo(span,chord,kind){return q5m_gc('wq'+q5m_nk([span,chord,kind]),()=>wingGeo(span,chord,kind).rotateY(-Math.PI/2).rotateZ(Math.PI))}
/* an insect wing: a clear membrane, optionally with a few dark veins drawn on it; root at the origin, span +z */
function q5m_iwing(span,chord,mat,o){o=o||{};const g=new THREE.Group();g.add(new THREE.Mesh(q5m_wingGeo(span,chord,'insect'),mat));if(!o.veins)return g;
 const N=o.veins,X=(a,t)=>chord*(.35*Math.sin(t*Math.PI)*(1-Math.abs(a)*.6)+a*(.5-.5*t)*.9),pts=[];
 for(let i=0;i<N;i++){const a=(i/(N-1)-.5)*.9;let px=0,pz=0;for(let j=1;j<=4;j++){const t=j/4,z=span*t*.96,x=X(a,t);pts.push(V3(px,0,pz),V3(x,0,z));px=x;pz=z}}
 for(let j=1;j<4;j++){const t=j/4,z=span*t;for(let i=0;i<N-1;i++){const a0=(i/(N-1)-.5)*.9,a1=((i+1)/(N-1)-.5)*.9;pts.push(V3(X(a0,t),0,z),V3(X(a1,t),0,z+span*.03))}}
 const v=new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:o.vein||'#2a2a28',transparent:true,opacity:.7}));v.position.y=.003;g.add(v);return g}
/* a pincer built along +x: a lofted hand, a fixed finger on the zs side and a movable one (userData.jaw, opens about y) */
function q5m_chela(l,r,col,zs,o){const g=new THREE.Group();g.add(q5m_loft([[0,0,0,r*.65,r*.75],[l*.4,0,0,r*1.05,r*1.2],[l*.78,0,0,r*.85,r*.95],[l,0,0,r*.4,r*.45]],col,Object.assign({n:6,r:8},o)));
 g.add(q5m_loft([[l*.72,0,zs*r*.45,r*.3,r*.3],[l*1.3,0,zs*r*.5,r*.18,r*.18],[l*1.72,.02,zs*r*.28,r*.04,r*.04]],col,Object.assign({n:4,r:6},o)));
 const jaw=new THREE.Group();jaw.position.set(l*.72,0,-zs*r*.45);g.add(jaw);jaw.add(q5m_loft([[0,0,0,r*.3,r*.28],[l*.6,0,-zs*r*.05,r*.2,r*.18],[l*1.0,.02,zs*r*.18,r*.04,r*.04]],col,Object.assign({n:4,r:6},o)));
 g.userData.jaw=jaw;return g}
/* an arm built along +x from a shoulder: yawed out (side zs), pitched down, an elbow that folds back in, a pincer */
function q5m_arm(par,x,y,z,zs,l1,l2,r,mat,col,o){const sh=new THREE.Group();sh.position.set(x,y,z);sh.rotation.set(0,-zs*(o.yaw||.6),-(o.pitch||.15));par.add(sh);
 const ua=new THREE.Mesh(q5m_mus(l1,r,[.85,1.1,1,.82,.7],6),mat);ua.rotation.z=Math.PI/2;sh.add(ua);sh.add(q5m_bead(r*1.1,mat));
 const el=new THREE.Group();el.position.x=l1;el.rotation.y=zs*(o.fold||1.05);sh.add(el);const fa=new THREE.Mesh(q5m_mus(l2,r*.85,[1,.95,.8,.7],6),mat);fa.rotation.z=Math.PI/2;el.add(fa);
 const ch=q5m_chela(o.cl||l2*.8,o.cr||r*1.6,col,zs,o.lo);ch.position.x=l2;ch.rotation.y=-zs*(o.wrist||.25);el.add(ch);return {sh,el,ch,z:zs}}
/* fold every part that does not move against its joint into one mesh per material and joint: the body's animation is run
   a few times to see what moves. Joints, parts named in any userData (legs, wings, tails, jaws, knees …), lines, points and
   sprites stay as they are, so the animation and the files that dress these bodies find the same handles */
function q5m_fuse(root){if(!THREE.BufferGeometryUtils)return root;const fn=root.userData.anim;const nodes=[];root.traverse(o=>nodes.push(o));const keep=new Set([root]);
 const mark=v=>{if(!v||typeof v!=='object')return;if(v.isObject3D){keep.add(v);return}if(Array.isArray(v)){for(const x of v)mark(x);return}if(v.m&&v.m.isObject3D)keep.add(v.m)};
 for(const o of nodes){for(const k in o.userData)mark(o.userData[k]);if(o.userData.keep)keep.add(o);
  if(!(o.isMesh||o.type==='Group'||o.type==='Object3D')||o.isInstancedMesh||o.isSkinnedMesh||Array.isArray(o.material)||o.renderOrder||!o.visible||!o.frustumCulled)keep.add(o);
  else if(o.isMesh){const m=o.material,ga=o.geometry&&o.geometry.attributes;if(!m||m.map||m.alphaMap||m.normalMap||m.bumpMap||!ga||!ga.position||(m.vertexColors&&!ga.color)||o.children.length)keep.add(o)}}
 if(fn){const pose=()=>nodes.map(o=>q5m_fm.compose(o.position,o.quaternion,o.scale).elements.slice());const p0=pose();
  for(const t of[.37,1.91,5.3,11.7]){try{fn(t)}catch(e){return root}const p=pose();for(let i=0;i<nodes.length;i++){if(keep.has(nodes[i]))continue;const a=p0[i],b=p[i];for(let k=0;k<16;k++)if(Math.abs(a[k]-b[k])>1e-6){keep.add(nodes[i]);break}}}}
 for(const A of nodes){if(!keep.has(A))continue;const by=new Map();
  const walk=(o,mx)=>{for(const c of o.children){if(keep.has(c))continue;const m2=new THREE.Matrix4().multiplyMatrices(mx,q5m_fm.compose(c.position,c.quaternion,c.scale));if(c.isMesh){if(!by.has(c.material))by.set(c.material,[]);by.get(c.material).push([c,m2])}else walk(c,m2)}};
  walk(A,new THREE.Matrix4());
  for(const [mat,list] of by){if(list.length<2)continue;const gs=[];
   // all parts shared: the same parts in the same places merge to the same mesh, so reuse it
   let ck=null;if(list.every(([c])=>c.geometry.userData.q5m)){ck='fu'+(mat.vertexColors?1:0);for(const [c,mx] of list){ck+='|'+c.geometry.uuid;const e=mx.elements;for(let k=0;k<16;k++)ck+=','+Math.round(e[k]*1e4)}}
   const hit=ck&&q5m_GC.get(ck);if(hit){const mesh=new THREE.Mesh(hit,mat);mesh.castShadow=list[0][0].castShadow;mesh.receiveShadow=list[0][0].receiveShadow;for(const [c] of list)c.parent.remove(c);A.add(mesh);continue}
   for(const [c,mx] of list){const q=c.geometry.clone();for(const k of Object.keys(q.attributes))if(k!=='position'&&k!=='normal'&&!(k==='color'&&mat.vertexColors))q.deleteAttribute(k);if(!q.attributes.normal)q.computeVertexNormals();
    if(!q.index){const n=q.attributes.position.count,ix=new Array(n);for(let i=0;i<n;i++)ix[i]=i;q.setIndex(ix)}q.morphAttributes={};q.clearGroups();q.applyMatrix4(mx);
    if(mx.determinant()<0){const I=q.index.array;for(let i=0;i<I.length;i+=3){const t=I[i+1];I[i+1]=I[i+2];I[i+2]=t}}gs.push(q)}
   let mg=null;try{mg=THREE.BufferGeometryUtils.mergeBufferGeometries(gs)}catch(e){mg=null}if(!mg)continue;mg.computeBoundingSphere();if(ck){mg.userData.q5m=1;q5m_GC.set(ck,mg)}
   const mesh=new THREE.Mesh(mg,mat);mesh.castShadow=list[0][0].castShadow;mesh.receiveShadow=list[0][0].receiveShadow;for(const [c] of list)c.parent.remove(c);A.add(mesh)}}
 for(let i=nodes.length-1;i>=0;i--){const o=nodes[i];if(!keep.has(o)&&!o.isMesh&&o.parent&&!o.children.length)o.parent.remove(o)}
 return root}
/* the old builders, kept for the variants other files already rebuilt on top of them */

let q5m_eyeK=1;// (大眼龙 asks the salamander for eyes 2.6 times bigger, see the end of this file)

/* ---------------- 苔螈 and the small four-legged default: half a metre of salamander that keeps lifting its head to look round ---------------- */
function bQuadSmall(f){const id=f.w;if(id==='lanxing'||id==='yunbuchong')return bQuadSmallPlain(f);const sal=id==='tairong'||!id||id==='x';
 const g=new THREE.Group();const col=f.col||'#6a8a5a';const o={spots:sal?16:0,stripe:sal?0:6,rough:.5};const mat=M(col,{roughness:.5});
 g.add(q5m_loft([[-.6,.36,0,.17,.22],[-.15,.41,0,.25,.3],[.35,.4,0,.23,.28],[.7,.37,0,.15,.19]],col,Object.assign({n:14,r:10},o)));
 const hg=new THREE.Group();hg.position.set(.68,.37,0);g.add(hg);
 hg.add(q5m_loft([[-.06,0,0,.15,.19],[.2,.03,0,.14,.22],[.44,-.01,0,.09,.17],[.6,-.05,0,.035,.08]],col,Object.assign({n:8,r:10},o,{spots:0})));
 q5m_eyes(hg,.27,.11,.14,.055*q5m_eyeK,sal?M('#e8d040',{roughness:.15}):q5m_DARK,1);
 const tl=new THREE.Group();tl.position.set(-.6,.36,0);g.add(tl);tl.add(q5m_loft([[0,0,0,.17,.21],[-.45,-.04,0,.12,.13],[-.9,-.1,0,.07,.065],[-1.3,-.17,0,.015,.015]],col,Object.assign({n:10,r:8},o)));
 const L=[];for(const[x,z,ph]of[[.42,1,0],[.42,-1,Math.PI],[-.42,1,Math.PI],[-.42,-1,0]]){const l=q5m_ileg(.2,.25,.08,.045,mat,{h:.33,up:.2,tar:1.15,toes:3,rz:x>0?.45:-.45});l.position.set(x,.33,z*.2);l.scale.z=z;g.add(l);L.push({m:l,ph,a:1})}
 addLegs(g,L);g.userData.tails=[{m:tl,a:.22,f:sal?3:4}];
 q5m_crawl(g,{fq:sal?6:8,amp:.4,lift:.5,extra:t=>{const look=sm(.2,.9,Math.sin(t*.45));hg.rotation.z=look*.42;hg.rotation.y=Math.sin(t*.8)*.3*look;tl.rotation.z=-.05+look*.06}});return q5m_fuse(g)}

/* ---------------- 沙漠蝎: three metres, big pincers and, as the book says, no hook on its tail; 深沙巴士 the long flat one ---------------- */
function bScorpion(f){const id=f.w;const bus=id==='shenshabus',desert=id==='shaxie';const g=new THREE.Group();const col=f.col||'#a0703e';
 const o={rough:.42,metal:.08};const mat=M(col,{roughness:.42,metalness:.08}),plate=M(q5m_dk(col,.7),{roughness:.4,metalness:.12}),L=[];const n=bus?7:4,st=bus?.42:.38,ry=bus?.17:.2,rzz=bus?.5:.33;
 // the body: one loft from the front of the carapace to the last segment, a domed plate over each segment
 const spec=[];for(let i=-1;i<=n;i++){const k=i<0?.78:i===n?.55:1;spec.push([.95-i*st,.5,0,ry*k,rzz*k])}g.add(q5m_loft(spec,col,Object.assign({n:n*4+4,r:10},o)));
 const pg=q5m_sphG(1,8,3,0,Math.PI*2,0,Math.PI*.42);for(let i=0;i<n;i++){const p=new THREE.Mesh(pg,plate);p.scale.set(st*.56,ry*.58,rzz*1.04);p.position.set(.9-i*st,.5+ry*.48,0);g.add(p)}
 // the head end: carapace, chelicerae, two eyes on top and a pair along each edge
 const hd=new THREE.Group();hd.position.set(1.3,.49,0);g.add(hd);hd.add(q5m_loft([[-.2,0,0,ry*.95,rzz*.92],[.1,.02,0,ry*.8,rzz*.85],[.3,-.04,0,ry*.4,rzz*.45]],col,Object.assign({n:6,r:10},o)));
 q5m_eyes(hd,.02,ry*.82,.06,.04,q5m_DARK,0);q5m_eyes(hd,.1,ry*.42,rzz*.7,.026,q5m_DARK,0);q5m_eyes(hd,.03,ry*.44,rzz*.78,.024,q5m_DARK,0);q5m_eyes(hd,-.04,ry*.46,rzz*.84,.022,q5m_DARK,0);
 for(const z of[-1,1]){const ch=q5m_cone(.03,.13,plate,4);ch.position.set(.35,-.07,z*.06);ch.rotation.z=-Math.PI/2-.3;hd.add(ch)}
 // legs: eight (twelve on the bus) reaching out and down, the front ones splayed forward and the rear ones back
 const np=bus?6:4;for(let i=0;i<np*2;i++){const s=i%2?1:-1,k=Math.floor(i/2);const l=q5m_ileg(.34,.56,.16,.04,mat,{h:.46,up:.45,tar:.65,spines:2,rz:((np-1)/2-k)/(np-1)});l.position.set(.78-k*st,.46,s*rzz*.88);l.scale.z=s;g.add(l);L.push({m:l,ph:k*1.1+(s>0?Math.PI:0),a:.6})}
 // pedipalps: upper arm, forearm, the pincer
 const arms=[];for(const z of[-1,1])arms.push(q5m_arm(g,1.28,.46,z*.2,z,.4,.36,bus?.05:.065,mat,col,{yaw:.75,pitch:.12,fold:1.2,wrist:.35,cl:bus?.26:.4,cr:bus?.085:.13,lo:o}));
 // the tail: five segments curling up over the back; the desert scorpion's ends blunt, the others carry a hook
 const tl=new THREE.Group();tl.position.set(.95-n*st+.16,.52,0);g.add(tl);
 if(!bus){const pts=[];let px=0,py=0;for(let i=0;i<=6;i++){const th=i*.36;pts.push([px,py,0,.12-i*.013,.125-i*.013]);px-=Math.cos(th)*.24;py+=Math.sin(th)*.24}tl.add(q5m_loft(pts,col,Object.assign({n:16,r:8,stripe:6},o)));
  const tip=q5m_bead(1,mat,1);tip.scale.set(.07,.06,.06);tip.position.set(pts[6][0],pts[6][1],0);tl.add(tip);
  if(!desert){const sg=q5m_cone(.03,.16,q5m_DARK,4);sg.position.set(pts[6][0]+.06,pts[6][1]-.07,0);sg.rotation.z=2.3;tl.add(sg)}}
 else{const pts=[];for(let i=0;i<=24;i++){const a=i/24*6.28*3;pts.push(V3(-i*.042,Math.cos(a)*.15,Math.sin(a)*.15))}tl.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),48,.045,6,false),mat))}
 addLegs(g,L);g.userData.tails=[{m:tl,a:.12,f:2}];
 q5m_crawl(g,{fq:9,amp:.28,lift:.45,extra:t=>{arms.forEach((x,i)=>{x.sh.rotation.y=-x.z*(.75+Math.sin(t*1.3+i*2)*.12);x.ch.userData.jaw.rotation.y=x.z*(.1+Math.max(0,Math.sin(t*2.1+i))*.45)});tl.rotation.z=Math.sin(t*1.1)*.06}});return q5m_fuse(g)}

/* ---------------- beetles: 黑角巨蠊 (the black-horned giant cockroach), 裂地者 (the earth-splitter with its saw jaws), the plain one ---------------- */
function bBeetle(f){const id=f.w;const roach=id==='heijiao',saw=id==='liedizhe';const g=new THREE.Group();const col=f.col||'#3a5a3a';
 const o={rough:roach?.3:.36,metal:roach?.3:.18,em:saw?'#4a2a18':'',emI:.25};const mat=M(col,{roughness:o.rough,metalness:o.metal}),dk=M(q5m_dk(col,.55),{roughness:.4,metalness:.2}),legM=M(q5m_dk(col,.45),{roughness:.45});
 const LX=roach?1.9:saw?1.7:1.5,W=roach?.55:saw?.5:.46,H=roach?.26:saw?.44:.38,y0=.46;
 // the underbody and the head
 g.add(q5m_loft([[-LX*.5,y0,0,H*.5,W*.6],[-LX*.2,y0,0,H*.62,W*.88],[LX*.2,y0,0,H*.6,W*.88],[LX*.5,y0-.02,0,H*.42,W*.6]],col,Object.assign({n:12,r:8},o)));
 const hd=new THREE.Group();hd.position.set(LX*.5,y0-.04,0);g.add(hd);hd.add(q5m_loft([[-.1,0,0,H*.4,W*.45],[.12,0,0,H*.38,W*.42],[.3,-.04,0,H*.25,W*.3],[.4,-.08,0,H*.1,W*.14]],col,Object.assign({n:8,r:8},o)));
 q5m_eyes(hd,.17,H*.18,W*.31,.045,q5m_DARK,0);
 // the shield behind the head and the two wing cases split down the back
 const pro=new THREE.Mesh(q5m_sphG(1,8,4,0,Math.PI*2,0,Math.PI*.46),dk);pro.scale.set(LX*(roach?.24:.19),H*.48,W*.95);pro.position.set(LX*(roach?.44:.4),y0+H*.05,0);g.add(pro);
 const eg=q5m_sphG(1,8,4,0,Math.PI,0,Math.PI*.5);for(const z of[-1,1]){const el=new THREE.Mesh(eg,mat);el.scale.set(LX*.48,H*.72,W*.98);el.position.set(-LX*.12,y0+H*.05,z*.012);el.rotation.y=z>0?0:Math.PI;g.add(el)}
 {const pts=[];for(let i=0;i<=6;i++){const u=i/6*2-1;pts.push(V3(-LX*.12+u*LX*.46,y0+H*.05+H*.72*Math.sqrt(Math.max(0,1-u*u*.94))+.004,0))}g.add(q5m_tube(pts,.012,q5m_DARK,8))}
 // antennae, mandibles, cerci
 const ants=[];for(const z of[-1,1]){const len=roach?1.3:.7;const a=new THREE.Group();a.position.set(.3,H*.2,z*W*.2);hd.add(a);a.add(q5m_tube([0,1,2,3,4].map(j=>{const t=j/4;return V3(len*t,len*.4*Math.sin(t*1.8)-.15*len*t*t,z*.55*len*t)}),.012,dk,roach?10:8));ants.push({a,z});
  if(!saw){const m=q5m_cone(.03,.16,q5m_DARK,4);m.position.set(.42,-.08,z*.07);m.rotation.z=-Math.PI/2-.25;m.rotation.x=-z*.4;hd.add(m)}
  const c=q5m_cone(.02,.3,dk,4);c.position.set(-LX*.5-.1,y0-.1,z*.12);c.rotation.z=Math.PI/2+.2;c.rotation.x=z*.4;g.add(c)}
 // the roach's black horn, blunt and rounded at the end
 if(roach){const hn=new THREE.Mesh(q5m_mus(.55,.06,[1,.85,.8,.9],6),dk);hn.position.set(.3,H*.4,0);hn.rotation.z=Math.PI/2+.55;hd.add(hn);const kn=q5m_bead(.075,dk);kn.position.set(.3+Math.sin(hn.rotation.z)*.55,H*.4-Math.cos(hn.rotation.z)*.55,0);hd.add(kn)}
 // the earth-splitter's saw jaws: two long blades set with teeth, opening and closing
 if(saw)for(const z of[-1,1]){const j=new THREE.Group();j.position.set(.3,-.1,z*W*.5);j.rotation.y=z*.3;hd.add(j);
  j.add(q5m_loft([[0,0,0,.08,.1],[.5,0,0,.07,.07],[1.0,.02,0,.05,.05],[1.35,.04,0,.015,.015]],q5m_dk(col,.85),{n:8,r:6,rough:.4,metal:.2}));
  for(let i=0;i<8;i++){const tt=q5m_cone(.03,.12+.04*(i%2),q5m_TOOTH,3);tt.position.set(.15+i*.15,0,-z*.06);tt.rotation.x=z*Math.PI/2;j.add(tt)}g.userData.jaws=(g.userData.jaws||[]).concat([{m:j,z}])}
 const L=[];for(let i=0;i<6;i++){const s=i%2?1:-1,k=Math.floor(i/2);const l=q5m_ileg(.3,.42,.13,.035,legM,{h:y0-.04,up:.45,tar:.7,spines:1,rz:(1-k)*.42});l.position.set(LX*(.28-k*.28),y0-.04,s*W*.75);l.scale.z=s;g.add(l);L.push({m:l,ph:k*1.2+(s>0?Math.PI:0),a:.6})}
 addLegs(g,L);q5m_crawl(g,{fq:11,amp:.3,lift:.45,extra:t=>{ants.forEach((x,i)=>{x.a.rotation.y=x.z*Math.sin(t*2.2+i)*.25;x.a.rotation.z=Math.sin(t*1.7+i*2)*.15});if(g.userData.jaws)for(const j of g.userData.jaws)j.m.rotation.y=j.z*(.3+Math.max(0,Math.sin(t*2.6))*.4)}});return q5m_fuse(g)}

/* ---------------- fish: one skin from snout to tail, the rear half and the tail fin swinging in turn ---------------- */
function q5m_finMat(col,op){const k='fin|'+col+'|'+(op||.82);return MC[k]||(MC[k]=new THREE.MeshStandardMaterial({color:col,side:THREE.DoubleSide,roughness:.45,transparent:true,opacity:op||.82,depthWrite:false}))}
function bFish(f){const id=f.w;if(id==='jianshi'||id==='haigui'||id==='rq_maojing')return bFishPlain(f);// (毛鲸's coat of hair hid its eyes and fins: it keeps the old body)
 const g=new THREE.Group();const col=f.col||'#55606a',glow=f.glow;
 const eel=id==='shanyao',dunk=id==='dengshi',horn=id==='chongfeng',fur=id==='rq_maojing';
 const o={stripe:(eel||fur||dunk)?0:9,rough:fur?.8:.35,metal:glow?0:.18,em:glow?col:'',emI:.35,bellyK:'#ffffff',backK:'#b8b4ac'};const fin=q5m_finMat(q5m_dk(col,.85));
 if(eel){// 闪耀鳗: six metres of eel, starry points of light all over it and a mouth full of teeth; a chain of segments that wave in turn
  const N=6,SL=.52,segs=[];let par=g;const eo=Object.assign({},o,{em:q5m_dk(col,.35),emI:.4,rough:.3});
  const hd=new THREE.Group();g.add(hd);hd.add(q5m_loft([[.75,0,0,.05,.06],[.55,.04,0,.14,.13],[.3,.05,0,.18,.15],[0,.04,0,.17,.14],[-.2,.03,0,.16,.13]],col,Object.assign({n:8,r:8},eo)));
  const jaw=new THREE.Group();jaw.position.set(.2,-.06,0);hd.add(jaw);jaw.add(q5m_loft([[0,0,0,.05,.12],[.3,-.02,0,.05,.1],[.55,-.03,0,.03,.05]],col,Object.assign({n:6,r:6},eo)));
  for(let i=0;i<4;i++)for(const z of[-1,1]){const t=q5m_cone(.014,.07,q5m_TOOTH,3);t.position.set(.32+i*.09,-.04,z*(.1-i*.016));t.rotation.x=Math.PI;hd.add(t);const t2=q5m_cone(.012,.06,q5m_TOOTH,3);t2.position.set(.1+i*.1,0,z*(.085-i*.012));jaw.add(t2)}
  q5m_eyes(hd,.42,.1,.1,.04,q5m_DARK,0);
  const fo=Object.assign({},eo,{backK:'#ffffff',bellyK:'#ffffff'});
  for(let i=0;i<N;i++){const sg=new THREE.Group();sg.position.x=i?-SL:-.2;par.add(sg);const r=.16-i*.02;sg.add(q5m_loft([[0,0,0,r+.01,r*.85],[-SL*.5,0,0,r,r*.8],[-SL,0,0,r-.02,(r-.02)*.85]],col,Object.assign({n:4,r:8},eo)));
   sg.add(q5m_ribbon([[.02,r*.95,0],[-SL*.5,r*.95,0],[-SL-.02,(r-.02)*.95,0]],.06-i*.006,q5m_pale(col,.25),fo));
   if(i===N-1){const tf=new THREE.Mesh(q5m_wg(.3,.4,'fin',-Math.PI/2),fin);tf.position.x=-SL;sg.add(tf);const t2=tf.clone();t2.scale.y=-1;sg.add(t2)}segs.push(sg);par=sg}
  // the points of light ride on the segments: one cloud for the whole body, moved with them
  const NP=54,home=[];for(let i=0;i<NP;i++){const s=i%N,u=h3(i,1,3),a=h3(i,2,3)*6.283;const r=.15-s*.02;home.push([s,-u*SL,Math.sin(a)*r*.9,Math.cos(a)*r*.75])}
  const spk=sparkles(home.map(()=>V3()),'#bfe8ff',.5,1);spk.geometry.boundingSphere=new THREE.Sphere(V3(-1.2,0,0),3);g.add(spk);const pa=spk.geometry.attributes.position,mm=[];for(let i=0;i<N;i++)mm.push(new THREE.Matrix4());const v=V3();
  g.userData.anim=t=>{segs.forEach((s,i)=>s.rotation.y=Math.sin(t*3.2-i*.9)*.2);hd.rotation.y=Math.sin(t*3.2+.9)*.08;jaw.rotation.z=-Math.max(0,Math.sin(t*1.1))*.35;
   for(let i=0;i<N;i++){const s=segs[i];q5m_fm.compose(s.position,s.quaternion,s.scale);if(i)mm[i].multiplyMatrices(mm[i-1],q5m_fm);else mm[i].copy(q5m_fm)}
   for(let i=0;i<NP;i++){const p=home[i];v.set(p[1],p[2],p[3]).applyMatrix4(mm[p[0]]);pa.setXYZ(i,v.x,v.y,v.z)}pa.needsUpdate=true};g.userData.swim=1;return q5m_fuse(g)}
 const K=dunk?1.35:1;const fr=new THREE.Group();g.add(fr);
 fr.add(q5m_loft(dunk?[[1.1,.02,0,.1,.1],[1.02,.06,0,.22,.22],[.75,.08,0,.34,.28],[.35,.06,0,.4,.28],[0,.03,0,.42,.27],[-.35*K,0,0,.26*K,.16*K]]:horn?[[1.05,0,0,.04,.03],[.8,.02,0,.13,.1],[.4,.03,0,.24,.17],[0,.02,0,.27,.18],[-.35,0,0,.22,.15]]:fur?[[.95,-.02,0,.2,.2],[.7,.03,0,.3,.28],[.3,.04,0,.36,.3],[-.1,.02,0,.34,.28],[-.4,0,0,.28,.22]]:[[.95*K,0,0,.04,.03],[.75*K,.02,0,.17*K,.11*K],[.4*K,.03,0,.31*K,.2*K],[0,.02,0,.32*K,.2*K],[-.35*K,0,0,.26*K,.16*K]],col,Object.assign({n:14,r:10},o)));
 const rr=new THREE.Group();rr.position.x=-.35*K;fr.add(rr);rr.add(q5m_loft(fur?[[0,0,0,.28,.22],[-.4,0,0,.18,.14],[-.8,0,0,.09,.07],[-1.0,0,0,.05,.04]]:[[0,0,0,.26*K,.16*K],[-.4*K,0,0,.16*K,.1*K],[-.8*K,0,0,.08*K,.05*K],[-1.0*K,0,0,.05*K,.03*K]],col,Object.assign({n:8,r:8},o)));
 const tl=new THREE.Group();tl.position.x=-1.0*K;rr.add(tl);
 if(fur){const fd=M(q5m_dk(col,.7),{side:THREE.DoubleSide,roughness:.5});for(const z of[-1,1]){const fl=new THREE.Mesh(q5m_wg(.45,.4,'fin'),fd);fl.position.set(0,0,z*.02);fl.rotation.y=z*.3;if(z<0)fl.scale.z=-1;tl.add(fl)}}
 else{const tf=new THREE.Mesh(q5m_wg(.42*K,.55*K,'fin',-Math.PI/2),fin);tf.rotation.z=.15;tl.add(tf);const t2=tf.clone();t2.scale.y=-1;t2.rotation.z=-.15;tl.add(t2)}
 if(!fur){fr.add(q5m_ribbon([[.35*K,.24*K,0],[.1*K,.28*K,0],[-.2*K,.24*K,0],[-.4*K,.18*K,0]],u=>.1*K*Math.sin(u*2.4+.4)+.01,q5m_dk(col,.8),{n:6}));
  rr.add(q5m_ribbon([[-.15*K,-.15*K,0],[-.35*K,-.11*K,0]],.06*K,q5m_dk(col,.8),{n:4}))}
 for(const z of[-1,1]){const pf=new THREE.Mesh(wingGeo((dunk?.5:.32)*K,.26*K,'fin'),fin);pf.position.set(.4*K,-.08*K,z*.17*K);pf.rotation.set(z*.5,z*-.6,-.2);if(z<0)pf.scale.z=-1;fr.add(pf);
  if(!fur){const pv=new THREE.Mesh(q5m_wg(.18*K,.16*K,'fin'),fin);pv.position.set(-.05*K,-.16*K,z*.1*K);pv.rotation.set(z*.9,z*-.5,-.1);if(z<0)pv.scale.z=-1;fr.add(pv)}
  // the gill line and the eye: a white with a dark pupil, no lid
  if(!dunk&&!fur)for(let k=0;k<2;k++){const gl=new THREE.Mesh(q5m_box(.012,.17*K-k*.03,.01),M(q5m_dk(col,.5)));gl.position.set((.52-k*.05)*K,0,z*(.16+k*.012)*K);gl.rotation.set(z*.25,0,.25);fr.add(gl)}
  const ex=dunk?.93:.72*K,ey=dunk?.16:.08*K,ez=dunk?.255:.14*K;const w=q5m_bead(1,q5m_EYEW,1);w.scale.set(.06*K,.06*K,.03*K);w.position.set(ex,ey,z*ez);fr.add(w);const pu=q5m_bead(1,q5m_DARK);pu.scale.set(.032*K,.032*K,.02*K);pu.position.set(ex+.025*K,ey,z*(ez+.025*K));fr.add(pu)}
 if(dunk){// 邓氏鱼: the bony shield over head and cheeks, and blade-like jaw edges that shear instead of teeth
  const bone=M('#3a4248',{roughness:.3,metalness:.35}),edge=M('#1e2226',{roughness:.25,metalness:.4});
  const sh=new THREE.Mesh(q5m_sphG(1,8,4,0,Math.PI*2,0,Math.PI*.5),bone);sh.scale.set(.55,.42,.3);sh.position.set(.58,.1,0);sh.rotation.z=-.12;fr.add(sh);
  for(const z of[-1,1]){const ck=new THREE.Mesh(q5m_box(.46,.28,.05),bone);ck.position.set(.6,-.02,z*.27);ck.rotation.set(0,z*.12,-.1);fr.add(ck);const ub=new THREE.Mesh(q5m_box(.3,.12,.04),edge);ub.position.set(1.0,-.06,z*.15);ub.rotation.set(0,z*.55,-.3);fr.add(ub)}
  const jw=new THREE.Group();jw.position.set(.62,-.2,0);fr.add(jw);jw.add(q5m_loft([[0,0,0,.08,.22],[.35,0,0,.07,.18],[.56,.05,0,.04,.09]],'#5a6064',{n:6,r:6,rough:.35}));
  for(const z of[-1,1]){const lb=new THREE.Mesh(q5m_box(.36,.12,.03),edge);lb.position.set(.3,.08,z*.14);lb.rotation.set(0,z*.25,.3);jw.add(lb)}
  g.userData.jaw=jw}
 if(horn){// 冲锋者: a long barbed lance in front and a water-jet throat behind
  fr.add(q5m_loft([[1.0,0,0,.06,.06],[1.5,.01,0,.045,.045],[2.1,.02,0,.012,.012]],'#e2ded2',{n:6,r:6,rough:.4}));
  for(let i=0;i<4;i++)for(let k=0;k<2;k++){const a=k*Math.PI+i*.8;const b=q5m_cone(.015,.08,M('#e8e4d8'),4);b.position.set(1.2+i*.22,Math.cos(a)*.05,Math.sin(a)*.05);b.rotation.set(0,0,Math.PI/2+.35);b.rotateX(a);fr.add(b)}
  const jet=q5m_cyl(.05,.08,.16,M('#2a3038'),6);jet.rotation.z=Math.PI/2;jet.position.set(-.3,0,0);rr.add(jet)}
 if(fur){// 毛鲸: a small whale-like fish under a coat of long hair
  const n=240,pa=new Float32Array(n*6),ca=new Float32Array(n*6);const c0=C(q5m_dk(col,.8)),c1=C('#fbf8f0');
  for(let i=0;i<n;i++){const u=h3(i,1,6)*6.283,v=Math.acos(2*h3(i,2,6)-1);const d=V3(Math.sin(v)*Math.cos(u),Math.cos(v),Math.sin(v)*Math.sin(u));const x=-.05+d.x*1.0,y=.02+d.y*.33,z=d.z*.29;const Lh=.22+h3(i,3,6)*.2;const ex=V3(d.x*.3,d.y,d.z).normalize();
   pa.set([x,y,z,x+ex.x*Lh-.12*Lh,y+ex.y*Lh,z+ex.z*Lh],i*6);ca.set([c0.r,c0.g,c0.b,c1.r,c1.g,c1.b],i*6)}
  const hg=new THREE.BufferGeometry();hg.setAttribute('position',new THREE.BufferAttribute(pa,3));hg.setAttribute('color',new THREE.BufferAttribute(ca,3));fr.add(new THREE.LineSegments(hg,new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:.85})));
  const bh=q5m_cyl(.03,.03,.04,M('#2a2a28'),6);bh.position.set(.45,.33,0);fr.add(bh)}
 g.userData.anim=t=>{const w=Math.sin(t*(horn?7:5));rr.rotation.y=w*.22;tl.rotation.y=Math.sin(t*(horn?7:5)-.9)*.35;fr.rotation.y=-w*.05;if(g.userData.jaw)g.userData.jaw.rotation.z=-Math.max(0,Math.sin(t*.9))*.45};
 if(!f.sky)g.userData.swim=1;return q5m_fuse(g)}

/* ---------------- 海空水母 and the plain jellyfish: a frilled bell, ring canals, four ruffled oral arms; 海空水母 carries the white dragons' basket ---------------- */
function bJelly(f){if(f.w==='daqi')return bJellyPlain(f);const big=f.w==='haikong';const g=new THREE.Group();const col=f.col||'#bfe9ff';
 const prof=[];for(let i=0;i<=12;i++){const t=i/12;prof.push(new THREE.Vector2(Math.sin(t*Math.PI*.56)*(1+.1*Math.pow(t,6)),Math.cos(t*Math.PI*.5)*.9-(t>.86?(t-.86)*1.4:0)))}
 const bg=new THREE.LatheGeometry(prof,24);{const p=bg.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),y=p.getY(i);const r=Math.hypot(x,z);if(r<.01)continue;const a=Math.atan2(z,x);const k=sm(.45,1.05,r)*(.06*Math.sin(a*12)+.03*Math.sin(a*5+1));p.setXYZ(i,x*(1+k),y+k*.5*sm(.9,1.1,r),z*(1+k))}bg.computeVertexNormals()}
 const bm=new THREE.MeshStandardMaterial({color:col,emissive:col,emissiveIntensity:.32,transparent:true,opacity:.52,side:THREE.DoubleSide,roughness:.12,depthWrite:false});const bell=new THREE.Mesh(bg,bm);g.add(bell);
 const core=q5m_bead(1,GL(big?'#9fe0ff':'#f4fff8',.5),1);core.scale.set(.3,.26,.3);core.position.y=.3;g.add(core);
 const gm=M(big?'#ff9ab0':'#ffd6a0',{emissive:big?'#ff6a90':'#ffb060',emissiveIntensity:.5,roughness:.3});for(let i=0;i<4;i++){const gn=new THREE.Mesh(new THREE.TorusGeometry(.2,.035,3,8,Math.PI*1.3),gm);const a=i/4*6.283;gn.position.set(Math.cos(a)*.38,.42,Math.sin(a)*.38);gn.rotation.set(Math.PI/2,0,a);g.add(gn)}
 {const pts=[];for(let i=0;i<16;i++){const a=i/16*6.283;for(let j=0;j<5;j++){const t0=.12+j*.17,t1=t0+.17;const P=t=>{const r=Math.sin(t*Math.PI*.56)*.97,y=Math.cos(t*Math.PI*.5)*.9*.97;return V3(Math.cos(a)*r,y,Math.sin(a)*r)};pts.push(P(t0),P(Math.min(.98,t1)))}}
  g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:C(col).lerp(C('#ffffff'),.4),transparent:true,opacity:.45,depthWrite:false})))}
 // oral arms: four ruffled ribbons hanging from the middle
 const arms=[];const am=new THREE.MeshStandardMaterial({vertexColors:true,transparent:true,opacity:.62,side:THREE.DoubleSide,emissive:col,emissiveIntensity:.25,roughness:.3,depthWrite:false});
 for(let i=0;i<4;i++){const a=i/4*6.283+.4;const ag=new THREE.Group();ag.position.set(Math.cos(a)*.18,.05,Math.sin(a)*.18);ag.rotation.y=-a;g.add(ag);const L=big?2.2:1.3;
  ag.add(q5m_loft(Array.from({length:6},(_,j)=>{const t=j/5;return[t*.25+Math.sin(t*9)*.05,-t*L,Math.sin(t*7)*.06,.012,.11+.06*Math.sin(t*3.1)]}),col,{n:10,r:4,mat:am,backK:q5m_pale(col,.5),bellyK:'#ffffff'}));arms.push(ag)}
 // tentacles: thin lines that trail and sway (drawn fresh every frame)
 const NT=big?20:12,NS=10,tp=new Float32Array(NT*NS*2*3);const tgeo=new THREE.BufferGeometry();tgeo.setAttribute('position',new THREE.BufferAttribute(tp,3));
 const tl=new THREE.LineSegments(tgeo,new THREE.LineBasicMaterial({color:col,transparent:true,opacity:.6,blending:THREE.AdditiveBlending,depthWrite:false}));tl.frustumCulled=false;g.add(tl);
 if(big){// the white dragons' basket: a woven bowl hung on plant ropes, two of them looking over the edge
  const wv=M('#8a6a44',{roughness:.9,side:THREE.DoubleSide}),wv2=M('#6a5034',{roughness:.9}),bone=M('#efece2',{roughness:.6});
  const bk=new THREE.Mesh(new THREE.CylinderGeometry(.38,.28,.32,10,1,true),wv);bk.position.y=-3.2;g.add(bk);const fl=new THREE.Mesh(new THREE.CircleGeometry(.28,10),wv2);fl.rotation.x=Math.PI/2;fl.position.y=-3.36;g.add(fl);
  const rg=new THREE.Mesh(new THREE.TorusGeometry(.38,.018,3,8),wv2);rg.position.y=-3.04;rg.rotation.x=Math.PI/2;g.add(rg);
  const rp=[];for(let i=0;i<6;i++){const a=i/6*6.28;rp.push(V3(Math.cos(a)*.7,-.1,Math.sin(a)*.7),V3(Math.cos(a)*.37,-3.05,Math.sin(a)*.37))}g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(rp),new THREE.LineBasicMaterial({color:'#8a7a5a'})));
  for(const z of[-1,1]){const r=q5m_bead(1,bone,1);r.scale.set(.07,.12,.07);r.position.set(z*.12,-2.95,z*.1);g.add(r);const h=q5m_bead(1,bone);h.scale.set(.06,.05,.05);h.position.set(z*.16,-2.8,z*.13);g.add(h);const sn=q5m_cone(.03,.1,bone,4);sn.position.set(z*.2,-2.8,z*.17);sn.rotation.z=z>0?-Math.PI/2:Math.PI/2;g.add(sn)}}
 g.userData.anim=t=>{const k=1+Math.sin(t*1.8)*.08;bell.scale.set(k,1/k*.98,k);arms.forEach((a,i)=>{a.rotation.z=Math.sin(t*1.1+i)*.12;a.rotation.x=Math.cos(t*.9+i*1.7)*.1});
  let q=0;for(let i=0;i<NT;i++){const a=i/NT*6.28,r0=.8+.1*(i%2);let px=Math.cos(a)*r0,pz=Math.sin(a)*r0,py=-.05;for(let j=0;j<NS;j++){const nx=px+Math.sin(t*1.4+i+j*.5)*.05,nz=pz+Math.cos(t*1.2+i*1.3+j*.4)*.05,ny=py-(big?.42:.26);
   tp[q++]=px;tp[q++]=py;tp[q++]=pz;tp[q++]=nx;tp[q++]=ny;tp[q++]=nz;px=nx*.97;py=ny;pz=nz*.97}}tgeo.attributes.position.needsUpdate=true};
 return q5m_fuse(g)}

/* ---------------- 巨脉蜻蜓 and the plain dragonfly, 巨蜂 the two-metre bee, 轰炸者 the bomber ---------------- */
function q5m_bandColors(mesh,fn){const g=mesh.geometry,p=g.attributes.position,c=g.attributes.color;const t=new THREE.Color();for(let i=0;i<p.count;i++){t.setRGB(c.getX(i),c.getY(i),c.getZ(i));fn(t,p.getX(i),p.getY(i),p.getZ(i));c.setXYZ(i,t.r,t.g,t.b)}c.needsUpdate=true}
function bDragonfly(f){const id=f.w;const bomb=id==='hongzhazhe',bee=id==='jufeng';const g=new THREE.Group();const col=f.col||(bee?'#d8a030':'#3a6a8a');
 const o={rough:bee?.5:.3,metal:bee?0:.2};const dk=M(q5m_dk(col,.45),{roughness:.4}),legM=M(q5m_dk(col,.35),{roughness:.45});
 const L=[],legs=(n,x0,dx,y,z,l1,l2,l3,r,o2)=>{for(let i=0;i<n*2;i++){const s=i%2?1:-1,k=Math.floor(i/2);const l=q5m_ileg(l1,l2,l3,r,legM,Object.assign({h:.3,up:.3,tar:.5,rz:(1-k)*.55},o2||{}));l.position.set(x0-k*dx,y,s*z);l.scale.z=s;g.add(l);L.push({m:l,ph:k*1.3+(s>0?Math.PI:0),a:.25})}};
 if(bomb){// 轰炸者: built on the giant dragonfly, but gas sacs grow where the wings would be and the tail is far thicker, full of the organs
  // that make its bombs; it flies by jet and lays the bombs from the tail tip like a dragonfly laying eggs
  const bo=Object.assign({},o,{rough:.45,metal:0,stripe:0});
  g.add(q5m_loft([[.55,-.02,0,.12,.12],[.4,.08,0,.27,.25],[.1,.1,0,.3,.26],[-.15,.03,0,.2,.18]],col,Object.assign({n:10,r:10},bo)));
  const hd=new THREE.Group();hd.position.set(.58,.04,0);g.add(hd);hd.add(q5m_loft([[-.05,0,0,.14,.16],[.1,0,0,.16,.2],[.24,-.03,0,.1,.15],[.3,-.05,0,.03,.07]],col,Object.assign({n:6,r:10},bo)));
  for(const z of[-1,1]){const e=q5m_bead(1,M('#101820',{roughness:.06,metalness:.4}),1);e.scale.set(.12,.13,.11);e.position.set(.1,.06,z*.13);hd.add(e)}
  const ab=new THREE.Group();ab.position.set(-.12,.02,0);g.add(ab);
  // the thick tail: two bulges where the bombs are made, then the laying tip
  ab.add(q5m_loft([[0,0,0,.18,.17],[-.3,-.01,0,.26,.24],[-.6,-.04,0,.3,.28],[-.9,-.08,0,.27,.25],[-1.15,-.14,0,.29,.27],[-1.4,-.22,0,.17,.16],[-1.55,-.28,0,.06,.06]],col,Object.assign({n:18,r:10,stripe:7},bo)));
  const tip=q5m_bead(1,GL('#ffb050')),tipS=q5m_bead(1,M('#3a4030',{roughness:.5}));tip.scale.setScalar(.07);tip.position.set(-1.6,-.31,0);ab.add(tip);tipS.scale.setScalar(.09);tipS.position.set(-1.56,-.29,0);ab.add(tipS);
  // four gas sacs where the two pairs of wings would be, veined, swelling and easing
  const sacs=[],sm2=new THREE.MeshStandardMaterial({color:'#e8fff0',emissive:'#8ad8b8',emissiveIntensity:.3,transparent:true,opacity:.42,roughness:.15,depthWrite:false}),vm=new THREE.LineBasicMaterial({color:'#5a9a80',transparent:true,opacity:.35});
  const vein=[];for(let k=0;k<3;k++){const b=k/3*Math.PI;for(let j=0;j<10;j++){const a0=j/10*6.283,a1=(j+1)/10*6.283;vein.push(V3(Math.cos(a0)*Math.cos(b),Math.sin(a0),Math.cos(a0)*Math.sin(b)),V3(Math.cos(a1)*Math.cos(b),Math.sin(a1),Math.cos(a1)*Math.sin(b)))}}const vg=new THREE.BufferGeometry().setFromPoints(vein);
  for(const[x,s0]of[[.3,.42],[.02,.32]])for(const z of[-1,1]){const sg=new THREE.Group();sg.position.set(x,.3,z*(s0+.1));g.add(sg);const s=q5m_bead(1,sm2,1);s.scale.set(s0*1.1,s0*.8,s0);sg.add(s);const v=new THREE.LineSegments(vg,vm);v.scale.set(s0*1.1,s0*.8,s0);sg.add(v);sacs.push({sg,ph:x*3})}
  const jet=q5m_cyl(.05,.08,.12,M('#2a3038'),6);jet.rotation.z=Math.PI/2;jet.position.set(-.2,-.06,0);g.add(jet);
  legs(3,.42,.13,-.1,.12,.18,.24,.1,.026,{h:.2,up:.15,tar:.4,rz:0});
  for(const l of L)l.m.rotation.z+=.9;// legs folded back under the body in flight
  // (the legs hang still in flight, so they are not handed to the animation and fold into the body: fewer objects to move)
  for(const l of L)delete l.m.userData.knee;q5m_crawl(g,{extra:t=>{sacs.forEach(s=>{const k=1+Math.sin(t*1.6+s.ph)*.06;s.sg.scale.set(k,1/k,k)});ab.rotation.z=Math.sin(t*.9)*.05;hd.rotation.y=Math.sin(t*.7)*.12}});return q5m_fuse(g)}
 const wm=new THREE.MeshStandardMaterial({color:bee?'#eef2ff':'#c4dcee',transparent:true,opacity:bee?.42:.55,side:THREE.DoubleSide,roughness:.15,metalness:.3,depthWrite:false});
 // thorax, head, abdomen
 g.add(q5m_loft(bee?[[.45,-.02,0,.1,.1],[.3,.06,0,.27,.26],[0,.07,0,.28,.27],[-.25,.02,0,.17,.17]]:[[.55,-.02,0,.1,.11],[.42,.08,0,.23,.21],[.15,.1,0,.25,.21],[-.1,.02,0,.16,.14]],bee?'#4a3418':col,Object.assign({n:8,r:8},o)));
 const hd=new THREE.Group();hd.position.set(bee?.5:.6,.02,0);g.add(hd);hd.add(q5m_loft(bee?[[-.05,0,0,.15,.17],[.1,0,0,.16,.2],[.24,-.03,0,.1,.15],[.3,-.06,0,.03,.08]]:[[-.05,0,0,.13,.15],[.1,0,0,.15,.2],[.24,-.03,0,.09,.15],[.3,-.05,0,.03,.07]],bee?'#4a3418':col,Object.assign({n:6,r:8},o)));
 const eyeM=M(bee?'#1a1008':'#101820',{roughness:.06,metalness:.4});for(const z of[-1,1]){const e=q5m_bead(1,eyeM,1);e.scale.set(bee?.08:.12,bee?.12:.13,bee?.07:.11);e.position.set(.1,.05,z*(bee?.15:.13));hd.add(e);
  if(bee){const md=new THREE.Group();md.position.set(.27,-.08,z*.08);hd.add(md);md.add(q5m_loft([[0,0,0,.03,.03],[.15,-.01,-z*.03,.025,.025],[.26,-.02,-z*.09,.008,.008]],'#3a2410',{n:4,r:4,rough:.4}));(g.userData.jaws=g.userData.jaws||[]).push({m:md,z});
   const an=new THREE.Group();an.position.set(.2,.1,z*.06);hd.add(an);an.add(q5m_tube([0,1,2,3].map(j=>{const t=j/3;return V3(.42*t,.42*.5*Math.sin(t*1.8)-.3*.42*t*t,z*.4*.42*t)}),.01,dk,6))}
  else{const md=q5m_cone(.025,.1,q5m_DARK,4);md.position.set(.28,-.08,z*.05);md.rotation.z=-Math.PI/2-.3;md.rotation.x=-z*.5;hd.add(md)}}
 const ab=new THREE.Group();ab.position.set(bee?-.28:-.1,.02,0);g.add(ab);
 const abm=q5m_loft(bee?[[0,0,0,.18,.18],[-.3,0,0,.3,.28],[-.75,0,0,.29,.27],[-1.1,-.03,0,.18,.17],[-1.28,-.07,0,.05,.05]]:[[0,0,0,.12,.1],[-.5,.02,0,.1,.09],[-1.1,.02,0,.09,.08],[-1.6,0,0,.08,.07],[-1.85,-.03,0,.035,.035]],col,Object.assign({n:bee?12:18,r:bee?8:6},o,{stripe:bee?0:11,fresh:bee}));ab.add(abm);
 if(bee){q5m_bandColors(abm,(c,x)=>{if(Math.sin(x*14+1.2)>0)c.multiplyScalar(.14)});const st=q5m_cone(.03,.16,q5m_DARK,4);st.position.set(-1.36,-.08,0);st.rotation.z=Math.PI/2;ab.add(st);
  // the furry thorax
  const n=150,pa=new Float32Array(n*6),ca=new Float32Array(n*6);const c0=C('#8a6a30'),c1=C('#f4d890');for(let i=0,j=0;i<n;j++){const v=V3(h3(j,1,8)-.5,h3(j,2,8)-.5,h3(j,3,8)-.5).normalize();if(v.y<-.3)continue;const Lh=.06+h3(j,4,8)*.06;pa.set([.1+v.x*.27,.06+v.y*.26,v.z*.26,.1+v.x*(.27+Lh),.06+v.y*(.26+Lh),v.z*(.26+Lh)],i*6);ca.set([c0.r,c0.g,c0.b,c1.r,c1.g,c1.b],i*6);i++}
  const hg=new THREE.BufferGeometry();hg.setAttribute('position',new THREE.BufferAttribute(pa,3));hg.setAttribute('color',new THREE.BufferAttribute(ca,3));g.add(new THREE.LineSegments(hg,new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:.9})))}
 // wings: two pairs; the dragonfly's veined
 const W2=[];for(let k=0;k<2;k++)for(const z of[-1,1]){const w=q5m_iwing(bee?(k?.7:1.05):(k?1.5:1.6),bee?(k?.28:.42):(k?.38:.32),wm,{veins:bee?0:5,vein:'#2a3a40'});w.position.set((bee?.22:.4)-k*.22,bee?.28:.2,z*.08);if(z<0)w.scale.z=-1;g.add(w);W2.push({m:w,s:z,a:bee?.5:.6,f:bee?26:30,ph:k*.6})}
 // six legs under the thorax, the front pair reaching forward
 legs(3,bee?.35:.46,.14,-.1,bee?.16:.12,bee?.2:.16,bee?.27:.21,bee?.1:.08,bee?.03:.02,{h:.24,spines:bee?1:0});
 if(bee){const pb=q5m_bead(.045,M('#f0c060',{roughness:.9}));pb.position.set(0,-.12,.04);L[4].m.userData.knee.add(pb);L[5].m.userData.knee.add(pb.clone())}
 for(const l of L)delete l.m.userData.knee;addWings(g,W2);q5m_crawl(g,{extra:t=>{ab.rotation.z=Math.sin(t*2.1)*.06;hd.rotation.y=Math.sin(t*.9)*.15;if(g.userData.jaws)for(const j of g.userData.jaws)j.m.rotation.y=j.z*(-.1-Math.max(0,Math.sin(t*2.4))*.35)}});return q5m_fuse(g)}

/* ---------------- 炸弹翼龙: a seven-metre span on arm and finger bones, a long toothless beak ---------------- */
function bPterosaur(f){const g=new THREE.Group();const col=f.col||'#b8643a';const o={rough:.6};const mat=M(col,{roughness:.6}),mem=M(q5m_dk(col,.9),{side:THREE.DoubleSide,roughness:.72}),bone=M(q5m_dk(col,.7),{roughness:.5});
 g.add(q5m_loft([[.5,0,0,.1,.1],[.25,.05,0,.18,.16],[-.1,.04,0,.17,.15],[-.42,0,0,.08,.07],[-.6,-.02,0,.02,.02]],col,Object.assign({n:8,r:6},o)));
 const nk=new THREE.Group();nk.position.set(.48,.02,0);g.add(nk);
 // neck, skull and the long upper beak in one skin; the lower beak opens
 nk.add(q5m_loft([[-.04,0,0,.09,.085],[.2,.09,0,.075,.07],[.4,.15,0,.085,.075],[.56,.16,0,.07,.06],[.85,.13,0,.035,.03],[1.32,.08,0,.006,.006]],col,Object.assign({n:12,r:6},o,{bellyK:'#f0e8d8'})));
 const jaw=new THREE.Group();jaw.position.set(.58,.11,0);nk.add(jaw);jaw.add(q5m_loft([[0,0,0,.028,.045],[.35,-.01,0,.02,.03],[.7,-.03,0,.005,.005]],'#d8c8a0',{n:4,r:4}));
 q5m_eyes(nk,.48,.19,.06,.025,M('#ffd060',{roughness:.15}),0);
 // wings: the membrane, a leading-edge bone along the arm and the long fourth finger, three small clawed fingers at the wrist
 const W2=[];for(const z of[-1,1]){const w=new THREE.Group();w.position.set(.12,.1,z*.14);g.add(w);w.add(new THREE.Mesh(q5m_wingGeo(2.1,.7,'bat'),mem));
  w.add(q5m_tube([V3(0,.02,0),V3(.2,.06,.35),V3(.385,.05,.73),V3(.3,.03,1.3),V3(.17,0,2.08)],.028,bone,8));
  for(let i=0;i<3;i++){const c=q5m_cone(.012,.07,M('#e8dcc0',{roughness:.4}),4);c.position.set(.42+i*.03,.04,.72-i*.02);c.rotation.z=-Math.PI/2+.5-i*.35;w.add(c)}
  if(z<0)w.scale.z=-1;W2.push({m:w,s:z,a:.45,f:2})}
 for(const z of[-1,1]){const l=new THREE.Group();l.position.set(-.3,-.04,z*.1);l.rotation.z=-1.2;g.add(l);l.add(new THREE.Mesh(q5m_mus(.17,.03,[1,.8,.6],4),mat));const sh=new THREE.Mesh(q5m_mus(.17,.022,[1,.7,.5],4),mat);sh.position.y=-.17;l.add(sh);const ft=q5m_cone(.025,.08,mat,4);ft.position.y=-.36;l.add(ft)}
 addWings(g,W2);stdAnim(g,{wf:2,wa:.45,extra:t=>{nk.rotation.z=Math.sin(t*1.2)*.06;jaw.rotation.z=-Math.max(0,Math.sin(t*.8))*.2;for(const w of W2)w.m.rotation.y=w.s*Math.sin(t*2-.6)*.08}});return q5m_fuse(g)}

/* ---------------- 立蝎: the scorpions that stand up — plated torso, pincer arms, two clawed legs, a tail carried behind ---------------- */
function bUpright(f){if(f.w==='rq_gujia')return bUprightPlain(f);const g=new THREE.Group();const col=f.col||'#b08a5a';
 const o={rough:.45,metal:.05,stripe:7};const mat=M(col,{roughness:.45}),plate=M(q5m_dk(col,.7),{roughness:.4,metalness:.1});
 g.add(q5m_loft([[-.05,.95,0,.22,.26],[0,1.2,0,.3,.33],[.08,1.5,0,.3,.33],[.15,1.75,0,.22,.26],[.2,1.95,0,.12,.16]],col,Object.assign({n:12,r:10},o)));
 const pg=q5m_sphG(1,8,3,0,Math.PI,0,Math.PI*.45);for(let i=0;i<4;i++){const p=new THREE.Mesh(pg,plate);p.scale.set(.15,.3,.33-Math.abs(i-1.5)*.03);p.position.set(-.08+i*.06,1.08+i*.21,0);p.rotation.set(0,-Math.PI/2,-.35);g.add(p)}
 const hd=new THREE.Group();hd.position.set(.22,2.0,0);g.add(hd);hd.add(q5m_loft([[-.12,0,0,.14,.2],[.1,.02,0,.13,.2],[.3,-.03,0,.06,.1]],col,Object.assign({n:6,r:8},o,{stripe:0})));
 q5m_eyes(hd,.02,.11,.06,.035,q5m_DARK,0);q5m_eyes(hd,.06,.06,.17,.02,q5m_DARK,0);q5m_eyes(hd,-.04,.06,.16,.02,q5m_DARK,0);
 for(const z of[-1,1]){const ch=q5m_cone(.025,.1,plate,4);ch.position.set(.32,-.06,z*.04);ch.rotation.z=-Math.PI/2-.3;hd.add(ch)}
 const arms=[];for(const z of[-1,1]){const a=q5m_arm(g,.15,1.72,z*.3,z,.34,.3,.055,mat,col,{yaw:.35,pitch:.9,fold:.9,wrist:.3,cl:.25,cr:.08,lo:o});arms.push(a);
  if(z>0&&f.e&&f.e.includes(3)){const cr=new THREE.Mesh(new THREE.OctahedronGeometry(.12,0),EM('#bff4ff',.6,{roughness:.1}));cr.position.set(.45,0,0);cr.scale.y=1.5;a.ch.add(cr)}}
 // four small legs left over from the scorpion it once was, folded against the belly
 for(let i=0;i<4;i++){const s=i%2?1:-1;const l=new THREE.Group();l.position.set(-.06,1.06+Math.floor(i/2)*.16,s*.24);l.rotation.set(s*.9,0,-.5);g.add(l);l.add(new THREE.Mesh(q5m_mus(.15,.022,[1,.85,.7],6),mat));const t=new THREE.Mesh(q5m_mus(.13,.017,[1,.7,.4],6),mat);t.position.y=-.15;t.rotation.x=-s*.9;l.add(t)}
 // two walking legs: thigh, knee, shin, a clawed three-toed foot
 const L=[];for(const z of[-1,1]){const l=new THREE.Group();l.position.set(0,.98,z*.19);g.add(l);l.add(new THREE.Mesh(q5m_mus(.5,.08,[.8,1.1,1.05,.9,.75],6),mat));
  const k=new THREE.Group();k.position.y=-.5;k.rotation.z=.45;l.add(k);k.add(q5m_bead(.065,mat));k.add(new THREE.Mesh(q5m_mus(.47,.07,[.95,.9,.75,.6],6),mat));
  const ft=new THREE.Group();ft.position.y=-.47;ft.rotation.z=-.45;k.add(ft);const pad=q5m_bead(1,mat);pad.scale.set(.1,.04,.09);pad.position.set(.04,-.01,0);ft.add(pad);
  for(let i=-1;i<=1;i++){const c=q5m_cone(.025,.13,plate,4);c.position.set(.13,-.03,i*.05);c.rotation.set(0,i*.35,-Math.PI/2-.2);ft.add(c)}l.userData.knee=k;L.push({m:l,ph:z>0?0:Math.PI,k:.45})}
 const tl=new THREE.Group();tl.position.set(-.12,1.0,0);g.add(tl);{const pts=[];let px=0,py=0;for(let i=0;i<=7;i++){const th=i*.4-.7;pts.push([px,py,0,.11-i*.012,.11-i*.012]);px-=Math.cos(th)*.22;py+=Math.sin(th)*.22}tl.add(q5m_loft(pts,col,Object.assign({n:16,r:8},o)));
  const st=q5m_cone(.03,.16,plate,4);st.position.set(pts[7][0],pts[7][1],0);st.rotation.z=.6;tl.add(st)}
 addLegs(g,L);g.userData.tails=[{m:tl,a:.15,f:2}];
 stdAnim(g,{fq:7,amp:.45,extra:t=>{arms.forEach((x,i)=>{x.sh.rotation.z=-.9+Math.sin(t*1.4+i*2)*.15;x.ch.userData.jaw.rotation.y=x.z*(.1+Math.max(0,Math.sin(t*1.9+i))*.4)});hd.rotation.y=Math.sin(t*.7)*.2;tl.rotation.z=Math.sin(t*1.3)*.05}});return q5m_fuse(g)}

/* ---------------- squid: a tapered mantle with fins, big eyes, eight arms and two longer tentacles with clubs, colour that drifts ---------------- */
function bSquid(f){const g=new THREE.Group();const col=f.col||'#c86a5a';const skin=new THREE.MeshStandardMaterial({color:col,vertexColors:true,roughness:.4,emissive:'#5a2a8a',emissiveIntensity:.2});const o={mat:skin};
 const mt=q5m_loft([[-1.05,0,0,.03,.03],[-.75,0,0,.16,.14],[-.35,0,0,.27,.24],[.05,0,0,.3,.27],[.42,0,0,.27,.25]],col,Object.assign({n:12,r:10},o));g.add(mt);
 const finM=M(q5m_dk(col,.8),{side:THREE.DoubleSide,roughness:.4});for(const z of[-1,1]){const fn=new THREE.Mesh(q5m_wg(.35,.5,'fin'),finM);fn.position.set(-.85,0,z*.1);fn.rotation.z=Math.PI;fn.rotation.y=Math.PI;if(z<0)fn.scale.z=-1;g.add(fn)}
 const hd=new THREE.Group();hd.position.x=.44;g.add(hd);hd.add(q5m_loft([[0,0,0,.26,.24],[.2,0,0,.24,.23],[.4,-.01,0,.17,.17]],col,Object.assign({n:6,r:10},o)));
 for(const z of[-1,1]){const w=q5m_bead(1,q5m_EYEW,1);w.scale.set(.11,.11,.07);w.position.set(.22,.04,z*.2);hd.add(w);const pu=q5m_bead(1,q5m_DARK);pu.scale.set(.06,.06,.04);pu.position.set(.23,.04,z*.245);hd.add(pu)}
 const sip=q5m_cyl(.03,.045,.18,M(q5m_dk(col,.7)),6);sip.rotation.z=Math.PI/2-.4;sip.position.set(.1,-.22,0);hd.add(sip);
 const arms=[];for(let i=0;i<8;i++){const a=i/8*6.283+.39;const ag=new THREE.Group();ag.position.set(.6,Math.cos(a)*.12,Math.sin(a)*.12);ag.rotation.x=-a;g.add(ag);ag.add(q5m_loft([[0,0,0,.045,.045],[.35,.05,0,.035,.035],[.7,.08,0,.02,.02],[.95,.04,0,.006,.006]],col,Object.assign({n:6,r:5},o)));arms.push(ag)}
 for(const z of[-1,1]){const tg2=new THREE.Group();tg2.position.set(.6,-.04,z*.08);g.add(tg2);tg2.add(q5m_loft([[0,0,0,.03,.03],[.6,.02,0,.02,.02],[1.2,.04,0,.015,.015],[1.4,.04,0,.05,.035],[1.62,.03,0,.01,.01]],col,Object.assign({n:9,r:5},o)));arms.push(tg2)}
 g.userData.anim=t=>{arms.forEach((a,i)=>{a.rotation.y=Math.sin(t*2+i)*.22;a.rotation.z=Math.cos(t*1.7+i)*.18});const k=1+Math.sin(t*2.2)*.05;mt.scale.set(1,k,k);skin.emissive.setHSL((t*.05)%1,.6,.25)};g.userData.swim=1;return q5m_fuse(g)}

/* ---------------- 巨轮虫: a centipede curled into a two-metre wheel, sickle hooks on its back plates, legs tucked inside ---------------- */
function bWheel(f){const g=new THREE.Group();const col=f.col||'#6a4a2a';const o={rough:.45};const bone=M('#d8c8a0',{roughness:.45}),leg=M(q5m_dk(col,.6),{roughness:.5});
 const w=new THREE.Group();w.position.y=1.08;g.add(w);const N=18,R0=.66;const spec=[];for(let i=0;i<=N*2;i++){const a=i/(N*2)*6.283;const k=i%2;spec.push([Math.cos(a)*R0,Math.sin(a)*R0,0,.17+(k?.04:-.03),.24+(k?.05:-.04)])}
 w.add(q5m_loft(spec,col,Object.assign({n:N*3,r:8},o)));
 for(let i=0;i<N;i++){const a=(i+.5)/N*6.283,ca=Math.cos(a),sa=Math.sin(a);const P=(rad,tng)=>V3(ca*rad-sa*tng,sa*rad+ca*tng,0);
  w.add(q5m_tube([P(R0+.17,0),P(R0+.27,.07),P(R0+.37,.16),P(R0+.42,.13)],.022,bone,4));
  for(const z of[-1,1]){const l=q5m_cone(.016,.17,leg,4);const b=(i+.25)/N*6.283;l.position.set(Math.cos(b)*(R0-.22),Math.sin(b)*(R0-.22),z*.16);l.rotation.z=b+Math.PI/2;l.rotation.x=-z*.3;w.add(l)}}
 // the head, biting onto its own tail
 const hd=new THREE.Group();hd.position.set(R0,0,0);w.add(hd);hd.add(q5m_loft([[.1,-.22,0,.2,.28],[.08,0,0,.22,.3],[.05,.2,0,.18,.26],[0,.34,0,.08,.14]],col,Object.assign({n:6,r:8},o,{backK:'#a8a49c'})));
 for(const z of[-1,1]){const e=q5m_bead(.04,q5m_DARK);e.position.set(.24,.2,z*.14);hd.add(e);const m=q5m_cone(.03,.16,bone,4);m.position.set(.1,.42,z*.1);m.rotation.x=-z*.6;hd.add(m);
  hd.add(q5m_tube([0,1,2,3].map(j=>{const t=j/3;return V3(.1+.5*t*Math.cos(1.3)-.1*t,.36+.5*t*Math.sin(1.3),z*(.08+.15*t))}),.012,leg,5))}
 g.userData.anim=t=>{w.rotation.z=-t*6};return q5m_fuse(g)}

/* ---------------- swarms: the clouds of points become small flapping bodies (a sprite sheet of four frames; each point its own
   size, heading and beat), still driven by the herd code through the position attribute ---------------- */
const q5m_bugTexC={};
function q5m_bugTex(kind){if(q5m_bugTexC[kind])return q5m_bugTexC[kind];const t=canvasTex(256,64,(x)=>{for(let f=0;f<4;f++){x.save();x.translate(f*64+32,32);x.fillStyle='rgba(255,255,255,1)';x.strokeStyle='rgba(255,255,255,1)';x.lineWidth=2;
  const el=(cx,cy,rx,ry,rot,a)=>{x.save();x.globalAlpha=a===undefined?1:a;x.translate(cx,cy);x.rotate(rot||0);x.beginPath();x.ellipse(0,0,rx,ry,0,0,6.283);x.fill();x.restore()};
  const ln=(x0,y0,x1,y1)=>{x.beginPath();x.moveTo(x0,y0);x.lineTo(x1,y1);x.stroke()};const ph=f/4*6.283;
  if(kind==='butterfly'){const sp=.35+.65*Math.abs(Math.cos(ph));for(const s of[-1,1]){el(s*13*sp,-6,13*sp,11,s*.3,.95);el(s*10*sp,9,9*sp,8,-s*.4,.85)}el(0,0,3,13);ln(-1,-12,-6,-20);ln(1,-12,6,-20)}
  else if(kind==='wing'){el(0,2,4,15);el(0,-10,5,5);const wa=-.4+.5*Math.sin(ph);for(const s of[-1,1]){el(s*13,-2,14,4.5,s*wa,.55);el(s*9,3,9,3.5,s*(wa+.5),.45)}ln(-2,-14,-8,-24);ln(2,-14,8,-24)}
  else{el(0,4,6,11);el(0,-8,5,6);el(0,-17,4,4);for(let i=0;i<3;i++)for(const s of[-1,1]){const k=Math.sin(ph+i*2.1)*4;ln(s*4,-6+i*7,s*16,-12+i*7+k);ln(s*16,-12+i*7+k,s*20,-4+i*7+k)}ln(-2,-20,-9,-28);ln(2,-20,9,-28)}
  x.restore()}});t.needsUpdate=true;return q5m_bugTexC[kind]=t}
function bSwarm(f){const id=f.w;const n=id==='huangchong'?260:id==='hongshidie'?140:180,g=new THREE.BufferGeometry(),a=new Float32Array(n*3);g.setAttribute('position',new THREE.BufferAttribute(a,3));
 const r=new Float32Array(n*3);for(let i=0;i<n;i++){r[i*3]=.65+h3(i,1,5)*.75;r[i*3+1]=h3(i,2,5)*6.283;r[i*3+2]=(f.alt?8:3)+h3(i,3,5)*4}g.setAttribute('aR',new THREE.BufferAttribute(r,3));
 const glowy=id==='hongshidie'||id==='kuangfeng';const kind=id==='hongshidie'?'butterfly':(f.alt||id==='huangchong'||id==='kuangfeng')?'wing':'bug';
 const m=new THREE.PointsMaterial({map:q5m_bugTex(kind),color:f.col,size:f.alt?(glowy?2.2:1.6):1.1,transparent:true,depthWrite:false,blending:glowy?THREE.AdditiveBlending:THREE.NormalBlending,opacity:glowy?1:.95,alphaTest:.04});
 const U={uT:{value:0}};m.onBeforeCompile=sh=>{sh.uniforms.uT=U.uT;sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nattribute vec3 aR;varying vec3 vR;').replace('gl_PointSize = size;','gl_PointSize = size * aR.x;vR = aR;');
  // (the map lookup lives in a shader chunk, so it is the chunk's include that gets replaced: turn the point, pick the frame)
  sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vR;uniform float uT;').replace('#include <map_particle_fragment>','vec2 q=vec2(gl_PointCoord.x,1.0-gl_PointCoord.y)-.5;float cr=cos(vR.y),sr=sin(vR.y);q=vec2(q.x*cr-q.y*sr,q.x*sr+q.y*cr);if(abs(q.x)>.5||abs(q.y)>.5)discard;float fr=floor(mod(uT*vR.z/6.283+vR.y,1.)*4.);vec4 mapTexel=texture2D(map,vec2((q.x+.5+fr)*.25,q.y+.5));diffuseColor*=mapTexelToLinear(mapTexel);')};
 const p=new THREE.Points(g,m);p.userData.swarm=a;p.userData.free=1;
 // the herd code only touches the position attribute; its needsUpdate is the swarm's clock
 const at=g.attributes.position;Object.defineProperty(at,'needsUpdate',{set(v){if(v===true){this.version++;U.uT.value=(performance.now()/1000)%1000}},get(){return false}});
 return p}

/* ---------------- huts: the mounds get a stone-framed doorway and a few stones pressed into their walls (cone huts and cabins as before) ---------------- */
function bHuts(o){o=Object.assign({n:8,r:2.6,col:'#8a7a5a',roof:'#5a4a3a',kind:'cone'},o||{});if(o.kind!=='mound')return bHutsPlain(o);const g=new THREE.Group();
 const wall=M(o.col,{roughness:.9}),dark=M('#1a120c'),stone=M(q5m_dk(o.col,.72),{roughness:.95});
 for(let i=0;i<o.n;i++){const a=i/o.n*6.28+h3(i,1,9),d=o.r*(.4+h3(i,2,9)*.6);const h=new THREE.Group();
  h.add(new THREE.Mesh(q5m_sphG(.8,12,8,0,6.283,0,1.57),wall));
  for(let k=0;k<4;k++){const b=k*1.9+1.2,el=.25+h3(k+i,6,9)*.8;const st=q5m_bead(.09+h3(k+i,5,9)*.07,stone);st.scale.y*=.7;st.position.set(Math.cos(b)*Math.cos(el)*.8,Math.sin(el)*.8,Math.sin(b)*Math.cos(el)*.8);h.add(st)}
  const hole=new THREE.Mesh(new THREE.CircleGeometry(.22,10),dark);hole.position.set(.77,.24,0);hole.rotation.y=Math.PI/2;h.add(hole);
  for(const z of[-1,1]){const p=new THREE.Mesh(q5m_box(.09,.5,.09),stone);p.position.set(.76,.25,z*.25);h.add(p)}const lt=new THREE.Mesh(q5m_box(.11,.1,.62),stone);lt.position.set(.74,.52,0);h.add(lt);
  h.position.set(Math.cos(a)*d,0,Math.sin(a)*d);h.rotation.y=-a+Math.PI;h.scale.setScalar(.7+h3(i,3,9)*.6);g.add(h)}g.add(shadow(o.r*1.2));return q5m_fuse(g)}

/* ---------------- street life in the dragon-style towns: a cart with spoked wheels, rails and a load; crates with bands, a hooped
   barrel and a sack; a lamp with a bracket arm and a hanging lantern. The other town styles keep their own designs ---------------- */
function q5m_cart(P){const parts=[];const wheel=(x,z,r)=>{parts.push([kcy(r,r,.12,12),P.wood2,{p:[x,r,z],r:[Math.PI/2,0,0]}],[kcy(r*.2,r*.2,.18,6),P.metal,{p:[x,r,z],r:[Math.PI/2,0,0]}]);for(let i=0;i<2;i++)parts.push([kb(.06,r*1.85,.05),P.wood,{p:[x,r,z+(z>0?.065:-.065)],r:[0,0,i*Math.PI/2+.4]}])};
 for(let i=0;i<4;i++)parts.push([kb(1.7,.06,.27),P.wood,{p:[0,.78,-.42+i*.28]}]);parts.push([kb(1.8,.1,.1),P.wood2,{p:[0,.72,.5]}],[kb(1.8,.1,.1),P.wood2,{p:[0,.72,-.5]}]);
 for(const z of[-1,1]){for(let i=0;i<3;i++)parts.push([kb(.06,.48,.06),P.wood2,{p:[-.75+i*.75,1.05,z*.55]}]);parts.push([kb(1.7,.06,.06),P.wood,{p:[0,1.28,z*.55]}],[kb(1.6,.06,.06),P.wood2,{p:[1.7,.72,z*.3],r:[0,0,.1]}])}
 wheel(0,.66,.5);wheel(0,-.66,.5);parts.push([kb(.07,.5,1.16),P.wood,{p:[-.8,1.05,0]}]);
 parts.push([kb(.55,.45,.55),P.load,{p:[-.2,1.05,.1],r:[0,.3,0]}],[kcy(.24,.24,.55,8),P.wood2,{p:[.38,1.09,-.18]}],[tg(new THREE.SphereGeometry(.26,6,4),{s:[1.1,.75,1]}),P.sack,{p:[.32,1.0,.28]}]);
 return G(parts.concat(BEAST(3.1)))}
function q5m_crate(P){return G([[kb(.74,.74,.74),P.wood2,{p:[0,.37,0]}],...[0,1].map(k=>[kb(.78,.1,.78),P.wood,{p:[0,.2+k*.36,0]}]),...[-1,1].map(a=>[kb(.07,.76,.07),P.wood,{p:[a*.36,.38,.36]}]),
  [kb(.5,.5,.5),P.wood,{p:[.55,.25,.45],r:[0,.45,0]}],[kcy(.26,.3,.74,8),P.wood2,{p:[-.6,.37,.3]}],[kcy(.31,.31,.05,8),P.metal,{p:[-.6,.2,.3]}],[kcy(.31,.31,.05,8),P.metal,{p:[-.6,.58,.3]}],
  [tg(new THREE.SphereGeometry(.26,6,4),{s:[1.1,.8,1.1]}),P.sack,{p:[.2,.2,-.55]}]])}
function q5m_lamp(P){const h=P.h||2.6;return G([[kcy(.07,.09,h,6),P.metal,{p:[0,h/2,0]}],[kcy(.15,.18,.12,6),P.metal,{p:[0,.06,0]}],[kb(.52,.06,.06),P.metal,{p:[.22,h-.1,0]}],
  [kb(.22,.3,.22),P.glass,{p:[.44,h-.42,0]}],[kb(.27,.03,.27),P.metal,{p:[.44,h-.58,0]}],[tg(new THREE.ConeGeometry(.2,.14,4),{r:[0,Math.PI/4,0]}),P.metal,{p:[.44,h-.2,0]}]])}

// 大眼龙 makes the salamander's eyes 2.6 times bigger by looking for the old body's eye spheres; the new body takes the size instead
function q5m_bigEyeLizard(){q5m_eyeK=2.6;try{return bBigEyeLizard.apply(this,arguments)}finally{q5m_eyeK=1}}
