<script lang="ts">
  import { type Snippet, setContext } from "svelte";
  import { MovableModel } from "./MovableModel.svelte";

  let { children }: { children: Snippet } = $props();

  const model = new MovableModel();

  setContext(Symbol.for("MVB_CTX"), model);
</script>

{@render children()}
