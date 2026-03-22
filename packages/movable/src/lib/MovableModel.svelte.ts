import { DEV } from "esm-env";
import { createContext } from "svelte";
import { Geometry } from "./Geometry";
import type { MovableGroup, MovableRect } from "./Movable.types";

export const [getMovableContext, setMovableContext] =
  createContext<MovableModel>();

type SensorConfiguration = {
  rect: MovableRect;
  accepts: MovableGroup;
};

export class MovableModel {
  #activeItemID = $state<string | null>(null);
  #activeItemGroup = $state<MovableGroup>([]);
  #activeSensorID = $state<string | null>(null);
  #rootEl = $state<HTMLElement | null>(null);

  readonly activeItemID = $derived(this.#activeItemID);
  readonly activeItemGroup = $derived(this.#activeItemGroup);
  readonly activeSensorID = $derived(this.#activeSensorID);
  readonly rootEl = $derived(this.#rootEl);

  /** Non-reactive position for rAF reads. Written by updatePosition, read by Coordinator. */
  activePosition = { x: 0, y: 0 };
  /** Non-reactive pointer position for collision detection. */
  pointerPos = { x: 0, y: 0 };

  #limits = { minX: 0, maxX: 0, minY: 0, maxY: 0 };
  #dragStart = { x: 0, y: 0, mouseX: 0, mouseY: 0 };
  #dims = { w: 0, h: 0, offsetX: 0, offsetY: 0 };
  readonly #sensors = new Map<string, SensorConfiguration>();

  get sensorCount() {
    return this.#sensors.size;
  }

  isOverSensor(id: string): boolean {
    return this.#activeSensorID === id;
  }

  beginMove(e: PointerEvent, el: HTMLElement, id: string, group: MovableGroup) {
    if (!this.#rootEl) {
      return;
    }

    if (DEV) {
      console.log(`[Movable:Model] beginMove → item="${id}"`);
    }

    this.#activeSensorID = null;
    this.#activeItemID = id;
    this.#activeItemGroup = group;

    const elRect = el.getBoundingClientRect();
    const rootRect = this.#rootEl.getBoundingClientRect();

    this.#dims = {
      w: elRect.width,
      h: elRect.height,
      offsetX: elRect.left - e.clientX,
      offsetY: elRect.top - e.clientY,
    };

    const currentTransform = new WebKitCSSMatrix(
      window.getComputedStyle(el).transform
    );
    const currentX = currentTransform.m41;
    const currentY = currentTransform.m42;

    this.#limits = {
      minX: currentX - (elRect.left - rootRect.left),
      maxX: currentX + (rootRect.right - elRect.right),
      minY: currentY - (elRect.top - rootRect.top),
      maxY: currentY + (rootRect.bottom - elRect.bottom),
    };

    this.#dragStart = {
      x: currentX,
      y: currentY,
      mouseX: e.clientX,
      mouseY: e.clientY,
    };
  }

  updatePosition(e: PointerEvent) {
    const deltaX = e.clientX - this.#dragStart.mouseX;
    const deltaY = e.clientY - this.#dragStart.mouseY;

    const x = Geometry.clamp(
      this.#dragStart.x + deltaX,
      this.#limits.minX,
      this.#limits.maxX
    );
    const y = Geometry.clamp(
      this.#dragStart.y + deltaY,
      this.#limits.minY,
      this.#limits.maxY
    );

    this.activePosition = { x, y };
    this.pointerPos = { x: e.clientX, y: e.clientY };

    this.detectCollisions({
      x: this.#dragStart.mouseX + (x - this.#dragStart.x) + this.#dims.offsetX,
      y: this.#dragStart.mouseY + (y - this.#dragStart.y) + this.#dims.offsetY,
      width: this.#dims.w,
      height: this.#dims.h,
    });

    return { x, y };
  }

  endMove() {
    if (DEV && this.#activeItemID) {
      console.log(`[Movable:Model] endMove → item="${this.#activeItemID}"`);
    }
    this.#activeItemID = null;
  }

  detectCollisions(rect: MovableRect) {
    let hitId: string | null = null;

    for (const [id, config] of this.#sensors) {
      if (
        Geometry.intersects(rect, config.rect) &&
        (config.accepts.length === 0 ||
          this.#activeItemGroup.some((g) => config.accepts.includes(g)))
      ) {
        hitId = id;
        break;
      }
    }
    if (this.#activeSensorID !== hitId) {
      this.#activeSensorID = hitId;
    }
  }

  registerSensor(id: string, rect: MovableRect, accepts: MovableGroup) {
    if (DEV) {
      console.log(`[Movable:Model] registerSensor → "${id}"`);
    }
    this.#sensors.set(id, { rect, accepts });
  }

  unregisterSensor(id: string) {
    if (DEV) {
      console.log(`[Movable:Model] unregisterSensor → "${id}"`);
    }
    this.#sensors.delete(id);
  }

  registerRoot(el: HTMLElement | null) {
    if (DEV) {
      console.log(`[Movable:Model] registerRoot → ${el ? "element" : "null"}`);
    }
    this.#rootEl = el;
  }
}
