import type { MovableInteraction } from "./Movable.internal-types";
import type { MovableGroup } from "./Movable.types";

/**
 * Translates pointer hardware events into protocol calls.
 * Owns all pointer-specific math (delta computation, pointer capture).
 * Talks only to the MovableInteraction protocol — never references
 * Coordinator or CSS.
 */
export class MovableDragInteraction {
  readonly #el: HTMLElement;
  readonly #protocol: MovableInteraction;
  readonly #id: string;
  readonly #group: MovableGroup;

  #startPointerX = 0;
  #startPointerY = 0;
  #startX = 0;
  #startY = 0;

  constructor(
    el: HTMLElement,
    protocol: MovableInteraction,
    id: string,
    group: MovableGroup
  ) {
    this.#el = el;
    this.#protocol = protocol;
    this.#id = id;
    this.#group = group;

    el.addEventListener("pointerdown", this.#onStart);
  }

  readonly #onStart = (e: PointerEvent) => {
    if (e.button !== 0) {
      return;
    }

    const rootEl = this.#protocol.rootEl;
    if (!rootEl) {
      return;
    }

    this.#el.setPointerCapture(e.pointerId);

    const elRect = this.#el.getBoundingClientRect();
    const rootRect = rootEl.getBoundingClientRect();

    const currentTransform = new DOMMatrix(
      window.getComputedStyle(this.#el).transform
    );
    const currentX = currentTransform.m41;
    const currentY = currentTransform.m42;

    // Track pointer start for delta computation (pointer math stays here)
    this.#startPointerX = e.clientX;
    this.#startPointerY = e.clientY;
    this.#startX = currentX;
    this.#startY = currentY;

    this.#protocol.began(
      this.#id,
      this.#group ?? [],
      { x: currentX, y: currentY },
      {
        minX: currentX - (elRect.left - rootRect.left),
        maxX: currentX + (rootRect.right - elRect.right),
        minY: currentY - (elRect.top - rootRect.top),
        maxY: currentY + (rootRect.bottom - elRect.bottom),
      },
      {
        width: elRect.width,
        height: elRect.height,
        baseLeft: elRect.left - currentX,
        baseTop: elRect.top - currentY,
      }
    );

    window.addEventListener("pointermove", this.#onMove);
    window.addEventListener("pointerup", this.#onEnd);
    window.addEventListener("pointercancel", this.#onEnd);
  };

  readonly #onMove = (e: PointerEvent) => {
    if (this.#protocol.activeItemID !== this.#id) {
      return;
    }
    if (e.cancelable) {
      e.preventDefault();
    }

    // Pointer delta computation lives in the Interaction, not the Model
    const x = this.#startX + (e.clientX - this.#startPointerX);
    const y = this.#startY + (e.clientY - this.#startPointerY);

    this.#protocol.changed(x, y);
  };

  readonly #onEnd = (e: PointerEvent) => {
    this.#protocol.ended();
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
