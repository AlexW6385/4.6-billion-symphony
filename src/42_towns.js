/* ================================================================
   towns: streets running out from a square, houses facing them, walls and gates,
   fields outside, smoke from chimneys, lamps at night, people in the streets.
   ================================================================ */
// a gable roof w wide (ridge along x), d deep, h high, centred on its own mid-height
const prism=(w,h,d)=>{const g=new THREE.CylinderGeometry(1,1,1,3);g.rotateZ(Math.PI/2);g.rotateX(-Math.PI/2);g.translate(0,.5,0);g.scale(w,h*1.4/1.5,d/1.732);g.translate(0,-h/2,0);return g};
/* building kits: each style has small (s), medium (m) and tall (t) buildings, several of each, so no street repeats itself.
   Parts tinted '#ffffff' take the wall colour of the instance; everything else keeps its own colour. */
const WINC='#262a32',DOORC='#3a2a1e',BEAM='#5a4632';
// window insets on the front (+z) and sides of a w×h×d block whose base is at y0
function fac(w,h,d,y0,rows,cols,o){o=o||{};const P=[];const wc=o.c||WINC,ww=o.w||.42,wh=o.h||.55;
 for(let r=0;r<rows;r++){const y=y0+h*(r+.6)/rows;for(let c=0;c<cols;c++){const x=-w/2+w*(c+.5)/cols;P.push([kb(ww,wh,.06),wc,{p:[x,y,d/2+.02]}]);if(!o.front)P.push([kb(ww,wh,.06),wc,{p:[x,y,-d/2-.02]}])}
  if(!o.noSide){const n2=Math.max(1,Math.round(cols*d/w));for(let c=0;c<n2;c++){const z=-d/2+d*(c+.5)/n2;P.push([kb(.06,wh,ww),wc,{p:[w/2+.02,y,z]}]);P.push([kb(.06,wh,ww),wc,{p:[-w/2-.02,y,z]}])}}}return P}
const door=(x,z,w,h,c)=>[kb(w||.7,h||1.2,.1),c||DOORC,{p:[x,(h||1.2)/2,z]}];
const hemi=(r,s)=>new THREE.SphereGeometry(r,s||12,Math.max(4,(s||12)>>1),0,6.283,0,1.5708);
const ring=(r,t,s)=>tg(new THREE.TorusGeometry(r,t,5,s||16),{r:[Math.PI/2,0,0]});
const gear=(r,t)=>{const P=[[new THREE.TorusGeometry(r,t,4,14),'#8a9096',{}]];for(let i=0;i<10;i++){const a=i/10*6.283;P.push([kb(t*2.2,t*2.2,t*1.6),'#8a9096',{p:[Math.cos(a)*(r+t*1.3),Math.sin(a)*(r+t*1.3),0],r:[0,0,a]}])}return P};
const TOWNKIT={
 // 翡翠龙: stone and timber, thatch and tile
 dragon:{roof:['#3f7a4a','#6a5a3a','#4a6a3a','#7a4a2a'],wall:['#b8a888','#a89878','#c8b898'],kits:(rf)=>({
  s:[G([[kcy(1.35,1.5,2.2,10),'#ffffff',{p:[0,1.1,0]}],[kc(1.95,1.9,10),rf,{p:[0,3.1,0]}],door(0,1.45),[kcy(.18,.2,1,6),'#6a6058',{p:[.7,3.4,.3]}]]),
     G([[kb(2.2,1.8,2),'#ffffff',{p:[0,.9,0]}],[prism(2.6,.85,2.4),rf,{p:[0,2.22,0]}],door(-.4,1.02),[kb(.45,.45,.06),WINC,{p:[.5,1.1,1.02]}],[kb(1.2,1,1.4),'#d8cfb8',{p:[1.65,.5,-.2]}],[kb(1.5,.08,1.7),rf,{p:[1.65,1.15,-.2],r:[0,0,-.35]}]]),
     G([...[[-.7,-.7],[.7,-.7],[-.7,.7],[.7,.7]].map(([x,z])=>[kcy(.12,.14,1.2,5),BEAM,{p:[x,.6,z]}]),[kb(1.9,1.3,1.9),'#ffffff',{p:[0,1.85,0]}],[kc(1.6,1.4,4),rf,{p:[0,3.2,0],r:[0,.785,0]}],[kb(.18,1.3,.18),BEAM,{p:[0,.65,1.2],r:[.5,0,0]}]])],
  m:[G([[kb(3.2,2.2,2.3),'#ffffff',{p:[0,1.1,0]}],[prism(3.6,1.05,2.7),rf,{p:[0,2.75,0]}],door(.4,1.18),...fac(3.2,2.2,2.3,0,1,3,{front:1}),[kb(3.4,.25,.25),BEAM,{p:[0,2.2,1.2]}],[kb(3.4,.25,.25),BEAM,{p:[0,2.2,-1.2]}]]),
     G([[kb(2.8,1.7,2.4),'#ffffff',{p:[0,.85,0]}],[kb(2.8,1.6,2.4),'#ffffff',{p:[0,2.5,0]}],[kb(3.2,.18,.9),BEAM,{p:[0,1.75,1.55]}],...[-1.3,0,1.3].map(x=>[kcy(.06,.06,.8,4),BEAM,{p:[x,2.1,1.9]}]),[kb(3.2,.1,.1),BEAM,{p:[0,2.5,1.95]}],[prism(3.2,1.1,2.8),rf,{p:[0,3.85,0]}],door(0,1.22),...fac(2.8,1.6,2.4,1.7,1,3,{front:1})]),
     G([[kb(3,2,2),'#ffffff',{p:[0,1,0]}],[kb(2,2,2.4),'#ffffff',{p:[-.5,1,2]}],[prism(3.4,.95,2.4),rf,{p:[0,2.45,0]}],[prism(2.4,.95,2.8),rf,{p:[-.5,2.45,2],r:[0,Math.PI/2,0]}],door(.8,1.02),[kb(.45,.45,.06),WINC,{p:[-.5,1.2,3.22]}],[kcy(.18,.22,1.2,6),'#6a6058',{p:[1,2.9,-.4]}]]),
     G([[kb(3.4,2.3,2.6),'#ffffff',{p:[0,1.15,-.2]}],[kb(3.8,.12,1.6),rf,{p:[0,2.15,1.6],r:[.25,0,0]}],...[-1.6,1.6].map(x=>[kcy(.08,.08,2.1,5),BEAM,{p:[x,1.05,2.3]}]),[kb(2.4,1.4,.1),'#1e1a16',{p:[0,.7,1.12]}],[kb(1.2,.6,.6),'#8a6a40',{p:[1,.3,1.9]}],[prism(3.8,1.1,3),rf,{p:[0,2.85,-.2]}]])],
  t:[G([[kcy(1.1,1.3,5.2,8),'#ffffff',{p:[0,2.6,0]}],[kc(1.6,2.4,8),rf,{p:[0,6.4,0]}],[kb(.5,.5,.1),'#2a2018',{p:[0,4,1.15]}],[kcy(1.45,1.45,.3,8),BEAM,{p:[0,4.9,0]}]]),
     G([[kb(4,1.4,4),'#ffffff',{p:[0,.7,0]}],[kb(3,1.4,3),'#ffffff',{p:[0,2.1,0]}],[kb(2,1.4,2),'#ffffff',{p:[0,3.5,0]}],[kc(1.7,1.6,4),rf,{p:[0,5,0],r:[0,.785,0]}],[kb(1,1.6,4.6),'#9a8a70',{p:[0,.8,1.4],r:[-.55,0,0]}],door(0,1.52,.6,.9)]),
     G([[kcy(.9,1,4.4,10),'#ffffff',{p:[0,2.2,0]}],[kcy(1.25,1.1,1.2,10),'#ffffff',{p:[0,5,0]}],[kc(1.5,2,10),rf,{p:[0,6.6,0]}],[kcy(.03,.03,1.6,3),BEAM,{p:[0,8.3,0]}],[kb(.8,.5,.04),'#c84a3a',{p:[.4,8.7,0]}],...[0,1.57,3.14,4.71].map(a=>[kb(.4,.55,.06),WINC,{p:[Math.sin(a)*1.26,5.1,Math.cos(a)*1.26],r:[0,a,0]}])])]})},
 // 白骸龙: pale stone, flat roofs and battlements
 white:{roof:['#8a8478','#7a7468','#9a9488'],wall:['#e8e4d8','#dcd6c8','#f0ece2'],kits:(rf)=>({
  s:[G([[kb(2.6,2.6,2.6),'#ffffff',{p:[0,1.3,0]}],[kc(2.1,1.6,4),rf,{p:[0,3.4,0],r:[0,.785,0]}],door(0,1.31,.7,1.3),[kb(.4,.5,.06),WINC,{p:[.8,1.7,1.32]}]]),
     G([[kcy(1.3,1.4,2,12),'#ffffff',{p:[0,1,0]}],[tg(hemi(1.35),{}),'#d8d2c4',{p:[0,2,0]}],door(0,1.36,.6,1.1)]),
     G([[kb(2.2,2,2),'#ffffff',{p:[0,1,0]}],[tg(new THREE.CylinderGeometry(.45,.45,.1,10,1,false,0,Math.PI),{r:[Math.PI/2,0,0]}),DOORC,{p:[0,1.2,1.02]}],door(0,1.02,.9,1.2),...[-.8,0,.8].map(x=>[kb(.5,.35,.5),'#ffffff',{p:[x,2.15,.75]}])])],
  m:[G([[kb(3.4,3.4,2.4),'#ffffff',{p:[0,1.7,0]}],[kb(3.6,.3,2.6),'#c8c8c8',{p:[0,3.5,0]}],[kb(.9,.9,.9),'#ffffff',{p:[1,4.1,.5]}],...fac(3.4,3.4,2.4,0,2,3,{front:1}),door(-.9,1.22)]),
     G([[kb(3.4,2.6,3),'#ffffff',{p:[0,1.3,0]}],...[-1.4,-.47,.47,1.4].map(x=>[kb(.55,.5,.55),'#ffffff',{p:[x,2.85,1.25]}]),...[-1.4,-.47,.47,1.4].map(x=>[kb(.55,.5,.55),'#ffffff',{p:[x,2.85,-1.25]}]),...fac(3.4,2.6,3,0,1,3,{front:1}),door(0,1.52)]),
     G([[kb(4.2,.4,2.8),'#d8d2c4',{p:[0,.2,0]}],...[-1.7,-.57,.57,1.7].map(x=>[kcy(.2,.24,2.4,8),'#ffffff',{p:[x,1.6,1.1]}]),[kb(4,2.4,1.6),'#ffffff',{p:[0,1.6,-.4]}],[prism(4.4,.8,3),rf,{p:[0,3.2,0]}],door(0,.42,.9,1.4)])],
  t:[G([[kcy(.9,1,6,10),'#ffffff',{p:[0,3,0]}],[kc(1.1,2.6,10),rf,{p:[0,7.3,0]}],...[2,3.6,5].map(y=>[kb(.35,.5,.06),WINC,{p:[0,y,1.0]}])]),
     G([[kb(2.6,6,2.6),'#ffffff',{p:[0,3,0]}],[kb(3,.5,3),'#ffffff',{p:[0,6.2,0]}],...[-1.2,0,1.2].flatMap(x=>[[kb(.6,.6,.6),'#ffffff',{p:[x,6.75,1.2]}],[kb(.6,.6,.6),'#ffffff',{p:[x,6.75,-1.2]}],[kb(.6,.6,.6),'#ffffff',{p:[1.2,6.75,x]}],[kb(.6,.6,.6),'#ffffff',{p:[-1.2,6.75,x]}]]),...fac(2.6,6,2.6,0,3,2),door(0,1.32)]),
     G([[kb(3.6,2.4,2),'#ffffff',{p:[0,1.2,0]}],[kcy(.8,.9,5.6,10),'#ffffff',{p:[-1.6,2.8,0]}],[kcy(.8,.9,5.6,10),'#ffffff',{p:[1.6,2.8,0]}],[kc(1,1.8,10),rf,{p:[-1.6,6.5,0]}],[kc(1,1.8,10),rf,{p:[1.6,6.5,0]}],door(0,1.02,1,1.5),[kb(1.6,.3,.3),'#c8c2b4',{p:[0,4,0]}]])]})},
 // 银甲龙: polished metal, domes and rings
 silver:{roof:['#c8d4dc','#aab8c4','#d8e0e6'],wall:['#c0c8d0','#b0bac4','#d0d8de'],kits:(rf)=>({
  s:[G([[kcy(1.6,1.7,1.6,14),'#ffffff',{p:[0,.8,0]}],[tg(hemi(1.65,14),{}),'#e0e0e0',{p:[0,1.6,0]}],door(0,1.66,.7,1.1,'#3a4048'),[ring(1.7,.08),'#8a949c',{p:[0,1.6,0]}]]),
     G([[tg(new THREE.CylinderGeometry(1,1,3,12),{r:[0,0,Math.PI/2]}),'#ffffff',{p:[0,1.1,0]}],[tg(new THREE.SphereGeometry(1,12,8),{s:[.4,1,1]}),'#e0e0e0',{p:[1.5,1.1,0]}],[tg(new THREE.SphereGeometry(1,12,8),{s:[.4,1,1]}),'#e0e0e0',{p:[-1.5,1.1,0]}],[kb(2.6,.2,1.6),'#7a848c',{p:[0,.1,0]}],[kb(.5,.5,.1),WINC,{p:[.6,1.3,1]}],[kb(.5,.5,.1),WINC,{p:[-.6,1.3,1]}]]),
     G([[kcy(1.3,1.3,1.8,6),'#ffffff',{p:[0,.9,0]}],[kc(1.4,.9,6),'#e0e0e0',{p:[0,2.25,0]}],[kcy(.05,.05,1.4,4),'#8a949c',{p:[0,3.3,0]}],[ks(.12,6,4),'#cfe6ff',{p:[0,4,0]}],door(0,1.13,.6,1.1,'#3a4048')])],
  m:[G([[kb(2.8,3.8,2.8),'#ffffff',{p:[0,1.9,0]}],[tg(hemi(1.2),{}),'#e0e0e0',{p:[0,3.8,0]}],[kcy(.06,.06,2.2,4),'#ffffff',{p:[0,5.6,0]}],...fac(2.8,3.8,2.8,0,2,2)]),
     G([[tg(new THREE.CylinderGeometry(1.8,1.8,4.4,14,1,false,0,Math.PI),{r:[0,0,Math.PI/2]}),'#ffffff',{}],[kb(.1,1.9,2.4),'#2e343c',{p:[2.22,.95,0]}],...[-1.4,0,1.4].map(x=>[tg(new THREE.TorusGeometry(1.84,.07,5,14,Math.PI),{r:[0,Math.PI/2,0]}),'#8a949c',{p:[x,0,0]}])]),
     G([[kb(3,2,2.4),'#ffffff',{p:[0,1,0]}],[kb(2,1.6,1.8),'#ffffff',{p:[-.3,2.8,-.1]}],[kcy(.18,.18,3,6),'#8a949c',{p:[1.3,2.2,-.9]}],[kcy(.18,.18,3,6),'#8a949c',{p:[1.3,2.2,-.4]}],[tg(new THREE.TorusGeometry(.4,.1,5,10,Math.PI),{}),'#8a949c',{p:[1.3,3.7,-.65],r:[0,Math.PI/2,0]}],...fac(3,2,2.4,0,1,3,{front:1}),door(-.9,1.22,.7,1.2,'#3a4048')])],
  t:[G([[kcy(.8,1.3,8,8),'#ffffff',{p:[0,4,0]}],[kc(.9,3,8),'#e8e8e8',{p:[0,9.5,0]}],[ring(1.1,.12),'#ffffff',{p:[0,6,0]}]]),
     G([[kcy(.7,.9,9,10),'#ffffff',{p:[0,4.5,0]}],...[3,5.5,8].map((y,i)=>[kcy(1.8-i*.35,1.8-i*.35,.25,16),'#d8e0e6',{p:[0,y,0]}]),[kcy(.04,.04,2.4,4),'#8a949c',{p:[0,10.2,0]}],[ks(.18,6,4),'#ff6a5a',{p:[0,11.4,0]}]]),
     G([[kb(2.4,2,2.4),'#ffffff',{p:[0,1,0]}],...[[-.6,-.6,7],[.6,-.5,8.5],[0,.6,6]].map(([x,z,h])=>[kcy(.35,.45,h,8),'#9aa4ac',{p:[x,h/2,z]}]),...[[-.6,-.6,7],[.6,-.5,8.5],[0,.6,6]].map(([x,z,h])=>[kcy(.5,.5,.25,8),'#5a6268',{p:[x,h,z]}])])]})},
 // gold and white: palaces, temples, colonnades
 grand:{roof:['#e8c060','#d8b050','#f0d080'],wall:['#f4f0e6','#e8e2d4','#fffaf0'],kits:(rf)=>({
  s:[G([[kb(3,3,3),'#ffffff',{p:[0,1.5,0]}],[tg(hemi(1.4),{}),'#d8d8d8',{p:[0,3,0]}],door(0,1.51,.8,1.6,'#6a5038')]),
     G([[kcy(1.4,1.4,2.4,8),'#ffffff',{p:[0,1.2,0]}],[kc(1.7,1.2,8),rf,{p:[0,3,0]}],...[0,1,2,3,4,5,6,7].map(i=>[kcy(.1,.1,2.4,5),'#e8e0cc',{p:[Math.cos(i*.785)*1.55,1.2,Math.sin(i*.785)*1.55]}])]),
     G([[kb(2.4,2.2,2.4),'#ffffff',{p:[0,1.1,0]}],[kb(2.7,.3,2.7),'#e0d8c4',{p:[0,2.35,0]}],[kc(.5,1.4,4),rf,{p:[.9,3.2,.9]}],[kc(.5,1.4,4),rf,{p:[-.9,3.2,-.9]}],door(0,1.22,.7,1.3,'#6a5038')])],
  m:[G([[kb(4,2.4,3),'#ffffff',{p:[0,1.2,0]}],...[-1.5,-.5,.5,1.5].map(x=>[kcy(.18,.18,2.4,6),'#ffffff',{p:[x,1.2,1.6]}]),[prism(4.4,.9,3.4),'#d0d0d0',{p:[0,2.85,0]}],door(0,1.52,.9,1.6,'#6a5038')]),
     G([[kcy(1.8,1.9,2.6,8),'#ffffff',{p:[0,1.3,0]}],[kcy(1.3,1.3,1,8),'#ffffff',{p:[0,3.1,0]}],[tg(hemi(1.35),{}),rf,{p:[0,3.6,0]}],[kc(.2,1,6),rf,{p:[0,5.3,0]}],door(0,1.85,.8,1.5,'#6a5038'),...[0,1,2,3].map(i=>[kb(.4,.7,.06),WINC,{p:[Math.sin(i*1.57+.785)*1.86,1.6,Math.cos(i*1.57+.785)*1.86],r:[0,i*1.57+.785,0]}])]),
     G([[kb(5,1.8,2),'#ffffff',{p:[0,.9,-.5]}],...[-2,-1,0,1,2].map(x=>[tg(new THREE.CylinderGeometry(.45,.45,.2,10,1,false,0,Math.PI),{r:[Math.PI/2,0,0]}),'#e8e0cc',{p:[x,1.1,.52]}]),...[-2.5,-1.5,-.5,.5,1.5,2.5].map(x=>[kcy(.13,.13,1.6,6),'#ffffff',{p:[x,.8,.55]}]),[kb(5.2,.3,2.4),rf,{p:[0,1.95,-.3]}]])],
  t:[G([[kcy(1,1.2,7,10),'#ffffff',{p:[0,3.5,0]}],[tg(new THREE.SphereGeometry(1.3,12,8),{}),'#d8d8d8',{p:[0,7.6,0]}],[kc(.3,1.6,6),'#ffffff',{p:[0,9.4,0]}]]),
     G([[kb(1.6,1,1.6),'#ffffff',{p:[0,.5,0]}],[tg(new THREE.CylinderGeometry(.3,.6,8,4),{r:[0,.785,0]}),'#ffffff',{p:[0,5,0]}],[kc(.45,.9,4),rf,{p:[0,9.45,0],r:[0,.785,0]}]]),
     G([[kb(2,7,2),'#ffffff',{p:[0,3.5,0]}],[kb(2.4,.3,2.4),'#e0d8c4',{p:[0,7.1,0]}],...[[-.8,-.8],[.8,-.8],[-.8,.8],[.8,.8]].map(([x,z])=>[kcy(.12,.12,1.4,5),'#ffffff',{p:[x,7.9,z]}]),[tg(hemi(1.1),{}),rf,{p:[0,8.6,0]}],[kb(.7,1,.06),WINC,{p:[0,5.8,1.02]}],...fac(2,5,2,0,3,1)])]})},
 // 创造之城: an armoured city of workshops, forges and gear columns
 forge:{roof:['#6a737a','#5a6268','#7a848a'],wall:['#a8b0b6','#98a2a8','#b8c0c4'],kits:(rf)=>({
  s:[G([[kb(3,1.6,2.6),'#ffffff',{p:[0,.8,0]}],[kb(3.2,.1,1.7),rf,{p:[0,1.95,.65],r:[.55,0,0]}],[kb(3.2,.1,1.7),rf,{p:[0,1.95,-.65],r:[-.55,0,0]}],[kb(3.1,.12,.1),'#3a4044',{p:[0,1.2,1.32]}],door(.8,1.32,.8,1.1,'#2a3034')]),
     G([[kb(3.2,2,2.6),'#ffffff',{p:[0,1,-.3]}],[kb(2.8,1.6,.1),'#1a1c1e',{p:[0,.8,1.02]}],[kb(1.6,.3,.3),BEAM,{p:[0,2.2,0]}],[kb(.2,.2,2.4),BEAM,{p:[0,2.4,.2],r:[.2,0,0]}],[tg(new THREE.TorusGeometry(.7,.04,4,10,Math.PI),{}),BEAM,{p:[0,2.45,1.3],r:[Math.PI/2,0,0]}],[kb(3.4,.2,3),rf,{p:[0,2.05,-.3]}]]),
     G([[kb(2.6,2.4,2.4),'#ffffff',{p:[0,1.2,0]}],...gear(.9,.12).map(([g,c,f])=>[g,c,{p:[(f.p||[0,0,0])[0],1.5+(f.p||[0,0,0])[1],1.3],r:f.r}]),[kb(2.8,.3,2.6),rf,{p:[0,2.55,0]}],door(-.8,1.22,.6,1.1,'#2a3034')])],
  m:[G([[kb(4.2,2.8,3),'#ffffff',{p:[0,1.4,0]}],[prism(4.4,1,3.2),rf,{p:[0,3.3,0]}],[kcy(.35,.45,4.4,8),'#5a6268',{p:[1.4,4.4,-.8]}],[kcy(.35,.45,3.6,8),'#5a6268',{p:[-1.2,4,-.8]}],[kcy(.5,.5,.3,8),'#3a4044',{p:[1.4,6.6,-.8]}],[kb(2,1.6,.1),'#1a1c1e',{p:[0,.8,1.52]}],[kb(2.2,.3,.3),'#c86a3a',{p:[0,1.7,1.55]}]]),
     G([[kb(5,1.8,2.2),'#ffffff',{p:[0,.9,0]}],[kb(5.2,.25,2.4),rf,{p:[0,1.9,0]}],...[-2,-1,0,1,2].map(x=>[kb(.55,.5,.06),WINC,{p:[x,1.2,1.12]}]),...[-2.1,-1.4,-.7,0,.7,1.4,2.1].map(x=>[tg(new THREE.CylinderGeometry(.28,.28,.08,8),{r:[Math.PI/2,0,0]}),'#c8b070',{p:[x,.5,1.15]}]),door(0,1.12,.8,1.2,'#2a3034')]),
     G([[kb(.4,6,.4),'#5a6268',{p:[-1.8,3,0]}],[kb(.4,6,.4),'#5a6268',{p:[1.8,3,0]}],[kb(4.2,.4,.4),'#5a6268',{p:[0,6,0]}],[kb(.3,.3,5),'#7a848a',{p:[0,6.2,1.6],r:[.1,0,0]}],[kcy(.02,.02,3,3),'#2a3034',{p:[0,5,3.6]}],[kb(.6,.6,.6),'#8a6a40',{p:[0,3.4,3.6]}],[kb(4,1.2,2),'#ffffff',{p:[0,.6,-1.2]}]]),
     G([[tg(new THREE.SphereGeometry(1,12,8),{s:[2.6,.7,1]}),'#9aa4ac',{p:[0,1.6,0]}],[kb(4,.3,1.6),'#5a6268',{p:[0,.9,0]}],...[-1.6,-.5,.5,1.6].flatMap(x=>[[tg(new THREE.CylinderGeometry(.45,.45,.25,10),{r:[Math.PI/2,0,0]}),'#2a3034',{p:[x,.45,.95]}],[tg(new THREE.CylinderGeometry(.45,.45,.25,10),{r:[Math.PI/2,0,0]}),'#2a3034',{p:[x,.45,-.95]}]]),[kb(1.2,.7,.8),'#7a848a',{p:[.6,2.5,0]}],[kb(.15,.15,1.8),BEAM,{p:[-1.4,2.4,0],r:[0,0,.3]}]])],
  t:[G([[kcy(.9,1,7,12),'#ffffff',{p:[0,3.5,0]}],...[1.6,3.6,5.6].flatMap(y=>gear(1.1,.14).map(([g,c,f])=>[g,c,{p:[(f.p||[0,0,0])[0],y+(f.p||[0,0,0])[1],1.05],r:f.r}])),[kcy(.5,.5,1.4,8),'#5a6268',{p:[0,7.7,0]}],[kb(1.4,.4,1.4),'#3a4044',{p:[0,8.5,0]}]]),
     G([[kb(2.4,2.4,2.4),'#ffffff',{p:[0,1.2,0]}],[kcy(.7,1.1,9,10),'#7a848a',{p:[0,6.9,0]}],[kcy(.8,.8,.4,10),'#3a4044',{p:[0,11.4,0]}],...[4,7,10].map(y=>[ring(1.05-(y-4)*.04,.08,12),'#3a4044',{p:[0,y,0]}])]),
     G([[kcy(1.6,2,2,8),'#ffffff',{p:[0,1,0]}],[kcy(.6,.8,6,8),'#ffffff',{p:[0,5,0]}],[kcy(2.2,2.2,.3,8),rf,{p:[0,8.1,0]}],[kb(.3,.3,3.4),BEAM,{p:[0,8.6,.6],r:[-.3,0,0]}],[tg(new THREE.TorusGeometry(1.2,.05,4,10,Math.PI),{}),BEAM,{p:[0,8.6,1.8],r:[Math.PI/2,0,0]}],...[0,1,2,3,4,5,6,7].map(i=>[kb(.4,.5,.4),'#ffffff',{p:[Math.cos(i*.785)*2,8.5,Math.sin(i*.785)*2]}])])]})},
 // 尔什: glass and steel, setbacks, sky bridges and screens
 future:{roof:['#3a4a5a','#4a5a6a','#2a3a4a'],wall:['#c8d0d8','#d8dee4','#b8c2cc','#e0e4e8'],kits:(rf)=>({
  s:[G([[kb(3.4,1.6,2.6),'#ffffff',{p:[0,.8,0]}],[kb(3.5,.5,2.7),'#3a5a7a',{p:[0,1.2,0]}],[kb(3.6,.12,2.8),rf,{p:[0,1.66,0]}],[kb(1,1,.08),'#2a3038',{p:[-.8,.5,1.32]}]]),
     G([[tg(new THREE.SphereGeometry(1.3,14,10),{s:[1.2,.75,1]}),'#ffffff',{p:[0,1,0]}],[tg(new THREE.SphereGeometry(1.3,14,6,0,6.283,1.2,.6),{s:[1.22,.77,1.02]}),'#3a5a7a',{p:[0,1,0]}],[kcy(1.1,1.1,.15,14),'#8a949c',{p:[0,.1,0]}]]),
     G([[kb(1.6,2.4,1.6),'#ffffff',{p:[0,1.2,0]}],[kb(2.4,1.4,.1),'#6ad0ff',{p:[0,2.9,0]}],[kb(.15,1.2,.15),'#5a6268',{p:[0,2.2,0]}],[kb(1.7,.15,1.7),rf,{p:[0,2.45,0]}]])],
  m:[G([[kb(3.4,5,3),'#ffffff',{p:[0,2.5,0]}],[kb(2.6,1.6,2.4),'#ffffff',{p:[-.3,5.8,-.2]}],...[1,2,3,4].map(y=>[kb(3.46,.35,3.06),'#3a5a7a',{p:[0,y*1.05+.2,0]}]),[kb(.5,.5,.5),'#8a949c',{p:[.9,6.9,.4]}]]),
     G([[kb(1.8,6,1.8),'#ffffff',{p:[-1.6,3,0]}],[kb(1.8,5,1.8),'#ffffff',{p:[1.6,2.5,0]}],[kb(1.6,.5,1),'#3a5a7a',{p:[0,4,0]}],...[-1.6,1.6].flatMap(x=>[1.2,2.4,3.6].map(y=>[kb(1.86,.3,1.86),'#3a5a7a',{p:[x,y,0]}]))]),
     G([[kcy(1.6,1.6,6,16),'#ffffff',{p:[0,3,0]}],...[1,2,3,4,5].map(y=>[kcy(1.64,1.64,.3,16),'#3a5a7a',{p:[0,y*1.1,0]}]),[kcy(1.9,1.9,.2,16),rf,{p:[0,6.1,0]}],[kcy(.06,.06,1.6,4),'#8a949c',{p:[.6,7,0]}]])],
  t:[G([[kb(2.8,10,2.8),'#ffffff',{p:[0,5,0]}],[kb(2.2,3,2.2),'#ffffff',{p:[0,11.5,0]}],...[2,4,6,8].map(y=>[kb(2.86,.4,2.86),'#3a5a7a',{p:[0,y,0]}]),[kcy(.05,.1,3,4),'#8a949c',{p:[0,14.5,0]}],[ks(.15,6,4),'#ff5a4a',{p:[0,16,0]}]]),
     G([[kb(3.6,5,3.6),'#ffffff',{p:[0,2.5,0]}],[kb(2.8,4,2.8),'#ffffff',{p:[0,7,0]}],[kb(2,3,2),'#ffffff',{p:[0,10.5,0]}],[kb(3.7,.3,3.7),'#3a5a7a',{p:[0,5,0]}],[kb(2.9,.3,2.9),'#3a5a7a',{p:[0,9,0]}],[kb(1.2,1,1.2),rf,{p:[0,12.5,0]}]]),
     G([[kcy(1.2,1.5,11,12),'#ffffff',{p:[0,5.5,0]}],[ring(2.2,.25,20),'#d8dee4',{p:[0,9,0]}],...[0,1,2,3].map(i=>[kb(.15,.15,1.6),'#8a949c',{p:[Math.cos(i*1.57)*1.7,9,Math.sin(i*1.57)*1.7],r:[0,-i*1.57,0]}]),[kc(.5,3,10),'#d8dee4',{p:[0,12.5,0]}],...[3,6].map(y=>[kcy(1.56,1.56,.3,12),'#3a5a7a',{p:[0,y,0]}])]),
     G([[kb(2.4,8,2),'#ffffff',{p:[0,4,0]}],[kb(2.2,3,.1),'#ff7ad0',{p:[0,6,1.06]}],[kb(2.2,1.4,.1),'#6ad0ff',{p:[0,2.6,1.06]}],[kb(2.6,.3,2.2),rf,{p:[0,8.1,0]}]])]})}};
const PERSON=G([[kcy(.32,.42,1.4,6),'#ffffff',{p:[0,.7,0]}],[ki(.32,1),'#ffffff',{p:[0,1.7,0]}],[kc(.12,.4,4),'#ffffff',{p:[.25,1.6,0],r:[0,0,-1.4]}]]);
const DOCK=G([[kb(9,.25,1.3),'#7a5a3a',{p:[4.5,.1,0]}],...[0,2.5,5,7.5].map(x=>[kcy(.13,.13,2.4,5),'#5a4632',{p:[x,-.6,.6]}]),...[0,2.5,5,7.5].map(x=>[kcy(.13,.13,2.4,5),'#5a4632',{p:[x,-.6,-.6]}]),[kb(.5,.5,.5),'#8a6a40',{p:[7,.5,.3]}]]);
const BOAT=G([[tg(new THREE.SphereGeometry(1,10,6,0,6.283,1.57,1.57),{s:[2.2,.6,.8]}),'#7a5a3a',{p:[0,.35,0]}],[kcy(.06,.06,3,4),'#5a4632',{p:[0,1.8,0]}],[tg(new THREE.PlaneGeometry(1.6,2.2),{}),'#e8e0c8',{p:[.1,2,0],r:[0,Math.PI/2,0]}]]);
/* life in the streets: lamps along the roads, carts and vehicles on them, a centrepiece in the square,
   crates and barrels by the doors, little trees and garden plots in the yards. One set per style. */
const WHEEL=(x,z,r)=>[tg(new THREE.CylinderGeometry(r||.45,r||.45,.18,10),{r:[Math.PI/2,0,0]}),'#3a2e22',{p:[x,r||.45,z]}];
const BEAST=(x)=>[[tg(new THREE.SphereGeometry(1,10,8),{s:[1.2,.75,.7]}),'#8a6a4a',{p:[x,1.25,0]}],[tg(new THREE.SphereGeometry(.42,8,6),{}),'#7a5a3a',{p:[x+1.25,1.6,0]}],...[[.6,.35],[.6,-.35],[-.6,.35],[-.6,-.35]].map(([a,b])=>[kcy(.13,.1,.9,5),'#5a4232',{p:[x+a,.45,b]}])];
const STREETKIT={
 dragon:{lamp:G([[kcy(.07,.09,2.6,5),BEAM,{p:[0,1.3,0]}],[kb(.5,.08,.08),BEAM,{p:[.2,2.5,0]}],[kb(.24,.34,.24),'#ffcf7a',{p:[.4,2.3,0]}]]),
  cart:G([[kb(1.6,.5,1.1),'#8a6a40',{p:[0,.85,0]}],[kb(1.7,.35,.08),'#6a5030',{p:[0,1.25,.55]}],[kb(1.7,.35,.08),'#6a5030',{p:[0,1.25,-.55]}],WHEEL(0,.62),WHEEL(0,-.62),[kb(1.6,.08,.08),BEAM,{p:[1.6,.75,.3]}],[kb(1.6,.08,.08),BEAM,{p:[1.6,.75,-.3]}],[kb(.5,.4,.5),'#a08050',{p:[-.3,1.3,.1]}],...BEAST(3.1)]),
  center:G([[kcy(1.3,1.4,.9,12),'#9a9080',{p:[0,.45,0]}],[kcy(1.05,1.05,.92,12),'#2a3a44',{p:[0,.47,0]}],[kcy(.08,.08,2.4,4),BEAM,{p:[1.1,1.2,0]}],[kcy(.08,.08,2.4,4),BEAM,{p:[-1.1,1.2,0]}],[prism(2.8,.55,1.6),'#5a7a4a',{p:[0,2.6,0],r:[0,Math.PI/2,0]}],[kcy(.06,.06,2.2,4),BEAM,{p:[0,2.1,0],r:[0,0,Math.PI/2]}]]),
  yard:G([[kcy(.12,.18,1.6,5),'#5a4632',{p:[0,.8,0]}],[ks(.9,7,5),'#4a8a3a',{p:[0,2,0]}],[ks(.6,6,4),'#5a9a42',{p:[.4,2.5,.2]}]]),
  crate:G([[kb(.7,.7,.7),'#9a7a48',{p:[0,.35,0]}],[kb(.55,.55,.55),'#8a6a40',{p:[.5,.28,.4],r:[0,.4,0]}],[kcy(.3,.3,.8,8),'#7a5a3a',{p:[-.5,.4,.3]}],[kcy(.31,.31,.06,8),'#3a2e22',{p:[-.5,.6,.3]}]]),
  plot:G([[kb(3,.15,2.2),'#6a4a2a',{p:[0,.07,0]}],...[-1,0,1].map(x=>[kb(.5,.35,2),'#5a9a3a',{p:[x,.25,0]}]),...[-1.5,1.5].map(x=>[kb(.06,.6,2.4),BEAM,{p:[x,.3,0]}])])},
 white:{lamp:G([[kcy(.12,.16,2.4,6),'#d8d2c4',{p:[0,1.2,0]}],[kb(.4,.4,.4),'#ffcf7a',{p:[0,2.6,0]}],[kc(.34,.35,4),'#8a8478',{p:[0,3,0],r:[0,.785,0]}]]),
  cart:G([[kb(1.8,.6,1.2),'#c8c0b0',{p:[0,.9,0]}],WHEEL(.4,.66,.5),WHEEL(.4,-.66,.5),[kb(1.8,.1,.1),BEAM,{p:[1.7,.8,0]}],...BEAST(3.2)]),
  center:G([[kb(2.4,.5,2.4),'#d8d2c4',{p:[0,.25,0]}],[tg(new THREE.CylinderGeometry(.25,.5,5,4),{r:[0,.785,0]}),'#ece8dc',{p:[0,3,0]}],[kc(.3,.6,4),'#c8a860',{p:[0,5.8,0],r:[0,.785,0]}],...[0,1,2,3].map(i=>[kb(.9,1.3,.18),'#bab4a6',{p:[Math.cos(i*1.57)*1.8,.95,Math.sin(i*1.57)*1.8],r:[0,-i*1.57+Math.PI/2,0]}])]),
  yard:G([[kcy(.12,.16,1.2,5),'#6a5a4a',{p:[0,.6,0]}],[kc(.7,2.2,7),'#4a7a4a',{p:[0,2.2,0]}]]),
  crate:G([[kb(.8,.5,.5),'#b8b0a0',{p:[0,.25,0]}],[kb(.6,.4,.6),'#a8a090',{p:[.3,.7,0]}],[kcy(.3,.35,.7,8),'#8a7a6a',{p:[-.6,.35,.3]}]]),
  plot:G([[kb(3.2,.4,.3),'#d8d2c4',{p:[0,.2,1.1]}],[kb(3.2,.4,.3),'#d8d2c4',{p:[0,.2,-1.1]}],[kb(3,.12,2),'#5a4a3a',{p:[0,.06,0]}],...[-1,0,1].map(x=>[ks(.35,6,4),'#7a9a4a',{p:[x,.3,0]}])])},
 silver:{lamp:G([[kcy(.06,.08,3.2,6),'#9aa4ac',{p:[0,1.6,0]}],[ks(.26,8,6),'#e8f4ff',{p:[0,3.3,0]}],[ring(.34,.04,12),'#9aa4ac',{p:[0,3.3,0]}]]),
  cart:G([[tg(new THREE.SphereGeometry(1,12,8),{s:[2,.7,.9]}),'#c0c8d0',{p:[0,1.2,0]}],[kb(2.8,.3,1.2),'#7a848c',{p:[0,.6,0]}],WHEEL(1.1,.7,.5),WHEEL(-1.1,.7,.5),WHEEL(1.1,-.7,.5),WHEEL(-1.1,-.7,.5),[kb(.8,.5,.7),'#3a5a7a',{p:[.6,1.75,0]}]]),
  center:G([[kcy(2.4,2.6,.5,20),'#c0c8d0',{p:[0,.25,0]}],[kcy(2.2,2.2,.52,20),'#4a8aa8',{p:[0,.27,0]}],[kcy(.3,.5,2.4,10),'#d8e0e6',{p:[0,1.5,0]}],[ring(.9,.08,16),'#d8e0e6',{p:[0,2.4,0]}],[ks(.4,10,6),'#cfe6ff',{p:[0,3,0]}]]),
  yard:G([[kcy(.5,.6,1.4,8),'#5a9a5a',{p:[0,.7,0]}],[ks(.55,8,6),'#6aaa5a',{p:[0,1.5,0]}],[kcy(.25,.3,.9,6),'#4a8a4a',{p:[.6,.45,.3]}],[ks(.3,6,4),'#e86a8a',{p:[0,2.05,0]}]]),
  crate:G([[kb(.8,.8,.8),'#8a949c',{p:[0,.4,0]}],[kcy(.35,.35,1,10),'#aab4bc',{p:[.7,.5,0]}],[kcy(.36,.36,.08,10),'#5a6268',{p:[.7,.9,0]}]]),
  plot:G([[kb(3,.12,2.2),'#6a5a3a',{p:[0,.06,0]}],...[-1,0,1].flatMap(x=>[[kcy(.35,.4,.8,8),'#5a9a5a',{p:[x,.45,-.5]}],[ks(.38,8,6),'#6aaa5a',{p:[x,.4,.5]}]])])},
 grand:{lamp:G([[kcy(.08,.12,3,6),'#c8a860',{p:[0,1.5,0]}],[kcy(.24,.16,.5,6),'#fff0c0',{p:[0,3.2,0]}],[kc(.3,.4,6),'#c8a860',{p:[0,3.65,0]}]]),
  cart:G([[kb(2,1.2,1.2),'#e8e0cc',{p:[0,1.3,0]}],[tg(hemi(.8,10),{s:[1.3,.6,.8]}),'#d8b050',{p:[0,1.9,0]}],WHEEL(.6,.65,.55),WHEEL(.6,-.65,.55),WHEEL(-.6,.65,.55),WHEEL(-.6,-.65,.55),[kb(1.6,.1,.1),'#c8a860',{p:[1.8,.9,0]}],...BEAST(3.4)]),
  center:G([[kcy(3,3.2,.6,20),'#e8e2d4',{p:[0,.3,0]}],[kcy(2.8,2.8,.62,20),'#5a9ac8',{p:[0,.32,0]}],[kcy(.7,.9,1.6,10),'#f4f0e6',{p:[0,1.4,0]}],[kcy(.35,.45,1.6,8),'#c8a860',{p:[0,3,0]}],[ks(.45,8,6),'#c8a860',{p:[0,4.1,0]}],[kcy(1.4,1.2,.25,16),'#e8e2d4',{p:[0,2.2,0]}]]),
  yard:G([[kcy(.1,.14,2.6,5),'#6a5a4a',{p:[0,1.3,0]}],[ks(.8,8,6),'#4a8a3a',{p:[0,2.9,0]}],[kcy(.5,.5,.5,10),'#e8e2d4',{p:[0,.25,0]}]]),
  crate:G([[kb(.7,.5,.5),'#c8a860',{p:[0,.25,0]}],[kcy(.32,.38,.7,8),'#e8e0cc',{p:[.6,.35,.2]}]]),
  plot:G([[kcy(1.6,1.6,.3,14),'#e8e2d4',{p:[0,.15,0]}],[kcy(1.45,1.45,.32,14),'#5a4a3a',{p:[0,.17,0]}],...[0,1,2,3,4].map(i=>[ks(.32,6,4),i%2?'#e86a6a':'#f0c050',{p:[Math.cos(i*1.26)*.8,.5,Math.sin(i*1.26)*.8]}])])},
 forge:{lamp:G([[kb(.18,3.2,.18),'#5a6268',{p:[0,1.6,0]}],[kb(.8,.12,.12),'#5a6268',{p:[.3,3.1,0]}],[kb(.3,.3,.3),'#ffb060',{p:[.65,2.9,0]}]]),
  cart:G([[kb(2.6,1,1.5),'#7a848a',{p:[0,1.1,0]}],[tg(new THREE.CylinderGeometry(.6,.7,1.6,4),{r:[0,0,Math.PI/2]}),'#5a6268',{p:[0,1.9,0]}],[kcy(.08,.08,1.6,4),'#3a4044',{p:[.9,2.1,0],r:[0,0,Math.PI/2-.2]}],WHEEL(.8,.8,.55),WHEEL(-.8,.8,.55),WHEEL(.8,-.8,.55),WHEEL(-.8,-.8,.55)]),
  center:G([[kcy(2,2.2,.8,12),'#7a848a',{p:[0,.4,0]}],...gear(1.4,.2).map(([g,c,f])=>[g,'#c8a860',{p:[(f.p||[0,0,0])[0],2.6+(f.p||[0,0,0])[1],0],r:f.r}]),[kcy(.3,.3,1.2,8),'#5a6268',{p:[0,1.2,0]}]]),
  yard:G([[kb(.15,1.6,.15),'#5a6268',{p:[0,.8,0]}],[kb(1,.12,.12),'#5a6268',{p:[0,1.3,0]}],[ks(.3,6,4),'#7a848a',{p:[0,1.75,0]}],[kb(.9,.6,.15),'#a83a2a',{p:[0,1.6,.1]}]]),
  crate:G([[kb(.9,.9,.9),'#6a737a',{p:[0,.45,0]}],[kb(.7,.5,.7),'#5a6268',{p:[.2,1.15,0]}],[kcy(.35,.35,1.1,8),'#8a5a3a',{p:[-.8,.55,.2]}],[kb(1.4,.2,.2),'#c8ccd0',{p:[.6,.15,.6],r:[0,.5,0]}]]),
  plot:G([[kb(3.4,.1,2.4),'#5a5450',{p:[0,.05,0]}],...[-1.1,0,1.1].map(x=>[kb(.8,.6,.8),'#7a848a',{p:[x,.35,-.5]}]),[kb(2.6,.3,.3),'#8a6a40',{p:[0,.15,.6]}]])},
 future:{lamp:G([[kcy(.05,.07,4,6),'#8a949c',{p:[0,2,0]}],[kb(1.2,.1,.18),'#8a949c',{p:[.5,4,0]}],[kb(.9,.06,.2),'#e8f6ff',{p:[.6,3.94,0]}]]),
  cart:G([[tg(new THREE.SphereGeometry(1,14,8),{s:[1.5,.55,.8]}),'#ffffff',{p:[0,.75,0]}],[tg(new THREE.SphereGeometry(1,14,6,0,6.283,0,1.1),{s:[1.1,.5,.72]}),'#2a4a6a',{p:[-.1,.95,0]}],[kb(2.6,.15,1.3),'#3a4044',{p:[0,.3,0]}]]),
  center:G([[kcy(2.6,2.6,.3,24),'#d8dee4',{p:[0,.15,0]}],[kcy(.5,.6,6,12),'#e8ecef',{p:[0,3,0]}],...[2,3.4,4.8].map((y,i)=>[ring(1.2+i*.2,.06,18),'#6ad0ff',{p:[0,y,0]}]),[kb(2.6,1.4,.06),'#ff7ad0',{p:[0,5.4,0]}]]),
  yard:G([[kcy(.06,.1,2.6,5),'#6a5a4a',{p:[0,1.3,0]}],[ks(.7,8,6),'#3a9a5a',{p:[0,2.8,0]}],[kcy(.8,.8,.3,12),'#c8d0d8',{p:[0,.15,0]}]]),
  crate:G([[kb(1.4,.9,.9),'#c8d0d8',{p:[0,.45,0]}],[kb(1.1,.4,.06),'#6ad0ff',{p:[0,.6,.46]}],[kcy(.3,.3,1,10),'#3a4a5a',{p:[1,.5,0]}]]),
  plot:G([[kb(3.4,.1,2.4),'#3a4044',{p:[0,.05,0]}],...[-1.1,0,1.1].map(x=>[kb(.12,.02,2),'#f4f4f4',{p:[x,.11,0]}])])}};
function town(sp,la,lo,o){const Rn=rnd(o.seed||hashStr(o.name||'t'));const gh=sp.ghRaw,gs=sp.gh;const st=TOWNKIT[o.style||'dragon'];const rfs=o.roof?[o.roof]:st.roof.slice(0,2);const KS=rfs.map(c=>{const K=st.kits(c);const L=Array.isArray(K)?[[K[0]],[K[1]],[K[2]]]:[K.s,K.m,K.t];return L});const r=o.r||2;const eras=o.eras||null;
 const tm=towerMat({metalness:o.style==='silver'?.55:.08,roughness:o.style==='silver'?.35:.85,win:o.win||'#ffd890'});sp.towerMats=(sp.towerMats||[]).concat([tm]);
 const cosl=Math.max(.2,Math.cos(la*D2R));const P=(a,d)=>[la+Math.cos(a)*d,lo+Math.sin(a)*d/cosl];
 const nSt=o.streets||5,stA=Array.from({length:nSt},(_,i)=>i/nSt*Math.PI*2+Rn()*.3);const onStreet=(a,d)=>stA.some(s=>{let x=Math.abs(((a-s+Math.PI*3)%(Math.PI*2))-Math.PI);return x*d<.13});
 // houses: rings out from the square, facing it, never on a street or a slope or in the water
 const H=KS.map(K=>K.map(L=>L.map(()=>[]))),people=[],lamps=[],smoke=[];
 for(let i=0,t=0;i<(o.n||100)&&t<(o.n||100)*8;t++){const a=Rn()*Math.PI*2,d=r*(.24+Math.pow(Rn(),.8)*.76);if(onStreet(a,d))continue;const [l2,o2]=P(a,d);const h=gh(l2,o2);if(h<1.6)continue;
  const e1=gh(l2+.08,o2),e2=gh(l2,o2+.08/cosl);if(Math.abs(e1-h)+Math.abs(e2-h)>3.2)continue;if(nearEnt(o.map||'rongqiu',l2,o2,.12))continue;if(o.keepRing&&(()=>{const dd=Math.hypot((l2-la)*17.45,(o2-lo)*17.45*cosl);return dd>o.keepRing[0]&&dd<o.keepRing[1]})())continue;if(o.keep&&o.keep.some(([dn,de,kr])=>{const q=PL(la,lo,dn,de);return Math.hypot((l2-q[0])*17.45,(o2-q[1])*17.45*cosl)<kr}))continue;
  const k=d>r*.8&&Rn()<.5?0:Rn()<(o.towers||.08)?2:Rn()<.55?1:0;{const v=(Rn()*KS.length)|0,L=H[v][k];L[(Rn()*L.length)|0].push([l2,o2,h,Rn(),a+Math.PI,Rn()])}i++}
 const tint=(p)=>C(st.wall[(p[5]*st.wall.length)|0]).offsetHSL(0,0,(p[3]-.5)*.08);
 H.forEach((HH,v)=>HH.forEach((LL,k)=>LL.forEach((L,j)=>{if(!L.length)return;inst(KS[v][k][j],tm,L,(ob,p)=>{frameLL(sp,p[0],p[1],-.25,p[4]+Math.PI/2,ob);const s=(o.scale||1)*(.85+p[3]*.4);ob.scale.set(s,s*(k===2?.9+p[3]*.5:1),s)},eras,{tint,far:1500,noCarry:!!o.noCarry})})));
 // roofs carry their own colour: a second pass would double the draws, so the roof tint rides in the vertex colours instead
 H.flat(2).forEach(L=>L.forEach(p=>{if(smoke.length<(o.smoke||10)&&Rn()<.08)smoke.push(p);if(Rn()<.3)lamps.push(p)}));
 // streets and the square
 const road=new THREE.MeshStandardMaterial({color:o.road||'#9a8a6a',roughness:.95,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
 for(const a of stA){const pos=[],idx=[];const n=24;for(let i=0;i<=n;i++){const d=r*1.15*i/n;const [l2,o2]=P(a,d);const c=dirLL(l2,o2);const side=dirLL(...P(a+Math.PI/2,.05)).sub(dirLL(la,lo)).normalize();
   for(const s of[-1,1]){const q=c.clone().addScaledVector(side,s*(.075+i/n*.03)*D2R);q.normalize();const hh=Math.max(gh(...llDir(q)),.2)+.12;q.multiplyScalar(R+hh);pos.push(q.x,q.y,q.z)}if(i<n){const b=i*2;idx.push(b,b+1,b+2,b+1,b+3,b+2)}}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();const m=new THREE.Mesh(g,road);m.material.side=THREE.DoubleSide;addTo(sp,m,eras,!!o.noCarry);g.computeBoundingSphere();cull(m,g.boundingSphere.center,g.boundingSphere.radius,1500)}
 {const sq=new THREE.Mesh(new THREE.CircleGeometry(r*.2*D2R*R,28),road);frameLL(sp,la,lo,.13,0,sq);sq.rotateX(-Math.PI/2);addTo(sp,sq,eras,!!o.noCarry);cull(sq,null,r*4,1500)}
 // a wall with towers, broken by a gate where each street leaves
 let TW=[];if(o.wall){const segs=[],tw=[];TW=tw;const n=Math.round(r*34);for(let i=0;i<n;i++){const a=i/n*Math.PI*2;if(onStreet(a,r*1.05))continue;const [l2,o2]=P(a,r*1.05);const h=gh(l2,o2);if(h<1)continue;(i%6===0?tw:segs).push([l2,o2,h,a])}
  const wm=detailMat(VC({roughness:.95}),{bump:.6,freq:2});const wc=C(o.wallC||st.wall[0]).multiplyScalar(.82);
  inst(G([[kb(1,2.6,R*D2R*r*1.05*Math.PI*2/n*1.05),'#ffffff',{p:[0,1.1,0]}],[kb(1.3,.4,R*D2R*r*1.05*Math.PI*2/n*1.05),'#e0e0e0',{p:[0,2.5,0]}]]),wm,segs,(ob,p)=>{frameLL(sp,p[0],p[1],-.4,p[3],ob)},eras,{tint:()=>wc,far:1500,noCarry:!!o.noCarry});
  inst(G([[kcy(1.1,1.3,4.4,8),'#ffffff',{p:[0,2,0]}],[kcy(1.4,1.4,.5,8),'#e0e0e0',{p:[0,4.3,0]}],[kc(1.3,1.8,8),'#8a8a8a',{p:[0,5.4,0]}]]),wm,tw,(ob,p)=>{frameLL(sp,p[0],p[1],-.4,p[3],ob)},eras,{tint:()=>wc,far:1500,noCarry:!!o.noCarry})}
 // fields outside the town: striped strips of crops laid on the ground
 if(o.fields){const fm=VC({roughness:.95});const cols=['#a8a050','#7a9a40','#c8b060','#6a8a3a','#9a7a40'];for(let f=0;f<(o.fields|0||8);f++){const a=Rn()*Math.PI*2,d=r*(1.25+Rn()*.6);const [fl,fo]=P(a,d);if(gh(fl,fo)<2)continue;
   const W2=7+Rn()*8,L2=9+Rn()*10,nx=8,nz=10;const g=new THREE.PlaneGeometry(W2,L2,nx,nz);g.rotateX(-Math.PI/2);const pp=g.attributes.position,cs=[];const c1=C(cols[(Rn()*5)|0]),c2=c1.clone().multiplyScalar(.75);
   const ob=new THREE.Object3D();frameLL(sp,fl,fo,0,a,ob);ob.updateMatrixWorld();const v=V3();
   for(let i=0;i<pp.count;i++){v.set(pp.getX(i),0,pp.getZ(i)).applyMatrix4(ob.matrixWorld);const ll=llDir(v);const hh=Math.max(gh(ll[0],ll[1]),.3)+.15;v.normalize().multiplyScalar(R+hh);pp.setXYZ(i,v.x,v.y,v.z);const row=Math.floor((pp.getZ?0:0)+i/(nx+1))%2;const c=row?c1:c2;cs.push(c.r,c.g,c.b)}
   g.setAttribute('color',new THREE.Float32BufferAttribute(cs,3));g.computeVertexNormals();g.computeBoundingSphere();const m=new THREE.Mesh(g,fm);m.material.polygonOffset=true;m.material.polygonOffsetFactor=-1;addTo(sp,m,eras,!!o.noCarry);cull(m,g.boundingSphere.center,g.boundingSphere.radius,1400)}}
 // a harbour: piers into the water and boats at anchor
 if(o.port){const piers=[],boats=[];for(let i=0;i<40&&piers.length<(o.port|0||6);i++){const a=Rn()*Math.PI*2;const d=r*(.6+Rn()*.7);const [l2,o2]=P(a,d);const h=gh(l2,o2);if(h>1.4||h<-4)continue;
   const [l3,o3]=P(a,d-.12);if(gh(l3,o3)<1.2)continue;piers.push([l3,o3,0,a]);for(let b=0;b<2;b++)boats.push([l2+(Rn()-.5)*.15,o2+(Rn()-.5)*.15/cosl,0,Rn()*6.28])}
  inst(DOCK,VC({roughness:.9}),piers,(ob,p)=>{frameLL(sp,p[0],p[1],.4,p[3],ob,false)},eras,{far:1300,noCarry:!!o.noCarry});inst(BOAT,VC({roughness:.8}),boats,(ob,p)=>{frameLL(sp,p[0],p[1],.05,p[3],ob,false)},eras,{far:1300,noCarry:!!o.noCarry})}
 // people about in the streets
 for(let i=0;i<(o.people||40);i++){const a=stA[(Rn()*nSt)|0]+(Rn()-.5)*.05,d=r*(.15+Rn()*.9);const [l2,o2]=P(a,d);const h=gh(l2,o2);if(h<1)continue;people.push([l2,o2,h,Rn(),a])}
 if(people.length)inst(PERSON,VC({roughness:.7}),people,(ob,p)=>{frameLL(sp,p[0],p[1],0,p[4]+(p[3]-.5)*2,ob);ob.scale.setScalar((o.pScale||1)*(.9+p[3]*.3))},eras,{tint:p=>C(o.pCol||'#8a8070').offsetHSL((p[3]-.5)*.1,0,(p[3]-.5)*.2),far:700,noCarry:!!o.noCarry});
 // street life (see STREETKIT)
 {const K=STREETKIT[o.style||'dragon'];const F={far:900,noCarry:!!o.noCarry};const lampP=[],cartP=[],crateP=[],yardP=[],plotP=[];const st2=o.streetLife||1;
  for(const a of stA){const n=Math.round(r*1.1/.1);for(let i=1;i<n;i++){const d=r*1.1*i/n,side=i%2?1:-1;const [l2,o2]=P(a+side*.085/Math.max(d,.2),d);const h=gh(l2,o2);if(h<1.2)continue;lampP.push([l2,o2,h,Rn(),a]);if(Rn()<.12*st2){const [l3,o3]=P(a,d);if(gh(l3,o3)>1.2)cartP.push([l3,o3,0,Rn(),a+(Rn()<.5?0:Math.PI)])}}}
  H.flat(2).forEach(L=>L.forEach(p=>{const rr=Rn();if(rr<.25*st2)crateP.push([p[0]+(Rn()-.5)*.06,p[1]+(Rn()-.5)*.06/cosl,0,Rn(),Rn()*6.28]);else if(rr<.45*st2)yardP.push([p[0]+(Rn()-.5)*.09,p[1]+(Rn()-.5)*.09/cosl,0,Rn(),Rn()*6.28]);else if(rr<.52*st2)plotP.push([p[0]+(Rn()-.5)*.1,p[1]+(Rn()-.5)*.1/cosl,0,Rn(),p[4]])}));
  const ok=q=>{const h=gh(q[0],q[1]);return h>1.4&&!onStreet(...(()=>{const dl=(q[0]-la),dd=(q[1]-lo)*cosl;return [Math.atan2(dd,dl),Math.hypot(dl,dd)]})())};
  const sm2=VC({roughness:.75});
  if(lampP.length){inst(K.lamp,sm2,lampP,(ob,p)=>{frameLL(sp,p[0],p[1],-.05,p[4]+Math.PI/2,ob);ob.scale.setScalar(o.scale||1)},eras,F);lamps.push(...lampP.filter((_,i)=>i%2===0).map(p=>[p[0],p[1],p[2]+.9]))}
  if(cartP.length)inst(K.cart,sm2,cartP,(ob,p)=>{frameLL(sp,p[0],p[1],0,p[4]+Math.PI/2,ob);ob.scale.setScalar((o.scale||1)*.9)},eras,F);
  const cr=crateP.filter(ok),yd=yardP.filter(ok),pl=plotP.filter(ok);
  if(cr.length)inst(K.crate,sm2,cr,(ob,p)=>{frameLL(sp,p[0],p[1],0,p[4],ob);ob.scale.setScalar(.9+p[3]*.4)},eras,F);
  if(yd.length)inst(K.yard,sm2,yd,(ob,p)=>{frameLL(sp,p[0],p[1],-.1,p[4],ob);ob.scale.setScalar(.8+p[3]*.7)},eras,F);
  if(pl.length)inst(K.plot,sm2,pl,(ob,p)=>{frameLL(sp,p[0],p[1],0,p[4],ob)},eras,F);
  if(!o.noCenter){const c=new THREE.Mesh(K.center,sm2);frameLL(sp,la,lo,0,0,c);c.scale.setScalar(o.scale||1);addTo(sp,c,eras,!!o.noCarry);cull(c,null,20,1200)}}
 // chimney smoke and lamps that come on at dusk
 smoke.forEach(p=>{const e=emitter({n:26,life:5,speed:1.2,spread:.35,size:3.2,dir:[0,1,0],col:'#d8d4cc',op:.3,add:false,tex:smokeTex,area:[.4,.3,.4],wander:.6});frameLL(sp,p[0],p[1],4,0,e);addTo(sp,e,eras,!!o.noCarry);cull(e,null,20,900)});
 if(lamps.length){const nl=nightPoints(lamps.map(p=>dirLL(p[0],p[1]).multiplyScalar(R+p[2]+2.2)),o.lamp||'#ffd890',1.6,1);addTo(sp,nl,eras,!!o.noCarry);sp.nightMats.push(nl.userData.night)}
 return{houses:H.flat(2).reduce((s,L)=>s+L.length,0),towers:TW}}
const TOWN_SITES=[
 [12,-88,{name:'emerald',style:'dragon',keepRing:[13.5,16.6],keep:[[-26,10,12],[28,-22,11]],noCenter:1,wallC:'#ece8dc',lamp:'#ffa040',r:2.3,n:150,eras:[3],noCarry:true,wall:1,fields:10,people:50,pCol:'#3a8a5a',towers:.1,scale:1.1}],
 [4,-112,{name:'white',style:'white',keep:[[9,7,9],[-10,9,8],[-8,-9,6]],r:1.35,n:90,eras:[3,4],noCarry:true,people:34,pCol:'#e8e4d8',road:'#cfc8b8',towers:.14}],
 [-4,56,{name:'silver',style:'silver',keep:[[6,-6,9]],r:2.6,n:130,eras:[5,6,7,8,9,10,11,12],people:40,pCol:'#c8d0d8',road:'#b8bcc0',win:'#cfe6ff',lamp:'#cfe6ff',fields:6,towers:.12}],
 [-14,63,{name:'capital',style:'forge',keep:[[-12,9,13],[10,-8,11],[-6,-13,10],[4,14,14],[0,0,9]],r:2.8,n:160,eras:[5,6,7,8,9,10,11,12],people:56,pCol:'#c8a860',road:'#d8ccb0',wall:1,wallC:'#e8e0cc',towers:.12,scale:1.15}],
 [13.2,11.3,{name:'port',style:'dragon',r:1.9,n:100,eras:[5,6,7,8,9,10,11,12],people:40,pCol:'#3a8a5a',port:8,fields:5}],
 [24,12,{name:'neilin',style:'dragon',keep:[[0,0,9]],noCenter:1,r:1.2,n:46,eras:[8],noCarry:true,people:20,pCol:'#8a7a60'}],
 [-8,49,{name:'v_w',style:'silver',r:.75,n:22,eras:[6,7,8,9,10,11,12],people:8,pCol:'#c8d0d8',fields:4,towers:0}],
 [-19,58,{name:'v_s',style:'grand',r:.75,n:22,eras:[6,7,8,9,10,11,12],people:8,pCol:'#c8a860',fields:4,towers:0}],
 [11.2,9.0,{name:'v_p',style:'dragon',r:.7,n:20,eras:[6,7,8,9,10,11,12],people:8,pCol:'#3a8a5a',fields:5,towers:0}],
 [-49,-28.6,{name:'mine',style:'dragon',r:.8,n:24,eras:[6,7,8],noCarry:true,people:12,pCol:'#3a8a5a',towers:0}]];
const TOWNC=TOWN_SITES.map(([la,lo,o])=>[dirLL(la,lo),o.r*1.02]);
function rqTowns(sp){sp.nightMats=sp.nightMats||[];sp.entClr=sp.entClr||[];for(const [la,lo,o] of TOWN_SITES){const deg=o.r*.92;sp.entClr.push({d:dirLL(la,lo),deg,cs:Math.cos(deg*D2R),eras:o.eras||null})}sp.towns=TOWN_SITES.map(([la,lo,o])=>Object.assign({name:o.name},town(sp,la,lo,o)));rqCityDetail(sp)}
