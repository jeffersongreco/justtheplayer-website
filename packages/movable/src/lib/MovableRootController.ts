import type { MovableModel } from "./MovableModel.svelte";

export function createMovableRootController(
  el: HTMLElement,
  model: MovableModel
) {
  model.registerRoot(el);

  const style = window.getComputedStyle(el);
  if (style.position === "static" || style.position === "" || !style.position) {
    console.warn(
      `[Movable] Root element has "position: static". Auto-fixing to "relative" to ensure coordinate system integrity.`
    );
    el.style.position = "relative";
  }

  return {
    destroy() {
      model.registerRoot(null);
    },
  };
}
