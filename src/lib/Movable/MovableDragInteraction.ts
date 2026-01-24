import type { MovableItemControllerInteractionAPI } from "./MovableItemController";

export function createMovableDragInteraction(
  controller: MovableItemControllerInteractionAPI
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

    const { x, y } = model.updatePosition(e);

    controller.moveTo(x, y);
  };

  const onStart = (e: PointerEvent) => {
    if (e.button !== 0) {
      return;
    }

    controller.markAsUserMoved();
    controller.promoteLayer();

    node.setPointerCapture(e.pointerId);
    node.style.cursor = "grabbing";

    model.beginMove(e, node, id, group ?? "default");

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
