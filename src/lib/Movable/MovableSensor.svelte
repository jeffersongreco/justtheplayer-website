<script lang="ts">
  import { getContext, type Snippet } from "svelte";
  import type { Action } from "svelte/action";
  import type { MovableModel } from "./MovableModel.svelte";

  let {
    id,
    onDrop,
    children,
  }: {
    id: string;
    onDrop?: () => void;
    children: Snippet<[{ isOver: boolean; sensor: Action<HTMLElement> }]>;
  } = $props();

  const model = getContext<MovableModel>(Symbol.for("MVB_CTX"));
  if (!model) {
    throw new Error("DropTarget must be inside a <MovableContext>");
  }

  const sensor: Action<HTMLElement> = (node) => {
    model.registerTarget(id, node.getBoundingClientRect());
    return {
      destroy() {
        model.unregisterTarget(id);
      },
    };
  };

  let isOver = $derived(model.activeSensorID === id);

  $effect(() => {
    if (!model.activeItemID && isOver) {
      onDrop?.();
    }
  });
</script>

{@render children({ isOver, sensor })}
