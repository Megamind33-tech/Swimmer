import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';

// ── Types ────────────────────────────────────────────────────────────────────

export interface Athlete {
  id: number;
  name: string;
  ovr: number;
  spec: string;
  stamina: number;
  form: 'PEAK' | 'GOOD' | 'FATIGUED' | 'RECOVERY';
  country: string;
  role: 'CORE' | 'RESERVE' | 'PROSPECT';
  img: string;
  speed: number;       // base m/s
  technique: number;   // 0-100
  endurance: number;   // 0-100
}

export interface Prospect {
  id: number;
  type: 'UNDISCLOSED' | 'KNOWN PROSPECT';
  name?: string;
  region: string;
  estOvr: string;
  cost: string;
  costNum: number;
  spec: string;
  img: string | null;
  scouted: boolean;
  signed: boolean;
}

export interface GameSettings {
  fps60: boolean;
  advancedSplits: boolean;
  waterCaustics: boolean;
  colorblind: boolean;
  arenaAmbience: boolean;
  coachVoice: boolean;
  hapticFeedback: boolean;
}

export interface RaceState {
  active: boolean;
  timer: number;
  distance: number;
  stamina: number;
  strokeCount: number;
  breathCount: number;
  surgeCount: number;
  surgeActive: boolean;
  surgeCooldown: number;
  bodyPitch: number;
  lanePosition: number;
  opponents: OpponentState[];
  finished: boolean;
  finalTime: number;
  finalRank: number;
}

export interface OpponentState {
  name: string;
  nat: string;
  distance: number;
  speed: number;
  finished: boolean;
  finalTime: number;
}

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'info' | 'warning';
  timestamp: number;
}

export interface GameState {
  budget: number;
  points: number;
  seasonWeek: number;
  squad: Athlete[];
  prospects: Prospect[];
  settings: GameSettings;
  race: RaceState;
  notifications: Notification[];
  facilityLevel: number;
  facilityProgress: number;
  overlay: string | null;         // 'athlete-detail' | 'prospect-negotiate' | 'profile' | 'race-result' | null
  selectedAthleteId: number | null;
  selectedProspectId: number | null;
}

// ── Initial Data ─────────────────────────────────────────────────────────────

const INITIAL_SQUAD: Athlete[] = [
  { id: 1, name: "M. PHELPS II", ovr: 92, spec: "100M FREE", stamina: 95, form: "PEAK", country: "USA", role: "CORE", img: "https://images.unsplash.com/photo-1563299796-17596c35a7fc?auto=format&fit=crop&w=400&q=80", speed: 2.18, technique: 92, endurance: 88 },
  { id: 2, name: "K. CHALMERS", ovr: 89, spec: "100M FREE", stamina: 82, form: "GOOD", country: "AUS", role: "CORE", img: "https://images.unsplash.com/photo-1517344884509-a0c97ea11cb7?auto=format&fit=crop&w=400&q=80", speed: 2.12, technique: 87, endurance: 85 },
  { id: 3, name: "A. PEATY", ovr: 94, spec: "50M BREAST", stamina: 45, form: "FATIGUED", country: "GBR", role: "RESERVE", img: "https://images.unsplash.com/photo-1526547541286-73a7aaa08f2a?auto=format&fit=crop&w=400&q=80", speed: 2.06, technique: 95, endurance: 78 },
  { id: 4, name: "L. MARCHAND", ovr: 91, spec: "400M IM", stamina: 100, form: "PEAK", country: "FRA", role: "CORE", img: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=400&q=80", speed: 2.10, technique: 90, endurance: 94 },
  { id: 5, name: "D. POPOVICI", ovr: 88, spec: "200M FREE", stamina: 20, form: "RECOVERY", country: "ROU", role: "PROSPECT", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80", speed: 2.15, technique: 86, endurance: 82 },
];

const INITIAL_PROSPECTS: Prospect[] = [
  { id: 101, type: "UNDISCLOSED", region: "EASTERN EUROPE", estOvr: "84-88", cost: "$150K", costNum: 150000, spec: "SPRINT", img: null, scouted: false, signed: false },
  { id: 102, type: "KNOWN PROSPECT", name: "J. ALVAREZ", region: "SOUTH AMERICA", estOvr: "81", cost: "$420K", costNum: 420000, spec: "ENDURANCE", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80", scouted: true, signed: false },
  { id: 103, type: "UNDISCLOSED", region: "ASIA PACIFIC", estOvr: "88-92", cost: "$300K", costNum: 300000, spec: "MEDLEY", img: null, scouted: false, signed: false },
  { id: 104, type: "KNOWN PROSPECT", name: "S. TAKEDA", region: "JAPAN", estOvr: "85", cost: "$950K", costNum: 950000, spec: "BACKSTROKE", img: "https://images.unsplash.com/photo-1526547541286-73a7aaa08f2a?auto=format&fit=crop&w=400&q=80", scouted: true, signed: false },
  { id: 105, type: "KNOWN PROSPECT", name: "M. SCHMIDT", region: "GERMANY", estOvr: "83", cost: "$600K", costNum: 600000, spec: "BREASTSTROKE", img: "https://images.unsplash.com/photo-1517344884509-a0c97ea11cb7?auto=format&fit=crop&w=400&q=80", scouted: true, signed: false },
];

const INITIAL_RACE: RaceState = {
  active: false, timer: 0, distance: 0, stamina: 100, strokeCount: 0,
  breathCount: 0, surgeCount: 0, surgeActive: false, surgeCooldown: 0,
  bodyPitch: 50, lanePosition: 4, opponents: [], finished: false,
  finalTime: 0, finalRank: 0,
};

const INITIAL_STATE: GameState = {
  budget: 4250000,
  points: 1250,
  seasonWeek: 12,
  squad: INITIAL_SQUAD,
  prospects: INITIAL_PROSPECTS,
  settings: {
    fps60: true, advancedSplits: true, waterCaustics: true, colorblind: false,
    arenaAmbience: true, coachVoice: true, hapticFeedback: true,
  },
  race: INITIAL_RACE,
  notifications: [],
  facilityLevel: 4,
  facilityProgress: 65,
  overlay: null,
  selectedAthleteId: null,
  selectedProspectId: null,
};

// ── Actions ──────────────────────────────────────────────────────────────────

type Action =
  | { type: 'RECOVER_ATHLETE'; id: number }
  | { type: 'SCOUT_PROSPECT'; id: number }
  | { type: 'SIGN_PROSPECT'; id: number }
  | { type: 'TOGGLE_SETTING'; key: keyof GameSettings }
  | { type: 'AUTHORIZE_FUNDING' }
  | { type: 'ADD_NOTIFICATION'; message: string; notifType: 'success' | 'info' | 'warning' }
  | { type: 'DISMISS_NOTIFICATION'; id: number }
  | { type: 'SET_OVERLAY'; overlay: string | null; athleteId?: number; prospectId?: number }
  | { type: 'RACE_START' }
  | { type: 'RACE_STROKE' }
  | { type: 'RACE_BREATHE' }
  | { type: 'RACE_SURGE' }
  | { type: 'RACE_TICK'; dt: number }
  | { type: 'RACE_SET_PITCH'; pitch: number }
  | { type: 'RACE_END' }
  | { type: 'RACE_RESET' };

// ── Reducer ──────────────────────────────────────────────────────────────────

function addNotif(state: GameState, message: string, notifType: 'success' | 'info' | 'warning'): Notification[] {
  const n: Notification = { id: Date.now(), message, type: notifType, timestamp: Date.now() };
  return [...state.notifications.slice(-4), n];
}

function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {

    case 'RECOVER_ATHLETE': {
      const cost = 50000;
      if (state.budget < cost) return { ...state, notifications: addNotif(state, 'INSUFFICIENT FUNDS FOR RECOVERY', 'warning') };
      return {
        ...state,
        budget: state.budget - cost,
        squad: state.squad.map(a =>
          a.id === action.id ? { ...a, stamina: Math.min(100, a.stamina + 40), form: a.stamina + 40 >= 80 ? 'GOOD' : 'FATIGUED' } : a
        ),
        notifications: addNotif(state, 'RECOVERY PROTOCOL INITIATED — $50K', 'success'),
      };
    }

    case 'SCOUT_PROSPECT': {
      const cost = 75000;
      if (state.budget < cost) return { ...state, notifications: addNotif(state, 'INSUFFICIENT FUNDS FOR SCOUTING', 'warning') };
      const names = ["V. KOROV", "T. NAKAMURA", "R. SANTOS", "H. CHEN", "P. BERG"];
      return {
        ...state,
        budget: state.budget - cost,
        prospects: state.prospects.map(p =>
          p.id === action.id && !p.scouted ? {
            ...p, scouted: true, type: 'KNOWN PROSPECT' as const,
            name: names[Math.floor(Math.random() * names.length)],
            img: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=400&q=80",
          } : p
        ),
        notifications: addNotif(state, 'SCOUT REPORT RECEIVED — $75K', 'success'),
      };
    }

    case 'SIGN_PROSPECT': {
      const prospect = state.prospects.find(p => p.id === action.id);
      if (!prospect || prospect.signed) return state;
      if (state.budget < prospect.costNum) return { ...state, notifications: addNotif(state, 'INSUFFICIENT FUNDS FOR TRANSFER', 'warning') };
      const newAthlete: Athlete = {
        id: Date.now(), name: prospect.name || "NEW SIGNING", ovr: parseInt(prospect.estOvr) || 84,
        spec: prospect.spec, stamina: 100, form: 'GOOD', country: prospect.region.slice(0, 3).toUpperCase(),
        role: 'RESERVE', img: prospect.img || "", speed: 2.05, technique: 82, endurance: 80,
      };
      return {
        ...state,
        budget: state.budget - prospect.costNum,
        squad: [...state.squad, newAthlete],
        prospects: state.prospects.map(p => p.id === action.id ? { ...p, signed: true } : p),
        notifications: addNotif(state, `${newAthlete.name} SIGNED — ${prospect.cost}`, 'success'),
        overlay: null,
      };
    }

    case 'TOGGLE_SETTING': {
      return {
        ...state,
        settings: { ...state.settings, [action.key]: !state.settings[action.key] },
        notifications: addNotif(state, `${String(action.key).toUpperCase()} ${!state.settings[action.key] ? 'ENABLED' : 'DISABLED'}`, 'info'),
      };
    }

    case 'AUTHORIZE_FUNDING': {
      const cost = 200000;
      if (state.budget < cost) return { ...state, notifications: addNotif(state, 'INSUFFICIENT FUNDS FOR UPGRADE', 'warning') };
      const newProgress = Math.min(100, state.facilityProgress + 15);
      const levelUp = newProgress >= 100;
      return {
        ...state,
        budget: state.budget - cost,
        facilityProgress: levelUp ? 0 : newProgress,
        facilityLevel: levelUp ? state.facilityLevel + 1 : state.facilityLevel,
        notifications: addNotif(state, levelUp ? `FACILITY UPGRADED TO LV.${state.facilityLevel + 1}!` : `UPGRADE FUNDED — ${newProgress}% COMPLETE`, 'success'),
      };
    }

    case 'ADD_NOTIFICATION':
      return { ...state, notifications: addNotif(state, action.message, action.notifType) };

    case 'DISMISS_NOTIFICATION':
      return { ...state, notifications: state.notifications.filter(n => n.id !== action.id) };

    case 'SET_OVERLAY':
      return { ...state, overlay: action.overlay, selectedAthleteId: action.athleteId ?? null, selectedProspectId: action.prospectId ?? null };

    case 'RACE_START': {
      const opponents: OpponentState[] = [
        { name: "PHELPS II", nat: "USA", distance: 0, speed: 2.15 + Math.random() * 0.08, finished: false, finalTime: 0 },
        { name: "CHALMERS", nat: "AUS", distance: 0, speed: 2.10 + Math.random() * 0.10, finished: false, finalTime: 0 },
        { name: "MARCHAND", nat: "FRA", distance: 0, speed: 2.05 + Math.random() * 0.12, finished: false, finalTime: 0 },
        { name: "PEATY", nat: "GBR", distance: 0, speed: 2.08 + Math.random() * 0.10, finished: false, finalTime: 0 },
        { name: "POPOVICI", nat: "ROU", distance: 0, speed: 2.12 + Math.random() * 0.08, finished: false, finalTime: 0 },
      ];
      return { ...state, race: { ...INITIAL_RACE, active: true, opponents, stamina: 100 } };
    }

    case 'RACE_STROKE': {
      if (!state.race.active || state.race.finished) return state;
      const staminaCost = state.race.surgeActive ? 6 : 3;
      const speedMult = state.race.surgeActive ? 1.4 : 1.0;
      const pitchBonus = 1 + (50 - Math.abs(state.race.bodyPitch - 50)) / 500;
      const advance = 1.8 * speedMult * pitchBonus;
      const newStamina = Math.max(0, state.race.stamina - staminaCost);
      const newDistance = state.race.distance + advance * (newStamina > 20 ? 1 : 0.7);
      return {
        ...state,
        race: { ...state.race, distance: newDistance, stamina: newStamina, strokeCount: state.race.strokeCount + 1 }
      };
    }

    case 'RACE_BREATHE': {
      if (!state.race.active || state.race.finished) return state;
      return {
        ...state,
        race: {
          ...state.race,
          stamina: Math.min(100, state.race.stamina + 8),
          breathCount: state.race.breathCount + 1,
          distance: state.race.distance + 0.3, // slight forward drift
        }
      };
    }

    case 'RACE_SURGE': {
      if (!state.race.active || state.race.finished || state.race.surgeActive || state.race.surgeCooldown > 0 || state.race.stamina < 25) return state;
      return {
        ...state,
        race: { ...state.race, surgeActive: true, surgeCount: state.race.surgeCount + 1 },
        notifications: addNotif(state, 'SURGE ACTIVATED — MAXIMUM EFFORT', 'info'),
      };
    }

    case 'RACE_TICK': {
      if (!state.race.active || state.race.finished) return state;
      const dt = action.dt;
      const newTimer = state.race.timer + dt;
      let surgeActive = state.race.surgeActive;
      let surgeCooldown = Math.max(0, state.race.surgeCooldown - dt);
      if (surgeActive && state.race.stamina < 10) { surgeActive = false; surgeCooldown = 5; }

      const updatedOpponents = state.race.opponents.map(opp => {
        if (opp.finished) return opp;
        const variance = 0.95 + Math.random() * 0.10;
        const newDist = opp.distance + opp.speed * dt * variance;
        if (newDist >= 100) return { ...opp, distance: 100, finished: true, finalTime: newTimer };
        return { ...opp, distance: newDist };
      });

      const playerFinished = state.race.distance >= 100;
      if (playerFinished && !state.race.finished) {
        const finishedBefore = updatedOpponents.filter(o => o.finished && o.finalTime <= newTimer).length;
        return {
          ...state,
          race: {
            ...state.race, timer: newTimer, surgeActive, surgeCooldown,
            opponents: updatedOpponents, finished: true, finalTime: newTimer,
            finalRank: finishedBefore + 1, distance: 100,
          },
          overlay: 'race-result',
          points: state.points + Math.max(0, (6 - (finishedBefore + 1)) * 50),
        };
      }

      return {
        ...state,
        race: { ...state.race, timer: newTimer, surgeActive, surgeCooldown, opponents: updatedOpponents }
      };
    }

    case 'RACE_SET_PITCH':
      return { ...state, race: { ...state.race, bodyPitch: action.pitch } };

    case 'RACE_END':
      return { ...state, race: { ...state.race, active: false } };

    case 'RACE_RESET':
      return { ...state, race: INITIAL_RACE, overlay: null };

    default: return state;
  }
}

// ── Context ──────────────────────────────────────────────────────────────────

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<Action>;
  // Convenience methods
  recoverAthlete: (id: number) => void;
  scoutProspect: (id: number) => void;
  signProspect: (id: number) => void;
  toggleSetting: (key: keyof GameSettings) => void;
  authorizeFunding: () => void;
  openOverlay: (overlay: string, athleteId?: number, prospectId?: number) => void;
  closeOverlay: () => void;
  startRace: () => void;
  stroke: () => void;
  breathe: () => void;
  surge: () => void;
  setPitch: (pitch: number) => void;
  resetRace: () => void;
  formatBudget: (amount: number) => string;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);

  const recoverAthlete  = useCallback((id: number) => dispatch({ type: 'RECOVER_ATHLETE', id }), []);
  const scoutProspect   = useCallback((id: number) => dispatch({ type: 'SCOUT_PROSPECT', id }), []);
  const signProspect    = useCallback((id: number) => dispatch({ type: 'SIGN_PROSPECT', id }), []);
  const toggleSetting   = useCallback((key: keyof GameSettings) => dispatch({ type: 'TOGGLE_SETTING', key }), []);
  const authorizeFunding = useCallback(() => dispatch({ type: 'AUTHORIZE_FUNDING' }), []);
  const openOverlay     = useCallback((overlay: string, athleteId?: number, prospectId?: number) => dispatch({ type: 'SET_OVERLAY', overlay, athleteId, prospectId }), []);
  const closeOverlay    = useCallback(() => dispatch({ type: 'SET_OVERLAY', overlay: null }), []);
  const startRace       = useCallback(() => dispatch({ type: 'RACE_START' }), []);
  const stroke          = useCallback(() => dispatch({ type: 'RACE_STROKE' }), []);
  const breathe         = useCallback(() => dispatch({ type: 'RACE_BREATHE' }), []);
  const surge           = useCallback(() => dispatch({ type: 'RACE_SURGE' }), []);
  const setPitch        = useCallback((pitch: number) => dispatch({ type: 'RACE_SET_PITCH', pitch }), []);
  const resetRace       = useCallback(() => dispatch({ type: 'RACE_RESET' }), []);
  const formatBudget    = useCallback((amount: number) => `$${(amount / 1000000).toFixed(2)}M`, []);

  return (
    <GameContext.Provider value={{
      state, dispatch,
      recoverAthlete, scoutProspect, signProspect, toggleSetting, authorizeFunding,
      openOverlay, closeOverlay, startRace, stroke, breathe, surge, setPitch, resetRace, formatBudget,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameStore(): GameContextType {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGameStore must be used within GameProvider');
  return ctx;
}
