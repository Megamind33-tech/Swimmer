# Broadcast Camera System

## Overview

The **Broadcast Camera** is an automated cinematics system that removes player control and provides dynamic camera shots during races, similar to a broadcasting camera at a real swimming championship.

## Design Philosophy

Unlike a stadium visitor (player-controlled camera), the broadcast camera:
- **Never responds to player input** - fully automated
- **Follows pre-defined shot sequences** during countdown
- **Dynamically follows the player** during racing
- **Shows dramatic angles** at race finish
- **Transitions smoothly** between shots

## Architecture

### Components

1. **BroadcastCamera** (`src/graphics/BroadcastCamera.ts`)
   - Main camera controller
   - Manages shot transitions
   - Handles player following
   - Disabled user input

2. **ArenaManager** (enhanced)
   - Initializes BroadcastCamera
   - Provides methods to enable/disable broadcast mode
   - Updates camera with race state

3. **CameraController** (`src/core/CameraController.ts`)
   - Bridge between RaceController and ArenaManager
   - Listens to race events
   - Coordinates camera state with race state

## Available Shots

| Shot Type | Use Case | Position |
|-----------|----------|----------|
| `STARTING_BLOCK` | Pre-race focus | Side view of starting blocks |
| `STARTING_BLOCK_CLOSE` | Dramatic start | Close-up of blocks |
| `AERIAL_OVERVIEW` | Race overview | High angle, full pool view |
| `WIDE_SHOT` | Race context | Wider framing of pool |
| `PLAYER_FOLLOW` | During racing | Follows player with look-ahead |
| `FINISH_CAM` | Race end | Dramatic finish angle |

## Race Phases and Camera Behavior

### Countdown Phase
```
1. Shows STARTING_BLOCK (player positioned)
2. Transitions to STARTING_BLOCK_CLOSE (emotional build)
3. Transitions to AERIAL_OVERVIEW (race perspective)
```

### Racing Phase
```
- Switches to PLAYER_FOLLOW
- Camera stays 20m behind player, 8m above water
- Looks 15m ahead of player
- Smooth following with no player input accepted
```

### Finish Phase
```
- Transitions to FINISH_CAM
- Shows pool end with dramatic angle
- Could pan to show winner
```

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

### Manual Control

```typescript
// Enable broadcast mode
arena.enableBroadcastMode();

// Update race state
arena.updateBroadcastCameraRace('RACING', playerSwimmer);

// Disable broadcast mode (return to manual camera)
arena.disableBroadcastMode();
```

## Configuration

Customize camera behavior:

```typescript
const camera = arena.getBroadcastCamera();
camera.setConfig({
  followDistance: 20,    // meters behind player
  followHeight: 8,       // meters above water
  followLead: 15,        // look-ahead meters
  transitionSpeed: 0.016, // frame time
  enableSmoothing: true,  // smooth transitions
});
```

## Key Features

### 1. **No Player Input**
The camera is locked to broadcast mode during races:
```typescript
// In BroadcastCamera
this.currentCamera.inertia = 0;                  // No momentum
this.currentCamera.angularSensibility = Infinity; // Disable rotation
this.currentCamera.wheelPrecision = Infinity;     // Disable zoom
```

### 2. **Dynamic Shots During Countdown**
Auto-transitions through shots based on race phase:
- Pre-race: Multiple angles to build anticipation
- Start: Close-up drama
- Overview: Show all competitors

### 3. **Player Following During Race**
Camera tracks player with cinematic framing:
- Positioned behind and above
- Looks ahead of movement
- Smooth lerping for fluid motion

### 4. **Shot Transitions**
Uses easing functions for smooth camera movement:
```typescript
easeInOutQuad(t) // Smooth acceleration/deceleration
```

## Adding Custom Shots

To add a new shot:

```typescript
// In BroadcastCamera constructor
this.shots.set('MY_SHOT', {
  type: 'MY_SHOT',
  position: new BABYLON.Vector3(x, y, z),
  target: new BABYLON.Vector3(tx, ty, tz),
  duration: 1000, // ms to transition
});

// Then use it:
this.transitionToShot('MY_SHOT');
```

## Event Flow

```
RaceController Events
        ↓
   CameraController (listens)
        ↓
   ArenaManager (updateBroadcastCameraRace)
        ↓
   BroadcastCamera (onRaceStateChange)
        ↓
   Camera Position/Target Updates
```

## Performance Considerations

- **Update frequency**: 60fps via render loop
- **Smooth transitions**: Easing over 500-1500ms
- **Following calculations**: Simple vector math, minimal cost
- **No physics**: Pure cinematics, no simulation

## Comparison: Manual vs Broadcast

| Feature | Manual Camera | Broadcast Camera |
|---------|---------------|------------------|
| Player Input | Full control | Disabled |
| Auto Transitions | No | Yes |
| Player Following | No | Yes |
| Shot Sequences | No | Yes |
| Customizable Views | Yes | Pre-defined |
| Racing Experience | Exploratory | Cinematic |

## Future Enhancements

- [ ] Dynamic shot selection based on race events (lead changes, catches)
- [ ] Multiple player tracking for multiplayer races
- [ ] Configurable shot sequences per race type
- [ ] Instant replay system with camera playback
- [ ] Virtual spectator seats with different camera angles
- [ ] AI-controlled camera following story events
