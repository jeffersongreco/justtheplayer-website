<script lang="ts">
  import { MediaQuery } from "svelte/reactivity";
  import type {
    AttentionRequesterAnimation,
    AttentionRequesterProps,
  } from "./AttentionRequester.types";
  import { AttentionRequesterCoordinator } from "./AttentionRequesterCoordinator.svelte";
  import { AttentionRequesterModel } from "./AttentionRequesterModel.svelte";

  let { paused = false, children, asChild }: AttentionRequesterProps = $props();

  const model = new AttentionRequesterModel();
  const reducedMotion = new MediaQuery("prefers-reduced-motion: reduce");

  $effect(() => model.setReducedMotion(reducedMotion.current));
  $effect(() => (paused ? model.pause() : model.resume()));

  function attach(el: HTMLElement) {
    const coordinator = new AttentionRequesterCoordinator(el, model);
    return () => coordinator.destroy();
  }

  export function request(animation: AttentionRequesterAnimation) {
    model.configure(animation);
    model.request();
  }

  export function cancel() {
    model.cancel();
  }
</script>

{#if asChild}
  {@render asChild({ attach, isAnimating: model.isActive })}
{:else}
  <div {@attach attach} style="display:contents">
    {#if children}
      {@render children({ isAnimating: model.isActive })}
    {/if}
  </div>
{/if}
