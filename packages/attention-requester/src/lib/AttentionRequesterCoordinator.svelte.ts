import { DEV } from "esm-env";
import { untrack } from "svelte";
import type { InterruptResolution } from "./AttentionRequester.types";
import type { AttentionRequesterModel } from "./AttentionRequesterModel.svelte";

export class AttentionRequesterCoordinator {
  readonly #el: HTMLElement;
  readonly #model: AttentionRequesterModel;
  #anim: Animation | null = null;
  #interval: ReturnType<typeof setTimeout> | null = null;
  #destroyed = false;

  constructor(el: HTMLElement, model: AttentionRequesterModel) {
    this.#el = el;
    this.#model = model;

    $effect(() => {
      if (this.#model.isActive && !this.#anim) {
        // untrack: startCycle reads animation config — changes to the config
        // should not re-trigger this effect; only isActive/anim gate it.
        untrack(() => this.#startCycle());
      }
    });

    $effect(() => {
      if (this.#model.isPaused) {
        this.#anim?.pause();
      } else {
        // untrack: applying the interrupt resolution is a one-time side effect
        // in response to unpausing — it must not re-run when the resolution
        // object itself changes.
        untrack(() =>
          this.#applyInterruptResolution(this.#model.interruptResolution)
        );
      }
    });

    $effect(() => {
      el.toggleAttribute("data-ar-requesting", this.#model.isActive);
      el.toggleAttribute(
        "data-ar-paused",
        this.#model.isActive && this.#model.isPaused
      );
    });
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
        const el = this.#el;
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

    const el = this.#el;

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
    this.#el.removeAttribute("data-ar-requesting");
    this.#el.removeAttribute("data-ar-paused");
  }
}
