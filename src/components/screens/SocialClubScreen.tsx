import React, { useMemo, useState } from 'react';
import {
  swim26Boundary,
  swim26Color,
  swim26Components,
  swim26Layout,
  swim26Size,
  swim26Space,
  swim26StateRules,
  swim26Type,
} from '../../theme/swim26DesignSystem';

type ActivityTab = 'ALL' | 'CHAT' | 'MATCH' | 'INFO';
type BottomNav = 'HOME' | 'QUESTS' | 'REWARDS' | 'TOURNAMENT' | 'LEADERBOARDS';
type FeedType = 'quest' | 'unlock' | 'match' | 'chat' | 'info';

interface FeedItem {
  id: number;
  type: FeedType;
  title: string;
  body: string;
  time: string;
  action?: string;
  tag: string;
  unread?: boolean;
}

const activityTabs: ActivityTab[] = ['ALL', 'CHAT', 'MATCH', 'INFO'];

const localNavItems: { id: BottomNav; label: string; icon: string; badge?: number }[] = [
  { id: 'HOME', label: 'Home', icon: '⌂' },
  { id: 'QUESTS', label: 'Quests', icon: '◈', badge: 2 },
  { id: 'REWARDS', label: 'Rewards', icon: '✦', badge: 3 },
  { id: 'TOURNAMENT', label: 'Tournament', icon: '⚑' },
  { id: 'LEADERBOARDS', label: 'Leaderboards', icon: '▤' },
];

const feedItems: FeedItem[] = [
  {
    id: 1,
    type: 'quest',
    title: 'Quest Complete: Relay Recovery',
    body: 'Your club finished the 3-stage recovery quest. Claim 1,250 XP and a Hydro Crate before reset.',
    time: '4m ago',
    action: 'Claim',
    tag: 'COMPLETED',
    unread: true,
  },
  {
    id: 2,
    type: 'unlock',
    title: 'New Facility Unlock: Tactical Film Room',
    body: 'Analysis upgrades are now live. Team split review time drops by 12% this week.',
    time: '18m ago',
    action: 'Inspect',
    tag: 'UNLOCK',
  },
  {
    id: 3,
    type: 'match',
    title: 'Match Window Open: Coastal Sprint Final',
    body: 'Round 6 seeding closes in 32 minutes. Your relay is seeded 3rd and still eligible for prestige bonus.',
    time: '32m left',
    action: 'Enter',
    tag: 'LIVE',
    unread: true,
  },
  {
    id: 4,
    type: 'chat',
    title: 'Captain Message from A. Voss',
    body: 'Need two more swimmers online for tonight’s 4x100. Reply if you can lock your slot before warmup.',
    time: '1h ago',
    action: 'Reply',
    tag: 'CHAT',
  },
  {
    id: 5,
    type: 'info',
    title: 'League Notice: Region Rotation Published',
    body: 'Southern Atlantic pools rotate into ranked play on Friday. Lane familiarity bonuses are now visible in scouting.',
    time: 'Today',
    tag: 'NOTICE',
  },
];

const typeStyles: Record<FeedType, { accent: string; wash: string; icon: string; tagText: string }> = {
  quest: {
    accent: swim26Color.feedback.success,
    wash: 'rgba(54, 198, 144, 0.10)',
    icon: '✓',
    tagText: 'QUEST',
  },
  unlock: {
    accent: swim26Color.featured.premium,
    wash: 'rgba(214, 180, 90, 0.12)',
    icon: '✦',
    tagText: 'UNLOCK',
  },
  match: {
    accent: swim26Color.accent.primary,
    wash: 'rgba(74, 201, 214, 0.10)',
    icon: '⚑',
    tagText: 'MATCH',
  },
  chat: {
    accent: swim26Color.accent.secondary,
    wash: 'rgba(30, 143, 163, 0.12)',
    icon: '✉',
    tagText: 'CHAT',
  },
  info: {
    accent: swim26Color.feedback.warning,
    wash: 'rgba(255, 158, 87, 0.12)',
    icon: 'i',
    tagText: 'INFO',
  },
};

const iconButtonStyle: React.CSSProperties = {
  width: swim26Components.utilityIconButton.preferredSize,
  height: swim26Components.utilityIconButton.preferredSize,
  borderRadius: swim26Boundary.radius.sm,
  border: `${swim26Boundary.border.thin}px solid ${swim26Color.divider}`,
  background: swim26Color.surface.secondary,
  color: swim26Color.text.secondary,
  display: 'grid',
  placeItems: 'center',
  boxShadow: swim26Boundary.elevation.level1,
};

const statCardStyle: React.CSSProperties = {
  borderRadius: swim26Boundary.radius.md,
  border: `${swim26Boundary.border.thin}px solid ${swim26Color.divider}`,
  background: swim26Color.surface.secondary,
  padding: swim26Space.md,
  boxShadow: swim26Boundary.elevation.level1,
};

export const SocialClubScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActivityTab>('ALL');
  const [activeNav, setActiveNav] = useState<BottomNav>('HOME');

  const filteredFeed = useMemo(() => {
    if (activeTab === 'ALL') return feedItems;
    if (activeTab === 'CHAT') return feedItems.filter((item) => item.type === 'chat');
    if (activeTab === 'MATCH') return feedItems.filter((item) => item.type === 'match' || item.type === 'quest');
    return feedItems.filter((item) => item.type === 'info' || item.type === 'unlock');
  }, [activeTab]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `radial-gradient(circle at 18% 18%, rgba(74, 201, 214, 0.12), transparent 24%), radial-gradient(circle at 78% 20%, rgba(214, 180, 90, 0.10), transparent 18%), linear-gradient(180deg, #0A1822 0%, ${swim26Color.bg.app} 48%, #061018 100%)`,
        color: swim26Color.text.primary,
        fontFamily: 'Inter, system-ui, sans-serif',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.2,
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 18%, transparent 18.5%, transparent 39%, rgba(255,255,255,0.02) 39.4%, transparent 40%, transparent 61%, rgba(255,255,255,0.025) 61.4%, transparent 62%, transparent 100%)',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          padding: `${swim26Layout.safe.top}px ${swim26Layout.safe.right}px ${swim26Layout.safe.bottom}px ${swim26Layout.safe.left}px`,
          display: 'grid',
          gridTemplateRows: `${swim26Size.topBar.height}px minmax(0, 1fr) ${swim26Size.bottomNav.height}px`,
          gap: swim26Space.md,
          maxWidth: swim26Layout.grid.maxWidth,
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        <header
          style={{
            borderRadius: swim26Boundary.radius.lg,
            border: `${swim26Boundary.border.thin}px solid ${swim26Color.divider}`,
            background: swim26Color.surface.primary,
            boxShadow: swim26Boundary.elevation.level1,
            padding: `0 ${swim26Space.md}px`,
            display: 'grid',
            gridTemplateColumns: '88px minmax(240px, 1fr) auto',
            alignItems: 'center',
            columnGap: swim26Space.md,
          }}
        >
          <button
            style={{
              ...iconButtonStyle,
              width: 48,
              justifySelf: 'start',
              color: swim26Color.text.primary,
            }}
          >
            ←
          </button>

          <div style={{ display: 'grid', rowGap: 4, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: swim26Space.sm, minWidth: 0 }}>
              <span
                style={{
                  height: swim26Size.statusChip.height,
                  minWidth: swim26Components.countdownChip.minWidth,
                  padding: `0 ${swim26Space.sm}px`,
                  borderRadius: swim26Boundary.radius.pill,
                  border: `${swim26Boundary.border.thin}px solid rgba(214, 180, 90, 0.35)`,
                  background: 'rgba(214, 180, 90, 0.12)',
                  color: swim26Color.featured.premium,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: swim26Type.metadata.fontSize,
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                }}
              >
                SEASON 26
              </span>
              <span style={{ color: swim26Color.text.secondary, fontSize: swim26Type.helper.fontSize, whiteSpace: 'nowrap' }}>
                REGIONAL CLUB LEAGUE
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: swim26Space.md, minWidth: 0, flexWrap: 'wrap' }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: swim26Type.screenTitle.fontSize,
                  fontWeight: swim26Type.screenTitle.fontWeight,
                  lineHeight: `${swim26Type.screenTitle.lineHeight}px`,
                  letterSpacing: swim26Type.screenTitle.letterSpacing,
                  minWidth: 0,
                }}
              >
                League Hub
              </h1>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: swim26Space.xs,
                  height: swim26Size.statusChip.height,
                  padding: `0 ${swim26Space.sm}px`,
                  borderRadius: swim26Boundary.radius.pill,
                  background: 'rgba(255, 158, 87, 0.12)',
                  border: `${swim26Boundary.border.thin}px solid rgba(255, 158, 87, 0.28)`,
                  color: swim26Color.feedback.warning,
                  fontSize: swim26Type.metadata.fontSize,
                  fontWeight: 700,
                }}
              >
                <span>⏱</span>
                Season closes in 03D 12H
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: swim26Space.sm, justifySelf: 'end' }}>
            {[
              { label: 'Messages', icon: '✉' },
              { label: 'Alerts', icon: '◉' },
              { label: 'Settings', icon: '⚙' },
            ].map((item, index) => (
              <button key={item.label} aria-label={item.label} style={{ ...iconButtonStyle, position: 'relative' }}>
                <span style={{ fontSize: swim26Size.icon.md }}>{item.icon}</span>
                {index === 1 ? (
                  <span
                    style={{
                      position: 'absolute',
                      right: 8,
                      top: 8,
                      width: swim26Components.notificationBadge.dot,
                      height: swim26Components.notificationBadge.dot,
                      borderRadius: swim26Boundary.radius.pill,
                      background: swim26Color.feedback.alert,
                    }}
                  />
                ) : null}
              </button>
            ))}
          </div>
        </header>

        <div
          style={{
            minHeight: 0,
            display: 'grid',
            gridTemplateColumns: 'minmax(308px, 0.34fr) minmax(0, 0.66fr)',
            gridTemplateRows: 'minmax(0, 1fr) 92px',
            gap: swim26Space.md,
          }}
        >
          <aside
            style={{
              ...statCardStyle,
              gridRow: '1 / span 2',
              borderColor: 'rgba(214, 180, 90, 0.22)',
              background: `linear-gradient(180deg, rgba(20, 38, 54, 0.96) 0%, rgba(13, 27, 39, 0.94) 100%)`,
              display: 'grid',
              gridTemplateRows: 'auto auto auto 1fr auto',
              gap: swim26Space.md,
              padding: swim26Space.lg,
              minHeight: 0,
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '88px 1fr',
                gap: swim26Space.md,
                alignItems: 'center',
                paddingBottom: swim26Space.md,
                borderBottom: `${swim26Boundary.border.thin}px solid rgba(255,255,255,0.08)`,
              }}
            >
              <div
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: 22,
                  border: `${swim26Boundary.border.strong}px solid rgba(214, 180, 90, 0.42)`,
                  background: 'linear-gradient(180deg, rgba(214, 180, 90, 0.20), rgba(74, 201, 214, 0.12))',
                  display: 'grid',
                  placeItems: 'center',
                  boxShadow: swim26Boundary.elevation.level2,
                  fontSize: 40,
                }}
              >
                🛡
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ color: swim26Color.featured.premium, fontSize: swim26Type.metadata.fontSize, fontWeight: 700, letterSpacing: '0.08em' }}>
                  CONTINENTAL DIVISION
                </div>
                <h2
                  style={{
                    margin: '4px 0 6px',
                    fontSize: swim26Type.displayHeading.fontSize,
                    lineHeight: `${swim26Type.displayHeading.lineHeight}px`,
                    fontWeight: swim26Type.displayHeading.fontWeight,
                    letterSpacing: swim26Type.displayHeading.letterSpacing,
                  }}
                >
                  Aqua Vortex
                </h2>
                <div style={{ color: swim26Color.text.secondary, fontSize: swim26Type.metadata.fontSize, fontWeight: 600 }}>
                  Southern Atlantic Region
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: swim26Space.sm }}>
              {[
                { label: 'Members', value: '142 / 150', accent: swim26Color.accent.primary },
                { label: 'League Rank', value: '#12', accent: swim26Color.featured.premium },
                { label: 'Club Score', value: '89,420', accent: swim26Color.feedback.success },
                { label: 'Weekly Wins', value: '18', accent: swim26Color.accent.secondary },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    ...statCardStyle,
                    padding: swim26Space.sm,
                    background: 'rgba(255,255,255,0.03)',
                    borderColor: 'rgba(255,255,255,0.08)',
                    boxShadow: 'none',
                  }}
                >
                  <div style={{ fontSize: swim26Type.helper.fontSize, color: swim26Color.text.secondary, marginBottom: 6 }}>{stat.label}</div>
                  <div style={{ fontSize: 24, lineHeight: '26px', fontWeight: 800, color: stat.accent }}>{stat.value}</div>
                </div>
              ))}
            </div>

            <div style={{ ...statCardStyle, background: 'rgba(255,255,255,0.03)', boxShadow: 'none' }}>
              <div style={{ fontSize: swim26Type.metadata.fontSize, color: swim26Color.text.secondary, marginBottom: 8, letterSpacing: '0.06em' }}>
                LEAGUE MOTTO
              </div>
              <div style={{ fontSize: swim26Type.cardTitle.fontSize, lineHeight: '24px', fontWeight: 600 }}>
                “Win the water early, hold the lane late, and leave every relay tighter than it started.”
              </div>
            </div>

            <div
              style={{
                ...statCardStyle,
                background: 'rgba(255,255,255,0.03)',
                boxShadow: 'none',
                display: 'grid',
                gap: swim26Space.sm,
                alignContent: 'start',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: swim26Type.metadata.fontSize, color: swim26Color.text.secondary, letterSpacing: '0.06em' }}>PRESTIGE STATUS</span>
                <span
                  style={{
                    height: swim26Size.badge.height,
                    padding: `0 ${swim26Space.sm}px`,
                    borderRadius: swim26Boundary.radius.pill,
                    background: 'rgba(214, 180, 90, 0.12)',
                    border: `${swim26Boundary.border.thin}px solid rgba(214, 180, 90, 0.28)`,
                    color: swim26Color.featured.premium,
                    display: 'inline-flex',
                    alignItems: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  ELITE TIER
                </span>
              </div>
              <div style={{ height: 10, borderRadius: 999, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                <div
                  style={{
                    width: '72%',
                    height: '100%',
                    borderRadius: 999,
                    background: `linear-gradient(90deg, ${swim26Color.featured.premium} 0%, ${swim26Color.accent.primary} 100%)`,
                  }}
                />
              </div>
              <div style={{ fontSize: swim26Type.helper.fontSize, color: swim26Color.text.secondary, lineHeight: '16px' }}>
                1,880 more prestige points unlock Champion League placement and a +6% fan income multiplier.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: swim26Space.sm }}>
              {[
                { label: 'Invite', tone: swim26Color.accent.primary, background: 'rgba(74, 201, 214, 0.14)', border: 'rgba(74, 201, 214, 0.36)' },
                { label: 'Manage', tone: swim26Color.text.primary, background: swim26Color.surface.tertiary, border: swim26Color.divider },
              ].map((action) => (
                <button
                  key={action.label}
                  style={{
                    minHeight: swim26Size.buttons.standard.height,
                    borderRadius: swim26Boundary.radius.md,
                    border: `${swim26Boundary.border.thin}px solid ${action.border}`,
                    background: action.background,
                    color: action.tone,
                    fontSize: swim26Type.buttonLabel.fontSize,
                    fontWeight: swim26Type.buttonLabel.fontWeight,
                    letterSpacing: '0.02em',
                    boxShadow: swim26Boundary.elevation.level1,
                  }}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </aside>

          <section
            style={{
              ...statCardStyle,
              minHeight: 0,
              padding: swim26Space.lg,
              display: 'grid',
              gridTemplateRows: 'auto auto minmax(0, 1fr)',
              gap: swim26Space.md,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: swim26Space.md, alignItems: 'start', flexWrap: 'wrap' }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: swim26Type.metadata.fontSize, color: swim26Color.accent.primary, letterSpacing: '0.08em', fontWeight: 700 }}>
                  LIVE LEAGUE OPERATIONS
                </div>
                <h3 style={{ margin: '6px 0 8px', fontSize: 28, lineHeight: '32px', fontWeight: 800 }}>Club Feed & Match Control</h3>
                <div style={{ color: swim26Color.text.secondary, fontSize: swim26Type.cardTitle.fontSize, lineHeight: '22px', maxWidth: 620 }}>
                  Competitive updates, club chat, match readiness, and unlock notices are grouped into one scannable operations panel.
                </div>
              </div>

              <div
                style={{
                  minWidth: 220,
                  borderRadius: swim26Boundary.radius.md,
                  border: `${swim26Boundary.border.thin}px solid rgba(74, 201, 214, 0.18)`,
                  background: 'rgba(74, 201, 214, 0.08)',
                  padding: swim26Space.md,
                  display: 'grid',
                  gap: 6,
                }}
              >
                <div style={{ fontSize: swim26Type.metadata.fontSize, color: swim26Color.text.secondary }}>Match readiness</div>
                <div style={{ fontSize: 26, lineHeight: '28px', fontWeight: 800, color: swim26Color.accent.primary }}>3 / 4 Ready</div>
                <div style={{ fontSize: swim26Type.helper.fontSize, color: swim26Color.text.secondary }}>One swimmer has not confirmed tonight’s final entry.</div>
              </div>
            </div>

            <div
              style={{
                height: swim26Components.tabGroup.height,
                borderRadius: swim26Boundary.radius.md,
                border: `${swim26Boundary.border.thin}px solid ${swim26Color.divider}`,
                background: 'rgba(255,255,255,0.03)',
                padding: swim26Space.xs,
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                gap: swim26Space.xs,
              }}
            >
              {activityTabs.map((tab) => {
                const active = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      borderRadius: swim26Boundary.radius.sm,
                      border: active ? swim26StateRules.active.border : '1px solid transparent',
                      background: active ? 'rgba(74, 201, 214, 0.10)' : 'transparent',
                      color: active ? swim26Color.text.primary : swim26Color.text.secondary,
                      fontSize: swim26Type.tabLabel.fontSize,
                      fontWeight: swim26Type.tabLabel.fontWeight,
                      letterSpacing: swim26Type.tabLabel.letterSpacing,
                    }}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            <div style={{ minHeight: 0, overflowY: 'auto', paddingRight: 4, display: 'grid', gap: swim26Space.sm }}>
              {filteredFeed.map((item) => {
                const style = typeStyles[item.type];
                return (
                  <div
                    key={item.id}
                    style={{
                      minHeight: 88,
                      borderRadius: swim26Boundary.radius.md,
                      border: `${swim26Boundary.border.thin}px solid ${item.unread ? style.accent : swim26Color.divider}`,
                      background: item.unread ? style.wash : 'rgba(255,255,255,0.03)',
                      boxShadow: item.unread ? swim26Boundary.elevation.level1 : 'none',
                      display: 'grid',
                      gridTemplateColumns: '56px minmax(0, 1fr) auto',
                      alignItems: 'center',
                      gap: swim26Space.md,
                      padding: `${swim26Space.sm}px ${swim26Space.md}px`,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: swim26Boundary.radius.sm,
                        background: style.wash,
                        border: `${swim26Boundary.border.thin}px solid ${style.accent}55`,
                        color: style.accent,
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: swim26Size.icon.md,
                        fontWeight: 800,
                      }}
                    >
                      {style.icon}
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: swim26Space.sm, marginBottom: 6, flexWrap: 'wrap' }}>
                        <span
                          style={{
                            height: swim26Size.badge.height,
                            padding: `0 ${swim26Space.sm}px`,
                            borderRadius: swim26Boundary.radius.pill,
                            background: style.wash,
                            color: style.accent,
                            display: 'inline-flex',
                            alignItems: 'center',
                            fontSize: 10,
                            fontWeight: 800,
                            letterSpacing: '0.06em',
                          }}
                        >
                          {item.tag}
                        </span>
                        <span style={{ fontSize: swim26Type.helper.fontSize, color: swim26Color.text.secondary }}>{item.time}</span>
                      </div>
                      <div style={{ fontSize: swim26Type.cardTitle.fontSize, lineHeight: '20px', fontWeight: 700, marginBottom: 4 }}>{item.title}</div>
                      <div style={{ fontSize: 13, lineHeight: '18px', color: swim26Color.text.secondary }}>{item.body}</div>
                    </div>

                    <div style={{ display: 'grid', justifyItems: 'end', alignItems: 'center', gap: swim26Space.sm, minWidth: 104 }}>
                      {item.action ? (
                        <button
                          style={{
                            minWidth: 104,
                            minHeight: 40,
                            padding: `0 ${swim26Space.md}px`,
                            borderRadius: swim26Boundary.radius.sm,
                            border: `${swim26Boundary.border.thin}px solid ${style.accent}66`,
                            background: item.type === 'quest' || item.type === 'match' ? style.accent : 'rgba(255,255,255,0.04)',
                            color: item.type === 'quest' || item.type === 'match' ? '#06202A' : style.accent,
                            fontSize: swim26Type.buttonLabel.fontSize,
                            fontWeight: 700,
                            boxShadow: swim26Boundary.elevation.level1,
                          }}
                        >
                          {item.action}
                        </button>
                      ) : (
                        <span style={{ width: 104 }} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <div
            style={{
              ...statCardStyle,
              gridColumn: '2',
              display: 'grid',
              gridTemplateColumns: '52px minmax(0, 1fr) 120px',
              gap: swim26Space.sm,
              alignItems: 'center',
              padding: swim26Space.sm,
            }}
          >
            <button style={{ ...iconButtonStyle, width: 52, height: 52, color: swim26Color.text.primary }}>＋</button>
            <div
              style={{
                minHeight: 52,
                borderRadius: swim26Boundary.radius.md,
                border: `${swim26Boundary.border.thin}px solid ${swim26Color.divider}`,
                background: 'rgba(255,255,255,0.03)',
                display: 'flex',
                alignItems: 'center',
                padding: `0 ${swim26Space.md}px`,
                color: swim26Color.text.secondary,
                fontSize: swim26Type.cardTitle.fontSize,
              }}
            >
              Send a club update, tag a match squad, or post a strategy note…
            </div>
            <button
              style={{
                minHeight: 52,
                borderRadius: swim26Boundary.radius.md,
                border: `${swim26Boundary.border.thin}px solid ${swim26Color.accent.primary}`,
                background: swim26Color.accent.primary,
                color: '#06202A',
                fontSize: swim26Type.buttonLabel.fontSize,
                fontWeight: swim26Type.buttonLabel.fontWeight,
                letterSpacing: '0.04em',
                boxShadow: swim26Boundary.elevation.level2,
              }}
            >
              SEND
            </button>
          </div>
        </div>

        <nav
          style={{
            borderRadius: swim26Boundary.radius.lg,
            border: `${swim26Boundary.border.thin}px solid ${swim26Color.divider}`,
            background: swim26Color.surface.primary,
            boxShadow: swim26Boundary.elevation.level1,
            display: 'grid',
            gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
            alignItems: 'stretch',
            padding: swim26Space.xs,
            gap: swim26Space.xs,
          }}
        >
          {localNavItems.map((item) => {
            const active = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                style={{
                  position: 'relative',
                  borderRadius: swim26Boundary.radius.md,
                  border: active ? swim26StateRules.active.border : '1px solid transparent',
                  background: active ? 'rgba(74, 201, 214, 0.10)' : 'transparent',
                  color: active ? swim26Color.text.primary : swim26Color.text.secondary,
                  display: 'grid',
                  justifyItems: 'center',
                  alignContent: 'center',
                  gap: swim26Space.xs,
                  paddingTop: swim26Space.sm,
                  paddingBottom: swim26Space.xs,
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '18%',
                    right: '18%',
                    height: 3,
                    borderRadius: 999,
                    background: active ? swim26Color.accent.primary : 'transparent',
                  }}
                />
                <span style={{ fontSize: 22, lineHeight: 1 }}>{item.icon}</span>
                <span style={{ fontSize: 12, lineHeight: '14px', fontWeight: 600 }}>{item.label}</span>
                {item.badge ? (
                  <span
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: '28%',
                      minWidth: 18,
                      height: 18,
                      borderRadius: 999,
                      background: swim26Color.feedback.alert,
                      color: '#fff',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '0 4px',
                    }}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
