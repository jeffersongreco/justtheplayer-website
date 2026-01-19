<script lang="ts">
  import IMac from "$lib/Components/IMac.svelte";
  import type { Ref } from "$lib/Types";
  import HomeScreen from "./HomeScreen.svelte";
  import noise from "./tmp/noise.mp4";

  let {
    screenRef,
    isHeroCollapsed,
    isCursorOutScreen,
  }: { screenRef: Ref; isHeroCollapsed: boolean; isCursorOutScreen: boolean } =
    $props();
</script>

<div class="hero z-stack">
  <!-- Vídeo -->
  <div class="noise" class:isHeroCollapsed class:isCursorOutScreen>
    <video autoplay loop muted playsinline>
      <source src={noise} type="video/mp4">
    </video>
  </div>
  <!-- iMac -->
  <div class="imac" class:isHeroCollapsed>
    <IMac {screenRef}>
      <HomeScreen {isCursorOutScreen} />
    </IMac>
  </div>
  <!-- Sombra inferior -->
  <div class="gradient" class:isHeroCollapsed></div>
</div>

<style>
  .hero {
    width: 100%;
    height: 100%;
  }

  .noise {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    opacity: 1;
    visibility: visible;
    z-index: -1;
    transition: opacity 0.3s ease-out;
  }

  .noise.isCursorOutScreen {
    opacity: 0;
    transition: opacity calc(1.2s * 0.6) ease-out;
  }

  .noise video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .imac {
    width: 100%;
    height: 100%;
    padding: 80px 80px 20px 80px;
  }

  .imac.isHeroCollapsed {
    --imac-brightness: 0.7;
  }

  .gradient {
    width: 100%;
    height: 100%;
    pointer-events: none;
    /*background-image: linear-gradient(
      rgba(0, 0, 0, 0) 70%,
      rgba(0, 0, 0, 0.3) 78%,
      rgba(0, 0, 0, 1) 90%
    );*/
    background-image:
      linear-gradient(
        rgba(0, 0, 0, 0) 70%,
        rgba(0, 0, 0, 0.3) 78%,
        rgba(0, 0, 0, 1) 90%
      ),
      radial-gradient(
        ellipse 70% 100% at top,
        rgba(0, 0, 0, 0) 50%,
        rgba(0, 0, 0, 1) 100%
      );
    z-index: 2;
    /*transform-origin: bottom;
    transform: scaleY(0);
    transition: transform 2s ease-out;*/
    opacity: 0;
    transition: opacity 2s ease-out;
  }

  .gradient.isHeroCollapsed {
    /*transform: scaleY(1);*/
    opacity: 1;
  }
</style>
