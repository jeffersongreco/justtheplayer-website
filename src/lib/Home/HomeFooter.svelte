<script lang="ts">
  import type { HomeModel } from "$lib/Home/HomeModel.svelte";
  import type { DragModel } from "$lib/Sensor/DragModel.svelte";
  import type { PlayerModel } from "$lib/Home/PlayerModel.svelte";

  const {
    homeModel,
    dragModel,
    playerModel,
  }: { homeModel: HomeModel; dragModel: DragModel; playerModel: PlayerModel } =
    $props();
</script>

<div class="grid" class:hidden={!dragModel.isTutorialFinished}>
  <div class="column">
    <h1 class="heading">Just the player</h1>
    <p>See just what you go for in YouTube™</p>
  </div>
  <div class="column">
    <p>Get the extension:</p>
    <p>
      <a
        href="https://chromewebstore.google.com/detail/mgpelfpkfhgiclbfdnomlkbdeoeidhbk"
        class="interactive"
        >Chrome ↗︎</a
      >. (Safari and Firefox soon)
    </p>
  </div>

  <div class="column">
    <button class="interactive" onclick={() => playerModel.toggleMute()}>
      {playerModel.isMuted ? "Unmute" : "Mute"}
    </button>
    <button
      popovertarget="modal"
      onclick={homeModel.togglePopover}
      class="interactive modal-button"
    >
      {homeModel.isPopoverOpen ? "Close" : "✦ Know why this video"}
    </button>
  </div>
  <div class="column right">
    <a
      href="https://github.com/ancientabiding/just-the-player.git"
      class="interactive"
      >GitHub ↗︎</a
    >
    <p>Greco © 2025</p>
  </div>
</div>
