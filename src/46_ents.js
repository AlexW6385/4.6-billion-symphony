/* ================================================================
   which body each entry gets, and how it is set into its world
   ================================================================ */
function bCrystal(col){const g=new THREE.Group();const c=new THREE.Mesh(ko(.45),EM(col||'#e0fbff',.9,{roughness:.05,flatShading:true}));c.scale.y=1.7;c.position.y=.9;g.add(c);for(let i=0;i<5;i++){const s=new THREE.Mesh(ko(.15),c.material);const a=i/5*6.28;s.position.set(Math.cos(a)*.5,.2,Math.sin(a)*.5);s.scale.y=1.6;s.rotation.z=Math.cos(a)*.4;g.add(s)}
 g.add(at(glowSprite(col||'#e0fbff',3,.6),0,.9,0));g.userData.anim=t=>{c.rotation.y=t*.6};return g}
function bDragonTree(){const g=new THREE.Group();const t=new THREE.Mesh(geoC('broad'),VC());t.scale.setScalar(.22);g.add(t);for(let i=0;i<18;i++){const b=sph(0,.12,.12,.12,8,EM('#a85ad8',.35));b.position.set((h3(i,1,2)-.5)*3.2,3+h3(i,2,2)*1.6,(h3(i,3,2)-.5)*3.2);g.add(b)}
 const ds=[];for(let i=0;i<3;i++){const d=bLizard({col:'#6a5a3a'});d.scale.setScalar(.35);g.add(d);ds.push({d,ph:i*2})}g.add(shadow(2));g.userData.anim=t=>ds.forEach((x,i)=>{const y=.5+((t*.2+x.ph*.3)%1)*2.5;const a=i*2.1;x.d.position.set(Math.cos(a)*.4,y,Math.sin(a)*.4);x.d.rotation.set(0,-a,Math.PI/2);x.d.userData.anim&&x.d.userData.anim(t)});return g}
function bTwinTree(){const g=new THREE.Group();const bark=M('#6a5038',{roughness:.9});for(let k=0;k<2;k++){const pts=[];for(let i=0;i<=14;i++){const y=i*.45,a=i*.7+k*Math.PI;pts.push(V3(Math.cos(a)*.45,y,Math.sin(a)*.45))}const tr=tubeAlong(pts,.2-k*.03,bark,40);g.add(tr)}
 const top=[];for(let i=0;i<=20;i++){const a=i/20*6.28*1.5,r=.5+i*.1;top.push(V3(Math.cos(a)*r,6.4+Math.sin(i*.4)*.1,Math.sin(a)*r))}g.add(tubeAlong(top,.22,bark,40));const pl=new THREE.Mesh(new THREE.CircleGeometry(2.3,20),M('#4a7a3a',{side:THREE.DoubleSide}));pl.rotation.x=-Math.PI/2;pl.position.y=6.5;g.add(pl);
 for(let i=0;i<8;i++){const l=sph(0,.6,.25,.5,8,M(i%2?'#3f7a36':'#5a9a44'));l.position.set((h3(i,1,8)-.5)*3.4,6.7,(h3(i,2,8)-.5)*3.4);g.add(l)}const moss=new THREE.Mesh(new THREE.CircleGeometry(1.6,20),EM('#7ad890',.25));moss.rotation.x=-Math.PI/2;moss.position.y=.05;g.add(moss);return g}
function bMayaNest(){const g=new THREE.Group();g.add(bHuts({n:6,r:2.4,col:'#7a6a58',kind:'mound'}));const rk=new THREE.Mesh(new THREE.ConeGeometry(1.5,3.2,7,3),detailMat(M('#6e6458',{roughness:.95,flatShading:true}).clone(),{bump:1,freq:2}));rk.position.y=1.6;g.add(rk);
 for(let i=0;i<4;i++){const h=new THREE.Mesh(new THREE.CircleGeometry(.25,10),M('#140c08'));const a=i*1.6;h.position.set(Math.cos(a)*1.1,.7+i*.45,Math.sin(a)*1.1);h.lookAt(V3(Math.cos(a)*5,.7+i*.45,Math.sin(a)*5));g.add(h)}
 const br=bMaya();br.scale.setScalar(.35);br.position.set(0,3.3,0);g.add(br);const qs=[];for(let i=0;i<5;i++){const b=bBeetle({w:'x',col:'#5a4a3a'});b.scale.setScalar(.35);g.add(b);qs.push({b,a:i*1.25})}
 g.userData.anim=t=>{br.userData.anim&&br.userData.anim(t);qs.forEach((x,i)=>{const a=x.a+t*.25;x.b.position.set(Math.cos(a)*2.6,0,Math.sin(a)*2.6);x.b.rotation.y=-a-Math.PI/2;x.b.userData.anim&&x.b.userData.anim(t)})};return g}
function bPlague(){const g=new THREE.Group();for(let i=0;i<9;i++){const m=new THREE.Mesh(geoC(i%2?'mush':'mush2'),VC({emissive:'#5a2a8a',emissiveIntensity:.25}));m.position.set((h3(i,1,3)-.5)*4,0,(h3(i,2,3)-.5)*4);m.scale.setScalar(.12+h3(i,3,3)*.12);g.add(m)}
 const cap=new THREE.Mesh(new THREE.SphereGeometry(1.4,16,8,0,6.283,0,1.4),M('#8a4ac8',{roughness:.6,emissive:'#4a1a7a',emissiveIntensity:.3}));cap.scale.y=.5;cap.position.y=1.8;g.add(cap);const st=cyl(.25,.4,1.8,M('#d8c8e0'),8);st.position.y=.9;g.add(st);
 g.add(emitter({n:60,life:4,speed:.5,spread:1,size:.6,dir:[0,1,0],col:'#c88aff',op:.7,area:[4,1,4],wander:.6}));const sw=emitter({n:90,life:3,speed:2,spread:1.2,size:.35,dir:[0,1,0],col:'#7a3aa8',op:.9,add:false,area:[2,2,2],wander:2});sw.position.y=3;g.add(sw);return g}
function bSupplier(){const g=new THREE.Group();const b=bDragonfly({w:'jumai',col:'#5a7a4a'});b.scale.setScalar(2);g.add(b);const sac=sph(0,.5,.4,.4,12,new THREE.MeshStandardMaterial({color:'#9aff7a',transparent:true,opacity:.55,emissive:'#4ac83a',emissiveIntensity:.4,depthWrite:false}));sac.position.set(-.3,-.1,0);g.add(sac);
 g.add(at(emitter({n:40,life:3,speed:1.5,spread:.3,size:.35,dir:[0,-1,0],col:'#9aff7a',op:.95,area:[.3,.2,.3],grav:.2}),0,-.3,0));g.userData.anim=t=>{b.userData.anim&&b.userData.anim(t);g.position.y=Math.sin(t*.8)*.3};return g}
function bSacs(){const g=new THREE.Group();const s=[];for(let i=0;i<6;i++){const k=new THREE.Group();const b=sph(0,.3,.28,.28,12,new THREE.MeshStandardMaterial({color:'#d8e870',transparent:true,opacity:.75,emissive:'#7a8a20',emissiveIntensity:.3,roughness:.2}));b.position.y=.35;k.add(b);
  for(let j=0;j<6;j++){const l=leg2(.18,.2,.025,M('#5a5a2a'),.9);l.position.set((j%3-1)*.12,.3,(j<3?-1:1)*.15);l.rotation.x=(j<3?-1:1)*.8;k.add(l)}k.position.set((i%3-1)*.8,0,(Math.floor(i/3)-.5)*.8);g.add(k);s.push(k)}
 const pool=new THREE.Mesh(new THREE.CircleGeometry(1.6,20),new THREE.MeshStandardMaterial({color:'#c8d850',transparent:true,opacity:.5,roughness:.1}));pool.rotation.x=-Math.PI/2;pool.position.y=.03;g.add(pool);
 g.userData.anim=t=>s.forEach((k,i)=>{const q=.8+.4*(.5+.5*Math.sin(t*.7+i));k.children[0].scale.setScalar(.3*q);k.position.y=Math.abs(Math.sin(t*6+i))*.05});return g}
function bReader(){const g=new THREE.Group();const host=bQuadSmall({w:'x',col:'#6a5a4a'});g.add(host);const j=bJelly({w:'x',col:'#c8a8ff'});j.scale.setScalar(.45);j.position.set(.9,1.4,0);g.add(j);
 for(let i=0;i<6;i++){const a=i/6*6.28;g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([V3(.9,1.2,0),V3(.9+Math.cos(a)*.15,.85,Math.sin(a)*.15),V3(.85,.6,Math.sin(a)*.1)]),new THREE.LineBasicMaterial({color:'#e8d8ff'})))}
 g.add(at(glowSprite('#c8a8ff',1.6,.5),.9,1.3,0));g.userData.anim=t=>{j.userData.anim&&j.userData.anim(t)};return g}
function bSquids(o){o=o||{};const g=new THREE.Group();const ss=[];for(let i=0;i<(o.n||6);i++){const s=bSquid({col:o.col||'#6a7aa8'});s.scale.setScalar(o.s||.45);for(let k=0;k<4;k++){const r=new THREE.Mesh(new THREE.TorusGeometry(.18,.035,4,14),EM(o.ring||'#3a8aff',.8));r.position.set(-.2+k*.25,.25,(k%2?1:-1)*.12);r.rotation.x=Math.PI/2;s.add(r)}g.add(s);ss.push({s,a:i/(o.n||6)*6.28})}
 if(o.glow)g.add(at(glowSprite(o.glow,4,.4),0,.8,0));g.userData.anim=t=>ss.forEach((x,i)=>{const a=x.a+t*.3;x.s.position.set(Math.cos(a)*1.2,.6+Math.sin(t+i)*.2,Math.sin(a)*1.2);x.s.rotation.y=-a-Math.PI/2;x.s.userData.anim&&x.s.userData.anim(t)});return g}
function bTrio(list){const g=new THREE.Group();list.forEach((o,i)=>{const f=bDragonFig(o);f.position.set((i-(list.length-1)/2)*1.6,0,Math.abs(i-(list.length-1)/2)*.5);f.rotation.y=(i-(list.length-1)/2)*-.3;g.add(f)});g.userData.anim=t=>g.children.forEach((c,i)=>c.userData.anim&&c.userData.anim(t*.3+i));return g}
function bBusAttack(){const g=new THREE.Group();g.add(bCity({col:'#9aa4ac',n:22,r:3,glow:'#ffd890'}));const mouth=new THREE.Group();const lip=new THREE.Mesh(new THREE.TorusGeometry(2.4,.6,10,32),M('#8a5a5a',{roughness:.5}));lip.rotation.x=Math.PI/2;mouth.add(lip);
 const throat=new THREE.Mesh(new THREE.CircleGeometry(2.3,32),M('#1a0606'));throat.rotation.x=Math.PI/2;mouth.add(throat);const bd=sph(0,4,2,4,20,M('#7a8a98',{roughness:.4}));bd.position.y=1.8;mouth.add(bd);for(let i=0;i<14;i++){const tt=cone(.15,.7,M('#efe6d0'),4);const a=i/14*6.28;tt.position.set(Math.cos(a)*2.1,-.2,Math.sin(a)*2.1);tt.rotation.x=Math.PI;mouth.add(tt)}
 mouth.position.y=9;g.add(mouth);g.add(at(emitter({n:160,life:2.5,speed:3,spread:.2,size:.35,dir:[0,1,0],col:'#d8c8b8',op:.9,add:false,area:[5,.5,5],wander:.3}),0,1,0));g.add(at(glowSprite('#bfe6ff',10,.3),0,8,0));g.userData.anim=t=>{mouth.rotation.y=t*.1;mouth.position.y=9+Math.sin(t*.5)*.4};return g}
function bAlgaeNet(){const g=new THREE.Group();const sea=new THREE.Mesh(new THREE.CircleGeometry(4,40),M('#0a1a22',{roughness:.1,metalness:.3}));sea.rotation.x=-Math.PI/2;g.add(sea);const pts=[];for(let i=0;i<260;i++){const a=Math.random()*6.28,r=Math.sqrt(Math.random())*3.8;pts.push(V3(Math.cos(a)*r,.05+Math.random()*.15,Math.sin(a)*r))}
 const ln=[];for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){if(pts[i].distanceTo(pts[j])<.55&&ln.length<1400)ln.push(pts[i],pts[j])}g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(ln),new THREE.LineBasicMaterial({color:'#3affa8',transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false})));g.add(sparkles(pts,'#7affc8',.2,1,1));return g}
function bIslet(r,col){const g=new THREE.Group();const rk=new THREE.Mesh(new THREE.ConeGeometry(r,r*1.6,9,3),detailMat(M(col||'#6e6458',{roughness:.95,flatShading:true}).clone(),{bump:1,freq:1.2}));rk.rotation.x=Math.PI;rk.position.y=-r*.8-.05;g.add(rk);
 const top=new THREE.Mesh(new THREE.CylinderGeometry(r*1.02,r,r*.12,9),M('#5a7a4a',{roughness:.9}));top.position.y=-r*.06;g.add(top);for(let i=0;i<6;i++){const s=new THREE.Mesh(kd(r*.12),M('#7a7064',{flatShading:true}));const a=i*1.1;s.position.set(Math.cos(a)*r*.75,0,Math.sin(a)*r*.75);g.add(s)}return g}
function bArch(){const g=new THREE.Group();const m=GL('#ffe2a0',.75);for(const z of[-1,1]){const p=cyl(.15,.2,4,m,8);p.position.set(0,2,z*2);g.add(p);g.add(at(glowSprite('#ffe2a0',2,.7),0,4.2,z*2))}const a=new THREE.Mesh(new THREE.TorusGeometry(2,.1,6,24,Math.PI),m);a.position.y=4;a.rotation.y=Math.PI/2;g.add(a);
 const sg=[];for(let i=0;i<8;i++){const s=glowSprite('#fff4d0',.8,.8);g.add(s);sg.push(s)}g.userData.anim=t=>sg.forEach((s,i)=>{const q=(t*.15+i/8)%1;s.position.set(q*12-2,.4,Math.sin(q*6)*.5)});return g}
function bDoom(){const g=new THREE.Group();const cols=['#c83a2a','#5a3a8a','#2a6a5a','#c8a03a','#3a3a4a'];const ws=[];for(let i=0;i<7;i++){const w=new THREE.Group();const s=sph(0,1,1,1,18,M(cols[i%5],{roughness:.6,emissive:cols[i%5],emissiveIntensity:.25}));w.add(s);const fl=emitter({n:30,life:1.5,speed:.8,spread:.6,size:.8,dir:[0,1,0],col:'#ff7a3a',op:.6,area:[1.4,1.4,1.4]});if(i%2)w.add(fl);
  const face=new THREE.Mesh(new THREE.CircleGeometry(.35,12),GL('#ffffff',.25));face.position.z=1.02;w.add(face);w.scale.setScalar(.5+h3(i,1,5)*.7);g.add(w);ws.push({w,a:i/7*6.28,r:2.4+h3(i,2,5)*1.6,y:h3(i,3,5)*3})}
 g.add(at(glowSprite('#ff5a3a',6,.25),0,1.5,0));g.userData.anim=t=>ws.forEach((x,i)=>{const a=x.a+t*.1;x.w.position.set(Math.cos(a)*x.r,x.y+Math.sin(t*.5+i)*.3,Math.sin(a)*x.r);x.w.rotation.y=t*.2+i});return g}
function bThird(){const g=new THREE.Group();const p=sph(0,2.2,2.2,2.2,24,M('#c8c0b0',{roughness:.6}));g.add(p);const fake=[];for(let i=0;i<4;i++){const f=sph(0,.6,.6,.6,14,new THREE.MeshStandardMaterial({color:'#c8c0b0',transparent:true,opacity:.35,depthWrite:false}));g.add(f);fake.push({f,a:i/4*6.28})}
 const ms=[];for(let i=0;i<24;i++){const m=new THREE.Mesh(new THREE.ConeGeometry(.06,.3,5),EM('#ffd8a0',.8));g.add(m);ms.push({m,ph:i/24})}g.userData.anim=t=>{fake.forEach((x,i)=>x.f.position.set(Math.cos(x.a+t*.2)*4,Math.sin(t*.3+i),Math.sin(x.a+t*.2)*4));ms.forEach((x,i)=>{const q=(t*.3+x.ph)%1;const a=i*2.4;x.m.position.set(Math.cos(a)*(2.3+q*5),Math.sin(a*1.7)*(2.3+q*5)*.4,Math.sin(a)*(2.3+q*5));x.m.lookAt(V3(0,0,0));x.m.rotateX(-Math.PI/2)})};return g}
function bYate(){const g=new THREE.Group();g.add(bHuts({n:7,r:2.6,col:'#5a4a4a',kind:'mound'}));const bc=bBrainCrystals();bc.scale.setScalar(.6);bc.position.y=.2;g.add(bc);const dead=bBrain({w:'x'});dead.scale.setScalar(.6);dead.position.set(1.6,.3,1.4);dead.traverse(o=>{if(o.isMesh)o.material=M('#5a4a4a',{roughness:.9})});g.add(dead);return g}
function bIceCells(){const g=new THREE.Group();const ice=new THREE.Mesh(kb(3,2,2.4),new THREE.MeshStandardMaterial({color:'#d8f0ff',transparent:true,opacity:.4,roughness:.05,metalness:.1,depthWrite:false}));ice.position.y=1;g.add(ice);
 const c=bCells({n:12,col:'#9ad8ff',size:.6});c.position.y=1;g.add(c);for(let i=0;i<4;i++){const h=new THREE.Mesh(new THREE.CylinderGeometry(.3,.3,2.2,10,1,true),new THREE.MeshBasicMaterial({color:'#1a3a5a',transparent:true,opacity:.35,side:THREE.DoubleSide,depthWrite:false}));h.position.set(-1+i*.7,1,(i%2-.5)*.8);h.rotation.x=.4*i;g.add(h)}
 g.add(at(emitter({n:40,life:2,speed:.4,spread:1,size:.25,dir:[0,1,0],col:'#ffffff',op:.8,area:[3,2,2.4]}),0,1,0));g.userData.anim=t=>c.userData.anim(t);return g}
function bTunnelBrain(){const g=bMist({col:'#ffffff',n:16,r:6,h:3,s:3,op:.35,core:'#e8f0ff'});const pts=[];for(let i=0;i<80;i++)pts.push(V3((Math.random()-.5)*6,Math.random()*3,(Math.random()-.5)*6));const ln=[];for(let i=0;i<pts.length;i++){const j=(i*13+5)%pts.length;if(pts[i].distanceTo(pts[j])<2.4)ln.push(pts[i],pts[j])}
 g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(ln),new THREE.LineBasicMaterial({color:'#c8d8ff',transparent:true,opacity:.6,blending:THREE.AdditiveBlending,depthWrite:false})));g.add(sparkles(pts,'#e8f0ff',.25,1,1));return g}
function bEmpire(){const g=new THREE.Group();const r=bCentipede({n:10,col:'#7a6a8a',rib:0});r.position.set(-1,0,0);g.add(r);const frag=[];for(let i=0;i<9;i++){const f=new THREE.Mesh(kd(.3+h3(i,1,4)*.3),M('#e8e4dc',{metalness:.4,roughness:.3,flatShading:true,emissive:'#8ab8ff',emissiveIntensity:.15}));g.add(f);frag.push({f,a:i/9*6.28})}
 const ban=new THREE.Mesh(new THREE.PlaneGeometry(1.4,2),M('#3a2a5a',{side:THREE.DoubleSide}));ban.position.set(2,1.8,0);ban.rotation.y=Math.PI/2;g.add(ban);const pl=cyl(.04,.04,3,M('#c8c8c8',{metalness:.7}),5);pl.position.set(2,1.5,.7);g.add(pl);
 g.userData.anim=t=>{r.userData.anim&&r.userData.anim(t*.4);frag.forEach((x,i)=>{const a=x.a+t*.2;x.f.position.set(1+Math.cos(a)*1.6,1.5+Math.sin(t+i)*.3,Math.sin(a)*1.6);x.f.rotation.set(t*.3,t*.2+i,0)})};return g}
function bTravel(){const g=new THREE.Group();const p=sph(0,1.6,1.6,1.6,24,M('#4a7aa8',{roughness:.5,emissive:'#1a3a5a',emissiveIntensity:.2}));p.position.y=2;g.add(p);const b=sph(0,2.4,2.4,2.4,24,new THREE.MeshStandardMaterial({color:'#d8e8ff',transparent:true,opacity:.18,roughness:.05,metalness:.4,depthWrite:false}));b.position.y=2;g.add(b);
 const w=bWarp({col:'#c8d8ff'});w.scale.setScalar(.4);w.position.y=2;g.add(w);g.add(at(emitter({n:80,life:3,speed:2,spread:.2,size:.4,dir:[-1,0,0],col:'#e8f0ff',op:.8,area:[.5,4,4]}),-2.6,2,0));g.userData.anim=t=>{p.rotation.y=t*.2;w.userData.anim(t)};return g}
function bAbility(){const g=bWorkers({n:4,fig:{skin:'#c8a888',cloth:'#5a3a6a',cloth2:'#3a2a4a',ears:1}});g.add(swarmPts(80,2.4,'#ffb0f0',.12,7));for(let i=0;i<4;i++){const c=g.children[i];if(c)c.add(at(glowSprite('#ff9ae8',2.6,.35),0,1.4,0))}return g}
function bAmeirun(){const g=bCity({col:'#c8d0d8',n:34,r:3.4,glow:'#ffe8b0',tall:1.6,ads:1});const h=bFig({h:1.2,skin:'#d8b89a',cloth:'#c83a3a',cloth2:'#2a3a8a',cape:'#c83a3a'});h.position.set(0,6,0);h.rotation.z=-1.1;g.add(h);g.add(at(glowSprite('#ffe8a0',2,.6),0,6,0));const a0=g.userData.anim;g.userData.anim=t=>{h.position.set(Math.cos(t*.4)*3,6+Math.sin(t)*.4,Math.sin(t*.4)*3);h.rotation.y=-t*.4}; return g}
function bNautFarm(){const g=new THREE.Group();const farm=new THREE.Mesh(new THREE.SphereGeometry(4,24,12,0,6.283,0,1.3),new THREE.MeshStandardMaterial({color:'#2a2034',transparent:true,opacity:.7,roughness:.9,emissive:'#3a2a5a',emissiveIntensity:.3,side:THREE.DoubleSide,depthWrite:false}));farm.scale.y=.4;g.add(farm);
 const fl=[];for(let i=0;i<40;i++){const a=Math.random()*6.28,r=Math.sqrt(Math.random())*3.6;fl.push(V3(Math.cos(a)*r,.2+Math.random()*1.2,Math.sin(a)*r))}const sp=sparkles(fl,'#c8a8ff',.35,1,1);g.add(sp);const n=bNautilus();n.scale.setScalar(.6);n.position.set(0,2.4,0);n.rotation.z=-.9;g.add(n);
 g.userData.anim=t=>{n.userData.anim(t);n.position.y=2.4-((t*.08)%1)*1.6};return g}
function bMechFolk(){const g=new THREE.Group();for(let i=0;i<3;i++){const f=bFig({h:2,skin:'#9aa4ac',cloth:'#6a747c',cloth2:'#4a545c',head:'round',ears:1,glow:'#ff5a3a'});f.traverse(o=>{if(o.isMesh&&o.material&&o.material.isMeshStandardMaterial&&!o.material.transparent&&!o.material.emissiveIntensity){o.material=M(o.material.color.getStyle?'#'+o.material.color.getHexString():'#9aa4ac',{metalness:.75,roughness:.3})}});
  const vine=tubeAlong([V3(0,0,0),V3(.3,1.5,.2),V3(-.2,3,.1),V3(.2,4.5,0)],.06,M('#4a7a3a'),12);vine.position.set(1.6,0,0);if(i===0)g.add(vine);f.position.set((i-1)*1.3,0,0);g.add(f)}g.userData.anim=t=>g.children.forEach((c,i)=>c.userData.anim&&c.userData.anim(t*(1+i*.4)));return g}
function bCaller(){const g=bEnergyBeings();const w=sph(0,.6,.6,.6,16,M('#4a8a5a',{emissive:'#2a5a3a',emissiveIntensity:.3}));w.position.y=2;g.add(w);const a0=g.userData.anim;g.userData.anim=t=>{a0(t);w.position.x=Math.sin(t*23)*.05;w.position.y=2+Math.cos(t*19)*.05};return g}
function bMoleMonkey(){const g=new THREE.Group();const w=bSpikeWall();w.scale.setScalar(.8);g.add(w);const m=bFurryBiped({h:1.3,skin:'#8a7a6a',fur:'#e8e0d0',head:'round'});m.position.set(0,0,1.6);g.add(m);const mole=bQuadSmall({w:'x',col:'#3a2a24'});mole.scale.setScalar(.8);mole.position.set(2,0,1.4);g.add(mole);g.userData.anim=t=>g.children.forEach(c=>c.userData.anim&&c.userData.anim(t));return g}
function bRockSpiders(){const g=new THREE.Group();const a=bSpider({rock:1,size:1});a.position.x=-1;g.add(a);const b=bSpider({dream:1,col:'#7a6aa8',size:.8});b.position.set(1.2,0,.6);g.add(b);g.userData.anim=t=>g.children.forEach(c=>c.userData.anim&&c.userData.anim(t));return g}
function bUnder(){const g=bWindowCave({ferns:1});const ht=cyl(.5,.9,5,M('#5a4632',{roughness:.95}),9);ht.position.y=-2.5;g.add(ht);return g}

/* ---------- the table: id → [builder, size factor, options]
   options: alt (lift above the ground), isle (stand on a little floating rock off-planet), walk (keep legs moving), far, hd (heading) */
const ENT={
 // 绒球 · 海
 lin:[()=>{const g=bCells({n:34,col:'#e6f2ee',core:'#626464',size:1.1,glow:'#eaf6f2'});const ring=new THREE.Mesh(new THREE.TorusGeometry(1.8,.03,4,48),GL('#e8f4f0',.4));ring.rotation.x=Math.PI/2;g.add(ring);
 const a0=g.userData.anim;g.userData.anim=t=>{a0&&a0(t);ring.scale.setScalar(1+Math.sin(t*.8)*.08);g.rotation.y=t*.05};return g},1.4,{alt:1.5}], guanchazhe:[q4b_observer,1.1,{alt:1}], shilijj:[()=>bCrystal('#e0fbff'),.9], baigao:[bPaste,1.1,{alt:.3}],
 jingjun:[()=>bCells({n:22,col:'#cfeeff',core:'#5a8aa8',spikes:1,glow:'#cfeeff'}),1.3,{alt:1}], guiwujun:[()=>bCells({n:20,col:'#f4f4f4',core:'#8a8a8a',fur:'#ffffff'}),1.2,{alt:1}],
 rongbingjun:[bIceCells,1.2], juxian:[fxC_juxian,1.4], tanchong:[bCarpet,1.3,{alt:.5}], yexing:[bLeafWorm,1], jiebei:[bBivalve,.9], sangni:[()=>bStarfish({arms:15,col:'#d86a5a',r:1.5,shift:1}),1],
 yuandun:[fxC_yuandun,1.8], ev_ext1:[bBubbles,2.4],
 // 绒球 · 北之大陆
 manteng:[fxC_manteng,3], niuqushu:[bTwinTree,1.6], shepao:[()=>bBeetlePair({col:'#c0c8d0',col2:'#6a5a3a',blast:1}),1.1], linjia:[fxC_linjia,1.3],
 chibcha:[fxC_chibcha,1], jinglin:[()=>bLizard({crystal:1}),1.4], maya:[bMayaNest,1.6], mukatu:[()=>{const g=bMaya();const r=bBeetle({w:'heijiao',col:'#2a2420'});r.position.set(-2,0,0);g.add(r,shadow(1.4));return g},1.2],
 heifeng:[fxC_heifeng,1.4], baojia:[fxC_baojia,1.2], pensha:[fxC_pensha,1.4], anying:[fxC_anying,1.3,{dll:[.7,-1]}], hongzhu:[()=>bSpider({col:'#c83a2a',wings:1,lava:1}),1], zhanxie:[fxC_zhanxie,1.1],
 siwangjianci:[fxC_siwang,1.6], luxingsha:[bLandShark,1.2], jichizhe:[()=>bRaptor({w:'x',col:'#5a7a5a'}),1.1,{walk:1}], huijinchong:[bAshPool,1.4], bujizhe:[bSupplier,1.4,{alt:14}],
 ronglie:[bSacs,.9], dunaozhe:[bReader,1.1], shengtan:[fxC_shengtan,1], shentou:[bMimic,1.1],
 kongjiang:[fxC_kongjiang,1.3], tuke:[bSprayer,1.2], kaituo:[fxC_kaituo,1.8], tiankong:[()=>bSkyPod({}),2.4,{alt:34}], art:[()=>bBomb({col:'#8a6a4a',core:'#ffb050'}),1.2], xianshi:[bScreenBeast,1.2],
 gunlei:[fxC_gunlei,1], ev_war:[()=>bBattle({}),3], ev_ext2:[bMeteors,3,{far:2200,sea:1}], ev_ext3:[fxC_ext3,2.2], under:[bUnder,3.4],
 // 绒球 · 西方群岛与恐龙大陆
 yika:[fxC_yika,1,{sea:1}], plague:[bPlague,1.6], zhenjunlz:[fxC_zhenjun,1.8], lvyang:[()=>bTrilobite({filter:1,col:'#6a5a4a'}),2.8], tanglangxia:[fxC_tanglangxia,1.4,{sea:1}],
 shijun:[()=>{const g=bAmoeba({col:'#3a9ad8'});const s=bScorpion({w:'x',col:'#7a9a5a'});s.scale.setScalar(.4);s.position.set(2,0,0);g.add(s);return g},1.4], baozhajq:[fxC_baozha,1], mtzm2:[fxC_mtzm2,1.6,{alt:.3,sea:1}],
 baoxiao:[fxE_roarer,1.3,{dll:[.8,1]}], spy:[fxE_spy,1.1], tako:[fxF_tako,1],
 lideer:[fxF_lideer,1], dumeisha:[fxE_medusa,1.4], jianzao:[fxE_flea,.8], longqimu_tree:[bDragonTree,1.4],
 susumi:[fxF_susumi,1.1,{dll:[.8,.8]}], mukela:[()=>bTrio([{base:'emerald',cape:'#8a2a2a'},{base:'emerald',spear:1},{base:'emerald',col:'#2a2a2a',scarf:'#c83a2a'}]),1],
 leigu:[()=>bCentipede({rib:1,mouth:1}),1.1], yate:[bYate,1.4], fenlienao:[bBrainCrystals,1], bingzhu:[()=>bSpider({crystal:1,size:1.4}),1],
 jingkuang:[fxF_jingkuang,1.1,{dll:[-.9,1]}], yuyan:[fxF_yuyan,1],
 kongyuting:[fxE_skyboat,1.6,{alt:16}], rqzj:[bDreamStones,1.6,{alt:1}], dayanlong:[q5m_bigEyeLizard,1], shenyuanguyou:[()=>bSquids({}),1,{sea:1}], tanzuan:[bProbe,1], menglian:[fxE_dreamlink,1.1,{sea:1}],
 huangqunlz:[fxE_queen,1.6,{alt:.3,sea:1}], yinxi:[()=>{const g=new THREE.Group();const a=bLizard({stone:1,col:'#6a7a5a'});const b=bLizard({col:'#7a6a4a'});b.position.set(-.5,0,1.4);b.rotation.y=2.6;g.add(a,b);g.userData.anim=t=>{a.userData.anim(t);b.userData.anim(t+2)};return g},1.1,{dll:[-1.2,-4.3]}],
 yuanjiao:[fxE_yuanjiao,1.1], duntou:[fxE_stoneBeast,1.1],
 qinshizhe:[bLeafCut,1.4], zhaozemu:[bBendTree,1.5], luoxuanying:[()=>bFlyCloud({box:1}),1.3], didanchong:[bBulletBug,1.1], jueyuan:[fxE_digger,1.8,{walk:1}],
 yanshenghua:[fxE_fireflower,1.1], jiaoshu:[fxE_calltree,1.2], huiyinchong:[fxE_huiyin,1.1], paokexia:[fxE_bubbleShrimp,1.2,{sea:1}], chuandichong:[bBees,1.2],
 jingmaoyu:[()=>{const g=bFluffKin({crystal:1});const n=bFluffKin({spike:1,col:'#d8d0c0',tip:'#a89880'});n.scale.setScalar(.7);n.position.set(0,0,3);g.add(n);const a0=g.userData.anim;g.userData.anim=t=>{a0(t);n.userData.anim(t+1)};return g},.8],
 rq_cuihai:[()=>{const g=bDragonFig({base:'x',col:'#5a9a7a'});const p=new THREE.Mesh(kcy(.5,.6,2.2,10),detailMat(M('#8a8070',{roughness:1,flatShading:true}).clone(),{bump:1.2,freq:4}));p.position.set(-1.6,1.1,.6);g.add(p);g.add(tubeAlong([V3(-1.6,2.2,.6),V3(-1.4,2.8,.8),V3(-1.1,3,.5)],.06,M('#8a5a6a'),8));return g},1.1],
 rq_tlant3:[fxE_heli,1.4,{alt:12}], rq_mist:[fxE_fograft,1.4,{sea:1}], ev_snow:[bBlizzard,2.4], mosi:[()=>bWorkers({n:5,fig:{skin:'#a08a6a',cloth:'#8a7458',cloth2:'#6a5a44',head:'pointed',fur:'#c8b088',ears:1,h:1.5}}),1],
 pier:[fxE_pier,1],
 tlant:[fxD_scholar,1], jinzita:[fxP_pyramids,1.4], shanhujiao:[fxP_reef,2.6,{sea:1,alt:2}],
 // 绒球 · 东之大陆与天国
 tianchuan:[q4b_skyShip,2.6,{alt:52,far:2400}], yundao:[fxP_cloudIsle,2.4,{alt:46,far:2400}], jiyi:[bMothCloud,1.4,{alt:1}], moni:[bMimic,1.1], zhiyunzhe:[bCloudMicrobes,2.4,{alt:46}], shengwuta:[bTower,1.4], donggua:[()=>{const g=new THREE.Group();for(let i=0;i<5;i++){const d=bDragonkin({w:'zhuru'});d.position.set((i%3-1)*1,0,(Math.floor(i/3)-.5)*1.2);d.rotation.y=i;const b=sph(0,.12,.12,.12,8,M('#c8b898'));b.position.set(.5,1.2,.3);d.add(b);g.add(d)}g.add(shadow(1.8));g.userData.anim=t=>g.children.forEach((c,i)=>{if(c.userData.anim){c.userData.anim(t*.4+i);c.position.y=Math.abs(Math.sin(t*3+i))*.25}});return g},1],
 ev_tianguo:[bSkyFire,2.6,{far:2200}], ev_xumin:[bWreckage,2.6,{far:2200}], c_maya:[()=>{const g=new THREE.Group();const c=bMist({col:'#ffffff',n:12,r:5,h:1,s:3,op:.6});g.add(c);const b=bMaya();b.position.y=.8;g.add(b);g.userData.anim=t=>{c.userData.anim(t);b.userData.anim&&b.userData.anim(t);b.rotation.x=t*.6};return g},1.3,{alt:46}],
 // 虚民母球
 xm_ruigou:[()=>bCity({col:'#9aa4ac',n:30,r:3.2,glow:'#ffd890',ads:1}),2], xm_busattack:[bBusAttack,2], xm_extinct:[bExtinctHolo,1.2], xm_starfish:[bArmorStar,.9],
 xm_general:[()=>fxD_xumin({cloth:'#c83a3a',cloth2:'#8a2a2a',medals:1,hat:'cap',hatc:'#8a2a2a',cape:'#8a2a2a',belt:'#e8c040'}),1], xm_union:[()=>bCity({col:'#d8dde2',n:20,r:3,glow:'#ffe8b0',hall:1,flags:1}),2],
 xm_nemo:[()=>fxD_xumin({armor:'#5a5e62',crack:1}),1],
 xm_deepcity:[fxG_deepCity,1.8,{sea:1,alt:-5}], xm_prison:[fxP_prisonIsle,1.6,{sea:1}], xm_xuanfu:[()=>bDiscCraft({n:5}),1.6,{alt:26}],
 // 尔什
 ex_haiju:[()=>bDomes({col:'#7ab8e8',bubble:1}),1.8,{sea:1}], ex_ability:[bAbility,1.1], ex_closest:[fxD_closest,1.1,{alt:.3,sea:1}], ex_ameirun:[bAmeirun,2], ex_mother:[fxD_mother,1.3], ex_teliti:[fxF_teliti,1], ex_wushou:[fxD_wushou,1],
 ex_research:[()=>bLab({cannon:1}),1.4], ex_clown:[fxF_clown,1.2], ex_split:[()=>bBeams({col:'#fff4d0'}),2,{far:2600}], ex_nautilus:[bNautFarm,1.6], ex_niuyao:[()=>bCity({col:'#c8b8a8',n:30,r:3.4,glow:'#ffd8a0',twist:1,tall:1.4}),2],
 ex_nuo:[fxF_nuo,1], ex_travel:[bTravel,2,{alt:20}], ex_endsign:[bQuake,2.2], c_veronica:[fxF_veronica,1], c_bilu:[fxF_bilu,1],
 // 虚空
 v_spike:[bMoleMonkey,1,{isle:1}], v_huhe_guard:[fxD_huhe,1,{isle:1}], v_guancha:[bStoneEye,1,{isle:1}], v_se:[fxD_se,1,{isle:1}], v_yanzhu:[bRockSpiders,1,{isle:1}], v_yuanling:[fxD_yuanling,1.1],
 v_fudao:[fxD_fudao,1.1], v_yanpi:[fxD_yanpi,1,{isle:1}], v_gouluo:[bHookWheel,1,{isle:1,walk:1}], v_yangzhi:[bLimbKeepers,1,{isle:1}], v_cangyi:[fxD_cangyi,1.1,{isle:1}], v_rosalie:[fxF_rosalie,1,{isle:1}],
 v_piaobohao:[fxP_driftFortress,2],
 v_hundun:[fxP_chaos,3],
 v_bingshan:[fxP_voidIceberg,3],
 j2_xuying:[fxP_shadowTree,3], j3_farnuo:[fxP_farNuo,1.4],
 a1_xishuai:[fxP_cricket,1.8,{alt:38}], a2_xiliegu:[fxP_mistGorge,2.4], a3_heifeng:[fxP_metalTwister,1.4], a4_zhanglao:[fxP_elderTree,1.2],
 v_jiancezhan:[fxP_checkpoint,2.4],
 v_jiaotuan:[bTentacleCult,.9,{isle:1}], v_gugu:[fxD_gugu,1,{isle:1}], v_shijing:[bMercury,1.1], v_shuimin:[bStrider,1,{walk:1}], v_huijin:[fxD_ashPair,1], v_poyan:[fxD_poyan,1.1],
 v_zhanfen:[fxD_zhanfen,1,{isle:1}], v_chibcha2:[fxD_chibcha2,1.2,{isle:1}], v_jiqimin:[bMechFolk,1,{isle:1}], v_huanxing:[bShifter,1,{isle:1}], v_yiyin:[()=>bSoundWave({screen:1,col:'#ffb0d8'}),1.2],
 v_shijiang:[bCorpseSmith,1,{isle:1}], v_anzao:[fxD_anzao,1.1], v_ningu_gate:[()=>bWarp({col:'#9ab8d8'}),1.4], v_huaduo:[fxD_huaduo,1.1],
 ng_qijistar:[fxP_miracleStar,3], ng_xinhaota:[fxP_signalTower,2.2], ng_jianyuta:[fxP_prisonTower,2], ng_busman:[bHeroes,1,{isle:1}], ng_galaxy:[fxD_galaxy,1.2], ng_jianzhang:[fxD_jianzhang,1,{isle:1}], ng_naogen:[bRootBrain,1,{isle:1}], ng_button:[bButtonFolk,1,{isle:1}], ng_snow:[()=>{const g=fxD_snow();const sn=M('#f6f6f2',{roughness:.95});
 for(let i=0;i<9;i++){const a=h3(i,1,6)*6.28,r=3.2+h3(i,2,6)*4.5;const d=sph(0,1.4+h3(i,3,6)*2.2,.35+h3(i,4,6)*.35,1+h3(i,5,6)*1.6,22,sn);d.position.set(Math.cos(a)*r,0,Math.sin(a)*r);d.rotation.y=h3(i,6,6)*3;g.add(d)}
 const plain=new THREE.Mesh(new THREE.CircleGeometry(9,48),M('#f0f0ec',{roughness:1}));plain.rotation.x=-Math.PI/2;plain.position.y=.01;g.add(plain);return g},1.1],
 ng_huobanao:[bTorchBrain,1,{isle:1}], c_baoxiao:[fxD_baoxiao,1,{isle:1}], c_hero:[fxF_hero,1,{isle:1}],
 // 梦境
 bk_zhizaota:[fxP_makerTower,1.6],
 dr_road:[bArch,1.3], dr_edge:[fxD_edge,1.4], c_tentacle:[bTentacleGuide,1.1,{isle:1}], dr_doom:[bDoom,1.4], dr_jumper:[fxD_jumper,1.1], dr_zhaoji:[bCaller,1.2], dr_tako:[fxF_takoHope,1.1,{isle:1}],
 // 米德加尔特
 mg_overview:[()=>bWarp({col:'#c8b8a0'}),1.5], mg_chene:[()=>fxD_croc({}),1.2,{walk:1}], mg_mini:[()=>fxD_croc({tiny:1,mech:1}),.7], mg_mech:[()=>bDustCroc({mech:1}),1.2], mg_xiulian:[fxD_xiulian,1.1], mg_exit:[fxD_moons,2],
 c_xuezhe:[fxD_xuezhe,1],
 // 白色通道
 tn_overview:[()=>bWarp({col:'#ffffff'}),1.6], tn_empire:[bEmpire,1.2], tn_brain:[bTunnelBrain,1.6], tn_third:[bThird,2],
 // 不可预见之地
 bk_overview:[()=>{const g=bMist({col:'#e8e0ff',n:20,r:7,h:4,s:4,op:.45,core:'#ffffff'});const shards=[];const sm=new THREE.MeshStandardMaterial({color:'#f0e8ff',emissive:'#c8b0ff',emissiveIntensity:.5,transparent:true,opacity:.7,roughness:.2,flatShading:true});
 for(let i=0;i<14;i++){const s=new THREE.Mesh(i%3===0?new THREE.TetrahedronGeometry(.5,0):i%3===1?ko(.4):new THREE.IcosahedronGeometry(.35,0),sm);const a=h3(i,1,4)*6.28,r=2+h3(i,2,4)*4;s.position.set(Math.cos(a)*r,1+h3(i,3,4)*3,Math.sin(a)*r);s.scale.setScalar(.6+h3(i,4,4));g.add(s);shards.push({s,a,r,y:s.position.y,ph:h3(i,5,4)*6})}
 const rings=[];for(let i=0;i<2;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(3.2+i*1.4,.04,8,64),GL('#d8c8ff',.5));r.rotation.x=Math.PI/2+(i?.5:-.3);r.position.y=2;g.add(r);rings.push(r)}
 const a0=g.userData.anim;g.userData.anim=t=>{if(a0)a0(t);for(const q of shards){const a=q.a+t*.12;q.s.position.set(Math.cos(a)*q.r,q.y+Math.sin(t*.6+q.ph)*.4,Math.sin(a)*q.r);q.s.rotation.set(t*.3+q.ph,t*.2,0)}rings.forEach((r,i)=>r.rotation.z=t*(i?-.05:.07))};return g},1.6], bk_expedition:[bExpedition,1,{isle:1}], bk_daowen:[fxD_daowen,1.1], bk_abu:[fxF_abu,1.1], bk_builder:[bHellBuilder,1.1], bk_jilu:[bHive,1], c_sarin:[fxF_sarin,1.1,{isle:1}],
};
/* ---------- 漂泊号: the 虚民 headquarters, a flat disc fortress drifting in the void with a city on its deck, heavy guns round the
   rim, a dozen corridors running in to the core, and the core section (中心区) sitting in the middle as a separate hull that
   can close its doors and fly off on its own. Hull, corridors and guns are one vertex-coloured mesh; the city is instanced ---------- */
function fxP_driftFortress(){const g=new THREE.Group();const P=[];
 const prof=[[0,-.38],[2.6,-.34],[3.7,-.2],[4.1,-.04],[4.12,.06],[3.9,.17],[1.7,.21],[1.55,.21]].map(([x,y])=>new THREE.Vector2(x,y));
 P.push([new THREE.LatheGeometry(prof,72),'#868e96']);
 P.push([new THREE.ConeGeometry(1.5,1.2,36,1,true).rotateX(Math.PI).translate(0,-.97,0),'#5e666c']);
 P.push([new THREE.TorusGeometry(4.02,.09,6,72).rotateX(Math.PI/2).translate(0,.12,0),'#4e565c']);
 P.push([new THREE.TorusGeometry(2.55,.05,4,64).rotateX(Math.PI/2).translate(0,.22,0),'#6a7278']);
 for(let i=0;i<12;i++){const a=i/12*6.283;const c=new THREE.BoxGeometry(2.3,.14,.22).translate(2.75,.27,0).rotateY(a);P.push([c,'#727a82'])}
 for(let i=0;i<18;i++){const a=(i+.5)/18*6.283,r=3.55;const base=new THREE.CylinderGeometry(.13,.16,.14,8).translate(r,.26,0).rotateY(a);
  const bar=new THREE.BoxGeometry(.42,.06,.06).translate(r+.2,.36,.04).rotateY(a),bar2=new THREE.BoxGeometry(.42,.06,.06).translate(r+.2,.36,-.04).rotateY(a);
  P.push([base,'#4a5056'],[bar,'#3a3f44'],[bar2,'#3a3f44'])}
 for(let i=0;i<6;i++){const a=i/6*6.283+.26;P.push([new THREE.BoxGeometry(.5,.35,.3).translate(3.1,-.45,0).rotateY(a),'#6a7076'])}
 const hull=new THREE.Mesh(mergeColored(P),VC({metalness:.62,roughness:.42}));g.add(hull);
 const city=bCity({col:'#c4c9ce',n:70,r:3.3,glow:'#ffd890',tall:.5});city.scale.set(1,.42,1);city.position.y=.2;
 city.traverse(o=>{if(o.isInstancedMesh){const m4=new THREE.Matrix4(),q=new THREE.Vector3();for(let i=0;i<o.count;i++){o.getMatrixAt(i,m4);q.setFromMatrixPosition(m4);const d=Math.hypot(q.x,q.z);if(d<1.75){q.x*=1.75/Math.max(d,.01)+.05;q.z*=1.75/Math.max(d,.01)+.05;m4.setPosition(q);o.setMatrixAt(i,m4)}}o.instanceMatrix.needsUpdate=true}});g.add(city);
 const core=new THREE.Group();const cm=M('#9aa2aa',{metalness:.7,roughness:.32});
 const drum=cyl(1.45,1.5,.62,cm,40);drum.position.y=.5;core.add(drum);
 const dome=new THREE.Mesh(new THREE.SphereGeometry(1.25,32,12,0,6.283,0,1.2),M('#b8c0c6',{metalness:.55,roughness:.28}));dome.position.y=.78;dome.scale.y=.55;core.add(dome);
 const seamM=new THREE.MeshBasicMaterial({color:'#9ad8ff',transparent:true,opacity:.85});const seam=new THREE.Mesh(new THREE.TorusGeometry(1.5,.035,4,64),seamM);seam.rotation.x=Math.PI/2;seam.position.y=.24;core.add(seam);
 for(let i=0;i<12;i++){const a=i/12*6.283;const d=new THREE.Mesh(new THREE.BoxGeometry(.06,.26,.3),GL('#ffd890'));d.position.set(Math.cos(a)*1.47,.42,-Math.sin(a)*1.47);d.rotation.y=a;core.add(d)}
 g.add(core);
 for(let i=0;i<10;i++){const a=i/10*6.283;g.add(at(glowSprite(i%2?'#ff6a5a':'#ffe0a0',.5,.9),Math.cos(a)*4.1,.12,Math.sin(a)*4.1))}
 g.add(at(glowSprite('#bfe6ff',2.2,.35),0,1.3,0));
 g.userData.anim=t=>{g.rotation.y=t*.012;seamM.opacity=.55+.3*Math.sin(t*1.3)};return g}
/* ---------- 制造塔: the miracle tower of 返乡之道 that makes "made bodies" for whatever enters the dark zone — hundreds of metres
   tall, some thirty wide, built of the same half-round grave-slabs that cover the ground round it, stacked like scales; a
   faint light breathes between them. Burnt-out phoenixes lie all round, every one turned toward the tower ---------- */
function fxP_makerTower(){const g=new THREE.Group();const R0=1.05,H=13,rows=46,per=11;
 const slab=new THREE.CylinderGeometry(.5,.5,.08,10,1,false,-Math.PI/2,Math.PI).rotateX(Math.PI/2);
 const sm=M('#8e8a82',{roughness:.92});const im=new THREE.InstancedMesh(slab,sm,rows*per);const ob=new THREE.Object3D();let k=0;
 for(let r=0;r<rows;r++){const y=.2+r*(H/rows),rr=R0*(1-.18*r/rows)+.05*Math.sin(r*.7);for(let i=0;i<per;i++){const a=(i+(r%2)*.5)/per*6.283+h3(r,i,3)*.12;
  ob.position.set(Math.cos(a)*rr,y,Math.sin(a)*rr);ob.rotation.set(-.42-h3(r,i,4)*.15,-a+Math.PI/2,0,'YXZ');ob.scale.set(1,1+h3(r,i,5)*.25,1);ob.updateMatrix();im.setMatrixAt(k,ob.matrix);im.setColorAt(k++,C('#ffffff').offsetHSL(0,0,(h3(r,i,6)-.5)*.16))}}
 g.add(im);
 const coreM=new THREE.MeshBasicMaterial({color:'#f0d8a0',transparent:true,opacity:.5});const core=cyl(R0*.45,R0*.6,H,coreM,12);core.position.y=H/2;g.add(core);
 const cap=sph(0,.55,.4,.55,12,sm);cap.position.y=H+.25;g.add(cap);g.add(at(glowSprite('#ffe0a8',2.4,.35),0,H+.4,0));
 const gm=new THREE.InstancedMesh(new THREE.CylinderGeometry(.3,.3,.08,10,1,false,-Math.PI/2,Math.PI).rotateX(Math.PI/2),M('#7a776f',{roughness:.95}),70);
 for(let i=0;i<70;i++){const a=h3(i,1,7)*6.283,d=2.2+Math.sqrt(h3(i,2,7))*5.5;ob.position.set(Math.cos(a)*d,0,Math.sin(a)*d);ob.rotation.set((h3(i,3,7)-.5)*.3,h3(i,4,7)*3,(h3(i,5,7)-.5)*.3);ob.scale.setScalar(.7+h3(i,6,7)*.6);ob.updateMatrix();gm.setMatrixAt(i,ob.matrix)}g.add(gm);
 const ash=M('#4a4744',{roughness:1});const P=[];
 for(let i=0;i<9;i++){const a=i/9*6.283+h3(i,8,7),d=2.6+h3(i,9,7)*2.4;const b=new THREE.Group();
  const body=sph(0,.22,.16,.5,10,ash);b.add(body);const head=sph(0,.12,.12,.14,8,ash);head.position.set(0,.04,-.56);b.add(head);
  for(const sd of[-1,1]){const w=new THREE.Mesh(new THREE.ConeGeometry(.28,1.1,4),ash);w.rotation.set(Math.PI/2,0,sd*1.25);w.scale.set(1,1,.18);w.position.set(sd*.5,-.05,.05);b.add(w)}
  const tail=new THREE.Mesh(new THREE.ConeGeometry(.12,.7,4),ash);tail.rotation.x=-Math.PI/2;tail.position.z=.7;b.add(tail);
  b.position.set(Math.cos(a)*d,.1,Math.sin(a)*d);b.lookAt(0,.1,0);b.rotateY(Math.PI);g.add(b)}
 g.userData.anim=t=>{coreM.opacity=.32+.18*Math.sin(t*.9)};return g}
/* ---------- 混沌空间: the "gathering point" where whatever strays into the nothing between voids drifts together and is turned
   into chaos — a field of countless flickering specks, and inside it bubble regions where ordinary void matter floats ---------- */
function fxP_chaos(){const g=new THREE.Group();const sets=[];const cols=['#7ae8ff','#ff7ad8','#ffd86a','#b8ff7a'];
 for(let k=0;k<4;k++){const n=700,pos=new Float32Array(n*3);for(let i=0;i<n;i++){const u=h3(i,k,11)*2-1,a=h3(i,k+5,11)*6.283,r=5*Math.cbrt(h3(i,k+9,11));const q=Math.sqrt(1-u*u);
   pos[i*3]=Math.cos(a)*q*r;pos[i*3+1]=u*r*.7;pos[i*3+2]=Math.sin(a)*q*r}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const m=new THREE.PointsMaterial({color:cols[k],size:.55,sizeAttenuation:true,transparent:true,opacity:.8,depthWrite:false,blending:THREE.AdditiveBlending,map:glowTex});
  const pt=new THREE.Points(geo,m);g.add(pt);sets.push(pt)}
 const bub=[];for(let i=0;i<4;i++){const r=.8+h3(i,1,12)*.7;const sh=new THREE.Mesh(new THREE.SphereGeometry(r,24,16),new THREE.MeshBasicMaterial({color:'#cfe8ff',transparent:true,opacity:.12,depthWrite:false,side:THREE.DoubleSide}));
  const a=i/4*6.283+.4,d=2.2+h3(i,2,12)*1.4;sh.position.set(Math.cos(a)*d,(h3(i,3,12)-.5)*2,Math.sin(a)*d);g.add(sh);
  for(let j=0;j<5;j++){const b=new THREE.Mesh(new THREE.BoxGeometry(.18,.18,.18),M('#5a5e66',{roughness:.8}));b.position.set((h3(i,j,13)-.5)*r,(h3(i,j+5,13)-.5)*r,(h3(i,j+9,13)-.5)*r);b.rotation.set(j,i,j*.7);sh.add(b)}bub.push(sh)}
 g.userData.anim=t=>{sets.forEach((p,k)=>{p.material.opacity=.35+.45*Math.abs(Math.sin(t*(7.3+k*2.9)+k*1.7));p.rotation.y=t*(.02+k*.013)*(k%2?-1:1)});bub.forEach((b,i)=>{b.rotation.y=t*.1*(i+1)})};return g}
/* ---------- 虚空冰山: a living iceberg drifting through the void, a mouth-like crack in its face; little limbs sweep rocks into
   it, a frozen land and an iced-over canyon on its back, a haze of fine grains round it ---------- */
function fxP_voidIceberg(){const g=new THREE.Group();const geo=new THREE.IcosahedronGeometry(3,3);const p=geo.attributes.position;const v=new THREE.Vector3();
 for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);const n=v.clone().normalize();let k=1+.22*Math.sin(n.x*4.1+n.y*2.3)+.14*Math.sin(n.z*6.7-n.x*3.1)+.08*Math.sin(n.y*11+n.z*7);
  if(n.y>.35)k*=.88+.12*(1-n.y);if(n.y<-.2)k*=1.15;if(n.x>.55&&Math.abs(n.y)<.12)k*=.86;v.copy(n).multiplyScalar(3*k);v.y*=.72;p.setXYZ(i,v.x,v.y,v.z)}
 geo.computeVertexNormals();const ice=new THREE.Mesh(geo,M('#cfe6f2',{roughness:.25,metalness:.05,flatShading:true,emissive:'#2a5a78',emissiveIntensity:.25}));g.add(ice);
 const snow=new THREE.Mesh(new THREE.CircleGeometry(2.1,28),M('#f4f8fa',{roughness:.95}));snow.rotation.x=-Math.PI/2;snow.position.y=1.85;g.add(snow);
 const canyon=new THREE.Mesh(new THREE.BoxGeometry(3.4,.3,.35),M('#8ab8d8',{roughness:.2,emissive:'#3a7aa8',emissiveIntensity:.4}));canyon.position.set(-.2,1.8,.3);canyon.rotation.y=.5;g.add(canyon);
 const mouth=new THREE.Mesh(new THREE.BoxGeometry(.3,.28,2.4),new THREE.MeshBasicMaterial({color:'#081420'}));mouth.position.set(2.62,0,0);g.add(mouth);
 const limbM=M('#9ab8c8',{roughness:.5});const limbs=[];for(let i=0;i<8;i++){const l=new THREE.Group();const s1=cyl(.07,.04,1.1,limbM,5);s1.position.y=-.55;l.add(s1);l.position.set(2.4,-.35,(i-3.5)*.3);l.rotation.z=.6;g.add(l);limbs.push(l)}
 const rockM=M('#6a6258',{roughness:.95,flatShading:true});const rocks=[];for(let i=0;i<10;i++){const r=new THREE.Mesh(new THREE.DodecahedronGeometry(.18+h3(i,1,14)*.25,0),rockM);g.add(r);rocks.push({m:r,ph:h3(i,2,14),y:(h3(i,3,14)-.5)*1.4,z:(h3(i,4,14)-.5)*2.2})}
 for(let i=0;i<6;i++){const a=i/6*6.283;g.add(at(glowSprite('#dff4ff',3.2,.12),Math.cos(a)*3.3,(h3(i,5,14)-.5)*2,Math.sin(a)*3.3))}
 g.userData.anim=t=>{g.position.y=Math.sin(t*.2)*.3;limbs.forEach((l,i)=>{l.rotation.z=.6+.5*Math.sin(t*1.6+i*.8)});
  rocks.forEach(o=>{const f=(t*.05+o.ph)%1;o.m.position.set(2.7+(1-f)*5,o.y*(1-f*.8),o.z*(1-f*.8));o.m.rotation.set(t*.3+o.ph*6,t*.2,0);o.m.scale.setScalar(f>.92?(1-f)/.08:1)})};return g}
/* ---------- 监测站: the 尔什民 checkpoint in the void — a station whose narrow metal channel the incoming cars queue through to be
   checked, a domed restaurant looking out on the stars, and a kilometre-long warship lying alongside the queue ---------- */
function fxP_checkpoint(){const g=new THREE.Group();const P=[];
 P.push([new THREE.CylinderGeometry(1.6,1.6,.9,8).translate(0,0,0),'#b8bec4'],[new THREE.CylinderGeometry(1.1,1.6,.5,8).translate(0,.7,0),'#a4aab0'],[new THREE.CylinderGeometry(1.6,1.1,.5,8).translate(0,-.7,0),'#8a9096']);
 P.push([new THREE.CylinderGeometry(.32,.32,7,12).rotateZ(Math.PI/2).translate(-1.6,0,0),'#9aa0a6']);
 for(let i=0;i<9;i++)P.push([new THREE.TorusGeometry(.36,.05,4,14).rotateY(Math.PI/2).translate(-4.6+i*.8,0,0),'#6a7076']);
 P.push([new THREE.BoxGeometry(5.6,.42,.7).translate(.4,0,3.2),'#5a6068'],[new THREE.ConeGeometry(.35,1.1,8).rotateZ(-Math.PI/2).translate(3.75,0,3.2),'#5a6068'],[new THREE.BoxGeometry(2.4,.3,.5).translate(-.2,.34,3.2),'#6a7078']);
 for(let i=0;i<6;i++){P.push([new THREE.CylinderGeometry(.09,.11,.12,8).translate(-1.8+i*.8,.52,3.2),'#3a3e44'],[new THREE.BoxGeometry(.36,.04,.04).translate(-1.62+i*.8,.58,3.2),'#2e3238'])}
 for(let i=0;i<4;i++)P.push([new THREE.BoxGeometry(.06,.06,1.2).translate(-1+i*.7,0,2.3),'#7a8086']);
 const hull=new THREE.Mesh(mergeColored(P),VC({metalness:.6,roughness:.38}));g.add(hull);
 const dome=new THREE.Mesh(new THREE.SphereGeometry(.8,20,10,0,6.283,0,1.4),TR('#bfe8ff',.45,{emissive:'#ffd8a0',emissiveIntensity:.35}));dome.position.y=.95;g.add(dome);
 const winM=GL('#ffd890');for(let i=0;i<8;i++){const a=i/8*6.283;const w=new THREE.Mesh(new THREE.BoxGeometry(.05,.22,.5),winM);w.position.set(Math.cos(a)*1.61,0,Math.sin(a)*1.61);w.rotation.y=-a;g.add(w)}
 const cars=[];const carM=M('#d8d0c0',{metalness:.3,roughness:.5});for(let i=0;i<7;i++){const c=new THREE.Mesh(new THREE.BoxGeometry(.38,.2,.22),carM);g.add(c);cars.push(c)}
 const fl=[];for(let i=0;i<6;i++){const s=glowSprite('#9ad8ff',.35,.9);g.add(s);fl.push(s)}
 g.add(at(glowSprite('#ff6a5a',.5,.9),-5.1,.4,0),at(glowSprite('#7aff9a',.5,.9),-5.1,-.4,0));
 g.userData.anim=t=>{cars.forEach((c,i)=>{const f=((t*.06+i/7)%1);c.position.set(-9+f*7.4,.0,0)});
  fl.forEach((s,i)=>{const a=t*.5+i;s.position.set(.4+Math.cos(a)*2.6,.8+Math.sin(a*1.3)*.4,3.2+Math.sin(a)*.9)})};return g}
/* ---------- 奇迹之星: countless miracles run together — things like flame, like liquid, like raw energy, mixing and colliding
   without end — a ball that churns like a star yet never comes apart (frozen with the rest of the frozen void) ---------- */
function fxP_miracleStar(){const g=new THREE.Group();const core=new THREE.Mesh(new THREE.IcosahedronGeometry(2.2,3),new THREE.MeshBasicMaterial({color:'#fff2c8'}));g.add(core);
 const shells=[];[['#ffb05a',.35,2.45],['#7ad8ff',.25,2.65],['#e88aff',.2,2.85]].forEach(([c,o,r],i)=>{const m=new THREE.Mesh(new THREE.IcosahedronGeometry(r,2),new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:o,depthWrite:false,blending:THREE.AdditiveBlending,wireframe:i===2}));g.add(m);shells.push(m)});
 const cols=['#ff7a3a','#ffd84a','#5ad8ff','#8aff9a','#ff6ad8','#ffffff'];const bits=[];
 for(let i=0;i<36;i++){const c=cols[i%cols.length];const m=new THREE.Mesh(new THREE.IcosahedronGeometry(.18+h3(i,1,15)*.32,1),i%3?GL(c):M(c,{emissive:c,emissiveIntensity:.8,roughness:.2}));g.add(m);bits.push({m,a:h3(i,2,15)*6.28,b:h3(i,3,15)*3.14,s:.3+h3(i,4,15)*.9,r:2.3+h3(i,5,15)*.8})}
 g.add(at(glowSprite('#ffe8b0',11,.5),0,0,0));
 g.userData.anim=t=>{shells.forEach((m,i)=>{m.rotation.set(t*.07*(i+1),t*.11*(i%2?-1:1),0)});
  bits.forEach(o=>{const a=o.a+t*o.s,b=o.b+Math.sin(t*o.s*.7)*.6,r=o.r+Math.sin(t*o.s*2+o.a)*.25;o.m.position.set(Math.cos(a)*Math.sin(b)*r,Math.cos(b)*r,Math.sin(a)*Math.sin(b)*r)})};return g}
/* ---------- 信号塔: the phoenixes' relay towers, floating in the dark of the frozen void like lighthouses three hundred metres long,
   lit at both ends; the turning light holds the freeze off and draws the "combustible hums" that fly round it like moths ---------- */
function fxP_signalTower(){const g=new THREE.Group();const P=[];
 P.push([new THREE.CylinderGeometry(.34,.5,9,10).translate(0,0,0),'#8a6a4a'],[new THREE.CylinderGeometry(.62,.62,.5,10).translate(0,4.3,0),'#6a4e36'],[new THREE.CylinderGeometry(.62,.62,.5,10).translate(0,-4.3,0),'#6a4e36']);
 for(let i=0;i<6;i++)P.push([new THREE.TorusGeometry(.46-i*.012,.06,4,16).rotateX(Math.PI/2).translate(0,-3+i*1.2,0),'#c8a060']);
 const tw=new THREE.Mesh(mergeColored(P),VC({metalness:.35,roughness:.6}));g.add(tw);
 const lampM=new THREE.MeshBasicMaterial({color:'#fff0c0'});for(const y of[4.85,-4.85]){const l=new THREE.Mesh(new THREE.SphereGeometry(.45,14,10),lampM);l.position.y=y;g.add(l);g.add(at(glowSprite('#ffd890',4.5,.7),0,y,0))}
 const beams=[];for(const y of[4.85,-4.85]){const b=new THREE.Group();b.position.y=y;for(let k=0;k<2;k++){const c=new THREE.Mesh(new THREE.ConeGeometry(1.6,9,16,1,true),new THREE.MeshBasicMaterial({color:'#ffe8b0',transparent:true,opacity:.14,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));
  c.geometry.translate(0,-4.5,0);c.rotation.z=Math.PI/2+(k?Math.PI:0);b.add(c)}g.add(b);beams.push(b)}
 const moths=[];for(let i=0;i<22;i++){const s=glowSprite(i%3?'#ffb060':'#ffe080',.35,.95);g.add(s);moths.push({s,a:h3(i,1,16)*6.28,r:1.2+h3(i,2,16)*2.4,y:(h3(i,3,16)-.5)*9,w:.6+h3(i,4,16)})}
 g.userData.anim=t=>{beams.forEach((b,i)=>{b.rotation.y=t*.6*(i?-1:1)});moths.forEach(o=>{const a=o.a+t*o.w;o.s.position.set(Math.cos(a)*o.r,o.y+Math.sin(t*2*o.w+o.a)*.4,Math.sin(a)*o.r)})};return g}
/* ---------- 虚空阴影: abandoned space tunnels that drifted together and kept growing — dark translucent tubes branching like a
   great tree through the void, each branch ending in a fixed ring of an exit; the ruins inside show as faint ghost blocks ---------- */
function fxP_shadowTree(){const g=new THREE.Group();const Rn=rnd(9137);const P=[],tips=[];
 const grow=(a,dir,len,rad,depth)=>{const b=a.clone().addScaledVector(dir,len);const m=a.clone().lerp(b,.5).add(new THREE.Vector3(Rn()-.5,Rn()-.5,Rn()-.5).multiplyScalar(len*.25));
  P.push([new THREE.TubeGeometry(new THREE.CatmullRomCurve3([a,m,b]),8,rad,6,false),'#2a2440']);
  if(depth<=0){tips.push([b,dir]);return}const n=depth>2?2:2+(Rn()<.4?1:0);
  for(let i=0;i<n;i++){const d=dir.clone().add(new THREE.Vector3(Rn()-.5,Rn()-.5,Rn()-.5).multiplyScalar(1.3)).normalize();grow(b,d,len*(.62+Rn()*.14),rad*.72,depth-1)}};
 grow(new THREE.Vector3(0,-6,0),new THREE.Vector3(0,1,0),4.2,.55,4);
 const tub=new THREE.Mesh(mergeColored(P),VC({roughness:.4,metalness:.2,transparent:true,opacity:.72,emissive:'#140c28'}));g.add(tub);
 const ringM=new THREE.MeshBasicMaterial({color:'#b89cff',transparent:true,opacity:.85,blending:THREE.AdditiveBlending,depthWrite:false});
 const rings=[];for(const [b,d] of tips){const r=new THREE.Mesh(new THREE.TorusGeometry(.42,.07,6,20),ringM);r.position.copy(b);r.lookAt(b.clone().add(d));g.add(r);rings.push(r);g.add(at(glowSprite('#a890ff',1.6,.55),b.x,b.y,b.z))}
 const ghostM=new THREE.MeshBasicMaterial({color:'#8a86b0',transparent:true,opacity:.16,depthWrite:false});const ghosts=[];
 for(let i=0;i<14;i++){const h=.6+Rn()*1.6;const b=new THREE.Mesh(new THREE.BoxGeometry(.5+Rn()*.8,h,.5+Rn()*.8),ghostM);const t=tips[(Rn()*tips.length)|0][0];b.position.set(t.x+(Rn()-.5)*3,t.y+(Rn()-.5)*2,t.z+(Rn()-.5)*3);g.add(b);ghosts.push([b,Rn()*6.28])}
 g.userData.anim=t=>{rings.forEach((r,i)=>{r.rotation.z=t*.5+i});ghosts.forEach(([b,ph])=>{b.material.opacity=.08+.1*(.5+.5*Math.sin(t*.7+ph))})};return g}
/* ---------- 诺（最远的思维）: the world of "final wisdom" where 维罗尼卡 was set down — a planet surface holding several stages of
   civilisation at once, with invisible floating islands and a tower that looks wholly transparent, where a 尔什民 in 诺's shape waits ---------- */
function fxP_farNuo(){const g=new THREE.Group();const Rn=rnd(5521);
 const ground=new THREE.Mesh(new THREE.CylinderGeometry(6,6.6,1,40),M('#5f7a4a',{roughness:1}));ground.position.y=-.5;g.add(ground);
 const P=[];for(let i=0;i<7;i++){const a=Rn()*6.28,r=2.6+Rn()*2.8;P.push([new THREE.ConeGeometry(.28,.5,6).translate(Math.cos(a)*r,.25,Math.sin(a)*r),'#8a6a48'])}
 for(let i=0;i<5;i++){const a=Rn()*6.28,r=3+Rn()*2.4,h=.5+Rn()*.6;P.push([new THREE.BoxGeometry(.5,h,.5).translate(Math.cos(a)*r,h/2,Math.sin(a)*r),'#c8b8a0'])}
 g.add(new THREE.Mesh(mergeColored(P),VC({roughness:.85})));
 const glass=new THREE.MeshStandardMaterial({color:'#dff4ff',transparent:true,opacity:.18,roughness:.05,metalness:.1,depthWrite:false});
 const tw=new THREE.Mesh(new THREE.CylinderGeometry(.55,.8,7,8,1,true),glass);tw.position.y=3.5;g.add(tw);
 const edge=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.CylinderGeometry(.55,.8,7,8)),new THREE.LineBasicMaterial({color:'#ffffff',transparent:true,opacity:.35}));edge.position.y=3.5;g.add(edge);
 const nuo=new THREE.Mesh(new THREE.SphereGeometry(.28,16,12),new THREE.MeshBasicMaterial({color:'#ffe6b8'}));nuo.position.y=6.2;g.add(nuo);g.add(at(glowSprite('#ffe0a0',2.4,.7),0,6.2,0));
 const isles=[];for(let i=0;i<3;i++){const a=i*2.1+.4;const ig=new THREE.Mesh(new THREE.ConeGeometry(1.2,1.4,7),glass);ig.rotation.x=Math.PI;ig.position.set(Math.cos(a)*4,5+i*.8,Math.sin(a)*4);g.add(ig);isles.push([ig,a])}
 g.userData.anim=t=>{isles.forEach(([ig,a],i)=>{ig.position.y=5+i*.8+Math.sin(t*.6+a)*.25});nuo.scale.setScalar(1+.12*Math.sin(t*2))};return g}
/* ---------- 剪刃断脑者 (蟋蟀): three-metre leaping insects of the floating islands — long hydraulic hind legs, curved blade
   mandibles that shear a head off; drawn on a drifting island chunk, one crouched to spring ---------- */
function fxP_cricket(){const g=new THREE.Group();const Rn=rnd(3301);
 const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(3.2,1),M('#7a6a52',{roughness:.95,flatShading:true}));rock.scale.set(1,.45,1);rock.position.y=-1;g.add(rock);
 const moss=new THREE.Mesh(new THREE.CylinderGeometry(2.9,3,.25,14),M('#4f7a3c',{roughness:1}));moss.position.y=.32;g.add(moss);
 const bugs=[];const mk=(x,z,ry,k)=>{const b=new THREE.Group();const P=[];const C='#5a6a30',D='#2c3418',B='#d8d0b0';
  P.push([new THREE.SphereGeometry(.5,12,8).scale(1.9,.8,.9).translate(0,.7,0),C],[new THREE.SphereGeometry(.38,10,8).translate(1.05,.85,0),D]);
  for(const s of[-1,1]){P.push([new THREE.ConeGeometry(.08,.7,5).rotateZ(-Math.PI/2.4).rotateY(s*.35).translate(1.5,.7,s*.14),B]);
   P.push([new THREE.CylinderGeometry(.07,.1,1.5,6).rotateZ(.9).translate(-.5,1.25,s*.42),C],[new THREE.CylinderGeometry(.05,.07,1.6,6).rotateZ(-.55).translate(-1.15,.55,s*.46),D]);
   for(const dx of[.55,.15])P.push([new THREE.CylinderGeometry(.03,.04,.8,5).rotateX(s*.5).translate(dx,.35,s*.42),D]);
   P.push([new THREE.CylinderGeometry(.01,.015,1.8,4).rotateZ(-1.1).rotateY(s*.3).translate(1.9,1.4,s*.2),D])}
  b.add(new THREE.Mesh(mergeColored(P),VC({roughness:.55,metalness:.1})));b.position.set(x,.45,z);b.rotation.y=ry;b.scale.setScalar(k);g.add(b);bugs.push(b)};
 mk(-.4,.3,.3,1);mk(1.4,-1.2,2.4,.8);
 g.userData.anim=t=>{const ph=(t*.35)%1;const j=ph<.3?Math.sin(ph/.3*Math.PI)*2.4:0;bugs[1].position.y=.45+j};return g}
/* ---------- 西裂谷: the misty rift west of the dinosaur continent that the white skull dragons took for the creator's trial —
   two cliff walls falling into a gorge too wide to see across, filled to the brim with slow fog ---------- */
function fxP_mistGorge(){const g=new THREE.Group();const Rn=rnd(7717);
 // two long ridges of rough rock, their inner faces falling steeply into the gorge
 for(const sd of[-1,1]){const geo=new THREE.BoxGeometry(18,3.2,4,36,6,8);const p=geo.attributes.position;const col=new Float32Array(p.count*3);
  for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);const n=n3(x*.35+sd*7,y*.5,z*.4)-.5;const inner=sd>0?z<0:z>0;
   const zz=z+n*1.1+(inner?(y+1.6)*.35*sd:0),yy=y+(y>0?n*1.4+Math.sin(x*.4)*.4:0);p.setXYZ(i,x+n*.4,yy,zz);
   const k=clamp((yy+1.6)/4,0,1);col[i*3]=.36+.22*k;col[i*3+1]=.3+.18*k;col[i*3+2]=.24+.12*k}
  geo.setAttribute('color',new THREE.BufferAttribute(col,3));geo.computeVertexNormals();
  const m=new THREE.Mesh(geo,VC({roughness:.95}));m.position.set(0,0,sd*3.4);g.add(m)}
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(18,3),M('#2a241e',{roughness:1}));floor.rotation.x=-Math.PI/2;floor.position.y=-1.5;g.add(floor);
 // fog to the brim: stacked soft layers that drift and breathe
 const fogM=new THREE.MeshBasicMaterial({color:'#eef2f2',transparent:true,opacity:.42,depthWrite:false,side:THREE.DoubleSide});const lay=[];
 for(let i=0;i<4;i++){const f=new THREE.Mesh(new THREE.PlaneGeometry(19,3.6,1,1),fogM.clone());f.rotation.x=-Math.PI/2;f.position.y=-1.1+i*.55;g.add(f);lay.push(f)}
 const puffs=[];for(let i=0;i<10;i++){const f=glowSprite('#ffffff',2.4+Rn()*2,.35);f.material.blending=THREE.NormalBlending;f.position.set((Rn()-.5)*16,.3+Rn()*.8,(Rn()-.5)*1.6);g.add(f);puffs.push([f,Rn()*6.28])}
 g.userData.anim=t=>{lay.forEach((f,i)=>{f.material.opacity=.3+.12*Math.sin(t*.3+i)});puffs.forEach(([f,ph])=>{f.position.y=.5+Math.sin(t*.25+ph)*.3})};return g}
/* ---------- 脑灵的旋风部队: a black tornado on the south-polar ice made of countless metal shards turning round a floating
   sphere at its heart; the air around it stays still ---------- */
function fxP_metalTwister(){const g=new THREE.Group();const N=420;const Rn=rnd(6043);
  const geo=new THREE.TetrahedronGeometry(.14,0);const im=new THREE.InstancedMesh(geo,M('#2a2c30',{metalness:.8,roughness:.35}),N);im.frustumCulled=false;g.add(im);
 const S=[];for(let i=0;i<N;i++){const y=Rn()*9;S.push([y,Rn()*6.28,.4+y*.28+Rn()*.35,.8+Rn()*.6])}
 const core=new THREE.Mesh(new THREE.SphereGeometry(.45,18,12),M('#9aa4b0',{metalness:.9,roughness:.2}));core.position.y=3.6;g.add(core);g.add(at(glowSprite('#c8d8ff',1.6,.45),0,3.6,0));
 const o=new THREE.Object3D();const step=t=>{for(let i=0;i<N;i++){const [y,a0,r,w]=S[i];const a=a0+t*w*2.2;o.position.set(Math.cos(a)*r,y,Math.sin(a)*r);o.rotation.set(a,a*1.3,0);o.updateMatrix();im.setMatrixAt(i,o.matrix)}im.instanceMatrix.needsUpdate=true};
 step(0);g.userData.anim=t=>{step(t);core.position.y=3.6+Math.sin(t*1.1)*.2};return g}
/* ---------- 长老: the thirty-centimetre tailless scorpion that sits in the hollow of a ten-metre-thick tree in the bone swamp,
   among bones and dried plants under a glowing thing hung from the roof of the hollow ---------- */
function fxP_elderTree(){const g=new THREE.Group();const P=[];
 P.push([new THREE.CylinderGeometry(2.2,2.8,9,14).translate(0,4.5,0),'#5a4632']);
 for(let i=0;i<5;i++){const a=i*1.26;P.push([new THREE.CylinderGeometry(.3,.6,3,6).rotateZ(1.1).rotateY(a).translate(Math.cos(a)*2.4,.6,Math.sin(a)*2.4),'#4a3a28'])}
 P.push([new THREE.SphereGeometry(3.4,12,8).scale(1,.6,1).translate(0,9.6,0),'#3e6a34']);
 g.add(new THREE.Mesh(mergeColored(P),VC({roughness:.95})));
 const hole=new THREE.Mesh(new THREE.CircleGeometry(.9,18),new THREE.MeshBasicMaterial({color:'#120c06'}));hole.position.set(0,2.2,2.62);g.add(hole);
 const lamp=new THREE.Mesh(new THREE.SphereGeometry(.13,10,8),new THREE.MeshBasicMaterial({color:'#e8ffb0'}));lamp.position.set(0,2.85,2.5);g.add(lamp);g.add(at(glowSprite('#d8ff90',1.2,.6),0,2.85,2.55));
 const sc=new THREE.Group();const S=[];S.push([new THREE.SphereGeometry(.12,8,6).scale(1.4,.7,1),'#141414'],[new THREE.SphereGeometry(.07,8,6).translate(.16,.03,0),'#141414']);
 for(const s of[-1,1]){S.push([new THREE.ConeGeometry(.04,.2,5).rotateZ(-1.3).translate(.28,0,s*.08),'#222']);for(const dx of[-.08,0,.08])S.push([new THREE.CylinderGeometry(.012,.012,.16,4).rotateX(s*.9).translate(dx,-.04,s*.1),'#222'])}
 sc.add(new THREE.Mesh(mergeColored(S),VC({roughness:.5})));sc.position.set(0,1.95,2.66);sc.rotation.y=-Math.PI/2;sc.scale.setScalar(1.6);g.add(sc);
 g.userData.anim=t=>{sc.rotation.z=Math.sin(t*1.7)*.12};return g}
/* ---------- 金字塔: the 立蝎's pyramid houses in the southern jungle — smooth cones of ochre sand glued with saliva, no door at the
   foot (the way in is a hole in the slope, plugged with clay), crystal plates stuck on here and there, each standing in a
   clearing of knee-high golden grass with felled trunks left to rot round it ---------- */
function fxP_pyramids(){const g=new THREE.Group();const P=[],X=[];const Rn=rnd(4471);
 const pyr=(x,z,h,rot)=>{const b=h*.72;P.push([new THREE.ConeGeometry(b,h,4,1).rotateY(Math.PI/4+rot).translate(x,h/2,z),'#b8935a']);
  const fn=(Rn()*4)|0,a=rot+fn*Math.PI/2,t=.28,hx=Math.sin(a),hz=Math.cos(a),r=b*(1-t)*.72;
  P.push([new THREE.BoxGeometry(h*.09,h*.11,.05).rotateX(-.6).rotateY(a).translate(x+hx*r,h*t,z+hz*r),'#2a1e14'],[new THREE.BoxGeometry(h*.08,h*.1,.04).rotateX(-.6).rotateY(a).translate(x+hx*(r+.02),h*t-.02,z+hz*(r+.02)),'#7a5a3a']);
  for(let i=0;i<(h>2?10:3);i++){const k=Rn(),fa=rot+((Rn()*4)|0)*Math.PI/2,y=h*(.1+k*.75),rr=b*(1-y/h)*.71;X.push([new THREE.BoxGeometry(.18+Rn()*.3,.1+Rn()*.18,.02).rotateX(-.62).rotateY(fa).translate(x+Math.sin(fa)*rr,y,z+Math.cos(fa)*rr),Rn()<.5?'#bfeaf4':'#9fe0ff'])}
  P.push([new THREE.RingGeometry(b*1.1,b*1.1+h*.55,24).rotateX(-Math.PI/2).translate(x,.03,z),'#d8b84a'])};
 pyr(0,0,3.6,0);pyr(3.4,1.6,2.4,.3);pyr(-3,2.2,1.9,-.2);pyr(1.2,-3.4,.9,.5);pyr(-1.9,-2.6,.7,.1);pyr(4.2,-1.8,.6,0);
 for(let i=0;i<9;i++){const a=Rn()*6.28,d=5.2+Rn()*2;P.push([new THREE.CylinderGeometry(.09,.12,1.6+Rn(),6).rotateZ(Math.PI/2).rotateY(Rn()*3).translate(Math.cos(a)*d,.1,Math.sin(a)*d),Rn()<.5?'#5a4a34':'#6a5a3a'])}
 const m=new THREE.Mesh(mergeColored(P),detailMat(VC({roughness:.85}),{bump:.4}));g.add(m);
 const xm=new THREE.MeshStandardMaterial({vertexColors:true,emissive:'#3aa6c4',emissiveIntensity:.45,roughness:.08,flatShading:true});g.add(new THREE.Mesh(mergeColored(X),xm));
 const folk=[];for(let i=0;i<4;i++){const f=bUpright({col:'#b08a5a'});f.scale.setScalar(.32);const a=i*1.7+.4;f.position.set(Math.cos(a)*3,0,Math.sin(a)*3);f.rotation.y=-a;g.add(f);folk.push(f)}
 g.add(shadow(9));g.userData.anim=t=>{folk.forEach((f,i)=>{f.userData.anim&&f.userData.anim(t+i)})};return g}
/* ---------- 珊瑚礁: coral whose shells never break down, heaped up into ridges like mountain ranges under the sea, crowned with
   coral of every colour and busy with fish; the tops come up to just under the surface ---------- */
function fxP_reef(){const g=new THREE.Group();const P=[],Q=[];const Rn=rnd(8123);
 for(let i=0;i<7;i++){const a=i*.9+Rn()*.4,d=1+i*.9,x=Math.cos(a)*d*.8,z=Math.sin(a)*d*.5+(i%2?1:-1)*.6;const sx=1.2+Rn()*1.4,sy=2.6+Rn()*2.2,sz=.8+Rn()*.8;
  const geo=new THREE.IcosahedronGeometry(1,1);geo.scale(sx,sy,sz);geo.rotateY(a);geo.translate(x,-sy-.25-Rn()*.6,z);P.push([geo,Rn()<.5?'#8a8070':'#9a8a76']);
  for(let k=0;k<14;k++){const u=(Rn()-.5)*sx*1.4,w=(Rn()-.5)*sz*1.4,top=-.3-Math.abs(u)*.3-Rn()*.5;const c=['#ff7a5a','#ffb84a','#c86ad8','#5ad8c8','#8ad85a','#ff5a8a'][k%6];
   if(k%3===0)Q.push([new THREE.SphereGeometry(.18+Rn()*.18,8,6).translate(x+u*Math.cos(a),top,z+u*Math.sin(a)+w),c]);
   else{const h=.35+Rn()*.4;Q.push([new THREE.ConeGeometry(.05,h,5).translate(x+u*Math.cos(a),top+h/2,z+u*Math.sin(a)+w),c]);Q.push([new THREE.ConeGeometry(.04,h*.7,5).rotateZ(.5).translate(x+u*Math.cos(a)+.08,top+h*.45,z+u*Math.sin(a)+w),c])}}}
 g.add(new THREE.Mesh(mergeColored(P),VC({roughness:.95,flatShading:true})));g.add(new THREE.Mesh(mergeColored(Q),VC({roughness:.6,emissive:'#201010',emissiveIntensity:.3})));
 const fish=[];for(let i=0;i<5;i++){const sch=new THREE.Group();for(let k=0;k<7;k++){const f=new THREE.Mesh(new THREE.ConeGeometry(.05,.22,4).rotateZ(-Math.PI/2),M(['#ffd84a','#5ab8ff','#ff8a5a'][i%3],{roughness:.4}));f.position.set((k%3)*.2,(k/3|0)*.12,(k%2)*.15);sch.add(f)}g.add(sch);fish.push({o:sch,a:Rn()*6.28,r:1.5+Rn()*3,y:-.7-Rn()*1.2,w:.25+Rn()*.3})}
 g.userData.anim=t=>{fish.forEach(f=>{const a=f.a+t*f.w;f.o.position.set(Math.cos(a)*f.r+2,f.y,Math.sin(a)*f.r*.6);f.o.rotation.y=-a-Math.PI/2})};return g}
/* ---------- 云岛: the cloud creators' war islands — a crystal island wrapped in thick cloud, crystal bombs bursting from the cloud,
   a pillar of hot light beneath it that burns the cloud sea; a bare crystal island drifts beside it ---------- */
function fxP_cloudIsle(){const g=new THREE.Group();const xm=new THREE.MeshStandardMaterial({color:'#c8f0ff',emissive:'#3aa6c4',emissiveIntensity:.35,roughness:.1,metalness:.1,flatShading:true});
 const core=new THREE.Mesh(new THREE.OctahedronGeometry(1.6,1),xm);core.scale.set(1.4,.9,1.2);g.add(core);
 const cl=bMist({col:'#f4f6f8',n:16,r:2.6,h:.9,s:1.5,op:.85});g.add(cl);
 const isl=new THREE.Group();const ic=new THREE.Mesh(new THREE.OctahedronGeometry(1,0),xm);ic.scale.set(1.1,1.6,1.1);isl.add(ic);for(let i=0;i<6;i++){const s=new THREE.Mesh(new THREE.OctahedronGeometry(.35,0),xm);s.position.set(Math.cos(i)*.9,-.8+i*.25,Math.sin(i)*.9);s.scale.y=1.8;isl.add(s)}isl.position.set(5.2,1.2,-1.5);g.add(isl);
 const beamM=new THREE.MeshBasicMaterial({color:'#fff4d0',transparent:true,opacity:.22,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide});const beam=new THREE.Mesh(new THREE.CylinderGeometry(.35,.9,8,16,1,true),beamM);beam.position.y=-4.6;g.add(beam);
 const bombs=[];for(let i=0;i<10;i++){const b=new THREE.Mesh(new THREE.OctahedronGeometry(.16,0),xm);g.add(b);bombs.push({b,a:i/10*6.283,ph:i*.13})}
 g.userData.anim=t=>{cl.userData.anim&&cl.userData.anim(t);beamM.opacity=.14+.1*Math.sin(t*1.7);isl.position.y=1.2+Math.sin(t*.4)*.3;isl.rotation.y=t*.1;
  bombs.forEach(o=>{const f=(t*.35+o.ph)%1,a=o.a+t*.05;o.b.position.set(Math.cos(a)*(2+f*5),.6+f*2.2-f*f*4,Math.sin(a)*(2+f*5));o.b.visible=f<.95})};return g}
/* ---------- 监狱塔: the metal tower Lin built among the drifting fragments to hold every bird she caught — over a hundred metres,
   no way in, chains (only for show) running out to the floating rocks round it ---------- */
function fxP_prisonTower(){const g=new THREE.Group();const P=[];
 P.push([new THREE.CylinderGeometry(.9,1.2,10,8).translate(0,5,0),'#6a7078'],[new THREE.CylinderGeometry(1.3,1.3,.4,8).translate(0,10.1,0),'#4a5058'],[new THREE.ConeGeometry(1.1,1.6,8).translate(0,11.1,0),'#4a5058']);
 for(let i=0;i<5;i++)P.push([new THREE.CylinderGeometry(1.25-i*.05,1.25-i*.05,.25,8).translate(0,1.5+i*2,0),'#4e545c']);
 const rocks=[],links=[];const Rn=rnd(733);
 for(let i=0;i<6;i++){const a=i/6*6.283+.3,d=5+Rn()*2,y=2+Rn()*7;const rp=V3(Math.cos(a)*d,y,Math.sin(a)*d);P.push([new THREE.DodecahedronGeometry(.6+Rn()*.6,0).translate(rp.x,rp.y,rp.z),'#5a5248']);
  const from=V3(Math.cos(a)*1.1,y*.6+2,Math.sin(a)*1.1);const n=9;for(let k=1;k<n;k++){const p=from.clone().lerp(rp,k/n);p.y-=Math.sin(k/n*Math.PI)*.6;P.push([new THREE.TorusGeometry(.12,.035,4,8).rotateY(a+(k%2)*1.57).translate(p.x,p.y,p.z),'#8a8a8a'])}}
 g.add(new THREE.Mesh(mergeColored(P),VC({metalness:.55,roughness:.45,flatShading:true})));
 const slitM=GL('#ffcf7a');for(let i=0;i<16;i++){const a=i/8*6.283,y=2.5+(i>>3)*4;const s=new THREE.Mesh(new THREE.BoxGeometry(.05,.6,.12),slitM);s.position.set(Math.cos(a)*1.02,y,Math.sin(a)*1.02);s.rotation.y=-a;g.add(s)}
 g.userData.anim=t=>{slitM.opacity=.6+.4*Math.abs(Math.sin(t*2.3))};return g}
/* ---------- 监狱之岛 · 无尽囚笼: the 虚民 prison island chosen for the storms that ring it — high walls and a huge metal cage under a
   sky that never clears; later Lin's base, besieged by fifty-metre black-metal blocks that walk (and fly, legs tucked under)
   and by sailing ships that swim like fish and climb out onto the beach ---------- */
function fxP_prisonIsle(){const g=new THREE.Group();const P=[];const Rn=rnd(3301);
 P.push([new THREE.CylinderGeometry(4.2,4.8,1.2,18).translate(0,-.3,0),'#5a5850'],[new THREE.CylinderGeometry(3.6,4.2,.5,18).translate(0,.45,0),'#6a675e']);
 for(let i=0;i<14;i++){const a=i/14*6.283;P.push([new THREE.BoxGeometry(1.6,1.1,.25).rotateY(-a+Math.PI/2).translate(Math.cos(a)*3.1,1.2,Math.sin(a)*3.1),'#7a7c80'])}
 for(let i=0;i<4;i++){const a=i/4*6.283+.4;P.push([new THREE.CylinderGeometry(.28,.32,2.2,8).translate(Math.cos(a)*3.1,1.7,Math.sin(a)*3.1),'#6a6c70'],[new THREE.ConeGeometry(.4,.5,8).translate(Math.cos(a)*3.1,3,Math.sin(a)*3.1),'#3a3c40'])}
 for(let i=0;i<12;i++){const a=i/12*6.283;P.push([new THREE.BoxGeometry(.08,2.6,.08).translate(Math.cos(a)*1.6,2,Math.sin(a)*1.6),'#4a4c50'])}
 P.push([new THREE.TorusGeometry(1.6,.06,4,24).rotateX(Math.PI/2).translate(0,3.3,0),'#4a4c50'],[new THREE.TorusGeometry(1.6,.06,4,24).rotateX(Math.PI/2).translate(0,1.8,0),'#4a4c50'],[new THREE.SphereGeometry(1.6,12,6,0,6.283,0,1.2).scale(1,.5,1).translate(0,3.3,0),'#55575c']);
 P.push([new THREE.BoxGeometry(1.4,.9,1).translate(-1.9,1.1,-1.2),'#8a8c90'],[new THREE.BoxGeometry(1,.7,1.4).translate(1.8,1,1.4),'#8a8c90']);
 g.add(new THREE.Mesh(mergeColored(P),VC({roughness:.8,metalness:.25})));
 const bm=M('#1a1a1e',{metalness:.7,roughness:.35});const cubes=[];for(let i=0;i<2;i++){const c=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(1.4,1.4,1.4),bm);b.position.y=1.1;c.add(b);
  for(let k=0;k<4;k++){const l=cyl(.08,.06,.9,bm,5);l.position.set(k<2?-.5:.5,.35,k%2?-.5:.5);c.add(l)}c.add(at(glowSprite('#ff6a3a',.8,.8),0,1.1,.75));c.position.set(i?5.6:-5.2,i?.2:-.2,i?-2.5:2.8);g.add(c);cubes.push(c)}
 const shipM=M('#4a3a2a',{roughness:.8}),sailM=M('#c8c0b0',{roughness:.9,side:THREE.DoubleSide});const ships=[];for(let i=0;i<2;i++){const s=new THREE.Group();const h=new THREE.Mesh(new THREE.CylinderGeometry(.35,.12,2.2,6,1).rotateZ(Math.PI/2),shipM);h.scale.z=.6;s.add(h);
  const sl=new THREE.Mesh(new THREE.PlaneGeometry(1.1,1.2),sailM);sl.position.y=-.75;s.add(sl);const ms=cyl(.03,.03,1.4,shipM,4);ms.position.y=-.6;s.add(ms);s.position.set(i?-1:4.6,.5,i?5.2:4);s.rotation.y=i?.4:2.2;g.add(s);ships.push(s)}
 g.add(at(bMist({col:'#6a6e78',n:10,r:6,h:3,s:3,op:.5}),0,6,0));
 g.userData.anim=t=>{cubes.forEach((c,i)=>{c.position.y=(i?.2:-.2)+Math.abs(Math.sin(t*2+i))*.12;c.rotation.y=Math.sin(t*.3+i)*.3});ships.forEach((s,i)=>{s.rotation.z=Math.sin(t*1.5+i)*.1})};return g}
const ENT_PL=2.2, ENT_SC={space:6,tube:5,path:6};
const PLANET_ENT={rongqiu:'rongqiu',ximin:'xm_planet',erxi:'ex_planet'};

/* living things get a fine bumpy, mottled skin instead of flat plastic */
const SKIN={};
function skinify(o){if(o.userData.noSkin)return;o.traverse(c=>{if(!c.isMesh||c.isInstancedMesh)return;const m=c.material;if(!m||!m.isMeshStandardMaterial||m.transparent||m.map||m.userData.U||m.metalness>.5||m===shadowMat||m.flatShading)return;
 if(m.emissive&&m.emissiveIntensity>.25&&(m.emissive.r+m.emissive.g+m.emissive.b)>.25)return;c.material=SKIN[m.uuid]||(SKIN[m.uuid]=detailMat(m.clone(),{bump:.1,freq:6,rockK:0,mott:.4}))})}
/* fold every part that never moves into one mesh per material: far fewer draws, same look.
   a part counts as still if running the body's animation at several times leaves it where it was */
const _bm=new THREE.Matrix4(),_bi=new THREE.Matrix4();
function bake(g){const fn=g.userData.anim;const ms=[];g.updateMatrixWorld(true);_bi.copy(g.matrixWorld).invert();
 g.traverse(c=>{if(c.isMesh&&!c.isInstancedMesh&&c.geometry&&c.geometry.attributes.position&&c.material&&!Array.isArray(c.material))ms.push(c)});if(ms.length<5||!THREE.BufferGeometryUtils)return 0;
 const vis=m=>{let p=m;while(p&&p!==g){if(!p.visible)return false;p=p.parent}return true};
 const snap=()=>ms.map(m=>({e:_bm.multiplyMatrices(_bi,m.matrixWorld).elements.slice(),l:m.matrix.elements.slice(),v:vis(m),pv:m.geometry.attributes.position.version,mat:m.material}));
 const s0=snap(),ss=[];if(fn){for(const t of [.37,1.91,5.3,11.7]){try{fn(t)}catch(e){return 0}g.updateMatrixWorld(true);ss.push(snap())}}
 const groups=new Map();
 ms.forEach((m,i)=>{const a=s0[i];if(!a.v)return;const mat=m.material;if(mat.map||mat.transparent||mat===shadowMat||m.renderOrder||mat.blending!==THREE.NormalBlending)return;
  for(const b of ss){if(b[i].v!==a.v||b[i].pv!==a.pv||b[i].mat!==a.mat)return;for(let k=0;k<16;k++)if(Math.abs(b[i].e[k]-a.e[k])>1e-5)return}
  (groups.get(mat)||groups.set(mat,[]).get(mat)).push([m,a.e])});
 let n=0;for(const [mat,list] of groups){if(list.length<2)continue;const geos=[];
  for(const [m,e] of list){let q=m.geometry.index?m.geometry.toNonIndexed():m.geometry.clone();for(const k of Object.keys(q.attributes))if(k!=='position'&&k!=='normal'&&!(k==='color'&&mat.vertexColors))q.deleteAttribute(k);
   if(!q.attributes.normal)q.computeVertexNormals();if(mat.vertexColors&&!q.attributes.color)continue;const M4=new THREE.Matrix4().fromArray(e);q.applyMatrix4(M4);
   if(M4.determinant()<0){for(const k of Object.keys(q.attributes)){const A=q.attributes[k],it=A.itemSize,ar=A.array;for(let t=0;t<A.count;t+=3)for(let j=0;j<it;j++){const x=ar[(t+1)*it+j];ar[(t+1)*it+j]=ar[(t+2)*it+j];ar[(t+2)*it+j]=x}}}
   q.morphAttributes={};geos.push(q)}
  if(geos.length<2)continue;let mg=null;try{mg=THREE.BufferGeometryUtils.mergeBufferGeometries(geos,false)}catch(e){mg=null}if(!mg)continue;
  for(const [m] of list)m.visible=false;const mm=new THREE.Mesh(mg,mat);mm.userData.baked=1;g.add(mm);n+=list.length-1}
 // parts that move, but move together: fold them into one mesh on the limb or head that carries them
 const rig=new Map();ms.forEach((m,i)=>{const a=s0[i];if(!a.v||!m.visible||m.userData.baked)return;const mat=m.material;if(mat.map||mat.transparent||mat===shadowMat||m.renderOrder||mat.blending!==THREE.NormalBlending||mat.vertexColors)return;const par=m.parent;if(!par||par===g||m.children.length)return;
  for(const b of ss){if(b[i].v!==a.v||b[i].pv!==a.pv||b[i].mat!==a.mat)return;for(let k=0;k<16;k++)if(Math.abs(b[i].l[k]-a.l[k])>1e-5)return}
  const key=par.uuid+'|'+mat.uuid;(rig.get(key)||rig.set(key,{par,mat,L:[]}).get(key)).L.push(m)});
 for(const {par,mat,L} of rig.values()){if(L.length<2)continue;const geos=[];for(const m of L){m.updateMatrix();let q=m.geometry.index?m.geometry.toNonIndexed():m.geometry.clone();for(const k of Object.keys(q.attributes))if(k!=='position'&&k!=='normal')q.deleteAttribute(k);if(!q.attributes.normal)q.computeVertexNormals();q.applyMatrix4(m.matrix);
   if(m.matrix.determinant()<0){for(const k of Object.keys(q.attributes)){const A=q.attributes[k],it=A.itemSize,ar=A.array;for(let t=0;t<A.count;t+=3)for(let j=0;j<it;j++){const x=ar[(t+1)*it+j];ar[(t+1)*it+j]=ar[(t+2)*it+j];ar[(t+2)*it+j]=x}}}q.morphAttributes={};geos.push(q)}
  let mg=null;try{mg=THREE.BufferGeometryUtils.mergeBufferGeometries(geos,false)}catch(e){mg=null}if(!mg)continue;for(const m of L)m.visible=false;const mm=new THREE.Mesh(mg,mat);mm.userData.baked=1;par.add(mm);n+=L.length-1}
 return n}
/* points keep their size in world units, so they have to be scaled along with the body */
function scalePts(o,s){o.traverse(c=>{if(!c.isPoints||!c.material)return;const m=c.material;if(m.userData.sc)return;m.userData.sc=1;if(m.uniforms&&m.uniforms.uSize)m.uniforms.uSize.value*=s;else if(m.size!==undefined)m.size*=s})}
/* things in the frozen void look iced over and move slowly */
function frost(o){const tint=C('#a8bccc');o.traverse(c=>{if(!c.isMesh||!c.material||!c.material.isMeshStandardMaterial)return;const m=c.material.clone();m.color.lerp(tint,.45);if(m.emissiveIntensity)m.emissiveIntensity*=.5;c.material=m})}
function entBody(w,sp){const e=ENT[w.id];if(!e)return null;let g;try{g=e[0]()}catch(err){console.warn('entry body',w.id,err);return null}if(!g)return null;const o=e[2]||{};const pl=sp.type==='planet';
 if(!o.walk)g.traverse(c=>{if(c.userData&&c.userData.legs)c.userData.legs=null});
 const S=(e[1]||1)*(pl?ENT_PL:(ENT_SC[sp.type]||6));const root=new THREE.Group();const inner=new THREE.Group();inner.add(g);root.add(inner);inner.scale.setScalar(S);scalePts(g,S);
 if(!pl)g.traverse(c=>{if(c.material===shadowMat)c.visible=false});if(w.ng)frost(g);skinify(g);bake(g);
 root.updateMatrixWorld(true);const box=new THREE.Box3(),_bb=new THREE.Box3();inner.traverse(c=>{if(c.isMesh&&c.visible&&c.geometry&&c.material!==shadowMat&&!(c.material&&c.material.blending===THREE.AdditiveBlending)){if(!c.geometry.boundingBox)c.geometry.computeBoundingBox();if(c.isInstancedMesh){const m4=new THREE.Matrix4();for(let i=0;i<c.count;i++){c.getMatrixAt(i,m4);_bb.copy(c.geometry.boundingBox).applyMatrix4(m4).applyMatrix4(c.matrixWorld);box.union(_bb)}}else{_bb.copy(c.geometry.boundingBox).applyMatrix4(c.matrixWorld);box.union(_bb)}}});if(box.isEmpty())box.setFromObject(inner);const sph0=box.isEmpty()?new THREE.Sphere(V3(0,S,0),S*2):box.getBoundingSphere(new THREE.Sphere());
 if(!pl&&o.isle){const isl=bIslet(Math.max(S*1.2,Math.hypot(box.max.x-box.min.x,box.max.z-box.min.z)*.42));root.add(isl)}
 g.traverse(c=>{if(c.userData&&c.userData.towerMat){(sp.towerMats=sp.towerMats||[]).push(c.userData.towerMat);if(!pl)c.userData.towerMat.userData.U.uNight.value=.85}});
 const anim0=g.userData.anim;const slow=w.ng?.2:1;return{root,g,S,o,c0:sph0.center.clone(),r:Math.max(1.5,sph0.radius),tick:anim0?(t=>anim0(t*slow)):null}}

/* open ground around the bodies, so towers and forests do not swallow them */
const _ne={};function nearEnt(m,la,lo,deg){const L=_ne[m]||(_ne[m]=WIKI.filter(w=>mapOf(w)===m&&w.ll&&ENT[w.id]).map(w=>dirLL(w.ll[0],w.ll[1])));if(!L.length)return false;const d=dirLL(la,lo),c=Math.cos(deg*D2R);for(const v of L)if(v.dot(d)>c)return true;return false}
const SEAR=new Set(['sea','xm_sea','ex_sea']);
/* on a planet: set each body at its place and era */
function entryModels(sp){const have=new Set(sp.prox.map(p=>p.w.id));const placed=[];sp.entPos=sp.entPos||{};
 WIKI.filter(w=>mapOf(w)===sp.id&&w.ll&&!have.has(w.id)&&ENT[w.id]).forEach(w=>{const b=entBody(w,sp);if(!b)return;let [la,lo]=w.ll;
  if(b.o.dll){la+=b.o.dll[0];lo+=b.o.dll[1]}if(!SEAR.has(w.r)&&!(b.o.alt>4)&&!b.o.sea&&sp.gh(la,lo)<2){let best=null;for(let rr=.5;rr<=13&&!best;rr+=.5)for(let k=0;k<16;k++){const a=k/16*6.283,l2=la+Math.cos(a)*rr,o2=lo+Math.sin(a)*rr/Math.max(.2,Math.cos(la*D2R));if(sp.gh(l2,o2)>3.2){best=[l2,o2];break}}if(best){la=best[0];lo=best[1]}}for(const p of placed){if(Math.abs(p[0]-la)<.5&&Math.abs(p[1]-lo)<.5){lo+=.75;la+=.25}}placed.push([la,lo]);
  const hd=b.o.hd!==undefined?b.o.hd:h3(la,lo,7)*6.28;let h=Math.max(sp.gh(la,lo),0);{const dd=Math.min(b.r*.45,14)/(R*D2R);let m=0;for(let k=0;k<4;k++){const a=k*1.5708;m+=Math.max(sp.gh(la+Math.cos(a)*dd,lo+Math.sin(a)*dd/Math.cos(la*D2R)),0)}h=Math.max(h,m/4)}frameLL(sp,la,lo,h+(b.o.alt||0),hd,b.root,false);
  addTo(sp,b.root,w.e,true);b.root.userData.pick=w.id;b.root.updateMatrixWorld(true);const c=b.c0.clone().applyMatrix4(b.root.matrixWorld);
  // near: the body; far: a soft mote in its place, so the planet stays light to draw
  const m=mote(w);m.position.copy(c);m.visible=false;m.userData.w=w;sp.scene.add(m);(sp.motes=sp.motes||[]).push(m);
  (sp.entL=sp.entL||[]).push({root:b.root,m,c,r:b.r,far:b.o.far||clamp(b.r*80,320,1700)});if(b.tick)anim(sp,b.root,b.tick);
  prox(sp,w.id,c,Math.max(2.2,b.r*.8),{hide:()=>!b.root.visible&&!m.visible,maxD:2400,ent:1,mote:m});sp.entPos[w.id]={c,r:b.r};
  if(!(b.o.alt>4)){const deg=clamp(b.r*.5/(R*D2R),.04,.5);(sp.entClr=sp.entClr||[]).push({d:c.clone().normalize(),deg,cs:Math.cos(deg*D2R),eras:w.e||null})}
  // standing where a canyon is carved later (or filled in, going back in time): ride the ground up and down with it
  if(sp.G&&sp.G.CY&&sp.TU&&!(b.o.alt>4)&&!b.o.sea){const up=c.clone().normalize();const cy=gridSample(sp.G,sp.G.CY,up);if(cy>.5)(sp.entCy=sp.entCy||[]).push({root:b.root,c,m,up,cy,k:sp.TU.uCanyon.value})}});
 if(sp.entCy&&!sp.entCyA){sp.entCyA=1;anim(sp,null,sp.cyStep=()=>{const k=sp.TU.uCanyon.value;for(const x of sp.entCy){if(Math.abs(k-x.k)<1e-3)continue;const dh=-(k-x.k)*x.cy;x.k=k;x.root.position.addScaledVector(x.up,dh);x.c.addScaledVector(x.up,dh);x.m.position.addScaledVector(x.up,dh)}})}
 if(sp.entL&&!sp.entLOD){sp.entLOD=1;const cu=V3(),cc=V3();anim(sp,null,()=>{const cp=camera.position,cl=cp.length();cu.copy(cp).divideScalar(cl);
  for(const x of sp.entL){if(x.root.userData.eraHide){x.root.visible=false;x.m.visible=false;continue}const d=cp.distanceTo(x.c)-x.r;let hor=false;
   if(cl>R+30){const ccl=x.c.length();if(cc.copy(x.c).divideScalar(ccl).dot(cu)<R/cl-.03-x.r/ccl&&d>200)hor=true}x.root.visible=!hor&&d<x.far;x.m.visible=!hor&&d>=x.far&&d<2400}})}}
/* a body that would sit inside a world or an island stands on its surface instead */
const SOLID={planet:1,rockworld:1,core:1,star:1};
function settle(w,p){const m=mapOf(w);for(const v of WIKI){if(v===w||!v.k||v.k==='none'||mapOf(v)!==m)continue;const kp=v.kp||{};
 if(v.k==='disc'||v.k==='island'){const r=kp.r||40;const q=posOf(v);const dx=p.x-q.x,dz=p.z-q.z;if(dx*dx+dz*dz<r*r*.8&&Math.abs(p.y-q.y)<r*.7)return{p:V3(p.x,q.y+r*(v.k==='disc'?.09:.06),p.z),up:V3(0,1,0)};continue}
 if(!SOLID[v.k])continue;const R0=kp.r||sizeOf(v);if(R0<20)continue;const q=posOf(v);const d=p.distanceTo(q);if(d<R0*1.05){const up=d>1e-3?p.clone().sub(q).normalize():V3(0,1,0);return{p:q.clone().addScaledVector(up,R0*1.03),up}}}return null}
/* off a planet: a body in place of a mote */
function entryShape(w,sp,p){const b=entBody(w,sp);if(!b)return false;const o=b.root;const st=sp.type!=='tube'?settle(w,p):null;if(st){p=st.p;b.root.children.forEach(c=>{if(c!==b.root.children[0])c.visible=false});b.g.traverse(c=>{if(c.material===shadowMat)c.visible=true})}if(sp.type==='tube'&&sp.wallD){const a=Math.atan2(p.x,p.y),r=Math.hypot(p.x,p.y),lim=sp.Rt-sp.wallD(p.z,a)-1.5;if(r>lim){p=p.clone();p.x*=lim/r;p.y*=lim/r}}o.position.copy(p);
 if(sp.type==='tube')o.quaternion.setFromUnitVectors(V3(0,1,0),tubeUp(w.ang||0));else if(st)o.quaternion.setFromUnitVectors(V3(0,1,0),st.up);o.rotateY(h3(p.x,p.y,p.z)*6.28);
 if(sp.type==='tube'){const pool=new THREE.Mesh(new THREE.CircleGeometry(b.r*1.7,32),new THREE.MeshBasicMaterial({map:glowTex,color:sp.id==='midgard'?'#8a7aff':'#fff2d8',transparent:true,opacity:sp.id==='midgard'?.55:.3,blending:THREE.AdditiveBlending,depthWrite:false}));pool.rotation.x=-Math.PI/2;pool.position.y=.4;o.add(pool);if(sp.id==='midgard'){const h=glowSprite('#b8a8ff',b.r*2.6,.22);h.position.copy(b.c0);o.add(h)}}
 sp.scene.add(o);sp.ents=sp.ents||{};sp.ents[w.id]=o;if(b.tick)anim(sp,o,b.tick);o.updateMatrixWorld(true);const c=b.c0.clone().applyMatrix4(o.matrixWorld);
 b.root.userData.pick=w.id;prox(sp,w.id,c,Math.max(8,b.r*.9),{maxD:Math.max(3200,b.r*80),ent:1});(sp.entPos=sp.entPos||{})[w.id]={c,r:b.r};return true}

/* ================================================================
   entry bodies rebuilt to follow the book (C)
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

/* 琳 and 观察者: the first cells were nearly see-through, with grey nuclei */

/* ================================================================
   entry bodies of the void worlds, 尔什, 米德加尔特, the frozen void and the dream (D)
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
function fxD_scholar(){return fxD_xumin({cloth:'#3a4a5a',cloth2:'#2a3440',book:1,bag:'#5a4a3a'})}

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

/* ================================================================
   entry bodies rebuilt to follow the book (E)
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
function fxE_yuanjiao(){const g=bCeratops({w:'x',col:'#8a7a5a'});
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

/* ================================================================
   the main characters, figure by figure (F)
   ================================================================ */
const fxF_G={};   // shared geometries
function fxF_geo(k,f){return fxF_G[k]||(fxF_G[k]=f())}
function fxF_sph(r,sx,sy,sz,mat,seg){seg=seg||16;const m=new THREE.Mesh(fxF_geo('s'+seg,()=>new THREE.SphereGeometry(1,seg,Math.max(8,(seg*.75)|0))),mat);m.scale.set(r*sx,r*(sy===undefined?sx:sy),r*(sz===undefined?sx:sz));return m}
function fxF_cyl(r0,r1,h,mat,seg,open){return new THREE.Mesh(new THREE.CylinderGeometry(r0,r1,h,seg||10,1,!!open),mat)}
function fxF_tex(w,h,draw){const t=canvasTex(w,h,draw);t.anisotropy=4;return t}
function fxF_box(x,y,z,mat){return new THREE.Mesh(new THREE.BoxGeometry(x,y,z),mat)}
// a part hanging from its joint along -y
function fxF_hang(len,r0,r1,mat,seg){const g=new THREE.Group();const m=fxF_cyl(r1,r0,len,mat,seg||10);m.position.y=-len/2;g.add(m);g.add(fxF_sph(r0,1,1,1,mat,10));g.userData.len=len;return g}
// a jointed strand: each joint a group, rotate them to curl it
function fxF_chain(n,seg,r0,r1,mat,noJ){const root=new THREE.Group();const J=[];let par=root;for(let i=0;i<n;i++){const r=r0+(r1-r0)*i/n,rn=r0+(r1-r0)*(i+1)/n;const j=new THREE.Group();if(i)j.position.y=-seg;par.add(j);
  const c=fxF_cyl(rn,r,seg*1.04,mat,7);c.position.y=-seg/2;j.add(c);if(!noJ)j.add(fxF_sph(r,1,1,1,mat,8));J.push(j);par=j}
 const end=new THREE.Group();end.position.y=-seg;par.add(end);return{root,J,end}}
// lathe around y from [r,y] pairs; z squashed by d; optional gap facing +x
function fxF_lathe(pts,mat,d,seg,gap){const geo=new THREE.LatheGeometry(pts.map(p=>new THREE.Vector2(p[0],p[1])),seg||18,gap?Math.PI/2+gap:0,gap?Math.PI*2-gap*2:Math.PI*2);geo.scale(1,1,d||1);return new THREE.Mesh(geo,mat)}
// a pleated skirt or coat hem: open cone with folds, hanging from y=0
function fxF_skirt(rt,rb,len,mat,n,amp,gap){const geo=new THREE.CylinderGeometry(rt,rb,len,n*6,4,true,gap?Math.PI/2+gap:0,gap?Math.PI*2-gap*2:Math.PI*2);const P=geo.attributes.position;for(let i=0;i<P.count;i++){const x=P.getX(i),y=P.getY(i),z=P.getZ(i);const a=Math.atan2(z,x),t=(len/2-y)/len;const k=1+amp*t*Math.cos(a*n);P.setXYZ(i,x*k,y-len/2,z*k)}geo.computeVertexNormals();return new THREE.Mesh(geo,mat)}

/* ---------- people ----------
   o: {h, child(0..1), skin, iris, hair, brow, lip, female, blush}
   returns {g,headG,chest,spine,arms,legs,hands,H,rH,...}; clothes and hair are added by each character */
function fxF_person(o){o=Object.assign({h:2,child:0,skin:'#eccdb4',iris:'#5a4a3a',hair:'#2a2220',lip:'#c07a72'},o);const H=o.h,c=o.child;const g=new THREE.Group();
 const sk=M(o.skin,{roughness:.55});
 const headH=H*(.13+.045*c),legL=H*(.47-.035*c),neckL=H*.035,torL=H-legL-headH-neckL;const shW=H*(.1-.012*c),hipW=H*(.075+(o.female?.008:0));
 const R={g,H,sk,headH,legL,torL,shW,hipW,o};
 const spine=new THREE.Group();spine.position.y=legL;g.add(spine);R.spine=spine;
 const chest=new THREE.Group();chest.position.y=torL*.5;spine.add(chest);R.chest=chest;
 const fem=o.female?1:0;
 R.torsoPts=[[hipW*1.05,-torL*.06],[hipW*1.12,torL*.1],[hipW*.95,torL*.3],[shW*.72,torL*.45],[shW*(.8+fem*.05),torL*.62],[shW*.86,torL*.8],[shW*.8,torL*.92],[shW*.45,torL*1.0],[H*.03,torL*1.03]];
 const body=fxF_lathe(R.torsoPts,sk,.62,16);spine.add(body);R.body=body;
 const neck=fxF_cyl(H*.026,H*.03,neckL*1.8,sk,10);neck.position.y=torL+neckL*.4;spine.add(neck);
 const headG=new THREE.Group();headG.position.y=torL+neckL;spine.add(headG);R.headG=headG;const rH=headH*.5;R.rH=rH;
 R.eyes=[];if(!o.noHead){
 const cran=fxF_sph(rH,.95,1,.86,sk,24);cran.position.set(-rH*.04,rH*1.02,0);headG.add(cran);R.cran=cran;cran.userData.fxHead=1;
 const jaw=fxF_sph(rH,.8,.62,.74,sk,18);jaw.position.set(rH*.12,rH*.62,0);headG.add(jaw);
 const chin=fxF_sph(rH,.3,.24,.34,sk,12);chin.position.set(rH*.52,rH*.3,0);headG.add(chin);
 const big=1+c*.35;const eyes=[];const white=M('#fbfaf6',{roughness:.25}),irisM=M(o.iris,{roughness:.2}),pup=M('#0c0a0a',{roughness:.1}),gl=GL('#ffffff');
 for(const z of[-1,1]){const e=new THREE.Group();e.position.set(rH*.74,rH*.9,z*rH*.36);headG.add(e);
  e.add(fxF_sph(rH*.17*big,.45,1.05,1,o.eyeWhite||white,14));const ir=fxF_sph(rH*.12*big,.4,1.08,1,irisM,14);ir.position.x=rH*.045;e.add(ir);const pp=fxF_sph(rH*.06*big,.3,1.1,1,pup,10);pp.position.x=rH*.075;e.add(pp);
  const hl=fxF_sph(rH*.032*big,.3,1,1,gl,6);hl.position.set(rH*.095,rH*.05*big,-z*rH*.03);e.add(hl);
  const lid=fxF_sph(rH*.19*big,.5,.26,1.06,sk,12);lid.position.set(rH*.0,rH*.17*big,0);e.add(lid);eyes.push(e);
  const br=fxF_cyl(1,1,1,M(o.brow||o.hair),6);br.scale.set(rH*.035,rH*.26,rH*.03);br.rotation.x=Math.PI/2;br.rotation.y=z*.12;br.rotation.z=-z*(o.browTilt||0);br.position.set(rH*.8,rH*(1.14+c*.06),z*rH*.37);headG.add(br)}
 R.eyes=eyes;
 const nose=fxF_sph(rH,.09,.11,.075,sk,10);nose.position.set(rH*.9,rH*.7,0);headG.add(nose);
 const mouth=fxF_sph(rH,.05,.035,.16,M(o.lip,{roughness:.4}),10);mouth.position.set(rH*.86,rH*.43,0);headG.add(mouth);R.mouth=mouth;
 if(o.blush)for(const z of[-1,1]){const b=fxF_sph(rH,.04,.08,.12,TR('#ff8a8a',.32),10);b.position.set(rH*.76,rH*.62,z*rH*.46);headG.add(b)}
 for(const z of[-1,1]){const ea=fxF_sph(rH,.12,.24,.07,sk,10);ea.position.set(-rH*.02,rH*.86,z*rH*.84);headG.add(ea)}}
 const arms=[],hands=[];for(const z of[-1,1]){const sh=new THREE.Group();sh.position.set(0,torL*.86,z*shW*.98);spine.add(sh);
  const ua=fxF_hang(H*.165,H*.032,H*.026,sk);sh.add(ua);const el=new THREE.Group();el.position.y=-H*.165;ua.add(el);const fa=fxF_hang(H*.15,H*.025,H*.019,sk);el.add(fa);
  const hd=new THREE.Group();hd.position.y=-H*.15;fa.add(hd);const palm=fxF_sph(H*.03,.75,1.15,.42,sk,10);palm.position.y=-H*.028;hd.add(palm);
  const fing=fxF_sph(H*.026,.65,1,.38,sk,10);fing.position.set(H*.006,-H*.062,0);fing.rotation.z=.15;hd.add(fing);
  const th=fxF_cyl(H*.009,H*.007,H*.035,sk,6);th.position.set(H*.018,-H*.03,-z*H*.012);th.rotation.z=.5;hd.add(th);
  sh.rotation.x=z*.07;el.rotation.z=.18;arms.push({sh,ua,el,fa,hd,z});hands.push(hd)}
 R.arms=arms;R.hands=hands;
 const legs=[];for(const z of[-1,1]){const hp=new THREE.Group();hp.position.set(0,legL,z*hipW*.55);g.add(hp);const th=fxF_hang(legL*.5,H*.045,H*.034,sk);hp.add(th);const kn=new THREE.Group();kn.position.y=-legL*.5;th.add(kn);
  const sh=fxF_hang(legL*.47,H*.033,H*.022,sk);kn.add(sh);const an=new THREE.Group();an.position.y=-legL*.47;sh.add(an);legs.push({hp,th,kn,sh,an,z})}
 R.legs=legs;
 g.add(shadow(H*.2));
 return R}
// clothes on a person
function fxF_top(R,mat,o){o=o||{};const t=fxF_lathe(R.torsoPts.map(p=>[p[0]*(o.k||1.05)+(o.add||0),p[1]]),mat,(o.d||.62)*(o.k||1.05)/1.05,20,o.gap);R.spine.add(t);return t}
function fxF_sleeves(R,mat,len,o){o=o||{};const k=o.k||1,H=R.H;for(const a of R.arms){const l1=Math.min(1,len);const s=fxF_cyl(H*.037*k,H*.031*k,H*.165*l1,mat,10);s.position.y=-H*.165*l1/2;a.ua.add(s);a.ua.add(fxF_sph(H*.038*k,1,1,1,mat,10));
  if(len>1){const l2=Math.min(1,len-1);const f=fxF_cyl(H*.03*k,H*.025*k,H*.15*l2,mat,10);f.position.y=-H*.15*l2/2;a.fa.add(f);a.el.add(fxF_sph(H*.031*k,1,1,1,mat,10));
   if(o.cuff){const cf=fxF_cyl(H*.027*k,H*.027*k,H*.02,o.cuff,10);cf.position.y=-H*.15*l2+H*.01;a.fa.add(cf)}}}}
function fxF_legwear(R,mat,up,o){o=o||{};const k=o.k||1,H=R.H;for(const l of R.legs){if(up.thigh){const t=fxF_cyl(H*.05*k,H*.038*k,R.legL*.5*up.thigh,mat,10);t.position.y=-R.legL*.5*up.thigh/2;l.th.add(t);l.th.add(fxF_sph(H*.05*k,1,.8,1,mat,10))}
  if(up.shin){const s=fxF_cyl(H*.037*k,H*.026*k,R.legL*.47*up.shin,mat,10);s.position.y=-R.legL*.47*(1-up.shin/2);l.sh.add(s);if(up.shin>=1)l.kn.add(fxF_sph(H*.038*k,1,1,1,mat,10))}}}
function fxF_shoes(R,mat,o){o=o||{};const H=R.H;for(const l of R.legs){const s=fxF_sph(H*.04,1.55*(o.L||1),.62*(o.T||1),.82*(o.W||1),mat,14);s.position.set(H*.03,-H*.012,0);l.an.add(s);if(o.sole){const so=fxF_sph(H*.041,1.58*(o.L||1),.22,.86*(o.W||1),o.sole,12);so.position.set(H*.03,-H*.034,0);l.an.add(so)}}}
// hair: cap, back of the head, fringe and side locks
function fxF_hairCap(R,mat,o){o=o||{};const rH=R.rH;const cov=o.cov||.56;const cap=new THREE.Mesh(fxF_geo('hcap'+cov,()=>new THREE.SphereGeometry(1,24,14,0,Math.PI*2,0,Math.PI*cov)),mat);cap.scale.set(rH*1.0,rH*1.07,rH*.93);
 cap.position.copy(R.cran.position);cap.rotation.z=o.tilt===undefined?.32:o.tilt;R.headG.add(cap);
 const back=fxF_sph(rH,.86,.98,.92,mat,18);back.position.set(-rH*.16,rH*.9,0);R.headG.add(back);
 const n=o.fringe===undefined?7:o.fringe;for(let i=0;i<n;i++){const a=(i/(n-1)-.5)*(o.spread||1.9);const f=fxF_sph(rH,.11,.34*(o.fLen||1),.17,mat,8);f.position.set(rH*.8*Math.cos(a)+rH*.02,rH*(1.32-(o.fLen||1)*.1),rH*.84*Math.sin(a));f.rotation.x=-a*.45;f.rotation.z=-.3;R.headG.add(f)}
 if(o.side!==0)for(const z of[-1,1]){const s=fxF_sph(rH,.2,.5*(o.side||1),.15,mat,10);s.position.set(rH*.22,rH*(.9-(o.side||1)*.2),z*rH*.84);R.headG.add(s)}
 return cap}
// idle: breathe, sway, blink, look about; o.extra(t) for the character's own motion
function fxF_idle(R,o){o=o||{};const g=R.g;const ph=o.ph||0;
 g.userData.anim=t=>{t+=ph;const br=Math.sin(t*1.7);R.chest.scale.set(1,1+br*.012,1+br*.02);R.spine.rotation.z=Math.sin(t*.5)*.015+(o.lean||0);
  R.headG.rotation.y=Math.sin(t*.37)*.22*(o.look===undefined?1:o.look)+(o.turn||0);R.headG.rotation.z=Math.sin(t*.53)*.04+(o.nod||0);R.headG.rotation.x=Math.sin(t*.29)*.05+(o.tilt||0);
  const bl=(t*.31)%1;const s=bl<.035?Math.max(.08,Math.abs(bl/.0175-1)):1;for(const e of R.eyes)e.scale.y=s+Math.sin(t*.2)*.002;
  if(!o.noArms)for(const a of R.arms)a.sh.rotation.z=Math.sin(t*1.1+a.z)*.04;
  if(o.extra)o.extra(t)};return g}

/* ================= 维罗尼卡 =================
   琳的间谍在尔什用的身份：一个幼小的尔什民女孩，体重才三十公斤上下；黑发，琳特意把头发弄得极长，
   能像触手一样伸出去收集微生物、检查东西、救人。在天宫学院当学生，手上戴着学院发的手表。 */
function fxF_veronica(){const R=fxF_person({h:1.55,child:.85,skin:'#f1d9c6',iris:'#3a3348',hair:'#16141a',brow:'#1a181e',female:1,blush:1,lip:'#c9787a'});const H=R.H,rH=R.rH;R.g.userData.noSkin=1;
 const navy=M('#26304f',{roughness:.75}),navy2=M('#1b2238',{roughness:.8}),white=M('#f3f1ea',{roughness:.7}),gold=M('#d8b25a',{metalness:.7,roughness:.3}),red=M('#b8323a',{roughness:.6}),hairM=M('#16141a',{roughness:.45,metalness:.15}),sock=M('#1c1c24',{roughness:.9}),shoe=M('#2a1c18',{roughness:.35});
 // blouse under an open blazer, ribbon at the collar, pleated skirt, knee socks, loafers
 fxF_top(R,white,{k:1.03});fxF_top(R,navy,{k:1.12,gap:.38});
 for(const z of[-1,1]){const lp=fxF_box(H*.012,H*.11,H*.035,navy2);lp.position.set(R.shW*.78,R.torL*.86,z*R.shW*.26);lp.rotation.x=-z*.35;R.spine.add(lp)}
 const rib=new THREE.Group();rib.position.set(R.shW*.62,R.torL*.93,0);R.spine.add(rib);for(const z of[-1,1]){const l=fxF_sph(H*.02,.45,.7,1.3,red,10);l.position.z=z*H*.02;l.rotation.x=z*.5;rib.add(l);const tl=fxF_sph(H*.014,.4,1.8,.7,red,8);tl.position.set(H*.006,-H*.032,z*H*.01);tl.rotation.x=-z*.25;rib.add(tl)}rib.add(fxF_sph(H*.011,1,1,1,red,8));
 const badge=fxF_sph(H*.016,.3,1,1,gold,12);badge.position.set(R.shW*.78,R.torL*.66,-R.shW*.46);R.spine.add(badge);
 for(let i=0;i<2;i++){const b=fxF_sph(H*.008,.5,1,1,gold,8);b.position.set(R.shW*.84,R.torL*(.44-i*.14),R.shW*.3);R.spine.add(b)}
 const sk=fxF_skirt(R.hipW*1.15,R.hipW*1.8,H*.15,navy,12,.07);sk.position.y=-R.torL*.02;sk.scale.z=.8;R.spine.add(sk);
 const band=fxF_cyl(R.hipW*1.16,R.hipW*1.16,H*.02,navy2,20);band.position.y=-R.torL*.02;band.scale.z=.8;R.spine.add(band);
 fxF_sleeves(R,navy,1.85,{cuff:white});fxF_legwear(R,sock,{shin:.8},{k:1.04});fxF_shoes(R,shoe,{sole:navy2});
 const wa=R.arms[0];const wt=fxF_cyl(H*.024,H*.024,H*.016,M('#3a3c44',{metalness:.6,roughness:.3}),12);wt.position.y=-H*.13;wa.fa.add(wt);const face=fxF_cyl(H*.013,H*.013,H*.006,EM('#7fe0ff',.8),12);face.rotation.z=Math.PI/2;face.position.set(H*.024,-H*.13,0);wa.fa.add(face);
 // hair: black, straight, down to the backs of the knees, a few strands alive
 fxF_hairCap(R,hairM,{fringe:9,spread:2.1,side:1.6});
 const sheetM=M('#16141a',{roughness:.45,metalness:.15,side:THREE.DoubleSide});
 const sheet=new THREE.Mesh(new THREE.CylinderGeometry(rH*.98,R.hipW*1.5,H*.6,22,6,true,Math.PI*.55,Math.PI*.9),sheetM);
 {const P=sheet.geometry.attributes.position;for(let i=0;i<P.count;i++){const x=P.getX(i),y=P.getY(i),z=P.getZ(i);const a=Math.atan2(z,x);const w=1+.05*Math.sin(a*15+y*9);P.setXYZ(i,x*w,y,z*w)}sheet.geometry.computeVertexNormals()}
 sheet.position.set(-rH*.2,R.torL+R.headH*.62-H*.3,0);R.spine.add(sheet);
 const flow=new THREE.Group();flow.position.set(-rH*.35,R.torL+rH*1.4,0);R.spine.add(flow);
 const strands=[];for(let i=0;i<7;i++){const a=(i/6-.5)*2.4;const live=i===1||i===3||i===5;const ch=fxF_chain(live?14:8,H*(live?.05:.075),H*.016,H*.004,hairM,!live);ch.root.position.set(-rH*.45*Math.cos(a)+rH*.1,0,rH*.8*Math.sin(a));flow.add(ch.root);if(!live)ch.J.forEach((j,k)=>{j.rotation.z=(k===0?.15:0)+Math.sin(i+k)*.03;j.rotation.x=k===0?Math.sin(a)*.25:0});strands.push({J:ch.J,ph:i*1.37,z:Math.sin(a),live})}
 fxF_idle(R,{extra:t=>{for(const s of strands)s.J.forEach((j,k)=>{if(s.live){const w=Math.sin(t*1.2+s.ph-k*.45);j.rotation.z=k===0?-1.85-.3*Math.sin(t*.5+s.ph):-.02+w*.22;j.rotation.x=k===0?s.z*.75:Math.cos(t*.9+s.ph-k*.5)*.12}
   });
  R.arms[1].sh.rotation.z=-.1+Math.sin(t*.8)*.05}});
 return R.g}

/* the academy uniform, shared by the students of 天宫学院 */
function fxF_uniform(R,o){o=o||{};const H=R.H;const navy=M('#26304f',{roughness:.75}),navy2=M('#1b2238',{roughness:.8}),white=M('#f3f1ea',{roughness:.7}),gold=M('#d8b25a',{metalness:.7,roughness:.3}),tie=M(o.tie||'#b8323a',{roughness:.6});
 fxF_top(R,white,{k:1.03});fxF_top(R,navy,{k:1.12,gap:.38});
 for(const z of[-1,1]){const lp=fxF_box(H*.012,H*.11,H*.035,navy2);lp.position.set(R.shW*.78,R.torL*.86,z*R.shW*.26);lp.rotation.x=-z*.35;R.spine.add(lp)}
 const rib=new THREE.Group();rib.position.set(R.shW*.62,R.torL*.93,0);R.spine.add(rib);for(const z of[-1,1]){const l=fxF_sph(H*.02,.45,.7,1.3,tie,10);l.position.z=z*H*.02;l.rotation.x=z*.5;rib.add(l);const tl=fxF_sph(H*.014,.4,1.8,.7,tie,8);tl.position.set(H*.006,-H*.032,z*H*.01);tl.rotation.x=-z*.25;rib.add(tl)}rib.add(fxF_sph(H*.011,1,1,1,tie,8));
 const badge=fxF_sph(H*.016,.3,1,1,gold,12);badge.position.set(R.shW*.78,R.torL*.66,-R.shW*.46);R.spine.add(badge);
 for(let i=0;i<2;i++){const b=fxF_sph(H*.008,.5,1,1,gold,8);b.position.set(R.shW*.84,R.torL*(.44-i*.14),R.shW*.3);R.spine.add(b)}
 const sk=fxF_skirt(R.hipW*1.15,R.hipW*(o.flare||1.8),H*(o.skirt||.15),navy,12,.07);sk.position.y=-R.torL*.02;sk.scale.z=.8;R.spine.add(sk);
 const band=fxF_cyl(R.hipW*1.16,R.hipW*1.16,H*.02,navy2,20);band.position.y=-R.torL*.02;band.scale.z=.8;R.spine.add(band);
 fxF_sleeves(R,navy,o.sleeve||1.85,{cuff:white});
 // the watch the academy hands out
 const wa=R.arms[0];const wt=fxF_cyl(H*.024,H*.024,H*.016,M('#3a3c44',{metalness:.6,roughness:.3}),12);wt.position.y=-H*.13;wa.fa.add(wt);const face=fxF_cyl(H*.013,H*.013,H*.006,EM(o.watch||'#7fe0ff',.8),12);face.rotation.z=Math.PI/2;face.position.set(H*.024,-H*.13,0);wa.fa.add(face);
 return {navy,navy2,white}}

/* ================= 比露 =================
   维罗尼卡的同学：年纪小、胆子时大时小、力气惊人（只强化了一点体能就能一拳把偷猎者的脸打凹），
   从学长手里抢来一把长刀，总念叨着想要真正的单分子利刃。 */
function fxF_bilu(){const R=fxF_person({h:1.62,child:.7,skin:'#efcfb2',iris:'#3f6a3a',hair:'#b8562a',brow:'#8a3a1a',female:1,blush:1,lip:'#d07a6a',browTilt:.15});const H=R.H,rH=R.rH;R.g.userData.noSkin=1;
 const U=fxF_uniform(R,{tie:'#e0a030',sleeve:1.45,skirt:.14});const hairM=M('#b8562a',{roughness:.6});
 fxF_legwear(R,M('#f0eee8',{roughness:.9}),{shin:.55},{k:1.04});fxF_shoes(R,M('#c83a2a',{roughness:.4}),{sole:M('#f4f4f4'),L:1.05,T:1.15});
 // rolled sleeves, sticking plaster on the cheek
 for(const a of R.arms){const r=fxF_cyl(H*.04,H*.04,H*.03,U.white,10);r.position.y=-H*.15;a.ua.add(r)}
 const pl=fxF_box(rH*.05,rH*.12,rH*.22,M('#f2d8b0'));pl.position.set(rH*.66,rH*.62,-rH*.5);pl.rotation.y=.6;R.headG.add(pl);
 // short messy hair with a high side ponytail
 fxF_hairCap(R,hairM,{fringe:6,spread:1.8,fLen:.8,side:.9});
 for(let i=0;i<5;i++){const t=fxF_sph(rH,.12,.3,.12,hairM,8);const a=i*1.26;t.position.set(-rH*.3+Math.cos(a)*rH*.4,rH*1.85,Math.sin(a)*rH*.4);t.rotation.set(Math.sin(a)*.8,0,Math.cos(a)*.8);R.headG.add(t)}
 const tie=fxF_sph(rH,.12,.12,.12,M('#e0a030'),8);tie.position.set(-rH*.55,rH*1.55,rH*.6);R.headG.add(tie);
 const tail=fxF_chain(6,rH*.32,rH*.2,rH*.06,hairM);tail.root.position.copy(tie.position);tail.root.rotation.set(.5,0,-.9);R.headG.add(tail.root);
 // the long blade, resting on her shoulder
 const bl=new THREE.Group();const hilt=fxF_cyl(H*.014,H*.014,H*.13,M('#2a2420',{roughness:.6}),8);bl.add(hilt);const gd=fxF_box(H*.02,H*.012,H*.07,M('#8a8478',{metalness:.7,roughness:.3}));gd.position.y=H*.07;bl.add(gd);
 const blade=fxF_box(H*.006,H*.62,H*.035,M('#dfe6ec',{metalness:.9,roughness:.15}));blade.position.y=H*.38;bl.add(blade);const edge=fxF_box(H*.003,H*.6,H*.006,EM('#bff4ff',.5));edge.position.set(0,H*.38,H*.019);bl.add(edge);
 const ra=R.arms[1];ra.hd.add(bl);bl.position.set(0,-H*.04,0);bl.rotation.set(0,0,-1.55);
 const la=R.arms[0];
 fxF_idle(R,{look:.7,noArms:1,extra:t=>{const b=Math.abs(Math.sin(t*3.2))*.012;R.spine.position.y=R.legL+b*H*.6;for(const l of R.legs){l.hp.position.y=R.legL+b*H*.6;l.kn.rotation.z=-.05-b*3}
  ra.sh.rotation.z=.45+Math.sin(t*1.6)*.05;ra.sh.rotation.x=.12;ra.el.rotation.z=2.15;la.sh.rotation.z=-.15;la.sh.rotation.x=-.45;la.el.rotation.z=1.5;la.el.rotation.x=.3;tail.J.forEach((j,k)=>j.rotation.z=(k?.25:0)+Math.sin(t*3.2-k*.6)*.12)}});
 return R.g}

/* ================= 特丽提 =================
   英雄总部地下实验室里穿白衣的研究员，地位不低，学生们叫它特丽提老师；
   一有空就盯着眼前的影像屏幕敲资料，一心想去探索“泥潭”。 */
function fxF_teliti(){const R=fxF_person({h:1.95,child:0,skin:'#e9cdb6',iris:'#4a6a8a',hair:'#5a3e30',female:1,lip:'#b86a62'});const H=R.H,rH=R.rH;R.g.userData.noSkin=1;
 const coat=M('#f7f7f3',{roughness:.65}),under=M('#5d6e86',{roughness:.8}),pants=M('#3a3f4a',{roughness:.85}),hairM=M('#5a3e30',{roughness:.6});
 fxF_top(R,under,{k:1.03});fxF_top(R,coat,{k:1.13,gap:.32});
 const hem=fxF_skirt(R.hipW*1.25,R.hipW*1.6,H*.3,M('#f7f7f3',{roughness:.65,side:THREE.DoubleSide}),5,.04,.3);hem.position.y=R.torL*.05;hem.scale.z=.82;R.spine.add(hem);
 for(const z of[-1,1]){const lp=fxF_box(H*.012,H*.16,H*.04,coat);lp.position.set(R.shW*.8,R.torL*.8,z*R.shW*.28);lp.rotation.x=-z*.3;R.spine.add(lp);
  const pk=fxF_box(H*.01,H*.05,H*.06,M('#e8e8e2'));pk.position.set(R.hipW*1.25,-R.torL*.04,z*R.hipW*.75);pk.rotation.y=-z*.5;R.spine.add(pk)}
 for(let i=0;i<3;i++){const p=fxF_cyl(H*.004,H*.004,H*.05,M(['#2a5aa8','#c83a3a','#1a1a1a'][i]),5);p.position.set(R.shW*.85,R.torL*.7,-R.shW*(.34+i*.06));R.spine.add(p)}
 // the access card that let the spy in everywhere
 const card=fxF_box(H*.004,H*.05,H*.034,M('#e8eef4'));card.position.set(R.shW*.92,R.torL*.58,R.shW*.38);R.spine.add(card);const cs=fxF_box(H*.005,H*.014,H*.028,EM('#3a8ae0',.6));cs.position.set(R.shW*.925,R.torL*.6,R.shW*.38);R.spine.add(cs);
 fxF_sleeves(R,coat,1.9,{k:1.08});fxF_legwear(R,pants,{thigh:1,shin:1});fxF_shoes(R,M('#2a2622',{roughness:.4}),{sole:M('#1a1816')});
 // thin glasses, hair pinned up in a bun with a pencil through it
 const gm=M('#6a5040',{metalness:.4,roughness:.4});for(const z of[-1,1]){const ri=new THREE.Mesh(new THREE.TorusGeometry(rH*.15,rH*.016,6,16),gm);ri.position.set(rH*.86,rH*.9,z*rH*.35);ri.rotation.y=Math.PI/2;R.headG.add(ri);const arm=fxF_cyl(rH*.012,rH*.012,rH*.8,gm,4);arm.rotation.z=Math.PI/2;arm.position.set(rH*.45,rH*.95,z*rH*.75);R.headG.add(arm)}
 const lensM=TR('#d8f0ff',.25);for(const z of[-1,1]){const l=fxF_sph(rH*.15,.1,1,1,lensM,12);l.position.set(rH*.87,rH*.9,z*rH*.35);R.headG.add(l)}
 fxF_hairCap(R,hairM,{fringe:5,spread:1.5,fLen:.7,side:1.1,tilt:.2});const bun=fxF_sph(rH*.42,1,.9,1,hairM,14);bun.position.set(-rH*.78,rH*1.45,0);R.headG.add(bun);
 const pen=fxF_cyl(rH*.03,rH*.03,rH*1.1,M('#d8b040'),6);pen.position.copy(bun.position);pen.rotation.x=1.2;pen.rotation.z=.3;R.headG.add(pen);
 // the floating screen it keeps typing on
 const scr=new THREE.Group();scr.position.set(H*.3,H*.62,0);R.g.add(scr);
 const tex=fxF_tex(128,96,(x,w,h)=>{x.fillStyle='rgba(20,60,90,.55)';x.fillRect(0,0,w,h);x.strokeStyle='#bff4ff';x.lineWidth=2;x.strokeRect(2,2,w-4,h-4);x.fillStyle='#bff4ff';for(let i=0;i<9;i++)x.fillRect(10,12+i*8,20+((i*37)%70),3);x.beginPath();x.arc(100,60,16,0,6.3);x.stroke();x.beginPath();x.moveTo(100,44);x.lineTo(100,76);x.moveTo(84,60);x.lineTo(116,60);x.stroke()});
 const pane=new THREE.Mesh(new THREE.PlaneGeometry(H*.26,H*.19),new THREE.MeshBasicMaterial({map:tex,transparent:true,opacity:.85,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));pane.rotation.y=-Math.PI/2+0;pane.rotation.x=0;pane.rotation.order='YXZ';pane.rotation.x=-.5;scr.add(pane);
 const kbd=new THREE.Mesh(new THREE.PlaneGeometry(H*.18,H*.07),new THREE.MeshBasicMaterial({color:'#7fe0ff',transparent:true,opacity:.35,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));kbd.rotation.x=-Math.PI/2;kbd.position.set(-H*.12,-H*.12,0);scr.add(kbd);scr.add(at(glowSprite('#9fe8ff',H*.5,.25),0,0,0));
 for(const a of R.arms){a.sh.rotation.z=.75;a.el.rotation.z=1.1;a.sh.rotation.x=-a.z*.1}
 fxF_idle(R,{look:.25,tilt:.12,noArms:1,extra:t=>{R.arms.forEach((a,i)=>{a.sh.rotation.z=.72+Math.sin(t*9+i*2)*.03;a.el.rotation.z=1.15+Math.max(0,Math.sin(t*11+i*1.7))*.12});pane.material.opacity=.75+Math.sin(t*7)*.08;scr.position.y=H*.62+Math.sin(t*1.3)*H*.008}});
 return R.g}

/* ================= 诺 与 炉火 =================
   代表尔什意识的领队，穿着虚空防护服（硬头盔、背后的小推进包、带钩爪的鞋、腰间的匕首）。
   在凝固虚空的入口，它摘下头盔坐在地上，看着那块会发光的“炉火”发呆：
   一米见方、像石块的方形生物，顶上跳着白色的、没有温度的火焰，照亮周围一圈，外面是彻底的漆黑。 */
function fxF_hearth(s){s=s||1;const g=new THREE.Group();const stone=M('#6f6a64',{roughness:.95,flatShading:true});
 const geo=new THREE.BoxGeometry(1,1,1,4,4,4);const P=geo.attributes.position;for(let i=0;i<P.count;i++){const x=P.getX(i),y=P.getY(i),z=P.getZ(i);const n=(h3(x*3.1,y*2.7,z*3.3)-.5)*.06;const k=.94+n;P.setXYZ(i,x*k,y*k,z*k)}geo.computeVertexNormals();
 const cube=new THREE.Mesh(geo,stone);cube.scale.setScalar(s);cube.position.y=s*.5;g.add(cube);
 for(let i=0;i<6;i++){const c=fxF_box(s*.02,s*.3,s*.01,M('#3a3632'));c.position.set((h3(i,1,1)-.5)*s*.8,s*(.3+h3(i,2,1)*.4),s*.505);c.rotation.z=h3(i,3,1)-.5;g.add(c)}
 const core=fxF_sph(s*.22,1,.5,1,GL('#f4f8ff',.9),12);core.position.y=s*1.01;g.add(core);
 const fl=[];for(let i=0;i<5;i++){const f=new THREE.Mesh(fxF_geo('flame',()=>new THREE.ConeGeometry(1,1,8,1,true)),GL(i%2?'#ffffff':'#dfe8ff',.55));f.position.set((h3(i,4,1)-.5)*s*.25,s*1.2,(h3(i,5,1)-.5)*s*.25);g.add(f);fl.push(f)}
 const em=emitter({n:50,life:1.2,speed:s*.7,spread:.25,size:s*.5,dir:[0,1,0],col:'#ffffff',col2:'#c8d8ff',op:.8,area:[s*.4,s*.05,s*.4]});em.position.y=s*1.05;g.add(em);
 const halo=glowSprite('#eef4ff',s*4,.55);halo.position.y=s*1.3;g.add(halo);
 g.userData.anim=t=>{fl.forEach((f,i)=>{const k=.8+.3*Math.sin(t*(7+i)+i*2);f.scale.set(s*(.18-i*.02),s*(.6+.25*Math.sin(t*5.3+i))*k,s*(.18-i*.02));f.position.y=s*1.02+f.scale.y*.5;f.rotation.y=t*(1+i*.3)});halo.material.opacity=.45+Math.sin(t*6.1)*.08;core.scale.y=s*.11*(1+Math.sin(t*9)*.1)};
 return g}
function fxF_nuo(){const g=new THREE.Group();g.userData.noSkin=1;const R=fxF_person({h:2,child:0,skin:'#e2c4ac',iris:'#6a6a5a',hair:'#3a3430',lip:'#a8665e'});const H=R.H,rH=R.rH;R.g.userData.noSkin=1;
 const suit=M('#d9dcd8',{roughness:.55}),pad=M('#8a9098',{roughness:.5,metalness:.3}),orange=M('#d8742a',{roughness:.5}),dark=M('#2e3236',{roughness:.6,metalness:.3});
 fxF_top(R,suit,{k:1.12});const vest=fxF_top(R,pad,{k:1.2});vest.scale.y=.55;vest.position.y=R.torL*.42;
 fxF_sleeves(R,suit,2,{k:1.12,cuff:pad});fxF_legwear(R,suit,{thigh:1,shin:1},{k:1.12});
 for(const l of R.legs){const kp=fxF_sph(H*.045,1,.8,1,pad,10);kp.position.x=H*.03;l.kn.add(kp);const bt=fxF_cyl(H*.042,H*.045,H*.09,dark,10);bt.position.y=-H*.03;l.an.add(bt);
  const ft=fxF_sph(H*.045,1.5,.6,.9,dark,12);ft.position.set(H*.03,-H*.065,0);l.an.add(ft);for(let i=0;i<3;i++){const cl=cone(H*.008,H*.03,M('#9aa0a6',{metalness:.8,roughness:.3}),4);cl.rotation.z=Math.PI;cl.position.set(H*(.0+i*.03),-H*.1,(i-1)*H*.015);l.an.add(cl)}}
 for(const h of R.hands){const gl=fxF_sph(H*.034,.8,1.2,.55,pad,10);gl.position.y=-H*.035;h.add(gl)}
 for(let i=0;i<3;i++){const st=fxF_box(H*.012,H*.02,H*.16,orange);st.position.set(R.shW*.9,R.torL*(.62-i*.06),0);st.rotation.y=0;R.spine.add(st)}
 const lamp=fxF_cyl(H*.012,H*.012,H*.006,EM('#7fd8ff',.9),10);lamp.rotation.z=Math.PI/2;lamp.position.set(R.shW*.98,R.torL*.78,-R.shW*.4);R.spine.add(lamp);
 // small thruster pack and battery
 const pack=fxF_box(H*.09,H*.2,H*.18,pad);pack.position.set(-R.shW*.85,R.torL*.6,0);R.spine.add(pack);for(const z of[-1,1]){const n=fxF_cyl(H*.025,H*.018,H*.05,dark,10);n.position.set(-R.shW*.9,R.torL*.43,z*H*.05);R.spine.add(n)}
 const bat=fxF_box(H*.04,H*.08,H*.06,orange);bat.position.set(-R.shW*1.15,R.torL*.68,0);R.spine.add(bat);
 // belt with the dagger it used on the claw
 const belt=fxF_cyl(R.hipW*1.2,R.hipW*1.2,H*.025,dark,18);belt.scale.z=.7;belt.position.y=R.torL*.05;R.spine.add(belt);
 const dg=new THREE.Group();dg.position.set(R.hipW*.3,R.torL*.03,R.hipW*.95);dg.rotation.x=.4;R.spine.add(dg);dg.add(fxF_box(H*.015,H*.08,H*.025,M('#4a3a2a')));const db=fxF_box(H*.006,H*.12,H*.02,M('#c8ccd0',{metalness:.9,roughness:.2}));db.position.y=-H*.1;dg.add(db);
 const collar=new THREE.Mesh(new THREE.TorusGeometry(H*.042,H*.009,8,18),pad);collar.rotation.x=Math.PI/2;collar.position.y=R.torL+H*.01;R.spine.add(collar);
 fxF_hairCap(R,M('#3a3430',{roughness:.7}),{fringe:5,spread:1.6,fLen:.6,side:.8});
 // sitting on the ground, knees up, arms on them, staring into the white flame
 const sitY=H*.08;R.spine.position.y=sitY;for(const l of R.legs){l.hp.position.y=sitY;l.hp.rotation.z=1.25;l.hp.rotation.x=l.z*.25;l.kn.rotation.z=-2.1}
 for(const a of R.arms){a.sh.rotation.z=.9;a.sh.rotation.x=-a.z*.15;a.el.rotation.z=.7}
 R.spine.rotation.z=.12;
 // the helmet, set down beside it
 const hm=new THREE.Group();hm.position.set(-H*.05,H*.11,H*.32);g.add(hm);hm.add(fxF_sph(H*.11,1,1,1,suit,20));const vis=fxF_sph(H*.1,.8,.75,.85,M('#2a3a4a',{metalness:.8,roughness:.08}),18);vis.position.x=H*.035;hm.add(vis);hm.rotation.z=-.4;hm.rotation.y=.6;
 const ring=new THREE.Mesh(new THREE.TorusGeometry(H*.07,H*.015,6,16),pad);ring.rotation.z=Math.PI/2;ring.position.x=-H*.08;hm.add(ring);
 g.add(R.g);R.g.position.set(-H*.2,0,0);
 const ht=fxF_hearth(.85);ht.position.set(H*.55,0,-H*.05);ht.rotation.y=.4;g.add(ht);
 // the pool of light it keeps; beyond it the ground goes to black
 const pool=new THREE.Mesh(new THREE.CircleGeometry(H*.95,40),new THREE.MeshBasicMaterial({map:glowTex,color:'#dfe8ff',transparent:true,opacity:.5,depthWrite:false,blending:THREE.AdditiveBlending}));pool.rotation.x=-Math.PI/2;pool.position.set(H*.55,.02,0);g.add(pool);
 fxF_idle(R,{look:.08,tilt:-.1,turn:.05,noArms:1,extra:t=>{R.spine.position.y=sitY;R.spine.rotation.z=.14+Math.sin(t*.4)*.02}});
 const a0=R.g.userData.anim;g.userData.anim=t=>{a0(t);ht.userData.anim(t)};return g}

/* ================= 罗沙莉 =================
   捕获者文明里的一个阿特兰，食物广场大庆祝的主办者：一手高举着圆筒，开开心心地召开宴会，
   对“不同的生物混在一起吃会出事”毫不在意；后来又站出来大声反对战争。 */
function fxF_rosalie(){const g=new THREE.Group();g.userData.noSkin=1;const R=fxF_person({h:1.9,child:0,skin:'#e8c9ae',iris:'#3a7a6a',hair:'#e8b860',female:1,lip:'#d05a6a',blush:1});const H=R.H,rH=R.rH;R.g.userData.noSkin=1;
 const dress=M('#d8447a',{roughness:.55}),dress2=M('#f4c040',{roughness:.5}),sash=M('#3a9ac8',{roughness:.5}),hairM=M('#e8b860',{roughness:.55});
 fxF_top(R,dress,{k:1.05});
 const sk1=fxF_skirt(R.hipW*1.1,R.hipW*2.4,H*.36,dress,9,.1);sk1.position.y=R.torL*.02;sk1.scale.z=.85;R.spine.add(sk1);
 const sk2=fxF_skirt(R.hipW*1.12,R.hipW*2.0,H*.2,dress2,9,.12);sk2.position.y=R.torL*.03;sk2.scale.z=.85;sk2.rotation.y=.35;R.spine.add(sk2);
 const sa=new THREE.Mesh(new THREE.TorusGeometry(R.hipW*1.12,H*.018,6,20),sash);sa.rotation.x=Math.PI/2;sa.scale.y=.8;sa.position.y=R.torL*.12;R.spine.add(sa);
 const bow=fxF_sph(H*.03,.6,1,1.4,sash,10);bow.position.set(-R.hipW*1.1,R.torL*.12,0);R.spine.add(bow);
 fxF_sleeves(R,dress2,.55,{k:1.25});
 for(const a of R.arms){const p=fxF_sph(H*.05,1,.8,1,dress2,12);p.position.y=-H*.02;a.ua.add(p)}
 for(let i=0;i<9;i++){const b=fxF_sph(H*.009,1,1,1,M(['#ffffff','#f4c040','#3a9ac8'][i%3],{roughness:.2,metalness:.3}),8);const a=(i/8-.5)*2.2;b.position.set(R.shW*.7*Math.cos(a),R.torL*.96-Math.cos(a)*H*.02,R.shW*.7*Math.sin(a)*.7);R.spine.add(b)}
 fxF_legwear(R,M('#f4e8e0'),{shin:.2});fxF_shoes(R,M('#c8344a',{roughness:.3}),{sole:M('#2a1a1a')});
 // big wavy hair with a flower
 fxF_hairCap(R,hairM,{fringe:6,spread:1.7,side:1.6,fLen:.9});
 for(let i=0;i<9;i++){const a=Math.PI*.6+i/8*Math.PI*.8;const c=fxF_chain(4,H*.06,H*.03,H*.012,hairM);c.root.position.set(R.cran.position.x+Math.cos(a)*rH*.85,rH*.9,Math.sin(a)*rH*.85);c.root.rotation.x=Math.sin(a)*.25;c.J.forEach((j,k)=>j.rotation.z=(k%2?.25:-.25));R.headG.add(c.root)}
 const fl=new THREE.Group();fl.position.set(rH*.2,rH*1.6,rH*.75);R.headG.add(fl);for(let i=0;i<5;i++){const p=fxF_sph(rH*.16,1,.4,1,M('#ff6a8a',{roughness:.4}),8);const a=i/5*6.28;p.position.set(Math.cos(a)*rH*.14,0,Math.sin(a)*rH*.14);fl.add(p)}fl.add(fxF_sph(rH*.08,1,1,1,M('#ffe060'),8));fl.rotation.x=-1.2;
 // the raised cylinder
 const ra=R.arms[1];const cup=new THREE.Group();ra.hd.add(cup);cup.position.y=-H*.05;const cy=fxF_cyl(H*.03,H*.026,H*.12,M('#c8d0d8',{metalness:.8,roughness:.25}),12);cup.add(cy);const lid=fxF_cyl(H*.032,H*.032,H*.012,M('#3a9ac8',{metalness:.4}),12);lid.position.y=H*.065;cup.add(lid);cup.add(at(glowSprite('#ffe8a0',H*.3,.4),0,H*.09,0));
 g.add(R.g);
 // a table of food from many kinds of creatures
 const tb=new THREE.Group();tb.position.set(H*.55,0,H*.55);g.add(tb);const top=fxF_cyl(H*.32,H*.32,H*.03,M('#e8dcc0',{roughness:.7}),24);top.position.y=H*.48;tb.add(top);const cl=fxF_cyl(H*.34,H*.34,H*.12,M('#c84a6a',{side:THREE.DoubleSide}),24,1);cl.position.y=H*.42;tb.add(cl);const leg=fxF_cyl(H*.03,H*.05,H*.46,M('#6a4a3a'),8);leg.position.y=H*.23;tb.add(leg);
 const foods=[['#e85a5a',.05],['#7ad85a',.04],['#5aa8e8',.06],['#c85ae8',.035],['#e8c05a',.05],['#a86a3a',.045],['#3ad8c8',.03]];foods.forEach((f,i)=>{const a=i/7*6.28+.3,r=H*(.1+(i%3)*.06);const pl=fxF_cyl(H*.06,H*.05,H*.008,M('#f8f8f8'),14);pl.position.set(Math.cos(a)*r,H*.5,Math.sin(a)*r);tb.add(pl);const fd=i%2?new THREE.Mesh(ko(H*f[1]),M(f[0],{flatShading:true})):fxF_sph(H*f[1],1,.7,1,M(f[0],{roughness:.4}),10);fd.position.set(Math.cos(a)*r,H*.52+H*f[1]*.4,Math.sin(a)*r);tb.add(fd)});
 const lan=[];for(let i=0;i<10;i++){const a=i/10*6.28;lan.push(V3(Math.cos(a)*H*1.2,H*1.35+Math.sin(i*1.7)*H*.1,Math.sin(a)*H*1.2))}g.add(sparkles(lan,'#ffd890',H*.25,1,.6));
 fxF_idle(R,{look:.4,noArms:1,extra:t=>{ra.sh.rotation.z=2.6+Math.sin(t*2.2)*.12;ra.sh.rotation.x=.25;ra.el.rotation.z=.35+Math.sin(t*2.2+.5)*.1;const la=R.arms[0];la.sh.rotation.z=.25+Math.sin(t*1.5)*.15;la.sh.rotation.x=-.35;la.el.rotation.z=.6;R.mouth.scale.y=R.rH*(.035+Math.max(0,Math.sin(t*6))*.03);
  R.spine.position.y=R.legL+Math.abs(Math.sin(t*2.2))*H*.006}});
 const a0=R.g.userData.anim;g.userData.anim=a0;return g}

/* ================= 莎琳 =================
   第一卷开头：金色短发、可爱的脸，像个小女孩的身影掠过海面，轻轻挥手，洒下一片水滴般的细胞，
   在其中一粒里加上自己的知识与意识。终卷里它是一直在旅行的“领队”。 */
function fxF_sarin(){const g=new THREE.Group();g.userData.noSkin=1;const R=fxF_person({h:1.42,child:1,skin:'#f6e2d2',iris:'#2a7ad8',hair:'#f2cf6a',brow:'#d8a848',female:1,blush:1,lip:'#e0848a'});const H=R.H,rH=R.rH;R.g.userData.noSkin=1;
 const white=M('#fbf8f0',{roughness:.6}),blue=M('#2a3c78',{roughness:.6}),gold=M('#e8c05a',{metalness:.7,roughness:.3}),hairM=M('#f2cf6a',{roughness:.45,metalness:.1});
 fxF_top(R,white,{k:1.04});fxF_sleeves(R,white,1.6,{k:1.05,cuff:blue});
 const dr=fxF_skirt(R.hipW*1.1,R.hipW*1.9,H*.17,white,10,.06);dr.position.y=-R.torL*.0;dr.scale.z=.8;R.spine.add(dr);const trim=fxF_cyl(R.hipW*1.95,R.hipW*1.95,H*.012,blue,24,1);trim.scale.z=.8;trim.position.y=-H*.17;R.spine.add(trim);
 // a short travelling cape with a gold clasp
 const cape=fxF_skirt(R.shW*.75,R.shW*1.55,H*.3,M('#2a3c78',{roughness:.6,side:THREE.DoubleSide}),7,.05,.55);cape.position.y=R.torL*1.0;cape.scale.z=.9;R.spine.add(cape);
 const cl=fxF_sph(H*.02,.4,1,1,gold,10);cl.position.set(R.shW*.55,R.torL*.97,0);R.spine.add(cl);
 fxF_legwear(R,M('#f4f0ea'),{shin:.6},{k:1.03});for(const l of R.legs){const b=fxF_cyl(H*.038,H*.035,H*.1,M('#7a4a2a',{roughness:.5}),10);b.position.y=-R.legL*.47+H*.05;l.sh.add(b)}fxF_shoes(R,M('#7a4a2a',{roughness:.45}),{sole:M('#3a2416')});
 const bag=fxF_sph(H*.05,.5,.9,1,M('#9a6a3a',{roughness:.6}),10);bag.position.set(0,R.torL*.05,-R.hipW*1.25);R.spine.add(bag);const strap=new THREE.Mesh(new THREE.TorusGeometry(R.shW*.95,H*.006,4,24),M('#7a4a2a'));strap.rotation.set(Math.PI/2,0,0);strap.rotation.order='ZXY';strap.rotation.z=.75;strap.position.y=R.torL*.5;strap.scale.set(.62,1,1);R.spine.add(strap);
 // golden bob
 fxF_hairCap(R,hairM,{fringe:9,spread:2.2,fLen:1,side:1.5,cov:.6});
 for(let i=0;i<9;i++){const a=Math.PI*.55+i/8*Math.PI*.9;const s=fxF_sph(rH,.22,.55,.2,hairM,10);s.position.set(R.cran.position.x+Math.cos(a)*rH*.82,rH*.55,Math.sin(a)*rH*.86);s.rotation.x=Math.sin(a)*.3;s.rotation.z=-Math.cos(a)*.2;R.headG.add(s)}
 const ah=fxF_chain(3,rH*.18,rH*.05,rH*.015,hairM);ah.root.position.set(rH*.1,rH*2.05,0);ah.root.rotation.z=Math.PI+.4;R.headG.add(ah.root);
 g.add(R.g);
 // hovering, one hand out, cells dripping from it like drops of water
 const ra=R.arms[1];
 const drops=[];const dm=new THREE.MeshStandardMaterial({color:'#bfeeff',emissive:'#6ad8ff',emissiveIntensity:.6,transparent:true,opacity:.75,roughness:.05});for(let i=0;i<14;i++){const d=fxF_sph(H*.014,1,1.3,1,dm.clone(),8);g.add(d);drops.push({d,ph:i/14,x:(h3(i,1,9)-.5)*H*.12,z:(h3(i,2,9)-.5)*H*.12})}
 const one=fxF_sph(H*.02,1,1,1,GL('#fff4c0'),10);g.add(one);const oneG=glowSprite('#ffe8a0',H*.2,.8);g.add(oneG);
 g.add(at(glowSprite('#fff2c8',H*1.6,.3),0,H*.75,0));
 const hv=H*.28;
 fxF_idle(R,{look:.3,tilt:.15,noArms:1,extra:t=>{R.g.position.y=hv+Math.sin(t*1.2)*H*.025;ra.sh.rotation.z=1.25+Math.sin(t*.9)*.12;ra.sh.rotation.x=.25;ra.el.rotation.z=.2;R.arms[0].sh.rotation.z=-.25;R.arms[0].sh.rotation.x=-.3;
  for(const l of R.legs){l.hp.rotation.z=l.z>0?.1:-.15;l.kn.rotation.z=l.z>0?-.5:-.2}
  R.g.updateMatrixWorld(true);const hp=V3();ra.hd.getWorldPosition(hp);g.worldToLocal(hp);
  for(const o of drops){const q=(t*.35+o.ph)%1;o.d.position.set(hp.x+o.x*q*3+H*.03,hp.y-q*H*.9,hp.z+o.z*q*3);o.d.material.opacity=.75*(1-q)}
  const q1=(t*.35)%1;one.position.set(hp.x+H*.03,hp.y-q1*H*.9,hp.z);oneG.position.copy(one.position);oneG.material.opacity=.8*(1-q1)}});
 g.userData.anim=R.g.userData.anim;return g}

/* ================= 勇者 · 第二代魔王 =================
   梦境里的莫斯：一米五上下、一身短毛、尖脑袋、前肢粗壮。当了恶魔的王之后背上长出翼龙般的双翅、
   头上长角；全身是厚实的装备，头盔里藏着激光；大剑其实是一种活物，里面住满了火蜂；
   手上戴着绒球给的结晶拳套，鲜红的绒球（第一代魔王）常待在它头顶。 */
function fxF_hero(){const g=new THREE.Group();const R=fxF_person({h:2.05,child:0,skin:'#7a4a3a',noHead:1});const H=R.H;
 const fur=M('#6a3e30',{roughness:.95}),iron=M('#2c2a2e',{metalness:.75,roughness:.35}),trim=M('#a8242a',{roughness:.4,metalness:.3}),bone=M('#e8dcc4',{roughness:.5}),mem=M('#7a1a1e',{roughness:.6,side:THREE.DoubleSide});
 R.body.material=fur;
 // armour: breastplate, spiked pauldrons, faulds, greaves
 const bp=fxF_top(R,iron,{k:1.12});bp.scale.y=.62;bp.position.y=R.torL*.36;const bt=fxF_top(R,trim,{k:1.14});bt.scale.y=.08;bt.position.y=R.torL*.34;
 const em=fxF_sph(H*.04,.3,1,1,EM('#ff6a20',.9),12);em.position.set(R.shW*.95,R.torL*.66,0);R.spine.add(em);
 for(const a of R.arms){const pd=fxF_sph(H*.06,1,.75,1.05,iron,14);pd.position.y=-H*.01;a.ua.add(pd);for(let i=0;i<3;i++){const sp=cone(H*.012,H*.06,bone,5);sp.position.set(-H*.01+i*H*.015,H*.045,a.z*H*.02);sp.rotation.x=a.z*.4;a.ua.add(sp)}
  const ub=fxF_cyl(H*.04,H*.035,H*.15,fur,10);ub.position.y=-H*.09;a.ua.add(ub);const br=fxF_cyl(H*.036,H*.03,H*.13,iron,10);br.position.y=-H*.075;a.fa.add(br);a.el.add(fxF_sph(H*.034,1,1,1,iron,10))}
 const fl=fxF_skirt(R.hipW*1.2,R.hipW*1.6,H*.14,iron,6,.05);fl.position.y=R.torL*.08;fl.scale.z=.8;R.spine.add(fl);
 fxF_legwear(R,fur,{thigh:1,shin:1},{k:1.1});for(const l of R.legs){const gv=fxF_cyl(H*.042,H*.034,R.legL*.36,iron,10);gv.position.y=-R.legL*.3;l.sh.add(gv);const kp=fxF_sph(H*.045,1.1,.8,1,iron,10);kp.position.x=H*.025;l.kn.add(kp);
  const ft=fxF_sph(H*.045,1.5,.6,.9,iron,12);ft.position.set(H*.03,-H*.015,0);l.an.add(ft);for(let i=0;i<3;i++){const c=cone(H*.01,H*.04,bone,4);c.rotation.z=-Math.PI/2;c.position.set(H*.1,-H*.02,(i-1)*H*.022);l.an.add(c)}}
 // the mosi head: long pointed snout, short fur, ears back, horns, eyes like coals
 const hd=R.headG;const cr=fxF_sph(H*.075,1.05,.95,.9,fur,18);cr.position.set(0,H*.07,0);hd.add(cr);cr.userData.fxHead=1;
 const sn=new THREE.Mesh(new THREE.ConeGeometry(H*.05,H*.16,12),fur);sn.rotation.z=-Math.PI/2;sn.position.set(H*.12,H*.05,0);sn.scale.z=.8;hd.add(sn);const nose=fxF_sph(H*.016,1,.8,1,M('#1a1010'),8);nose.position.set(H*.2,H*.05,0);hd.add(nose);
 const jw=fxF_sph(H*.05,1.4,.4,.7,fur,12);jw.position.set(H*.08,H*.015,0);hd.add(jw);
 for(const z of[-1,1]){const e=new THREE.Group();e.position.set(H*.075,H*.095,z*H*.04);hd.add(e);e.add(fxF_sph(H*.014,.6,.7,1,GL('#ffb040'),8));e.add(glowSprite('#ff8a20',H*.07,.7));R.eyes.push(e);
  const ea=fxF_sph(H*.03,.4,1.2,.5,fur,8);ea.position.set(-H*.04,H*.13,z*H*.05);ea.rotation.x=z*.6;ea.rotation.z=.6;hd.add(ea);
  const hn=tubeAlong([V3(0,0,0),V3(-H*.02,H*.06,z*H*.02),V3(-H*.08,H*.1,z*H*.04),V3(-H*.13,H*.09,z*H*.05)],H*.012,bone,10);hn.position.set(H*.01,H*.12,z*H*.035);hd.add(hn)}
 // helmet band with the hidden laser
 const hb=new THREE.Mesh(new THREE.TorusGeometry(H*.072,H*.012,6,20),iron);hb.rotation.x=Math.PI/2;hb.position.set(-H*.005,H*.11,0);hb.scale.y=.9;hd.add(hb);const lz=fxF_sph(H*.01,1,1,1,GL('#ff3020'),6);lz.position.set(H*.07,H*.115,0);hd.add(lz);
 // wings like a pterosaur's, folded half open behind it
 const wings=[];for(const z of[-1,1]){const wg=new THREE.Group();wg.position.set(-R.shW*.7,R.torL*.82,z*R.shW*.35);R.spine.add(wg);
  const bonePts=[V3(0,0,0),V3(-H*.18,H*.22,0),V3(-H*.5,H*.32,0),V3(-H*.85,H*.18,0)];wg.add(tubeAlong(bonePts,H*.014,bone,12));
  for(const k of[.3,.55,.8]){wg.add(tubeAlong([V3(-H*.5,H*.32,0),V3(-H*.5-H*.3*k,H*.05-H*.2*k,0)],H*.007,bone,4))}
  const sh=new THREE.Shape();sh.moveTo(0,0);sh.lineTo(-H*.18,H*.22);sh.lineTo(-H*.5,H*.32);sh.lineTo(-H*.85,H*.18);sh.quadraticCurveTo(-H*.62,H*.02,-H*.6,-H*.22);sh.quadraticCurveTo(-H*.42,-H*.08,-H*.3,-H*.3);sh.quadraticCurveTo(-H*.15,-H*.1,0,-H*.16);sh.lineTo(0,0);
  const m=new THREE.Mesh(new THREE.ShapeGeometry(sh,10),mem);wg.add(m);wings.push({wg,z})}
 // the living great-sword: dark blade with seams of fire, embers drifting off it
 const sw=new THREE.Group();const ra=R.arms[1];R.g.add(sw);sw.position.set(H*.34,H*.52,0);sw.rotation.z=Math.PI;
 const grip=fxF_cyl(H*.016,H*.016,H*.14,M('#3a2418'),8);sw.add(grip);const gd=fxF_box(H*.04,H*.03,H*.2,iron);gd.position.y=H*.08;sw.add(gd);
 const blade=fxF_box(H*.03,H*.9,H*.11,M('#3a3034',{metalness:.6,roughness:.4}));blade.position.y=H*.55;sw.add(blade);
 const seam=fxF_box(H*.032,H*.8,H*.02,EM('#ff7a20',1.2));seam.position.y=H*.55;sw.add(seam);for(let i=0;i<6;i++){const c=fxF_box(H*.033,H*.004,H*.08,EM('#ffb040',1));c.position.set(0,H*(.22+i*.12),0);c.rotation.x=(i%2?.4:-.4);sw.add(c)}
 const emb=emitter({n:40,life:1.4,speed:H*.25,spread:.6,size:H*.12,dir:[0,1,0],col:'#ffc060',col2:'#ff3010',op:.9,area:[H*.04,H*.8,H*.1]});emb.position.y=H*.55;sw.add(emb);sw.add(at(glowSprite('#ff6a20',H*.6,.35),0,H*.55,0));
 // crystal gauntlet on the other hand
 const la=R.arms[0];const gau=new THREE.Mesh(ko(H*.045),EM('#9ff2ff',.6,{roughness:.1,flatShading:true}));gau.scale.set(1,1.3,1);gau.position.y=-H*.04;la.hd.add(gau);la.hd.add(at(glowSprite('#9ff2ff',H*.18,.5),0,-H*.04,0));
 // the red fluff on its head
 const fz=new THREE.Group();fz.position.set(-H*.01,H*.17,0);hd.add(fz);const fm=M('#e8302a',{roughness:1});fz.add(fxF_sph(H*.045,1,.9,1,fm,14));for(let i=0;i<40;i++){const v=V3(h3(i,1,5)-.5,h3(i,2,5)-.3,h3(i,3,5)-.5).normalize();const c=cone(H*.008,H*.03,fm,4);c.position.copy(v).multiplyScalar(H*.042);c.quaternion.setFromUnitVectors(V3(0,1,0),v);fz.add(c)}
 for(const z of[-1,1]){const e=fxF_sph(H*.007,1,1,1,M('#101010'),6);e.position.set(H*.04,H*.01,z*H*.014);fz.add(e)}
 g.add(R.g);
 fxF_idle(R,{look:.35,noArms:1,extra:t=>{for(const a of R.arms){a.sh.rotation.z=.55+Math.sin(t*.9)*.03;a.sh.rotation.x=a.z*.45;a.el.rotation.z=.75;a.el.rotation.x=-a.z*.5}
  wings.forEach(w=>{w.wg.rotation.y=w.z*(1.0+Math.sin(t*1.1)*.15);w.wg.rotation.x=w.z*(.12+Math.sin(t*1.1)*.06)});fz.position.y=H*.16+Math.abs(Math.sin(t*2.3))*H*.02;
  seam.material.emissiveIntensity=1+Math.sin(t*5)*.3}});
 g.userData.anim=R.g.userData.anim;return g}

/* ================= 电视机里的小丑 =================
   房间尽头一台很老的电视机，翻来覆去放着一个戴小丑面具、穿小丑服的影像，喊着要改变命运。
   电视本身才是小丑的本体：外壳里塞满精密的智能机械，是那座空间站系统掉下来的一小块。 */
function fxF_clownFace(x,w,h,t){x.fillStyle='#101418';x.fillRect(0,0,w,h);const j=Math.sin(t*3)*2;x.save();x.translate(w/2+j,h/2+2);
 x.fillStyle='#f4f0e8';x.beginPath();x.ellipse(0,0,w*.27,h*.4,0,0,6.3);x.fill();
 x.fillStyle='#1a1a2a';for(const s of[-1,1]){x.beginPath();x.moveTo(s*w*.11,-h*.22);x.lineTo(s*w*.15,-h*.1);x.lineTo(s*w*.11,h*.0);x.lineTo(s*w*.07,-h*.1);x.fill()}
 x.fillStyle='#e8202a';x.beginPath();x.arc(0,h*.05,w*.045,0,6.3);x.fill();
 const o=.5+.5*Math.sin(t*6);x.strokeStyle='#c8102a';x.lineWidth=5;x.beginPath();x.arc(0,h*.1,w*.15,.25,Math.PI-.25);x.stroke();x.fillStyle='#600';x.beginPath();x.ellipse(0,h*.22,w*.08,h*.03+o*h*.05,0,0,6.3);x.fill();
 x.fillStyle='#e8202a';x.beginPath();x.arc(-w*.24,-h*.32,w*.07,0,6.3);x.arc(w*.24,-h*.32,w*.07,0,6.3);x.fill();x.restore();
 x.fillStyle='rgba(255,255,255,.06)';for(let y=0;y<h;y+=3)x.fillRect(0,y,w,1);x.fillStyle='rgba(180,220,255,.12)';x.fillRect(0,((t*40)%h),w,6)}
function fxF_clown(){const g=new THREE.Group();const wood=M('#6a4a30',{roughness:.55}),dark=M('#2a2420',{roughness:.6}),metal=M('#9a9a92',{metalness:.7,roughness:.35});
 // the set on a low cabinet
 const cab=fxF_box(1.9,.7,1.2,M('#4a3426',{roughness:.7}));cab.position.y=.35;g.add(cab);for(const z of[-1,1]){const d=fxF_box(.02,.5,.5,M('#3a281c'));d.position.set(.96,.35,z*.28);g.add(d);const k=fxF_sph(.03,1,1,1,metal,8);k.position.set(.98,.38,z*.08);g.add(k)}
 const tv=new THREE.Group();tv.position.y=.7;g.add(tv);const box=fxF_box(1.4,1.15,1.5,wood);box.position.y=.6;tv.add(box);const back=fxF_cyl(.5,.35,.5,dark,4);back.rotation.z=Math.PI/2;back.rotation.x=Math.PI/4;back.position.set(-.95,.6,0);tv.add(back);
 {const bm=M('#1c1814',{roughness:.4});for(const [y,z,h,w] of [[1.12,-.18,.06,1.06],[.12,-.18,.06,1.06],[.62,.33,1.06,.06],[.62,-.69,1.06,.06]]){const b=fxF_box(.06,h,w,bm);b.position.set(.71,y,z);tv.add(b)}}
 const cv=document.createElement('canvas');cv.width=128;cv.height=96;const cx=cv.getContext('2d');fxF_clownFace(cx,128,96,0);const tex=new THREE.CanvasTexture(cv);
 const sg=new THREE.SphereGeometry(1,24,16,-Math.PI*.22,Math.PI*.44,Math.PI*.3,Math.PI*.4);const scr=new THREE.Mesh(sg,new THREE.MeshBasicMaterial({map:tex}));
 // sphere patch facing +x: map it to the screen rectangle
 {const P=sg.attributes.position,U=sg.attributes.uv;for(let i=0;i<P.count;i++){const z=P.getZ(i),y=P.getY(i);U.setXY(i,.5+z/(2*Math.sin(Math.PI*.22)),.5+y/(2*Math.cos(Math.PI*.3)))}U.needsUpdate=true}
 scr.scale.set(.22,.85,.78);scr.rotation.y=Math.PI;scr.position.set(.5,.62,-.18);tv.add(scr);
 tv.add(at(glowSprite('#bfe0ff',1.4,.3),.9,.62,-.18));
 for(let i=0;i<2;i++){const k=fxF_cyl(.06,.06,.05,metal,12);k.rotation.z=Math.PI/2;k.position.set(.72,.85-i*.25,.5);tv.add(k)}const sp=fxF_box(.02,.3,.18,M('#3a2a20'));sp.position.set(.72,.3,.5);tv.add(sp);for(let i=0;i<5;i++){const l=fxF_box(.025,.01,.16,dark);l.position.set(.73,.2+i*.05,.5);tv.add(l)}
 for(const z of[-1,1]){const an=fxF_cyl(.012,.012,1.1,metal,5);an.position.set(-.1,1.65,z*.3);an.rotation.x=z*.5;tv.add(an);const tip=fxF_sph(.03,1,1,1,metal,6);tip.position.set(-.1,2.14,z*.56);tv.add(tip)}tv.add(at(fxF_sph(.08,1.4,.6,1.4,dark,10),-.1,1.2,0));
 // the machine inside shows through the vents at the back
 for(let i=0;i<4;i++){const v=fxF_box(.02,.04,.8,dark);v.position.set(-.71,.35+i*.12,0);tv.add(v)}const led=fxF_sph(.025,1,1,1,GL('#ff3030'),6);led.position.set(-.72,.95,.5);tv.add(led);
 // cables trailing to the floor
 tv.add(tubeAlong([V3(-.7,.3,.3),V3(-1.2,.1,.6),V3(-1.4,-.5,.4),V3(-1.8,-.68,.9)],.025,dark,12));
 // its projection standing in front of the set: clown suit, ruff, mask, pointed cap
 const R=fxF_person({h:1.9,noHead:1,skin:'#f4f0e8'});const H=R.H;
 const harl=new THREE.MeshStandardMaterial({map:fxF_tex(64,64,(x,w,h)=>{for(let i=0;i<4;i++)for(let j=0;j<4;j++){x.fillStyle=(i+j)%2?'#d8283a':'#2a2a3a';x.beginPath();x.moveTo(i*16+8,j*16);x.lineTo(i*16+16,j*16+8);x.lineTo(i*16+8,j*16+16);x.lineTo(i*16,j*16+8);x.fill()}x.globalCompositeOperation='destination-over';x.fillStyle='#e8c040';x.fillRect(0,0,w,h)}),roughness:.6});
 fxF_top(R,harl,{k:1.12});const pants=fxF_skirt(R.hipW*1.2,R.hipW*1.7,H*.12,harl,6,.06);pants.position.y=R.torL*.02;R.spine.add(pants);fxF_legwear(R,harl,{thigh:1,shin:1},{k:1.15});fxF_sleeves(R,harl,2,{k:1.2});
 for(const l of R.legs){const sh=fxF_sph(H*.045,1.9,.6,.9,M('#d8283a'),12);sh.position.set(H*.05,-H*.01,0);l.an.add(sh);const pm=fxF_sph(H*.02,1,1,1,M('#f4f0e8'),8);pm.position.set(H*.13,H*.02,0);l.an.add(pm)}
 const ruff=new THREE.Mesh(new THREE.TorusGeometry(H*.07,H*.03,8,22),M('#f4f4f0'));ruff.rotation.x=Math.PI/2;ruff.position.y=R.torL+H*.01;ruff.scale.z=1.4;R.spine.add(ruff);
 for(let i=0;i<3;i++){const b=fxF_sph(H*.018,1,1,1,M('#f4f4f0'),8);b.position.set(R.shW*.9,R.torL*(.7-i*.18),0);R.spine.add(b)}
 const mt=new THREE.MeshStandardMaterial({map:fxF_tex(128,64,(x,w,h)=>{x.fillStyle='#f4f0e8';x.fillRect(0,0,w,h);x.fillStyle='#1a1a2a';for(const s of[-1,1]){const cx=w*.5+s*w*.09;x.beginPath();x.moveTo(cx,h*.18);x.lineTo(cx+w*.035,h*.38);x.lineTo(cx,h*.52);x.lineTo(cx-w*.035,h*.38);x.fill()}
  x.strokeStyle='#c8102a';x.lineWidth=4;x.beginPath();x.arc(w*.5,h*.5,w*.1,.3,Math.PI-.3);x.stroke();x.fillStyle='#e8202a';x.beginPath();x.arc(w*.5,h*.52,w*.02,0,6.3);x.fill()}),roughness:.35});
 const mask=new THREE.Mesh(new THREE.SphereGeometry(H*.07,24,16),mt);mask.scale.set(1,1.22,.95);mask.rotation.y=Math.PI;mask.position.set(0,H*.075,0);R.headG.add(mask);
 const nose=fxF_sph(H*.016,1,1,1,M('#e8202a',{roughness:.3}),10);nose.position.set(H*.072,H*.072,0);R.headG.add(nose);
 const cap=new THREE.Mesh(new THREE.ConeGeometry(H*.07,H*.18,14),harl);cap.position.set(-H*.02,H*.23,0);cap.rotation.z=.5;R.headG.add(cap);const pom=fxF_sph(H*.02,1,1,1,M('#e8c040'),8);pom.position.set(-H*.065,H*.3,0);R.headG.add(pom);
 // turn it into light: see-through and flickering
 const holo=[];R.g.traverse(c=>{if(c.isMesh&&c.material!==shadowMat){const m0=c.material;const m=new THREE.MeshBasicMaterial({color:m0.color?m0.color.clone().lerp(C('#9fd8ff'),.3):C('#bfe8ff'),map:m0.map||null,transparent:true,opacity:.6,depthWrite:false});c.material=m;holo.push(m)}});
 R.g.traverse(c=>{if(c.material===shadowMat)c.visible=false});
 R.g.position.set(1.9,0,.8);R.g.rotation.y=-.35;g.add(R.g);const beam=new THREE.Mesh(new THREE.ConeGeometry(.55,1.1,16,1,true),new THREE.MeshBasicMaterial({color:'#bfe8ff',transparent:true,opacity:.12,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide}));beam.rotation.z=Math.PI/2;beam.position.set(1.35,1.25,.5);beam.rotation.y=-.35;g.add(beam);
 const ring=new THREE.Mesh(new THREE.RingGeometry(.35,.42,32),GL('#bfe8ff',.5));ring.rotation.x=-Math.PI/2;ring.position.set(1.9,.03,.8);g.add(ring);
 g.userData.noSkin=1;
 const ra=R.arms[1],la=R.arms[0];let last=-1;
 fxF_idle(R,{look:.5,noArms:1,extra:t=>{const f=Math.floor(t*8);if(f!==last){last=f;fxF_clownFace(cx,128,96,t);tex.needsUpdate=true}
  ra.sh.rotation.z=1.9+Math.sin(t*2.4)*.35;ra.sh.rotation.x=.4;ra.el.rotation.z=.3;la.sh.rotation.z=.3+Math.sin(t*2.4+1)*.2;la.sh.rotation.x=-.5;la.el.rotation.z=1.2;R.spine.rotation.x=Math.sin(t*1.2)*.06;
  const fk=.68+.12*Math.sin(t*17)+(Math.sin(t*3.1)>.97?-.35:0);for(const m of holo)m.opacity=fk;led.visible=Math.sin(t*4)>0||Math.sin(t*.3)<0}});
 g.userData.anim=R.g.userData.anim;return g}

/* ================= 阿布 =================
   本体像一块布的希望空间生物，别的成员叫它“全知者”。在抛弃之地被拆散了，
   琳找回一颗还睁着眼的尔什民模样的头和左右两只手，装起来以后它就成了用双手跑来跑去的“腿头”；
   琳的发信器就藏在它的头发里。 */
function fxF_abu(){const g=new THREE.Group();const R=fxF_person({h:4.6,child:.2,skin:'#e6c8ae',iris:'#6a8a4a',hair:'#4a3a2c',lip:'#b4706a',browTilt:-.1});const hd=R.headG;R.spine.remove(hd);
 const hairM=M('#4a3a2c',{roughness:.75});
 const head=new THREE.Group();head.add(hd);hd.position.set(0,0,0);g.add(head);const rH=R.rH;
 fxF_hairCap(R,hairM,{fringe:7,spread:2,fLen:.9,side:1.2});
 for(let i=0;i<8;i++){const t=fxF_sph(rH,.14,.4,.14,hairM,8);const a=i*.8;t.position.set(-rH*.2+Math.cos(a)*rH*.55,rH*1.9,Math.sin(a)*rH*.55);t.rotation.set(Math.sin(a)*.9,0,Math.cos(a)*.9);hd.add(t)}
 const tx=fxF_sph(rH*.06,1,1,1,GL('#ff4040'),6);tx.position.set(-rH*.4,rH*1.95,rH*.3);hd.add(tx);const txg=glowSprite('#ff5050',rH*.4,.8);txg.position.copy(tx.position);hd.add(txg);
 // under the jaw its true body shows: a soft woven cloth, wrapped round the neck and trailing behind
 const clothT=fxF_tex(64,64,(x,w,h)=>{x.fillStyle='#cdbb92';x.fillRect(0,0,w,h);x.strokeStyle='#a8946a';x.lineWidth=1;for(let i=0;i<w;i+=4){x.beginPath();x.moveTo(i,0);x.lineTo(i,h);x.stroke();x.beginPath();x.moveTo(0,i);x.lineTo(w,i);x.stroke()}x.fillStyle='#7a5a8a';for(let i=0;i<4;i++)x.fillRect(0,8+i*16,w,3)});
 const clothM=new THREE.MeshStandardMaterial({map:clothT,roughness:.9,side:THREE.DoubleSide});
 const wrap=fxF_cyl(rH*.55,rH*.75,rH*.45,clothM,18,1);wrap.position.y=rH*.05;hd.add(wrap);
 const cg=new THREE.PlaneGeometry(rH*1.6,rH*1.4,10,6);const cloth=new THREE.Mesh(cg,clothM);cloth.position.set(-rH*.95,rH*.2,0);cloth.rotation.y=Math.PI/2;cloth.rotation.x=0;hd.add(cloth);const cP=cg.attributes.position.array.slice();
 // the two hands it walks on
 const hands=[];const sk=R.sk;const q=rH*1.6;for(const z of[-1,1]){const w=new THREE.Group();w.position.set(0,rH*.1,z*rH*.48);head.add(w);
  const fa=fxF_cyl(q*.2,q*.17,q*.4,sk,10);fa.position.y=-q*.2;w.add(fa);const cuff=fxF_cyl(q*.22,q*.22,q*.12,clothM,12,1);cuff.position.y=-q*.04;w.add(cuff);
  const palm=new THREE.Group();palm.position.y=-q*.45;w.add(palm);palm.add(fxF_sph(q*.24,1.1,.5,.9,sk,12));
  for(let f=0;f<4;f++){const fz=(f-1.5)*q*.12;const fg=fxF_chain(2,q*.16,q*.05,q*.042,sk);fg.root.position.set(q*.18,-q*.04,fz);fg.root.rotation.z=.9;fg.J[1].rotation.z=.4;palm.add(fg.root)}
  const th=fxF_chain(2,q*.13,q*.055,q*.045,sk);th.root.position.set(q*.08,0,-z*q*.2);th.root.rotation.set(-z*1.3,0,1.0);palm.add(th.root);
  hands.push({w,palm,z})}
 const hy=rH*1.6*.62;head.position.y=hy;
 g.add(shadow(rH*1.3));g.userData.noSkin=1;
 g.userData.anim=t=>{const s=t*3.2;hands.forEach((h,i)=>{const p=s+i*Math.PI;h.w.rotation.z=Math.sin(p)*.35;h.palm.position.y=-rH*1.6*.45+Math.max(0,Math.sin(p+1.57))*rH*.12;h.palm.rotation.z=-Math.sin(p)*.35});
  head.position.y=hy+Math.abs(Math.cos(s))*rH*.06;head.rotation.z=Math.sin(s*2)*.03;hd.rotation.y=Math.sin(t*.5)*.4;hd.rotation.x=Math.sin(t*.37)*.08;
  const bl=(t*.27)%1;const e=bl<.04?.1:1;for(const x of R.eyes)x.scale.y=e+Math.sin(t*.2)*.002;txg.material.opacity=Math.sin(t*5)>0?.9:.1;
  const P=cg.attributes.position;for(let i=0;i<P.count;i++){const x=cP[i*3],y=cP[i*3+1];const k=(x/(rH*1.6)+.5);P.setZ(i,Math.sin(t*2.5+x*3/rH)*rH*.12*k+k*k*rH*.35)}P.needsUpdate=true};
 return g}

/* ---------- dragon-folk ----------
   骸龙：两米长的瘦爬行类，灰得像骸骨，身上一道道像骨架的斑纹；头相对身体很大，前后肢几乎一样长，善于抓握。
   翡翠龙：骸龙的分支，一米八高，圆脸，绿鳞在阳光下闪亮。白骸龙：通身雪白、体型消瘦，在黑暗里双眼会发微光。
   o: {skin, stripe, belly, eye, glow, round, lean, build, old, young, shine} */
const fxF_TX={};
function fxF_stripeMat(key,base,stripe,belly,n,o){o=o||{};const k=key+base+stripe+n;if(!fxF_TX[k]){fxF_TX[k]=fxF_tex(128,128,(x,w,h)=>{x.fillStyle=base;x.fillRect(0,0,w,h);
  if(belly){const gr=x.createLinearGradient(w*.3,0,w*.7,0);gr.addColorStop(0,base);gr.addColorStop(.5,belly);gr.addColorStop(1,base);x.fillStyle=gr;x.fillRect(w*.3,0,w*.4,h)}
  if(stripe){x.fillStyle=stripe;for(let i=0;i<n;i++){const y=(i+.5)/n*h;const th=h/n*.32;for(const side of[0,1]){x.beginPath();const x0=side?w*.6:0,x1=side?w:w*.4;x.moveTo(x0,y-th*.5);x.quadraticCurveTo((x0+x1)/2,y-th*1.2,x1,y-th*.2);x.lineTo(x1,y+th*.4);x.quadraticCurveTo((x0+x1)/2,y+th*.2,x0,y+th*.5);x.fill()}}}
  for(let i=0;i<600;i++){x.fillStyle='rgba('+(o.spec?'255,255,255,':'0,0,0,')+(.05+Math.random()*.08)+')';x.fillRect(Math.random()*w,Math.random()*h,2,2)}})}
 return new THREE.MeshStandardMaterial({map:fxF_TX[k],roughness:o.rough===undefined?.6:o.rough,metalness:o.metal||0})}
function fxF_drake(o){o=Object.assign({skin:'#9a958a',stripe:'#5e5a54',belly:'#c8c2b4',eye:'#d8a020',build:1,lean:.45},o);const g=new THREE.Group();const b=o.build;
 const D={g,o};const sh={rough:o.shine?.32:.62,metal:o.shine?.3:0,spec:o.shine};
 const skin=M(o.skin,{roughness:sh.rough,metalness:sh.metal});const bodyM=fxF_stripeMat('b',o.skin,o.stripe,o.belly,7,sh),limbM=fxF_stripeMat('l',o.skin,o.stripe,null,4,sh),tailM=fxF_stripeMat('t',o.skin,o.stripe,null,2,sh);
 D.skin=skin;D.bodyM=bodyM;
 const hipY=1.0;const hip=new THREE.Group();hip.position.y=hipY;g.add(hip);D.hip=hip;
 hip.add(fxF_sph(.3,1,.95,.9*b,bodyM,18));
 const tor=new THREE.Group();tor.rotation.z=-o.lean;hip.add(tor);D.tor=tor;
 const chest=fxF_lathe([[.04,-.14],[.25,-.06],[.3,.12],[.31,.38],[.32*(o.chestK||1),.62],[.3*(o.chestK||1),.8],[.22,.95],[.12,1.04],[.02,1.07]].map(q=>[q[0]*b,q[1]]),bodyM,.9,20);tor.add(chest);D.chest=chest;
 const bellyP=fxF_lathe([[.03,-.1],[.22,0],[.26,.3],[.27,.6],[.2,.85],[.02,.95]].map(q=>[q[0]*b,q[1]]),M(o.belly,{roughness:sh.rough}),.75,14);bellyP.position.x=.07*b;tor.add(bellyP);
 // a low ridge of scales down the back
 for(let i=0;i<7;i++){const c=cone(.035,.09,skin,4);c.position.set(-.29*b+i*.0,.2+i*.12,0);c.position.x=-(.3-.0)*b*Math.cos((i-3)*.2);c.rotation.z=.9;tor.add(c)}
 // neck and head
 const nk=new THREE.Group();nk.position.set(.06,.92,0);nk.rotation.z=o.lean+.15;tor.add(nk);D.neck=nk;
 const neck=fxF_cyl(.11*b,.15*b,.42,skin,12);neck.position.y=.18;nk.add(neck);
 const hd=new THREE.Group();hd.position.y=.4;hd.rotation.z=-.15;nk.add(hd);D.head=hd;const hk=o.young?1.25:1;hd.scale.setScalar(hk);
 const rd=o.round;
 const cran=fxF_sph(.2,rd?1.08:1.12,rd?1:.86,rd?1.02:.9,skin,20);cran.position.set(.04,.08,0);hd.add(cran);cran.userData.fxHead=1;
 const snout=fxF_sph(.2,rd?.62:1.05,rd?.48:.5,rd?.62:.58,skin,16);snout.position.set(rd?.19:.26,.03,0);hd.add(snout);
 const jaw=new THREE.Group();jaw.position.set(.06,-.02,0);hd.add(jaw);D.jaw=jaw;const lj=fxF_sph(.2,rd?.62:1.0,.22,rd?.55:.5,M(o.belly,{roughness:sh.rough}),14);lj.position.set(rd?.11:.17,-.035,0);jaw.add(lj);
 const mouthIn=fxF_sph(.2,rd?.55:.9,.12,rd?.5:.45,M('#7a2a2a'),10);mouthIn.position.set(rd?.11:.17,-.01,0);jaw.add(mouthIn);
 for(const z of[-1,1])for(let i=0;i<4;i++){const tt=cone(.008,.026,M('#f4f0e0',{roughness:.3,emissive:'#403c30',emissiveIntensity:.3}),4);tt.rotation.z=Math.PI;const k=i/3;tt.position.set((rd?.1:.16)+k*(rd?.1:.2),-.005,z*(rd?.075:.07)*(1-k*.35));hd.add(tt)}
 for(const z of[-1,1]){const ns=fxF_sph(.008,1.4,.6,1,M('#2a2420',{emissive:'#000000',emissiveIntensity:.3}),6);ns.position.set(rd?.29:.43,rd?.085:.085,z*.03);hd.add(ns)}
 const lip=new THREE.Mesh(new THREE.TorusGeometry(rd?.11:.17,.006,4,20,Math.PI*.9),M('#3a2a24'));lip.rotation.x=Math.PI/2;lip.rotation.z=-Math.PI*.45;lip.scale.set(rd?.9:1.05,rd?.85:.5,1);lip.position.set(rd?.1:.12,-.01,0);hd.add(lip);
 D.eyes=[];const ex=rd?.17:.16,ey=rd?.13:.12,ez=rd?.12:.11;for(const z of[-1,1]){const e=new THREE.Group();e.position.set(ex,ey,z*ez);hd.add(e);
  const ball=fxF_sph(.05,1,1,.8,o.glow?GL(o.eye):M(o.eye,{roughness:.15,emissive:o.eye,emissiveIntensity:.35}),12);e.add(ball);
  const pu=fxF_box(.012,.07,.016,M('#0a0806',{roughness:.1,emissive:'#000000',emissiveIntensity:.3}));pu.position.set(.04,0,z*.008);pu.rotation.y=z*.6;e.add(pu);const hl=fxF_sph(.008,1,1,1,GL('#ffffff'),6);hl.position.set(.04,.015,z*.0);e.add(hl);
  if(o.glow){const gs=glowSprite(o.eye,.18,.55);e.add(gs)}
  const lid=fxF_sph(.058,1,.45,.85,skin,10);lid.position.set(-.008,.04,0);e.add(lid);D.eyes.push(e);
  const brow=fxF_sph(.06,1.1,.35,.6,skin,10);brow.position.set(ex-.01,ey+.045,z*(ez+.005));brow.rotation.x=z*.3;hd.add(brow)}
 if(!rd)for(let i=0;i<3;i++){const k=cone(.025,.08,skin,4);k.position.set(-.06-i*.06,.2-i*.02,0);k.rotation.z=1.1;hd.add(k)}
 else for(const z of[-1,1]){const fr=fxF_sph(.07,.5,1,.4,skin,8);fr.position.set(-.08,.08,z*.17);fr.rotation.x=z*.5;hd.add(fr)}
 // arms nearly as long as the legs, with grasping hands
 D.arms=[];for(const z of[-1,1]){const s=new THREE.Group();s.position.set(.05,.78,z*.27*b);tor.add(s);const ua=fxF_hang(.36,.075*b,.06*b,limbM);s.add(ua);const el=new THREE.Group();el.position.y=-.36;ua.add(el);const fa=fxF_hang(.33,.06*b,.045*b,limbM);el.add(fa);
  const hand=new THREE.Group();hand.position.y=-.33;fa.add(hand);hand.add(fxF_sph(.055,1,1,.6,skin,10));
  for(let f=0;f<3;f++){const fg=fxF_chain(2,.05,.016,.012,skin);fg.root.position.set(.02,-.04,(f-1)*.025);fg.root.rotation.z=.3;fg.J[1].rotation.z=.6;const cl=cone(.012,.04,M('#2a2622',{roughness:.3}),4);cl.position.y=-.05;cl.rotation.z=.0;fg.J[1].add(cl);cl.position.y=-.06;hand.add(fg.root)}
  const th=fxF_chain(2,.04,.016,.012,skin);th.root.position.set(.03,-.02,-z*.04);th.root.rotation.set(-z*.8,0,.6);hand.add(th.root);
  s.rotation.x=z*.08;D.arms.push({s,ua,el,fa,hand,z})}
 // digitigrade legs
 D.legs=[];for(const z of[-1,1]){const hp=new THREE.Group();hp.position.set(-.02,0,z*.2*b);hip.add(hp);const th=fxF_hang(.46,.12*b,.08*b,limbM);hp.add(th);const kn=new THREE.Group();kn.position.y=-.46;th.add(kn);const sn=fxF_hang(.42,.075*b,.05,limbM);kn.add(sn);
  const an=new THREE.Group();an.position.y=-.42;sn.add(an);const mt=fxF_hang(.25,.05,.04,skin);an.add(mt);const ft=new THREE.Group();ft.position.y=-.25;mt.add(ft);
  for(let f=0;f<3;f++){const tg=fxF_chain(2,.07,.03,.02,skin);tg.root.position.set(0,0,(f-1)*.045);tg.root.rotation.set((f-1)*.3,0,0);ft.add(tg.root);const cl=cone(.016,.05,M('#2a2622',{roughness:.3}),4);cl.position.y=-.07;cl.rotation.z=Math.PI;tg.J[1].add(cl);D.toes=(D.toes||[]).concat([tg])}
  hp.rotation.z=.5;kn.rotation.z=-1.1;an.rotation.z=.9;ft.rotation.z=1.6-.3;D.legs.push({hp,kn,an,ft,z})}
 for(const tgc of D.toes){tgc.J[1].rotation.z=-.2}
 // tail
 const tl=fxF_chain(9,.2,.13*b,.02,tailM);tl.root.position.set(-.22,-.02,0);tl.root.rotation.z=-1.25;hip.add(tl.root);D.tail=tl.J;tl.J.forEach((j,i)=>{if(i)j.rotation.z=.04});
 g.add(shadow(.75));
 return D}
function fxF_drakeIdle(D,o){o=o||{};const g=D.g;const ph=o.ph||0;
 g.userData.anim=t=>{t+=ph;const br=Math.sin(t*1.6);D.chest.scale.set(1+br*.015,1,1+br*.015);D.tor.rotation.z=-D.o.lean+Math.sin(t*.6)*.02;
  D.head.rotation.y=Math.sin(t*.4)*.3*(o.look===undefined?1:o.look);D.head.rotation.x=Math.sin(t*.55)*.08+(o.tilt||0);D.head.rotation.z=-.15+Math.sin(t*.7)*.05+(o.nod||0);D.jaw.rotation.z=-Math.max(0,Math.sin(t*.9))*.12*(o.talk||.3);
  const bl=(t*.27+ph)%1;const s=bl<.04?.15:1;for(const e of D.eyes)e.scale.y=s+Math.sin(t*.2)*.002;
  D.tail.forEach((j,i)=>{j.rotation.x=Math.sin(t*1.2-i*.5)*.07;if(i)j.rotation.z=.04+Math.sin(t*.8-i*.4)*.02});
  if(!o.noArms)D.arms.forEach((a,i)=>{a.s.rotation.z=.35+Math.sin(t*1.1+i)*.05;a.el.rotation.z=.9});
  if(o.extra)o.extra(t)};return g}
// a fluffball figure, the way the dragon-folk carve their 赐予者
function fxF_fluffIdol(r,col){const g=new THREE.Group();const m=M(col||'#f4f0e6',{roughness:1});g.add(fxF_sph(r,1,.92,1,m,14));for(let i=0;i<26;i++){const v=V3(h3(i,4,1)-.5,h3(i,5,1)-.35,h3(i,6,1)-.5).normalize();const c=cone(r*.16,r*.45,m,4);c.position.copy(v).multiplyScalar(r*.9);c.quaternion.setFromUnitVectors(V3(0,1,0),v);g.add(c)}return g}

/* 苏苏米：跟着琳长大的翡翠龙，成年后比一般翡翠龙强壮得多，当上了“王”；它不爱摆满装饰品，
   宫里的贵民才穿角龙皮。它举起过结晶长矛，也是它把弓箭带给了翡翠龙。 */
function fxF_susumi(){const D=fxF_drake({skin:'#2f9a5c',stripe:null,belly:'#a8d878',eye:'#f2c23a',round:1,build:1.18,lean:.38,shine:1});const g=D.g;
 const hide=M('#b8945a',{roughness:.85,side:THREE.DoubleSide}),spot=M('#6a4a2a',{roughness:.9}),wood=M('#6a4a2a',{roughness:.7}),cord=M('#3a2a1a');
 // a plain hide mantle over the shoulders, knotted at the chest
 const man=fxF_skirt(.22,.44,.5,hide,6,.08,.45);man.position.set(-.02,1.06,0);man.rotation.z=.25;man.scale.z=1.05;D.tor.add(man);
 for(let i=0;i<6;i++){const sp=fxF_sph(.04,1,.3,1,spot,6);const a=Math.PI*.7+i*.35;sp.position.set(Math.cos(a)*.38,.75-i%2*.12,Math.sin(a)*.38);D.tor.add(sp)}
 D.tor.add(at(fxF_sph(.05,1,1,1,M('#e8d8b0'),8),.33,.95,0));
 // crystal spear, planted beside it
 const sp=new THREE.Group();sp.position.set(.55,0,-.42);g.add(sp);sp.add(at(fxF_cyl(.025,.03,2.4,wood,6),0,1.2,0));
 const tip=new THREE.Mesh(ko(.11),EM('#a8f4ff',.6,{roughness:.05,flatShading:true}));tip.scale.set(.6,2,.6);tip.position.y=2.55;sp.add(tip);sp.add(at(glowSprite('#bff4ff',.7,.45),0,2.55,0));
 for(let i=0;i<3;i++){const w=new THREE.Mesh(new THREE.TorusGeometry(.032,.008,4,10),cord);w.rotation.x=Math.PI/2;w.position.y=2.32+i*.04;sp.add(w)}
 // the bow and a quiver on its back
 const bow=tubeAlong([V3(0,-.6,0),V3(-.12,-.3,0),V3(-.15,0,0),V3(-.12,.3,0),V3(0,.6,0)],.018,wood,14);const bg=new THREE.Group();bg.add(bow);bg.add(tubeAlong([V3(0,-.6,0),V3(0,.6,0)],.004,M('#e8e0c8'),2));bg.position.set(-.36,.6,.0);bg.rotation.set(0,Math.PI/2,.5);D.tor.add(bg);
 const qv=fxF_cyl(.06,.05,.45,M('#7a5a3a'),8);qv.position.set(-.33,.62,.12);qv.rotation.x=-.5;D.tor.add(qv);for(let i=0;i<3;i++){const a=fxF_cyl(.006,.006,.2,wood,4);a.position.set(-.33,.86,.18+i*.02);a.rotation.x=-.5;D.tor.add(a);const f=fxF_box(.01,.05,.03,M('#e8e8e0'));f.position.set(-.33,.95,.22+i*.02);D.tor.add(f)}
 const ra=D.arms[0];
 return fxF_drakeIdle(D,{look:.6,noArms:1,extra:t=>{ra.s.rotation.z=.95;ra.s.rotation.x=-.25;ra.el.rotation.z=.25+Math.sin(t*.8)*.03;const la=D.arms[1];la.s.rotation.z=.25+Math.sin(t*1.2)*.05;la.el.rotation.z=.7}})}

/* 塔克：骸龙首领。被投刺者的木刺扎中过，被琳救下又复活；它在盐地深处把一颗蛋放在杜美莎树旁、
   围上一圈石头、跳起“复活之光”的舞。手里是石矛，后来常穿着骨制的铠甲。 */
function fxF_tako(){const D=fxF_drake({skin:'#7e796f',stripe:'#3c3833',belly:'#b0aa9c',eye:'#e0a428'});const g=D.g;
 const bone=M('#ece4d0',{roughness:.6}),wood=M('#6a4a2a',{roughness:.75}),stone=M('#8a8478',{flatShading:true,roughness:.95});
 // healed wound where the thorn went in
 const sc=fxF_sph(.06,.3,1.4,.6,M('#c8a098',{roughness:.5}),8);sc.position.set(.3,.68,-.12);sc.rotation.x=.4;D.tor.add(sc);
 // a necklace of teeth and a bone shoulder guard
 const nl=new THREE.Mesh(new THREE.TorusGeometry(.15,.01,4,16),M('#4a3a2a'));nl.rotation.y=Math.PI/2;nl.position.y=.1;D.neck.add(nl);for(let i=0;i<7;i++){const a=-1.2+i*.4;const t=cone(.014,.06,bone,4);t.rotation.z=Math.PI;t.position.set(Math.cos(a)*.16,.07,Math.sin(a)*.16);D.neck.add(t)}
 const pg=fxF_sph(.13,1,.5,1,bone,10);pg.position.set(0,.84,-.27);D.tor.add(pg);for(let i=0;i<3;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(.12,.012,4,10,Math.PI),bone);r.position.set(-.02+i*.05,.78,-.29);r.rotation.y=Math.PI/2;D.tor.add(r)}
 // stone spear
 const sp=new THREE.Group();D.arms[0].hand.add(sp);sp.position.y=-.04;sp.add(fxF_cyl(.022,.025,2.1,wood,6));const tp=new THREE.Mesh(new THREE.TetrahedronGeometry(.09),stone);tp.scale.set(.6,2,.6);tp.position.y=1.12;sp.add(tp);sp.rotation.z=1.57;
 // the egg by the stones
 const eg=new THREE.Group();eg.position.set(.95,0,.35);g.add(eg);const egg=fxF_sph(.2,1,1.3,1,M('#efe6d0',{roughness:.45}),16);egg.position.y=.26;eg.add(egg);for(let i=0;i<6;i++){const d=fxF_sph(.03,1,.6,1,M('#c8b898'),6);d.position.set(Math.cos(i)*.15,.18+i*.05,Math.sin(i)*.15);eg.add(d)}
 for(let i=0;i<10;i++){const a=i/10*6.28;const r=new THREE.Mesh(kd(.13),stone);r.position.set(Math.cos(a)*.48,.06,Math.sin(a)*.48);eg.add(r)}
 const lg=glowSprite('#fff0c0',.9,.0);lg.position.y=.3;eg.add(lg);
 const ra=D.arms[0],la=D.arms[1];
 // the dance of the light of revival: arms up, swaying, stamping
 return fxF_drakeIdle(D,{look:.4,noArms:1,talk:.6,extra:t=>{const s=Math.sin(t*2.2);ra.s.rotation.z=1.9+s*.25;ra.el.rotation.z=.4;ra.s.rotation.x=-.2;la.s.rotation.z=2.4-s*.25;la.el.rotation.z=.5;la.s.rotation.x=.3;
  D.tor.rotation.x=s*.08;D.hip.position.y=1.0+Math.abs(Math.cos(t*2.2))*.04;lg.material.opacity=.25+.2*Math.sin(t*1.5)}})}

/* 利德尔：塔克的学徒、被派去寻找绒球的小骸龙。它带着塔克给的角龙号角，
   找回绒球后得到了一尊小小的绒球雕像；遇到不懂的事就歪着头“嘎？”一声。 */
function fxF_lideer(){const D=fxF_drake({skin:'#86817a',stripe:'#45413b',belly:'#bdb7aa',eye:'#e8b030',young:1,build:.9,lean:.3});const g=D.g;g.scale.setScalar(.62);
 const horn=new THREE.Group();const hm=M('#d8c8a0',{roughness:.5});horn.add(tubeAlong([V3(0,0,0),V3(.06,.12,0),V3(.05,.25,0),V3(-.02,.36,0)],.03,hm,10));const bell=fxF_cyl(.05,.03,.08,hm,10);bell.position.set(-.03,.38,0);horn.add(bell);
 horn.position.set(.1,.55,.3);horn.rotation.set(.3,0,.5);D.tor.add(horn);const cord=new THREE.Mesh(new THREE.TorusGeometry(.33,.008,4,20),M('#6a4a2a'));cord.position.set(0,.6,0);cord.rotation.set(Math.PI/2,0,.6);cord.scale.set(1,.6,1);D.tor.add(cord);
 const idol=fxF_fluffIdol(.09,'#f4f0e6');D.arms[0].hand.add(idol);idol.position.set(.06,-.07,0);
 const ra=D.arms[0],la=D.arms[1];
 return fxF_drakeIdle(D,{look:.3,noArms:1,extra:t=>{const k=(t*.2)%1;const tilt=k<.5?Math.sin(k*2*Math.PI)*.45:0;D.head.rotation.x=tilt;ra.s.rotation.z=1.1;ra.el.rotation.z=1.2+Math.sin(t*1.5)*.08;ra.s.rotation.x=-.1;la.s.rotation.z=.5;la.el.rotation.z=1.0;D.jaw.rotation.z=-(k<.5?Math.max(0,Math.sin(k*4*Math.PI)):0)*.2}})}

/* 晶狂：为了一块结晶杀光所有同伴的白骸龙，拖着那块巨大的主脑结晶走了一路，后来当上了王：
   穿起只有王能穿的白色铠甲（不是一般的青色），举剑许下每条龙都有房子和大鸵龙的诺言。 */
function fxF_jingkuang(){const D=fxF_drake({skin:'#e2e0d8',stripe:null,belly:'#efede6',eye:'#bff8ff',glow:1,build:.9,lean:.35});const g=D.g;
 const arm=M('#fbfcff',{roughness:.15,metalness:.45,emissive:'#dfe8ff',emissiveIntensity:.08}),rim=M('#8aa0ac',{roughness:.25,metalness:.75}),blood=M('#8a1a1a',{roughness:.5});
 // shell-like plate armour, glossy, not covering everything
 const strap=M('#5a4636',{roughness:.7});
 const shell=(r,th0,th1)=>new THREE.Mesh(new THREE.SphereGeometry(r,20,10,-Math.PI*.42+Math.PI,Math.PI*.84,th0,th1),arm);
 const bp=shell(.36,Math.PI*.18,Math.PI*.5);bp.scale.set(1.05,1.25,1);bp.position.set(.02,.62,0);bp.rotation.y=Math.PI;D.tor.add(bp);
 for(let i=0;i<3;i++){const fp=shell(.33-i*.01,Math.PI*.4,Math.PI*.18);fp.position.set(.02,.36-i*.11,0);fp.rotation.y=Math.PI;D.tor.add(fp);const r=new THREE.Mesh(new THREE.TorusGeometry(.3-i*.01,.01,4,18,Math.PI*.84),rim);r.rotation.set(Math.PI/2,0,-Math.PI*.42);r.position.set(.02,.3-i*.11,0);D.tor.add(r)}
 const gorget=new THREE.Mesh(new THREE.TorusGeometry(.15,.035,6,16),rim);gorget.rotation.y=Math.PI/2;gorget.position.y=.06;D.neck.add(gorget);
 for(const z of[-1,1]){const s2=fxF_box(.03,.75,.05,strap);s2.position.set(0,.6,z*.18);s2.rotation.x=z*.15;D.tor.add(s2)}
 for(const a of D.arms){const pd=new THREE.Mesh(new THREE.SphereGeometry(.13,14,8,0,Math.PI*2,0,Math.PI*.5),arm);pd.position.y=.0;a.ua.add(pd);const pr=new THREE.Mesh(new THREE.TorusGeometry(.13,.012,4,16),rim);pr.rotation.x=Math.PI/2;a.ua.add(pr);const br=fxF_cyl(.07,.058,.2,arm,10);br.position.y=-.15;a.fa.add(br)}
 for(const l of D.legs){const gv=new THREE.Mesh(new THREE.SphereGeometry(.15,12,8,-Math.PI*.4,Math.PI*.8,Math.PI*.2,Math.PI*.6),arm);gv.scale.set(1,1.6,1);gv.rotation.y=Math.PI;gv.position.y=-.2;l.hp.children[0].add(gv)}
 const hm=new THREE.Mesh(new THREE.SphereGeometry(.21,16,8,0,Math.PI*2,0,Math.PI*.42),arm);hm.scale.set(1.1,.9,1);hm.position.set(.02,.1,0);D.head.add(hm);const hr=new THREE.Mesh(new THREE.TorusGeometry(.17,.014,4,18),rim);hr.rotation.x=Math.PI/2;hr.position.set(.02,.14,0);hr.scale.set(1.15,1,1);D.head.add(hr);
 for(let i=0;i<5;i++){const c=cone(.022,.13,rim,4);const a=-.8+i*.4;c.position.set(Math.cos(a)*.13-.04,.26,Math.sin(a)*.15);c.rotation.x=Math.sin(a)*.4;D.head.add(c)}
 // the white sword of the king, raised
 const sw=new THREE.Group();D.arms[0].hand.add(sw);sw.position.y=-.04;sw.add(fxF_cyl(.02,.02,.2,M('#5a4a3a'),6));const gd=fxF_box(.04,.03,.2,rim);gd.position.y=.1;sw.add(gd);const bl=fxF_box(.02,.9,.08,arm);bl.position.y=.56;sw.add(bl);const bs=fxF_box(.022,.3,.03,blood);bs.position.y=.3;sw.add(bs);
 sw.rotation.z=-1.4;
 // the great crystal it would not let go of
 const cr=new THREE.Group();cr.position.set(.75,0,-.5);g.add(cr);const cm=new THREE.MeshStandardMaterial({color:'#c8f4ff',emissive:'#5ac8e8',emissiveIntensity:.5,roughness:.05,metalness:.1,flatShading:true,transparent:true,opacity:.85});
 const big=new THREE.Mesh(ko(.35),cm);big.scale.set(1,1.7,1);big.position.y=.55;cr.add(big);for(let i=0;i<4;i++){const s2=new THREE.Mesh(ko(.14),cm);s2.scale.set(.8,1.8,.8);s2.position.set(Math.cos(i*1.6)*.3,.25,Math.sin(i*1.6)*.3);s2.rotation.z=Math.cos(i*1.6)*.5;s2.rotation.x=Math.sin(i*1.6)*.5;cr.add(s2)}cr.add(at(glowSprite('#9fe8ff',1.6,.45),0,.6,0));
 const ra=D.arms[0],la=D.arms[1];
 return fxF_drakeIdle(D,{look:.5,noArms:1,talk:1,extra:t=>{ra.s.rotation.z=2.5+Math.sin(t*1.7)*.12;ra.el.rotation.z=.3;ra.s.rotation.x=.15;la.s.rotation.z=.75;la.s.rotation.x=.45;la.el.rotation.z=.5;D.head.rotation.x=-.1+Math.sin(t*3.1)*.03;cm.emissiveIntensity=.45+Math.sin(t*1.4)*.12}})}

/* 预言者：白骸龙里专门记录历史的老者，关于木之灵和创造者的石板几乎都是它们写的；连王也要尊敬它。
   它守着“不能大吼大叫”的规则，曾因为大吼伤了声带；危急时它举起手中的木棍挡剑。 */
function fxF_yuyan(){const D=fxF_drake({skin:'#dedbd0',stripe:'#b8b4a8',belly:'#ecebe2',eye:'#d8f8ff',glow:1,build:.82,lean:.75,old:1});const g=D.g;
 const wood=M('#7a5a3a',{roughness:.85}),stone=M('#8a8a82',{roughness:.95}),hide=M('#8a7458',{roughness:.9,side:THREE.DoubleSide}),wrap=M('#c8b890',{roughness:.9});
 // age: sagging dewlap, sparse whitened brows, a wrap round the hurt throat
 const dw=fxF_sph(.1,.8,1,.7,D.skin,10);dw.position.set(.1,.12,0);D.neck.add(dw);const tw=fxF_cyl(.135,.14,.08,wrap,12);tw.position.y=.25;D.neck.add(tw);
 for(const z of[-1,1]){const w=cone(.02,.12,M('#f4f4ee'),4);w.position.set(.15,.2,z*.13);w.rotation.z=-1.2;D.head.add(w)}
 // a hide shawl and a satchel of tools
 const shl=fxF_skirt(.22,.4,.42,hide,5,.06,.5);shl.position.set(-.02,1.02,0);shl.rotation.z=.4;D.tor.add(shl);
 const sat=fxF_sph(.1,.6,1,1,M('#6a5440'),10);sat.position.set(-.05,.25,.32);D.tor.add(sat);const ch=fxF_cyl(.008,.008,.12,M('#9a9a90',{metalness:.6}),4);ch.position.set(-.02,.38,.34);D.tor.add(ch);
 // the plain wooden stick it leans on
 const st=new THREE.Group();st.position.set(.6,0,-.38);g.add(st);st.add(at(tubeAlong([V3(0,0,0),V3(.02,.6,0),V3(-.01,1.2,0),V3(.03,1.75,0),V3(.08,1.85,0)],.03,wood,10),0,0,0));
 // a stone tablet with its marks
 const tb=new THREE.Group();D.arms[0].hand.add(tb);tb.position.set(.05,-.1,0);const slab=fxF_box(.04,.36,.26,stone);tb.add(slab);
 const glyphT=fxF_tex(64,96,(x,w,h)=>{x.fillStyle='#8a8a82';x.fillRect(0,0,w,h);x.strokeStyle='#4a4a44';x.lineWidth=2;for(let i=0;i<7;i++){const y=10+i*12;x.beginPath();x.moveTo(8,y);for(let k=0;k<5;k++)x.lineTo(10+k*10,y+((k*7+i*3)%5)-2);x.stroke()}x.beginPath();x.arc(32,82,8,0,6.3);x.stroke()});
 const face=new THREE.Mesh(new THREE.PlaneGeometry(.25,.34),new THREE.MeshStandardMaterial({map:glyphT,roughness:.95}));face.rotation.y=Math.PI/2;face.position.x=.021;tb.add(face);tb.rotation.set(0,0,-.4);
 const ra=D.arms[0],la=D.arms[1];
 return fxF_drakeIdle(D,{look:.25,noArms:1,tilt:0,nod:.2,talk:.15,extra:t=>{ra.s.rotation.z=.75;ra.el.rotation.z=1.1;ra.s.rotation.x=.1;la.s.rotation.z=.8+Math.sin(t*.7)*.03;la.s.rotation.x=-.35;la.el.rotation.z=.55;D.tor.rotation.z=-.75+Math.sin(t*.5)*.03;
  for(const l of D.legs){l.hp.rotation.z=.65;l.kn.rotation.z=-1.25}}})}

/* 塔克（希望空间）：按真塔克的记忆生成的梦境生物，模样几乎一模一样，住在城堡里，有卫兵守着；
   一次次轮回里它总记得绒球，在族群里传下对绒球的信仰。龙栖木在这里能长出各种颜色的树皮。 */
function fxF_takoHope(){const D=fxF_drake({skin:'#77726a',stripe:'#3a3631',belly:'#a8a294',eye:'#e0a428',lean:.5});const g=D.g;
 const bark=['#a84a3a','#4a8a5a','#3a6aa8','#c89a3a'];const wood=M('#6a4a2a',{roughness:.7});
 // a mantle of coloured bark strips
 const barkT=fxF_tex(128,64,(x,w,h)=>{for(let i=0;i<16;i++){x.fillStyle=bark[i%4];x.fillRect(i*8,0,8,h);x.fillStyle='rgba(0,0,0,.25)';for(let k=0;k<6;k++)x.fillRect(i*8+((k*3)%7),k*11,1,8)}x.fillStyle='rgba(255,255,255,.15)';x.fillRect(0,0,w,4)});
 const cape=fxF_skirt(.24,.5,.95,new THREE.MeshStandardMaterial({map:barkT,roughness:.85,side:THREE.DoubleSide}),8,.05,.65);cape.position.set(-.02,1.02,0);cape.rotation.z=.42;D.tor.add(cape);
 const col=new THREE.Mesh(new THREE.TorusGeometry(.17,.04,6,16),M('#c89a3a',{roughness:.6}));col.rotation.y=Math.PI/2;col.position.y=.05;D.neck.add(col);
 // patches where old scales are coming away
 for(let i=0;i<6;i++){const p=fxF_sph(.05,1,.7,.3,M('#cdc6b6',{roughness:.9}),6);const a=h3(i,1,3)*6.28;p.position.set(Math.cos(a)*.3,.3+h3(i,2,3)*.5,Math.sin(a)*.29);p.lookAt(V3(0,p.position.y,0));D.tor.add(p)}
 // a pendant and a staff, both carved as the fluffball it keeps faith in
 const pd=fxF_fluffIdol(.05,'#f8f4ea');pd.position.set(.2,-.02,0);D.neck.add(pd);
 const st=new THREE.Group();D.arms[0].hand.add(st);st.position.y=-.04;st.add(at(fxF_cyl(.025,.03,2.0,wood,6),0,.35,0));const top=fxF_fluffIdol(.11,'#ffffff');top.position.y=1.42;st.add(top);st.add(at(glowSprite('#fff6d8',.8,.5),0,1.42,0));st.rotation.z=-1.57+.12;
 g.add(at(glowSprite('#bfe8ff',4,.25),0,1.6,0));
 const ra=D.arms[0];
 return fxF_drakeIdle(D,{look:.35,noArms:1,talk:.5,extra:t=>{ra.s.rotation.z=.15;ra.el.rotation.z=1.45;ra.s.rotation.x=-.15;const la=D.arms[1];la.s.rotation.z=.6+Math.sin(t*.9)*.08;la.el.rotation.z=1.2;la.s.rotation.x=.2}})}
/* ---------- the table ---------- */
