<script lang="ts">
  import { getContext, type Snippet } from "svelte";
  import type { Action } from "svelte/action";
  import { createDragManager } from "./DragManager";
  import type { DragModel } from "./DragModel.svelte";

  let {
    id = crypto.randomUUID(),
    x = 0,
    y = 0,
    children,
  }: {
    id?: string;
    x?: number | string;
    y?: number | string;
    children: Snippet<
      [{ isDragging: boolean; dragAction: Action<HTMLElement> }]
    >;
  } = $props();

  // Get the specific model for this area
  const model = getContext<DragModel>(Symbol.for("DRAG_CTX"));
  if (!model) {
    throw new Error("Draggable must be inside a <DragRoot>");
  }

  const dragAction: Action<HTMLElement> = (node) => {
    const manager = createDragManager(node, model, id, { x, y });
    return { destroy: manager.destroy };
  };

  let isDragging = $derived(model.activeDraggableId === id);
</script>

{@render children({ isDragging, dragAction })}
