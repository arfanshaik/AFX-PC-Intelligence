import {parseBudget} from '../utils/budgetParser.js';
import {hasLaptopIntent,laptopFiltersFromText,laptopPath} from './laptopIntent.js';
import {hasShoppingIntent,productSearchFromText,shopPath} from './productInt.js';
export function parseCommand(raw){
 const text=String(raw||'').trim().toLowerCase();
 if(!text)return {type:'unknown',message:'Try “build a gaming PC for eighty thousand”.'};
 if(/\bunmute\b|voice on|sound on/.test(text))return {type:'voice',muted:false};
 if(/\bmute\b|voice off|sound off/.test(text))return {type:'voice',muted:true};
 if(/\b(home|start over)\b/.test(text))return {type:'navigate',path:'/'};
 if(/\b(help|commands)\b/.test(text))return {type:'help'};
 if(/\b(demo|sample)\b/.test(text))return {type:'demo'};
 if(hasShoppingIntent(text)&&hasLaptopIntent(text))return {type:'navigate',path:laptopPath(laptopFiltersFromText(text))};
 if(hasShoppingIntent(text))return {type:'navigate',path:shopPath(productSearchFromText(text))};
 if(/design|show.*gaming pcs|show.*workstation/.test(text))return {type:'navigate',path:'/designs'};
 if(/compatib|does.*fit/.test(text))return {type:'navigate',path:'/compatibility'};
 if(/analy[sz]|my pc|my computer/.test(text)&&!/upgrade/.test(text))return {type:'navigate',path:'/analyzer'};
 if(/upgrade/.test(text))return {type:'navigate',path:'/upgrade'};
 if(/compar/.test(text))return {type:'navigate',path:'/compare'};
 if(/\bfps\b|performance|can.*run/.test(text))return {type:'navigate',path:'/performance'};
 if(/browser|detect|device/.test(text))return {type:'navigate',path:'/browser'};
 const budget=parseBudget(text);
 let purpose=/\bai\b|machine learning|\bml\b/.test(text)?'AI / ML':/edit|video/.test(text)?'Editing':/\b3d\b|render/.test(text)?'3D':/cod|develop|program/.test(text)?'Coding':/stream/.test(text)?'Streaming':/everything/.test(text)?'Everything':'Gaming';
 if(budget!==null||/build|budget|gaming pc|workstation/.test(text))return {type:'build',path:'/builder',budget,purpose};
 if(/about|who are you/.test(text))return {type:'navigate',path:'/about'};
 return {type:'unknown',message:'I can build, analyze, compare or upgrade a PC. Try “80k gaming PC” or choose a tool.'};
}
