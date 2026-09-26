import {filterProducts,productCategories} from '../data/products.js';
export function productQuery(filters={}){
  const category=productCategories.find(item=>item[0]===filters.category);
  return [filters.query||'',category&&category[0]!=='all'?category[2]:!filters.query?'computer hardware':'',Number(filters.budget)>0?'under '+Number(filters.budget):''].filter(Boolean).join(' ').slice(0,180);
}
export function localProductSearch(filters={}){return {mode:'catalogue',products:filterProducts(filters),hasMore:false,page:1,notice:'Saved listings · live search is not connected. Use the store buttons for current results.'};}
export async function searchProducts(filters={}, {signal,fetchImpl=globalThis.fetch}={}){
  const local=localProductSearch(filters);
  if(globalThis.__AFX_INLINE_PREVIEW__||globalThis.__AFX_STANDALONE_PREVIEW__||globalThis.location?.protocol==='file:')return local;
  const params=new URLSearchParams({q:productQuery(filters),store:filters.store||'all',page:String(filters.page||1),category:filters.category||'all',budget:String(filters.budget||0)});
  try{
    const response=await fetchImpl('/.netlify/functions/products?'+params,{signal:signal?AbortSignal.any([signal,AbortSignal.timeout(18000)]):AbortSignal.timeout(18000)});
    const result=await response.json();
    if(!response.ok||!Array.isArray(result.products))return {...local,notice:result.error==='not_configured'||response.status===404?local.notice:'Retailer search is temporarily unavailable. Showing matching saved listings.'};
    return result;
  }catch(error){if(signal?.aborted)throw error;return {...local,notice:'Retailer search could not connect. Showing matching saved listings; store searches are still available.'};}
}
