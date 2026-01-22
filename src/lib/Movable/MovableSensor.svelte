<script lang="ts">
  import { getContext, type Snippet } from "svelte";
  import type { Action } from "svelte/action";
  import type { MovableModel } from "./MovableModel.svelte";

  let {
    id,
    accepts = [],
    onDrop,
    children,
  }: {
    id: string;
    accepts?: string | string[];
    onDrop?: () => void;
    children: Snippet<[{ isOver: boolean; sensor: Action<HTMLElement> }]>;
  } = $props();

  const model = getContext<MovableModel>(Symbol.for("MVB_CTX"));
  if (!model) {
    throw new Error("DropTarget must be inside a <MovableContext>");
  }

  const sensor: Action<HTMLElement> = (node) => {
    const acceptList = Array.isArray(accepts) ? accepts : [accepts];
    model.registerTarget(id, node.getBoundingClientRect(), acceptList);
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
