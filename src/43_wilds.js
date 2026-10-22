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
/* a limb: a lofted branch that tapers, from a to b bending up through mid */
function limbGeo(a,m,b,r0,r1,o){const pts=[a,m,b];const sp=[];for(let i=0;i<5;i++){const t=i/4;const p=new THREE.CatmullRomCurve3(pts).getPoint(t);const r=lerp(r0,r1,t);sp.push([p.x,p.y,p.z,r*1.05,r])}
 return loftGeo(sp,Object.assign({n:22,r:10,back:'#6a5440',belly:'#3e3024'},o||{}))}

function rqHomeTree(sp){const g=new THREE.Group();const Rn=rnd(2424);const bark=detailMat(VC({roughness:.95}),{bump:1.1,freq:1.6});const parts=[];const H=40;
 // the trunk, swollen at the foot, narrowing, then splaying into the crown
 parts.push(trunkGeo({h:H,r:[[0,9],[.08,6.8],[.25,5.4],[.6,4.6],[.85,4.9],[1,5.6]],ridges:13,twist:1.1,amp:.16,seg:40,rings:34,mossT:.35}));
 // buttress roots: tall thin fins that run out and dive into the soil
 for(let i=0;i<9;i++){const a=i/9*Math.PI*2+Rn()*.3,L=10+Rn()*7;const ca=Math.cos(a),sa=Math.sin(a);
  parts.push(loftGeo([[ca*4,6,sa*4,2.6,1.2],[ca*(6+L*.25),3.2,sa*(6+L*.25),2.2,.8],[ca*(6+L*.6),.8,sa*(6+L*.6)+Rn()*1.5,1.1,.55],[ca*(6+L),-1.2,sa*(6+L),.4,.3]],{n:26,r:10,back:'#5e4a38',belly:'#3a2c20'}))}
 // limbs: seven great arms, each forking; two are dead and grey
 const tips=[],dead=[];
 for(let i=0;i<7;i++){const a=i/7*Math.PI*2+Rn()*.4,y=H*(.72+Rn()*.22),L=12+Rn()*8;const ca=Math.cos(a),sa=Math.sin(a);const isDead=i===2||i===5;
  const A=V3(ca*3.5,y,sa*3.5),Mi=V3(ca*L*.5,y+5+Rn()*3,sa*L*.5),B=V3(ca*L,y+7+Rn()*5,sa*L);const col=isDead?{back:'#8a8478',belly:'#5a544a'}:{};
  parts.push(limbGeo(A,Mi,B,1.9,.55,col));
  for(let k=0;k<2;k++){const b2=a+(k?.6:-.6)+(Rn()-.5)*.3,L2=5+Rn()*5;const S=Mi.clone().lerp(B,.4+k*.2);const E=S.clone().add(V3(Math.cos(b2)*L2,3+Rn()*4,Math.sin(b2)*L2));
   parts.push(limbGeo(S,S.clone().lerp(E,.5).add(V3(0,1,0)),E,.6,.2,col));(isDead?dead:tips).push(E)}
  (isDead?dead:tips).push(B)}
 // up top the trunk splits: a ring of short leaders
 for(let i=0;i<5;i++){const a=i/5*Math.PI*2+.3;const S=V3(Math.cos(a)*3,H-1,Math.sin(a)*3),E=V3(Math.cos(a)*6,H+8+Rn()*4,Math.sin(a)*6);parts.push(limbGeo(S,S.clone().lerp(E,.5),E,1.4,.4));tips.push(E)}
 const wood=new THREE.Mesh(mergeKeep(parts),bark);g.add(wood);
 // the crown: clumped leaf masses at every live tip, thinning and yellowing (the tree is near its end)
 const leaves=[];const LC=['#2f6b44','#3a7a4a','#2a5e3c','#4a7a3a','#6a7a34','#8a7a3a'];
 for(const T of tips){const n=5+(Rn()*4|0);for(let k=0;k<n;k++){const s=2.2+Rn()*3;const p=T.clone().add(V3((Rn()-.5)*7,(Rn()-.2)*3.5,(Rn()-.5)*7));const c=LC[Math.min(5,(Rn()*Rn()*7)|0)];
   leaves.push([tg(new THREE.IcosahedronGeometry(1,1),{p:[p.x,p.y,p.z],s:[s,s*.62,s]}),c])}}
 const lm=swayMat({roughness:.85},.003);const crown=new THREE.Mesh(mergeColored(leaves),lm);g.add(crown);
 // bare twigs on the dead arms, moss beards hanging under the live ones
 const tw=[];for(const D of dead)for(let k=0;k<5;k++){const d=V3((Rn()-.5)*4,1+Rn()*3,(Rn()-.5)*4);tw.push([tg(new THREE.CylinderGeometry(.04,.12,d.length(),4),{p:[D.x+d.x/2,D.y+d.y/2,D.z+d.z/2],r:[Math.atan2(d.z,d.y),0,-Math.atan2(d.x,d.y)]}),'#7a7468'])}
 for(let k=0;k<70;k++){const T=tips[(Rn()*tips.length)|0];const p=T.clone().lerp(V3(0,T.y,0),Rn()*.7);const L=2+Rn()*4;tw.push([tg(new THREE.ConeGeometry(.22,L,4),{p:[p.x,p.y-L/2-1,p.z],r:[Math.PI,0,0]}),Rn()<.5?'#7a8a5a':'#8a9a6a'])}
 g.add(new THREE.Mesh(mergeColored(tw),VC({roughness:.95})));
 // the hollow: a dark arched doorway lit from inside, and knot-hole windows climbing the trunk
 const dm=new THREE.MeshBasicMaterial({color:'#1a0e08'});const arch=new THREE.Mesh(new THREE.CircleGeometry(2.2,16,0,Math.PI),dm);arch.position.set(0,3.2,7.1);g.add(arch);const ab=new THREE.Mesh(new THREE.PlaneGeometry(4.4,3.2),dm);ab.position.set(0,1.6,7.15);g.add(ab);
 const inner=new THREE.Mesh(new THREE.CircleGeometry(1.5,14),new THREE.MeshBasicMaterial({color:'#ffb070',transparent:true,opacity:.8}));inner.position.set(0,2.2,7.2);g.add(inner);g.add(at(glowSprite('#ffc080',12,.55),0,2.6,7.6));
 const knots=[];for(let i=0;i<9;i++){const a=Rn()*Math.PI*2,y=7+i*3.2+Rn()*2;const r=5.1-i*.05;knots.push(V3(Math.cos(a)*r,y,Math.sin(a)*r))}
 for(const k of knots){const w=new THREE.Mesh(new THREE.CircleGeometry(.5,10),new THREE.MeshBasicMaterial({color:'#ffcf80'}));w.position.copy(k).multiplyScalar(1.02).setY(k.y);w.lookAt(k.clone().multiplyScalar(3).setY(k.y));g.add(w);g.add(at(glowSprite('#ffc070',3.2,.5),k.x*1.08,k.y,k.z*1.08))}
 const l=new THREE.PointLight(0xffb070,1.4,46);l.position.set(0,5,8);g.add(l);
 // fallen leaves around the foot, fireflies in the dusk
 const lit=[];for(let i=0;i<400;i++){const a=Rn()*6.28,d=7+Math.sqrt(Rn())*16;lit.push(V3(Math.cos(a)*d,.25,Math.sin(a)*d))}g.add(sparkles(lit,'#c8a050',1.3,.8,0));
 g.add(emitter({n:120,life:6,speed:.4,spread:1,size:1.2,dir:[0,1,0],col:'#f4ff9a',op:.85,area:[40,20,40],wander:2.5}));
 g.scale.setScalar(1.6);fr(32,7,-2,0,g);addE(g,[2,3]);cull(g,null,110,2400);px('hometree',g.position.clone().add(g.position.clone().normalize().multiplyScalar(36)),40);
 anim(sp,g,t=>{inner.material.opacity=.7+Math.sin(t*2.3)*.1+Math.sin(t*5.1)*.05})}

/* ---------- the twisted jungle's upper world ---------- */
function jungleOK(la,lo,h){return h>2&&h<120&&Math.abs(lo-6)>1.2&&!(Math.abs(la-32)<1.1&&Math.abs(lo-7)<1.6)}
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

/* ---------- the spire forest: moss-wrapped hollow stone, packed like trunks ---------- */
function spireGeo(seed,hollow){const Rn=rnd(seed);const seg=14,rings=18,pos=[],col=[],idx=[];const rock=C('#a8a090'),dark=C('#7a7264'),moss=C('#6a9a48'),moss2=C('#86b058'),cc=new THREE.Color();
 const top=hollow?.86:1;const ph=Rn()*9;
 for(let i=0;i<=rings;i++){const t=i/rings*top;const base=Math.pow(1-t,.85)*(1+.35*Math.exp(-t*9));
  for(let j=0;j<=seg;j++){const a=j/seg*Math.PI*2;const nn=n3(Math.cos(a)*1.6+ph,t*5,Math.sin(a)*1.6);const r=2.3*Math.max(.04,base*(.82+.36*nn)+(hollow&&i===rings?.05:0));
   const bend=Math.sin(t*2.4+ph)*1.6*t;pos.push(Math.cos(a)*r+bend,t*26,Math.sin(a)*r);
   const mk=sm(.5,.68,n3(Math.cos(a)*3+ph,t*9,Math.sin(a)*3))*(1-sm(.75,1,t)*.6);cc.copy(rock).lerp(dark,sm(.6,.85,nn)*.5).lerp(nn>.5?moss:moss2,mk*.75);col.push(cc.r,cc.g,cc.b)}}
 for(let i=0;i<rings;i++)for(let j=0;j<seg;j++){const a=i*(seg+1)+j,b=a+1,c=a+seg+1,d=c+1;idx.push(a,c,b,b,c,d)}
 let g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.setIndex(idx);g.computeVertexNormals();
 if(hollow){const rt=Math.pow(1-top,.85)*.75*2.3;const hole=new THREE.CircleGeometry(rt,12);hole.rotateX(Math.PI/2);hole.translate(Math.sin(top*2.4)*1.6*top,(top-.012)*26,0);g=mergeKeep([g,mergeColored([[hole,'#120e0a']])])}
 return g}
function rqSpires(sp){const Rn=rnd(1515);const kits=[spireGeo(11,false),spireGeo(23,true),spireGeo(37,false),spireGeo(41,true)];const mat=detailMat(VC({roughness:.85,emissive:'#3a4234'}),{bump:.9,freq:1.2});
 const pts=scatter(300,15,-1,3,7,onLand);const by=[[],[],[],[]];pts.forEach((p,i)=>by[i%4].push(p));
 by.forEach((L,k)=>inst(kits[k],mat,L,(o,p)=>{frameLL(sp,p[0],p[1],-1,p[3]*6.28,o);const c=1-Math.min(1,angDeg(dirLL(p[0],p[1]),dirLL(15,-1))/3);const s=.5+Math.pow(p[3],1.4)*.8+c*.45;o.scale.set(s,s*(.8+((p[3]*7)%1)*.5),s*(.85+((p[3]*9)%1)*.3))},[2,3],{far:2200}));
 // moss and fallen stone between them, mist low in the gaps
 const deb=scatter(260,15,-1,3,8,onLand);inst(new THREE.DodecahedronGeometry(1,0),detailMat(VC({roughness:.95,flatShading:true}),{bump:.8}),deb,(o,p)=>{frameLL(sp,p[0],p[1],-.2,p[3]*6,o);o.scale.set(.8+p[3]*1.6,.5+p[3],.8+p[3]*1.4)},[2,3],{tint:p=>C(p[3]>.6?'#5a7a40':'#7a746a'),far:1200});
 fogBank(15,-1,2.4,10,5,'#dfe8e4',.35,1516,[2,3],14)}

/* ---------- the dead giant on the ice river: three hundred metres of frozen wood ---------- */
function rqFrozenTree(sp){const g=new THREE.Group();const Rn=rnd(4040);const parts=[];const H=150;
 parts.push(trunkGeo({h:H,r:[[0,24],[.06,15],[.3,11],[.7,8.5],[.92,7.5],[1,8.2]],ridges:15,twist:1.6,amp:.2,seg:44,rings:40,col:'#a8b4ba',col2:'#4e5a62',moss:'#f4fbff',mossT:.9}));
 for(let i=0;i<10;i++){const a=i/10*Math.PI*2+Rn()*.3,L=24+Rn()*20;const ca=Math.cos(a),sa=Math.sin(a);parts.push(loftGeo([[ca*12,10,sa*12,6,2.4],[ca*(16+L*.3),4,sa*(16+L*.3),4,1.6],[ca*(16+L*.7),.5,sa*(16+L*.7),2,1],[ca*(16+L),-3,sa*(16+L),.6,.5]],{n:26,r:10,back:'#eef6fa',belly:'#56626a'}))}
 const tips=[];for(let i=0;i<9;i++){const a=i/9*Math.PI*2+Rn()*.5,y=H*(.62+Rn()*.34),L=30+Rn()*26;const ca=Math.cos(a),sa=Math.sin(a);const A=V3(ca*7,y,sa*7),M2=V3(ca*L*.5,y+10+Rn()*8,sa*L*.5),B=V3(ca*L,y+16+Rn()*12,sa*L);
  parts.push(limbGeo(A,M2,B,4.2,1.1,{back:'#f2f8fb',belly:'#5a666e'}));tips.push([M2,B]);
  for(let k=0;k<3;k++){const S=M2.clone().lerp(B,.2+k*.3);const b2=a+(Rn()-.5)*1.6;const E=S.clone().add(V3(Math.cos(b2)*(8+Rn()*10),5+Rn()*8,Math.sin(b2)*(8+Rn()*10)));parts.push(limbGeo(S,S.clone().lerp(E,.5).add(V3(0,2,0)),E,1.3,.3,{back:'#f4f9fc',belly:'#606a72'}));tips.push([S,E])}}
 g.add(new THREE.Mesh(mergeKeep(parts),detailMat(VC({roughness:.55,metalness:.05}),{bump:.9,freq:1})));
 // icicles hanging from every limb, a shell of glassy ice on the lower trunk
 const ic=[];for(const [A,B] of tips)for(let k=0;k<7;k++){const p=A.clone().lerp(B,Rn());const L=2+Rn()*7;ic.push([tg(new THREE.ConeGeometry(.35+Rn()*.4,L,5),{p:[p.x,p.y-L/2-.8,p.z],r:[Math.PI,0,0]}),Rn()<.5?'#e8fbff':'#c8ecf8'])}
 for(let k=0;k<40;k++){const a=Rn()*6.28,y=8+Rn()*40;const r=12-y*.08;const L=3+Rn()*6;ic.push([tg(new THREE.ConeGeometry(.5,L,5),{p:[Math.cos(a)*r,y,Math.sin(a)*r],r:[Math.PI,0,0]}),'#dff6ff'])}
 g.add(new THREE.Mesh(mergeColored(ic),new THREE.MeshStandardMaterial({vertexColors:true,roughness:.06,metalness:.1,transparent:true,opacity:.85,emissive:'#5ab8d8',emissiveIntensity:.18})));
 // frost cracks running out over the ice from its roots
 const cr=[];for(let k=0;k<26;k++){let a=Rn()*6.28,r=18,p=V3(Math.cos(a)*r,.6,Math.sin(a)*r);for(let s=0;s<14;s++){a+=(Rn()-.5)*.5;r+=6+Rn()*8;const q=V3(Math.cos(a)*r,.6,Math.sin(a)*r);cr.push(p,q);if(Rn()<.25){const b=a+(Rn()-.5)*2;cr.push(q,q.clone().add(V3(Math.cos(b)*8,0,Math.sin(b)*8)))}p=q}}
 const cl=new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(cr),new THREE.LineBasicMaterial({color:'#7fd8ff',transparent:true,opacity:.7}));g.add(cl);
 // far below the ice: the crystal city of the ancient squid, a faint blue glow
 const city=[];for(let k=0;k<70;k++){const a=Rn()*6.28,d=30+Rn()*90;city.push(V3(Math.cos(a)*d,-2-Rn()*3,Math.sin(a)*d))}g.add(sparkles(city,'#6fd8ff',5,.55,.4));
 g.add(sparkles(Array.from({length:260},()=>V3((Rn()-.5)*140,Rn()*180,(Rn()-.5)*140)),'#ffffff',1.6,1));g.add(emitter({n:160,life:9,speed:2,spread:.6,size:5,dir:[1,-.15,.2],col:'#f2f8fb',op:.25,add:false,tex:smokeTex,area:[120,30,120],wander:2}));
 fr(40,0,-3,0,g);addE(g,[4]);cull(g,null,200,3200);px('frozentree',g.position.clone().add(g.position.clone().normalize().multiplyScalar(90)),60)}

/* ---------- echo island: the sky-hold that carried the animals, set down among new trees ---------- */
function rqEcho(sp){const g=new THREE.Group();const hull=loft([[11,0,0,.4,.4],[8,.6,0,2.4,2.6],[2,1,0,3.4,3.6],[-5,.8,0,3.2,3.4],[-10,.3,0,1.8,2],[-12,0,0,.4,.5]],{n:40,r:18,back:'#d8e4dc',belly:'#8a9a90',stripe:5,rough:.4});g.add(hull);
 for(let i=0;i<5;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(3.5-Math.abs(i-2)*.3,.18,6,20),M('#6a7a72',{roughness:.4,metalness:.3}));r.position.x=6-i*3.5;r.rotation.y=Math.PI/2;g.add(r)}
 for(const s of[-1,1]){const d=new THREE.Mesh(new THREE.PlaneGeometry(6,3.2),M('#2a3430',{side:THREE.DoubleSide}));d.position.set(0,.4,s*3.6);d.rotation.set(s*-.5,0,0);g.add(d);g.add(at(glowSprite('#c8ffe0',6,.4),0,.6,s*3.9))}
 const sl=[];for(let i=0;i<8;i++){const m=new THREE.Mesh(sgeo(12),new THREE.MeshStandardMaterial({color:'#bff0d8',transparent:true,opacity:.45,roughness:.1,emissive:'#4ab890',emissiveIntensity:.3,depthWrite:false}));m.position.set((h3(i,1,5)-.5)*40,10+h3(i,2,5)*14,(h3(i,3,5)-.5)*40);m.scale.setScalar(1.4+h3(i,4,5)*1.8);g.add(m);sl.push(m)}
 frameLL(sp,10.2,-28.2,1.2,.6,g);addE(g,[3,4]);cull(g,null,60,1600);anim(sp,g,t=>sl.forEach((m,i)=>{m.position.y=12+h3(i,2,5)*14+Math.sin(t*.6+i)*1.5;m.scale.y=(1.4+h3(i,4,5)*1.8)*(1+Math.sin(t*1.7+i)*.08)}));
 px('echo',g.position.clone().add(g.position.clone().normalize().multiplyScalar(6)),20)}

/* ---------- mountains: scree, forest on the lower flanks, snow on the crowns ---------- */
function rqMountains(sp){const peaks=[[22,-94,9],[36,15,10],[-6,73,9]];const kitC=geoC('conifer'),kitR=new THREE.DodecahedronGeometry(1,0);
 for(const [la,lo,r] of peaks){const T=scatter(520,la,lo,r,hashStr('m'+la),(a,b,h)=>h>8&&h<70&&angDeg(dirLL(a,b),dirLL(36.6,14.2))>2.2);inst(kitC,VC({roughness:.85}),T,(o,p)=>{frameLL(sp,p[0],p[1],-.3,p[3]*6,o);o.scale.setScalar(.7+p[3]*.6)},[2,3,4,5,6,7,8,9,10,11,12],{tint:p=>C(p[2]>55?'#8a9a7a':'#ffffff').offsetHSL(0,0,(p[3]-.5)*.12),far:1600});
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
 for(let i=0;i<40;i++){const a=Rn()*6.28,d=17+Rn()*22;const s=.5+Rn()*1.3;ru.push([tg(new THREE.DodecahedronGeometry(s,0),{p:[Math.cos(a)*d,s*.3,Math.sin(a)*d]}),Rn()<.5?'#8aa080':'#a0a898'])}
 g.add(new THREE.Mesh(mergeColored(ru),detailMat(VC({roughness:.95}),{bump:.8,freq:2})));
 // reeds round the edge, lily pads, glowing spores and a low mist on the water
 const rd=[];for(let i=0;i<180;i++){const a=Rn()*6.28,d=15+Rn()*3;const L=1.5+Rn()*2.5;rd.push([tg(new THREE.ConeGeometry(.08,L,3),{p:[Math.cos(a)*d,L/2,Math.sin(a)*d],r:[(Rn()-.5)*.3,0,(Rn()-.5)*.3]}),Rn()<.5?'#5a8a3a':'#7a9a4a'])}
 for(let i=0;i<40;i++){const a=Rn()*6.28,d=4+Rn()*10;const c=new THREE.CircleGeometry(.6+Rn()*.6,8,.3,5.8);c.rotateX(-Math.PI/2);c.translate(Math.cos(a)*d,.42,Math.sin(a)*d);rd.push([c,Rn()<.3?'#7ab84a':'#3f8a3a'])}
 g.add(new THREE.Mesh(mergeColored(rd),swayMat({roughness:.8,side:THREE.DoubleSide},.02)));
 g.add(emitter({n:90,life:6,speed:.5,spread:.7,size:2.6,dir:[0,1,0],col:'#9fffc8',op:.7,area:[26,1,26],wander:1.2}));
 g.add(emitter({n:40,life:9,speed:.3,spread:1.4,size:12,dir:[1,.1,0],col:'#d8f4e4',op:.2,add:false,tex:smokeTex,area:[28,1.5,28],wander:.8}));
 fr(12,-88,0,0,g);addE(g,eras);cull(g,null,50,1700);px('greenpool',g.position.clone().add(g.position.clone().normalize().multiplyScalar(3)),18)}
