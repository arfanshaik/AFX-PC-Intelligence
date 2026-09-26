export const recognitionAvailable=()=>typeof window!=='undefined'&&Boolean(window.SpeechRecognition||window.webkitSpeechRecognition);
export function createRecognition({onText,onState,onError}){
 const API=window.SpeechRecognition||window.webkitSpeechRecognition;if(!API)return null;
 const recognition=new API();recognition.lang='en-IN';recognition.interimResults=true;recognition.continuous=false;
 recognition.onstart=()=>onState(true);
 recognition.onend=()=>onState(false);
 recognition.onresult=(e)=>{const result=e.results[e.resultIndex];onText(result[0].transcript,result.isFinal);};
 recognition.onerror=(e)=>{onState(false);const messages={'not-allowed':'Microphone permission was denied. You can type your command below.','audio-capture':'No microphone was found. Try typing instead.','network':'Voice recognition could not connect. Type your command instead.','no-speech':'No speech was heard. Tap the microphone to try again.'};if(e.error!=='aborted')onError(messages[e.error]||'Voice input is unavailable right now. You can type instead.');};
 return recognition;
}
