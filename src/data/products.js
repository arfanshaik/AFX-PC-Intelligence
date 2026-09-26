import {laptops,laptopCatalogueDate} from './laptops.js';

export const productCategories=[
  ['all','Everything','computer hardware'],['laptops','Laptops','laptop'],['desktops','Desktop PCs','desktop PC'],
  ['graphics','Graphics cards','graphics card'],['processors','Processors','CPU processor'],['memory','RAM','RAM memory'],
  ['storage','SSD & storage','SSD storage'],['motherboards','Motherboards','motherboard'],['monitors','Monitors','monitor'],
  ['peripherals','Keyboards & mice','keyboard mouse'],['audio','Headsets & speakers','computer headset speakers'],
  ['cooling','Cooling & cases','PC cooling case'],['power','Power supplies','PC power supply'],['accessories','Accessories','computer accessories']
];
export const laptopProduct=item=>({id:item.id,title:item.brand+' '+item.name,brand:item.brand,model:item.model,category:'laptops',
  details:[item.cpu,item.ram+'GB RAM',item.storage,item.gpu,item.screen,item.category].filter(Boolean).join(' · '),
  price:item.price,image:item.image,imageSource:item.imageSource,store:'flipkart',url:item.flipkart,availability:item.availability,
  checkedAt:laptopCatalogueDate,priceType:'snapshot',cached:item.cached});
export const components=[
  {id:'lg-ultragear-24gn60r',title:'LG UltraGear 24GN60R',brand:'LG',model:'24GN60R',category:'monitors',details:'24-inch · Full HD · IPS · 144Hz',price:10999,cached:true,image:'/assets/products/lg-ultragear.jpg',imageSource:'https://rukminim2.flixcart.com/image/832/832/xif0q/monitor/j/b/o/-original-imagpu2tpgtuhgbh.jpeg?q=80',url:'https://www.flipkart.com/lg-ultragear-24-inch-full-hd-led-backlit-ips-panel-hdr-10-gaming-monitor-24gn60r/p/itmaef23850e3a26'},
  {id:'samsung-990-evo-plus',title:'Samsung 990 EVO Plus 1TB',brand:'Samsung',model:'MZ-V9S1T0BW',category:'storage',details:'1TB SSD · PCIe NVMe · Internal storage',price:25999,image:'/assets/products/samsung-990.jpg',imageSource:'https://rukminim2.flixcart.com/image/832/832/xif0q/internal-hard-drive/z/8/y/-original-imahdvfyh9ukezdw.jpeg?q=80',url:'https://www.flipkart.com/samsung-990-evo-plus-1-tb-desktop-black-pcie-nvme-internal-solid-state-drive-ssd-mz-v9s1t0bw/p/itmf99794b930d3a'},
  {id:'corsair-vengeance-16',title:'Corsair Vengeance LPX 16GB',brand:'Corsair',model:'CMK16GX4M1Z3600C18',category:'memory',details:'DDR4 desktop RAM · 1 × 16GB · 3600MHz · C18',price:4154,image:'/assets/products/corsair-ram.jpg',imageSource:'https://rukminim2.flixcart.com/image/832/832/kkoc70w0/ram/a/p/r/cmk16gx4m1z3600c18-corsair-original-imafzyzgvxhrnjxk.jpeg?q=80',url:'https://www.flipkart.com/hi/corsair-vengeance-lpx-ddr4-16-gb-pc-1-x-16gb-3600mhz-c18-desktop-ram-cmk16gx4m1z3600c18/p/itm59ed26861715e'},
  {id:'logitech-g102',title:'Logitech G102 Light Sync',brand:'Logitech',model:'G102 Light Sync',category:'peripherals',details:'Wired optical gaming mouse · Black',price:1495,cached:true,image:'/assets/products/logitech-g102.png',imageSource:'https://rukminim2.flixcart.com/image/832/832/xif0q/mouse/6/9/j/g102-light-sync-logitech-enriched-transparent-original-imag3d4rzzzyrfxd.png?q=80',url:'https://www.flipkart.com/logitech-g203-black-wired-optical-gaming-mouse/p/itmc44c10000ad95'}
].map(item=>({...item,store:'flipkart',checkedAt:'2026-09-26',priceType:'snapshot'}));
export const products=[...components,...laptops.map(laptopProduct)];
export function filterProducts({query='',category='all',store='all',budget=0,sort='relevance',hideUnavailable=true}={}){
  const aliases={laptops:'laptop',notebook:'laptop',notebooks:'laptop',ssds:'ssd',monitors:'monitor',mice:'mouse',memory:'ram'};
  const words=String(query).toLowerCase().replace(/[^a-z0-9+.-]/g,' ').split(/\s+/).filter(Boolean).map(word=>aliases[word]||word);
  const items=products.filter(item=>{
    const haystack=[item.title,item.brand,item.model,item.details,productCategories.find(c=>c[0]===item.category)?.[2]].join(' ').toLowerCase();
    return words.every(word=>haystack.includes(word))&&(category==='all'||item.category===category)&&(store==='all'||item.store===store)
      &&(!Number(budget)||item.price<=Number(budget))&&(!hideUnavailable||item.availability!=='out-of-stock');
  });
  if(sort==='price-asc')items.sort((a,b)=>a.price-b.price);
  if(sort==='price-desc')items.sort((a,b)=>b.price-a.price);
  return items;
}
