// jump to every entry and measure what the camera actually shows. node audit.js out.json [map] [from] [to]
const {chromium}=require('playwright');const fs=require('fs');const W=(require('path').join(__dirname,'..','dist')+'/');
const OUT=process.argv[2],MAP=process.argv[3]||'',FROM=+(process.argv[4]||0),TO=+(process.argv[5]||1e9);
const VW=+(process.env.VW||1100),VH=+(process.env.VH||700),MOB=!!process.env.TOUCH;
(async()=>{const b=await chromium.launch({...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader']});
 const ctx=await b.newContext({viewport:{width:VW,height:VH},hasTouch:MOB,isMobile:MOB});const p=await ctx.newPage();
 await p.addInitScript(()=>{try{localStorage.setItem('rq_era','3');localStorage.setItem('rq_seen','["x"]');localStorage.setItem('rq_snd','false')}catch(x){}});
 await p.addInitScript({path:require('path').join(__dirname,'vclock.js')});
 await p.addInitScript(()=>{window.__noRender=true;window.__noAdapt=true;const iv=setInterval(()=>{const q=window.__rq;if(q&&q.ren&&!q.ren.__p){const r=q.ren,o=r.render.bind(r);r.render=function(sc,cam){if(window.__noRender){if(sc.autoUpdate!==false)sc.updateMatrixWorld();if(cam.parent===null)cam.updateMatrixWorld();return}return o(sc,cam)};r.__p=1;clearInterval(iv)}},5)});
 const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
 await p.route('**/*',r=>{const u=r.request().url();if(u.includes('three.min.js'))return r.fulfill({path:require('path').join(__dirname,'..','node_modules','three','build','three.min.js')});const m=u.match(/three@0\.128\.0\/(examples\/js\/.*)$/);if(m)return r.fulfill({path:(require('path').join(__dirname,'..','node_modules','three')+'/')+m[1]});
  for(const f of['links.js','wiki.js','wiki3.js','wiki4.js','chapters.js'])if(u.endsWith('/'+f))return r.fulfill({path:W+f,contentType:'application/javascript'});
  if(u.endsWith('/index.html'))return r.fulfill({body:'<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"></head><body>'+fs.readFileSync(W+'index.html','utf8')+'</body></html>',contentType:'text/html'});if(u.includes('fonts.g'))return r.fulfill({body:''});return r.continue()});
 const step=n=>p.evaluate(k=>{for(let j=0;j<k;j++)window.__step(50)},n);
 await p.goto('http://x.test/index.html');for(let i=0;i<60;i++){await step(2);if(await p.evaluate(()=>!!(window.__rq&&window.__rq.CUR)))break}await step(40);
 await p.evaluate(()=>{window.__measure=function(id){const q=window.__rq,D=q.dbg,sp=q.CUR,cam=q.cam,w=q.W[id];const sel=D.selP();
   const P=sel?D.proxCenter(sel):D.posOf(w);const r=sel?sel.r:Math.max(10,D.sizeOf(w));const out={cam:cam.position.toArray().map(x=>x|0),tgt:(sel?D.proxCenter(sel):D.posOf(w)).toArray().map(x=>x|0),id,sp:sp.id,want:(w.m||'rongqiu')==='ningu'?'void':(w.m||'rongqiu'),hasP:!!sel,r:+r.toFixed(1),cap:!!document.querySelector('#cap.on')};
   if(!P){out.noP=1;return out}const v=P.clone().project(cam);out.sx=+((v.x*.5+.5)*innerWidth).toFixed(0);out.sy=+((-v.y*.5+.5)*innerHeight).toFixed(0);out.on=v.z<1&&Math.abs(v.x)<1&&Math.abs(v.y)<1;
   const dist=cam.position.distanceTo(P);out.dist=+dist.toFixed(0);const f=innerHeight/2/Math.tan(cam.fov*Math.PI/360);out.px=+(r/dist*f).toFixed(0);
   const rc=new THREE.Raycaster();const dir=P.clone().sub(cam.position).normalize();rc.set(cam.position,dir);rc.far=dist;rc.camera=cam;rc.params.Points.threshold=.01;rc.params.Line.threshold=.01;
   const vis=o=>{let x=o;while(x){if(!x.visible)return false;x=x.parent}return true};
   const hits=rc.intersectObjects(sp.scene.children,true).filter(h=>{const o=h.object;if(!(o.isMesh))return false;const m=Array.isArray(o.material)?o.material[0]:o.material;if(!m||m.transparent||m.depthWrite===false)return false;if(m.blending===THREE.AdditiveBlending)return false;if(m.visible===false||m.colorWrite===false)return false;return vis(o)});
   const h0=hits[0];if(h0){out.hitD=+h0.distance.toFixed(1);out.hitN=(h0.object.name||h0.object.geometry.type)+":"+JSON.stringify(h0.object.geometry.parameters||{}).slice(0,60)+":"+h0.object.material.type+":"+h0.object.material.side+":"+h0.object.material.transparent;if(h0.face){const n=h0.face.normal.clone().transformDirection(h0.object.matrixWorld);out.back=n.dot(dir)>0}
    out.occ=h0.distance<dist-Math.max(r*2.5,10)}
   {let n=0;const R2=Math.max(r*1.6,18),wp=new THREE.Vector3();sp.scene.traverse(o=>{if(!(o.isMesh||o.isPoints||o.isInstancedMesh||o.isLine||o.isSprite))return;if(!vis(o))return;o.getWorldPosition(wp);if(wp.distanceTo(P)<R2)n++});out.near=n}
   {const E=sp.ents&&sp.ents[id];if(E){const bx=new THREE.Box3().setFromObject(E);if(!bx.isEmpty()){let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(let i=0;i<8;i++){const v=new THREE.Vector3(i&1?bx.max.x:bx.min.x,i&2?bx.max.y:bx.min.y,i&4?bx.max.z:bx.min.z).project(cam);if(v.z>1)continue;const X=(v.x*.5+.5)*innerWidth,Y=(-v.y*.5+.5)*innerHeight;x0=Math.min(x0,X);x1=Math.max(x1,X);y0=Math.min(y0,Y);y1=Math.max(y1,Y)}out.spx=Math.round(Math.max(x1-x0,y1-y0));out.bsz=+bx.getSize(new THREE.Vector3()).length().toFixed(1)}}else out.noEnt=1}
   const cr=document.querySelector('#cap.on');if(cr&&out.on){const R=cr.getBoundingClientRect();out.covered=out.sx>R.left&&out.sx<R.right&&out.sy>R.top&&out.sy<R.bottom}
   return out}});
 const ids=process.env.IDS?process.env.IDS.split(','):await p.evaluate(m=>Object.values(window.__rq.W).filter(w=>!m||((w.m||'rongqiu')===m)).map(w=>w.id),MAP);
 const res=[];const t0=Date.now();
 for(let i=FROM;i<Math.min(ids.length,TO);i++){const id=ids[i];
  const tq=Date.now();try{await p.evaluate(id=>{window.__rq.go(id)},id);
   for(let k=0;k<80;k++){await step(5);const st=await p.evaluate(()=>{const q=window.__rq;return !!q.tw||q.dbg.busy()||!!document.querySelector('#load:not(.done)')});if(!st&&k>3)break}
   await step(6);if(await p.evaluate(()=>!!window.__rq.CUR.camOv))await step(70);if(process.env.EXTRA)await step(+process.env.EXTRA);const m=await p.evaluate(id=>window.__measure(id),id);m.ms=Date.now()-tq;res.push(m);
   if(process.env.SHOT&&(process.env.SHOTALL||m.occ||!m.on||m.covered||m.px<8||m.sp!==m.want)){await p.evaluate(()=>{window.__noRender=false;window.__step(50);window.__step(50)});fs.mkdirSync(process.env.SHOT,{recursive:true});await p.screenshot({path:process.env.SHOT+'/'+id+'.jpg',type:'jpeg',quality:70});await p.evaluate(()=>{window.__noRender=true})}}catch(e){res.push({id,err:String(e).slice(0,120)})}
  if(i%25===0){fs.writeFileSync(OUT,JSON.stringify(res));console.log(i,ids.length,((Date.now()-t0)/1000|0)+'s')}}
 fs.writeFileSync(OUT,JSON.stringify(res));console.log('done',res.length,errs.slice(0,5).join('|'));await b.close()})();
