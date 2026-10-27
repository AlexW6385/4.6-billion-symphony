/* ================================================================
   绒球's great moments, seen from afar: the set pieces the book paints over whole regions, each standing in its own
   age at the place it happened. a darkened cloud sea under the swarm and its thunder (the war of the cloud kingdoms),
   the purple locust cloud over the plague sea, the crystal volcanoes hanging in the sky and firing down on the north,
   fire falling into the first ocean, and the stones that streaked across the sky at the end of the great cold.
   everything moves on the graphics card (one uniform, the shared clock); the few flashes are a handful of sprites.
   ================================================================ */
function evSwarmMat(o){return new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:o.dark?THREE.NormalBlending:THREE.AdditiveBlending,
 uniforms:{uT:GT,uS:PSCALE,uC:{value:C(o.col)},uR:{value:V3(o.rx,o.ry,o.rz)},uK:{value:o.speed||.05},uZ:{value:o.size||3},uA:{value:o.op||.8},uM:{value:o.max||10}},
 vertexShader:`uniform float uT,uS,uK,uZ,uM;uniform vec3 uR;attribute vec3 sd;varying float vA;
  void main(){float a=sd.x*6.2832+uT*uK*(.4+sd.y);float r=.05+.95*sqrt(sd.y);
   // a ring of slow orbits that breathes in and out; each speck jitters on its own, like one body of a crowd
   vec3 p=vec3(cos(a)*r*uR.x,(sd.z-.5)*2.*uR.y*(1.-.5*r),sin(a)*r*uR.z);
   p+=vec3(sin(uT*2.1+sd.x*91.),sin(uT*1.7+sd.y*77.),cos(uT*2.3+sd.z*83.))*uR.y*.12;
   p.y+=sin(uT*.4+a*2.)*uR.y*.25;
   vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;vA=smoothstep(9000.,600.,-mv.z);gl_PointSize=clamp(uS*uZ/-mv.z,1.5,uM)*smoothstep(uZ*.6,uZ*1.6,-mv.z);}`,
 fragmentShader:'uniform vec3 uC;uniform float uA;varying float vA;void main(){vec2 c=gl_PointCoord-.5;float d=length(c);float a='+(o.soft?'exp(-d*d*14.)*step(d,.5)':'smoothstep(.5,.15,d)')+';gl_FragColor=vec4(uC,a*vA*uA);}'})}
function evPoints(n,seed,mat){const Rn=rnd(seed),p=new Float32Array(n*3),s=new Float32Array(n*3);for(let i=0;i<n*3;i++)s[i]=Rn();
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));g.setAttribute('sd',new THREE.BufferAttribute(s,3));
 const P=new THREE.Points(g,mat);P.frustumCulled=false;P.renderOrder=4;return P}
/* things falling from the sky: each speck drops along a slanted line and starts again, a short bright head */
function evFallMat(o){return new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:o.dark?THREE.NormalBlending:THREE.AdditiveBlending,
 uniforms:{uT:GT,uS:PSCALE,uC:{value:C(o.col)},uC2:{value:C(o.col2||o.col)},uR:{value:V3(o.rx,o.h,o.rz)},uK:{value:o.speed||.1},uZ:{value:o.size||6},uL:{value:V3(o.slant||0,0,0)}},
 vertexShader:`uniform float uT,uS,uK,uZ;uniform vec3 uR,uL;attribute vec3 sd;varying float vA;varying float vH;
  void main(){float f=fract(uT*uK*(.6+sd.z*.8)+sd.x*7.);
   vec3 p=vec3((sd.x-.5)*2.*uR.x,uR.y*(1.-f),(sd.y-.5)*2.*uR.z)+uL*uR.y*(f-.5);
   vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;vH=f;
   vA=smoothstep(0.,.08,f)*smoothstep(1.,.9,f)*step(.35,fract(sd.z*13.+floor(uT*uK*(.6+sd.z*.8)+sd.x*7.)*.37))*smoothstep(12000.,800.,-mv.z);
   gl_PointSize=clamp(uS*uZ/-mv.z,1.5,14.);}`,
 fragmentShader:'uniform vec3 uC,uC2;varying float vA;varying float vH;void main(){vec2 c=gl_PointCoord-.5;float a=smoothstep(.5,.0,length(c));'+(o.dark?'gl_FragColor=vec4(mix(uC,uC2,vH),smoothstep(.5,.3,length(c))*vA);}':'gl_FragColor=vec4(mix(uC,uC2,vH)*a*vA*1.4,1.);}')})}
/* 尔什's sky cracks (age 10): out of the frozen space behind them, mud and explosives fall onto the city below */
function erEvents(sp,g,pts){const f=new THREE.Group();f.position.copy(pts[8]);f.position.y-=150;g.add(f);
 f.add(evPoints(320,861,evFallMat({dark:1,col:'#6a5440',col2:'#3a2c20',rx:16,h:150,rz:5,speed:.16,size:6})));
 evFlashes(sp,f,3,30,[40,6,12],'#ffa040',862)}
/* a few flashes inside a cloud: each sprite waits, then blinks twice */
function evFlashes(sp,g,n,sz,box,col,seed){const Rn=rnd(seed),F=[];for(let i=0;i<n;i++){const s=glowSprite(col,sz,0);s.position.set((Rn()-.5)*box[0],(Rn()-.3)*box[1],(Rn()-.5)*box[2]);g.add(s);F.push({s,t:Rn()*6})}
 anim(sp,g,(t,dt)=>{for(const f of F){f.t-=dt;if(f.t<-.5){f.t=2+Math.random()*7;f.s.position.set((Math.random()-.5)*box[0],(Math.random()-.3)*box[1],(Math.random()-.5)*box[2])}
  const k=f.t<0?-f.t:0;f.s.material.opacity=k>0?(k<.08||(k>.16&&k<.26)?.85:.12*(1-k*2)):0}})}
function rqEvents(sp){
 // the war of the cloud kingdoms (age 5): the swarm darkens the cloud sea, thunder out of a clear sky
 {const g=new THREE.Group();frameLL(sp,-10,79,175,0,g,false);
  g.add(evPoints(7000,811,evSwarmMat({dark:1,col:'#17121a',rx:240,ry:34,rz:170,speed:.04,size:9,op:.7})));
  evFlashes(sp,g,6,90,[360,50,260],'#d8e6ff',812);addE(g,[5]);cull(g,g.position.clone(),300,7000)}
 // the plague locusts (age 3): a purple cloud low over the sea that hides the sun
 {const g=new THREE.Group();frameLL(sp,20,-48,55,0,g,false);
  g.add(evPoints(6000,821,evSwarmMat({dark:1,col:'#3c2148',rx:200,ry:26,rz:150,speed:.06,size:8,op:.7})));addE(g,[3]);cull(g,g.position.clone(),260,6000)}
 // the crystal invasion (age 8): seventeen crystal volcanoes hang high over the north and fire beams down at the cities
 {const g=new THREE.Group();frameLL(sp,30,-6,0,0,g);const Rn=rnd(831);
  const cm=new THREE.MeshStandardMaterial({color:'#c0283a',emissive:'#701020',emissiveIntensity:.8,roughness:.25,metalness:.2,flatShading:true});
  // the seventeen crystals are one instanced draw; a beam is drawn only while it fires
  const im=new THREE.InstancedMesh(new THREE.OctahedronGeometry(1,0),cm,17);im.frustumCulled=false;im.userData.noShadow=1;g.add(im);const o=new THREE.Object3D(),bm=[];
  for(let i=0;i<17;i++){const a=i/17*6.283+Rn()*.25,r=60+Rn()*110,h=230+Rn()*70;o.position.set(Math.cos(a)*r,h,Math.sin(a)*r);o.scale.set(9+Rn()*5,22+Rn()*10,9+Rn()*5);o.updateMatrix();im.setMatrixAt(i,o.matrix);
   const bmat=new THREE.MeshBasicMaterial({color:'#ff6a7a',transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false});
   const b=new THREE.Mesh(new THREE.CylinderGeometry(1.6,3.2,h,6,1,true),bmat);b.position.set(o.position.x,h/2,o.position.z);b.visible=false;g.add(b);bm.push([b,Rn()*6.283,.25+Rn()*.3])}
  anim(sp,g,t=>{for(const [b,ph,k] of bm){const s=Math.sin(t*k+ph);b.visible=s>.93;if(b.visible)b.material.opacity=(s-.93)*9}});
  addE(g,[8]);cull(g,g.position.clone().add(dirLL(30,-6).multiplyScalar(250)),300,7000)}
 // the second great extinction (age 1): fire raining into the first ocean
 {const g=new THREE.Group();frameLL(sp,2,4,0,0,g,false);
  g.add(evPoints(900,841,evFallMat({col:'#ffe0a0',col2:'#ff5010',rx:260,h:420,rz:260,speed:.12,size:9,slant:.5})));
  evFlashes(sp,g,5,70,[480,4,480],'#ff9040',842);addE(g,[1]);cull(g,g.position.clone(),400,8000)}
 // the end of the great cold (age 4): stones streak across the red evening sky over the ice
 {const g=new THREE.Group();frameLL(sp,10,-80,0,.6,g,false);
  g.add(evPoints(160,851,evFallMat({col:'#fff2c0',col2:'#ff7030',rx:380,h:520,rz:300,speed:.05,size:10,slant:1.6})));addE(g,[4]);cull(g,g.position.clone(),500,9000)}
 // the last act of the Inca war (age 2): bursts light the night over the desert like fireworks
 {const g=new THREE.Group();frameLL(sp,22,-9,0,0,g,false);
  evFlashes(sp,g,5,60,[260,90,200],'#ffc070',881);evFlashes(sp,g,4,45,[260,90,200],'#a0c8ff',882);g.children.forEach(s=>s.position.y+=200);addE(g,[2]);cull(g,g.position.clone(),300,6000)}
 // the 虚民 invasion (age 5): 绒球 floaters burst and their needle-fluff comes down like snow over the north
 {const g=new THREE.Group();frameLL(sp,40,-14,0,0,g,false);
  g.add(evPoints(1200,891,evFallMat({dark:1,col:'#fff8ec',col2:'#e8e0d4',rx:180,h:260,rz:180,speed:.03,size:4,slant:.15})));addE(g,[5]);cull(g,g.position.clone(),300,5000)}
 // the waking creator's storm (age 3): a made storm turns over its roots, lightning striking again and again
 {const g=new THREE.Group();frameLL(sp,6,-84,120,0,g,false);
  g.add(evPoints(1000,901,evSwarmMat({dark:1,soft:1,col:'#4a4e5a',rx:150,ry:22,rz:150,speed:.09,size:52,op:.55,max:70})));
  evFlashes(sp,g,7,80,[240,40,240],'#e0eaff',902);addE(g,[3]);cull(g,g.position.clone(),200,6000)}
 // the eastern desert (age 5): a sandstorm that hides the sun, the dust-demons hunting inside it
 {const g=new THREE.Group();frameLL(sp,-18,76,30,0,g,false);
  g.add(evPoints(900,911,evSwarmMat({dark:1,soft:1,col:'#b89868',rx:200,ry:30,rz:160,speed:.05,size:60,op:.36,max:80})));addE(g,[5]);cull(g,g.position.clone(),260,6000)}
 // the scorpion city's breeding season (age 3): red butterflies giving light over the city
 {const g=new THREE.Group();frameLL(sp,-12.6,-78.4,40,0,g,false);
  g.add(evPoints(700,921,evSwarmMat({col:'#ff5848',rx:60,ry:18,rz:60,speed:.12,size:2.5,op:.9})));addE(g,[3]);cull(g,g.position.clone(),100,3000)}
}
/* the void in age 6: the black-metal cube armada closing on the 虚民 home system, flashing as it fires, and the long
   light-ship's beams answering it */
function voidArmada(sp){if(!SECTORS[6])return;const c=V3(...SECTORS[6].c),Rn=rnd(991);const g=new THREE.Group();g.position.copy(c).add(V3(300,50,330));
 const im=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({color:'#121418',metalness:.8,roughness:.35,emissive:'#04141c',emissiveIntensity:.4}),70);
 const o=new THREE.Object3D();for(let i=0;i<70;i++){o.position.set((Rn()-.5)*160,(Rn()-.5)*60,(Rn()-.5)*160);o.rotation.set(Rn()*.3,Rn()*6.28,Rn()*.3);o.scale.setScalar(4+Rn()*Rn()*14);o.updateMatrix();im.setMatrixAt(i,o.matrix)}
 im.frustumCulled=false;g.add(im);evFlashes(sp,g,6,30,[160,60,160],'#8ae4ff',992);
 // the beams: from the light-ship toward the armada, each firing for a moment
 const w=W.v_chuanxing,from=w?V3(...w.p).add(c):c.clone().add(V3(120,40,180)),to=g.position,d=to.clone().sub(from),L=d.length(),B=[];
 for(let i=0;i<3;i++){const b=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,L,6,1,true),new THREE.MeshBasicMaterial({color:'#fff2c8',transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));
  b.position.copy(from).addScaledVector(d,.5).add(V3((Rn()-.5)*30,(Rn()-.5)*20,(Rn()-.5)*30));b.quaternion.setFromUnitVectors(V3(0,1,0),d.clone().normalize());b.visible=false;sp.scene.add(b);addTo(sp,b,[6]);B.push([b,Rn()*6.28,.3+Rn()*.2])}
 const p0=g.position.clone(),dir=c.clone().sub(p0).normalize();
 anim(sp,g,t=>{g.position.copy(p0).addScaledVector(dir,Math.sin(t*.03)*60);for(const [b,ph,k] of B){const s=Math.sin(t*k+ph);b.visible=s>.94;if(b.visible)b.material.opacity=(s-.94)*12}});
 addTo(sp,g,[6])}
