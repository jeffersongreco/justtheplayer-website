import MovableContext from "./MovableContext.svelte";
import MovableItem from "./MovableItem.svelte";
import { getMovableContext } from "./MovableModel.svelte";
import MovableSensor from "./MovableSensor.svelte";

export const Movable = {
  Context: MovableContext,
  Item: MovableItem,
  Sensor: MovableSensor,
  get: getMovableContext,
};

export * from "./Movable.types";
