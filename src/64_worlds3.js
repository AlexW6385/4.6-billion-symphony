/* ================================================================
   planet worlds built from one template: a config gives the ground's shape and colours, the sea, the air, the sky and a few
   set pieces; the entries that live there carry m:<world> and ll, and are placed like on any planet. 熔毁地带, 末日空间
   and 凤凰的恒星; after them, the one road world built here, 唯一之桥.
   ================================================================ */
const W3={
 rongui:{home:{a:10,b:30,alt:2600},
  height:p=>{const n=fbm(p.x*2.8+3,p.y*2.8,p.z*2.8,5),cr=Math.abs(fbm(p.x*7+1,p.y*7,p.z*7,4)*2-1);if(n<.34)return -2-(.34-n)*14;return 2+(n-.5)*30+(cr<.05?-3:0)},
  col:(p,h,lat,o)=>{if(h<0){o.set('#ff7a20');return}const cr=Math.abs(fbm(p.x*7+1,p.y*7,p.z*7,4)*2-1);
   o.set('#2a2422').lerp(C('#3a3230'),n3(p.x*12,p.y*12,p.z*12));if(cr<.06)o.lerp(C('#ff6a1a'),sm(.06,0,cr));o.lerp(C('#5a3a2a'),sm(.6,.8,n3(p.x*30,p.y*30,p.z*30))*.4);if(h<2.5)o.lerp(C('#a0401a'),.5)},
  ocean:{deep:'#ff5a10',shal:'#ffb040'},atm:'#ff8a50',atmK:1.1,clouds:{cov:.45,col:'#8a7a70'},rough:.9,metal:.05,rock:'#2a2422',
  sky:{zen:'#4a2a20',hor:'#c8704a',set:'#ff8a40',nightZ:'#0a0404',nightH:'#3a120a'},envTop:'#8a4a30',envMid:'#b8704a',envBot:'#2a1a14',hemiSky:0xff9a70,sunI:.95,
  props:[{geo:'cyl',n:70,col:'#ff8a30',em:'#ff5a10',ei:1.2,pulse:1.1,scale:[2,5],stretch:[1,14,1],test:(la,lo,h)=>h<6},
   {geo:'lump',n:400,col:'#1e1a18',scale:[2,8],stretch:[1,.8,1]}],
  belt:{n:420,r:[1.25,1.6],s:[10,60],col:'#a8322a',em:'#3a0a06',thick:.12,rough:.8,tilt:.3}},
 // 琥珀之球 (age 11): an orange-red see-through twin of the pain bus, ringed low by floating orange islands with the ambers' cities
 doom:{home:{a:40,b:0,alt:2600},sunLon:30,
  height:p=>{const S=doomSec(p),n=fbm(p.x*4+S.k,p.y*4,p.z*4,5);if(S.wall)return 46;if(S.core)return 4+(n-.5)*6;
   switch(S.k){case 0:return 3+(n-.5)*16;case 1:return 3+(n-.5)*10;case 2:return 6+(n-.5)*28;case 3:return -8+(n-.5)*14;case 4:return 3+(n-.5)*12;
    case 5:return n<.42?-2:2+(n-.5)*22;case 6:return 3+(n-.5)*8;case 7:return Math.abs(n-.5)<.03?-1:2+(n-.5)*8;default:return 3+(n-.5)*14}},
  col:(p,h,lat,o)=>{const S=doomSec(p),v=n3(p.x*14,p.y*14,p.z*14);if(S.wall){o.set('#c8ccd8');return}if(S.core){o.set('#6a9a4a').lerp(C('#8aa860'),v*.6);return}if(h<0){o.set('#2a4a6a');return}
   o.set(['#d8b870','#7a7468','#e8f2f8','#3a6a8a','#4a4642','#3a7a3a','#e8a8d0','#b8202a','#6a6a80','#7a6a8a'][S.k]);
   if(S.k===6)o.lerp(C(['#a8e0f8','#f8e8a0','#c8f0c0','#ffffff'][(n3(p.x*6,p.y*6,p.z*6)*4|0)%4]),.6);else o.offsetHSL(0,0,(v-.5)*.12);if(S.k===7&&v>.6)o.lerp(C('#3a2a20'),.5)},
  ocean:{deep:'#1a3a5a',shal:'#3a7aa0'},atm:'#a8c0ff',atmK:.5,clouds:false,rough:.8,
  sky:{zen:'#3a5aa0',hor:'#b8c8e0',set:'#e8a070'},
  props:[{geo:'box',n:160,col:'#b85a3a',scale:[1,2.4],stretch:[1,1.2,1],test:(la,lo)=>la>66},
   {geo:'box',n:220,col:'#8a8478',scale:[1.5,5],stretch:[1,4,1],test:(la,lo)=>doomSecLL(la,lo)===1},
   {geo:'box',n:60,col:'#c8ccd0',scale:[2,4],stretch:[1,8,1],minH:-99,test:(la,lo)=>doomSecLL(la,lo)===3},
   {geo:'box',n:90,col:'#b89a60',scale:[1.5,4],stretch:[1,2,1],test:(la,lo)=>doomSecLL(la,lo)===0},
   {geo:'sphere',n:260,col:'#ff3a3a',em:'#a0101a',ei:.4,scale:[.4,1],test:(la,lo)=>doomSecLL(la,lo)===7},
   {geo:'sphere',n:200,col:'#ffd0f0',em:'#ff90d0',ei:.3,scale:[.8,2.2],test:(la,lo)=>doomSecLL(la,lo)===6},
   {geo:'lump',n:220,col:'#f4f8fc',rough:.2,scale:[1.5,6],stretch:[.6,2.2,.6],test:(la,lo)=>doomSecLL(la,lo)===2},
   {geo:'cyl',n:360,col:'#2a6a2a',scale:[.6,1.4],stretch:[1,7,1],test:(la,lo)=>doomSecLL(la,lo)===5},
   {geo:'sphere',n:70,col:'#7a6aa0',em:'#4a2a8a',ei:.4,metal:.5,rough:.3,flat:1,scale:[2,6],test:(la,lo)=>{const k=doomSecLL(la,lo);return k===8||k===9}}],
  fog:{n:5,col:'#3a3634',test:(la,lo)=>doomSecLL(la,lo)===4}}};
/* 凤凰的恒星 (age 10): a star almost wholly covered by a shell of kilometre platforms, each with its own gravity; the star's light
   leaks up through the gaps between them. Square cells on the globe give the platforms, a level each; the gaps are the star */
W3.phoenix={home:{a:16,b:20,alt:2600},sunLon:0,dayLen:1e12,sunI:.5,N:300,
 // the platforms stand a little apart in level (a few metres, not storeys: taller steps melted into pillows at the ground's
 // resolution and hid what stands on them); the denser ground keeps the gaps between them crisp
 height:p=>{const c=phCell(p);if(c.gap)return -6;return 4+c.lv*1.6},
 col:(p,h,lat,o)=>{if(h<0){o.set('#ffb030');return}const c=phCell(p);o.set(['#c8c0b8','#a8b0c0','#d8c8a8','#b8c8d0','#e0d0c0','#9aa0a8'][c.t]);o.offsetHSL(0,0,(n3(p.x*40,p.y*40,p.z*40)-.5)*.08)},
 ocean:{deep:'#ffd060',shal:'#fff0b0'},atm:'#ffb040',atmK:.9,clouds:false,rough:.5,metal:.4,bump:.3,rock:'#a8a098',
 sky:{zen:'#120806',hor:'#5a2a10',set:'#ff9030',nightZ:'#120806',nightH:'#5a2a10'},envTop:'#ffb060',envMid:'#806050',envBot:'#ffd080',hemiSky:0xffc070,hemiGnd:0xffa030,
 props:[{geo:'sphere',n:500,col:'#ffe070',em:'#ffb020',ei:1.2,pulse:1.4,scale:[.6,1.6],alt:[1,30],minH:-99,sea:1,far:2400}],
 belt:{n:600,disc:1,r:[1.35,1.4],s:[20,40],col:'#ffd890',metal:.3,rough:.4,thick:.004,tilt:.12}};
/* the platform cells of the phoenix star: a 3D grid cut on the sphere, each cell a level and a kind, a gap round its edge */
function phCell(p){const k=12,x=p.x*k,y=p.y*k,z=p.z*k,ix=Math.floor(x),iy=Math.floor(y),iz=Math.floor(z),fx=x-ix,fy=y-iy,fz=z-iz;
 const q=Math.sin(ix*127.1+iy*311.7+iz*74.7)*43758.5,h=q-Math.floor(q);const e=.11;const ax=Math.abs(p.x),ay=Math.abs(p.y),az=Math.abs(p.z);
 const gap=(ax<ay||ax<az?(fx<e||fx>1-e):0)||(ay<ax||ay<az?(fy<e||fy>1-e):0)||(az<ax||az<ay?(fz<e||fz>1-e):0);return{gap,lv:Math.floor(h*4),t:Math.floor(h*97)%6}}
/* which end-world of the moon a ground point is in: the core round the north pole, then ten wedges by longitude, walls between */
const DOOM_CORE=64;
function doomSec(p){const la=Math.asin(clamp(p.y,-1,1))/D2R;if(la>DOOM_CORE+2)return{core:1,k:-1};const lo=Math.atan2(p.x,p.z)/D2R+180,k=Math.min(9,Math.floor(lo/36)),e=lo-k*36;
 return{k,wall:la<DOOM_CORE+2&&(e<.7||e>35.3||Math.abs(la-DOOM_CORE)<.7)}}
function doomSecLL(la,lo){if(la>DOOM_CORE+2)return -1;const L=((lo+180)%360+360)%360;return Math.min(9,Math.floor(L/36))}
function buildW3(id){const c=W3[id];
 const sp=makePlanet(id,{N:c.N,height:c.height,colors:oneSet(c.col),ocean:c.ocean,atm:c.atm,atmK:c.atmK,clouds:c.clouds,rough:c.rough,metal:c.metal,bump:c.bump,rock:c.rock,sky:c.sky,
  envTop:c.envTop,envMid:c.envMid,envBot:c.envBot,hemiSky:c.hemiSky,sunI:c.sunI,sunLon:c.sunLon,dayLen:c.dayLen});BSP=sp;const gh=sp.gh,Rn=rnd(hashStr(id));
 // crystal outcrops over the land: one instanced draw
 if(c.crystals){const geo=new THREE.OctahedronGeometry(1,0);geo.translate(0,.7,0);
  inst(geo,new THREE.MeshStandardMaterial({color:c.crystals.col,emissive:c.crystals.em,emissiveIntensity:.25,roughness:.12,metalness:.3,flatShading:true}),
   w3Scatter(sp,c.crystals.n,hashStr(id)+1,(la,lo,h)=>h>2.2),(o,p)=>{frameLL(sp,p[0],p[1],-.4,p[3]*6,o);o.rotation.x+=(p[3]-.5)*.5;const s=1+p[3]*p[3]*5;o.scale.set(s*.5,s*(1.4+p[3]*2),s*.5)},null,{far:2600})}
 // cities of solid crystal: clusters of tall prisms
 if(c.cities){const geo=new THREE.CylinderGeometry(.7,1,1,6);geo.translate(0,.5,0);const m=towerMat({metalness:.35,roughness:.15,win:'#fff0fa'});m.color.set(c.cityCol||'#f4ecfa');sp.towerMats=(sp.towerMats||[]).concat([m]);
  c.cities.forEach(([la,lo,r],k)=>inst(geo,m,scatter(140,la,lo,r,hashStr(id)+20+k,(a,b,h)=>h>1.8),(o,p)=>{frameLL(sp,p[0],p[1],-.3,p[3]*6,o);const h=3+Math.pow(1-p[3],3)*30;o.scale.set(1.2+p[3],h,1.2+p[3])},null,{far:3000}))}
 // junk: broken shapes heaped into hills
 if(c.junk){const parts=[new THREE.BoxGeometry(1,1,1),new THREE.CylinderGeometry(.5,.5,1.4,6),new THREE.OctahedronGeometry(.8,0),new THREE.TorusGeometry(.6,.2,5,10)];
  const cols=['#7a6a62','#5a5048','#8a5a48','#6a6a70'];parts.forEach((g,k)=>inst(g,new THREE.MeshStandardMaterial({color:cols[k],roughness:.8,metalness:.4,flatShading:true}),
   w3Scatter(sp,c.junk.n/parts.length|0,hashStr(id)+40+k,(la,lo,h)=>h>2&&n3(la*.25,lo*.25,1)>.4),(o,p)=>{frameLL(sp,p[0],p[1],p[3]*1.5,p[3]*6,o);o.rotation.set(p[3]*3,p[3]*5,p[3]*2);o.scale.setScalar(1.5+p[3]*p[3]*6)},null,{far:2400}))}
 if(c.fog)w3Scatter(sp,c.fog.n,hashStr(id)+90,(la,lo,h)=>h>2&&(!c.fog.test||c.fog.test(la,lo))).forEach((p,k)=>{const g=new THREE.Group();frameLL(sp,p[0],p[1],20,0,g);g.add(evPoints(500,hashStr(id)+91+k,evSwarmMat({dark:1,soft:1,col:c.fog.col,rx:60,ry:14,rz:60,speed:.03,size:46,op:.35,max:70})));sp.scene.add(g);cull(g,g.position.clone(),80,2400)});
 // generic props: instanced shapes over the ground or floating above it (pods, tanks, lava columns, floating islands)
 (c.props||[]).forEach((q,k)=>{const geo=q.geo==='sphere'?new THREE.SphereGeometry(1,14,10):q.geo==='cyl'?new THREE.CylinderGeometry(1,1,1,12):q.geo==='cone'?new THREE.ConeGeometry(1,1,7):q.geo==='box'?new THREE.BoxGeometry(1,1,1):lumpRock(1,k%5+1).clone();
  if(q.geo==='cyl'||q.geo==='box'||q.geo==='cone')geo.translate(0,.5,0);if(q.flat){geo.scale(1,.45,1);geo.translate(0,-.2,0)}
  const m=new THREE.MeshStandardMaterial({color:q.col,emissive:q.em||'#000000',emissiveIntensity:q.em?q.ei||.8:0,roughness:q.rough===undefined?.6:q.rough,metalness:q.metal||0,transparent:!!q.op,opacity:q.op||1,depthWrite:!q.op,flatShading:q.geo==='lump'});
  // a slow glow that breathes (lava, pods, lights), one uniform for the whole set
  if(q.pulse&&q.em){const e0=m.emissiveIntensity;anim(sp,null,t=>{m.emissiveIntensity=e0*(.65+.35*Math.sin(t*q.pulse+k))})}
  inst(geo,m,w3Scatter(sp,q.n,hashStr(id)+60+k,(la,lo,h)=>(q.sea?h<=0:h>(q.minH===undefined?1.6:q.minH))&&(!q.test||q.test(la,lo,h))),(o,p)=>{const a=q.alt?q.alt[0]+(q.alt[1]-q.alt[0])*p[3]:0;frameLL(sp,p[0],p[1],a,p[3]*6,o,!q.alt);if(q.alt)o.position.setLength(R+Math.max(sp.gh(p[0],p[1]),0)+a);
   const sc=q.scale[0]+(q.scale[1]-q.scale[0])*Math.pow(p[3],q.pow||2),st=q.stretch||[1,1,1];o.scale.set(sc*st[0],sc*st[1],sc*st[2])},null,{far:q.far||3000})});
 // a belt of things floating round the world, far out (one instanced draw, turning slowly)
 if(c.belt){const q=c.belt,N=q.n,im=new THREE.InstancedMesh(q.disc?new THREE.CylinderGeometry(1,1,.08,20):lumpRock(1,3).clone(),new THREE.MeshStandardMaterial({color:q.col,emissive:q.em||'#000000',emissiveIntensity:q.em?.5:0,metalness:q.metal||.2,roughness:q.rough||.7,flatShading:!q.disc}),N);
  const o=new THREE.Object3D();for(let i=0;i<N;i++){const a=Rn()*6.2832,r=R*(q.r[0]+Rn()*(q.r[1]-q.r[0]));o.position.set(Math.cos(a)*r,(Rn()-.5)*R*(q.thick||.05),Math.sin(a)*r);o.rotation.set((Rn()-.5)*(q.disc?.2:3),Rn()*6,(Rn()-.5)*(q.disc?.2:3));o.scale.setScalar(q.s[0]+Rn()*Rn()*(q.s[1]-q.s[0]));o.updateMatrix();im.setMatrixAt(i,o.matrix)}
  im.frustumCulled=false;im.userData.noShadow=1;const g=new THREE.Group();g.rotation.x=q.tilt||.18;g.add(im);sp.scene.add(g);sp.ring=g;sp.ringR=R*(q.r[0]+q.r[1])/2;anim(sp,g,(t,dt)=>{g.rotation.y+=dt*.004})}
 // a dream may hang more than one sun in its sky
 (c.suns||[]).forEach((col,k)=>{const g=glowSprite(col,1800,.9);g.material.fog=false;g.position.copy(dirLL(30-k*40,140+k*70)).multiplyScalar(24000);sp.scene.add(g)});
 // a world seen hanging in the sky (the ball of water over 废墟)
 if(c.more)c.more(sp,Rn);
 if(c.ball){const q=c.ball,b=new THREE.Mesh(new THREE.SphereGeometry(q.r,48,32),new THREE.MeshStandardMaterial({color:q.col,roughness:.15,metalness:.2,emissive:q.col,emissiveIntensity:.15}));b.position.set(...q.at).normalize().multiplyScalar(q.d);sp.scene.add(b)}
 // a dark mass far off in the sky (the micro-machine fog at the centre of the rock field)
 if(c.swarmFar){const q=c.swarmFar,g=new THREE.Group();g.position.set(...q.at).normalize().multiplyScalar(q.d);g.add(evPoints(2600,hashStr(id)+95,evSwarmMat({dark:1,soft:1,col:q.col,rx:q.r,ry:q.r*.8,rz:q.r,speed:.01,size:q.r*.5,op:.6,max:120})));sp.scene.add(g)}
 if(sp.ring)w3Orbiters(sp);
 if(sp.extra0)sp.extra0();
 entryKits(sp);entryModels(sp);placeMotes(sp);
 REGIONS.filter(r=>r.m===id&&r.rad).forEach(r=>sp.labels.push({n:r.n,id:null,pos:dirLL(...r.ll).multiplyScalar(R+70),minAlt:1500}));
 return sp}
/* points spread evenly over the whole globe, [lat,lon,h,rand] like scatter() */
function w3Scatter(sp,n,seed,test){const Rn=rnd(seed),out=[];let k=0;while(out.length<n&&k<n*12){k++;const la=Math.asin(Rn()*2-1)/D2R,lo=Rn()*360-180,h=sp.gh(la,lo);if(!test||test(la,lo,h))out.push([la,lo,h,Rn()])}return out}
/* things standing on a world's belt (the platforms of the peak species round 镜世界): entries with `orb` (an angle) ride it */
function w3Orbiters(sp){const g=sp.ring;
 WIKI.filter(w=>w.m===sp.id&&w.orb!==undefined).forEach(w=>{const a=w.orb*D2R,r=sp.ringR,p=V3(Math.cos(a)*r,30,Math.sin(a)*r);const s=makeShape(w,sp,false);s.position.copy(p);g.add(s);
  g.updateMatrixWorld(true);const wp=s.getWorldPosition(V3());s.userData.pick=w.id;px(w.id,()=>s.getWorldPosition(wp),Math.max(30,(w.kp&&(w.kp.r||w.kp.s))||30))})}
/* entries on a planet that only have a void-style kit shape get a planet body made from it, scaled to stand on the ground */
/* the solid part of a kit shape: its opaque meshes, not the glow sprites and point clouds round it (sized by those, a bird or
   a spark came out as a speck inside a huge glow, and the camera framed the speck from inside the glow) */
function kitBox(g){g.updateMatrixWorld(true);const b=new THREE.Box3(),t=new THREE.Box3();g.traverse(c=>{if(!c.isMesh||!c.geometry||c.isInstancedMesh)return;const m=c.material;if(m&&(m.blending===THREE.AdditiveBlending||m.depthWrite===false))return;if(!c.geometry.boundingBox)c.geometry.computeBoundingBox();t.copy(c.geometry.boundingBox).applyMatrix4(c.matrixWorld);b.union(t)});if(b.isEmpty())b.setFromObject(g);return b}
/* kit shapes were made for the dark void: on a lit planet their self-glow and halos bloomed into white blobs that hid the shape */
function kitTame(g){const seen=new Set();g.traverse(c=>{const m=c.material;if(!m||seen.has(m))return;seen.add(m);if(m.blending===THREE.AdditiveBlending||c.isPoints||c.isSprite){m.opacity=(m.opacity===undefined?1:m.opacity)*.35;m.transparent=true;return}
 if(m.emissive&&m.emissiveIntensity)m.emissiveIntensity*=.3;else if(m.isMeshBasicMaterial&&m.color)m.color.multiplyScalar(.55)})}
function entryKits(sp){WIKI.filter(w=>mapOf(w)===sp.id&&w.ll&&!ENT[w.id]&&w.k&&w.k!=='none'&&w.k!=='planet').forEach(w=>{
 ENT[w.id]=[()=>{const g=makeShape(w,sp,false);kitTame(g);const b=kitBox(g),sz=b.getSize(V3());const k=1/Math.max(1e-3,Math.max(sz.x,sz.y,sz.z));g.scale.multiplyScalar(k);
  const w0=new THREE.Group();g.position.y=-b.min.y*k;w0.add(g);return w0},(w.kp&&w.kp.big)||(sp.id==='rongqiu'?4:6),{alt:w.alt||0}]})}
for(const id in W3){BUILDERS[id]=()=>buildW3(id);HOME[id]=W3[id].home}
/* 唯一之桥 (age 10): the ten-thousand-kilometre bridge-city — the road runs along its deck, with towns on top, street layers
   stacked underneath, the bone kingdoms' dump to one side, the twisted manager's core near the end and the war bus beyond */
ROAD.bridge=t=>V3(Math.sin(t*Math.PI*.8)*400,Math.sin(t*Math.PI*2)*40,-3200+t*6400);
BUILDERS.bridge=()=>buildPath('bridge');
function bridgeMore(sp){const sc=sp.scene,road=sp.road,Rn=rnd(787);const o=new THREE.Object3D();
 const dm=new THREE.MeshStandardMaterial({color:'#7a7468',roughness:.85,metalness:.15}),N=160;
 const deck=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),dm,N*4),bld=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({color:'#9a907c',roughness:.8}),N*3);let k=0,b=0;
 for(let i=0;i<N;i++){const t=i/N,p=road(t),q=road(Math.min(1,t+.004)).sub(p).normalize();const L=6400/N+4;
  for(const [dy,w,h] of [[-70,700,40],[-170,640,30],[-270,580,30],[-370,520,30]]){o.position.set(p.x,p.y+dy,p.z);o.lookAt(o.position.clone().add(q));o.scale.set(w,h,L);o.updateMatrix();deck.setMatrixAt(k++,o.matrix)}
  for(let j=0;j<3;j++){const sd=Rn()<.5?-1:1,x=sd*(170+Rn()*160),h=30+Rn()*130;o.position.set(p.x+x*q.z,p.y-50+h/2,p.z-x*q.x);o.rotation.set(0,Math.atan2(q.x,q.z),0);o.scale.set(20+Rn()*40,h,20+Rn()*40);o.updateMatrix();bld.setMatrixAt(b++,o.matrix)}}
 deck.frustumCulled=bld.frustumCulled=false;sc.add(deck,bld);
 const lm=new THREE.MeshBasicMaterial({color:'#ffcf88'});const lt=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),lm,N*2);
 for(let i=0;i<N*2;i++){const p=road(i/N/2);o.position.set(p.x+(i%2?1:-1)*(250+(i%3)*30),p.y-120-(i%3)*100,p.z);o.rotation.set(0,0,0);o.scale.set(6,6,6);o.updateMatrix();lt.setMatrixAt(i,o.matrix)}lt.frustumCulled=false;sc.add(lt);
 {const p=road(.15),c=V3(p.x-1400,p.y-300,p.z+200);const bm=new THREE.MeshStandardMaterial({color:'#e8e0cc',roughness:.7,flatShading:true});const im=new THREE.InstancedMesh(new THREE.CylinderGeometry(.3,.5,1,5),bm,260);
  for(let i=0;i<260;i++){const a=Rn()*6.28,r=Math.sqrt(Rn())*600,h=(1-r/600)*300;o.position.set(c.x+Math.cos(a)*r,c.y+Rn()*h,c.z+Math.sin(a)*r*.7);o.rotation.set(Rn()*3,Rn()*3,Rn()*3);const s=20+Rn()*50;o.scale.set(s*.3,s*2,s*.3);o.updateMatrix();im.setMatrixAt(i,o.matrix)}im.frustumCulled=false;sc.add(im)}
 {const p=road(.86),c=V3(p.x+900,p.y-200,p.z);const kn=new THREE.Mesh(new THREE.TorusKnotGeometry(220,50,160,16,3,5),new THREE.MeshStandardMaterial({color:'#3a2a4a',metalness:.6,roughness:.3,emissive:'#8a4aff',emissiveIntensity:.5}));kn.position.copy(c);sc.add(kn);sc.add(at(glowSprite('#a070ff',1600,.4),c.x,c.y,c.z))}
 {const p=road(1),c=V3(p.x-600,p.y+200,p.z+900);const bus=new THREE.Mesh(new THREE.BoxGeometry(260,240,900),new THREE.MeshStandardMaterial({color:'#5a5248',metalness:.5,roughness:.5}));bus.position.copy(c);sc.add(bus)}}
// a road world with no entries yet starts at the head of its road
for(const id of ['bridge'])if(!WIKI.some(w=>w.m===id)){const p=ROAD[id](.02);HOME[id]={a:-p.z,b:p.x,alt:1400,head:0,y:p.y}}
