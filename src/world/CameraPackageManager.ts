/**
 * SWIMMER GAME - Camera Package Manager
 * Manages MVP vs Premium camera package availability
 */

import {
  CameraID,
  CameraPackage,
  MVP_CAMERAS,
  PREMIUM_ADDITIONAL_CAMERAS,
  getAvailableCameras,
  isCameraAvailable,
  getFallbackCamera,
} from './CameraSpecifications';
import { logger } from '../utils';

/**
 * Manages camera package tier selection and camera availability
 */
export class CameraPackageManager {
  private currentPackage: CameraPackage = 'MVP';
  private availableCameras: Set<CameraID> = new Set(MVP_CAMERAS);

  constructor(initialPackage: CameraPackage = 'MVP') {
    this.setPackage(initialPackage);
  }

  /**
   * Set the current camera package (MVP or PREMIUM)
   */
  public setPackage(packageTier: CameraPackage): void {
    this.currentPackage = packageTier;
    this.availableCameras = new Set(getAvailableCameras(packageTier));
    logger.log(`CameraPackageManager: Package set to ${packageTier} (${this.availableCameras.size} cameras available)`);
  }

  /**
   * Get the current package tier
   */
  public getPackage(): CameraPackage {
    return this.currentPackage;
  }

  /**
   * Get all available cameras in current package
   */
  public getAvailableCameras(): CameraID[] {
    return Array.from(this.availableCameras);
  }

  /**
   * Check if a specific camera is available
   */
  public isCameraAvailable(cameraId: CameraID): boolean {
    return this.availableCameras.has(cameraId);
  }

  /**
   * Get a camera or its fallback if not available
   */
  public getCameraOrFallback(cameraId: CameraID): CameraID | null {
    if (this.isCameraAvailable(cameraId)) {
      return cameraId;
    }

    const fallback = getFallbackCamera(cameraId, this.currentPackage);
    if (fallback) {
      logger.warn(`CameraPackageManager: Camera ${cameraId} not available, using fallback ${fallback}`);
      return fallback;
    }

    logger.warn(`CameraPackageManager: Camera ${cameraId} not available and no fallback found`);
    return null;
  }

  /**
   * Filter a camera sequence to only include available cameras
   */
  public filterSequence(cameras: CameraID[]): CameraID[] {
    return cameras
      .map((cam) => this.getCameraOrFallback(cam))
      .filter((cam): cam is CameraID => cam !== null);
  }

  /**
   * Get camera package info for debugging
   */
  public getPackageInfo(): {
    package: CameraPackage;
    totalAvailable: number;
    mvpCount: number;
    premiumCount: number;
  } {
    const mvpCount = MVP_CAMERAS.length;
    const premiumCount = this.currentPackage === 'PREMIUM' ? PREMIUM_ADDITIONAL_CAMERAS.length : 0;

    return {
      package: this.currentPackage,
      totalAvailable: this.availableCameras.size,
      mvpCount,
      premiumCount,
    };
  }

  /**
   * Unlock premium cameras (called when premium features are purchased)
   */
  public unlockPremium(): void {
    this.setPackage('PREMIUM');
  }

  /**
   * Reset to MVP package
   */
  public resetToMVP(): void {
    this.setPackage('MVP');
  }
}

export default CameraPackageManager;
