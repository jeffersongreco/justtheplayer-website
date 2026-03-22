<script lang="ts">
  import type { MovableItemProps } from "./Movable.types";
  import { MovableItemCoordinator } from "./MovableItemCoordinator.svelte";
  import { getMovableContext } from "./MovableModel.svelte";

  let {
    id = crypto.randomUUID(),
    initialPosition = { x: "50%", y: "50%" },
    group = [],
    stepSize,
    tabindex = 0,
    children,
    asChild,
  }: MovableItemProps = $props();

  const model = getMovableContext();

  function attach(el: HTMLElement) {
    const coordinator = new MovableItemCoordinator(
      el,
      model,
      id,
      initialPosition,
      group,
      stepSize
    );
    return () => coordinator.destroy();
  }

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
  {@render asChild({ attach, isMoving, isFocused })}
{:else}
  <div
    {@attach attach}
    class="movable"
    data-dragging={isMoving}
    role="button"
    {tabindex}
    onfocus={handleFocus}
    onblur={handleBlur}
  >
    {#if children}
      {@render children({ isMoving, isFocused })}
    {/if}
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
