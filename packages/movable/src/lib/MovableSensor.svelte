<script lang="ts">
  import type { Action } from "svelte/action";
  import type { MovableSensorProps } from "./Movable.types";
  import { getMovableContext } from "./MovableModel.svelte";

  let {
    id = crypto.randomUUID(),
    accepts = [],
    onDrop,
    class: className = "",
    children,
    asChild,
  }: MovableSensorProps = $props();

  const model = getMovableContext();

  const sensor: Action<HTMLElement> = (node) => {
    model.registerSensor(id, node.getBoundingClientRect(), accepts);
    return {
      destroy() {
        model.unregisterSensor(id);
      },
    };
  };

  let isOver = $derived(model.activeSensorID === id);

  $effect(() => {
    if (!model.activeItemID && isOver) {
      onDrop?.();
    }
  });
</script>

{#if asChild}
  {@render asChild({ isOver, sensor })}
{:else}
  <div use:sensor class="sensor {className}" data-over={isOver}>
    {@render children?.({ isOver })}
  </div>
{/if}

<style>
  .sensor {
    display: flex;
    width: max-content;
    height: max-content;
  }
</style>
