/**
 * SplashScreen — game home / title screen
 *
 * First thing the player sees on launch. Shows the game title and a single
 * prominent PLAY button that enters the lobby (AppShell).
 *
 * Visual language matches the lobby: deep navy base, cyan caustic blobs,
 * pool lane-line overlay, Rajdhani typography.
 */

import React from 'react';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import appSkinBackground from '../../designs/app_skin/venue-skin.jpg';

interface SplashScreenProps {
  onPlay: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Decorative lane lines (same pattern as LobbyScreen)
// ─────────────────────────────────────────────────────────────────────────────

const LaneLines: React.FC = () => (
  <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.05 }}>
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        style={{
          position:        'absolute',
          top:             0,
          bottom:          0,
          left:            `${(i / 6) * 100}%`,
          width:           '1px',
          background:      'rgba(56,214,255,0.8)',
        }}
      />
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Animated caustic light blobs
// ─────────────────────────────────────────────────────────────────────────────

const CausticBlobs: React.FC = () => (
  <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
    {/* primary cyan blob */}
    <div style={{
      position:        'absolute',
      top:             '20%',
      left:            '30%',
      width:           '500px',
      height:          '500px',
      borderRadius:    '50%',
      background:      'radial-gradient(circle, rgba(56,214,255,0.10) 0%, transparent 70%)',
      transform:       'translate(-50%,-50%)',
      animation:       'causticDrift1 8s ease-in-out infinite',
    }} />
    {/* gold accent blob */}
    <div style={{
      position:        'absolute',
      bottom:          '15%',
      right:           '20%',
      width:           '360px',
      height:          '360px',
      borderRadius:    '50%',
      background:      'radial-gradient(circle, rgba(255,215,9,0.07) 0%, transparent 70%)',
      animation:       'causticDrift2 11s ease-in-out infinite',
    }} />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SplashScreen
// ─────────────────────────────────────────────────────────────────────────────

export const SplashScreen: React.FC<SplashScreenProps> = ({ onPlay }) => {
  return (
    <div
      style={{
        position:   'absolute',
        inset:      0,
        background: 'radial-gradient(ellipse 120% 80% at 50% 40%, #062b42 0%, var(--color-carbon) 60%, #020b14 100%)',
        display:    'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow:   'hidden',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {/* App skin (venue photo) */}
      <img
        src={appSkinBackground}
        alt=""
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.08,
          mixBlendMode: 'overlay',
          filter: 'saturate(0.9) contrast(1.05)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.45)',
          pointerEvents: 'none',
        }}
      />
      {/* Background decoration */}
      <LaneLines />
      <CausticBlobs />

      {/* Edge vignette */}
      <div
        aria-hidden
        style={{
          position:   'absolute',
          inset:      0,
          background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(2,11,20,0.70) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>

        {/* Season badge */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            padding:       '4px 14px',
            borderRadius:  '999px',
            background:    'rgba(56,214,255,0.12)',
            border:        '1px solid rgba(56,214,255,0.30)',
            fontFamily:    "'Rajdhani', 'Segoe UI', system-ui, sans-serif",
            fontWeight:    700,
            fontSize:      '10px',
            letterSpacing: '0.25em',
            color:         'rgba(56,214,255,0.85)',
            textTransform: 'uppercase',
          }}
        >
          Season 4 · World Tour
        </motion.div>

        {/* Game title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily:    "'Rajdhani', 'Segoe UI', system-ui, sans-serif",
            fontWeight:    900,
            fontSize:      'clamp(64px, 14vw, 120px)',
            lineHeight:    1,
            letterSpacing: '-0.02em',
            fontStyle:     'italic',
            color:         '#ffffff',
            textShadow:    '0 0 60px rgba(56,214,255,0.25)',
            margin:        0,
          }}
        >
          SWIM<span style={{ color: 'rgba(56,214,255,0.9)' }}>26</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.38 }}
          style={{
            fontFamily:    "'Rajdhani', 'Segoe UI', system-ui, sans-serif",
            fontWeight:    600,
            fontSize:      '13px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color:         'rgba(169,211,231,0.65)',
            margin:        0,
          }}
        >
          Compete. Dominate. Conquer.
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.45, delay: 0.45 }}
          style={{
            width:      '64px',
            height:     '2px',
            background: 'linear-gradient(90deg, transparent, rgba(56,214,255,0.7), transparent)',
            borderRadius: '1px',
          }}
        />

        {/* PLAY button */}
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPlay}
          style={{
            marginTop:     '8px',
            display:       'flex',
            alignItems:    'center',
            gap:           '10px',
            padding:       '16px 40px',
            borderRadius:  '14px',
            background:    'linear-gradient(135deg, rgba(56,214,255,0.20) 0%, rgba(56,214,255,0.10) 100%)',
            border:        '1.5px solid rgba(56,214,255,0.55)',
            cursor:        'pointer',
            fontFamily:    "'Rajdhani', 'Segoe UI', system-ui, sans-serif",
            fontWeight:    900,
            fontSize:      '20px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color:         '#ffffff',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow:     '0 0 32px rgba(56,214,255,0.18), inset 0 1px 0 rgba(255,255,255,0.08)',
            minWidth:      '200px',
            justifyContent: 'center',
          }}
        >
          <Play size={20} fill="currentColor" style={{ flexShrink: 0 }} />
          Play
        </motion.button>
      </div>

      {/* Bottom version tag */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        style={{
          position:      'absolute',
          bottom:        '20px',
          fontFamily:    "'Rajdhani', 'Segoe UI', system-ui, sans-serif",
          fontWeight:    600,
          fontSize:      '10px',
          letterSpacing: '0.2em',
          color:         'rgba(169,211,231,0.30)',
          textTransform: 'uppercase',
          zIndex:        10,
        }}
      >
        v1.0.0 · © Swim26 Studio
      </motion.div>
    </div>
  );
};

export default SplashScreen;
