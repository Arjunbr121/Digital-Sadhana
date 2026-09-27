import { Award, CalendarDays, Flame } from 'lucide-react';
import { PageHead, Ring, Stat } from '../components/UI';
import { useAppData } from '../hooks/useAppData';

export default function Progress() {
  const { data } = useAppData();
  const today = new Date();
  const week = Array.from({ length: 7 }, (_, offset) => {
    const day = new Date(today); day.setDate(today.getDate() - (6 - offset));
    const value = data.history.filter((item) => new Date(item.date).toDateString() === day.toDateString()).reduce((sum, item) => sum + item.count, 0);
    return { label: new Intl.DateTimeFormat('en-IN', { weekday: 'narrow' }).format(day), value };
  });
  const weekTotal = week.reduce((sum, item) => sum + item.value, 0);
  const max = Math.max(108, ...week.map((item) => item.value));
  const seconds = data.history.reduce((sum, item) => sum + item.duration, 0);
  const practiceTime = seconds < 3600 ? `${Math.round(seconds / 60)}m` : `${Math.floor(seconds / 3600)}h ${Math.round((seconds % 3600) / 60)}m`;
  const nextMilestone = Math.ceil((data.totalJaap + 1) / 1000) * 1000;
  return <div className="page"><PageHead eyebrow="Your journey" title="Progress"/><div className="progress-feature"><Ring value={data.streak} max={30} size={146} label="day streak"/><div><span className="soft-label"><Flame size={15}/>STEADY PRACTICE</span><h2>{data.streak ? `You have shown up for ${data.streak} days.` : 'Your first day begins here.'}</h2><p>{data.streak ? `${Math.max(0, 30-data.streak)} days to your 30-day milestone.` : 'Every lasting rhythm begins with one practice.'}</p></div></div><div className="stats-row"><Stat value={`${data.longestStreak} days`} label="Longest streak"/><Stat value={data.totalJaap.toLocaleString('en-IN')} label="Total Jaap"/><Stat value={practiceTime} label="Practice time"/></div><section className="chart-card"><div><h2>This week</h2><span>{weekTotal.toLocaleString('en-IN')} Jaap</span></div><div className="bars">{week.map((item,index)=><div key={`${item.label}-${index}`}><span title={`${item.value} Jaap`} style={{height:`${Math.max(5,item.value/max*100)}%`}} className={item.value>=108?'complete':''}/><small>{item.label}</small></div>)}</div></section>{data.activeSadhana&&<section className="journey-card"><div className="journey-top"><CalendarDays/><div><span>ACTIVE SADHANA</span><h2>{data.activeSadhana.mantraName}</h2></div><strong>Day {data.activeSadhana.currentDay}</strong></div><div className="journey-line"><i style={{width:`${data.activeSadhana.currentDay/data.activeSadhana.days*100}%`}}/></div><div className="journey-labels"><span>Started {new Intl.DateTimeFormat('en-IN',{day:'numeric',month:'short'}).format(new Date(data.activeSadhana.startDate))}</span><span>{data.activeSadhana.days} day vow</span></div></section>}<section className="milestone"><Award/><div><h3>{nextMilestone.toLocaleString('en-IN')} Jaap milestone</h3><p>{(nextMilestone-data.totalJaap).toLocaleString('en-IN')} repetitions until your next practice milestone.</p></div></section></div>;
}
