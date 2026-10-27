/* ================================================================
   sound: every world hums its own tune, made live in the browser (no audio files).
   music is generative and regional: strings or voices under a flowing piano or harp, a singing line
   (flute, violin, dizi, erhu, shakuhachi...) that writes eight-bar phrases, and only a touch of percussion. small sounds answer what you touch.
   it starts on the first touch or key (browsers require that), and the corner switch remembers.
   ================================================================ */
const SND={on:store.get('rq_snd',true),ctx:null,master:null,mus:null,fx:null,rev:null,noise:null,layer:null,key:'',last:{},lastAny:0,iv:0};
const sndNow=()=>SND.vt!==undefined?SND.vt:SND.ctx.currentTime;
const mtof=m=>440*Math.pow(2,(m-69)/12);
// scales, as semitone steps from the root
const ION=[0,2,4,5,7,9,11],LYD=[0,2,4,6,7,9,11],MIX=[0,2,4,5,7,9,10],DOR=[0,2,3,5,7,9,10],AEO=[0,2,3,5,7,8,10],YO=[0,2,5,7,9],HIJ=[0,1,4,5,7,8,10];
// bass: [step, scale-step above chord root, length in steps]; one bar is 8 eighths (6 in three-four)
const BP={whole:[[0,0,8]],half:[[0,0,4],[4,4,4]],walk:[[0,0,4],[4,4,2],[6,2,2]],waltz:[[0,0,6]],waltz2:[[0,0,3],[3,4,3]],dot:[[0,0,3],[3,4,5]]};
// broken chords: scale steps above the chord root (7 = octave), null = rest
const AP={flow:[0,4,7,9,11,9,7,4],flow6:[0,4,7,9,7,4],rise:[0,2,4,7,9,11,14,11],sparse:[0,null,7,null,9,null,7,null],sparse6:[0,null,7,null,9,null],wide:[0,7,null,9,4,null,11,null],pairs:[null,7,9,null,null,7,11,null]};
/* each place in its own regional voice: graceful, nimble, calm. strings underneath, a flowing piano or harp, a singing line on top */
const MOODS={
 // 绒球, by era
 ocean:{gain:0.61,root:62,sc:LYD,bpm:92,meter:6,prog:[0,4,5,3],pad:{t:'strings',v:.022,color:1},bass:{t:'cello',p:'waltz',v:0.035},arp:{t:'harp',p:'flow6',o:0,v:.03},lead:{t:'celesta',o:7,v:.04,d:.75},lead2:{t:'flute',o:7,v:.04,d:.7},perc:{sh:['..x..x',.008]},bub:.25,bed:{k:'sea',v:.012,cut:450}},
 north:{gain:0.59,root:65,sc:LYD,bpm:84,prog:[0,3,4,0,5,3,1,4],pad:{t:'strings',v:.022,color:1},bass:{t:'cello',p:'half',v:0.035},arp:{t:'piano',p:'flow',o:0,v:.032},lead:{t:'flute',o:7,v:.045,d:.7},lead2:{t:'violin',o:7,v:.034,d:.7},perc:{fr:['x.......',.03]},gliss:1,bed:{k:'wind',v:.006,cut:900}},
 dino:{gain:0.62,root:62,sc:ION,peek:'guzheng',bpm:80,prog:[0,5,3,4],pad:{t:'strings',v:.02},bass:{t:'cello',p:'dot',v:0.035},arp:{t:'guzheng',p:'sparse',o:0,v:.045},lead:{t:'dizi',o:7,v:.045,d:.65,pent:1},lead2:{t:'erhu',o:7,v:.034,d:.6,pent:1},perc:{fr:['x...x...',.026],wb:['......x.',.012]},bed:{k:'jungle',v:.004,cut:1800}},
 snow:{gain:0.74,root:62,sc:DOR,bpm:72,prog:[0,6,5,3],pad:{t:'choir',v:.02},bass:{t:'cello',p:'whole',v:0.032},arp:{t:'celesta',p:'wide',o:7,v:.026},lead:{t:'violin',o:7,v:.034,d:.6},lead2:{t:'celesta',o:7,v:.034,d:.6},perc:{ch:['x.......',.008]},bed:{k:'wind',v:.008,cut:1300}},
 sky:{gain:0.67,root:64,sc:LYD,bpm:76,prog:[0,1,4,3],pad:{t:'choir',v:.018,color:1},bass:{t:'cello',p:'half',v:0.028},arp:{t:'harp',p:'rise',o:0,v:.028},lead:{t:'flute',o:7,v:.042,d:.65},lead2:{t:'violin',o:7,v:.032,d:.65},gliss:1,bed:{k:'air',v:.004,cut:2600}},
 orbit:{gain:0.83,root:60,sc:LYD,bpm:64,prog:[0,1,3,4],pad:{t:'strings',v:.022,color:1},bass:{t:'cello',p:'whole',v:0.028},arp:{t:'piano',p:'sparse',o:0,v:.03},lead:{t:'celesta',o:7,v:.032,d:.45}},
 // other worlds
 void:{gain:0.73,root:61,sc:LYD,bpm:70,prog:[0,4,1,5],pad:{t:'choir',v:.02,color:1},bass:{t:'cello',p:'whole',v:0.029},arp:{t:'piano',p:'flow',o:0,v:.03},lead:{t:'violin',o:7,v:.032,d:.55},lead2:{t:'celesta',o:14,v:.026,d:.5},shim:1},
 dream:{gain:0.66,root:67,sc:LYD,bpm:84,meter:6,prog:[0,1,5,4],pad:{t:'strings',v:.02,color:1},bass:{t:'cello',p:'waltz',v:0.032},arp:{t:'harp',p:'flow6',o:0,v:.03},lead:{t:'flute',o:7,v:.042,d:.7},lead2:{t:'celesta',o:7,v:.035,d:.7},gliss:1},
 buke:{gain:1.09,root:63,sc:LYD,peek:'pizz',bpm:92,prog:[0,5,1,4],pad:{t:'strings',v:.018},bass:{t:'pizz',p:'walk',v:.06},arp:{t:'pizz',p:'pairs',o:7,v:.03},lead:{t:'oboe',o:7,v:.032,d:.7},lead2:{t:'flute',o:7,v:.04,d:.7},perc:{sh:['.x.x.x.x',.006]}},
 tube:{gain:0.67,root:62,sc:YO,peek:'koto',bpm:76,prog:[0,3,1,0],pad:{t:'strings',v:.018},bass:{t:'cello',p:'dot',v:0.032},arp:{t:'koto',p:'sparse',o:0,v:.045},lead:{t:'shaku',o:5,v:.045,d:.55},lead2:{t:'koto',o:5,v:.04,d:.6},perc:{fr:['x.......',.024],wb:['....x...',.01]}},
 white:{gain:0.93,root:69,sc:ION,bpm:66,prog:[0,3,5,4],pad:{t:'strings',v:.016,color:1},bass:{t:'cello',p:'whole',v:0.025},arp:{t:'piano',p:'wide',o:0,v:.028},lead:{t:'celesta',o:7,v:.03,d:.45},bed:{k:'sand',v:.003,cut:3200}},
 erxi:{gain:0.58,root:62,sc:LYD,bpm:88,prog:[0,4,5,3,0,5,1,4],pad:{t:'strings',v:.022,color:1},bass:{t:'cello',p:'walk',v:0.035},arp:{t:'piano',p:'flow',o:0,v:.03},lead:{t:'violin',o:7,v:.035,d:.7},lead2:{t:'flute',o:7,v:.042,d:.7},perc:{fr:['x...x...',.024],sh:['..x...x.',.006]},gliss:1},
 ximin:{gain:1.45,root:60,sc:ION,bpm:100,prog:[0,5,3,4],pad:{t:'strings',v:.018,color:1},bass:{t:'pizz',p:'walk',v:.06},arp:{t:'celesta',p:'flow',o:7,v:.022},lead:{t:'violin',o:7,v:.032,d:.7},lead2:{t:'oboe',o:7,v:.03,d:.7},perc:{tk:['x.x.x.x.',.006]}},
 // the worlds of 始境: glassy and bright, soft and pink, dark red and heavy
 jing:{gain:0.86,root:71,sc:LYD,bpm:70,prog:[0,4,1,5],pad:{t:'strings',v:.016,color:1},bass:{t:'cello',p:'whole',v:0.026},arp:{t:'celesta',p:'rise',o:0,v:.026},lead:{t:'flute',o:7,v:.036,d:.6},lead2:{t:'celesta',o:14,v:.024,d:.5},shim:1},
 biao:{gain:0.7,root:65,sc:ION,bpm:80,meter:6,prog:[0,5,3,4],pad:{t:'choir',v:.018,color:1},bass:{t:'cello',p:'waltz',v:0.03},arp:{t:'harp',p:'flow6',o:0,v:.03},lead:{t:'flute',o:7,v:.04,d:.7},lead2:{t:'violin',o:7,v:.032,d:.65}},
 qishi:{gain:0.7,root:57,sc:AEO,bpm:66,prog:[0,5,6,4],pad:{t:'strings',v:.018},bass:{t:'cello',p:'dot',v:0.034},arp:{t:'piano',p:'sparse',o:0,v:.03},lead:{t:'ney',o:7,v:.04,d:.55},perc:{tb:['x...x...',.014]}},
 rongui:{gain:0.66,root:55,sc:HIJ,peek:'harp',bpm:72,prog:[0,6,5,0],pad:{t:'strings',v:.02},bass:{t:'cello',p:'dot',v:0.036},arp:{t:'guzheng',p:'sparse',o:0,v:.04},lead:{t:'ney',o:7,v:.042,d:.55},perc:{tb:['x..x..x.',.018]}},
 painbus:{gain:0.68,root:56,sc:AEO,bpm:62,prog:[0,5,3,4],pad:{t:'choir',v:.018},bass:{t:'cello',p:'whole',v:0.032},arp:{t:'piano',p:'sparse6',o:0,v:.028},lead:{t:'erhu',o:7,v:.036,d:.6},meter:6},
 amber:{gain:0.72,root:64,sc:MIX,bpm:84,meter:6,prog:[0,4,5,3],pad:{t:'strings',v:.02,color:1},bass:{t:'cello',p:'waltz',v:0.032},arp:{t:'harp',p:'flow6',o:0,v:.03},lead:{t:'oboe',o:7,v:.034,d:.7},lead2:{t:'celesta',o:7,v:.03,d:.6}},
 doom:{gain:0.7,root:62,sc:DOR,bpm:76,prog:[0,6,5,3],pad:{t:'strings',v:.02},bass:{t:'cello',p:'half',v:0.032},arp:{t:'harp',p:'wide',o:0,v:.03},lead:{t:'oboe',o:7,v:.036,d:.6},lead2:{t:'celesta',o:7,v:.03,d:.55},perc:{fr:['x.......',.02]}},
 mudsea:{gain:0.74,root:59,sc:LYD,bpm:64,prog:[0,1,4,5],pad:{t:'choir',v:.02,color:1},bass:{t:'cello',p:'whole',v:0.03},arp:{t:'harp',p:'sparse',o:0,v:.03},lead:{t:'shaku',o:7,v:.04,d:.6},gliss:1},
 cave:{gain:0.68,root:62,sc:HIJ,peek:'harp',bpm:76,prog:[0,6,5,0],pad:{t:'strings',v:.018},bass:{t:'cello',p:'dot',v:0.032},arp:{t:'guzheng',p:'sparse',o:0,v:.04},lead:{t:'ney',o:7,v:.042,d:.55},perc:{tb:['x..x..x.',.016]},drip:.4}
};
function moodKey(){if(!CUR)return'';const id=CUR.id;
 if(id==='rongqiu'){if(rig.alt>3600)return'orbit';return ERA===1?'ocean':ERA===2?'north':ERA===3?'dino':ERA===4?'snow':'sky'}
 return{void:'void',dream:'dream',buke:'buke',midgard:'tube',tunnel:'white',erxi:'erxi',ximin:'ximin',under:'cave',jing:'jing',biao:'biao',qishi:'qishi',rongui:'rongui',painbus:'painbus',amber:'amber',doom:'doom',rqdream:'dream',mudsea:'mudsea',piaofu:'void',phoenix:'jing',starbus:'qishi',order:'cave',zhimeng:'painbus',huhe:'biao',lianjie:'buke',hope:'dream'}[id]||'void'}
function sndInit(){if(SND.ctx)return true;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return false;let c;try{c=new AC()}catch(e){return false}SND.ctx=c;
 const comp=c.createDynamicsCompressor();comp.threshold.value=-16;comp.ratio.value=3;comp.connect(c.destination);
 SND.master=c.createGain();SND.master.gain.value=0;SND.master.connect(comp);
 SND.mus=c.createGain();SND.mus.gain.value=3;SND.mus.connect(SND.master);SND.fx=c.createGain();SND.fx.gain.value=2.2;SND.fx.connect(SND.master);
 // a soft concert-hall tail: long enough to bloom, filtered so it never hisses
 const L=c.sampleRate*2.6,ir=c.createBuffer(2,L,c.sampleRate);for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);let lp=0;for(let i=0;i<L;i++){lp=lp*.55+(Math.random()*2-1)*.45;d[i]=lp*Math.pow(1-i/L,3.4)*(i<c.sampleRate*.012?i/(c.sampleRate*.012):1)}}
 SND.rev=c.createConvolver();SND.rev.buffer=ir;const rg=c.createGain();rg.gain.value=.55;const rl=c.createBiquadFilter();rl.type='lowpass';rl.frequency.value=5000;SND.rev.connect(rl);rl.connect(rg);rg.connect(SND.master);
 const nb=c.createBuffer(1,c.sampleRate*3,c.sampleRate),nd=nb.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;SND.noise=nb;
 // the beds under the music: if anything about them fails on some browser, the music still plays
 try{ambInit()}catch(e){console.warn('ambience',e);SND.amb=null}
 SND.iv=setInterval(sndTick,100);document.addEventListener('visibilitychange',()=>{if(!SND.ctx)return;if(document.hidden)SND.ctx.suspend();else if(SND.on)SND.ctx.resume()});
 return true}
function sndUnlock(){if(!SND.on)return;if(!sndInit())return;if(SND.ctx.state!=='running')SND.ctx.resume();const t=sndNow();SND.master.gain.cancelScheduledValues(t);SND.master.gain.setTargetAtTime(.9,t,.6)}
['pointerdown','keydown','touchstart','touchend','click'].forEach(t=>addEventListener(t,sndUnlock,{passive:true,capture:true}));
/* ---- instruments ---- */
function vEnv(g,t,a,peak,dec,hold){g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(peak,t+a);if(hold)g.gain.setValueAtTime(peak,t+a+hold);g.gain.setTargetAtTime(0,t+a+(hold||0),dec/4)}
// sustained instruments hold for the note's length and then let go; plucked and struck ones just ring out
const SUS=new Set(['strings','choir','cello','flute','dizi','erhu','violin','oboe','shaku','ney']);
const DEC={piano:2.2,harp:1.8,celesta:1.6,guzheng:1.5,koto:1.1,pizz:.35,marimba:.6,bell:1.2,strings:1.4,choir:1.6,cello:.6,flute:.5,dizi:.45,erhu:.5,violin:.55,oboe:.4,shaku:.6,ney:.6,sine:.5,triangle:.5,kalimba:.8,box:.9};
const ATK={strings:.6,choir:.8,cello:.07,flute:.07,dizi:.05,erhu:.09,violin:.1,oboe:.05,shaku:.12,ney:.1};
function voice(dest,type,f,t,v,dec,o){o=o||{};const c=SND.ctx;if(dec==null)dec=DEC[type]||.5;const g=c.createGain();const a=o.a||ATK[type]||.004;let end=t+a+(o.hold||0)+dec*1.6+.1;
 const mk=(tp,fr,gn,det)=>{if(fr>15000||fr<16)return null;const s=c.createOscillator();s.type=tp;
  if(o.bend){s.frequency.setValueAtTime(fr*o.bend,t);s.frequency.exponentialRampToValueAtTime(fr,t+(o.bendT||.09))}else s.frequency.setValueAtTime(fr,t);
  if(o.glide)s.frequency.exponentialRampToValueAtTime(fr*o.glide,t+dec);s.detune.value=(o.det||0)+(det||0);const gg=c.createGain();gg.gain.value=gn;s.connect(gg);gg.connect(g);s.start(t);s.stop(end);return s};
 const vib=(oscs,rate,depth,delay)=>{const lf=c.createOscillator();lf.frequency.value=rate;const lg=c.createGain();lg.gain.setValueAtTime(0,t);lg.gain.linearRampToValueAtTime(depth,t+(delay||.3));lf.connect(lg);for(const s of oscs)if(s)lg.connect(s.frequency);lf.start(t);lf.stop(end)};
 const breath=(amt,fc)=>{const s=noiseSrc(t,end);const fl=c.createBiquadFilter();fl.type='bandpass';fl.frequency.value=fc;fl.Q.value=1.4;const bg=c.createGain();bg.gain.value=amt;s.connect(fl);fl.connect(bg);bg.connect(g)};
 let fenv=null,cut=o.cut,q=.7;
 switch(type){
  case'piano':mk('sine',f,1);mk('sine',f*2.002,.32);mk('sine',f*3.005,.1);mk('triangle',f,.12);fenv=[f*9,f*2.5];break;
  case'harp':mk('triangle',f,.8);mk('sine',f,.5);mk('sine',f*2,.14);fenv=[f*8,f*2];break;
  case'celesta':mk('sine',f,1);mk('sine',f*4,.12);mk('sine',f*2,.05);break;
  case'guzheng':{o.bend=o.bend||1.012;mk('sawtooth',f,.35);mk('triangle',f,.7);mk('sine',f*2,.12);fenv=[f*7,f*1.6];break}
  case'koto':{o.bend=o.bend||1.008;mk('sawtooth',f,.3);mk('triangle',f,.7);fenv=[f*9,f*1.8];break}
  case'pizz':mk('triangle',f,1);mk('sine',f*2,.18);cut=cut||2200;break;
  case'marimba':mk('sine',f,1);mk('sine',f*4,.14);break;
  case'strings':{const L=[mk('sawtooth',f,.34,-7),mk('sawtooth',f,.34,0),mk('sawtooth',f,.34,7)];vib(L,4.8,f*.003,.8);cut=cut||Math.min(2400,f*4+400);break}
  case'choir':{const L=[mk('sawtooth',f,.3,-5),mk('sawtooth',f,.3,5),mk('triangle',f,.5)];vib(L,4.4,f*.003,.8);cut=cut||1100;q=2.5;break}
  case'cello':{const L=[mk('sawtooth',f,.45),mk('sine',f,.8)];vib(L,4.6,f*.003,.4);cut=cut||Math.min(900,f*5);break}
  case'violin':{const L=[mk('sawtooth',f,.5),mk('sawtooth',f,.3,4)];vib(L,5.4,f*.006,.25);cut=cut||Math.min(3400,f*5);q=1.2;break}
  case'oboe':{const L=[mk('sawtooth',f,.35),mk('square',f,.12)];vib(L,5.2,f*.004,.3);cut=cut||Math.min(2600,f*4);q=3;break}
  case'flute':{const s=mk('sine',f,1);mk('triangle',f,.12);vib([s],5.2,f*.006,.35);breath(.05,f*2);break}
  case'dizi':{o.bend=o.bend||.97;o.bendT=.12;const s=mk('sine',f,1);mk('triangle',f*2,.06);vib([s],5.8,f*.009,.3);breath(.08,f*2.5);break}
  case'shaku':{o.bend=o.bend||.96;o.bendT=.2;const s=mk('sine',f,1);mk('triangle',f,.1);vib([s],4.6,f*.007,.45);breath(.14,f*1.6);break}
  case'ney':{o.bend=o.bend||.98;o.bendT=.15;const s=mk('sine',f,1);mk('sine',f*2,.08);vib([s],5,f*.006,.35);breath(.12,f*1.8);break}
  case'erhu':{o.bend=o.bend||.97;o.bendT=.14;const L=[mk('sawtooth',f,.5),mk('sine',f,.4)];vib(L,6,f*.01,.2);cut=cut||Math.min(2600,f*4);q=2;break}
  case'bell':{const car=mk('sine',f,1);if(!car)return g;const m=c.createOscillator();m.frequency.value=Math.min(15000,f*3.5);const mg=c.createGain();mg.gain.setValueAtTime(f*.6,t);mg.gain.setTargetAtTime(0,t,dec/6);m.connect(mg);mg.connect(car.frequency);m.start(t);m.stop(end);break}
  case'kalimba':mk('sine',f,1);mk('sine',f*5.1,.1);break;
  case'box':mk('triangle',f,.8);mk('sine',f*3,.12);break;
  default:mk(type,f,1)}
 let node=g;if(cut||fenv){const fl=c.createBiquadFilter();fl.type='lowpass';fl.Q.value=q;if(fenv){fl.frequency.setValueAtTime(Math.min(16000,fenv[0]),t);fl.frequency.exponentialRampToValueAtTime(Math.min(16000,fenv[1]),t+dec*.5)}else fl.frequency.value=cut;g.connect(fl);node=fl}
 vEnv(g,t,a,v,dec,o.hold);const pan=c.createStereoPanner?c.createStereoPanner():null;if(pan){pan.pan.value=o.pan||0;node.connect(pan);node=pan}
 node.connect(dest);const rv=o.rev===undefined?.45:o.rev;if(rv){const s=c.createGain();s.gain.value=rv;node.connect(s);s.connect(SND.rev)}return g}
function noiseSrc(t,stop){const c=SND.ctx,s=c.createBufferSource();s.buffer=SND.noise;s.loop=true;s.playbackRate.value=.9+Math.random()*.2;s.start(t,Math.random()*2);if(stop)s.stop(stop);return s}
function nburst(dest,t,v,dur,type,f,q,pan){const c=SND.ctx;const s=noiseSrc(t,t+dur+.05);const fl=c.createBiquadFilter();fl.type=type;fl.frequency.value=f;fl.Q.value=q||.7;const g=c.createGain();g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0008,t+dur);s.connect(fl);fl.connect(g);let n=g;if(c.createStereoPanner){const p=c.createStereoPanner();p.pan.value=pan||0;g.connect(p);n=p}n.connect(dest);const r=c.createGain();r.gain.value=.3;n.connect(r);r.connect(SND.rev)}
function perc(dest,k,t,v){switch(k){
 case'fr':voice(dest,'sine',92,t,v,.5,{glide:.7,rev:.25});nburst(dest,t,v*.25,.12,'lowpass',500,.7,0);break; // soft frame drum
 case'sh':nburst(dest,t,v,.07,'highpass',6500,.7,.3);break;                                      // shaker
 case'wb':voice(dest,'sine',820,t,v,.08,{rev:.3,pan:-.25});break;                                   // wood block
 case'ch':voice(dest,'celesta',2637,t,v,1.4,{rev:.6,pan:.3});break;                                // chime
 case'tk':voice(dest,'sine',2400,t,v,.03,{rev:.15,pan:.35});break;                                  // clockwork tick
 case'tb':voice(dest,'sine',300,t,v,.22,{glide:.82,rev:.25,pan:.15});nburst(dest,t,v*.3,.03,'bandpass',2200,1.2,.15);break}} // tabla-ish
/* ---- a mood is one layer; changing place crossfades two ---- */
function makeLayer(key){const M=MOODS[key];const c=SND.ctx,t=sndNow();const g=c.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(M.gain||1,t+3);g.connect(SND.mus);
 const L={key,M,g,nodes:[],next:t+.3,step:0,S:M.meter||8,phr:null};
 const B=M.bed;if(B){const s=noiseSrc(t);const f=c.createBiquadFilter();f.type=B.k==='sand'||B.k==='air'?'bandpass':'lowpass';f.frequency.value=B.cut;f.Q.value=.5;const bg=c.createGain();bg.gain.value=B.v;s.connect(f);f.connect(bg);bg.connect(g);
  const lfo=c.createOscillator();lfo.frequency.value=B.k==='sea'?.11:.05;const lg=c.createGain();lg.gain.value=B.v*.8;lfo.connect(lg);lg.connect(bg.gain);lfo.start(t);L.nodes.push(s,lfo)}
 return L}
function dropLayer(L){const c=SND.ctx,t=sndNow();L.g.gain.cancelScheduledValues(t);L.g.gain.setValueAtTime(L.g.gain.value,t);L.g.gain.linearRampToValueAtTime(0,t+3);L.dead=true;L.nodes.forEach(n=>{try{n.stop(t+3.5)}catch(e){}});if(SND.vt===undefined)setTimeout(()=>{try{L.g.disconnect()}catch(e){}},4000)}
function setMood(key){if(!SND.ctx||!MOODS[key]||SND.key===key)return;SND.key=key;if(SND.layer)dropLayer(SND.layer);SND.layer=makeLayer(key)}
function note(M,deg,oct){const n=M.sc.length;const o=Math.floor(deg/n);return M.root+M.sc[((deg%n)+n)%n]+12*o+(oct||0)}
const pick=a=>a[(Math.random()*a.length)|0];
// melodic rhythms as [start step, length]; long notes and gentle pickups rather than busy patterns
const RH8=[[[0,3],[3,1],[4,4]],[[0,4],[4,2],[6,2]],[[0,2],[2,2],[4,4]],[[0,6],[6,1],[7,1]],[[2,2],[4,2],[6,2]],[[0,3],[3,3],[6,2]],[[0,2],[2,1],[3,1],[4,4]]];
const RH6=[[[0,4],[4,2]],[[0,2],[2,2],[4,2]],[[0,3],[3,3]],[[0,5],[5,1]],[[2,2],[4,2]]];
const CAD8=[[[0,8]],[[0,4],[4,4]],[[0,6],[6,2]]],CAD6=[[[0,6]],[[0,4],[4,2]]];
function chordAt(M,bar){return M.prog[bar%M.prog.length]}
const rs=(M,d)=>M.sc.length===7?d:Math.round(d*M.sc.length/7); // scale steps written for 7-note modes, refit to 5-note ones
/* an eight-bar tune: a motif, its echo on the next chord, a rise, a resting note; then the same idea answered, often by a second instrument */
function makePhrase(L,bar0){const M=L.M,S=L.S,ld=M.lead;const R=S===6?RH6:RH8,CAD=S===6?CAD6:CAD8;const n=M.sc.length,O=n;
 const A=pick(R),B=pick(R),B2=pick(R),C1=pick(CAD),C2=CAD[0];const rhy=[A,A,B,C1,A,A,B2,C2];const ctr=[O,O+1,O+3,O+1,O,O+2,O+3,O];
 const rest2=!M.lead2&&Math.random()<.35;const ev=[];let cur=O+((Math.random()*3)|0);let motif=null;
 const ok=d=>{if(!ld.pent||n!==7)return d;const m=((d%7)+7)%7;return m===3?d+(Math.random()<.5?-1:1):m===6?d+1:d};
 for(let b=0;b<8;b++){if(b>=4&&rest2)break;const ch=chordAt(M,bar0+b);const t2=rs(M,2),t4=rs(M,4);const tones=[ch,ch+t2,ch+t4,ch+O,ch+O+t2,ch+O+t4];const nearest=x=>tones.reduce((p,q)=>Math.abs(q-x)<Math.abs(p-x)?q:p,tones[0]);
  const notes=rhy[b];const degs=[];
  if((b===1||b===5)&&motif){const sh=nearest(cur+1)-motif[0];for(const d of motif)degs.push(ok(d+sh))}
  else for(let k=0;k<notes.length;k++){let d;
   if(k===0)d=nearest(cur+Math.sign(ctr[b]-cur));
   else if(k===notes.length-1&&b===3)d=pick([ch+t4,ch+O+1,ch+t2+O]); // the first half ends on an open note: a question
   else if(k===notes.length-1&&b===7)d=nearest(ch+O);          // the second half answers it
   else if(k===1&&(b===0||b===4)&&Math.random()<.6)d=cur+pick([3,4,4,2]); // a curious upward leap at the start
   else{let st=Math.random()<.18?pick([3,-2,4]):pick([-1,1,1,-1,2,-2]);if(Math.abs(cur-ctr[b])>2)st=Math.sign(ctr[b]-cur)*Math.abs(st);d=cur+st}
   d=ok(Math.max(O-3,Math.min(O*2+1,d)));degs.push(d);cur=d}
  if(b===0||b===4)motif=degs.slice();cur=degs[degs.length-1];
  notes.forEach(([s0,len],k)=>{if(k>0&&k<notes.length-1&&Math.random()>ld.d+.2&&ev.length){ev[ev.length-1].len+=len;return}ev.push({s:b*S+s0,d:degs[k],len,inst:b>=4&&M.lead2?M.lead2:ld})})}
 const map={};for(const e of ev)map[e.s]=e;return map}
function schedule(L,t){const M=L.M,S=L.S,step=60/M.bpm/2,i=L.step%S,bar=Math.floor(L.step/S);const ch=chordAt(M,bar);const G=L.g;
 const tt=t+(Math.random()-.5)*.01;
 if(i===0&&bar%8===0)L.phr=makePhrase(L,bar);
 // strings or voices hold the chord for the bar
 if(M.pad&&i===0){const P=M.pad;const n=M.sc.length;const V=[ch-n,ch,ch+rs(M,2),ch+rs(M,4)];if(P.color)V.push(ch+rs(M,8));for(const d of V)voice(G,P.t,mtof(note(M,d,0)),t,P.v*(d<ch?.7:1),1.4,{hold:step*S*.9,pan:(d-ch)*.08,rev:.6})}
 const bs=M.bass;if(bs){for(const [s0,off,len] of BP[bs.p])if(s0===i){const sus=SUS.has(bs.t);voice(G,bs.t,mtof(note(M,ch+rs(M,off),M.root>=60?-24:-12)),tt,bs.v,sus?.6:null,{hold:sus?len*step*.85:0,rev:.25})}}
 const ar=M.arp;if(ar){const pat=AP[ar.p];const off=pat[i%pat.length];if(off!=null){const acc=i===0?1:i%2?.7:.85;voice(G,ar.t,mtof(note(M,ch+rs(M,off),ar.o?12:0)),tt,ar.v*acc,null,{rev:.5,pan:(off-6)*.05})}}
 const e=L.phr&&L.phr[(bar%8)*S+i];if(e){const I=e.inst;const sus=SUS.has(I.t);const oc=I.o>=14?24:I.o>=7?12:I.o>=5?12:0;voice(G,I.t,mtof(note(M,e.d,0)+oc-12),tt,I.v*(i===0?1:.9),null,{hold:sus?e.len*step*.88:0,rev:.55,pan:.08})}
 if(i===S-2&&bar%4===3&&Math.random()<.7){const pk=M.peek||'celesta';const base=ch+rs(M,4)+7;[0,1,3].forEach((k,j)=>voice(G,pk,mtof(note(M,base+k,0)),t+j*step*.5,.012*(j===2?1.2:1),.9,{rev:.7,pan:.4-j*.15}))}
 if(M.gliss&&i===0&&bar%8===7){for(let k=0;k<7;k++)voice(G,'harp',mtof(note(M,ch+k+3,0)),t+step*4+k*.055,.016*(1-k*.08),1.6,{rev:.7,pan:(k-3)*.12})}
 const P=M.perc;if(P)for(const k in P){const [pat,v]=P[k];if(pat[i%pat.length]==='x')perc(G,k,tt,v*(.85+Math.random()*.3))}
 if(M.bub&&Math.random()<M.bub*.25){voice(G,'sine',600+Math.random()*700,t+Math.random()*step,.008,.08,{glide:1.8,pan:(Math.random()-.5)*1.6,rev:.4})}
 if(M.drip&&Math.random()<M.drip*.25)voice(G,'celesta',1800+Math.random()*900,t+Math.random()*step,.008,.6,{pan:(Math.random()-.5)*1.6,rev:.8})
 if(M.shim&&i===0&&bar%2===1)voice(G,'celesta',mtof(note(M,ch+rs(M,4),24)),t+step*2,.006,2.4,{pan:(Math.random()-.5)*1.4,rev:.9})}
function sndTick(){if(!SND.ctx||!SND.on||(!SND.offline&&SND.ctx.state!=='running'))return;if(!SND.offline)try{ambTick()}catch(e){}const k=moodKey();if(k&&k!==SND.key)setMood(k);const L=SND.layer;if(!L)return;if(SND.paused){L.next=sndNow()+.3;return}const st=60/L.M.bpm/2;
 if(L.next<sndNow())L.next=sndNow()+.05;while(L.next<sndNow()+.8){schedule(L,L.next);L.next+=st;L.step++}}
/* ---- small sounds ---- */
function snd(name){if(!SND.on||!SND.ctx||(!SND.offline&&SND.ctx.state!=='running'))return;const c=SND.ctx,t=sndNow()+.01,nw=SND.offline?SND.vt*1000:performance.now();
 const gap={hover:110,tap:60}[name]||140;if(nw-(SND.last[name]||0)<gap)return;if(name!=='hover'&&nw-SND.lastAny<70)return;SND.last[name]=nw;if(name!=='hover')SND.lastAny=nw;
 const M=SND.layer?SND.layer.M:MOODS.sky;const F=SND.fx;const nt=(d,o)=>mtof(note(M,d,o));
 const whoosh=(dur,f0,f1,f2,v)=>{const s=noiseSrc(t,t+dur+.1);const f=c.createBiquadFilter();f.type='bandpass';f.Q.value=1.2;f.frequency.setValueAtTime(f0,t);f.frequency.exponentialRampToValueAtTime(f1,t+dur*.45);f.frequency.exponentialRampToValueAtTime(f2,t+dur);const g=c.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+dur*.4);g.gain.linearRampToValueAtTime(0,t+dur);s.connect(f);f.connect(g);g.connect(F);const r=c.createGain();r.gain.value=.4;g.connect(r);r.connect(SND.rev)};
 switch(name){
  case'hover':voice(F,'sine',nt(4,36),t,.012,.08,{rev:.2});break;
  case'tap':voice(F,'sine',nt(0,36),t,.025,.06,{rev:.1});break;
  case'open':voice(F,'harp',nt(4,12),t,.035,1.2,{rev:.5});voice(F,'celesta',nt(7,12),t+.07,.03,1.2,{rev:.55});break;
  case'close':voice(F,'sine',nt(2,12),t,.035,.25,{glide:.8,rev:.3});break;
  case'page':whoosh(.22,900,3800,1800,.05);break;
  case'era':whoosh(.9,400,3600,900,.04);[0,2,4,7].forEach((d,i)=>voice(F,'harp',nt(d,12),t+.2+i*.08,.03,.9,{rev:.4,pan:(i-1.5)*.3}));break;
  case'enter':whoosh(1.4,200,3200,300,.07);[0,4,7,9].forEach((d,i)=>voice(F,'harp',nt(d,12),t+.3+i*.07,.03,.7,{rev:.4,pan:(i-1.5)*.35}));break;
  case'side':whoosh(.3,1200,4200,2200,.04);[0,2,4,7,9].forEach((d,i)=>voice(F,'celesta',nt(d,12),t+.1+i*.07,.03,.8,{rev:.4,pan:(i-2)*.25}));break;
  case'egg':[0,2,4,7,9,11,14].forEach((d,i)=>voice(F,'celesta',nt(d,24),t+i*.05,.03,.7,{rev:.4,pan:(i-3)*.2}));break;
  case'lib':voice(F,'triangle',nt(0,24),t,.03,.3,{rev:.4});voice(F,'triangle',nt(4,24),t+.05,.02,.3,{rev:.4});break}}
function sndToggle(){SND.on=!SND.on;store.set('rq_snd',SND.on);sndBtn.classList.toggle('off',!SND.on);sndBtn.setAttribute('aria-label',SND.on?'关闭声音':'打开声音');
 if(SND.on){sndUnlock()}else if(SND.ctx){const t=sndNow();SND.master.gain.cancelScheduledValues(t);SND.master.gain.setTargetAtTime(0,t,.25)}hint(SND.on?'声音已打开':'声音已关闭',1400)}
const sndBtn=document.createElement('button');sndBtn.id='snd';sndBtn.className='glass'+(SND.on?'':' off');sndBtn.setAttribute('aria-label',SND.on?'关闭声音':'打开声音');
sndBtn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z"/><path class="w" d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/><path class="m" d="M16 9.5l5 5M21 9.5l-5 5"/></svg>';
sndBtn.addEventListener('click',e=>{e.stopPropagation();sndToggle()});document.body.appendChild(sndBtn);
{const st=document.createElement('style');st.textContent=`#snd{position:fixed;right:max(20px,env(safe-area-inset-right));top:calc(env(safe-area-inset-top,0px) + 18px);z-index:7;width:36px;height:36px;border-radius:50%;display:grid;place-items:center;color:var(--ink);opacity:.55;transition:opacity .3s;border:0;cursor:pointer;padding:0}
#snd:hover{opacity:.95}#snd svg{width:17px;height:17px}#snd .m{display:none}#snd.off .m{display:inline}#snd.off .w{display:none}#snd.off{opacity:.4}
body.pale #snd{background:rgba(255,255,255,.55);color:#1d2328}`;document.head.appendChild(st)}
/* ---- answer what happens ---- */
function open(id){const was=cap.classList.contains('on');openBase(id);snd(was?'page':'open')}
 function closeCap(q){const was=cap.classList.contains('on');closeCapBase(q);if(was&&!q)snd('close')}
 function openSide(id){egz_openSide(id);snd('side')}
 function egg(id,silent){const n=!found.has(id);eggBase(id,silent);if(n&&!silent)snd('egg')}
 function timeTo(e){const p=ERA;timeToBase(e);if(ERA!==p||CUR.type!=='planet')snd('era')}
 function enterSpace(id,opt){const go=CUR&&!busy&&MB[id];q5s_enterSpace(id,opt);if(go)snd('enter')}
 function openRd(k,from){snd('page');return openRdBase(k,from)}
 $('#book').addEventListener('click',()=>snd('lib'));$('#lib nav').addEventListener('click',()=>snd('tap'));
 let snd_hovLast=null;function updateHover(){updateHoverBase();if(hov&&hov!==snd_hovLast)snd('hover');snd_hovLast=hov}
async function sndOffline(dur,plan){const sr=44100;const oc=new OfflineAudioContext(2,Math.ceil(sr*dur),sr);const keep={ctx:SND.ctx,master:SND.master,mus:SND.mus,fx:SND.fx,rev:SND.rev,noise:SND.noise,layer:SND.layer,key:SND.key,on:SND.on,last:SND.last,lastAny:SND.lastAny,iv:SND.iv};
 SND.ctx=null;SND.offline=true;SND.vt=0;SND.on=true;SND.layer=null;SND.key='';SND.last={};SND.lastAny=0;const AC=window.AudioContext;window.AudioContext=function(){return oc};const wk=window.webkitAudioContext;window.webkitAudioContext=null;
 const si=window.setInterval;window.setInterval=()=>0;try{sndInit()}finally{window.AudioContext=AC;window.webkitAudioContext=wk;window.setInterval=si}SND.master.gain.value=.9;
 const P=plan.slice().sort((a,b)=>a.t-b.t);let i=0;
 // schedule a little at a time while rendering, so the graph only ever holds the notes of the next moment
 const run=(t0,t1)=>{for(let t=t0;t<t1;t+=.1){SND.vt=t;while(i<P.length&&P[i].t<=t){const e=P[i++];if(e.mood)setMood(e.mood);if(e.sfx)snd(e.sfx)}const L=SND.layer;if(L){const st=60/L.M.bpm/2;if(L.next<t)L.next=t+.05;while(L.next<t+.3&&L.next<dur){schedule(L,L.next);L.next+=st;L.step++}}}};
 const CH=1;run(0,CH);for(let t=CH;t<dur;t+=CH){const tt=t;oc.suspend(tt-.5).then(()=>{run(tt,Math.min(dur,tt+CH));oc.resume()})}
 if(plan.fadeOut!==false){SND.master.gain.setValueAtTime(.9,Math.max(0,dur-3));SND.master.gain.linearRampToValueAtTime(0,dur)}
 SND.vt=undefined;SND.offline=false;const buf=await oc.startRendering();Object.assign(SND,keep);
 const n=buf.length,L0=buf.getChannelData(0),R0=buf.getChannelData(1);const ab=new ArrayBuffer(44+n*4),dv=new DataView(ab);const ws=(o,str)=>{for(let k=0;k<str.length;k++)dv.setUint8(o+k,str.charCodeAt(k))};
 ws(0,'RIFF');dv.setUint32(4,36+n*4,true);ws(8,'WAVE');ws(12,'fmt ');dv.setUint32(16,16,true);dv.setUint16(20,1,true);dv.setUint16(22,2,true);dv.setUint32(24,sr,true);dv.setUint32(28,sr*4,true);dv.setUint16(32,4,true);dv.setUint16(34,16,true);ws(36,'data');dv.setUint32(40,n*4,true);
 let o=44;for(let k=0;k<n;k++){dv.setInt16(o,Math.max(-1,Math.min(1,L0[k]))*32767,true);dv.setInt16(o+2,Math.max(-1,Math.min(1,R0[k]))*32767,true);o+=4}
 const u8=new Uint8Array(ab);let bin='';for(let k=0;k<u8.length;k+=32768)bin+=String.fromCharCode.apply(null,u8.subarray(k,k+32768));return btoa(bin)}
/* reading the book is quiet: the music fades out while a chapter is open, and comes back after */
function sndPause(on){if(SND.paused===on)return;SND.paused=on;if(!SND.ctx)return;const t=sndNow();const g=SND.mus.gain;g.cancelScheduledValues(t);g.setValueAtTime(g.value,t);g.linearRampToValueAtTime(on?0:3,t+(on?.8:2.5));if(!on&&SND.layer)SND.layer.next=t+.4}
{const rdEl=$('#rd');if(rdEl)new MutationObserver(()=>sndPause(rdEl.classList.contains('on'))).observe(rdEl,{attributes:true,attributeFilter:['class']})}
/* ---- the sound of the place ----
   under the music, beds of filtered noise that never stop: wind (more of it up high), the sea (when there is sea under
   or around you), a town's murmur (near one), the void's low hum, the tube's rumble; and small live things, birds by
   day and insects at night over land, once there is life on land. each bed's loudness follows where you are */
function ambInit(){const c=SND.ctx;const A=SND.amb={g:c.createGain(),b:{},nx:0,bird:0,bug:0,clink:0,k:{}};A.g.gain.value=.17;A.g.connect(SND.master);
 // a longer, softer noise for the beds, so their loop is never heard
 const n=c.sampleRate*9,nb=c.createBuffer(2,n,c.sampleRate);for(let ch=0;ch<2;ch++){const d=nb.getChannelData(ch);let p=0;for(let i=0;i<n;i++){const w=Math.random()*2-1;p=p*.86+w*.14;d[i]=w*.55+p*1.6}}
 const lfo=(f,depth,dest)=>{const o=c.createOscillator();o.frequency.value=f;const d=c.createGain();d.gain.value=depth;o.connect(d);d.connect(dest);o.start(c.currentTime+Math.random()*2)};
 const bed=(name,type,f,q,rate,mods,fmod)=>{const s=c.createBufferSource();s.buffer=nb;s.loop=true;s.playbackRate.value=rate;const fl=c.createBiquadFilter();fl.type=type;fl.frequency.value=f;fl.Q.value=q;
  const m=c.createGain();m.gain.value=1;const out=c.createGain();out.gain.value=0;s.connect(fl);fl.connect(m);m.connect(out);out.connect(A.g);
  for(const [lf,dp] of mods||[])lfo(lf,dp,m.gain);if(fmod)lfo(fmod[0],fmod[1],fl.frequency);s.start(c.currentTime,Math.random()*8);A.b[name]=out};
 bed('wind','bandpass',480,.6,.93,[[.07,.45],[.19,.2]],[.05,200]);
 bed('wave','lowpass',380,.4,.71,[[.12,.55],[.071,.35]],[.12,120]);
 bed('city','bandpass',760,.9,1.07,[[2.3,.25],[4.7,.15],[.31,.2]]);
 bed('rumble','lowpass',95,.9,.83,[[.04,.35]]);
 // the hum: a few slow-beating low tones
 {const out=c.createGain();out.gain.value=0;out.connect(A.g);const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=260;lp.connect(out);
  for(const [f,v] of [[55,.5],[55.35,.4],[82.4,.28],[110.2,.12]]){const o=c.createOscillator();o.type='sine';o.frequency.value=f;const g=c.createGain();g.gain.value=v;lfo(.03+Math.random()*.05,v*.5,g.gain);o.connect(g);g.connect(lp);o.start()}A.b.hum=out}}
function ambNear(sp){const P=sp.townPts;if(!P||!P.length)return 0;const d=dirLL(rig.a,rig.b);let k=0;for(const t of P){if(t.eras&&!t.eras.includes(ERA))continue;const deg=Math.acos(clamp(d.dot(t.d),-1,1))/D2R;k=Math.max(k,sm(t.r*3.2,t.r*.7,deg))}return k}
function ambTargets(){const T={wind:0,wave:0,city:0,rumble:0,hum:0},sp=CUR;let life=0,day=1,land=0;if(!sp)return [T,0,1,0];const alt=rig.alt;
 if(sp.type==='planet'){const orbit=sm(5200,3000,alt);T.wind=(.12+.26*sm(250,2600,alt))*orbit;T.hum=.06*(1-orbit);
  let sea=0;const la=rig.a,lo=rig.b,cs=Math.max(.2,Math.cos(la*D2R));for(const [x,y] of [[0,0],[1.2,0],[-1.2,0],[0,1.2],[0,-1.2]])if(sp.ghRaw(la+x,lo+y/cs)<0)sea+=.2;
  T.wave=.34*sea*sm(1100,60,alt)*(.6+.4*sm(.2,1,sea));land=(1-sea)*sm(700,60,alt);
  T.city=.3*ambNear(sp)*sm(900,40,alt);day=sp.dayK===undefined?1:sp.dayK;
  life=sp.id==='rongqiu'?(ERA>=3?1:0):1;if(sp.id==='rongqiu'&&ERA===4)life=.3}
 else if(sp.id==="void"){T.hum=.2;T.wind=.03}
 // each of the other places sounds like itself: the tunnel's sand hiss, the deep world's stone, the dream's far sea, the unforeseeable land's unsteady air
 else if(sp.id==='tunnel'){T.wind=.16;T.rumble=.1;T.hum=.05}
 else if(sp.id==='under'){T.rumble=.16;T.hum=.1;T.wind=.02}
 else if(sp.id==='dream'){T.wave=.1;T.wind=.05;T.hum=.06}
 else if(sp.id==='buke'){T.wind=.1;T.hum=.12}
 else if(sp.type==='tube'){T.rumble=.42;T.hum=.08;T.wind=.04}
 else{T.hum=.14;T.wind=.06}
 return [T,life*land,day,T.city]}
function ambTick(){const A=SND.amb;if(!A)return;const c=SND.ctx,t=sndNow();const [T,lf,day,city]=ambTargets();const q=SND.paused?0:(document.body.classList.contains('touring')?.8:1);
 for(const k in A.b){const v=(T[k]||0)*q;if(Math.abs((A.k[k]||0)-v)>.004){A.k[k]=v;A.b[k].gain.setTargetAtTime(v,t,1.4)}}
 if(SND.paused||q===0)return;const fx=SND.fx;
 // birds by day, insects at night, the odd clink in a town
 if(lf>.25&&day>.5&&t>A.bird){A.bird=t+2.5+Math.random()*7;const n=2+(Math.random()*4|0),f0=2300+Math.random()*1500,pn=Math.random()*1.6-.8;for(let i=0;i<n;i++){const tt=t+.05+i*(.11+Math.random()*.06);chirp(f0*(1+Math.random()*.15),f0*(1.25+Math.random()*.3),tt,.07+Math.random()*.05,.018*lf,pn)}}
 if(lf>.25&&day<.35&&t>A.bug){A.bug=t+.5+Math.random()*1.1;const f=4100+Math.random()*700,pn=Math.random()*1.6-.8,n=3+(Math.random()*2|0);for(let i=0;i<n;i++)chirp(f,f*1.01,t+.05+i*.055,.025,.011*lf*(1-day),pn)}
 // the dream rings now and then with a far, soft bell
 if(CUR&&CUR.id==='dream'&&t>A.clink){A.clink=t+4+Math.random()*6;const f=[1568,1760,2093,2349][Math.random()*4|0];chirp(f,f,t+.05,1.6,.006,Math.random()*1.2-.6,'sine')}
 if(city>.35&&t>A.clink){A.clink=t+1.5+Math.random()*4;chirp(1900+Math.random()*1400,1900,t+.05,.25,.008*city,Math.random()*1.4-.7,'triangle')}}
function chirp(f0,f1,t,dur,v,pan,type){const c=SND.ctx,o=c.createOscillator(),g=c.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(Math.max(40,f1),t+dur*.7);
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+Math.min(.012,dur*.2));g.gain.exponentialRampToValueAtTime(.0001,t+dur);let out=g;if(c.createStereoPanner){const p=c.createStereoPanner();p.pan.value=pan||0;g.connect(p);out=p}o.connect(g);out.connect(SND.master);o.start(t);o.stop(t+dur+.05)}
window.__ambInit=ambInit;window.__snd={sndPause,SND,setMood,snd,moodKey,MOODS,sndOffline,ambTargets};
