import {catalogue,partsOf,priceOf} from '../data/hardware.js';
import {checkCompatibility} from './compatibilityEngine.js';
import {analyzeBuild} from './performanceEngine.js';
export function recommendUpgrades(build,budget,goal='Gaming'){
 const compatibility=checkCompatibility(build);if(!compatibility.compatible)return {error:'Resolve the compatibility issues in this build first.',recommendations:[]};
 budget=Number(budget);if(!Number.isFinite(budget)||budget<=0)return {error:'Enter an upgrade budget greater than zero.',recommendations:[]};
 const key=goal==='Coding'?'Development':goal==='AI / ML'?'AI / ML':['Editing','3D'].includes(goal)?'Creative':'Gaming';
 const before=analyzeBuild(build).scores[key],p=partsOf(build),options=[];
 for(const category of ['gpu','cpu','ram','storage']) for(const part of catalogue[category]){
  if(part.id===build[category])continue;
  const next={...build,[category]:part.id};const cost=part.price;
  if(cost>budget||!checkCompatibility(next).compatible)continue;
  const after=analyzeBuild(next).scores[key],uplift=Math.round((after-before)/Math.max(1,before)*100);
  if(after<=before)continue;
  options.push({category,part,build:next,cost,before,after,uplift,reason:`${p[category].name} → ${part.name}`,value:(after-before)/cost});
 }
 options.sort((a,b)=>(b.after-a.after)||(b.value-a.value));
 return {recommendations:options.slice(0,3),goal:key,before,notice:'Uplift is a change in the AFX model score, not a promised FPS gain. Replacement cost excludes resale. Only compatible single-part swaps are shown.'};
}
