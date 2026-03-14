/**
 * SWIMMER GAME - SwimmerProfile
 * Unique personality, clothing, and behavior profiles for each swimmer
 *
 * Creates personalized swimmer profiles with:
 * - Unique clothing combinations
 * - Personality traits (confidence, nervousness, etc.)
 * - Coach information
 * - Unique warm-up behaviors
 * - Dialogue/quotes
 */

import * as BABYLON from '@babylonjs/core';

export type PersonalityType = 'confident' | 'nervous' | 'focused' | 'relaxed' | 'aggressive';
export type SuitStyle = 'brief' | 'jammer' | 'tech-suit';
export type ClothingVariant = 'minimal' | 'standard' | 'full-coverage';

export interface SwimmerPersonality {
  type: PersonalityType;
  confidence: number; // 0-1
  nervousness: number; // 0-1
  focusLevel: number; // 0-1
  warmupIntensity: number; // 0-1
}

export interface SwimmerClothing {
  suitStyle: SuitStyle;
  variant: ClothingVariant;
  suitColor: BABYLON.Color3;
  capColor: BABYLON.Color3;
  hasGoggles: boolean;
  hasArmBands: boolean;
  hasLegBands: boolean;
  skinTone: BABYLON.Color3;
  gogglesColor: BABYLON.Color3;
}

export interface CoachProfile {
  name: string;
  style: 'drill-sergeant' | 'supportive' | 'technical' | 'motivator';
  color: BABYLON.Color3;
  quotes: string[];
}

export interface SwimmerProfile {
  id: number;
  name: string;
  lane: number;
  personality: SwimmerPersonality;
  clothing: SwimmerClothing;
  coach: CoachProfile;
  speed: number;
  warmupQuotes: string[];
  nervousQuotes: string[];
  motivationalQuotes: string[];
}

// Predefined swimmers with unique profiles
export const SWIMMER_PROFILES: SwimmerProfile[] = [
  {
    id: 0,
    name: 'PHELPS',
    lane: 4,
    speed: 2.45,
    personality: {
      type: 'confident',
      confidence: 0.95,
      nervousness: 0.1,
      focusLevel: 0.9,
      warmupIntensity: 0.8,
    },
    clothing: {
      suitStyle: 'tech-suit',
      variant: 'full-coverage',
      suitColor: new BABYLON.Color3(0.0, 0.2, 0.8),
      capColor: new BABYLON.Color3(0.2, 0.2, 0.2),
      hasGoggles: true,
      hasArmBands: true,
      hasLegBands: false,
      skinTone: new BABYLON.Color3(0.95, 0.8, 0.7),
      gogglesColor: new BABYLON.Color3(0.2, 0.2, 0.2),
    },
    coach: {
      name: 'Coach Bob',
      style: 'technical',
      color: new BABYLON.Color3(0.3, 0.3, 0.3),
      quotes: ['Focus on your stroke technique', 'You got this - smooth and controlled', 'Remember your breathing pattern'],
    },
    warmupQuotes: ["I'm feeling good today", 'Time to warm up', 'Let me get loose'],
    nervousQuotes: [],
    motivationalQuotes: ['One race at a time', 'I am prepared', 'This is my lane'],
  },
  {
    id: 1,
    name: 'DRESSEL',
    lane: 5,
    speed: 2.42,
    personality: {
      type: 'aggressive',
      confidence: 0.9,
      nervousness: 0.15,
      focusLevel: 0.95,
      warmupIntensity: 0.95,
    },
    clothing: {
      suitStyle: 'brief',
      variant: 'minimal',
      suitColor: new BABYLON.Color3(0.8, 0.0, 0.0),
      capColor: new BABYLON.Color3(1.0, 1.0, 1.0),
      hasGoggles: true,
      hasArmBands: false,
      hasLegBands: false,
      skinTone: new BABYLON.Color3(0.9, 0.75, 0.65),
      gogglesColor: new BABYLON.Color3(0.1, 0.1, 0.1),
    },
    coach: {
      name: 'Coach Sarah',
      style: 'motivator',
      color: new BABYLON.Color3(0.4, 0.2, 0.2),
      quotes: ["You're the fastest here", 'Show them what youre made of', 'Dominate this race'],
    },
    warmupQuotes: ['Lets GO!', 'Time to race', 'I want to WIN'],
    nervousQuotes: ['Need to focus', 'Come on, lock in'],
    motivationalQuotes: ['I am the best', 'This is my race'],
  },
  {
    id: 2,
    name: 'MILAK',
    lane: 3,
    speed: 2.38,
    personality: {
      type: 'focused',
      confidence: 0.85,
      nervousness: 0.25,
      focusLevel: 0.98,
      warmupIntensity: 0.75,
    },
    clothing: {
      suitStyle: 'jammer',
      variant: 'standard',
      suitColor: new BABYLON.Color3(0.2, 0.8, 0.2),
      capColor: new BABYLON.Color3(0.9, 0.9, 0.9),
      hasGoggles: true,
      hasArmBands: true,
      hasLegBands: true,
      skinTone: new BABYLON.Color3(0.92, 0.78, 0.68),
      gogglesColor: new BABYLON.Color3(0.05, 0.05, 0.05),
    },
    coach: {
      name: 'Coach Dimitri',
      style: 'technical',
      color: new BABYLON.Color3(0.2, 0.4, 0.2),
      quotes: ['Precision is everything', 'Control your movements', 'Perfect form wins races'],
    },
    warmupQuotes: ['Lets get focused', 'Warming up', 'Preparing myself'],
    nervousQuotes: ['Stay calm', 'Breathe slowly', 'You know this'],
    motivationalQuotes: ['I am ready', 'This is my moment'],
  },
  {
    id: 3,
    name: 'POPOVICI',
    lane: 6,
    speed: 2.40,
    personality: {
      type: 'relaxed',
      confidence: 0.88,
      nervousness: 0.2,
      focusLevel: 0.85,
      warmupIntensity: 0.7,
    },
    clothing: {
      suitStyle: 'tech-suit',
      variant: 'full-coverage',
      suitColor: new BABYLON.Color3(0.8, 0.2, 0.8),
      capColor: new BABYLON.Color3(0.8, 0.2, 0.8),
      hasGoggles: true,
      hasArmBands: false,
      hasLegBands: false,
      skinTone: new BABYLON.Color3(0.93, 0.82, 0.72),
      gogglesColor: new BABYLON.Color3(0.3, 0.1, 0.3),
    },
    coach: {
      name: 'Coach Ana',
      style: 'supportive',
      color: new BABYLON.Color3(0.4, 0.2, 0.4),
      quotes: ['You got this', 'Just have fun out there', 'Believe in yourself'],
    },
    warmupQuotes: ['Good morning', 'Looking forward to this', 'Feeling great'],
    nervousQuotes: [],
    motivationalQuotes: ['I belong here', 'I am strong'],
  },
  {
    id: 4,
    name: 'CHALMERS',
    lane: 2,
    speed: 2.35,
    personality: {
      type: 'nervous',
      confidence: 0.75,
      nervousness: 0.4,
      focusLevel: 0.8,
      warmupIntensity: 0.65,
    },
    clothing: {
      suitStyle: 'jammer',
      variant: 'standard',
      suitColor: new BABYLON.Color3(1.0, 0.8, 0.0),
      capColor: new BABYLON.Color3(0.1, 0.1, 0.1),
      hasGoggles: false,
      hasArmBands: true,
      hasLegBands: true,
      skinTone: new BABYLON.Color3(0.88, 0.72, 0.62),
      gogglesColor: new BABYLON.Color3(0.0, 0.0, 0.0),
    },
    coach: {
      name: 'Coach James',
      style: 'supportive',
      color: new BABYLON.Color3(0.4, 0.3, 0.1),
      quotes: ['Deep breaths', "You've trained hard", 'Trust your training'],
    },
    warmupQuotes: ['Nervous energy', 'Let me warm up', 'Getting ready'],
    nervousQuotes: ['I can do this', 'Calm down', 'Focus on the basics'],
    motivationalQuotes: ['I will surprise myself', 'I am stronger than I think'],
  },
  {
    id: 5,
    name: 'LE CLOS',
    lane: 7,
    speed: 2.32,
    personality: {
      type: 'confident',
      confidence: 0.92,
      nervousness: 0.12,
      focusLevel: 0.88,
      warmupIntensity: 0.85,
    },
    clothing: {
      suitStyle: 'brief',
      variant: 'minimal',
      suitColor: new BABYLON.Color3(0.1, 0.1, 0.1),
      capColor: new BABYLON.Color3(0.9, 0.9, 0.9),
      hasGoggles: true,
      hasArmBands: false,
      hasLegBands: false,
      skinTone: new BABYLON.Color3(0.85, 0.7, 0.6),
      gogglesColor: new BABYLON.Color3(0.2, 0.2, 0.2),
    },
    coach: {
      name: 'Coach Pierre',
      style: 'drill-sergeant',
      color: new BABYLON.Color3(0.2, 0.2, 0.2),
      quotes: ['No excuses', 'Push harder', 'This is your time'],
    },
    warmupQuotes: ['Lets get it', 'Ready to go', 'Bring the heat'],
    nervousQuotes: [],
    motivationalQuotes: ['I am unstoppable', 'Victory is mine'],
  },
  {
    id: 6,
    name: 'GUY',
    lane: 1,
    speed: 2.30,
    personality: {
      type: 'relaxed',
      confidence: 0.8,
      nervousness: 0.3,
      focusLevel: 0.75,
      warmupIntensity: 0.6,
    },
    clothing: {
      suitStyle: 'jammer',
      variant: 'standard',
      suitColor: new BABYLON.Color3(0.5, 0.5, 0.5),
      capColor: new BABYLON.Color3(0.8, 0.8, 0.8),
      hasGoggles: false,
      hasArmBands: false,
      hasLegBands: true,
      skinTone: new BABYLON.Color3(0.9, 0.75, 0.65),
      gogglesColor: new BABYLON.Color3(0.0, 0.0, 0.0),
    },
    coach: {
      name: 'Coach Marcus',
      style: 'supportive',
      color: new BABYLON.Color3(0.3, 0.3, 0.3),
      quotes: ['Have fun out there', 'Just do your best', 'Enjoy the race'],
    },
    warmupQuotes: ['Whats up', 'Feeling good', 'Let me get loose'],
    nervousQuotes: ['No worries', 'Its just a race'],
    motivationalQuotes: ['I got this', 'Lets swim'],
  },
  {
    id: 7,
    name: 'PROUD',
    lane: 8,
    speed: 2.48,
    personality: {
      type: 'aggressive',
      confidence: 0.93,
      nervousness: 0.08,
      focusLevel: 0.92,
      warmupIntensity: 0.9,
    },
    clothing: {
      suitStyle: 'tech-suit',
      variant: 'full-coverage',
      suitColor: new BABYLON.Color3(1.0, 0.2, 0.7),
      capColor: new BABYLON.Color3(0.2, 0.2, 0.2),
      hasGoggles: true,
      hasArmBands: true,
      hasLegBands: true,
      skinTone: new BABYLON.Color3(0.91, 0.76, 0.66),
      gogglesColor: new BABYLON.Color3(1.0, 0.2, 0.7),
    },
    coach: {
      name: 'Coach Yuki',
      style: 'motivator',
      color: new BABYLON.Color3(0.4, 0.1, 0.3),
      quotes: ['You are a champion', 'Go and conquer', 'This is your stage'],
    },
    warmupQuotes: ['Time to dominate', 'Lets tear it up', 'I am ready to WIN'],
    nervousQuotes: [],
    motivationalQuotes: ['I am a winner', 'My moment is NOW'],
  },
];

export default SWIMMER_PROFILES;
