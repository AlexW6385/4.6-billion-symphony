/* ================================================================
   light, air and surfaces (image quality, step 3)
   · the camera's near and far planes follow the view, so close-ups get a fine depth buffer
   · ambient occlusion from that depth buffer: contact darkening under trees, at the foot of houses, in creases of rock
   · colour grading in the last pass: a gentle filmic curve, a mood per world and age, warmth toward the sun, cool shadows
   · aerial perspective: haze warmer toward the sun and bluer away from it, a little ground fog at dawn and dusk
   · clouds with a bright sun-facing edge and soft self-shadow
   · rivers and lakes drawn as water (sky in them, clear at the banks, flowing), towns with masonry, planks, panels and tiles
   · every effect has a switch on the quality steps (perf.lvl) and phones
   ================================================================ */

/* ---- quality steps: perf.lvl 0 best .. 3 lowest; a phone starts one step down ---- */
const Q3T=[
 {ao:12,cloud:1,hfog:1,water:1,bld:1},
 {ao:8,cloud:1,hfog:1,water:1,bld:1},
 {ao:0,cloud:0,hfog:1,water:1,bld:1},
 {ao:0,cloud:0,hfog:0,water:0,bld:0}];
function q3_tier(){if(window.__q3tier!==undefined)return window.__q3tier;const l=(typeof perf!=='undefined'&&perf?perf.lvl:0)+(COARSE?1:0);return Math.min(3,l|0)}
const Q3Q={value:new THREE.Vector4(1,1,1,1)};               // x: cloud self-shadow, y: water detail, z: building detail

/* ---------------- near and far follow the view ----------------
   the depth buffer's resolution is set almost entirely by the near plane (an error of z²/(near·2^24) at distance z),
   so near follows the camera's height above whatever is under it; far only needs to take in the stars (a shell of
   radius 40000 round the planet) and, in the open spaces, their own big skies */
function q3_clip(){const sp=CUR;if(!sp)return;let n=.4,f=120000;const cp=camera.position;
 const close=!!(sp.camOv||window.__view||sp.follow);
 if(sp.type==='planet'){const cl=cp.length();const ll=llDir(cp);const g=Math.max(0,sp.gh(ll[0],ll[1])*(sp.TU?sp.TU.uHK.value:1));const hag=Math.max(.5,cl-R-g);
  n=close?.3:clamp(hag*.025,.3,120);f=Math.min(120000,cl+41500)}
 else if(sp.type==='space')n=close?.3:clamp(rig.alt*.002,.4,6);
 else n=close?.3:clamp(rig.alt*.003,.3,3);
 if(window.__q3clip===0){n=.4;f=120000}
 if(Math.abs(camera.near-n)>n*.04||camera.far!==f){camera.near=n;camera.far=f;camera.updateProjectionMatrix()}}
const q3_rp0=rigPose;rigPose=function(){q3_rp0();q3_clip();q3_fogStep()};

/* ---------------- ambient occlusion ----------------
   worked out at half resolution from the scene's own depth (no second drawing of the scene): the normal from the
   depth around each pixel, then a dozen taps on a spiral in the hemisphere above it, turned by a 4×4 pattern that a
   4×4 depth-aware blur removes again; the last pass reads it back with a depth-aware upsample */
const Q3_AO_VS='varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}';
const Q3_AO_FS=`uniform sampler2D tD;uniform mat4 uPI;uniform float uPS,uAsp,uR,uMaxD,uInt,uNS;uniform vec2 uTx;varying vec2 vUv;
vec3 vp(vec2 uv){float d=texture2D(tD,uv).x;vec4 p=uPI*vec4(uv*2.-1.,d*2.-1.,1.);return p.xyz/p.w;}
float bay(vec2 p){p=mod(floor(p),4.);vec4 r=p.y<.5?vec4(0.,8.,2.,10.):p.y<1.5?vec4(12.,4.,14.,6.):p.y<2.5?vec4(3.,11.,1.,9.):vec4(15.,7.,13.,5.);return (p.x<.5?r.x:p.x<1.5?r.y:p.x<2.5?r.z:r.w)/16.;}
void main(){float d0=texture2D(tD,vUv).x;if(d0>=.999999){gl_FragColor=vec4(1.,6e4,0.,1.);return;}
 vec3 P=vp(vUv);float z=-P.z;if(z>uMaxD){gl_FragColor=vec4(1.,z,0.,1.);return;}
 vec2 ox=vec2(uTx.x*2.,0.),oy=vec2(0.,uTx.y*2.);
 vec3 a=vp(vUv+ox)-P,b=P-vp(vUv-ox),c=vp(vUv+oy)-P,e=P-vp(vUv-oy);
 vec3 dx=abs(a.z)<abs(b.z)?a:b,dy=abs(c.z)<abs(e.z)?c:e;vec3 N=normalize(cross(dx,dy));if(dot(N,P)>0.)N=-N;
 float rad=uR*clamp(z*.022,1.,5.);float rs=clamp(rad*uPS/z,uTx.y*8.,.14);
 float ang=bay(gl_FragCoord.xy)*6.2831853;float ao=0.,r2=rad*rad;
 for(int i=0;i<12;i++){if(float(i)>=uNS)break;float t=(float(i)+.6)/uNS;float an=ang+float(i)*2.3999632;vec2 off=vec2(cos(an)/uAsp,sin(an))*rs*t;
  vec3 S=vp(vUv+off)-P;float vv=dot(S,S);float vn=dot(S,N);
  ao+=max(0.,vn-.006*z-.03)/(vv+.04*r2)*max(0.,1.-vv/r2)*rad;}
 ao=clamp(1.-uInt*ao*1.6/uNS,0.,1.);ao=mix(1.,ao,1.-smoothstep(uMaxD*.5,uMaxD,z));
 gl_FragColor=vec4(ao,z,0.,1.);}`;
const Q3_BL_FS=`uniform sampler2D tA;uniform vec2 uTx;varying vec2 vUv;
uniform float uMaxD;
void main(){vec4 c=texture2D(tA,vUv);if(c.g>uMaxD){gl_FragColor=c;return;}float s=0.,w=0.;float k=1./(c.g*.03+.04);
 for(int j=-2;j<2;j++)for(int i=-2;i<2;i++){vec4 q=texture2D(tA,vUv+vec2(float(i)+.5,float(j)+.5)*uTx);float wt=1./(1.+abs(q.g-c.g)*k*abs(q.g-c.g)*k);s+=q.r*wt;w+=wt;}
 gl_FragColor=vec4(s/max(w,1e-4),c.g,0.,1.);}`;
class Q3AOPass extends THREE.Pass{constructor(){super();this.needsSwap=false;
  const o={minFilter:THREE.NearestFilter,magFilter:THREE.NearestFilter,format:THREE.RGBAFormat,type:THREE.HalfFloatType,depthBuffer:false};
  this.rtA=new THREE.WebGLRenderTarget(2,2,o);this.rtB=new THREE.WebGLRenderTarget(2,2,o);
  this.mAU_maxD={value:320};this.mA=new THREE.ShaderMaterial({uniforms:{tD:{value:null},uPI:{value:new THREE.Matrix4()},uPS:{value:1},uAsp:{value:1},uR:{value:1.1},uMaxD:this.mAU_maxD,uInt:{value:1},uNS:{value:12},uTx:{value:new THREE.Vector2(1,1)}},vertexShader:Q3_AO_VS,fragmentShader:Q3_AO_FS,depthTest:false,depthWrite:false});
  this.mB=new THREE.ShaderMaterial({uniforms:{tA:{value:this.rtA.texture},uTx:{value:new THREE.Vector2(1,1)},uMaxD:this.mAU_maxD},vertexShader:Q3_AO_VS,fragmentShader:Q3_BL_FS,depthTest:false,depthWrite:false});
  this.q=new THREE.FullScreenQuad(this.mA)}
 setSize(w,h){const W=Math.max(1,Math.round(w/2)),H=Math.max(1,Math.round(h/2));this.rtA.setSize(W,H);this.rtB.setSize(W,H);this.mB.uniforms.uTx.value.set(1/W,1/H);this.mA.uniforms.uTx.value.set(1/w,1/h);this.W=W;this.H=H}
 render(r,wb,rb){const d=rb.depthTexture;if(!d)return;const U=this.mA.uniforms;U.tD.value=d;U.uPI.value.copy(camera.projectionMatrixInverse);U.uPS.value=camera.projectionMatrix.elements[5]*.5;U.uAsp.value=camera.aspect;
  r.setRenderTarget(this.rtA);this.q.material=this.mA;this.q.render(r);r.setRenderTarget(this.rtB);this.q.material=this.mB;this.q.render(r)}}
let Q3AO=null;
function q3_aoWanted(){if(window.__q3ao!==undefined)return !!window.__q3ao;if(!Q3AO||COARSE)return false;const T=Q3T[q3_tier()];return T.ao>0}

/* ---------------- the last pass: AO, exposure, a gentle filmic curve, mood, warmth toward the sun, cool shadows ---------------- */
Object.assign(FinalShader.uniforms,{tAO:{value:null},tDepth:{value:null},uAOK:{value:0},uAOT:{value:new THREE.Vector2(1,1)},uN:{value:.4},uF:{value:1e5},
 uExp:{value:1},uGain:{value:new THREE.Color(1,1,1)},uLift:{value:new THREE.Color(0,0,0)},uSat:{value:1.06},uCon:{value:0},uWarm:{value:new THREE.Color(1,1,1)},uSunP:{value:V3(.5,.5,0)},uAsp:{value:1.6},uDbg:{value:0}});
FinalShader.fragmentShader=`uniform sampler2D tDiffuse,tAO,tDepth;uniform float uVig,uTime,uFade,uAOK,uN,uF,uExp,uSat,uCon,uAsp,uDbg;uniform vec2 uAOT;uniform vec3 uFadeCol,uGain,uLift,uWarm,uSunP;varying vec2 vUv;
 void main(){vec3 c=max(texture2D(tDiffuse,vUv).rgb,0.);
  if(uAOK>0.){float d=texture2D(tDepth,vUv).x;if(d<.999999){float z=uN*uF/(uF-d*(uF-uN));vec2 hp=vUv/uAOT-.5;vec2 b=floor(hp),f=hp-b;float a=0.,ws=0.;
    for(int j=0;j<2;j++)for(int i=0;i<2;i++){vec2 o=vec2(float(i),float(j));vec4 s=texture2D(tAO,(b+o+.5)*uAOT);float w=(i==1?f.x:1.-f.x)*(j==1?f.y:1.-f.y)+.002;float dz=min(abs(s.g-z)/(z*.03+.05),1e3);w/=1.+dz*dz;a+=s.r*w;ws+=w;}
    float ao=ws>1e-3?a/ws:1.;if(uDbg>0.){gl_FragColor=vec4(vec3(ao),1.);return;}c*=mix(vec3(1.),vec3(ao)+(1.-ao)*vec3(.0,.035,.1),uAOK);}}
  {float l0=dot(c,vec3(.299,.587,.114));c*=uExp*mix(uGain,vec3(1.),smoothstep(.5,.95,l0));}
  {vec2 sd=(vUv-uSunP.xy)*vec2(uAsp,1.);float sw=exp(-dot(sd,sd)*1.6)*uSunP.z;c*=mix(vec3(1.),uWarm,sw);}
  vec3 hi=.82+.18*(1.-exp(-(c-.82)/.18));c=mix(c,hi,step(.82,c));
  c=clamp(c,0.,1.);c=mix(c,c*c*(3.-2.*c),uCon);
  float l=dot(c,vec3(.299,.587,.114));c+=uLift*pow(1.-smoothstep(0.,.42,l),2.);
  l=dot(c,vec3(.299,.587,.114));c=mix(vec3(l),c,uSat);
  float dv=distance(vUv,vec2(.5));c*=1.-uVig*smoothstep(.42,1.,dv);
  c+=(fract(sin(dot(vUv*vec2(1311.7,977.3)+fract(uTime),vec2(12.9898,78.233)))*43758.5453)-.5)*.016;
  c=mix(c,uFadeCol,uFade);gl_FragColor=vec4(c,1.);}`;
/* the mood of each world and age: exposure, a colour gain, how far the shadows lift and toward what, saturation, contrast */
const Q3MOOD={
 def:{e:1,g:[1,1,1],l:[.012,.02,.034],s:1.06,c:.12},
 r1:{e:1,g:[.95,1,1.06],l:[.006,.024,.046],s:1.05,c:.12},       // the ocean age: cooler, bluer shadows
 r2:{e:1.01,g:[1.02,1,.97],l:[.012,.02,.03],s:1.07,c:.12},
 r3:{e:1.02,g:[1.05,1.02,.93],l:[.016,.026,.03],s:1.12,c:.13},   // the dinosaur continent: warm and lush
 r4:{e:1,g:[.97,1,1.05],l:[.01,.022,.045],s:.98,c:.11},          // snow: crisp and cold
 r5:{e:1.02,g:[1.03,1.01,.95],l:[.014,.022,.034],s:1.08,c:.12},
 r6:{e:1,g:[1,1,1.02],l:[.01,.02,.038],s:1.06,c:.12},
 void:{e:1,g:[.94,.96,1.05],l:[.002,.004,.016],s:1.08,c:.15},  // the void: deep and inky
 ximin:{e:1,g:[1.01,1,.98],l:[.012,.016,.024],s:.96,c:.12},
 erxi:{e:1.01,g:[1,1,1.02],l:[.01,.02,.036],s:1.07,c:.12}};
const Q3M={e:1,g:new THREE.Color(1,1,1),l:new THREE.Color(0,0,0),s:1.06,c:0,t:-1};
function q3_moodKey(){const sp=CUR;if(!sp)return 'def';if(sp.id==='rongqiu')return ERA<=5?'r'+ERA:'r6';return Q3MOOD[sp.id]?sp.id:'def'}
const _q3v=V3(),_q3c=new THREE.Color(),_q3d=new THREE.Color();
function q3_grade(){const U=finalPass.uniforms,sp=CUR;if(!sp)return;const now=performance.now();const first=Q3M.t<0;const dt=first?1:Math.min(.2,(now-Q3M.t)/1000);Q3M.t=now;
 const M=Q3MOOD[q3_moodKey()],k=first?1:1-Math.exp(-dt*2.5);
 const day=sp.type==='planet'?(sp.dayK===undefined?1:sp.dayK):1,gold=sp.type==='planet'?(sp.goldK||0):0;
 Q3M.e+=(M.e-Q3M.e)*k;Q3M.s+=(M.s-Q3M.s)*k;Q3M.c+=(M.c-Q3M.c)*k;_q3c.setRGB(M.g[0],M.g[1],M.g[2]);Q3M.g.lerp(_q3c,k);
 // after dark the shadows lift toward a deeper blue
 _q3c.setRGB(M.l[0],M.l[1],M.l[2]);_q3d.setRGB(.006,.012,.034);_q3c.lerp(_q3d,1-day);Q3M.l.lerp(_q3c,k);
 U.uExp.value=Q3M.e;U.uGain.value.copy(Q3M.g);U.uLift.value.copy(Q3M.l);U.uSat.value=Q3M.s;U.uCon.value=Q3M.c;U.uAsp.value=camera.aspect;
 // warmth round the sun's place on screen, stronger when it is low
 let sk=0;if(sp.type==='planet'&&sp.sunDir){_q3v.copy(camera.position).addScaledVector(sp.sunDir,1000).project(camera);const fw=camera.getWorldDirection(V3()).dot(sp.sunDir);
  if(_q3v.z<1&&fw>0){U.uSunP.value.set(_q3v.x*.5+.5,_q3v.y*.5+.5,0);sk=sm(-.1,.15,fw)*day*(.35+.65*gold)*(1-sm(1500,3500,rig.alt))}}
 U.uSunP.value.z=sk;U.uDbg.value=window.__q3dbg?1:0;U.uWarm.value.setRGB(1.06+.1*gold,1-.02*gold,.9-.1*gold);
 // ambient occlusion
 // (from high up everything is far beyond the AO's reach: the pass is not run at all)
 const on=q3_aoWanted()&&!!Q3AO&&rig.alt<450;if(Q3AO)Q3AO.enabled=on;U.uAOK.value=on?.85:0;
 if(on){Q3AO.mA.uniforms.uNS.value=Math.max(4,Q3T[q3_tier()].ao||8);U.tAO.value=Q3AO.rtB.texture;U.uAOT.value.set(1/Q3AO.W,1/Q3AO.H);U.uN.value=camera.near;U.uF.value=camera.far;
  // reach only as far as the haze lets you see the ground clearly
  const fg=sp.scene.fog;Q3AO.mA.uniforms.uMaxD.value=fg&&fg.isFog&&fg.near<1e5?clamp(fg.near*1.6,120,600):360}}
/* the composer's two buffers each get a depth texture (the scene pass draws into one or the other in turn) */
const q3_ip0=initPost;
initPost=function(){q3_ip0();if(!composer||!POST.on)return;
 {const fr=finalPass.render.bind(finalPass);finalPass.render=function(r,wb,rb,dt,mm){try{q3_grade();finalPass.uniforms.tDepth.value=rb.depthTexture||null}catch(e){}return fr(r,wb,rb,dt,mm)}}
 try{if(!renderer.capabilities.isWebGL2)return;
  for(const rt of[composer.renderTarget1,composer.renderTarget2]){const dt=new THREE.DepthTexture();dt.type=THREE.UnsignedIntType;dt.format=THREE.DepthFormat;rt.depthTexture=dt;rt.depthBuffer=true}
  Q3AO=new Q3AOPass();composer.insertPass(Q3AO,1);
  // the scene pass: the water may read the other buffer's depth, which still holds the previous frame (one swap per frame:
  // with FXAA after the last pass there are two, and the other buffer's depth is then not the scene's)
  const rr=renderPass.render.bind(renderPass),last={rt:null,vp:new THREE.Matrix4(),n:.4,f:1e5};
  renderPass.render=function(r,wb,rb,dt,mm){const other=rb===composer.renderTarget1?composer.renderTarget2:composer.renderTarget1;
   const ok=!fxaaPass&&last.rt===other&&!!other.depthTexture&&Q3T[q3_tier()].water>0&&window.__q3pd!==0;Q3PD.value=ok?other.depthTexture:null;Q3PN.value.set(last.n,last.f,ok?1:0);Q3PVP.value.copy(last.vp);
   const res=rr(r,wb,rb,dt,mm);last.rt=rb;last.vp.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);last.n=camera.near;last.f=camera.far;return res}}
 catch(e){console.warn('q3 post',e);Q3AO=null}};

/* ---------------- aerial perspective and ground fog ----------------
   the fog every material shares learns where the sun is: warmer toward it, bluer away from it, with a soft forward glow;
   and a thin layer of fog that pools low (in valleys and over the water), mostly at dawn and dusk. All-zero settings give
   back the plain fog, so worlds and materials that do not set them look as before */
const Q3FOG={q3FSun:{value:V3(1,0,0)},q3FW:{value:new THREE.Color(1,1,1)},q3FC:{value:new THREE.Color(1,1,1)},q3FK:{value:0},q3HF:{value:new THREE.Vector4(0,6,1000,0)},q3HFC:{value:new THREE.Color(1,1,1)}};
{const SC=THREE.ShaderChunk;
 SC.fog_pars_vertex=SC.fog_pars_vertex.replace('varying float fogDepth;','varying float fogDepth;\n\tvarying vec3 q3FogW;');
 SC.fog_vertex=SC.fog_vertex.replace('fogDepth = - mvPosition.z;','fogDepth = - mvPosition.z;\n\tq3FogW = ( vec4( mvPosition.xyz, 0.0 ) * viewMatrix ).xyz;');
 SC.fog_pars_fragment=SC.fog_pars_fragment.replace('varying float fogDepth;','varying float fogDepth;\n\tvarying vec3 q3FogW;\n\tuniform vec3 q3FSun,q3FW,q3FC,q3HFC;\n\tuniform float q3FK;\n\tuniform vec4 q3HF;');
 SC.fog_fragment=`
#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * fogDepth * fogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, fogDepth );
	#endif
	vec3 q3fc = fogColor;
	if ( q3FK > 0.0 ) { vec3 q3d = normalize( q3FogW ); float q3mu = dot( q3d, q3FSun );
		q3fc *= mix( vec3( 1.0 ), mix( q3FC, q3FW, smoothstep( -0.4, 0.9, q3mu ) ), q3FK );
		q3fc += fogColor * q3FW * pow( max( q3mu, 0.0 ), 12.0 ) * 0.3 * q3FK; }
	gl_FragColor.rgb = mix( gl_FragColor.rgb, q3fc, fogFactor );
	if ( q3HF.w > 0.0 ) { float q3L = length( q3FogW ); vec3 q3wp = cameraPosition + q3FogW;
		float q3h0 = max( length( cameraPosition ) - q3HF.z, 0.0 ), q3h1 = max( length( q3wp ) - q3HF.z, 0.0 );
		float q3e0 = exp( - q3h0 / q3HF.y ), q3e1 = exp( - q3h1 / q3HF.y ), q3dh = q3h1 - q3h0;
		float q3od = abs( q3dh ) > 0.05 ? ( q3e0 - q3e1 ) / q3dh * q3HF.y : 0.5 * ( q3e0 + q3e1 );
		float q3hf = ( 1.0 - exp( - q3od * q3L * q3HF.x ) ) * q3HF.w;
		gl_FragColor.rgb = mix( gl_FragColor.rgb, q3HFC, q3hf ); }
#endif
`}
{const ob=THREE.Material.prototype.onBuild;THREE.Material.prototype.onBuild=function(sh,r){if(this.fog!==false&&sh&&sh.uniforms&&sh.uniforms.fogColor)Object.assign(sh.uniforms,Q3FOG);if(ob)ob.call(this,sh,r)}}
function q3_fogStep(){const sp=CUR;const F=Q3FOG;if(!sp||sp.type!=='planet'||!sp.sunDir||window.__q3fog===0){F.q3FK.value=0;F.q3HF.value.w=0;return}
 const fg=sp.scene.fog,alt=rig.alt;const gold=sp.goldK||0,day=sp.dayK===undefined?1:sp.dayK;F.q3FSun.value.copy(sp.sunDir);
 F.q3FK.value=sm(1700,300,alt)*(.45+.55*day);
 F.q3FW.value.setRGB(1.1+.22*gold,1.01-.02*gold,.86-.16*gold);F.q3FC.value.setRGB(.9-.05*gold,.97,1.1+.06*gold);
 // ground fog: thin by day, thicker in the low sun and at night, only when near the ground
 const hk=Q3T[q3_tier()].hfog?1:0;const dawn=Math.max(gold,(1-day)*.6);
 F.q3HF.value.set(.0022+.006*dawn,5.5+3*dawn,R,hk*sm(900,160,alt)*(.22+.6*dawn));
 if(fg)F.q3HFC.value.copy(fg.color).lerp(_q3wh,.18).multiply(F.q3FC.value);if(gold>0)F.q3HFC.value.lerp(_q3gd,gold*.3)}
const _q3wh=new THREE.Color(1,1,1),_q3gd=new THREE.Color('#ffc8a0');

/* ---------------- clouds: a bright edge toward the sun, soft self-shadow ---------------- */
const q3_cm0=cloudMat;
cloudMat=function(o){const m=q3_cm0(o);m.uniforms.uQ3=Q3Q;
 m.fragmentShader=m.fragmentShader.replace('uniform float uT,uA,uCov,uSeed;','uniform float uT,uA,uCov,uSeed;uniform vec4 uQ3;').replace('gl_FragColor=vec4(c,a*uA*(.5+.5*th)*.95*(.3+.7*l));',`
 {vec3 Vd=normalize(vW-cameraPosition);float f1=max(dot(Vd,uSun),0.);float fw=f1*f1*f1;
  // the sun shining through thin cloud edges
  c+=uCol*vec3(1.,.93,.8)*(fw*.5+pow(f1,12.)*1.2)*(1.-th)*l;
  // self-shadow: denser cloud a little way toward the sun shades this point
  if(uQ3.x>.5){vec3 st=normalize(uSun-p*sd+vec3(1e-4));vec3 bs=bb+st*.16;float n2=fb3(bs)*.66+fb3(bs*2.6+w*1.4+vec3(4.1))*.26;c*=1.-.34*clamp((n2-n)*6.,0.,1.)*l*(1.-fw*.6);}
  // thick cloud is a little greyer underneath its lit top
  c*=mix(1.,.86,th*th*(1.-l*.4));}
 gl_FragColor=vec4(c,a*uA*(.5+.5*th)*.95*(.3+.7*l));`);return m};
const q3_cu0=rqCumulus;
rqCumulus=function(sp){q3_cu0(sp);const P=sp.cumulus;if(!P)return;const m=P.material;
 m.vertexShader=m.vertexShader.replace('varying float vL,vY,vA,vS;','varying float vL,vY,vA,vS,vF;').replace('vY=aY;','vY=aY;vF=max(dot(normalize(w.xyz-cameraPosition),uSun),0.);');
 m.fragmentShader=m.fragmentShader.replace('varying float vL,vY,vA,vS;','varying float vL,vY,vA,vS,vF;').replace('gl_FragColor=vec4(c,min(1.,t.a*1.05)*vA*.85);',
  '{float f3=vF*vF*vF,f10=pow(vF,10.);c+=vec3(1.,.93,.8)*(f3*.45+f10*1.3)*(1.-smoothstep(.4,.95,t.a))*vL;c*=1.+f3*.12*vL;}c*=mix(.9,1.,vY);{float dk=1.-smoothstep(0.,.38,abs(vS-.02));c=mix(c,vec3(1.,.7,.58)*(.75+.25*vY),dk*.34*(.35+.65*vY));c*=mix(1.,.8+.2*vY,dk);}gl_FragColor=vec4(c,min(1.,t.a*1.05)*vA*.85);');m.needsUpdate=true};

/* ---------------- rivers and lakes: water like the sea's ----------------
   the live sky in them (shared with the sea), the sun's glint, ripples drifting downstream; how deep the water is under
   each pixel comes from the previous frame's depth (the scene pass draws into the composer's two buffers in turn, so the
   other one still holds the ground as it was a frame ago, seen through the water): clear shallows showing a darker bed,
   and a wet, foamy line exactly where the water meets the bank. Without that buffer the water falls back to its old edges */
const Q3PD={value:null},Q3PVP={value:new THREE.Matrix4()},Q3PN={value:V3(.4,1e5,0)};
function q3_waterMat(sp,o){o=o||{};const om=sp.ocean&&sp.ocean.material.uniforms;
 const U=Object.assign(THREE.UniformsUtils.clone(THREE.UniformsLib.fog),{uT:GT,uIce:o.ice||{value:0},uQ3:Q3Q,uPD:Q3PD,uPVP:Q3PVP,uPN:Q3PN,uSun:om?om.uSun:{value:V3(1,0,0)},uSky:om?om.uSky:{value:C('#9cc8f0')},uSkyZ:om?om.uSkyZ:{value:C('#3b78d0')},
  uDeep:{value:C(o.deep||'#0f3440')},uShal:{value:C(o.shal||'#2a6a74')},uBed:{value:C(o.bed||'#4a4634')},uLake:{value:o.lake?1:0},uFoamC:{value:C('#e8f2f0')}});
 return new THREE.ShaderMaterial({uniforms:U,transparent:true,depthWrite:false,fog:true,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-3,polygonOffsetUnits:-3,
  vertexShader:`attribute vec3 aT;varying vec2 vRU;varying vec3 vW,vT;
#include <fog_pars_vertex>
void main(){vRU=uv;vT=aT;vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;vec4 mvPosition=viewMatrix*w;gl_Position=projectionMatrix*mvPosition;
#include <fog_vertex>
}`,
  fragmentShader:`uniform float uT,uIce,uLake;uniform vec4 uQ3;uniform vec3 uSun,uSky,uSkyZ,uDeep,uShal,uBed,uFoamC,uPN;uniform sampler2D uPD;uniform mat4 uPVP;varying vec2 vRU;varying vec3 vW,vT;
${GLSL_NOISE}
#include <fog_pars_fragment>
void main(){vec3 up=normalize(vW);vec3 V=normalize(cameraPosition-vW);float dist=length(cameraPosition-vW);
 // across the water: 0 at the ribbon's (or disc's) edge, 1 in the middle
 float edge=uLake>.5?clamp((.5-length(vRU-.5))*2.,0.,1.):1.-abs(vRU.x-.5)*2.;
 // how deep the water is here: the ground behind it in last frame's depth, less this point's own distance, made vertical
 float wd=edge*2.5;
 if(uPN.z>.5){vec4 pc=uPVP*vec4(vW,1.);vec2 pu=pc.xy/pc.w*.5+.5;if(pc.w>0.&&pu.x>0.&&pu.y>0.&&pu.x<1.&&pu.y<1.){float d=texture2D(uPD,pu).x;
   if(d<.999999){float tz=uPN.x*uPN.y/(uPN.y-d*(uPN.y-uPN.x));float th=tz-pc.w;wd=th>-.3?max(th,0.)*max(abs(dot(V,up)),.2):2.5;}}}
 // the way the water runs (along the ribbon's length), and across it
 vec3 Tw=uLake>.5?cross(up,vec3(.3,1.,.2)):vT;Tw=normalize(Tw-up*dot(Tw,up)+vec3(1e-6));vec3 Bw=cross(up,Tw);
 float run=uLake>.5?.15:1.;float nk=1.-smoothstep(60.,700.,dist);
 vec3 q=vW*.42-Tw*uT*1.1*run+up*uT*.12;float e=.6;float n0=vn3(q);vec2 g=vec2(vn3(q+Tw*e)-n0,vn3(q+Bw*e)-n0);
 if(uQ3.y>.5){vec3 q2=vW*1.35-Tw*uT*1.9*run-up*uT*.3;float m0=vn3(q2);g+=.55*vec2(vn3(q2+Tw*.35)-m0,vn3(q2+Bw*.35)-m0)*(1.-smoothstep(40.,260.,dist));}
 vec3 N=normalize(up+(Tw*g.x+Bw*g.y)*(.55*nk+.08));
 float sunUp=dot(up,uSun);float day=smoothstep(-.18,.22,sunUp);float ndl=max(dot(N,uSun),0.);
 // the body of water: clear in the shallows, where the darker bed shows through, deeper and bluer further out
 float shal=1.-smoothstep(.0,uLake>.5?2.:1.,wd);float deep=smoothstep(.05,.7,edge)*(1.-shal*.85);
 vec3 body=mix(mix(uBed,uShal,.3+.4*(1.-shal)),uDeep,deep);body*=(.18+.82*day*(.35+.65*ndl));
 float fres=.04+.96*pow(1.-max(dot(N,V),0.),5.);
 vec3 Rf=reflect(-V,N);float re=dot(Rf,up);vec3 sky=mix(uSky,uSkyZ,pow(smoothstep(-.05,.85,re),.5))*(.1+.9*day);
 vec3 col=mix(body,sky,clamp(fres*.9+.08,0.,1.));
 // streaks of faster water down the middle
 float st=smoothstep(.62,.82,vn3(vec3(vRU.x*7.,vRU.y*2.2-uT*.9*run,3.)))*deep*(1.-uLake)*.12;col+=sky*st;
 vec3 Hh=normalize(uSun+V);col+=vec3(1.,.93,.8)*pow(max(dot(N,Hh),0.),mix(900.,300.,nk))*1.5*day;
 // a wet, foamy line where it meets the bank
 float fz=vn3(vW*.9+vec3(0.,uT*.4,0.));float fz2=vn3(vW*2.7-vec3(uT*.3,0.,uT*.2));float foam=(1.-smoothstep(.0,.05+fz*.12,wd))*(.25+.75*smoothstep(.3,.75,fz2*.6+fz*.4));
 col=mix(col,uFoamC*(.15+.85*day*max(ndl,.4)),foam*.6);
 float a=mix(.5,.93,smoothstep(0.,.7,wd));a=max(a,foam*.8);a*=smoothstep(0.,.04,edge)*smoothstep(0.,.03,wd+.01);
 col=mix(col,vec3(.86,.92,.96)*(.2+.8*day),uIce);a=mix(a,.98*smoothstep(0.,.05,edge),uIce);
 gl_FragColor=vec4(col,a);
#include <fog_fragment>
}`})}
const q3_rv0=rqRivers;
rqRivers=function(sp){q3_rv0(sp);if(!sp.ocean)return;const m=q3_waterMat(sp,{ice:sp.riverU&&sp.riverU.uIce});
 sp.scene.children.forEach(o=>{if(o.isMesh&&o.material&&o.material.customProgramCacheKey&&o.material.customProgramCacheKey()==='river'){o.userData.q3old=o.material;o.material=m;
  // the downstream direction at each vertex (the ribbon is laid as pairs of bank points from source to mouth)
  const P=o.geometry.attributes.position.array,n=P.length/6,T=new Float32Array(P.length);for(let i=0;i<n;i++){const a=Math.max(0,i-1)*6,b=Math.min(n-1,i+1)*6;let x=P[b]-P[a],y=P[b+1]-P[a+1],z=P[b+2]-P[a+2];const l=Math.hypot(x,y,z)||1;x/=l;y/=l;z/=l;for(const k of[0,3]){T[i*6+k]=x;T[i*6+k+1]=y;T[i*6+k+2]=z}}
  o.geometry.setAttribute('aT',new THREE.BufferAttribute(T,3))}})};
const q3_lk0=lake;
lake=function(la,lo,r,alt,col,eras){const g=q3_lk0(la,lo,r,alt,col,eras);const sp=BSP;if(!sp||!sp.ocean||sp.type!=='planet')return g;const ms=g.children[0];if(!ms||!ms.isMesh)return g;
 const c=col?C(col):C('#2f7f96');const m=q3_waterMat(sp,{lake:1,shal:'#'+c.clone().multiplyScalar(1.05).getHexString(),deep:'#'+c.clone().multiplyScalar(.45).getHexString(),bed:col?'#'+c.clone().multiplyScalar(.5).getHexString():'#3a4030'});
 ms.userData.q3old=ms.material;ms.material=m;ms.renderOrder=2;return g};

/* ---------------- buildings: masonry, planks, panels and tiles by kit, dirt toward the ground ----------------
   worked out in each building's own (unscaled) coordinates, so the courses line up on every copy of a kit */
const Q3KIT={dragon:0,white:1,silver:2,grand:3,forge:4,future:5};
const q3_tw0=towerMat;
towerMat=function(o){o=Object.assign({},o||{});const kit=o.kit;delete o.kit;const m=q3_tw0(o);const ob=m.onBeforeCompile;
 const K=Q3KIT[kit]!==undefined?Q3KIT[kit]:((o.metalness||0)>.45?6:7);m.userData.U.uKit={value:K};
 m.onBeforeCompile=sh=>{ob(sh);sh.uniforms.uKit=m.userData.U.uKit;sh.uniforms.uQ3=Q3Q;
  sh.vertexShader='varying vec3 q3LP,q3LN;\n'+sh.vertexShader.replace('#include <fog_vertex>','#include <fog_vertex>\nq3LP=position;q3LN=normal;');
  sh.fragmentShader='uniform float uKit;uniform vec4 uQ3;varying vec3 q3LP,q3LN;\n'+(sh.fragmentShader.indexOf('float vn3(')<0?GLSL_NOISE:'')+sh.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
 if(uQ3.z>.5){vec3 p=q3LP,n=normalize(q3LN);float fwp=length(fwidth(p));float kA=1.-smoothstep(.025,.11,fwp);
  vec3 c=diffuseColor.rgb;float lum=dot(c,vec3(.3,.59,.11));float s3=c.r+c.g+c.b+.001;
  float mxc=max(c.r,max(c.g,c.b)),sat=(mxc-min(c.r,min(c.g,c.b)))/(mxc+.001);
  // (window panes and other dark glass keep their own look)
  if(kA>0.&&lum>.07&&!(lum<.2&&sat<.3)){
   float u=abs(n.x)>abs(n.z)?p.z:p.x;float v=p.y;float wall=1.-smoothstep(.3,.55,abs(n.y));float flt=smoothstep(.96,.995,n.y);float slope=(1.-wall)*(1.-flt)*step(0.,n.y);
   float wood=smoothstep(.06,.14,(c.r-c.b)/s3)*(1.-smoothstep(.3,.42,lum));
   float met=step(1.5,uKit)*step(uKit,2.5)+step(3.5,uKit)*step(uKit,6.5);
   vec3 k=vec3(1.);
   // walls
   if(wall>0.){
    if(met<.5){vec2 bs=uKit<.5||uKit>6.5?vec2(.56,.3):uKit<1.5?vec2(1.,.46):vec2(1.2,.6);float jw=uKit<.5||uKit>6.5?.045:uKit<1.5?.03:.018;
     float row=floor(v/bs.y);float uu=u/bs.x+row*.5;float cell=floor(uu);vec2 f=vec2(fract(uu),fract(v/bs.y));
     float jn=1.-smoothstep(0.,jw/bs.x,min(f.x,1.-f.x))*smoothstep(0.,jw/bs.y,min(f.y,1.-f.y));
     float h=fract(sin(dot(vec2(cell,row),vec2(12.9898,78.233)))*43758.5453);
     float sv=uKit<.5||uKit>6.5?.16:uKit<1.5?.08:.05;
     k=vec3(1.+(h-.5)*sv)*(1.-jn*(uKit>2.5&&uKit<3.5?.12:.3));
     if(uKit>2.5&&uKit<3.5)k*=1.-.06*smoothstep(.6,.9,vn3(p*vec3(2.,6.,2.)));}
    else{vec2 ps=uKit<4.5?vec2(.75,.95):uKit<5.5?vec2(.6,1.05):vec2(.8,1.2);float row=floor(v/ps.y);float uu=u/ps.x+(uKit<4.5?row*.5:0.);vec2 f=vec2(fract(uu),fract(v/ps.y));
     float sm2=1.-smoothstep(0.,.025/ps.x,min(f.x,1.-f.x))*smoothstep(0.,.025/ps.y,min(f.y,1.-f.y));float h=fract(sin(dot(vec2(floor(uu),row),vec2(12.9898,78.233)))*43758.5453);
     k=vec3(1.+(h-.5)*.07)*(1.-sm2*.32);
     if(uKit>3.5&&uKit<4.5){vec2 rv=abs(f-.5)-vec2(.5-.07/ps.x,.5-.07/ps.y);float rd=length(max(rv,0.)*ps);k*=1.-.35*(1.-smoothstep(.015,.035,rd))*step(0.,min(rv.x,rv.y));
      k*=1.-.14*smoothstep(.45,.8,vn3(vec3(u*3.,v*.35,1.7)))*(1.-smoothstep(0.,3.,v));}
     else k*=.97+.06*vn3(vec3(u*.6,v*14.,3.));}
    // rain streaks and a little dirt toward the ground
    k*=1.-.08*smoothstep(.5,.85,vn3(vec3(u*2.2,v*.25,5.)));}
   // wood: boards with dark gaps and a grain along them
   if(wood>0.){float bw=.24;float bb=fract(u/bw);float gap=1.-smoothstep(0.,.06,min(bb,1.-bb));float gr=vn3(vec3(u*9.,v*1.2,floor(u/bw)*3.1));
    k=mix(k,vec3((1.-gap*.4)*(.86+.28*gr)),wood*wall+wood*flt*.5);}
   // roofs: rows of tiles (stone and timber kits) or standing seams (metal ones)
   if(slope>0.){float tr=.22;float rv2=v/tr;float row=floor(rv2);float fr=fract(rv2);
    if(met<.5){float uu=u/.3+row*.5;float sx=fract(uu);float seamx=1.-smoothstep(0.,.08,min(sx,1.-sx));float h=fract(sin(dot(vec2(floor(uu),row),vec2(41.3,17.9)))*43758.5453);
     k=mix(k,vec3((.74+.26*smoothstep(0.,.8,fr))*(1.-seamx*.25)*(.92+.16*h)),slope);}
    else{float sx=fract(u/.5);float seam=1.-smoothstep(0.,.05,min(sx,1.-sx));k=mix(k,vec3(1.-seam*.3)*(.96+.08*vn3(p*4.)),slope);}}
   if(flt>0.)k=mix(k,vec3(.9+.18*vn3(p*1.7)),flt*(1.-met*.6));
   float dirt=(1.-smoothstep(.2,1.25,v+(vn3(p*2.3)-.5)*.5))*(1.-flt);
   c*=mix(vec3(1.),k,kA);c=mix(c,c*vec3(.7,.64,.56),dirt*.55*kA+dirt*.25*(1.-kA));
   diffuseColor.rgb=c;}}`)};
 m.customProgramCacheKey=()=>'tower3';return m};

/* ---------------- per planet, per frame ---------------- */
const q3_gs0=getSpace;
getSpace=function(id){const had=!!SP[id];const sp=q3_gs0(id);if(!had&&sp&&sp.type==='planet')anim(sp,null,()=>q3_step(sp));return sp};
function q3_step(sp){if(CUR!==sp)return;const T=Q3T[q3_tier()];const Q=Q3Q.value;
 if(!window.__q3Q){Q.x=T.cloud;Q.y=T.water;Q.z=T.bld;Q2Q.value.z=T.bld}if(window.__q3rock!==undefined)Q2Q.value.z=window.__q3rock;}
