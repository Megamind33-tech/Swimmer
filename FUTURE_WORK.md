# FUTURE WORK — Swimmer-Three

This file tracks all deferred gameplay, graphics, and systems tasks.
UI Phase 1 is the current focus; everything below is planned for later phases.

---

## PHASE 2 — Gameplay Systems Integration

### StrokeSystem → RaceScene
- [ ] Replace RAF simulation stub in `RaceScene.tsx` with real `StrokeSystem` from `src/gameplay/StrokeSystem.ts`
- [ ] Alternate left/right stroke tap inputs via `StrokeSystem.registerStroke(side)`
- [ ] Read real stamina drain/recovery from `StrokeSystem` each frame
- [ ] Expose stroke rhythm feedback (timing window, perfect/good/miss) to the HUD
- [ ] Add stroke power meter that responds to tap timing, not just tap presence

### TurnSystem → RaceScene
- [ ] Integrate `TurnSystem` from `src/gameplay/TurnSystem.ts`
- [ ] Detect wall proximity from `ArenaManager` and trigger turn prompt overlay
- [ ] Animate turn flip camera cut (brief front-view cut when swimmer touches the wall)
- [ ] Award turn bonus speed if tap is within the turn timing window
- [ ] Show turn quality badge (PERFECT / GOOD / LATE) in HUD for 1.5 s after turn

### AISwimmer → Race
- [ ] Spawn AI swimmers via `AISwimmer` from `src/gameplay/AISwimmer.ts`
- [ ] Give each AI swimmer a visible 3D model via `SwimmerManager`
- [ ] Drive AI position updates into the lane progress markers in the HUD
- [ ] Show real opponent names, not hardcoded "McKenzie, Luna S." etc.
- [ ] Implement rival targeting: highlight the swimmer directly ahead of the player

### RivalSystem
- [ ] Wire `RivalSystem` from `src/gameplay/RivalSystem.ts`
- [ ] Show "Rival Nearby" badge when a designated rival is within 1 lane-length
- [ ] Track rival win/loss record and display on pre-race screen

---

## PHASE 2 — Graphics / 3D

### SwimmerModel + SwimmerManager
- [ ] Spawn player swimmer mesh via `SwimmerManager.spawnSwimmer()` at race start
- [ ] Animate swimmer mesh using stroke cycle (arm pull, kick, rotation)
- [ ] Sync mesh position to race simulation distance each frame
- [ ] Spawn AI swimmer meshes in adjacent lanes
- [ ] Support cosmetic skins (cap color, suit color) from `LockerRoomScreen`

### BroadcastCamera
- [ ] Call `ArenaManager.enableBroadcastMode()` when race starts
- [ ] Feed `raceState` and player `ISwimmerRaceState` into `updateBroadcastCameraRace()`
- [ ] Enable cinematic cuts: start-block → underwater → side-rail → aerial at finish
- [ ] Trigger `onRaceProgress` updates every 5 m of player progress
- [ ] Trigger `onSwimmerFinished` on race completion for slow-mo finish cam

### Water Material
- [ ] Upgrade `createWater()` in `ArenaManager` to use `@babylonjs/materials` `WaterMaterial` with proper reflection/refraction
- [ ] Add caustics texture animation on pool floor
- [ ] Add splash particle system on stroke input

### Underwater Camera View
- [ ] Implement underwater sub-surface camera angle during race
- [ ] Apply underwater color grade (desaturated blue-green tint, light scatter)
- [ ] Add bubble particle trail behind swimmer mesh

### RaceRecorder + ReplayController
- [ ] Record every frame of race to `RaceRecorder` (position, stroke events, turns)
- [ ] Wire "Watch Replay" button in `RaceResultScreen` to `ReplayController.play()`
- [ ] Add replay speed controls (0.5×, 1×, 2×) to `RaceReplayScreen`

---

## PHASE 2 — RaceEngine Integration

- [ ] Replace stub distance/stamina math in `RaceScene` with `RaceEngine.update(deltaTime)`
- [ ] Use `RaceController` to manage race state transitions (COUNTDOWN → RACING → FINISH)
- [ ] Integrate `GameManager.startRace()` / `GameManager.finishRace()` lifecycle
- [ ] Pipe `raceUpdated` events from `GameManager` into HUD state updates

---

## PHASE 3 — Input & Feel

### TouchControls
- [ ] Use `TouchControls` from `src/gameplay/TouchControls.ts` instead of raw `onPointerDown`
- [ ] Implement swipe-up gesture for dolphin kick / surge burst
- [ ] Add haptic feedback on stroke (navigator.vibrate) where supported
- [ ] Long-press on a lane to view rival stats mid-race

### DeviceSourceManager
- [ ] Integrate Babylon `DeviceSourceManager` for unified touch + gamepad input
- [ ] Map gamepad L1/R1 to left/right stroke for console-style play

---

## PHASE 3 — Career & Club Systems

### PlayerManager
- [ ] Persist player data via `PlayerManager` (localStorage or API)
- [ ] Load real player level, XP, coins, gems into `TopBar`
- [ ] Wire `GameManager.addXp()` and `addFame()` to post-race results

### Career Events
- [ ] Implement `getCareerEventAt(index)` in `GameManager` from a real career events database
- [ ] Show career event context (opponent, venue, distance) in `PreRaceSetupScreen`
- [ ] Career mode race chain: complete event → unlock next → animate progression

### Club Management
- [ ] Connect `ClubManagement` page to real club data (not hardcoded)
- [ ] Implement staff hiring from `StaffManagement` design spec
- [ ] Club vs club challenge: asynchronous async races against rival clubs

### Training System
- [ ] Wire `TrainingPage` to actual stat improvement logic
- [ ] Show training effect in swimmer card stats after session
- [ ] Implement `WarmupSystem` for pre-race warm-up animation sequence

---

## PHASE 3 — Environments

- [ ] `LockerRoomEnvironment` → show as Babylon scene on locker room screen
- [ ] `SchoolGymEnvironment` → training facility Babylon scene
- [ ] `TrainingFacilityEnvironment` → interactive training session 3D view
- [ ] Coach model (`CoachModel.ts`) → visible coach on locker room / training screens
- [ ] `DialogueSystem` → coach pre-race briefing with typed text overlay

---

## PHASE 4 — Online & Social

- [ ] Real multiplayer race matchmaking (WebSocket / WebRTC)
- [ ] Ranked match leaderboard (live data)
- [ ] Social club chat feed (real backend)
- [ ] Async ghost race: download rival ghost replay and race against it
- [ ] Global talent scout: browse player cards from server

---

## PHASE 4 — Polish & Performance

- [ ] `RenderingOptimizer` integration: LOD, frustum culling, batching
- [ ] Target 60 fps on mid-range mobile; fall back to 30 fps with `fpsTarget` setting
- [ ] Progressive asset loading: show pool shell first, add detail LODs after
- [ ] Sound system: stroke splash, crowd cheer, start beep, finish fanfare
- [ ] Accessibility: colorblind-safe HUD mode, larger touch targets option

---

## DEFERRED / CLEANUP

- [ ] Remove `BrowserToolkit.tsx` from production build (dev-only inspector)
- [ ] Remove `USAGE_EXAMPLES.tsx` from `src/components/screens/`
- [ ] Remove `CinematicOpening.tsx` if it is not wired to any real game flow
- [ ] Audit and prune `src/examples/` — either promote to real code or delete
- [ ] Replace all hardcoded `magicpatterns.com` image URLs with real assets
- [ ] Replace remaining emoji icons in `RaceScene.tsx` (🫴 🤲) with proper SVG icons from the icon registry
- [ ] Delete duplicate `RaceGameplayHUD.tsx` that exists in both `src/components/` and `src/components/screens/`
- [ ] Delete duplicate `TopBar.tsx` that exists in both `src/components/` and `src/components/menu/`
- [ ] Consolidate all test files under `src/__tests__/` — currently scattered

---

*Last updated: Phase 1 UI Foundation (see ARCHITECTURE.md)*
