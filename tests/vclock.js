// injected before the page loads: a virtual clock so every frame of the film is rendered at an exact time,
// however slow the software renderer is. time only moves when window.__step(ms) is called.
(()=>{
 let vt=0;const T0=Date.now();const rafQ=[];let rafId=1;const timers=new Map();let tid=1;
 const _perf=performance.now.bind(performance);
 performance.now=()=>vt;Date.now=()=>T0+vt;
 window.requestAnimationFrame=cb=>{const id=rafId++;rafQ.push([id,cb]);return id};
 window.cancelAnimationFrame=id=>{const i=rafQ.findIndex(x=>x[0]===id);if(i>=0)rafQ.splice(i,1)};
 const _st=window.setTimeout,_si=window.setInterval;
 window.setTimeout=(fn,ms,...a)=>{const id=tid++;timers.set(id,{at:vt+(+ms||0),fn,a,iv:0});return id};
 window.setInterval=(fn,ms,...a)=>{const id=tid++;timers.set(id,{at:vt+(+ms||0),fn,a,iv:Math.max(1,+ms||1)});return id};
 window.clearTimeout=window.clearInterval=id=>{timers.delete(id)};
 const anims=new WeakMap();
 function syncAnims(){try{for(const a of document.getAnimations()){let s=anims.get(a);if(s===undefined){s=vt-(a.currentTime||0);anims.set(a,s);a.pause()}a.currentTime=Math.max(0,vt-s)}}catch(e){}}
 function runTimers(){for(let guard=0;guard<500;guard++){let best=null,bid=0;for(const [id,t] of timers)if(t.at<=vt&&(!best||t.at<best.at)){best=t;bid=id}if(!best)break;
   if(best.iv)best.at+=best.iv;else timers.delete(bid);try{typeof best.fn==='function'?best.fn(...best.a):eval(best.fn)}catch(e){console.error('timer',e&&e.message)}}}
 window.__step=(ms)=>{const sub=Math.ceil(ms/50);for(let i=0;i<sub;i++){vt+=ms/sub;runTimers()}const q=rafQ.splice(0);for(const [id,cb] of q){try{cb(vt)}catch(e){console.error('raf',e&&e.message,e&&e.stack)}}syncAnims();return vt};
 window.__vt=()=>vt;
})();
