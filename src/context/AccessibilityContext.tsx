/**
 * AccessibilityContext
 *
 * Global store for accessibility preferences configured in
 * Settings → Accessibility.  Persists to localStorage.
 *
 * Applies data attributes on <html> so both CSS rules and any React
 * component can react to high-contrast, font-size, and reduced-motion
 * without prop-drilling.
 *
 * HTML data attributes set:
 *   data-a11y-contrast   = "high" | "normal"
 *   data-a11y-font-size  = "normal" | "large" | "xl"
 *   data-a11y-motion     = "reduced" | "full"
 *   data-a11y-colorblind = "off" | "protan" | "deutan" | "tritan"
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface A11ySettings {
  highContrast:  boolean;
  fontSize:      'normal' | 'large' | 'xl';
  reducedMotion: boolean;
  subtitles:     boolean;
  colorblind:    'off' | 'protan' | 'deutan' | 'tritan';
}

const DEFAULT: A11ySettings = {
  highContrast:  false,
  fontSize:      'normal',
  reducedMotion: false,
  subtitles:     false,
  colorblind:    'off',
};

// ─────────────────────────────────────────────────────────────────────────────
// Persistence helpers
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'swim26-a11y';

function loadA11y(): A11ySettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT;
  } catch {
    return DEFAULT;
  }
}

function saveA11y(settings: A11ySettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Storage may be blocked in private browsing; fail silently
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

interface A11yCtx {
  settings: A11ySettings;
  update: <K extends keyof A11ySettings>(key: K, val: A11ySettings[K]) => void;
}

const Ctx = createContext<A11yCtx>({
  settings: DEFAULT,
  update:   () => {},
});

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

export const A11yProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<A11ySettings>(loadA11y);

  const update = useCallback(
    <K extends keyof A11ySettings>(key: K, val: A11ySettings[K]) => {
      setSettings(prev => {
        const next = { ...prev, [key]: val };
        saveA11y(next);
        return next;
      });
    },
    [],
  );

  // Sync data attributes on <html> whenever settings change
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.a11yContrast   = settings.highContrast  ? 'high'    : 'normal';
    root.dataset.a11yFontSize   = settings.fontSize;
    root.dataset.a11yMotion     = settings.reducedMotion ? 'reduced' : 'full';
    root.dataset.a11yColorblind = settings.colorblind;
  }, [settings]);

  return <Ctx.Provider value={{ settings, update }}>{children}</Ctx.Provider>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

export function useA11y(): A11yCtx {
  return useContext(Ctx);
}
