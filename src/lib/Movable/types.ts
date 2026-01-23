import type { Snippet } from "svelte";
import type { Action } from "svelte/action";

export interface MovableRect {
  x: number;
  y: number;
  width: number;
  height: number;
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

export interface MovableRootProps {
  asChild: Snippet<[object]>;
}

interface MovableItemConfiguration {
  id?: string;
  initialPosition?: MovableItemPosition;
  group?: MovableGroup;
  tabindex?: number;
  class?: string;
}

export interface MovableItemState {
  item: Action<HTMLElement>;
  isMoving: boolean;
  isFocused: boolean;
}

export interface MovableItemProps extends MovableItemConfiguration {
  children?: Snippet<[Omit<MovableItemState, "item">]>;
  asChild?: Snippet<[MovableItemState]>;
}

export interface MovableSensorState {
  isOver: boolean;
  sensor: Action<HTMLElement>;
}

interface MovableSensorConfiguration {
  id?: string;
  accepts?: MovableGroup;
  onDrop?: () => void;
  class?: string;
}

export interface MovableSensorProps extends MovableSensorConfiguration {
  children?: Snippet<[Omit<MovableSensorState, "sensor">]>;
  asChild?: Snippet<[MovableSensorState]>;
}
