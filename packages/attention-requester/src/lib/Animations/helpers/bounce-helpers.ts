import type { AttentionInterruptBehavior } from "../../AttentionRequester.types";

export type CardinalDirection =
  | "up"
  | "down"
  | "left"
  | "right"
  | "forward"
  | "backward";

export interface ThreeAxisDirection {
  x: number;
  y: number;
  z: number;
}

export type BounceDirection = CardinalDirection | Partial<ThreeAxisDirection>;

interface BounceConfigBase {
  direction?: BounceDirection;
  distance?: number;
  duration?: number;
  onInterrupt?: AttentionInterruptBehavior;
}

export interface BounceConfigLoop extends BounceConfigBase {
  loop: true;
  restDuration?: number;
}

export interface BounceConfigOneShot extends BounceConfigBase {
  loop?: false;
}

export type BounceConfig = BounceConfigLoop | BounceConfigOneShot;

export interface ResolvedBounceParams {
  cx: number;
  cy: number;
  cz: number;
  dx: number;
  dy: number;
  dz: number;
}

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

export function makeTranslate(x: number, y: number, z: number): string {
  return `${x}px ${y}px ${z}px`;
}

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
