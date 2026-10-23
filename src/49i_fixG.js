/* ================================================================
   fixG: places and set pieces of the home planet put back the way the book has them,
   a few far-world places (the deep-sea city, the windy fortress town, the sky academy),
   and some small bodies from the misc list. every top-level name here starts with fxG_.
   ================================================================ */

/* ---------- terrain ---------- */
/* the twin isles: two separate domes, like a ball cut in half, a narrow strait between them;
   the skull island is its own mesh (below), so the planet keeps only a shallow shelf there;
   west of it the sea floor of the abyss graveyard is raised enough to be seen through the water */
// (the planet's rivers are traced while the scripts are still loading, so these are made on first use: a var has no dead zone)
var fxG_KK;
function fxG_K(){return fxG_KK||(fxG_KK={T1:dirLL(1,-46.6),T2:dirLL(1,-43.6),TM:dirLL(1,-45.1),SK:dirLL(8,-32.6),GRV:dirLL(4.6,-38.6),AP:dirLL(-6.2,66.2),PK:dirLL(36,15),...fxG_skel()})}
function fxG_isles(p,h){const K=fxG_K();let a=angDeg(p,K.TM);
 if(a<4.2){const ai=Math.min(angDeg(p,K.T1),angDeg(p,K.T2)),R0=1.2;let t;
  if(ai<R0){const k=Math.sqrt(1-(ai/R0)*(ai/R0));t=.5+17.5*k+(fbm(p.x*40+3,p.y*40,p.z*40,3)-.5)*3.4*k}else t=Math.min(h,lerp(-1.3,-18,sm(R0,R0+1,ai)));
  h=lerp(h,t,1-sm(3.2,4.2,a))}
 a=angDeg(p,K.SK);if(a<4.8){const ll=llDir(p),uv=fxG_skUV(ll[0],ll[1]);const d=Math.max(0,fxG_skD(uv[0],uv[1]));h=lerp(h,-6-40*sm(.12,1.3,d),1-sm(3.8,4.8,a))}
 a=angDeg(p,K.GRV);if(a<2.2&&h<-10){const w=(1-sm(.9,2.2,a))*sm(.38,.62,fbm(p.x*22+5,p.y*22,p.z*22,3));h=lerp(h,-13+(fbm(p.x*40,p.y*40,p.z*40,2)-.5)*2,w)}
 return h}
/* changes that come after the rivers are traced (so the rivers keep their courses):
   the great rift two thousand metres deep in a raised tableland; the cliff the Leviathan climbed, with a flat
   rock plain on top; and the academy's own mountain beside the great peak, its top just clearing the third cloud layer */
const fxG_ACAD=[-6.2,66.2];
function fxG_post(p,h){const K=fxG_K();let a;
 a=segAng(wig(p),F.riftA,F.riftB);if(a<5){const tl=llDir(p);const ends=sm(-1,1.5,tl[0]-3)*(1-sm(25,27.5,tl[0]));
  if(h>1.5){const lift=54*(1-sm(1.6,4.8,a))*ends;h+=lift*sm(1.5,6,h)}if(h>-4)h=lerp(h,.9+(fbm(p.x*50,p.y*50,p.z*50,2)-.5)*1.5,(1-sm(.5,1.25,a))*ends)}
 {const ll=llDir(p),la=ll[0],lo=ll[1];if(lo>-8&&lo<10&&la>1&&la<9){const ew=sm(-8,-5.5,lo)*(1-sm(7.6,9.6,lo));
   const c=3.05+Math.sin(lo*1.3)*.18+(n3(lo*2.1,1.7,.3)-.5)*.25;if(ew>0){
    const top=22+(fbm(p.x*60,p.y*60,p.z*60,3)-.5)*3.5;const s=sm(c-.12,c+.12,la);let t=lerp(Math.min(h,-4),top,s);
    if(la>c+.12)t=lerp(top,h,sm(6.2,7.8,la));h=lerp(h,t,ew)}}}
 a=angDeg(p,K.AP);if(a<5)h+=crag(p,a,1.3,54,5.3)+12*Math.exp(-(a*a)/(2*2.6*2.6));
 return h}

/* ---------- 骷髅岛 / 回音之岛: one island ----------
   from high above, in its fog, the island's outline is a beast's skeleton: a skull headland with two lagoon eye-holes,
   a spine ridge, rib peninsulas with sea between them, four legs and a long curling tail. down on it, it is plain ground:
   sand, rock, and green skin-like plants. the land is a mesh of its own (the planet grid is too coarse for ribs). */
function fxG_segD(u,v,ax,ay,bx,by){const dx=bx-ax,dy=by-ay;let t=((u-ax)*dx+(v-ay)*dy)/(dx*dx+dy*dy||1);t=t<0?0:t>1?1:t;const x=ax+dx*t-u,y=ay+dy*t-v;return[Math.sqrt(x*x+y*y),t]}
function fxG_polyD(u,v,P,r0,r1){let best=1e9;for(let i=0;i<P.length-1;i++){const [d,t]=fxG_segD(u,v,P[i][0],P[i][1],P[i+1][0],P[i+1][1]);const r=lerp(r0,r1,(i+t)/(P.length-1));best=Math.min(best,d-r)}return best}
function fxG_skel(){const RIBS=(()=>{const L=[];for(let i=0;i<8;i++){const u0=-.78+i*.25,len=.8-Math.pow((i-4.2)/4.2,2)*.32;for(const s of[-1,1]){const P=[];for(let k=0;k<=5;k++){const t=k/5;P.push([u0-.3*Math.pow(t,1.5),s*(.1+len*Math.sin(t*Math.PI/2))])}L.push(P)}}return L})();
const SPINE=Array.from({length:9},(_,i)=>{const u=-1.35+i*2.62/8;return[u,.06*Math.sin(u*2.2)]});
const TAIL=[[-1.4,0],[-2,.12],[-2.6,.42],[-3.15,.52],[-3.55,.3],[-3.7,.05]];
const LEGS=[[[1.02,.14],[1.3,.7],[1.62,1.05],[1.82,1.1]],[[1.02,-.14],[1.3,-.7],[1.62,-1.05],[1.82,-1.1]],[[-1.3,.3],[-1.7,.78],[-1.5,1.12],[-1.3,1.2]],[[-1.3,-.3],[-1.7,-.78],[-1.5,-1.12],[-1.3,-1.2]]];
 return{RIBS,SPINE,TAIL,LEGS}}
function fxG_skD(u,v){const K=fxG_K();let d=fxG_polyD(u,v,K.SPINE,.16,.14);
 {const du=(u-1.78)/.52,dv=v/.42;d=Math.min(d,(Math.sqrt(du*du+dv*dv)-1)*.42)}d=Math.min(d,fxG_polyD(u,v,[[2.1,0],[2.62,0]],.22,.12));
 {const du=(u+1.4)/.3,dv=v/.4;d=Math.min(d,(Math.sqrt(du*du+dv*dv)-1)*.3)}
 for(const P of K.RIBS)d=Math.min(d,fxG_polyD(u,v,P,.07,.045));for(const P of K.LEGS)d=Math.min(d,fxG_polyD(u,v,P,.085,.06));d=Math.min(d,fxG_polyD(u,v,K.TAIL,.14,.05));
 // the eye-holes of the skull are lagoons
 for(const s of[-1,1]){const e=Math.hypot(u-1.86,v-s*.19)-.11;d=Math.max(d,-e)}
 return d}
// centre 8,-32.6; the body's axis lies .42 rad south of east
function fxG_skUV(la,lo){const e=(lo+32.6)*.990268,n=la-8;const c=Math.cos(-.42),s=Math.sin(-.42);return[e*c+n*s,-e*s+n*c]}
function fxG_skLL(u,v){const c=Math.cos(-.42),s=Math.sin(-.42);const e=u*c-v*s,n=u*s+v*c;return[8+n,-32.6+e/.990268]}
function fxG_skH(u,v){const d=fxG_skD(u,v);const nz=n3(u*9+3,v*9,1.3),nz2=n3(u*31,v*31,4.1);
 if(d<0)return .55+7.5*sm(0,.17,-d)+(nz-.5)*1.4*sm(0,.05,-d)+(nz2-.5)*.4;
 // under water the shore slopes away; triangles deeper than this are left out and the planet's own sea floor shows
 return -.35-1.3*sm(0,.2,d)-1.8*sm(.2,.5,d)}
function fxG_skull(sp){const NU=330,NV=160,U0=-3.95,U1=2.95,V0=-1.55,V1=1.55;const pos=[],col=[],idx=[];const c=new THREE.Color();
 const SAND=C('#d6c48e'),WET=C('#9a8a62'),SKIN=C('#7ea25a'),SKIN2=C('#93b064'),ROCK=C('#8a8070'),MOSS=C('#5f8a4a'),SEA=C('#6a7a64');
 for(let j=0;j<=NV;j++)for(let i=0;i<=NU;i++){const u=lerp(U0,U1,i/NU),v=lerp(V0,V1,j/NV);const h=fxG_skH(u,v);const [la,lo]=fxG_skLL(u,v);const d=dirLL(la,lo).multiplyScalar(R+h);pos.push(d.x,d.y,d.z);
  const n=n3(u*14,v*14,7.7);if(h<.15)c.copy(SEA).lerp(WET,sm(-1.6,.1,h));else if(h<1.3)c.copy(WET).lerp(SAND,sm(.15,.8,h));else{c.copy(SKIN).lerp(SKIN2,n);c.lerp(SAND,1-sm(1.3,2.1,h));c.lerp(ROCK,sm(5.2,7.6,h)*(.55+.45*n));c.lerp(MOSS,sm(.55,.75,n3(u*6,v*6,2))*sm(2,4,h)*.6)}
  col.push(c.r,c.g,c.b)}
 const HV=[];for(let k=2;k<pos.length;k+=3)HV.push(0);{let k=0;for(let j=0;j<=NV;j++)for(let i=0;i<=NU;i++){const x=pos[k*3],y=pos[k*3+1],z=pos[k*3+2];HV[k]=Math.hypot(x,y,z)-R;k++}}
 for(let j=0;j<NV;j++)for(let i=0;i<NU;i++){const a=j*(NU+1)+i,b=a+1,cc=a+NU+1,d=cc+1;if(Math.max(HV[a],HV[b],HV[cc],HV[d])<-3.3)continue;idx.push(a,b,cc,b,d,cc)}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.setIndex(idx);g.computeVertexNormals();
 {const nr=g.attributes.normal,p=g.attributes.position;let flip=0;const q=V3(p.getX(0),p.getY(0),p.getZ(0)).normalize();if(V3(nr.getX(0),nr.getY(0),nr.getZ(0)).dot(q)<0)flip=1;if(flip){for(let k=0;k<idx.length;k+=3){const t=idx[k+1];idx[k+1]=idx[k+2];idx[k+2]=t}g.setIndex(idx);g.computeVertexNormals()}}
 g.computeBoundingSphere();const m=new THREE.Mesh(g,detailMat(new THREE.MeshStandardMaterial({vertexColors:true,roughness:.92}),{planet:1,rock:'#857a6a',bump:.9}));m.receiveShadow=true;
 addE(m,[2,3,4,5,6,7,8,9,10,11,12]);cull(m,g.boundingSphere.center.clone(),g.boundingSphere.radius,2800);sp.skullIsle=m;
 const Rn=rnd(3939);const at2=(u,v,alt,hd,o)=>{const [la,lo]=fxG_skLL(u,v);frameLL(sp,la,lo,0,hd,o,false);o.position.setLength(R+fxG_skH(u,v)+(alt||0));return o};
 const land=(n,test,seed)=>{const R2=rnd(seed),out=[];for(let k=0;k<n*40&&out.length<n;k++){const u=lerp(U0+.3,U1-.3,R2()),v=lerp(V0+.2,V1-.2,R2());const d=fxG_skD(u,v);if(d<-.03&&(!test||test(u,v,d)))out.push([u,v,0,R2()])}return out};
 const set=(alt,s0,s1)=>(o,p)=>{at2(p[0],p[1],alt,p[3]*6.28,o);o.scale.setScalar(s0+p[3]*s1)};
 sp.skAt=(u,v,alt)=>{const [la,lo]=fxG_skLL(u,v);return dirLL(la,lo).multiplyScalar(R+fxG_skH(u,v)+(alt||0))};
 // the skin-like ground cover: low soft green mounds
 inst(new THREE.SphereGeometry(1,8,4,0,6.283,0,1.4),VC({roughness:1}),land(1100,null,11),(o,p)=>{at2(p[0],p[1],-.25,p[3]*6,o);o.scale.set(.5+p[3]*.9,.18+p[3]*.2,.45+p[3]*.8)},[2,3,4,5,6,7,8,9,10,11,12],{tint:p=>C(p[3]>.5?'#6a8e4c':'#7a9a56').offsetHSL(0,0,(p[3]-.5)*.1),far:900});
 inst(lumpRock(1,3),detailMat(VC({roughness:.95,flatShading:true}),{bump:.8}),land(160,(u,v,d)=>fxG_skH(u,v)>3,12),(o,p)=>{at2(p[0],p[1],-.3,p[3]*6,o);o.scale.set(.6+p[3]*1.4,.4+p[3]*.8,.6+p[3]*1.2)},[2,3,4,5,6,7,8,9,10,11,12],{tint:p=>C(p[3]>.6?'#6f8a58':'#8a8070'),far:1100});
 // echo eggs: rock-wrapped, cracked a little, here and there all over the island
 {const egg=G([[lumpRock(1,5).clone(),'#8a8274',{s:[1,.8,1]}],[new THREE.SphereGeometry(.55,10,8),'#d8d0b8',{p:[.55,.25,.2],s:[1,1.25,1]}],[kb(.04,.7,.04),'#2a2620',{p:[.2,.3,.6],r:[0,0,.5]}]]);
  inst(egg,detailMat(VC({roughness:.9,flatShading:true}),{bump:.7}),land(70,null,13),(o,p)=>{at2(p[0],p[1],.1,p[3]*6.28,o);o.scale.setScalar(.7+p[3]*.6)},[3,4,5,6,7,8,9,10,11,12],{far:700})}
 // the sky-hold, set down here and crumbled to pieces when it was opened: curved shell plates and broken hoops
 {const P=[];const R3=rnd(77);for(let k=0;k<18;k++){const a0=R3()*6.28,w=.6+R3()*.9;const sh=new THREE.CylinderGeometry(3.4,3.4,2+R3()*3,10,1,true,a0,w);P.push([sh,R3()<.5?'#d8e4dc':'#b8c8be',{p:[(R3()-.5)*22,.6+R3()*.6,(R3()-.5)*9],r:[Math.PI/2+(R3()-.5)*.6,R3()*3,(R3()-.5)*.8]}])}
  for(let k=0;k<4;k++)P.push([new THREE.TorusGeometry(3.2,.18,5,14,1.6+R3()*1.6),'#6a7a72',{p:[(R3()-.5)*18,.3,(R3()-.5)*8],r:[Math.PI/2+(R3()-.5)*.3,0,R3()*6]}]);
  const hull=new THREE.Mesh(G(P),VC({roughness:.45,metalness:.2,side:THREE.DoubleSide}));at2(.45,.0,.0,.6,hull);addE(hull,[3,4]);cull(hull,null,30,1500)}
 // two twisted trees planted when the animals were let out; in book two they cover the whole island
 {const tw=geoC('twist');inst(tw,VC({roughness:.85}),[[.2,.05,0,.4],[.62,-.08,0,.8]],set(-.4,.42,.1),[3,4]);
  inst(tw,swayMat({roughness:.85},.0016),land(260,(u,v,d)=>fxG_skH(u,v)>1.6,14),set(-.4,.3,.25),[5,6,7,8,9,10,11,12],{tint:p=>C('#ffffff').offsetHSL((p[3]-.5)*.05,0,(p[3]-.5)*.14),far:1600})}
 // the fog that never lifts, and fish-eating air slimes drifting in it
 // fog lying on the land itself and nowhere else, so that from high up it traces the skeleton
 {const g=new THREE.Group();const mtl=new THREE.SpriteMaterial({map:smokeTex,color:'#eef2f2',transparent:true,opacity:.5,depthWrite:false});const L=land(320,null,15);
  for(const p of L){const s=new THREE.Sprite(mtl);const sz=9+p[3]*9;s.scale.set(sz,sz*.5,1);s.position.copy(sp.skAt(p[0],p[1],2.5+p[3]*4));g.add(s)}
  addE(g,[3,4,5,6,7,8,9,10,11,12]);cull(g,sp.skAt(0,0,0),90,3600);anim(sp,g,()=>{mtl.opacity=.5*(1-sm(900,2200,rig.alt))})}
 {const g=new THREE.Group();const sl=[];for(let i=0;i<6;i++){const m2=new THREE.Mesh(sgeo(12),new THREE.MeshStandardMaterial({color:'#bff0d8',transparent:true,opacity:.45,roughness:.1,emissive:'#4ab890',emissiveIntensity:.3,depthWrite:false}));m2.position.set((h3(i,1,5)-.5)*40,10+h3(i,2,5)*14,(h3(i,3,5)-.5)*30);m2.scale.setScalar(1.4+h3(i,4,5)*1.8);g.add(m2);sl.push(m2)}
  at2(.3,0,0,0,g);addE(g,[3,4]);cull(g,null,50,1400);anim(sp,g,t=>sl.forEach((m2,i)=>{m2.position.y=12+h3(i,2,5)*14+Math.sin(t*.6+i)*1.5}))}
 // the oxygen ball: three metres, mossy, floating over the island and breathing into its tail through a tube
 {const tl=fxG_K().TAIL[3],g=new THREE.Group();const ob=new THREE.Mesh(sgeo(16),detailMat(M('#5aa86c').clone(),{bump:1.2,freq:3}));ob.position.set(0,16,0);ob.scale.setScalar(2.6);g.add(ob);
  g.add(new THREE.Mesh(ktube([V3(0,14,0),V3(1,8,1.5),V3(.5,2.5,2.5),V3(0,.2,3)],.3,14),M('#4a7a4a')));at2(tl[0],tl[1],0,0,g);addE(g,[3,4,5,6,7,8,9,10,11,12]);cull(g,null,30,1800);anim(sp,ob,t=>ob.scale.setScalar(2.6+Math.sin(t*1.2)*.25))}
 px('skull',sp.skAt(0,0,14),26,{maxD:3000});px('echo',sp.skAt(.45,0,5),12)}

/* ---------- 家园树: a straight column three hundred metres tall and more than fifty across, no side branches at all;
   clouds drift round its middle; the top is a single green cap with a pit in it fifty metres deep and forty across,
   a small lake at the bottom of the pit; the river spills over the rim and falls down the side as a waterfall.
   the jungle stands back from its foot, leaving a ring of open ground ---------- */
const fxG_HT=[32,8.3];
function fxG_fallMat(){return new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,uniforms:{uT:GT},vertexShader:'varying vec2 vU;void main(){vU=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:'uniform float uT;varying vec2 vU;void main(){float s=fract(vU.y*3.+uT*1.6+sin(vU.x*23.)*.3);float s2=fract(vU.y*5.3+uT*2.3+sin(vU.x*41.+1.)*.2);float e=smoothstep(0.,.15,vU.x)*smoothstep(1.,.85,vU.x);float k=.55+.45*smoothstep(.2,.9,max(s,s2));vec3 c=mix(vec3(.55,.75,.85),vec3(.97,.99,1.),k);gl_FragColor=vec4(c,(.55+.4*k)*e);}'})}
function fxG_homeTree(sp){const g=new THREE.Group();const Rn=rnd(2425);const H=150;const bark=detailMat(VC({roughness:.95}),{bump:1.1,freq:1.2});const parts=[];
 parts.push(trunkGeo({h:H,r:[[0,21],[.04,15.5],[.12,13.2],[.5,12.2],[.86,12.6],[.95,15],[1,17.5]],ridges:19,twist:.5,amp:.12,seg:48,rings:46,mossT:.22}));
 // a few low buttresses where the column meets the ground (roots, not branches)
 for(let i=0;i<8;i++){const a=i/8*Math.PI*2+Rn()*.3,L=10+Rn()*8;const ca=Math.cos(a),sa=Math.sin(a);
  parts.push(loftGeo([[ca*12,9,sa*12,4,2],[ca*(16+L*.3),3.5,sa*(16+L*.3),3,1.3],[ca*(16+L*.7),.6,sa*(16+L*.7),1.4,.8],[ca*(16+L),-1.5,sa*(16+L),.5,.4]],{n:24,r:10,back:'#5e4a38',belly:'#3a2c20'}))}
 g.add(new THREE.Mesh(mergeKeep(parts),bark));
 // the cap: one green crown spreading out over the top, rising to a rim, and sinking inside into the pit
 {const prof=[[16.5,H-8],[24,H-6],[31,H-1.5],[33.5,H+4],[31,H+9],[24,H+12.5],[15,H+13.5],[11.5,H+12],[10.4,H+4],[9.6,H-6],[8.6,H-10.6],[0,H-11.2]].map(([r,y])=>new THREE.Vector2(r,y));
  const lg=new THREE.LatheGeometry(prof,56);const p=lg.attributes.position,cs=[];const c=new THREE.Color(),cA=C('#2f6e3e'),cB=C('#4a8a44'),cC=C('#5a6a3a');
  for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);const r=Math.hypot(x,z);const n=n3(x*.18,y*.18,z*.18);if(r>11){const k=1+(n-.5)*.16;p.setX(i,x*k);p.setZ(i,z*k);p.setY(i,y+(n3(x*.3+4,y*.1,z*.3)-.5)*2.2)}
   c.copy(cA).lerp(cB,n);if(y<H-6)c.lerp(cC,.5);if(r<11)c.lerp(C('#3a4a2a'),.6);cs.push(c.r,c.g,c.b)}
  lg.setAttribute('color',new THREE.Float32BufferAttribute(cs,3));lg.deleteAttribute('uv');lg.computeVertexNormals();
  const cap=new THREE.Mesh(lg,detailMat(VC({roughness:.9,side:THREE.DoubleSide}),{bump:1.3,freq:2}));g.add(cap);
  const cl=[];for(let i=0;i<120;i++){const a=Rn()*6.283,r=18+Rn()*15,y=H-4+Rn()*14-Math.max(0,r-28)*.9;const s=2.4+Rn()*3.2;cl.push([tg(new THREE.IcosahedronGeometry(1,1),{p:[Math.cos(a)*r,y,Math.sin(a)*r],s:[s,s*.6,s]}),Rn()<.5?'#3a7a44':'#2f6a3c'])}
  // the sway grows with the square of the height in the mesh's own frame, so the leaf clumps are built round a point just
  // under the cap: they only rustle (a few tenths of a unit at the top), they do not swing the whole crown
  const lm=new THREE.Mesh(mergeColored(cl).translate(0,-(H-10),0),swayMat({roughness:.85},.0007));lm.position.y=H-10;g.add(lm)}
 // the lake at the bottom of the pit, and the river spilling over the rim on the north side and falling down the trunk side
 {const lk=new THREE.Mesh(new THREE.CircleGeometry(8.4,32),lakeMat);lk.rotation.x=-Math.PI/2;lk.position.y=H-10.2;g.add(lk);
  const fm=fxG_fallMat();const P=[[11,H+12.6],[18,H+13.2],[25,H+12.4],[31,H+8.6],[34,H+3.5]];const w=4.2;
  const strip=(pts,hw,v0)=>{const pos=[],uv=[],idx=[];let L=v0;pts.forEach(([x,y,z],i)=>{if(i)L+=Math.hypot(x-pts[i-1][0],y-pts[i-1][1],z-pts[i-1][2])/6;pos.push(x,y,z-hw,x,y,z+hw);uv.push(0,L,1,L);if(i){const a=(i-1)*2;idx.push(a,a+2,a+1,a+1,a+2,a+3)}});
   const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));sg.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));sg.setIndex(idx);return sg};
  const top=P.map(([r,y])=>[r,y+.4,0]);g.add(new THREE.Mesh(strip(top,w*.5,0),fm));
  const fall=[];for(let i=0;i<=14;i++){const t=i/14;fall.push([34.6+Math.sin(t*Math.PI)*2.5+t*1.5,H+3.5-t*(H+5),0])}const fl=new THREE.Mesh(strip(fall,w*.6,3),fm);fl.renderOrder=3;g.add(fl);
  const mist=glowSprite('#f4f8ff',26,.4);mist.position.set(37,4,0);g.add(mist);g.add(at(emitter({n:90,life:2.2,speed:2,spread:1,size:2.4,col:'#ffffff',op:.5,area:[6,1,6],grav:.5,wander:.6}),37,1.5,0));
  const pool=new THREE.Mesh(new THREE.CircleGeometry(7,24),lakeMat);pool.rotation.x=-Math.PI/2;pool.position.set(38,.4,0);g.add(pool)}
 // windows of the Inca hollows, lit at dusk, climbing the column
 {const lt=[];for(let i=0;i<60;i++){const a=Rn()*6.283,y=8+Rn()*(H-20);lt.push(V3(Math.cos(a)*12.6,y,Math.sin(a)*12.6))}g.add(sparkles(lt,'#ffcf80',2.6,1,.6))}
 // clouds round its middle
 {const cm=new THREE.SpriteMaterial({map:smokeTex,color:'#f4f6f8',transparent:true,opacity:.55,depthWrite:false});for(let i=0;i<22;i++){const a=i/22*6.283+Rn()*.3,r=24+Rn()*26;const s=new THREE.Sprite(cm);const sz=26+Rn()*22;s.scale.set(sz,sz*.42,1);s.position.set(Math.cos(a)*r,70+Rn()*40,Math.sin(a)*r);g.add(s)}}
 g.add(emitter({n:120,life:6,speed:.4,spread:1,size:1.2,dir:[0,1,0],col:'#f4ff9a',op:.85,area:[60,16,60],wander:2.5}));
 const [la,lo]=fxG_HT;fr(la,lo,-3,0,g);addE(g,[2,3]);cull(g,null,190,3200);
 // open ground round the foot: no grass tufts in a ring, the woods keep their distance
 {const d=dirLL(la,lo);(sp.entClr=sp.entClr||[]).push({d,deg:1.9,cs:Math.cos(1.9*D2R),eras:[2,3]})}
 px('hometree',g.position.clone().add(g.position.clone().normalize().multiplyScalar(80)),60,{maxD:3200})}

/* ---------- 熔岩裂谷, underground: in the dry rock land past the wall of death-spikes, a trench seventy-odd metres across
   whose floor is lava that set black long ago; lava spiders hang asleep on single threads down its walls; Lin's
   cone-shaped bases stand along its lip like rocks. the cave's home trees stand out here too, one by a waterfall,
   one by a hot spring ---------- */
function fxG_udTrench(z,a){if(z<2900||z>3260)return 0;const c=Math.cos(a);const fl=sm(.25,.7,c);if(fl<=0)return 0;const dz=Math.abs(z-(3080+a*40+Math.sin(a*3)*12));return fl*(1-sm(34,58,dz))}
function fxG_underRift(sp,sc,wp,upAt,Rt){const Rn=rnd(3081);
 // the crust: black plates of set lava, a little glossy, with cracks between them
 {const n=520,im=new THREE.InstancedMesh(new THREE.CylinderGeometry(1,1.15,.5,7),detailMat(new THREE.MeshStandardMaterial({color:'#17130f',roughness:.45,metalness:.25}),{bump:1.2}),n);const o=new THREE.Object3D();let k=0;
  for(let i=0;i<6000&&k<n;i++){const a=(Rn()-.5)*2.2,z=3080+a*40+(Rn()-.5)*80;if(fxG_udTrench(z,a)<.85)continue;o.position.copy(wp(z,a,-.1));o.quaternion.setFromUnitVectors(V3(0,1,0),upAt(a));o.rotateY(Rn()*6);const s=5+Rn()*9;o.scale.set(s,1,s*(.6+Rn()*.5));o.updateMatrix();im.setMatrixAt(k++,o.matrix)}
  im.count=k;im.frustumCulled=false;sc.add(im)}
 // lava spiders asleep by day, each on one thread let down from the trench lip
 {const spd=spiderGeo();const mat=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.5,emissive:'#5a1a08',emissiveIntensity:.35});const thr=[];const n=40,im=new THREE.InstancedMesh(spd,mat,n);const o=new THREE.Object3D();let k=0;
  for(let i=0;i<400&&k<n;i++){const a=(Rn()-.5)*1.8,s=Rn()<.5?-1:1;const zc=3080+a*40+Math.sin(a*3)*12,z=zc+s*(44+Rn()*8);if(fxG_udTrench(z,a)<.25||fxG_udTrench(z,a)>.8)continue;
   const top=wp(z,a,2),up=upAt(a);const L=14+Rn()*30;const bot=top.clone().addScaledVector(up,-L);thr.push(top,bot);o.position.copy(bot);o.quaternion.setFromUnitVectors(V3(0,1,0),up);o.rotateY(Rn()*6);o.scale.setScalar(3+Rn()*2);o.updateMatrix();im.setMatrixAt(k++,o.matrix)}
  im.count=k;im.frustumCulled=false;sc.add(im);sc.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(thr),new THREE.LineBasicMaterial({color:'#e8e0d0',transparent:true,opacity:.55})))}
 // Lin's bases: grey-brown stone cones along the lip
 {const n=30,im=new THREE.InstancedMesh(G([[kc(1,1,9).translate(0,.5,0),'#ffffff'],[kcy(1.05,1.15,.12,9),'#d0d0d0',{p:[0,.04,0]}]]),detailMat(VC({roughness:.9,flatShading:true}),{bump:.8}),n);const o=new THREE.Object3D();let k=0;
  for(let i=0;i<300&&k<n;i++){const a=(Rn()-.5)*1.9,s=Rn()<.5?-1:1;const z=3080+a*40+s*(66+Rn()*40);if(fxG_udTrench(z,a)>.05)continue;o.position.copy(wp(z,a,-3));o.quaternion.setFromUnitVectors(V3(0,1,0),upAt(a));o.rotateY(Rn()*6);const w=7+Rn()*6;o.scale.set(w,24+Rn()*30,w);o.updateMatrix();im.setMatrixAt(k++,o.matrix);im.setColorAt(k-1,C('#7e7468').offsetHSL(0,0,(Rn()-.5)*.15))}
  im.count=k;im.frustumCulled=false;sc.add(im)}
 // a waterfall pouring from the roof beside the second rock-zone tree, and a steaming hot spring beside the first
 {const z=2620,x=-60;const aB=-Math.asin(-x/Rt),aT=Math.PI+aB;const top=wp(z,aT,4),bot=wp(z,-aB,1);
  const fm=fxG_fallMat();const pos=[],uv=[],idx=[];const n=16;for(let i=0;i<=n;i++){const t=i/n;const p=top.clone().lerp(bot,t);p.x+=Math.sin(t*Math.PI)*12;const L=t*top.distanceTo(bot)/40;pos.push(p.x-9-t*6,p.y,p.z,p.x+9+t*6,p.y,p.z);uv.push(0,L,1,L);if(i<n){const k=i*2;idx.push(k,k+2,k+1,k+1,k+2,k+3)}}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);const m=new THREE.Mesh(g,fm);m.renderOrder=3;sc.add(m);
  const pl=new THREE.Mesh(new THREE.CircleGeometry(28,28),new THREE.MeshStandardMaterial({color:'#2f6a7a',roughness:.08,metalness:.3,transparent:true,opacity:.85}));pl.position.copy(wp(z,-aB,.6));pl.quaternion.setFromUnitVectors(V3(0,0,1),upAt(-aB));sc.add(pl);
  const sp2=emitter({n:120,life:3,speed:3,spread:1,size:8,col:'#e8f4f8',op:.35,add:false,tex:smokeTex,area:[30,4,30],wander:1});sp2.position.copy(wp(z,-aB,4));sc.add(sp2)}
 {const z=2200,a=-.55;const hs=new THREE.Mesh(new THREE.CircleGeometry(20,24),new THREE.MeshStandardMaterial({color:'#5ab0a8',roughness:.05,metalness:.2,emissive:'#2a6a64',emissiveIntensity:.25}));hs.position.copy(wp(z,a,.5));hs.quaternion.setFromUnitVectors(V3(0,0,1),upAt(a));sc.add(hs);
  const st=emitter({n:140,life:6,speed:3,spread:.4,size:14,dir:[0,1,0],col:'#f2f6f6',op:.3,add:false,tex:smokeTex,area:[26,2,26],wander:1.5});st.position.copy(wp(z,a,3));st.quaternion.setFromUnitVectors(V3(0,1,0),upAt(a));sc.add(st)}}

/* ---------- 创造者: its roots coil up into a tree that reaches for the sky, rising out of the wrecked emerald city;
   at the top the bark opens like a flower and in it lies the real brain, a writhing grey lump of flesh more than ten
   metres across (smooth and wet, not a folded pink brain) ---------- */
const fxG_CR=[12,-88,18,12];// city centre, then metres-ish north/east offsets of the tree in the city
function fxG_creatorTop(g,rm,y){const geo=new THREE.IcosahedronGeometry(1,4);const p=geo.attributes.position;for(let i=0;i<p.count;i++){const v=V3(p.getX(i),p.getY(i),p.getZ(i));const k=.82+n3(v.x*1.6+3,v.y*1.6,v.z*1.6)*.32+n3(v.x*4,v.y*4,v.z*4+2)*.08;v.multiplyScalar(k);v.y*=.78;p.setXYZ(i,v.x,v.y,v.z)}geo.computeVertexNormals();
 const br=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:'#8a8580',roughness:.32,metalness:.05,emissive:'#3a3836',emissiveIntensity:.12}));br.position.y=y+3;br.scale.setScalar(7);g.add(br);
 // six petal-like flaps of bark round it, opened out
 for(let k=0;k<6;k++){const a=k/6*6.283;const pg=new THREE.SphereGeometry(1,10,8,0,1.3,0,Math.PI/2);pg.translate(0,0,0);const pe=new THREE.Mesh(pg,rm);pe.scale.set(9,12,4);pe.position.set(Math.cos(a)*5,y-2,Math.sin(a)*5);pe.rotation.set(0,-a-.65,0,'YXZ');pe.rotateX(-.55);g.add(pe)}
 return br}
function fxG_creatorRuins(sp,la,lo){const Rn=rnd(6060),P=[];const stone=['#a8a090','#98907e','#b4ac9a'];
 for(let i=0;i<34;i++){const a=Rn()*6.283,d=14+Rn()*20,h=.6+Rn()*2.8;P.push([tg(new THREE.BoxGeometry(1.4+Rn()*2,h,1),{p:[Math.cos(a)*d,h/2-.3,Math.sin(a)*d],r:[(Rn()-.5)*.5,Rn()*3,(Rn()-.5)*.6]}),stone[i%3]])}
 for(let i=0;i<60;i++){const a=Rn()*6.283,d=10+Rn()*28,s=.4+Rn()*1.2;P.push([tg(lumpRock(s,i%4+1).clone(),{p:[Math.cos(a)*d,s*.2,Math.sin(a)*d]}),Rn()<.5?'#8a8274':'#a49a88'])}
 for(let i=0;i<5;i++){const a=Rn()*6.283,d=16+Rn()*16;P.push([tg(new THREE.SphereGeometry(1,10,8),{p:[Math.cos(a)*d,1,Math.sin(a)*d],s:[3.2,2,5],r:[1.2+Rn(),Rn()*3,0]}),'#6f7a60'])}
 const m=new THREE.Mesh(G(P),detailMat(VC({roughness:.95}),{bump:.8,freq:2}));fr(la,lo,0,0,m);addE(m,[3]);cull(m,null,50,1600)}

/* ---------- 山峰 in books one's war years: grey-black rock with hardly a plant, the land all round burnt black,
   charred stumps, a white poison fog lying low; the lake still sits in its top ---------- */
const fxG_SC={a:C('#2b2724'),b:C('#3d3833'),r:C('#4a4642'),w:C('#5a554e')};
function fxG_scorch(p,h,c,out){out.copy(c);if(h<.9)return;const a=angDeg(p,fxG_K().PK);if(a>6.2)return;const n=n3(p.x*55,p.y*55,p.z*55);
 const k=1-sm(4.6+n*.8,6.2,a);out.lerp(fxG_SC.a,k*.9).lerp(fxG_SC.b,k*n*.5);out.lerp(fxG_SC.r,(1-sm(2.8,4.4,a))*.75);if(h>110)out.lerp(fxG_SC.w,.4)}
function fxG_peak(sp){const pts=scatter(220,36,15,5.6,3601,(la,lo,h)=>h>3&&h<90&&angDeg(dirLL(la,lo),dirLL(36.6,14.2))>2);
 inst(geoC('dead'),VC({roughness:.95}),pts,(o,p)=>{frameLL(sp,p[0],p[1],-.4,p[3]*6,o);o.scale.setScalar(.5+p[3]*.6);o.rotateZ((p[3]-.5)*.5)},[2,3],{tint:p=>C(p[3]>.5?'#1e1a18':'#2e2824'),far:1500});
 fogBank(36,15,5.4,70,4,'#f2f4f0',.5,3602,[2,3],60)}

/* ---------- 银之城: not one tree in it; giant succulents along the land-ship avenue, olive-shaped ones taller than fifty
   metres and set with spines; the gate is a row of silver bars, six metres high and over twenty wide, that sinks into the
   ground to let ships through; wheels and gears turn on the buildings ---------- */
function fxG_silver(sp){const E=[5,6,7,8,9,10,11,12];const Rn=rnd(5656);
 // olive succulents: a swollen spindle of green flesh with rows of pale spines
 {const P=[[tg(new THREE.SphereGeometry(1,16,12),{s:[1,2.2,1]}),'#6f9a64',{p:[0,2.2,0]}]];for(let r=0;r<9;r++){const y=.6+r*.45,rr=Math.sin(Math.acos(Math.min(1,Math.abs(y-2.2)/2.2)))*1.02;for(let k=0;k<10;k++){const a=k/10*6.283+r*.31;P.push([kc(.05,.3,4).translate(0,.15,0),'#e8e2c8',{p:[Math.cos(a)*rr,y,Math.sin(a)*rr],r:[0,-a,-Math.PI/2+.35]}])}}
  for(let k=0;k<8;k++){const a=k/8*6.283;P.push([tg(new THREE.SphereGeometry(1,8,10),{s:[.08,2.15,.08]}),'#5a8452',{p:[Math.cos(a)*.98,2.2,Math.sin(a)*.98]}])}
  const pts=[];for(let i=0;i<10;i++){const t=(i+.5)/10;pts.push([-4+t*2.2+(i%2?.24:-.24),54+t*2.8,0,Rn()])}
  inst(G(P),VC({roughness:.7}),pts,(o,p)=>{frameLL(sp,p[0],p[1],-.3,p[3]*6,o);o.scale.setScalar(3.6+p[3]*1.8)},E,{far:1800})}
 // the gate of bars across the avenue's mouth, rising and sinking
 {const g=new THREE.Group();const bm=M('#d8e0e6',{metalness:.9,roughness:.2});const bars=new THREE.Group();for(let i=0;i<15;i++){const b=new THREE.Mesh(kcy(.16,.16,4.4,8),bm);b.position.set(-7+i,2.2,0);bars.add(b)}
  const tb=new THREE.Mesh(kb(15,.3,.3),bm);tb.position.y=4.3;bars.add(tb);g.add(bars);const sill=new THREE.Mesh(kb(15.6,.25,1.2),M('#7a848c',{metalness:.6,roughness:.4}));sill.position.y=.1;g.add(sill);
  for(const x of[-8.2,8.2]){const p=new THREE.Mesh(kb(1.2,5.4,1.2),M('#aab4bc',{metalness:.7,roughness:.3}));p.position.set(x,2.7,0);g.add(p)}
  const [la,lo]=[-4.05,53.9];frameLL(sp,la,lo,-.1,Math.atan2(2.8,2.2)+Math.PI/2,g);addE(g,E);cull(g,null,20,1400);
  anim(sp,g,t=>{const k=sm(.25,.75,Math.sin(t*.12)*.5+.5);bars.position.y=-4.5*k})}
 // gears and wheels turning on the bigger buildings
 {const gm=new THREE.MeshStandardMaterial({color:'#9aa4ac',metalness:.85,roughness:.3});const gg=G(gear(1,.14));const L=[];
  for(let i=0;i<9;i++){const a=Rn()*6.283,d=.3+Rn()*1.6;const la=-4+Math.cos(a)*d,lo=56+Math.sin(a)*d;if(sp.gh(la,lo)<2)continue;const o=new THREE.Group();frameLL(sp,la,lo,2.6+Rn()*2,Rn()*6,o);const m=new THREE.Mesh(gg,gm);m.scale.setScalar(.9+Rn()*.8);o.add(m);addE(o,E);cull(o,null,6,900);L.push({m,w:(Rn()<.5?-1:1)*(.4+Rn()*.6)})}
  anim(sp,null,t=>{if(CUR!==sp)return;for(const x of L)x.m.rotation.z=t*x.w})}}

/* ---------- the academy: alloy halls joined by covered alloy corridors, an alloy gate at the front ---------- */
function fxG_acadLinks(P,B,DK,GLc){const W='#ffffff';
 for(const [x,z,w,h,d] of B){const L=Math.hypot(x,z)-3.1-Math.max(w,d)*.45;if(L<.6)continue;const a=Math.atan2(z,x);const m=3.1+L/2;
  P.push([kb(L,1.3,1.1),W,{p:[Math.cos(a)*m,1.0,Math.sin(a)*m],r:[0,-a,0]}],[kb(L+.02,.35,1.14),GLc,{p:[Math.cos(a)*m,1.2,Math.sin(a)*m],r:[0,-a,0]}],[kb(L+.1,.12,1.3),DK,{p:[Math.cos(a)*m,1.72,Math.sin(a)*m],r:[0,-a,0]}])}
 // the gate: two alloy piers and a lintel where the path from the rails comes in
 P.push([kb(.8,3.6,.8),W,{p:[-1.8,1.8,9.6]}],[kb(.8,3.6,.8),W,{p:[1.8,1.8,9.6]}],[kb(4.6,.6,.9),DK,{p:[0,3.8,9.6]}],[kb(2.8,2.6,.08),'#9aa4ac',{p:[0,1.3,9.6]}])}
/* the great peak: steep cold rock, and a path cut into it winding to the top */
function fxG_peakPath(sp){const pts=[];const c=[-6,73];for(let i=0;i<=160;i++){const t=i/160,an=t*13,dd=3.4*(1-t)+.12;const la=c[0]+Math.cos(an)*dd,lo=c[1]+Math.sin(an)*dd/Math.cos(6*D2R);pts.push(dirLL(la,lo).multiplyScalar(R+sp.gh(la,lo)+.5))}
 const cv=new THREE.CatmullRomCurve3(pts);const tb=new THREE.Mesh(new THREE.TubeGeometry(cv,480,.55,4,false),M('#b8ae9c',{roughness:.95}));tb.scale.set(1,1,1);addE(tb,[2,3,4,5,6,7,8,9,10,11,12]);cull(tb,pts[40],90,2200)}

/* ---------- 鸣石空艇: not an airship but one rough boulder more than two hundred metres long, holes all through it;
   the holes at the back and underneath glow bright red where the 爆甲 thrust comes out ---------- */
function fxG_airRock(g){const geo=new THREE.IcosahedronGeometry(1,4);const p=geo.attributes.position;const v=V3();
 for(let i=0;i<p.count;i++){v.set(p.getX(i),p.getY(i),p.getZ(i));const k=.8+n3(v.x*1.7+2,v.y*1.7,v.z*1.7)*.36+n3(v.x*5,v.y*5,v.z*5+1)*.1;v.multiplyScalar(k);v.x*=15;v.y*=4.2;v.z*=5.4;p.setXYZ(i,v.x,v.y,v.z)}geo.computeVertexNormals();
 g.add(new THREE.Mesh(geo,detailMat(new THREE.MeshStandardMaterial({color:'#8f8068',roughness:.95,flatShading:true}),{bump:1.1,freq:2})));
 const dark=M('#120c08'),hot=GL('#ff4a20',.95);const Rn=rnd(3363);const tmp=new THREE.Raycaster();const m0=g.children[0];m0.updateMatrixWorld();
 for(let i=0;i<46;i++){const a=Rn()*6.283,x=(Rn()*2-1)*13;const dir=V3(0,Math.cos(a),Math.sin(a));tmp.set(V3(x,0,0).addScaledVector(dir,12),dir.clone().negate());const hit=tmp.intersectObject(m0)[0];if(!hit)continue;
  const glow=x<-7||Math.cos(a)<-.55;const s=.55+Rn()*.9;const h=new THREE.Mesh(new THREE.CircleGeometry(s,10),glow?hot:dark);h.position.copy(hit.point).addScaledVector(dir,.06);h.lookAt(hit.point.clone().add(dir));g.add(h);
  if(glow&&Rn()<.5){const sp2=glowSprite('#ff6a30',s*5,.6);sp2.position.copy(h.position).addScaledVector(dir,.6);g.add(sp2)}}
 for(let i=0;i<4;i++){const h=new THREE.Mesh(new THREE.CircleGeometry(1.4,12),hot);h.position.set(-14.6,(i%2-.5)*2,(i>1?1:-1)*1.6);h.rotation.y=-Math.PI/2;g.add(h);g.add(at(glowSprite('#ff5a20',9,.7),-15.6,(i%2-.5)*2,(i>1?1:-1)*1.6))}}

/* ---------- 海底基地 · 繁殖舱: Lin's first base, a living thing sitting on a big rock ---------- */
function fxG_seaBase(g){const rock=detailMat(new THREE.MeshStandardMaterial({color:'#5e5a50',roughness:.95,flatShading:true}),{bump:1.2,freq:2});
 const ped=new THREE.Mesh(lumpRock(1,6),rock);ped.scale.set(9,3.2,8);ped.position.y=1.2;g.add(ped);const top=3.6;
 const arm=M('#4e5a52',{roughness:.45,metalness:.2}),skin=M('#6a8a6a',{roughness:.5}),needle=M('#c8c8b0',{roughness:.4}),sac=new THREE.MeshStandardMaterial({color:'#b8c890',roughness:.35,emissive:'#4a5a30',emissiveIntensity:.15});
 const shields=[];for(let i=0;i<12;i++){const a=i/12*6.283;const t=new THREE.Group();const pts=[V3(0,0,0),V3(1.4,1.2,0),V3(2.2,3,0),V3(1.6,4.6,0),V3(.4,5.2,0)];const tb=tubeAlong(pts,.32,skin,14);tb.scale.z=2.2;t.add(tb);
  for(let k=0;k<4;k++){const pl=new THREE.Mesh(new THREE.SphereGeometry(.9,8,6,0,6.283,0,1.2),arm);const q=new THREE.CatmullRomCurve3(pts).getPoint(.15+k*.22);pl.position.copy(q).add(V3(.25,0,0));pl.scale.set(.5,.8,1.1);pl.rotation.z=-1.2+k*.5;t.add(pl)}
  t.position.set(Math.cos(a)*6.2,top-.4,Math.sin(a)*6.2);t.rotation.y=-a+Math.PI;g.add(t);shields.push(t)}
 const nd=[];for(let i=0;i<18;i++){const a=i/18*6.283+.17;const n=new THREE.Mesh(new THREE.ConeGeometry(.12,3.2+(i%3)*.6,5),needle);n.position.set(Math.cos(a)*4.4,top+1.4,Math.sin(a)*4.4);n.rotation.set(Math.sin(a)*-.25,0,Math.cos(a)*.25);g.add(n);nd.push(n)}
 for(let i=0;i<7;i++){const a=i/7*6.283+.4;const s=new THREE.Mesh(sgeo(12),sac);s.scale.set(.9,1.3,.9);s.position.set(Math.cos(a)*2.9,top+1,Math.sin(a)*2.9);g.add(s)}
 const core=new THREE.Group();const sph0=new THREE.Mesh(sgeo(18),skin);sph0.scale.setScalar(2.1);core.add(sph0);
 for(let i=0;i<22;i++){const v=V3(h3(i,1,8)-.5,h3(i,2,8)*.8-.1,h3(i,3,8)-.5).normalize();const pl=new THREE.Mesh(new THREE.SphereGeometry(1,8,6,0,6.283,0,.9),arm);pl.position.copy(v).multiplyScalar(1.95);pl.lookAt(v.clone().multiplyScalar(5));pl.rotateX(Math.PI/2);pl.scale.set(.9,.4,.9);core.add(pl)}
 const big=[];for(let i=0;i<5;i++){const a=i/5*6.283;const t=new THREE.Group();t.add(tubeAlong([V3(0,0,0),V3(1.6,1.6,0),V3(3.6,2.4,0),V3(5.6,1.6,0),V3(6.8,.2,0)],.36,skin,18));t.position.set(Math.cos(a)*1.4,.6,Math.sin(a)*1.4);t.rotation.y=-a;core.add(t);big.push(t)}
 core.position.y=top+2.2;g.add(core);
 return t=>{shields.forEach((x,i)=>x.rotation.z=Math.sin(t*.6+i)*.06);big.forEach((x,i)=>{x.rotation.z=Math.sin(t*.8+i*1.3)*.18});core.scale.setScalar(1+Math.sin(t*1.2)*.03)}}

/* ---------- small bodies from the misc list ---------- */
/* 航母: grey hardened skin over a long body; two great muscular tentacles, one from each flank, each ending in a hard
   round head set with saw teeth (the hammers), swung forward; two flat swimming tentacles; a big water jet at the back;
   small eye-stalks at the front; the devourers it carries swimming round it */
function fxG_carrier(){const g=new THREE.Group();const skin=M('#7a7a74',{roughness:.5}),dark=M('#5a5a56',{roughness:.45}),tooth=M('#e8e2cc',{roughness:.3});
 const b=sph(0,2.7,1.05,1.3,24,skin);b.position.y=.6;g.add(b);const belly=sph(0,2.4,.75,1.12,18,M('#9a9890',{roughness:.6}));belly.position.y=.38;g.add(belly);
 for(let i=0;i<8;i++){const h=new THREE.Mesh(new THREE.CircleGeometry(.16,10),M('#2a2a28'));const a=-.8+i*.23;h.position.set(-1+i*.32,.6+Math.sin(a+1.5)*1.0,Math.cos(a+1.5)*1.22);h.lookAt(h.position.clone().multiplyScalar(2).setY(h.position.y*2-.6));g.add(h)}
 const stalks=[];for(const z of[-1,1]){const st=new THREE.Group();st.add(tubeAlong([V3(0,0,0),V3(.4,.45,z*.2),V3(.8,.7,z*.35)],.07,skin,10));const e=sph(0,.16,.16,.16,12,M('#f4f0e0',{roughness:.2}));e.position.set(.84,.72,z*.36);st.add(e);const pu=eye(.08);pu.position.set(.98,.74,z*.38);st.add(pu);st.position.set(2.4,.85,z*.35);g.add(st);stalks.push(st)}
 const arms=[];for(const z of[-1,1]){const a=new THREE.Group();a.add(tubeAlong([V3(0,0,0),V3(.6,.5,z*.5),V3(1.6,.9,z*.6),V3(2.7,.8,z*.4)],.2,skin,16));
  const hd=sph(0,.42,.42,.42,14,dark);hd.position.set(2.95,.8,z*.38);a.add(hd);for(let k=0;k<14;k++){const v=V3(h3(k,1,z+3)-.3,h3(k,2,z+3)-.5,h3(k,3,z+3)-.5).normalize();const t=cone(.05,.22,tooth,4);t.position.copy(hd.position).addScaledVector(v,.42);t.quaternion.setFromUnitVectors(V3(0,1,0),v);a.add(t)}
  a.position.set(1.1,.7,z*1.05);g.add(a);arms.push({a,z})}
 const fins=[];for(const z of[-1,1]){const f=new THREE.Mesh(new THREE.SphereGeometry(1,12,6),M('#6e6e68',{roughness:.5}));f.scale.set(1.3,.07,.55);const p=new THREE.Group();p.add(f);f.position.z=z*.6;p.position.set(-.5,.25,z*1.15);g.add(p);fins.push({p,z})}
 const jet=cyl(.36,.5,.6,dark,12);jet.rotation.z=Math.PI/2;jet.position.set(-2.8,.55,0);g.add(jet);g.add(at(emitter({n:50,life:1.6,speed:1.8,spread:.2,size:.6,dir:[-1,0,0],col:'#e8f8ff',op:.5,area:[.2,.3,.3]}),-3.2,.55,0));
 const dv=[];for(let i=0;i<5;i++){const d=bDevourerOne(.18+i*.04);g.add(d);dv.push({d,a:i*1.25})}
 g.userData.anim=t=>{arms.forEach(x=>{const k=Math.max(0,Math.sin(t*.8+(x.z>0?0:1.7)));x.a.rotation.y=-x.z*(.15+k*.25);x.a.rotation.z=.15-k*.35});fins.forEach(x=>x.p.rotation.x=x.z*Math.sin(t*2.2)*.35);
  stalks.forEach((s,i)=>s.rotation.y=Math.sin(t*.9+i)*.2);dv.forEach((x,i)=>{const a=x.a+t*.5;x.d.position.set(Math.cos(a)*3.8,.6+Math.sin(t+i)*.6,Math.sin(a)*2.8);x.d.rotation.y=-a-Math.PI/2;x.d.userData.anim(t+i)})};return g}
/* 绿毯伞 · 播种者: the umbrella carpets on their long stalks, and the sower, a small dragonfly-like flyer with the carpet seed
   in its tail, darting among them; where it has just set one down, a new seedling */
function fxG_umbrellas(){const g=new THREE.Group();for(let i=0;i<7;i++){const u=new THREE.Group();const h=1+h3(i,1,5)*1.4;const st=cyl(.04,.06,h,M('#5a7a3a'),6);st.position.y=h/2;u.add(st);const cap=new THREE.Mesh(new THREE.SphereGeometry(.7,16,6,0,6.283,0,1.1),M('#4aa84a',{roughness:.6,emissive:'#1a5a1a',emissiveIntensity:.25,side:THREE.DoubleSide}));cap.scale.y=.35;cap.position.y=h;u.add(cap);
  const a=h3(i,2,5)*6.28,r=Math.sqrt(h3(i,3,5))*2.6;u.position.set(Math.cos(a)*r,0,Math.sin(a)*r);g.add(u)}
 {const s=new THREE.Group();const st=cyl(.02,.03,.3,M('#5a7a3a'),5);st.position.y=.15;s.add(st);const c=new THREE.Mesh(new THREE.SphereGeometry(.18,10,4,0,6.283,0,1.1),M('#5ab85a',{roughness:.6,side:THREE.DoubleSide}));c.scale.y=.4;c.position.y=.3;s.add(c);s.position.set(1.9,0,1.3);g.add(s)}
 const fly=bDragonfly({w:'x',col:'#4a7a5a'});fly.scale.setScalar(.55);g.add(fly);const seed=sph(0,.1,.1,.16,8,M('#7ac85a',{roughness:.4}));g.add(seed);
 g.userData.anim=t=>{const a=t*.7;fly.position.set(Math.cos(a)*1.9,1.5+Math.sin(t*1.7)*.4,Math.sin(a*1.3)*1.6);fly.rotation.y=-a-Math.PI/2;fly.userData.anim&&fly.userData.anim(t);seed.position.copy(fly.position).add(V3(0,-.12,0))};return g}
/* 智草: a dense lawn of fine WHITE grass on an underground floor, among dark dead roots of the creator; a blade touched
   pulls back into the ground (one patch ducks down now and then) */
function fxG_smartGrass(){const g=new THREE.Group();const root=M('#5b4a3a',{roughness:.9});
 for(let i=0;i<5;i++){const x=-3+i*1.5;g.add(tubeAlong([V3(x,-.2,-1.6),V3(x+.3,.6,-.8),V3(x-.2,1,.2),V3(x+.2,.5,1.2),V3(x,-.2,1.8)],.12+(i%2)*.05,root,14))}
 g.add(tubeAlong([V3(-3.8,.3,0),V3(-1,.5,.3),V3(1.4,.35,-.2),V3(3.8,.2,0)],.2,root,16));
 const gm=swayMat({emissive:'#a8a49a',emissiveIntensity:.12},.05);const blades=G(Array.from({length:9},(_,i)=>{const b=new THREE.ConeGeometry(.035,.95,3,1);b.translate(0,.47,0);return[b,i%2?'#f2eee4':'#e6e0d2',{p:[(h3(i,1,2)-.5)*.3,0,(h3(i,2,2)-.5)*.3],r:[(i-4)*.08,i,0]}]}));
 const im=new THREE.InstancedMesh(blades,gm,420);const o=new THREE.Object3D();const duck=[];for(let i=0;i<420;i++){const x=(h3(i,3,8)-.5)*7.4,z=(h3(i,4,8)-.5)*3.6;o.position.set(x,0,z);o.rotation.y=i;o.scale.setScalar(.9+h3(i,5,8)*.5);o.updateMatrix();im.setMatrixAt(i,o.matrix);if(Math.hypot(x-1.6,z-.4)<.8)duck.push([i,o.matrix.clone(),o.scale.x])}
 g.add(im);const m4=new THREE.Matrix4(),sc=V3(),q=new THREE.Quaternion(),ps=V3();
 g.userData.anim=t=>{const k=Math.max(0,Math.sin(t*.7))**4;for(const [i,m,s] of duck){m.decompose(ps,q,sc);sc.set(s,s*(1-.85*k),s);m4.compose(ps,q,sc);im.setMatrixAt(i,m4)}im.instanceMatrix.needsUpdate=true};return g}
/* 露西: a station shaped like an 尔什民's head, a lumpy mass of rock; its cities lie inside great hollows in it, rocky
   caves with the buried ruins of earlier dwellers; a few openings show the city lights within */
function fxG_lucy(){const g=new THREE.Group();const geo=new THREE.IcosahedronGeometry(1,4);const p=geo.attributes.position;const v=V3();
 for(let i=0;i<p.count;i++){v.set(p.getX(i),p.getY(i),p.getZ(i));let k=1+(n3(v.x*1.8+1,v.y*1.8,v.z*1.8)-.5)*.32;if(v.x>.55&&Math.abs(v.y)<.35)k+=.12*(1-Math.abs(v.y)/.35);if(v.y<-.4)k*=.9;v.multiplyScalar(k);v.x*=1.15;v.y*=1.2;p.setXYZ(i,v.x*3,v.y*3,v.z*3)}geo.computeVertexNormals();
 g.add(new THREE.Mesh(geo,detailMat(new THREE.MeshStandardMaterial({color:'#7a7268',roughness:.95,flatShading:true}),{bump:1.2,freq:2})));
 const tm=towerMat({metalness:.4,roughness:.4,win:'#ffe8b0'});const holes=[[.4,.5,.75],[-.3,.1,.95],[.6,-.35,.7]];
 for(const [x,y,z] of holes){const d=V3(x,y,z).normalize();const c=d.clone().multiplyScalar(3.05);const mouth=new THREE.Mesh(new THREE.CircleGeometry(.75,16),new THREE.MeshBasicMaterial({color:'#1a1410'}));mouth.position.copy(c);mouth.lookAt(c.clone().multiplyScalar(2));g.add(mouth);
  const city=new THREE.Group();for(let j=0;j<7;j++){const bl=new THREE.Mesh(mergeColored([[new THREE.BoxGeometry(.14,1,.14).translate(0,.5,0),'#c8d0d8']]),tm);bl.scale.y=.25+h3(j,x*9,2)*.5;bl.position.set((h3(j,1,x*7)-.5)*.9,-.45,(h3(j,2,y*7)-.5)*.5);city.add(bl)}
  city.position.copy(d.clone().multiplyScalar(2.95));city.lookAt(d.clone().multiplyScalar(6));city.rotateX(Math.PI/2);g.add(city);const gl=glowSprite('#ffd890',1.6,.7);gl.position.copy(d.clone().multiplyScalar(3.1));g.add(gl)}
 g.userData.towerMat=tm;g.userData.anim=t=>{g.rotation.y=t*.02};return g}
/* 气蚁: over a metre long; the front half a long sharp spear on a few legs, the back half swollen like a balloon */
function fxG_airAnts(){const g=new THREE.Group();const vent=new THREE.Mesh(new THREE.TorusGeometry(1.2,.35,8,24),detailMat(M('#6a5a4a',{roughness:.95,flatShading:true}).clone(),{bump:1}));vent.rotation.x=Math.PI/2;g.add(vent);const hole=new THREE.Mesh(new THREE.CircleGeometry(1.15,24),GL('#9affd8',.5));hole.rotation.x=-Math.PI/2;hole.position.y=.05;g.add(hole);
 g.add(at(emitter({n:80,life:3,speed:2,spread:.3,size:1.2,dir:[0,1,0],col:'#c8ffe8',op:.35,tex:smokeTex,area:[1.6,.2,1.6]}),0,.2,0));const sh=M('#3a3a34',{roughness:.35,metalness:.2});const as=[];
 for(let i=0;i<7;i++){const a=new THREE.Group();const sp2=cone(.075,1.25,sh,6);sp2.rotation.z=-Math.PI/2;sp2.position.set(.78,.26,0);a.add(sp2);const nk=sph(0,.12,.08,.08,8,sh);nk.position.set(.12,.24,0);a.add(nk);
  const bal=sph(0,.36,.32,.32,14,new THREE.MeshStandardMaterial({color:'#e8d8b8',transparent:true,opacity:.78,roughness:.2}));bal.position.set(-.38,.42,0);a.add(bal);
  for(let k=0;k<4;k++){const l=limb(.24,.014,.01,sh);l.position.set(.05+(k%2)*.22,.2,(k<2?-1:1)*.05);l.rotation.x=(k<2?-1:1)*.8;a.add(l)}
  const an=i/7*6.28;a.position.set(Math.cos(an)*2.3,0,Math.sin(an)*2.3);a.rotation.y=-an;g.add(a);as.push({a,bal})}
 g.userData.anim=t=>as.forEach((x,i)=>x.bal.scale.setScalar(1+Math.sin(t*.7+i)*.06));return g}
/* 恒古之泥: the relic is just an irregular stone the size of the other model-sand grains, carried on the body of one red
   slime among a crowd of red slimes, on the white sand of the model-sand sea */
function fxG_ancientMud(){const g=new THREE.Group();const sand=new THREE.Mesh(new THREE.CircleGeometry(3.4,32),M('#f0ece2',{roughness:1}));sand.rotation.x=-Math.PI/2;sand.position.y=.01;g.add(sand);
 const rs=[];for(let i=0;i<9;i++){const r=bAmoeba({col:'#c83a2a',op:.75,dot:'#5a0a0a'});r.scale.setScalar(i?.32:.4);g.add(r);rs.push({r,a:i/8*6.28,d:i?1.6+(i%3)*.4:0})}
 const st=new THREE.Mesh(lumpRock(.16,3),M('#7a6e60',{roughness:.9,flatShading:true}));g.add(st);
 g.userData.anim=t=>{rs.forEach((x,i)=>{x.r.position.set(Math.cos(x.a+t*.05)*x.d,Math.abs(Math.sin(t*2+i))*.12,Math.sin(x.a+t*.05)*x.d);x.r.userData.anim(t+i)});st.position.set(0,.62+Math.abs(Math.sin(t*2))*.12,0)};return g}
/* 彩色舰长: bursting out of a one-metre bee, a brilliantly many-coloured slug that crawls fast along the ground,
   sucking in the stunned bees and growing as it goes; the rings are its signal to stop */
function fxG_rainbowSlug(){const g=new THREE.Group();const geo=new THREE.SphereGeometry(1,28,14);const p=geo.attributes.position,cs=[];const c=new THREE.Color();
 for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);const tx=(x+1)/2;let yy=y*.42;if(yy<-.12)yy=-.12+(yy+.12)*.25;const w=.5+.5*Math.sin(Math.PI*Math.pow(tx,.8));p.setXYZ(i,x*1.8,yy*w+.3,z*.5*w);c.setHSL(((x*1.6+y*.3)+10)%1,.85,.58);cs.push(c.r,c.g,c.b)}
 geo.setAttribute('color',new THREE.Float32BufferAttribute(cs,3));geo.computeVertexNormals();const body=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.25,metalness:.1,emissive:'#3a2a5a',emissiveIntensity:.25}));g.add(body);
 for(const z of[-1,1]){const st=tubeAlong([V3(1.6,.4,z*.08),V3(1.85,.75,z*.16)],.03,M('#ff8ad8'),6);g.add(st);const k=glowEye(.05,'#fff4c0');k.position.set(1.86,.77,z*.16);g.add(k)}
 // the burst bee it came out of
 {const hk=new THREE.Group();const sh=M('#3a3020',{roughness:.6,side:THREE.DoubleSide});for(let k=0;k<3;k++){const s=new THREE.Mesh(new THREE.SphereGeometry(.45,10,6,k*2.1,1.5,0,1.8),sh);s.position.y=.4;hk.add(s)}const w=new THREE.Mesh(new THREE.PlaneGeometry(.7,.3),M('#d8e8f0',{transparent:true,opacity:.5,side:THREE.DoubleSide}));w.position.set(.2,.7,.3);w.rotation.x=-.6;hk.add(w);hk.position.set(-3,0,.4);g.add(hk)}
 const rings=[];for(let i=0;i<4;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(1.2,.04,4,40),GL(['#ff7ab8','#ffd25a','#7affb8','#7ab8ff'][i],.6));r.position.set(0,1.2,0);g.add(r);rings.push(r)}
 g.add(shadow(1.4));g.userData.anim=t=>{body.scale.set(1+Math.sin(t*3)*.04,1-Math.sin(t*3)*.03,1);body.material.emissiveIntensity=.2+Math.sin(t*.7)*.08;rings.forEach((r,i)=>{const q=(t*.3+i/4)%1;r.scale.setScalar(.8+q*3);r.material.opacity=.6*(1-q);r.rotation.x=Math.PI/2+i*.3})};return g}
/* 换脑鱼: the two brains are inside the skull; outside there is only a slightly wide, double-domed head in the skin's colour */
function fxG_merfolk(){const g=new THREE.Group();const fs=[];for(let i=0;i<3;i++){const f=new THREE.Group();const sk=M(['#6a9aa8','#7a8ab8','#5a9a8a'][i],{roughness:.4});
  const tail=tubeAlong([V3(0,1.2,0),V3(-.4,.5,0),V3(-1.2,.15,0),V3(-2.2,.1,0)],.22,sk,16);f.add(tail);const fin=new THREE.Mesh(wingGeo(.6,.6,'fin').rotateX(-Math.PI/2),sk);fin.position.set(-2.3,.15,0);f.add(fin);
  const tor=sph(0,.3,.55,.28,12,sk);tor.position.y=1.6;f.add(tor);{const hd=sph(0,.29,.3,.34,14,sk);hd.position.y=2.4;f.add(hd)}for(const z of[-1,1]){const dm=sph(0,.22,.2,.2,12,sk);dm.position.set(-.03,2.55,z*.12);f.add(dm);const e=eye(.05);e.position.set(.26,2.4,z*.13);f.add(e);const a=leg2(.4,.35,.05,sk,-.6);a.position.set(.05,1.95,z*.32);f.add(a)}
  f.position.set((i-1)*1.8,0,Math.sin(i*2)*.8);f.rotation.y=i-1;g.add(f);fs.push({f,tail})}g.add(shadow(2.4));g.userData.anim=t=>fs.forEach((x,i)=>{x.tail.rotation.y=Math.sin(t*1.5+i)*.12;x.f.position.y=Math.abs(Math.sin(t*.8+i))*.08});return g}
Object.assign(ENT,{hangmu:[fxG_carrier,1.4,{alt:.4}],lvtanshan:[fxG_umbrellas,1.3],zhicao:[fxG_smartGrass,1.1,{isle:1}],luxi:[fxG_lucy,1.6],qiyi:[fxG_airAnts,1,{isle:1}],henggu:[fxG_ancientMud,1,{isle:1}],caise:[fxG_rainbowSlug,1.1],huannaoyu:[fxG_merfolk,1,{isle:1}]});
// 护卫者 is the revived 圆盾蠕虫: the same body as the rebuilt one (its own pincer-tipped limbs under the dome head)
if(typeof fxC_yuandun==='function')ENT.huweizhe=[fxC_yuandun,1.2];

/* ---------- 深海之城 (虚民): the city lives inside transparent tubes on the deep sea floor, walls of pressure glass, with
   traffic running through them and the buildings standing inside ---------- */
function fxG_tubeNet(g,nodes,links,R0,o){o=o||{};const glass=new THREE.MeshStandardMaterial({color:'#bfe8f4',transparent:true,opacity:.3,roughness:.05,metalness:.3,depthWrite:false,side:THREE.DoubleSide});
 const rib=M('#8a9aa4',{metalness:.7,roughness:.3});const tm=towerMat({metalness:.4,roughness:.35,win:'#ffe8b0'});const cars=[];const Y=V3(0,1,0);
 for(const [a,b] of links){const A=nodes[a],B=nodes[b];const d=B.clone().sub(A),L=d.length();const t=new THREE.Mesh(new THREE.CylinderGeometry(R0,R0,L,16,1,true),glass);t.position.copy(A).addScaledVector(d,.5);t.quaternion.setFromUnitVectors(Y,d.clone().normalize());t.renderOrder=2;g.add(t);
  for(let k=1;k<L/(R0*2.4);k++){const r=new THREE.Mesh(new THREE.TorusGeometry(R0*1.02,R0*.06,4,16),rib);r.position.copy(A).addScaledVector(d,k*R0*2.4/L);r.quaternion.setFromUnitVectors(V3(0,0,1),d.clone().normalize());g.add(r)}
  for(let k=0;k<2;k++){const c=new THREE.Mesh(new THREE.SphereGeometry(R0*.28,8,6),GL(k?'#ffd890':'#9ad8ff',.95));c.scale.set(1,.6,1);g.add(c);cars.push({c,A,B,ph:Math.random(),s:(k?1:-1)*(.08+Math.random()*.06)})}}
 for(let i=0;i<nodes.length;i++){const N=nodes[i];const s=R0*(o.hub||2.6);const d=new THREE.Mesh(new THREE.SphereGeometry(s,20,12),glass);d.position.copy(N);d.renderOrder=2;g.add(d);
  for(let j=0;j<6;j++){const b=new THREE.Mesh(mergeColored([[new THREE.BoxGeometry(1,1,1).translate(0,.5,0),'#c8d0d8']]),tm);const a=j/6*6.283+i;b.scale.set(s*.22,s*(.4+h3(i,j,3)*.9),s*.22);b.position.set(N.x+Math.cos(a)*s*.45,N.y-s*.55,N.z+Math.sin(a)*s*.45);g.add(b)}
  const fl=new THREE.Mesh(new THREE.CircleGeometry(s*.86,20),M('#5a6268'));fl.rotation.x=-Math.PI/2;fl.position.set(N.x,N.y-s*.55,N.z);g.add(fl)}
 g.userData.towerMat=tm;return t=>cars.forEach(x=>{const u=((x.ph+t*x.s)%1+1)%1;x.c.position.copy(x.A).lerp(x.B,u)})}
function fxG_deepCity(){const g=new THREE.Group();const N=[V3(0,1.4,0),V3(3.4,1.2,1.2),V3(-3,1.3,1.8),V3(.6,1.2,-3.4),V3(-2.6,1.4,-2.6),V3(3.6,1.6,-2.4)];
 const an=fxG_tubeNet(g,N,[[0,1],[0,2],[0,3],[0,4],[3,5],[1,5],[2,4]],.32,{hub:2.6}); g.userData.anim=an;return g}
function fxG_deepNet(sp){const g=new THREE.Group();const C0=[2,152];const N=[],L=[];const Rn=rnd(3210);const up=dirLL(...C0);
 for(let i=0;i<14;i++){const a=Rn()*6.283,d=i?.4+Rn()*2:0;const la=C0[0]+Math.cos(a)*d,lo=C0[1]+Math.sin(a)*d;const h=sp.ghRaw(la,lo);N.push(dirLL(la,lo).multiplyScalar(R+h+3.2))}
 for(let i=1;i<N.length;i++){let best=0,bd=1e9;for(let j=0;j<i;j++){const dd=N[i].distanceTo(N[j]);if(dd<bd){bd=dd;best=j}}L.push([i,best])}L.push([3,9],[5,12]);
 const an=fxG_tubeNet(g,N,L,1.1,{hub:3.2});addE(g,[7]);cull(g,up.clone().multiplyScalar(R-20),70,1800);anim(sp,g,an);if(g.userData.towerMat)sp.towerMats=(sp.towerMats||[]).concat([g.userData.towerMat])}

/* ---------- 尔什 towns: 峡风要塞's carts drawn by big shaggy beasts; 天宫市's sky full of little floating clouds that carry
   sprinklers, potted plants and advertising boards ---------- */
function fxG_erxi(sp){
 {const fur=G([[tg(new THREE.SphereGeometry(1,10,8),{s:[1.5,1,.9]}),'#7a6048',{p:[1.6,1.6,0]}],[tg(new THREE.SphereGeometry(.55,8,6),{}),'#6a5038',{p:[3.1,1.9,0]}],[kc(.1,.5,4),'#e8e0c8',{p:[3.4,2.3,.3],r:[0,0,-1]}],[kc(.1,.5,4),'#e8e0c8',{p:[3.4,2.3,-.3],r:[0,0,-1]}],
   ...[[2.4,.45],[2.4,-.45],[.8,.45],[.8,-.45]].map(([x,z])=>[kcy(.22,.18,1.1,6),'#5a4430',{p:[x,.55,z]}]),
   [kb(2.6,.9,1.6),'#8a6a40',{p:[-1.2,1.1,0]}],[kb(2.8,.12,1.8),'#6a4a2a',{p:[-1.2,1.6,0]}],[tg(new THREE.TorusGeometry(.55,.1,5,12),{}),'#3a2a1a',{p:[-1.6,.55,.85]}],[tg(new THREE.TorusGeometry(.55,.1,5,12),{}),'#3a2a1a',{p:[-1.6,.55,-.85]}],[kb(1.6,.08,.08),'#5a4030',{p:[.4,1.05,.4]}],[kb(1.6,.08,.08),'#5a4030',{p:[.4,1.05,-.4]}]]);
  const pts=[];const Rn=rnd(7824);for(let i=0;i<9;i++){const a=Rn()*6.283,d=.15+Rn()*1;const la=78+Math.cos(a)*d,lo=-24+Math.sin(a)*d/Math.cos(78*D2R);if(sp.ghRaw(la,lo)>1.5)pts.push([la,lo,0,Rn()])}
  inst(fur,VC({roughness:.85}),pts,(o,p)=>{frameLL(sp,p[0],p[1],0,p[3]*6.28,o);o.scale.setScalar(1.1)},[8,9],{far:900})}
 {const g=new THREE.Group();const cm=new THREE.SpriteMaterial({map:smokeTex,color:'#ffffff',transparent:true,opacity:.85,depthWrite:false});const L=[];const Rn=rnd(4512);const ads=['#ff6ab8','#6ad0ff','#ffd04a','#7affb0'];
  for(let i=0;i<16;i++){const c=new THREE.Group();for(let k=0;k<5;k++){const s=new THREE.Sprite(cm);const sz=4+Rn()*3;s.scale.set(sz,sz*.55,1);s.position.set((Rn()-.5)*4,(Rn()-.5)*.8,(Rn()-.5)*3);c.add(s)}
   const kind=i%3;if(kind===0){const sp2=new THREE.Mesh(kcy(.12,.12,1.2,6),M('#8a949c',{metalness:.7}));sp2.position.y=-1;c.add(sp2);c.add(at(emitter({n:40,life:1.4,speed:1.5,spread:.5,size:.5,dir:[0,-1,0],col:'#d8f0ff',op:.5,area:[.5,.2,.5],grav:.8}),0,-1.6,0))}
   else if(kind===1){const pot=new THREE.Mesh(G([[kcy(.5,.4,.6,8),'#a86a4a',{p:[0,.3,0]}],[kcy(.06,.08,1.2,5),'#5a4632',{p:[0,1,0]}],[ki(.7,1),'#4a9a4a',{p:[0,1.8,0]}]]),VC());pot.position.y=.2;c.add(pot)}
   else{const bd=new THREE.Mesh(kb(4,2,.12),new THREE.MeshBasicMaterial({color:ads[i%4]}));bd.position.y=-1.8;c.add(bd);const fr2=new THREE.Mesh(kb(4.3,2.3,.08),M('#3a4044'));fr2.position.set(0,-1.8,-.06);c.add(fr2)}
   const a=Rn()*6.283,d=Rn()*1.8;L.push({c,la:45+Math.cos(a)*d,lo:12+Math.sin(a)*d/Math.cos(45*D2R),alt:24+Rn()*26,ph:Rn()*6});g.add(c)}
  sp.scene.add(g);addE(g,[8,9,10,11,12]);anim(sp,g,t=>{if(rig.alt>1600)return;L.forEach(x=>frameLL(sp,x.la+Math.sin(t*.03+x.ph)*.15,x.lo+Math.cos(t*.025+x.ph)*.2,x.alt+Math.sin(t*.5+x.ph)*1.5,x.ph,x.c))})}}
ENT.xm_deepcity=[fxG_deepCity,1.8,{sea:1,alt:-5}];// under the surface, seen through the water

/* ---------- 深渊墓场: west of the skull island the sea floor is a bed of broken shells tens of metres deep ---------- */
function fxG_grave(sp){const Rn=rnd(4638);const pts=[];for(let i=0;i<2400&&pts.length<900;i++){const a=Rn()*6.283,d=Math.sqrt(Rn())*1.5;const la=4.6+Math.cos(a)*d,lo=-38.6+Math.sin(a)*d;const h=sp.ghRaw(la,lo);if(h>-9||h<-16)continue;pts.push([la,lo,h,Rn()])}
 const sh=G([[new THREE.SphereGeometry(1,8,4,0,3.4,0,1.3),'#e8e0cc',{s:[1,.35,.8]}],[new THREE.SphereGeometry(.7,7,3,0,2.6,0,1.2),'#d8ccb4',{p:[1,.05,.4],s:[1,.3,.9],r:[.3,1,0]}]]);
 inst(sh,VC({roughness:.7,side:THREE.DoubleSide}),pts,(o,p)=>{frameLL(sp,p[0],p[1],0,p[3]*6.28,o,false);o.position.setLength(R+p[2]+.2);o.rotateX((p[3]-.5)*.8);o.scale.setScalar(.9+p[3]*1.8)},[3,4,5,6,7,8,9,10,11,12],{far:900})}
