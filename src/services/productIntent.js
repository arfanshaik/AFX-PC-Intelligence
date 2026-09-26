import {parseBudget} from '../utils/budgetParser.js';
const categoryRules=[['laptops',/\b(laptops?|notebooks?|chromebooks?|macbooks?)\b/],['graphics',/\b(gpu|graphics cards?|rtx|radeon|geforce)\b/],['processors',/\b(cpu|processors?|ryzen|intel core)\b/],['memory',/\b(ram|memory|ddr[345])\b/],['storage',/\b(ssds?|hdd|nvme|hard drives?|storage)\b/],['motherboards',/\b(motherboards?|mainboards?)\b/],['monitors',/\b(monitors?|displays?)\b/],['peripherals',/\b(keyboards?|mouse|mice|webcams?)\b/],['audio',/\b(headsets?|headphones?|speakers?|microphones?)\b/],['cooling',/\b(coolers?|cooling|fans?|cases?|cabinets?)\b/],['power',/\b(psu|power suppl(?:y|ies)|ups)\b/],['desktops',/\b(desktops?|mini pc|all.in.one)\b/],['accessories',/\b(accessories|chargers?|adapters?|cables?|usb hubs?|docks?)\b/]];
export const isHardwareQuestion=raw=>/\b(why|how|what does|what is|what's|explain|overheat|overheating|slow|slowing|not working|not charging|won.t|doesn.t|can i|can my|does my|compatible|compatibility|upgrade|enough|difference|vs|versus|compare|battery|blue screen|bsod|crash|crashing|fix|troubleshoot|wifi|wi-fi)\b/i.test(raw);
export function hasShoppingIntent(raw){
  const text=String(raw).toLowerCase();
  const item=categoryRules.some(([,rule])=>rule.test(text));
  if(/\bbuild\b/.test(text)&&/\b(pc|tower|workstation)\b/.test(text)&&!/prebuilt|pre-built/.test(text))return false;
  if(isHardwareQuestion(text)&&!/\b(buy|shop|find|search|price|prices|cost|recommend|suggest|amazon|flipkart)\b/.test(text))return false;
  return /\b(amazon|flipkart|shop|shopping|catalogue)\b/.test(text)||(item&&(!isHardwareQuestion(text)||/\b(buy|find|search|price|prices|cost|recommend|suggest)\b/.test(text)));
}
export function productSearchFromText(raw,previous={}){
  const text=String(raw).toLowerCase();
  const category=categoryRules.find(([,rule])=>rule.test(text))?.[0]||previous.category||'all';
  const store=/amazon/.test(text)&&!/flipkart/.test(text)?'amazon':/flipkart/.test(text)&&!/amazon/.test(text)?'flipkart':/both stores|all stores|amazon.*flipkart|flipkart.*amazon/.test(text)?'all':previous.store||'all';
  const hasBudget=/₹|rupees|\brs\.?\b|budget|under|around|within|lakh|thousand|\d+\s*k\b/i.test(text);
  const budget=/any budget|no budget limit/.test(text)?0:hasBudget?parseBudget(text)||previous.budget||0:previous.budget||0;
  let query=text.replace(/(?:₹|rs\.?\s*)\s*[\d,.]+\s*(?:k|lakh|thousand)?/g,'').replace(/\b(?:under|below|within|around|budget(?: is| of)?|up to)\s*(?:is\s*)?[\d,.]+\s*(?:k|lakh|thousand)?\b/g,'').replace(/\b\d+(?:\.\d+)?\s*k\b/g,'').replace(/\b(show|me|please|find|search|for|from|on|in|amazon|flipkart|buy|shop|shopping|recommend|suggest|some|the|best|a|an|and|price|prices|cost|of|my|budget|is|only|both|stores|also|instead|what|about)\b/g,' ').replace(/[?!,]/g,' ').replace(/\s+/g,' ').trim();
  if(!query)query=previous.query||'';
  return {query:query.slice(0,180),category,store,budget};
}
export const isShoppingFollowup=raw=>/\b(budget|under|below|within|around|cheaper|amazon|flipkart|only|instead|any budget|no budget limit)\b|₹|\d+\s*k\b/i.test(raw)&&!isHardwareQuestion(raw);
export function shopPath(filters={}){const p=new URLSearchParams();for(const[k,v]of Object.entries({q:filters.query,category:filters.category,store:filters.store,budget:filters.budget}))if(v&&v!=='all')p.set(k,String(v));return '/shop'+(p.size?'?'+p:'');}
