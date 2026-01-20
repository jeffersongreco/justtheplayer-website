// DragManager.ts
import { dragModel } from "./DragModel.svelte";

export function dragManager(node: HTMLElement) {
  // Initial Setup
  Object.assign(node.style, {
    touchAction: "none",
    userSelect: "none",
    position: "absolute",
    willChange: "transform",
    cursor: "grab",
    zIndex: "10",
  });

  const onMove = (e: PointerEvent) => {
    if (!dragModel.isDragging) {
      return;
    }
    if (e.cancelable) {
      e.preventDefault();
    } // Stop scroll on mobile

    dragModel.move(e);

    // Direct DOM update for performance (The View Binding)
    node.style.transform = `translate3d(${dragModel.x}px, ${dragModel.y}px, 0)`;
  };

  const onStart = (e: PointerEvent) => {
    if (e.button !== 0) {
      return;
    } // Only Left Click

    // Capture Pointer (The "Stickiness" fix)
    node.setPointerCapture(e.pointerId);
    node.style.cursor = "grabbing";
    node.style.zIndex = "50";

    // Initialize Model
    dragModel.start(e, node);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onEnd);
    window.addEventListener("pointercancel", onEnd);
  };

  const onEnd = (e: PointerEvent) => {
    dragModel.stop();

    node.style.cursor = "grab";
    node.style.zIndex = "10";
    node.releasePointerCapture(e.pointerId);

    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onEnd);
    window.removeEventListener("pointercancel", onEnd);
  };

  node.addEventListener("pointerdown", onStart);

  return {
    destroy() {
      node.removeEventListener("pointerdown", onStart);
    },
  };
}
