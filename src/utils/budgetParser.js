const small={zero:0,one:1,a:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,seventeen:17,eighteen:18,nineteen:19,twenty:20,thirty:30,forty:40,fifty:50,sixty:60,seventy:70,eighty:80,ninety:90};
export function parseBudget(raw){
 if(typeof raw!=='string')return null;
 if(/-\s*\d/.test(raw))return null;
 let s=raw.toLowerCase().replace(/,/g,'').replace(/-/g,' ').replace(/rupees|rs\.?|₹/g,' ').replace(/lakhs/g,'lakh');
 s=s.replace(/one and a half lakh/g,'1.5 lakh').replace(/(?:a|one) lakh and a half/g,'1.5 lakh').replace(/one and a half thousand/g,'1.5 thousand');
 const compact=s.match(/\b(\d+(?:\.\d+)?)\s*(k|l|lakh|thousand)\b/);
 if(compact){let n=Number(compact[1])*(['l','lakh'].includes(compact[2])?100000:1000);const tail=s.slice(compact.index+compact[0].length).match(/(?:and\s+)?(\d+)\s*thousand/);if(tail&&['l','lakh'].includes(compact[2]))n+=Number(tail[1])*1000;return Math.round(n);}
 const numeric=s.match(/(?:^|\s)(\d{4,7})(?=$|\s|\.)/);if(numeric)return Number(numeric[1]);
 if(!/\b(thousand|lakh|hundred)\b/.test(s))return null;
 const tokens=s.match(/[a-z]+|\d+(?:\.\d+)?/g)||[];let total=0,group=0,seen=false;
 for(const t of tokens){if(t in small){group+=small[t];seen=true;}else if(/^\d+(?:\.\d+)?$/.test(t)){group+=Number(t);seen=true;}else if(t==='hundred'){group=(group||1)*100;seen=true;}else if(t==='thousand'||t==='lakh'){total+=(group||1)*(t==='thousand'?1000:100000);group=0;seen=true;}else if(t!=='and'){group=0;}}
 return seen?Math.round(total+group):null;
}
