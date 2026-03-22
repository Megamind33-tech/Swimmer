/**
 * clubRoster.ts — Shared club roster state via localStorage
 *
 * Signed athletes from the Transfer Market are persisted here
 * and automatically reflected in Club Management.
 */
import { useState, useEffect } from 'react';
import {
  applyTrainingSession,
  calculateOvrFromStats,
  createBalancedStats,
  createDevelopmentProfile,
  ensureDevelopment,
  recoverAthlete,
  type AthleteDevelopmentProfile,
  type DevelopmentStats,
  type TrainingFocus,
  type TrainingSessionResult,
} from './trainingSystem';

const STORAGE_KEY = 'swim26_club_signed_athletes';
const ROSTER_EVENT = 'swim26_roster_changed';

export interface SignedAthlete {
  id: string;
  name: string;
  age: number;
  ovr: number;
  baseOvr: number;
  peakOvr: number;
  stroke: string;
  nationality: string;
  flag: string;
  club: string; // original club before signing
  status: 'free' | 'attached';
  price: number;
  tier: 'LOCAL' | 'CONTINENTAL' | 'INTERNATIONAL';
  stats: DevelopmentStats;
  development: AthleteDevelopmentProfile;
  signedAt: number;
}

function getStrokeBias(stroke: string): Partial<DevelopmentStats> {
  const lower = stroke.toLowerCase();
  if (lower.includes('sprint') || lower.includes('freestyle')) return { speed: 3, technique: 1 };
  if (lower.includes('distance')) return { stamina: 3, endurance: 3 };
  if (lower.includes('breast')) return { technique: 2, mental: 1 };
  if (lower.includes('butterfly')) return { speed: 2, endurance: 1 };
  if (lower.includes('im') || lower.includes('medley')) return { technique: 2, endurance: 2, mental: 2 };
  return { technique: 1 };
}

function normalizeAthlete(athlete: SignedAthlete): SignedAthlete {
  const normalized = ensureDevelopment(
    {
      id: athlete.id,
      name: athlete.name,
      ovr: athlete.ovr,
      stats: athlete.stats ?? createBalancedStats(athlete.ovr, getStrokeBias(athlete.stroke)),
      development: athlete.development,
    },
    athlete.age,
  );

  return {
    ...athlete,
    stats: normalized.stats,
    ovr: calculateOvrFromStats(normalized.stats),
    peakOvr: Math.max(athlete.peakOvr ?? normalized.development!.potential, normalized.development!.potential),
    development: normalized.development!,
  };
}

/** Read the current signed roster from localStorage (sync). */
export function getSignedAthletes(): SignedAthlete[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const roster = raw ? (JSON.parse(raw) as SignedAthlete[]) : [];
    return roster.map(normalizeAthlete);
  } catch {
    return [];
  }
}

/** Check if an athlete is already on the roster. */
export function isAthleteSign(id: string): boolean {
  return getSignedAthletes().some((a) => a.id === id);
}

/** Sign an athlete: saves to localStorage and fires an event so all tabs update. */
export function signAthlete(athlete: Omit<SignedAthlete, 'signedAt' | 'stats' | 'development' | 'baseOvr' | 'peakOvr' | 'ovr'> & { ovr: number }): void {
  const current = getSignedAthletes();
  if (current.find((a) => a.id === athlete.id)) return;

  const stats = createBalancedStats(athlete.ovr, getStrokeBias(athlete.stroke));
  const development = createDevelopmentProfile(athlete.age, athlete.ovr);
  const signed = normalizeAthlete({
    ...athlete,
    ovr: athlete.ovr,
    baseOvr: athlete.ovr,
    peakOvr: development.potential,
    stats,
    development,
    signedAt: Date.now(),
  });

  const updated: SignedAthlete[] = [...current, signed];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent(ROSTER_EVENT));
}

export function updateSignedAthlete(updatedAthlete: SignedAthlete): void {
  const updated = getSignedAthletes().map((athlete) =>
    athlete.id === updatedAthlete.id ? normalizeAthlete(updatedAthlete) : athlete,
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent(ROSTER_EVENT));
}

export function trainSignedAthlete(id: string, focus: TrainingFocus, minutes: number): TrainingSessionResult<SignedAthlete> | null {
  const roster = getSignedAthletes();
  const athlete = roster.find((entry) => entry.id === id);
  if (!athlete) return null;

  const result = applyTrainingSession(normalizeAthlete(athlete), focus, minutes);
  updateSignedAthlete(result.athlete);
  return { ...result, athlete: normalizeAthlete(result.athlete) };
}

export function recoverSignedAthlete(id: string, hours: number): SignedAthlete | null {
  const roster = getSignedAthletes();
  const athlete = roster.find((entry) => entry.id === id);
  if (!athlete) return null;

  const recovered = normalizeAthlete(recoverAthlete(athlete, hours));
  updateSignedAthlete(recovered);
  return recovered;
}

/** React hook — returns the live roster; re-renders whenever it changes. */
export function useClubRoster(): SignedAthlete[] {
  const [roster, setRoster] = useState<SignedAthlete[]>(() => getSignedAthletes());

  useEffect(() => {
    const refresh = () => setRoster(getSignedAthletes());
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) refresh();
    };

    window.addEventListener(ROSTER_EVENT, refresh);
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener(ROSTER_EVENT, refresh);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return roster;
}

/** Hook — returns signed IDs as a Set for O(1) lookup. */
export function useSignedIds(): Set<string> {
  const roster = useClubRoster();
  return new Set(roster.map((a) => a.id));
}
