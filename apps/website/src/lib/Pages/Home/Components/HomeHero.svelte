<script lang="ts">
  import {
    AttentionRequester,
    PhysicsBounce,
  } from "@headless-uai/attention-requester";
  import { Movable } from "@headless-uai/movable";
  import { onMount } from "svelte";
  import Cursor from "./Cursor.svelte";
  import HomeScreen from "./HomeScreen.svelte";
  import IMac from "./IMac.svelte";
  import noise from "./tmp/noise.mp4";

  let { isHeroSubtle }: { isHeroSubtle: boolean } = $props();

  let attention: AttentionRequester;
  const animation = PhysicsBounce({
    direction: "up",
    loop: true,
    onInterrupt: "discard",
  });

  onMount(() => {
    const timeout = setTimeout(() => {
      attention.request(animation);
    }, 4000);

    return () => clearTimeout(timeout);
  });
</script>

<Movable.Root>
  {#snippet asChild({ root, model })}
    <div use:root class="hero z-stack">
      <!-- Vídeo -->
      <div
        class="noise"
        class:isHeroSubtle
        class:isCursorOutScreen={!model.isOverSensor("home-screen-sensor")}
      >
        <video autoplay loop muted playsinline>
          <source src={noise} type="video/mp4">
        </video>
      </div>
      <!-- iMac -->
      <div class="imac" class:isHeroSubtle>
        <IMac>
          <HomeScreen />
        </IMac>
      </div>
      <!-- Sombra inferior -->
      <div class="gradient" class:isHeroSubtle></div>

      <!-- Cursor -->
      <Movable.Item initialPosition={{ x: "50%", y: "50%" }}>
        {#snippet children({isMoving})}
          <AttentionRequester bind:this={attention} paused={isMoving}>
            <Cursor />
          </AttentionRequester>
        {/snippet}
      </Movable.Item>
    </div>
  {/snippet}
</Movable.Root>

<style>
  .hero {
    position: relative;
    width: 100%;
    height: 100%;
    isolation: isolate;
    contain: strict;
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
    /* Force GPU layer promotion */
    will-change: transform, opacity;
    transform: translateZ(0);
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

  .imac.isHeroSubtle {
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

  .gradient.isHeroSubtle {
    /*transform: scaleY(1);*/
    opacity: 1;
  }
</style>
