import { DEV } from "esm-env";
import type {
  AttentionRequesterAnimation,
  InterruptResolution,
} from "./AttentionRequester.types";

export function resolveInterruptResolution(
  animation: AttentionRequesterAnimation | null
): InterruptResolution {
  if (!animation || animation.onInterrupt !== "discard") {
    return { strategy: "resume" };
  }
  const interval = animation.loop ? animation.interval : 0;
  return { strategy: "discard", interval };
}

export class AttentionRequesterModel {
  #active = $state(false);
  #paused = $state(false);
  #cancelled = $state(false);
  #primaryAnimation = $state.raw<AttentionRequesterAnimation | null>(null);
  #reducedMotionAnimation = $state.raw<AttentionRequesterAnimation | null>(
    null
  );
  #reducedMotion = $state(false);

  readonly isActive = $derived(this.#active);
  readonly isPaused = $derived(this.#paused);
  readonly animation = $derived(
    this.#reducedMotion && this.#reducedMotionAnimation
      ? this.#reducedMotionAnimation
      : this.#primaryAnimation
  );
  readonly reducedMotion = $derived(this.#reducedMotion);
  readonly interruptResolution = $derived<InterruptResolution>(
    resolveInterruptResolution(this.animation)
  );

  configure(
    animation: AttentionRequesterAnimation,
    reducedMotionAnimation?: AttentionRequesterAnimation
  ) {
    if (DEV) {
      console.log(`[AR:Model] configure → ${animation.name}`);
    }
    this.#primaryAnimation = animation;
    this.#reducedMotionAnimation = reducedMotionAnimation ?? null;
  }

  setReducedMotion(value: boolean) {
    this.#reducedMotion = value;
  }

  request() {
    if (this.#reducedMotion && !this.#reducedMotionAnimation) {
      if (DEV) {
        console.log("[AR:Model] request suppressed (reduced-motion)");
      }
      return;
    }
    if (this.#active) {
      return;
    }
    if (DEV) {
      console.log("[AR:Model] idle → animating");
    }
    this.#active = true;
    this.#paused = false;
    this.#cancelled = false;
  }

  onCycleFinished() {
    if (!this.#active) {
      return;
    }
    if (this.#cancelled || !this.animation?.loop) {
      if (DEV) {
        console.log(
          `[AR:Model] animating → idle (${this.#cancelled ? "cancelled" : "finished"})`
        );
      }
      this.#active = false;
      this.#cancelled = false;
    }
  }

  cancel() {
    if (!this.animation) {
      return;
    }
    if (DEV) {
      console.log("[AR:Model] cancel requested");
    }
    this.#cancelled = true;
  }

  pause() {
    if (!this.#active) {
      return;
    }
    if (DEV) {
      console.log("[AR:Model] pause");
    }
    this.#paused = true;
  }

  resume() {
    if (DEV && this.#paused) {
      console.log("[AR:Model] resume");
    }
    this.#paused = false;
  }
}
