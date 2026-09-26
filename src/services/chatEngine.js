import {demoBuild,partsOf,money,cpus,gpus} from '../data/hardware.js';
import {games} from '../data/games.js';
import {parseBudget} from '../utils/budgetParser.js';
import {parseCommand} from './commandParser.js';
import {generateBuild} from '../utils/buildGenerator.js';
import {checkCompatibility} from '../utils/compatibilityEngine.js';
import {analyzeBuild} from '../utils/performanceEngine.js';
import {estimateFPS} from '../utils/fpsEstimator.js';
import {filterLaptops} from '../data/laptops.js';
import {hasLaptopIntent,isLaptopFollowup,laptopFiltersFromText,laptopPath} from './laptopIntent.js';
import {filterProducts,laptopProduct} from '../data/products.js';
import {hasShoppingIntent,isShoppingFollowup,isHardwareQuestion,productSearchFromText,shopPath} from './productIntent.js';
import {hardwareHelp} from './hardwareHelp.js';
const action=(label,command)=>({label,command});
const reply=(content,extras={})=>({content,mode:'guide',handled:true,...extras});
const purposeFor=text=>/\bai\b|machine learning|\bml\b/i.test(text)?'AI / ML':/cod|develop|program/i.test(text)?'Coding':/edit|video/i.test(text)?'Editing':/\b3d\b|render/i.test(text)?'3D':/stream/i.test(text)?'Streaming':/everything/i.test(text)?'Everything':/gam/i.test(text)?'Gaming':null;
const budgetIn=text=>/₹|rupees|budget|under|around|within|lakh|thousand|\d+\s*k\b/i.test(text)||/^\s*\d[\d, ]{3,}\s*$/.test(text)?parseBudget(text):null;
export function localChatReply(messages,{currentBuild=demoBuild}={}) {
  const users=messages.filter(m=>m.role==='user'),raw=String(users.at(-1)?.content||'').trim(),text=raw.toLowerCase();
  const previous=users.slice(0,-1).map(m=>m.content).join(' '),lastAssistant=messages.filter(m=>m.role==='assistant').at(-1),current=partsOf(currentBuild);
  if(!text)return reply('Type a message and I’ll help you with your PC.');
  const shopping=hasShoppingIntent(text);
  if(shopping&&hasLaptopIntent(text)||(lastAssistant?.topic==='laptops'&&isLaptopFollowup(text)&&!isHardwareQuestion(text)&&!/\b(pc|desktop|tower|ram|ssd|gpu|monitor|keyboard|mouse)\b/.test(text))){
    const filters=laptopFiltersFromText(text,hasLaptopIntent(text)?{}:lastAssistant.laptopFilters);
    const matches=filterLaptops({...filters,hideUnavailable:true}).slice(0,3);
    const productSearch={...productSearchFromText(raw,lastAssistant?.topic==='laptops'?lastAssistant.productSearch:{}),query:[filters.brand,filters.query,filters.category].filter(Boolean).join(' ').replace('Work & study',''),category:'laptops',budget:filters.budget||0};
    const selection=matches.length?matches.map(item=>'• '+item.brand+' '+item.name+' ('+item.ram+'GB / '+item.storage+'): '+money(item.price)).join('\n'):'No matching listings in this small collection. The page has searches for the full Amazon and Flipkart ranges.';
    return reply('Here are laptop listing snapshots'+(filters.budget?' up to '+money(filters.budget):'')+':\n'+selection+'\n\nThese Flipkart prices were collected on 25 Sep 2026 and may have changed. The cards include photos and store links; check Amazon prices and current stock at the store.',{topic:'laptops',laptopFilters:filters,products:matches.map(laptopProduct),productSearch,action:{label:'Explore these laptops',path:laptopPath(filters)}});
  }
  if(shopping||lastAssistant?.topic==='products'&&isShoppingFollowup(text)){
    const search=productSearchFromText(raw,shopping&&!isShoppingFollowup(text)?{}:lastAssistant?.productSearch),matches=filterProducts(search).slice(0,3);
    return reply(matches.length?'Here are matching saved listings with photos and store links. The prices are dated snapshots; confirm the exact model and current offer at the store.':'No matching saved listings for that search. Use the Amazon and Flipkart buttons below to search their current ranges, or open product search.',{topic:'products',productSearch:search,products:matches,action:{label:'Explore products',path:shopPath(search)}});
  }
  if(/^(hi|hello|hey|yo|hii+|bro)([ ,]+arfan)?[!. ]*$/.test(text))return reply('Hey! I’m Arfan. Tell me your budget and what you’ll use the PC for, or ask me about a component.');
  if(/how are you|what'?s up/.test(text))return reply('Ready to help with your next build! Are you planning a new PC or improving one you already own?');
  if(/thank|thanks/.test(text))return reply('You’re welcome! We can check the build, compare parts, or look at an upgrade next.');
  if(/who are you|your name|who (made|created|built) you/.test(text))return reply('I’m Arfan, the PC assistant in AFX PC Intelligence, created by Shaik Arfan. I help with budgets, parts, compatibility, upgrades and performance estimates.');
  if(/not reply|not respond|can we chat|can i chat|are you there/.test(text))return reply('Yes, I’m here. Your messages and my replies stay in this chat. Ask a PC question or tell me your budget to get started.');
  if(/^(help|what can you do|commands)[?!. ]*$/.test(text))return reply('I can search laptops and PC hardware, show photos and store links, explain parts, help troubleshoot common problems, plan builds and check the selected build.\nTry “Find a 1TB SSD”, “My laptop is overheating”, or “Build a gaming PC for 80k”.');
  const help=hardwareHelp(text);
  if(help)return reply(help,{topic:'hardware'});
  if(/^(please\s+)?(open|show|go|take me|load|mute|unmute|turn (the )?(voice|sound))\b/.test(text)){
    const command=parseCommand(raw);
    if(command.type==='voice')return reply(command.muted?'I’ll turn voice off. You can keep chatting here.':'I’ll turn voice on. Captions remain visible.',{action:action('Apply voice setting',raw)});
    if(command.type==='demo')return reply('The demo PC has a Ryzen 5 5600, RTX 3060 and 16GB RAM. Load it to explore the analyzer.',{action:action('Load demo PC','load demo')});
    if(command.type==='navigate'){
      const labels={'/':'home','/designs':'PC designs','/analyzer':'the analyzer','/compatibility':'the compatibility checker','/upgrade':'upgrade suggestions','/compare':'build comparisons','/performance':'game performance','/browser':'browser information','/about':'About Arfan'};
      return reply('Here’s the shortcut to '+labels[command.path]+'. Your conversation will stay here.',{action:action('Open '+labels[command.path],raw)});
    }
  }
  if(/\b(ram|memory|ddr4|ddr5)\b/.test(text)&&!/\b(build|budget|under|around)\b/.test(text))return reply('RAM is your PC’s short-term working memory. More capacity helps when apps compete for memory; it does not automatically raise every game’s FPS.\nDDR4 and DDR5 need matching motherboard support and are not interchangeable. Your selected build uses '+(current.ram?.name||'unselected memory')+'.',{action:action('Check memory compatibility','check compatibility')});
  if(/what.*(cpu|processor)|cpu.*(do|mean)/.test(text))return reply('The CPU runs instructions for programs, game logic and background tasks. Cores help with parallel workloads; performance also depends on the CPU architecture and software.\nYour selected CPU is '+(current.cpu?.name||'not selected')+'.');
  if(/what.*(gpu|graphics card)|gpu.*(do|mean)/.test(text))return reply('The GPU renders graphics and accelerates supported creative and AI workloads. VRAM holds data it needs, such as textures and model weights.\nYour selected graphics card is '+(current.gpu?.name||'not selected')+'.');
  if(/\b(ssd|nvme|hdd|storage)\b/.test(text)&&!/build|budget/.test(text))return reply('An SSD usually makes starting Windows, opening apps and loading games faster than a hard drive. NVMe SSDs use PCIe; check the motherboard’s M.2 support and the drive form factor.\nThe selected build has '+(current.storage?.name||'no storage selected')+'.');
  if(/amd.*intel|intel.*amd/.test(text))return reply('Compare specific CPU models and the whole platform cost: CPU, motherboard, memory and cooling. The brand alone doesn’t decide the better choice. Tell me the two model names and your main workload.');
  if(/\b(vs|versus|compare)\b/.test(text)){
    const found=[...cpus,...gpus].filter(p=>text.includes(p.id.toLowerCase())||p.name.toLowerCase().split(' ').some(w=>/\d{4}/.test(w)&&text.includes(w)));
    if(found.length===2){const[a,b]=found;return reply(a.name+': '+money(a.price)+' in the sample catalogue.\n'+b.name+': '+money(b.price)+' in the sample catalogue.\nCompare complete builds for compatibility and the app’s illustrative scores. These are not live prices or measured benchmarks.',{action:action('Open comparisons','compare builds')});}
    return reply('Which two parts or builds should I compare? Send both model names. You can also compare the catalogue builds side by side.',{action:action('Compare builds','compare builds')});
  }
  if(/compatib|does.*fit/.test(text)){
    const report=checkCompatibility(currentBuild),failures=report.checks.filter(c=>!c.pass);
    return reply('For the selected build: '+(report.compatible?'the catalogue compatibility checks pass.':failures.map(c=>c.name+': '+c.detail).join('\n'))+'\nSuggested PSU capacity: '+report.requiredPSU+'W. Exact board BIOS support, connectors and card dimensions still need manufacturer checks.',{action:action('See compatibility checks','check compatibility')});
  }
  if(/\bfps\b|can.*run|valorant|fortnite|cyberpunk|counter.strike|gta|what about.*(4k|1080|1440)/.test(text)){
    const scope=(previous+' '+text).toLowerCase(),game=games.find(g=>scope.includes(g.name.toLowerCase())||scope.includes(g.id))||games[0];
    const resolution=/4k/i.test(text)?'4K':/1080/.test(text)?'1080p':/1440/.test(text)?'1440p':currentBuild.resolution||'1440p';
    const estimate=estimateFPS(currentBuild,game.id,resolution,'High');
    return reply('For the selected build, the AFX model estimates '+estimate.low+'–'+estimate.high+' FPS in '+game.name+' at '+resolution+,' / High.\nThis is an illustrative estimate, not a measured benchmark. Actual FPS depends on the game version, drivers and settings.',{action:action('Adjust game settings','show gaming performance')});
  }
  if(/analy[sz]|bottleneck|my (pc|computer|build)|current build/.test(text)&&!/build me|upgrade/.test(text)){
    const report=analyzeBuild(currentBuild);
    return reply('Your selected build uses '+current.cpu?.name+' and '+current.gpu?.name+'.\n'+report.explanation+'\nThis uses the components selected in AFX; I can’t scan your hardware automatically.',{action:action('Edit or analyze my build','analyze my pc')});
  }
  if(/upgrade/.test(text))return reply('Lew’s start with the part that limits your workload. Your selected build has '+current.cpu?.name+', '+current.gpu?.name+' and '+current.ram?.name+'. Tell me your upgrade budget and the game or app you want to improve.',{action:action('Open upgrade advisor','show upgrade advisor')});
  if(/why|explain.*(that|build|choice)/.test(text)&&lastAssistant?.reason)Reply(lastAssistant.reason+'\nThe builder checks the catalogue’s socket, memory, clearance and power requirements before suggesting a configuration.');
  const budget=budgetIn(raw),pastBudget=[...users.slice(0,-1)].reverse().map(m=>budgetIn(m.content)).find(n=>n!==null);
  const buildIntent=/build|budget|gaming pc|workstation|new pc/.test(text)||budget!==null||(pastBudget!==undefined&&/^(gaming|coding|editing|streaming|ai|ml|3d|everything)[!. ]*$/.test(text));
  if(buildIntent){
    const amount=budget??pastBudget;
    if(amount===undefined||amount===null)return reply('What’s your budget in rupees, and will you mainly use the PC for gaming, coding, editing or AI? The sample catalogue covers towers from ₹40,000 to ₹2,50,000.');
    if(amount>250000)return reply('This catalogue supports tower budgets up to ₹2,50,000. Give me a budget within that range and I’ll suggest a build.');
    const purpose=purposeFor(raw)||purposeFor(previous)||'Gaming',result=generateBuild(amount,purpose);
    if(result.error)return reply(result.error+' Tell me a revised budget and I’ll try again.');
    const p=partsOf(result.build);
    return reply('For '+money(amount)+' / '+purpose+', here’s a sample tower build:\n• '+p.cpu.name+'\n• '+p.gpu.name+'\n• '+p.ram.name+'\n• '+p.storage.name+'\nEstimated tower total: '+money(result.total)+'.\nPrices are illustrative; a monitor and peripherals are not included.',{reason:result.reason,action:action('Open this build','build a '+purpose+' PC for '+amount)});
  }
  if(/price|latest|newest|5090|5080|5070/.test(text))return reply('The preview has a fixed teaching catalogue, so I can’t verify current stock, retailer prices or newly released hardware. I can help you plan a compatible build within that catalogue.',{handled:false});
  return reply('I’m using the built-in PC guide here, and I don’t have a reliable answer for that question yet. I can help with budgets, RAM, CPU/GPU basics, compatibility and the selected build. Broader conversation becomes available when live AI is connected.',{handled:false});
}
