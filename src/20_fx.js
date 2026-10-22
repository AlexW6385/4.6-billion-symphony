/* ================================================================
   fx: GPU particles, glows, soft sprites
   ================================================================ */
const PART_VS=`attribute float aSeed;uniform float uT,uLife,uSpeed,uSpread,uSize,uGrav,uWander,uScale,uFadeIn;uniform vec3 uDir;varying float vA;varying float vK;
float h1(float n){return fract(sin(n)*43758.5453);}
void main(){float life=uLife*(.55+.45*h1(aSeed*7.13));float t=mod(uT+aSeed*uLife*3.17,life);float k=t/life;vK=k;
 vec3 r=vec3(h1(aSeed*1.31)-.5,h1(aSeed*2.71)-.5,h1(aSeed*5.13)-.5);
 vec3 p=position+(uDir+r*uSpread)*uSpeed*t;p.y-=uGrav*t*t;
 p+=vec3(sin(uT*.71+aSeed*13.),sin(uT*.93+aSeed*7.),cos(uT*.61+aSeed*5.))*uWander;
 vA=smoothstep(0.,uFadeIn,k)*(1.-smoothstep(.6,1.,k));
 vec4 mv=modelViewMatrix*vec4(p,1.);gl_PointSize=max(1.,uSize*uScale/-mv.z*(.55+.9*h1(aSeed*9.7)));gl_Position=projectionMatrix*mv;}`;
const PART_FS=`uniform vec3 uCol,uCol2;uniform float uOp;uniform sampler2D uTex;varying float vA;varying float vK;
void main(){vec4 t=texture2D(uTex,gl_PointCoord);gl_FragColor=vec4(mix(uCol,uCol2,vK)*t.rgb,t.a*vA*uOp);}`;
/* emitter({n,life,speed,spread,size,grav,wander,dir,col,col2,op,area,add,tex,fadeIn}) — returns Points in local space */
function emitter(o){const n=o.n||200,g=new THREE.BufferGeometry(),pos=new Float32Array(n*3),seed=new Float32Array(n),A=o.area||[0,0,0];
 for(let i=0;i<n;i++){if(o.disc){const a=Math.random()*6.283,r=Math.sqrt(Math.random())*o.disc;pos[i*3]=Math.cos(a)*r;pos[i*3+1]=(Math.random()-.5)*A[1];pos[i*3+2]=Math.sin(a)*r}
  else if(o.line){const t=Math.random();pos[i*3]=o.line[0]*t+(Math.random()-.5)*A[0];pos[i*3+1]=o.line[1]*t+(Math.random()-.5)*A[1];pos[i*3+2]=o.line[2]*t+(Math.random()-.5)*A[2]}
  else{pos[i*3]=(Math.random()-.5)*A[0];pos[i*3+1]=(Math.random()-.5)*A[1];pos[i*3+2]=(Math.random()-.5)*A[2]}seed[i]=Math.random()*100}
 g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('aSeed',new THREE.BufferAttribute(seed,1));
 const big=Math.max(A[0],A[1],A[2],o.disc||0)+(o.speed||1)*(o.life||3)*2+40;g.boundingSphere=new THREE.Sphere(V3(0,0,0),big);
 const m=new THREE.ShaderMaterial({uniforms:{uT:GT,uScale:PSCALE,uLife:{value:o.life||3},uSpeed:{value:o.speed||1},uSpread:{value:o.spread===undefined?.5:o.spread},uSize:{value:o.size||1},uGrav:{value:o.grav||0},
   uWander:{value:o.wander||0},uFadeIn:{value:o.fadeIn===undefined?.15:o.fadeIn},uDir:{value:V3(...(o.dir||[0,1,0]))},uCol:{value:C(o.col||'#ffffff')},uCol2:{value:C(o.col2||o.col||'#ffffff')},uOp:{value:o.op===undefined?1:o.op},uTex:{value:o.tex||dotTex}},
  vertexShader:PART_VS,fragmentShader:PART_FS,transparent:true,depthWrite:false,blending:o.add===false?THREE.NormalBlending:THREE.AdditiveBlending});
 const pts=new THREE.Points(g,m);pts.renderOrder=o.ro||2;return pts}
/* static glittering points (no motion) */
function sparkles(pts,col,size,op,twinkle){const g=new THREE.BufferGeometry(),a=new Float32Array(pts.length*3),s=new Float32Array(pts.length);pts.forEach((p,i)=>{a[i*3]=p.x;a[i*3+1]=p.y;a[i*3+2]=p.z;s[i]=Math.random()*100});
 g.setAttribute('position',new THREE.BufferAttribute(a,3));g.setAttribute('aSeed',new THREE.BufferAttribute(s,1));g.computeBoundingSphere();
 const m=new THREE.ShaderMaterial({uniforms:{uT:GT,uScale:PSCALE,uSize:{value:size||1},uCol:{value:C(col||'#ffffff')},uOp:{value:op===undefined?1:op},uTw:{value:twinkle===undefined?1:twinkle},uTex:{value:dotTex}},
  vertexShader:`attribute float aSeed;uniform float uT,uSize,uScale,uTw;varying float vA;void main(){vA=1.-uTw*.5+uTw*.5*sin(uT*(1.3+fract(aSeed)*2.)+aSeed);vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=max(1.,uSize*uScale/-mv.z*(.6+.8*fract(aSeed*7.3)));gl_Position=projectionMatrix*mv;}`,
  fragmentShader:`uniform vec3 uCol;uniform float uOp;uniform sampler2D uTex;varying float vA;void main(){vec4 t=texture2D(uTex,gl_PointCoord);gl_FragColor=vec4(uCol,t.a*vA*uOp);}`,
  transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
 const p=new THREE.Points(g,m);p.renderOrder=2;return p}
function glowSprite(col,scale,op,tex){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex||glowTex,color:col,transparent:true,opacity:op===undefined?.8:op,blending:THREE.AdditiveBlending,depthWrite:false}));s.scale.set(scale,scale,1);s.renderOrder=3;return s}
function starfield(sc,n,rad,size,op,tint){const g=new THREE.BufferGeometry(),p=[],c=[];const cols=[C('#cfe2ff'),C('#fff4dc'),C('#ffd6b0'),C('#bcd0ff'),C(tint||'#ffffff')];
 for(let i=0;i<n;i++){const v=V3(Math.random()*2-1,Math.random()*2-1,Math.random()*2-1).normalize().multiplyScalar(rad*(1+Math.random()*.3));p.push(v.x,v.y,v.z);const k=cols[(Math.random()*cols.length)|0];const b=.35+Math.random()*.65;c.push(k.r*b,k.g*b,k.b*b)}
 g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('color',new THREE.Float32BufferAttribute(c,3));
 const s=new THREE.Points(g,new THREE.PointsMaterial({size:size||1.6,sizeAttenuation:false,vertexColors:true,transparent:true,opacity:op===undefined?1:op,depthWrite:false,fog:false}));s.renderOrder=-5;sc.add(s);return s}
/* a soft glowing mote marks things that have no body of their own */
const moteMats={};
function moteMat(col){return moteMats[col]||(moteMats[col]=new THREE.SpriteMaterial({map:glowTex,color:col,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,sizeAttenuation:false,opacity:.9}))}
const MOTECOL={'':'#9ff0cf','k-cr':'#b9dcff','k-ev':'#ffd2b0'};
function mote(w){const s=new THREE.Sprite(moteMat(MOTECOL[CATK(w.c)]).clone());s.scale.set(.03,.03,1);s.renderOrder=4;s.userData.base=.03;s.userData.ph=Math.random()*6;return s}
/* nebula sprite texture */
const nebTex=(()=>{const N=256;return canvasTex(N,N,(x)=>{const im=x.createImageData(N,N);for(let j=0;j<N;j++)for(let i=0;i<N;i++){const dx=(i-N/2)/(N/2),dy=(j-N/2)/(N/2),r=Math.hypot(dx,dy);const v=fbm(i/38,j/38,3.3,5)*(1-sm(.15,1,r));const k=(j*N+i)*4;im.data[k]=im.data[k+1]=im.data[k+2]=255;im.data[k+3]=Math.max(0,v*1.7-.42)*255}x.putImageData(im,0,0)})})();
/* a soft ring that follows the selection */
const selRing=new THREE.Sprite(new THREE.SpriteMaterial({map:ringTex,color:'#f0c97a',transparent:true,opacity:0,depthWrite:false,depthTest:false,blending:THREE.AdditiveBlending,sizeAttenuation:false}));selRing.renderOrder=20;selRing.scale.set(.06,.06,1);

/* ---------- sprite batching: many still sprites sharing one material become one mesh ----------
   A few seconds after a space opens, sprites that have not moved are gathered per (parent, material)
   and drawn as camera-facing quads in a single draw; colour and opacity still follow the original material. */
const SB_VS=`attribute vec3 aC;attribute vec2 aS;attribute vec2 aK;attribute float aR;attribute vec4 aCol;varying vec2 vU;varying vec4 vCol;
#include <fog_pars_vertex>
void main(){vU=aK+.5;vCol=aCol;vec4 mvPosition=modelViewMatrix*vec4(aC,1.);float c=cos(aR),s=sin(aR);vec2 k=aK*aS;mvPosition.xy+=vec2(c*k.x-s*k.y,s*k.x+c*k.y);gl_Position=projectionMatrix*mvPosition;
#include <fog_vertex>
}`;
const SB_FS=`uniform sampler2D map;uniform float uHasMap;varying vec2 vU;varying vec4 vCol;
#include <fog_pars_fragment>
void main(){vec4 t=uHasMap>.5?texture2D(map,vU):vec4(1.);vec4 c=vCol*t;if(c.a<.002)discard;gl_FragColor=c;
#include <tonemapping_fragment>
#include <encodings_fragment>
#include <fog_fragment>
}`;
/* every frame the batch reads its sprites back — position, size, colour, opacity, visibility — so code that
   animates them keeps working; the sprites themselves are moved to a layer the camera does not draw */
function batchSprites(sp){const groups=new Map();
 sp.scene.traverse(o=>{if(!o.isSprite||!o.parent||o.userData.noBatch||o.userData.sb||o.children.length)return;const m=o.material;if(!m||m.sizeAttenuation===false||o.center.x!==.5||o.center.y!==.5)return;
  const k=o.parent.uuid+'|'+(m.map?m.map.uuid:'-')+'|'+m.blending+'|'+m.depthWrite+'|'+m.depthTest+'|'+(m.fog!==false)+'|'+o.renderOrder;(groups.get(k)||groups.set(k,[]).get(k)).push(o)});
 let saved=0;for(const L of groups.values()){if(L.length<4)continue;const m0=L[0].material,par=L[0].parent;const n=L.length;
  const A={aC:new Float32Array(n*12),aS:new Float32Array(n*8),aK:new Float32Array(n*8),aR:new Float32Array(n*4),aCol:new Float32Array(n*16)};const idx=[];
  for(let i=0;i<n;i++){A.aK.set([-.5,-.5,.5,-.5,.5,.5,-.5,.5],i*8);idx.push(i*4,i*4+1,i*4+2,i*4,i*4+2,i*4+3)}
  const g=new THREE.BufferGeometry();const B={};for(const k in A){const it={aC:3,aS:2,aK:2,aR:1,aCol:4}[k];B[k]=new THREE.BufferAttribute(A[k],it);if(k!=='aK')B[k].setUsage(THREE.DynamicDrawUsage);g.setAttribute(k,B[k])}g.setAttribute('position',B.aC);g.setIndex(idx);
  const U=THREE.UniformsUtils.merge([THREE.UniformsLib.fog,{map:{value:m0.map},uHasMap:{value:m0.map?1:0}}]);
  const mat=new THREE.ShaderMaterial({uniforms:U,vertexShader:SB_VS,fragmentShader:SB_FS,transparent:true,depthWrite:m0.depthWrite,depthTest:m0.depthTest,blending:m0.blending,fog:m0.fog!==false&&!!sp.scene.fog});
  const mesh=new THREE.Mesh(g,mat);mesh.frustumCulled=false;mesh.renderOrder=L[0].renderOrder;mesh.userData.batch=1;
  const prev=new Float32Array(n*9).fill(NaN);
  const sync=()=>{let dp=false,ds=false,dc=false;for(let i=0;i<n;i++){const o=L[i],mm=o.material,j=i*9;const op=o.visible?mm.opacity:0;
    if(prev[j]!==o.position.x||prev[j+1]!==o.position.y||prev[j+2]!==o.position.z){prev[j]=o.position.x;prev[j+1]=o.position.y;prev[j+2]=o.position.z;for(let q=0;q<4;q++)A.aC.set([o.position.x,o.position.y,o.position.z],(i*4+q)*3);dp=true}
    if(prev[j+3]!==o.scale.x||prev[j+4]!==o.scale.y||prev[j+8]!==(mm.rotation||0)){prev[j+3]=o.scale.x;prev[j+4]=o.scale.y;prev[j+8]=mm.rotation||0;for(let q=0;q<4;q++){A.aS[(i*4+q)*2]=o.scale.x;A.aS[(i*4+q)*2+1]=o.scale.y;A.aR[i*4+q]=mm.rotation||0}ds=true}
    const c=mm.color;if(prev[j+5]!==c.r||prev[j+6]!==c.g||prev[j+7]!==c.b||A.aCol[i*16+3]!==op){prev[j+5]=c.r;prev[j+6]=c.g;prev[j+7]=c.b;for(let q=0;q<4;q++)A.aCol.set([c.r,c.g,c.b,op],(i*4+q)*4);dc=true}}
   if(dp)B.aC.needsUpdate=true;if(ds){B.aS.needsUpdate=true;B.aR.needsUpdate=true}if(dc)B.aCol.needsUpdate=true};
  sync();mesh.onBeforeRender=sync;par.add(mesh);for(const o of L){o.layers.set(31);o.userData.sb=1}saved+=n-1}
 // glows on their own (one or two to a parent) but additive: gather them across the whole space, in world coordinates
 {const W=new Map();sp.scene.traverse(o=>{if(!o.isSprite||o.userData.sb||o.userData.noBatch||o.children.length||!o.parent)return;const m=o.material;if(!m||m.blending!==THREE.AdditiveBlending||m.sizeAttenuation===false||o.center.x!==.5||o.center.y!==.5)return;
   const k=(m.map?m.map.uuid:'-')+'|'+m.depthTest+'|'+(m.fog!==false)+'|'+o.renderOrder;(W.get(k)||W.set(k,[]).get(k)).push(o)});
  for(const L of W.values()){if(L.length<6)continue;const m0=L[0].material,n=L.length;
   const A={aC:new Float32Array(n*12),aS:new Float32Array(n*8),aK:new Float32Array(n*8),aR:new Float32Array(n*4),aCol:new Float32Array(n*16)};const idx=[];
   for(let i=0;i<n;i++){A.aK.set([-.5,-.5,.5,-.5,.5,.5,-.5,.5],i*8);idx.push(i*4,i*4+1,i*4+2,i*4,i*4+2,i*4+3)}
   const g=new THREE.BufferGeometry();const B={};for(const k in A){const it={aC:3,aS:2,aK:2,aR:1,aCol:4}[k];B[k]=new THREE.BufferAttribute(A[k],it);if(k!=='aK')B[k].setUsage(THREE.DynamicDrawUsage);g.setAttribute(k,B[k])}g.setAttribute('position',B.aC);g.setIndex(idx);
   const U=THREE.UniformsUtils.merge([THREE.UniformsLib.fog,{map:{value:m0.map},uHasMap:{value:m0.map?1:0}}]);
   const mat=new THREE.ShaderMaterial({uniforms:U,vertexShader:SB_VS,fragmentShader:SB_FS,transparent:true,depthWrite:false,depthTest:m0.depthTest,blending:THREE.AdditiveBlending,fog:m0.fog!==false&&!!sp.scene.fog});
   const mesh=new THREE.Mesh(g,mat);mesh.frustumCulled=false;mesh.renderOrder=L[0].renderOrder;mesh.userData.batch=1;
   const vis=o=>{let p=o;while(p){if(!p.visible)return false;p=p.parent}return true};
   const sync=()=>{for(let i=0;i<n;i++){const o=L[i],mm=o.material,e=o.matrixWorld.elements;const on=o.parent&&vis(o);const sx=Math.hypot(e[0],e[1],e[2]),sy=Math.hypot(e[4],e[5],e[6]);const c=mm.color,op=on?mm.opacity:0,r=mm.rotation||0;
     for(let q=0;q<4;q++){const v=i*4+q;A.aC[v*3]=e[12];A.aC[v*3+1]=e[13];A.aC[v*3+2]=e[14];A.aS[v*2]=sx;A.aS[v*2+1]=sy;A.aR[v]=r;A.aCol[v*4]=c.r;A.aCol[v*4+1]=c.g;A.aCol[v*4+2]=c.b;A.aCol[v*4+3]=op}}
    B.aC.needsUpdate=B.aS.needsUpdate=B.aR.needsUpdate=B.aCol.needsUpdate=true};
   sync();mesh.onBeforeRender=sync;sp.scene.add(mesh);for(const o of L){o.layers.set(31);o.userData.sb=1}saved+=n-1}}
 sp._batched=(sp._batched||0)+saved;return saved}
