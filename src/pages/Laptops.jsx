import {useEffect,useMemo} from 'react';
import {useSearchParams} from 'react-router-dom';
import {Search,Filter,Laptop} from 'lucide-react';
import {filterLaptops,laptops,laptopSearchTerm,storeSearch} from '../data/laptops';
import {Heading,NativeSelect,Note} from '../components/Primitives';
import {ProductCard,StoreLink} from '../components/ProductCard';
import '../styles-laptops.css';
const brands=['all',...new Set(laptops.map(item=>item.brand))],categories=['all',...new Set(laptops.map(item=>item.category))];
export default function Laptops(){
  const [params]}=useSearchParams(),start={query:params.get('q')||'',brand:params.get('brand')||'all',category:params.get('category')||'all',budget:params.get('budget')||'0'};
  const [query,setQuery]=useState(start.query),[brand,setBrand]=useState(brands.includes(start.brand)?start.brand:'all'),[category,setCategory]=useState(categories.includes(start.category)?start.category:'all'),[budget,setBudget]=useState(start.budget),[sort,setSort]=useState('price-asc'),[hide,setHide]=useState(true);
  useEffect(()=>{setQuery(params.get('q')||'');const b=params.get('brand')||'all',c=params.get('category')||'all';setBrand(brands.includes(b)?b:'all');setCategory(categories.includes(c)?c:'all');setBudget(params.get('budget')||'0');},[params]);
  const results=useMemo(()=>filterLaptops({query,brand,category,budget,sort,hideUnavailable:hide}),[query,brand,category,budget,sort,hide]),storeQuery=[brand!=='all'?brand:'',query,category!=='all'?category:'','laptop'].filter(Boolean).join(' ');
  return <section className="page laptops-page">
    <Heading eyebrow="10 / LAPTOP COLLECTION" description="A curated snapshot with local photos, filters and direct store searches.">FIND YOUR<br/><span className="orange-text">LAPTOP.</span></Heading>
    <div className="laptop-search-panel">
      <div className="laptop-search"><Search size={20}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search model, CPU, GPU8 )‚ " aria-label="Search laptops"/></div>
      <div className="laptop-filters"><Filter size={18}/><NativeSelect label="Brand" value={brand} onChange={setBrand} options={brands.map((value=>({value,label:value==='all'?'All brands':value}))}/><NativeSelect label="Type" value={category} onChange={setCategory} options={categories.map(value=>({value,label:value==='all'?'All types':value}))}/><label><span>Max budget</span><select value={budget} onChange={e=>setBudget(e.target.value)}><option value="0">Any budget</option><option value="50000">Under â‚¹50K</option><option value="80000">Under â‚¹80K</option><option value="100000">Under â‚¹1K</option><option value="150000">Under â‚¹1.5L</option></select></label><NativeSelect label="Sort" value={sort} onChange={setSort} options={[{value:'price-asc',label:'Price: low to high'},{value:'price-desc',label:'Price: high to low/KÝ˜[YN‰Û˜[YIËX™[‰Ðœ˜[™	ˆ[Ù[	ßW_KÏX™[Û\ÜÓ˜[YOH˜ÚXÚË[X™[[œ]\OH˜ÚXÚØ›ÞˆÚXÚÙY^ÚY_HÛÚ[™ÙO^ÙOOœÙ]YJK\™Ù]˜ÚXÚÙY
_KÏ’YHX\šÙYÝ]ÙˆÝØÚÏÛX™[Ù]‚ˆÙ]‚ˆ]ˆÛ\ÜÓ˜[YOH›\Ü\™\Ý[X˜\ˆÜ[žÜ™\Ý[Ë›[™ÝHX]Ú\È[ˆ\ÈÝ\˜]YÛÛXÝ[Û‹ÜÜ[Ü[ˆÜ[“\Ý[™ÈÛ˜\ÚÝÈœ›ÛHHÙ\[X™\ˆŒ‹ÜÜ[Ù]‚ˆÜ™\Ý[Ë›[™ÝÏ]ˆÛ\ÜÓ˜[YOH›\ÜYÜšYžÜ™\Ý[Ë›X\
][OO›ÙXÝØ\™Ù^O^Ú][KšYH›ÙXÝ^ÞÚYš][KšY]Nš][K˜œ˜[™
ÉÈ	ÊÚ][K›˜[YKœ˜[™š][K˜œ˜[™[Ù[š][K›[Ù[Ø]YÛÜžN‰Û\ÜÉË]Z[Î–Ú][K˜ÜK][Kœ˜[JÉÑÐˆSIË][KœÝÜ˜YÙK][K™ÜK][KœØÜ™Y[—K™š[\Š›ÛÛX[ŠKš›Ú[Š	È0­È	ÊKšXÙNš][KœšXÙK[XYÙNš][Kš[XYÙKÝÜ™N‰Ù›\Ø\	Ë\›š][K™›\Ø\ÚXÚÙY]‰ÌŒ‹LKLIËšXÙU\N‰ÜÛ˜\ÚÝ	Ë]˜Z[Xš[]Nš][K˜]˜Z[Xš[]KØXÚYš][K˜ØXÚY_KÏŠ_OÙ]Ž]ˆÛ\ÜÓ˜[YOH™[\K\™\Ý[\ÜÚ^™O^ÌÍŸKÏ““ÈPUÒT‘KÚ•žH™[[Ýš[™ÈHÛÜˆÙX\˜Ú[X^›Ûˆ[™›\Ø\\™XÝKÜÙ]ŸBˆ]ˆÛ\ÜÓ˜[YOH›\Ü\ÝÜ™K\ÙX\˜Ú\ÈÝÜ™S[šÈ™Y^ÜÝÜ™TÙX\˜Ú
	Ø[X^›Û‰ËÝÜ™T]Y\žJ_O”ÙX\˜Ú[X^›Ûˆ›ÜˆÜÝÜ™T]Y\ž_OÔÝÜ™S[šÏÝÜ™S[šÈ™Y^ÜÝÜ™TÙX\˜Ú
	Ù›\Ø\	ËÝÜ™T]Y\žJ_O”ÙX\˜Ú›\Ø\›ÜˆÜÝÜ™T]Y\ž_OÔÝÜ™S[šÏÙ]‚ˆ›ÝO•\È\È›Ý[ˆ^]\Ý]™H\ÝÙˆZ]\ˆ™]Z[\¸ &\È[™[ÜžKˆÚXÚÈH^XÝ[Ù[ÛÙKÝ\œ™[šXÙKÙ[\ˆ[™]˜Z[Xš[]H]HÝÜ™Kˆ[X^›Ûˆ[šÜÈ\™H[Ù[ÙX\˜Ú\Ë›Ý™\šYšYY[X^›ÛˆÝØÚËˆ[XYÙ\ÈÛÛYHœ›ÛHHÚ]Y™]Z[\ˆ\Ý[™ÜËÓ›ÝO‚ˆÜÙXÝ[Û‚ŸB