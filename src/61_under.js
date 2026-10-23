/* ================================================================
   地下世界: the great cave under the endless desert, as its own space (a tube you stand inside).
   the floor is fern-wood jungle, then cracked rock and the wall of death-spikes; the roof is
   dusted with green light like a galaxy; home trees three hundred metres tall hold it up.
   ================================================================ */
TUBE_R.under=520;
function buildUnder(){const id='under';const sc=new THREE.Scene();const sp=newSpace(id,'tube',sc);const Rt=TUBE_R.under;sp.Rt=Rt;const Rn=rnd(777);
 const z0=-700,z1=4800;sp.zr=[z0+500,z1-250];sp.zc=[z0+30,z1-30];const L=z1-z0;
 // zones along the cave
 const zone=z=>({fern:sm(400,700,z)*(1-sm(1700,2000,z)),rock:sm(1900,2200,z)*(1-sm(3300,3500,z)),tree:sm(3300,3500,z)});
 const floorK=a=>sm(-.15,-.7,Math.cos(a));// 1 on the floor (a measured from the floor... see below)
 const wallD=(z,a)=>{const c=Math.cos(a);const fl=sm(.2,.75,c),ce=sm(.1,.7,-c);const n=fbm(Math.cos(a)*3+z/380,Math.sin(a)*3,z/650,4);const n2=fbm(Math.cos(a)*9+z/90,Math.sin(a)*9,z/120,3);const zn=zone(z);
  let d=n*60+(1-fl)*(1-ce)*90*n;// rough walls, bulging
  d+=fl*(18+n2*14+zn.rock*Math.pow(n2,3)*30);// floor: gentle hills, rockier in the dry zone
  d+=ce*Math.pow(fbm(Math.cos(a)*14+z/40,Math.sin(a)*14,z/50,2),4)*80;// roof: knobs and drips
  d-=fxG_udTrench(z,a)*64;// the lava rift (49i_fixG)
  return d};
 sp.wallD=(z,a)=>wallD(z,a*D2R);sp.wallR=sp.wallD;
 const geo=new THREE.CylinderGeometry(Rt,Rt,L,150,Math.round(L/24),true);geo.rotateX(Math.PI/2);geo.rotateZ(Math.PI);geo.translate(0,0,(z0+z1)/2);
 const p=geo.attributes.position,cs=[];const col=new THREE.Color();
 for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);const a=Math.atan2(-x,-y);// a=0 at the floor (y=-Rt), same sense as tubePt
  const d=wallD(z,a);const r=Rt-d;p.setX(i,x/Rt*r);p.setY(i,y/Rt*r);const c=Math.cos(a);const fl=sm(.2,.75,c),ce=sm(.1,.7,-c);const zn=zone(z);const n=fbm(x*.01+z*.004,y*.01,z*.006,3);
  col.set('#2a2622').lerp(C('#3e362c'),n).lerp(C('#14120f'),ce*.8);
  col.lerp(C('#3a4a2a').lerp(C('#2a3a22'),n),fl*zn.fern*.9);col.lerp(C('#5a4a38').lerp(C('#7a6650'),n),fl*zn.rock*.9);col.lerp(C('#3a3426'),fl*zn.tree*.7);col.lerp(C('#15120f'),fxG_udTrench(z,a));
  cs.push(col.r,col.g,col.b)}
 geo.setAttribute('color',new THREE.Float32BufferAttribute(cs,3));geo.computeVertexNormals();
 {const P2=geo.attributes.position,Nn=geo.attributes.normal,mp=new Map();for(let i=0;i<P2.count;i++){const k=Math.round(P2.getX(i)*10)+','+Math.round(P2.getY(i)*10)+','+Math.round(P2.getZ(i)*10);let L2=mp.get(k);if(!L2)mp.set(k,L2=[]);L2.push(i)}for(const L2 of mp.values()){if(L2.length<2)continue;const v=V3(0,0,0);L2.forEach(i=>v.add(V3(Nn.getX(i),Nn.getY(i),Nn.getZ(i))));v.normalize();L2.forEach(i=>Nn.setXYZ(i,v.x,v.y,v.z))}}
 sc.add(new THREE.Mesh(geo,detailMat(new THREE.MeshStandardMaterial({vertexColors:true,side:THREE.BackSide,roughness:.94}),{bump:1.6,freq:.5,mott:.9})));
 // a point on the wall: z along the cave, a from the floor (radians), lifted h off it
 const wp=(z,a,h)=>{const r=Rt-wallD(z,a)-(h||0);return V3(-Math.sin(a)*r,-Math.cos(a)*r,z)};const upAt=a=>V3(Math.sin(a),Math.cos(a),0);
 // light: no sun, only the roof's glow and what lives here
 sc.background=C('#030706');sc.fog=new THREE.FogExp2(0x06100e,.00026);sc.environment=makeEnv('#2a4a3e','#141e1a','#0a0806');
 sc.add(new THREE.HemisphereLight(0xc8f0dc,0x3a2a1a,.5));const dl=new THREE.DirectionalLight(0xd8ffe8,.32);dl.position.set(.2,1,.3);sc.add(dl);sc.add(new THREE.AmbientLight(0x2e3632,.45));
 for(let z=z0+400;z<z1;z+=700){const l=new THREE.PointLight(0x8affc0,.7,900);l.position.set(0,Rt*.55,z);sc.add(l)}
 // the roof galaxy: green dust thick in a winding band, thinner elsewhere
 {const pts=[],pts2=[];for(let i=0;i<16000;i++){const z=z0+Math.random()*L;const band=Math.sin(z/700)*.7;let a=Math.PI+(Math.random()-.5)*2.6;const k=Math.exp(-Math.pow((a-Math.PI-band)*2.2,2));if(Math.random()>.25+k*.75)continue;(Math.random()<.12?pts2:pts).push(wp(z,a,2))}
  sc.add(sparkles(pts,'#7fffb0',7,1,.7));sc.add(sparkles(pts2,'#e0fff4',12,1,.9));
  for(let i=0;i<90;i++){const z=z0+Math.random()*L,a=Math.PI+(Math.random()-.5)*1.6;const g=glowSprite('#4aff9a',90+Math.random()*160,.16);g.position.copy(wp(z,a,10));sc.add(g)}}
 // stalactites from the roof, rock columns where the drips have met the floor
 {const n=900,im=new THREE.InstancedMesh(mergeColored([[new THREE.ConeGeometry(1,1,6,3),'#4a4238']]),detailMat(VC({roughness:.85}),{bump:.8}),n);const o=new THREE.Object3D();
  for(let i=0;i<n;i++){const z=z0+Math.random()*L,a=Math.PI+(Math.random()-.5)*2.2;const s=3+Math.pow(Math.random(),2)*16;o.position.copy(wp(z,a,-2));o.quaternion.setFromUnitVectors(V3(0,1,0),upAt(a).negate());o.scale.set(s*.35,s*(2.5+Math.random()*3),s*.35);o.translateY(o.scale.y*.5);o.rotateX(Math.PI);o.updateMatrix();im.setMatrixAt(i,o.matrix)}
  im.frustumCulled=false;sc.add(im)}
 // fern-wood jungle: tree ferns with arching fronds, glowing fungus at their feet
 {const fern=G([[kcy(.35,.55,9,7),'#4a3a28',{p:[0,4.5,0]}],...Array.from({length:11},(_,i)=>{const a=i/11*6.283,t=(i%2)*.25;return[tg(new THREE.ConeGeometry(.5,6.5,3),{s:[1,1,.18]}),i%3?'#3f7a3a':'#5a9a44',{p:[Math.cos(a)*2.6,9.2-t,Math.sin(a)*2.6],r:[Math.sin(a)*(1.2+t),0,-Math.cos(a)*(1.2+t)]}]}),[ki(.6,1),'#3a5a2a',{p:[0,9.3,0]}]]);
  const pts=[];for(let i=0;i<5000&&pts.length<1500;i++){const z=z0+Math.random()*L;const zn=zone(z);if(Math.random()>zn.fern*.95+zn.tree*.25)continue;const a=(Math.random()-.5)*2.1;pts.push([z,a,.6+Math.random()*1.1])}
  const im=new THREE.InstancedMesh(fern,swayMat({roughness:.85},.003),pts.length);im.userData.pick='ud_fern';const o=new THREE.Object3D();pts.forEach((q,i)=>{o.position.copy(wp(q[0],q[1],-1));o.quaternion.setFromUnitVectors(V3(0,1,0),upAt(q[1]));o.rotateY(q[2]*9);o.scale.setScalar(q[2]*2.6);o.updateMatrix();im.setMatrixAt(i,o.matrix);
   const c=C('#ffffff').offsetHSL((q[2]-1)*.05,0,(q[2]-1)*.15);im.setColorAt(i,c)});im.frustumCulled=false;sc.add(im);
  const gl=[];for(let i=0;i<5000;i++){const z=z0+Math.random()*L;if(Math.random()>zone(z).fern+zone(z).tree*.4)continue;gl.push(wp(z,(Math.random()-.5)*2.2,1.2))}sc.add(sparkles(gl,'#5affd8',3.2,1,.5))}
 // the dry stretch: boulders and a web of cracks across the floor
 {const n=700,im=new THREE.InstancedMesh(mergeColored([[new THREE.DodecahedronGeometry(1,0),'#ffffff']]),detailMat(VC({roughness:.95,flatShading:true}),{bump:.8}),n);const o=new THREE.Object3D();let k=0;
  for(let i=0;i<4000&&k<n;i++){const z=z0+Math.random()*L;if(Math.random()>zone(z).rock+.08)continue;const a=(Math.random()-.5)*2.4;const s=2+Math.pow(Math.random(),2)*16;o.position.copy(wp(z,a,s*.2));o.quaternion.setFromUnitVectors(V3(0,1,0),upAt(a));o.rotateY(Math.random()*6);o.scale.set(s,s*.6,s*.9);o.updateMatrix();im.setMatrixAt(k,o.matrix);im.setColorAt(k,C(Math.random()<.5?'#8a7a62':'#6a5e4c'));k++}
  im.count=k;im.frustumCulled=false;sc.add(im);
  const cr=[];for(let j=0;j<160;j++){let z=1950+Math.random()*1350,a=(Math.random()-.5)*1.8;let pp=wp(z,a,.6);for(let s=0;s<10;s++){z+=(Math.random()-.5)*60;a+=(Math.random()-.5)*.12;const q=wp(z,a,.6);cr.push(pp,q);pp=q}}
  sc.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(cr),new THREE.LineBasicMaterial({color:'#120e0a'})))}
 // fossils brought back to life: a great skeleton on the floor, green light in its bones, a swarm working over it
 {const g=new THREE.Group();const bm=new THREE.MeshStandardMaterial({color:'#e4dcc4',roughness:.6,emissive:'#3aff8a',emissiveIntensity:.12});const sp2=[];for(let i=0;i<=16;i++){const t=i/16;sp2.push(V3(-60+t*120,10+Math.sin(t*Math.PI)*18,Math.sin(t*5)*4))}
  g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(sp2),60,2.2,8),bm));for(let i=0;i<14;i++){const t=.2+i/14*.55;const c=new THREE.CatmullRomCurve3(sp2).getPoint(t);const r=new THREE.Mesh(new THREE.TorusGeometry(14-Math.abs(i-6)*.8,1,6,18,Math.PI),bm);r.position.copy(c);r.position.y-=1;r.rotation.set(0,Math.PI/2,Math.PI);g.add(r)}
  const sk=new THREE.Mesh(sgeo(12),bm);sk.position.set(66,14,0);sk.scale.set(14,9,8);g.add(sk);for(const s of[-1,1]){const e=new THREE.Mesh(sgeo(8),GL('#7fffb0'));e.position.set(74,17,s*5);e.scale.setScalar(1.8);g.add(e)}
  for(const [x,s] of[[30,1],[30,-1],[-30,1],[-30,-1]]){g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V3(x,10,s*4),V3(x+6,3,s*14),V3(x+2,-6,s*20)]),12,1.6,6),bm))}
  g.add(emitter({n:220,life:4,speed:3,spread:1.6,size:2.2,dir:[0,1,0],col:'#ffcf60',col2:'#ff7a20',op:.8,area:[140,30,40],wander:3}));g.add(at(glowSprite('#5aff9a',220,.25),0,20,0));
  const bp=wp(1800,-.25,-2);g.position.copy(bp);g.quaternion.setFromUnitVectors(V3(0,1,0),upAt(-.25));g.rotateY(Math.PI/2);sc.add(g);const l=new THREE.PointLight(0x7fffb0,1.4,500);l.position.copy(wp(1800,-.25,60));sc.add(l)}
 // the wall of death-spikes, grown right across the cave
 {const n=2600;const spk=mergeColored([[new THREE.ConeGeometry(1,1,5),'#6a3a30'],[tg(new THREE.ConeGeometry(.4,.4,5),{p:[0,.55,0]}),'#e8dcc0']]);const im=new THREE.InstancedMesh(spk,detailMat(VC({roughness:.6}),{bump:.4}),n);const o=new THREE.Object3D();
  for(let i=0;i<n;i++){const z=2860+(Math.random()-.5)*80+Math.sin(i)*10;const a=(Math.random()-.5)*2.9;const s=4+Math.pow(Math.random(),1.5)*20;const hgt=s*(4+Math.random()*4)*(1-Math.abs(a)/2.2*.4);
   o.position.copy(wp(z,a,-1));o.quaternion.setFromUnitVectors(V3(0,1,0),upAt(a));o.rotateX((Math.random()-.5)*.6-.25);o.rotateZ((Math.random()-.5)*.4);o.scale.set(s*.3,hgt,s*.3);o.translateY(hgt*.48);o.updateMatrix();im.setMatrixAt(i,o.matrix);im.setColorAt(i,C('#ffffff').offsetHSL(0,0,(Math.random()-.5)*.25))}
  im.frustumCulled=false;im.userData.pick='ud_spikes';sc.add(im);const red=[];for(let i=0;i<500;i++)red.push(wp(2860+(Math.random()-.5)*90,(Math.random()-.5)*2.8,10+Math.random()*120));sc.add(sparkles(red,'#ff6a4a',4,.9,.6))}
 // home trees, three hundred metres and more, from the floor into the roof
 const trees=[[3500,-120],[3800,140],[4100,-30],[4400,110],[3650,40],[2200,140],[2620,-170],[3300,200]];// the last three stand in the dry rock land
 trees.forEach(([z,x],k)=>{const yb=-Math.sqrt(Rt*Rt-x*x)+wallD(z,Math.atan2(-x,Math.sqrt(Rt*Rt-x*x)))-8,yt=-yb-30;const H=yt-yb;const g=new THREE.Group();g.userData.pick='ud_tree';
  const parts=[trunkGeo({h:H,r:[[0,46],[.05,30],[.2,24],[.5,22],[.8,26],[.95,34],[1,48]],ridges:16,twist:1.4,amp:.2,seg:40,rings:44,col:'#5a4a38',col2:'#241a12',moss:'#3a5a32',mossT:.25,ph:k})];
  for(let i=0;i<10;i++){const a=i/10*Math.PI*2+k;const ca=Math.cos(a),sa=Math.sin(a),Lr=50+Rn()*40;parts.push(loftGeo([[ca*20,24,sa*20,16,6],[ca*(30+Lr*.3),10,sa*(30+Lr*.3),11,4],[ca*(30+Lr*.7),2,sa*(30+Lr*.7),5,2.4],[ca*(30+Lr),-4,sa*(30+Lr),1.5,1.2]],{n:24,r:10,back:'#5e4c3a',belly:'#2a2016'}));
   parts.push(loftGeo([[ca*24,H-26,sa*24,14,6],[ca*(36+Lr*.3),H-10,sa*(36+Lr*.3),10,4],[ca*(36+Lr*.8),H-1,sa*(36+Lr*.8),4,2],[ca*(36+Lr),H+6,sa*(36+Lr),1.2,1]],{n:24,r:10,back:'#4e3e2e',belly:'#2a2016'}))}
  g.add(new THREE.Mesh(mergeKeep(parts),detailMat(VC({roughness:.95}),{bump:1.2,freq:.6})));
  // the swarm's lights in the hollows of the trunk
  const lt=[];for(let i=0;i<160;i++){const a=Math.random()*6.283,y=20+Math.random()*(H-40);lt.push(V3(Math.cos(a)*26,y,Math.sin(a)*26))}g.add(sparkles(lt,'#ffcf70',6,1,.7));
  g.position.set(x,yb,z);sc.add(g);const l=new THREE.PointLight(0xffc070,1.2,420);l.position.set(x+40,yb+60,z);sc.add(l)});
 // glowing fungus everywhere the floor is damp, and a low mist lying over it
 {const mush=G([[kcy(.18,.25,1.6,6),'#d8e8d8',{p:[0,.8,0]}],[tg(new THREE.SphereGeometry(1,10,5,0,6.283,0,1.6),{s:[1,.55,1]}),'#ffffff',{p:[0,1.6,0]}]]);const n=1400;
  const im=new THREE.InstancedMesh(mush,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.5,emissive:'#3affc8',emissiveIntensity:.55}),n);const o=new THREE.Object3D();let k=0;
  for(let i=0;i<6000&&k<n;i++){const z=z0+200+Math.random()*(L-400);const zn=zone(z);if(Math.random()>.2+zn.fern*.6+zn.tree*.3)continue;const a=(Math.random()-.5)*2.3;const c0=wp(z,a,-.3);const m=1+(Math.random()*5|0);
   for(let j=0;j<m&&k<n;j++){const q=c0.clone().add(V3((Math.random()-.5)*8,0,(Math.random()-.5)*8));o.position.copy(q);o.quaternion.setFromUnitVectors(V3(0,1,0),upAt(a));o.scale.setScalar(1.2+Math.random()*3.5);o.updateMatrix();im.setMatrixAt(k,o.matrix);im.setColorAt(k,C(['#7fffd8','#9fffa0','#6ad8ff','#c8ff8a'][(Math.random()*4)|0]));k++}}
  im.count=k;im.frustumCulled=false;sc.add(im);
  const mm=new THREE.SpriteMaterial({map:smokeTex,color:'#7a9a8a',transparent:true,opacity:.22,depthWrite:false});for(let i=0;i<90;i++){const z=z0+Math.random()*L,a=(Math.random()-.5)*1.6;const sp3=new THREE.Sprite(mm);const sz=140+Math.random()*160;sp3.scale.set(sz,sz*.35,1);sp3.position.copy(wp(z,a,14));sc.add(sp3)}}
 // the cave's two ends: rock walls bulging inward, so it never opens onto nothing
 for(const [zz,dir] of[[z0+10,1],[z1-10,-1]]){const cg=new THREE.SphereGeometry(Rt*1.02,48,24,0,Math.PI*2,0,Math.PI/2);const pp=cg.attributes.position;for(let i=0;i<pp.count;i++){const v=V3(pp.getX(i),pp.getY(i),pp.getZ(i));const n=fbm(v.x*.01,v.y*.01,v.z*.01+zz,4);v.multiplyScalar(1-n*.25);v.y*=.45;pp.setXYZ(i,v.x,v.y,v.z)}cg.computeVertexNormals();
  const cap=new THREE.Mesh(cg,detailMat(new THREE.MeshStandardMaterial({color:'#2a2420',roughness:.95,side:THREE.DoubleSide}),{bump:1.4,freq:.5}));cap.rotation.x=dir>0?Math.PI/2:-Math.PI/2;cap.position.z=zz;sc.add(cap)}
 // spores and dust hanging in the dark
 {const d=[];for(let i=0;i<4000;i++){const z=z0+Math.random()*L,a=Math.random()*6.283,r=Math.random()*Rt*.85;d.push(V3(Math.sin(a)*r,-Math.cos(a)*r,z))}sc.add(sparkles(d,'#a8ffd0',3,.5,.5))}
 sc.add(emitter({n:500,life:12,speed:.8,spread:1.4,size:4,dir:[0,1,0],col:'#9fffc8',op:.5,area:[700,500,L],wander:4}));
 // glowing drips: drops of lit water fall from the roof one by one, each leaving a short fading trail
 {const N=420,P=[],A=[],B=[];for(let i=0;i<N;i++){const z=z0+Math.random()*L,x=(Math.random()-.5)*Rt*.9;const at=Math.atan2(-x,-Rt*.6);const top=wp(z,Math.PI+Math.asin(Math.max(-1,Math.min(1,x/Rt))),4),bot=wp(z,-Math.asin(Math.max(-1,Math.min(1,x/Rt))),2);P.push(top.x,top.y,z);A.push(Math.random(),.08+Math.random()*.1);B.push(bot.y)}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('ph',new THREE.Float32BufferAttribute(A,2));g.setAttribute('by',new THREE.Float32BufferAttribute(B,1));
  const m=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{uT:GT,uS:PSCALE},
   vertexShader:'uniform float uT,uS;attribute vec2 ph;attribute float by;varying float vA;void main(){float k=fract(uT*ph.y+ph.x);float f=k*k;vec3 p=position;p.y=mix(position.y,by,f);vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;float d=-mv.z;vA=smoothstep(0.,.08,k)*(1.-smoothstep(.85,1.,k))*(1.-smoothstep(500.,1100.,d));gl_PointSize=clamp(uS*4./d,1.5,6.);}',
   fragmentShader:'varying float vA;void main(){vec2 c=gl_PointCoord-.5;c.y*=.55;float a=smoothstep(.5,.0,length(c));gl_FragColor=vec4(vec3(.55,1.,.8)*a*vA,1.);}'});
  const pts=new THREE.Points(g,m);pts.frustumCulled=false;pts.renderOrder=3;sc.add(pts)}
 fxG_underRift(sp,sc,wp,upAt,Rt);
 placeEntries(sp);
 const eras=eraCentroids(sp,w=>w.z);sp.eraAt=()=>2;
 return sp}
BUILDERS.under=buildUnder;
