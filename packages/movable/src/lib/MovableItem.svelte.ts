import { MODEL } from "./Movable.internal-types";
import type {
  MovableContext,
  MovableGroup,
  MovableItem as MovableItemHandle,
  MovableItemPosition,
} from "./Movable.types";
import { getModel } from "./MovableContext.svelte";
import { MovableItemCoordinator } from "./MovableItemCoordinator.svelte";
import type { MovableModel } from "./MovableModel.svelte";

export interface MovableItemOptions {
  group?: MovableGroup;
  id?: string;
  initialPosition?: MovableItemPosition;
  stepSize?: number;
  tabindex?: number;
}

function isContextHandle(v: unknown): v is MovableContext {
  return v != null && typeof v === "object" && MODEL in v;
}

export function MovableItem(
  contextOrOptions?: MovableContext | MovableItemOptions,
  maybeOptions?: MovableItemOptions
): MovableItemHandle {
  let model: MovableModel;
  let options: MovableItemOptions;

  if (isContextHandle(contextOrOptions)) {
    model = contextOrOptions[MODEL];
    options = maybeOptions ?? {};
  } else {
    model = getModel();
    options = (contextOrOptions as MovableItemOptions) ?? {};
  }

  const {
    id = crypto.randomUUID(),
    initialPosition = { x: "50%", y: "50%" },
    group = [],
    stepSize,
    tabindex = 0,
  } = options;

  const isMoving = $derived(model.activeItemID === id);
  let isFocused = $state(false);

  function attach(el: HTMLElement) {
    const coordinator = new MovableItemCoordinator(
      el,
      model,
      id,
      initialPosition,
      group,
      stepSize,
      tabindex,
      (focused: boolean) => {
        isFocused = focused;
      }
    );
    return () => coordinator.destroy();
  }

  return {
    attach,
    get isMoving() {
      return isMoving;
    },
    get isFocused() {
      return isFocused;
    },
  };
}
