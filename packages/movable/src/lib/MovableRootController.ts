import type { MovableModel } from "./MovableModel.svelte";

export function createMovableRootController(
  node: HTMLElement,
  model: MovableModel
) {
  model.registerRoot(node);

  const style = window.getComputedStyle(node);
  if (style.position === "static" || style.position === "" || !style.position) {
    console.warn(
      `[Movable] Root element has "position: static". Auto-fixing to "relative" to ensure coordinate system integrity.`
    );
    node.style.position = "relative";
  }

  return {
    destroy() {
      model.registerRoot(null);
    },
  };
}
