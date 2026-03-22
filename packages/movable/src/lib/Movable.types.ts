import type { Snippet } from "svelte";
import type { Action } from "svelte/action";
import type { MovableModel } from "./MovableModel.svelte";

export interface MovableRect {
  height: number;
  width: number;
  x: number;
  y: number;
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

/** @deprecated Use MovableContextState */
export interface MovableRootState {
  model: MovableModel;
  root: Action<HTMLElement>;
}

/** @deprecated Use MovableContextProps */
export interface MovableRootProps {
  asChild: Snippet<[MovableRootState]>;
}

interface MovableItemConfiguration {
  class?: string;
  group?: MovableGroup;
  id?: string;
  initialPosition?: MovableItemPosition;
  tabindex?: number;
}

export interface MovableItemState {
  isFocused: boolean;
  isMoving: boolean;
  item: Action<HTMLElement>;
}

export interface MovableItemProps extends MovableItemConfiguration {
  asChild?: Snippet<[MovableItemState]>;
  children?: Snippet<[Omit<MovableItemState, "item">]>;
}

export interface MovableSensorState {
  isOver: boolean;
  sensor: Action<HTMLElement>;
}

interface MovableSensorConfiguration {
  accepts?: MovableGroup;
  class?: string;
  id?: string;
  onDrop?: () => void;
}

export interface MovableSensorProps extends MovableSensorConfiguration {
  asChild?: Snippet<[MovableSensorState]>;
  children?: Snippet<[Omit<MovableSensorState, "sensor">]>;
}
