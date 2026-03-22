import type { Snippet } from "svelte";
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

interface MovableItemConfiguration {
  group?: MovableGroup;
  id?: string;
  initialPosition?: MovableItemPosition;
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
