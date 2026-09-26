import {useRef,useState,lazy,Suspense} from 'react';
import {motion} from 'framer-motion';
import {ArrowLeft,ArrowRight,ArrowUpRight} from 'lucide-react';
import {designBriefs,generateBuild} from '../utils/buildGenerator';
import {partsOf,money} from '../data/hardware';
import {Heading} from '../components/Primitives';
import PCIllustration from '../components/PCIllustration';
import {useApp} from '../hooks/useApp';
function RadialPoints({variant}){const insets=variant%2===0?[12,24,36]:[10,20,30];return <>{insets.map((inset,i)=><span key={inset} className="radial-ring" style={{inset: inset+'%',borderStyle:i===1?'dashed':'solid'}}/>)}{Array.from({length:variant%2===0?24:16},(_,i)=><i key={i} className="radial-point" style={{'--rot':(360/Memath.(index))*i'}}/>)}</>;}
