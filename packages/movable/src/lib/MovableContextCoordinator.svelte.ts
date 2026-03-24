import { DEV } from "esm-env";
import type { MovableModel } from "./MovableModel.svelte";

const srOnly: Partial<CSSStyleDeclaration> = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: "0",
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0,0,0,0)",
  whiteSpace: "nowrap",
  borderWidth: "0",
};

export class MovableContextCoordinator {
  readonly #model: MovableModel;
  readonly #liveRegionEl: HTMLElement;
  readonly #instructionsEl: HTMLElement;

  constructor(el: HTMLElement, model: MovableModel, instructionsText?: string) {
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

    // Keyboard instructions — stable ID for aria-describedby
    const instructionsId = `movable-kb-instructions-${crypto.randomUUID()}`;
    const instructionsEl = document.createElement("p");
    instructionsEl.id = instructionsId;
    // No default text — the modifier intentionally avoids hardcoded strings
    // because it has no i18n mechanism. Consumers must supply localized strings.
    if (instructionsText) {
      instructionsEl.textContent = instructionsText;
    } else if (DEV) {
      console.warn(
        "[Movable:Coordinator] No instructionsText provided. Screen readers will reference an empty element via aria-describedby. Supply localized instructions for accessibility."
      );
    }
    Object.assign(instructionsEl.style, srOnly);
    el.appendChild(instructionsEl);
    this.#instructionsEl = instructionsEl;

    // Live region — written by ItemCoordinator for announcements
    const liveRegionEl = document.createElement("div");
    liveRegionEl.setAttribute("aria-live", "assertive");
    liveRegionEl.setAttribute("aria-atomic", "true");
    Object.assign(liveRegionEl.style, srOnly);
    el.appendChild(liveRegionEl);
    this.#liveRegionEl = liveRegionEl;

    model.liveRegionEl = liveRegionEl;
    model.instructionsId = instructionsId;

    if (DEV) {
      console.log("[Movable:Coordinator] mount");
    }
  }

  destroy() {
    if (DEV) {
      console.log("[Movable:Coordinator] destroy");
    }
    this.#instructionsEl.remove();
    this.#liveRegionEl.remove();
    this.#model.liveRegionEl = null;
    this.#model.instructionsId = null;
    this.#model.registerRoot(null);
  }
}
