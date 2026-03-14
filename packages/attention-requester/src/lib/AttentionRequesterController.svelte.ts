import type { AttentionRequesterModel } from "./AttentionRequesterModel.svelte";
import type { PauseIntent } from "./types";

export class AttentionRequesterController {
  readonly #wrapper: HTMLElement;
  readonly #model: AttentionRequesterModel;
  #el: HTMLElement | null = null;
  #anim: Animation | null = null;
  #interval: ReturnType<typeof setTimeout> | null = null;
  #destroyed = false;

  constructor(el: HTMLElement, model: AttentionRequesterModel) {
    this.#wrapper = el;
    this.#model = model;
  }

  #resolveTarget(): HTMLElement {
    if (!this.#el) {
      this.#el = (this.#wrapper.children[0] as HTMLElement) ?? this.#wrapper;
    }
    return this.#el;
  }

  syncActive(isActive: boolean) {
    if (isActive && !this.#anim) {
      this.#startCycle();
    }
  }

  syncPauseIntent(intent: PauseIntent) {
    switch (intent.action) {
      case "freeze": {
        this.#anim?.pause();
        break;
      }
      case "resume": {
        this.#anim?.play();
        break;
      }

      case "discard": {
        const el = this.#resolveTarget();
        const frozen = getComputedStyle(el).translate;

        el.style.translate = frozen === "none" ? "" : frozen;

        this.#anim?.cancel();
        this.#anim = null;

        if (this.#interval !== null) {
          clearTimeout(this.#interval);
          this.#interval = null;
        }

        this.#interval = setTimeout(() => {
          if (!this.#destroyed && this.#model.isActive) {
            this.#startCycle();
          }
        }, intent.interval);
        break;
      }

      default:
        break;
    }
  }

  #startCycle() {
    const config = this.#model.animation;
    if (!config || this.#destroyed) {
      return;
    }

    const el = this.#resolveTarget();

    const keyframes =
      typeof config.keyframes === "function"
        ? config.keyframes(el)
        : config.keyframes;

    this.#anim = el.animate(keyframes, {
      duration: config.duration,
      fill: "none",
      easing: "linear",
    });

    if (this.#model.isPaused) {
      this.#anim.pause();
    }

    this.#anim.addEventListener(
      "finish",
      () => {
        this.#anim = null;
        this.#model.onCycleFinished();

        if (this.#model.isActive && config.loop) {
          this.#interval = setTimeout(() => {
            if (!this.#destroyed && this.#model.isActive) {
              this.#startCycle();
            }
          }, config.interval);
        }
      },
      { once: true }
    );
  }

  destroy() {
    this.#destroyed = true;
    this.#anim?.cancel();
    this.#anim = null;
    if (this.#interval !== null) {
      clearTimeout(this.#interval);
    }
  }
}
