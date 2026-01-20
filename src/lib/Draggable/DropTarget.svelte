<!-- DropTarget.svelte -->
<script lang="ts">
  import type { Snippet } from "svelte";
  import type { Action } from "svelte/action";
  import { dragModel } from "./DragModel.svelte";

  let {
    id,
    onDrop,
    children,
  }: {
    id: string;
    onDrop?: () => void;
    children: Snippet<[{ isOver: boolean; targetAction: Action<HTMLElement> }]>;
  } = $props();

  // Action to measure and register the target
  const targetAction: Action<HTMLElement> = (node) => {
    // We measure once on mount.
    // Note: If your targets move/resize, use a ResizeObserver here.
    dragModel.registerTarget(id, node.getBoundingClientRect());

    return {
      destroy() {
        dragModel.unregisterTarget(id);
      },
    };
  };

  // Reactive State from Model
  let isOver = $derived(dragModel.hoveredTargetId === id);

  // Drop Transaction
  $effect(() => {
    if (!dragModel.isDragging && isOver) {
      onDrop?.();
    }
  });
</script>

{@render children({ isOver, targetAction })}
