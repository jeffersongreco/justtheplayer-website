import MovableItem from "./MovableItem.svelte";
import { getMovableContext } from "./MovableModel.svelte";
import MovableRoot from "./MovableRoot.svelte";
import MovableSensor from "./MovableSensor.svelte";

export const Movable = {
  Root: MovableRoot,
  Item: MovableItem,
  Sensor: MovableSensor,
  get: getMovableContext,
};

export * from "./Movable.types";
