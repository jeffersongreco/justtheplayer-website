import { bench, describe } from "vitest";
import type {
  ItemRect,
  MoveLimits,
  MovePosition,
} from "../lib/Movable.internal-types";
import { MovableModel } from "../lib/MovableModel.svelte";

const STUB_ROOT = {} as HTMLElement;

function pos(): MovePosition {
  return { x: 100, y: 100 };
}

function limits(): MoveLimits {
  return { minX: 0, maxX: 500, minY: 0, maxY: 400 };
}

function itemRect(): ItemRect {
  return { width: 50, height: 50, baseLeft: 10, baseTop: 10 };
}

describe("Model throughput", () => {
  bench("began → changed → ended", () => {
    const model = new MovableModel();
    model.registerRoot(STUB_ROOT);
    model.began("item-1", [], pos(), limits(), itemRect());
    model.changed(150, 150);
    model.ended();
  });

  bench("changed (100 moves)", () => {
    const model = new MovableModel();
    model.registerRoot(STUB_ROOT);
    model.began("item-1", [], pos(), limits(), itemRect());
    for (let i = 0; i < 100; i++) {
      model.changed(100 + i, 100 + i);
    }
    model.ended();
  });

  bench("detectCollisions (10 sensors)", () => {
    const model = new MovableModel();
    for (let i = 0; i < 10; i++) {
      model.registerSensor(
        `s-${i}`,
        { x: i * 60, y: 0, width: 50, height: 50 },
        []
      );
    }
    model.detectCollisions({ x: 300, y: 10, width: 20, height: 20 });
  });

  bench("registerSensor + unregisterSensor round-trip", () => {
    const model = new MovableModel();
    model.registerSensor("s", { x: 0, y: 0, width: 50, height: 50 }, []);
    model.unregisterSensor("s");
  });
});
