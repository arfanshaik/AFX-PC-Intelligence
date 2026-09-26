const FAN_POSITIONS = [0, 1, 2];

function Fan({index}) {
  return <span className={`pc-fan pc-fan-${index + 1}`} aria-hidden="true"><i/><b/></span>;
}

export default function PCIllustration({accent='#ff3038',variant=0}) {
  function trackPointer(event) {
    if (event.pointerType !== 'mouse') return;
    const bounds=event.currentTarget.getBoundingClientRect();
    const x=(event.clientX-bounds.left)/bounds.width-.5;
    const y=(event.clientY-bounds.top)/bounds.height-.5;
    event.currentTarget.style.setProperty('--pc-yaw',`${-28+x*22}deg`);
    event.currentTarget.style.setProperty('--pc-pitch',`${y*9}deg`);
  }
  function resetPointer(event) {
    event.currentTarget.style.removeProperty('--pc-yaw');
    event.currentTarget.style.removeProperty('--pc-pitch');
  }
  return <div
    className={`pc-illustration pc-model pc-model-${variant % 5}`}
    role="img"
    aria-label="Interactive three-dimensional glass PC tower with illuminated cooling fans"
    style={{'--pc-accent':accent}}
    onPointerMove={trackPointer}
    onPointerLeave={resetPointer}
  >
    <span className="pc-model__aura" aria-hidden="true"/>
    <span className="pc-model__floor" aria-hidden="true"/>
    <div className="pc-model__cube" aria-hidden="true">
      <div className="pc-face pc-face--front">
        <span className="pc-front-mark">AFX / AIRFLOW</span>
        <div className="pc-front-vents">{Array.from({length:9},(_,i)=><i key={i}/>)}</div>
        {FAN_POSITIONS.map((index)=><Fan key={index} index={index}/>)}
        <span className="pc-front-led"/>
      </div>
      <div className="pc-face pc-face--glass">
        <span className="pc-glass-reflection"/>
        <span className="pc-motherboard"/>
        <span className="pc-mainboard-chip"><i/></span>
        <span className="pc-memory-stick pc-memory-stick-1"/>
        <span className="pc-memory-stick pc-memory-stick-2"/>
        <span className="pc-gpu"><i/><b>AFX GRAPHICS</b></span>
        <span className="pc-cable pc-cable-1"/>
        <span className="pc-cable pc-cable-2"/>
        <span className="pc-glass-fan"><i/><b/></span>
        <span className="pc-glass-fan pc-glass-fan-2"><i/><b/></span>
        <span className="pc-glass-light"/>
      </div>
      <div className="pc-face pc-face--top">
        <span className="pc-top-vents">{Array.from({length:8},(_,i)=><i key={i}/>)}</span>
        <span className="pc-top-button"/>
      </div>
      <div className="pc-face pc-face--back"><span>AFX / REAR I/O</span></div>
    </div>
    <span className="pc-model__caption" aria-hidden="true">MODEL {String((variant % 5)+1).padStart(2,'0')} / AFX</span>
  </div>;
}
