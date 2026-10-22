/* ================================================================
   绒球: the mother planet, built from the descriptions in books one and two (and what book three does to it)
   ================================================================ */
const BLOBS=[
 [30,2,19],[22,-9,12],[38,13,13],[13,3,9],[43,-6,10],[29,16,8],
 [6,-76,19],[18,-66,12],[-8,-84,13],[12,-96,11],[-14,-74,10],[22,-90,8],
 [-12,70,16],[-4,58,10],[-20,82,11],[-6,86,9],[-24,66,8],
 [-52,-18,13],[-60,2,10],[-46,-34,8],
 [4,-112,3.6],[6,-110,2.2],[30,-104,2.4],[27,-100,1.8],[33,-99,1.6],[34,-106,1.5],[26,-106,1.4],
 [1,-46.6,2.2],[1,-43.6,2.0],[8,-33,1.5,1],[10,-28,1.4,1],[12,-44,1.7,1],[20,30,1.1,1]
].map(b=>({d:dirLL(b[0],b[1]),r:b[2],dome:!!b[3]}));
const PT=(a,b)=>dirLL(a,b);
const F={peak:PT(36,15),cpeak:PT(-6,73),atmount:PT(22,-94),crater:PT(20,-13),salt:PT(4,-72),dieye:PT(-17,75),
 riftA:PT(25,-58),riftB:PT(3,-64),canA:PT(14,6),canB:PT(47,6),abyA:PT(-20,30),abyB:PT(-32,42),twin1:PT(1,-46.6),twin2:PT(1,-43.6),oasis:PT(27,-11),plake:PT(36.6,14.2),lavA:PT(20,4),lavB:PT(22,14)};
function landMaskB(p,BL){let m=-1;for(const b of BL){const a=angDeg(p,b.d),t=a/b.r;m=Math.max(m,b.dome?.5*(1-t*t)+.05:1-t)}return m}
/* ridged noise: sharp crests, broad valleys, the shape real mountain ranges have */
function ridgeN(x,y,z,f,o){let s=0,a=.55,w=1,t=0;for(let i=0;i<o;i++){let v=1-Math.abs(n3(x*f+i*7.1,y*f,z*f)*2-1);v*=v;v*=w;s+=v*a;t+=a;w=clamp(v*1.6,0,1);a*=.5;f*=2.07}return s/t}
function rqH0(p){
 const n=fbm(p.x*3.2+5,p.y*3.2,p.z*3.2,5);const nc=fbm(p.x*11+2,p.y*11,p.z*11,4);let m=landMaskB(p,BLOBS)+(n-.5)*.55+(nc-.5)*.13;let h;
 if(m<0)h=Math.max(-70,m*150)-2+(nc-.5)*6*sm(-.02,-.25,m);else{const r=fbm(p.x*9,p.y*9,p.z*9,4);h=2+m*28+Math.pow(r,2.4)*55*Math.min(1,m*3);
  // mountain ranges where a slow field says so, kept off the shore
  const inl=sm(.06,.42,m);const range=sm(.48,.7,fbm(p.x*2.3+11,p.y*2.3-3,p.z*2.3+7,3));
  if(inl>0){h+=inl*range*Math.pow(ridgeN(p.x,p.y,p.z,8.5,5),1.5)*78;
   // rolling hills and a fine grain of knolls everywhere else
   h+=inl*((fbm(p.x*24+3,p.y*24,p.z*24,3)-.5)*14+(n3(p.x*70,p.y*70,p.z*70)-.5)*3.5)}
  // low sea cliffs on part of the coasts
  h+=sm(0,.035,m)*sm(.55,.75,fbm(p.x*6-4,p.y*6,p.z*6+1,2))*4
  // the small western-sea islands: low green domes with beaches, not mountains
  let dz=0;for(const b of BLOBS)if(b.dome)dz=Math.max(dz,1-sm(1.1,1.6,angDeg(p,b.d)/b.r));if(dz>0)h=lerp(h,1.6+m*24+(fbm(p.x*30,p.y*30,p.z*30,3)-.5)*7,dz)}
 let a;
 a=angDeg(p,F.peak);h+=92*Math.exp(-(a*a)/(2*4.3*4.3));
 a=angDeg(p,F.plake);if(a<1.7)h=lerp(h,h-34,1-sm(.7,1.7,a));
 a=angDeg(p,F.cpeak);h+=118*Math.exp(-(a*a)/(2*3.6*3.6));h+=52*Math.exp(-(a*a)/(2*9*9))*(m>0);
 a=angDeg(p,F.atmount);h+=70*Math.exp(-(a*a)/(2*3.8*3.8));
 a=angDeg(p,F.crater);if(a<3&&m>0){h=lerp(h,-3,1-sm(1.1,2.3,a));h+=Math.exp(-Math.pow((a-2.45)/.35,2))*10}
 a=angDeg(p,PT(12,-88));if(a<1.2&&m>0)h=lerp(h,45,1-sm(.55,1.15,a));
 a=angDeg(p,F.salt);if(a<6&&m>0)h=lerp(h,3+n,1-sm(3,5.5,a));
 a=angDeg(p,F.oasis);if(a<1.3&&m>0)h=lerp(h,-2,1-sm(.55,1.3,a));
 a=angDeg(p,F.dieye);if(a<3&&m>0)h=lerp(h,-6,1-sm(1,2.2,a));
 a=segAng(p,F.riftA,F.riftB);if(m>0)h=lerp(h,.6,1-sm(.5,1.4,a));
 a=segAng(p,F.lavA,F.lavB);if(m>0)h=lerp(h,Math.min(h,3),1-sm(.45,.95,a));
 a=segAng(p,F.abyA,F.abyB);if(m<0)h-=40*Math.exp(-(a*a)/.5);
 a=Math.min(angDeg(p,F.twin1),angDeg(p,F.twin2));if(a<2.4)h=Math.max(h,lerp(18,0,a/2.2));
 return h}
/* ---------- rivers: traced downhill from high ground to the sea, then cut into the land ---------- */
const RIVERS=(()=>{const Rn=rnd(4711),out=[],src=[];const d=V3(),e=V3(),nn=V3();
 // where rivers begin: high, wet ground, spaced apart (deserts and salt flats get none)
 const dry=[dirLL(25,-6),dirLL(4,-72),dirLL(-17,75)];
 for(let k=0;k<5200&&src.length<34;k++){d.set(Rn()*2-1,Rn()*2-1,Rn()*2-1);if(d.lengthSq()>1||d.lengthSq()<.01)continue;d.normalize();const lat=Math.asin(d.y)/D2R;if(Math.abs(lat)>58)continue;
  const h=rqH0(d);if(h<38||h>150)continue;if(dry.some(q=>angDeg(d,q)<10))continue;if(src.some(q=>angDeg(d,q)<5.5))continue;src.push(d.clone())}
 const step=.2*D2R;
 for(const s0 of src){const pts=[s0.clone()];let p=s0.clone(),prev=null,h=rqH0(p),stuck=0;
  for(let i=0;i<420;i++){// probe a fan of directions and take the lowest, with a little memory of the last turn
   const up=p;const nx=V3(0,1,0).addScaledVector(up,-up.y);if(nx.lengthSq()<1e-6)nx.set(1,0,0);nx.normalize();const ex=nx.clone().cross(up);
   let best=null,bh=1e9;for(let k=0;k<14;k++){const a=k/14*Math.PI*2;nn.copy(nx).multiplyScalar(Math.cos(a)).addScaledVector(ex,Math.sin(a));
    if(prev&&nn.dot(prev)<-.2)continue;e.copy(p).addScaledVector(nn,step).normalize();const hh=rqH0(e)+(prev?(1-nn.dot(prev))*1.2:0);if(hh<bh){bh=hh;best=nn.clone()}}
   if(!best)break;const np=p.clone().addScaledVector(best,step).normalize();const nh=rqH0(np);
   if(nh>=h-.02)stuck++;else stuck=Math.max(0,stuck-1);if(stuck>26)break;
   prev=best;p=np;h=Math.min(h,nh);pts.push(np);if(nh<-1.2)break}
  if(pts.length>28&&h<0)out.push(pts)}
 // spatial hash of the segments for carving
 const H={},key=(v)=>Math.round(v.x*22)+','+Math.round(v.y*22)+','+Math.round(v.z*22);
 out.forEach((L,ri)=>L.forEach((q,i)=>{if(i===0)return;const t=i/(L.length-1);const k=key(q);const a=L[i-1];const ab=q.clone().sub(a);(H[k]=H[k]||[]).push({a,b:q,ab,l2:ab.lengthSq()||1e-12,t,ri})}));
 return{L:out,H,key}})();
const _rv=V3();
/* how close a point is to a river, and how far down that river: {k:0..1 inside the channel, t:0..1 downstream, w:half width in degrees} */
function riverAt(p){const H=RIVERS.H;const cx=Math.round(p.x*22),cy=Math.round(p.y*22),cz=Math.round(p.z*22);let best=null,bd=1e9;
 for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++)for(let k=-1;k<=1;k++){const L=H[(cx+i)+','+(cy+j)+','+(cz+k)];if(!L)continue;for(const s of L){let u=((p.x-s.a.x)*s.ab.x+(p.y-s.a.y)*s.ab.y+(p.z-s.a.z)*s.ab.z)/s.l2;u=u<0?0:u>1?1:u;const dx=p.x-s.a.x-s.ab.x*u,dy=p.y-s.a.y-s.ab.y*u,dz=p.z-s.a.z-s.ab.z*u;const a=Math.sqrt(dx*dx+dy*dy+dz*dz)/D2R;if(a<bd){bd=a;best=s}}}
 if(!best)return null;const w=.1+best.t*.32;if(bd>w*3.2)return null;return{d:bd,w,t:best.t,k:1-sm(w*.55,w*1.15,bd),bank:1-sm(w,w*3.2,bd)}}
function rqHeight(p){let h=rqH0(p);if(h<-4)return h;const r=riverAt(p);if(r){const depth=2.2+r.t*3.2;h-=depth*r.k+r.bank*Math.min(4,Math.max(0,h-2))*.35}return h}
function rqCanyon(p,h){const a=segAng(p,F.canA,F.canB);const k=1-sm(.4,1.3,a);return k>0?Math.max(0,(h+16))*k:0}

/* ---------- colours ---------- */
const PC={deep:C('#0a2233'),shelf:C('#1e4d5a'),sand:C('#d8c08a'),dune:C('#d49b5e'),rock:C('#6a5f55'),ash:C('#4a4440'),barren:C('#7d7466'),barren2:C('#5f574c'),
 green:C('#4f8a46'),lush:C('#2f7a43'),teal:C('#1f5a4a'),moss:C('#47b39a'),spire:C('#7a8670'),tundra:C('#7c8a72'),salt:C('#efede4'),emer:C('#2d9560'),crys:C('#9fd6e0'),
 savanna:C('#a1a052'),succ:C('#7fa98a'),blood:C('#8a2b2b'),dark:C('#283c2e'),snow:C('#eef4f8'),fung:C('#b9a9c9'),south:C('#6f7a6a'),mud:C('#4a4436'),scorch:C('#3a3430')};
const NR=(lat,lon,r0,r1,col,k)=>({d:dirLL(lat,lon),r0,r1,col,k:k===undefined?1:k});
const LUSH=[NR(25,-6,7,13,PC.dune),NR(20,-13,1,3,PC.dune),NR(15,-1,1.5,3.5,PC.spire),NR(33,11,6,11,PC.teal),NR(29,8,1,2.5,PC.moss),NR(9,2,1,3,PC.rock,.7),
 NR(6,-76,4,26,PC.lush,.6),NR(4,-72,3,5.5,PC.salt),NR(12,-88,2,5,PC.emer),NR(10,-100,2,5,PC.crys,.8),NR(-12,-78,2,6,PC.savanna,.8),NR(-6,-80,2,5,PC.savanna,.5),NR(26,-66,2,6,PC.dark,.7),
 NR(30,-103,0,5,PC.fung),NR(4,-111,0,4,PC.tundra,.4),NR(-12,70,4,22,PC.succ,.6),NR(-17,76,3,7,PC.dune),NR(-22,83,1,4,PC.moss,.7),NR(-10,88,2,5,PC.dark),NR(-52,-18,4,20,PC.south,.7),NR(14,-60,.3,1.2,PC.mud,.8)];
const _nt=V3();
function nearD(p,d,r0,r1){return 1-sm(r0,r1,angDeg(p,d))}
const DIEYE=dirLL(-17,76);
/* where woods grow thick: shared by the ground colour and the trees, so forests read even beyond the trees' draw distance */
function forestF(p){return sm(.42,.58,fbm(p.x*14+3,p.y*14,p.z*14-2,3))}
const PCX={wood:C('#2f5e30'),meadow:C('#7aa04e'),dry:C('#9a9a56'),olive:C('#6b7a44'),high:C('#7a7060'),scree:C('#8a8478')};
function lushColor(p,h,lat,out){
 if(h<0){out.copy(PC.shelf).lerp(PC.deep,sm(-2,-40,h));return}
 if(h<.9){coastColor(p,h,out);return}
 out.copy(Math.abs(lat)>52?PC.tundra:PC.green);
 {// a patchwork: dense woods, open meadows, dry grass on the drier sides, olive foothills, grey high ground
  const f=forestF(p),mw=fbm(p.x*7-5,p.y*7+2,p.z*7,3),dr=fbm(p.x*4+9,p.y*4,p.z*4+3,2);
  out.lerp(PCX.meadow,sm(.5,.7,mw)*(1-f)*.55);out.lerp(PCX.dry,sm(.58,.75,dr)*(1-f)*.45);out.lerp(PCX.wood,f*.62*(1-sm(60,95,h)));
  out.lerp(PCX.olive,sm(28,60,h)*.5);out.lerp(PCX.high,sm(55,95,h)*.6);out.lerp(PCX.scree,sm(85,120,h)*.4*n3(p.x*40,p.y*40,p.z*40))}
 for(const z of LUSH){const w=nearD(p,z.d,z.r0,z.r1);if(w>0)out.lerp(z.col,w*z.k)}
 const w=1-sm(.25,.8,Math.abs(angDeg(p,DIEYE)-7.6));out.lerp(PC.blood,w*.85);
 if(h>60)out.lerp(PC.rock,sm(60,110,h));if(h>140)out.lerp(PC.snow,sm(140,200,h));
 out.offsetHSL(0,0,(n3(p.x*60,p.y*60,p.z*60)-.5)*.05);
 if(h<4.5){const z=fbm(p.x*11+3,p.y*11,p.z*11-2,2);const k=1-sm(1.3+z*1.6,3.2+z*1.8,h);if(k>0){coastColor(p,h,_cc);out.lerp(_cc,k)}}}
// beaches: pale dry sand up the shore, dark wet sand at the waterline, and grey rocky stretches
const _cc=new THREE.Color(),COAST={wet:C('#b09a6a'),rock:C('#6e6a62'),peb:C('#a8a090'),pale:C('#e8d8aa')};
function coastColor(p,h,out){const rk=sm(.6,.72,fbm(p.x*6.5-7,p.y*6.5+1,p.z*6.5,3));out.copy(PC.sand).lerp(COAST.pale,sm(.8,2.6,h)*.6);out.lerp(COAST.peb,rk*.5).lerp(COAST.rock,rk*sm(.6,.8,fbm(p.x*30,p.y*30,p.z*30,2))*.8);out.lerp(COAST.wet,(1-sm(0,.6,h))*.45*(1-rk*.5))}
function barrenColor(p,h,out){if(h<0){out.copy(PC.shelf).lerp(PC.deep,sm(-2,-40,h));return}if(h<2.2){out.copy(PC.sand);return}
 out.copy(PC.barren).lerp(PC.barren2,n3(p.x*20,p.y*20,p.z*20));if(h>60)out.lerp(PC.ash,sm(60,120,h))}
const SOUTHW=dirLL(-56,-14),WSNOW=dirLL(6,-80);
function rqColors(Gd){const n=Gd.n,P=Gd.P,H=Gd.H;const b=new Float32Array(n*3),l=new Float32Array(n*3),s=new Float32Array(n*3),w=new Float32Array(n*3);const p=V3(),c=new THREE.Color(),c2=new THREE.Color();
 const BANK=C('#3d6b3a'),MUD=C('#5a5040'),LAVAC=C('#1c1816');
 for(let k=0;k<n;k++){p.set(P[k*3],P[k*3+1],P[k*3+2]);const h=H[k],lat=Math.asin(p.y)/D2R;
  lushColor(p,h,lat,c);{const la2=segAng(p,F.lavA,F.lavB);if(la2<.8)c.lerp(LAVAC,(1-sm(.4,.75,la2))*.95)}const rv=h>-1?riverAt(p):null;if(rv){c.lerp(BANK,rv.bank*.45);c.lerp(MUD,rv.k*.6)}l[k*3]=c.r;l[k*3+1]=c.g;l[k*3+2]=c.b;
  const sw=h>2?Math.max(nearD(p,SOUTHW,6,22),sm(-48,-62,lat))*.92:0;c2.copy(c).lerp(PC.snow,sw);w[k*3]=c2.r;w[k*3+1]=c2.g;w[k*3+2]=c2.b;
  const snowK=h>2?Math.max(sm(18,40,lat+(n3(p.x*30,p.y*30,p.z*30)-.5)*14),nearD(p,WSNOW,8,30)*.85,sm(-40,-58,lat)):0;c2.copy(c).lerp(PC.snow,snowK);s[k*3]=c2.r;s[k*3+1]=c2.g;s[k*3+2]=c2.b;
  barrenColor(p,h,c);if(rv)c.lerp(MUD,rv.k*.5);b[k*3]=c.r;b[k*3+1]=c.g;b[k*3+2]=c.b}
 return{b,l,s,w}}

/* ---------- what grows where (ground cover) ---------- */
const BZ={jungle:dirLL(33,11),glow:dirLL(29,8),desert:dirLL(25,-6),spires:dirLL(15,-1),salt:dirLL(4,-72),grass:dirLL(-8,-80),emer:dirLL(12,-88),crys:dirLL(10,-100),fung:dirLL(30,-103),
 rain:dirLL(26,-66),east:dirLL(-12,70),moss:dirLL(-22,83),tian:dirLL(-10,88),dieye:dirLL(-17,75),lqm:dirLL(-4,-86),swamp:dirLL(40,6)};
function rqBiome(d,h,lat,e,W){if(e===1)return;const al=Math.abs(lat);
 const snowy=e===4?Math.max(sm(18,40,lat),nearD(d,WSNOW,8,30)*.85,sm(-40,-58,lat)):0;if(e>=6&&(lat<-48||nearD(d,SOUTHW,6,22)>.5))return;
 if(h>120||al>62)return;
 if(h<2.4&&h>-.3){W.rock=.1;W.rockC='#7a746a';W.tuft=.14;W.tuftC='#c8c08a';return}
 const desert=Math.max(nearD(d,BZ.desert,6,12),nearD(d,BZ.dieye,2.5,6.5));const salt=nearD(d,BZ.salt,3,5.5);
 if(snowy>.5){W.rock=.06;return}
 if(desert>.6){W.rock=.03;if(nearD(d,BZ.desert,0,14)>.2&&e===5){W.tuft=.25;W.tuftC='#8fb04a'}return}
 if(salt>.5){W.rock=.015;W.rockC='#f2efe6';return}
 if(h>70){W.rock=.12;W.tuft=.2;W.tuftC='#7a8a5a';return}
 W.tuft=.55;W.tuftC='#ffffff';W.rock=.03;W.flower=.05;W.flowerC=['#f4e6a0','#e9a0c0','#a0c8f4','#ffffff'][(h*7|0)%4];
 const jg=nearD(d,BZ.jungle,4,11),gl=nearD(d,BZ.glow,.6,2.5),rf=Math.max(nearD(d,BZ.rain,1.5,6),nearD(d,BZ.lqm,1.5,4),nearD(d,BZ.tian,1.5,5)),gr=nearD(d,BZ.grass,1,6.5),ea=nearD(d,BZ.east,2,20),fu=nearD(d,BZ.fung,0,5),cr=nearD(d,BZ.crys,1,5),mo=nearD(d,BZ.moss,.5,4),sw=nearD(d,BZ.swamp,.3,2);
 if(jg>.2){W.fern=.45*jg;W.tuft=.5;W.shroom=.04*jg;W.shroomC='#d8f0e0'}
 if(gl>.2){W.shroom=.35*gl;W.shroomC='#b8fff0';W.tuftC='#9fe8c8';W.flower=.02}
 if(rf>.2){W.fern=.6*rf;W.tuft=.35;W.flower=.08}
 if(gr>.2&&rf<.3){W.tall=.75*gr;W.tuft=.3;W.tuftC='#c8c070';W.flower=.03}
 if(cr>.2){W.tuft=.25;W.rock=.15;W.rockC='#bfe8f0'}
 if(fu>.2){W.shroom=.45*fu;W.shroomC=['#e8d8f4','#c8a8e0','#f4f0f8'][(h*5|0)%3];W.tuft=.2;W.tuftC='#b0a0c0'}
 if(ea>.3&&desert<.3){W.succ=.12*ea;W.tuft=.35;W.tall=0;if(mo>.2){W.tuft=.8;W.tuftC='#6fc0a0';W.succ=0}}
 if(sw>.2){W.reed=.6*sw;W.tuft=.4}
 if(lat>36&&lat<52&&e>=5){W.flower=.12}
 if(e===4){W.tuft*=.4;W.tuftC='#d8e0d0';W.flower=0;W.fern=(W.fern||0)*.3}}

/* ---------- rivers you can see: a ribbon of moving water laid along each traced course ---------- */
function rqRivers(sp){const G=sp.G;const U={uT:GT,uIce:{value:0}};
 const mat=new THREE.MeshStandardMaterial({color:'#2f7590',roughness:.1,metalness:.45,transparent:true,opacity:.92,polygonOffset:true,polygonOffsetFactor:-3,polygonOffsetUnits:-3,envMapIntensity:1.4});
 mat.onBeforeCompile=sh=>{Object.assign(sh.uniforms,U);sh.vertexShader='varying vec2 vRU;\n'+sh.vertexShader.replace('#include <uv_vertex>','#include <uv_vertex>\nvRU=uv;');
  sh.fragmentShader='uniform float uT,uIce;varying vec2 vRU;\n'+sh.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
   float edge=1.-abs(vRU.x-.5)*2.;float fl=sin(vRU.y*1.3-uT*2.2+sin(vRU.x*9.)*1.5)*.5+.5;float fl2=sin(vRU.y*3.7-uT*3.1+vRU.x*4.)*.5+.5;
   diffuseColor.rgb=mix(diffuseColor.rgb*vec3(.8,.95,1.),diffuseColor.rgb*1.35,fl*fl2*.5*edge);diffuseColor.rgb=mix(vec3(.55,.62,.6),diffuseColor.rgb,smoothstep(0.,.35,edge));
   diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.86,.92,.96),uIce);diffuseColor.a*=smoothstep(0.,.18,edge);`)};
 mat.customProgramCacheKey=()=>'river';
 const d=V3(),sd=V3(),tg=V3();
 RIVERS.L.forEach((L,ri)=>{const n=L.length;const pos=[],uv=[],idx=[];let wl=1e9,along=0;
  for(let i=0;i<n;i++){const p=L[i];const q=L[Math.min(n-1,i+1)],o=L[Math.max(0,i-1)];tg.copy(q).sub(o).normalize();sd.copy(tg).cross(p).normalize();
   const t=i/(n-1);const hw=(.1+t*.32)*D2R*.95;const gC=gridSample(G,G.H,p);wl=Math.min(wl,gC+.3);const lvl=Math.max(wl,gC-1.2);
   if(i>0)along+=L[i].distanceTo(L[i-1])*R/14;
   for(const sgn of[-1,1]){d.copy(p).addScaledVector(sd,hw*sgn).normalize();const r=R+Math.max(lvl,-.2)+.05;pos.push(d.x*r,d.y*r,d.z*r);uv.push(sgn<0?0:1,along)}
   if(i<n-1){const a=i*2;idx.push(a,a+1,a+2,a+1,a+3,a+2)}}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
  // the normals should face the sky whichever way the strip winds
  const nr=g.attributes.normal.array;for(let k=0;k<nr.length;k+=3){const px=pos[k],py=pos[k+1],pz=pos[k+2],l=Math.hypot(px,py,pz);nr[k]=px/l;nr[k+1]=py/l;nr[k+2]=pz/l}
  g.computeBoundingSphere();const m=new THREE.Mesh(g,mat);m.renderOrder=2;sp.scene.add(m);sp.culls.push({o:m,c:g.boundingSphere.center.clone(),r:g.boundingSphere.radius,far:2600});m.material.side=THREE.DoubleSide});
 const prev=sp.onEra;sp.onEra=e=>{U.uIce.value=e===4?.85:0;mat.opacity=e===4?.98:.92;if(prev)prev(e)};sp.riverU=U}

/* ---------- forests seen from the air: low trees by the tens of thousands, in patches and clearings ---------- */
function rqForests(sp){const Rn=rnd(9091);const gh=sp.ghRaw;const d=V3();
 const KITS={broad:G([[kcy(.18,.28,3.2,5),'#5a4632',{p:[0,1.6,0]}],[kiS(1),'#ffffff',{p:[0,4.1,0],s:[2.1,1.7,2.1]}],[kiS(1),'#ffffff',{p:[.8,3.5,.3],s:[1.3,1.1,1.3]}]]),
  conifer:G([[kcy(.14,.22,2,5),'#4a3a2a',{p:[0,1,0]}],[kc(1.6,3.4,6),'#ffffff',{p:[0,3.2,0]}],[kc(1.15,2.6,6),'#ffffff',{p:[0,5,0]}],[kc(.7,1.8,6),'#ffffff',{p:[0,6.5,0]}]]),
  palm:G([[ktube([V3(0,0,0),V3(.4,2.6,0),V3(.9,5,.2)],.16,6,4),'#7a6a4e'],...Array.from({length:6},(_,i)=>{const a=i/6*6.28;return[kc(.28,2.6,3),'#ffffff',{p:[.9+Math.cos(a)*1,4.8,.2+Math.sin(a)*1],r:[Math.sin(a)*1.5,0,-Math.cos(a)*1.5]}]})]),
  dead:G([[kcy(.12,.2,3.6,5),'#5a4e40',{p:[0,1.8,0]}],[kcy(.05,.08,1.6,4),'#5a4e40',{p:[.4,3.2,0],r:[0,0,-.9]}],[kcy(.05,.08,1.4,4),'#5a4e40',{p:[-.35,2.7,.2],r:[0,0,.9]}]])};
 // the near versions: fuller crowns, branches, layered boughs
 const blob=(r,x,y,z,c,sx,sy)=>[ki(r,1),c,{p:[x,y,z],s:[sx||1,sy||.85,sx||1]}];
 const NEAR={broad:G([[kcy(.16,.3,3.4,7),'#5a4632',{p:[0,1.7,0]}],[kcy(.07,.12,1.8,5),'#5a4632',{p:[.55,3.2,.1],r:[0,0,-.75]}],[kcy(.06,.1,1.6,5),'#5a4632',{p:[-.45,3,-.2],r:[.3,0,.8]}],
   blob(1.5,0,4.6,0,'#ffffff',1.15,.8),blob(1.1,1.1,4,.3,'#e8e8e8'),blob(1,-1,3.9,-.4,'#e0e0e0'),blob(.9,.2,5.4,.6,'#f4f4f4'),blob(.8,-.4,4.3,1,'#d8d8d8'),blob(.7,.5,3.5,-1,'#d0d0d0')]),
  conifer:G([[kcy(.12,.24,2.2,7),'#4a3a2a',{p:[0,1.1,0]}],[kc(1.75,2.2,9),'#d8d8d8',{p:[0,2.6,0]}],[kc(1.45,2,9),'#e4e4e4',{p:[0,3.7,0]}],[kc(1.15,1.8,9),'#ececec',{p:[0,4.7,0]}],[kc(.85,1.6,9),'#f4f4f4',{p:[0,5.6,0]}],[kc(.5,1.4,8),'#ffffff',{p:[0,6.5,0]}]]),
  palm:G([[ktube([V3(0,0,0),V3(.4,2.6,0),V3(.9,5,.2)],.16,10,6),'#7a6a4e'],[ki(.32,1),'#6a5a3a',{p:[.9,4.9,.2]}],...Array.from({length:9},(_,i)=>{const a=i/9*6.28;return[tg(new THREE.SphereGeometry(1,8,4),{s:[1.5,.06,.32]}),i%2?'#ffffff':'#e0e0e0',{p:[.9+Math.cos(a)*1.3,4.75-.25*(i%3),.2+Math.sin(a)*1.3],r:[0,-a,-.35]}]})]),
  dead:G([[kcy(.12,.22,3.8,7),'#5a4e40',{p:[0,1.9,0]}],[kcy(.04,.08,1.8,5),'#5a4e40',{p:[.45,3.4,0],r:[0,0,-.9]}],[kcy(.04,.08,1.5,5),'#5a4e40',{p:[-.4,2.9,.2],r:[0,0,.9]}],[kcy(.03,.06,1.2,4),'#5a4e40',{p:[.1,3.9,-.4],r:[.8,0,0]}],[kcy(.03,.05,1,4),'#5a4e40',{p:[-.1,3.6,.5],r:[-.9,0,.2]}]])};
 const Z={desert:dirLL(25,-6),dieye:dirLL(-17,75),salt:dirLL(4,-72),spires:dirLL(15,-1),jungle:dirLL(33,11),crater:dirLL(20,-13),grass:dirLL(-8,-80),rift:dirLL(14,-60),fung:dirLL(30,-103),lava:dirLL(21,9),crys:dirLL(10,-100)};
 const WEST=dirLL(6,-76),EAST=dirLL(-12,70),NORTH=dirLL(30,2),SOUTH=dirLL(-52,-18);
 const pick={};const add=(kind,eras,p)=>{const key=kind+'|'+eras.join()+'|'+Math.round(p[0]/4)+','+Math.round(p[1]/4);(pick[key]=pick[key]||{kind,eras,pts:[]}).pts.push(p)};
 const ERAS_A=[2,3,5,6,7,8,9,10,11,12],ERAS_S=[2,3,5];
 for(let i=0;i<520000;i++){d.set(Rn()*2-1,Rn()*2-1,Rn()*2-1);const l2=d.lengthSq();if(l2>1||l2<.02)continue;d.normalize();const lat=Math.asin(d.y)/D2R,lon=Math.atan2(d.x,d.z)/D2R;
  const h=gh(lat,lon);if(h<3||h>105)continue;if(Math.abs(lat)>64)continue;
  if(angDeg(d,Z.desert)<12||angDeg(d,Z.dieye)<6.5||angDeg(d,Z.salt)<6||angDeg(d,Z.spires)<3.5||angDeg(d,Z.jungle)<9||angDeg(d,Z.crater)<3.2||angDeg(d,Z.fung)<5||angDeg(d,Z.lava)<2||angDeg(d,Z.crys)<4||TOWNC.some(t=>angDeg(d,t[0])<t[1])||segAng(d,F.lavA,F.lavB)<1)continue;
  // patches with clearings, thinner on high ground and in grassland
  const pf2=n3(d.x*60,d.y*60,d.z*60);let dens=(forestF(d)*.9+.04)*(.55+.45*pf2)*(1-sm(55,100,h));
  if(angDeg(d,Z.grass)<7)dens*=.2;if(angDeg(d,Z.rift)<3)dens*=.3;if(dens<Rn()*.95)continue;
  // a slope that is too steep holds no trees
  const e1=gh(lat+.25,lon),e2=gh(lat,lon+.25/Math.max(.3,Math.cos(lat*D2R)));if(Math.abs(e1-h)+Math.abs(e2-h)>5.5)continue;
  if(nearEnt('rongqiu',lat,lon,.35))continue;
  const r4=Rn();const p=[lat,lon,h,r4];const ws=angDeg(d,WEST)<26,ea=angDeg(d,EAST)<24,so=angDeg(d,SOUTH)<22,coast=h<7;
  const cold=Math.abs(lat)>44||so||h>70;const eras=so||lat<-44?ERAS_S:ERAS_A;
  let kind=cold?'conifer':coast&&r4<.55&&Math.abs(lat)<30?'palm':(ea&&r4<.35?'conifer':'broad');p.push(ws?1:ea?2:0);add(kind,eras,p);
  // the long winter: the same woods stand bare or heavy with snow
  if(!so)add(kind==='broad'||kind==='palm'?'dead':'conifer',[4],p.concat(['snow']))}
 const tintOf=(p,kind)=>{const r=p[3],reg=p[4];if(p[5]==='snow')return kind==='conifer'?C('#e8eef2').lerp(C('#3a5a44'),r*.35):C('#5a4e40');
  if(kind==='conifer')return C('#2e5a3c').offsetHSL((r-.5)*.04,0,(r-.5)*.08);if(kind==='palm')return C('#5a9a40').offsetHSL((r-.5)*.05,0,(r-.5)*.08);
  const base=reg===1?C('#3a7a3c'):reg===2?C('#4f8a50'):C('#467a3a');return base.offsetHSL((r-.5)*.07,(r-.5)*.1,(r-.5)*.12)};
 const mat=swayMat({roughness:.88},.0035);let n=0;
 for(const k in pick){const g=pick[k];const eras=g.eras;const kind=g.kind;
  const set=(o,p)=>{frameLL(sp,p[0],p[1],-.3,p[3]*6.28,o);const s=(kind==='conifer'?1.1:1)*(.85+p[3]*.75);o.scale.set(s,s*(.85+((p[3]*7.7)%1)*.4),s)};
  // the plain far tree gives way to the full one inside ~260 units
  const far=inst(KITS[kind],mat,g.pts,set,eras,{tint:p=>tintOf(p,kind),far:1900,noCarry:true});sp.culls[sp.culls.length-1].near=240;
  inst(NEAR[kind],mat,g.pts,set,eras,{tint:p=>tintOf(p,kind),far:260,noCarry:true});n+=g.pts.length}
 sp.forestN=n}

/* ---------- boulders and outcrops on high ground, steep slopes and rocky shores ---------- */
function rqRocks(sp){const Rn=rnd(3131),gh=sp.ghRaw,d=V3();const kit=[0,1,2].map(k=>{const g=new THREE.IcosahedronGeometry(1,1);const p=g.attributes.position;for(let i=0;i<p.count;i++){const v=V3(p.getX(i),p.getY(i),p.getZ(i));v.multiplyScalar(.75+n3(v.x*2+k*5,v.y*2,v.z*2)*.5);v.y=v.y*.62+.25;p.setXYZ(i,v.x,v.y,v.z)}g.computeVertexNormals();return mergeColored([[g,'#ffffff']])});
 const mat=detailMat(VC({roughness:.95,flatShading:true}),{bump:.8,freq:3});const groups={};
 for(let i=0;i<260000;i++){d.set(Rn()*2-1,Rn()*2-1,Rn()*2-1);const l2=d.lengthSq();if(l2>1||l2<.02)continue;d.normalize();const lat=Math.asin(d.y)/D2R,lon=Math.atan2(d.x,d.z)/D2R;const h=gh(lat,lon);if(h<1.5)continue;
  const e1=gh(lat+.2,lon),e2=gh(lat,lon+.2/Math.max(.3,Math.cos(lat*D2R)));const sl=Math.abs(e1-h)+Math.abs(e2-h);
  const w=sm(45,90,h)*.5+sm(2.5,6,sl)*.6+(h<5?sm(.55,.7,fbm(d.x*6-4,d.y*6,d.z*6+1,2))*.5:0);if(w<Rn()*1.7)continue;if(nearEnt('rongqiu',lat,lon,.3))continue;
  const k=(Rn()*3)|0;const key=k+'|'+Math.round(lat/6)+','+Math.round(lon/6);(groups[key]=groups[key]||{k,pts:[]}).pts.push([lat,lon,h,Rn(),h>60?1:0])}
 let n=0;for(const key in groups){const g=groups[key];inst(kit[g.k],mat,g.pts,(o,p)=>{frameLL(sp,p[0],p[1],-.4,p[3]*6.28,o);const s=.8+Math.pow(p[3],3)*4.5;o.scale.set(s*(.8+p[3]*.5),s*(.6+((p[3]*5.3)%1)*.6),s)},null,{tint:p=>C(p[4]?'#8a8276':'#7a7064').offsetHSL(0,0,(p[3]-.5)*.18),far:1100});n+=g.pts.length}sp.rockN=n}

/* ---------- fair-weather clouds: heaps of soft puffs, lit by the sun from the side it is on ---------- */
const puffTex=canvasTex(128,128,(x)=>{const Rn=rnd(77);for(let i=0;i<60;i++){const a=Rn()*6.28,r=Math.pow(Rn(),.7)*34,px=64+Math.cos(a)*r,py=60+Math.sin(a)*r*.75,rr=7+Rn()*14*(1-r/40);const g=x.createRadialGradient(px,py,0,px,py,rr);g.addColorStop(0,'rgba(255,255,255,.34)');g.addColorStop(.7,'rgba(255,255,255,.12)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,128,128)}
 const im=x.getImageData(0,0,128,128),dd=im.data;for(let y=0;y<128;y++)for(let xx=0;xx<128;xx++){const k=(y*128+xx)*4;const r=Math.hypot(xx-64,(y-62)*1.2)/62;const v=Math.min(1,dd[k+3]/255*1.5);dd[k+3]=255*Math.min(1,Math.max(0,(v-.03)/.72))*Math.max(0,1-Math.pow(r,3))}x.putImageData(im,0,0)});
function rqCumulus(sp){const Rn=rnd(5150);const pos=[],sz=[],yy=[],d=V3(),up=V3(),ex=V3(),nx=V3();const SEA=dirLL(-12,74);
 for(let c=0,tries=0;c<170&&tries<20000;tries++){d.set(Rn()*2-1,Rn()*2-1,Rn()*2-1);if(d.lengthSq()>1||d.lengthSq()<.02)continue;d.normalize();const lat=Math.asin(d.y)/D2R;if(Math.abs(lat)>68)continue;
  const cf=fbm(d.x*4.5+7,d.y*4.5,d.z*4.5-3,3);if(cf<.52+Rn()*.08)continue;if(angDeg(d,SEA)<16)continue;c++;
  up.copy(d);nx.set(0,1,0).addScaledVector(up,-up.y);if(nx.lengthSq()<1e-6)nx.set(1,0,0);nx.normalize();ex.copy(nx).cross(up);
  const cr=26+Rn()*48,base=R+38+Rn()*16,np=34+Math.floor(Rn()*30);
  for(let k=0;k<np;k++){const a=Rn()*6.28,r=Math.pow(Rn(),.65)*cr,top=(1-r/cr);const y=Math.pow(top,.9)*cr*.5*(.3+.7*Rn())+Rn()*1.2;
   const q=d.clone().multiplyScalar(base+y).addScaledVector(nx,Math.cos(a)*r).addScaledVector(ex,Math.sin(a)*r*1.3);pos.push(q.x,q.y,q.z);sz.push((70+Rn()*60)*(.6+top*.7));yy.push(clamp(y/(cr*.55+2),0,1))}}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('aS',new THREE.Float32BufferAttribute(sz,1));g.setAttribute('aY',new THREE.Float32BufferAttribute(yy,1));g.computeBoundingSphere();
 const m=new THREE.ShaderMaterial({transparent:true,depthWrite:false,fog:false,uniforms:{uScale:PSCALE,uSun:{value:sp.sunDir},uTex:{value:puffTex},uAlt:{value:0}},
  vertexShader:`attribute float aS,aY;uniform float uScale,uAlt;uniform vec3 uSun;varying float vL,vY,vA,vS;void main(){vec4 w=modelMatrix*vec4(position,1.);vec4 mv=viewMatrix*w;float d=-mv.z;
   gl_PointSize=clamp(aS*uScale/max(d,1.),1.,1100.);gl_Position=projectionMatrix*mv;vec3 n=normalize(w.xyz);float sl=dot(n,uSun);vS=sl;vL=smoothstep(-.28,.4,sl);vY=aY;
   vA=smoothstep(30.,140.,d)*(1.-smoothstep(1500.,2300.,d))*(1.-smoothstep(650.,1150.,uAlt));}`,
  fragmentShader:`uniform sampler2D uTex;varying float vL,vY,vA,vS;void main(){vec4 t=texture2D(uTex,gl_PointCoord);if(t.a<.01)discard;
   vec3 lit=vec3(1.,.99,.96)*(.38+.62*vL);vec3 sh=vec3(.5,.56,.68)*(.25+.6*vL);vec3 c=mix(sh,lit,.45+.55*vY);c=mix(c,vec3(1.,.72,.52)*(.6+.4*vL),(1.-smoothstep(0.,.3,abs(vS-.05)))*.32);
   gl_FragColor=vec4(c,min(1.,t.a*1.05)*vA*.85);}`});
 const pts=new THREE.Points(g,m);pts.renderOrder=5;pts.frustumCulled=false;sp.scene.add(pts);sp.cumulus=pts;anim(sp,null,()=>{m.uniforms.uAlt.value=rig.alt;pts.visible=rig.alt<1200})}

/* ---------- flocks wheeling over the land ---------- */
function rqFlocks(sp){const F=[[34,6],[28,14],[10,-70],[-4,-82],[14,-92],[2,-64],[-10,66],[-16,80],[-2,60],[40,-4],[20,2],[8,-102],[-24,70],[24,-78]];const per=16,n=F.length*per;
 const geo=new THREE.BufferGeometry();const v=[0,0,.0, .6,0,0, -.5,.05,0, 0,0,0, -.15,0,1.1, .25,0,0, 0,0,0, .25,0,0, -.15,0,-1.1];geo.setAttribute('position',new THREE.Float32BufferAttribute(v,3));geo.computeVertexNormals();
 const mat=new THREE.MeshBasicMaterial({color:'#2a2a30',side:THREE.DoubleSide});const U={uT:GT};
 mat.onBeforeCompile=sh=>{sh.uniforms.uT=GT;sh.vertexShader='uniform float uT;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nfloat ph=fract(sin(dot(instanceMatrix[3].xyz,vec3(12.9,78.2,37.7)))*43758.5)*6.28;transformed.y+=sin(uT*11.+ph)*abs(transformed.z)*.8;')};mat.customProgramCacheKey=()=>'bird';
 const im=new THREE.InstancedMesh(geo,mat,n);im.frustumCulled=false;sp.scene.add(im);const o=new THREE.Object3D(),pA=V3(),pB=V3(),up=V3();
 const fl=F.map((f,i)=>({c:dirLL(f[0],f[1]).multiplyScalar(R),la:f[0],lo:f[1],ph:i*1.7,r:1.4+(i%4)*.5,sp:.05+(i%3)*.02,alt:28+(i%5)*7}));
 const ok=e=>e===3||e===5||e>=6;
 anim(sp,null,t=>{if(CUR!==sp)return;const vis=ok(ERA)&&rig.alt<700;im.visible=vis;if(!vis)return;let k=0;
  for(const f of fl){const near=camera.position.distanceTo(f.c)<950;for(let j=0;j<per;j++,k++){if(!near){o.position.set(0,0,0);o.scale.setScalar(0);o.updateMatrix();im.setMatrixAt(k,o.matrix);continue}
   const a=t*f.sp+f.ph+j*.05,jr=(j%4)*.07,jz=Math.floor(j/4)*.06;const la=f.la+Math.cos(a)*f.r+Math.sin(t*.7+j)*.05+jz,lo=f.lo+Math.sin(a)*f.r/Math.cos(f.la*D2R)+jr;
   const h=Math.max(sp.gh(la,lo),0)+f.alt+Math.sin(t*.9+j*1.3)*2;dirLL(la,lo,pA).multiplyScalar(R+h);const a2=a+.01;dirLL(f.la+Math.cos(a2)*f.r+jz,f.lo+Math.sin(a2)*f.r/Math.cos(f.la*D2R)+jr,pB).multiplyScalar(R+h);
   up.copy(pA).normalize();o.position.copy(pA);o.up.copy(up);o.lookAt(pB);o.rotateY(-Math.PI/2);o.scale.setScalar(1.6+(j%3)*.3);o.updateMatrix();im.setMatrixAt(k,o.matrix)}}
  im.instanceMatrix.needsUpdate=true})}

/* ---------- small geometry kit ---------- */
const kc=(r,h,s)=>new THREE.ConeGeometry(r,h,s||7);
const kcy=(r0,r1,h,s)=>new THREE.CylinderGeometry(r0,r1,h,s||7);
const ks=(r,w,hh)=>new THREE.SphereGeometry(r,w||8,hh||6);
const ki=(r,d)=>new THREE.IcosahedronGeometry(r,d||0);
const kiS=(r)=>{const g=new THREE.IcosahedronGeometry(r,0);const p=g.attributes.position,n=g.attributes.normal,v=V3();for(let i=0;i<p.count;i++){v.set(p.getX(i),p.getY(i),p.getZ(i)).normalize();n.setXYZ(i,v.x,v.y,v.z)}return g};
const ko=(r)=>new THREE.OctahedronGeometry(r,0);
const kb=(x,y,z)=>new THREE.BoxGeometry(x,y,z);
const kd=(r)=>new THREE.DodecahedronGeometry(r,0);
function ktube(pts,r,seg,rs){return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),seg||20,r,rs||5,false)}
function spiralPts(ph,h,r0,r1,turns,n){const pts=[];n=n||12;for(let i=0;i<=n;i++){const t=i/n,a=ph+t*Math.PI*2*turns;const r=lerp(r0,r1,t);pts.push(V3(Math.cos(a)*r,t*h,Math.sin(a)*r))}return pts}
function vcolY(geo,fn){geo=geo.index?geo.toNonIndexed():geo;const p=geo.attributes.position,n=p.count,c=new Float32Array(n*3),t=new THREE.Color();for(let i=0;i<n;i++){fn(p.getX(i),p.getY(i),p.getZ(i),t);c[i*3]=t.r;c[i*3+1]=t.g;c[i*3+2]=t.b}geo.setAttribute('color',new THREE.BufferAttribute(c,3));if(geo.attributes.uv)geo.deleteAttribute('uv');return geo}
function mergeV(gs){return THREE.BufferGeometryUtils.mergeBufferGeometries(gs)}

const TREE={
 twist:()=>G([[ktube(spiralPts(0,10,.95,.45,1.4),.34,24),'#5b4733'],[ktube(spiralPts(Math.PI,10,.95,.45,1.4),.3,24),'#4c3b2b'],
  [kcy(2.5,2.2,.4,10),'#4a3a28',{p:[0,10.1,0]}],[ki(1,1),'#2f7550',{p:[0,11.1,0],s:[3.1,1.15,3.1]}],[ki(1,1),'#3c8a58',{p:[1.6,10.6,.9],s:[1.9,.95,1.9]}],[ki(1,1),'#2a6646',{p:[-1.5,10.7,-1],s:[1.8,.9,1.8]}],
  [ki(1,0),'#3a7a4a',{p:[.6,5.6,0],s:[1.5,.5,1.4]}],[ki(1,0),'#336e44',{p:[-.7,6.4,.4],s:[1.2,.45,1.2]}]]),
 twistBare:()=>G([[ktube(spiralPts(0,10,.95,.45,1.4),.34,24),'#6a5a4a'],[ktube(spiralPts(Math.PI,10,.95,.45,1.4),.3,24),'#5e4e40'],[kcy(2.5,2.2,.4,10),'#e8eef2',{p:[0,10.2,0]}],[ki(1,0),'#f2f6f8',{p:[0,10.6,0],s:[2.2,.4,2.2]}]]),
 platform:()=>{const P=[[kcy(.7,1.2,15,8),'#6a5236',{p:[0,7.5,0]}]];for(let i=0;i<4;i++){const a=i*1.57+.4;P.push([ktube([V3(0,.3,0),V3(Math.cos(a)*1.6,-.2,Math.sin(a)*1.6),V3(Math.cos(a)*2.6,-.6,Math.sin(a)*2.6)],.32,8,5),'#5b4630'])}
  [[5.6,0,2],[8.4,2.1,-2.2],[11.2,4.2,1.9]].forEach(([y,a,o])=>{const x=Math.cos(a)*o,z=Math.sin(a)*o;P.push([ktube([V3(0,y-1.4,0),V3(x*.5,y-.6,z*.5),V3(x,y,z)],.25,8,5),'#5b4630']);P.push([kcy(2.6,2.3,.22,12),'#8a6a44',{p:[x,y,z]}]);P.push([ki(1,1),'#4a8a4c',{p:[x*1.1,y+1.1,z*1.1],s:[2.2,.9,2.2]}])});
  P.push([ki(1,1),'#3b7c44',{p:[0,15.4,0],s:[4.6,2.2,4.6]}]);P.push([ki(1,1),'#467f3c',{p:[2.2,14,1.2],s:[2.8,1.5,2.8]}]);P.push([ki(1,1),'#3f7440',{p:[-2,14.4,-1.4],s:[2.6,1.4,2.6]}]);for(let i=0;i<7;i++){const a=i*.9;P.push([kcy(.05,.03,3.4,3),'#4f7a3a',{p:[Math.cos(a)*3.4,12.2,Math.sin(a)*3.4]}])}return G(P)},
 broad:()=>G([[kcy(.28,.45,5,6),'#4f3b2a',{p:[0,2.5,0]}],[ki(1,1),'#2f6b3c',{p:[0,6,0],s:[2.4,2,2.4]}],[ki(1,1),'#377844',{p:[1.2,5,.6],s:[1.6,1.4,1.6]}],[ki(1,1),'#285e36',{p:[-1,5.4,-.8],s:[1.5,1.3,1.5]}]]),
 rain:()=>G([[kcy(.3,.5,9,6),'#4a3a28',{p:[0,4.5,0]}],[ki(1,1),'#1f5a32',{p:[0,9.4,0],s:[3,1.6,3]}],[ki(1,1),'#2a6a3a',{p:[1.4,8.2,1],s:[1.8,1,1.8]}],[ktube([V3(.2,8,0),V3(1.5,5,.5),V3(1.8,2,.7)],.06,8),'#3f6a34'],[ktube([V3(-.2,8.4,0),V3(-1.4,6,-.6),V3(-1.6,3.5,-.9)],.05,8),'#3f6a34'],
  ...[0,1,2,3,4].map(i=>{const a=i*1.26;const l=kc(.4,2.4,4);return[l,'#2f7a3a',{p:[Math.cos(a)*1.2,1.1,Math.sin(a)*1.2],r:[Math.sin(a)*.9,0,-Math.cos(a)*.9]}]})]),
 conifer:()=>G([[kcy(.2,.32,3,6),'#4a3826',{p:[0,1.5,0]}],[kc(1.8,3.2,8),'#2c5e3a',{p:[0,3.4,0]}],[kc(1.4,2.8,8),'#336a42',{p:[0,4.9,0]}],[kc(.9,2.2,8),'#3a744a',{p:[0,6.2,0]}]]),
 dead:()=>G([[kcy(.18,.4,7,5),'#5a4a3c',{p:[0,3.5,0]}],[kcy(.06,.12,3,4),'#5a4a3c',{p:[.8,5.5,0],r:[0,0,-.9]}],[kcy(.05,.1,2.6,4),'#5a4a3c',{p:[-.7,4.6,.3],r:[.3,0,.9]}],[kcy(.04,.08,2,4),'#5a4a3c',{p:[.2,6.8,-.5],r:[-.6,0,.2]}]]),
 crystal:()=>G([[kcy(.18,.3,4,5),'#7fc8d8',{p:[0,2,0]}],[ko(1),'#bff4ff',{p:[0,5,0],s:[.9,2.4,.9]}],[ko(1),'#a6eaff',{p:[.9,3.8,.3],s:[.5,1.5,.5],r:[0,0,-.6]}],[ko(1),'#d6faff',{p:[-.8,4.2,-.4],s:[.45,1.3,.45],r:[.3,0,.7]}],[ko(1),'#9fe0f4',{p:[.2,3.2,.9],s:[.35,1,.35],r:[.8,0,0]}]]),
 blood:()=>bloodGeo(),
 mush:()=>G([[kcy(.6,.9,6,8),'#e8e0d4',{p:[0,3,0]}],[ks(3,14,7),'#b48ad0',{p:[0,6.2,0],s:[1,.42,1]}],[kcy(2.6,1.2,.6,14),'#f0e8f4',{p:[0,5.9,0]}],[ks(.35,6,4),'#f4eaff',{p:[1.4,7.2,.4]}],[ks(.3,6,4),'#f4eaff',{p:[-1,7.3,-1]}],[ks(.25,6,4),'#f4eaff',{p:[.2,7.4,-1.6]}]]),
 mush2:()=>G([[kcy(.35,.5,3.2,7),'#ddd2e4',{p:[0,1.6,0]}],[ks(1.8,12,6),'#7c5a9a',{p:[0,3.3,0],s:[1,.55,1]}],[kcy(.25,.35,2,6),'#ddd2e4',{p:[1.6,1,.4]}],[ks(1,10,5),'#e8d8f4',{p:[1.6,2,.4],s:[1,.5,1]}]]),
 succ:()=>G([[kcy(.7,.8,4,9),'#6f9a6a',{p:[0,2,0]}],[ks(.75,9,6),'#7fa878',{p:[0,4,0],s:[1,.7,1]}],[ks(1.2,9,6),'#86ac70',{p:[1.5,1,.3]}],[kcy(.4,.5,2.6,8),'#6a9268',{p:[-1.2,1.3,-.5]}],[ks(.42,8,5),'#7fa878',{p:[-1.2,2.6,-.5],s:[1,.7,1]}],[ks(.18,6,4),'#f4c0d8',{p:[0,4.55,0]}]]),
 spire:()=>vcolY(kc(1,1,7),(x,y,z,t)=>{t.set('#8a8274').lerp(C('#5f8f5a'),sm(-.2,.3,y+n3(x*3,y*6,z*3)*.25-.12))}),
 egg:()=>vcolY(new THREE.SphereGeometry(1,16,12),(x,y,z,t)=>{t.set('#7d7a68').lerp(C('#4f7a48'),sm(.1,.7,y+n3(x*4,y*4,z*4)*.5-.25));if(Math.abs(Math.sin(y*9+x*3))>.94)t.multiplyScalar(.65)}),
 palm:()=>{const P=[[ktube([V3(0,0,0),V3(.4,3,0),V3(1,6,.2)],.22,10),'#7a6a4e']];for(let i=0;i<7;i++){const a=i/7*6.28;P.push([ktube([V3(1,6,.2),V3(1+Math.cos(a)*1.6,6.6,.2+Math.sin(a)*1.6),V3(1+Math.cos(a)*2.8,5.4,.2+Math.sin(a)*2.8)],.12,8,3),'#3f8a3c'])}return G(P)},
};
const BLD={
 house:(c,r)=>G([[kb(1.6,1.2,1.6),c||'#c8b89a',{p:[0,.6,0]}],[kc(1.35,.9,4),r||'#7a3a2a',{p:[0,1.65,0],r:[0,.785,0]}]]),
 stonehouse:()=>G([[kb(2,1.2,1.4),'#8a8070',{p:[0,.6,0]}],[kb(2.2,.25,1.6),'#5a4632',{p:[0,1.32,0]}],[kb(.4,.7,.05),'#2a2018',{p:[.3,.35,.71]}]]),
 pyr:(n)=>{const P=[];for(let i=0;i<n;i++){const s=1-i/n;P.push([kb(s*2,1/n*1.6,s*2),i===n-1?'#bfeaf4':(i%2?'#b49868':'#c4a878'),{p:[0,(i+.5)/n*1.6,0]}])}return G(P)},
 tower:(c,rc)=>G([[kcy(.5,.6,4,10),c||'#ebe7de',{p:[0,2,0]}],[kc(.7,1.4,10),rc||'#9a948a',{p:[0,4.7,0]}],[kcy(.62,.62,.25,10),'#d0ccc2',{p:[0,4,0]}]]),
 dome:()=>G([[new THREE.SphereGeometry(1,16,8,0,6.283,0,1.57),'#d6dee4'],[kcy(1.02,1.02,.18,16),'#a8b4bc',{p:[0,.09,0]}],[kcy(.05,.05,.8,4),'#c8d0d8',{p:[0,1.3,0]}]]),
 metalTower:()=>G([[kcy(.5,.8,1,6),'#c8d2d8',{p:[0,.5,0]}],[kcy(.32,.5,.12,6),'#8a969e',{p:[0,1.02,0]}]]),
 black:()=>G([[kcy(.18,.9,1,5),'#15161b',{p:[0,.5,0]}],[kb(1.4,.02,.06),'#3a1a22',{p:[0,.7,0]}]]),
 cannon:()=>G([[kcy(1.2,1.5,1,8),'#4a4a44',{p:[0,.5,0]}],[kcy(.45,.6,4.6,10),'#3a3a36',{p:[0,2.4,1],r:[.7,0,0]}],[kcy(.62,.62,.4,10),'#5a5a52',{p:[0,4,2.4],r:[.7,0,0]}]]),
};
const _gc={};function geoC(k,...a){const key=k+a.join();return _gc[key]||(_gc[key]=(TREE[k]||BLD[k])(...a))}

/* glowing line across the ground (lava, cracks, glowing rivers) */
function glowArc(pa,pb,w,col,eras,alt,op,sea){const g=new THREE.Group();const A=dirLL(...pa),B=dirLL(...pb);const n=Math.max(8,Math.round(angDeg(A,B)*4));const mtl=GL(col,op===undefined?.9:op);
 for(let i=0;i<n;i++){const t=i/n,t2=(i+1)/n;const p=A.clone().lerp(B,t).normalize(),q=A.clone().lerp(B,t2).normalize();p.add(V3(0,0,0));
  const la=llDir(p),lb=llDir(q);const hA=sea?BSP.ghRaw(...la):BSP.gh(...la),hB=sea?BSP.ghRaw(...lb):BSP.gh(...lb);
  const pa2=p.clone().multiplyScalar(R+hA+alt),pb2=q.clone().multiplyScalar(R+hB+alt);const seg=new THREE.Mesh(kb(w*(.7+.6*h3(i,1,2)),.25,pa2.distanceTo(pb2)*1.05),mtl);seg.position.copy(pa2).add(pb2).multiplyScalar(.5);seg.up.copy(p);seg.lookAt(pb2);g.add(seg)}
 g.renderOrder=2;addE(g,eras);const mid=A.clone().add(B).normalize().multiplyScalar(R+30);cull(g,mid,angDeg(A,B)*R*D2R*.6+40,2400);return g}
/* a flat lake surface */
const lakeMat=new THREE.MeshStandardMaterial({color:'#2f7f96',roughness:.08,metalness:.35,transparent:true,opacity:.86});
const LAKEZ=[];function lake(la,lo,r,alt,col,eras){LAKEZ.push([dirLL(la,lo),r/R/D2R*1.15]);const m=new THREE.Mesh(new THREE.CircleGeometry(r,40),col?new THREE.MeshStandardMaterial({color:col,roughness:.1,metalness:.3,transparent:true,opacity:.88,emissive:col,emissiveIntensity:.15}):lakeMat);m.rotation.x=-Math.PI/2;const g=new THREE.Group();g.add(m);fr(la,lo,alt,0,g,false);g.position.setLength(R+alt);addE(g,eras);return g}
/* soft fog banks made of sprites */
function fogBank(la,lo,r,n,alt,col,op,seed,eras,size){const g=new THREE.Group();const Rn=rnd(seed);const mtl=new THREE.SpriteMaterial({map:smokeTex,color:col||'#eef2f4',transparent:true,opacity:op||.5,depthWrite:false});
 const L=[];for(let i=0;i<n;i++){const a=Rn()*6.28,d=Math.sqrt(Rn())*r;const lat=la+Math.cos(a)*d,lon=lo+Math.sin(a)*d/Math.cos(la*D2R);const s=new THREE.Sprite(mtl);const sz=(size||40)*(.6+Rn()*.9);s.scale.set(sz,sz*.55,1);
  const base=dirLL(lat,lon).multiplyScalar(R+Math.max(BSP.gh(lat,lon),0)+alt+Rn()*alt*.6);s.position.copy(base);s.userData.b=base.clone();s.userData.ph=Rn()*6;g.add(s);L.push(s)}
 g.userData.drift=L;anim(BSP,g,()=>{mtl.opacity=(op||.5)*(1-sm(500,1500,rig.alt))});addE(g,eras);cull(g,dirLL(la,lo).multiplyScalar(R+alt),r*R*D2R+60,3000);return g}

let RQ=null;
function buildRongqiu(){
 const sp=makePlanet('rongqiu',{N:224,height:rqHeight,canyon:rqCanyon,colors:rqColors,colorKey:e=>e===1?'b':e===4?'s':e>=6?'w':'l',canyonOf:e=>e>=3?1:0,
  ocean:{deep:'#0b2f4a',shal:'#1d7f8c',foam:'#eef6f2',sky:'#9cc8f0'},atm:'#5fa8ff',rock:'#6e6458',sunLon:-30});
 RQ=sp;
 const gh=sp.gh,ghR=sp.ghRaw;
 makeCover(sp,rqBiome);
 rqRivers(sp);rqTowns(sp);rqHomeTree(sp);rqJungle(sp);rqEcho(sp);rqMountains(sp);rqLife(sp);planetMeteors(sp);planetStorms(sp);rqJumpers(sp);rqCanon(sp);rqCanon2(sp);rqCanon3(sp);rqLand(sp);rqSky(sp);rqEarly(sp);rqCloud(sp);rqSeabed(sp);rqIceWake(sp);rqLinMark(sp);rqForests(sp);rqRocks(sp);rqCumulus(sp);rqFlocks(sp);
 // ---------- ice ----------
 const iceMat=detailMat(new THREE.MeshStandardMaterial({color:'#dfeef5',roughness:.42,metalness:.05,transparent:true,opacity:.95,vertexColors:true}),{bump:.7,mott:1.4,freq:.6});
 // the ice turns blue-green where the crystal mountain's light comes up through it
 const JZ=dirLL(71,34),ICEC=C('#ffffff'),ICET=C('#8fdcef'),ICED=C('#c8e4ec');
 const cap=(maxLat,eras,south)=>{const g=new THREE.SphereGeometry(R+1.4,320,72,0,Math.PI*2,0,(90-maxLat)*D2R);{const P=g.attributes.position,n=P.count,cl=new Float32Array(n*3),d=V3(),c=new THREE.Color();const rag=(90-maxLat)*D2R;for(let i=0;i<n;i++){d.set(P.getX(i),P.getY(i),P.getZ(i)).normalize();{const ph=Math.acos(Math.max(-1,Math.min(1,d.y)));const k=ph/rag;if(k>.72){const lon=Math.atan2(d.x,d.z);const nz=(fbm(Math.cos(lon)*5.3+7,Math.sin(lon)*5.3+2,maxLat*.01,4)-.5)*2+(fbm(Math.cos(lon)*11+3,Math.sin(lon)*11+9,1.7,3)-.5)*.42+(fbm(Math.cos(lon)*29+5,Math.sin(lon)*29+1,2.3,2)-.5)*.1;const ph2=ph*(1+(k-.72)/.28*nz*.22*(maxLat<50?1.6:1));const sn=Math.sin(ph2)/Math.max(1e-6,Math.sin(ph));P.setXYZ(i,P.getX(i)*sn,Math.cos(ph2)*(R+1.4),P.getZ(i)*sn);d.set(P.getX(i),P.getY(i),P.getZ(i)).normalize()}}if(south)d.y=-d.y,d.z=-d.z;const a=angDeg(d,JZ);const nz=n3(d.x*40,d.y*40,d.z*40);c.copy(ICEC).lerp(ICED,sm(.45,.75,nz)*.5);if(!south)c.lerp(ICET,(1-sm(1.5,9,a+(nz-.5)*3))*.85);cl[i*3]=c.r;cl[i*3+1]=c.g;cl[i*3+2]=c.b}g.setAttribute('color',new THREE.BufferAttribute(cl,3))}const m=new THREE.Mesh(g,iceMat);if(south)m.rotation.x=Math.PI;m.renderOrder=1;addE(m,eras,true);return m};
 cap(66,[1,2,3,5,6,7,8,9,10,11,12]);cap(36,[4]);cap(70,[1,2,3,4,5,6,7,8,9,10,11,12],true);
 // ---------- era 1: the sea of origins ----------
 {const g=new THREE.Group();const beam=new THREE.Mesh(new THREE.CylinderGeometry(3,14,520,24,1,true),new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,uniforms:{uT:GT},
   vertexShader:'varying vec2 vU;void main(){vU=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
   fragmentShader:'uniform float uT;varying vec2 vU;void main(){float a=smoothstep(0.,.25,vU.y)*(1.-smoothstep(.6,1.,vU.y))*(.55+.45*sin(vU.x*40.+uT*2.))*(.6+.4*sin(vU.y*30.-uT*4.));gl_FragColor=vec4(vec3(1.,.86,.48)*a*.55,1.);}'}));
  beam.position.y=260;g.add(beam);g.add(at(glowSprite('#ffe6a0',90,.9),0,8,0));g.add(at(glowSprite('#fff4d0',26,1),0,4,0));
  g.add(emitter({n:260,life:6,speed:-14,spread:.25,size:2.4,dir:[0,1,0],col:'#ffe9a8',col2:'#fff8e8',op:.9,area:[30,10,30],fadeIn:.05}));at(g.children[g.children.length-1],0,90,0);
  const rip=new THREE.Mesh(new THREE.RingGeometry(10,13,48),GL('#fff0c0',.5));rip.rotation.x=-Math.PI/2;rip.position.y=.6;g.add(rip);
  fr(-2,46,0,0,g,false);g.position.setLength(R+.5);addE(g,[1],true);cull(g,null,300,4500);px('shalin',g.position.clone().add(g.position.clone().normalize().multiplyScalar(20)),24);
  anim(sp,g,(t)=>{const k=(t*.25)%1;rip.scale.setScalar(.5+k*2.5);rip.material.opacity=.5*(1-k)})}
 // green carpet across the shallow sea floor
 {const pts=scatter(2200,-8,40,7,11,(la,lo,h)=>ghR(la,lo)<-1&&ghR(la,lo)>-34);const m=new THREE.MeshStandardMaterial({color:'#3fbf6a',emissive:'#1f8a46',emissiveIntensity:.3,roughness:.6,alphaMap:glowTex,transparent:true,depthWrite:false});
  inst(new THREE.CircleGeometry(1,16),m,pts,(o,p)=>{frameLL(sp,p[0],p[1],0,p[3]*6,o,false);o.position.setLength(R+ghR(p[0],p[1])+.9);o.rotateX(-Math.PI/2);o.scale.setScalar(2.6+p[3]*3.4)},[1,2],{tint:p=>C('#ffffff').offsetHSL((p[3]-.5)*.06,0,(p[3]-.5)*.2)});
  px('lvtan',dirLL(-8,40).multiplyScalar(R-6),60,{maxD:2600})}
 // the first base: a cluster of breeding pods on the sea floor
 {const g=new THREE.Group();const pm=new THREE.MeshStandardMaterial({color:'#9fd88a',emissive:'#4a9a5a',emissiveIntensity:.5,roughness:.4,transparent:true,opacity:.9});
  for(let i=0;i<9;i++){const s=new THREE.Mesh(sgeo(12),pm);const a=i*2.4,r=i?2+i*.6:0;s.position.set(Math.cos(a)*r,1.4+(i%3)*.5,Math.sin(a)*r);s.scale.set(1.6,1.2+(i%2)*.4,1.6);g.add(s)}
  fr(-5,45.5,0,0,g,false);g.position.setLength(R+ghR(-5,45.5)+.2);addE(g,[1]);cull(g,null,30,1600);px('fanzhi',g.position,8);anim(sp,g,t=>g.children.forEach((s,i)=>s.scale.y=1.2+Math.sin(t*1.5+i)*.2))}
 // the abyss: glowing lava seams, black smokers
 glowArc([-20,30],[-32,42],3,'#ff4a2a',[1,2,3,4,5,6,7,8,9,10,11,12],.8,.75,true);
 {const g=new THREE.Group();for(let i=0;i<5;i++){const c=new THREE.Mesh(kc(1.6,7,7),M('#1c1816',{roughness:.9}));c.position.set(i*5-10,3.5,Math.sin(i)*4);g.add(c)}
  const sm2=emitter({n:180,life:8,speed:8,spread:.18,size:8,dir:[0,1,0],col:'#5a5450',col2:'#2a2826',op:.55,add:false,tex:smokeTex,area:[24,2,8],wander:1.5});sm2.position.y=6;g.add(sm2);
  g.add(at(glowSprite('#ff5a2a',70,.6),0,4,0));fr(-26,36,0,0,g,false);g.position.setLength(R+ghR(-26,36)+.3);addE(g,[1,2,3,4,5,6,7,8,9,10,11,12]);cull(g,null,120,2200);px('abyss',g.position.clone().setLength(R-4),40,{maxD:2600})}
 // crystal mountain of the frozen sea: pillars of crystal carrying daylight down into the deep
 {const cmx=new THREE.MeshStandardMaterial({color:'#c9f6ff',emissive:'#4fb7d4',emissiveIntensity:.55,roughness:.08,metalness:.1,flatShading:true,transparent:true,opacity:.93});const g=new THREE.Group();const Rn=rnd(5);
  for(let i=0;i<9;i++){const c=new THREE.Mesh(ko(1),cmx);c.scale.set(6-i*.45,46+i*8,6-i*.45);c.position.set((Rn()-.5)*18,6,(Rn()-.5)*18);c.rotation.set((Rn()-.5)*.35,Rn()*3,(Rn()-.5)*.35);g.add(c)}
  for(let i=0;i<40;i++){const c=new THREE.Mesh(ko(1),cmx);const a=Rn()*6.28,d=14+Rn()*20;c.position.set(Math.cos(a)*d,1,Math.sin(a)*d);c.scale.set(1.2,4+Rn()*6,1.2);c.rotation.set((Rn()-.5)*.6,Rn()*3,(Rn()-.5)*.6);g.add(c)}
  const beam=new THREE.Mesh(new THREE.CylinderGeometry(8,22,90,20,1,true),new THREE.MeshBasicMaterial({color:'#bff4ff',transparent:true,opacity:.12,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));beam.position.y=-40;g.add(beam);
  g.add(sparkles(Array.from({length:120},()=>V3((Rn()-.5)*50,Rn()*80,(Rn()-.5)*50)),'#e8fdff',1.6,1));g.add(at(glowSprite('#bff4ff',120,.35),0,40,0));
  fr(71,34,0,0,g,false);g.position.setLength(R+1);addE(g);cull(g,null,90,3200);px('jjzs',g.position.clone().add(g.position.clone().normalize().multiplyScalar(40)),40)}
 // holes in the ice where the ice-crystal beasts hunt
 {const pts=scatter(26,74,24,6,12);const hm=new THREE.MeshStandardMaterial({color:'#0f3a52',roughness:.1,metalness:.2});inst(new THREE.CircleGeometry(1,16),hm,pts,(o,p)=>{frameLL(sp,p[0],p[1],0,0,o,false);o.position.setLength(R+1.6);o.rotateX(-Math.PI/2);o.scale.setScalar(2.5+p[3]*4)},[1,2,3,5,6,7,8,9,10,11,12])}

 // ---------- north continent ----------
 // the cliffs of the landing: picked-clean bones and sea mist
 {const pts=scatter(60,9.2,2,2.4,21,onLand);const bone=G([[ktube([V3(-1.6,0,0),V3(-1,1.4,0),V3(0,1.9,0),V3(1,1.4,0),V3(1.6,0,0)],.09,12),'#ece4d0'],[kcy(.08,.08,3.4,4),'#e2dac6',{p:[0,.1,0],r:[0,0,Math.PI/2]}]]);
  inst(bone,VC({roughness:.6}),pts,(o,p)=>{frameLL(sp,p[0],p[1],-.2,p[3]*6,o);o.scale.setScalar(.6+p[3]*.8)},[2,3,4,5,6,7,8,9,10,11,12])}
 fogBank(8.6,2,2.2,16,6,'#e4ecee',.4,22,[2,3]);
 // spires: moss-covered hollow stone, thick as a forest
 {rqSpires(sp);
  px('mtzm',()=>dirLL(15,-1).multiplyScalar(R+gh(15,-1)+18),7);px('spires',dirLL(15,-1).multiplyScalar(R+gh(15,-1)+10),40,{maxD:1800})}
 // endless desert: wind-carved dunes, blowing sand, and the rare storm that only rains here
 {const gs=new THREE.Group();const sand=emitter({n:300,life:4,speed:9,spread:.35,size:3.2,dir:[1,.08,.3],col:'#e0bb84',op:.35,add:false,tex:smokeTex,area:[160,4,160],wander:1.5});gs.add(sand);
  fr(24,-5,3,0,gs);addE(gs,[2,3,5,6,7,8,9,10,11,12]);cull(gs,null,200,1600);
  const storm=new THREE.Group();const cl=new THREE.SpriteMaterial({map:smokeTex,color:'#5c6470',transparent:true,opacity:.75,depthWrite:false});
  for(let i=0;i<14;i++){const s=new THREE.Sprite(cl);s.scale.set(60+i*3,32,1);s.position.set((h3(i,1,1)-.5)*70,58+h3(i,2,1)*10,(h3(i,3,1)-.5)*40);storm.add(s)}
  const rain=emitter({n:600,life:1.4,speed:-40,spread:.05,size:1.1,dir:[0,1,0],col:'#bcd0e0',op:.55,add:false,area:[80,4,50],fadeIn:.02});rain.position.y=56;storm.add(rain);
  const fl=new THREE.PointLight(0xcfe0ff,0,260);fl.position.y=60;storm.add(fl);addE(storm,[2,3,5,6,7]);
  let fv=0,nx=5,f2=-1;anim(sp,storm,(t,dt)=>{const k=(t/90)%1;const la=19+k*12,lo=-14+k*16;frameLL(sp,la,lo,0,.4,storm);storm.visible=!storm.userData.eraHide&&Math.sin(k*Math.PI)>.15;
   // now and then a flash (sometimes a double flicker), fading out instead of blinking
   dt=dt||.016;nx-=dt;if(nx<=0){nx=7+Math.random()*12;fv=1;f2=Math.random()<.4?.14:-1}if(f2>0){f2-=dt;if(f2<=0){fv=Math.max(fv,.7);f2=-1}}fv=Math.max(0,fv-dt*3.5);fl.intensity=fv*fv*1.4})}
 // the oasis lake with its ring of tentacle plants
 {lake(27,-11,9,.4,null,[2,3]);const pts=Array.from({length:22},(_,i)=>{const a=i/22*6.28;return[27+Math.cos(a)*.62,-11+Math.sin(a)*.7,0,(i*37%10)/10]});
  const ten=G([[ktube([V3(0,0,0),V3(.2,1.4,0),V3(.8,2.6,.1),V3(1.6,3,.2)],.12,10),'#5a8a3e'],[ktube([V3(0,0,0),V3(-.2,1.2,.2),V3(-.7,2.2,.6),V3(-1.4,2.4,1)],.1,10),'#4f7d36']]);
  inst(ten,swayMat({roughness:.7},.02),pts,(o,p)=>{frameLL(sp,p[0],p[1],0,p[3]*6.28,o);o.scale.setScalar(1.6+p[3])},[2,3]);px('oasis',dirLL(27,-11).multiplyScalar(R+3),14)}
 // the great pit of the Inca: stepped walls, cave mouths, a whirlpool down to the underworld
 {const g=new THREE.Group();const wm=detailMat(new THREE.MeshStandardMaterial({color:'#a07a4e',roughness:.9}),{bump:.6});
  for(let i=0;i<5;i++){const r=13+i*7.5;const t=new THREE.Mesh(new THREE.TorusGeometry(r,1.4,5,64),wm);t.rotation.x=Math.PI/2;t.position.y=-1+i*2.6;t.scale.z=.5;g.add(t)}
  const holes=new THREE.InstancedMesh(new THREE.CircleGeometry(1,10),M('#1a120c'),48);const o3=new THREE.Object3D();for(let i=0;i<48;i++){const ring=i%4,a=i*.53;const r=13.5+ring*7.5;o3.position.set(Math.cos(a)*r,ring*2.6+.4,Math.sin(a)*r);o3.lookAt(0,o3.position.y,0);o3.scale.set(1.1,.8,1);o3.updateMatrix();holes.setMatrixAt(i,o3.matrix)}g.add(holes);
  const wh=new THREE.Mesh(new THREE.CircleGeometry(10,48),new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{uT:GT},vertexShader:'varying vec2 vU;void main(){vU=uv-.5;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
   fragmentShader:'uniform float uT;varying vec2 vU;void main(){float r=length(vU)*2.;float a=atan(vU.y,vU.x);float s=sin(a*5.+r*14.-uT*3.)*.5+.5;vec3 c=mix(vec3(.02,.12,.18),vec3(.35,.7,.8),s*r);c=mix(vec3(0.),c,smoothstep(.0,.35,r));gl_FragColor=vec4(c,.92*smoothstep(1.,.9,r));\n#include <tonemapping_fragment>\n#include <encodings_fragment>\n}'}));
  wh.rotation.x=-Math.PI/2;wh.position.y=2.15;g.add(wh);
  const fall=emitter({n:160,life:2.2,speed:2,spread:.4,size:2.4,dir:[-1,-.2,0],grav:5,col:'#cfeaf4',op:.5,add:false,tex:smokeTex,area:[3,1,3]});fall.position.set(36,9,0);g.add(fall);
  fr(20,-13,0,0,g,false);g.position.setLength(R-1.8);addE(g,[2,3,4,5,6,7,8,9,10,11,12]);cull(g,null,60,2200);px('inca_pit',g.position.clone().add(g.position.clone().normalize().multiplyScalar(8)),36)}
 // the lava rift: a river of red light, and Lin's cone-shaped bases standing like rocks
 glowArc([20,4],[22,14],2.4,'#ff6a2a',[2,3],.7,.95);
 {const pts=scatter(26,21,9,3.2,41,onLand);inst(geoC('spire'),VC({roughness:.85}),pts,(o,p)=>{frameLL(sp,p[0],p[1],-.4,p[3]*6,o);o.scale.set(1.6,5+p[3]*6,1.6)},[2,3],{tint:()=>C('#8a7a6a')});
  const g=new THREE.Group();const em=emitter({n:220,life:3,speed:4,spread:.6,size:1.6,dir:[0,1,0],col:'#ffb060',col2:'#ff3010',op:.9,area:[160,2,24],wander:1});g.add(em);g.add(at(glowSprite('#ff5a2a',160,.25),0,4,0));
  fr(21,9,1,1.2,g);addE(g,[2,3]);cull(g,null,120,1800);px('lavarift',g.position,26)}
 const cracks=glowArc([23,-7],[25,-2],1.1,'#ff7d3b',[2],.5,.9);
 // the glowing woods and the dark plain, split by a river
 {const L=scatter(1400,29,8,2.4,9,onLand).filter(p=>p[1]>7.4);const pts=L.map(p=>dirLL(p[0],p[1]).multiplyScalar(R+p[2]+.5));const sp2=sparkles(pts,'#8affdd',1.1,.85,1);addE(sp2,[2,3,5,6,7,8,9,10,11,12]);cull(sp2,dirLL(29,8.5).multiplyScalar(R),60,2000);
  const g=new THREE.Group();g.add(emitter({n:220,life:5,speed:1.2,spread:.8,size:1.4,dir:[0,1,0],col:'#9fffe0',op:.8,area:[60,2,60],wander:2.5}));fr(29,8.6,1,0,g);addE(g,[2,3,5,6,7,8,9,10,11,12]);cull(g,null,60,1400);
  glowArc([27.6,7.2],[30.6,7.6],1.6,'#5fc8e0',[2,3,4,5,6,7,8,9,10,11,12],.25,.55);
  // a fire in the glowing woods
  const f=new THREE.Group();f.add(emitter({n:140,life:1.2,speed:3.5,spread:.4,size:2.6,dir:[0,1,0],col:'#ffd070',col2:'#ff4010',op:.95,area:[4,.5,4]}));f.add(emitter({n:60,life:4,speed:2,spread:.5,size:5,dir:[0,1,0],col:'#4a4440',op:.35,add:false,tex:smokeTex,area:[3,1,3],wander:1}));
  const lg=new THREE.Mesh(kcy(.5,.5,7,6),M('#2a1c12'));lg.rotation.z=Math.PI/2;lg.position.y=.4;f.add(lg);const fl=new THREE.PointLight(0xff9040,1.4,40);fl.position.y=3;f.add(fl);
  fr(28.3,7,0,0,f);addE(f,[2]);cull(f,null,20,1200);px('glow',dirLL(29,8.2).multiplyScalar(R+gh(29,8.2)+4),30,{maxD:1600});px('glow',f.position.clone().add(f.position.clone().normalize().multiplyScalar(2)),5,{egg:'bbq',hide:()=>!f.visible,e:[2]});
  sp.fire={g:f,fl}}
 // the crystal cave of the Chibcha
 {const g=new THREE.Group();const mouth=new THREE.Mesh(new THREE.TorusGeometry(4.5,1.6,6,24),detailMat(M('#5a4a3a').clone(),{bump:.6}));mouth.rotation.x=Math.PI/2;g.add(mouth);
  const hole=new THREE.Mesh(new THREE.CircleGeometry(4,24),M('#0a0806'));hole.rotation.x=-Math.PI/2;hole.position.y=.2;g.add(hole);
  const cmx=new THREE.MeshStandardMaterial({color:'#a8f4ff',emissive:'#2bb7d4',emissiveIntensity:.85,roughness:.12,flatShading:true});
  for(let i=0;i<16;i++){const c=new THREE.Mesh(ko(1),cmx);const a=i/16*6.28;c.position.set(Math.cos(a)*(5+h3(i,1,1)*3),1.4,Math.sin(a)*(5+h3(i,2,1)*3));c.scale.set(.9,2.5+h3(i,3,1)*4,.9);c.rotation.set((h3(i,4,1)-.5)*.7,h3(i,5,1)*3,(h3(i,6,1)-.5)*.7);g.add(c)}
  g.add(at(glowSprite('#9ff2ff',26,.55),0,2,0));for(let i=0;i<6;i++)g.add(at(glowSprite('#ffe6a0',2.4,.9),0,-1-i*3,0));
  fr(28,9.6,0,0,g);addE(g,[2,3]);cull(g,null,20,1400);sp.crys=g;px('crystalcave',g.position.clone().add(g.position.clone().normalize().multiplyScalar(3)),10,{click:()=>boom(sp,g.position.clone().add(g.position.clone().normalize().multiplyScalar(4)),'#9ff2ff')})}
 // home tree: built in 43_wilds
 // the twisted jungle: trunks coiled in pairs, platforms ten metres wide, a lit second floor
 {const L=scatter(820,33,11,8.5,3,jungleOK);const set=(o,p)=>{frameLL(sp,p[0],p[1],-.6,p[3]*9,o);const k=(p[3]*7.13)%1;o.rotateX((k-.5)*.12);o.scale.setScalar(.38+p[3]*.75);o.scale.y*=.8+k*.45};
  inst(geoC('twist'),swayMat({roughness:.85},.0016),L,set,[2,3,5,6,7,8,9,10,11,12],{tint:(p)=>C('#ffffff').offsetHSL((p[3]-.5)*.05,0,(p[3]-.5)*.14)});
  inst(geoC('twistBare'),VC({roughness:.85}),L.filter((p,i)=>i%2===0),set,[4]);
  const g=new THREE.Group();g.add(emitter({n:260,life:6,speed:.6,spread:1,size:1.1,dir:[0,1,0],col:'#e8ff9a',op:.85,area:[140,10,140],wander:3}));fr(33,11,6,0,g);addE(g,[2,3,5,6,7,8,9,10,11,12]);cull(g,null,140,1200)}
 // the mountain: a lake in its crater, hot springs, glimmering eels
 {lake(36.6,14.2,14,R?0:0,'#2a7a9a',[2,3,4,5,6,7,8,9,10,11,12]).position.setLength(R+gh(36.6,14.2)+.8);
  const g=new THREE.Group();g.add(emitter({n:120,life:5,speed:3,spread:.5,size:6,dir:[0,1,0],col:'#f4f6f8',op:.3,add:false,tex:smokeTex,area:[16,1,16],wander:1.4}));
  g.add(sparkles(Array.from({length:50},(_,i)=>V3((h3(i,1,9)-.5)*20,.3,(h3(i,2,9)-.5)*20)),'#9fe8ff',1.4,1));fr(36.6,14.2,0,0,g);addE(g,[2,3,4,5,6,7,8,9,10,11,12]);cull(g,null,30,1600);
  px('peak',dirLL(36,15).multiplyScalar(R+gh(36,15)+6),26,{maxD:2600})}
 // floating isles of singing stone, with whole forests hanging upside down beneath them
 const isles=new THREE.Group();sp.scene.add(isles);
 [[34,10,52,9],[32.5,8,44,5],[35.5,12.6,60,6],[33,13.5,40,4],[36,9,48,4],[34.6,11.4,66,3]].forEach(([la,lo,alt,r],k)=>{const g=new THREE.Group();
  const rk=detailMat(new THREE.MeshStandardMaterial({color:'#7d7262',roughness:.95,flatShading:true}),{bump:.8});const rock=new THREE.Mesh(new THREE.ConeGeometry(r,r*1.4,9,3),rk);rock.rotation.x=Math.PI;rock.position.y=-r*.7;g.add(rock);
  const top=new THREE.Mesh(kcy(r*1.02,r,1,9),M('#4f8a4f'));g.add(top);
  const Rn=rnd(40+k);const tw=geoC('twist');const tm=VC({roughness:.85});for(let i=0;i<r*1.2;i++){const a=Rn()*6.28,d=Rn()*r*.7;const t=new THREE.Mesh(tw,tm);t.rotation.x=Math.PI;t.rotation.z=(Rn()-.5)*.5;t.position.set(Math.cos(a)*d,-r*.9,Math.sin(a)*d);t.scale.setScalar(.25+Rn()*.18);g.add(t)}
  for(let i=0;i<r*.6;i++){const a=Rn()*6.28,d=Rn()*r*.7;const t=new THREE.Mesh(tw,tm);t.position.set(Math.cos(a)*d,.4,Math.sin(a)*d);t.scale.setScalar(.2+Rn()*.12);g.add(t)}
  g.add(emitter({n:40,life:3,speed:3,spread:.1,size:1.6,dir:[0,-1,0],col:'#d8eef8',op:.45,add:false,tex:smokeTex,area:[r*.3,.4,r*.3]}));g.children[g.children.length-1].position.set(r*.8,0,0);
  g.userData={la,lo,alt};isles.add(g)});
 px('isles',()=>isles.children[0].position,22,{hide:()=>!isles.visible});
 // singing stones scattered over the north, rising whenever the moon comes close
 const stonePts=scatter(90,28,3,12,13,onLand);const stoneIM=new THREE.InstancedMesh(kd(1),detailMat(new THREE.MeshStandardMaterial({color:'#8d8270',roughness:.9,flatShading:true}),{bump:.5}),stonePts.length);stoneIM.frustumCulled=false;sp.scene.add(stoneIM);
 px('mingshi',()=>dirLL(26,4).multiplyScalar(R+gh(26,4)+4+sp.moonK*40),8);
 // the Inca airship of singing stone
 const airship=new THREE.Group();{const sk=detailMat(new THREE.MeshStandardMaterial({color:'#9b8a6a',roughness:.9,flatShading:true}),{bump:.7});const b=new THREE.Mesh(new THREE.SphereGeometry(1,18,10),sk);b.scale.set(15,3.4,4.4);airship.add(b);
  for(let i=-3;i<=3;i++){const w=new THREE.Mesh(new THREE.TorusGeometry(3.6,.45,5,12),M('#6a5a44'));w.rotation.y=Math.PI/2;w.position.x=i*3.8;airship.add(w)}
  for(let i=0;i<4;i++){const wo=new THREE.Group();const seg=[];for(let j=0;j<5;j++){const s=new THREE.Mesh(sgeo(8),M('#b98b5c'));s.position.set(0,j*.8,0);s.scale.setScalar(.7-j*.08);wo.add(s);seg.push(s)}wo.position.set(-8+i*5,3,0);airship.add(wo);airship.userData['w'+i]=seg}
  airship.add(at(emitter({n:80,life:2,speed:3,spread:.5,size:2.5,dir:[0,1,0],col:'#d8b888',op:.5,add:false,tex:smokeTex,area:[20,1,3]}),0,4,0));
  sp.scene.add(airship);px('mingshikt',()=>airship.position,16,{hide:()=>!airship.visible})}
 // canyon sea: in the snow, Lin roofs it over with clear chitin and the dragons winter inside
 {const g=new THREE.Group();const A=dirLL(15,6),B=dirLL(46,6);const n=24;const rm=new THREE.MeshStandardMaterial({color:'#dff4ff',transparent:true,opacity:.32,roughness:.05,metalness:.2,side:THREE.DoubleSide,depthWrite:false});
  for(let i=0;i<n;i++){const t=(i+.5)/n;const p=A.clone().lerp(B,t).normalize();const ll=llDir(p);const s=new THREE.Mesh(new THREE.CylinderGeometry(16,16,R*D2R*31/n*1.08,16,1,true,0,Math.PI),rm);const o=new THREE.Group();o.add(s);s.rotation.z=Math.PI/2;
   frameLL(sp,ll[0],ll[1],2,0,o,false);o.position.setLength(R+2);g.add(o)}
  const lp=scatter(80,30,6,14,51,(la,lo,h)=>Math.abs(lo-6)<.6).map(p=>dirLL(p[0],p[1]).multiplyScalar(R+1.5));g.add(sparkles(lp,'#ffd090',1.6,1,.5));
  addE(g,[4,5]);cull(g,dirLL(30,6).multiplyScalar(R),300,3000);px('canyon',dirLL(30,6).multiplyScalar(R+4),30,{maxD:2600})}
 // the giant frozen dead on the ice river: built in 43_wilds
 rqFrozenTree(sp);
 // jade harbour: houses, a pier, the ocean research tower with its telescope-wood
 {const pts=scatter(0,13.2,12,1.5,61,onLand);inst(geoC('house','#c9b896','#2f8a5a'),VC({roughness:.8}),pts,(o,p)=>{frameLL(sp,p[0],p[1],0,p[3]*3,o);o.scale.setScalar(1.3+p[3]*1.1)},[5,6,7,8,9,10,11,12],{tint:(p)=>C('#ffffff').offsetHSL(0,0,(p[3]-.5)*.2)});
  const g=new THREE.Group();const st=detailMat(M('#8a8070').clone(),{bump:.5});const tw=new THREE.Mesh(kcy(1.4,2,16,8),st);tw.position.y=8;g.add(tw);const sc2=new THREE.Mesh(kcy(.3,.5,6,6),M('#6a4a2a'));sc2.position.set(1.2,16,0);sc2.rotation.z=-.9;g.add(sc2);
  const lamp=at(glowSprite('#ffe8b0',10,.9),0,17,0);g.add(lamp);for(let i=0;i<8;i++){const pl=new THREE.Mesh(kb(2,.4,3),M('#6a5236'));pl.position.set(3+i*2,0,-1);g.add(pl);const post=new THREE.Mesh(kcy(.15,.15,3,4),M('#4a3826'));post.position.set(3+i*2,-1.2,0.4);g.add(post)}
  fr(13,13.1,0,1.8,g);addE(g,[5,6,7,8,9,10,11,12]);cull(g,null,40,1800);px('jadeport',g.position.clone().add(g.position.clone().normalize().multiplyScalar(6)),20);
  const nl=nightPoints(pts.map(p=>dirLL(p[0],p[1]).multiplyScalar(R+p[2]+1.6)),'#ffd890',1.5,1);addE(nl,[5,6,7,8,9,10,11,12]);sp.nightMats=(sp.nightMats||[]).concat([nl.userData.night])}
 // book three, the fog years: a city with a forest inside its walls, a swamp of crawling skeleton-sprouts
 {const g=new THREE.Group();const wm=M('#8aa07a'),rm=detailMat(M('#5a7a4a').clone(),{bump:.5});for(let i=0;i<18;i++){const a=i/18*6.28,d=6+(i%3)*2;const b=new THREE.Mesh(geoC('house','#9ab08a','#3f7a4a'),VC());b.position.set(Math.cos(a)*d,0,Math.sin(a)*d);b.scale.setScalar(1.6);g.add(b)}
  for(let i=0;i<9;i++){const t=new THREE.Mesh(geoC('broad'),VC());t.position.set(Math.cos(i*.7)*2.6,0,Math.sin(i*.7)*2.6);t.scale.setScalar(.7);g.add(t)}
  const wall=new THREE.Mesh(new THREE.TorusGeometry(12,.8,5,48),rm);wall.rotation.x=Math.PI/2;wall.position.y=.8;g.add(wall);fr(24,12,0,0,g);addE(g,[8]);cull(g,null,30,1600);px('rq_neilin',g.position.clone().add(g.position.clone().normalize().multiplyScalar(5)),16)}
 {lake(40,6,40,.6,'#2a3a26',[8]);inst(geoC('dead'),VC(),scatter(80,40,6,2.2,233,onLand),(o,p)=>{frameLL(sp,p[0],p[1],0,p[3]*6,o);o.scale.setScalar(.7+p[3]*.8)},[8]);
  inst(geoC('house','#e8d0a0','#d07a9a'),VC(),[],()=>{},[8]);
  const fl=scatter(260,41,4.5,1.6,234,onLand);inst(new THREE.SphereGeometry(.4,6,4),new THREE.MeshStandardMaterial({color:'#ffffff',emissive:'#a03a6a',emissiveIntensity:.25}),fl,(o,p)=>{frameLL(sp,p[0],p[1],.3,0,o)},[8],{tint:(p)=>C(['#f4a0c0','#f4e0a0','#ffffff','#c0a0f4'][(p[3]*4)|0])});
  px('rq_swamp',dirLL(40,6).multiplyScalar(R+3),28)}
 inst(ko(1),new THREE.MeshStandardMaterial({color:'#ff6a6a',emissive:'#c42a3a',emissiveIntensity:.75,roughness:.12,flatShading:true}),scatter(320,30,-6,10,232,onLand),(o,p)=>{frameLL(sp,p[0],p[1],0,p[3]*5,o);o.translateY(1.4);o.scale.set(.6+p[3]*.6,1.6+p[3]*3.4,.6+p[3]*.6)},[8]);
 px('rq_jieyu',dirLL(30,-6).multiplyScalar(R+gh(30,-6)+5),30,{maxD:2600});

 // ---------- the western sea and its islands ----------
 const mist=fogBank(12,-22,6,40,8,'#e8eef0',.42,71,[2,3,4,5,6,7,8,9,10,11,12],60);
 fogBank(11,-22,11,70,4,'#dfe6ea',.55,72,[8],80);
 // ghost fires on the fog sea: floating stones with a torch burning in the middle, seen only at night
 const ghosts=new THREE.Group();{const pts=scatter(40,11,-24,6,61,inSea);pts.forEach(p=>{const g=new THREE.Group();const st=new THREE.Mesh(kd(1.2+p[3]*1.2),M('#6e6a64',{flatShading:true}));st.scale.y=.4;g.add(st);
  g.add(at(emitter({n:30,life:.9,speed:2.4,spread:.3,size:1.6,dir:[0,1,0],col:'#ffc060',col2:'#ff5010',op:.9,area:[.4,.2,.4]}),0,.6,0));g.add(at(glowSprite('#ffb04a',6,.8),0,1.2,0));frameLL(sp,p[0],p[1],.4,0,g,false);ghosts.add(g)});
  ghosts.visible=false;sp.scene.add(ghosts)}
 // skull island: a beast's skeleton under unmoving fog, an oxygen ball breathing into its tail
 {const g=new THREE.Group(),bm=M('#f0e8d4',{roughness:.6});for(let i=0;i<8;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(5.5-i*.4,.5,6,16,Math.PI),bm);r.position.set(0,0,-8+i*2.6);g.add(r)}
  const spn=new THREE.Mesh(ktube([V3(0,4.5,-12),V3(0,5.2,-2),V3(0,4.4,8),V3(0,2,16),V3(0,.5,22)],.55,24),bm);g.add(spn);
  const hd=new THREE.Mesh(sgeo(14),bm);hd.position.set(0,2.6,-14);hd.scale.set(3.6,2.8,4.6);g.add(hd);for(const s of[-1,1]){const e=new THREE.Mesh(sgeo(8),M('#141010'));e.position.set(s*1.6,3.4,-17.6);e.scale.setScalar(1);g.add(e)}
  const ob=new THREE.Mesh(sgeo(16),detailMat(M('#5aa86c').clone(),{bump:1.2,freq:3}));ob.position.set(0,18,10);ob.scale.setScalar(2.6);g.add(ob);g.add(new THREE.Mesh(ktube([V3(0,16,10),V3(0,10,16),V3(0,3,21)],.3,12),M('#4a7a4a')));
  fr(8,-33,0,.4,g);addE(g,[3,4,5,6,7,8,9,10,11,12]);cull(g,null,30,1800);px('skull',g.position.clone().add(g.position.clone().normalize().multiplyScalar(8)),18);anim(sp,ob,t=>ob.scale.setScalar(2.6+Math.sin(t*1.2)*.25));
  fogBank(8,-33,.9,10,3,'#e8eef0',.5,73,[3,4,5,6,7,8,9,10,11,12],22);
  inst(geoC('twist'),VC(),scatter(40,8,-33,1.1,74,onLand),(o,p)=>{frameLL(sp,p[0],p[1],-.4,p[3]*6,o);o.scale.setScalar(.3+p[3]*.2)},[5,6,7,8,9,10,11,12])}
 // echo island, and the island of only bones
 inst(geoC('broad'),VC(),scatter(40,10,-28,1,75,onLand),(o,p)=>{frameLL(sp,p[0],p[1],-.2,p[3]*6,o);o.scale.setScalar(.6+p[3]*.4)},[3,4,5,6,7,8,9,10,11,12]);
 {const bone=G([[kcy(.18,.18,1,5),'#ede6d2'],[ks(.3,6,4),'#ede6d2',{p:[0,.5,0]}],[ks(.3,6,4),'#ede6d2',{p:[0,-.5,0]}]]);inst(bone,VC(),scatter(70,12,-44,1.3,71,onLand),(o,p)=>{frameLL(sp,p[0],p[1],.3,p[3]*6,o);o.rotateZ(1.3);o.scale.set(1,2+p[3]*4,1)},[3]);
  const spk=G([[ks(1,8,6),'#5a7a3a'],...Array.from({length:10},(_,i)=>{const v=V3(h3(i,1,3)-.5,h3(i,2,3)-.2,h3(i,3,3)-.5).normalize();return[kc(.18,1.2,4),'#d8d0a0',{p:[v.x*1.2,v.y*1.2,v.z*1.2],r:[Math.atan2(v.z,v.y),0,-Math.atan2(v.x,v.y)]}]})]);
  inst(spk,VC(),scatter(18,12.6,-44,.6,76,onLand),(o,p)=>{frameLL(sp,p[0],p[1],.8,p[3]*6,o);o.scale.setScalar(.8)},[3])}
 // the twin isles: rock peaks, tunnels, and the brain-bugs' boats on the beach
 {inst(kc(1,1,7),detailMat(new THREE.MeshStandardMaterial({color:'#8a7a68',roughness:.9,flatShading:true}),{bump:.8}),scatter(30,1,-45,2.6,91,onLand),(o,p)=>{frameLL(sp,p[0],p[1],0,0,o);o.translateY(4);o.scale.set(2.5,8+p[3]*6,2.5)},[3,4,5,6,7,8,9,10,11,12]);
  const boat=G([[new THREE.SphereGeometry(1,10,6,0,6.283,1.57,1.57),'#7a5a3a',{s:[2.4,.8,1]}],[kcy(.06,.06,3.4,4),'#5a4030',{p:[0,1.6,0]}],[new THREE.PlaneGeometry(1.8,2.2),'#e8dcc0',{p:[.2,1.9,0],r:[0,Math.PI/2,0]}]]);
  inst(boat,VC({side:THREE.DoubleSide}),scatter(12,.2,-44.6,.8,92,(la,lo,h)=>h>0&&h<3),(o,p)=>{frameLL(sp,p[0],p[1],.3,p[3]*6,o);o.scale.setScalar(1.1)},[3,4,5])}
 // the fungus isles of the plague
 {const pts=scatter(240,30,-103,5.5,81,onLand);const m1=VC({roughness:.7,emissive:'#3a1a4a',emissiveIntensity:.35});
  inst(geoC('mush'),m1,pts.filter((p,i)=>i%2),(o,p)=>{frameLL(sp,p[0],p[1],-.3,p[3]*6,o);o.scale.setScalar(.55+p[3]*.9)},[3],{tint:(p)=>C('#ffffff').offsetHSL((p[3]-.5)*.15,0,(p[3]-.5)*.2)});
  inst(geoC('mush2'),m1,pts.filter((p,i)=>!(i%2)),(o,p)=>{frameLL(sp,p[0],p[1],-.3,p[3]*6,o);o.scale.setScalar(.7+p[3]*.9)},[3],{tint:(p)=>C('#ffffff').offsetHSL((p[3]-.5)*.2,0,0)});
  const g=new THREE.Group();g.add(emitter({n:320,life:7,speed:.8,spread:1,size:2.2,dir:[0,1,0],col:'#e0c0ff',col2:'#a080d0',op:.6,area:[180,8,180],wander:3}));fr(30,-103,4,0,g);addE(g,[3]);cull(g,null,180,1800);
  const balls=scatter(30,29.5,-103.5,3,82,onLand);inst(sgeo(10),new THREE.MeshStandardMaterial({color:'#c8b0d8',roughness:.6,emissive:'#5a2a6a',emissiveIntensity:.3,transparent:true,opacity:.85}),balls,(o,p)=>{frameLL(sp,p[0],p[1],1.2,0,o);o.scale.setScalar(1.2+p[3]*1.6)},[3]);
  inst(geoC('cannon'),VC(),Array.from({length:14},(_,i)=>[29+i*.18,-106.4+Math.sin(i)*.12,0,i/14]).filter(p=>gh(p[0],p[1])>1),(o,p)=>{frameLL(sp,p[0],p[1],0,-Math.PI/2,o);o.scale.setScalar(1.3)},[3]);
  px('fungus',dirLL(30,-104).multiplyScalar(R+gh(30,-104)+6),36,{maxD:2600})}

 // ---------- the western continent of dinosaurs ----------
 // the great rift: two kilometres deep, mist in its throat, dragons nesting on its lips
 fogBank(14,-60,9,30,3,'#d8e0e2',.45,111,[3,4,5,6,7,8,9,10,11,12],30);
 {const nest=G([[new THREE.TorusGeometry(1.4,.45,5,10),'#6a5236',{r:[Math.PI/2,0,0]}],[ks(.3,6,4),'#e8e0c8',{p:[.3,.2,.1]}],[ks(.3,6,4),'#e8e0c8',{p:[-.3,.2,-.2]}]]);
  inst(nest,VC(),scatter(30,15,-61,4,112,(la,lo,h)=>h>4&&segAng(dirLL(la,lo),F.riftA,F.riftB)>1.2&&segAng(dirLL(la,lo),F.riftA,F.riftB)<2.2),(o,p)=>{frameLL(sp,p[0],p[1],0,p[3]*6,o);o.scale.setScalar(1.2)},[3,4,5,6,7,8,9,10,11,12]);
  const c=new THREE.Mesh(geoC('cannon'),VC());c.scale.setScalar(3);fr(14.4,-58,0,2.2,c);addE(c,[3,4,5]);cull(c,null,20,1600);px('mingheju',c.position.clone().add(c.position.clone().normalize().multiplyScalar(6)),10);
  px('rift',dirLL(14,-60).multiplyScalar(R+gh(14,-60)+4),40,{maxD:2600})}
 // Lin's rainforest base over buried pipes
 {inst(geoC('rain'),swayMat({roughness:.85},.002),scatter(300,26,-66,4.5,6,onLand),(o,p)=>{frameLL(sp,p[0],p[1],-.3,p[3]*6,o);o.scale.setScalar(.7+p[3]*.6)},[3,4,5,6,7,8,9,10,11,12],{tint:(p)=>C('#ffffff').offsetHSL(0,0,(p[3]-.5)*.15)});
  const g=new THREE.Group();const pm=M('#6a7a5a',{roughness:.5});for(let i=0;i<6;i++){const a=i*1.05;g.add(new THREE.Mesh(ktube([V3(0,-1,0),V3(Math.cos(a)*14,.6,Math.sin(a)*14),V3(Math.cos(a+.3)*30,-1,Math.sin(a+.3)*30)],.9,14),pm))}
  const vents=[];for(let i=0;i<6;i++){const a=i*1.05;vents.push(V3(Math.cos(a)*14,1.6,Math.sin(a)*14))}g.add(sparkles(vents,'#9fffc0',4,1,.6));fr(26,-66,0,0,g);addE(g,[3,4,5,6,7,8,9,10,11,12]);cull(g,null,40,1400);px('linbase',g.position.clone().add(g.position.clone().normalize().multiplyScalar(6)),30)}
 // the salt flats
 {const L=scatter(500,4,-72,4.6,121,onLand).map(p=>dirLL(p[0],p[1]).multiplyScalar(R+p[2]+.4));const s=sparkles(L,'#ffffff',1.1,.8,1);addE(s,[3,4,5,6,7,8,9,10,11,12]);cull(s,dirLL(4,-72).multiplyScalar(R),90,1600);
  const bone=G([[kcy(.1,.1,1.4,4),'#ece4d0',{r:[0,0,1.57]}],[ks(.18,5,4),'#ece4d0',{p:[.7,0,0]}],[ks(.18,5,4),'#ece4d0',{p:[-.7,0,0]}]]);inst(bone,VC(),scatter(50,4.4,-72.4,2.6,122,onLand),(o,p)=>{frameLL(sp,p[0],p[1],.15,p[3]*6,o);o.scale.setScalar(.9)},[3,4,5,6,7,8,9,10,11,12]);
  px('salt',dirLL(4,-72).multiplyScalar(R+gh(4,-72)+3),40,{maxD:2600})}
 // dragonroost woods: a city in the branches, lanterns on the platforms
 {const pts=scatter(70,-4,-86,3.2,11,onLand);const qset=(o,p)=>{frameLL(sp,p[0],p[1],-.3,p[3]*6,o);o.scale.setScalar(.75+p[3]*.4)};inst(qimuGeo(),swayMat({roughness:.85},.0008),pts,qset,[3,4,5,6,7,8,9,10,11,12],{far:2000});
  const lan=[];{const o=new THREE.Object3D();pts.forEach(p=>{o.position.set(0,0,0);o.quaternion.identity();o.scale.set(1,1,1);qset(o,p);o.updateMatrix();for(const q of QIMU_LAN)lan.push(q.clone().applyMatrix4(o.matrix))})}
  const nl=nightPoints(lan,'#ffcf7a',1.8,1);addE(nl,[3,4,5,6,7,8,9,10,11,12]);sp.nightMats=(sp.nightMats||[]).concat([nl.userData.night]);cull(nl,dirLL(-4,-86).multiplyScalar(R),70,1800);
  px('longqimu',dirLL(-4,-86).multiplyScalar(R+gh(-4,-86)+12),28)}
 // the emerald city among egg-shaped stones: lower, common and upper districts, the palace of Susumi
 {const eggs=scatter(30,12,-88,2.4,21,onLand);const em=detailMat(VC({roughness:.85}),{bump:1,freq:2});inst(geoC('egg'),em,eggs,(o,p)=>{frameLL(sp,p[0],p[1],0,p[3]*6,o);o.translateY(1.6);o.scale.set(3.6,2.6,6)},[3]);
  inst(geoC('stonehouse'),VC(),scatter(0,12,-88,2.1,22,onLand),(o,p)=>{frameLL(sp,p[0],p[1],0,p[3]*3,o);o.scale.setScalar(1.3+p[3])},[3]);
  const pal=new THREE.Group();const pm=detailMat(M('#7aa88a').clone(),{bump:.5});for(let i=0;i<4;i++){const b=new THREE.Mesh(kb(9-i*2,2.2,9-i*2),pm);b.position.y=1.1+i*2.2;pal.add(b)}
  const roof=new THREE.Mesh(kc(2.4,4,4),M('#2d9560',{roughness:.4,metalness:.2}));roof.position.y=11;roof.rotation.y=Math.PI/4;pal.add(roof);
  const st=new THREE.Mesh(geoC('egg'),VC());st.position.set(7,1,0);st.scale.set(.6,2.4,.6);pal.add(st);const king=new THREE.Mesh(kcy(.5,.7,3,8),M('#c8c0a8'));king.position.set(0,1.5,9);pal.add(king);const kh=new THREE.Mesh(sgeo(10),M('#c8c0a8'));kh.position.set(0,3.4,9);kh.scale.set(.7,.6,.6);pal.add(kh);
  fr(12,-88,0,0,pal);addE(pal,[3]);cull(pal,null,20,1600);px('emeraldcity',pal.position.clone().add(pal.position.clone().normalize().multiplyScalar(6)),14);
  rqGreenPool(sp)}
 // the scorpion-folk city: ten great pyramids in a line, crystal caps flashing in the sun
 {const g=new THREE.Group();const pm=detailMat(VC({roughness:.8}),{bump:.5});const xm=new THREE.MeshStandardMaterial({color:'#bff0ff',emissive:'#3aa6c4',emissiveIntensity:.5,roughness:.08,flatShading:true});
  for(let i=0;i<10;i++){const p=new THREE.Mesh(geoC('pyr',5),pm);const o=new THREE.Group();o.add(p);p.scale.set(3,4.2,3);{const cr=new THREE.Mesh(pyrCrystals(70+i),xm);cr.scale.copy(p.scale);o.add(cr)}if(i%3===1){const cap=new THREE.Mesh(kc(1.3,2.4,4),xm);cap.position.y=7.6;cap.rotation.y=Math.PI/4;o.add(cap)}frameLL(sp,-12,-80.5+i*.55,0,0,o);g.add(o)}
  sp.scene.add(g);addTo(sp,g,[3,4,5,6,7,8,9,10,11,12]);cull(g,dirLL(-12,-78).multiplyScalar(R+gh(-12,-78)),60,1800);
  inst(geoC('pyr',3),VC({roughness:.8}),scatter(80,-12,-78,2.8,93,onLand),(o,p)=>{frameLL(sp,p[0],p[1],0,0,o);o.scale.setScalar(.8+p[3]*1.2)},[3,4,5,6,7,8,9,10,11,12]);
  px('scorpion',dirLL(-12,-78).multiplyScalar(R+gh(-12,-78)+6),30)}
 // crystal woods that cry out when bitten
 {const pts=scatter(260,10,-100,4.4,94,onLand);inst(geoC('crystal'),VC({roughness:.1,metalness:.1,emissive:'#2a8aa8',emissiveIntensity:.45,flatShading:true}),pts.filter((p,i)=>i%5===0),(o,p)=>{frameLL(sp,p[0],p[1],0,p[3]*4,o);o.scale.setScalar(.5+p[3]*.6)},[3]);
  const s=sparkles(pts.map(p=>dirLL(p[0],p[1]).multiplyScalar(R+p[2]+4+p[3]*5)),'#dffaff',2,1,1);addE(s,[3]);cull(s,dirLL(10,-100).multiplyScalar(R),90,1600);px('crystalwood',dirLL(10,-100).multiplyScalar(R+gh(10,-100)+5),34)}
 // Yate's mountain: a river pouring from a great cave in its flank
 {const g=new THREE.Group();const cave=new THREE.Mesh(new THREE.CircleGeometry(6,20),M('#0a0806'));cave.position.set(0,5,0);cave.rotation.y=Math.PI/2;g.add(cave);
  g.add(emitter({n:180,life:2.4,speed:5,spread:.25,size:3,dir:[1,-.3,0],grav:3,col:'#d8eef8',op:.5,add:false,tex:smokeTex,area:[1,6,6]}));fr(22,-96.3,0,Math.PI/2,g);addE(g,[3]);cull(g,null,40,1600);
  glowArc([22,-96.4],[20,-100],2.4,'#4aa8c8',[3],.3,.6);px('atmount',dirLL(22,-94).multiplyScalar(R+gh(22,-94)+6),30,{maxD:2600})}
 // the island of the white bone-dragons: a castle too large to walk round in a day
 {const g=new THREE.Group(),wm=detailMat(M('#ebe7de').clone(),{bump:.5});const tw=geoC('tower','#ebe7de','#a09a90');
  for(let i=0;i<14;i++){const a=i/14*6.28;const t=new THREE.Mesh(tw,VC());t.position.set(Math.cos(a)*12,0,Math.sin(a)*12);t.scale.setScalar(1.5+(i%3)*.3);g.add(t)}
  for(let i=0;i<14;i++){const a=(i+.5)/14*6.28;const w=new THREE.Mesh(kb(5.6,3.2,1),wm);w.position.set(Math.cos(a)*11.6,1.6,Math.sin(a)*11.6);w.rotation.y=-a+Math.PI/2;g.add(w)}
  const keep=new THREE.Mesh(kb(10,8,10),wm);keep.position.y=4;g.add(keep);for(let i=0;i<4;i++){const t=new THREE.Mesh(tw,VC());t.position.set(i%2?4.5:-4.5,6,i<2?4.5:-4.5);t.scale.setScalar(1.6);g.add(t)}
  for(let i=0;i<10;i++){const c=new THREE.Mesh(kcy(.35,.35,5,8),wm);c.position.set(-6+i*1.3,2.5,8);g.add(c)}
  for(let i=0;i<5;i++){const b=new THREE.Mesh(new THREE.PlaneGeometry(1.2,2.4),M('#c8a83a',{side:THREE.DoubleSide}));b.position.set(Math.cos(i*1.2)*12,9,Math.sin(i*1.2)*12);g.add(b)}
  fr(4,-112,0,0,g);addE(g,[3,4]);cull(g,null,30,1800);px('whiteisle',g.position.clone().add(g.position.clone().normalize().multiplyScalar(8)),18);
  inst(new THREE.SphereGeometry(1,12,6,0,6.283,0,1.57),new THREE.MeshStandardMaterial({color:'#cfe0d8',transparent:true,opacity:.75,roughness:.15}),scatter(16,4.5,-115.5,1.2,95),(o,p)=>{frameLL(sp,p[0],p[1],0,0,o,false);o.position.setLength(R+ghR(p[0],p[1])+.2);o.scale.setScalar(1.6+p[3]*1.6)},[3,4]);
  const ru=new THREE.Group();for(let i=0;i<9;i++){const a=i/9*6.28;const t=new THREE.Mesh(kcy(.8,1,2+h3(i,1,1)*5,8),wm);t.position.set(Math.cos(a)*11,1,Math.sin(a)*11);t.rotation.z=(h3(i,2,1)-.5)*.4;ru.add(t)}
  for(let i=0;i<30;i++){const r=new THREE.Mesh(kd(.5+h3(i,3,1)),wm);r.position.set((h3(i,4,1)-.5)*24,.3,(h3(i,5,1)-.5)*24);ru.add(r)}fr(3.5,-111,0,0,ru);addE(ru,[6]);cull(ru,null,30,1600);px('rq_whiteruin',ru.position.clone().add(ru.position.clone().normalize().multiplyScalar(4)),16)}
 // the creator: a vast root-tree whose brain wakes beneath the continent
 const creatorTree=new THREE.Group();{const rm=detailMat(new THREE.MeshStandardMaterial({color:'#5b4a3a',roughness:.9}),{bump:1.4,freq:2});
  for(let k=0;k<9;k++){const pts=[];for(let i=0;i<=12;i++){const t=i/12,a=k*.7+t*4.2;const r=(1-t)*18+2;pts.push(V3(Math.cos(a)*r,t*62,Math.sin(a)*r))}creatorTree.add(new THREE.Mesh(ktube(pts,2.2-k*.12,30,6),rm))}
  for(let k=0;k<7;k++){const a=k/7*6.28;const pts=[V3(Math.cos(a)*16,2,Math.sin(a)*16)];for(let i=1;i<=6;i++)pts.push(V3(Math.cos(a+i*.12)*(16+i*14),-.5+Math.sin(i)*1.2,Math.sin(a+i*.12)*(16+i*14)));creatorTree.add(new THREE.Mesh(ktube(pts,1.6,24,5),rm))}
  const br=new THREE.Mesh(brainGeo(),new THREE.MeshStandardMaterial({vertexColors:true,emissive:'#a24467',emissiveIntensity:.4,roughness:.55}));br.position.y=68;br.scale.setScalar(7);creatorTree.add(br);creatorTree.add(at(glowSprite('#ff8ab0',40,.35),0,68,0));
  for(let k=0;k<6;k++){const lf=new THREE.Mesh(new THREE.SphereGeometry(9,10,4,0,Math.PI*2,0,Math.PI/3),M('#3d8a4a',{side:THREE.DoubleSide}));lf.position.y=60;lf.rotation.set(.9,k*1.05,0,'YXZ');creatorTree.add(lf)}
  fr(6,-84,0,0,creatorTree);addE(creatorTree,[3]);cull(creatorTree,null,90,2600);px('creator',creatorTree.position.clone().add(creatorTree.position.clone().normalize().multiplyScalar(60)),30);
  anim(sp,br,t=>{br.material.emissiveIntensity=.3+Math.sin(t*2)*.18;br.scale.setScalar(7+Math.sin(t*2)*.15)})}
 // tall-grass savanna between the salt and the dragon woods comes from the ground cover; here a few lone trees
 inst(geoC('broad'),VC(),scatter(40,-8,-80,4,131,onLand),(o,p)=>{frameLL(sp,p[0],p[1],-.2,p[3]*6,o);o.scale.setScalar(.6+p[3]*.5)},[3,4,5,6,7,8,9,10,11,12],{tint:()=>C('#d8e0a0')});

 // ---------- the eastern continent and the sky above it ----------
 // silver city: an avenue for land-ships, lined with swollen water-plants and not a single tree
 {const pts=scatter(18,-4,56,1.4,101,onLand);inst(geoC('dome'),VC({metalness:.85,roughness:.22}),pts,(o,p)=>{frameLL(sp,p[0],p[1],0,0,o);o.scale.setScalar(2.4+p[3]*2.4)},[5,6,7,8,9,10,11,12]);
  const av=[];for(let i=0;i<40;i++){const t=i/40;av.push([-4+t*2.2+(i%2?.12:-.12),54+t*2.8,0,h3(i,1,1)])}inst(geoC('succ'),VC({roughness:.7}),av,(o,p)=>{frameLL(sp,p[0],p[1],0,p[3]*6,o);o.scale.setScalar(.8+p[3]*.6)},[5,6,7,8,9,10,11,12]);
  inst(geoC('succ'),VC({roughness:.7}),scatter(500,-10,66,13,103,(la,lo,h)=>h>2&&h<60&&angDeg(dirLL(la,lo),F.dieye)>8.5),(o,p)=>{frameLL(sp,p[0],p[1],0,p[3]*6,o);o.scale.setScalar(.7+p[3]*.9)},[5,6,7,8,9,10,11,12],{tint:(p)=>C('#ffffff').offsetHSL((p[3]-.5)*.06,0,(p[3]-.5)*.1)});
  const nl=nightPoints(pts.map(p=>dirLL(p[0],p[1]).multiplyScalar(R+p[2]+2)),'#cfe6ff',2,1);addE(nl,[5,6,7,8,9,10,11,12]);sp.nightMats.push(nl.userData.night);px('silvercity',dirLL(-4,56).multiplyScalar(R+gh(-4,56)+5),20)}
 // the capital: metal everywhere, geared columns pounding the ground, the rail that climbs into the clouds
 {const pts=scatter(26,-14,63,1.5,102,onLand);const tmz=towerMat({metalness:.7,roughness:.28,win:'#ffe0b0'});sp.towerMats=(sp.towerMats||[]).concat([tmz]);inst(geoC('metalTower'),tmz,pts,(o,p)=>{frameLL(sp,p[0],p[1],0,0,o);o.scale.set(2,8+p[3]*14,2)},[5,6,7,8,9,10,11,12]);
  const g=new THREE.Group();const pist=[];for(let i=0;i<6;i++){const c=new THREE.Mesh(kcy(.7,.7,6,10),M('#9aa4ac',{metalness:.8,roughness:.3}));const a=i*1.05;c.position.set(Math.cos(a)*6,3,Math.sin(a)*6);g.add(c);pist.push(c);const gear=new THREE.Mesh(new THREE.TorusGeometry(1.3,.3,4,10),M('#7a8288',{metalness:.8}));gear.position.copy(c.position);gear.position.y=5.4;gear.rotation.x=Math.PI/2;g.add(gear)}
  g.add(emitter({n:80,life:5,speed:3,spread:.4,size:7,dir:[0,1,0],col:'#8a8a8a',op:.3,add:false,tex:smokeTex,area:[14,2,14],wander:1.5}));fr(-14,63,0,0,g);addE(g,[5,6,7,8,9,10,11,12]);cull(g,null,30,1400);
  anim(sp,g,t=>pist.forEach((c,i)=>{c.position.y=3+Math.abs(Math.sin(t*3+i))*2.2}));
  const rail=[];for(let i=0;i<=60;i++){const t=i/60;const la=lerp(-14,-6.3,t),lo=lerp(63,72.4,t);rail.push(dirLL(la,lo).multiplyScalar(R+Math.max(gh(la,lo),0)+2+t*t*130))}
  const rl=new THREE.Mesh(ktube(rail,.5,120,4),M('#b8c4cc',{metalness:.8,roughness:.25}));addE(rl,[5,6,7,8,9,10,11,12]);cull(rl,rail[30],300,2400);
  const nl=nightPoints(pts.map(p=>dirLL(p[0],p[1]).multiplyScalar(R+p[2]+4)),'#ffe0b0',2,1);addE(nl,[5,6,7,8,9,10,11,12]);sp.nightMats.push(nl.userData.night);px('capital',dirLL(-14,63).multiplyScalar(R+gh(-14,63)+8),20)}
 // the three-layered sea of clouds, sealed water and light-gas you can run across
 {const layers=[110,128,146];layers.forEach((alt,k)=>{const g=new THREE.Group();const mtl=new THREE.SpriteMaterial({map:smokeTex,color:k===2?'#fffaf0':k===1?'#fff0f8':'#ffffff',transparent:true,opacity:.95,depthWrite:false});const mt2=new THREE.SpriteMaterial({map:glowTex,color:k===1?'#ffd8f0':'#fff4e0',transparent:true,opacity:.35,depthWrite:false,blending:THREE.AdditiveBlending});
   scatter(95,-10,70,11,111+k).forEach((p,i)=>{const s=new THREE.Sprite(i%9===0&&k===1?mt2:mtl);const sz=70+p[3]*70;s.scale.set(sz,sz*.4,1);s.position.copy(dirLL(p[0],p[1]).multiplyScalar(R+alt+p[3]*4));g.add(s)});
   addE(g,k===0?[5,6,7,8,9,10,11,12]:[5]);cull(g,dirLL(-10,70).multiplyScalar(R+alt),260,7000);const cd=dirLL(-10,70);anim(sp,g,()=>{const dk=sm(-.25,.2,cd.dot(sp.sunDir));mtl.opacity=.72*(1-.55*sm(1100,2000,rig.alt));const LT=k===0?[.74,.8,.95]:k===1?[.97,.9,.96]:[1.04,1,.93];mtl.color.setRGB((.2+.8*dk)*LT[0],(.22+.78*dk)*LT[1],(.3+.7*dk)*LT[2]);mt2.opacity=.35*(1-sm(1100,2000,rig.alt))})});
  const gl=new THREE.Group();for(let i=0;i<12;i++){const s=glowSprite(i%2?'#ffd0f0':'#fff0c0',60,.35);s.position.set((h3(i,1,7)-.5)*300,0,(h3(i,2,7)-.5)*300);gl.add(s)}fr(-9,69,119,0,gl,false);addE(gl,[5]);cull(gl,null,200,3000);
  const huts=scatter(30,-8,69,3,113);inst(new THREE.SphereGeometry(1,10,6,0,6.283,0,1.57),M('#f4f4f0'),huts,(o,p)=>{frameLL(sp,p[0],p[1],148.5,0,o,false);o.scale.setScalar(1.6+p[3])},[5]);
  px('cloudsea',dirLL(-8,68).multiplyScalar(R+130),40,{maxD:3200})}
 // the academy of alloy on the mountain that pierces all three layers
 {const g=new THREE.Group();const mm=M('#d4dde3',{metalness:.85,roughness:.25});for(let i=0;i<7;i++){const b=new THREE.Mesh(kb(2.2,2+i%3*1.4,2.2),mm);b.position.set(Math.cos(i)*3.6,1+(i%3)*.7,Math.sin(i)*3.6);g.add(b)}
  const d=new THREE.Mesh(new THREE.SphereGeometry(2.6,14,7,0,6.283,0,1.57),mm);g.add(d);const ant=new THREE.Mesh(kcy(.08,.12,7,4),mm);ant.position.y=5;g.add(ant);g.add(at(glowSprite('#ff6a6a',3,.9),0,8.6,0));
  const lab=new THREE.Mesh(new THREE.SphereGeometry(3,14,8,0,6.283,0,1.57),M('#f6f4f0',{roughness:.9}));lab.position.set(7,0,5);g.add(lab);
  const spi=new THREE.Group();const sb=new THREE.Mesh(sgeo(10),mm);sb.scale.set(1,.7,1);spi.add(sb);for(let i=0;i<8;i++){const l=leg2(1.2,1.3,.08,mm,.8);l.position.set(0,0,0);l.rotation.y=i/8*6.28;l.rotation.x=.8;spi.add(l)}spi.position.set(7,4.2,5);g.add(spi);
  fr(-6,73,0,0,g);addE(g,[5,6,7,8,9,10,11,12]);cull(g,null,20,2400);px('cloudpeak',g.position.clone().add(g.position.clone().normalize().multiplyScalar(5)),12);
  g.updateMatrixWorld();px('rq_lab3',g.localToWorld(V3(7,3,5)),6);px('jiaozhang',g.position.clone().add(g.position.clone().normalize().multiplyScalar(9)),4)}
 // the eye of the earth: an oasis lake in a ring of jungle and blood-trees
 {inst(geoC('rain'),swayMat({roughness:.85},.002),scatter(140,-17,75,4.6,104,(la,lo,h)=>h>1.5&&angDeg(dirLL(la,lo),F.dieye)>2.4&&angDeg(dirLL(la,lo),F.dieye)<5),(o,p)=>{frameLL(sp,p[0],p[1],-.2,p[3]*6,o);o.scale.setScalar(.6+p[3]*.5)},[5,6,7,8,9,10,11,12]);
  inst(geoC('blood'),VC({roughness:.4}),scatter(240,-17,76,8.2,104,(la,lo,h)=>Math.abs(angDeg(dirLL(la,lo),F.dieye)-7.6)<.7&&h>1),(o,p)=>{frameLL(sp,p[0],p[1],0,p[3]*6,o);o.scale.setScalar(1.1+p[3]*.8)},[5,6,7,8,9,10,11,12]);
  px('dieye',dirLL(-17,75).multiplyScalar(R+2),30);px('xueqiu',dirLL(-22,81).multiplyScalar(R+gh(-22,81)+3),22)}
 // the ancient forest of heaven, and the sky castle above it
 {inst(geoC('broad'),VC(),scatter(340,-10,88,4.5,105,onLand),(o,p)=>{frameLL(sp,p[0],p[1],-.3,p[3]*6,o);o.scale.setScalar(1.1+p[3]*.9)},[5,6,7,8,9,10,11,12],{tint:(p)=>C('#a8c0a0').offsetHSL(0,0,(p[3]-.5)*.1)});
  const g=new THREE.Group();const isl=new THREE.Mesh(new THREE.ConeGeometry(16,26,9),detailMat(M('#8a8072').clone(),{bump:.8}));isl.rotation.x=Math.PI;isl.position.y=-13;g.add(isl);
  for(let i=0;i<7;i++){const t=new THREE.Mesh(geoC('tower','#e8e4dc','#6a7a9a'),VC());t.position.set(Math.cos(i)*8,0,Math.sin(i)*8);t.scale.setScalar(1.8+(i%2));g.add(t)}
  const core=new THREE.Mesh(kcy(2,3,22,10),new THREE.MeshStandardMaterial({color:'#7a5a3a',emissive:'#ffb060',emissiveIntensity:.35}));core.position.y=11;g.add(core);g.add(at(glowSprite('#ffd090',30,.5),0,22,0));
  fr(-10,88,120,0,g,false);addE(g,[5],true);cull(g,null,40,3000);px('tianguo',dirLL(-10,88).multiplyScalar(R+gh(-10,88)+6),30);px('luoxuan',g.position.clone().add(g.position.clone().normalize().multiplyScalar(30)),10,{hide:()=>ERA!==5})}
 // the "creator" in the clouds: a white floating island floored with hexagons
 {const g=new THREE.Group();const isl=new THREE.Mesh(new THREE.CylinderGeometry(16,7,9,6),M('#f4f4f0'));g.add(isl);
  const hex=new THREE.InstancedMesh(new THREE.CylinderGeometry(1,1,.3,6),M('#ffffff',{roughness:.4}),61);let q=0;const o3=new THREE.Object3D();for(let i=-4;i<=4;i++)for(let j=-4;j<=4;j++){if(q>=61)break;const x=i*1.8+(j%2)*.9,z=j*1.56;if(Math.hypot(x,z)>14)continue;o3.position.set(x,4.7,z);o3.updateMatrix();hex.setMatrixAt(q++,o3.matrix)}hex.count=q;g.add(hex);
  for(let i=0;i<6;i++){const t=new THREE.Mesh(kb(3,5+i,3),M('#ffffff'));t.position.set(Math.cos(i*1.3)*8,7,Math.sin(i*1.3)*8);g.add(t)}
  for(let i=0;i<8;i++){const st=new THREE.Mesh(kcy(.5,.6,2.4,6),M('#e8c040',{metalness:.7,roughness:.3}));st.position.set(Math.cos(i*.8)*4,6,Math.sin(i*.8)*4);g.add(st)}
  for(let i=0;i<5;i++){const c=new THREE.Sprite(new THREE.SpriteMaterial({map:smokeTex,color:'#ffffff',transparent:true,opacity:.6,depthWrite:false}));c.scale.set(12,6,1);c.position.set(Math.cos(i*1.6)*18,2,Math.sin(i*1.6)*18);g.add(c)}
  fr(-8,79,165,0,g,false);addE(g,[5],true);cull(g,null,30,3200);px('creator2',g.position,18)}
 // the southern blank on the map: a slow storm of white
 {fogBank(-52,-18,7,40,14,'#f4f6f8',.35,141,[1,2,3,4,5],70);px('south',dirLL(-52,-18).multiplyScalar(R+60),60,{maxD:4000})}

 // ---------- book three ----------
 // the changing light over the south pole
 {const tex=canvasTex(64,256,(x)=>{const g=x.createLinearGradient(0,0,0,256);g.addColorStop(0,'rgba(120,80,255,0)');g.addColorStop(.35,'rgba(140,110,255,.55)');g.addColorStop(.7,'rgba(80,255,190,.8)');g.addColorStop(1,'rgba(80,255,190,0)');x.fillStyle=g;x.fillRect(0,0,64,256)});
  const au=new THREE.Group();for(let i=0;i<12;i++){const pl=new THREE.Mesh(new THREE.PlaneGeometry(100,170,8,1),new THREE.MeshBasicMaterial({map:tex,transparent:true,opacity:.7,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));
   const p=pl.geometry.attributes.position;for(let k=0;k<p.count;k++)p.setZ(k,Math.sin(p.getX(k)*.05+i)*14);const g=new THREE.Group();g.add(pl);pl.position.y=120;frameLL(sp,-66-Math.sin(i*1.7)*5,-60+i*13,0,i*.7+1,g,false);au.add(g)}
  addE(au,[6]);anim(sp,au,t=>au.children.forEach((g,i)=>{g.children[0].material.opacity=.45+Math.sin(t*.8+i*1.3)*.25;g.children[0].scale.x=1+Math.sin(t*.4+i)*.2}));px('rq_storm',dirLL(-64,-24).multiplyScalar(R+140),50,{maxD:4000})}
 // the black city of the brain-spirits on the polar ice
 {const bm=M('#16171c',{metalness:.6,roughness:.35}),rm=GL('#ff3a4a');
  inst(geoC('black'),VC({metalness:.6,roughness:.35}),scatter(80,-66,-6,2.6,201),(o,p)=>{frameLL(sp,p[0],p[1],0,p[3]*6,o);o.scale.set(1.2+p[3],10+p[3]*34,1.2+p[3])},[6]);
  inst(ko(.9),rm,scatter(20,-66,-6,2.2,202),(o,p)=>{frameLL(sp,p[0],p[1],38+p[3]*14,0,o)},[6]);
  const core=new THREE.Group();const s1=new THREE.Mesh(kc(5,84,6),bm);s1.position.y=42;core.add(s1);core.add(at(new THREE.Mesh(sgeo(10),rm),0,86,0));core.children[1].scale.setScalar(2.2);core.add(at(glowSprite('#ff3a4a',24,.6),0,86,0));
  for(let i=0;i<5;i++){const sp2=new THREE.Mesh(kc(.6,30,4),bm);sp2.position.set(Math.cos(i*1.26)*7,40,Math.sin(i*1.26)*7);sp2.rotation.set(Math.sin(i*1.26)*.3,0,-Math.cos(i*1.26)*.3);core.add(sp2)}
  fr(-66,-6,0,0,core);addE(core,[6]);cull(core,null,90,3200);px('rq_blackcity',core.position.clone().add(core.position.clone().normalize().multiplyScalar(40)),20)}
 // fire-balloon platforms of the emerald dragons
 const balloons=new THREE.Group();{for(let i=0;i<9;i++){const g=new THREE.Group();const b=new THREE.Mesh(sgeo(14),M(i%2?'#e4b07a':'#d98a5a',{roughness:.7}));b.scale.set(4,4.8,4);b.position.y=9;g.add(b);
   for(let k=0;k<6;k++){const s=new THREE.Mesh(kb(.1,8,.1),M('#6a4a2a'));const a=k/6*6.28;s.position.set(Math.cos(a)*3.4,9,Math.sin(a)*3.4);g.add(s)}
   const bk=new THREE.Mesh(kcy(2,1.6,1.4,8),M('#6a4a2a'));g.add(bk);const pl=new THREE.Mesh(kcy(4,4,.3,10),M('#7a5a3a'));pl.position.y=-.8;g.add(pl);
   g.add(at(emitter({n:40,life:.7,speed:3,spread:.3,size:2,dir:[0,1,0],col:'#ffd060',col2:'#ff5010',op:.9,area:[.6,.2,.6]}),0,3,0));g.add(at(glowSprite('#ffb040',8,.8),0,4,0));
   g.userData={la:-46+Math.sin(i*2.1)*2.5,lo:-24+Math.cos(i*1.3)*4,alt:26+i*4,ph:i};balloons.add(g)}
  addE(balloons,[6]);px('rq_platform',()=>balloons.children[0].position,16,{hide:()=>!balloons.visible})}
 // the crystal mines of the southern continent
 {const xm=new THREE.MeshStandardMaterial({color:'#bff6ff',emissive:'#3ab6d4',emissiveIntensity:.6,roughness:.1,flatShading:true});
  inst(ko(1),xm,scatter(110,-50,-30,1.8,211,onLand),(o,p)=>{frameLL(sp,p[0],p[1],0,p[3]*5,o);o.translateY(2);o.scale.set(1,3+p[3]*5,1);o.rotateZ((p[3]-.5)*.6)},[6,7,8]);
  const g=new THREE.Group();for(let i=0;i<4;i++){const t=new THREE.Mesh(new THREE.TorusGeometry(10+i*6,.9,4,36),detailMat(M('#8a8a90').clone(),{bump:.5}));t.rotation.x=Math.PI/2;t.position.y=1-i*1.5;g.add(t)}
  const cr=new THREE.Mesh(kcy(.15,.15,22,4),M('#5a4a3a'));cr.position.set(8,8,0);cr.rotation.z=.5;g.add(cr);fr(-50,-30,0,0,g);addE(g,[6,7,8]);cull(g,null,40,1800);px('rq_crystalmine',g.position.clone().add(g.position.clone().normalize().multiplyScalar(4)),20)}
 // Maya's great ship
 const mayaShip=new THREE.Group();{const hm=M('#3a1c22',{metalness:.5,roughness:.4}),rm=GL('#ff4a3a');const h=new THREE.Mesh(sharkGeo(56,9,.9),hm);h.scale.y=.75;mayaShip.add(h);
  for(let i=0;i<6;i++){const s=new THREE.Mesh(kc(1.4,10,5),hm);s.position.set(-16+i*7,7,0);mayaShip.add(s)}
  for(const s of[-1,1]){const e=new THREE.Mesh(kcy(2,2.6,8,10),hm);e.rotation.z=Math.PI/2;e.position.set(-24,0,s*7);mayaShip.add(e);mayaShip.add(at(glowSprite('#ff6a4a',10,.9),-29,0,s*7));const w=new THREE.Mesh(wingGeo(12,10,'fin'),hm);w.position.set(-4,-1,s*5);if(s<0)w.scale.z=-1;mayaShip.add(w)}
  mayaShip.add(at(new THREE.Mesh(sgeo(10),GL('#ffe0a0')),18,3,0));mayaShip.children[mayaShip.children.length-1].scale.setScalar(2.4);
  for(let i=0;i<14;i++)mayaShip.add(at(new THREE.Mesh(sgeo(6),GL('#ffc080')),-14+i*2.4,1.5,(i%2?1:-1)*6.2));
  addE(mayaShip,[6]);px('rq_mayaship',()=>mayaShip.position,30,{hide:()=>!mayaShip.visible})}
 // the burned-out legions of the brain-spirits are herds; the hybrid dragons and the hero of the fog appear as herds too

 // ---------- the moon: the tumbler of the starry sky ----------
 const moonTex=canvasTex(512,256,(x)=>{const im=x.createImageData(512,256);for(let j=0;j<256;j++)for(let i=0;i<512;i++){const lon=i/512*6.283,lat=(j/256-.5)*3.1416;const px2=Math.cos(lat)*Math.sin(lon),py=Math.sin(lat),pz=Math.cos(lat)*Math.cos(lon);
  let v=fbm(px2*3+9,py*3,pz*3,5);let cr=0;for(let k=0;k<26;k++){const c=dirLL((h3(k,1,1)-.5)*150,(h3(k,2,1)-.5)*360);const d=Math.acos(clamp(px2*c.x+py*c.y+pz*c.z,-1,1));const rr=.05+h3(k,3,1)*.18;if(d<rr*1.25)cr+=d<rr?-.25*(1-d/rr):.2*(1-(d-rr)/(rr*.25))}
  v=clamp(v+cr*.6,0,1);const k=(j*512+i)*4;im.data[k]=lerp(60,150,v);im.data[k+1]=lerp(120,205,v);im.data[k+2]=lerp(190,255,v);im.data[k+3]=255}x.putImageData(im,0,0)});
 const moon=new THREE.Mesh(new THREE.SphereGeometry(1,64,40),new THREE.MeshStandardMaterial({map:moonTex,emissive:'#2f78c8',emissiveIntensity:.55,emissiveMap:moonTex,roughness:.85}));
 const halo=glowSprite('#7fc8ff',1,.5);sp.scene.add(moon);sp.scene.add(halo);sp.moon=moon;sp.moonT=0;sp.moonK=0;
 px('moon',()=>moon.position,1,{hide:()=>ERA>=6,moon:1,rr:()=>moon.scale.x});px('moon_bus',()=>moon.position,1,{hide:()=>ERA<6,moon:1,rr:()=>moon.scale.x});
 WIKI.filter(w=>mapOf(w)==='rongqiu'&&w.moon).forEach(w=>px(w.id,()=>dirLL(...w.moon).multiplyScalar(moon.scale.x*1.03).add(moon.position),6,{hide:()=>sp.moonK<.5}));
 sp.moonPos=moon.position;moonDeco(sp,moon);

 // ---------- creatures ----------
 sp.herds=makeHerds(FAUNA.filter(f=>!f.m||f.m==='rongqiu'),sp);herdProx(sp);
 // ---------- era hooks ----------
 sp.onEra=(e)=>{ghosts.visible=false};
 const tmpO2=new THREE.Object3D();
 sp.extra=(T,dt)=>{
  sp.moonK+=(sp.moonT-sp.moonK)*Math.min(1,dt*.6);const mk=sp.moonK;const ma=T*.014;const md=lerp(4400,2300,mk);moon.position.set(Math.cos(ma)*md,lerp(1000,1300,mk),Math.sin(ma)*md);moon.scale.setScalar(lerp(150,320,mk));halo.position.copy(moon.position);halo.scale.setScalar(moon.scale.x*3.4);
  for(const p of sp.prox)if(p.rr)p.r=p.rr();
  const isleK=Math.max(mk,(ERA===2||ERA===3)?1:0);
  const near=rig.alt<2600;
  if(near&&ERA!==1&&ERA<6||mk>.02){stoneIM.visible=ERA!==1;stonePts.forEach((p,i)=>{const s=1+p[3]*2.6;frameLL(sp,p[0],p[1],s*.4+mk*(20+p[3]*90)+Math.sin(T*.6+i)*mk*1.5,i,tmpO2);tmpO2.rotateY(T*.1*mk);tmpO2.scale.setScalar(s);tmpO2.updateMatrix();stoneIM.setMatrixAt(i,tmpO2.matrix)});stoneIM.instanceMatrix.needsUpdate=true}else stoneIM.visible=false;
  isles.visible=ERA!==1&&ERA<6&&isleK>.02;if(isles.visible)isles.children.forEach((g,i)=>{const u=g.userData;frameLL(sp,u.la,u.lo,lerp(-30,u.alt,isleK)+Math.sin(T*.4+i)*1.2,i,g)});
  airship.visible=(ERA===2||ERA===3&&mk>.05)||mk>.3&&ERA<6;if(airship.visible){frameLL(sp,20+Math.sin(T*.05)*2,-13+Math.cos(T*.04)*2,lerp(-8,70,ERA===2?Math.max(mk,.4):mk),T*.05,airship);for(let i=0;i<4;i++)airship.userData['w'+i].forEach((s,j)=>s.position.x=Math.sin(T*3+i+j*.6)*.5)}
  cracks.children.forEach(m=>m.material.color.setRGB(1,.35+.25*Math.sin(T*3)+mk*.3,.15));
  if(sp.fire&&sp.fire.g.visible)sp.fire.fl.intensity=1.1+Math.sin(T*17)*.3+Math.sin(T*7)*.2;
  if(balloons.visible)balloons.children.forEach(g=>{const u=g.userData;frameLL(sp,u.la+Math.sin(T*.05+u.ph)*.4,u.lo+Math.cos(T*.04+u.ph)*.5,u.alt+Math.sin(T*.7+u.ph)*2,T*.05+u.ph,g)});
  if(mayaShip.visible)frameLL(sp,-9+Math.sin(T*.04)*1.2,69+Math.cos(T*.04)*1.6,175+Math.sin(T*.3)*14,T*.04+1.2,mayaShip,false);
  // drifting fog
  if(mist.visible)mist.userData.drift.forEach((s,i)=>{s.position.copy(s.userData.b).addScaledVector(V3(1,0,.3),Math.sin(T*.08+s.userData.ph)*14)});
  // ghost fires at night over the fog sea
  const gc=dirLL(11,-24);const camUp=camera.position.clone().normalize();ghosts.visible=ERA>=4&&rig.alt<1300&&gc.dot(sp.sunDir)<-.05&&angDeg(camUp,gc)<16;if(ghosts.visible&&!found.has('ghost'))egg('ghost');
  // souls going home: the dragon woods at night
  maoyuSink+=((maoyuHover?1:0)-maoyuSink)*Math.min(1,dt*5);
  if(snowFx.visible||ERA===4)updateSnow(dt)};
 // snowfall around the camera in the great cold
 const snowN=2400,snowG=new THREE.BufferGeometry(),snowP=new Float32Array(snowN*3);for(let i=0;i<snowN;i++)snowP.set([(Math.random()-.5)*300,Math.random()*160,(Math.random()-.5)*300],i*3);
 snowG.setAttribute('position',new THREE.BufferAttribute(snowP,3));const snowFx=new THREE.Points(snowG,new THREE.PointsMaterial({map:dotTex,color:0xffffff,size:.9,transparent:true,opacity:.85,depthWrite:false}));snowFx.frustumCulled=false;sp.scene.add(snowFx);
 function updateSnow(dt){snowFx.visible=rig.alt<520&&ERA===4&&CUR===sp;if(!snowFx.visible)return;const a=snowG.attributes.position.array;for(let i=0;i<snowN;i++){a[i*3+1]-=dt*(12+(i%7)*3);a[i*3]+=Math.sin(i+GT.value)*dt*2;if(a[i*3+1]<-20)a[i*3+1]+=160}snowG.attributes.position.needsUpdate=true;snowFx.position.copy(camera.position);snowFx.quaternion.copy(camera.quaternion)}
 sp.boom=(p,col)=>boom(sp,p,col);
 // labels for the continents, only when far away
 REGIONS.filter(r=>(r.rad||r.id==='south6')&&(r.m||'rongqiu')==='rongqiu').forEach(r=>sp.labels.push({n:r.n,id:W[r.id]?r.id:(r.id==='south6'&&W.rq_south?'rq_south':null),pos:dirLL(...r.ll).multiplyScalar(R+70),minAlt:1500,e:r.id==='east'?[5,6,7,8,9,10,11,12]:r.id==='west'?[3,4,5,6,7,8,9,10,11,12]:r.id==='south'?[1,2,3,4,5]:r.id==='south6'?[6,7,8,9,10,11,12]:null}));
 entryModels(sp);placeMotes(sp);
 return sp}

/* creature hit-spheres: every member of every herd can be hovered and touched */
function herdProx(sp){for(const h of sp.herds){const w=W[h.f.w];if(!w)continue;const f=h.f;
 h.list.forEach((x,i)=>{const o=x.o;let c;if(o.userData.segs)c=()=>o.userData.segs[0].position;else if(o.userData.swarm){const a=o.userData.swarm;c=()=>_hp.set(a[0],a[1],a[2])}else if(o.userData.maoyu)c=()=>dirLL(...f.at).multiplyScalar(R+sp.gh(...f.at)+1);else c=()=>o.position;
  {const c0=c,fb=V3();c=()=>{const v=c0();if(v.lengthSq()>1)return v;return fb.copy(dirLL(...f.at)).multiplyScalar(R+sp.gh(...f.at)+(f.alt||0)+1)}}
  prox(sp,w.id,c,Math.max(2.4,f.s*3.4),{hide:()=>!o.visible,maxD:1200+f.s*120,herd:h,mao:o.userData.maoyu?1:0,e:f.e})})}}
const _hp=V3();
/* entries with no body of their own get a soft mote at their place */
const REGID=new Set(REGIONS.map(r=>r.id));
function placeMotes(sp){const have=new Set(sp.prox.map(p=>p.w.id));
 WIKI.filter(w=>mapOf(w)===sp.id&&w.ll&&!have.has(w.id)&&w.id!==sp.id&&w.c!=='地理'&&!REGID.has(w.id)).forEach(w=>{const m=mote(w);const la=w.ll[0],lo=w.ll[1];const h=sp.gh(la,lo);const pos=dirLL(la,lo).multiplyScalar(R+h+(w.c==='地理'?8:4));m.position.copy(pos);
  sp.scene.add(m);sp.eraObjs.push({o:m,e:w.e,noCarry:true});m.userData.w=w;(sp.motes=sp.motes||[]).push(m);prox(sp,w.id,pos,w.c==='地理'?14:5,{hide:()=>!m.visible,maxD:w.c==='地理'?3200:1500,mote:m})})}

/* a burst of sparks (the art of explosions) */
const BOOMS=[];
function boom(sp,p,col){const n=260,g=new THREE.BufferGeometry(),a=new Float32Array(n*3),v=[];const up2=p.clone().normalize();for(let i=0;i<n;i++){a.set([p.x,p.y,p.z],i*3);v.push(V3(Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize().addScaledVector(up2,.8).normalize().multiplyScalar(10+Math.random()*28))}
 g.setAttribute('position',new THREE.BufferAttribute(a,3));const pts=new THREE.Points(g,new THREE.PointsMaterial({map:dotTex,color:col,size:2.2,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));pts.frustumCulled=false;sp.scene.add(pts);BOOMS.push({pts,v,t:0,up:up2,sc:sp.scene});
 const fl=glowSprite(col,60,1);fl.position.copy(p);sp.scene.add(fl);BOOMS.push({spr:fl,t:0,sc:sp.scene})}
function updateBooms(dt){for(let i=BOOMS.length-1;i>=0;i--){const b=BOOMS[i];b.t+=dt;if(b.spr){b.spr.material.opacity=Math.max(0,1-b.t*1.5);b.spr.scale.setScalar(60+b.t*80);if(b.t>.8){b.sc.remove(b.spr);BOOMS.splice(i,1)}continue}
 const a=b.pts.geometry.attributes.position.array;for(let k=0;k<b.v.length;k++){b.v[k].addScaledVector(b.up,-20*dt);a[k*3]+=b.v[k].x*dt;a[k*3+1]+=b.v[k].y*dt;a[k*3+2]+=b.v[k].z*dt}b.pts.geometry.attributes.position.needsUpdate=true;b.pts.material.opacity=1-b.t/2.2;if(b.t>2.2){b.sc.remove(b.pts);BOOMS.splice(i,1)}}}
