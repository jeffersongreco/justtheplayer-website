import { createContext } from "svelte";
import { MODEL } from "./Movable.internal-types";
import type { MovableContext as MovableContextHandle } from "./Movable.types";
import { MovableContextCoordinator } from "./MovableContextCoordinator.svelte";
import { MovableModel } from "./MovableModel.svelte";

// Module-level context pair — shared with MovableItem and MovableSensor
export const [getModel, setModel] = createContext<MovableModel>();

export function MovableContext(): MovableContextHandle {
  const model = new MovableModel();
  setModel(model);

  function modifier(el: HTMLElement) {
    const coordinator = new MovableContextCoordinator(el, model);
    return () => coordinator.destroy();
  }

  return {
    modifier,
    [MODEL]: model,
    isOverSensor: (id: string) => model.isOverSensor(id),
    get activeItemID() {
      return model.activeItemID;
    },
  };
}
