<script lang="ts">
  import browserTop from "./tmp/browser-top.png";
  import disparada from "./tmp/disparada.webm";
  import youtubeBottom from "./tmp/youtube-bottom.png";
  import youtubeTop from "./tmp/youtube-top.png";

  let { isCursorOutScreen }: { isCursorOutScreen: boolean } = $props();
</script>

<div class="screen">
  <div class="window">
    <img src={browserTop} alt="" class="browser-top">
    <img src={youtubeTop} alt="" class="youtube-top" class:isCursorOutScreen>

    <!-- Player -->
    <div class="player-tmp">
      <video autoplay loop muted playsinline>
        <source src={disparada} type="video/webm">
      </video>
    </div>

    <img
      src={youtubeBottom}
      alt=""
      class="youtube-bottom"
      class:isCursorOutScreen
    >
  </div>
</div>

<style>
  .screen {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
    padding: 16px 20px 20px 20px;
  }

  .window {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: auto auto 1fr auto;
    background-color: black;
  }

  .browser-top,
  .youtube-top,
  .player-tmp,
  .youtube-bottom {
    width: 100%;
  }

  .player-tmp {
    background-color: black;
    position: relative;
    overflow: hidden;
  }

  .player-tmp video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .browser-top,
  .youtube-top,
  .youtube-bottom {
    opacity: 1;
    transition: opacity 0.3s ease-out;
  }

  .youtube-top.isCursorOutScreen,
  .youtube-bottom.isCursorOutScreen {
    opacity: 0;
    transition: opacity 1.2s ease-out;
  }
</style>
