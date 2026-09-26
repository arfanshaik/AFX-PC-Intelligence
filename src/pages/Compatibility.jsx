import {useApp} from '../hooks/useApp';
import {ComponentForm,CompatibilityResults} from '../components/BuildTools';
import {Heading,NextLink} from '../components/Primitives';
export default function Compatibility(){const{currentBuild,setCurrentBuild}=useApp();return <section className="page"><Heading eyebrow="04 / COMPATIBILITY" description="Good parts are better when they work together.">DOES<br/><span className="orange-text">IT FIT?</span></Heading><div className="hardware-chain" aria-hidden="true"><span>CPU</span><i>↔</i><span>BOARD</span><i>↔</i><span>MEMORY</span><i>↔</i><span>CASE</span></div><ComponentForm build={currentBuild} onChange={setCurrentBuild}/><CompatibilityResults build={currentBuild}/><NextLink to="/analyzer">Understand this build</NextLink></section>;}
