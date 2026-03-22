import { describe, expect, it } from "vitest";
import type {
  DragLimits,
  DragOrigin,
  ItemDimensions,
} from "../lib/MovableModel.svelte";
import { MovableModel } from "../lib/MovableModel.svelte";

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

const SENSOR_RECT = { x: 50, y: 50, width: 100, height: 100 };
const STUB_ROOT = {} as HTMLElement;

function origin(overrides?: Partial<DragOrigin>): DragOrigin {
  return { x: 100, y: 100, pointerX: 200, pointerY: 200, ...overrides };
}

function lim(overrides?: Partial<DragLimits>): DragLimits {
  return { minX: 0, maxX: 500, minY: 0, maxY: 400, ...overrides };
}

function dim(overrides?: Partial<ItemDimensions>): ItemDimensions {
  return {
    width: 50,
    height: 50,
    pointerOffsetX: -10,
    pointerOffsetY: -10,
    ...overrides,
  };
}

function withRoot(model: MovableModel) {
  model.registerRoot(STUB_ROOT);
  return model;
}

function beginDrag(model: MovableModel, id = "item-1", group: string[] = []) {
  withRoot(model);
  model.beginMove(id, group, origin(), lim(), dim());
}

function sensor(model: MovableModel, id: string, accepts: string[] = []) {
  model.registerSensor(id, SENSOR_RECT, accepts);
}

// ===========================================================================
// S1 — Idle State
// ===========================================================================

describe("S1 — Idle State", () => {
  it("starts with no active item", () => {
    const model = new MovableModel();
    expect(model.activeItemID).toBeNull();
  });

  it("starts with no active sensor", () => {
    const model = new MovableModel();
    expect(model.activeSensorID).toBeNull();
  });

  it("starts with no root", () => {
    const model = new MovableModel();
    expect(model.hasRoot).toBe(false);
  });

  it("starts with empty group", () => {
    const model = new MovableModel();
    expect(model.activeItemGroup).toEqual([]);
  });

  it("starts with zero sensors", () => {
    const model = new MovableModel();
    expect(model.sensorCount).toBe(0);
  });

  it("activePosition starts at origin", () => {
    const model = new MovableModel();
    expect(model.activePosition).toEqual({ x: 0, y: 0 });
  });
});

// ===========================================================================
// S2 — Drag Lifecycle
// ===========================================================================

describe("S2 — Drag Lifecycle", () => {
  it("beginMove sets activeItemID", () => {
    const model = new MovableModel();
    beginDrag(model, "my-item");
    expect(model.activeItemID).toBe("my-item");
  });

  it("beginMove sets activeItemGroup", () => {
    const model = withRoot(new MovableModel());
    model.beginMove("item-1", ["ghost"], origin(), lim(), dim());
    expect(model.activeItemGroup).toEqual(["ghost"]);
  });

  it("beginMove clears activeSensorID", () => {
    const model = withRoot(new MovableModel());
    sensor(model, "sensor-1");
    model.beginMove("item-1", [], origin(), lim(), dim());
    expect(model.activeSensorID).toBeNull();
  });

  it("beginMove is no-op without root", () => {
    const model = new MovableModel();
    model.beginMove("item-1", [], origin(), lim(), dim());
    expect(model.activeItemID).toBeNull();
  });

  it("updatePosition returns clamped coordinates", () => {
    const model = new MovableModel();
    beginDrag(model);
    const pos = model.updatePosition(220, 220);
    expect(pos.x).toBe(120);
    expect(pos.y).toBe(120);
  });

  it("updatePosition writes to activePosition", () => {
    const model = new MovableModel();
    beginDrag(model);
    model.updatePosition(250, 250);
    expect(model.activePosition).toEqual({ x: 150, y: 150 });
  });

  it("endMove clears activeItemID", () => {
    const model = new MovableModel();
    beginDrag(model);
    model.endMove();
    expect(model.activeItemID).toBeNull();
  });

  it("endMove when idle is safe (no-op)", () => {
    const model = new MovableModel();
    expect(() => model.endMove()).not.toThrow();
    expect(model.activeItemID).toBeNull();
  });
});

// ===========================================================================
// S3 — Position Resolution (covered by Geometry tests)
// ===========================================================================

// Geometry.resolve is tested in Geometry.test.ts

// ===========================================================================
// S4 — Boundary Clamping
// ===========================================================================

describe("S4 — Boundary Clamping", () => {
  it("clamps position to minX", () => {
    const model = withRoot(new MovableModel());
    model.beginMove("item-1", [], origin({ x: 50 }), lim({ minX: 50 }), dim());
    const pos = model.updatePosition(0, 200);
    expect(pos.x).toBe(50);
  });

  it("clamps position to maxX", () => {
    const model = withRoot(new MovableModel());
    model.beginMove(
      "item-1",
      [],
      origin({ x: 400 }),
      lim({ maxX: 400 }),
      dim()
    );
    const pos = model.updatePosition(9999, 200);
    expect(pos.x).toBe(400);
  });

  it("clamps position to minY", () => {
    const model = withRoot(new MovableModel());
    model.beginMove("item-1", [], origin({ y: 0 }), lim({ minY: 0 }), dim());
    const pos = model.updatePosition(200, -9999);
    expect(pos.y).toBe(0);
  });

  it("clamps position to maxY", () => {
    const model = withRoot(new MovableModel());
    model.beginMove(
      "item-1",
      [],
      origin({ y: 300 }),
      lim({ maxY: 300 }),
      dim()
    );
    const pos = model.updatePosition(200, 9999);
    expect(pos.y).toBe(300);
  });
});

// ===========================================================================
// S5 — Collision Detection
// ===========================================================================

describe("S5 — Collision Detection", () => {
  it("detects collision with overlapping sensor", () => {
    const model = new MovableModel();
    sensor(model, "sensor-1");
    model.detectCollisions({ x: 60, y: 60, width: 20, height: 20 });
    expect(model.activeSensorID).toBe("sensor-1");
  });

  it("no collision when rects do not overlap", () => {
    const model = new MovableModel();
    sensor(model, "sensor-1");
    model.detectCollisions({ x: 200, y: 200, width: 20, height: 20 });
    expect(model.activeSensorID).toBeNull();
  });

  it("clears activeSensorID when leaving sensor", () => {
    const model = new MovableModel();
    sensor(model, "sensor-1");
    model.detectCollisions({ x: 60, y: 60, width: 20, height: 20 });
    expect(model.activeSensorID).toBe("sensor-1");
    model.detectCollisions({ x: 300, y: 300, width: 20, height: 20 });
    expect(model.activeSensorID).toBeNull();
  });

  it("respects group filtering — matching group", () => {
    const model = withRoot(new MovableModel());
    sensor(model, "sensor-1", ["ghost"]);
    model.beginMove("item-1", ["ghost"], origin(), lim(), dim());
    model.detectCollisions({ x: 60, y: 60, width: 20, height: 20 });
    expect(model.activeSensorID).toBe("sensor-1");
  });

  it("respects group filtering — non-matching group", () => {
    const model = withRoot(new MovableModel());
    sensor(model, "sensor-1", ["ghost"]);
    model.beginMove("item-1", ["solid"], origin(), lim(), dim());
    model.detectCollisions({ x: 60, y: 60, width: 20, height: 20 });
    expect(model.activeSensorID).toBeNull();
  });

  it("empty accepts matches any group", () => {
    const model = withRoot(new MovableModel());
    sensor(model, "sensor-1");
    model.beginMove("item-1", ["anything"], origin(), lim(), dim());
    model.detectCollisions({ x: 60, y: 60, width: 20, height: 20 });
    expect(model.activeSensorID).toBe("sensor-1");
  });

  it("first match wins when multiple sensors overlap", () => {
    const model = new MovableModel();
    sensor(model, "sensor-1");
    sensor(model, "sensor-2");
    model.detectCollisions({ x: 70, y: 70, width: 20, height: 20 });
    expect(model.activeSensorID).toBe("sensor-1");
  });
});

// ===========================================================================
// S6 — Sensor Registration
// ===========================================================================

describe("S6 — Sensor Registration", () => {
  it("registerSensor increments sensorCount", () => {
    const model = new MovableModel();
    sensor(model, "s1");
    expect(model.sensorCount).toBe(1);
  });

  it("unregisterSensor decrements sensorCount", () => {
    const model = new MovableModel();
    sensor(model, "s1");
    model.unregisterSensor("s1");
    expect(model.sensorCount).toBe(0);
  });

  it("unregistering unknown sensor is safe", () => {
    const model = new MovableModel();
    expect(() => model.unregisterSensor("nonexistent")).not.toThrow();
  });

  it("isOverSensor reflects activeSensorID", () => {
    const model = new MovableModel();
    sensor(model, "s1");
    model.detectCollisions({ x: 60, y: 60, width: 20, height: 20 });
    expect(model.isOverSensor("s1")).toBe(true);
    expect(model.isOverSensor("s2")).toBe(false);
  });
});

// ===========================================================================
// S7 — Smart Anchor (position logic is in Controller, not Model)
// ===========================================================================

// Smart Anchor behavior is managed by the Coordinator/Controller (DOM layer).
// The Model only stores state; resize logic is tested via dev page QA.

// ===========================================================================
// S8 — Multi-Item Isolation
// ===========================================================================

describe("S8 — Multi-Item Isolation", () => {
  it("only one item can be active at a time", () => {
    const model = withRoot(new MovableModel());
    model.beginMove("item-1", [], origin(), lim(), dim());
    expect(model.activeItemID).toBe("item-1");
    model.beginMove("item-2", [], origin(), lim(), dim());
    expect(model.activeItemID).toBe("item-2");
  });

  it("endMove does not affect other items' potential", () => {
    const model = withRoot(new MovableModel());
    model.beginMove("item-1", [], origin(), lim(), dim());
    model.endMove();
    model.beginMove("item-2", [], origin(), lim(), dim());
    expect(model.activeItemID).toBe("item-2");
  });
});

// ===========================================================================
// S9 — Edge Cases
// ===========================================================================

describe("S9 — Edge Cases", () => {
  it("beginMove without root is no-op", () => {
    const model = new MovableModel();
    model.beginMove("item-1", [], origin(), lim(), dim());
    expect(model.activeItemID).toBeNull();
  });

  it("registerRoot toggles hasRoot", () => {
    const model = new MovableModel();
    expect(model.hasRoot).toBe(false);
    model.registerRoot(STUB_ROOT);
    expect(model.hasRoot).toBe(true);
    model.registerRoot(null);
    expect(model.hasRoot).toBe(false);
  });

  it("multiple registerRoot calls are safe", () => {
    const model = new MovableModel();
    model.registerRoot(STUB_ROOT);
    model.registerRoot(STUB_ROOT);
    expect(model.hasRoot).toBe(true);
  });

  it("updatePosition during drag returns clamped position", () => {
    const model = new MovableModel();
    beginDrag(model);
    const pos = model.updatePosition(200, 200);
    expect(pos.x).toBe(100);
    expect(pos.y).toBe(100);
  });

  it("collision detection with no sensors returns null", () => {
    const model = new MovableModel();
    model.detectCollisions({ x: 50, y: 50, width: 20, height: 20 });
    expect(model.activeSensorID).toBeNull();
  });
});
