<script lang="ts">
  import { getContext, type Snippet } from "svelte";
  import type { Action } from "svelte/action";
  import type { DragModel } from "./DragModel.svelte";

  let {
    id,
    onDrop,
    children,
  }: {
    id: string;
    onDrop?: () => void;
    children: Snippet<[{ isOver: boolean; targetAction: Action<HTMLElement> }]>;
  } = $props();

  const model = getContext<DragModel>(Symbol.for("DRAG_CTX"));
  if (!model) {
    throw new Error("DropTarget must be inside a <DragRoot>");
  }

  const targetAction: Action<HTMLElement> = (node) => {
    model.registerTarget(id, node.getBoundingClientRect());
    return {
      destroy() {
        model.unregisterTarget(id);
      },
    };
  };

  let isOver = $derived(model.hoveredTargetId === id);

  $effect(() => {
    // If drag just finished AND we were the hovered target
    if (!model.activeDraggableId && isOver) {
      onDrop?.();
    }
  });
</script>

{@render children({ isOver, targetAction })}
