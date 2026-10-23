// a lost WebGL context: the loop must stop, the notice show, and the picture come back on restore.  node tests/ctxloss.cjs
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');const W=(path.join(__dirname,'..','dist')+'/');
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader']});
 const p=await b.newPage({viewport:{width:800,height:500}});
 await p.addInitScript(()=>{localStorage.setItem('rq_era','3');localStorage.setItem('rq_seen','["x"]');localStorage.setItem('rq_snd','false')});
 const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));p.on('console',m=>{if(m.type()==='error'||m.text().includes('q5s')||m.text().includes('Context'))errs.push(m.type()+': '+m.text().slice(0,160))});
 await p.route('**/*',r=>{const u=r.request().url();if(u.includes('three.min.js'))return r.fulfill({path:path.join(__dirname,'..','node_modules','three','build','three.min.js')});const m=u.match(/three@0\.128\.0\/(examples\/js\/.*)$/);if(m)return r.fulfill({path:(path.join(__dirname,'..','node_modules','three')+'/')+m[1]});
  for(const f of['links.js','wiki.js','wiki3.js','wiki4.js','chapters.js'])if(u.endsWith('/'+f))return r.fulfill({path:W+f,contentType:'application/javascript'});
  if(u.endsWith('/index.html'))return r.fulfill({body:'<!doctype html><html><head><meta charset=utf8></head><body>'+fs.readFileSync(W+'index.html','utf8')+'</body></html>',contentType:'text/html'});if(u.includes('fonts.g'))return r.fulfill({body:''});return r.continue()});
 await p.goto('http://x.test/index.html',{timeout:240000});await p.waitForFunction(()=>window.__rq&&window.__rq.CUR&&window.__q5prof.frame>20,null,{timeout:240000});
 await p.evaluate(()=>{window.__q5ctxWait=30000});const f0=await p.evaluate(()=>window.__q5prof.frame);console.log('frames',f0,'lose:',await p.evaluate(()=>window.__q5ctx.lose()));
 await p.waitForTimeout(800);console.log('after lose',await p.evaluate(()=>({halt:window.__q5s.halt,frame:window.__q5prof.frame,note:getComputedStyle(document.getElementById('q5note')).opacity})));
 await p.evaluate(()=>window.__q5ctx.restore());await p.waitForTimeout(1500);
 console.log('after restore',await p.evaluate(()=>({halt:window.__q5s.halt,frame:window.__q5prof.frame,log:window.__q5log.slice(-3)})));
 await p.waitForTimeout(8000);console.log("later",await p.evaluate(()=>({halt:window.__q5s.halt,frame:window.__q5prof.frame})));
 await p.screenshot({path:'tests/out/_ctx.jpg',type:'jpeg',quality:80,timeout:240000});console.log(errs.join('\n'));await b.close()})();
