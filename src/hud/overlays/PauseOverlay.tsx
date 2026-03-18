/**
 * PauseOverlay — polished in-game pause menu
 *
 * Appears over the frozen race canvas. Blurs the background while
 * keeping it visible so the player sees where they paused.
 *
 * Actions:
 *   RESUME   — return to race immediately
 *   RESTART  — go back to pre-race setup (caller handles)
 *   SETTINGS — show inline SettingsPage within this overlay
 *   EXIT     — return to lobby (caller handles)
 *
 * Animation:
 *   Backdrop: overlayFade (200ms)
 *   Card: panelSlideUp spring (delay 40ms)
 *   Buttons: stagger in sequence (55ms each)
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RefreshCw, Settings, LogOut, X } from 'lucide-react';
import { panelSlideUp, overlayFade, staggerContainer, staggerChild } from '../../feedback/motionVariants';
import { HUD_COLOR, HUD_FONT } from '../hudTokens';
import { SettingsPage } from '../../pages/UtilityPages';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface PauseOverlayProps {
  onResume:  () => void;
  onRestart: () => void;
  onExit:    () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Pause button row item
// ─────────────────────────────────────────────────────────────────────────────

interface PauseBtnProps {
  icon:      React.ReactNode;
  label:     string;
  onClick:   () => void;
  variant?:  'primary' | 'ghost' | 'danger';
}

const PauseBtn: React.FC<PauseBtnProps> = ({ icon, label, onClick, variant = 'ghost' }) => {
  const bg = variant === 'primary'
    ? `linear-gradient(135deg, ${HUD_COLOR.aqua}, ${HUD_COLOR.cyanGlow})`
    : variant === 'danger'
      ? 'rgba(255,93,115,0.10)'
      : 'rgba(255,255,255,0.06)';
  const border = variant === 'primary'
    ? 'none'
    : variant === 'danger'
      ? '1px solid rgba(255,93,115,0.28)'
      : '1px solid rgba(255,255,255,0.12)';
  const textColor = variant === 'primary'
    ? '#041421'
    : variant === 'danger'
      ? HUD_COLOR.danger
      : HUD_COLOR.textPrimary;
  const iconColor = variant === 'primary' ? '#041421' : textColor;

  return (
    <motion.button
      variants={staggerChild}
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 700, damping: 32 }}
      style={{
        width:          '100%',
        height:         '48px',
        borderRadius:   '14px',
        display:        'flex',
        alignItems:     'center',
        gap:            '10px',
        padding:        '0 16px',
        cursor:         'pointer',
        background:     bg,
        border,
        boxShadow:      variant === 'primary' ? `0 0 18px ${HUD_COLOR.aquaGlow}` : 'none',
      }}
    >
      {React.cloneElement(icon as React.ReactElement<{ color?: string; size?: number }>, { color: iconColor, size: 16 })}
      <span
        style={{
          fontFamily:    HUD_FONT.impact,
          fontSize:      '17px',
          color:         textColor,
          letterSpacing: '0.08em',
        }}
      >
        {label}
      </span>
    </motion.button>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PauseOverlay
// ─────────────────────────────────────────────────────────────────────────────

export const PauseOverlay: React.FC<PauseOverlayProps> = ({ onResume, onRestart, onExit }) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="pause-backdrop"
        variants={overlayFade}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{
          position:       'fixed',
          inset:          0,
          zIndex:         150,
          background:     'rgba(4,20,33,0.80)',
          backdropFilter: 'blur(8px)',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
        }}
        onPointerDown={(e) => { if (e.target === e.currentTarget) onResume(); }}
      >
        {showSettings ? (
          /* ── Inline Settings Sheet ── */
          <motion.div
            key="pause-settings"
            variants={panelSlideUp}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
              width:    '100%',
              maxWidth: '480px',
              maxHeight: '88vh',
              overflow: 'hidden',
              display:  'flex',
              flexDirection: 'column',
            }}
          >
            {/* Close bar */}
            <div
              style={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'space-between',
                padding:        '8px 12px 0',
              }}
            >
              <span
                style={{
                  fontFamily:    HUD_FONT.label,
                  fontWeight:    700,
                  fontSize:      '10px',
                  color:         'rgba(169,211,231,0.45)',
                  letterSpacing: '0.20em',
                  textTransform: 'uppercase',
                }}
              >
                SETTINGS
              </span>
              <motion.button
                onClick={() => setShowSettings(false)}
                whileTap={{ scale: 0.88 }}
                style={{
                  width:          '32px',
                  height:         '32px',
                  borderRadius:   '10px',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  background:     'rgba(255,255,255,0.07)',
                  border:         '1px solid rgba(255,255,255,0.12)',
                  cursor:         'pointer',
                }}
              >
                <X size={14} color={HUD_COLOR.textSecondary} />
              </motion.button>
            </div>
            {/* SettingsPage fills remaining height */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <SettingsPage />
            </div>
          </motion.div>
        ) : (
          /* ── Pause Card ── */
          <motion.div
            key="pause-card"
            variants={panelSlideUp}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
              width:          '280px',
              background:     'rgba(4,20,33,0.88)',
              border:         '1px solid rgba(56,214,255,0.18)',
              borderRadius:   '20px',
              backdropFilter: 'blur(16px)',
              padding:        '20px',
              boxShadow:      '0 24px 60px rgba(0,0,0,0.55)',
            }}
          >
            {/* Header */}
            <div
              style={{
                display:        'flex',
                alignItems:     'center',
                gap:            '8px',
                marginBottom:   '16px',
              }}
            >
              <div
                style={{
                  display:       'flex',
                  gap:           '3px',
                  alignItems:    'center',
                }}
              >
                <div style={{ width: '4px', height: '18px', borderRadius: '2px', background: HUD_COLOR.aqua }} />
                <div style={{ width: '4px', height: '18px', borderRadius: '2px', background: HUD_COLOR.aqua }} />
              </div>
              <span
                style={{
                  fontFamily:    HUD_FONT.impact,
                  fontSize:      '24px',
                  color:         HUD_COLOR.textPrimary,
                  letterSpacing: '0.06em',
                }}
              >
                PAUSED
              </span>
            </div>

            {/* Buttons (staggered) */}
            <motion.div
              variants={staggerContainer}
              initial="animate"
              animate="animate"
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              <PauseBtn icon={<Play />}      label="RESUME"    onClick={onResume}                       variant="primary" />
              <PauseBtn icon={<RefreshCw />} label="RESTART"   onClick={onRestart}                      variant="ghost"   />
              <PauseBtn icon={<Settings />}  label="SETTINGS"  onClick={() => setShowSettings(true)}    variant="ghost"   />
              <PauseBtn icon={<LogOut />}    label="EXIT"      onClick={onExit}                         variant="danger"  />
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
