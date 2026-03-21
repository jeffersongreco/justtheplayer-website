import type {
  ARAnimationLoop,
  ARAnimationOneShot,
} from "../AttentionRequester.types";
import {
  type BounceConfigLoop,
  type BounceConfigOneShot,
  makeTranslate,
  normalizeDirection,
  readCurrentTranslate,
} from "./helpers/bounce-helpers";

export type {
  BounceConfig as PhysicsBounceConfig,
  BounceDirection,
  CardinalDirection,
  ThreeAxisDirection,
} from "./helpers/bounce-helpers";

export function PhysicsBounce(config: BounceConfigLoop): ARAnimationLoop;
export function PhysicsBounce(config?: BounceConfigOneShot): ARAnimationOneShot;
export function PhysicsBounce(
  config: BounceConfigLoop | BounceConfigOneShot = {}
): ARAnimationLoop | ARAnimationOneShot {
  const distance = config.distance ?? 100;
  const direction = config.direction ?? "up";
  const duration = config.duration ?? 1000;

  const { x, y, z } = normalizeDirection(direction);
  const dx = x * distance;
  const dy = y * distance;
  const dz = z * distance;

  const keyframes = (el: HTMLElement): Keyframe[] => {
    const { cx, cy, cz } = readCurrentTranslate(el);
    return [
      {
        translate: makeTranslate(cx, cy, cz),
        easing: "ease-in-out",
        offset: 0,
      },
      {
        translate: makeTranslate(
          cx + dx * -0.05,
          cy + dy * -0.05,
          cz + dz * -0.05
        ),
        easing: "cubic-bezier(0.1, 0.9, 0.2, 1)",
        offset: 0.15,
      },
      {
        translate: makeTranslate(cx + dx, cy + dy, cz + dz),
        easing: "linear",
        offset: 0.45,
      },
      {
        translate: makeTranslate(cx + dx, cy + dy, cz + dz),
        easing: "cubic-bezier(0.55, 0.085, 0.68, 0.53)",
        offset: 0.5,
      },
      {
        translate: makeTranslate(cx, cy, cz),
        easing: "ease-out",
        offset: 0.75,
      },
      {
        translate: makeTranslate(
          cx + dx * 0.01,
          cy + dy * 0.01,
          cz + dz * 0.01
        ),
        easing: "linear",
        offset: 0.82,
      },
      {
        translate: makeTranslate(cx, cy, cz),
        easing: "ease-in-out",
        offset: 1,
      },
    ];
  };

  const name = `physics-bounce-${direction}-${distance}`;

  if (config.loop) {
    return {
      name,
      duration,
      loop: true,
      interval: config.restDuration ?? 3000,
      onInterrupt: config.onInterrupt,
      keyframes,
    } satisfies ARAnimationLoop;
  }

  return {
    name,
    duration,
    onInterrupt: config.onInterrupt,
    keyframes,
  } satisfies ARAnimationOneShot;
}
