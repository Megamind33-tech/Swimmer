import React, { useMemo, useState } from 'react';
import { IPlayerSwimmer } from '../../types';
import miaPhiriAthleteImage from '../../designs/835_mia_phiri_news.png_1/screen.png';
import p2pQuickMatchImage from '../../designs/doh9161_copy.width_800.jpg/screen.png';
import { FeatureCardMedia } from '../ui/MediaPrimitives';
import { GameIcon } from '../../ui/GameIcon';
import { useIsLandscapeMobile } from '../../hooks/useIsLandscapeMobile';
import { PaneSwitcher } from '../../ui/PaneSwitcher';
import {
  swim26Boundary,
  swim26Color,
  swim26Layout,
  swim26Size,
  swim26Space,
  swim26Type,
} from '../../theme/swim26DesignSystem';

interface HomeScreenProps {
  player?: IPlayerSwimmer;
  onPlayClick?: () => void;
  onCareerClick?: () => void;
  onSocialClick?: () => void;
}

type HomeSubPage = 'QUICK_RACE' | 'CAREER' | 'SOCIAL' | null;

interface HomeFeature {
  id: Exclude<HomeSubPage, null>;
  eyebrow: string;
  title: string;
  description: string;
  buttonLabel: string;
  badge: string;
  icon: string;
  accent: string;
  border: string;
  badgeBackground: string;
  image: string;
  focalPoint: string;
}

const shellPanel: React.CSSProperties = {
  borderRadius: swim26Boundary.radius.lg,
  border: `${swim26Boundary.border.thin}px solid ${swim26Color.divider}`,
  background: swim26Color.surface.secondary,
  boxShadow: swim26Boundary.elevation.level1,
};

const subPanelStyle: React.CSSProperties = {
  borderRadius: swim26Boundary.radius.md,
  border: `${swim26Boundary.border.thin}px solid rgba(255,255,255,0.08)`,
  background: 'rgba(255,255,255,0.03)',
};

const primaryButtonStyle: React.CSSProperties = {
  minWidth: swim26Size.buttons.cta.minWidth,
  minHeight: swim26Size.buttons.cta.height,
  borderRadius: swim26Boundary.radius.md,
  border: `${swim26Boundary.border.thin}px solid ${swim26Color.accent.primary}`,
  background: swim26Color.accent.primary,
  color: '#06202A',
  fontSize: swim26Type.buttonLabel.fontSize,
  fontWeight: swim26Type.buttonLabel.fontWeight,
  letterSpacing: swim26Type.buttonLabel.letterSpacing,
  boxShadow: swim26Boundary.elevation.level2,
};

const secondaryButtonStyle: React.CSSProperties = {
  minWidth: swim26Size.buttons.standard.minWidth,
  minHeight: swim26Size.buttons.standard.height,
  borderRadius: swim26Boundary.radius.md,
  border: `${swim26Boundary.border.thin}px solid ${swim26Color.divider}`,
  background: 'rgba(255,255,255,0.04)',
  color: swim26Color.text.primary,
  fontSize: swim26Type.buttonLabel.fontSize,
  fontWeight: swim26Type.buttonLabel.fontWeight,
  letterSpacing: '0.02em',
};

const features: HomeFeature[] = [
  {
    id: 'QUICK_RACE',
    eyebrow: 'LIVE COMPETITION',
    title: 'Quick Race',
    description: 'Instant matchmaking, lane-ready telemetry, and direct launch into ranked sessions.',
    buttonLabel: 'Start Race',
    badge: 'Competitive',
    icon: '⚡',
    accent: swim26Color.accent.primary,
    border: 'rgba(74, 201, 214, 0.26)',
    badgeBackground: 'rgba(74, 201, 214, 0.16)',
    image: p2pQuickMatchImage,
    focalPoint: '50% 45%',
  },
  {
    id: 'CAREER',
    eyebrow: 'SEASON PROGRESSION',
    title: 'Career',
    description: 'Track contracts, sponsor objectives, and your route toward elite division placement.',
    buttonLabel: 'Open Career',
    badge: 'Achievements',
    icon: '🏆',
    accent: swim26Color.featured.premium,
    border: 'rgba(214, 180, 90, 0.28)',
    badgeBackground: 'rgba(214, 180, 90, 0.16)',
    image: miaPhiriAthleteImage,
    focalPoint: '50% 22%',
  },
  {
    id: 'SOCIAL',
    eyebrow: 'CLUB OPERATIONS',
    title: 'Social Hub',
    description: 'Manage club chat, rivalry alerts, and team requests without leaving the command deck.',
    buttonLabel: 'Open Social',
    badge: '+12 Online',
    icon: '✦',
    accent: swim26Color.accent.secondary,
    border: 'rgba(30, 143, 163, 0.26)',
    badgeBackground: 'rgba(30, 143, 163, 0.18)',
    image: p2pQuickMatchImage,
    focalPoint: '50% 52%',
  },
];

const subPageContent: Record<Exclude<HomeSubPage, null>, {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  primaryLabel: string;
  accent: string;
}> = {
  QUICK_RACE: {
    eyebrow: 'RACE OPS',
    title: 'Quick Race Command',
    description: 'Queue setup, opponent matching, and live launch controls all stay inside one pre-race action frame.',
    bullets: ['Sprint Queue', 'Time Trial Entry', 'Relay Warmup Slot'],
    primaryLabel: 'Launch Quick Race',
    accent: swim26Color.accent.primary,
  },
  CAREER: {
    eyebrow: 'SEASON PATH',
    title: 'Career Command',
    description: 'Milestone tracking, rank projection, sponsor targets, and season pacing stay aligned inside one progression surface.',
    bullets: ['Season Milestones', 'Sponsor Targets', 'Coach Notes', 'Rank Projection'],
    primaryLabel: 'Continue Career',
    accent: swim26Color.featured.premium,
  },
  SOCIAL: {
    eyebrow: 'COMMUNITY OPS',
    title: 'Social Hub',
    description: 'Friends online, rival alerts, and club comms live in one feed-first panel so the social layer feels operational, not decorative.',
    bullets: ['Squad Chat', 'Rival Alerts', 'Club Requests'],
    primaryLabel: 'Open Social Hub',
    accent: swim26Color.accent.secondary,
  },
};

export const HomeScreen: React.FC<HomeScreenProps> = ({
  player,
  onPlayClick,
  onCareerClick,
  onSocialClick,
}) => {
  const isLandscapeMobile = useIsLandscapeMobile();
  const [activeSubPage, setActiveSubPage] = useState<HomeSubPage>(null);

  const activeFeature = useMemo(
    () => features.find((feature) => feature.id === activeSubPage) ?? null,
    [activeSubPage],
  );

  const handlePrimaryAction = () => {
    if (activeSubPage === 'QUICK_RACE') onPlayClick?.();
    if (activeSubPage === 'CAREER') onCareerClick?.();
    if (activeSubPage === 'SOCIAL') onSocialClick?.();
  };

  return (
    <div className={`hydro-page-shell flex-1 relative w-full h-full font-body ${isLandscapeMobile ? 'overflow-hidden' : 'overflow-y-auto'}`}>
      <PaneSwitcher
        panes={[
          {
            id: 'COMMAND',
            label: 'COMMAND',
            icon: <GameIcon name="speed" size={20} />,
            content: (
              <div className="p-6 space-y-6 overflow-y-auto h-full pb-20 scrollbar-hide">
                <div className="relative rounded-[32px] overflow-hidden bg-linear-to-br from-primary/20 to-surface p-8 border border-white/10">
                  <h2 className="font-headline text-3xl font-black italic slanted uppercase text-on-surface text-glow mb-2">Tactical Command</h2>
                  <p className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant mb-8 opacity-60 italic">Athlete Authorization Required</p>
                  <button onClick={onPlayClick} className="w-full h-20 rounded-[24px] bg-primary border-b-4 border-primary-dark active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-4 group/btn">
                     <span className="font-headline text-2xl font-black italic slanted uppercase text-surface">Launch Heat</span>
                     <span style={{fontSize:'30px', lineHeight:1}} className="group-hover:translate-x-2 transition-transform">→</span>
                  </button>
                </div>
              </div>
            )
          },
          {
            id: 'CAREER',
            label: 'CAREER',
            icon: <GameIcon name="emoji_events" size={20} />,
            content: (
              <div className="p-6 space-y-6 overflow-y-auto h-full pb-20 scrollbar-hide">
                 <h3 className="font-headline text-xl font-black italic slanted uppercase tracking-widest text-primary px-2">Career Outlook</h3>
                 <div className="space-y-3">
                    {['Rookie Series', 'Open Regional', 'Global Finals'].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={onCareerClick}
                        className="w-full p-6 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-between game-tap-feedback text-left"
                        aria-label={`Open career milestone ${lvl}`}
                      >
                        <span className="font-headline text-lg font-black italic slanted uppercase text-on-surface">{lvl}</span>
                        <span className="text-on-surface-variant opacity-40">➔</span>
                      </button>
                    ))}
                 </div>
              </div>
            )
          },
          {
            id: 'NETWORK',
            label: 'NETWORK',
            icon: <GameIcon name="public" size={20} />,
            content: (
              <div className="p-6 space-y-6 overflow-y-auto h-full pb-20 scrollbar-hide">
                 <h3 className="font-headline text-xl font-black italic slanted uppercase tracking-widest text-secondary px-2">Global Matrix</h3>
                 <div className="grid grid-cols-2 gap-4">
                    <button onClick={onSocialClick} className="h-28 rounded-[24px] bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-2 game-tap-feedback">
                       <span style={{fontSize:'24px'}}>👥</span>
                       <span className="text-[10px] font-black uppercase text-on-surface-variant">Squad</span>
                    </button>
                    <button onClick={onSocialClick} className="h-28 rounded-[24px] bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-2 game-tap-feedback">
                       <span style={{fontSize:'24px'}}>⚡</span>
                       <span className="text-[10px] font-black uppercase text-on-surface-variant">Rivals</span>
                    </button>
                 </div>
              </div>
            )
          }
        ]}
      >
        <div
          style={{
            height: '100%',
            color: swim26Color.text.primary,
            background: `radial-gradient(circle at 18% 16%, rgba(74, 201, 214, 0.10), transparent 22%), radial-gradient(circle at 78% 18%, rgba(214, 180, 90, 0.10), transparent 18%), linear-gradient(180deg, rgba(9, 21, 30, 0.78) 0%, rgba(7, 19, 28, 0.82) 100%)`,
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              padding: `${swim26Layout.safe.top}px ${swim26Layout.safe.right}px ${swim26Layout.safe.bottom}px`,
              display: 'grid',
              gap: swim26Space.md,
              minHeight: '100%',
              boxSizing: 'border-box',
            }}
          >
        <section
          style={{
            ...shellPanel,
            padding: swim26Space.lg,
            display: 'grid',
            gap: swim26Space.md,
            background: 'linear-gradient(180deg, rgba(20, 38, 54, 0.94) 0%, rgba(13, 27, 39, 0.94) 100%)',
          }}
        >
          <div style={{ display: 'grid', gap: 6 }}>
            <div style={{ fontSize: swim26Type.metadata.fontSize, fontWeight: 700, color: swim26Color.accent.primary, letterSpacing: '0.08em' }}>
              HOME COMMAND DECK
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: swim26Type.displayHeading.fontSize,
                lineHeight: `${swim26Type.displayHeading.lineHeight}px`,
                fontWeight: swim26Type.displayHeading.fontWeight,
                letterSpacing: swim26Type.displayHeading.letterSpacing,
              }}
            >
              Race, progress, and club control in one premium shell
            </h1>
            <div style={{ maxWidth: 720, fontSize: swim26Type.cardTitle.fontSize, lineHeight: '22px', color: swim26Color.text.secondary }}>
              The home surface now follows the same containment logic as League, Exchange, Store, and overlays: one priority hero band, one secondary action rail, and one clear action hierarchy.
            </div>
          </div>

          {activeFeature ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1.1fr) minmax(320px, 0.9fr)',
                gap: swim26Space.md,
                alignItems: 'stretch',
              }}
            >
              <div style={{ ...subPanelStyle, overflow: 'hidden', position: 'relative', minHeight: 280 }}>
                <FeatureCardMedia
                  src={activeFeature.image}
                  alt={activeFeature.title}
                  className="absolute inset-0 h-full w-full object-cover"
                  overlayClassName="absolute inset-0"
                  focalPoint={activeFeature.focalPoint}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(7, 19, 28, 0.18) 0%, rgba(7, 19, 28, 0.52) 32%, rgba(7, 19, 28, 0.92) 100%)',
                  }}
                />
                <div
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    height: '100%',
                    padding: swim26Space.lg,
                    display: 'grid',
                    alignContent: 'end',
                    gap: swim26Space.sm,
                  }}
                >
                  <span
                    style={{
                      height: swim26Size.badge.height,
                      padding: `0 ${swim26Space.sm}px`,
                      borderRadius: swim26Boundary.radius.pill,
                      background: activeFeature.badgeBackground,
                      border: `${swim26Boundary.border.thin}px solid ${activeFeature.border}`,
                      color: activeFeature.accent,
                      display: 'inline-flex',
                      alignItems: 'center',
                      fontSize: 10,
                      fontWeight: 800,
                      justifySelf: 'start',
                    }}
                  >
                    {activeFeature.badge}
                  </span>
                  <div style={{ fontSize: 18, lineHeight: '20px', color: activeFeature.accent, fontWeight: 700 }}>{activeFeature.eyebrow}</div>
                  <div style={{ fontSize: 34, lineHeight: '38px', fontWeight: 800 }}>{activeFeature.title}</div>
                </div>
              </div>

              <div
                style={{
                  ...subPanelStyle,
                  padding: swim26Space.lg,
                  display: 'grid',
                  gridTemplateRows: 'auto 1fr auto',
                  gap: swim26Space.md,
                  minHeight: 280,
                }}
              >
                <div style={{ display: 'grid', gap: 8 }}>
                  <div style={{ fontSize: swim26Type.metadata.fontSize, color: subPageContent[activeSubPage].accent, fontWeight: 700, letterSpacing: '0.08em' }}>
                    {subPageContent[activeSubPage].eyebrow}
                  </div>
                  <div style={{ fontSize: 28, lineHeight: '32px', fontWeight: 800 }}>
                    {subPageContent[activeSubPage].title}
                  </div>
                  <div style={{ fontSize: 14, lineHeight: '20px', color: swim26Color.text.secondary }}>
                    {subPageContent[activeSubPage].description}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: swim26Space.sm, alignContent: 'start' }}>
                  {subPageContent[activeSubPage].bullets.map((item) => (
                    <div key={item} style={{ ...subPanelStyle, padding: swim26Space.md, minHeight: 76, display: 'grid', alignContent: 'center', fontSize: 13, lineHeight: '18px', fontWeight: 700 }}>
                      {item}
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: swim26Space.sm, justifyContent: 'space-between', flexWrap: 'wrap' }}>
                  <button onClick={() => setActiveSubPage(null)} style={secondaryButtonStyle}>
                    Back
                  </button>
                  <button onClick={handlePrimaryAction} style={{ ...primaryButtonStyle, background: subPageContent[activeSubPage].accent, borderColor: subPageContent[activeSubPage].accent }}>
                    {subPageContent[activeSubPage].primaryLabel}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
                gap: swim26Space.md,
              }}
            >
              {features.map((feature) => (
                <article
                  key={feature.id}
                  onClick={() => setActiveSubPage(feature.id)}
                  style={{
                    ...subPanelStyle,
                    overflow: 'visible',
                    padding: 0,
                    minHeight: 320,
                    position: 'relative',
                    textAlign: 'left',
                    display: 'grid',
                    cursor: 'pointer',
                  }}
                >
                  {/* Image wrapper — overflow:hidden contained here only, never on card root */}
                  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                  <FeatureCardMedia
                    src={feature.image}
                    alt={feature.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    overlayClassName="absolute inset-0"
                    focalPoint={feature.focalPoint}
                  />
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(180deg, rgba(7, 19, 28, 0.14) 0%, rgba(7, 19, 28, 0.42) 34%, rgba(7, 19, 28, 0.92) 100%)`,
                    }}
                  />
                  <div
                    style={{
                      position: 'relative',
                      zIndex: 1,
                      height: '100%',
                      padding: swim26Space.lg,
                      display: 'grid',
                      alignContent: 'space-between',
                      gap: swim26Space.md,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: swim26Space.sm }}>
                      <span
                        style={{
                          height: swim26Size.badge.height,
                          padding: `0 ${swim26Space.sm}px`,
                          borderRadius: swim26Boundary.radius.pill,
                          background: feature.badgeBackground,
                          border: `${swim26Boundary.border.thin}px solid ${feature.border}`,
                          color: feature.accent,
                          display: 'inline-flex',
                          alignItems: 'center',
                          fontSize: 10,
                          fontWeight: 800,
                        }}
                      >
                        {feature.badge}
                      </span>
                      <span style={{ fontSize: 28, lineHeight: 1, color: feature.accent }}>{feature.icon}</span>
                    </div>

                    <div style={{ display: 'grid', gap: swim26Space.sm }}>
                      <div style={{ fontSize: swim26Type.metadata.fontSize, color: feature.accent, fontWeight: 700, letterSpacing: '0.08em' }}>
                        {feature.eyebrow}
                      </div>
                      <div style={{ fontSize: 28, lineHeight: '30px', fontWeight: 800 }}>{feature.title}</div>
                      <div style={{ fontSize: 14, lineHeight: '20px', color: swim26Color.text.secondary }}>{feature.description}</div>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          setActiveSubPage(feature.id);
                        }}
                        style={{
                          ...primaryButtonStyle,
                          minWidth: swim26Size.buttons.standard.minWidth,
                          minHeight: swim26Size.buttons.standard.height,
                          justifySelf: 'start',
                          background: `${feature.accent}22`,
                          borderColor: feature.border,
                          color: feature.accent,
                          boxShadow: swim26Boundary.elevation.level1,
                        }}
                      >
                        {feature.buttonLabel}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  </PaneSwitcher>
</div>
);
};

interface HomeRightPanelProps {
  onOpenShop?: () => void;
  onOpenShopItem?: (itemId: string) => void;
}

export const HomeRightPanel: React.FC<HomeRightPanelProps> = () => {
  const [completedObjectives, setCompletedObjectives] = useState<Set<number>>(new Set([2]));

  const dailyObjectives = [
    { id: 1, name: 'Complete 2 sprint races', progress: 1, total: 2, icon: 'play_arrow' },
    { id: 2, name: 'Perform 3 perfect turns', progress: 3, total: 3, icon: 'edit' },
    { id: 3, name: 'Train endurance once', progress: 0, total: 1, icon: 'fitness_center' },
    { id: 4, name: 'Beat one rival ghost', progress: 0, total: 1, icon: 'emoji_events' },
  ];

  const activeEvents = [
    { name: 'World Sprint Cup', time: '05:14:22', tag: 'LIVE' },
    { name: 'Butterfly Challenge', time: '2D 14H', tag: 'EVENT' },
  ];

  const progressPercent = (progress: number, total: number) => Math.min((progress / total) * 100, 100);

  return (
    <div style={{ display: 'grid', gap: swim26Space.md }}>
      <div
        style={{
          ...shellPanel,
          padding: swim26Space.lg,
          display: 'grid',
          gap: swim26Space.md,
          background: 'linear-gradient(180deg, rgba(20, 38, 54, 0.94) 0%, rgba(13, 27, 39, 0.94) 100%)',
        }}
      >
        <div style={{ fontSize: swim26Type.metadata.fontSize, color: swim26Color.accent.primary, fontWeight: 700, letterSpacing: '0.08em' }}>
          DAILY OBJECTIVES
        </div>
        <div style={{ display: 'grid', gap: swim26Space.sm }}>
          {dailyObjectives.map((objective) => {
            const isCompleted = completedObjectives.has(objective.id) || objective.progress >= objective.total;
            const fillPercent = progressPercent(objective.progress, objective.total);
            return (
              <button
                key={objective.id}
                onClick={() => {
                  if (objective.progress >= objective.total) {
                    setCompletedObjectives((previous) => new Set(previous).add(objective.id));
                  }
                }}
                style={{
                  ...subPanelStyle,
                  padding: swim26Space.md,
                  display: 'grid',
                  gridTemplateColumns: '44px minmax(0, 1fr) 72px',
                  gap: swim26Space.sm,
                  alignItems: 'center',
                  background: isCompleted ? 'rgba(214, 180, 90, 0.08)' : 'rgba(255,255,255,0.03)',
                  borderColor: isCompleted ? 'rgba(214, 180, 90, 0.24)' : 'rgba(255,255,255,0.08)',
                  textAlign: 'left',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: swim26Boundary.radius.sm,
                    background: isCompleted ? 'rgba(214, 180, 90, 0.14)' : 'rgba(74, 201, 214, 0.10)',
                    border: `${swim26Boundary.border.thin}px solid ${isCompleted ? 'rgba(214, 180, 90, 0.28)' : 'rgba(74, 201, 214, 0.24)'}`,
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <GameIcon name={objective.icon} size={20} className={isCompleted ? 'text-secondary' : 'text-primary'} />
                </div>

                <div style={{ minWidth: 0, display: 'grid', gap: 4 }}>
                  <div style={{ fontSize: 13, lineHeight: '18px', fontWeight: 700 }}>{objective.name}</div>
                  <div style={{ fontSize: swim26Type.helper.fontSize, color: swim26Color.text.secondary }}>
                    {isCompleted ? 'Reward ready' : `${objective.progress} / ${objective.total} complete`}
                  </div>
                </div>

                <div style={{ display: 'grid', gap: 6 }}>
                  <div style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${fillPercent}%`,
                        height: '100%',
                        borderRadius: 999,
                        background: isCompleted ? swim26Color.featured.premium : swim26Color.accent.primary,
                      }}
                    />
                  </div>
                  <div style={{ fontSize: 10, color: isCompleted ? swim26Color.featured.premium : swim26Color.text.secondary, fontWeight: 700, textAlign: 'right' }}>
                    {isCompleted ? 'CLAIM' : `${Math.round(fillPercent)}%`}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ ...shellPanel, padding: swim26Space.lg, display: 'grid', gap: swim26Space.md }}>
        <div style={{ fontSize: swim26Type.metadata.fontSize, color: swim26Color.featured.premium, fontWeight: 700, letterSpacing: '0.08em' }}>
          ACTIVE EVENTS
        </div>
        <div style={{ display: 'grid', gap: swim26Space.sm }}>
          {activeEvents.map((event) => (
            <div
              key={event.name}
              style={{
                ...subPanelStyle,
                padding: swim26Space.md,
                display: 'grid',
                gap: 6,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: swim26Space.sm, alignItems: 'center' }}>
                <div style={{ fontSize: 14, lineHeight: '18px', fontWeight: 700 }}>{event.name}</div>
                <span
                  style={{
                    height: swim26Size.badge.height,
                    padding: `0 ${swim26Space.sm}px`,
                    borderRadius: swim26Boundary.radius.pill,
                    background: event.tag === 'LIVE' ? 'rgba(240, 106, 95, 0.16)' : 'rgba(74, 201, 214, 0.12)',
                    color: event.tag === 'LIVE' ? swim26Color.feedback.alert : swim26Color.accent.primary,
                    display: 'inline-flex',
                    alignItems: 'center',
                    fontSize: 10,
                    fontWeight: 800,
                  }}
                >
                  {event.tag}
                </span>
              </div>
              <div style={{ fontSize: swim26Type.numeric.fontSize, lineHeight: `${swim26Type.numeric.lineHeight}px`, fontWeight: swim26Type.numeric.fontWeight, color: swim26Color.accent.primary }}>
                {event.time}
              </div>
              <div style={{ fontSize: swim26Type.helper.fontSize, color: swim26Color.text.secondary }}>
                Countdown chips, event containment, and supporting text now follow the same hierarchy used in League and Championship hubs.
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
