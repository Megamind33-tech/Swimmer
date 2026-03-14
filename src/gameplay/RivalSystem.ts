/**
 * SWIMMER GAME - RivalSystem
 * AI rival personalities and behavior
 *
 * Responsibilities:
 * - 16 rival definitions with stats and personalities
 * - Rival memory (previous race outcomes)
 * - Difficulty scaling based on player skill
 * - Pacing strategies (different for each rival)
 * - Trash talk dialogue generation
 * - Rivalry arc tracking (progression narrative)
 * - Rival unlock progression
 */

import { IRival, IAISwimmer, ISwimmerStats, ISwimmerPersonality } from '../types';
import { logger, randomInt, weightedRandom, deepClone } from '../utils';

// Rival pool with complete definitions
const RIVAL_DEFINITIONS: Array<Omit<IRival, 'racesAgainstPlayer' | 'playerWins'>> = [
  // EARLY GAME RIVALS (Skill tier 1-2, unlock at level 5-15)
  {
    id: 'rival_1',
    name: 'Jake Turner',
    stats: { speed: 7, stamina: 7, technique: 6, endurance: 6, mental: 5 },
    personality: {
      name: 'Jake Turner',
      archetype: 'Eager Young Swimmer',
      traits: ['Enthusiastic', 'Sometimes Nervous', 'Improving'],
      dialogue: [
        "Let's see what you've got!",
        "I'm ready for this!",
        "You got lucky that time...",
        "Nice race! Want to go again?",
      ],
      trashTalkChance: 0.2,
    },
    specialty: 'SPRINTER',
    skillTier: 2,
    difficulty: 2,
    unlockLevel: 5,
  },
  {
    id: 'rival_2',
    name: 'Maya Chen',
    stats: { speed: 8, stamina: 8, technique: 7, endurance: 7, mental: 6 },
    personality: {
      name: 'Maya Chen',
      archetype: 'Technical Perfectionist',
      traits: ['Focused', 'Analytical', 'Respectful'],
      dialogue: [
        'Best of luck out there.',
        'I appreciate a good technical race.',
        'You swam well today.',
        'Looking forward to our next match.',
      ],
      trashTalkChance: 0.1,
    },
    specialty: 'TECHNICIAN',
    skillTier: 2,
    difficulty: 2,
    unlockLevel: 8,
  },
  {
    id: 'rival_3',
    name: 'Marcus Johnson',
    stats: { speed: 6, stamina: 9, technique: 6, endurance: 9, mental: 7 },
    personality: {
      name: 'Marcus Johnson',
      archetype: 'Steady Grinder',
      traits: ['Consistent', 'Tough', 'No Nonsense'],
      dialogue: [
        "I'll out-pace you any day.",
        'This is my lane.',
        'I just keep swimming.',
        "You almost had me that time.",
      ],
      trashTalkChance: 0.3,
    },
    specialty: 'DISTANCE',
    skillTier: 2,
    difficulty: 2,
    unlockLevel: 10,
  },
  {
    id: 'rival_4',
    name: 'Emma Rodriguez',
    stats: { speed: 8, stamina: 8, technique: 8, endurance: 7, mental: 6 },
    personality: {
      name: 'Emma Rodriguez',
      archetype: 'All-Around Competitor',
      traits: ['Versatile', 'Adaptable', 'Charismatic'],
      dialogue: [
        'May the best swimmer win!',
        'I love a good challenge.',
        'You swam your heart out there.',
        'Rematch?',
      ],
      trashTalkChance: 0.25,
    },
    specialty: 'ALL_AROUND',
    skillTier: 2,
    difficulty: 2,
    unlockLevel: 12,
  },

  // MID GAME RIVALS (Skill tier 3-4, unlock at level 20-30)
  {
    id: 'rival_5',
    name: 'Alex Petrov',
    stats: { speed: 10, stamina: 9, technique: 9, endurance: 9, mental: 8 },
    personality: {
      name: 'Alex Petrov',
      archetype: 'Ambitious Rising Star',
      traits: ['Aggressive', 'Determined', 'Cold Competitor'],
      dialogue: [
        "I'm coming for your title.",
        'You were good... for now.',
        'Is that all you have?',
        'The next race will be different.',
      ],
      trashTalkChance: 0.6,
    },
    specialty: 'SPRINTER',
    skillTier: 4,
    difficulty: 4,
    unlockLevel: 20,
  },
  {
    id: 'rival_6',
    name: 'Jordan Lee',
    stats: { speed: 9, stamina: 10, technique: 9, endurance: 10, mental: 7 },
    personality: {
      name: 'Jordan Lee',
      archetype: 'Distance Master',
      traits: ['Enduring', 'Patient', 'Calculating'],
      dialogue: [
        'I save my energy for where it counts.',
        "It's a long race.",
        "You won't catch me in the final stretch.",
        'Pacing is everything.',
      ],
      trashTalkChance: 0.2,
    },
    specialty: 'DISTANCE',
    skillTier: 4,
    difficulty: 4,
    unlockLevel: 22,
  },
  {
    id: 'rival_7',
    name: 'Sofia Moretti',
    stats: { speed: 9, stamina: 8, technique: 10, endurance: 8, mental: 8 },
    personality: {
      name: 'Sofia Moretti',
      archetype: 'Technical Virtuoso',
      traits: ['Elegant', 'Precise', 'Artistic'],
      dialogue: [
        'Swimming is an art form.',
        'Technique trumps raw speed.',
        'Your stroke is improving.',
        'Beauty in motion.',
      ],
      trashTalkChance: 0.15,
    },
    specialty: 'TECHNICIAN',
    skillTier: 4,
    difficulty: 4,
    unlockLevel: 25,
  },
  {
    id: 'rival_8',
    name: 'Chris Daniels',
    stats: { speed: 10, stamina: 9, technique: 9, endurance: 9, mental: 9 },
    personality: {
      name: 'Chris Daniels',
      archetype: 'Confident All-Rounder',
      traits: ['Natural', 'Talented', 'Cocky'],
      dialogue: [
        "I'm just better at everything.",
        'This is too easy.',
        'Want a handicap?',
        "You've got potential... maybe.",
      ],
      trashTalkChance: 0.5,
    },
    specialty: 'ALL_AROUND',
    skillTier: 4,
    difficulty: 4,
    unlockLevel: 28,
  },

  // LATE GAME RIVALS (Skill tier 5-6, unlock at level 40+)
  {
    id: 'rival_9',
    name: 'Dante Rossi',
    stats: { speed: 11, stamina: 10, technique: 10, endurance: 10, mental: 9 },
    personality: {
      name: 'Dante Rossi',
      archetype: 'European Legend',
      traits: ['Dominant', 'Composed', 'Masterful'],
      dialogue: [
        "I've beaten everyone worth beating.",
        "You're getting closer.",
        'Welcome to the elite level.',
        "Let me show you how it's done.",
      ],
      trashTalkChance: 0.4,
    },
    specialty: 'SPRINTER',
    skillTier: 6,
    difficulty: 6,
    unlockLevel: 40,
  },
  {
    id: 'rival_10',
    name: 'Yuki Tanaka',
    stats: { speed: 10, stamina: 11, technique: 11, endurance: 11, mental: 9 },
    personality: {
      name: 'Yuki Tanaka',
      archetype: 'Zen Master',
      traits: ['Patient', 'Wise', 'Unflappable'],
      dialogue: [
        'The pool reveals the truth.',
        'Every stroke tells a story.',
        'You must find your rhythm.',
        'Pressure is an illusion.',
      ],
      trashTalkChance: 0.1,
    },
    specialty: 'DISTANCE',
    skillTier: 6,
    difficulty: 6,
    unlockLevel: 42,
  },
  {
    id: 'rival_11',
    name: 'Isabella Santos',
    stats: { speed: 11, stamina: 10, technique: 11, endurance: 10, mental: 10 },
    personality: {
      name: 'Isabella Santos',
      archetype: 'Perfect Technician',
      traits: ['Meticulous', 'Flawless', 'Intimidating'],
      dialogue: [
        'Every movement is calculated.',
        'I have no weaknesses.',
        'Your form still needs work.',
        'Perfection is the standard.',
      ],
      trashTalkChance: 0.35,
    },
    specialty: 'TECHNICIAN',
    skillTier: 6,
    difficulty: 6,
    unlockLevel: 45,
  },
  {
    id: 'rival_12',
    name: 'Oliver Stone',
    stats: { speed: 11, stamina: 11, technique: 10, endurance: 11, mental: 10 },
    personality: {
      name: 'Oliver Stone',
      archetype: 'Complete Champion',
      traits: ['Well-Rounded', 'Intelligent', 'Fierce'],
      dialogue: [
        'No weaknesses, only opportunities.',
        'You have to be perfect to beat me.',
        "I've studied every one of your races.",
        'This is where legends are made.',
      ],
      trashTalkChance: 0.45,
    },
    specialty: 'ALL_AROUND',
    skillTier: 6,
    difficulty: 6,
    unlockLevel: 48,
  },

  // NEMESIS RIVALS (Skill tier 7-10, unlock at level 50+, final boss rivals)
  {
    id: 'rival_13',
    name: 'Caeleb Storm',
    stats: { speed: 12, stamina: 11, technique: 11, endurance: 11, mental: 10 },
    personality: {
      name: 'Caeleb Storm',
      archetype: 'Explosive Champion',
      traits: ['Destroyer', 'Fearless', 'Alpha'],
      dialogue: [
        'I own the sprints.',
        'Your best time is my warm-up.',
        'No mercy in the water.',
        'This is inevitable.',
      ],
      trashTalkChance: 0.7,
    },
    specialty: 'SPRINTER',
    skillTier: 8,
    difficulty: 8,
    unlockLevel: 50,
  },
  {
    id: 'rival_14',
    name: 'Katie Legends',
    stats: { speed: 11, stamina: 12, technique: 12, endurance: 12, mental: 11 },
    personality: {
      name: 'Katie Legends',
      archetype: 'Distance Goddess',
      traits: ['Relentless', 'Unbreakable', 'Historic'],
      dialogue: [
        "I don't lose distance races.",
        'You have to swim the race of your life.',
        'I set the standard you chase.',
        'Excellence is my baseline.',
      ],
      trashTalkChance: 0.3,
    },
    specialty: 'DISTANCE',
    skillTier: 8,
    difficulty: 8,
    unlockLevel: 52,
  },
  {
    id: 'rival_15',
    name: 'Natasha Volkov',
    stats: { speed: 12, stamina: 12, technique: 12, endurance: 12, mental: 11 },
    personality: {
      name: 'Natasha Volkov',
      archetype: 'Cyborg Competitor',
      traits: ['Perfect', 'Dominant', 'Unbeatable'],
      dialogue: [
        'Resistance is futile.',
        'I am the pinnacle of swimming.',
        'You will lose to me again.',
        'This is not a competition anymore.',
      ],
      trashTalkChance: 0.8,
    },
    specialty: 'TECHNICIAN',
    skillTier: 9,
    difficulty: 9,
    unlockLevel: 55,
  },
  {
    id: 'rival_16',
    name: 'Michael Champion',
    stats: { speed: 12, stamina: 12, technique: 12, endurance: 12, mental: 12 },
    personality: {
      name: 'Michael Champion',
      archetype: 'Legendary Icon',
      traits: ['GOAT', 'Unstoppable', 'Living Legend'],
      dialogue: [
        'I AM the standard.',
        'You cannot beat perfection.',
        'This is my pool.',
        'Welcome to the show.',
      ],
      trashTalkChance: 0.9,
    },
    specialty: 'ALL_AROUND',
    skillTier: 10,
    difficulty: 10,
    unlockLevel: 60,
  },
];

export class RivalSystem {
  private rivals: Map<string, IRival> = new Map();
  private rivalArcs: Map<string, number> = new Map(); // Track story progress per rival

  constructor() {
    this.initializeRivals();
    logger.log('RivalSystem initialized with', this.rivals.size, 'rivals');
  }

  /**
   * Initialize rival pool
   */
  private initializeRivals(): void {
    RIVAL_DEFINITIONS.forEach((def) => {
      const rival: IRival = {
        ...def,
        racesAgainstPlayer: 0,
        playerWins: 0,
      };
      this.rivals.set(rival.id, rival);
      this.rivalArcs.set(rival.id, 0); // Starting arc progress
    });
  }

  // ============================================================================
  // RIVAL QUERYING
  // ============================================================================

  /**
   * Get rival by ID
   */
  public getRival(rivalId: string): IRival | null {
    const rival = this.rivals.get(rivalId);
    return rival ? deepClone(rival) : null;
  }

  /**
   * Get all rivals
   */
  public getAllRivals(): IRival[] {
    return Array.from(this.rivals.values()).map((r) => deepClone(r));
  }

  /**
   * Get rivals unlocked at player level
   */
  public getUnlockedRivals(playerLevel: number): IRival[] {
    return Array.from(this.rivals.values())
      .filter((r) => r.unlockLevel <= playerLevel)
      .map((r) => deepClone(r));
  }

  /**
   * Get rivals by skill tier
   */
  public getRivalsByTier(tier: number): IRival[] {
    return Array.from(this.rivals.values())
      .filter((r) => r.skillTier === tier)
      .map((r) => deepClone(r));
  }

  // ============================================================================
  // RIVAL BEHAVIOR
  // ============================================================================

  /**
   * Get pacing strategy for rival (affects race behavior)
   */
  public getPacingStrategy(rivalId: string): 'AGGRESSIVE' | 'CONSERVATIVE' | 'STRATEGIC' {
    const rival = this.rivals.get(rivalId);
    if (!rival) return 'CONSERVATIVE';

    // Nemesis rivals are always aggressive
    if (rival.skillTier >= 8) return 'AGGRESSIVE';

    // Sprinters favor aggressive pacing
    if (rival.specialty === 'SPRINTER' && rival.skillTier >= 4) return 'AGGRESSIVE';

    // Distance swimmers favor conservative pacing
    if (rival.specialty === 'DISTANCE') return 'CONSERVATIVE';

    // Default strategic
    return 'STRATEGIC';
  }

  /**
   * Get rival difficulty multiplier based on head-to-head record
   */
  public getDifficultyMultiplier(rivalId: string): number {
    const rival = this.rivals.get(rivalId);
    if (!rival) return 1.0;

    // Base difficulty from skill tier
    let multiplier = 0.5 + rival.skillTier * 0.15; // 0.65 - 1.65

    // Adjust based on rivalry history
    if (rival.racesAgainstPlayer > 0) {
      const winRate = rival.playerWins / rival.racesAgainstPlayer;

      // If player wins too much, increase rival difficulty
      if (winRate > 0.7) {
        multiplier *= 1.1; // 10% harder
      }
      // If rival wins too much, decrease difficulty
      else if (winRate < 0.3) {
        multiplier *= 0.9; // 10% easier
      }
    }

    return Math.min(1.5, Math.max(0.5, multiplier)); // Clamp between 0.5 and 1.5
  }

  /**
   * Get rivalry arc (story progression, 0-100)
   */
  public getRivalArc(rivalId: string): number {
    return this.rivalArcs.get(rivalId) || 0;
  }

  /**
   * Advance rivalry arc after race
   */
  public advanceRivalArc(rivalId: string, playerWon: boolean): void {
    const currentArc = this.rivalArcs.get(rivalId) || 0;

    if (playerWon) {
      // Beating a rival advances the arc
      this.rivalArcs.set(rivalId, Math.min(100, currentArc + 10));
    }
  }

  // ============================================================================
  // DIALOGUE & TRASH TALK
  // ============================================================================

  /**
   * Get pre-race introduction dialogue
   */
  public getPreRaceDialogue(rivalId: string): string {
    const rival = this.rivals.get(rivalId);
    if (!rival) return 'Let the best swimmer win!';

    const arc = this.getRivalArc(rivalId);
    const willTrashTalk = Math.random() < rival.personality.trashTalkChance;

    // Story progression dialogue
    if (arc >= 80) {
      return `It all comes down to this moment. Final chance to prove yourself against ${rival.personality.name}.`;
    } else if (arc >= 50) {
      return `You're getting stronger, but I'm still better. - ${rival.personality.name}`;
    } else if (arc >= 20) {
      return `${rival.personality.name} respects your effort so far.`;
    }

    // Random trash talk or respect
    if (willTrashTalk && rival.personality.dialogue.length > 0) {
      return rival.personality.dialogue[randomInt(0, rival.personality.dialogue.length - 1)];
    }

    return `Good luck. - ${rival.personality.name}`;
  }

  /**
   * Get post-race commentary
   */
  public getPostRaceCommentary(rivalId: string, playerWon: boolean): string {
    const rival = this.rivals.get(rivalId);
    if (!rival) return 'Well swum!';

    if (playerWon) {
      return `${rival.personality.name} acknowledges your superior performance today.`;
    } else {
      return `${rival.personality.name} maintains dominance. Better luck next time.`;
    }
  }

  // ============================================================================
  // RACE RECORD UPDATES
  // ============================================================================

  /**
   * Record a race outcome against a rival
   */
  public recordRaceOutcome(rivalId: string, playerWon: boolean): void {
    const rival = this.rivals.get(rivalId);
    if (!rival) return;

    rival.racesAgainstPlayer++;

    if (playerWon) {
      rival.playerWins++;
      this.advanceRivalArc(rivalId, true);
    }

    logger.log(`Race recorded vs ${rival.name}: Player ${playerWon ? 'WON' : 'LOST'}`);
  }

  /**
   * Get rivalry record (wins-losses)
   */
  public getRivalryRecord(rivalId: string): { wins: number; losses: number; ratio: number } {
    const rival = this.rivals.get(rivalId);
    if (!rival) return { wins: 0, losses: 0, ratio: 0 };

    const losses = rival.racesAgainstPlayer - rival.playerWins;

    return {
      wins: rival.playerWins,
      losses,
      ratio: rival.racesAgainstPlayer > 0 ? rival.playerWins / rival.racesAgainstPlayer : 0,
    };
  }

  // ============================================================================
  // SELECTION & RECOMMENDATIONS
  // ============================================================================

  /**
   * Select a rival for a race (recommendations based on level)
   */
  public selectRival(playerLevel: number, preferredTier?: number): IRival | null {
    const unlocked = this.getUnlockedRivals(playerLevel);

    if (unlocked.length === 0) return null;

    // If tier preference specified, try to match it
    if (preferredTier !== undefined) {
      const tierMatch = unlocked.filter((r) => r.skillTier === preferredTier);
      if (tierMatch.length > 0) {
        return deepClone(tierMatch[randomInt(0, tierMatch.length - 1)]);
      }
    }

    // Default: slightly above player level for challenge
    const targetTier = Math.ceil(playerLevel / 10) + 1;
    const recommended = unlocked.filter((r) => Math.abs(r.skillTier - targetTier) <= 1);

    if (recommended.length > 0) {
      return deepClone(recommended[randomInt(0, recommended.length - 1)]);
    }

    // Fallback: random from unlocked
    return deepClone(unlocked[randomInt(0, unlocked.length - 1)]);
  }

  /**
   * Get nemesis rival (strongest rival player hasn't beaten)
   */
  public getNemesisRival(playerLevel: number): IRival | null {
    const allRivals = this.getAllRivals();

    // Nemesis: highest skill tier rival, unlocked, not beaten yet
    const nemesisCandidates = allRivals
      .filter((r) => r.unlockLevel <= playerLevel && r.playerWins === r.racesAgainstPlayer)
      .sort((a, b) => b.skillTier - a.skillTier);

    return nemesisCandidates.length > 0 ? deepClone(nemesisCandidates[0]) : null;
  }
}

export const rivalSystem = new RivalSystem();

export default rivalSystem;
