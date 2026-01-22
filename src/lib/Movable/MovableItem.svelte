<script lang="ts">
  import { getContext, type Snippet } from "svelte";
  import type { Action } from "svelte/action";
  import type { InitialPosition } from "./Geometry";
  import { createMovableManager } from "./MovableManager";
  import type { MovableModel } from "./MovableModel.svelte";

  let {
    id = crypto.randomUUID(),
    initialX = 0,
    initialY = 0,
    class: className = "",
    tabindex = 0,
    children,
    asChild,
  }: {
    id?: string;
    initialX?: InitialPosition;
    initialY?: InitialPosition;
    class?: string;
    tabindex?: number;

    children?: Snippet<[{ isDragging: boolean; isFocused: boolean }]>;

    asChild?: Snippet<
      [
        {
          movable: Action<HTMLElement>;
          isDragging: boolean;
          isFocused: boolean;
        },
      ]
    >;
  } = $props();

  const model = getContext<MovableModel>(Symbol.for("MVB_CTX"));

  const movable: Action<HTMLElement> = (node) => {
    const manager = createMovableManager(node, model, id, initialX, initialY);
    return { destroy: manager.destroy };
  };

  let isDragging = $derived(model.activeItemID === id);
  let isFocused = $state(false);
</script>

{#if asChild}
  {@render asChild({ movable, isDragging, isFocused })}
{:else}
  <div
    use:movable
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
