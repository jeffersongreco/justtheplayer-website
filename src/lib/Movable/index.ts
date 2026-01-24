import MovableItem from "./MovableItem.svelte";
import { MovableModel } from "./MovableModel.svelte";
import MovableRoot from "./MovableRoot.svelte";
import MovableSensor from "./MovableSensor.svelte";

function getModel() {
  return MovableModel.get();
}

export const Movable = {
  Root: MovableRoot,
  Item: MovableItem,
  Sensor: MovableSensor,
  get: getModel,
};

export * from "./types";
