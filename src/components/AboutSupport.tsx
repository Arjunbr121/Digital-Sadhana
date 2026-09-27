import { ChevronRight, FileText, HeartHandshake, Info, Mail, ShieldCheck, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import './AboutSupport.css';

type Sheet='about'|'terms'|'privacy'|null;

const sheetContent={
  about:{eyebrow:'ABOUT DIGITAL SADHANA',title:'A private space for daily practice',body:<><p>Digital Sadhana helps you build a steady spiritual rhythm through mantra Jaap, meditation, Sankalpa, and time-bound Sadhana journeys.</p><h3>What the app helps you do</h3><ul><li>Count every mantra repetition and continue saved sessions.</li><li>Create structured 7, 21, or 40-day Sadhana journeys.</li><li>Keep daily Sankalpa intentions and practice streaks.</li><li>Meditate with a timer, peaceful sounds, and your own MP3.</li><li>Review your Jaap totals, history, progress, and milestones.</li></ul><p>It is designed as a quiet companion for consistency, not as a replacement for spiritual, medical, or professional guidance.</p></>},
  terms:{eyebrow:'TERMS & CONDITIONS',title:'Simple terms for a personal practice',body:<><p>By using Digital Sadhana, you agree to use it for personal wellbeing and practice tracking. The app is provided as-is and its counters, reminders, streaks, and insights should not be treated as professional advice.</p><h3>Your responsibility</h3><ul><li>Keep access to your device and local account secure.</li><li>Use uploaded audio only when you have permission to do so.</li><li>Maintain your own backup if information is important to you.</li></ul><p>Features may change as the product improves. Continued use after an update means you accept the updated experience and terms shown in the app.</p></>},
  privacy:{eyebrow:'PRIVACY & STORAGE',title:'Your practice stays on this device',body:<><p>Digital Sadhana has no backend or cloud account. Your profile, password hash, custom mantras, Sadhana, Sankalpa, uploaded MP3s, practice history, totals, and settings are stored in this browser’s local storage.</p><h3>Important to understand</h3><ul><li>No practice data is sent to the developer automatically.</li><li>Clearing browser data, uninstalling the app, resetting your journey, or changing devices can permanently erase your information.</li><li>There is currently no cloud sync, recovery, or cross-device transfer.</li><li>Feedback is sent only when you choose to open your email app and send it.</li></ul><p>Browser notification permission is optional and can be changed in your device or browser settings.</p></>},
};

export default function AboutSupport(){
  const [sheet,setSheet]=useState<Sheet>(null);
  const active=sheet?sheetContent[sheet]:null;
  return <section className="profile-section about-support">
    <header><span>ABOUT & SUPPORT</span><h2>Built for your inner practice</h2></header>
    <div className="about-grid">
      <button onClick={()=>setSheet('about')}><span><Info/></span><div><b>What we are</b><small>Our purpose and what the app helps you do</small></div><ChevronRight/></button>
      <button onClick={()=>setSheet('terms')}><span><FileText/></span><div><b>Terms & Conditions</b><small>Simple terms for using Digital Sadhana</small></div><ChevronRight/></button>
      <button onClick={()=>setSheet('privacy')}><span><ShieldCheck/></span><div><b>Privacy & device storage</b><small>How your local practice data is handled</small></div><ChevronRight/></button>
      <a href="mailto:arjunbr270@gmail.com?subject=Digital%20Sadhana%20support"><span><HeartHandshake/></span><div><b>Contact the developer</b><small>arjunbr270@gmail.com</small></div><Mail/></a>
    </div>
    <AnimatePresence>{active&&<motion.div className="about-sheet-backdrop" onMouseDown={()=>setSheet(null)} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><motion.div className="about-sheet" role="dialog" aria-modal="true" aria-labelledby="about-sheet-title" onMouseDown={event=>event.stopPropagation()} initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} transition={{type:'spring',damping:28,stiffness:300}}><div className="sheet-handle"/><button className="sheet-close" onClick={()=>setSheet(null)} aria-label="Close"><X/></button><span>{active.eyebrow}</span><h2 id="about-sheet-title">{active.title}</h2><div className="sheet-copy">{active.body}</div><a className="sheet-contact" href="mailto:arjunbr270@gmail.com?subject=Digital%20Sadhana%20question"><Mail/>Questions? Contact Arjun</a></motion.div></motion.div>}</AnimatePresence>
  </section>
}
