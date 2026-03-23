import { DEV } from "esm-env";
import { createContext } from "svelte";
import { Geometry } from "./Geometry";
import type {
  ItemRect,
  MovableInteraction,
  MovableRect,
  MoveLimits,
  MovePosition,
} from "./Movable.internal-types";
import type { MovableGroup } from "./Movable.types";

export const [getMovableContext, setMovableContext] =
  createContext<MovableModel>();

type SensorConfiguration = {
  rect: MovableRect;
  accepts: MovableGroup;
};

export class MovableModel implements MovableInteraction {
  #activeItemID = $state<string | null>(null);
  #activeItemGroup = $state<MovableGroup>([]);
  #activeSensorID = $state<string | null>(null);
  #hasRoot = $state(false);

  readonly activeItemID = $derived(this.#activeItemID);
  readonly activeItemGroup = $derived(this.#activeItemGroup);
  readonly activeSensorID = $derived(this.#activeSensorID);
  readonly hasRoot = $derived(this.#hasRoot);

  /** Non-reactive position for rAF reads. Written by changed(), read by Coordinator. */
  activePosition: MovePosition = { x: 0, y: 0 };
  /** Non-reactive DOM reference for Coordinators. Not part of Model state. */
  rootEl: HTMLElement | null = null;
  /** Non-reactive DOM reference for a11y live region. Set by ContextCoordinator. */
  liveRegionEl: HTMLElement | null = null;
  /** Stable ID for keyboard instructions element. Set by ContextCoordinator. */
  instructionsId: string | null = null;

  #limits: MoveLimits = { minX: 0, maxX: 0, minY: 0, maxY: 0 };
  #itemRect: ItemRect = { width: 0, height: 0, baseLeft: 0, baseTop: 0 };
  readonly #sensors = new Map<string, SensorConfiguration>();

  get sensorCount() {
    return this.#sensors.size;
  }

  isOverSensor(id: string): boolean {
    return this.#activeSensorID === id;
  }

  began(
    id: string,
    group: MovableGroup,
    position: MovePosition,
    limits: MoveLimits,
    rect: ItemRect
  ) {
    if (!this.#hasRoot) {
      return;
    }

    if (DEV) {
      console.log(`[Movable:Model] began → item="${id}"`);
    }

    this.#activeSensorID = null;
    this.activePosition = { x: position.x, y: position.y };
    this.#activeItemID = id;
    this.#activeItemGroup = group;
    this.#limits = limits;
    this.#itemRect = rect;

    // Run collision detection immediately so isOver is correct from the first frame
    this.detectCollisions({
      x: this.#itemRect.baseLeft + position.x,
      y: this.#itemRect.baseTop + position.y,
      width: this.#itemRect.width,
      height: this.#itemRect.height,
    });
  }

  changed(x: number, y: number): MovePosition {
    const clampedX = Geometry.clamp(x, this.#limits.minX, this.#limits.maxX);
    const clampedY = Geometry.clamp(y, this.#limits.minY, this.#limits.maxY);

    this.activePosition = { x: clampedX, y: clampedY };

    this.detectCollisions({
      x: this.#itemRect.baseLeft + clampedX,
      y: this.#itemRect.baseTop + clampedY,
      width: this.#itemRect.width,
      height: this.#itemRect.height,
    });

    return { x: clampedX, y: clampedY };
  }

  ended() {
    if (DEV && this.#activeItemID) {
      console.log(`[Movable:Model] ended → item="${this.#activeItemID}"`);
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
    this.rootEl = el;
    this.#hasRoot = el !== null;
  }
}
