import {useEffect} from 'react';
import {useReducedMotion} from 'framer-motion';
import Lenis from 'lenis';
export default function SmoothScroll(){const reduced=useReducedMotion();useEffect(()=>{if(reduced||matchMedia('(pointer:coarse)').matches)return;const lenis=new Lenis({autoRaf:true,duration:.8,anchors:true,prevent:node=>node.classList?.contains('select-options')||node.classList?.contains('design-track')||node.classList?.contains('menu-overlay')});return()=>lenis.destroy();},[reduced]);return null;}
