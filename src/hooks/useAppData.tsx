import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { AppData, ChantSession, Mantra, MeditationTrack, Sadhana } from '../types';
import { useAuth } from './useAuth';

const freshData: AppData = { customMantras: [], customMeditationTracks: [], activeSadhana: null, pausedSession: null, pausedSessions: [], history: [], streak: 0, longestStreak: 0, totalJaap: 0, sankalpaDone: false, sankalpas: [], settings: { sound: true, haptics: true, reminders: true, dark: false, language: 'en' } };
type Ctx = { data: AppData; addMantra:(m:Mantra)=>void; addMeditationTrack:(track:MeditationTrack)=>void; removeMeditationTrack:(id:string)=>void; savePaused:(s:ChantSession|null)=>void; dismissPaused:(id:string)=>void; complete:(s:ChantSession)=>void; setSadhana:(s:Sadhana)=>void; toggleSankalpa:()=>void; addSankalpa:(text:string)=>void; toggleSankalpaItem:(id:string)=>void; removeSankalpa:(id:string)=>void; toggleSetting:(k:'sound'|'haptics'|'reminders'|'dark')=>void; setLanguage:(language:'en'|'hi'|'kn')=>void; reset:()=>void };
const AppContext=createContext<Ctx|null>(null);
const dayKey=(date=new Date())=>date.toISOString().slice(0,10);

function normalize(value:Partial<AppData>|null):AppData { const migrated=value?.pausedSessions||(value?.pausedSession?[value.pausedSession]:[]);return { ...freshData, ...value, pausedSessions:migrated, customMeditationTracks:value?.customMeditationTracks||[], sankalpas:value?.sankalpas||[], settings:{...freshData.settings,...value?.settings} }; }
function read(username?:string){if(!username)return freshData;try{return normalize(JSON.parse(localStorage.getItem(`digital-sadhana-user:${username}`)||'null'))}catch{return freshData}}
function streakFrom(history:ChantSession[]){const days=[...new Set(history.filter(s=>s.status==='completed').map(s=>dayKey(new Date(s.date))))].sort().reverse();if(!days.length)return 0;let streak=0;const cursor=new Date();const latest=new Date(`${days[0]}T12:00:00`);if(Math.floor((cursor.getTime()-latest.getTime())/86400000)>1)return 0;for(const key of days){const expected=dayKey(cursor);const yesterday=new Date(cursor);yesterday.setDate(cursor.getDate()-1);if(key===expected){streak++;cursor.setDate(cursor.getDate()-1)}else if(streak===0&&key===dayKey(yesterday)){streak++;cursor.setDate(cursor.getDate()-2)}else break}return streak}

export function AppProvider({children}:{children:React.ReactNode}){
 const {user}=useAuth();const [data,setData]=useState<AppData>(()=>read(user?.username));
 useEffect(()=>setData(read(user?.username)),[user?.username]);
 useEffect(()=>{if(user)localStorage.setItem(`digital-sadhana-user:${user.username}`,JSON.stringify(data))},[data,user]);
 useEffect(()=>{document.documentElement.dataset.theme=data.settings.dark?'dark':'light';document.documentElement.lang=data.settings.language},[data.settings.dark,data.settings.language]);
 const value=useMemo<Ctx>(()=>({data,
  addMantra:m=>setData(d=>({...d,customMantras:[...d.customMantras,m]})),addMeditationTrack:track=>setData(d=>({...d,customMeditationTracks:[track,...d.customMeditationTracks]})),removeMeditationTrack:id=>setData(d=>({...d,customMeditationTracks:d.customMeditationTracks.filter(track=>track.id!==id)})),savePaused:s=>setData(d=>s?({...d,pausedSession:s,pausedSessions:[s,...d.pausedSessions.filter(item=>item.mantraId!==s.mantraId)]}):d),dismissPaused:id=>setData(d=>({...d,pausedSession:d.pausedSession?.id===id?null:d.pausedSession,pausedSessions:d.pausedSessions.filter(item=>item.id!==id)})),
  complete:s=>setData(d=>{const history=[s,...d.history];const streak=streakFrom(history);const today=dayKey();const already=d.history.some(item=>item.status==='completed'&&item.mantraId===s.mantraId&&dayKey(new Date(item.date))===today);const active=d.activeSadhana&&d.activeSadhana.mantraId===s.mantraId&&!already?{...d.activeSadhana,currentDay:Math.min(d.activeSadhana.days,d.activeSadhana.currentDay+1)}:d.activeSadhana;return{...d,pausedSession:d.pausedSession?.mantraId===s.mantraId?null:d.pausedSession,pausedSessions:d.pausedSessions.filter(item=>item.mantraId!==s.mantraId),history,totalJaap:d.totalJaap+s.count,streak,longestStreak:Math.max(d.longestStreak,streak),activeSadhana:active}}),
  setSadhana:s=>setData(d=>({...d,activeSadhana:s})),toggleSankalpa:()=>setData(d=>({...d,sankalpaDone:!d.sankalpaDone})),
  addSankalpa:text=>setData(d=>({...d,sankalpas:[...d.sankalpas,{id:String(Date.now()),text,createdAt:new Date().toISOString(),completedDates:[]}]})),
  toggleSankalpaItem:id=>setData(d=>({...d,sankalpas:d.sankalpas.map(item=>item.id!==id?item:{...item,completedDates:item.completedDates.includes(dayKey())?item.completedDates.filter(x=>x!==dayKey()):[...item.completedDates,dayKey()]})})),
  removeSankalpa:id=>setData(d=>({...d,sankalpas:d.sankalpas.filter(item=>item.id!==id)})),toggleSetting:k=>setData(d=>({...d,settings:{...d.settings,[k]:!d.settings[k]}})),setLanguage:language=>setData(d=>({...d,settings:{...d.settings,language}})),reset:()=>setData(freshData)}),[data]);
 return <AppContext.Provider value={value}>{children}</AppContext.Provider>}
export const useAppData=()=>{const c=useContext(AppContext);if(!c)throw new Error('AppProvider missing');return c};
