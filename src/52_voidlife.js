/* ---------- the void, lived in: rubble belts, bus lanes, comets, cracks ---------- */
function voidLife(sp){const sc=sp.scene;const Rn=rnd(4242);const ids=Object.keys(SECTORS).map(Number);
 // a slow belt of rubble round every sector
 const rockG=lumpRock(1,11);
 ids.forEach(s=>{const c=V3(...SECTORS[s].c);const tint=C(SECCOL[s]).lerp(C('#6a6a70'),.75);const n=s===12?420:240;
  const im=new THREE.InstancedMesh(rockG,new THREE.MeshStandardMaterial({color:'#ffffff',roughness:.95,flatShading:true,emissive:SECCOL[s],emissiveIntensity:.06}),n);const o=new THREE.Object3D();
  const r0=s===12?380:560,r1=s===12?900:700;for(let i=0;i<n;i++){const a=Rn()*6.28,d=r0+(r1-r0)*Rn();o.position.set(Math.cos(a)*d,(Rn()-.5)*40,Math.sin(a)*d);o.rotation.set(Rn()*3,Rn()*3,Rn()*3);const z=3+Rn()*Rn()*16;o.scale.set(z,z*(.6+Rn()*.5),z*(.7+Rn()*.4));o.updateMatrix();im.setMatrixAt(i,o.matrix);im.setColorAt(i,tint.clone().multiplyScalar(.6+Rn()*.6))}
  const g=new THREE.Group();g.add(im);g.position.copy(c).add(V3(0,-60,0));g.rotation.set((Rn()-.5)*.5,Rn()*3,(Rn()-.5)*.5);sc.add(g);const sp0=.004+Rn()*.004;anim(sp,g,(t)=>{im.rotation.y=t*sp0})});
 // star buses running between the worlds of the bus sectors
 const BUSS=[6,7,9];const busG=new THREE.Group();sc.add(busG);const buses=[];
 for(const s of BUSS){const ws=WIKI.filter(w=>mapOf(w)==='void'&&w.e&&w.e.includes(s)).map(posOf).filter(Boolean);if(ws.length<2)continue;
  for(let k=0;k<5;k++){const a=ws[(Rn()*ws.length)|0],b=ws[(Rn()*ws.length)|0];if(a.distanceTo(b)<200)continue;const mid=a.clone().lerp(b,.5).add(V3((Rn()-.5)*300,120+Rn()*200,(Rn()-.5)*300));
   const cv=new THREE.QuadraticBezierCurve3(a.clone(),mid,b.clone());const lane=sparkles(cv.getPoints(80),'#9fd8ff',4,.35,.4);sc.add(lane);
   for(let j=0;j<2;j++){const bus=new THREE.Group();const body=new THREE.Mesh(new THREE.CylinderGeometry(3,3,18,10),new THREE.MeshStandardMaterial({color:'#c8d0d8',metalness:.6,roughness:.35,emissive:'#3a6a8a',emissiveIntensity:.3}));body.rotation.z=Math.PI/2;bus.add(body);
    const win=new THREE.Mesh(new THREE.BoxGeometry(14,1.4,6.4),new THREE.MeshBasicMaterial({color:'#ffe8a0'}));bus.add(win);bus.add(glowSprite('#bfe8ff',40,.5));busG.add(bus);buses.push({bus,cv,ph:j*.5+Rn()*.3,sp:.012+Rn()*.01,dir:Rn()<.5?1:-1})}}}
 const tp=V3(),tq=V3();
 // comets, crossing slowly with long pale tails
 const comets=[];for(let i=0;i<7;i++){const g=new THREE.Group();g.add(glowSprite('#e8f4ff',60,.9));const tail=new THREE.Mesh(new THREE.ConeGeometry(14,520,10,1,true),new THREE.MeshBasicMaterial({color:'#9ac8ff',transparent:true,opacity:.16,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));tail.rotation.x=Math.PI/2;tail.position.z=260;g.add(tail);sc.add(g);
  const a=V3((Rn()-.5)*9000,(Rn()-.5)*1400+300,(Rn()-.5)*9000),b=V3((Rn()-.5)*9000,(Rn()-.5)*1400+300,(Rn()-.5)*9000);comets.push({g,a,b,ph:Rn(),sp:.004+Rn()*.004})}
 // the broken void: bright cracks hanging in the dark
 {const c=V3(...SECTORS[12].c);const pos=[];for(let k=0;k<9;k++){let p=c.clone().add(V3((Rn()-.5)*700,(Rn()-.5)*300,(Rn()-.5)*700));const d=V3(Rn()-.5,(Rn()-.5)*.6,Rn()-.5).normalize();for(let i=0;i<14;i++){const q=p.clone().addScaledVector(d,30+Rn()*50).add(V3((Rn()-.5)*30,(Rn()-.5)*30,(Rn()-.5)*30));pos.push(p.x,p.y,p.z,q.x,q.y,q.z);
   if(Rn()<.25){const br=q.clone().add(V3((Rn()-.5)*80,(Rn()-.5)*40,(Rn()-.5)*80));pos.push(q.x,q.y,q.z,br.x,br.y,br.z)}p=q}}
  const lg=new THREE.BufferGeometry();lg.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));const lm=new THREE.LineBasicMaterial({color:'#e8d8ff',transparent:true,opacity:.7,blending:THREE.AdditiveBlending,depthWrite:false});const ln=new THREE.LineSegments(lg,lm);sc.add(ln);
  anim(sp,ln,t=>{lm.opacity=.45+.3*Math.sin(t*1.7)*Math.sin(t*.53)});(sp.eraObjs=sp.eraObjs||[]);}
 anim(sp,busG,(t)=>{for(const b of buses){let k=(t*b.sp+b.ph)%1;if(b.dir<0)k=1-k;b.cv.getPoint(k,tp);b.cv.getPoint(Math.min(1,Math.max(0,k+.01*b.dir)),tq);b.bus.position.copy(tp);b.bus.lookAt(tq);b.bus.rotateY(-Math.PI/2)}
  for(const c of comets){const k=(t*c.sp+c.ph)%1;c.g.position.copy(c.a).lerp(c.b,k);c.g.lookAt(c.b);c.g.rotateY(Math.PI)}});}

/* ---------- more life in the tubes and the other void ---------- */
function tubeMore(sp,id,z0,z1){const sc=sp.scene,Rt=sp.Rt,Rn=rnd(id==='tunnel'?77:88);const o3=new THREE.Object3D();
 if(id==='tunnel'){// caravans of the endless empire, walking for years along the white sand
  const fig=mergeColored([[new THREE.CylinderGeometry(.25,.35,1.3,6).translate(0,.65,0),'#5a5248'],[new THREE.SphereGeometry(.28,8,6).translate(0,1.5,0),'#6a6258'],[new THREE.BoxGeometry(.5,.5,.4).translate(0,1,-.35),'#8a6a4a']]);
  const N=8,M0=14;const im=new THREE.InstancedMesh(fig,VC({roughness:.85}),N*M0);im.frustumCulled=false;sc.add(im);const cars=[];for(let c=0;c<N;c++)cars.push({a:(Rn()-.5)*30,z:z0+Rn()*(z1-z0),v:(Rn()<.5?1:-1)*(2+Rn()*2)});
  // a star so large it lights the tunnel from far away
  const far=glowSprite('#fffaf0',5200,.5);far.position.set(0,0,z1+1800);sc.add(far);
  anim(sp,im,t=>{let k=0;for(const c of cars){for(let j=0;j<M0;j++){const z=((c.z+t*c.v-j*9*Math.sign(c.v))-z0)%(z1-z0)+z0;const a=c.a+Math.sin(j*1.3)*1.2;const zz=z<z0?z+(z1-z0):z;o3.position.copy(tubePt(Rt,zz,a,(sp.wallD?sp.wallD(zz,Math.PI-a*D2R):6)+.2));o3.quaternion.setFromUnitVectors(V3(0,1,0),tubeUp(a));o3.rotateY(c.v>0?0:Math.PI);o3.position.y+=Math.abs(Math.sin(t*3+j))*.15;o3.scale.setScalar(6);o3.updateMatrix();im.setMatrixAt(k++,o3.matrix)}}im.instanceMatrix.needsUpdate=true})}
 if(id==='midgard'){// the collectors' lantern boats drifting down the pipe
  const boats=[];for(let i=0;i<26;i++){const g=new THREE.Group();const hull=new THREE.Mesh(new THREE.CylinderGeometry(1.5,2.5,10,6),new THREE.MeshStandardMaterial({color:'#3a3448',roughness:.6,metalness:.3}));hull.rotation.x=Math.PI/2;g.add(hull);g.add(glowSprite(i%3?'#c8a8ff':'#ffd890',38,.8));sc.add(g);boats.push({g,a:Rn()*6.28,r:Rt*(.25+Rn()*.45),z:z0+Rn()*(z1-z0),v:(Rn()<.5?1:-1)*(6+Rn()*8)})}
  anim(sp,null,t=>{for(const b of boats){let z=((b.z+t*b.v)-z0)%(z1-z0);if(z<0)z+=z1-z0;z+=z0;const a=b.a+t*.01;b.g.position.set(Math.sin(a)*b.r,Math.cos(a)*b.r+Math.sin(t*.6+b.a)*6,z);b.g.rotation.y=b.v>0?0:Math.PI}})}}
function pathMore(sp,id){if(id==='dream'){dreamRoadMore(sp);return}if(id==='order'){orderMore(sp);return}if(id==='lianjie'){lianjieMore(sp);return}if(id==='deathship'){deathshipMore(sp);return}if(id==='xuying'){xuyingMore(sp);return}if(id==='hope'){hopeMore(sp);return}if(id==='tunshi'){tunshiMore(sp);return}if(id==='anmian'){anmianMore(sp);return}if(id==='ranxing'){ranxingMore(sp);return}if(id==='bridge'){bridgeMore(sp);return}if(id==='benglie'){benglieMore(sp);return}if(id==='jiqimin'){jiqiminMore(sp);return}if(id==='fengxi'){fengxiMore(sp);return}if(id==='shenyan'){shenyanMore(sp);return}if(id==='hunhe'){hunheMore(sp);return}if(id==='qijidu'){qijiduMore(sp);return}if(id==='shanguang'){shanguangMore(sp);return}if(id==='mofang'){mofangMore(sp);return}if(id==='nijiang'){nijiangMore(sp);return}if(id==='xiubu'){xiubuMore(sp);return}if(id==='mgtu'){mgtuMore(sp);return}if(id==='paoqi'){paoqiMore(sp);return}if(id==='yijie'){yijieMore(sp);return}if(id==='shuxin'){shuxinMore(sp);return}if(id!=='buke')return;const sc=sp.scene,road=sp.road,Rn=rnd(515);
 // "常能见到各种飘浮物": drifting things, slowly turning
 const kinds=[[new THREE.BoxGeometry(1,1,1),'#d8c8e8'],[new THREE.OctahedronGeometry(.8,0),'#bfe4ff'],[new THREE.TorusGeometry(.6,.2,6,12),'#f0d8c0'],[new THREE.ConeGeometry(.6,1.4,5),'#c8f0e0'],[new THREE.DodecahedronGeometry(.7,0),'#e8e0ff']];
 const ims=kinds.map(([g,c])=>{const im=new THREE.InstancedMesh(g,new THREE.MeshStandardMaterial({color:c,roughness:.5,metalness:.1,emissive:c,emissiveIntensity:.12,flatShading:true}),60);im.frustumCulled=false;sc.add(im);return im});
 const F=[];ims.forEach((im,k)=>{for(let i=0;i<60;i++){const t=Rn(),p=road(t);F.push({im,i,p:V3(p.x+(Rn()-.5)*1400,p.y+(Rn()-.5)*600,p.z+(Rn()-.5)*900),s:4+Rn()*Rn()*30,r:V3(Rn()*3,Rn()*3,Rn()*3),w:(Rn()-.5)*.2,ph:Rn()*6})}});
 const o3=new THREE.Object3D();anim(sp,null,t=>{for(const f of F){o3.position.copy(f.p);o3.position.y+=Math.sin(t*.2+f.ph)*12;o3.rotation.set(f.r.x+t*f.w,f.r.y+t*f.w*.7,f.r.z);o3.scale.setScalar(f.s);o3.updateMatrix();f.im.setMatrixAt(f.i,o3.matrix)}ims.forEach(im=>im.instanceMatrix.needsUpdate=true)});
 // thunder-cloud creatures along the homeward road and over the hanging city: storm clouds that strike at fliers, each trailing
 // a few small clouds of its own young
 for(let k=0;k<5;k++){const t=.03+k*.13,p=road(t),g=new THREE.Group();g.position.set(p.x+(k%2?1:-1)*(260+Rn()*200),p.y+120+Rn()*120,p.z+(Rn()-.5)*300);
  g.add(evPoints(260,941+k,evSwarmMat({dark:1,soft:1,col:'#5a5868',rx:90,ry:24,rz:70,speed:.05,size:70,op:.6,max:90})));
  for(let j=0;j<3;j++){const y=new THREE.Group();y.position.set(-110-j*55,-10+(Rn()-.5)*30,(Rn()-.5)*60);y.add(evPoints(40,951+k*3+j,evSwarmMat({dark:1,soft:1,col:'#6a6878',rx:16,ry:6,rz:14,speed:.12,size:36,op:.55,max:60})));g.add(y)}
  evFlashes(sp,g,3,90,[170,40,130],'#dfe8ff',961+k);sc.add(g)}
 // rivers of fine consciousness, winding beside the road
 for(let k=0;k<3;k++){const pts=[];for(let i=0;i<=40;i++){const t=(i/40)*.9+.05,p=road(t);pts.push(V3(p.x+Math.sin(t*9+k*2)*420+(k-1)*500,p.y-160+Math.sin(t*13+k)*60,p.z))}const cv=new THREE.CatmullRomCurve3(pts);
  const tm=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{uT:GT},vertexShader:'varying vec2 vU;void main(){vU=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
   fragmentShader:'uniform float uT;varying vec2 vU;void main(){float f=.5+.5*sin(vU.x*900.-uT*2.);float e=1.-abs(vU.y-.5)*2.;gl_FragColor=vec4(vec3(.75,.85,1.)*(.25+.5*f)*e*.5,1.);}'});
  const tube=new THREE.Mesh(new THREE.TubeGeometry(cv,600,14,6,false),tm);sc.add(tube);sc.add(sparkles(cv.getPoints(900).map(p=>p.add(V3((Rn()-.5)*40,(Rn()-.5)*30,(Rn()-.5)*40))),'#e8f0ff',5,.7,.6))}}

/* ---------- the frozen void: things caught mid-motion ---------- */
function ningMore(sp){const sc=sp.scene,Rn=rnd(909);const c=V3(...NG_C);
 const parts=[];const sh=new THREE.OctahedronGeometry(1,0);
 // frozen bursts: a blast stopped a moment after it began
 for(let b=0;b<6;b++){const o=c.clone().add(V3((Rn()-.5)*1600,(Rn()-.5)*500,(Rn()-.5)*1600));for(let i=0;i<34;i++){const d=V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize();const r=30+Rn()*160;const s=2+Rn()*7;const g=sh.clone().scale(s*.5,s*.5,s*2.6);const m4=new THREE.Matrix4().lookAt(V3(0,0,0),d,V3(0,1,0));g.applyMatrix4(m4);g.translate(o.x+d.x*r,o.y+d.y*r,o.z+d.z*r);parts.push([g,Rn()<.5?'#c8ccd8':'#8a8e9a'])}}
 // things that stopped where they were: a stone in mid-fall, a ring of debris, a wave of dust
 for(let i=0;i<60;i++){const p=c.clone().add(V3((Rn()-.5)*2200,(Rn()-.5)*700,(Rn()-.5)*2200));const s=4+Rn()*Rn()*30;parts.push([lumpRock(1,i%5+1).clone().scale(s,s,s).rotateX(Rn()*3).rotateY(Rn()*3).translate(p.x,p.y,p.z),'#9a9ea8'])}
 if(parts.length){const m=new THREE.Mesh(mergeColored(parts),new THREE.MeshStandardMaterial({vertexColors:true,roughness:.6,metalness:.2,flatShading:true,emissive:'#3a3e48',emissiveIntensity:.35}));sc.add(m)}
 // lightning that never finished striking
 {const pos=[];for(let k=0;k<7;k++){let p=c.clone().add(V3((Rn()-.5)*1800,200+Rn()*200,(Rn()-.5)*1800));for(let i=0;i<18;i++){const q=p.clone().add(V3((Rn()-.5)*50,-25-Rn()*30,(Rn()-.5)*50));pos.push(p.x,p.y,p.z,q.x,q.y,q.z);p=q}}
  const lg=new THREE.BufferGeometry();lg.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));sc.add(new THREE.LineSegments(lg,new THREE.LineBasicMaterial({color:'#f0f4ff',transparent:true,opacity:.8,blending:THREE.AdditiveBlending,depthWrite:false})))}
 // where the normal void touches it: soft breathing glows on the boundary
 const gl=[];for(let i=0;i<10;i++){const d=V3(Rn()-.5,(Rn()-.5)*.6,Rn()-.5).normalize();const p=c.clone().add(V3(d.x*1250,d.y*750,d.z*1250));const s=glowSprite('#bfd0ff',220,.35);s.position.copy(p);sc.add(s);gl.push(s)}
 anim(sp,null,t=>gl.forEach((s,i)=>{s.material.opacity=.18+.17*Math.sin(t*.5+i*1.7)}))}

/* ---------- close-ups on a few great worlds of the void ---------- */
function voidHeroes(sp){const E=sp.ents||{};const Rn=rnd(1212);
 // 恒星巴士 · 星球要塞: a docking ring of station modules, ships coming and going
 {const o=E.v_starbus;if(o){const r=72;const g=new THREE.Group();o.add(g);g.rotation.set(.35,0,.2);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(r*1.45,1.6,8,96),mt('#8a9098',{metalness:.7,roughness:.35}));ring.rotation.x=Math.PI/2;g.add(ring);
  const mods=[];for(let i=0;i<16;i++){const a=i/16*6.28;const b=new THREE.Mesh(new THREE.BoxGeometry(6,4,9),mt(i%4?'#a8b0b8':'#c86a3a',{metalness:.6,roughness:.4}));b.position.set(Math.cos(a)*r*1.45,0,Math.sin(a)*r*1.45);b.lookAt(0,0,0);g.add(b);const l=glowSprite(i%2?'#ffe0a0':'#a0e0ff',8,.8);l.position.copy(b.position).multiplyScalar(1.03);g.add(l)}
  for(let i=0;i<4;i++){const a=i/4*6.28+.4;const sp2=new THREE.Mesh(new THREE.CylinderGeometry(.8,.8,r*.45,6),mt('#8a9098',{metalness:.6}));sp2.position.set(Math.cos(a)*r*1.22,0,Math.sin(a)*r*1.22);sp2.rotation.set(Math.PI/2,0,-a+Math.PI/2);g.add(sp2)}
  const ships=[];for(let i=0;i<10;i++){const s=new THREE.Group();const h=new THREE.Mesh(new THREE.ConeGeometry(1.4,5,5),mt('#d8e0e8',{metalness:.7,roughness:.3}));h.rotation.x=Math.PI/2;s.add(h);s.add(at(glowSprite('#9fd8ff',6,.8),0,0,-3));g.add(s);ships.push({s,a:Rn()*6.28,ph:Rn()*6,sp:.05+Rn()*.06})}
  anim(sp,g,t=>{g.rotation.y=t*.01;for(const k of ships){const u=(Math.sin(t*k.sp+k.ph)+1)/2;const R0=r*(1.5+u*1.6);const a=k.a+t*.03;const p=V3(Math.cos(a)*R0,Math.sin(t*k.sp*.7+k.ph)*r*.3,Math.sin(a)*R0);const q=V3(Math.cos(a+.05)*R0,p.y,Math.sin(a+.05)*R0);k.s.position.copy(p);k.s.lookAt(q.applyMatrix4(g.matrixWorld))}})}}
 // 护核者之地: the great tree, and the little guardians whizzing round it
 {const o=E.v_huhe;if(o){const r=54;const g=new THREE.Group();o.add(g);const tr=new THREE.Group();tr.position.y=r*.96;g.add(tr);
  const tk=new THREE.Mesh(new THREE.CylinderGeometry(2.2,4.5,26,9),mt('#5a4632',{roughness:.9}));tk.position.y=13;tr.add(tk);
  for(let i=0;i<7;i++){const c=new THREE.Mesh(new THREE.IcosahedronGeometry(9-i*.6,1),mt(i%2?'#2a7a4a':'#3a9a5a',{roughness:.8,flatShading:true,emissive:'#2a8a5a',emissiveIntensity:.15}));const a=i*.9;c.position.set(Math.cos(a)*7*(i?1:0),26+i*1.5,Math.sin(a)*7*(i?1:0));tr.add(c)}
  const pts=[];for(let i=0;i<70;i++)pts.push({a:Rn()*6.28,b:Rn()*3,r:14+Rn()*20,sp:(.6+Rn()*1.4)*(Rn()<.5?1:-1)});const glows=pts.map(()=>{const s=glowSprite('#bfffe8',2.6,.9);tr.add(s);return s});
  anim(sp,g,t=>pts.forEach((p,i)=>{const a=p.a+t*p.sp;glows[i].position.set(Math.cos(a)*p.r,30+Math.sin(t*1.7+p.b)*10,Math.sin(a)*p.r)}))}}
 const surf=(o)=>{const inner=o.children[0];return (inner&&inner.userData&&inner.userData.spinM)||o};const onS=(par,r,d,obj,lift)=>{obj.position.copy(d).multiplyScalar(r+(lift||0));obj.quaternion.setFromUnitVectors(V3(0,1,0),d);par.add(obj)};
 // 真菌的世界: umbrella mushrooms standing out of the white, spore haze, flocks of spore-gulls
 {const o=E.v_fungusworld;if(o){const r=48;const S=surf(o);const parts=[];
  for(let i=0;i<70;i++){const d=V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize();const h=2+Rn()*7,cr=1.5+Rn()*4;const m4=new THREE.Matrix4().compose(d.clone().multiplyScalar(r-.3),new THREE.Quaternion().setFromUnitVectors(V3(0,1,0),d),V3(1,1,1));
   parts.push([new THREE.CylinderGeometry(.25*cr/2,.35*cr/2,h,6).translate(0,h/2,0).applyMatrix4(m4),'#f0eaf4'],[new THREE.SphereGeometry(cr,10,5,0,6.283,0,1.4).scale(1,.45,1).translate(0,h,0).applyMatrix4(m4),i%4?'#e8dcef':'#cdb8e0'])}
  S.add(new THREE.Mesh(mergeColored(parts),VC({roughness:.8})));
  const haze=[];for(let i=0;i<500;i++)haze.push(V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize().multiplyScalar(r*(1.05+Rn()*.3)));const hz=sparkles(haze,'#f4eeff',3.5,.6,.6);o.add(hz);
  const gulls=[];for(let i=0;i<24;i++){const s=glowSprite('#ffffff',3.2,.85);o.add(s);gulls.push({s,a:Rn()*6.28,b:(Rn()-.5)*1.2,sp:.15+Rn()*.15})}
  anim(sp,o,t=>{hz.rotation.y=t*.01;gulls.forEach(k=>{const a=k.a+t*k.sp;const d=V3(Math.cos(a)*Math.cos(k.b),Math.sin(k.b)+Math.sin(t*.3+k.a)*.1,Math.sin(a)*Math.cos(k.b));k.s.position.copy(d).multiplyScalar(r*1.18)})})}}
 // 恶魔的世界: scarlet towers, and red warships on patrol
 {const o=E.v_demon;if(o){const r=44;const S=surf(o);const parts=[];
  for(let i=0;i<80;i++){const d=V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize();const h=3+Rn()*Rn()*14;const m4=new THREE.Matrix4().compose(d.clone().multiplyScalar(r-.3),new THREE.Quaternion().setFromUnitVectors(V3(0,1,0),d),V3(1,1,1));
   parts.push([new THREE.ConeGeometry(.8+Rn()*1.4,h,4+(i%3)).translate(0,h/2,0).applyMatrix4(m4),['#c8281a','#8a1a14','#e8402a'][i%3]])}
  S.add(new THREE.Mesh(mergeColored(parts),VC({roughness:.6,emissive:'#3a0a04'})));
  const ships=[];for(let i=0;i<8;i++){const s=new THREE.Mesh(new THREE.ConeGeometry(1.6,7,3),mt('#d8301a',{metalness:.4,roughness:.4,emissive:'#5a0a04'}));s.rotation.x=Math.PI/2;const g=new THREE.Group();g.add(s);g.add(at(glowSprite('#ff6a3a',5,.8),0,0,-4));o.add(g);ships.push({g,a:Rn()*6.28,tilt:(Rn()-.5)*1.4,sp:.06+Rn()*.05,rr:r*(1.35+Rn()*.4)})}
  anim(sp,o,t=>ships.forEach(k=>{const a=k.a+t*k.sp;const p=V3(Math.cos(a),0,Math.sin(a)).applyAxisAngle(V3(1,0,0),k.tilt).multiplyScalar(k.rr);const q=V3(Math.cos(a+.05),0,Math.sin(a+.05)).applyAxisAngle(V3(1,0,0),k.tilt).multiplyScalar(k.rr);k.g.position.copy(p);k.g.lookAt(q.add(o.getWorldPosition(V3())))}))}}
 // 镜世界: a pale ghost of itself hanging underneath — the cast-off world — and slivers of crystal turning about it
 {const o=E.v_jing;if(o){const r=42;const gh=new THREE.Mesh(new THREE.SphereGeometry(r*.9,32,20),new THREE.MeshStandardMaterial({color:'#8a94a8',transparent:true,opacity:.22,roughness:.3,metalness:.5,depthWrite:false}));gh.position.y=-r*2.6;o.add(gh);
  const ln=new THREE.Mesh(new THREE.CylinderGeometry(.3,.3,r*1.7,6),GL('#e8faff',.25));ln.position.y=-r*1.3;o.add(ln);
  const sl=[];for(let i=0;i<40;i++){const m=new THREE.Mesh(new THREE.OctahedronGeometry(1.2+Rn()*2,0),mt('#e8faff',{metalness:.9,roughness:.05,emissive:'#6ab8d8',emissiveIntensity:.25}));m.scale.y=2.5;o.add(m);sl.push({m,a:Rn()*6.28,b:(Rn()-.5)*.9,rr:r*(1.3+Rn()*.6),sp:(.04+Rn()*.05)*(Rn()<.5?1:-1)})}
  anim(sp,o,t=>sl.forEach(k=>{const a=k.a+t*k.sp;k.m.position.set(Math.cos(a)*Math.cos(k.b)*k.rr,Math.sin(k.b)*k.rr,Math.sin(a)*Math.cos(k.b)*k.rr);k.m.rotation.y=t*.5+k.a}))}}
 // 熔毁地带: a living molten world — eruptions, and pulses running through its liquid nerves
 {const o=E.v_rongui;if(o){const r=70;const g=new THREE.Group();o.add(g);const plumes=[];
  for(let i=0;i<9;i++){const d=V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize();const p=new THREE.Group();p.position.copy(d).multiplyScalar(r);p.quaternion.setFromUnitVectors(V3(0,1,0),d);
   p.add(emitter({n:50,life:3,speed:9,spread:.25,size:7,col:'#ffb040',col2:'#5a1a08',op:.8,area:[3,1,3],grav:3}));g.add(p);plumes.push(p)}
  const rings=[];for(let i=0;i<3;i++){const m=new THREE.Mesh(new THREE.TorusGeometry(r*1.01,.6,4,96),new THREE.MeshBasicMaterial({color:'#ff7a2a',transparent:true,opacity:.0,blending:THREE.AdditiveBlending,depthWrite:false}));m.rotation.set(Rn()*3,Rn()*3,0);g.add(m);rings.push({m,ph:i/3})}
  const ash=[];for(let i=0;i<400;i++)ash.push(V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize().multiplyScalar(r*(1.05+Rn()*.35)));const as=sparkles(ash,'#ffb070',3,.6,.5);g.add(as);
  anim(sp,g,t=>{rings.forEach(k=>{const u=(t*.12+k.ph)%1;k.m.scale.setScalar(.25+u*.8);k.m.material.opacity=Math.sin(u*Math.PI)*.6});as.rotation.y=-t*.015})}}
 // 连接世界: numbered gates turning along the ways between its many worlds
 {const o=E.v_lianjie;if(o){const inner=o.children[0];const kids=inner?inner.children.filter(c=>c.position.lengthSq()>1):[];const gates=[];
  for(let i=0;i<kids.length-1;i++){const a=kids[i].position,b=kids[i+1].position;const m=a.clone().lerp(b,.5);const gt=new THREE.Mesh(new THREE.TorusGeometry(7,.7,6,28),GL('#9fd8ff',.8));gt.position.copy(m);o.add(gt);o.updateMatrixWorld(true);gt.lookAt(o.localToWorld(b.clone()));
   const cv=document.createElement('canvas');cv.width=64;cv.height=64;const x=cv.getContext('2d');x.fillStyle='#bfe8ff';x.font='bold 40px sans-serif';x.textAlign='center';x.fillText(String(i+1),32,46);
   const lb=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(cv),transparent:true,depthWrite:false}));lb.scale.set(6,6,1);lb.position.copy(m).add(V3(0,10,0));o.add(lb);gates.push(gt)}
  anim(sp,o,t=>gates.forEach((g2,i)=>{g2.rotateZ(.01*(i%2?1:-1))}))}}
 // 米德加尔特的旅途: the pipe dragging three of the creators' worlds as moons, plunging into a star
 {const o=E.v_midgard2;if(o){const S=120;const ax=V3(0,1,0).applyAxisAngle(V3(0,0,1),Math.PI/2.6);const g=new THREE.Group();o.add(g);
  const rib=new THREE.Group();for(let i=0;i<14;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(S*.125,1.6,6,32),mt('#3a3644',{roughness:.6}));r.position.copy(ax).multiplyScalar(-S*2.6+i*S*.4);r.quaternion.setFromUnitVectors(V3(0,0,1),ax);rib.add(r)}g.add(rib);
  const moons=[];const MC=[['#3a2a24','#ff6a2a',.9],['#7a8a9a','#bfe0ff',.35],['#5a6a4a','#c8e8a0',.25]];
  MC.forEach(([c,e,ei],i)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(i===0?13:10,24,16),mt(c,{roughness:.8,emissive:e,emissiveIntensity:ei,transparent:i===1,opacity:i===1?.45:1}));g.add(m);if(i===0)m.add(glowSprite('#ff7a3a',60,.45));moons.push({m,ph:i*2.1,r:S*.55+i*12})});
  const tip=new THREE.Group();tip.position.copy(ax).multiplyScalar(-S*3);g.add(tip);tip.add(glowSprite('#ffe0a0',S*.9,.55));tip.add(emitter({n:120,life:2.5,speed:S*.2,spread:.6,size:14,col:'#ffd070',col2:'#ff4010',op:.8,dir:[ax.x,ax.y,ax.z],area:[20,20,20]}));
  const e1=V3(0,0,1).cross(ax).normalize(),e2=ax.clone().cross(e1);
  anim(sp,g,t=>moons.forEach(k=>{const a=t*.12+k.ph;k.m.position.copy(ax).multiplyScalar(S*1.6).addScaledVector(e1,Math.cos(a)*k.r).addScaledVector(e2,Math.sin(a)*k.r)}))}}
 // 创造之海: bands of light circling the ocean world, and motes rising off its surface like data
 {const o=E.v_chuangzao;if(o){const r=44;const g=new THREE.Group();o.add(g);const bands=[];for(let i=0;i<5;i++){const b=new THREE.Mesh(new THREE.TorusGeometry(r*(1.12+i*.09),.35,4,120),GL(['#bff8ff','#8ae8ff','#e8fff8'][i%3],.55));b.rotation.set(Math.PI/2+(Rn()-.5)*.8,(Rn()-.5)*.8,0);g.add(b);bands.push({b,s:(.02+Rn()*.04)*(i%2?1:-1)})}
  const mp=[];for(let i=0;i<600;i++){const d=V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize();mp.push(d.multiplyScalar(r*(1.02+Rn()*.5)))}const motes=sparkles(mp,'#dffcff',3,.8,.8);g.add(motes);
  anim(sp,g,t=>{bands.forEach(k=>k.b.rotation.z=t*k.s);motes.rotation.y=t*.02})}}}

/* the road of light: gates of light standing across it, and petals of light drifting along */
function dreamRoadMore(sp){const sc=sp.scene,road=sp.road,Rn=rnd(616);const parts=[];const wd=34;
 for(let i=1;i<40;i++){const t=i/40,p=road(t),q=road(Math.min(1,t+.001)).sub(road(Math.max(0,t-.001))).normalize();const s=V3(-q.z,0,q.x).normalize();const h=60+Rn()*30;
  for(const k of[-1,1]){const g=new THREE.CylinderGeometry(2.2,2.8,h,8);g.translate(p.x+s.x*wd*1.3*k,p.y+h/2-6,p.z+s.z*wd*1.3*k);parts.push([g,'#fff0c8'])}
  const b=new THREE.BoxGeometry(wd*2.9,3.2,4);const m4=new THREE.Matrix4().makeRotationY(Math.atan2(s.x,s.z)-Math.PI/2);b.applyMatrix4(m4);b.translate(p.x,p.y+h-4,p.z);parts.push([b,'#ffe6a0'])}
 const geo=mergeColored(parts);const m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false}));sc.add(m);
 const pet=[];for(let i=0;i<400;i++)pet.push({t:Rn(),ox:(Rn()-.5)*160,oy:10+Rn()*80,sp:.002+Rn()*.003,ph:Rn()*6});const pa=pet.map(()=>V3());const pts=sparkles(pa,'#ffd8f0',6,.8,.9);pts.frustumCulled=false;sc.add(pts);
 anim(sp,null,t=>{const P=pts.geometry.attributes.position;pet.forEach((o,i)=>{const k=(o.t+t*o.sp)%1;const p=road(k);P.setXYZ(i,p.x+o.ox+Math.sin(t*.5+o.ph)*10,p.y+o.oy+Math.sin(t*.8+o.ph)*6,p.z)});P.needsUpdate=true})}

/* ---------- Lin, in the void: the same small golden light, in the sector of the age ---------- */
function voidLin(sp){const s=glowSprite('#ffd890',26,.85),s2=glowSprite('#fff4d8',8,1);s.userData.noBatch=s2.userData.noBatch=1;const g=new THREE.Group();g.add(s);g.add(s2);sp.scene.add(g);const pos=V3();
 const place=()=>{const S=SECTORS[ERA];if(!S){g.visible=false;return pos}g.visible=true;pos.set(S.c[0]+90,S.c[1]-50,S.c[2]+60);return pos};
 anim(sp,null,t=>{g.position.copy(place());const k=.75+.25*Math.sin(t*1.6);s.material.opacity=.6*k;s.scale.setScalar(26+5*Math.sin(t*1.6))});
 prox(sp,'lin',()=>place(),24,{maxD:3800,e:[6,7,8,9,10,11,12,13],hide:()=>!SECTORS[ERA]})}
