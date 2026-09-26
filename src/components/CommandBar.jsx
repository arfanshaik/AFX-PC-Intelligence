import {useEffect,useRef,useState,useSyncExternalStore} from 'react';
import {ArrowUpRight,Mic,MicOff,X,MessageCircle,Volume2} from 'lucide-react';
import {createRecognition,recognitionAvailable} from '../services/speechRecognition';
import {voiceAssistant} from '../services/voiceAssistant';
import {requestChatReply} from '../services/chatClient';
import {localChatReply} from '../services/chatEngine';
import {useApp} from '../hooks/useApp';
import {ProductCard,StoreLink} from './ProductCard';
import {storeSearch} from '../data/laptops';
import {productQuery} from '../services/productSearch';
const welcome={role:'assistant',content:'Hi, I’m Arfan. Tell me your budget, ask a PC question, or tell me what you want to improve.',mode:'guide'};
const suggestions=['Gaming laptops under 80k','Find a 1TB SSD','My laptop is overheating','Build a gaming PC for 80k'];
export default function CommandBar(){
  const {go,runCommand,notice,setNotice,currentBuild}=useApp();
  const [text,setText]=useState(''),[listening,setListening]=useState(false);
  const [open,setOpen]=useState(Boolean(globalThis.__AFX_INLINE_PREVIEW__));
  const [messages,setMessages]=useState([welcome]),[pending,setPending]=useState(false);
  const [mode,wetMode]=useState('guide'),[connectionNotice,setConnectionNotice]=useState('');
  const input=useRef(),log=useRef(),recognition=useRef(),submitRef=useRef();
  const pendingRef=useRef(false),historyRef=useRef(messages),mounted=useRef(true);
  const voice=useSyncExternalStore(voiceAssistant.subscribe,voiceAssistant.getSnapshot,voiceAssistant.getServerSnapshot);
  const supported=!globalThis.__AFX_INLINE_PREVIEW__ && recognitionAvailable();
  useEffect(()=>{historyRef.current=messages;if(log.current)log.current.scrollTop=log.current.scrollHeight;},[messages,pending]);
  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;};},[]);
  async function submit(raw){
    const value=String(raw).trim().slice(0,2000);
    if(!value||pendingRef.current)return;
    pendingRef.current=true;setPending(true);setOpen(true);setText('');setNotice('');
    const next=[...historyRef.current,{role:'user',content:value}].slice(-30);
    historyRef.current=next;setMessages(next);
    let answer;
    try{answer=await requestChatReply(next,{currentBuild});}
    catch{answer=localChatReply(next,{currentBuild});}
    if(!mounted.current)return;
    const complete=[...next,{role:'assistant',...answer}];
    historyRef.current=complete;setMessages(complete);setMode(answer.mode);
    setConnectionNotice(answer.connectionNotice||'');pendingRef.current=false;setPending(false);
    voiceAssistant.speak(answer.content);
  }
  submitRef.current=submit;
  useEffect(()=>{
    if(!supported)return;
    recognition.current=createRecognition({onState:setListening,onError:setNotice,onText:(value,final)=>{setText(value);if(final)submitRef.current(value);}});
    return()=>recognition.current?.abort();
  },[supported,setSNotice]);
  function mic(){
    if(!supported){setNotice('Voice input is unavailable here. Type your message below.');input.current?.focus();return;}
    if(listening){recognition.current?.abort();return;}
    voiceAssistant.stop();
    try{recognition.current?.start();}
    catch{setNotice('The microphone is busy. You can keep typing.');}
  }
  function useAction(action){if(action.path)go(action.path);else runCommand(action.command);setOpen(false);}
  return <div className={'command-area'+(open?' chat-open':'')}>
    {open&&<section className="chat-panel" aria-label="Chat with Arfan">
      <header className="chat-header">
        <img src="/assets/arfan-assistant.png" alt="" />
        <div><strong>ARFAN</strong><span>{mode==='ai'?'AI connected':mode==='search'?'Retailer search connected':'Built-in PC guide'}</span></div>
        <button type="button" aria-label="Close chat" onClick={()=>setOpen(false)}><X size={20}/></button>
      </header>
      {connectionNotice&&<p className="chat-connection-notice" role="status">{connectionNotice}</p>}
      <div className="chat-messages" role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions" ref={log}>
        {messages.map((message,index)=><article key={index} className={'chat-message chat-message--'+message.role}>
          <span>{message.role==='user'?'YOU':'ARFAN'}</span><p>{message.content}</p>
          {message.products?.length>0&&<div className="chat-product-list">{message.products.map(product=><ProductCard key={product.id} product={product} compact/>)}</div>}
          {message.productSearch&&<div className="chat-store-searches"><StoreLink className="store-amazon" href={storeSearch('amazon',productQuery(message.productSearch))}>Search Amazon</StoreLink><StoreLink className="store-flipkart" href={storeSearch('flipkart',productQuery(message.productSearch))}>Search Flipkart</StoreLink></div>}
          {message.action&&<button className="chat-action" onClick={()=>useAction(message.action)}>{message.action.label}<ArrowUpRight size={16}/></button>}
          {message.role==='assistant'&&index>0&&<button className="chat-replay" aria-label="Read this reply aloud" onClick={()=>{voiceAssistant.setMuted(false);voiceAssistant.unlock();voiceAssistant.speak(message.content);}}><Volume2 size={13}/></button>}
        </article>)}
        {pending&&<p className="chat-pending" role="status">Arfan is replying…</p>}
      </div>
      {messages.length===1&&<div className="chat-suggestions">{suggestions.map(value=><button key={value} onClick={()=>submit(value)}>{value}</button>)}</div>}
    </section>}
    {notice&&<div className="command-notice" role="status"><p>{notice}</p><button aria-label="Dismiss message" onClick={()=>setNotice('')}><X size={18}/></button></div>}
    <form className={'command-bar'+(listening?' listening':'')} onSubmit={event=>{event.preventDefault();submit(text);}}>
      <button type="button" className="chat-toggle" aria-label={open?'Hide conversation':'Chat with Arfan'} aria-expanded={open} onClick={()=>{setOpen(value=>!value);input.current?.focus();}}><MessageCircle size={22}/><span>ASK<br/><b>ARFAN.</b></span></button>
      <input ref={input} id="afx-command" aria-label="Message Arfan" placeholder={listening?'Listening…':'Message Arfan…'} value={text} onChange={e=>setText(e.target.value)} autoComplete="off" maxLength={2000}/>
      <button type="button" className={'mic-button'+(listening?' active':'')} aria-label={listening?'Stop listening':supported?'Speak a message':'Voice input unavailable — type instead'} aria-pressed={listening} onClick={mic}>{supported?<Mic size={20}/>:<MicOff size={20}/>}</button>
      <button className="command-send" type="submit" aria-label="Send message" disabled={!text.trim()||pending}><ArrowUpRight size={23}/></button>
    </form>
    <span className="command-footnote">YOUR MESSAGE. A CLEAR REPLY.</span>
  </div>;
}
