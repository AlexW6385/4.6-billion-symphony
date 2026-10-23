// stability session: era switches 3→6→9→12, every space, cards, following a creature. per-frame JS cost, every frame >100 ms
// with what was running (window.__q5prof). node tests/perf5s.cjs            COARSE=1 emulates a phone (pointer:coarse)
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');const W=process.env.WDIR||(path.join(__dirname,'..','dist')+'/');
const COARSE=!!process.env.COARSE;const LONG=+(process.env.LONG||100);
(async()=>{const b=await chromium.launch({...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader']});
 const ctx=await b.newContext({viewport:COARSE?{width:390,height:780}:{width:1100,height:700},hasTouch:COARSE,isMobile:COARSE});const p=await ctx.newPage();
 await p.addInitScript(c=>{localStorage.setItem('rq_era','3');localStorage.setItem('rq_seen','["x"]');localStorage.setItem('rq_snd','false');window.__rp=performance.now.bind(performance);
  if(c){const mm=window.matchMedia.bind(window);window.matchMedia=q=>{if(/pointer:\s*coarse/.test(q))return{matches:true,media:q,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}};if(/hover:\s*none/.test(q))return{matches:true,media:q,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}};return mm(q)};Object.defineProperty(navigator,'deviceMemory',{get:()=>3});Object.defineProperty(navigator,'hardwareConcurrency',{get:()=>4})}},COARSE);
 await p.addInitScript({path:path.join(__dirname,'vclock.js')});
 await p.addInitScript(()=>{window.__noAdapt=true;window.__noRender=true;const iv=setInterval(()=>{const q=window.__rq;if(q&&q.ren&&!q.ren.__p){const r=q.ren,o=r.render.bind(r);r.render=function(sc,cam){if(window.__noRender){if(sc.autoUpdate!==false)sc.updateMatrixWorld();if(cam.parent===null)cam.updateMatrixWorld();return}return o(sc,cam)};r.__p=1;clearInterval(iv)}},5)});
 if(process.env.ADAPT)await p.addInitScript(()=>{window.__noAdapt=false});
 const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push('console: '+m.text().slice(0,200))});
 await p.route('**/*',r=>{const u=r.request().url();if(u.includes('three.min.js'))return r.fulfill({path:path.join(__dirname,'..','node_modules','three','build','three.min.js')});const m=u.match(/three@0\.128\.0\/(examples\/js\/.*)$/);if(m)return r.fulfill({path:(path.join(__dirname,'..','node_modules','three')+'/')+m[1]});
  for(const f of['links.js','wiki.js','wiki3.js','wiki4.js','chapters.js'])if(u.endsWith('/'+f))return r.fulfill({path:W+f,contentType:'application/javascript'});
  if(u.endsWith('/index.html'))return r.fulfill({body:'<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"></head><body>'+fs.readFileSync(W+'index.html','utf8')+'</body></html>',contentType:'text/html'});if(u.includes('fonts.g'))return r.fulfill({body:''});return r.continue()});
 await p.goto('http://x.test/index.html');for(let i=0;i<80;i++){await p.evaluate(()=>window.__step(50));if(await p.evaluate(()=>!!(window.__rq&&window.__rq.CUR)))break}
 for(let i=0;i<40;i++)await p.evaluate(()=>window.__step(50));
 const all=[],longs=[];const per={};
 // one scenario: n frames of 16.7 ms; every frame's real cost, and for long ones what the profiler saw
 const cdp=await p.context().newCDPSession(p);const PROF=process.env.PROF||'';
 const profDump=async()=>{const {profile}=await cdp.send('Profiler.stop');const cnt={};profile.samples.forEach((s,i)=>{cnt[s]=(cnt[s]||0)+(profile.timeDeltas[i]||0)});const par={};profile.nodes.forEach(n=>(n.children||[]).forEach(c=>par[c]=n));const byId={};profile.nodes.forEach(n=>byId[n.id]=n);const tot={};
  for(const n of profile.nodes){let x=n,st=[];for(let k=0;k<5&&x;k++){st.push(x.callFrame.functionName+':'+x.callFrame.lineNumber);x=par[x.id]}const key=st.join(' < ');tot[key]=(tot[key]||0)+(cnt[n.id]||0)}
  console.log(Object.entries(tot).sort((a,b)=>b[1]-a[1]).slice(0,18).map(x=>'     '+(x[1]/1000).toFixed(0)+'ms '+x[0]).join('\n'))};
 const run=async(label,n,pre)=>{const pf=PROF&&label.startsWith(PROF);if(pf){await cdp.send('Profiler.enable');await cdp.send('Profiler.setSamplingInterval',{interval:300});await cdp.send('Profiler.start')}const r=await p.evaluate(([n,pre,LONG])=>{const o=[],L=[];if(pre){try{(new Function(pre))()}catch(e){console.error('pre',e.message)}}
   for(let i=0;i<n;i++){const a=window.__rp();window.__step(16.7);const t=window.__rp()-a;o.push(t);if(t>LONG||(i===0&&pre&&t>30)){const P=window.__q5prof;L.push([i,t,P?P.last:null,P?P.spans.splice(0).map(s=>s[0]+':'+s[1].toFixed(0)).join(' '):'']);}else if(window.__q5prof)window.__q5prof.spans.length=0}
   return[o,L]},[n,pre||'',LONG]);
  const [o,L]=r;o.forEach((t,i)=>all.push([t,label,i]));const s=[...o].sort((a,b)=>a-b);const st={med:s[s.length>>1],p95:s[Math.floor(s.length*.95)],max:s[s.length-1],long:L.filter(x=>x[1]>LONG).length,n:o.length};per[label]=st;
  console.log(label.padEnd(16),'med',st.med.toFixed(1),'p95',st.p95.toFixed(1),'max',st.max.toFixed(1),'>'+LONG+':',L.length);
  for(const x of L){if(x[1]>LONG)longs.push([label,...x]);console.log('   long #'+x[0],x[1].toFixed(0)+'ms',x[2]?JSON.stringify(x[2],(k,v)=>typeof v==='number'?+v.toFixed(1):v):'',x[3])}if(pf)await profDump()};
 const ents=async k=>p.evaluate(k=>{const q=window.__rq;const ps=q.CUR.prox.filter(x=>!x.side&&!x.hide&&q.dbg.eraOk(x.e));const o=[];for(let i=0;i<k;i++)o.push(ps[Math.floor(i*ps.length/k)].w.id);return o},k);
 await run('idle rq3',120);
 for(const e of[6,9,12]){await run('era '+e,150,'window.__rq.timeTo('+e+')')}
 await run('era 3 back',150,'window.__rq.timeTo(3)');
 // cards on the planet, and following a herd creature
 for(const id of await ents(3)){await run('card '+id,120,'window.__rq.go('+JSON.stringify(id)+')');await run('close',30,'document.dispatchEvent(new KeyboardEvent("keydown",{key:"Escape"}))')}
 const herd=await p.evaluate(()=>{const q=window.__rq;const F=(window.FAUNA||[]).filter(f=>(f.m||'rongqiu')==='rongqiu'&&(!f.e||f.e.includes(q.ERA)));const p=q.CUR.prox.find(x=>x.c&&!x.side&&F.some(f=>f.w===x.w.id));return p?p.w.id:null});
 if(herd){await run('follow '+herd,240,'window.__rq.go('+JSON.stringify(herd)+')');await run('close',30,'document.dispatchEvent(new KeyboardEvent("keydown",{key:"Escape"}))')}
 for(const s of['void','ximin','erxi','dream','midgard','void']){await run('enter '+s,150,'window.__rq.enterSpace('+JSON.stringify(s)+')');await run('idle '+s,120);
  if(s!=='void'){for(const id of await ents(1)){await run('card '+id,90,'window.__rq.go('+JSON.stringify(id)+')');await run('close',30,'document.dispatchEvent(new KeyboardEvent("keydown",{key:"Escape"}))')}}}
 // back to the planet, where the other worlds are now built: a quiet stretch lets the background work (prebuild, idle steps) show up
 await run('enter rongqiu',150,'window.__rq.enterSpace("rongqiu")');await run('quiet',400);
 all.sort((a,b)=>b[0]-a[0]);const s=all.map(x=>x[0]).sort((a,b)=>a-b);
 console.log('ALL  n',s.length,'med',s[s.length>>1].toFixed(1),'p95',s[Math.floor(s.length*.95)].toFixed(1),'p99',s[Math.floor(s.length*.99)].toFixed(1),'max',s[s.length-1].toFixed(1),'>'+LONG+':',longs.length,'>40:',s.filter(x=>x>40).length);
 console.log('TOP',all.slice(0,12).map(x=>x[0].toFixed(0)+'@'+x[1]+'#'+x[2]).join('  '));
 const lg=await p.evaluate(()=>window.__q5log||null);if(lg)console.log('Q5LOG',JSON.stringify(lg).slice(0,1500));
 if(process.env.JSON)fs.writeFileSync(process.env.JSON,JSON.stringify({per,longs,errs}));
 console.log(errs.slice(0,20).join('\n'));await b.close()})();
