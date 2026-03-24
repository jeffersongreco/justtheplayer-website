import type { MODEL } from "./Movable.internal-types";

// ---------------------------------------------------------------------------
// Position & Group
// ---------------------------------------------------------------------------

type PixelValue = number | `${number}px`;
type PercentageValue = `${number}%`;

/** A position value expressed as pixels (number or string) or percentage. */
export type PositionValue = PixelValue | PercentageValue;

/** Initial position of a draggable item within the bounded area. */
export type MovableItemPosition = {
  x: PositionValue;
  y: PositionValue;
};

/** Group tags used for filtering which sensors accept which items. */
export type MovableGroup = string[];

// ---------------------------------------------------------------------------
// Handle interfaces (returned by factory functions)
// ---------------------------------------------------------------------------

/** Handle returned by the `MovableContext()` factory. */
export interface MovableContext {
  /** ID of the item currently being dragged, or null. */
  readonly activeItemID: string | null;
  /** Checks whether the currently dragged item is over the sensor with the given ID. */
  isOverSensor(id: string): boolean;
  /** Svelte attachment — apply to the root element. Must have position: relative|absolute|fixed. */
  readonly modifier: (el: HTMLElement) => () => void;
  /** @internal — access to the Model for child factories */
  readonly [MODEL]: import("./MovableModel.svelte").MovableModel;
}

/** Handle returned by the `MovableItem()` factory. */
export interface MovableItem {
  /** true when the element has :focus-visible. */
  readonly isFocused: boolean;
  /** true while this item is being dragged. */
  readonly isMoving: boolean;
  /** Svelte attachment — apply to the draggable element. */
  readonly modifier: (el: HTMLElement) => () => void;
}

/** Handle returned by the `MovableSensor()` factory. */
export interface MovableSensor {
  /** true while the active item is over this sensor. */
  readonly isOver: boolean;
  /** Svelte attachment — apply to the drop zone element. */
  readonly modifier: (el: HTMLElement) => () => void;
}
