/* lines/points whose geometry is still empty must not break ray picking */
for(const K of['Line','Points']){const f=THREE[K].prototype.raycast;THREE[K].prototype.raycast=function(a,b){const g=this.geometry;if(!g||!g.attributes||!g.attributes.position)return;return f.call(this,a,b)}}
/* big meshes (ground, walls, tubes) get a small bounding-box tree the first time a ray tests them, so a ray costs a few hundred box tests instead of one test per triangle; only the nearest hit is reported, which is all the callers here look at */
{const MR=THREE.Mesh.prototype.raycast,_inv=new THREE.Matrix4(),_r=new THREE.Ray(),_s=new THREE.Sphere(),_a=new THREE.Vector3(),_b=new THREE.Vector3(),_c=new THREE.Vector3(),_p=new THREE.Vector3(),_q=new THREE.Vector3(),_w=new THREE.Vector3();
 const LEAF=48;
 function bvhOf(g){const pos=g.attributes.position,ix=g.index;const ver=pos.version+(ix?ix.version*1e6:0);if(g.__bvh&&g.__bvh.ver===ver)return g.__bvh;
  const n=((ix?ix.count:pos.count)/3)|0;let I;if(ix&&!ix.isInterleavedBufferAttribute&&ix.array.length>=n*3)I=ix.array;else{I=new Uint32Array(n*3);for(let t=0;t<n*3;t++)I[t]=ix?ix.getX(t):t}
  let V;if(!pos.isInterleavedBufferAttribute&&pos.itemSize===3&&!pos.normalized&&pos.array instanceof Float32Array)V=pos.array;else{V=new Float32Array(pos.count*3);for(let i=0;i<pos.count;i++){V[i*3]=pos.getX(i);V[i*3+1]=pos.getY(i);V[i*3+2]=pos.getZ(i)}}
  const TB=new Float32Array(n*6),CE=new Float32Array(n*3);
  for(let t=0;t<n;t++){let x0=1e30,y0=1e30,z0=1e30,x1=-1e30,y1=-1e30,z1=-1e30;for(let k=0;k<3;k++){const v=I[t*3+k]*3,x=V[v],y=V[v+1],z=V[v+2];if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;if(z<z0)z0=z;if(z>z1)z1=z}
   const q=t*6;TB[q]=x0;TB[q+1]=y0;TB[q+2]=z0;TB[q+3]=x1;TB[q+4]=y1;TB[q+5]=z1;CE[t*3]=(x0+x1)/2;CE[t*3+1]=(y0+y1)/2;CE[t*3+2]=(z0+z1)/2}
  const O=new Uint32Array(n);for(let t=0;t<n;t++)O[t]=t;
  const NB=[],NL=[],NR=[],NS=[],NC=[];
  const mk=(s,e)=>{const id=NL.length;NL.push(-1);NR.push(-1);NS.push(s);NC.push(e-s);let x0=1e30,y0=1e30,z0=1e30,x1=-1e30,y1=-1e30,z1=-1e30,cx0=1e30,cy0=1e30,cz0=1e30,cx1=-1e30,cy1=-1e30,cz1=-1e30;
   for(let i=s;i<e;i++){const t=O[i],b=t*6;if(TB[b]<x0)x0=TB[b];if(TB[b+1]<y0)y0=TB[b+1];if(TB[b+2]<z0)z0=TB[b+2];if(TB[b+3]>x1)x1=TB[b+3];if(TB[b+4]>y1)y1=TB[b+4];if(TB[b+5]>z1)z1=TB[b+5];
    const c=t*3;if(CE[c]<cx0)cx0=CE[c];if(CE[c]>cx1)cx1=CE[c];if(CE[c+1]<cy0)cy0=CE[c+1];if(CE[c+1]>cy1)cy1=CE[c+1];if(CE[c+2]<cz0)cz0=CE[c+2];if(CE[c+2]>cz1)cz1=CE[c+2]}
   NB.push(x0,y0,z0,x1,y1,z1);if(e-s<=LEAF)return id;
   const dx=cx1-cx0,dy=cy1-cy0,dz=cz1-cz0;const ax=dx>=dy&&dx>=dz?0:dy>=dz?1:2;const mid=ax===0?(cx0+cx1)/2:ax===1?(cy0+cy1)/2:(cz0+cz1)/2;
   let i=s,j=e-1;while(i<=j){if(CE[O[i]*3+ax]<mid)i++;else{const t=O[i];O[i]=O[j];O[j]=t;j--}}
   let m=i;if(m===s||m===e)m=(s+e)>>1;
   const l=mk(s,m),r=mk(m,e);NL[id]=l;NR[id]=r;return id};
  mk(0,n);
  return g.__bvh={ver,I,V,O,B:new Float32Array(NB),L:Int32Array.from(NL),R:Int32Array.from(NR),S:Int32Array.from(NS),C:Int32Array.from(NC)}}
 // after a world is shown, build the trees for its big meshes in idle moments, one mesh per moment, so the first tap or card never pays for it
 window.__bvhIdle=function(sc){const L=[];const seen=new Set();sc.traverse(o=>{if(!o.isMesh||Array.isArray(o.material)||o.isSkinnedMesh||Object.prototype.hasOwnProperty.call(o,"raycast"))return;const g=o.geometry;if(!g||!g.isBufferGeometry||!g.attributes.position||seen.has(g))return;const nt=(g.index?g.index.count:g.attributes.position.count)/3;if(nt>=3000){seen.add(g);L.push(g)}});
  const ric=window.requestIdleCallback||(f=>setTimeout(()=>f({timeRemaining:()=>50}),200));const step=()=>{if(!L.length)return;const g=L.shift();try{bvhOf(g)}catch(e){}ric(step,{timeout:3000})};ric(step,{timeout:3000})};
 const ST=new Int32Array(256);
 THREE.Mesh.prototype.raycast=function(rc,out){const g=this.geometry,m=this.material;
  if(!g||!g.isBufferGeometry||!m||Array.isArray(m)||this.isSkinnedMesh||!g.attributes.position||(g.morphAttributes&&g.morphAttributes.position)||g.drawRange.start!==0||g.drawRange.count!==Infinity||window.__noBVH)return MR.call(this,rc,out);
  const nt=(g.index?g.index.count:g.attributes.position.count)/3;if(nt<3000)return MR.call(this,rc,out);
  const mw=this.matrixWorld;if(g.boundingSphere===null)g.computeBoundingSphere();_s.copy(g.boundingSphere).applyMatrix4(mw);if(!rc.ray.intersectsSphere(_s))return;
  _inv.copy(mw).invert();_r.copy(rc.ray).applyMatrix4(_inv);
  const T=bvhOf(g);const o=_r.origin,d=_r.direction;
  // world distance per unit along the local ray
  _w.copy(o).add(d).applyMatrix4(mw);_q.copy(o).applyMatrix4(mw);const k=_w.distanceTo(_q)||1;
  const ix=1/d.x,iy=1/d.y,iz=1/d.z;let best=rc.far/k+1e-6,bt=-1;const back=m.side===THREE.BackSide,cull=m.side!==THREE.DoubleSide;
  let sp=0;ST[sp++]=0;const B=T.B,V=T.V,I=T.I,O=T.O;
  while(sp>0){const nd=ST[--sp],b=nd*6;
   let t1=(B[b]-o.x)*ix,t2=(B[b+3]-o.x)*ix,tmin=Math.min(t1,t2),tmax=Math.max(t1,t2);
   t1=(B[b+1]-o.y)*iy;t2=(B[b+4]-o.y)*iy;tmin=Math.max(tmin,Math.min(t1,t2));tmax=Math.min(tmax,Math.max(t1,t2));
   t1=(B[b+2]-o.z)*iz;t2=(B[b+5]-o.z)*iz;tmin=Math.max(tmin,Math.min(t1,t2));tmax=Math.min(tmax,Math.max(t1,t2));
   if(!(tmax>=Math.max(tmin,0))||tmin>best)continue;
   if(T.L[nd]<0){const s=T.S[nd],e=s+T.C[nd];for(let i=s;i<e;i++){const t=O[i],a=I[t*3]*3,bb=I[t*3+1]*3,c=I[t*3+2]*3;_a.set(V[a],V[a+1],V[a+2]);_b.set(V[bb],V[bb+1],V[bb+2]);_c.set(V[c],V[c+1],V[c+2]);
     const h=back?_r.intersectTriangle(_c,_b,_a,true,_p):_r.intersectTriangle(_a,_b,_c,cull,_p);if(h){const dd=_p.distanceTo(o);if(dd<best){best=dd;bt=t;_q.copy(_p)}}}}
   else{if(sp>252)return MR.call(this,rc,out);ST[sp++]=T.L[nd];ST[sp++]=T.R[nd]}}
  if(bt<0)return;const pw=_q.clone().applyMatrix4(mw);const dist=rc.ray.origin.distanceTo(pw);if(dist<rc.near||dist>rc.far)return;
  const fa=I[bt*3],fb=I[bt*3+1],fc=I[bt*3+2];_a.set(V[fa*3],V[fa*3+1],V[fa*3+2]);_b.set(V[fb*3],V[fb*3+1],V[fb*3+2]);_c.set(V[fc*3],V[fc*3+1],V[fc*3+2]);const nrm=new THREE.Vector3();THREE.Triangle.getNormal(_a,_b,_c,nrm);
  out.push({distance:dist,point:pw,object:this,face:{a:fa,b:fb,c:fc,normal:nrm,materialIndex:0},faceIndex:bt})}}
// most of the scene stands still: only recompose a local matrix when position/rotation/scale actually changed (was ~half of each frame's script time)
// hidden branches are skipped too, except that each frame one thirtieth of the top-level branches gets a full pass (and everything while a world is loading), so nothing hidden stays stale for long
let MW_ALL=true,MW_TICK=0,SG_ADDS=0;
// count additions to any scene graph, so the sprite batcher only rescans a world when something new has appeared
{const f=THREE.Object3D.prototype.add;THREE.Object3D.prototype.add=function(){SG_ADDS++;return f.apply(this,arguments)}}
{const P=THREE.Object3D.prototype;P.updateMatrixWorld=function(force){if(!this.visible&&!MW_ALL&&this.parent!==null){if(force)this.matrixWorldNeedsUpdate=true;return}if(this.matrixAutoUpdate){const p=this.position,q=this.quaternion,s=this.scale;let c=this._mc;
 if(!c||c[0]!==p.x||c[1]!==p.y||c[2]!==p.z||c[3]!==q.x||c[4]!==q.y||c[5]!==q.z||c[6]!==q.w||c[7]!==s.x||c[8]!==s.y||c[9]!==s.z){this.updateMatrix();if(!c)c=this._mc=new Float64Array(10);c[0]=p.x;c[1]=p.y;c[2]=p.z;c[3]=q.x;c[4]=q.y;c[5]=q.z;c[6]=q.w;c[7]=s.x;c[8]=s.y;c[9]=s.z}}
 if(this.matrixWorldNeedsUpdate||force){if(this.parent===null)this.matrixWorld.copy(this.matrix);else this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix);this.matrixWorldNeedsUpdate=false;force=true}
 const ch=this.children;if(this.parent===null&&!MW_ALL){const t=MW_TICK%30;for(let i=0,l=ch.length;i<l;i++){MW_ALL=i%30===t;ch[i].updateMatrixWorld(force)}MW_ALL=false}else for(let i=0,l=ch.length;i<l;i++)ch[i].updateMatrixWorld(force)}}
/* ================================================================
   core: data prep, math, renderer + post, spaces, rig, input
   ================================================================ */
const $=s=>document.querySelector(s);
const R=1000, D2R=Math.PI/180;
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const seen=new Set(store.get('rq_seen',[])), found=new Set(store.get('rq_eggs',[]));

/* ---- data: one void, seven worlds inside it ---- */
ERAS.forEach(e=>{if(!e.map)e.map='rongqiu'});
const NG_C=[4300,0,-200], NG_S=.85;               // 凝固虚空 becomes a frozen region of the void
WIKI.forEach(w=>{if(w.m==='ningu'){w.m='void';w.ng=1;const p=w.p||[0,0,0];w.p=[NG_C[0]+p[0]*NG_S,NG_C[1]+p[1]*NG_S,NG_C[2]+p[2]*NG_S];delete w.sec;delete w.r}});
{const g=WIKI.find(w=>w.id==='v_ningu_gate');if(g){delete g.go;g.k='none'}}
const W=Object.fromEntries(WIKI.map(w=>[w.id,w]));
const EB=Object.fromEntries(ERAS.map(e=>[e.id,e]));
const MAPL=MAPS.filter(m=>m.id!=='ningu');
const MB=Object.fromEntries(MAPL.map(m=>[m.id,m]));
MB.void.e=[6,7,8,9,10,11,12];
const mapOf=w=>w.m||'rongqiu';
const PORTAL={};WIKI.forEach(w=>{if(w.go&&MB[w.go]&&mapOf(w)==='void')PORTAL[w.go]=w.id});
FAUNA.forEach(f=>{if(f.w==='xm_train')f.track=1});
const RN=Object.fromEntries(REGIONS.map(r=>[r.id,r.n]));
const CATK=c=>c==='地理'?'':(c==='物种'||c==='角色'||c==='琳的造物')?'k-cr':'k-ev';

/* ---- math ---- */
const V3=(x,y,z)=>new THREE.Vector3(x,y,z);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const lerp=(a,b,t)=>a+(b-a)*t;
const sm=(a,b,x)=>{const t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t)};
const wrap180=d=>((d+540)%360)-180;
function dirLL(lat,lon,out){const a=lat*D2R,b=lon*D2R;return (out||new THREE.Vector3()).set(Math.cos(a)*Math.sin(b),Math.sin(a),Math.cos(a)*Math.cos(b))}
function llDir(v){const l=v.length()||1;return [Math.asin(Math.max(-1,Math.min(1,v.y/l)))/D2R,Math.atan2(v.x,v.z)/D2R]}
function angDeg(u,v){return Math.acos(Math.max(-1,Math.min(1,u.dot(v))))/D2R}
function segAng(p,a,b){const n=a.clone().cross(b).normalize();const d=Math.asin(Math.max(-1,Math.min(1,p.dot(n))));
 const q=p.clone().addScaledVector(n,-Math.sin(d)).normalize();const ab=angDeg(a,b);if(Math.abs(angDeg(a,q)+angDeg(q,b)-ab)<1e-3)return Math.abs(d)/D2R;return Math.min(angDeg(p,a),angDeg(p,b))}
function h3(x,y,z){let h=Math.sin(x*127.1+y*311.7+z*74.7)*43758.5453;return h-Math.floor(h)}
function n3(x,y,z){const xi=Math.floor(x),yi=Math.floor(y),zi=Math.floor(z),xf=x-xi,yf=y-yi,zf=z-zi;
 const u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf),w=zf*zf*(3-2*zf);const c=(i,j,k)=>h3(xi+i,yi+j,zi+k);
 const x00=lerp(c(0,0,0),c(1,0,0),u),x10=lerp(c(0,1,0),c(1,1,0),u),x01=lerp(c(0,0,1),c(1,0,1),u),x11=lerp(c(0,1,1),c(1,1,1),u);
 return lerp(lerp(x00,x10,v),lerp(x01,x11,v),w)}
function fbm(x,y,z,o){let s=0,a=.5,f=1,t=0;for(let i=0;i<o;i++){s+=a*n3(x*f,y*f,z*f);t+=a;f*=2.02;a*=.5}return s/t}
function rnd(s){s=(s|0)||1;return()=>{s=(s*16807)%2147483647;return s/2147483647}}
function hashStr(s){let h=7;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))%2147483647;return h||1}
const C=h=>new THREE.Color(h);

const GLSL_NOISE=`
float hs3(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float vn3(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);
 return mix(mix(mix(hs3(i),hs3(i+vec3(1,0,0)),f.x),mix(hs3(i+vec3(0,1,0)),hs3(i+vec3(1,1,0)),f.x),f.y),
            mix(mix(hs3(i+vec3(0,0,1)),hs3(i+vec3(1,0,1)),f.x),mix(hs3(i+vec3(0,1,1)),hs3(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fb3(vec3 p){float s=0.,a=.5;for(int i=0;i<4;i++){s+=a*vn3(p);p=p*2.03+vec3(1.7,9.2,3.1);a*=.5;}return s/.9375;}
`;

/* ---- shared uniforms / textures ---- */
const GT={value:0};                       // global time for shaders
const PSCALE={value:300};                 // point-size scale (viewport height)
/* white (or black) masks drawn with canvas gradients: some browsers dither the colour channels of faint pixels,
   which shows up as rainbow speckle once many soft sprites stack. Pin the colour to pure white/black and keep only the alpha. */
/* the same for ordinary sprites */
{const L=THREE.ShaderLib.sprite;L.vertexShader=L.vertexShader.replace('#include <fog_pars_vertex>','#include <fog_pars_vertex>\nvarying float vNearFade;').replace('gl_Position = projectionMatrix * mvPosition;','{float sz=max(scale.x,scale.y);vNearFade=smoothstep(sz*.12,sz*.5,-(modelViewMatrix*vec4(0.,0.,0.,1.)).z);}\n\tgl_Position = projectionMatrix * mvPosition;');
 L.fragmentShader=L.fragmentShader.replace('#include <fog_pars_fragment>','#include <fog_pars_fragment>\nvarying float vNearFade;').replace('gl_FragColor = vec4( outgoingLight, diffuseColor.a );','gl_FragColor = vec4( outgoingLight, diffuseColor.a*vNearFade );')}
/* a stone: a lumpy, slightly flattened ball with facets, instead of a perfect dodecahedron */
const _rockC={};function lumpRock(r,seed){r=r||1;seed=seed||1;const key=r+'|'+seed;if(_rockC[key])return _rockC[key];const g=new THREE.IcosahedronGeometry(1,1);const a=g.attributes.position;
 for(let i=0;i<a.count;i++){const x=a.getX(i),y=a.getY(i),z=a.getZ(i);const k=1+(n3(x*1.6+seed*3.1,y*1.6,z*1.6)-.5)*.6+(n3(x*4.2,y*4.2+seed,z*4.2)-.5)*.22;a.setXYZ(i,x*k*r,y*k*r*(y<0?.72:.92),z*k*r)}
 g.computeVertexNormals();return _rockC[key]=g}
function canvasTex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');draw(x,w,h);
 try{const im=x.getImageData(0,0,w,h),d=im.data;let wh=true,bk=true,any=false;for(let i=0;i<d.length;i+=4){if(d[i+3]<48)continue;any=true;if(d[i]<235||d[i+1]<235||d[i+2]<235)wh=false;if(d[i]>20||d[i+1]>20||d[i+2]>20)bk=false;if(!wh&&!bk)break}
  if(any&&(wh||bk)){const v=wh?255:0;for(let i=0;i<d.length;i+=4){d[i]=d[i+1]=d[i+2]=v}x.putImageData(im,0,0)}}catch(e){}
 const t=new THREE.CanvasTexture(c);return t}
const dotTex=canvasTex(64,64,(x)=>{const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.35,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64)});
const glowTex=canvasTex(128,128,(x)=>{const g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(.18,'rgba(255,255,255,.45)');g.addColorStop(.5,'rgba(255,255,255,.12)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,128,128)});
const ringTex=canvasTex(128,128,(x)=>{x.strokeStyle='rgba(255,255,255,.95)';x.lineWidth=3;x.beginPath();x.arc(64,64,52,0,6.283);x.stroke();x.globalAlpha=.35;x.lineWidth=10;x.beginPath();x.arc(64,64,52,0,6.283);x.stroke()});
const smokeTex=canvasTex(128,128,(x)=>{x.scale(2,2);for(let i=0;i<22;i++){const px=20+Math.random()*24,py=20+Math.random()*24,r=9+Math.random()*13;const g=x.createRadialGradient(px,py,0,px,py,r);g.addColorStop(0,'rgba(255,255,255,.16)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64)}});
const bumpDummy=new THREE.DataTexture(new Uint8Array([128,128,128,255]),1,1);bumpDummy.needsUpdate=true;

/* ---- renderer & post ---- */
const canvas=$('#c');
const renderer=new THREE.WebGLRenderer({canvas,antialias:false,powerPreference:'high-performance'});
let PR=Math.min(window.devicePixelRatio||1,1.5);renderer.setPixelRatio(PR);
renderer.toneMapping=THREE.NoToneMapping;renderer.outputEncoding=THREE.LinearEncoding;
/* near shadows: only the planet sun casts, its shadow box follows the spot you look at and is redrawn every other frame (see shadowFollow) */
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;
const SHD={on:true,f:0,max:320,ms:matchMedia('(pointer:coarse)').matches?1024:2048};
const camera=new THREE.PerspectiveCamera(45,1,.4,120000);
const POST={on:!!(THREE.EffectComposer&&THREE.UnrealBloomPass&&THREE.ShaderPass)};
const FinalShader={uniforms:{tDiffuse:{value:null},uVig:{value:.5},uTime:{value:0},uFade:{value:0},uFadeCol:{value:new THREE.Color(0,0,0)}},
 vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:`uniform sampler2D tDiffuse;uniform float uVig,uTime,uFade;uniform vec3 uFadeCol;varying vec2 vUv;
 void main(){vec3 c=max(texture2D(tDiffuse,vUv).rgb,0.);vec3 hi=.82+.18*(1.-exp(-(c-.82)/.18));c=mix(c,hi,step(.82,c));float l=dot(c,vec3(.299,.587,.114));c=mix(vec3(l),c,1.06);
  float d=distance(vUv,vec2(.5));c*=1.-uVig*smoothstep(.42,1.,d);
  c+=(fract(sin(dot(vUv*vec2(1311.7,977.3)+fract(uTime),vec2(12.9898,78.233)))*43758.5453)-.5)*.016;
  c=mix(c,uFadeCol,uFade);gl_FragColor=vec4(c,1.);}`};
let composer=null,renderPass=null,bloomPass=null,finalPass=null,fxaaPass=null;
function initPost(){if(!POST.on)return;try{const w=innerWidth,h=innerHeight;const half=renderer.capabilities.isWebGL2;
 const rt=new THREE.WebGLRenderTarget(w*PR,h*PR,{minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,format:THREE.RGBAFormat,type:half?THREE.HalfFloatType:THREE.UnsignedByteType});
 composer=new THREE.EffectComposer(renderer,rt);renderPass=new THREE.RenderPass(new THREE.Scene(),camera);composer.addPass(renderPass);
 bloomPass=new THREE.UnrealBloomPass(new THREE.Vector2(w,h),.62,.5,.93);composer.addPass(bloomPass);
 // the glow is a soft blur anyway: work it out at one sample per screen point, not per device pixel
 {const bs=bloomPass.setSize.bind(bloomPass);bloomPass.setSize=(W,H)=>{const k=Math.min(1,1/PR);bs(Math.max(2,Math.round(W*k)),Math.max(2,Math.round(H*k)))}}
 finalPass=new THREE.ShaderPass(FinalShader);composer.addPass(finalPass);
 if(THREE.FXAAShader){fxaaPass=new THREE.ShaderPass(THREE.FXAAShader);composer.addPass(fxaaPass)}
}catch(e){console.warn('post off',e);POST.on=false;composer=null}}
function setFade(v){if(composer&&POST.on)finalPass.uniforms.uFade.value=v;$('#veil').style.opacity=composer&&POST.on?0:v}
function resize(){const w=innerWidth,h=innerHeight;renderer.setPixelRatio(PR);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();PSCALE.value=h*PR*.5;
 if(composer){composer.setPixelRatio&&composer.setPixelRatio(PR);composer.setSize(w,h);if(fxaaPass)fxaaPass.material.uniforms.resolution.value.set(1/(w*PR),1/(h*PR))}}

/* ---- spaces ---- */
const SP={};let CUR=null;
function newSpace(id,type,scene){const s={id,type,scene,prox:[],anims:[],eraObjs:[],herds:[],places:[],labels:[],update:null};SP[id]=s;return s}
function addTo(sp,o,eras,noCarry){sp.scene.add(o);if(eras)sp.eraObjs.push({o,e:eras,noCarry:!!noCarry});return o}
function prox(sp,id,pos,r,extra){const w=W[id];if(!w)return null;const p=Object.assign({w,r,e:w.e},extra||{});if(typeof pos==='function')p.c=pos;else p.pos=pos;sp.prox.push(p);return p}
function anim(sp,o,f){sp.anims.push({o,f});}

/* ---- era state ---- */
let ERA=store.get('rq_era',2);if(!EB[ERA])ERA=2;
function eraOk(e){if(!CUR||CUR.type!=='planet')return true;return !e||e.includes(ERA)}

/* ---- the camera rig: one rig over three kinds of surface ---- */
const rig={a:18,b:-25,alt:2600,head:0,y:0};
let tw=null;const vel={a:0,b:0};
const S_=V3(0,0,0),UP=V3(0,1,0),NO=V3(0,0,1),EA=V3(),BK=V3(),TG=V3(),OFF=V3();
function tubeUp(ang){const t=ang*D2R;return V3(Math.sin(t),Math.cos(t),0)}
function tubePt(Rt,z,ang,h){const u=tubeUp(ang);return V3(-u.x*Rt,-u.y*Rt,z).addScaledVector(u,h)}
function altMin(){return CUR.type==='planet'?14:CUR.type==='tube'?14:30}
function altMax(){return CUR.type==='planet'?4900:CUR.type==='tube'?CUR.Rt*1.45:CUR.type==='path'?5200:9500}
function tiltOf(t,alt){if(CUR&&CUR.id==='under')return lerp(60,80,sm(700,40,alt))*D2R;if(t==='planet')return sm(950,50,alt)*66*D2R;if(t==='tube')return lerp(56,73,sm(520,30,alt))*D2R;return lerp(36,66,sm(6000,110,alt))*D2R}
function surf(sp,a,b){const t=sp.type;
 if(t==='planet'){dirLL(a,b,UP);NO.set(0,1,0).addScaledVector(UP,-UP.y);if(NO.lengthSq()<1e-6)NO.set(1,0,0);NO.normalize();S_.copy(UP).multiplyScalar(R+Math.max(0,sp.gh(a,b))*sm(1300,700,rig.alt))}
 else if(t==='tube'){UP.copy(tubeUp(b));NO.set(0,0,1);S_.copy(tubePt(sp.Rt,a,b,rig.y+(sp.wallR?Math.max(0,sp.wallR(a,b)):0)))}
 else{UP.set(0,1,0);NO.set(0,0,-1);S_.set(b,rig.y,-a)}}
let _gS=null,_gT=0,_gSp=null;
function rigPose(){const sp=CUR;const tilt=tiltOf(sp.type,rig.alt);surf(sp,rig.a,rig.b);
 if(sp.type==='planet'){const now=performance.now(),L=S_.length();if(_gS===null||_gSp!==sp||Math.abs(L-_gS)>160)_gS=L;else{const dt=Math.min(.1,(now-_gT)/1000);_gS+=(L-_gS)*(1-Math.exp(-dt*7))}_gT=now;_gSp=sp;S_.setLength(_gS)}
 TG.copy(S_);
 EA.copy(NO).cross(UP).negate();BK.copy(NO).multiplyScalar(-Math.cos(rig.head)).addScaledVector(EA,-Math.sin(rig.head));
 OFF.copy(UP).multiplyScalar(Math.cos(tilt)).addScaledVector(BK,Math.sin(tilt)).multiplyScalar(rig.alt*(1+tilt*.2));
 camera.position.copy(TG).add(OFF);camera.up.copy(UP).multiplyScalar(Math.sin(tilt)).addScaledVector(BK,-Math.cos(tilt)).normalize();camera.lookAt(TG);
 if(sp.type==='planet'){const ll=llDir(camera.position);const minR=R+Math.max(sp.gh(ll[0],ll[1]),0)+5;if(camera.position.length()<minR){camera.position.setLength(minR);camera.lookAt(TG)}}
 if(sp.type==='tube'){const r=Math.hypot(camera.position.x,camera.position.y),mx=sp.Rt*.86;let fix=false;if(r>mx){camera.position.x*=mx/r;camera.position.y*=mx/r;fix=true}
  const cz=clamp(camera.position.z,sp.zc[0],sp.zc[1]);if(cz!==camera.position.z){camera.position.z=cz;fix=true}if(fix)camera.lookAt(TG)}if(sp.type!=='planet'&&sp.type!=='tube'&&window.__solidPush)window.__solidPush(sp);if(sp.camOv&&sp.moon)moonCam(sp);else if(window.__view){camera.position.copy(window.__view.p);if(CUR.type==='planet')camera.up.copy(window.__view.p).normalize();else camera.up.set(0,1,0);camera.lookAt(window.__view.l)}camera.updateMatrixWorld()}
function moveBy(dN,dE){const t=CUR.type;
 if(t==='planet'){rig.a=clamp(rig.a+dN/(R*D2R),-86,86);rig.b+=dE/(R*D2R*Math.max(.2,Math.cos(rig.a*D2R)))}
 else if(t==='tube'){rig.a=clamp(rig.a+dN,CUR.zr[0],CUR.zr[1]);rig.b+=dE/(CUR.Rt*D2R)}
 else{const L=CUR.bound||7000;rig.a=clamp(rig.a+dN,-L,L);rig.b=clamp(rig.b+dE,-L,L)}}
/* a short excursion to look at the moon up close: the camera leaves the rig, tracks the moving moon, and hands back on the next touch */
function moonCam(sp){const o=sp.camOv,M=sp.moon,r=((M.geometry.parameters&&M.geometry.parameters.radius)||1)*M.scale.x;const nw=performance.now();const k=Math.min(1,(nw-o.t0)/2600),e=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;
 const mp=M.position,tp=o.w?posOf(o.w):mp.clone();const toP=mp.clone().negate().normalize();const side=toP.clone().cross(UP_Y).normalize();
 const nrm=tp.clone().sub(mp).normalize();const P=o.w?tp.clone().addScaledVector(nrm,r*1.1).addScaledVector(toP,r*.4):mp.clone().addScaledVector(toP,r*2.7).addScaledVector(side,r*1.3).addScaledVector(UP_Y,r*.45);
 camera.position.lerpVectors(o.p0,P,e);const L=o.l0.clone().lerp(tp,e);camera.up.set(0,1,0);camera.lookAt(L)}
function moonView(w){const sp=CUR;if(!sp.moon)return false;rigPose();sp.camOv={t0:performance.now(),p0:camera.position.clone(),l0:TG.clone(),w:w&&w.moon?w:null};return true}
function moonRelease(){const sp=CUR;if(!sp||!sp.camOv)return;sp.camOv=null;const ll=llDir(camera.position);tw=null;vel.a=vel.b=0;Object.assign(rig,{a:clamp(ll[0],-86,86),b:ll[1],alt:clamp(camera.position.length()-R,altMin(),altMax()),head:0})}
['pointerdown','wheel','keydown'].forEach(t=>addEventListener(t,()=>{if(CUR&&CUR.camOv)moonRelease()},{passive:true,capture:true}));
function flyTo(a,b,alt,dur=2,y,head){if(CUR&&CUR.camOv)CUR.camOv=null;const t=CUR.type;tw={t:0,dur,from:{...rig},to:{a,b,alt:alt||rig.alt,head:head===undefined?rig.head:head,y:y===undefined?rig.y:y}};
 if(t==='planet'||t==='tube')tw.to.b=tw.from.b+wrap180(tw.to.b-tw.from.b);tw.to.head=tw.from.head+((tw.to.head-tw.from.head+Math.PI*3)%(Math.PI*2)-Math.PI)}
function hopOf(){const t=CUR.type,f=tw.from,o=tw.to;if(t==='planet')return Math.min(1600,Math.hypot(o.a-f.a,wrap180(o.b-f.b))*24);if(t==='tube')return Math.min(200,Math.abs(o.a-f.a)*.05);return Math.min(2800,Math.hypot(o.a-f.a,o.b-f.b)*.38)}

/* ---- rays ---- */
const ray=new THREE.Raycaster(),ndc=new THREE.Vector2(),_p=V3();
function setRay(cx,cy){ndc.set(cx/innerWidth*2-1,-(cy/innerHeight)*2+1);ray.setFromCamera(ndc,camera)}
// the point on the surface under the cursor, in rig coordinates
function surfHit(cx,cy){setRay(cx,cy);const t=CUR.type,o=ray.ray.origin,d=ray.ray.direction;
 if(t==='planet'){const sr=Math.max(R+4,TG.lengthSq()>1?TG.length():0);if(!ray.ray.intersectSphere(new THREE.Sphere(V3(0,0,0),sr),_p)&&!ray.ray.intersectSphere(new THREE.Sphere(V3(0,0,0),R+4),_p))return null;const ll=llDir(_p);return{a:ll[0],b:ll[1],p:_p.clone()}}
 if(t==='tube'){const A=d.x*d.x+d.y*d.y;if(A<1e-6)return null;const B=2*(o.x*d.x+o.y*d.y),Cq=o.x*o.x+o.y*o.y-CUR.Rt*CUR.Rt;const s=(-B+Math.sqrt(Math.max(0,B*B-4*A*Cq)))/(2*A);_p.copy(o).addScaledVector(d,s);return{a:_p.z,b:Math.atan2(-_p.x,-_p.y)/D2R,p:_p.clone()}}
 if(!ray.ray.intersectPlane(new THREE.Plane(V3(0,1,0),-rig.y),_p))return null;return{a:-_p.z,b:_p.x,p:_p.clone()}}
function proxCenter(p){return p.c?p.c():p.pos}
/* every marker can be hit at least this many screen pixels from its centre (more for a finger), whatever the screen size */
function pickProx(cx,cy,onlyPortals){setRay(cx,cy);const o=ray.ray.origin,d=ray.ray.direction;let best=null,bs=1e18;const pxA=(pickProx.touch?30:18)*camera.fov*D2R/innerHeight,H=[];let bt=0;
 let tPl=Infinity;if(CUR.type==='planet'){if(ray.ray.intersectSphere(new THREE.Sphere(V3(0,0,0),R-2),_p))tPl=_p.distanceTo(o)}
 for(const p of CUR.prox){if(onlyPortals&&!p.w.go)continue;if(p.hide&&p.hide())continue;if(!eraOk(p.e))continue;const c=proxCenter(p);if(!c)continue;
  const ox=c.x-o.x,oy=c.y-o.y,oz=c.z-o.z;const t=ox*d.x+oy*d.y+oz*d.z;if(t<=0)continue;const d2=Math.max(0,ox*ox+oy*oy+oz*oz-t*t);
  if(p.maxD&&t>p.maxD)continue;const rr=Math.max(p.r,t*pxA);if(d2>rr*rr)continue;if(t-p.r>tPl)continue;
  // how centrally the ray hits this one, relative to its own size; a story scroll gives way to the entry it hangs beside
  const sc=Math.sqrt(d2)/rr+t*.00002+(p.side?.25:0);H.push(p,sc,t);if(sc<bs){bs=sc;best=p;bt=t}}
 // something small hit squarely in front beats a big far thing (the moon behind a creature, a region behind a house)
 for(let i=0;i<H.length;i+=3)if(H[i]!==best&&H[i+1]<.7&&H[i+2]<bt*.6&&!H[i].side){bt=H[i+2];best=H[i];bs=H[i+1]}
 // on a tap, the model actually under the pointer wins over a marker that was only grazed
 if(!onlyPortals&&pickProx.mesh&&(!best||bs>.45)){const m=meshPick();if(m)best=m}
 return best}
/* a tap that misses every marker: whatever solid thing is under the finger, if it belongs to an entry, that entry is chosen */
const _mp=new THREE.Raycaster();
function meshPick(){_mp.ray.copy(ray.ray);_mp.far=6000;_mp.camera=camera;_mp.params.Points.threshold=0;_mp.params.Line.threshold=0;
 let hits;try{hits=_mp.intersectObjects(CUR.scene.children,true)}catch(e){return null}
 for(const h of hits){let o=h.object;if(!o.isMesh)continue;const m=Array.isArray(o.material)?o.material[0]:o.material;if(!m||m.visible===false||m.blending===THREE.AdditiveBlending)continue;
  let v=o,id=null,vis=true;while(v){if(v.visible===false)vis=false;if(!id&&v.userData&&v.userData.pick)id=v.userData.pick;v=v.parent}if(!vis)continue;
  if(!id){if(m.transparent||m.depthWrite===false)continue;return null}
  const p=CUR.prox.find(p=>p.w.id===id&&!p.side&&!(p.hide&&p.hide())&&eraOk(p.e));if(p)return p;return null}
 return null}
