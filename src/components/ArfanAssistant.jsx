import {useRef,useState,useSyncExternalStore} from 'react';
import {motion,useReducedMotion} from 'framer-motion';
import {voiceAssistant} from '../services/voiceAssistant';
import {Volume2,Pause,Play} from 'lucide-react';
export function VoiceVisualizer(){const v=useSyncExternalStore(voiceAssistant.subscribe,voiceAssistant.getSnapshot,voiceAssistant.getServerSnapshot);return <div className={`voice-visualizer ${v.speaking?'active':''}`} aria-hidden="true">{[0,1,2,3,4].map(i=><i key={i} style={{'--i':i,'--level':v.level}}/>)}</div>;}
export function AssistantBubble({compact=false}){const v=useSyncExternalStore(voiceAssistant.subscribe,voiceAssistant.getSnapshot,voiceAssistant.getServerSnapshot);return <div className={`assistant-bubble ${compact?'compact':''}`}><div className="bubble-top"><span className="eyebrow">ARFAN / {v.speaking?'SPEAKING':v.paused?'PAUSED':'YOUR ASSISTANT'}</span><VoiceVisualizer/></div><p aria-live="polite">{v.text||'Your next PC starts with a conversation.'}</p><div className="bubble-actions">{v.speaking||v.paused?<button onClick={()=>v.paused?voiceAssistant.resume():voiceAssistant.pause()} aria-label={v.paused?'Resume speech':'Pause speech'}>{v.paused?<Play size={15}/>:<Pause size={15}/>}</button>:<button onClick={()=>voiceAssistant.speak(v.text||'Your next PC starts with a conversation.')} disabled={v.muted} aria-label="Replay assistant voice"><Volume2 size={15}/></button>}{v.notice&&<small role="status">{v.notice}</small>}</div></div>;}
export default function ArfanAssistant({small=false,bubble=false}){
 const reduced=useReducedMotion(),v=useSyncExternalStore(voiceAssistant.subscribe,voiceAssistant.getSnapshot,voiceAssistant.getServerSnapshot),[tilt,setTilt]=useState({x:0,y:0});
 return <div className={`arfan-scene ${small?'small':''} ${v.speaking?'speaking':''}`} onPointerMove={e=>{if(reduced||e.pointerType!=='mouse'||small)return;const r=e.currentTarget.getBoundingClientRect();setTilt({x:(e.clientX-r.left-r.width/2)/40,y:(e.clientY-r.top-r.height/2)/50});}} onPointerLeave={()=>setTilt({x:0,y:0})}>
 <div className="assistant-orbit" aria-hidden="true"/><div className="speech-ring one" aria-hidden="true"/><div className="speech-ring two" aria-hidden="true"/>
 <motion.div className="character-parallax" animate={reduced?{}:{x:tilt.x,y:tilt.y}} transition={{type:'spring',stiffness:50,damping:20}}><motion.img className="arfan-character" src="/assets/arfan-assistant.png" alt="Arfan, your anime PC assistant in an orange T-shirt" width="1024" height="1536" draggable="false" animate={reduced?{}:{y:[0,-7,0],rotate:[-.5,.5,-.5],scale:v.speaking?[1,1.009,1]:1}} transition={{duration:v.speaking?1.8:5,repeat:Infinity,ease:'easeInOut'}}/></motion.div>
 {!small&&<><span className="character-label">YOUR PC.<br/>UNDERSTOOD.</span><span className="orbit-caption">MEET YOUR NEW BUILD BUDDY</span></>}
 {bubble&&<AssistantBubble compact={small}/>}
 </div>;
}
