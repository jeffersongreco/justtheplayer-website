import { describe, expect, it } from "vitest";
import type {
  ItemRect,
  MoveLimits,
  MovePosition,
} from "../lib/Movable.internal-types";
import { MovableModel } from "../lib/MovableModel.svelte";

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

const SENSOR_RECT = { x: 50, y: 50, width: 100, height: 100 };
const STUB_ROOT = {} as HTMLElement;

function pos(overrides?: Partial<MovePosition>): MovePosition {
  return { x: 100, y: 100, ...overrides };
}

function lim(overrides?: Partial<MoveLimits>): MoveLimits {
  return { minX: 0, maxX: 500, minY: 0, maxY: 400, ...overrides };
}

function rect(overrides?: Partial<ItemRect>): ItemRect {
  return {
    width: 50,
    height: 50,
    baseLeft: 10,
    baseTop: 10,
    ...overrides,
  };
}

function withRoot(model: MovableModel) {
  model.registerRoot(STUB_ROOT);
  return model;
}

function beginDrag(model: MovableModel, id = "item-1", group: string[] = []) {
  withRoot(model);
  model.began(id, group, pos(), lim(), rect());
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
  it("began sets activeItemID", () => {
    const model = new MovableModel();
    beginDrag(model, "my-item");
    expect(model.activeItemID).toBe("my-item");
  });

  it("began sets activeItemGroup", () => {
    const model = withRoot(new MovableModel());
    model.began("item-1", ["ghost"], pos(), lim(), rect());
    expect(model.activeItemGroup).toEqual(["ghost"]);
  });

  it("began initializes activePosition to position", () => {
    const model = withRoot(new MovableModel());
    model.began("item-1", [], pos({ x: 42, y: 99 }), lim(), rect());
    expect(model.activePosition).toEqual({ x: 42, y: 99 });
  });

  it("began clears stale activeSensorID when item does not overlap any sensor", () => {
    const model = withRoot(new MovableModel());
    // Register a sensor far from the item's initial position
    model.registerSensor(
      "sensor-far",
      { x: 900, y: 900, width: 50, height: 50 },
      []
    );
    // Force a stale activeSensorID via a previous drag + collision
    model.began(
      "item-0",
      [],
      pos({ x: 0, y: 0 }),
      lim(),
      rect({ baseLeft: 900, baseTop: 900 })
    );
    expect(model.activeSensorID).toBe("sensor-far");
    model.ended();
    // New drag starts at a position that does NOT overlap the sensor
    model.began("item-1", [], pos(), lim(), rect());
    expect(model.activeSensorID).toBeNull();
  });

  it("began detects sensor when item starts on top of one", () => {
    const model = withRoot(new MovableModel());
    sensor(model, "sensor-1");
    model.began("item-1", [], pos(), lim(), rect());
    expect(model.activeSensorID).toBe("sensor-1");
  });

  it("began is no-op without root", () => {
    const model = new MovableModel();
    model.began("item-1", [], pos(), lim(), rect());
    expect(model.activeItemID).toBeNull();
  });

  it("changed returns clamped coordinates", () => {
    const model = new MovableModel();
    beginDrag(model);
    const result = model.changed(120, 120);
    expect(result).toEqual({ x: 120, y: 120 });
  });

  it("changed clamps to limits", () => {
    const model = new MovableModel();
    beginDrag(model);
    const result = model.changed(9999, -9999);
    expect(result).toEqual({ x: 500, y: 0 });
  });

  it("changed writes to activePosition", () => {
    const model = new MovableModel();
    beginDrag(model);
    model.changed(150, 150);
    expect(model.activePosition).toEqual({ x: 150, y: 150 });
  });

  it("ended clears activeItemID", () => {
    const model = new MovableModel();
    beginDrag(model);
    model.ended();
    expect(model.activeItemID).toBeNull();
  });

  it("ended when idle is safe (no-op)", () => {
    const model = new MovableModel();
    expect(() => model.ended()).not.toThrow();
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
    model.began("item-1", [], pos(), lim({ minX: 50 }), rect());
    const result = model.changed(-10, 100);
    expect(result.x).toBe(50);
  });

  it("clamps position to maxX", () => {
    const model = withRoot(new MovableModel());
    model.began("item-1", [], pos(), lim({ maxX: 400 }), rect());
    const result = model.changed(9999, 100);
    expect(result.x).toBe(400);
  });

  it("clamps position to minY", () => {
    const model = withRoot(new MovableModel());
    model.began("item-1", [], pos(), lim({ minY: 20 }), rect());
    const result = model.changed(100, -9999);
    expect(result.y).toBe(20);
  });

  it("clamps position to maxY", () => {
    const model = withRoot(new MovableModel());
    model.began("item-1", [], pos(), lim({ maxY: 300 }), rect());
    const result = model.changed(100, 9999);
    expect(result.y).toBe(300);
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
    model.began("item-1", ["ghost"], pos(), lim(), rect());
    model.detectCollisions({ x: 60, y: 60, width: 20, height: 20 });
    expect(model.activeSensorID).toBe("sensor-1");
  });

  it("respects group filtering — non-matching group", () => {
    const model = withRoot(new MovableModel());
    sensor(model, "sensor-1", ["ghost"]);
    model.began("item-1", ["solid"], pos(), lim(), rect());
    model.detectCollisions({ x: 60, y: 60, width: 20, height: 20 });
    expect(model.activeSensorID).toBeNull();
  });

  it("empty accepts matches any group", () => {
    const model = withRoot(new MovableModel());
    sensor(model, "sensor-1");
    model.began("item-1", ["anything"], pos(), lim(), rect());
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

  it("changed triggers collision detection via itemRect", () => {
    const model = withRoot(new MovableModel());
    // Sensor at x:50, y:50, width:100, height:100
    sensor(model, "sensor-1");
    // Item with baseLeft:10, baseTop:10, width:50, height:50
    // When changed(50, 50): collision rect = { x: 10+50=60, y: 10+50=60, w:50, h:50 }
    // This overlaps the sensor at {50,50,100,100}
    model.began(
      "item-1",
      [],
      pos(),
      lim(),
      rect({ baseLeft: 10, baseTop: 10 })
    );
    model.changed(50, 50);
    expect(model.activeSensorID).toBe("sensor-1");
  });

  it("changed clears collision when moving away from sensor", () => {
    const model = withRoot(new MovableModel());
    sensor(model, "sensor-1");
    model.began(
      "item-1",
      [],
      pos(),
      lim(),
      rect({ baseLeft: 10, baseTop: 10 })
    );
    model.changed(50, 50);
    expect(model.activeSensorID).toBe("sensor-1");
    // Move far away: collision rect = { x: 10+400=410, y: 10+400=410, w:50, h:50 }
    model.changed(400, 400);
    expect(model.activeSensorID).toBeNull();
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
    model.began("item-1", [], pos(), lim(), rect());
    expect(model.activeItemID).toBe("item-1");
    model.began("item-2", [], pos(), lim(), rect());
    expect(model.activeItemID).toBe("item-2");
  });

  it("ended does not affect other items' potential", () => {
    const model = withRoot(new MovableModel());
    model.began("item-1", [], pos(), lim(), rect());
    model.ended();
    model.began("item-2", [], pos(), lim(), rect());
    expect(model.activeItemID).toBe("item-2");
  });
});

// ===========================================================================
// S9 — Edge Cases
// ===========================================================================

describe("S9 — Edge Cases", () => {
  it("began without root is no-op", () => {
    const model = new MovableModel();
    model.began("item-1", [], pos(), lim(), rect());
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

  it("changed during drag returns clamped position", () => {
    const model = new MovableModel();
    beginDrag(model);
    const result = model.changed(100, 100);
    expect(result).toEqual({ x: 100, y: 100 });
  });

  it("collision detection with no sensors returns null", () => {
    const model = new MovableModel();
    model.detectCollisions({ x: 50, y: 50, width: 20, height: 20 });
    expect(model.activeSensorID).toBeNull();
  });
});
