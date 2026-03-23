import type { MovableContextQuery } from "./Movable.types";
import MovableContext from "./MovableContext.svelte";
import MovableItem from "./MovableItem.svelte";
import { getMovableContext } from "./MovableModel.svelte";
import MovableSensor from "./MovableSensor.svelte";

function getMovableQuery(): MovableContextQuery {
  const model = getMovableContext();
  return {
    isOverSensor: (id: string) => model.isOverSensor(id),
    get activeItemID() {
      return model.activeItemID;
    },
  };
}

export const Movable = {
  Context: MovableContext,
  Item: MovableItem,
  Sensor: MovableSensor,
  get: getMovableQuery,
};

export * from "./Movable.types";
