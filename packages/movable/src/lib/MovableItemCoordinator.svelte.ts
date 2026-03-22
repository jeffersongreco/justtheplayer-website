import { DEV } from "esm-env";
import { Geometry } from "./Geometry";
import type { MovableGroup, MovableItemPosition } from "./Movable.types";
import { MovableDragInteraction } from "./MovableDragInteraction.svelte";
import type { MovableModel } from "./MovableModel.svelte";

export class MovableItemCoordinator {
  readonly #el: HTMLElement;
  readonly #model: MovableModel;
  readonly #id: string;
  readonly #initialPosition: MovableItemPosition;

  #currentX = 0;
  #currentY = 0;
  #hasUserMoved = false;
  #rafId: number | null = null;
  readonly #resizeObserver: ResizeObserver;
  readonly #dragInteraction: MovableDragInteraction;

  constructor(
    el: HTMLElement,
    model: MovableModel,
    id: string,
    initialPosition: MovableItemPosition,
    group: MovableGroup
  ) {
    this.#el = el;
    this.#model = model;
    this.#id = id;
    this.#initialPosition = initialPosition;

    Object.assign(el.style, {
      position: "absolute",
      top: "0",
      left: "0",
      zIndex: "999",
      isolation: "isolate",
      willChange: "auto",
      touchAction: "none",
      userSelect: "none",
      webkitUserSelect: "none",
      cursor: "grab",
    });

    // ResizeObserver for initial position + smart anchor
    this.#resizeObserver = new ResizeObserver(() => {
      if (!this.#hasUserMoved && this.#currentX === 0 && this.#currentY === 0) {
        const resolved = this.#resolvePosition();
        if (resolved) {
          this.#validateStructure();
        }
      }
      this.#handleResize();
    });

    if (model.rootEl) {
      this.#resizeObserver.observe(model.rootEl);
      this.#resolvePosition();
    } else {
      requestAnimationFrame(() => {
        if (model.rootEl) {
          this.#resizeObserver.observe(model.rootEl);
          this.#resolvePosition();
        }
      });
    }

    // $effect observes model.activeItemID → manages rAF, cursor, will-change
    $effect(() => {
      const isActive = model.activeItemID === id;
      if (isActive) {
        this.#hasUserMoved = true;
        el.style.willChange = "transform";
        el.style.cursor = "grabbing";
        this.#startRafLoop();
      } else {
        el.style.willChange = "auto";
        el.style.cursor = "grab";
        // Sync final position before stopping rAF
        if (this.#rafId) {
          const { x, y } = model.activePosition;
          if (x !== 0 || y !== 0) {
            this.#currentX = x;
            this.#currentY = y;
          }
        }
        this.#stopRafLoop();
      }
    });

    // Interaction talks only to Model — no Coordinator references
    this.#dragInteraction = new MovableDragInteraction(el, model, id, group);

    if (DEV) {
      console.log(`[Movable:ItemCoordinator] mount → id="${id}"`);
    }
  }

  #resolvePosition(): boolean {
    const root = this.#model.rootEl;
    if (!root || (root.clientWidth === 0 && root.clientHeight === 0)) {
      return false;
    }

    this.#currentX = Geometry.resolve(
      this.#initialPosition.x,
      root.clientWidth
    );
    this.#currentY = Geometry.resolve(
      this.#initialPosition.y,
      root.clientHeight
    );

    this.#el.style.transform = `translate3d(${this.#currentX}px, ${this.#currentY}px, 0)`;

    this.#model.detectCollisions({
      x: this.#currentX,
      y: this.#currentY,
      width: this.#el.offsetWidth,
      height: this.#el.offsetHeight,
    });

    return true;
  }

  #validateStructure(): boolean {
    const root = this.#model.rootEl;
    if (!root) {
      return false;
    }

    if (this.#el.offsetParent && this.#el.offsetParent !== root) {
      console.error(
        "[Movable:ItemCoordinator] Structural Error: <Movable.Item> nested in intermediate positioned element."
      );
      return false;
    }
    return true;
  }

  #handleResize() {
    const root = this.#model.rootEl;
    if (!root) {
      return;
    }

    if (this.#hasUserMoved) {
      const maxX = root.clientWidth - this.#el.offsetWidth;
      const maxY = root.clientHeight - this.#el.offsetHeight;

      const clampedX = Geometry.clamp(this.#currentX, 0, maxX);
      const clampedY = Geometry.clamp(this.#currentY, 0, maxY);

      if (clampedX !== this.#currentX || clampedY !== this.#currentY) {
        this.#currentX = clampedX;
        this.#currentY = clampedY;
        this.#el.style.transform = `translate3d(${this.#currentX}px, ${this.#currentY}px, 0)`;
      }
    } else {
      this.#resolvePosition();
    }
  }

  readonly #syncVisuals = () => {
    const { x, y } = this.#model.activePosition;
    this.#currentX = x;
    this.#currentY = y;
    this.#el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    this.#rafId = requestAnimationFrame(this.#syncVisuals);
  };

  #startRafLoop() {
    if (!this.#rafId) {
      this.#rafId = requestAnimationFrame(this.#syncVisuals);
    }
  }

  #stopRafLoop() {
    if (this.#rafId) {
      cancelAnimationFrame(this.#rafId);
      this.#rafId = null;
    }
  }

  destroy() {
    if (DEV) {
      console.log(`[Movable:ItemCoordinator] destroy → id="${this.#id}"`);
    }
    this.#resizeObserver.disconnect();
    this.#dragInteraction.destroy();
    this.#stopRafLoop();
  }
}
