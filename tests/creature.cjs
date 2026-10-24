// render creatures alone on a plain stage. IDS=emerald,baihai OUT=dir node tests/creature.cjs   (ids are FAUNA w ids, or ENT:<entry id>)
// VIEWS=f,s,q (front, side, three-quarter; default q only), T=1.3 the animation time, LIFT=1 stands anything that hangs below y=0 (flyers, swimmers) on the floor
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');const W=path.join(__dirname,'..','dist')+'/';
(async()=>{const b=await chromium.launch({...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader']});
 const p=await (await b.newContext({viewport:{width:640,height:480}})).newPage();
 await p.addInitScript(()=>{try{localStorage.setItem('rq_seen','["x"]');localStorage.setItem('rq_snd','false')}catch(x){}});
 await p.route('**/*',r=>{const u=r.request().url();if(u.includes('three.min.js'))return r.fulfill({path:path.join(__dirname,'..','node_modules','three','build','three.min.js')});const m=u.match(/three@0\.128\.0\/(examples\/js\/.*)$/);if(m)return r.fulfill({path:path.join(__dirname,'..','node_modules','three',m[1])});
  for(const f of['links.js','wiki.js','wiki3.js','wiki4.js','chapters.js'])if(u.endsWith('/'+f))return r.fulfill({path:W+f,contentType:'application/javascript'});
  if(u.endsWith('/index.html'))return r.fulfill({body:'<!doctype html><html><head><meta charset=utf8></head><body>'+fs.readFileSync(W+'index.html','utf8')+'</body></html>',contentType:'text/html'});if(u.includes('fonts.g'))return r.fulfill({body:''});return r.continue()});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://x.test/index.html');await p.waitForFunction(()=>window.__rq&&window.__rq.CUR,null,{timeout:120000});await p.waitForTimeout(3000);
 const out=process.env.OUT||path.join(__dirname,'out','creatures');fs.mkdirSync(out,{recursive:true});
 const views=(process.env.VIEWS||'q').split(',').filter(v=>['f','s','q'].includes(v));
 for(const id of (process.env.IDS||'emerald').split(',')){
  const r=await p.evaluate(({id,T,views,LIFT})=>{const q=window.__rq;let o;if(id.startsWith('ENT:')){const eid=id.slice(4);if(!(q.W&&q.W[eid]))return 'no WIKI entry '+eid;try{o=q.entShape&&q.entShape(eid)}catch(e){return 'entShape error: '+e.message}}else{const f=(window.FAUNA||[]).find(x=>x.w===id)||{kind:id,col:'#8a7a6a',s:1};o=q.bc(Object.assign({},f,{s:1}))}if(!o)return 'none';
   const sc=new THREE.Scene();sc.background=new THREE.Color('#9ab0c0');sc.add(new THREE.HemisphereLight(0xdfefff,0x5a5040,.9));const dl=new THREE.DirectionalLight(0xfff4e0,1.1);dl.position.set(3,5,4);sc.add(dl);
   const fl=new THREE.Mesh(new THREE.CircleGeometry(50,32),new THREE.MeshStandardMaterial({color:'#7a8a6a'}));fl.rotation.x=-Math.PI/2;sc.add(fl);sc.add(o);
   (o.userData.anim||(()=>{}))(T);o.updateMatrixWorld(true);let bx=new THREE.Box3().setFromObject(o);if(LIFT&&bx.min.y<0){o.position.y-=bx.min.y;o.updateMatrixWorld(true);bx=new THREE.Box3().setFromObject(o)}const c=bx.getCenter(new THREE.Vector3()),s=bx.getSize(new THREE.Vector3()).length();
   const R=q.ren;const pv=new THREE.Vector2();R.getSize(pv);const pr=R.getPixelRatio();R.setPixelRatio(1);R.setSize(640,480,false);const dirs={f:[1,.25,.001],s:[.001,.25,1],q:[.9,.45,1.1]},urls=[];
   for(const v of views){const cam=new THREE.PerspectiveCamera(35,640/480,.01,1000);cam.position.copy(c).add(new THREE.Vector3(...dirs[v]).normalize().multiplyScalar(s*1.35));cam.lookAt(c);R.render(sc,cam);urls.push(R.domElement.toDataURL('image/png'))}
   R.setPixelRatio(pr);R.setSize(pv.x,pv.y,false);return urls},{id,T:+(process.env.T||1.3),views,LIFT:!!process.env.LIFT});
  if(Array.isArray(r))r.forEach((u,i)=>fs.writeFileSync(path.join(out,id.replace(':','_')+(views.length===1&&views[0]==='q'?'':'_'+views[i])+'.png'),Buffer.from(u.split(',')[1],'base64')));else console.log(id,r)}
 console.log('done',errs.slice(0,3).join(' | '));await b.close()})();
