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
} from '../theme/swim26DesignSystem';

type TransferMode = 'ITEM_TRANSFER' | 'PLAYER_TRANSFER';

interface ExchangeCard {
  id: string;
  title: string;
  subtitle: string;
  ratingTier: string;
  inputItems: string[];
  outputItem: string;
  valueLabel: string;
  limit: string;
  timer: string;
  action: string;
  featured?: boolean;
}

interface SideOption {
  id: string;
  title: string;
  details: string;
  limit: string;
  refresh: string;
  state: 'active' | 'locked' | 'cooldown';
  accent: string;
}

const exchangeCards: ExchangeCard[] = [
  {
    id: 'elite-scout',
    title: 'Elite Scout Conversion',
    subtitle: 'Turn surplus athlete cards into a premium scouting reward.',
    ratingTier: '82+ RATED ATHLETES',
    inputItems: ['2× Sprint Specialist', '1× Relay Tactician', '20× Market Tokens'],
    outputItem: 'Elite Scout Crate',
    valueLabel: 'Value: 24,000 Market Credits',
    limit: 'Daily cap: 2',
    timer: 'Refresh in 01H 18M',
    action: 'Convert Now',
    featured: true,
  },
  {
    id: 'chemistry-pack',
    title: 'Chemistry Pack Exchange',
    subtitle: 'Bundle mid-tier athlete inventory into chemistry and training boosts.',
    ratingTier: '76–81 RATED ATHLETES',
    inputItems: ['3× Technique Athletes', '10× Energy Gel', '5× Film Strips'],
    outputItem: 'Gold Chemistry Pack',
    valueLabel: 'Value: 12,500 Market Credits',
    limit: 'Daily cap: 4',
    timer: 'Refresh in 32M',
    action: 'Build Pack',
  },
  {
    id: 'contract-swap',
    title: 'Contract Swap Route',
    subtitle: 'Exchange duplicate utility cards for direct roster contract value.',
    ratingTier: '72+ RATED ATHLETES',
    inputItems: ['1× Veteran Card', '2× Utility Athletes', '8× Contract Chips'],
    outputItem: '80,000 Contract Cash',
    valueLabel: 'Value: Direct economy payout',
    limit: 'Weekly cap: 5',
    timer: 'Refresh on Friday',
    action: 'Cash Out',
  },
];

const sideOptions: SideOption[] = [
  {
    id: 'youth-cycle',
    title: 'Youth Cycle Bundle',
    details: 'Swap 3 academy cards for a youth refresh pack and scouting intel.',
    limit: '2 remaining',
    refresh: 'Resets in 04H',
    state: 'active',
    accent: swim26Color.feedback.success,
  },
  {
    id: 'legend-pick',
    title: 'Legend Pick Exchange',
    details: 'Trade high-tier finals collectibles for one featured legendary selection.',
    limit: '0 remaining',
    refresh: 'Unlocks tomorrow',
    state: 'locked',
    accent: swim26Color.featured.premium,
  },
  {
    id: 'speed-flip',
    title: 'Speed Flip Offer',
    details: 'Fast-turn conversion from sprint tokens into consumable race boosts.',
    limit: '1 remaining',
    refresh: 'Cooldown 18M',
    state: 'cooldown',
    accent: swim26Color.accent.primary,
  },
];

const panelStyle: React.CSSProperties = {
  borderRadius: swim26Boundary.radius.md,
  border: `${swim26Boundary.border.thin}px solid ${swim26Color.divider}`,
  background: swim26Color.surface.secondary,
  boxShadow: swim26Boundary.elevation.level1,
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

export function TransferMarket() {
  const [mode, setMode] = useState<TransferMode>('ITEM_TRANSFER');
  const [activeCardId, setActiveCardId] = useState<string>(exchangeCards[0]?.id ?? '');

  const activeCards = useMemo(() => {
    if (mode === 'ITEM_TRANSFER') return exchangeCards;
    return exchangeCards.map((card, index) => ({
      ...card,
      id: `${card.id}-player`,
      title: index === 0 ? 'Featured Player Transfer' : index === 1 ? 'Starter Squad Transfer' : 'Prospect Cash Transfer',
      subtitle: index === 0
        ? 'Exchange completed athlete sets for direct player acquisition credit.'
        : index === 1
          ? 'Convert balanced-rated squads into a targeted player transfer slot.'
          : 'Move unused contracts into a lower-risk player purchase route.',
      outputItem: index === 0 ? '95,000 Player Transfer Credit' : index === 1 ? 'Starter Player Pick Pack' : 'Prospect Transfer Token',
      action: index === 0 ? 'Open Route' : index === 1 ? 'Claim Slot' : 'Convert Route',
    }));
  }, [mode]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        minHeight: '100%',
        background: `radial-gradient(circle at 18% 18%, rgba(74, 201, 214, 0.10), transparent 22%), radial-gradient(circle at 78% 14%, rgba(214, 180, 90, 0.10), transparent 18%), linear-gradient(180deg, #09161F 0%, ${swim26Color.bg.app} 54%, #061018 100%)`,
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
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.025) 16%, transparent 16.4%, transparent 38%, rgba(255,255,255,0.018) 38.3%, transparent 39%, transparent 62%, rgba(255,255,255,0.02) 62.4%, transparent 63%, transparent 100%)',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          padding: `${swim26Layout.safe.top}px ${swim26Layout.safe.right}px ${swim26Layout.safe.bottom}px ${swim26Layout.safe.left}px`,
          display: 'grid',
          gridTemplateRows: `${swim26Size.topBar.height}px minmax(0, 1fr) 78px`,
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
            gridTemplateColumns: '88px minmax(260px, 1fr) auto',
            alignItems: 'center',
            columnGap: swim26Space.md,
            padding: `0 ${swim26Space.md}px`,
          }}
        >
          <button style={{ ...iconButtonStyle, width: 48, color: swim26Color.text.primary }}>←</button>

          <div style={{ display: 'grid', rowGap: 4, minWidth: 0 }}>
            <div style={{ color: swim26Color.accent.primary, fontSize: swim26Type.metadata.fontSize, fontWeight: 700, letterSpacing: '0.08em' }}>
              MARKET CONVERSION DESK
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: swim26Type.screenTitle.fontSize,
                lineHeight: `${swim26Type.screenTitle.lineHeight}px`,
                fontWeight: swim26Type.screenTitle.fontWeight,
                letterSpacing: swim26Type.screenTitle.letterSpacing,
              }}
            >
              Transfer Market
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: swim26Space.sm }}>
            {[
              { label: 'Search', icon: '⌕' },
              { label: 'Filters', icon: '☰' },
              { label: 'Help', icon: '?' },
            ].map((item) => (
              <button key={item.label} aria-label={item.label} style={iconButtonStyle}>
                <span style={{ fontSize: swim26Size.icon.md }}>{item.icon}</span>
              </button>
            ))}
          </div>
        </header>

        <div
          style={{
            minHeight: 0,
            display: 'grid',
            gridTemplateColumns: 'minmax(240px, 0.23fr) minmax(0, 0.47fr) minmax(240px, 0.30fr)',
            gap: swim26Space.md,
          }}
        >
          <aside
            style={{
              ...panelStyle,
              background: 'linear-gradient(180deg, rgba(20, 38, 54, 0.96) 0%, rgba(13, 27, 39, 0.94) 100%)',
              display: 'grid',
              gridTemplateRows: 'auto auto 1fr auto',
              gap: swim26Space.md,
              padding: swim26Space.lg,
              minHeight: 0,
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '76px 1fr',
                gap: swim26Space.md,
                alignItems: 'center',
                paddingBottom: swim26Space.md,
                borderBottom: `${swim26Boundary.border.thin}px solid rgba(255,255,255,0.08)`,
              }}
            >
              <div
                style={{
                  width: 76,
                  height: 96,
                  borderRadius: 18,
                  border: `${swim26Boundary.border.strong}px solid rgba(74, 201, 214, 0.26)`,
                  background: 'linear-gradient(180deg, rgba(74, 201, 214, 0.14), rgba(13, 27, 39, 0.30))',
                  boxShadow: swim26Boundary.elevation.level2,
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 30,
                }}
              >
                🧑‍💼
              </div>
              <div>
                <div style={{ color: swim26Color.featured.premium, fontSize: swim26Type.metadata.fontSize, fontWeight: 700, letterSpacing: '0.08em' }}>
                  ECONOMY MANAGER
                </div>
                <div style={{ fontSize: swim26Type.sectionTitle.fontSize, lineHeight: '22px', fontWeight: 700, marginTop: 4 }}>Lena Mercer</div>
                <div style={{ color: swim26Color.text.secondary, fontSize: swim26Type.helper.fontSize, marginTop: 4 }}>Transfer Efficiency Lead</div>
              </div>
            </div>

            <div style={{ ...panelStyle, background: 'rgba(255,255,255,0.03)', boxShadow: 'none', padding: swim26Space.md }}>
              <div style={{ fontSize: swim26Type.metadata.fontSize, color: swim26Color.text.secondary, letterSpacing: '0.06em', marginBottom: 8 }}>
                HELP PANEL
              </div>
              <div style={{ fontSize: swim26Type.cardTitle.fontSize, lineHeight: '22px', fontWeight: 600, marginBottom: 10 }}>
                Choose a route, confirm the required athlete set, then compare the output value before locking the conversion.
              </div>
              <div style={{ fontSize: 13, lineHeight: '18px', color: swim26Color.text.secondary }}>
                Main rail cards show the exact input stack, conversion direction, result, cap, timer, and ratings tier so the trade is understandable in seconds.
              </div>
            </div>

            <div style={{ ...panelStyle, background: 'rgba(255,255,255,0.03)', boxShadow: 'none', padding: swim26Space.md, display: 'grid', gap: swim26Space.sm, alignContent: 'start' }}>
              {[
                { label: 'Budget Reserve', value: '182,000', accent: swim26Color.feedback.success },
                { label: 'Open Conversions', value: '03', accent: swim26Color.accent.primary },
                { label: 'Best Output', value: 'Elite Scout', accent: swim26Color.featured.premium },
              ].map((stat) => (
                <div key={stat.label} style={{ display: 'grid', gap: 2, paddingBottom: swim26Space.sm, borderBottom: `${swim26Boundary.border.thin}px solid rgba(255,255,255,0.06)` }}>
                  <div style={{ fontSize: swim26Type.helper.fontSize, color: swim26Color.text.secondary }}>{stat.label}</div>
                  <div style={{ fontSize: 22, lineHeight: '24px', fontWeight: 800, color: stat.accent }}>{stat.value}</div>
                </div>
              ))}
            </div>

            <button
              style={{
                minHeight: swim26Size.buttons.standard.height,
                borderRadius: swim26Boundary.radius.md,
                border: `${swim26Boundary.border.thin}px solid rgba(74, 201, 214, 0.28)`,
                background: 'rgba(74, 201, 214, 0.12)',
                color: swim26Color.accent.primary,
                fontSize: swim26Type.buttonLabel.fontSize,
                fontWeight: swim26Type.buttonLabel.fontWeight,
                letterSpacing: '0.02em',
                boxShadow: swim26Boundary.elevation.level1,
              }}
            >
              View conversion guide
            </button>
          </aside>

          <section style={{ minHeight: 0, overflowY: 'auto', paddingRight: 2, display: 'grid', gap: swim26Space.md, alignContent: 'start' }}>
            {activeCards.map((card) => {
              const active = activeCardId === card.id;
              return (
                <button
                  key={card.id}
                  onClick={() => setActiveCardId(card.id)}
                  style={{
                    ...panelStyle,
                    width: '100%',
                    textAlign: 'left',
                    padding: swim26Space.lg,
                    border: active ? swim26StateRules.active.border : `${swim26Boundary.border.thin}px solid ${swim26Color.divider}`,
                    background: active
                      ? 'linear-gradient(180deg, rgba(28, 50, 69, 0.82) 0%, rgba(20, 38, 54, 0.90) 100%)'
                      : 'linear-gradient(180deg, rgba(20, 38, 54, 0.92) 0%, rgba(13, 27, 39, 0.94) 100%)',
                    boxShadow: active ? swim26Boundary.elevation.level2 : swim26Boundary.elevation.level1,
                    display: 'grid',
                    gridTemplateRows: 'auto auto auto',
                    gap: swim26Space.md,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: swim26Space.md, alignItems: 'start', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: swim26Type.metadata.fontSize, color: card.featured ? swim26Color.featured.premium : swim26Color.accent.primary, fontWeight: 700, letterSpacing: '0.08em' }}>
                        {card.ratingTier}
                      </div>
                      <div style={{ fontSize: 24, lineHeight: '28px', fontWeight: 800, marginTop: 4 }}>{card.title}</div>
                      <div style={{ fontSize: 13, lineHeight: '18px', color: swim26Color.text.secondary, marginTop: 6, maxWidth: 520 }}>{card.subtitle}</div>
                    </div>
                    <div style={{ display: 'grid', gap: swim26Space.xs, justifyItems: 'end' }}>
                      <span style={{ height: swim26Size.badge.height, padding: `0 ${swim26Space.sm}px`, borderRadius: swim26Boundary.radius.pill, background: 'rgba(255, 158, 87, 0.12)', color: swim26Color.feedback.warning, display: 'inline-flex', alignItems: 'center', fontSize: 10, fontWeight: 800 }}>{card.timer}</span>
                      <span style={{ height: swim26Size.badge.height, padding: `0 ${swim26Space.sm}px`, borderRadius: swim26Boundary.radius.pill, background: 'rgba(255,255,255,0.06)', color: swim26Color.text.secondary, display: 'inline-flex', alignItems: 'center', fontSize: 10, fontWeight: 700 }}>{card.limit}</span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 76px 1fr', gap: swim26Space.md, alignItems: 'stretch' }}>
                    <div style={{ ...panelStyle, background: 'rgba(255,255,255,0.03)', boxShadow: 'none', padding: swim26Space.md, display: 'grid', gap: swim26Space.sm }}>
                      <div style={{ fontSize: swim26Type.metadata.fontSize, color: swim26Color.text.secondary, letterSpacing: '0.06em' }}>REQUIRED INPUTS</div>
                      {card.inputItems.map((input) => (
                        <div key={input} style={{ display: 'flex', alignItems: 'center', gap: swim26Space.sm, minHeight: 28 }}>
                          <span style={{ width: 18, height: 18, borderRadius: 9, background: 'rgba(74, 201, 214, 0.12)', border: `1px solid rgba(74, 201, 214, 0.24)`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: swim26Color.accent.primary, fontSize: 11 }}>•</span>
                          <span style={{ fontSize: 14, lineHeight: '18px', color: swim26Color.text.primary }}>{input}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'grid', alignContent: 'center', justifyItems: 'center', gap: swim26Space.sm }}>
                      <div style={{ width: 56, height: 56, borderRadius: 18, background: 'rgba(74, 201, 214, 0.12)', border: `${swim26Boundary.border.thin}px solid rgba(74, 201, 214, 0.30)`, display: 'grid', placeItems: 'center', color: swim26Color.accent.primary, fontSize: 28, boxShadow: swim26Boundary.elevation.level1 }}>→</div>
                      <div style={{ fontSize: 11, lineHeight: '14px', color: swim26Color.text.secondary, letterSpacing: '0.06em', textAlign: 'center' }}>CONVERT</div>
                    </div>

                    <div style={{ ...panelStyle, background: 'rgba(214, 180, 90, 0.10)', border: `${swim26Boundary.border.thin}px solid rgba(214, 180, 90, 0.26)`, boxShadow: 'none', padding: swim26Space.md, display: 'grid', gap: swim26Space.sm, alignContent: 'start' }}>
                      <div style={{ fontSize: swim26Type.metadata.fontSize, color: swim26Color.featured.premium, letterSpacing: '0.06em' }}>RESULTING OUTPUT</div>
                      <div style={{ fontSize: 20, lineHeight: '24px', fontWeight: 800, color: swim26Color.featured.premium }}>{card.outputItem}</div>
                      <div style={{ fontSize: 13, lineHeight: '18px', color: swim26Color.text.secondary }}>{card.valueLabel}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: swim26Space.md, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: swim26Space.sm, flexWrap: 'wrap' }}>
                      {['Value locked', 'Athlete ratings verified', 'Trade path clear'].map((chip, index) => (
                        <span key={chip} style={{ height: swim26Size.statusChip.height, padding: `0 ${swim26Space.sm}px`, borderRadius: swim26Boundary.radius.pill, background: index === 0 ? 'rgba(214, 180, 90, 0.12)' : 'rgba(255,255,255,0.06)', color: index === 0 ? swim26Color.featured.premium : swim26Color.text.secondary, display: 'inline-flex', alignItems: 'center', fontSize: 11, fontWeight: 700 }}>{chip}</span>
                      ))}
                    </div>
                    <button
                      style={{
                        minWidth: swim26Size.buttons.cta.minWidth,
                        minHeight: swim26Size.buttons.cta.height,
                        padding: `0 ${swim26Space.lg}px`,
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
                      {card.action}
                    </button>
                  </div>
                </button>
              );
            })}
          </section>

          <aside style={{ minHeight: 0, overflowY: 'auto', display: 'grid', gap: swim26Space.md, alignContent: 'start' }}>
            <div style={{ ...panelStyle, padding: swim26Space.md, background: swim26Color.surface.primary }}>
              <div style={{ fontSize: swim26Type.metadata.fontSize, color: swim26Color.text.secondary, letterSpacing: '0.06em', marginBottom: 6 }}>SECONDARY OPTIONS</div>
              <div style={{ fontSize: swim26Type.sectionTitle.fontSize, lineHeight: '22px', fontWeight: 700 }}>Quick transfer routes</div>
            </div>

            {sideOptions.map((option) => {
              const locked = option.state === 'locked';
              const cooldown = option.state === 'cooldown';
              return (
                <div
                  key={option.id}
                  style={{
                    ...panelStyle,
                    padding: swim26Space.md,
                    background: locked ? 'rgba(255,255,255,0.02)' : swim26Color.surface.secondary,
                    opacity: locked ? 0.72 : 1,
                    display: 'grid',
                    gap: swim26Space.sm,
                    minHeight: 152,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: swim26Space.sm, alignItems: 'start' }}>
                    <div style={{ fontSize: swim26Type.cardTitle.fontSize, lineHeight: '20px', fontWeight: 700 }}>{option.title}</div>
                    <span style={{ height: swim26Size.badge.height, padding: `0 ${swim26Space.sm}px`, borderRadius: swim26Boundary.radius.pill, background: `${option.accent}20`, color: option.accent, display: 'inline-flex', alignItems: 'center', fontSize: 10, fontWeight: 800 }}>
                      {locked ? 'LOCKED' : cooldown ? 'COOLDOWN' : 'ACTIVE'}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, lineHeight: '18px', color: swim26Color.text.secondary }}>{option.details}</div>
                  <div style={{ display: 'grid', gap: 6 }}>
                    <div style={{ fontSize: swim26Type.helper.fontSize, color: swim26Color.text.secondary }}>{option.limit}</div>
                    <div style={{ fontSize: swim26Type.helper.fontSize, color: locked ? swim26Color.feedback.warning : swim26Color.text.secondary }}>{option.refresh}</div>
                  </div>
                  <button
                    style={{
                      marginTop: 'auto',
                      minHeight: swim26Size.buttons.standard.height,
                      borderRadius: swim26Boundary.radius.md,
                      border: `${swim26Boundary.border.thin}px solid ${locked ? 'rgba(255,255,255,0.12)' : option.accent}66`,
                      background: locked ? 'rgba(255,255,255,0.03)' : `${option.accent}18`,
                      color: locked ? swim26Color.text.disabled : option.accent,
                      fontSize: swim26Type.buttonLabel.fontSize,
                      fontWeight: swim26Type.buttonLabel.fontWeight,
                      letterSpacing: '0.02em',
                    }}
                  >
                    {locked ? 'Unavailable' : cooldown ? 'Wait Reset' : 'Inspect'}
                  </button>
                </div>
              );
            })}
          </aside>
        </div>

        <nav
          style={{
            ...panelStyle,
            borderRadius: swim26Boundary.radius.lg,
            background: swim26Color.surface.primary,
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: swim26Space.xs,
            padding: swim26Space.xs,
          }}
        >
          {[
            { id: 'ITEM_TRANSFER' as TransferMode, label: 'Item transfer' },
            { id: 'PLAYER_TRANSFER' as TransferMode, label: 'Player transfer' },
          ].map((tab) => {
            const active = mode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setMode(tab.id);
                  setActiveCardId(tab.id === 'ITEM_TRANSFER' ? exchangeCards[0].id : `${exchangeCards[0].id}-player`);
                }}
                style={{
                  position: 'relative',
                  borderRadius: swim26Boundary.radius.md,
                  border: active ? swim26StateRules.active.border : '1px solid transparent',
                  background: active ? 'rgba(74, 201, 214, 0.10)' : 'transparent',
                  color: active ? swim26Color.text.primary : swim26Color.text.secondary,
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: swim26Type.buttonLabel.fontSize,
                  fontWeight: swim26Type.buttonLabel.fontWeight,
                  letterSpacing: '0.03em',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '24%',
                    right: '24%',
                    height: 3,
                    borderRadius: 999,
                    background: active ? swim26Color.accent.primary : 'transparent',
                  }}
                />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
