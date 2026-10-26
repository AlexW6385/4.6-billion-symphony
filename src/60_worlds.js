/* ================================================================
   the other worlds: 虚民母球 · 尔什 (planets), 米德加尔特 · 白色通道 (inside tubes), 梦境 · 不可预见之地 (roads)
   ================================================================ */
/* ---------- 虚民母球: a planet turned to metal ---------- */
const XB=[[26,32,24],[-8,-82,21],[44,-40,18],[-34,40,18],[56,100,16],[-40,-140,16],[10,-20,16],[-60,-40,14],[64,-150,14],[20,80,16],[-12,110,12],[-20,-30,14],[40,140,12],[-58,90,14],[70,20,16],[-70,170,12],[0,-130,12],[30,-100,14],[-30,-100,14]].map(b=>({d:dirLL(b[0],b[1]),r:b[2]}));
const XOAS=dirLL(-16,-70),XCOR=dirLL(31,22);
const XSEAS=[[0,150,20],[-30,-160,12],[50,-120,10],[-50,10,9]].map(b=>({d:dirLL(b[0],b[1]),r:b[2]}));
function ximinH(p){const n=fbm(p.x*3+11,p.y*3,p.z*3,4);let m=Math.max(landMaskB(p,XB),.16)+(n-.5)*.45;for(const q of XSEAS){const s=angDeg(p,q.d);if(s<q.r)m=Math.min(m,lerp(-.5,m,sm(q.r*.55,q.r,s)))}
 if(m<0)return Math.max(-60,m*120)-2;const oa=angDeg(p,XOAS);if(oa<4.5)return 2+fbm(p.x*30,p.y*30,p.z*30,3)*6;return 5+Math.round(fbm(p.x*12+3,p.y*12,p.z*12,3)*5)*2.6}
function ximinCBase(p,h,lat,out){if(h<0){out.set('#163a4a').lerp(C('#071a26'),sm(-2,-40,h));return}if(h<2.2){out.set('#8a8a84');return}
 if(angDeg(p,XOAS)<4.5){out.set('#3f8a4a').lerp(C('#2a6a3a'),n3(p.x*40,p.y*40,p.z*40));return}
 const[la,lo]=llDir(p);const g=Math.min(Math.abs(((la/2.2)%1+1)%1-.5),Math.abs(((lo/2.2)%1+1)%1-.5));
 const cell=h3(Math.floor((la+90)/7.5),Math.floor((lo+180)/7.5),3),cell2=h3(Math.floor((la+90)/2.2),Math.floor((lo+180)/2.2),5);const DT=['#6a7078','#7c766a','#5a6068','#8a8f94','#6e6a60','#747a80'];
 out.set('#5f6870').lerp(C('#848e96'),n3(p.x*50,p.y*50,p.z*50)*.5).lerp(C(DT[(cell*6)|0]),.42).lerp(C('#a2a6aa'),cell2>.78?.4:0).lerp(C('#3a3e44'),cell2<.14?.5:0).lerp(C('#7a7466'),sm(.55,.8,n3(p.x*7,p.y*7,p.z*7))*.3);if(angDeg(p,XCOR)<4)out.lerp(C('#141418'),1-sm(2,4,angDeg(p,XCOR)))}
function oneSet(fn){return Gd=>{const n=Gd.n,a=new Float32Array(n*3),p=V3(),c=new THREE.Color();for(let k=0;k<n;k++){p.set(Gd.P[k*3],Gd.P[k*3+1],Gd.P[k*3+2]);fn(p,Gd.H[k],Math.asin(p.y)/D2R,c);a[k*3]=c.r;a[k*3+1]=c.g;a[k*3+2]=c.b}return{x:a}}}
function buildXimin(){const sp=makePlanet('ximin',{height:ximinH,colors:oneSet(ximinC),ocean:{deep:'#0b1e24',shal:'#2a4f56',sky:'#a7a498'},atm:'#a49a84',atmK:.7,clouds:{cov:.66,col:'#c9c1b1'},rough:.5,metal:.12,rock:'#4a5056',mott:.45,rockK:.2,bump:.35,envTop:'#8aa0b8',envMid:'#c0c8d0',envBot:'#2a2e34',
  sky:{zen:'#50708c',hor:'#b0bec8',set:'#d8a078'},hemiSky:0xb8c8d8,sunLon:10});BSP=sp;const gh=sp.gh;const land=(la,lo,h)=>h>4&&angDeg(dirLL(la,lo),XOAS)>5;
 const mm=new THREE.MeshStandardMaterial({color:'#8a949c',roughness:.3,metalness:.6});const tmx=towerMat({metalness:.55,roughness:.3});sp.towerMats=[tmx];
 // towers by the thousand; the big nations grow the tallest
 const JIALE=dirLL(32,18);const XE=WIKI.filter(x=>mapOf(x)==='ximin'&&x.ll&&x.id!=='xm_planet'&&x.id!=='xm_city').map(x=>dirLL(x.ll[0],x.ll[1]));const entNear=p=>{const d=dirLL(p[0],p[1]);let m=99;for(const e of XE){const a=angDeg(d,e);if(a<m)m=a}return m};const cent=[[27,34,1.6],[-6,-86,1.8],[32,18,1.4],[25,24,1.3],[44,-40,1],[-34,40,1],[20,80,1],[10,-20,1],[-12,110,.9],[56,100,.9]];let lights=[];
 cent.forEach(([la,lo,k],ci)=>{const pts=scatter(Math.round(420*k),la,lo,9*k,300+ci,land).filter(p=>!nearEnt('ximin',p[0],p[1],1.1)&&angDeg(dirLL(p[0],p[1]),JIALE)>4.2&&entNear(p)>2.6);lights=lights.concat(pts.filter((p,i)=>i%2===0));
  // not one tower shape by the thousand: the old needle towers, stepped blocks, ring towers, slabs with screens
  const XK=[[geoC('metalTower'),1,1],...TOWNKIT.future.kits('#3a4a5a').t.map(g=>[g,12,2.6]),[TOWNKIT.future.kits('#4a5a6a').m[2],6.5,3.2]];
  const groups=XK.map(()=>[]);pts.forEach(p=>{const v=Math.floor(h3(p[0]*7.1,p[1]*3.3,ci)*XK.length*.999);groups[p[3]<.68?0:v].push(p)});
  groups.forEach((G2,gi)=>{if(!G2.length)return;const [geo,H0,W0]=XK[gi];inst(geo,tmx,G2,(o,p)=>{const d=angDeg(dirLL(p[0],p[1]),dirLL(la,lo))/(9*k);frameLL(sp,p[0],p[1],0,p[3]*3,o);const h=(2+p[3]*p[3]*18+(1-d)*(1-d)*36*k)*(.25+.75*sm(4.2,9,angDeg(dirLL(p[0],p[1]),JIALE)))*(.15+.85*sm(2.6,8,entNear(p)));const w=(1.2+p[3]*1.6)/W0;o.scale.set(w*(W0>1?1.6:1),h/H0,w*(W0>1?1.6:1))},null,{tint:(p)=>C('#ffffff').offsetHSL(0,0,(p[3]-.5)*.25),far:3400})})});
 const nl=nightPoints(lights.map(p=>dirLL(p[0]+(p[3]-.5)*.1,p[1]+(p[3]-.5)*.1).multiplyScalar(R+p[2]+3+p[3]*14)),'#ffd27a',2,1);nl.material.uniforms.uDay.value=.18;sp.scene.add(nl);sp.nightMats=[nl.userData.night];
 // traffic: little flying cars streaming round the big cities in lanes at different heights, lit at the nose
 {const cg=G([[tg(new THREE.SphereGeometry(1,10,6),{s:[1.6,.5,.8]}),'#e8ecef',{}],[tg(new THREE.SphereGeometry(1,10,4,0,6.283,0,1.2),{s:[1,.45,.7]}),'#2a4a6a',{p:[-.2,.2,0]}],[kb(.3,.12,1.7),'#8a949c',{p:[-.6,0,0]}]]);
  const lanes=[];cent.filter(c=>c[2]>=1.3).forEach(([la,lo,k],ci)=>{for(let j=0;j<5;j++)lanes.push({la,lo,r:(1.6+j*1.3)*k,alt:22+j*9+(ci%2)*5,sp:(j%2?1:-1)*(.012+j*.002)})});
  const per=26,N=lanes.length*per;const im=new THREE.InstancedMesh(cg,VC({roughness:.3,metalness:.5,emissive:'#202830'}),N);im.frustumCulled=false;sp.scene.add(im);const o=new THREE.Object3D(),q=V3(),q2=V3();
  const cars=[];lanes.forEach((L,li)=>{for(let i=0;i<per;i++)cars.push({L,ph:i/per*6.283+h3(li,i,3)*.2,dz:(h3(i,li,7)-.5)*3});});
  const at2=(L,t,dz,out)=>{const la=L.la+Math.cos(t)*L.r,lo=L.lo+Math.sin(t)*L.r/Math.max(.2,Math.cos(L.la*D2R));return dirLL(la,lo,out).multiplyScalar(R+Math.max(sp.gh(la,lo),0)+L.alt+dz)};
  const nl=nightPoints(cars.map(()=>V3()),'#ffe8b0',2.2,1);nl.frustumCulled=false;sp.scene.add(nl);sp.nightMats.push(nl.userData.night);const np=nl.geometry.attributes.position;
  anim(sp,null,(T)=>{if(camera.position.length()-R>4200){im.visible=nl.visible=false;return}im.visible=nl.visible=true;cars.forEach((c,i)=>{const t=c.ph+T*c.L.sp;at2(c.L,t,c.dz,q);at2(c.L,t+.01*Math.sign(c.L.sp),c.dz,q2);o.position.copy(q);o.up.copy(q).normalize();o.lookAt(q2);o.rotateY(-Math.PI/2);o.scale.setScalar(1.3);o.updateMatrix();im.setMatrixAt(i,o.matrix);np.setXYZ(i,q.x,q.y,q.z)});im.instanceMatrix.needsUpdate=true;np.needsUpdate=true})}
 // the crowd outside the ruins: people pushing to get in, vendors' little carts selling 乐呵 and fusion fried eggs
 {const cart=G([[kb(1.6,.9,1),'#e8ecef',{p:[0,.75,0]}],[kb(1.8,.08,1.2),'#ff7ad0',{p:[0,1.9,0]}],[kcy(.04,.04,1,3),'#8a949c',{p:[.8,1.4,.5]}],[kcy(.04,.04,1,3),'#8a949c',{p:[-.8,1.4,.5]}],[ks(.25,6,4),'#ffe070',{p:[.3,1.35,0]}],[kcy(.2,.2,.3,8),'#f4f4f4',{p:[-.3,1.35,0]}],[tg(new THREE.CylinderGeometry(.3,.3,.15,10),{r:[Math.PI/2,0,0]}),'#2a2e32',{p:[.6,.3,.5]}],[tg(new THREE.CylinderGeometry(.3,.3,.15,10),{r:[Math.PI/2,0,0]}),'#2a2e32',{p:[-.6,.3,.5]}]]);
  const sc2=scatter(26,25,24,.5,909,land),cr=scatter(220,25,24,.9,910,land);inst(cart,VC({roughness:.5}),sc2,(o,p)=>{frameLL(sp,p[0],p[1],0,p[3]*6.28,o);o.scale.setScalar(1.6)},null,{far:900});
  inst(ERXIFOLK,VC({roughness:.7}),cr,(o,p)=>{frameLL(sp,p[0],p[1],0,Math.atan2(p[1]-24,p[0]-25)+Math.PI,o);o.scale.setScalar(1.4+p[3]*.3)},null,{far:700,tint:p=>C('#d8c8b0').offsetHSL((p[3]-.5)*.3,.1,(p[3]-.5)*.3)})}
 // holographic adverts drifting over the city
 {const g=new THREE.Group();const cols=['#5ad8ff','#ff6ab8','#ffd25a','#8aff9a'];for(let i=0;i<40;i++){const pl=new THREE.Mesh(new THREE.PlaneGeometry(6+h3(i,1,1)*8,3+h3(i,2,1)*4),GL(cols[i%4],.55));pl.material.side=THREE.DoubleSide;const la=25+(h3(i,3,1)-.5)*6,lo=24+(h3(i,4,1)-.5)*8;frameLL(sp,la,lo,30+h3(i,5,1)*30,h3(i,6,1)*6,pl);g.add(pl)}
  sp.scene.add(g);cull(g,dirLL(25,24).multiplyScalar(R+40),180,1800);anim(sp,g,t=>g.children.forEach((p,i)=>p.material.opacity=.35+.25*Math.sin(t*2+i)));px('xm_city',dirLL(25,24).multiplyScalar(R+gh(25,24)+20),20)}
 // the space egg of Jiale
 {const g=new THREE.Group();const e=new THREE.Mesh(sgeo(32),mt('#7ac8f0',{metalness:.5,roughness:.25}));e.scale.set(26,38,26);e.position.y=32;g.add(e);
  g.add(instGroup(kb(1,1,1),mt('#d8e8f0',{metalness:.7,roughness:.3}),Array.from({length:140}),(o,_,i)=>{const v=V3(h3(i,1,7)-.5,h3(i,2,7)-.5,h3(i,3,7)-.5).normalize();o.position.set(v.x*26,32+v.y*38,v.z*26);o.lookAt(0,32,0);o.scale.set(3.2,3.2,1.6+h3(i,4,7)*2.6)}));
  const rg=new THREE.Mesh(new THREE.TorusGeometry(38,1.8,8,72),GL('#8ad8ff',.8));rg.rotation.x=Math.PI/2;rg.position.y=8;g.add(rg);g.add(at(glowSprite('#8ad8ff',80,.3),0,8,0));
  fr(32,18,0,0,g);addE(g);cull(g,null,80,2400);px('xm_jiale',g.position.clone().add(g.position.clone().normalize().multiplyScalar(34)),34)}
 {const g=new THREE.Group();for(let i=0;i<18;i++){const h=34+((i*37)%5)*12;const t=new THREE.Mesh(kcy(1.4,2.6,h,8),mm);const a=i*2.4,d=3+i*.9;t.position.set(Math.cos(a)*d,h/2,Math.sin(a)*d);g.add(t);g.add(at(glowSprite('#ffd27a',4,.9),t.position.x,h+1,t.position.z))}fr(-6,-86,0,0,g);addE(g);cull(g,null,40,2400);px('xm_diwo',g.position.clone().add(g.position.clone().normalize().multiplyScalar(30)),24)}
 // the star gate in the plaza, a half-arch that looks made of innards; and the fungus pouring out of it
 {const g=new THREE.Group();const fl=mt('#a85a6a',{roughness:.5,emissive:'#5a1a2a',emissiveIntensity:.3});const t=new THREE.Mesh(new THREE.TorusGeometry(40,4.5,12,56,Math.PI),detailMat(fl,{bump:1.5,freq:2}));g.add(t);
  const d=new THREE.Mesh(new THREE.CircleGeometry(37,56,0,Math.PI),new THREE.MeshBasicMaterial({map:swirlTex,color:'#7ab8ff',transparent:true,opacity:.5,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));g.add(d);
  fr(-4,-89,0,0,g);addE(g,(W.xm_gate&&W.xm_gate.e)||[7]);cull(g,null,50,2000);px('xm_gate',g.position.clone().add(g.position.clone().normalize().multiplyScalar(20)),30);
  inst(ki(1,1),mt('#f4f0e8',{roughness:.9}),scatter(160,-2,-80,4.5,331,land),(o,p)=>{frameLL(sp,p[0],p[1],0,0,o);o.scale.set(2+p[3]*4,1+p[3]*3,2+p[3]*4)},[7]);px('xm_fungus',dirLL(-2,-80).multiplyScalar(R+gh(-2,-80)+6),26)}
 // the all-through train: rails on pylons right round the continent
 {const A=[];for(let i=0;i<=200;i++){const a=i/200*6.28;const la=12+26*Math.cos(a)*.7,lo=-30+26*Math.sin(a)/Math.cos(12*D2R);A.push(dirLL(la,lo).multiplyScalar(R+Math.max(gh(la,lo),0)+12))}
  const rail=new THREE.Mesh(ktube(A,.7,400,4),mt('#c8d0d8',{metalness:.8,roughness:.25}));sp.scene.add(rail);const glow=new THREE.Mesh(ktube(A,.25,400,3),GL('#9ad8ff',.8));glow.scale.setScalar(1.0005);sp.scene.add(glow);
  inst(kcy(.5,.8,1,6),mt('#8a949c',{metalness:.6}),A.filter((_,i)=>i%4===0).map(v=>{const ll=llDir(v);return[ll[0],ll[1],0,0]}),(o,p)=>{frameLL(sp,p[0],p[1],0,0,o);o.scale.set(1,12,1);o.translateY(.5)},null,{far:3000})}
 // black-metal corals crashed into the city, and black spikes from the corruption
 {const bm=mt('#0e0e12',{metalness:.6,roughness:.3});const g=new THREE.Group();for(let k=0;k<6;k++){const pts=[V3(0,0,0)];let v=V3(0,0,0);for(let i=0;i<7;i++){v=v.clone().add(V3((h3(k,i,1)-.5)*14,8+h3(k,i,2)*8,(h3(k,i,3)-.5)*14));pts.push(v)}g.add(new THREE.Mesh(ktube(pts,2.4-k*.2,30,6),bm));for(let j=2;j<6;j++){const b=pts[j].clone();g.add(new THREE.Mesh(ktube([b,b.clone().add(V3((h3(k,j,4)-.5)*20,6,(h3(k,j,5)-.5)*20))],.8,8,5),bm))}}
  fr(31,22,0,0,g);addE(g,[6]);cull(g,null,60,2400);px('xm_coral',g.position.clone().add(g.position.clone().normalize().multiplyScalar(30)),24);
  inst(kc(1,1,5),bm,scatter(60,31,22,3.4,311),(o,p)=>{frameLL(sp,p[0],p[1],0,p[3]*6,o);const h=14+p[3]*40;o.translateY(h/2);o.scale.set(2+p[3]*2,h,2+p[3]*2);o.rotateZ((p[3]-.5)*.7)},[6]);
  inst(kc(1,1,5),bm,scatter(14,31,22,6,312),(o,p)=>{frameLL(sp,p[0],p[1],120+p[3]*160,p[3]*6,o,false);o.rotateX(Math.PI);o.scale.set(3,30+p[3]*30,3)},[6],{far:3400})}
 // the cult's statue, made in their own likeness
 {const g=new THREE.Group();const b=new THREE.Mesh(kcy(4,5,3,10),mm);g.add(b);const st=new THREE.Mesh(sgeo(16),mt('#1a1a1e',{metalness:.8,roughness:.2}));st.position.y=9;st.scale.set(3,6,3);g.add(st);g.add(at(glowSprite('#ff4a4a',8,.6),0,15,0));fr(24,28,0,0,g);addE(g,[6]);cull(g,null,20,1600);px('xm_cult',g.position.clone().add(g.position.clone().normalize().multiplyScalar(10)),10)}
 // the farm sea, the deep city under glass, the green oasis that is the last clean land
 instDomes();function instDomes(){fxG_deepNet(sp);// the deep city: a network of glass tubes on the sea floor (49i_fixG)
  inst(kb(1,1,1),mt('#6a8a70'),scatter(120,-2,140,5,322),(o,p)=>{frameLL(sp,p[0],p[1],.4,0,o,false);o.scale.set(3,.4,3)},null)}
 // (the oasis: conifers and broadleaves mixed, no two the same shade, thinning toward the rim)
 {const oas=scatter(300,-16,-70,4.2,323,(la,lo,h)=>h>2&&angDeg(dirLL(la,lo),XOAS)<3.2+h3(la*7,lo*3,1)*1.3);const con=oas.filter(p=>p[3]<.6),brd=oas.filter(p=>p[3]>=.6);
  const tint=p=>C('#ffffff').offsetHSL((p[3]*7.3%1-.5)*.05,0,(p[3]*3.7%1-.5)*.22+.06);
  inst(geoC('conifer'),swayMat({roughness:.85},.003),con,(o,p)=>{frameLL(sp,p[0],p[1],0,p[3]*6,o);o.scale.setScalar(.7+p[3]*1.3)},null,{tint});
  inst(geoC('broad'),swayMat({roughness:.85},.004),brd,(o,p)=>{frameLL(sp,p[0],p[1],0,p[3]*6,o);o.scale.setScalar(.7+(p[3]-.6)*1.6)},null,{tint})}
 inst(kb(1,1.4,.4),mt('#5a5a54'),scatter(40,-16,-70,3.4,324,(la,lo,h)=>h>2),(o,p)=>{frameLL(sp,p[0],p[1],.4,p[3]*6,o);o.scale.set(3+p[3]*3,2+p[3]*4,1);o.rotateZ((p[3]-.5)*.5)},null);
 ximinMore(sp);ximinClose(sp);nightLights(sp,'#bfe2ff',9000,91);sp.herds=makeHerds(FAUNA.filter(f=>f.m==='ximin'),sp);herdProx(sp);entryModels(sp);placeMotes(sp);
 REGIONS.filter(r=>r.m==='ximin'&&r.rad).forEach(r=>sp.labels.push({n:r.n,id:null,pos:dirLL(...r.ll).multiplyScalar(R+70),minAlt:1500}));
 return sp}

/* ---------- 尔什: a living bus-planet with the people of Atlan on it ---------- */
const EXB=[[38,-98,20],[30,-80,10],[50,-112,10],[48,80,24],[40,58,14],[56,105,12],[30,92,10],[40,12,16],[50,22,9],[80,-10,12],[74,32,9],[-78,20,14],[-72,-24,8],[-20,-60,12],[-32,-52,8],[2,22,10],[-20,26,9],[-26,135,10],[12,-62,6]].map(b=>({d:dirLL(b[0],b[1]),r:b[2]}));
function erxiH(p){const n=fbm(p.x*3.4+31,p.y*3.4,p.z*3.4,5);const m=landMaskB(p,EXB)+(n-.5)*.55;if(m<0)return Math.max(-70,m*150)-2;const r=fbm(p.x*8+3,p.y*8,p.z*8,4);return 2+m*26+Math.pow(r,2.2)*70*Math.min(1,m*3)}
function erxiC(p,h,lat,out){if(h<0){out.set('#1c4f70').lerp(C('#0a2236'),sm(-2,-40,h));return}if(h<2.2){out.set('#d8c896');return}
 const al=Math.abs(lat);out.set('#4f8a46').lerp(C('#8c9e48'),sm(.4,.7,n3(p.x*2.6+3,p.y*2.6,p.z*2.6))*.7);const dry=sm(.55,.75,n3(p.x*6+5,p.y*6,p.z*6));if(al>15&&al<35)out.lerp(C('#c8a868'),dry*.8);if(h>14&&al<50)out.lerp(C('#b89a5c'),sm(14,42,h)*(1-sm(38,50,al))*.45);out.lerp(C('#2c5e34'),sm(.55,.72,n3(p.x*9+1,p.y*9,p.z*9))*.55);if(al>55)out.lerp(C('#7c8a72'),sm(55,70,al));
 if(lat>70)out.lerp(C('#8a8a6a'),.5);if(lat<-66)out.lerp(C('#9aa0a0'),.6);out.lerp(C('#2f6a3a'),sm(.6,.8,n3(p.x*14,p.y*14,p.z*14))*.4);if(h>55)out.lerp(C('#6a5f55'),sm(55,85,h));if(h>85)out.lerp(C('#eef4f8'),sm(85,110,h));out.offsetHSL(0,0,(n3(p.x*60,p.y*60,p.z*60)-.5)*.05)}
function erxiBiome(d,h,lat,e,W){const al=Math.abs(lat);if(h>80||al>72)return;W.tuft=.6;W.tuftC='#ffffff';W.flower=.06;W.flowerC=['#f4e6a0','#e9a0c0','#ffffff'][(h*7|0)%3];W.rock=.04;if(al>15&&al<35&&n3(d.x*6+5,d.y*6,d.z*6)>.6){W.tuft=.2;W.tuftC='#c8b070';W.rock=.08;W.flower=0}if(al>50){W.fern=.2;W.tuftC='#a8b088'}}
function buildErxi(){const sp=makePlanet('erxi',{height:erxiH,colors:oneSet(erxiC),ocean:{deep:'#0b2c48',shal:'#1f7a8a'},atm:'#7fb8ff',clouds:{cov:.5},sunLon:-20,rock:'#6a5f55'});BSP=sp;const gh=sp.gh;
 makeCover(sp,erxiBiome);
 const mm=new THREE.MeshStandardMaterial({color:'#d8dde2',roughness:.35,metalness:.6});let lights=[];const tme=towerMat({metalness:.5,roughness:.35,win:'#ffe6b0'});sp.towerMats=[tme];
 // outskirts of high-rises round each civilised place, kept out of the towns laid out street by street (and away from the old-style fort)
 const ETOWN=[[45,12,2.8],[38.5,101,6.2],[38,-100,2.8],[36,-94,1.7],[32,-84,1.6],[36,16,2],[40,22,1.4],[30,40,1.5],[78,-24,4]];const inTown=(la,lo)=>ETOWN.some(([a,b,r])=>angDeg(dirLL(la,lo),dirLL(a,b))<r);
 const EK=[[geoC('metalTower'),1,1],...TOWNKIT.future.kits('#3a4a5a').t.map(g=>[g,12,2.6]),...TOWNKIT.future.kits('#4a5a6a').m.map(g=>[g,6,3.2])];
 WIKI.filter(w=>w.m==='erxi'&&w.c==='文明'&&w.ll&&w.id!=='ex_xiafeng').forEach((w,k)=>{const pts=scatter(90,w.ll[0],w.ll[1],3.2,400+k,(la,lo,h)=>h>2&&!inTown(la,lo));lights=lights.concat(pts.map(p=>[p,w.e]));
  const gr=EK.map(()=>[]);pts.forEach(p=>gr[Math.floor(p[3]*EK.length*.999)].push(p));
  gr.forEach((L,gi)=>{if(!L.length)return;const [geo,H0,W0]=EK[gi];inst(geo,tme,L,(o,p)=>{frameLL(sp,p[0],p[1],0,p[3]*9,o);const h=(2+p[3]*p[3]*16)/H0*(W0>1?1.3:1),w2=(1+p[3])/W0*(W0>1?1.7:1);o.scale.set(w2,h,w2)},w.e,{tint:()=>C('#e8ecf0')})})});
 {const byE={};lights.forEach(([p,e])=>{const k=e.join();(byE[k]=byE[k]||{e,pts:[]}).pts.push(dirLL(p[0]+.2,p[1]).multiplyScalar(R+p[2]+1.6))});sp.nightMats=[];for(const k in byE){const nl=nightPoints(byE[k].pts,'#ffe0a0',1.8,1);addE(nl,byE[k].e);sp.nightMats.push(nl.userData.night)}}
 inst(geoC('broad'),swayMat({roughness:.85},.002),scatter(900,40,30,40,410,(la,lo,h)=>h>3&&h<50),(o,p)=>{frameLL(sp,p[0],p[1],-.2,p[3]*6,o);o.scale.setScalar(.9+p[3]*.8)},null,{far:3000});
 inst(geoC('conifer'),swayMat({roughness:.85},.003),scatter(600,38,-98,18,411,(la,lo,h)=>h>3&&h<50),(o,p)=>{frameLL(sp,p[0],p[1],-.2,p[3]*6,o);o.scale.setScalar(.9+p[3]*.9)},null,{far:3000});
 inst(geoC('conifer'),swayMat({roughness:.85},.003),scatter(400,52,90,14,412,(la,lo,h)=>h>3&&h<60),(o,p)=>{frameLL(sp,p[0],p[1],-.2,p[3]*6,o);o.scale.setScalar(.8+p[3]*.9)},null,{far:3000});
 // the academy of Tiangong: a great disc-shaped building standing in the city streets (the sky above the city is full of small floating clouds: 49i_fixG)
 {const g=new THREE.Group();const DK='#3a4a5a',GL='#3a5a7a',WH='#ffffff';
  // the academy: a broad disc on a ring of columns, two tiers, a glass band of windows all the way round, the name over the gate
  const tm=towerMat({metalness:.45,roughness:.35,win:'#ffe8c0'});sp.towerMats.push(tm);
  {const P=[[kcy(11,11.6,1.2,40),'#d8dee4',{p:[0,.9,0]}],[kcy(10.2,10.6,3.6,40),WH,{p:[0,3.3,0]}],[kcy(10.24,10.24,1.1,40),GL,{p:[0,3.3,0]}],[kcy(11.2,10.4,.6,40),'#d8dee4',{p:[0,5.4,0]}],
    [kcy(7.4,7.8,2.8,36),WH,{p:[0,7.1,0]}],[kcy(7.44,7.44,.9,36),GL,{p:[0,7.1,0]}],[tg(new THREE.SphereGeometry(7.4,36,10,0,6.283,0,.7),{}),'#e8ecef',{p:[0,5.4+2.2,0]}],[ring(8.4,.25,40),DK,{p:[0,8.6,0]}],
    [kcy(1.6,1.6,4.6,16),WH,{p:[0,11.6,0]}],[kcy(2.6,2.6,.3,20),DK,{p:[0,14,0]}],[kcy(.08,.08,5,4),'#8a949c',{p:[0,16.6,0]}],
    [kb(5,3.4,.4),'#2a3038',{p:[0,3,10.5]}],[kb(6.4,.9,.3),DK,{p:[0,5.2,11]}],[kb(5.2,.4,.06),'#e8b830',{p:[0,5.2,11.18]}],[kb(7,.3,4),'#d8dee4',{p:[0,.35,12.6]}]];
   for(let k=0;k<20;k++){const a=k/20*6.283;P.push([kcy(.3,.3,3.6,8),'#f4f4f4',{p:[Math.cos(a)*11.2,3.3,Math.sin(a)*11.2]}])}
   // wings: a training hall and a dormitory block, joined to the disc by glass bridges
   for(const [a,w,h] of [[2.1,6,6],[-2.1,5,9]]){const x=Math.cos(a)*15,z=Math.sin(a)*15;P.push([kb(w,h,w),WH,{p:[x*.98,h/2,z*.98]}],...[1.5,3,4.5,6,7.5].filter(y=>y<h).map(y=>[kb(w+.06,.4,w+.06),GL,{p:[x*.98,y,z*.98]}]),[kb(w+.4,.3,w+.4),DK,{p:[x*.98,h+.15,z*.98]}],[kb(1.4,1.2,4.6),GL,{p:[Math.cos(a)*11.4,4,Math.sin(a)*11.4],r:[0,-a+Math.PI/2,0]}])}
   // landing pads at the rim, with a parked flier on one
   for(const a of[3.6,5.4]){const x=Math.cos(a)*14.5,z=Math.sin(a)*14.5;P.push([kcy(3,3,.3,20),'#5a6268',{p:[x,.35,z]}],[ring(2.4,.08,20),'#e8b830',{p:[x,.52,z]}])}
   {const a=3.6,x=Math.cos(a)*14.5,z=Math.sin(a)*14.5;P.push([tg(new THREE.SphereGeometry(1,12,8),{s:[1.8,.6,1]}),'#e8ecef',{p:[x,1.1,z]}],[tg(new THREE.SphereGeometry(1,12,4,0,6.283,0,1.2),{s:[1.1,.5,.8]}),'#2a4a6a',{p:[x-.2,1.4,z]}])}
   // the yard in front: paths, a fountain, benches, a ring of little trees
   P.push([kb(2.2,.12,4),'#d8ccb0',{p:[0,.36,15.4]}]);P.push([kcy(1.8,1.8,.5,16),'#d8dee4',{p:[6,.5,13]}],[kcy(1.5,1.5,.52,16),'#4a8aa8',{p:[6,.52,13]}],[kcy(.2,.3,1.4,8),'#e8ecef',{p:[6,1.2,13]}]);
   for(let k=0;k<6;k++)P.push([kb(1.2,.35,.4),'#8a6a40',{p:[-6+k*.2,.55,11.6+k*1.1],r:[0,.5,0]}]);
   const ac=new THREE.Mesh(G(P),tm);g.add(ac)}
  g.add(at(glowSprite('#bfe8ff',8,.8),0,19.2,0));
  {const [a,b]=PL(45,12,18,0);frameLL(sp,a,b,-.3,Math.PI,g)}addE(g,[8,9,10,11,12]);cull(g,null,30,2600);g.userData.pick='ex_tiangong';px('ex_tiangong',g.position.clone().addScaledVector(g.position.clone().normalize(),10),24)}
 // the moon of Erxi, and the bridge it stretches down
 const mo=new THREE.Mesh(new THREE.SphereGeometry(120,64,40),detailMat(mt('#c8ccd4',{roughness:.9}),{bump:.8,freq:.15}));sp.scene.add(mo);sp.moon=mo;sp.moonPos=mo.position;px('ex_moon',()=>mo.position,120,{});
 const mb=new THREE.Group();for(let i=0;i<12;i++){const b=new THREE.Mesh(kb(14,18,14),mt('#9aa0a8',{metalness:.4}));const v=V3(h3(i,1,9)-.5,h3(i,2,9)-.5,h3(i,3,9)-.5).normalize();b.position.copy(v).multiplyScalar(124);b.lookAt(0,0,0);mb.add(b)}mo.add(mb);addTo(sp,mb,[9]);
 const br=new THREE.Mesh(kcy(6,10,1,12,1,true),GL('#ffe6b0',.55));addE(br,[9]);
 // the crack in the sky, the street of falling hearth-fires, the end-sign
 {const g=new THREE.Group();const pts=[];let v=V3(0,0,0);for(let i=0;i<16;i++){v=v.clone().add(V3((h3(i,1,3)-.3)*14,(h3(i,2,3)-.5)*6,(h3(i,3,3)-.5)*4));pts.push(v)}g.add(new THREE.Mesh(ktube(pts,1.4,60,5),GL('#e8f0ff',.9)));g.add(at(glowSprite('#e8f0ff',90,.35),pts[8].x,pts[8].y,pts[8].z));frameLL(sp,28,-6,150,0,g,false);addE(g,[10]);cull(g,null,120,3400);px('ex_crack',g.position.clone(),40)}
 {const g=new THREE.Group();const st=new THREE.Mesh(kb(4,.4,120),GL('#ffb060',.7));g.add(st);g.add(emitter({n:500,life:4,speed:-12,spread:.1,size:2.4,dir:[0,1,0],col:'#ffd070',col2:'#ff4010',op:.9,area:[6,4,120]}));g.children[1].position.y=60;fr(38,40,.5,.8,g);addE(g,[9]);cull(g,null,80,2400);px('ex_frozen',g.position.clone().add(g.position.clone().normalize().multiplyScalar(6)),30)}
 glowArc([16,24],[24,36],2,'#ff6a2a',[12],.6,.9);glowArc([22,28],[18,38],1.6,'#ff8a3a',[12],.6,.9);
 // poles: the old ice still on the south, a hole into the deep, a fortress in the gorge winds
 {const ice=detailMat(mt('#e4eef4',{roughness:.4,transparent:true,opacity:.94}),{bump:.7,mott:1.4,freq:.6});const cap=new THREE.Mesh(new THREE.SphereGeometry(R+1.4,96,16,0,Math.PI*2,0,16*D2R),ice);cap.rotation.x=Math.PI;cap.renderOrder=1;sp.scene.add(cap);
  const hole=new THREE.Mesh(new THREE.CircleGeometry(14,24),new THREE.MeshBasicMaterial({color:'#020202'}));const hg=new THREE.Group();hole.rotation.x=-Math.PI/2;hole.position.y=.6;hg.add(hole);fr(-80,40,0,0,hg);sp.scene.add(hg);
  // 峡风要塞 is a small old town of low stone houses round its clock tower (62_worlds2, 42b_cities), no fortress
  px('ex_xiafeng',dirLL(78,-24).multiplyScalar(R+sp.gh(78,-24)+8),14);
  const nj=sparkles(scatter(400,80,20,9,451).map(p=>dirLL(p[0],p[1]).multiplyScalar(R+p[2]+.8)),'#7affc8',1.8,.9,1);sp.scene.add(nj)}
 // Atlan of old: a castle and mammoths
 {const g=new THREE.Group();const wm=detailMat(mt('#a89a88'),{bump:.6});for(let i=0;i<8;i++){const t=new THREE.Mesh(geoC('tower','#a89a88','#6a3a2a'),VC());t.position.set(Math.cos(i*.785)*9,0,Math.sin(i*.785)*9);t.scale.setScalar(1.6);g.add(t)}g.add(at(new THREE.Mesh(kb(8,7,8),wm),0,3.5,0));fr(36,16,0,0,g);addE(g,[7]);cull(g,null,30,1800);px('ex_atlan',g.position.clone().add(g.position.clone().normalize().multiplyScalar(6)),14)}
 inst(new THREE.SphereGeometry(1,16,8,0,6.283,0,1.57),mt('#bfe0e8',{transparent:true,opacity:.6,roughness:.1}),scatter(12,-6,-28,1.6,461),(o,p)=>{frameLL(sp,p[0],p[1],0,0,o,false);o.position.setLength(R+sp.ghRaw(p[0],p[1])+.4);o.scale.setScalar(3+p[3]*3)},[7]);
 erxiMore(sp);erxiClose(sp);planetMeteors(sp);nightLights(sp,'#ffc870',5200,77);sp.herds=makeHerds(FAUNA.filter(f=>f.m==='erxi'),sp);herdProx(sp);entryModels(sp);placeMotes(sp);
 REGIONS.filter(r=>r.m==='erxi'&&r.rad).forEach(r=>sp.labels.push({n:r.n,id:null,pos:dirLL(...r.ll).multiplyScalar(R+70),minAlt:1500}));
 const ex0=sp.extra;sp.extra=(T,dt)=>{const ma=T*.012+1;mo.position.set(Math.cos(ma)*3400,700,Math.sin(ma)*3400);mo.rotation.y=T*.01;
  if(br.visible){const a=mo.position.clone(),b=a.clone().setLength(R+20);br.position.copy(a).add(b).multiplyScalar(.5);br.scale.set(1,a.distanceTo(b),1);br.quaternion.setFromUnitVectors(V3(0,1,0),a.clone().sub(b).normalize())}};
 return sp}

/* ---------- inside the tubes ---------- */
const TUBE_R={midgard:420,tunnel:380};
function buildTube(id){const m=MB[id];const sc=new THREE.Scene();const sp=newSpace(id,'tube',sc);const white=!!m.white;const Rt=TUBE_R[id];sp.Rt=Rt;
 const zs=WIKI.filter(w=>mapOf(w)===id).map(w=>w.z);const z0=-1400,z1=Math.max(...zs)+1200;sp.zr=[z0+700,z1-200];sp.zc=[z0+30,z1-30];
 const L=z1-z0,geo=new THREE.CylinderGeometry(Rt,Rt,L,white?160:120,Math.round(L/(white?26:34)),true);geo.rotateX(Math.PI/2);geo.rotateZ(Math.PI);geo.translate(0,0,(z0+z1)/2);
 const p=geo.attributes.position,cs=[];const col=new THREE.Color();
 for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);const a=Math.atan2(x,y);const n=fbm(Math.cos(a)*3+z/400,Math.sin(a)*3,z/700,4);
  if(white){const floor=sm(-.2,-.75,Math.cos(a));const dune=(Math.sin(z/70+Math.sin(a*3)*2+n*6)+1)*.5;let d=(Math.sin(z/90+n*8)+1)*.5*18*n*(1-floor)+floor*(4+dune*12*n+n*8);const r=Rt-d;p.setX(i,x/Rt*r);p.setY(i,y/Rt*r);
   const band=sm(.94,.995,Math.abs(Math.sin(z/320))),seam=sm(.985,1,Math.abs(Math.sin(a*6)));col.set('#b8b2a2').lerp(C('#857c68'),sm(.35,.75,n)).lerp(C('#d8d4c8'),sm(.6,.9,(Math.sin(z/90+n*8)+1)*.5)*.5).lerp(C('#5e5546'),band*.7*(1-floor)).lerp(C('#7a705e'),seam*.6*(1-floor));col.lerp(C('#dcd6ca'),floor*(.85+.15*dune))}
  else{const rib=sm(.9,.99,Math.abs(Math.sin(z/130)));const plate=Math.abs(Math.sin(a*12))>.97?1:0;const d=n*34+rib*26;const r=Rt-d;p.setX(i,x/Rt*r);p.setY(i,y/Rt*r);col.set('#0d0c12').lerp(C('#221e2c'),n*1.2).lerp(C('#4a3a7a'),rib*.75).lerp(C('#050507'),plate*.6)}
  cs.push(col.r,col.g,col.b)}
 geo.setAttribute('color',new THREE.Float32BufferAttribute(cs,3));geo.computeVertexNormals();
 sp.wallD=(z,a)=>{const n=fbm(Math.cos(a)*3+z/400,Math.sin(a)*3,z/700,4);if(white){const floor=sm(-.2,-.75,Math.cos(a));const dune=(Math.sin(z/70+Math.sin(a*3)*2+n*6)+1)*.5;return (Math.sin(z/90+n*8)+1)*.5*18*n*(1-floor)+floor*(4+dune*12*n+n*8)}const rib=sm(.9,.99,Math.abs(Math.sin(z/130)));return n*34+rib*26};sp.wallR=(z,d)=>sp.wallD(z,Math.PI-d*D2R);
 {const P2=geo.attributes.position,Nn=geo.attributes.normal,mp=new Map();for(let i=0;i<P2.count;i++){const k=Math.round(P2.getX(i)*10)+','+Math.round(P2.getY(i)*10)+','+Math.round(P2.getZ(i)*10);let L2=mp.get(k);if(!L2)mp.set(k,L2=[]);L2.push(i)}for(const L2 of mp.values()){if(L2.length<2)continue;const v=V3(0,0,0);L2.forEach(i=>v.add(V3(Nn.getX(i),Nn.getY(i),Nn.getZ(i))));v.normalize();L2.forEach(i=>Nn.setXYZ(i,v.x,v.y,v.z))}}
 const wm=detailMat(new THREE.MeshStandardMaterial({vertexColors:true,side:THREE.BackSide,roughness:.92}),{bump:1.4,freq:.6,mott:.8});sc.add(new THREE.Mesh(geo,wm));
 if(white){for(let z=z0+800;z<z1;z+=1600){const t=new THREE.Mesh(new THREE.TorusGeometry(Rt-12,5,8,140),detailMat(mt('#6e6656'),{bump:.6}));t.position.z=z;sc.add(t)}
  sc.background=C('#d8d4ca');sc.fog=new THREE.FogExp2(0xd8d4ca,.00024);sc.environment=makeEnv('#e8e4dc','#b8b2a6','#6a6458');sc.add(new THREE.HemisphereLight(0xfffaf0,0x8a8070,.32));const dl=new THREE.DirectionalLight(0xfff4e0,.62);dl.position.set(.8,.3,.5);sc.add(dl);const dl2=new THREE.DirectionalLight(0xe0e8ff,.35);dl2.position.set(-.6,-.4,.2);sc.add(dl2);
  const sand=[];for(let i=0;i<3000;i++){const a=(Math.random()-.5)*1.6,z=z0+Math.random()*L,r=Rt-30-Math.random()*Rt*.6;sand.push(V3(Math.sin(a)*-r*0+Math.sin(a)*r,-Math.cos(a)*r,z))}const sd=sparkles(sand,'#fffaf0',6,.5,.4);sd.material.blending=THREE.NormalBlending;sc.add(sd)}
 else{sc.background=C('#05040a');sc.fog=new THREE.FogExp2(0x0a0812,.00028);sc.add(new THREE.HemisphereLight(0xa89ad8,0x1a1624,.55));sc.environment=makeEnv('#3a3060','#1a1630','#0a0810');
  for(let z=z0+500;z<z1;z+=1500){const l=new THREE.PointLight(0xa88aff,1.1,2400);l.position.set(0,0,z);sc.add(l)}
  const veins=[];for(let k=0;k<26;k++){const a0=Math.random()*6.28;const zz=z0+Math.random()*L;const pts=[];for(let j=0;j<40;j++){const a=a0+Math.sin(j*.3+k)*.2+j*.01,z2=zz+j*40;pts.push(V3(Math.sin(a)*(Rt-30),Math.cos(a)*(Rt-30),z2))}veins.push(...new THREE.CatmullRomCurve3(pts).getPoints(160))}sc.add(sparkles(veins,'#c8a8ff',5,1,.6));
  const lp=[];for(let i=0;i<5200;i++){const a=Math.random()*6.28,z=z0+Math.random()*L;const r=Rt-28-Math.random()*10;lp.push(V3(Math.sin(a)*r,Math.cos(a)*r,z))}sc.add(sparkles(lp,'#c0b0ff',13,1,1));
  const dust=[];for(let i=0;i<2000;i++){const a=Math.random()*6.28,z=z0+Math.random()*L,r=Math.random()*Rt*.8;dust.push(V3(Math.sin(a)*r,Math.cos(a)*r,z))}sc.add(sparkles(dust,'#6a6488',5,.5,.3));
  for(let z=z0+600;z<z1;z+=600){const t=new THREE.Mesh(new THREE.TorusGeometry(Rt-24,2.4,6,140),GL('#8a7aff',.5));t.position.z=z;sc.add(t)}}
 if(white){const rel=G([[kb(1,1,1),'#efece4',{p:[0,.3,0]}],[kcy(.3,.35,1.6,8),'#e4e0d6',{p:[1.2,.6,.4],r:[0,0,.5]}],[ks(.5,8,6),'#f4f2ec',{p:[-.9,.2,.6]}],[kc(.4,1,4),'#d8d4ca',{p:[.2,.3,-1]}]]);const pts=[];for(let i=0;i<900;i++){const a=(Math.random()-.5)*1.3,z=z0+300+Math.random()*(L-600);pts.push([a,z,Math.random()])}
  const im=new THREE.InstancedMesh(rel,VC({roughness:.8}),pts.length);const o3=new THREE.Object3D();pts.forEach((p,i)=>{const u=tubeUp(p[0]/D2R);o3.position.copy(tubePt(Rt,p[1],p[0]/D2R,4));o3.quaternion.setFromUnitVectors(V3(0,1,0),u);o3.rotateY(p[2]*6);o3.scale.setScalar(3+p[2]*7);o3.updateMatrix();im.setMatrixAt(i,o3.matrix)});im.frustumCulled=false;sc.add(im)}
 else{const hut=G([[kcy(1,1.2,1.6,8),'#3a3448',{p:[0,.8,0]}],[kc(1.3,1,8),'#2a2436',{p:[0,2.1,0]}]]);const pts=[];const lamps=[];for(let k=0;k<90;k++){const a=k%3===0?(Math.random()-.5)*1.2:Math.random()*6.28,z=z0+600+Math.random()*(L-1200);for(let i=0;i<18;i++){const a2=a+(Math.random()-.5)*.25,z2=z+(Math.random()-.5)*260;pts.push([a2,z2,Math.random()]);lamps.push(tubePt(Rt,z2,a2/D2R,18+Math.random()*6))}}
  const im=new THREE.InstancedMesh(hut,VC({roughness:.7}),pts.length);const o3=new THREE.Object3D();pts.forEach((p,i)=>{o3.position.copy(tubePt(Rt,p[1],p[0]/D2R,-2));o3.quaternion.setFromUnitVectors(V3(0,1,0),tubeUp(p[0]/D2R));o3.scale.setScalar(5+p[2]*6);o3.updateMatrix();im.setMatrixAt(i,o3.matrix)});im.frustumCulled=false;sc.add(im);sc.add(sparkles(lamps,'#ffc890',10,1,.5))}
 // the white tunnel: fine sand blown along the floor in long thin streams
 if(white){const N=9000,P=[],A=[];for(let i=0;i<N;i++){const ang=(Math.random()-.5)*140,h=22+Math.random()*Math.random()*60;const z=z0+Math.random()*(z1-z0);const w0=sp.wallR?Math.max(0,sp.wallR(z,ang)):0;const q=tubePt(Rt,0,ang,h+w0);P.push(q.x,q.y,z);A.push(Math.random())}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('ph',new THREE.Float32BufferAttribute(A,1));
  const m=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{uT:GT,uS:PSCALE,uZ:{value:new THREE.Vector2(z0,z1-z0)}},
   vertexShader:'uniform float uT,uS;uniform vec2 uZ;attribute float ph;varying float vA;void main(){vec3 p=position;float sp=18.+ph*40.;p.z=uZ.x+mod(p.z-uZ.x+uT*sp,uZ.y);p.x+=sin(uT*.7+ph*30.)*1.5;vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;float d=-mv.z;vA=smoothstep(900.,120.,d)*(.35+.65*fract(ph*7.3));gl_PointSize=clamp(uS*7./d,2.,8.);}',
   fragmentShader:'varying float vA;void main(){vec2 c=gl_PointCoord-.5;float a=smoothstep(.5,.0,length(c));gl_FragColor=vec4(vec3(1.,.93,.78)*a*vA*.9,1.);}',blending:THREE.AdditiveBlending});
  const pts=new THREE.Points(g,m);pts.frustumCulled=false;pts.renderOrder=3;sc.add(pts)}
 // slow rings of light that travel down the pipe, as if the tube itself breathed (midgard only; the white tunnel is lit already)
 if(!white){const rm=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,uniforms:{uA:{value:1}},
   vertexShader:'varying vec2 vU;void main(){vU=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
   fragmentShader:'uniform float uA;varying vec2 vU;void main(){float e=1.-abs(vU.y-.5)*2.;float a=pow(e,2.)*(.45+.55*pow(.5+.5*sin(vU.x*6.283*40.),6.));gl_FragColor=vec4(vec3(.55,.8,1.)*a*.7*uA,1.);}'});
  const rg=new THREE.CylinderGeometry(Rt*.82,Rt*.82,90,96,1,true);rg.rotateX(Math.PI/2);const rings=[];
  for(let i=0;i<7;i++){const mm=rm.clone();const r=new THREE.Mesh(rg,mm);r.renderOrder=3;r.frustumCulled=false;sc.add(r);rings.push({r,k:i/7})}
  anim(sp,null,t=>{const L=z1-z0;for(const o of rings){const u=(o.k+t*.006)%1;o.r.position.set(0,0,z0+u*L);o.r.material.uniforms.uA.value=Math.min(1,u*8)*Math.min(1,(1-u)*8)}})}
 tubeMore(sp,id,z0,z1);placeEntries(sp);
 const eras=eraCentroids(sp,w=>w.z);sp.eraAt=()=>nearestEra(eras,rig.a);
 return sp}
function eraCentroids(sp,f){const by={};const ok=MB[sp.id].e;WIKI.filter(w=>mapOf(w)===sp.id).forEach(w=>{const e=w.e.find(x=>ok.includes(x))||w.e[0];(by[e]=by[e]||[]).push(f(w))});const L=Object.keys(by).map(e=>({e:+e,v:by[e].reduce((a,b)=>a+b,0)/by[e].length}));
 L.forEach(x=>{sp.labels.push({n:EB[x.e].n,pos:null,era:x.e,param:x.v})});return L}
function nearestEra(L,v){let b=L[0],bd=1e18;for(const x of L){const d=Math.abs(x.v-v);if(d<bd){bd=d;b=x}}return b?b.e:ERA}

/* ---------- along the roads of dream ---------- */
const ROAD={dream:t=>V3(Math.sin(t*Math.PI*3.2)*900+Math.sin(t*17)*120,Math.sin(t*Math.PI*5)*90,3200-t*6400),
 buke:t=>V3(Math.sin(t*Math.PI*2.4+1)*1000+Math.cos(t*11)*160,Math.sin(t*Math.PI*3+.5)*140,-3000+t*6000)};
function buildPath(id){const m=MB[id];const sc=new THREE.Scene();const sp=newSpace(id,'path',sc);const pale=!!m.pale;sp.bound=4600;
 sc.add(new THREE.AmbientLight(pale?0xd8d0ff:0x8a90b8,pale?.75:.55));const dl=new THREE.DirectionalLight(pale?0xfff0ff:0xffeedd,pale?.6:.8);dl.position.set(-.4,.9,.3);sc.add(dl);
 sc.environment=pale?makeEnv('#c8c0e8','#8a84a8','#2a2640'):makeEnv('#2a2a50','#14142a','#06060c',[[[-.4,.9,.3],'#ffe8c0',1.6]]);
 if(pale){const sky=new THREE.Mesh(new THREE.SphereGeometry(20000,32,16),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{uT:GT},vertexShader:'varying vec3 vP;void main(){vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:GLSL_NOISE+'uniform float uT;varying vec3 vP;void main(){vec3 d=normalize(vP);float h=d.y;vec3 a=vec3(.14,.12,.22),b=vec3(.46,.42,.6);vec3 c=mix(a,b,smoothstep(-.4,.7,h));float n=fb3(d*3.+vec3(uT*.01));c+=vec3(.12,.1,.16)*smoothstep(.5,.8,n);gl_FragColor=vec4(c,1.);}'}));sky.renderOrder=-20;sc.add(sky);sc.fog=new THREE.FogExp2(0x2a2640,.00012);sp.sky=sky}
 else{sc.background=C('#020205');const sky=new THREE.Mesh(new THREE.SphereGeometry(28000,48,24),voidSkyMat());sky.renderOrder=-20;sc.add(sky);sp.sky=sky;starfield(sc,7000,20000,1.8)}
 const road=ROAD[id];sp.road=road;const n=900,wd=pale?90:34,ps=[],ix=[],uvs=[];for(let i=0;i<=n;i++){const t=i/n,p=road(t),q=road(Math.min(1,t+.001)).sub(road(Math.max(0,t-.001))).normalize();const s=V3(-q.z,0,q.x).normalize();
  ps.push(p.x+s.x*wd,p.y,p.z+s.z*wd,p.x-s.x*wd,p.y,p.z-s.z*wd);uvs.push(0,t*80,1,t*80);if(i<n){const a=i*2;ix.push(a,a+1,a+2,a+1,a+3,a+2)}}
 const rg=new THREE.BufferGeometry();rg.setAttribute('position',new THREE.Float32BufferAttribute(ps,3));rg.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));rg.setIndex(ix);
 const rm=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,uniforms:{uT:GT,uC:{value:C(pale?'#bfe4ff':'#ffe2a0')},uP:{value:pale?.6:.9}},
  vertexShader:'varying vec2 vU;void main(){vU=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:'uniform float uT,uP;uniform vec3 uC;varying vec2 vU;void main(){float e=1.-abs(vU.x-.5)*2.;float core=pow(e,3.);float flow=.55+.45*sin(vU.y*6.-uT*1.4)*sin(vU.y*1.7+uT*.3);float dash=smoothstep(.45,.5,fract(vU.y*.5-uT*.1))*smoothstep(.55,.5,fract(vU.y*.5-uT*.1))*step(.4,e);gl_FragColor=vec4(uC*(core*flow*.9+e*.2+dash*.4)*uP,1.);}'});
 sc.add(new THREE.Mesh(rg,rm));
 {const a=[];for(let i=0;i<3200;i++){const t=Math.random(),p=road(t);a.push(V3(p.x+(Math.random()-.5)*(pale?1000:600),p.y+(Math.random()-.3)*(pale?560:340),p.z+(Math.random()-.5)*(pale?1000:600)))}sc.add(sparkles(a,pale?'#f0e8ff':'#ffe8b8',pale?10:7,.6,.8))}
 // lanterns that drift along above the road
 const lan=[];for(let i=0;i<60;i++){const s=glowSprite(pale?'#e8f0ff':'#ffd890',pale?26:18,.8);sc.add(s);lan.push({s,t:i/60,ph:Math.random()*6})}
 anim(sp,null,(t)=>{lan.forEach(l=>{const k=(l.t+t*.004)%1;const p=road(k);l.s.position.set(p.x+Math.sin(t*.3+l.ph)*60,p.y+60+Math.sin(t*.7+l.ph)*20,p.z)})});
 // the library's air: loose pages drift and turn slowly over the road
 if(id==='buke'){const N=140,pg=new THREE.PlaneGeometry(6,8);const pm=new THREE.MeshStandardMaterial({color:'#f6efe0',emissive:'#fff2d8',emissiveIntensity:.25,roughness:.9,side:THREE.DoubleSide});
  const im=new THREE.InstancedMesh(pg,pm,N);im.frustumCulled=false;im.userData.noCut=1;sc.add(im);const P=[];for(let i=0;i<N;i++)P.push({t:Math.random(),ox:(Math.random()-.5)*700,oy:20+Math.random()*320,oz:(Math.random()-.5)*700,ph:Math.random()*6.28,sp:.4+Math.random()*.8});
  const o3=new THREE.Object3D();anim(sp,im,t=>{for(let i=0;i<N;i++){const q=P[i];const p=road(q.t);const f=t*q.sp+q.ph;o3.position.set(p.x+q.ox+Math.sin(f*.3)*40,p.y+q.oy+Math.sin(f*.5)*18,p.z+q.oz+Math.cos(f*.27)*40);o3.rotation.set(Math.sin(f*.7)*1.2,f*.4,Math.cos(f*.6)*.9);o3.updateMatrix();im.setMatrixAt(i,o3.matrix)}im.instanceMatrix.needsUpdate=true})}
 // dream bubbles: thin iridescent spheres that rise from the road, wobble, and fade before they pop
 if(id==='dream'){const bm=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{uT:GT,uA:{value:1}},
   vertexShader:'varying vec3 vN,vV;varying vec3 vP;void main(){vec4 w=modelMatrix*vec4(position,1.);vP=position;vN=normalize(mat3(modelMatrix)*normal);vV=normalize(cameraPosition-w.xyz);gl_Position=projectionMatrix*viewMatrix*w;}',
   fragmentShader:'uniform float uT,uA;varying vec3 vN,vV,vP;void main(){float f=1.-abs(dot(normalize(vN),vV));float rim=pow(f,2.6);vec3 film=.55+.45*cos(6.283*(f*1.6+vP.y*.08+uT*.05+vec3(0.,.33,.67)));float hl=pow(max(0.,dot(reflect(-vV,normalize(vN)),normalize(vec3(-.4,.9,.3)))),40.);gl_FragColor=vec4((film*rim*.55+hl*.8)*uA,1.);}'});
  const bg=new THREE.SphereGeometry(1,24,16);const bub=[];for(let i=0;i<64;i++){const mm=bm.clone();mm.uniforms.uT=GT;const m=new THREE.Mesh(bg,mm);m.renderOrder=5;sc.add(m);bub.push({m,t:Math.random(),ph:Math.random()*6.28,age:Math.random(),life:.6+Math.random()*.8,r:14+Math.random()*Math.random()*50,ox:(Math.random()-.5)*420,oz:(Math.random()-.5)*420})}
  anim(sp,null,(t,dt)=>{for(const b of bub){b.age+=(dt||.016)/b.life/22;if(b.age>1){b.age=0;b.t=Math.random();b.ox=(Math.random()-.5)*260;b.oz=(Math.random()-.5)*420;b.r=14+Math.random()*Math.random()*50}
    const p=road(b.t),a=b.age;b.m.position.set(p.x+b.ox+Math.sin(t*.4+b.ph)*18,p.y+10+a*420,p.z+b.oz+Math.cos(t*.35+b.ph)*18);const w=1+Math.sin(t*2.1+b.ph)*.04;b.m.scale.set(b.r*w,b.r/w,b.r*w);b.m.material.uniforms.uA.value=Math.min(1,a*6)*Math.min(1,(1-a)*4)}})}
 if(pale){for(let i=0;i<30;i++){const t=Math.random(),p=road(t);const f=new THREE.Sprite(new THREE.SpriteMaterial({map:smokeTex,color:'#e8e0f8',transparent:true,opacity:.35,depthWrite:false}));f.scale.set(500,260,1);f.position.set(p.x+(Math.random()-.5)*800,p.y-80+Math.random()*120,p.z);sc.add(f)}}
 pathMore(sp,id);placeEntries(sp);
 const samp=[];for(let i=0;i<=400;i++)samp.push(road(i/400));sp.roadT=(x,z)=>{let b=0,bd=1e18;for(let i=0;i<samp.length;i++){const d=(samp[i].x-x)**2+(samp[i].z-z)**2;if(d<bd){bd=d;b=i}}return b/400};
 const eras=eraCentroids(sp,w=>w.t||0);sp.eraAt=()=>nearestEra(eras,sp.roadT(rig.b,-rig.a));
 return sp}

/* ---------- every space, built when first needed ---------- */
const BUILDERS={rongqiu:buildRongqiu,void:buildVoid,ximin:buildXimin,erxi:buildErxi,midgard:()=>buildTube('midgard'),tunnel:()=>buildTube('tunnel'),dream:()=>buildPath('dream'),buke:()=>buildPath('buke')};
// a vertex-coloured material on geometry with no colours draws black; give such geometry plain white
function fixVC(o){const done=new Set();o.traverse(m=>{if(!m.isMesh||!m.geometry||done.has(m.geometry))return;const ms=Array.isArray(m.material)?m.material:[m.material];if(!ms.some(x=>x&&x.vertexColors))return;const g=m.geometry;done.add(g);if(g.attributes.color||!g.attributes.position)return;const n=g.attributes.position.count;g.setAttribute('color',new THREE.Float32BufferAttribute(new Float32Array(n*3).fill(1),3))})}
/* point lights: every world keeps exactly two real point lights that never come or go, and every frame hands them to the
   nearest of the world's own point lights that are showing; those only say where light should be. a change in how many
   lights a scene has makes every lit material build a new shader, so all worlds share one light layout (see lightRig) */
const LPOOL_K=2,_lw=V3();
/* which things cast and catch the near shadows: solid lit meshes; small ones cast (a town, a creature, a tree), the
   ground and big things only catch */
function shadowScan(sp){if(sp.type!=='planet'||!sp.sunL)return;sp.scene.traverse(o=>{if(!o.isMesh||o.userData.shd)return;o.userData.shd=1;const m=Array.isArray(o.material)?o.material[0]:o.material;
 if(!m||m.isShaderMaterial||m.transparent||m.alphaTest>0||!m.depthWrite||!(m.isMeshStandardMaterial||m.isMeshPhongMaterial||m.isMeshLambertMaterial))return;o.receiveShadow=true;if(o===sp.terr){o.castShadow=true;return}if(o.userData.noShadow)return;
 const g=o.geometry;if(!g)return;if(!g.boundingSphere)g.computeBoundingSphere();const sc=o.scale?Math.max(o.scale.x,o.scale.y,o.scale.z):1;if(g.boundingSphere.radius*sc<70)o.castShadow=true})}
/* instanced sets and point clouds: three.js tests them against the frustum with the bounds of ONE instance at the
   set's own origin (or the points as first laid out), so from close up, looking past that origin, a whole set
   vanished. they are drawn whenever they are visible instead */
function noStaleCull(sp){sp.scene.traverse(o=>{if((o.isInstancedMesh||o.isPoints)&&o.frustumCulled)o.frustumCulled=false})}
/* off a planet, zooming in on a world or a star could carry the camera inside it, where its surface faces away and
   it seemed to shrink and vanish: the camera stops just outside any solid body instead */
const _sv=V3();
window.__solidPush=sp=>{let L=sp._solids;if(L===undefined){L=sp._solids=[];for(const w of WIKI){if(mapOf(w)!==sp.id||!w.k||!SOLID[w.k])continue;const r=(w.kp&&w.kp.r)||sizeOf(w);if(r>4)L.push({w,r})}}
 if(!L.length)return;let moved=false;for(const s of L){if(s.w.e&&!s.w.e.includes(ERA))continue;const c=s.c||(s.c=posOf(s.w));_sv.copy(camera.position).sub(c);const d=_sv.length(),m=s.r*1.12;if(d<m){camera.position.copy(c).addScaledVector(d>1e-3?_sv.divideScalar(d):V3(0,1,0),m);moved=true}}
 if(moved)camera.lookAt(TG)};
/* one light layout for every world, so the shader programs made for one world serve the next: two directional lights,
   one hemisphere light, the two pooled point lights, and the same kind of fog (linear on the planets, exponential
   elsewhere; a world without fog gets exponential fog of density 0). only the planets' sun casts shadows, so planets
   share programs with planets and the other worlds with each other. missing lights are added dark */
function lightRig(sp){const sc=sp.scene;let nd=0,nh=0;sc.traverse(o=>{if(o.isDirectionalLight)nd++;else if(o.isHemisphereLight)nh++});
 for(;nd<2;nd++){const d=new THREE.DirectionalLight(0xffffff,0);d.userData.rig=1;sc.add(d)}
 if(!nh){const h=new THREE.HemisphereLight(0,0,0);h.userData.rig=1;sc.add(h)}
 if(!sc.fog&&sp.type!=='planet')sc.fog=new THREE.FogExp2(0,0)}
function poolScan(sp){const lp=sp._lp||(sp._lp={L:[],P:[],a:-1,t:0});lp.a=SG_ADDS;shadowScan(sp);noStaleCull(sp);
 sp.scene.traverse(o=>{if(!o.isPointLight||o.userData.pool||o.userData.pooled)return;o.userData.pooled=1;let v=o.visible;Object.defineProperty(o,'visible',{get(){return false},set(x){v=x},configurable:true});o.userData.vis=()=>v;lp.L.push(o)});
 if(!lp.P.length)for(let i=0;i<LPOOL_K;i++){const q=new THREE.PointLight(0xffffff,0,1);q.userData.pool=1;sp.scene.add(q);lp.P.push(q)}}
function poolStepBase(sp,now){const lp=sp._lp;if(!lp)return poolScan(sp);if(lp.a!==SG_ADDS&&now-lp.t>1500){lp.t=now;poolScan(sp)}if(!lp.P.length)return;
 const C=camera.position;const pick=[];for(const L of lp.L){if(!L.userData.vis()||!(L.intensity>0)||!L.parent)continue;let x=L.parent,ok=true;while(x){if(!x.visible){ok=false;break}if(!x.parent&&x!==sp.scene)ok=false;x=x.parent}if(!ok)continue;
  _lw.copy(L.position).applyMatrix4(L.parent.matrixWorld);const d=_lw.distanceTo(C);if(L.distance>0&&d>L.distance*6+400)continue;pick.push([d,L,_lw.x,_lw.y,_lw.z])}
 pick.sort((a,b)=>a[0]-b[0]);
 for(let i=0;i<lp.P.length;i++){const q=lp.P[i],e=pick[i];if(!e){q.intensity=0;continue}const L=e[1];q.position.set(e[2],e[3],e[4]);q.color.copy(L.color);q.intensity=L.intensity;q.distance=L.distance;q.decay=L.decay}}
/* a world, built on first use. after the build: a planet's finer near ground (q2_setup, not on 虚民母球's plating), its
   per-frame light and air (q3_step), every world's softer surfaces (q4b_frame), the eggs hung on it; the build is timed
   for the profiler and a world let go to save memory gets its remembered spot back */
function getSpace(id){if(SP[id])return SP[id];
 const sp=q5s_span('build:'+id,()=>{const sp=BUILDERS[id]();lightRig(sp);envAll(sp.scene);fixVC(sp.scene);poolScan(sp);if(sp.type==='planet')applyPlanetEra(sp,clampEra(sp,ERA));if(CUR&&CUR!==sp&&CUR.type==='planet')BSP=CUR;
  if(sp.type==='planet'&&sp.terr&&!Q2_NOPATCH.has(id))try{q2_setup(sp)}catch(e){console.warn('q2',id,e)}
  if(sp.type==='planet')anim(sp,null,()=>q3_step(sp));
  anim(sp,null,()=>q4b_frame(sp));
  return sp});
 sp.scene.__q5id=id;sp.__q5t=q5s_now();if(q5s_saved[id]&&!sp.saved)sp.saved=q5s_saved[id];
 try{egz_built(sp)}catch(e){console.warn('eggs',id,e)}
 return sp}
function clampEra(sp,e){const L=MB[sp.id].e;if(L.includes(e))return e;return L.reduce((a,b)=>Math.abs(b-e)<Math.abs(a-e)?b:a)}
/* where to stand when arriving in a space */
const HOME={rongqiu:{a:18,b:-25,alt:2600},ximin:{a:22,b:0,alt:2600},erxi:{a:34,b:-10,alt:2600},under:{a:820,b:0,alt:400,y:0}};
function homeFor(sp,e){const asp=innerWidth/innerHeight;{const EL=eraListFor(sp);if(EL&&EL.length&&!EL.includes(e))e=EL[0]}if(HOME[sp.id]){const h=Object.assign({head:0,y:0},HOME[sp.id]);if(asp<1)h.alt=Math.min(4800,h.alt*Math.min(1.75,1.1/asp));return h}
 if(sp.id==='void'){const c=e===10&&false?NG_C:(SECTORS[e]||SECTORS[6]).c;return{a:-c[2],b:c[0],alt:2400,head:0,y:0}}
 const L0=WIKI.filter(w=>mapOf(w)===sp.id&&w.e.includes(e)),L1=L0.filter(w=>w.e[0]===e);const L=L1.length?L1:L0;const src=L.length?L:WIKI.filter(w=>mapOf(w)===sp.id);
 if(sp.type==='tube'){const z=Math.min(...src.map(w=>w.z));return{a:Math.max(sp.zr[0],z-200),b:0,alt:420,head:0,y:0}}
 const c=src.map(posOf).reduce((s,p)=>s.add(p),V3(0,0,0)).multiplyScalar(1/src.length);return{a:-c.z,b:c.x,alt:1500,head:0,y:clamp(c.y,-200,200)}}

/* a lived-in world: on its night side the towns and roads glow warm, clustered, never on the sea */
function nightLights(sp,col,N,seed){const Rn=rnd(seed),G=sp.G;if(!G)return;const P=[],S=[],cand=[];for(let k=0;k<G.n;k++){const h=G.H[k];if(h>1.5&&h<60)cand.push(k)}if(!cand.length)return;
 const hubs=[];for(let i=0;i<90;i++)hubs.push(cand[(Rn()*cand.length)|0]);
 for(let i=0;i<N;i++){const k=hubs[(Math.pow(Rn(),1.6)*hubs.length)|0];const sp2=.012+Rn()*Rn()*.05;const d=V3(G.P[k*3]+(Rn()-.5)*sp2,G.P[k*3+1]+(Rn()-.5)*sp2,G.P[k*3+2]+(Rn()-.5)*sp2).normalize();const ll=llDir(d);const h=sp.ghRaw?sp.ghRaw(ll[0],ll[1]):sp.gh(ll[0],ll[1]);if(h<1)continue;
  const p=d.multiplyScalar(R+h+1.2);P.push(p.x,p.y,p.z);S.push(.5+Rn()*Rn()*2.5)}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('sz',new THREE.Float32BufferAttribute(S,1));
 const m=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{uS:PSCALE,uSun:{value:sp.sunDir},uT:GT,uC:{value:C(col)}},
  vertexShader:`uniform float uS,uT;uniform vec3 uSun;attribute float sz;varying float vA;
   void main(){vec3 n=normalize(position);vec4 mv=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mv;float d=-mv.z;
    vA=smoothstep(.04,-.16,dot(n,uSun))*(.8+.2*sin(uT*.7+position.x*.3));gl_PointSize=clamp(uS*sz*2.2/d,1.,6.)+clamp(uS*sz*.004,0.,1.2);}`,
  fragmentShader:'uniform vec3 uC;varying float vA;void main(){vec2 c=gl_PointCoord-.5;float a=smoothstep(.5,.0,length(c));gl_FragColor=vec4(uC*a*vA*1.4,1.);}'});
 const pts=new THREE.Points(g,m);pts.frustumCulled=false;pts.renderOrder=3;sp.scene.add(pts);sp._lights=P.length/3;
 // up close at night: traffic — little lights that run back and forth on the roads between neighbouring towns
 {const A=[],B=[],F=[];const hp=hubs.map(k=>V3(G.P[k*3],G.P[k*3+1],G.P[k*3+2]));for(let i=0;i<hp.length;i++){let bj=-1,bd=1;for(let j=0;j<hp.length;j++){if(j===i)continue;const d=hp[i].distanceTo(hp[j]);if(d<bd&&d>.004){bd=d;bj=j}}if(bj<0||bd>.09)continue;
   const a=hp[i],b=hp[bj];const la=llDir(a),lb=llDir(b);const ha=Math.max(1,sp.gh(la[0],la[1])),hb=Math.max(1,sp.gh(lb[0],lb[1]));
   for(let k=0;k<26;k++){const dir=k%2;A.push(...(dir?[b.x,b.y,b.z,hb]:[a.x,a.y,a.z,ha]));B.push(...(dir?[a.x,a.y,a.z,ha]:[b.x,b.y,b.z,hb]));F.push(Rn())}}
  if(F.length){const g2=new THREE.BufferGeometry();const n=F.length;const pa=new Float32Array(n*3);g2.setAttribute('position',new THREE.BufferAttribute(pa,3));g2.setAttribute('aA',new THREE.Float32BufferAttribute(A,4));g2.setAttribute('aB',new THREE.Float32BufferAttribute(B,4));g2.setAttribute('ph',new THREE.Float32BufferAttribute(F,1));
   const m2=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{uS:PSCALE,uSun:{value:sp.sunDir},uT:GT,uC:{value:C(col)}},
    vertexShader:`uniform float uS,uT;uniform vec3 uSun;attribute vec4 aA,aB;attribute float ph;varying float vA;
     void main(){float f=fract(ph+uT*.02*(.6+ph));vec3 d=normalize(mix(aA.xyz,aB.xyz,f));float h=mix(aA.w,aB.w,f)+1.6;vec3 p=d*(${R}.+h);vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;float dd=-mv.z;
      vA=smoothstep(.04,-.16,dot(d,uSun))*(1.-smoothstep(260.,700.,dd));gl_PointSize=clamp(uS*2.2/dd,1.,4.);}`,
    fragmentShader:'uniform vec3 uC;varying float vA;void main(){vec2 c=gl_PointCoord-.5;float a=smoothstep(.5,.0,length(c));gl_FragColor=vec4(mix(uC,vec3(1.),.4)*a*vA*1.6,1.);}'});
   const tr=new THREE.Points(g2,m2);tr.frustumCulled=false;tr.renderOrder=3;sp.scene.add(tr);sp._traffic=n}}}

/* ================================================================
   深海之城: the 虚民 city in glass tubes on the deep sea floor
   ================================================================ */
/* ---------- 深海之城 (虚民): the city lives inside transparent tubes on the deep sea floor, walls of pressure glass, with
   traffic running through them and the buildings standing inside ---------- */
function fxG_tubeNet(g,nodes,links,R0,o){o=o||{};const glass=new THREE.MeshStandardMaterial({color:'#bfe8f4',transparent:true,opacity:.3,roughness:.05,metalness:.3,depthWrite:false,side:THREE.DoubleSide});
 const rib=M('#8a9aa4',{metalness:.7,roughness:.3});const tm=towerMat({metalness:.4,roughness:.35,win:'#ffe8b0'});const cars=[];const Y=V3(0,1,0);
 for(const [a,b] of links){const A=nodes[a],B=nodes[b];const d=B.clone().sub(A),L=d.length();const t=new THREE.Mesh(new THREE.CylinderGeometry(R0,R0,L,16,1,true),glass);t.position.copy(A).addScaledVector(d,.5);t.quaternion.setFromUnitVectors(Y,d.clone().normalize());t.renderOrder=2;g.add(t);
  for(let k=1;k<L/(R0*2.4);k++){const r=new THREE.Mesh(new THREE.TorusGeometry(R0*1.02,R0*.06,4,16),rib);r.position.copy(A).addScaledVector(d,k*R0*2.4/L);r.quaternion.setFromUnitVectors(V3(0,0,1),d.clone().normalize());g.add(r)}
  for(let k=0;k<2;k++){const c=new THREE.Mesh(new THREE.SphereGeometry(R0*.28,8,6),GL(k?'#ffd890':'#9ad8ff',.95));c.scale.set(1,.6,1);g.add(c);cars.push({c,A,B,ph:Math.random(),s:(k?1:-1)*(.08+Math.random()*.06)})}}
 for(let i=0;i<nodes.length;i++){const N=nodes[i];const s=R0*(o.hub||2.6);const d=new THREE.Mesh(new THREE.SphereGeometry(s,20,12),glass);d.position.copy(N);d.renderOrder=2;g.add(d);
  for(let j=0;j<6;j++){const b=new THREE.Mesh(mergeColored([[new THREE.BoxGeometry(1,1,1).translate(0,.5,0),'#c8d0d8']]),tm);const a=j/6*6.283+i;b.scale.set(s*.22,s*(.4+h3(i,j,3)*.9),s*.22);b.position.set(N.x+Math.cos(a)*s*.45,N.y-s*.55,N.z+Math.sin(a)*s*.45);g.add(b)}
  const fl=new THREE.Mesh(new THREE.CircleGeometry(s*.86,20),M('#5a6268'));fl.rotation.x=-Math.PI/2;fl.position.set(N.x,N.y-s*.55,N.z);g.add(fl)}
 g.userData.towerMat=tm;return t=>cars.forEach(x=>{const u=((x.ph+t*x.s)%1+1)%1;x.c.position.copy(x.A).lerp(x.B,u)})}
function fxG_deepCity(){const g=new THREE.Group();const N=[V3(0,1.4,0),V3(3.4,1.2,1.2),V3(-3,1.3,1.8),V3(.6,1.2,-3.4),V3(-2.6,1.4,-2.6),V3(3.6,1.6,-2.4)];
 const an=fxG_tubeNet(g,N,[[0,1],[0,2],[0,3],[0,4],[3,5],[1,5],[2,4]],.32,{hub:2.6}); g.userData.anim=an;return g}
function fxG_deepNet(sp){const g=new THREE.Group();const C0=[2,152];const N=[],L=[];const Rn=rnd(3210);const up=dirLL(...C0);
 for(let i=0;i<14;i++){const a=Rn()*6.283,d=i?.4+Rn()*2:0;const la=C0[0]+Math.cos(a)*d,lo=C0[1]+Math.sin(a)*d;const h=sp.ghRaw(la,lo);N.push(dirLL(la,lo).multiplyScalar(R+h+3.2))}
 for(let i=1;i<N.length;i++){let best=0,bd=1e9;for(let j=0;j<i;j++){const dd=N[i].distanceTo(N[j]);if(dd<bd){bd=dd;best=j}}L.push([i,best])}L.push([3,9],[5,12]);
 const an=fxG_tubeNet(g,N,L,1.1,{hub:3.2});addE(g,[7]);cull(g,up.clone().multiplyScalar(R-20),70,1800);anim(sp,g,an);if(g.userData.towerMat)sp.towerMats=(sp.towerMats||[]).concat([g.userData.towerMat])}

/* ---------- 8 · 虚民母球: a metal planet, not a glossy patchwork; its one green oasis has grass and mixed trees ---------- */

function makePlanet(id,cfg){if(id==='ximin')Object.assign(cfg,{rough:.68,metal:.1,plate:1,atm:'#8a9aaa',atmK:.5,mott:.6,hemiSky:0xc0ccd8});
 const sp=makePlanetBase(id,cfg);
 if(id==='ximin')makeCover(sp,q4a_ximinBiome);
 return sp}
function q4a_ximinBiome(d,h,lat,e,W){const oa=angDeg(d,XOAS);if(oa>4.6||h<2.2)return;const k=1-sm(3.4,4.6,oa);W.tuft=.55*k;W.tuftC='#ffffff';W.flower=.05*k;W.flowerC=['#f4e6a0','#ffffff','#e9a0c0'][(h*7|0)%3];W.rock=.03;if(n3(d.x*40,d.y*40,d.z*40)>.62){W.fern=.25*k}}
/* the ground colour: soft grey districts instead of hard-edged cells, dark seams of the old streets, the oasis blending out over its rim */
function ximinC(p,h,lat,out){if(h<0){out.set('#163a4a').lerp(C('#071a26'),sm(-2,-40,h));return}if(h<2.2){out.set('#8a8a84');return}
 const oa=angDeg(p,XOAS);if(oa<4.6){const k=1-sm(3.3,4.6,oa);const g=C('#5f8a48').lerp(C('#3f7a40'),n3(p.x*40,p.y*40,p.z*40)).lerp(C('#8a8a5a'),sm(.55,.8,n3(p.x*22+3,p.y*22,p.z*22))*.5);
  out.set('#6a6e70').lerp(C('#848a8c'),n3(p.x*50,p.y*50,p.z*50)*.5).lerp(g,k);return}
 const[la,lo]=llDir(p);const cell2=h3(Math.floor((la+90)/2.2),Math.floor((lo+180)/2.2),5);
 const dist=n3(p.x*2.3+9,p.y*2.3,p.z*2.3),dist2=n3(p.x*5.1,p.y*5.1+2,p.z*5.1);
 out.set('#5f6870').lerp(C('#848e96'),n3(p.x*50,p.y*50,p.z*50)*.5).lerp(C('#767472'),sm(.35,.7,dist)*.4).lerp(C('#4e565e'),sm(.6,.85,dist2)*.4)
  .lerp(C('#a2a6aa'),cell2>.84?.25:0).lerp(C('#3a3e44'),cell2<.1?.3:0).lerp(C('#7a7466'),sm(.55,.8,n3(p.x*7,p.y*7,p.z*7))*.25);
 if(angDeg(p,XCOR)<4)out.lerp(C('#141418'),1-sm(2,4,angDeg(p,XCOR)))}
/* the plating: panels in a grid on every face, dark seams between them, each panel its own shade, rust in the hollows */

function q2_planetMat(m,o){o=o||{};const plate=!!(o.plate||(BSP&&BSP.cfg&&BSP.cfg.plate));const r=q2_planetMatBase(m,o);if(!plate)return r;
 const ob=r.onBeforeCompile,ck=r.customProgramCacheKey;
 r.onBeforeCompile=sh=>{ob(sh);sh.fragmentShader=sh.fragmentShader.replace(' diffuseColor.rgb=col;',`
 {float pk=(1.-rk)*(1.-q2sn)*land*(1.-veg)*(1.-sand);
  vec3 pp=vOP*.21;vec3 fp=fract(pp);vec3 cp=floor(pp);float fwp=length(fwidth(vOP))*.21;float swd=max(.035,fwp*1.6);
  vec3 ln=1.-smoothstep(vec3(0.),vec3(swd),min(fp,1.-fp));
  float seam=q2w.x*max(ln.y,ln.z)+q2w.y*max(ln.x,ln.z)+q2w.z*max(ln.x,ln.y);seam*=1.-smoothstep(.1,.3,fwp);
  float hsh=fract(sin(dot(cp,vec3(12.9898,78.233,37.719)))*43758.5453);
  vec3 pc=col*(.86+.26*hsh)*(.9+.2*vn3(vOP*.035));
  pc=mix(pc,pc*vec3(1.1,.88,.7),smoothstep(.62,.86,q2M.a)*.45*(1.-smoothstep(0.,.25,fwp)));
  pc*=1.-seam*.4;col=mix(col,pc,pk*.9);}
 diffuseColor.rgb=col;`)};
 r.customProgramCacheKey=()=>ck()+'p';return r}
