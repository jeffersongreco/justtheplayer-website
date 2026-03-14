<script lang="ts">
  import browserTop from "$lib/assets/browser-top.png";
  import crtOverlay from "$lib/assets/crt-overlay.png";
  import imacG3 from "$lib/assets/imac-g3.png";
  import youtubeBottom from "$lib/assets/youtube-bottom.png";
  import youtubeTop from "$lib/assets/youtube-top.png";
  import Player from "$lib/Home/Player.svelte";
  import type { PlayerModel } from "$lib/Home/PlayerModel.svelte";
  import type { DragModel } from "$lib/Sensor/DragModel.svelte";

  let {
    dragModel,
    playerModel,
  }: { dragModel: DragModel; playerModel: PlayerModel } = $props();
</script>

<div class="mockup-container">
  <div class="imac-wrapper">
    <div class="screen-area" use:dragModel.target>
      <div
        class="browser-window"
        class:is-over-screen={dragModel.isIntersecting}
      >
        <img src={browserTop} alt="" class="browser-top">
        <img src={youtubeTop} alt="" class="youtube-top">

        <Player {playerModel}/>

        <img src={youtubeBottom} alt="" class="youtube-bottom">
      </div>
      <img src={crtOverlay} alt="" class="crt-overlay">
      <div class="screen-glare"></div>
    </div>

    <img src={imacG3} alt="iMac G3" class="imac-img">
  </div>
</div>

<style>
  .mockup-container {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    container-type: size;
    perspective: 2000px;
  }

  .imac-wrapper {
    position: relative;
    aspect-ratio: 801.6 / 800;
    transform-style: preserve-3d;

    opacity: 1;
    transform: scale(1);
    transition:
      opacity 1.7s ease-out,
      transform 2s ease-out;
  }

  @starting-style {
    .imac-wrapper {
      opacity: 0;
      transform: scale(0.33);
    }
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

  .imac-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    pointer-events: none;
    display: block;
    position: relative;
    z-index: 2;
  }

  .screen-area {
    position: absolute;
    top: 9.38%;
    left: 12.61%;
    right: 12.79%;
    bottom: 32.88%;
    background-color: #b3b3b3;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 18px;
    z-index: 1;
    transform: rotateX(2deg) translateZ(-10px);
    transform-origin: center center;
    opacity: 1;
    transition: opacity 0.3s ease-out;
    transition-delay: 2.3s;
  }

  @starting-style {
    .screen-area {
      opacity: 0;
      transform: scale(0.33);
    }
  }

  .browser-window {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: black;
    border-radius: 4px 4px 0 0;
    box-shadow: 0px 16px 32px 0px rgba(0, 0, 0, 0.43);
    overflow: hidden;
  }

  .browser-top,
  .youtube-top,
  .youtube-bottom {
    width: 100%;
    height: auto;
    opacity: 0;
    transition: opacity 1.2s ease;
  }

  .browser-top {
    opacity: 1;
  }

  .is-over-screen .youtube-top,
  .is-over-screen .youtube-bottom {
    opacity: 1;
    transition: opacity 0.3s ease;
  }

  .crt-overlay {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
    mix-blend-mode: overlay;
    opacity: 0.3;
  }

  .screen-glare {
    position: absolute;
    inset: 0;
    background-color: #4d4d4d;
    mix-blend-mode: screen;
    opacity: 0.3;
    pointer-events: none;
    z-index: 20;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
</style>
