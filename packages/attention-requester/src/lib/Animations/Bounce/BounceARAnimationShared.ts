import type {
  ARAnimationLoop,
  ARAnimationOneShot,
  AttentionInterruptBehavior,
} from "../../types";
import { createARAnimation } from "../createARAnimation";

export type CardinalDirection =
  | "up"
  | "down"
  | "left"
  | "right"
  | "forward"
  | "backward";

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export type BounceDirection = CardinalDirection | Partial<Vector3D>;

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

export function normalizeDirection(dir: BounceDirection): Vector3D {
  if (typeof dir === "string") {
    const map: Record<CardinalDirection, Vector3D> = {
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

type KeyframeBuilder = (params: ResolvedBounceParams) => Keyframe[];

interface BounceAnimationOptions {
  namePrefix: string;
  defaultDuration?: number;
  keyframeBuilder: KeyframeBuilder;
}

export function defineBounceAnimation(options: BounceAnimationOptions) {
  function factory(config: BounceConfigLoop): ARAnimationLoop;
  function factory(config?: BounceConfigOneShot): ARAnimationOneShot;
  function factory(config: BounceConfig = {}) {
    const distance = config.distance ?? 100;
    const direction = config.direction ?? "up";
    const duration = config.duration ?? options.defaultDuration ?? 1000;

    const { x, y, z } = normalizeDirection(direction);
    const dx = x * distance;
    const dy = y * distance;
    const dz = z * distance;

    const keyframes = (el: HTMLElement): Keyframe[] => {
      const computed = getComputedStyle(el);
      const raw = computed.translate;
      const parts =
        raw === "none" ? [0, 0, 0] : raw.split(" ").map(Number.parseFloat);
      const cx = parts[0] ?? 0;
      const cy = parts[1] ?? 0;
      const cz = parts[2] ?? 0;

      return options.keyframeBuilder({ cx, cy, cz, dx, dy, dz });
    };

    const name = `${options.namePrefix}-${direction}-${distance}`;

    if (config.loop) {
      return createARAnimation({
        name,
        duration,
        loop: true,
        interval: config.restDuration ?? 3000,
        onInterrupt: config.onInterrupt,
        keyframes,
      });
    }

    return createARAnimation({
      name,
      duration,
      onInterrupt: config.onInterrupt,
      keyframes,
    });
  }

  return factory;
}
