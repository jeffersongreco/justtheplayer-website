import MovableContext from "./MovableContext.svelte";
import MovableItem from "./MovableItem.svelte";
import { getMovableContext } from "./MovableModel.svelte";
import MovableRoot from "./MovableRoot.svelte";
import MovableSensor from "./MovableSensor.svelte";

export const Movable = {
  Context: MovableContext,
  /** @deprecated Use Movable.Context */
  Root: MovableRoot,
  Item: MovableItem,
  Sensor: MovableSensor,
  get: getMovableContext,
};

export * from "./Movable.types";
