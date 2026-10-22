/* ================================================================
   绒球's air: things that make you look up and wonder.
   aurora curtains over both poles at night, fireflies over the old forests after dark,
   drifting seeds in the sunlit meadows (snowflakes in the great cold), and a soft lens flare
   when you look toward a low sun.
   ================================================================ */
function rqSky(sp){const Rn=rnd(4949);const U={uT:GT,uSun:{value:sp.sunDir}};
 // ---------- aurora ----------
 const auroraM=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,uniforms:U,
  vertexShader:'varying vec2 vU;varying vec3 vW;void main(){vU=uv;vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',
  fragmentShader:`uniform float uT;uniform vec3 uSun;varying vec2 vU;varying vec3 vW;
   float h(float x){return fract(sin(x*127.1)*43758.5);}
   float n1(float x){float i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(h(i),h(i+1.),f);}
   void main(){float x=vU.x*360.;
    float c=n1(x*.9+uT*.25)*.6+n1(x*3.1-uT*.5)*.3+n1(x*9.-uT*1.1)*.18;      // folds of the curtain
    float rays=.6+.4*sin(x*14.+n1(x*.5+uT*.1)*9.);
    float y=vU.y;float a=smoothstep(0.,.12,y)*pow(1.-y,1.6)*c*rays;
    float night=smoothstep(.08,-.22,dot(normalize(vW),uSun));
    vec3 col=mix(vec3(.25,1.,.55),vec3(.55,.35,1.),smoothstep(.35,.95,y));col=mix(col,vec3(1.,.35,.65),smoothstep(.75,1.,y)*.4);
    gl_FragColor=vec4(col*a*night*.85,1.);}`});
 const curtain=(lat0,amp,seed,r0,r1)=>{const N=480,P=[],UV=[],I=[];for(let i=0;i<=N;i++){const lo=i/N*360-180;const la=lat0+amp*Math.sin(lo*D2R*3+seed)+amp*.5*Math.sin(lo*D2R*7+seed*2.3);const d=dirLL(la,lo);
   const a=d.clone().multiplyScalar(R+r0),b=d.clone().multiplyScalar(R+r1);P.push(a.x,a.y,a.z,b.x,b.y,b.z);UV.push(i/N,0,i/N,1);if(i<N){const k=i*2;I.push(k,k+1,k+2,k+1,k+3,k+2)}}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(UV,2));g.setIndex(I);g.computeBoundingSphere();
  const m=new THREE.Mesh(g,auroraM);m.renderOrder=4;m.frustumCulled=false;return m};
 const aur=new THREE.Group();[[69,2.4,.3,60,330],[73,1.8,2.1,90,380],[-71,2.2,4.4,60,320],[-75,1.6,5.9,90,360]].forEach(a=>aur.add(curtain(...a)));
 sp.scene.add(aur);
 // ---------- fireflies over the old forests ----------
 const FOREST=[[-4,-86,3.5],[33,11,2.5],[29,8,2],[6,-80,3],[-6,-78,2.5],[12,-84,2],[22,-10,2.5],[-2,40,2],[40,18,2]];
 const fp=[],fs=[];for(const [la,lo,r] of FOREST)for(let i=0;i<260;i++){const a=la+(Rn()-.5)*2*r,b=lo+(Rn()-.5)*2*r;const g=sp.gh(a,b);if(g<1.5)continue;const d=dirLL(a,b).multiplyScalar(R+g+2+Rn()*14);fp.push(d.x,d.y,d.z);fs.push(Rn()*6.283)}
 const fg=new THREE.BufferGeometry();fg.setAttribute('position',new THREE.Float32BufferAttribute(fp,3));fg.setAttribute('ph',new THREE.Float32BufferAttribute(fs,1));
 const ffM=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:Object.assign({uS:PSCALE},U),
  vertexShader:`uniform float uT;uniform float uS;uniform vec3 uSun;attribute float ph;varying float vA;
   void main(){vec3 p=position;vec3 n=normalize(p);vec3 e=normalize(cross(n,vec3(0.,1.,0.)));vec3 f=cross(n,e);
    p+=e*sin(uT*.4+ph*3.)*2.5+f*cos(uT*.33+ph*5.)*2.5+n*sin(uT*.7+ph)*1.5;
    vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;
    float blink=pow(.5+.5*sin(uT*(1.3+fract(ph)*1.7)+ph*9.),3.);
    vA=blink*smoothstep(.0,-.25,dot(n,uSun));gl_PointSize=clamp(uS*2.6/-mv.z,2.,12.);}`,
  fragmentShader:'varying float vA;void main(){vec2 c=gl_PointCoord-.5;float d=length(c);float a=smoothstep(.5,.0,d);gl_FragColor=vec4(vec3(1.,.9,.42)*a*vA*1.6,1.);}'});
 const ff=new THREE.Points(fg,ffM);ff.frustumCulled=false;ff.renderOrder=4;addE(ff,[2,3,5,6,7,8,9,10,11,12],true);
 // ---------- sea sparkle: plankton lighting up the shallows along every coast after dark ----------
 {const pp=[],ps=[],G=sp.G,cand=[];for(let k=0;k<G.n;k++){const h=G.H[k]-(G.CY?G.CY[k]*sp.TU.uCanyon.value:0);if(h<-.4&&h>-8&&Math.abs(G.P[k*3+1])<.88)cand.push(k)}
   for(let i=0;i<Math.min(9000,cand.length*2);i++){const k=cand[(Rn()*cand.length)|0];const d=V3(G.P[k*3]+(Rn()-.5)*.004,G.P[k*3+1]+(Rn()-.5)*.004,G.P[k*3+2]+(Rn()-.5)*.004).normalize();const ll=llDir(d);const h=sp.ghRaw(ll[0],ll[1]);if(h>-.3)continue;const p=d.multiplyScalar(R+.5);pp.push(p.x,p.y,p.z);ps.push(Rn()*6.283-h*.3)}
  const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.Float32BufferAttribute(pp,3));pg.setAttribute('ph',new THREE.Float32BufferAttribute(ps,1));
  const pM=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:Object.assign({uS:PSCALE},U),
   vertexShader:`uniform float uT;uniform float uS;uniform vec3 uSun;attribute float ph;varying float vA;
    void main(){vec3 n=normalize(position);vec4 mv=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mv;
     float wave=.5+.5*sin(uT*.9-ph*2.2);float tw=.55+.45*sin(uT*2.3+ph*13.);
     vA=wave*wave*tw*smoothstep(.02,-.22,dot(n,uSun))*smoothstep(1500.,300.,-mv.z);gl_PointSize=clamp(uS*3.2/-mv.z,1.5,9.);}`,
   fragmentShader:'varying float vA;void main(){vec2 c=gl_PointCoord-.5;float a=smoothstep(.5,.0,length(c));gl_FragColor=vec4(vec3(.3,.95,1.)*a*vA*1.3,1.);}'});
  const pl=new THREE.Points(pg,pM);pl.frustumCulled=false;pl.renderOrder=3;addE(pl,[1,2,3,5],true);sp._plank=pp.length/3}
 // ---------- seeds in the sun, snow in the cold: a small drift that rides along under the camera ----------
 const DN=420,dp=[],dd=[];for(let i=0;i<DN;i++){dp.push((Rn()-.5)*360,Rn()*90,(Rn()-.5)*360);dd.push(Rn()*6.283)}
 const dg=new THREE.BufferGeometry();dg.setAttribute('position',new THREE.Float32BufferAttribute(dp,3));dg.setAttribute('ph',new THREE.Float32BufferAttribute(dd,1));
 const dU={uT:GT,uS:PSCALE,uSnow:{value:0},uK:{value:0}};
 const dM=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:dU,
  vertexShader:`uniform float uT;uniform float uS;uniform float uSnow;attribute float ph;varying float vA;
   void main(){vec3 p=position;float fall=mix(3.,14.,uSnow);
    p.y=mod(p.y-uT*fall*(.6+fract(ph)*.6),90.);
    p.x+=sin(uT*.35+ph*4.)*mix(14.,5.,uSnow)+uT*mix(6.,2.,uSnow);p.z+=cos(uT*.27+ph*3.)*mix(12.,5.,uSnow);
    p.x=mod(p.x+180.,360.)-180.;p.z=mod(p.z+180.,360.)-180.;
    vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;
    vA=smoothstep(0.,10.,p.y)*smoothstep(90.,60.,p.y)*(1.-smoothstep(120.,180.,length(p.xz)));
    gl_PointSize=clamp(uS*mix(1.3,2.2,uSnow)/-mv.z,1.5,9.);}`,
  fragmentShader:`uniform float uSnow;uniform float uK;varying float vA;void main(){vec2 c=gl_PointCoord-.5;float d=length(c);float a=smoothstep(.5,.1,d);
   vec3 col=mix(vec3(1.,.95,.78),vec3(1.),uSnow);gl_FragColor=vec4(col,a*vA*uK*mix(.55,.85,uSnow));}`});
 const drift=new THREE.Points(dg,dM);drift.frustumCulled=false;drift.renderOrder=5;sp.scene.add(drift);
 // ---------- lens flare toward a low sun ----------
 const ringTex=canvasTex(128,128,(x)=>{const g=x.createRadialGradient(64,64,30,64,64,62);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.7,'rgba(255,255,255,.35)');g.addColorStop(.85,'rgba(255,255,255,.12)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,128,128)});
 const FL=[[.0,.9,'#fff2d0',glowTex],[.35,.10,'#ffd38a',glowTex],[.62,.16,'#9ad0ff',ringTex],[.9,.07,'#ffb070',glowTex],[1.25,.22,'#b8a0ff',ringTex],[1.6,.05,'#ffe7a8',glowTex]];
 const flares=FL.map(([k,s,c,tx])=>{const m=new THREE.Sprite(new THREE.SpriteMaterial({map:tx,color:c,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthTest:false,depthWrite:false,fog:false}));m.renderOrder=9;m.userData.noBatch=1;m.userData.k=k;m.userData.s=s;sp.scene.add(m);return m});

 // ---------- towns glow warm after dark: a soft pool of lamplight over each one ----------
 const townGlows=TOWN_SITES.map(([la,lo,o])=>{const d=dirLL(la,lo);const g=sp.gh(la,lo);const rad=o.r*D2R*R;
  const grp=new THREE.Group();grp.position.copy(d).multiplyScalar(R+Math.max(g,0)+3);
  const col=o.lamp&&o.lamp!=='#cfe6ff'?o.lamp:o.style==='silver'?'#ffe2b0':'#ffb85a';
  const a=glowSprite(col,rad*3.2,0),b=glowSprite('#fff0d0',rad*1.3,0);a.userData.noBatch=b.userData.noBatch=1;a.material.fog=b.material.fog=false;grp.add(a);grp.add(b);
  addTo(sp,grp,o.eras||[1,2,3,4,5,6,7,8,9,10,11,12],!!o.noCarry);return {grp,a,b,d}});
 // ---------- rainbows in the spray of waterfalls, when the sun is behind you ----------
 const bowTex=canvasTex(256,128,(x,w,h)=>{const cols=['rgba(255,60,60,','rgba(255,160,40,','rgba(255,240,80,','rgba(80,230,110,','rgba(70,140,255,','rgba(150,90,255,'];
  for(let i=0;i<cols.length;i++){x.beginPath();x.lineWidth=5;x.strokeStyle=cols[i]+(.55-Math.abs(i-2.5)*.05)+')';x.arc(w/2,h,h*.86-i*5,Math.PI,0);x.stroke()}
  const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(.75,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,1)');x.globalCompositeOperation='destination-out';x.fillStyle=g;x.fillRect(0,0,w,h)});
 const bows=(sp._dbgF||[]).filter((p,i)=>i%2===0).slice(0,24).map(p=>{const m=new THREE.Sprite(new THREE.SpriteMaterial({map:bowTex,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending}));
  const up=p.clone().normalize();m.position.copy(p).addScaledVector(up,16);m.scale.set(84,42,1);m.userData.noBatch=1;m.renderOrder=4;sp.scene.add(m);return {m,up}});

 // ---------- mist that pools in the lowlands around dawn and dusk ----------
 const MIST=[];for(let i=0;i<8000&&MIST.length<340;i++){const a=(Rn()-.5)*150,b=Rn()*360-180;const g=sp.gh(a,b);if(g<.3||g>12)continue;
  const d=dirLL(a,b);const m=new THREE.Sprite(new THREE.SpriteMaterial({map:smokeTex,color:'#f2ece4',transparent:true,opacity:0,depthWrite:false}));
  m.position.copy(d).multiplyScalar(R+g+2.5);const s=26+Rn()*30;m.scale.set(s*1.8,s*.55,1);m.userData.d=d;MIST.push(m);sp.scene.add(m)}

 // ---------- light falling between the layers of the cloud sea ----------
 {const shM=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,uniforms:{uT:GT,uK:{value:0}},
   // a column of light, not a lit tube: walls seen edge-on fade out, and so does the whole shaft once the camera is close or inside it
   vertexShader:'varying vec2 vU;varying float vF,vD;void main(){vU=uv;vec4 mv=modelViewMatrix*vec4(position,1.);vF=abs(dot(normalize(normalMatrix*normal),normalize(-mv.xyz)));vD=-mv.z;gl_Position=projectionMatrix*mv;}',
   fragmentShader:'uniform float uT;uniform float uK;varying vec2 vU;varying float vF,vD;void main(){float a=smoothstep(0.,.35,vU.y)*smoothstep(1.,.75,vU.y)*(.6+.4*sin(vU.x*6.283*3.+uT*.4));a*=pow(vF,1.5)*smoothstep(25.,110.,vD);gl_FragColor=vec4(vec3(1.,.92,.75)*a*uK*.2,1.);}'});
  const sh=new THREE.Group();for(let i=0;i<22;i++){const la=-10+(Rn()-.5)*16,lo=70+(Rn()-.5)*18;const d=dirLL(la,lo);const h=34+Rn()*10;
   const m=new THREE.Mesh(new THREE.CylinderGeometry(5+Rn()*5,9+Rn()*8,h,16,1,true),shM);m.position.copy(d).multiplyScalar(R+110+h/2+2);m.quaternion.setFromUnitVectors(UP_Y,d);sh.add(m)}
  addE(sh,[5],true);const cc=dirLL(-10,70);anim(sp,sh,()=>{shM.uniforms.uK.value=sm(-.05,.35,cc.dot(sp.sunDir))*(1-sm(900,1800,camera.position.length()-R))})}
 // ---------- leaping fish: in the warm ages, now and then a fish jumps from the sea near you and drops back with a splash ----------
 {const fb=new THREE.SphereGeometry(1,12,8);fb.scale(1.5,.42,.32);const ft=new THREE.ConeGeometry(.5,.9,4);ft.rotateZ(Math.PI/2);ft.scale(1,1,.2);ft.translate(-1.75,0,0);const fd=new THREE.ConeGeometry(.22,.5,3);fd.translate(.1,.5,0);const fg=THREE.BufferGeometryUtils.mergeBufferGeometries([fb.toNonIndexed(),ft.toNonIndexed(),fd.toNonIndexed()]);const fm=new THREE.MeshStandardMaterial({color:'#b8d4de',roughness:.25,metalness:.55,emissive:'#20323a',emissiveIntensity:.3});
  const FN=5,fish=[];for(let i=0;i<FN;i++){const m=new THREE.Mesh(fg,fm);m.visible=false;m.userData.noCut=1;sp.scene.add(m);const sm1=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:'#e8f6ff',transparent:true,opacity:0,depthWrite:false}));sm1.visible=false;sp.scene.add(sm1);
   const sm2=sm1.clone();sm2.material=sm1.material.clone();sp.scene.add(sm2);fish.push({m,a:sm1,b:sm2,t:-1-Rn()*4,p0:V3(),up:V3(),dir:V3(),len:6,h:5,sz:1})}
  const tmp=V3();anim(sp,null,(t,dt)=>{dt=dt||.016;const alt=camera.position.length()-R;const on=ERA>=1&&ERA<=3&&alt<520&&sp.dayK!==0;
   for(const f of fish){f.t+=dt;if(f.t<0){f.m.visible=false;continue}
    if(!f.live){if(!on){f.t=-1-Rn()*2;continue}// pick a spot of sea near the camera
     const cu=camera.position.clone().normalize(),fw=V3(0,0,-1).applyQuaternion(camera.quaternion);fw.addScaledVector(cu,-fw.dot(cu)).normalize();const sd=V3().crossVectors(fw,cu);let ok=false;for(let k=0;k<8&&!ok;k++){const d=Math.max(30,alt*(2.5+Rn()*5)),x=(Rn()-.5)*d*.9;const q=cu.clone().multiplyScalar(R).addScaledVector(fw,d).addScaledVector(sd,x);const ll=llDir(q);if(sp.ghRaw(ll[0],ll[1])<-3){f.up.copy(dirLL(ll[0],ll[1]));f.p0.copy(f.up).multiplyScalar(R);ok=true}}
     if(!ok||f.up.dot(sp.sunDir)<-.05){f.t=-2-Rn()*3;continue}f.live=1;f.t=0;f.dir.crossVectors(f.up,V3(0,1,0)).normalize().applyAxisAngle(f.up,Rn()*6.28);f.sz=.5+Rn()*.9;f.len=4+Rn()*5;f.h=2+Rn()*3;f.m.scale.setScalar(f.sz)}
    const T=1.1,u=f.t/T;if(u>1.6){f.t=-3-Rn()*6;f.live=0;f.m.visible=false;f.a.visible=f.b.visible=false;continue}
    if(u<=1){f.m.visible=true;tmp.copy(f.p0).addScaledVector(f.dir,(u-.5)*f.len).addScaledVector(f.up,4*f.h*u*(1-u)-.3);f.m.position.copy(tmp);
     const vy=4*f.h*(1-2*u)/f.len;const fw=f.dir.clone().addScaledVector(f.up,vy).normalize();f.m.quaternion.setFromUnitVectors(V3(1,0,0),fw)}else f.m.visible=false;
    // splashes where it leaves and where it comes back
    for(const [sp2,at,t0] of [[f.a,-.5,0],[f.b,.5,1]]){const k=(u-t0)/.5;if(k<0||k>1){sp2.visible=false;continue}sp2.visible=true;sp2.position.copy(f.p0).addScaledVector(f.dir,at*f.len).addScaledVector(f.up,.2);const s3=(1+k*2.5)*f.sz*1.6;sp2.scale.set(s3,s3*.5,1);sp2.material.opacity=.75*(1-k)}}})}
 // ---------- snow glitter: in the great cold, tiny crystals catch the sun around you and wink as you move ----------
 const GN=2600,gP=new Float32Array(GN*3),gH=new Float32Array(GN);for(let i=0;i<GN;i++)gH[i]=Rn()*100;
 const gG=new THREE.BufferGeometry();gG.setAttribute('position',new THREE.BufferAttribute(gP,3));gG.setAttribute('ph',new THREE.BufferAttribute(gH,1));
 const gM=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:Object.assign({uS:PSCALE,uK:{value:0}},U),
  vertexShader:`uniform float uS,uK,uT;uniform vec3 uSun;attribute float ph;varying float vA;varying vec3 vC;
   void main(){vec3 n=normalize(position);vec3 p=position+vec3(sin(uT*.3+ph),cos(uT*.23+ph*1.7),sin(uT*.27+ph*2.3))*1.5;vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;vec3 v=normalize(cameraPosition-p);
    vC=.75+.25*cos(6.283*(fract(ph*.37)+vec3(0.,.33,.67)));
    float g=fract(sin(ph*91.7+dot(floor(v*38.),vec3(12.9,78.2,37.7)))*43758.5);float day=smoothstep(.0,.25,dot(n,uSun));
    vA=uK*day*smoothstep(.8,.97,g)*smoothstep(260.,30.,-mv.z);gl_PointSize=clamp(uS*3.4/-mv.z,2.,10.);}`,
  fragmentShader:'varying float vA;varying vec3 vC;void main(){vec2 c=gl_PointCoord-.5;float a=smoothstep(.5,.0,length(c));a=max(a*a,smoothstep(.06,.0,min(abs(c.x),abs(c.y)))*smoothstep(.5,.1,length(c)));gl_FragColor=vec4(vC*a*vA*2.,1.);}'});
 const SB=(()=>{const c=sp.sets&&sp.sets.s;if(!c)return null;const b=new Float32Array(sp.G.n);for(let k=0;k<sp.G.n;k++)b[k]=(c[k*3]+c[k*3+1]+c[k*3+2])/3;return b})();
 const glit=new THREE.Points(gG,gM);glit.frustumCulled=false;glit.renderOrder=4;glit.visible=false;sp.scene.add(glit);const gC=V3(1e9,0,0);
 anim(sp,null,()=>{const alt=camera.position.length()-R;const want=ERA===4&&alt<420;gM.uniforms.uK.value+=((want?1:0)*(1-sm(260,420,alt))-gM.uniforms.uK.value)*.06;glit.visible=gM.uniforms.uK.value>.01;if(!glit.visible)return;
  const ll=llDir(camera.position),gp=dirLL(ll[0],ll[1]).multiplyScalar(R);if(gp.distanceTo(gC)<90)return;gC.copy(gp);
  for(let i=0;i<GN;i++){const a=Rn()*6.283,r=Math.sqrt(Rn())*230/R/D2R;const la=ll[0]+Math.cos(a)*r,lo=ll[1]+Math.sin(a)*r/Math.max(.2,Math.cos(ll[0]*D2R));const h=sp.gh(la,lo);const d=dirLL(la,lo);const air=i%3!==0;if(!air&&(h<.5||(SB&&gridSample(sp.G,SB,d)<.72))){gP[i*3]=gP[i*3+1]=gP[i*3+2]=0;continue}d.multiplyScalar(R+Math.max(h,0)+(air?3+Rn()*Rn()*70:.35));gP[i*3]=d.x;gP[i*3+1]=d.y;gP[i*3+2]=d.z}
  gG.attributes.position.needsUpdate=true});
 const sw=V3(),nd=V3(),tmp=V3(),cd=V3();
 anim(sp,null,(t)=>{U.uSun.value=sp.sunDir;
  for(const T of townGlows){if(!T.grp.visible)continue;const nk=sm(.05,-.18,T.d.dot(sp.sunDir));const fl=.9+.1*Math.sin(t*1.3+T.d.x*40);T.a.material.opacity=.45*nk*fl;T.b.material.opacity=.6*nk*fl}
  {const cp=camera.position;for(const B of bows){const dc=B.m.position.distanceTo(cp);if(dc>900){B.m.visible=false;continue}
    // a bow shows when the sun is behind the viewer and up in the sky over that fall
    const tv=tmp.copy(B.m.position).sub(cp).normalize();const behind=-tv.dot(sp.sunDir);const sunUp=B.up.dot(sp.sunDir);
    const k=sm(.2,.6,behind)*sm(.05,.3,sunUp)*(1-sm(500,900,dc));B.m.material.opacity=.7*k;B.m.visible=k>.01}}
  const cl=camera.position.length(),alt=cl-R;cd.copy(camera.position).normalize();
  // aurora only matters near the poles from not too far away; it fades in from space too
  aur.visible=Math.abs(cd.y)>.55||alt>1800;
  {const low=1-sm(500,1500,alt);for(const m of MIST){if(low<=0){m.visible=false;continue}const sd=m.userData.d.dot(sp.sunDir);const k=Math.max(0,1-Math.abs(sd+.02)/.2)*low;
    const dc=m.position.distanceTo(camera.position);const f=k*(1-sm(900,1500,dc))*sm(15,60,dc);m.material.opacity=.4*f;m.visible=f>.01;if(m.visible)m.material.color.setRGB(1,.9+.1*Math.max(0,sd*5),.82+.18*Math.max(0,sd*5))}}
  // drift: under the camera, in daylight over land (snow in the great cold, at any hour)
  const snow=ERA===4;const ll=llDir(camera.position);const g=sp.gh(ll[0],ll[1]);
  const want=alt<420&&(snow||(g>.5&&ERA!==1&&sp.dayK>.25));dU.uK.value+=((want?1:0)*(1-sm(260,420,alt))-dU.uK.value)*.05;dU.uSnow.value=snow?1:0;
  drift.visible=dU.uK.value>.01;if(drift.visible){drift.position.copy(cd).multiplyScalar(R+Math.max(g,0));drift.quaternion.setFromUnitVectors(UP_Y,cd)}
  // flare: the sun on screen, low, seen from near the ground
  sw.copy(sp.sunDir).multiplyScalar(Math.min(50,camera.far*.4)).add(camera.position);tmp.copy(sw).project(camera);const on=tmp.z<1&&Math.abs(tmp.x)<1.6&&Math.abs(tmp.y)<1.6;
  const low=1-sm(.6,.97,cd.dot(sp.sunDir));const k0=on?(.55+.45*low):0;
  // is the sun hidden behind the planet itself?
  let occ=1;if(on){const dir=sp.sunDir;const b=camera.position.dot(dir),c2=cl*cl-R*R;if(b<0&&b*b>c2)occ=0}
  const edge=1-sm(1.,1.6,Math.max(Math.abs(tmp.x),Math.abs(tmp.y)));
  for(const f of flares){const k=f.userData.k;nd.set(tmp.x*(1-k*2),tmp.y*(1-k*2),.2).unproject(camera);f.position.copy(nd);const dist=nd.distanceTo(camera.position);
   f.scale.setScalar(dist*f.userData.s);f.material.opacity=k0*occ*edge*(k===0?.35:.22);f.visible=f.material.opacity>.005}});
}
/* the moon up close: the island that coughs ash, fire whirls, ash-gathering mushrooms, pale paste pools, and a skin of poisonous dust */
function moonDeco(sp,moon){const Rn=rnd(7171);const g=new THREE.Group();moon.add(g);const Y=V3(0,1,0);
 const on=(la,lo,h,o)=>{const d=dirLL(la,lo);o.position.copy(d).multiplyScalar(1+(h||0));o.quaternion.setFromUnitVectors(Y,d);g.add(o);return o};
 // 灰烬之岛: a dark cone island with glowing vents
 {const isl=new THREE.Group();const cone=new THREE.Mesh(new THREE.ConeGeometry(.11,.05,24,3),new THREE.MeshStandardMaterial({color:'#5a5458',emissive:'#3a1a0a',emissiveIntensity:.35,roughness:.95,flatShading:true}));cone.position.y=.018;isl.add(cone);
  for(let i=0;i<5;i++){const v=glowSprite('#ff8a3a',.05+Rn()*.03,.9);v.position.set((Rn()-.5)*.08,.045,(Rn()-.5)*.08);isl.add(v)}
  const plume=emitter({n:40,life:3,speed:.02,spread:.4,size:6,col:'#8a8a90',op:.5,area:[.02,.005,.02],grav:-.004,wander:.01});plume.position.y=.045;isl.add(plume);on(18,40,0,isl)}
 // 火龙卷: twisting fire whirls
 const fwM=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,uniforms:{uT:GT},
  vertexShader:'varying vec2 vU;void main(){vU=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:'uniform float uT;varying vec2 vU;void main(){float s=sin(vU.x*25.+vU.y*14.-uT*6.)*.5+.5;float a=smoothstep(0.,.15,vU.y)*smoothstep(1.,.6,vU.y)*(.35+.65*s);gl_FragColor=vec4(mix(vec3(1.,.35,.08),vec3(1.,.85,.4),vU.y)*a*.9,1.);}'});
 const whirls=[[5,70],[28,58],[-6,48]].map(([la,lo])=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(.03,.006,.16,16,6,true),fwM);m.position.y=.08;const w=new THREE.Group();w.add(m);on(la,lo,0,w);return m});
 // 集灰菇: little grey-capped mushrooms in rings
 {const cap=new THREE.SphereGeometry(1,10,6,0,Math.PI*2,0,Math.PI/2),stem=new THREE.CylinderGeometry(.25,.35,1,6);const cm=new THREE.MeshStandardMaterial({color:'#cfd2d8',roughness:.8}),sm2=new THREE.MeshStandardMaterial({color:'#8a8478',roughness:.9});
  for(let k=0;k<3;k++){const la0=10+k*9,lo0=24+k*7;for(let i=0;i<14;i++){const a=i/14*6.283;const m=new THREE.Group();const c=new THREE.Mesh(cap,cm);c.scale.set(.004,.003,.004);c.position.y=.004;const s=new THREE.Mesh(stem,sm2);s.scale.set(.003,.004,.003);s.position.y=.002;m.add(c);m.add(s);on(la0+Math.cos(a)*(1+Rn()*1.2),lo0+Math.sin(a)*(1+Rn()*1.2),0,m)}}}
 // 白膏 pools in the craters
 for(const [la,lo,r] of [[-10,-20,.05],[-16,-12,.03],[-4,-28,.025]]){const p=new THREE.Mesh(new THREE.CircleGeometry(r,24),new THREE.MeshStandardMaterial({color:'#f2f0ea',emissive:'#d8e8f0',emissiveIntensity:.3,roughness:.4}));p.rotation.x=-Math.PI/2;const w=new THREE.Group();w.add(p);p.position.y=.002;on(la,lo,0,w)}
 // the poisonous dust: a thin hazy shell
 {const sh=new THREE.Mesh(new THREE.SphereGeometry(1.035,48,32),new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{uT:GT},
   vertexShader:'varying vec3 vN;varying vec3 vV;void main(){vN=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(position,1.);vV=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}',
   fragmentShader:'varying vec3 vN;varying vec3 vV;void main(){float f=pow(1.-abs(dot(vN,vV)),2.5);gl_FragColor=vec4(vec3(.75,.85,.55),f*.45);}'}));g.add(sh)}
 // everything small is only worth drawing when the moon is close or seen up close
 anim(sp,null,t=>{const near=camera.position.distanceTo(moon.position)<moon.scale.x*6;g.visible=near;if(!near)return;whirls.forEach((m,i)=>{m.rotation.y=t*(1.5+i*.3);m.scale.x=m.scale.z=1+.15*Math.sin(t*2+i)})});
}
