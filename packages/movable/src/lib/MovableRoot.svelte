<script lang="ts">
  import type { Action } from "svelte/action";
  import { MovableModel } from "./MovableModel.svelte";
  import { createMovableRootController } from "./MovableRootController";
  import type { MovableRootProps } from "./types";

  let { asChild }: MovableRootProps = $props();

  const model = MovableModel.provide();

  const root: Action<HTMLElement> = (node) => {
    const controller = createMovableRootController(node, model);
    return { destroy: controller.destroy };
  };
</script>

{@render asChild({ root, model })}
