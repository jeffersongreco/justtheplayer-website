import type { AttentionRequesterAnimation, PauseIntent } from "./types";

export class AttentionRequesterModel {
  #active = $state(false);
  #paused = $state(false);
  #cancelled = $state(false);
  #animation = $state<AttentionRequesterAnimation | null>(null);

  readonly isActive = $derived(this.#active);
  readonly isPaused = $derived(this.#paused);
  readonly animation = $derived(this.#animation);
  readonly pauseIntent = $derived(this.#resolvePauseIntent());

  #resolvePauseIntent(): PauseIntent {
    if (this.#paused) {
      return { action: "freeze" };
    }

    const anim = this.#animation;

    if (!anim) {
      return { action: "resume" };
    }

    if (anim.onInterrupt === "discard") {
      const interval = "loop" in anim && anim.loop ? anim.interval : 0;
      return { action: "discard", interval };
    }

    return { action: "resume" };
  }

  configure(animation: AttentionRequesterAnimation) {
    this.#animation = animation;
  }

  request() {
    if (this.#active) {
      return;
    }
    this.#active = true;
    this.#paused = false;
  }

  onCycleFinished() {
    if (!this.#active) {
      return;
    }
    if (this.#cancelled || !this.#animation?.loop) {
      this.#active = false;
      this.#cancelled = false;
    }
  }

  cancel() {
    if (!this.#animation) {
      return;
    }
    this.#cancelled = true;
  }

  pause() {
    if (!this.#active) {
      return;
    }
    this.#paused = true;
  }

  resume() {
    this.#paused = false;
  }
}
