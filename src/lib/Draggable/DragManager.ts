// DragManager.ts
import type { DragModel } from "./DragModel.svelte";
import { Physics } from "./Physics";

// Define the config type
type InitialPos = number | string;

export function createDragManager(
  node: HTMLElement,
  model: DragModel,
  id: string,
  initialConfig: { x: InitialPos; y: InitialPos } // NEW
) {
  // Internal state for this specific node
  let currentX = 0;
  let currentY = 0;

  // Setup Styles
  Object.assign(node.style, {
    touchAction: "none",
    userSelect: "none",
    webkitUserSelect: "none",
    position: "absolute",
    cursor: "grab",
    zIndex: "999",
    isolation: "isolate",
  });

  // NEW: Resolve Initial Position
  const resolvePosition = () => {
    const parent = node.offsetParent as HTMLElement;
    if (!parent) {
      return;
    }

    // Convert % or px to real numbers based on parent dimensions
    currentX = Physics.toPixels(initialConfig.x, parent.clientWidth);
    currentY = Physics.toPixels(initialConfig.y, parent.clientHeight);

    // Apply immediately
    node.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
  };

  // Use ResizeObserver to ensure parent dimensions are ready before calculating %
  const resizeObserver = new ResizeObserver(() => {
    // We only resolve if we haven't moved yet (optional, or force reset)
    // Here we run it once to set initial state then disconnect if static
    resolvePosition();
    resizeObserver.disconnect();
  });

  if (node.parentElement) {
    resizeObserver.observe(node.parentElement);
  }

  // --- Interaction Logic ---

  const onMove = (e: PointerEvent) => {
    if (model.activeDraggableId !== id) {
      return;
    }
    if (e.cancelable) {
      e.preventDefault();
    }

    // The model calculates the delta and clamping
    // We pass the event. The Model uses its internal 'dragStart' state
    // which was captured in onStart to return the new absolute X/Y.
    const { x, y } = model.calculateMove(e);

    currentX = x;
    currentY = y;

    node.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
  };

  const prepareLayer = () => {
    // Promote to GPU Layer just before interaction
    node.style.willChange = "transform";
  };

  const cleanupLayer = () => {
    if (model.activeDraggableId !== id) {
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

    // Pass the CURRENT transform position to the model to start calculation
    model.startDrag(e, node, id);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onEnd);
    window.addEventListener("pointercancel", onEnd);
  };

  const onEnd = (e: PointerEvent) => {
    model.stopDrag();

    node.style.willChange = "auto";
    node.style.cursor = "grab";
    node.releasePointerCapture(e.pointerId);

    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onEnd);
    window.removeEventListener("pointercancel", onEnd);
  };

  node.addEventListener("pointerdown", onStart);
  node.addEventListener("pointerenter", prepareLayer);
  node.addEventListener("pointerleave", cleanupLayer);

  return {
    destroy() {
      node.removeEventListener("pointerdown", onStart);
      node.removeEventListener("pointerenter", prepareLayer);
      node.removeEventListener("pointerleave", cleanupLayer);
      resizeObserver.disconnect();
    },
  };
}
