// Writes tests/fixtures/novel_sample.txt: a stand-in "novel" for the reader tests.
// It has every chapter title from data/chapters.js and placeholder bodies only (no original text;
// each body just names the entries that cite that chapter),
// so the reader's file-input path can be tested without the real book.
const fs=require('fs'),path=require('path');
global.window={};for(const f of ['chapters','wiki','wiki3','wiki4'])require(path.join(__dirname,'..','data',f+'.js'));
// chapter title -> names of the entries that cite it, so the reader can link names inside the text
const cite={};for(const w of window.WIKI||[])for(const m of (w.ch||'').matchAll(/《([^》]+)》/g))(cite[m[1]]=cite[m[1]]||[]).push(w.n.split(/[·（(]/)[0].trim());
let n=0,out=[];
for(const v of Object.keys(window.CHAPS))for(const t of window.CHAPS[v]){n++;const W=window.WIKI,nm=(cite[t]||[]).slice(0,3);if(!nm.length)nm.push(W[n%W.length].n.split(/[·（(]/)[0].trim());out.push(`第${n}章 ${t}`,'',`（测试占位：第 ${n} 章的正文。${nm.length?'这一章提到'+nm.join('、')+'。':''}）`,'')}
fs.mkdirSync(path.join(__dirname,'fixtures'),{recursive:true});
fs.writeFileSync(path.join(__dirname,'fixtures','novel_sample.txt'),out.join('\n'));
console.log('fixture: '+n+' chapters');
