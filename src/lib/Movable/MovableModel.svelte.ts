import { getContext, setContext } from "svelte";
import { Geometry } from "./Geometry";
import type { MovableGroup, MovableRect } from "./types";

const CONTEXT_KEY = Symbol("MOVABLE_MODEL");

type SensorConfiguration = {
  rect: MovableRect;
  accepts: MovableGroup;
};

export class MovableModel {
  static provide(): MovableModel {
    const model = new MovableModel();
    setContext(CONTEXT_KEY, model);
    return model;
  }

  static get(): MovableModel {
    const model = getContext<MovableModel>(CONTEXT_KEY);
    if (!model) {
      throw new Error("Movable components must be inside a <Movable.Root>.");
    }
    return model;
  }

  activeItemID = $state<string | null>(null);
  activeItemGroup = $state<MovableGroup>([]);
  activeSensorID = $state<string | null>(null);
  rootNode = $state<HTMLElement | null>(null);
  pointerPos = $state({ x: 0, y: 0 });

  #limits = { minX: 0, maxX: 0, minY: 0, maxY: 0 };
  #dragStart = { x: 0, y: 0, mouseX: 0, mouseY: 0 };
  #dims = { w: 0, h: 0, offsetX: 0, offsetY: 0 };
  readonly #sensors = new Map<string, SensorConfiguration>();

  get targetCount() {
    return this.#sensors.size;
  }

  isOverSensor(id: string): boolean {
    return this.activeSensorID === id;
  }

  beginMove(
    e: PointerEvent,
    node: HTMLElement,
    id: string,
    group: MovableGroup
  ) {
    if (!this.rootNode) {
      return;
    }

    this.activeSensorID = null;
    this.activeItemID = id;
    this.activeItemGroup = group;

    const nodeRect = node.getBoundingClientRect();
    const rootRect = this.rootNode.getBoundingClientRect();

    this.#dims = {
      w: nodeRect.width,
      h: nodeRect.height,
      offsetX: nodeRect.left - e.clientX,
      offsetY: nodeRect.top - e.clientY,
    };

    const currentTransform = new WebKitCSSMatrix(
      window.getComputedStyle(node).transform
    );
    const currentX = currentTransform.m41;
    const currentY = currentTransform.m42;

    this.#limits = {
      minX: currentX - (nodeRect.left - rootRect.left),
      maxX: currentX + (rootRect.right - nodeRect.right),
      minY: currentY - (nodeRect.top - rootRect.top),
      maxY: currentY + (rootRect.bottom - nodeRect.bottom),
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
    this.activeItemID = null;
  }

  detectCollisions(rect: MovableRect) {
    let hitId: string | null = null;

    for (const [id, config] of this.#sensors) {
      if (
        Geometry.intersects(rect, config.rect) &&
        (config.accepts.length === 0 ||
          this.activeItemGroup.some((g) => config.accepts.includes(g)))
      ) {
        hitId = id;
        break;
      }
    }
    this.activeSensorID = hitId;
  }

  registerSensor(id: string, rect: MovableRect, accepts: MovableGroup) {
    this.#sensors.set(id, { rect, accepts });
  }

  unregisterSensor(id: string) {
    this.#sensors.delete(id);
  }

  registerRoot(node: HTMLElement | null) {
    this.rootNode = node;
  }
}
