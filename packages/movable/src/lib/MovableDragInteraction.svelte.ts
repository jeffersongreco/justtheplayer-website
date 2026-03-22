import type { MovableGroup } from "./Movable.types";
import type { MovableModel } from "./MovableModel.svelte";

/**
 * Translates pointer hardware events into Model commands.
 * Talks only to Model — never references Coordinator or CSS.
 * All imperative DOM work (events, pointer capture, measurements) lives here.
 */
export class MovableDragInteraction {
  readonly #el: HTMLElement;
  readonly #model: MovableModel;
  readonly #id: string;
  readonly #group: MovableGroup;

  constructor(
    el: HTMLElement,
    model: MovableModel,
    id: string,
    group: MovableGroup
  ) {
    this.#el = el;
    this.#model = model;
    this.#id = id;
    this.#group = group;

    el.addEventListener("pointerdown", this.#onStart);
  }

  readonly #onStart = (e: PointerEvent) => {
    if (e.button !== 0) {
      return;
    }

    const rootEl = this.#model.rootEl;
    if (!rootEl) {
      return;
    }

    this.#el.setPointerCapture(e.pointerId);

    const elRect = this.#el.getBoundingClientRect();
    const rootRect = rootEl.getBoundingClientRect();

    const currentTransform = new WebKitCSSMatrix(
      window.getComputedStyle(this.#el).transform
    );
    const currentX = currentTransform.m41;
    const currentY = currentTransform.m42;

    this.#model.beginMove(
      this.#id,
      this.#group ?? [],
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

    window.addEventListener("pointermove", this.#onMove);
    window.addEventListener("pointerup", this.#onEnd);
    window.addEventListener("pointercancel", this.#onEnd);
  };

  readonly #onMove = (e: PointerEvent) => {
    if (this.#model.activeItemID !== this.#id) {
      return;
    }
    if (e.cancelable) {
      e.preventDefault();
    }

    this.#model.updatePosition(e.clientX, e.clientY);
  };

  readonly #onEnd = (e: PointerEvent) => {
    this.#model.endMove();
    this.#el.releasePointerCapture(e.pointerId);

    window.removeEventListener("pointermove", this.#onMove);
    window.removeEventListener("pointerup", this.#onEnd);
    window.removeEventListener("pointercancel", this.#onEnd);
  };

  destroy() {
    this.#el.removeEventListener("pointerdown", this.#onStart);
    window.removeEventListener("pointermove", this.#onMove);
    window.removeEventListener("pointerup", this.#onEnd);
    window.removeEventListener("pointercancel", this.#onEnd);
  }
}
