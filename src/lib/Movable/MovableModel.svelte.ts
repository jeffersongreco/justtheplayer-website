import { Geometry } from "./Geometry";

type SensorConfiguration = {
  rect: DOMRect;
  accepts: string[];
};

export class MovableModel {
  activeItemID = $state<string | null>(null);
  activeItemGroup = $state<string>("default");
  activeSensorID = $state<string | null>(null);
  pointerPos = $state({ x: 0, y: 0 });

  #limits = { minX: 0, maxX: 0, minY: 0, maxY: 0 };
  #dragStart = { x: 0, y: 0, mouseX: 0, mouseY: 0 };
  #dims = { w: 0, h: 0, offsetX: 0, offsetY: 0 };
  readonly #sensors = new Map<string, SensorConfiguration>();

  get targetCount() {
    return this.#sensors.size;
  }

  beginMove(e: PointerEvent, node: HTMLElement, id: string, group = "default") {
    const parent = node.offsetParent as HTMLElement;
    if (!parent) {
      return;
    }

    this.activeSensorID = null;
    this.activeItemID = id;
    this.activeItemGroup = group;

    const nodeRect = node.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

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
      minX: currentX - (nodeRect.left - parentRect.left),
      maxX: currentX + (parentRect.right - nodeRect.right),
      minY: currentY - (nodeRect.top - parentRect.top),
      maxY: currentY + (parentRect.bottom - nodeRect.bottom),
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
    this.detectCollisions(x, y);

    return { x, y };
  }

  endMove() {
    this.activeItemID = null;
  }

  private detectCollisions(currentX: number, currentY: number) {
    const projectedRect = {
      x:
        this.#dragStart.mouseX +
        (currentX - this.#dragStart.x) +
        this.#dims.offsetX,
      y:
        this.#dragStart.mouseY +
        (currentY - this.#dragStart.y) +
        this.#dims.offsetY,
      w: this.#dims.w,
      h: this.#dims.h,
    };

    let hitId: string | null = null;

    for (const [id, config] of this.#sensors) {
      if (
        Geometry.intersects(projectedRect, config.rect) &&
        (config.accepts.length === 0 ||
          config.accepts.includes(this.activeItemGroup))
      ) {
        hitId = id;
        break;
      }
    }
    this.activeSensorID = hitId;
  }

  registerTarget(id: string, rect: DOMRect, accepts: string[] = []) {
    this.#sensors.set(id, { rect, accepts });
  }

  unregisterTarget(id: string) {
    this.#sensors.delete(id);
  }
}
