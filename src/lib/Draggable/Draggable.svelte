<script lang="ts">
  import { getContext, type Snippet } from "svelte";
  import type { Action } from "svelte/action";
  import { createDragManager } from "./DragManager";
  import type { DragModel } from "./DragModel.svelte";

  let {
    id = crypto.randomUUID(),
    x = 0,
    y = 0,
    class: className = "",
    tabindex = 0,
    children,
    asChild,
  }: {
    id?: string;
    x?: number | string;
    y?: number | string;
    class?: string;
    tabindex?: number;

    children?: Snippet<[{ isDragging: boolean; isFocused: boolean }]>;

    asChild?: Snippet<
      [
        {
          dragAction: Action<HTMLElement>;
          isDragging: boolean;
          isFocused: boolean;
        },
      ]
    >;
  } = $props();

  const model = getContext<DragModel>(Symbol.for("DRAG_CTX"));

  const dragAction: Action<HTMLElement> = (node) => {
    const manager = createDragManager(node, model, id, { x, y });
    return { destroy: manager.destroy };
  };

  let isDragging = $derived(model.activeDraggableId === id);
  let isFocused = $state(false);
</script>

{#if asChild}
  {@render asChild({ dragAction, isDragging, isFocused })}
{:else}
  <div
    use:dragAction
    class="draggable {className}"
    data-dragging={isDragging}
    role="button"
    tabindex={tabindex}
    onfocus={() => isFocused = true}
    onblur={() => isFocused = false}
  >
    {@render children?.({ isDragging, isFocused })}
  </div>
{/if}

<style>
  .draggable {
    display: flex;
    width: max-content;
    height: max-content;
  }

  .draggable:focus-visible {
    outline: none;
  }

  .draggable[data-dragging="true"] :global(*) {
    animation-play-state: paused !important;
  }
</style>
