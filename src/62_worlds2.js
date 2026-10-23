/* ================================================================
   more life on the other planets.
   虚民母球: skyscrapers with lit windows, a city grid that glows at night, highways of moving
   light between the great cities, aircars, the all-through train running its loop.
   尔什: real towns where the civilisations are, woods that cover the land in patches.
   ================================================================ */
const SKY=(()=>{const W='#ffffff',D='#9aa4ac';return()=>[
 G([[kb(1,1,1),W,{p:[0,.5,0]}],[kb(.8,.12,.8),D,{p:[0,1.02,0]}],[kcy(.02,.02,.25,4),W,{p:[.2,1.15,.2]}]]),
 G([[kb(1,.55,1),W,{p:[0,.275,0]}],[kb(.78,.3,.78),W,{p:[0,.7,0]}],[kb(.55,.2,.55),W,{p:[0,.95,0]}],[kc(.2,.18,4),D,{p:[0,1.14,0],r:[0,.785,0]}]]),
 G([[kcy(.5,.5,1,12),W,{p:[0,.5,0]}],[tg(new THREE.TorusGeometry(.56,.04,4,16),{r:[Math.PI/2,0,0]}),D,{p:[0,.72,0]}],[tg(new THREE.SphereGeometry(.5,12,6,0,6.283,0,1.57),{}),D,{p:[0,1,0]}]]),
 G([[kb(1.6,.35,.7),W,{p:[0,.175,0]}],[kb(.5,1,.5),W,{p:[-.4,.5,0]}],[kb(.5,.8,.5),W,{p:[.45,.4,0]}]])]})();
function ximinMore(sp){const gh=sp.gh;const Rn=rnd(9393);const land=(la,lo,h)=>h>4&&angDeg(dirLL(la,lo),XOAS)>5;
 const cent=[[27,34,1.6],[-6,-86,1.8],[32,18,1.4],[25,24,1.3],[44,-40,1],[-34,40,1],[20,80,1],[10,-20,1],[-12,110,.9],[56,100,.9]];
 const tm=towerMat({metalness:.65,roughness:.28,win:'#ffe2a8'});sp.towerMats.push(tm);const kits=SKY();
 // skyscrapers: densest and tallest in the middle of each great city
 cent.forEach(([la,lo,k],ci)=>{const R0=6*k;const JL=dirLL(32,18);const pts=scatter(Math.round(520*k),la,lo,R0,700+ci,land).filter(p=>!nearEnt('ximin',p[0],p[1],.9)&&angDeg(dirLL(p[0],p[1]),JL)>3.4);/* the space egg of Jiale and its ring stay clear */const by=[[],[],[],[]];pts.forEach(p=>by[(p[3]*37|0)%4].push(p));
  by.forEach((L,kk)=>inst(kits[kk],tm,L,(o,p)=>{const d=angDeg(dirLL(p[0],p[1]),dirLL(la,lo))/R0;frameLL(sp,p[0],p[1],-.2,Math.round(p[3]*4)*1.5708,o);const w=2.2+p[3]*3;const h=(4+Math.pow(1-d,2.2)*60*k+p[3]*p[3]*20)*(kk===3?.35:1);o.scale.set(w,h,w*(.8+((p[3]*7)%1)*.5))},null,{tint:p=>C(['#d8e0e8','#b8c4d0','#e8e4dc','#9aa8b4'][(p[3]*11|0)%4]),far:2600}))});
 // the city grid: seams in the metal shine at night, brightest in the cities
 {const pts=[];for(const [la,lo,k] of cent){const Rg=14*k;for(let a=-Rg;a<=Rg;a+=.22){for(const [l1,o1] of[[Math.round((la+a)/2.2)*2.2,null],[null,Math.round((lo+a)/2.2)*2.2]]){}}
   for(let i=0;i<2600*k;i++){const onLat=Rn()<.5;const t=(Rn()-.5)*2*Rg;let pl,po;if(onLat){pl=Math.round((la+(Rn()-.5)*2*Rg)/2.2)*2.2;po=lo+t/Math.max(.3,Math.cos(la*D2R))}else{po=Math.round((lo+(Rn()-.5)*2*Rg/Math.max(.3,Math.cos(la*D2R)))/2.2)*2.2;pl=la+t}
    const h=sp.ghRaw(pl,po);if(h<4)continue;const d=angDeg(dirLL(pl,po),dirLL(la,lo))/Rg;if(Rn()>1-d*.85)continue;pts.push(dirLL(pl,po).multiplyScalar(R+h+.8))}}
  const nl=nightPoints(pts,'#ffc870',1.1,.9);nl.material.uniforms.uDay.value=.04;sp.scene.add(nl);sp.nightMats.push(nl.userData.night)}
 // highways of light between the cities, traffic streaming both ways
 {const hm=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{uT:GT},vertexShader:'varying vec2 vU;void main(){vU=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
   fragmentShader:'uniform float uT;varying vec2 vU;void main(){float x=vU.x*400.;float a=smoothstep(.75,1.,fract(x*.5-uT*1.6))+smoothstep(.75,1.,fract(-x*.37-uT*1.2+.5))*.7;float side=sin(vU.y*6.283)*.5+.5;vec3 c=mix(vec3(1.,.82,.5),vec3(.6,.85,1.),step(.5,fract(vU.y*2.)));gl_FragColor=vec4(c*(a*.9+.12)*side,1.);}'});
  const links=[[0,3],[3,2],[2,0],[0,4],[2,7],[7,1],[1,9-1],[3,5],[6,8],[0,6],[4,7],[9,6]];
  for(const [i,j] of links){const A=cent[i],B=cent[j];const a=dirLL(A[0],A[1]),b=dirLL(B[0],B[1]);if(a.angleTo(b)>1.2)continue;const pts=[];const n=80;for(let s=0;s<=n;s++){const v=a.clone().lerp(b,s/n).normalize();const ll=llDir(v);pts.push(v.multiplyScalar(R+Math.max(gh(ll[0],ll[1]),0)+6+Math.sin(s/n*Math.PI)*10))}
   const m=new THREE.Mesh(ktube(pts,.9,240,4),hm);sp.scene.add(m)}}
 // aircars: lights circling over every great city
 {const n=900;const g=new THREE.BufferGeometry();const pos=new Float32Array(n*3);g.setAttribute('position',new THREE.BufferAttribute(pos,3));const pm=new THREE.PointsMaterial({size:2.2,color:'#fff4d8',transparent:true,opacity:.9,depthWrite:false,blending:THREE.AdditiveBlending,map:dotTex});const P=new THREE.Points(g,pm);P.frustumCulled=false;sp.scene.add(P);
  const st=Array.from({length:n},(_,i)=>{const c=cent[i%cent.length];return{c,r:.6+Math.random()*5*c[2],a:Math.random()*6.283,w:(Math.random()<.5?-1:1)*(.02+Math.random()*.05)/c[2],h:18+Math.random()*50}});
  anim(sp,null,(t,dt)=>{if(CUR!==sp)return;P.visible=rig.alt<2200;if(!P.visible)return;const v=V3();st.forEach((s,i)=>{s.a+=s.w*dt*6;const la=s.c[0]+Math.cos(s.a)*s.r,lo=s.c[1]+Math.sin(s.a)*s.r/Math.max(.3,Math.cos(s.c[0]*D2R));dirLL(la,lo,v).multiplyScalar(R+Math.max(gh(la,lo),0)+s.h);pos[i*3]=v.x;pos[i*3+1]=v.y;pos[i*3+2]=v.z});g.attributes.position.needsUpdate=true})}
 // the all-through train, running its loop round the continent
 {const A=[];for(let i=0;i<=400;i++){const a=i/400*6.28;const la=12+26*Math.cos(a)*.7,lo=-30+26*Math.sin(a)/Math.cos(12*D2R);A.push(dirLL(la,lo).multiplyScalar(R+Math.max(gh(la,lo),0)+13.3))}const cur=new THREE.CatmullRomCurve3(A,true);
  const car=G([[kcy(.9,.9,5,10),'#e8eef2',{r:[0,0,Math.PI/2]}],[tg(new THREE.SphereGeometry(.9,10,6),{s:[1.6,1,1]}),'#e8eef2',{p:[2.5,0,0]}],[kb(4.6,.25,1.84),'#3a8ad8',{p:[0,-.1,0]}]]);const cars=[];const tmc=towerMat({metalness:.7,roughness:.2,win:'#cfe8ff'});sp.towerMats.push(tmc);
  for(let i=0;i<14;i++){const m=new THREE.Mesh(car,tmc);m.scale.setScalar(1.6);sp.scene.add(m);cars.push(m)}const tg2=V3(),up=V3();
  anim(sp,null,t=>{if(CUR!==sp)return;const u0=(t*.0016)%1;cars.forEach((m,i)=>{const u=(u0+i*.0019)%1;cur.getPointAt(u,m.position);cur.getTangentAt(u,tg2);up.copy(m.position).normalize();const sd=tg2.clone().cross(up).normalize();const u2=sd.clone().cross(tg2);m.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(tg2,u2,sd))})})}
 // more cube warships hanging over the cities in the year of the invasion
 {const cm=mt('#2a2c32',{metalness:.7,roughness:.35});const g=G([[kb(1,1,1),'#ffffff'],[kb(1.04,.08,1.04),'#5a5c64',{p:[0,.3,0]}],[kb(1.04,.08,1.04),'#5a5c64',{p:[0,-.3,0]}]]);
  inst(g,VC({metalness:.7,roughness:.35}),scatter(9,28,26,9,991),(o,p)=>{frameLL(sp,p[0],p[1],140+p[3]*160,p[3]*6,o,false);o.scale.setScalar(26+p[3]*30)},[6],{tint:()=>C('#4a4c54'),far:4000})}}

function erxiMore(sp){const gh=sp.gh;const Rn=rnd(4242);sp.entClr=sp.entClr||[];sp.nightMats=sp.nightMats||[];
 const T=[[45,12,{name:'tiangong',style:'future',keep:[[18,0,15],[36,0,18],[0,-24,15],[2,24,11],[-20,-20,8]],r:2.6,n:170,eras:[8,9,10,11,12],wall:0,fields:8,people:50,pCol:'#c8b090',road:'#d8ccb0',towers:.16,scale:1.15}],
  [38.5,101,{name:'niuyao',style:'future',r:5.6,n:620,streets:9,eras:[8,9,10,11,12],people:140,pCol:'#a8b0b8',road:'#b8bcc0',win:'#cfe6ff',lamp:'#cfe6ff',towers:.42,scale:1.35,streetLife:1.4,keep:[[0,0,26],[0,0,0]],noCenter:1}],
  [38,-100,{name:'ameirun',style:'future',keep:[[10,0,4],[-8,8,4],[-6,-10,4]],r:2.6,n:150,eras:[8,9,10,11,12],people:46,pCol:'#c8a860',road:'#d8ccb0',fields:8,towers:.14}],
  [36,-94,{name:'hero',style:'future',keep:[[6,0,7],[-12,10,13]],r:1.5,n:70,eras:[8,9],people:24,towers:.2}],
  [32,-84,{name:'clown',style:'white',r:1.4,n:60,eras:[9],people:20}],
  [36,16,{name:'atlan',style:'dragon',r:1.8,n:80,eras:[7],wall:1,wallC:'#a89a88',fields:10,people:36,pCol:'#8a6a4a'}],
  [40,22,{name:'yanjiu',style:'future',keep:[[0,0,11]],noCenter:1,r:1.2,n:50,eras:[9],people:16}],
  [78,-24,{name:'xiafeng',style:'white',roof:'#6e6a64',r:1.3,n:60,eras:[8,9],people:20,pCol:'#c8a880',road:'#7a7876',keep:[[0,0,6],[-8,6,6]],noCenter:1,towers:0}],
  [30,40,{name:'nengli',style:'white',r:1.3,n:56,eras:[7],people:20}]];
 for(const [la,lo,o] of T){o.map='erxi';const deg=o.r*.92;sp.entClr.push({d:dirLL(la,lo),deg,cs:Math.cos(deg*D2R),eras:o.eras,town:1});town(sp,la,lo,o)}tiangongDetail(sp);erxiCityDetail(sp);niuyaoDetail(sp);erxiCityMore(sp);fxG_erxi(sp);
 // woods in patches over the warm lands, conifers on the cold ones
 const wf=d=>sm(.46,.62,fbm(d.x*9+3,d.y*9,d.z*9,4));const pts={broad:[],conifer:[],palm:[]};const d=V3();
 for(let i=0;i<260000&&(pts.broad.length+pts.conifer.length)<14000;i++){d.set(Rn()*2-1,Rn()*2-1,Rn()*2-1);if(d.lengthSq()>1||d.lengthSq()<.02)continue;d.normalize();const la=Math.asin(d.y)/D2R,lo=Math.atan2(d.x,d.z)/D2R;const h=sp.ghRaw(la,lo);if(h<3||h>70)continue;
  if(Math.abs(la)>72)continue;if(T.some(([a,b,o])=>angDeg(d,dirLL(a,b))<o.r*1.1))continue;if(wf(d)<Rn())continue;const al=Math.abs(la);const kind=al>48||h>45?'conifer':al<14&&h<8&&Rn()<.5?'palm':'broad';pts[kind].push([la,lo,h,Rn()])}
 const fm=swayMat({roughness:.88},.0035);
 for(const k in pts){if(!pts[k].length)continue;const chunks={};for(const p of pts[k]){const key=Math.floor(p[0]/6)+','+Math.floor(p[1]/6);(chunks[key]=chunks[key]||[]).push(p)}
  for(const key in chunks)inst(geoC(k),fm,chunks[key],(o,p)=>{frameLL(sp,p[0],p[1],-.3,p[3]*6.28,o);const s=(k==='conifer'?1.1:1)*(.8+p[3]*.8);o.scale.set(s,s*(.85+((p[3]*7.7)%1)*.4),s)},null,
   {tint:p=>(k==='conifer'?C('#2e5a3c'):k==='palm'?C('#5a9a40'):C('#447a3a')).offsetHSL((p[3]-.5)*.06,(p[3]-.5)*.1,(p[3]-.5)*.12),far:1900})}
 sp.forestN=pts.broad.length+pts.conifer.length+pts.palm.length}
