import { Bell, Check, ChevronRight, Globe2, LogOut, RotateCcw, ShieldCheck, Smartphone, Volume2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../hooks/useAppData';
import { useAuth } from '../hooks/useAuth';
import FeedbackSection from '../components/FeedbackSection';
import AboutSupport from '../components/AboutSupport';
import './ProfileV2.css';
import './ProfileLanguage.css';

const languages={
  en:{label:'English',mark:'EN',greeting:'Welcome to your practice',prompt:'Begin with one quiet breath'},
  hi:{label:'हिन्दी',mark:'हि',greeting:'अपने अभ्यास में आपका स्वागत है',prompt:'एक शांत श्वास के साथ शुरू करें'},
  kn:{label:'ಕನ್ನಡ',mark:'ಕ',greeting:'ನಿಮ್ಮ ಅಭ್ಯಾಸಕ್ಕೆ ಸ್ವಾಗತ',prompt:'ಒಂದು ಶಾಂತ ಉಸಿರಿನೊಂದಿಗೆ ಪ್ರಾರಂಭಿಸಿ'},
} as const;

export default function Profile(){
  const {data,toggleSetting,setLanguage,reset}=useAppData();
  const {user,logout}=useAuth();
  const navigate=useNavigate();
  const [confirmReset,setConfirmReset]=useState(false);
  const since=user?new Intl.DateTimeFormat('en-IN',{month:'long',year:'numeric'}).format(new Date(user.createdAt)):'';
  const storage=Math.min(100,Math.round(JSON.stringify(data).length/(4.5*1024*1024)*100));
  const selectedLanguage=languages[data.settings.language];
  function signOut(){logout();navigate('/login')}

  return <div className="page profile-v2">
    <section className="profile-hero"><div className="profile-pattern"/><div className="profile-identity"><div className="profile-monogram">{user?.displayName?.[0]?.toUpperCase()}</div><div><span>YOUR PRACTICE SPACE</span><h1>{user?.displayName}</h1><p>@{user?.username} · Since {since}</p></div></div><div className="profile-metrics"><div><strong>{data.streak}</strong><small>day streak</small></div><div><strong>{data.totalJaap.toLocaleString('en-IN')}</strong><small>total Jaap</small></div><div><strong>{data.history.length}</strong><small>sessions</small></div></div></section>
    <section className="profile-section language-section"><header><span>LANGUAGE</span><h2>Your practice, in your words</h2></header><div className="language-switch" role="group" aria-label="App language">{(Object.entries(languages) as [keyof typeof languages,(typeof languages)[keyof typeof languages]][]).map(([code,item])=><button className={data.settings.language===code?'active':''} onClick={()=>setLanguage(code)} key={code}><b>{item.mark}</b><span>{item.label}</span>{data.settings.language===code&&<motion.i layoutId="language-check"><Check/></motion.i>}</button>)}</div><AnimatePresence mode="wait"><motion.div className="language-preview" key={data.settings.language} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:.2}}><div><Globe2/><span>LIVE PREVIEW</span></div><h3>{selectedLanguage.greeting}</h3><p>{selectedLanguage.prompt}</p></motion.div></AnimatePresence><p className="language-note"><Globe2/>Navigation changes immediately. More translated practice content will follow.</p></section>
    <section className="profile-section"><header><span>PRACTICE FEEL</span><h2>Feedback and reminders</h2></header><div className="preference-grid">{([['sound','Chant sounds','A soft bead sound with every count',Volume2],['haptics','Tap feedback','Tactile feedback on supported devices',Smartphone],['reminders','Practice reminders','Keep your chosen practice time visible',Bell]] as const).map(([key,title,text,Icon])=><button onClick={()=>toggleSetting(key)} key={key}><span><Icon/></span><div><b>{title}</b><small>{text}</small></div><i className={data.settings[key]?'on':''}><em/></i></button>)}</div></section>
    <AboutSupport/>
    <FeedbackSection username={user?.username||'Digital Sadhana user'}/>
    <section className="profile-section data-section"><header><span>ACCOUNT & DATA</span><h2>Private on this device</h2></header><div className="storage-status"><span><ShieldCheck/></span><div><b>Local browser storage</b><small>{storage}% of the app’s recommended local capacity used</small><i><em style={{width:`${Math.max(2,storage)}%`}}/></i></div></div><div className="account-actions"><button onClick={()=>setConfirmReset(true)}><RotateCcw/><span><b>Reset my journey</b><small>Permanently remove all practice data</small></span><ChevronRight/></button><button onClick={signOut}><LogOut/><span><b>Sign out</b><small>Keep data saved on this device</small></span><ChevronRight/></button></div></section>
    <p className="profile-version">Digital Sadhana · Local-first V1 · {selectedLanguage.label}</p>
    {confirmReset&&<div className="modal-backdrop"><motion.div className="modal reset-modal" role="alertdialog" aria-modal="true" initial={{scale:.95,opacity:0}} animate={{scale:1,opacity:1}}><button className="modal-close" onClick={()=>setConfirmReset(false)} aria-label="Close"><X/></button><span className="reset-symbol"><RotateCcw/></span><h2>Erase your entire journey?</h2><p>Your Sadhana, Sankalpa, custom mantras, uploaded meditation music, history, Jaap totals, and streaks will be permanently removed from this device.</p><div><button className="secondary" onClick={()=>setConfirmReset(false)}>Keep my data</button><button className="danger" onClick={()=>{reset();setConfirmReset(false)}}>Erase everything</button></div></motion.div></div>}
  </div>
}
