// what each effect costs to draw: software rendering (SwiftShader) is slow but its time per frame follows the work the GPU
// would do, so the differences between settings are a fair guide. node tests/gpucost.cjs [views] [configs]
//   DPR=1.5 to test a high-density screen. Prints the mean time per drawn frame for each view × setting.
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');const W=process.env.WDIR||(path.join(__dirname,'..','dist')+'/');
const VIEWS={
 meadow:{era:3,js:"Object.assign(window.__rq.rig,{a:3,b:2,alt:40,head:.6})"},
 town:{era:6,js:"Object.assign(window.__rq.rig,{a:-14,b:63,alt:70,head:.3})"},
 high:{era:3,js:"Object.assign(window.__rq.rig,{a:10,b:20,alt:600,head:0})"}};
const CONF={
 base:'',
 noShadow:"window.__rq.dbg.SHD.on=false",
 noAO:"window.__q3ao=0",
 noGrass:"window.__q2tier=3",
 tier1:"window.__q2tier=1;window.__q3tier=1;window.__q4btier=1",
 tier2:"window.__q2tier=2;window.__q3tier=2;window.__q4btier=2",
 noBloom:"window.__rq.dbg.post&&(window.__rq.dbg.post().bloomPass.enabled=false)",
 lvl1:"window.__rq.dbg.setLvl&&window.__rq.dbg.setLvl(1)",
 lvl2:"window.__rq.dbg.setLvl&&window.__rq.dbg.setLvl(2)"};
const RESET="window.__rq.dbg.SHD.on=true;delete window.__q3ao;delete window.__q2tier;delete window.__q3tier;delete window.__q4btier;"+
 "if(window.__rq.dbg.post)window.__rq.dbg.post().bloomPass.enabled=true;if(window.__rq.dbg.setLvl)window.__rq.dbg.setLvl(0)";
const views=(process.argv[2]||Object.keys(VIEWS).join(',')).split(','),confs=(process.argv[3]||Object.keys(CONF).join(',')).split(',');
(async()=>{const b=await chromium.launch({...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader']});
 const out={};
 for(const v of views){const V=VIEWS[v];
  const ctx=await b.newContext({viewport:{width:+(process.env.VW||800),height:+(process.env.VH||500)},deviceScaleFactor:+(process.env.DPR||1)});const p=await ctx.newPage();
  await p.addInitScript(e=>{localStorage.setItem('rq_era',e);localStorage.setItem('rq_seen','["x"]');localStorage.setItem('rq_snd','false');window.__rp=performance.now.bind(performance);window.__noAdapt=true;window.__noRender=true;
   const iv=setInterval(()=>{const q=window.__rq;if(q&&q.ren&&!q.ren.__p){const r=q.ren,o=r.render.bind(r);r.render=function(sc,cam){if(window.__noRender){if(sc.autoUpdate!==false)sc.updateMatrixWorld();if(cam.parent===null)cam.updateMatrixWorld();return}return o(sc,cam)};r.__p=1;clearInterval(iv)}},5)},String(V.era));
  await p.addInitScript({path:path.join(__dirname,'vclock.js')});
  const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
  await p.route('**/*',r=>{const u=r.request().url();if(u.includes('three.min.js'))return r.fulfill({path:path.join(__dirname,'..','node_modules','three','build','three.min.js')});const m=u.match(/three@0\.128\.0\/(examples\/js\/.*)$/);if(m)return r.fulfill({path:path.join(__dirname,'..','node_modules','three')+'/'+m[1]});
   for(const f of['links.js','wiki.js','wiki3.js','wiki4.js','chapters.js'])if(u.endsWith('/'+f))return r.fulfill({path:W+f,contentType:'application/javascript'});
   if(u.endsWith('/index.html'))return r.fulfill({body:'<!doctype html><html><head><meta charset=utf8></head><body>'+fs.readFileSync(W+'index.html','utf8')+'</body></html>',contentType:'text/html'});if(u.includes('fonts.g'))return r.fulfill({body:''});return r.continue()});
  await p.goto('http://x.test/index.html');for(let i=0;i<80;i++){await p.evaluate(()=>window.__step(50));if(await p.evaluate(()=>!!(window.__rq&&window.__rq.CUR)))break}
  for(let i=0;i<30;i++)await p.evaluate(()=>window.__step(50));
  await p.evaluate(V.js);await p.evaluate(()=>window.__rq.dbg.sunAt(window.__rq.rig.b+25));for(let i=0;i<40;i++)await p.evaluate(()=>window.__step(50));await p.evaluate(()=>{window.__noRender=false});
  const frame=()=>p.evaluate(()=>{const gl=window.__rq.ren.getContext(),px=new Uint8Array(4);const a=window.__rp();window.__step(16.7);gl.readPixels(0,0,1,1,gl.RGBA,gl.UNSIGNED_BYTE,px);return window.__rp()-a});
  for(const c of confs){await p.evaluate(RESET);if(CONF[c])await p.evaluate(CONF[c]);for(let i=0;i<5;i++)await frame();const t=[];for(let i=0;i<8;i++)t.push(await frame());
   const m=t.reduce((a,x)=>a+x,0)/t.length;(out[v]=out[v]||{})[c]=m;console.log(v.padEnd(7),c.padEnd(9),m.toFixed(0)+' ms')}
  if(errs.length)console.log(errs.slice(0,5).join('\n'));await ctx.close()}
 console.log(JSON.stringify(out));await b.close()})();
