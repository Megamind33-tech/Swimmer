/**
 * clubRoster.ts — Shared club roster state via localStorage
 *
 * Signed athletes from the Transfer Market are persisted here
 * and automatically reflected in Club Management.
 */
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'swim26_club_signed_athletes';
const ROSTER_EVENT = 'swim26_roster_changed';

export interface SignedAthlete {
  id: string;
  name: string;
  age: number;
  ovr: number;
  stroke: string;
  nationality: string;
  flag: string;
  club: string; // original club before signing
  status: 'free' | 'attached';
  price: number;
  tier: 'LOCAL' | 'CONTINENTAL' | 'INTERNATIONAL';
  signedAt: number;
}

/** Read the current signed roster from localStorage (sync). */
export function getSignedAthletes(): SignedAthlete[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SignedAthlete[]) : [];
  } catch {
    return [];
  }
}

/** Check if an athlete is already on the roster. */
export function isAthleteSign(id: string): boolean {
  return getSignedAthletes().some((a) => a.id === id);
}

/** Sign an athlete: saves to localStorage and fires an event so all tabs update. */
export function signAthlete(athlete: Omit<SignedAthlete, 'signedAt'>): void {
  const current = getSignedAthletes();
  if (current.find((a) => a.id === athlete.id)) return;
  const updated: SignedAthlete[] = [
    ...current,
    { ...athlete, signedAt: Date.now() },
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent(ROSTER_EVENT));
}

/** React hook — returns the live roster; re-renders whenever it changes. */
export function useClubRoster(): SignedAthlete[] {
  const [roster, setRoster] = useState<SignedAthlete[]>(() => getSignedAthletes());

  useEffect(() => {
    const refresh = () => setRoster(getSignedAthletes());

    // Listen for changes from other components in the same tab
    window.addEventListener(ROSTER_EVENT, refresh);
    // Also sync across browser tabs via storage event
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) refresh();
    });

    return () => {
      window.removeEventListener(ROSTER_EVENT, refresh);
    };
  }, []);

  return roster;
}

/** Hook — returns signed IDs as a Set for O(1) lookup. */
export function useSignedIds(): Set<string> {
  const roster = useClubRoster();
  return new Set(roster.map((a) => a.id));
}
