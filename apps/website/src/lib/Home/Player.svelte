<script lang="ts">
  import "@mux/mux-player";
  import type { PlayerModel } from "$lib/Home/PlayerModel.svelte";

  let { playerModel }: { playerModel: PlayerModel } = $props();
</script>

<div class="video-container">
  <mux-player
    bind:this={playerModel.element}
    onloadedmetadata={() => playerModel.setup()}
    onplaying={() => playerModel.notifyPlaying()}
    playback-id="SpGFutiE7gQvdHtH027ZlvQprA02Y01yUyXzjSV62CG02fc"
    stream-type="on-demand"
    muted={playerModel.isMuted}
    loop
    crossorigin
    class="video-player"
    style="aspect-ratio: 16/9;"
  ></mux-player>
</div>

<style>
  .video-container {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: black;
    overflow: hidden;
    position: relative;
  }

  .video-player {
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
</style>
