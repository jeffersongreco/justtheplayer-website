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
};
