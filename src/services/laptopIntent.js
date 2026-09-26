import {laptops} from '../data/laptops.js';
import {parseBudget} from '../utils/budgetParser.js';

const brands=[...new Set(laptops.map(item=>item.brand))];
export const hasLaptopIntent=text=>/\b(laptops?|notebooks?|chromebooks?|macbooks?)\b/i.test(text);

export function laptopFiltersFromText(raw,previous={}) {
  const text=String(raw).toLowerCase();
  const filters={...previous};
  const brand=brands.find(value=>new RegExp('\\b'+value+'\\b','i').test(text));
  if(brand)filters.brand=brand;
  const budgetCue=/₹|rupees|\brs\.?\b|budget|under|around|within|lakh|thousand|\d+\s*k\b/i.test(text)||/^\s*\d[\d, ]{3,}\s*$/.test(text);
  const budget=budgetCue?parseBudget(text):null;
  if(budget>0)filters.budget=budget;
  if(/any budget|no budget limit/.test(text))delete filters.budget;
  if(/gaming|\bgames?\b/.test(text))filters.category='Gaming';
  else if(/chromebook/.test(text))filters.category='Chromebook';
  else if(/premium/.test(text))filters.category='Premium';
  else if(/study|student|coding|office|work/.test(text))filters.category='Work & study';
  else if(/everyday|basic/.test(text))filters.category='Everyday';
  if(/all (laptops|brands|types)|any (brand|type)/.test(text)) {delete filters.brand;delete filters.category;delete filters.query;}
  const model=text.match(/\b(macbook|rog|loq|legion|vivobook|tuf|victus|nitro|aspire|inspiron|ideapad|expertbook|galaxy book|modern 15|thinkpad|zenbook|pavilion|omen|predator|alienware)\b/);
  if(model)filters.query=model[1];
  else if(brand)delete filters.query;
  return filters;
}

export function laptopPath(filters={}) {
  const params=new URLSearchParams();
  for(const [key,value] of Object.entries({q:filters.query,brand:filters.brand,category:filters.category,budget:filters.budget}))if(value)params.set(key,String(value));
  return '/laptops'+(params.size?'?'+params.toString():'');
}

export function isLaptopFollowup(raw) {
  return /budget|under|around|within|₹|rupees|lakh|thousand|\d+\s*k\b|^(gaming|coding|study|premium|everyday|\d[\d, ]{3,})[.! ]*$/i.test(raw)
    ||brands.some(brand=>new RegExp('\\b'+brand+'\\b','i').test(raw));
}
