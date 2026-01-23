<script lang="ts">
  import { MovableModel } from "./MovableModel.svelte";
  import type { MovableRootProps } from "./types";

  let { asChild }: MovableRootProps = $props();

  const model = MovableModel.provide();
</script>

{@render asChild({ model })}
