// what is drawn at a screen point after jumping to an entry. IDS=id PTS="x,y;x,y" node tests/whatis.cjs
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');const W=path.join(__dirname,'..','dist')+'/';
const VW=+(process.env.VW||800),VH=+(process.env.VH||560);
(async()=>{const b=await chromium.launch({...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader']});
 const p=await (await b.newContext({viewport:{width:VW,height:VH}})).newPage();
 await p.addInitScript(()=>{try{localStorage.setItem('rq_era','3');localStorage.setItem('rq_seen','["x"]');localStorage.setItem('rq_snd','false')}catch(x){}});
 await p.addInitScript({path:path.join(__dirname,'vclock.js')});
 await p.route('**/*',r=>{const u=r.request().url();if(u.includes('three.min.js'))return r.fulfill({path:path.join(__dirname,'..','node_modules','three','build','three.min.js')});const m=u.match(/three@0\.128\.0\/(examples\/js\/.*)$/);if(m)return r.fulfill({path:path.join(__dirname,'..','node_modules','three',m[1])});
  for(const f of['links.js','wiki.js','wiki3.js','wiki4.js','chapters.js'])if(u.endsWith('/'+f))return r.fulfill({path:W+f,contentType:'application/javascript'});
  if(u.endsWith('/index.html'))return r.fulfill({body:'<!doctype html><html><head><meta charset=utf8></head><body>'+fs.readFileSync(W+'index.html','utf8')+'</body></html>',contentType:'text/html'});if(u.includes('fonts.g'))return r.fulfill({body:''});return r.continue()});
 const step=n=>p.evaluate(k=>{for(let j=0;j<k;j++)window.__step(50)},n);
 await p.goto('http://x.test/index.html');for(let i=0;i<60;i++){await step(2);if(await p.evaluate(()=>!!(window.__rq&&window.__rq.CUR)))break}await step(40);
 await p.evaluate(id=>window.__rq.go(id),process.env.IDS);for(let k=0;k<80;k++){await step(5);if(!(await p.evaluate(()=>!!window.__rq.tw||window.__rq.dbg.busy()))&&k>3)break}await step(10);
 const pts=(process.env.PTS||'400,280').split(';').map(s=>s.split(',').map(Number));
 const out=await p.evaluate(pts=>{const q=window.__rq,cam=q.cam,sp=q.CUR;const rc=new THREE.Raycaster();const vis=o=>{let x=o;while(x){if(!x.visible)return false;x=x.parent}return true};
  return pts.map(([x,y])=>{rc.setFromCamera(new THREE.Vector2(x/innerWidth*2-1,-(y/innerHeight)*2+1),cam);rc.params.Points.threshold=1;rc.camera=cam;
   const hs=rc.intersectObjects(sp.scene.children,true).filter(h=>vis(h.object)&&h.object.isMesh).slice(0,6);
   return [x,y,hs.map(h=>{const o=h.object,m=Array.isArray(o.material)?o.material[0]:o.material;let chain=[];let v=o;while(v&&chain.length<4){chain.push((v.type||'')+(v.name?':'+v.name:'')+(v.userData&&v.userData.pick?'#'+v.userData.pick:''));v=v.parent}
    return {d:+h.distance.toFixed(1),geo:o.geometry&&o.geometry.type,par:JSON.stringify(o.geometry&&o.geometry.parameters||{}).slice(0,160),fs:(m&&m.fragmentShader||'').slice(0,140),mat:m&&m.type,col:m&&m.color&&m.color.getHexString(),tr:m&&m.transparent,op:m&&m.opacity,map:!!(m&&m.map),chain:chain.join('<')}})]})},pts);
 if(process.env.SHOT){await p.evaluate(()=>{const c=document.querySelector('#cap');if(c)c.style.visibility='hidden';window.__step(50);window.__step(50)});await p.screenshot({path:process.env.SHOT})}console.log(JSON.stringify(out));await b.close()})();
