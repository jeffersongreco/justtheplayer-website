<script lang="ts">
  import type { Action } from "svelte/action";
  import type { MovableItemProps } from "./Movable.types";
  import { MovableItemCoordinator } from "./MovableItemCoordinator.svelte";
  import { getMovableContext } from "./MovableModel.svelte";

  let {
    id = crypto.randomUUID(),
    initialPosition = { x: "50%", y: "50%" },
    group = [],
    tabindex = 0,
    class: className = "",
    children,
    asChild,
  }: MovableItemProps = $props();

  const model = getMovableContext();

  const item: Action<HTMLElement> = (el) => {
    const coordinator = new MovableItemCoordinator(
      el,
      model,
      id,
      initialPosition,
      group
    );
    return { destroy: () => coordinator.destroy() };
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
  {@render asChild({ item, isMoving, isFocused })}
{:else}
  <div
    use:item
    class="movable {className}"
    data-dragging={isMoving}
    role="button"
    {tabindex}
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
