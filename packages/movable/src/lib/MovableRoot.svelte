<script lang="ts">
  import type { Action } from "svelte/action";
  import type { MovableRootProps } from "./Movable.types";
  import { MovableContextCoordinator } from "./MovableContextCoordinator.svelte";
  import { MovableModel, setMovableContext } from "./MovableModel.svelte";

  let { asChild }: MovableRootProps = $props();

  const model = new MovableModel();
  setMovableContext(model);

  const root: Action<HTMLElement> = (el) => {
    const coordinator = new MovableContextCoordinator(el, model);
    return { destroy: () => coordinator.destroy() };
  };
</script>

{@render asChild({ root, model })}
