<script lang="ts">
  import type {
    AttentionRequesterAnimation,
    AttentionRequesterProps,
  } from "./AttentionRequester.types";
  import { AttentionRequesterController } from "./AttentionRequesterController.svelte";
  import { AttentionRequesterModel } from "./AttentionRequesterModel.svelte";

  let { paused = false, children, asChild }: AttentionRequesterProps = $props();

  const model = new AttentionRequesterModel();

  $effect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    model.setReducedMotion(mql.matches);

    const onChange = (e: MediaQueryListEvent) =>
      model.setReducedMotion(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  });

  $effect(() => (paused ? model.pause() : model.resume()));

  function attach(el: HTMLElement) {
    const ctrl = new AttentionRequesterController(el, model);
    return () => ctrl.destroy();
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
