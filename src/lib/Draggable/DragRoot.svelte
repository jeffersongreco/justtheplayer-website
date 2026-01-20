<script lang="ts">
  import { type Snippet, setContext } from "svelte";
  import { DragModel } from "./DragModel.svelte";

  let { children }: { children: Snippet } = $props();

  // Create a fresh instance for this sub-tree
  const model = new DragModel();

  // Symbol key ensures type safety and no string collisions
  setContext(Symbol.for("DRAG_CTX"), model);
</script>

{@render children()}
