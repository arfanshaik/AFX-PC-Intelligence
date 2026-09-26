import {partsOf} from '../data/hardware.js';
const clamp=(n)=>Math.max(1,Math.min(100,Math.round(n)));
export function analyzeBuild(build){
 const p=partsOf(build);if(!p.cpu||!p.gpu||!p.ram||!p.storage) return null;
 const memory=Math.min(100,p.ram.gb/32*100),disk=Math.min(100,p.storage.gb/1024*100);
 const scores={Gaming:clamp(p.gpu.gaming*.6+p.cpu.gaming*.3+memory*.1),Development:clamp(p.cpu.compute*.55+memory*.3+disk*.15),'AI / ML':clamp(p.gpu.compute*.5+Math.min(100,p.gpu.vram/16*100)*.3+memory*.2),Creative:clamp(p.cpu.compute*.4+p.gpu.compute*.35+memory*.2+disk*.05)};
 const res=build.resolution||'1440p';
 const cpuLoad=p.cpu.gaming, gpuLoad=p.gpu.gaming*(res==='4K'?.62:res==='1440p'?.85:1.1);
 const limiter=p.ram.gb<16?'Memory':gpuLoad<cpuLoad*.9?'Graphics':cpuLoad<gpuLoad*.8?'Processor':'Balanced';
 const explanations={Memory:'Less than 16GB can cause paging and stutter when games and other apps compete for memory.',Graphics:`At ${res}, this model expects graphics rendering to reach its limit before the processor in demanding games.`,Processor:'A faster graphics card may wait for the processor in CPU-heavy games and high refresh rate play.',Balanced:'The processor and graphics card are broadly balanced in this model. Your games and settings decide the real limit.'};
 const key=build.purpose==='Coding'?'Development':build.purpose==='AI / ML'?'AI / ML':['Editing','3D'].includes(build.purpose)?'Creative':'Gaming';
 return {scores,overall:scores[key],limiter,explanation:explanations[limiter],label:key};
}
