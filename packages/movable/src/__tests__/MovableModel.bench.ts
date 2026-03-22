import { bench, describe } from "vitest";
import type {
  DragLimits,
  DragOrigin,
  ItemDimensions,
} from "../lib/MovableModel.svelte";
import { MovableModel } from "../lib/MovableModel.svelte";

const STUB_ROOT = {} as HTMLElement;

function origin(): DragOrigin {
  return { x: 100, y: 100, pointerX: 200, pointerY: 200 };
}

function limits(): DragLimits {
  return { minX: 0, maxX: 500, minY: 0, maxY: 400 };
}

function dims(): ItemDimensions {
  return { width: 50, height: 50, pointerOffsetX: -10, pointerOffsetY: -10 };
}

describe("Model throughput", () => {
  bench("beginMove → updatePosition → endMove", () => {
    const model = new MovableModel();
    model.registerRoot(STUB_ROOT);
    model.beginMove("item-1", [], origin(), limits(), dims());
    model.updatePosition(250, 250);
    model.endMove();
  });

  bench("updatePosition (100 moves)", () => {
    const model = new MovableModel();
    model.registerRoot(STUB_ROOT);
    model.beginMove("item-1", [], origin(), limits(), dims());
    for (let i = 0; i < 100; i++) {
      model.updatePosition(200 + i, 200 + i);
    }
    model.endMove();
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
