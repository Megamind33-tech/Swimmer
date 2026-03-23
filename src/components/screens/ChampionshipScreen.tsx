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

type ChampionshipTab = 'ALL' | 'CHAT' | 'MATCH' | 'INFO';
type ChampionshipNav = 'HOME' | 'QUESTS' | 'REWARDS' | 'TOURNAMENT' | 'LEADERBOARDS';
type FeedType = 'quest' | 'unlock' | 'match' | 'chat' | 'info';

interface FeedItem {
  id: number;
  type: FeedType;
  title: string;
  body: string;
  time: string;
  action?: string;
  badge: string;
  unread?: boolean;
}

const tabs: ChampionshipTab[] = ['ALL', 'CHAT', 'MATCH', 'INFO'];

const navItems: { id: ChampionshipNav; label: string; icon: string; badge?: number }[] = [
  { id: 'HOME', label: 'Home', icon: '⌂' },
  { id: 'QUESTS', label: 'Quests', icon: '◈', badge: 1 },
  { id: 'REWARDS', label: 'Rewards', icon: '✦', badge: 3 },
  { id: 'TOURNAMENT', label: 'Tournament', icon: '⚑' },
  { id: 'LEADERBOARDS', label: 'Leaderboards', icon: '▤' },
];

const feedItems: FeedItem[] = [
  {
    id: 1,
    type: 'match',
    title: 'Heat Assignment Confirmed: Semi Final A',
    body: 'Your club relay starts from Lane 4 at 19:30. Warmup window opens in 24 minutes and ranking points are boosted by 1.2×.',
    time: '24m left',
    action: 'View Heat',
    badge: 'LIVE',
    unread: true,
  },
  {
    id: 2,
    type: 'quest',
    title: 'Championship Quest Complete: Podium Pressure',
    body: 'You cleared the podium pressure objective. Claim 900 SP, 1 elite film token, and a stamina recovery boost.',
    time: '9m ago',
    action: 'Claim',
    badge: 'COMPLETED',
    unread: true,
  },
  {
    id: 3,
    type: 'unlock',
    title: 'Unlock Available: Finals Strategy Room',
    body: 'Advanced split projections are now available for the top eight qualifiers in your bracket.',
    time: '28m ago',
    action: 'Inspect',
    badge: 'UNLOCK',
  },
  {
    id: 4,
    type: 'chat',
    title: 'Coach Broadcast: Rotation Change',
    body: 'Butterfly specialist moved to anchor leg. Reply if you need lane comparison before the semifinal call.',
    time: '43m ago',
    action: 'Reply',
    badge: 'CHAT',
  },
  {
    id: 5,
    type: 'info',
    title: 'Championship Notice: Region Bonus Updated',
    body: 'Regional pool familiarity bonus now applies to qualifying rounds only. Finals use neutral venue balancing.',
    time: 'Today',
    badge: 'NOTICE',
  },
];

const feedTypeStyle: Record<FeedType, { accent: string; wash: string; icon: string }> = {
  quest: { accent: swim26Color.feedback.success, wash: 'rgba(54, 198, 144, 0.10)', icon: '✓' },
  unlock: { accent: swim26Color.featured.premium, wash: 'rgba(214, 180, 90, 0.12)', icon: '✦' },
  match: { accent: swim26Color.accent.primary, wash: 'rgba(74, 201, 214, 0.10)', icon: '⚑' },
  chat: { accent: swim26Color.accent.secondary, wash: 'rgba(30, 143, 163, 0.12)', icon: '✉' },
  info: { accent: swim26Color.feedback.warning, wash: 'rgba(255, 158, 87, 0.12)', icon: 'i' },
};

const panelStyle: React.CSSProperties = {
  borderRadius: swim26Boundary.radius.md,
  border: `${swim26Boundary.border.thin}px solid ${swim26Color.divider}`,
  background: swim26Color.surface.secondary,
  boxShadow: swim26Boundary.elevation.level1,
};

const utilityButtonStyle: React.CSSProperties = {
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

export const ChampionshipScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ChampionshipTab>('ALL');
  const [activeNav, setActiveNav] = useState<ChampionshipNav>('TOURNAMENT');

  const filteredFeed = useMemo(() => {
    if (activeTab === 'ALL') return feedItems;
    if (activeTab === 'CHAT') return feedItems.filter((item) => item.type === 'chat');
    if (activeTab === 'MATCH') return feedItems.filter((item) => item.type === 'match' || item.type === 'quest');
    return feedItems.filter((item) => item.type === 'unlock' || item.type === 'info');
  }, [activeTab]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `radial-gradient(circle at 16% 18%, rgba(214, 180, 90, 0.12), transparent 22%), radial-gradient(circle at 78% 16%, rgba(74, 201, 214, 0.10), transparent 20%), linear-gradient(180deg, #09151E 0%, ${swim26Color.bg.app} 48%, #061018 100%)`,
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
          opacity: 0.18,
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.025) 16%, transparent 16.4%, transparent 37%, rgba(255,255,255,0.018) 37.3%, transparent 38%, transparent 61%, rgba(255,255,255,0.022) 61.3%, transparent 62%, transparent 100%)',
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
            ...panelStyle,
            borderRadius: swim26Boundary.radius.lg,
            background: swim26Color.surface.primary,
            display: 'grid',
            gridTemplateColumns: '88px minmax(280px, 1fr) auto',
            alignItems: 'center',
            columnGap: swim26Space.md,
            padding: `0 ${swim26Space.md}px`,
          }}
        >
          <button aria-label="Back" title="Back" className="focus-visible:ring-2 focus-visible:ring-[#D4A843] focus-visible:outline-none" style={{ ...utilityButtonStyle, width: 48, color: swim26Color.text.primary }}>←</button>

          <div style={{ display: 'grid', rowGap: 4, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: swim26Space.sm, flexWrap: 'wrap' }}>
              <span
                style={{
                  height: swim26Size.statusChip.height,
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
                CHAMPIONSHIP SERIES
              </span>
              <span style={{ fontSize: swim26Type.helper.fontSize, color: swim26Color.text.secondary }}>NATIONAL FINALS WEEK</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: swim26Space.md, flexWrap: 'wrap' }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: swim26Type.screenTitle.fontSize,
                  lineHeight: `${swim26Type.screenTitle.lineHeight}px`,
                  fontWeight: swim26Type.screenTitle.fontWeight,
                  letterSpacing: swim26Type.screenTitle.letterSpacing,
                }}
              >
                Championship Hub
              </h1>
              <div
                style={{
                  height: swim26Size.statusChip.height,
                  padding: `0 ${swim26Space.sm}px`,
                  borderRadius: swim26Boundary.radius.pill,
                  border: `${swim26Boundary.border.thin}px solid rgba(255, 158, 87, 0.28)`,
                  background: 'rgba(255, 158, 87, 0.12)',
                  color: swim26Color.feedback.warning,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: swim26Space.xs,
                  fontSize: swim26Type.metadata.fontSize,
                  fontWeight: 700,
                }}
              >
                <span>⏱</span>
                Finals close in 01D 08H
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: swim26Space.sm }}>
            {[
              { label: 'Inbox', icon: '✉' },
              { label: 'Bracket Alerts', icon: '◉', alert: true },
              { label: 'Settings', icon: '⚙' },
            ].map((item) => (
              <button key={item.label} aria-label={item.label} title={item.label} className="focus-visible:ring-2 focus-visible:ring-[#D4A843] focus-visible:outline-none" style={{ ...utilityButtonStyle, position: 'relative' }}>
                <span style={{ fontSize: swim26Size.icon.md }}>{item.icon}</span>
                {item.alert ? (
                  <span
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
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
              ...panelStyle,
              gridRow: '1 / span 2',
              background: 'linear-gradient(180deg, rgba(20, 38, 54, 0.96) 0%, rgba(13, 27, 39, 0.94) 100%)',
              borderColor: 'rgba(214, 180, 90, 0.24)',
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
                  background: 'linear-gradient(180deg, rgba(214, 180, 90, 0.18), rgba(74, 201, 214, 0.10))',
                  display: 'grid',
                  placeItems: 'center',
                  boxShadow: swim26Boundary.elevation.level2,
                  fontSize: 40,
                }}
              >
                🏆
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ color: swim26Color.featured.premium, fontSize: swim26Type.metadata.fontSize, fontWeight: 700, letterSpacing: '0.08em' }}>
                  ELITE DIVISION
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
                  National Championships
                </h2>
                <div style={{ color: swim26Color.text.secondary, fontSize: swim26Type.metadata.fontSize, fontWeight: 600 }}>
                  Lusaka Aquatic Arena • Southern Region
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: swim26Space.sm }}>
              {[
                { label: 'Members', value: '128 Clubs', accent: swim26Color.accent.primary },
                { label: 'Global Rank', value: '#07', accent: swim26Color.featured.premium },
                { label: 'Champ Score', value: '92,840', accent: swim26Color.feedback.success },
                { label: 'Finalists', value: '16', accent: swim26Color.accent.secondary },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    ...panelStyle,
                    background: 'rgba(255,255,255,0.03)',
                    boxShadow: 'none',
                    borderColor: 'rgba(255,255,255,0.08)',
                    padding: swim26Space.sm,
                  }}
                >
                  <div style={{ fontSize: swim26Type.helper.fontSize, color: swim26Color.text.secondary, marginBottom: 6 }}>{stat.label}</div>
                  <div style={{ fontSize: 24, lineHeight: '26px', fontWeight: 800, color: stat.accent }}>{stat.value}</div>
                </div>
              ))}
            </div>

            <div style={{ ...panelStyle, background: 'rgba(255,255,255,0.03)', boxShadow: 'none', padding: swim26Space.md }}>
              <div style={{ fontSize: swim26Type.metadata.fontSize, color: swim26Color.text.secondary, marginBottom: 8, letterSpacing: '0.06em' }}>
                CHAMPIONSHIP MOTTO
              </div>
              <div style={{ fontSize: swim26Type.cardTitle.fontSize, lineHeight: '24px', fontWeight: 600 }}>
                “Every lane is earned twice — once in qualification, once in the final touch.”
              </div>
            </div>

            <div
              style={{
                ...panelStyle,
                background: 'rgba(255,255,255,0.03)',
                boxShadow: 'none',
                padding: swim26Space.md,
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
                    border: `${swim26Boundary.border.thin}px solid rgba(214, 180, 90, 0.28)`,
                    background: 'rgba(214, 180, 90, 0.12)',
                    color: swim26Color.featured.premium,
                    display: 'inline-flex',
                    alignItems: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  FINALS FAVORITE
                </span>
              </div>
              <div style={{ height: 10, borderRadius: 999, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                <div
                  style={{
                    width: '76%',
                    height: '100%',
                    borderRadius: 999,
                    background: `linear-gradient(90deg, ${swim26Color.featured.premium} 0%, ${swim26Color.accent.primary} 100%)`,
                  }}
                />
              </div>
              <div style={{ fontSize: swim26Type.helper.fontSize, color: swim26Color.text.secondary, lineHeight: '16px' }}>
                1,200 more standings points secure top seed protection and unlock the champions media package.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: swim26Space.sm }}>
              {[
                { label: 'Enter Heat', background: 'rgba(74, 201, 214, 0.14)', border: 'rgba(74, 201, 214, 0.36)', color: swim26Color.accent.primary },
                { label: 'Bracket', background: swim26Color.surface.tertiary, border: swim26Color.divider, color: swim26Color.text.primary },
              ].map((action) => (
                <button
                  key={action.label}
                  style={{
                    minHeight: swim26Size.buttons.standard.height,
                    borderRadius: swim26Boundary.radius.md,
                    border: `${swim26Boundary.border.thin}px solid ${action.border}`,
                    background: action.background,
                    color: action.color,
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
              ...panelStyle,
              padding: swim26Space.lg,
              minHeight: 0,
              display: 'grid',
              gridTemplateRows: 'auto auto minmax(0, 1fr)',
              gap: swim26Space.md,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: swim26Space.md, alignItems: 'start', flexWrap: 'wrap' }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: swim26Type.metadata.fontSize, color: swim26Color.accent.primary, fontWeight: 700, letterSpacing: '0.08em' }}>
                  CHAMPIONSHIP OPERATIONS FEED
                </div>
                <h3 style={{ margin: '6px 0 8px', fontSize: 28, lineHeight: '32px', fontWeight: 800 }}>Competition Updates & Team Chat</h3>
                <div style={{ color: swim26Color.text.secondary, fontSize: swim26Type.cardTitle.fontSize, lineHeight: '22px', maxWidth: 620 }}>
                  Match notices, completed objectives, unlocks, and coach messages are grouped into one high-clarity feed with fixed row structure.
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
                <div style={{ fontSize: swim26Type.metadata.fontSize, color: swim26Color.text.secondary }}>Readiness status</div>
                <div style={{ fontSize: 26, lineHeight: '28px', fontWeight: 800, color: swim26Color.accent.primary }}>5 / 6 Staff Ready</div>
                <div style={{ fontSize: swim26Type.helper.fontSize, color: swim26Color.text.secondary }}>One analyst has not confirmed lane replay support for the semifinal.</div>
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
              {tabs.map((tab) => {
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
                const state = feedTypeStyle[item.type];
                return (
                  <div
                    key={item.id}
                    style={{
                      minHeight: 88,
                      borderRadius: swim26Boundary.radius.md,
                      border: `${swim26Boundary.border.thin}px solid ${item.unread ? state.accent : swim26Color.divider}`,
                      background: item.unread ? state.wash : 'rgba(255,255,255,0.03)',
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
                        border: `${swim26Boundary.border.thin}px solid ${state.accent}55`,
                        background: state.wash,
                        color: state.accent,
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: swim26Size.icon.md,
                        fontWeight: 800,
                      }}
                    >
                      {state.icon}
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: swim26Space.sm, marginBottom: 6, flexWrap: 'wrap' }}>
                        <span
                          style={{
                            height: swim26Size.badge.height,
                            padding: `0 ${swim26Space.sm}px`,
                            borderRadius: swim26Boundary.radius.pill,
                            background: state.wash,
                            color: state.accent,
                            display: 'inline-flex',
                            alignItems: 'center',
                            fontSize: 10,
                            fontWeight: 800,
                            letterSpacing: '0.06em',
                          }}
                        >
                          {item.badge}
                        </span>
                        <span style={{ fontSize: swim26Type.helper.fontSize, color: swim26Color.text.secondary }}>{item.time}</span>
                      </div>
                      <div style={{ fontSize: swim26Type.cardTitle.fontSize, lineHeight: '20px', fontWeight: 700, marginBottom: 4 }}>{item.title}</div>
                      <div style={{ fontSize: 13, lineHeight: '18px', color: swim26Color.text.secondary }}>{item.body}</div>
                    </div>

                    <div style={{ display: 'grid', justifyItems: 'end', minWidth: 110 }}>
                      {item.action ? (
                        <button
                          style={{
                            minWidth: 110,
                            minHeight: 40,
                            padding: `0 ${swim26Space.md}px`,
                            borderRadius: swim26Boundary.radius.sm,
                            border: `${swim26Boundary.border.thin}px solid ${state.accent}66`,
                            background: item.type === 'match' || item.type === 'quest' ? state.accent : 'rgba(255,255,255,0.04)',
                            color: item.type === 'match' || item.type === 'quest' ? '#06202A' : state.accent,
                            fontSize: swim26Type.buttonLabel.fontSize,
                            fontWeight: 700,
                            boxShadow: swim26Boundary.elevation.level1,
                          }}
                        >
                          {item.action}
                        </button>
                      ) : (
                        <span style={{ width: 110 }} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <div
            style={{
              ...panelStyle,
              gridColumn: '2',
              display: 'grid',
              gridTemplateColumns: '52px minmax(0, 1fr) 120px',
              alignItems: 'center',
              gap: swim26Space.sm,
              padding: swim26Space.sm,
            }}
          >
            <button aria-label="Add" title="Add" className="focus-visible:ring-2 focus-visible:ring-[#D4A843] focus-visible:outline-none" style={{ ...utilityButtonStyle, width: 52, height: 52, color: swim26Color.text.primary }}>＋</button>
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
              Send a coach note, post a heat update, or call in a finals adjustment…
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
            ...panelStyle,
            borderRadius: swim26Boundary.radius.lg,
            background: swim26Color.surface.primary,
            display: 'grid',
            gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
            padding: swim26Space.xs,
            gap: swim26Space.xs,
          }}
        >
          {navItems.map((item) => {
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
