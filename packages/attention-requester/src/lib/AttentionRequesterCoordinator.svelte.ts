import { DEV } from "esm-env";
import { untrack } from "svelte";
import type { InterruptResolution } from "./AttentionRequester.types";
import type { AttentionRequesterModel } from "./AttentionRequesterModel.svelte";

export class AttentionRequesterCoordinator {
  readonly #wrapper: HTMLElement;
  readonly #model: AttentionRequesterModel;
  #el: HTMLElement | null = null;
  #anim: Animation | null = null;
  #interval: ReturnType<typeof setTimeout> | null = null;
  #destroyed = false;

  constructor(el: HTMLElement, model: AttentionRequesterModel) {
    this.#wrapper = el;
    this.#model = model;

    $effect(() => {
      if (this.#model.isActive && !this.#anim) {
        untrack(() => this.#startCycle());
      }
    });

    $effect(() => {
      if (this.#model.isPaused) {
        this.#anim?.pause();
      } else {
        untrack(() =>
          this.#applyInterruptResolution(this.#model.interruptResolution)
        );
      }
    });
  }

  #resolveTarget(): HTMLElement {
    if (!this.#el) {
      const child = this.#wrapper.children[0] as HTMLElement | undefined;
      if (!child) {
        throw new Error(
          "[AR:Coordinator] No target element found. Wrap a child element inside <AttentionRequester>."
        );
      }
      this.#el = child;
    }
    return this.#el;
  }

  #applyInterruptResolution(resolution: InterruptResolution) {
    if (DEV) {
      console.log(
        `[AR:Coordinator] interrupt resolution → ${resolution.strategy}`
      );
      performance.mark("ar:interrupt-resolution");
    }
    switch (resolution.strategy) {
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
        }, resolution.interval);
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
    if (DEV) {
      console.log(`[AR:Coordinator] startCycle (${config.name})`);
      performance.mark("ar:cycle-start");
    }

    const el = this.#resolveTarget();

    const keyframes =
      typeof config.keyframes === "function"
        ? config.keyframes(el)
        : config.keyframes;

    this.#anim = el.animate(keyframes, {
      id: `ar-${config.name}`,
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
        if (DEV) {
          performance.mark("ar:cycle-end");
        }
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
    if (DEV) {
      console.log("[AR:Coordinator] destroy");
    }
    this.#destroyed = true;
    this.#anim?.cancel();
    this.#anim = null;
    if (this.#interval !== null) {
      clearTimeout(this.#interval);
    }
  }
}
