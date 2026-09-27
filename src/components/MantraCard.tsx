import { ArrowUpRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Mantra } from '../types';
import './MantraCard.css';

export default function MantraCard({mantra}:{mantra:Mantra}){return <article className="mantra-card expanded-mantra"><div className="mantra-glyph" style={{background:mantra.color}}>ॐ</div><div className="mantra-copy"><span>{mantra.category}</span><h3>{mantra.name}</h3><div className="mantra-script">{mantra.devanagari}</div><p>{mantra.meaning}</p></div><div className="card-actions"><Link aria-label={`Open ${mantra.name}`} to={`/mantras/${mantra.id}`}><ArrowUpRight size={19}/></Link><Link className="play" aria-label={`Chant ${mantra.name}`} to={`/chant/${mantra.id}`}><Play size={17} fill="currentColor"/></Link></div></article>}
