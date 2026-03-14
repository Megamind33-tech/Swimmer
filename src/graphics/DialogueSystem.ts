/**
 * SWIMMER GAME - DialogueSystem
 * Manages dialogue bubbles and communication between swimmers and coaches
 */

import * as BABYLON from '@babylonjs/core';

export interface DialogueBubble {
  id: string;
  text: string;
  position: BABYLON.Vector3;
  duration: number; // in seconds
  type: 'swimmer' | 'coach'; // determines bubble style
  isActive: boolean;
  startTime: number;
}

export class DialogueSystem {
  private scene: BABYLON.Scene;
  private dialogues: Map<string, DialogueBubble> = new Map();
  private bubbleMaterials: Map<string, BABYLON.StandardMaterial> = new Map();

  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
  }

  /**
   * Show dialogue from a swimmer or coach
   */
  public showDialogue(
    entityId: string,
    text: string,
    position: BABYLON.Vector3,
    duration: number = 3,
    type: 'swimmer' | 'coach' = 'swimmer'
  ): void {
    // Remove old dialogue if exists
    if (this.dialogues.has(entityId)) {
      const oldDialogue = this.dialogues.get(entityId)!;
      // Dispose old mesh if it exists
      if ((oldDialogue as any).mesh) {
        (oldDialogue as any).mesh.dispose();
      }
    }

    const bubble: DialogueBubble = {
      id: entityId,
      text: text,
      position: position.clone(),
      duration: duration,
      type: type,
      isActive: true,
      startTime: performance.now() / 1000,
    };

    // Create visual representation
    const bubbleMesh = this.createBubbleMesh(bubble);
    (bubble as any).mesh = bubbleMesh;

    this.dialogues.set(entityId, bubble);
  }

  /**
   * Create a visual dialogue bubble
   */
  private createBubbleMesh(bubble: DialogueBubble): BABYLON.TransformNode {
    const bubbleGroup = new BABYLON.TransformNode(`dialogue_${bubble.id}`, this.scene);
    bubbleGroup.position = bubble.position.clone();
    bubbleGroup.position.y += 0.5; // Position above entity

    // Get or create material
    const matKey = bubble.type;
    let material = this.bubbleMaterials.get(matKey);

    if (!material) {
      material = new BABYLON.StandardMaterial(`dialogueMat_${matKey}`, this.scene);
      material.emissiveColor = bubble.type === 'swimmer'
        ? new BABYLON.Color3(0.8, 0.9, 1.0) // Light blue for swimmers
        : new BABYLON.Color3(1.0, 0.95, 0.8); // Light yellow for coaches
      material.disableLighting = true;
      this.bubbleMaterials.set(matKey, material);
    }

    // Create bubble background
    const bubbleBox = BABYLON.MeshBuilder.CreateBox(
      `bubble_${bubble.id}`,
      { width: 2, height: 0.8, depth: 0.2 },
      this.scene
    );
    bubbleBox.material = material;
    bubbleBox.parent = bubbleGroup;

    // Create dynamic text texture
    const textureSize = 512;
    const dynamicTexture = new BABYLON.DynamicTexture(
      `dialogueTexture_${bubble.id}`,
      textureSize,
      this.scene
    );

    const ctx = dynamicTexture.getContext() as any as CanvasRenderingContext2D;
    ctx.fillStyle = bubble.type === 'swimmer' ? '#0066cc' : '#ff9900';
    ctx.clearRect(0, 0, textureSize, textureSize);

    // Draw text
    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = bubble.type === 'swimmer' ? '#0066cc' : '#ff9900';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Word wrap
    const words = bubble.text.split(' ');
    let lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > textureSize - 50) {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);

    // Draw each line
    const lineHeight = 60;
    const startY = (textureSize - (lines.length - 1) * lineHeight) / 2;

    lines.forEach((line, index) => {
      ctx.fillText(line, textureSize / 2, startY + index * lineHeight);
    });

    dynamicTexture.update();

    // Apply texture to bubble
    const textMat = new BABYLON.StandardMaterial(`dialogueTextMat_${bubble.id}`, this.scene);
    textMat.emissiveTexture = dynamicTexture;
    bubbleBox.material = textMat;

    return bubbleGroup;
  }

  /**
   * Update dialogues (remove expired ones)
   */
  public update(): void {
    const now = performance.now() / 1000;

    for (const [id, bubble] of this.dialogues.entries()) {
      const elapsed = now - bubble.startTime;

      if (elapsed > bubble.duration) {
        // Remove dialogue
        if ((bubble as any).mesh) {
          (bubble as any).mesh.dispose();
        }
        this.dialogues.delete(id);
      } else {
        // Fade out effect in last second
        if (elapsed > bubble.duration - 1 && (bubble as any).mesh) {
          const alpha = 1 - (elapsed - (bubble.duration - 1));
          // Could apply fade effect here
        }
      }
    }
  }

  /**
   * Get all active dialogues
   */
  public getActiveDialogues(): DialogueBubble[] {
    return Array.from(this.dialogues.values());
  }

  /**
   * Clear all dialogues
   */
  public clearAll(): void {
    for (const [, bubble] of this.dialogues.entries()) {
      if ((bubble as any).mesh) {
        (bubble as any).mesh.dispose();
      }
    }
    this.dialogues.clear();
  }

  /**
   * Dispose system
   */
  public dispose(): void {
    this.clearAll();
    this.bubbleMaterials.forEach((material) => material.dispose());
    this.bubbleMaterials.clear();
  }
}

export default DialogueSystem;
