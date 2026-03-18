/**
 * PerformanceMonitor — lightweight frame-time and React render profiler
 *
 * Usage:
 *   const monitor = PerformanceMonitor.getInstance();
 *   monitor.startMonitoring();
 *
 *   // In ArenaManager render loop:
 *   monitor.recordFrame();
 *
 *   // In React components (DEV only):
 *   monitor.recordRender('HUDRoot');
 *
 *   // Read metrics:
 *   const m = monitor.getMetrics();
 *   console.log(m.avgFrameMs, m.renderCounts);
 *
 * Quality recommendation:
 *   monitor.getQualityRecommendation() → 'high' | 'medium' | 'low'
 */

export interface PerfMetrics {
  /** Rolling average frame time in ms (last 60 samples) */
  avgFrameMs:     number;
  /** Minimum frame time in the window */
  minFrameMs:     number;
  /** Maximum (worst) frame time in window — key for stutter detection */
  maxFrameMs:     number;
  /** Estimated FPS from avgFrameMs */
  estimatedFps:   number;
  /** How many React renders each labelled component triggered this second */
  renderCounts:   Record<string, number>;
  /** JS heap used in MB (Chrome only, else -1) */
  heapUsedMB:     number;
  /** Total monitoring duration in seconds */
  uptimeSec:      number;
}

const WINDOW = 60; // frame samples to keep

export class PerformanceMonitor {
  private static _instance: PerformanceMonitor | null = null;

  private frameTimes:    number[] = [];
  private renderCounts:  Record<string, number> = {};
  private lastFrameTime: number = 0;
  private startTime:     number = 0;
  private active:        boolean = false;

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor._instance) {
      PerformanceMonitor._instance = new PerformanceMonitor();
    }
    return PerformanceMonitor._instance;
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  startMonitoring(): void {
    this.frameTimes   = [];
    this.renderCounts = {};
    this.lastFrameTime = performance.now();
    this.startTime     = performance.now();
    this.active        = true;
  }

  stopMonitoring(): void {
    this.active = false;
  }

  // ── Recording ─────────────────────────────────────────────────────────────

  /**
   * Call once per Babylon render loop tick (replaces manual delta tracking).
   */
  recordFrame(): void {
    if (!this.active) return;
    const now   = performance.now();
    const delta = now - this.lastFrameTime;
    this.lastFrameTime = now;
    this.frameTimes.push(delta);
    if (this.frameTimes.length > WINDOW) this.frameTimes.shift();
  }

  /**
   * Call at the top of expensive React components in DEV builds.
   * No-ops in production to avoid overhead.
   */
  recordRender(label: string): void {
    if (!this.active) return;
    if (process.env.NODE_ENV !== 'development') return;
    this.renderCounts[label] = (this.renderCounts[label] ?? 0) + 1;
  }

  // ── Metrics ───────────────────────────────────────────────────────────────

  getMetrics(): PerfMetrics {
    const frames = this.frameTimes;
    const avg    = frames.length ? frames.reduce((a, b) => a + b, 0) / frames.length : 16.67;
    const min    = frames.length ? Math.min(...frames) : 16.67;
    const max    = frames.length ? Math.max(...frames) : 16.67;

    let heapUsedMB = -1;
    try {
      // @ts-expect-error — performance.memory is Chrome-only
      heapUsedMB = Math.round(performance.memory.usedJSHeapSize / 1_048_576);
    } catch { /* not available */ }

    return {
      avgFrameMs:   Math.round(avg * 10) / 10,
      minFrameMs:   Math.round(min * 10) / 10,
      maxFrameMs:   Math.round(max * 10) / 10,
      estimatedFps: Math.round(1000 / avg),
      renderCounts: { ...this.renderCounts },
      heapUsedMB,
      uptimeSec:    Math.round((performance.now() - this.startTime) / 1000),
    };
  }

  /**
   * Suggests a Babylon quality tier based on measured frame times.
   *   < 20ms avg → 'high'
   *   20-33ms    → 'medium'
   *   > 33ms     → 'low'  (< 30fps)
   */
  getQualityRecommendation(): 'high' | 'medium' | 'low' {
    if (this.frameTimes.length < 30) return 'medium'; // not enough data yet
    const avg = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
    if (avg < 20) return 'high';
    if (avg < 33) return 'medium';
    return 'low';
  }

  /** Reset render counters (call once per second in a setInterval) */
  resetRenderCounts(): void {
    this.renderCounts = {};
  }
}
