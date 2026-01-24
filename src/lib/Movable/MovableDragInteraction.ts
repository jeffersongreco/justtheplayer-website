import { Geometry } from "./Geometry";
import type { MovableModel } from "./MovableModel.svelte";
import type { MovableGroup, MovableItemPosition } from "./types";

// TO-DO: Is being the Drag Interaction and the Movable Controller, split the code in two files.

export function createMovableDragInteraction(
  node: HTMLElement,
  model: MovableModel,
  id: string,
  initialPosition: MovableItemPosition,
  group: MovableGroup
) {
  let currentX = 0;
  let currentY = 0;
  let hasUserMoved = false;

  Object.assign(node.style, {
    touchAction: "none",
    userSelect: "none",
    webkitUserSelect: "none",
    position: "absolute",
    top: "0",
    left: "0",
    cursor: "grab",
    zIndex: "999",
    isolation: "isolate",
    willChange: "auto",
  });

  const validateStructure = () => {
    const root = model.rootNode;
    if (!root) {
      return false;
    }

    // offsetParent is the nearest positioned ancestor.
    // It SHOULD be the root.
    if (node.offsetParent && node.offsetParent !== root) {
      console.error(
        `[Movable] Structural Error: <Movable.Item> is nested inside an intermediate positioned element (<${node.offsetParent.tagName.toLowerCase()}>).\n` +
          `Items must be positioned relative to the <Movable.Root>. Remove "position: relative/absolute" from intermediate wrappers.`
      );
      return false;
    }
    return true;
  };

  const resolvePosition = () => {
    const root = model.rootNode;
    // Wait for Root to be registered and layout to be ready
    if (!root || (root.clientWidth === 0 && root.clientHeight === 0)) {
      return false;
    }

    currentX = Geometry.resolve(initialPosition.x, root.clientWidth);
    currentY = Geometry.resolve(initialPosition.y, root.clientHeight);

    node.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

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

  const onMove = (e: PointerEvent) => {
    if (model.activeItemID !== id) {
      return;
    }
    if (e.cancelable) {
      e.preventDefault();
    }

    const { x, y } = model.updatePosition(e);

    currentX = x;
    currentY = y;

    node.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
  };

  const promoteLayer = () => {
    node.style.willChange = "transform";
  };

  const demoteLayer = () => {
    if (model.activeItemID !== id) {
      node.style.willChange = "auto";
    }
  };

  const onStart = (e: PointerEvent) => {
    if (e.button !== 0) {
      return;
    }

    hasUserMoved = true;

    node.setPointerCapture(e.pointerId);
    node.style.willChange = "transform";
    node.style.cursor = "grabbing";

    model.beginMove(e, node, id, group ?? "default");

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onEnd);
    window.addEventListener("pointercancel", onEnd);
  };

  const onEnd = (e: PointerEvent) => {
    model.endMove();

    node.style.willChange = "auto";
    node.style.cursor = "grab";
    node.releasePointerCapture(e.pointerId);

    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onEnd);
    window.removeEventListener("pointercancel", onEnd);
  };

  node.addEventListener("pointerdown", onStart);
  node.addEventListener("pointerenter", promoteLayer);
  node.addEventListener("pointerleave", demoteLayer);

  return {
    destroy() {
      node.removeEventListener("pointerdown", onStart);
      node.removeEventListener("pointerenter", promoteLayer);
      node.removeEventListener("pointerleave", demoteLayer);
      resizeObserver.disconnect();
    },
  };
}
