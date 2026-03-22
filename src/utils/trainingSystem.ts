import { clamp, deepClone, randomBetween } from './index';

export type TrainingFocus =
  | 'STARTS'
  | 'TURNS'
  | 'STROKE'
  | 'ENDURANCE'
  | 'PACE'
  | 'POWER'
  | 'RECOVERY';

export interface DevelopmentStats {
  speed: number;
  stamina: number;
  technique: number;
  endurance: number;
  mental: number;
}

export interface AthleteDevelopmentProfile {
  age: number;
  energy: number;
  fatigue: number;
  racePower: number;
  sharpness: number;
  discipline: number;
  momentum: number;
  trainingLoad: number;
  potential: number;
  sessionsCompleted: number;
  lastFocus: TrainingFocus | null;
  lastUpdatedAt: number;
}

export interface TrainableAthlete {
  id: string;
  name: string;
  ovr: number;
  stats: DevelopmentStats;
  development?: AthleteDevelopmentProfile;
}

export interface TrainingProgram {
  id: TrainingFocus;
  label: string;
  summary: string;
  recommendedMinutes: number;
  primaryBenefit: string;
  downside: string;
  statWeights: DevelopmentStats;
  baseGain: number;
  energyCost: number;
  fatigueCost: number;
  powerCost: number;
  sharpnessGain: number;
}

export interface TrainingDelta {
  speed: number;
  stamina: number;
  technique: number;
  endurance: number;
  mental: number;
  ovr: number;
  energy: number;
  fatigue: number;
  racePower: number;
  sharpness: number;
  trainingLoad: number;
  momentum: number;
}

export interface TrainingSessionResult<T extends TrainableAthlete> {
  athlete: T;
  delta: TrainingDelta;
  program: TrainingProgram;
  overworked: boolean;
  readiness: number;
  summary: string[];
}

export interface NpcAcademyAthlete extends TrainableAthlete {
  nation: string;
  archetype: string;
}

export const TRAINING_PROGRAMS: Record<TrainingFocus, TrainingProgram> = {
  STARTS: {
    id: 'STARTS',
    label: 'Starts',
    summary: 'Explosive reaction work for faster launch and breakout speed.',
    recommendedMinutes: 45,
    primaryBenefit: 'Speed + technique gains for sprint openings.',
    downside: 'Heavy neural work drains energy and can flatten race power if stacked.',
    statWeights: { speed: 1.3, stamina: 0.2, technique: 0.7, endurance: 0.2, mental: 0.2 },
    baseGain: 0.32,
    energyCost: 13,
    fatigueCost: 11,
    powerCost: 8,
    sharpnessGain: 4,
  },
  TURNS: {
    id: 'TURNS',
    label: 'Turns',
    summary: 'Flip timing, walls, push-offs, and stroke count efficiency.',
    recommendedMinutes: 55,
    primaryBenefit: 'Technique + speed gains with race-efficiency carryover.',
    downside: 'Too many reps spike fatigue and reduce next-race sharpness.',
    statWeights: { speed: 0.7, stamina: 0.3, technique: 1.2, endurance: 0.4, mental: 0.2 },
    baseGain: 0.28,
    energyCost: 10,
    fatigueCost: 10,
    powerCost: 6,
    sharpnessGain: 3,
  },
  STROKE: {
    id: 'STROKE',
    label: 'Stroke Rate',
    summary: 'Technique block for cleaner mechanics and more efficient pacing.',
    recommendedMinutes: 60,
    primaryBenefit: 'Technique + endurance gains with low injury risk.',
    downside: 'Long technical sessions still tax concentration and sharpness.',
    statWeights: { speed: 0.3, stamina: 0.5, technique: 1.3, endurance: 0.6, mental: 0.4 },
    baseGain: 0.27,
    energyCost: 9,
    fatigueCost: 8,
    powerCost: 4,
    sharpnessGain: 2,
  },
  ENDURANCE: {
    id: 'ENDURANCE',
    label: 'Endurance',
    summary: 'Aerobic threshold volume that expands stamina and repeatability.',
    recommendedMinutes: 80,
    primaryBenefit: 'Large stamina + endurance growth for middle and long events.',
    downside: 'Big volume rapidly drains energy and temporarily cuts race power.',
    statWeights: { speed: 0.1, stamina: 1.5, technique: 0.3, endurance: 1.2, mental: 0.4 },
    baseGain: 0.34,
    energyCost: 18,
    fatigueCost: 16,
    powerCost: 11,
    sharpnessGain: 1,
  },
  PACE: {
    id: 'PACE',
    label: 'Pace Control',
    summary: 'Race modeling with split discipline, restraint, and finishing judgement.',
    recommendedMinutes: 50,
    primaryBenefit: 'Endurance + mental gains with better race-day decisions.',
    downside: 'Too much pace work can leave the swimmer flat if recovery is ignored.',
    statWeights: { speed: 0.2, stamina: 0.6, technique: 0.5, endurance: 0.9, mental: 1.0 },
    baseGain: 0.29,
    energyCost: 11,
    fatigueCost: 9,
    powerCost: 5,
    sharpnessGain: 3,
  },
  POWER: {
    id: 'POWER',
    label: 'Power',
    summary: 'Resistance work and fast-twitch loading for top-end propulsion.',
    recommendedMinutes: 50,
    primaryBenefit: 'Speed growth and higher race pop when managed well.',
    downside: 'Most punishing session for energy and temporary power if overused.',
    statWeights: { speed: 1.2, stamina: 0.2, technique: 0.4, endurance: 0.3, mental: 0.3 },
    baseGain: 0.31,
    energyCost: 15,
    fatigueCost: 13,
    powerCost: 12,
    sharpnessGain: 2,
  },
  RECOVERY: {
    id: 'RECOVERY',
    label: 'Recovery',
    summary: 'Mobility, easy laps, and nervous-system reset work.',
    recommendedMinutes: 35,
    primaryBenefit: 'Restores energy, race power, and the ability to absorb training.',
    downside: 'Minimal raw growth compared with hard sessions.',
    statWeights: { speed: 0.05, stamina: 0.15, technique: 0.1, endurance: 0.2, mental: 0.35 },
    baseGain: 0.08,
    energyCost: -18,
    fatigueCost: -20,
    powerCost: -14,
    sharpnessGain: 5,
  },
};

const NPC_STORAGE_KEY = 'swim26_training_npc_academy';
const STAT_KEYS: Array<keyof DevelopmentStats> = ['speed', 'stamina', 'technique', 'endurance', 'mental'];

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calculateOvrFromStats(stats: DevelopmentStats): number {
  return Math.round(
    stats.speed * 0.27 +
      stats.stamina * 0.24 +
      stats.technique * 0.22 +
      stats.endurance * 0.17 +
      stats.mental * 0.1
  );
}

export function estimatePotential(age: number, ovr: number): number {
  const ageBonus = age <= 19 ? 11 : age <= 22 ? 8 : age <= 25 ? 5 : age <= 29 ? 2 : -2;
  return clamp(Math.round(ovr + ageBonus + randomBetween(2, 7)), Math.max(ovr + 2, 60), 99);
}

export function createBalancedStats(ovr: number, bias: Partial<DevelopmentStats> = {}): DevelopmentStats {
  const base = clamp(ovr, 35, 99);
  const stats: DevelopmentStats = {
    speed: round2(clamp(base + randomBetween(-4, 4) + (bias.speed ?? 0), 30, 99)),
    stamina: round2(clamp(base + randomBetween(-4, 4) + (bias.stamina ?? 0), 30, 99)),
    technique: round2(clamp(base + randomBetween(-4, 4) + (bias.technique ?? 0), 30, 99)),
    endurance: round2(clamp(base + randomBetween(-4, 4) + (bias.endurance ?? 0), 30, 99)),
    mental: round2(clamp(base + randomBetween(-4, 4) + (bias.mental ?? 0), 30, 99)),
  };

  return normalizeStatsToTarget(stats, base);
}

function normalizeStatsToTarget(stats: DevelopmentStats, targetOvr: number): DevelopmentStats {
  const currentOvr = calculateOvrFromStats(stats);
  const delta = targetOvr - currentOvr;
  if (Math.abs(delta) < 1) return stats;

  return {
    speed: round2(clamp(stats.speed + delta * 0.35, 30, 99)),
    stamina: round2(clamp(stats.stamina + delta * 0.3, 30, 99)),
    technique: round2(clamp(stats.technique + delta * 0.25, 30, 99)),
    endurance: round2(clamp(stats.endurance + delta * 0.2, 30, 99)),
    mental: round2(clamp(stats.mental + delta * 0.12, 30, 99)),
  };
}

export function createDevelopmentProfile(age: number, ovr: number, potential?: number): AthleteDevelopmentProfile {
  return {
    age,
    energy: clamp(86 - Math.max(0, age - 24), 68, 95),
    fatigue: clamp(18 + Math.max(0, ovr - 82) * 0.15, 10, 35),
    racePower: 100,
    sharpness: 56,
    discipline: clamp(58 + randomBetween(-8, 10), 40, 80),
    momentum: 0,
    trainingLoad: 24,
    potential: potential ?? estimatePotential(age, ovr),
    sessionsCompleted: 0,
    lastFocus: null,
    lastUpdatedAt: Date.now(),
  };
}

export function ensureDevelopment(athlete: TrainableAthlete, age = 21): TrainableAthlete {
  const stats = athlete.stats ? deepClone(athlete.stats) : createBalancedStats(athlete.ovr);
  const ovr = athlete.ovr || calculateOvrFromStats(stats);
  return {
    ...athlete,
    stats: normalizeStatsToTarget(stats, ovr),
    ovr,
    development: athlete.development
      ? {
          ...athlete.development,
          age: athlete.development.age ?? age,
          energy: clamp(athlete.development.energy ?? 80, 0, 100),
          fatigue: clamp(athlete.development.fatigue ?? 20, 0, 100),
          racePower: clamp(athlete.development.racePower ?? 100, 60, 110),
          sharpness: clamp(athlete.development.sharpness ?? 55, 0, 100),
          discipline: clamp(athlete.development.discipline ?? 60, 30, 95),
          momentum: clamp(athlete.development.momentum ?? 0, -20, 20),
          trainingLoad: clamp(athlete.development.trainingLoad ?? 25, 0, 100),
          potential: clamp(athlete.development.potential ?? estimatePotential(age, ovr), ovr + 1, 99),
          sessionsCompleted: athlete.development.sessionsCompleted ?? 0,
          lastFocus: athlete.development.lastFocus ?? null,
          lastUpdatedAt: athlete.development.lastUpdatedAt ?? Date.now(),
        }
      : createDevelopmentProfile(age, ovr),
  };
}

export function recoverAthlete<T extends TrainableAthlete>(athlete: T, hours: number): T {
  const normalized = ensureDevelopment(athlete, athlete.development?.age ?? 21) as T;
  const development = normalized.development!;
  const recoveryScale = Math.max(0, hours) / 24;
  if (recoveryScale <= 0) return normalized;

  development.energy = round2(clamp(development.energy + 22 * recoveryScale + development.discipline * 0.03 * recoveryScale, 0, 100));
  development.fatigue = round2(clamp(development.fatigue - 24 * recoveryScale, 0, 100));
  development.racePower = round2(clamp(development.racePower + 10 * recoveryScale, 60, 110));
  development.trainingLoad = round2(clamp(development.trainingLoad - 18 * recoveryScale, 0, 100));
  development.sharpness = round2(clamp(development.sharpness + 4 * recoveryScale, 0, 100));
  development.momentum = round2(clamp(development.momentum + 1.5 * recoveryScale, -20, 20));
  development.lastUpdatedAt = Date.now();
  return normalized;
}

function statCap(athlete: TrainableAthlete, stat: keyof DevelopmentStats): number {
  const potential = athlete.development?.potential ?? athlete.ovr + 8;
  const specialtyBias: Record<keyof DevelopmentStats, number> = {
    speed: 4,
    stamina: 4,
    technique: 3,
    endurance: 2,
    mental: 1,
  };
  return clamp(potential + specialtyBias[stat], 55, 99);
}

export function getReadinessScore(profile: AthleteDevelopmentProfile): number {
  return round2(clamp(profile.energy * 0.55 + (100 - profile.fatigue) * 0.25 + profile.racePower * 0.15 + profile.sharpness * 0.05, 0, 100));
}

export function getReadinessLabel(profile: AthleteDevelopmentProfile): string {
  const readiness = getReadinessScore(profile);
  if (readiness >= 82) return 'Primed';
  if (readiness >= 68) return 'Stable';
  if (readiness >= 52) return 'Heavy';
  return 'Overworked';
}

export function applyTrainingSession<T extends TrainableAthlete>(athlete: T, focus: TrainingFocus, minutes: number): TrainingSessionResult<T> {
  const normalized = ensureDevelopment(athlete, athlete.development?.age ?? 21) as T;
  const profile = normalized.development!;
  const program = TRAINING_PROGRAMS[focus];
  const durationFactor = clamp(minutes / program.recommendedMinutes, 0.55, 1.85);
  const headroom = clamp((profile.potential - normalized.ovr) / Math.max(8, profile.potential - 45), 0.06, 1);
  const freshness = clamp(profile.energy / 100, 0.35, 1.05);
  const fatigueResistance = clamp((100 - profile.fatigue) / 100, 0.25, 1.05);
  const ageFactor = profile.age <= 20 ? 1.08 : profile.age <= 24 ? 1.03 : profile.age <= 28 ? 0.94 : 0.82;
  const disciplineFactor = 0.9 + profile.discipline / 300;
  const loadPenalty = clamp(1 - Math.max(0, profile.trainingLoad - 58) / 85, 0.45, 1);
  const adaptation = program.baseGain * durationFactor * headroom * freshness * fatigueResistance * ageFactor * disciplineFactor * loadPenalty;

  const previous = {
    stats: deepClone(normalized.stats),
    ovr: normalized.ovr,
    energy: profile.energy,
    fatigue: profile.fatigue,
    racePower: profile.racePower,
    sharpness: profile.sharpness,
    trainingLoad: profile.trainingLoad,
    momentum: profile.momentum,
  };

  STAT_KEYS.forEach((stat) => {
    const weightedGain = adaptation * program.statWeights[stat];
    const current = normalized.stats[stat];
    const cap = statCap(normalized, stat);
    const proximityPenalty = clamp(1 - Math.max(0, current - (cap - 8)) / 14, 0.18, 1);
    const gain = weightedGain * proximityPenalty;
    normalized.stats[stat] = round2(clamp(current + gain, 30, cap));
  });

  const energyMultiplier = 1 + Math.max(0, durationFactor - 1) * 0.65 + profile.trainingLoad / 220;
  const fatigueMultiplier = 1 + Math.max(0, durationFactor - 1) * 0.8;
  profile.energy = round2(clamp(profile.energy - program.energyCost * energyMultiplier, 0, 100));
  profile.fatigue = round2(clamp(profile.fatigue + program.fatigueCost * fatigueMultiplier, 0, 100));
  profile.racePower = round2(clamp(profile.racePower - program.powerCost * energyMultiplier, 60, 110));
  profile.sharpness = round2(clamp(profile.sharpness + program.sharpnessGain - Math.max(0, durationFactor - 1) * 3, 0, 100));
  profile.trainingLoad = round2(clamp(profile.trainingLoad + Math.max(4, program.fatigueCost * 0.9) * durationFactor, 0, 100));
  profile.momentum = round2(clamp(profile.momentum + adaptation * 8 - Math.max(0, profile.fatigue - 74) * 0.07, -20, 20));
  profile.sessionsCompleted += 1;
  profile.lastFocus = focus;
  profile.lastUpdatedAt = Date.now();

  if (program.id === 'RECOVERY') {
    profile.energy = round2(clamp(profile.energy + 12 * durationFactor, 0, 100));
    profile.fatigue = round2(clamp(profile.fatigue - 18 * durationFactor, 0, 100));
    profile.racePower = round2(clamp(profile.racePower + 10 * durationFactor, 60, 110));
    profile.trainingLoad = round2(clamp(profile.trainingLoad - 20 * durationFactor, 0, 100));
  }

  if (profile.fatigue > 78 || profile.energy < 28) {
    normalized.stats.speed = round2(clamp(normalized.stats.speed - 0.08, 30, statCap(normalized, 'speed')));
    normalized.stats.mental = round2(clamp(normalized.stats.mental - 0.05, 30, statCap(normalized, 'mental')));
    profile.momentum = round2(clamp(profile.momentum - 1.8, -20, 20));
    profile.racePower = round2(clamp(profile.racePower - 4, 60, 110));
  }

  normalized.ovr = calculateOvrFromStats(normalized.stats);
  const readiness = getReadinessScore(profile);
  const overworked = profile.fatigue >= 78 || profile.energy <= 28 || profile.trainingLoad >= 82;

  const delta: TrainingDelta = {
    speed: round2(normalized.stats.speed - previous.stats.speed),
    stamina: round2(normalized.stats.stamina - previous.stats.stamina),
    technique: round2(normalized.stats.technique - previous.stats.technique),
    endurance: round2(normalized.stats.endurance - previous.stats.endurance),
    mental: round2(normalized.stats.mental - previous.stats.mental),
    ovr: normalized.ovr - previous.ovr,
    energy: round2(profile.energy - previous.energy),
    fatigue: round2(profile.fatigue - previous.fatigue),
    racePower: round2(profile.racePower - previous.racePower),
    sharpness: round2(profile.sharpness - previous.sharpness),
    trainingLoad: round2(profile.trainingLoad - previous.trainingLoad),
    momentum: round2(profile.momentum - previous.momentum),
  };

  const summary = [
    `${program.label} pushed ${normalized.name} toward ${profile.potential} potential with ${Math.max(0, delta.ovr)} OVR growth pressure.`,
    delta.energy < 0 ? `Energy ${delta.energy.toFixed(1)} and race power ${delta.racePower.toFixed(1)} reflect the session cost.` : `Recovery restored energy and absorbed previous workload.`,
    overworked
      ? `${normalized.name} is overworked. A recovery block or lighter week is now the optimal call.`
      : `${normalized.name} remains ${getReadinessLabel(profile).toLowerCase()} for the next race window.`,
  ];

  return { athlete: normalized, delta, program, overworked, readiness, summary };
}

const DEFAULT_NPCS: Array<Pick<NpcAcademyAthlete, 'id' | 'name' | 'nation' | 'archetype' | 'ovr'>> = [
  { id: 'npc_1', name: 'Maya Okeke', nation: 'Nigeria', archetype: 'Sprinter', ovr: 71 },
  { id: 'npc_2', name: 'Lina van Wyk', nation: 'South Africa', archetype: 'Technician', ovr: 76 },
  { id: 'npc_3', name: 'Hiro Tan', nation: 'Singapore', archetype: 'Distance', ovr: 68 },
  { id: 'npc_4', name: 'Noah Costa', nation: 'Brazil', archetype: 'All-rounder', ovr: 74 },
  { id: 'npc_5', name: 'Jules Martin', nation: 'France', archetype: 'Turns specialist', ovr: 65 },
];

function createNpcAthlete(seed: Pick<NpcAcademyAthlete, 'id' | 'name' | 'nation' | 'archetype' | 'ovr'>): NpcAcademyAthlete {
  const stats = createBalancedStats(seed.ovr, seed.archetype.includes('Distance') ? { stamina: 3, endurance: 2 } : seed.archetype.includes('Sprinter') ? { speed: 3 } : seed.archetype.includes('Technician') ? { technique: 3 } : {});
  return ensureDevelopment({
    ...seed,
    stats,
    development: createDevelopmentProfile(17 + Math.floor(randomBetween(0, 6)), seed.ovr, clamp(seed.ovr + 10 + randomBetween(0, 8), seed.ovr + 4, 96)),
  }, 20) as NpcAcademyAthlete;
}

function readNpcAcademy(): NpcAcademyAthlete[] {
  try {
    const saved = localStorage.getItem(NPC_STORAGE_KEY);
    if (saved) {
      return (JSON.parse(saved) as NpcAcademyAthlete[]).map((athlete) => ensureDevelopment(athlete, athlete.development?.age ?? 20) as NpcAcademyAthlete);
    }
  } catch {
    // ignore storage failures
  }
  return DEFAULT_NPCS.map(createNpcAthlete);
}

function saveNpcAcademy(academy: NpcAcademyAthlete[]): void {
  try {
    localStorage.setItem(NPC_STORAGE_KEY, JSON.stringify(academy));
  } catch {
    // ignore storage failures
  }
}

export function getNpcAcademySnapshot(): NpcAcademyAthlete[] {
  const academy = readNpcAcademy();
  saveNpcAcademy(academy);
  return academy;
}

export function simulateNpcAcademy(days = 7): NpcAcademyAthlete[] {
  const academy = readNpcAcademy();
  const focuses: TrainingFocus[] = ['STARTS', 'TURNS', 'STROKE', 'ENDURANCE', 'PACE', 'POWER', 'RECOVERY'];
  const updated = academy.map((athlete) => {
    let working = ensureDevelopment(athlete, athlete.development?.age ?? 20) as NpcAcademyAthlete;
    for (let day = 0; day < days; day++) {
      const focus = focuses[Math.floor(randomBetween(0, focuses.length))] ?? 'RECOVERY';
      const minutes = focus === 'RECOVERY' ? 30 + Math.round(randomBetween(0, 15)) : 40 + Math.round(randomBetween(0, 45));
      working = applyTrainingSession(working, focus, minutes).athlete;
      working = recoverAthlete(working, 16);
    }
    return working;
  });
  saveNpcAcademy(updated);
  return updated;
}
