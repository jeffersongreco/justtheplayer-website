import {
  defineBounceAnimation,
  makeTranslate,
} from "../Bounce/BounceARAnimationShared";

export const DoubleBounce = defineBounceAnimation({
  namePrefix: "double-bounce",
  defaultDuration: 2000,
  keyframeBuilder: ({ cx, cy, cz, dx, dy, dz }) => [
    // Rest position
    {
      translate: makeTranslate(cx, cy, cz),
      easing: "ease-in-out",
      offset: 0,
    },
    // First bounce — full amplitude
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
    // Second bounce — 66% amplitude
    {
      translate: makeTranslate(cx + dx * 0.66, cy + dy * 0.66, cz + dz * 0.66),
      easing: "cubic-bezier(0.33, 1, 0.68, 1)",
      offset: 0.6,
    },
    {
      translate: makeTranslate(cx, cy, cz),
      easing: "cubic-bezier(0.32, 0, 0.67, 0)",
      offset: 0.8,
    },
    // Settle
    {
      translate: makeTranslate(cx, cy, cz),
      easing: "ease-out",
      offset: 1,
    },
  ],
});
