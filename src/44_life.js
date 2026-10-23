/* ================================================================
   small life near the ground: butterflies by day, fireflies after dusk, seeds and pollen
   drifting on the wind. they live in a ring round wherever the camera is looking, so a
   low flight over any meadow or forest has something moving in it.
   ================================================================ */
const leafTex=canvasTex(32,32,x=>{x.fillStyle='#fff';x.beginPath();x.ellipse(16,16,6,13,.5,0,6.283);x.fill();x.strokeStyle='rgba(0,0,0,.35)';x.lineWidth=1;x.beginPath();x.moveTo(10,27);x.lineTo(22,5);x.stroke()});
const wingTex=canvasTex(64,64,x=>{x.fillStyle='#fff';for(const s of[-1,1]){x.save();x.translate(32,32);x.scale(s,1);x.beginPath();x.ellipse(13,-8,13,11,-.5,0,6.283);x.fill();x.beginPath();x.ellipse(10,10,8,8,.6,0,6.283);x.fill();x.restore()}
 x.globalCompositeOperation='destination-out';x.fillStyle='rgba(0,0,0,.35)';for(const s of[-1,1]){x.beginPath();x.arc(32+s*16,22,3.2,0,6.283);x.fill()}x.globalCompositeOperation='source-over';x.fillStyle='#222';x.fillRect(31,18,2,26)});
function lifePoints(n,o){const g=new THREE.BufferGeometry();const pos=new Float32Array(n*3),seed=new Float32Array(n),col=new Float32Array(n*3);for(let i=0;i<n;i++){seed[i]=Math.random()*100;const c=C(o.cols[i%o.cols.length]).offsetHSL((Math.random()-.5)*.04,0,(Math.random()-.5)*.1);col[i*3]=c.r;col[i*3+1]=c.g;col[i*3+2]=c.b}
 g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('aSeed',new THREE.BufferAttribute(seed,1));g.setAttribute('aCol',new THREE.BufferAttribute(col,3));g.boundingSphere=new THREE.Sphere(V3(),1e5);
 const m=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:o.add?THREE.AdditiveBlending:THREE.NormalBlending,uniforms:{uT:GT,uScale:PSCALE,uSize:{value:o.size},uTex:{value:o.tex},uA:{value:1}},
  vertexShader:`attribute float aSeed;attribute vec3 aCol;uniform float uT,uSize,uScale;varying vec3 vC;varying float vF,vB;void main(){vC=aCol;
   vF=${o.flap?'.18+.82*abs(sin(uT*(13.+fract(aSeed)*6.)+aSeed))':'1.'};vB=${o.blink?'pow(.5+.5*sin(uT*(1.3+fract(aSeed*3.1)*1.6)+aSeed),3.)':'1.'};
   vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=clamp(uSize*uScale/-mv.z,0.,64.);gl_Position=projectionMatrix*mv;}`,
  fragmentShader:`uniform sampler2D uTex;uniform float uA;varying vec3 vC;varying float vF,vB;void main(){vec2 u=gl_PointCoord;u.x=(u.x-.5)/vF+.5;if(u.x<0.||u.x>1.)discard;vec4 t=texture2D(uTex,u);
   ${o.add?'gl_FragColor=vec4(vC*t.a*vB*uA,1.);':'if(t.a<.3)discard;gl_FragColor=vec4(vC*t.rgb,uA);'}}`});
 const p=new THREE.Points(g,m);p.frustumCulled=false;p.renderOrder=3;return p}
function rqLife(sp){const gh=sp.gh;
 const kinds=[
  {n:70,size:1.3,tex:wingTex,flap:1,cols:['#f2c94a','#ff8a3a','#ffffff','#7fc8ff','#e86aa8','#c8f07a'],day:1,alt:[.8,4],spd:3.2,turn:3},
  {n:240,size:.9,tex:dotTex,add:1,blink:1,cols:['#d8ff7a','#f4ff9a','#b8ff8a'],day:0,alt:[.5,5],spd:.9,turn:1.6},
  {n:160,size:.45,tex:dotTex,add:1,cols:['#fff6e0','#f0f0d8'],day:2,alt:[1,14],spd:2.4,turn:.4,drift:1},
  {n:90,size:.75,tex:leafTex,flap:1,cols:['#c8a040','#d88a3a','#9aa040','#7a9a3a','#b86a30'],day:2,alt:[3,9],spd:1.4,turn:.8,drift:1,fall:1,where:d=>forestF(d)>.35}];
 const D=V3();for(const K of kinds){K.pts=lifePoints(K.n,K);sp.scene.add(K.pts);K.st=Array.from({length:K.n},()=>({la:0,lo:0,a:0,h:0,ph:Math.random()*6.28,ok:false}))}
 const wind=V3();let acc=0;
 anim(sp,null,(t,dt)=>{if(CUR!==sp)return;const alt=rig.alt;const lifeE=ERA>=2&&ERA!==4;const near=1-sm(140,260,alt);
  for(const K of kinds){const show=lifeE&&near>0&&(K.day===2||(K.day===1?sp.dayK>.35:sp.dayK<.55));K.pts.visible=show;if(!show)continue;
   const dk=K.day===1?sm(.35,.6,sp.dayK):K.day===0?sm(.55,.25,sp.dayK):1;K.pts.material.uniforms.uA.value=near*dk;
   const rU=clamp(alt*1.25,28,190),rD=rU/(R*D2R);const cosl=Math.max(.2,Math.cos(rig.a*D2R));const pa=K.pts.geometry.attributes.position.array;
   for(let i=0;i<K.n;i++){const s=K.st[i];let dla=s.la-rig.a,dlo=(s.lo-rig.b)*cosl;if(!s.ok||dla*dla+dlo*dlo>rD*rD){// respawn somewhere on land in the ring
     const a=Math.random()*6.283,d=Math.sqrt(Math.random())*rD;s.la=rig.a+Math.cos(a)*d;s.lo=rig.b+Math.sin(a)*d/cosl;s.ok=sp.ghRaw(s.la,s.lo)>1.6&&(!K.where||K.where(dirLL(s.la,s.lo,D)));s.a=Math.random()*6.283;s.h=lerp(K.alt[0],K.alt[1],Math.random())}
    if(!s.ok){pa[i*3]=pa[i*3+1]=pa[i*3+2]=0;continue}
    s.a+=(Math.sin(t*K.turn+s.ph*3)+(Math.random()-.5))*dt*K.turn;let sp2=K.spd*(.6+.4*Math.sin(t*.7+s.ph));const step=sp2*dt/(R*D2R);
    s.la+=Math.cos(s.a)*step+(K.drift?step*.6:0);s.lo+=(Math.sin(s.a)*step+(K.drift?step*.9:0))/cosl;
    if(K.fall){s.h-=dt*.9;if(s.h<.1)s.ok=false}
    const hh=K.day===1?s.h+Math.abs(Math.sin(t*2.3+s.ph))*1.1:s.h+Math.sin(t*.9+s.ph)*.8;
    dirLL(s.la,s.lo,D).multiplyScalar(R+gh(s.la,s.lo)+hh);pa[i*3]=D.x;pa[i*3+1]=D.y;pa[i*3+2]=D.z}
   K.pts.geometry.attributes.position.needsUpdate=true}})}

/* fish leaping from the shallows, a splash where they fall back */
function rqJumpers(sp){const n=14;const body=loftGeo([[.55,0,0,.02,.02],[.4,.01,0,.09,.06],[.1,.02,0,.13,.08],[-.25,0,0,.08,.05],[-.45,0,0,.03,.02]],{n:16,r:8,back:'#4a6a7a',belly:'#e8eef0'});
 const tail=new THREE.ConeGeometry(.14,.22,3);tail.rotateZ(Math.PI/2);tail.scale(1,1,.25);tail.translate(-.55,0,0);const geo=mergeKeep([body,mergeColored([[tail,'#5a7a8a']])]);
 const im=new THREE.InstancedMesh(geo,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.25,metalness:.35}),n);im.frustumCulled=false;sp.scene.add(im);
 const sp2=Array.from({length:n},()=>({t:-Math.random()*4,la:0,lo:0,a:0,s:1}));const o=new THREE.Object3D();
 const spl=[];const splash=new THREE.Points(new THREE.BufferGeometry(),new THREE.PointsMaterial({color:'#ffffff',size:.25,transparent:true,opacity:.85,depthWrite:false}));const SP=new Float32Array(n*12*3);splash.geometry.setAttribute('position',new THREE.BufferAttribute(SP,3));splash.frustumCulled=false;sp.scene.add(splash);
 anim(sp,null,(t,dt)=>{const show=CUR===sp&&rig.alt<160&&ERA!==4;im.visible=splash.visible=show;if(!show)return;const rD=clamp(rig.alt*1.1,30,150)/(R*D2R);const cosl=Math.max(.2,Math.cos(rig.a*D2R));
  sp2.forEach((f,i)=>{f.t+=dt/1.1;if(f.t>1.6||f.t<-6){f.t=-1-Math.random()*4;}
   if(f.t<0){if(f.t>-dt*1.2||!f.ok){for(let k=0;k<8;k++){const a=Math.random()*6.283,d=Math.sqrt(Math.random())*rD;const la=rig.a+Math.cos(a)*d,lo=rig.b+Math.sin(a)*d/cosl;const h=sp.ghRaw(la,lo);if(h<-1.2&&h>-14){f.la=la;f.lo=lo;f.a=Math.random()*6.283;f.s=.8+Math.random()*1.2;f.ok=true;break}f.ok=false}}
    o.position.set(0,-1e4,0);o.updateMatrix();im.setMatrixAt(i,o.matrix);return}
   const u=Math.min(1,f.t);const d=u*3.2*f.s/(R*D2R);const la=f.la+Math.cos(f.a)*d,lo=f.lo+Math.sin(f.a)*d/cosl;
   frameLL(sp,la,lo,Math.sin(Math.PI*u)*1.8*f.s-.2,f.a,o,false);o.rotateZ(Math.cos(Math.PI*u)*1.1);o.scale.setScalar(f.s);o.updateMatrix();im.setMatrixAt(i,o.matrix);
   // the splash: a ring of drops rising and falling just after it lands
   const w=f.t-1;for(let k=0;k<12;k++){const j=(i*12+k)*3;if(w>0&&w<.6){const a=k/12*6.283;const r=w*1.6*f.s;const up=Math.sin(Math.PI*w/.6)*.7;const q=V3();frameLL(sp,la,lo,0,0,o,false);q.set(Math.cos(a)*r,up,Math.sin(a)*r).applyQuaternion(o.quaternion).add(o.position);SP[j]=q.x;SP[j+1]=q.y;SP[j+2]=q.z}else{SP[j]=SP[j+1]=SP[j+2]=0}}});
  im.instanceMatrix.needsUpdate=true;splash.geometry.attributes.position.needsUpdate=true})}

/* shooting stars on clear nights: a streak every few seconds somewhere in the sky above you */
function planetMeteors(sp){const n=6;const pos=new Float32Array(n*6),col=new Float32Array(n*6);const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('color',new THREE.BufferAttribute(col,3));
 const L=new THREE.LineSegments(g,new THREE.LineBasicMaterial({vertexColors:true,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));L.frustumCulled=false;L.renderOrder=-5;sp.scene.add(L);
 const st=Array.from({length:n},()=>({t:9,life:1,a:V3(),v:V3()}));let next=2;const up=V3(),tmp=V3();
 anim(sp,null,(t,dt)=>{if(CUR!==sp){L.visible=false;return}const night=1-sm(.15,.45,sp.dayK);L.visible=night>0&&rig.alt>120;if(!L.visible)return;
  next-=dt;if(next<=0){next=1.5+Math.random()*5;const s=st.find(x=>x.t>=x.life);if(s){dirLL(rig.a,rig.b,up);const side=V3(Math.random()-.5,Math.random()-.5,Math.random()-.5).cross(up).normalize();
    s.a.copy(up).multiplyScalar(R+Math.max(500,rig.alt*.8)).addScaledVector(side,(Math.random()-.5)*rig.alt*1.4).addScaledVector(up.clone().cross(side),(Math.random()-.5)*rig.alt*1.2);
    s.v.copy(side).multiplyScalar(160+Math.random()*220).addScaledVector(up,-40);s.t=0;s.life=.7+Math.random()*.8}}
  st.forEach((s,i)=>{s.t+=dt;const k=s.t<s.life?1-s.t/s.life:0;const h=tmp.copy(s.a).addScaledVector(s.v,s.t);const tl=h.clone().addScaledVector(s.v,-.18);
   pos.set([h.x,h.y,h.z,tl.x,tl.y,tl.z],i*6);const b=k*night;col.set([b,b*.95,b*.85,0,0,0],i*6)});g.attributes.position.needsUpdate=true;g.attributes.color.needsUpdate=true})}

/* passing storms over the wet forests: rain round wherever you are, dark cloud, now and then lightning */
const rainTex=canvasTex(32,32,x=>{const g=x.createLinearGradient(0,0,0,32);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.6,'rgba(255,255,255,.9)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(15,0,2,32)});
const STORMS=[{ll:[26,-66],r:7,e:[3,4,5,6,7,8,9,10,11,12]},{ll:[-4,-86],r:5,e:[3,4,5,6,7,8,9,10,11,12]},{ll:[33,11],r:7,e:[2,3,5]},{ll:[-10,88],r:6,e:[5,6,7,8,9,10,11,12]},{ll:[6,-76],r:9,e:[3,4,5]}];
function planetStorms(sp){const rain=emitter({n:1400,life:1.1,speed:-55,spread:.04,size:3,dir:[0,1,0],col:'#d8e4ee',op:.7,add:false,tex:rainTex,area:[90,6,90],fadeIn:.02});rain.position.y=0;
 const g=new THREE.Group();g.add(rain);const cm=new THREE.SpriteMaterial({map:smokeTex,color:'#5a6068',transparent:true,opacity:0,depthWrite:false});const clouds=[];
 for(let i=0;i<14;i++){const s=new THREE.Sprite(cm);const a=i/14*6.283,d=20+Math.random()*60;s.position.set(Math.cos(a)*(d+40),95+Math.random()*25,Math.sin(a)*(d+40));const z=110+Math.random()*80;s.scale.set(z,z*.45,1);g.add(s);clouds.push(s)}
 const veil=document.createElement('div');veil.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:1;background:linear-gradient(#1a2028,#2a3038 60%,#3a4048);opacity:0;transition:opacity .6s;mix-blend-mode:multiply';document.body.appendChild(veil);
 const flash=glowSprite('#e8f0ff',220,0);flash.position.y=95;g.add(flash);const boltG=new THREE.BufferGeometry();const bolt=new THREE.Line(boltG,new THREE.LineBasicMaterial({color:'#f4f8ff',transparent:true,opacity:0}));g.add(bolt);
 sp.scene.add(g);let fl=0,next=4;const dd=V3();
 anim(sp,null,(t,dt)=>{if(CUR!==sp){g.visible=false;veil.style.opacity=0;return}dirLL(rig.a,rig.b,dd);let k=0;for(const z of STORMS){if(!z.e.includes(ERA))continue;const a=angDeg(dd,dirLL(z.ll[0],z.ll[1]));k=Math.max(k,1-sm(z.r*.6,z.r,a))}
  const cyc=sm(.1,.5,Math.sin(t*.045+1.3));k*=cyc*(1-sm(160,320,rig.alt));g.visible=k>.02;sp._stormK=k;veil.style.opacity=String((k*.45*(1-fl*.8)).toFixed(3));if(!g.visible)return;
  frameLL(sp,rig.a,rig.b,0,0,g);rain.material.uniforms.uOp.value=.55*k;cm.opacity=.38*k;
  next-=dt;if(next<=0&&k>.4){next=7+Math.random()*12;fl=1;const pts=[];let p=V3((Math.random()-.5)*120,95,(Math.random()-.5)*120);flash.position.copy(p);const gy=sp.gh(rig.a,rig.b);for(let i=0;i<9;i++){pts.push(p.clone());p=p.clone().add(V3((Math.random()-.5)*8,-(95)/9,(Math.random()-.5)*8))}pts.push(V3(p.x,0,p.z));boltG.setFromPoints(pts)}
  fl=Math.max(0,fl-dt*3.5);flash.material.opacity=fl*fl*.45*k;bolt.material.opacity=fl>.6?.75:0})}

/* ---------- gulls along the coasts ---------- */
function bGull(f){const g=new THREE.Group();g.userData.noSkin=1;const b=new THREE.Group();g.add(b);const s=f.s||1;b.scale.setScalar(s);
 const W=M('#f4f2ec',{roughness:.7}),G=M('#9aa0a8',{roughness:.7});const body=sph(0,.42,.14,.14,10,W);b.add(body);const hd=sph(0,.12,.11,.1,8,W);hd.position.set(.42,.06,0);b.add(hd);
 const bk=cone(.03,.16,M('#e8b040'),5);bk.rotation.z=-Math.PI/2;bk.position.set(.58,.04,0);b.add(bk);const tl=cone(.09,.22,W,4);tl.rotation.z=Math.PI/2;tl.position.set(-.48,0,0);b.add(tl);
 const wings=[];for(const z of[-1,1]){const pv=new THREE.Group();pv.position.set(.02,.06,z*.08);b.add(pv);const w1=new THREE.Mesh(new THREE.BoxGeometry(.3,.02,.55),W);w1.position.z=z*.28;pv.add(w1);const tp=new THREE.Group();tp.position.z=z*.55;pv.add(tp);const w2=new THREE.Mesh(new THREE.BoxGeometry(.22,.02,.5),G);w2.position.set(-.04,0,z*.24);tp.add(w2);wings.push({pv,tp,z})}
 const ph=Math.random()*6;g.userData.anim=(t)=>{const gl=Math.sin(t*.4+ph)>.3;const a=gl?.08:Math.sin(t*9+ph)*.6;wings.forEach(w=>{w.pv.rotation.x=-w.z*a;w.tp.rotation.x=-w.z*a*.6});b.rotation.z=Math.sin(t*.7+ph)*.08;b.position.y=Math.sin(t*1.1+ph)*.3};return g}
SPEC.rq_gull=bGull;
window.FAUNA.push(
 {w:'rq_gull',kind:'flyer',at:[13.6,11.2],n:7,col:'#fff',s:1.1,alt:5,rad:1,e:[6,7,8,9,10,11,12],route:[[14,12.2],[14.8,11],[13.9,9.8],[12.9,10.9]],rsp:.02,spread:.35},
 {w:'rq_gull',kind:'flyer',at:[16,14],n:5,col:'#fff',s:1.1,alt:6,rad:1,e:[6,7,8,9,10,11,12],route:[[15.6,13.2],[17,14.6],[16.2,16.4],[15,14.8]],rsp:.018,spread:.4}
);

/* ---------- 大鸵龙 with a 白骸龙 rider ---------- */
function bOstrichRider(f){const g=new THREE.Group();g.userData.noSkin=0;const s=f.s||1;const body=new THREE.Group();body.scale.setScalar(s);g.add(body);
 const skin=M('#b8a07a',{roughness:.75}),bone=M('#ece8de',{roughness:.7});
 const tor=sph(0,.7,.42,.42,12,skin);tor.position.set(0,2.1,0);body.add(tor);const nk=cyl(.1,.16,1.1,skin,7);nk.position.set(.7,2.6,0);nk.rotation.z=-.5;body.add(nk);const hd=sph(0,.24,.16,.15,10,skin);hd.position.set(1.0,3.15,0);body.add(hd);
 const bk=cone(.07,.3,M('#6a5a3a'),5);bk.rotation.z=-Math.PI/2;bk.position.set(1.32,3.12,0);body.add(bk);const tl=cone(.2,.9,skin,5);tl.rotation.z=Math.PI/2+.25;tl.position.set(-.95,2.25,0);body.add(tl);
 const L=[];for(const z of[-1,1]){const l=leg2(.95,.95,.08,skin,.9);l.position.set(.05,1.95,z*.22);body.add(l);L.push({m:l,ph:z>0?0:Math.PI,a:.7})}
 // the rider: white, glowing eyes, a scroll of skin at its side
 const rd=new THREE.Group();rd.position.set(-.05,2.45,0);body.add(rd);const rb=sph(0,.2,.36,.18,10,bone);rb.position.y=.36;rd.add(rb);const rh=sph(0,.15,.12,.12,10,bone);rh.position.set(.14,.78,0);rd.add(rh);
 for(const z of[-1,1]){const e=sph(0,.03,.03,.03,6,GL('#8fffe8'));e.position.set(.27,.8,z*.06);rd.add(e)}const sc=cyl(.05,.05,.32,M('#c8a070'),6);sc.rotation.x=Math.PI/2;sc.position.set(-.1,.3,.22);rd.add(sc);
 const sp2=cyl(.015,.015,1.5,M('#6a4a2a'),4);sp2.position.set(.3,.6,-.2);sp2.rotation.z=-.5;rd.add(sp2);
 addLegs(body,L);stdAnim(body,{fq:7,amp:.55});const a0=body.userData.anim;g.userData.anim=t=>{a0&&a0(t);tor.position.y=2.1+Math.abs(Math.sin(t*7))*.06;rd.position.y=2.45+Math.abs(Math.sin(t*7))*.08};return g}
SPEC.baihai_rider=bOstrichRider;
// only the leader rides one
window.FAUNA.push({w:'baihai_rider',kind:'quad',at:[4.6,-110.6],n:1,col:'#b8a07a',s:1,alt:0,rad:.7,e:[3,4]});
