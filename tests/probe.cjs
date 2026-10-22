// quick probe on the virtual clock: node probe.js steps.json outdir   (steps: {js}|{wait}|{shot}|{wheel:[x,y,dy,n]}|{dbl:[x,y]}|{click:[x,y]}|{key:[code,ms]})
const {chromium}=require('playwright');const fs=require('fs');const W=process.env.WDIR||(require('path').join(__dirname,'..','dist')+'/');
const steps=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const OUT=process.argv[3]||require('path').join(__dirname,'out','probe');fs.mkdirSync(OUT,{recursive:true});
const VW=+(process.env.VW||1100),VH=+(process.env.VH||700),MOB=!!process.env.TOUCH;
(async()=>{const b=await chromium.launch({...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader']});
 const ctx=await b.newContext({viewport:{width:VW,height:VH},hasTouch:MOB,isMobile:MOB});const p=await ctx.newPage();
 await p.addInitScript(e=>{try{localStorage.setItem('rq_era',e[0]);localStorage.setItem('rq_seen','["x"]');localStorage.setItem('rq_snd',e[1])}catch(x){}},[process.env.ERA||'3',process.env.SNDON?'true':'false']);
 await p.addInitScript({path:require('path').join(__dirname,'rp.js')});await p.addInitScript({path:require('path').join(__dirname,'vclock.js')});
 await p.addInitScript(()=>{window.__noRender=true;window.__noAdapt=true;const iv=setInterval(()=>{const q=window.__rq;if(q&&q.ren&&!q.ren.__p){const r=q.ren,o=r.render.bind(r);r.render=function(sc,cam){if(window.__noRender){if(sc.autoUpdate!==false)sc.updateMatrixWorld();if(cam.parent===null)cam.updateMatrixWorld();return}return o(sc,cam)};r.__p=1;clearInterval(iv)}},5)});
 const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message+' '+(e.stack||'').split('\n').slice(0,3).join('|')));p.on('console',m=>{if(m.type()==='error'||m.type()==='warning')errs.push(m.type()+': '+m.text().slice(0,200))});
 await p.route('**/*',r=>{const u=r.request().url();if(u.includes('three.min.js'))return r.fulfill({path:require('path').join(__dirname,'..','node_modules','three','build','three.min.js')});const m=u.match(/three@0\.128\.0\/(examples\/js\/.*)$/);if(m)return r.fulfill({path:(require('path').join(__dirname,'..','node_modules','three')+'/')+m[1]});
  for(const f of['links.js','wiki.js','wiki3.js','wiki4.js','chapters.js'])if(u.endsWith('/'+f))return r.fulfill({path:W+f,contentType:'application/javascript'});
  if(u.endsWith('/index.html'))return r.fulfill({body:'<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"></head><body>'+fs.readFileSync(W+(process.env.FILE||'index.html'),'utf8')+'</body></html>',contentType:'text/html'});if(u.includes('fonts.g'))return r.fulfill({body:''});return r.continue()});
 const wait=async ms=>{const n=Math.max(1,Math.round(ms/50));for(let i=0;i<n;i+=20)await p.evaluate(k=>{for(let j=0;j<k;j++)window.__step(50)},Math.min(20,n-i))};
 await p.goto('http://x.test/index.html');for(let i=0;i<40;i++){await wait(100);if(await p.evaluate(()=>!!(window.__rq&&window.__rq.CUR)))break}await wait(1500);
 let n=0;
 for(const s of steps){try{
  if(s.js!==undefined){const r=await p.evaluate(s.js);if(r!==undefined)console.log('js>',JSON.stringify(r).slice(0,1200))}
  if(s.wait)await wait(s.wait);
  if(s.wheel){const [x,y,dy,k]=s.wheel;await p.mouse.move(x,y);for(let i=0;i<k;i++){await p.mouse.wheel(0,dy);await wait(60)}}
  if(s.dbl){await p.mouse.dblclick(s.dbl[0],s.dbl[1])}
  if(s.click){if(MOB)await p.touchscreen.tap(s.click[0],s.click[1]);else await p.mouse.click(s.click[0],s.click[1])}
  if(s.clickjs){const xy=await p.evaluate(s.clickjs);if(Array.isArray(xy)){if(MOB)await p.touchscreen.tap(xy[0],xy[1]);else await p.mouse.click(xy[0],xy[1])}}
  if(s.drag){const [x1,y1,x2,y2,n]=s.drag;await p.mouse.move(x1,y1);await p.mouse.down();for(let i=1;i<=n;i++){await p.mouse.move(x1+(x2-x1)*i/n,y1+(y2-y1)*i/n);await p.evaluate(()=>window.__step&&window.__step(16))}await p.mouse.up()}
  if(s.hover){await p.mouse.move(s.hover[0],s.hover[1]);}
  if(s.sel){const e=await p.$(s.sel);if(e){if(MOB)await e.tap();else await e.click({timeout:5000})}else console.log('NOSEL',s.sel)}
  if(s.key){await p.keyboard.down(s.key[0]);await wait(s.key[1]);await p.keyboard.up(s.key[0])}
  if(s.savewav){const b64=await p.evaluate(()=>window.__wav);fs.writeFileSync(s.savewav,Buffer.from(b64,'base64'))}
  if(s.shot){await p.evaluate(()=>{window.__noRender=false;window.__step(50);window.__step(50)});await p.screenshot({path:`${OUT}/${s.shot}.jpg`,type:'jpeg',quality:85});await p.evaluate(()=>{window.__noRender=true})}
 }catch(e){console.log('STEPERR',JSON.stringify(s).slice(0,80),String(e).slice(0,200))}}
 console.log('ERR',errs.slice(0,15).join('\n'));await b.close()})();
