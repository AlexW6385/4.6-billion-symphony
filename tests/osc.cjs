// does the view settle after going to an entry? for every moving thing in a world: go(), then watch the camera for a few
// seconds with the world animating, and count how often its height and distance swing back and forth.
//   node tests/osc.cjs <space> <era> [max]      (TOUCH=1 for a phone)
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');const W=path.join(__dirname,'..','dist')+'/';
const SPACE=process.argv[2]||'rongqiu',ERA=process.argv[3]||'3',MAX=+(process.argv[4]||30),MOB=!!process.env.TOUCH;
(async()=>{const b=await chromium.launch({...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader']});
 const ctx=await b.newContext({viewport:MOB?{width:300,height:640}:{width:320,height:200},hasTouch:MOB,isMobile:MOB});const p=await ctx.newPage();
 await p.addInitScript(e=>{localStorage.setItem('rq_era',e);localStorage.setItem('rq_seen','["x"]');localStorage.setItem('rq_snd','false');window.__noAdapt=true},ERA);
 await p.addInitScript({path:path.join(__dirname,'vclock.js')});
 await p.route('**/*',r=>{const u=r.request().url();if(u.includes('three.min.js'))return r.fulfill({path:path.join(__dirname,'..','node_modules','three','build','three.min.js')});const m=u.match(/three@0\.128\.0\/(examples\/js\/.*)$/);if(m)return r.fulfill({path:path.join(__dirname,'..','node_modules','three')+'/'+m[1]});
  for(const f of['links.js','wiki.js','wiki3.js','wiki4.js','chapters.js'])if(u.endsWith('/'+f))return r.fulfill({path:W+f,contentType:'application/javascript'});
  if(u.endsWith('/index.html'))return r.fulfill({body:'<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"></head><body>'+fs.readFileSync(W+'index.html','utf8')+'</body></html>',contentType:'text/html'});if(u.includes('fonts.g'))return r.fulfill({body:''});return r.continue()});
 const step=(ms,n)=>p.evaluate(([ms,n])=>{for(let i=0;i<n;i++)window.__step(ms)},[ms,n]);
 await p.goto('http://x.test/index.html');for(let i=0;i<80;i++){await step(50,2);if(await p.evaluate(()=>!!(window.__rq&&window.__rq.CUR)))break}await step(50,30);
 if(SPACE!=='rongqiu'){await p.evaluate(s=>window.__rq.enterSpace(s),SPACE);for(let i=0;i<40;i++){await step(100,3);if(await p.evaluate(()=>!window.__rq.dbg.busy()&&window.__rq.CUR.id))break}}
 const ids=await p.evaluate(M=>{const q=window.__rq,seen=new Set(),L=[];for(const x of q.CUR.prox){if(x.side||!x.w||seen.has(x.w.id)||!q.dbg.eraOk(x.e))continue;seen.add(x.w.id);if(x.c||x.herd)L.push(x.w.id)}return L.slice(0,M)},MAX);
 console.log(SPACE,ERA,'moving entries',ids.length);
 const bad=[];
 for(const id of ids){await p.evaluate(id=>window.__rq.go(id),id);await step(100,40);
  const S=[];for(let i=0;i<40;i++){await step(100,1);S.push(await p.evaluate(id=>{const q=window.__rq,F=q.CUR.follow;const c=F&&F.S&&F.S.c();return [q.rig.alt,c?c.distanceTo(q.cam.position):0]},id))}
  const rev=k=>{let n=0,last=0;for(let i=1;i<S.length;i++){const d=S[i][k]-S[i-1][k];const rel=Math.abs(d)/Math.max(1,S[i-1][k]);if(rel<.01)continue;const s=Math.sign(d);if(last&&s!==last)n++;last=s}return n};
  const a=S.map(x=>x[0]),dd=S.map(x=>x[1]);const span=k=>{const v=S.map(x=>x[k]);return (Math.max(...v)-Math.min(...v))/Math.max(1,Math.min(...v))};
  const r={id,altRev:rev(0),distRev:rev(1),altSpan:+span(0).toFixed(2),distSpan:+span(1).toFixed(2),alt:Math.round(a[a.length-1]),dist:Math.round(dd[dd.length-1])};
  const osc=(r.altRev>=3&&r.altSpan>.05)||(r.distRev>=4&&r.distSpan>.25);if(osc)bad.push(r);console.log(osc?'OSC ':'    ',JSON.stringify(r))}
 console.log('oscillating',bad.length,'of',ids.length);await b.close()})();
