import {partsOf} from '../data/hardware.js';
export function checkCompatibility(build){
 const p=partsOf(build),checks=[];
 const add=(name,pass,detail)=>checks.push({name,pass,detail});
 if(Object.values(p).some(v=>!v)) return {compatible:false,complete:false,checks:[{name:'Components',pass:false,detail:'Select every component from the catalogue.'}],warnings:[],watts:0,requiredPSU:0};
 const watts=p.cpu.watts+p.gpu.watts+90;
 const requiredPSU=Math.max(p.gpu.minPSU,Math.ceil(watts/0.8/50)*50);
 add('CPU ↔ motherboard',p.cpu.socket===p.motherboard.socket,`${p.cpu.socket} processor / ${p.motherboard.socket} motherboard socket`);
 add('Memory generation',p.ram.type===p.motherboard.memory,`${p.ram.type} memory / ${p.motherboard.memory} board`);
 add('Memory capacity',p.ram.gb<=p.motherboard.maxRAM,`${p.ram.gb}GB installed / ${p.motherboard.maxRAM}GB catalogue limit`);
 add('Board ↔ case',p.case.forms.includes(p.motherboard.form),`${p.motherboard.form} board / case accepts ${p.case.forms.join(', ')}`);
 add('GPU clearance',p.gpu.length<=p.case.gpuMax,`${p.gpu.length}mm representative GPU / ${p.case.gpuMax}mm case allowance`);
 add('Power headroom',p.psu.watts>=requiredPSU,`${p.psu.watts}W selected / ${requiredPSU}W suggested minimum`);
 add('CPU cooling',p.cooler.sockets.includes(p.cpu.socket)&&(p.cpu.boxedCooler||p.cooler.id!=='boxed')&&p.cooler.height<=p.case.coolerMax,p.cooler.id==='boxed'&&!p.cpu.boxedCooler?'This CPU does not include a cooler. Select the tower cooler.':`${p.cooler.name} / ${p.cooler.height}mm in ${p.case.coolerMax}mm allowance`);
 add('Storage slot',p.motherboard.m2,`${p.storage.kind} drive / M.2 slot in catalogue board`);
 return {compatible:checks.every(c=>c.pass),complete:true,checks,watts,requiredPSU,warnings:['Board and case entries describe component classes. Confirm the exact manufacturer model, CPU support list and BIOS version before purchase.','Check your exact graphics card dimensions, PSU connectors and cable clearance. These vary between card manufacturers.']};
}
