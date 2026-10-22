// per-frame JS cost & spikes during a scripted tour. node perf5.js [space]
const {chromium}=require('playwright');const fs=require('fs');const W=(require('path').join(__dirname,'..','dist')+'/');
const SPACE=process.argv[2]||'rongqiu';
(async()=>{const b=await chromium.launch({...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader']});
 const p=await b.newPage({viewport:{width:1100,height:700}});
 await p.addInitScript(()=>{localStorage.setItem('rq_era','3');localStorage.setItem('rq_seen','["x"]');localStorage.setItem('rq_snd','false');window.__rp=performance.now.bind(performance)});await p.addInitScript({path:require('path').join(__dirname,'vclock.js')});
 await p.addInitScript(()=>{window.__noAdapt=true;window.__noRender=true;const iv=setInterval(()=>{const q=window.__rq;if(q&&q.ren&&!q.ren.__p){const r=q.ren,o=r.render.bind(r);r.render=function(sc,cam){if(window.__noRender){if(sc.autoUpdate!==false)sc.updateMatrixWorld();if(cam.parent===null)cam.updateMatrixWorld();return}return o(sc,cam)};r.__p=1;clearInterval(iv)}},5)});
 const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
 await p.route('**/*',r=>{const u=r.request().url();if(u.includes('three.min.js'))return r.fulfill({path:require('path').join(__dirname,'..','node_modules','three','build','three.min.js')});const m=u.match(/three@0\.128\.0\/(examples\/js\/.*)$/);if(m)return r.fulfill({path:(require('path').join(__dirname,'..','node_modules','three')+'/')+m[1]});
  for(const f of['links.js','wiki.js','wiki3.js','wiki4.js','chapters.js'])if(u.endsWith('/'+f))return r.fulfill({path:W+f,contentType:'application/javascript'});
  if(u.endsWith('/index.html'))return r.fulfill({body:'<!doctype html><html><head><meta charset=utf8></head><body>'+fs.readFileSync(W+(process.env.FILE||'index.html'),'utf8')+'</body></html>',contentType:'text/html'});if(u.includes('fonts.g'))return r.fulfill({body:''});return r.continue()});
 await p.goto('http://x.test/index.html');for(let i=0;i<80;i++){await p.evaluate(()=>window.__step(50));if(await p.evaluate(()=>!!(window.__rq&&window.__rq.CUR)))break}
 for(let i=0;i<40;i++)await p.evaluate(()=>window.__step(50));
 if(SPACE!=='rongqiu'){await p.evaluate(s=>window.__rq.enterSpace(s),SPACE);for(let i=0;i<120;i++)await p.evaluate(()=>window.__step(50))}
 const all=[];const cdp=await p.context().newCDPSession(p);
 const run=async(label,n)=>{const r=await p.evaluate(n=>{const o=[];for(let i=0;i<n;i++){const a=window.__rp();window.__step(16.7);o.push(window.__rp()-a)}return o},n);r.forEach((t,i)=>all.push([t,label,i]));const s=[...r].sort((a,b)=>a-b);console.log(label.padEnd(18),'med',s[s.length>>1].toFixed(1),'p95',s[Math.floor(s.length*.95)].toFixed(1),'max',s[s.length-1].toFixed(1))};

 await run('idle',20);
 await p.evaluate(()=>{window.__RC={};for(const K of['Mesh','Points','Line','Sprite','InstancedMesh','LineSegments']){const P=THREE[K].prototype;const f=P.raycast;P.raycast=function(a,b){const t=window.__rp();const r=f.call(this,a,b);const d=window.__rp()-t;if(d>=0){const g=this.geometry;const k=K+':'+(this.name||'')+':'+(g&&g.index?g.index.count/3:g&&g.attributes&&g.attributes.position?g.attributes.position.count:0)+(this.isInstancedMesh?'x'+this.count:'');const e=window.__RC[k]||(window.__RC[k]=[0,0]);e[0]+=d;e[1]++}return r}}});
 if(process.env.FROM){for(const f of process.env.FROM.split(',')){await p.evaluate(id=>window.__rq.go(id),f);await run('from '+f,150)}}
 await p.evaluate(id=>window.__rq.go(id),process.env.ID||'hometree');
 await run('pre',parseInt(process.env.PRE||'100'));
 if(process.env.PROFUPD){await cdp.send('Profiler.enable');await cdp.send('Profiler.setSamplingInterval',{interval:100});await cdp.send('Profiler.start')}
 await cdp.send('Tracing.start',{categories:'devtools.timeline,v8,disabled-by-default-devtools.timeline',transferMode:'ReturnAsStream'});
 const fr=await p.evaluate(n=>{const o=[];for(let i=0;i<n;i++){const a=window.__rp();window.__step(16.7);o.push(+(window.__rp()-a).toFixed(1))}return o},parseInt(process.env.N||'40'));
 console.log('frames',fr.join(' '));if(process.env.PROFUPD){const {profile}=await cdp.send('Profiler.stop');const par={};profile.nodes.forEach(n=>(n.children||[]).forEach(c=>par[c]=n));const cnt={};profile.samples.forEach((s,i)=>{cnt[s]=(cnt[s]||0)+(profile.timeDeltas[i]||0)});const tot={};for(const n of profile.nodes){let x=n,ok=false,st=[];for(let k=0;k<40&&x;k++){if(x.callFrame.functionName===process.env.PROFUPD)ok=true;if(st.length<4)st.push(x.callFrame.functionName+':'+x.callFrame.lineNumber);x=par[x.id]}if(!ok)continue;const key=st.join(' < ');tot[key]=(tot[key]||0)+(cnt[n.id]||0)}console.log(Object.entries(tot).sort((a,b)=>b[1]-a[1]).slice(0,20).map(x=>(x[1]/1000).toFixed(1)+'ms '+x[0]).join('\n'))}console.log(await p.evaluate(()=>Object.entries(window.__RC).sort((a,b)=>b[1][0]-a[1][0]).slice(0,15).map(x=>x[1][0].toFixed(1)+'ms n'+x[1][1]+' '+x[0]).join('\n')));console.log(await p.evaluate(()=>(window.__LT||[]).filter(x=>Object.values(x).reduce((a,b)=>a+b,0)>8).map(x=>JSON.stringify(x)).join('\n')));
 const done=new Promise(r=>cdp.once('Tracing.tracingComplete',r));await cdp.send('Tracing.end');const {stream}=await done;let data='';while(true){const c=await cdp.send('IO.read',{handle:stream});data+=c.data;if(c.eof)break}
 let ev=JSON.parse(data);ev=ev.traceEvents||ev;const agg={};for(const e of ev){if(e.ph==='X'&&e.dur){const k=e.name;agg[k]=(agg[k]||0)+e.dur}}
 console.log(Object.entries(agg).sort((a,b)=>b[1]-a[1]).slice(0,25).map(x=>(x[1]/1000).toFixed(1)+'ms '+x[0]).join('\n'));
 const big=ev.filter(e=>e.ph==='X'&&e.dur>8000&&!['RunTask','v8.run','FunctionCall','EvaluateScript','v8.callFunction','ThreadControllerImpl::RunTask'].includes(e.name)).map(e=>(e.dur/1000).toFixed(1)+' '+e.name);console.log('BIG\n'+big.slice(0,30).join('\n'));
 await b.close()})();
