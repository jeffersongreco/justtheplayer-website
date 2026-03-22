<script lang="ts">
  import type { MovableSensorProps } from "./Movable.types";
  import { getMovableContext } from "./MovableModel.svelte";

  let {
    id = crypto.randomUUID(),
    accepts = [],
    onDrop,
    children,
    asChild,
  }: MovableSensorProps = $props();

  const model = getMovableContext();

  function attach(el: HTMLElement) {
    model.registerSensor(id, el.getBoundingClientRect(), accepts);
    return () => model.unregisterSensor(id);
  }

  let isOver = $derived(model.activeSensorID === id);

  $effect(() => {
    if (!model.activeItemID && isOver) {
      onDrop?.();
    }
  });
</script>

{#if asChild}
  {@render asChild({ attach, isOver })}
{:else}
  <div {@attach attach} class="sensor" data-over={isOver}>
    {#if children}
      {@render children({ isOver })}
    {/if}
  </div>
{/if}

<style>
  .sensor {
    display: flex;
    width: max-content;
    height: max-content;
  }
</style>
