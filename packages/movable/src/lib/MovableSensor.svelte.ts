import { MODEL } from "./Movable.internal-types";
import type {
  MovableContext,
  MovableGroup,
  MovableSensor as MovableSensorHandle,
} from "./Movable.types";
import { getModel } from "./MovableContext.svelte";
import type { MovableModel } from "./MovableModel.svelte";

export interface MovableSensorOptions {
  accepts?: MovableGroup;
  id?: string;
  onDrop?: () => void;
}

function isContextHandle(v: unknown): v is MovableContext {
  return v != null && typeof v === "object" && MODEL in v;
}

export function MovableSensor(
  contextOrOptions?: MovableContext | MovableSensorOptions,
  maybeOptions?: MovableSensorOptions
): MovableSensorHandle {
  let model: MovableModel;
  let options: MovableSensorOptions;

  if (isContextHandle(contextOrOptions)) {
    model = contextOrOptions[MODEL];
    options = maybeOptions ?? {};
  } else {
    model = getModel();
    options = (contextOrOptions as MovableSensorOptions) ?? {};
  }

  const { id = crypto.randomUUID(), accepts = [], onDrop } = options;

  const isOver = $derived(model.activeSensorID === id);

  $effect(() => {
    if (!model.activeItemID && isOver) {
      onDrop?.();
    }
  });

  function attach(el: HTMLElement) {
    model.registerSensor(id, el.getBoundingClientRect(), accepts);
    return () => model.unregisterSensor(id);
  }

  return {
    attach,
    get isOver() {
      return isOver;
    },
  };
}
