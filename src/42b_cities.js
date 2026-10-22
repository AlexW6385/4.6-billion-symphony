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

/* 翡翠龙之城: the upper district behind its own wall round the palace, the cramped lower district where the white dragons are kept,
   and the soft-earth ground at the edge where the dead are laid */
function emeraldDetail(sp){const E=[3],C0=[12,-88];
 {const P=[];const n=40;for(let i=0;i<n;i++){const t=i/n*6.283;if(i%10===0)continue;P.push([kb(2.6,2.2,.9),'#ffffff',{p:[Math.cos(t)*15,1.1,Math.sin(t)*15],r:[0,-t+Math.PI/2,0]}],[kb(2.8,.4,1.2),'#d8d2c0',{p:[Math.cos(t)*15,2.4,Math.sin(t)*15],r:[0,-t+Math.PI/2,0]}])}
  for(let k=0;k<4;k++){const t=k*1.5708;const x=Math.cos(t)*15,z=Math.sin(t)*15;P.push([kcy(1.1,1.2,4,8),'#ffffff',{p:[x+Math.sin(t)*1.9,2,z-Math.cos(t)*1.9]}],[kcy(1.1,1.2,4,8),'#ffffff',{p:[x-Math.sin(t)*1.9,2,z+Math.cos(t)*1.9]}],[kc(1.4,1.6,8),'#2d9560',{p:[x+Math.sin(t)*1.9,4.8,z-Math.cos(t)*1.9]}],[kc(1.4,1.6,8),'#2d9560',{p:[x-Math.sin(t)*1.9,4.8,z+Math.cos(t)*1.9]}],[kb(3,.5,1),'#ffffff',{p:[x,3.4,z],r:[0,-t+Math.PI/2,0]}])}
  landmark(sp,...C0,0,P,E,{metal:0,rough:.9,win:'#ffa040',noCarry:true,mat:detailMat(VC({roughness:.9}),{bump:.6,freq:2})})}
 {const P=[];for(let i=0;i<34;i++){const x=((i*37)%13-6)*1.5,z=((i*53)%11-5)*1.5;P.push([kb(1.4,1,1.2),'#9a8a70',{p:[x,.5,z],r:[0,(i%5)*.3,0]}],[kb(1.7,.1,1.6),'#6a5a3a',{p:[x,1.1,z],r:[0,(i%5)*.3,.2]}])}
  for(let i=0;i<8;i++)P.push([kcy(.06,.06,1.6,3),BEAM,{p:[-9+i*2.6,.8,-9]}]);P.push([kb(20,.12,.12),BEAM,{p:[3.6,1.4,-9]}]);
  const [a,b]=PL(...C0,-26,10);landmark(sp,a,b,.4,P,E,{metal:0,rough:.95,noCarry:true})}
 {const P=[[tg(new THREE.CylinderGeometry(1,1,.12,24),{s:[9,1,6]}),'#4a3a2a',{p:[0,.06,0]}]];for(let i=0;i<14;i++){const x=((i*29)%15-7)*1.1,z=((i*41)%9-4)*1.1;P.push([tg(new THREE.SphereGeometry(1,10,6,0,6.283,0,1.4),{s:[1.2,.45,.8]}),'#5a4632',{p:[x,0,z]}],[kb(.15,1,.15),'#d8d0c0',{p:[x+1,.5,z]}])}
  const [a,b]=PL(...C0,28,-22);landmark(sp,a,b,0,P,E,{metal:0,rough:1,noCarry:true,lift:-.05})}}
/* 白骸龙的城: a hall of stone columns that is their library, pens for the great ostrich-dragons, and a court of history tablets */
function whiteDetail(sp){const E=[3,4],C0=[4,-112];
 {const P=[[kb(14,.6,8),'#d8d2c4',{p:[0,.3,0]}],[kb(14,.5,8),'#bab4a6',{p:[0,6.2,0]}],[prism(14.6,1.4,8.8),'#8a8478',{p:[0,7.1,0]}]];for(let i=0;i<7;i++)for(const z of[-3.4,3.4])P.push([kcy(.42,.5,5.4,10),'#ece8dc',{p:[-6+i*2,3.3,z]}]);
  for(let i=0;i<5;i++)P.push([kb(1.6,2.2,.4),'#a89a78',{p:[-4+i*2,1.7,-1]}],[kb(1.2,.1,.5),'#c8b890',{p:[-4+i*2,2.9,-1]}]);P.push([kb(6,1,4),'#8a6a40',{p:[0,1.1,1.2]}]);
  const [a,b]=PL(...C0,9,7);landmark(sp,a,b,.5,P,E,{metal:0,rough:.9,noCarry:true})}
 {const P=[];for(let k=0;k<3;k++){const x=k*6-6;for(let i=0;i<8;i++){const t=i/8*6.283;P.push([kb(1.6,1.1,.12),BEAM,{p:[x+Math.cos(t)*2.5,.55,Math.sin(t)*2.5],r:[0,-t+Math.PI/2,0]}])}
   for(let j=0;j<2;j++){const bx=x+(j?.8:-.7),bz=j?.6:-.5;P.push([tg(new THREE.SphereGeometry(1,10,8),{s:[.9,.8,.6]}),'#c8b8a0',{p:[bx,1.9,bz]}],[kcy(.12,.15,1.6,6),'#a89880',{p:[bx+.5,3,bz]}],[ks(.3,8,6),'#c8b8a0',{p:[bx+.6,3.8,bz]}],[kcy(.1,.08,1.6,5),'#a89880',{p:[bx+.25,.8,bz]}],[kcy(.1,.08,1.6,5),'#a89880',{p:[bx-.25,.8,bz]}])}
   P.push([kb(1.4,.5,.6),'#8a6a40',{p:[x,.25,2]}])}
  const [a,b]=PL(...C0,-10,9);landmark(sp,a,b,-.3,P,E,{metal:0,rough:.9,noCarry:true})}
 {const P=[[kcy(5,5,.2,16),'#cfc8b8',{p:[0,.1,0]}]];for(let i=0;i<9;i++){const t=i/9*6.283;P.push([kb(1.2,2+(i%3)*.4,.3),'#bab4a6',{p:[Math.cos(t)*3.8,1+(i%3)*.2,Math.sin(t)*3.8],r:[0,-t+Math.PI/2,0]}])}P.push([kb(1.6,3,.5),'#ece8dc',{p:[0,1.5,0]}]);
  const [a,b]=PL(...C0,-8,-9);landmark(sp,a,b,0,P,E,{metal:0,rough:.9,noCarry:true})}}
/* 内林城: crooked trees that never grew into houses run right through the streets; after the bombing, a crater in the square
   with crystal shards in its walls and frightened dragons gathered round the lip */
function neilinDetail(sp){const E=[8],C0=[24,12];
 {const P=[];for(let i=0;i<26;i++){const t=i*2.39,d=4+((i*37)%100)/100*16,x=Math.cos(t)*d,z=Math.sin(t)*d;const L=[[kcy(.35,.5,2.2,6),'#5a4632',{p:[x,1.1,z],r:[.3,0,.2]}],[kcy(.25,.35,2,6),'#5a4632',{p:[x+.5,2.8,z+.4],r:[-.4,0,-.5]}],[kcy(.15,.25,1.6,5),'#5a4632',{p:[x+.2,4.3,z+.9],r:[.6,0,.3]}],[ks(1.3,7,5),'#4a7a3a',{p:[x+.3,5.3,z+1.2]}],[ks(.9,6,4),'#5a8a42',{p:[x+1.2,4.6,z+.4]}]];P.push(...L)}
  landmark(sp,...C0,0,P,E,{metal:0,rough:.9,noCarry:true,mat:VC({roughness:.9})})}
 {const P=[[kcy(6,4,.4,20),'#2a2622',{p:[0,-.1,0]}],[tg(new THREE.TorusGeometry(6.4,.9,6,20),{r:[Math.PI/2,0,0]}),'#6a5a48',{p:[0,.1,0]}]];for(let i=0;i<10;i++){const t=i*.63;P.push([kc(.35,1.6,4),'#bfeaf4',{p:[Math.cos(t)*5,.6,Math.sin(t)*5],r:[(Math.sin(i)*.5),0,Math.cos(i)*.5]}])}
  for(let i=0;i<14;i++){const t=i*.45+.2;P.push([kcy(.28,.36,1.2,6),'#3a8a5a',{p:[Math.cos(t)*7.6,.6,Math.sin(t)*7.6]}],[ks(.3,6,4),'#3a8a5a',{p:[Math.cos(t)*7.6,1.4,Math.sin(t)*7.6]}])}
  const [a,b]=PL(...C0,0,0);landmark(sp,a,b,0,P,E,{metal:0,rough:.9,noCarry:true,mat:VC({roughness:.85}),lift:-.2})}}
function rqCityDetail(sp){capitalDetail(sp);silverDetail(sp);emeraldDetail(sp);whiteDetail(sp);neilinDetail(sp)}

/* 尔什: 峡风要塞 the nostalgic town (grey brick lanes, low stone houses, a clock tower with a golden bell, a bar),
   英雄总部 with its arena, the research team's base, statues of the heroes who guard 阿美润根 */
function erxiCityDetail(sp){
 {const E=[8,9],C0=[78,-24];const P=[[kb(4,10,4),'#ffffff',{p:[0,5,0]}],[kb(4.6,.5,4.6),'#8a8478',{p:[0,10.2,0]}],...[[-1.6,-1.6],[1.6,-1.6],[-1.6,1.6],[1.6,1.6]].map(([x,z])=>[kb(.4,2.4,.4),'#ffffff',{p:[x,11.6,z]}]),[kc(3,3,4),'#6a5a4a',{p:[0,14.3,0],r:[0,.785,0]}],
   [tg(new THREE.SphereGeometry(1.1,12,8,0,6.283,0,1.9),{}),'#e8b830',{p:[0,12.4,0]}],[kcy(1.2,1.2,.1,16),'#f4f0e6',{p:[0,7.5,2.04],r:[Math.PI/2,0,0]}],[kb(.1,.9,.06),'#1a1c1e',{p:[0,7.7,2.12]}],door(0,2.04,1.2,2.2)];
  landmark(sp,...C0,0,P,E,{metal:.1,rough:.9,win:'#ffc070'});
  const [a,b]=PL(...C0,-8,6);landmark(sp,a,b,.8,[[kb(6,3,4),'#ffffff',{p:[0,1.5,0]}],[prism(6.4,1.2,4.4),'#6a5a4a',{p:[0,3.6,0]}],[kb(1.2,1.8,.1),'#6a4a2a',{p:[0,.9,2.02],r:[0,.4,0]}],[kb(2.4,.7,.1),'#3a2a1e',{p:[0,2.4,2.06]}],[kb(1.8,.3,.06),'#e8b830',{p:[0,2.4,2.12]}],[kcy(.3,.3,.8,8),'#6a4a2a',{p:[2.4,.4,2.4]}],[kcy(.3,.3,.8,8),'#6a4a2a',{p:[1.8,.4,2.6]}]],E,{metal:0,rough:.9,win:'#ffb060'})}
 {const E=[8,9],C0=[36,-94];const P=[[kb(8,16,8),'#ffffff',{p:[0,8,0]}],...[3,6,9,12].map(y=>[kb(8.06,.5,8.06),'#3a5a7a',{p:[0,y,0]}]),[kb(6,3,6),'#ffffff',{p:[0,17.5,0]}],[ring(4.4,.35,24),'#e8b830',{p:[0,13,0]}],[kcy(2,2,.3,6),'#c83a3a',{p:[0,10,4.1],r:[Math.PI/2,0,0]}],[kc(1.4,1.6,3),'#e8e8e8',{p:[0,10,4.3],r:[Math.PI/2,0,0]}],[kcy(.1,.1,5,4),'#8a949c',{p:[0,21.5,0]}]];
  const [a,b]=PL(...C0,6,0);landmark(sp,a,b,0,P,E,{metal:.4,rough:.35,win:'#ffe0a0'});
  const A=[[tg(new THREE.CylinderGeometry(1,1,.3,32),{s:[12,1,8]}),'#9aa4ac',{p:[0,.15,0]}],[tg(new THREE.CylinderGeometry(1,1,.32,32),{s:[9,1,5.5]}),'#c8b890',{p:[0,.17,0]}]];for(let i=0;i<20;i++){const t=i/20*6.283;A.push([kb(3.2,2.4+(i%2)*.6,1.4),'#d8dee4',{p:[Math.cos(t)*11.2,1.2,Math.sin(t)*7.3],r:[0,-t+Math.PI/2,0]}])}
  const [c,d]=PL(...C0,-12,10);landmark(sp,c,d,0,A,E,{metal:.2,rough:.6,lift:-.1})}
 {const E=[9],C0=[40,22];const P=[[kcy(10,10,.3,24),'#5a6268',{p:[0,.15,0]}]];for(const [x,z,r] of [[0,0,5],[-7,3,3],[6,-4,3.4]])P.push([tg(hemi(r,18),{}),'#e8ecef',{p:[x,.3,z]}],[ring(r,.12,18),'#3a4a5a',{p:[x,.35,z]}]);
  for(const [x,z] of [[7,6],[-6,-6]])P.push([kb(.3,12,.3),'#8a949c',{p:[x,6,z]}],[kb(2,.2,.2),'#8a949c',{p:[x,11,z]}],[ks(.3,6,4),'#ff5a4a',{p:[x,12.2,z]}]);for(let i=0;i<24;i++){const t=i/24*6.283;P.push([kb(.1,1.8,2.6),'#8a949c',{p:[Math.cos(t)*10,.9,Math.sin(t)*10],r:[0,-t,0]}])}
  landmark(sp,...C0,0,P,E,{metal:.4,rough:.4,win:'#cfe6ff'})}
 {const E=[8,9],C0=[38,-100];for(const [dn,de,h] of [[10,0,0],[-8,8,1],[-6,-10,2]]){const [a,b]=PL(...C0,dn,de);landmark(sp,a,b,h*2.1,[[kb(4,2,4),'#d8d2c4',{p:[0,1,0]}],[kcy(.8,1,4,8),'#e8b830',{p:[0,4,0]}],[ks(.9,10,8),'#e8b830',{p:[0,6.8,0]}],[kcy(.35,.3,3.4,6),'#e8b830',{p:[1.3,4.4,0],r:[0,0,-.4-h*.3]}],[kcy(.35,.3,3.4,6),'#e8b830',{p:[-1.3,4.6,0],r:[0,0,.9]}],[kcy(.4,.35,3.2,6),'#e8b830',{p:[.5,1.6+2,0]}],[kb(2.8,3.6,.12),'#c83a3a',{p:[0,4.4,-1],r:[.15,0,0]}]],E,{metal:.7,rough:.3})}}}


/* flying traffic: little cars streaming round a city in rings at several heights, lights on at night */
function trafficRings(sp,la,lo,rings,eras){const cg=G([[tg(new THREE.SphereGeometry(1,10,6),{s:[1.6,.5,.8]}),'#e8ecef',{}],[tg(new THREE.SphereGeometry(1,10,4,0,6.283,0,1.2),{s:[1,.45,.7]}),'#2a4a6a',{p:[-.2,.2,0]}]]);
 const per=30,cars=[];rings.forEach(([r,alt],j)=>{for(let i=0;i<per;i++)cars.push({r,alt,ph:i/per*6.283+h3(j,i,5)*.15,sp:(j%2?1:-1)*(.02+j*.003),dz:(h3(i,j,9)-.5)*2})});
 const im=new THREE.InstancedMesh(cg,VC({roughness:.3,metalness:.5,emissive:'#202830'}),cars.length);im.frustumCulled=false;addTo(sp,im,eras);const o=new THREE.Object3D(),q=V3(),q2=V3();const cl=Math.max(.2,Math.cos(la*D2R));
 const at2=(c,t,out)=>{const a=la+Math.cos(t)*c.r/17.45,b=lo+Math.sin(t)*c.r/17.45/cl;return dirLL(a,b,out).multiplyScalar(R+Math.max(sp.gh(a,b),0)+c.alt+c.dz)};
 const nl=nightPoints(cars.map(()=>V3()),'#ffe8b0',2,1);nl.frustumCulled=false;addTo(sp,nl,eras);sp.nightMats.push(nl.userData.night);const np=nl.geometry.attributes.position;const C0=dirLL(la,lo).multiplyScalar(R);
 anim(sp,null,T=>{const far=camera.position.distanceTo(C0)>2600;im.visible=nl.visible=!far&&eraOk(eras);if(far)return;cars.forEach((c,i)=>{const t=c.ph+T*c.sp;at2(c,t,q);at2(c,t+.01*Math.sign(c.sp),q2);o.position.copy(q);o.up.copy(q).normalize();o.lookAt(q2);o.rotateY(-Math.PI/2);o.scale.setScalar(1.2);o.updateMatrix();im.setMatrixAt(i,o.matrix);np.setXYZ(i,q.x,q.y,q.z)});im.instanceMatrix.needsUpdate=true;np.needsUpdate=true})}

/* 扭腰城: one of Erxi's most developed cities — a downtown of supertall towers round a central plaza,
   an elevated rail ring, a stadium, huge screens, and air traffic in every lane */
function niuyaoDetail(sp){const E=[8,9,10,11,12],C0=[38.5,101],GL='#3a5a7a',DK='#3a4a5a';const tm=towerMat({metalness:.55,roughness:.25,win:'#cfe6ff'});sp.towerMats.push(tm);
 const TT=TOWNKIT.future.kits('#3a4a5a').t;
 // downtown: twenty supertalls in two rings; the tallest twisted one at the north side
 {const pts=[];for(let i=0;i<8;i++)pts.push([12,i/8*6.283+.2,3.2]);for(let i=0;i<12;i++)pts.push([21,i/12*6.283,2.2]);
  pts.forEach(([d,a,k],i)=>{const [la,lo]=PL(...C0,Math.cos(a)*d,Math.sin(a)*d);const m=new THREE.Mesh(TT[i%TT.length],tm);frameLL(sp,la,lo,-.3,a,m);const h=k*(.8+h3(i,3,1)*.7);m.scale.set(1.6,h,1.6);addTo(sp,m,E);cull(m,null,60,2600)});
  // the twisting tower: stacked plates each turned a little more
  {const P=[];for(let k=0;k<40;k++)P.push([kb(5-k*.04,1.6,5-k*.04),k%4===3?GL:'#ffffff',{p:[0,k*1.6+.8,0],r:[0,k*.06,0]}]);P.push([kc(1.4,8,8),'#d8dee4',{p:[0,68,0]}]);const [la,lo]=PL(...C0,-5,2);landmark(sp,la,lo,0,P,E,{mat:tm,far:3000})}}
 // central plaza: a sunken amphitheatre, a hologram column, screens on four posts
 {const P=[[kcy(9,9,.3,32),'#d8dee4',{p:[0,.15,0]}],[kcy(6,4,1.4,32),'#9aa4ac',{p:[0,-.5,0]}],[kcy(.6,.8,8,12),'#e8ecef',{p:[0,4,0]}],...[2,4,6].map((y,i)=>[ring(1.6+i*.3,.08,20),'#6ad0ff',{p:[0,y,0]}])];
  for(let i=0;i<4;i++){const a=i*1.5708+.785;P.push([kb(.4,9,.4),'#8a949c',{p:[Math.cos(a)*8,4.5,Math.sin(a)*8]}],[kb(5,3,.2),i%2?'#ff7ad0':'#6ad0ff',{p:[Math.cos(a)*8,8,Math.sin(a)*8],r:[0,-a+Math.PI/2,0]}])}
  const [la,lo]=PL(...C0,4,-3);landmark(sp,la,lo,0,P,E,{mat:tm})}
 // elevated rail ring on columns, with trains running
 {const pts=[];const Rr=30;for(let i=0;i<=120;i++){const a=i/120*6.283;const [la,lo]=PL(...C0,Math.cos(a)*Rr,Math.sin(a)*Rr);pts.push(dirLL(la,lo).multiplyScalar(R+Math.max(sp.gh(la,lo),0)+12))}
  const cv=new THREE.CatmullRomCurve3(pts,true);const rail=new THREE.Mesh(new THREE.TubeGeometry(cv,360,.9,5,true),VC({color:'#d8dee4',metalness:.6,roughness:.3}));addTo(sp,rail,E);cull(rail,null,60,2400);
  const cols=[];for(let i=0;i<40;i++){const a=i/40*6.283;cols.push([...PL(...C0,Math.cos(a)*Rr,Math.sin(a)*Rr),0,0])}inst(kcy(.5,.7,12,6),VC({color:'#9aa4ac',metalness:.4}),cols,(o,p)=>{frameLL(sp,p[0],p[1],5.6,0,o)},E,{far:2000});
  const tg2=G([[kb(14,1.6,1.8),'#ffffff',{p:[0,1.2,0]}],[kb(14.1,.5,1.84),GL,{p:[0,1.4,0]}]]);const trains=[0,.5].map(u=>{const m=new THREE.Mesh(tg2,VC({metalness:.5,roughness:.3}));addTo(sp,m,E);return{m,u}});const tp=V3(),tq=V3();
  anim(sp,null,T=>trains.forEach(k=>{const u=(k.u+T*.006)%1;cv.getPointAt(u,tp);cv.getPointAt((u+.002)%1,tq);k.m.position.copy(tp);k.m.up.copy(tp).normalize();k.m.lookAt(tq);k.m.rotateY(Math.PI/2)}))}
 // stadium
 {const P=[[tg(new THREE.CylinderGeometry(1,1,.3,40),{s:[14,1,10]}),'#5aaa5a',{p:[0,.15,0]}]];for(let i=0;i<32;i++){const a=i/32*6.283;P.push([kb(3.4,5,1.6),'#e8ecef',{p:[Math.cos(a)*15.5,2.5,Math.sin(a)*11.5],r:[0,-a+Math.PI/2,.0]}])}P.push([tg(new THREE.TorusGeometry(1,.06,4,40),{r:[Math.PI/2,0,0],s:[16,11.8,1]}),'#8a949c',{p:[0,5.4,0]}]);
  const [la,lo]=PL(...C0,40,30);landmark(sp,la,lo,.4,P,E,{mat:tm,far:2400})}
 trafficRings(sp,...C0,[[16,40],[28,55],[40,30],[52,70],[64,45]],E)}
