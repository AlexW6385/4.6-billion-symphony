/* ================================================================
   the void: every world Lin visited in book three, laid out sector by sector in story order.
   the frozen void is a region of it; the other worlds open from their places here.
   ================================================================ */
const mt=(c,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.7,metalness:0},o||{}));
const EMI=(c,i,o)=>mt(c,Object.assign({emissive:c,emissiveIntensity:i===undefined?.6:i},o||{}));

/* ---------- planet skins ---------- */
function planetTex(kp,seed,real,div,job){div=div||1;const W2=(real?256:192)/div,H2=(real?128:96)/div;const cv=document.createElement('canvas');cv.width=W2;cv.height=H2;const x=cv.getContext('2d');const im=x.createImageData(W2,H2);
 const tex=kp.tex||'rock',c1=C(kp.c1||kp.c||'#7a8a7a'),c2=C(kp.c2||'#2a3a4a'),ws=C('#f2f6f8'),tmp=new THREE.Color(),hot=C('#ff7a2a'),cSand=C('#b9a36a'),cAmb=C('#fff0b0');
 const ox=(seed%97)*.37,oy=(seed%61)*.21,oz=(seed%43)*.53;const em=(kp.lights||tex==='lava'||kp.veins)?x.createImageData(W2,H2):null;const d=V3();const lc=em?(tex==='lava'?hot:kp.veins?C('#ffb070'):C(kp.lights)):null;
 const row=j=>{for(let i=0;i<W2;i++){const th=(j+.5)/H2*Math.PI,ph=(i+.5)/W2*Math.PI*2;d.set(-Math.cos(ph)*Math.sin(th),Math.cos(th),Math.sin(ph)*Math.sin(th));const lat=90-th/D2R,lon=Math.atan2(d.x,d.z)/D2R;const px2=d.x,py=d.y,pz=d.z;let glowv=0;
  if(real){real(d,lat,tmp);if(kp.lights&&real.lights)glowv=real.lights(d)}
  else{const f1=fbm(px2*2.2+ox,py*2.2+oy,pz*2.2+oz,5),f2=n3(px2*9+oz,py*9+ox,pz*9+oy),la=Math.abs(lat)/90;let land=0;
  switch(tex){
   case 'earth':land=sm(.5,.53,f1);tmp.copy(c2).lerp(c1,land);if(land>0)tmp.lerp(cSand,sm(.62,.75,f1)*.6);tmp.lerp(ws,sm(.8,.92,la+f2*.1));break;
   case 'ocean':land=sm(.62,.64,f1);tmp.copy(c2).lerp(c1,land+(1-land)*f2*.25);tmp.lerp(ws,sm(.86,.96,la));break;
   case 'jungle':case 'moss':land=sm(.4,.43,f1);tmp.copy(c2).lerp(c1,land);tmp.offsetHSL(0,0,(f2-.5)*.12);break;
   case 'metal':{const g=(Math.abs(Math.sin(lon*D2R*24))<.06||Math.abs(Math.sin(lat*D2R*24))<.06)?1:0;tmp.copy(c1).lerp(c2,f2*.6+g*.5);land=sm(.35,.38,f1);if(!land)tmp.copy(c2).multiplyScalar(.6);if(em&&land&&f2>.62)glowv=1;break}
   case 'flesh':{const r=1-Math.abs(f1*2-1);tmp.copy(c1).lerp(c2,sm(.75,.95,r));if(kp.veins&&r>.9)glowv=sm(.9,.98,r);break}
   case 'jelly':tmp.copy(c1).lerp(c2,(Math.sin(lat*D2R*10+f1*8)+1)/2*.7);break;
   case 'ice':{const r=1-Math.abs(f2*2-1);tmp.copy(c1).lerp(ws,f1*.6).lerp(c2,sm(.9,.98,r)*.8);if(em&&r>.95)glowv=.6;break}
   case 'dark':tmp.copy(c1).lerp(c2,f1).multiplyScalar(.75+f2*.25);if(em&&f2>.7&&f1>.5)glowv=1;break;
   case 'fungus':tmp.copy(c1).lerp(c2,sm(.45,.6,f1)).lerp(ws,sm(.7,.8,f2)*.5);break;
   case 'sand':tmp.copy(c1).lerp(c2,(Math.sin(lon*D2R*12+f1*14)+1)/2*.45+f2*.15);break;
   case 'red':tmp.copy(c1).lerp(c2,sm(.4,.7,f1)).multiplyScalar(.85+f2*.2);break;
   case 'crystal':{const q=Math.floor(f1*8)/8;tmp.copy(c1).lerp(c2,q).lerp(ws,sm(.8,.9,f2)*.6);if(em&&f2>.75)glowv=.8;break}
   case 'lava':{const r=1-Math.abs(f1*2-1);tmp.copy(c1).lerp(c2,f2*.25);if(r>.86){tmp.lerp(hot,sm(.86,.97,r));glowv=sm(.86,.97,r)}break}
   case 'gas':tmp.copy(c1).lerp(c2,(Math.sin(lat*D2R*14+f1*5)+1)/2).offsetHSL(0,0,(f2-.5)*.08);break;
   case 'amber':tmp.copy(c1).lerp(c2,sm(.35,.7,f1)).lerp(cAmb,sm(.75,.85,f2)*.4);break;
   case 'dream':tmp.copy(c1).lerp(c2,(Math.sin(lon*D2R*3+lat*D2R*5+f1*10)+1)/2);break;
   case 'dust':tmp.copy(c1).lerp(c2,f1*.7+f2*.2);break;
   default:tmp.copy(c1).lerp(c2,sm(.35,.7,f1)).multiplyScalar(.8+f2*.3);if(f2>.8)tmp.multiplyScalar(.75);if(em&&f2>.7&&f1>.55)glowv=1}}
  const k=(j*W2+i)*4;im.data[k]=tmp.r*255;im.data[k+1]=tmp.g*255;im.data[k+2]=tmp.b*255;im.data[k+3]=255;
  if(em){em.data[k]=lc.r*255*glowv;em.data[k+1]=lc.g*255*glowv;em.data[k+2]=lc.b*255*glowv;em.data[k+3]=255}}
 };
 const fin=()=>{x.putImageData(im,0,0);const t=new THREE.CanvasTexture(cv);
 let et=null;if(em){const cv2=document.createElement('canvas');cv2.width=W2;cv2.height=H2;cv2.getContext('2d').putImageData(em,0,0);et=new THREE.CanvasTexture(cv2)}
 return{map:t,em:et}};
 // a job paints a few rows at a time, so a world full of planets can finish its skins in idle moments
 if(job){let j=0;return{step(until){while(j<H2&&performance.now()<until)row(j++);return j<H2?null:fin()}}}
 for(let j=0;j<H2;j++)row(j);return fin()}
function llSphere(r,w,h){return new THREE.SphereGeometry(r,w||48,h||32)}
function rimMat(col,pw,k){return new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.BackSide,uniforms:{uCol:{value:C(col)},uP:{value:pw||2.4},uK:{value:k||1}},
 vertexShader:'varying vec3 vN,vW;void main(){vN=normalize(mat3(modelMatrix)*normal);vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',
 fragmentShader:'uniform vec3 uCol;uniform float uP,uK;varying vec3 vN,vW;void main(){vec3 V=normalize(cameraPosition-vW);float r=1.-abs(dot(normalize(vN),V));gl_FragColor=vec4(uCol*pow(r,uP)*uK,1.);}'})}
const VLIGHT=V3(.6,.8,.4).normalize();
const TEXQ=[];let texRun=false;
function texLater(mk,done){TEXQ.push({mk,done,job:null});if(!texRun){texRun=true;setTimeout(texPump,400)}}
function texPump(){const ric=window.requestIdleCallback;const go=dl=>{const until=performance.now()+Math.max(4,Math.min(12,dl&&dl.timeRemaining?dl.timeRemaining():8));
  while(TEXQ.length&&performance.now()<until){const q=TEXQ[0];if(!q.job)q.job=q.mk();const r=q.job.step(until);if(r){TEXQ.shift();try{q.done(r)}catch(e){}}}
  if(TEXQ.length)(ric?ric(go,{timeout:600}):setTimeout(()=>go(null),30));else texRun=false};
 ric?ric(go,{timeout:600}):setTimeout(()=>go(null),30)}
function planetObj(kp,w,sp){const g=new THREE.Group();const r=kp.r||50;const real=REALSKIN[w.id];const rf=real?real():null;const T=planetTex(kp,hashStr(w.id),rf,4);
 const metal=kp.metal||kp.tex==='metal';const m=mt('#ffffff',{map:T.map,roughness:metal?.42:.85,metalness:metal?.45:0});
 if(T.em){m.emissiveMap=T.em;m.emissive=C('#ffffff');m.emissiveIntensity=1.2}
 if(kp.glow){m.emissive=C(kp.c1||kp.c||'#88aaff');m.emissiveIntensity=typeof kp.glow==='number'?kp.glow:.3;if(T.em)m.emissiveMap=T.em}
 const s=new THREE.Mesh(llSphere(r,64,40),m);g.add(s);g.userData.spinM=s;
 // a quick quarter-size skin now; the full one is painted when the page has a moment
 texLater(()=>planetTex(kp,hashStr(w.id),rf,1,true),F=>{const o=m.map,oe=m.emissiveMap;m.map=F.map;if(F.em&&m.emissiveMap===T.em)m.emissiveMap=F.em;if(o)o.dispose();if(oe&&oe!==m.emissiveMap)oe.dispose()});
 if(kp.atm){g.add(new THREE.Mesh(new THREE.SphereGeometry(r*1.09,48,32),rimMat(kp.atm,2.2,1.1)));const inner=new THREE.Mesh(new THREE.SphereGeometry(r*1.005,48,32),new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{uCol:{value:C(kp.atm)}},
   vertexShader:'varying vec3 vN,vW;void main(){vN=normalize(mat3(modelMatrix)*normal);vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',fragmentShader:'uniform vec3 uCol;varying vec3 vN,vW;void main(){vec3 V=normalize(cameraPosition-vW);float r=1.-max(dot(normalize(vN),V),0.);gl_FragColor=vec4(uCol*pow(r,3.)*.8,1.);}'}));g.add(inner)}
 if(['earth','ocean','jungle','moss'].includes(kp.tex)||kp.fog||kp.storm){const cm=cloudMat({cov:kp.fog||kp.storm?.38:.56,seed:(hashStr(w.id)%97)*.1,col:kp.fog?(kp.atm||'#d8d0c8'):'#ffffff'});cm.uniforms.uSun.value.copy(VLIGHT);const cl=new THREE.Mesh(new THREE.SphereGeometry(r*1.025,48,32),cm);g.add(cl);g.userData.cl=cl}
 if(kp.ring||kp.rings){const n=kp.rings?3:1;for(let i=0;i<n;i++){const ri=r*(1.45+i*.28),ro=r*(1.66+i*.28);const rg=new THREE.RingGeometry(ri,ro,96,2);const p=rg.attributes.position,uv=rg.attributes.uv;for(let k=0;k<p.count;k++){uv.setXY(k,(Math.hypot(p.getX(k),p.getY(k))-ri)/(ro-ri),.5)}
   const band=canvasTex(128,4,(x)=>{for(let q=0;q<128;q++){const a=(.35+.65*n3(q*.21,i,3))*(Math.sin(q/127*Math.PI));x.fillStyle=`rgba(255,255,255,${a*.85})`;x.fillRect(q,0,1,4)}});
   const t=new THREE.Mesh(rg,new THREE.MeshBasicMaterial({map:band,color:kp.c2||'#c8b890',transparent:true,side:THREE.DoubleSide,depthWrite:false}));t.rotation.x=Math.PI/2.3+i*.12;g.add(t)}}
 const nm=kp.moons||kp.moon?(kp.moons?kp.moons|0||3:1):0;for(let i=0;i<nm;i++){const mo=new THREE.Mesh(new THREE.SphereGeometry(r*(w.id==='v_rongqiu'?.15:.18),24,16),w.id==='v_rongqiu'?EMI('#7fc6ff',.6):detailMat(mt(i?'#a8a090':'#c8d0d8').clone(),{bump:.4,freq:8}));mo.userData.orbit={r:r*(1.9+i*.5),sp:.12+i*.07,ph:i*2};g.add(mo)}
 if(kp.half){const cut=new THREE.Mesh(new THREE.CircleGeometry(r*1.001,48),EMI('#ff7a3a',.5));cut.rotation.y=Math.PI/2;g.add(cut)}
 if(kp.dark)s.material.color.multiplyScalar(.5);
 if(kp.plats||kp.isles){const n=kp.plats||kp.isles;for(let i=0;i<n;i++){const a=i/n*6.28;const p=new THREE.Mesh(kcy(r*.18,r*.08,r*.06,8),mt('#c8b898'));p.position.set(Math.cos(a)*r*1.35,Math.sin(i*1.7)*r*.3,Math.sin(a)*r*1.35);g.add(p)}}
 if(kp.debris){g.add(instGroup(kd(1),mt('#6a6058',{flatShading:true}),Array.from({length:40}),(o,_,i)=>{const a=i*2.4,d=r*(1.3+h3(i,1,1)*.6);o.position.set(Math.cos(a)*d,(h3(i,2,1)-.5)*r*.4,Math.sin(a)*d);o.scale.setScalar(r*(.02+h3(i,3,1)*.04))}))}
 if(kp.spikes){g.add(instGroup(kc(1,1,5),mt(kp.c2||'#3a2a1a'),Array.from({length:60}),(o,_,i)=>{const v=V3(h3(i,1,2)-.5,h3(i,2,2)-.5,h3(i,3,2)-.5).normalize();o.position.copy(v).multiplyScalar(r);o.quaternion.setFromUnitVectors(V3(0,1,0),v);o.scale.set(r*.04,r*(.12+h3(i,4,2)*.2),r*.04)}))}
 if(kp.hollow){const hol=new THREE.Mesh(new THREE.CircleGeometry(r*.5,32),new THREE.MeshBasicMaterial({color:'#05040a'}));hol.position.z=r*.88;g.add(hol)}
 if(kp.dome){g.add(new THREE.Mesh(new THREE.SphereGeometry(r*1.15,32,20),mt('#cfefff',{transparent:true,opacity:.18,roughness:.05,metalness:.3,depthWrite:false})))}
 return g}
/* skins painted from the real terrain of the three planets */
const REALSKIN={v_rongqiu:()=>{const c=new THREE.Color();const f=(d,lat,out)=>{const h=RQ?gridSample(RQ.G,RQ.G.H,d):rqHeight(d);lushColor(d,h,lat,out);if(h>2){const sw=Math.max(nearD(d,SOUTHW,6,22),sm(-48,-62,lat))*.92;out.lerp(PC.snow,sw)}if(h<0)out.lerp(C('#1d6a8a'),.6*sm(-1,-20,h)+.25);if(lat>66||lat<-70)out.lerp(C('#e8f2f6'),.9)};return f},
 v_ximin:()=>(d,lat,out)=>{const h=ximinH(d);ximinC(d,h,lat,out);if(h<0)out.lerp(C('#12384a'),.7)},
 v_erxi:()=>(d,lat,out)=>{const h=erxiH(d);erxiC(d,h,lat,out);if(h<0)out.lerp(C('#1b5f7c'),.6)}};

function instGroup(geo,material,pts,setter){const im=new THREE.InstancedMesh(geo,material,Math.max(1,pts.length));const o=new THREE.Object3D();pts.forEach((p,i)=>{o.position.set(0,0,0);o.rotation.set(0,0,0);o.scale.set(1,1,1);setter(o,p,i);o.updateMatrix();im.setMatrixAt(i,o.matrix)});im.frustumCulled=false;return im}
function swarmPts(n,spread,col,size,seed,add){const a=[];const Rn=rnd(seed);for(let i=0;i<n;i++){const v=V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize().multiplyScalar(spread*Math.cbrt(Rn()));a.push(v)}const p=sparkles(a,col,size,1,1);if(add===false)p.material.blending=THREE.NormalBlending;return p}
const swirlTex=canvasTex(256,256,(x)=>{x.translate(128,128);for(let i=0;i<7;i++){x.strokeStyle=`rgba(255,255,255,${.55-i*.06})`;x.lineWidth=7-i*.6;x.beginPath();for(let a=0;a<6.28*1.8;a+=.04){const r=6+a*10+i*2;const px2=Math.cos(a+i*.9)*r,py=Math.sin(a+i*.9)*r;a===0?x.moveTo(px2,py):x.lineTo(px2,py)}x.stroke()}});

/* ---------- the kit of shapes ---------- */
function kitShape(w,sp,frozen){const k=w.k,kp=w.kp||{};const c=kp.c||'#9fb4c8',c2=kp.c2||'#4a5a6a',S=kp.r||kp.s||20,seed=hashStr(w.id),Rn=rnd(seed);const g=new THREE.Group();let an=null;
 switch(k){
  case 'planet':{const o=planetObj(kp,w,sp);if(kp.canyon){const r=kp.r||50,sm=o.userData.spinM,Rc=rnd(hashStr(w.id)+7),path=[];for(let i=0;i<=40;i++){const u=i/40*Math.PI*1.3-.6,la=Math.sin(u*2.3)*.28+.1;path.push(V3(Math.cos(la)*Math.cos(u),Math.sin(la),Math.cos(la)*Math.sin(u)).multiplyScalar(r*1.002))}
    sm.add(new THREE.Mesh(ktube(path,r*.045,80,6),mt('#160806',{roughness:1})));const cu=new THREE.CatmullRomCurve3(path),hs=new THREE.SphereGeometry(1,12,8),hm=mt('#7a7470',{metalness:.65,roughness:.35,emissive:'#ff9a40',emissiveIntensity:.55});
    const hi=instGroup(hs,hm,Array.from({length:46}),(q,_,i)=>{const t=(i+Rc())/46,P=cu.getPointAt(Math.min(1,t)),side=i%2?1:-1,T=cu.getTangentAt(Math.min(1,t)),N=P.clone().normalize(),B=T.clone().cross(N).normalize();q.position.copy(P).addScaledVector(B,side*r*(.04+Rc()*.03)).addScaledVector(N,-r*.004);q.scale.setScalar(r*(.014+Rc()*.022))});sm.add(hi);
    const pts=[];for(let i=0;i<70;i++){const P=cu.getPointAt(Rc());pts.push(P.clone().multiplyScalar(1.006))}const gl=new THREE.Points(new THREE.BufferGeometry().setFromPoints(pts),new THREE.PointsMaterial({map:dotTex,color:'#ffb070',size:r*.07,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:.8}));sm.add(gl)}
const orb=o.children.filter(m=>m.userData.orbit);an=(t,dt)=>{o.userData.spinM.rotation.y+=dt*.018;if(o.userData.cl)o.userData.cl.rotation.y+=dt*.024;orb.forEach(m=>{const q=m.userData.orbit,a=t*q.sp+q.ph;m.position.set(Math.cos(a)*q.r,Math.sin(a*.7)*q.r*.15,Math.sin(a)*q.r)})};if(!frozen)anim(sp,o,an);return o}
  case 'core':{const s=new THREE.Mesh(new THREE.SphereGeometry(S*.35,32,24),kp.dark?mt(c,{roughness:.4}):new THREE.MeshBasicMaterial({color:c}));g.add(s);const sp1=glowSprite(c,S*3,kp.dark?.2:.7);g.add(sp1);const sp2=glowSprite(c,S*8,kp.dark?.08:.22);g.add(sp2);
   if(!kp.dark)g.add(swarmPts(260,S*1.6,c,S*.06,seed));an=t=>{sp1.material.opacity=(kp.dark?.2:.55)+Math.sin(t*.8)*.12;g.rotation.y=t*.02};break}
  case 'star':{const s=new THREE.Mesh(new THREE.SphereGeometry(S,48,32),new THREE.ShaderMaterial({uniforms:{uT:GT,uC:{value:C(c)}},vertexShader:'varying vec3 vP,vN,vW;void main(){vP=position;vN=normalize(mat3(modelMatrix)*normal);vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',
    fragmentShader:GLSL_NOISE+'uniform float uT;uniform vec3 uC;varying vec3 vP,vN,vW;void main(){vec3 V=normalize(cameraPosition-vW);float mu=max(dot(normalize(vN),V),0.);float n=fb3(normalize(vP)*5.+vec3(uT*.05));vec3 c=mix(uC*1.1,vec3(1.,.98,.9),pow(mu,1.5)*.6)*(.8+.5*n);gl_FragColor=vec4(c*1.2,1.);}'}));g.add(s);
   g.add(glowSprite(c,S*4.5,.9));g.add(glowSprite(c,S*11,.25));const l=new THREE.PointLight(C(c),1.4,S*40);g.add(l);
   g.add(emitter({n:160,life:4,speed:S*.08,spread:1.2,size:S*.35,dir:[0,0,0],col:c,col2:'#ff5a2a',op:.6,disc:S*.95,area:[0,S*1.8,0]}));
   if(kp.tube){const tb=new THREE.Mesh(new THREE.CylinderGeometry(S*.12,S*.12,S*6,24,1,true),mt('#26262c',{side:THREE.DoubleSide}));tb.rotation.z=Math.PI/2.6;g.add(tb)}
   if(kp.plats){for(let i=0;i<kp.plats;i++){const a=i/kp.plats*6.28;const p=new THREE.Group();const d=new THREE.Mesh(kcy(S*.14,S*.12,S*.03,16),mt('#e8d8b8',{metalness:.3}));p.add(d);for(let j=0;j<6;j++){const b=new THREE.Mesh(kb(S*.03,S*.04,S*.03),mt('#d8c8a8'));b.position.set((h3(i,j,1)-.5)*S*.2,S*.03,(h3(i,j,2)-.5)*S*.2);p.add(b)}p.position.set(Math.cos(a)*S*1.55,Math.sin(i*2.1)*S*.25,Math.sin(a)*S*1.55);g.add(p)}}
   if(kp.n){for(let i=0;i<kp.n;i++){const a=i/kp.n*6.28;const st=new THREE.Mesh(new THREE.SphereGeometry(S*.25,16,12),new THREE.MeshBasicMaterial({color:c}));st.position.set(Math.cos(a)*S*2.6,0,Math.sin(a)*S*2.6);g.add(st);const sg=glowSprite(c,S*1.6,.6);sg.position.copy(st.position);g.add(sg)}}
   if(kp.flare){const fl=emitter({n:220,life:2.5,speed:S*.5,spread:.5,size:S*.4,dir:[1,.2,0],col:'#ffd070',col2:'#ff3010',op:.8,area:[S*.4,S*.4,S*.4]});g.add(fl)}
   if(kp.sim){for(let i=0;i<(kp.worlds||9);i++){const a=i/(kp.worlds||9)*6.28;const pl=new THREE.Mesh(new THREE.SphereGeometry(S*.08,16,12),mt(['#6a9a5a','#5a8ac8','#c8a86a','#b86a5a'][i%4]));pl.position.set(Math.cos(a)*S*1.7,Math.sin(a*2)*S*.2,Math.sin(a)*S*1.7);g.add(pl)}}
   an=t=>{s.rotation.y=t*.03;l.intensity=1.3+Math.sin(t*1.7)*.15};break}
  case 'rocks':{const n=Math.min(kp.n||120,320),r=kp.r||120,s=kp.s||5;const rm=detailMat(mt(c,{roughness:.9,flatShading:true,metalness:kp.metal?.5:0}),{bump:.5,freq:3});
   g.add(instGroup(kp.shards?ko(1):kd(1),rm,Array.from({length:n}),(o)=>{const a=Rn()*6.28;let d=r*Math.sqrt(Rn());if(kp.ring)d=r*(.75+Rn()*.25);o.position.set(Math.cos(a)*d,(Rn()-.5)*r*(kp.ring?.08:.35),Math.sin(a)*d);o.scale.set(s*(.3+Rn()*1.4),s*(.3+Rn()*1.4)*(kp.shards?2.5:1),s*(.3+Rn()*1.4));o.rotation.set(Rn()*3,Rn()*3,Rn()*3)}));
   if(kp.city){g.add(instGroup(kb(1,1,1),EMI('#ffd890',.6),Array.from({length:60}),(o)=>{const a=Rn()*6.28,d=r*Math.sqrt(Rn());o.position.set(Math.cos(a)*d,(Rn()-.5)*r*.35+s*.5,Math.sin(a)*d);o.scale.setScalar(s*.25)}))}
   if(kp.glow)g.add(swarmPts(80,r*.8,kp.glow,s*.8,seed));if(kp.ice)g.add(swarmPts(120,r*.9,'#e8f8ff',s*.5,seed));
   if(kp.star){g.add(new THREE.Mesh(new THREE.SphereGeometry(r*.12,24,16),new THREE.MeshBasicMaterial({color:kp.star})));g.add(glowSprite(kp.star,r*.9,.7));g.add(new THREE.PointLight(C(kp.star),1,r*6))}an=t=>{g.rotation.y=t*.01};break}
  case 'rockworld':{const geo=new THREE.IcosahedronGeometry(S,4);const p=geo.attributes.position;for(let i=0;i<p.count;i++){const v=V3(p.getX(i),p.getY(i),p.getZ(i));v.multiplyScalar(.75+fbm(v.x/S*2+seed%9,v.y/S*2,v.z/S*2,4)*.6);p.setXYZ(i,v.x,v.y,v.z)}geo.computeVertexNormals();
   g.add(new THREE.Mesh(geo,detailMat(mt(c,{roughness:.9}),{bump:.8,freq:.6})));g.add(new THREE.Mesh(new THREE.SphereGeometry(S*1.08,32,24),rimMat(c2,3,.5)));break}
  case 'rock':{const m=new THREE.Mesh(new THREE.DodecahedronGeometry(S,1),detailMat(mt(c,{roughness:.9,flatShading:true}),{bump:.6,freq:2}));m.scale.set(1,.7,1.2);g.add(m);break}
  case 'whale':{const b=new THREE.Mesh(sharkGeo(S*4.6,S*.85,.9),detailMat(mt(c,{roughness:.6}),{bump:.6,freq:.3}));g.add(b);
   for(const s of[-1,1]){const f=new THREE.Mesh(wingGeo(S*1.8,S*1.2,'fin'),mt(c2,{side:THREE.DoubleSide}));f.position.set(S*.4,-S*.2,s*S*.7);if(s<0)f.scale.z=-1;g.add(f);g.userData['f'+s]=f}
   const tl=new THREE.Group();const tf=new THREE.Mesh(wingGeo(S,S*1.3,'fin').rotateX(-Math.PI/2),mt(c2,{side:THREE.DoubleSide}));tl.add(tf);const t2=tf.clone();t2.scale.y=-1;tl.add(t2);tl.position.x=-S*2.2;g.add(tl);
   const lp=[];for(let i=0;i<30;i++){const a=Rn()*6.28;lp.push(V3((Rn()-.5)*S*3.6,Math.sin(a)*S*.6,Math.cos(a)*S*.75))}g.add(sparkles(lp,kp.glow||'#bfefff',S*.18,1,.5));
   if(kp.station){const st=new THREE.Mesh(kb(S*1.6,S*.5,S*.8),mt('#8a9098',{metalness:.6}));st.position.y=S*.75;g.add(st);g.add(at(glowSprite('#ffd27a',S*.6,.8),0,S*1.1,0))}
   if(kp.shell){const sh=new THREE.Mesh(new THREE.SphereGeometry(S*1.1,24,12,0,6.283,0,1.4),detailMat(mt('#a89878',{roughness:.6}),{bump:.8,freq:.5}));sh.scale.set(1.8,.8,1);sh.position.y=S*.2;g.add(sh)}
   if(kp.seacuc){for(let i=0;i<30;i++){const s=new THREE.Mesh(kc(S*.08,S*.4,5),mt(c2));const a=i*.8;s.position.set(-S*2+i*S*.14,Math.cos(a)*S*.7,Math.sin(a)*S*.7);s.lookAt(s.position.clone().multiplyScalar(2));s.rotateX(Math.PI/2);g.add(s)}}
   if(kp.sleep)g.add(swarmPts(160,S*2.5,'#d8c8ff',S*.12,seed));
   an=t=>{g.rotation.z=Math.sin(t*.3)*.05;tl.rotation.y=Math.sin(t*.8)*.25;if(g.userData.f1){g.userData.f1.rotation.x=Math.sin(t*.8)*.2;g.userData['f-1'].rotation.x=-Math.sin(t*.8)*.2}};break}
  case 'gate':{const t=new THREE.Mesh(new THREE.TorusGeometry(S,S*.12,12,64),detailMat(mt(c,{metalness:.5,roughness:.4}),{bump:.4,freq:3}));g.add(t);for(let i=0;i<12;i++){const n=new THREE.Mesh(kb(S*.12,S*.3,S*.2),mt('#5a4a4a',{metalness:.5}));const a=i/12*6.28;n.position.set(Math.cos(a)*S,Math.sin(a)*S,0);n.rotation.z=a;g.add(n)}
   const d=new THREE.Mesh(new THREE.CircleGeometry(S*.9,48),new THREE.MeshBasicMaterial({map:swirlTex,color:kp.glow||'#8ab8ff',transparent:true,opacity:.45,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));g.add(d);an=t=>{d.rotation.z=-t*.4};break}
  case 'portal':{const s=kp.s||40;const ring=new THREE.Mesh(new THREE.TorusGeometry(s,s*.07,10,80),kp.dark?mt('#1a1a20',{metalness:.6,roughness:.3}):EMI(c,.9));g.add(ring);
   const d=new THREE.Mesh(new THREE.CircleGeometry(s*.94,64),new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:kp.dark?THREE.NormalBlending:THREE.AdditiveBlending,uniforms:{uT:GT,uC:{value:C(c)},uD:{value:kp.dark?1:0}},
    vertexShader:'varying vec2 vU;void main(){vU=uv-.5;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:GLSL_NOISE+'uniform float uT,uD;uniform vec3 uC;varying vec2 vU;void main(){float r=length(vU)*2.;float a=atan(vU.y,vU.x);float sw=sin(a*3.+r*9.-uT*1.6+vn3(vec3(vU*6.,uT*.2))*3.)*.5+.5;float core=1.-smoothstep(0.,.5,r);vec3 col=mix(uC*sw,vec3(1.),core*.7);float al=smoothstep(1.,.85,r)*(.35+.65*sw);if(uD>.5){col=mix(vec3(.02),uC*.6,sw*.5);al=smoothstep(1.,.8,r)*.92;}gl_FragColor=vec4(col,al);}'}));g.add(d);
   g.add(glowSprite(kp.dark?'#6a6aaa':c,s*(kp.dark?3:3.6),kp.dark?.25:.45));
   const inflow=emitter({n:120,life:3,speed:-s*.3,spread:0,size:s*.1,dir:[0,0,0],col:kp.dark?'#9a9ab0':c,op:.8,disc:s*2.2,area:[0,s*.2,0],fadeIn:.4});inflow.rotation.x=Math.PI/2;g.add(inflow);
   an=t=>{g.lookAt(camera.position)};break}
  case 'blob':{const geo=new THREE.IcosahedronGeometry(S,4);const p=geo.attributes.position;for(let i=0;i<p.count;i++){const v=V3(p.getX(i),p.getY(i),p.getZ(i));v.multiplyScalar(.8+n3(v.x/S*2+seed%7,v.y/S*2,v.z/S*2)*.4);p.setXYZ(i,v.x,v.y,v.z)}geo.computeVertexNormals();
   const m=new THREE.Mesh(geo,mt(c,{roughness:kp.metal?.15:.35,metalness:kp.metal?.9:0,transparent:!kp.metal,opacity:kp.metal?1:.85,emissive:c,emissiveIntensity:kp.hot?.8:kp.holo?.7:.15}));g.add(m);
   if(kp.tentacles||kp.flesh)for(let i=0;i<10;i++){const pts=[];const a=i/10*6.28;for(let j=0;j<=7;j++)pts.push(V3(Math.cos(a)*S*(.8+j*.2),-S*.3-j*S*.35,Math.sin(a)*S*(.8+j*.2)));const tt=new THREE.Mesh(ktube(pts,S*.08,16,6),mt(c2));g.add(tt)}
   if(kp.rainbow)g.add(swarmPts(120,S*2,'#ffd8f8',S*.2,seed));if(kp.hot){g.add(glowSprite(c,S*5,.5));g.add(emitter({n:80,life:2,speed:S*.3,spread:1,size:S*.3,dir:[0,1,0],col:'#ffb060',col2:'#ff3010',op:.7,area:[S,S,S]}))}
   an=t=>{m.scale.setScalar(1+Math.sin(t*1.2+seed)*.04);m.rotation.y=t*.1};break}
  case 'station':{const s=S;if(kp.slab){const L=s*4.2,H=s*.8,D=s*1.1,mm=mt(c,{metalness:.45,roughness:.6}),dk=mt('#5a5248',{metalness:.4,roughness:.7});const body=new THREE.Mesh(kb(L,H,D),mm);g.add(body);for(const x of[-1,0,1]){const rib=new THREE.Mesh(kb(s*.12,H*1.06,D*1.04),dk);rib.position.x=x*L*.33;g.add(rib)}const top=new THREE.Mesh(kb(L*.5,H*.35,D*.6),mm);top.position.set(-L*.1,H*.67,0);g.add(top);
    const WN=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({color:'#ffe0a0',side:THREE.DoubleSide}),160),o3=new THREE.Object3D();let k=0;for(const zs of[-1,1])for(let r=0;r<3;r++)for(let i=0;i<26&&k<160;i++){if(Rn()<.3)continue;o3.position.set(-L*.47+i*L*.037,-H*.28+r*H*.26,zs*(D/2+.05));o3.rotation.set(0,0,0);o3.scale.set(s*.07,s*.06,1);o3.updateMatrix();WN.setMatrixAt(k++,o3.matrix)}WN.count=k;g.add(WN);
    for(const zs of[-1,1])for(let i=0;i<5;i++){const x=-L*.4+i*L*.2,pier=new THREE.Mesh(kb(s*.12,s*.08,s*.7),dk);pier.position.set(x,-H*.3,zs*(D/2+s*.35));g.add(pier);const tee=new THREE.Mesh(kb(s*.5,s*.06,s*.1),dk);tee.position.set(x,-H*.3,zs*(D/2+s*.7));g.add(tee);const lt=new THREE.Mesh(sgeo(6),GL('#ffd27a'));lt.scale.setScalar(s*.04);lt.position.set(x,-H*.22,zs*(D/2+s*.72));g.add(lt)}
    g.rotation.y=.5;an=t=>{g.rotation.z=Math.sin(t*.15)*.04};break}
const mm=mt(c,{metalness:.6,roughness:.35});const hub=new THREE.Mesh(kcy(s*.4,s*.4,s*1.4,16),mm);g.add(hub);const ring=new THREE.Mesh(new THREE.TorusGeometry(s*1.4,s*.12,8,48),mt(c2,{metalness:.5}));ring.rotation.x=Math.PI/2;g.add(ring);
   for(let i=0;i<6;i++){const spk=new THREE.Mesh(kb(s*1.4,s*.06,s*.06),mt(c2));spk.rotation.y=i/6*Math.PI;g.add(spk)}
   for(const yy of[-1,1]){const pn=new THREE.Mesh(kb(s*2.4,s*.04,s*.7),mt('#2a4a7a',{metalness:.3,roughness:.3,emissive:'#0a1a3a',emissiveIntensity:.4}));pn.position.y=yy*s*.95;g.add(pn)}
   const lp=[];for(let i=0;i<16;i++){const a=i/16*6.28;lp.push(V3(Math.cos(a)*s*1.4,0,Math.sin(a)*s*1.4))}g.add(sparkles(lp,kp.glow||(kp.gold?'#ffd27a':'#ffd27a'),s*.25,1,.6));
   if(kp.ball){const b=new THREE.Mesh(new THREE.SphereGeometry(s*.6,24,16),mm);b.position.y=s*1.1;g.add(b)}if(kp.spikes)g.add(instGroup(kc(1,1,5),mt('#2a1a1a'),Array.from({length:30}),(o,_,i)=>{const a=i/30*6.28;o.position.set(Math.cos(a)*s*1.5,0,Math.sin(a)*s*1.5);o.rotation.z=-Math.PI/2;o.rotateX(a);o.scale.set(s*.06,s*.4,s*.06)}));
   if(kp.flesh){hub.material=mt('#a85a5a',{roughness:.5,emissive:'#5a1a1a',emissiveIntensity:.3})}if(kp.gold){hub.material=mt('#e8c25a',{metalness:.85,roughness:.25})}
   if(kp.factory)g.add(emitter({n:60,life:5,speed:s*.15,spread:.4,size:s*.5,dir:[0,1,0],col:'#8a8078',op:.35,add:false,tex:smokeTex,area:[s,s*.3,s]}));
   an=t=>{ring.rotation.z=t*.1};break}
  case 'swarm':{const n=Math.min(500,(kp.n||40)*6),spd=kp.s||30;if(kp.cube){const N=kp.n||6,u=spd*.1,stone=mt('#8e8c88',{roughness:.95});const st=new THREE.Group();const bd=new THREE.Mesh(new THREE.SphereGeometry(1,16,12),stone);bd.scale.set(u*.9,u*2.2,u*.9);bd.position.y=u*2.2;st.add(bd);const hd=new THREE.Mesh(new THREE.SphereGeometry(1,12,10),stone);hd.scale.setScalar(u*.7);hd.position.y=u*4.6;st.add(hd);for(const z of[-1,1]){const w=new THREE.Mesh(new THREE.SphereGeometry(1,10,8),stone);w.scale.set(u*.35,u*1.1,u*.12);w.position.set(z*u*1.2,u*3,0);w.rotation.z=z*.7;st.add(w)}const base=new THREE.Mesh(new THREE.CylinderGeometry(u*1.3,u*1.6,u*.6,8),stone);base.position.y=u*.3;st.add(base);g.add(st);
    const bx=kb(1,1,1),cone1=new THREE.CylinderGeometry(u*.02,u*.25,spd*.6,8,1,true);cone1.translate(0,spd*.3,0);const A=[];
    for(let i=0;i<N;i++){const q=new THREE.Group(),a=i/N*6.28+Rn()*.4,r=spd*(.28+Rn()*.08);q.position.set(Math.cos(a)*r,u*(1.2+Rn()),Math.sin(a)*r);const mi=new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.7,blending:THREE.AdditiveBlending,depthWrite:false}),mo=mi.clone();mo.opacity=.22;const ci=new THREE.Mesh(bx,mi);ci.scale.setScalar(u*.9);const co=new THREE.Mesh(bx,mo);co.scale.setScalar(u*1.35);q.add(ci,co);
     const ey=new THREE.Group();const em=new THREE.MeshBasicMaterial({color:'#5aa8ff',transparent:true,opacity:.0,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide});const ray=new THREE.Mesh(cone1,em);const dot=new THREE.Mesh(new THREE.SphereGeometry(u*.16,8,6),em);ey.add(ray,dot);q.add(ey);g.add(q);A.push({q,mi,mo,ey,em,ph:Rn()*6.28,h:C(c).getHSL({}).h,on:-1})}
    an=t=>{for(let i=0;i<A.length;i++){const o=A[i],f=.5+.3*Math.sin(t*3.1+o.ph)+.2*Math.sin(t*7.3+o.ph*2);o.mi.opacity=.45+.4*f;o.mo.opacity=.12+.18*f;o.mi.color.setHSL((o.h+.07*Math.sin(t*.6+o.ph)+1)%1,.85,.62);o.mo.color.setHSL((o.h+.12*Math.sin(t*.45+o.ph+1)+1)%1,.8,.6);o.q.rotation.y=t*.3+o.ph;o.q.position.y+=Math.sin(t*1.2+o.ph)*u*.004;
     const k=Math.sin(t*.8+o.ph*3);if(k>.82){if(o.on<0){o.on=1;o.ey.rotation.set((Rn()-.5)*2.4,Rn()*6.28,(Rn()-.5)*2.4)}o.em.opacity=Math.min(1,(k-.82)*12)*.85}else{o.on=-1;o.em.opacity=0}o.ey.visible=o.em.opacity>0}}}
   else if(kp.sack){const N=kp.n||40,sg=new THREE.BoxGeometry(1,.38,1,6,2,6),pa=sg.attributes.position,v=V3();for(let i=0;i<pa.count;i++){v.fromBufferAttribute(pa,i);const r=v.length()||1;const k=.45;v.x=v.x*(1-k)+v.x/r*.62*k;v.z=v.z*(1-k)+v.z/r*.62*k;v.y*=1-.35*Math.min(1,(v.x*v.x+v.z*v.z)*2.5);pa.setXYZ(i,v.x,v.y,v.z)}sg.computeVertexNormals();
    const im=new THREE.InstancedMesh(sg,mt(c,{roughness:.95,side:THREE.DoubleSide}),N);im.frustumCulled=false;g.add(im);const P=[];for(let i=0;i<N;i++)P.push([(Rn()-.5)*spd*1.4,(Rn()-.5)*spd*.6,(Rn()-.5)*spd*1.4,spd*.17*(.6+Rn()*.8),Rn()*6.28,Rn()*6.28]);g.add(swarmPts(80,spd,c,spd*.05,seed));
    const o=new THREE.Object3D();an=t=>{for(let i=0;i<N;i++){const q=P[i],w=Math.sin(t*1.7+q[4]);o.position.set(q[0]+Math.sin(t*.21+q[5])*spd*.12,q[1]+Math.sin(t*.33+q[4])*spd*.08,q[2]+Math.cos(t*.19+q[5])*spd*.12);o.rotation.set(Math.sin(t*.4+q[5])*.5,q[5]+t*.15,Math.cos(t*.5+q[4])*.4);o.scale.set(q[3]*(1+w*.18),q[3]*(1-w*.12),q[3]*(1-w*.15));o.updateMatrix();im.setMatrixAt(i,o.matrix)}im.instanceMatrix.needsUpdate=true}}
   else if(kp.balloon){g.add(instGroup(new THREE.SphereGeometry(1,12,8),mt(c,{roughness:.6}),Array.from({length:kp.n||40}),o=>{o.position.set((Rn()-.5)*spd*2,(Rn()-.5)*spd,(Rn()-.5)*spd*2);o.scale.set(spd*.08,spd*.1,spd*.08)}));an=t=>{g.position.y=Math.sin(t*.4)*spd*.1}}
   else{const pts=[];for(let i=0;i<n;i++)pts.push(V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize().multiplyScalar(spd*Math.cbrt(Rn())));const geo=new THREE.BufferGeometry().setFromPoints(pts);const base=pts.map(v=>v.clone());
    const dark=C(c).getHSL({}).l<.3;const p=new THREE.Points(geo,new THREE.PointsMaterial({map:dotTex,color:c,size:Math.max(2,spd*.1),transparent:true,blending:dark?THREE.NormalBlending:THREE.AdditiveBlending,depthWrite:false,opacity:dark?.9:1}));g.add(p);if(!dark)g.add(glowSprite(c,spd*2.4,.16));
    const a=geo.attributes.position.array;an=t=>{for(let i=0;i<base.length;i++){const v=base[i];a[i*3]=v.x+Math.sin(t*1.3+i)*spd*.07;a[i*3+1]=v.y+Math.cos(t*1.1+i*.7)*spd*.07;a[i*3+2]=v.z+Math.sin(t*.9+i*1.3)*spd*.07}geo.attributes.position.needsUpdate=true;g.rotation.y=t*.05}}break}
  case 'flock':case 'bird':{const n=kp.n||12,s=kp.s||8,orb=k==='bird'?s*3:s*4;
   if(k==='bird'&&n===1&&!kp.brick){const b=bDragon({w:kp.starry?'guanglong':'feilong',col:c});b.scale.setScalar(s*.8);g.add(b);if(kp.starry)g.add(swarmPts(160,s*2,'#e8f0ff',s*.12,seed));const fe=emitter({n:120,life:1.6,speed:s*.4,spread:.4,size:s*.3,dir:[-1,0,0],col:c,col2:'#ff3010',op:.8,area:[s*.5,s*.3,s*.3]});g.add(fe);an=t=>{b.userData.anim&&b.userData.anim(t);g.position.y=Math.sin(t*.6)*s*.4};break}
   const geo=kp.brick?G([[kb(1.4,.6,.8),c],[wingGeo(1.3,.6,'bat'),C(c).multiplyScalar(.55),{p:[.25,.18,.4],r:[-.45,-Math.PI/2,0]}],[wingGeo(1.3,.6,'bat'),C(c).multiplyScalar(.55),{p:[.25,.18,-.4],r:[.45,Math.PI/2,0],s:[1,1,-1]}]]):kp.ray?kc(.8,1.6,3):k==='bird'?G([[sgeo(8),c,{s:[.6,.3,.3]}],[wingGeo(1.4,.6,'bat'),c,{p:[0,0,.1]}],[wingGeo(1.4,.6,'bat'),c,{p:[0,0,-.1],s:[1,1,-1]}]]):kc(.45,1.6,3);
   const im=new THREE.InstancedMesh(geo,k==='bird'?(kp.brick?VC({side:THREE.DoubleSide}):VC({emissive:c,emissiveIntensity:.6,side:THREE.DoubleSide})):kp.brick?VC({side:THREE.DoubleSide}):mt(c,{side:THREE.DoubleSide}),n);im.frustumCulled=false;g.add(im);if(k==='bird')g.add(swarmPts(60,orb,c,s*.25,seed));
   const o=new THREE.Object3D();an=t=>{for(let i=0;i<n;i++){const a=t*.35+i/n*6.28,r=orb*(.6+(i%4)*.15);o.position.set(Math.cos(a)*r,Math.sin(t*1.5+i)*s*.6+(i%3-1)*s*.5,Math.sin(a)*r);o.rotation.set(0,-a-Math.PI/2,Math.sin(t*6+i)*.2);o.scale.set(s,s*(k==='bird'?Math.abs(Math.sin(t*5+i))*.6+.5:1),s);o.updateMatrix();im.setMatrixAt(i,o.matrix)}im.instanceMatrix.needsUpdate=true};break}
  case 'ship':{const n=Math.max(1,Math.min(kp.n||1,12)),s=S;const mm=mt(c,{metalness:.55,roughness:.35});
   for(let i=0;i<n;i++){const sh=new THREE.Group();const h=new THREE.Mesh(sharkGeo(s*3,s*.4,.7),mm);sh.add(h);const br=new THREE.Mesh(kb(s*.7,s*.4,s*.45),mt(c2,{metalness:.4}));br.position.set(-s*.4,s*.35,0);sh.add(br);
    for(const z of[-1,1]){const wg=new THREE.Mesh(wingGeo(s*.9,s*.8,'fin'),mm);wg.position.set(-s*.2,0,z*s*.25);if(z<0)wg.scale.z=-1;sh.add(wg)}
    const en=new THREE.Mesh(new THREE.SphereGeometry(s*.18,10,8),new THREE.MeshBasicMaterial({color:kp.glow||'#8ad8ff'}));en.position.x=-s*1.5;sh.add(en);sh.add(at(glowSprite(kp.glow||'#8ad8ff',s*1.6,.7),-s*1.6,0,0));
    if(kp.skull){const sk=new THREE.Mesh(new THREE.SphereGeometry(s*.45,16,12),mt('#d8d0c0'));sk.position.x=s*1.2;sk.scale.set(1.1,.9,1);sh.add(sk);for(const z of[-1,1])sh.add(at(new THREE.Mesh(sgeo(6),GL('#ff3a2a')),s*1.55,s*.08,z*s*.18))}
    if(kp.wreck){const N=110,ch=new THREE.InstancedMesh(lumpRock(1,17),mt('#ffffff',{roughness:.95,flatShading:true}),N),o3=new THREE.Object3D(),cc=new THREE.Color(),WC=['#3a332c','#4a4038','#2a2624','#6a5a48','#bdb29a','#57504a'];for(let i=0;i<N;i++){const x=(Rn()*2.6-1.45)*s,ta=1-Math.min(1,Math.abs(x/s+.15)/1.5),a=Rn()*6.28,r=s*(.12+ta*.26)*(.85+Rn()*.35);o3.position.set(x,Math.sin(a)*r*.75,Math.cos(a)*r);o3.rotation.set(Rn()*3,Rn()*3,Rn()*3);const k=s*(.04+Rn()*.11)*(.5+ta);o3.scale.set(k*(.7+Rn()*.9),k*(.5+Rn()*.6),k*(.7+Rn()*.6));o3.updateMatrix();ch.setMatrixAt(i,o3.matrix);ch.setColorAt(i,cc.set(WC[i%6]))}sh.add(ch);
     const bm=mt('#cfc5ae',{roughness:.8});for(let i=0;i<14;i++){const x=(-1.1+i*.15)*s,sp=new THREE.Mesh(new THREE.ConeGeometry(s*.03,s*(.35+Rn()*.35),5),bm);const side=i%2?1:-1;sp.position.set(x,s*.18,side*s*.12);sp.rotation.set(side*(.5+Rn()*.4),0,-.3-Rn()*.4);sh.add(sp)}}
    if(kp.spike||kp.needle){const sp2=new THREE.Mesh(kc(s*.1,s*1.6,5),mm);sp2.rotation.z=-Math.PI/2;sp2.position.x=s*2.2;sh.add(sp2)}
    if(kp.bone){h.material=mt('#e8e0c8',{roughness:.6})}
    if(n>1)sh.position.set((Rn()-.5)*s*8,(Rn()-.5)*s*3,(Rn()-.5)*s*8);g.add(sh)}
   an=t=>{g.position.y=Math.sin(t*.5+seed)*S*.2;g.children.forEach((sh,i)=>sh.rotation.z=Math.sin(t*.7+i)*.05)};break}
  case 'fog':{const n=kp.n||9,r=kp.r||60;const fm=new THREE.SpriteMaterial({map:smokeTex,color:c,transparent:true,opacity:.55,depthWrite:false});const L=[];
   for(let i=0;i<n*2;i++){const s=new THREE.Sprite(fm);const sz=r*(.7+Rn()*.9);s.scale.set(sz,sz*.7,1);s.position.set((Rn()-.5)*r*1.8,(Rn()-.5)*r*.7,(Rn()-.5)*r*1.8);s.userData.b=s.position.clone();s.userData.ph=Rn()*6;g.add(s);L.push(s)}
   g.add(glowSprite(c,r*2.6,.14));
   let l=null;if(kp.lightning||kp.storm){l=new THREE.PointLight(0xcfe0ff,0,r*8);g.add(l)}
   if(kp.blades)g.add(instGroup(kc(.12,1,4),mt('#c8c8d0',{metalness:.7}),Array.from({length:30}),o=>{const v=V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize();o.position.copy(v).multiplyScalar(r*.6);o.quaternion.setFromUnitVectors(V3(0,1,0),v);o.scale.set(r*.12,r*.6,r*.12)}));
   if(kp.rainbow)g.add(swarmPts(80,r,'#fff0f8',r*.05,seed));
   // a sea of it (kp.waves): the puffs ride swells that roll across it
   if(kp.waves)an=t=>{for(const s of L){const b=s.userData.b,w=Math.sin(t*.9-b.x/r*3.2+b.z/r*.8);s.position.set(b.x+Math.sin(t*.2+s.userData.ph)*r*.06,b.y+w*r*.22,b.z)}if(l)l.intensity=(Math.sin(t*7.3+seed)>.965)?4:0};
   else an=t=>{L.forEach(s=>{s.position.copy(s.userData.b).add(V3(Math.sin(t*.2+s.userData.ph)*r*.08,Math.cos(t*.17+s.userData.ph)*r*.04,0))});if(l)l.intensity=(Math.sin(t*7.3+seed)>.965)?4:0};break}
  case 'squid':{const b=bSquid({col:c});b.scale.setScalar(S*.9);b.rotation.z=Math.PI/2;g.add(b);g.add(at(glowSprite('#fff4c0',S*.6,.7),0,S*.4,0));an=t=>{b.userData.anim&&b.userData.anim(t);g.rotation.y=t*.08;g.position.y=Math.sin(t*.6)*S*.15};break}
  case 'linked':{const n=kp.n||6,r=kp.r||60;const pts=[];for(let i=0;i<n;i++){const v=V3((Rn()-.5)*r*2.4,(Rn()-.5)*r*.8,(Rn()-.5)*r*2.4);pts.push(v);const pk={r:r*(.12+Rn()*.14),tex:i%2?'earth':'ocean',c1:i%2?kp.c1||c:'#5a8ad8',c2:kp.c2||c2,atm:'#bfe0ff'};const s=planetObj(pk,{id:w.id+i},sp);s.position.copy(v);g.add(s)}
   for(let i=1;i<n;i++){const a=pts[i-1],b=pts[i];const d=b.clone().sub(a);const cy=new THREE.Mesh(kcy(r*.015,r*.015,d.length(),6),GL('#ffd8a0',.6));cy.position.copy(a).add(b).multiplyScalar(.5);cy.quaternion.setFromUnitVectors(V3(0,1,0),d.normalize());g.add(cy)}
   const flow=[];for(let i=1;i<n;i++)for(let k2=0;k2<10;k2++)flow.push(pts[i-1].clone().lerp(pts[i],k2/10));const fl=sparkles(flow,'#fff0c8',r*.06,1,1);g.add(fl);break}
  case 'crystal':{const xm=mt(c,{emissive:c,emissiveIntensity:kp.frozen?.2:.45,roughness:.08,metalness:.1,flatShading:true,transparent:true,opacity:.9});const n=kp.n||12;for(let i=0;i<n;i++){const m=new THREE.Mesh(ko(S*.3),xm);m.position.set((Rn()-.5)*S,(Rn()-.3)*S*.5,(Rn()-.5)*S);m.scale.set(1,2+Rn()*2,1);m.rotation.set((Rn()-.5),Rn()*3,(Rn()-.5));g.add(m)}
   g.add(swarmPts(60,S*1.2,'#ffffff',S*.06,seed));if(kp.mirror)g.add(glowSprite('#ffffff',S*3,.25));if(kp.flakes)g.add(swarmPts(120,S*1.6,kp.c2||'#141414',S*.08,seed,false));an=t=>{g.rotation.y=t*.05};break}
  case 'ring':{const r=kp.r||60;const nR=kp.stack?Math.min(kp.n||4,10):1;for(let q=0;q<nR;q++){const t=new THREE.Mesh(new THREE.TorusGeometry(r*(1-q*.04),r*.07,10,96),mt(c,{metalness:.5,roughness:.35,emissive:kp.chain?c:'#000000',emissiveIntensity:kp.chain?.5:0}));t.rotation.x=Math.PI/2+(kp.stack?q*.3:0);t.position.y=kp.stack?(q-nR/2)*r*.12:0;g.add(t)}
   if(kp.city||kp.towers)g.add(instGroup(kb(1,1,1),mt(c2),Array.from({length:60}),(o,p,i)=>{const a=i/60*6.28;const h=r*(.04+Rn()*.1);o.position.set(Math.cos(a)*r,r*.07+h/2,Math.sin(a)*r);o.scale.set(r*.04,h,r*.04)}));
   if(!kp.stack&&kp.n>1)for(let i=1;i<Math.min(kp.n,4);i++){const t2=new THREE.Mesh(new THREE.TorusGeometry(r*(1+i*.3),r*.03,6,72),mt(c2));t2.rotation.x=Math.PI/2+i*.3;g.add(t2)}
   if(kp.flute)g.add(at(glowSprite('#ffd8a0',r*2,.5),0,0,0));an=t2=>{g.rotation.y=t2*.05;g.children.forEach((m,i)=>{if(m.geometry&&m.geometry.type==='TorusGeometry')m.rotation.z=t2*.05*(i%2?1:-1)})};break}
  case 'jelly':{const n=kp.n||1;for(let i=0;i<n;i++){const j=bJelly({w:'v',col:c});j.scale.setScalar(S*(n>1?.5:1));if(n>1)j.position.set((Rn()-.5)*S*4,(Rn()-.5)*S*2,(Rn()-.5)*S*4);g.add(j)}an=t=>{g.children.forEach((j,i)=>{j.userData.anim&&j.userData.anim(t+i);j.position.y+=Math.sin(t*.7+i)*.05})};break}
  case 'disc':{const d=new THREE.Mesh(kcy(S,S*.9,S*.18,64),detailMat(mt(c,{metalness:.4,roughness:.5}),{bump:.5,freq:2/Math.max(1,S/20)}));g.add(d);
   if(kp.eye){const e=new THREE.Mesh(new THREE.SphereGeometry(S*.3,24,16),new THREE.MeshBasicMaterial({color:kp.c2||'#ffd27a'}));e.position.y=S*.12;e.scale.y=.4;g.add(e);g.add(glowSprite('#ffd27a',S*1.6,.4));const pu=new THREE.Mesh(new THREE.SphereGeometry(S*.12,16,10),new THREE.MeshBasicMaterial({color:'#100808'}));pu.position.y=S*.2;pu.scale.y=.4;g.add(pu)}
   if(kp.hole){const h=new THREE.Mesh(new THREE.CircleGeometry(S*.6,48),new THREE.MeshBasicMaterial({color:'#000000'}));h.rotation.x=-Math.PI/2;h.position.y=S*.095;g.add(h);g.add(at(glowSprite('#8a5a3a',S*1.4,.25),0,S*.1,0))}
   if(kp.mud){const mud=new THREE.Mesh(new THREE.CircleGeometry(S*.92,48),mt('#4a3a2a',{roughness:.3,metalness:.2}));mud.rotation.x=-Math.PI/2;mud.position.y=S*.095;g.add(mud)}
   if(kp.mountains)g.add(instGroup(kc(1,1,6),mt(c2,{flatShading:true}),Array.from({length:20}),o=>{const a=Rn()*6.28,d=Rn()*S*.8;o.position.set(Math.cos(a)*d,S*.2,Math.sin(a)*d);o.scale.set(S*.1,S*.2+Rn()*S*.2,S*.1)}));
   const lp=[];for(let i=0;i<24;i++){const a=i/24*6.28;lp.push(V3(Math.cos(a)*S*.95,0,Math.sin(a)*S*.95))}g.add(sparkles(lp,kp.glow||'#bfe6ff',S*.08,1,.6));an=t=>{g.rotation.y=t*.05};break}
  case 'tube':{const L=kp.len||600,r=kp.r||40;const t=new THREE.Mesh(new THREE.CylinderGeometry(r,r,L,40,8,true),detailMat(mt(c,{side:THREE.DoubleSide,metalness:.3,roughness:.6}),{bump:.8,freq:.2}));t.rotation.z=Math.PI/2;g.add(t);
   for(let i=0;i<9;i++){const rg=new THREE.Mesh(new THREE.TorusGeometry(r*1.04,r*.05,8,40),GL(kp.glow||'#8a7aff',.75));rg.rotation.y=Math.PI/2;rg.position.x=-L/2+i*L/8;g.add(rg)}
   for(const s of[-1,1]){const mouth=glowSprite(kp.glow||'#8a7aff',r*4,.45);mouth.position.x=s*L/2;g.add(mouth)}
   const fl=emitter({n:150,life:5,speed:L*.18,spread:.05,size:r*.2,dir:[1,0,0],col:kp.glow||'#8a7aff',op:.6,area:[0,r*1.2,r*1.2],fadeIn:.1});fl.position.x=-L/2;g.add(fl);break}
  case 'city':{const s=kp.s||30;const base=new THREE.Mesh(kcy(s,s*(kp.float?.45:1),s*(kp.float?.7:.1),16),detailMat(mt(kp.float?'#6a6258':c2,{roughness:.9}),{bump:.6,freq:2}));base.position.y=kp.float?-s*.35:0;g.add(base);
   const tm=kp.crystal?mt(c,{emissive:c,emissiveIntensity:.35,roughness:.1,flatShading:true}):mt(c,{metalness:.35,roughness:.5});
   g.add(instGroup(kb(1,1,1),tm,Array.from({length:50}),o=>{const a=Rn()*6.28,d=Math.sqrt(Rn())*s*.85,h=s*(.1+Rn()*Rn()*.9);o.position.set(Math.cos(a)*d,h/2,Math.sin(a)*d);o.scale.set(s*.08+Rn()*s*.06,h,s*.08+Rn()*s*.06)}));
   const wl=[];for(let i=0;i<70;i++){const a=Rn()*6.28,d=Math.sqrt(Rn())*s*.85;wl.push(V3(Math.cos(a)*d,s*(.05+Rn()*.4),Math.sin(a)*d))}g.add(sparkles(wl,'#ffe0a8',s*.05,1,.5));
   if(kp.temple){const tp=new THREE.Mesh(kc(s*.3,s*.6,4),mt('#e8c86a',{metalness:.6,roughness:.3}));tp.position.y=s*.3;g.add(tp)}
   if(kp.hang){for(let i=0;i<12;i++){const a=i/12*6.28;const rope=new THREE.Mesh(kcy(s*.005,s*.005,s*1.4,3),mt('#8a8070'));rope.position.set(Math.cos(a)*s*.6,s*.8,Math.sin(a)*s*.6);g.add(rope)}}
   const l=new THREE.PointLight(0xffd8a0,.8,s*6);l.position.y=s*.6;g.add(l);if(kp.float)an=t=>{g.position.y=Math.sin(t*.4+seed)*s*.06};break}
  case 'vine':{const h=kp.len||S*8;for(let k2=0;k2<4;k2++){const pts=[];for(let i=0;i<=16;i++){const t=i/16,a=k2*1.6+t*9;pts.push(V3(Math.cos(a)*S*.5*(1-t*.5),t*h-h/2,Math.sin(a)*S*.5*(1-t*.5)))}g.add(new THREE.Mesh(ktube(pts,S*.08,60,6),detailMat(mt(c,{roughness:.8}),{bump:.6,freq:2})))}
   g.add(instGroup(new THREE.SphereGeometry(1,8,6),mt(c2||'#4a8a3a'),Array.from({length:60}),o=>{const t=Rn();o.position.set((Rn()-.5)*S,(t-.5)*h,(Rn()-.5)*S);o.scale.set(S*.2,S*.06,S*.2);o.rotation.set(Rn(),Rn(),Rn())}));
   const top=new THREE.Mesh(ki(S*.6,1),mt('#3a6a2a'));top.position.y=h/2;g.add(top);break}
  case 'cube':{const s=kp.s||30;const b=new THREE.Mesh(kb(s,s,s),mt(c,{metalness:.55,roughness:.35}));g.add(b);g.add(new THREE.LineSegments(new THREE.EdgesGeometry(kb(s*1.01,s*1.01,s*1.01)),new THREE.LineBasicMaterial({color:kp.cells?0xff6a6a:0x7ad8ff})));
   if(kp.cells||kp.grid){const cl=[];for(let i=0;i<60;i++){const f2=i%6,u2=(h3(i,1,1)-.5)*s*.9,v2=(h3(i,2,1)-.5)*s*.9;const p=f2<2?V3((f2?1:-1)*s*.51,u2,v2):f2<4?V3(u2,(f2===2?1:-1)*s*.51,v2):V3(u2,v2,(f2===4?1:-1)*s*.51);cl.push(p)}g.add(sparkles(cl,kp.cells?'#ffb0a0':'#8ad8ff',s*.06,1,.8))}
   if(kp.wall){b.scale.set(2.4,1.2,.25)}an=t=>{g.rotation.y=t*.08;g.rotation.x=Math.sin(t*.1)*.2};break}
  case 'skull':{const bm=mt(c||'#e8e0d0',{roughness:.6});const hd=new THREE.Mesh(new THREE.SphereGeometry(S,32,24),detailMat(bm,{bump:.4,freq:2/Math.max(1,S/20)}));hd.scale.set(1,.9,1.1);g.add(hd);const jaw=new THREE.Mesh(kb(S*1.1,S*.35,S*.9),bm);jaw.position.set(0,-S*.85,S*.25);g.add(jaw);
   for(const s of[-1,1]){const e=new THREE.Mesh(new THREE.SphereGeometry(S*.24,12,10),new THREE.MeshBasicMaterial({color:'#100808'}));e.position.set(s*S*.38,S*.05,S*.92);g.add(e);g.add(at(glowSprite('#ffb07a',S*.5,.6),s*S*.38,S*.05,S*1.0))}
   for(let i=0;i<8;i++){const tt=new THREE.Mesh(kb(S*.1,S*.16,S*.08),bm);tt.position.set(-S*.4+i*S*.115,-S*.65,S*.68);g.add(tt)}break}
  case 'vortex':{const n=1600,r=kp.r||60;const pts=[];for(let i=0;i<n;i++){const t=i/n,ang=t*6.28*5,rr=r*(.08+t);pts.push(V3(Math.cos(ang)*rr+(Rn()-.5)*r*.06,(Rn()-.5)*r*.08*(1-t*.5),Math.sin(ang)*rr+(Rn()-.5)*r*.06))}
   const p=sparkles(pts,c,r*.05,1,.3);g.add(p);g.add(glowSprite(c,r*1.2,.5));if(kp.light)g.add(glowSprite('#ffffff',r*.4,.9));if(kp.disc){const dk=new THREE.Mesh(new THREE.CircleGeometry(r*.1,24),new THREE.MeshBasicMaterial({color:'#000'}));g.add(dk)}
   // kp.storm: a wider storm of the same stuff churning round it
   if(kp.storm)g.add(evPoints(2600,seed+7,evSwarmMat({col:c,rx:r*2.6,ry:r*.5,rz:r*2.6,speed:.18,size:r*.06,op:.7})));an=t=>{p.rotation.y=-t*.35};break}
  case 'bridge':{const L=kp.len||S*10;const b=new THREE.Mesh(kb(L,S*.15,S*.8),detailMat(mt(c,{roughness:.8}),{bump:.5,freq:1}));g.add(b);for(let i=0;i<9;i++){const ar=new THREE.Mesh(new THREE.TorusGeometry(S*.9,S*.06,6,20,Math.PI),mt(c2));ar.position.x=-L/2+i*L/8;ar.rotation.y=Math.PI/2;g.add(ar)}
   const gl=new THREE.Mesh(kb(L,S*.03,S*.1),GL(kp.glow||'#ffe0a0',.8));gl.position.y=S*.1;g.add(gl);const lp=[];for(let i=0;i<40;i++)lp.push(V3(-L/2+i*L/39,S*.15,0));g.add(sparkles(lp,'#ffe8b0',S*.15,1,.5));break}
  case 'tree':{const tr=new THREE.Mesh(kcy(S*.15,S*.32,S*2.2,10),detailMat(mt(c2||'#5a4632',{roughness:.9}),{bump:.8,freq:2/Math.max(1,S/20)}));tr.position.y=S*1.1;g.add(tr);for(let i=0;i<7;i++){const cn=new THREE.Mesh(new THREE.IcosahedronGeometry(S*(.6-i*.05),2),mt(c,{roughness:.9}));cn.position.set((Rn()-.5)*S*.8,S*2+i*S*.22,(Rn()-.5)*S*.8);cn.scale.y=.6;g.add(cn)}
   for(let i=0;i<6;i++){const a=i/6*6.28;g.add(new THREE.Mesh(ktube([V3(0,S*.2,0),V3(Math.cos(a)*S*.5,0,Math.sin(a)*S*.5),V3(Math.cos(a)*S*.9,-S*.2,Math.sin(a)*S*.9)],S*.06,8),mt(c2||'#5a4632')))}break}
  case 'shadow':{const s=new THREE.Mesh(new THREE.SphereGeometry(S,32,24),new THREE.MeshBasicMaterial({color:kp.pale?'#d8d0e8':'#050508',transparent:true,opacity:kp.pale?.5:.88}));g.add(s);const ring=glowSprite(kp.pale?'#ffffff':'#6a5a9a',S*3.2,.3);g.add(ring);
   g.add(swarmPts(120,S*1.5,kp.pale?'#ffffff':'#3a3050',S*.08,seed,false));an=t=>{const k2=kp.shrink?(.6+.4*Math.abs(Math.sin(t*.3))):1+Math.sin(t*.9+seed)*.08;s.scale.setScalar(k2)};break}
  case 'cracks':case 'crack':{if(k==='cracks'){if(kp.glass){// two bubbles of space pressing into each other, seen as thin glassy shells
     for(const [dx,sc] of [[-S*.42,1],[S*.5,.82]]){const s=new THREE.Mesh(new THREE.SphereGeometry(S*sc,48,32),new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:.25,roughness:.2,metalness:.1,transparent:true,opacity:.13,depthWrite:false,side:THREE.DoubleSide}));s.position.x=dx;g.add(s)}
     const seam=new THREE.Mesh(new THREE.TorusGeometry(S*.72,S*.012,6,96),new THREE.MeshBasicMaterial({color:kp.c2||'#ffd27a',transparent:true,opacity:.8}));seam.rotation.y=Math.PI/2;seam.position.x=S*.05;g.add(seam)}
    else{const s=new THREE.Mesh(new THREE.SphereGeometry(S,48,32),mt(c,{roughness:.4,emissive:c,emissiveIntensity:.15}));g.add(s)}}
   const lm=new THREE.LineBasicMaterial({color:kp.c2||'#ff7a3a',transparent:true,opacity:.9});for(let i=0;i<22;i++){const pts=[];let v=V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize();for(let j=0;j<12;j++){v=v.clone().add(V3(Rn()-.5,Rn()-.5,Rn()-.5).multiplyScalar(.18)).normalize();pts.push(k==='cracks'?v.clone().multiplyScalar(S*1.01):V3(j*S*.3-S*1.8,(Rn()-.5)*S*.4,(Rn()-.5)*S*.1))}
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),lm))}g.add(glowSprite(kp.c2||'#ff7a3a',S*2.5,.25));if(k==='crack')g.add(glowSprite('#000000',S*2,.0));break}
  case 'island':{const r=kp.r||40;const top=new THREE.Mesh(kcy(r,r*.92,r*.12,20),detailMat(mt(c,{roughness:.9}),{bump:.6,freq:2/Math.max(1,r/20)}));g.add(top);const rock=new THREE.Mesh(new THREE.ConeGeometry(r*.9,r*(kp.cliff?1.6:1.1),16,3),detailMat(mt(c2,{roughness:.95,flatShading:true}),{bump:.8,freq:1.5/Math.max(1,r/20)}));rock.rotation.x=Math.PI;rock.position.y=-r*(kp.cliff?.85:.6);g.add(rock);
   const feat=(geo,m,n,sc,yy)=>g.add(instGroup(geo,m,Array.from({length:n}),o=>{const a=Rn()*6.28,d=Math.sqrt(Rn())*r*.8;const s=sc*(.6+Rn()*.8);o.position.set(Math.cos(a)*d,r*.06+s*(yy||.5),Math.sin(a)*d);o.scale.setScalar(s);o.rotation.y=Rn()*3}));
   if(kp.trees)feat(geoC('broad'),VC(),24,r*.06,0);if(kp.deadtrees)feat(geoC('dead'),VC(),20,r*.05,0);
   if(kp.houses)feat(geoC('house'),VC(),kp.houses|0||10,r*.05,0);
   if(kp.towers||kp.castle||kp.temple||kp.tower||kp.rocket){const t=new THREE.Mesh(kcy(r*.08,r*.12,r*.7,10),mt(kp.castle?'#8a7a6a':kp.temple?'#d8c890':'#a89a8a'));t.position.y=r*.4;g.add(t);const roof=new THREE.Mesh(kc(r*.14,r*.25,10),mt(kp.rocket?'#d83a3a':'#6a3a2a'));roof.position.y=r*.85;g.add(roof);feat(geoC('tower'),VC(),kp.towers|0||6,r*.04,0)}
   if(kp.statues)feat(kcy(.3,.4,2,8),mt('#d8d0c0'),kp.statues|0||10,r*.06,1);
   if(kp.flowers&&!kp.souls)feat(new THREE.SphereGeometry(.5,6,4),mt(typeof kp.flowers==='string'?kp.flowers:'#d83a3a',{emissive:typeof kp.flowers==='string'?kp.flowers:'#801010',emissiveIntensity:.4}),60,r*.04,.3);
   if(kp.souls)g.add(swarmPts(60,r*.6,'#e8f0ff',r*.03,seed));if(kp.sweets)feat(new THREE.TorusGeometry(.5,.25,8,14),mt('#ffb0c8'),24,r*.07,.4);if(kp.toys)feat(kb(1,1,1),mt('#e8c040'),18,r*.06,.5);
   if(kp.bones)feat(kcy(.08,.08,2,4),mt('#ece4d0'),30,r*.08,.2);if(kp.crystal)feat(ko(.5),mt(typeof kp.crystal==='string'?kp.crystal:'#bff0ff',{emissive:typeof kp.crystal==='string'?kp.crystal:'#4ab0d0',emissiveIntensity:.5}),18,r*.1,.9);
   if(kp.ruins)feat(kb(1,1.4,.4),mt('#8a8478'),18,r*.08,.6);if(kp.orbs)g.add(swarmPts(kp.orbs,r*.7,'#ffe8a0',r*.04,seed));
   if(kp.lake){const l=new THREE.Mesh(new THREE.CircleGeometry(r*.35,32),mt('#4a8ab8',{roughness:.1,metalness:.3}));l.rotation.x=-Math.PI/2;l.position.y=r*.065;g.add(l)}
   if(kp.fog)g.add(glowSprite('#e8e8f0',r*3,.16));if(kp.mud)top.material=detailMat(mt('#5a4a36',{roughness:.4}),{bump:.4});if(kp.pale)top.material=mt('#e8e4f0');if(kp.sky)g.add(at(glowSprite(kp.sky,r*4,.25),0,r,0));
   if(kp.ships)for(let i=0;i<kp.ships;i++){const sh=new THREE.Mesh(sharkGeo(r*.3,r*.05,.6),mt('#7a5a3a'));sh.position.set((Rn()-.5)*r*1.2,r*.1,(Rn()-.5)*r*1.2);g.add(sh);const sail=new THREE.Mesh(new THREE.PlaneGeometry(r*.12,r*.16),mt('#e8dcc0',{side:THREE.DoubleSide}));sail.position.copy(sh.position).add(V3(0,r*.1,0));sail.rotation.y=Math.PI/2;g.add(sail)}
   dreamDeco(g,kp,r,Rn,sp);an=t=>{g.position.y=Math.sin(t*.4+seed)*r*.04;if(g.userData.dtick)g.userData.dtick(t)};break}
  case 'fluffglow':{const s=kp.s||10;const f=bFluff({w:'rongqiu_form',col:c});f.scale.setScalar(s*1.1);g.add(f);g.add(glowSprite('#fff0c8',s*6,.5));g.add(swarmPts(160,s*2,'#fff4d8',s*.15,seed));an=t=>{f.userData.anim(t)};break}
  case 'tripod':{for(let i=0;i<3;i++){const l=new THREE.Mesh(kcy(S*.06,S*.1,S*3,8),mt(c,{metalness:.6,roughness:.3}));const a=i/3*6.28;l.position.set(Math.cos(a)*S*.6,S*1.4,Math.sin(a)*S*.6);l.rotation.set(Math.sin(a)*.3,0,-Math.cos(a)*.3);g.add(l)}const b=new THREE.Mesh(new THREE.SphereGeometry(S*.5,24,16),mt(c2,{metalness:.6,roughness:.3}));b.position.y=S*2.9;g.add(b);g.add(at(glowSprite('#ff5a4a',S*.6,.9),S*.4,S*2.9,0));break}
  case 'eel':{const L=S*8,pts=[];for(let i=0;i<=24;i++){const t=i/24;pts.push(V3(t*L-L/2,Math.sin(t*9)*S*.6,Math.cos(t*7)*S*.4))}const tb=new THREE.Mesh(ktube(pts,S*.35,120,10),mt(c,{roughness:.4}));g.add(tb);
   if(kp.stars)g.add(swarmPts(260,L*.4,'#e8eaff',S*.12,seed));an=t=>{g.rotation.y=Math.sin(t*.2)*.4};break}
  case 'canyon':{for(const s of[-1,1]){const w2=new THREE.Mesh(kb(S*4,S*1.4,S*1.2,1),detailMat(mt(c,{roughness:.9,flatShading:true}),{bump:1,freq:.5}));w2.position.set(0,S*.5,s*S*.9);g.add(w2)}g.add(emitter({n:60,life:6,speed:S*.05,spread:.5,size:S*.3,dir:[0,1,0],col:'#6a6070',op:.3,add:false,tex:smokeTex,area:[S*3,S*.5,S*.6]}));break}
  case 'egg':{const e=new THREE.Mesh(new THREE.SphereGeometry(S,32,24),mt(c,{roughness:.35}));e.scale.y=1.35;g.add(e);const ck=new THREE.Mesh(new THREE.TorusGeometry(S*1.01,S*.02,4,24),mt('#8a7a5a'));ck.rotation.x=Math.PI/2;ck.position.y=S*.2;g.add(ck);break}
  case 'jar':{const pts=[];for(let i=0;i<=14;i++){const t=i/14;pts.push(new THREE.Vector2(S*(.35+Math.sin(t*Math.PI)*.5+(t>.85?.15:0)),t*S*2))}g.add(new THREE.Mesh(new THREE.LatheGeometry(pts,24),mt(c,{side:THREE.DoubleSide,roughness:.4})));g.add(at(glowSprite('#fff4d8',S*1.6,.4),0,S*2,0));break}
  case 'dunes':{const s=kp.s||200;const geo=new THREE.PlaneGeometry(s*2,s*2,80,80);const p=geo.attributes.position;for(let i=0;i<p.count;i++){const x2=p.getX(i),y2=p.getY(i);p.setZ(i,(Math.sin(x2/s*9+Math.sin(y2/s*5)*2)+1)*s*.03*(1-Math.hypot(x2,y2)/(s*1.42)))}geo.computeVertexNormals();
   const m=new THREE.Mesh(geo,detailMat(mt(c,{roughness:.95}),{bump:.4,freq:.6}));m.rotation.x=-Math.PI/2;g.add(m);g.add(emitter({n:120,life:5,speed:s*.04,spread:.3,size:s*.03,dir:[1,.05,0],col:'#ffffff',op:.4,add:false,tex:smokeTex,area:[s*1.6,s*.04,s*1.6]}));break}
  case 'orb':{g.add(new THREE.Mesh(new THREE.SphereGeometry(S,32,24),new THREE.MeshBasicMaterial({color:c})));g.add(glowSprite(c,S*4,.6));g.add(swarmPts(80,S*2,c,S*.1,seed));break}
  case 'wall':{const wl=new THREE.Mesh(kb(S*5,S*2.4,S*.4,1),/water/.test(w.id)?new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{uT:GT,uC:{value:C(c)}},vertexShader:'varying vec3 vP;void main(){vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:GLSL_NOISE+'uniform float uT;uniform vec3 uC;varying vec3 vP;void main(){float n=fb3(vec3(vP.x*.02,vP.y*.02+uT*.4,vP.z*.02));float c2=pow(1.-abs(sin(n*9.)),6.);vec3 col=uC*(.5+.6*n)+vec3(.7,.9,1.)*c2*.6;gl_FragColor=vec4(col,.55+.3*c2);}'}):detailMat(mt(c),{bump:.5}));wl.position.y=S*1.2;g.add(wl);if(/water/.test(w.id))g.add(emitter({n:120,life:3,speed:S*.1,spread:.3,size:S*.08,dir:[0,-1,0],col:'#bfe8ff',op:.5,area:[S*5,S*.1,S*.4]}));break}
  case 'river':{const L=kp.len||S*8,pts=[];for(let i=0;i<=24;i++){const t=i/24;pts.push(V3(t*L-L/2,Math.sin(t*5)*L*.02,Math.sin(t*6)*L*.08))}const tb=new THREE.Mesh(ktube(pts,L*.025,120,8),mt(c,{roughness:.1,metalness:.6}));tb.scale.y=.3;g.add(tb);g.add(sparkles(new THREE.CatmullRomCurve3(pts).getPoints(120),'#8a8aa8',L*.006,1,.8));
   if(kp.drake){const cu=new THREE.CatmullRomCurve3(pts),dk=mt('#2c2c3a',{roughness:.2,metalness:.5,emissive:'#30305a',emissiveIntensity:.6}),P0=cu.getPointAt(.62),T0=cu.getTangentAt(.62);const d=bDragon({w:'feilong',col:'#14141c'});d.traverse(o=>{if(o.isMesh)o.material=dk});d.rotation.z=-.42;d.position.y=L*.004;const dg=new THREE.Group();dg.add(d);d.scale.setScalar(L*.1);const nz=V3(-T0.z,0,T0.x).normalize();dg.position.copy(P0).addScaledVector(nz,L*.1);dg.rotation.y=Math.atan2(nz.z,-nz.x);g.add(dg);
    const rk=instGroup(lumpRock(1,13),mt('#2a2420',{roughness:.9,flatShading:true}),Array.from({length:26}),(o,_,i)=>{const q=cu.getPointAt((i+.5)/26);o.position.set(q.x+(Rn()-.5)*L*.02,q.y+L*.006,q.z+(Rn()-.5)*L*.03);o.scale.setScalar(L*(.004+Rn()*.01));o.rotation.set(Rn()*3,Rn()*3,Rn()*3)});g.add(rk)}
   break}
  case 'comet':{const L=kp.len||S*12;const h=new THREE.Mesh(new THREE.SphereGeometry(L*.025,24,16),new THREE.MeshBasicMaterial({color:c}));g.add(h);g.add(glowSprite(c,L*.15,.8));const tl=new THREE.Mesh(new THREE.ConeGeometry(L*.05,L*.6,24,1,true),GL(c,.18));tl.rotation.z=Math.PI/2;tl.position.x=-L*.3;g.add(tl);
   const tp=[];for(let i=0;i<220;i++){const t=Math.random();tp.push(V3(-t*L*.6,(Math.random()-.5)*L*.05*t,(Math.random()-.5)*L*.05*t))}g.add(sparkles(tp,c,L*.012,1,.6));
   // kp.flakes: it sheds flakes of light back along the tail in many colours (held still where the void is frozen)
   if(kp.flakes){const f=new THREE.Group();f.position.x=-L*.6;f.rotation.z=-Math.PI/2;f.add(evPoints(700,seed+11,evFallMat({col:kp.flakes,col2:c,rx:L*.03,h:L*.6,rz:L*.03,speed:frozen?0:.12,size:L*.02})));g.add(f)}break}
  case 'pillar':{const L=kp.len||S*6;const p=new THREE.Mesh(kcy(L*.05,L*.06,L,16),detailMat(mt(c,{roughness:.5,metalness:.3}),{bump:.6,freq:.5}));p.position.y=L/2;g.add(p);g.add(at(glowSprite('#c8b8ff',L*.15,.4),0,L,0));break}
  case 'pit':{const t=new THREE.Mesh(new THREE.TorusGeometry(S,S*.18,10,48),detailMat(mt(c),{bump:.6,freq:2}));t.rotation.x=Math.PI/2;g.add(t);const d=new THREE.Mesh(new THREE.CircleGeometry(S,40),new THREE.MeshBasicMaterial({color:'#050505'}));d.rotation.x=-Math.PI/2;g.add(d);if(kp.deep)g.add(emitter({n:80,life:4,speed:-S*.2,spread:.2,size:S*.1,dir:[0,1,0],col:'#8a5a6a',op:.6,disc:S*.9,area:[0,S*.3,0]}));break}
  case 'starfish':{for(let i=0;i<5;i++){const a=new THREE.Mesh(kc(S*.3,S*1.8,8),EMI(c,.3));a.rotation.z=-Math.PI/2;a.position.x=S*.9;const p=new THREE.Group();p.add(a);p.rotation.y=i/5*6.28;g.add(p)}g.add(new THREE.Mesh(new THREE.SphereGeometry(S*.45,16,12),EMI(c,.3)));an=t=>{g.rotation.y=t*.1};break}
  case 'log':{const R=S*.3,Lg=S*1.6,lg=new THREE.Group();const sh=new THREE.Mesh(new THREE.CylinderGeometry(R,R*1.05,Lg,18,4,true),mt(c,{roughness:.95,side:THREE.FrontSide,flatShading:true}));lg.add(sh);const inn=new THREE.Mesh(new THREE.CylinderGeometry(R*.86,R*.9,Lg*.98,18,1,true),mt('#3a2a1a',{roughness:.5,metalness:.2,side:THREE.BackSide,emissive:'#2a1a08',emissiveIntensity:.3}));lg.add(inn);
   for(const y of[-1,1]){const rim=new THREE.Mesh(new THREE.TorusGeometry(R*.93,R*.08,6,20),mt('#6a5038',{roughness:.9}));rim.rotation.x=Math.PI/2;rim.position.y=y*Lg/2;lg.add(rim)}const gl=new THREE.Mesh(sgeo(10),mt('#c8a040',{roughness:.3,emissive:'#5a4010',emissiveIntensity:.4,transparent:true,opacity:.85}));gl.scale.set(R*.5,R*.35,R*.5);gl.position.y=-Lg*.42;lg.add(gl);
   lg.rotation.z=Math.PI/2.3;g.add(lg);g.add(swarmPts(220,S*1.4,'#c8b090',S*.04,seed));an=t=>{lg.rotation.x=Math.sin(t*.2)*.25;lg.position.set(Math.sin(t*.13)*S*.3,Math.sin(t*.31)*S*.08,Math.cos(t*.11)*S*.2);gl.position.y=-Lg*.42+Math.sin(t*.7)*Lg*.03};break}
  case 'hookwheel':{const R=S*.5,wg=new THREE.Group();const tire=new THREE.Mesh(new THREE.TorusGeometry(R,R*.28,10,32),mt(c,{roughness:.8}));wg.add(tire);const hub=new THREE.Mesh(sgeo(12),mt('#a8786a',{roughness:.6}));hub.scale.set(R*.4,R*.4,R*.3);wg.add(hub);
   for(let i=0;i<5;i++){const sp=new THREE.Mesh(kcy(R*.06,R*.06,R*1.6,5),mt(c,{roughness:.8}));sp.rotation.z=i/5*Math.PI;wg.add(sp)}
   wg.add(instGroup(new THREE.ConeGeometry(1,1,4),mt('#e8dcc8',{roughness:.5}),Array.from({length:48}),(o,_,i)=>{const a=i/48*6.28;o.position.set(Math.cos(a)*R*1.25,Math.sin(a)*R*1.25,(i%2-.5)*R*.25);o.rotation.z=a-Math.PI/2+.5;o.scale.set(R*.06,R*.22,R*.06)}));
   g.add(wg);an=t=>{const a=t*.35;wg.position.set(Math.cos(a)*S*.6,0,Math.sin(a)*S*.6);wg.rotation.set(0,-a,0);wg.rotateZ(-t*1.2)};break}
  case 'bloom':{const R=S,NP=7,pg=(()=>{const sh=new THREE.Shape();sh.moveTo(0,0);sh.bezierCurveTo(R*.35,R*.2,R*.42,R*.8,0,R*1.1);sh.bezierCurveTo(-R*.42,R*.8,-R*.35,R*.2,0,0);const g2=new THREE.ShapeGeometry(sh,10);const pa=g2.attributes.position;for(let i=0;i<pa.count;i++){const y=pa.getY(i),x=pa.getX(i);pa.setZ(i,-(y/R)*(y/R)*R*.25-Math.abs(x)*.2)}g2.computeVertexNormals();return g2})();
   const core=new THREE.Mesh(sgeo(14),mt('#f0d070',{roughness:.5,emissive:'#a07020',emissiveIntensity:.35}));core.scale.setScalar(R*.22);g.add(core);const PC=['#e88aa8','#c88ae0','#f0a070','#e8e0f0','#a8d0e8','#f0c0c8','#d0a0f0'],EC=[['#4ab86a','#2a6a3a'],['#e8d040','#a08020'],['#60a0e8','#2a4a8a'],['#e86040','#8a2a1a'],['#40d0c0','#1a6a60'],['#c0e060','#5a7a1a'],['#f0f0f0','#8a8a9a']];const P=[];
   for(let i=0;i<NP;i++){const q=new THREE.Group();q.rotation.y=i/NP*6.28;const pt=new THREE.Group();pt.rotation.x=-.75;const m=new THREE.Mesh(pg,mt(PC[i],{roughness:.7,side:THREE.DoubleSide,transparent:true,opacity:.92}));pt.add(m);
    const pts=[];const cols=[];const cc=new THREE.Color();for(let k=0;k<60;k++){const y=R*(.15+Rn()*.8),w=Math.sin(y/R*2.6)*R*.3;const x=(Rn()-.5)*w;pts.push(x,y,-(y/R)*(y/R)*R*.25-Math.abs(x)*.2+R*.02);cc.set(EC[i][k%2]);cols.push(cc.r,cc.g,cc.b)}const bg=new THREE.BufferGeometry();bg.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));bg.setAttribute('color',new THREE.Float32BufferAttribute(cols,3));pt.add(new THREE.Points(bg,new THREE.PointsMaterial({map:dotTex,size:R*.05,vertexColors:true,transparent:true,depthWrite:false})));
    q.add(pt);g.add(q);P.push(pt)}
   g.children.forEach(o=>o.position.y+=R*1.4);an=t=>{g.rotation.y=t*.05;for(let i=0;i<P.length;i++)P[i].rotation.x=-.75+Math.sin(t*.4+i)*.08};break}
  case 'hive':{const R=S,cr=R*.17,cg=new THREE.CylinderGeometry(cr,cr,R*.35,6,1,true);cg.rotateX(Math.PI/2);cg.rotateZ(Math.PI/6);const P=[];const dx=cr*Math.sqrt(3),dy=cr*1.5;for(let j=-8;j<=8;j++)for(let i=-8;i<=8;i++){const x=i*dx+(j&1)*dx/2,y=j*dy;if(x*x/(R*R)+y*y/(R*R*.7)<1)P.push([x,y])}
   const wall=instGroup(cg,mt(c,{roughness:.6,metalness:.3,side:THREE.DoubleSide}),P,(o,p)=>{o.position.set(p[0],p[1],0)});g.add(wall);const back=new THREE.Mesh(new THREE.CircleGeometry(R*1.02,32),mt('#2a2620',{roughness:.9}));back.scale.y=Math.sqrt(.7);back.position.z=-R*.17;g.add(back);
   const GT=[];for(let k=0;k<4;k++)GT.push(canvasTex(64,64,(x,w,h)=>{const r2=rnd(seed+k*17);x.strokeStyle='#fff';x.lineWidth=5;x.lineCap='round';for(let n=0;n<4;n++){x.beginPath();x.moveTo(12+r2()*40,10+r2()*44);for(let m=0;m<2;m++)x.lineTo(10+r2()*44,10+r2()*44);x.stroke()}}));
   const GM=[];const gp=new THREE.PlaneGeometry(cr*1.05,cr*1.05);for(let k=0;k<4;k++){const mm=new THREE.MeshBasicMaterial({map:GT[k],color:'#ffc870',transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:.6});GM.push(mm);g.add(instGroup(gp,mm,P.filter((_,i)=>i%4===k),(o,p)=>{o.position.set(p[0],p[1],-R*.08);o.rotation.z=(Rn()-.5)*.6}))}
   g.add(swarmPts(60,R*1.3,'#ffe0a0',R*.03,seed+5));an=t=>{g.rotation.y=Math.sin(t*.2)*.5;g.rotation.x=Math.sin(t*.13)*.15;for(let k=0;k<4;k++)GM[k].opacity=.3+.3*Math.sin(t*1.7+k*1.6)};break}
  case 'mentor':{const R=S,hg=new THREE.IcosahedronGeometry(R,3),pa=hg.attributes.position,v=V3();for(let i=0;i<pa.count;i++){v.fromBufferAttribute(pa,i);const n=Math.sin(v.x*.31+seed)*Math.cos(v.y*.27)*Math.sin(v.z*.23+1)+Math.sin(v.x*.9+v.z*.7)*.3;v.multiplyScalar(1+n*.14);v.y*=.62;pa.setXYZ(i,v.x,v.y,v.z)}hg.computeVertexNormals();
   g.add(new THREE.Mesh(hg,mt(c,{roughness:.9,flatShading:true})));const lampM=mt('#3a3a48',{roughness:.6}),beamM=new THREE.MeshBasicMaterial({color:'#c8b8ff',transparent:true,opacity:.06,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.FrontSide}),capM=GL('#e8dcff');const L=[];
   for(let i=0;i<5;i++){const q=new THREE.Group(),a=i/5*6.28+.4;q.position.set(Math.cos(a)*R*.55,R*.45,Math.sin(a)*R*.55);q.rotation.set(Math.sin(a)*.6,0,-Math.cos(a)*.6);const st=new THREE.Mesh(kcy(R*.04,R*.07,R*.6,6),lampM);st.position.y=R*.3;q.add(st);const hd=new THREE.Group();hd.position.y=R*.62;const cup=new THREE.Mesh(new THREE.CylinderGeometry(R*.16,R*.08,R*.14,10,1,true),mt('#4a4a5a',{side:THREE.DoubleSide}));hd.add(cup);const cap=new THREE.Mesh(new THREE.CircleGeometry(R*.15,12),capM);cap.rotation.x=-Math.PI/2;cap.position.y=R*.06;hd.add(cap);const bm=new THREE.Mesh(new THREE.CylinderGeometry(R*.8,R*.14,R*4,16,1,true),beamM);bm.position.y=R*2.05;hd.add(bm);q.add(hd);g.add(q);L.push({hd,ph:Rn()*6.28})}
   const mq=G([[sgeo(6),'#5a5048',{s:[.5,.12,.12]}],[sgeo(6),'#4a4038',{p:[.42,.05,0],s:[.12,.1,.1]}],[wingGeo(.7,.22,'insect'),'#d8d4e8',{p:[0,.08,.06],r:[0,-1.3,0]}],[wingGeo(.7,.22,'insect'),'#d8d4e8',{p:[0,.08,-.06],r:[0,1.3,0],s:[1,1,-1]}],[kcy(.012,.012,1.1,3),'#3a3028',{p:[.1,-.35,.18],r:[.5,0,.2]}],[kcy(.012,.012,1.1,3),'#3a3028',{p:[.1,-.35,-.18],r:[-.5,0,.2]}],[kcy(.012,.012,1.1,3),'#3a3028',{p:[-.2,-.35,.18],r:[.5,0,-.3]}],[kcy(.012,.012,1.1,3),'#3a3028',{p:[-.2,-.35,-.18],r:[-.5,0,-.3]}]]);
   const MN=18,mim=new THREE.InstancedMesh(mq,VC({side:THREE.DoubleSide,transparent:true,opacity:.92}),MN);mim.frustumCulled=false;g.add(mim);const o3=new THREE.Object3D();
   an=t=>{for(let i=0;i<L.length;i++){const l=L[i];l.hd.rotation.x=Math.sin(t*.23+l.ph)*.35;l.hd.rotation.z=Math.cos(t*.19+l.ph)*.35}beamM.opacity=.05+.025*Math.sin(t*1.3);
    for(let i=0;i<MN;i++){const a=t*.4+i/MN*6.28,r=R*(1.5+(i%3)*.35);o3.position.set(Math.cos(a)*r,R*(.3+.4*Math.sin(t*.9+i)),Math.sin(a)*r);o3.rotation.set(Math.sin(t*9+i)*.08,-a-Math.PI/2,0);o3.scale.setScalar(R*.5);o3.updateMatrix();mim.setMatrixAt(i,o3.matrix)}mim.instanceMatrix.needsUpdate=true};break}
  case 'face':{const f=new THREE.Mesh(new THREE.SphereGeometry(S,32,24),mt(c,{emissive:c,emissiveIntensity:.25,transparent:true,opacity:.88}));f.scale.set(.8,1,.6);g.add(f);
   for(const s of[-1,1]){const e=new THREE.Mesh(new THREE.SphereGeometry(S*.12,12,10),new THREE.MeshBasicMaterial({color:'#3a6ad8'}));e.position.set(s*S*.3,S*.15,S*.55);g.add(e)}const mo=new THREE.Mesh(new THREE.TorusGeometry(S*.2,S*.03,6,16,Math.PI),new THREE.MeshBasicMaterial({color:'#c86a6a'}));mo.position.set(0,-S*.35,S*.56);mo.rotation.z=Math.PI;g.add(mo);
   const hair=new THREE.Mesh(new THREE.SphereGeometry(S*1.05,32,16,0,Math.PI*2,0,Math.PI/2.2),mt('#f2d27a'));hair.scale.set(.85,1,.7);hair.position.y=S*.1;g.add(hair);g.add(swarmPts(120,S*2.2,'#fff4d8',S*.06,seed));
   const gd=new THREE.Group(),R=S*.6;gd.position.set(S*.15,-S*1.55,S*.35);const top=new THREE.Mesh(new THREE.CylinderGeometry(R,R*.96,S*.08,28),mt('#6aa84a',{roughness:.9}));gd.add(top);const rk=new THREE.Mesh(new THREE.ConeGeometry(R*.95,S*.7,14),mt('#8a7a6a',{roughness:1,flatShading:true}));rk.rotation.x=Math.PI;rk.position.y=-S*.39;gd.add(rk);
   const fl=new THREE.InstancedMesh(new THREE.SphereGeometry(1,6,4),mt('#ffffff',{roughness:.7,emissive:'#302010',emissiveIntensity:.3}),90),o3=new THREE.Object3D(),FC=['#ff8aa8','#ffd84a','#f4f4ff','#c88aff','#ff9a5a'],cc=new THREE.Color();for(let i=0;i<90;i++){const a=Rn()*6.28,d=Math.sqrt(Rn())*R*.92;o3.position.set(Math.cos(a)*d,S*.05,Math.sin(a)*d);o3.scale.setScalar(S*(.015+Rn()*.015));o3.updateMatrix();fl.setMatrixAt(i,o3.matrix);fl.setColorAt(i,cc.set(FC[i%5]))}gd.add(fl);
   const wm=mt('#fbfaf6',{roughness:.5}),pv=new THREE.Group();for(let i=0;i<6;i++){const a=i/6*6.28,po=new THREE.Mesh(new THREE.CylinderGeometry(S*.012,S*.012,S*.16,6),wm);po.position.set(Math.cos(a)*S*.09,S*.12,Math.sin(a)*S*.09);pv.add(po)}const dm=new THREE.Mesh(new THREE.SphereGeometry(S*.11,16,8,0,Math.PI*2,0,Math.PI/2),wm);dm.position.y=S*.2;pv.add(dm);const fl0=new THREE.Mesh(new THREE.CylinderGeometry(S*.12,S*.12,S*.02,16),wm);fl0.position.y=S*.05;pv.add(fl0);pv.position.set(-R*.35,0,-R*.2);gd.add(pv);
   gd.add(swarmPts(40,R*.8,'#fff8c0',S*.02,seed+3));g.add(gd);an=t=>{gd.position.y=-S*1.55+Math.sin(t*.5)*S*.04;gd.rotation.y=t*.04};break}
  case 'dome':{const d=new THREE.Mesh(new THREE.SphereGeometry(S,32,16,0,Math.PI*2,0,Math.PI/2),mt(c,{transparent:true,opacity:.5,roughness:.15,side:THREE.DoubleSide,depthWrite:false}));g.add(d);g.add(swarmPts(200,S*.9,'#ffffff',S*.03,seed));break}
  default:{g.add(new THREE.Mesh(ko(S*.4),EMI(c,.6)))}
 }
 if(an&&!frozen)anim(sp,g,an);
 return g}
function sizeOf(w){const kp=w.kp||{};if(w.k==='rocks'||w.k==='fog'||w.k==='linked'||w.k==='vortex')return (kp.r||80)*.8;if(w.k==='tube'||w.k==='pillar'||w.k==='comet'||w.k==='river'||w.k==='bridge')return (kp.len||600)*.3;if(w.k==='dunes')return (kp.s||200)*.6;if(w.k==='star')return (kp.r||40)*1.4;return kp.r||kp.s||(w.k&&w.k!=='none'?20:12)}
const LIVING={'物种':1,'角色':1,'琳的造物':1};
function posOf(w){const m=mapOf(w),t=MB[m].type;
 if(t==='planet'){const s=SP[m];if(w.moon&&s&&s.moon)return dirLL(...w.moon).multiplyScalar(s.moon.scale.x*1.03).add(s.moon.position);const ll=w.ll||[0,0];return dirLL(ll[0],ll[1]).multiplyScalar(R+(s?s.gh(ll[0],ll[1]):0)+3)}
 if(t==='space'){if(w._st)return w._st.clone();const p=V3(...(w.p||[0,0,0]));if(w.sec&&SECTORS[w.sec])p.add(V3(...SECTORS[w.sec].c));
  // a creature that the layout dropped inside an island or a rock world stands on it instead
  if(LIVING[w.c]&&w.k!=='disc'&&w.k!=='island'&&!({planet:1,rockworld:1,core:1,star:1})[w.k]&&typeof settle==='function'){const st=settle(w,p);w._st=st?st.p.clone():p.clone();return w._st.clone()}return p}
 if(t==='dream')return ROAD[m](w.t||0).add(V3(...(w.off||[0,0,0])));
 if(t==='tube'){const s=SP[m];const d=s&&s.wallR?Math.max(0,s.wallR(w.z||0,w.ang||0)):0;return tubePt(TUBE_R[m],w.z||0,w.ang||0,Math.abs(w.h||0)+d)}
 return V3(0,0,0)}
/* put every entry of a non-planet space into it, as a shape or a mote */
function placeEntries(sp){WIKI.filter(w=>mapOf(w)===sp.id).forEach(w=>{const p=posOf(w);const s=sizeOf(w);
 if(w.k&&w.k!=='none'){const inner=makeShape(w,sp,!!w.ng);const o=new THREE.Group();o.add(inner);o.position.copy(p);
  if(sp.type==='tube')o.quaternion.setFromUnitVectors(V3(0,1,0),tubeUp(w.ang||0));
  sp.scene.add(o);o.userData.pick=w.id;sp.ents=sp.ents||{};sp.ents[w.id]=o;prox(sp,w.id,p,Math.max(8,s*.9),{maxD:Math.max(2600,s*60),go:w.go?1:0})}
 else if(!entryShape(w,sp,p)){const m=mote(w);m.position.copy(p);m.scale.set(.04,.04,1);m.userData.base=.04;sp.scene.add(m);(sp.motes=sp.motes||[]).push(m);m.userData.w=w;prox(sp,w.id,p,12,{maxD:3800,mote:m})}})}

/* ---------- the void itself ---------- */
const SECCOL={6:'#6a8aff',7:'#5affc8',8:'#ff9a5a',9:'#ffd27a',10:'#ff6a3a',11:'#c86aff',12:'#9aa0b8',13:'#ffd9a0'};
function voidSkyMat(){return new THREE.ShaderMaterial({depthWrite:false,depthTest:false,side:THREE.BackSide,uniforms:{uDim:{value:1}},
 vertexShader:'varying vec3 vD;void main(){vD=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:GLSL_NOISE+`uniform float uDim;varying vec3 vD;void main(){vec3 d=normalize(vD);float n=fb3(d*2.2+vec3(3.1));float n2=fb3(d*5.5-vec3(1.3));float band=exp(-pow(d.y*2.6+sin(d.x*2.+d.z)*.3,2.));
 vec3 a=vec3(.05,.07,.16),b=vec3(.16,.06,.18),c=vec3(.03,.12,.14);vec3 col=mix(a,b,smoothstep(.4,.7,n));col=mix(col,c,smoothstep(.5,.8,n2)*.7);
 float k=smoothstep(.42,.78,n*.7+n2*.4)*(.35+.65*band);gl_FragColor=vec4(col*k*1.5*uDim+vec3(.004,.006,.012),1.);}`})}
function buildVoid(){const sc=new THREE.Scene();const sp=newSpace('void','space',sc);sp.bound=6200;sc.background=C('#010207');
 const skyM=voidSkyMat();const sky=new THREE.Mesh(new THREE.SphereGeometry(30000,48,24),skyM);sky.renderOrder=-20;sky.frustumCulled=false;sc.add(sky);sp.sky=sky;
 sc.add(new THREE.AmbientLight(0x8090a8,.26));sc.environment=makeEnv('#2a3460','#121830','#06070e',[[[.6,.8,.4],'#fff0d8',1.8],[[-.7,.1,-.5],'#6a4aa8',2.5],[[.2,-.3,.9],'#3a8a9a',2.2]]);const dl=new THREE.DirectionalLight(0xfff4e0,1.05);dl.position.copy(VLIGHT);sc.add(dl);const dl2=new THREE.DirectionalLight(0x6a7aff,.25);dl2.position.set(-.5,-.4,-.6);sc.add(dl2);
 sp.stars=starfield(sc,9000,24000,1.7,1);const st2=starfield(sc,1400,22000,3,1,'#fff4e0');sp.stars2=st2;
 // the drifting dust of the void, close enough to feel depth
 {const pts=[];for(let i=0;i<5000;i++)pts.push(V3((Math.random()-.5)*12000,(Math.random()-.5)*1800,(Math.random()-.5)*12000));const d=sparkles(pts,'#9aa8c8',9,.55,.6);sc.add(d)}
 const ids=Object.keys(SECTORS).map(Number).sort((a,b)=>a-b);
 ids.forEach(s=>{const c=V3(...SECTORS[s].c);for(let k=0;k<3;k++){const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:nebTex,color:SECCOL[s],transparent:true,opacity:.26-k*.06,blending:THREE.AdditiveBlending,depthWrite:false}));const sz=2200+k*900;spr.scale.set(sz,sz*.8,1);spr.position.copy(c).add(V3((h3(s,k,1)-.5)*500,-260+k*120,(h3(s,k,2)-.5)*500));spr.material.rotation=k*1.3;sc.add(spr)}
  sp.labels.push({n:`${EB[s].n} · ${SECTORS[s].n}`,pos:c.clone().add(V3(0,340,0)),minAlt:1300,era:s,sector:s})});
 // the route Lin travelled, and a mote of it still travelling
 const route=new THREE.CatmullRomCurve3(ids.map(s=>V3(...SECTORS[s].c).add(V3(0,-120,0))));sp.route=route;const rp=route.getPoints(600);sc.add(sparkles(rp,'#efc370',7,.6,.5));
 const trav=new THREE.Group();trav.add(glowSprite('#fff0c8',90,1));trav.add(glowSprite('#ffd27a',260,.35));sc.add(trav);const trail=emitter({n:160,life:4,speed:0,spread:0,size:14,dir:[0,0,0],col:'#ffe8b0',op:.7,area:[4,4,4],wander:6});sc.add(trail);
 // the frozen void: a grey region where nearly everything has stopped
 {const c=V3(...NG_C);for(let k=0;k<4;k++){const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:nebTex,color:k%2?'#4a4a52':'#2a2a30',transparent:true,opacity:.5,depthWrite:false}));const sz=2600+k*600;spr.scale.set(sz,sz*.7,1);spr.position.copy(c).add(V3((h3(k,1,5)-.5)*600,-200+k*100,(h3(k,2,5)-.5)*600));sc.add(spr)}
  const pts=[];for(let i=0;i<2600;i++){const v=V3(Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize().multiplyScalar(1200*Math.cbrt(Math.random()));v.y*=.5;pts.push(v.add(c))}const fz=sparkles(pts,'#c8ccd8',5,.8,0);sc.add(fz);
  const edge=new THREE.Mesh(new THREE.SphereGeometry(1250,64,32),new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,uniforms:{},
   vertexShader:'varying vec3 vN,vW,vP;void main(){vP=position;vN=normalize(mat3(modelMatrix)*normal);vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',
   fragmentShader:GLSL_NOISE+'varying vec3 vN,vW,vP;void main(){vec3 V=normalize(cameraPosition-vW);float r=1.-abs(dot(normalize(vN),V));float cr=1.-smoothstep(.0,.035,abs(vn3(vP*.006)-.5));gl_FragColor=vec4(vec3(.55,.58,.66)*(pow(r,3.)*.22+cr*.05*(.3+r)),1.);}'}));
  edge.position.copy(c);edge.scale.y=.6;sc.add(edge);sp.labels.push({n:'凝固虚空',pos:c.clone().add(V3(0,420,0)),minAlt:1300,era:10})}
 // the other void, at the very end
 const other=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:'#b8a8ff',transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));other.scale.set(9000,9000,1);other.position.set(-5200,600,-5200);sc.add(other);
 placeEntries(sp);voidLife(sp);ningMore(sp);voidHeroes(sp);voidLin(sp);voidRiver(sp);voidArmada(sp);
 sp.portals=WIKI.filter(w=>mapOf(w)==='void'&&w.go&&MB[w.go]).map(w=>({w,pos:posOf(w),r:Math.max(30,sizeOf(w))}));
 // which era is this part of the void
 let curSec=null;sp.eraAt=(p)=>{let best=null,bd=1e18;for(const s of ids){const c=SECTORS[s].c;const d=Math.hypot(p.x-c[0],p.z-c[2]);if(d<bd){bd=d;best=s}}
  const dn=Math.hypot(p.x-NG_C[0],p.z-NG_C[2]);if(dn<bd){bd=dn;best=10}
  if(curSec!==null&&best!==curSec){const c=curSec===10&&Math.hypot(p.x-NG_C[0],p.z-NG_C[2])<Math.hypot(p.x-SECTORS[10].c[0],p.z-SECTORS[10].c[2])?NG_C:SECTORS[curSec].c;if(Math.hypot(p.x-c[0],p.z-c[2])<bd+180)return curSec}
  curSec=best;return best};
 sp.update=(T,dt)=>{const k=(T/300)%1;const p=route.getPointAt(k);trav.position.copy(p);trail.position.copy(p);
  other.material.opacity+=((ERA>=12?.22:0)-other.material.opacity)*Math.min(1,dt);sp.stars.material.opacity=ERA>=12?.55:1;skyM.uniforms.uDim.value=ERA>=12?.6:1;sky.position.copy(camera.position)};
 return sp}

/* a faint river of stardust that flows through the star regions in story order, from the first one out to the last */
function voidRiver(sp){const ks=Object.keys(SECTORS).map(Number).sort((a,b)=>a-b);if(ks.length<2)return;
 const cur=new THREE.CatmullRomCurve3(ks.map(k=>V3(...SECTORS[k].c).add(V3(0,-260,0))),false,'centripetal');const LUT=cur.getSpacedPoints(1200);
 const N=innerWidth<760?7000:12000,pos=new Float32Array(N*3),U=new Float32Array(N),O=new Float32Array(N*3),Sp=new Float32Array(N);
 for(let i=0;i<N;i++){U[i]=Math.random();const r=Math.pow(Math.random(),2.2)*110,a=Math.random()*6.283;O[i*3]=Math.cos(a)*r;O[i*3+1]=(Math.random()-.5)*r*.25;O[i*3+2]=Math.sin(a)*r;Sp[i]=.004+Math.random()*.006}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));const tw=new Float32Array(N);for(let i=0;i<N;i++)tw[i]=Math.random();g.setAttribute('ph',new THREE.BufferAttribute(tw,1));
 const m=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{uT:GT,uS:PSCALE,uK:{value:innerWidth<760?.75:1.1}},
  vertexShader:'uniform float uT,uS;attribute float ph;varying float vA;varying vec3 vC;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mv;float d=-mv.z;vA=(.45+.55*sin(uT*1.3+ph*40.))*(1.-smoothstep(4000.,8000.,d));vC=mix(vec3(.55,.7,1.),vec3(1.,.8,.55),ph);gl_PointSize=clamp(uS*14./d,2.6,7.);}',
  fragmentShader:'uniform float uK;varying float vA;varying vec3 vC;void main(){vec2 c=gl_PointCoord-.5;float a=smoothstep(.5,.0,length(c));gl_FragColor=vec4(vC*a*vA*uK,1.);}'});
 const pts=new THREE.Points(g,m);pts.frustumCulled=false;pts.renderOrder=-2;sp.scene.add(pts);const L=LUT.length-1;
 anim(sp,null,(t)=>{for(let i=0;i<N;i++){const u=(U[i]+t*Sp[i]*.25)%1;const f=u*L,k=f|0,w=f-k;const A=LUT[k],B=LUT[Math.min(L,k+1)];pos[i*3]=A.x+(B.x-A.x)*w+O[i*3];pos[i*3+1]=A.y+(B.y-A.y)*w+O[i*3+1];pos[i*3+2]=A.z+(B.z-A.z)*w+O[i*3+2]}g.attributes.position.needsUpdate=true})}

/* ================================================================
   entries the generic shape kit (kitShape) drew wrongly get their own models; makeShape picks between them
   ================================================================ */
const fxH_SH={};
// the kit's flags that had no shape behind them now pick the model made for them
const fxH_FLAG={ribs:'ng_lost',bridges:'ng_qiushen',scales:'ng_pinecone',barnacle:'bk_tenghu',peel:'bk_crying',gun:'v_chuanxing',rust:'v_zhengteng'};
function makeShape(w,sp,frozen){const kp=w.kp||{};let f=fxH_SH[w.id];if(!f)for(const k in fxH_FLAG)if(kp[k]){f=fxH_SH[fxH_FLAG[k]];break}if(!f&&w.k==='bird'&&(kp.n||12)===1&&!kp.brick)f=fxH_phoenixShape;if(!f)return kitShape(w,sp,frozen);
 const seed=hashStr(w.id);const x={w,sp,kp,frozen,seed,Rn:rnd(seed),S:kp.r||kp.s||20,c:kp.c||'#9fb4c8',c2:kp.c2||'#4a5a6a'};const g=new THREE.Group();let an=null;
 try{an=f(g,x)}catch(e){console.warn('fxH shape',w.id,e);return kitShape(w,sp,frozen)}
 if(an&&!frozen)anim(sp,g,an);return g}

/* ---------- small helpers ---------- */
// a lumpy, faceted ball: icosahedron pushed in and out by noise
function fxH_lumpGeo(R,det,amp,seed,sq){const g=new THREE.IcosahedronGeometry(R,det);const p=g.attributes.position,v=V3();const o=(seed%37)*.31;
 for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);const n=fbm(v.x/R*1.7+o,v.y/R*1.7,v.z/R*1.7,4);v.multiplyScalar(1-amp+n*amp*2);if(sq)v.multiply(sq);p.setXYZ(i,v.x,v.y,v.z)}g.computeVertexNormals();return g}
// a wing in the x–z plane: span out along +z, chord along x
function fxH_wingGeo(span,chord){const g=wingGeo(span,chord);const p=g.attributes.position;for(let i=0;i<p.count;i++){const a=p.getX(i),b=p.getZ(i);p.setXYZ(i,b,0,a)}g.computeVertexNormals();return g}
function fxH_addMat(col,op){return new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:op,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide})}
// an instanced mesh with a colour per instance
function fxH_inst(geo,mat,n,set,cols){const im=new THREE.InstancedMesh(geo,mat,n),o=new THREE.Object3D(),cc=new THREE.Color();for(let i=0;i<n;i++){o.position.set(0,0,0);o.rotation.set(0,0,0);o.quaternion.identity();o.scale.set(1,1,1);set(o,i);o.updateMatrix();im.setMatrixAt(i,o.matrix);if(cols)im.setColorAt(i,cc.set(cols[i%cols.length]))}im.frustumCulled=false;return im}
const fxH_UP=V3(0,1,0);
// a plain faceless figure: head, body and four limbs, standing on y=0 and about h tall
function fxH_faceless(h,mat,trim){const g=new THREE.Group();const H=h;
 const hd=sph(0,H*.075,H*.09,H*.075,16,mat);hd.position.y=H*.9;g.add(hd);
 const tor=sph(0,H*.13,H*.2,H*.1,16,mat);tor.position.y=H*.64;g.add(tor);const hip=sph(0,H*.11,H*.08,H*.09,12,trim||mat);hip.position.y=H*.47;g.add(hip);
 const arms=[];for(const z of[-1,1]){const a=new THREE.Group();a.position.set(0,H*.8,z*H*.15);const u=cyl(H*.035,H*.03,H*.32,mat,8);u.position.y=-H*.16;a.add(u);const l=cyl(H*.03,H*.022,H*.3,trim||mat,8);l.position.y=-H*.46;a.add(l);a.rotation.x=z*.12;g.add(a);arms.push(a)
  const lg=new THREE.Group();lg.position.set(0,H*.46,z*H*.07);const t=cyl(H*.05,H*.04,H*.24,mat,8);t.position.y=-H*.12;lg.add(t);const s=cyl(H*.04,H*.03,H*.22,trim||mat,8);s.position.y=-H*.35;lg.add(s);g.add(lg)}
 if(trim){const sh=new THREE.Mesh(new THREE.TorusGeometry(H*.11,H*.018,6,20),trim);sh.rotation.x=Math.PI/2;sh.position.y=H*.76;g.add(sh)}
 g.userData.arms=arms;return g}

/* ---------- the phoenix: a round, rugby-ball body and two broad wings of light. No head, no tail, no feet ---------- */
function fxH_phoenix(S,col,o){o=o||{};const g=new THREE.Group();
 const body=new THREE.Mesh(new THREE.SphereGeometry(S*.3,24,16),mt(col,{emissive:col,emissiveIntensity:o.star?1.4:.9,roughness:.4}));body.scale.set(1.45,.85,.85);g.add(body);
 const core=new THREE.Mesh(new THREE.SphereGeometry(S*.2,16,12),new THREE.MeshBasicMaterial({color:'#fff2c8'}));core.scale.set(1.5,.8,.8);g.add(core);
 const wings=[];const WM=fxH_addMat(col,.5),WI=fxH_addMat('#ffe8a8',.45);
 for(const z of[-1,1]){const wg=new THREE.Group();wg.position.set(S*.05,S*.05,z*S*.18);
  const a=new THREE.Mesh(fxH_wingGeo(S*1.5,S*.95),WM);const b=new THREE.Mesh(fxH_wingGeo(S*1.05,S*.55),WI);b.position.set(S*.06,S*.01,0);wg.add(a,b);
  // ribs of flame along the wing
  for(let i=0;i<5;i++){const r=new THREE.Mesh(kcy(S*.012,S*.03,S*(1.25-i*.17),5),fxH_addMat('#ffd080',.5));r.rotation.x=Math.PI/2;r.rotation.z=(i-2)*.16;r.position.set((i-2)*S*.09,0,S*(1.25-i*.17)/2);wg.add(r)}
  if(z<0)wg.scale.z=-1;g.add(wg);wings.push({wg,z})}
 const halo=glowSprite(col,S*(o.star?5:3.2),o.star?.75:.55);g.add(halo);if(o.star)g.add(glowSprite('#fff0c8',S*1.8,.9));
 for(const z of[-1,1]){const fe=emitter({n:o.star?120:70,life:1.4,speed:S*.25,spread:.6,size:S*(o.star?.22:.16),dir:[-1,.3,0],col:'#ffd070',col2:'#ff3010',op:.75,area:[S*.5,S*.05,S*1.2]});fe.position.set(0,0,z*S*.75);g.add(fe)}
 g.userData.anim=t=>{for(const k of wings)k.wg.rotation.x=k.z*(Math.sin(t*1.6)*.28-.05);halo.material.opacity=(o.star?.7:.5)+Math.sin(t*3.1)*.08};return g}
function fxH_phoenixShape(g,x){const {S,kp}=x;const star=!!kp.starry;const col=star?'#ffb040':(kp.c||'#ff7a2a');const p=fxH_phoenix(S*(star?1:1.1),col,{star});g.add(p);
 if(star){g.add(new THREE.PointLight(C('#ffc070'),1.2,S*30));g.add(swarmPts(160,S*2.2,'#ffe8b0',S*.06,x.seed))}
 // the factory's hero carries an e-book on one wing, showing a small hero in light
 if(x.w.id==='ng_phoenixhero'){const bk=new THREE.Group();const cv=new THREE.Mesh(kb(S*.32,S*.03,S*.24),mt('#2a2a30',{roughness:.5}));bk.add(cv);const scr=new THREE.Mesh(kb(S*.28,S*.005,S*.2),new THREE.MeshBasicMaterial({color:'#bfe8ff'}));scr.position.y=S*.018;bk.add(scr);
  const holo=fxH_faceless(S*.34,mt('#9fe8ff',{emissive:'#5ad0ff',emissiveIntensity:.9,transparent:true,opacity:.7,depthWrite:false}));holo.position.y=S*.03;bk.add(holo);bk.add(at(glowSprite('#9fe8ff',S*.6,.5),0,S*.2,0));
  bk.position.set(S*.05,S*.08,S*.75);g.add(bk)}
 return t=>{p.userData.anim(t);g.position.y=Math.sin(t*.6)*S*.15}}
fxH_SH.v_guanxing=fxH_phoenixShape;fxH_SH.ng_phoenixhero=fxH_phoenixShape;

/* ---------- the void bus: a ball of ice tens of kilometres across, a crack across it for a mouth, three jointed limbs on each side of the crack ---------- */
function fxH_iceBus(g,x,station){const {S,Rn,seed}=x;
 const body=new THREE.Mesh(fxH_lumpGeo(S,3,.12,seed),detailMat(mt('#eef6fa',{roughness:.35,metalness:.05,flatShading:true,emissive:'#9ac8e0',emissiveIntensity:.08}),{bump:.5,freq:.6}));g.add(body);
 g.add(new THREE.Mesh(new THREE.SphereGeometry(S*1.06,32,24),rimMat('#9ac8e0',3,.55)));
 // the crack: a dark canyon running round the front of the ball
 const path=[];for(let i=0;i<=24;i++){const u=-1+i/12,a=u*1.05;path.push(V3(Math.cos(a)*S*.93,Math.sin(u*2.4)*S*.06-S*.05,Math.sin(a)*S*.93))}
 const crack=new THREE.Mesh(ktube(path,S*.07,60,8),mt('#0a1622',{roughness:.9}));crack.scale.set(1,.55,1);g.add(crack);
 const lip=new THREE.Mesh(ktube(path.map(p=>p.clone().multiplyScalar(1.025)),S*.025,60,6),new THREE.MeshBasicMaterial({color:'#3a6a8a'}));lip.scale.set(1,.55,1);g.add(lip);
 // jointed, barbed limbs, three above the crack and three below
 const LM=mt('#cfe2ec',{roughness:.4,flatShading:true}),BM=mt('#e8f2f6',{roughness:.3});const limbs=[];
 for(let i=0;i<6;i++){const up=i<3?1:-1,k=i%3;const cu=new THREE.CatmullRomCurve3(path);const P=cu.getPointAt(.3+k*.2);const N=P.clone().normalize();
  const L=new THREE.Group();L.position.copy(P).addScaledVector(fxH_UP,up*S*.05);L.quaternion.setFromUnitVectors(fxH_UP,N);
  const a=cyl(S*.035,S*.028,S*.3,LM,6);a.position.y=S*.15;const j=new THREE.Group();j.position.y=S*.3;const jb=sph(0,S*.045,S*.045,S*.045,8,LM);j.add(jb);
  const b=cyl(S*.026,S*.012,S*.28,LM,6);b.position.y=S*.14;j.add(b);for(let q=0;q<3;q++){const br=cone(S*.018,S*.08,BM,4);br.position.set(0,S*(.06+q*.08),S*.02);br.rotation.x=.9;j.add(br)}
  j.rotation.z=up*.9;L.add(a,j);const seg=new THREE.Group();seg.add(L);seg.rotation.x=up*.35;g.add(seg);limbs.push({j,L,ph:i*1.1,up})}
 g.add(swarmPts(80,S*1.5,'#e8f8ff',S*.04,seed));
 if(station){const st=new THREE.Mesh(kb(S*1.1,S*.35,S*.6),mt('#8a9098',{metalness:.6,roughness:.35}));st.position.y=S*.98;g.add(st);const tw=new THREE.Mesh(kcy(S*.08,S*.12,S*.5,8),mt('#6a7078',{metalness:.6}));tw.position.set(S*.3,S*1.3,0);g.add(tw);g.add(at(glowSprite('#ffd27a',S*.6,.8),0,S*1.25,0))}
 return t=>{g.rotation.y=Math.sin(t*.05)*.3;for(const l of limbs)l.j.rotation.z=l.up*(.9+Math.sin(t*.7+l.ph)*.25)}}
fxH_SH.v_xukongbus=(g,x)=>fxH_iceBus(g,x,false);
fxH_SH.v_buhuo=(g,x)=>fxH_iceBus(g,x,true);

/* ---------- 星界之门: a half arch built of organs, standing on its two feet ---------- */
fxH_SH.v_gate=(g,x)=>{const {S,Rn}=x;const fl=detailMat(mt('#b85a5a',{roughness:.5,metalness:0,emissive:'#5a1418',emissiveIntensity:.3}),{bump:.7,freq:2/Math.max(1,S/20)});
 const arch=new THREE.Mesh(new THREE.TorusGeometry(S,S*.16,14,48,Math.PI),fl);g.add(arch);
 for(const s of[-1,1]){const ft=sph(0,S*.3,S*.18,S*.3,14,fl);ft.position.set(s*S,-S*.05,0);g.add(ft)}
 const OC=['#9a3a3a','#c87070','#7a2a3a','#d8908a','#a8505a'];const org=[];
 for(let i=0;i<18;i++){const a=(i+.5)/18*Math.PI,r=S*(1+(Rn()-.5)*.12);const m=new THREE.Mesh(fxH_lumpGeo(S*(.1+Rn()*.09),1,.2,i+3),mt(OC[i%5],{roughness:.45,emissive:'#4a0a10',emissiveIntensity:.25}));m.position.set(Math.cos(a)*r,Math.sin(a)*r,(Rn()-.5)*S*.22);m.scale.set(1,1.3,1);g.add(m);org.push({m,ph:Rn()*6})}
 const vm=mt('#5a1a2a',{roughness:.4});for(let k=0;k<4;k++){const pts=[];for(let i=0;i<=14;i++){const a=i/14*Math.PI,r=S*(.86+k*.09);pts.push(V3(Math.cos(a)*r,Math.sin(a)*r,(k%2?1:-1)*S*.14+Math.sin(i*1.3+k)*S*.03))}g.add(new THREE.Mesh(ktube(pts,S*.018,40,5),vm))}
 const d=new THREE.Mesh(new THREE.CircleGeometry(S*.84,48,0,Math.PI),new THREE.MeshBasicMaterial({map:swirlTex,color:x.kp.glow||'#8ab8ff',transparent:true,opacity:.4,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));g.add(d);
 return t=>{for(const o of org){const k=1+Math.sin(t*1.4+o.ph)*.06;o.m.scale.set(k,1.3*k,k)}d.material.opacity=.3+Math.sin(t*.9)*.1}};

/* ---------- 穿星者: itself a gun barrel over a hundred metres long, with a ring of eyes round the muzzle ---------- */
fxH_SH.v_chuanxing=(g,x)=>{const {S,c}=x;const L=S*3.8,r=S*.42;const hull=mt(c,{metalness:.7,roughness:.25});
 const bar=new THREE.Group();g.add(bar);
 const out=new THREE.Mesh(new THREE.CylinderGeometry(r,r*1.15,L,32,6,true),detailMat(hull,{bump:.35,freq:.6}));bar.add(out);
 const inn=new THREE.Mesh(new THREE.CylinderGeometry(r*.72,r*.72,L*.98,32,1,true),mt('#140c0a',{side:THREE.BackSide,emissive:'#ff7a3a',emissiveIntensity:.25}));bar.add(inn);
 const lip=new THREE.Mesh(new THREE.TorusGeometry(r*.86,r*.15,10,40),hull);lip.rotation.x=Math.PI/2;lip.position.y=L/2;bar.add(lip);
 const breech=new THREE.Mesh(new THREE.SphereGeometry(r*1.15,24,12,0,Math.PI*2,Math.PI/2,Math.PI/2),hull);breech.position.y=-L/2;bar.add(breech);
 for(let i=0;i<4;i++){const band=new THREE.Mesh(new THREE.TorusGeometry(r*(1.02+i*.03),r*.05,6,40),mt('#2a3430',{metalness:.6,roughness:.4}));band.rotation.x=Math.PI/2;band.position.y=-L*.35+i*L*.2;bar.add(band)}
 const bore=new THREE.Mesh(new THREE.CircleGeometry(r*.7,32),new THREE.MeshBasicMaterial({color:'#ffb070'}));bore.rotation.x=-Math.PI/2;bore.position.y=L*.1;bar.add(bore);
 const bg=glowSprite('#ffb070',r*3,.5);bg.position.y=L/2;bar.add(bg);
 const ew=mt('#f2eee2',{roughness:.2}),ep=new THREE.MeshBasicMaterial({color:'#1a0c06'}),eyes=[];
 for(let i=0;i<12;i++){const a=i/12*6.283;const e=new THREE.Group();e.position.set(Math.cos(a)*r*1.12,L/2-r*.35,Math.sin(a)*r*1.12);const b=sph(0,r*.15,r*.15,r*.15,10,ew);e.add(b);const p=sph(0,r*.075,r*.075,r*.05,8,ep);p.position.set(Math.cos(a)*r*.12,r*.04,Math.sin(a)*r*.12);e.add(p);bar.add(e);eyes.push(e)}
 bar.rotation.z=-Math.PI/2;
 return t=>{bar.rotation.y=Math.sin(t*.2)*.05;bg.material.opacity=.4+.2*Math.sin(t*2.3);const bl=(t%7)<.18;for(const e of eyes)e.scale.y=bl?.15:1}};

/* ---------- 文明平台: a metal ball that gathers the debris around it, growing as it goes ---------- */
fxH_SH.v_civplat=(g,x)=>{const {S,Rn,seed}=x;const R=S*.62;
 const ball=new THREE.Mesh(fxH_lumpGeo(R,3,.05,seed),detailMat(mt('#8a9098',{metalness:.7,roughness:.35}),{bump:.4,freq:1}));g.add(ball);
 const N=150,WC=['#6a6a70','#8a8478','#4a4a50','#a09888','#5a5048','#7a7a82'];
 g.add(fxH_inst(lumpRock(1,11),mt('#ffffff',{roughness:.7,metalness:.4,flatShading:true}),N,(o,i)=>{const v=V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize();const near=i<90;o.position.copy(v).multiplyScalar(R*(near?.96+Rn()*.12:1.15+Rn()*.6));o.rotation.set(Rn()*3,Rn()*3,Rn()*3);const s=S*(near?.06+Rn()*.1:.03+Rn()*.06);o.scale.set(s*(.6+Rn()),s*(.5+Rn()*.6),s*(.6+Rn()))},WC));
 // a few branching growths on the crust, coral-like
 const cm=mt('#9a948a',{metalness:.5,roughness:.5});for(let i=0;i<14;i++){const v=V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize();const b=new THREE.Group();b.position.copy(v).multiplyScalar(R*.98);b.quaternion.setFromUnitVectors(fxH_UP,v);const h=S*(.12+Rn()*.14);const s=cyl(S*.012,S*.03,h,cm,5);s.position.y=h/2;b.add(s);for(const q of[-1,1]){const t=cyl(S*.008,S*.015,h*.5,cm,4);t.position.set(q*h*.12,h*.75,0);t.rotation.z=-q*.6;b.add(t)}g.add(b)}
 g.add(swarmPts(60,S*1.6,'#c8d0d8',S*.03,seed,false));return t=>{g.rotation.y=t*.02}};

/* ---------- 圆环之城: very long, like a giant worm made of many rings (but no worm) ---------- */
fxH_SH.v_yuanhuan=(g,x)=>{const {S,c}=x;const N=22,L=S*8;const rm=mt(c,{metalness:.5,roughness:.35});const R=[];
 const P=u=>V3((u-.5)*L,Math.sin(u*7)*S*.5,Math.sin(u*4.5+1)*S*.9);
 for(let i=0;i<N;i++){const u=i/(N-1);const tp=Math.sin(Math.PI*(.08+u*.84));const m=new THREE.Mesh(new THREE.TorusGeometry(S*.42*(.35+tp*.65),S*.07*(.5+tp*.5),8,28),rm);g.add(m);R.push({m,u})}
 const lp=[];for(let i=0;i<60;i++)lp.push(P(i/59));g.add(sparkles(lp,'#ffe0a8',S*.08,1,.6));
 const place=t=>{for(const k of R){const u=k.u,ph=t*.6;const p=P(u);p.y+=Math.sin(u*12-ph)*S*.12;const q=P(Math.min(1,u+.01)).sub(P(Math.max(0,u-.01))).normalize();k.m.position.copy(p);k.m.quaternion.setFromUnitVectors(V3(0,0,1),q)}};place(0);
 return t=>place(t)};

/* ---------- 蒸腾者: from outside a heap of rusted metal, the size of a grown void bus; small fliers keep merging into it ---------- */
fxH_SH.v_zhengteng=(g,x)=>{const {S,Rn,seed}=x;const geo=fxH_lumpGeo(S,3,.22,seed,V3(1.2,.8,1));const p=geo.attributes.position,cc=[],a=C('#7a4a2a'),b=C('#a8683a'),d=C('#4a2a18'),t3=new THREE.Color();
 for(let i=0;i<p.count;i++){const n=n3(p.getX(i)/S*4,p.getY(i)/S*4,p.getZ(i)/S*4);t3.copy(a).lerp(n>.55?b:d,Math.abs(n-.5)*1.6);cc.push(t3.r,t3.g,t3.b)}geo.setAttribute('color',new THREE.Float32BufferAttribute(cc,3));
 g.add(new THREE.Mesh(geo,detailMat(VC({roughness:.95,metalness:.25,flatShading:true}),{bump:.9,freq:1})));
 g.add(fxH_inst(lumpRock(1,5),mt('#ffffff',{roughness:.9,metalness:.3,flatShading:true}),70,(o,i)=>{const v=V3(Rn()-.5,(Rn()-.5)*.6,Rn()-.5).normalize();o.position.copy(v).multiplyScalar(S*(.92+Rn()*.12));o.rotation.set(Rn()*3,Rn()*3,Rn()*3);o.scale.setScalar(S*(.06+Rn()*.12))},['#8a5030','#6a3a1e','#b0703e']));
 // small rusty fliers drifting in to join the heap
 const N=40,F=[];const fm=fxH_inst(kd(1),mt('#9a5a30',{roughness:.9,flatShading:true}),N,()=>{});g.add(fm);for(let i=0;i<N;i++)F.push({v:V3(Rn()-.5,(Rn()-.5)*.7,Rn()-.5).normalize(),ph:Rn(),s:S*(.02+Rn()*.03)});
 const o=new THREE.Object3D();const step=t=>{for(let i=0;i<N;i++){const f=F[i];const u=(f.ph+t*.03)%1;o.position.copy(f.v).multiplyScalar(S*(2.6-u*1.6));o.rotation.set(t*.5+i,i,0);o.scale.setScalar(f.s*(u>.95?(1-u)*20:1));o.updateMatrix();fm.setMatrixAt(i,o.matrix)}fm.instanceMatrix.needsUpdate=true};step(0);
 return t=>{step(t);g.rotation.y=t*.01}};

/* ---------- 宙螺: shaped like the arrow-stone, a pointed cone with many tentacles at the thick end, six hundred metres long ---------- */
fxH_SH.v_zhouluo=(g,x)=>{const b=(SPEC.jianshi||fxA_jianshi)({col:x.c});b.scale.setScalar(x.S*.95);b.position.y=-x.S*.55;g.add(b);
 return t=>{b.userData.anim&&b.userData.anim(t*.5);g.rotation.y=Math.sin(t*.1)*.3;g.position.y=Math.sin(t*.4)*x.S*.1}};

/* ---------- 海参 · 秩序之域: a pitch-black sea cucumber hundreds of kilometres long, covered in short thick spikes ---------- */
fxH_SH.v_haishen=(g,x)=>{const {S,Rn}=x;const L=S*4.6,R=S*.75;const prof=[];for(let i=0;i<=24;i++){const t=i/24;prof.push(new THREE.Vector2(Math.max(.01,R*Math.pow(Math.sin(Math.PI*t),.55)*(1+.08*Math.sin(t*19))),(t-.5)*L))}
 const geo=new THREE.LatheGeometry(prof,28);geo.rotateZ(-Math.PI/2);geo.scale(1,.85,1);const skin=detailMat(mt('#18181a',{roughness:.55,metalness:.1}),{bump:.8,freq:.4});const body=new THREE.Mesh(geo,skin);g.add(body);
 g.add(fxH_inst(kc(1,1,6),mt('#26262a',{roughness:.6}),260,(o,i)=>{const t=.04+Rn()*.92,a=Rn()*6.283;const rr=R*Math.pow(Math.sin(Math.PI*t),.55);const n=V3(0,Math.cos(a)*.85,Math.sin(a));o.position.set((t-.5)*L,Math.cos(a)*rr*.85,Math.sin(a)*rr);o.quaternion.setFromUnitVectors(fxH_UP,n.normalize());const s=S*(.07+Rn()*.05);o.scale.set(s,s*(1.4+Rn()),s);o.translateY(s*.5)}));
 for(const s of[-1,1]){const m=new THREE.Mesh(new THREE.CircleGeometry(R*.18,16),new THREE.MeshBasicMaterial({color:'#000000'}));m.position.x=s*L*.5;m.rotation.y=s*Math.PI/2;g.add(m)}
 return t=>{g.rotation.x=Math.sin(t*.15)*.06;g.rotation.y=Math.sin(t*.08)*.1}};

/* ---------- 集粒 · 长方堡: a rectangular block a thousand kilometres long, covered in dull city-like protrusions ---------- */
fxH_SH.v_jili=(g,x)=>{const {S,Rn}=x;const A=S*2.4,B=A*.5,Hh=A*.3;const dm=detailMat(mt('#3a3a40',{roughness:.85,metalness:.25}),{bump:.4,freq:.5});
 g.add(new THREE.Mesh(kb(A,Hh,B),dm));
 g.add(fxH_inst(kb(1,1,1),mt('#ffffff',{roughness:.85,metalness:.2}),420,(o,i)=>{const top=i<330;const h=S*(.02+Rn()*Rn()*.16),w=S*(.03+Rn()*.07);if(top){o.position.set((Rn()-.5)*A*.97,Hh/2+h/2,(Rn()-.5)*B*.96);o.scale.set(w,h,w*(.6+Rn()*.8))}else{const s=Rn()<.5?1:-1;o.position.set((Rn()-.5)*A*.97,(Rn()-.5)*Hh*.9,s*(B/2+h/2));o.scale.set(w,w*(.6+Rn()),h)}},['#45454c','#34343a','#50505a','#2c2c32']));
 return t=>{g.position.y=Math.sin(t*.12)*S*.05}};

/* ---------- 焰锯: single round saws about a metre across, toothed rims, not solid, glowing red like a flickering hologram ---------- */
function fxH_sawGeo(teeth,inner){return new THREE.ShapeGeometry(fxH_sawShape(teeth,inner),1)}
function fxH_sawShape(teeth,inner){const s=new THREE.Shape();for(let i=0;i<teeth*2;i++){const a=i/(teeth*2)*Math.PI*2,r=i%2?.82:1;const X=Math.cos(a)*r,Y=Math.sin(a)*r;i?s.lineTo(X,Y):s.moveTo(X,Y)}s.closePath();const h=new THREE.Path();h.absarc(0,0,inner,0,Math.PI*2,true);if(inner>0)s.holes.push(h);return s}
fxH_SH.v_yanju=(g,x)=>{const {S,Rn,kp}=x;const N=kp.n||60;const m=fxH_addMat('#ff4a2a',.75);const im=new THREE.InstancedMesh(fxH_sawGeo(14,.7),m,N);im.frustumCulled=false;g.add(im);
 const P=[];for(let i=0;i<N;i++)P.push({p:V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize().multiplyScalar(S*Math.cbrt(Rn())),r:V3(Rn()*3,Rn()*3,Rn()*3),s:S*(.05+Rn()*.04),ph:Rn()*6});
 g.add(glowSprite('#ff4a2a',S*2.2,.18));const o=new THREE.Object3D();
 const step=t=>{for(let i=0;i<N;i++){const q=P[i];o.position.copy(q.p).add(V3(Math.sin(t*.4+q.ph)*S*.08,Math.cos(t*.3+q.ph)*S*.06,0));o.rotation.set(q.r.x,q.r.y,q.r.z+t*3);o.scale.setScalar(q.s);o.updateMatrix();im.setMatrixAt(i,o.matrix)}im.instanceMatrix.needsUpdate=true;m.opacity=.45+.25*Math.sin(t*23)*Math.sin(t*7.3)};step(0);return step};

/* ---------- 旋风生物: a whirlwind; debris turning round a small central ball, darkening ---------- */
fxH_SH.v_xuanfeng=(g,x)=>{const {S,Rn}=x;const core=new THREE.Mesh(new THREE.SphereGeometry(S*.14,16,12),mt('#2a2420',{roughness:.6}));g.add(core);
 const layers=[];const WC=['#2a2620','#3a3630','#4a4640','#1a1816','#5a5650'];
 for(let k=0;k<3;k++){const n=110;const im=fxH_inst(lumpRock(1,k+3),mt('#ffffff',{roughness:.9,flatShading:true}),n,(o,i)=>{const h=Rn(),a=Rn()*6.283,rr=S*(.15+h*h*1.1+k*.08)*(.85+Rn()*.3);o.position.set(Math.cos(a)*rr,(h-.45)*S*2.6,Math.sin(a)*rr);o.rotation.set(Rn()*3,Rn()*3,Rn()*3);o.scale.setScalar(S*(.015+Rn()*.035))},WC);g.add(im);layers.push({im,sp:.9-k*.25})}
 g.add(emitter({n:90,life:4,speed:S*.15,spread:.6,size:S*.4,dir:[0,1,0],col:'#3a342c',op:.35,add:false,tex:smokeTex,area:[S*.8,S*2,S*.8]}));
 return t=>{for(const l of layers)l.im.rotation.y=t*l.sp}};

/* ---------- 修理者: a heap of black and white square plates, each tens of metres, kilometres across in all ---------- */
fxH_SH.v_xiuli=(g,x)=>{const {S,Rn}=x;const N=190;
 g.add(fxH_inst(kb(1,.06,1),mt('#ffffff',{roughness:.6,metalness:.1}),N,(o,i)=>{const v=V3(Rn()-.5,(Rn()-.5)*.7,Rn()-.5);const d=Math.cbrt(Rn());v.normalize().multiplyScalar(S*d);o.position.copy(v);o.rotation.set((Rn()-.5)*1.4,Rn()*3,(Rn()-.5)*1.4);o.scale.setScalar(S*(.12+Rn()*.1))},['#141414','#e8e8e8']));
 // one or two white plates fired off and coming back
 const sh=[];for(let i=0;i<3;i++){const m=new THREE.Mesh(kb(S*.18,S*.012,S*.18),mt('#f2f2f2',{roughness:.5}));g.add(m);sh.push({m,a:i*2.1})}
 return t=>{for(const k of sh){const u=(t*.15+k.a/6.28)%1,r=S*(.6+Math.sin(u*Math.PI)*1.8);k.m.position.set(Math.cos(k.a)*r,Math.sin(u*6.28)*S*.3,Math.sin(k.a)*r);k.m.rotation.set(t,t*.7,0)}}};

/* ---------- 荆棘世界: no world at all, a thorn bush grown in the void, tangled into a ball ---------- */
fxH_SH.v_jingji=(g,x)=>{const {S,Rn}=x;const vm=detailMat(mt('#3a3020',{roughness:.85}),{bump:.6,freq:2/Math.max(1,S/20)}),tm=mt('#4a4228',{roughness:.7});const thorns=[];
 for(let k=0;k<34;k++){let v=V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize();const ax=V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize();const pts=[];let r=S*(.25+Rn()*.75);for(let i=0;i<10;i++){v.applyAxisAngle(ax,.32).normalize();r=Math.min(S*1.05,Math.max(S*.15,r+(Rn()-.5)*S*.18));pts.push(v.clone().multiplyScalar(r))}
  g.add(new THREE.Mesh(ktube(pts,S*(.012+Rn()*.016),30,5),k%3?vm:mt('#2a3a22',{roughness:.85})));const cu=new THREE.CatmullRomCurve3(pts);for(let j=0;j<12;j++){const u=Rn();thorns.push([cu.getPointAt(u),cu.getTangentAt(u)])}}
 g.add(fxH_inst(kc(1,1,4),tm,thorns.length,(o,i)=>{const [p,tn]=thorns[i];const side=V3(Rn()-.5,Rn()-.5,Rn()-.5).cross(tn).normalize();o.position.copy(p);o.quaternion.setFromUnitVectors(fxH_UP,side);const s=S*(.012+Rn()*.01);o.scale.set(s,s*(5+Rn()*6),s);o.translateY(s*3)}));
 return t=>{g.rotation.y=t*.01}};

/* ---------- 苦钉民: nail-shaped warships, really pins with a ball for a head ---------- */
fxH_SH.v_kuding=(g,x)=>{const {S,Rn,kp}=x;const n=Math.max(1,Math.min(kp.n||1,12));const mm=mt(x.c,{metalness:.65,roughness:.3});
 for(let i=0;i<n;i++){const p=new THREE.Group();const sh=new THREE.Mesh(kcy(S*.06,S*.05,S*2.8,10),mm);sh.rotation.z=Math.PI/2;p.add(sh);const tip=new THREE.Mesh(kc(S*.05,S*.6,10),mm);tip.rotation.z=-Math.PI/2;tip.position.x=S*1.7;p.add(tip);
  const hd=new THREE.Mesh(new THREE.SphereGeometry(S*.32,20,14),mm);hd.position.x=-S*1.5;p.add(hd);p.add(at(glowSprite(kp.glow||'#cfe8ff',S*.9,.55),-S*1.85,0,0));
  if(n>1){p.position.set((Rn()-.5)*S*7,(Rn()-.5)*S*2.5,(Rn()-.5)*S*7);p.rotation.y=(Rn()-.5)*.4}g.add(p)}
 return t=>{g.position.y=Math.sin(t*.5+x.seed)*S*.2}};

/* ---------- 尖刺舰队: every ship has many spikes or is a spike: spikes, saws, urchins, claws ---------- */
fxH_SH.v_jianci=(g,x)=>{const {S,Rn,kp}=x;const n=kp.n||9;const mm=mt(x.c,{metalness:.55,roughness:.35}),dk=mt('#7a6a48',{metalness:.5,roughness:.4});
 for(let i=0;i<n;i++){const s=new THREE.Group();const kind=i%4;
  if(kind===0){const sp=new THREE.Mesh(kc(S*.3,S*3,8),mm);sp.rotation.z=-Math.PI/2;s.add(sp);for(let k=0;k<6;k++){const b=new THREE.Mesh(kc(S*.06,S*.5,5),dk);const a=k/6*6.28;b.position.set(-S*.9,Math.cos(a)*S*.2,Math.sin(a)*S*.2);b.quaternion.setFromUnitVectors(fxH_UP,V3(-.4,Math.cos(a),Math.sin(a)).normalize());s.add(b)}}
  else if(kind===1){s.add(new THREE.Mesh(new THREE.SphereGeometry(S*.45,16,12),mm));s.add(fxH_inst(kc(1,1,5),dk,40,(o,k)=>{const v=V3(h3(i,k,1)-.5,h3(i,k,2)-.5,h3(i,k,3)-.5).normalize();o.position.copy(v).multiplyScalar(S*.42);o.quaternion.setFromUnitVectors(fxH_UP,v);o.scale.set(S*.06,S*(.6+h3(i,k,4)*.5),S*.06);o.translateY(.5)}))}
  else if(kind===2){const d=new THREE.Mesh(new THREE.ExtrudeGeometry(fxH_sawShape(16,0),{depth:.12,bevelEnabled:false}),mm);d.scale.setScalar(S*.9);s.add(d);const hub=new THREE.Mesh(kcy(S*.2,S*.2,S*.3,12),dk);hub.rotation.x=Math.PI/2;s.add(hub);s.userData.spin=1}
  else{const b=new THREE.Mesh(sharkGeo(S*2,S*.3,.7),mm);s.add(b);for(const z of[-1,1]){const pts=[];for(let k=0;k<=8;k++){const a=k/8;pts.push(V3(S*(.6+a*1.1),Math.sin(a*2.6)*S*.5,z*S*(.25+a*.3)))}s.add(new THREE.Mesh(ktube(pts,S*.06,16,5),dk))}}
  s.position.set((Rn()-.5)*S*9,(Rn()-.5)*S*3,(Rn()-.5)*S*9);s.rotation.y=Rn()*.6-.3;g.add(s)}
 return t=>{g.position.y=Math.sin(t*.5+x.seed)*S*.2;g.children.forEach((c,i)=>{if(c.userData.spin)c.rotation.z=t*1.5;else c.rotation.x=Math.sin(t*.7+i)*.05})}};

/* ---------- 愈石: crystal-like, shining cones over ten metres tall in the cracks of deep blue rock ---------- */
fxH_SH.v_yushi=(g,x)=>{const {Rn,kp}=x;const r=kp.r||110,s=kp.s||12,n=kp.n||60;
 g.add(fxH_inst(kd(1),detailMat(mt('#24304a',{roughness:.9,flatShading:true}),{bump:.5,freq:3}),n,(o,i)=>{const a=Rn()*6.28,d=r*Math.sqrt(Rn());o.position.set(Math.cos(a)*d,(Rn()-.5)*r*.3,Math.sin(a)*d);o.scale.set(s*(.6+Rn()*1.4),s*(.4+Rn()*.8),s*(.6+Rn()*1.4));o.rotation.set(Rn()*3,Rn()*3,Rn()*3)},['#24304a','#1a2440','#2e3a58']));
 const cr=[];for(let i=0;i<n*3;i++){const a=Rn()*6.28,d=r*Math.sqrt(Rn());cr.push(V3(Math.cos(a)*d,(Rn()-.5)*r*.3,Math.sin(a)*d))}
 g.add(fxH_inst(kc(1,1,6),mt('#d8f4e8',{roughness:.05,metalness:.2,transparent:true,opacity:.85,emissive:'#8affc0',emissiveIntensity:.35,flatShading:true}),cr.length,(o,i)=>{o.position.copy(cr[i]);o.rotation.set((Rn()-.5)*.8,Rn()*3,(Rn()-.5)*.8);const k=s*(.12+Rn()*.18);o.scale.set(k,k*(3+Rn()*3),k);o.translateY(k*1.5)}));
 g.add(swarmPts(80,r*.8,kp.glow||'#8affc0',s*.6,x.seed));return t=>{g.rotation.y=t*.01}};

/* ---------- 地镜: a colony of tiny pyramids, crystal-like and mirror-bright ---------- */
fxH_SH.v_dijing=(g,x)=>{const {S,Rn}=x;const pm=mt('#e8f4ff',{metalness:.92,roughness:.05,emissive:'#8ab8d8',emissiveIntensity:.08,flatShading:true});
 g.add(fxH_inst(new THREE.ConeGeometry(1,1.3,4),pm,70,(o,i)=>{const a=Rn()*6.28,d=S*Math.sqrt(Rn());o.position.set(Math.cos(a)*d,0,Math.sin(a)*d);o.rotation.y=Rn()*1.6;const k=S*(.05+Rn()*.12);o.scale.setScalar(k);o.translateY(k*.65)}));
 const base=new THREE.Mesh(new THREE.CylinderGeometry(S*1.05,S*.8,S*.12,24),mt('#5a6068',{roughness:.9}));base.position.y=-S*.06;g.add(base);
 g.add(glowSprite('#ffffff',S*2.4,.18));g.add(swarmPts(40,S*1.1,'#ffffff',S*.05,x.seed));return t=>{g.rotation.y=t*.04}};

/* ---------- 洒菌鸥: white, bird-like, a metre across the wings, in a flock ---------- */
fxH_SH.v_sajun=(g,x)=>{const {Rn,kp}=x;const n=Math.min(kp.n||40,60),s=4,orb=(kp.s||20);const geo=G([[new THREE.SphereGeometry(1,8,6),'#f4f4f0',{s:[.6,.3,.3]}],[wingGeo(1.4,.6),'#ffffff',{p:[0,0,.1]}],[wingGeo(1.4,.6),'#ffffff',{p:[0,0,-.1],s:[1,1,-1]}]]);
 const im=new THREE.InstancedMesh(geo,VC({side:THREE.DoubleSide,roughness:.8}),n);im.frustumCulled=false;g.add(im);const P=[];for(let i=0;i<n;i++)P.push({r:orb*(.4+Rn()*.8),y:(Rn()-.5)*orb*.6,ph:Rn()*6.28,sp:.2+Rn()*.2});
 const o=new THREE.Object3D();const step=t=>{for(let i=0;i<n;i++){const q=P[i],a=q.ph+t*q.sp;o.position.set(Math.cos(a)*q.r,q.y+Math.sin(t+i)*2,Math.sin(a)*q.r);o.rotation.set(0,-a-Math.PI/2,0);o.scale.set(s,s*(Math.abs(Math.sin(t*5+i))*.6+.5),s);o.updateMatrix();im.setMatrixAt(i,o.matrix)}im.instanceMatrix.needsUpdate=true};step(0);
 g.add(swarmPts(60,orb,'#f0f0e8',1.2,x.seed));return step};

/* ================= the frozen void (ningu) ================= */
/* ---------- 死亡战舰: a sword-shaped hull kilometres long, its whole skin packed with wreckage, bones and ruins; one of them skull-shaped ---------- */
function fxH_wreckSkin(par,Rn,N,place,s){const WC=['#3a332c','#4a4038','#2a2624','#6a5a48','#bdb29a','#57504a'];par.add(fxH_inst(lumpRock(1,17),mt('#ffffff',{roughness:.95,flatShading:true}),N,(o,i)=>{place(o,i);o.rotation.set(Rn()*3,Rn()*3,Rn()*3);const k=s*(.5+Rn()*1.2);o.scale.set(k*(.7+Rn()*.9),k*(.5+Rn()*.6),k*(.7+Rn()*.6))},WC))}
fxH_SH.ng_death=(g,x)=>{const {S,Rn}=x;const hm=mt('#2a2624',{roughness:.9}),bm=mt('#cfc5ae',{roughness:.8});
 for(let i=0;i<4;i++){const s=new THREE.Group();const L=S*(4-i*.6),W=L*.3,T=L*.08;
  // a blade: a long flat diamond tapering to a point
  const sh=new THREE.Shape();sh.moveTo(L*.5,0);sh.lineTo(L*.2,W*.5);sh.lineTo(-L*.45,W*.42);sh.lineTo(-L*.5,0);sh.lineTo(-L*.45,-W*.42);sh.lineTo(L*.2,-W*.5);sh.closePath();
  const bg=new THREE.ExtrudeGeometry(sh,{depth:T,bevelEnabled:true,bevelThickness:T*.4,bevelSize:W*.08,bevelSegments:1});bg.translate(0,0,-T/2);bg.rotateX(Math.PI/2);s.add(new THREE.Mesh(bg,hm));
  fxH_wreckSkin(s,Rn,120,(o)=>{const u=Rn()*2-1,v=Rn()*2-1;const xx=u*L*.47,hw=W*.45*(xx>L*.2?(L*.5-xx)/(L*.3):1);o.position.set(xx,(Rn()<.5?1:-1)*T*.6,v*hw)},S*.06);
  for(let k=0;k<10;k++){const b=new THREE.Mesh(new THREE.ConeGeometry(S*.03,S*(.3+Rn()*.4),5),bm);b.position.set((Rn()-.5)*L*.8,T*.6,(Rn()-.5)*W*.6);b.rotation.set((Rn()-.5)*.8,0,(Rn()-.5)*.8);s.add(b)}
  s.position.set((i-1.5)*S*.9,(Rn()-.5)*S*.8,(i%2?1:-1)*S*.7+(Rn()-.5)*S*.4);s.rotation.set((Rn()-.5)*.3,(Rn()-.5)*.8,(Rn()-.5)*.2);g.add(s)}
 // the skull-shaped one
 const sk=new THREE.Group();const bone=mt('#b8ad94',{roughness:.85});const hd=new THREE.Mesh(new THREE.SphereGeometry(S*.9,24,18),bone);hd.scale.set(1.15,.95,1);sk.add(hd);const jaw=new THREE.Mesh(kb(S*1.1,S*.35,S*.9),bone);jaw.position.set(S*.45,-S*.8,0);sk.add(jaw);
 for(const z of[-1,1]){const e=new THREE.Mesh(new THREE.SphereGeometry(S*.24,12,10),new THREE.MeshBasicMaterial({color:'#0a0606'}));e.position.set(S*.85,S*.08,z*S*.36);sk.add(e);sk.add(at(glowSprite('#ff3a2a',S*.5,.6),S*1,S*.08,z*S*.36))}
 fxH_wreckSkin(sk,Rn,90,(o)=>{const v=V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize();o.position.copy(v).multiply(V3(S*1.05,S*.9,S*.95))},S*.07);
 sk.position.set(S*1.6,S*1.1,-S*1.2);g.add(sk);return null};

/* ---------- 失落军团 · 真菌区域: floating ribs wrapped in mycelium, mycelium bridges with burning mushrooms, all tied to a mycelium-wrapped ball ---------- */
fxH_SH.ng_lost=(g,x)=>{const {S,Rn,seed}=x;const base=kitShape(x.w,x.sp,true);g.add(base);
 const rib=mt('#d8ccb8',{roughness:.8}),fuzz=mt('#c8b8a8',{roughness:1,transparent:true,opacity:.55,depthWrite:false});const ends=[];
 for(let i=0;i<9;i++){const q=new THREE.Group();q.position.set(0,0,(i-4)*S*.42);q.rotation.z=(Rn()-.5)*.3;const R=S*(2-Math.abs(i-4)*.12),arc=Math.PI*.95;
  const t=new THREE.Mesh(new THREE.TorusGeometry(R,S*.05,6,40,arc),rib);t.rotation.z=Math.PI*.5-arc/2+Math.PI;q.add(t);const f=new THREE.Mesh(new THREE.TorusGeometry(R,S*.085,6,40,arc),fuzz);f.rotation.z=t.rotation.z;q.add(f);
  for(const s of[0,1]){const a=t.rotation.z+s*arc;ends.push(q.position.clone().add(V3(Math.cos(a)*R,Math.sin(a)*R,0).applyAxisAngle(V3(0,0,1),q.rotation.z)))}
  const a2=t.rotation.z+arc*.5;ends.push(q.position.clone().add(V3(Math.cos(a2)*R,Math.sin(a2)*R,0).applyAxisAngle(V3(0,0,1),q.rotation.z)));g.add(q)}
 // bridges: ribs to ribs and ribs to the ball, each with a few burning mushrooms
 const bm=mt('#bfae98',{roughness:1}),cap=mt('#e8d8c0',{roughness:.8});const fl=[];
 for(let i=0;i<ends.length;i++){const a=ends[i],b=i%3===2?V3(0,0,0).add(a.clone().normalize().multiplyScalar(S*.95)):ends[(i+3)%ends.length];const mid=a.clone().lerp(b,.5).addScaledVector(fxH_UP,-S*.15);
  g.add(new THREE.Mesh(ktube([a,mid,b],S*.02,16,4),bm));for(let k=1;k<=2;k++){const p=new THREE.CatmullRomCurve3([a,mid,b]).getPointAt(k/3);const m=new THREE.Mesh(new THREE.SphereGeometry(S*.05,8,5,0,6.283,0,1.5),cap);m.position.copy(p).addScaledVector(fxH_UP,S*.03);g.add(m);fl.push(m.position.clone().addScaledVector(fxH_UP,S*.06))}}
 g.add(sparkles(fl,'#ffa040',S*.12,1,1));for(let i=0;i<fl.length;i+=4){const s=glowSprite('#ff8a3a',S*.4,.6);s.position.copy(fl[i]);g.add(s)}
 const bugs=[];for(let i=0;i<120;i++)bugs.push(V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize().multiplyScalar((x.kp.r||22)*1.01));g.add(sparkles(bugs,'#9fe8ff',S*.05,1,.6));
 return null};

/* ---------- 球神的世界: overpasses ten kilometres wide criss-cross its sky, carrying cities ---------- */
fxH_SH.ng_qiushen=(g,x)=>{const {Rn}=x;const r=x.kp.r||90;const base=kitShape(x.w,x.sp,true);g.add(base);
 const bm=mt('#b0a494',{roughness:.6,metalness:.3,side:THREE.DoubleSide,emissive:'#3a342c',emissiveIntensity:.3}),pm=mt('#5a524a',{roughness:.8});const lots=[];
 for(let i=0;i<9;i++){const R=r*(1.1+Rn()*.14),th=.9+Rn()*1.3,w=r*(.07+Rn()*.05);const band=new THREE.Group();band.quaternion.setFromUnitVectors(fxH_UP,V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize());band.rotateY(Rn()*6.28);
  band.add(new THREE.Mesh(new THREE.CylinderGeometry(R,R,w,64,1,true,0,th),bm));
  for(const a of[0,th]){const d=V3(Math.sin(a),0,Math.cos(a));const p=new THREE.Mesh(kcy(w*.25,w*.35,R-r*.98,6),pm);p.position.copy(d).multiplyScalar((R+r*.98)/2);p.quaternion.setFromUnitVectors(fxH_UP,d);band.add(p)}
  band.updateMatrix();for(let k=0;k<40;k++){const a=Rn()*th,d=V3(Math.sin(a),0,Math.cos(a));lots.push({m:band.matrix.clone(),d,R,y:(Rn()-.5)*w*.8,h:r*(.012+Rn()*.03)})}g.add(band)}
 g.add(fxH_inst(kb(1,1,1),mt('#ffffff',{roughness:.6,emissive:'#ffd890',emissiveIntensity:.45}),lots.length,(o,i)=>{const L=lots[i];o.position.copy(L.d).multiplyScalar(L.R+L.h/2);o.position.y=L.y;o.quaternion.setFromUnitVectors(fxH_UP,L.d);o.scale.set(r*.018,L.h,r*.018);o.updateMatrix();o.applyMatrix4(L.m)},['#c8b8a0','#a89880','#e8d8b8']));
 return null};

/* ---------- 松果: a pine-cone body; its skin is scales with canyon-deep gaps between them ---------- */
fxH_SH.ng_pinecone=(g,x)=>{const {Rn}=x;const r=x.kp.r||30;const H=r*2.6;const prof=[];for(let i=0;i<=20;i++){const t=i/20;prof.push(new THREE.Vector2(Math.max(.01,r*Math.sin(Math.PI*Math.pow(t,.8))*(1-t*.35)),(t-.45)*H))}
 g.add(new THREE.Mesh(new THREE.LatheGeometry(prof,24),mt('#1a120a',{roughness:1})));
 const cu=new THREE.SplineCurve(prof);const N=260;const GA=Math.PI*(3-Math.sqrt(5));
 const sc=new THREE.SphereGeometry(1,10,6,0,Math.PI*2,0,Math.PI/2);sc.scale(1,.25,1);
 g.add(fxH_inst(sc,mt('#ffffff',{roughness:.85,flatShading:true}),N,(o,i)=>{const t=.03+i/N*.92;const p=cu.getPoint(t),p2=cu.getPoint(Math.min(1,t+.01));const a=i*GA;const rad=V3(Math.cos(a),0,Math.sin(a));
  o.position.set(rad.x*p.x,p.y,rad.z*p.x);const dx=p2.x-p.x,dy=p2.y-p.y,L=Math.hypot(dx,dy)||1;const nrm=rad.clone().multiplyScalar(dy/L).addScaledVector(fxH_UP,-dx/L).normalize();
  nrm.addScaledVector(fxH_UP,-.35).normalize();o.quaternion.setFromUnitVectors(fxH_UP,nrm);const k=r*(.16+.12*Math.sin(Math.PI*t));o.scale.set(k*1.1,k,k*.85)},['#6a5038','#5a4430','#7a5c40','#3a2818']));
 return null};

/* ---------- 合造的世界: an earth with its sea cut into blocks that float in the air like slices of cake, over a dry seabed ---------- */
fxH_SH.ng_hezao=(g,x)=>{const {Rn}=x;const r=x.kp.r||30;g.add(kitShape(x.w,x.sp,true));
 const wm=new THREE.MeshStandardMaterial({color:'#3a8ab8',transparent:true,opacity:.6,roughness:.1,metalness:.1,emissive:'#1a4a6a',emissiveIntensity:.3,depthWrite:false});
 for(let i=0;i<16;i++){const d=V3(Rn()-.5,(Rn()-.5)*1.4,Rn()-.5).normalize();const R=r*(1.18+Rn()*.12);const sl=new THREE.Mesh(new THREE.CylinderGeometry(r*(.12+Rn()*.08),r*(.12+Rn()*.08),r*.06,3+(i%3),1),wm);sl.position.copy(d).multiplyScalar(R);sl.quaternion.setFromUnitVectors(fxH_UP,d);sl.rotateY(Rn()*3);g.add(sl)}
 return null};

/* ================= the unforeseeable land (buke) ================= */
/* ---------- 碎裂的大地: one floating land, six hundred kilometres, its cracked skin peeling off into fragments ---------- */
fxH_SH.bk_crying=(g,x)=>{const {S,Rn,seed}=x;const geo=fxH_lumpGeo(S*.8,3,.16,seed,V3(1.3,.6,1.1));g.add(new THREE.Mesh(geo,detailMat(mt('#8a8070',{roughness:.95,flatShading:true}),{bump:.9,freq:.8})));
 const cm=new THREE.MeshBasicMaterial({color:'#2a241e'});for(let k=0;k<12;k++){const pts=[];let v=V3(Rn()-.5,Rn()*.4+.1,Rn()-.5).normalize();for(let i=0;i<9;i++){v=v.clone().add(V3(Rn()-.5,(Rn()-.5)*.3,Rn()-.5).multiplyScalar(.18)).normalize();pts.push(v.clone().multiply(V3(S*1.06,S*.5,S*.9)))}g.add(new THREE.Mesh(ktube(pts,S*.008,24,4),cm))}
 const N=90,F=[];const fm=fxH_inst(lumpRock(1,9),mt('#8a8070',{roughness:.95,flatShading:true}),N,()=>{});g.add(fm);for(let i=0;i<N;i++)F.push({v:V3(Rn()-.5,(Rn()-.5)*.8,Rn()-.5).normalize(),ph:Rn(),s:S*(.015+Rn()*.03),sp:.02+Rn()*.03});
 const o=new THREE.Object3D();const step=t=>{for(let i=0;i<N;i++){const f=F[i],u=(f.ph+t*f.sp)%1;o.position.copy(f.v).multiply(V3(S*1.05,S*.55,S*.9)).multiplyScalar(1+u*1.4);o.rotation.set(t*.2+i,i*2,0);o.scale.setScalar(f.s*(u<.05?u*20:1));o.updateMatrix();fm.setMatrixAt(i,o.matrix)}fm.instanceMatrix.needsUpdate=true};step(0);return step};

/* ---------- 尔什的武器: a ten-kilometre sphere, half black and half white, carrying a black-and-white block like a puzzle cube ---------- */
fxH_SH.v_erxiwuqi=(g,x)=>{const {S}=x;const wm=mt('#f2f2ee',{roughness:.35,metalness:.2}),bm=mt('#141416',{roughness:.3,metalness:.5});
 for(const [m,a] of [[wm,0],[bm,Math.PI]]){const h=new THREE.Mesh(new THREE.SphereGeometry(S,40,20,0,Math.PI*2,0,Math.PI/2),m);h.rotation.x=a;g.add(h)}
 // the block, pushed half out of the seam: small cubes in a checker of black and white
 const cb=new THREE.Group();const n=3,u=S*.22;for(let i=0;i<n;i++)for(let j=0;j<n;j++)for(let k=0;k<n;k++){const b=new THREE.Mesh(kb(u*.94,u*.94,u*.94),(i+j+k)%2?bm:wm);b.position.set((i-1)*u,(j-1)*u,(k-1)*u);cb.add(b)}
 cb.position.set(S*.95,0,0);g.add(cb);g.add(at(glowSprite('#ffffff',S*.8,.25),S*.95,0,0));
 return t=>{cb.rotation.y=t*.15;cb.rotation.x=Math.sin(t*.1)*.3}};
/* ---------- 雾观: at the end of a misty side-passage, a flat white wall that blooms into a speaking picture of a starry sky ---------- */
fxH_SH.v_wuguan=(g,x)=>{const {S,Rn}=x;const wl=new THREE.Mesh(kb(S*2.4,S*1.6,S*.08),mt('#f4f4f6',{roughness:.6,emissive:'#d8dce8',emissiveIntensity:.2}));g.add(wl);
 const P=[];for(let i=0;i<160;i++)P.push(V3((Rn()-.5)*S*2.2,(Rn()-.5)*S*1.4,S*.06));const st=sparkles(P,'#6a7aff',S*.03,1,.8);g.add(st);
 const fm=new THREE.SpriteMaterial({map:smokeTex,color:'#dfe4ec',transparent:true,opacity:.35,depthWrite:false});const F=[];
 for(let i=0;i<10;i++){const sp=new THREE.Sprite(fm);const z=S*.6+i*S*.45;sp.position.set((Rn()-.5)*S,(Rn()-.5)*S*.6,z);sp.scale.set(S*1.8,S*1.2,1);g.add(sp);F.push([sp,z])}
 return t=>{const k=.5+.5*Math.sin(t*.4);st.material.uniforms.uOp.value=.2+.7*k;for(const [sp,z] of F)sp.position.z=z+Math.sin(t*.15+z)*S*.1}};
/* ---------- 肉块 · 同旅者: blood-red lumps of tiny machines crowding over a white octopus-shaped station ---------- */
fxH_SH.v_roukuai=(g,x)=>{const {S,Rn}=x;const wm=mt('#eceae4',{roughness:.5,metalness:.2});const hd=new THREE.Mesh(new THREE.SphereGeometry(S*.6,24,16),wm);hd.scale.y=1.2;hd.position.y=S*.3;g.add(hd);
 const arms=[];for(let i=0;i<8;i++){const a=i/8*6.283,pts=[];for(let k=0;k<=8;k++){const r=S*(.4+k*.16);pts.push(V3(Math.cos(a)*r,-k*S*.1-Math.sin(k*.6)*S*.15,Math.sin(a)*r))}
  const arm=new THREE.Mesh(ktube(pts,S*.09,24,6),wm);g.add(arm);arms.push(arm)}
 const lump=new THREE.IcosahedronGeometry(1,0);const L=[];for(let i=0;i<120;i++){const v=V3(Rn()-.5,Rn()*.9-.2,Rn()-.5).normalize().multiplyScalar(S*(.62+Rn()*.9));L.push(v)}
 const lm=fxH_inst(lump,mt('#a82a2a',{roughness:.6,emissive:'#4a0808',emissiveIntensity:.4,flatShading:true}),L.length,(o,i)=>{o.position.copy(L[i]);o.rotation.set(Rn()*3,Rn()*3,0);o.scale.setScalar(S*(.04+Rn()*.07))});g.add(lm);
 return t=>{lm.rotation.y=t*.05;for(let i=0;i<arms.length;i++)arms[i].rotation.y=Math.sin(t*.4+i)*.05}};
/* ---------- 黑层 · 逃离者: black cube buildings with glowing window slits, joined by black bridges, beetle-suits drifting out ---------- */
fxH_SH.v_heiceng=(g,x)=>{const {S,Rn}=x;const bm=mt('#121216',{roughness:.4,metalness:.5}),wn=new THREE.MeshBasicMaterial({color:'#ffd890'});const B=[];
 for(let i=0;i<7;i++){const s=S*(.3+Rn()*.7),p=V3((Rn()-.5)*S*3,(Rn()-.5)*S*1.2,(Rn()-.5)*S*3);const b=new THREE.Mesh(kb(s,s,s),bm);b.position.copy(p);g.add(b);B.push(p);
  for(let k=0;k<3;k++){const w=new THREE.Mesh(kb(s*.7,s*.03,s*1.01),wn);w.position.copy(p);w.position.y+=(k-1)*s*.25;g.add(w)}}
 for(let i=1;i<B.length;i++){const a=B[i-1],b=B[i],d=b.clone().sub(a);const br=new THREE.Mesh(kb(S*.06,S*.06,d.length()),bm);br.position.copy(a).addScaledVector(d,.5);br.lookAt(b);g.add(br)}
 const fl=[];for(let i=0;i<14;i++){const sp=glowSprite('#c8ff9a',S*.12,.9);g.add(sp);fl.push([sp,B[i%B.length],Rn()*6.28,S*(.5+Rn()*.6)])}
 return t=>{for(const [sp,c,ph,r] of fl)sp.position.set(c.x+Math.cos(t*.2+ph)*r,c.y+Math.sin(t*.3+ph)*r*.4,c.z+Math.sin(t*.2+ph)*r)}};
/* ---------- 藤壶礁: a reef rock that is really a precise craft, crowded with barnacle-like residents ---------- */
fxH_SH.bk_tenghu=(g,x)=>{const {Rn,seed}=x;const r=x.kp.r||40;const geo=fxH_lumpGeo(r*.6,3,.2,seed,V3(1.4,.7,1));g.add(new THREE.Mesh(geo,detailMat(mt('#8a8a7a',{roughness:.9,flatShading:true}),{bump:.8,freq:1})));
 const p=geo.attributes.position;const sites=[];for(let i=0;i<800;i++){const k=(Rn()*p.count)|0;const v=V3(p.getX(k),p.getY(k),p.getZ(k));sites.push(v)}
 const shell=new THREE.CylinderGeometry(.45,1,1.1,8,1,true);shell.translate(0,.55,0);
 g.add(fxH_inst(shell,mt('#c8c0a8',{roughness:.7,side:THREE.DoubleSide}),sites.length,(o,i)=>{const v=sites[i];o.position.copy(v);o.quaternion.setFromUnitVectors(fxH_UP,v.clone().normalize());const s=r*(.014+Rn()*.02);o.scale.set(s,s*(.8+Rn()*.6),s)},['#c8c0a8','#b8b098','#d8d0b8']));
 g.add(fxH_inst(new THREE.SphereGeometry(1,8,6),mt('#c88a7a',{roughness:.5}),sites.length,(o,i)=>{const v=sites[i];o.position.copy(v).addScaledVector(v.clone().normalize(),r*.03);o.scale.setScalar(r*.007)}));
 return t=>{g.rotation.y=t*.02}};

/* ---------- 奇迹制裁: pure white, shaped like a flute a hundred kilometres long, many round holes in it; phoenixes fly round it ---------- */
fxH_SH.bk_qiji=(g,x)=>{const {S,Rn}=x;const L=S*9,r=S*.32;const fm=mt('#f6f6f2',{roughness:.35,emissive:'#fff8e8',emissiveIntensity:.12});
 const t=new THREE.Mesh(new THREE.CylinderGeometry(r,r,L,28,1,true),fm);t.rotation.z=Math.PI/2;g.add(t);for(const s of[-1,1]){const cp=new THREE.Mesh(new THREE.SphereGeometry(r,20,10),fm);cp.position.x=s*L/2;cp.scale.x=.4;g.add(cp)}
 g.add(fxH_inst(new THREE.CircleGeometry(1,14),new THREE.MeshBasicMaterial({color:'#1a1814'}),72,(o,i)=>{const row=i%3,k=(i/3)|0;const a=(row-1)*.7+Math.PI/2;const xx=-L*.45+k*L*.9/23;const d=V3(0,Math.sin(a),Math.cos(a));o.position.set(xx,d.y*r*1.005,d.z*r*1.005);o.quaternion.setFromUnitVectors(V3(0,0,1),d);o.scale.setScalar(r*(.16+((k*7+row)%3)*.04))}));
 const ph=[];for(let i=0;i<18;i++){const s=glowSprite('#ffb060',S*.35,.9);g.add(s);ph.push({s,a:Rn()*6.28,x:(Rn()-.5)*L*.9,rr:r*(2+Rn()*2),sp:.4+Rn()*.4})}
 g.add(glowSprite('#fff4e0',L*.5,.12));
 // it is a weapon: now and then a hole fires a long white shot at a runaway miracle out ahead
 const sh=[];for(let i=0;i<4;i++){const m=new THREE.MeshBasicMaterial({color:'#fff6dc',transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false});
  const b=new THREE.Mesh(new THREE.CylinderGeometry(r*.05,r*.12,L*1.2,8,1,true),m);b.geometry.translate(0,L*.6,0);b.rotation.x=Math.PI/2;b.position.set(-L*.4+i*L*.27,0,r);b.visible=false;g.add(b);sh.push([b,Rn()*6.283,.18+Rn()*.12])}
 return tt=>{for(const k of ph){const a=k.a+tt*k.sp;k.s.position.set(k.x+Math.sin(tt*.2+k.a)*S,Math.cos(a)*k.rr,Math.sin(a)*k.rr)}
  for(const [b,p,k] of sh){const v=Math.sin(tt*k+p);b.visible=v>.95;if(b.visible)b.material.opacity=(v-.95)*16}}};

/* ---------- 悬挂之城: a disc of dream residue a kilometre up; threads hang from it, each ending in a cube or ball house; a low residue wall below ---------- */
fxH_SH.bk_hang=(g,x)=>{const {S,Rn}=x;const Y=S*.9;const dm=mt('#e8dcb8',{roughness:.7});
 const disc=new THREE.Mesh(kcy(S,S*.96,S*.06,48),dm);disc.position.y=Y;g.add(disc);const under=new THREE.Mesh(new THREE.CircleGeometry(S*.96,48),mt('#c8bca0',{roughness:.8}));under.rotation.x=Math.PI/2;under.position.y=Y-S*.031;g.add(under);
 const pos=[],H=[];for(let i=0;i<70;i++){const a=Rn()*6.28,d=Math.sqrt(Rn())*S*.9;const len=S*(.15+Rn()*.6);const xx=Math.cos(a)*d,zz=Math.sin(a)*d;pos.push(xx,Y-S*.03,zz,xx,Y-len,zz);H.push([xx,Y-len,zz,i%2])}
 const lg=new THREE.BufferGeometry();lg.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.add(new THREE.LineSegments(lg,new THREE.LineBasicMaterial({color:'#e8dcc0',transparent:true,opacity:.8})));
 const hm=mt('#f6f0e0',{roughness:.6});const cubes=H.filter(h=>!h[3]),balls=H.filter(h=>h[3]);
 g.add(fxH_inst(kb(1,1,1),hm,cubes.length,(o,i)=>{const h=cubes[i];const s=S*(.03+Rn()*.03);o.position.set(h[0],h[1]-s/2,h[2]);o.scale.setScalar(s);o.rotation.y=Rn()*3}));
 g.add(fxH_inst(new THREE.SphereGeometry(1,12,8),hm,balls.length,(o,i)=>{const h=balls[i];const s=S*(.02+Rn()*.02);o.position.set(h[0],h[1]-s,h[2]);o.scale.setScalar(s)}));
 const wl=[];for(let i=0;i<H.length;i+=3)wl.push(V3(H[i][0],H[i][1]-S*.02,H[i][2]));g.add(sparkles(wl,'#ffe0a8',S*.04,1,.5));
 const gr=new THREE.Mesh(kcy(S*1.15,S*1.1,S*.05,40),mt('#8a8274',{roughness:.95}));gr.position.y=-S*.025;g.add(gr);
 const wall=new THREE.Mesh(new THREE.CylinderGeometry(S*1.05,S*1.05,S*.05,64,1,true),mt('#d8d0c0',{roughness:.9,side:THREE.DoubleSide}));wall.position.y=S*.025;g.add(wall);
 return t=>{disc.position.y=Y+Math.sin(t*.4)*S*.01}};

/* ---------- 资料室: a crown-of-thorns starfish: ten arms, covered in spines ---------- */
fxH_SH.bk_ziliao=(g,x)=>{const {S,c,Rn}=x;const am=detailMat(mt(c,{roughness:.75}),{bump:.6,freq:1}),spm=mt('#e8a890',{roughness:.6});const sp=[];
 {const cb=new THREE.Mesh(new THREE.SphereGeometry(S*.6,20,12),am);cb.scale.set(1,.35,1);g.add(cb)}
 for(let i=0;i<10;i++){const a=i/10*6.283;const arm=new THREE.Mesh(new THREE.ConeGeometry(S*.26,S*1.6,10),am);arm.rotation.z=-Math.PI/2;arm.position.x=S*.95;arm.scale.set(.55,1,1);const q=new THREE.Group();q.add(arm);q.rotation.y=a;q.rotation.z=-.08;g.add(q);
  for(let k=0;k<16;k++){const u=Rn();const rr=S*.26*(1-u)*.9;const b=Rn()*Math.PI;sp.push({a,x:S*(.2+u*1.55),y:Math.sin(b)*rr*.55,z:Math.cos(b)*rr})}}
 g.add(fxH_inst(kc(1,1,5),spm,sp.length,(o,i)=>{const s=sp[i];const p=V3(s.x,s.y,s.z).applyAxisAngle(fxH_UP,s.a);o.position.copy(p);const n=V3(0,s.y,s.z).normalize().applyAxisAngle(fxH_UP,s.a);if(n.lengthSq()<.5)n.set(0,1,0);o.quaternion.setFromUnitVectors(fxH_UP,n);const k=S*.022;o.scale.set(k,k*4.5,k);o.translateY(k*1.8)}));
 return t=>{g.rotation.y=t*.03}};

/* ---------- 秩序守护者: great dream beings that look made of platinum and bronze; one is a faceless white-gold humanoid ---------- */
fxH_SH.bk_order=(g,x)=>{const {S}=x;const pl=mt('#e4e0d4',{metalness:.85,roughness:.25}),br=mt('#b07a3a',{metalness:.8,roughness:.3}),wg=mt('#f0e2b8',{metalness:.85,roughness:.2,emissive:'#5a4a20',emissiveIntensity:.2});const F=[];
 [[0,0,1.5,wg],[-S*.9,-S*.2,1.1,pl],[S*.9,-S*.25,1,pl]].forEach(([xx,zz,k,m],i)=>{const f=fxH_faceless(S*k,m,br);f.position.set(xx,-S*.6,zz);f.rotation.y=-.3+i*.3;g.add(f);F.push(f)});
 g.add(swarmPts(60,S*1.6,'#f4f0e0',S*.03,x.seed));
 return t=>{F.forEach((f,i)=>{f.position.y=-S*.6+Math.sin(t*.4+i)*S*.04;const ar=f.userData.arms;ar[0].rotation.z=Math.sin(t*.5+i)*.15;ar[1].rotation.z=-Math.sin(t*.5+i)*.15})}};

/* ---------- 攀天城: an ellipsoid over a hundred kilometres, made all of writhing tentacles, silver skin that looks metallic ---------- */
fxH_SH.v_pantian=(g,x)=>{const {S,Rn,seed}=x;const sm2=mt('#b8bcc4',{metalness:.8,roughness:.3});const core=new THREE.Mesh(fxH_lumpGeo(S,3,.08,seed,V3(1.5,.85,1)),sm2);g.add(core);
 const groups=[];for(let k=0;k<6;k++){const q=new THREE.Group();g.add(q);groups.push(q)}
 for(let i=0;i<110;i++){const n=V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize();const base=n.clone().multiply(V3(S*1.45,S*.82,S*.96));const t1=V3(Rn()-.5,Rn()-.5,Rn()-.5).cross(n).normalize(),t2=n.clone().cross(t1);const L=S*(.3+Rn()*.5),pts=[];
  for(let j=0;j<=8;j++){const u=j/8,a=u*5+Rn();pts.push(base.clone().addScaledVector(n,u*L).addScaledVector(t1,Math.cos(a)*S*.08*u).addScaledVector(t2,Math.sin(a)*S*.08*u))}
  groups[i%6].add(new THREE.Mesh(ktube(pts,S*(.02+Rn()*.04)*(1),14,5),sm2))}
 return t=>{groups.forEach((q,i)=>{q.rotation.set(Math.sin(t*.5+i)*.03,Math.sin(t*.4+i*2)*.03,Math.cos(t*.45+i)*.03)});g.rotation.y=t*.01}};

/* ---------- 颗粒生物: white grains a few centimetres across, never touching, gathered into bodies, here a three-metre figure ---------- */
fxH_SH.v_keli=(g,x)=>{const {S,Rn}=x;const H=S*1.4,pts=[];const add=(cx,cy,cz,rx,ry,rz,n)=>{for(let i=0;i<n;i++){const v=V3(Rn()-.5,Rn()-.5,Rn()-.5).normalize().multiplyScalar(Math.cbrt(Rn()));pts.push(V3(cx+v.x*rx,cy+v.y*ry,cz+v.z*rz))}};
 add(0,H*.9,0,H*.07,H*.08,H*.07,60);add(0,H*.64,0,H*.11,H*.18,H*.08,170);for(const z of[-1,1]){add(0,H*.62,z*H*.17,H*.03,H*.2,H*.03,45);add(0,H*.25,z*H*.07,H*.04,H*.24,H*.04,70)}
 const p=sparkles(pts,'#f4f4f8',S*.05,1,.3);p.position.y=-H*.5;g.add(p);g.add(swarmPts(80,S*1.2,'#e0e0ea',S*.03,x.seed));return t=>{p.rotation.y=Math.sin(t*.3)*.6}};

/* ================= dream ================= */
/* ---------- 微缩银河: a pitch-black disc ten kilometres across, a vortex of countless points of light printed on its face ---------- */
fxH_SH.dr_galaxy=(g,x)=>{const {Rn}=x;const r=x.kp.r||46;const disc=new THREE.Mesh(kcy(r,r,r*.035,64),mt('#050508',{roughness:.45,metalness:.2}));g.add(disc);
 const pts=[];for(let i=0;i<1400;i++){const t=i/1400,ang=t*6.28*4+(i%2)*Math.PI,rr=r*(.06+t*.9);pts.push(V3(Math.cos(ang)*rr+(Rn()-.5)*r*.05,r*.02,Math.sin(ang)*rr+(Rn()-.5)*r*.05))}
 const sp=sparkles(pts,x.c,r*.03,1,.4);g.add(sp);g.add(at(glowSprite('#ffffff',r*.3,.7),0,r*.03,0));g.rotation.x=.35;
 return t=>{sp.rotation.y=-t*.06}};

/* ---------- 熔链: countless rings that link into giant chains round a dark centre ---------- */
fxH_SH.dr_ronglian=(g,x)=>{const {Rn}=x;const r=x.kp.r||30;g.add(new THREE.Mesh(new THREE.SphereGeometry(r*.35,24,16),mt('#120808',{roughness:.6})));g.add(glowSprite('#ff6a2a',r*1.2,.25));
 const rm=mt(x.c,{metalness:.5,roughness:.35,emissive:x.c,emissiveIntensity:.5});const chains=[];
 for(let k=0;k<3;k++){const q=new THREE.Group();q.rotation.set(Rn()*1.2,Rn()*3,Rn()*1.2);const N=26,R=r*(.85+k*.22);for(let i=0;i<N;i++){const a=i/N*6.283;const l=new THREE.Mesh(new THREE.TorusGeometry(r*.11,r*.025,6,16),rm);l.position.set(Math.cos(a)*R,0,Math.sin(a)*R);l.lookAt(l.position.clone().add(V3(-Math.sin(a),0,Math.cos(a))));l.rotateY(Math.PI/2);if(i%2)l.rotateX(Math.PI/2);q.add(l)}g.add(q);chains.push(q)}
 return t=>{chains.forEach((q,i)=>q.rotateY(.002*(i%2?1:-1)))}};

/* ---------- 脑灵: seen as a crowd of jostling clusters of light ---------- */
fxH_SH.dr_brainspirit=(g,x)=>{const {Rn}=x;const r=x.kp.r||40;const B=[];for(let i=0;i<14;i++){const q=new THREE.Group();q.position.set((Rn()-.5)*r*1.6,(Rn()-.5)*r*.8,(Rn()-.5)*r*1.6);q.add(glowSprite(x.c,r*.35,.6));q.add(swarmPts(30,r*.12,'#f0e0ff',r*.025,i+3));g.add(q);B.push({q,p:q.position.clone(),ph:Rn()*6})}
 return t=>{for(const b of B)b.q.position.set(b.p.x+Math.sin(t*.8+b.ph)*r*.08,b.p.y+Math.cos(t*.7+b.ph)*r*.06,b.p.z+Math.sin(t*.6+b.ph*2)*r*.08)}};

/* ---------- 最后之地: white houses tens of metres tall, pyramids, shells and stacked cubes on a golden plain ---------- */
fxH_SH.dr_lastland=(g,x)=>{const {Rn}=x;const r=x.kp.r||44;const base=kitShape(x.w,x.sp,x.frozen);g.add(base);const wm=mt('#f4f2ec',{roughness:.6});
 for(let i=0;i<18;i++){const a=Rn()*6.28,d=Math.sqrt(Rn())*r*.75,h=r*(.04+Rn()*.05);const p=V3(Math.cos(a)*d,r*.06,Math.sin(a)*d);let m;
  if(i%3===0){m=new THREE.Mesh(kc(h*.8,h*1.4,4),wm);m.position.copy(p).add(V3(0,h*.7,0))}else if(i%3===1){m=new THREE.Mesh(new THREE.SphereGeometry(h*.7,12,8,0,6.283,0,Math.PI/2),wm);m.scale.set(1,1.3,1.6);m.position.copy(p)}
  else{m=new THREE.Group();for(let k=0;k<3;k++){const b=new THREE.Mesh(kb(h*.6,h*.6,h*.6),wm);b.position.set(k===2?h*.15:(k?h*.3:-h*.0),h*.3+(k===2?h*.6:0),k===1?h*.2:0);b.rotation.y=k*.6;m.add(b)}m.position.copy(p)}
  base.add(m)}
 return null};

/* ================= midgard and the white tunnel ================= */
/* ---------- 三腿柱: over two metres, a black cylinder on three legs, no arms, one glowing dot at the middle of its body ---------- */
fxH_SH.mg_tripod=(g,x)=>{const {S}=x;const bm=mt('#141416',{metalness:.4,roughness:.35});
 for(let i=0;i<3;i++){const a=i/3*6.28;const l=new THREE.Mesh(kcy(S*.05,S*.08,S*2,8),bm);l.position.set(Math.cos(a)*S*.42,S*.95,Math.sin(a)*S*.42);l.rotation.set(Math.sin(a)*.28,0,-Math.cos(a)*.28);g.add(l)}
 const b=new THREE.Mesh(kcy(S*.38,S*.38,S*1.5,20),bm);b.position.y=S*2.6;g.add(b);const top=new THREE.Mesh(new THREE.SphereGeometry(S*.38,20,8,0,6.283,0,Math.PI/2),bm);top.position.y=S*3.35;g.add(top);
 const e=new THREE.Mesh(new THREE.SphereGeometry(S*.07,10,8),new THREE.MeshBasicMaterial({color:'#ff6a4a'}));e.position.set(S*.38,S*2.6,0);g.add(e);const eg=glowSprite('#ff5a4a',S*.7,.9);eg.position.copy(e.position);g.add(eg);
 return t=>{eg.material.opacity=.7+Math.sin(t*2)*.2}};

/* ---------- 构造堡垒: a black liquid hidden underground like a pool of mud; when needed it rises into a huge structure that turns out armies ---------- */
fxH_SH.mg_fortress=(g,x)=>{const {S,Rn,seed}=x;const blk=mt('#0a0a0c',{roughness:.08,metalness:.35});
 const pg=new THREE.CircleGeometry(S*1.4,40);{const p=pg.attributes.position;for(let i=1;i<p.count;i++){const a=Math.atan2(p.getY(i),p.getX(i)),r=Math.hypot(p.getX(i),p.getY(i));const k=1+Math.sin(a*5+1)*.08+Math.sin(a*11)*.05;p.setXY(i,Math.cos(a)*r*k,Math.sin(a)*r*k)}}pg.rotateX(-Math.PI/2);const pool=new THREE.Mesh(pg,blk);pool.position.y=S*.01;g.add(pool);
 // the mass rising out of it: a dark heap that grows spikes and a crude hall
 const mass=new THREE.Mesh(fxH_lumpGeo(S*.55,3,.25,seed,V3(1,1.6,1)),blk);mass.position.y=S*.55;g.add(mass);
 g.add(fxH_inst(kc(1,1,5),blk,40,(o,i)=>{const v=V3(Rn()-.5,Rn()*.9,Rn()-.5).normalize();o.position.copy(v).multiply(V3(S*.5,S*.85,S*.5)).add(V3(0,S*.55,0));o.quaternion.setFromUnitVectors(fxH_UP,v);const k=S*(.04+Rn()*.05);o.scale.set(k,k*(5+Rn()*6),k);o.translateY(k*2)}));
 for(let i=0;i<5;i++){const a=i/5*6.28+.3;const p=new THREE.Mesh(kcy(S*.06,S*.12,S*(.8+Rn()*.7),6),blk);p.position.set(Math.cos(a)*S*.7,S*.4,Math.sin(a)*S*.7);p.rotation.set(Math.sin(a)*.3,0,-Math.cos(a)*.3);g.add(p)}
 // the first of the army it is making, walking out over the mud
 const sol=[];const sm3=mt('#2a2626',{roughness:.6});for(let i=0;i<10;i++){const s=new THREE.Group();const b=sph(0,S*.05,S*.06,S*.04,8,sm3);b.position.y=S*.07;s.add(b);for(let k=0;k<4;k++){const l=cyl(S*.008,S*.006,S*.07,sm3,4);l.position.set((k%2-.5)*S*.06,S*.035,(k<2?-1:1)*S*.03);s.add(l)}g.add(s);sol.push({s,a:i/10*6.28,ph:Rn()})}
 const ex=emitter({n:50,life:3,speed:S*.08,spread:.3,size:S*.12,dir:[0,1,0],col:'#1a1a1e',op:.5,add:false,tex:smokeTex,area:[S*.8,S*.1,S*.8]});ex.position.y=S*.4;g.add(ex);
 return t=>{mass.scale.y=1+Math.sin(t*.5)*.04;for(const k of sol){const u=(k.ph+t*.05)%1,r=S*(.6+u*1.1);k.s.position.set(Math.cos(k.a)*r,0,Math.sin(k.a)*r);k.s.rotation.y=-k.a}}};

/* ---------- 无形: shapeless; the form Lin meets is thirty metres, roughly a person, all white, without a face ---------- */
fxH_SH.tn_wuxing=(g,x)=>{const {S}=x;const wm=mt('#f2f2ee',{roughness:.45,emissive:'#e8e8e0',emissiveIntensity:.15});const f=fxH_faceless(S*2.2,wm);g.add(f);g.add(at(glowSprite('#ffffff',S*2.4,.18),0,S*1.2,0));
 return t=>{const k=Math.sin(t*.9);f.scale.set(1+k*.06,1-k*.04,1+Math.cos(t*.7)*.06);f.rotation.y=Math.sin(t*.3)*.3;const ar=f.userData.arms;ar[0].rotation.z=Math.sin(t*1.1)*.3;ar[1].rotation.z=Math.cos(t*.8)*.3}};

/* ---------- 先驱: beings of strong cold light about a hundred metres across; a jar a metre high is only a fragment of one ---------- */
fxH_SH.tn_xianqu=(g,x)=>{const {S,Rn}=x;const o=new THREE.Mesh(new THREE.SphereGeometry(S*1.1,32,24),new THREE.MeshBasicMaterial({color:'#f4f2e8'}));o.position.y=S*2.6;g.add(o);
 const h1=glowSprite('#fffbe8',S*3.6,.55),h2=glowSprite('#e8f0ff',S*8,.16);h1.position.y=h2.position.y=S*2.6;g.add(h1,h2);
 const sw=swarmPts(80,S*2.2,'#f8f8ff',S*.08,x.seed);sw.position.y=S*2.6;g.add(sw);
 const pts=[];for(let i=0;i<=14;i++){const t=i/14;pts.push(new THREE.Vector2(S*.3*(.35+Math.sin(t*Math.PI)*.5+(t>.85?.15:0)),t*S*.6))}const jar=new THREE.Mesh(new THREE.LatheGeometry(pts,20),mt('#f4f0e8',{side:THREE.DoubleSide,roughness:.4,emissive:'#fff4d8',emissiveIntensity:.2}));jar.position.set(S*1.4,0,S*.6);g.add(jar);
 return t=>{h1.material.opacity=.5+Math.sin(t*1.3)*.08;sw.rotation.y=t*.1}};

/* ================= a few smaller ones in the frozen void and midgard ================= */
/* 巴士海葵: an upright barrel with a crown of tentacles */
fxH_SH.ng_haikui=(g,x)=>{const {S}=x;const fm=mt(x.c,{roughness:.5,emissive:x.c,emissiveIntensity:.15});const b=new THREE.Mesh(kcy(S*.5,S*.6,S*1.4,16),fm);b.position.y=S*.7;g.add(b);
 for(let i=0;i<16;i++){const a=i/16*6.28,pts=[];for(let j=0;j<=6;j++){const u=j/6;pts.push(V3(Math.cos(a)*S*(.45+u*.5),S*(1.4+u*.8)-u*u*S*.4,Math.sin(a)*S*(.45+u*.5)))}g.add(new THREE.Mesh(ktube(pts,S*.05*(1),10,5),fm))}return null};
/* 气球生物: hard balls with long tails */
fxH_SH.ng_qiqiu=(g,x)=>{const {Rn,kp}=x;const s=kp.s||50,n=kp.n||40;const bm=mt(x.c,{roughness:.5});const P=[];for(let i=0;i<n;i++)P.push(V3((Rn()-.5)*s*2,(Rn()-.5)*s,(Rn()-.5)*s*2));
 g.add(fxH_inst(new THREE.SphereGeometry(1,12,8),bm,n,(o,i)=>{o.position.copy(P[i]);o.scale.setScalar(s*(.05+Rn()*.05))}));
 g.add(fxH_inst(kc(1,1,5),mt('#d8c8b8',{roughness:.6}),n,(o,i)=>{const k=s*(.05+((i*7)%5)*.01);o.position.copy(P[i]).add(V3(0,-k*3.2,0));o.rotation.set(Math.PI+(Rn()-.5)*.4,0,(Rn()-.5)*.4);o.scale.set(k*.18,k*5,k*.18)}));return null};
/* 黑鹑的砖墙: a still wall of black bricks */
fxH_SH.ng_heichun=(g,x)=>{const {S}=x;const W=S*4,Hh=S*2.2,bw=S*.2,bh=S*.06;const n=Math.floor(W/bw)*Math.floor(Hh/bh);const cols=Math.floor(W/bw);
 g.add(fxH_inst(kb(bw*.95,bh*.9,S*.08),mt('#ffffff',{roughness:.8}),n,(o,i)=>{const r=(i/cols)|0,k=i%cols;o.position.set(-W/2+k*bw+(r%2)*bw/2,-Hh/2+r*bh,0)},['#141414','#1c1c1e','#0e0e10']));return null};
/* 有名的蛋: just hatched; the shell is broken open */
fxH_SH.mg_egg=(g,x)=>{const {S,c,Rn}=x;const sm4=mt(c,{roughness:.35,side:THREE.DoubleSide});const lo=new THREE.Mesh(new THREE.SphereGeometry(S,28,16,0,6.283,Math.PI*.55,Math.PI*.45),sm4);lo.scale.y=1.35;lo.position.y=S*1.35;g.add(lo);
 for(let i=0;i<7;i++){const a=i/7*6.28+Rn();const f=new THREE.Mesh(new THREE.SphereGeometry(S,6,4,0,.9,0,.8),sm4);f.scale.set(.5,.5,.5);f.position.set(Math.cos(a)*S*1.4,S*.05,Math.sin(a)*S*1.4);f.rotation.set(Rn()*2,Rn()*3,Rn());g.add(f)}
 const goo=new THREE.Mesh(new THREE.CircleGeometry(S*.7,20),mt('#e8d890',{roughness:.1}));goo.rotation.x=-Math.PI/2;goo.position.y=S*.8;g.add(goo);return null};
