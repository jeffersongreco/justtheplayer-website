// DragModel.svelte.ts
import { Physics } from "./Physics";

export class DragModel {
  // Observable State
  x = $state(0);
  y = $state(0);
  isDragging = $state(false);
  hoveredTargetId = $state<string | null>(null);

  // Snapshot Cache (The "frozen" world state on drag start)
  #limits = { minX: 0, maxX: 0, minY: 0, maxY: 0 };
  #dragStart = { x: 0, y: 0, mouseX: 0, mouseY: 0 };
  #dims = { w: 0, h: 0, offsetX: 0, offsetY: 0 };

  // Registry of Target Rects (for Box-on-Box collision)
  #targets = new Map<string, DOMRect>();

  // --- Actions called by Manager ---

  start(e: PointerEvent, node: HTMLElement) {
    const parent = node.offsetParent as HTMLElement;
    if (!parent) {
      return;
    }

    this.isDragging = true;

    // Measure the world ONCE (The "Snapshot" fix)
    const nodeRect = node.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    // 1. Store dimensions and offsets
    this.#dims = {
      w: nodeRect.width,
      h: nodeRect.height,
      offsetX: nodeRect.left - e.clientX,
      offsetY: nodeRect.top - e.clientY,
    };

    // 2. Calculate Limits relative to current translation
    // This fixes the "Positioning Context" error
    this.#limits = {
      minX: this.x - (nodeRect.left - parentRect.left),
      maxX: this.x + (parentRect.right - nodeRect.right),
      minY: this.y - (nodeRect.top - parentRect.top),
      maxY: this.y + (parentRect.bottom - nodeRect.bottom),
    };

    // 3. Store Start Positions (The "Drift" fix)
    this.#dragStart = {
      x: this.x,
      y: this.y,
      mouseX: e.clientX,
      mouseY: e.clientY,
    };
  }

  move(e: PointerEvent) {
    // 1. Calculate Absolute Delta (No drift)
    const deltaX = e.clientX - this.#dragStart.mouseX;
    const deltaY = e.clientY - this.#dragStart.mouseY;

    // 2. Apply Clamping logic
    this.x = Physics.clamp(
      this.#dragStart.x + deltaX,
      this.#limits.minX,
      this.#limits.maxX
    );
    this.y = Physics.clamp(
      this.#dragStart.y + deltaY,
      this.#limits.minY,
      this.#limits.maxY
    );

    // 3. Check Collisions
    this.checkCollisions();
  }

  stop() {
    this.isDragging = false;
    // Optional: Snap to center of target, etc.
  }

  // --- Registry Logic ---

  registerTarget(id: string, rect: DOMRect) {
    this.#targets.set(id, rect);
  }

  unregisterTarget(id: string) {
    this.#targets.delete(id);
  }

  // --- Internal Logic ---

  private checkCollisions() {
    // Project the element's "Phantom" rect based on current calculation
    // This is the "Cursor vs Object" fix
    const projectedRect = {
      x:
        this.#dragStart.mouseX +
        (this.x - this.#dragStart.x) +
        this.#dims.offsetX,
      y:
        this.#dragStart.mouseY +
        (this.y - this.#dragStart.y) +
        this.#dims.offsetY,
      w: this.#dims.w,
      h: this.#dims.h,
    };

    // Find the first target intersecting
    let foundId: string | null = null;
    for (const [id, targetRect] of this.#targets) {
      if (Physics.checkIntersection(projectedRect, targetRect)) {
        foundId = id;
        break; // Stop at first hit
      }
    }
    this.hoveredTargetId = foundId;
  }
}

// Singleton for this context
export const dragModel = new DragModel();
