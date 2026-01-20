// Physics.ts
export const Physics = {
  clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(value, max));
  },

  // AABB (Axis-Aligned Bounding Box) Collision
  checkIntersection(
    r1: { x: number; y: number; w: number; h: number },
    r2: { left: number; right: number; top: number; bottom: number }
  ): boolean {
    return (
      r1.x < r2.right &&
      r1.x + r1.w > r2.left &&
      r1.y < r2.bottom &&
      r1.y + r1.h > r2.top
    );
  },

  toPixels(value: number | string, containerSize: number): number {
    if (typeof value === "number") {
      return value;
    }

    if (typeof value === "string") {
      if (value.endsWith("%")) {
        const percentage = Number.parseFloat(value) / 100;
        return containerSize * percentage;
      }
      if (value.endsWith("px")) {
        return Number.parseFloat(value);
      }
      // Fallback for strings like "50"
      return Number.parseFloat(value);
    }
    return 0;
  },
};
