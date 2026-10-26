/* ================================================================
   softer, more solid models (image quality, step 4)
   · every round primitive gets more sides (by quality step), so spheres, trunks and horns stop reading as faceted toys
   · plain boxes (buildings, props, crates) get a small bevel with rolled normals, so edges catch the light
   · every standard material: soft wrap toward the sky light, a little roughness variation, micro-grain in the normal up
     close, a tint jitter per instance, and a darkening at the foot of instanced things (trees, rocks, houses) where the
     real ambient occlusion is off
   · shadow bias follows the shadow box so small props no longer float
   · the generic bump (roots, rocks, ice) no longer breaks into per-pixel static up close
   · the jungle/town tree kinds get the rounded crowns the forests got in step 2; near crowns are smoother still
   · the weakest models reworked: 全通列车, 唤雾者, 大气史莱姆, 光龙, 燃尽者, 食苔甲, 天船, 观察者, 不可预见之地, 雪原, the era-1 绿毯 and the cells
   ================================================================ */

/* ---- quality: 0 best .. 3 lowest; phones one step down ---- */
function q4b_tier(){if(window.__q4btier!==undefined)return window.__q4btier;const l=(typeof perf!=='undefined'&&perf?perf.lvl:0)+(COARSE?1:0)+Q5OFF();return Math.min(3,l|0)}

/* ---------------- 1. geometry: more sides on every round primitive, bevelled boxes ----------------
   called from the top of 10_core.js (hoisted), before any geometry is made. Segment counts of 3 (blades) and 4 (pyramids,
   square posts) are meant as they are and stay; everything else grows a little (kept modest: the exhibition runs smooth first). */
function q4b_geoBoost(){if(q4b_geoBoost.done)return;q4b_geoBoost.done=1;
 const up=n=>n<=4?n:n<=6?8:n<=9?10:n<=12?12:n;
 const S=THREE.SphereGeometry;class S2 extends S{constructor(r,w,h,...a){w=w===undefined?8:w;h=h===undefined?6:h;const w2=up(w);const h2=h<=3?h:Math.max(h,Math.round(w2*.6));super(r,w2,h2,...a)}}THREE.SphereGeometry=S2;
 const Cy=THREE.CylinderGeometry;class Cy2 extends Cy{constructor(a,b,h,rs,...r){super(a,b,h,up(rs===undefined?8:rs),...r)}}THREE.CylinderGeometry=Cy2;
 const Co=THREE.ConeGeometry;class Co2 extends Co{constructor(r,h,rs,...a){super(r,h,up(rs===undefined?8:rs),...a)}}THREE.ConeGeometry=Co2;
 const To=THREE.TorusGeometry;class To2 extends To{constructor(r,t,rs,ts,...a){rs=rs===undefined?8:rs;ts=ts===undefined?6:ts;super(r,t,rs<=4?rs:Math.max(rs,8),ts<=4?ts:Math.max(ts,16),...a)}}THREE.TorusGeometry=To2;
 const La=THREE.LatheGeometry;class La2 extends La{constructor(p,s,...a){super(p,up(s===undefined?12:s),...a)}}THREE.LatheGeometry=La2;
 const Tu=THREE.TubeGeometry;class Tu2 extends Tu{constructor(p,ts,r,rs,...a){rs=rs===undefined?8:rs;super(p,ts,r,rs<=3?rs:Math.max(rs,8),...a)}}THREE.TubeGeometry=Tu2;
 // a plain box (no segment counts asked for) becomes a bevelled one when it is big enough for the bevel to show
 const Bx=THREE.BoxGeometry;class Bx2 extends Bx{constructor(w,h,d,ws,hs,ds){w=w===undefined?1:w;h=h===undefined?1:h;d=d===undefined?1:d;
  if(ws===undefined&&hs===undefined&&ds===undefined&&Math.min(w,h,d)>=.45&&Math.max(w,h,d)<400){super(w,h,d);q4b_bevel(this,w,h,d)}else super(w,h,d,ws,hs,ds)}}THREE.BoxGeometry=Bx2}
/* rebuild a box as 6 inset faces, 12 edge strips and 8 corner triangles; the edge and corner vertices take rolled normals so
   the light slides round the edge instead of snapping (44 triangles instead of 12) */
function q4b_bevel(g,w,h,d){const c=Math.max(.025,Math.min(.09,Math.min(w,h,d)*.1));const E=[w/2,h/2,d/2];const P=[],N=[],U=[],I=[];let n=0;
 const V=(p,nn)=>{P.push(p[0],p[1],p[2]);N.push(nn[0],nn[1],nn[2]);U.push(p[0]/w+.5,p[1]/h+.5);return n++};
 // a triangle wound so it faces its own vertices' normal
 const tri=(a,b,e)=>{const ax=P[b*3]-P[a*3],ay=P[b*3+1]-P[a*3+1],az=P[b*3+2]-P[a*3+2],bx=P[e*3]-P[a*3],by=P[e*3+1]-P[a*3+1],bz=P[e*3+2]-P[a*3+2];
  const cx=ay*bz-az*by,cy=az*bx-ax*bz,cz=ax*by-ay*bx;if(cx*(N[a*3]+N[b*3]+N[e*3])+cy*(N[a*3+1]+N[b*3+1]+N[e*3+1])+cz*(N[a*3+2]+N[b*3+2]+N[e*3+2])>0)I.push(a,b,e);else I.push(a,e,b)};
 const quad=(a,b,e,f)=>{tri(a,b,e);tri(b,f,e)};
 // the six inset faces
 for(let a=0;a<3;a++)for(const s of[1,-1]){const b=(a+1)%3,e=(a+2)%3;const nn=[0,0,0];nn[a]=s;const id=[];
  for(const[u,v]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const p=[0,0,0];p[a]=s*E[a];p[b]=u*(E[b]-c);p[e]=v*(E[e]-c);id.push(V(p,nn))}quad(id[0],id[1],id[2],id[3])}
 // twelve edge strips with normals rolled between the two faces
 for(let a=0;a<3;a++)for(let b=a+1;b<3;b++){const e=3-a-b;for(const sa of[1,-1])for(const sb of[1,-1]){const nn=[0,0,0];nn[a]=sa*.70711;nn[b]=sb*.70711;const id=[];
  for(const onA of[1,0])for(const se of[-1,1]){const p=[0,0,0];p[a]=sa*(onA?E[a]:E[a]-c);p[b]=sb*(onA?E[b]-c:E[b]);p[e]=se*(E[e]-c);id.push(V(p,nn))}quad(id[0],id[1],id[2],id[3])}}
 // eight corner triangles
 const l3=1/Math.sqrt(3);for(const sx of[1,-1])for(const sy of[1,-1])for(const sz of[1,-1]){const sg=[sx,sy,sz],nn=[sx*l3,sy*l3,sz*l3],id=[];
  for(let a=0;a<3;a++){const p=[sx*(E[0]-c),sy*(E[1]-c),sz*(E[2]-c)];p[a]=sg[a]*E[a];id.push(V(p,nn))}tri(id[0],id[1],id[2])}
 g.setIndex(I);g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(N,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));
 // one group per face as the plain box has (material arrays keep working); the bevel strips and corners join the +x group
 g.clearGroups();for(let f=0;f<6;f++)g.addGroup(f*6,6,f);g.addGroup(36,I.length-36,0);g.boundingSphere=null;g.boundingBox=null}

/* ---------------- 2. materials: one patch for every lit material ----------------
   through the shared shader chunks, so every MeshStandard/Phong/Lambert material (and the ones with their own onBeforeCompile)
   gets it without being touched: a soft sky-facing rim fill, roughness that varies over the surface, micro-grain in the normal
   up close, a tint jitter per instance and a contact darkening at the foot of instanced kits. Strengths are uniforms set per
   frame from the quality step and the space. */
const Q4BU={q4bQ:{value:new THREE.Vector4(0,0,0,0)},q4bSky:{value:new THREE.Vector4(0,0,0,0)},q4bRad:{value:0}};
{const SC=THREE.ShaderChunk;
 SC.common+=`
uniform vec4 q4bQ;uniform vec4 q4bSky;uniform float q4bRad;varying vec2 q4bV;
float q4b_h(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float q4b_n(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(mix(mix(q4b_h(i),q4b_h(i+vec3(1,0,0)),f.x),mix(q4b_h(i+vec3(0,1,0)),q4b_h(i+vec3(1,1,0)),f.x),f.y),mix(mix(q4b_h(i+vec3(0,0,1)),q4b_h(i+vec3(1,0,1)),f.x),mix(q4b_h(i+vec3(0,1,1)),q4b_h(i+vec3(1,1,1)),f.x),f.y),f.z);}
`;
 // the vertex side: the local height above the kit's base and a hash of where the copy stands (instanced meshes only)
 SC.project_vertex+=`
#ifdef USE_INSTANCING
q4bV=vec2(position.y+10.,fract(sin(dot(floor(instanceMatrix[3].xyz*8.),vec3(12.9898,78.233,37.719)))*43758.5453));
#else
q4bV=vec2(0.);
#endif`;
 // tint jitter and foot darkening
 SC.color_fragment+=`
if(q4bV.x>5.){float q4j=q4bV.y,q4j2=fract(q4j*7.31);diffuseColor.rgb*=(1.+(q4j-.5)*q4bQ.w)*vec3(1.+(q4j2-.5)*q4bQ.w*.5,1.,1.-(q4j2-.5)*q4bQ.w*.5);
 diffuseColor.rgb*=1.-q4bQ.z*(1.-smoothstep(-.25,1.3,q4bV.x-10.));}`;
 // roughness varies a little over the surface, so highlights break up instead of reading as one plastic sheen
 SC.roughnessmap_fragment+=`
#ifndef IS_PLANET
if(q4bQ.x>0.){vec3 q4w=cameraPosition+(vec4(-vViewPosition,0.)*viewMatrix).xyz;float q4a=q4bQ.x*(1.-smoothstep(.3,.6,metalness))*smoothstep(.25,.55,roughnessFactor);roughnessFactor=clamp(roughnessFactor*(1.-q4a*.5+q4a*q4b_n(q4w*1.9)),.04,1.);}
#endif`;
 // micro-grain in the normal up close (only where there is no bump or normal map of its own)
 SC.normal_fragment_maps+=`
#if !defined(USE_BUMPMAP)&&!defined(USE_NORMALMAP)&&!defined(FLAT_SHADED)&&!defined(NORMAL)&&(defined(GL_OES_standard_derivatives)||(__VERSION__>=300))
if(q4bQ.y>0.){float q4d=length(vViewPosition);float q4k=(1.-smoothstep(10.,70.,q4d))*q4bQ.y;if(q4k>0.){vec3 q4w=cameraPosition+(vec4(-vViewPosition,0.)*viewMatrix).xyz;
 float q4h=q4b_n(q4w*5.)*.6+q4b_n(q4w*16.)*.4;vec2 q4g=vec2(dFdx(q4h),dFdy(q4h))*q4k*.012;
 vec3 q4sp=-vViewPosition;vec3 q4sx=dFdx(q4sp),q4sy=dFdy(q4sp);vec3 q4r1=cross(q4sy,normal),q4r2=cross(normal,q4sx);float q4det=dot(q4sx,q4r1)*faceDirection;
 if(abs(q4det)>1e-12){vec3 q4gr=sign(q4det)*(q4g.x*q4r1+q4g.y*q4r2);normal=normalize(abs(q4det)*normal-q4gr);}}}
#endif`;
 // a soft fill from the sky side, strongest at grazing angles: the wrap light that keeps the shade side from going flat
 SC.lights_fragment_begin=SC.lights_fragment_begin.replace('#if defined( RE_IndirectSpecular )',`#if defined( RE_IndirectDiffuse )
if(q4bSky.w>0.){vec3 q4w=cameraPosition+(vec4(-vViewPosition,0.)*viewMatrix).xyz;vec3 q4up=q4bRad>.5?normalize(q4w):vec3(0.,1.,0.);vec3 q4n=inverseTransformDirection(geometry.normal,viewMatrix);
 float q4sk=dot(q4n,q4up)*.5+.5;float q4rim=pow(1.-saturate(dot(geometry.normal,geometry.viewDir)),2.5);irradiance+=PI*q4bSky.rgb*(q4rim*(.3+.7*q4sk)+.1*q4sk)*q4bSky.w;}
#endif
#if defined( RE_IndirectSpecular )`);
 // every program gets the uniforms
 const ob=THREE.Material.prototype.onBuild;THREE.Material.prototype.onBuild=function(sh,r){if(sh&&sh.uniforms)Object.assign(sh.uniforms,Q4BU);if(ob)ob.call(this,sh,r)}}

/* per frame: strengths by quality step and space; the sky fill follows the planet's sky light and the time of day */
const _q4bCol=new THREE.Color();
function q4b_frame(sp){if(CUR!==sp)return;const ti=q4b_tier(),Q=Q4BU.q4bQ.value,S=Q4BU.q4bSky.value;const pl=sp.type==='planet';
 if(window.__q4bQ){}else{Q.x=ti<=2?.22:0;Q.y=ti<=1?1:0;const aoOn=typeof q3_aoWanted==='function'&&q3_aoWanted()&&rig.alt<450;Q.z=pl?(aoOn?.22:.36):.14;Q.w=.12}
 Q4BU.q4bRad.value=pl?1:0;
 if(pl&&sp.hemi){const day=sp.dayK===undefined?1:sp.dayK;_q4bCol.copy(sp.hemi.color);S.set(_q4bCol.r,_q4bCol.g,_q4bCol.b,.08+.18*day);
  // the sky light itself a little stronger than before: the shade side was reading as flat grey
  sp.hemi.intensity*=1.2}
 else S.set(.5,.6,.8,.1)}
window.__q4b={U:Q4BU};

/* ---------------- 3. light response ----------------
   the shadow's normal bias grew with the shadow box, so at 100–300 up small props sat on a gap of light; a smaller bias
   plus a touch of depth bias keeps them grounded without acne */

function q4b_shadowFollow(sp,sun,sdot){shadowFollowBase(sp,sun,sdot);if(!sun.userData.pk){const h=sun.shadow.camera.right;sun.shadow.normalBias=h*2/SHD.ms*.7;sun.shadow.bias=-.00018}}

/* the generic bump (roots, rocks, ice, the creator's roots): its finest octave was a whole unit of height over a tenth of a
   unit, so up close the normal flipped from pixel to pixel and read as static. The octaves now fade out as they shrink
   below a few pixels, and the slope is scaled to something a surface could have */

function detailMat(m,o){const r=q2_detailMat(m,o);if(o&&o.planet)return r;const ob=r.onBeforeCompile;
 r.onBeforeCompile=sh=>{ob(sh);sh.fragmentShader=sh.fragmentShader
  .replace('float hTer(vec3 p){p*=uFreq;float h=vn3(p*.33)*1.1+vn3(p*1.25)*.38+vn3(p*4.1)*.12;','float hTer(vec3 p){p*=uFreq;float fw=length(fwidth(p));float h=vn3(p*.33)*.7+vn3(p*1.25)*.3*(1.-smoothstep(.2,.6,fw))+vn3(p*4.1)*.08*(1.-smoothstep(.05,.15,fw));')
  .replace('vec2 dHdxy_fwd(){float d=length(vViewPosition);float k=(1.-smoothstep(50.,750.,d))*bumpScale;float h=hTer(vOP);','vec2 dHdxy_fwd(){float d=length(vViewPosition);float k=(1.-smoothstep(50.,750.,d))*bumpScale*.5;float h=hTer(vOP);')};
 const ck=r.customProgramCacheKey;r.customProgramCacheKey=()=>'q4b'+(ck?ck.call(r):'');return r}

/* ---------------- 4. trees ----------------
   (a) the forests' near kits switch to a smoother "close" kit (crown lumps at twice the mesh density) inside ~60 units, where
       the step-2 crowns still showed their facets; (b) the tree kinds used by the jungle, the towns and the lone trees
       (TREE.*) get the same rounded, shaded crowns instead of flat icosahedron lumps */
const q4b_crown1=q2_crown;
function q4b_crownN(det){return function(blobs,cc,rc,seed){const gs=[];const v=V3(),nb=V3(),nc=V3();let yb=1e9,yt=-1e9;for(const b of blobs){yb=Math.min(yb,b[1]-b[3]);yt=Math.max(yt,b[1]+b[3])}
 blobs.forEach((b,bi)=>{const g=new THREE.IcosahedronGeometry(1,det);const P=g.attributes.position,N=g.attributes.normal,n=P.count,col=new Float32Array(n*3);
  for(let i=0;i<n;i++){v.set(P.getX(i),P.getY(i),P.getZ(i)).normalize();nb.copy(v);const k=1+(n3(v.x*1.7+bi*3.1+seed,v.y*1.7,v.z*1.7)-.5)*.42+(n3(v.x*4.3+seed,v.y*4.3+bi,v.z*4.3)-.5)*.1;
   v.multiplyScalar(b[3]*k);v.y*=b[4]||.86;v.x+=b[0];v.y+=b[1];v.z+=b[2];P.setXYZ(i,v.x,v.y,v.z);
   nc.set(v.x-cc[0],(v.y-cc[1])*1.15,v.z-cc[2]).normalize();nb.lerp(nc,.62).normalize();N.setXYZ(i,nb.x,nb.y,nb.z);
   const t=clamp((v.y-yb)/(yt-yb),0,1),out=clamp(Math.hypot(v.x-cc[0],v.y-cc[1],v.z-cc[2])/rc,0,1);const s=(.5+.5*Math.pow(t,.8))*(.72+.28*out)*(.94+.12*h3(bi,seed,1));col[i*3]=col[i*3+1]=col[i*3+2]=s}
  g.setAttribute('color',new THREE.BufferAttribute(col,3));if(g.attributes.uv)g.deleteAttribute('uv');gs.push(g)});
 return gs}}
const q4b_crown2=q4b_crownN(2);
const Q4B_CLOSE=new Map();

function q2_treeKits(KITS,NEAR){q2_treeKitsBase(KITS,NEAR);if(q4b_tier()>=3)return;
 try{const K2={};for(const k in KITS)K2[k]=KITS[k].clone();const N2={};q2_crown=q4b_crown2;q2_treeKitsBase(K2,N2);q2_crown=q4b_crown1;
  for(const k in N2)if(NEAR[k])Q4B_CLOSE.set(NEAR[k],N2[k])}catch(e){q2_crown=q4b_crown1;console.warn('q4b close kits',e)}}
/* the near and close kits are drawn from the same groups; each copy decides in the vertex shader which of the two shows it,
   by its own distance to the camera (so a wide group near the camera does not switch wholesale) */

function swayMat(o,k){const m=q2_swayMat(o,k);const ob=m.onBeforeCompile;const U=m.userData.U=m.userData.U||{};U.uLod={value:new THREE.Vector2(0,1e9)};m.userData.q4bArgs=[o,k];
 m.onBeforeCompile=sh=>{ob(sh);sh.uniforms.uLod=U.uLod;sh.vertexShader='uniform vec2 uLod;\n'+sh.vertexShader.replace('#include <project_vertex>',`#ifdef USE_INSTANCING
{vec3 q4ip=(modelMatrix*instanceMatrix)[3].xyz;float q4dl=distance(q4ip,cameraPosition);if(q4dl<uLod.x||q4dl>=uLod.y)transformed=vec3(0.);}
#endif
#include <project_vertex>`)};m.customProgramCacheKey=()=>'sway2q4';return m}
const Q4B_LOD=62,Q4B_LODM=new WeakMap();
/* one near material and one close material per tree material, each with its own distance window */
function q4b_lodMat(mat,lo,hi){if(!mat.userData.q4bArgs)return mat;let L=Q4B_LODM.get(mat);if(!L)Q4B_LODM.set(mat,L={});const key=lo+'|'+hi;if(L[key])return L[key];const m=swayMat(...mat.userData.q4bArgs);m.userData.U.uLod.value.set(lo,hi);m.userData.envSet=mat.userData.envSet;return L[key]=m}

function inst(geo,mat,pts,setter,eras,opt){const cl=Q4B_CLOSE.get(geo);if(!cl||!mat.userData.q4bArgs)return instBase(geo,mat,pts,setter,eras,opt);
 const r=instBase(geo,q4b_lodMat(mat,Q4B_LOD,1e9),pts,setter,eras,opt);
 const c=instBase(cl,q4b_lodMat(mat,0,Q4B_LOD),pts,setter,eras,Object.assign({},opt,{far:Q4B_LOD+10}));c.userData.noShadow=1;c.castShadow=false;return r}
/* a crown for the TREE kinds: the shaded lumps tinted with the kind's own green (they are drawn with and without a tint) */
function q4b_crownG(blobs,cc,rc,seed,col){const c=C(col);return q4b_crownN(1)(blobs,cc,rc,seed).map(g=>{const a=g.attributes.color;for(let i=0;i<a.count;i++)a.setXYZ(i,a.getX(i)*c.r,a.getY(i)*c.g,a.getZ(i)*c.b);return g})}
function q4b_merge(gs){return THREE.BufferGeometryUtils.mergeBufferGeometries(gs.map(g=>{g=g.index?g.toNonIndexed():g;if(g.attributes.uv)g.deleteAttribute('uv');return g}))}
{const T=TREE;
 T.broad=()=>{const trunk=G([[kcy(.28,.45,5,10),'#4f3b2a',{p:[0,2.5,0]}],[kcy(.09,.14,2,6),'#4f3b2a',{p:[.8,4.4,.3],r:[0,0,-.8]}],[kcy(.08,.12,1.8,6),'#4f3b2a',{p:[-.7,4.3,-.4],r:[.4,0,.8]}]]);
  const bl=[[0,6.1,0,2.1,.84],[1.3,5.1,.6,1.5,.85],[-1.1,5.4,-.8,1.45,.85],[.3,7.3,.2,1.3,.8],[-.6,5.6,1.3,1.2,.85],[.9,5,-1.2,1.1,.85],[-1.4,6.6,.4,1,.85]];
  return q4b_merge([trunk,...q4b_crownG(bl,[0,6,0],3,3,'#2f6b3c')])};
 T.rain=()=>{const trunk=G([[kcy(.3,.5,9,10),'#4a3a28',{p:[0,4.5,0]}],[ktube([V3(.2,8,0),V3(1.5,5,.5),V3(1.8,2,.7)],.06,8),'#3f6a34'],[ktube([V3(-.2,8.4,0),V3(-1.4,6,-.6),V3(-1.6,3.5,-.9)],.05,8),'#3f6a34'],
   ...[0,1,2,3,4].map(i=>{const a=i*1.26;const l=kc(.4,2.4,4);return[l,'#2f7a3a',{p:[Math.cos(a)*1.2,1.1,Math.sin(a)*1.2],r:[Math.sin(a)*.9,0,-Math.cos(a)*.9]}]})]);
  const bl=[[0,9.5,0,2.7,.6],[1.5,8.4,1,1.7,.65],[-1.4,8.6,-.9,1.6,.65],[.4,10.6,-.4,1.5,.6],[-.8,8.9,1.4,1.3,.65]];
  return q4b_merge([trunk,...q4b_crownG(bl,[0,9.3,0],3.4,5,'#1f5a32')])};
 T.twist=()=>{const trunk=G([[ktube(spiralPts(0,10,.95,.45,1.4),.34,24),'#5b4733'],[ktube(spiralPts(Math.PI,10,.95,.45,1.4),.3,24),'#4c3b2b'],[kcy(2.5,2.2,.4,10),'#4a3a28',{p:[0,10.1,0]}],
   [ki(1,0),'#3a7a4a',{p:[.6,5.6,0],s:[1.5,.5,1.4]}],[ki(1,0),'#336e44',{p:[-.7,6.4,.4],s:[1.2,.45,1.2]}]]);
  const bl=[[0,11.1,0,2.9,.4],[1.6,10.6,.9,1.8,.5],[-1.5,10.7,-1,1.7,.5],[.2,11.6,-1.5,1.3,.5],[-.3,11.3,1.6,1.2,.5]];
  return q4b_merge([trunk,...q4b_crownG(bl,[0,10.9,0],3.3,7,'#2f7550')])};
 T.platform=()=>{const P=[[kcy(.7,1.2,15,10),'#6a5236',{p:[0,7.5,0]}]];for(let i=0;i<4;i++){const a=i*1.57+.4;P.push([ktube([V3(0,.3,0),V3(Math.cos(a)*1.6,-.2,Math.sin(a)*1.6),V3(Math.cos(a)*2.6,-.6,Math.sin(a)*2.6)],.32,8,5),'#5b4630'])}
  const decks=[];[[5.6,0,2],[8.4,2.1,-2.2],[11.2,4.2,1.9]].forEach(([y,a,o])=>{const x=Math.cos(a)*o,z=Math.sin(a)*o;P.push([ktube([V3(0,y-1.4,0),V3(x*.5,y-.6,z*.5),V3(x,y,z)],.25,8,5),'#5b4630']);P.push([kcy(2.6,2.3,.22,12),'#8a6a44',{p:[x,y,z]}]);decks.push([x*1.1,y+1.1,z*1.1,2.1,.45])});
  for(let i=0;i<7;i++){const a=i*.9;P.push([kcy(.05,.03,3.4,3),'#4f7a3a',{p:[Math.cos(a)*3.4,12.2,Math.sin(a)*3.4]}])}
  const bl=[[0,15.4,0,4.4,.5],[2.2,14,1.2,2.7,.55],[-2,14.4,-1.4,2.5,.55],[.6,16.4,-1.8,2,.5]];
  return q4b_merge([G(P),...q4b_crownG(bl,[0,15,0],5,9,'#3b7c44'),...q4b_crownG(decks,[0,8,0],9,11,'#4a8a4c')])}}

/* ---------------- 5. the weakest models, reworked against the novel ---------------- */
/* 全通列车: the continent-spanning train of the 虚民 world — carriages with window bands and sliding doors on bogies, a
   rounded nose at each end, a light strip along the roof (it runs on tracks over the sea and between towers) */
function q4b_train(f){const g=new THREE.Group();const body=M('#d8dde2',{metalness:.55,roughness:.32}),dark=M('#2a3038',{metalness:.3,roughness:.5}),glass=M('#3a5a7a',{metalness:.2,roughness:.12,emissive:'#243a52',emissiveIntensity:.3}),strip=GL('#9ad8ff',.85);
 const N=4,L=.78,gap=.05,x0=(N*(L+gap)-gap)/2;
 for(let i=0;i<N;i++){const car=new THREE.Group();car.position.x=x0-L/2-i*(L+gap);g.add(car);
  const sh=new THREE.Mesh(new THREE.BoxGeometry(L,.3,.3),body);sh.position.y=.24;car.add(sh);
  const wb=new THREE.Mesh(new THREE.BoxGeometry(L-.1,.09,.312),glass);wb.position.y=.3;car.add(wb);
  for(const z of[-1,1])for(const dx of[-L*.3,L*.3]){const d=new THREE.Mesh(new THREE.BoxGeometry(.12,.2,.012),dark);d.position.set(dx,.2,z*.156);car.add(d)}
  for(const dx of[-L*.3,L*.3]){const bg=new THREE.Mesh(new THREE.BoxGeometry(.2,.07,.24),dark);bg.position.set(dx,.06,0);car.add(bg)}
  const rf=new THREE.Mesh(new THREE.BoxGeometry(L-.08,.04,.14),strip);rf.position.y=.4;car.add(rf);
  if(i<N-1){const cp=cyl(.04,.04,gap+.06,dark,8);cp.rotation.z=Math.PI/2;cp.position.set(-L/2-gap/2,.2,0);car.add(cp)}}
 for(const s of[-1,1]){const nose=sph(0,.28,.15,.15,18,body);nose.position.set(s*x0,.24,0);g.add(nose);const lamp=sph(0,.04,.04,.04,8,GL('#ffffff',.9));lamp.position.set(s*(x0+.24),.2,0);g.add(lamp);g.add(at(glowSprite('#cfe8ff',.7,.5),s*(x0+.26),.2,0))}
 g.userData.noSkin=1;return g}


/* 燃尽者: the brain-spirit's soldiers, fifty metres tall, three holes in the head, no lower body — a charred crust over an
   inner fire, floating on the heat it sheds */
function q4b_burner(f){const g=new THREE.Group();const crust=detailMat(new THREE.MeshStandardMaterial({color:'#231a16',roughness:.92,emissive:'#ff5a1a',emissiveIntensity:.2}),{bump:.9,freq:3});const ember=EM('#ff8a3a',1.5),pit=M('#050302',{roughness:1});
 const hd=sph(0,.82,.98,.82,22,crust);hd.position.y=3.55;g.add(hd);
 for(let i=0;i<3;i++){const y=3.8-(i===2?.55:0),z=i===2?0:(i-.5)*.62;const p=cyl(.17,.17,.3,pit,14);p.rotation.z=Math.PI/2;p.position.set(.72,y,z);g.add(p);const rim=new THREE.Mesh(new THREE.TorusGeometry(.19,.03,8,20),ember);rim.rotation.y=Math.PI/2;rim.position.set(.82,y,z);g.add(rim)}
 const prof=[[0,4.3],[.55,4.26],[.95,3.9],[1.3,3.2],[1.32,2.6],[1.05,1.9],[.8,1.25],[.55,.65],[.3,.15],[.04,0]].map(([r,y])=>new THREE.Vector2(r,y));g.add(new THREE.Mesh(new THREE.LatheGeometry(prof,24),crust));
 for(const z of[-1,1]){const arm=new THREE.Group();arm.position.set(.1,3.1,z*1.25);g.add(arm);const up=cyl(.23,.17,1.3,crust,12);up.position.y=-.65;arm.add(up);const lo=cyl(.16,.11,1.2,crust,12);lo.position.set(.12,-1.8,0);arm.add(lo);
  for(let k=0;k<3;k++){const fg=cone(.06,.42,crust,8);fg.position.set(.12+(k-1)*.1,-2.55,(k-1)*.09);fg.rotation.x=Math.PI;arm.add(fg)}g.userData.arms=(g.userData.arms||[]).concat([{m:arm,z}])}
 for(let i=0;i<10;i++){const a=h3(i,1,3)*6.28,y=.8+h3(i,2,3)*2.6;const r=.3+Math.sin(Math.min(1,y/4.3)*Math.PI)*.95;const s=new THREE.Mesh(new THREE.BoxGeometry(.035,.25+h3(i,3,3)*.5,.035),ember);s.position.set(Math.cos(a)*r*.98,y,Math.sin(a)*r*.98);s.rotation.set(0,-a,(h3(i,4,3)-.5)*.8);g.add(s)}
 const fl=emitter({n:110,life:1.8,speed:1.1,spread:.7,size:2.4,dir:[0,-1,0],col:'#ffb050',col2:'#ff3010',op:.7,area:[.5,.3,.5]});g.add(fl);
 g.add(at(glowSprite('#ff6a2a',5.5,.4),0,1.2,0));g.add(at(glowSprite('#ff9a4a',2.2,.5),.75,3.6,0));
 g.userData.anim=t=>{hd.rotation.y=Math.sin(t*.4)*.3;for(const a of g.userData.arms)a.m.rotation.z=.08+Math.sin(t*.9+a.z)*.06};return g}


/* 食苔甲: a metre-long beetle, round as a ball, in hard plated armour; the wing cases split down a seam, ridged across */
function q4b_mossBeetle(f){const g=new THREE.Group();const skin=M(f.col||'#3a5a3a',{roughness:.28,metalness:.25}),dk=M('#1c2a1c',{roughness:.45,metalness:.2}),pale=M('#8aa06a',{roughness:.8});
 const body=sph(0,.8,.52,.62,26,skin);body.position.y=.5;g.add(body);
 const seam=new THREE.Mesh(new THREE.BoxGeometry(1.25,.025,.025),dk);seam.position.y=1.02;g.add(seam);
 for(let i=0;i<5;i++){const x=.45-i*.24;const rr=Math.sqrt(Math.max(0,1-(x/.8)*(x/.8)));const ring=new THREE.Mesh(new THREE.TorusGeometry(rr*.63,.016,6,30,Math.PI),dk);ring.rotation.y=-Math.PI/2;ring.scale.y=.52/.62;ring.position.set(x,.5,0);g.add(ring)}
 const pron=sph(0,.34,.3,.44,18,skin);pron.position.set(.66,.46,0);g.add(pron);const head=sph(0,.22,.17,.24,16,dk);head.position.set(.95,.4,0);g.add(head);
 for(const z of[-1,1]){const md=cone(.05,.22,dk,8);md.position.set(1.14,.34,z*.08);md.rotation.set(0,0,-Math.PI/2);md.rotation.y=z*.3;g.add(md);const e=sph(0,.05,.05,.05,8,M('#0a0a08',{roughness:.2}));e.position.set(1.08,.47,z*.15);g.add(e);
  g.add(tubeAlong([V3(1.1,.5,z*.1),V3(1.35,.68,z*.3),V3(1.55,.62,z*.5)],.012,dk,8))}
 for(let i=0;i<4;i++){const m=sph(0,.09,.03,.08,8,pale);m.position.set(.3-i*.22,.98-i*.02,(i%2?-1:1)*.25);m.rotation.z=(i%2?-1:1)*.3;g.add(m)}
 const legs=[];for(let i=0;i<3;i++)for(const z of[-1,1]){const l=leg2(.36,.42,.045,dk,.9);l.position.set(.45-i*.4,.3,z*.5);l.rotation.x=z*1.05;l.rotation.z=-.55+i*.5;g.add(l);legs.push({m:l,ph:i*2.1+(z>0?0:Math.PI),a:.6})}
 addLegs(g,legs);stdAnim(g,{fq:6,amp:.35});return g}


/* 唤雾者: flying sharks of the brain-spirit's army; living mist pours from where the gills were */
function q4b_fogShark(f){const g=new THREE.Group();const skin=M(f.col||'#c8d8e0',{roughness:.45}),belly=M('#eef4f6',{roughness:.5}),dk=M('#6a7a86',{roughness:.5,side:THREE.DoubleSide});
 const body=new THREE.Mesh(sharkGeo(2.9,.42,.86),skin);g.add(body);const bl=new THREE.Mesh(sharkGeo(2.7,.36,.8),belly);bl.position.y=-.1;bl.scale.set(1,.7,1);g.add(bl);
 const dors=wing(.7,.6,dk,'fin');dors.rotation.set(Math.PI/2,Math.PI/2,0);dors.position.set(.15,.36,0);g.add(dors);
 const wings=[];for(const z of[-1,1]){const w=wing(1.1,.6,dk,'fin');if(z>0){w.rotation.y=-Math.PI/2;w.scale.z=-1}else w.rotation.y=Math.PI/2;w.position.set(.35,-.1,z*.3);w.rotation.x=-z*.3;g.add(w);wings.push({m:w,s:z,a:.1,f:2.4,base:-z*.3})}
 const tail=wing(.8,.55,dk,'fin');tail.rotation.set(Math.PI/2,Math.PI/2,0);tail.position.set(-1.2,.05,0);g.add(tail);const tl=wing(.5,.45,dk,'fin');tl.rotation.set(-Math.PI/2,Math.PI/2,0);tl.position.set(-1.2,-.05,0);g.add(tl);
 for(const z of[-1,1]){for(let i=0;i<5;i++){const s=new THREE.Mesh(new THREE.BoxGeometry(.03,.16,.02),EM('#dfe8f0',.9));s.position.set(.75-i*.08,.02,z*.37);s.rotation.y=z*.25;g.add(s)}
  const e=sph(0,.045,.045,.045,8,M('#0a0c10'));e.position.set(.92,.12,z*.2);g.add(e);
  const fog=emitter({n:70,life:2.6,speed:.55,spread:.6,size:1.4,dir:[-1,0,z*.4],col:'#e6eef4',col2:'#b8c8d4',op:.45,add:false,tex:smokeTex,area:[.25,.1,.05],wander:.6});fog.position.set(.6,0,z*.4);g.add(fog)}
 addWings(g,wings);g.userData.tails=[{m:tail,f:3,a:.25}];stdAnim(g,{});return g}


/* 大气史莱姆: the see-through ray keeps its shape; inside it now ride the 滚雷, the glowing balls that thunder */
function q4b_daqi(f){const g=fxB_daqi(f);g.traverse(o=>{if(o.isMesh&&o.material&&o.material.opacity===.45&&o.material.transparent)o.material.opacity=.55});
 const orbs=[];for(let i=0;i<3;i++){const m=new THREE.MeshStandardMaterial({color:'#eef8ff',emissive:'#cfe8ff',emissiveIntensity:1.4,roughness:.1});const o=sph(0,.11,.1,.11,16,m);o.position.set(-.15+i*.22-.2,.04,(i-1)*.28);g.add(o);const gl=glowSprite('#dff2ff',.9,.5);gl.position.copy(o.position);g.add(gl);orbs.push({o,m,gl,ph:i*2.1})}
 const a0=g.userData.anim;g.userData.anim=t=>{if(a0)a0(t);for(const q of orbs){const k=Math.pow(Math.max(0,Math.sin(t*1.7+q.ph)),6);q.m.emissiveIntensity=.9+2.4*k;q.gl.material.opacity=.3+.6*k;q.gl.scale.setScalar(.8+k*1.1)}};return g}

/* 光龙: a little more body in the skin, so it reads as a beast of light and not a smear */
function q4b_guanglong(f){const g=fxB_guanglong(f);g.traverse(o=>{if(!o.isMesh||!o.material)return;const m=o.material;if(m.transparent&&m.opacity===.42)m.opacity=.58;else if(m.transparent&&m.opacity===.2&&m.side===THREE.BackSide)m.opacity=.32});return g}


/* 观察者: Lin's first eye — a cell that swallowed a strange crystal and could see: the crystal sits in the front of the
   cell like a lens in an iris, the membrane clear round it */
function q4b_observer(){const g=new THREE.Group();const mem=new THREE.MeshStandardMaterial({color:'#e8f4f0',transparent:true,opacity:.34,roughness:.06,emissive:'#9ac8bc',emissiveIntensity:.1,depthWrite:false});
 const m=new THREE.Mesh(sgeo(28),mem);m.scale.setScalar(1.1);g.add(m);
 const cyto=new THREE.Mesh(sgeo(20),new THREE.MeshStandardMaterial({color:'#bfe0d4',transparent:true,opacity:.16,roughness:.3,depthWrite:false}));cyto.scale.setScalar(.95);g.add(cyto);
 const nu=sph(0,.34,.3,.34,18,M('#6a8a7c',{roughness:.5}));nu.position.set(-.35,.05,.1);g.add(nu);
 for(let i=0;i<7;i++){const o=sph(0,.07,.05,.07,10,M(i%2?'#9ab8a8':'#7c9c8c',{roughness:.6}));o.position.set(-.1+(h3(i,1,2)-.5)*1.1,(h3(i,2,2)-.5)*1.1,(h3(i,3,2)-.5)*1.1);g.add(o)}
 const iris=new THREE.Mesh(new THREE.TorusGeometry(.36,.06,10,36),M('#3a5a52',{roughness:.35}));iris.rotation.y=Math.PI/2;iris.position.set(.78,.05,0);g.add(iris);
 const pupil=new THREE.Mesh(new THREE.CircleGeometry(.3,32),M('#0c1816',{roughness:.2}));pupil.rotation.y=Math.PI/2;pupil.position.set(.76,.05,0);g.add(pupil);
 const cr=new THREE.Mesh(ko(.26),EM('#e0fbff',1.1,{roughness:.05,flatShading:true}));cr.position.set(.72,.05,0);cr.scale.set(.7,1.4,1);g.add(cr);g.add(at(glowSprite('#e0fbff',2.2,.65),.8,.05,0));
 for(let i=0;i<12;i++){const a=i/12*6.283;const c=tubeAlong([V3(Math.cos(a)*1.08,Math.sin(a)*1.08,0),V3(Math.cos(a)*1.4,Math.sin(a)*1.4,.1),V3(Math.cos(a)*1.65,Math.sin(a)*1.65,Math.sin(a*3)*.25)],.018,M('#bfe0d4',{roughness:.6}),6);g.add(c)}
 g.userData.anim=t=>{m.scale.setScalar(1.1+Math.sin(t*1.5)*.04);cr.rotation.x=t*.8;nu.position.y=.05+Math.sin(t*.7)*.04};return g}


/* 天船: an alloy-and-crystal airship full of light gas, floating on the cloud sea — a ribbed silver envelope, a crystal ridge
   along its back, a gondola and engine pods beneath, fins at the stern */
function q4b_skyShip(){const g=new THREE.Group();const met=M('#d8e0e8',{metalness:.85,roughness:.22}),rib=M('#aab6c2',{metalness:.7,roughness:.35}),dk=M('#4a5660',{metalness:.5,roughness:.4});
 const env=new THREE.Mesh(sharkGeo(6.4,1.05,.95),met);env.position.y=1.3;g.add(env);
 for(let i=0;i<7;i++){const x=2.2-i*.75;const r=1.05*Math.sin(Math.PI*Math.pow(Math.max(.02,.5-x/6.4),.78))*(1-.42*(.5-x/6.4));const ring=new THREE.Mesh(new THREE.TorusGeometry(r*1.01,.03,8,40),rib);ring.rotation.y=Math.PI/2;ring.scale.z=.95;ring.position.set(x,1.3,0);g.add(ring)}
 const keel=new THREE.Mesh(new THREE.BoxGeometry(4.2,.12,.3),rib);keel.position.y=.42;g.add(keel);
 const gon=new THREE.Mesh(new THREE.BoxGeometry(2.6,.55,.75),met);gon.position.set(.2,.15,0);g.add(gon);const win=new THREE.Mesh(new THREE.BoxGeometry(2.2,.14,.78),EM('#ffe6b0',.7));win.position.set(.2,.2,0);g.add(win);
 for(let i=0;i<4;i++){const st=cyl(.03,.03,.6,rib,6);st.position.set(-.9+i*.7,.55,0);g.add(st)}
 for(const z of[-1,1]){const pod=cyl(.18,.22,.9,dk,14);pod.rotation.z=Math.PI/2;pod.position.set(-.6,.3,z*.85);g.add(pod);const arm=new THREE.BoxGeometry(.1,.1,.5);const a=new THREE.Mesh(arm,rib);a.position.set(-.6,.45,z*.55);g.add(a);g.add(at(glowSprite('#bfe4ff',.9,.55),-1.1,.3,z*.85))}
 for(let i=0;i<5;i++){const x=1.6-i*.8;const cr=new THREE.Mesh(ko(.3-i*.03),EM('#bff4ff',.8,{roughness:.05,flatShading:true}));cr.position.set(x,2.1+(i===2?.25:0),0);cr.scale.y=1.7;g.add(cr)}
 g.add(at(glowSprite('#bff4ff',4,.45),.2,2.3,0));
 for(const z of[-1,1]){const f=new THREE.Mesh(wingGeo(1.6,1.1,'fin'),met);f.position.set(-2.4,1.3,z*.4);if(z<0)f.scale.z=-1;g.add(f)}const vf=new THREE.Mesh(wingGeo(1.3,1,'fin'),met);vf.rotation.x=-Math.PI/2;vf.position.set(-2.4,1.6,0);g.add(vf);
 g.userData.anim=t=>{g.children.forEach(o=>{if(o.geometry&&o.geometry.type==='OctahedronGeometry')o.rotation.y=t*.6});g.position.y=Math.sin(t*.5)*.2};return g}


/* 不可预见之地: the other void, where everything is born of thought — soft mist with shards of half-made things turning in it */


/* 雪原: white grains like a desert — drifts and dunes round the torch-bearers' plain */


/* 绿毯: the green carpet on the sea floor was one flat stamp; now a bed of overlapping fronds, darker in the seams, lit by
   the sun through the water and thinning toward the edge */
function rqEarly(sp){rqEarlyBase(sp);const g=sp._lvcap;if(!g||!g.children[0])return;const cap=g.children[0];const U={uT:GT,uSun:{value:V3(1,0,0)}};
 cap.material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:U,
  vertexShader:'varying vec3 vP;void main(){vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:GLSL_NOISE+`uniform float uT;uniform vec3 uSun;varying vec3 vP;void main(){vec3 n=normalize(vP);float d=acos(clamp(n.y,-1.,1.))/0.157;
   float big=fb3(vP*.012+vec3(uT*.004,0.,uT*.003));float mid=fb3(vP*.045-vec3(uT*.01));float fine=vn3(vP*.19+vec3(uT*.02));
   float cov=smoothstep(.36,.6,big+(mid-.5)*.25)*(1.-smoothstep(.5,1.,d+(mid-.5)*.3));
   float seam=smoothstep(.3,.55,mid)*smoothstep(.75,.5,mid);vec3 c=mix(vec3(.1,.38,.18),vec3(.36,.72,.3),mid);c=mix(c,c*.55,seam*.7);c*=.85+.3*fine;
   float l=.55+.45*max(dot(normalize(vec3(n.x,n.y+.4,n.z)),uSun),0.);c*=l;c+=vec3(.08,.16,.06)*pow(max(dot(n,uSun),0.),3.);
   gl_FragColor=vec4(c,cov*(.5+.25*fine));}`});
 const qi=g.quaternion.clone().invert();anim(sp,null,()=>{if(sp.sunDir)U.uSun.value.copy(sp.sunDir).applyQuaternion(qi)})}

/* cells (琳, 晶菌 …): the membrane shows its curve, with a thin cytoplasm inside and a few organelles round the nucleus */
function bCells(o){const g=bCellsBase(o);o=Object.assign({n:24,col:'#8affc8',size:1},o||{});const cyto=new THREE.MeshStandardMaterial({color:o.col,transparent:true,opacity:.14,roughness:.4,depthWrite:false,side:THREE.BackSide});
 const nuc=C(o.core||'#3a6a4a');const org=M('#'+nuc.clone().offsetHSL(.04,.1,.12).getHexString(),{roughness:.6});let k=0;
 g.children.slice().forEach(c=>{if(!c.isMesh||c.material.opacity!==.42)return;c.material.roughness=.22;const inner=new THREE.Mesh(sgeo(14),cyto);inner.scale.setScalar(.92);c.add(inner);
  for(let i=0;i<3;i++){const s=new THREE.Mesh(sgeo(8),org);s.position.set(h3(k,i,1)-.5,h3(k,i,2)-.5,h3(k,i,3)-.5).normalize().multiplyScalar(.6);s.scale.setScalar(.11);c.add(s)}k++});return g}

/* buildings: the masonry/plank pattern faded out only when its joints were already much thinner than a pixel, so at
   20–60 units walls read as static; it now fades while the joints are still a few pixels wide */
function towerMat(o){const m=q4a_towerMat(o);const ob=m.onBeforeCompile;m.onBeforeCompile=sh=>{ob(sh);sh.fragmentShader=sh.fragmentShader.replace('float kA=1.-smoothstep(.025,.11,fwp);','float kA=1.-smoothstep(.009,.042,fwp);')};
 const ck=m.customProgramCacheKey;m.customProgramCacheKey=()=>'q4b'+(ck?ck.call(m):'');return m}
