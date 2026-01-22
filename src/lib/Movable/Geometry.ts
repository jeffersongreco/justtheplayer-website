type Pixel = `${number}px`;
type Percentage = `${number}%`;
export type InitialPosition = number | Pixel | Percentage;

export const Geometry = {
  clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(value, max));
  },

  intersects(
    rectA: { x: number; y: number; w: number; h: number },
    rectB: { left: number; right: number; top: number; bottom: number }
  ): boolean {
    return (
      rectA.x < rectB.right &&
      rectA.x + rectA.w > rectB.left &&
      rectA.y < rectB.bottom &&
      rectA.y + rectA.h > rectB.top
    );
  },

  resolve(value: InitialPosition, relativeTo: number): number {
    if (typeof value === "number") {
      if (!Number.isFinite(value)) {
        throw new Error(`Invalid numeric dimension: ${value}.`);
      }
      return value;
    }

    if (typeof value === "string") {
      const float = Number.parseFloat(value);

      if (!Number.isFinite(float)) {
        throw new Error(`Invalid numeric dimension: ${value}.`);
      }

      if (value.endsWith("%")) {
        return relativeTo * (float / 100);
      }

      if (value.endsWith("px")) {
        return float;
      }
    }

    throw new Error(`Invalid value type: ${typeof value}.`);
  },
};
