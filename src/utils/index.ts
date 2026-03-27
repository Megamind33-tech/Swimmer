/**
 * SWIMMER GAME - Utility Functions
 * Shared utilities across all game modules
 */

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Lerp between two values
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp(t, 0, 1);
}

/**
 * Ease in/out functions
 */
export const easing = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => 1 + (t - 1) * (t - 1) * (t - 1),
};

/**
 * Format time in MM:SS.ms format
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${mins}:${String(secs).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
}

/**
 * Calculate XP required for a level
 */
export function xpRequiredForLevel(level: number): number {
  if (level <= 5) return 100;
  if (level <= 10) return 150;
  if (level <= 20) return 250;
  if (level <= 30) return 400;
  if (level <= 50) return 750;
  return 1500;
}

/**
 * Calculate total XP to reach a level
 */
export function cumulativeXpForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += xpRequiredForLevel(i);
  }
  return total;
}

/**
 * Calculate level from total XP
 */
export function levelFromXp(totalXp: number): { level: number; xpInLevel: number } {
  let level = 1;
  let xpUsed = 0;

  while (level < 100) {
    const xpNeeded = xpRequiredForLevel(level);
    if (xpUsed + xpNeeded > totalXp) {
      return { level, xpInLevel: totalXp - xpUsed };
    }
    xpUsed += xpNeeded;
    level++;
  }

  return { level: 100, xpInLevel: totalXp - xpUsed };
}

/**
 * Random number between min and max
 */
export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Random integer between min and max
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(randomBetween(min, max + 1));
}

/**
 * Weighted random selection
 */
export function weightedRandom<T>(items: Array<{ item: T; weight: number }>): T {
  const totalWeight = items.reduce((sum, x) => sum + x.weight, 0);
  let random = Math.random() * totalWeight;

  for (const { item, weight } of items) {
    random -= weight;
    if (random <= 0) return item;
  }

  return items[items.length - 1].item;
}

/**
 * Shuffle array
 */
export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Distance between two points
 */
export function distance2D(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Throttle function calls
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function (this: any, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
      timeout = null;
    }, wait);
  };
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if device is mobile
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export interface GraphicsCompatibilityProfile {
  isAndroid: boolean;
  supportsWebGL2: boolean;
  maxTextureSize: number;
  maxVaryingVectors: number;
  maxFragmentUniformVectors: number;
  mobileShaderBudget: 'strict' | 'balanced' | 'full';
  recommendedQualityTier: 'LOW' | 'MEDIUM' | 'HIGH';
  enableAdvancedWater: boolean;
  enablePostProcessPipeline: boolean;
  enableEnvironmentProbe: boolean;
  maxPbrLights: number;
  antialias: boolean;
}

let cachedGraphicsProfile: GraphicsCompatibilityProfile | null = null;

export function getGraphicsCompatibilityProfile(): GraphicsCompatibilityProfile {
  if (cachedGraphicsProfile) return cachedGraphicsProfile;

  const isAndroid = /Android/i.test(navigator.userAgent);
  const canvas = document.createElement('canvas');

  // Try WebGL2 first, with error handling for Android 12+
  let webgl2;
  try {
    webgl2 = canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: false });
  } catch (e) {
    logger.warn('[GraphicsCompat] WebGL2 context creation failed:', e);
    webgl2 = null;
  }

  // Fall back to WebGL 1.0
  let webgl1;
  try {
    webgl1 = webgl2 ?? canvas.getContext('webgl', { failIfMajorPerformanceCaveat: false });
  } catch (e) {
    logger.warn('[GraphicsCompat] WebGL 1.0 context creation failed:', e);
    webgl1 = null;
  }

  if (!webgl1) {
    cachedGraphicsProfile = {
      isAndroid,
      supportsWebGL2: false,
      maxTextureSize: 0,
      maxVaryingVectors: 0,
      maxFragmentUniformVectors: 0,
      mobileShaderBudget: 'strict',
      recommendedQualityTier: 'LOW',
      enableAdvancedWater: false,
      enablePostProcessPipeline: false,
      enableEnvironmentProbe: false,
      maxPbrLights: 2,
      antialias: false,
    };
    return cachedGraphicsProfile;
  }

  const gl = webgl1 as WebGLRenderingContext | WebGL2RenderingContext;
  const supportsWebGL2 = !!webgl2;
  const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
  const maxVaryingVectors = gl.getParameter(gl.MAX_VARYING_VECTORS) as number;
  const maxFragmentUniformVectors = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS) as number;

  const mobileShaderBudget: 'strict' | 'balanced' | 'full' =
    isAndroid && (!supportsWebGL2 || maxVaryingVectors < 12 || maxFragmentUniformVectors < 224)
      ? 'strict'
      : isAndroid && (maxTextureSize < 8192 || maxVaryingVectors < 16 || maxFragmentUniformVectors < 320)
        ? 'balanced'
        : 'full';

  const recommendedQualityTier: 'LOW' | 'MEDIUM' | 'HIGH' =
    !supportsWebGL2
      ? 'LOW'
      : mobileShaderBudget === 'strict'
        ? 'LOW'
        : mobileShaderBudget === 'balanced'
          ? 'MEDIUM'
          : maxTextureSize >= 8192 && maxVaryingVectors >= 24
            ? 'HIGH'
            : 'MEDIUM';

  const stableAdvancedPipeline =
    supportsWebGL2 &&
    mobileShaderBudget !== 'strict' &&
    maxTextureSize >= 4096 &&
    maxVaryingVectors >= 16 &&
    maxFragmentUniformVectors >= 256;

  cachedGraphicsProfile = {
    isAndroid,
    supportsWebGL2,
    maxTextureSize,
    maxVaryingVectors,
    maxFragmentUniformVectors,
    mobileShaderBudget,
    recommendedQualityTier,
    enableAdvancedWater: stableAdvancedPipeline && (!isAndroid || mobileShaderBudget === 'full'),
    enablePostProcessPipeline: stableAdvancedPipeline,
    enableEnvironmentProbe: stableAdvancedPipeline && (!isAndroid || mobileShaderBudget === 'full'),
    maxPbrLights:
      mobileShaderBudget === 'strict' ? 3
      : mobileShaderBudget === 'balanced' ? 4
      : isAndroid ? 6 : 8,
    antialias: !isAndroid && recommendedQualityTier === 'HIGH',
  };

  return cachedGraphicsProfile;
}

/**
 * Get device quality tier based on capabilities
 */
export function getDeviceQualityTier(): 'LOW' | 'MEDIUM' | 'HIGH' {
  return getGraphicsCompatibilityProfile().recommendedQualityTier;
}

/**
 * Request animation frame with fallback
 */
export function requestFrame(callback: FrameRequestCallback): number {
  return (
    (window as any).requestAnimationFrame?.(callback) ||
    setTimeout(callback, 16) as unknown as number
  );
}

/**
 * Cancel animation frame with fallback
 */
export function cancelFrame(id: number): void {
  (window as any).cancelAnimationFrame?.(id) || clearTimeout(id);
}

/**
 * LocalStorage wrapper with JSON serialization
 */
export const storage = {
  get: <T = any>(key: string, defaultValue?: T): T | undefined => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.error(`Failed to set localStorage key: ${key}`);
    }
  },
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {
      console.error(`Failed to remove localStorage key: ${key}`);
    }
  },
  clear: (): void => {
    try {
      localStorage.clear();
    } catch {
      console.error('Failed to clear localStorage');
    }
  },
};

/**
 * Logger with levels
 */
export const logger = {
  log: (...args: any[]) => console.log('[SWIMMER]', ...args),
  warn: (...args: any[]) => console.warn('[SWIMMER]', ...args),
  error: (...args: any[]) => console.error('[SWIMMER]', ...args),
  debug: (...args: any[]) => {
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.debug('[SWIMMER]', ...args);
    }
  },
};

/**
 * Event emitter for decoupled communication
 */
export class EventEmitter<T extends Record<string, any>> {
  private listeners: Map<string, Function[]> = new Map();

  on<K extends keyof T>(event: K, callback: (data: T[K]) => void): () => void {
    if (!this.listeners.has(String(event))) {
      this.listeners.set(String(event), []);
    }
    this.listeners.get(String(event))!.push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(String(event));
      if (callbacks) {
        const idx = callbacks.indexOf(callback);
        if (idx > -1) callbacks.splice(idx, 1);
      }
    };
  }

  emit<K extends keyof T>(event: K, data: T[K]): void {
    const callbacks = this.listeners.get(String(event));
    if (callbacks) {
      callbacks.forEach((cb) => cb(data));
    }
  }

  off<K extends keyof T>(event: K): void {
    this.listeners.delete(String(event));
  }

  clear(): void {
    this.listeners.clear();
  }
}
