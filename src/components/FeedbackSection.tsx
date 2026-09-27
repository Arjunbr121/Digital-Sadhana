import { Heart, Mail, Meh, MessageCircle, Send, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { FormEvent, useState } from 'react';
import './FeedbackSection.css';

const moods=[
  {id:'Loved it',label:'Loved it',Icon:Heart},
  {id:"It's okay",label:"It's okay",Icon:Meh},
  {id:'Needs work',label:'Needs work',Icon:Sparkles},
] as const;

export default function FeedbackSection({username}:{username:string}){
  const [mood,setMood]=useState<(typeof moods)[number]['id']>('Loved it');
  const [message,setMessage]=useState('');
  const [error,setError]=useState(false);

  function send(event:FormEvent){
    event.preventDefault();
    if(!message.trim()){setError(true);return}
    setError(false);
    const subject=encodeURIComponent(`Digital Sadhana feedback - ${mood}`);
    const body=encodeURIComponent(`Hello Arjun,\n\nMy experience: ${mood}\n\n${message.trim()}\n\nFrom: ${username}\nSent from Digital Sadhana`);
    window.location.href=`mailto:arjunbr270@gmail.com?subject=${subject}&body=${body}`;
  }

  return <section className="profile-section feedback-section">
    <header><span>SHAPE WHAT COMES NEXT</span><h2>Share your experience</h2></header>
    <div className="feedback-shell">
      <div className="feedback-intro"><span><MessageCircle/></span><div><h3>Your voice matters</h3><p>Tell Arjun what feels good, what feels difficult, or what would make your daily practice better.</p></div></div>
      <form onSubmit={send}>
        <div className="mood-picker" role="radiogroup" aria-label="How was your experience?">{moods.map(({id,label,Icon})=><button type="button" role="radio" aria-checked={mood===id} className={mood===id?'active':''} onClick={()=>setMood(id)} key={id}><Icon/><span>{label}</span>{mood===id&&<motion.i layoutId="feedback-mood"/>}</button>)}</div>
        <label className={`feedback-message${error?' error':''}`}><span>What would you like us to know?</span><textarea value={message} onChange={event=>{setMessage(event.target.value);setError(false)}} placeholder="A feature you loved, an idea, or something we can improve..." maxLength={1000}/><small>{error?'Please write a short message before sending.':`${message.length} / 1000`}</small></label>
        <div className="feedback-footer"><p><Mail/>Opens your email app and sends to <strong>arjunbr270@gmail.com</strong></p><button className="feedback-send" type="submit"><Send/>Send to developer</button></div>
      </form>
    </div>
  </section>
}
