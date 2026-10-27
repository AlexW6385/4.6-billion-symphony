/* ================================================================
   the worlds of 始境 (age 8), built from one template: a config gives the ground's shape and colours, the sea, the air,
   the sky and a few set pieces; the entries that live there carry m:<world> and ll, and are placed like on any planet.
   镜世界: a mirror-crystal planet with silver swamps, ringed far out by the disc platforms of the peak species.
   表世界: glossy crystal under white-and-pink fog, pink mercury swamps, cities of solid crystal.
   弃世界: cracked crystal and junk hills under a dark-red sky; it keeps one face to its sun, so one side is always day.
   ================================================================ */
const W3={
 jing:{home:{a:12,b:20,alt:2600},
  height:p=>{const n=fbm(p.x*3.2+11,p.y*3.2,p.z*3.2,5),r=1-Math.abs(fbm(p.x*5.5+3,p.y*5.5,p.z*5.5,4)*2-1);
   const sw=fbm(p.x*2.1+40,p.y*2.1,p.z*2.1,3);if(sw<.36)return -3-(.36-sw)*30;return 2.5+(n-.5)*7+Math.pow(r,5)*20},
  col:(p,h,lat,o)=>{if(h<0){o.set('#b8c0c8');return}if(h<1.6){o.set('#cfd6dc');return}
   o.set('#b8d4e6').lerp(C('#8ab4d4'),n3(p.x*9,p.y*9,p.z*9)*.7);if(h>8)o.lerp(C('#6a9cc8'),sm(8,22,h));o.lerp(C('#e8f6ff'),sm(.66,.82,n3(p.x*30,p.y*30,p.z*30))*.45)},
  ocean:{deep:'#8a96a2',shal:'#e0e8f0'},atm:'#8ac4ff',atmK:.6,clouds:{cov:.18},rough:.22,metal:.45,bump:.4,rock:'#a8c8dc',
  sky:{zen:'#3a70c0',hor:'#a8cce8',set:'#f0c8a0'},envTop:'#cfe8ff',envMid:'#e8f4fa',envBot:'#8aa0b0',
  crystals:{n:900,col:'#d8f0ff',em:'#5ab0e0'}},
 biao:{home:{a:-10,b:40,alt:2600},
  height:p=>{const n=fbm(p.x*2.6+7,p.y*2.6,p.z*2.6,5),sw=fbm(p.x*1.8+20,p.y*1.8,p.z*1.8,3);if(sw<.38)return -2-(.38-sw)*20;
   const r=1-Math.abs(fbm(p.x*4.2,p.y*4.2+5,p.z*4.2,4)*2-1);return 2+(n-.5)*14+Math.pow(r,5)*30},
  col:(p,h,lat,o)=>{if(h<0){o.set('#d8a8c0');return}if(h<1.6){o.set('#e8d4dc');return}
   o.set('#f2eef4').lerp(C('#d8c8e8'),n3(p.x*8,p.y*8,p.z*8)*.7);if(h>10)o.lerp(C('#c8b8e0'),sm(10,34,h));o.lerp(C('#ffffff'),sm(.6,.8,n3(p.x*26,p.y*26,p.z*26))*.6)},
  ocean:{deep:'#b86a90',shal:'#f0b8d4'},atm:'#ffd6ea',clouds:{cov:.66,col:'#ffe4f0'},rough:.18,metal:.4,bump:.4,rock:'#d8c8e8',
  sky:{zen:'#c890b8',hor:'#ffe8f2',set:'#ffb8c8'},envTop:'#ffe0f0',envMid:'#fff0f6',envBot:'#a88a98',hemiSky:0xffd8ea,
  crystals:{n:700,col:'#f8eaff',em:'#c890e0'},cities:[[-8,46,4],[6,28,3],[-20,60,3],[14,52,2.4]]},
 qishi:{home:{a:4,b:-60,alt:2600},sunLon:-90,dayLen:1e12,
  height:p=>{const n=fbm(p.x*3+5,p.y*3,p.z*3,5),k=fbm(p.x*14,p.y*14+3,p.z*14,3),pl=fbm(p.x*6+9,p.y*6,p.z*6,3);if(pl<.3)return -1.5-(.3-pl)*10;
   return 2+(n-.5)*16+Math.pow(k,3)*22},
  col:(p,h,lat,o)=>{if(h<0){o.set('#4a3a40');return}
   o.set('#6a3e38').lerp(C('#4a2a28'),n3(p.x*10,p.y*10,p.z*10)*.7);o.lerp(C('#8a6a58'),sm(.6,.8,n3(p.x*22+4,p.y*22,p.z*22))*.6);if(h>14)o.lerp(C('#3a2624'),sm(14,30,h)*.6)},
  ocean:{deep:'#3a2a40',shal:'#8a4a6a'},atm:'#ff6a4a',atmK:1.3,clouds:{cov:.55,col:'#e8a090'},rough:.85,metal:.1,rock:'#5a3a34',
  sky:{zen:'#5a1e1a',hor:'#d06a50',set:'#ff8a50',nightZ:'#0a0204',nightH:'#2a0a08'},envTop:'#a04a38',envMid:'#c87a60',envBot:'#3a2420',hemiSky:0xff9a80,sunI:.9,
  junk:{n:5200}}};
function buildW3(id){const c=W3[id];
 const sp=makePlanet(id,{height:c.height,colors:oneSet(c.col),ocean:c.ocean,atm:c.atm,atmK:c.atmK,clouds:c.clouds,rough:c.rough,metal:c.metal,bump:c.bump,rock:c.rock,sky:c.sky,
  envTop:c.envTop,envMid:c.envMid,envBot:c.envBot,hemiSky:c.hemiSky,sunI:c.sunI,sunLon:c.sunLon,dayLen:c.dayLen});BSP=sp;const gh=sp.gh,Rn=rnd(hashStr(id));
 // crystal outcrops over the land: one instanced draw
 if(c.crystals){const geo=new THREE.OctahedronGeometry(1,0);geo.translate(0,.7,0);
  inst(geo,new THREE.MeshStandardMaterial({color:c.crystals.col,emissive:c.crystals.em,emissiveIntensity:.25,roughness:.12,metalness:.3,flatShading:true}),
   w3Scatter(sp,c.crystals.n,hashStr(id)+1,(la,lo,h)=>h>2.2),(o,p)=>{frameLL(sp,p[0],p[1],-.4,p[3]*6,o);o.rotation.x+=(p[3]-.5)*.5;const s=1+p[3]*p[3]*5;o.scale.set(s*.5,s*(1.4+p[3]*2),s*.5)},null,{far:2600})}
 // cities of solid crystal: clusters of tall prisms
 if(c.cities){const geo=new THREE.CylinderGeometry(.7,1,1,6);geo.translate(0,.5,0);const m=towerMat({metalness:.35,roughness:.15,win:'#fff0fa'});m.color.set('#f4ecfa');sp.towerMats=(sp.towerMats||[]).concat([m]);
  c.cities.forEach(([la,lo,r],k)=>inst(geo,m,scatter(140,la,lo,r,hashStr(id)+20+k,(a,b,h)=>h>1.8),(o,p)=>{frameLL(sp,p[0],p[1],-.3,p[3]*6,o);const h=3+Math.pow(1-p[3],3)*30;o.scale.set(1.2+p[3],h,1.2+p[3])},null,{far:3000}))}
 // junk: broken shapes heaped into hills
 if(c.junk){const parts=[new THREE.BoxGeometry(1,1,1),new THREE.CylinderGeometry(.5,.5,1.4,6),new THREE.OctahedronGeometry(.8,0),new THREE.TorusGeometry(.6,.2,5,10)];
  const cols=['#7a6a62','#5a5048','#8a5a48','#6a6a70'];parts.forEach((g,k)=>inst(g,new THREE.MeshStandardMaterial({color:cols[k],roughness:.8,metalness:.4,flatShading:true}),
   w3Scatter(sp,c.junk.n/parts.length|0,hashStr(id)+40+k,(la,lo,h)=>h>2&&n3(la*.25,lo*.25,1)>.4),(o,p)=>{frameLL(sp,p[0],p[1],p[3]*1.5,p[3]*6,o);o.rotation.set(p[3]*3,p[3]*5,p[3]*2);o.scale.setScalar(1.5+p[3]*p[3]*6)},null,{far:2400}))}
 if(id==='jing')jingRing(sp);
 if(sp.extra0)sp.extra0();
 entryKits(sp);entryModels(sp);placeMotes(sp);
 REGIONS.filter(r=>r.m===id&&r.rad).forEach(r=>sp.labels.push({n:r.n,id:null,pos:dirLL(...r.ll).multiplyScalar(R+70),minAlt:1500}));
 return sp}
/* points spread evenly over the whole globe, [lat,lon,h,rand] like scatter() */
function w3Scatter(sp,n,seed,test){const Rn=rnd(seed),out=[];let k=0;while(out.length<n&&k<n*12){k++;const la=Math.asin(Rn()*2-1)/D2R,lo=Rn()*360-180,h=sp.gh(la,lo);if(!test||test(la,lo,h))out.push([la,lo,h,Rn()])}return out}
/* the ring of the peak species: thousands of disc platforms far out round 镜世界 (made from its broken moon), one instanced draw,
   turning slowly; entries with `orb` stand on it */
function jingRing(sp){const Rn=rnd(808),N=900,im=new THREE.InstancedMesh(new THREE.CylinderGeometry(1,1,.08,20),new THREE.MeshStandardMaterial({color:'#c8d4dc',metalness:.6,roughness:.35}),N);
 const o=new THREE.Object3D();for(let i=0;i<N;i++){const a=Rn()*6.2832,r=R*(1.7+Rn()*.45);o.position.set(Math.cos(a)*r,(Rn()-.5)*R*.05,Math.sin(a)*r);o.rotation.set((Rn()-.5)*.2,Rn()*6,(Rn()-.5)*.2);o.scale.setScalar(8+Rn()*Rn()*40);o.updateMatrix();im.setMatrixAt(i,o.matrix)}
 im.frustumCulled=false;im.userData.noShadow=1;const g=new THREE.Group();g.rotation.x=.18;g.add(im);sp.scene.add(g);sp.ring=g;
 WIKI.filter(w=>w.m===sp.id&&w.orb!==undefined).forEach(w=>{const a=w.orb*D2R,r=R*1.85,p=V3(Math.cos(a)*r,30,Math.sin(a)*r);const s=makeShape(w,sp,false);s.position.copy(p);g.add(s);
  g.updateMatrixWorld(true);const wp=s.getWorldPosition(V3());s.userData.pick=w.id;px(w.id,wp,Math.max(30,(w.kp&&(w.kp.r||w.kp.s))||30))});
 anim(sp,g,(t,dt)=>{g.rotation.y+=dt*.004})}
/* entries of a new world that only have a void-style kit shape get a planet body made from it, scaled to stand on the ground */
function entryKits(sp){WIKI.filter(w=>w.m===sp.id&&w.ll&&!ENT[w.id]&&w.k&&w.k!=='none'&&w.k!=='planet').forEach(w=>{
 ENT[w.id]=[()=>{const g=makeShape(w,sp,false);const b=new THREE.Box3().setFromObject(g),sz=b.getSize(V3());const k=1/Math.max(1e-3,Math.max(sz.x,sz.y,sz.z));g.scale.multiplyScalar(k);
  const w0=new THREE.Group();g.position.y=-b.min.y*k;w0.add(g);return w0},(w.kp&&w.kp.big)||4,{alt:w.alt||0}]})}
BUILDERS.jing=()=>buildW3('jing');BUILDERS.biao=()=>buildW3('biao');BUILDERS.qishi=()=>buildW3('qishi');
Object.assign(HOME,{jing:W3.jing.home,biao:W3.biao.home,qishi:W3.qishi.home});
