import {
  defineBounceAnimation,
  makeTranslate,
} from "../Bounce/BounceARAnimationShared";

export type {
  BounceConfig as PhysicsBounceConfig,
  BounceDirection,
  CardinalDirection,
  ThreeAxisDirection,
} from "../Bounce/BounceARAnimationShared";

export const PhysicsBounce = defineBounceAnimation({
  namePrefix: "physics-bounce",
  keyframeBuilder: ({ cx, cy, cz, dx, dy, dz }) => [
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
      translate: makeTranslate(cx + dx * 0.01, cy + dy * 0.01, cz + dz * 0.01),
      easing: "linear",
      offset: 0.82,
    },
    {
      translate: makeTranslate(cx, cy, cz),
      easing: "ease-in-out",
      offset: 1,
    },
  ],
});
