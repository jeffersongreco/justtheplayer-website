import type { AttentionRequesterAnimation, InterruptResolution } from "./AttentionRequester.types";

export class AttentionRequesterModel {
  #active = $state(false);
  #paused = $state(false);
  #cancelled = $state(false);
  #animation = $state<AttentionRequesterAnimation | null>(null);

  readonly isActive = $derived(this.#active);
  readonly isPaused = $derived(this.#paused);
  readonly animation = $derived(this.#animation);
  readonly interruptResolution = $derived<InterruptResolution>(
    this.#resolveInterruptResolution(),
  );

  #resolveInterruptResolution(): InterruptResolution {
    const anim = this.#animation;
    if (!anim || anim.onInterrupt !== "discard") {
      return { strategy: "resume" };
    }
    const interval = anim.loop ? anim.interval : 0;
    return { strategy: "discard", interval };
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
