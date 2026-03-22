import type { AttentionInterruptBehavior } from "../../AttentionRequester.types";

/** Cardinal direction string for single-axis movement. */
export type CardinalDirection =
  | "up"
  | "down"
  | "left"
  | "right"
  | "forward"
  | "backward";

/** Explicit 3-axis direction vector. */
export interface ThreeAxisDirection {
  x: number;
  y: number;
  z: number;
}

/**
 * Direction for a bounce animation.
 *
 * Cardinal strings map to unit vectors (e.g. `"up"` → `{ x: 0, y: -1, z: 0 }`).
 * A partial `{ x?, y?, z? }` object allows diagonal or compound movement.
 */
export type BounceDirection = CardinalDirection | Partial<ThreeAxisDirection>;

interface BounceConfigBase {
  /**
   * Direction of the bounce movement.
   * @default "up"
   */
  direction?: BounceDirection;

  /**
   * Displacement in pixels.
   * @default 100
   */
  distance?: number;

  /**
   * Duration of one cycle in milliseconds.
   * @default 1000 (PhysicsBounce) / 2000 (DoubleBounce)
   */
  duration?: number;

  /**
   * Strategy applied when the animation is interrupted (paused).
   * @default "resume"
   */
  onInterrupt?: AttentionInterruptBehavior;
}

/**
 * Bounce configuration for a looping animation.
 *
 * The animation repeats indefinitely, with a rest pause between cycles,
 * until {@link import("../../AttentionRequester.types").AttentionRequester.cancel | cancel()} is called.
 */
export interface BounceConfigLoop extends BounceConfigBase {
  /** Must be `true` to create a looping bounce. */
  loop: true;

  /**
   * Rest interval between cycles in milliseconds.
   * @default 3000
   */
  restDuration?: number;
}

/**
 * Bounce configuration for a one-shot animation (plays once, then returns to idle).
 */
export interface BounceConfigOneShot extends BounceConfigBase {
  /** Must be `false` or omitted. */
  loop?: false;
}

/**
 * Configuration accepted by {@link import("../PhysicsBounceAnimation").PhysicsBounce | PhysicsBounce()}
 * and {@link import("../DoubleBounceAnimation").DoubleBounce | DoubleBounce()}.
 *
 * Discriminated union via `loop`: when `loop` is `true`, `restDuration` becomes available.
 */
export type BounceConfig = BounceConfigLoop | BounceConfigOneShot;

/** @internal Resolved positional parameters computed from a bounce config. */
export interface ResolvedBounceParams {
  cx: number;
  cy: number;
  cz: number;
  dx: number;
  dy: number;
  dz: number;
}

/** @internal Normalizes a {@link BounceDirection} to an explicit 3-axis vector. */
export function normalizeDirection(dir: BounceDirection): ThreeAxisDirection {
  if (typeof dir === "string") {
    const map: Record<CardinalDirection, ThreeAxisDirection> = {
      up: { x: 0, y: -1, z: 0 },
      down: { x: 0, y: 1, z: 0 },
      left: { x: -1, y: 0, z: 0 },
      right: { x: 1, y: 0, z: 0 },
      forward: { x: 0, y: 0, z: 1 },
      backward: { x: 0, y: 0, z: -1 },
    };
    return map[dir] ?? { x: 0, y: -1, z: 0 };
  }
  return { x: dir.x ?? 0, y: dir.y ?? 0, z: dir.z ?? 0 };
}

/** @internal Builds a CSS `translate` value from 3-axis pixel values. */
export function makeTranslate(x: number, y: number, z: number): string {
  return `${x}px ${y}px ${z}px`;
}

/** @internal Reads the current computed `translate` of an element as 3-axis pixel values. */
export function readCurrentTranslate(el: HTMLElement): {
  cx: number;
  cy: number;
  cz: number;
} {
  const raw = getComputedStyle(el).translate;
  const parts =
    raw === "none" ? [0, 0, 0] : raw.split(" ").map(Number.parseFloat);
  return {
    cx: parts[0] || 0,
    cy: parts[1] || 0,
    cz: parts[2] || 0,
  };
}
