/**
 * SplashScreen — FC26 Broadcast Standard title screen
 *
 * Edge-to-edge fullscreen boot screen. Bold, flat, premium sports branding.
 * NO neon glows. Volt yellow accent on "26". Clean Bebas Neue + Barlow Condensed.
 */

import React from 'react';
import { motion } from 'motion/react';
import appSkinBackground from '../../designs/app_skin/venue-skin.jpg';

interface SplashScreenProps {
  onPlay: () => void;
}

// ─── Decorative pool lane lines ───────────────────────────────────────────────
const LaneLines: React.FC = () => (
  <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04 }}>
    {[...Array(8)].map((_, i) => (
      <div
        key={i}
        style={{
          position:   'absolute',
          top:        0,
          bottom:     0,
          left:       `${(i / 8) * 100}%`,
          width:      '1px',
          background: 'rgba(255,255,255,0.9)',
        }}
      />
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
export const SplashScreen: React.FC<SplashScreenProps> = ({ onPlay }) => {
  return (
    <div
      style={{
        position:         'absolute',
        inset:            0,
        background:       '#07111E',
        display:          'flex',
        flexDirection:    'column',
        alignItems:       'center',
        justifyContent:   'center',
        overflow:         'hidden',
        userSelect:       'none',
        WebkitUserSelect: 'none',
      }}
    >
      {/* Venue photo — very low opacity texture only */}
      <img
        src={appSkinBackground}
        alt=""
        aria-hidden
        style={{
          position:      'absolute',
          inset:         0,
          width:         '100%',
          height:        '100%',
          objectFit:     'cover',
          opacity:       0.06,
          mixBlendMode:  'luminosity',
          pointerEvents: 'none',
        }}
      />

      {/* Dark overlay */}
      <div
        aria-hidden
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', pointerEvents: 'none' }}
      />

      {/* Pool lane lines */}
      <LaneLines />

      {/* Bottom-edge volt accent bar — FC26 broadcast lower-third style */}
      <div
        aria-hidden
        style={{
          position:   'absolute',
          bottom:     0,
          left:       0,
          right:      0,
          height:     '3px',
          background: '#CCFF00',
        }}
      />

      {/* Main content */}
      <div
        style={{
          position:      'relative',
          zIndex:        10,
          textAlign:     'center',
          display:       'flex',
          flexDirection: 'column',
          alignItems:    'center',
          gap:           '14px',
          padding:       '0 24px',
        }}
      >
        {/* Season pill */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{
            padding:       '3px 12px',
            background:    'rgba(200,255,0,0.10)',
            border:        '1px solid rgba(200,255,0,0.28)',
            fontFamily:    "'Barlow Condensed', sans-serif",
            fontWeight:    700,
            fontSize:      '10px',
            letterSpacing: '0.28em',
            color:         '#CCFF00',
            textTransform: 'uppercase' as const,
          }}
        >
          Season 4 · World Tour
        </motion.div>

        {/* Game title — Bebas Neue, volt accent on "26" */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily:    "'Bebas Neue', 'Barlow Condensed', sans-serif",
            fontWeight:    900,
            fontSize:      'clamp(72px, 16vw, 130px)',
            lineHeight:    0.92,
            letterSpacing: '0.02em',
            color:         '#F3F7FC',
            margin:        0,
          }}
        >
          SWIM<span style={{ color: '#CCFF00' }}>26</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.32 }}
          style={{
            fontFamily:    "'Barlow Condensed', sans-serif",
            fontWeight:    700,
            fontSize:      '12px',
            letterSpacing: '0.26em',
            textTransform: 'uppercase' as const,
            color:         'rgba(255,255,255,0.38)',
            margin:        0,
          }}
        >
          Compete · Dominate · Conquer
        </motion.p>

        {/* Volt divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.4, delay: 0.38 }}
          style={{ width: '40px', height: '2px', background: '#CCFF00' }}
        />

        {/* PLAY — solid volt fill, carbon text, italic Barlow Condensed */}
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.48, ease: [0.22, 1, 0.36, 1] }}
          whileTap={{ scale: 0.95 }}
          onClick={onPlay}
          style={{
            marginTop:      '4px',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            minWidth:       '180px',
            minHeight:      '52px',
            padding:        '0 40px',
            background:     '#CCFF00',
            border:         'none',
            cursor:         'pointer',
            fontFamily:     "'Barlow Condensed', sans-serif",
            fontWeight:     900,
            fontStyle:      'italic',
            fontSize:       '22px',
            letterSpacing:  '0.12em',
            textTransform:  'uppercase' as const,
            color:          '#0A0A0A',
            touchAction:    'manipulation',
          }}
        >
          PLAY
        </motion.button>
      </div>

      {/* Version tag */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.9 }}
        style={{
          position:      'absolute',
          bottom:        '14px',
          fontFamily:    "'Barlow Condensed', sans-serif",
          fontWeight:    600,
          fontSize:      '9px',
          letterSpacing: '0.22em',
          color:         'rgba(255,255,255,0.18)',
          textTransform: 'uppercase' as const,
          zIndex:        10,
        }}
      >
        v1.0.0 · © Swim26 Studio
      </motion.div>
    </div>
  );
};

export default SplashScreen;
