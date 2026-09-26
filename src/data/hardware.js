// Curated teaching catalogue. Prices are illustrative INR planning values, not live quotes.
// Ratings are AFX model inputs, not measured benchmarks. See public/METHODOLOGY.md.
export const cpus = [
  {id:'r3600',name:'AMD Ryzen 5 3600',socket:'AM4',memory:'DDR4',cores:6,threads:12,watts:65,price:8000,gaming:52,compute:44,boxedCooler:true},
  {id:'r5600',name:'AMD Ryzen 5 5600',socket:'AM4',memory:'DDR4',cores:6,threads:12,watts:65,price:11000,gaming:65,compute:55,boxedCooler:true},
  {id:'i12400',name:'Intel Core i5-12400F',socket:'LGA1700',memory:'DDR4',cores:6,threads:12,watts:117,price:12000,gaming:68,compute:57,boxedCooler:true},
  {id:'r5700x',name:'AMD Ryzen 7 5700X',socket:'AM4',memory:'DDR4',cores:8,threads:16,watts:65,price:16500,gaming:70,compute:72,boxedCooler:false},
  {id:'r7600',name:'AMD Ryzen 5 7600',socket:'AM5',memory:'DDR5',cores:6,threads:12,watts:88,price:19500,gaming:85,compute:73,boxedCooler:true},
  {id:'r7700',name:'AMD Ryzen 7 7700',socket:'AM5',memory:'DDR5',cores:8,threads:16,watts:88,price:28500,gaming:89,compute:87,boxedCooler:true},
  {id:'r7900',name:'AMD Ryzen 9 7900',socket:'AM5',memory:'DDR5',cores:12,threads:24,watts:88,price:36000,gaming:91,compute:100,boxedCooler:true},
];
export const gpus = [
  {id:'gtx1650',name:'GeForce GTX 1650 4GB',brand:'NVIDIA',vram:4,watts:75,minPSU:300,length:200,price:13000,gaming:25,compute:15},
  {id:'rx6600',name:'Radeon RX 6600 8GB',brand:'AMD',vram:8,watts:132,minPSU:450,length:240,price:20000,gaming:48,compute:30},
  {id:'rtx3060',name:'GeForce RTX 3060 12GB',brand:'NVIDIA',vram:12,watts:170,minPSU:550,length:250,price:26000,gaming:53,compute:58},
  {id:'rtx4060',name:'GeForce RTX 4060 8GB',brand:'NVIDIA',vram:8,watts:115,minPSU:550,length:250,price:29000,gaming:63,compute:61},
  {id:'rx7700xt',name:'Radeon RX 7700 XT 12GB',brand:'AMD',vram:12,watts:245,minPSU:700,length:300,price:41000,gaming:83,compute:57},
  {id:'rtx4070s',name:'GeForce RTX 4070 SUPER 12GB',brand:'NVIDIA',vram:12,watts:220,minPSU:650,length:300,price:59000,gaming:94,compute:85},
  {id:'rtx4070tis',name:'GeForce RTX 4070 Ti SUPER 16GB',brand:'NVIDIA',vram:16,watts:285,minPSU:700,length:330,price:79000,gaming:108,compute:108},
  {id:'rtx4080s',name:'GeForce RTX 4080 SUPER 16GB',brand:'NVIDIA',vram:16,watts:320,minPSU:750,length:340,price:105000,gaming:125,compute:125},
];
export const motherboards = [
  {id:'a520',name:'A520 mATX motherboard',socket:'AM4',memory:'DDR4',form:'mATX',maxRAM:64,m2:true,price:7000},
  {id:'b550',name:'B550 mATX motherboard',socket:'AM4',memory:'DDR4',form:'mATX',maxRAM:128,m2:true,price:9000},
  {id:'b660',name:'B660 DDR4 mATX motherboard',socket:'LGA1700',memory:'DDR4',form:'mATX',maxRAM:128,m2:true,price:10000},
  {id:'b650',name:'B650 mATX motherboard',socket:'AM5',memory:'DDR5',form:'mATX',maxRAM:128,m2:true,price:14000},
  {id:'b650atx',name:'B650 ATX motherboard',socket:'AM5',memory:'DDR5',form:'ATX',maxRAM:128,m2:true,price:18000},
];
export const ram = [
  {id:'d4-8',name:'8GB DDR4-3200 (1 × 8GB)',type:'DDR4',gb:8,price:1800,dual:false},
  {id:'d4-16',name:'16GB DDR4-3200 (2 × 8GB)',type:'DDR4',gb:16,price:3300,dual:true},
  {id:'d4-32',name:'32GB DDR4-3200 (2 × 16GB)',type:'DDR4',gb:32,price:5800,dual:true},
  {id:'d4-64',name:'64GB DDR4-3200 (2 × 32GB)',type:'DDR4',gb:64,price:10800,dual:true},
  {id:'d5-16',name:'16GB DDR5-5200 (2 × 8GB)',type:'DDR5',gb:16,price:5500,dual:true},
  {id:'d5-32',name:'32GB DDR5-5200 (2 × 16GB)',type:'DDR5',gb:32,price:9500,dual:true},
  {id:'d5-64',name:'64GB DDR5-5200 (2 × 32GB)',type:'DDR5',gb:64,price:17500,dual:true},
];
export const storage = [
  {id:'ssd512',name:'512GB NVMe SSD',gb:512,kind:'NVMe',price:3000},
  {id:'ssd1',name:'1TB NVMe SSD',gb:1024,kind:'NVMe',price:5500},
  {id:'ssd2',name:'2TB NVMe SSD',gb:2048,kind:'NVMe',price:10000},
];
export const psus = [
  {id:'psu350',name:'350W power supply',watts:350,price:2500},
  {id:'psu550',name:'550W 80+ Bronze class',watts:550,price:4000},
  {id:'psu650',name:'650W 80+ Bronze class',watts:650,price:5000},
  {id:'psu750',name:'750W 80+ Gold class',watts:750,price:7500},
  {id:'psu850',name:'850W 80+ Gold class',watts:850,price:10000},
];
export const cases = [
  {id:'compact',name:'Compact Mini-ITX case',forms:['Mini-ITX'],gpuMax:230,coolerMax:130,price:4500},
  {id:'air-m',name:'mATX airflow case + 3 fans',forms:['mATX','Mini-ITX'],gpuMax:320,coolerMax:160,price:4000},
  {id:'air-atx',name:'ATX airflow case + 4 fans',forms:['ATX','mATX','Mini-ITX'],gpuMax:360,coolerMax:170,price:6500},
];
export const coolers = [
  {id:'boxed',name:'CPU included boxed cooler',price:0,height:85,sockets:['AM4','AM5','LGA1700']},
  {id:'tower',name:'120mm tower air cooler',price:3000,height:155,sockets:['AM4','AM5','LGA1700']},
];
export const catalogue={cpu:cpus,gpu:gpus,motherboard:motherboards,ram,storage,psu:psus,case:cases,cooler:coolers};
export const labels={cpu:'Processor',gpu:'Graphics',motherboard:'Motherboard',ram:'Memory',storage:'Storage',psu:'Power supply',case:'Case',cooler:'Cooling'};
export const purposes=['Gaming','Coding','AI / ML','Editing','3D','Streaming','Everything'];
export const demoBuild={cpu:'r5600',gpu:'rtx3060',ram:'d4-16',storage:'ssd512',motherboard:'b550',psu:'psu650',case:'air-m',cooler:'boxed',resolution:'1440p',purpose:'Gaming'};
export function partsOf(build){return Object.fromEntries(Object.entries(catalogue).map(([k,v])=>[k,v.find(p=>p.id===build?.[k])]));}
export function priceOf(build){return Object.values(partsOf(build)).reduce((s,p)=>s+(p?.price||0),0);}
export const money=(n)=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);
export const shortMoney=(n)=>n>=100000?`₹${+(n/100000).toFixed(2)}L`:`₹${+(n/1000).toFixed(1)}K`;
