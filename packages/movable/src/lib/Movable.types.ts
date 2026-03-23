import type { Snippet } from "svelte";

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
// Context Query (consumer facade)
// ---------------------------------------------------------------------------

/**
 * Read-only query object for the Movable context.
 * Exposed via `Movable.get()` and the Context snippet parameters.
 * Consumers use this to observe drag state from anywhere in the subtree.
 */
export interface MovableContextQuery {
  /** ID of the item currently being dragged, or null if no drag is active. */
  readonly activeItemID: string | null;
  /** Checks whether the currently dragged item is over the sensor with the given ID. */
  isOverSensor(id: string): boolean;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

/** State exposed by `Movable.Context` in `asChild` mode. */
export interface MovableContextState {
  attach: (el: HTMLElement) => () => void;
  context: MovableContextQuery;
}

/** Props for `Movable.Context`. */
export type MovableContextProps =
  | { asChild: Snippet<[MovableContextState]>; children?: never }
  | { asChild?: never; children?: Snippet<[{ context: MovableContextQuery }]> };

// ---------------------------------------------------------------------------
// Item
// ---------------------------------------------------------------------------

interface MovableItemConfiguration {
  group?: MovableGroup;
  id?: string;
  initialPosition?: MovableItemPosition;
  stepSize?: number;
  tabindex?: number;
}

/** State exposed by `Movable.Item` in snippet parameters. */
export interface MovableItemState {
  attach: (el: HTMLElement) => () => void;
  isFocused: boolean;
  isMoving: boolean;
}

/** Props for `Movable.Item`. */
export type MovableItemProps =
  | (MovableItemConfiguration & {
      asChild: Snippet<[MovableItemState]>;
      children?: never;
    })
  | (MovableItemConfiguration & {
      asChild?: never;
      children?: Snippet<[Omit<MovableItemState, "attach">]>;
    });

// ---------------------------------------------------------------------------
// Sensor
// ---------------------------------------------------------------------------

interface MovableSensorConfiguration {
  accepts?: MovableGroup;
  id?: string;
  onDrop?: () => void;
}

/** State exposed by `Movable.Sensor` in snippet parameters. */
export interface MovableSensorState {
  attach: (el: HTMLElement) => () => void;
  isOver: boolean;
}

/** Props for `Movable.Sensor`. */
export type MovableSensorProps =
  | (MovableSensorConfiguration & {
      asChild: Snippet<[MovableSensorState]>;
      children?: never;
    })
  | (MovableSensorConfiguration & {
      asChild?: never;
      children?: Snippet<[Omit<MovableSensorState, "attach">]>;
    });
