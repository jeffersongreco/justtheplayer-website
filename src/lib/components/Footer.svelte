<script lang="ts">
  import { FooterModel } from "./Footer";
  const model = new FooterModel();

  function _toggleMute() {
    toggleMute();
    model.toggleIsMuted();
  }

  let { hasReturned, toggleMute = () => {} } = $props();
</script>

<div class="grid" class:hidden={!hasReturned}>
  <div class="column">
    <h1 class="heading">Just the player</h1>
    <p>See just what you go for in YouTube™</p>
  </div>
  <div class="column">
    <p>Get the extension:</p>
    <p>
      <a
        href="https://chromewebstore.google.com/detail/mgpelfpkfhgiclbfdnomlkbdeoeidhbk?utm_source=item-share-cb"
        class="interactive">Chrome ↗︎</a
      >. (Safari and Firefox soon)
    </p>
  </div>

  <div class="column">
    <button class="interactive" onclick={() => _toggleMute()}>
      {#if model.isMuted}
        Mute
      {:else}
        Unmute
      {/if}
    </button>
    <button
      popovertarget="modal"
      onclick={model.toggleIsPopoverOpen}
      class="interactive modal-button"
      >{model.isPopoverOpen ? "Close" : "✦ Know why this video"}</button
    >
  </div>
  <div class="column right">
    <a
      href="https://github.com/ancientabiding/just-the-player.git"
      class="interactive">GitHub ↗︎</a
    >
    <p>Greco © 2025</p>
  </div>
</div>
