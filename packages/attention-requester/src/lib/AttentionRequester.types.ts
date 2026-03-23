/**
 * Strategy applied when an animation is paused.
 *
 * - `"resume"` — freezes the animation in place; on unpause, continues from where it stopped.
 * - `"discard"` — freezes the element at the current computed position and discards the
 *   interrupted cycle. On unpause, waits the rest interval then starts a fresh cycle
 *   from the element's current position. Useful for repositionable elements.
 */
export type AttentionInterruptBehavior = "resume" | "discard";

/** @internal Resolution payload used by the coordinator to act on an interrupt strategy. */
export type InterruptResolution =
  | { strategy: "resume" }
  | { strategy: "discard"; interval: number };

/**
 * Base configuration shared by all attention-request animations.
 *
 * Animations are data-driven: the component is animation-agnostic.
 * Create custom animations by conforming to {@link ARAnimationOneShot} or {@link ARAnimationLoop}.
 */
export interface ARAnimationConfig {
  /** Duration of one animation cycle in milliseconds. */
  duration: number;

  /**
   * Web Animations API keyframes for the animation cycle.
   *
   * When a function, it receives the target element and returns keyframes dynamically.
   */
  keyframes: Keyframe[] | ((el: HTMLElement) => Keyframe[]);

  /** Human-readable name for debugging and logging. */
  name: string;

  /**
   * Strategy applied when the animation is interrupted (paused).
   * @default "resume"
   */
  onInterrupt?: AttentionInterruptBehavior;
}

/**
 * A looping animation that repeats indefinitely until cancelled.
 *
 * Each cycle plays, then the component waits {@link interval} milliseconds before starting
 * the next cycle. Use {@link AttentionRequester.cancel | cancel()} to stop the loop gracefully
 * (the current cycle finishes, then the loop stops).
 */
export interface ARAnimationLoop extends ARAnimationConfig {
  /** Rest interval between cycles in milliseconds. */
  interval: number;

  /** Must be `true` to identify this as a looping animation. */
  loop: true;
}

/**
 * A one-shot animation that plays once and returns to idle.
 */
export interface ARAnimationOneShot extends ARAnimationConfig {
  /** Must be `false` or omitted. Discriminates from {@link ARAnimationLoop}. */
  loop?: false;
}

/**
 * Discriminated union of all animation types accepted by
 * {@link AttentionRequester.request | request()}.
 *
 * TypeScript enforces that `loop: true` requires an `interval`, and
 * `loop: false | undefined` forbids it.
 */
export type AttentionRequesterAnimation = ARAnimationLoop | ARAnimationOneShot;

/**
 * Handle returned by the `AttentionRequester()` factory.
 *
 * Provides imperative methods to trigger and cancel animations,
 * a reactive `attach` action for `{@attach}`, and reactive state.
 */
export interface AttentionRequester {
  /** Svelte attach action — apply with `{@attach attention.attach}` on the target element. */
  readonly attach: (el: HTMLElement) => () => void;

  /**
   * Gracefully cancels the active animation.
   *
   * The current cycle finishes normally, then the loop (if any) does not continue.
   * Calling `cancel()` when idle is a safe no-op.
   */
  cancel: () => void;

  /** `true` while an animation cycle is active, including while paused. */
  readonly isAnimating: boolean;

  /**
   * When `true`, freezes the animation visually. On `false`, resumes according to
   * the animation's {@link ARAnimationConfig.onInterrupt | onInterrupt} strategy.
   *
   * Pausing when idle is a safe no-op.
   * @default false
   */
  paused: boolean;

  /**
   * Triggers an attention-request animation on the target element.
   *
   * If called while an animation is already active, the call is silently ignored (no-op).
   * The consumer is responsible for implementing queuing or priority logic externally.
   *
   * When `prefers-reduced-motion: reduce` is active and no `reducedMotionAnimation` is
   * provided, the request is suppressed and the component stays idle.
   *
   * @param animation - The animation to play.
   * @param reducedMotionAnimation - Optional alternative animation for users who prefer
   *   reduced motion. Plays instead of `animation` when the preference is active.
   */
  request: (
    animation: AttentionRequesterAnimation,
    reducedMotionAnimation?: AttentionRequesterAnimation
  ) => void;
}
