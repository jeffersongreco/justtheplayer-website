import { Physics } from "./Physics";

export class DragModel {
  // State
  activeDraggableId = $state<string | null>(null);
  hoveredTargetId = $state<string | null>(null);

  // Coordinate state (shared by all components in this context)
  pointerPos = $state({ x: 0, y: 0 });

  // Internal Physics State
  #limits = { minX: 0, maxX: 0, minY: 0, maxY: 0 };
  #dragStart = { x: 0, y: 0, mouseX: 0, mouseY: 0 };
  #dims = { w: 0, h: 0, offsetX: 0, offsetY: 0 };

  // Registry
  #targets = new Map<string, DOMRect>();

  // --- Physics Logic ---

  startDrag(e: PointerEvent, node: HTMLElement, id: string) {
    const parent = node.offsetParent as HTMLElement;
    if (!parent) {
      return;
    }

    this.activeDraggableId = id;

    // Snapshot World
    const nodeRect = node.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    this.#dims = {
      w: nodeRect.width,
      h: nodeRect.height,
      offsetX: nodeRect.left - e.clientX,
      offsetY: nodeRect.top - e.clientY,
    };

    // Calculate Clamps based on current translation
    // Assumes 'x' and 'y' are stored in the Manager, but Limits are calculated here relative to parent
    const currentTransform = new WebKitCSSMatrix(
      window.getComputedStyle(node).transform
    );
    const currentX = currentTransform.m41;
    const currentY = currentTransform.m42;

    this.#limits = {
      minX: currentX - (nodeRect.left - parentRect.left),
      maxX: currentX + (parentRect.right - nodeRect.right),
      minY: currentY - (nodeRect.top - parentRect.top),
      maxY: currentY + (parentRect.bottom - nodeRect.bottom),
    };

    this.#dragStart = {
      x: currentX,
      y: currentY,
      mouseX: e.clientX,
      mouseY: e.clientY,
    };
  }

  calculateMove(e: PointerEvent) {
    const deltaX = e.clientX - this.#dragStart.mouseX;
    const deltaY = e.clientY - this.#dragStart.mouseY;

    const x = Physics.clamp(
      this.#dragStart.x + deltaX,
      this.#limits.minX,
      this.#limits.maxX
    );
    const y = Physics.clamp(
      this.#dragStart.y + deltaY,
      this.#limits.minY,
      this.#limits.maxY
    );

    // Update global pointer for targets
    this.pointerPos = { x: e.clientX, y: e.clientY };

    this.checkCollisions(x, y);

    return { x, y };
  }

  stopDrag() {
    this.activeDraggableId = null;
    this.hoveredTargetId = null;
  }

  // --- Collision Logic ---

  private checkCollisions(currentX: number, currentY: number) {
    // Project Phantom Rect
    const projectedRect = {
      x:
        this.#dragStart.mouseX +
        (currentX - this.#dragStart.x) +
        this.#dims.offsetX,
      y:
        this.#dragStart.mouseY +
        (currentY - this.#dragStart.y) +
        this.#dims.offsetY,
      w: this.#dims.w,
      h: this.#dims.h,
    };

    let hitId: string | null = null;
    for (const [id, rect] of this.#targets) {
      if (Physics.checkIntersection(projectedRect, rect)) {
        hitId = id;
        break;
      }
    }
    this.hoveredTargetId = hitId;
  }

  // --- Registry ---

  registerTarget(id: string, rect: DOMRect) {
    this.#targets.set(id, rect);
  }

  unregisterTarget(id: string) {
    this.#targets.delete(id);
  }
}
