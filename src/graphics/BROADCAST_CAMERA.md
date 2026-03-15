# Broadcast Camera System

## Overview

The **Broadcast Camera** is a professional-grade cinematics system that removes player control and provides dynamic camera shots during races, similar to a televised world championship swimming broadcast.

⚠️ **Important**: This document is a quick-reference guide. For the **complete 20-camera specification** with professional directing philosophy, see **[CAMERA_PLAN.md](/CAMERA_PLAN.md)**.

## Design Philosophy

Unlike a stadium visitor (player-controlled camera), the broadcast camera:
- **Never responds to player input** - fully automated, TV-director style
- **Follows professional shot sequences** during different race phases
- **Dynamically follows the player** during racing with cinematic framing
- **Shows dramatic angles** at critical moments (turns, finishes)
- **Transitions smoothly** between shots using easing functions
- **Enforces gameplay readability** - no cuts during critical input windows

## Architecture

### Components

1. **BroadcastCamera** (`src/graphics/BroadcastCamera.ts`)
   - Main camera controller supporting 20 professional camera types
   - Manages smooth transitions between shots
   - Handles event-driven camera responses (turns, finishes, overtakes)
   - Enforces readability rules and input window protection
   - Supports MVP (7 cameras) and Premium (20 cameras) packages

2. **CameraSpecifications** (`src/graphics/CameraSpecifications.ts`)
   - Defines all 20 professional camera types (CAM 01 - CAM 20)
   - Each camera includes positioning, FOV, movement, timings
   - Event-specific shot sequences for 50m, 100m, 200m, relay races
   - MVP and Premium package configurations

3. **CameraPackageManager** (`src/graphics/CameraPackageManager.ts`)
   - Manages MVP vs Premium camera package tiers
   - Validates camera availability
   - Provides fallback cameras if specific shots unavailable
   - Supports unlocking premium features

4. **CameraController** (`src/core/CameraController.ts`)
   - Bridge between RaceController and BroadcastCamera
   - Listens to race events and camera-specific events
   - Coordinates camera state with race state
   - Handles turn approach, turn contact, finish threshold events

5. **ArenaManager** (enhanced)
   - Initializes BroadcastCamera
   - Provides methods to enable/disable broadcast mode
   - Updates camera with race state

## Available Cameras (20 Professional Types)

### MVP Package (7 Cameras - First Playable)
| Camera | Purpose | Use Case |
|--------|---------|----------|
| CAM 03 | Hero Walkout | Athlete entrance |
| CAM 06 | Overhead Lineup | Pre-start race geography |
| CAM 07 | Start/Finish Master | Main broadcast race view |
| CAM 10 | Pool-Deck Tracking | Cinematic race follow |
| CAM 14 | Underwater Turn | Turn dynamics (replay) |
| CAM 18 | Finish Compression | Final meters drama |
| CAM 19 | Scoreboard Reaction | Post-race emotion |

### Premium Package (13 Additional Cameras)
**Entrance Phase**: CAM 01 (Arena Establishing), CAM 02 (Marshalling), CAM 04 (Lane Portrait), CAM 05 (Block Detail)

**Start Phase**: CAM 13 (Underwater Start)

**Mid-Race**: CAM 08 (Finish Slow-Mo ISO), CAM 09 (Turn Master), CAM 15 (Underwater Tracking), CAM 16 (Overhead Tracking)

**Deck Coverage**: CAM 11 (Handheld A), CAM 12 (Handheld B)

**Prestige**: CAM 17 (Crane/Jib), CAM 20 (Flash Interview)

**Complete specifications**: See [CAMERA_PLAN.md](/CAMERA_PLAN.md)

## Race Phases and Camera Behavior

### Entrance Phase
Cameras build identity and anticipation:
- **50m**: CAM 01 → CAM 03 → CAM 04 → CAM 05 → CAM 06
- **100m**: CAM 01 → CAM 03 → CAM 04 → CAM 06
- **200m**: CAM 01 → CAM 02 → CAM 03 → CAM 04 → CAM 06

### Start Phase
Cameras show explosive synchronized launch:
- CAM 06 (Overhead) on "take your marks"
- CAM 07 (Master) at countdown
- CAM 13 (Underwater) at entry (premium only)
- CAM 10 (Tracking) at breakout

### Mid-Race Phase
Cameras follow with readability and drama:
- **Primary**: CAM 07 (Master) or CAM 10 (Tracking)
- **Turns** (100m+): CAM 09 → CAM 14 → CAM 10
- **Accent**: CAM 15 (Underwater Tracking - premium only)

### Finish Phase
Cameras maximize dramatic tension:
- CAM 18 (Compression) in final 12m
- CAM 08 (Slow-Mo ISO - premium only) at wall
- CAM 19 (Scoreboard Reaction) immediately after touch

### Post-Race Phase
Cameras capture emotion and celebration:
- CAM 19 (Scoreboard Reaction)
- CAM 11/12 (Handheld Deck)
- CAM 20 (Flash Interview - premium only)

## Golden Rules Implementation

1. ✅ **Player always knows who is winning** - Leader always visible
2. ✅ **No cuts during critical input windows** - Dive, turn, finish, relay locked
3. ✅ **Underwater as punctuation** - Brief accents, not main readable view
4. ✅ **Tighter camera for closer races** - Progressive framing based on gaps
5. ✅ **Fewer cuts for shorter races** - 50m: 1-2 cuts/10s, 200m: 3-4 cuts/10s
6. ✅ **After finish, stay with emotion** - No menu until emotion captured
7. ✅ **Every race feels like an event** - Professional production quality

## Integration

### For Races

1. **Initialize ArenaManager with broadcast camera:**
   ```typescript
   const arena = new ArenaManager(canvas);
   await arena.initialize();
   ```

2. **Create CameraController:**
   ```typescript
   const cameraController = new CameraController(raceController);
   cameraController.setArenaManager(arena);
   ```

3. **When race starts, broadcast mode activates automatically** via event listeners

### Camera Configuration

```typescript
const broadcastCamera = arena.getBroadcastCamera();

// Set race event type (affects shot sequences)
broadcastCamera.setRaceEventType('100M'); // or '50M', '200M', 'RELAY'

// Set package tier
broadcastCamera.setPackageTier('MVP'); // or 'PREMIUM'

// Configure player following
broadcastCamera.setFollowConfig({
  followDistance: 20,    // meters behind player
  followHeight: 8,       // meters above water
  followLead: 15,        // look-ahead meters
  enableSmoothing: true, // smooth camera motion
});
```

### Manual Control

```typescript
// Enable broadcast mode
arena.enableBroadcastMode();

// Update race state
arena.updateBroadcastCameraRace('RACING', playerSwimmer);

// Handle input window protection
broadcastCamera.beginInputWindow('TURN');   // Lock camera during turn
// ... player performs turn input ...
broadcastCamera.endInputWindow();           // Unlock after input

// Disable broadcast mode (return to manual camera)
arena.disableBroadcastMode();
```

## Event Flow

```
RaceController (emits race events)
        ↓
RaceController (emits camera events: turn, finish, etc.)
        ↓
CameraController (listens & coordinates)
        ↓
BroadcastCamera (executes transitions & responses)
        ↓
CameraPackageManager (validates availability)
        ↓
Camera Position/Target Updates
```

## Camera Events

The broadcast camera responds to race-specific events:

| Event | Trigger | Response |
|-------|---------|----------|
| `turnApproach` | 6-8m before wall | CAM 09 (Turn Master) |
| `turnContact` | Wall touch | CAM 14 (Underwater Turn) |
| `finishThreshold` | Final 12m | CAM 18 (Compression) |
| `cameraEventType` | Race start | Load event-specific sequences |

## Key Features

### 1. **Input Window Protection**
No camera cuts during critical gameplay moments:
```typescript
// Lock camera during input window
broadcastCamera.beginInputWindow('DIVE');  // 'TURN', 'FINISH', 'RELAY'
// ... player input happens ...
broadcastCamera.endInputWindow();
```

### 2. **Event-Driven Camera Response**
Automatic camera switches for dramatic moments:
- Turn approach → Turn camera at 6-8m
- Turn contact → Underwater view
- Final 12m → Compression camera

### 3. **Package Tier Support**
MVP cameras always available; premium cameras enhance quality:
```typescript
broadcastCamera.setPackageTier('PREMIUM');
// Automatically uses premium cameras when available
// Falls back to MVP equivalents if needed
```

### 4. **Smooth Transitions**
All cameras use easing functions for fluid motion:
```typescript
easeInOutQuad(t) // Smooth acceleration/deceleration
easeInQuad(t)    // Ease in
easeOutQuad(t)   // Ease out
```

## Performance Considerations

- **Update frequency**: 60fps via render loop
- **Smooth transitions**: Easing over 500-1500ms
- **Following calculations**: Simple vector math, minimal CPU cost
- **No physics**: Pure cinematics, no simulation
- **Memory**: ~2 KB per camera (minimal overhead)

## Comparison: Manual vs Broadcast

| Feature | Manual Camera | Broadcast Camera |
|---------|---------------|------------------|
| Player Input | Full control | Disabled |
| Auto Transitions | No | Yes (event-driven) |
| Player Following | No | Yes (cinematic) |
| Shot Sequences | No | Yes (event-specific) |
| Readability Rules | N/A | Yes (input protection) |
| Package Tiers | N/A | MVP & Premium |
| Racing Experience | Exploratory | Cinematic & Dramatic |

## For Detailed Specifications

See **[CAMERA_PLAN.md](/CAMERA_PLAN.md)** for:
- Complete specifications of all 20 cameras
- Professional directing philosophy and golden rules
- Event-specific shot plans with timings
- Audio-to-camera sync guidelines
- Readability and editing rules
- Cut rhythm recommendations

## Implemented

✅ All 20 camera types with professional specifications
✅ Event-specific shot sequences (50m, 100m, 200m, relay)
✅ Golden rules enforcement (clarity, input protection, emotion)
✅ MVP (7 cameras) and Premium (13 cameras) packages
✅ Camera event system (turn, finish thresholds)
✅ Input window protection
✅ Smooth transitions with easing
✅ Package tier management

## Future Enhancements

- [ ] Replay system integration with replay camera selection
- [ ] Multi-swimmer tracking for relay races
- [ ] Dynamic camera zoom based on race tightness
- [ ] Virtual spectator seats with different angles
- [ ] Custom camera configuration per event
- [ ] AI-controlled camera for story moments
