const {chromium}=require('playwright');const fs=require('fs');
const W=process.env.WDIR||(require('path').join(__dirname,'..','dist')+'/');
const steps=JSON.parse(process.argv[2]||'[]');const FILE=process.env.FILE||'index.html';const VW=+(process.env.VW||960),VH=+(process.env.VH||600);
(async()=>{
 const b=await chromium.launch({...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader']});
 const p=await b.newPage({viewport:{width:VW,height:VH},deviceScaleFactor:1,hasTouch:!!process.env.TOUCH,isMobile:!!process.env.TOUCH});
 if(process.env.NOINTRO)await p.addInitScript(()=>{try{localStorage.setItem('rq_era','2');localStorage.setItem('rq_seen','["x"]')}catch(e){}});
 const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message+' '+(e.stack||'').split('\n').slice(0,8).join(' | ')));p.on('console',m=>{const t=m.text();if(m.type()==='error'||m.type()==='warning')errs.push(m.type()+': '+t.slice(0,400));else if(t.startsWith('[T]'))console.log(t)});
 await p.route('**/*',r=>{const u=r.request().url();
  if(u.includes('three.min.js'))return r.fulfill({path:require('path').join(__dirname,'..','node_modules','three','build',process.env.DEV?'three.js':'three.min.js'),contentType:'application/javascript'});
  const m=u.match(/three@0\.128\.0\/(examples\/js\/.*)$/);if(m)return r.fulfill({path:require('path').join(__dirname,'..','node_modules','three',m[1]),contentType:'application/javascript'});
  if(u.endsWith('/_novel.txt'))return process.env.NOVEL_TXT?r.fulfill({path:process.env.NOVEL_TXT,contentType:'text/plain'}):r.fulfill({status:404,body:''});
  if(u.endsWith('/links.js'))return r.fulfill({path:W+'links.js',contentType:'application/javascript'});
  if(u.endsWith('/_clean.txt'))return process.env.NOVEL_TXT?r.fulfill({path:process.env.NOVEL_TXT,contentType:'text/plain'}):r.fulfill({status:404,body:''});
  if(u.endsWith('/wiki.js'))return r.fulfill({path:W+'wiki.js',contentType:'application/javascript'});
  if(u.endsWith('/wiki3.js'))return r.fulfill({path:W+'wiki3.js',contentType:'application/javascript'});
  if(u.endsWith('/wiki4.js'))return r.fulfill({path:W+'wiki4.js',contentType:'application/javascript'});
  if(u.endsWith('/chapters.js'))return r.fulfill({path:W+'chapters.js',contentType:'application/javascript'});
  if(u.endsWith('/index.html'))return r.fulfill({body:'<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"></head><body>'+fs.readFileSync(W+FILE,'utf8')+'</body></html>',contentType:'text/html'});
  if(u.includes('fonts.g'))return r.fulfill({body:'',contentType:'text/css'});
  return r.continue()});
 const t0=Date.now();
 await p.goto('http://x.test/index.html',{timeout:180000});await p.waitForTimeout(+(process.env.WAIT||12000));
 console.log('loaded',Date.now()-t0,'ms');
 for(const s of steps){try{ if(s.js){const r=await p.evaluate(s.js);if(s.out)fs.writeFileSync(s.out,JSON.stringify(r));else if(r!==undefined)console.log('js>',JSON.stringify(r).slice(0,900))} if(s.mouse){const [x,y]=s.mouse;await p.mouse.move(x,y)} if(s.click){const [x,y]=s.click;await p.mouse.click(x,y)} if(s.wheel){await p.mouse.move(s.wheel[0],s.wheel[1]);await p.mouse.wheel(0,s.wheel[2])} if(s.file){await p.setInputFiles(s.file[0],s.file[1])} if(s.wait)await p.waitForTimeout(s.wait); if(s.shot){await p.screenshot({path:s.shot});console.log('shot',s.shot)} }catch(e){console.log('STEPERR',e.message.slice(0,300))}}
 console.log(errs.slice(0,25).join('\n'));
 await b.close()})();
