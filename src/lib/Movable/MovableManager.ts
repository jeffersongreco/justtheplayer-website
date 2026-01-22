import { Geometry, type InitialPosition } from "./Geometry";
import type { MovableModel } from "./MovableModel.svelte";

export function createMovableManager(
  node: HTMLElement,
  model: MovableModel,
  id: string,
  initialX: InitialPosition,
  initialY: InitialPosition
) {
  let currentX = 0;
  let currentY = 0;

  Object.assign(node.style, {
    touchAction: "none",
    userSelect: "none",
    webkitUserSelect: "none",
    position: "absolute",
    cursor: "grab",
    zIndex: "999",
    isolation: "isolate",
  });

  const resolvePosition = () => {
    const parent = node.offsetParent as HTMLElement;
    if (!parent) {
      return;
    }

    currentX = Geometry.resolve(initialX, parent.clientWidth);
    currentY = Geometry.resolve(initialY, parent.clientHeight);

    node.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
  };

  const resizeObserver = new ResizeObserver(() => {
    resolvePosition();
    resizeObserver.disconnect();
  });

  if (node.parentElement) {
    resizeObserver.observe(node.parentElement);
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

    node.setPointerCapture(e.pointerId);
    node.style.willChange = "transform";
    node.style.cursor = "grabbing";

    model.beginMove(e, node, id);

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
