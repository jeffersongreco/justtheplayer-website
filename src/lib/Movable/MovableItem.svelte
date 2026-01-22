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
    group = "default",
    class: className = "",
    tabindex = 0,
    children,
    asChild,
  }: {
    id?: string;
    initialX?: InitialPosition;
    initialY?: InitialPosition;
    group?: string;
    class?: string;
    tabindex?: number;

    children?: Snippet<[{ isMoving: boolean; isFocused: boolean }]>;

    asChild?: Snippet<
      [
        {
          movable: Action<HTMLElement>;
          isMoving: boolean;
          isFocused: boolean;
        },
      ]
    >;
  } = $props();

  const model = getContext<MovableModel>(Symbol.for("MVB_CTX"));

  const movable: Action<HTMLElement> = (node) => {
    const manager = createMovableManager(
      node,
      model,
      id,
      initialX,
      initialY,
      group
    );
    return { destroy: manager.destroy };
  };

  let isMoving = $derived(model.activeItemID === id);
  let isFocused = $state(false);

  function handleFocus(e: FocusEvent) {
    if (e.target instanceof HTMLElement) {
      isFocused = e.target.matches(":focus-visible");
    }
  }

  function handleBlur() {
    isFocused = false;
  }
</script>

{#if asChild}
  {@render asChild({ movable, isMoving, isFocused })}
{:else}
  <div
    use:movable
    class="movable {className}"
    data-dragging={isMoving}
    role="button"
    tabindex={tabindex}
    onfocus={handleFocus}
    onblur={handleBlur}
  >
    {@render children?.({ isMoving, isFocused })}
  </div>
{/if}

<style>
  .movable {
    display: flex;
    width: max-content;
    height: max-content;
  }

  .movable:focus,
  .movable:focus-visible {
    outline: none;
  }

  .movable[data-dragging="true"] :global(*) {
    animation-play-state: paused !important;
  }
</style>
