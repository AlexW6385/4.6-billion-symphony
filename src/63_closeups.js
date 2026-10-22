/* ---------- close-ups on Erxi and the Ximin homeworld ---------- */
function erxiClose(sp){const Rn=rnd(6061);const gh=sp.gh;linMark(sp,{8:[47.2,14.2,5],9:[47.2,14.2,5],10:[42.4,2.4,5],11:[42.4,2.4,5],12:[20.4,30.4,6]});
 roadNet(sp,[[[45,12],[40,22]],[[40,22],[36,16]],[[45,12],[52,4]],[[38,-100],[36,-94]],[[36,-94],[32,-84]],[[32,108],[38,118]]],[8,9,10,11,12],{col:'#5a5a60',car:'#c8d0d8',lamp:'#ffe8c0',cars:4,w:1.1,seed:777});
 // 峡风要塞: a new town built to look old — grey brick lanes, low stone houses, a great golden bell
 {const la0=78,lo0=-24;const g=new THREE.Group();frameLL(sp,la0,lo0,0,0,g);const parts=[];
  for(let k=0;k<5;k++){const a=k/5*6.28+.3;for(let j=0;j<10;j++){const d=4+j*2.6;parts.push([new THREE.BoxGeometry(1.6,.08,d>0?2.6:1).translate(0,.05,0).rotateY(-a).translate(Math.cos(a)*d,0,Math.sin(a)*d),'#7a7672'])}}
  for(let i=0;i<46;i++){const a=Rn()*6.28,d=7+Rn()*20;const w=1.6+Rn()*1.4,h=1.2+Rn()*.8,l=1.8+Rn()*1.6;const x=Math.cos(a)*d,z=Math.sin(a)*d;
   parts.push([new THREE.BoxGeometry(w,h,l).translate(0,h/2,0).rotateY(-a).translate(x,0,z),['#9a948a','#8a847a','#a8a296'][i%3]]);parts.push([new THREE.ConeGeometry(Math.max(w,l)*.75,1,4).rotateY(Math.PI/4).scale(w/Math.max(w,l),1,l/Math.max(w,l)).translate(0,h+.5,0).rotateY(-a).translate(x,0,z),['#5a4a3a','#4a3e34','#6a5442'][i%3]])}
  // the bell tower in the square, beside the old keep
  {const B=[];B.push([new THREE.BoxGeometry(3,10,3).translate(0,5,0),'#a8a090']);B.push([new THREE.BoxGeometry(3.6,.4,3.6).translate(0,10.2,0),'#7a7064']);for(const [x,z] of [[-1.3,-1.3],[1.3,-1.3],[-1.3,1.3],[1.3,1.3]])B.push([new THREE.BoxGeometry(.4,3,.4).translate(x,11.9,z),'#a8a090']);B.push([new THREE.ConeGeometry(2.8,2.6,4).rotateY(Math.PI/4).translate(0,14.7,0),'#4a3e34']);
   B.forEach(([gg,c])=>parts.push([gg.translate(0,0,13),c]))}
  const m=new THREE.Mesh(mergeColored(parts),VC({roughness:.9}));g.add(m);
  const bell=new THREE.Group();bell.position.set(0,13.2,13);const b=new THREE.Mesh(new THREE.LatheGeometry([[.05,0],[.6,-.2],[.9,-1.2],[1.15,-1.9],[1.2,-2]].map(p=>new THREE.Vector2(p[0],p[1])),16),new THREE.MeshStandardMaterial({color:'#e8c050',metalness:.95,roughness:.25,side:THREE.DoubleSide}));bell.add(b);g.add(bell);
  for(let i=0;i<10;i++){const l=glowSprite('#ffd890',2.4,.7);const a=i/10*6.28;l.position.set(Math.cos(a)*6,1.8,Math.sin(a)*6);g.add(l)}
  addE(g,[8,9]);cull(g,null,40,1600);anim(sp,g,t=>{bell.rotation.z=Math.sin(t*1.2)*.12})}
 // 天宫学院 grounds: a playing field and a dome observatory beside the city
 {const la0=41.0,lo0=12.0;if(gh(la0,lo0)>.5){const g=new THREE.Group();frameLL(sp,la0,lo0,0,0,g);const parts=[];
  parts.push([new THREE.CylinderGeometry(6,6,.1,32).scale(1.6,1,1).translate(0,.06,0),'#c8643a'],[new THREE.CylinderGeometry(5,5,.12,32).scale(1.5,1,.9).translate(0,.08,0),'#4a9a4a']);
  parts.push([new THREE.CylinderGeometry(2.4,2.6,3,16).translate(14,1.5,0),'#e8e4dc'],[new THREE.SphereGeometry(2.6,16,8,0,6.283,0,1.57).translate(14,3,0),'#c8d4e0']);
  for(let i=0;i<3;i++)parts.push([new THREE.BoxGeometry(5,3+i,3).translate(-14,1.5+i/2,-6+i*6),'#ece8de'],[new THREE.BoxGeometry(5.4,.3,3.4).translate(-14,3.1+i,-6+i*6),'#8a5a3a']);
  // the dormitory: two lit windows, and one door that has been replaced rather often
  parts.push([new THREE.BoxGeometry(8,4,3.4).translate(0,2,-12),'#e8dccb'],[new THREE.BoxGeometry(8.6,.4,4).translate(0,4.2,-12),'#7a4a34']);
  g.add(new THREE.Mesh(mergeColored(parts),VC({roughness:.7})));
  for(const x of [-2.2,2.2]){const wn=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({color:'#ffd890'}));wn.position.set(x,2.6,-10.28);g.add(wn)}
  {const cv=document.createElement('canvas');cv.width=128;cv.height=64;const x=cv.getContext('2d');x.fillStyle='#f4ecd8';x.fillRect(0,0,128,64);x.fillStyle='#3a2a1a';x.font='bold 15px sans-serif';x.textAlign='center';x.fillText('请用拳头以外',64,26);x.fillText('的方式',64,48);
   const sg=new THREE.Mesh(new THREE.PlaneGeometry(1.4,.7),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv)}));sg.position.set(0,2.3,-10.27);g.add(sg);const dr=new THREE.Mesh(new THREE.BoxGeometry(1,1.8,.12),mt('#8a5a3a'));dr.position.set(0,.9,-10.3);dr.rotation.y=.25;g.add(dr)}
  const kids=[];for(let i=0;i<14;i++){const k=new THREE.Mesh(new THREE.CylinderGeometry(.18,.22,.8,6),M(['#3a5ab8','#e8e4dc','#b83a3a'][i%3]));g.add(k);kids.push({k,a:Rn()*6,r:2+Rn()*5,s:(Rn()<.5?1:-1)*(.4+Rn()*.6)})}
  anim(sp,g,t=>kids.forEach(o=>{const a=o.a+t*o.s;o.k.position.set(Math.cos(a)*o.r*1.5,.5+Math.abs(Math.sin(t*6+o.a))*.15,Math.sin(a)*o.r*.9)}));addE(g,[8,9,10]);cull(g,null,30,1400);sp._dorm=g}}}
function ximinClose(sp){const Rn=rnd(7171);linMark(sp,{6:[27.3,34.3,7],7:[-4.4,-88.6,7]});
 // a rail line running into the egg's open gate, and trains on it
 {const pts=[];for(let i=0;i<=40;i++){const t=i/40;pts.push([32-t*6+Math.sin(t*4)*.6,18-t*9])}const g=new THREE.Group();sp.scene.add(g);
  const rail=[];for(const [la,lo] of pts){const v=dirLL(la,lo);rail.push(v.multiplyScalar(R+Math.max(sp.gh(la,lo),0)+1.2))}const cv=new THREE.CatmullRomCurve3(rail);
  const track=new THREE.Mesh(new THREE.TubeGeometry(cv,300,.45,5,false),mt('#8a9098',{metalness:.7,roughness:.35}));g.add(track);
  const eggC=dirLL(32,18).multiplyScalar(R+Math.max(sp.gh(32,18),0));let gu=0;for(let u=0;u<1;u+=.002){if(cv.getPointAt(u).distanceTo(eggC)>15.5){gu=u;break}}
  const gate=new THREE.Group();gate.position.copy(cv.getPointAt(gu));gate.up.copy(gate.position).normalize();gate.lookAt(cv.getPointAt(Math.min(1,gu+.01)));const ga=new THREE.Mesh(new THREE.TorusGeometry(4,.8,8,24,Math.PI),GL('#bfeaff',.8));gate.add(ga);gate.add(at(glowSprite('#bfeaff',14,.5),0,3,0));sp.scene.add(gate);
  const cars=[];for(let k=0;k<2;k++)for(let j=0;j<6;j++){const c=new THREE.Mesh(new THREE.BoxGeometry(1.4,1.2,3.4),mt(j===0?'#e8eef2':'#c8d4dc',{metalness:.8,roughness:.25}));g.add(c);cars.push({c,k,j})}
  const tp=V3(),tq=V3();anim(sp,g,t=>{for(const o of cars){const u=((t*.012+o.k*.5)%1)-o.j*.006;const uu=Math.max(0,Math.min(1,u));cv.getPointAt(uu,tp);cv.getPointAt(Math.min(1,uu+.002),tq);o.c.position.copy(tp).addScaledVector(tp.clone().normalize(),.9);o.c.up.copy(tp).normalize();o.c.lookAt(tq.addScaledVector(tq.clone().normalize(),.9));o.c.visible=u>0&&u<.995}});
  cull(g,dirLL(29,13).multiplyScalar(R),220,2400)}
 // 深海之城: glass tubes between the domes on the sea floor, lit all along, and a glow under every dome
 {const pts=scatter(16,2,152,2.2,321);const P=pts.map(p=>dirLL(p[0],p[1]).multiplyScalar(R+sp.ghRaw(p[0],p[1])+.6));const g=new THREE.Group();const lamps=[];const tm=new THREE.MeshStandardMaterial({color:'#bfeaff',transparent:true,opacity:.35,roughness:.1,metalness:.3,emissive:'#3a8ab0',emissiveIntensity:.5,depthWrite:false});
  P.forEach((a,i)=>{const near=P.map((b,j)=>[j,a.distanceTo(b)]).filter(x=>x[0]!==i).sort((x,y)=>x[1]-y[1]).slice(0,2);for(const [j,d] of near){if(j<i&&near.length)continue;const b=P[j];const mid=a.clone().lerp(b,.5).addScaledVector(a.clone().normalize(),1.2);const cv=new THREE.QuadraticBezierCurve3(a.clone(),mid,b.clone());g.add(new THREE.Mesh(new THREE.TubeGeometry(cv,16,.35,6,false),tm));for(let k=1;k<10;k++)lamps.push(cv.getPoint(k/10))}
   const gl=glowSprite('#7ad8ff',9,.5);gl.position.copy(a).addScaledVector(a.clone().normalize(),.5);g.add(gl)});
  g.add(sparkles(lamps,'#c8f4ff',2.2,1,1));addTo(sp,g,[7]);cull(g,dirLL(2,152).multiplyScalar(R),120,1600)}
 // 养殖之海: net pens with buoys, feeding platforms with lamps, boats between them
 {const g=new THREE.Group();sp.scene.add(g);const parts=[],lit=[];const plats=[];
  for(let i=0;i<34;i++){const la=-2+(Rn()-.5)*9,lo=140+(Rn()-.5)*10;if(sp.ghRaw(la,lo)>-.5)continue;const o=new THREE.Object3D();frameLL(sp,la,lo,.25,Rn()*6,o,false);o.updateMatrix();
   const r=2.2+Rn()*2;const ring=new THREE.TorusGeometry(r,.18,5,20).rotateX(Math.PI/2).applyMatrix4(o.matrix);parts.push([ring,'#e8d040']);
   for(let k=0;k<6;k++){const a=k/6*6.28;parts.push([new THREE.SphereGeometry(.32,6,4).translate(Math.cos(a)*r,.2,Math.sin(a)*r).applyMatrix4(o.matrix),'#ff6a3a'])}
   parts.push([new THREE.CircleGeometry(r*.95,16).rotateX(-Math.PI/2).translate(0,.02,0).applyMatrix4(o.matrix),'#3a6a5a']);
   if(i%5===0){parts.push([new THREE.BoxGeometry(3,.4,3).translate(r+2.5,.3,0).applyMatrix4(o.matrix),'#8a9098'],[new THREE.CylinderGeometry(.2,.2,5,6).translate(r+2.5,2.8,0).applyMatrix4(o.matrix),'#c8ccd0']);const l=glowSprite('#ffe8a0',4,.9);l.position.set(r+2.5,5.4,0).applyMatrix4(o.matrix);g.add(l);plats.push(V3(r+2.5,.4,0).applyMatrix4(o.matrix))}}
  if(parts.length){const geo=mergeColored(parts.map(([gg,c])=>{gg=gg.index?gg.toNonIndexed():gg;if(!gg.attributes.normal)gg.computeVertexNormals();return[gg,c]}));g.add(new THREE.Mesh(geo,VC({roughness:.6})))}
  const boats=[];for(let i=0;i<Math.min(6,plats.length);i++){const b=new THREE.Mesh(new THREE.BoxGeometry(1,.5,2.6),mt('#e8eef2',{metalness:.5,roughness:.3}));g.add(b);boats.push({b,a:plats[i],c:plats[(i+1)%plats.length],ph:Rn()})}
  anim(sp,g,t=>boats.forEach(o=>{const k=(Math.sin(t*.08+o.ph*6)+1)/2;o.b.position.copy(o.a).lerp(o.c,k);o.b.up.copy(o.b.position).normalize();o.b.lookAt(o.c)}));
  cull(g,dirLL(-2,140).multiplyScalar(R),200,2000);addTo(sp,g,[6,7])}}
