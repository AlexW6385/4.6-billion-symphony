/* ================================================================
   the ground up close (image quality, step 2)
   · the planet ground is shaded per pixel: meadow, forest floor, bare rock on slopes, sand, snow and mud, chosen from the
     slope, the height and each era's own colours, with small generated detail textures that fade out with distance
   · round the spot you look at, a finer patch of ground with a little relief replaces the coarse sphere mesh
   · a field of wind-blown grass blades and a few flowers on that patch
   · rounder, softer tree crowns that glow a little with the sun behind them
   · all of it scales with the quality steps (perf.lvl) and phones
   ================================================================ */

/* ---- quality steps: perf.lvl 0 best .. 3 lowest; a phone starts one step down ---- */
const Q2T=[
 {grass:16000,flw:300,pr:150,pn:144,rg:1,nrm:1,fine:1},
 {grass:9000,flw:190,pr:118,pn:112,rg:.85,nrm:1,fine:1},
 {grass:4000,flw:90,pr:84,pn:80,rg:.7,nrm:0,fine:1},
 {grass:0,flw:0,pr:0,pn:0,rg:0,nrm:0,fine:0}];
const Q2Q={value:new THREE.Vector4(1,1,0,0)};                 // x: close detail texture, y: detail normal
const Q2SUN={value:V3(1,0,0)},Q2SUNC={value:new THREE.Color(0,0,0)};
const Q2A={patch:170,grass:95};                                // highest camera that still gets the patch / the grass
function q2_tier(){if(window.__q2tier!==undefined)return window.__q2tier;const l=(typeof perf!=='undefined'&&perf?perf.lvl:0)+(COARSE?1:0);return Math.min(3,l|0)}

/* ---- small value noise from a table (cheap enough to run per vertex at build time) ---- */
const Q2N=(()=>{const t=new Float32Array(32768),Rn=rnd(7717);for(let i=0;i<t.length;i++)t[i]=Rn();return t})();
function q2n(x,y,z){const xi=Math.floor(x),yi=Math.floor(y),zi=Math.floor(z);let fx=x-xi,fy=y-yi,fz=z-zi;fx=fx*fx*(3-2*fx);fy=fy*fy*(3-2*fy);fz=fz*fz*(3-2*fz);
 const X0=xi&31,X1=(xi+1)&31,Y0=(yi&31)<<5,Y1=((yi+1)&31)<<5,Z0=(zi&31)<<10,Z1=((zi+1)&31)<<10,T=Q2N;
 const k0=T[X0|Y0|Z0]+(T[X1|Y0|Z0]-T[X0|Y0|Z0])*fx,k1=T[X0|Y1|Z0]+(T[X1|Y1|Z0]-T[X0|Y1|Z0])*fx,k2=T[X0|Y0|Z1]+(T[X1|Y0|Z1]-T[X0|Y0|Z1])*fx,k3=T[X0|Y1|Z1]+(T[X1|Y1|Z1]-T[X0|Y1|Z1])*fx;
 const m0=k0+(k1-k0)*fy,m1=k2+(k3-k2)*fy;return m0+(m1-m0)*fz}
function q2h(a,b,c){let h=Math.sin(a*127.1+b*311.7+c*74.7)*43758.5453;return h-Math.floor(h)}

/* ---- the detail texture: four tiling channels, mipmapped
   R grass (short strokes in clumps) · G rock (ridged crevices) · B grain and pebbles · A soft patches ---- */
let Q2TEX=null;
function q2_detTex(){if(Q2TEX)return Q2TEX;const N=256,L=128,Rn=rnd(4242),T=new Float32Array(L*L);for(let i=0;i<T.length;i++)T[i]=Rn();
 const vn=(x,y,P)=>{const xi=Math.floor(x),yi=Math.floor(y);let fx=x-xi,fy=y-yi;fx=fx*fx*(3-2*fx);fy=fy*fy*(3-2*fy);const i0=((xi%P)+P)%P,i1=(i0+1)%P,j0=((yi%P)+P)%P,j1=(j0+1)%P;
  const a=T[i0+L*j0],b=T[i1+L*j0],c=T[i0+L*j1],d=T[i1+L*j1];return (a+(b-a)*fx)*(1-fy)+(c+(d-c)*fx)*fy};
 const RR=new Float32Array(N*N),GG=new Float32Array(N*N),BB=new Float32Array(N*N),AA=new Float32Array(N*N);
 for(let y=0;y<N;y++)for(let x=0;x<N;x++){const u=x/N,v=y/N,k=y*N+x;
  AA[k]=vn(u*4,v*4,4)*.5+vn(u*8+.5,v*8+.3,8)*.26+vn(u*16,v*16,16)*.15+vn(u*32,v*32,32)*.09;
  const gr=vn(u*32,v*32,32)*.3+vn(u*64,v*64,64)*.35+vn(u*128,v*128,128)*.35;BB[k]=gr;
  // rock: ridged noise, a network of crevices at every scale
  let rg=0;for(const [P,am] of [[4,.42],[8,.27],[16,.18],[32,.13]]){const q=1-Math.abs(2*vn(u*P+P*.37,v*P+P*.71,P)-1);rg+=q*q*am}
  GG[k]=.18+.95*rg+(gr-.5)*.1;
  RR[k]=.5+(vn(u*16,v*16,16)-.5)*.3}
 // grass: thousands of short strokes, lighter and darker, denser in clumps
 for(let s=0;s<3400;s++){const x0=Rn()*N,y0=Rn()*N,cl=vn(x0/N*8,y0/N*8,8);if(Rn()>cl*1.3)continue;const an=Rn()*6.283,ln=3+Rn()*8,val=(Rn()<.55?1:-1)*(.16+.22*Rn()),ca=Math.cos(an),sa=Math.sin(an);
  for(let t=0;t<ln;t+=.6){const px=((Math.round(x0+ca*t)%N)+N)%N,py=((Math.round(y0+sa*t)%N)+N)%N;RR[py*N+px]+=val*(1-t/ln*.6)}}
 // pebbles: small round stones with a lit top
 for(let s=0;s<170;s++){const x0=Rn()*N,y0=Rn()*N,r=1.2+Rn()*2.6,lv=.55+Rn()*.4;for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){const d=Math.hypot(dx,dy)/r;if(d>1)continue;const px=((Math.round(x0+dx)%N)+N)%N,py=((Math.round(y0+dy)%N)+N)%N,k=py*N+px;BB[k]=lv*(1-.35*(dx+dy)/(r*2.8))*(1-.25*d*d)}}
 const d=new Uint8Array(N*N*4);for(let k=0;k<N*N;k++){d[k*4]=clamp(RR[k],0,1)*255;d[k*4+1]=clamp(GG[k],0,1)*255;d[k*4+2]=clamp(BB[k],0,1)*255;d[k*4+3]=clamp(AA[k],0,1)*255}
 const t=new THREE.DataTexture(d,N,N,THREE.RGBAFormat);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.magFilter=THREE.LinearFilter;t.minFilter=THREE.LinearMipmapLinearFilter;t.generateMipmaps=true;
 try{t.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy())}catch(e){}t.needsUpdate=true;return Q2TEX=t}

/* ---- the planet ground material (replaces the planet branch of detailMat) ---- */
const Q2_GLSL_PARS=`uniform sampler2D bumpMap;uniform float bumpScale;uniform sampler2D uDet;uniform vec4 uQ;uniform vec3 uPC;uniform float uPR,uPRo;varying vec2 vQ;
vec3 q2w;vec4 q2F,q2M;float q2hh,q2wet,q2sn;
vec4 q2tri(vec3 p){return texture2D(uDet,p.yz)*q2w.x+texture2D(uDet,p.zx)*q2w.y+texture2D(uDet,p.xy)*q2w.z;}
float hTer(vec3 p){p*=uFreq;float h=vn3(p*.09)*.8+vn3(p*.3)*.3;
#if defined(USE_COLOR)
float du=smoothstep(.2,.34,vColor.r-vColor.b)*smoothstep(.5,.62,vColor.r);if(du>0.){float w=dot(p,vec3(.6,.25,.75))*.42+vn3(p*.06)*5.;h+=du*(abs(sin(w))*1.6+sin(w*3.1+vn3(p*.2)*3.)*.25);}
#endif
return h;}
vec2 dHdxy_fwd(){float d=length(vViewPosition);float k=(1.-smoothstep(50.,750.,d))*bumpScale*uQ.y;float h=hTer(vOP)+q2hh;return vec2(dFdx(h),dFdy(h))*k;}
vec3 perturbNormalArb(vec3 surf_pos,vec3 surf_norm,vec2 dHdxy,float faceDirection){vec3 vSigmaX=vec3(dFdx(surf_pos.x),dFdx(surf_pos.y),dFdx(surf_pos.z));vec3 vSigmaY=vec3(dFdy(surf_pos.x),dFdy(surf_pos.y),dFdy(surf_pos.z));vec3 vN=surf_norm;vec3 R1=cross(vSigmaY,vN);vec3 R2=cross(vN,vSigmaX);float fDet=dot(vSigmaX,R1)*faceDirection;vec3 vGrad=sign(fDet)*(dHdxy.x*R1+dHdxy.y*R2);return normalize(abs(fDet)*surf_norm-vGrad);}`;
/* what the ground is made of, per pixel. The era colour says what grows there (green: plants, tan: sand, white: snow, grey or
   brown: bare ground); the slope turns it to rock, the water's edge and river banks make it wet */
const Q2_GLSL_COLOR=`#include <color_fragment>
 {
#ifdef Q2_BASE
 if(dot(normalize(vOP),uPC)>uPR)discard;
#endif
#ifdef Q2_PATCH
 if(dot(normalize(vOP),uPC)<uPRo)discard;
#endif
 vec3 rn=normalize(vOP);float vH=length(vOP)-1000.;float dd=length(vViewPosition);vec3 nO=normalize(vON);
 // the projection follows the real surface (the coarse mesh's smooth normals lean the wrong way on cliffs)
 vec3 nG=cross(dFdx(vOP),dFdy(vOP));nG=dot(nG,nG)>1e-12?normalize(nG):nO;vec3 nT=normalize(nO*.35+nG*sign(dot(nG,nO)+1e-4));
 q2w=pow(abs(nT),vec3(4.));q2w/=q2w.x+q2w.y+q2w.z;
 float kF=(1.-smoothstep(14.,85.,dd))*uQ.x,kM=1.-smoothstep(110.,720.,dd),kL=1.-smoothstep(1400.,3600.,dd);
 q2F=vec4(.5);if(kF>0.)q2F=mix(q2F,q2tri(vOP*(.41*uFreq)),kF);// (the finest scale only near the camera)
 q2M=mix(vec4(.5),q2tri(vOP*(.061*uFreq)),kM);vec4 q2L=mix(vec4(.5),q2tri(vOP*(.0105*uFreq)),kL);
 float nL=q2L.a;float mo=uMott;
 vec3 c=diffuseColor.rgb;float sum=c.r+c.g+c.b+.001;float mxc=max(c.r,max(c.g,c.b)),mnc=min(c.r,min(c.g,c.b));float sat=(mxc-mnc)/(mxc+.001);float lum=dot(c,vec3(.3,.59,.11));
 float land=smoothstep(.8,2.6,vH);float sG=1.-abs(dot(nT,rn));float slope=max(1.-dot(nO,rn),sG*smoothstep(.36,.6,sG));// (the facets only count where the ground is really steep)
 float veg=smoothstep(.352,.392,c.g/sum)*smoothstep(.06,.16,sat);
 float sand=smoothstep(.1,.24,c.r-c.b)*smoothstep(.4,.58,lum)*(1.-veg);
 float snow=smoothstep(.64,.8,lum)*(1.-smoothstep(.1,.22,sat));
 float rk=smoothstep(.15,.33,slope+(q2M.g-.5)*.18+(q2L.g-.5)*.14)*land*uRockK;
 rk*=1.-snow*.8*(1.-smoothstep(.34,.55,slope));// snow lies on all but the steepest rock
 float fo=clamp(vQ.x,0.,1.)*veg,wr=clamp(vQ.y,0.,1.)*land;
 float shore=(1.-smoothstep(0.,2.2,vH))*smoothstep(-2.5,.2,vH);
 // meadow: big soft patches of lusher and drier grass, then clumps and blades up close
 vec3 g=c*(1.+(nL-.5)*.24*mo);
 g=mix(g,g*vec3(1.13,1.07,.74),smoothstep(.56,.78,q2M.a)*.42*mo);
 g=mix(g,g*vec3(.8,.95,.88),smoothstep(.45,.24,q2M.a)*.36*mo);
 g*=1.+((q2F.r-.5)*.42+(q2M.r-.5)*.16)*mo;
 // forest floor: darker, browner, leaf litter
 g=mix(g,c*vec3(.62,.56,.42)*(.78+.44*q2F.b)*(.9+.2*q2M.a),fo*.6);
 // bare ground
 vec3 col=c*(1.+((q2M.a-.5)*.22+(q2F.b-.5)*.26+(q2M.g-.5)*.1+(nL-.5)*.12)*mo);
 col=mix(col,g,veg);
 // sand: fine grain, a few darker drifts
 col=mix(col,c*(1.+((q2F.b-.5)*.2+(q2M.a-.5)*.14)*mo),sand);
 // mud on river banks, with standing water in the hollows
 float pud=smoothstep(.6,.68,q2M.a)*wr;
 col=mix(col,c*vec3(.6,.55,.46)*(.86+.28*q2F.b),wr*.7);col*=1.-pud*.45;
 col*=1.-shore*.3;q2wet=clamp(max(wr*.55,shore*.45)+pud*.45,0.,1.);
 // rock: plates and cracks, faint strata along the height
 float fw=length(fwidth(vOP));float bF=1.-smoothstep(.005,.016,fw),bM=1.-smoothstep(.035,.11,fw);
 float strata=(sin(vH*.9+nL*7.+q2M.a*2.5)*.5+.5)*(1.-smoothstep(.06,.2,fw));
 vec3 rc0=mix(uRock,c,.38);rc0=mix(vec3(dot(rc0,vec3(.33))),rc0,.6);
 // big warm and cool patches, crevice networks at two scales, lighter and darker layers
 rc0*=mix(vec3(1.05,1.01,.94),vec3(.94,.98,1.04),smoothstep(.3,.7,q2L.a))*(.9+.2*q2L.a);
 vec3 rc=rc0*(.74+.44*q2M.g)*(.88+.22*q2L.g)*(.9+.2*q2F.g)*mix(.9,1.1,strata)*mix(vec3(1.),vec3(1.06,1.,.92),strata*.6);
 col=mix(col,rc,rk);
 // snow: smooth, a little blue in the shade of every bump
 float hs=smoothstep(uSnow-10.,uSnow+8.,vH+(nL-.5)*34.)*(1.-rk*.5);
 q2sn=max(snow*(1.-rk*.6),hs);
 col=mix(col,mix(c,vec3(.9,.94,.97),hs)*(.97+.06*q2M.a)-vec3(.03,.015,0.)*(1.-q2F.b),q2sn);
 diffuseColor.rgb=col;
 // the detail normal only from texels clearly bigger than a pixel (finer ones would shimmer in 2x2 blocks)
 // heights for the detail normal, kept to gentle slopes (amplitude well under the feature size, or the light breaks up)
 q2hh=(((q2F.a-.5)*.05*(1.-sand*.5)+rk*(q2F.g-.5)*.04)*bF+((q2M.a-.5)*.3*(1.-sand)+rk*((q2M.g-.5)*.32+strata*.05))*bM+rk*(q2L.g-.5)*1.1)*(1.-q2sn*.7)*(1.-pud);
#ifdef IS_PLANET
 {vec3 cq=rn*11.+vec3(uT*.011,uT*.004,uT*.007);float cs=smoothstep(.5,.8,fb3(cq))*(1.-smoothstep(500.,2200.,dd))*land;diffuseColor.rgb*=1.-cs*.18;}
 float cs=smoothstep(.46,.72,fb3(vOP*.0105+vec3(uT*.012,uT*.003,uT*.008)));diffuseColor.rgb*=1.-cs*.2*land*(1.-smoothstep(350.,1500.,dd));
#endif
 }`;
function q2_planetMat(m,o){o=o||{};m.bumpMap=bumpDummy;m.bumpScale=o.bump===undefined?1:o.bump;const base=!!o.cross,patch=!!o.patch;
 const U=o.U||{uMix:{value:0},uCanyon:{value:0},uHK:{value:1},uSnow:{value:o.snow===undefined?1e4:o.snow},uRock:{value:C(o.rock||'#6e6458')},uRockK:{value:o.rockK===undefined?1:o.rockK},uMott:{value:o.mott===undefined?1:o.mott},uFreq:{value:o.freq||1},uT:GT};
 Object.assign(U,{uDet:U.uDet||{value:q2_detTex()},uQ:Q2Q,uPC:U.uPC||{value:V3(0,1,0)},uPR:U.uPR||{value:2},uPRo:U.uPRo||{value:-2}});m.userData.U=U;
 m.onBeforeCompile=sh=>{Object.assign(sh.uniforms,U);
  sh.vertexShader='attribute vec3 aCol2;\nattribute float aCanyon;\nattribute vec2 aQ;\n'+(patch?'attribute vec3 aN0;\n':'')+'uniform float uMix,uCanyon,uHK;\nvarying vec3 vOP;\nvarying vec3 vON;\nvarying vec2 vQ;\n'+sh.vertexShader
   .replace('#include <color_vertex>',(base||patch)?'vColor=mix(color,aCol2,uMix);':'#include <color_vertex>')
   .replace('#include <begin_vertex>','vec3 transformed=vec3(position);{float pl=length(position);transformed=position*((1000.0+(pl-1000.0)*uHK)/max(pl,1.0));}'+(o.canyon?'transformed-=normalize(position)*aCanyon*uCanyon;':'')+'vOP=transformed;vON='+(patch?'aN0':'objectNormal')+';vQ=aQ;');
  sh.fragmentShader='#define IS_PLANET\n'+(base?'#define Q2_BASE\n':'')+(patch?'#define Q2_PATCH\n':'')+'uniform float uSnow,uRockK,uMott,uFreq,uT;uniform vec3 uRock;\nvarying vec3 vOP;\nvarying vec3 vON;\n'+GLSL_NOISE+sh.fragmentShader
   .replace('#include <bumpmap_pars_fragment>',Q2_GLSL_PARS)
   .replace('#include <color_fragment>',Q2_GLSL_COLOR)
   .replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=mix(roughnessFactor,.3,q2wet);roughnessFactor=mix(roughnessFactor,.66,q2sn*.6);')};
 m.customProgramCacheKey=()=>'q2g'+(base?1:0)+(patch?1:0)+(o.canyon?1:0);return m}
const q2_dm0=detailMat;
detailMat=function(m,o){if(o&&o.planet)return q2_planetMat(m,o);return q2_dm0(m,o)};

/* ---- trees: the swaying material learns translucency toward the sun and a bark grain ---- */
const q2_sw0=swayMat;
swayMat=function(o,k){const m=q2_sw0(o,k);const ob=m.onBeforeCompile;
 m.onBeforeCompile=sh=>{ob(sh);sh.uniforms.uSunW=Q2SUN;sh.uniforms.uSunC=Q2SUNC;
  // the leaf shade varies smoothly instead of in blocky cells (they read as facets from close up)
  sh.fragmentShader='uniform vec3 uSunW,uSunC;\n'+sh.fragmentShader.replace('vec3 q=floor(vLP*1.4);float n=fract(sin(dot(q,vec3(12.9898,78.233,37.719)))*43758.5453);vec3 q2=floor(vLP*.18);float n2=fract(sin(dot(q2,vec3(39.3468,11.135,83.155)))*43758.5453);','float n=smoothstep(.15,.85,vn3(vLP*1.7));float n2=vn3(vLP*.22+vec3(3.1));')
   .replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
 {float s3=diffuseColor.r+diffuseColor.g+diffuseColor.b+.001;float lf=smoothstep(.36,.41,diffuseColor.g/s3);float bk=(1.-lf)*smoothstep(.02,.09,(diffuseColor.r-diffuseColor.b)/s3*3.);
  vec3 up=normalize(vLP);vec3 q=vLP*5.;float al=dot(q,up);float gr=vn3(q-up*al+vec3(al*.07));float nk=1.-smoothstep(25.,140.,length(vLP-cameraPosition));
  diffuseColor.rgb*=mix(1.,.7+.55*smoothstep(.25,.75,gr),bk*nk);}`)
   .replace('#include <emissivemap_fragment>',`#include <emissivemap_fragment>
 {float s3=diffuseColor.r+diffuseColor.g+diffuseColor.b+.001;float lf=smoothstep(.36,.41,diffuseColor.g/s3);vec3 V=normalize(vLP-cameraPosition);vec3 Nw=normalize(vLN);
  float back=pow(max(dot(V,uSunW),0.),5.);float rim=1.-abs(dot(Nw,V));
  totalEmissiveRadiance+=lf*diffuseColor.rgb*uSunC*(back*(.3+.5*rim)+max(-dot(Nw,uSunW),0.)*.1);}`);
  sh.fragmentShader=sh.fragmentShader.indexOf('float vn3(')<0?sh.fragmentShader.replace('uniform vec3 uSunW,uSunC;\n','uniform vec3 uSunW,uSunC;\n'+GLSL_NOISE):sh.fragmentShader};
 m.customProgramCacheKey=()=>'sway2q';return m};

/* ---- cover: remember the biome so the grass can read it ---- */
const q2_mc0=makeCover;
makeCover=function(sp,fn){sp.q2Biome=fn;return q2_mc0(sp,fn)};

/* ---------------- after a planet is built ---------------- */
const q2_gs0=getSpace;
getSpace=function(id){const had=!!SP[id];const sp=q2_gs0(id);if(!had&&sp&&sp.type==='planet'&&sp.terr)try{q2_setup(sp)}catch(e){console.warn('q2',id,e)}return sp};

function q2_setup(sp){const Gd=sp.G,geo=sp.terr.geometry,n=Gd.n,M=Gd.M,NN=Gd.N;
 // forest floor (from where the trees stand) and wet ground (river banks) for every grid point
 const Q=new Float32Array(n*2);
 if(sp.q2T){const F=new Float32Array(n),d=V3(),T=sp.q2T;for(let t=0;t<T.length;t+=2){dirLL(T[t],T[t+1],d);const k=q2_cell(Gd,d);if(k>=0)F[k]+=1}
  for(let fi=0;fi<6;fi++)for(let j=1;j<NN;j++)for(let i=1;i<NN;i++){const k=fi*M*M+j*M+i;const s=F[k]*.4+(F[k-1]+F[k+1]+F[k-M]+F[k+M])*.15;Q[k*2]=Math.min(1,s*.75)}
  sp.q2T=null}
 if(Gd.WET)for(let k=0;k<n;k++)Q[k*2+1]=Gd.WET[k];
 geo.setAttribute('aQ',new THREE.BufferAttribute(Q,2));sp.q2Q=Q;
 // rivers and roads: no relief and no grass on them
 sp.q2Lines=sp.q2Lines||[];
 // (the water ribbon lies at its own level, worked out here the way rqRivers does: the patch keeps the channel below it)
 if(sp.id==='rongqiu'&&typeof RIVERS!=='undefined')RIVERS.L.forEach(L=>{const m=L.length;let wl=1e9;const lv=L.map(p=>{const gC=gridSample(Gd,Gd.H,p);wl=Math.min(wl,gC+.3);return Math.max(wl,gC-1.2,-.2)+.05});
  for(let i=1;i<m;i++){const t=i/(m-1);sp.q2Lines.push({a:L[i-1],b:L[i],w:(.1+t*.32)*1.05,lv:Math.min(lv[i-1],lv[i]),eras:null})}});
 sp.q2=q2_patchSys(sp);
 // era colour changes: the patch takes the new colours at once
 const sc0=sp.setColors;sp.setColors=(key,inst)=>{sc0(key,inst);if(sp.q2)sp.q2.recol=1};
 anim(sp,null,()=>q2_step(sp))}
/* the grid point nearest to a direction */
function q2_cell(G,d){const fi=faceOf(d),f=FACES[fi];const dn=d.dot(f.n);const a=Math.atan(d.dot(f.u)/dn)*1.2732395,b=Math.atan(d.dot(f.v)/dn)*1.2732395;
 const i=Math.round(clamp((a+1)*.5*G.N,0,G.N)),j=Math.round(clamp((b+1)*.5*G.N,0,G.N));return fi*G.M*G.M+j*G.M+i}

/* ---------------- the near patch ---------------- */
const Q2GA=.38;   // grid grading: fine in the middle, coarser toward the edge
function q2_patchSys(sp){const tm=sp.terr.material;
 const mat=q2_planetMat(new THREE.MeshStandardMaterial({vertexColors:true,roughness:tm.roughness,metalness:tm.metalness}),{patch:1,U:sp.TU,bump:tm.bumpScale});
 mat.envMapIntensity=tm.envMapIntensity;mat.userData.envSet=1;
 const P={sp,mat,buf:[null,null],act:-1,job:null,cur:null,recol:0};
 P.mesh=[0,1].map(()=>{const m=new THREE.Mesh(new THREE.BufferGeometry(),mat);m.frustumCulled=false;m.visible=false;m.receiveShadow=true;m.userData.shd=1;m.userData.noShadow=1;m.raycast=()=>{};sp.scene.add(m);return m});
 // grass and flowers are double-buffered like the patch: the next set fills while the current one shows
 if(sp.q2Biome){const gm=q2_grassMesh(sp),fm=q2_flowerMesh(sp);P.grass=[gm,q2_twin(sp,gm)];P.flw=[fm,q2_twin(sp,fm)];P.ga=0}
 return P}
function q2_buf(P,k,n){let B=P.buf[k];if(B&&B.n===n)return B;const nv=(n+1)*(n+1);
 B={n,nv,pos:new Float32Array(nv*3),nrm:new Float32Array(nv*3),ca:new Float32Array(nv*3),cb:new Float32Array(nv*3),q:new Float32Array(nv*2),
  cc:new Float32Array(nv*3),nb:new Float32Array(nv*3),dist:new Float32Array(nv),wE:new Float32Array(nv),dh:new Float32Array(nv),gw:new Float32Array(nv)};
 const idx=new (nv>65535?Uint32Array:Uint16Array)(n*n*6);let q=0;for(let j=0;j<n;j++)for(let i=0;i<n;i++){const a=j*(n+1)+i,b=a+1,c=a+n+1,d=c+1;idx[q++]=a;idx[q++]=c;idx[q++]=b;idx[q++]=b;idx[q++]=c;idx[q++]=d}
 const g=new THREE.BufferGeometry();g.setIndex(new THREE.BufferAttribute(idx,1));
 g.setAttribute('position',new THREE.BufferAttribute(B.pos,3));g.setAttribute('normal',new THREE.BufferAttribute(B.nrm,3));g.setAttribute('color',new THREE.BufferAttribute(B.ca,3));g.setAttribute('aCol2',new THREE.BufferAttribute(B.cb,3));g.setAttribute('aQ',new THREE.BufferAttribute(B.q,2));g.setAttribute('aN0',new THREE.BufferAttribute(B.nb,3));// the sphere's own smooth normal: what the ground is made of follows it, not the bumps
 g.boundingSphere=new THREE.Sphere(V3(0,0,0),R+300);
 const old=P.mesh[k].geometry;P.mesh[k].geometry=g;old.dispose();B.geo=g;P.buf[k]=B;return B}

/* per frame: decide whether the patch is wanted, keep it centred under the view, work on a rebuild a slice at a time */
function q2_step(sp){const P=sp.q2;if(!P)return;const ti=q2_tier(),T=Q2T[ti];
 if(!window.__q2Q){Q2Q.value.x=T.fine;Q2Q.value.y=T.nrm}
 if(sp.sunL){Q2SUN.value.copy(sp.sunDir);Q2SUNC.value.copy(sp.sunL.color).multiplyScalar(sp.sunL.intensity*(sp.dayK===undefined?1:sp.dayK))}
 const U=sp.TU;const cyOk=Math.abs((sp.canyonTo||0)-U.uCanyon.value)<1e-3;
 const on=CUR===sp&&T.pr>0&&rig.alt<Q2A.patch&&cyOk&&!(sp.cover&&!sp.cover.visible)&&!window.__q2off;
 if(!on){if(P.act>=0){P.mesh[P.act].visible=false;P.act=-1;P.cur=null}U.uPR.value=2;q2_grassOff(P);P.job=null;sp.q2gr=0;return}
 // colours changed (a new era, or the end of a crossfade): take them over now; everything else follows on the next rebuild
 if(P.cur&&(P.recol||(P.cur.mix>0&&U.uMix.value===0))){q2_recolour(P);P.recol=0;P.cur.era=-1}
 if(P.cur)P.cur.mix=U.uMix.value;
 if(!P.job){const c=V3().copy(S_).normalize();const c0=P.cur;
  const need=!c0||c0.ti!==ti||c0.era!==ERA||Math.abs(c0.cy-U.uCanyon.value)>.002||c.dot(c0.C)<Math.cos(c0.r*.17/R)||Math.abs(Math.log(Math.max(rig.alt,14)/c0.alt))>.4;
  if(need&&(!tw||tw.t>.8))P.job=q2_jobStart(P,c,T,ti)}
 if(P.job)P.job.step(P.job);
 const gp=P.cur&&P.grass&&rig.alt<Q2A.grass;if(gp&&P.cur.gc){Q2W.uGC.value.copy(P.cur.gc);Q2W.uGR.value=P.cur.rg}if(P.grass)for(let k=0;k<2;k++){const on=!!gp&&k===P.ga;P.grass[k].visible=on&&P.grass[k].count>0;P.flw[k].visible=on&&P.flw[k].count>0}sp.q2gr=gp&&P.cur?P.cur.rg/(R*D2R):0}

function q2_jobStart(P,c,T,ti){const sp=P.sp,Gd=sp.G;const back=P.act===0?1:0;const n=T.pn,Rp=T.pr;const B=q2_buf(P,back,n);
 const Nn=V3(0,1,0).addScaledVector(c,-c.y);if(Nn.lengthSq()<1e-6)Nn.set(1,0,0);Nn.normalize();const E=Nn.clone().cross(c).negate();
 const rin=Rp*.955-2,alt=Math.max(rig.alt,14);const rg=clamp(26+alt*1.05,36,Rp*.86)*T.rg;
 const degR=(Rp*1.5)/(R*D2R);
 const clr=(sp.entClr||[]).filter(e=>(!e.eras||e.eras.includes(ERA))&&angDeg(e.d,c)<degR+e.deg*2);
 const lines=(sp.q2Lines||[]).filter(l=>(!l.eras||l.eras.includes(ERA))&&(angDeg(l.a,c)<degR+1||angDeg(l.b,c)<degR+1)).map(l=>{const ab=l.b.clone().sub(l.a);const m=l.a.clone().add(l.b).multiplyScalar(.5);
  return{a:l.a,ab,l2:ab.lengthSq()||1e-12,m,rr:(Math.sqrt(ab.lengthSq())*.5+(l.w*2.4+.06)*D2R),w:l.w,lv:l.lv}});
 const lakes=(typeof LAKEZ!=='undefined'?LAKEZ:[]).filter(z=>angDeg(z[0],c)<degR+z[1]*2);
 const J={P,B,n,Rp,r:Rp,rin,rg,C:c.clone(),E,N:Nn,ti,T,alt,clr,lines,lakes,cy:sp.TU.uCanyon.value,era:ERA,row:0,stage:0,gi:0,
  col:sp.sets[sp.ckey],ca:sp.terr.geometry.attributes.color.array,cb:sp.terr.geometry.attributes.aCol2.array,step:q2_jobStep};
 // what grows here: the biome on a coarse grid over the patch (it changes over degrees, not units)
 J.bio=[];const BN=9,W={},d=V3();
 if(sp.q2Biome)for(let j=0;j<=BN;j++)for(let i=0;i<=BN;i++){const gx=(i/BN*2-1)*Rp,gy=(j/BN*2-1)*Rp;d.copy(c).multiplyScalar(R).addScaledVector(E,gx).addScaledVector(Nn,gy).normalize();
  const ll=llDir(d);for(const k in W)delete W[k];const h=sp.ghRaw(ll[0],ll[1]);sp.q2Biome(d,Math.max(h,3),ll[0],ERA,W);
  J.bio.push({t:Math.min(1,(W.tuft||0)/.5),tall:W.tall||0,f:W.flower||0,tc:W.tuftC?C(W.tuftC):null,fc:W.flowerC||null})}
 J.BN=BN;return J}
// how much of the planned relief is allowed here: none on towns, roads, rivers, lakes and the waterline
function q2_clear(J,d,h){let w=sm(.8,2.6,h),g=sm(1.25,2.4,h);
 for(const e of J.clr){const a=angDeg(d,e.d);w*=sm(e.deg*.95,e.deg*1.5+.08,a);g*=sm(e.deg*1.02,e.deg*1.14+.02,a)}
 for(const l of J.lines){// distance to the segment (as a chord, in degrees), after a cheap test against its bounding ball
  const mx=d.x-l.m.x,my=d.y-l.m.y,mz=d.z-l.m.z;if(mx*mx+my*my+mz*mz>l.rr*l.rr)continue;
  let t=((d.x-l.a.x)*l.ab.x+(d.y-l.a.y)*l.ab.y+(d.z-l.a.z)*l.ab.z)/l.l2;t=t<0?0:t>1?1:t;const ex=d.x-l.a.x-l.ab.x*t,ey=d.y-l.a.y-l.ab.y*t,ez=d.z-l.a.z-l.ab.z*t;const a=Math.sqrt(ex*ex+ey*ey+ez*ez)/D2R;
  w*=sm(l.w*1.05,l.w*2.4+.05,a);g*=sm(l.w*.95,l.w*1.4+.02,a);if(l.lv!==undefined){const k=1-sm(l.w*1.3,l.w*2.6,a);if(k>J._rz)J._rz=k;const kc=1-sm(l.w*.5,l.w*.95,a);if(kc>J._rc)J._rc=kc}}
 for(const z of J.lakes){const a=angDeg(d,z[0]);w*=sm(z[1],z[1]*1.4+.05,a);g*=sm(z[1]*.95,z[1]*1.1,a)}
 J._g=g;return w}
const Q2C=[0,0,0];const q2cr=(p0,p1,p2,p3,t)=>p1+.5*t*(p2-p0+t*(2*p0-5*p1+4*p2-p3+t*(3*(p1-p2)+p3-p0)));
function q2_cls(c){const s=c[0]+c[1]+c[2]+.001,mx=Math.max(c[0],c[1],c[2]),mn=Math.min(c[0],c[1],c[2]),sat=(mx-mn)/(mx+.001),lum=c[0]*.3+c[1]*.59+c[2]*.11;
 const veg=sm(.352,.392,c[1]/s)*sm(.06,.16,sat),sand=sm(.1,.24,c[0]-c[2])*sm(.4,.58,lum)*(1-veg),snow=sm(.64,.8,lum)*(1-sm(.1,.22,sat));Q2C[0]=veg;Q2C[1]=sand;Q2C[2]=snow;return Q2C}
const _q2d=V3(),_q2c=[0,0,0];
function q2_jobStep(J){const P=J.P,sp=P.sp,B=J.B,n=J.n,Gd=sp.G,GN=Gd.N,M=Gd.M,H=Gd.H,CY=Gd.CY,cy=J.cy,NR=sp.terr.geometry.attributes.normal.array,QQ=sp.q2Q;
 if(J.stage===0){const rows=Math.max(1,Math.ceil(1600/(n+1)));const j1=Math.min(n+1,J.row+rows);const d=_q2d,c3=_q2c;const Rp=J.Rp,rin=J.rin;
  const hv=k=>H[k]-(CY?CY[k]*cy:0);
  for(let j=J.row;j<j1;j++){const v=j/n*2-1,gy=Rp*(Q2GA*v+(1-Q2GA)*v*v*v);for(let i=0;i<=n;i++){const u=i/n*2-1,gx=Rp*(Q2GA*u+(1-Q2GA)*u*u*u);const vi=j*(n+1)+i;
   d.copy(J.C).multiplyScalar(R).addScaledVector(J.E,gx).addScaledVector(J.N,gy).normalize();const dist=Math.acos(Math.min(1,d.dot(J.C)))*R;
   const fi=faceOf(d),f=FACES[fi],dn=d.dot(f.n);const a=Math.atan(d.dot(f.u)/dn)*1.2732395,b=Math.atan(d.dot(f.v)/dn)*1.2732395;
   const x=clamp((a+1)*.5*GN,0,GN-1e-4),y=clamp((b+1)*.5*GN,0,GN-1e-4);const ci=x|0,cj=y|0,fx=x-ci,fy=y-cj;const k=fi*M*M+cj*M+ci,k1=k+1,k2=k+M,k3=k+M+1;
   const ba=(1-fx)*(1-fy),bb=fx*(1-fy),bc=(1-fx)*fy,bd=fx*fy;const h0=hv(k),h1=hv(k1),h2=hv(k2),h3=hv(k3);const hB=h0*ba+h1*bb+h2*bc+h3*bd;
   // what may change here: nothing on towns, roads, lakes, the waterline; along rivers the ground stays exactly the sphere's own
   // (their water ribbons were laid to match it)
   const wE0=1-sm(rin*.5,rin*.9,dist);let wO=0;J._rz=0;J._rc=0;if(wE0>0)wO=q2_clear(J,d,hB);else J._g=0;const wE=wE0*(1-J._rz);
   // the sphere mesh's own triangles at the rim, a smooth surface inside
   let ta,tb,tc,td;if(fx+fy<1){ta=1-fx-fy;tb=fx;tc=fy;td=0}else{ta=0;tb=1-fy;tc=1-fx;td=fx+fy-1}
   const wa=ta+(ba-ta)*wE,wb=tb+(bb-tb)*wE,wc=tc+(bc-tc)*wE,wd=td+(bd-td)*wE;let h=h0*wa+h1*wb+h2*wc+h3*wd;
   let dev=0;if(wE>0&&ci>=1&&ci<=GN-2&&cj>=1&&cj<=GN-2){const kk=fi*M*M+cj*M+ci;const r0=q2cr(hv(kk-M-1),hv(kk-M),hv(kk-M+1),hv(kk-M+2),fx),r1=q2cr(hv(kk-1),hv(kk),hv(kk+1),hv(kk+2),fx),r2=q2cr(hv(kk+M-1),hv(kk+M),hv(kk+M+1),hv(kk+M+2),fx),r3=q2cr(hv(kk+2*M-1),hv(kk+2*M),hv(kk+2*M+1),hv(kk+2*M+2),fx);
    dev=clamp(q2cr(r0,r1,r2,r3,fy)-hB,-.5,.8)}
   // normals and colours follow the same weights
   let nx=NR[k*3]*wa+NR[k1*3]*wb+NR[k2*3]*wc+NR[k3*3]*wd,ny=NR[k*3+1]*wa+NR[k1*3+1]*wb+NR[k2*3+1]*wc+NR[k3*3+1]*wd,nz=NR[k*3+2]*wa+NR[k1*3+2]*wb+NR[k2*3+2]*wc+NR[k3*3+2]*wd;const nl=Math.hypot(nx,ny,nz)||1;nx/=nl;ny/=nl;nz/=nl;
   for(let q=0;q<3;q++){B.ca[vi*3+q]=J.ca[k*3+q]*wa+J.ca[k1*3+q]*wb+J.ca[k2*3+q]*wc+J.ca[k3*3+q]*wd;B.cb[vi*3+q]=J.cb[k*3+q]*wa+J.cb[k1*3+q]*wb+J.cb[k2*3+q]*wc+J.cb[k3*3+q]*wd;
    c3[q]=J.col[k*3+q]*ba+J.col[k1*3+q]*bb+J.col[k2*3+q]*bc+J.col[k3*3+q]*bd;B.cc[vi*3+q]=c3[q]}
   const fo=QQ[k*2]*ba+QQ[k1*2]*bb+QQ[k2*2]*bc+QQ[k3*2]*bd,we=QQ[k*2+1]*ba+QQ[k1*2+1]*bb+QQ[k2*2+1]*bc+QQ[k3*2+1]*bd;
   B.q[vi*2]=QQ[k*2]*wa+QQ[k1*2]*wb+QQ[k2*2]*wc+QQ[k3*2]*wd;B.q[vi*2+1]=QQ[k*2+1]*wa+QQ[k1*2+1]*wb+QQ[k2*2+1]*wc+QQ[k3*2+1]*wd;
   // a little relief: bumps and hummocks, more on bare and rocky ground, little on sand, snow, mud or under trees
   q2_cls(c3);const veg=Q2C[0],sand=Q2C[1],snow=Q2C[2];const sl=1-(nx*d.x+ny*d.y+nz*d.z);
   let A=(.26*veg+.12*sand+.14*snow+.5*Math.max(0,1-veg-sand-snow)+.45*sm(.1,.3,sl))*(1-.75*fo)*(1-we);A=Math.min(A,.8);
   let rel=0;if(wE>0){if(wO>0&&A>0){const px=d.x*R,py=d.y*R,pz=d.z*R;rel=A*((q2n(px/6.5+3.1,py/6.5,pz/6.5)-.42)+(q2n(px/2.3,py/2.3+7.7,pz/2.3)-.5)*.5+(q2n(px/14,py/14,pz/14+5.3)-.5)*.6)}}
   const dd=wE*wO*(dev+rel);h+=dd;
   // the patch's small flat triangles bridge the sphere mesh's creases a little high: in a river bed that would cover the water
   h-=.4*J._rc;
   B.pos[vi*3]=d.x*(R+h);B.pos[vi*3+1]=d.y*(R+h);B.pos[vi*3+2]=d.z*(R+h);B.nb[vi*3]=nx;B.nb[vi*3+1]=ny;B.nb[vi*3+2]=nz;
   B.dist[vi]=dist;B.wE[vi]=wE;B.dh[vi]=h-hB;
   // where grass may grow: green ground, not too steep, not on the rim of the water, sparse on sand
   if(wE0>0||dist<J.rg){const bi=q2_bio(J,gx,gy);B.gw[vi]=bi.t*(veg+sand*.22)*(1-sm(.1,.22,sl))*(1-snow)*(1-.5*fo)*(1-we*.7)*(J._g===undefined?1:J._g)}else B.gw[vi]=0}}
  J.row=j1;if(J.row>n){J.stage=1;J.row=0}return false}
 if(J.stage===1){// normals from the patch itself, blended back to the sphere's own toward the rim
  const W=n+1,p=B.pos,ax=V3(),ay=V3();for(let j=0;j<=n;j++)for(let i=0;i<=n;i++){const vi=j*W+i;let x=B.nb[vi*3],y=B.nb[vi*3+1],z=B.nb[vi*3+2];const w=B.wE[vi];
   if(w>0&&i>0&&i<n&&j>0&&j<n){ax.set(p[(vi+1)*3]-p[(vi-1)*3],p[(vi+1)*3+1]-p[(vi-1)*3+1],p[(vi+1)*3+2]-p[(vi-1)*3+2]);ay.set(p[(vi+W)*3]-p[(vi-W)*3],p[(vi+W)*3+1]-p[(vi-W)*3+1],p[(vi+W)*3+2]-p[(vi-W)*3+2]);
    ay.cross(ax).normalize();x+=(ay.x-x)*w;y+=(ay.y-y)*w;z+=(ay.z-z)*w;const l=Math.hypot(x,y,z)||1;x/=l;y/=l;z/=l}
   B.nrm[vi*3]=x;B.nrm[vi*3+1]=y;B.nrm[vi*3+2]=z}
  J.stage=P.grass?2:4;return false}
 if(J.stage===2){if(q2_grassJob(J))J.stage=3;return false}
 if(J.stage===3){if(q2_grassFill(J))J.stage=4;return false}
 // swap the new patch in
 const g=B.geo;for(const k of['position','normal','color','aCol2','aQ','aN0'])g.attributes[k].needsUpdate=true;
 if(P.act>=0)P.mesh[P.act].visible=false;const back=P.buf[0]===B?0:1;P.act=back;P.mesh[back].visible=true;
 const U=sp.TU;U.uPC.value.copy(J.C);U.uPR.value=Math.cos(J.rin/R);U.uPRo.value=Math.cos((J.rin+1.6)/R);
 P.cur={C:J.C,E:J.E,N:J.N,r:J.Rp,rin:J.rin,rg:J.rg,n,B,ti:J.ti,era:J.era,cy:J.cy,alt:J.alt,mix:U.uMix.value};
 if(P.grass){P.ga=1-P.ga;P.cur.gc=J.C.clone().multiplyScalar(R+sp.gh(...llDir(J.C)))}P.job=null;return true}
const Q2BI={t:0,tall:0,f:0,tc:null,fc:null};
function q2_bio(J,gx,gy){const BN=J.BN,o=Q2BI;if(!J.bio.length){o.t=o.tall=o.f=0;o.tc=o.fc=null;return o}const x=clamp((gx/J.Rp*.5+.5)*BN,0,BN-1e-4),y=clamp((gy/J.Rp*.5+.5)*BN,0,BN-1e-4);const i=x|0,j=y|0,fx=x-i,fy=y-j;
 const a=J.bio[j*(BN+1)+i],b=J.bio[j*(BN+1)+i+1],c=J.bio[(j+1)*(BN+1)+i],d=J.bio[(j+1)*(BN+1)+i+1];const L=(k)=>(a[k]*(1-fx)+b[k]*fx)*(1-fy)+(c[k]*(1-fx)+d[k]*fx)*fy;
 const nb=fx<.5?(fy<.5?a:c):(fy<.5?b:d);o.t=L('t');o.tall=L('tall');o.f=L('f');o.tc=nb.tc;o.fc=nb.fc;return o}
/* new colours for the patch in place (era change) */
function q2_recolour(P){const sp=P.sp,cu=P.cur;if(!cu)return;const B=cu.B,n=cu.n,Gd=sp.G,M=Gd.M,GN=Gd.N,ca=sp.terr.geometry.attributes.color.array,cb=sp.terr.geometry.attributes.aCol2.array;const d=V3();
 for(let vi=0;vi<B.nv;vi++){d.set(B.pos[vi*3],B.pos[vi*3+1],B.pos[vi*3+2]).normalize();const fi=faceOf(d),f=FACES[fi],dn=d.dot(f.n);const a=Math.atan(d.dot(f.u)/dn)*1.2732395,b=Math.atan(d.dot(f.v)/dn)*1.2732395;
  const x=clamp((a+1)*.5*GN,0,GN-1e-4),y=clamp((b+1)*.5*GN,0,GN-1e-4);const ci=x|0,cj=y|0,fx=x-ci,fy=y-cj;const k=fi*M*M+cj*M+ci;const wE=B.wE[vi];
  let ta,tb,tc,td;if(fx+fy<1){ta=1-fx-fy;tb=fx;tc=fy;td=0}else{ta=0;tb=1-fy;tc=1-fx;td=fx+fy-1}const wa=ta+((1-fx)*(1-fy)-ta)*wE,wb=tb+(fx*(1-fy)-tb)*wE,wc=tc+((1-fx)*fy-tc)*wE,wd=td+(fx*fy-td)*wE;
  for(let q=0;q<3;q++){B.ca[vi*3+q]=ca[k*3+q]*wa+ca[(k+1)*3+q]*wb+ca[(k+M)*3+q]*wc+ca[(k+M+1)*3+q]*wd;B.cb[vi*3+q]=cb[k*3+q]*wa+cb[(k+1)*3+q]*wb+cb[(k+M)*3+q]*wc+cb[(k+M+1)*3+q]*wd}}
 B.geo.attributes.color.needsUpdate=true;B.geo.attributes.aCol2.needsUpdate=true}
/* where the patch puts the ground, relative to the plain height (for things placed on it after it is built) */
function q2_at(cu,d){const cd=d.dot(cu.C);if(cd<.5)return -1;const x=d.dot(cu.E)/cd*R,y=d.dot(cu.N)/cd*R;if(Math.abs(x)>=cu.r||Math.abs(y)>=cu.r)return -1;
 const inv=s=>{const p=Q2GA/(1-Q2GA),q=-s/(cu.r*(1-Q2GA)),D=Math.sqrt(q*q/4+p*p*p/27);return Math.cbrt(-q/2+D)+Math.cbrt(-q/2-D)};
 const n=cu.n,fx=(inv(x)+1)*.5*n,fy=(inv(y)+1)*.5*n;const i=clamp(fx|0,0,n-1),j=clamp(fy|0,0,n-1);cu._fx=fx-i;cu._fy=fy-j;return j*(n+1)+i}
/* the river and road segments near a spot, and whether a point lies on one (for the ground cover) */
function q2_lines(sp,c,deg){if(!sp.q2Lines||!sp.q2Lines.length)return null;const L=sp.q2Lines.filter(l=>(!l.eras||l.eras.includes(ERA))&&(angDeg(l.a,c)<deg+1||angDeg(l.b,c)<deg+1)).map(l=>{const ab=l.b.clone().sub(l.a);
  const w=l.w*(l.lv!==undefined?.8:1.3)*D2R;return{a:l.a,ab,l2:ab.lengthSq()||1e-12,m:l.a.clone().add(l.b).multiplyScalar(.5),rr:Math.sqrt(ab.lengthSq())*.5+w,w2:w*w}});return L.length?L:null}
function q2_onLine(L,d){for(const l of L){const mx=d.x-l.m.x,my=d.y-l.m.y,mz=d.z-l.m.z;if(mx*mx+my*my+mz*mz>l.rr*l.rr)continue;
  let t=((d.x-l.a.x)*l.ab.x+(d.y-l.a.y)*l.ab.y+(d.z-l.a.z)*l.ab.z)/l.l2;t=t<0?0:t>1?1:t;const ex=d.x-l.a.x-l.ab.x*t,ey=d.y-l.a.y-l.ab.y*t,ez=d.z-l.a.z-l.ab.z*t;if(ex*ex+ey*ey+ez*ez<l.w2)return true}return false}
function q2dh(sp,la,lo){const P=sp.q2;if(!P||!P.cur)return 0;const cu=P.cur;const d=dirLL(la,lo,_q2d);const v=q2_at(cu,d);if(v<0)return 0;const B=cu.B,W=cu.n+1,fx=cu._fx,fy=cu._fy;
 return (B.dh[v]*(1-fx)+B.dh[v+1]*fx)*(1-fy)+(B.dh[v+W]*(1-fx)+B.dh[v+W+1]*fx)*fy}

/* ---------------- grass ---------------- */
/* one clump: four tapered blades, each bending a little; normals lean up so the blades are lit like the ground they stand on */
function q2_bladeGeo(){const pos=[],nrm=[],ag=[],idx=[],Rn=rnd(991);const NB=4;
 for(let b=0;b<NB;b++){const a=b/NB*6.283+Rn()*.9,r=.04+Rn()*.14,ox=Math.cos(a)*r,oz=Math.sin(a)*r,yaw=Rn()*6.283,hb=.55+Rn()*.45,wb=.03+Rn()*.022,lean=(Rn()-.35)*.6,rr=Rn();
  const cx=Math.cos(yaw),sz=Math.sin(yaw);const base=pos.length/3;const fnx=-sz*.42,fnz=cx*.42,nl=Math.hypot(fnx,1,fnz);
  for(const t of[0,.36,.7,1]){const w=t<1?wb*(1-t*.72):0;const l=lean*t*t*hb;const px=ox-sz*l,pz=oz+cx*l,py=hb*t*(1-.1*lean*lean*t);
   if(t<1){pos.push(px-cx*w,py,pz-sz*w,px+cx*w,py,pz+sz*w);ag.push(t,rr,t,rr);nrm.push(fnx/nl,1/nl,fnz/nl,fnx/nl,1/nl,fnz/nl)}else{pos.push(px,py,pz);ag.push(1,rr);nrm.push(fnx/nl,1/nl,fnz/nl)}}
  idx.push(base,base+1,base+2,base+1,base+3,base+2,base+2,base+3,base+4,base+3,base+5,base+4,base+4,base+5,base+6)}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(nrm,3));g.setAttribute('aG',new THREE.Float32BufferAttribute(ag,2));g.setIndex(idx);return g}
const Q2W={uGC:{value:V3(0,1,0)},uGR:{value:60}};
/* wind: slow gusts roll across the field, each blade flutters on top; the blade bends more toward its tip */
const Q2_WIND=`vec3 ip=instanceMatrix[3].xyz;float fd=1.-smoothstep(uGR*.7,uGR,distance(ip,uGC));
 vec3 wW=normalize(vec3(.8,.15,.58));float ph=dot(ip,wW)*.19-uT*1.6;float gust=sin(ph)*.5+.5;gust*=gust;gust+=.35*(sin(ph*2.7+1.3)*.5+.5)*(1.-gust);
 float fl=sin(uT*4.1+aG.y*31.+ip.x*.9+ip.z*.7)*.1;float bend=(.1+.62*gust+fl)*aG.x*aG.x;
 vec3 wl=(vec4(wW,0.)*instanceMatrix).xyz;wl.y=0.;wl=wl/max(length(wl),1e-3);
 transformed.y*=fd;transformed.xz*=mix(.3,1.,fd);transformed.xz+=wl.xz*bend*.55*fd;transformed.y-=bend*bend*.22*fd;`;
function q2_grassMesh(sp){const T0=Q2T[0];// lit per vertex (all the normals point up anyway): the blades stay cheap however many overlap
 const mat=new THREE.MeshLambertMaterial({color:'#ffffff',side:THREE.DoubleSide});mat.userData.envSet=1;
 mat.onBeforeCompile=sh=>{Object.assign(sh.uniforms,Q2W,{uT:GT,uSunW:Q2SUN,uSunC:Q2SUNC});
  sh.vertexShader='attribute vec2 aG;uniform float uT,uGR;uniform vec3 uGC;varying vec2 vG;varying vec3 vWP;\n'+sh.vertexShader
   .replace('#include <begin_vertex>','vec3 transformed=vec3(position);'+Q2_WIND+'vG=aG;')
   .replace('#include <project_vertex>','#include <project_vertex>\nvWP=(modelMatrix*instanceMatrix*vec4(transformed,1.)).xyz;');
  sh.fragmentShader='uniform vec3 uSunW,uSunC;varying vec2 vG;varying vec3 vWP;\n'+sh.fragmentShader
   .replace('( gl_FrontFacing ) ? vIndirectFront : vIndirectBack','vIndirectFront').replace('( gl_FrontFacing ) ? vLightFront : vLightBack','vLightFront')
   .replace('#include <color_fragment>',`#include <color_fragment>
 diffuseColor.rgb*=mix(.5,1.14,pow(vG.x,.85));diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*vec3(1.16,1.1,.68),smoothstep(.55,1.,vG.x)*step(.62,vG.y)*.55);`)
   .replace('#include <emissivemap_fragment>',`#include <emissivemap_fragment>
 {vec3 V=normalize(vWP-cameraPosition);totalEmissiveRadiance+=diffuseColor.rgb*uSunC*pow(max(dot(V,uSunW),0.),4.)*vG.x*.55;}`)};
 mat.customProgramCacheKey=()=>'q2grass';
 const im=new THREE.InstancedMesh(q2_bladeGeo(),mat,T0.grass);im.setColorAt(0,C('#ffffff'));im.count=0;im.frustumCulled=false;im.visible=false;im.receiveShadow=true;im.userData.shd=1;im.userData.noShadow=1;im.raycast=()=>{};
 sp.scene.add(im);return im}
/* a flower: a thin stem and a flat star of petals (the petals take the instance colour, the stem and the eye do not) */
function q2_flowerGeo(){const pos=[],col=[],ag=[],idx=[];const st=C('#5f8f3e'),ey=C('#f4d050'),pe=C('#ffffff');const add=(x,y,z,c,t,p)=>{pos.push(x,y,z);col.push(c.r,c.g,c.b);ag.push(t,p);return pos.length/3-1};
 const s0=add(-.015,0,0,st,0,0),s1=add(.015,0,0,st,0,0),s2=add(0,.5,0,st,.95,0);idx.push(s0,s1,s2);const s3=add(0,0,-.015,st,0,0),s4=add(0,0,.015,st,0,0);idx.push(s3,s4,s2);
 const ce=add(0,.53,0,ey,1,0);const K=10;const rim=[];for(let i=0;i<K;i++){const a=i/K*6.283,r=i%2?.07:.15;rim.push(add(Math.cos(a)*r,.5+(i%2?.01:-.012),Math.sin(a)*r,pe,1,1))}
 for(let i=0;i<K;i++)idx.push(ce,rim[(i+1)%K],rim[i]);
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.setAttribute('aG',new THREE.Float32BufferAttribute(ag,2));g.setIndex(idx);g.computeVertexNormals();
 const nr=g.attributes.normal;for(let i=0;i<nr.count;i++)nr.setXYZ(i,0,1,0);return g}
function q2_flowerMesh(sp){const mat=new THREE.MeshLambertMaterial({vertexColors:true,side:THREE.DoubleSide});mat.userData.envSet=1;
 mat.onBeforeCompile=sh=>{Object.assign(sh.uniforms,Q2W,{uT:GT});
  sh.vertexShader='attribute vec2 aG;uniform float uT,uGR;uniform vec3 uGC;\n'+sh.vertexShader
   .replace('#include <color_vertex>','vColor=color*mix(vec3(1.),instanceColor,aG.y);')
   .replace('#include <begin_vertex>','vec3 transformed=vec3(position);'+Q2_WIND);
  sh.fragmentShader=sh.fragmentShader.replace('( gl_FrontFacing ) ? vIndirectFront : vIndirectBack','vIndirectFront').replace('( gl_FrontFacing ) ? vLightFront : vLightBack','vLightFront')};
 mat.customProgramCacheKey=()=>'q2flw';
 const im=new THREE.InstancedMesh(q2_flowerGeo(),mat,Q2T[0].flw);im.setColorAt(0,C('#ffffff'));im.count=0;im.frustumCulled=false;im.visible=false;im.receiveShadow=true;im.userData.shd=1;im.userData.noShadow=1;im.raycast=()=>{};
 sp.scene.add(im);return im}
function q2_grassOff(P){if(P.grass)for(let k=0;k<2;k++){P.grass[k].visible=false;P.flw[k].visible=false}}
function q2_twin(sp,im){const t=new THREE.InstancedMesh(im.geometry,im.material,im.instanceMatrix.count);t.setColorAt(0,C('#ffffff'));t.count=0;t.frustumCulled=false;t.visible=false;t.receiveShadow=true;t.userData.shd=1;t.userData.noShadow=1;t.raycast=()=>{};sp.scene.add(t);return t}
/* where the blades stand: a lattice fixed to the planet (so moving the view does not reshuffle them), finest near the middle and
   twice as coarse in each ring further out; every point is kept or dropped by its own fixed dice roll against the grass weight */
const Q2GL=[{s:.36,r:.17},{s:.72,r:.36},{s:1.44,r:.7},{s:2.88,r:1}];
function q2_grassJob(J){const P=J.P,B=J.B;
 if(!J.gs){// ring radii follow the grass radius; the spacing is scaled so the expected count matches the budget
  const rs=Q2GL.map(L=>L.r*J.rg);let sum=0;for(let l=0;l<Q2GL.length;l++){const r0=l?rs[l-1]:0;sum+=Math.PI*(rs[l]*rs[l]-r0*r0)/(Q2GL[l].s*Q2GL[l].s)}
  const lam=clamp(Math.sqrt(sum*.62/Math.max(1,J.T.grass)),.55,3);
  const faces=[];for(let fi=0;fi<6;fi++)if(J.C.dot(FACES[fi].n)>.5)faces.push(fi);
  J.gs={lv:0,fq:0,faces,rs,lam,row:null,out:[],max:J.T.grass,fmax:J.T.flw};
  // nothing grows here at all (snow, sand, rock, an era without land plants): skip the lattice
  let any=0;for(let i=0;i<B.gw.length;i+=3)if(B.gw[i]>.02){any=1;break}if(!any)J.gs.lv=Q2GL.length}
 const S=J.gs;if(S.lv>=Q2GL.length)return true;const sL=Q2GL[S.lv].s*S.lam,rr=S.rs[S.lv],rp=S.lv?S.rs[S.lv-1]:0;
 if(!S.row){const fi=S.faces[S.fq],f=FACES[fi],dn=J.C.dot(f.n);const a=Math.atan(J.C.dot(f.u)/dn)*1.2732395,b=Math.atan(J.C.dot(f.v)/dn)*1.2732395;
  const step=sL/(R*Math.PI/4),ext=rr/(R*Math.PI/4)*1.2;S.row={fi,f,step,ia0:Math.floor((a-ext)/step),ia1:Math.ceil((a+ext)/step),ib:Math.floor((b-ext)/step),ib1:Math.ceil((b+ext)/step)}}
 const Rw=S.row,f=Rw.f,d=_q2d,out=S.out,W=J.n+1;let pts=0;
 for(;Rw.ib<=Rw.ib1&&pts<9000;Rw.ib++,pts+=Rw.ia1-Rw.ia0+1){const ib=Rw.ib;for(let ia=Rw.ia0;ia<=Rw.ia1;ia++){
   const sd=Rw.fi*13.7+S.lv*5.3;const a=(ia+q2h(ia*.0131,ib*.0173,sd)*.92)*Rw.step,b=(ib+q2h(ib*.0119+3.3,ia*.0147,sd)*.92)*Rw.step;if(a<-1||a>1||b<-1||b>1)continue;
   d.copy(f.n).addScaledVector(f.u,Math.tan(a*Math.PI/4)).addScaledVector(f.v,Math.tan(b*Math.PI/4)).normalize();if(faceOf(d)!==Rw.fi)continue;
   const dist=Math.acos(Math.min(1,d.dot(J.C)))*R;if(dist>rr||dist<rp*.8)continue;
   // each ring fades out at its outer edge while the next, coarser one fades in: a fixed dice roll per point decides
   const keep=(1-sm(rr*.8,rr,dist))*(S.lv?sm(rp*.8,rp,dist):1);if(q2h(ia*.071+1.3,ib*.053,sd+.7)>keep)continue;
   const v=q2_at(J,d);if(v<0)continue;const fx=J._fx,fy=J._fy;
   const gw=(B.gw[v]*(1-fx)+B.gw[v+1]*fx)*(1-fy)+(B.gw[v+W]*(1-fx)+B.gw[v+W+1]*fx)*fy;if(q2h(ia*.031,ib*.047+9.1,sd+2.2)>gw)continue;
   out.push(v,fx,fy,ia,ib,S.lv+Rw.fi*8)}}
 if(Rw.ib>Rw.ib1){S.row=null;S.fq++;if(S.fq>=S.faces.length){S.fq=0;S.lv++}}return false}
/* the blades and flowers written into the hidden set, a few thousand per frame */
const Q2PAL=['#f4e6a0','#e9a0c0','#a8c8f4','#ffffff','#f2b25a','#d8a8f0'].map(C);
function q2_grassFill(J){const P=J.P,B=J.B,S=J.gs,out=S.out,W=J.n+1,bk=1-P.ga;const im=P.grass[bk],fm=P.flw[bk],IM=im.instanceMatrix.array,IC=im.instanceColor.array,FM=fm.instanceMatrix.array,FC=fm.instanceColor.array;
 if(S.t===undefined){S.t=0;S.g=0;S.fc=0;S.cnt=out.length/6;S.step=Math.max(1,S.cnt/S.max)}
 const L=(arr,v,fx,fy,q,st)=>(arr[v*st+q]*(1-fx)+arr[(v+1)*st+q]*fx)*(1-fy)+(arr[(v+W)*st+q]*(1-fx)+arr[(v+W+1)*st+q]*fx)*fy;
 // visit the points in a scattered order, so a budget that runs out thins the whole field evenly instead of dropping its last rows
 if(S.P===undefined){let P=7919;const g=(a,b)=>b?g(b,a%b):a;while(g(P,Math.max(1,S.cnt))!==1)P+=2;S.P=P}
 let n=0;for(;S.t<S.cnt&&S.g<S.max&&n<2000;S.t+=S.step,n++){const k=((Math.floor(S.t)*S.P)%S.cnt)*6;const v=out[k],fx=out[k+1],fy=out[k+2],ia=out[k+3],ib=out[k+4],sd=out[k+5],lv=sd%8;
  // the point on the patch surface (bilinear over the small cell), its normal, and a frame turned by a fixed random yaw
  const px=L(B.pos,v,fx,fy,0,3),py=L(B.pos,v,fx,fy,1,3),pz=L(B.pos,v,fx,fy,2,3),pl=Math.hypot(px,py,pz);
  let ux=px/pl,uy=py/pl,uz=pz/pl;ux+=(L(B.nrm,v,fx,fy,0,3)-ux)*.3;uy+=(L(B.nrm,v,fx,fy,1,3)-uy)*.3;uz+=(L(B.nrm,v,fx,fy,2,3)-uz)*.3;const ul=Math.hypot(ux,uy,uz);ux/=ul;uy/=ul;uz/=ul;
  const r1=q2h(ia*.37,ib*.29,sd+.5),r2=q2h(ib*.23,ia*.41,sd+2.5),r3=q2h(ia*.17+ib*.11,sd,4.4);
  let ex=-uy*ux,ey=1-uy*uy,ez=-uy*uz;let el=Math.hypot(ex,ey,ez);if(el<1e-4){ex=1;ey=0;ez=0;el=1}ex/=el;ey/=el;ez/=el;const nx=ey*uz-ez*uy,ny=ez*ux-ex*uz,nz=ex*uy-ey*ux;
  const cy=Math.cos(r1*6.283),sy=Math.sin(r1*6.283);const ax=ex*cy+nx*sy,ay=ey*cy+ny*sy,az=ez*cy+nz*sy;const bx=ay*uz-az*uy,by=az*ux-ax*uz,bz=ax*uy-ay*ux;
  const bi=q2_bio(J,px*J.E.x+py*J.E.y+pz*J.E.z,px*J.N.x+py*J.N.y+pz*J.N.z);const tall=1+bi.tall*1.1;const sw=(.85+.45*r2)*(1+lv*.15),sh=(.36+.46*r3)*tall*(1+lv*.12);
  const o=S.g*16;IM[o]=ax*sw;IM[o+1]=ay*sw;IM[o+2]=az*sw;IM[o+3]=0;IM[o+4]=ux*sh;IM[o+5]=uy*sh;IM[o+6]=uz*sh;IM[o+7]=0;IM[o+8]=bx*sw;IM[o+9]=by*sw;IM[o+10]=bz*sw;IM[o+11]=0;IM[o+12]=px-ux*.04;IM[o+13]=py-uy*.04;IM[o+14]=pz-uz*.04;IM[o+15]=1;
  // the ground colour (with the biome's tint), each clump a little lighter or darker, warmer or cooler
  let cr=L(B.cc,v,fx,fy,0,3),cg=L(B.cc,v,fx,fy,1,3),cb=L(B.cc,v,fx,fy,2,3);if(bi.tc){cr*=bi.tc.r;cg*=bi.tc.g;cb*=bi.tc.b}const lk=1.06*(1+(r3-.5)*.2),wk=(r2-.5)*.08;
  IC[S.g*3]=cr*lk*(1+wk);IC[S.g*3+1]=cg*lk;IC[S.g*3+2]=cb*lk*(1-wk*1.5);S.g++;
  // now and then a flower among the blades
  if(S.fc<S.fmax&&bi.f>0&&lv<3&&r3*r1<bi.f*.9){const fh=(.6+.45*r2)*(1+bi.tall*.5),fs=.75;const q=S.fc*16;
   FM[q]=ax*fs;FM[q+1]=ay*fs;FM[q+2]=az*fs;FM[q+3]=0;FM[q+4]=ux*fh;FM[q+5]=uy*fh;FM[q+6]=uz*fh;FM[q+7]=0;FM[q+8]=bx*fs;FM[q+9]=by*fs;FM[q+10]=bz*fs;FM[q+11]=0;FM[q+12]=px;FM[q+13]=py;FM[q+14]=pz;FM[q+15]=1;
   const fcol=bi.fc&&r2<.6?(CVC.get(bi.fc)||(CVC.set(bi.fc,C(bi.fc)),CVC.get(bi.fc))):Q2PAL[(r1*Q2PAL.length*7|0)%Q2PAL.length];const fk=1+(r3-.5)*.1;FC[S.fc*3]=fcol.r*fk;FC[S.fc*3+1]=fcol.g*fk;FC[S.fc*3+2]=fcol.b*fk;S.fc++}}
 if(S.t<S.cnt&&S.g<S.max)return false;
 im.count=S.g;im.instanceMatrix.needsUpdate=true;im.instanceColor.needsUpdate=true;fm.count=S.fc;fm.instanceMatrix.needsUpdate=true;fm.instanceColor.needsUpdate=true;return true}

/* ---------------- trees: fuller, rounder near kits ---------------- */
/* a crown of lumpy blobs whose normals bend out from the crown's middle (so the light rolls round it like round foliage), shaded
   darker underneath and inside */
function q2_crown(blobs,cc,rc,seed){const gs=[];const v=V3(),nb=V3(),nc=V3();let yb=1e9,yt=-1e9;for(const b of blobs){yb=Math.min(yb,b[1]-b[3]);yt=Math.max(yt,b[1]+b[3])}
 blobs.forEach((b,bi)=>{const g=new THREE.IcosahedronGeometry(1,1);const P=g.attributes.position,N=g.attributes.normal,n=P.count,col=new Float32Array(n*3);
  for(let i=0;i<n;i++){v.set(P.getX(i),P.getY(i),P.getZ(i)).normalize();nb.copy(v);const k=1+(n3(v.x*1.7+bi*3.1+seed,v.y*1.7,v.z*1.7)-.5)*.42;
   v.multiplyScalar(b[3]*k);v.y*=b[4]||.86;v.x+=b[0];v.y+=b[1];v.z+=b[2];P.setXYZ(i,v.x,v.y,v.z);
   nc.set(v.x-cc[0],(v.y-cc[1])*1.15,v.z-cc[2]).normalize();nb.lerp(nc,.62).normalize();N.setXYZ(i,nb.x,nb.y,nb.z);
   const t=clamp((v.y-yb)/(yt-yb),0,1),out=clamp(Math.hypot(v.x-cc[0],v.y-cc[1],v.z-cc[2])/rc,0,1);const s=(.5+.5*Math.pow(t,.8))*(.72+.28*out)*(.94+.12*h3(bi,seed,1));col[i*3]=col[i*3+1]=col[i*3+2]=s}
  g.setAttribute('color',new THREE.BufferAttribute(col,3));if(g.attributes.uv)g.deleteAttribute('uv');gs.push(g)});
 return gs}
function q2_shade(g,y0,y1,k){const P=g.attributes.position,c=g.attributes.color;if(!c)return g;for(let i=0;i<P.count;i++){const r=c.getX(i),gg=c.getY(i),b=c.getZ(i);if(r<.85||gg<.85||b<.85)continue;const t=clamp((P.getY(i)-y0)/(y1-y0),0,1);const s=1-k*(1-t);c.setXYZ(i,r*s,gg*s,b*s)}c.needsUpdate=true;return g}
/* a conifer tier: a skirt of boughs whose tips droop, lighter at the tips than near the trunk */
function q2_tier2(r,h,y,K,seed){const pos=[],col=[],nrm=[];const top=[0,y+h,0];const tip=[],mid=[];
 for(let i=0;i<K;i++){const a=i/K*6.283+seed,jag=i%2?.8:1.06,rr=r*jag*(.92+.16*h3(i,seed,2));tip.push([Math.cos(a)*rr,y-(i%2?.02:.16)*h,Math.sin(a)*rr]);mid.push([Math.cos(a)*rr*.55,y+h*.42,Math.sin(a)*rr*.55])}
 const push=(p,s)=>{pos.push(p[0],p[1],p[2]);col.push(s,s,s);const nx=p[0],nz=p[2],l=Math.hypot(nx,nz)||1;const ny=.75;const L=Math.hypot(nx/l,ny,nz/l);nrm.push(nx/l/L,ny/L,nz/l/L)};
 for(let i=0;i<K;i++){const j=(i+1)%K;push(top,.95);push(mid[j],.82);push(mid[i],.82);push(mid[i],.82);push(mid[j],.82);push(tip[i],1);push(tip[i],1);push(mid[j],.82);push(tip[j],1);
  // the underside, darker
  push(tip[i],.5);push(tip[j],.5);push([0,y+h*.05,0],.38)}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(nrm,3));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));
 // the underside faces down
 const N=g.attributes.normal;for(let i=0;i<N.count;i++){if(i%12>=9)N.setXYZ(i,N.getX(i)*.4,-.9,N.getZ(i)*.4)}return g}
function q2_bark(g){const P=g.attributes.position,c=g.attributes.color;for(let i=0;i<P.count;i++){const s=.82+.3*clamp(P.getY(i)/4,0,1);c.setXYZ(i,c.getX(i)*s,c.getY(i)*s,c.getZ(i)*s)}return g}
function q2_treeKits(KITS,NEAR){try{
 const M=gs=>THREE.BufferGeometryUtils.mergeBufferGeometries(gs.map(g=>{g=g.index?g.toNonIndexed():g;if(g.attributes.uv)g.deleteAttribute('uv');return g}));
 const trunk=(parts)=>q2_bark(mergeColored(parts.map(([g,c,f])=>[f?tg(g,f):g,c])));
 // broadleaf: a short trunk with three limbs and a crown of nine lumps
 {const bl=[[0,4.7,0,1.45,.82]];for(let i=0;i<8;i++){const a=i*2.4+.3,up=i<5?0:1;const rr=up?.75:1.2;bl.push([Math.cos(a)*rr,4.15+up*1.05+(i%2)*.25,Math.sin(a)*rr,up?.85:.95+(i%3)*.08,.84])}
  const t=trunk([[kcy(.16,.32,3.4,8),'#5e4a36',{p:[0,1.7,0]}],[kcy(.06,.12,1.9,6),'#5e4a36',{p:[.55,3.2,.1],r:[0,0,-.8]}],[kcy(.05,.1,1.7,6),'#5e4a36',{p:[-.45,3.05,-.25],r:[.35,0,.85]}],[kcy(.05,.09,1.5,6),'#5e4a36',{p:[.05,3.3,.55],r:[.85,0,0]}],[kcy(.34,.42,.3,8),'#54412f',{p:[0,.12,0]}]]);
  NEAR.broad=M([t,...q2_crown(bl,[0,4.6,0],2.4,1)])}
 // conifer: six drooping tiers on a straight trunk
 {const P=[trunk([[kcy(.1,.26,2.6,8),'#4f3c2a',{p:[0,1.3,0]}]])];const tiers=[[1.95,1.5,1.6],[1.7,1.45,2.55],[1.45,1.4,3.45],[1.18,1.3,4.3],[.9,1.2,5.1],[.58,1.15,5.85]];
  tiers.forEach(([r,h,y],i)=>P.push(q2_tier2(r,h,y,i<4?14:10,i*.7)));const tipc=new THREE.ConeGeometry(.22,.8,6);tipc.translate(0,7.2,0);P.push(mergeColored([[tipc,'#ffffff']]));NEAR.conifer=M(P)}
 // palm: a curved ringed trunk, a crown of arching fronds
 {const P=[];const pts=[V3(0,0,0),V3(.35,2.4,0),V3(.9,4.9,.2)];const tb=ktube(pts,.17,12,7);const c=new Float32Array(tb.attributes.position.count*3);for(let i=0;i<c.length/3;i++){const y=tb.attributes.position.getY(i);const s=(Math.sin(y*7)>.6?.78:1)*(.85+.15*y/5);c[i*3]=.48*s;c[i*3+1]=.42*s;c[i*3+2]=.31*s}tb.setAttribute('color',new THREE.BufferAttribute(c,3));if(tb.attributes.uv)tb.deleteAttribute('uv');P.push(tb);
  for(let i=0;i<9;i++){const a=i/9*6.283+.2,dir=V3(Math.cos(a),0,Math.sin(a)),side=V3(-dir.z,0,dir.x);const pos=[],col=[];const top=V3(.9,4.95,.2);const L=2.3+(i%3)*.3,lift=.5+(i%2)*.3;
   for(let s=0;s<=6;s++){const t=s/6;const ctr=top.clone().addScaledVector(dir,t*L).add(V3(0,Math.sin(t*2.6)*lift-t*t*1.1,0));const w=Math.sin(Math.min(1,t*1.15)*Math.PI)*.42+.04;const fold=.12*w;
    pos.push(...ctr.clone().addScaledVector(side,-w).add(V3(0,-fold,0)).toArray(),...ctr.clone().add(V3(0,fold*.4,0)).toArray(),...ctr.clone().addScaledVector(side,w).add(V3(0,-fold,0)).toArray());const s1=.7+.3*t;col.push(s1*.9,s1*.9,s1*.9,s1,s1,s1,s1*.9,s1*.9,s1*.9)}
   const idx=[];for(let s=0;s<6;s++){const b=s*3;idx.push(b,b+3,b+1,b+1,b+3,b+4,b+1,b+4,b+2,b+2,b+4,b+5, b,b+1,b+3,b+1,b+4,b+3,b+1,b+2,b+4,b+2,b+5,b+4)}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.setIndex(idx);g.computeVertexNormals();
   const nr=g.attributes.normal;for(let k=0;k<nr.count;k++){nr.setXYZ(k,nr.getX(k)*.5,Math.abs(nr.getY(k))*.5+.6,nr.getZ(k)*.5)}P.push(g)}
  const nut=ki(.3,1);P.push(mergeColored([[tg(nut,{p:[.9,4.8,.2]}),'#6a5a3a']]));NEAR.palm=M(P)}
 // the far trees keep their shapes; only their crowns get the same darker underside
 q2_shade(KITS.broad,2.4,5.8,.42);q2_shade(KITS.conifer,1.5,7.4,.4);
}catch(e){console.warn('q2 trees',e)}}
// for the test scripts: window.__q2tier forces a quality step, __q2off turns the patch off, __q2Q freezes the detail switches
window.__q2={at:q2_at,dh:q2dh,T:Q2T,A:Q2A,Q:Q2Q};
