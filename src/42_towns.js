/* ================================================================
   towns: streets running out from a square, houses facing them, walls and gates,
   fields outside, smoke from chimneys, lamps at night, people in the streets.
   ================================================================ */
const prism=(w,h,d)=>{const g=new THREE.CylinderGeometry(h,h,d,3);g.rotateZ(Math.PI/2);g.rotateX(Math.PI/2);g.scale(w/(h*1.73),1,1);return g};
const TOWNKIT={
 dragon:{roof:['#3f7a4a','#6a5a3a','#4a6a3a','#7a4a2a'],wall:['#b8a888','#a89878','#c8b898'],kits:(rf)=>[
   G([[kcy(1.35,1.5,2.2,10),'#ffffff',{p:[0,1.1,0]}],[kc(1.95,1.9,10),rf,{p:[0,3.1,0]}],[kb(.6,1.1,.1),'#3a2a1e',{p:[0,.55,1.45]}],[kcy(.18,.2,1,6),'#6a6058',{p:[.7,3.4,.3]}]]),
   G([[kb(3.2,2.2,2.3),'#ffffff',{p:[0,1.1,0]}],[prism(3.6,1.05,2.7),rf,{p:[0,2.75,0]}],[kb(.7,1.2,.1),'#3a2a1e',{p:[.4,.6,1.18]}],[kb(3.4,.25,.25),'#5a4632',{p:[0,2.2,1.2]}],[kb(3.4,.25,.25),'#5a4632',{p:[0,2.2,-1.2]}]]),
   G([[kcy(1.1,1.3,5.2,8),'#ffffff',{p:[0,2.6,0]}],[kc(1.6,2.4,8),rf,{p:[0,6.4,0]}],[kb(.5,.5,.1),'#2a2018',{p:[0,4,1.15]}]])]},
 white:{roof:['#8a8478','#7a7468','#9a9488'],wall:['#e8e4d8','#dcd6c8','#f0ece2'],kits:(rf)=>[
   G([[kb(2.6,2.6,2.6),'#ffffff',{p:[0,1.3,0]}],[kc(2.1,1.6,4),rf,{p:[0,3.4,0],r:[0,.785,0]}],[kb(.7,1.3,.1),'#4a4038',{p:[0,.65,1.31]}]]),
   G([[kb(3.4,3.4,2.4),'#ffffff',{p:[0,1.7,0]}],[kb(3.6,.3,2.6),'#c8c8c8',{p:[0,3.5,0]}],[kb(.9,.9,.9),'#ffffff',{p:[1,4.1,.5]}]]),
   G([[kcy(.9,1,6,10),'#ffffff',{p:[0,3,0]}],[kc(1.1,2.6,10),rf,{p:[0,7.3,0]}]])]},
 silver:{roof:['#c8d4dc','#aab8c4','#d8e0e6'],wall:['#c0c8d0','#b0bac4','#d0d8de'],kits:(rf)=>[
   G([[kcy(1.6,1.7,1.6,14),'#ffffff',{p:[0,.8,0]}],[tg(new THREE.SphereGeometry(1.65,14,7,0,6.283,0,1.57),{}),'#e0e0e0',{p:[0,1.6,0]}]]),
   G([[kb(2.8,3.8,2.8),'#ffffff',{p:[0,1.9,0]}],[tg(new THREE.SphereGeometry(1.2,12,6,0,6.283,0,1.57),{}),'#e0e0e0',{p:[0,3.8,0]}],[kcy(.06,.06,2.2,4),'#ffffff',{p:[0,5.6,0]}]]),
   G([[kcy(.8,1.3,8,8),'#ffffff',{p:[0,4,0]}],[kc(.9,3,8),'#e8e8e8',{p:[0,9.5,0]}],[tg(new THREE.TorusGeometry(1.1,.12,5,16),{r:[Math.PI/2,0,0]}),'#ffffff',{p:[0,6,0]}]])]},
 grand:{roof:['#e8c060','#d8b050','#f0d080'],wall:['#f4f0e6','#e8e2d4','#fffaf0'],kits:(rf)=>[
   G([[kb(3,3,3),'#ffffff',{p:[0,1.5,0]}],[tg(new THREE.SphereGeometry(1.4,12,6,0,6.283,0,1.57),{}),'#d8d8d8',{p:[0,3,0]}],[kb(.8,1.6,.1),'#6a5038',{p:[0,.8,1.51]}]]),
   G([[kb(4,2.4,3),'#ffffff',{p:[0,1.2,0]}],...[-1.5,-.5,.5,1.5].map(x=>[kcy(.18,.18,2.4,6),'#ffffff',{p:[x,1.2,1.6]}]),[prism(4.4,.9,3.4),'#d0d0d0',{p:[0,2.85,0]}]]),
   G([[kcy(1,1.2,7,10),'#ffffff',{p:[0,3.5,0]}],[tg(new THREE.SphereGeometry(1.3,12,8),{}),'#d8d8d8',{p:[0,7.6,0]}],[kc(.3,1.6,6),'#ffffff',{p:[0,9.4,0]}]])]}};
const PERSON=G([[kcy(.32,.42,1.4,6),'#ffffff',{p:[0,.7,0]}],[ki(.32,1),'#ffffff',{p:[0,1.7,0]}],[kc(.12,.4,4),'#ffffff',{p:[.25,1.6,0],r:[0,0,-1.4]}]]);
const DOCK=G([[kb(9,.25,1.3),'#7a5a3a',{p:[4.5,.1,0]}],...[0,2.5,5,7.5].map(x=>[kcy(.13,.13,2.4,5),'#5a4632',{p:[x,-.6,.6]}]),...[0,2.5,5,7.5].map(x=>[kcy(.13,.13,2.4,5),'#5a4632',{p:[x,-.6,-.6]}]),[kb(.5,.5,.5),'#8a6a40',{p:[7,.5,.3]}]]);
const BOAT=G([[tg(new THREE.SphereGeometry(1,10,6,0,6.283,1.57,1.57),{s:[2.2,.6,.8]}),'#7a5a3a',{p:[0,.35,0]}],[kcy(.06,.06,3,4),'#5a4632',{p:[0,1.8,0]}],[tg(new THREE.PlaneGeometry(1.6,2.2),{}),'#e8e0c8',{p:[.1,2,0],r:[0,Math.PI/2,0]}]]);
function town(sp,la,lo,o){const Rn=rnd(o.seed||hashStr(o.name||'t'));const gh=sp.ghRaw,gs=sp.gh;const st=TOWNKIT[o.style||'dragon'];const rfs=o.roof?[o.roof]:st.roof.slice(0,2);const KS=rfs.map(c=>st.kits(c));const r=o.r||2;const eras=o.eras||null;
 const tm=towerMat({metalness:o.style==='silver'?.55:.08,roughness:o.style==='silver'?.35:.85,win:o.win||'#ffd890'});sp.towerMats=(sp.towerMats||[]).concat([tm]);
 const cosl=Math.max(.2,Math.cos(la*D2R));const P=(a,d)=>[la+Math.cos(a)*d,lo+Math.sin(a)*d/cosl];
 const nSt=o.streets||5,stA=Array.from({length:nSt},(_,i)=>i/nSt*Math.PI*2+Rn()*.3);const onStreet=(a,d)=>stA.some(s=>{let x=Math.abs(((a-s+Math.PI*3)%(Math.PI*2))-Math.PI);return x*d<.13});
 // houses: rings out from the square, facing it, never on a street or a slope or in the water
 const H=KS.map(()=>[[],[],[]]),people=[],lamps=[],smoke=[];
 for(let i=0,t=0;i<(o.n||100)&&t<(o.n||100)*8;t++){const a=Rn()*Math.PI*2,d=r*(.24+Math.pow(Rn(),.8)*.76);if(onStreet(a,d))continue;const [l2,o2]=P(a,d);const h=gh(l2,o2);if(h<1.6)continue;
  const e1=gh(l2+.08,o2),e2=gh(l2,o2+.08/cosl);if(Math.abs(e1-h)+Math.abs(e2-h)>3.2)continue;if(nearEnt(o.map||'rongqiu',l2,o2,.12))continue;
  const k=d>r*.8&&Rn()<.5?0:Rn()<(o.towers||.08)?2:Rn()<.55?1:0;H[(Rn()*KS.length)|0][k].push([l2,o2,h,Rn(),a+Math.PI,Rn()]);i++}
 const tint=(p)=>C(st.wall[(p[5]*st.wall.length)|0]).offsetHSL(0,0,(p[3]-.5)*.08);
 H.forEach((HH,v)=>HH.forEach((L,k)=>{if(!L.length)return;inst(KS[v][k],tm,L,(ob,p)=>{frameLL(sp,p[0],p[1],-.25,p[4]+Math.PI/2,ob);const s=(o.scale||1)*(.85+p[3]*.4);ob.scale.set(s,s*(k===2?.9+p[3]*.5:1),s)},eras,{tint,far:1500,noCarry:!!o.noCarry})}));
 // roofs carry their own colour: a second pass would double the draws, so the roof tint rides in the vertex colours instead
 H.flat().forEach(L=>L.forEach(p=>{if(smoke.length<(o.smoke||10)&&Rn()<.08)smoke.push(p);if(Rn()<.3)lamps.push(p)}));
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
 // chimney smoke and lamps that come on at dusk
 smoke.forEach(p=>{const e=emitter({n:26,life:5,speed:1.2,spread:.35,size:3.2,dir:[0,1,0],col:'#d8d4cc',op:.3,add:false,tex:smokeTex,area:[.4,.3,.4],wander:.6});frameLL(sp,p[0],p[1],4,0,e);addTo(sp,e,eras,!!o.noCarry);cull(e,null,20,900)});
 if(lamps.length){const nl=nightPoints(lamps.map(p=>dirLL(p[0],p[1]).multiplyScalar(R+p[2]+2.2)),o.lamp||'#ffd890',1.6,1);addTo(sp,nl,eras,!!o.noCarry);sp.nightMats.push(nl.userData.night)}
 return{houses:H.flat().reduce((s,L)=>s+L.length,0),towers:TW}}
const TOWN_SITES=[
 [12,-88,{name:'emerald',style:'dragon',wallC:'#ece8dc',lamp:'#ffa040',r:2.3,n:150,eras:[3],noCarry:true,wall:1,fields:10,people:50,pCol:'#3a8a5a',towers:.1,scale:1.1}],
 [4,-112,{name:'white',style:'white',r:1.35,n:90,eras:[3,4],noCarry:true,people:34,pCol:'#e8e4d8',road:'#cfc8b8',towers:.14}],
 [-4,56,{name:'silver',style:'silver',r:2.6,n:130,eras:[5,6,7,8,9,10,11,12],people:40,pCol:'#c8d0d8',road:'#b8bcc0',win:'#cfe6ff',lamp:'#cfe6ff',fields:6,towers:.12}],
 [-14,63,{name:'capital',style:'grand',r:2.8,n:160,eras:[5,6,7,8,9,10,11,12],people:56,pCol:'#c8a860',road:'#d8ccb0',wall:1,wallC:'#e8e0cc',towers:.12,scale:1.15}],
 [13.2,11.3,{name:'port',style:'dragon',r:1.9,n:100,eras:[5,6,7,8,9,10,11,12],people:40,pCol:'#3a8a5a',port:8,fields:5}],
 [24,12,{name:'neilin',style:'dragon',r:1.2,n:46,eras:[8],noCarry:true,people:20,pCol:'#8a7a60'}],
 [-8,49,{name:'v_w',style:'silver',r:.75,n:22,eras:[6,7,8,9,10,11,12],people:8,pCol:'#c8d0d8',fields:4,towers:0}],
 [-19,58,{name:'v_s',style:'grand',r:.75,n:22,eras:[6,7,8,9,10,11,12],people:8,pCol:'#c8a860',fields:4,towers:0}],
 [11.2,9.0,{name:'v_p',style:'dragon',r:.7,n:20,eras:[6,7,8,9,10,11,12],people:8,pCol:'#3a8a5a',fields:5,towers:0}],
 [-49,-28.6,{name:'mine',style:'dragon',r:.8,n:24,eras:[6,7,8],noCarry:true,people:12,pCol:'#3a8a5a',towers:0}]];
const TOWNC=TOWN_SITES.map(([la,lo,o])=>[dirLL(la,lo),o.r*1.02]);
function rqTowns(sp){sp.nightMats=sp.nightMats||[];sp.entClr=sp.entClr||[];for(const [la,lo,o] of TOWN_SITES){const deg=o.r*.92;sp.entClr.push({d:dirLL(la,lo),deg,cs:Math.cos(deg*D2R),eras:o.eras||null})}sp.towns=TOWN_SITES.map(([la,lo,o])=>Object.assign({name:o.name},town(sp,la,lo,o)))}
