<script lang="ts">
  import type { MovableContextProps } from "./Movable.types";
  import { MovableContextCoordinator } from "./MovableContextCoordinator.svelte";
  import { MovableModel, setMovableContext } from "./MovableModel.svelte";

  let { asChild, children }: MovableContextProps = $props();

  const model = new MovableModel();
  setMovableContext(model);

  function attach(el: HTMLElement) {
    const coordinator = new MovableContextCoordinator(el, model);
    return () => coordinator.destroy();
  }
</script>

{#if asChild}
  {@render asChild({ attach, model })}
{:else}
  <div {@attach attach} style="display:contents">
    {#if children}
      {@render children({ model })}
    {/if}
  </div>
{/if}
