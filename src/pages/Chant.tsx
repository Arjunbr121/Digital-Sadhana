import type { CSSProperties } from 'react';
import { ArrowLeft, ArrowRight, Check, Flame, Pause, Play, RotateCcw, Sparkles, Volume2, VolumeX, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { mantras } from '../data/mantras';
import { useAppData } from '../hooks/useAppData';
import './Chant.css';

const MALA_BEADS = 108;

function RollingNumber({ value }: { value: number }) {
  const digits = String(value).split('');

  return (
    <strong className="rolling-number" aria-label={String(value)}>
      {digits.map((digit, index) => {
        const place = digits.length - index - 1;
        return (
          <span className="digit-window" key={place} aria-hidden="true">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                className="rolling-digit"
                key={`${place}-${digit}`}
                initial={{ y: '82%', opacity: 0, filter: 'blur(3px)' }}
                animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
                exit={{ y: '-82%', opacity: 0, filter: 'blur(3px)' }}
                transition={{ duration: .24, ease: [0.22, 1, 0.36, 1] }}
              >
                {digit}
              </motion.span>
            </AnimatePresence>
          </span>
        );
      })}
    </strong>
  );
}

export default function Chant() {
  const { mantraId } = useParams();
  const navigate = useNavigate();
  const { data, savePaused, complete } = useAppData();
  const mantra = [...data.customMantras, ...mantras].find((item) => item.id === mantraId) || mantras[0];
  const prior = data.pausedSessions.find((session) => session.mantraId === mantra.id) || null;
  const [count, setCount] = useState(prior?.count || 0);
  const [paused, setPaused] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [done, setDone] = useState(false);
  const [sound, setSound] = useState(data.settings.sound);
  const audioContext = useRef<AudioContext | null>(null);
  const target = prior?.target || 108;
  const activeBead = count % MALA_BEADS;
  const completedBeads = Math.floor((count / target) * MALA_BEADS);

  useEffect(() => () => { audioContext.current?.close(); }, []);

  useEffect(() => {
    if (count >= target && !done) {
      setDone(true);
      complete({ id: String(Date.now()), mantraId: mantra.id, mantraName: mantra.name, count: target, target, date: new Date().toISOString(), status: 'completed', duration: Math.max(60, count * 5) });
    }
  }, [count, target, done, mantra, complete]);

  function tap() {
    if (!paused && !done) {
      if (sound) playBeadClick();
      setCount((current) => Math.min(target, current + 1));
    }
  }

  function playBeadClick() {
    const context = audioContext.current || new AudioContext();
    audioContext.current = context;
    const oscillator = context.createOscillator();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(720, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(310, context.currentTime + .035);
    filter.type = 'lowpass';
    filter.frequency.value = 1200;
    gain.gain.setValueAtTime(.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(.12, context.currentTime + .003);
    gain.gain.exponentialRampToValueAtTime(.0001, context.currentTime + .06);
    oscillator.connect(filter).connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + .065);
  }

  function exit() {
    if (count > 0) savePaused({ id: String(Date.now()), mantraId: mantra.id, mantraName: mantra.name, count, target, date: new Date().toISOString(), status: 'partial', duration: count * 5 });
    navigate('/home');
  }

  if (done) return (
    <main className="completion completion-ritual">
      <div className="completion-atmosphere" aria-hidden="true"><i /><i /><i /></div>
      <motion.div className="completion-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <motion.div className="completion-seal" initial={{ scale: .55, rotate: -18 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 120, damping: 13 }}>
          <span>ॐ</span>
          <motion.i animate={{ rotate: 360 }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }} />
        </motion.div>
        <motion.div initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: .18 }}>
          <span className="completion-kicker"><Sparkles size={14} /> Practice complete</span>
          <h1>One quiet circle<br />is now complete.</h1>
          <p>You offered {target} repetitions to<br /><strong>{mantra.name}</strong></p>
        </motion.div>
        <motion.div className="completion-reward" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: .36 }}>
          <div><span className="reward-icon"><Check /></span><strong>+{target}</strong><small>Jaap today</small></div>
          <div><span className="reward-icon"><Flame /></span><strong>{data.streak}</strong><small>Day streak</small></div>
        </motion.div>
        <motion.div className="completion-actions" initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: .52 }}>
          <Link className="completion-primary" to="/home">Return to your space <ArrowRight /></Link>
          <Link className="completion-secondary" to="/progress">See how your practice is growing</Link>
        </motion.div>
      </motion.div>
      <div className="completion-footer"><i /><span>Carry the stillness forward</span><i /></div>
    </main>
  );

  return (
    <main className="chant-page" onClick={tap}>
      <div className="chant-ambient" aria-hidden="true"><i /><i /><i /></div>
      <header>
        <button onClick={(event) => { event.stopPropagation(); setConfirm(true); }} aria-label="Exit chanting"><X /></button>
        <span>JAAP PRACTICE</span>
        <button onClick={(event) => { event.stopPropagation(); setSound((value) => !value); }} aria-label="Toggle sound">{sound ? <Volume2 /> : <VolumeX />}</button>
      </header>
      <div className="chant-center">
        <span className="chant-category">{mantra.category}</span>
        <h1>{mantra.devanagari}</h1>
        <p>{mantra.name}</p>
        <motion.div className="mala-stage" animate={{ scale: count ? [1, 1.018, 1] : 1 }} transition={{ duration: 0.22, ease: 'easeOut' }}>
          <motion.div className="mala-strand" animate={{ rotate: -(activeBead * (360 / MALA_BEADS)) }} transition={{ type: 'spring', stiffness: 170, damping: 24 }} aria-hidden="true">
            {Array.from({ length: MALA_BEADS }, (_, index) => {
              const isComplete = index < completedBeads;
              const isActive = index === activeBead;
              return <i key={index} className={`mala-bead${isComplete ? ' complete' : ''}${isActive ? ' active' : ''}`} style={{ '--bead-angle': `${index * (360 / MALA_BEADS)}deg` } as CSSProperties} />;
            })}
          </motion.div>
          <button className="chant-counter" onClick={(event) => { event.stopPropagation(); tap(); }} disabled={paused}>
            <RollingNumber value={count} />
            <span>of {target}</span><small>{paused ? 'PAUSED' : 'TAP TO COUNT'}</small>
          </button>
          <div className="mala-tassel" aria-hidden="true"><i /><i /><i /></div>
        </motion.div>
        <div className="chant-controls">
          <button onClick={(event) => { event.stopPropagation(); setCount(0); }}><RotateCcw /><span>Restart</span></button>
          <button className="pause" aria-label={paused ? 'Resume chanting' : 'Pause chanting'} onClick={(event) => { event.stopPropagation(); setPaused((value) => !value); }}>{paused ? <Play fill="currentColor" /> : <Pause fill="currentColor" />}</button>
          <button onClick={(event) => { event.stopPropagation(); setConfirm(true); }}><ArrowLeft /><span>Save & exit</span></button>
        </div>
        <p className="tap-hint">Each tap moves you to the next bead</p>
      </div>
      <AnimatePresence>{confirm && <motion.div className="modal-backdrop dark" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={(event) => { event.stopPropagation(); setConfirm(false); }}><motion.div className="modal exit-modal" initial={{ y: 20 }} animate={{ y: 0 }} onClick={(event) => event.stopPropagation()}><h2>Keep this practice?</h2><p>Your {count} repetitions will be waiting when you return.</p><button className="primary" onClick={exit}>Save and exit</button><button className="text-btn" onClick={() => navigate('/home')}>Exit without saving</button><button className="text-btn" onClick={() => setConfirm(false)}>Keep chanting</button></motion.div></motion.div>}</AnimatePresence>
    </main>
  );
}
