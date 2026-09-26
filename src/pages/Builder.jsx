import {useEffect,useState,useRef} from 'react';
import {ArrowUpRight,BookmarkPlus,Check,Download,Trash2} from 'lucide-react';
import {useApp} from '../hooks/useApp';
import {generateBuild} from '../utils/buildGenerator';
import {catalogue,demoBuild,money,purposes,shortMoney} from '../data/hardware';
import {deleteSavedBuild,loadSavedBuilds,saveBuild,savedBuildStorageMode} from '../utils/savedBuilds';
import {Heading,Action,Note} from '../components/Primitives';
import {BuildReveal} from '../components/BuildTools';
import PCIllustration from '../components/PCIllustration';

function validBuild(value) {
  const next={...demoBuild,...(value||{})};
  for (const [key,parts] of Object.entries(catalogue)) {
    if (!parts.some(part=>part.id===next[key])) next[key]=demoBuild[key];
  }
  if (!['1080p','1440p','4K'].includes(next.resolution)) next.resolution='1440p';
  if (!purposes.includes(next.purpose)) next.purpose='Gaming';
  return next;
}

function downloadJSON(item,name='afx-pc-build.json') {
  const note=[
    'AFX PC Intelligence',
    `Workload: ${item.purpose}`,
    `Budget: ${money(Number(item.budget))}`,
    `Estimated build total: ${money(Number(item.total))}`,
    ...Object.entries(item.build).map(([key,value])=>`${key}: ${value}`),
    'Estimated sample prices, not live retailer quotes.',
    'Tower only. Confirm exact manufacturer compatibility before purchase.'
  ].join('\n');
  const url=URL.createObjectURL(new Blob([JSON.stringify({...item,exportNote:note},null,2)],{type:'application/json'}));
  const link=document.createElement('a');
  link.href=url;link.download=name;document.body.append(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}

function SavedBuildCard({item,onLoad,onDelete,onDownload}) {
  const date=new Date(item.savedAt);
  const savedLabel=Number.isNaN(date.getTime())?'SAVED LOCALLY':date.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
  return <article className="saved-build-card">
    <span>{item.purpose} / {savedLabel}</span>
    <h3>{item.name}</h3>
    <p>{money(item.total)} estimated · {money(item.budget)} budget</p>
    <div className="saved-build-actions">
      <button onClick={()=>onLoad(item)}>Load in analyzer ↗</button>
      <button onClick={()=>onDownload(item)}>JSON</button>
      <button onClick={()=>onDelete(item.id)} aria-label={`Delete ${item.name}`}><Trash2 size={15}/></button>
    </div>
  </article>;
}

export default function Builder(){
  const {builder,setCurrentBuild,go}=useApp();
  const [budget,setBudget]=useState(String(builder.budget));
  const [purpose,setPurpose]=useState(builder.purpose);
  const [result,setResult]=useState(null);
  const [savedBuilds,setSavedBuilds]=useState(loadSavedBuilds);
  const [saveNotice,setSaveNotice]=useState('');
  const output=useRef();

  useEffect(()=>{
    setBudget(String(builder.budget));setPurpose(builder.purpose);
    setResult(builder.auto?generateBuild(builder.budget,builder.purpose):null);
  },[builder]);

  function generate(event){
    event?.preventDefault();
    const value=Number(budget);
    const next=value>250000
      ?{error:'This demo catalogue supports budgets up to ₹2,50,000. Try a lower budget.'}
      :generateBuild(value,purpose);
    setResult(next);setSaveNotice('');
    if(!next.error)requestAnimationFrame(()=>output.current?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'}));
  }

  function choose(value){setBudget(String(value));setResult(null);setSaveNotice('');}

  function saveCurrentBuild(){
    if(!result?.build)return;
    const saved=saveBuild({build:result.build,total:result.total,budget:Number(budget),purpose});
    if(!saved){setSaveNotice('This browser could not save locally. Download the JSON copy instead.');return;}
    setSavedBuilds(loadSavedBuilds());setSaveNotice(savedBuildStorageMode()==='session'?'Saved for this preview session. Download JSON to keep a copy.':'Saved on this device. You can reopen it from Saved Builds.');
  }

  function removeBuild(id){
    if(deleteSavedBuild(id)){setSavedBuilds(loadSavedBuilds());setSaveNotice('Saved build removed.');}
  }

  function loadBuild(item){setCurrentBuild(validBuild(item.build));go('/analyzer');}

  return <section className="page builder-page">
    <Heading eyebrow="01 / SMART PC BUILDER" description="Tell me the number. We’ll make every rupee count.">YOUR<br/><span className="orange-text">BUDGET?</span></Heading>
    <form onSubmit={generate} className="builder-controls">
      <div className="budget-side">
        <label className="eyebrow" htmlFor="budget">MY TOWER BUDGET / INR</label>
        <div className="budget-input"><span>₹</span><input id="budget" aria-label="PC budget in rupees" type="number" min="1" max="250000" step="1" required value={budget} onChange={event=>{setBudget(event.target.value);setResult(null);setSaveNotice('');}}/></div>
        <input className="budget-slider" aria-label="Budget slider" type="range" min="40000" max="250000" step="1000" value={Math.min(250000,Math.max(40000,Number(budget)||40000))} onChange={event=>choose(event.target.value)}/>
        <div className="range-ends"><span>₹40K</span><span>₹2.5L</span></div>
        <div className="budget-presets">{[50000,75000,100000,150000,200000].map(value=><button className={Number(budget)===value?'selected':''} type="button" key={value} onClick={()=>choose(value)}>{shortMoney(value)}</button>)}</div>
      </div>
      <div className="purpose-side">
        <span className="eyebrow">AND WHAT DO YOU DO?</span>
        <div className="purpose-choices" role="group" aria-label="PC workload">{purposes.map(value=><button type="button" aria-pressed={purpose===value} className={purpose===value?'selected':''} key={value} onClick={()=>{setPurpose(value);setResult(null);setSaveNotice('');}}>{value.toUpperCase()}{purpose===value&&<ArrowUpRight size={18}/>}</button>)}</div>
        <Action type="submit" data-cursor="BUILD">Find my build</Action>
        <Note>Try saying “build me a gaming PC for one lakh”.</Note>
      </div>
    </form>

    {savedBuilds.length>0&&<section className="saved-builds" aria-labelledby="saved-builds-title">
      <header><div><span className="eyebrow">{savedBuildStorageMode()==='session'?'THIS PREVIEW SESSION':'LOCAL / THIS DEVICE'}</span><h2 id="saved-builds-title">SAVED BUILDS.</h2></div><span className="note">{savedBuilds.length} of 12 saved</span></header>
      <div className="saved-build-list">{savedBuilds.map(item=><SavedBuildCard key={item.id} item={item} onLoad={loadBuild} onDelete={removeBuild} onDownload={value=>downloadJSON(value,`afx-pc-build-${value.id.slice(0,8)}.json`)}/>)}</div>
    </section>}
    {saveNotice&&<p className="saved-build-notice" role="status">{saveNotice}</p>}
    {result?.error&&<p className="error-message" role="alert">{result.error}</p>}
    {result?.build&&<div className="generated-result" ref={output}>
      <div className="build-intro"><div><span className="eyebrow"><Check size={16}/> CATALOGUE COMPATIBILITY CHECKS PASSED</span><h2>THIS IS<br/><span className="orange-text">YOUR BUILD.</span></h2><p>{result.reason}</p></div><PCIllustration accent="#ff343b" variant={2}/></div>
      <BuildReveal build={result.build}/>
      <div className="build-total"><span>YOUR BUILD, ESTIMATED.</span><strong>{money(result.total)}</strong><small>{money(result.remaining)} left in your budget.</small></div>
      <Note>Estimated prices. Actual pricing may vary. {result.scope}</Note>
      <div className="result-actions">
        <Action onClick={()=>{setCurrentBuild(result.build);go('/analyzer');}}>Analyze this build</Action>
        <Action secondary onClick={()=>{setCurrentBuild(result.build);go('/compatibility');}}>Check the details</Action>
        <button className="text-action" onClick={saveCurrentBuild}><BookmarkPlus size={18}/> Save in AFX</button>
        <button className="text-action" onClick={()=>downloadJSON({build:result.build,total:result.total,budget:Number(budget),purpose},'afx-pc-build.json')}><Download size={18}/> Download JSON</button>
      </div>
    </div>}
  </section>;
}
