import type {
  ARAnimationLoop,
  ARAnimationOneShot,
  AttentionInterruptBehavior,
  AttentionRequesterAnimation,
} from "../../types";

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

interface PhysicsBounceConfigBase {
  direction?: BounceDirection; // padrão: 'up'
  distance?: number; // padrão: 100 (px)
  duration?: number; // padrão: 1000 (ms)
  onInterrupt?: AttentionInterruptBehavior;
}

interface PhysicsBounceConfigLoop extends PhysicsBounceConfigBase {
  loop: true;
  restDuration?: number; // padrão: 3000 (ms)
}

interface PhysicsBounceConfigOneShot extends PhysicsBounceConfigBase {
  loop?: false;
}

export type PhysicsBounceConfig =
  | PhysicsBounceConfigLoop
  | PhysicsBounceConfigOneShot;

function normalizeDirection(dir: BounceDirection): Vector3D {
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

function makeTranslate(x: number, y: number, z: number): string {
  return `${x}px ${y}px ${z}px`;
}

export function PhysicsBounce(config: PhysicsBounceConfigLoop): ARAnimationLoop;
export function PhysicsBounce(
  config?: PhysicsBounceConfigOneShot
): ARAnimationOneShot;
export function PhysicsBounce(
  config: PhysicsBounceConfig = {}
): AttentionRequesterAnimation {
  const distance = config.distance ?? 100;
  const direction = config.direction ?? "up";
  const duration = config.duration ?? 1000;

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

  if (config.loop) {
    return {
      name: `physics-bounce-${direction}-${distance}`,
      duration,
      loop: true,
      interval: config.restDuration ?? 3000,
      onInterrupt: config.onInterrupt ?? "resume",
      keyframes,
    } satisfies ARAnimationLoop;
  }

  return {
    name: `physics-bounce-${direction}-${distance}`,
    duration,
    onInterrupt: config.onInterrupt ?? "resume",
    keyframes,
  } satisfies ARAnimationOneShot;
}
