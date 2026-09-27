import { CalendarDays, CircleCheckBig, Flame, Flower2 as Lotus, Home, Library, Moon, PlusCircle, Sun, User } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAppData } from '../hooks/useAppData';
import RouteLoader from './RouteLoader';

const labels={en:{home:'Home',mantras:'Mantras',meditate:'Meditate',sadhana:'Sadhana',sankalpa:'Sankalpa',progress:'Progress',profile:'Profile',history:'History'},hi:{home:'होम',mantras:'मंत्र',meditate:'ध्यान',sadhana:'साधना',sankalpa:'संकल्प',progress:'प्रगति',profile:'प्रोफ़ाइल',history:'इतिहास'},kn:{home:'ಮುಖಪುಟ',mantras:'ಮಂತ್ರಗಳು',meditate:'ಧ್ಯಾನ',sadhana:'ಸಾಧನೆ',sankalpa:'ಸಂಕಲ್ಪ',progress:'ಪ್ರಗತಿ',profile:'ಪ್ರೊಫೈಲ್',history:'ಇತಿಹಾಸ'}};

export default function Shell(){
  const location=useLocation();
  const {data,toggleSetting}=useAppData();
  const [transitioning,setTransitioning]=useState(true);
  const text=labels[data.settings.language];
  const main=[['/home',text.home,Home],['/mantras',text.mantras,Library],['/meditate',text.meditate,Lotus],['/progress',text.progress,Flame],['/profile',text.profile,User]] as const;
  const more=[['/sadhana/new',text.sadhana,PlusCircle],['/sankalpa',text.sankalpa,CircleCheckBig],['/history',text.history,CalendarDays]] as const;
  const dark=data.settings.dark;
  useEffect(()=>{setTransitioning(true);const timer=window.setTimeout(()=>setTransitioning(false),620);return()=>window.clearTimeout(timer)},[location.pathname]);
  return <div className="app-shell">
    <AnimatePresence>{transitioning&&<RouteLoader/>}</AnimatePresence>
    <button className="global-theme-toggle" onClick={()=>toggleSetting('dark')} aria-label={dark?'Switch to light theme':'Switch to dark theme'} title={dark?'Light theme':'Dark theme'}>{dark?<Sun/>:<Moon/>}</button>
    <aside className="sidebar"><div className="brand"><span>ॐ</span><div>Digital<br/><strong>Sadhana</strong></div></div><nav>{main.slice(0,2).map(([to,label,Icon])=><NavLink key={to} to={to} className={({isActive})=>isActive?'active':''}><Icon size={20}/><span>{label}</span></NavLink>)}{more.slice(0,2).map(([to,label,Icon])=><NavLink key={to} to={to} className={({isActive})=>isActive?'active':''}><Icon size={20}/><span>{label}</span></NavLink>)}{main.slice(2).map(([to,label,Icon])=><NavLink key={to} to={to} className={({isActive})=>isActive?'active':''}><Icon size={20}/><span>{label}</span></NavLink>)}<NavLink to="/history"><CalendarDays size={20}/><span>{text.history}</span></NavLink></nav><div className="sidebar-quote"><span>आज का अभ्यास</span><p>Return to yourself, one repetition at a time.</p></div></aside>
    <main className="content"><AnimatePresence mode="wait"><motion.div key={location.pathname} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.2}}><Outlet/></motion.div></AnimatePresence></main>
    <nav className="bottom-nav">{main.map(([to,label,Icon])=><NavLink key={to} to={to} className={({isActive})=>isActive?'active':''}><Icon size={21}/><span>{label}</span></NavLink>)}</nav>
  </div>
}
