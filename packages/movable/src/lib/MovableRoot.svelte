<script lang="ts">
  import type { Action } from "svelte/action";
  import type { MovableRootProps } from "./Movable.types";
  import { MovableModel, setMovableContext } from "./MovableModel.svelte";
  import { createMovableRootController } from "./MovableRootController";

  let { asChild }: MovableRootProps = $props();

  const model = new MovableModel();
  setMovableContext(model);

  const root: Action<HTMLElement> = (node) => {
    const controller = createMovableRootController(node, model);
    return { destroy: controller.destroy };
  };
</script>

{@render asChild({ root, model })}
