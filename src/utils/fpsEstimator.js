import {partsOf} from '../data/hardware.js';
import {games} from '../data/games.js';
export function estimateFPS(build,gameId='valorant',resolution='1440p',quality='High'){
 const p=partsOf(build),game=games.find(g=>g.id===gameId);if(!p.cpu||!p.gpu||!p.ram||!game)return null;
 const scale={ '1080p':1,'1440p':.72,'4K':.4}[resolution]||.72;
 const settings={Low:1.4,Medium:1.18,High:1,Ultra:.78}[quality]||1;
 const cpuRatio=p.cpu.gaming/65,gpuRatio=p.gpu.gaming/53;
 const blended=1/(game.cpuWeight/cpuRatio+(1-game.cpuWeight)/(gpuRatio*scale*settings));
 const fps=Math.max(8,Math.round(game.base*blended*(p.ram.gb<16?.72:1)));
 return {fps,low:Math.max(5,Math.round(fps*.75)),high:Math.round(fps*1.25),game:game.name,resolution,quality};
}
