/* ---------- dream islands: small scenes after the book ---------- */
function dreamDeco(g,kp,r,Rn,sp){const parts=[],glow=[];const y0=r*.06;const m4=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler();
 const P=(geo,c,x,y,z,rx,ry,rz,sx,sy,sz,lit)=>{e.set(rx||0,ry||0,rz||0);q.setFromEuler(e);m4.compose(V3(x,y,z),q,V3(sx||1,sy===undefined?(sx||1):sy,sz===undefined?(sx||1):sz));const gg=geo.clone();gg.applyMatrix4(m4);(lit?glow:parts).push([gg,c])};
 const ring=(n,d0,d1)=>Array.from({length:n},()=>{const a=Rn()*6.28,d=d0+(d1-d0)*Math.sqrt(Rn());return[Math.cos(a)*d,Math.sin(a)*d,a]});
 const SPH=new THREE.SphereGeometry(1,10,8),CYL=new THREE.CylinderGeometry(1,1,1,10),CON=new THREE.ConeGeometry(1,1,8),BOX=new THREE.BoxGeometry(1,1,1),TOR=new THREE.TorusGeometry(1,.12,5,16,Math.PI);
 const u=r*.02;// a "person-sized" unit on this island
 if(kp.lake){// 雾湖: a jungle ring around the water, a little camp, footprints walking into the mist
  for(const [x,z] of ring(46,r*.42,r*.82)){const h=u*(5+Rn()*5);P(CYL,'#4a3a26',x,y0+h*.5,z,0,0,0,u*.35,h,u*.35);for(let k=0;k<3;k++)P(SPH,['#1f5a32','#2a6a3a','#164a2a'][k],x+(Rn()-.5)*u*2,y0+h+u*(k*.8),z+(Rn()-.5)*u*2,0,0,0,u*(2.4-k*.5),u*(1.6-k*.3),u*(2.4-k*.5))}
  for(let i=0;i<3;i++){const a=2.2+i*.35,d=r*.4;P(CON,['#d8a040','#c85a3a','#4a8ac8'][i],Math.cos(a)*d,y0+u*1.2,Math.sin(a)*d,0,Rn()*3,0,u*1.6,u*2.4,u*1.6)}
  {const a=2.5;for(let i=0;i<9;i++){const d=r*(.38-i*.012),s=(i%2?.12:-.12);P(SPH,'#2a2a22',Math.cos(a)*d+Math.sin(a)*s*u*6,y0+u*.05,Math.sin(a)*d-Math.cos(a)*s*u*6,0,0,0,u*1.1,u*.08,u*.7)}}
  const mist=[];for(let i=0;i<7;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:smokeTex,color:'#eef2f6',transparent:true,opacity:.28,depthWrite:false}));s.scale.set(r*.5,r*.14,1);g.add(s);mist.push({s,a:i*.9,d:r*(.08+Rn()*.22)})}
  g.userData.dtick=t=>mist.forEach(m=>{const a=m.a+t*.05;m.s.position.set(Math.cos(a)*m.d,y0+u*1.5+Math.sin(t*.3+m.a)*u,Math.sin(a)*m.d)})}
 if(kp.sweets){// 甜点之地: a plain of metal biscuits, a tea party without salt, the dessert machine
  for(const [x,z] of ring(40,r*.15,r*.85))P(CYL,Rn()<.5?'#b89a6a':'#a8a8a0',x,y0+u*.15,z,(Rn()-.5)*.2,0,(Rn()-.5)*.2,u*(1.5+Rn()*2),u*.3,u*(1.5+Rn()*2));
  P(CYL,'#f4ece0',0,y0+u*1.2,0,0,0,0,u*3,u*.2,u*3);P(CYL,'#c8a070',0,y0+u*.6,0,0,0,0,u*.3,u*1.2,u*.3);
  for(let i=0;i<6;i++){const a=i/6*6.28;P(CYL,'#ffffff',Math.cos(a)*u*2.2,y0+u*1.5,Math.sin(a)*u*2.2,0,0,0,u*.35,u*.45,u*.35);P(CYL,'#e89ab8',Math.cos(a)*u*4.2,y0+u*.6,Math.sin(a)*u*4.2,0,0,0,u*.9,u*1.2,u*.9)}
  P(SPH,'#ffd0e0',0,y0+u*1.9,0,0,0,0,u*.7);
  for(const [x,z] of ring(10,r*.3,r*.7)){P(CYL,'#f8e8d0',x,y0+u*1,z,0,0,0,u*2.2,u*2,u*2.2);P(CYL,'#ff9ac0',x,y0+u*2.4,z,0,0,0,u*1.5,u*1.2,u*1.5);P(SPH,'#d82a4a',x,y0+u*3.3,z,0,0,0,u*.5)}
  const mx=r*.55;P(BOX,'#7a6a8a',mx,y0+u*3,0,0,.4,0,u*5,u*6,u*4);P(CYL,'#5a4a6a',mx,y0+u*7.5,0,0,0,0,u*.8,u*4,u*.8);P(SPH,'#ff7ab8',mx-u*2.6,y0+u*3,0,0,0,0,u*1.2,u*1.2,u*1.2,1)}
 if(kp.bones){// 海藻民: houses of fish ribs, seaweed everywhere, a pot with floating eyes
  for(let h=0;h<6;h++){const a=h/6*6.28+.3,d=r*.5,cx=Math.cos(a)*d,cz=Math.sin(a)*d,R0=u*4;P(CYL,'#ece4d0',cx,y0+R0,cz,Math.PI/2,a,0,u*.25,R0*2.4,u*.25);
   for(let k=-3;k<=3;k++){const off=k*u*1.1;P(TOR,'#efe8d6',cx+Math.cos(a+1.57)*0+Math.cos(a)*off,y0,cz+Math.sin(a)*off,0,-a+1.57,0,R0*(1-Math.abs(k)*.08),R0*(1-Math.abs(k)*.08),R0)}
   for(let k=0;k<5;k++)P(CON,'#2a5a3a',cx+(Rn()-.5)*R0*2,y0+R0*.6,cz+(Rn()-.5)*R0*2,(Rn()-.5)*.3,0,(Rn()-.5)*.3,u*.6,R0*1.2,u*.6)}
  for(const [x,z] of ring(50,r*.1,r*.85))P(CON,Rn()<.5?'#1f4a32':'#3a6a3a',x,y0+u*1.4,z,(Rn()-.5)*.4,0,(Rn()-.5)*.4,u*.35,u*(2+Rn()*2),u*.35);
  for(const [x,z] of ring(14,r*.2,r*.8))P(SPH,'#a8b0b8',x,y0+u*.3,z,0,Rn()*3,0,u*1.4,u*.35,u*.5);
  P(CYL,'#3a3a3a',0,y0+u*1,0,0,0,0,u*3,u*2,u*3);P(CYL,'#c83a2a',0,y0+u*2.02,0,0,0,0,u*2.7,u*.05,u*2.7,1);
  for(let i=0;i<7;i++){const a=i*.9,d=u*(.6+i*.25);P(SPH,'#ffffff',Math.cos(a)*d,y0+u*2.15,Math.sin(a)*d,0,0,0,u*.4);P(SPH,'#1a1a2a',Math.cos(a)*d,y0+u*2.5,Math.sin(a)*d,0,0,0,u*.18)}}
 if(kp.toys){// 彩色道路 · 绒毛玩具: rainbow lanes and big soft toys
  const RB=['#ff6a6a','#ffb04a','#ffe85a','#6ad86a','#5ab0ff','#a87aff'];RB.forEach((c,i)=>{const t=new THREE.TorusGeometry(r*(.25+i*.08),u*.9,3,48);t.rotateX(Math.PI/2);t.scale(1,.15,1);P(t,c,0,y0+u*.1,0)});
  const PL=['#ffd0e0','#ffe8b0','#c8e8ff','#e0d0ff','#d0ffd8','#fff0f0'];for(const [x,z,a] of ring(12,r*.2,r*.8)){const c=PL[(Rn()*6)|0],s=u*(2+Rn()*2.2);P(SPH,c,x,y0+s,z,0,0,0,s,s*1.1,s*.9);P(SPH,c,x,y0+s*2.3,z,0,0,0,s*.75);
   for(const k of[-1,1]){P(SPH,c,x+Math.cos(a+1.57)*s*.55*k,y0+s*2.95,z+Math.sin(a+1.57)*s*.55*k,0,0,0,s*.28);P(SPH,c,x+Math.cos(a+1.57)*s*.9*k,y0+s*1.2,z+Math.sin(a+1.57)*s*.9*k,0,0,0,s*.35,s*.6,s*.35)}
   P(SPH,'#2a2a2a',x+Math.cos(a)*s*.7,y0+s*2.4,z+Math.sin(a)*s*.7,0,0,0,s*.09)}}
 if(kp.flowers&&kp.souls){// 曼珠沙华: tall red spider lilies with curled petals, a cold mist along the ground
  const L=[];const st=new THREE.CylinderGeometry(.04,.05,1,4);st.translate(0,.5,0);L.push([st,'#3a6a2a']);for(let k=0;k<6;k++){const p=new THREE.TorusGeometry(.18,.025,3,6,Math.PI);p.rotateX(Math.PI/2);p.rotateZ(.5);p.rotateY(k*1.05);p.translate(0,1,0);L.push([p,'#e01a30'])}
  for(let k=0;k<6;k++){const s=new THREE.CylinderGeometry(.006,.006,.4,3);s.rotateZ(.7);s.rotateY(k*1.05);s.translate(0,1.1,0);L.push([s,'#ff4a5a'])}
  const lily=mergeColored(L.map(([a,b])=>[a,b]));for(const [x,z] of ring(110,r*.05,r*.85))P(lily,null,x,y0,z,0,Rn()*6,0,u*(3.6+Rn()*2.4));
  for(let i=0;i<6;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:smokeTex,color:'#c8ccd8',transparent:true,opacity:.22,depthWrite:false}));const a=i*1.05,d=r*.45;s.position.set(Math.cos(a)*d,y0+u*1.2,Math.sin(a)*d);s.scale.set(r*.6,r*.1,1);g.add(s)}}
 if(kp.manor){const u0=u;{const u=u0*1.7;// 吸血鬼的洋馆: a dark manor with lit windows
  P(BOX,'#2a2228',0,y0+u*4,-r*.25,0,0,0,u*14,u*8,u*7);P(CON,'#1a1418',0,y0+u*10,-r*.25,0,Math.PI/4,0,u*10,u*4,u*5.5);
  for(const k of[-1,1]){P(CYL,'#2a2228',k*u*8,y0+u*6,-r*.25,0,0,0,u*1.8,u*12,u*1.8);P(CON,'#1a1418',k*u*8,y0+u*14,-r*.25,0,0,0,u*2.2,u*4,u*2.2)}
  for(let i=0;i<6;i++)for(let j=0;j<2;j++)P(BOX,'#ffb84a',(i-2.5)*u*2,y0+u*(2.5+j*3.2),-r*.25+u*3.55,0,0,0,u*.8,u*1.4,u*.1,1);
  for(const [x,z] of ring(10,r*.45,r*.85))P(CON,'#2a2a2a',x,y0+u*2,z,0,0,0,u*.2,u*4,u*.2)}}
 if(kp.ruins){// 废土: broken walls and rusted wrecks
  for(const [x,z,a] of ring(8,r*.2,r*.7)){P(BOX,'#7a5a3a',x,y0+u*.9,z,0,a,(Rn()-.5)*.3,u*4,u*1.6,u*2);P(CYL,'#3a2a22',x+u*1.6,y0+u*.5,z,Math.PI/2,a,0,u*.6,u*.4,u*.6)}}
 if(kp.hope){// 希望空间: thirty-metre rock buildings and the dragons' castle, rainforest, a sea of white fog below
  for(const [x,z,a] of ring(16,r*.3,r*.8)){const h=u*(10+Rn()*8),w=u*(3+Rn()*2);P(BOX,['#8a8070','#7a7264','#9a9080'][(Rn()*3)|0],x,y0+h/2,z,0,a,0,w,h,w);for(let k=0;k<3;k++)P(BOX,'#ffd890',x+Math.cos(a)*w*.51,y0+h*(.3+k*.22),z+Math.sin(a)*w*.51,0,a,0,u*.6,u*.8,u*.2,1)}
  P(BOX,'#a89e8c',0,y0+u*7,0,0,0,0,u*12,u*14,u*12);for(let k=0;k<8;k++){const a=k/8*6.28;P(BOX,'#a89e8c',Math.cos(a)*u*5.5,y0+u*14.8,Math.sin(a)*u*5.5,0,a,0,u*1.6,u*1.6,u*1.6)}
  for(const [x,z] of [[-1,-1],[1,-1],[-1,1],[1,1]]){P(CYL,'#9a907e',x*u*7,y0+u*9,z*u*7,0,0,0,u*2,u*18,u*2);P(CON,'#5a4a3a',x*u*7,y0+u*20,z*u*7,0,0,0,u*2.6,u*4,u*2.6)}
  for(const [x,z] of ring(40,r*.5,r*.92)){const h=u*(3+Rn()*3);P(CYL,'#4a3a26',x,y0+h/2,z,0,0,0,u*.4,h,u*.4);P(SPH,['#1f6a32','#2a7a3a','#3a8a3a'][(Rn()*3)|0],x,y0+h+u,z,0,0,0,u*2.4,u*1.8,u*2.4)}
  for(let i=0;i<10;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:smokeTex,color:'#ffffff',transparent:true,opacity:.35,depthWrite:false}));const a=i/10*6.28;s.position.set(Math.cos(a)*r*.9,-r*.15,Math.sin(a)*r*.9);s.scale.set(r*.9,r*.25,1);g.add(s)}}
 if(kp.doom){// 末日空间: a land piled up out of legends of the end — glowing fissures, a great gate and the one who keeps it
  for(let k=0;k<14;k++){let x=(Rn()-.5)*r*1.2,z=(Rn()-.5)*r*1.2;for(let j=0;j<6;j++){const a=Rn()*6.28,l=u*(3+Rn()*4);P(BOX,'#ff5a1a',x+Math.cos(a)*l/2,y0+u*.05,z+Math.sin(a)*l/2,0,-a,0,l,u*.1,u*.35,1);x+=Math.cos(a)*l;z+=Math.sin(a)*l;if(x*x+z*z>r*r*.7)break}}
  P(BOX,'#2a2226',-u*6,y0+u*8,0,0,0,0,u*2.4,u*16,u*2.4);P(BOX,'#2a2226',u*6,y0+u*8,0,0,0,0,u*2.4,u*16,u*2.4);P(BOX,'#2a2226',0,y0+u*16.8,0,0,0,0,u*15,u*2,u*3);P(BOX,'#ff8a3a',0,y0+u*7,0,0,0,0,u*9.4,u*14,u*.2,1);
  P(CYL,'#3a3036',u*8.5,y0+u*1,u*2,0,0,0,u*.5,u*2,u*.5);P(SPH,'#4a3a40',u*8.5,y0+u*2.4,u*2,0,0,0,u*.5);
  for(const [x,z] of ring(14,r*.4,r*.85))P(CON,'#3a2a2a',x,y0+u*2,z,(Rn()-.5)*.3,0,(Rn()-.5)*.3,u*1.2,u*(3+Rn()*5),u*1.2);
  const met=[];for(let i=0;i<6;i++){const s=glowSprite('#ffb060',u*4,.9);g.add(s);met.push({s,x:(Rn()-.5)*r,z:(Rn()-.5)*r,ph:Rn()})}
  const prev=g.userData.dtick;g.userData.dtick=t=>{if(prev)prev(t);met.forEach(m=>{const k=(t*.15+m.ph)%1;m.s.position.set(m.x+k*u*10,y0+r*(1-k),m.z);m.s.material.opacity=.9*(1-k*k)})}}
 if(kp.tower){// 淹没高峰: water all round the peak
  const w=new THREE.Mesh(new THREE.CircleGeometry(r*1.8,40),new THREE.MeshStandardMaterial({color:'#2a6a9a',roughness:.15,metalness:.3,transparent:true,opacity:.75}));w.rotation.x=-Math.PI/2;w.position.y=y0-u*2;g.add(w);
}
 const mc=L=>THREE.BufferGeometryUtils.mergeBufferGeometries(L.map(([gg,c])=>{gg=gg.index?gg.toNonIndexed():gg;if(gg.attributes.uv)gg.deleteAttribute('uv');if(c!==null){const n=gg.attributes.position.count,a=new Float32Array(n*3),cc=C(c);for(let i=0;i<n;i++){a[i*3]=cc.r;a[i*3+1]=cc.g;a[i*3+2]=cc.b}gg.setAttribute('color',new THREE.BufferAttribute(a,3))}return gg}));
 if(parts.length){const geo=mc(parts);const mesh=new THREE.Mesh(geo,VC({roughness:.75}));g.add(mesh)}
 if(glow.length){const geo=mc(glow);g.add(new THREE.Mesh(geo,new THREE.MeshBasicMaterial({vertexColors:true})))}}
