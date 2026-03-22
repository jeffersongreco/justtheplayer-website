import type { Snippet } from "svelte";
import type { MovableModel } from "./MovableModel.svelte";

export interface MovableRect {
  height: number;
  width: number;
  x: number;
  y: number;
}

// ---------------------------------------------------------------------------
// MovableInteraction Protocol
// ---------------------------------------------------------------------------
// Defined by the consumer (Model). Interactions conform to this protocol
// to communicate in the language the Model expects.

export type MovePosition = { x: number; y: number };

export type MoveLimits = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

/** Element rect with viewport base coordinates at translate(0,0). */
export type ItemRect = {
  width: number;
  height: number;
  baseLeft: number;
  baseTop: number;
};

/**
 * The Model's interaction surface. Interactions are hardware translators
 * that transform raw user input into calls to this protocol.
 * The Model implements it; interactions receive it.
 */
export interface MovableInteraction {
  readonly activeItemID: string | null;
  activePosition: MovePosition;
  began(
    id: string,
    group: MovableGroup,
    position: MovePosition,
    limits: MoveLimits,
    rect: ItemRect
  ): void;
  changed(x: number, y: number): MovePosition;
  ended(): void;
  readonly rootEl: HTMLElement | null;
}

type PixelValue = number | `${number}px`;
type PercentageValue = `${number}%`;
export type PositionValue = PixelValue | PercentageValue;

export type MovableItemPosition = {
  x: PositionValue;
  y: PositionValue;
};

export type MovableContainerDimension = number;

export type MovableGroup = string[];

export interface MovableContextState {
  attach: (el: HTMLElement) => () => void;
  model: MovableModel;
}

export type MovableContextProps =
  | { asChild: Snippet<[MovableContextState]>; children?: never }
  | { asChild?: never; children?: Snippet<[{ model: MovableModel }]> };

interface MovableItemConfiguration {
  group?: MovableGroup;
  id?: string;
  initialPosition?: MovableItemPosition;
  stepSize?: number;
  tabindex?: number;
}

export interface MovableItemState {
  attach: (el: HTMLElement) => () => void;
  isFocused: boolean;
  isMoving: boolean;
}

export type MovableItemProps =
  | (MovableItemConfiguration & {
      asChild: Snippet<[MovableItemState]>;
      children?: never;
    })
  | (MovableItemConfiguration & {
      asChild?: never;
      children?: Snippet<[Omit<MovableItemState, "attach">]>;
    });

interface MovableSensorConfiguration {
  accepts?: MovableGroup;
  id?: string;
  onDrop?: () => void;
}

export interface MovableSensorState {
  attach: (el: HTMLElement) => () => void;
  isOver: boolean;
}

export type MovableSensorProps =
  | (MovableSensorConfiguration & {
      asChild: Snippet<[MovableSensorState]>;
      children?: never;
    })
  | (MovableSensorConfiguration & {
      asChild?: never;
      children?: Snippet<[Omit<MovableSensorState, "attach">]>;
    });
