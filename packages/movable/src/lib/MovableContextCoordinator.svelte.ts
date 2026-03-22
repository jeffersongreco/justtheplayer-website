import { DEV } from "esm-env";
import type { MovableModel } from "./MovableModel.svelte";

export class MovableContextCoordinator {
  readonly #model: MovableModel;

  constructor(el: HTMLElement, model: MovableModel) {
    this.#model = model;

    model.registerRoot(el);

    const style = window.getComputedStyle(el);
    if (
      style.position === "static" ||
      style.position === "" ||
      !style.position
    ) {
      console.warn(
        '[Movable:Coordinator] Root element has "position: static". Auto-fixing to "relative" to ensure coordinate system integrity.'
      );
      el.style.position = "relative";
    }

    if (DEV) {
      console.log("[Movable:Coordinator] mount");
    }
  }

  destroy() {
    if (DEV) {
      console.log("[Movable:Coordinator] destroy");
    }
    this.#model.registerRoot(null);
  }
}
