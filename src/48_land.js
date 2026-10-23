/* ---------- small things on the land: waterfalls, river mouths, campfires, cairns, flower meadows ---------- */
function rqLand(sp){const G=sp.G,gh=sp.gh,Rn=rnd(5150);const up=V3(),q=new THREE.Quaternion();const Y=V3(0,1,0);
 const ground=(d)=>gridSample(G,G.H,d);const cy=(d)=>G.CY?gridSample(G,G.CY,d):0;const wet=d=>LAKEZ.some(([c,r])=>angDeg(c,d)<r)||angDeg(d,F.crater)<3.2;const cyLL=(la,lo)=>{const d=dirLL(la,lo);return wet(d)?1:cy(d)};
 // ---- waterfalls where a river drops ----
 const fallM=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,uniforms:{uT:GT},vertexShader:'varying vec2 vU;void main(){vU=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:'uniform float uT;varying vec2 vU;void main(){float s=fract(vU.y*3.+uT*1.6+sin(vU.x*23.)*.3);float s2=fract(vU.y*5.3+uT*2.3+sin(vU.x*41.+1.)*.2);float e=smoothstep(0.,.15,vU.x)*smoothstep(1.,.85,vU.x);float k=.55+.45*smoothstep(.2,.9,max(s,s2));vec3 c=mix(vec3(.55,.75,.85),vec3(.97,.99,1.),k);gl_FragColor=vec4(c,(.55+.4*k)*e);}'});
 let nf=0;const tg=V3(),sd=V3();
 RIVERS.L.forEach(L=>{const n=L.length;for(let i=2;i<n-4;i++){const hA=ground(L[i]),hB=ground(L[i+3]);if(hA>4&&hA-hB>5&&cy(L[i])<.3&&cy(L[i+3])<.3){const A=L[i].clone().normalize(),B=L[i+3].clone().normalize();tg.copy(B).sub(A).normalize();sd.copy(tg).cross(A).normalize();const t=i/(n-1);const hw=(.1+t*.32)*D2R*.95*R;
   const pA=A.clone().multiplyScalar(R+hA+.4),pB=B.clone().multiplyScalar(R+Math.max(hB,0)+.2);const P=[pA.clone().addScaledVector(sd,-hw),pA.clone().addScaledVector(sd,hw),pB.clone().addScaledVector(sd,-hw*1.2),pB.clone().addScaledVector(sd,hw*1.2)];
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P.flatMap(v=>[v.x,v.y,v.z]),3));g.setAttribute('uv',new THREE.Float32BufferAttribute([0,0,1,0,0,(hA-hB)/6,1,(hA-hB)/6],2));g.setIndex([0,2,1,1,2,3]);g.computeBoundingSphere();
   const m=new THREE.Mesh(g,fallM);m.renderOrder=3;sp.scene.add(m);cull(m,g.boundingSphere.center.clone(),g.boundingSphere.radius,1400);
   const grp=new THREE.Group();grp.position.copy(pB);grp.quaternion.setFromUnitVectors(Y,B);const mist=glowSprite('#f4f8ff',hw*7,.35);mist.position.y=hw*1.2;grp.add(mist);
   const spray=emitter({n:60,life:1.8,speed:1.4,spread:.9,size:.9,col:'#ffffff',op:.55,area:[hw*2,.4,hw*2],grav:.6,wander:.3});grp.add(spray);sp.scene.add(grp);cull(grp,pB.clone(),hw*6,1100);
   (sp._dbgF=sp._dbgF||[]).push(pB.clone());nf++;i+=12}}
  // the river mouth: a fan of paler water and a ruffle of foam where it meets the sea
  for(let i=1;i<n;i++){if(ground(L[i])<-.3&&ground(L[i-1])>=-.3){const d=L[i].clone().normalize();const grp=new THREE.Group();grp.position.copy(d).multiplyScalar(R+.12);grp.quaternion.setFromUnitVectors(Y,d);
    const fan=new THREE.Mesh(new THREE.CircleGeometry(6,24),new THREE.MeshBasicMaterial({color:'#a8c8b0',transparent:true,opacity:.28,depthWrite:false}));fan.rotation.x=-Math.PI/2;grp.add(fan);
    const foam=emitter({n:40,life:3,speed:.2,spread:1,size:1.2,col:'#ffffff',op:.4,disc:5,area:[0,.1,0]});grp.add(foam);sp.scene.add(grp);cull(grp,grp.position.clone(),12,1200);break}}});
 sp._falls=nf;
 // ---- campfires: on the edges of towns and at the old tribal camps ----
 const fireSites=[];for(const [la,lo,o] of TOWN_SITES){for(let k=0;k<4;k++){const a=Rn()*6.28,dd=o.r*(1.08+Rn()*.25);fireSites.push([la+Math.cos(a)*dd,lo+Math.sin(a)*dd/Math.cos(la*D2R),o.eras||[5]])}}
 fireSites.push([-3.4,-85.5,[3,4,5]],[-2.6,-84.4,[3,4,5]],[37.4,-8.4,[4,5]],[36.6,-7.4,[4,5]],[12.6,-89.4,[3]],[4.7,-110.6,[3,4]]);
 const logG=mergeColored([[new THREE.CylinderGeometry(.08,.08,1,5).rotateZ(Math.PI/2).rotateY(.4),'#4a3020'],[new THREE.CylinderGeometry(.08,.08,1,5).rotateZ(Math.PI/2).rotateY(-.8),'#3a2618'],[new THREE.CylinderGeometry(.08,.08,1,5).rotateZ(Math.PI/2).rotateY(1.9),'#4a3020'],
  ...Array.from({length:7},(_,i)=>[new THREE.IcosahedronGeometry(.13,0).translate(Math.cos(i*.9)*.55,.02,Math.sin(i*.9)*.55),'#6a6660'])]);const logM=VC({roughness:.9});
 for(const [la,lo,eras] of fireSites){if(gh(la,lo)<1||cyLL(la,lo)>.3)continue;const g=new THREE.Group();frameLL(sp,la,lo,.05,Rn()*6,g);const lg=new THREE.Mesh(logG,logM);lg.scale.setScalar(1.3);g.add(lg);
  const fl=glowSprite('#ffa040',2.6,.85);fl.position.y=.5;g.add(fl);const fl2=glowSprite('#ff6a20',7,.25);fl2.position.y=.6;g.add(fl2);
  const em=emitter({n:24,life:1.6,speed:1.3,spread:.25,size:.35,col:'#ffd070',col2:'#ff4a10',op:.9,area:[.5,.2,.5],wander:.4});em.position.y=.3;g.add(em);
  const sm2=emitter({n:20,life:5,speed:.9,spread:.2,size:2.2,col:'#8a8480',op:.18,area:[.3,.2,.3],wander:.8,tex:typeof smokeTex!=='undefined'?smokeTex:undefined});sm2.position.y=1.2;g.add(sm2);
  const ph=Rn()*9;anim(sp,g,t=>{const f=.8+.2*Math.sin(t*11+ph)*Math.sin(t*7.3+ph);fl.scale.setScalar(2.6*f);fl.material.opacity=.7+.25*f;fl2.material.opacity=.18+.1*f});
  (sp._dbgC=sp._dbgC||[]).push(g.position.clone());addE(g,eras,true);cull(g,g.position.clone(),6,700)}
 // ---- cairns: small piles of stones on hilltops and beside the town roads ----
 {const parts=[];const st=lumpRock(1,9);const cairnAt=[];for(const [la,lo,o] of TOWN_SITES)for(let k=0;k<5;k++){const a=Rn()*6.28,dd=o.r*(1.2+Rn()*.6);cairnAt.push([la+Math.cos(a)*dd,lo+Math.sin(a)*dd/Math.cos(la*D2R),o.eras||[5]])}
  for(let k=0;k<40;k++){const la=(Rn()-.5)*80,lo=(Rn()-.5)*300;const h=gh(la,lo);if(h>25&&h<90)cairnAt.push([la,lo,[3,5,6,7,8,9,10,11,12]])}
  for(const [la,lo,eras] of cairnAt){if(gh(la,lo)<1.5||cyLL(la,lo)>.3)continue;const g=new THREE.Group();frameLL(sp,la,lo,-.1,Rn()*6,g);const P=[];let y=0;for(let j=0;j<4;j++){const s=.55-j*.11;P.push([st.clone().scale(s,s*.7,s).rotateY(j*1.3).translate((Rn()-.5)*.1,y+s*.6,(Rn()-.5)*.1),['#8a8478','#9a948a','#7a7468','#a8a298'][j]]);y+=s*1.1}
   g.add(new THREE.Mesh(mergeColored(P),VC({roughness:.95,flatShading:true})));g.scale.setScalar(1.4);addE(g,eras,true);cull(g,g.position.clone(),4,500)}}
 // 苏苏米 的秘密: a cave outside the city with a clumsy, spiky stone fluffball inside
 {const la=14.8,lo=-88.4;if(gh(la,lo)>1){const g=new THREE.Group();frameLL(sp,la,lo,-.3,2.2,g);
  const rock=new THREE.Mesh(new THREE.SphereGeometry(4,14,10,0,Math.PI*1.6,0,Math.PI/2),detailMat(mt('#6a6258',{roughness:.95,flatShading:true,side:THREE.DoubleSide}),{bump:.8}));rock.rotation.y=-.3;g.add(rock);
  const st=new THREE.Group();st.position.set(.6,1.1,.3);const core=new THREE.Mesh(new THREE.IcosahedronGeometry(.8,1),mt('#9a9488',{roughness:.9,flatShading:true}));st.add(core);
  for(let i=0;i<26;i++){const d=V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize();const c=new THREE.Mesh(new THREE.ConeGeometry(.12,.5,4),mt('#8a8478',{flatShading:true}));c.position.copy(d).multiplyScalar(.85);c.quaternion.setFromUnitVectors(Y,d);st.add(c)}
  const ped=new THREE.Mesh(new THREE.CylinderGeometry(.6,.8,.5,7),mt('#7a7468'));ped.position.set(.6,.25,.3);g.add(ped);g.add(st);const gl=glowSprite('#ffe0a0',4,.35);gl.position.set(.6,1.4,.3);g.add(gl);
  addE(g,[3,4],true);cull(g,g.position.clone(),8,700);sp._susumi=g.position.clone()}}
 // 脑袋虫's wall on the twin island: rough drawings made by rolling, smudging and remembering
 {const la=1.3,lo=-46.2;if(gh(la,lo)>.8){const cv=document.createElement('canvas');cv.width=256;cv.height=128;const x=cv.getContext('2d');x.fillStyle='#8a8070';x.fillRect(0,0,256,128);
   for(let i=0;i<400;i++){x.fillStyle=`rgba(${60+Rn()*60|0},${55+Rn()*50|0},${45+Rn()*40|0},.25)`;x.fillRect(Rn()*256,Rn()*128,3,3)}
   x.lineWidth=4;x.lineCap='round';const col=['#e8e0c8','#c84a2a','#3a6a8a','#e8c040'];
   x.strokeStyle=col[0];x.beginPath();x.arc(52,60,22,0,6.28);x.stroke();for(let i=0;i<14;i++){const a=i/14*6.28;x.beginPath();x.moveTo(52+Math.cos(a)*22,60+Math.sin(a)*22);x.lineTo(52+Math.cos(a)*30,60+Math.sin(a)*30);x.stroke()}
   x.strokeStyle=col[1];x.beginPath();x.moveTo(90,96);for(let i=0;i<8;i++)x.lineTo(96+i*14,96-Math.sin(i)*14-(i%2)*8);x.stroke();
   x.fillStyle=col[2];for(let i=0;i<5;i++){x.beginPath();x.arc(150+i*18,40+(i%2)*10,6,0,6.28);x.fill()}
   x.strokeStyle=col[3];x.beginPath();x.arc(214,80,14,0,6.28);x.stroke();x.beginPath();x.moveTo(200,104);x.quadraticCurveTo(214,120,230,104);x.stroke();
   const g=new THREE.Group();frameLL(sp,la,lo,0,.8,g);const rock=new THREE.Mesh(new THREE.BoxGeometry(9,4.4,1.6),detailMat(mt('#7a7266',{roughness:.95,flatShading:true}),{bump:.9}));rock.position.y=2;g.add(rock);
   const art=new THREE.Mesh(new THREE.PlaneGeometry(8,3.8),new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(cv),roughness:.95}));art.position.set(0,2.1,.81);g.add(art);
   addE(g,[3,4,5],true);cull(g,g.position.clone(),8,700);sp._wall=g.position.clone();sp._wallG=g}}
 // ---- flower meadows in open, gentle country ----
 const petal=new THREE.SphereGeometry(.13,7,3);petal.scale(1,.35,1);petal.translate(0,.32,0);const eye=new THREE.SphereGeometry(.05,5,3);eye.translate(0,.36,0);const stem=new THREE.CylinderGeometry(.015,.015,.32,3);stem.translate(0,.16,0);
 const flowerG=mergeColored([[stem,'#3a7a2a'],[petal,'#ffffff'],[eye,'#f4d040']]);const FC=['#f4e070','#f08ab8','#9ac0ff','#ffffff','#ff7a5a','#c89aff'];
 let patches=0;for(let k=0;k<1500&&patches<34;k++){const la=(Rn()-.5)*90,lo=(Rn()-.5)*340;const d=dirLL(la,lo);const h=gh(la,lo);if(h<3||h>40||forestF(d)>.3||cy(d)>.1||wet(d))continue;{const sl=Math.max(Math.abs(gh(la+.4,lo)-h),Math.abs(gh(la-.4,lo)-h),Math.abs(gh(la,lo+.4)-h),Math.abs(gh(la,lo-.4)-h));if(sl>2.5)continue}if(TOWNC.some(([c,r])=>angDeg(c,d)<r))continue;
  const n=420,im=new THREE.InstancedMesh(flowerG,VC({roughness:.7}),n);const o3=new THREE.Object3D();const c0=FC[(Rn()*FC.length)|0],c1=FC[(Rn()*FC.length)|0];const rad=.35+Rn()*.4;let ok=0;
  for(let i=0;i<n;i++){const a=Rn()*6.28,r=Math.sqrt(Rn())*rad;const l2=la+Math.cos(a)*r,o2=lo+Math.sin(a)*r/Math.cos(la*D2R);const h2=gh(l2,o2);if(h2<2||Math.abs(h2-h)>2.5||cyLL(l2,o2)>.1)continue;frameLL(sp,l2,o2,-.02,Rn()*6,o3);o3.scale.setScalar(.8+Rn()*.7);o3.updateMatrix();im.setMatrixAt(ok,o3.matrix);im.setColorAt(ok,C(Rn()<.6?c0:c1));ok++}
  im.count=ok;im.frustumCulled=false;if(ok<40){im.dispose&&im.dispose();continue}im.instanceMatrix.needsUpdate=true;const c=dirLL(la,lo).multiplyScalar(R+h);addE(im,[2,3,5,6,7,8,9,10,11,12],true);cull(im,c,rad*D2R*R+4,900);(sp._dbgM=sp._dbgM||[]).push(c);patches++}
 // at night the shallows glow: plankton lighting up blue-green where the waves break
 {const pts=[];const raw=sp.ghRaw||sp.gh;for(let k=0;k<160000&&pts.length<3200;k++){const la=(Rn()-.5)*84,lo=(Rn()-.5)*360;const h=raw(la,lo);if(h>-.1||h<-7)continue;if(cy(dirLL(la,lo))>.1)continue;pts.push(dirLL(la,lo).multiplyScalar(R+.25))}
  const nl=nightPoints(pts,'#5affd8',1.1,.85);addE(nl,[2,3,5,6,7,8,9,10,11,12],true);sp.nightMats=(sp.nightMats||[]).concat([nl.userData.night]);sp._plank=pts.length}
 sp._meadows=patches;
 // the roads of the dragon lands: silver city to the capital, the capital and port to the villages
 sp._roads=roadNet(sp,[[[-4,56],[-14,63]],[[-4,56],[-8,49]],[[-14,63],[-19,58]],[[13.2,11.3],[11.2,9.0]]],[5,6,7,8,9,10,11,12],{col:'#a89e8c',car:'#8a6a4a',cars:3,w:.8})}

/* ---------- roads between towns, with lamps that come on at night and a little traffic ---------- */
function roadNet(sp,pairs,eras,o){o=o||{};const gh=sp.gh,Rn=rnd(o.seed||3131);const w=o.w||.55;const pos=[],idx=[],lamps=[],paths=[];const A=V3(),B=V3(),P=V3(),T=V3(),S=V3();
 for(const [a,b] of pairs){A.copy(dirLL(a[0],a[1]));B.copy(dirLL(b[0],b[1]));const ang=A.angleTo(B);const n=Math.max(12,Math.round(ang/D2R*10));const pts=[];const ph=Rn()*9;
  for(let i=0;i<=n;i++){const t=i/n;P.copy(A).lerp(B,t).normalize();const k=Math.sin(t*Math.PI);T.copy(B).sub(A).cross(P).normalize();P.addScaledVector(T,Math.sin(t*7+ph)*.006*k).normalize();
   const la=Math.asin(P.y)/D2R,lo=Math.atan2(P.x,P.z)/D2R;const h=gh(la,lo);pts.push({p:P.clone(),h,la,lo})}
  const path=[];for(let i=0;i<pts.length;i++){const q=pts[i],nx=pts[Math.min(pts.length-1,i+1)],pv=pts[Math.max(0,i-1)];T.copy(nx.p).sub(pv.p).normalize();S.copy(T).cross(q.p).normalize();const r=R+Math.max(q.h,0)+.22;const base=pos.length/3;
   pos.push(...q.p.clone().addScaledVector(S,w/R).normalize().multiplyScalar(r).toArray(),...q.p.clone().addScaledVector(S,-w/R).normalize().multiplyScalar(r).toArray());
   if(i<pts.length-1&&q.h>.4&&nx.h>.4)idx.push(base,base+2,base+1,base+1,base+2,base+3);path.push(q.p.clone().multiplyScalar(r+.35));
   if(i%2===0&&q.h>.4)lamps.push(q.p.clone().addScaledVector(S,(w*1.6)/R).normalize().multiplyScalar(r+1.1))}
  for(let i=1;i<pts.length;i++)(sp.q2Lines=sp.q2Lines||[]).push({a:pts[i-1].p,b:pts[i].p,w:w*1.6/(R*D2R),eras});// the ground keeps flat and grassless under the road
  paths.push(path)}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();
 const nr=g.attributes.normal.array;for(let k=0;k<nr.length;k+=3){const l=Math.hypot(pos[k],pos[k+1],pos[k+2]);nr[k]=pos[k]/l;nr[k+1]=pos[k+1]/l;nr[k+2]=pos[k+2]/l}g.computeBoundingSphere();
 const road=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:o.col||'#8a8478',roughness:.95,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}));road.frustumCulled=false;addTo(sp,road,eras,true);
 if(lamps.length){const nl=nightPoints(lamps,o.lamp||'#ffd890',1.3,1);addTo(sp,nl,eras,true);sp.nightMats=(sp.nightMats||[]).concat([nl.userData.night])}
 // traffic: carts or cars, small boxes sliding along the paths
 const cars=[];const cg=new THREE.BoxGeometry(.6,.45,1.3);const cm=new THREE.MeshStandardMaterial({color:o.car||'#7a5a3a',roughness:.6});
 paths.forEach((pp,pi)=>{if(pp.length<3)return;const cv=new THREE.CatmullRomCurve3(pp);for(let k=0;k<(o.cars||3);k++){const m=new THREE.Mesh(cg,cm);const hl=glowSprite(o.lamp||'#ffd890',1.6,.0);m.add(hl);hl.position.z=.8;addTo(sp,m,eras,true);cars.push({m,hl,cv,ph:Rn(),sp:(.004+Rn()*.004)*(Rn()<.5?1:-1)})}});
 const tp=V3(),tq=V3();anim(sp,null,t=>{const night=sp.dayK!==undefined?1-sp.dayK:0;for(const c of cars){if(!c.m.visible&&c.m.userData.eraHide)continue;const near=camera.position.distanceTo(c.cv.points[0])<2500||camera.position.distanceTo(c.cv.points[c.cv.points.length-1])<2500;if(!near)continue;let u=(t*c.sp+c.ph)%1;if(u<0)u+=1;c.cv.getPointAt(u,tp);c.cv.getPointAt(Math.min(1,Math.max(0,u+(c.sp>0?.003:-.003))),tq);c.m.position.copy(tp);c.m.up.copy(tp).normalize();c.m.lookAt(tq);c.hl.material.opacity=night*.8}});
 return road}

/* ---------- the earliest ages: the sea is where everything is happening ---------- */
function rqEarly(sp){const Rn=rnd(1717);const Y=V3(0,1,0);
 // 绿毯: the green carpet on the sea floor, seen through the water as drifting green
 {const cap=new THREE.Mesh(new THREE.SphereGeometry(R+.18,96,48,0,Math.PI*2,0,9*D2R),new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{uT:GT},
   vertexShader:'varying vec3 vP;varying vec2 vU;void main(){vP=position;vU=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
   fragmentShader:GLSL_NOISE+'uniform float uT;varying vec3 vP;varying vec2 vU;void main(){float d=acos(clamp(normalize(vP).y,-1.,1.))/0.157;float n=fb3(vP*.012+vec3(uT*.004,0.,uT*.003));float n2=fb3(vP*.05-vec3(uT*.01));float k=smoothstep(.4,.6,n)*(1.-smoothstep(.55,1.,d))*(.6+.4*n2);gl_FragColor=vec4(mix(vec3(.12,.42,.2),vec3(.35,.7,.3),n2),k*.45);}'}));
  cap.renderOrder=2;const g=new THREE.Group();g.add(cap);g.quaternion.setFromUnitVectors(Y,dirLL(-8,40));addE(g,[1,2]);sp._lvcap=g}
 // oxygen bubbles breaking at the surface where the first great dying began
 {const g=new THREE.Group();frameLL(sp,-6,44,0,0,g,false);g.add(emitter({n:160,life:2.4,speed:.6,spread:.2,size:.5,col:'#e8fff4',op:.6,disc:40,area:[0,.3,0],wander:.2}));addE(g,[1]);cull(g,g.position.clone(),60,1500)}
 // shoals: dark shapes turning just under the surface
 const shoals=[];for(const [la,lo] of [[-12,36],[-18,26],[-9,35],[-15,49],[-17,53],[6,8]]){const n=90,a=[];for(let i=0;i<n;i++)a.push(V3());const pts=sparkles(a,'#0a2a34',2.4,.75,.9);pts.material.blending=THREE.NormalBlending;pts.frustumCulled=false;addE(pts,[1,2]);
  const c=dirLL(la,lo);const e1=V3(0,1,0).cross(c).normalize(),e2=c.clone().cross(e1);shoals.push({pts,c,e1,e2,ph:Rn()*6,n,seed:Array.from({length:n},()=>[Rn()*6.28,Rn(),Rn()])})}
 anim(sp,null,t=>{for(const s of shoals){if(!s.pts.visible)continue;if(camera.position.distanceTo(s.c.clone().multiplyScalar(R))>900)continue;const P=s.pts.geometry.attributes.position;const cx=Math.cos(t*.05+s.ph)*14,cz=Math.sin(t*.07+s.ph)*14;
   for(let i=0;i<s.n;i++){const [a,r,h]=s.seed[i];const aa=a+t*(.4+h*.3);const x=cx+Math.cos(aa)*r*7,z=cz+Math.sin(aa)*r*7*.6;P.setXYZ(i,s.c.x*(R-.4)+s.e1.x*x+s.e2.x*z,s.c.y*(R-.4)+s.e1.y*x+s.e2.y*z,s.c.z*(R-.4)+s.e1.z*x+s.e2.z*z)}P.needsUpdate=true}});
 // dust devils over the bare first continent
 for(let i=0;i<5;i++){const la=26+Rn()*10,lo=-6+Rn()*14;if(sp.gh(la,lo)<3)continue;const g=new THREE.Group();frameLL(sp,la,lo,0,0,g);
  g.add(emitter({n:90,life:3,speed:2.4,spread:.08,size:1.6,col:'#c8a878',op:.35,area:[1.2,.4,1.2],wander:1.2,tex:typeof smokeTex!=='undefined'?smokeTex:undefined}));addE(g,[1]);cull(g,g.position.clone(),20,1200);
  const la0=la,lo0=lo,ph=Rn()*6;anim(sp,g,t=>{frameLL(sp,la0+Math.sin(t*.05+ph)*.8,lo0+Math.cos(t*.04+ph)*1.2,0,0,g)})}
 // steam over the abyss vents
 {const g=new THREE.Group();frameLL(sp,-26,36,0,0,g,false);g.add(emitter({n:60,life:6,speed:2.2,spread:.12,size:6,col:'#e8eef0',op:.25,area:[6,.5,6],wander:1,tex:typeof smokeTex!=='undefined'?smokeTex:undefined}));addE(g,[1,2,3,4,5,6,7,8,9,10,11,12]);cull(g,g.position.clone(),60,1600)}}

/* ---------- the sea of clouds, lived in ---------- */
function rqCloud(sp){const Rn=rnd(5353);const L3=148.5;
 // a control tower on the top layer, its beacon turning
 {const g=new THREE.Group();frameLL(sp,-7.2,68.4,L3,0,g,false);const mm=mt('#f0f0ec',{roughness:.6});const tw=new THREE.Mesh(new THREE.CylinderGeometry(.9,1.4,12,10),mm);tw.position.y=6;g.add(tw);
  const cab=new THREE.Mesh(new THREE.CylinderGeometry(2.4,1.8,2.2,10),mt('#cfe0ea',{metalness:.3,roughness:.2}));cab.position.y=13;g.add(cab);const rf=new THREE.Mesh(new THREE.ConeGeometry(2.6,1.6,10),mt('#8a6a5a'));rf.position.y=14.9;g.add(rf);
  const bc=new THREE.Group();bc.position.y=16;g.add(bc);const beam=new THREE.Mesh(new THREE.ConeGeometry(3,40,10,1,true),new THREE.MeshBasicMaterial({color:'#fff4c8',transparent:true,opacity:.12,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));beam.rotation.z=Math.PI/2;beam.position.x=20;bc.add(beam);bc.add(glowSprite('#fff0b0',6,.9));
  addE(g,[5]);cull(g,g.position.clone(),60,2600);anim(sp,g,t=>{bc.rotation.y=t*.6})}
 // the rail across the clouds, with little carts riding it
 {const pts=[];for(let i=0;i<=80;i++){const a=i/80*6.283;pts.push(dirLL(-8.5+Math.sin(a)*2.4,69.5+Math.cos(a)*3.2).multiplyScalar(R+L3+.6+Math.sin(a*3)*.6))}const cv=new THREE.CatmullRomCurve3(pts,true);
  const rl=new THREE.Mesh(new THREE.TubeGeometry(cv,400,.25,5,true),mt('#d8c8a0',{metalness:.4,roughness:.4}));addE(rl,[5]);cull(rl,pts[0],120,2600);
  const carts=[];for(let i=0;i<6;i++){const c=new THREE.Mesh(new THREE.BoxGeometry(1.4,1,2.2),mt('#c86a4a',{roughness:.5}));c.add(at(glowSprite('#ffe0a0',2,.7),0,.9,0));addE(c,[5]);carts.push({c,u:i/6})}
  const tp=V3(),tq=V3();anim(sp,rl,t=>carts.forEach(k=>{const u=(k.u+t*.01)%1;cv.getPointAt(u,tp);cv.getPointAt((u+.003)%1,tq);k.c.position.copy(tp).addScaledVector(tp.clone().normalize(),.7);k.c.up.copy(tp).normalize();k.c.lookAt(tq.addScaledVector(tq.clone().normalize(),.7))}))}
 // the edge of the dark cloud sea: heavy grey-violet clouds with lightning inside
 {const g=new THREE.Group();const mtl=new THREE.SpriteMaterial({map:smokeTex,color:'#5a5468',transparent:true,opacity:.62,depthWrite:false});
  for(let i=0;i<40;i++){const la=-11+(Rn()-.5)*7,lo=77+(Rn()-.5)*8;const s=new THREE.Sprite(mtl);const sz=40+Rn()*50;s.scale.set(sz,sz*.45,1);s.position.copy(dirLL(la,lo).multiplyScalar(R+128+Rn()*10));g.add(s)}
  const fl=glowSprite('#c8d0ff',90,0);fl.position.copy(dirLL(-11,77).multiplyScalar(R+132));g.add(fl);addE(g,[5]);cull(g,dirLL(-11,77).multiplyScalar(R+130),240,3200);
  let fv=0,nx=4,f2=-1;anim(sp,g,(t,dt)=>{dt=dt||.016;nx-=dt;if(nx<=0){nx=6+Math.random()*10;fv=1;f2=Math.random()<.4?.16:-1}if(f2>0){f2-=dt;if(f2<=0){fv=Math.max(fv,.6);f2=-1}}fv=Math.max(0,fv-dt*3);fl.material.opacity=fv*fv*.5})}
 // cloud-folk: puffs with two dark eyes, drifting between the layers
 {const folk=[];for(let i=0;i<14;i++){const g=new THREE.Group();const b=new THREE.Sprite(new THREE.SpriteMaterial({map:smokeTex,color:'#ffffff',transparent:true,opacity:.95,depthWrite:false}));b.scale.set(6,4.5,1);g.add(b);
   for(const x of[-.7,.7]){const e=new THREE.Mesh(new THREE.SphereGeometry(.28,8,6),new THREE.MeshBasicMaterial({color:'#2a2a3a'}));e.position.set(x,.3,1.6);g.add(e)}addE(g,[5]);folk.push({g,la:-8+(Rn()-.5)*8,lo:70+(Rn()-.5)*10,alt:118+Rn()*24,ph:Rn()*6})}
  anim(sp,null,t=>folk.forEach(k=>{if(!k.g.visible)return;const la=k.la+Math.sin(t*.02+k.ph)*1.2,lo=k.lo+Math.cos(t*.017+k.ph)*1.6;k.g.position.copy(dirLL(la,lo).multiplyScalar(R+k.alt+Math.sin(t*.5+k.ph)*1.5));k.g.lookAt(camera.position)}))}}

/* ---------- the sea floor, for when the camera comes down close to the water ---------- */
function rqSeabed(sp){const Rn=rnd(8181);const raw=sp.ghRaw||sp.gh;const Y=V3(0,1,0);
 const at=(la,lo,lift,o)=>{const d=dirLL(la,lo);o.position.copy(d).multiplyScalar(R+raw(la,lo)+(lift||0));o.quaternion.setFromUnitVectors(Y,d);return o};
 // 深渊裂口: black smokers, chimneys of crust breathing dark plumes
 {const g=new THREE.Group();const parts=[];const smokes=[];
  for(let i=0;i<14;i++){const la=-26+(Rn()-.5)*3,lo=36+(Rn()-.5)*3;if(raw(la,lo)>-4)continue;const o=at(la,lo,-.5,new THREE.Object3D());o.updateMatrix();const h=3+Rn()*6;
   parts.push([new THREE.CylinderGeometry(.4,1.4,h,7).translate(0,h/2,0).applyMatrix4(o.matrix),'#2a2420'],[new THREE.CylinderGeometry(.55,.7,.5,7).translate(0,h,0).applyMatrix4(o.matrix),'#ff6a2a']);
   const sm=new THREE.Group();at(la,lo,h-.5,sm);sm.add(emitter({n:40,life:4,speed:2.4,spread:.15,size:3.5,col:'#1a1614',op:.55,area:[.6,.2,.6],wander:.6,add:false,tex:typeof smokeTex!=='undefined'?smokeTex:undefined}));sm.add(glowSprite('#ff7a3a',4,.6));g.add(sm)}
  if(parts.length)g.add(new THREE.Mesh(mergeColored(parts),VC({roughness:.9,emissive:'#200800'})));addE(g,[1,2,3,4,5,6,7,8,9,10,11,12]);cull(g,dirLL(-26,36).multiplyScalar(R-20),80,700)}
 // 毯虫: red, flat, square carpets on the deepest floor
 {const parts=[];for(let i=0;i<26;i++){const la=-27.5+(Rn()-.5)*1.6,lo=37.5+(Rn()-.5)*1.6;const o=at(la,lo,.15,new THREE.Object3D());o.rotateY(Rn()*6);o.updateMatrix();const s=1.2+Rn()*1.6;parts.push([new THREE.BoxGeometry(s,.12,s).applyMatrix4(o.matrix),Rn()<.5?'#c8202a':'#a8141e'])}
  const m=new THREE.Mesh(mergeColored(parts),VC({roughness:.6,emissive:'#3a0408'}));addE(m,[1,2,3]);cull(m,dirLL(-27.5,37.5).multiplyScalar(R-25),40,600)}
 // 起源之海: clouds of single cells drifting just above the floor, faintly glowing
 {const n=500,im=new THREE.InstancedMesh(new THREE.SphereGeometry(.18,6,4),new THREE.MeshStandardMaterial({color:'#ffffff',emissive:'#5affc8',emissiveIntensity:.5,roughness:.4}),n);im.frustumCulled=false;const o3=new THREE.Object3D();const S=[];
  for(let i=0;i<n;i++){const la=-4+(Rn()-.5)*2.4,lo=44+(Rn()-.5)*2.4;S.push([la,lo,Rn()*3,Rn()*6,.5+Rn()*1.2]);im.setColorAt(i,C(['#c8ffe8','#ffe8c8','#e8d8ff','#d8f4ff'][i%4]))}
  addE(im,[1]);const c0=dirLL(-4,44).multiplyScalar(R);anim(sp,im,t=>{if(camera.position.distanceTo(c0)>500)return;for(let i=0;i<n;i++){const [la,lo,h,ph,s]=S[i];at(la+Math.sin(t*.05+ph)*.05,lo+Math.cos(t*.04+ph)*.05,1+h+Math.sin(t*.3+ph)*.4,o3);o3.scale.setScalar(s);o3.updateMatrix();im.setMatrixAt(i,o3.matrix)}im.instanceMatrix.needsUpdate=true})}}

/* ---------- the frozen sea glows from below; the leviathan leaves a wake ---------- */
function rqIceWake(sp){const Rn=rnd(9393);
 // light from the crystal mountain spreading under the ice: soft cyan pools on the ice that breathe slowly
 {const g=new THREE.Group();const pools=[];for(let i=0;i<22;i++){const a=Rn()*6.28,d=Math.sqrt(Rn())*6;const la=71+Math.cos(a)*d*.6+1.5,lo=34+Math.sin(a)*d/Math.cos(71*D2R)*.6-4;
   const m=new THREE.Mesh(new THREE.CircleGeometry(1,24),new THREE.MeshBasicMaterial({map:glowTex,color:'#7ae8ff',transparent:true,opacity:.3,blending:THREE.AdditiveBlending,depthWrite:false}));
   const o=new THREE.Group();frameLL(sp,la,lo,0,0,o,false);o.position.setLength(R+1.9);m.rotation.x=-Math.PI/2;m.scale.setScalar(10+Rn()*22);o.add(m);g.add(o);pools.push({m,ph:Rn()*6})}
  addE(g,[1,2,3,4,5,6,7,8,9,10,11,12]);cull(g,dirLL(72,30).multiplyScalar(R),300,2600);anim(sp,g,t=>pools.forEach(p=>{p.m.material.opacity=.18+.14*Math.sin(t*.4+p.ph)}))}
 // frost glitter over the ice-holes
 {const pts=[];for(let i=0;i<600;i++){const la=74+(Rn()-.5)*10,lo=24+(Rn()-.5)*30;pts.push(dirLL(la,lo).multiplyScalar(R+2+Rn()*3))}const s=sparkles(pts,'#f4fdff',1.3,.8,.8);addE(s,[1,2,3,4,5,6,7,8,9,10,11,12])}
 // the leviathan's wake: a trail of foam left where it has swum
 {const N=80,pos=[];for(let i=0;i<N;i++)pos.push(V3());const pts=sparkles(pos,'#ffffff',2.6,.75,.9);pts.frustumCulled=false;addE(pts,[1,2]);let h=null,last=-1,k=0;const P=pts.geometry.attributes.position;
  anim(sp,null,t=>{if(!h){h=(sp.herds||[]).find(x=>x.f.w==='lvtan_beast');if(!h)return;for(let i=0;i<N;i++){const o=h.list[0].o.position;P.setXYZ(i,o.x,o.y,o.z)}}const o=h.list[0].o;if(!o.visible||!pts.visible)return;
   if(t-last>.35){last=t;const p=o.position.clone();p.setLength(R+.35);P.setXYZ(k%N,p.x+(Math.random()-.5)*1.5,p.y+(Math.random()-.5)*1.5,p.z+(Math.random()-.5)*1.5);k++;P.needsUpdate=true}})}}

/* ---------- where Lin is, in each age: a small golden light you can click ---------- */
function rqLinMark(sp){linMark(sp,{1:[-4.4,43.6,3],2:[9.4,2.4,6],3:[-3.6,-85.6,8],4:[12.4,-87.6,8],5:[-7.6,69.2,152]})}
function linMark(sp,LP){const s=glowSprite('#ffd890',5,.85);s.userData.noBatch=1;const s2=glowSprite('#fff4d8',1.6,1);s2.userData.noBatch=1;const g=new THREE.Group();g.add(s);g.add(s2);sp.scene.add(g);
 const pos=V3();const place=()=>{const p=LP[ERA];if(!p){g.visible=false;return pos}g.visible=true;const gh=p[2]>100?0:Math.max(sp.gh(p[0],p[1]),0);pos.copy(dirLL(p[0],p[1])).multiplyScalar(R+gh+p[2]);return pos};
 anim(sp,null,t=>{g.position.copy(place());const k=.75+.25*Math.sin(t*1.6);s.material.opacity=.55*k;s.scale.setScalar(5+Math.sin(t*1.6));});
 px('lin',()=>place(),8,{e:Object.keys(LP).map(Number),hide:()=>!LP[ERA]})}
