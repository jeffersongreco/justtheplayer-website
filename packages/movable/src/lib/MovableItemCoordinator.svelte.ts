import { DEV } from "esm-env";
import { Geometry } from "./Geometry";
import type { MovableGroup, MovableItemPosition } from "./Movable.types";
import { MovableDragInteraction } from "./MovableDragInteraction.svelte";
import { MovableKeyboardInteraction } from "./MovableKeyboardInteraction.svelte";
import type { MovableModel } from "./MovableModel.svelte";

/**
 * ARIA announcement strings for the movable item. All optional — the modifier
 * has no i18n mechanism, so consumers must supply localized strings.
 *
 * Note: the live region is not cleared automatically between transitions. If
 * only some announcements are provided, the last announced text persists until
 * another announcement overwrites it.
 */
export interface MovableItemAriaOptions {
  ariaRoleDescription?: string;
  grabbedAnnouncement?: string;
  leftSensorAnnouncement?: string;
  overSensorAnnouncement?: string;
  positionAnnouncement?: (x: number, y: number) => string;
  releasedAnnouncement?: string;
}

export class MovableItemCoordinator {
  readonly #el: HTMLElement;
  readonly #model: MovableModel;
  readonly #id: string;
  readonly #initialPosition: MovableItemPosition;

  #currentX = 0;
  #currentY = 0;
  #hasUserMoved = false;
  #rafId: number | null = null;
  #prevSensorId: string | null = null;
  #prevIsActive = false;
  readonly #resizeObserver: ResizeObserver;
  readonly #interactions: { destroy(): void }[];

  readonly #onFocusChange?: (focused: boolean) => void;
  readonly #handleFocusIn: (e: FocusEvent) => void;
  readonly #handleFocusOut: () => void;

  constructor(
    el: HTMLElement,
    model: MovableModel,
    id: string,
    initialPosition: MovableItemPosition,
    group: MovableGroup,
    stepSize?: number,
    tabindex = 0,
    onFocusChange?: (focused: boolean) => void,
    aria?: MovableItemAriaOptions
  ) {
    this.#el = el;
    this.#model = model;
    this.#id = id;
    this.#initialPosition = initialPosition;
    this.#onFocusChange = onFocusChange;

    // Role and tabindex (previously set by the component wrapper)
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", String(tabindex));

    // Focus tracking (migrated from MovableItem.svelte)
    this.#handleFocusIn = (e: FocusEvent) => {
      if (e.target instanceof HTMLElement) {
        this.#onFocusChange?.(e.target.matches(":focus-visible"));
      }
    };
    this.#handleFocusOut = () => this.#onFocusChange?.(false);
    el.addEventListener("focusin", this.#handleFocusIn);
    el.addEventListener("focusout", this.#handleFocusOut);

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
      outline: "none",
    });

    // ARIA attributes for drag state — no default strings, consumers supply
    // localized text (the modifier has no i18n mechanism).
    if (aria?.ariaRoleDescription) {
      el.setAttribute("aria-roledescription", aria.ariaRoleDescription);
    }
    el.setAttribute("aria-pressed", "false");
    if (model.instructionsId) {
      el.setAttribute("aria-describedby", model.instructionsId);
    }

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

    // $effect observes model.activeItemID → manages rAF, cursor, will-change, ARIA
    $effect(() => {
      const isActive = model.activeItemID === id;
      el.toggleAttribute("data-grabbing", isActive);
      if (isActive) {
        this.#hasUserMoved = true;
        el.style.willChange = "transform";
        el.style.cursor = "grabbing";
        el.setAttribute("aria-pressed", "true");
        this.#startRafLoop();
      } else {
        el.style.willChange = "auto";
        el.style.cursor = "grab";
        el.setAttribute("aria-pressed", "false");
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
      const liveRegion = model.liveRegionEl;
      if (liveRegion) {
        const announcement = isActive
          ? aria?.grabbedAnnouncement
          : aria?.releasedAnnouncement;
        if (announcement) {
          liveRegion.textContent = announcement;
        }
      }
    });

    // $effect observes model.activeSensorID → announces proximity to screen readers
    $effect(() => {
      const sensorId = model.activeSensorID;
      const isActive = model.activeItemID === id;
      const liveRegion = model.liveRegionEl;

      // Skip on the initial grab frame so the "Grabbed…" announcement is not overwritten
      const justActivated = isActive && !this.#prevIsActive;

      if (
        isActive &&
        !justActivated &&
        liveRegion &&
        sensorId !== this.#prevSensorId
      ) {
        if (sensorId !== null && aria?.overSensorAnnouncement) {
          liveRegion.textContent = aria.overSensorAnnouncement;
        } else if (
          this.#prevSensorId !== null &&
          aria?.leftSensorAnnouncement
        ) {
          liveRegion.textContent = aria.leftSensorAnnouncement;
        }
      }
      this.#prevSensorId = sensorId;
      this.#prevIsActive = isActive;
    });

    // Interactions talk only to Model via the protocol — Coordinator is agnostic
    this.#interactions = [
      new MovableDragInteraction(el, model, id, group),
      new MovableKeyboardInteraction(el, model, id, group, stepSize, (x, y) => {
        if (model.liveRegionEl && aria?.positionAnnouncement) {
          model.liveRegionEl.textContent = aria.positionAnnouncement(
            Math.round(x),
            Math.round(y)
          );
        }
      }),
    ];

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
    this.#el.removeAttribute("data-grabbing");
    this.#el.removeEventListener("focusin", this.#handleFocusIn);
    this.#el.removeEventListener("focusout", this.#handleFocusOut);
    this.#resizeObserver.disconnect();
    for (const interaction of this.#interactions) {
      interaction.destroy();
    }
    this.#stopRafLoop();
  }
}
