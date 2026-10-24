/* ================================================================
   an exhibition first: smooth and quick before anything else
   · shadows always stay (their map, reach and redraw rate step down with the quality level instead, see 49p_stable)
   · everything else starts one step below the best: grass, the near ground patch, ambient occlusion, cloud self-shadow,
     micro-grain and close tree detail follow the quality steps from one step down (a phone two steps down)
   · resolution: at most 1.5 device pixels per screen point on a computer, 1.3 on a phone; multisampling 2x on a dense
     screen (4x on an ordinary one)
   · round primitives get only a few more sides than they were made with
   · the quality drops a step as soon as the frame rate stays under 42 (it was 34)
   ================================================================ */
function Q5OFF(){return window.__q5off!==undefined?window.__q5off:1}
const Q5DOWN=42;
setTimeout(()=>{try{Object.assign(window.__rq.dbg,{post:()=>({bloomPass,composer,finalPass,fxaaPass}),setLvl:L=>{perf.lvl=L;applyLevel()},perf:()=>perf,tw:()=>tw})}catch(e){}},0);
