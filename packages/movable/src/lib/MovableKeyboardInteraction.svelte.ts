import type { MovableGroup, MovableInteraction } from "./Movable.types";

/**
 * Translates keyboard events into protocol calls.
 * Enter/Space toggles grab, Arrow keys move in steps, Escape cancels.
 * Talks only to the MovableInteraction protocol — never references
 * Coordinator or CSS.
 */
export class MovableKeyboardInteraction {
  readonly #el: HTMLElement;
  readonly #protocol: MovableInteraction;
  readonly #id: string;
  readonly #group: MovableGroup;
  readonly #stepSize: number;
  readonly #onPositionChanged?: (x: number, y: number) => void;

  constructor(
    el: HTMLElement,
    protocol: MovableInteraction,
    id: string,
    group: MovableGroup,
    stepSize = 10,
    onPositionChanged?: (x: number, y: number) => void
  ) {
    this.#el = el;
    this.#protocol = protocol;
    this.#id = id;
    this.#group = group;
    this.#stepSize = stepSize;
    this.#onPositionChanged = onPositionChanged;

    el.addEventListener("keydown", this.#onKeyDown);
  }

  readonly #onKeyDown = (e: KeyboardEvent) => {
    const isGrabbed = this.#protocol.activeItemID === this.#id;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (isGrabbed) {
        this.#protocol.ended();
      } else {
        this.#beginKeyboardMove();
      }
      return;
    }

    if (e.key === "Escape" && isGrabbed) {
      e.preventDefault();
      this.#protocol.ended();
      return;
    }

    if (e.key === "Tab" && isGrabbed) {
      // Release grab but allow Tab to navigate naturally — no preventDefault
      this.#protocol.ended();
      return;
    }

    if (!isGrabbed) {
      return;
    }

    const step = this.#stepSize;
    let dx = 0;
    let dy = 0;

    switch (e.key) {
      case "ArrowLeft":
        dx = -step;
        break;
      case "ArrowRight":
        dx = step;
        break;
      case "ArrowUp":
        dy = -step;
        break;
      case "ArrowDown":
        dy = step;
        break;
      default:
        return;
    }

    e.preventDefault();

    const { x, y } = this.#protocol.activePosition;
    const newPos = this.#protocol.changed(x + dx, y + dy);
    this.#onPositionChanged?.(newPos.x, newPos.y);
  };

  #beginKeyboardMove() {
    const rootEl = this.#protocol.rootEl;
    if (!rootEl) {
      return;
    }

    const elRect = this.#el.getBoundingClientRect();
    const rootRect = rootEl.getBoundingClientRect();

    const currentTransform = new DOMMatrix(
      window.getComputedStyle(this.#el).transform
    );
    const currentX = currentTransform.m41;
    const currentY = currentTransform.m42;

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
  }

  destroy() {
    this.#el.removeEventListener("keydown", this.#onKeyDown);
  }
}
