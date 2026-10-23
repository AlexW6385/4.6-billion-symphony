// full UI interaction test: real clicks, drags, wheel, keys, file input. usage: node ui.js <suite> <outdir>
const {chromium}=require('playwright');const fs=require('fs');
const W=process.env.WDIR||(require('path').join(__dirname,'..','dist')+'/');const SUITE=process.argv[2]||'desk';const OUT=process.argv[3]||require('path').join(__dirname,'out',SUITE);fs.mkdirSync(OUT,{recursive:true});
const MOB=SUITE.startsWith('mob');const VW=MOB?390:1100,VH=MOB?844:700;
const CLEAN=process.env.NOVEL_TXT||require('path').join(__dirname,'fixtures','novel_sample.txt');
const log=(...a)=>console.log(...a);let nShot=0;
(async()=>{
 const b=await chromium.launch({...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader']});
 const ctx=await b.newContext({viewport:{width:VW,height:VH},deviceScaleFactor:1,hasTouch:MOB,isMobile:MOB});
 const p=await ctx.newPage();
 await p.addInitScript({path:require('path').join(__dirname,'vclock.js')});
 await p.addInitScript(()=>{window.__noRender=true;window.__noAdapt=true;const iv=setInterval(()=>{const q=window.__rq;if(q&&q.ren&&!q.ren.__p){const r=q.ren,o=r.render.bind(r);r.render=function(sc,cam){if(window.__noRender){window.__skipped=(window.__skipped||0)+1;if(sc.autoUpdate!==false)sc.updateMatrixWorld();if(cam.parent===null)cam.updateMatrixWorld();return}return o(sc,cam)};r.__p=1;clearInterval(iv)}},5)});
 if(process.env.RETURNING)await p.addInitScript(()=>{try{localStorage.setItem('rq_era','2');localStorage.setItem('rq_seen','["x"]')}catch(e){}});
 const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message+' '+(e.stack||'').split('\n').slice(0,4).join(' | ')));p.on('console',m=>{const t=m.text();if(m.type()==='error'||m.type()==='warning')errs.push(m.type()+': '+t.slice(0,300))});
 await p.route('**/*',r=>{const u=r.request().url();
  if(u.includes('three.min.js'))return r.fulfill({path:require('path').join(__dirname,'..','node_modules','three','build','three.min.js'),contentType:'application/javascript'});
  const m=u.match(/three@0\.128\.0\/(examples\/js\/.*)$/);if(m)return r.fulfill({path:require('path').join(__dirname,'..','node_modules','three',m[1]),contentType:'application/javascript'});
  for(const f of['links.js','wiki.js','wiki3.js','wiki4.js','chapters.js'])if(u.endsWith('/'+f))return r.fulfill({path:W+f,contentType:'application/javascript'});
  if(u.endsWith('/index.html'))return r.fulfill({body:'<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"></head><body>'+fs.readFileSync(W+'index.html','utf8')+'</body></html>',contentType:'text/html'});
  if(u.includes('fonts.g'))return r.fulfill({body:'',contentType:'text/css'});
  return r.continue()});
 const ev=(f,a)=>p.evaluate(f,a);const wait=async ms=>{const n=Math.max(1,Math.round(ms/50));for(let i=0;i<n;i+=10)await p.evaluate(k=>{for(let j=0;j<k;j++)window.__step(50)},Math.min(10,n-i))};
 const shot=async n=>{const f=`${OUT}/${String(++nShot).padStart(2,'0')}_${n}.jpg`;await p.evaluate(()=>{window.__noRender=false;window.__step(50);window.__step(50)});await p.screenshot({path:f,type:'jpeg',quality:85,timeout:150000});await p.evaluate(()=>{window.__noRender=true});return f};
 const ok=(name,cond,info)=>log((cond?'PASS ':'FAIL ')+name+(info!==undefined?' :: '+JSON.stringify(info).slice(0,300):''));
 const vis=sel=>ev(s=>{const e=document.querySelector(s);if(!e)return false;const r=e.getBoundingClientRect();const cs=getComputedStyle(e);return r.width>0&&r.height>0&&cs.visibility!=='hidden'&&+cs.opacity>.05},sel);
 const click=async sel=>{const e=await p.$(sel);if(!e){log('NOSEL '+sel);return false}if(MOB)await e.tap().catch(async()=>{await e.click({force:true})});else await e.click().catch(async x=>{log('CLICKERR '+sel+' '+String(x).slice(0,120));await e.click({force:true})});return true};
 const rig=()=>ev(()=>{const r=window.__rq.rig;return{a:+r.a.toFixed(2),b:+r.b.toFixed(2),alt:+r.alt.toFixed(1),head:+r.head.toFixed(3),sp:window.__rq.CUR&&window.__rq.CUR.id,era:window.__rq.ERA}});
 const idle=async(ms)=>{await wait(ms||800);for(let i=0;i<60;i++){const t=await ev(()=>!!window.__rq.tw||!!document.querySelector('#load:not(.done)'));if(!t)break;await wait(500)}};
 // screen position of a prox entry if visible
 const screenOf=id=>ev(id=>{const q=window.__rq,sp=q.CUR;const P=sp.prox.find(x=>x.w.id===id&&(!x.hide||!x.hide()));if(!P)return null;const c=(P.c?P.c():P.pos);if(!c)return null;const v=c.clone().project(q.cam);if(v.z>1||Math.abs(v.x)>.95||Math.abs(v.y)>.95)return null;return{x:(v.x*.5+.5)*innerWidth,y:(-v.y*.5+.5)*innerHeight}},id);
 const tapAt=async(x,y)=>{if(MOB)await p.touchscreen.tap(x,y);else await p.mouse.click(x,y)};
 const t0=Date.now();await p.goto('http://x.test/index.html');for(let i=0;i<30;i++){await wait(100);if(await ev(()=>!!(window.__rq&&window.__rq.CUR)))break}
 // ---------- first visit ----------
 await wait(2500);await shot('boot');
 ok('loader visible or done',true);
 await wait(9000);await shot('intro_9s');
 const h1=await ev(()=>document.querySelector('#hint').textContent);ok('first-visit hint text',!!h1,h1);
 await wait(9000);await shot('intro_18s');
 ok('era set to 2 by intro',(await rig()).era===2,await rig());
 await idle(1000);
 if(SUITE.endsWith('quick')){log(errs.join('\n'));await b.close();return}
 // ---------- drag / zoom / rotate / keys ----------
 let r0=await rig();
 if(MOB){await ev(()=>{});const cdp=await ctx.newCDPSession(p);
  const tp=(type,pts)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:pts.map((q,i)=>({x:q[0],y:q[1],id:i}))});
  await tp('touchStart',[[200,500]]);for(let i=1;i<=10;i++){await tp('touchMove',[[200+i*8,500-i*6]]);await wait(30)}await tp('touchEnd',[]);await wait(900);
  let r1=await rig();ok('one-finger drag moves view',Math.abs(r1.a-r0.a)+Math.abs(r1.b-r0.b)>.3,[r0,r1]);
  // pinch in
  await tp('touchStart',[[150,420],[240,420]]);for(let i=1;i<=12;i++){await tp('touchMove',[[150-i*6,420],[240+i*6,420]]);await wait(40)}await tp('touchEnd',[]);await wait(900);
  let r2=await rig();ok('pinch spread zooms in',r2.alt<r1.alt*.9,[r1.alt,r2.alt]);
  await tp('touchStart',[[100,420],[290,420]]);for(let i=1;i<=12;i++){await tp('touchMove',[[100+i*6,420],[290-i*6,420]]);await wait(40)}await tp('touchEnd',[]);await wait(900);
  let r3=await rig();ok('pinch close zooms out',r3.alt>r2.alt*1.1,[r2.alt,r3.alt]);
  // twist
  await tp('touchStart',[[150,420],[240,420]]);for(let i=1;i<=12;i++){const a=i*.06;await tp('touchMove',[[195-45*Math.cos(a),420-45*Math.sin(a)],[195+45*Math.cos(a),420+45*Math.sin(a)]]);await wait(40)}await tp('touchEnd',[]);await wait(600);
  let r4=await rig();ok('two-finger twist rotates',Math.abs(r4.head-r3.head)>.1,[r3.head,r4.head]);
  await ev(()=>{window.__rq.rig.head=0});
 }else{
  await p.mouse.move(550,350);await p.mouse.down();for(let i=1;i<=10;i++){await p.mouse.move(550+i*12,350+i*6);await wait(30)}await p.mouse.up();await wait(900);
  let r1=await rig();ok('drag moves view',Math.abs(r1.a-r0.a)+Math.abs(r1.b-r0.b)>.3,[r0,r1]);
  for(let i=0;i<6;i++){await p.mouse.wheel(0,-240);await wait(60)}await wait(1500);let r2=await rig();ok('wheel zooms in',r2.alt<r1.alt*.8,[r1.alt,r2.alt]);
  for(let i=0;i<6;i++){await p.mouse.wheel(0,240);await wait(60)}await wait(1500);let r3=await rig();ok('wheel zooms out',r3.alt>r2.alt*1.2,[r2.alt,r3.alt]);
  await p.mouse.move(550,350);await p.mouse.down({button:'right'});for(let i=1;i<=8;i++){await p.mouse.move(550+i*15,350);await wait(30)}await p.mouse.up({button:'right'});await wait(300);
  let r4=await rig();ok('right-drag rotates',Math.abs(r4.head-r3.head)>.2,[r3.head,r4.head]);
  await p.keyboard.down('KeyQ');await wait(700);await p.keyboard.up('KeyQ');await p.keyboard.down('KeyW');await wait(700);await p.keyboard.up('KeyW');await p.keyboard.down('KeyR');await wait(600);await p.keyboard.up('KeyR');await wait(600);
  let r5=await rig();ok('keys Q/W/R move',Math.abs(r5.head-r4.head)>.2&&r5.alt<r4.alt,[r4,r5]);
  await ev(()=>{window.__rq.rig.head=0});
  await p.mouse.dblclick(550,330);await idle(800);let r6=await rig();ok('dblclick flies in',r6.alt<r5.alt,[r5.alt,r6.alt]);
 }
 // ---------- time axis ----------
 const ticks=await ev(()=>[...document.querySelectorAll('#time .tk')].map(b=>b.dataset.e));ok('timeline ticks',ticks.length>=10,ticks);

 await click('#time .tk[data-e="3"]');await wait(2500);ok('tick sets era 3',(await rig()).era===3);await shot('era3');
 await click('#time .tk[data-e="5"]');await wait(2500);ok('tick sets era 5',(await rig()).era===5);await shot('era5');
 await click('#time .tk[data-e="2"]');await wait(1500);
 // ---------- labels ----------
 await ev(()=>window.__rq.flyTo(18,-25,3000,.5));await idle(1200);
 const labs=await ev(()=>[...document.querySelectorAll('#labels .lab.on')].map(e=>{const r=e.getBoundingClientRect();return{t:e.textContent,x:r.x+r.width/2,y:r.y+r.height/2}}));ok('continent labels visible',labs.length>0,labs.map(l=>l.t));
 await shot('labels');
 if(labs.length){const L=labs.find(l=>l.x>80&&l.x<VW-80&&l.y>80&&l.y<VH-120)||labs[0];await tapAt(L.x,L.y);await idle(1500);ok('label click opens card',await vis('#cap.on'),L.t);await shot('label_card')}
 // ---------- card ----------
 await ev(()=>window.__rq.go('emeraldcity'));await idle(2500);
 ok('go() opens card',await vis('#cap.on'));const ct=await ev(()=>document.querySelector('#cap h2').textContent);ok('card title',ct.includes('翡翠'),ct);await shot('card_emerald');
 const chs=await ev(()=>document.querySelectorAll('#cap [data-ch]').length);ok('card chapter chips',chs>0,chs);
 const allb=await p.$('#cap [data-allch]');if(allb){await click('#cap [data-allch]');await wait(400);ok('all chapters expand',await ev(()=>!!document.querySelector('#cap .chn')))}
 const nv=await p.$('#cap [data-nav="1"]');if(nv){const before=ct;await click('#cap [data-nav="1"]');await idle(1800);const after=await ev(()=>document.querySelector('#cap h2').textContent);ok('card next',after!==before,[before,after]);await click('#cap [data-nav="-1"]');await idle(1800)}
 const rel=await p.$('#cap [data-rel]');if(rel){const t=await rel.textContent();await click('#cap [data-rel]');await idle(2500);const nt=await ev(()=>document.querySelector('#cap h2')&&document.querySelector('#cap h2').textContent);ok('related link opens other card',!!nt,[t,nt]);await shot('card_rel')}
 // tap a mote in view
 await ev(()=>window.__rq.go('longqimu'));await idle(2500);await click('#cap .x');await wait(500);ok('close × hides card',!(await vis('#cap.on')));
 const near=await ev(()=>{const q=window.__rq,sp=q.CUR;const out=[];for(const P of sp.prox){if(P.hide&&P.hide())continue;if(P.only)continue;const c=P.c?P.c():P.pos;if(!c)continue;const v=c.clone().project(q.cam);if(v.z<1&&Math.abs(v.x)<.7&&Math.abs(v.y)<.6)out.push({id:P.w.id,x:(v.x*.5+.5)*innerWidth,y:(-v.y*.5+.5)*innerHeight})}return out.slice(0,6)});
 ok('entries pickable in view',near.length>0,near.map(n=>n.id));
 if(near.length){await tapAt(near[0].x,near[0].y);await idle(1500);const op=await vis('#cap.on');ok('tap on entry opens card',op,near[0].id);await shot('tap_card')}
 if(!MOB){await p.keyboard.press('Escape');await wait(400);ok('Esc closes card',!(await vis('#cap.on')))}else{await click('#cap .x');await wait(300)}
 // hover
 if(!MOB&&near.length){await p.mouse.move(near[0].x+1,near[0].y+1);await wait(700);ok('hover label shows',await vis('#hover.on'),await ev(()=>document.querySelector('#hover').textContent));await shot('hover')}
 // ---------- library ----------
 await click('#book');await wait(800);ok('library opens',await vis('#lib.on'));await shot('lib_ent');
 const g=await p.$('#libbody [data-g="void"]');if(g){await click('#libbody [data-g="void"]');await wait(500);ok('group expands',await ev(()=>document.querySelectorAll('#libbody [data-id]').length>20))}
 await p.fill('#q','琳');await wait(600);const nq=await ev(()=>document.querySelectorAll('#libbody [data-id]').length);ok('search finds 琳',nq>0,nq);await shot('lib_search');
 await p.fill('#q','');await wait(300);
 for(const t of['arc','ch','side','egg']){await click(`#lib nav [data-t="${t}"]`);await wait(700);const n=await ev(()=>document.querySelector('#libbody').children.length);ok('lib tab '+t,n>0,n);await shot('lib_'+t)}
 // tour: start from the story tab, it shows its panel, then stop it and reopen the library
 await click('#lib nav [data-t="arc"]');await wait(500);await click('#libbody .tourall');await wait(2500);ok('tour starts',await vis('#tour.on'),await ev(()=>window.__rq.TVS.i));await shot('tour');await ev(()=>window.__rq.tourStop());await wait(400);if(!(await vis('#lib.on'))){await click('#book');await wait(700)}
 // chapter tab: expand era and open
 await click('#lib nav [data-t="ch"]');await wait(500);await click('#libbody [data-ce="2"]');await wait(500);
 const row=await p.$('#libbody [data-rch]');if(row){await row.click();await wait(1500);ok('chapter row opens reader',await vis('#rd.on'));await shot('reader_noTxt')}
 // ---------- reader ----------
 if(await vis('#rd.on')){
  const eb1=await ev(()=>document.querySelector('#rd .eb').textContent);await click('#rd [data-rs="1"]');await wait(800);const eb2=await ev(()=>document.querySelector('#rd .eb').textContent);ok('reader next chapter',eb1!==eb2,[eb1,eb2]);
  const fi=await p.$('#rd input[type=file]');if(fi){await fi.setInputFiles(CLEAN);for(let i=0;i<30;i++){await p.waitForTimeout(500);await wait(100);if(await ev(()=>!!document.querySelector('#rd .txt')))break}ok('load txt shows text',await ev(()=>!!document.querySelector('#rd .txt')));await shot('reader_txt')}
  await click('#rd [data-rs="1"]');await wait(800);ok('next keeps text',await ev(()=>!!document.querySelector('#rd .txt')));
  const tocb=await p.$('#rd [data-toc]');if(tocb){await click('#rd [data-toc]');await wait(600);ok('toc page opens',await ev(()=>document.querySelectorAll('#rd ol.toc li').length>50));await shot('reader_toc');await click('#rd [data-tocback]');await wait(600);ok('toc back to chapter',await ev(()=>!!document.querySelector('#rd .txt')))}
  const nm=await p.$('#rd [data-nm]');ok('inline entry names in text',!!nm);
  if(nm){await nm.click();await idle(2500);ok('inline name goes to entry',await vis('#cap.on'),await ev(()=>document.querySelector('#cap h2').textContent));await shot('reader_nm')}
  if(await vis('#rd.on'))await click('#rd .x');await wait(400);ok('reader closes',!(await vis('#rd.on')));
 }
 // card chapter chip -> reader with back
 await ev(()=>window.__rq.go('naodai'));await idle(2500);if(await p.$('#cap [data-ch]')){await click('#cap [data-ch]');await wait(1500);ok('card chip opens reader text',await ev(()=>!!document.querySelector('#rd .txt')));await shot('chip_reader');
  const bk=await p.$('#rd [data-back]');if(bk){await click('#rd [data-back]');await wait(800);ok('back returns to card',await vis('#cap.on')&&!(await vis('#rd.on')))}}
 // where link
 await ev(()=>window.__rq.go('emeraldcity'));await idle(2000);await click('#cap [data-ch]');await wait(1200);const gp=await p.$('#rd [data-gp]');if(gp){await click('#rd [data-gp]');await idle(3000);ok('reader place link flies',true,await rig());await shot('reader_gp')}
 if(await vis('#rd.on'))await click('#rd .x');
 // ---------- side stories ----------
 await click('#book');await wait(600);await click('#lib nav [data-t="side"]');await wait(500);await click('#libbody [data-side="__rand"]');await idle(4000);
 ok('random side opens',await ev(()=>!!document.querySelector('#cap.on .sidenote')));await shot('side_rand');
 const s1=await ev(()=>document.querySelector('#cap h2').textContent);await click('#cap [data-sn="1"]');await idle(4000);const s2=await ev(()=>document.querySelector('#cap h2')&&document.querySelector('#cap h2').textContent);ok('side next',s1!==s2,[s1,s2]);
 await click('#cap [data-rel]');await idle(2500);ok('side back to place opens entry',await ev(()=>!!document.querySelector('#cap.on')&&!document.querySelector('#cap .sidenote')));
 // ---------- arcs ----------
 if(!(await vis('#lib.on'))){await click('#book');await wait(600)}await click('#lib nav [data-t="arc"]');await wait(500);await click('#libbody [data-i="12"]');await idle(9000);{const r=await rig();ok('arc 12 goes to vol3 space',r&&r.era>=6,r)};await shot('arc12');
 // ---------- spaces: exit to void, portal in ----------
 if(await vis('#lib.on')){await click('#book');await wait(500)}if(await vis('#cap.on'))await ev(()=>{const x=document.querySelector('#cap .x');x&&x.click()});await ev(()=>window.__rq.enterSpace('rongqiu'));await wait(6000);
 await ev(()=>{const q=window.__rq;q.place(18,-25,4800)});await wait(500);
 if(MOB){await ev(()=>window.__rq.exitToVoid())}else{{const vp=p.viewportSize();log('UNDER '+await ev(()=>{const e=document.elementFromPoint(innerWidth/2,innerHeight/2);return e&&(e.id||e.tagName)}));await p.mouse.move(vp.width/2,vp.height/2)}for(let i=0;i<14;i++){await p.mouse.wheel(0,240);await wait(80)}}
 await wait(9000);ok('zoom out leaves to void',(await rig()).sp==='void',await rig());await shot('void');
 // void: click ximin portal
 const xs=await screenOf('ximin')||await ev(()=>{const q=window.__rq;const P=q.CUR.prox.find(x=>x.w.go==='ximin');return P?'exists':null});ok('ximin portal present',!!xs,xs);
 await ev(()=>window.__rq.go('xm_planet')).catch(()=>{});await wait(9000);await shot('ximin');
 for(const id of['void','erxi','dream','midgard','tunnel','buke','under']){await ev(id=>window.__rq.enterSpace(id),id);await wait(id==='void'?5000:9000);const r=await rig();ok('enter '+id,r.sp===id,r);await shot('sp_'+id);
  if(id!=='under'){const tk=await ev(()=>[...document.querySelectorAll('#time .tk')].map(b=>+b.dataset.e));if(tk.length>1){await click(`#time .tk[data-e="${tk[tk.length-1]}"]`);await idle(3000);ok('space timeline '+id,(await rig()).era===tk[tk.length-1],await rig());await shot('sp_'+id+'_late')}}}
 // resize
 if(!MOB){await p.setViewportSize({width:760,height:900});await wait(1500);await shot('resize_narrow');await p.setViewportSize({width:VW,height:VH});await wait(800)}
 log('elapsed',Date.now()-t0);
 log('ERRORS:\n'+errs.join('\n'));
 await b.close()})();
