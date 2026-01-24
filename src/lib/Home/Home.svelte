<script lang="ts">
  import HomeFooter from "./HomeFooter.svelte";
  import { HomeModel } from "./HomeModel.svelte.ts";

  const model = new HomeModel();
</script>

<main>
  <div class="layout">
    <div></div>

    <HomeFooter {model} />

    <div></div>
  </div>
</main>
