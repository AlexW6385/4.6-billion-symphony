/* ================================================================
   landmarks set straight against the text of the book:
   龙栖木 with cocoon tree-houses and leaf lanterns; crystal patched over the scorpion
   pyramids; blood-trees bare of green; the salt flat's white fluff-balls and trap plants;
   the glowing woods' moss floor and the dark plain's heaps of branches; the white crystal
   disc in the Chibcha cave; the cloud pillar behind the city of creation, ballistae on its walls.
   ================================================================ */
/* 龙栖木: seventy metres tall, ten across; boughs near the crown curl into cocoon houses with a door
   on one side, leaf lanterns full of glowing insects hang beneath them, purple fruit-balls on the bark */
function qimuGeo(){const P=[];const bark='#6a5236';
 P.push([kcy(.75,1.35,17,10),bark,{p:[0,8.5,0]}]);
 for(let i=0;i<5;i++){const a=i/5*6.283+.3;P.push([ktube([V3(0,1.2,0),V3(Math.cos(a)*1.4,.3,Math.sin(a)*1.4),V3(Math.cos(a)*2.6,-.5,Math.sin(a)*2.6)],.34,8,5),'#5b4630'])}
 // crown: broad layered leaf masses
 for(const [x,y,z,s] of[[0,18.2,0,3.4],[1.9,17.2,.6,2.2],[-1.7,17.4,-.9,2.3],[.4,19.4,-1.2,2],[-.6,16.6,1.7,1.9]])P.push([ki(1,1),'#3a7448',{p:[x,y,z],s:[s,s*.55,s]}]);
 // cocoon houses: woven shells round the trunk below the crown, each with a dark doorway facing out
 for(let k=0;k<4;k++){const a=k/4*6.283+.6,y=12.4+(k%2)*1.6;const cx=Math.cos(a)*1.5,cz=Math.sin(a)*1.5;
  P.push([tg(new THREE.SphereGeometry(.85,10,8),{s:[1,1.25,1]}),'#7a6040',{p:[cx,y,cz]}]);
  P.push([tg(new THREE.TorusGeometry(.62,.12,5,12),{s:[1,1.3,1]}),'#5a4428',{p:[cx,y+.1,cz],r:[0,-a+Math.PI/2,0]}]);
  P.push([tg(new THREE.CircleGeometry(.42,10),{s:[1,1.3,1]}),'#140c06',{p:[Math.cos(a)*2.33,y,Math.sin(a)*2.33],r:[0,-a+Math.PI/2,0]}]);
  P.push([ktube([V3(0,y+1.1,0),V3(cx*.6,y+1.3,cz*.6),V3(cx,y+1,cz)],.14,6,4),bark]);
  // the lantern hanging under the house
  P.push([kcy(.01,.01,.7,3),'#3a2a18',{p:[cx*1.05,y-1.35,cz*1.05]}]);P.push([tg(new THREE.SphereGeometry(.26,8,6),{s:[1,1.3,1]}),'#c8b060',{p:[cx*1.05,y-1.85,cz*1.05]}])}
 // purple fruit-balls grown on the bark for the little climbing dragons
 for(let i=0;i<22;i++){const a=i*2.39,y=2+i*.45;P.push([ks(.13,6,4),'#8a4ab8',{p:[Math.cos(a)*(1.25-y*.025),y,Math.sin(a)*(1.25-y*.025)]}])}
 return G(P)}
/* the lantern positions in a qimu tree's own frame, for the night lights */
const QIMU_LAN=Array.from({length:4},(_,k)=>{const a=k/4*6.283+.6,y=12.4+(k%2)*1.6;return V3(Math.cos(a)*1.5*1.05,y-1.85,Math.sin(a)*1.5*1.05)});

/* crystal patched over a pyramid's steps, any-old-where, as the scorpion-folk lay it */
function pyrCrystals(seed){const Rn=rnd(seed);const P=[];for(let i=0;i<26;i++){const k=(Rn()*5)|0,s=1-k/5,y=(k+.15+Rn()*.7)*.32;const f=(Rn()*4)|0,u=(Rn()*2-1)*s*.9;const w=.12+Rn()*.3,h=.06+Rn()*.14;
  const pos=f===0?[s+.012,y,u]:f===1?[-s-.012,y,u]:f===2?[u,y,s+.012]:[u,y,-s-.012];P.push([kb(f<2?.02:w,h,f<2?w:.02),Rn()<.5?'#bfeaf4':'#9fe0ff',{p:pos}])}return G(P)}

/* 血球树: two metres, no green at all; the red balls are swollen leaves full of blood */
function bloodGeo(){const P=[];const br='#3a2220';P.push([kcy(.09,.15,1.4,6),br,{p:[0,.7,0]}]);
 const tips=[];for(let i=0;i<6;i++){const a=i/6*6.283+.4,up=1.3+(i%3)*.25;const e=V3(Math.cos(a)*.75,up+.5,Math.sin(a)*.75);P.push([ktube([V3(0,1.2,0),V3(Math.cos(a)*.35,up+.1,Math.sin(a)*.35),e],.045,6,4),br]);tips.push(e)}
 for(const e of tips)for(let j=0;j<4;j++){const r=.11+((j*7)%3)*.04;P.push([ks(r,8,6),j%2?'#c0182a':'#a01020',{p:[e.x+(j-1.5)*.08,e.y-.05-(j%2)*.12,e.z+((j*5)%3-1)*.08]}])}
 return G(P)}

function rqCanon(sp){const gh=sp.gh;const Rn=rnd(5150);
 // the salt flat: colonies of white fluff-balls hauling bones home; six-leaved trap plants white as the salt with a red heart; salt dust on the wind
 {const fluff=G([[ki(.22,1),'#ffffff'],[ki(.06,0),'#1a1a1a',{p:[.12,.08,.1]}],[ki(.06,0),'#1a1a1a',{p:[.12,.08,-.1]}]]);const col=[];
  for(const c of scatter(26,4,-72,4.2,131,onLand))for(let j=0;j<14;j++)col.push([c[0]+(Rn()-.5)*.12,c[1]+(Rn()-.5)*.12,0,Rn()]);
  inst(fluff,VC({roughness:1}),col,(o,p)=>{frameLL(sp,p[0],p[1],.15,p[3]*6.28,o);o.scale.setScalar(.8+p[3]*.6)},[3,4,5,6,7,8,9,10,11,12],{far:500});
  const trap=G([...Array.from({length:6},(_,i)=>{const a=i/6*6.283;return[tg(new THREE.SphereGeometry(1,8,4,0,6.283,0,1.2),{s:[.5,.12,1.1]}),'#ece8dc',{p:[Math.cos(a)*1,.12,Math.sin(a)*1],r:[0,-a+Math.PI/2,0]}]}),[ki(.35,1),'#a8202a',{p:[0,.2,0]}]]);
  inst(trap,VC({roughness:.8}),scatter(40,4,-72,4.4,132,onLand),(o,p)=>{frameLL(sp,p[0],p[1],0,p[3]*6.28,o);o.scale.setScalar(1.4+p[3])},[3,4,5,6,7,8,9,10,11,12],{far:700});
  const g=new THREE.Group();g.add(emitter({n:160,life:6,speed:6,spread:.25,size:7,dir:[1,.08,.3],col:'#f4f2ea',op:.22,add:false,tex:smokeTex,area:[120,3,120],wander:2}));fr(4,-72,2,0,g);addE(g,[3,4,5,6,7,8,9,10,11,12]);cull(g,null,140,1400)}
 // the glowing woods: the moss floor itself gives light; across the river the dark plain is a litter of fallen branches
 {const moss=new THREE.MeshBasicMaterial({color:'#4affd0',transparent:true,opacity:.28,blending:THREE.AdditiveBlending,depthWrite:false,map:glowTex});const disc=new THREE.CircleGeometry(1,10);disc.rotateX(-Math.PI/2);
  const L=scatter(900,29,8,2.4,141,onLand).filter(p=>p[1]>7.45);inst(disc,moss,L,(o,p)=>{frameLL(sp,p[0],p[1],.25,0,o);o.scale.setScalar(2.5+p[3]*4)},[2,3,5,6,7,8,9,10,11,12],{far:1200});
  const br=G([[kcy(.08,.12,3,4),'#4a3a2a',{r:[0,0,Math.PI/2]}],[kcy(.04,.06,1.2,3),'#4a3a2a',{p:[.4,.3,.2],r:[.6,0,1]}]]);
  inst(br,VC({roughness:.95}),scatter(700,29,6.4,2.2,142,(la,lo,h)=>h>1.6&&lo<7.3),(o,p)=>{frameLL(sp,p[0],p[1],.1,p[3]*6.28,o);o.rotateZ((p[3]-.5)*.3);o.scale.setScalar(.8+p[3]*1.2)},[2,3,5,6,7,8,9,10,11,12],{far:600})}
 // the Chibcha's crystal works: a white disc ten metres across, two high, crystal pipes running into it like a saucer on a web
 {const g=new THREE.Group();const wm=new THREE.MeshStandardMaterial({color:'#f0f6f8',roughness:.2,emissive:'#7fd8f0',emissiveIntensity:.25});
  const d=new THREE.Mesh(tg(new THREE.SphereGeometry(5,24,10),{s:[1,.22,1]}),wm);d.position.set(9,1,3);g.add(d);const dome=new THREE.Mesh(new THREE.SphereGeometry(1.6,14,7,0,6.283,0,1.57),wm);dome.position.set(9,1.8,3);g.add(dome);
  const pm=new THREE.MeshStandardMaterial({color:'#bff0ff',roughness:.1,emissive:'#3ab8d8',emissiveIntensity:.5,transparent:true,opacity:.85});
  for(let i=0;i<9;i++){const a=i/9*6.283;const e=V3(9+Math.cos(a)*(9+Rn()*6),.4,3+Math.sin(a)*(9+Rn()*6));g.add(new THREE.Mesh(ktube([V3(9+Math.cos(a)*4.6,.9,3+Math.sin(a)*4.6),V3(9+Math.cos(a)*7,1.8,3+Math.sin(a)*7),e],.32,12,6),pm))}
  g.add(at(glowSprite('#bff4ff',22,.35),9,2,3));fr(28,9.6,0,0,g);addE(g,[2,3]);cull(g,null,30,1400)}
 // the city of creation stands before a pillar of cloud that climbs to the sea of clouds; the cloud glows from within
 {const g=new THREE.Group();const mt2=new THREE.SpriteMaterial({map:smokeTex,color:'#f4f2ff',transparent:true,opacity:.6,depthWrite:false});const mg=new THREE.SpriteMaterial({map:glowTex,color:'#fff0e0',transparent:true,opacity:.2,depthWrite:false,blending:THREE.AdditiveBlending});const S=[];
  for(let i=0;i<140;i++){const y=Rn()*125,r=6+Math.sin(y*.05)*3+Rn()*6+y*.08;const a=Rn()*6.28;const s=new THREE.Sprite(i%9===0?mg:mt2);const sz=16+Rn()*20+y*.15;s.scale.set(sz,sz*.8,1);s.position.set(Math.cos(a)*r,y,Math.sin(a)*r);s.userData={a,r,y,w:.02+Rn()*.04};g.add(s);S.push(s)}
  fr(-11.8,66.2,0,0,g);addE(g,[5,6,7,8,9,10,11,12]);cull(g,null,160,3200);const pc=dirLL(-11.8,66.2);anim(sp,g,t=>{const dk=sm(-.25,.2,pc.dot(sp.sunDir));mt2.color.setRGB(.22+.74*dk,.23+.72*dk,.3+.7*dk);mg.opacity=.08+.12*dk;for(const s of S){const u=s.userData;const a=u.a+t*u.w;s.position.x=Math.cos(a)*u.r;s.position.z=Math.sin(a)*u.r}});
  // ballistae along the city wall
  const cap=(sp.towns||[]).find(x=>x.name==='capital');if(cap&&cap.towers){const bal=G([[kb(.5,.5,3.4),'#c8ccd0',{p:[0,.3,0]}],[tg(new THREE.TorusGeometry(1.6,.12,4,12,Math.PI),{r:[Math.PI/2,0,0]}),'#9aa0a6',{p:[0,.5,1.1]}],[kcy(.05,.05,3.4,3),'#e8e0c8',{p:[0,.7,.2],r:[Math.PI/2,0,0]}]]);
   inst(bal,VC({metalness:.6,roughness:.3}),cap.towers,(o,p)=>{frameLL(sp,p[0],p[1],5.6,p[3]+Math.PI,o);o.scale.setScalar(1.4)},[5,6,7,8,9,10,11,12],{far:1200})}}
 // the eye of the earth: rings of colour round the lake, like an iris seen from the sky
 {const ring=(r0,r1,n,col,seed,s)=>inst(lumpRock(1,seed%5+1),VC({roughness:.9,flatShading:true}),scatter(n,-17,75,r1,seed,(la,lo,h)=>{const d=angDeg(dirLL(la,lo),F.dieye);return h>1&&d>r0&&d<r1}),(o,p)=>{frameLL(sp,p[0],p[1],-.3,p[3]*6,o);o.scale.set(s*(1+p[3]),s*.5,s*(1+p[3]))},[5,6,7,8,9,10,11,12],{tint:()=>C(col),far:1600});
  ring(2.1,2.6,500,'#7ab84a',1601,1.4);ring(5,5.8,600,'#a8a050',1602,1.2);
  inst(geoC('rain'),swayMat({roughness:.85},.002),scatter(420,-17,75,5.2,1603,(la,lo,h)=>h>1.5&&angDeg(dirLL(la,lo),F.dieye)>2.6&&angDeg(dirLL(la,lo),F.dieye)<5),(o,p)=>{frameLL(sp,p[0],p[1],-.2,p[3]*6,o);o.scale.setScalar(.55+p[3]*.5)},[5,6,7,8,9,10,11,12],{far:1800})}
 // the moss plain beyond the blood-trees: pure moss, no grass, that stands against the desert storms
 {const pts=scatter(800,-24,84,4,1701,(la,lo,h)=>h>2);inst(new THREE.SphereGeometry(1,8,4,0,6.283,0,1.4),VC({roughness:1}),pts,(o,p)=>{frameLL(sp,p[0],p[1],-.4,p[3]*6,o);o.scale.set(2+p[3]*3,.5+p[3]*.4,2+p[3]*3)},[5,6,7,8,9,10,11,12],{tint:p=>C('#5aa04a').offsetHSL((p[3]-.5)*.05,0,(p[3]-.5)*.12),far:1300})}}

/* ---------- second pass ---------- */
function spiderGeo(){const P=[[ks(.6,10,8),'#ff7a2a',{s:[1,.75,1.2]}],[ks(.35,8,6),'#ff9a3a',{p:[0,0,.75]}]];for(let i=0;i<8;i++){const s=i<4?1:-1,k=i%4;const a=(k-1.5)*.45;const b=V3(s*.4,0,Math.sin(a)*.5),m=V3(s*1.5,.7,Math.sin(a)*1.5),e=V3(s*2.4,-.6,Math.sin(a)*2.2);P.push([ktube([b,m,e],.07,8,4),'#c84a1a'])}return G(P)}
function crysTreeGeo(){return{trunk:G([[kcy(.18,.32,3.4,6),'#ffffff',{p:[0,1.7,0]}],[kcy(.07,.12,1.6,5),'#ffffff',{p:[.5,3.1,0],r:[0,0,-.7]}],[kcy(.06,.1,1.4,5),'#ffffff',{p:[-.45,3,.25],r:[.3,0,.75]}],[ko(.3),'#ffffff',{p:[.25,1.2,.2],s:[1,2.2,1]}],[ko(.24),'#ffffff',{p:[-.2,2.2,-.2],s:[1,2,1]}]]),
 crown:G([[ki(1,1),'#3f8a4a',{p:[0,4.4,0],s:[1.9,1.2,1.9]}],[ki(1,1),'#4a9a54',{p:[.9,3.9,.3],s:[1.2,.9,1.2]}],[ki(1,1),'#357a42',{p:[-.8,4,-.5],s:[1.1,.85,1.1]}]])}}
function landShipGeo(){const P=[[tg(new THREE.SphereGeometry(1,16,8),{s:[5,1.4,1.6]}),'#e4eaee',{p:[0,1.6,0]}],[kb(9,.3,2.8),'#c8d0d6',{p:[0,2.6,0]}],[kc(.35,3.6,6),'#f4f6f8',{p:[5.6,2.2,0],r:[0,0,-Math.PI/2]}],
  [kb(2.2,1.6,2),'#d8dee2',{p:[-2.4,3.5,0]}],[kcy(.12,.12,5,5),'#8a7a5a',{p:[.6,5.2,0]}],[tg(new THREE.PlaneGeometry(3.4,3),{}),'#f0ece0',{p:[.6,5.4,.05]}]];
 for(let i=0;i<6;i++)for(const s of[-1,1])P.push([tg(new THREE.SphereGeometry(.32,8,6),{s:[1.6,.7,.8]}),'#1a1e22',{p:[-3+i*1.2,.5,s*1.45]}]);return G(P)}
function rqCanon2(sp){const gh=sp.gh,Rn=rnd(6262);
 {sp.entClr=sp.entClr||[];for(let t=0;t<=1.001;t+=.04){const d=dirLL(20,4).lerp(dirLL(22,14),t).normalize();sp.entClr.push({d,deg:.8,cs:Math.cos(.8*D2R),eras:[2,3]})}}
 // the lava rift: a black crust of set lava on its floor, and lava spiders asleep by day on single threads down its walls
 {const A=dirLL(20,4),B=dirLL(22,14);const crust=[],spd=[],thr=[];for(let i=0;i<420;i++){const t=Rn();const c=A.clone().lerp(B,t).normalize();const ll=llDir(c);const side=V3(0,1,0).cross(c).normalize();
   const q=c.clone().addScaledVector(side,(Rn()-.5)*.8*D2R).normalize();const l2=llDir(q);crust.push([l2[0],l2[1],0,Rn()]);
   if(i%9===0){const s=Rn()<.5?-1:1;const e=c.clone().addScaledVector(side,s*.62*D2R).normalize();const le=llDir(e);const top=gh(le[0],le[1])+2;const L=6+Rn()*10;spd.push([le[0],le[1],top-L,Rn()]);const p=dirLL(le[0],le[1]);thr.push(p.clone().multiplyScalar(R+top),p.clone().multiplyScalar(R+top-L+1))}}
  inst(new THREE.CylinderGeometry(1,1.2,.3,7),detailMat(VC({roughness:.6,metalness:.2}),{bump:1}),crust,(o,p)=>{frameLL(sp,p[0],p[1],.1,p[3]*6,o);o.scale.set(2+p[3]*3,1,2+p[3]*2.5)},[2,3],{tint:()=>C('#1a1614'),far:1400});
  inst(spiderGeo(),new THREE.MeshStandardMaterial({vertexColors:true,roughness:.5,emissive:'#ff4a10',emissiveIntensity:.35}),spd,(o,p)=>{frameLL(sp,p[0],p[1],0,p[3]*6,o,false);o.position.setLength(R+p[2]);o.scale.setScalar(1.6+p[3]*1.4)},[2,3],{far:1200});
  const tl=new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(thr),new THREE.LineBasicMaterial({color:'#e8e0d0',transparent:true,opacity:.6}));addE(tl,[2,3]);cull(tl,dirLL(21,9).multiplyScalar(R),140,900)}
 // the crystal woods: ordinary trees except that the bark has turned to crystal; flames dance in the air; rib-centipedes lie like bones
 {const k=crysTreeGeo();const pts=scatter(420,10,-100,4.4,1901,onLand);const set=(o,p)=>{frameLL(sp,p[0],p[1],-.2,p[3]*6.28,o);o.scale.setScalar(.85+p[3]*.9)};
  inst(k.trunk,new THREE.MeshStandardMaterial({vertexColors:true,color:'#bff0ff',roughness:.06,metalness:.1,emissive:'#2a9ac0',emissiveIntensity:.5,flatShading:true}),pts,set,[3],{far:1800});
  inst(k.crown,swayMat({roughness:.85},.004),pts,set,[3],{tint:p=>C('#ffffff').offsetHSL((p[3]-.5)*.05,0,(p[3]-.5)*.12),far:1800});
  for(const c of scatter(10,10,-100,3.6,1902,onLand)){const g=new THREE.Group();g.add(emitter({n:24,life:1.4,speed:1.2,spread:.5,size:1.6,dir:[0,1,0],col:'#ffd070',col2:'#ff5010',op:.9,area:[.6,.4,.6]}));g.add(glowSprite('#ffa040',6,.6));frameLL(sp,c[0],c[1],3+c[3]*3,0,g);addE(g,[3]);cull(g,null,20,700);anim(sp,g,t=>{g.children[1].material.opacity=.4+Math.sin(t*5+c[3]*9)*.2})}
  const rib=G([[kcy(.12,.12,4,6),'#e8dcc8',{r:[0,0,Math.PI/2]}],...Array.from({length:8},(_,i)=>[tg(new THREE.TorusGeometry(.9-Math.abs(i-3.5)*.08,.07,4,10,Math.PI),{r:[0,Math.PI/2,0]}),i%2?'#d8ccb4':'#c8bca4',{p:[-1.6+i*.45,0,0]}]),[ks(.22,8,6),'#a03a2a',{p:[2.1,0,0]}]]);
  inst(rib,VC({roughness:.7}),scatter(30,10,-100,4,1903,onLand),(o,p)=>{frameLL(sp,p[0],p[1],.15,p[3]*6,o);o.scale.setScalar(.9+p[3]*.8)},[3],{tint:p=>p[3]>.8?C('#ff6a4a'):C('#ffffff'),far:700})}
 // the fungus isles: the caps grow green with the algae they keep; burst fungus-sacs lie everywhere after the war
 {const caps=scatter(160,30,-103,5.5,1951,onLand);const cap=G([[kcy(.5,.7,4,8),'#e8e0d4',{p:[0,2,0]}],[tg(new THREE.SphereGeometry(2.4,14,7,0,6.283,0,1.4),{s:[1,.45,1]}),'#5aa060',{p:[0,4,0]}]]);
  inst(cap,VC({roughness:.7,emissive:'#1a3a1a',emissiveIntensity:.3}),caps,(o,p)=>{frameLL(sp,p[0],p[1],-.3,p[3]*6,o);o.scale.setScalar(.6+p[3]*.8)},[3],{tint:p=>C('#ffffff').offsetHSL((p[3]-.5)*.08,0,(p[3]-.5)*.2),far:1600});
  inst(new THREE.SphereGeometry(1,10,6,0,6.283,0,1.9),new THREE.MeshStandardMaterial({color:'#d8c8e0',roughness:.7,side:THREE.DoubleSide}),scatter(70,30,-103,5,1952,onLand),(o,p)=>{frameLL(sp,p[0],p[1],-.4,p[3]*6,o);o.rotateX((p[3]-.5)*1.2);o.scale.setScalar(.9+p[3]*1.2)},[3],{far:900})}
 // the silver city's avenue: land-ships, ten metres tall, that crawl on dry ground; black finned walkers cling to the hulls and drive them
 {const pts=[];for(let i=0;i<9;i++){const t=(i+.5)/9;pts.push([-4+t*2.2+(i%2?.2:-.2),54+t*2.8,0,Rn()])}
  inst(landShipGeo(),VC({metalness:.6,roughness:.25}),pts,(o,p)=>{frameLL(sp,p[0],p[1],0,Math.atan2(2.8,2.2)+(p[3]-.5)*.3,o);o.scale.setScalar(1.3)},[5,6,7,8,9,10,11,12],{far:1400})}
 // the sea of clouds: crystal ships that float on it, six rhombus crystals blazing at their sterns; crystal discs ten metres across spinning in guard
 {const cship=G([[tg(new THREE.SphereGeometry(1,14,7),{s:[5,1.1,1.5]}),'#d8f4ff',{p:[0,0,0]}],[kb(7,.2,2.4),'#a8c8d8',{p:[0,.9,0]}],...Array.from({length:6},(_,i)=>[ko(.4),'#ffffff',{p:[-5.2,-.4+(i%3)*.5,(i<3?-.5:.5)],s:[.7,1.4,.7]}])]);
  inst(cship,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.08,metalness:.2,emissive:'#5ac8ff',emissiveIntensity:.35,transparent:true,opacity:.9}),scatter(10,-9,69,6,1961),(o,p)=>{frameLL(sp,p[0],p[1],147,p[3]*6,o,false);o.scale.setScalar(1.6)},[5],{far:3000});
  const disc=new THREE.CylinderGeometry(4,4,.5,20);const dm=new THREE.MeshStandardMaterial({color:'#e8f8ff',roughness:.05,metalness:.3,emissive:'#7fd8ff',emissiveIntensity:.4,flatShading:true});const D=[];const g=new THREE.Group();
  for(let i=0;i<16;i++){const m=new THREE.Mesh(disc,dm);m.userData={a:i/16*6.283,r:40+Rn()*50,y:Rn()*30,w:(Rn()<.5?-1:1)*(.15+Rn()*.2)};g.add(m);D.push(m)}fr(-10,88,140,0,g,false);addE(g,[5],true);cull(g,null,140,3000);
  anim(sp,g,t=>D.forEach(m=>{const u=m.userData,a=u.a+t*u.w;m.position.set(Math.cos(a)*u.r,u.y+Math.sin(t+u.a)*4,Math.sin(a)*u.r);m.rotation.y=t*6;m.rotation.x=.3}))}
 // smoke from the peak beyond the great rift
 {const g=new THREE.Group();g.add(emitter({n:120,life:10,speed:4,spread:.3,size:22,dir:[.3,1,0],col:'#3a3632',col2:'#6a625a',op:.4,add:false,tex:smokeTex,area:[10,3,10],wander:2}));frameLL(sp,22,-94,72,0,g,false);g.position.setLength(R+gh(22,-94)+4);addE(g,[3,4]);cull(g,null,200,2600)}}

/* ---------- third pass: life the book describes at these places ---------- */
function rqCanon3(sp){const gh=sp.gh,Rn=rnd(7373);
 // the ya-dragons' nesting pillars: rock chewed and glued with spit into columns tens of metres high, one dragon to each top
 {const pts=scatter(28,15.5,-91.5,1.6,2101,onLand);const pil=G([[kcy(1.1,1.8,1,7),'#8a8274',{p:[0,.5,0]}],[kd(1.3),'#7a7264',{p:[.2,1,.1],s:[1,.08,1]}]]);
  inst(pil,detailMat(VC({roughness:.95,flatShading:true}),{bump:1,freq:2}),pts,(o,p)=>{frameLL(sp,p[0],p[1],-.5,p[3]*6,o);o.scale.set(1+p[3]*.6,12+p[3]*22,1+p[3]*.6)},[3,4,5],{tint:p=>C('#ffffff').offsetHSL(0,0,(p[3]-.5)*.2),far:1800});
  const drg=G([[tg(new THREE.SphereGeometry(1,10,6),{s:[1.3,.6,.55]}),'#3f7a5a'],[kcy(.18,.3,1.4,6),'#3f7a5a',{p:[1.3,.7,0],r:[0,0,-.9]}],[tg(new THREE.SphereGeometry(.32,8,6),{s:[1.5,.7,.7]}),'#3f7a5a',{p:[1.95,1.25,0]}],
   [tg(new THREE.ConeGeometry(.7,2.6,3),{s:[1,1,.15]}),'#2f5a44',{p:[-.1,.6,.55],r:[.4,0,1.3]}],[tg(new THREE.ConeGeometry(.7,2.6,3),{s:[1,1,.15]}),'#2f5a44',{p:[-.1,.6,-.55],r:[-.4,0,1.3]}],[kc(.14,1.8,5),'#3f7a5a',{p:[-1.8,-.1,0],r:[0,0,1.4]}]]);
  inst(drg,VC({roughness:.6}),pts,(o,p)=>{frameLL(sp,p[0],p[1],-.5+12+p[3]*22+.5,p[3]*6,o);o.scale.setScalar(1.3)},[3,4,5],{far:1400})}
 // the white bone-dragons' great circles: ring inside ring of huge stones hauled across the wild, the dead dragged to a pile beside
 {const g=new THREE.Group();const sm2=detailMat(VC({roughness:.95,flatShading:true}),{bump:.8});const P=[];
  for(let r=0;r<3;r++){const R2=26-r*8,n=Math.round(R2*1.6);for(let i=0;i<n;i++){const a=i/n*6.283+r*.2;if(r===0&&i%9===0)continue;const s=1.6+Rn()*1.4;P.push([tg(new THREE.DodecahedronGeometry(s,0),{p:[Math.cos(a)*R2,s*.8+(r===2?Rn()*2:0),Math.sin(a)*R2],s:[1,1.3+Rn()*.8,1]}),Rn()<.5?'#a8a090':'#8a8274'])}}
  for(let i=0;i<14;i++)P.push([tg(lumpRock(1,i%4+2).clone().scale(1.4+Rn(),1.4+Rn(),1.4+Rn()),{p:[34+Rn()*6,.8,-8+Rn()*6]}),'#9a9282']);
  g.add(new THREE.Mesh(mergeColored(P),sm2));const bones=[];for(let i=0;i<20;i++)bones.push([tg(new THREE.CylinderGeometry(.15,.15,2.6,5),{p:[-36+Rn()*5,.3+i*.05,6+Rn()*5],r:[Math.PI/2,Rn()*3,0]}),'#ece4d0']);g.add(new THREE.Mesh(mergeColored(bones),VC()));
  fr(-1.5,-66,-.6,.3,g);addE(g,[3]);cull(g,null,50,1600)}
 // the emerald dragons' flying machines: three olive-shaped hulls of wood and bone side by side, the middle one ten metres, a spinning wheel at each nose, two riders pedalling
 {const hull=(z,L)=>[tg(new THREE.SphereGeometry(1,12,8),{s:[L,.7,.7]}),'#8a6a44',{p:[0,0,z]}];const P=[hull(0,5),hull(1.8,3.6),hull(-1.8,3.6),[kb(1,.12,4),'#d8ccb4',{p:[0,.6,0]}],[kb(6,.1,.2),'#d8ccb4',{p:[0,.55,0]}],
   [tg(new THREE.SphereGeometry(.35,8,6),{}),'#3f8a4a',{p:[.6,.95,0]}],[tg(new THREE.SphereGeometry(.35,8,6),{}),'#3f8a4a',{p:[-.6,.95,0]}]];const body=G(P);
  const wheel=G([...[0,1,2,3].map(k=>[kb(.08,1.6,.25),'#c8b890',{r:[k*.785,0,0]}]),[kcy(.15,.15,.2,8),'#5a4630',{r:[0,0,Math.PI/2]}]]);const ships=[];
  for(let i=0;i<5;i++){const g=new THREE.Group();g.add(new THREE.Mesh(body,VC({roughness:.8})));const ws=[];for(const [z,L] of[[0,5],[1.8,3.6],[-1.8,3.6]]){const w=new THREE.Mesh(wheel,VC());w.position.set(L+.1,0,z);g.add(w);ws.push(w)}g.scale.setScalar(1.6);addE(g,[5,6,7,8,9,10,11,12]);ships.push({g,ws,a:i/5*6.283,r:1.2+i*.35,h:40+i*7,w:.05+i*.008})}
  const c0=[13.2,11.3];anim(sp,null,t=>{if(CUR!==sp)return;for(const s of ships){const a=s.a+t*s.w;const la=c0[0]+Math.cos(a)*s.r,lo=c0[1]+Math.sin(a)*s.r/Math.cos(c0[0]*D2R);frameLL(sp,la,lo,s.h+Math.sin(t*.7+s.a)*3,a+Math.PI/2,s.g);for(const w of s.ws)w.rotation.x=t*14}})}
 // the Inca pit: cutter-beetles slicing vine-fern into half-metre logs and rolling them down the steps; black bees in clouds; white water-ball creatures swelling in the pool
 {const cut=G([[tg(new THREE.SphereGeometry(1,10,6),{s:[1,.45,.6]}),'#3a2a1e'],[ks(.35,8,6),'#2a1e16',{p:[.9,.1,0]}],[tg(new THREE.ConeGeometry(.15,1.2,3),{s:[1,1,.3]}),'#c8b890',{p:[1.4,.1,.3],r:[0,0,-1.3]}],[tg(new THREE.ConeGeometry(.15,1.2,3),{s:[1,1,.3]}),'#c8b890',{p:[1.4,.1,-.3],r:[0,0,-1.3]}],
   ...[-.5,0,.5].flatMap(x=>[[kcy(.04,.04,.9,3),'#2a1e16',{p:[x,-.3,.5],r:[.9,0,0]}],[kcy(.04,.04,.9,3),'#2a1e16',{p:[x,-.3,-.5],r:[-.9,0,0]}]])]);
  const rim=[];for(let i=0;i<70;i++){const a=Rn()*6.283,d=.62+Rn()*.25;rim.push([20+Math.cos(a)*d*2.6,-13+Math.sin(a)*d*2.6/Math.cos(20*D2R),0,a])}
  inst(cut,VC({roughness:.5,metalness:.2}),rim,(o,p)=>{frameLL(sp,p[0],p[1],.2,p[3]+Math.PI,o);o.scale.setScalar(1.3)},[2],{far:900});
  const logs=rim.map(p=>[p[0]+(Rn()-.5)*.06,p[1]+(Rn()-.5)*.06,0,Rn()]);inst(G([[kcy(.18,.18,1,6),'#5a7a3a',{r:[0,0,Math.PI/2]}]]),VC(),logs,(o,p)=>{frameLL(sp,p[0],p[1],.2,p[3]*6,o)},[2],{far:700});
  const g=new THREE.Group();g.add(emitter({n:400,life:5,speed:3,spread:1.2,size:1,dir:[0,1,0],col:'#1a1612',op:.9,add:false,area:[70,14,70],wander:4}));
  const balls=[];for(let i=0;i<40;i++){const a=Rn()*6.283,d=Rn()*9;const s=.4+Rn()*1.6;balls.push([tg(new THREE.SphereGeometry(s,10,8),{p:[Math.cos(a)*d,2.4,Math.sin(a)*d]}),'#f4f4ee'])}g.add(new THREE.Mesh(mergeColored(balls),VC({roughness:.3})));
  fr(20,-13,0,0,g,false);g.position.setLength(R-1.8);addE(g,[2]);cull(g,null,70,1400)}}
