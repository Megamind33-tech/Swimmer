/**
 * audioEngine — singleton Web Audio API synth for game UI sounds
 *
 * All sounds are synthesized in-browser — no audio files needed.
 * Designed for snappy game feel: short attack, fast release, no > 600ms.
 *
 * Rules:
 *   - Fast attack ≤ 5ms on every sound
 *   - Musical intervals for confirm/back (not random beeps)
 *   - Countdown uses ascending pitch to build tension
 *   - Finish impact = percussive thud + rising shimmer sweep
 */

let _ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!_ctx) {
    try {
      _ctx = new AudioContext();
    } catch {
      return null;
    }
  }
  if (_ctx.state === 'suspended') _ctx.resume().catch(() => {});
  return _ctx;
}

/** Play a single oscillator tone — internal helper */
function tone(
  frequency: number,
  durationSec: number,
  type: OscillatorType = 'sine',
  gainPeak = 0.22,
  delayStartSec = 0,
): void {
  const c = getCtx();
  if (!c) return;

  const now = c.currentTime + delayStartSec;
  const g   = c.createGain();
  g.connect(c.destination);
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(gainPeak, now + 0.004); // 4ms attack
  g.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

  const osc = c.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, now);
  osc.connect(g);
  osc.start(now);
  osc.stop(now + durationSec + 0.01);
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/** Short click — generic UI tap (button press, menu navigation) */
export function playUiTap(): void {
  tone(440, 0.04, 'sine', 0.18);
}

/** Ascending two-note confirm — save, join, confirm action */
export function playUiConfirm(): void {
  tone(523, 0.07, 'sine', 0.22);           // C5
  tone(659, 0.10, 'sine', 0.22, 0.065);    // E5
}

/** Descending two-note back — cancel, dismiss, go back */
export function playUiBack(): void {
  tone(523, 0.07, 'sine', 0.18);           // C5
  tone(392, 0.08, 'sine', 0.18, 0.065);    // G4
}

/**
 * Countdown beep — call on each countdown tick.
 *   isFinalGo=false → clean 880Hz beep for 3, 2, 1
 *   isFinalGo=true  → punchy GO! two-note punch
 */
export function playCountdownBeep(isFinalGo = false): void {
  if (isFinalGo) {
    tone(784,  0.10, 'square', 0.10);            // G5 (short square punch)
    tone(1047, 0.18, 'sine',   0.24, 0.08);      // C6 (rising confirmation)
  } else {
    tone(880, 0.10, 'sine', 0.22);               // A5 — clean, sharp beep
  }
}

/**
 * Finish impact — percussive race-end sound.
 * Combines a noise thud with a rising shimmer sweep.
 */
export function playFinishImpact(): void {
  const c = getCtx();
  if (!c) return;
  const now = c.currentTime;

  // Noise thud (low-passed burst)
  const bufLen  = Math.floor(c.sampleRate * 0.18);
  const buffer  = c.createBuffer(1, bufLen, c.sampleRate);
  const data    = buffer.getChannelData(0);
  for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

  const source  = c.createBufferSource();
  source.buffer = buffer;

  const filter = c.createBiquadFilter();
  filter.type  = 'lowpass';
  filter.frequency.setValueAtTime(400, now);
  filter.frequency.exponentialRampToValueAtTime(55, now + 0.16);

  const gThud = c.createGain();
  gThud.gain.setValueAtTime(0.38, now);
  gThud.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

  source.connect(filter);
  filter.connect(gThud);
  gThud.connect(c.destination);
  source.start(now);

  // Rising shimmer sweep
  const osc  = c.createOscillator();
  osc.type   = 'sine';
  osc.frequency.setValueAtTime(280, now + 0.06);
  osc.frequency.exponentialRampToValueAtTime(2600, now + 0.55);

  const gShimmer = c.createGain();
  gShimmer.gain.setValueAtTime(0, now + 0.06);
  gShimmer.gain.linearRampToValueAtTime(0.20, now + 0.14);
  gShimmer.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

  osc.connect(gShimmer);
  gShimmer.connect(c.destination);
  osc.start(now + 0.06);
  osc.stop(now + 0.56);
}
