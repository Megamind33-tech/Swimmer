/**
 * Live Events Screen - Retention and excitement
 * Daily events, weekly championships, seasonal tours, limited-time cups
 */

import React, { useState } from 'react';
import eventsMainCardBackdropImage from '../../designs/custom_backgrounds/16GDP8cMj1ZeAFtQhML30ak33nG3RZIaL.jpg';
import { HeroBackgroundMedia } from '../ui/MediaPrimitives';
import { GameIcon } from '../../ui/GameIcon';
import { useIsLandscapeMobile } from '../../hooks/useIsLandscapeMobile';
import { PaneSwitcher } from '../../ui/PaneSwitcher';

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

const liveEvents: EventCard[] = [
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

const eventCategories = [
  { id: 'DAILY', label: 'Daily' },
  { id: 'WEEKLY', label: 'Weekly' },
  { id: 'SEASONAL', label: 'Seasonal' },
  { id: 'SPONSOR', label: 'Sponsor' },
  { id: 'SPECIAL', label: 'Special' },
] as const;

export const LiveEventsScreen: React.FC<LiveEventsScreenProps> = ({ onEventSelect }) => {
  const isLandscapeMobile = useIsLandscapeMobile();
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null);

  const filteredEvents = selectedCategory
    ? liveEvents.filter((event) => event.category === selectedCategory)
    : liveEvents;

  const featuredEvent = liveEvents.find((event) => event.featured);

  return (
    <div className={`hydro-page-shell flex-1 relative w-full h-full font-body ${isLandscapeMobile ? 'overflow-hidden' : 'overflow-y-auto'}`}>
      <PaneSwitcher
        panes={[
          {
            id: 'FEATURED',
            label: 'FEATURED',
            icon: <span>🔥</span>,
            content: (
              <div className="p-6 h-full overflow-y-auto pb-20 scrollbar-hide">
                {featuredEvent && (
                  <button
                    className="w-full rounded-[32px] overflow-hidden bg-gradient-to-br from-secondary/40 to-surface p-8 border border-white/10 mb-6 text-left game-tap-feedback"
                    onClick={() => onEventSelect?.(featuredEvent.id)}
                  >
                    <h2 className="font-headline text-3xl font-black italic slanted uppercase text-on-surface text-glow mb-2">{featuredEvent.title}</h2>
                    <p className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant mb-6 opacity-60 leading-relaxed">{featuredEvent.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-secondary font-black italic slanted text-xl gold-glow">{featuredEvent.timeLeft}</span>
                      <span style={{ fontSize: '24px' }}>➔</span>
                    </div>
                  </button>
                )}
              </div>
            ),
          },
          {
            id: 'DAILY',
            label: 'DAILY',
            icon: <span>📅</span>,
            content: (
              <div className="p-6 h-full overflow-y-auto pb-20 scrollbar-hide space-y-4">
                <h3 className="font-headline text-xl font-black italic slanted uppercase tracking-widest text-primary px-2 opacity-60">Daily Objectives</h3>
                {liveEvents.filter((event) => event.category === 'DAILY').map((event) => (
                  <button
                    key={event.id}
                    onClick={() => onEventSelect?.(event.id)}
                    className="w-full p-5 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-between game-tap-feedback"
                  >
                    <span className="font-headline text-lg font-black italic slanted uppercase text-on-surface">{event.title}</span>
                    <span className="text-primary font-black italic slanted">{event.timeLeft}</span>
                  </button>
                ))}
              </div>
            ),
          },
          {
            id: 'CIRCUITS',
            label: 'CIRCUITS',
            icon: <span>🏆</span>,
            content: (
              <div className="p-6 h-full overflow-y-auto pb-20 scrollbar-hide space-y-4">
                <h3 className="font-headline text-xl font-black italic slanted uppercase tracking-widest text-secondary px-2 opacity-60">Global Heats</h3>
                {liveEvents.filter((event) => event.category !== 'DAILY' && !event.featured).map((event) => (
                  <button
                    key={event.id}
                    onClick={() => onEventSelect?.(event.id)}
                    className="w-full p-5 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-between game-tap-feedback"
                  >
                    <div>
                      <span className="font-headline text-lg font-black italic slanted uppercase text-on-surface block">{event.title}</span>
                      <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest opacity-60">{event.category}</span>
                    </div>
                    <span className="text-secondary font-black italic slanted">{event.timeLeft}</span>
                  </button>
                ))}
              </div>
            ),
          },
        ]}
      >
        <div className="flex flex-col flex-1">
          <div className="p-12 max-[900px]:p-8 bg-gradient-to-b from-primary/15 to-transparent border-b border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[160px] rounded-full pointer-events-none" />
            <div className="relative z-10 flex items-center justify-between gap-8 flex-wrap">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="h-[1px] w-12 bg-primary/40" />
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Live Synchronization Active</span>
                </div>
                <h1 className="font-headline text-5xl max-[900px]:text-3xl font-black italic slanted uppercase text-on-surface text-glow">Competition Hub</h1>
              </div>
            </div>
          </div>

          <div className="hydro-page-content page-template-card-grid p-8 max-w-7xl mx-auto w-full space-y-12 pb-24">
            {featuredEvent && (
              <div className="relative group/featured rounded-[48px] p-1 bg-gradient-to-br from-secondary/40 via-white/5 to-transparent shadow-2xl overflow-hidden">
                <div className="relative z-10 p-12 max-[900px]:p-8 rounded-[46px] bg-surface flex items-center justify-between gap-12 flex-wrap overflow-hidden">
                  <HeroBackgroundMedia src={eventsMainCardBackdropImage} alt="Featured events backdrop" className="absolute inset-0 opacity-78 pointer-events-none" focalPoint="50% 35%" />
                  <div className="flex-1 relative z-10 p-4 rounded-2xl bg-surface/35 border border-white/10 backdrop-blur-sm">
                    <h2 className="font-headline text-5xl max-[900px]:text-3xl font-black italic slanted uppercase text-on-surface text-glow mb-6 leading-tight">{featuredEvent.title}</h2>
                    <p className="text-[13px] text-on-surface-variant uppercase font-black leading-relaxed tracking-tight max-w-xl">{featuredEvent.description}</p>
                  </div>
                  <button
                    onClick={() => onEventSelect?.(featuredEvent.id)}
                    className="min-w-[240px] h-20 rounded-[28px] bg-secondary border border-white/20 hover:scale-105 active:scale-95 transition-all duration-500 flex items-center justify-center gap-4"
                  >
                    <span className="font-headline text-2xl font-black italic slanted uppercase text-surface">Engage Event</span>
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-4 flex-wrap items-center">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-8 py-5 rounded-[24px] font-headline font-black italic slanted uppercase text-[11px] tracking-widest border ${
                  selectedCategory === null
                    ? 'bg-primary/20 border-primary/40 text-primary text-glow'
                    : 'bg-white/5 border-white/5 text-on-surface-variant hover:border-white/20 hover:text-on-surface'
                }`}
              >
                All Circuits
              </button>

              {eventCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id as EventCategory)}
                  className={`px-8 py-5 rounded-[24px] font-headline font-black italic slanted uppercase text-[11px] tracking-widest border ${
                    selectedCategory === category.id
                      ? 'bg-primary/20 border-primary/40 text-primary text-glow'
                      : 'bg-white/5 border-white/5 text-on-surface-variant hover:border-white/20 hover:text-on-surface'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.filter((event) => !event.featured).map((event) => (
                <button
                  key={event.id}
                  className="group/card relative p-1 rounded-[40px] bg-gradient-to-br from-white/10 to-transparent hover:from-primary/40 transition-all duration-500 text-left"
                  onClick={() => onEventSelect?.(event.id)}
                >
                  <div className="relative z-10 p-8 rounded-[36px] bg-surface h-full flex flex-col justify-between gap-6">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                          <GameIcon name={event.icon as string} size={30} className="text-on-surface-variant" />
                        </div>
                        <span className="font-headline text-lg font-black italic slanted text-primary text-glow">{event.timeLeft}</span>
                      </div>
                      <h3 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface mb-2">{event.title}</h3>
                      <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-tight leading-relaxed">{event.description}</p>
                    </div>
                    <div className="text-[11px] font-black uppercase italic slanted text-on-surface tracking-tight">{event.reward}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </PaneSwitcher>
    </div>
  );
};

export default LiveEventsScreen;
