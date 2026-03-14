import type {
  MovableContainerDimension,
  MovableRect,
  PositionValue,
} from "./types";

export const Geometry = {
  clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(value, max));
  },

  intersects(rectA: MovableRect, rectB: MovableRect): boolean {
    return (
      rectA.x < rectB.x + rectB.width &&
      rectA.x + rectA.width > rectB.x &&
      rectA.y < rectB.y + rectB.height &&
      rectA.y + rectA.height > rectB.y
    );
  },

  resolve(value: PositionValue, relativeTo: MovableContainerDimension): number {
    if (typeof value === "number") {
      if (!Number.isFinite(value)) {
        console.warn(`Invalid <Movable.Item> initial position: ${value}`);
        return 0;
      }
      return value;
    }

    if (typeof value === "string") {
      const float = Number.parseFloat(value);

      if (!Number.isFinite(float)) {
        console.warn(`Invalid <Movable.Item> initial position: ${value}`);
        return 0;
      }

      if (value.endsWith("%")) {
        return relativeTo * (float / 100);
      }

      if (value.endsWith("px")) {
        return float;
      }
    }

    console.warn(`Invalid <Movable.Item> initial position: ${value}`);
    return 0;
  },
};
