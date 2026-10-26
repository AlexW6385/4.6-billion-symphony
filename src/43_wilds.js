/* ================================================================
   wilds: the home tree (a dying hollow giant) and the twisted jungle's upper world
   (platforms, rope bridges, hanging vines, glowing moss, a tangled heart).
   ================================================================ */
/* keep each part's own vertex colours and merge */
function mergeKeep(gs){return THREE.BufferGeometryUtils.mergeBufferGeometries(gs.map(g=>{g=g.index?g.toNonIndexed():g;if(g.attributes.uv)g.deleteAttribute('uv');if(!g.attributes.normal)g.computeVertexNormals();
 if(!g.attributes.color){const n=g.attributes.position.count,c=new Float32Array(n*3).fill(1);g.setAttribute('color',new THREE.BufferAttribute(c,3))}return g}))}
/* a bark trunk: radius profile, deep ridges that twist as they climb, darker grooves, moss on the low north side */
function trunkGeo(o){const seg=o.seg||32,rings=o.rings||28,pos=[],col=[],idx=[];const c0=C(o.col||'#6a5440'),c1=C(o.col2||'#2e2218'),cm=C(o.moss||'#56763a');const cc=new THREE.Color();
 const rr=t=>{const L=o.r;for(let i=1;i<L.length;i++)if(t<=L[i][0]){const u=(t-L[i-1][0])/(L[i][0]-L[i-1][0]);return lerp(L[i-1][1],L[i][1],sm(0,1,u))}return L[L.length-1][1]};
 for(let i=0;i<=rings;i++){const t=i/rings,y=t*o.h,tw=t*(o.twist||0);const bx=Math.sin(t*2.1+(o.ph||0))*(o.lean||0)*t,bz=Math.cos(t*1.7)*(o.lean||0)*.6*t;
  for(let j=0;j<=seg;j++){const a=j/seg*Math.PI*2;const rid=Math.pow(Math.abs(Math.sin((a+tw)*(o.ridges||7)*.5)),.6);const nn=n3(Math.cos(a)*2+i*.3,y*.15,Math.sin(a)*2);
   const r=rr(t)*(1-(o.amp||.12)*(1-rid)+.07*(nn-.5));pos.push(bx+Math.cos(a)*r,y,bz+Math.sin(a)*r);
   cc.copy(c1).lerp(c0,rid*(.75+.25*nn));if(t<(o.mossT||.3)&&Math.sin(a)>.1)cc.lerp(cm,(1-t/(o.mossT||.3))*.75*Math.sin(a));col.push(cc.r,cc.g,cc.b)}}
 for(let i=0;i<rings;i++)for(let j=0;j<seg;j++){const a=i*(seg+1)+j,b=a+1,c=a+seg+1,d=c+1;idx.push(a,c,b,b,c,d)}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.setIndex(idx);g.computeVertexNormals();return g}

function rqHomeTree(sp){fxG_homeTree(sp)}// rebuilt in 49i_fixG: a branchless column with a pit and lake in its cap

/* ---------- the twisted jungle's upper world ---------- */
function jungleOK(la,lo,h){return h>2&&h<120&&Math.abs(lo-6)>1.2&&!(Math.abs(la-32)<2.1&&Math.abs(lo-8.3)<2.6)&&angDeg(dirLL(la,lo),fxG_K().PK)>5}
function rqJungle(sp){const Rn=rnd(3303);const gh=sp.ghRaw;
 // same trees as the jungle block (same seed and test), so platforms and bridges land on them
 const L=scatter(820,33,11,8.5,3,jungleOK);
 const o=new THREE.Object3D(),top=[];L.forEach(p=>{o.position.set(0,0,0);o.quaternion.identity();frameLL(sp,p[0],p[1],-.6,p[3]*9,o);const k=(p[3]*7.13)%1;const s=.38+p[3]*.75,sy=s*(.8+k*.45);
  const up=o.position.clone().normalize();top.push({p,s,base:o.position.clone(),up,h:10.3*sy,c:o.position.clone().addScaledVector(up,10.3*sy),mid:o.position.clone().addScaledVector(up,5.8*sy)})});
 // chunks so the far parts can be culled
 const CH=new Map();const ck=v=>{const ll=llDir(v);return Math.floor(ll[0]/2.5)+','+Math.floor(ll[1]/2.5)};const bucket=v=>{const k=ck(v);if(!CH.has(k))CH.set(k,{planks:[],ropes:[],vines:[],moss:[]});return CH.get(k)};
 // rope bridges between near platforms: sagging planks, two hand-ropes
 const plank=new THREE.BoxGeometry(.9,.08,.28);const Q=new THREE.Quaternion(),Mx=new THREE.Matrix4(),Sx=V3(1,1,1);let nb=0;
 for(let i=0;i<top.length;i++){const A=top[i];if(A.s<.62)continue;let best=null,bd=1e9;
  for(let j=0;j<top.length;j++){if(j===i)continue;const B=top[j];if(B.s<.62)continue;const d=A.c.distanceTo(B.c);if(d<bd&&d>2.5){bd=d;best=B}}
  if(!best||bd>11||(A.c.x>best.c.x&&bd<11&&Rn()<.4))continue;const B=best;const bk=bucket(A.c);const n=Math.max(4,Math.round(bd/.34));const dir=B.c.clone().sub(A.c).normalize();
  for(let t=0;t<=n;t++){const u=t/n;const p=A.c.clone().lerp(B.c,u).addScaledVector(A.up,-Math.sin(u*Math.PI)*bd*.08);const side=dir.clone().cross(A.up).normalize();
   Mx.makeBasis(side,A.up,dir).setPosition(p);const q=plank.clone().applyMatrix4(Mx);bk.planks.push(q);
   if(t<n){const u2=(t+1)/n;const p2=A.c.clone().lerp(B.c,u2).addScaledVector(A.up,-Math.sin(u2*Math.PI)*bd*.08);for(const s of[-1,1]){bk.ropes.push(p.clone().addScaledVector(side,s*.45).addScaledVector(A.up,.85),p2.clone().addScaledVector(side,s*.45).addScaledVector(A.up,.85))}}}
  nb++}
 // vines hanging from the platforms and from the second floor
 for(const T of top){const bk=bucket(T.c);const nv=T.s>.7?7:3;for(let k=0;k<nv;k++){const a=Rn()*6.28,r=T.s*(1.4+Rn()*1.1);const side=V3(Math.cos(a),0,Math.sin(a));side.addScaledVector(T.up,-side.dot(T.up)).normalize();
   const st=(k<nv-2?T.c:T.mid).clone().addScaledVector(side,r);const L2=T.h*(.25+Rn()*.35);let p=st;for(let s=0;s<3;s++){const q=p.clone().addScaledVector(T.up,-L2/3).addScaledVector(side,(Rn()-.5)*.3);bk.vines.push(p,q);p=q}}
  // glowing moss on the forest floor round the roots
  for(let k=0;k<4;k++){const a=Rn()*6.28,r=.6+Rn()*2.5;const side=V3(Math.cos(a),0,Math.sin(a));side.addScaledVector(T.up,-side.dot(T.up)).normalize();bk.moss.push(T.base.clone().addScaledVector(side,r).addScaledVector(T.up,.9))}}
 const pm=detailMat(VC({roughness:.9}),{bump:.4,freq:3}),rm=new THREE.LineBasicMaterial({color:'#8a7a5a'}),vm=new THREE.LineBasicMaterial({color:'#3f6a34'});const eras=[2,3,5,6,7,8,9,10,11,12];
 for(const [k,b] of CH){const all=b.planks.length?b.planks:null;if(all){const g=mergeColored(all.map(q=>[q,'#8a6a44']));const m=new THREE.Mesh(g,pm);g.computeBoundingSphere();addE(m,eras.concat([4]));cull(m,g.boundingSphere.center,g.boundingSphere.radius,700)}
  for(const [arr,mat] of[[b.ropes,rm],[b.vines,vm]]){if(!arr.length)continue;const g=new THREE.BufferGeometry().setFromPoints(arr);const m=new THREE.LineSegments(g,mat);g.computeBoundingSphere();addE(m,mat===vm?eras:eras.concat([4]));cull(m,g.boundingSphere.center,g.boundingSphere.radius,520)}
  if(b.moss.length){const s=sparkles(b.moss,'#9fffc8',1.6,.9,.6);addE(s,eras);cull(s,s.geometry.boundingSphere.center,s.geometry.boundingSphere.radius,600)}}
 // the tangled heart: deeper in, trees coil in threes, stand straight, or grow into nets
 const coil3=G([...[0,1,2].map(k=>[ktube(spiralPts(k*2.09,13,1.3,.5,1.9),.33,30),k?'#4c3b2b':'#5b4733']),[kcy(3.2,2.8,.45,12),'#4a3a28',{p:[0,13.1,0]}],
   [ki(1,1),'#2c7050',{p:[0,14.2,0],s:[3.8,1.25,3.8]}],[ki(1,1),'#3c8a58',{p:[2,13.6,1],s:[2.2,1,2.2]}],[ki(1,1),'#24603e',{p:[-2,13.8,-1.2],s:[2.1,1,2.1]}]]);
 const netT=G([...[0,1,2,3].map(k=>{const a=k*1.57;return[ktube([V3(Math.cos(a)*1.8,0,Math.sin(a)*1.8),V3(Math.cos(a+.8)*1.2,4,Math.sin(a+.8)*1.2),V3(Math.cos(a+1.6)*1.8,8,Math.sin(a+1.6)*1.8),V3(Math.cos(a+2.4)*.6,12,Math.sin(a+2.4)*.6)],.24,26),'#5b4733']}),
   ...[3,6,9].map(y=>[tg(new THREE.TorusGeometry(1.6,.12,5,14),{r:[Math.PI/2,0,0]}),'#4c3b2b',{p:[0,y,0]}]),[ki(1,1),'#2f7550',{p:[0,12.6,0],s:[3,1.1,3]}]]);
 const upr=G([[kcy(.35,.6,14,7),'#5b4733',{p:[0,7,0]}],[ki(1,1),'#2a6646',{p:[0,14,0],s:[2.6,1.4,2.6]}],[ki(1,1),'#3a7a4a',{p:[0,11,0],s:[2,.8,2]}]]);
 const inner=scatter(340,33.4,10.6,3.6,77,(la,lo,h)=>jungleOK(la,lo,h)&&!nearEnt('rongqiu',la,lo,.15));const kinds=[[],[],[]];inner.forEach(p=>kinds[(p[3]*13.7|0)%3].push(p));
 const sm2=swayMat({roughness:.85},.0016);[coil3,netT,upr].forEach((geo,i)=>inst(geo,sm2,kinds[i],(ob,p)=>{frameLL(sp,p[0],p[1],-.6,p[3]*9,ob);ob.scale.setScalar(.45+p[3]*.6)},eras,{tint:p=>C('#ffffff').offsetHSL((p[3]-.5)*.05,0,(p[3]-.5)*.14),far:1300}));
 sp.jungleBridges=nb}

/* ---------- the spire forest: slim stone pillars, about three metres thick and from ten to over a hundred metres tall,
   standing close in neat rows; many fork into side pillars; green moss covers them from foot to tip ---------- */
function spireGeo(seed,hollow){const Rn=rnd(seed);const seg=8,rings=14,moss=C('#5a8646'),moss2=C('#6f9a50'),dark=C('#3f6236'),rock=C('#8a8274'),cc=new THREE.Color();const ph=Rn()*9;
 const shaft=(x0,z0,y0,len,r0,r1,dx,dz,cap)=>{const pos=[],col=[],idx=[];for(let i=0;i<=rings;i++){const t=i/rings;const y=y0+t*len,cx=x0+dx*t*len+Math.sin(t*2+ph)*.25*t,cz=z0+dz*t*len;const r=lerp(r0,r1,t)*(cap&&i===rings?.35:1);
   for(let j=0;j<=seg;j++){const a=j/seg*Math.PI*2;const nn=n3(Math.cos(a)*1.4+ph+x0,y*.35,Math.sin(a)*1.4);pos.push(cx+Math.cos(a)*r*(.9+.2*nn),y,cz+Math.sin(a)*r*(.9+.2*nn));
    cc.copy(moss).lerp(moss2,nn).lerp(dark,sm(.55,.8,n3(a*2,y*.7+ph,1))*.5);if(nn>.74)cc.lerp(rock,.75);col.push(cc.r,cc.g,cc.b)}}
  for(let i=0;i<rings;i++)for(let j=0;j<seg;j++){const a=i*(seg+1)+j,b=a+1,c=a+seg+1,d=c+1;idx.push(a,c,b,b,c,d)}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.setIndex(idx);g.computeVertexNormals();return g};
 const parts=[shaft(0,0,-1,27,.95,.62,0,0,!hollow)];
 const nf=1+((Rn()*3)|0);for(let k=0;k<nf;k++){const t=.42+Rn()*.38,a=Rn()*6.283,L=5+Rn()*6,lean=.45+Rn()*.25;const y=-1+t*27;
  parts.push(shaft(Math.cos(a)*.35,Math.sin(a)*.35,y-.6,L,.48,.3,Math.cos(a)*lean,Math.sin(a)*lean,1))}
 let g=mergeKeep(parts);
 if(hollow){const hole=new THREE.CircleGeometry(.5,10);hole.rotateX(-Math.PI/2);hole.translate(Math.sin(2+ph)*.25,26.02,0);g=mergeKeep([g,mergeColored([[hole,'#120e0a']])])}
 return g}
function rqSpires(sp){const kits=[spireGeo(11,false),spireGeo(23,true),spireGeo(37,false),spireGeo(41,false)];const mat=detailMat(VC({roughness:.85,emissive:'#1e2a1a'}),{bump:.9,freq:1.2});
 // neat rows, a few metres apart, filling a round patch; only a little jitter
 const C0=[15,-1],cl=Math.cos(15*D2R),pts=[];const Rn=rnd(1515);for(let i=-15;i<=15;i++)for(let j=-15;j<=15;j++){const dn=i*.2+(Rn()-.5)*.05,de=j*.2+(i%2?.1:0)+(Rn()-.5)*.05;if(dn*dn+de*de>9)continue;const la=C0[0]+dn,lo=C0[1]+de/cl;const h=sp.ghRaw(la,lo);if(h<1.6)continue;pts.push([la,lo,h,Rn()])}
 const by=[[],[],[],[]];pts.forEach((p,i)=>by[(p[3]*97|0)%4].push(p));
 by.forEach((L,k)=>inst(kits[k],mat,L,(o,p)=>{frameLL(sp,p[0],p[1],-1,p[3]*6.28,o);const c=1-Math.min(1,angDeg(dirLL(p[0],p[1]),dirLL(15,-1))/3);const w=.9+((p[3]*7)%1)*.35;o.scale.set(w,.38+Math.pow((p[3]*13)%1,1.6)*1.3+c*.35,w)},[2,3],{far:2200}));
 // moss and fallen stone between them, mist low in the gaps
 const deb=scatter(260,15,-1,3,8,onLand);inst(lumpRock(1,3),detailMat(VC({roughness:.95,flatShading:true}),{bump:.8}),deb,(o,p)=>{frameLL(sp,p[0],p[1],-.2,p[3]*6,o);o.scale.set(.8+p[3]*1.6,.5+p[3],.8+p[3]*1.4)},[2,3],{tint:p=>C(p[3]>.4?'#5a7a40':'#7a746a'),far:1200});
 fogBank(15,-1,2.4,10,5,'#dfe8e4',.35,1516,[2,3],14)}

/* ---------- the dead giants on the ice river: home trees three hundred metres tall, frozen where they stood in the
   flooded canyon, still upright like towers; bare columns (home trees never had side branches) under a rotted,
   frost-white crown, icicles hanging from its broken rim ---------- */
function fxG_frozenHomeGeo(seed){const Rn=rnd(seed);const H=150;const parts=[trunkGeo({h:H,r:[[0,19],[.05,14],[.15,12.4],[.6,11.8],[.9,12.2],[1,14]],ridges:17,twist:.6,amp:.16,seg:40,rings:36,col:'#a8b4ba',col2:'#4e5a62',moss:'#f4fbff',mossT:.9,ph:seed})];
 for(let i=0;i<7;i++){const a=i/7*Math.PI*2+Rn()*.4,L=9+Rn()*7;const ca=Math.cos(a),sa=Math.sin(a);parts.push(loftGeo([[ca*11,8,sa*11,4,1.8],[ca*(15+L*.3),3,sa*(15+L*.3),3,1.2],[ca*(15+L*.7),.4,sa*(15+L*.7),1.5,.7],[ca*(15+L),-2,sa*(15+L),.5,.4]],{n:22,r:9,back:'#eef6fa',belly:'#56626a'}))}
 // the rotted crown: a ragged ring of grey wood and old frost round a hollow top
 {const prof=[[13.5,H-2],[22,H+2],[25,H+6],[20,H+9],[12,H+8.5],[9,H+3],[0,H+2]].map(([r,y])=>new THREE.Vector2(r,y));const lg=new THREE.LatheGeometry(prof,40);const p=lg.attributes.position,cs=[];const c=new THREE.Color();
  for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);const a=Math.atan2(z,x);const bite=Math.max(0,Math.sin(a*5+seed))*4*(Math.hypot(x,z)>14?1:0);p.setY(i,y-bite);c.set('#d8e2e8').lerp(C('#6a747a'),n3(x*.2,y*.2,z*.2)*.6);cs.push(c.r,c.g,c.b)}
  lg.setAttribute('color',new THREE.Float32BufferAttribute(cs,3));lg.deleteAttribute('uv');lg.computeVertexNormals();parts.push(lg)}
 const ic=[];for(let k=0;k<60;k++){const a=Rn()*6.28,r=14+Rn()*10,L=2+Rn()*7;ic.push([tg(new THREE.ConeGeometry(.35+Rn()*.4,L,5),{p:[Math.cos(a)*r,H+1-L/2,Math.sin(a)*r],r:[Math.PI,0,0]}),Rn()<.5?'#e8fbff':'#c8ecf8'])}
 for(let k=0;k<40;k++){const a=Rn()*6.28,y=8+Rn()*40;const r=12.4-y*.01;const L=3+Rn()*6;ic.push([tg(new THREE.ConeGeometry(.5,L,5),{p:[Math.cos(a)*r,y,Math.sin(a)*r],r:[Math.PI,0,0]}),'#dff6ff'])}
 return{wood:mergeKeep(parts),ice:mergeColored(ic)}}
function rqFrozenTree(sp){const wm=detailMat(VC({roughness:.55,metalness:.05,side:THREE.DoubleSide}),{bump:.9,freq:1}),im=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.06,metalness:.1,transparent:true,opacity:.85,emissive:'#5ab8d8',emissiveIntensity:.18});
 const K=[fxG_frozenHomeGeo(4040),fxG_frozenHomeGeo(4141)];const Rn=rnd(4040);
 // the canyon is the ice river; the trees stand on its frozen surface (the ice sheet lies at about 1.4 over the sea)
 [[40,6.05,1,0],[38.3,5.9,.85,1],[42.4,6.1,.95,1],[44.9,5.95,.8,0],[36.9,6.2,.7,0]].forEach(([la,lo,s,k],i)=>{const g=new THREE.Group();g.add(new THREE.Mesh(K[k].wood,wm));g.add(new THREE.Mesh(K[k].ice,im));g.scale.setScalar(s);
  frameLL(sp,la,lo,0,i*1.3,g,false);g.position.setLength(R+.6);addE(g,[4]);cull(g,null,200*s,3200);if(i===0)sp.frozenT=g});
 const g=sp.frozenT;
 // frost cracks running out over the ice from the first tree's roots
 const cr=[];for(let k=0;k<26;k++){let a=Rn()*6.28,r=18,p=V3(Math.cos(a)*r,.9,Math.sin(a)*r);for(let s=0;s<14;s++){a+=(Rn()-.5)*.5;r+=6+Rn()*8;const q=V3(Math.cos(a)*r,.9,Math.sin(a)*r);cr.push(p,q);if(Rn()<.25){const b=a+(Rn()-.5)*2;cr.push(q,q.clone().add(V3(Math.cos(b)*8,0,Math.sin(b)*8)))}p=q}}
 g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(cr),new THREE.LineBasicMaterial({color:'#7fd8ff',transparent:true,opacity:.7})));
 // far below the ice: the crystal city of the ancient squid, a faint blue glow
 const city=[];for(let k=0;k<70;k++){const a=Rn()*6.28,d=30+Rn()*90;city.push(V3(Math.cos(a)*d,-2-Rn()*3,Math.sin(a)*d))}g.add(sparkles(city,'#6fd8ff',5,.55,.4));
 g.add(sparkles(Array.from({length:260},()=>V3((Rn()-.5)*140,Rn()*180,(Rn()-.5)*140)),'#ffffff',1.6,1));g.add(emitter({n:160,life:9,speed:2,spread:.6,size:5,dir:[1,-.15,.2],col:'#f2f8fb',op:.25,add:false,tex:smokeTex,area:[120,30,120],wander:2}));
 px('frozentree',g.position.clone().add(g.position.clone().normalize().multiplyScalar(90)),60)}

/* ---------- mountains: scree, forest on the lower flanks, snow on the crowns ---------- */
function rqMountains(sp){const peaks=[[22,-94,9],[36,15,10],[-6,73,9]];const kitC=geoC('conifer'),kitR=lumpRock(1,5);
 for(const [la,lo,r] of peaks){if(la===-6)continue;// the great peak of the east is bare cold rock
  const T=scatter(520,la,lo,r,hashStr('m'+la),(a,b,h)=>h>8&&h<70&&angDeg(dirLL(a,b),dirLL(36.6,14.2))>2.2);inst(kitC,VC({roughness:.85}),T,(o,p)=>{frameLL(sp,p[0],p[1],-.3,p[3]*6,o);o.scale.setScalar(.7+p[3]*.6)},la===36?[4,5,6,7,8,9,10,11,12]:[2,3,4,5,6,7,8,9,10,11,12],{tint:p=>C(p[2]>55?'#8a9a7a':'#ffffff').offsetHSL(0,0,(p[3]-.5)*.12),far:1600});
  const S=scatter(220,la,lo,r*.7,hashStr('s'+la),(a,b,h)=>h>40);inst(kitR,detailMat(VC({roughness:.95,flatShading:true}),{bump:.8}),S,(o,p)=>{frameLL(sp,p[0],p[1],-.3,p[3]*6,o);o.scale.set(1+p[3]*2.4,.6+p[3]*1.4,1+p[3]*2)},[2,3,4,5,6,7,8,9,10,11,12],{tint:p=>C(p[2]>85?'#f4f6f8':'#b8b0a2').offsetHSL(0,0,(p[3]-.5)*.1),far:1600})}}

/* ---------- the green pool: what is left where the emerald city stood ---------- */
function rqGreenPool(sp){const g=new THREE.Group();const Rn=rnd(1288);const eras=[4,5,6,7,8,9,10,11,12];
 // water that glows from below, rippling outward from springs
 const wm=new THREE.MeshStandardMaterial({color:'#2fbf7a',emissive:'#1f9a5a',emissiveIntensity:.6,roughness:.12,metalness:.1,transparent:true,opacity:.9});const U={uT:GT};
 wm.onBeforeCompile=sh=>{Object.assign(sh.uniforms,U);sh.vertexShader='varying vec2 vXZ;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvXZ=position.xy;');
  sh.fragmentShader='uniform float uT;varying vec2 vXZ;\n'+sh.fragmentShader.replace('#include <emissivemap_fragment>',`#include <emissivemap_fragment>
  {float r=length(vXZ);float w=sin(r*1.4-uT*1.6)*.5+.5;float w2=sin(length(vXZ-vec2(5.,-3.))*2.1-uT*2.2)*.5+.5;float edge=smoothstep(14.,16.,r);
   totalEmissiveRadiance*=.7+.35*w*w2+.5*(1.-smoothstep(0.,7.,r));diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.55,.8,.6),edge*.6);}`)};wm.customProgramCacheKey=()=>'pool';
 const pw=new THREE.Mesh(new THREE.CircleGeometry(16,56),wm);pw.rotation.x=-Math.PI/2;pw.position.y=.35;g.add(pw);g.add(at(glowSprite('#7fffb0',70,.22),0,3,0));
 // a broken ring of the old city: toppled pillars, wall stubs, moss over everything
 const ru=[];const stone=['#a8b8a0','#98a890','#b8c4b0'];
 for(let i=0;i<26;i++){const a=i/26*Math.PI*2+Rn()*.15,d=19+Rn()*6;const h=1+Rn()*4.5;ru.push([tg(new THREE.BoxGeometry(2.4+Rn()*2,h,1.2),{p:[Math.cos(a)*d,h/2-.3,Math.sin(a)*d],r:[(Rn()-.5)*.15,-a,(Rn()-.5)*.15]}),stone[i%3]])}
 for(let i=0;i<10;i++){const a=Rn()*6.28,d=24+Rn()*14;const up=Rn()<.4;const L=4+Rn()*6;ru.push([tg(new THREE.CylinderGeometry(.7,.8,L,10),{p:[Math.cos(a)*d,up?L/2:.6,Math.sin(a)*d],r:up?[0,0,0]:[Math.PI/2,Rn()*3,0]}),'#c0ccb8'])}
 for(let i=0;i<40;i++){const a=Rn()*6.28,d=17+Rn()*22;const s=.5+Rn()*1.3;ru.push([tg(lumpRock(s,i%4+1).clone(),{p:[Math.cos(a)*d,s*.3,Math.sin(a)*d]}),Rn()<.5?'#8aa080':'#a0a898'])}
 g.add(new THREE.Mesh(mergeColored(ru),detailMat(VC({roughness:.95}),{bump:.8,freq:2})));
 // reeds round the edge, lily pads, glowing spores and a low mist on the water
 const rd=[];for(let i=0;i<180;i++){const a=Rn()*6.28,d=15+Rn()*3;const L=1.5+Rn()*2.5;rd.push([tg(new THREE.ConeGeometry(.08,L,3),{p:[Math.cos(a)*d,L/2,Math.sin(a)*d],r:[(Rn()-.5)*.3,0,(Rn()-.5)*.3]}),Rn()<.5?'#5a8a3a':'#7a9a4a'])}
 for(let i=0;i<40;i++){const a=Rn()*6.28,d=4+Rn()*10;const c=new THREE.CircleGeometry(.6+Rn()*.6,8,.3,5.8);c.rotateX(-Math.PI/2);c.translate(Math.cos(a)*d,.42,Math.sin(a)*d);rd.push([c,Rn()<.3?'#7ab84a':'#3f8a3a'])}
 g.add(new THREE.Mesh(mergeColored(rd),swayMat({roughness:.8,side:THREE.DoubleSide},.02)));
 g.add(emitter({n:90,life:6,speed:.5,spread:.7,size:2.6,dir:[0,1,0],col:'#9fffc8',op:.7,area:[26,1,26],wander:1.2}));
 g.add(emitter({n:40,life:9,speed:.3,spread:1.4,size:12,dir:[1,.1,0],col:'#d8f4e4',op:.2,add:false,tex:smokeTex,area:[28,1.5,28],wander:.8}));
 fr(12,-88,0,0,g);addE(g,eras);cull(g,null,50,1700);px('greenpool',g.position.clone().add(g.position.clone().normalize().multiplyScalar(3)),18)}
