export const assistantLines={home:'Hi, this is Arfan. Say what to do, I am here.',designs:'Here are the PC designs.',budget:'Say your budget and AFX PC Intelligence is here.',analyzer:"Tell me your components and I'll analyze your PC.",compatibility:"Let's check if everything works together.",upgrade:"Let's see what gives you the biggest upgrade.",results:'Your analysis is ready.'};
const audioFiles=import.meta.glob('/public/audio/*.{mp3,wav,ogg}',{eager:true,query:'?url',import:'default'});
const audioNames={home:'intro',designs:'designs',budget:'budget'};
const read=(key,fallback)=>{try{return localStorage.getItem(key)??fallback;}catch{return fallback;}};
const save=(key,value)=>{try{localStorage.setItem(key,value);}catch{/* Private browsing: session preference still works. */}};
export function rankVoices(voices){
 const males=/\b(david|daniel|alex|rishi|ravi|prabhat|george|mark|guy|ryan|andrew|christopher|brian|james|oliver|male)\b/i;
 const females=/\b(female|zira|susan|samantha|victoria|karen|moira|hazel|heera|neerja|jenny|aria)\b/i;
 return [...voices].filter(v=>/^en/i.test(v.lang)).sort((a,b)=>score(b)-score(a));
 function score(v){return (males.test(v.name)&&!females.test(v.name)?100:0)+(v.lang==='en-IN'?30:v.lang==='en-GB'?20:v.lang==='en-US'?10:0)-(females.test(v.name)?50:0);}
}
class VoiceAssistant {
 state={speaking:false,paused:false,muted:Boolean(globalThis.__AFX_INLINE_PREVIEW__)||read('afx-muted','false')==='true',text:'',notice:'',voiceName:'',voices:[],level:0};
 listeners=new Set();token=0;audio=null;utterance=null;context=null;analyser=null;raf=0;watchdog=null;
 constructor(){if(typeof window!=='undefined'&&'speechSynthesis'in window){this.loadVoices();window.speechSynthesis.addEventListener('voiceschanged',this.loadVoices);}}
 subscribe=(fn)=>{this.listeners.add(fn);return()=>this.listeners.delete(fn);};
 getSnapshot=()=>this.state;
 getServerSnapshot=()=>this.state;
 set=(next)=>{this.state={...this.state,...next};this.listeners.forEach(fn=>fn());};
 loadVoices=()=>{const voices=rankVoices(window.speechSynthesis.getVoices());const selected=voices.find(v=>v.voiceURI===read('afx-voice',''))||voices[0];this.set({voices,voiceName:selected?.name||''});};
 selectVoice=(uri)=>{save('afx-voice',uri);this.loadVoices();};
 setMuted=(value)=>{save('afx-muted',String(value));if(value)this.stop();this.set({muted:value});};
 unlock=()=>{try{const Context=window.AudioContext||window.webkitAudioContext;if(Context){this.context??=new Context();void this.context.resume().catch(()=>{});}}catch{/* TTS remains available. */}};
 stop=()=>{this.token++;clearTimeout(this.watchdog);cancelAnimationFrame(this.raf);if(this.audio){this.audio.onended=null;this.audio.onerror=null;this.audio.pause();this.audio=null;}if('speechSynthesis'in window)window.speechSynthesis.cancel();this.utterance=null;this.set({speaking:false,paused:false,level:0});};
 pause=()=>{if(this.audio)this.audio.pause();else window.speechSynthesis?.pause();this.set({paused:true,speaking:false});};
 resume=()=>{if(this.audio)void this.audio.play().catch(()=>this.set({notice:'Tap replay to hear this line.'}));else window.speechSynthesis?.resume();this.set({paused:false,speaking:true});};
 speak=(text,key)=>{
  this.stop();const token=this.token;this.set({text,notice:''});if(this.state.muted)return;
  const name=audioNames[key];const file=name&&Object.entries(audioFiles).find(([k])=>new RegExp(`/${name}\\.(mp3|wav|ogg)$`).test(k));
  if(file){this.playAudio(file[1],text,token);return;}
  this.tts(text,token);
 };
 tts=(text,token)=>{
  if(token!==this.token||this.state.muted)return;
  if(!('speechSynthesis'in window)){this.set({notice:'Voice output is unavailable here. Captions are always on.'});return;}
  const utterance=new SpeechSynthesisUtterance(text);this.utterance=utterance;
  const voice=this.state.voices.find(v=>v.voiceURI===read('afx-voice',''))||this.state.voices[0];if(voice)utterance.voice=voice;
  utterance.lang=voice?.lang||'en-IN';utterance.rate=.97;utterance.pitch=.92;utterance.volume=1;
  utterance.onstart=()=>{if(token===this.token)this.set({speaking:true,paused:false,level:.6});};
  utterance.onboundary=()=>{if(token===this.token)this.set({level:.35+Math.random()*.55});};
  const finish=()=>{if(token===this.token){clearTimeout(this.watchdog);this.set({speaking:false,paused:false,level:0});}};
  utterance.onend=finish;
  utterance.onerror=()=>{finish();if(token===this.token)this.set({notice:'Voice could not play. Captions are shown; use replay or select another voice in About.'});};
  try{window.speechSynthesis.speak(utterance);this.watchdog=setTimeout(()=>{if(token===this.token){this.stop();this.set({notice:'Speech timed out. Tap replay to try again.'});}},Math.max(16000,text.length*170));}catch{finish();this.set({notice:'Voice is unavailable. You can still use every tool.'});}
 };
 playAudio=(url,text,token)=>{
  const audio=new Audio(url);this.audio=audio;audio.preload='auto';
  audio.onplay=()=>{if(token===this.token)this.set({speaking:true,paused:false});};
  audio.onended=()=>{if(token===this.token){cancelAnimationFrame(this.raf);this.set({speaking:false,level:0});}};
  audio.onerror=()=>{if(token===this.token){this.audio=null;this.tts(text,token);}};
  if(this.context){try{const source=this.context.createMediaElementSource(audio);this.analyser=this.context.createAnalyser();this.analyser.fftSize=128;source.connect(this.analyser);this.analyser.connect(this.context.destination);const data=new Uint8Array(this.analyser.frequencyBinCount);const tick=()=>{if(token!==this.token)return;this.analyser.getByteFrequencyData(data);this.set({level:data.reduce((a,b)=>a+b,0)/data.length/255});this.raf=requestAnimationFrame(tick);};tick();}catch{/* Playback works without the visualizer. */}}
  void audio.play().catch(()=>{if(token===this.token){this.audio=null;this.tts(text,token);}});
 };
}
export const voiceAssistant=new VoiceAssistant();
