import React from 'react';
import {
  swim26Boundary,
  swim26Color,
  swim26Overlay,
  swim26Size,
  swim26Space,
  swim26StateRules,
  swim26Type,
} from '../../theme/swim26DesignSystem';

export type OverlayKind = 'reward' | 'streak_pack' | 'limited_offer' | 'unlock_prompt' | 'monetization';
export type OverlayPlacement = 'centered' | 'anchored-bottom';
export type RewardState = 'focused' | 'available' | 'locked' | 'claimed';
export type CTAState = 'free' | 'buy' | 'locked' | 'claimed' | 'next_unlock';

export interface RewardTileData {
  id: string;
  art: string;
  title: string;
  rarity: 'common' | 'rare' | 'epic' | 'premium';
  amount: string;
  state: RewardState;
  infoLabel?: string;
}

export interface ProgressStepData {
  id: string;
  stepLabel: string;
  reward: RewardTileData;
  state: RewardState;
  connectorState?: 'complete' | 'available' | 'locked';
}

export interface RewardOfferOverlayProps {
  open: boolean;
  kind: OverlayKind;
  placement?: OverlayPlacement;
  title: string;
  subtitle?: string;
  timerLabel?: string;
  closeLabel?: string;
  onClose: () => void;
  progressSteps?: ProgressStepData[];
  rewards?: RewardTileData[];
  primaryCtaLabel: string;
  primaryCtaState: CTAState;
  secondaryCtaLabel?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  footnote?: string;
}

const rarityStyle = {
  common: {
    border: 'rgba(255,255,255,0.12)',
    wash: 'rgba(255,255,255,0.04)',
    accent: swim26Color.text.secondary,
  },
  rare: {
    border: 'rgba(74, 201, 214, 0.24)',
    wash: 'rgba(74, 201, 214, 0.10)',
    accent: swim26Color.accent.primary,
  },
  epic: {
    border: 'rgba(54, 198, 144, 0.24)',
    wash: 'rgba(54, 198, 144, 0.10)',
    accent: swim26Color.feedback.success,
  },
  premium: {
    border: 'rgba(214, 180, 90, 0.26)',
    wash: 'rgba(214, 180, 90, 0.12)',
    accent: swim26Color.featured.premium,
  },
} as const;

function getCtaStyle(state: CTAState): React.CSSProperties {
  switch (state) {
    case 'free':
      return {
        background: swim26Color.feedback.success,
        color: '#062218',
        border: `1px solid ${swim26Color.feedback.success}`,
      };
    case 'buy':
      return {
        background: swim26Color.accent.primary,
        color: '#06202A',
        border: `1px solid ${swim26Color.accent.primary}`,
      };
    case 'locked':
      return {
        background: 'rgba(255,255,255,0.06)',
        color: swim26Color.text.secondary,
        border: `1px solid rgba(255,255,255,0.14)`,
      };
    case 'claimed':
      return {
        background: 'rgba(214, 180, 90, 0.12)',
        color: swim26Color.featured.premium,
        border: `1px solid rgba(214, 180, 90, 0.28)`,
      };
    case 'next_unlock':
    default:
      return {
        background: 'rgba(74, 201, 214, 0.10)',
        color: swim26Color.accent.primary,
        border: `1px solid rgba(74, 201, 214, 0.28)`,
      };
  }
}

function getRewardStateStyle(state: RewardState): React.CSSProperties {
  switch (state) {
    case 'focused':
      return {
        border: swim26StateRules.active.border,
        boxShadow: swim26Boundary.elevation.level2,
        opacity: 1,
      };
    case 'available':
      return {
        border: `1px solid ${swim26Color.divider}`,
        boxShadow: swim26Boundary.elevation.level1,
        opacity: 1,
      };
    case 'locked':
      return {
        border: `1px solid rgba(255,255,255,0.10)`,
        boxShadow: 'none',
        opacity: 0.7,
      };
    case 'claimed':
    default:
      return {
        border: `1px solid rgba(214, 180, 90, 0.20)`,
        boxShadow: 'none',
        opacity: 0.88,
      };
  }
}

const closeButtonStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: swim26Boundary.radius.sm,
  border: `${swim26Boundary.border.thin}px solid ${swim26Color.divider}`,
  background: 'rgba(255,255,255,0.04)',
  color: swim26Color.text.secondary,
  display: 'grid',
  placeItems: 'center',
};

export const RewardOfferOverlay: React.FC<RewardOfferOverlayProps> = ({
  open,
  kind,
  placement = 'centered',
  title,
  subtitle,
  timerLabel,
  closeLabel = 'Close',
  onClose,
  progressSteps = [],
  rewards = [],
  primaryCtaLabel,
  primaryCtaState,
  secondaryCtaLabel,
  onPrimaryAction,
  onSecondaryAction,
  footnote,
}) => {
  if (!open) return null;

  const isAnchored = placement === 'anchored-bottom';
  const hasProgress = progressSteps.length > 0;
  const visibleRewards = hasProgress ? progressSteps.map((step) => step.reward) : rewards;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        background: swim26Overlay.dim.background,
        backdropFilter: swim26Overlay.dim.blur,
        display: 'grid',
        alignItems: isAnchored ? 'end' : 'center',
        justifyItems: 'center',
        padding: `${swim26Layout.safe.top}px ${swim26Layout.safe.right}px ${swim26Layout.safe.bottom}px ${swim26Layout.safe.left}px`,
      }}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: isAnchored ? swim26Overlay.anchoredFrame.maxWidth : swim26Overlay.frame.maxWidth,
          minWidth: isAnchored ? swim26Overlay.anchoredFrame.minWidth : swim26Overlay.frame.minWidth,
          minHeight: isAnchored ? swim26Overlay.anchoredFrame.minHeight : swim26Overlay.frame.minHeight,
          borderRadius: swim26Overlay.frame.radius,
          border: `${swim26Boundary.border.strong}px solid rgba(255,255,255,0.12)`,
          background: `linear-gradient(180deg, rgba(20, 38, 54, 0.98) 0%, rgba(13, 27, 39, 0.96) 100%)`,
          boxShadow: swim26Boundary.elevation.level3,
          display: 'grid',
          gridTemplateRows: 'auto minmax(0, 1fr) auto',
          overflow: 'hidden',
        }}
      >
        <OverlayHeader
          kind={kind}
          title={title}
          subtitle={subtitle}
          timerLabel={timerLabel}
          closeLabel={closeLabel}
          onClose={onClose}
        />

        <div
          style={{
            minHeight: 0,
            overflowY: 'auto',
            padding: `0 ${swim26Overlay.frame.padding}px ${swim26Overlay.frame.padding}px`,
            display: 'grid',
            gap: swim26Space.lg,
            alignContent: 'start',
          }}
        >
          {hasProgress ? <RewardProgressChain steps={progressSteps} /> : null}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: visibleRewards.length > 3 ? 'repeat(4, minmax(0, 1fr))' : `repeat(${Math.max(visibleRewards.length, 1)}, minmax(0, 1fr))`,
              gap: swim26Space.md,
            }}
          >
            {visibleRewards.map((reward) => (
              <RewardTile key={reward.id} reward={reward} />
            ))}
          </div>
        </div>

        <OverlayFooter
          primaryLabel={primaryCtaLabel}
          primaryState={primaryCtaState}
          secondaryLabel={secondaryCtaLabel}
          onPrimaryAction={onPrimaryAction}
          onSecondaryAction={onSecondaryAction}
          footnote={footnote}
        />
      </div>
    </div>
  );
};

const OverlayHeader: React.FC<{
  kind: OverlayKind;
  title: string;
  subtitle?: string;
  timerLabel?: string;
  closeLabel: string;
  onClose: () => void;
}> = ({ kind, title, subtitle, timerLabel, closeLabel, onClose }) => {
  const accent = kind === 'monetization' || kind === 'limited_offer'
    ? swim26Color.featured.premium
    : swim26Color.accent.primary;

  return (
    <div
      style={{
        minHeight: swim26Overlay.header.minHeight,
        padding: `${swim26Overlay.frame.padding}px ${swim26Overlay.frame.padding}px ${swim26Space.md}px`,
        borderBottom: `${swim26Boundary.border.thin}px solid rgba(255,255,255,0.08)`,
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: swim26Space.md,
        alignItems: 'start',
      }}
    >
      <div style={{ display: 'grid', gap: 6 }}>
        <div style={{ fontSize: swim26Type.displayHeading.fontSize, lineHeight: `${swim26Type.displayHeading.lineHeight}px`, fontWeight: swim26Type.displayHeading.fontWeight, letterSpacing: swim26Type.displayHeading.letterSpacing }}>
          {title}
        </div>
        {subtitle ? (
          <div style={{ maxWidth: 560, fontSize: swim26Type.cardTitle.fontSize, lineHeight: '22px', color: swim26Color.text.secondary }}>
            {subtitle}
          </div>
        ) : null}
      </div>

      <div style={{ display: 'grid', gap: swim26Space.sm, justifyItems: 'end' }}>
        {timerLabel ? (
          <div
            style={{
              height: swim26Overlay.header.timerHeight,
              padding: `0 ${swim26Space.sm}px`,
              borderRadius: swim26Boundary.radius.pill,
              border: `${swim26Boundary.border.thin}px solid ${kind === 'limited_offer' ? 'rgba(240, 106, 95, 0.28)' : `${accent}44`}`,
              background: kind === 'limited_offer' ? 'rgba(240, 106, 95, 0.12)' : `${accent}16`,
              color: kind === 'limited_offer' ? swim26Color.feedback.alert : accent,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: swim26Type.metadata.fontSize,
              fontWeight: 700,
            }}
          >
            {timerLabel}
          </div>
        ) : null}
        <button aria-label={closeLabel} onClick={onClose} style={closeButtonStyle}>✕</button>
      </div>
    </div>
  );
};

const RewardProgressChain: React.FC<{ steps: ProgressStepData[] }> = ({ steps }) => {
  return (
    <div
      style={{
        ...modalSubPanelStyle,
        padding: swim26Space.md,
        display: 'grid',
        gap: swim26Space.sm,
      }}
    >
      <div style={{ fontSize: swim26Type.metadata.fontSize, color: swim26Color.text.secondary, letterSpacing: '0.06em' }}>
        PROGRESSION PATH
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`,
          gap: swim26Space.sm,
          alignItems: 'center',
        }}
      >
        {steps.map((step, index) => {
          const stateStyle = getRewardStateStyle(step.state);
          const connectorAccent = step.connectorState === 'complete'
            ? swim26Color.feedback.success
            : step.connectorState === 'available'
              ? swim26Color.accent.primary
              : 'rgba(255,255,255,0.12)';

          return (
            <div key={step.id} style={{ display: 'grid', gridTemplateRows: 'auto auto', gap: swim26Space.sm }}>
              <div
                style={{
                  ...stateStyle,
                  minHeight: swim26Overlay.progression.rowMinHeight,
                  borderRadius: swim26Boundary.radius.md,
                  background: step.state === 'locked' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.05)',
                  display: 'grid',
                  placeItems: 'center',
                  position: 'relative',
                  padding: swim26Space.sm,
                }}
              >
                <div
                  style={{
                    width: swim26Overlay.progression.nodeSize,
                    height: swim26Overlay.progression.nodeSize,
                    borderRadius: 20,
                    border: `${swim26Boundary.border.thin}px solid ${connectorAccent}`,
                    background: `${connectorAccent}18`,
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 28,
                  }}
                >
                  {step.reward.art}
                </div>
                {index < steps.length - 1 ? (
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: 'calc(100% - 4px)',
                      width: `calc(${swim26Space.md}px + 100%)`,
                      height: swim26Overlay.progression.connectorHeight,
                      transform: 'translateY(-50%)',
                      background: connectorAccent,
                      opacity: 0.8,
                      zIndex: 0,
                    }}
                  />
                ) : null}
              </div>
              <div style={{ textAlign: 'center', fontSize: swim26Type.helper.fontSize, color: swim26Color.text.secondary }}>
                {step.stepLabel}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const modalSubPanelStyle: React.CSSProperties = {
  borderRadius: swim26Boundary.radius.md,
  border: `${swim26Boundary.border.thin}px solid rgba(255,255,255,0.08)`,
  background: 'rgba(255,255,255,0.03)',
};

const RewardTile: React.FC<{ reward: RewardTileData }> = ({ reward }) => {
  const rarity = rarityStyle[reward.rarity];
  const stateStyle = getRewardStateStyle(reward.state);
  const stateLabel = reward.state === 'claimed'
    ? 'CLAIMED'
    : reward.state === 'locked'
      ? 'LOCKED'
      : reward.state === 'focused'
        ? 'READY'
        : 'AVAILABLE';

  return (
    <div
      style={{
        ...stateStyle,
        width: '100%',
        minHeight: swim26Overlay.rewardCard.height,
        borderRadius: swim26Boundary.radius.md,
        background: reward.state === 'claimed' ? 'rgba(214, 180, 90, 0.08)' : 'rgba(255,255,255,0.04)',
        display: 'grid',
        gridTemplateRows: 'auto auto auto',
        gap: swim26Space.sm,
        padding: swim26Space.md,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: swim26Space.sm }}>
        <span
          style={{
            height: swim26Size.badge.height,
            padding: `0 ${swim26Space.sm}px`,
            borderRadius: swim26Boundary.radius.pill,
            background: rarity.wash,
            color: rarity.accent,
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: 10,
            fontWeight: 800,
          }}
        >
          {stateLabel}
        </span>
        {reward.infoLabel ? (
          <span style={{ fontSize: 12, lineHeight: '14px', color: swim26Color.text.secondary }}>ⓘ {reward.infoLabel}</span>
        ) : null}
      </div>

      <div
        style={{
          ...modalSubPanelStyle,
          minHeight: swim26Overlay.rewardCard.artHeight,
          borderColor: rarity.border,
          background: rarity.wash,
          display: 'grid',
          placeItems: 'center',
          fontSize: 36,
        }}
      >
        {reward.art}
      </div>

      <div style={{ display: 'grid', gap: 2 }}>
        <div style={{ fontSize: swim26Type.cardTitle.fontSize, lineHeight: '20px', fontWeight: 700 }}>{reward.title}</div>
        <div style={{ fontSize: 18, lineHeight: '20px', fontWeight: 800, color: rarity.accent }}>{reward.amount}</div>
      </div>
    </div>
  );
};

const OverlayFooter: React.FC<{
  primaryLabel: string;
  primaryState: CTAState;
  secondaryLabel?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  footnote?: string;
}> = ({ primaryLabel, primaryState, secondaryLabel, onPrimaryAction, onSecondaryAction, footnote }) => {
  const primaryStyle = getCtaStyle(primaryState);

  return (
    <div
      style={{
        minHeight: swim26Overlay.frame.footerHeight,
        borderTop: `${swim26Boundary.border.thin}px solid rgba(255,255,255,0.08)`,
        padding: `${swim26Space.md}px ${swim26Overlay.frame.padding}px ${swim26Overlay.frame.padding}px`,
        display: 'grid',
        gridTemplateColumns: footnote ? '1fr auto' : 'auto',
        gap: swim26Space.md,
        alignItems: 'center',
      }}
    >
      {footnote ? (
        <div style={{ fontSize: swim26Type.helper.fontSize, lineHeight: '16px', color: swim26Color.text.secondary }}>
          {footnote}
        </div>
      ) : null}

      <div style={{ display: 'flex', gap: swim26Space.sm, justifySelf: 'end' }}>
        {secondaryLabel ? (
          <button
            onClick={onSecondaryAction}
            style={{
              minWidth: 132,
              height: swim26Overlay.cta.secondaryHeight,
              borderRadius: swim26Boundary.radius.md,
              border: `${swim26Boundary.border.thin}px solid ${swim26Color.divider}`,
              background: 'rgba(255,255,255,0.04)',
              color: swim26Color.text.primary,
              fontSize: swim26Type.buttonLabel.fontSize,
              fontWeight: swim26Type.buttonLabel.fontWeight,
            }}
          >
            {secondaryLabel}
          </button>
        ) : null}
        <button
          onClick={onPrimaryAction}
          style={{
            minWidth: 188,
            height: swim26Overlay.cta.primaryHeight,
            borderRadius: swim26Boundary.radius.md,
            fontSize: swim26Type.buttonLabel.fontSize,
            fontWeight: swim26Type.buttonLabel.fontWeight,
            letterSpacing: '0.04em',
            boxShadow: swim26Boundary.elevation.level2,
            ...primaryStyle,
          }}
        >
          {primaryLabel}
        </button>
      </div>
    </div>
  );
};

export const rewardOfferOverlayExamples = {
  streakPack: {
    kind: 'streak_pack' as OverlayKind,
    placement: 'centered' as OverlayPlacement,
    title: '7-Day Streak Pack',
    subtitle: 'Claim each day in sequence to unlock the premium finale reward.',
    timerLabel: 'Ends in 11H 20M',
    primaryCtaLabel: 'Claim Free',
    primaryCtaState: 'free' as CTAState,
    secondaryCtaLabel: 'Maybe Later',
    footnote: 'Premium finale unlocks only after all free steps are claimed in order.',
  },
  monetization: {
    kind: 'monetization' as OverlayKind,
    placement: 'anchored-bottom' as OverlayPlacement,
    title: 'Premium Upgrade Offer',
    subtitle: 'Upgrade once to unlock the paid reward track and premium currency bonus.',
    timerLabel: 'Limited 23H 50M',
    primaryCtaLabel: 'Buy Upgrade',
    primaryCtaState: 'buy' as CTAState,
    secondaryCtaLabel: 'View Rewards',
    footnote: 'All paid rewards remain visible. Claimed free rewards carry over immediately after purchase.',
  },
} as const;
