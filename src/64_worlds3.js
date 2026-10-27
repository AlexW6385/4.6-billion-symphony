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
// a road world with no entries yet starts at the head of its road
for(const id of ['order','lianjie','hope','deathship','xuying'])if(!WIKI.some(w=>w.m===id)){const p=ROAD[id](.02);HOME[id]={a:-p.z,b:p.x,alt:1400,head:0,y:p.y}}
