import { createContext } from "svelte";
import { MODEL } from "./Movable.internal-types";
import type { MovableContext as MovableContextHandle } from "./Movable.types";
import { MovableContextCoordinator } from "./MovableContextCoordinator.svelte";
import { MovableModel } from "./MovableModel.svelte";

// No default ARIA strings are provided. The modifier intentionally avoids
// hardcoded text because it has no i18n mechanism. Consumers must supply
// localized strings for accessibility.
export interface MovableContextOptions {
  instructionsText?: string;
}

// Module-level context pair — shared with MovableItem and MovableSensor
export const [getModel, setModel] = createContext<MovableModel>();

export function MovableContext(
  options?: MovableContextOptions
): MovableContextHandle {
  const model = new MovableModel();
  setModel(model);

  function modifier(el: HTMLElement) {
    const coordinator = new MovableContextCoordinator(
      el,
      model,
      options?.instructionsText
    );
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
