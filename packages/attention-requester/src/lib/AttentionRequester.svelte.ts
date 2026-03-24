import { MediaQuery } from "svelte/reactivity";
import type {
  AttentionRequesterAnimation,
  AttentionRequester as AttentionRequesterHandle,
} from "./AttentionRequester.types";
import { AttentionRequesterCoordinator } from "./AttentionRequesterCoordinator.svelte";
import { AttentionRequesterModel } from "./AttentionRequesterModel.svelte";

/**
 * Creates an attention-requester instance.
 *
 * The returned handle exposes a `modifier` attachment for `{@attach}`,
 * imperative `request()`/`cancel()` methods, and reactive `isAnimating`/`paused` state.
 *
 * Must be called within a reactive context (component `<script>` or `$effect.root`).
 */
export function AttentionRequester(): AttentionRequesterHandle {
  const model = new AttentionRequesterModel();
  const reducedMotion = new MediaQuery("prefers-reduced-motion: reduce");

  let paused = $state(false);

  $effect(() => model.setReducedMotion(reducedMotion.current));
  $effect(() => (paused ? model.pause() : model.resume()));

  function modifier(el: HTMLElement) {
    const coordinator = new AttentionRequesterCoordinator(el, model);
    return () => coordinator.destroy();
  }

  function request(
    animation: AttentionRequesterAnimation,
    reducedMotionAnimation?: AttentionRequesterAnimation
  ) {
    model.configure(animation, reducedMotionAnimation);
    model.request();
  }

  function cancel() {
    model.cancel();
  }

  return {
    modifier,
    request,
    cancel,
    get isAnimating() {
      return model.isActive;
    },
    get paused() {
      return paused;
    },
    set paused(value: boolean) {
      paused = value;
    },
  };
}
