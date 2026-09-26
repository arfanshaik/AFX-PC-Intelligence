import {useEffect,useRef,useState} from 'react';
import {ArrowUpRight,ImageOff,Maximize2,X} from 'lucide-react';
import {storeSearch} from '../data/laptops';
import {money} from '../data/hardware';
import '../styles-shop.css';
export function ProductPhoto({src,title,compact=false}){
  const [failed,setFailed]=useState(false),dialog=useRef();
  useEffect(()=>setFailed(false),[src]);
  return <>
    <button type="button" className={'product-photo'+(compact?' product-photo--compact':'')} onClick={()=>dialog.current?.showModal()} disabled={!src||failed} aria-label={'Enlarge photo of '+title}>
      {src&&!failed?<img src={src} alt={title} width="640" height="480" loading="lazy" onError={()=>setFailed(true)}/>:<span className="product-photo-missing"><ImageOff size={30}/><span>Photo unavailable</span></span>}
      {!compact&&src&&!failed&&<Maximize2 size={16} className="product-photo-zoom"/>}
    </button>
    <dialog className="product-photo-dialog" ref={dialog} onClick={event=>{if(event.target===event.currentTarget)dialog.current.close();}}><button aria-label="Close product photo" onClick={()=>dialog.current.close()}><X size={22}/></button><img src={src||undefined} alt={title}/><p>{title}</p></dialog>
  </>;
}
export const StoreLink=({href,children,className=''})=><a href={href} className={className} target="_blank" rel="noopener noreferrer">{children}<ArrowUpRight size={15} aria-hidden="true"/></a>;
export function ProductCard({product,compact=false}){
  const other=product.store==='amazon'?'flipkart':'amazon',storeName=product.store==='amazon'?'Amazon':'Flipkart';
  const date=product.checkedAt?new Date(product.checkedAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}):'';
  return <article className={'product-card'+(compact?' product-card--compact':'')}>
    <ProductPhoto src={product.image} title={product.title} compact={compact}/>
    <div className="product-card-info"><span className="product-store">{storeName}{product.sponsored?' · Sponsored':''}</span><h2>{product.title}</h2>{!compact&&<p className="product-details">{[product.model,product.details].filter(Boolean).join(' · ')}</p>}
      <strong className="product-price">{product.price===null||product.price===undefined?'Check store':money(product.price)}</strong>
      <small className="product-date">{product.priceType==='snapshot'?'Snapshot · ':product.priceType==='indexed'?'Indexed price · ':'Search price · '}{date}{product.cached?' · cached':''}{product.availability==='out-of-stock'?' · marked out of stock':''}</small>
      <div className="product-links"><StoreLink className={'store-'+product.store} href={product.url}>View {storeName}</StoreLink><StoreLink className={'store-'+other} href={storeSearch(other,product.title+' '+(product.model||''))}>Search {other==='amazon'?'Amazon':'Flipkart'}</StoreLink></div>
    </div>
  </article>;
}
