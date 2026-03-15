/**
 * RaceRecorder
 * Records race data for replay purposes
 *
 * Responsibilities:
 * - Capture swimmer positions, velocities, and underwater status every frame
 * - Record race events (starts, finishes, position changes)
 * - Store replay data with timestamps
 * - Track dramatic moments (overtakes, underwater captures, near-finishes)
 * - Provide replay data for playback
 */

import { ISwimmerRaceState } from '../types/index';

export interface ISwimmerReplayFrame {
  timestamp: number; // ms from race start
  id: string;
  name: string;
  lane: number;
  position: number;
  velocity: number;
  isUnderwater: boolean;
  diveTime: number;
  rotationAngle: number;
  stamina: number;
  oxygen: number;
}

export interface IRaceReplayEvent {
  timestamp: number;
  type: 'start' | 'swim_start' | 'overtake' | 'underwater' | 'surface' | 'finish' | 'dnf' | 'highlight';
  swimmerId: string;
  swimmerName: string;
  data?: Record<string, any>;
}

export interface IRaceReplaySegment {
  startTime: number;
  endTime: number;
  swimmers: ISwimmerReplayFrame[];
}

export interface IRaceReplay {
  raceId: string;
  setupData: any;
  startTime: number;
  endTime: number;
  duration: number;
  frames: IRaceReplaySegment[];
  events: IRaceReplayEvent[];
  dramaticMoments: IRaceReplayEvent[]; // overtakes, underwater sequences, close finishes
}

/**
 * RaceRecorder - Captures race data for replay
 */
export class RaceRecorder {
  private frames: IRaceReplaySegment[] = [];
  private events: IRaceReplayEvent[] = [];
  private dramaticMoments: IRaceReplayEvent[] = [];
  private startTime: number = 0;
  private endTime: number = 0;
  private currentFrameBuffer: ISwimmerReplayFrame[] = [];
  private lastOvertakePositions: Map<string, number> = new Map();
  private underwaterStartTimes: Map<string, number> = new Map();
  private raceId: string = '';
  private setupData: any = null;
  private isRecording: boolean = false;

  /**
   * Start recording
   */
  public startRecording(raceId: string, setupData: any): void {
    this.raceId = raceId;
    this.setupData = setupData;
    this.startTime = performance.now();
    this.isRecording = true;
    this.frames = [];
    this.events = [];
    this.dramaticMoments = [];
    this.currentFrameBuffer = [];
    this.lastOvertakePositions.clear();
    this.underwaterStartTimes.clear();
  }

  /**
   * Record frame data for all swimmers
   */
  public recordFrame(raceTime: number, swimmers: ISwimmerRaceState[]): void {
    if (!this.isRecording) return;

    const frameData: ISwimmerReplayFrame[] = swimmers.map((swimmer) => ({
      timestamp: raceTime,
      id: swimmer.id,
      name: swimmer.name,
      lane: swimmer.lane,
      position: swimmer.position,
      velocity: swimmer.velocity,
      isUnderwater: swimmer.isUnderwater,
      diveTime: swimmer.diveTime,
      rotationAngle: swimmer.rotationAngle,
      stamina: swimmer.stamina,
      oxygen: swimmer.oxygen,
    }));

    // Store in buffer
    this.currentFrameBuffer.push(...frameData);

    // Save segments every 500ms
    if (raceTime % 500 < 16) {
      if (this.currentFrameBuffer.length > 0) {
        this.frames.push({
          startTime: raceTime - 500,
          endTime: raceTime,
          swimmers: [...this.currentFrameBuffer],
        });
        this.currentFrameBuffer = [];
      }
    }

    // Check for dramatic moments
    this.detectDramaticMoments(raceTime, swimmers);
  }

  /**
   * Detect overtakes, underwater sequences, and other dramatic moments
   */
  private detectDramaticMoments(raceTime: number, swimmers: ISwimmerRaceState[]): void {
    // Check for overtakes
    for (const swimmer of swimmers) {
      const lastPos = this.lastOvertakePositions.get(swimmer.id) ?? 0;

      // Find swimmers this swimmer just overtook
      const otherSwimmers = swimmers.filter(s => s.id !== swimmer.id);
      for (const other of otherSwimmers) {
        const otherLastPos = this.lastOvertakePositions.get(other.id) ?? 0;

        if (lastPos < otherLastPos && swimmer.position > other.position) {
          this.dramaticMoments.push({
            timestamp: raceTime,
            type: 'overtake',
            swimmerId: swimmer.id,
            swimmerName: swimmer.name,
            data: {
              overtakenSwimmers: other.name,
              position: swimmer.position,
            },
          });
        }
      }

      this.lastOvertakePositions.set(swimmer.id, swimmer.position);

      // Check for underwater sequences
      if (swimmer.isUnderwater) {
        if (!this.underwaterStartTimes.has(swimmer.id)) {
          this.underwaterStartTimes.set(swimmer.id, raceTime);
          this.dramaticMoments.push({
            timestamp: raceTime,
            type: 'underwater',
            swimmerId: swimmer.id,
            swimmerName: swimmer.name,
            data: {
              diveTime: swimmer.diveTime,
            },
          });
        }
      } else {
        if (this.underwaterStartTimes.has(swimmer.id)) {
          const diveStart = this.underwaterStartTimes.get(swimmer.id)!;
          const underDuration = raceTime - diveStart;
          this.underwaterStartTimes.delete(swimmer.id);

          // Record extended underwater moments as highlights
          if (underDuration > 1000) {
            this.dramaticMoments.push({
              timestamp: raceTime,
              type: 'highlight',
              swimmerId: swimmer.id,
              swimmerName: swimmer.name,
              data: {
                duration: underDuration,
                description: 'extended_underwater',
              },
            });
          }
        }
      }
    }
  }

  /**
   * Record race event
   */
  public recordEvent(raceTime: number, type: IRaceReplayEvent['type'], swimmerId: string, swimmerName: string, data?: Record<string, any>): void {
    if (!this.isRecording) return;

    const event: IRaceReplayEvent = {
      timestamp: raceTime,
      type,
      swimmerId,
      swimmerName,
      data,
    };

    this.events.push(event);

    // Also add to dramatic moments for some events
    if (type === 'finish' || type === 'overtake') {
      this.dramaticMoments.push(event);
    }
  }

  /**
   * Stop recording and get replay data
   */
  public stopRecording(raceTime: number): IRaceReplay {
    this.isRecording = false;
    this.endTime = performance.now();

    // Save any remaining buffered frames
    if (this.currentFrameBuffer.length > 0) {
      this.frames.push({
        startTime: raceTime - 500,
        endTime: raceTime,
        swimmers: [...this.currentFrameBuffer],
      });
    }

    // Sort dramatic moments by timestamp
    this.dramaticMoments.sort((a, b) => a.timestamp - b.timestamp);

    return {
      raceId: this.raceId,
      setupData: this.setupData,
      startTime: this.startTime,
      endTime: this.endTime,
      duration: raceTime,
      frames: this.frames,
      events: this.events,
      dramaticMoments: this.dramaticMoments,
    };
  }

  /**
   * Get swimmer position at specific time
   */
  public getSwimmerPositionAtTime(swimmerId: string, raceTime: number): ISwimmerReplayFrame | null {
    for (const segment of this.frames) {
      if (segment.startTime <= raceTime && raceTime <= segment.endTime) {
        const swimmer = segment.swimmers.find(s => s.id === swimmerId);
        if (swimmer) return swimmer;
      }
    }
    return null;
  }

  /**
   * Get all swimmers at specific time
   */
  public getSwimmersAtTime(raceTime: number): ISwimmerReplayFrame[] {
    for (const segment of this.frames) {
      if (segment.startTime <= raceTime && raceTime <= segment.endTime) {
        return segment.swimmers;
      }
    }
    return [];
  }
}

export default RaceRecorder;
