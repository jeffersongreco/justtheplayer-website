<script lang="ts">
  import type {
    MovableContextProps,
    MovableContextQuery,
  } from "./Movable.types";
  import { MovableContextCoordinator } from "./MovableContextCoordinator.svelte";
  import { MovableModel, setMovableContext } from "./MovableModel.svelte";

  let { asChild, children }: MovableContextProps = $props();

  const model = new MovableModel();
  setMovableContext(model);

  const context: MovableContextQuery = {
    isOverSensor: (id: string) => model.isOverSensor(id),
    get activeItemID() {
      return model.activeItemID;
    },
  };

  function attach(el: HTMLElement) {
    const coordinator = new MovableContextCoordinator(el, model);
    return () => coordinator.destroy();
  }
</script>

{#if asChild}
  {@render asChild({ attach, context })}
{:else}
  <div {@attach attach} style="display:contents">
    {#if children}
      {@render children({ context })}
    {/if}
  </div>
{/if}
