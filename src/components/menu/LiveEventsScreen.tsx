/**
 * Live Events Screen - Retention and excitement
 * Daily events, weekly championships, seasonal tours, limited-time cups
 */

import React, { useState } from 'react';
import eventsMainCardBackdropImage from '../../designs/custom_backgrounds/16GDP8cMj1ZeAFtQhML30ak33nG3RZIaL.jpg';
import { HeroBackgroundMedia } from '../ui/MediaPrimitives';

type EventCategory = 'DAILY' | 'WEEKLY' | 'SEASONAL' | 'SPONSOR' | 'SPECIAL';

interface EventCard {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  timeLeft: string;
  reward: string;
  participants?: number;
  featured?: boolean;
  color: string;
  icon: React.ReactNode;
}

interface LiveEventsScreenProps {
  onEventSelect?: (eventId: string) => void;
}

const LiveEvents: EventCard[] = [
  {
    id: 'featured-1',
    title: 'World Sprint Cup',
    description: 'Elite global championship series. Top 1% qualification required.',
    category: 'SEASONAL',
    timeLeft: '05:14:22',
    reward: 'Global Founder Emblem • 50k Coins',
    participants: 12500,
    featured: true,
    color: 'text-secondary',
    icon: 'emoji_events',
  },
  {
    id: 'daily-1',
    title: 'Kinetic Drift',
    description: 'Perfect 5 consecutive turns in training.',
    category: 'DAILY',
    timeLeft: '18:42:00',
    reward: '2.5k XP Boost',
    color: 'text-primary',
    icon: 'speed',
  },
  {
    id: 'weekly-1',
    title: 'Hydro-Endurance',
    description: 'Maintain 95% efficiency for 800m.',
    category: 'WEEKLY',
    timeLeft: '2d 14h',
    reward: 'Rare Bio-Suit Material',
    participants: 8300,
    color: 'text-primary',
    icon: 'timer',
  },
  {
    id: 'sponsor-1',
    title: 'AquaPulse Intake',
    description: 'Showcase gear performance in open water.',
    category: 'SPONSOR',
    timeLeft: '3d 08h',
    reward: 'Sponsor Tier Unlock',
    color: 'text-secondary',
    icon: 'verified',
  },
  {
    id: 'special-1',
    title: 'Neon Night Circuit',
    description: 'Illuminated evening finals series.',
    category: 'SPECIAL',
    timeLeft: '6d 12h',
    reward: 'Glow-Line Cosmetics',
    participants: 4100,
    color: 'text-primary',
    icon: 'nights_stay',
  },
];

const EventCategories = [
  { id: 'DAILY', label: 'Daily', color: 'text-emerald-400' },
  { id: 'WEEKLY', label: 'Weekly', color: 'text-blue-400' },
  { id: 'SEASONAL', label: 'Seasonal', color: 'text-yellow-400' },
  { id: 'SPONSOR', label: 'Sponsor', color: 'text-cyan-400' },
  { id: 'SPECIAL', label: 'Special', color: 'text-purple-400' },
];

export const LiveEventsScreen: React.FC<LiveEventsScreenProps> = ({ onEventSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null);

  const filteredEvents = selectedCategory
    ? LiveEvents.filter((e) => e.category === selectedCategory)
    : LiveEvents;

  const featuredEvent = LiveEvents.find((e) => e.featured);

  return (
    <div className="hydro-page-shell flex-1 relative w-full h-full overflow-y-auto flex flex-col font-body">
      {/* Cinematic Header */}
      <div className="p-12 max-[900px]:p-8 bg-gradient-to-b from-primary/15 to-transparent border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[160px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex items-center justify-between gap-8 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[1px] w-12 bg-primary/40" />
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm animate-pulse">broadcast_on_home</span>
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Live Synchronization Active</span>
              </div>
            </div>
            
            <h1 className="font-headline text-5xl max-[900px]:text-3xl font-black italic slanted uppercase text-on-surface text-glow">
              Competition Hub
            </h1>
          </div>
          
          <div className="flex items-center gap-6 p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
             <div className="flex flex-col text-right">
               <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Seasonal Progress</span>
               <span className="font-headline text-xl font-black italic slanted text-primary text-glow">Tier 42 Elite</span>
             </div>
             <div className="h-10 w-10 rounded-full border-2 border-primary/40 p-1">
                <div className="h-full w-full rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-xl">star</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="hydro-page-content page-template-card-grid p-8 max-w-7xl mx-auto w-full space-y-12 pb-24">
        {/* Featured Event Banner */}
        {featuredEvent && (
          <div className="relative group/featured rounded-[48px] p-1 bg-gradient-to-br from-secondary/40 via-white/5 to-transparent hover:scale-[1.01] transition-all duration-700 shadow-2xl overflow-hidden">
            <div className="relative z-10 p-12 max-[900px]:p-8 rounded-[46px] bg-surface flex items-center justify-between gap-12 flex-wrap overflow-hidden">
               <HeroBackgroundMedia src={eventsMainCardBackdropImage} alt="Featured events backdrop" className="absolute inset-0 opacity-78 pointer-events-none" focalPoint="50% 35%" />
               {/* Background Effects */}
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-secondary/20 via-surface/48 to-surface/72 opacity-100" />
               <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-secondary/10 blur-3xl animate-pulse" />
               
               <div className="flex-1 relative z-10 p-4 rounded-2xl bg-surface/35 border border-white/10 backdrop-blur-sm">
                 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/10 border border-secondary/20 mb-8">
                   <span className="material-symbols-outlined text-secondary text-sm animate-bounce">rocket_launch</span>
                   <span className="text-[10px] font-black uppercase tracking-widest text-secondary gold-glow italic slanted">Priority Championship</span>
                 </div>
                 
                 <h2 className="font-headline text-5xl max-[900px]:text-3xl font-black italic slanted uppercase text-on-surface text-glow mb-6 leading-tight">
                   {featuredEvent.title}
                 </h2>
                 
                 <p className="text-[13px] text-on-surface-variant uppercase font-black leading-relaxed tracking-tight max-w-xl group-hover/featured:text-on-surface transition-colors duration-500">
                   {featuredEvent.description}
                 </p>
               </div>

               <div className="flex flex-col items-center gap-8 relative z-10 min-w-[280px]">
                 <div className="text-center group/timer">
                   <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.4em] mb-3 block opacity-60">Registration Closes In</span>
                   <div className="font-headline text-5xl font-black italic slanted text-secondary gold-glow group-hover/timer:scale-110 transition-transform duration-500">
                     {featuredEvent.timeLeft}
                   </div>
                 </div>

                 <button 
                   onClick={() => onEventSelect?.(featuredEvent.id)}
                   className="w-full h-20 rounded-[28px] bg-secondary border border-white/20 shadow-[0_0_40px_rgba(255,215,9,0.3)] hover:shadow-[0_0_60px_rgba(255,215,9,0.5)] hover:scale-105 active:scale-95 transition-all duration-500 flex items-center justify-center gap-4 group/btn overflow-hidden relative"
                 >
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-white/40 shadow-[0_0_20px_rgba(255,255,255,1)]" />
                    <span className="font-headline text-2xl font-black italic slanted uppercase text-surface relative z-10 group-hover/btn:tracking-widest transition-all">Engage Event</span>
                    <span className="material-symbols-outlined text-surface text-3xl relative z-10 group-hover/btn:translate-x-2 transition-transform">arrow_forward</span>
                 </button>
               </div>
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex gap-4 flex-wrap items-center">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`relative px-8 py-5 rounded-[24px] font-headline font-black italic slanted uppercase text-[11px] tracking-widest transition-all duration-500 border overflow-hidden ${
              selectedCategory === null
                ? 'bg-primary/20 border-primary/40 text-primary text-glow shadow-[0_0_30px_rgba(129,236,255,0.2)]'
                : 'bg-white/5 border-white/5 text-on-surface-variant hover:border-white/20 hover:text-on-surface'
            }`}
          >
            All Circuits
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
          </button>
          
          {EventCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as EventCategory)}
              className={`relative px-8 py-5 rounded-[24px] font-headline font-black italic slanted uppercase text-[11px] tracking-widest transition-all duration-500 border overflow-hidden ${
                selectedCategory === cat.id
                  ? 'bg-primary/20 border-primary/40 text-primary text-glow shadow-[0_0_30px_rgba(129,236,255,0.2)]'
                  : 'bg-white/5 border-white/5 text-on-surface-variant hover:border-white/20 hover:text-on-surface'
              }`}
            >
              {cat.label}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.filter((e) => !e.featured).map((event) => (
            <div
              key={event.id}
              className="group/card relative p-1 rounded-[40px] bg-gradient-to-br from-white/10 to-transparent hover:from-primary/40 transition-all duration-500 cursor-pointer"
              onClick={() => onEventSelect?.(event.id)}
            >
               <div className="relative z-10 p-8 rounded-[36px] bg-surface h-full flex flex-col justify-between overflow-hidden">
                 {/* Background Glow */}
                 <div className="absolute -right-20 -bottom-20 h-40 w-40 bg-primary/5 blur-3xl group-hover/card:bg-primary/10 transition-colors" />
                 
                 <div>
                   <div className="flex items-start justify-between mb-8">
                     <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover/card:bg-primary/20 group-hover/card:border-primary/40 transition-all">
                       <span className="material-symbols-outlined text-3xl text-on-surface-variant group-hover/card:text-primary group-hover/card:text-glow transition-all">
                         {event.icon as string}
                       </span>
                     </div>
                     <div className="text-right">
                       <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest block opacity-60">Status</span>
                       <span className="text-[10px] font-black italic slanted text-primary uppercase animate-pulse">Synchronizing</span>
                     </div>
                   </div>

                   <div className="mb-8">
                     <div className="flex items-center gap-2 mb-2">
                       <span className={`h-2 w-2 rounded-full ${event.color === 'text-secondary' ? 'bg-secondary' : 'bg-primary'}`} />
                       <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">{event.category} Dossier</span>
                     </div>
                     <h3 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface mb-2 group-hover/card:text-glow transition-all">{event.title}</h3>
                     <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-tight leading-relaxed group-hover/card:text-on-surface/80 transition-colors">
                       {event.description}
                     </p>
                   </div>
                 </div>

                 <div className="space-y-6">
                   <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                     <div className="flex items-center justify-between mb-3 text-[9px] font-black uppercase tracking-widest opacity-60">
                        <span>Terminal Reward</span>
                        <span>Time Remaining</span>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase italic slanted text-on-surface tracking-tight">{event.reward}</span>
                        <span className="font-headline text-lg font-black italic slanted text-primary text-glow">{event.timeLeft}</span>
                     </div>
                   </div>

                   <button className="w-full h-12 rounded-[18px] bg-white/5 border border-white/10 group-hover/card:bg-primary group-hover/card:text-surface transition-all duration-500 font-headline font-black italic slanted uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
                      Access Data Stream
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                   </button>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveEventsScreen;
