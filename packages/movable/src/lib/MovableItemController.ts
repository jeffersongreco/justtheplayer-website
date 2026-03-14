import { Geometry } from "./Geometry";
import { createMovableDragInteraction } from "./MovableDragInteraction";
import type { MovableModel } from "./MovableModel.svelte";
import type { MovableGroup, MovableItemPosition } from "./types";

export interface MovableItemControllerInteractionAPI {
  node: HTMLElement;
  model: MovableModel;
  id: string;
  group: MovableGroup;
  readonly x: number;
  readonly y: number;
  markAsUserMoved(): void;
  moveTo(x: number, y: number): void;
  promoteLayer(): void;
  demoteLayer(): void;
}

export function createMovableItemController(
  node: HTMLElement,
  model: MovableModel,
  id: string,
  initialPosition: MovableItemPosition,
  group: MovableGroup
) {
  let currentX = 0;
  let currentY = 0;
  let hasUserMoved = false;

  let rafId: number | null = null;
  let pendingX = 0;
  let pendingY = 0;
  let isDirty = false;

  Object.assign(node.style, {
    position: "absolute",
    top: "0",
    left: "0",
    zIndex: "999",
    isolation: "isolate",
    willChange: "auto",
  });

  const validateStructure = () => {
    const root = model.rootNode;
    if (!root) {
      return false;
    }

    if (node.offsetParent && node.offsetParent !== root) {
      console.error(
        "[Movable] Structural Error: <Movable.Item> nested in intermediate positioned element."
      );
      return false;
    }
    return true;
  };

  const resolvePosition = () => {
    const root = model.rootNode;
    if (!root || (root.clientWidth === 0 && root.clientHeight === 0)) {
      return false;
    }

    currentX = Geometry.resolve(initialPosition.x, root.clientWidth);
    currentY = Geometry.resolve(initialPosition.y, root.clientHeight);

    node.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

    model.detectCollisions({
      x: currentX,
      y: currentY,
      width: node.offsetWidth,
      height: node.offsetHeight,
    });

    return true;
  };

  const handleResize = () => {
    const root = model.rootNode;
    if (!root) {
      return;
    }

    if (hasUserMoved) {
      const maxX = root.clientWidth - node.offsetWidth;
      const maxY = root.clientHeight - node.offsetHeight;

      const clampedX = Geometry.clamp(currentX, 0, maxX);
      const clampedY = Geometry.clamp(currentY, 0, maxY);

      if (clampedX !== currentX || clampedY !== currentY) {
        currentX = clampedX;
        currentY = clampedY;
        node.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
    } else {
      resolvePosition();
    }
  };

  const resizeObserver = new ResizeObserver(() => {
    if (currentX === 0 && currentY === 0 && !hasUserMoved) {
      const success = resolvePosition();
      if (success) {
        validateStructure();
      }
    }
    handleResize();
  });

  if (model.rootNode) {
    resizeObserver.observe(model.rootNode);
    resolvePosition();
  } else {
    requestAnimationFrame(() => {
      if (model.rootNode) {
        resizeObserver.observe(model.rootNode);
        resolvePosition();
      }
    });
  }

  const syncVisuals = () => {
    if (isDirty) {
      node.style.transform = `translate3d(${pendingX}px, ${pendingY}px, 0)`;
      isDirty = false;
    }
    rafId = requestAnimationFrame(syncVisuals);
  };

  const controller: MovableItemControllerInteractionAPI = {
    node,
    model,
    id,
    group,
    get x() {
      return currentX;
    },
    get y() {
      return currentY;
    },
    markAsUserMoved() {
      hasUserMoved = true;
    },
    moveTo(x: number, y: number) {
      currentX = x;
      currentY = y;
      pendingX = x;
      pendingY = y;
      isDirty = true;
    },
    promoteLayer() {
      node.style.willChange = "transform";
      if (!rafId) {
        rafId = requestAnimationFrame(syncVisuals);
      }
    },
    demoteLayer() {
      if (model.activeItemID !== id) {
        node.style.willChange = "auto";
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    },
  };

  const dragInteraction = createMovableDragInteraction(controller);

  return {
    destroy() {
      resizeObserver.disconnect();
      dragInteraction.destroy();
    },
  };
}
