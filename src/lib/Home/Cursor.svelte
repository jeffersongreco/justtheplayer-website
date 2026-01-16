<script lang="ts">
  import cursorSimple from "$lib/assets/os-x-cursor.png";
  import cursor from "$lib/assets/os-x-cursor-with-tooltip.png";

  let { hasReturned = false } = $props();

  let imgSrc = $derived(hasReturned ? cursorSimple : cursor);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="floating-cursor">
  <img src={imgSrc} alt="Cursor">
</div>

<style>
  .floating-cursor {
    width: 141px;
    height: 175px;
    opacity: 1;
    transition: opacity 0.3s ease-out;
    transition-delay: 2.3s;
  }

  @starting-style {
    .floating-cursor {
      opacity: 0;
    }
  }

  .floating-cursor img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    pointer-events: none;
    will-change: transform;
  }
</style>
