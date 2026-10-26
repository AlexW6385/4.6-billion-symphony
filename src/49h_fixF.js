/* ================================================================
   F: the story's main characters, rebuilt figure by figure from how the book describes them.
   Two kits: fxF_person (尔什民 / 阿特兰 / 莎琳 and the like: people built like us) and fxF_drake
   (骸龙, 翡翠龙, 白骸龙). Each character then gets its own face, hair, clothes, signature things
   and a small idle motion. Every top-level name here starts with fxF_.
   ================================================================ */
const fxF_G={};   // shared geometries
function fxF_geo(k,f){return fxF_G[k]||(fxF_G[k]=f())}
function fxF_sph(r,sx,sy,sz,mat,seg){seg=seg||16;const m=new THREE.Mesh(fxF_geo('s'+seg,()=>new THREE.SphereGeometry(1,seg,Math.max(8,(seg*.75)|0))),mat);m.scale.set(r*sx,r*(sy===undefined?sx:sy),r*(sz===undefined?sx:sz));return m}
function fxF_cyl(r0,r1,h,mat,seg,open){return new THREE.Mesh(new THREE.CylinderGeometry(r0,r1,h,seg||10,1,!!open),mat)}
function fxF_tex(w,h,draw){const t=canvasTex(w,h,draw);t.anisotropy=4;return t}
function fxF_box(x,y,z,mat){return new THREE.Mesh(new THREE.BoxGeometry(x,y,z),mat)}
// a part hanging from its joint along -y
function fxF_hang(len,r0,r1,mat,seg){const g=new THREE.Group();const m=fxF_cyl(r1,r0,len,mat,seg||10);m.position.y=-len/2;g.add(m);g.add(fxF_sph(r0,1,1,1,mat,10));g.userData.len=len;return g}
// a jointed strand: each joint a group, rotate them to curl it
function fxF_chain(n,seg,r0,r1,mat,noJ){const root=new THREE.Group();const J=[];let par=root;for(let i=0;i<n;i++){const r=r0+(r1-r0)*i/n,rn=r0+(r1-r0)*(i+1)/n;const j=new THREE.Group();if(i)j.position.y=-seg;par.add(j);
  const c=fxF_cyl(rn,r,seg*1.04,mat,7);c.position.y=-seg/2;j.add(c);if(!noJ)j.add(fxF_sph(r,1,1,1,mat,8));J.push(j);par=j}
 const end=new THREE.Group();end.position.y=-seg;par.add(end);return{root,J,end}}
// lathe around y from [r,y] pairs; z squashed by d; optional gap facing +x
function fxF_lathe(pts,mat,d,seg,gap){const geo=new THREE.LatheGeometry(pts.map(p=>new THREE.Vector2(p[0],p[1])),seg||18,gap?Math.PI/2+gap:0,gap?Math.PI*2-gap*2:Math.PI*2);geo.scale(1,1,d||1);return new THREE.Mesh(geo,mat)}
// a pleated skirt or coat hem: open cone with folds, hanging from y=0
function fxF_skirt(rt,rb,len,mat,n,amp,gap){const geo=new THREE.CylinderGeometry(rt,rb,len,n*6,4,true,gap?Math.PI/2+gap:0,gap?Math.PI*2-gap*2:Math.PI*2);const P=geo.attributes.position;for(let i=0;i<P.count;i++){const x=P.getX(i),y=P.getY(i),z=P.getZ(i);const a=Math.atan2(z,x),t=(len/2-y)/len;const k=1+amp*t*Math.cos(a*n);P.setXYZ(i,x*k,y-len/2,z*k)}geo.computeVertexNormals();return new THREE.Mesh(geo,mat)}

/* ---------- people ----------
   o: {h, child(0..1), skin, iris, hair, brow, lip, female, blush}
   returns {g,headG,chest,spine,arms,legs,hands,H,rH,...}; clothes and hair are added by each character */
function fxF_person(o){o=Object.assign({h:2,child:0,skin:'#eccdb4',iris:'#5a4a3a',hair:'#2a2220',lip:'#c07a72'},o);const H=o.h,c=o.child;const g=new THREE.Group();
 const sk=M(o.skin,{roughness:.55});
 const headH=H*(.13+.045*c),legL=H*(.47-.035*c),neckL=H*.035,torL=H-legL-headH-neckL;const shW=H*(.1-.012*c),hipW=H*(.075+(o.female?.008:0));
 const R={g,H,sk,headH,legL,torL,shW,hipW,o};
 const spine=new THREE.Group();spine.position.y=legL;g.add(spine);R.spine=spine;
 const chest=new THREE.Group();chest.position.y=torL*.5;spine.add(chest);R.chest=chest;
 const fem=o.female?1:0;
 R.torsoPts=[[hipW*1.05,-torL*.06],[hipW*1.12,torL*.1],[hipW*.95,torL*.3],[shW*.72,torL*.45],[shW*(.8+fem*.05),torL*.62],[shW*.86,torL*.8],[shW*.8,torL*.92],[shW*.45,torL*1.0],[H*.03,torL*1.03]];
 const body=fxF_lathe(R.torsoPts,sk,.62,16);spine.add(body);R.body=body;
 const neck=fxF_cyl(H*.026,H*.03,neckL*1.8,sk,10);neck.position.y=torL+neckL*.4;spine.add(neck);
 const headG=new THREE.Group();headG.position.y=torL+neckL;spine.add(headG);R.headG=headG;const rH=headH*.5;R.rH=rH;
 R.eyes=[];if(!o.noHead){
 const cran=fxF_sph(rH,.95,1,.86,sk,24);cran.position.set(-rH*.04,rH*1.02,0);headG.add(cran);R.cran=cran;cran.userData.fxHead=1;
 const jaw=fxF_sph(rH,.8,.62,.74,sk,18);jaw.position.set(rH*.12,rH*.62,0);headG.add(jaw);
 const chin=fxF_sph(rH,.3,.24,.34,sk,12);chin.position.set(rH*.52,rH*.3,0);headG.add(chin);
 const big=1+c*.35;const eyes=[];const white=M('#fbfaf6',{roughness:.25}),irisM=M(o.iris,{roughness:.2}),pup=M('#0c0a0a',{roughness:.1}),gl=GL('#ffffff');
 for(const z of[-1,1]){const e=new THREE.Group();e.position.set(rH*.74,rH*.9,z*rH*.36);headG.add(e);
  e.add(fxF_sph(rH*.17*big,.45,1.05,1,o.eyeWhite||white,14));const ir=fxF_sph(rH*.12*big,.4,1.08,1,irisM,14);ir.position.x=rH*.045;e.add(ir);const pp=fxF_sph(rH*.06*big,.3,1.1,1,pup,10);pp.position.x=rH*.075;e.add(pp);
  const hl=fxF_sph(rH*.032*big,.3,1,1,gl,6);hl.position.set(rH*.095,rH*.05*big,-z*rH*.03);e.add(hl);
  const lid=fxF_sph(rH*.19*big,.5,.26,1.06,sk,12);lid.position.set(rH*.0,rH*.17*big,0);e.add(lid);eyes.push(e);
  const br=fxF_cyl(1,1,1,M(o.brow||o.hair),6);br.scale.set(rH*.035,rH*.26,rH*.03);br.rotation.x=Math.PI/2;br.rotation.y=z*.12;br.rotation.z=-z*(o.browTilt||0);br.position.set(rH*.8,rH*(1.14+c*.06),z*rH*.37);headG.add(br)}
 R.eyes=eyes;
 const nose=fxF_sph(rH,.09,.11,.075,sk,10);nose.position.set(rH*.9,rH*.7,0);headG.add(nose);
 const mouth=fxF_sph(rH,.05,.035,.16,M(o.lip,{roughness:.4}),10);mouth.position.set(rH*.86,rH*.43,0);headG.add(mouth);R.mouth=mouth;
 if(o.blush)for(const z of[-1,1]){const b=fxF_sph(rH,.04,.08,.12,TR('#ff8a8a',.32),10);b.position.set(rH*.76,rH*.62,z*rH*.46);headG.add(b)}
 for(const z of[-1,1]){const ea=fxF_sph(rH,.12,.24,.07,sk,10);ea.position.set(-rH*.02,rH*.86,z*rH*.84);headG.add(ea)}}
 const arms=[],hands=[];for(const z of[-1,1]){const sh=new THREE.Group();sh.position.set(0,torL*.86,z*shW*.98);spine.add(sh);
  const ua=fxF_hang(H*.165,H*.032,H*.026,sk);sh.add(ua);const el=new THREE.Group();el.position.y=-H*.165;ua.add(el);const fa=fxF_hang(H*.15,H*.025,H*.019,sk);el.add(fa);
  const hd=new THREE.Group();hd.position.y=-H*.15;fa.add(hd);const palm=fxF_sph(H*.03,.75,1.15,.42,sk,10);palm.position.y=-H*.028;hd.add(palm);
  const fing=fxF_sph(H*.026,.65,1,.38,sk,10);fing.position.set(H*.006,-H*.062,0);fing.rotation.z=.15;hd.add(fing);
  const th=fxF_cyl(H*.009,H*.007,H*.035,sk,6);th.position.set(H*.018,-H*.03,-z*H*.012);th.rotation.z=.5;hd.add(th);
  sh.rotation.x=z*.07;el.rotation.z=.18;arms.push({sh,ua,el,fa,hd,z});hands.push(hd)}
 R.arms=arms;R.hands=hands;
 const legs=[];for(const z of[-1,1]){const hp=new THREE.Group();hp.position.set(0,legL,z*hipW*.55);g.add(hp);const th=fxF_hang(legL*.5,H*.045,H*.034,sk);hp.add(th);const kn=new THREE.Group();kn.position.y=-legL*.5;th.add(kn);
  const sh=fxF_hang(legL*.47,H*.033,H*.022,sk);kn.add(sh);const an=new THREE.Group();an.position.y=-legL*.47;sh.add(an);legs.push({hp,th,kn,sh,an,z})}
 R.legs=legs;
 g.add(shadow(H*.2));
 return R}
// clothes on a person
function fxF_top(R,mat,o){o=o||{};const t=fxF_lathe(R.torsoPts.map(p=>[p[0]*(o.k||1.05)+(o.add||0),p[1]]),mat,(o.d||.62)*(o.k||1.05)/1.05,20,o.gap);R.spine.add(t);return t}
function fxF_sleeves(R,mat,len,o){o=o||{};const k=o.k||1,H=R.H;for(const a of R.arms){const l1=Math.min(1,len);const s=fxF_cyl(H*.037*k,H*.031*k,H*.165*l1,mat,10);s.position.y=-H*.165*l1/2;a.ua.add(s);a.ua.add(fxF_sph(H*.038*k,1,1,1,mat,10));
  if(len>1){const l2=Math.min(1,len-1);const f=fxF_cyl(H*.03*k,H*.025*k,H*.15*l2,mat,10);f.position.y=-H*.15*l2/2;a.fa.add(f);a.el.add(fxF_sph(H*.031*k,1,1,1,mat,10));
   if(o.cuff){const cf=fxF_cyl(H*.027*k,H*.027*k,H*.02,o.cuff,10);cf.position.y=-H*.15*l2+H*.01;a.fa.add(cf)}}}}
function fxF_legwear(R,mat,up,o){o=o||{};const k=o.k||1,H=R.H;for(const l of R.legs){if(up.thigh){const t=fxF_cyl(H*.05*k,H*.038*k,R.legL*.5*up.thigh,mat,10);t.position.y=-R.legL*.5*up.thigh/2;l.th.add(t);l.th.add(fxF_sph(H*.05*k,1,.8,1,mat,10))}
  if(up.shin){const s=fxF_cyl(H*.037*k,H*.026*k,R.legL*.47*up.shin,mat,10);s.position.y=-R.legL*.47*(1-up.shin/2);l.sh.add(s);if(up.shin>=1)l.kn.add(fxF_sph(H*.038*k,1,1,1,mat,10))}}}
function fxF_shoes(R,mat,o){o=o||{};const H=R.H;for(const l of R.legs){const s=fxF_sph(H*.04,1.55*(o.L||1),.62*(o.T||1),.82*(o.W||1),mat,14);s.position.set(H*.03,-H*.012,0);l.an.add(s);if(o.sole){const so=fxF_sph(H*.041,1.58*(o.L||1),.22,.86*(o.W||1),o.sole,12);so.position.set(H*.03,-H*.034,0);l.an.add(so)}}}
// hair: cap, back of the head, fringe and side locks
function fxF_hairCap(R,mat,o){o=o||{};const rH=R.rH;const cov=o.cov||.56;const cap=new THREE.Mesh(fxF_geo('hcap'+cov,()=>new THREE.SphereGeometry(1,24,14,0,Math.PI*2,0,Math.PI*cov)),mat);cap.scale.set(rH*1.0,rH*1.07,rH*.93);
 cap.position.copy(R.cran.position);cap.rotation.z=o.tilt===undefined?.32:o.tilt;R.headG.add(cap);
 const back=fxF_sph(rH,.86,.98,.92,mat,18);back.position.set(-rH*.16,rH*.9,0);R.headG.add(back);
 const n=o.fringe===undefined?7:o.fringe;for(let i=0;i<n;i++){const a=(i/(n-1)-.5)*(o.spread||1.9);const f=fxF_sph(rH,.11,.34*(o.fLen||1),.17,mat,8);f.position.set(rH*.8*Math.cos(a)+rH*.02,rH*(1.32-(o.fLen||1)*.1),rH*.84*Math.sin(a));f.rotation.x=-a*.45;f.rotation.z=-.3;R.headG.add(f)}
 if(o.side!==0)for(const z of[-1,1]){const s=fxF_sph(rH,.2,.5*(o.side||1),.15,mat,10);s.position.set(rH*.22,rH*(.9-(o.side||1)*.2),z*rH*.84);R.headG.add(s)}
 return cap}
// idle: breathe, sway, blink, look about; o.extra(t) for the character's own motion
function fxF_idle(R,o){o=o||{};const g=R.g;const ph=o.ph||0;
 g.userData.anim=t=>{t+=ph;const br=Math.sin(t*1.7);R.chest.scale.set(1,1+br*.012,1+br*.02);R.spine.rotation.z=Math.sin(t*.5)*.015+(o.lean||0);
  R.headG.rotation.y=Math.sin(t*.37)*.22*(o.look===undefined?1:o.look)+(o.turn||0);R.headG.rotation.z=Math.sin(t*.53)*.04+(o.nod||0);R.headG.rotation.x=Math.sin(t*.29)*.05+(o.tilt||0);
  const bl=(t*.31)%1;const s=bl<.035?Math.max(.08,Math.abs(bl/.0175-1)):1;for(const e of R.eyes)e.scale.y=s+Math.sin(t*.2)*.002;
  if(!o.noArms)for(const a of R.arms)a.sh.rotation.z=Math.sin(t*1.1+a.z)*.04;
  if(o.extra)o.extra(t)};return g}

/* ================= 维罗尼卡 =================
   琳的间谍在尔什用的身份：一个幼小的尔什民女孩，体重才三十公斤上下；黑发，琳特意把头发弄得极长，
   能像触手一样伸出去收集微生物、检查东西、救人。在天宫学院当学生，手上戴着学院发的手表。 */
function fxF_veronica(){const R=fxF_person({h:1.55,child:.85,skin:'#f1d9c6',iris:'#3a3348',hair:'#16141a',brow:'#1a181e',female:1,blush:1,lip:'#c9787a'});const H=R.H,rH=R.rH;R.g.userData.noSkin=1;
 const navy=M('#26304f',{roughness:.75}),navy2=M('#1b2238',{roughness:.8}),white=M('#f3f1ea',{roughness:.7}),gold=M('#d8b25a',{metalness:.7,roughness:.3}),red=M('#b8323a',{roughness:.6}),hairM=M('#16141a',{roughness:.45,metalness:.15}),sock=M('#1c1c24',{roughness:.9}),shoe=M('#2a1c18',{roughness:.35});
 // blouse under an open blazer, ribbon at the collar, pleated skirt, knee socks, loafers
 fxF_top(R,white,{k:1.03});fxF_top(R,navy,{k:1.12,gap:.38});
 for(const z of[-1,1]){const lp=fxF_box(H*.012,H*.11,H*.035,navy2);lp.position.set(R.shW*.78,R.torL*.86,z*R.shW*.26);lp.rotation.x=-z*.35;R.spine.add(lp)}
 const rib=new THREE.Group();rib.position.set(R.shW*.62,R.torL*.93,0);R.spine.add(rib);for(const z of[-1,1]){const l=fxF_sph(H*.02,.45,.7,1.3,red,10);l.position.z=z*H*.02;l.rotation.x=z*.5;rib.add(l);const tl=fxF_sph(H*.014,.4,1.8,.7,red,8);tl.position.set(H*.006,-H*.032,z*H*.01);tl.rotation.x=-z*.25;rib.add(tl)}rib.add(fxF_sph(H*.011,1,1,1,red,8));
 const badge=fxF_sph(H*.016,.3,1,1,gold,12);badge.position.set(R.shW*.78,R.torL*.66,-R.shW*.46);R.spine.add(badge);
 for(let i=0;i<2;i++){const b=fxF_sph(H*.008,.5,1,1,gold,8);b.position.set(R.shW*.84,R.torL*(.44-i*.14),R.shW*.3);R.spine.add(b)}
 const sk=fxF_skirt(R.hipW*1.15,R.hipW*1.8,H*.15,navy,12,.07);sk.position.y=-R.torL*.02;sk.scale.z=.8;R.spine.add(sk);
 const band=fxF_cyl(R.hipW*1.16,R.hipW*1.16,H*.02,navy2,20);band.position.y=-R.torL*.02;band.scale.z=.8;R.spine.add(band);
 fxF_sleeves(R,navy,1.85,{cuff:white});fxF_legwear(R,sock,{shin:.8},{k:1.04});fxF_shoes(R,shoe,{sole:navy2});
 const wa=R.arms[0];const wt=fxF_cyl(H*.024,H*.024,H*.016,M('#3a3c44',{metalness:.6,roughness:.3}),12);wt.position.y=-H*.13;wa.fa.add(wt);const face=fxF_cyl(H*.013,H*.013,H*.006,EM('#7fe0ff',.8),12);face.rotation.z=Math.PI/2;face.position.set(H*.024,-H*.13,0);wa.fa.add(face);
 // hair: black, straight, down to the backs of the knees, a few strands alive
 fxF_hairCap(R,hairM,{fringe:9,spread:2.1,side:1.6});
 const sheetM=M('#16141a',{roughness:.45,metalness:.15,side:THREE.DoubleSide});
 const sheet=new THREE.Mesh(new THREE.CylinderGeometry(rH*.98,R.hipW*1.5,H*.6,22,6,true,Math.PI*.55,Math.PI*.9),sheetM);
 {const P=sheet.geometry.attributes.position;for(let i=0;i<P.count;i++){const x=P.getX(i),y=P.getY(i),z=P.getZ(i);const a=Math.atan2(z,x);const w=1+.05*Math.sin(a*15+y*9);P.setXYZ(i,x*w,y,z*w)}sheet.geometry.computeVertexNormals()}
 sheet.position.set(-rH*.2,R.torL+R.headH*.62-H*.3,0);R.spine.add(sheet);
 const flow=new THREE.Group();flow.position.set(-rH*.35,R.torL+rH*1.4,0);R.spine.add(flow);
 const strands=[];for(let i=0;i<7;i++){const a=(i/6-.5)*2.4;const live=i===1||i===3||i===5;const ch=fxF_chain(live?14:8,H*(live?.05:.075),H*.016,H*.004,hairM,!live);ch.root.position.set(-rH*.45*Math.cos(a)+rH*.1,0,rH*.8*Math.sin(a));flow.add(ch.root);if(!live)ch.J.forEach((j,k)=>{j.rotation.z=(k===0?.15:0)+Math.sin(i+k)*.03;j.rotation.x=k===0?Math.sin(a)*.25:0});strands.push({J:ch.J,ph:i*1.37,z:Math.sin(a),live})}
 fxF_idle(R,{extra:t=>{for(const s of strands)s.J.forEach((j,k)=>{if(s.live){const w=Math.sin(t*1.2+s.ph-k*.45);j.rotation.z=k===0?-1.85-.3*Math.sin(t*.5+s.ph):-.02+w*.22;j.rotation.x=k===0?s.z*.75:Math.cos(t*.9+s.ph-k*.5)*.12}
   });
  R.arms[1].sh.rotation.z=-.1+Math.sin(t*.8)*.05}});
 return R.g}

/* the academy uniform, shared by the students of 天宫学院 */
function fxF_uniform(R,o){o=o||{};const H=R.H;const navy=M('#26304f',{roughness:.75}),navy2=M('#1b2238',{roughness:.8}),white=M('#f3f1ea',{roughness:.7}),gold=M('#d8b25a',{metalness:.7,roughness:.3}),tie=M(o.tie||'#b8323a',{roughness:.6});
 fxF_top(R,white,{k:1.03});fxF_top(R,navy,{k:1.12,gap:.38});
 for(const z of[-1,1]){const lp=fxF_box(H*.012,H*.11,H*.035,navy2);lp.position.set(R.shW*.78,R.torL*.86,z*R.shW*.26);lp.rotation.x=-z*.35;R.spine.add(lp)}
 const rib=new THREE.Group();rib.position.set(R.shW*.62,R.torL*.93,0);R.spine.add(rib);for(const z of[-1,1]){const l=fxF_sph(H*.02,.45,.7,1.3,tie,10);l.position.z=z*H*.02;l.rotation.x=z*.5;rib.add(l);const tl=fxF_sph(H*.014,.4,1.8,.7,tie,8);tl.position.set(H*.006,-H*.032,z*H*.01);tl.rotation.x=-z*.25;rib.add(tl)}rib.add(fxF_sph(H*.011,1,1,1,tie,8));
 const badge=fxF_sph(H*.016,.3,1,1,gold,12);badge.position.set(R.shW*.78,R.torL*.66,-R.shW*.46);R.spine.add(badge);
 for(let i=0;i<2;i++){const b=fxF_sph(H*.008,.5,1,1,gold,8);b.position.set(R.shW*.84,R.torL*(.44-i*.14),R.shW*.3);R.spine.add(b)}
 const sk=fxF_skirt(R.hipW*1.15,R.hipW*(o.flare||1.8),H*(o.skirt||.15),navy,12,.07);sk.position.y=-R.torL*.02;sk.scale.z=.8;R.spine.add(sk);
 const band=fxF_cyl(R.hipW*1.16,R.hipW*1.16,H*.02,navy2,20);band.position.y=-R.torL*.02;band.scale.z=.8;R.spine.add(band);
 fxF_sleeves(R,navy,o.sleeve||1.85,{cuff:white});
 // the watch the academy hands out
 const wa=R.arms[0];const wt=fxF_cyl(H*.024,H*.024,H*.016,M('#3a3c44',{metalness:.6,roughness:.3}),12);wt.position.y=-H*.13;wa.fa.add(wt);const face=fxF_cyl(H*.013,H*.013,H*.006,EM(o.watch||'#7fe0ff',.8),12);face.rotation.z=Math.PI/2;face.position.set(H*.024,-H*.13,0);wa.fa.add(face);
 return {navy,navy2,white}}

/* ================= 比露 =================
   维罗尼卡的同学：年纪小、胆子时大时小、力气惊人（只强化了一点体能就能一拳把偷猎者的脸打凹），
   从学长手里抢来一把长刀，总念叨着想要真正的单分子利刃。 */
function fxF_bilu(){const R=fxF_person({h:1.62,child:.7,skin:'#efcfb2',iris:'#3f6a3a',hair:'#b8562a',brow:'#8a3a1a',female:1,blush:1,lip:'#d07a6a',browTilt:.15});const H=R.H,rH=R.rH;R.g.userData.noSkin=1;
 const U=fxF_uniform(R,{tie:'#e0a030',sleeve:1.45,skirt:.14});const hairM=M('#b8562a',{roughness:.6});
 fxF_legwear(R,M('#f0eee8',{roughness:.9}),{shin:.55},{k:1.04});fxF_shoes(R,M('#c83a2a',{roughness:.4}),{sole:M('#f4f4f4'),L:1.05,T:1.15});
 // rolled sleeves, sticking plaster on the cheek
 for(const a of R.arms){const r=fxF_cyl(H*.04,H*.04,H*.03,U.white,10);r.position.y=-H*.15;a.ua.add(r)}
 const pl=fxF_box(rH*.05,rH*.12,rH*.22,M('#f2d8b0'));pl.position.set(rH*.66,rH*.62,-rH*.5);pl.rotation.y=.6;R.headG.add(pl);
 // short messy hair with a high side ponytail
 fxF_hairCap(R,hairM,{fringe:6,spread:1.8,fLen:.8,side:.9});
 for(let i=0;i<5;i++){const t=fxF_sph(rH,.12,.3,.12,hairM,8);const a=i*1.26;t.position.set(-rH*.3+Math.cos(a)*rH*.4,rH*1.85,Math.sin(a)*rH*.4);t.rotation.set(Math.sin(a)*.8,0,Math.cos(a)*.8);R.headG.add(t)}
 const tie=fxF_sph(rH,.12,.12,.12,M('#e0a030'),8);tie.position.set(-rH*.55,rH*1.55,rH*.6);R.headG.add(tie);
 const tail=fxF_chain(6,rH*.32,rH*.2,rH*.06,hairM);tail.root.position.copy(tie.position);tail.root.rotation.set(.5,0,-.9);R.headG.add(tail.root);
 // the long blade, resting on her shoulder
 const bl=new THREE.Group();const hilt=fxF_cyl(H*.014,H*.014,H*.13,M('#2a2420',{roughness:.6}),8);bl.add(hilt);const gd=fxF_box(H*.02,H*.012,H*.07,M('#8a8478',{metalness:.7,roughness:.3}));gd.position.y=H*.07;bl.add(gd);
 const blade=fxF_box(H*.006,H*.62,H*.035,M('#dfe6ec',{metalness:.9,roughness:.15}));blade.position.y=H*.38;bl.add(blade);const edge=fxF_box(H*.003,H*.6,H*.006,EM('#bff4ff',.5));edge.position.set(0,H*.38,H*.019);bl.add(edge);
 const ra=R.arms[1];ra.hd.add(bl);bl.position.set(0,-H*.04,0);bl.rotation.set(0,0,-1.55);
 const la=R.arms[0];
 fxF_idle(R,{look:.7,noArms:1,extra:t=>{const b=Math.abs(Math.sin(t*3.2))*.012;R.spine.position.y=R.legL+b*H*.6;for(const l of R.legs){l.hp.position.y=R.legL+b*H*.6;l.kn.rotation.z=-.05-b*3}
  ra.sh.rotation.z=.45+Math.sin(t*1.6)*.05;ra.sh.rotation.x=.12;ra.el.rotation.z=2.15;la.sh.rotation.z=-.15;la.sh.rotation.x=-.45;la.el.rotation.z=1.5;la.el.rotation.x=.3;tail.J.forEach((j,k)=>j.rotation.z=(k?.25:0)+Math.sin(t*3.2-k*.6)*.12)}});
 return R.g}

/* ================= 特丽提 =================
   英雄总部地下实验室里穿白衣的研究员，地位不低，学生们叫它特丽提老师；
   一有空就盯着眼前的影像屏幕敲资料，一心想去探索“泥潭”。 */
function fxF_teliti(){const R=fxF_person({h:1.95,child:0,skin:'#e9cdb6',iris:'#4a6a8a',hair:'#5a3e30',female:1,lip:'#b86a62'});const H=R.H,rH=R.rH;R.g.userData.noSkin=1;
 const coat=M('#f7f7f3',{roughness:.65}),under=M('#5d6e86',{roughness:.8}),pants=M('#3a3f4a',{roughness:.85}),hairM=M('#5a3e30',{roughness:.6});
 fxF_top(R,under,{k:1.03});fxF_top(R,coat,{k:1.13,gap:.32});
 const hem=fxF_skirt(R.hipW*1.25,R.hipW*1.6,H*.3,M('#f7f7f3',{roughness:.65,side:THREE.DoubleSide}),5,.04,.3);hem.position.y=R.torL*.05;hem.scale.z=.82;R.spine.add(hem);
 for(const z of[-1,1]){const lp=fxF_box(H*.012,H*.16,H*.04,coat);lp.position.set(R.shW*.8,R.torL*.8,z*R.shW*.28);lp.rotation.x=-z*.3;R.spine.add(lp);
  const pk=fxF_box(H*.01,H*.05,H*.06,M('#e8e8e2'));pk.position.set(R.hipW*1.25,-R.torL*.04,z*R.hipW*.75);pk.rotation.y=-z*.5;R.spine.add(pk)}
 for(let i=0;i<3;i++){const p=fxF_cyl(H*.004,H*.004,H*.05,M(['#2a5aa8','#c83a3a','#1a1a1a'][i]),5);p.position.set(R.shW*.85,R.torL*.7,-R.shW*(.34+i*.06));R.spine.add(p)}
 // the access card that let the spy in everywhere
 const card=fxF_box(H*.004,H*.05,H*.034,M('#e8eef4'));card.position.set(R.shW*.92,R.torL*.58,R.shW*.38);R.spine.add(card);const cs=fxF_box(H*.005,H*.014,H*.028,EM('#3a8ae0',.6));cs.position.set(R.shW*.925,R.torL*.6,R.shW*.38);R.spine.add(cs);
 fxF_sleeves(R,coat,1.9,{k:1.08});fxF_legwear(R,pants,{thigh:1,shin:1});fxF_shoes(R,M('#2a2622',{roughness:.4}),{sole:M('#1a1816')});
 // thin glasses, hair pinned up in a bun with a pencil through it
 const gm=M('#6a5040',{metalness:.4,roughness:.4});for(const z of[-1,1]){const ri=new THREE.Mesh(new THREE.TorusGeometry(rH*.15,rH*.016,6,16),gm);ri.position.set(rH*.86,rH*.9,z*rH*.35);ri.rotation.y=Math.PI/2;R.headG.add(ri);const arm=fxF_cyl(rH*.012,rH*.012,rH*.8,gm,4);arm.rotation.z=Math.PI/2;arm.position.set(rH*.45,rH*.95,z*rH*.75);R.headG.add(arm)}
 const lensM=TR('#d8f0ff',.25);for(const z of[-1,1]){const l=fxF_sph(rH*.15,.1,1,1,lensM,12);l.position.set(rH*.87,rH*.9,z*rH*.35);R.headG.add(l)}
 fxF_hairCap(R,hairM,{fringe:5,spread:1.5,fLen:.7,side:1.1,tilt:.2});const bun=fxF_sph(rH*.42,1,.9,1,hairM,14);bun.position.set(-rH*.78,rH*1.45,0);R.headG.add(bun);
 const pen=fxF_cyl(rH*.03,rH*.03,rH*1.1,M('#d8b040'),6);pen.position.copy(bun.position);pen.rotation.x=1.2;pen.rotation.z=.3;R.headG.add(pen);
 // the floating screen it keeps typing on
 const scr=new THREE.Group();scr.position.set(H*.3,H*.62,0);R.g.add(scr);
 const tex=fxF_tex(128,96,(x,w,h)=>{x.fillStyle='rgba(20,60,90,.55)';x.fillRect(0,0,w,h);x.strokeStyle='#bff4ff';x.lineWidth=2;x.strokeRect(2,2,w-4,h-4);x.fillStyle='#bff4ff';for(let i=0;i<9;i++)x.fillRect(10,12+i*8,20+((i*37)%70),3);x.beginPath();x.arc(100,60,16,0,6.3);x.stroke();x.beginPath();x.moveTo(100,44);x.lineTo(100,76);x.moveTo(84,60);x.lineTo(116,60);x.stroke()});
 const pane=new THREE.Mesh(new THREE.PlaneGeometry(H*.26,H*.19),new THREE.MeshBasicMaterial({map:tex,transparent:true,opacity:.85,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));pane.rotation.y=-Math.PI/2+0;pane.rotation.x=0;pane.rotation.order='YXZ';pane.rotation.x=-.5;scr.add(pane);
 const kbd=new THREE.Mesh(new THREE.PlaneGeometry(H*.18,H*.07),new THREE.MeshBasicMaterial({color:'#7fe0ff',transparent:true,opacity:.35,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));kbd.rotation.x=-Math.PI/2;kbd.position.set(-H*.12,-H*.12,0);scr.add(kbd);scr.add(at(glowSprite('#9fe8ff',H*.5,.25),0,0,0));
 for(const a of R.arms){a.sh.rotation.z=.75;a.el.rotation.z=1.1;a.sh.rotation.x=-a.z*.1}
 fxF_idle(R,{look:.25,tilt:.12,noArms:1,extra:t=>{R.arms.forEach((a,i)=>{a.sh.rotation.z=.72+Math.sin(t*9+i*2)*.03;a.el.rotation.z=1.15+Math.max(0,Math.sin(t*11+i*1.7))*.12});pane.material.opacity=.75+Math.sin(t*7)*.08;scr.position.y=H*.62+Math.sin(t*1.3)*H*.008}});
 return R.g}

/* ================= 诺 与 炉火 =================
   代表尔什意识的领队，穿着虚空防护服（硬头盔、背后的小推进包、带钩爪的鞋、腰间的匕首）。
   在凝固虚空的入口，它摘下头盔坐在地上，看着那块会发光的“炉火”发呆：
   一米见方、像石块的方形生物，顶上跳着白色的、没有温度的火焰，照亮周围一圈，外面是彻底的漆黑。 */
function fxF_hearth(s){s=s||1;const g=new THREE.Group();const stone=M('#6f6a64',{roughness:.95,flatShading:true});
 const geo=new THREE.BoxGeometry(1,1,1,4,4,4);const P=geo.attributes.position;for(let i=0;i<P.count;i++){const x=P.getX(i),y=P.getY(i),z=P.getZ(i);const n=(h3(x*3.1,y*2.7,z*3.3)-.5)*.06;const k=.94+n;P.setXYZ(i,x*k,y*k,z*k)}geo.computeVertexNormals();
 const cube=new THREE.Mesh(geo,stone);cube.scale.setScalar(s);cube.position.y=s*.5;g.add(cube);
 for(let i=0;i<6;i++){const c=fxF_box(s*.02,s*.3,s*.01,M('#3a3632'));c.position.set((h3(i,1,1)-.5)*s*.8,s*(.3+h3(i,2,1)*.4),s*.505);c.rotation.z=h3(i,3,1)-.5;g.add(c)}
 const core=fxF_sph(s*.22,1,.5,1,GL('#f4f8ff',.9),12);core.position.y=s*1.01;g.add(core);
 const fl=[];for(let i=0;i<5;i++){const f=new THREE.Mesh(fxF_geo('flame',()=>new THREE.ConeGeometry(1,1,8,1,true)),GL(i%2?'#ffffff':'#dfe8ff',.55));f.position.set((h3(i,4,1)-.5)*s*.25,s*1.2,(h3(i,5,1)-.5)*s*.25);g.add(f);fl.push(f)}
 const em=emitter({n:50,life:1.2,speed:s*.7,spread:.25,size:s*.5,dir:[0,1,0],col:'#ffffff',col2:'#c8d8ff',op:.8,area:[s*.4,s*.05,s*.4]});em.position.y=s*1.05;g.add(em);
 const halo=glowSprite('#eef4ff',s*4,.55);halo.position.y=s*1.3;g.add(halo);
 g.userData.anim=t=>{fl.forEach((f,i)=>{const k=.8+.3*Math.sin(t*(7+i)+i*2);f.scale.set(s*(.18-i*.02),s*(.6+.25*Math.sin(t*5.3+i))*k,s*(.18-i*.02));f.position.y=s*1.02+f.scale.y*.5;f.rotation.y=t*(1+i*.3)});halo.material.opacity=.45+Math.sin(t*6.1)*.08;core.scale.y=s*.11*(1+Math.sin(t*9)*.1)};
 return g}
function fxF_nuo(){const g=new THREE.Group();g.userData.noSkin=1;const R=fxF_person({h:2,child:0,skin:'#e2c4ac',iris:'#6a6a5a',hair:'#3a3430',lip:'#a8665e'});const H=R.H,rH=R.rH;R.g.userData.noSkin=1;
 const suit=M('#d9dcd8',{roughness:.55}),pad=M('#8a9098',{roughness:.5,metalness:.3}),orange=M('#d8742a',{roughness:.5}),dark=M('#2e3236',{roughness:.6,metalness:.3});
 fxF_top(R,suit,{k:1.12});const vest=fxF_top(R,pad,{k:1.2});vest.scale.y=.55;vest.position.y=R.torL*.42;
 fxF_sleeves(R,suit,2,{k:1.12,cuff:pad});fxF_legwear(R,suit,{thigh:1,shin:1},{k:1.12});
 for(const l of R.legs){const kp=fxF_sph(H*.045,1,.8,1,pad,10);kp.position.x=H*.03;l.kn.add(kp);const bt=fxF_cyl(H*.042,H*.045,H*.09,dark,10);bt.position.y=-H*.03;l.an.add(bt);
  const ft=fxF_sph(H*.045,1.5,.6,.9,dark,12);ft.position.set(H*.03,-H*.065,0);l.an.add(ft);for(let i=0;i<3;i++){const cl=cone(H*.008,H*.03,M('#9aa0a6',{metalness:.8,roughness:.3}),4);cl.rotation.z=Math.PI;cl.position.set(H*(.0+i*.03),-H*.1,(i-1)*H*.015);l.an.add(cl)}}
 for(const h of R.hands){const gl=fxF_sph(H*.034,.8,1.2,.55,pad,10);gl.position.y=-H*.035;h.add(gl)}
 for(let i=0;i<3;i++){const st=fxF_box(H*.012,H*.02,H*.16,orange);st.position.set(R.shW*.9,R.torL*(.62-i*.06),0);st.rotation.y=0;R.spine.add(st)}
 const lamp=fxF_cyl(H*.012,H*.012,H*.006,EM('#7fd8ff',.9),10);lamp.rotation.z=Math.PI/2;lamp.position.set(R.shW*.98,R.torL*.78,-R.shW*.4);R.spine.add(lamp);
 // small thruster pack and battery
 const pack=fxF_box(H*.09,H*.2,H*.18,pad);pack.position.set(-R.shW*.85,R.torL*.6,0);R.spine.add(pack);for(const z of[-1,1]){const n=fxF_cyl(H*.025,H*.018,H*.05,dark,10);n.position.set(-R.shW*.9,R.torL*.43,z*H*.05);R.spine.add(n)}
 const bat=fxF_box(H*.04,H*.08,H*.06,orange);bat.position.set(-R.shW*1.15,R.torL*.68,0);R.spine.add(bat);
 // belt with the dagger it used on the claw
 const belt=fxF_cyl(R.hipW*1.2,R.hipW*1.2,H*.025,dark,18);belt.scale.z=.7;belt.position.y=R.torL*.05;R.spine.add(belt);
 const dg=new THREE.Group();dg.position.set(R.hipW*.3,R.torL*.03,R.hipW*.95);dg.rotation.x=.4;R.spine.add(dg);dg.add(fxF_box(H*.015,H*.08,H*.025,M('#4a3a2a')));const db=fxF_box(H*.006,H*.12,H*.02,M('#c8ccd0',{metalness:.9,roughness:.2}));db.position.y=-H*.1;dg.add(db);
 const collar=new THREE.Mesh(new THREE.TorusGeometry(H*.042,H*.009,8,18),pad);collar.rotation.x=Math.PI/2;collar.position.y=R.torL+H*.01;R.spine.add(collar);
 fxF_hairCap(R,M('#3a3430',{roughness:.7}),{fringe:5,spread:1.6,fLen:.6,side:.8});
 // sitting on the ground, knees up, arms on them, staring into the white flame
 const sitY=H*.08;R.spine.position.y=sitY;for(const l of R.legs){l.hp.position.y=sitY;l.hp.rotation.z=1.25;l.hp.rotation.x=l.z*.25;l.kn.rotation.z=-2.1}
 for(const a of R.arms){a.sh.rotation.z=.9;a.sh.rotation.x=-a.z*.15;a.el.rotation.z=.7}
 R.spine.rotation.z=.12;
 // the helmet, set down beside it
 const hm=new THREE.Group();hm.position.set(-H*.05,H*.11,H*.32);g.add(hm);hm.add(fxF_sph(H*.11,1,1,1,suit,20));const vis=fxF_sph(H*.1,.8,.75,.85,M('#2a3a4a',{metalness:.8,roughness:.08}),18);vis.position.x=H*.035;hm.add(vis);hm.rotation.z=-.4;hm.rotation.y=.6;
 const ring=new THREE.Mesh(new THREE.TorusGeometry(H*.07,H*.015,6,16),pad);ring.rotation.z=Math.PI/2;ring.position.x=-H*.08;hm.add(ring);
 g.add(R.g);R.g.position.set(-H*.2,0,0);
 const ht=fxF_hearth(.85);ht.position.set(H*.55,0,-H*.05);ht.rotation.y=.4;g.add(ht);
 // the pool of light it keeps; beyond it the ground goes to black
 const pool=new THREE.Mesh(new THREE.CircleGeometry(H*.95,40),new THREE.MeshBasicMaterial({map:glowTex,color:'#dfe8ff',transparent:true,opacity:.5,depthWrite:false,blending:THREE.AdditiveBlending}));pool.rotation.x=-Math.PI/2;pool.position.set(H*.55,.02,0);g.add(pool);
 fxF_idle(R,{look:.08,tilt:-.1,turn:.05,noArms:1,extra:t=>{R.spine.position.y=sitY;R.spine.rotation.z=.14+Math.sin(t*.4)*.02}});
 const a0=R.g.userData.anim;g.userData.anim=t=>{a0(t);ht.userData.anim(t)};return g}

/* ================= 罗沙莉 =================
   捕获者文明里的一个阿特兰，食物广场大庆祝的主办者：一手高举着圆筒，开开心心地召开宴会，
   对“不同的生物混在一起吃会出事”毫不在意；后来又站出来大声反对战争。 */
function fxF_rosalie(){const g=new THREE.Group();g.userData.noSkin=1;const R=fxF_person({h:1.9,child:0,skin:'#e8c9ae',iris:'#3a7a6a',hair:'#e8b860',female:1,lip:'#d05a6a',blush:1});const H=R.H,rH=R.rH;R.g.userData.noSkin=1;
 const dress=M('#d8447a',{roughness:.55}),dress2=M('#f4c040',{roughness:.5}),sash=M('#3a9ac8',{roughness:.5}),hairM=M('#e8b860',{roughness:.55});
 fxF_top(R,dress,{k:1.05});
 const sk1=fxF_skirt(R.hipW*1.1,R.hipW*2.4,H*.36,dress,9,.1);sk1.position.y=R.torL*.02;sk1.scale.z=.85;R.spine.add(sk1);
 const sk2=fxF_skirt(R.hipW*1.12,R.hipW*2.0,H*.2,dress2,9,.12);sk2.position.y=R.torL*.03;sk2.scale.z=.85;sk2.rotation.y=.35;R.spine.add(sk2);
 const sa=new THREE.Mesh(new THREE.TorusGeometry(R.hipW*1.12,H*.018,6,20),sash);sa.rotation.x=Math.PI/2;sa.scale.y=.8;sa.position.y=R.torL*.12;R.spine.add(sa);
 const bow=fxF_sph(H*.03,.6,1,1.4,sash,10);bow.position.set(-R.hipW*1.1,R.torL*.12,0);R.spine.add(bow);
 fxF_sleeves(R,dress2,.55,{k:1.25});
 for(const a of R.arms){const p=fxF_sph(H*.05,1,.8,1,dress2,12);p.position.y=-H*.02;a.ua.add(p)}
 for(let i=0;i<9;i++){const b=fxF_sph(H*.009,1,1,1,M(['#ffffff','#f4c040','#3a9ac8'][i%3],{roughness:.2,metalness:.3}),8);const a=(i/8-.5)*2.2;b.position.set(R.shW*.7*Math.cos(a),R.torL*.96-Math.cos(a)*H*.02,R.shW*.7*Math.sin(a)*.7);R.spine.add(b)}
 fxF_legwear(R,M('#f4e8e0'),{shin:.2});fxF_shoes(R,M('#c8344a',{roughness:.3}),{sole:M('#2a1a1a')});
 // big wavy hair with a flower
 fxF_hairCap(R,hairM,{fringe:6,spread:1.7,side:1.6,fLen:.9});
 for(let i=0;i<9;i++){const a=Math.PI*.6+i/8*Math.PI*.8;const c=fxF_chain(4,H*.06,H*.03,H*.012,hairM);c.root.position.set(R.cran.position.x+Math.cos(a)*rH*.85,rH*.9,Math.sin(a)*rH*.85);c.root.rotation.x=Math.sin(a)*.25;c.J.forEach((j,k)=>j.rotation.z=(k%2?.25:-.25));R.headG.add(c.root)}
 const fl=new THREE.Group();fl.position.set(rH*.2,rH*1.6,rH*.75);R.headG.add(fl);for(let i=0;i<5;i++){const p=fxF_sph(rH*.16,1,.4,1,M('#ff6a8a',{roughness:.4}),8);const a=i/5*6.28;p.position.set(Math.cos(a)*rH*.14,0,Math.sin(a)*rH*.14);fl.add(p)}fl.add(fxF_sph(rH*.08,1,1,1,M('#ffe060'),8));fl.rotation.x=-1.2;
 // the raised cylinder
 const ra=R.arms[1];const cup=new THREE.Group();ra.hd.add(cup);cup.position.y=-H*.05;const cy=fxF_cyl(H*.03,H*.026,H*.12,M('#c8d0d8',{metalness:.8,roughness:.25}),12);cup.add(cy);const lid=fxF_cyl(H*.032,H*.032,H*.012,M('#3a9ac8',{metalness:.4}),12);lid.position.y=H*.065;cup.add(lid);cup.add(at(glowSprite('#ffe8a0',H*.3,.4),0,H*.09,0));
 g.add(R.g);
 // a table of food from many kinds of creatures
 const tb=new THREE.Group();tb.position.set(H*.55,0,H*.55);g.add(tb);const top=fxF_cyl(H*.32,H*.32,H*.03,M('#e8dcc0',{roughness:.7}),24);top.position.y=H*.48;tb.add(top);const cl=fxF_cyl(H*.34,H*.34,H*.12,M('#c84a6a',{side:THREE.DoubleSide}),24,1);cl.position.y=H*.42;tb.add(cl);const leg=fxF_cyl(H*.03,H*.05,H*.46,M('#6a4a3a'),8);leg.position.y=H*.23;tb.add(leg);
 const foods=[['#e85a5a',.05],['#7ad85a',.04],['#5aa8e8',.06],['#c85ae8',.035],['#e8c05a',.05],['#a86a3a',.045],['#3ad8c8',.03]];foods.forEach((f,i)=>{const a=i/7*6.28+.3,r=H*(.1+(i%3)*.06);const pl=fxF_cyl(H*.06,H*.05,H*.008,M('#f8f8f8'),14);pl.position.set(Math.cos(a)*r,H*.5,Math.sin(a)*r);tb.add(pl);const fd=i%2?new THREE.Mesh(ko(H*f[1]),M(f[0],{flatShading:true})):fxF_sph(H*f[1],1,.7,1,M(f[0],{roughness:.4}),10);fd.position.set(Math.cos(a)*r,H*.52+H*f[1]*.4,Math.sin(a)*r);tb.add(fd)});
 const lan=[];for(let i=0;i<10;i++){const a=i/10*6.28;lan.push(V3(Math.cos(a)*H*1.2,H*1.35+Math.sin(i*1.7)*H*.1,Math.sin(a)*H*1.2))}g.add(sparkles(lan,'#ffd890',H*.25,1,.6));
 fxF_idle(R,{look:.4,noArms:1,extra:t=>{ra.sh.rotation.z=2.6+Math.sin(t*2.2)*.12;ra.sh.rotation.x=.25;ra.el.rotation.z=.35+Math.sin(t*2.2+.5)*.1;const la=R.arms[0];la.sh.rotation.z=.25+Math.sin(t*1.5)*.15;la.sh.rotation.x=-.35;la.el.rotation.z=.6;R.mouth.scale.y=R.rH*(.035+Math.max(0,Math.sin(t*6))*.03);
  R.spine.position.y=R.legL+Math.abs(Math.sin(t*2.2))*H*.006}});
 const a0=R.g.userData.anim;g.userData.anim=a0;return g}

/* ================= 莎琳 =================
   第一卷开头：金色短发、可爱的脸，像个小女孩的身影掠过海面，轻轻挥手，洒下一片水滴般的细胞，
   在其中一粒里加上自己的知识与意识。终卷里它是一直在旅行的“领队”。 */
function fxF_sarin(){const g=new THREE.Group();g.userData.noSkin=1;const R=fxF_person({h:1.42,child:1,skin:'#f6e2d2',iris:'#2a7ad8',hair:'#f2cf6a',brow:'#d8a848',female:1,blush:1,lip:'#e0848a'});const H=R.H,rH=R.rH;R.g.userData.noSkin=1;
 const white=M('#fbf8f0',{roughness:.6}),blue=M('#2a3c78',{roughness:.6}),gold=M('#e8c05a',{metalness:.7,roughness:.3}),hairM=M('#f2cf6a',{roughness:.45,metalness:.1});
 fxF_top(R,white,{k:1.04});fxF_sleeves(R,white,1.6,{k:1.05,cuff:blue});
 const dr=fxF_skirt(R.hipW*1.1,R.hipW*1.9,H*.17,white,10,.06);dr.position.y=-R.torL*.0;dr.scale.z=.8;R.spine.add(dr);const trim=fxF_cyl(R.hipW*1.95,R.hipW*1.95,H*.012,blue,24,1);trim.scale.z=.8;trim.position.y=-H*.17;R.spine.add(trim);
 // a short travelling cape with a gold clasp
 const cape=fxF_skirt(R.shW*.75,R.shW*1.55,H*.3,M('#2a3c78',{roughness:.6,side:THREE.DoubleSide}),7,.05,.55);cape.position.y=R.torL*1.0;cape.scale.z=.9;R.spine.add(cape);
 const cl=fxF_sph(H*.02,.4,1,1,gold,10);cl.position.set(R.shW*.55,R.torL*.97,0);R.spine.add(cl);
 fxF_legwear(R,M('#f4f0ea'),{shin:.6},{k:1.03});for(const l of R.legs){const b=fxF_cyl(H*.038,H*.035,H*.1,M('#7a4a2a',{roughness:.5}),10);b.position.y=-R.legL*.47+H*.05;l.sh.add(b)}fxF_shoes(R,M('#7a4a2a',{roughness:.45}),{sole:M('#3a2416')});
 const bag=fxF_sph(H*.05,.5,.9,1,M('#9a6a3a',{roughness:.6}),10);bag.position.set(0,R.torL*.05,-R.hipW*1.25);R.spine.add(bag);const strap=new THREE.Mesh(new THREE.TorusGeometry(R.shW*.95,H*.006,4,24),M('#7a4a2a'));strap.rotation.set(Math.PI/2,0,0);strap.rotation.order='ZXY';strap.rotation.z=.75;strap.position.y=R.torL*.5;strap.scale.set(.62,1,1);R.spine.add(strap);
 // golden bob
 fxF_hairCap(R,hairM,{fringe:9,spread:2.2,fLen:1,side:1.5,cov:.6});
 for(let i=0;i<9;i++){const a=Math.PI*.55+i/8*Math.PI*.9;const s=fxF_sph(rH,.22,.55,.2,hairM,10);s.position.set(R.cran.position.x+Math.cos(a)*rH*.82,rH*.55,Math.sin(a)*rH*.86);s.rotation.x=Math.sin(a)*.3;s.rotation.z=-Math.cos(a)*.2;R.headG.add(s)}
 const ah=fxF_chain(3,rH*.18,rH*.05,rH*.015,hairM);ah.root.position.set(rH*.1,rH*2.05,0);ah.root.rotation.z=Math.PI+.4;R.headG.add(ah.root);
 g.add(R.g);
 // hovering, one hand out, cells dripping from it like drops of water
 const ra=R.arms[1];
 const drops=[];const dm=new THREE.MeshStandardMaterial({color:'#bfeeff',emissive:'#6ad8ff',emissiveIntensity:.6,transparent:true,opacity:.75,roughness:.05});for(let i=0;i<14;i++){const d=fxF_sph(H*.014,1,1.3,1,dm.clone(),8);g.add(d);drops.push({d,ph:i/14,x:(h3(i,1,9)-.5)*H*.12,z:(h3(i,2,9)-.5)*H*.12})}
 const one=fxF_sph(H*.02,1,1,1,GL('#fff4c0'),10);g.add(one);const oneG=glowSprite('#ffe8a0',H*.2,.8);g.add(oneG);
 g.add(at(glowSprite('#fff2c8',H*1.6,.3),0,H*.75,0));
 const hv=H*.28;
 fxF_idle(R,{look:.3,tilt:.15,noArms:1,extra:t=>{R.g.position.y=hv+Math.sin(t*1.2)*H*.025;ra.sh.rotation.z=1.25+Math.sin(t*.9)*.12;ra.sh.rotation.x=.25;ra.el.rotation.z=.2;R.arms[0].sh.rotation.z=-.25;R.arms[0].sh.rotation.x=-.3;
  for(const l of R.legs){l.hp.rotation.z=l.z>0?.1:-.15;l.kn.rotation.z=l.z>0?-.5:-.2}
  R.g.updateMatrixWorld(true);const hp=V3();ra.hd.getWorldPosition(hp);g.worldToLocal(hp);
  for(const o of drops){const q=(t*.35+o.ph)%1;o.d.position.set(hp.x+o.x*q*3+H*.03,hp.y-q*H*.9,hp.z+o.z*q*3);o.d.material.opacity=.75*(1-q)}
  const q1=(t*.35)%1;one.position.set(hp.x+H*.03,hp.y-q1*H*.9,hp.z);oneG.position.copy(one.position);oneG.material.opacity=.8*(1-q1)}});
 g.userData.anim=R.g.userData.anim;return g}


/* ================= 勇者 · 第二代魔王 =================
   梦境里的莫斯：一米五上下、一身短毛、尖脑袋、前肢粗壮。当了恶魔的王之后背上长出翼龙般的双翅、
   头上长角；全身是厚实的装备，头盔里藏着激光；大剑其实是一种活物，里面住满了火蜂；
   手上戴着绒球给的结晶拳套，鲜红的绒球（第一代魔王）常待在它头顶。 */
function fxF_hero(){const g=new THREE.Group();const R=fxF_person({h:2.05,child:0,skin:'#7a4a3a',noHead:1});const H=R.H;
 const fur=M('#6a3e30',{roughness:.95}),iron=M('#2c2a2e',{metalness:.75,roughness:.35}),trim=M('#a8242a',{roughness:.4,metalness:.3}),bone=M('#e8dcc4',{roughness:.5}),mem=M('#7a1a1e',{roughness:.6,side:THREE.DoubleSide});
 R.body.material=fur;
 // armour: breastplate, spiked pauldrons, faulds, greaves
 const bp=fxF_top(R,iron,{k:1.12});bp.scale.y=.62;bp.position.y=R.torL*.36;const bt=fxF_top(R,trim,{k:1.14});bt.scale.y=.08;bt.position.y=R.torL*.34;
 const em=fxF_sph(H*.04,.3,1,1,EM('#ff6a20',.9),12);em.position.set(R.shW*.95,R.torL*.66,0);R.spine.add(em);
 for(const a of R.arms){const pd=fxF_sph(H*.06,1,.75,1.05,iron,14);pd.position.y=-H*.01;a.ua.add(pd);for(let i=0;i<3;i++){const sp=cone(H*.012,H*.06,bone,5);sp.position.set(-H*.01+i*H*.015,H*.045,a.z*H*.02);sp.rotation.x=a.z*.4;a.ua.add(sp)}
  const ub=fxF_cyl(H*.04,H*.035,H*.15,fur,10);ub.position.y=-H*.09;a.ua.add(ub);const br=fxF_cyl(H*.036,H*.03,H*.13,iron,10);br.position.y=-H*.075;a.fa.add(br);a.el.add(fxF_sph(H*.034,1,1,1,iron,10))}
 const fl=fxF_skirt(R.hipW*1.2,R.hipW*1.6,H*.14,iron,6,.05);fl.position.y=R.torL*.08;fl.scale.z=.8;R.spine.add(fl);
 fxF_legwear(R,fur,{thigh:1,shin:1},{k:1.1});for(const l of R.legs){const gv=fxF_cyl(H*.042,H*.034,R.legL*.36,iron,10);gv.position.y=-R.legL*.3;l.sh.add(gv);const kp=fxF_sph(H*.045,1.1,.8,1,iron,10);kp.position.x=H*.025;l.kn.add(kp);
  const ft=fxF_sph(H*.045,1.5,.6,.9,iron,12);ft.position.set(H*.03,-H*.015,0);l.an.add(ft);for(let i=0;i<3;i++){const c=cone(H*.01,H*.04,bone,4);c.rotation.z=-Math.PI/2;c.position.set(H*.1,-H*.02,(i-1)*H*.022);l.an.add(c)}}
 // the mosi head: long pointed snout, short fur, ears back, horns, eyes like coals
 const hd=R.headG;const cr=fxF_sph(H*.075,1.05,.95,.9,fur,18);cr.position.set(0,H*.07,0);hd.add(cr);cr.userData.fxHead=1;
 const sn=new THREE.Mesh(new THREE.ConeGeometry(H*.05,H*.16,12),fur);sn.rotation.z=-Math.PI/2;sn.position.set(H*.12,H*.05,0);sn.scale.z=.8;hd.add(sn);const nose=fxF_sph(H*.016,1,.8,1,M('#1a1010'),8);nose.position.set(H*.2,H*.05,0);hd.add(nose);
 const jw=fxF_sph(H*.05,1.4,.4,.7,fur,12);jw.position.set(H*.08,H*.015,0);hd.add(jw);
 for(const z of[-1,1]){const e=new THREE.Group();e.position.set(H*.075,H*.095,z*H*.04);hd.add(e);e.add(fxF_sph(H*.014,.6,.7,1,GL('#ffb040'),8));e.add(glowSprite('#ff8a20',H*.07,.7));R.eyes.push(e);
  const ea=fxF_sph(H*.03,.4,1.2,.5,fur,8);ea.position.set(-H*.04,H*.13,z*H*.05);ea.rotation.x=z*.6;ea.rotation.z=.6;hd.add(ea);
  const hn=tubeAlong([V3(0,0,0),V3(-H*.02,H*.06,z*H*.02),V3(-H*.08,H*.1,z*H*.04),V3(-H*.13,H*.09,z*H*.05)],H*.012,bone,10);hn.position.set(H*.01,H*.12,z*H*.035);hd.add(hn)}
 // helmet band with the hidden laser
 const hb=new THREE.Mesh(new THREE.TorusGeometry(H*.072,H*.012,6,20),iron);hb.rotation.x=Math.PI/2;hb.position.set(-H*.005,H*.11,0);hb.scale.y=.9;hd.add(hb);const lz=fxF_sph(H*.01,1,1,1,GL('#ff3020'),6);lz.position.set(H*.07,H*.115,0);hd.add(lz);
 // wings like a pterosaur's, folded half open behind it
 const wings=[];for(const z of[-1,1]){const wg=new THREE.Group();wg.position.set(-R.shW*.7,R.torL*.82,z*R.shW*.35);R.spine.add(wg);
  const bonePts=[V3(0,0,0),V3(-H*.18,H*.22,0),V3(-H*.5,H*.32,0),V3(-H*.85,H*.18,0)];wg.add(tubeAlong(bonePts,H*.014,bone,12));
  for(const k of[.3,.55,.8]){wg.add(tubeAlong([V3(-H*.5,H*.32,0),V3(-H*.5-H*.3*k,H*.05-H*.2*k,0)],H*.007,bone,4))}
  const sh=new THREE.Shape();sh.moveTo(0,0);sh.lineTo(-H*.18,H*.22);sh.lineTo(-H*.5,H*.32);sh.lineTo(-H*.85,H*.18);sh.quadraticCurveTo(-H*.62,H*.02,-H*.6,-H*.22);sh.quadraticCurveTo(-H*.42,-H*.08,-H*.3,-H*.3);sh.quadraticCurveTo(-H*.15,-H*.1,0,-H*.16);sh.lineTo(0,0);
  const m=new THREE.Mesh(new THREE.ShapeGeometry(sh,10),mem);wg.add(m);wings.push({wg,z})}
 // the living great-sword: dark blade with seams of fire, embers drifting off it
 const sw=new THREE.Group();const ra=R.arms[1];R.g.add(sw);sw.position.set(H*.34,H*.52,0);sw.rotation.z=Math.PI;
 const grip=fxF_cyl(H*.016,H*.016,H*.14,M('#3a2418'),8);sw.add(grip);const gd=fxF_box(H*.04,H*.03,H*.2,iron);gd.position.y=H*.08;sw.add(gd);
 const blade=fxF_box(H*.03,H*.9,H*.11,M('#3a3034',{metalness:.6,roughness:.4}));blade.position.y=H*.55;sw.add(blade);
 const seam=fxF_box(H*.032,H*.8,H*.02,EM('#ff7a20',1.2));seam.position.y=H*.55;sw.add(seam);for(let i=0;i<6;i++){const c=fxF_box(H*.033,H*.004,H*.08,EM('#ffb040',1));c.position.set(0,H*(.22+i*.12),0);c.rotation.x=(i%2?.4:-.4);sw.add(c)}
 const emb=emitter({n:40,life:1.4,speed:H*.25,spread:.6,size:H*.12,dir:[0,1,0],col:'#ffc060',col2:'#ff3010',op:.9,area:[H*.04,H*.8,H*.1]});emb.position.y=H*.55;sw.add(emb);sw.add(at(glowSprite('#ff6a20',H*.6,.35),0,H*.55,0));
 // crystal gauntlet on the other hand
 const la=R.arms[0];const gau=new THREE.Mesh(ko(H*.045),EM('#9ff2ff',.6,{roughness:.1,flatShading:true}));gau.scale.set(1,1.3,1);gau.position.y=-H*.04;la.hd.add(gau);la.hd.add(at(glowSprite('#9ff2ff',H*.18,.5),0,-H*.04,0));
 // the red fluff on its head
 const fz=new THREE.Group();fz.position.set(-H*.01,H*.17,0);hd.add(fz);const fm=M('#e8302a',{roughness:1});fz.add(fxF_sph(H*.045,1,.9,1,fm,14));for(let i=0;i<40;i++){const v=V3(h3(i,1,5)-.5,h3(i,2,5)-.3,h3(i,3,5)-.5).normalize();const c=cone(H*.008,H*.03,fm,4);c.position.copy(v).multiplyScalar(H*.042);c.quaternion.setFromUnitVectors(V3(0,1,0),v);fz.add(c)}
 for(const z of[-1,1]){const e=fxF_sph(H*.007,1,1,1,M('#101010'),6);e.position.set(H*.04,H*.01,z*H*.014);fz.add(e)}
 g.add(R.g);
 fxF_idle(R,{look:.35,noArms:1,extra:t=>{for(const a of R.arms){a.sh.rotation.z=.55+Math.sin(t*.9)*.03;a.sh.rotation.x=a.z*.45;a.el.rotation.z=.75;a.el.rotation.x=-a.z*.5}
  wings.forEach(w=>{w.wg.rotation.y=w.z*(1.0+Math.sin(t*1.1)*.15);w.wg.rotation.x=w.z*(.12+Math.sin(t*1.1)*.06)});fz.position.y=H*.16+Math.abs(Math.sin(t*2.3))*H*.02;
  seam.material.emissiveIntensity=1+Math.sin(t*5)*.3}});
 g.userData.anim=R.g.userData.anim;return g}

/* ================= 电视机里的小丑 =================
   房间尽头一台很老的电视机，翻来覆去放着一个戴小丑面具、穿小丑服的影像，喊着要改变命运。
   电视本身才是小丑的本体：外壳里塞满精密的智能机械，是那座空间站系统掉下来的一小块。 */
function fxF_clownFace(x,w,h,t){x.fillStyle='#101418';x.fillRect(0,0,w,h);const j=Math.sin(t*3)*2;x.save();x.translate(w/2+j,h/2+2);
 x.fillStyle='#f4f0e8';x.beginPath();x.ellipse(0,0,w*.27,h*.4,0,0,6.3);x.fill();
 x.fillStyle='#1a1a2a';for(const s of[-1,1]){x.beginPath();x.moveTo(s*w*.11,-h*.22);x.lineTo(s*w*.15,-h*.1);x.lineTo(s*w*.11,h*.0);x.lineTo(s*w*.07,-h*.1);x.fill()}
 x.fillStyle='#e8202a';x.beginPath();x.arc(0,h*.05,w*.045,0,6.3);x.fill();
 const o=.5+.5*Math.sin(t*6);x.strokeStyle='#c8102a';x.lineWidth=5;x.beginPath();x.arc(0,h*.1,w*.15,.25,Math.PI-.25);x.stroke();x.fillStyle='#600';x.beginPath();x.ellipse(0,h*.22,w*.08,h*.03+o*h*.05,0,0,6.3);x.fill();
 x.fillStyle='#e8202a';x.beginPath();x.arc(-w*.24,-h*.32,w*.07,0,6.3);x.arc(w*.24,-h*.32,w*.07,0,6.3);x.fill();x.restore();
 x.fillStyle='rgba(255,255,255,.06)';for(let y=0;y<h;y+=3)x.fillRect(0,y,w,1);x.fillStyle='rgba(180,220,255,.12)';x.fillRect(0,((t*40)%h),w,6)}
function fxF_clown(){const g=new THREE.Group();const wood=M('#6a4a30',{roughness:.55}),dark=M('#2a2420',{roughness:.6}),metal=M('#9a9a92',{metalness:.7,roughness:.35});
 // the set on a low cabinet
 const cab=fxF_box(1.9,.7,1.2,M('#4a3426',{roughness:.7}));cab.position.y=.35;g.add(cab);for(const z of[-1,1]){const d=fxF_box(.02,.5,.5,M('#3a281c'));d.position.set(.96,.35,z*.28);g.add(d);const k=fxF_sph(.03,1,1,1,metal,8);k.position.set(.98,.38,z*.08);g.add(k)}
 const tv=new THREE.Group();tv.position.y=.7;g.add(tv);const box=fxF_box(1.4,1.15,1.5,wood);box.position.y=.6;tv.add(box);const back=fxF_cyl(.5,.35,.5,dark,4);back.rotation.z=Math.PI/2;back.rotation.x=Math.PI/4;back.position.set(-.95,.6,0);tv.add(back);
 {const bm=M('#1c1814',{roughness:.4});for(const [y,z,h,w] of [[1.12,-.18,.06,1.06],[.12,-.18,.06,1.06],[.62,.33,1.06,.06],[.62,-.69,1.06,.06]]){const b=fxF_box(.06,h,w,bm);b.position.set(.71,y,z);tv.add(b)}}
 const cv=document.createElement('canvas');cv.width=128;cv.height=96;const cx=cv.getContext('2d');fxF_clownFace(cx,128,96,0);const tex=new THREE.CanvasTexture(cv);
 const sg=new THREE.SphereGeometry(1,24,16,-Math.PI*.22,Math.PI*.44,Math.PI*.3,Math.PI*.4);const scr=new THREE.Mesh(sg,new THREE.MeshBasicMaterial({map:tex}));
 // sphere patch facing +x: map it to the screen rectangle
 {const P=sg.attributes.position,U=sg.attributes.uv;for(let i=0;i<P.count;i++){const z=P.getZ(i),y=P.getY(i);U.setXY(i,.5+z/(2*Math.sin(Math.PI*.22)),.5+y/(2*Math.cos(Math.PI*.3)))}U.needsUpdate=true}
 scr.scale.set(.22,.85,.78);scr.rotation.y=Math.PI;scr.position.set(.5,.62,-.18);tv.add(scr);
 tv.add(at(glowSprite('#bfe0ff',1.4,.3),.9,.62,-.18));
 for(let i=0;i<2;i++){const k=fxF_cyl(.06,.06,.05,metal,12);k.rotation.z=Math.PI/2;k.position.set(.72,.85-i*.25,.5);tv.add(k)}const sp=fxF_box(.02,.3,.18,M('#3a2a20'));sp.position.set(.72,.3,.5);tv.add(sp);for(let i=0;i<5;i++){const l=fxF_box(.025,.01,.16,dark);l.position.set(.73,.2+i*.05,.5);tv.add(l)}
 for(const z of[-1,1]){const an=fxF_cyl(.012,.012,1.1,metal,5);an.position.set(-.1,1.65,z*.3);an.rotation.x=z*.5;tv.add(an);const tip=fxF_sph(.03,1,1,1,metal,6);tip.position.set(-.1,2.14,z*.56);tv.add(tip)}tv.add(at(fxF_sph(.08,1.4,.6,1.4,dark,10),-.1,1.2,0));
 // the machine inside shows through the vents at the back
 for(let i=0;i<4;i++){const v=fxF_box(.02,.04,.8,dark);v.position.set(-.71,.35+i*.12,0);tv.add(v)}const led=fxF_sph(.025,1,1,1,GL('#ff3030'),6);led.position.set(-.72,.95,.5);tv.add(led);
 // cables trailing to the floor
 tv.add(tubeAlong([V3(-.7,.3,.3),V3(-1.2,.1,.6),V3(-1.4,-.5,.4),V3(-1.8,-.68,.9)],.025,dark,12));
 // its projection standing in front of the set: clown suit, ruff, mask, pointed cap
 const R=fxF_person({h:1.9,noHead:1,skin:'#f4f0e8'});const H=R.H;
 const harl=new THREE.MeshStandardMaterial({map:fxF_tex(64,64,(x,w,h)=>{for(let i=0;i<4;i++)for(let j=0;j<4;j++){x.fillStyle=(i+j)%2?'#d8283a':'#2a2a3a';x.beginPath();x.moveTo(i*16+8,j*16);x.lineTo(i*16+16,j*16+8);x.lineTo(i*16+8,j*16+16);x.lineTo(i*16,j*16+8);x.fill()}x.globalCompositeOperation='destination-over';x.fillStyle='#e8c040';x.fillRect(0,0,w,h)}),roughness:.6});
 fxF_top(R,harl,{k:1.12});const pants=fxF_skirt(R.hipW*1.2,R.hipW*1.7,H*.12,harl,6,.06);pants.position.y=R.torL*.02;R.spine.add(pants);fxF_legwear(R,harl,{thigh:1,shin:1},{k:1.15});fxF_sleeves(R,harl,2,{k:1.2});
 for(const l of R.legs){const sh=fxF_sph(H*.045,1.9,.6,.9,M('#d8283a'),12);sh.position.set(H*.05,-H*.01,0);l.an.add(sh);const pm=fxF_sph(H*.02,1,1,1,M('#f4f0e8'),8);pm.position.set(H*.13,H*.02,0);l.an.add(pm)}
 const ruff=new THREE.Mesh(new THREE.TorusGeometry(H*.07,H*.03,8,22),M('#f4f4f0'));ruff.rotation.x=Math.PI/2;ruff.position.y=R.torL+H*.01;ruff.scale.z=1.4;R.spine.add(ruff);
 for(let i=0;i<3;i++){const b=fxF_sph(H*.018,1,1,1,M('#f4f4f0'),8);b.position.set(R.shW*.9,R.torL*(.7-i*.18),0);R.spine.add(b)}
 const mt=new THREE.MeshStandardMaterial({map:fxF_tex(128,64,(x,w,h)=>{x.fillStyle='#f4f0e8';x.fillRect(0,0,w,h);x.fillStyle='#1a1a2a';for(const s of[-1,1]){const cx=w*.5+s*w*.09;x.beginPath();x.moveTo(cx,h*.18);x.lineTo(cx+w*.035,h*.38);x.lineTo(cx,h*.52);x.lineTo(cx-w*.035,h*.38);x.fill()}
  x.strokeStyle='#c8102a';x.lineWidth=4;x.beginPath();x.arc(w*.5,h*.5,w*.1,.3,Math.PI-.3);x.stroke();x.fillStyle='#e8202a';x.beginPath();x.arc(w*.5,h*.52,w*.02,0,6.3);x.fill()}),roughness:.35});
 const mask=new THREE.Mesh(new THREE.SphereGeometry(H*.07,24,16),mt);mask.scale.set(1,1.22,.95);mask.rotation.y=Math.PI;mask.position.set(0,H*.075,0);R.headG.add(mask);
 const nose=fxF_sph(H*.016,1,1,1,M('#e8202a',{roughness:.3}),10);nose.position.set(H*.072,H*.072,0);R.headG.add(nose);
 const cap=new THREE.Mesh(new THREE.ConeGeometry(H*.07,H*.18,14),harl);cap.position.set(-H*.02,H*.23,0);cap.rotation.z=.5;R.headG.add(cap);const pom=fxF_sph(H*.02,1,1,1,M('#e8c040'),8);pom.position.set(-H*.065,H*.3,0);R.headG.add(pom);
 // turn it into light: see-through and flickering
 const holo=[];R.g.traverse(c=>{if(c.isMesh&&c.material!==shadowMat){const m0=c.material;const m=new THREE.MeshBasicMaterial({color:m0.color?m0.color.clone().lerp(C('#9fd8ff'),.3):C('#bfe8ff'),map:m0.map||null,transparent:true,opacity:.6,depthWrite:false});c.material=m;holo.push(m)}});
 R.g.traverse(c=>{if(c.material===shadowMat)c.visible=false});
 R.g.position.set(1.9,0,.8);R.g.rotation.y=-.35;g.add(R.g);const beam=new THREE.Mesh(new THREE.ConeGeometry(.55,1.1,16,1,true),new THREE.MeshBasicMaterial({color:'#bfe8ff',transparent:true,opacity:.12,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide}));beam.rotation.z=Math.PI/2;beam.position.set(1.35,1.25,.5);beam.rotation.y=-.35;g.add(beam);
 const ring=new THREE.Mesh(new THREE.RingGeometry(.35,.42,32),GL('#bfe8ff',.5));ring.rotation.x=-Math.PI/2;ring.position.set(1.9,.03,.8);g.add(ring);
 g.userData.noSkin=1;
 const ra=R.arms[1],la=R.arms[0];let last=-1;
 fxF_idle(R,{look:.5,noArms:1,extra:t=>{const f=Math.floor(t*8);if(f!==last){last=f;fxF_clownFace(cx,128,96,t);tex.needsUpdate=true}
  ra.sh.rotation.z=1.9+Math.sin(t*2.4)*.35;ra.sh.rotation.x=.4;ra.el.rotation.z=.3;la.sh.rotation.z=.3+Math.sin(t*2.4+1)*.2;la.sh.rotation.x=-.5;la.el.rotation.z=1.2;R.spine.rotation.x=Math.sin(t*1.2)*.06;
  const fk=.68+.12*Math.sin(t*17)+(Math.sin(t*3.1)>.97?-.35:0);for(const m of holo)m.opacity=fk;led.visible=Math.sin(t*4)>0||Math.sin(t*.3)<0}});
 g.userData.anim=R.g.userData.anim;return g}

/* ================= 阿布 =================
   本体像一块布的希望空间生物，别的成员叫它“全知者”。在抛弃之地被拆散了，
   琳找回一颗还睁着眼的尔什民模样的头和左右两只手，装起来以后它就成了用双手跑来跑去的“腿头”；
   琳的发信器就藏在它的头发里。 */
function fxF_abu(){const g=new THREE.Group();const R=fxF_person({h:4.6,child:.2,skin:'#e6c8ae',iris:'#6a8a4a',hair:'#4a3a2c',lip:'#b4706a',browTilt:-.1});const hd=R.headG;R.spine.remove(hd);
 const hairM=M('#4a3a2c',{roughness:.75});
 const head=new THREE.Group();head.add(hd);hd.position.set(0,0,0);g.add(head);const rH=R.rH;
 fxF_hairCap(R,hairM,{fringe:7,spread:2,fLen:.9,side:1.2});
 for(let i=0;i<8;i++){const t=fxF_sph(rH,.14,.4,.14,hairM,8);const a=i*.8;t.position.set(-rH*.2+Math.cos(a)*rH*.55,rH*1.9,Math.sin(a)*rH*.55);t.rotation.set(Math.sin(a)*.9,0,Math.cos(a)*.9);hd.add(t)}
 const tx=fxF_sph(rH*.06,1,1,1,GL('#ff4040'),6);tx.position.set(-rH*.4,rH*1.95,rH*.3);hd.add(tx);const txg=glowSprite('#ff5050',rH*.4,.8);txg.position.copy(tx.position);hd.add(txg);
 // under the jaw its true body shows: a soft woven cloth, wrapped round the neck and trailing behind
 const clothT=fxF_tex(64,64,(x,w,h)=>{x.fillStyle='#cdbb92';x.fillRect(0,0,w,h);x.strokeStyle='#a8946a';x.lineWidth=1;for(let i=0;i<w;i+=4){x.beginPath();x.moveTo(i,0);x.lineTo(i,h);x.stroke();x.beginPath();x.moveTo(0,i);x.lineTo(w,i);x.stroke()}x.fillStyle='#7a5a8a';for(let i=0;i<4;i++)x.fillRect(0,8+i*16,w,3)});
 const clothM=new THREE.MeshStandardMaterial({map:clothT,roughness:.9,side:THREE.DoubleSide});
 const wrap=fxF_cyl(rH*.55,rH*.75,rH*.45,clothM,18,1);wrap.position.y=rH*.05;hd.add(wrap);
 const cg=new THREE.PlaneGeometry(rH*1.6,rH*1.4,10,6);const cloth=new THREE.Mesh(cg,clothM);cloth.position.set(-rH*.95,rH*.2,0);cloth.rotation.y=Math.PI/2;cloth.rotation.x=0;hd.add(cloth);const cP=cg.attributes.position.array.slice();
 // the two hands it walks on
 const hands=[];const sk=R.sk;const q=rH*1.6;for(const z of[-1,1]){const w=new THREE.Group();w.position.set(0,rH*.1,z*rH*.48);head.add(w);
  const fa=fxF_cyl(q*.2,q*.17,q*.4,sk,10);fa.position.y=-q*.2;w.add(fa);const cuff=fxF_cyl(q*.22,q*.22,q*.12,clothM,12,1);cuff.position.y=-q*.04;w.add(cuff);
  const palm=new THREE.Group();palm.position.y=-q*.45;w.add(palm);palm.add(fxF_sph(q*.24,1.1,.5,.9,sk,12));
  for(let f=0;f<4;f++){const fz=(f-1.5)*q*.12;const fg=fxF_chain(2,q*.16,q*.05,q*.042,sk);fg.root.position.set(q*.18,-q*.04,fz);fg.root.rotation.z=.9;fg.J[1].rotation.z=.4;palm.add(fg.root)}
  const th=fxF_chain(2,q*.13,q*.055,q*.045,sk);th.root.position.set(q*.08,0,-z*q*.2);th.root.rotation.set(-z*1.3,0,1.0);palm.add(th.root);
  hands.push({w,palm,z})}
 const hy=rH*1.6*.62;head.position.y=hy;
 g.add(shadow(rH*1.3));g.userData.noSkin=1;
 g.userData.anim=t=>{const s=t*3.2;hands.forEach((h,i)=>{const p=s+i*Math.PI;h.w.rotation.z=Math.sin(p)*.35;h.palm.position.y=-rH*1.6*.45+Math.max(0,Math.sin(p+1.57))*rH*.12;h.palm.rotation.z=-Math.sin(p)*.35});
  head.position.y=hy+Math.abs(Math.cos(s))*rH*.06;head.rotation.z=Math.sin(s*2)*.03;hd.rotation.y=Math.sin(t*.5)*.4;hd.rotation.x=Math.sin(t*.37)*.08;
  const bl=(t*.27)%1;const e=bl<.04?.1:1;for(const x of R.eyes)x.scale.y=e+Math.sin(t*.2)*.002;txg.material.opacity=Math.sin(t*5)>0?.9:.1;
  const P=cg.attributes.position;for(let i=0;i<P.count;i++){const x=cP[i*3],y=cP[i*3+1];const k=(x/(rH*1.6)+.5);P.setZ(i,Math.sin(t*2.5+x*3/rH)*rH*.12*k+k*k*rH*.35)}P.needsUpdate=true};
 return g}

/* ---------- dragon-folk ----------
   骸龙：两米长的瘦爬行类，灰得像骸骨，身上一道道像骨架的斑纹；头相对身体很大，前后肢几乎一样长，善于抓握。
   翡翠龙：骸龙的分支，一米八高，圆脸，绿鳞在阳光下闪亮。白骸龙：通身雪白、体型消瘦，在黑暗里双眼会发微光。
   o: {skin, stripe, belly, eye, glow, round, lean, build, old, young, shine} */
const fxF_TX={};
function fxF_stripeMat(key,base,stripe,belly,n,o){o=o||{};const k=key+base+stripe+n;if(!fxF_TX[k]){fxF_TX[k]=fxF_tex(128,128,(x,w,h)=>{x.fillStyle=base;x.fillRect(0,0,w,h);
  if(belly){const gr=x.createLinearGradient(w*.3,0,w*.7,0);gr.addColorStop(0,base);gr.addColorStop(.5,belly);gr.addColorStop(1,base);x.fillStyle=gr;x.fillRect(w*.3,0,w*.4,h)}
  if(stripe){x.fillStyle=stripe;for(let i=0;i<n;i++){const y=(i+.5)/n*h;const th=h/n*.32;for(const side of[0,1]){x.beginPath();const x0=side?w*.6:0,x1=side?w:w*.4;x.moveTo(x0,y-th*.5);x.quadraticCurveTo((x0+x1)/2,y-th*1.2,x1,y-th*.2);x.lineTo(x1,y+th*.4);x.quadraticCurveTo((x0+x1)/2,y+th*.2,x0,y+th*.5);x.fill()}}}
  for(let i=0;i<600;i++){x.fillStyle='rgba('+(o.spec?'255,255,255,':'0,0,0,')+(.05+Math.random()*.08)+')';x.fillRect(Math.random()*w,Math.random()*h,2,2)}})}
 return new THREE.MeshStandardMaterial({map:fxF_TX[k],roughness:o.rough===undefined?.6:o.rough,metalness:o.metal||0})}
function fxF_drake(o){o=Object.assign({skin:'#9a958a',stripe:'#5e5a54',belly:'#c8c2b4',eye:'#d8a020',build:1,lean:.45},o);const g=new THREE.Group();const b=o.build;
 const D={g,o};const sh={rough:o.shine?.32:.62,metal:o.shine?.3:0,spec:o.shine};
 const skin=M(o.skin,{roughness:sh.rough,metalness:sh.metal});const bodyM=fxF_stripeMat('b',o.skin,o.stripe,o.belly,7,sh),limbM=fxF_stripeMat('l',o.skin,o.stripe,null,4,sh),tailM=fxF_stripeMat('t',o.skin,o.stripe,null,2,sh);
 D.skin=skin;D.bodyM=bodyM;
 const hipY=1.0;const hip=new THREE.Group();hip.position.y=hipY;g.add(hip);D.hip=hip;
 hip.add(fxF_sph(.3,1,.95,.9*b,bodyM,18));
 const tor=new THREE.Group();tor.rotation.z=-o.lean;hip.add(tor);D.tor=tor;
 const chest=fxF_lathe([[.04,-.14],[.25,-.06],[.3,.12],[.31,.38],[.32*(o.chestK||1),.62],[.3*(o.chestK||1),.8],[.22,.95],[.12,1.04],[.02,1.07]].map(q=>[q[0]*b,q[1]]),bodyM,.9,20);tor.add(chest);D.chest=chest;
 const bellyP=fxF_lathe([[.03,-.1],[.22,0],[.26,.3],[.27,.6],[.2,.85],[.02,.95]].map(q=>[q[0]*b,q[1]]),M(o.belly,{roughness:sh.rough}),.75,14);bellyP.position.x=.07*b;tor.add(bellyP);
 // a low ridge of scales down the back
 for(let i=0;i<7;i++){const c=cone(.035,.09,skin,4);c.position.set(-.29*b+i*.0,.2+i*.12,0);c.position.x=-(.3-.0)*b*Math.cos((i-3)*.2);c.rotation.z=.9;tor.add(c)}
 // neck and head
 const nk=new THREE.Group();nk.position.set(.06,.92,0);nk.rotation.z=o.lean+.15;tor.add(nk);D.neck=nk;
 const neck=fxF_cyl(.11*b,.15*b,.42,skin,12);neck.position.y=.18;nk.add(neck);
 const hd=new THREE.Group();hd.position.y=.4;hd.rotation.z=-.15;nk.add(hd);D.head=hd;const hk=o.young?1.25:1;hd.scale.setScalar(hk);
 const rd=o.round;
 const cran=fxF_sph(.2,rd?1.08:1.12,rd?1:.86,rd?1.02:.9,skin,20);cran.position.set(.04,.08,0);hd.add(cran);cran.userData.fxHead=1;
 const snout=fxF_sph(.2,rd?.62:1.05,rd?.48:.5,rd?.62:.58,skin,16);snout.position.set(rd?.19:.26,.03,0);hd.add(snout);
 const jaw=new THREE.Group();jaw.position.set(.06,-.02,0);hd.add(jaw);D.jaw=jaw;const lj=fxF_sph(.2,rd?.62:1.0,.22,rd?.55:.5,M(o.belly,{roughness:sh.rough}),14);lj.position.set(rd?.11:.17,-.035,0);jaw.add(lj);
 const mouthIn=fxF_sph(.2,rd?.55:.9,.12,rd?.5:.45,M('#7a2a2a'),10);mouthIn.position.set(rd?.11:.17,-.01,0);jaw.add(mouthIn);
 for(const z of[-1,1])for(let i=0;i<4;i++){const tt=cone(.008,.026,M('#f4f0e0',{roughness:.3,emissive:'#403c30',emissiveIntensity:.3}),4);tt.rotation.z=Math.PI;const k=i/3;tt.position.set((rd?.1:.16)+k*(rd?.1:.2),-.005,z*(rd?.075:.07)*(1-k*.35));hd.add(tt)}
 for(const z of[-1,1]){const ns=fxF_sph(.008,1.4,.6,1,M('#2a2420',{emissive:'#000000',emissiveIntensity:.3}),6);ns.position.set(rd?.29:.43,rd?.085:.085,z*.03);hd.add(ns)}
 const lip=new THREE.Mesh(new THREE.TorusGeometry(rd?.11:.17,.006,4,20,Math.PI*.9),M('#3a2a24'));lip.rotation.x=Math.PI/2;lip.rotation.z=-Math.PI*.45;lip.scale.set(rd?.9:1.05,rd?.85:.5,1);lip.position.set(rd?.1:.12,-.01,0);hd.add(lip);
 D.eyes=[];const ex=rd?.17:.16,ey=rd?.13:.12,ez=rd?.12:.11;for(const z of[-1,1]){const e=new THREE.Group();e.position.set(ex,ey,z*ez);hd.add(e);
  const ball=fxF_sph(.05,1,1,.8,o.glow?GL(o.eye):M(o.eye,{roughness:.15,emissive:o.eye,emissiveIntensity:.35}),12);e.add(ball);
  const pu=fxF_box(.012,.07,.016,M('#0a0806',{roughness:.1,emissive:'#000000',emissiveIntensity:.3}));pu.position.set(.04,0,z*.008);pu.rotation.y=z*.6;e.add(pu);const hl=fxF_sph(.008,1,1,1,GL('#ffffff'),6);hl.position.set(.04,.015,z*.0);e.add(hl);
  if(o.glow){const gs=glowSprite(o.eye,.18,.55);e.add(gs)}
  const lid=fxF_sph(.058,1,.45,.85,skin,10);lid.position.set(-.008,.04,0);e.add(lid);D.eyes.push(e);
  const brow=fxF_sph(.06,1.1,.35,.6,skin,10);brow.position.set(ex-.01,ey+.045,z*(ez+.005));brow.rotation.x=z*.3;hd.add(brow)}
 if(!rd)for(let i=0;i<3;i++){const k=cone(.025,.08,skin,4);k.position.set(-.06-i*.06,.2-i*.02,0);k.rotation.z=1.1;hd.add(k)}
 else for(const z of[-1,1]){const fr=fxF_sph(.07,.5,1,.4,skin,8);fr.position.set(-.08,.08,z*.17);fr.rotation.x=z*.5;hd.add(fr)}
 // arms nearly as long as the legs, with grasping hands
 D.arms=[];for(const z of[-1,1]){const s=new THREE.Group();s.position.set(.05,.78,z*.27*b);tor.add(s);const ua=fxF_hang(.36,.075*b,.06*b,limbM);s.add(ua);const el=new THREE.Group();el.position.y=-.36;ua.add(el);const fa=fxF_hang(.33,.06*b,.045*b,limbM);el.add(fa);
  const hand=new THREE.Group();hand.position.y=-.33;fa.add(hand);hand.add(fxF_sph(.055,1,1,.6,skin,10));
  for(let f=0;f<3;f++){const fg=fxF_chain(2,.05,.016,.012,skin);fg.root.position.set(.02,-.04,(f-1)*.025);fg.root.rotation.z=.3;fg.J[1].rotation.z=.6;const cl=cone(.012,.04,M('#2a2622',{roughness:.3}),4);cl.position.y=-.05;cl.rotation.z=.0;fg.J[1].add(cl);cl.position.y=-.06;hand.add(fg.root)}
  const th=fxF_chain(2,.04,.016,.012,skin);th.root.position.set(.03,-.02,-z*.04);th.root.rotation.set(-z*.8,0,.6);hand.add(th.root);
  s.rotation.x=z*.08;D.arms.push({s,ua,el,fa,hand,z})}
 // digitigrade legs
 D.legs=[];for(const z of[-1,1]){const hp=new THREE.Group();hp.position.set(-.02,0,z*.2*b);hip.add(hp);const th=fxF_hang(.46,.12*b,.08*b,limbM);hp.add(th);const kn=new THREE.Group();kn.position.y=-.46;th.add(kn);const sn=fxF_hang(.42,.075*b,.05,limbM);kn.add(sn);
  const an=new THREE.Group();an.position.y=-.42;sn.add(an);const mt=fxF_hang(.25,.05,.04,skin);an.add(mt);const ft=new THREE.Group();ft.position.y=-.25;mt.add(ft);
  for(let f=0;f<3;f++){const tg=fxF_chain(2,.07,.03,.02,skin);tg.root.position.set(0,0,(f-1)*.045);tg.root.rotation.set((f-1)*.3,0,0);ft.add(tg.root);const cl=cone(.016,.05,M('#2a2622',{roughness:.3}),4);cl.position.y=-.07;cl.rotation.z=Math.PI;tg.J[1].add(cl);D.toes=(D.toes||[]).concat([tg])}
  hp.rotation.z=.5;kn.rotation.z=-1.1;an.rotation.z=.9;ft.rotation.z=1.6-.3;D.legs.push({hp,kn,an,ft,z})}
 for(const tgc of D.toes){tgc.J[1].rotation.z=-.2}
 // tail
 const tl=fxF_chain(9,.2,.13*b,.02,tailM);tl.root.position.set(-.22,-.02,0);tl.root.rotation.z=-1.25;hip.add(tl.root);D.tail=tl.J;tl.J.forEach((j,i)=>{if(i)j.rotation.z=.04});
 g.add(shadow(.75));
 return D}
function fxF_drakeIdle(D,o){o=o||{};const g=D.g;const ph=o.ph||0;
 g.userData.anim=t=>{t+=ph;const br=Math.sin(t*1.6);D.chest.scale.set(1+br*.015,1,1+br*.015);D.tor.rotation.z=-D.o.lean+Math.sin(t*.6)*.02;
  D.head.rotation.y=Math.sin(t*.4)*.3*(o.look===undefined?1:o.look);D.head.rotation.x=Math.sin(t*.55)*.08+(o.tilt||0);D.head.rotation.z=-.15+Math.sin(t*.7)*.05+(o.nod||0);D.jaw.rotation.z=-Math.max(0,Math.sin(t*.9))*.12*(o.talk||.3);
  const bl=(t*.27+ph)%1;const s=bl<.04?.15:1;for(const e of D.eyes)e.scale.y=s+Math.sin(t*.2)*.002;
  D.tail.forEach((j,i)=>{j.rotation.x=Math.sin(t*1.2-i*.5)*.07;if(i)j.rotation.z=.04+Math.sin(t*.8-i*.4)*.02});
  if(!o.noArms)D.arms.forEach((a,i)=>{a.s.rotation.z=.35+Math.sin(t*1.1+i)*.05;a.el.rotation.z=.9});
  if(o.extra)o.extra(t)};return g}
// a fluffball figure, the way the dragon-folk carve their 赐予者
function fxF_fluffIdol(r,col){const g=new THREE.Group();const m=M(col||'#f4f0e6',{roughness:1});g.add(fxF_sph(r,1,.92,1,m,14));for(let i=0;i<26;i++){const v=V3(h3(i,4,1)-.5,h3(i,5,1)-.35,h3(i,6,1)-.5).normalize();const c=cone(r*.16,r*.45,m,4);c.position.copy(v).multiplyScalar(r*.9);c.quaternion.setFromUnitVectors(V3(0,1,0),v);g.add(c)}return g}

/* 苏苏米：跟着琳长大的翡翠龙，成年后比一般翡翠龙强壮得多，当上了“王”；它不爱摆满装饰品，
   宫里的贵民才穿角龙皮。它举起过结晶长矛，也是它把弓箭带给了翡翠龙。 */
function fxF_susumi(){const D=fxF_drake({skin:'#2f9a5c',stripe:null,belly:'#a8d878',eye:'#f2c23a',round:1,build:1.18,lean:.38,shine:1});const g=D.g;
 const hide=M('#b8945a',{roughness:.85,side:THREE.DoubleSide}),spot=M('#6a4a2a',{roughness:.9}),wood=M('#6a4a2a',{roughness:.7}),cord=M('#3a2a1a');
 // a plain hide mantle over the shoulders, knotted at the chest
 const man=fxF_skirt(.22,.44,.5,hide,6,.08,.45);man.position.set(-.02,1.06,0);man.rotation.z=.25;man.scale.z=1.05;D.tor.add(man);
 for(let i=0;i<6;i++){const sp=fxF_sph(.04,1,.3,1,spot,6);const a=Math.PI*.7+i*.35;sp.position.set(Math.cos(a)*.38,.75-i%2*.12,Math.sin(a)*.38);D.tor.add(sp)}
 D.tor.add(at(fxF_sph(.05,1,1,1,M('#e8d8b0'),8),.33,.95,0));
 // crystal spear, planted beside it
 const sp=new THREE.Group();sp.position.set(.55,0,-.42);g.add(sp);sp.add(at(fxF_cyl(.025,.03,2.4,wood,6),0,1.2,0));
 const tip=new THREE.Mesh(ko(.11),EM('#a8f4ff',.6,{roughness:.05,flatShading:true}));tip.scale.set(.6,2,.6);tip.position.y=2.55;sp.add(tip);sp.add(at(glowSprite('#bff4ff',.7,.45),0,2.55,0));
 for(let i=0;i<3;i++){const w=new THREE.Mesh(new THREE.TorusGeometry(.032,.008,4,10),cord);w.rotation.x=Math.PI/2;w.position.y=2.32+i*.04;sp.add(w)}
 // the bow and a quiver on its back
 const bow=tubeAlong([V3(0,-.6,0),V3(-.12,-.3,0),V3(-.15,0,0),V3(-.12,.3,0),V3(0,.6,0)],.018,wood,14);const bg=new THREE.Group();bg.add(bow);bg.add(tubeAlong([V3(0,-.6,0),V3(0,.6,0)],.004,M('#e8e0c8'),2));bg.position.set(-.36,.6,.0);bg.rotation.set(0,Math.PI/2,.5);D.tor.add(bg);
 const qv=fxF_cyl(.06,.05,.45,M('#7a5a3a'),8);qv.position.set(-.33,.62,.12);qv.rotation.x=-.5;D.tor.add(qv);for(let i=0;i<3;i++){const a=fxF_cyl(.006,.006,.2,wood,4);a.position.set(-.33,.86,.18+i*.02);a.rotation.x=-.5;D.tor.add(a);const f=fxF_box(.01,.05,.03,M('#e8e8e0'));f.position.set(-.33,.95,.22+i*.02);D.tor.add(f)}
 const ra=D.arms[0];
 return fxF_drakeIdle(D,{look:.6,noArms:1,extra:t=>{ra.s.rotation.z=.95;ra.s.rotation.x=-.25;ra.el.rotation.z=.25+Math.sin(t*.8)*.03;const la=D.arms[1];la.s.rotation.z=.25+Math.sin(t*1.2)*.05;la.el.rotation.z=.7}})}

/* 塔克：骸龙首领。被投刺者的木刺扎中过，被琳救下又复活；它在盐地深处把一颗蛋放在杜美莎树旁、
   围上一圈石头、跳起“复活之光”的舞。手里是石矛，后来常穿着骨制的铠甲。 */
function fxF_tako(){const D=fxF_drake({skin:'#7e796f',stripe:'#3c3833',belly:'#b0aa9c',eye:'#e0a428'});const g=D.g;
 const bone=M('#ece4d0',{roughness:.6}),wood=M('#6a4a2a',{roughness:.75}),stone=M('#8a8478',{flatShading:true,roughness:.95});
 // healed wound where the thorn went in
 const sc=fxF_sph(.06,.3,1.4,.6,M('#c8a098',{roughness:.5}),8);sc.position.set(.3,.68,-.12);sc.rotation.x=.4;D.tor.add(sc);
 // a necklace of teeth and a bone shoulder guard
 const nl=new THREE.Mesh(new THREE.TorusGeometry(.15,.01,4,16),M('#4a3a2a'));nl.rotation.y=Math.PI/2;nl.position.y=.1;D.neck.add(nl);for(let i=0;i<7;i++){const a=-1.2+i*.4;const t=cone(.014,.06,bone,4);t.rotation.z=Math.PI;t.position.set(Math.cos(a)*.16,.07,Math.sin(a)*.16);D.neck.add(t)}
 const pg=fxF_sph(.13,1,.5,1,bone,10);pg.position.set(0,.84,-.27);D.tor.add(pg);for(let i=0;i<3;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(.12,.012,4,10,Math.PI),bone);r.position.set(-.02+i*.05,.78,-.29);r.rotation.y=Math.PI/2;D.tor.add(r)}
 // stone spear
 const sp=new THREE.Group();D.arms[0].hand.add(sp);sp.position.y=-.04;sp.add(fxF_cyl(.022,.025,2.1,wood,6));const tp=new THREE.Mesh(new THREE.TetrahedronGeometry(.09),stone);tp.scale.set(.6,2,.6);tp.position.y=1.12;sp.add(tp);sp.rotation.z=1.57;
 // the egg by the stones
 const eg=new THREE.Group();eg.position.set(.95,0,.35);g.add(eg);const egg=fxF_sph(.2,1,1.3,1,M('#efe6d0',{roughness:.45}),16);egg.position.y=.26;eg.add(egg);for(let i=0;i<6;i++){const d=fxF_sph(.03,1,.6,1,M('#c8b898'),6);d.position.set(Math.cos(i)*.15,.18+i*.05,Math.sin(i)*.15);eg.add(d)}
 for(let i=0;i<10;i++){const a=i/10*6.28;const r=new THREE.Mesh(kd(.13),stone);r.position.set(Math.cos(a)*.48,.06,Math.sin(a)*.48);eg.add(r)}
 const lg=glowSprite('#fff0c0',.9,.0);lg.position.y=.3;eg.add(lg);
 const ra=D.arms[0],la=D.arms[1];
 // the dance of the light of revival: arms up, swaying, stamping
 return fxF_drakeIdle(D,{look:.4,noArms:1,talk:.6,extra:t=>{const s=Math.sin(t*2.2);ra.s.rotation.z=1.9+s*.25;ra.el.rotation.z=.4;ra.s.rotation.x=-.2;la.s.rotation.z=2.4-s*.25;la.el.rotation.z=.5;la.s.rotation.x=.3;
  D.tor.rotation.x=s*.08;D.hip.position.y=1.0+Math.abs(Math.cos(t*2.2))*.04;lg.material.opacity=.25+.2*Math.sin(t*1.5)}})}

/* 利德尔：塔克的学徒、被派去寻找绒球的小骸龙。它带着塔克给的角龙号角，
   找回绒球后得到了一尊小小的绒球雕像；遇到不懂的事就歪着头“嘎？”一声。 */
function fxF_lideer(){const D=fxF_drake({skin:'#86817a',stripe:'#45413b',belly:'#bdb7aa',eye:'#e8b030',young:1,build:.9,lean:.3});const g=D.g;g.scale.setScalar(.62);
 const horn=new THREE.Group();const hm=M('#d8c8a0',{roughness:.5});horn.add(tubeAlong([V3(0,0,0),V3(.06,.12,0),V3(.05,.25,0),V3(-.02,.36,0)],.03,hm,10));const bell=fxF_cyl(.05,.03,.08,hm,10);bell.position.set(-.03,.38,0);horn.add(bell);
 horn.position.set(.1,.55,.3);horn.rotation.set(.3,0,.5);D.tor.add(horn);const cord=new THREE.Mesh(new THREE.TorusGeometry(.33,.008,4,20),M('#6a4a2a'));cord.position.set(0,.6,0);cord.rotation.set(Math.PI/2,0,.6);cord.scale.set(1,.6,1);D.tor.add(cord);
 const idol=fxF_fluffIdol(.09,'#f4f0e6');D.arms[0].hand.add(idol);idol.position.set(.06,-.07,0);
 const ra=D.arms[0],la=D.arms[1];
 return fxF_drakeIdle(D,{look:.3,noArms:1,extra:t=>{const k=(t*.2)%1;const tilt=k<.5?Math.sin(k*2*Math.PI)*.45:0;D.head.rotation.x=tilt;ra.s.rotation.z=1.1;ra.el.rotation.z=1.2+Math.sin(t*1.5)*.08;ra.s.rotation.x=-.1;la.s.rotation.z=.5;la.el.rotation.z=1.0;D.jaw.rotation.z=-(k<.5?Math.max(0,Math.sin(k*4*Math.PI)):0)*.2}})}

/* 晶狂：为了一块结晶杀光所有同伴的白骸龙，拖着那块巨大的主脑结晶走了一路，后来当上了王：
   穿起只有王能穿的白色铠甲（不是一般的青色），举剑许下每条龙都有房子和大鸵龙的诺言。 */
function fxF_jingkuang(){const D=fxF_drake({skin:'#e2e0d8',stripe:null,belly:'#efede6',eye:'#bff8ff',glow:1,build:.9,lean:.35});const g=D.g;
 const arm=M('#fbfcff',{roughness:.15,metalness:.45,emissive:'#dfe8ff',emissiveIntensity:.08}),rim=M('#8aa0ac',{roughness:.25,metalness:.75}),blood=M('#8a1a1a',{roughness:.5});
 // shell-like plate armour, glossy, not covering everything
 const strap=M('#5a4636',{roughness:.7});
 const shell=(r,th0,th1)=>new THREE.Mesh(new THREE.SphereGeometry(r,20,10,-Math.PI*.42+Math.PI,Math.PI*.84,th0,th1),arm);
 const bp=shell(.36,Math.PI*.18,Math.PI*.5);bp.scale.set(1.05,1.25,1);bp.position.set(.02,.62,0);bp.rotation.y=Math.PI;D.tor.add(bp);
 for(let i=0;i<3;i++){const fp=shell(.33-i*.01,Math.PI*.4,Math.PI*.18);fp.position.set(.02,.36-i*.11,0);fp.rotation.y=Math.PI;D.tor.add(fp);const r=new THREE.Mesh(new THREE.TorusGeometry(.3-i*.01,.01,4,18,Math.PI*.84),rim);r.rotation.set(Math.PI/2,0,-Math.PI*.42);r.position.set(.02,.3-i*.11,0);D.tor.add(r)}
 const gorget=new THREE.Mesh(new THREE.TorusGeometry(.15,.035,6,16),rim);gorget.rotation.y=Math.PI/2;gorget.position.y=.06;D.neck.add(gorget);
 for(const z of[-1,1]){const s2=fxF_box(.03,.75,.05,strap);s2.position.set(0,.6,z*.18);s2.rotation.x=z*.15;D.tor.add(s2)}
 for(const a of D.arms){const pd=new THREE.Mesh(new THREE.SphereGeometry(.13,14,8,0,Math.PI*2,0,Math.PI*.5),arm);pd.position.y=.0;a.ua.add(pd);const pr=new THREE.Mesh(new THREE.TorusGeometry(.13,.012,4,16),rim);pr.rotation.x=Math.PI/2;a.ua.add(pr);const br=fxF_cyl(.07,.058,.2,arm,10);br.position.y=-.15;a.fa.add(br)}
 for(const l of D.legs){const gv=new THREE.Mesh(new THREE.SphereGeometry(.15,12,8,-Math.PI*.4,Math.PI*.8,Math.PI*.2,Math.PI*.6),arm);gv.scale.set(1,1.6,1);gv.rotation.y=Math.PI;gv.position.y=-.2;l.hp.children[0].add(gv)}
 const hm=new THREE.Mesh(new THREE.SphereGeometry(.21,16,8,0,Math.PI*2,0,Math.PI*.42),arm);hm.scale.set(1.1,.9,1);hm.position.set(.02,.1,0);D.head.add(hm);const hr=new THREE.Mesh(new THREE.TorusGeometry(.17,.014,4,18),rim);hr.rotation.x=Math.PI/2;hr.position.set(.02,.14,0);hr.scale.set(1.15,1,1);D.head.add(hr);
 for(let i=0;i<5;i++){const c=cone(.022,.13,rim,4);const a=-.8+i*.4;c.position.set(Math.cos(a)*.13-.04,.26,Math.sin(a)*.15);c.rotation.x=Math.sin(a)*.4;D.head.add(c)}
 // the white sword of the king, raised
 const sw=new THREE.Group();D.arms[0].hand.add(sw);sw.position.y=-.04;sw.add(fxF_cyl(.02,.02,.2,M('#5a4a3a'),6));const gd=fxF_box(.04,.03,.2,rim);gd.position.y=.1;sw.add(gd);const bl=fxF_box(.02,.9,.08,arm);bl.position.y=.56;sw.add(bl);const bs=fxF_box(.022,.3,.03,blood);bs.position.y=.3;sw.add(bs);
 sw.rotation.z=-1.4;
 // the great crystal it would not let go of
 const cr=new THREE.Group();cr.position.set(.75,0,-.5);g.add(cr);const cm=new THREE.MeshStandardMaterial({color:'#c8f4ff',emissive:'#5ac8e8',emissiveIntensity:.5,roughness:.05,metalness:.1,flatShading:true,transparent:true,opacity:.85});
 const big=new THREE.Mesh(ko(.35),cm);big.scale.set(1,1.7,1);big.position.y=.55;cr.add(big);for(let i=0;i<4;i++){const s2=new THREE.Mesh(ko(.14),cm);s2.scale.set(.8,1.8,.8);s2.position.set(Math.cos(i*1.6)*.3,.25,Math.sin(i*1.6)*.3);s2.rotation.z=Math.cos(i*1.6)*.5;s2.rotation.x=Math.sin(i*1.6)*.5;cr.add(s2)}cr.add(at(glowSprite('#9fe8ff',1.6,.45),0,.6,0));
 const ra=D.arms[0],la=D.arms[1];
 return fxF_drakeIdle(D,{look:.5,noArms:1,talk:1,extra:t=>{ra.s.rotation.z=2.5+Math.sin(t*1.7)*.12;ra.el.rotation.z=.3;ra.s.rotation.x=.15;la.s.rotation.z=.75;la.s.rotation.x=.45;la.el.rotation.z=.5;D.head.rotation.x=-.1+Math.sin(t*3.1)*.03;cm.emissiveIntensity=.45+Math.sin(t*1.4)*.12}})}

/* 预言者：白骸龙里专门记录历史的老者，关于木之灵和创造者的石板几乎都是它们写的；连王也要尊敬它。
   它守着“不能大吼大叫”的规则，曾因为大吼伤了声带；危急时它举起手中的木棍挡剑。 */
function fxF_yuyan(){const D=fxF_drake({skin:'#dedbd0',stripe:'#b8b4a8',belly:'#ecebe2',eye:'#d8f8ff',glow:1,build:.82,lean:.75,old:1});const g=D.g;
 const wood=M('#7a5a3a',{roughness:.85}),stone=M('#8a8a82',{roughness:.95}),hide=M('#8a7458',{roughness:.9,side:THREE.DoubleSide}),wrap=M('#c8b890',{roughness:.9});
 // age: sagging dewlap, sparse whitened brows, a wrap round the hurt throat
 const dw=fxF_sph(.1,.8,1,.7,D.skin,10);dw.position.set(.1,.12,0);D.neck.add(dw);const tw=fxF_cyl(.135,.14,.08,wrap,12);tw.position.y=.25;D.neck.add(tw);
 for(const z of[-1,1]){const w=cone(.02,.12,M('#f4f4ee'),4);w.position.set(.15,.2,z*.13);w.rotation.z=-1.2;D.head.add(w)}
 // a hide shawl and a satchel of tools
 const shl=fxF_skirt(.22,.4,.42,hide,5,.06,.5);shl.position.set(-.02,1.02,0);shl.rotation.z=.4;D.tor.add(shl);
 const sat=fxF_sph(.1,.6,1,1,M('#6a5440'),10);sat.position.set(-.05,.25,.32);D.tor.add(sat);const ch=fxF_cyl(.008,.008,.12,M('#9a9a90',{metalness:.6}),4);ch.position.set(-.02,.38,.34);D.tor.add(ch);
 // the plain wooden stick it leans on
 const st=new THREE.Group();st.position.set(.6,0,-.38);g.add(st);st.add(at(tubeAlong([V3(0,0,0),V3(.02,.6,0),V3(-.01,1.2,0),V3(.03,1.75,0),V3(.08,1.85,0)],.03,wood,10),0,0,0));
 // a stone tablet with its marks
 const tb=new THREE.Group();D.arms[0].hand.add(tb);tb.position.set(.05,-.1,0);const slab=fxF_box(.04,.36,.26,stone);tb.add(slab);
 const glyphT=fxF_tex(64,96,(x,w,h)=>{x.fillStyle='#8a8a82';x.fillRect(0,0,w,h);x.strokeStyle='#4a4a44';x.lineWidth=2;for(let i=0;i<7;i++){const y=10+i*12;x.beginPath();x.moveTo(8,y);for(let k=0;k<5;k++)x.lineTo(10+k*10,y+((k*7+i*3)%5)-2);x.stroke()}x.beginPath();x.arc(32,82,8,0,6.3);x.stroke()});
 const face=new THREE.Mesh(new THREE.PlaneGeometry(.25,.34),new THREE.MeshStandardMaterial({map:glyphT,roughness:.95}));face.rotation.y=Math.PI/2;face.position.x=.021;tb.add(face);tb.rotation.set(0,0,-.4);
 const ra=D.arms[0],la=D.arms[1];
 return fxF_drakeIdle(D,{look:.25,noArms:1,tilt:0,nod:.2,talk:.15,extra:t=>{ra.s.rotation.z=.75;ra.el.rotation.z=1.1;ra.s.rotation.x=.1;la.s.rotation.z=.8+Math.sin(t*.7)*.03;la.s.rotation.x=-.35;la.el.rotation.z=.55;D.tor.rotation.z=-.75+Math.sin(t*.5)*.03;
  for(const l of D.legs){l.hp.rotation.z=.65;l.kn.rotation.z=-1.25}}})}

/* 塔克（希望空间）：按真塔克的记忆生成的梦境生物，模样几乎一模一样，住在城堡里，有卫兵守着；
   一次次轮回里它总记得绒球，在族群里传下对绒球的信仰。龙栖木在这里能长出各种颜色的树皮。 */
function fxF_takoHope(){const D=fxF_drake({skin:'#77726a',stripe:'#3a3631',belly:'#a8a294',eye:'#e0a428',lean:.5});const g=D.g;
 const bark=['#a84a3a','#4a8a5a','#3a6aa8','#c89a3a'];const wood=M('#6a4a2a',{roughness:.7});
 // a mantle of coloured bark strips
 const barkT=fxF_tex(128,64,(x,w,h)=>{for(let i=0;i<16;i++){x.fillStyle=bark[i%4];x.fillRect(i*8,0,8,h);x.fillStyle='rgba(0,0,0,.25)';for(let k=0;k<6;k++)x.fillRect(i*8+((k*3)%7),k*11,1,8)}x.fillStyle='rgba(255,255,255,.15)';x.fillRect(0,0,w,4)});
 const cape=fxF_skirt(.24,.5,.95,new THREE.MeshStandardMaterial({map:barkT,roughness:.85,side:THREE.DoubleSide}),8,.05,.65);cape.position.set(-.02,1.02,0);cape.rotation.z=.42;D.tor.add(cape);
 const col=new THREE.Mesh(new THREE.TorusGeometry(.17,.04,6,16),M('#c89a3a',{roughness:.6}));col.rotation.y=Math.PI/2;col.position.y=.05;D.neck.add(col);
 // patches where old scales are coming away
 for(let i=0;i<6;i++){const p=fxF_sph(.05,1,.7,.3,M('#cdc6b6',{roughness:.9}),6);const a=h3(i,1,3)*6.28;p.position.set(Math.cos(a)*.3,.3+h3(i,2,3)*.5,Math.sin(a)*.29);p.lookAt(V3(0,p.position.y,0));D.tor.add(p)}
 // a pendant and a staff, both carved as the fluffball it keeps faith in
 const pd=fxF_fluffIdol(.05,'#f8f4ea');pd.position.set(.2,-.02,0);D.neck.add(pd);
 const st=new THREE.Group();D.arms[0].hand.add(st);st.position.y=-.04;st.add(at(fxF_cyl(.025,.03,2.0,wood,6),0,.35,0));const top=fxF_fluffIdol(.11,'#ffffff');top.position.y=1.42;st.add(top);st.add(at(glowSprite('#fff6d8',.8,.5),0,1.42,0));st.rotation.z=-1.57+.12;
 g.add(at(glowSprite('#bfe8ff',4,.25),0,1.6,0));
 const ra=D.arms[0];
 return fxF_drakeIdle(D,{look:.35,noArms:1,talk:.5,extra:t=>{ra.s.rotation.z=.15;ra.el.rotation.z=1.45;ra.s.rotation.x=-.15;const la=D.arms[1];la.s.rotation.z=.6+Math.sin(t*.9)*.08;la.el.rotation.z=1.2;la.s.rotation.x=.2}})}
/* ---------- the table ---------- */

