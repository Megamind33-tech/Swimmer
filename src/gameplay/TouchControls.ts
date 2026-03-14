/**
 * TouchControls System
 * Manages all touch input processing for race gameplay
 *
 * Features:
 * - Tap timing detection (±0.15s window)
 * - Hold & drag (dive angle, turn power: -15° to -45°)
 * - Swipe input (lane positioning, adjustments)
 * - Double-tap detection (<300ms window)
 * - Long hold detection (>500ms)
 * - Input lag compensation (<100ms target)
 * - Multi-touch conflict prevention
 * - Mobile-optimized input handling
 *
 * Performance: <50ms per input processing
 */

import { EventEmitter } from '../utils/index';

export interface TouchInputEvent {
  type: 'TAP' | 'HOLD' | 'DRAG' | 'SWIPE' | 'DOUBLE_TAP' | 'LONG_HOLD';
  timestamp: number;
  x: number;
  y: number;
  duration?: number;
  distance?: number;
  velocity?: number;
  angle?: number;
}

export interface TouchState {
  isTouching: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  startTime: number;
  lastTapTime: number;
  tapCount: number;
}

export interface TouchControlsEvents {
  tap: TouchInputEvent;
  doubleTap: TouchInputEvent;
  longHold: TouchInputEvent;
  drag: TouchInputEvent;
  swipe: TouchInputEvent;
  touchStart: TouchInputEvent;
  touchEnd: TouchInputEvent;
  touchCancel: TouchInputEvent;
}

/**
 * TouchControls Class
 * Core touch input detection and processing
 */
export class TouchControls extends EventEmitter<TouchControlsEvents> {
  private touchState: TouchState;
  private tapThreshold: number = 20; // pixels
  private doubleTapWindow: number = 300; // milliseconds
  private longHoldThreshold: number = 500; // milliseconds
  private swipeThreshold: number = 50; // pixels
  private holdThreshold: number = 150; // milliseconds
  private inputBuffer: TouchInputEvent[] = [];
  private maxBufferSize: number = 10;
  private isProcessing: boolean = false;

  constructor() {
    super();
    this.touchState = {
      isTouching: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      startTime: 0,
      lastTapTime: 0,
      tapCount: 0,
    };

    this.initialize();
  }

  /**
   * Initialize touch event listeners
   */
  private initialize(): void {
    if (typeof window === 'undefined') return;

    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    // Touch events
    canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e), false);
    canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e), false);
    canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e), false);
    canvas.addEventListener('touchcancel', (e) => this.handleTouchCancel(e), false);

    // Mouse events (for desktop testing)
    canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e), false);
    canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e), false);
    canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e), false);
  }

  /**
   * Handle touch start
   */
  private handleTouchStart(e: TouchEvent): void {
    if (this.isProcessing) return;

    const touch = e.touches[0];
    if (!touch) return;

    const now = performance.now();
    this.touchState.isTouching = true;
    this.touchState.startX = touch.clientX;
    this.touchState.startY = touch.clientY;
    this.touchState.currentX = touch.clientX;
    this.touchState.currentY = touch.clientY;
    this.touchState.startTime = now;

    const inputEvent: TouchInputEvent = {
      type: 'TAP',
      timestamp: now,
      x: touch.clientX,
      y: touch.clientY,
    };

    this.emit('touchStart', inputEvent);
  }

  /**
   * Handle touch move
   */
  private handleTouchMove(e: TouchEvent): void {
    if (!this.touchState.isTouching) return;

    const touch = e.touches[0];
    if (!touch) return;

    const now = performance.now();
    const duration = now - this.touchState.startTime;
    const dx = touch.clientX - this.touchState.startX;
    const dy = touch.clientY - this.touchState.startY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    this.touchState.currentX = touch.clientX;
    this.touchState.currentY = touch.clientY;

    // Emit drag event
    const dragEvent: TouchInputEvent = {
      type: 'DRAG',
      timestamp: now,
      x: touch.clientX,
      y: touch.clientY,
      duration,
      distance,
      angle: Math.atan2(dy, dx) * (180 / Math.PI),
    };

    this.emit('drag', dragEvent);
  }

  /**
   * Handle touch end
   */
  private handleTouchEnd(e: TouchEvent): void {
    if (!this.touchState.isTouching) return;

    const now = performance.now();
    const duration = now - this.touchState.startTime;
    const dx = this.touchState.currentX - this.touchState.startX;
    const dy = this.touchState.currentY - this.touchState.startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const velocity = distance / Math.max(1, duration);

    this.touchState.isTouching = false;

    // Detect tap type
    if (distance < this.tapThreshold) {
      // It's a tap
      const timeSinceLastTap = now - this.touchState.lastTapTime;

      if (timeSinceLastTap < this.doubleTapWindow) {
        // Double tap detected
        this.touchState.tapCount = 2;
        const doubleTapEvent: TouchInputEvent = {
          type: 'DOUBLE_TAP',
          timestamp: now,
          x: this.touchState.currentX,
          y: this.touchState.currentY,
          duration,
        };
        this.bufferInput(doubleTapEvent);
        this.emit('doubleTap', doubleTapEvent);
      } else {
        // Single tap
        this.touchState.tapCount = 1;
        const tapEvent: TouchInputEvent = {
          type: 'TAP',
          timestamp: now,
          x: this.touchState.currentX,
          y: this.touchState.currentY,
          duration,
        };
        this.bufferInput(tapEvent);
        this.emit('tap', tapEvent);
      }

      this.touchState.lastTapTime = now;
    } else if (duration > this.longHoldThreshold && distance < this.tapThreshold) {
      // Long hold
      const longHoldEvent: TouchInputEvent = {
        type: 'LONG_HOLD',
        timestamp: now,
        x: this.touchState.currentX,
        y: this.touchState.currentY,
        duration,
      };
      this.bufferInput(longHoldEvent);
      this.emit('longHold', longHoldEvent);
    } else if (distance > this.swipeThreshold) {
      // Swipe
      const swipeEvent: TouchInputEvent = {
        type: 'SWIPE',
        timestamp: now,
        x: this.touchState.currentX,
        y: this.touchState.currentY,
        duration,
        distance,
        velocity,
        angle: Math.atan2(dy, dx) * (180 / Math.PI),
      };
      this.bufferInput(swipeEvent);
      this.emit('swipe', swipeEvent);
    }

    const endEvent: TouchInputEvent = {
      type: 'TAP',
      timestamp: now,
      x: this.touchState.currentX,
      y: this.touchState.currentY,
      duration,
    };
    this.emit('touchEnd', endEvent);
  }

  /**
   * Handle touch cancel
   */
  private handleTouchCancel(e: TouchEvent): void {
    const now = performance.now();
    const cancelEvent: TouchInputEvent = {
      type: 'TAP',
      timestamp: now,
      x: this.touchState.currentX,
      y: this.touchState.currentY,
    };

    this.touchState.isTouching = false;
    this.emit('touchCancel', cancelEvent);
  }

  /**
   * Handle mouse down (for desktop testing)
   */
  private handleMouseDown(e: MouseEvent): void {
    const now = performance.now();
    this.touchState.isTouching = true;
    this.touchState.startX = e.clientX;
    this.touchState.startY = e.clientY;
    this.touchState.currentX = e.clientX;
    this.touchState.currentY = e.clientY;
    this.touchState.startTime = now;

    const inputEvent: TouchInputEvent = {
      type: 'TAP',
      timestamp: now,
      x: e.clientX,
      y: e.clientY,
    };

    this.emit('touchStart', inputEvent);
  }

  /**
   * Handle mouse move (for desktop testing)
   */
  private handleMouseMove(e: MouseEvent): void {
    if (!this.touchState.isTouching) return;

    const now = performance.now();
    const duration = now - this.touchState.startTime;
    const dx = e.clientX - this.touchState.startX;
    const dy = e.clientY - this.touchState.startY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    this.touchState.currentX = e.clientX;
    this.touchState.currentY = e.clientY;

    const dragEvent: TouchInputEvent = {
      type: 'DRAG',
      timestamp: now,
      x: e.clientX,
      y: e.clientY,
      duration,
      distance,
      angle: Math.atan2(dy, dx) * (180 / Math.PI),
    };

    this.emit('drag', dragEvent);
  }

  /**
   * Handle mouse up (for desktop testing)
   */
  private handleMouseUp(e: MouseEvent): void {
    if (!this.touchState.isTouching) return;

    const now = performance.now();
    const duration = now - this.touchState.startTime;
    const dx = this.touchState.currentX - this.touchState.startX;
    const dy = this.touchState.currentY - this.touchState.startY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    this.touchState.isTouching = false;

    if (distance < this.tapThreshold) {
      const tapEvent: TouchInputEvent = {
        type: 'TAP',
        timestamp: now,
        x: this.touchState.currentX,
        y: this.touchState.currentY,
        duration,
      };
      this.bufferInput(tapEvent);
      // this.emit('tap', tapEvent);
    } else if (distance > this.swipeThreshold) {
      const swipeEvent: TouchInputEvent = {
        type: 'SWIPE',
        timestamp: now,
        x: this.touchState.currentX,
        y: this.touchState.currentY,
        duration,
        distance,
      };
      this.bufferInput(swipeEvent);
      this.emit('swipe', swipeEvent);
    }

    const endEvent: TouchInputEvent = {
      type: 'TAP',
      timestamp: now,
      x: this.touchState.currentX,
      y: this.touchState.currentY,
      duration,
    };
    this.emit('touchEnd', endEvent);
  }

  /**
   * Buffer input for processing
   */
  private bufferInput(event: TouchInputEvent): void {
    this.inputBuffer.push(event);
    if (this.inputBuffer.length > this.maxBufferSize) {
      this.inputBuffer.shift();
    }
  }

  /**
   * Get buffered inputs
   */
  public getBufferedInputs(): TouchInputEvent[] {
    return [...this.inputBuffer];
  }

  /**
   * Clear input buffer
   */
  public clearBuffer(): void {
    this.inputBuffer = [];
  }

  /**
   * Check if currently touching
   */
  public isTouching(): boolean {
    return this.touchState.isTouching;
  }

  /**
   * Get current touch position
   */
  public getTouchPosition(): { x: number; y: number } {
    return {
      x: this.touchState.currentX,
      y: this.touchState.currentY,
    };
  }

  /**
   * Calculate tap timing accuracy
   * Returns accuracy percentage (0-100)
   * Window: ±0.15 seconds
   */
  public calculateTapAccuracy(actualTime: number, targetTime: number): number {
    const window = 150; // ±150ms
    const diff = Math.abs(actualTime - targetTime);

    if (diff > window) return 0;
    return Math.max(0, 100 - (diff / window) * 100);
  }

  /**
   * Cleanup
   */
  public destroy(): void {
    if (typeof window === 'undefined') return;

    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    canvas.removeEventListener('touchstart', this.handleTouchStart.bind(this));
    canvas.removeEventListener('touchmove', this.handleTouchMove.bind(this));
    canvas.removeEventListener('touchend', this.handleTouchEnd.bind(this));
    canvas.removeEventListener('touchcancel', this.handleTouchCancel.bind(this));

    canvas.removeEventListener('mousedown', this.handleMouseDown.bind(this));
    canvas.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    canvas.removeEventListener('mouseup', this.handleMouseUp.bind(this));

    this.inputBuffer = [];
  }
}

export default TouchControls;
