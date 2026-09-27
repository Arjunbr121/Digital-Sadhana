export type Mantra={id:string;name:string;devanagari:string;meaning:string;category:string;description:string;color:string;custom?:boolean};
export type ChantSession={id:string;mantraId:string;mantraName:string;count:number;target:number;date:string;status:'completed'|'partial';duration:number};
export type Sadhana={mantraId:string;mantraName:string;days:number;dailyTarget:number;reminder:string;startDate:string;currentDay:number};
export type SankalpaItem={id:string;text:string;createdAt:string;completedDates:string[]};
export type MeditationTrack={id:string;name:string;dataUrl:string;size:number;createdAt:string};
export type AppData={customMantras:Mantra[];customMeditationTracks:MeditationTrack[];activeSadhana:Sadhana|null;pausedSession:ChantSession|null;pausedSessions:ChantSession[];history:ChantSession[];streak:number;longestStreak:number;totalJaap:number;sankalpaDone:boolean;sankalpas:SankalpaItem[];settings:{sound:boolean;haptics:boolean;reminders:boolean;dark:boolean;language:'en'|'hi'|'kn'}};
