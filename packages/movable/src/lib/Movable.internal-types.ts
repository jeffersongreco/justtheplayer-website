// ---------------------------------------------------------------------------
// Internal types — not part of the public API.
// These are used by Model, Coordinators, Interactions, and Geometry.
// Consumers should never import from this file.
// ---------------------------------------------------------------------------

import type { MovableGroup } from "./Movable.types";

/** @internal Symbol for extracting MovableModel from a public MovableContext handle. */
export const MODEL: unique symbol = Symbol("MovableModel");
export type MODEL = typeof MODEL;

export interface MovableRect {
  height: number;
  width: number;
  x: number;
  y: number;
}

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

export type MovableContainerDimension = number;
