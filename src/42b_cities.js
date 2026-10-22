/* ================================================================
   city landmarks: the few buildings that make each city itself,
   on top of the streets and houses the town generator lays out.
   Where the book says what is there, it is built from that; the rest is filled in to match.
   ================================================================ */
function landmark(sp,la,lo,head,parts,eras,o){o=o||{};const mat=o.mat||towerMat({metalness:o.metal===undefined?.4:o.metal,roughness:o.rough||.5,win:o.win||'#ffe0b0'});if(!o.mat)sp.towerMats=(sp.towerMats||[]).concat([mat]);
 const m=new THREE.Mesh(G(parts),mat);frameLL(sp,la,lo,o.lift===undefined?-.3:o.lift,head||0,m);if(o.s)m.scale.setScalar(o.s);addTo(sp,m,eras,!!o.noCarry);m.geometry.computeBoundingSphere();cull(m,null,(m.geometry.boundingSphere.radius*(o.s||1))+10,o.far||1700);return m}
const PL=(la,lo,dn,de)=>[la+dn/17.45,lo+de/17.45/Math.max(.2,Math.cos(la*D2R))];

/* 创造之城: an armoured capital of workshops; soldiers drill on the square, ballistas are put together in open sheds,
   land-ships armed to the teeth are built across the road, and geared columns pound the ground */
function capitalDetail(sp){const E=[5,6,7,8,9,10,11,12],C0=[-14,63];const ST='#9aa4ac',DK='#3a4044',BR='#c8a860',RD='#a83a2a';
 // the armoury palace: three armoured tiers, a gear the size of a house on its face, two stacks breathing smoke
 {const P=[];for(let i=0;i<3;i++){const w=16-i*4.4,h=3.2;P.push([kb(w,h,w*.8),'#ffffff',{p:[0,h/2+i*h,0]}]);P.push([kb(w+.6,.4,w*.8+.6),DK,{p:[0,(i+1)*h,0]}]);
   for(let k=0;k<Math.round(w/1.6);k++)P.push([kb(.9,.7,.5),'#ffffff',{p:[-w/2+.8+k*1.6,(i+1)*h+.55,w*.4+.1]}])}
  P.push(...gear(3,.4).map(([g,c,f])=>[g,BR,{p:[(f.p||[0,0,0])[0],5.2+(f.p||[0,0,0])[1],6.5],r:f.r}]));P.push([kcy(.8,.8,.6,12),DK,{p:[0,5.2,6.6],r:[Math.PI/2,0,0]}]);
  P.push([kb(3.2,3.2,.3),'#1a1c1e',{p:[0,1.6,6.45]}]);for(const x of[-5.6,5.6]){P.push([kcy(.9,1.2,14,10),'#6a7278',{p:[x,7,-3.6]}]);P.push([kcy(1.1,1.1,.6,10),DK,{p:[x,14.2,-3.6]}])}
  for(const x of[-7,7])P.push([kb(.12,4,2.4),RD,{p:[x+(x<0?-.05:.05),6,4.2]}]);
  const [a,b]=PL(...C0,-12,9);const m=landmark(sp,a,b,.4,P,E,{metal:.7,rough:.3});
  for(const x of[-5.6,5.6]){const e=emitter({n:40,life:6,speed:2.4,spread:.3,size:6,dir:[0,1,0],col:'#7a7a7a',op:.3,add:false,tex:smokeTex,area:[1,.5,1],wander:1.2});e.position.set(x,15,-3.6);m.add(e)}}
 // the training square: a sanded ring with a low wall, weapon racks, practice posts and two lines of armoured soldiers
 {const [a,b]=PL(...C0,10,-8);const P=[[kcy(9,9,.25,28),'#c8bc9a',{p:[0,.12,0]}],[kcy(9.4,9.4,.9,28),'#8a9096',{p:[0,.45,0]}],[kcy(9,9,1,28),'#c8bc9a',{p:[0,.5,0]}]];
  for(let i=0;i<8;i++){const t=i/8*6.283;P.push([kb(1.6,1.4,.3),BEAM,{p:[Math.cos(t)*7.6,.95,Math.sin(t)*7.6],r:[0,-t+Math.PI/2,0]}]);for(let k=-2;k<=2;k++)P.push([kcy(.04,.04,2.2,3),'#c8ccd0',{p:[Math.cos(t)*7.6+Math.sin(t)*k*.3,1.6,Math.sin(t)*7.6-Math.cos(t)*k*.3]}])}
  for(let i=0;i<6;i++){const x=-5+i*2;P.push([kcy(.25,.3,1.8,6),'#8a6a40',{p:[x,1.9,-4]}]);P.push([kb(.9,.12,.12),'#8a6a40',{p:[x,2.3,-4]}])}
  for(let r=0;r<2;r++)for(let i=0;i<8;i++){const x=-5.6+i*1.6,z=1+r*2.2;P.push([kcy(.3,.4,1.3,6),ST,{p:[x,1.65,z]}]);P.push([ks(.32,6,4),ST,{p:[x,2.55,z]}]);P.push([kcy(.03,.03,2.2,3),'#d8dce0',{p:[x+.35,2,z]}])}
  landmark(sp,a,b,-.3,P,E,{metal:.6,rough:.4})}
 // open workshops where ballistas are put together
 {const [a,b]=PL(...C0,-6,-13);const P=[];for(let i=0;i<4;i++){const x=-6+i*4;
   P.push([kb(.3,4,.3),DK,{p:[x-1.7,2,-1.6]}],[kb(.3,4,.3),DK,{p:[x+1.7,2,-1.6]}],[kb(.3,4,.3),DK,{p:[x-1.7,2,1.6]}],[kb(.3,4,.3),DK,{p:[x+1.7,2,1.6]}],[kb(3.8,.25,3.8),'#6a737a',{p:[x,4.1,0],r:[.12,0,0]}]);
   P.push([kb(1.4,.8,2.2),BEAM,{p:[x,.6,0]}],[kb(.25,.25,2.6),'#8a6a40',{p:[x,1.2,.2]}],[tg(new THREE.TorusGeometry(1.2,.07,4,10,Math.PI),{r:[Math.PI/2,0,0]}),'#8a6a40',{p:[x,1.25,1.3]}],[kcy(.05,.05,2.6,3),'#c8ccd0',{p:[x,1.35,.2],r:[Math.PI/2,0,0]}]);
   if(i%2)P.push([kb(.8,.6,.8),'#a08050',{p:[x+1,.3,-1]}],[kb(.6,.5,.6),'#a08050',{p:[x+1.1,.85,-1]}])}
  landmark(sp,a,b,.9,P,E,{metal:.5,rough:.5})}
 // the yard where land-ships are built: hulls on cradles, wheels, turrets, a scaffold round the newest one
 {const [a,b]=PL(...C0,4,14);const P=[];const ship=(x,z,k)=>{P.push([tg(new THREE.SphereGeometry(1,14,8),{s:[5,1.6,2]}),'#8a949c',{p:[x,2.4,z]}],[kb(8,.5,3),DK,{p:[x,1.3,z]}],[kb(2.6,1.4,1.8),'#7a848a',{p:[x+1,4,z]}],[kcy(.6,.6,.5,10),DK,{p:[x-2,3.9,z]}],[kcy(.12,.12,2.4,5),DK,{p:[x-2,4.1,z+1],r:[Math.PI/2-.2,0,0]}]);
   for(let w=-3;w<=3;w+=1.5){P.push([tg(new THREE.CylinderGeometry(.8,.8,.4,12),{r:[Math.PI/2,0,0]}),'#2a2e32',{p:[x+w,.8,z+1.6]}],[tg(new THREE.CylinderGeometry(.8,.8,.4,12),{r:[Math.PI/2,0,0]}),'#2a2e32',{p:[x+w,.8,z-1.6]}])}
   if(k){for(let s=-4;s<=4;s+=2){P.push([kb(.15,6,.15),BEAM,{p:[x+s,3,z+2.4]}],[kb(.15,6,.15),BEAM,{p:[x+s,3,z-2.4]}])}P.push([kb(9,.15,.15),BEAM,{p:[x,3,z+2.4]}],[kb(9,.15,.15),BEAM,{p:[x,5.6,z+2.4]}],[kb(9,.15,.15),BEAM,{p:[x,5.6,z-2.4]}])}};
  ship(0,-6,0);ship(0,0,0);ship(0,6,1);P.push([kb(24,.15,.4),'#5a6268',{p:[0,.08,-2.6]}],[kb(24,.15,.4),'#5a6268',{p:[0,.08,2.6]}]);
  landmark(sp,a,b,-.2,P,E,{metal:.75,rough:.3})}}

/* 银之城: the city of merchants — awnings and stalls crowd the streets, and the library keeps its records of the sky-beast */
function silverDetail(sp){const E=[5,6,7,8,9,10,11,12],C0=[-4,56];
 {const P=[[kcy(7,7.4,.6,20),'#c8d0d6',{p:[0,.3,0]}],[kcy(5.4,5.4,4.6,20),'#ffffff',{p:[0,2.9,0]}],[tg(hemi(5.6,20),{}),'#d8e0e6',{p:[0,5.2,0]}],[ring(5.7,.18,20),'#8a949c',{p:[0,5.2,0]}],[kcy(.6,.6,1.2,10),'#d8e0e6',{p:[0,11,0]}],[kc(.7,1.6,10),'#cfe6ff',{p:[0,12.4,0]}]];
  for(let i=0;i<16;i++){const t=i/16*6.283;P.push([kcy(.28,.32,4.6,8),'#e8ecef',{p:[Math.cos(t)*6.3,2.9,Math.sin(t)*6.3]}])}P.push([kb(2.4,3,.3),'#2e343c',{p:[0,1.5,5.45]}],[kb(3.4,.4,1.4),'#c8d0d6',{p:[0,.7,6.6]}]);
  const [a,b]=PL(...C0,6,-6);landmark(sp,a,b,0,P,E,{metal:.8,rough:.25,win:'#cfe6ff'})}
 // market stalls with coloured awnings round the square
 {const cols=['#c84a3a','#e8b040','#3a8aa8','#7aa848','#a85aa8','#e87a3a'];const P=[];for(let i=0;i<20;i++){const t=i/20*6.283+.1,R0=7.2,x=Math.cos(t)*R0,z=Math.sin(t)*R0,c=cols[i%cols.length];const ox=Math.cos(t),oz=Math.sin(t);
   P.push([kb(1.4,.9,1),'#8a6a40',{p:[x,.45,z],r:[0,-t,0]}],[kb(1.8,.08,1.5),c,{p:[x-ox*.35,1.9,z-oz*.35],r:[0,-t,.25]}],[kcy(.04,.04,1.9,3),BEAM,{p:[x-ox*1.05,.95,z-oz*1.05]}]);if(i%3===0)P.push([ks(.25,6,4),'#e8a040',{p:[x,1.05,z]}],[ks(.22,6,4),'#7ab040',{p:[x+oz*.4,1.02,z-ox*.4]}])}
  landmark(sp,...C0,0,P,E,{metal:.1,rough:.8})}}

/* 天宫市 · 天宫学院 (尔什): a campus — the main hall under a clock tower, two dormitory wings,
   a glass dome for training, a playing field with a running track, and the white dome of the polar simulator (not open yet) */
function tiangongDetail(sp){const E=[8,9,10,11,12],C0=[45,12];const GL='#3a5a7a';
 {const P=[[kb(22,5,6),'#ffffff',{p:[0,2.5,0]}],[kb(22.6,.5,6.6),'#3a4a5a',{p:[0,5.25,0]}],...[1.6,3.3].map(y=>[kb(22.06,.5,6.06),GL,{p:[0,y,0]}]),
   [kb(4,9,4),'#ffffff',{p:[0,9,0]}],[kb(4.4,.4,4.4),'#3a4a5a',{p:[0,13.6,0]}],[kc(2.6,3.6,4),'#3a4a5a',{p:[0,15.6,0],r:[0,.785,0]}],[kcy(1.4,1.4,.2,20),'#f4f0e6',{p:[0,11,2.05],r:[Math.PI/2,0,0]}],[kb(.12,1.1,.06),'#1a1c1e',{p:[0,11.3,2.18]}],[kb(.8,.12,.06),'#1a1c1e',{p:[.3,11,2.18]}],
   [kb(6,3.4,.3),'#2a3038',{p:[0,1.7,3.05]}],[kb(9,.3,3),'#d8dee4',{p:[0,.15,4.6]}],...[-3,-1,1,3].map(x=>[kcy(.25,.25,3.6,8),'#f4f0e6',{p:[x,1.8,4.2]}])];
  for(const s of[-1,1])P.push([kb(5,9,5),'#ffffff',{p:[s*13.5,4.5,-1]}],...[2,4,6,8].map(y=>[kb(5.06,.5,5.06),GL,{p:[s*13.5,y-.6,-1]}]),[kb(5.4,.4,5.4),'#3a4a5a',{p:[s*13.5,9.2,-1]}]);
  const [a,b]=PL(...C0,18,0);landmark(sp,a,b,Math.PI,P,E,{metal:.3,rough:.4,win:'#ffe8c0'})}
 // dormitories in two rows, sky bridges between the pairs
 {const P=[];for(let i=0;i<4;i++){const x=-12+i*8;P.push([kb(5,7,3),'#ffffff',{p:[x,3.5,-4]}],[kb(5,7,3),'#ffffff',{p:[x,3.5,4]}],[kb(1.2,.9,5),GL,{p:[x,5.2,0]}],...[1.4,2.8,4.2,5.6].flatMap(y=>[[kb(5.06,.4,3.06),GL,{p:[x,y,-4]}],[kb(5.06,.4,3.06),GL,{p:[x,y,4]}]]),[kb(5.3,.3,3.3),'#3a4a5a',{p:[x,7.15,-4]}],[kb(5.3,.3,3.3),'#3a4a5a',{p:[x,7.15,4]}])}
  const [a,b]=PL(...C0,36,0);landmark(sp,a,b,0,P,E,{metal:.3,rough:.45,win:'#ffe8c0'})}
 // the playing field and track
 {const P=[[tg(new THREE.CylinderGeometry(1,1,.2,32),{s:[14,1,8]}),'#b05a4a',{p:[0,.1,0]}],[tg(new THREE.CylinderGeometry(1,1,.22,32),{s:[11.6,1,5.8]}),'#4a9a4a',{p:[0,.11,0]}],[kb(.15,.25,11),'#f4f4f4',{p:[0,.24,0]}],
   [kb(.1,2.4,3),'#f4f4f4',{p:[-10.6,1.2,0]}],[kb(.1,2.4,3),'#f4f4f4',{p:[10.6,1.2,0]}],...[-1,1].map(s=>[kb(18,1.6,1.6),'#c8d0d8',{p:[0,.8,s*9.2],r:[s*.25,0,0]}])];
  const [a,b]=PL(...C0,0,-24);landmark(sp,a,b,.3,P,E,{metal:0,rough:.9,lift:-.1})}
 // the glass training dome (jungle inside) and the white polar simulator
 {const gm=new THREE.MeshStandardMaterial({color:'#bfe4f4',transparent:true,opacity:.35,roughness:.08,metalness:.3,side:THREE.DoubleSide,depthWrite:false});
  const [a,b]=PL(...C0,2,24);const dome=new THREE.Mesh(hemi(9,24),gm);frameLL(sp,a,b,0,0,dome);addTo(sp,dome,E);cull(dome,null,20,1600);
  const P=[[kcy(9.2,9.2,.5,24),'#8a949c',{p:[0,.25,0]}]];for(let i=0;i<14;i++){const t=i*2.4,r=1+((i*37)%70)/10;P.push([kcy(.2,.3,3,5),'#5a4632',{p:[Math.cos(t)*r,1.5,Math.sin(t)*r]}],[ks(1.3,6,4),'#3a8a3a',{p:[Math.cos(t)*r,3.4,Math.sin(t)*r]}])}landmark(sp,a,b,0,P,E,{metal:.1,rough:.8});
  const [c,d]=PL(...C0,-20,-20);landmark(sp,c,d,0,[[tg(hemi(6,20),{}),'#f4f8fa',{}],[kcy(6.2,6.2,.6,20),'#8a949c',{p:[0,.3,0]}],[kb(2.4,2.4,.3),'#3a4a5a',{p:[0,1.2,5.9]}],[kb(1.8,.6,.06),'#c84a3a',{p:[0,2.8,5.95]}]],E,{metal:.2,rough:.5})}}

function rqCityDetail(sp){capitalDetail(sp);silverDetail(sp)}
