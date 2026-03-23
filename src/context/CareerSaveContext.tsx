/**
 * CareerSaveContext — Persistent game state for both career modes
 * Athlete Career: training decisions, race history, rivals, sponsors, form
 * Club Career: roster, staff, budget, facilities, competitions, development
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'

// ─── Athlete Career ───────────────────────────────────────────────────────────

export type FormLevel = 'cold' | 'normal' | 'hot' | 'peak'
export type TrainingFocusId = 'sharpness' | 'volume' | 'technique' | 'recovery' | 'mental'
export type RivalIntensity = 'stable' | 'heated' | 'peak'
export type SponsorStatus = 'offered' | 'active' | 'expired' | 'rejected'

export interface AthleteRival {
  id: string
  name: string
  title: string
  wins: number   // player wins against this rival
  losses: number // player losses against this rival
  intensity: RivalIntensity
  lastResult?: 'won' | 'lost'
  taunt?: string
}

export interface AthleteSponsor {
  id: string
  brand: string
  status: SponsorStatus
  valueCoins: number
  valueSP: number
  condition: string
  conditionProgress: number // 0-100
  weeksLeft: number
}

export interface CareerRaceResult {
  eventId: string
  eventName: string
  rank: number
  time: string
  cutMet: boolean
  xpEarned: number
  coinsEarned: number
  week: number
  storyOutcome?: string
}

export interface StoryMoment {
  id: string
  type: 'coach' | 'rival' | 'media' | 'selection' | 'sponsor' | 'milestone'
  title: string
  body: string
  week: number
  read: boolean
  actionLabel?: string
  actionId?: string
}

export interface AthleteCareerState {
  // Core stats - affected by training
  speed: number         // 1-100
  stamina: number       // 1-100
  technique: number     // 1-100
  mental: number        // 1-100
  turns: number         // 1-100
  // Form & readiness
  form: FormLevel
  readiness: number     // 0-100
  coachTrust: number    // 0-100
  momentum: number      // -30 to +30
  // Progression
  careerStageId: string
  currentEventIdx: number
  completedEventIds: string[]
  xp: number
  coins: number
  reputation: number
  // Season
  currentWeek: number
  totalWeeks: number
  trainingFocusId: TrainingFocusId
  trainingsThisWeek: number
  // Relationships
  rivals: AthleteRival[]
  sponsors: AthleteSponsor[]
  // History & story
  raceHistory: CareerRaceResult[]
  storyMoments: StoryMoment[]
  // Status flags
  initialized: boolean
  needsWeeklyDecision: boolean
  pendingRaceEventId?: string
}

// ─── Club Career ─────────────────────────────────────────────────────────────

export type PhilosophyId = 'sprint-lab' | 'relay-factory' | 'endurance-engine'
export type FacilityType = 'pool' | 'gym' | 'recovery' | 'academy' | 'media'

export interface ClubAthlete {
  id: string
  name: string
  age: number
  ovr: number
  potential: number    // max OVR they can reach
  stroke: string
  country: string
  speed: number
  stamina: number
  technique: number
  turns: number
  form: FormLevel
  readiness: number
  morale: number        // 0-100
  weeklyWage: number    // coins
  trainingFocusId?: TrainingFocusId
  developmentProgress: number // 0-100 toward next OVR point
  isAcademy: boolean
  isStar: boolean
  raceCount: number
}

export interface ClubStaff {
  id: string
  name: string
  role: string
  level: number         // 1-5
  salary: number        // coins/week
  boost: string
  boostValue: number    // numeric effect
  hired: boolean
}

export interface ClubFacility {
  type: FacilityType
  level: number         // 0-5
  upgradeCost: number
  effect: string
}

export interface CompetitionEntry {
  id: string
  name: string
  week: number
  stakes: string
  entered: boolean
  lineup: string[]      // athlete ids
  result?: {
    position: number
    totalTeams: number
    medalsWon: number
    xpEarned: number
    prestigeGained: number
    coinsWon: number
  }
}

export interface TransferTarget {
  id: string
  name: string
  age: number
  ovr: number
  potential: number
  stroke: string
  country: string
  price: number
  weeklyWage: number
  available: boolean
}

export interface ClubCareerState {
  // Club identity
  clubName: string
  philosophyId: PhilosophyId
  prestige: number      // 0-100
  reputation: number    // 0-1000
  // Finances
  budget: number
  weeklyWages: number   // total weekly outgoing
  weeklyIncome: number  // from sponsors + prizes
  // Season
  currentWeek: number
  totalWeeks: number
  season: number
  // People
  roster: ClubAthlete[]
  staff: ClubStaff[]
  // Infrastructure
  facilities: ClubFacility[]
  // Competition
  competitions: CompetitionEntry[]
  // Transfer market
  transferTargets: TransferTarget[]
  // History
  trophies: { name: string; season: number; week: number }[]
  seasonResults: { season: number; position: number; totalTeams: number; medals: number }[]
  // Status
  initialized: boolean
  pendingDecisions: string[]
}

// ─── Full save ────────────────────────────────────────────────────────────────

export interface CareerSave {
  athleteCareer: AthleteCareerState
  clubCareer: ClubCareerState
  saveVersion: number
  lastSaved: number
}

// ─── Actions ─────────────────────────────────────────────────────────────────

type CareerAction =
  // Athlete actions
  | { type: 'ATHLETE_SET_TRAINING_FOCUS'; focusId: TrainingFocusId }
  | { type: 'ATHLETE_COMPLETE_TRAINING' }
  | { type: 'ATHLETE_RECORD_RACE'; result: CareerRaceResult }
  | { type: 'ATHLETE_ADVANCE_WEEK' }
  | { type: 'ATHLETE_ACCEPT_SPONSOR'; sponsorId: string }
  | { type: 'ATHLETE_REJECT_SPONSOR'; sponsorId: string }
  | { type: 'ATHLETE_MARK_STORY_READ'; momentId: string }
  | { type: 'ATHLETE_ADD_STORY'; moment: StoryMoment }
  | { type: 'ATHLETE_SET_PENDING_RACE'; eventId: string | undefined }
  // Club actions
  | { type: 'CLUB_SIGN_PLAYER'; athleteId: string }
  | { type: 'CLUB_RELEASE_PLAYER'; athleteId: string }
  | { type: 'CLUB_SET_PHILOSOPHY'; philosophyId: PhilosophyId }
  | { type: 'CLUB_HIRE_STAFF'; staffId: string }
  | { type: 'CLUB_UPGRADE_FACILITY'; facilityType: FacilityType }
  | { type: 'CLUB_SET_ATHLETE_TRAINING'; athleteId: string; focusId: TrainingFocusId }
  | { type: 'CLUB_SET_COMPETITION_LINEUP'; compId: string; lineup: string[] }
  | { type: 'CLUB_ENTER_COMPETITION'; compId: string }
  | { type: 'CLUB_ADVANCE_WEEK' }
  | { type: 'CLUB_RECORD_COMPETITION_RESULT'; compId: string; result: CompetitionEntry['result'] }

// ─── Default state factories ──────────────────────────────────────────────────

function createDefaultAthleteState(): AthleteCareerState {
  return {
    speed: 62,
    stamina: 58,
    technique: 55,
    mental: 60,
    turns: 50,
    form: 'normal',
    readiness: 78,
    coachTrust: 72,
    momentum: 8,
    careerStageId: 'regional',
    currentEventIdx: 3,
    completedEventIds: ['pc_01', 'pc_02', 'pc_03'],
    xp: 2267,
    coins: 18400,
    reputation: 340,
    currentWeek: 4,
    totalWeeks: 20,
    trainingFocusId: 'sharpness',
    trainingsThisWeek: 0,
    rivals: [
      { id: 'rv1', name: 'Amara Dube', title: 'Regional sprint nemesis', wins: 1, losses: 2, intensity: 'heated', taunt: 'Your back-half is still slower than mine on a bad day.' },
      { id: 'rv2', name: 'Mina Okafor', title: 'Relay anchor challenger', wins: 2, losses: 1, intensity: 'stable', taunt: 'The anchor spot belongs to whoever trains hardest this week.' },
      { id: 'rv3', name: 'Jules Laurent', title: 'Junior elite benchmark', wins: 0, losses: 0, intensity: 'peak', taunt: 'When we finally race, bring your A-game. I will bring mine.' },
    ],
    sponsors: [
      { id: 'sp1', brand: 'AquaPulse', status: 'active', valueCoins: 5000, valueSP: 0, condition: 'Race weekly', conditionProgress: 80, weeksLeft: 3 },
      { id: 'sp2', brand: 'BlueCurrent Energy', status: 'offered', valueCoins: 8500, valueSP: 150, condition: 'Reach Tier 3 or hit B-cut', conditionProgress: 92, weeksLeft: 0 },
      { id: 'sp3', brand: 'ProLane Gear', status: 'offered', valueCoins: 12000, valueSP: 0, condition: '2 podium finishes', conditionProgress: 50, weeksLeft: 0 },
    ],
    raceHistory: [
      { eventId: 'pc_01', eventName: 'District 50m Freestyle Final', rank: 2, time: '24.81', cutMet: true, xpEarned: 90, coinsEarned: 300, week: 1, storyOutcome: 'Amara Dube edged you out by 0.06 seconds. The rivalry begins.' },
      { eventId: 'pc_02', eventName: 'School Championship 100m Freestyle', rank: 1, time: '52.44', cutMet: true, xpEarned: 120, coinsEarned: 420, week: 2, storyOutcome: 'First win. Coach Banda nodded — the way he does when he approves.' },
      { eventId: 'pc_03', eventName: 'Club Time Trial Under Lights', rank: 2, time: '51.97', cutMet: true, xpEarned: 150, coinsEarned: 550, week: 3, storyOutcome: 'Split discipline impressed the selectors. Mina is watching you now.' },
    ],
    storyMoments: [
      {
        id: 'sm1',
        type: 'coach',
        title: 'Coach Banda has a message',
        body: 'Your back-half splits are improving but your start reaction is still 0.04 behind the elite average. If you hit the Regional Heats with a clean reaction time this week, I\'ll push your name for the relay consideration list.',
        week: 4,
        read: false,
        actionLabel: 'Train Starts',
        actionId: 'technique',
      },
      {
        id: 'sm2',
        type: 'rival',
        title: 'Amara Dube called you out',
        body: '"I heard you\'re doing extra dry-land this week. Good. You\'ll need it. See you in lane 4 at Regionals — we both know who closes faster."',
        week: 4,
        read: false,
      },
      {
        id: 'sm3',
        type: 'sponsor',
        title: 'BlueCurrent Energy is watching',
        body: 'The BlueCurrent scout messaged your agent: "We need one more strong result at Regionals before we can authorize the deal. The B-cut time is the trigger. Hit it and the contract is yours."',
        week: 4,
        read: false,
        actionLabel: 'Review Offer',
        actionId: 'sp2',
      },
    ],
    initialized: true,
    needsWeeklyDecision: true,
    pendingRaceEventId: undefined,
  }
}

function createDefaultClubState(): ClubCareerState {
  return {
    clubName: 'Lusaka Dolphins',
    philosophyId: 'sprint-lab',
    prestige: 74,
    reputation: 520,
    budget: 285000,
    weeklyWages: 18600,
    weeklyIncome: 22000,
    currentWeek: 4,
    totalWeeks: 20,
    season: 1,
    roster: [
      { id: 'ca1', name: 'Tapiwa Ncube', age: 16, ovr: 72, potential: 88, stroke: 'Butterfly', country: '🇿🇲', speed: 74, stamina: 68, technique: 71, turns: 73, form: 'hot', readiness: 85, morale: 90, weeklyWage: 1200, trainingFocusId: 'sharpness', developmentProgress: 67, isAcademy: false, isStar: false, raceCount: 8 },
      { id: 'ca2', name: 'Lina Sissoko', age: 17, ovr: 78, potential: 91, stroke: 'IM', country: '🇸🇳', speed: 76, stamina: 80, technique: 82, turns: 74, form: 'normal', readiness: 72, morale: 82, weeklyWage: 1800, trainingFocusId: 'technique', developmentProgress: 44, isAcademy: false, isStar: false, raceCount: 14 },
      { id: 'ca3', name: 'Eva Carter', age: 15, ovr: 68, potential: 95, stroke: 'Freestyle', country: '🇬🇧', speed: 65, stamina: 82, technique: 70, turns: 67, form: 'normal', readiness: 90, morale: 88, weeklyWage: 900, trainingFocusId: 'volume', developmentProgress: 28, isAcademy: true, isStar: false, raceCount: 3 },
      { id: 'ca4', name: 'Marcus Webb', age: 21, ovr: 84, potential: 88, stroke: 'Freestyle', country: '🇬🇧', speed: 88, stamina: 82, technique: 83, turns: 86, form: 'hot', readiness: 88, morale: 76, weeklyWage: 4200, trainingFocusId: 'sharpness', developmentProgress: 55, isAcademy: false, isStar: true, raceCount: 47 },
      { id: 'ca5', name: 'Daria Kovalenko', age: 19, ovr: 80, potential: 87, stroke: 'Backstroke', country: '🇺🇦', speed: 79, stamina: 78, technique: 84, turns: 80, form: 'cold', readiness: 61, morale: 68, weeklyWage: 2800, trainingFocusId: 'recovery', developmentProgress: 38, isAcademy: false, isStar: false, raceCount: 22 },
      { id: 'ca6', name: 'Felix Osei', age: 18, ovr: 75, potential: 86, stroke: 'Breaststroke', country: '🇬🇭', speed: 72, stamina: 76, technique: 78, turns: 77, form: 'normal', readiness: 80, morale: 84, weeklyWage: 1500, trainingFocusId: 'technique', developmentProgress: 62, isAcademy: false, isStar: false, raceCount: 18 },
    ],
    staff: [
      { id: 'st1', name: 'Coach Nia Tembo', role: 'Head Coach', level: 3, salary: 5500, boost: 'Finals execution', boostValue: 6, hired: true },
      { id: 'st2', name: 'Dr. Elias Mensah', role: 'Performance Scientist', level: 3, salary: 4200, boost: 'Readiness retention', boostValue: 8, hired: true },
      { id: 'st3', name: 'Marta Volkov', role: 'Academy Director', level: 2, salary: 3100, boost: 'Prospect development', boostValue: 10, hired: false },
      { id: 'st4', name: 'Coach Dario Santos', role: 'Sprint Specialist', level: 4, salary: 6000, boost: 'Speed development', boostValue: 12, hired: false },
      { id: 'st5', name: 'Yuki Tanaka', role: 'Technique Coach', level: 3, salary: 3800, boost: 'Technique ceiling', boostValue: 9, hired: false },
    ],
    facilities: [
      { type: 'pool', level: 3, upgradeCost: 45000, effect: 'Training quality +15%' },
      { type: 'gym', level: 2, upgradeCost: 28000, effect: 'Strength development +10%' },
      { type: 'recovery', level: 1, upgradeCost: 22000, effect: 'Recovery speed +8%' },
      { type: 'academy', level: 2, upgradeCost: 35000, effect: 'Prospect development +12%' },
      { type: 'media', level: 0, upgradeCost: 18000, effect: 'Sponsor appeal +20%' },
    ],
    competitions: [
      { id: 'cc1', name: 'Regional Cup Round 6', week: 5, stakes: 'Protect Top 4 prestige points', entered: false, lineup: [] },
      { id: 'cc2', name: 'National Relay Trials', week: 8, stakes: 'Club-defining federation respect', entered: false, lineup: [] },
      { id: 'cc3', name: 'Sponsor Showcase Night', week: 10, stakes: 'Secure recovery suite funding', entered: false, lineup: [] },
      { id: 'cc4', name: 'Junior National Championships', week: 14, stakes: 'Academy athletes gain national exposure', entered: false, lineup: [] },
      { id: 'cc5', name: 'Season Finals', week: 19, stakes: 'Final prestige rankings and trophy', entered: false, lineup: [] },
    ],
    transferTargets: [
      { id: 'tr1', name: 'Kwame Asante', age: 20, ovr: 86, potential: 90, stroke: 'Freestyle', country: '🇬🇭', price: 85000, weeklyWage: 3800, available: true },
      { id: 'tr2', name: 'Sofia Reyes', age: 18, ovr: 79, potential: 93, stroke: 'Butterfly', country: '🇲🇽', price: 62000, weeklyWage: 2400, available: true },
      { id: 'tr3', name: 'Dmitri Volkov', age: 24, ovr: 91, potential: 93, stroke: 'Backstroke', country: '🇷🇺', price: 140000, weeklyWage: 6500, available: true },
      { id: 'tr4', name: 'Amara Santos', age: 16, ovr: 65, potential: 96, stroke: 'Freestyle', country: '🇧🇷', price: 38000, weeklyWage: 900, available: true },
      { id: 'tr5', name: 'Ingrid Berg', age: 22, ovr: 88, potential: 91, stroke: 'Breaststroke', country: '🇸🇪', price: 110000, weeklyWage: 5200, available: true },
    ],
    trophies: [],
    seasonResults: [],
    initialized: true,
    pendingDecisions: ['choose_competition_lineup', 'assign_training'],
  }
}

function createDefaultSave(): CareerSave {
  return {
    athleteCareer: createDefaultAthleteState(),
    clubCareer: createDefaultClubState(),
    saveVersion: 1,
    lastSaved: Date.now(),
  }
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

const TRAINING_EFFECTS: Record<TrainingFocusId, Partial<AthleteCareerState>> = {
  sharpness: { readiness: 5, mental: 1, speed: 1 },
  volume:    { stamina: 2, readiness: -5, speed: 1 },
  technique: { technique: 2, turns: 2, readiness: -3 },
  recovery:  { readiness: 12, mental: 1 },
  mental:    { mental: 3, coachTrust: 3, readiness: 2 },
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function getFormLevel(readiness: number, momentum: number): FormLevel {
  const score = readiness * 0.6 + (momentum + 30) * 0.4
  if (score >= 80) return 'peak'
  if (score >= 64) return 'hot'
  if (score >= 42) return 'normal'
  return 'cold'
}

function athleteReducer(state: AthleteCareerState, action: CareerAction): AthleteCareerState {
  switch (action.type) {
    case 'ATHLETE_SET_TRAINING_FOCUS':
      return { ...state, trainingFocusId: action.focusId }

    case 'ATHLETE_COMPLETE_TRAINING': {
      const effects = TRAINING_EFFECTS[state.trainingFocusId]
      const newReadiness = clamp((state.readiness + (effects.readiness ?? 0)), 10, 100)
      const newMomentum = clamp(state.momentum + 2, -30, 30)
      const newMental = clamp((state.mental + (effects.mental ?? 0)), 1, 100)
      const newSpeed = clamp((state.speed + (effects.speed ?? 0)), 1, 100)
      const newStamina = clamp((state.stamina + (effects.stamina ?? 0)), 1, 100)
      const newTechnique = clamp((state.technique + (effects.technique ?? 0)), 1, 100)
      const newTurns = clamp((state.turns + (effects.turns ?? 0)), 1, 100)
      const newCoachTrust = clamp((state.coachTrust + (effects.coachTrust ?? 1)), 0, 100)
      const newForm = getFormLevel(newReadiness, newMomentum)
      return {
        ...state,
        readiness: newReadiness,
        momentum: newMomentum,
        mental: newMental,
        speed: newSpeed,
        stamina: newStamina,
        technique: newTechnique,
        turns: newTurns,
        coachTrust: newCoachTrust,
        form: newForm,
        trainingsThisWeek: state.trainingsThisWeek + 1,
        xp: state.xp + 25,
      }
    }

    case 'ATHLETE_RECORD_RACE': {
      const result = action.result
      const won = result.rank === 1
      const podium = result.rank <= 3
      const momentumDelta = won ? 6 : podium ? 3 : result.rank <= 5 ? 0 : -3
      const newMomentum = clamp(state.momentum + momentumDelta, -30, 30)
      const newCoachTrust = clamp(state.coachTrust + (won ? 4 : podium ? 2 : result.rank <= 5 ? 0 : -2), 0, 100)
      const newReadiness = clamp(state.readiness - 12, 10, 100)
      const newXP = state.xp + result.xpEarned
      const newCoins = state.coins + result.coinsEarned

      // Update rivals
      const newRivals = state.rivals.map((rival) => {
        // Check if this rival was in the race (name appears in event or story)
        const affected = result.storyOutcome?.toLowerCase().includes(rival.name.split(' ')[0].toLowerCase())
        if (!affected) return rival
        if (won) {
          return { ...rival, wins: rival.wins + 1, lastResult: 'won' as const, intensity: rival.intensity === 'stable' ? 'heated' as const : 'peak' as const }
        }
        return { ...rival, losses: rival.losses + 1, lastResult: 'lost' as const }
      })

      // Update sponsor progress
      const newSponsors = state.sponsors.map((sp) => {
        if (sp.status !== 'active') return sp
        const delta = podium ? 25 : result.rank <= 5 ? 10 : 0
        return { ...sp, conditionProgress: clamp(sp.conditionProgress + delta, 0, 100) }
      })

      // Unlock next event
      const newCompleted = state.completedEventIds.includes(result.eventId)
        ? state.completedEventIds
        : [...state.completedEventIds, result.eventId]

      return {
        ...state,
        momentum: newMomentum,
        coachTrust: newCoachTrust,
        readiness: newReadiness,
        form: getFormLevel(newReadiness, newMomentum),
        xp: newXP,
        coins: newCoins,
        rivals: newRivals,
        sponsors: newSponsors,
        completedEventIds: newCompleted,
        currentEventIdx: Math.max(state.currentEventIdx, newCompleted.length),
        raceHistory: [result, ...state.raceHistory].slice(0, 20),
        pendingRaceEventId: undefined,
      }
    }

    case 'ATHLETE_ADVANCE_WEEK': {
      const newWeek = state.currentWeek + 1
      // Weekly recovery naturally
      const newReadiness = clamp(state.readiness + 4, 10, 100)
      const newMomentum = state.momentum > 0 ? Math.max(0, state.momentum - 1) : Math.min(0, state.momentum + 1)
      // Sponsor weekly payout + countdown
      let coinsGained = 0
      const newSponsors = state.sponsors.map((sp) => {
        if (sp.status !== 'active') return sp
        coinsGained += sp.valueCoins
        const newWeeksLeft = sp.weeksLeft - 1
        return { ...sp, weeksLeft: newWeeksLeft, status: newWeeksLeft <= 0 ? 'expired' as const : sp.status }
      })
      return {
        ...state,
        currentWeek: newWeek,
        readiness: newReadiness,
        momentum: newMomentum,
        form: getFormLevel(newReadiness, newMomentum),
        coins: state.coins + coinsGained,
        sponsors: newSponsors,
        trainingsThisWeek: 0,
        needsWeeklyDecision: true,
      }
    }

    case 'ATHLETE_ACCEPT_SPONSOR': {
      const newSponsors = state.sponsors.map((sp) =>
        sp.id === action.sponsorId ? { ...sp, status: 'active' as const, weeksLeft: 6 } : sp
      )
      return { ...state, sponsors: newSponsors, coins: state.coins + 2000 }
    }

    case 'ATHLETE_REJECT_SPONSOR': {
      const newSponsors = state.sponsors.map((sp) =>
        sp.id === action.sponsorId ? { ...sp, status: 'rejected' as const } : sp
      )
      return { ...state, sponsors: newSponsors }
    }

    case 'ATHLETE_MARK_STORY_READ': {
      return {
        ...state,
        storyMoments: state.storyMoments.map((m) =>
          m.id === action.momentId ? { ...m, read: true } : m
        ),
      }
    }

    case 'ATHLETE_ADD_STORY': {
      return {
        ...state,
        storyMoments: [action.moment, ...state.storyMoments].slice(0, 30),
      }
    }

    case 'ATHLETE_SET_PENDING_RACE': {
      return { ...state, pendingRaceEventId: action.eventId }
    }

    default:
      return state
  }
}

function clubReducer(state: ClubCareerState, action: CareerAction): ClubCareerState {
  switch (action.type) {
    case 'CLUB_SET_PHILOSOPHY':
      return { ...state, philosophyId: action.philosophyId }

    case 'CLUB_SIGN_PLAYER': {
      const target = state.transferTargets.find((t) => t.id === action.athleteId)
      if (!target || !target.available) return state
      if (state.budget < target.price) return state
      const newAthlete: ClubAthlete = {
        id: target.id,
        name: target.name,
        age: target.age,
        ovr: target.ovr,
        potential: target.potential,
        stroke: target.stroke,
        country: target.country,
        speed: Math.round(target.ovr * 0.95 + Math.random() * 10),
        stamina: Math.round(target.ovr * 0.90 + Math.random() * 10),
        technique: Math.round(target.ovr * 0.92 + Math.random() * 10),
        turns: Math.round(target.ovr * 0.88 + Math.random() * 10),
        form: 'normal',
        readiness: 75,
        morale: 80,
        weeklyWage: target.weeklyWage,
        trainingFocusId: 'sharpness',
        developmentProgress: 0,
        isAcademy: false,
        isStar: target.ovr >= 88,
        raceCount: 0,
      }
      return {
        ...state,
        budget: state.budget - target.price,
        weeklyWages: state.weeklyWages + target.weeklyWage,
        roster: [...state.roster, newAthlete],
        transferTargets: state.transferTargets.map((t) =>
          t.id === action.athleteId ? { ...t, available: false } : t
        ),
      }
    }

    case 'CLUB_RELEASE_PLAYER': {
      const athlete = state.roster.find((a) => a.id === action.athleteId)
      if (!athlete) return state
      return {
        ...state,
        roster: state.roster.filter((a) => a.id !== action.athleteId),
        weeklyWages: state.weeklyWages - athlete.weeklyWage,
      }
    }

    case 'CLUB_HIRE_STAFF': {
      const staff = state.staff.find((s) => s.id === action.staffId)
      if (!staff || staff.hired) return state
      const weeklyCost = staff.salary
      return {
        ...state,
        staff: state.staff.map((s) => (s.id === action.staffId ? { ...s, hired: true } : s)),
        weeklyWages: state.weeklyWages + weeklyCost,
      }
    }

    case 'CLUB_UPGRADE_FACILITY': {
      const facility = state.facilities.find((f) => f.type === action.facilityType)
      if (!facility || facility.level >= 5) return state
      if (state.budget < facility.upgradeCost) return state
      const newLevel = facility.level + 1
      const newCost = Math.round(facility.upgradeCost * 1.6)
      return {
        ...state,
        budget: state.budget - facility.upgradeCost,
        facilities: state.facilities.map((f) =>
          f.type === action.facilityType ? { ...f, level: newLevel, upgradeCost: newCost } : f
        ),
      }
    }

    case 'CLUB_SET_ATHLETE_TRAINING': {
      return {
        ...state,
        roster: state.roster.map((a) =>
          a.id === action.athleteId ? { ...a, trainingFocusId: action.focusId } : a
        ),
      }
    }

    case 'CLUB_SET_COMPETITION_LINEUP': {
      return {
        ...state,
        competitions: state.competitions.map((c) =>
          c.id === action.compId ? { ...c, lineup: action.lineup } : c
        ),
      }
    }

    case 'CLUB_ENTER_COMPETITION': {
      return {
        ...state,
        competitions: state.competitions.map((c) =>
          c.id === action.compId ? { ...c, entered: true } : c
        ),
      }
    }

    case 'CLUB_ADVANCE_WEEK': {
      const newWeek = state.currentWeek + 1
      const weeklyBalance = state.weeklyIncome - state.weeklyWages
      // Process athlete development
      const newRoster = state.roster.map((athlete) => {
        const focusEffects: Record<TrainingFocusId, Partial<ClubAthlete>> = {
          sharpness: { readiness: Math.min(100, athlete.readiness + 5), speed: Math.min(athlete.potential, athlete.speed + 1) },
          volume:    { stamina: Math.min(athlete.potential, athlete.stamina + 2), readiness: Math.max(50, athlete.readiness - 3) },
          technique: { technique: Math.min(athlete.potential, athlete.technique + 2), turns: Math.min(athlete.potential, athlete.turns + 1) },
          recovery:  { readiness: Math.min(100, athlete.readiness + 12), morale: Math.min(100, athlete.morale + 5) },
          mental:    { morale: Math.min(100, athlete.morale + 8), readiness: Math.min(100, athlete.readiness + 3) },
        }
        const fx = focusEffects[athlete.trainingFocusId ?? 'sharpness']
        const newDevProgress = athlete.developmentProgress + (Math.random() * 8 + 3)
        const leveledUp = newDevProgress >= 100
        const newOvr = leveledUp ? Math.min(athlete.potential, athlete.ovr + 1) : athlete.ovr
        return {
          ...athlete,
          ...fx,
          ovr: newOvr,
          developmentProgress: leveledUp ? newDevProgress - 100 : newDevProgress,
          raceCount: athlete.raceCount,
        }
      })
      return {
        ...state,
        currentWeek: newWeek,
        budget: state.budget + weeklyBalance,
        roster: newRoster,
        pendingDecisions: ['assign_training', 'choose_competition_lineup'],
      }
    }

    case 'CLUB_RECORD_COMPETITION_RESULT': {
      const comp = state.competitions.find((c) => c.id === action.compId)
      if (!comp || !action.result) return state
      const prestigeDelta = action.result.position <= 3 ? 5 : action.result.position <= 6 ? 2 : -1
      const newPrestige = clamp(state.prestige + prestigeDelta, 0, 100)
      const newTrophies = action.result.medalsWon > 0
        ? [...state.trophies, { name: `${comp.name} — ${action.result.medalsWon} medals`, season: state.season, week: state.currentWeek }]
        : state.trophies
      return {
        ...state,
        prestige: newPrestige,
        budget: state.budget + action.result.coinsWon,
        competitions: state.competitions.map((c) =>
          c.id === action.compId ? { ...c, result: action.result } : c
        ),
        trophies: newTrophies,
      }
    }

    default:
      return state
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface CareerContextValue {
  athleteCareer: AthleteCareerState
  clubCareer: ClubCareerState
  dispatch: React.Dispatch<CareerAction>
  // Convenience helpers
  athleteDispatch: (action: CareerAction) => void
  clubDispatch: (action: CareerAction) => void
}

const CareerContext = createContext<CareerContextValue | null>(null)

const SAVE_KEY = 'swim26_career_save_v1'

function loadSave(): CareerSave {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (raw) return { ...createDefaultSave(), ...JSON.parse(raw) }
  } catch {
    // ignore
  }
  return createDefaultSave()
}

function rootReducer(state: CareerSave, action: CareerAction): CareerSave {
  const athleteActions = ['ATHLETE_SET_TRAINING_FOCUS', 'ATHLETE_COMPLETE_TRAINING', 'ATHLETE_RECORD_RACE', 'ATHLETE_ADVANCE_WEEK', 'ATHLETE_ACCEPT_SPONSOR', 'ATHLETE_REJECT_SPONSOR', 'ATHLETE_MARK_STORY_READ', 'ATHLETE_ADD_STORY', 'ATHLETE_SET_PENDING_RACE']
  const clubActions = ['CLUB_SIGN_PLAYER', 'CLUB_RELEASE_PLAYER', 'CLUB_SET_PHILOSOPHY', 'CLUB_HIRE_STAFF', 'CLUB_UPGRADE_FACILITY', 'CLUB_SET_ATHLETE_TRAINING', 'CLUB_SET_COMPETITION_LINEUP', 'CLUB_ENTER_COMPETITION', 'CLUB_ADVANCE_WEEK', 'CLUB_RECORD_COMPETITION_RESULT']

  if (athleteActions.includes(action.type)) {
    return { ...state, athleteCareer: athleteReducer(state.athleteCareer, action), lastSaved: Date.now() }
  }
  if (clubActions.includes(action.type)) {
    return { ...state, clubCareer: clubReducer(state.clubCareer, action), lastSaved: Date.now() }
  }
  return state
}

export const CareerSaveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [save, dispatch] = useReducer(rootReducer, undefined, loadSave)

  // Persist to localStorage whenever save changes
  useEffect(() => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(save))
    } catch {
      // ignore quota errors
    }
  }, [save])

  const athleteDispatch = useCallback((action: CareerAction) => dispatch(action), [])
  const clubDispatch = useCallback((action: CareerAction) => dispatch(action), [])

  return (
    <CareerContext.Provider value={{
      athleteCareer: save.athleteCareer,
      clubCareer: save.clubCareer,
      dispatch,
      athleteDispatch,
      clubDispatch,
    }}>
      {children}
    </CareerContext.Provider>
  )
}

export function useAthleteCareer() {
  const ctx = useContext(CareerContext)
  if (!ctx) throw new Error('useAthleteCareer must be used within CareerSaveProvider')
  return { state: ctx.athleteCareer, dispatch: ctx.athleteDispatch }
}

export function useClubCareer() {
  const ctx = useContext(CareerContext)
  if (!ctx) throw new Error('useClubCareer must be used within CareerSaveProvider')
  return { state: ctx.clubCareer, dispatch: ctx.clubDispatch }
}
