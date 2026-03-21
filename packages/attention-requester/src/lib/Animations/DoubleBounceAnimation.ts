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
} from "./Bounce/BounceARAnimationShared";

export function DoubleBounce(config: BounceConfigLoop): ARAnimationLoop;
export function DoubleBounce(config?: BounceConfigOneShot): ARAnimationOneShot;
export function DoubleBounce(
  config: BounceConfigLoop | BounceConfigOneShot = {}
): ARAnimationLoop | ARAnimationOneShot {
  const distance = config.distance ?? 100;
  const direction = config.direction ?? "up";
  const duration = config.duration ?? 2000;

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
        translate: makeTranslate(cx + dx, cy + dy, cz + dz),
        easing: "cubic-bezier(0.33, 1, 0.68, 1)",
        offset: 0.2,
      },
      {
        translate: makeTranslate(cx, cy, cz),
        easing: "cubic-bezier(0.32, 0, 0.67, 0)",
        offset: 0.4,
      },
      {
        translate: makeTranslate(
          cx + dx * 0.66,
          cy + dy * 0.66,
          cz + dz * 0.66
        ),
        easing: "cubic-bezier(0.33, 1, 0.68, 1)",
        offset: 0.6,
      },
      {
        translate: makeTranslate(cx, cy, cz),
        easing: "cubic-bezier(0.32, 0, 0.67, 0)",
        offset: 0.8,
      },
      {
        translate: makeTranslate(cx, cy, cz),
        easing: "ease-out",
        offset: 1,
      },
    ];
  };

  const name = `double-bounce-${direction}-${distance}`;

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
