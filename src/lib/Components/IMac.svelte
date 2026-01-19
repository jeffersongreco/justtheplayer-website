<script lang="ts">
  import type { Snippet } from "svelte";
  import type { Ref } from "$lib/Types";
  import crt from "./tmp/crt.png";
  import imac from "./tmp/imac.png";
  import wallpaper from "./tmp/wallpaper.png";

  let { screenRef, children }: { screenRef?: Ref; children: Snippet } =
    $props();

  // biome-ignore lint/suspicious/noEmptyBlockStatements: Intencional void
  const noop: Ref = () => {};
  const resolvedScreenRef = $derived(screenRef ?? noop);
</script>

<div class="container">
  <div class="imac-wrapper">
    <!-- Screen -->
    <div class="screen z-stack" use:resolvedScreenRef>
      <!-- Wallpaper -->
      <img src={wallpaper} alt="" class="wallpaper">
      <!-- Children -->
      <div class="children">{@render children()}</div>
      <!-- Overlays -->
      <img src={crt} alt="" class="crt">
      <div class="glare"></div>
    </div>

    <!-- iMac -->
    <img src={imac} alt="" class="imac">
  </div>
</div>

<style>
  .container {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    container-type: size;
  }

  .imac-wrapper {
    position: relative;
    aspect-ratio: 801.6 / 800;
    perspective: 2000px;
  }

  @container (min-aspect-ratio: 801.6 / 800) {
    .imac-wrapper {
      height: 100%;
      width: auto;
    }
  }

  @container (max-aspect-ratio: 801.6 / 800) {
    .imac-wrapper {
      width: 100%;
      height: auto;
    }
  }

  .imac {
    width: 100%;
    height: 100%;
    object-fit: contain;
    pointer-events: none;
    position: relative;
    z-index: 2;
    filter: brightness(var(--imac-brightness));
    transition: filter 2s ease-out;
  }

  .screen {
    position: absolute;
    top: 9.38%;
    left: 12.61%;
    right: 12.79%;
    bottom: 32.88%;
    overflow: hidden;
    z-index: 1;
    transform: rotateX(3deg) translateZ(-10px);
    transform-origin: center center;
  }

  .children,
  .wallpaper,
  .crt,
  .glare {
    width: 100%;
    height: 100%;
  }

  .wallpaper,
  .crt,
  .glare {
    object-fit: cover;
  }

  .crt,
  .glare {
    pointer-events: none;
  }

  .crt {
    mix-blend-mode: overlay;
    opacity: 0.5;
  }

  .glare {
    background-color: white;
    opacity: 0.05;
  }
</style>
