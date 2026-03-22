import type { MovableItemInteractionAPI } from "./MovableItemCoordinator.svelte";

export function createMovableDragInteraction(
  controller: MovableItemInteractionAPI
) {
  const { node, model, id, group } = controller;

  Object.assign(node.style, {
    touchAction: "none",
    userSelect: "none",
    webkitUserSelect: "none",
    cursor: "grab",
  });

  const onMove = (e: PointerEvent) => {
    if (model.activeItemID !== id) {
      return;
    }
    if (e.cancelable) {
      e.preventDefault();
    }

    const { x, y } = model.updatePosition(e.clientX, e.clientY);

    controller.moveTo(x, y);
  };

  const onStart = (e: PointerEvent) => {
    if (e.button !== 0) {
      return;
    }

    const rootEl = model.rootEl;
    if (!rootEl) {
      return;
    }

    controller.markAsUserMoved();
    controller.promoteLayer();

    node.setPointerCapture(e.pointerId);
    node.style.cursor = "grabbing";

    const elRect = node.getBoundingClientRect();
    const rootRect = rootEl.getBoundingClientRect();

    const currentTransform = new WebKitCSSMatrix(
      window.getComputedStyle(node).transform
    );
    const currentX = currentTransform.m41;
    const currentY = currentTransform.m42;

    model.beginMove(
      id,
      group ?? [],
      {
        x: currentX,
        y: currentY,
        pointerX: e.clientX,
        pointerY: e.clientY,
      },
      {
        minX: currentX - (elRect.left - rootRect.left),
        maxX: currentX + (rootRect.right - elRect.right),
        minY: currentY - (elRect.top - rootRect.top),
        maxY: currentY + (rootRect.bottom - elRect.bottom),
      },
      {
        width: elRect.width,
        height: elRect.height,
        pointerOffsetX: elRect.left - e.clientX,
        pointerOffsetY: elRect.top - e.clientY,
      }
    );

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onEnd);
    window.addEventListener("pointercancel", onEnd);
  };

  const onEnd = (e: PointerEvent) => {
    model.endMove();

    node.releasePointerCapture(e.pointerId);
    node.style.cursor = "grab";

    controller.demoteLayer();

    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onEnd);
    window.removeEventListener("pointercancel", onEnd);
  };

  const onEnter = () => controller.promoteLayer();
  const onLeave = () => controller.demoteLayer();

  node.addEventListener("pointerdown", onStart);
  node.addEventListener("pointerenter", onEnter);
  node.addEventListener("pointerleave", onLeave);

  return {
    destroy() {
      node.removeEventListener("pointerdown", onStart);
      node.removeEventListener("pointerenter", onEnter);
      node.removeEventListener("pointerleave", onLeave);
    },
  };
}
