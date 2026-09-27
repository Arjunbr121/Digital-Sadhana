import { ArrowLeft, ArrowRight, Bell, Check, Clock3, Flame, Sparkles, Sun } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mantras } from '../data/mantras';
import { useAppData } from '../hooks/useAppData';
import './Sadhana.css';
import './SadhanaOverrides.css';

const steps = [
  { number: 1, short: 'Mantra', title: 'Choose your anchor', eyebrow: 'The sound you return to' },
  { number: 2, short: 'Vow', title: 'Shape your commitment', eyebrow: 'A promise you can keep' },
  { number: 3, short: 'Rhythm', title: 'Find your daily rhythm', eyebrow: 'A time that belongs to you' },
  { number: 4, short: 'Begin', title: 'Offer your Sankalpa', eyebrow: 'Step into the practice' },
];

export default function CreateSadhana() {
  const { data, setSadhana } = useAppData();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [id, setId] = useState('om-namah-shivaya');
  const [days, setDays] = useState(40);
  const [target, setTarget] = useState(108);
  const [time, setTime] = useState('06:30');
  const allMantras = [...data.customMantras, ...mantras];
  const chosen = allMantras.find((mantra) => mantra.id === id) || mantras[0];
  const current = steps[step - 1];

  function move(next: number) {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  }

  function begin() {
    setSadhana({ mantraId: id, mantraName: chosen.name, days, dailyTarget: target, reminder: time, startDate: new Date().toISOString(), currentDay: 1 });
    navigate('/home');
  }

  return (
    <main className="sadhana-builder">
      <aside className="sadhana-story">
        <Link className="sadhana-close" to="/home"><ArrowLeft /> Back home</Link>
        <div className="story-mandala" aria-hidden="true"><i /><i /><span>ॐ</span></div>
        <div className="story-copy">
          <span>Create a Sadhana</span>
          <h1>A practice<br />with a pulse.</h1>
          <p>Choose one sacred sound. Meet it daily. Let repetition become remembrance.</p>
        </div>
        <div className="live-vow">
          <div className="live-vow-glyph" style={{ background: chosen.color }}>{chosen.devanagari.slice(0, 2)}</div>
          <div><span>Your practice</span><strong>{chosen.name}</strong><small>{target} Jaap · {days} days · {time}</small></div>
        </div>
      </aside>

      <section className="sadhana-workspace">
        <header className="sadhana-progress">
          {steps.map((item) => (
            <button key={item.number} className={`${item.number === step ? 'active' : ''}${item.number < step ? ' complete' : ''}`} onClick={() => item.number <= step && move(item.number)}>
              <i>{item.number < step ? <Check /> : item.number}</i><span>{item.short}</span>
            </button>
          ))}
          <b style={{ width: `${((step - 1) / 3) * 100}%` }} />
        </header>

        <div className="sadhana-stage">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={step} custom={direction} initial={{ opacity: 0, x: 28 * direction }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 * direction }} transition={{ duration: .28, ease: 'easeOut' }}>
              <span className="stage-eyebrow"><Sparkles size={14} /> {current.eyebrow}</span>
              <h2>{current.title}</h2>

              {step === 1 && (
                <div className="mantra-choices">
                  {allMantras.map((mantra) => (
                    <motion.button whileTap={{ scale: .98 }} className={id === mantra.id ? 'selected' : ''} onClick={() => setId(mantra.id)} key={mantra.id}>
                      <span className="choice-glyph" style={{ background: mantra.color }}>{mantra.devanagari.slice(0, 2)}</span>
                      <div><strong>{mantra.name}</strong><small>{mantra.devanagari}</small></div>
                      <i>{id === mantra.id && <Check />}</i>
                    </motion.button>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="duration-choices">
                  {[7, 21, 40, 108].map((value) => (
                    <motion.button whileTap={{ scale: .96 }} className={days === value ? 'selected' : ''} onClick={() => setDays(value)} key={value}>
                      <span>{value === 7 ? 'A gentle start' : value === 21 ? 'Build a rhythm' : value === 40 ? 'Traditional vow' : 'Deep immersion'}</span>
                      <strong>{value}</strong><small>days</small>{days === value && <Check />}
                    </motion.button>
                  ))}
                  <div className="duration-note"><Flame /><p><strong>{(days * target).toLocaleString()} repetitions</strong><br />across your complete Sadhana</p></div>
                </div>
              )}

              {step === 3 && (
                <div className="rhythm-layout">
                  <div className="rhythm-block"><h3>Daily repetitions</h3><div className="count-choices">{[27, 54, 108, 216].map((value) => <motion.button whileTap={{ scale: .96 }} className={target === value ? 'selected' : ''} onClick={() => setTarget(value)} key={value}><strong>{value}</strong><small>Jaap</small></motion.button>)}</div></div>
                  <div className="rhythm-block"><h3>Gentle reminder</h3><label className="reminder-field"><span><Sun /><i><strong>Practice time</strong><small>A quiet nudge on this device</small></i></span><input aria-label="Practice reminder time" type="time" value={time} onChange={(event) => setTime(event.target.value)} /></label></div>
                  <div className="daily-preview"><Clock3 /><span>About {Math.max(3, Math.round(target * 5 / 60))} minutes each day</span></div>
                </div>
              )}

              {step === 4 && (
                <div className="sankalpa-review">
                  <motion.div className="review-orbit" initial={{ scale: .8 }} animate={{ scale: 1 }}><i /><i /><span style={{ background: chosen.color }}>{chosen.devanagari.slice(0, 2)}</span></motion.div>
                  <span>{chosen.devanagari}</span><h3>{chosen.name}</h3>
                  <div className="vow-facts"><div><strong>{days}</strong><small>days</small></div><div><strong>{target}</strong><small>Jaap daily</small></div><div><strong>{time}</strong><small>reminder</small></div></div>
                  <blockquote>“For {days} days, I will meet this practice with sincerity, patience, and an open heart.”</blockquote>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <footer className="sadhana-actions">
          {step > 1 ? <button className="sadhana-back" onClick={() => move(step - 1)}><ArrowLeft /> Back</button> : <span />}
          <button className="sadhana-next" onClick={() => step < 4 ? move(step + 1) : begin()}>{step < 4 ? 'Continue' : 'Begin my Sadhana'} <ArrowRight /></button>
        </footer>
      </section>
    </main>
  );
}
