import {localChatReply} from './chatEngine.js';
import {searchProducts} from './productSearch.js';
import {shopPath} from './productIntent.js';
let retryAfter=0;
export async function requestChatReply(messages,context){
  const local=localChatReply(messages,context);
  if(local.productSearch){
    const result=await searchProducts(local.productSearch);
    if(result.mode!=='live')return {...local,connectionNotice:result.notice};
    return {...local,mode:'search',products:result.products.slice(0,3),content:result.products.length?'Here are retailer search matches with photos when available. Confirm the exact variant, price and stock at the store.':'The retailer search returned no matching products. Try a broader query or use the store searches below.',connectionNotice:result.notice,action:{label:'See all search results',path:shopPath(local.productSearch)}};
  }
  if(globalThis.__AFX_INLINE_PREVIEW__||globalThis.__AFX_STANDALONE_PREVIEW__||globalThis.location?.protocol==='file:')return local;
  if(Date.now()<retryAfter)return {...local,connectionNotice:'Live AI is unavailable. This reply is from the built-in PC guide.'};
  try{
    const response=await fetch('/.netlify/functions/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:messages.slice(-12).map(({role,content})=>({role,content:content.slice(0,2000)})),currentBuild:context.currentBuild}),signal:AbortSignal.timeout(15000)});
    const result=await response.json();
    if(!response.ok||!result.reply){
      retryAfter=Date.now()+(response.status===404||result.error==='not_configured'?60000:10000);
      return {...local,connectionNotice:'Live AI is unavailable. This reply is from the built-in PC guide.'};
    }
    return {...local,content:result.reply,mode:'ai'};
  }catch{
    retryAfter=Date.now()+10000;
    return {...local,connectionNotice:'Live AI could not connect. The built-in PC guide is still available.'};
  }
}
