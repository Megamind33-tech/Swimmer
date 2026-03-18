# ARCHITECTURE — Swimmer-Three
## Phase 1: UI Foundation Report

---

## 1. AUDIT — Current Problems Found

### 1.1 DOM-heavy layouts pretending to be game UI

| File | Problem |
|------|---------|
| `src/pages/HomePage.tsx` | Hero section with marketing copy, long description text, "GO NOW" as a CTA — looks like a SaaS landing page |
| `src/components/menu/HomeScreen.tsx` | Separate HomeScreen with long-scroll sections, "Quick Race Ops" sub-pages with bullet-point grids |
| `src/components/menu/PlayScreen.tsx` | `overflow-y-auto` full-page scroll, `auto-rows-max` grid with `pb-12` — long scroll in game mode picker |
| `src/components/menu/PreRaceSetupScreen.tsx` | `p-10 space-y-10 pb-32` — massive vertical padding/spacing, website-style two-column layout |
| `src/components/menu/RaceResultScreen.tsx` | `p-16` hero header, `p-10 space-y-12` body — full scrolling post-race page |
| `src/pages/UtilityPages.tsx` | Placeholder pages with generic web-style structure |

### 1.2 Long-scroll sections

- `PreRaceSetupScreen`: `overflow-y-auto` with 3 stacked config panels + fixed bottom bar (forces scroll on small landscape screens)
- `RaceResultScreen`: 12-unit vertical gaps, podium + results table + rewards column = requires scrolling
- `PlayScreen`: 6 mode cards in a `grid-cols-3` that requires scroll on narrow viewports
- `CareerMode`, `ClubManagement`, etc.: all use tall vertical page layouts

### 1.3 Generic website navigation patterns

- `TopBar` uses `<header>`-style horizontal bar with currency badges and icon buttons — appropriate, but padding/heights need token alignment
- `BottomNav` is a fixed navigation rail — acceptable pattern, now has PLAY button injected
- `SideMenu` (home page) is a vertical icon rail — acceptable for game, but stacked vertically like a web sidebar
- `BrowserToolkit` — a dev-only page inspector; should not ship to production

### 1.4 Oversized / monolithic files

| File | Lines | Problem |
|------|-------|---------|
| `src/components/menu/ClubScreen.tsx` | ~1100 | Giant single file; has multiple sub-screens embedded |
| `src/types/index.ts` | Large | All game types in one file |
| `src/utils/gameData.ts` | Large | All mock data hardcoded inline |
| `src/graphics/ArenaManager.ts` | 758 | Could split: ArenaGeometry, ArenaLighting, ArenaCameras |

### 1.5 Inconsistent style definitions

- 4 different HUD components exist: `src/components/RaceGameplayHUD.tsx`, `src/components/RaceHUD.tsx`, `src/components/screens/RaceGameplayHUD.tsx`, inline HUD inside `RaceScene.tsx`
- 2 different `TopBar.tsx` files: `src/components/TopBar.tsx` and `src/components/menu/TopBar.tsx`
- CSS classes are mixed: Tailwind arbitrary values (`bg-[#050B14]`), custom CSS (`hydro-*` classes from a previous design system), inline `style={}` objects
- `hydro-*` CSS classes reference a design system that no longer exists in `index.css`

### 1.6 Hardcoded colors/fonts/icons

- Hex colors appear in 30+ files as Tailwind arbitrary values: `bg-[#0A1628]`, `text-[#D4A843]`, `border-[#C41E3A]`, etc.
- Magic numbers: `h-14`, `h-16`, `w-28`, `px-4` are used inconsistently across the nav chrome
- Lucide icons are imported directly in 15+ files rather than through a central registry
- An external image URL (`cdn.magicpatterns.com`) is hardcoded in `HomePage.tsx`

### 1.7 Gameplay-critical UI that should not be DOM-driven

- Stroke tap zones in `RaceScene.tsx` are `<button>` DOM elements — acceptable for now, but should eventually use Babylon.js `DeviceSourceManager` for sub-frame input latency
- Race timer is driven by a `useState` tick loop — should be a Babylon.js `Scene.onBeforeRenderObservable` update instead
- The progress bar in the HUD is a DOM element — for > 8 swimmers, a Babylon.js GUI texture would perform better

### 1.8 Gameplay systems not connected to UI

- `StrokeSystem`, `TurnSystem`, `AISwimmer`, `RivalSystem` — all exist in `src/gameplay/` but none are wired to `RaceScene`
- `BroadcastCamera` exists in `src/graphics/` but is only used in `ArenaManager` internally, never activated from UI
- `RaceEngine`, `RaceController`, `RaceRecorder`, `ReplayController` — all exist in `src/core/` but are disconnected
- `PlayerManager` in `src/data/` is never called; `TopBar` uses hardcoded `USER_DATA` from `gameData.ts`
- `GameManager` singleton exists and has a full event system but nothing subscribes to it

---

## 2. WHAT WAS BUILT IN PHASE 1

### 2.1 New folder structure

```
src/
  app/                ← NEW: AppShell (non-race UI)
    AppShell.tsx
  theme/              ← NEW: centralized design tokens
    tokens.ts           color, spacing, radii, shadows, HUD sizing, control sizing, z-index
    typography.ts       font families, sizes, weights, line-heights, composed text styles
    icons.tsx           icon registry (all Lucide imports + custom SVGs)
  ui/                 ← EXISTING: shared UI primitives (extended)
    LandscapeGuard.tsx  ← NEW: rotate-device overlay
    MediaPrimitives.tsx   (existing)
  scene/              ← NEW FOLDER (empty, for Phase 2 Babylon.js files)
  hud/                ← NEW FOLDER (empty, for Phase 2 HUD components)
  overlays/           ← NEW FOLDER (empty, for Phase 2 overlay components)
  input/              ← NEW FOLDER (empty, for Phase 2 input handling)
  state/              ← NEW FOLDER (empty, for Phase 2 state management)
```

### 2.2 AppShell / GameShell separation

**Before:** `GameShell.tsx` was a ~230-line file doing everything: menu navigation, page rendering, TopBar, BottomNav, AND race flow state machine.

**After:**
- `src/app/AppShell.tsx` — owns ALL non-race menu/lobby UI. Contains TopBar, BottomNav, page router, utility page router. Has a single `onPlay` prop that GameShell wires to the race flow.
- `src/components/GameShell.tsx` — now a pure state machine / coordinator. Renders `AppShell` for the `menu` phase and game-flow screens (mode-select, pre-race, racing, paused, results) for all other phases.

### 2.3 Landscape guard

`src/ui/LandscapeGuard.tsx` wraps the entire `<App>`. When `window.innerWidth <= window.innerHeight`:
- Underlying game content gets `pointer-events: none` and `filter: blur(3px) brightness(0.4)`
- A dark overlay with animated phone-rotation icon appears at `z-index: 90`
- Content remains mounted (no WebGL context reload on rotate)
- Guard is responsive to `window.matchMedia('orientation: landscape')` change events

### 2.4 Theme token system

`src/theme/tokens.ts`:
- `colors` — primary (cyan), gold, danger, action (green), surfaces (5 levels), text (4 levels), borders, stamina states, overlays
- `spacing` — 4px base grid, 12 stops
- `radii` — sm → full
- `shadows` — glow variants (primary, gold, danger, action), elevation, inset highlight
- `hud` — top bar height, progress bar, stamina ring, ticker, stroke zone, countdown, rival marker — all in px
- `control` — WCAG minimum tap size, button heights (lg/md/sm), icon button, nav tab, PLAY button, card heights
- `zIndex` — scene → hud → menu → modal → landscape → toast

`injectCSSTokens()` is called once in `main.tsx` before first render, writing all tokens as CSS custom properties on `:root`.

### 2.5 Typography token system

`src/theme/typography.ts`:
- `fontFamily` — headline (Barlow Condensed), body (Inter), mono (JetBrains Mono), label (Inter)
- `fontWeight` — regular/medium/bold/black
- `fontSize` — hud (timer, rank, distance, label, ticker, countdown), ui (hero → nano), stat (xl → sm)
- `lineHeight` — tight/snug/normal/relaxed
- `letterSpacing` — tight → widest
- `textStyle` — composed ready-to-use style objects for headlineLg, headlineMd, hudTimer, hudLabel, body, badge

### 2.6 Icon registry

`src/theme/icons.tsx`:
- Single import source for all game icons
- Semantic aliases: `Career` (not Trophy), `Market` (not ShoppingCart), `Stamina` (not Zap)
- Custom SVG icons: `WaveIcon`, `SwimmerIcon`, `StopwatchIcon`, `RotateDeviceIcon`
- `GameIcon` component: `<GameIcon name="Career" size={20} />`
- All icons are Lucide (one family, consistent stroke width)

### 2.7 CSS base updated

`src/index.css`:
- Base reset for game: `overflow: hidden`, `overscroll-behavior: none`, iOS `position: fixed` bounce prevention
- CSS custom properties declared as fallback defaults (live values from `tokens.ts`)
- `font-headline` and `font-mono-data` utility classes
- `text-glow-primary` and `text-glow-gold` glow utilities
- `stamina-bar`, `tap-highlight` game-specific utilities
- `animate-ticker` and `animate-countdown` keyframes
- `@media (orientation: portrait)` safety rule

### 2.8 RaceScene wired (previous session)

`src/components/RaceScene.tsx`:
- Mounts WebGL canvas, boots `ArenaManager`, applies venue theme
- Race simulation RAF loop (distance, stamina, position) — stub to be replaced by real gameplay systems in Phase 2
- Inline HUD: lane progress, stamina ring, stroke tap zones, ticker, pause button
- 3-second countdown before race starts
- Emits `onRaceComplete(result)` to GameShell on finish

---

## 3. WHAT WAS REMOVED / DEPRECATED

| Item | Status |
|------|--------|
| Inline `GamePhase` navigation in original `GameShell.tsx` | Replaced by AppShell + GameShell split |
| `onSideMenuSelect` prop threading through `GameShell` | Now encapsulated in `AppShell` |
| Hardcoded `locker_room_custom` background in `GameShell` | Moved to `AppShell` and `OverlayShell` helper |
| Duplicate `UtilityPage` type in `GameShell` | Canonical version now in `AppShell.tsx` |

---

## 4. WHAT REMAINS FOR PHASE 2

### Priority 1 — Gameplay systems integration
- Replace `RaceScene.tsx` simulation stub with `StrokeSystem`, `TurnSystem`, `AISwimmer`
- Activate `BroadcastCamera` during race
- Wire `GameManager` lifecycle: `startRace()`, `finishRace()`, `addXp()`
- Spawn swimmer meshes via `SwimmerManager`

### Priority 2 — HUD consolidation
- Delete 3 duplicate HUD files; keep only `src/hud/RaceHUD.tsx` (to be created in Phase 2)
- Delete duplicate `TopBar.tsx` in `src/components/menu/`
- Move HUD components to `src/hud/` folder

### Priority 3 — Token adoption
- Replace all `bg-[#xxx]` Tailwind arbitrary color values with CSS custom properties or token imports
- Replace all direct Lucide imports with `GameIcon` from the registry
- Remove `hydro-*` CSS class references (dead design system classes)

### Priority 4 — Screen refactor
- `PreRaceSetupScreen` — reduce to 2 panels max, fit within one landscape screen without scroll
- `RaceResultScreen` — fit on one landscape screen; move splits to a swipeable drawer
- `PlayScreen` — reduce to 4 mode cards visible at once in a 2×2 grid (no scroll)
- `ClubScreen` — split into ≤ 3 focused sub-screens

### Priority 5 — Production hygiene
- Remove `BrowserToolkit` from production bundle (dev flag or env check)
- Remove `src/examples/` directory
- Remove `src/components/screens/USAGE_EXAMPLES.tsx`
- Remove external CDN image in `HomePage.tsx`
- Add `@types/react` properly to tsconfig paths

---

## 5. FOLDER RESPONSIBILITY MAP

```
src/
  app/              AppShell — menu/lobby UI, navigation, page routing
  components/       GameShell (coordinator), RaceScene, PauseMenu,
                    shared UI components (TopBar, BottomNav, etc.)
  components/menu/  Full-screen menu pages (PlayScreen, PreRace, Results…)
  pages/            Tab page components (HomePage, CareerMode, etc.)
  theme/            tokens.ts, typography.ts, icons.tsx — design system
  ui/               Shared primitives, LandscapeGuard
  scene/            (Phase 2) Babylon.js scene utilities, ArenaManager wrappers
  hud/              (Phase 2) Consolidated race HUD components
  overlays/         (Phase 2) Pause, countdown, combo, disqualification overlays
  input/            (Phase 2) TouchControls, DeviceSourceManager wrappers
  state/            (Phase 2) Game state hooks, context providers
  core/             GameManager, RaceEngine, RaceController (existing)
  graphics/         ArenaManager, BroadcastCamera, SwimmerManager (existing)
  gameplay/         StrokeSystem, TurnSystem, AISwimmer (existing, unconnected)
  data/             PlayerManager (existing, unconnected)
  types/            index.ts — all shared TypeScript interfaces
  utils/            difficultyUtils, gameData, index
  hooks/            useGameManager, usePlayerManager, useRivalSystem
```

---

*Phase 1 complete. See `FUTURE_WORK.md` for the full gameplay task backlog.*
