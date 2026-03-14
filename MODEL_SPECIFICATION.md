# 3D SWIMMER MODEL SPECIFICATION & INTEGRATION PLAN
## Critical Planning Document for Week 5 Implementation

**Status**: AWAITING USER APPROVAL
**Date**: 2026-03-14
**Purpose**: Define exact model types, animation system, and behavioral control before any coding

---

## DECISION MATRIX: MODEL SOURCES & FORMATS

### OPTION A: Procedurally Generated Models (Recommended for MVP)

**How it works:**
- Generate swimmer mesh at runtime using Babylon.js procedural geometry
- Head, torso, arms, legs as separate meshes combined
- Apply materials/colors for customization

**Pros:**
✅ Zero external asset dependencies
✅ Fully customizable colors (suit, cap, goggles)
✅ Small file size (no model loading)
✅ Complete behavioral control (modify geometry in real-time)
✅ Mobile-friendly (no model LOD needed)
✅ Works with existing arena code (no import conflicts)

**Cons:**
❌ Lower visual quality (geometric look)
❌ More code to maintain (geometry generation)
❌ Limited customization (face presets harder)

**Performance Budget:**
- Per swimmer: 5,000-8,000 vertices
- 8 swimmers: 40-64K total (well within budget)
- Animation: CPU-based transform updates (no GPU skinning)

**Customization Approach:**
- Head: 3 color variations (face presets)
- Torso/Legs: Material color swap (suit colors)
- Arms: Material color swap
- Cap: Separate mesh with color material
- Goggles: Small spheres with tinted material

---

### OPTION B: Pre-made glTF Models (Alternative)

**How it works:**
- Use glTF 2.0 format models (standardized 3D format)
- Import via Babylon.js glTF loader
- Models have skeletal rigs for animation

**Pros:**
✅ Higher visual quality
✅ Professional appearance
✅ Skeletal animation (more realistic)
✅ Industry standard format

**Cons:**
❌ Need to source or create models (cost/time)
❌ File size per model (~500KB-2MB uncompressed, ~50-200KB compressed)
❌ Must handle material customization carefully
❌ Complexity with skin deformation + suit colors
❌ Potential conflicts with existing arena materials
❌ Mobile loading time impacts (multiple async loads)

**Performance Budget:**
- Per swimmer: 20,000-50,000 vertices (with LOD: 5K-15K)
- 8 swimmers: Need aggressive LOD system
- Animation: GPU skeletal skinning (more expensive)

**Model Requirements If Chosen:**
- Format: glTF 2.0 (.glb preferred - binary, compressed)
- Rig: Standard humanoid skeleton (Armature with 25+ bones)
- Animations: Idle, Swimming (4 strokes), Breathing, Victory
- Material setup: Able to swap colors (PBR materials preferred)

---

### OPTION C: Hybrid Approach (Custom Procedural with Animation Blending)

**How it works:**
- Procedural base geometry (fast, customizable)
- Pre-baked animation data (keyframes per stroke)
- Blend animations based on RaceController state

**Pros:**
✅ Best of both: Performance + Animation quality
✅ Lightweight (procedural geometry)
✅ Smooth animations (pre-baked keyframes)
✅ Full customization (materials)
✅ Mobile friendly

**Cons:**
❌ Most complex implementation
❌ Requires animation keyframe generation
❌ More code to debug

---

## **RECOMMENDED: OPTION A (Procedural Models)**

**Why for MVP:**
1. **Zero external dependencies** - No model files to load, no import issues
2. **Complete control** - Can modify geometry based on player stats
3. **Mobile performance** - Lightweight, no async loading delays
4. **Full customization** - Suit colors, cap styles, goggles independently
5. **No breaking changes** - Won't interfere with existing Babylon.js arena code
6. **Behavioral sync** - Direct control over mesh transforms = perfect animation timing

---

## ANIMATION SYSTEM ARCHITECTURE

### Animation State Machine

```
SwimmerAnimationController
├─ State: IDLE (starting blocks)
├─ State: DIVING (dive entry animation, 0.6s)
├─ State: UNDERWATER (kick phase, variable duration)
├─ State: STROKE (arm motion, varies by stroke)
├─ State: BREATHING (surface phase, 0.5-1s)
├─ State: TURNING (turn at wall, 0.3-0.5s)
├─ State: FINISHED (victory pose)
└─ State: DNF (defeat pose)

Transitions trigger based on RaceController events:
- raceBegin → DIVING
- turnApproaching → TURNING
- underwaterPhaseStart → UNDERWATER
- underwaterPhaseEnd → BREATHING
- raceFinished → FINISHED
```

### Animation Execution Flow

```
RaceController.updateRace(deltaTime)
  ↓
RaceController updates ISwimmerRaceState
  ├─ position (0 → raceDistance)
  ├─ velocity
  ├─ stamina / oxygen
  ├─ isUnderwater
  └─ currentStrokePhase (0-1)
  ↓
SwimmerAnimationController receives state update
  ├─ Calculate which animation should play
  ├─ Calculate animation progress (0-1)
  ├─ Apply animation keyframes to mesh
  ├─ Apply customization materials
  └─ Emit visual state change
  ↓
Babylon.js renders mesh to canvas
```

### Synchronized Animation Details

**Freestyle Stroke (2 taps/cycle, 3.5s underwater)**
```
Cycle Time: 4.5s (3.5s underwater + 1s recovery)

0.0s → 1.75s: Right arm pull (back to front)
1.75s → 3.5s: Left arm pull (back to front)
3.5s → 4.5s: Recovery (arms return)

Body rotation: ±20° roll side-to-side
Leg motion: Flutter kick (2-3 Hz oscillation)
Head: Every 2 cycles, turn for breath
```

**Breaststroke (1 tap/cycle, 2.5s underwater)**
```
Cycle Time: 3.5s (2.5s underwater + 1s recovery)

0.0s → 0.8s: Arm pull (simultaneous, chest)
0.8s → 1.2s: Leg kick (frog kick)
1.2s → 2.5s: Glide phase (minimal motion)
2.5s → 3.5s: Recovery (arms extend forward)

Head: Lifts every cycle for mandatory breathing
Body: Minimal rotation, undulating motion
```

**Butterfly (1 tap/cycle, 4.5s underwater)**
```
Cycle Time: 5.5s (4.5s underwater + 1s recovery)

0.0s → 1.5s: First arm stroke (pull)
1.5s → 3.0s: Second arm stroke (catch/recovery)
3.0s → 4.5s: Dolphin kick momentum (wave-like)
4.5s → 5.5s: Recovery

Head: Lifts every cycle (mandatory)
Body: Dramatic wave motion (most complex)
Legs: Synchronized dolphin kick
```

**Backstroke (2 taps/cycle, 3.5s underwater)**
```
Cycle Time: 4.5s (3.5s underwater + 1s recovery)

0.0s → 0.9s: Right arm pull (recovery phase start)
0.9s → 2.0s: Right arm drive (power phase)
2.0s → 3.0s: Left arm pull/drive
3.0s → 3.5s: Left arm recovery
3.5s → 4.5s: Body roll and leg kick

Head: Back stays on surface, breathing continuous
Body: Roll ±30° per side (more than freestyle)
```

---

## CUSTOMIZATION & MATERIAL SYSTEM

### Suit Customization (5 parts controllable)

```typescript
interface SwimmerCustomization {
  // Color system
  suitColor: {
    mainColor: Color3;      // Primary suit color
    trimColor: Color3;      // Sleeve/leg trim
    logoColor: Color3;      // Chest logo
  };

  capStyle: {
    style: 'CLASSIC' | 'MODERN' | 'RACING' | 'SWIMMING';
    color: Color3;
    pattern: 'SOLID' | 'STRIPE' | 'GRADIENT';
  };

  gogglesStyle: {
    style: 'STANDARD' | 'TINTED' | 'MIRRORED' | 'CLEAR';
    lensColor: Color3;      // Lens tint
    frameColor: Color3;
  };

  bodyTone: number;         // 0-1 (skin tone darkness)
  facePreset: number;       // 0-4 (different head shapes)
}
```

### Material Assignment Strategy

```
Head mesh
  ├─ material: SkinMaterial (body tone)
  └─ Can't change face appearance (use head shape presets)

Body/Torso mesh
  ├─ material: SuitMaterial (mainColor)
  └─ Updated via: material.diffuse = newColor

Arms mesh
  ├─ material: SuitMaterial (mainColor)
  └─ Shoulders: trimColor

Legs mesh
  ├─ material: SuitMaterial (mainColor)
  └─ Thighs: trimColor

Cap mesh
  ├─ material: CapMaterial (capColor)
  └─ Pattern applied via shader or texture

Goggles mesh
  ├─ material: GogglesMaterial (lensColor + frameColor)
  └─ Lens reflection possible (PBR)
```

**Color Application Method:**
- Use Babylon.js StandardMaterial with diffuse color
- No texture changes needed (procedural geometry doesn't use UV mapping)
- Direct Color3 assignment to material properties
- GPU-side color change (instant, efficient)

---

## BEHAVIORAL CONTROL FLOW

### How Swimmer Motion is Controlled

```
Week 4 System (Already working)
└─ RaceController
   ├─ Calculates swimmer position (0 → raceDistance)
   ├─ Calculates velocity
   ├─ Emits race events
   └─ Stores in IRaceState.swimmers[]

Week 5 System (NEW - Behavioral Layer)
└─ SwimmerVisualController (per swimmer)
   ├─ Receives: ISwimmerRaceState (from RaceController)
   ├─ Receives: RaceController events (progress, turn, finish)
   ├─ Manages: Mesh geometry & animations
   ├─ Manages: Material colors & customization
   ├─ Updates: Position in 3D space (based on lane + position)
   ├─ Updates: Rotation (dive angle, turn angle)
   ├─ Updates: Animation state (idle → diving → stroke → breathing)
   └─ Renders: Babylon.js scene each frame
```

### Behavioral Guarantees

**Position Sync:**
- Swimmer visual position = (position / raceDistance) × poolLength
- Exact sync with RaceController (no animation drift)
- All 8 swimmers rendered simultaneously

**Animation Sync:**
- Animation plays based on RaceController.getSwimmerState()
- Stroke phase from RaceEngine (if integrated)
- No delays or buffering (real-time updates)

**Customization Sync:**
- Colors applied at race start (not changed mid-race)
- Can change for next race
- Stored in PlayerManager.cosmetics

**Behavioral Control:**
- AI opponent pace → Animation speed multiplier
- RaceController position → Mesh translation
- Turn timing → Rotation animation trigger
- Finish line crossing → Victory animation trigger

---

## INTEGRATION ARCHITECTURE

### File Structure for Week 5

```
src/
├─ gameplay/
│  ├─ SwimmerAnimationController.ts (300 lines)
│  │  ├─ Manages animation state machine
│  │  ├─ Updates mesh geometry per frame
│  │  ├─ Applies keyframe animations
│  │  └─ Handles stroke-specific motion
│  │
│  └─ SwimmerVisualController.ts (350 lines)
│     ├─ Manages individual swimmer visuals
│     ├─ Applies customization (colors, cap, goggles)
│     ├─ Syncs with RaceController updates
│     └─ Handles lifecycle (create, update, cleanup)
│
├─ graphics/
│  ├─ SwimmerMeshBuilder.ts (400 lines)
│  │  ├─ Procedurally generates swimmer geometry
│  │  ├─ Creates: Head, torso, arms, legs meshes
│  │  ├─ Creates: Cap and goggles meshes
│  │  └─ Stores mesh templates for reuse
│  │
│  ├─ SwimmerMaterialFactory.ts (200 lines)
│  │  ├─ Creates materials (skin, suit, cap, goggles)
│  │  ├─ Handles color customization
│  │  └─ Manages material instances
│  │
│  └─ SwimmerRenderManager.ts (300 lines)
│     ├─ Manages all swimmers' visual rendering
│     ├─ Updates positions/rotations each frame
│     ├─ Camera management (which swimmer to follow)
│     ├─ LOD system (if needed)
│     └─ Cleanup on race end
│
└─ types/
   └─ swimmer-visuals.ts (150 lines)
      ├─ ISwimmerVisuals (mesh, animation state)
      ├─ IAnimationKeyframe (position, rotation, time)
      └─ ISwimmerMesh (head, body, arms, legs, cap, goggles)
```

### Integration with Existing Code (CRITICAL - No Breaking Changes)

**ArenaManager (Existing - Week 1)**
```typescript
// BEFORE: Only manages pool, lane markers, spectators
export class ArenaManager { ... }

// AFTER: Added swimmer container support
export class ArenaManager {
  private swimmerContainer: TransformNode; // NEW

  // NEW method
  public getSwimmerContainer(): TransformNode {
    return this.swimmerContainer;
  }

  // Existing methods unchanged
  setupScene() { ... }
  setupLighting() { ... }
  setupCamera() { ... }
}

// ✅ NO BREAKING CHANGES - Only additions
```

**RaceController (Existing - Week 4)**
```typescript
// NO CHANGES NEEDED
// Already emits all events SwimmerVisualController needs:
// - raceCountdown
// - raceBegin
// - raceProgress
// - swimmerFinished
// - raceFinished
// - swimmerTurnApproaching (new event, for animation)

// Just need to ADD one event emission:
this.emit('swimmerStateUpdate', {
  swimmerId: string,
  state: ISwimmerRaceState,
});
```

**App.tsx (Existing - Root component)**
```typescript
// MINIMAL changes:
// 1. Import SwimmerRenderManager
// 2. Initialize on race start
// 3. Update swimmers each frame
// 4. Cleanup on race end

// Existing Game Loop (Babylon.js):
scene.onBeforeRender = () => {
  // Existing code
  gameLoop(deltaTime);

  // NEW: Update swimmer visuals
  if (swimmerRenderManager && raceState) {
    swimmerRenderManager.updateSwimmers(raceState.swimmers, deltaTime);
  }
};

// ✅ Only additions, no modifications to existing rendering
```

### Event Flow Diagram

```
RaceController
├─ raceStart → SwimmerRenderManager creates 8 SwimmerVisualControllers
├─ raceCountdown(3,2,1,0) → SwimmerAnimationController plays "ready" pose
├─ raceBegin → SwimmerAnimationController transitions to DIVING
├─ raceProgress(every 500ms) → RaceState updated
│  └─ SwimmerRenderManager.updateSwimmers()
│     ├─ Update position (poolLength * (position / raceDistance))
│     ├─ Update rotation (dive angle, turn angle)
│     ├─ Update animation state (based on isUnderwater, stroking)
│     └─ Update mesh transforms
├─ turnApproaching → SwimmerAnimationController prepares TURNING
├─ swimmerFinished → SwimmerAnimationController plays FINISHED (celebration)
└─ raceFinished → All visual updates stop, results screen shown
```

---

## PERFORMANCE BUDGET & MOBILE TARGETS

### Memory Budget

| Component | Per Swimmer | 8 Swimmers | Target |
|-----------|------------|-----------|--------|
| Geometry (vertices) | 8K | 64K | <100K |
| Materials | 6 | 48 | <100 |
| Textures | 0 (procedural) | 0 | <50MB total |
| Animation data (RAM) | 50KB | 400KB | <5MB |
| **Total per race** | **~100KB** | **~800KB** | **<10MB** |

### GPU Budget

| Operation | Per Frame | Target |
|-----------|-----------|--------|
| Mesh updates | 8 transforms | <1ms |
| Material updates | 48 diffuse changes | <0.5ms |
| Vertex shader | 64K vertices | <2ms |
| Fragment shader | 64K pixels (quad) | <1ms |
| **Total GPU time** | | **<5ms** |

### Mobile Device Targets

| Device | Processor | RAM | Expected FPS |
|--------|-----------|-----|--------------|
| iPhone 12 | A14 | 4GB | 60 FPS ✅ |
| Galaxy A52 | Snapdragon 720G | 4GB | 30-45 FPS ✅ |
| Pixel 4a | Snapdragon 765G | 6GB | 45-60 FPS ✅ |
| Budget Android | Snapdragon 400 | 2GB | 20-30 FPS ⚠️ |

**LOD Strategy (if needed):**
- High quality: All 8 swimmers full detail
- Medium: Opponent swimmers simplified (5K vertices)
- Low: Distant swimmers as billboard sprites

---

## ANIMATION KEYFRAME STORAGE

### How Keyframes Work

```typescript
// Pre-computed keyframes for each stroke & phase
interface AnimationKeyframe {
  time: number;           // 0.0 to 1.0 (percentage of cycle)

  // Skeletal transforms (for procedural)
  armRotation: Quaternion; // Left/right arm angle
  legRotation: Quaternion; // Left/right leg angle
  torsoRotation: Quaternion; // Body roll
  headRotation: Quaternion;  // Head tilt/turn

  // Position offsets
  bodyBob: number;        // Vertical movement (-0.2 to 0.2 units)
  forwardLunge: number;   // Forward reach (-0.1 to 0.3 units)

  // Procedural mesh deformations
  armStretch: number;     // Extend arm forward (0 to 1)
  legKick: number;        // Leg motion intensity (0 to 1)
}

// Storage for Freestyle stroke, underwater phase
const FreestyleUnderwater = [
  { time: 0.00, armRotation: Quaternion.FromDegrees(-90, 0, 0), ... },
  { time: 0.25, armRotation: Quaternion.FromDegrees(-45, 0, 0), ... },
  { time: 0.50, armRotation: Quaternion.FromDegrees(0, 0, 0), ... },
  { time: 0.75, armRotation: Quaternion.FromDegrees(45, 0, 0), ... },
  { time: 1.00, armRotation: Quaternion.FromDegrees(-90, 0, 0), ... },
];

// In animation update loop:
const progress = (time % cycleDuration) / cycleDuration; // 0-1
const keyframe = interpolateKeyframes(FreestyleUnderwater, progress);
applyKeyframeToMesh(swimmerMesh, keyframe);
```

---

## TESTING & VALIDATION STRATEGY

### Phase 5 Testing (Before Merge)

```bash
✅ UNIT TESTS:
  - SwimmerMeshBuilder creates valid geometry
  - SwimmerMaterialFactory applies colors correctly
  - SwimmerAnimationController transitions states properly
  - Keyframe interpolation is smooth (no jumps)

✅ INTEGRATION TESTS:
  - RaceController → SwimmerVisualController event flow
  - 8 swimmers render simultaneously without lag
  - Customizations apply before race starts
  - Animation syncs with RaceController position

✅ PERFORMANCE TESTS:
  - <100ms per frame (60 FPS target)
  - <5ms GPU time for swimmer rendering
  - Memory stable over 30-minute race session
  - No memory leaks in mesh cleanup

✅ VISUAL TESTS:
  - Swimmers visible in all lanes (1-8)
  - Animations smooth and realistic
  - Customization colors correct
  - No clipping with arena or spectators

✅ MOBILE TESTS:
  - 30+ FPS on Galaxy A52 sustained
  - Touch input responsive (not blocked by rendering)
  - Camera follow smooth
  - No crashes on 2GB RAM devices
```

### Manual Gameplay Testing

```
1. Start Quick Race (50m Freestyle, Normal difficulty)
2. Verify countdown animation plays (all 8 swimmers in ready pose)
3. Verify dive phase (swimmers arch and enter water)
4. Verify underwater phase (leg kicks, minimal arm motion)
5. Verify stroke phase (arm strokes in sync with RaceController)
6. Verify breathing phase (head comes up, arms recover)
7. Verify turn (at 25m, swimmers rotate and push off)
8. Verify finish (celebration pose when crossing 50m)
9. Verify camera follow (focuses on player swimmer)
10. Complete full race without crashes or lag
```

---

## DECISION CHECKLIST - AWAITING APPROVAL

### Model Source Decision

- [ ] **OPTION A (Procedural)** - RECOMMENDED
  - Confirm: Use procedurally generated swimmer meshes
  - Confirm: No external model files
  - Confirm: Full color customization

- [ ] **OPTION B (glTF Models)** - ALTERNATIVE
  - Confirm: Source/create glTF models
  - Confirm: Handle loading & LOD system
  - Confirm: Customization approach for materials

- [ ] **OPTION C (Hybrid)** - ADVANCED
  - Confirm: Build procedural base + animation blending
  - Confirm: Generate keyframe data

### Animation System Decision

- [ ] Confirm: Animation state machine approach
- [ ] Confirm: Keyframe-based animation (not skeletal skinning)
- [ ] Confirm: 4 stroke types with unique animations
- [ ] Confirm: Synchronized with RaceController updates
- [ ] Confirm: No animation drift (position-locked)

### Integration Approach Decision

- [ ] Confirm: No modifications to ArenaManager (existing code safe)
- [ ] Confirm: Add SwimmerRenderManager as new system
- [ ] Confirm: One event addition to RaceController (swimmerStateUpdate)
- [ ] Confirm: Game loop update for swimmer rendering
- [ ] Confirm: Cleanup on race end

### Customization Strategy Decision

- [ ] Confirm: Color-based customization (suit, cap, goggles)
- [ ] Confirm: Material system (no texture loading)
- [ ] Confirm: 5 face presets (head shape variants)
- [ ] Confirm: Applied at race start (not changeable mid-race)
- [ ] Confirm: Synced with PlayerManager.cosmetics

### Performance Targets Decision

- [ ] Confirm: <5ms per frame for swimmer updates
- [ ] Confirm: <100MB memory per race
- [ ] Confirm: 30+ FPS on mid-range Android
- [ ] Confirm: 60 FPS on modern devices
- [ ] Confirm: LOD system if needed (optional)

### File Structure Decision

- [ ] Confirm: SwimmerMeshBuilder (procedural geometry)
- [ ] Confirm: SwimmerAnimationController (animation state machine)
- [ ] Confirm: SwimmerVisualController (per-swimmer management)
- [ ] Confirm: SwimmerMaterialFactory (colors & customization)
- [ ] Confirm: SwimmerRenderManager (overall orchestration)

---

## CRITICAL SUCCESS FACTORS

**If we get these wrong, Week 5 fails:**

1. **Model Format**: Wrong format = rebuild everything
   - Decision: Procedural (safest) or glTF (complex)?

2. **Animation Sync**: Animation drift = visual lag
   - Decision: Position-locked (guaranteed sync)?

3. **Customization**: Can't change colors = useless
   - Decision: Material-based color swap only?

4. **Integration Safety**: Break ArenaManager = disaster
   - Decision: Zero modifications to existing code?

5. **Performance**: >100ms = game unplayable
   - Decision: Procedural (fast) or glTF with LOD (complex)?

---

## NEXT STEPS (After Approval)

1. **Get explicit approval** on all checkbox items above
2. **Create Week 5 Master Prompt** with chosen approach
3. **Update IMPLEMENTATION_EXECUTION_PLAN.md** with confirmed approach
4. **Begin Week 5 implementation** with zero ambiguity

**DO NOT PROCEED until ALL decisions are explicitly approved.**

---

**Questions for you:**

1. Which model approach do you prefer? (Procedural / glTF / Hybrid)
2. Any specific animation quality expectations?
3. How important is face customization vs just suit colors?
4. Any concerns about procedural geometry vs realistic models?
5. Mobile performance: What's minimum acceptable FPS?

Please explicitly approve/reject each decision before we code Week 5.
