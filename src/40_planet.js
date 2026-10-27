/* ================================================================
   planets: one builder for every round world.
   terrain on a cube-sphere grid · procedural detail in the shader · living sea · air, sky, clouds · a turning sun
   ================================================================ */
const FACES=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]].map(f=>{const n=V3(...f),u=V3(f[1],f[2],f[0]),v=n.clone().cross(u);return{n,u,v}});
function gridDir(f,i,j,N,out){const a=(i/N)*2-1,b=(j/N)*2-1;return out.copy(f.n).addScaledVector(f.u,Math.tan(a*Math.PI/4)).addScaledVector(f.v,Math.tan(b*Math.PI/4)).normalize()}
function faceOf(d){const ax=Math.abs(d.x),ay=Math.abs(d.y),az=Math.abs(d.z);if(ax>=ay&&ax>=az)return d.x>0?0:1;if(ay>=az)return d.y>0?2:3;return d.z>0?4:5}
function buildGrid(N,hf,cf){const M=N+1,n=6*M*M,H=new Float32Array(n),P=new Float32Array(n*3),CY=cf?new Float32Array(n):null;const d=V3();
 FACES.forEach((f,fi)=>{for(let j=0;j<=N;j++)for(let i=0;i<=N;i++){gridDir(f,i,j,N,d);const k=fi*M*M+j*M+i;P[k*3]=d.x;P[k*3+1]=d.y;P[k*3+2]=d.z;const h=hf(d);H[k]=h;if(CY)CY[k]=cf(d,h)}});
 return{N,M,n,H,P,CY}}
function gridSample(G,arr,d){const fi=faceOf(d),f=FACES[fi];const dn=d.dot(f.n);const a=Math.atan(d.dot(f.u)/dn)*1.2732395,b=Math.atan(d.dot(f.v)/dn)*1.2732395;
 const x=clamp((a+1)*.5*G.N,0,G.N-1e-4),y=clamp((b+1)*.5*G.N,0,G.N-1e-4);const i=x|0,j=y|0,fx=x-i,fy=y-j;const k=fi*G.M*G.M+j*G.M+i;
 return (arr[k]*(1-fx)+arr[k+1]*fx)*(1-fy)+(arr[k+G.M]*(1-fx)+arr[k+G.M+1]*fx)*fy}
function sphereGeo(G){const{N,M,n,H,P}=G;const pos=new Float32Array(n*3);for(let k=0;k<n;k++){const r=R+H[k];pos[k*3]=P[k*3]*r;pos[k*3+1]=P[k*3+1]*r;pos[k*3+2]=P[k*3+2]*r}
 const idx=new Uint32Array(6*N*N*6);let q=0;
 for(let fi=0;fi<6;fi++){const base=fi*M*M;const A=V3(pos[base*3],pos[base*3+1],pos[base*3+2]),B=V3(pos[(base+1)*3],pos[(base+1)*3+1],pos[(base+1)*3+2]),Cc=V3(pos[(base+M)*3],pos[(base+M)*3+1],pos[(base+M)*3+2]);
  const flip=Cc.clone().sub(A).cross(B.clone().sub(A)).dot(A)<0;
  for(let j=0;j<N;j++)for(let i=0;i<N;i++){const a=base+j*M+i,b=a+1,c=a+M,d=c+1;if(flip){idx[q++]=a;idx[q++]=b;idx[q++]=c;idx[q++]=b;idx[q++]=d;idx[q++]=c}else{idx[q++]=a;idx[q++]=c;idx[q++]=b;idx[q++]=b;idx[q++]=c;idx[q++]=d}}}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setIndex(new THREE.BufferAttribute(idx,1));g.computeVertexNormals();
 // the six faces meet along seams: average the normals there so the light doesn't crease
 const nr=g.attributes.normal.array,map=new Map();
 for(let fi=0;fi<6;fi++)for(let j=0;j<=N;j++)for(let i=0;i<=N;i++){if(i>0&&i<N&&j>0&&j<N)continue;const k=fi*M*M+j*M+i;const key=Math.round(P[k*3]*2e4)+','+Math.round(P[k*3+1]*2e4)+','+Math.round(P[k*3+2]*2e4);let L=map.get(key);if(!L)map.set(key,L=[]);L.push(k)}
 for(const L of map.values()){if(L.length<2)continue;let x=0,y=0,z=0;for(const k of L){x+=nr[k*3];y+=nr[k*3+1];z+=nr[k*3+2]}const l=Math.hypot(x,y,z)||1;for(const k of L){nr[k*3]=x/l;nr[k*3+1]=y/l;nr[k*3+2]=z/l}}
 g.boundingSphere=new THREE.Sphere(V3(0,0,0),R+260);return g}

/* procedural surface detail for any MeshStandardMaterial (terrain, ice, rock) */
function detailMatBase(m,o){o=o||{};m.bumpMap=bumpDummy;m.bumpScale=o.bump===undefined?1:o.bump;
 const U={uMix:{value:0},uCanyon:{value:0},uHK:{value:1},uSnow:{value:o.snow===undefined?1e4:o.snow},uRock:{value:C(o.rock||'#6e6458')},uRockK:{value:o.rockK===undefined?1:o.rockK},uMott:{value:o.mott===undefined?1:o.mott},uFreq:{value:o.freq||1},uT:GT};
 m.userData.U=U;
 m.onBeforeCompile=sh=>{Object.assign(sh.uniforms,U);
  sh.vertexShader='attribute vec3 aCol2;\nattribute float aCanyon;\nuniform float uMix,uCanyon,uHK;\nvarying vec3 vOP;\nvarying vec3 vON;\n'+sh.vertexShader
   .replace('#include <color_vertex>',o.cross?'vColor=mix(color,aCol2,uMix);':'#include <color_vertex>')
   .replace('#include <begin_vertex>','vec3 transformed=vec3(position);'+(o.planet?'{float pl=length(position);transformed=position*((1000.0+(pl-1000.0)*uHK)/max(pl,1.0));}':'')+(o.canyon?'transformed-=normalize(position)*aCanyon*uCanyon;':'')+'vOP=transformed;vON=objectNormal;');
  sh.fragmentShader=(o.planet?'#define IS_PLANET\n':'')+'uniform float uSnow,uRockK,uMott,uFreq,uT;uniform vec3 uRock;\nvarying vec3 vOP;\nvarying vec3 vON;\n'+GLSL_NOISE+sh.fragmentShader
   .replace('#include <bumpmap_pars_fragment>',`uniform sampler2D bumpMap;uniform float bumpScale;
float hTer(vec3 p){p*=uFreq;float h=vn3(p*.33)*1.1+vn3(p*1.25)*.38+vn3(p*4.1)*.12;
#if defined(USE_COLOR)&&defined(IS_PLANET)
float du=smoothstep(.2,.34,vColor.r-vColor.b)*smoothstep(.5,.62,vColor.r);if(du>0.){float w=dot(p,vec3(.6,.25,.75))*.42+vn3(p*.06)*5.;h+=du*(abs(sin(w))*1.6+sin(w*3.1+vn3(p*.2)*3.)*.25);}
#endif
return h;}
vec2 dHdxy_fwd(){float d=length(vViewPosition);float k=(1.-smoothstep(50.,750.,d))*bumpScale;float h=hTer(vOP);return vec2(dFdx(h),dFdy(h))*k;}
vec3 perturbNormalArb(vec3 surf_pos,vec3 surf_norm,vec2 dHdxy,float faceDirection){vec3 vSigmaX=vec3(dFdx(surf_pos.x),dFdx(surf_pos.y),dFdx(surf_pos.z));vec3 vSigmaY=vec3(dFdy(surf_pos.x),dFdy(surf_pos.y),dFdy(surf_pos.z));vec3 vN=surf_norm;vec3 R1=cross(vSigmaY,vN);vec3 R2=cross(vN,vSigmaX);float fDet=dot(vSigmaX,R1)*faceDirection;vec3 vGrad=sign(fDet)*(dHdxy.x*R1+dHdxy.y*R2);return normalize(abs(fDet)*surf_norm-vGrad);}`)
   .replace('#include <color_fragment>',`#include <color_fragment>
 {vec3 rn=normalize(vOP);float vH=length(vOP)-1000.;float dd=length(vViewPosition);float nr=1.-smoothstep(120.,900.,dd);
  float n1=fb3(vOP*.035*uFreq),n2=vn3(vOP*.4*uFreq);
  diffuseColor.rgb*=1.+uMott*((n1-.5)*.34+nr*(n2-.5)*.16);
  ${o.planet?`float land=smoothstep(.8,2.6,vH);float slope=1.-dot(normalize(vON),rn);
  float rk=smoothstep(.16,.38,slope+(n2-.5)*.14)*land*uRockK;diffuseColor.rgb=mix(diffuseColor.rgb,uRock*(.75+.5*n2),rk);
  float wet=(1.-smoothstep(0.,2.2,vH))*smoothstep(-2.5,.2,vH);diffuseColor.rgb*=1.-wet*.32;
  float sn=smoothstep(uSnow-10.,uSnow+8.,vH+(n1-.5)*34.)*(1.-rk*.5);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.9,.94,.97),sn);
  {vec3 cq=rn*11.+vec3(uT*.011,uT*.004,uT*.007);float cs=smoothstep(.56,.74,fb3(cq))*(1.-smoothstep(500.,2200.,dd))*land;diffuseColor.rgb*=1.-cs*.24;}
  float cs=smoothstep(.5,.66,fb3(vOP*.0105+vec3(uT*.012,uT*.003,uT*.008)));diffuseColor.rgb*=1.-cs*.3*land*(1.-smoothstep(350.,1500.,dd));`:''}}`)};
 m.customProgramCacheKey=()=>'det'+(o.planet?1:0)+(o.cross?1:0)+(o.canyon?1:0);return m}

/* an equirect height texture so the sea knows how deep it is under every pixel */
function heightTex(G,W2,H2){const data=new Uint8Array(W2*H2*4);const d=V3();
 for(let j=0;j<H2;j++){const lat=((j+.5)/H2-.5)*180;for(let i=0;i<W2;i++){const lon=((i+.5)/W2-.5)*360;dirLL(lat,lon,d);const h=gridSample(G,G.H,d);const k=(j*W2+i)*4;
  data[k]=clamp((h+70)/90,0,1)*255;data[k+1]=G.CY?clamp(gridSample(G,G.CY,d)/40,0,1)*255:0;data[k+2]=0;data[k+3]=255}}
 const t=new THREE.DataTexture(data,W2,H2,THREE.RGBAFormat);t.wrapS=THREE.RepeatWrapping;t.magFilter=t.minFilter=THREE.LinearFilter;t.generateMipmaps=false;t.needsUpdate=true;return t}

const LL_GLSL=`vec2 llUV(vec3 p){return vec2(atan(p.x,p.z)/6.2831853+.5,asin(clamp(p.y,-1.,1.))/3.14159265+.5);}`;
function oceanMat(ht,o){return new THREE.ShaderMaterial({transparent:true,fog:true,depthWrite:false,
 uniforms:Object.assign(THREE.UniformsUtils.clone(THREE.UniformsLib.fog),{uHT:{value:ht},uT:GT,uCanyon:{value:0},uSun:{value:V3(1,0,0)},uMoon:{value:V3(0,1,0)},uDeep:{value:C(o.deep)},uShal:{value:C(o.shal)},uFoamC:{value:C(o.foam||'#eef6f4')},uSky:{value:C(o.sky||'#9cc8f0')},uSkyZ:{value:C('#3b78d0')},uSkyLive:{value:0},uWave:{value:o.wave||1}}),
 vertexShader:`varying vec3 vOP,vW;
#include <fog_pars_vertex>
void main(){vOP=position;vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;vec4 mvPosition=viewMatrix*w;gl_Position=projectionMatrix*mvPosition;
#include <fog_vertex>
}`,
 fragmentShader:`uniform sampler2D uHT;uniform float uT,uCanyon,uWave,uSkyLive;uniform vec3 uSun,uMoon,uDeep,uShal,uFoamC,uSky,uSkyZ;varying vec3 vOP,vW;
${GLSL_NOISE}${LL_GLSL}
#include <fog_pars_fragment>
void main(){vec3 p=normalize(vOP);vec4 t=texture2D(uHT,llUV(p));float h=t.r*90.-70.-t.g*40.*uCanyon;float depth=-h;if(depth<-1.2)discard;depth=max(depth,0.);
 vec3 V=normalize(cameraPosition-vW);float dist=length(cameraPosition-vW);float nk=(1.-smoothstep(300.,2600.,dist))*uWave;
 vec3 q=vOP*.05+vec3(uT*.21,uT*.05,uT*.16);float e=.35;
 vec3 g=vec3(vn3(q+vec3(e,0,0))-vn3(q-vec3(e,0,0)),vn3(q+vec3(0,e,0))-vn3(q-vec3(0,e,0)),vn3(q+vec3(0,0,e))-vn3(q-vec3(0,0,e)));
 vec3 q2=vOP*.19-vec3(uT*.33,uT*.1,uT*.27);g+=.5*vec3(vn3(q2+vec3(e,0,0))-vn3(q2-vec3(e,0,0)),vn3(q2+vec3(0,e,0))-vn3(q2-vec3(0,e,0)),vn3(q2+vec3(0,0,e))-vn3(q2-vec3(0,0,e)));
 vec3 q3=vOP*.9+vec3(uT*.7,-uT*.4,uT*.55);float n3k=1.-smoothstep(40.,420.,dist);g+=.28*n3k*vec3(vn3(q3+vec3(e,0,0))-vn3(q3-vec3(e,0,0)),vn3(q3+vec3(0,e,0))-vn3(q3-vec3(0,e,0)),vn3(q3+vec3(0,0,e))-vn3(q3-vec3(0,0,e)));
 vec3 N=normalize(p-(g-dot(g,p)*p)*(.42*nk+.08));
 float sunUp=dot(p,uSun);float ndl=max(dot(N,uSun),0.);float day=smoothstep(-.18,.22,sunUp);
 vec3 water=mix(uShal,uDeep,smoothstep(0.,34.,depth));
 vec3 col=water*(.06+.94*ndl*day)+water*.05;
 float fres=.03+.97*pow(1.-max(dot(N,V),0.),5.);
 float gold=smoothstep(.38,.02,sunUp)*smoothstep(-.16,.0,sunUp);
 // the sky seen in the water: horizon colour at grazing angles, zenith colour looking down, warmer on the sun's side
 vec3 Rf=reflect(-V,N);float re=dot(Rf,p);vec3 skyL=mix(uSky,uSkyZ,pow(smoothstep(-.05,.85,re),.5));vec3 skyD=mix(uSky,vec3(1.,.62,.36),gold*.55)*(.08+.92*day);
 vec3 sky=mix(skyD,skyL*mix(vec3(1.),vec3(1.,.7,.5),gold*pow(max(dot(Rf,uSun),0.)*.5+.5,3.)),uSkyLive);col=mix(col,sky,fres*mix(.55,.8,uSkyLive));
 // light through the near side of a wave
 col+=uShal*.18*pow(1.-max(dot(N,V),0.),3.)*day*(.4+.6*ndl);
 vec3 Hh=normalize(uSun+V);float shp=mix(1600.,650.,nk)*(1.-gold*.5);col+=mix(vec3(1.,.93,.78),vec3(1.,.55,.22),gold)*pow(max(dot(N,Hh),0.),shp)*mix(.5,1.1,nk)*(day+gold*.6);// (a softer glitter: the sun's path used to burn to a solid white disc)
 vec3 Hm=normalize(uMoon+V);{float md=max(dot(N,Hm),0.);float mup=step(0.,dot(p,uMoon));col+=vec3(.55,.75,1.)*(pow(md,160.)*.6+pow(md,28.)*.16)*(1.-day)*mup;col+=vec3(.7,.85,1.)*pow(md,600.)*1.4*(1.-day)*mup;}
 float fz=vn3(vOP*.33+vec3(0.,uT*.3,0.));float foam=(1.-smoothstep(.1,1.9,depth))*(.5+.5*sin(depth*5.-uT*1.5+fz*7.));
 foam=clamp(foam+(1.-smoothstep(0.,.5,depth))*.6,0.,1.)*(.4+.6*nk);
 col=mix(col,uFoamC*(.12+.88*day*max(ndl,.3)),foam*.85);
 float a=mix(.34,.94,smoothstep(0.,20.,depth));{float clr=1.-smoothstep(25.,240.,dist);a=mix(a,min(a,.5+.3*smoothstep(5.,60.,depth)),clr);}a=max(a,foam*.92);a*=smoothstep(-1.2,0.,-h+0.);// (shallows a little less see-through: a slope just under the surface read as a pale flat shape)
 gl_FragColor=vec4(col,a);
#include <tonemapping_fragment>
#include <encodings_fragment>
#include <fog_fragment>
}`})}

function atmMats(col){const U={uCol:{value:C(col)},uSun:{value:V3(1,0,0)},uK:{value:1}};
 const vs='varying vec3 vN,vW;void main(){vN=normalize(normalMatrix*normal);vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;vN=normalize(mat3(modelMatrix)*normal);}';
 const outer=new THREE.ShaderMaterial({uniforms:U,vertexShader:vs,side:THREE.BackSide,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
  fragmentShader:`uniform vec3 uCol,uSun;uniform float uK;varying vec3 vN,vW;void main(){vec3 V=normalize(cameraPosition-vW);vec3 n=normalize(vN);float rim=1.-abs(dot(n,V));
  vec3 pw=normalize(vW);float sd=dot(pw,uSun);float day=smoothstep(-.4,.45,sd);float i=pow(rim,2.4)*1.25;
  vec3 c=mix(uCol*.16,uCol,day)+vec3(1.,.55,.3)*pow(max(0.,1.-abs(sd+.05)*2.4),3.)*.18;
  gl_FragColor=vec4(c*i*uK,1.);
#include <tonemapping_fragment>
#include <encodings_fragment>
}`});
 const inner=new THREE.ShaderMaterial({uniforms:U,vertexShader:vs,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
  fragmentShader:`uniform vec3 uCol,uSun;uniform float uK;varying vec3 vN,vW;void main(){vec3 V=normalize(cameraPosition-vW);vec3 n=normalize(vN);float rim=1.-max(dot(n,V),0.);
  float day=smoothstep(-.3,.5,dot(normalize(vW),uSun));float i=pow(rim,3.2)*.95;gl_FragColor=vec4(uCol*i*day*uK,1.);
#include <tonemapping_fragment>
#include <encodings_fragment>
}`});
 return{U,outer,inner}}

function cloudMatBase(o){return new THREE.ShaderMaterial({transparent:true,depthWrite:false,fog:true,
 uniforms:Object.assign(THREE.UniformsUtils.clone(THREE.UniformsLib.fog),{uT:GT,uSun:{value:V3(1,0,0)},uA:{value:1},uCov:{value:o.cov===undefined?.52:o.cov},uCol:{value:C(o.col||'#ffffff')},uSeed:{value:o.seed||0}}),
 vertexShader:`varying vec3 vOP,vW;
#include <fog_pars_vertex>
void main(){vOP=position;vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;vec4 mvPosition=viewMatrix*w;gl_Position=projectionMatrix*mvPosition;
#include <fog_vertex>
}`,
 fragmentShader:`uniform float uT,uA,uCov,uSeed;uniform vec3 uSun,uCol;varying vec3 vOP,vW;
${GLSL_NOISE}
#include <fog_pars_fragment>
float fb2(vec3 p){return vn3(p)*.667+vn3(p*2.03+vec3(1.7,9.2,3.1))*.333;}
vec3 rotA(vec3 v,vec3 k,float a){float c=cos(a),s=sin(a);return v*c+cross(k,v)*s+k*dot(k,v)*(1.-c);}
void main(){vec3 p=normalize(vOP);
 // a few slow cyclones twist the field into spiral arms
 vec3 c1=normalize(vec3(.55,.62,.2+uSeed*.1)),c2=normalize(vec3(-.4,-.58,.6)),c3=normalize(vec3(-.7,.48,-.5));
 float d1=distance(p,c1),d2=distance(p,c2),d3=distance(p,c3);vec3 q=p;
 q=rotA(q,c1,(1.-smoothstep(0.,.42,d1))*3.);q=rotA(q,c2,-(1.-smoothstep(0.,.36,d2))*2.6);q=rotA(q,c3,(1.-smoothstep(0.,.3,d3))*2.2);
 vec3 b=q*vec3(3.,3.6,3.)+vec3(uT*.0035+uSeed,uSeed*.7,uT*.0026);
 vec3 w=vec3(fb2(b*1.3),fb2(b*1.3+vec3(5.2,1.3,2.8)),fb2(b*1.3+vec3(9.1,4.7,7.3)))-.5;
 vec3 bb=b+w*.85;
 float n=fb3(bb)*.66+fb3(bb*2.6+w*1.4+vec3(4.1))*.26+vn3(bb*9.)*.08;
 // climate bands: a wet equator, dry subtropics, stormy middle latitudes
 float lat=p.y,al=abs(lat);n+=.09*exp(-lat*lat/.006)-.07*exp(-(al-.45)*(al-.45)/.02)+.05*exp(-(al-.78)*(al-.78)/.025)+.05*(exp(-d1*d1/.03)+exp(-d2*d2/.025));
 float a=smoothstep(uCov,uCov+.075,n);if(a<.01)discard;
 float th=smoothstep(uCov,uCov+.28,n);
 float sd=dot(p,uSun);float l=smoothstep(-.22,.3,sd);
 vec3 thin=uCol*vec3(.6,.65,.74),thick=uCol*.97;vec3 c=mix(thin,thick,th)*(.1+.9*l)+vec3(.03,.04,.07)*(1.-l);
 c=mix(c,vec3(1.,.62,.42)*(.4+.6*th),pow(max(0.,1.-abs(sd)*3.),2.)*.5*l);
 gl_FragColor=vec4(c,a*uA*(.5+.5*th)*.95*(.3+.7*l));
#include <tonemapping_fragment>
#include <encodings_fragment>
#include <fog_fragment>
}`})}

function skyMat(){return new THREE.ShaderMaterial({depthWrite:false,depthTest:false,side:THREE.BackSide,fog:false,
 uniforms:{uSun:{value:V3(1,0,0)},uUp:{value:V3(0,1,0)},uZen:{value:C('#3b78d0')},uHor:{value:C('#a8cff0')},uSunC:{value:C('#fff2d8')},uA:{value:1},uDip:{value:0}},
 vertexShader:'varying vec3 vD;void main(){vD=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 // each world keeps its own palette (zenith and horizon, already mixed for day, dusk and night); on top of it the light
 // behaves like air: a bright hazy band at the horizon, sky brighter towards the sun and a halo round it, at sunrise and
 // sunset an orange glow on the sun's side and a pink band with the earth's blue shadow under it on the far side
 fragmentShader:`uniform vec3 uSun,uUp,uZen,uHor,uSunC;uniform float uA,uDip;varying vec3 vD;void main(){vec3 d=normalize(vD);float e=(dot(d,uUp)+uDip)/(1.+uDip);
 float mu=dot(d,uSun),se=dot(uUp,uSun);float ep=max(e,0.);
 vec3 c=mix(uHor,uZen,pow(smoothstep(-.02,.95,e),.48));
 float hz=exp(-ep*8.);c=mix(c,mix(uHor,vec3(dot(uHor,vec3(.333))),.3)*1.1,hz*.32);
 c*=.9+.2*mu*mu;
 float low=smoothstep(.32,.0,se)*smoothstep(-.2,-.03,se);float side=pow(mu*.5+.5,1.8);float anti=pow(max(-mu,0.),1.5);
 // (the warm band reaches well round the horizon, a fainter amber all the way round, and the zenith deepens: a low sun used to leave the sky away from it a flat grey)
 c=mix(c,c*.55+vec3(1.,.48,.2)*.78,low*hz*side*.92);c=mix(c,vec3(.95,.62,.4)*(.6+.4*dot(c,vec3(.33))),low*exp(-ep*5.)*.22);c*=1.-low*.14*smoothstep(.15,.7,e);
 c+=vec3(.42,.2,.3)*low*anti*exp(-abs(e-.07)*16.)*.55;
 c*=1.-low*anti*exp(-ep*28.)*.28;
 float m=max(mu,0.);float dayS=.35+.65*smoothstep(-.12,.2,se);
 c+=uSunC*(pow(m,6.)*.22+pow(m,48.)*.42+pow(m,700.)*2.2)*dayS*mix(vec3(1.),vec3(1.,.7,.45),low);
 c=mix(c,uHor*.5,smoothstep(.0,-.3,e));
 c+=(fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453)-.5)/255.;
 gl_FragColor=vec4(c*uA,1.);
#include <tonemapping_fragment>
#include <encodings_fragment>
}`})}
/* lights that only show on the night side */
function nightPoints(pts,col,size,op){const g=new THREE.BufferGeometry(),a=new Float32Array(pts.length*3),s=new Float32Array(pts.length);pts.forEach((p,i)=>{a[i*3]=p.x;a[i*3+1]=p.y;a[i*3+2]=p.z;s[i]=Math.random()*100});
 g.setAttribute('position',new THREE.BufferAttribute(a,3));g.setAttribute('aSeed',new THREE.BufferAttribute(s,1));g.computeBoundingSphere();
 const m=new THREE.ShaderMaterial({uniforms:{uT:GT,uScale:PSCALE,uSun:{value:V3(1,0,0)},uSize:{value:size||1},uCol:{value:C(col)},uOp:{value:op===undefined?1:op},uDay:{value:.25},uTex:{value:dotTex}},
  vertexShader:`attribute float aSeed;uniform float uT,uSize,uScale,uDay;uniform vec3 uSun;varying float vA;void main(){float nt=smoothstep(.12,-.2,dot(normalize(position),uSun));vA=mix(uDay,1.,nt)*(.75+.25*sin(uT*(1.+fract(aSeed)*2.)+aSeed));
  vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=max(1.,uSize*uScale/-mv.z*(.6+.8*fract(aSeed*7.3)));gl_Position=projectionMatrix*mv;}`,
  fragmentShader:'uniform vec3 uCol;uniform float uOp;uniform sampler2D uTex;varying float vA;void main(){vec4 t=texture2D(uTex,gl_PointCoord);gl_FragColor=vec4(uCol,t.a*vA*uOp);}',
  transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
 const p=new THREE.Points(g,m);p.renderOrder=2;p.userData.night=m;return p}

/* image-based light: a blurred gradient world so metal has something to reflect */
function makeEnv(top,mid,bot,blobs){const T=C(top),Mi=C(mid),B=C(bot),c=new THREE.Color(),N=32;const dirs=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
 const bl=(blobs||[]).map(([d,col,s])=>({d:V3(...d).normalize(),c:C(col),s:s||1.4}));
 const faces=dirs.map((n,fi)=>{const cv=document.createElement('canvas');cv.width=cv.height=N;const x=cv.getContext('2d');const im=x.createImageData(N,N);
  for(let j=0;j<N;j++)for(let i=0;i<N;i++){const u=(i+.5)/N*2-1,v=(j+.5)/N*2-1;let d;
   switch(fi){case 0:d=V3(1,-v,-u);break;case 1:d=V3(-1,-v,u);break;case 2:d=V3(u,1,v);break;case 3:d=V3(u,-1,-v);break;case 4:d=V3(u,-v,1);break;default:d=V3(-u,-v,-1)}d.normalize();
   const h=d.y;if(h>0)c.copy(Mi).lerp(T,Math.pow(h,.55));else c.copy(Mi).lerp(B,Math.pow(-h,.35));for(const b of bl){const k=Math.pow(Math.max(0,d.dot(b.d)),8)*b.s;c.r+=b.c.r*k;c.g+=b.c.g*k;c.b+=b.c.b*k}
   const k=(j*N+i)*4;im.data[k]=Math.min(255,c.r*255);im.data[k+1]=Math.min(255,c.g*255);im.data[k+2]=Math.min(255,c.b*255);im.data[k+3]=255}
  x.putImageData(im,0,0);return cv});
 const t=new THREE.CubeTexture(faces);t.needsUpdate=true;return t}
/* after a space is built: give every standard material the environment, metals more of it */
function envAll(sc,k,km){sc.traverse(o=>{const ms=o.material?(Array.isArray(o.material)?o.material:[o.material]):[];for(const m of ms){if(m.isMeshStandardMaterial&&m.envMapIntensity===1&&!m.userData.envSet){m.envMapIntensity=m.metalness>.35?(km||1.1):(k||.35);m.userData.envSet=1}}})}
/* towers with windows that light up at dusk */
function towerMatBase(o){o=Object.assign({},o||{});const wc=o.win||'#ffd27a';delete o.win;const m=VC(Object.assign({roughness:.45,metalness:.5},o));const U={uNight:{value:0},uWin:{value:C(wc)}};m.userData.U=U;
 m.onBeforeCompile=sh=>{Object.assign(sh.uniforms,U);sh.vertexShader='varying vec3 vWP;varying vec3 vWN;\n'+sh.vertexShader.replace('#include <worldpos_vertex>','#include <worldpos_vertex>\n#ifdef USE_INSTANCING\nvWP=(modelMatrix*instanceMatrix*vec4(transformed,1.)).xyz;vWN=normalize(mat3(modelMatrix*instanceMatrix)*objectNormal);\n#else\nvWP=(modelMatrix*vec4(transformed,1.)).xyz;vWN=normalize(mat3(modelMatrix)*objectNormal);\n#endif');
  sh.fragmentShader='uniform float uNight;uniform vec3 uWin;varying vec3 vWP;varying vec3 vWN;\n'+sh.fragmentShader.replace('#include <emissivemap_fragment>',`#include <emissivemap_fragment>
 {vec3 up=normalize(vWP);float side=1.-abs(dot(normalize(vWN),up));vec3 q=vWP*1.25;vec3 cell=floor(q);vec3 f=fract(q);float h=fract(sin(dot(cell,vec3(12.9898,78.233,37.719)))*43758.5453);
  vec3 an=abs(normalize(vWN));float fx=an.x>an.z?f.z:f.x;float win=step(.36,fx)*step(fx,.64)*step(.42,f.y)*step(f.y,.72);win*=step(.64,h)*smoothstep(.8,.95,side);
  totalEmissiveRadiance+=uWin*win*(.08+.75*uNight)*(.55+.45*h);}`)};
 m.customProgramCacheKey=()=>'tower';return m}
/* ---------------- build-time helpers (BSP = the planet being built) ---------------- */
let BSP=null;
const _up=V3(),_fw=V3(),_sd=V3(),_m4=new THREE.Matrix4(),_no=V3();
function frameLL(sp,lat,lon,alt,heading,o,ground=true){dirLL(lat,lon,_up);_no.set(0,1,0).addScaledVector(_up,-_up.y);if(_no.lengthSq()<1e-6)_no.set(1,0,0);_no.normalize();
 const east=_no.clone().cross(_up).negate();_fw.copy(_no).multiplyScalar(Math.cos(heading)).addScaledVector(east,Math.sin(heading)).normalize();_sd.copy(_fw).cross(_up);
 _m4.makeBasis(_fw,_up,_sd);o.quaternion.setFromRotationMatrix(_m4);o.position.copy(_up).multiplyScalar(R+(ground?sp.gh(lat,lon):0)+alt);return o}
function fr(lat,lon,alt,heading,o,ground){return frameLL(BSP,lat,lon,alt,heading||0,o,ground)}
function scatter(n,lat,lon,r,seed,test){const Rn=rnd(seed),out=[];let k=0;while(out.length<n&&k<n*12){k++;const a=Rn()*Math.PI*2,d=Math.sqrt(Rn())*r;const la=lat+Math.cos(a)*d,lo=lon+Math.sin(a)*d/Math.cos(lat*D2R);const h=BSP.gh(la,lo);if(!test||test(la,lo,h))out.push([la,lo,h,Rn()])}return out}
const onLand=(la,lo,h)=>h>1.6, inSea=(la,lo,h)=>h<=.3;
function addE(o,eras,noCarry){return addTo(BSP,o,eras,noCarry)}
/* instanced placement with our own culling (r128 culls instanced meshes by the base geometry only) */
function instBase(geo,mat,pts,setter,eras,opt){opt=opt||{};const n=Math.max(1,pts.length);const im=new THREE.InstancedMesh(geo,mat,n);const o=new THREE.Object3D();const c=V3();
 pts.forEach((p,i)=>{o.position.set(0,0,0);o.quaternion.identity();o.scale.set(1,1,1);setter(o,p,i);o.updateMatrix();im.setMatrixAt(i,o.matrix);c.add(o.position);if(opt.tint){const t=opt.tint(p,i);if(t)im.setColorAt(i,t)}});
 if(opt.tint&&!im.instanceColor)im.setColorAt(0,C('#ffffff'));if(!pts.length)im.count=0;im.frustumCulled=false;c.multiplyScalar(1/n);let r=0;const v=V3();for(let i=0;i<pts.length;i++){im.getMatrixAt(i,_m4);v.setFromMatrixPosition(_m4);r=Math.max(r,v.distanceTo(c))}
 if(im.instanceColor)im.instanceColor.needsUpdate=true;
 const cu={o:im,c,r:r+(opt.pad||20),far:opt.far||2600};lodPrep(cu,geo,pts.length);BSP.culls.push(cu);return addE(im,eras,opt.noCarry)}
/* a far stand of a detailed model (a tree of a thousand triangles, hundreds of times over): once the whole stand is so far
   that one copy is about a dozen pixels tall, it is drawn with a coarse copy of the same shape, made once per geometry by
   merging the vertices that fall in the same cell of an 8×8×8 grid over its box */
const _lodG=new WeakMap();
function lodPrep(cu,geo,n){const ix=geo.index,pa=geo.attributes.position;if(!pa||n<20)return;const tris=(ix?ix.count:pa.count)/3;if(tris<300)return;
 if(!geo.boundingSphere)geo.computeBoundingSphere();cu.hi=geo;cu.gr=geo.boundingSphere.radius;cu.lodOn=false}
function lodGeo(geo){let g=_lodG.get(geo);if(g!==undefined)return g;g=null;try{g=simplifyGeo(geo,8)}catch(e){}_lodG.set(geo,g);return g}
function simplifyGeo(geo,G){const pa=geo.attributes.position,N=pa.count,ix=geo.index;if(!geo.boundingBox)geo.computeBoundingBox();const bb=geo.boundingBox;
 const sz=Math.max(bb.max.x-bb.min.x,bb.max.y-bb.min.y,bb.max.z-bb.min.z)/G||1;const names=Object.keys(geo.attributes).filter(k=>k!=='normal');
 const map=new Int32Array(N),keys=new Map();let nc=0;
 for(let i=0;i<N;i++){const k=Math.floor((pa.getX(i)-bb.min.x)/sz)+','+Math.floor((pa.getY(i)-bb.min.y)/sz)+','+Math.floor((pa.getZ(i)-bb.min.z)/sz);let c=keys.get(k);if(c===undefined){c=nc++;keys.set(k,c)}map[i]=c}
 const cnt=new Float32Array(nc);for(let i=0;i<N;i++)cnt[map[i]]++;
 const out=new THREE.BufferGeometry();
 for(const nm of names){const a=geo.attributes[nm],s2=a.itemSize,acc=new Float32Array(nc*s2);for(let i=0;i<N;i++){const c=map[i];for(let j=0;j<s2;j++)acc[c*s2+j]+=a.getComponent?a.getComponent(i,j):a.array[i*s2+j]}
  for(let c=0;c<nc;c++)for(let j=0;j<s2;j++)acc[c*s2+j]/=cnt[c];out.setAttribute(nm,new THREE.BufferAttribute(acc,s2,a.normalized))}
 const T=ix?ix.count:N,seen=new Set(),idx=[];for(let t=0;t<T;t+=3){const a=map[ix?ix.getX(t):t],b=map[ix?ix.getX(t+1):t+1],c=map[ix?ix.getX(t+2):t+2];if(a===b||b===c||a===c)continue;
  const lo=Math.min(a,b,c),hi=Math.max(a,b,c),k=lo*nc*nc+(a+b+c-lo-hi)*nc+hi;if(seen.has(k))continue;seen.add(k);idx.push(a,b,c)}
 out.setIndex(idx);out.computeVertexNormals();out.computeBoundingSphere();out.boundingSphere.copy(geo.boundingSphere);return idx.length/3<T/3*.8?out:null}
function cull(o,c,r,far){BSP.culls.push({o,c:c||o.position,r:r||40,far:far||2600})}
function px(id,pos,r,extra){return prox(BSP,id,pos,r,extra)}
/* merged multi-part models with vertex colors: one draw per kind */
/* parts are copied before they are moved, so a shared cached shape (sgeo) is never bent for everyone else */
function G(parts){return mergeColored(parts.map(([g,c,f])=>[f?tg(g.clone(),f):g,c]))}
const VC=(o)=>new THREE.MeshStandardMaterial(Object.assign({vertexColors:true,roughness:.85},o||{}));
function swayMatBase(o,k){const m=VC(o);const U={uT:GT,uSw:{value:k||.02}};m.onBeforeCompile=sh=>{Object.assign(sh.uniforms,U);sh.vertexShader='uniform float uT,uSw;\n'+sh.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
#ifdef USE_INSTANCING
vec3 ip=instanceMatrix[3].xyz;
#else
vec3 ip=vec3(0.);
#endif
float sw=sin(uT*1.6+ip.x*.11+ip.z*.13)*.6+sin(uT*2.7+ip.y*.17)*.3+sin(uT*5.3+ip.x*.7+position.y*1.3)*.08;float hy=max(position.y,0.);transformed.x+=sw*uSw*hy*hy;transformed.z+=sw*uSw*.6*hy*hy;`)
 .replace('#include <worldpos_vertex>','#include <worldpos_vertex>\n#ifdef USE_INSTANCING\nvLP=(modelMatrix*instanceMatrix*vec4(transformed,1.)).xyz;vLN=normalize(mat3(modelMatrix*instanceMatrix)*objectNormal);\n#else\nvLP=(modelMatrix*vec4(transformed,1.)).xyz;vLN=normalize(mat3(modelMatrix)*objectNormal);\n#endif');
 sh.vertexShader='varying vec3 vLP,vLN;\n'+sh.vertexShader;
 sh.fragmentShader='varying vec3 vLP,vLN;\n'+sh.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
 {vec3 up=normalize(vLP);float ny=dot(normalize(vLN),up);float sum=diffuseColor.r+diffuseColor.g+diffuseColor.b+.001;float leaf=smoothstep(.36,.41,diffuseColor.g/sum);
  vec3 q=floor(vLP*1.4);float n=fract(sin(dot(q,vec3(12.9898,78.233,37.719)))*43758.5453);vec3 q2=floor(vLP*.18);float n2=fract(sin(dot(q2,vec3(39.3468,11.135,83.155)))*43758.5453);
  float k=mix(.58,1.16,smoothstep(-.55,.85,ny))*(.86+.28*n)*(.92+.16*n2);diffuseColor.rgb*=mix(1.,k,leaf);
  diffuseColor.rgb+=leaf*smoothstep(.5,1.,ny)*vec3(.04,.05,0.)*(.6+.8*n);diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*vec3(1.12,1.,.72),leaf*smoothstep(.82,.98,n2)*.5);}`)};m.customProgramCacheKey=()=>'sway2';return m}

/* the sun's shadow box sits over the spot you look at, sized to how high you are; up high, at night, or when the
   machine is slow it is parked out in space (an empty box: nothing is shadowed, and nothing has to rebuild its shader) */
function shadowFollowBase(sp,sun,sdot){const c=sun.shadow.camera,want=SHD.on&&CUR===sp&&rig.alt<SHD.max&&sdot>-.1;
 if(want){const h=clamp(rig.alt*1.5,18,900);if(Math.abs(c.right-h)>h*.1){c.left=-h;c.right=h;c.top=h;c.bottom=-h;c.near=h*.5;c.far=h*10;c.updateProjectionMatrix();sun.shadow.normalBias=h*2/SHD.ms*1.4}if(sun.shadow.mapSize.x!==SHD.ms){sun.shadow.mapSize.set(SHD.ms,SHD.ms);if(sun.shadow.map){sun.shadow.map.dispose();sun.shadow.map=null}}
  sun.target.position.copy(S_);sun.position.copy(S_).addScaledVector(sp.sunDir,h*5);sun.userData.pk=false;if(++SHD.f%(SHD.every||(SHD.ms>1024?2:3))===0||busy||tw)renderer.shadowMap.needsUpdate=true}
 else if(!sun.userData.pk){sun.userData.pk=true;sun.target.position.copy(sp.sunDir).multiplyScalar(40000);sun.position.copy(sun.target.position).addScaledVector(sp.sunDir,600);renderer.shadowMap.needsUpdate=true}}
/* ---------------- the builder ---------------- */
function makePlanetBase(id,cfg){const sc=new THREE.Scene();const sp=newSpace(id,'planet',sc);BSP=sp;sp.culls=[];sp.cfg=cfg;sp.R=R;
 // light
 const sun=new THREE.DirectionalLight(0xfff0d8,cfg.sunI||1.08);sc.add(sun);sc.add(sun.target);sun.castShadow=true;sun.shadow.mapSize.set(SHD.ms,SHD.ms);sun.shadow.bias=-.0003;
 const moonL=new THREE.DirectionalLight(0x8fb4ff,.0);sc.add(moonL);sc.add(moonL.target);
 const hemi=new THREE.HemisphereLight(cfg.hemiSky||0xa8c8ff,cfg.hemiGnd||0x2c2418,.2);sc.environment=makeEnv(cfg.envTop||'#7aa4d8',cfg.envMid||'#b8c8d4',cfg.envBot||'#3a4034');sp.hemi=hemi;sp.sunL=sun;sc.add(hemi);
 sp.stars=starfield(sc,5200,40000,1.7,1);sp.stars.renderOrder=-12;sp.stars.material.fog=false;
 const sky=new THREE.Mesh(new THREE.SphereGeometry(9000,32,16),skyMat());sky.renderOrder=-10;sky.frustumCulled=false;sc.add(sky);
 const sunS=glowSprite('#fff4e0',2600,1);sunS.material.fog=false;sc.add(sunS);const sunC=glowSprite('#ffffff',700,1);sunC.material.fog=false;sc.add(sunC);
 sc.fog=new THREE.Fog(0xa8cff0,1e6,2e6);
 // ground
 const N=cfg.N||150;const t0=performance.now();const Gd=buildGrid(N,cfg.height,cfg.canyon);sp.G=Gd;
 const geo=sphereGeo(Gd);const sets=cfg.colors(Gd);sp.sets=sets;
 const ckey=cfg.colorKey?cfg.colorKey(ERA):Object.keys(sets)[0];sp.ckey=ckey;
 geo.setAttribute('color',new THREE.BufferAttribute(new Float32Array(sets[ckey]),3));geo.setAttribute('aCol2',new THREE.BufferAttribute(new Float32Array(sets[ckey]),3));
 if(Gd.CY)geo.setAttribute('aCanyon',new THREE.BufferAttribute(Gd.CY,1));
 const tm=detailMat(new THREE.MeshStandardMaterial({vertexColors:true,roughness:cfg.rough||.93,metalness:cfg.metal||0}),{planet:1,cross:1,canyon:!!Gd.CY,rock:cfg.rock,snow:1e4,bump:cfg.bump===undefined?1:cfg.bump,mott:cfg.mott,rockK:cfg.rockK});
 const terr=new THREE.Mesh(geo,tm);sc.add(terr);sp.terr=terr;sp.TU=tm.userData.U;
 // picking and line-of-sight tests see the ground as drawn: carved canyons and the far-away height squeeze included
 {const tg=new THREE.BufferGeometry();tg.setIndex(geo.index);const tpa=new THREE.BufferAttribute(new Float32Array(geo.attributes.position.array),3);tg.setAttribute('position',tpa);const tpm=new THREE.Mesh(tg,tm);let kc=-1,kh=-1;let hMax=0;for(let k=0;k<Gd.n;k++)if(Gd.H[k]>hMax)hMax=Gd.H[k];const _tmI=new THREE.Matrix4(),_tRay=new THREE.Ray(),_tq=new THREE.Vector3();
  terr.raycast=function(rc,out){const U=sp.TU,c=Gd.CY?U.uCanyon.value:0,hk=U.uHK.value;const syncTri=()=>{if(Math.abs(c-kc)>.01||Math.abs(hk-kh)>.02){kc=c;kh=hk;const A=tpa.array,{P,H,CY}=Gd;for(let k=0;k<Gd.n;k++){const r=R+H[k]*hk-(CY?CY[k]*c:0);A[k*3]=P[k*3]*r;A[k*3+1]=P[k*3+1]*r;A[k*3+2]=P[k*3+2]*r}tpa.needsUpdate=true;tg.computeBoundingSphere();tg.boundingBox=null}};
   // march the height field instead of testing all 600k triangles (each test cost ~30ms)
   if(!window.__terrTri){_tmI.copy(this.matrixWorld).invert();_tRay.copy(rc.ray).applyMatrix4(_tmI);const o=_tRay.origin,d=_tRay.direction;
    const Rm=R+hMax*hk+2,B=o.dot(d),C=o.lengthSq()-Rm*Rm,D=B*B-C;if(D<0)return;const sq=Math.sqrt(D);let t0=Math.max(rc.near,-B-sq),t1=Math.min(rc.far,-B+sq);if(!(t1>t0))return;
    const f=t=>{_tq.copy(o).addScaledVector(d,t);const L=_tq.length();_tq.multiplyScalar(1/L);let h=gridSample(Gd,Gd.H,_tq)*hk;if(Gd.CY&&c>0)h-=gridSample(Gd,Gd.CY,_tq)*c;return L-(R+h)};
    const ds=clamp((t1-t0)/360,.6,8);let ta=t0,fa=f(ta);for(let t=t0+ds;;t+=ds){const tb=Math.min(t,t1),fb=f(tb);if(fa>0&&fb<=0){let lo=ta,hi=tb;for(let k=0;k<12;k++){const m=(lo+hi)/2;if(f(m)>0)lo=m;else hi=m}
      const pt=o.clone().addScaledVector(d,hi).applyMatrix4(this.matrixWorld);out.push({distance:rc.ray.origin.distanceTo(pt),point:pt,object:this});return}
     ta=tb;fa=fb;if(tb>=t1)return}}
   syncTri();tpm.matrixWorld.copy(this.matrixWorld);const n0=out.length;THREE.Mesh.prototype.raycast.call(tpm,rc,out);for(let i=n0;i<out.length;i++)out[i].object=this}}
 sp.canyonK=cfg.canyonOf?cfg.canyonOf(ERA):0;sp.TU.uCanyon.value=sp.canyonK;
 sp.ghRaw=(la,lo)=>{const d=dirLL(la,lo,_dd);let h=gridSample(Gd,Gd.H,d);if(Gd.CY&&sp.TU.uCanyon.value>0)h-=gridSample(Gd,Gd.CY,d)*sp.TU.uCanyon.value;return h};
 sp.gh=(la,lo)=>Math.max(sp.ghRaw(la,lo),0);
 // sea
 const ht=heightTex(Gd,1024,512);sp.ht=ht;
 const om=oceanMat(ht,cfg.ocean);om.uniforms.uCanyon.value=sp.canyonK;const ocean=new THREE.Mesh(new THREE.SphereGeometry(R,200,120),om);ocean.renderOrder=1;sc.add(ocean);sp.ocean=ocean;
 // air
 const A=atmMats(cfg.atm||'#5fa8ff');const atO=new THREE.Mesh(new THREE.SphereGeometry(R*1.05,96,64),A.outer);const atI=new THREE.Mesh(new THREE.SphereGeometry(R*1.004,96,64),A.inner);sc.add(atO);sc.add(atI);atI.renderOrder=3;sp.atm=A;
 let clouds=null;if(cfg.clouds!==false){const cm=cloudMat(cfg.clouds||{});clouds=new THREE.Mesh(new THREE.SphereGeometry(R+46,128,80),cm);clouds.renderOrder=4;sc.add(clouds);sp.clouds=clouds}
 sp.skyCol=Object.assign({zen:'#3a74c8',hor:'#a9cdec',set:'#f2a46a',nightZ:'#04070f',nightH:'#0d1626'},cfg.sky||{});
 const SK={zen:C(sp.skyCol.zen),hor:C(sp.skyCol.hor),set:C(sp.skyCol.set),nz:C(sp.skyCol.nightZ),nh:C(sp.skyCol.nightH)};
 // era crossfade of the ground colours
 let fade=null;sp.setColors=(key,instant)=>{if(key===sp.ckey&&!fade)return;const ca=geo.attributes.color,cb=geo.attributes.aCol2;
  if(fade){ca.array.set(sets[fade.key]);ca.needsUpdate=true;fade=null;sp.TU.uMix.value=0}
  if(key===sp.ckey)return;sp.ckey=key;if(instant){ca.array.set(sets[key]);ca.needsUpdate=true;return}cb.array.set(sets[key]);cb.needsUpdate=true;fade={key,t:0,s:performance.now()}};
 sp.setCanyon=(k)=>{sp.canyonTo=k};sp.canyonTo=sp.canyonK;
 // sun path: one turn every ten minutes, tilted so the poles see dusk
 sp.sunDir=V3(1,0,0);sp.sunLon=(cfg.sunLon===undefined?-10:cfg.sunLon);sp.dayLen=cfg.dayLen||960;
 const tmpc=new THREE.Color(),moonDir=V3(0,1,0);
 sp.dayK=1;
 sp.update=(T,dt)=>{
  sp.TU.uHK.value=lerp(1,.28,sm(1500,4200,rig.alt));
  if(fade){fade.t=(performance.now()-fade.s)/1500;sp.TU.uMix.value=sm(0,1,fade.t);if(fade.t>=1){const ca=geo.attributes.color;ca.array.set(sets[fade.key]);ca.needsUpdate=true;sp.TU.uMix.value=0;fade=null}}
  if(Math.abs(sp.canyonTo-sp.TU.uCanyon.value)>1e-3){sp.TU.uCanyon.value+=(sp.canyonTo-sp.TU.uCanyon.value)*Math.min(1,dt*1.2);om.uniforms.uCanyon.value=sp.TU.uCanyon.value}
  const lon=sp.sunLon+T*360/sp.dayLen;dirLL(14,lon,sp.sunDir);
  sun.position.copy(sp.sunDir).multiplyScalar(5000);sun.target.position.set(0,0,0);
  if(sp.moonPos){moonDir.copy(sp.moonPos).normalize()}else moonDir.copy(sp.sunDir).negate().applyAxisAngle(UP_Y,.6);
  moonL.position.copy(moonDir).multiplyScalar(5000);
  sunS.position.copy(sp.sunDir).multiplyScalar(24000);sunC.position.copy(sunS.position);
  om.uniforms.uSun.value.copy(sp.sunDir);om.uniforms.uMoon.value.copy(moonDir);A.U.uSun.value.copy(sp.sunDir);if(clouds)clouds.material.uniforms.uSun.value.copy(sp.sunDir);
  if(sp.nightMats)for(const m of sp.nightMats)m.uniforms.uSun.value.copy(sp.sunDir);if(sp.towerMats)for(const m of sp.towerMats)m.userData.U.uNight.value=1-sp.dayK;
  // where the camera is: how high, is it day there
  const cl=camera.position.length(),alt=cl-R;const cu=camera.position.clone().normalize();const sdot=cu.dot(sp.sunDir);
  const day=sm(-.22,.18,sdot);sp.dayK=day;const setK=Math.max(0,1-Math.abs(sdot-.02)*4)*0.9;
  const skyA=1-sm(160,1400,alt);
  // low sun: the light turns gold and amber, the shadow side goes blue
  {const lo=1-sm(.04,.5,sdot),w=lo*sm(-.2,.02,sdot);sun.color.setRGB(1,.94-.42*w,.85-.62*w);sun.intensity=(cfg.sunI||1.08)*(1-.25*w)*(.04+.96*day);hemi.intensity=.2*(.35+.65*day);hemi.color.copy(sp._hb||(sp._hb=hemi.color.clone())).lerp(_warmH,w*.45);sp.goldK=w}
  shadowFollow(sp,sun,sdot);
  tmpc.copy(SK.nh).lerp(SK.hor,day).lerp(SK.set,setK*day*.8);const hor=tmpc.clone();tmpc.copy(SK.nz).lerp(SK.zen,day);const zen=tmpc.clone();
  const su=sky.material.uniforms;su.uSun.value.copy(sp.sunDir);su.uUp.value.copy(cu);su.uZen.value.copy(zen);su.uHor.value.copy(hor);om.uniforms.uSky.value.copy(hor);om.uniforms.uSkyZ.value.copy(zen);om.uniforms.uSkyLive.value=1;su.uA.value=skyA;su.uDip.value=Math.sqrt(Math.max(0,1-(R/cl)*(R/cl)));sky.visible=skyA>.01;sky.position.copy(camera.position);
  sp.stars.material.opacity=1-skyA*(.15+.85*day);
  sunS.material.opacity=.55+.45*skyA;sunC.material.opacity=.9;
  // haze close to the ground
  const fz=sm(1500,250,alt);if(fz>0){sc.fog.color.copy(hor);sc.fog.near=lerp(4000,80+alt*.8,fz)*(1-.45*sp.goldK);sc.fog.far=lerp(9e4,900+alt*5,fz)*(1-.4*sp.goldK)}else{sc.fog.near=1e6;sc.fog.far=2e6}
  A.U.uK.value=sm(40,420,alt)*(cfg.atmK||1);atI.visible=alt>60;
  if(clouds){clouds.material.uniforms.uA.value=sm(150,560,alt);clouds.visible=clouds.material.uniforms.uA.value>.01}
  moonL.intensity=.2;
  if(sp.cover)sp.cover.update();
  const CL=sp.culls;for(let ci=0,cn=CL.length;ci<cn;ci++){const c=CL[ci];if(c.o.userData.eraHide){c.o.visible=false;continue}const d=camera.position.distanceTo(c.c)-c.r;let v=d<c.far&&!(c.near&&d<c.near);
   if(v&&cl>R+30){const ccl=c.c.length();if(c.c.dot(cu)/ccl<R/cl-.03-c.r/ccl&&d>200)v=false}c.o.visible=v;c.o.userData.distHide=!v;
   if(v&&c.hi){const lo=d>c.gr*LOD_K;if(lo!==c.lodOn){const g=lo?lodGeo(c.hi):c.hi;if(g){c.o.geometry=g;c.lodOn=lo}}}}
  updateHerds(sp,T);
  if(sp.extra)sp.extra(T,dt)};
 sp.bootMs=performance.now()-t0;BSP=sp;return sp}
const LOD_K=110;const _dd=V3(),UP_Y=V3(0,1,0),_warmH=new THREE.Color('#ffb070');

/* era → which objects show (planet rule: things that lasted to the end of book two carry on into book three) */
function applyPlanetEraBase(sp,e){for(const x of sp.eraObjs){const v=x.e.includes(e)||(e===13&&x.e.includes(12))||(sp.id==='rongqiu'&&e>=6&&!x.noCarry&&x.e.includes(5)&&!x.e.some(z=>z>=6));x.o.userData.eraHide=!v;x.o.visible=v}
 for(const h of sp.herds){const v=herdVisible(sp,h,e);h.eraVis=v;h.near=undefined;h.list.forEach(x=>x.o.visible=false)}
 if(sp.cfg.colorKey)sp.setColors(sp.cfg.colorKey(e));if(sp.cfg.canyonOf)sp.setCanyon(sp.cfg.canyonOf(e));if(sp.onEra)sp.onEra(e)}

/* ---------------- ground cover: grass, ferns, flowers, stones near the camera ---------------- */
function coverGeos(){
 const blade=(h,w,lean)=>{const g=new THREE.ConeGeometry(w,h,3,1,true);g.translate(0,h/2,0);g.rotateZ(lean);return g};
 const tuft=[];for(let i=0;i<9;i++){const a=i*2.4,r=.15+(i%3)*.12;tuft.push([blade(.7+(i%4)*.18,.05,(Math.cos(a))*.28),i%2?'#5f8f3e':'#7aa04a',{p:[Math.cos(a)*r,0,Math.sin(a)*r],r:[0,a,0]}])}
 const tall=[];for(let i=0;i<12;i++){const a=i*2.4,r=.1+(i%4)*.12;tall.push([blade(1.6+(i%5)*.3,.045,Math.cos(a)*.18),i%3?'#a7a15a':'#8c9a4c',{p:[Math.cos(a)*r,0,Math.sin(a)*r],r:[0,a,0]}])}
 const fern=[];for(let i=0;i<7;i++){const a=i/7*6.28;const l=new THREE.ConeGeometry(.16,1.3,4,1);l.translate(0,.65,0);l.scale(1,1,.25);l.rotateX(1.05);fern.push([l,i%2?'#3f7d45':'#4f9150',{r:[0,a,0]}])}
 fern.push([new THREE.CylinderGeometry(.04,.06,.3,4),'#4a3a28',{p:[0,.15,0]}]);
 const flower=[[blade(.55,.03,0),'#5f8f3e'],[new THREE.SphereGeometry(.13,6,4),'#ffffff',{p:[0,.58,0],s:[1,.55,1]}],[blade(.45,.03,.4),'#6a9a44',{p:[.06,0,0]}],[new THREE.SphereGeometry(.1,6,4),'#ffffff',{p:[.2,.45,0],s:[1,.55,1]}]];
 const rock=[[lumpRock(.5,2).clone(),'#8a8478',{s:[1,.55,.8]}],[lumpRock(.25,4).clone(),'#7a7468',{p:[.5,0,.2],s:[1,.6,1]}]];
 const shroom=[[new THREE.CylinderGeometry(.05,.07,.4,5),'#e8e0d0',{p:[0,.2,0]}],[new THREE.SphereGeometry(.22,8,4,0,6.283,0,1.6),'#ffffff',{p:[0,.38,0],s:[1,.6,1]}],[new THREE.CylinderGeometry(.03,.05,.25,5),'#e8e0d0',{p:[.25,.12,.1]}],[new THREE.SphereGeometry(.13,8,4,0,6.283,0,1.6),'#ffffff',{p:[.25,.24,.1],s:[1,.6,1]}]];
 const succ=[[new THREE.CylinderGeometry(.22,.26,.9,7),'#6f9a6a',{p:[0,.45,0]}],[new THREE.SphereGeometry(.24,7,5),'#7fa878',{p:[0,.92,0],s:[1,.7,1]}],[new THREE.SphereGeometry(.3,7,5),'#86a86f',{p:[.38,.25,.1]}],[new THREE.CylinderGeometry(.12,.15,.55,6),'#6a9268',{p:[-.3,.28,-.15]}]];
 const reed=[];for(let i=0;i<6;i++){const a=i*2.1;reed.push([blade(1.8+(i%3)*.4,.035,.08*Math.cos(a)),'#6a7a48',{p:[Math.cos(a)*.15,0,Math.sin(a)*.15]}]);reed.push([new THREE.CylinderGeometry(.06,.06,.28,5),'#5a3a22',{p:[Math.cos(a)*.15,1.75+(i%3)*.4,Math.sin(a)*.15]}])}
 return{tuft:G(tuft),tall:G(tall),fern:G(fern),flower:G(flower),rock:G(rock),shroom:G(shroom),succ:G(succ),reed:G(reed)}}
let COVERG=null;const CVC=new Map();
/* biomeFn(dir,h,lat,era,out) fills weights 0..1 for each kind and optional tint colours */
function makeCoverBase(sp,biomeFn){COVERG=COVERG||coverGeos();
 const K=[{k:'tuft',n:2200,s:[1,1.8],sway:.12},{k:'tall',n:900,s:[1,1.6],sway:.06},{k:'fern',n:500,s:[1,2.2],sway:.05},{k:'flower',n:600,s:[.8,1.3],sway:.12},{k:'rock',n:260,s:[.6,2.4],sway:0},{k:'shroom',n:260,s:[.8,2],sway:0,glow:1},{k:'succ',n:260,s:[.8,2.2],sway:0},{k:'reed',n:400,s:[1,1.4],sway:.05}];
 const groups=K.map(o=>{const mat=o.sway?swayMat({roughness:.9},o.sway):VC({roughness:.8,emissive:o.glow?'#2a6a5a':'#000000',emissiveIntensity:o.glow?.6:0});
  const im=new THREE.InstancedMesh(COVERG[o.k],mat,o.n);for(let i=0;i<o.n;i++)im.setColorAt(i,C('#ffffff'));im.count=0;im.frustumCulled=false;sp.scene.add(im);return Object.assign({im},o)});
 const W={},T2=new THREE.Color(),o3=new THREE.Object3D(),d=V3(),fwd=V3();let last=null,lastEra=-1,job=null;
 const cover={groups,visible:true,update(){const alt=rig.alt;const on=sp===CUR&&alt<430&&cover.visible;
  if(!on){for(const g of groups)g.im.visible=false;return}
  const tg=dirLL(rig.a,rig.b);const rdU=clamp(alt*1.3+40,60,420);const rdD=rdU/(R*D2R);
  if(!job&&last&&ERA===lastEra&&angDeg(last.d,tg)<last.rd*.22&&Math.abs(Math.log(rdD/last.rd))<.35){for(const g of groups)g.im.visible=g.im.count>0;return}
  // a new patch of ground cover is worked out a few rows per frame (the old one stays up meanwhile), then swapped in at once
  if(!job){last={d:tg.clone(),rd:rdD};lastEra=ERA;
   const cells=86,cs=rdD*2/cells;const la0=Math.floor((rig.a-rdD)/cs),lo0s=rdD/Math.max(.2,Math.cos(rig.a*D2R));const lcs=cs/Math.max(.2,Math.cos(rig.a*D2R));const lo0=Math.floor((rig.b-lo0s)/lcs);
   const clr=(sp.entClr||[]).filter(e=>(!e.eras||e.eras.includes(ERA))&&angDeg(e.d,tg)<rdD+e.deg*1.5);
   job={j:0,cells,cs,la0,lo0,lcs,rdD,tg:tg.clone(),clr,era:ERA,acc:groups.map(()=>[]),lines:sp.q2Lines?q2_lines(sp,tg,rdD):null}}
  const J=job;const tg2=J.tg,rd2=J.rdD,cs=J.cs,lcs=J.lcs,clr=J.clr,acc=J.acc,cells=J.cells;const t0=q5s_now(),lim=q5s_slice();// (49p_stable: rows until the slice's time is used, then one kind of plant a frame)
  while(J.j<cells){const j=J.j++;for(let i=0;i<cells;i++){const ci=J.la0+j,cj=J.lo0+i;const hx=h3(ci*.37,cj*.61,7.1),hy=h3(ci*.71,cj*.19,3.3);
    const la=(ci+hx)*cs,lo=(cj+hy)*lcs;if(la>86||la<-86)continue;dirLL(la,lo,d);const ad=angDeg(d,tg2);if(ad>rd2)continue;if(clr.length){let sk=0;for(const e of clr)if(e.d.dot(d)>e.cs){sk=1;break}if(sk)continue}
    const h=sp.ghRaw(la,lo);if(h<1.2)continue;if(J.lines&&q2_onLine(J.lines,d))continue;for(const k in W)W[k]=0;biomeFn(d,h,la,J.era,W);
    for(let gi=0;gi<groups.length;gi++){const g=groups[gi];const w=W[g.k]||0;if(w<=0)continue;const hz=h3(ci*1.3+gi*7.7,cj*.9+gi*3.1,gi*1.9);if(hz<w&&!(gi===0&&ad<(sp.q2gr||0)))acc[gi].push([la,lo,h,ad,hz/w,W[g.k+'C']])}}
   if(J.j<cells&&!window.__coverSync&&q5s_now()-t0>lim)return}
  if(J.gi===undefined)J.gi=0;
  for(;J.gi<groups.length;J.gi++,J.ii=0){const gi=J.gi,g=groups[gi];let L=acc[gi];if(L.length>g.n){L.sort((a,b)=>a[3]-b[3]);L=acc[gi]=L.slice(0,g.n)}const im=g.im;const sc0=clamp(cs*R*D2R*.55,.8,6);
   for(let i=J.ii||0;i<L.length;i++){if((i&31)===0&&(i||gi)&&!window.__coverSync&&q5s_now()-t0>lim){J.ii=i;return}const p=L[i];frameLL(sp,p[0],p[1],-.12+(sp.q2?q2dh(sp,p[0],p[1]):0),p[4]*6.28,o3);const s=sc0*lerp(g.s[0],g.s[1],(p[4]*7.3)%1);o3.scale.setScalar(s);o3.updateMatrix();im.setMatrixAt(i,o3.matrix);
    {const cs2=p[5]||'#ffffff';let c=CVC.get(cs2);if(!c){c=new THREE.Color(cs2);CVC.set(cs2,c)}T2.copy(c)}T2.offsetHSL(((p[4]*13.1)%1-.5)*.03,0,((p[4]*5.7)%1-.5)*.12);im.setColorAt(i,T2)}
   im.count=L.length;im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;im.visible=L.length>0}
  job=null}};
 sp.cover=cover;return cover}
