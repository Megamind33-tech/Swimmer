# Swimmer — 3D Arena Realism Upgrade Notes
## Phase 1 Audit & Refactor

---

## 1. Structured Audit

### 1.1 What currently breaks realism

#### Pool Geometry
| Issue | Location | Severity |
|-------|----------|----------|
| Pool was a single opaque solid box — no visible interior | `ArenaManager.createArena()` | HIGH |
| Wall thickness 0.3 m — too thin for close-up cameras | same | MEDIUM |
| No coping / overflow-gutter tile around pool edge | same | MEDIUM |
| No T-mark (black cross) painted on pool floor at 5 m from ends | missing entirely | MEDIUM |
| No depth-gradient on pool walls (lighter at top, dark at bottom) | material | LOW |
| No grout-line tile texture — solid flat blue colour | material | MEDIUM |

#### Water
| Issue | Location | Severity |
|-------|----------|----------|
| Water animation was `waterMesh.rotation.z += 0.001` — spins the whole plane, does nothing visible | `createWater()` render loop | HIGH |
| `StandardMaterial` with no reflections, no refraction, no wave simulation | material | HIGH |
| Alpha 0.9 hides pool floor completely — blocks any sense of depth | material | HIGH |
| Specular power 64 was adequate but not enough for wet-surface highlight | material | LOW |

#### Lighting
| Issue | Location | Severity |
|-------|----------|----------|
| Only 1 HemisphericLight + 1 PointLight — completely flat, shadowless | `createLighting()` | HIGH |
| `scene.shadowsEnabled = true` was set but no ShadowGenerator existed — the flag was a no-op | `setQualityPreset()` | HIGH |
| Time-of-day only changed `hemiLight.specular` (not diffuse) — effect nearly invisible | `setTimeOfDay()` | MEDIUM |
| No arena flood lights (stadium drama, pool glitter) | missing | HIGH |
| No directional key light (shadows indicate structure and depth) | missing | MEDIUM |
| No caustic light projection on pool floor | missing | MEDIUM |

#### Arena Architecture
| Issue | Location | Severity |
|-------|----------|----------|
| `hallMesh.isVisible = false` — the arena had literally zero visible walls or ceiling | `createArena()` | CRITICAL |
| Bleachers were flat horizontal slabs with no stepped geometry and no seat tiles | `createBleachers()` | HIGH |
| No support columns existed | missing | MEDIUM |
| No arena perimeter walls | missing | HIGH |
| Scoreboard was floating in empty space with no backing structure | `createScoreboard()` | LOW |

#### Lane System
| Issue | Location | Severity |
|-------|----------|----------|
| Lane ropes had no float discs — just thin plain tubes | `createArena()` | MEDIUM |
| Alternating red/white colouring was arbitrary (FINA uses green/red/yellow) | same | LOW |
| Starting-block X positions used `lane * W/(laneCount-1)` while ropes used `W/laneCount` — coordinate mismatch | same | HIGH |

#### Starting Blocks
| Issue | Location | Severity |
|-------|----------|----------|
| Simple grey box with no visual detail | `createArena()` | MEDIUM |
| 8 identical separate materials created (one per lane) | same | LOW |
| No angled forward-lean (real ISL blocks are angled) | missing | LOW |
| No backstroke grab handles | missing | LOW |

#### Shadows
| Issue | Location | Severity |
|-------|----------|----------|
| No ShadowGenerator created in any quality tier | codebase-wide | HIGH |
| Swimmers cast no shadows on pool deck | missing | HIGH |

#### Scale
| Issue | Location | Severity |
|-------|----------|----------|
| Deck ground was a fixed 80 × 100 m regardless of pool config | `createArena()` | LOW |
| No `minZ` / `maxZ` set on cameras — near-clip / far-clip artifacts | `createCameras()` | MEDIUM |
| All four cameras were simultaneously attached to canvas — competing input handlers | same | HIGH |

#### Performance
| Issue | Location | Severity |
|-------|----------|----------|
| 28 individual bleacher boxes (no instancing) | `createBleachers()` | MEDIUM |
| 8 identical starting-block materials (wasteful) | `createArena()` | LOW |
| No LOD on any geometry | codebase-wide | MEDIUM |

---

### 1.2 Scene Content Categories

#### Keep as-is
- `BroadcastCamera.ts` — fully working, well-architected 20-camera system
- `SwimmerModel.ts` — procedural swimmer geometry is functional
- `CameraSpecifications.ts` — comprehensive shot definitions
- `EnvironmentManager.ts` — lazy-load environment switching pattern is good
- `RaceScene.tsx` — simulation loop and HUD wiring, untouched by this phase

#### Improved (Phase 1 — this refactor)
- Pool geometry: separated into floor + walls + coping, correct proportions
- Water: removed broken rotation animation; Phase 1 placeholder correct
- Lane ropes: float discs added, FINA colour scheme, consistent X positions
- Starting blocks: two-part assembly (pedestal + platform), shared materials
- Lighting: 3-light rig with ShadowGenerator scaffolding
- Arena: visible walls, ceiling, stepped bleachers with seats, columns
- Cameras: proper alpha/beta/radius, minZ/maxZ, single canvas attachment
- Time-of-day: now changes diffuse + groundColor, not just specular

#### Replace in Phase 2
- `StandardMaterial` on water → Babylon `WaterMaterial` (reflection + refraction)
- Pool tile colour → tiled PBR texture with normal map
- Deck colour → non-slip grip-tile PBR texture
- Single PointLight → 4 SpotLight fixtures with IES-style falloff
- Flat scoreboard texture → live dynamic-texture fed from race data

#### Remove
- `hallMesh` (invisible box that served no purpose) — removed
- Per-lane material instances on starting blocks — consolidated to 2 shared
- Water mesh rotation animation — removed

---

## 2. Module System Map

```
src/graphics/
├── ArenaManager.ts              ← orchestrator (thin, ~200 lines)
├── arena/
│   ├── ArenaRoot.ts             ← Engine + Scene + render loop
│   ├── PerformanceQualityManager.ts ← device tier + runtime preset
│   ├── ArenaAtmosphere.ts       ← clear colour, fog, theme palette
│   ├── PoolStructure.ts         ← basin floor, walls, coping
│   ├── PoolWater.ts             ← water surface (Phase 2: WaterMaterial)
│   ├── PoolDeck.ts              ← concrete deck surround
│   ├── LaneSystem.ts            ← ropes, float discs, FINA colours
│   ├── StartingBlocks.ts        ← per-lane block assemblies
│   ├── ArenaArchitecture.ts     ← walls, ceiling, bleachers, scoreboard
│   ├── ArenaLighting.ts         ← ambient + key + floods + shadows
│   └── CameraSupport.ts         ← 4 static ArcRotateCameras
├── BroadcastCamera.ts           ← unchanged (20-shot broadcast system)
├── CameraSpecifications.ts      ← unchanged
└── ...
```

---

## 3. What Will Be Done in Later Phases

### Phase 2 — Water & Materials
- Replace `PoolWater` `StandardMaterial` with Babylon `WaterMaterial`
  - Real-time reflection render target (sky, bleachers, roof trusses)
  - Refraction render target (view-through to pool floor)
  - Animated wave normal map (bumpMap with UV scroll)
  - Wind-driven wave direction aligned with pool axis
- Pool floor and wall tiled texture (2048×2048 PBR tile sheet)
  - Diffuse: cream ceramic tile with grout lines
  - Normal map: subtle tile surface relief
  - UV scale: 1 tile = ~0.5 m real-world
- T-mark decals on pool floor (black cross, 5 m from each end)
- Black lane target line on pool floor (centre of each lane)
- Non-slip grip-tile texture on pool deck

### Phase 3 — Lighting & Shadows
- Arena flood lights: 8× SpotLight with IES-style angular falloff
- Shadow map resolution scaled to quality tier (256 / 512 / 1024 / 2048)
- Shadow casters: swimmer meshes, starting blocks
- Shadow receivers: pool deck, pool floor
- Caustic light projector: animated caustic texture projected down onto pool floor
- `ShadowGenerator.addShadowCaster()` called for swimmer root nodes

### Phase 4 — Architecture Detail
- Window bands in arena side walls (clerestory light shafts)
- Roof truss lattice geometry (steel I-beam profile)
- Sponsor banner meshes on arena walls (dynamic texture ready)
- Backstroke flags rope (15 m from wall, 1.8 m above water)
- False-start rope mechanism geometry

### Phase 5 — Atmosphere & Post-process
- Sky dome / HDR environment texture (indoor HDRI)
- Lens flare on visible flood-light fixtures
- Bloom post-process (wet surface glitter)
- Screen-space ambient occlusion (SSAO) on MEDIUM+
- Depth-of-field on broadcast close-up cameras
- Heat-haze / humidity shimmer on HIGH quality (on NIGHT/EVENING)

### Phase 6 — Crowd & Performance
- Crowd imposters: billboard sprites in bleacher seats (2D drawn crowd, minimal cost)
- LOD switching: high/medium/low geometry versions for bleachers, columns
- Texture streaming / mipmap management
- Auto-degradation: PerformanceQualityManager monitors FPS and steps down tier if < 30 fps

---

## 4. What Must Not Be Broken

The following systems were working correctly and must remain untouched:

| System | File | Risk |
|--------|------|------|
| Broadcast camera | `BroadcastCamera.ts` | HIGH — complex state machine |
| Camera specifications | `CameraSpecifications.ts` | LOW — data only |
| Swimmer model | `SwimmerModel.ts` | MEDIUM — many callers |
| Race simulation loop | `RaceScene.tsx` | HIGH — frame-accurate physics |
| HUD overlays | `src/hud/` | MEDIUM — throttled state reads |
| ArenaManager public API | `ArenaManager.ts` | HIGH — called from RaceScene, GameManager |
| EnvironmentManager environment switching | `EnvironmentManager.ts` | MEDIUM |

### ArenaManager backward-compatible API surface
All of the following remain unchanged and must stay stable:
```typescript
initialize(): Promise<void>
setCamera(view: CameraView): void
setTheme(theme: PoolTheme): void
setTimeOfDay(time: TimeOfDay): void
updateScoreboard(leaderboard): void
stopRenderLoop(): void
resize(): void
enableBroadcastMode(): void
disableBroadcastMode(): void
updateBroadcastCameraRace(raceState, playerSwimmer?): void
notifyBroadcastCameraProgress(data): void
notifyBroadcastCameraFinish(data): void
getBroadcastCamera(): BroadcastCamera | null
getScene(): BABYLON.Scene | null
getEngine(): BABYLON.Engine | null
getCanvas(): HTMLCanvasElement | null
getArenaConfig(): IArenaConfig
getQualityTier(): 'LOW' | 'MEDIUM' | 'HIGH'
setQualityPreset(preset): void
isRenderingActive(): boolean
dispose(): void
```

---

## 5. Coordinate System Reference

```
Y = 0        water surface / top of pool walls / deck level
Y = -3.0     pool floor (basin depth = 3 m)
Y < 0        underwater
Z = -25      south wall (starting block end)
Z = +25      north wall (finish end)
X = -12.5    west pool wall (lane 1 edge)
X = +12.5    east pool wall (lane 8 edge)

Lane centres (X positions, 8 lanes, poolWidth=25):
  Lane 0: -10.9375
  Lane 1:  -7.8125
  Lane 2:  -4.6875
  Lane 3:  -1.5625
  Lane 4:  +1.5625
  Lane 5:  +4.6875
  Lane 6:  +7.8125
  Lane 7: +10.9375

Lane width: 25 / 8 = 3.125 m
Rope positions: -12.5 + i * 3.125  for i = 1..7
```

---

*Phase 1 completed: 2026-03-18*
*Next phase: Phase 2 — Water & Materials*
