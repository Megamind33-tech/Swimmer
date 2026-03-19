/**
 * Home Screen - Game-Focused Broadcast Aesthetic
 * Championship display with glassmorphic cards and neon accents
 */

import React, { useState, useRef } from 'react';
import { IPlayerSwimmer } from '../../types';
import miaPhiriAthleteImage from '../../designs/835_mia_phiri_news.png_1/screen.png';
import p2pQuickMatchImage from '../../designs/doh9161_copy.width_800.jpg/screen.png';
import { FeatureCardMedia } from '../ui/MediaPrimitives';
import { GameIcon } from '../../ui/GameIcon';

interface HomeScreenProps {
  player?: IPlayerSwimmer;
  onPlayClick?: () => void;
  onCareerClick?: () => void;
  onSocialClick?: () => void;
}

type HomeSubPage = 'QUICK_RACE' | 'CAREER' | 'SOCIAL' | null;

export const HomeScreen: React.FC<HomeScreenProps> = ({
  player,
  onPlayClick,
  onCareerClick,
  onSocialClick,
}) => {
  const [activeSubPage, setActiveSubPage] = useState<HomeSubPage>(null);

  const openSubPage = (subPage: Exclude<HomeSubPage, null>) => setActiveSubPage(subPage);

  const renderSubPage = () => {
    if (!activeSubPage) return null;

    if (activeSubPage === 'QUICK_RACE') {
      return (
        <div className="rounded-2xl border border-primary/20 bg-surface/60 p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-3xl font-black italic uppercase text-primary text-glow">Quick Race Ops</h3>
            <button onClick={() => setActiveSubPage(null)} className="hydro-cta hydro-cta-neutral max-w-40">Back</button>
          </div>
          <p className="text-on-surface-variant font-bold uppercase tracking-[0.15em] text-xs">Queue setup, matchmaking telemetry and race launch controls.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Sprint Queue', 'Time Trial', 'Relay Warmup'].map((item) => (
              <div key={item} className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm font-black italic uppercase">{item}</div>
            ))}
          </div>
          <button onClick={onPlayClick} className="hydro-cta hydro-cta-primary max-w-sm">Launch Quick Race</button>
        </div>
      );
    }

    if (activeSubPage === 'CAREER') {
      return (
        <div className="rounded-2xl border border-secondary/30 bg-surface/60 p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-3xl font-black italic uppercase text-secondary gold-glow">Career Command</h3>
            <button onClick={() => setActiveSubPage(null)} className="hydro-cta hydro-cta-neutral max-w-40">Back</button>
          </div>
          <p className="text-on-surface-variant font-bold uppercase tracking-[0.15em] text-xs">Milestone tracking, contract objectives and season progression.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Season Milestones', 'Sponsor Targets', 'Coach Notes', 'Rank Projection'].map((item) => (
              <div key={item} className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm font-black italic uppercase">{item}</div>
            ))}
          </div>
          <button onClick={onCareerClick} className="hydro-cta hydro-cta-gold max-w-sm">Open Career Screen</button>
        </div>
      );
    }

    return (
      <div className="rounded-2xl border border-blue-300/30 bg-surface/60 p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-headline text-3xl font-black italic uppercase text-blue-300">Social Hub</h3>
          <button onClick={() => setActiveSubPage(null)} className="hydro-cta hydro-cta-neutral max-w-40">Back</button>
        </div>
        <p className="text-on-surface-variant font-bold uppercase tracking-[0.15em] text-xs">Friends online, rival challenges and club communication feed.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Squad Chat', 'Rival Alerts', 'Club Requests'].map((item) => (
            <div key={item} className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm font-black italic uppercase">{item}</div>
          ))}
        </div>
        <button onClick={onSocialClick} className="hydro-cta hydro-cta-neutral max-w-sm">Open Social Screen</button>
      </div>
    );
  };

  return (
    <div className="home-main-content hydro-page-shell flex-1 relative w-full h-full overflow-y-auto font-body">
      <div className="hydro-home-shell p-4 md:p-6">
        <section className="hydro-home-hero mb-5">
          <h2 className="text-4xl md:text-5xl font-black italic uppercase leading-none tracking-tight text-on-surface">
            Race <span className="text-primary">Command</span>
          </h2>
          <div className="h-1 w-24 bg-primary mt-4 skew-slanted" />
        </section>

        {activeSubPage ? (
          renderSubPage()
        ) : (
          <section className="hydro-home-cards">
            <article className="hydro-feature-card hydro-feature-primary" onClick={() => openSubPage('QUICK_RACE')}>
              <FeatureCardMedia src={p2pQuickMatchImage} alt="Quick race" className="hydro-feature-image" overlayClassName="hydro-feature-overlay" focalPoint="50% 45%" />
              <div className="hydro-feature-content">
                <span className="hydro-badge bg-primary text-background">Competitive</span>
                <h3>Quick Race</h3>
                <p>Instant matchmaking &amp; global tracking.</p>
                <button onClick={(e) => { e.stopPropagation(); openSubPage('QUICK_RACE'); }} className="hydro-cta hydro-cta-primary">
                  Start
                </button>
              </div>
              <span style={{fontSize:'24px', lineHeight:1, display:'inline-block'}} className="hydro-feature-icon text-primary">⚡</span>
            </article>

            <article className="hydro-feature-card hydro-feature-gold" onClick={() => openSubPage('CAREER')}>
              <FeatureCardMedia src={miaPhiriAthleteImage} alt="Career mode" className="hydro-feature-image" overlayClassName="hydro-feature-overlay hydro-feature-overlay-gold" focalPoint="50% 22%" />
              <div className="hydro-feature-content">
                <span className="hydro-badge bg-secondary text-background">Achievements</span>
                <h3>Career</h3>
                <p>Pro path, trophies &amp; season goals.</p>
                <button onClick={(e) => { e.stopPropagation(); openSubPage('CAREER'); }} className="hydro-cta hydro-cta-gold">
                  Continue
                </button>
              </div>
              <span style={{fontSize:'24px', lineHeight:1, display:'inline-block'}} className="hydro-feature-icon text-secondary">🏆</span>
            </article>

            <article className="hydro-feature-card hydro-feature-neutral" onClick={() => openSubPage('SOCIAL')}>
              <FeatureCardMedia src={p2pQuickMatchImage} alt="Social club" className="hydro-feature-image" overlayClassName="hydro-feature-overlay hydro-feature-overlay-neutral" focalPoint="50% 52%" />
              <div className="hydro-feature-content">
                <span className="hydro-badge bg-blue-500/30 text-blue-300 border border-blue-400/30">+12 Online</span>
                <h3>Chat</h3>
                <p>Squad chat, rivals &amp; club feed.</p>
                <button onClick={(e) => { e.stopPropagation(); openSubPage('SOCIAL'); }} className="hydro-cta hydro-cta-neutral">Open</button>
              </div>
              <span style={{fontSize:'24px', lineHeight:1, display:'inline-block'}} className="hydro-feature-icon text-blue-300">⊕</span>
            </article>
          </section>
        )}
      </div>
    </div>
  );
};

interface HomeRightPanelProps {
  onOpenShop?: () => void;
  onOpenShopItem?: (itemId: string) => void;
}

export const HomeRightPanel: React.FC<HomeRightPanelProps> = () => {
  const [completedObjectives, setCompletedObjectives] = useState<Set<number>>(new Set([2]));
  const [splashingObjective, setSplashingObjective] = useState<number | null>(null);
  const splashRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const dailyObjectives = [
    { id: 1, name: 'Complete 2 sprint races', progress: 1, total: 2, icon: 'play_arrow' },
    { id: 2, name: 'Perform 3 perfect turns', progress: 3, total: 3, icon: 'edit' },
    { id: 3, name: 'Train endurance once', progress: 0, total: 1, icon: 'fitness_center' },
    { id: 4, name: 'Beat one rival ghost', progress: 0, total: 1, icon: 'emoji_events' },
  ];

  const activeEvents = [
    { name: 'World Sprint Cup', time: '05:14:22', timeMs: 514220, urgency: 'normal' as const },
    { name: 'Butterfly Challenge', time: '2d 14h', timeMs: null, urgency: 'normal' as const },
  ];

  const isComplete = (obj: typeof dailyObjectives[0]) => obj.progress >= obj.total;
  const progressPercent = (progress: number, total: number) => Math.min((progress / total) * 100, 100);

  const getIconColorClass = (obj: typeof dailyObjectives[0]) => {
    if (completedObjectives.has(obj.id)) {
      return 'icon-progress-complete';
    } else if (obj.progress > 0) {
      return 'icon-progress-active';
    }
    return 'icon-progress-grey';
  };

  const handleObjectiveClick = (obj: typeof dailyObjectives[0]) => {
    if (isComplete(obj) && !completedObjectives.has(obj.id)) {
      setSplashingObjective(obj.id);
      setCompletedObjectives((prev) => new Set([...prev, obj.id]));
      setTimeout(() => setSplashingObjective(null), 600);
    }
  };

  return (
    <div className="space-y-4 safe-zone">
      {/* Daily Objectives - Hydro Pane */}
      <div className="glass-panel p-6 rounded-2xl group hover:border-primary/40 transition-all duration-300">
        <h3 className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-5 text-glow">
          Daily Objectives
        </h3>
        <div className="space-y-3">
          {dailyObjectives.map((obj) => {
            const isCompleted = completedObjectives.has(obj.id);
            const fillPercent = progressPercent(obj.progress, obj.total);

            return (
              <div
                key={obj.id}
                ref={(el) => {
                  if (el) splashRefs.current[obj.id] = el;
                }}
                onClick={() => handleObjectiveClick(obj)}
                className={`relative flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                  isCompleted
                    ? 'bg-secondary/10 border-secondary/30 hover:border-secondary/50'
                    : 'bg-white/5 border-white/5 hover:border-primary/30 hover:bg-white/10'
                }`}
              >
                {/* Icon with Glass Look */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="relative h-10 w-10 rounded-lg bg-surface-highest/50 flex items-center justify-center border border-white/5 group-hover:border-primary/20 transition-all">
                    <GameIcon
                      name={obj.icon}
                      size={24}
                      className={`shrink-0 transition-all duration-300 ${
                        isCompleted ? 'text-secondary gold-glow' : 'text-primary/70 group-hover:text-primary'
                      }`}
                    />
                  </div>

                  <div className="flex flex-col">
                    <span
                      className={`text-sm font-bold truncate transition-colors duration-300 ${
                        isCompleted ? 'text-secondary/90' : 'text-on-surface'
                      }`}
                    >
                      {obj.name}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                      {isCompleted ? 'Objective Complete' : `${obj.progress} / ${obj.total} Progress`}
                    </span>
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="relative h-1.5 w-16 rounded-full bg-white/5 border border-white/5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 ${
                      isCompleted ? 'bg-secondary shadow-[0_0_10px_rgba(255,215,9,0.5)]' : 'bg-primary shadow-[0_0_10px_rgba(129,236,255,0.5)]'
                    }`}
                    style={{ width: `${fillPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Events - Floating Cards */}
      <div className="glass-panel p-6 rounded-2xl group hover:border-primary/40 transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full translate-x-16 -translate-y-16" />
        
        <h3 className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-5 text-glow">
          Active Events
        </h3>
        <div className="space-y-4">
          {activeEvents.map((event, idx) => (
            <div
              key={idx}
              className="relative p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all duration-300 group/card overflow-hidden"
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-on-surface group-hover/card:text-primary transition-colors">{event.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="h-1 w-8 bg-primary/30 rounded-full" />
                    <span className="text-[9px] uppercase tracking-widest text-on-surface-variant font-black">Season Series</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="text-primary font-headline font-bold italic slanted text-glow">
                    {event.time}
                  </div>
                  <div className="text-[8px] uppercase tracking-tighter text-on-surface-variant font-bold">Ends In</div>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-transparent -translate-x-full group-hover/card:translate-x-full transition-transform duration-1000" />
            </div>
          ))}
        </div>
      </div>
      </div>
    );
};

export default HomeScreen;
