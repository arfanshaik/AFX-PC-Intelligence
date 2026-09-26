import {cpus,gpus,motherboards,ram,storage,psus,cases,purposes,priceOf,partsOf} from '../data/hardware.js';
import {checkCompatibility} from './compatibilityEngine.js';
export function generateBuild(budget,purpose='Gaming'){
 budget=Number(budget);if(!Number.isFinite(budget)||budget<1) return {error:'Enter a valid budget in rupees.'};
 if(!purposes.includes(purpose)) purpose='Gaming';
 let best=null,cheapest=Infinity;
 for(const cpu of cpus)for(const gpu of gpus.filter(g=>g.id!=='gtx1650'))for(const memory of ram.filter(r=>r.type===cpu.memory&&r.gb>=16))for(const drive of storage.filter(s=>s.gb>=(budget<60000?512:1024))){
  const board=motherboards.find(b=>b.socket===cpu.socket&&b.memory===memory.type&&(budget<60000||b.id!=='a520'));
  const pcCase=cases.find(c=>c.forms.includes(board.form)&&c.gpuMax>=gpu.length);
  const required=Math.max(gpu.minPSU,Math.ceil((cpu.watts+gpu.watts+90)/.8/50)*50);
  const supply=psus.find(s=>s.watts>=required);if(!pcCase||!supply) continue;
  const build={cpu:cpu.id,gpu:gpu.id,ram:memory.id,storage:drive.id,motherboard:board.id,psu:supply.id,case:pcCase.id,cooler:cpu.boxedCooler?'boxed':'tower',purpose,resolution:budget<70000?'1080p':'1440p'};
  const total=priceOf(build);cheapest=Math.min(cheapest,total);if(total>budget) continue;
  const mem=Math.min(1,memory.gb/(purpose==='AI / ML'||purpose==='3D'?64:32))*100;
  const disk=Math.min(1,drive.gb/(purpose==='Editing'||purpose==='3D'?2048:1024))*100;
  let score;
  if(purpose==='Coding') score=cpu.compute*.6+mem*.3+disk*.1;
  else if(purpose==='AI / ML') score=gpu.compute*.45+gpu.vram*2+mem*.2+cpu.compute*.1+(gpu.brand==='NVIDIA'?15:0);
  else if(purpose==='Editing'||purpose==='3D') score=cpu.compute*.35+gpu.compute*.35+mem*.2+disk*.1;
  else if(purpose==='Streaming') score=gpu.gaming*.4+cpu.compute*.4+mem*.2;
  else if(purpose==='Everything') score=gpu.gaming*.35+cpu.compute*.35+mem*.2+disk*.1;
  else score=Math.min(gpu.gaming,cpu.gaming*1.4)*.72+cpu.gaming*.2+mem*.08;
  if(!best||score>best.score+.001||(Math.abs(score-best.score)<.001&&total<best.total)) best={build,total,score};
 }
 if(!best) return {error:`The lowest complete build in this catalogue is ₹${cheapest.toLocaleString('en-IN')}. Increase the budget to include all components.`,minimum:cheapest};
 const p=partsOf(best.build);
 return {...best,budget,remaining:budget-best.total,compatibility:checkCompatibility(best.build),reason:purpose==='AI / ML'?`${p.gpu.vram}GB VRAM and ${p.ram.gb}GB system memory prioritise local model experiments. Software compatibility still depends on your framework.`:purpose==='Coding'?`${p.cpu.cores} cores and ${p.ram.gb}GB memory prioritise development, multitasking and local tools.`:`Balanced spending on ${p.cpu.name.replace('AMD ','')} and ${p.gpu.name} with ${p.ram.gb}GB memory.`,scope:'Tower only. Excludes monitor, peripherals, operating system, shipping and assembly.'};
}
export const designBriefs=[
 {id:'starter',number:'01',name:'THE STARTER',budget:55000,purpose:'Gaming',use:'A first step. A real upgrade.',label:'1080P / EVERYDAY PLAY',color:'#a91f2a'},
 {id:'player',number:'02',name:'THE PLAYER',budget:80000,purpose:'Gaming',use:'For your next personal best.',label:'1080P–1440P / GAMING',color:'#ff343b'},
 {id:'beast',number:'03',name:'THE BEAST',budget:120000,purpose:'Gaming',use:'More pixels. More possibility.',label:'1440P / HIGH REFRESH',color:'#d32834'},
 {id:'creator',number:'04',name:'THE CREATOR',budget:150000,purpose:'Editing',use:'Make something worth rendering.',label:'EDITING / 3D / DESIGN',color:'#ba2631'},
 {id:'machine',number:'05',name:'THE MACHINE',budget:200000,purpose:'AI / ML',use:'Your experiments, accelerated.',label:'AI / ML / GAMING',color:'#ed4249'},
];
