import { colors as tokenColors } from './tokens';

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const int = parseInt(full, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const volt = tokenColors.primary.DEFAULT;

export const viewportClasses = {
  compact: { minWidth: 896, maxWidth: 1138, minHeight: 568, maxHeight: 667 },
  standard: { minWidth: 1139, maxWidth: 1334, minHeight: 668, maxHeight: 767 },
  wide: { minWidth: 1335, maxWidth: 1600, minHeight: 768, maxHeight: 900 },
} as const;

export const swim26Layout = {
  safe: {
    left: 24,
    right: 24,
    top: 18,
    bottom: 16,
  },
  grid: {
    columns: 12,
    gutter: 16,
    rowGap: 16,
    maxWidth: 1440,
  },
  regions: {
    topBar: { columns: '1 / -1', height: 72 },
    heroPrimary: { columns: '1 / span 8', minHeight: 224, maxHeight: 320 },
    sideRail: { columns: '9 / -1' },
    contentBand: { columns: '1 / -1' },
    bottomNav: { columns: '1 / -1', height: 86 },
  },
} as const;

export const swim26Space = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const swim26Size = {
  topBar: { height: 72 },
  bottomNav: { height: 86 },
  icon: { xs: 14, sm: 18, md: 22, lg: 28, xl: 36 },
  touch: { min: 44, preferred: 52 },
  cards: {
    small: { width: 180, height: 108 },
    medium: { width: 240, height: 144 },
    large: { width: 320, height: 188 },
    hero: { minWidth: 560, maxWidth: 920, height: 260 },
  },
  buttons: {
    compact: { minWidth: 92, height: 40 },
    standard: { minWidth: 132, height: 48 },
    cta: { minWidth: 188, height: 56 },
  },
  statusChip: { height: 28 },
  badge: { height: 20 },
  tab: { height: 42 },
  profileBlock: { width: 220, height: 56 },
  currencyCounter: { width: 124, height: 40 },
} as const;

export const swim26Boundary = {
  border: { thin: 1, strong: 2 },
  radius: { sm: 10, md: 14, lg: 18, pill: 999 },
  surfaceOpacity: {
    primary: 0.94,
    secondary: 0.88,
    tertiary: 0.78,
    overlayCard: 0.72,
  },
  divider: {
    default: tokenColors.border.subtle,
    emphasis: hexToRgba(volt, 0.24),
  },
  elevation: {
    level0: 'none',
    level1: '0 4px 12px rgba(0,0,0,0.24)',
    level2: '0 8px 20px rgba(0,0,0,0.32)',
    level3: '0 12px 28px rgba(0,0,0,0.42)',
  },
  activeOutline: `2px solid ${hexToRgba(volt, 0.8)}`,
} as const;

export const swim26Color = {
  bg: { app: tokenColors.surface.base },
  surface: {
    // Keep relative "primary < secondary < tertiary" brightness levels,
    // but derive the base hue from broadcast carbon/graphite.
    primary: hexToRgba(tokenColors.surface.low, 0.94),
    secondary: hexToRgba(tokenColors.surface.mid, 0.90),
    tertiary: hexToRgba(tokenColors.surface.high, 0.82),
  },
  text: {
    primary: tokenColors.text.primary,
    secondary: tokenColors.text.secondary,
    disabled: tokenColors.text.muted,
  },
  accent: {
    primary: tokenColors.primary.DEFAULT,
    secondary: tokenColors.primary.dim,
  },
  feedback: {
    success: tokenColors.primary.DEFAULT,
    warning: tokenColors.text.primary,
    alert: tokenColors.danger.DEFAULT,
  },
  featured: { premium: tokenColors.gold.light },
  divider: tokenColors.border.subtle,
  overlay: { dim: tokenColors.overlay.dark },
} as const;

export const swim26Type = {
  displayHeading: {
    fontSize: 34,
    fontWeight: 800,
    lineHeight: 38,
    letterSpacing: '-0.02em',
    case: 'uppercase|title',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 700,
    lineHeight: 28,
    letterSpacing: '-0.01em',
    case: 'title',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 22,
    letterSpacing: '0em',
    case: 'title',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 600,
    lineHeight: 20,
    letterSpacing: '0em',
    case: 'title',
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: 700,
    lineHeight: 16,
    letterSpacing: '0.04em',
    case: 'upper|title',
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: 600,
    lineHeight: 16,
    letterSpacing: '0.02em',
    case: 'title',
  },
  metadata: {
    fontSize: 12,
    fontWeight: 500,
    lineHeight: 15,
    letterSpacing: '0.03em',
    case: 'sentence|upper',
  },
  helper: {
    fontSize: 11,
    fontWeight: 500,
    lineHeight: 14,
    letterSpacing: '0.01em',
    case: 'sentence',
  },
  numeric: {
    fontSize: 20,
    fontWeight: 700,
    lineHeight: 22,
    letterSpacing: '-0.01em',
    case: 'tabular',
  },
} as const;

export const swim26Components = {
  profileBlock: { width: 220, height: 56, paddingX: 10, paddingY: 6, priority: 2 },
  currencyChip: { width: 124, height: 40, paddingX: 10, paddingY: 6, priority: 2 },
  utilityIconButton: { minSize: 44, preferredSize: 48, iconSize: 22, priority: 3 },
  heroEventCard: { minWidth: 560, maxWidth: 920, height: 260, padding: 24, priority: 1 },
  secondaryModeCard: { minWidth: 240, maxWidth: 320, minHeight: 144, maxHeight: 188, padding: 16, priority: 3 },
  storeItemCard: { width: 220, height: 188, featuredWidth: 260, featuredHeight: 208, padding: 16, priority: 3 },
  rewardCard: { width: 200, height: 128, largeWidth: 220, largeHeight: 140, padding: 16, priority: 3 },
  infoPanel: { minHeight: 104, padding: 16, largePadding: 24, priority: 3 },
  tabGroup: { height: 42, tabMinWidth: 96, priority: 3 },
  segmentedControl: { height: 40, segmentMinWidth: 80, priority: 4 },
  ctaButtons: {
    primary: { minWidth: 188, height: 56 },
    secondary: { minWidth: 132, height: 48 },
    tertiary: { minWidth: 92, height: 40 },
  },
  notificationBadge: { dot: 10, countHeight: 20, priority: 4 },
  countdownChip: { minWidth: 72, height: 28, priority: 2 },
  bottomNavItem: { navHeight: 86, iconSize: 24, priority: 2 },
} as const;

export const swim26ResponsiveRules = {
  heroWidth: {
    compact: { min: 520, max: '100%' },
    standard: { min: 600, max: 820 },
    wide: { min: 680, max: 920 },
  },
  sideModuleMinWidth: { compact: 220, standard: 240, wide: 280 },
  bottomNavLabelScale: { compact: 11, standard: 12, wide: 12 },
  cardShrinkFloorPercent: 92,
};

export const swim26StateRules = {
  active: {
    border: `2px solid ${hexToRgba(volt, 0.8)}`,
    accentWash: hexToRgba(volt, 0.10),
    elevation: 'level2',
  },
  inactive: {
    border: '1px solid rgba(255,255,255,0.10)',
  },
  disabled: {
    text: tokenColors.text.muted,
    saturationReduction: 0.22,
    elevation: 'level0',
  },
  locked: {
    badge: 'lock',
    saturationReduction: 0.22,
    titleOpacity: 0.85,
  },
} as const;


export const swim26Overlay = {
  dim: {
    background: 'rgba(3, 10, 16, 0.72)',
    blur: 'blur(10px)',
  },
  frame: {
    maxWidth: 860,
    minWidth: 560,
    minHeight: 420,
    radius: 22,
    padding: 24,
    footerHeight: 84,
  },
  anchoredFrame: {
    maxWidth: 760,
    minWidth: 520,
    minHeight: 360,
  },
  header: {
    minHeight: 92,
    timerHeight: 28,
  },
  progression: {
    nodeSize: 72,
    connectorHeight: 4,
    rowMinHeight: 112,
  },
  rewardCard: {
    width: 184,
    height: 196,
    compactWidth: 156,
    compactHeight: 168,
    artHeight: 88,
  },
  cta: {
    primaryHeight: 56,
    secondaryHeight: 48,
  },
} as const;
