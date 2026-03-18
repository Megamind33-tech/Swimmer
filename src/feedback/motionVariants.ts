/**
 * motionVariants — reusable Framer Motion variant objects
 *
 * Design rules (anti-website animation):
 *   ✗ No slow marketing fades (duration > 350ms for entry)
 *   ✗ No floaty ease-out landing-page transitions
 *   ✗ No scroll-linked decorative motion
 *   ✓ Spring physics — stiffness 400-620, damping 24-36
 *   ✓ Fast exits — always < 180ms
 *   ✓ Purposeful: each animation communicates state
 *
 * Usage:
 *   <motion.div variants={panelSlideUp} initial="initial" animate="animate" exit="exit" />
 *   <motion.div animate={urgencyPulseAnimate} /> // for continuous loops
 */

import type { Variants } from 'motion/react';

// ─────────────────────────────────────────────────────────────────────────────
// Panel / overlay entrances
// ─────────────────────────────────────────────────────────────────────────────

/** Quick slide from below — bottom sheets, overlays, tab content */
export const panelSlideUp: Variants = {
  initial: { y: 28,  opacity: 0 },
  animate: { y: 0,   opacity: 1, transition: { type: 'spring', stiffness: 500, damping: 36 } },
  exit:    { y: -16, opacity: 0, transition: { duration: 0.14, ease: 'easeIn' } },
};

/** Quick slide from right — right panels, detail views */
export const panelSlideRight: Variants = {
  initial: { x: 40,  opacity: 0 },
  animate: { x: 0,   opacity: 1, transition: { type: 'spring', stiffness: 500, damping: 36 } },
  exit:    { x: -24, opacity: 0, transition: { duration: 0.13, ease: 'easeIn' } },
};

/** Fade + slight scale — full-screen overlays */
export const overlayFade: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.20 } },
  exit:    { opacity: 0, transition: { duration: 0.16 } },
};

// ─────────────────────────────────────────────────────────────────────────────
// Prompt / alert snaps
// ─────────────────────────────────────────────────────────────────────────────

/** Context prompt snap — game event banners (PERFECT START, etc.) */
export const promptSnap: Variants = {
  initial: { scale: 0.70, y: -10, opacity: 0 },
  animate: { scale: 1,    y: 0,   opacity: 1, transition: { type: 'spring', stiffness: 640, damping: 26 } },
  exit:    { scale: 0.86, y: -8,  opacity: 0, transition: { duration: 0.12, ease: 'easeIn' } },
};

// ─────────────────────────────────────────────────────────────────────────────
// Race result reveals
// ─────────────────────────────────────────────────────────────────────────────

/** Placement crash-in — big 1ST / 2ND number slamming into view */
export const resultCrashIn: Variants = {
  initial: { scale: 2.4,  opacity: 0 },
  animate: { scale: 1,    opacity: 1, transition: { type: 'spring', stiffness: 380, damping: 22 } },
  exit:    { scale: 0.88, opacity: 0, transition: { duration: 0.14 } },
};

/** PB / record badge flash reveal — golden, slight rotate */
export const pbFlashReveal: Variants = {
  initial: { scale: 0.4,  opacity: 0, rotate: -14 },
  animate: { scale: 1,    opacity: 1, rotate: 0,   transition: { type: 'spring', stiffness: 540, damping: 20, delay: 0.20 } },
  exit:    { scale: 0.85, opacity: 0, transition: { duration: 0.12 } },
};

/** Results card entrance — whole panel springs into view */
export const finishBurst: Variants = {
  initial: { scale: 0.90, opacity: 0 },
  animate: { scale: 1,    opacity: 1, transition: { type: 'spring', stiffness: 320, damping: 28, delay: 0.05 } },
  exit:    { scale: 0.96, opacity: 0, transition: { duration: 0.18 } },
};

/** Stagger container — wraps items that should stagger in */
export const staggerContainer: Variants = {
  animate: { transition: { staggerChildren: 0.055, delayChildren: 0.14 } },
};

/** Stagger child item — used inside staggerContainer */
export const staggerChild: Variants = {
  initial: { y: 14, opacity: 0 },
  animate: { y: 0,  opacity: 1, transition: { type: 'spring', stiffness: 500, damping: 36 } },
};

// ─────────────────────────────────────────────────────────────────────────────
// Continuous / looping animations (used as `animate` prop directly)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Timer urgency pulse — subtle scale throb when race is nearly over.
 * Usage:  <motion.div animate={urgent ? urgencyPulseAnimate : {}} />
 */
export const urgencyPulseAnimate = {
  scale: [1, 1.038, 1],
  transition: { duration: 0.68, ease: 'easeInOut' as const, repeat: Infinity },
};

/**
 * Low-stamina pulse — opacity throb on stamina bar when critical.
 * Usage:  <motion.div animate={critical ? staminaPulseAnimate : {}} />
 */
export const staminaPulseAnimate = {
  opacity: [1, 0.38, 1],
  transition: { duration: 0.52, ease: 'easeInOut' as const, repeat: Infinity },
};
