import MovableItem from "./MovableItem.svelte";
import MovableRoot from "./MovableRoot.svelte";
import MovableSensor from "./MovableSensor.svelte";

export * from "./types";

export const Movable = {
  Root: MovableRoot,
  Item: MovableItem,
  Sensor: MovableSensor,
};
