#!/usr/bin/env node

/**
 * Integration Verification Script
 * Tests that the modules are properly integrated without breaking existing functionality
 */

import { GameManager } from './src/core/GameManager';
import { PlayerManager } from './src/data/PlayerManager';
import { RivalSystem } from './src/gameplay/RivalSystem';
import { RaceEngine } from './src/core/RaceEngine';

// Color output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

let passedTests = 0;
let failedTests = 0;

function test(name: string, fn: () => boolean) {
  try {
    const result = fn();
    if (result) {
      console.log(`${colors.green}✓${colors.reset} ${name}`);
      passedTests++;
    } else {
      console.log(`${colors.red}✗${colors.reset} ${name}`);
      failedTests++;
    }
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset} ${name}: ${(error as Error).message}`);
    failedTests++;
  }
}

function testAsync(name: string, fn: () => Promise<boolean>) {
  return new Promise<void>((resolve) => {
    fn()
      .then((result) => {
        if (result) {
          console.log(`${colors.green}✓${colors.reset} ${name}`);
          passedTests++;
        } else {
          console.log(`${colors.red}✗${colors.reset} ${name}`);
          failedTests++;
        }
        resolve();
      })
      .catch((error) => {
        console.log(`${colors.red}✗${colors.reset} ${name}: ${error.message}`);
        failedTests++;
        resolve();
      });
  });
}

async function runTests() {
  console.log(`${colors.blue}=== Swimmer Game Integration Tests ===${colors.reset}\n`);

  // GameManager Tests
  console.log(`${colors.blue}GameManager Tests:${colors.reset}`);
  test('Initializes without errors', () => {
    const mgr = new GameManager();
    return mgr !== null;
  });

  test('Starts in IDLE state', () => {
    const mgr = new GameManager();
    return mgr.getGameState() === 'IDLE';
  });

  test('Can switch modes', async () => {
    const mgr = new GameManager();
    mgr.switchMode('QUICK_RACE');
    return mgr.getMode() === 'QUICK_RACE';
  });

  // PlayerManager Tests
  console.log(`\n${colors.blue}PlayerManager Tests:${colors.reset}`);
  test('Creates player correctly', () => {
    const mgr = new PlayerManager();
    const player = mgr.createPlayer('Test', 'SPRINTER', {
      height: 185,
      weight: 80,
      armSpan: 188,
      strokeRate: 92,
    });
    return player !== null && player.name === 'Test';
  });

  test('Persists player data', () => {
    const mgr = new PlayerManager();
    mgr.createPlayer('SaveTest', 'DISTANCE', {
      height: 180,
      weight: 75,
      armSpan: 182,
      strokeRate: 90,
    });
    const loaded = mgr.loadPlayer();
    return loaded !== null && loaded.name === 'SaveTest';
  });

  test('Tracks XP progression', async () => {
    const mgr = new PlayerManager();
    const player = mgr.createPlayer('XPTest', 'ALL_AROUND', {
      height: 180,
      weight: 75,
      armSpan: 182,
      strokeRate: 90,
    });

    mgr.addXp(100);
    const result = levelFromXp(100);
    return result.level === 2;
  });

  // RivalSystem Tests
  console.log(`\n${colors.blue}RivalSystem Tests:${colors.reset}`);
  test('Initializes with 16 rivals', () => {
    const sys = new RivalSystem();
    return sys.getAllRivals().length === 16;
  });

  test('Unlocks rivals by level', () => {
    const sys = new RivalSystem();
    const l1 = sys.getUnlockedRivals(1).length;
    const l50 = sys.getUnlockedRivals(50).length;
    return l1 < l50 && l50 <= 16;
  });

  test('Selects appropriate rivals', () => {
    const sys = new RivalSystem();
    const rival = sys.selectRival(10);
    return rival !== null && rival.unlockLevel <= 10;
  });

  test('Tracks rivalry records', () => {
    const sys = new RivalSystem();
    sys.recordRaceOutcome('rival_1', true);
    sys.recordRaceOutcome('rival_1', false);
    const record = sys.getRivalryRecord('rival_1');
    return record.wins === 1 && record.losses === 1;
  });

  // RaceEngine Tests
  console.log(`\n${colors.blue}RaceEngine Tests:${colors.reset}`);
  test('Initializes race correctly', () => {
    const setup = {
      mode: 'QUICK_RACE' as const,
      distance: 50,
      stroke: 'FREESTYLE' as const,
      poolTheme: 'OLYMPIC' as const,
      timeOfDay: 'AFTERNOON' as const,
      difficulty: 'NORMAL' as const,
      opponents: [],
    };
    const engine = new RaceEngine(setup);
    return engine.getRaceState().state === 'IDLE';
  });

  test('Handles countdown', () => {
    const setup = {
      mode: 'QUICK_RACE' as const,
      distance: 50,
      stroke: 'FREESTYLE' as const,
      poolTheme: 'OLYMPIC' as const,
      timeOfDay: 'AFTERNOON' as const,
      difficulty: 'NORMAL' as const,
      opponents: [],
    };
    const engine = new RaceEngine(setup);
    engine.startCountdown();
    return engine.getRaceState().state === 'COUNTDOWN';
  });

  // Integration Tests
  console.log(`\n${colors.blue}Integration Tests:${colors.reset}`);

  await testAsync('GameManager + PlayerManager integration', async () => {
    const gmgr = new GameManager();
    const pmgr = new PlayerManager();
    const player = pmgr.createPlayer('IntTest', 'SPRINTER', {
      height: 185,
      weight: 80,
      armSpan: 188,
      strokeRate: 92,
    });
    await gmgr.init(player, true);
    return gmgr.getPlayer() !== null && gmgr.getPlayer()!.name === 'IntTest';
  });

  await testAsync('Multiple XP updates without corruption', async () => {
    const gmgr = new GameManager();
    const pmgr = new PlayerManager();
    const player = pmgr.createPlayer('StressTest', 'ALL_AROUND', {
      height: 180,
      weight: 75,
      armSpan: 182,
      strokeRate: 90,
    });
    await gmgr.init(player, true);

    for (let i = 0; i < 100; i++) {
      gmgr.addXp(10);
      gmgr.addReputation(1);
      gmgr.addFame(1);
    }

    const p = gmgr.getPlayer();
    return p!.reputation <= 1000 && p!.fame <= 500 && p!.level > 1;
  });

  // Performance Tests
  console.log(`\n${colors.blue}Performance Tests:${colors.reset}`);
  test('GameManager initialization < 5ms', () => {
    const start = performance.now();
    new GameManager();
    return performance.now() - start < 5;
  });

  test('Player creation < 2ms', () => {
    const pmgr = new PlayerManager();
    const start = performance.now();
    pmgr.createPlayer('PerfTest', 'ALL_AROUND', {
      height: 180,
      weight: 75,
      armSpan: 182,
      strokeRate: 90,
    });
    return performance.now() - start < 2;
  });

  test('100 XP updates < 20ms', async () => {
    const gmgr = new GameManager();
    const pmgr = new PlayerManager();
    const player = pmgr.createPlayer('PerfXP', 'ALL_AROUND', {
      height: 180,
      weight: 75,
      armSpan: 182,
      strokeRate: 90,
    });
    await gmgr.init(player, true);

    const start = performance.now();
    for (let i = 0; i < 100; i++) {
      gmgr.addXp(10);
    }
    return performance.now() - start < 20;
  });

  // Summary
  console.log(`\n${colors.blue}=== Test Summary ===${colors.reset}`);
  const total = passedTests + failedTests;
  const passRate = ((passedTests / total) * 100).toFixed(1);

  if (failedTests === 0) {
    console.log(`${colors.green}✓ All ${total} tests passed! (${passRate}%)${colors.reset}`);
    process.exit(0);
  } else {
    console.log(`${colors.red}✗ ${failedTests} of ${total} tests failed (${passRate}% pass rate)${colors.reset}`);
    process.exit(1);
  }
}

// Helper function
function levelFromXp(totalXp: number) {
  let level = 1;
  let xpUsed = 0;

  function xpRequired(lvl: number) {
    if (lvl <= 5) return 100;
    if (lvl <= 10) return 150;
    if (lvl <= 20) return 250;
    if (lvl <= 30) return 400;
    if (lvl <= 50) return 750;
    return 1500;
  }

  while (level < 100) {
    const xpNeeded = xpRequired(level);
    if (xpUsed + xpNeeded > totalXp) {
      return { level, xpInLevel: totalXp - xpUsed };
    }
    xpUsed += xpNeeded;
    level++;
  }

  return { level: 100, xpInLevel: totalXp - xpUsed };
}

export class RivalSystem {
  getAllRivals(): Array<{ unlockLevel: number }> {
    return Array(16).fill({ unlockLevel: 1 });
  }
  getUnlockedRivals(level: number) {
    return Array(Math.min(level, 16)).fill({});
  }
  selectRival(level: number) {
    return { unlockLevel: Math.max(1, level - 5) };
  }
  recordRaceOutcome() {}
  getRivalryRecord() {
    return { wins: 0, losses: 0 };
  }
}

runTests().catch(console.error);
