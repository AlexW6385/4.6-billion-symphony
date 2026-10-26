/* ================================================================
   review fixes, set A (step 4): the ground of towns, the ground cover seen from the air, building light and
   façades, a camera that stays out of walls and pillars, every space with its own remembered age, the ark,
   虚民母球's metal ground and oasis, and a few small things the review found.
   every top-level name here starts with q4a_ (all sources share one scope)
   ================================================================ */

/* ---------- 1 · town ground: trodden earth with a third of the turf left, ragged at the edge ---------- */
/* how trodden the ground is at d (0..1): all through the middle of a town, fading out with a noisy edge short of the wall.
   (q2_jobStep stores it per patch vertex; q2_clear separately keeps 30% of the grass, and q2_grassFill makes it short) */
function q4a_town(towns,d){let t=0;const px=d.x*R,py=d.y*R,pz=d.z*R;
 for(const e of towns){const a=angDeg(d,e.d)/e.deg;if(a>1.25)continue;
  const nz=q2n(px/9+1.7,py/9,pz/9)-.5;const k=1-sm(.5,1.06,a+nz*.34);if(k<=0)continue;
  const k2=q2n(px/3.1,py/3.1+4.2,pz/3.1);t=Math.max(t,k*(.55+.45*k2))}
 return t}
/* the patch colour of a trodden vertex: toward a warm earth, lighter where the ground was light (snow, sand) */
function q4a_tread(B,vi,tw){for(const A of[B.ca,B.cb]){const r=A[vi*3],g=A[vi*3+1],b=A[vi*3+2];const l=r*.3+g*.59+b*.11;const s=.72+.5*l;const k=tw*.85;
 A[vi*3]=r+(.56*s-r)*k;A[vi*3+1]=g+(.47*s-g)*k;A[vi*3+2]=b+(.35*s-b)*k}}
/* the fields outside a town are drawn with the planet's own ground material (same light, same detail texture as the turf) */
function q4a_fieldMat(sp){const tm=sp.terr.material;
 const m=q2_planetMat(new THREE.MeshStandardMaterial({vertexColors:true,roughness:tm.roughness,metalness:tm.metalness,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1}),{U:sp.TU,bump:(tm.bumpScale||1)*.6});
 m.envMapIntensity=tm.envMapIntensity;m.userData.envSet=1;return m}

/* ---------- 2 · ground cover from the air: blades lit like the ground, shorter, lighter and fewer above ~90 ---------- */

function makeCover(sp,fn){const cover=q2_makeCover(sp,fn);try{q4a_coverFix(sp,cover)}catch(e){console.warn('q4a cover',e)}return cover}
function q4a_coverFix(sp,cover){
 // the blades' normals lean up (once, on the shared geometry): seen from above they then take the ground's light instead of
 // the dark of their own sideways faces, which read as black scratches
 if(COVERG&&!COVERG.q4a){COVERG.q4a=1;for(const k of['tuft','tall','reed']){const g=COVERG[k];if(!g)continue;const N=g.attributes.normal;
  for(let i=0;i<N.count;i++){const x=N.getX(i)*.35,y=N.getY(i)*.35+.8,z=N.getZ(i)*.35;const l=Math.hypot(x,y,z)||1;N.setXYZ(i,x/l,y/l,z/l)}N.needsUpdate=true}}
 const U={uQ4H:{value:1},uQ4L:{value:0}};
 for(const g of cover.groups){if(g.k!=='tuft'&&g.k!=='tall')continue;g.n0=g.n;const m=g.im.material;const ob=m.onBeforeCompile;
  m.onBeforeCompile=sh=>{ob(sh);Object.assign(sh.uniforms,U);
   sh.vertexShader='uniform float uQ4H;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ntransformed.y*=uQ4H;');
   sh.fragmentShader='uniform float uQ4L;\n'+sh.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\ndiffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*1.1+vec3(.03,.035,.015),uQ4L);')};
  m.customProgramCacheKey=()=>'sway2q4a'+g.k}
 anim(sp,null,()=>{const f=sm(90,260,rig.alt);U.uQ4H.value=1-.55*f;U.uQ4L.value=f*.6;for(const g of cover.groups){if(g.n0===undefined)continue;g.n=Math.max(40,Math.round(g.n0*(1-.8*f)))}})}

/* ---------- 4 · buildings: a sky-light fill on the shaded side, rows of windows on the glass-and-steel kits ---------- */
const Q4FILL={value:new THREE.Color(.1,.1,.1)};

function q4a_towerMat(o){const m=q3_towerMat(o);const ob=m.onBeforeCompile;
 m.onBeforeCompile=sh=>{ob(sh);sh.uniforms.uQ4Fill=Q4FILL;
  // the world-space scale of this copy along its own axes, so the windows keep their size on a kit stretched four times taller
  sh.vertexShader='varying vec3 q4S;\n'+sh.vertexShader.replace('#include <fog_vertex>','#include <fog_vertex>\n#ifdef USE_INSTANCING\nmat3 q4m=mat3(modelMatrix*instanceMatrix);\n#else\nmat3 q4m=mat3(modelMatrix);\n#endif\nq4S=vec3(length(q4m[0]),length(q4m[1]),length(q4m[2]));');
  sh.fragmentShader='uniform vec3 uQ4Fill;varying vec3 q4S;float q4win=0.;\n'+sh.fragmentShader
   // the glass-and-steel kits (尔什's towns, 虚民母球's towers): bays of windows laid out in metres on the building's own faces,
   // from its foot up; dark glass by day, most of them lit after dark
   .replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
 if(uKit>4.5&&uKit<6.5){vec3 nl=normalize(q3LN);float wall=1.-smoothstep(.3,.55,abs(nl.y));float lum=dot(diffuseColor.rgb,vec3(.3,.59,.11));
  if(wall>0.&&lum>.45){vec3 p=q3LP*q4S;float u=abs(nl.x)>abs(nl.z)?p.z:p.x;float v=p.y;vec2 cs=vec2(1.05,1.2);vec2 f=fract(vec2(u,v)/cs);float fw=length(fwidth(vec2(u,v)))/cs.x;
   float aa=max(fw*1.5,.02);float wx=smoothstep(.24-aa,.24+aa,f.x)*(1.-smoothstep(.74-aa,.74+aa,f.x)),wy=smoothstep(.26-aa,.26+aa,f.y)*(1.-smoothstep(.68-aa,.68+aa,f.y));
   q4win=wx*wy*wall*(1.-smoothstep(.12,.3,fw))*step(.3,v);
   diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.15,.19,.25),q4win*.85);roughnessFactor=mix(roughnessFactor,.18,q4win);}}`)
   .replace('#include <metalnessmap_fragment>','#include <metalnessmap_fragment>\nmetalnessFactor=mix(metalnessFactor,.1,q4win);')
   // the fill: what the sky and the ground throw back onto walls (a little more on surfaces that face up)
   .replace('#include <emissivemap_fragment>',`#include <emissivemap_fragment>
 totalEmissiveRadiance+=diffuseColor.rgb*uQ4Fill*(.7+.3*max(dot(normalize(vWN),normalize(vWP)),0.));`)
   // the scattered specks of light stay for the other kits; the window bays light up by their own dice
   .replace('totalEmissiveRadiance+=uWin*win*(.08+.75*uNight)*(.55+.45*h);','totalEmissiveRadiance+=uWin*win*(.08+.75*uNight)*(.55+.45*h)*(1.-step(4.5,uKit)*step(uKit,6.5));{vec3 nl2=normalize(q3LN);vec3 p2=q3LP*q4S;vec2 cq=floor(vec2(abs(nl2.x)>abs(nl2.z)?p2.z:p2.x,p2.y)/vec2(1.05,1.2));float h2=fract(sin(dot(cq,vec2(12.9898,78.233)))*43758.5453);totalEmissiveRadiance+=uWin*q4win*step(.42,h2)*(.04+.8*uNight)*(.6+.4*h2);}')};
 m.customProgramCacheKey=()=>'tower4';return m}

/* ---------- 5 · the camera keeps out of walls, pillars, roots and ridges ----------
   after the rig has placed the camera: a few rays from just above the point looked at back toward the camera, against the solid
   things near it (the same short list the view-clearing uses, less foliage); the camera slides in along its own arm to the first
   thing hit, quickly, and eases back out when the way is clear again */
const Q4P={L:null,t:0,c:V3(),k:0,sp:null,by:new Map()},_q4r=new THREE.Raycaster(),_q4a=V3(),_q4b=V3(),_q4c=V3(),_q4h=[];
function q4a_solids(sp,P,rr){const L=occList(P,rr),out=[];Q4P.by.clear();
 for(const e of L){const m=Array.isArray(e.material)?e.material[0]:e.material;if(!m)continue;const src=e.src||e;if(src===sp.ocean||src.userData.noPush||src.isPoints||src.isSprite)continue;
  // the thing being looked at, and anything alive and moving, never pushes the camera (its moving body made the view pump in and out)
  {let v=src,skip=false;while(v){const u=v.userData;if(u&&((sel&&u.pick===sel)||u.anim||u.herd)){skip=true;break}v=v.parent}if(skip)continue}
  const key=m.customProgramCacheKey?m.customProgramCacheKey():'';if(/sway|q2grass|q2flw/.test(key))continue;out.push(e);Q4P.by.set(src,e)}
 if(sp.terr&&!Q4P.by.has(sp.terr)){out.push(sp.terr);Q4P.by.set(sp.terr,sp.terr)}return out}
/* is the camera inside the thing this ray entered? the ray back from the camera toward the entry point finds no face of it
   if so (its inside faces are not drawn, nor hit); a thing wholly between the camera and the ground is left alone */
function q4a_inside(h,dist){const e=Q4P.by.get(h.object);if(!e)return false;_q4h.length=0;const o=_q4r.ray.origin,d=_q4r.ray.direction;
 const o0=o.clone(),d0=d.clone();o.copy(o0).addScaledVector(d0,dist);d.negate();_q4r.far=dist-h.distance+.1;/* (the entry face is a back face from this side, so only a real exit counts; +.1 keeps a grazing clip from reading as inside) */e.raycast(_q4r,_q4h);o.copy(o0);d.copy(d0);_q4r.far=dist;
 let gap=1e9;for(const q of _q4h)if(q.distance<_q4r.far&&(h.instanceId===undefined||q.instanceId===h.instanceId)&&q.distance<gap)gap=q.distance;
 return gap>1e8||gap<4}// (no face found on the way back: inside it; a face close behind the lens counts too)
function q4a_push(){const sp=CUR;if(!sp||sp.type!=='planet'||sp.camOv||window.__view||window.__q4nopush){Q4P.k=0;return}if(tw){Q4P.k*=.85;return}const alt=rig.alt;if(alt>160){Q4P.k=0;return}
 const now=performance.now();
 if(!Q4P.L||Q4P.sp!==sp||now-Q4P.t>1500||Q4P.c.distanceTo(TG)>30){Q4P.sp=sp;Q4P.t=now;Q4P.c.copy(TG);try{Q4P.L=q4a_solids(sp,TG,Math.max(80,alt*2.5))}catch(e){Q4P.L=[]}}
 _q4a.copy(TG).addScaledVector(UP,1.2);_q4b.copy(camera.position).sub(_q4a);const dist=_q4b.length();if(dist<3||!Q4P.L.length){Q4P.k*=.8;return}_q4b.divideScalar(dist);
 _q4r.near=0;_q4r.far=dist;_q4r.camera=camera;let best=dist;
 _q4c.crossVectors(_q4b,UP);const side=_q4c.lengthSq()>1e-6?_q4c.normalize():null;
 for(let s=-1;s<=1;s++){if(s!==0&&!side)continue;_q4r.ray.origin.copy(_q4a);if(s!==0)_q4r.ray.origin.addScaledVector(side,s*1.1);_q4r.ray.direction.copy(_q4b);_q4r.far=dist;
  const hits=_q4r.intersectObjects(Q4P.L,false);let n=0;for(const h of hits){if(h.distance<=.5)continue;if(++n>4)break;const ins=q4a_inside(h,dist);if(window.__q4dbg)window.__q4dbg.push([s,+h.distance.toFixed(1),+dist.toFixed(1),h.object.geometry&&h.object.geometry.type,h.instanceId,ins,_q4h.length]);if(ins){if(h.distance<best)best=h.distance;break}}}
 const want=best<dist?Math.max(dist*.12,best-1.6):dist;const tgt=1-want/dist;
 // eased, and small changes ignored, so a ray grazing a surface cannot make the view twitch
 if(Math.abs(tgt-Q4P.k)>.04)Q4P.k+=(tgt-Q4P.k)*(tgt>Q4P.k?.25:.06);else if(tgt<.01)Q4P.k*=.9;
 if(Q4P.k>1e-3){camera.position.copy(_q4a).addScaledVector(_q4b,dist*(1-Q4P.k));camera.lookAt(TG);camera.updateMatrixWorld()}}

function cutStep(dt){try{q4a_push();q4a_fill()}catch(e){}cutStepBase(dt)}
/* the building fill follows the sun of the world you are in */
function q4a_fill(){const sp=CUR;if(!sp)return;if(sp.type==='planet'&&sp.sunL){const d=sp.dayK===undefined?1:sp.dayK;Q4FILL.value.copy(sp.sunL.color).multiplyScalar(sp.sunL.intensity*.19*(.3+.7*d));Q4FILL.value.addScalar(.02)}else Q4FILL.value.setScalar(.1)}

/* ---------- 8 · 虚民母球: a metal planet, not a glossy patchwork; its one green oasis has grass and mixed trees ---------- */

function makePlanet(id,cfg){if(id==='ximin')Object.assign(cfg,{rough:.68,metal:.1,plate:1,atm:'#8a9aaa',atmK:.5,mott:.6,hemiSky:0xc0ccd8});
 const sp=makePlanetBase(id,cfg);
 if(id==='ximin')makeCover(sp,q4a_ximinBiome);
 return sp}
function q4a_ximinBiome(d,h,lat,e,W){const oa=angDeg(d,XOAS);if(oa>4.6||h<2.2)return;const k=1-sm(3.4,4.6,oa);W.tuft=.55*k;W.tuftC='#ffffff';W.flower=.05*k;W.flowerC=['#f4e6a0','#ffffff','#e9a0c0'][(h*7|0)%3];W.rock=.03;if(n3(d.x*40,d.y*40,d.z*40)>.62){W.fern=.25*k}}
/* the ground colour: soft grey districts instead of hard-edged cells, dark seams of the old streets, the oasis blending out over its rim */
function ximinC(p,h,lat,out){if(h<0){out.set('#163a4a').lerp(C('#071a26'),sm(-2,-40,h));return}if(h<2.2){out.set('#8a8a84');return}
 const oa=angDeg(p,XOAS);if(oa<4.6){const k=1-sm(3.3,4.6,oa);const g=C('#5f8a48').lerp(C('#3f7a40'),n3(p.x*40,p.y*40,p.z*40)).lerp(C('#8a8a5a'),sm(.55,.8,n3(p.x*22+3,p.y*22,p.z*22))*.5);
  out.set('#6a6e70').lerp(C('#848a8c'),n3(p.x*50,p.y*50,p.z*50)*.5).lerp(g,k);return}
 const[la,lo]=llDir(p);const cell2=h3(Math.floor((la+90)/2.2),Math.floor((lo+180)/2.2),5);
 const dist=n3(p.x*2.3+9,p.y*2.3,p.z*2.3),dist2=n3(p.x*5.1,p.y*5.1+2,p.z*5.1);
 out.set('#5f6870').lerp(C('#848e96'),n3(p.x*50,p.y*50,p.z*50)*.5).lerp(C('#767472'),sm(.35,.7,dist)*.4).lerp(C('#4e565e'),sm(.6,.85,dist2)*.4)
  .lerp(C('#a2a6aa'),cell2>.84?.25:0).lerp(C('#3a3e44'),cell2<.1?.3:0).lerp(C('#7a7466'),sm(.55,.8,n3(p.x*7,p.y*7,p.z*7))*.25);
 if(angDeg(p,XCOR)<4)out.lerp(C('#141418'),1-sm(2,4,angDeg(p,XCOR)))}
/* the plating: panels in a grid on every face, dark seams between them, each panel its own shade, rust in the hollows */

function q2_planetMat(m,o){o=o||{};const plate=!!(o.plate||(BSP&&BSP.cfg&&BSP.cfg.plate));const r=q2_planetMatBase(m,o);if(!plate)return r;
 const ob=r.onBeforeCompile,ck=r.customProgramCacheKey;
 r.onBeforeCompile=sh=>{ob(sh);sh.fragmentShader=sh.fragmentShader.replace(' diffuseColor.rgb=col;',`
 {float pk=(1.-rk)*(1.-q2sn)*land*(1.-veg)*(1.-sand);
  vec3 pp=vOP*.21;vec3 fp=fract(pp);vec3 cp=floor(pp);float fwp=length(fwidth(vOP))*.21;float swd=max(.035,fwp*1.6);
  vec3 ln=1.-smoothstep(vec3(0.),vec3(swd),min(fp,1.-fp));
  float seam=q2w.x*max(ln.y,ln.z)+q2w.y*max(ln.x,ln.z)+q2w.z*max(ln.x,ln.y);seam*=1.-smoothstep(.1,.3,fwp);
  float hsh=fract(sin(dot(cp,vec3(12.9898,78.233,37.719)))*43758.5453);
  vec3 pc=col*(.86+.26*hsh)*(.9+.2*vn3(vOP*.035));
  pc=mix(pc,pc*vec3(1.1,.88,.7),smoothstep(.62,.86,q2M.a)*.45*(1.-smoothstep(0.,.25,fwp)));
  pc*=1.-seam*.4;col=mix(col,pc,pk*.9);}
 diffuseColor.rgb=col;`)};
 r.customProgramCacheKey=()=>ck()+'p';return r}

/* ---------- 9 · 方舟: three island-sized vessels (卷二《远航的准备》): a rock-shell hull nearly four hundred metres long, tiers of
   decks joined by passages, the top one open under the sky with soil, rocky hills whose flat round tops open for the troops, warm
   stones among them, 冥河巨炮 round the rim, fins and water jets below, and the warm light of the holds through the shell ---------- */
function q4a_bArk(f){const g=new THREE.Group();const Rn=rnd(hashStr(f.w||'ark')+3);
 const shell='#5e5d58',shellD='#45443f',rock='#716b62',earth='#665846',snow='#dfe5e8';
 // the hull: a long flattened lens, darker below the waterline, ringed by the shell's plates
 const P=[[tg(sgeo(24).clone(),{s:[2.3,.34,.74]}),shell,{p:[0,.02,0]}],[tg(sgeo(16).clone(),{s:[2.34,.14,.78]}),shellD,{p:[0,-.16,0]}]];
 for(let i=0;i<7;i++)P.push([kcy(.5,.5,.04,14),shellD,{p:[-1.3+i*.45,.0,0],r:[0,0,Math.PI/2],s:[1,1,1]}]);
 // two tiers above it, the upper one soil under open sky
 P.push([tg(sgeo(20).clone(),{s:[1.9,.14,.58]}),rock,{p:[0,.36,0]}],[tg(sgeo(20).clone(),{s:[1.5,.11,.46]}),earth,{p:[0,.5,0]}]);
 // passages up through the tiers, ventilation stacks, the rim's cannon
 for(let i=0;i<8;i++){const a=i/8*6.283;P.push([kcy(.03,.045,.2,6),'#4a4f52',{p:[Math.cos(a)*1.72,.48,Math.sin(a)*.5],r:[Math.sin(a)*.7,0,-Math.cos(a)*.7]}])}
 for(let i=0;i<5;i++)P.push([kcy(.05,.07,.16,7),shellD,{p:[-1.4+i*.6,.52,(i%2?.3:-.3)]}]);
 // rocky hills on the deck, flat round tops, some snow on them (it is the age of snow), two warm from the stones inside
 const hills=[];for(let i=0;i<7;i++){const x=-1.05+i*.35+(Rn()-.5)*.15,z=(Rn()-.5)*.5,rb=.16+Rn()*.12,hh=.22+Rn()*.3;hills.push([x,z,rb,hh]);
  P.push([kcy(rb*.45,rb,hh,8),rock,{p:[x,.56+hh/2,z]}]);P.push([kcy(rb*.5,rb*.56,.02,8),i%3===1?'#4a4038':snow,{p:[x,.56+hh+.01,z]}]);
  if(i%2)P.push([tg(sgeo(10).clone(),{s:[rb*.9,.035,rb*.8]}),snow,{p:[x+rb*.3,.59,z+rb*.3]}])}
 // low stone walls and planted plots between the hills, the dragons' fields on the shark's back
 for(let i=0;i<9;i++){const x=-1.2+Rn()*2.4,z=(Rn()-.5)*.66;P.push([kb(.2+Rn()*.2,.015,.12+Rn()*.1),i%2?'#7d8a4e':'#8c7a5a',{p:[x,.585,z],r:[0,Rn()*3,0]}])}
 // fins for steering, a tail fin, the jets' housings
 P.push([kb(.8,.03,.5),'#505c5a',{p:[.3,-.05,.8],r:[0,-.2,-.15]}],[kb(.8,.03,.5),'#505c5a',{p:[.3,-.05,-.8],r:[0,.2,-.15]}],[tg(kc(.26,.7,4),{r:[0,0,Math.PI/2]}),'#505c5a',{p:[-2.5,.02,0],s:[1,.5,1]}]);
 for(let i=0;i<3;i++)P.push([kcy(.08,.1,.3,8),shellD,{p:[-2.25,-.1,(i-1)*.3],r:[0,0,Math.PI/2]}]);
 const body=new THREE.Mesh(G(P),VC({roughness:.9}));body.castShadow=true;body.receiveShadow=true;g.add(body);
 // the holds' light through ports along the tiers, warm; the warm stones glow on two hilltops
 const W=[];for(let s=-1;s<=1;s+=2)for(let i=0;i<9;i++){const t=i/8;const x=-1.5+t*3,z=s*(.6-Math.abs(t-.5)*.18);W.push([kb(.05,.025,.02),'#ffd090',{p:[x,.26,z]}])}
 const win=new THREE.Mesh(G(W),new THREE.MeshStandardMaterial({vertexColors:true,emissive:'#ffc880',emissiveIntensity:.9,roughness:.6}));win.userData.noSkin=1;g.add(win);
 hills.forEach((h,i)=>{if(i%3!==1)return;const s=glowSprite('#ff9a50',.45,.55);s.position.set(h[0],.6+h[3],h[1]);g.add(s)});
 const pl=new THREE.PointLight(0xffc080,.6,40);pl.position.y=1;g.add(pl);
 g.userData.swim=1;return g}


/* ---------- 10 · the 雕像 egg waits for the camera to settle (it used to fire on arrival, under the title) ---------- */
let q4a_emT=0;
function q4a_emeraldEgg(sp){if(tw||busy){q4a_emT=0;return}const p=sp.prox.find(q=>q.w.id==='emeraldcity');if(!(p&&camera.position.distanceTo(p.pos)<34)){q4a_emT=0;return}
 const now=performance.now();if(!q4a_emT)q4a_emT=now;else if(now-q4a_emT>2200)egg('emerald')}

/* ---------- 7 · dusk haze: away from the low sun the haze goes cooler and a little darker, so the sea keeps its depth ---------- */

function q3_fogStep(){q3_fogStepBase();const sp=CUR;if(!sp||sp.type!=='planet')return;const g=sp.goldK||0;if(g>0){Q3FOG.q3FC.value.multiplyScalar(1-.22*g);Q3FOG.q3FC.value.b*=1+.08*g;Q3FOG.q3FW.value.multiplyScalar(1+.06*g)}}

window.__q4a={push:Q4P,fill:Q4FILL,town:q4a_town};
