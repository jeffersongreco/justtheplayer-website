<script lang="ts">
  import type { Action } from "svelte/action";
  import { AttentionRequesterController } from "./AttentionRequesterController.svelte";
  import { AttentionRequesterModel } from "./AttentionRequesterModel.svelte";
  import type {
    AttentionRequesterAnimation,
    AttentionRequesterProps,
  } from "./AttentionRequester.types";

  let { paused = false, children, asChild }: AttentionRequesterProps = $props();

  const model = new AttentionRequesterModel();
  let el = $state<HTMLElement | null>(null);
  let controller = $state<AttentionRequesterController | null>(null);

  $effect(() => (paused ? model.pause() : model.resume()));

  $effect(() => {
    if (!el) return;
    controller = new AttentionRequesterController(el, model);
    return () => controller?.destroy();
  });

  const action: Action = (node) => {
    el = node;
    return {};
  };

  export function request(animation: AttentionRequesterAnimation) {
    model.configure(animation);
    model.request();
  }

  export function cancel() {
    model.cancel();
  }
</script>

{#if asChild}
  {@render asChild({ action, isAnimating: model.isActive })}
{:else}
  <div bind:this={el} style="display:contents">
    {#if children}
      {@render children({ isAnimating: model.isActive })}
    {/if}
  </div>
{/if}
