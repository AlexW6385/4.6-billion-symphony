/* ================================================================
   model quality, step 5 (q5m): the generic creature builders most herds and many entries still use, brought toward the
   standard of 32_anatomy.js on a strict budget, because the exhibition runs smooth first:
   · at most about twice the triangles of the body each one replaces, and about as many draws: every part that does not
     move against its own joint is folded into one mesh per material (q5m_fuse, run at the end of each builder)
   · lofted bodies with a darker back, jointed legs whose feet reach the ground, heads with eyes and jaws, tapering tails,
     wings with a leading-edge bone or veins, antennae and mandibles on the insects
   · each builder keeps its interface (same f/opts, userData.anim/legs/wings/tails/jaw/swim, about the same size, feet on
     y=0, the creature's own colour on the materials other files look for and recolour), so herds, picking, skinify, bake
     and the entries built on top of them keep working; the old functions stay reachable as q5m_*0
   · 苔螈 and the small four-legged default · 沙漠蝎 (no sting, eight eyes), 深沙巴士 and the plain scorpion · 黑角巨蠊, 裂地者 and the plain
     beetle · 冲锋者, 邓氏鱼, 闪耀鳗 and the plain fish (毛鲸 keeps its old body) · 海空水母 (the white dragons' basket) and the plain jellyfish ·
     巨脉蜻蜓, 巨蜂 and 轰炸者 (a dragonfly body with gas sacs where the wings would be, a thick bomb-making tail) · 炸弹翼龙
     (toothless beak, wings on arm and finger bones) · 立蝎 · the squid · 巨轮虫 · swarms as small flapping bodies ·
     the mound huts · the dragon-style street carts, crates and lamps
   ================================================================ */
const q5m_DARK=M('#141210',{roughness:.3}),q5m_EYEW=M('#f4f2ec',{roughness:.25}),q5m_TOOTH=M('#efe8d6',{roughness:.35});
const q5m_fm=new THREE.Matrix4();
/* geometry is shared: a herd builds the same body several times, and each build would otherwise loft, tessellate and
   merge it all again (the parts only differ by material). Everything made through q5m_gc is marked shared and never
   changed afterwards; q5m_fuse reuses a merge whose parts are all shared */
const q5m_GC=new Map();function q5m_gc(k,mk){let g=q5m_GC.get(k);if(!g){g=mk();g.userData.q5m=1;q5m_GC.set(k,g)}return g}
const q5m_nk=a=>a.map(v=>typeof v==='number'?+v.toFixed(4):v).join(',');
function q5m_cone(r,h,mat,seg){return new THREE.Mesh(q5m_gc('co'+q5m_nk([r,h,seg||7]),()=>new THREE.ConeGeometry(r,h,seg||7)),mat)}
function q5m_cyl(r0,r1,h,mat,seg){return new THREE.Mesh(q5m_gc('cy'+q5m_nk([r0,r1,h,seg||8]),()=>new THREE.CylinderGeometry(r0,r1,h,seg||8)),mat)}
function q5m_mus(l,r,prof,seg){const g=muscle(l,r,prof,seg);g.userData.q5m=1;return g}
function q5m_box(a,b,c){return q5m_gc('bx'+q5m_nk([a,b,c]),()=>new THREE.BoxGeometry(a,b,c))}
function q5m_sphG(...a){return q5m_gc('sp'+q5m_nk(a),()=>new THREE.SphereGeometry(...a))}
function q5m_wg(span,chord,kind,rx){return q5m_gc('wg'+q5m_nk([span,chord,kind,rx||0]),()=>{const g=wingGeo(span,chord,kind);if(rx)g.rotateX(rx);return g})}
/* round beads: icosahedra (the segment boost leaves them alone) with smooth normals; 20 triangles at detail 0, 80 at 1 */
const q5m_IG=[];function q5m_ico(d){if(!q5m_IG[d]){const g=new THREE.IcosahedronGeometry(1,d),p=g.attributes.position,n=g.attributes.normal,v=V3();for(let i=0;i<p.count;i++){v.set(p.getX(i),p.getY(i),p.getZ(i)).normalize();n.setXYZ(i,v.x,v.y,v.z)}g.userData.q5m=1;q5m_IG[d]=g}return q5m_IG[d]}
function q5m_bead(r,mat,d){const m=new THREE.Mesh(q5m_ico(d||0),mat);m.scale.setScalar(r);return m}
function q5m_pale(col,k){return C(col).lerp(C('#efe8d4'),k===undefined?.45:k).getStyle()}
function q5m_dk(col,k){return C(col).multiplyScalar(k===undefined?.6:k).getStyle()}
/* the loft skin: the creature's own colour sits on the material (other files find it and recolour it by that colour); the
   vertex colours only shade it — a darker back, stripes and spots */
const q5m_SK={};function q5m_skin(col,o){o=o||{};const k=col+'|'+(o.rough||.6)+'|'+(o.metal||0)+'|'+(o.em||'')+'|'+(o.emI||0);
 return q5m_SK[k]||(q5m_SK[k]=new THREE.MeshStandardMaterial({color:col,vertexColors:true,roughness:o.rough||.6,metalness:o.metal||0,emissive:o.em||'#000000',emissiveIntensity:o.em?(o.emI||.35):0}))}
function q5m_loft(spec,col,o){o=o||{};const lo=Object.assign({},o,{back:o.backK||'#cfcac0',belly:o.bellyK||'#ffffff',spotC:o.spotK||'#6a6660'});delete lo.mat;
 const g=o.fresh?loftGeo(spec,lo):q5m_gc('lf'+JSON.stringify(spec)+JSON.stringify(lo),()=>loftGeo(spec,lo));return new THREE.Mesh(g,o.mat||q5m_skin(col,o))}
/* a thin ribbon along a path (fins, frills): a loft that is tall and almost flat */
function q5m_ribbon(pts,h,col,o){return q5m_loft(pts.map((p,i)=>[p[0],p[1],p[2],typeof h==='function'?h(i/(pts.length-1)):h,.012]),col,Object.assign({n:Math.max(4,pts.length*2),r:4},o||{}))}
function q5m_eyes(par,x,y,z,r,mat,d){for(const s of[-1,1]){const e=q5m_bead(r,mat||q5m_DARK,d===undefined?1:d);e.position.set(x,y,s*z);par.add(e)}}
/* a thin whip (antennae, bones): three sides, which the segment boost leaves as they are */
function q5m_tube(pts,r,mat,n){return new THREE.Mesh(q5m_gc('tb'+q5m_nk(pts.flatMap(p=>[p.x,p.y,p.z]).concat([r,n||6])),()=>new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),n||6,r,3,false)),mat)}
/* a jointed leg for the +z side (mirror it with scale.z=-1): the femur rises out from the hip, the tibia and the tarsus reach
   down so the tip lands on the ground h below the hip. hip.rotation.z is the fore-and-aft splay (the walk swings round it),
   userData.knee the tibia joint (lowering its rotation.x lifts the foot). o: up femur rise, tar tarsus angle from the
   vertical, rz splay, spines, toes, knee (a bead at the knee) */
function q5m_ileg(l1,l2,l3,r,mat,o){o=o||{};const up=o.up===undefined?.4:o.up,g2=o.tar===undefined?.8:o.tar,rz=o.rz||0,H=(o.h||.4)/Math.max(.5,Math.cos(rz));
 const ext=o.toes?r*.55:r*.75*Math.cos(g2);let cb=(H+l1*Math.sin(up)-l3*Math.cos(g2)-ext)/l2;cb=Math.min(1,Math.max(-.3,cb));const b=Math.acos(cb);
 const hip=new THREE.Group();hip.rotation.z=rz;const g=new THREE.Group();hip.add(g);g.rotation.x=-(Math.PI/2+up);g.add(new THREE.Mesh(q5m_mus(l1,r,[1,1.1,.92,.78],6),mat));
 const k=new THREE.Group();k.position.y=-l1;k.rotation.x=Math.PI/2+up-b;g.add(k);if(o.knee)k.add(q5m_bead(r*.85,mat));k.add(new THREE.Mesh(q5m_mus(l2,r*.8,[1,.82,.58],6),mat));
 for(let i=0;i<(o.spines||0);i++){const s=q5m_cone(r*.22,r*1.1,mat,3);s.position.set(0,-l2*(.35+i*.3),-r*.45);s.rotation.x=.6;k.add(s)}
 const a=new THREE.Group();a.position.y=-l2;a.rotation.x=b-g2;k.add(a);a.add(new THREE.Mesh(q5m_mus(l3,r*.45,[1,.62],6),mat));
 if(o.toes){const ft=new THREE.Group();ft.position.y=-l3;ft.rotation.x=g2;a.add(ft);const pad=q5m_bead(1,mat);pad.scale.set(r*1.3,r*.4,r*1.15);pad.position.y=-r*.15;ft.add(pad);
  for(let i=0;i<o.toes;i++){const u=(i/(o.toes-1)-.5)*1.5;const d=V3(Math.sin(u),-.12,Math.cos(u)).normalize();const t=q5m_cone(r*.2,r*1.5,o.toeMat||mat,4);t.quaternion.setFromUnitVectors(V3(0,1,0),d);t.position.copy(d).multiplyScalar(r*1.15);t.position.y-=r*.2;ft.add(t)}}
 else{const cl=q5m_cone(r*.25,r*.9,o.clawMat||mat,4);cl.position.y=-l3-r*.3;cl.rotation.z=Math.PI;a.add(cl)}
 hip.userData.knee=k;hip.userData.len=l1+l2+l3;return hip}
/* walk cycle for jointed legs: each hip swings round its own splay, the foot lifts on the forward swing */
function q5m_crawl(g,o){o=o||{};const fq=o.fq||8,amp=o.amp||.35,lift=o.lift||.5;
 g.userData.anim=t=>{const L=g.userData.legs;if(L)for(const l of L){const k=l.m.userData.knee;if(l.rz===undefined){l.rz=l.m.rotation.z;l.kx=k?k.rotation.x:0}l.m.rotation.z=l.rz+Math.sin(t*fq+l.ph)*amp*(l.a||1);if(k)k.rotation.x=l.kx-Math.max(0,Math.cos(t*fq+l.ph))*lift*(l.a||1)}
  const Wg=g.userData.wings;if(Wg)for(const w of Wg){w.m.rotation.x=(w.base||0)+w.s*Math.sin(t*(w.f||5)+(w.ph||0))*(w.a||.5)}
  const Tl=g.userData.tails;if(Tl)for(const tl of Tl){tl.m.rotation.y=Math.sin(t*(tl.f||2)+(tl.ph||0))*(tl.a||.3)}
  if(o.extra)o.extra(t)}}
/* wingGeo's span really runs along +x; this one lies in x–z with the span along +z and the leading edge forward */
function q5m_wingGeo(span,chord,kind){return q5m_gc('wq'+q5m_nk([span,chord,kind]),()=>wingGeo(span,chord,kind).rotateY(-Math.PI/2).rotateZ(Math.PI))}
/* an insect wing: a clear membrane, optionally with a few dark veins drawn on it; root at the origin, span +z */
function q5m_iwing(span,chord,mat,o){o=o||{};const g=new THREE.Group();g.add(new THREE.Mesh(q5m_wingGeo(span,chord,'insect'),mat));if(!o.veins)return g;
 const N=o.veins,X=(a,t)=>chord*(.35*Math.sin(t*Math.PI)*(1-Math.abs(a)*.6)+a*(.5-.5*t)*.9),pts=[];
 for(let i=0;i<N;i++){const a=(i/(N-1)-.5)*.9;let px=0,pz=0;for(let j=1;j<=4;j++){const t=j/4,z=span*t*.96,x=X(a,t);pts.push(V3(px,0,pz),V3(x,0,z));px=x;pz=z}}
 for(let j=1;j<4;j++){const t=j/4,z=span*t;for(let i=0;i<N-1;i++){const a0=(i/(N-1)-.5)*.9,a1=((i+1)/(N-1)-.5)*.9;pts.push(V3(X(a0,t),0,z),V3(X(a1,t),0,z+span*.03))}}
 const v=new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:o.vein||'#2a2a28',transparent:true,opacity:.7}));v.position.y=.003;g.add(v);return g}
/* a pincer built along +x: a lofted hand, a fixed finger on the zs side and a movable one (userData.jaw, opens about y) */
function q5m_chela(l,r,col,zs,o){const g=new THREE.Group();g.add(q5m_loft([[0,0,0,r*.65,r*.75],[l*.4,0,0,r*1.05,r*1.2],[l*.78,0,0,r*.85,r*.95],[l,0,0,r*.4,r*.45]],col,Object.assign({n:6,r:8},o)));
 g.add(q5m_loft([[l*.72,0,zs*r*.45,r*.3,r*.3],[l*1.3,0,zs*r*.5,r*.18,r*.18],[l*1.72,.02,zs*r*.28,r*.04,r*.04]],col,Object.assign({n:4,r:6},o)));
 const jaw=new THREE.Group();jaw.position.set(l*.72,0,-zs*r*.45);g.add(jaw);jaw.add(q5m_loft([[0,0,0,r*.3,r*.28],[l*.6,0,-zs*r*.05,r*.2,r*.18],[l*1.0,.02,zs*r*.18,r*.04,r*.04]],col,Object.assign({n:4,r:6},o)));
 g.userData.jaw=jaw;return g}
/* an arm built along +x from a shoulder: yawed out (side zs), pitched down, an elbow that folds back in, a pincer */
function q5m_arm(par,x,y,z,zs,l1,l2,r,mat,col,o){const sh=new THREE.Group();sh.position.set(x,y,z);sh.rotation.set(0,-zs*(o.yaw||.6),-(o.pitch||.15));par.add(sh);
 const ua=new THREE.Mesh(q5m_mus(l1,r,[.85,1.1,1,.82,.7],6),mat);ua.rotation.z=Math.PI/2;sh.add(ua);sh.add(q5m_bead(r*1.1,mat));
 const el=new THREE.Group();el.position.x=l1;el.rotation.y=zs*(o.fold||1.05);sh.add(el);const fa=new THREE.Mesh(q5m_mus(l2,r*.85,[1,.95,.8,.7],6),mat);fa.rotation.z=Math.PI/2;el.add(fa);
 const ch=q5m_chela(o.cl||l2*.8,o.cr||r*1.6,col,zs,o.lo);ch.position.x=l2;ch.rotation.y=-zs*(o.wrist||.25);el.add(ch);return {sh,el,ch,z:zs}}
/* fold every part that does not move against its joint into one mesh per material and joint: the body's animation is run
   a few times to see what moves. Joints, parts named in any userData (legs, wings, tails, jaws, knees …), lines, points and
   sprites stay as they are, so the animation and the files that dress these bodies find the same handles */
function q5m_fuse(root){if(!THREE.BufferGeometryUtils)return root;const fn=root.userData.anim;const nodes=[];root.traverse(o=>nodes.push(o));const keep=new Set([root]);
 const mark=v=>{if(!v||typeof v!=='object')return;if(v.isObject3D){keep.add(v);return}if(Array.isArray(v)){for(const x of v)mark(x);return}if(v.m&&v.m.isObject3D)keep.add(v.m)};
 for(const o of nodes){for(const k in o.userData)mark(o.userData[k]);if(o.userData.keep)keep.add(o);
  if(!(o.isMesh||o.type==='Group'||o.type==='Object3D')||o.isInstancedMesh||o.isSkinnedMesh||Array.isArray(o.material)||o.renderOrder||!o.visible||!o.frustumCulled)keep.add(o);
  else if(o.isMesh){const m=o.material,ga=o.geometry&&o.geometry.attributes;if(!m||m.map||m.alphaMap||m.normalMap||m.bumpMap||!ga||!ga.position||(m.vertexColors&&!ga.color)||o.children.length)keep.add(o)}}
 if(fn){const pose=()=>nodes.map(o=>q5m_fm.compose(o.position,o.quaternion,o.scale).elements.slice());const p0=pose();
  for(const t of[.37,1.91,5.3,11.7]){try{fn(t)}catch(e){return root}const p=pose();for(let i=0;i<nodes.length;i++){if(keep.has(nodes[i]))continue;const a=p0[i],b=p[i];for(let k=0;k<16;k++)if(Math.abs(a[k]-b[k])>1e-6){keep.add(nodes[i]);break}}}}
 for(const A of nodes){if(!keep.has(A))continue;const by=new Map();
  const walk=(o,mx)=>{for(const c of o.children){if(keep.has(c))continue;const m2=new THREE.Matrix4().multiplyMatrices(mx,q5m_fm.compose(c.position,c.quaternion,c.scale));if(c.isMesh){if(!by.has(c.material))by.set(c.material,[]);by.get(c.material).push([c,m2])}else walk(c,m2)}};
  walk(A,new THREE.Matrix4());
  for(const [mat,list] of by){if(list.length<2)continue;const gs=[];
   // all parts shared: the same parts in the same places merge to the same mesh, so reuse it
   let ck=null;if(list.every(([c])=>c.geometry.userData.q5m)){ck='fu'+(mat.vertexColors?1:0);for(const [c,mx] of list){ck+='|'+c.geometry.uuid;const e=mx.elements;for(let k=0;k<16;k++)ck+=','+Math.round(e[k]*1e4)}}
   const hit=ck&&q5m_GC.get(ck);if(hit){const mesh=new THREE.Mesh(hit,mat);mesh.castShadow=list[0][0].castShadow;mesh.receiveShadow=list[0][0].receiveShadow;for(const [c] of list)c.parent.remove(c);A.add(mesh);continue}
   for(const [c,mx] of list){const q=c.geometry.clone();for(const k of Object.keys(q.attributes))if(k!=='position'&&k!=='normal'&&!(k==='color'&&mat.vertexColors))q.deleteAttribute(k);if(!q.attributes.normal)q.computeVertexNormals();
    if(!q.index){const n=q.attributes.position.count,ix=new Array(n);for(let i=0;i<n;i++)ix[i]=i;q.setIndex(ix)}q.morphAttributes={};q.clearGroups();q.applyMatrix4(mx);
    if(mx.determinant()<0){const I=q.index.array;for(let i=0;i<I.length;i+=3){const t=I[i+1];I[i+1]=I[i+2];I[i+2]=t}}gs.push(q)}
   let mg=null;try{mg=THREE.BufferGeometryUtils.mergeBufferGeometries(gs)}catch(e){mg=null}if(!mg)continue;mg.computeBoundingSphere();if(ck){mg.userData.q5m=1;q5m_GC.set(ck,mg)}
   const mesh=new THREE.Mesh(mg,mat);mesh.castShadow=list[0][0].castShadow;mesh.receiveShadow=list[0][0].receiveShadow;for(const [c] of list)c.parent.remove(c);A.add(mesh)}}
 for(let i=nodes.length-1;i>=0;i--){const o=nodes[i];if(!keep.has(o)&&!o.isMesh&&o.parent&&!o.children.length)o.parent.remove(o)}
 return root}
/* the old builders, kept for the variants other files already rebuilt on top of them */

let q5m_eyeK=1;// (大眼龙 asks the salamander for eyes 2.6 times bigger, see the end of this file)

/* ---------------- 苔螈 and the small four-legged default: half a metre of salamander that keeps lifting its head to look round ---------------- */
function bQuadSmall(f){const id=f.w;if(id==='lanxing'||id==='yunbuchong')return bQuadSmallPlain(f);const sal=id==='tairong'||!id||id==='x';
 const g=new THREE.Group();const col=f.col||'#6a8a5a';const o={spots:sal?16:0,stripe:sal?0:6,rough:.5};const mat=M(col,{roughness:.5});
 g.add(q5m_loft([[-.6,.36,0,.17,.22],[-.15,.41,0,.25,.3],[.35,.4,0,.23,.28],[.7,.37,0,.15,.19]],col,Object.assign({n:14,r:10},o)));
 const hg=new THREE.Group();hg.position.set(.68,.37,0);g.add(hg);
 hg.add(q5m_loft([[-.06,0,0,.15,.19],[.2,.03,0,.14,.22],[.44,-.01,0,.09,.17],[.6,-.05,0,.035,.08]],col,Object.assign({n:8,r:10},o,{spots:0})));
 q5m_eyes(hg,.27,.11,.14,.055*q5m_eyeK,sal?M('#e8d040',{roughness:.15}):q5m_DARK,1);
 const tl=new THREE.Group();tl.position.set(-.6,.36,0);g.add(tl);tl.add(q5m_loft([[0,0,0,.17,.21],[-.45,-.04,0,.12,.13],[-.9,-.1,0,.07,.065],[-1.3,-.17,0,.015,.015]],col,Object.assign({n:10,r:8},o)));
 const L=[];for(const[x,z,ph]of[[.42,1,0],[.42,-1,Math.PI],[-.42,1,Math.PI],[-.42,-1,0]]){const l=q5m_ileg(.2,.25,.08,.045,mat,{h:.33,up:.2,tar:1.15,toes:3,rz:x>0?.45:-.45});l.position.set(x,.33,z*.2);l.scale.z=z;g.add(l);L.push({m:l,ph,a:1})}
 addLegs(g,L);g.userData.tails=[{m:tl,a:.22,f:sal?3:4}];
 q5m_crawl(g,{fq:sal?6:8,amp:.4,lift:.5,extra:t=>{const look=sm(.2,.9,Math.sin(t*.45));hg.rotation.z=look*.42;hg.rotation.y=Math.sin(t*.8)*.3*look;tl.rotation.z=-.05+look*.06}});return q5m_fuse(g)}

/* ---------------- 沙漠蝎: three metres, big pincers and, as the book says, no hook on its tail; 深沙巴士 the long flat one ---------------- */
function bScorpion(f){const id=f.w;const bus=id==='shenshabus',desert=id==='shaxie';const g=new THREE.Group();const col=f.col||'#a0703e';
 const o={rough:.42,metal:.08};const mat=M(col,{roughness:.42,metalness:.08}),plate=M(q5m_dk(col,.7),{roughness:.4,metalness:.12}),L=[];const n=bus?7:4,st=bus?.42:.38,ry=bus?.17:.2,rzz=bus?.5:.33;
 // the body: one loft from the front of the carapace to the last segment, a domed plate over each segment
 const spec=[];for(let i=-1;i<=n;i++){const k=i<0?.78:i===n?.55:1;spec.push([.95-i*st,.5,0,ry*k,rzz*k])}g.add(q5m_loft(spec,col,Object.assign({n:n*4+4,r:10},o)));
 const pg=q5m_sphG(1,8,3,0,Math.PI*2,0,Math.PI*.42);for(let i=0;i<n;i++){const p=new THREE.Mesh(pg,plate);p.scale.set(st*.56,ry*.58,rzz*1.04);p.position.set(.9-i*st,.5+ry*.48,0);g.add(p)}
 // the head end: carapace, chelicerae, two eyes on top and a pair along each edge
 const hd=new THREE.Group();hd.position.set(1.3,.49,0);g.add(hd);hd.add(q5m_loft([[-.2,0,0,ry*.95,rzz*.92],[.1,.02,0,ry*.8,rzz*.85],[.3,-.04,0,ry*.4,rzz*.45]],col,Object.assign({n:6,r:10},o)));
 q5m_eyes(hd,.02,ry*.82,.06,.04,q5m_DARK,0);q5m_eyes(hd,.1,ry*.42,rzz*.7,.026,q5m_DARK,0);q5m_eyes(hd,.03,ry*.44,rzz*.78,.024,q5m_DARK,0);q5m_eyes(hd,-.04,ry*.46,rzz*.84,.022,q5m_DARK,0);
 for(const z of[-1,1]){const ch=q5m_cone(.03,.13,plate,4);ch.position.set(.35,-.07,z*.06);ch.rotation.z=-Math.PI/2-.3;hd.add(ch)}
 // legs: eight (twelve on the bus) reaching out and down, the front ones splayed forward and the rear ones back
 const np=bus?6:4;for(let i=0;i<np*2;i++){const s=i%2?1:-1,k=Math.floor(i/2);const l=q5m_ileg(.34,.56,.16,.04,mat,{h:.46,up:.45,tar:.65,spines:2,rz:((np-1)/2-k)/(np-1)});l.position.set(.78-k*st,.46,s*rzz*.88);l.scale.z=s;g.add(l);L.push({m:l,ph:k*1.1+(s>0?Math.PI:0),a:.6})}
 // pedipalps: upper arm, forearm, the pincer
 const arms=[];for(const z of[-1,1])arms.push(q5m_arm(g,1.28,.46,z*.2,z,.4,.36,bus?.05:.065,mat,col,{yaw:.75,pitch:.12,fold:1.2,wrist:.35,cl:bus?.26:.4,cr:bus?.085:.13,lo:o}));
 // the tail: five segments curling up over the back; the desert scorpion's ends blunt, the others carry a hook
 const tl=new THREE.Group();tl.position.set(.95-n*st+.16,.52,0);g.add(tl);
 if(!bus){const pts=[];let px=0,py=0;for(let i=0;i<=6;i++){const th=i*.36;pts.push([px,py,0,.12-i*.013,.125-i*.013]);px-=Math.cos(th)*.24;py+=Math.sin(th)*.24}tl.add(q5m_loft(pts,col,Object.assign({n:16,r:8,stripe:6},o)));
  const tip=q5m_bead(1,mat,1);tip.scale.set(.07,.06,.06);tip.position.set(pts[6][0],pts[6][1],0);tl.add(tip);
  if(!desert){const sg=q5m_cone(.03,.16,q5m_DARK,4);sg.position.set(pts[6][0]+.06,pts[6][1]-.07,0);sg.rotation.z=2.3;tl.add(sg)}}
 else{const pts=[];for(let i=0;i<=24;i++){const a=i/24*6.28*3;pts.push(V3(-i*.042,Math.cos(a)*.15,Math.sin(a)*.15))}tl.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),48,.045,6,false),mat))}
 addLegs(g,L);g.userData.tails=[{m:tl,a:.12,f:2}];
 q5m_crawl(g,{fq:9,amp:.28,lift:.45,extra:t=>{arms.forEach((x,i)=>{x.sh.rotation.y=-x.z*(.75+Math.sin(t*1.3+i*2)*.12);x.ch.userData.jaw.rotation.y=x.z*(.1+Math.max(0,Math.sin(t*2.1+i))*.45)});tl.rotation.z=Math.sin(t*1.1)*.06}});return q5m_fuse(g)}

/* ---------------- beetles: 黑角巨蠊 (the black-horned giant cockroach), 裂地者 (the earth-splitter with its saw jaws), the plain one ---------------- */
function bBeetle(f){const id=f.w;const roach=id==='heijiao',saw=id==='liedizhe';const g=new THREE.Group();const col=f.col||'#3a5a3a';
 const o={rough:roach?.3:.36,metal:roach?.3:.18,em:saw?'#4a2a18':'',emI:.25};const mat=M(col,{roughness:o.rough,metalness:o.metal}),dk=M(q5m_dk(col,.55),{roughness:.4,metalness:.2}),legM=M(q5m_dk(col,.45),{roughness:.45});
 const LX=roach?1.9:saw?1.7:1.5,W=roach?.55:saw?.5:.46,H=roach?.26:saw?.44:.38,y0=.46;
 // the underbody and the head
 g.add(q5m_loft([[-LX*.5,y0,0,H*.5,W*.6],[-LX*.2,y0,0,H*.62,W*.88],[LX*.2,y0,0,H*.6,W*.88],[LX*.5,y0-.02,0,H*.42,W*.6]],col,Object.assign({n:12,r:8},o)));
 const hd=new THREE.Group();hd.position.set(LX*.5,y0-.04,0);g.add(hd);hd.add(q5m_loft([[-.1,0,0,H*.4,W*.45],[.12,0,0,H*.38,W*.42],[.3,-.04,0,H*.25,W*.3],[.4,-.08,0,H*.1,W*.14]],col,Object.assign({n:8,r:8},o)));
 q5m_eyes(hd,.17,H*.18,W*.31,.045,q5m_DARK,0);
 // the shield behind the head and the two wing cases split down the back
 const pro=new THREE.Mesh(q5m_sphG(1,8,4,0,Math.PI*2,0,Math.PI*.46),dk);pro.scale.set(LX*(roach?.24:.19),H*.48,W*.95);pro.position.set(LX*(roach?.44:.4),y0+H*.05,0);g.add(pro);
 const eg=q5m_sphG(1,8,4,0,Math.PI,0,Math.PI*.5);for(const z of[-1,1]){const el=new THREE.Mesh(eg,mat);el.scale.set(LX*.48,H*.72,W*.98);el.position.set(-LX*.12,y0+H*.05,z*.012);el.rotation.y=z>0?0:Math.PI;g.add(el)}
 {const pts=[];for(let i=0;i<=6;i++){const u=i/6*2-1;pts.push(V3(-LX*.12+u*LX*.46,y0+H*.05+H*.72*Math.sqrt(Math.max(0,1-u*u*.94))+.004,0))}g.add(q5m_tube(pts,.012,q5m_DARK,8))}
 // antennae, mandibles, cerci
 const ants=[];for(const z of[-1,1]){const len=roach?1.3:.7;const a=new THREE.Group();a.position.set(.3,H*.2,z*W*.2);hd.add(a);a.add(q5m_tube([0,1,2,3,4].map(j=>{const t=j/4;return V3(len*t,len*.4*Math.sin(t*1.8)-.15*len*t*t,z*.55*len*t)}),.012,dk,roach?10:8));ants.push({a,z});
  if(!saw){const m=q5m_cone(.03,.16,q5m_DARK,4);m.position.set(.42,-.08,z*.07);m.rotation.z=-Math.PI/2-.25;m.rotation.x=-z*.4;hd.add(m)}
  const c=q5m_cone(.02,.3,dk,4);c.position.set(-LX*.5-.1,y0-.1,z*.12);c.rotation.z=Math.PI/2+.2;c.rotation.x=z*.4;g.add(c)}
 // the roach's black horn, blunt and rounded at the end
 if(roach){const hn=new THREE.Mesh(q5m_mus(.55,.06,[1,.85,.8,.9],6),dk);hn.position.set(.3,H*.4,0);hn.rotation.z=Math.PI/2+.55;hd.add(hn);const kn=q5m_bead(.075,dk);kn.position.set(.3+Math.sin(hn.rotation.z)*.55,H*.4-Math.cos(hn.rotation.z)*.55,0);hd.add(kn)}
 // the earth-splitter's saw jaws: two long blades set with teeth, opening and closing
 if(saw)for(const z of[-1,1]){const j=new THREE.Group();j.position.set(.3,-.1,z*W*.5);j.rotation.y=z*.3;hd.add(j);
  j.add(q5m_loft([[0,0,0,.08,.1],[.5,0,0,.07,.07],[1.0,.02,0,.05,.05],[1.35,.04,0,.015,.015]],q5m_dk(col,.85),{n:8,r:6,rough:.4,metal:.2}));
  for(let i=0;i<8;i++){const tt=q5m_cone(.03,.12+.04*(i%2),q5m_TOOTH,3);tt.position.set(.15+i*.15,0,-z*.06);tt.rotation.x=z*Math.PI/2;j.add(tt)}g.userData.jaws=(g.userData.jaws||[]).concat([{m:j,z}])}
 const L=[];for(let i=0;i<6;i++){const s=i%2?1:-1,k=Math.floor(i/2);const l=q5m_ileg(.3,.42,.13,.035,legM,{h:y0-.04,up:.45,tar:.7,spines:1,rz:(1-k)*.42});l.position.set(LX*(.28-k*.28),y0-.04,s*W*.75);l.scale.z=s;g.add(l);L.push({m:l,ph:k*1.2+(s>0?Math.PI:0),a:.6})}
 addLegs(g,L);q5m_crawl(g,{fq:11,amp:.3,lift:.45,extra:t=>{ants.forEach((x,i)=>{x.a.rotation.y=x.z*Math.sin(t*2.2+i)*.25;x.a.rotation.z=Math.sin(t*1.7+i*2)*.15});if(g.userData.jaws)for(const j of g.userData.jaws)j.m.rotation.y=j.z*(.3+Math.max(0,Math.sin(t*2.6))*.4)}});return q5m_fuse(g)}

/* ---------------- fish: one skin from snout to tail, the rear half and the tail fin swinging in turn ---------------- */
function q5m_finMat(col,op){const k='fin|'+col+'|'+(op||.82);return MC[k]||(MC[k]=new THREE.MeshStandardMaterial({color:col,side:THREE.DoubleSide,roughness:.45,transparent:true,opacity:op||.82,depthWrite:false}))}
function bFish(f){const id=f.w;if(id==='jianshi'||id==='haigui'||id==='rq_maojing')return bFishPlain(f);// (毛鲸's coat of hair hid its eyes and fins: it keeps the old body)
 const g=new THREE.Group();const col=f.col||'#55606a',glow=f.glow;
 const eel=id==='shanyao',dunk=id==='dengshi',horn=id==='chongfeng',fur=id==='rq_maojing';
 const o={stripe:(eel||fur||dunk)?0:9,rough:fur?.8:.35,metal:glow?0:.18,em:glow?col:'',emI:.35,bellyK:'#ffffff',backK:'#b8b4ac'};const fin=q5m_finMat(q5m_dk(col,.85));
 if(eel){// 闪耀鳗: six metres of eel, starry points of light all over it and a mouth full of teeth; a chain of segments that wave in turn
  const N=6,SL=.52,segs=[];let par=g;const eo=Object.assign({},o,{em:q5m_dk(col,.35),emI:.4,rough:.3});
  const hd=new THREE.Group();g.add(hd);hd.add(q5m_loft([[.75,0,0,.05,.06],[.55,.04,0,.14,.13],[.3,.05,0,.18,.15],[0,.04,0,.17,.14],[-.2,.03,0,.16,.13]],col,Object.assign({n:8,r:8},eo)));
  const jaw=new THREE.Group();jaw.position.set(.2,-.06,0);hd.add(jaw);jaw.add(q5m_loft([[0,0,0,.05,.12],[.3,-.02,0,.05,.1],[.55,-.03,0,.03,.05]],col,Object.assign({n:6,r:6},eo)));
  for(let i=0;i<4;i++)for(const z of[-1,1]){const t=q5m_cone(.014,.07,q5m_TOOTH,3);t.position.set(.32+i*.09,-.04,z*(.1-i*.016));t.rotation.x=Math.PI;hd.add(t);const t2=q5m_cone(.012,.06,q5m_TOOTH,3);t2.position.set(.1+i*.1,0,z*(.085-i*.012));jaw.add(t2)}
  q5m_eyes(hd,.42,.1,.1,.04,q5m_DARK,0);
  const fo=Object.assign({},eo,{backK:'#ffffff',bellyK:'#ffffff'});
  for(let i=0;i<N;i++){const sg=new THREE.Group();sg.position.x=i?-SL:-.2;par.add(sg);const r=.16-i*.02;sg.add(q5m_loft([[0,0,0,r+.01,r*.85],[-SL*.5,0,0,r,r*.8],[-SL,0,0,r-.02,(r-.02)*.85]],col,Object.assign({n:4,r:8},eo)));
   sg.add(q5m_ribbon([[.02,r*.95,0],[-SL*.5,r*.95,0],[-SL-.02,(r-.02)*.95,0]],.06-i*.006,q5m_pale(col,.25),fo));
   if(i===N-1){const tf=new THREE.Mesh(q5m_wg(.3,.4,'fin',-Math.PI/2),fin);tf.position.x=-SL;sg.add(tf);const t2=tf.clone();t2.scale.y=-1;sg.add(t2)}segs.push(sg);par=sg}
  // the points of light ride on the segments: one cloud for the whole body, moved with them
  const NP=54,home=[];for(let i=0;i<NP;i++){const s=i%N,u=h3(i,1,3),a=h3(i,2,3)*6.283;const r=.15-s*.02;home.push([s,-u*SL,Math.sin(a)*r*.9,Math.cos(a)*r*.75])}
  const spk=sparkles(home.map(()=>V3()),'#bfe8ff',.5,1);spk.geometry.boundingSphere=new THREE.Sphere(V3(-1.2,0,0),3);g.add(spk);const pa=spk.geometry.attributes.position,mm=[];for(let i=0;i<N;i++)mm.push(new THREE.Matrix4());const v=V3();
  g.userData.anim=t=>{segs.forEach((s,i)=>s.rotation.y=Math.sin(t*3.2-i*.9)*.2);hd.rotation.y=Math.sin(t*3.2+.9)*.08;jaw.rotation.z=-Math.max(0,Math.sin(t*1.1))*.35;
   for(let i=0;i<N;i++){const s=segs[i];q5m_fm.compose(s.position,s.quaternion,s.scale);if(i)mm[i].multiplyMatrices(mm[i-1],q5m_fm);else mm[i].copy(q5m_fm)}
   for(let i=0;i<NP;i++){const p=home[i];v.set(p[1],p[2],p[3]).applyMatrix4(mm[p[0]]);pa.setXYZ(i,v.x,v.y,v.z)}pa.needsUpdate=true};g.userData.swim=1;return q5m_fuse(g)}
 const K=dunk?1.35:1;const fr=new THREE.Group();g.add(fr);
 fr.add(q5m_loft(dunk?[[1.1,.02,0,.1,.1],[1.02,.06,0,.22,.22],[.75,.08,0,.34,.28],[.35,.06,0,.4,.28],[0,.03,0,.42,.27],[-.35*K,0,0,.26*K,.16*K]]:horn?[[1.05,0,0,.04,.03],[.8,.02,0,.13,.1],[.4,.03,0,.24,.17],[0,.02,0,.27,.18],[-.35,0,0,.22,.15]]:fur?[[.95,-.02,0,.2,.2],[.7,.03,0,.3,.28],[.3,.04,0,.36,.3],[-.1,.02,0,.34,.28],[-.4,0,0,.28,.22]]:[[.95*K,0,0,.04,.03],[.75*K,.02,0,.17*K,.11*K],[.4*K,.03,0,.31*K,.2*K],[0,.02,0,.32*K,.2*K],[-.35*K,0,0,.26*K,.16*K]],col,Object.assign({n:14,r:10},o)));
 const rr=new THREE.Group();rr.position.x=-.35*K;fr.add(rr);rr.add(q5m_loft(fur?[[0,0,0,.28,.22],[-.4,0,0,.18,.14],[-.8,0,0,.09,.07],[-1.0,0,0,.05,.04]]:[[0,0,0,.26*K,.16*K],[-.4*K,0,0,.16*K,.1*K],[-.8*K,0,0,.08*K,.05*K],[-1.0*K,0,0,.05*K,.03*K]],col,Object.assign({n:8,r:8},o)));
 const tl=new THREE.Group();tl.position.x=-1.0*K;rr.add(tl);
 if(fur){const fd=M(q5m_dk(col,.7),{side:THREE.DoubleSide,roughness:.5});for(const z of[-1,1]){const fl=new THREE.Mesh(q5m_wg(.45,.4,'fin'),fd);fl.position.set(0,0,z*.02);fl.rotation.y=z*.3;if(z<0)fl.scale.z=-1;tl.add(fl)}}
 else{const tf=new THREE.Mesh(q5m_wg(.42*K,.55*K,'fin',-Math.PI/2),fin);tf.rotation.z=.15;tl.add(tf);const t2=tf.clone();t2.scale.y=-1;t2.rotation.z=-.15;tl.add(t2)}
 if(!fur){fr.add(q5m_ribbon([[.35*K,.24*K,0],[.1*K,.28*K,0],[-.2*K,.24*K,0],[-.4*K,.18*K,0]],u=>.1*K*Math.sin(u*2.4+.4)+.01,q5m_dk(col,.8),{n:6}));
  rr.add(q5m_ribbon([[-.15*K,-.15*K,0],[-.35*K,-.11*K,0]],.06*K,q5m_dk(col,.8),{n:4}))}
 for(const z of[-1,1]){const pf=new THREE.Mesh(wingGeo((dunk?.5:.32)*K,.26*K,'fin'),fin);pf.position.set(.4*K,-.08*K,z*.17*K);pf.rotation.set(z*.5,z*-.6,-.2);if(z<0)pf.scale.z=-1;fr.add(pf);
  if(!fur){const pv=new THREE.Mesh(q5m_wg(.18*K,.16*K,'fin'),fin);pv.position.set(-.05*K,-.16*K,z*.1*K);pv.rotation.set(z*.9,z*-.5,-.1);if(z<0)pv.scale.z=-1;fr.add(pv)}
  // the gill line and the eye: a white with a dark pupil, no lid
  if(!dunk&&!fur)for(let k=0;k<2;k++){const gl=new THREE.Mesh(q5m_box(.012,.17*K-k*.03,.01),M(q5m_dk(col,.5)));gl.position.set((.52-k*.05)*K,0,z*(.16+k*.012)*K);gl.rotation.set(z*.25,0,.25);fr.add(gl)}
  const ex=dunk?.93:.72*K,ey=dunk?.16:.08*K,ez=dunk?.255:.14*K;const w=q5m_bead(1,q5m_EYEW,1);w.scale.set(.06*K,.06*K,.03*K);w.position.set(ex,ey,z*ez);fr.add(w);const pu=q5m_bead(1,q5m_DARK);pu.scale.set(.032*K,.032*K,.02*K);pu.position.set(ex+.025*K,ey,z*(ez+.025*K));fr.add(pu)}
 if(dunk){// 邓氏鱼: the bony shield over head and cheeks, and blade-like jaw edges that shear instead of teeth
  const bone=M('#3a4248',{roughness:.3,metalness:.35}),edge=M('#1e2226',{roughness:.25,metalness:.4});
  const sh=new THREE.Mesh(q5m_sphG(1,8,4,0,Math.PI*2,0,Math.PI*.5),bone);sh.scale.set(.55,.42,.3);sh.position.set(.58,.1,0);sh.rotation.z=-.12;fr.add(sh);
  for(const z of[-1,1]){const ck=new THREE.Mesh(q5m_box(.46,.28,.05),bone);ck.position.set(.6,-.02,z*.27);ck.rotation.set(0,z*.12,-.1);fr.add(ck);const ub=new THREE.Mesh(q5m_box(.3,.12,.04),edge);ub.position.set(1.0,-.06,z*.15);ub.rotation.set(0,z*.55,-.3);fr.add(ub)}
  const jw=new THREE.Group();jw.position.set(.62,-.2,0);fr.add(jw);jw.add(q5m_loft([[0,0,0,.08,.22],[.35,0,0,.07,.18],[.56,.05,0,.04,.09]],'#5a6064',{n:6,r:6,rough:.35}));
  for(const z of[-1,1]){const lb=new THREE.Mesh(q5m_box(.36,.12,.03),edge);lb.position.set(.3,.08,z*.14);lb.rotation.set(0,z*.25,.3);jw.add(lb)}
  g.userData.jaw=jw}
 if(horn){// 冲锋者: a long barbed lance in front and a water-jet throat behind
  fr.add(q5m_loft([[1.0,0,0,.06,.06],[1.5,.01,0,.045,.045],[2.1,.02,0,.012,.012]],'#e2ded2',{n:6,r:6,rough:.4}));
  for(let i=0;i<4;i++)for(let k=0;k<2;k++){const a=k*Math.PI+i*.8;const b=q5m_cone(.015,.08,M('#e8e4d8'),4);b.position.set(1.2+i*.22,Math.cos(a)*.05,Math.sin(a)*.05);b.rotation.set(0,0,Math.PI/2+.35);b.rotateX(a);fr.add(b)}
  const jet=q5m_cyl(.05,.08,.16,M('#2a3038'),6);jet.rotation.z=Math.PI/2;jet.position.set(-.3,0,0);rr.add(jet)}
 if(fur){// 毛鲸: a small whale-like fish under a coat of long hair
  const n=240,pa=new Float32Array(n*6),ca=new Float32Array(n*6);const c0=C(q5m_dk(col,.8)),c1=C('#fbf8f0');
  for(let i=0;i<n;i++){const u=h3(i,1,6)*6.283,v=Math.acos(2*h3(i,2,6)-1);const d=V3(Math.sin(v)*Math.cos(u),Math.cos(v),Math.sin(v)*Math.sin(u));const x=-.05+d.x*1.0,y=.02+d.y*.33,z=d.z*.29;const Lh=.22+h3(i,3,6)*.2;const ex=V3(d.x*.3,d.y,d.z).normalize();
   pa.set([x,y,z,x+ex.x*Lh-.12*Lh,y+ex.y*Lh,z+ex.z*Lh],i*6);ca.set([c0.r,c0.g,c0.b,c1.r,c1.g,c1.b],i*6)}
  const hg=new THREE.BufferGeometry();hg.setAttribute('position',new THREE.BufferAttribute(pa,3));hg.setAttribute('color',new THREE.BufferAttribute(ca,3));fr.add(new THREE.LineSegments(hg,new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:.85})));
  const bh=q5m_cyl(.03,.03,.04,M('#2a2a28'),6);bh.position.set(.45,.33,0);fr.add(bh)}
 g.userData.anim=t=>{const w=Math.sin(t*(horn?7:5));rr.rotation.y=w*.22;tl.rotation.y=Math.sin(t*(horn?7:5)-.9)*.35;fr.rotation.y=-w*.05;if(g.userData.jaw)g.userData.jaw.rotation.z=-Math.max(0,Math.sin(t*.9))*.45};
 if(!f.sky)g.userData.swim=1;return q5m_fuse(g)}

/* ---------------- 海空水母 and the plain jellyfish: a frilled bell, ring canals, four ruffled oral arms; 海空水母 carries the white dragons' basket ---------------- */
function bJelly(f){if(f.w==='daqi')return bJellyPlain(f);const big=f.w==='haikong';const g=new THREE.Group();const col=f.col||'#bfe9ff';
 const prof=[];for(let i=0;i<=12;i++){const t=i/12;prof.push(new THREE.Vector2(Math.sin(t*Math.PI*.56)*(1+.1*Math.pow(t,6)),Math.cos(t*Math.PI*.5)*.9-(t>.86?(t-.86)*1.4:0)))}
 const bg=new THREE.LatheGeometry(prof,24);{const p=bg.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),y=p.getY(i);const r=Math.hypot(x,z);if(r<.01)continue;const a=Math.atan2(z,x);const k=sm(.45,1.05,r)*(.06*Math.sin(a*12)+.03*Math.sin(a*5+1));p.setXYZ(i,x*(1+k),y+k*.5*sm(.9,1.1,r),z*(1+k))}bg.computeVertexNormals()}
 const bm=new THREE.MeshStandardMaterial({color:col,emissive:col,emissiveIntensity:.32,transparent:true,opacity:.52,side:THREE.DoubleSide,roughness:.12,depthWrite:false});const bell=new THREE.Mesh(bg,bm);g.add(bell);
 const core=q5m_bead(1,GL(big?'#9fe0ff':'#f4fff8',.5),1);core.scale.set(.3,.26,.3);core.position.y=.3;g.add(core);
 const gm=M(big?'#ff9ab0':'#ffd6a0',{emissive:big?'#ff6a90':'#ffb060',emissiveIntensity:.5,roughness:.3});for(let i=0;i<4;i++){const gn=new THREE.Mesh(new THREE.TorusGeometry(.2,.035,3,8,Math.PI*1.3),gm);const a=i/4*6.283;gn.position.set(Math.cos(a)*.38,.42,Math.sin(a)*.38);gn.rotation.set(Math.PI/2,0,a);g.add(gn)}
 {const pts=[];for(let i=0;i<16;i++){const a=i/16*6.283;for(let j=0;j<5;j++){const t0=.12+j*.17,t1=t0+.17;const P=t=>{const r=Math.sin(t*Math.PI*.56)*.97,y=Math.cos(t*Math.PI*.5)*.9*.97;return V3(Math.cos(a)*r,y,Math.sin(a)*r)};pts.push(P(t0),P(Math.min(.98,t1)))}}
  g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:C(col).lerp(C('#ffffff'),.4),transparent:true,opacity:.45,depthWrite:false})))}
 // oral arms: four ruffled ribbons hanging from the middle
 const arms=[];const am=new THREE.MeshStandardMaterial({vertexColors:true,transparent:true,opacity:.62,side:THREE.DoubleSide,emissive:col,emissiveIntensity:.25,roughness:.3,depthWrite:false});
 for(let i=0;i<4;i++){const a=i/4*6.283+.4;const ag=new THREE.Group();ag.position.set(Math.cos(a)*.18,.05,Math.sin(a)*.18);ag.rotation.y=-a;g.add(ag);const L=big?2.2:1.3;
  ag.add(q5m_loft(Array.from({length:6},(_,j)=>{const t=j/5;return[t*.25+Math.sin(t*9)*.05,-t*L,Math.sin(t*7)*.06,.012,.11+.06*Math.sin(t*3.1)]}),col,{n:10,r:4,mat:am,backK:q5m_pale(col,.5),bellyK:'#ffffff'}));arms.push(ag)}
 // tentacles: thin lines that trail and sway (drawn fresh every frame)
 const NT=big?20:12,NS=10,tp=new Float32Array(NT*NS*2*3);const tgeo=new THREE.BufferGeometry();tgeo.setAttribute('position',new THREE.BufferAttribute(tp,3));
 const tl=new THREE.LineSegments(tgeo,new THREE.LineBasicMaterial({color:col,transparent:true,opacity:.6,blending:THREE.AdditiveBlending,depthWrite:false}));tl.frustumCulled=false;g.add(tl);
 if(big){// the white dragons' basket: a woven bowl hung on plant ropes, two of them looking over the edge
  const wv=M('#8a6a44',{roughness:.9,side:THREE.DoubleSide}),wv2=M('#6a5034',{roughness:.9}),bone=M('#efece2',{roughness:.6});
  const bk=new THREE.Mesh(new THREE.CylinderGeometry(.38,.28,.32,10,1,true),wv);bk.position.y=-3.2;g.add(bk);const fl=new THREE.Mesh(new THREE.CircleGeometry(.28,10),wv2);fl.rotation.x=Math.PI/2;fl.position.y=-3.36;g.add(fl);
  const rg=new THREE.Mesh(new THREE.TorusGeometry(.38,.018,3,8),wv2);rg.position.y=-3.04;rg.rotation.x=Math.PI/2;g.add(rg);
  const rp=[];for(let i=0;i<6;i++){const a=i/6*6.28;rp.push(V3(Math.cos(a)*.7,-.1,Math.sin(a)*.7),V3(Math.cos(a)*.37,-3.05,Math.sin(a)*.37))}g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(rp),new THREE.LineBasicMaterial({color:'#8a7a5a'})));
  for(const z of[-1,1]){const r=q5m_bead(1,bone,1);r.scale.set(.07,.12,.07);r.position.set(z*.12,-2.95,z*.1);g.add(r);const h=q5m_bead(1,bone);h.scale.set(.06,.05,.05);h.position.set(z*.16,-2.8,z*.13);g.add(h);const sn=q5m_cone(.03,.1,bone,4);sn.position.set(z*.2,-2.8,z*.17);sn.rotation.z=z>0?-Math.PI/2:Math.PI/2;g.add(sn)}}
 g.userData.anim=t=>{const k=1+Math.sin(t*1.8)*.08;bell.scale.set(k,1/k*.98,k);arms.forEach((a,i)=>{a.rotation.z=Math.sin(t*1.1+i)*.12;a.rotation.x=Math.cos(t*.9+i*1.7)*.1});
  let q=0;for(let i=0;i<NT;i++){const a=i/NT*6.28,r0=.8+.1*(i%2);let px=Math.cos(a)*r0,pz=Math.sin(a)*r0,py=-.05;for(let j=0;j<NS;j++){const nx=px+Math.sin(t*1.4+i+j*.5)*.05,nz=pz+Math.cos(t*1.2+i*1.3+j*.4)*.05,ny=py-(big?.42:.26);
   tp[q++]=px;tp[q++]=py;tp[q++]=pz;tp[q++]=nx;tp[q++]=ny;tp[q++]=nz;px=nx*.97;py=ny;pz=nz*.97}}tgeo.attributes.position.needsUpdate=true};
 return q5m_fuse(g)}

/* ---------------- 巨脉蜻蜓 and the plain dragonfly, 巨蜂 the two-metre bee, 轰炸者 the bomber ---------------- */
function q5m_bandColors(mesh,fn){const g=mesh.geometry,p=g.attributes.position,c=g.attributes.color;const t=new THREE.Color();for(let i=0;i<p.count;i++){t.setRGB(c.getX(i),c.getY(i),c.getZ(i));fn(t,p.getX(i),p.getY(i),p.getZ(i));c.setXYZ(i,t.r,t.g,t.b)}c.needsUpdate=true}
function bDragonfly(f){const id=f.w;const bomb=id==='hongzhazhe',bee=id==='jufeng';const g=new THREE.Group();const col=f.col||(bee?'#d8a030':'#3a6a8a');
 const o={rough:bee?.5:.3,metal:bee?0:.2};const dk=M(q5m_dk(col,.45),{roughness:.4}),legM=M(q5m_dk(col,.35),{roughness:.45});
 const L=[],legs=(n,x0,dx,y,z,l1,l2,l3,r,o2)=>{for(let i=0;i<n*2;i++){const s=i%2?1:-1,k=Math.floor(i/2);const l=q5m_ileg(l1,l2,l3,r,legM,Object.assign({h:.3,up:.3,tar:.5,rz:(1-k)*.55},o2||{}));l.position.set(x0-k*dx,y,s*z);l.scale.z=s;g.add(l);L.push({m:l,ph:k*1.3+(s>0?Math.PI:0),a:.25})}};
 if(bomb){// 轰炸者: built on the giant dragonfly, but gas sacs grow where the wings would be and the tail is far thicker, full of the organs
  // that make its bombs; it flies by jet and lays the bombs from the tail tip like a dragonfly laying eggs
  const bo=Object.assign({},o,{rough:.45,metal:0,stripe:0});
  g.add(q5m_loft([[.55,-.02,0,.12,.12],[.4,.08,0,.27,.25],[.1,.1,0,.3,.26],[-.15,.03,0,.2,.18]],col,Object.assign({n:10,r:10},bo)));
  const hd=new THREE.Group();hd.position.set(.58,.04,0);g.add(hd);hd.add(q5m_loft([[-.05,0,0,.14,.16],[.1,0,0,.16,.2],[.24,-.03,0,.1,.15],[.3,-.05,0,.03,.07]],col,Object.assign({n:6,r:10},bo)));
  for(const z of[-1,1]){const e=q5m_bead(1,M('#101820',{roughness:.06,metalness:.4}),1);e.scale.set(.12,.13,.11);e.position.set(.1,.06,z*.13);hd.add(e)}
  const ab=new THREE.Group();ab.position.set(-.12,.02,0);g.add(ab);
  // the thick tail: two bulges where the bombs are made, then the laying tip
  ab.add(q5m_loft([[0,0,0,.18,.17],[-.3,-.01,0,.26,.24],[-.6,-.04,0,.3,.28],[-.9,-.08,0,.27,.25],[-1.15,-.14,0,.29,.27],[-1.4,-.22,0,.17,.16],[-1.55,-.28,0,.06,.06]],col,Object.assign({n:18,r:10,stripe:7},bo)));
  const tip=q5m_bead(1,GL('#ffb050')),tipS=q5m_bead(1,M('#3a4030',{roughness:.5}));tip.scale.setScalar(.07);tip.position.set(-1.6,-.31,0);ab.add(tip);tipS.scale.setScalar(.09);tipS.position.set(-1.56,-.29,0);ab.add(tipS);
  // four gas sacs where the two pairs of wings would be, veined, swelling and easing
  const sacs=[],sm2=new THREE.MeshStandardMaterial({color:'#e8fff0',emissive:'#8ad8b8',emissiveIntensity:.3,transparent:true,opacity:.42,roughness:.15,depthWrite:false}),vm=new THREE.LineBasicMaterial({color:'#5a9a80',transparent:true,opacity:.35});
  const vein=[];for(let k=0;k<3;k++){const b=k/3*Math.PI;for(let j=0;j<10;j++){const a0=j/10*6.283,a1=(j+1)/10*6.283;vein.push(V3(Math.cos(a0)*Math.cos(b),Math.sin(a0),Math.cos(a0)*Math.sin(b)),V3(Math.cos(a1)*Math.cos(b),Math.sin(a1),Math.cos(a1)*Math.sin(b)))}}const vg=new THREE.BufferGeometry().setFromPoints(vein);
  for(const[x,s0]of[[.3,.42],[.02,.32]])for(const z of[-1,1]){const sg=new THREE.Group();sg.position.set(x,.3,z*(s0+.1));g.add(sg);const s=q5m_bead(1,sm2,1);s.scale.set(s0*1.1,s0*.8,s0);sg.add(s);const v=new THREE.LineSegments(vg,vm);v.scale.set(s0*1.1,s0*.8,s0);sg.add(v);sacs.push({sg,ph:x*3})}
  const jet=q5m_cyl(.05,.08,.12,M('#2a3038'),6);jet.rotation.z=Math.PI/2;jet.position.set(-.2,-.06,0);g.add(jet);
  legs(3,.42,.13,-.1,.12,.18,.24,.1,.026,{h:.2,up:.15,tar:.4,rz:0});
  for(const l of L)l.m.rotation.z+=.9;// legs folded back under the body in flight
  // (the legs hang still in flight, so they are not handed to the animation and fold into the body: fewer objects to move)
  for(const l of L)delete l.m.userData.knee;q5m_crawl(g,{extra:t=>{sacs.forEach(s=>{const k=1+Math.sin(t*1.6+s.ph)*.06;s.sg.scale.set(k,1/k,k)});ab.rotation.z=Math.sin(t*.9)*.05;hd.rotation.y=Math.sin(t*.7)*.12}});return q5m_fuse(g)}
 const wm=new THREE.MeshStandardMaterial({color:bee?'#eef2ff':'#c4dcee',transparent:true,opacity:bee?.42:.55,side:THREE.DoubleSide,roughness:.15,metalness:.3,depthWrite:false});
 // thorax, head, abdomen
 g.add(q5m_loft(bee?[[.45,-.02,0,.1,.1],[.3,.06,0,.27,.26],[0,.07,0,.28,.27],[-.25,.02,0,.17,.17]]:[[.55,-.02,0,.1,.11],[.42,.08,0,.23,.21],[.15,.1,0,.25,.21],[-.1,.02,0,.16,.14]],bee?'#4a3418':col,Object.assign({n:8,r:8},o)));
 const hd=new THREE.Group();hd.position.set(bee?.5:.6,.02,0);g.add(hd);hd.add(q5m_loft(bee?[[-.05,0,0,.15,.17],[.1,0,0,.16,.2],[.24,-.03,0,.1,.15],[.3,-.06,0,.03,.08]]:[[-.05,0,0,.13,.15],[.1,0,0,.15,.2],[.24,-.03,0,.09,.15],[.3,-.05,0,.03,.07]],bee?'#4a3418':col,Object.assign({n:6,r:8},o)));
 const eyeM=M(bee?'#1a1008':'#101820',{roughness:.06,metalness:.4});for(const z of[-1,1]){const e=q5m_bead(1,eyeM,1);e.scale.set(bee?.08:.12,bee?.12:.13,bee?.07:.11);e.position.set(.1,.05,z*(bee?.15:.13));hd.add(e);
  if(bee){const md=new THREE.Group();md.position.set(.27,-.08,z*.08);hd.add(md);md.add(q5m_loft([[0,0,0,.03,.03],[.15,-.01,-z*.03,.025,.025],[.26,-.02,-z*.09,.008,.008]],'#3a2410',{n:4,r:4,rough:.4}));(g.userData.jaws=g.userData.jaws||[]).push({m:md,z});
   const an=new THREE.Group();an.position.set(.2,.1,z*.06);hd.add(an);an.add(q5m_tube([0,1,2,3].map(j=>{const t=j/3;return V3(.42*t,.42*.5*Math.sin(t*1.8)-.3*.42*t*t,z*.4*.42*t)}),.01,dk,6))}
  else{const md=q5m_cone(.025,.1,q5m_DARK,4);md.position.set(.28,-.08,z*.05);md.rotation.z=-Math.PI/2-.3;md.rotation.x=-z*.5;hd.add(md)}}
 const ab=new THREE.Group();ab.position.set(bee?-.28:-.1,.02,0);g.add(ab);
 const abm=q5m_loft(bee?[[0,0,0,.18,.18],[-.3,0,0,.3,.28],[-.75,0,0,.29,.27],[-1.1,-.03,0,.18,.17],[-1.28,-.07,0,.05,.05]]:[[0,0,0,.12,.1],[-.5,.02,0,.1,.09],[-1.1,.02,0,.09,.08],[-1.6,0,0,.08,.07],[-1.85,-.03,0,.035,.035]],col,Object.assign({n:bee?12:18,r:bee?8:6},o,{stripe:bee?0:11,fresh:bee}));ab.add(abm);
 if(bee){q5m_bandColors(abm,(c,x)=>{if(Math.sin(x*14+1.2)>0)c.multiplyScalar(.14)});const st=q5m_cone(.03,.16,q5m_DARK,4);st.position.set(-1.36,-.08,0);st.rotation.z=Math.PI/2;ab.add(st);
  // the furry thorax
  const n=150,pa=new Float32Array(n*6),ca=new Float32Array(n*6);const c0=C('#8a6a30'),c1=C('#f4d890');for(let i=0,j=0;i<n;j++){const v=V3(h3(j,1,8)-.5,h3(j,2,8)-.5,h3(j,3,8)-.5).normalize();if(v.y<-.3)continue;const Lh=.06+h3(j,4,8)*.06;pa.set([.1+v.x*.27,.06+v.y*.26,v.z*.26,.1+v.x*(.27+Lh),.06+v.y*(.26+Lh),v.z*(.26+Lh)],i*6);ca.set([c0.r,c0.g,c0.b,c1.r,c1.g,c1.b],i*6);i++}
  const hg=new THREE.BufferGeometry();hg.setAttribute('position',new THREE.BufferAttribute(pa,3));hg.setAttribute('color',new THREE.BufferAttribute(ca,3));g.add(new THREE.LineSegments(hg,new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:.9})))}
 // wings: two pairs; the dragonfly's veined
 const W2=[];for(let k=0;k<2;k++)for(const z of[-1,1]){const w=q5m_iwing(bee?(k?.7:1.05):(k?1.5:1.6),bee?(k?.28:.42):(k?.38:.32),wm,{veins:bee?0:5,vein:'#2a3a40'});w.position.set((bee?.22:.4)-k*.22,bee?.28:.2,z*.08);if(z<0)w.scale.z=-1;g.add(w);W2.push({m:w,s:z,a:bee?.5:.6,f:bee?26:30,ph:k*.6})}
 // six legs under the thorax, the front pair reaching forward
 legs(3,bee?.35:.46,.14,-.1,bee?.16:.12,bee?.2:.16,bee?.27:.21,bee?.1:.08,bee?.03:.02,{h:.24,spines:bee?1:0});
 if(bee){const pb=q5m_bead(.045,M('#f0c060',{roughness:.9}));pb.position.set(0,-.12,.04);L[4].m.userData.knee.add(pb);L[5].m.userData.knee.add(pb.clone())}
 for(const l of L)delete l.m.userData.knee;addWings(g,W2);q5m_crawl(g,{extra:t=>{ab.rotation.z=Math.sin(t*2.1)*.06;hd.rotation.y=Math.sin(t*.9)*.15;if(g.userData.jaws)for(const j of g.userData.jaws)j.m.rotation.y=j.z*(-.1-Math.max(0,Math.sin(t*2.4))*.35)}});return q5m_fuse(g)}

/* ---------------- 炸弹翼龙: a seven-metre span on arm and finger bones, a long toothless beak ---------------- */
function bPterosaur(f){const g=new THREE.Group();const col=f.col||'#b8643a';const o={rough:.6};const mat=M(col,{roughness:.6}),mem=M(q5m_dk(col,.9),{side:THREE.DoubleSide,roughness:.72}),bone=M(q5m_dk(col,.7),{roughness:.5});
 g.add(q5m_loft([[.5,0,0,.1,.1],[.25,.05,0,.18,.16],[-.1,.04,0,.17,.15],[-.42,0,0,.08,.07],[-.6,-.02,0,.02,.02]],col,Object.assign({n:8,r:6},o)));
 const nk=new THREE.Group();nk.position.set(.48,.02,0);g.add(nk);
 // neck, skull and the long upper beak in one skin; the lower beak opens
 nk.add(q5m_loft([[-.04,0,0,.09,.085],[.2,.09,0,.075,.07],[.4,.15,0,.085,.075],[.56,.16,0,.07,.06],[.85,.13,0,.035,.03],[1.32,.08,0,.006,.006]],col,Object.assign({n:12,r:6},o,{bellyK:'#f0e8d8'})));
 const jaw=new THREE.Group();jaw.position.set(.58,.11,0);nk.add(jaw);jaw.add(q5m_loft([[0,0,0,.028,.045],[.35,-.01,0,.02,.03],[.7,-.03,0,.005,.005]],'#d8c8a0',{n:4,r:4}));
 q5m_eyes(nk,.48,.19,.06,.025,M('#ffd060',{roughness:.15}),0);
 // wings: the membrane, a leading-edge bone along the arm and the long fourth finger, three small clawed fingers at the wrist
 const W2=[];for(const z of[-1,1]){const w=new THREE.Group();w.position.set(.12,.1,z*.14);g.add(w);w.add(new THREE.Mesh(q5m_wingGeo(2.1,.7,'bat'),mem));
  w.add(q5m_tube([V3(0,.02,0),V3(.2,.06,.35),V3(.385,.05,.73),V3(.3,.03,1.3),V3(.17,0,2.08)],.028,bone,8));
  for(let i=0;i<3;i++){const c=q5m_cone(.012,.07,M('#e8dcc0',{roughness:.4}),4);c.position.set(.42+i*.03,.04,.72-i*.02);c.rotation.z=-Math.PI/2+.5-i*.35;w.add(c)}
  if(z<0)w.scale.z=-1;W2.push({m:w,s:z,a:.45,f:2})}
 for(const z of[-1,1]){const l=new THREE.Group();l.position.set(-.3,-.04,z*.1);l.rotation.z=-1.2;g.add(l);l.add(new THREE.Mesh(q5m_mus(.17,.03,[1,.8,.6],4),mat));const sh=new THREE.Mesh(q5m_mus(.17,.022,[1,.7,.5],4),mat);sh.position.y=-.17;l.add(sh);const ft=q5m_cone(.025,.08,mat,4);ft.position.y=-.36;l.add(ft)}
 addWings(g,W2);stdAnim(g,{wf:2,wa:.45,extra:t=>{nk.rotation.z=Math.sin(t*1.2)*.06;jaw.rotation.z=-Math.max(0,Math.sin(t*.8))*.2;for(const w of W2)w.m.rotation.y=w.s*Math.sin(t*2-.6)*.08}});return q5m_fuse(g)}

/* ---------------- 立蝎: the scorpions that stand up — plated torso, pincer arms, two clawed legs, a tail carried behind ---------------- */
function bUpright(f){if(f.w==='rq_gujia')return bUprightPlain(f);const g=new THREE.Group();const col=f.col||'#b08a5a';
 const o={rough:.45,metal:.05,stripe:7};const mat=M(col,{roughness:.45}),plate=M(q5m_dk(col,.7),{roughness:.4,metalness:.1});
 g.add(q5m_loft([[-.05,.95,0,.22,.26],[0,1.2,0,.3,.33],[.08,1.5,0,.3,.33],[.15,1.75,0,.22,.26],[.2,1.95,0,.12,.16]],col,Object.assign({n:12,r:10},o)));
 const pg=q5m_sphG(1,8,3,0,Math.PI,0,Math.PI*.45);for(let i=0;i<4;i++){const p=new THREE.Mesh(pg,plate);p.scale.set(.15,.3,.33-Math.abs(i-1.5)*.03);p.position.set(-.08+i*.06,1.08+i*.21,0);p.rotation.set(0,-Math.PI/2,-.35);g.add(p)}
 const hd=new THREE.Group();hd.position.set(.22,2.0,0);g.add(hd);hd.add(q5m_loft([[-.12,0,0,.14,.2],[.1,.02,0,.13,.2],[.3,-.03,0,.06,.1]],col,Object.assign({n:6,r:8},o,{stripe:0})));
 q5m_eyes(hd,.02,.11,.06,.035,q5m_DARK,0);q5m_eyes(hd,.06,.06,.17,.02,q5m_DARK,0);q5m_eyes(hd,-.04,.06,.16,.02,q5m_DARK,0);
 for(const z of[-1,1]){const ch=q5m_cone(.025,.1,plate,4);ch.position.set(.32,-.06,z*.04);ch.rotation.z=-Math.PI/2-.3;hd.add(ch)}
 const arms=[];for(const z of[-1,1]){const a=q5m_arm(g,.15,1.72,z*.3,z,.34,.3,.055,mat,col,{yaw:.35,pitch:.9,fold:.9,wrist:.3,cl:.25,cr:.08,lo:o});arms.push(a);
  if(z>0&&f.e&&f.e.includes(3)){const cr=new THREE.Mesh(new THREE.OctahedronGeometry(.12,0),EM('#bff4ff',.6,{roughness:.1}));cr.position.set(.45,0,0);cr.scale.y=1.5;a.ch.add(cr)}}
 // four small legs left over from the scorpion it once was, folded against the belly
 for(let i=0;i<4;i++){const s=i%2?1:-1;const l=new THREE.Group();l.position.set(-.06,1.06+Math.floor(i/2)*.16,s*.24);l.rotation.set(s*.9,0,-.5);g.add(l);l.add(new THREE.Mesh(q5m_mus(.15,.022,[1,.85,.7],6),mat));const t=new THREE.Mesh(q5m_mus(.13,.017,[1,.7,.4],6),mat);t.position.y=-.15;t.rotation.x=-s*.9;l.add(t)}
 // two walking legs: thigh, knee, shin, a clawed three-toed foot
 const L=[];for(const z of[-1,1]){const l=new THREE.Group();l.position.set(0,.98,z*.19);g.add(l);l.add(new THREE.Mesh(q5m_mus(.5,.08,[.8,1.1,1.05,.9,.75],6),mat));
  const k=new THREE.Group();k.position.y=-.5;k.rotation.z=.45;l.add(k);k.add(q5m_bead(.065,mat));k.add(new THREE.Mesh(q5m_mus(.47,.07,[.95,.9,.75,.6],6),mat));
  const ft=new THREE.Group();ft.position.y=-.47;ft.rotation.z=-.45;k.add(ft);const pad=q5m_bead(1,mat);pad.scale.set(.1,.04,.09);pad.position.set(.04,-.01,0);ft.add(pad);
  for(let i=-1;i<=1;i++){const c=q5m_cone(.025,.13,plate,4);c.position.set(.13,-.03,i*.05);c.rotation.set(0,i*.35,-Math.PI/2-.2);ft.add(c)}l.userData.knee=k;L.push({m:l,ph:z>0?0:Math.PI,k:.45})}
 const tl=new THREE.Group();tl.position.set(-.12,1.0,0);g.add(tl);{const pts=[];let px=0,py=0;for(let i=0;i<=7;i++){const th=i*.4-.7;pts.push([px,py,0,.11-i*.012,.11-i*.012]);px-=Math.cos(th)*.22;py+=Math.sin(th)*.22}tl.add(q5m_loft(pts,col,Object.assign({n:16,r:8},o)));
  const st=q5m_cone(.03,.16,plate,4);st.position.set(pts[7][0],pts[7][1],0);st.rotation.z=.6;tl.add(st)}
 addLegs(g,L);g.userData.tails=[{m:tl,a:.15,f:2}];
 stdAnim(g,{fq:7,amp:.45,extra:t=>{arms.forEach((x,i)=>{x.sh.rotation.z=-.9+Math.sin(t*1.4+i*2)*.15;x.ch.userData.jaw.rotation.y=x.z*(.1+Math.max(0,Math.sin(t*1.9+i))*.4)});hd.rotation.y=Math.sin(t*.7)*.2;tl.rotation.z=Math.sin(t*1.3)*.05}});return q5m_fuse(g)}

/* ---------------- squid: a tapered mantle with fins, big eyes, eight arms and two longer tentacles with clubs, colour that drifts ---------------- */
function bSquid(f){const g=new THREE.Group();const col=f.col||'#c86a5a';const skin=new THREE.MeshStandardMaterial({color:col,vertexColors:true,roughness:.4,emissive:'#5a2a8a',emissiveIntensity:.2});const o={mat:skin};
 const mt=q5m_loft([[-1.05,0,0,.03,.03],[-.75,0,0,.16,.14],[-.35,0,0,.27,.24],[.05,0,0,.3,.27],[.42,0,0,.27,.25]],col,Object.assign({n:12,r:10},o));g.add(mt);
 const finM=M(q5m_dk(col,.8),{side:THREE.DoubleSide,roughness:.4});for(const z of[-1,1]){const fn=new THREE.Mesh(q5m_wg(.35,.5,'fin'),finM);fn.position.set(-.85,0,z*.1);fn.rotation.z=Math.PI;fn.rotation.y=Math.PI;if(z<0)fn.scale.z=-1;g.add(fn)}
 const hd=new THREE.Group();hd.position.x=.44;g.add(hd);hd.add(q5m_loft([[0,0,0,.26,.24],[.2,0,0,.24,.23],[.4,-.01,0,.17,.17]],col,Object.assign({n:6,r:10},o)));
 for(const z of[-1,1]){const w=q5m_bead(1,q5m_EYEW,1);w.scale.set(.11,.11,.07);w.position.set(.22,.04,z*.2);hd.add(w);const pu=q5m_bead(1,q5m_DARK);pu.scale.set(.06,.06,.04);pu.position.set(.23,.04,z*.245);hd.add(pu)}
 const sip=q5m_cyl(.03,.045,.18,M(q5m_dk(col,.7)),6);sip.rotation.z=Math.PI/2-.4;sip.position.set(.1,-.22,0);hd.add(sip);
 const arms=[];for(let i=0;i<8;i++){const a=i/8*6.283+.39;const ag=new THREE.Group();ag.position.set(.6,Math.cos(a)*.12,Math.sin(a)*.12);ag.rotation.x=-a;g.add(ag);ag.add(q5m_loft([[0,0,0,.045,.045],[.35,.05,0,.035,.035],[.7,.08,0,.02,.02],[.95,.04,0,.006,.006]],col,Object.assign({n:6,r:5},o)));arms.push(ag)}
 for(const z of[-1,1]){const tg2=new THREE.Group();tg2.position.set(.6,-.04,z*.08);g.add(tg2);tg2.add(q5m_loft([[0,0,0,.03,.03],[.6,.02,0,.02,.02],[1.2,.04,0,.015,.015],[1.4,.04,0,.05,.035],[1.62,.03,0,.01,.01]],col,Object.assign({n:9,r:5},o)));arms.push(tg2)}
 g.userData.anim=t=>{arms.forEach((a,i)=>{a.rotation.y=Math.sin(t*2+i)*.22;a.rotation.z=Math.cos(t*1.7+i)*.18});const k=1+Math.sin(t*2.2)*.05;mt.scale.set(1,k,k);skin.emissive.setHSL((t*.05)%1,.6,.25)};g.userData.swim=1;return q5m_fuse(g)}

/* ---------------- 巨轮虫: a centipede curled into a two-metre wheel, sickle hooks on its back plates, legs tucked inside ---------------- */
function bWheel(f){const g=new THREE.Group();const col=f.col||'#6a4a2a';const o={rough:.45};const bone=M('#d8c8a0',{roughness:.45}),leg=M(q5m_dk(col,.6),{roughness:.5});
 const w=new THREE.Group();w.position.y=1.08;g.add(w);const N=18,R0=.66;const spec=[];for(let i=0;i<=N*2;i++){const a=i/(N*2)*6.283;const k=i%2;spec.push([Math.cos(a)*R0,Math.sin(a)*R0,0,.17+(k?.04:-.03),.24+(k?.05:-.04)])}
 w.add(q5m_loft(spec,col,Object.assign({n:N*3,r:8},o)));
 for(let i=0;i<N;i++){const a=(i+.5)/N*6.283,ca=Math.cos(a),sa=Math.sin(a);const P=(rad,tng)=>V3(ca*rad-sa*tng,sa*rad+ca*tng,0);
  w.add(q5m_tube([P(R0+.17,0),P(R0+.27,.07),P(R0+.37,.16),P(R0+.42,.13)],.022,bone,4));
  for(const z of[-1,1]){const l=q5m_cone(.016,.17,leg,4);const b=(i+.25)/N*6.283;l.position.set(Math.cos(b)*(R0-.22),Math.sin(b)*(R0-.22),z*.16);l.rotation.z=b+Math.PI/2;l.rotation.x=-z*.3;w.add(l)}}
 // the head, biting onto its own tail
 const hd=new THREE.Group();hd.position.set(R0,0,0);w.add(hd);hd.add(q5m_loft([[.1,-.22,0,.2,.28],[.08,0,0,.22,.3],[.05,.2,0,.18,.26],[0,.34,0,.08,.14]],col,Object.assign({n:6,r:8},o,{backK:'#a8a49c'})));
 for(const z of[-1,1]){const e=q5m_bead(.04,q5m_DARK);e.position.set(.24,.2,z*.14);hd.add(e);const m=q5m_cone(.03,.16,bone,4);m.position.set(.1,.42,z*.1);m.rotation.x=-z*.6;hd.add(m);
  hd.add(q5m_tube([0,1,2,3].map(j=>{const t=j/3;return V3(.1+.5*t*Math.cos(1.3)-.1*t,.36+.5*t*Math.sin(1.3),z*(.08+.15*t))}),.012,leg,5))}
 g.userData.anim=t=>{w.rotation.z=-t*6};return q5m_fuse(g)}

/* ---------------- swarms: the clouds of points become small flapping bodies (a sprite sheet of four frames; each point its own
   size, heading and beat), still driven by the herd code through the position attribute ---------------- */
const q5m_bugTexC={};
function q5m_bugTex(kind){if(q5m_bugTexC[kind])return q5m_bugTexC[kind];const t=canvasTex(256,64,(x)=>{for(let f=0;f<4;f++){x.save();x.translate(f*64+32,32);x.fillStyle='rgba(255,255,255,1)';x.strokeStyle='rgba(255,255,255,1)';x.lineWidth=2;
  const el=(cx,cy,rx,ry,rot,a)=>{x.save();x.globalAlpha=a===undefined?1:a;x.translate(cx,cy);x.rotate(rot||0);x.beginPath();x.ellipse(0,0,rx,ry,0,0,6.283);x.fill();x.restore()};
  const ln=(x0,y0,x1,y1)=>{x.beginPath();x.moveTo(x0,y0);x.lineTo(x1,y1);x.stroke()};const ph=f/4*6.283;
  if(kind==='butterfly'){const sp=.35+.65*Math.abs(Math.cos(ph));for(const s of[-1,1]){el(s*13*sp,-6,13*sp,11,s*.3,.95);el(s*10*sp,9,9*sp,8,-s*.4,.85)}el(0,0,3,13);ln(-1,-12,-6,-20);ln(1,-12,6,-20)}
  else if(kind==='wing'){el(0,2,4,15);el(0,-10,5,5);const wa=-.4+.5*Math.sin(ph);for(const s of[-1,1]){el(s*13,-2,14,4.5,s*wa,.55);el(s*9,3,9,3.5,s*(wa+.5),.45)}ln(-2,-14,-8,-24);ln(2,-14,8,-24)}
  else{el(0,4,6,11);el(0,-8,5,6);el(0,-17,4,4);for(let i=0;i<3;i++)for(const s of[-1,1]){const k=Math.sin(ph+i*2.1)*4;ln(s*4,-6+i*7,s*16,-12+i*7+k);ln(s*16,-12+i*7+k,s*20,-4+i*7+k)}ln(-2,-20,-9,-28);ln(2,-20,9,-28)}
  x.restore()}});t.needsUpdate=true;return q5m_bugTexC[kind]=t}
function bSwarm(f){const id=f.w;const n=id==='huangchong'?260:id==='hongshidie'?140:180,g=new THREE.BufferGeometry(),a=new Float32Array(n*3);g.setAttribute('position',new THREE.BufferAttribute(a,3));
 const r=new Float32Array(n*3);for(let i=0;i<n;i++){r[i*3]=.65+h3(i,1,5)*.75;r[i*3+1]=h3(i,2,5)*6.283;r[i*3+2]=(f.alt?8:3)+h3(i,3,5)*4}g.setAttribute('aR',new THREE.BufferAttribute(r,3));
 const glowy=id==='hongshidie'||id==='kuangfeng';const kind=id==='hongshidie'?'butterfly':(f.alt||id==='huangchong'||id==='kuangfeng')?'wing':'bug';
 const m=new THREE.PointsMaterial({map:q5m_bugTex(kind),color:f.col,size:f.alt?(glowy?2.2:1.6):1.1,transparent:true,depthWrite:false,blending:glowy?THREE.AdditiveBlending:THREE.NormalBlending,opacity:glowy?1:.95,alphaTest:.04});
 const U={uT:{value:0}};m.onBeforeCompile=sh=>{sh.uniforms.uT=U.uT;sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nattribute vec3 aR;varying vec3 vR;').replace('gl_PointSize = size;','gl_PointSize = size * aR.x;vR = aR;');
  // (the map lookup lives in a shader chunk, so it is the chunk's include that gets replaced: turn the point, pick the frame)
  sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vR;uniform float uT;').replace('#include <map_particle_fragment>','vec2 q=vec2(gl_PointCoord.x,1.0-gl_PointCoord.y)-.5;float cr=cos(vR.y),sr=sin(vR.y);q=vec2(q.x*cr-q.y*sr,q.x*sr+q.y*cr);if(abs(q.x)>.5||abs(q.y)>.5)discard;float fr=floor(mod(uT*vR.z/6.283+vR.y,1.)*4.);vec4 mapTexel=texture2D(map,vec2((q.x+.5+fr)*.25,q.y+.5));diffuseColor*=mapTexelToLinear(mapTexel);')};
 const p=new THREE.Points(g,m);p.userData.swarm=a;p.userData.free=1;
 // the herd code only touches the position attribute; its needsUpdate is the swarm's clock
 const at=g.attributes.position;Object.defineProperty(at,'needsUpdate',{set(v){if(v===true){this.version++;U.uT.value=(performance.now()/1000)%1000}},get(){return false}});
 return p}

/* ---------------- huts: the mounds get a stone-framed doorway and a few stones pressed into their walls (cone huts and cabins as before) ---------------- */
function bHuts(o){o=Object.assign({n:8,r:2.6,col:'#8a7a5a',roof:'#5a4a3a',kind:'cone'},o||{});if(o.kind!=='mound')return bHutsPlain(o);const g=new THREE.Group();
 const wall=M(o.col,{roughness:.9}),dark=M('#1a120c'),stone=M(q5m_dk(o.col,.72),{roughness:.95});
 for(let i=0;i<o.n;i++){const a=i/o.n*6.28+h3(i,1,9),d=o.r*(.4+h3(i,2,9)*.6);const h=new THREE.Group();
  h.add(new THREE.Mesh(q5m_sphG(.8,12,8,0,6.283,0,1.57),wall));
  for(let k=0;k<4;k++){const b=k*1.9+1.2,el=.25+h3(k+i,6,9)*.8;const st=q5m_bead(.09+h3(k+i,5,9)*.07,stone);st.scale.y*=.7;st.position.set(Math.cos(b)*Math.cos(el)*.8,Math.sin(el)*.8,Math.sin(b)*Math.cos(el)*.8);h.add(st)}
  const hole=new THREE.Mesh(new THREE.CircleGeometry(.22,10),dark);hole.position.set(.77,.24,0);hole.rotation.y=Math.PI/2;h.add(hole);
  for(const z of[-1,1]){const p=new THREE.Mesh(q5m_box(.09,.5,.09),stone);p.position.set(.76,.25,z*.25);h.add(p)}const lt=new THREE.Mesh(q5m_box(.11,.1,.62),stone);lt.position.set(.74,.52,0);h.add(lt);
  h.position.set(Math.cos(a)*d,0,Math.sin(a)*d);h.rotation.y=-a+Math.PI;h.scale.setScalar(.7+h3(i,3,9)*.6);g.add(h)}g.add(shadow(o.r*1.2));return q5m_fuse(g)}

/* ---------------- street life in the dragon-style towns: a cart with spoked wheels, rails and a load; crates with bands, a hooped
   barrel and a sack; a lamp with a bracket arm and a hanging lantern. The other town styles keep their own designs ---------------- */
function q5m_cart(P){const parts=[];const wheel=(x,z,r)=>{parts.push([kcy(r,r,.12,12),P.wood2,{p:[x,r,z],r:[Math.PI/2,0,0]}],[kcy(r*.2,r*.2,.18,6),P.metal,{p:[x,r,z],r:[Math.PI/2,0,0]}]);for(let i=0;i<2;i++)parts.push([kb(.06,r*1.85,.05),P.wood,{p:[x,r,z+(z>0?.065:-.065)],r:[0,0,i*Math.PI/2+.4]}])};
 for(let i=0;i<4;i++)parts.push([kb(1.7,.06,.27),P.wood,{p:[0,.78,-.42+i*.28]}]);parts.push([kb(1.8,.1,.1),P.wood2,{p:[0,.72,.5]}],[kb(1.8,.1,.1),P.wood2,{p:[0,.72,-.5]}]);
 for(const z of[-1,1]){for(let i=0;i<3;i++)parts.push([kb(.06,.48,.06),P.wood2,{p:[-.75+i*.75,1.05,z*.55]}]);parts.push([kb(1.7,.06,.06),P.wood,{p:[0,1.28,z*.55]}],[kb(1.6,.06,.06),P.wood2,{p:[1.7,.72,z*.3],r:[0,0,.1]}])}
 wheel(0,.66,.5);wheel(0,-.66,.5);parts.push([kb(.07,.5,1.16),P.wood,{p:[-.8,1.05,0]}]);
 parts.push([kb(.55,.45,.55),P.load,{p:[-.2,1.05,.1],r:[0,.3,0]}],[kcy(.24,.24,.55,8),P.wood2,{p:[.38,1.09,-.18]}],[tg(new THREE.SphereGeometry(.26,6,4),{s:[1.1,.75,1]}),P.sack,{p:[.32,1.0,.28]}]);
 return G(parts.concat(BEAST(3.1)))}
function q5m_crate(P){return G([[kb(.74,.74,.74),P.wood2,{p:[0,.37,0]}],...[0,1].map(k=>[kb(.78,.1,.78),P.wood,{p:[0,.2+k*.36,0]}]),...[-1,1].map(a=>[kb(.07,.76,.07),P.wood,{p:[a*.36,.38,.36]}]),
  [kb(.5,.5,.5),P.wood,{p:[.55,.25,.45],r:[0,.45,0]}],[kcy(.26,.3,.74,8),P.wood2,{p:[-.6,.37,.3]}],[kcy(.31,.31,.05,8),P.metal,{p:[-.6,.2,.3]}],[kcy(.31,.31,.05,8),P.metal,{p:[-.6,.58,.3]}],
  [tg(new THREE.SphereGeometry(.26,6,4),{s:[1.1,.8,1.1]}),P.sack,{p:[.2,.2,-.55]}]])}
function q5m_lamp(P){const h=P.h||2.6;return G([[kcy(.07,.09,h,6),P.metal,{p:[0,h/2,0]}],[kcy(.15,.18,.12,6),P.metal,{p:[0,.06,0]}],[kb(.52,.06,.06),P.metal,{p:[.22,h-.1,0]}],
  [kb(.22,.3,.22),P.glass,{p:[.44,h-.42,0]}],[kb(.27,.03,.27),P.metal,{p:[.44,h-.58,0]}],[tg(new THREE.ConeGeometry(.2,.14,4),{r:[0,Math.PI/4,0]}),P.metal,{p:[.44,h-.2,0]}]])}
{const K=STREETKIT.dragon;if(K){const P={wood:'#8a6a40',wood2:'#6a5030',metal:BEAM,glass:'#ffcf7a',load:'#a08050',sack:'#c8b088'};K.cart=q5m_cart(P);K.crate=q5m_crate(P);K.lamp=q5m_lamp(P)}}

/* ---------------- swap the new bodies in ---------------- */

// 巨脉蜻蜓 had its legs added on top of the old body (49c); the new body has its own

// 大眼龙 makes the salamander's eyes 2.6 times bigger by looking for the old body's eye spheres; the new body takes the size instead
function q5m_bigEyeLizard(){q5m_eyeK=2.6;try{return bBigEyeLizard.apply(this,arguments)}finally{q5m_eyeK=1}}

