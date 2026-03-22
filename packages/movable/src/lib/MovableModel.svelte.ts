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

export type DragOrigin = {
  x: number;
  y: number;
  pointerX: number;
  pointerY: number;
};

export type DragLimits = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

export type ItemDimensions = {
  width: number;
  height: number;
  pointerOffsetX: number;
  pointerOffsetY: number;
};

export class MovableModel {
  #activeItemID = $state<string | null>(null);
  #activeItemGroup = $state<MovableGroup>([]);
  #activeSensorID = $state<string | null>(null);
  #hasRoot = $state(false);

  readonly activeItemID = $derived(this.#activeItemID);
  readonly activeItemGroup = $derived(this.#activeItemGroup);
  readonly activeSensorID = $derived(this.#activeSensorID);
  readonly hasRoot = $derived(this.#hasRoot);

  /** Non-reactive position for rAF reads. Written by updatePosition, read by Coordinator. */
  activePosition = { x: 0, y: 0 };
  /** Non-reactive DOM reference for Coordinators. Not part of Model state. */
  rootEl: HTMLElement | null = null;

  #limits: DragLimits = { minX: 0, maxX: 0, minY: 0, maxY: 0 };
  #dragStart: DragOrigin = { x: 0, y: 0, pointerX: 0, pointerY: 0 };
  #dims: ItemDimensions = {
    width: 0,
    height: 0,
    pointerOffsetX: 0,
    pointerOffsetY: 0,
  };
  readonly #sensors = new Map<string, SensorConfiguration>();

  get sensorCount() {
    return this.#sensors.size;
  }

  isOverSensor(id: string): boolean {
    return this.#activeSensorID === id;
  }

  beginMove(
    id: string,
    group: MovableGroup,
    origin: DragOrigin,
    limits: DragLimits,
    dims: ItemDimensions
  ) {
    if (!this.#hasRoot) {
      return;
    }

    if (DEV) {
      console.log(`[Movable:Model] beginMove → item="${id}"`);
    }

    this.#activeSensorID = null;
    this.activePosition = { x: origin.x, y: origin.y };
    this.#activeItemID = id;
    this.#activeItemGroup = group;
    this.#dragStart = origin;
    this.#limits = limits;
    this.#dims = dims;
  }

  updatePosition(pointerX: number, pointerY: number) {
    const deltaX = pointerX - this.#dragStart.pointerX;
    const deltaY = pointerY - this.#dragStart.pointerY;

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

    this.detectCollisions({
      x:
        this.#dragStart.pointerX +
        (x - this.#dragStart.x) +
        this.#dims.pointerOffsetX,
      y:
        this.#dragStart.pointerY +
        (y - this.#dragStart.y) +
        this.#dims.pointerOffsetY,
      width: this.#dims.width,
      height: this.#dims.height,
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
    this.rootEl = el;
    this.#hasRoot = el !== null;
  }
}
