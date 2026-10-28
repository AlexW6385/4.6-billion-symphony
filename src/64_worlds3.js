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
  crystals:{n:900,col:'#d8f0ff',em:'#5ab0e0'},belt:{n:900,disc:1,r:[1.7,2.15],s:[8,48],col:'#c8d4dc',metal:.6,rough:.35}},
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
  junk:{n:5200}},
 // 熔毁地带 (ages 8–9): a living molten world, black ash crust split by glowing cracks and lava lakes; the broken orange world of the gentle demons floats round it
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
 amber:{home:{a:6,b:10,alt:2600},
  height:p=>{const n=fbm(p.x*3+21,p.y*3,p.z*3,5),r=1-Math.abs(fbm(p.x*6,p.y*6+2,p.z*6,4)*2-1);return 2+(n-.5)*20+Math.pow(r,4)*24},
  col:(p,h,lat,o)=>{o.set('#e8902a').lerp(C('#c85a1a'),n3(p.x*8,p.y*8,p.z*8)*.8);if(h>12)o.lerp(C('#ffb850'),sm(12,30,h)*.6);o.lerp(C('#ffd080'),sm(.66,.82,n3(p.x*28,p.y*28,p.z*28))*.4)},
  ocean:{deep:'#a04a10',shal:'#e8902a'},atm:'#ff8a30',atmK:.6,clouds:{cov:.12,col:'#ffd8a0'},rough:.18,metal:.25,bump:.5,rock:'#c86a2a',
  sky:{zen:'#7a4a90',hor:'#ffc890',set:'#ff9a60'},envTop:'#ffb070',envMid:'#ffd8a8',envBot:'#7a3a10',hemiSky:0xffc890,
  props:[{geo:'lump',flat:1,n:260,col:'#f0a040',em:'#a04a10',ei:.35,rough:.25,alt:[60,220],scale:[4,26],stretch:[1,.5,1],minH:-99,far:4000},
   {geo:'cyl',n:200,col:'#ffe0b0',em:'#ffb060',ei:.5,pulse:.9,rough:.3,alt:[64,226],scale:[.6,2],stretch:[1,6,1],minH:-99,test:(la,lo,h)=>n3(la*.3,lo*.3,2)>.5,far:3000}]},
 // 痛苦巴士 (age 11): a living bus-planet kept in a cycle of pain: an almost empty grey-red land, brain tanks and red breeding pods,
 // red fog seeping from the cracks
 painbus:{home:{a:6,b:-20,alt:2600},
  height:p=>{const n=fbm(p.x*3+21,p.y*3,p.z*3,5),r=1-Math.abs(fbm(p.x*6,p.y*6+2,p.z*6,4)*2-1);return 2+(n-.5)*20+Math.pow(r,4)*24},
  col:(p,h,lat,o)=>{o.set('#6a5a58').lerp(C('#4a3a3a'),n3(p.x*8,p.y*8,p.z*8)*.8);const cr=Math.abs(fbm(p.x*9+4,p.y*9,p.z*9,3)*2-1);if(cr<.05)o.lerp(C('#c8201a'),sm(.05,0,cr)*.9);o.lerp(C('#8a6a62'),sm(.66,.82,n3(p.x*28,p.y*28,p.z*28))*.4)},
  ocean:{deep:'#4a0a0a',shal:'#8a1a14'},atm:'#ff4a3a',atmK:1.2,clouds:{cov:.5,col:'#c84a40'},rough:.85,metal:.05,rock:'#5a4a48',
  sky:{zen:'#3a1418',hor:'#b84a40',set:'#ff6a4a',nightZ:'#060204',nightH:'#2a0808'},envTop:'#8a3a34',envMid:'#a8605a',envBot:'#2a1818',hemiSky:0xff8a80,sunI:.9,
  props:[{geo:'cyl',n:160,col:'#d8f0f4',op:.45,rough:.05,metal:.2,scale:[2,3.4],stretch:[1,6,1]},
   {geo:'sphere',n:420,col:'#b81a1a',em:'#5a0606',ei:.6,pulse:.7,rough:.4,scale:[1.2,3.6],stretch:[1,.8,1]}],
  fog:{n:6,col:'#a81812'}},
 // 尔什's moon in age 9, the quarantine of possible ends of the world: a small town and a red-brick mansion round one pole,
 // and ten wedge-shaped end-worlds round it, each its own land and colour, walled off from the next
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
/* 绒球之境 (ages 3–5, 8): 琳's own first dream, run by a small sleeping brain — one continent in a sea that loops ships back,
   stones that float for no reason and more than one sun in the sky; the blue-moon battlefield, the jungle, the ash plain and
   the volcano with hell behind it lie on the continent */
W3.rqdream={home:{a:22,b:0,alt:2600},sunLon:20,suns:['#ffe0a0','#ffb0c0'],
 height:p=>{const a=angDeg(p,RQD_C),n=fbm(p.x*3+2,p.y*3,p.z*3,5),m=1-a/48+(n-.5)*.5;if(m<0)return Math.max(-60,m*120)-2;
  const v=angDeg(p,RQD_V);return 2+m*20+Math.pow(fbm(p.x*7,p.y*7,p.z*7,4),2)*40*Math.min(1,m*2)+Math.max(0,1-v/5)*70},
 col:(p,h,lat,o)=>{if(h<0){o.set('#2a5a9a');return}if(h<2.2){o.set('#e8d8b0');return}
  o.set('#5a9a4a').lerp(C('#3a7a3a'),n3(p.x*9,p.y*9,p.z*9)*.7);
  if(angDeg(p,RQD_B)<9)o.lerp(C('#6a5a9a'),.75);if(angDeg(p,RQD_A)<8)o.lerp(C('#8a8a88'),.8);const v=angDeg(p,RQD_V);if(v<7)o.lerp(C('#4a2a22'),1-v/7);if(h>40)o.lerp(C('#8a7a90'),sm(40,70,h))},
 ocean:{deep:'#1a2a6a',shal:'#3a8ac8'},atm:'#b0a0ff',clouds:{cov:.35,col:'#f0e8ff'},rough:.85,
 sky:{zen:'#5a50b0',hor:'#d8c8ff',set:'#ffa0c0',nightZ:'#0a0820',nightH:'#2a1a40'},envTop:'#b8a8ff',envMid:'#d8d0f0',envBot:'#3a3048',hemiSky:0xc8b8ff,
 props:[{geo:'lump',n:220,col:'#8a8078',alt:[30,160],scale:[1.5,7],minH:-99,far:3000},
  {geo:'cyl',n:260,col:'#b890ff',em:'#7040d0',ei:.6,pulse:1.2,rough:.2,scale:[.5,1.4],stretch:[1,5,1],test:(la,lo)=>angDeg(dirLL(la,lo),RQD_B)<8}]};
const RQD_C=dirLL(22,0),RQD_B=dirLL(30,-14),RQD_A=dirLL(12,14),RQD_V=dirLL(34,18);
/* 梦的泥海 (age 11): the empty shell of the Sea of Creation's mind — a plain of stone pillars hundreds of km tall with round
   platforms on top, a wind that never stops, and a glowing sea of thick dream-mud to the horizon */
W3.mudsea={home:{a:10,b:-30,alt:2600},sunLon:-20,dayLen:1e12,
 height:p=>{const la=Math.asin(clamp(p.y,-1,1))/D2R,n=fbm(p.x*3,p.y*3+4,p.z*3,4);if(la<20+(n-.5)*20)return -4;return 1.5+(n-.5)*3},
 col:(p,h,lat,o)=>{if(h<0){o.set('#8a6a30');return}o.set('#6a6878').lerp(C('#4a4858'),n3(p.x*10,p.y*10,p.z*10)*.7)},
 ocean:{deep:'#7a5a20',shal:'#ffd070'},atm:'#ffc870',atmK:.8,clouds:{cov:.5,col:'#a89880'},rough:.9,
 sky:{zen:'#1a1830',hor:'#6a5a70',set:'#c8905a',nightZ:'#04040a',nightH:'#1a1420'},envTop:'#3a3450',envMid:'#6a6070',envBot:'#2a2420',hemiSky:0x9a90b0,sunI:.7,
 props:[{geo:'cyl',n:70,col:'#7a7480',rough:.9,scale:[1.4,2],stretch:[1,120,1],test:(la)=>la>24,far:6000},
  {geo:'sphere',n:400,col:'#ffe0a0',em:'#ffb040',ei:1,pulse:1.8,scale:[.4,1],alt:[2,40],minH:-99,sea:1,far:2500}]};
/* 飘浮岩地 · 神民之国 (ages 7–8): the visitor stands on the floating continent that holds the city of the god-folk; all round, in a
   black sky, the field of floating rocks (the remains of star buses that fell apart) and, far off, the black fog at its centre */
W3.piaofu={home:{a:20,b:10,alt:2600},sunLon:40,dayLen:1e12,
 height:p=>{const n=fbm(p.x*3.5+8,p.y*3.5,p.z*3.5,5),r=1-Math.abs(fbm(p.x*6,p.y*6+3,p.z*6,4)*2-1);return 3+(n-.5)*30+Math.pow(r,4)*40},
 col:(p,h,lat,o)=>{o.set('#6a625a').lerp(C('#4a4440'),n3(p.x*10,p.y*10,p.z*10)*.8);o.lerp(C('#5a6a4a'),sm(.55,.75,n3(p.x*4,p.y*4,p.z*4))*.5);if(h>30)o.lerp(C('#8a8278'),sm(30,60,h)*.6)},
 ocean:{deep:'#101014',shal:'#202028'},atm:'#4a4a60',atmK:.25,clouds:false,rough:.9,
 sky:{zen:'#05050c',hor:'#141420',set:'#3a3040',nightZ:'#020205',nightH:'#08080e'},envTop:'#3a3a50',envMid:'#5a5660',envBot:'#1a1816',sunI:1,
 props:[{geo:'lump',n:420,col:'#5a544e',alt:[80,700],scale:[3,40],minH:-99,far:6000},{geo:'lump',n:160,col:'#4a4842',alt:[700,1600],scale:[30,120],minH:-99,far:9000}],
 cities:[[22,12,3.2]],cityCol:'#b8aa98',belt:{n:700,r:[1.5,2.6],s:[20,110],col:'#5a544e',thick:.5,tilt:.5},
 swarmFar:{col:'#08080a',at:[-1,.2,.3],d:7000,r:1600}};
/* 凤凰的恒星 (age 10): a star almost wholly covered by a shell of kilometre platforms, each with its own gravity; the star's light
   leaks up through the gaps between them. Square cells on the globe give the platforms, a level each; the gaps are the star */
W3.phoenix={home:{a:16,b:20,alt:2600},sunLon:0,dayLen:1e12,sunI:.5,
 height:p=>{const c=phCell(p);if(c.gap)return -6;return 4+c.lv*5},
 col:(p,h,lat,o)=>{if(h<0){o.set('#ffb030');return}const c=phCell(p);o.set(['#c8c0b8','#a8b0c0','#d8c8a8','#b8c8d0','#e0d0c0','#9aa0a8'][c.t]);o.offsetHSL(0,0,(n3(p.x*40,p.y*40,p.z*40)-.5)*.08)},
 ocean:{deep:'#ffd060',shal:'#fff0b0'},atm:'#ffb040',atmK:.9,clouds:false,rough:.5,metal:.4,bump:.3,rock:'#a8a098',
 sky:{zen:'#120806',hor:'#5a2a10',set:'#ff9030',nightZ:'#120806',nightH:'#5a2a10'},envTop:'#ffb060',envMid:'#806050',envBot:'#ffd080',hemiSky:0xffc070,hemiGnd:0xffa030,
 props:[{geo:'sphere',n:500,col:'#ffe070',em:'#ffb020',ei:1.2,pulse:1.4,scale:[.6,1.6],alt:[1,30],minH:-99,sea:1,far:2400}],
 belt:{n:600,disc:1,r:[1.35,1.4],s:[20,40],col:'#ffd890',metal:.3,rough:.4,thick:.004,tilt:.12}};
/* the platform cells of the phoenix star: a 3D grid cut on the sphere, each cell a level and a kind, a gap round its edge */
function phCell(p){const k=12,x=p.x*k,y=p.y*k,z=p.z*k,ix=Math.floor(x),iy=Math.floor(y),iz=Math.floor(z),fx=x-ix,fy=y-iy,fz=z-iz;
 const q=Math.sin(ix*127.1+iy*311.7+iz*74.7)*43758.5,h=q-Math.floor(q);const e=.11;const ax=Math.abs(p.x),ay=Math.abs(p.y),az=Math.abs(p.z);
 const gap=(ax<ay||ax<az?(fx<e||fx>1-e):0)||(ay<ax||ay<az?(fy<e||fy>1-e):0)||(az<ax||az<ay?(fz<e||fz>1-e):0);return{gap,lv:Math.floor(h*4),t:Math.floor(h*97)%6}}
/* 恒星巴士 (age 6): 琳's star bus, a living world grown from a slime on a floating rock — snow-white and nearly as cold as the
   void when first met; after the revenge battle a spiral crater of lava, wreckage and rock winds down toward its core and black
   spears stand all over it under a dust-dark sky; later the planet-fortress */
W3.starbus={home:{a:10,b:0,alt:2600},sunLon:30,
 height:p=>{const n=fbm(p.x*3+6,p.y*3,p.z*3,5),a=angDeg(p,SB_C);let h=3+(n-.5)*22;
  if(a<26){const lo=Math.atan2(p.x,p.z)*3.2+a*.38,sp=Math.abs(Math.sin(lo));h=Math.max(1.2,h-(1-a/26)*(14+12*(1-sp)))}return h},
 col:(p,h,lat,o)=>{const a=angDeg(p,SB_C);o.set('#e8eef2').lerp(C('#c8d0d8'),n3(p.x*9,p.y*9,p.z*9)*.7);
  if(a<30){const k=1-sm(18,30,a);o.lerp(C('#3a3230'),k*.85);if(a<26){const sp=Math.abs(Math.sin(Math.atan2(p.x,p.z)*3.2+a*.38));if(sp<.18)o.lerp(C('#ff6a20'),(1-sp/.18)*.9)}}if(h<0)o.set('#9aa8b4')},
 ocean:{deep:'#6a7480',shal:'#9aa8b4'},atm:'#a8b0b8',atmK:.6,clouds:{cov:.4,col:'#8a8a8a'},rough:.8,
 sky:{zen:'#2a2a30',hor:'#7a7470',set:'#c08060',nightZ:'#050506',nightH:'#151416'},envTop:'#8a8a90',envMid:'#c8ccd0',envBot:'#3a3a3a',sunI:.85,
 props:[{geo:'cyl',n:340,col:'#141416',metal:.6,rough:.3,scale:[.5,1.1],stretch:[1,26,1]}]};
const SB_C=dirLL(10,0);
/* 织梦者之地 (ages 7–8): a lone world adrift in the void, drowned in an ocean of black fog made of grit; stone pillars hundreds of
   metres high stand out of it as if built, and the soft mud of the land evaporates up into the fog, so the land sinks year by year */
W3.zhimeng={home:{a:12,b:30,alt:2600},sunLon:20,dayLen:1e12,sunI:.7,
 height:p=>{const n=fbm(p.x*2.6+12,p.y*2.6,p.z*2.6,5);if(n<.5)return -6-(.5-n)*20;return 1+(n-.5)*24},
 col:(p,h,lat,o)=>{if(h<0){o.set('#1a1a1e');return}o.set('#5a4a3a').lerp(C('#3a3028'),n3(p.x*12,p.y*12,p.z*12)*.8);if(h>6)o.lerp(C('#6a6260'),sm(6,14,h))},
 ocean:{deep:'#0a0a0c',shal:'#2a2a30'},atm:'#4a4a52',atmK:1.2,clouds:{cov:.62,col:'#3a3a40'},rough:.95,
 sky:{zen:'#0a0a10',hor:'#3a3a44',set:'#6a5a50',nightZ:'#040406',nightH:'#14141a'},envTop:'#3a3a44',envMid:'#5a5a60',envBot:'#1a1816',
 props:[{geo:'cyl',n:220,col:'#7a7470',rough:.9,scale:[2,4],stretch:[1,40,1],minH:-99,far:5000},
  {geo:'sphere',n:6,col:'#1a1a1e',scale:[1,1],minH:99}],
 fog:{n:10,col:'#202024'}};
/* 护核者之地 (ages 6–7): a rich world of thick air where a dream lies over the real ground — a jungle town of floating olive-shaped
   creatures, a sea of white fog below the cliffs, a volcano lake */
W3.huhe={home:{a:8,b:-20,alt:2600},sunLon:-10,
 height:p=>{const n=fbm(p.x*3+40,p.y*3,p.z*3,5),v=angDeg(p,HH_V);if(n<.42)return -3-(.42-n)*20;return 3+(n-.42)*60+Math.pow(fbm(p.x*7,p.y*7,p.z*7,4),2)*30+Math.max(0,1-v/4)*50},
 col:(p,h,lat,o)=>{if(h<0){o.set('#d8dee4');return}if(h<3.5){o.set('#8a8a7a');return}o.set('#3a8a3a').lerp(C('#2a6a3a'),n3(p.x*9,p.y*9,p.z*9)*.8);
  const v=angDeg(p,HH_V);if(v<5)o.lerp(C('#4a3a34'),1-v/5);if(h>40)o.lerp(C('#6a7a5a'),sm(40,70,h))},
 ocean:{deep:'#c8d0d8',shal:'#f0f4f8'},atm:'#a8d8b0',atmK:1.3,clouds:{cov:.5},rough:.85,
 sky:{zen:'#4a8ac8',hor:'#c8e0d8',set:'#f0b880'},
 props:[{geo:'sphere',n:420,col:'#c8c870',em:'#4a5a10',ei:.3,rough:.5,alt:[8,40],scale:[.8,2.2],stretch:[1,1.6,1],test:(la,lo)=>angDeg(dirLL(la,lo),dirLL(8,-20))<14}]};
const HH_V=dirLL(-6,-6);
/* 废墟 · 引力球 (age 7): a hollow rogue world that keeps rebuilding itself out of wreckage, inside a ring of debris; a ball of water
   hangs in its sky */
W3.feixu={home:{a:10,b:20,alt:2600},sunLon:40,
 height:p=>{const n=fbm(p.x*3.4+3,p.y*3.4,p.z*3.4,5),c=fbm(p.x*9+1,p.y*9,p.z*9,3);let h=2+(n-.5)*26;if(c>.62)h-=(c-.62)*60;return Math.max(.5,h)},
 col:(p,h,lat,o)=>{o.set('#5a5048').lerp(C('#3a3430'),n3(p.x*10,p.y*10,p.z*10)*.8);o.lerp(C('#7a6a58'),sm(.6,.8,n3(p.x*30,p.y*30,p.z*30))*.5);if(h<2)o.lerp(C('#2a2624'),.5)},
 ocean:{deep:'#202024',shal:'#303034'},atm:'#7a7068',atmK:.4,clouds:false,rough:.9,
 sky:{zen:'#08080c',hor:'#2a2624',set:'#6a4a3a',nightZ:'#040406',nightH:'#100e0c'},envTop:'#4a4440',envMid:'#6a6058',envBot:'#1a1816',
 junk:{n:3200},belt:{n:900,r:[1.3,1.9],s:[6,40],col:'#6a6058',thick:.06,tilt:.25},
 ball:{col:'#4a8ac8',at:[.5,.6,-.6],d:3200,r:260}};
/* 荒涡 · 静止之源 (age 12): a vast ring-shaped mouth surrounded by tens of thousands of shelled cities, a blue stasis glowing inside */
W3.huangwo={home:{a:30,b:0,alt:2600},sunLon:10,
 height:p=>{const a=angDeg(p,HW_C),n=fbm(p.x*3+9,p.y*3,p.z*3,5);if(a<30)return -10-(30-a)*1.2;if(a<38)return 6+(38-a)*3+(n-.5)*6;return 3+(n-.5)*14},
 col:(p,h,lat,o)=>{const a=angDeg(p,HW_C);if(h<0){o.set('#2a6aff');return}o.set('#8a8478').lerp(C('#6a645a'),n3(p.x*9,p.y*9,p.z*9)*.8);if(a<40)o.lerp(C('#5a5a68'),.5)},
 ocean:{deep:'#1a4aff',shal:'#8ad8ff'},atm:'#9ab0d8',atmK:.4,clouds:false,rough:.8,
 sky:{zen:'#203050',hor:'#a8b8d0',set:'#d0a080'},
 props:[{geo:'sphere',n:1400,col:'#c8b8a0',metal:.3,rough:.4,flat:1,scale:[1,3.5],test:(la,lo)=>{const a=angDeg(dirLL(la,lo),HW_C);return a>38&&a<90}},
  {geo:'sphere',n:300,col:'#c8f0ff',em:'#4ab0ff',ei:1,pulse:.6,scale:[.8,2],alt:[2,60],minH:-99,sea:1}]};
/* 玛尔斯 (age 7): a small low-gravity desert of red-grey dunes, no sea; the 尔什 emigrants' white cylinder camps, the buried
   town in its pit, half-buried wrecks of the emigrant ships, the rock-skins' needle spires, dry riverbeds and a red canyon */
/* 绿色气态巨星 (age 10): a 120,000 km emerald storm giant — no ground, only churning cloud bands with green lightning; round it ride
   the blue moon 阿拉密斯 with its stone-bamboo fields and the grey machine moon over its hidden dust sea, and the orange crystal saw */
W3.fhgas={home:{a:12,b:0,alt:3000},sunLon:20,
 height:p=>{const n=fbm(p.x*2+3,p.y*9,p.z*2,4);return 2+n*6},
 col:(p,h,lat,o)=>{const w=fbm(p.x*2.5,p.y*2.5,p.z*2.5,4),b=Math.sin(lat*.35+w*3),b2=Math.sin(lat*1.1+w*6);o.set('#1a6a40').lerp(C('#7ae8a8'),b*.5+.5);o.lerp(C('#c8f0a8'),sm(.7,1,b2)*.35);o.lerp(C('#0a3a20'),sm(.75,.9,n3(p.x*6,p.y*6,p.z*6))*.25)},
 ocean:{deep:'#0a4a2a',shal:'#2a8a5a'},atm:'#7ae8a8',atmK:.8,clouds:true,rough:.6,
 sky:{zen:'#0a2a1a',hor:'#6ad89a',set:'#d8a050',nightZ:'#020804',nightH:'#0a1a10'},envTop:'#4aa878',envMid:'#2a8a5a',envBot:'#0a2a1a',
 props:[{geo:'sphere',n:260,col:'#d8ffe8',em:'#6aff9a',ei:1.2,pulse:1.4,scale:[.4,1.2],alt:[4,40]}],
 belt:{n:300,r:[1.8,2.2],s:[4,16],col:'#8a9a90',thick:.02,tilt:.15},
 fog:{n:12,col:'#3aa86a'}};
/* 球神的世界 (age 10): a dim 3,000 km ember ball of grey ruins, rare lakes and a pure-gold canyon; tier on tier of floating overpass
   bridges, crusted with dead cities, shade it from the stars; a pitch-black pillar-god climbs from the ground into the void */
const QS_GOLD=[-14,38];
W3.qiushen={home:{a:6,b:14,alt:2600},sunLon:60,sunI:.7,
 height:p=>{const n=fbm(p.x*3+1,p.y*3,p.z*3,5),g=angDeg(p,dirLL(...QS_GOLD));let h=4+(n-.5)*18;if(g<4)h-=(4-g)*4;return Math.max(.5,h)},
 col:(p,h,lat,o)=>{o.set('#5a5450').lerp(C('#3a3634'),n3(p.x*9,p.y*9,p.z*9)*.8);if(angDeg(p,dirLL(...QS_GOLD))<4)o.set('#e8c050');o.lerp(C('#8a3a20'),sm(.7,.85,n3(p.x*30,p.y*30,p.z*30))*.4);if(h<1.5)o.lerp(C('#2a3034'),.6)},
 ocean:{deep:'#1a2024',shal:'#2a3034'},atm:'#8a7a70',atmK:.4,clouds:false,rough:.95,
 sky:{zen:'#0c0a0a',hor:'#3a302a',set:'#6a3a2a',nightZ:'#040404',nightH:'#100c0a'},envTop:'#3a3430',envMid:'#5a5048',envBot:'#1a1614',
 junk:{n:2400},belt:{n:500,r:[1.6,2.1],s:[6,30],col:'#5a5450',thick:.05,tilt:.2},
 more:(sp,Rn)=>{const o=new THREE.Object3D(),bm=new THREE.MeshStandardMaterial({color:'#6a645c',roughness:.85,metalness:.2}),im=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),bm,420);
  for(let i=0;i<420;i++){const la=(Rn()-.5)*150,lo=Rn()*360-180;frameLL(sp,la,lo,40+Math.floor(Rn()*4)*30,Rn()*6.28,o);o.scale.set(6+Rn()*8,1.2,60+Rn()*140);o.updateMatrix();im.setMatrixAt(i,o.matrix)}
  im.frustumCulled=false;im.userData.noShadow=1;sp.scene.add(im);
  const pg=new THREE.Mesh(new THREE.CylinderGeometry(14,18,9000,12),new THREE.MeshStandardMaterial({color:'#060608',roughness:.3,metalness:.4}));frameLL(sp,48,-70,4500,0,pg);pg.userData.noShadow=1;sp.scene.add(pg)}};
/* 先祖之地 (age 10): an irregular boulder over 100,000 km across — a white snowfield with a 3,000 m peak where the phoenixes landed,
   the blood-red torch-brain mountain, the 30 km collecting pit, the 绒球 spring pit, and far off a black swamp */
const XZ_SNOW=[10,0],XZ_RED=[3,-12],XZ_PIT=[17,-9],XZ_SPRING=[22,-14],XZ_SWAMP=[-35,120];
W3.xianzu={home:{a:10,b:0,alt:2600},sunLon:10,
 height:p=>{const n=fbm(p.x*1.2+4,p.y*1.6,p.z*1.1,5),d=fbm(p.x*6,p.y*6,p.z*6,3),b=fbm(p.x*.6+9,p.y*.6,p.z*.6,2);let h=8+(n-.5)*90+(b-.5)*160+(d-.5)*10;
  const r=angDeg(p,dirLL(...XZ_RED));if(r<3)h+=(3-r)*8;const k=angDeg(p,dirLL(...XZ_PIT));if(k<2.5)h-=(2.5-k)*10;
  const sw=angDeg(p,dirLL(...XZ_SWAMP));if(sw<14)h=Math.min(h,1.2+(sw/14)*4);return Math.max(.6,h)},
 col:(p,h,lat,o)=>{o.set('#6a6460').lerp(C('#4a4440'),n3(p.x*8,p.y*8,p.z*8)*.8);{const a=angDeg(p,dirLL(...XZ_SNOW))+(n3(p.x*14,p.y*14,p.z*14)-.5)*8;o.lerp(C('#f4f4f8'),(1-sm(18,24,a))*.9)}if(angDeg(p,dirLL(...XZ_RED))<3.5)o.set('#a01818');if(angDeg(p,dirLL(...XZ_SWAMP))<14)o.set('#141412')},
 ocean:{deep:'#0c0c0a',shal:'#1a1a14'},atm:'#a8b0c0',atmK:.35,clouds:false,rough:.9,
 sky:{zen:'#101418',hor:'#5a6470',set:'#a08060'},
 props:[{geo:'cyl',n:200,col:'#ffb040',em:'#ff8020',ei:1,pulse:.8,scale:[.4,.8],stretch:[1,4,1],test:(la,lo)=>angDeg(dirLL(la,lo),dirLL(...XZ_SNOW))<24},
  {geo:'cyl',n:300,col:'#3a3028',rough:.9,scale:[.3,.6],stretch:[1,8,1],test:(la,lo)=>{const a=angDeg(dirLL(la,lo),dirLL(...XZ_SNOW));return a>20&&a<30}}],
 fog:{n:6,col:'#2a2a24',test:(la,lo)=>angDeg(dirLL(la,lo),dirLL(...XZ_SWAMP))<12}};
/* 巴士会议 (age 9): a cloud-choked green world, layer on layer of dry moss crust, thousands of 300 m tower-peaks whose mouths fire green
   disintegrating spheres; the council's other buses hang round it, with the cyan fog and the small built star */
W3.bashihui={home:{a:5,b:0,alt:2600},sunLon:30,
 height:p=>{const n=fbm(p.x*3+6,p.y*3,p.z*3,5),d=fbm(p.x*16,p.y*16,p.z*16,3);return Math.max(2.5,8+(n-.5)*12+(d-.5)*3)},
 col:(p,h,lat,o)=>{o.set('#5a7a3a').lerp(C('#3a5a2a'),n3(p.x*10,p.y*10,p.z*10)*.8);o.lerp(C('#a8a060'),sm(.6,.8,n3(p.x*34,p.y*34,p.z*34))*.35)},
 ocean:{deep:'#1a3a2a',shal:'#3a6a4a'},atm:'#8ad8a0',atmK:.7,clouds:true,rough:.9,
 sky:{zen:'#3a5a48',hor:'#a8c8a0',set:'#d8c080'},
 props:[{geo:'cyl',n:5000,col:'#4a5a38',rough:.8,scale:[.7,1.3],stretch:[1,14,1],flat:1,far:6000,test:(la,lo)=>angDeg(dirLL(la,lo),dirLL(5,0))<40},{geo:'sphere',n:220,col:'#8aff9a',em:'#4aff6a',ei:1.4,pulse:1.2,scale:[.6,1.4],alt:[20,140]}],
 belt:{n:400,r:[1.7,2.3],s:[4,14],col:'#7a8a70',thick:.03,tilt:.2}};
const MR_C=[12,30];
W3.maers={home:{a:12,b:30,alt:2400},sunLon:30,
 height:p=>{const n=fbm(p.x*3+5,p.y*3,p.z*3,5),d=fbm(p.x*14,p.y*14+2,p.z*14,3),r=Math.abs(fbm(p.x*5+7,p.y*5,p.z*5,4)-.5);let h=6+(n-.5)*22+Math.sin(d*40)*1.4;if(r<.03)h-=(.03-r)*160;const a=angDeg(p,dirLL(...MR_C));if(a<3)h-=(3-a)*3;return Math.max(1,h)},
 col:(p,h,lat,o)=>{o.set('#a86a50').lerp(C('#7a5a50'),n3(p.x*8,p.y*8,p.z*8)*.8);o.lerp(C('#c89070'),sm(.55,.8,n3(p.x*40,p.y*40,p.z*40))*.4);if(h<4)o.lerp(C('#6a3a2a'),.5)},
 ocean:{deep:'#3a2a24',shal:'#4a3a30'},atm:'#d8a888',atmK:.5,clouds:false,rough:.95,
 sky:{zen:'#6a5a58',hor:'#d8b8a0',set:'#c87858',nightZ:'#0a0808',nightH:'#1a1210'},envTop:'#8a7468',envMid:'#c8a088',envBot:'#3a2a24',
 props:[{geo:'cyl',n:1200,col:'#f0eee8',rough:.5,scale:[1,2],minH:0,stretch:[1,1.6,1],test:(la,lo)=>{const a=angDeg(dirLL(la,lo),dirLL(...MR_C));return a>2&&a<26}},
  {geo:'cyl',n:220,col:'#5a4038',rough:.9,scale:[.4,.9],stretch:[1,10,1],flat:1,minH:0},
  {geo:'box',n:24,col:'#7a7470',metal:.6,rough:.5,scale:[2,4],stretch:[4,.5,1],test:(la,lo)=>{const a=angDeg(dirLL(la,lo),dirLL(...MR_C));return a<40}}],
 fog:{n:8,col:'#c89070'}};
const HW_C=dirLL(30,0);
/* which end-world of the moon a ground point is in: the core round the north pole, then ten wedges by longitude, walls between */
const DOOM_CORE=64;
function doomSec(p){const la=Math.asin(clamp(p.y,-1,1))/D2R;if(la>DOOM_CORE+2)return{core:1,k:-1};const lo=Math.atan2(p.x,p.z)/D2R+180,k=Math.min(9,Math.floor(lo/36)),e=lo-k*36;
 return{k,wall:la<DOOM_CORE+2&&(e<.7||e>35.3||Math.abs(la-DOOM_CORE)<.7)}}
function doomSecLL(la,lo){if(la>DOOM_CORE+2)return -1;const L=((lo+180)%360+360)%360;return Math.min(9,Math.floor(L/36))}
function buildW3(id){const c=W3[id];
 const sp=makePlanet(id,{height:c.height,colors:oneSet(c.col),ocean:c.ocean,atm:c.atm,atmK:c.atmK,clouds:c.clouds,rough:c.rough,metal:c.metal,bump:c.bump,rock:c.rock,sky:c.sky,
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
 (c.props||[]).forEach((q,k)=>{const geo=q.geo==='sphere'?new THREE.SphereGeometry(1,14,10):q.geo==='cyl'?new THREE.CylinderGeometry(1,1,1,12):q.geo==='box'?new THREE.BoxGeometry(1,1,1):lumpRock(1,k%5+1).clone();
  if(q.geo==='cyl'||q.geo==='box')geo.translate(0,.5,0);if(q.flat){geo.scale(1,.45,1);geo.translate(0,-.2,0)}
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
/* entries of a new world that only have a void-style kit shape get a planet body made from it, scaled to stand on the ground */
function entryKits(sp){WIKI.filter(w=>w.m===sp.id&&w.ll&&!ENT[w.id]&&w.k&&w.k!=='none'&&w.k!=='planet').forEach(w=>{
 ENT[w.id]=[()=>{const g=makeShape(w,sp,false);const b=new THREE.Box3().setFromObject(g),sz=b.getSize(V3());const k=1/Math.max(1e-3,Math.max(sz.x,sz.y,sz.z));g.scale.multiplyScalar(k);
  const w0=new THREE.Group();g.position.y=-b.min.y*k;w0.add(g);return w0},(w.kp&&w.kp.big)||4,{alt:w.alt||0}]})}
for(const id in W3){BUILDERS[id]=()=>buildW3(id);HOME[id]=W3[id].home}
/* 秩序之域 (age 11): a road that goes down through the layers — the graveyard of giant sea-cucumber corpses in the void, the furnished
   second layer, the dark-red corpse heap, green tunnels round an underground lake, the black-cube layer, the rubble of layer 66,
   the gold-lit hall of layer 99. Entries stand at their layer: `layer` picks the point on the road */
ROAD.order=t=>V3(Math.sin(t*Math.PI*5)*620,500-t*2600,Math.cos(t*Math.PI*5)*620);
const ORDER_T={1:.05,2:.16,3:.27,4:.37,5:.45,6:.55,7:.65,66:.8,99:.94};
BUILDERS.order=()=>buildPath('order');HOME.order={a:-620,b:0,alt:1400,head:0,y:300};
function orderMore(sp){const sc=sp.scene,road=sp.road,Rn=rnd(616);
 // layer 1: black spiny corpses of giant sea cucumbers drifting round the top of the road
 {const body=new THREE.CylinderGeometry(1,1,5,10);const spine=new THREE.ConeGeometry(.25,1.4,5);
  const P=[];for(let i=0;i<46;i++){const p=road(Rn()*.12);P.push([p.x+(Rn()-.5)*1400,p.y+(Rn()-.5)*500,p.z+(Rn()-.5)*1400,8+Rn()*Rn()*40,Rn()*6,Rn()*6])}
  const bm=new THREE.MeshStandardMaterial({color:'#18161a',roughness:.7,metalness:.2});const o=new THREE.Object3D();
  const ib=new THREE.InstancedMesh(body,bm,P.length),is=new THREE.InstancedMesh(spine,bm,P.length*14);let k=0;
  P.forEach((q,i)=>{o.position.set(q[0],q[1],q[2]);o.rotation.set(q[4],q[5],0);o.scale.setScalar(q[3]);o.updateMatrix();ib.setMatrixAt(i,o.matrix);const base=o.matrix.clone();
   for(let j=0;j<14;j++){const m=new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(Rn()*6,0,Rn()*6)).setPosition((Rn()-.5)*1.4,(Rn()-.5)*4,(Rn()-.5)*1.4);is.setMatrixAt(k++,base.clone().multiply(m))}});
  ib.frustumCulled=is.frustumCulled=false;sc.add(ib);sc.add(is)}
 // the deeper layers: a soft light of their own colour round their stretch of the road
 const glow=(t0,t1,col,n,size)=>{const a=[];for(let i=0;i<n;i++){const p=road(t0+Rn()*(t1-t0));a.push(V3(p.x+(Rn()-.5)*700,p.y+(Rn()-.5)*260,p.z+(Rn()-.5)*700))}sc.add(sparkles(a,col,size,.7,.6))};
 glow(.13,.2,'#ffe8c0',300,8);glow(.22,.32,'#ff3a2a',500,9);glow(.33,.5,'#4aff8a',500,7);glow(.75,.86,'#a8a8b8',400,6);glow(.9,1,'#ffd860',700,12);
 // layer 4–5: green-walled tunnel rings along the road
 {const ring=new THREE.TorusGeometry(60,6,6,20);const im=new THREE.InstancedMesh(ring,new THREE.MeshStandardMaterial({color:'#1e4a2a',emissive:'#0a3a1a',emissiveIntensity:.6,roughness:.8}),40);const o=new THREE.Object3D();
  for(let i=0;i<40;i++){const t=.33+i/40*.17,p=road(t),q=road(t+.002).sub(p).normalize();o.position.copy(p);o.lookAt(p.clone().add(q));o.scale.setScalar(1+Rn()*.3);o.updateMatrix();im.setMatrixAt(i,o.matrix)}im.frustumCulled=false;sc.add(im)}
 // layer 7: black cubes with glowing slits beside the road; layer 66: rubble; layer 99: a floor of silver under gold light
 {const im=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({color:'#121216',roughness:.4,metalness:.5,emissive:'#3a2a10',emissiveIntensity:.2}),30);const o=new THREE.Object3D();
  for(let i=0;i<30;i++){const p=road(.6+Rn()*.1);o.position.set(p.x+(Rn()-.5)*600,p.y+(Rn()-.5)*200,p.z+(Rn()-.5)*600);o.rotation.set(0,Rn()*3,0);o.scale.setScalar(20+Rn()*60);o.updateMatrix();im.setMatrixAt(i,o.matrix)}im.frustumCulled=false;sc.add(im)}
 {const im=new THREE.InstancedMesh(lumpRock(1,3).clone(),new THREE.MeshStandardMaterial({color:'#4a4648',roughness:.9,flatShading:true}),160);const o=new THREE.Object3D();
  for(let i=0;i<160;i++){const p=road(.76+Rn()*.1);o.position.set(p.x+(Rn()-.5)*900,p.y+(Rn()-.5)*400,p.z+(Rn()-.5)*900);o.rotation.set(Rn()*3,Rn()*3,0);o.scale.setScalar(4+Rn()*Rn()*40);o.updateMatrix();im.setMatrixAt(i,o.matrix)}im.frustumCulled=false;sc.add(im)}
 {const p=road(.96);const fl=new THREE.Mesh(new THREE.CylinderGeometry(420,420,6,48),new THREE.MeshStandardMaterial({color:'#d8dce4',metalness:.8,roughness:.2,emissive:'#5a4a20',emissiveIntensity:.3}));fl.position.set(p.x,p.y-30,p.z);sc.add(fl);
  const gl=glowSprite('#ffd870',1400,.35);gl.position.set(p.x,p.y+300,p.z);sc.add(gl)}}
/* 连接世界 (age 7): old star buses in their graveyard grow gates that join them into one crowded world; a road runs from the first
   camp through gate after gate, each gate a ring of light with a drifting bus-body beside it. Entries stand at their stop */
ROAD.lianjie=t=>V3(Math.sin(t*Math.PI*2.2)*1100,Math.sin(t*Math.PI*4)*160,-3000+t*6000);
BUILDERS.lianjie=()=>buildPath('lianjie');
function lianjieMore(sp){const sc=sp.scene,road=sp.road,Rn=rnd(717);
 const gm=new THREE.MeshBasicMaterial({color:'#9ad8ff',transparent:true,opacity:.75,blending:THREE.AdditiveBlending,depthWrite:false});
 const bm=new THREE.MeshStandardMaterial({color:'#7a6a5a',roughness:.9,flatShading:true});
 for(let n=1;n<=4;n++){const t=.2+n*.15,p=road(t),q=road(t+.002).sub(p).normalize();const g=new THREE.Mesh(new THREE.TorusGeometry(120,6,8,48),gm);g.position.copy(p);g.lookAt(p.clone().add(q));sc.add(g);
  const b=new THREE.Mesh(lumpRock(1,n%5+1),bm);b.scale.setScalar(160+Rn()*200);b.position.set(p.x+(n%2?1:-1)*(500+Rn()*300),p.y-100+Rn()*200,p.z+(Rn()-.5)*300);sc.add(b)}}
/* 希望空间 (age 11): a dark drift-sea of bubble worlds, each a dead mind replaying its life; the road runs from the doom tunnel
   past them; black tides of boneless dolls wash between */
ROAD.hope=t=>V3(Math.sin(t*Math.PI*3)*800,Math.cos(t*Math.PI*2)*120,3000-t*6000);
BUILDERS.hope=()=>buildPath('hope');
function hopeMore(sp){const sc=sp.scene,road=sp.road,Rn=rnd(727);
 const bm=new THREE.MeshStandardMaterial({color:'#e8f0ff',transparent:true,opacity:.18,roughness:.05,metalness:.3,emissive:'#6a7aa0',emissiveIntensity:.25,depthWrite:false});
 const im=new THREE.InstancedMesh(new THREE.SphereGeometry(1,24,16),bm,160);const o=new THREE.Object3D();const B=[];
 for(let i=0;i<160;i++){const p=road(Rn());B.push([p.x+(Rn()-.5)*2400,p.y+(Rn()-.5)*900,p.z+(Rn()-.5)*1200,8+Rn()*Rn()*240,Rn()*6])}
 im.frustumCulled=false;sc.add(im);
 // they swell and shrink slowly, each on its own beat
 anim(sp,im,t=>{for(let i=0;i<B.length;i++){const b=B[i];o.position.set(b[0],b[1],b[2]);o.scale.setScalar(b[3]*(1+.12*Math.sin(t*.3+b[4])));o.updateMatrix();im.setMatrixAt(i,o.matrix)}im.instanceMatrix.needsUpdate=true});
 for(let k=0;k<4;k++){const p=road(.2+k*.2),g=new THREE.Group();g.position.set(p.x+(k%2?600:-600),p.y-200,p.z);g.add(evPoints(1200,7270+k,evSwarmMat({dark:1,col:'#0c0c10',rx:420,ry:60,rz:300,speed:.04,size:10,op:.8})));sc.add(g)}}
/* 死亡战舰 (ages 9–12): the road runs through the ship — plated corridors, numbered zones, the captain's chamber, the hatching rooms,
   the portal rooms that open onto factory spheres ten kilometres across */
ROAD.deathship=t=>V3(Math.sin(t*Math.PI*1.6)*500,Math.sin(t*Math.PI*3)*80,-2800+t*5600);
BUILDERS.deathship=()=>buildPath('deathship');
function deathshipMore(sp){const sc=sp.scene,road=sp.road,Rn=rnd(737);
 const pm=new THREE.MeshStandardMaterial({color:'#4a4e56',metalness:.7,roughness:.4});const N=180,im=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),pm,N*6);const o=new THREE.Object3D();let k=0;
 for(let i=0;i<N;i++){const t=i/N,p=road(t),q=road(Math.min(1,t+.002)).sub(p).normalize(),sd=V3(-q.z,0,q.x);
  for(const [dx,dy,w,h] of [[1,0,8,140],[-1,0,8,140],[0,1,180,8],[0,-1,180,8],[1,1,30,30],[-1,1,30,30]]){o.position.copy(p).addScaledVector(sd,dx*90).add(V3(0,dy*70,0));o.lookAt(o.position.clone().add(q));o.scale.set(w,h,24);o.updateMatrix();im.setMatrixAt(k++,o.matrix)}}
 im.frustumCulled=false;sc.add(im);
 const lm=new THREE.MeshBasicMaterial({color:'#ffb060'});const li=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),lm,N);for(let i=0;i<N;i++){const p=road(i/N);o.position.set(p.x,p.y+66,p.z);o.rotation.set(0,0,0);o.scale.set(40,2,4);o.updateMatrix();li.setMatrixAt(i,o.matrix)}li.frustumCulled=false;sc.add(li);
 for(let n=0;n<3;n++){const p=road(.62+n*.14);const s=new THREE.Mesh(new THREE.SphereGeometry(320,48,32),new THREE.MeshStandardMaterial({color:'#6a6a72',metalness:.6,roughness:.5,emissive:'#3a2a10',emissiveIntensity:.2}));s.position.set(p.x+(n%2?900:-900),p.y,p.z);sc.add(s);sc.add(at(glowSprite('#ffc070',900,.25),s.position.x,s.position.y,s.position.z))}}
/* 虚空阴影 (age 13): abandoned tunnels merged into one vast region — ghost ruins, the white management zone, a landmass sixty
   thousand km long, a shortcut tunnel a million km long, and at the end the black star */
ROAD.xuying=t=>V3(Math.sin(t*Math.PI*2.6)*900,Math.sin(t*Math.PI*5)*140,3000-t*6000);
BUILDERS.xuying=()=>buildPath('xuying');
function xuyingMore(sp){const sc=sp.scene,road=sp.road,Rn=rnd(747);
 const tm=new THREE.MeshBasicMaterial({color:'#8a8ac8',transparent:true,opacity:.08,side:THREE.DoubleSide,depthWrite:false});
 for(let k=0;k<5;k++){const t0=k*.2,pts=[];for(let i=0;i<=20;i++)pts.push(road(t0+i/20*.18));const tb=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),80,260,16,false),tm);sc.add(tb)}
 const gm=new THREE.MeshStandardMaterial({color:'#6a6878',roughness:.9,transparent:true,opacity:.55,flatShading:true});const im=new THREE.InstancedMesh(lumpRock(1,2),gm,140);const o=new THREE.Object3D();
 for(let i=0;i<140;i++){const p=road(Rn()*.3);o.position.set(p.x+(Rn()-.5)*900,p.y+(Rn()-.5)*300,p.z+(Rn()-.5)*600);o.rotation.set(Rn()*3,Rn()*3,0);o.scale.set(20+Rn()*60,40+Rn()*120,20+Rn()*60);o.updateMatrix();im.setMatrixAt(i,o.matrix)}im.frustumCulled=false;sc.add(im);
 {const p=road(.45);const w=new THREE.Mesh(new THREE.BoxGeometry(900,40,900),new THREE.MeshStandardMaterial({color:'#f4f4f8',roughness:.6,emissive:'#d8d8e0',emissiveIntensity:.3}));w.position.set(p.x,p.y-120,p.z);sc.add(w)}
 {const p=road(.62);const L=new THREE.Mesh(new THREE.BoxGeometry(2400,60,800),new THREE.MeshStandardMaterial({color:'#5a6a4a',roughness:.95}));L.position.set(p.x,p.y-200,p.z);sc.add(L)}
 {const p=road(1);const bs=new THREE.Mesh(new THREE.SphereGeometry(400,48,32),new THREE.MeshBasicMaterial({color:'#020204'}));bs.position.set(p.x,p.y,p.z-600);sc.add(bs);sc.add(at(glowSprite('#8a6aff',1800,.5),bs.position.x,bs.position.y,bs.position.z))}}
/* 吞噬之域 (ages 12–13): after the voids collide — the silent river of crushed spaces, nine record zones, swallowed fragments,
   and at the end the whale-dwellers' star system where the great rift is fought */
ROAD.tunshi=t=>V3(Math.sin(t*Math.PI*2)*1000,Math.sin(t*Math.PI*3.5)*120,-3000+t*6000);
BUILDERS.tunshi=()=>buildPath('tunshi');
function tunshiMore(sp){const sc=sp.scene,road=sp.road,Rn=rnd(757);const o=new THREE.Object3D();
 {const g=new THREE.Group(),p=road(.06);g.position.set(p.x,p.y-260,p.z);g.add(evPoints(2600,7571,evSwarmMat({dark:1,col:'#2a2a3a',rx:1400,ry:40,rz:500,speed:.02,size:16,op:.7})));sc.add(g)}
 const zm=new THREE.MeshBasicMaterial({color:'#7ab0ff',transparent:true,opacity:.07,side:THREE.DoubleSide,depthWrite:false}),em=new THREE.LineBasicMaterial({color:'#9ac4ff',transparent:true,opacity:.35});
 for(let n=0;n<9;n++){const p=road(.14+n*.07),sz=380+Rn()*220,bg=new THREE.BoxGeometry(sz,sz*.6,sz);const b=new THREE.Mesh(bg,zm);b.position.set(p.x+(n%2?560:-560),p.y,p.z);sc.add(b);const e=new THREE.LineSegments(new THREE.EdgesGeometry(bg),em);e.position.copy(b.position);sc.add(e)}
 const fm=new THREE.MeshStandardMaterial({color:'#4a4658',roughness:.85,flatShading:true});const im=new THREE.InstancedMesh(lumpRock(1,2),fm,160);
 for(let i=0;i<160;i++){const p=road(.3+Rn()*.45);o.position.set(p.x+(Rn()-.5)*1800,p.y+(Rn()-.5)*600,p.z+(Rn()-.5)*400);o.rotation.set(Rn()*3,Rn()*3,0);const r=10+Rn()*50;o.scale.set(r,r*(.5+Rn()),r);o.updateMatrix();im.setMatrixAt(i,o.matrix)}im.frustumCulled=false;sc.add(im);
 {const p=road(.9),c=V3(p.x+1300,p.y+200,p.z+400);const st=new THREE.Mesh(new THREE.SphereGeometry(260,40,28),new THREE.MeshBasicMaterial({color:'#fff0c8'}));st.position.copy(c);sc.add(st);sc.add(at(glowSprite('#ffd890',2200,.55),c.x,c.y,c.z));
  const wm=new THREE.MeshStandardMaterial({color:'#5a6a80',roughness:.6,emissive:'#1a2a40',emissiveIntensity:.3});
  for(let k=0;k<6;k++){const w=new THREE.Mesh(new THREE.SphereGeometry(1,24,16),wm);const a=k/6*Math.PI*2;w.position.set(c.x+Math.cos(a)*900,c.y+(Rn()-.5)*300,c.z+Math.sin(a)*900);w.scale.set(60,50,220);w.lookAt(c.x+Math.cos(a+1.6)*900,w.position.y,c.z+Math.sin(a+1.6)*900);sc.add(w)}}}
/* 虚空的阴暗面 (age 13): the space graveyard that repels the void — dead fragments in grey dust, the roots of hope reaching up
   through it, and the eye of the void at the far end, where the way to a new void opens */
ROAD.anmian=t=>V3(Math.sin(t*Math.PI*2.4)*800,-t*900+Math.sin(t*Math.PI*4)*100,3000-t*6000);
BUILDERS.anmian=()=>buildPath('anmian');
function anmianMore(sp){const sc=sp.scene,road=sp.road,Rn=rnd(767);const o=new THREE.Object3D();
 for(let k=0;k<3;k++){const g=new THREE.Group(),p=road(.15+k*.25);g.position.set(p.x,p.y,p.z);g.add(evPoints(1800,7671+k,evSwarmMat({dark:1,col:'#3a3a40',rx:1200,ry:500,rz:900,speed:.015,size:12,op:.6})));sc.add(g)}
 const gm=new THREE.MeshStandardMaterial({color:'#38363c',roughness:.95,flatShading:true});const im=new THREE.InstancedMesh(lumpRock(1,2),gm,200);
 for(let i=0;i<200;i++){const p=road(Rn()*.6);o.position.set(p.x+(Rn()-.5)*2000,p.y+(Rn()-.5)*700,p.z+(Rn()-.5)*600);o.rotation.set(Rn()*3,Rn()*3,0);const r=15+Rn()*70;o.scale.set(r,r*(.4+Rn()),r);o.updateMatrix();im.setMatrixAt(i,o.matrix)}im.frustumCulled=false;sc.add(im);
 const rm=new THREE.MeshStandardMaterial({color:'#c8a860',roughness:.5,emissive:'#806020',emissiveIntensity:.5});
 for(let k=0;k<7;k++){const p=road(.5+k*.04),sd=k%2?1:-1,pts=[];let x=p.x+sd*(400+Rn()*300),y=p.y-900,z=p.z;for(let i=0;i<8;i++){pts.push(V3(x,y,z));x+=(Rn()-.5)*160;y+=170;z+=(Rn()-.5)*160}sc.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),48,18-k,8,false),rm))}
 {const p=road(.82),c=V3(p.x,p.y+100,p.z-700);const ring=new THREE.Mesh(new THREE.TorusGeometry(700,60,16,96),new THREE.MeshStandardMaterial({color:'#1a1820',roughness:.4,metalness:.5,emissive:'#4a3a80',emissiveIntensity:.4}));ring.position.copy(c);sc.add(ring);
  const iris=new THREE.Mesh(new THREE.CircleGeometry(640,64),new THREE.MeshBasicMaterial({color:'#060408',side:THREE.DoubleSide}));iris.position.copy(c);sc.add(iris);sc.add(at(glowSprite('#9a80ff',2400,.4),c.x,c.y,c.z))}
 {const p=road(1);sc.add(at(glowSprite('#fff4d8',1400,.7),p.x,p.y,p.z-500))}}
/* 无空间带 (age 11): the belt where space thins out — the star-flame people's white-gold platform, the frozen ocean world of
   资料库 split by its rift, 霜堡's frozen flames, the star-burner, 燃金's floating fortress ruins and the bubble in the ancient space */
ROAD.ranxing=t=>V3(Math.sin(t*Math.PI*1.8)*900,Math.sin(t*Math.PI*3)*150,-3000+t*6000);
BUILDERS.ranxing=()=>buildPath('ranxing');
function ranxingMore(sp){const sc=sp.scene,road=sp.road,Rn=rnd(777);const o=new THREE.Object3D();
 {const p=road(.04);const d=new THREE.Mesh(new THREE.CylinderGeometry(520,560,30,64),new THREE.MeshStandardMaterial({color:'#e8dcb0',metalness:.8,roughness:.3,emissive:'#5a4a20',emissiveIntensity:.25}));d.position.set(p.x,p.y-90,p.z);sc.add(d)}
 {const p=road(.2),c=V3(p.x-1500,p.y+100,p.z+300);const w=new THREE.Mesh(new THREE.SphereGeometry(700,64,40),new THREE.MeshStandardMaterial({color:'#c8dce8',roughness:.35,metalness:.1}));w.position.copy(c);sc.add(w);
  const rift=new THREE.Mesh(new THREE.TorusGeometry(704,22,8,96,Math.PI*1.3),new THREE.MeshBasicMaterial({color:'#0a0c14'}));rift.position.copy(c);rift.rotation.set(.4,.9,0);sc.add(rift)}
 {const p=road(.36),c=V3(p.x+1300,p.y,p.z);const w=new THREE.Mesh(new THREE.SphereGeometry(520,48,32),new THREE.MeshStandardMaterial({color:'#a8c8e0',roughness:.3}));w.position.copy(c);sc.add(w);
  const fm=new THREE.MeshStandardMaterial({color:'#d8f0ff',roughness:.15,transparent:true,opacity:.85});const im=new THREE.InstancedMesh(new THREE.ConeGeometry(1,1,6),fm,90);
  for(let i=0;i<90;i++){const n=V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize();o.position.copy(c).addScaledVector(n,520);o.quaternion.setFromUnitVectors(V3(0,1,0),n);const h=40+Rn()*140;o.scale.set(h*.25,h,h*.25);o.position.addScaledVector(n,h*.4);o.updateMatrix();im.setMatrixAt(i,o.matrix)}sc.add(im)}
 {const p=road(.5),c=V3(p.x-1400,p.y+300,p.z);sc.add(at(glowSprite('#ff9a40',2400,.6),c.x,c.y,c.z));const st=new THREE.Mesh(new THREE.SphereGeometry(280,40,28),new THREE.MeshBasicMaterial({color:'#ffd8a0'}));st.position.copy(c);sc.add(st)}
 const rm=new THREE.MeshStandardMaterial({color:'#8a7a58',roughness:.8,metalness:.3,flatShading:true});const isl=new THREE.InstancedMesh(lumpRock(1,2),rm,40),tw=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),rm,80);
 for(let i=0;i<40;i++){const p=road(.68+Rn()*.14),x=p.x+(Rn()<.5?-1:1)*(500+Rn()*900),y=p.y+(Rn()-.5)*500,z=p.z+(Rn()-.5)*500,r=50+Rn()*90;o.position.set(x,y,z);o.rotation.set(Math.PI,Rn()*3,0);o.scale.set(r,r*.8,r);o.updateMatrix();isl.setMatrixAt(i,o.matrix);
  for(let q=0;q<2;q++){o.position.set(x+(Rn()-.5)*r,y+r*.3+20,z+(Rn()-.5)*r);o.rotation.set(0,Rn()*3,0);o.scale.set(14,40+Rn()*70,14);o.updateMatrix();tw.setMatrixAt(i*2+q,o.matrix)}}
 isl.frustumCulled=tw.frustumCulled=false;sc.add(isl,tw);
 {const p=road(.9),c=V3(p.x+900,p.y+100,p.z);const b=new THREE.Mesh(new THREE.SphereGeometry(500,48,32),new THREE.MeshStandardMaterial({color:'#e0e8ff',transparent:true,opacity:.18,roughness:.1,metalness:.4,depthWrite:false}));b.position.copy(c);sc.add(b);
  const g=new THREE.Group();g.position.set(c.x,c.y-300,c.z);g.add(evPoints(1500,7771,evSwarmMat({col:'#7a6a60',rx:900,ry:80,rz:600,speed:.02,size:14,op:.6})));sc.add(g)}}
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
/* 崩裂虚空 (age 12): the cracked void left by the overlappers — flickering afterimages of old tunnel spaces, black walls with
   glowing script, the hollow corpse of the crosser, the mirror-black disc, and past it the white star, 攀天城 and ten silver rings */
ROAD.benglie=t=>V3(Math.sin(t*Math.PI*2.2)*900,Math.sin(t*Math.PI*3)*160,3000-t*6000);
BUILDERS.benglie=()=>buildPath('benglie');
function benglieMore(sp){const sc=sp.scene,road=sp.road,Rn=rnd(797);const o=new THREE.Object3D();
 const fm=new THREE.MeshBasicMaterial({color:'#8ab0d8',transparent:true,opacity:.06,side:THREE.DoubleSide,depthWrite:false}),fe=new THREE.LineBasicMaterial({color:'#9ac0ff',transparent:true,opacity:.25});
 for(let n=0;n<10;n++){const p=road(Rn()*.6),sz=200+Rn()*500,g=new THREE.BoxGeometry(sz,sz*(.4+Rn()*.6),sz);const b=new THREE.Mesh(g,fm);b.position.set(p.x+(Rn()<.5?-1:1)*(500+Rn()*600),p.y+(Rn()-.5)*400,p.z);b.rotation.set(Rn(),Rn()*3,Rn());sc.add(b);const e=new THREE.LineSegments(new THREE.EdgesGeometry(g),fe);e.position.copy(b.position);e.rotation.copy(b.rotation);sc.add(e)}
 const wm=new THREE.MeshStandardMaterial({color:'#0c0c12',roughness:.4,metalness:.5}),gm=new THREE.MeshBasicMaterial({color:'#ffd27a'});
 for(let n=0;n<4;n++){const p=road(.1+n*.12),sd=n%2?1:-1;const w=new THREE.Mesh(new THREE.BoxGeometry(30,500,900),wm);w.position.set(p.x+sd*700,p.y,p.z);sc.add(w);
  const gl=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),gm,24);for(let i=0;i<24;i++){o.position.set(p.x+sd*684,p.y-200+(i%6)*80,p.z-350+Math.floor(i/6)*200+Rn()*40);o.rotation.set(0,0,0);o.scale.set(2,8+Rn()*20,30+Rn()*60);o.updateMatrix();gl.setMatrixAt(i,o.matrix)}sc.add(gl)}
 {const p=road(.08),c=V3(p.x-1300,p.y,p.z);const cv=new THREE.Mesh(new THREE.SphereGeometry(600,40,28),new THREE.MeshBasicMaterial({color:'#a0c8c0',transparent:true,opacity:.07,side:THREE.BackSide,depthWrite:false}));cv.position.copy(c);sc.add(cv);
  const bm=new THREE.MeshStandardMaterial({color:'#7ae0c0',emissive:'#2a8a6a',emissiveIntensity:.6,roughness:.2,transparent:true,opacity:.8});const im=new THREE.InstancedMesh(new THREE.SphereGeometry(1,16,12),bm,40);
  for(let i=0;i<40;i++){o.position.set(c.x+(Rn()-.5)*900,c.y+(Rn()-.5)*700,c.z+(Rn()-.5)*900);const r=10+Rn()*30;o.scale.set(r,r*.7,r);o.updateMatrix();im.setMatrixAt(i,o.matrix)}sc.add(im)}
 {const p=road(.32),c=V3(p.x+500,p.y-160,p.z);const d=new THREE.Mesh(new THREE.CylinderGeometry(300,300,12,96),new THREE.MeshStandardMaterial({color:'#060608',metalness:1,roughness:.05}));d.position.copy(c);sc.add(d);
  const rm=new THREE.MeshStandardMaterial({color:'#18161a',roughness:.7,flatShading:true});const ri=new THREE.InstancedMesh(lumpRock(1,2),rm,24);for(let i=0;i<24;i++){const a=Rn()*6.28,r=400+Rn()*500;o.position.set(c.x+Math.cos(a)*r,c.y+(Rn()-.5)*300,c.z+Math.sin(a)*r);o.rotation.set(Rn()*3,Rn()*3,0);o.scale.set(30+Rn()*40,20+Rn()*30,120+Rn()*200);o.updateMatrix();ri.setMatrixAt(i,o.matrix)}sc.add(ri)}
 {const p=road(.74),c=V3(p.x-1200,p.y+200,p.z);const st=new THREE.Mesh(new THREE.SphereGeometry(240,40,28),new THREE.MeshBasicMaterial({color:'#ffffff'}));st.position.copy(c);sc.add(st);sc.add(at(glowSprite('#e8f0ff',2000,.6),c.x,c.y,c.z));
  const tm=new THREE.MeshStandardMaterial({color:'#c87a4a',emissive:'#ff6a2a',emissiveIntensity:.4,roughness:.6});for(let k=0;k<6;k++){const a=k/6*6.28,m=new THREE.Mesh(new THREE.SphereGeometry(30+Rn()*30,24,16),tm);m.position.set(c.x+Math.cos(a)*450,c.y+(Rn()-.5)*100,c.z+Math.sin(a)*450);sc.add(m)}}
 {const p=road(.86),c=V3(p.x+1100,p.y,p.z);sc.add(at(new THREE.Mesh(new THREE.TorusKnotGeometry(200,40,140,12,5,7),new THREE.MeshStandardMaterial({color:'#6a4a5a',roughness:.6})),c.x,c.y,c.z))}
 {const p=road(1),rm=new THREE.MeshStandardMaterial({color:'#d8dce4',metalness:.9,roughness:.2});for(let k=0;k<10;k++){const r=new THREE.Mesh(new THREE.TorusGeometry(400,14,10,96),rm);r.position.set(p.x,p.y-200+k*50,p.z-700);r.rotation.x=Math.PI/2;sc.add(r)}
  const v=new THREE.Mesh(new THREE.CircleGeometry(380,48),new THREE.MeshBasicMaterial({color:'#020204'}));v.position.set(p.x,p.y-210,p.z-700);v.rotation.x=-Math.PI/2;sc.add(v)}}
/* 机器民之地 (age 8): Midgard's grave and the can city on its golden sand, the black river in the canyon, the amber belt, the
   spinning dust world, the replica Xumin city in its fungus forest, Erxi's hidden city, and the great vine in the rubble field */
ROAD.jiqimin=t=>V3(Math.sin(t*Math.PI*2)*800,Math.sin(t*Math.PI*2.5)*200,-3000+t*6000);
BUILDERS.jiqimin=()=>buildPath('jiqimin');
function jiqiminMore(sp){const sc=sp.scene,road=sp.road,Rn=rnd(807);const o=new THREE.Object3D();
 {const p=road(.06);const sand=new THREE.Mesh(new THREE.PlaneGeometry(3200,1400),new THREE.MeshStandardMaterial({color:'#d8b068',roughness:1}));sand.rotation.x=-Math.PI/2;sand.position.set(p.x,p.y-120,p.z+200);sc.add(sand);
  const cm=new THREE.MeshStandardMaterial({color:'#7a7c80',metalness:.6,roughness:.5});const im=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),cm,70);
  for(let i=0;i<70;i++){const h=40+Rn()*90;o.position.set(p.x+600+Rn()*700,p.y-120+h/2,p.z-200+Rn()*700);o.rotation.set(0,Rn()*.3,0);o.scale.set(40+Rn()*30,h,40+Rn()*30);o.updateMatrix();im.setMatrixAt(i,o.matrix)}sc.add(im);
  const pts=[];for(let i=0;i<=30;i++){const a=i*.6;pts.push(V3(p.x+950+Math.cos(a)*40,p.y-120+i*12,p.z+150+Math.sin(a)*40))}sc.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),120,10,8,false),cm));
  const rv=new THREE.Mesh(new THREE.PlaneGeometry(120,1400),new THREE.MeshStandardMaterial({color:'#060608',roughness:.1,metalness:.6}));rv.rotation.x=-Math.PI/2;rv.position.set(p.x-700,p.y-118,p.z+200);sc.add(rv);
  const hot=new THREE.Mesh(new THREE.SphereGeometry(500,40,28),new THREE.MeshStandardMaterial({color:'#3a1a10',emissive:'#ff3a10',emissiveIntensity:.35,roughness:.9}));hot.position.set(p.x,p.y+1500,p.z+600);sc.add(hot)}
 {const am=new THREE.MeshStandardMaterial({color:'#d89a30',roughness:.3,transparent:true,opacity:.85,emissive:'#5a3008',emissiveIntensity:.3,flatShading:true});const im=new THREE.InstancedMesh(lumpRock(1,2),am,30);
  for(let i=0;i<30;i++){const p=road(.22+Rn()*.08);o.position.set(p.x+(Rn()<.5?-1:1)*(300+Rn()*700),p.y+(Rn()-.5)*400,p.z+(Rn()-.5)*300);o.rotation.set(Rn()*3,Rn()*3,0);const r=20+Rn()*50;o.scale.set(r,r*1.4,r);o.updateMatrix();im.setMatrixAt(i,o.matrix)}im.frustumCulled=false;sc.add(im)}
 for(let k=0;k<3;k++){const p=road(.36+k*.04),g=new THREE.Group();g.position.set(p.x,p.y,p.z);g.add(evPoints(1600,8071+k,evSwarmMat({col:['#c87ad8','#7ac8d8','#e8c860'][k],rx:1300,ry:500,rz:500,speed:.05,size:10,op:.7})));sc.add(g)}
 {const p=road(.55),c=V3(p.x-900,p.y-100,p.z);const tm=new THREE.MeshStandardMaterial({color:'#2a2a3a',metalness:.4,roughness:.5,emissive:'#4a5aff',emissiveIntensity:.25});const im=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),tm,60);
  for(let i=0;i<60;i++){const h=60+Rn()*240;o.position.set(c.x+(Rn()-.5)*700,c.y+h/2,c.z+(Rn()-.5)*700);o.rotation.set(0,0,0);o.scale.set(30+Rn()*30,h,30+Rn()*30);o.updateMatrix();im.setMatrixAt(i,o.matrix)}sc.add(im);
  const dome=new THREE.Mesh(new THREE.SphereGeometry(140,32,16,0,6.28,0,Math.PI/2),new THREE.MeshStandardMaterial({color:'#f4f4f8',roughness:.5}));dome.position.set(c.x+450,c.y,c.z);sc.add(dome);
  const fm=new THREE.MeshStandardMaterial({color:'#4a1a5a',emissive:'#6a2aa0',emissiveIntensity:.3,roughness:.8});const fi=new THREE.InstancedMesh(new THREE.ConeGeometry(1,1,6),fm,80);
  for(let i=0;i<80;i++){const a=Rn()*6.28,r=420+Rn()*200;o.position.set(c.x+Math.cos(a)*r,c.y+20,c.z+Math.sin(a)*r);o.scale.set(10,40+Rn()*40,10);o.updateMatrix();fi.setMatrixAt(i,o.matrix)}sc.add(fi)}
 {const vm=new THREE.MeshStandardMaterial({color:'#4a5a2a',roughness:.85});const p0=road(.82);
  const trunk=new THREE.Mesh(new THREE.CylinderGeometry(160,220,3600,24),vm);trunk.position.set(p0.x+1200,p0.y,p0.z);sc.add(trunk);
  for(let k=0;k<9;k++){const p=road(.76+k*.028),pts=[];let x=p0.x+1200,y=p.y-600+k*140,z=p.z;for(let i=0;i<7;i++){pts.push(V3(x,y,z));x-=200+Rn()*120;y+=(Rn()-.4)*140;z+=(Rn()-.5)*300}sc.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),40,30+Rn()*30,8,false),vm))}}}
/* 虚空的缝隙 (age 11): a starless gap where the star alliance stands paused — the eye-bees, the sea-ball wrapped over a dead bus with
   its black castle under the water, the frozen paradise round its golden figure, the grey rock planet with its black cube, the gun
   platform, the field of glowing stones with soldiers curled inside, and the dream fields leaving their cube farms */
ROAD.fengxi=t=>V3(Math.sin(t*Math.PI*1.6)*900,Math.sin(t*Math.PI*2.4)*180,3000-t*6000);
BUILDERS.fengxi=()=>buildPath('fengxi');
function fengxiMore(sp){const sc=sp.scene,road=sp.road,Rn=rnd(817);const o=new THREE.Object3D();
 {const g=new THREE.Group(),p=road(.06);g.position.set(p.x+500,p.y+100,p.z);g.add(evPoints(900,8171,evSwarmMat({col:'#e8c040',rx:300,ry:200,rz:300,speed:.12,size:8,op:.9})));sc.add(g)}
 {const p=road(.18),c=V3(p.x-1300,p.y,p.z);const w=new THREE.Mesh(new THREE.SphereGeometry(600,64,40),new THREE.MeshStandardMaterial({color:'#2aa8a0',roughness:.15,metalness:.2,transparent:true,opacity:.85}));w.position.copy(c);sc.add(w);
  const bus=new THREE.Mesh(new THREE.BoxGeometry(260,200,700),new THREE.MeshStandardMaterial({color:'#2a2a2a',roughness:.7}));bus.position.copy(c);sc.add(bus);
  const cs=new THREE.Mesh(new THREE.ConeGeometry(60,280,6),new THREE.MeshStandardMaterial({color:'#101210',emissive:'#20a040',emissiveIntensity:.4}));cs.position.set(c.x,c.y+200,c.z+100);sc.add(cs)}
 {const p=road(.32),c=V3(p.x+1300,p.y+100,p.z);const pl=new THREE.Mesh(new THREE.SphereGeometry(500,48,32),new THREE.MeshStandardMaterial({color:'#d8d0e8',roughness:.2,metalness:.5}));pl.position.copy(c);sc.add(pl);
  const tm=new THREE.MeshStandardMaterial({color:'#e8e0ff',roughness:.1,metalness:.6,emissive:'#8a80c0',emissiveIntensity:.2});const im=new THREE.InstancedMesh(new THREE.CylinderGeometry(.5,1,1,6),tm,120);
  for(let i=0;i<120;i++){const n=V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize();const h=30+Rn()*90;o.position.copy(c).addScaledVector(n,500+h/2);o.quaternion.setFromUnitVectors(V3(0,1,0),n);o.scale.set(10+Rn()*14,h,10+Rn()*14);o.updateMatrix();im.setMatrixAt(i,o.matrix)}sc.add(im);
  const gf=new THREE.Mesh(new THREE.SphereGeometry(60,24,16,0,6.28,0,Math.PI/2),new THREE.MeshStandardMaterial({color:'#ffd040',metalness:1,roughness:.2,emissive:'#806010',emissiveIntensity:.4}));gf.position.set(c.x-500,c.y,c.z);gf.rotation.z=Math.PI/2;sc.add(gf)}
 {const p=road(.46),c=V3(p.x-1100,p.y,p.z);const r=new THREE.Mesh(new THREE.SphereGeometry(380,40,28),new THREE.MeshStandardMaterial({color:'#6a6a6a',roughness:.95,flatShading:true}));r.position.copy(c);sc.add(r);const cb=new THREE.Mesh(new THREE.BoxGeometry(50,50,50),new THREE.MeshStandardMaterial({color:'#050505',roughness:.3}));cb.position.set(c.x+260,c.y+290,c.z);sc.add(cb)}
 {const p=road(.58),c=V3(p.x+800,p.y-100,p.z);const pf=new THREE.Mesh(new THREE.BoxGeometry(500,40,500),new THREE.MeshStandardMaterial({color:'#5a5e66',metalness:.7,roughness:.4}));pf.position.copy(c);sc.add(pf);
  const gm=new THREE.MeshStandardMaterial({color:'#3a3e46',metalness:.8,roughness:.3});const gi=new THREE.InstancedMesh(new THREE.CylinderGeometry(6,8,90,8),gm,16);for(let i=0;i<16;i++){o.position.set(c.x-220+(i%4)*146,c.y+60,c.z-220+Math.floor(i/4)*146);o.rotation.set(.5,0,0);o.scale.set(1,1,1);o.updateMatrix();gi.setMatrixAt(i,o.matrix)}sc.add(gi)}
 {const cols=['#ff7070','#70ff90','#70a0ff','#ffd070','#e070ff','#70f0f0'];const sm=new THREE.MeshStandardMaterial({color:'#ffffff',roughness:.2,transparent:true,opacity:.6,vertexColors:false});
  const im=new THREE.InstancedMesh(lumpRock(1,2),sm,90);const col=new THREE.Color();for(let i=0;i<90;i++){const p=road(.68+Rn()*.14);o.position.set(p.x+(Rn()<.5?-1:1)*(300+Rn()*900),p.y+(Rn()-.5)*500,p.z+(Rn()-.5)*400);o.rotation.set(Rn()*3,Rn()*3,0);const r=12+Rn()*40;o.scale.set(r,r,r);o.updateMatrix();im.setMatrixAt(i,o.matrix);im.setColorAt(i,col.set(cols[i%6]))}
  im.frustumCulled=false;sc.add(im)}
 {const p=road(.94);const fm=new THREE.MeshStandardMaterial({color:'#8a7a5a',roughness:.8});for(let k=0;k<3;k++){const b=new THREE.Mesh(new THREE.BoxGeometry(260,260,260),fm);b.position.set(p.x+(k-1)*700,p.y-300,p.z-400);sc.add(b)}
  const g=new THREE.Group();g.position.set(p.x,p.y+100,p.z-300);g.add(evPoints(1400,8172,evSwarmMat({col:'#ffe08a',rx:1200,ry:300,rz:300,speed:.04,size:12,op:.5})));sc.add(g)}}
/* 神之眼 (age 9): a flat disc three thousand km wide and a hundred thick, alone in starless black. The road crosses its grey rubble
   (skull pillars, stone huts, the field of steles, the red bubbling mire with its bone birds, blue-white light-gnats), runs into the
   horror zone's ruined city under a sky of rainbow cracks, then leaves the edge and drops beneath to the inner sea */
ROAD.shenyan=t=>V3(Math.sin(t*Math.PI*1.4)*600,t<.83?0:-(t-.83)*4500,-3000+t*6000);
BUILDERS.shenyan=()=>buildPath('shenyan');
function shenyanMore(sp){const sc=sp.scene,road=sp.road,Rn=rnd(827);const o=new THREE.Object3D(),C0=V3(0,-140,-500),R=2420;
 const disc=new THREE.Mesh(new THREE.CylinderGeometry(R,R*.97,200,128,1),new THREE.MeshStandardMaterial({color:'#38383a',roughness:1,flatShading:true}));disc.position.copy(C0);sc.add(disc);
 const rm=new THREE.MeshStandardMaterial({color:'#4a4a4c',roughness:1,flatShading:true});const rb=new THREE.InstancedMesh(lumpRock(1,2),rm,500);
 for(let i=0;i<500;i++){const a=Rn()*6.28,r=Math.sqrt(Rn())*R*.95;o.position.set(C0.x+Math.cos(a)*r,-40,C0.z+Math.sin(a)*r);o.rotation.set(Rn()*3,Rn()*3,0);const q=4+Rn()*18;o.scale.set(q,q*.6,q);o.updateMatrix();rb.setMatrixAt(i,o.matrix)}rb.frustumCulled=false;sc.add(rb);
 {const p=road(.08),bm=new THREE.MeshStandardMaterial({color:'#d8d4c8',roughness:.8});const st=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),bm,160);
  for(let i=0;i<160;i++){o.position.set(p.x+400+(i%16)*40,-30,p.z-200+Math.floor(i/16)*40);o.rotation.set(0,0,0);o.scale.set(14,22,3);o.updateMatrix();st.setMatrixAt(i,o.matrix)}sc.add(st);
  const pm=new THREE.MeshStandardMaterial({color:'#e8e2d0',roughness:.7});for(let k=0;k<6;k++){const c=new THREE.Mesh(new THREE.CylinderGeometry(8,10,90,8),pm);c.position.set(p.x-300-k*90,5,p.z+(k%2)*120);sc.add(c);const sk=new THREE.Mesh(new THREE.SphereGeometry(14,12,10),pm);sk.position.set(c.position.x,58,c.position.z);sc.add(sk)}
  const hm=new THREE.MeshStandardMaterial({color:'#7a7874',roughness:.95});const hu=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),hm,40);for(let i=0;i<40;i++){o.position.set(p.x-500+(Rn()-.5)*300,-25,p.z+300+(Rn()-.5)*300);o.rotation.set(0,Rn()*3,0);o.scale.set(20+Rn()*14,22,20+Rn()*14);o.updateMatrix();hu.setMatrixAt(i,o.matrix)}sc.add(hu)}
 {const p=road(.2),c=V3(p.x-600,-38,p.z);const m=new THREE.Mesh(new THREE.CircleGeometry(220,48),new THREE.MeshStandardMaterial({color:'#6a0a08',emissive:'#a01810',emissiveIntensity:.5,roughness:.2}));m.rotation.x=-Math.PI/2;m.position.copy(c);sc.add(m);
  const g=new THREE.Group();g.position.set(c.x,c.y+160,c.z);g.add(evPoints(160,8271,evSwarmMat({col:'#f0ece0',rx:240,ry:60,rz:240,speed:.18,size:16,op:1})));sc.add(g)}
 for(let k=0;k<4;k++){const p=road(.12+k*.12),g=new THREE.Group();g.position.set(p.x,40,p.z);g.add(evPoints(1200,8272+k,evSwarmMat({col:'#cfe8ff',rx:900,ry:60,rz:500,speed:.08,size:6,op:1})));sc.add(g)}
 {const p=road(.66),c=V3(p.x,-40,p.z);const tm=new THREE.MeshStandardMaterial({color:'#2a1414',roughness:.8,emissive:'#3a0808',emissiveIntensity:.3});const im=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),tm,90);
  for(let i=0;i<90;i++){const sd=Rn()<.5?-1:1,h=40+Rn()*180;o.position.set(c.x+sd*(200+Rn()*700),c.y+h/2,c.z+(Rn()-.5)*900);o.rotation.set(0,Rn()*.4,0);o.scale.set(30+Rn()*40,h,30+Rn()*40);o.updateMatrix();im.setMatrixAt(i,o.matrix)}sc.add(im);
  const lm=new THREE.MeshBasicMaterial({color:'#a8f0a0'});const li=new THREE.InstancedMesh(new THREE.SphereGeometry(4,8,6),lm,60);for(let i=0;i<60;i++){o.position.set(c.x+(i%2?1:-1)*(120+Rn()*40),c.y+30,c.z-450+i*15);o.scale.set(1,1,1);o.rotation.set(0,0,0);o.updateMatrix();li.setMatrixAt(i,o.matrix)}sc.add(li);
  const cols=['#ff5050','#ffb040','#f0f050','#50e070','#50a0ff','#a060ff'];for(let k=0;k<14;k++){const pts=[];let x=c.x+(Rn()-.5)*1600,z=c.z+(Rn()-.5)*1000;for(let i=0;i<6;i++){pts.push(V3(x,320+Rn()*20,z));x+=(Rn()-.5)*300;z+=(Rn()-.5)*300}
   sc.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:cols[k%6]})))}}
 {const p=road(.95),c=V3(p.x,-560,p.z);const sea=new THREE.Mesh(new THREE.PlaneGeometry(4000,3000),new THREE.MeshStandardMaterial({color:'#0a1418',roughness:.15,metalness:.4}));sea.rotation.x=-Math.PI/2;sea.position.copy(c);sc.add(sea);
  const bm=new THREE.MeshStandardMaterial({color:'#d8d2c0',roughness:.6});const sp2=new THREE.Mesh(new THREE.CylinderGeometry(10,10,900,8),bm);sp2.rotation.x=Math.PI/2;sp2.position.set(c.x+500,c.y+30,c.z);sc.add(sp2);
  for(let k=0;k<12;k++){const rib=new THREE.Mesh(new THREE.TorusGeometry(70-Math.abs(k-6)*6,5,6,24,Math.PI),bm);rib.position.set(c.x+500,c.y+30,c.z-360+k*65);rib.rotation.y=Math.PI/2;sc.add(rib)}}}
/* 混沌空间 (age 12): a groundless flickering rainbow chaos with calm black bubbles in it — the rusty-can people's planet, 影遮's black
   sphere, the white crystal-branch ruins with the golden custom rings, the barren 枯星, the bubble split into black paste and gold
   cones, drifting black-and-white cubes, and the last bubble as wide as a star system */
ROAD.hunhe=t=>V3(Math.sin(t*Math.PI*2)*700,Math.sin(t*Math.PI*3)*200,3000-t*6000);
BUILDERS.hunhe=()=>buildPath('hunhe');
function hunheMore(sp){const sc=sp.scene,road=sp.road,Rn=rnd(837);const o=new THREE.Object3D();
 const cols=['#ff4a6a','#ffc040','#4aff8a','#4ab0ff','#c060ff','#ffffff'];
 for(let k=0;k<6;k++){const g=new THREE.Group(),p=road(k/5);g.position.set(p.x,p.y,p.z);g.add(evPoints(1500,8371+k,evSwarmMat({col:cols[k],rx:2600,ry:1400,rz:1400,speed:.3,size:14,op:.7})));sc.add(g)}
 const bm=new THREE.MeshBasicMaterial({color:'#000000',transparent:true,opacity:.55,depthWrite:false});
 for(const t of [.1,.3,.5,.7,.92]){const p=road(t),b=new THREE.Mesh(new THREE.SphereGeometry(t>.9?1400:700,40,28),bm);b.position.copy(p);sc.add(b)}
 {const p=road(.12),c=V3(p.x-450,p.y,p.z);const pl=new THREE.Mesh(new THREE.SphereGeometry(200,40,28),new THREE.MeshStandardMaterial({color:'#8a5a3a',metalness:.5,roughness:.6}));pl.position.copy(c);sc.add(pl);
  const im=new THREE.InstancedMesh(new THREE.CylinderGeometry(1,1,1,8),new THREE.MeshStandardMaterial({color:'#a86a40',metalness:.7,roughness:.5}),80);for(let i=0;i<80;i++){const n=V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize();o.position.copy(c).addScaledVector(n,205);o.quaternion.setFromUnitVectors(V3(0,1,0),n);o.scale.set(6+Rn()*6,10+Rn()*20,6+Rn()*6);o.updateMatrix();im.setMatrixAt(i,o.matrix)}sc.add(im)}
 {const p=road(.3);sc.add(at(new THREE.Mesh(new THREE.SphereGeometry(160,40,28),new THREE.MeshStandardMaterial({color:'#050505',roughness:.2,metalness:.6})),p.x+420,p.y+60,p.z))}
 {const p=road(.5),c=V3(p.x-420,p.y,p.z);const wm=new THREE.MeshStandardMaterial({color:'#f0f0f4',roughness:.3,emissive:'#a0a0b0',emissiveIntensity:.2});
  for(let k=0;k<8;k++){const pts=[];let x=c.x,y=c.y-200,z=c.z;for(let i=0;i<6;i++){pts.push(V3(x,y,z));x+=(Rn()-.5)*200;y+=80;z+=(Rn()-.5)*200}sc.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),30,10,6,false),wm))}
  const gm=new THREE.MeshStandardMaterial({color:'#ffd040',metalness:1,roughness:.25});for(let k=0;k<4;k++){const r=new THREE.Mesh(new THREE.TorusGeometry(40+k*10,4,8,48),gm);r.position.set(c.x+120+k*60,c.y+120,c.z+(k-2)*80);r.rotation.set(Rn()*3,Rn()*3,0);sc.add(r)}}
 {const p=road(.7);sc.add(at(new THREE.Mesh(new THREE.SphereGeometry(220,48,32),new THREE.MeshStandardMaterial({color:'#b89a70',roughness:1,flatShading:true})),p.x+460,p.y,p.z))}
 {const p=road(.82),c=V3(p.x-380,p.y,p.z);const pa=new THREE.Mesh(new THREE.SphereGeometry(150,32,24,0,Math.PI),new THREE.MeshStandardMaterial({color:'#060606',roughness:.1}));pa.position.copy(c);sc.add(pa);
  const cm=new THREE.MeshStandardMaterial({color:'#ffcc40',metalness:.9,roughness:.3});const ci=new THREE.InstancedMesh(new THREE.ConeGeometry(1,1,6),cm,40);for(let i=0;i<40;i++){o.position.set(c.x+(Rn()-.5)*200,c.y+(Rn()-.5)*200,c.z+40+Rn()*100);o.rotation.set(Rn()*3,Rn()*3,0);o.scale.set(8,30,8);o.updateMatrix();ci.setMatrixAt(i,o.matrix)}sc.add(ci)}
 {const ws=[new THREE.MeshStandardMaterial({color:'#f4f4f4',roughness:.4}),new THREE.MeshStandardMaterial({color:'#0a0a0a',roughness:.4})];for(let k=0;k<16;k++){const p=road(Rn());const c=new THREE.Mesh(new THREE.BoxGeometry(30,30,30),ws[k%2]);c.position.set(p.x+(Rn()<.5?-1:1)*(300+Rn()*400),p.y+(Rn()-.5)*300,p.z);c.rotation.set(Rn()*3,Rn()*3,0);sc.add(c)}}}
/* 远古空间的长廊 (age 11): 小尔什, a moon, drifting down the pale sponge of the ancient space — the white 未蛸 station crusted with red
   flesh and its lobster-shell fleets, three look-alike 尔什 worlds (the grey-brown dust one with its chimneyed factories), the ants'
   blue sphere, the floating 奇迹之都 under the black-and-white tiled 修理者, and the open void of a hundred storm balls */
ROAD.qijidu=t=>V3(Math.sin(t*Math.PI*1.4)*500,Math.sin(t*Math.PI*2)*160,-3000+t*6000);
BUILDERS.qijidu=()=>buildPath('qijidu');
function qijiduMore(sp){const sc=sp.scene,road=sp.road,Rn=rnd(847);const o=new THREE.Object3D();
 {const pts=[];for(let i=0;i<=40;i++)pts.push(road(i/40*.86));const tb=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),160,1300,24,false),new THREE.MeshStandardMaterial({color:'#d8d0c0',roughness:1,side:THREE.BackSide,transparent:true,opacity:.35,depthWrite:false}));sc.add(tb);
  const pm=new THREE.MeshStandardMaterial({color:'#c8c0b0',roughness:1});const im=new THREE.InstancedMesh(new THREE.SphereGeometry(1,10,8),pm,300);
  for(let i=0;i<300;i++){const t=Rn()*.86,p=road(t),a=Rn()*6.28;o.position.set(p.x+Math.cos(a)*1250,p.y+Math.sin(a)*1250,p.z);const r=60+Rn()*140;o.scale.set(r,r,r);o.updateMatrix();im.setMatrixAt(i,o.matrix)}im.frustumCulled=false;sc.add(im)}
 {const p=road(.02);sc.add(at(new THREE.Mesh(new THREE.SphereGeometry(260,48,32),new THREE.MeshStandardMaterial({color:'#4a9a8a',roughness:.6})),p.x-500,p.y+200,p.z-500))}
 {const p=road(.08),c=V3(p.x+600,p.y,p.z);const st=new THREE.Mesh(new THREE.SphereGeometry(120,32,24),new THREE.MeshStandardMaterial({color:'#f0eee8',roughness:.5}));st.position.copy(c);sc.add(st);
  const fm=new THREE.MeshStandardMaterial({color:'#a02020',roughness:.7});for(let k=0;k<8;k++){const pts=[];let a=k/8*6.28;for(let i=0;i<6;i++)pts.push(V3(c.x+Math.cos(a)*(120+i*60),c.y+(i%2?20:-20),c.z+Math.sin(a)*(120+i*60)));sc.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),24,14-k%3*3,6,false),fm))}
  const lm=new THREE.MeshStandardMaterial({color:'#c84a2a',roughness:.4,metalness:.3});const li=new THREE.InstancedMesh(new THREE.SphereGeometry(1,12,8),lm,20);for(let i=0;i<20;i++){o.position.set(c.x-300+Rn()*200,c.y+(Rn()-.5)*300,c.z+(Rn()-.5)*400);o.rotation.set(0,Rn()*3,0);o.scale.set(10,8,30);o.updateMatrix();li.setMatrixAt(i,o.matrix)}sc.add(li)}
 for(let k=0;k<3;k++){const p=road(.28+k*.06),c=V3(p.x+(k%2?-1:1)*800,p.y,p.z);const w=new THREE.Mesh(new THREE.SphereGeometry(260,48,32),new THREE.MeshStandardMaterial({color:k==1?'#7a6a58':'#5a9a7a',roughness:.8}));w.position.copy(c);sc.add(w);
  if(k==1){const fm=new THREE.MeshStandardMaterial({color:'#5a5048',roughness:.8});const fi=new THREE.InstancedMesh(new THREE.SphereGeometry(1,12,8,0,6.28,0,Math.PI/2),fm,40);for(let i=0;i<40;i++){const n=V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize();o.position.copy(c).addScaledVector(n,258);o.quaternion.setFromUnitVectors(V3(0,1,0),n);o.scale.set(14,10,14);o.updateMatrix();fi.setMatrixAt(i,o.matrix)}sc.add(fi)}}
 {const p=road(.46);sc.add(at(new THREE.Mesh(new THREE.SphereGeometry(110,40,28),new THREE.MeshStandardMaterial({color:'#3a6aff',roughness:.1,metalness:.3})),p.x-600,p.y+80,p.z))}
 {const p=road(.66),c=V3(p.x+650,p.y-120,p.z);const isl=new THREE.Mesh(lumpRock(1,2),new THREE.MeshStandardMaterial({color:'#8a7a60',roughness:.9,flatShading:true}));isl.position.copy(c);isl.scale.set(260,120,260);isl.rotation.x=Math.PI;sc.add(isl);
  const bm=new THREE.MeshStandardMaterial({color:'#d8c090',roughness:.8});const bi=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),bm,60);for(let i=0;i<60;i++){const h=20+Rn()*70;o.position.set(c.x+(Rn()-.5)*360,c.y+60+h/2,c.z+(Rn()-.5)*360);o.rotation.set(0,Rn()*3,0);o.scale.set(20+Rn()*20,h,20+Rn()*20);o.updateMatrix();bi.setMatrixAt(i,o.matrix)}sc.add(bi);
  const tile=document.createElement('canvas');tile.width=tile.height=64;const g2=tile.getContext('2d');for(let i=0;i<8;i++)for(let j=0;j<8;j++){g2.fillStyle=(i+j)%2?'#f0f0f0':'#101010';g2.fillRect(i*8,j*8,8,8)}const tx=new THREE.CanvasTexture(tile);tx.magFilter=THREE.NearestFilter;
  const rp=new THREE.Mesh(new THREE.CylinderGeometry(300,300,30,48),new THREE.MeshStandardMaterial({map:tx,roughness:.5}));rp.position.set(c.x,c.y+520,c.z);sc.add(rp)}
 {const p=road(.96),sm=new THREE.MeshStandardMaterial({color:'#8a90a0',roughness:.6,emissive:'#3a4050',emissiveIntensity:.3});const im=new THREE.InstancedMesh(new THREE.SphereGeometry(1,16,12),sm,100);
  for(let i=0;i<100;i++){o.position.set(p.x+(Rn()-.5)*3000,p.y+(Rn()-.5)*1200,p.z-300-Rn()*1600);const r=15+Rn()*30;o.scale.set(r,r,r);o.updateMatrix();im.setMatrixAt(i,o.matrix)}im.frustumCulled=false;sc.add(im);
  const g=new THREE.Group();g.position.set(p.x,p.y,p.z-800);g.add(evPoints(600,8471,evSwarmMat({col:'#ffd890',rx:1500,ry:600,rz:800,speed:.05,size:8,op:.8})));sc.add(g)}}
/* 神域 (age 9): chasing the spiked fleet — the light-printed moon, the fleet's tube, then three airless tumbler worlds in a triangle
   round a small glowing ball, each with a ten-km star-reaching tower; the grey umbrella world, hammer-headed warships, the drifting
   ghost fleet, the skull-shaped station, and at the end a pale blue point swelling into ten million km of light */
ROAD.shanguang=t=>V3(Math.sin(t*Math.PI*1.8)*800,Math.sin(t*Math.PI*2.6)*180,3000-t*6000);
BUILDERS.shanguang=()=>buildPath('shanguang');
function shanguangMore(sp){const sc=sp.scene,road=sp.road,Rn=rnd(857);const o=new THREE.Object3D();
 {const p=road(.04);const m=new THREE.Mesh(new THREE.SphereGeometry(180,40,28),new THREE.MeshStandardMaterial({color:'#9a9aa0',roughness:.9,emissive:'#4a6a8a',emissiveIntensity:.2}));m.position.set(p.x-500,p.y+100,p.z);sc.add(m)}
 {const p=road(.24),c=V3(p.x+1300,p.y,p.z);sc.add(at(glowSprite('#fff0c0',900,.7),c.x,c.y,c.z));sc.add(at(new THREE.Mesh(new THREE.SphereGeometry(60,24,16),new THREE.MeshBasicMaterial({color:'#fff6e0'})),c.x,c.y,c.z));
  const wc=['#5a6a4a','#7a7a7a','#6a5a48'],tm=new THREE.MeshStandardMaterial({color:'#9aa0a8',metalness:.8,roughness:.3});
  for(let k=0;k<3;k++){const a=k/3*6.28+.3,wc2=V3(c.x+Math.cos(a)*700,c.y+Math.sin(a)*300,c.z+Math.sin(a)*600);const w=new THREE.Mesh(new THREE.SphereGeometry(200,40,28),new THREE.MeshStandardMaterial({color:wc[k],roughness:.95,flatShading:true}));w.position.copy(wc2);sc.add(w);
   const d=c.clone().sub(wc2).normalize();const tw=new THREE.Mesh(new THREE.CylinderGeometry(10,16,500,8),tm);tw.position.copy(wc2).addScaledVector(d,440);tw.quaternion.setFromUnitVectors(V3(0,1,0),d);sc.add(tw);
   if(k==1){const um=new THREE.MeshStandardMaterial({color:'#8a8a8a',roughness:.7});const ui=new THREE.InstancedMesh(new THREE.ConeGeometry(1,.3,10),um,40);for(let i=0;i<40;i++){const n=V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize();o.position.copy(wc2).addScaledVector(n,214);o.quaternion.setFromUnitVectors(V3(0,1,0),n);o.scale.set(14,14,14);o.updateMatrix();ui.setMatrixAt(i,o.matrix)}sc.add(ui)}}}
 {const hm=new THREE.MeshStandardMaterial({color:'#5a5e66',metalness:.7,roughness:.4});const hi=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),hm,120);
  for(let i=0;i<120;i++){const p=road(.5+Rn()*.1);o.position.set(p.x-400-Rn()*900,p.y+(Rn()-.5)*400,p.z+(Rn()-.5)*600);o.rotation.set(0,0,0);o.scale.set(8,8,40);o.updateMatrix();hi.setMatrixAt(i,o.matrix)}hi.frustumCulled=false;sc.add(hi);
  const hh=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),hm,120);for(let i=0;i<120;i++){hi.getMatrixAt(i,o.matrix);o.matrix.decompose(o.position,o.quaternion,o.scale);o.position.z-=22;o.scale.set(26,14,6);o.updateMatrix();hh.setMatrixAt(i,o.matrix)}hh.frustumCulled=false;sc.add(hh)}
 {const gm=new THREE.MeshStandardMaterial({color:'#4a5048',roughness:.8,transparent:true,opacity:.6,flatShading:true});const gi=new THREE.InstancedMesh(lumpRock(1,2),gm,30);
  for(let i=0;i<30;i++){const p=road(.66+Rn()*.08);o.position.set(p.x+400+Rn()*900,p.y+(Rn()-.5)*400,p.z+(Rn()-.5)*500);o.rotation.set(Rn()*3,Rn()*3,0);o.scale.set(20,16,90+Rn()*80);o.updateMatrix();gi.setMatrixAt(i,o.matrix)}gi.frustumCulled=false;sc.add(gi)}
 {const p=road(.8),c=V3(p.x-600,p.y+50,p.z);const sk=new THREE.Mesh(new THREE.SphereGeometry(180,40,28),new THREE.MeshStandardMaterial({color:'#d8d0c0',roughness:.6}));sk.position.copy(c);sk.scale.set(1,1.15,1);sc.add(sk);
  const em=new THREE.MeshBasicMaterial({color:'#050505'});for(const dx of [-60,60]){const e=new THREE.Mesh(new THREE.SphereGeometry(40,16,12),em);e.position.set(c.x+150,c.y+30,c.z+dx);sc.add(e)}}
 {const p=road(1);sc.add(at(glowSprite('#9ad0ff',5000,.6),p.x,p.y,p.z-1500));sc.add(at(new THREE.Mesh(new THREE.SphereGeometry(300,32,24),new THREE.MeshBasicMaterial({color:'#d8f0ff'})),p.x,p.y,p.z-1500))}}
/* 模仿之星系统 (age 11): seven tumblers round one star — the first glowing with molten-gold lakes, the all-green mimic star with its
   coral towers, the cold seventh where black beetles fight spear phalanxes by torchlight, the sixth's empty neon city over a fleshy
   core, and the sixth's drowned moon sealed in a dark-green light curtain with swarms of green triangles */
ROAD.mofang=t=>V3(Math.sin(t*Math.PI*1.6)*700,Math.sin(t*Math.PI*2.2)*150,-3000+t*6000);
BUILDERS.mofang=()=>buildPath('mofang');
function mofangMore(sp){const sc=sp.scene,road=sp.road,Rn=rnd(867);const o=new THREE.Object3D();
 {const p=road(.5),c=V3(p.x+2200,p.y+400,p.z);sc.add(at(glowSprite('#fff0d0',2600,.6),c.x,c.y,c.z));sc.add(at(new THREE.Mesh(new THREE.SphereGeometry(260,32,24),new THREE.MeshBasicMaterial({color:'#fff8e8'})),c.x,c.y,c.z))}
 const P=(t,sd,r,mat)=>{const p=road(t),m=new THREE.Mesh(new THREE.SphereGeometry(r,48,32),mat);m.position.set(p.x+sd*(r+500),p.y,p.z);sc.add(m);return m};
 {const pl=P(.04,-1,300,new THREE.MeshStandardMaterial({color:'#8a5020',roughness:.8,emissive:'#ff8a20',emissiveIntensity:.25,flatShading:true}));
  const lm=new THREE.MeshBasicMaterial({color:'#ffc040'});for(let k=0;k<10;k++){const n=V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize();const l=new THREE.Mesh(new THREE.CircleGeometry(20+Rn()*40,16),lm);l.position.copy(pl.position).addScaledVector(n,301);l.lookAt(pl.position.clone().addScaledVector(n,400));sc.add(l)}}
 {const pl=P(.2,1,320,new THREE.MeshStandardMaterial({color:'#2a9a3a',roughness:.7}));const cm=new THREE.MeshStandardMaterial({color:'#3ac850',roughness:.6,flatShading:true});const ci=new THREE.InstancedMesh(new THREE.CylinderGeometry(.4,1,1,7),cm,120);
  for(let i=0;i<120;i++){const n=V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize();const h=20+Rn()*60;o.position.copy(pl.position).addScaledVector(n,320+h/2);o.quaternion.setFromUnitVectors(V3(0,1,0),n);o.scale.set(6+Rn()*6,h,6+Rn()*6);o.updateMatrix();ci.setMatrixAt(i,o.matrix)}sc.add(ci)}
 {const pl=P(.36,-1,280,new THREE.MeshStandardMaterial({color:'#2a2a30',roughness:.95,flatShading:true}));const fm=new THREE.MeshBasicMaterial({color:'#ffa040'});const fi=new THREE.InstancedMesh(new THREE.SphereGeometry(2.5,6,4),fm,80);
  for(let i=0;i<80;i++){const n=V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize();if(n.x<-.2)n.x=-n.x;o.position.copy(pl.position).addScaledVector(n,283);o.scale.set(1,1,1);o.rotation.set(0,0,0);o.updateMatrix();fi.setMatrixAt(i,o.matrix)}sc.add(fi)}
 {const pl=P(.6,1,300,new THREE.MeshStandardMaterial({color:'#4a4a58',roughness:.6,metalness:.3}));const nm=new THREE.MeshStandardMaterial({color:'#1a1a24',emissive:'#ff3ac8',emissiveIntensity:.5,roughness:.4});const ni=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),nm,90);
  for(let i=0;i<90;i++){const n=V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize();if(n.x>.2)n.x=-n.x;const h=10+Rn()*40;o.position.copy(pl.position).addScaledVector(n,300+h/2);o.quaternion.setFromUnitVectors(V3(0,1,0),n);o.scale.set(6,h,6);o.updateMatrix();ni.setMatrixAt(i,o.matrix)}sc.add(ni)}
 {const p=road(.8),c=V3(p.x-750,p.y+80,p.z);const w=new THREE.Mesh(new THREE.SphereGeometry(180,40,28),new THREE.MeshStandardMaterial({color:'#1a5a6a',roughness:.15,metalness:.2}));w.position.copy(c);sc.add(w);
  const cur=new THREE.Mesh(new THREE.SphereGeometry(240,40,28),new THREE.MeshBasicMaterial({color:'#1a8a4a',transparent:true,opacity:.18,depthWrite:false}));cur.position.copy(c);sc.add(cur);
  const g=new THREE.Group();g.position.copy(c);g.add(evPoints(900,8671,evSwarmMat({col:'#5aff8a',rx:320,ry:320,rz:320,speed:.15,size:7,op:.9})));sc.add(g)}}
/* 古代泥浆 (age 10): the stability worms' flesh-crusted stations and the drifting tunnel flowers, the copper rust lake where 爆吞
   bursts out, the endless grey mud plain under a dull sky, then the ancient mud's 300 km corpse — red and grey, ringed by floating
   red stones, crowned with red rock towers — and underneath the red river of tool-mud running to the 载入点 cave */
ROAD.nijiang=t=>V3(Math.sin(t*Math.PI*1.8)*700,t<.62?Math.sin(t*Math.PI*3)*120:-(t-.62)*1800,3000-t*6000);
BUILDERS.nijiang=()=>buildPath('nijiang');
function nijiangMore(sp){const sc=sp.scene,road=sp.road,Rn=rnd(877);const o=new THREE.Object3D();
 {const p=road(.05),fm=new THREE.MeshStandardMaterial({color:'#8a5a5a',roughness:.7,emissive:'#4a1a1a',emissiveIntensity:.2,flatShading:true});for(let k=0;k<4;k++){const st=new THREE.Mesh(lumpRock(1,2),fm);st.position.set(p.x+(k%2?1:-1)*(450+k*80),p.y+(k-1.5)*120,p.z+(k-2)*200);st.scale.set(70,50,90);sc.add(st)}}
 {const pm=[new THREE.MeshStandardMaterial({color:'#e86aa8',roughness:.5,side:THREE.DoubleSide}),new THREE.MeshStandardMaterial({color:'#f0c040',roughness:.5,side:THREE.DoubleSide})];
  for(let k=0;k<5;k++){const p=road(.12+k*.025),c=V3(p.x+(k%2?1:-1)*(500+Rn()*300),p.y+(Rn()-.5)*300,p.z);const g=new THREE.Group();g.position.copy(c);g.rotation.set(Rn(),Rn()*3,Rn());
   for(let i=0;i<6;i++){const pe=new THREE.Mesh(new THREE.SphereGeometry(60,16,8,0,1.2,0,Math.PI/2),pm[k%2]);pe.rotation.y=i/6*6.28;pe.scale.set(1,.25,1);g.add(pe)}sc.add(g)}}
 {const p=road(.24);const l=new THREE.Mesh(new THREE.CircleGeometry(320,48),new THREE.MeshStandardMaterial({color:'#b8703a',metalness:.7,roughness:.35}));l.rotation.x=-Math.PI/2;l.position.set(p.x-600,p.y-80,p.z);sc.add(l)}
 {const p=road(.38);const pl=new THREE.Mesh(new THREE.PlaneGeometry(4000,1800),new THREE.MeshStandardMaterial({color:'#6a6862',roughness:1}));pl.rotation.x=-Math.PI/2;pl.position.set(p.x,p.y-90,p.z);sc.add(pl);
  const gl=new THREE.Mesh(new THREE.CircleGeometry(200,40),new THREE.MeshStandardMaterial({color:'#e8c050',metalness:.8,roughness:.2}));gl.rotation.x=-Math.PI/2;gl.position.set(p.x+700,p.y-88,p.z+200);sc.add(gl)}
 {const p=road(.6),c=V3(p.x,p.y-900,p.z-200);const body=new THREE.Mesh(lumpRock(1,2),new THREE.MeshStandardMaterial({color:'#7a4a44',roughness:.9,flatShading:true}));body.position.copy(c);body.scale.set(1100,700,1300);sc.add(body);
  const tm=new THREE.MeshStandardMaterial({color:'#a8322a',roughness:.8,flatShading:true});const ti=new THREE.InstancedMesh(new THREE.ConeGeometry(1,1,5),tm,90);for(let i=0;i<90;i++){o.position.set(c.x+(Rn()-.5)*1200,c.y+620+Rn()*60,c.z+(Rn()-.5)*1400);o.rotation.set(0,Rn()*3,0);o.scale.set(14+Rn()*14,60+Rn()*120,14+Rn()*14);o.updateMatrix();ti.setMatrixAt(i,o.matrix)}sc.add(ti);
  const sm=new THREE.MeshStandardMaterial({color:'#c83a2a',roughness:.6,emissive:'#5a1008',emissiveIntensity:.3,flatShading:true});const si=new THREE.InstancedMesh(lumpRock(1,1),sm,200);for(let i=0;i<200;i++){const a=Rn()*6.28,r=1500+Rn()*700;o.position.set(c.x+Math.cos(a)*r,c.y+(Rn()-.5)*900,c.z+Math.sin(a)*r);o.rotation.set(Rn()*3,Rn()*3,0);const q=6+Rn()*20;o.scale.set(q,q,q);o.updateMatrix();si.setMatrixAt(i,o.matrix)}si.frustumCulled=false;sc.add(si)}
 {const pts=[];for(let i=0;i<=20;i++){const p=road(.78+i/20*.22);pts.push(V3(p.x+(i%2?40:-40),p.y-60,p.z))}sc.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),80,30,8,false),new THREE.MeshStandardMaterial({color:'#c01818',roughness:.2,emissive:'#600808',emissiveIntensity:.5})));
  const p=road(1);const pot=new THREE.Mesh(new THREE.SphereGeometry(80,32,20,0,6.28,.3,Math.PI*.7),new THREE.MeshStandardMaterial({color:'#4a4040',metalness:.5,roughness:.5,side:THREE.DoubleSide}));pot.position.set(p.x+200,p.y,p.z-200);sc.add(pot)}}
/* 漂泊者之家 (age 12): a shrinking pocket between two voids, crossed along a star-pipe — the collector's pipes, a barren world with two
   moons studded with silver spear-ships, the broken 60,000 km pipe with the 裂猎's mushroom-tower city, the collapsing realm, a wall
   millions of km wide of km-sized black tar tinkers, and through a rift the tinkers' home of mismatched stations rotting into mud */
ROAD.xiubu=t=>V3(Math.sin(t*Math.PI*1.5)*700,Math.sin(t*Math.PI*2.5)*140,-3000+t*6000);
BUILDERS.xiubu=()=>buildPath('xiubu');
function xiubuMore(sp){const sc=sp.scene,road=sp.road,Rn=rnd(887);const o=new THREE.Object3D();
 {const pts=[];for(let i=0;i<=30;i++){const p=road(i/30*.45);pts.push(V3(p.x-700,p.y+260,p.z))}sc.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),90,60,12,false),new THREE.MeshStandardMaterial({color:'#7a7a8a',metalness:.6,roughness:.4,emissive:'#2a2a4a',emissiveIntensity:.3})))}
 {const p=road(.22),c=V3(p.x+800,p.y,p.z);sc.add(at(new THREE.Mesh(new THREE.SphereGeometry(220,40,28),new THREE.MeshStandardMaterial({color:'#8a7a68',roughness:1,flatShading:true})),c.x,c.y,c.z));
  const mm=new THREE.MeshStandardMaterial({color:'#6a6a70',roughness:.9});for(const [dx,dy] of [[320,140],[-260,-180]]){const m=new THREE.Mesh(new THREE.SphereGeometry(60,24,16),mm);m.position.set(c.x+dx,c.y+dy,c.z);sc.add(m)}
  const sm=new THREE.MeshStandardMaterial({color:'#e8eef4',metalness:.9,roughness:.2});const si=new THREE.InstancedMesh(new THREE.ConeGeometry(1,1,6),sm,60);for(let i=0;i<60;i++){const n=V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize();o.position.copy(c).addScaledVector(n,230);o.quaternion.setFromUnitVectors(V3(0,1,0),n);o.scale.set(3,24,3);o.updateMatrix();si.setMatrixAt(i,o.matrix)}sc.add(si)}
 {const p=road(.42),pm=new THREE.MeshStandardMaterial({color:'#4a4a52',metalness:.5,roughness:.6});const pipe=new THREE.Mesh(new THREE.CylinderGeometry(160,160,2600,24,1,true),pm);pipe.rotation.z=Math.PI/2;pipe.position.set(p.x,p.y-260,p.z+300);sc.add(pipe);
  const mu=new THREE.MeshStandardMaterial({color:'#c8a080',roughness:.6,emissive:'#4a2a1a',emissiveIntensity:.2});const mi=new THREE.InstancedMesh(new THREE.SphereGeometry(1,12,8,0,6.28,0,Math.PI/2),mu,50),st=new THREE.InstancedMesh(new THREE.CylinderGeometry(1,1,1,8),pm,50);
  for(let i=0;i<50;i++){const x=p.x-1100+Rn()*2200,h=30+Rn()*90;o.position.set(x,p.y-100+h/2,p.z+300+(Rn()-.5)*120);o.rotation.set(0,0,0);o.scale.set(5,h,5);o.updateMatrix();st.setMatrixAt(i,o.matrix);o.position.y=p.y-100+h;o.scale.set(18+Rn()*14,10,18+Rn()*14);o.updateMatrix();mi.setMatrixAt(i,o.matrix)}sc.add(mi,st)}
 {const p=road(.6),rm=new THREE.MeshStandardMaterial({color:'#5a5450',roughness:.9,flatShading:true});const ri=new THREE.InstancedMesh(lumpRock(1,2),rm,120);for(let i=0;i<120;i++){const q=road(.52+Rn()*.14);o.position.set(q.x+(Rn()-.5)*2000,q.y+(Rn()-.5)*800,q.z+(Rn()-.5)*400);o.rotation.set(Rn()*3,Rn()*3,Rn()*3);const r=10+Rn()*40;o.scale.set(r,r*(.5+Rn()),r);o.updateMatrix();ri.setMatrixAt(i,o.matrix)}ri.frustumCulled=false;sc.add(ri)}
 {const p=road(.72),tm=new THREE.MeshStandardMaterial({color:'#0a0806',roughness:.15,metalness:.3});const ti=new THREE.InstancedMesh(new THREE.SphereGeometry(1,10,8),tm,400);
  for(let i=0;i<400;i++){o.position.set(p.x+(Rn()-.5)*3200,p.y+(Rn()-.5)*1600,p.z-500+(Rn()-.5)*80);o.rotation.set(Rn()*3,Rn()*3,0);const r=30+Rn()*40;o.scale.set(r,r*.8,r*1.2);o.updateMatrix();ti.setMatrixAt(i,o.matrix)}ti.frustumCulled=false;sc.add(ti)}
 {const p=road(.9),c=V3(p.x,p.y,p.z-500);const cm=[new THREE.MeshStandardMaterial({color:'#7a6a5a',metalness:.4,roughness:.6}),new THREE.MeshStandardMaterial({color:'#5a6a7a',metalness:.5,roughness:.5}),new THREE.MeshStandardMaterial({color:'#4a3a28',roughness:1})];
  for(let k=0;k<9;k++){const g=k%3==0?new THREE.BoxGeometry(80,60,120):k%3==1?new THREE.CylinderGeometry(40,50,120,10):new THREE.SphereGeometry(50,16,12);const m=new THREE.Mesh(g,cm[k%3]);m.position.set(c.x+(Rn()-.5)*1400,c.y+(Rn()-.5)*500,c.z+(Rn()-.5)*400);m.rotation.set(Rn(),Rn()*3,Rn());sc.add(m)}
  const tun=new THREE.Mesh(new THREE.CylinderGeometry(30,30,1800,16,1,true),new THREE.MeshStandardMaterial({color:'#f4f4f4',roughness:.6,side:THREE.DoubleSide}));tun.rotation.x=Math.PI/2;tun.position.set(c.x,c.y+700,c.z-300);sc.add(tun)}}
// a road world with no entries yet starts at the head of its road
for(const id of ['order','lianjie','hope','deathship','xuying','tunshi','anmian','ranxing','bridge','benglie','jiqimin','fengxi','shenyan','hunhe','qijidu','shanguang','mofang','nijiang','xiubu'])if(!WIKI.some(w=>w.m===id)){const p=ROAD[id](.02);HOME[id]={a:-p.z,b:p.x,alt:1400,head:0,y:p.y}}
