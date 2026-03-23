<!-- AttentionTest.svelte -->
<script lang="ts">
  import {
    AttentionRequester,
    DoubleBounce,
    PhysicsBounce,
  } from "@headless-uai/attention-requester";
  import { onMount } from "svelte";

  const attentionDiscard = AttentionRequester();
  const attentionResume = AttentionRequester();

  const animationDiscard = PhysicsBounce({
    direction: "up",
    loop: true,
    restDuration: 1000,
    onInterrupt: "discard",
  });

  const animationResume = DoubleBounce({
    direction: "up",
    loop: true,
    restDuration: 1000,
    onInterrupt: "resume",
  });

  let paused = $state(false);
  let log = $state<string[]>([]);

  function addLog(msg: string) {
    const time = performance.now().toFixed(1);
    log = [`[${time}ms] ${msg}`, ...log].slice(0, 30);
  }

  $effect(() => {
    attentionDiscard.paused = paused;
    attentionResume.paused = paused;
  });

  onMount(() => {
    const t = setTimeout(() => {
      addLog("▶ request() on both");
      attentionDiscard.request(animationDiscard);
      attentionResume.request(animationResume);
    }, 500);

    return () => clearTimeout(t);
  });
</script>

<div class="test-page">
  <div class="stages">
    <div class="stage">
      <span class="stage-label">discard</span>
      <div class="stage-area">
        <div {@attach attentionDiscard.attach} class="target"></div>
      </div>
    </div>

    <div class="stage">
      <span class="stage-label">resume</span>
      <div class="stage-area">
        <div {@attach attentionResume.attach} class="target"></div>
      </div>
    </div>
  </div>

  <div class="controls">
    <button
      onclick={() => {
      addLog("▶ request() on both");
      attentionDiscard.request(animationDiscard);
      attentionResume.request(animationResume);
    }}
    >
      request()
    </button>

    <button
      onclick={() => {
      paused = !paused;
      addLog(`${paused ? "⏸" : "▶"} paused = ${paused}`);
    }}
    >
      paused: {paused}
    </button>

    <button
      onclick={() => {
      addLog("⏹ cancel() on both");
      attentionDiscard.cancel();
      attentionResume.cancel();
    }}
    >
      cancel()
    </button>

    <button onclick={() => (log = [])}>clear log</button>
  </div>

  <div class="log">
    {#each log as entry, i (i)}
      <div class="entry">{entry}</div>
    {/each}
  </div>
</div>

<style>
  .test-page {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 40px;
    font-family: monospace;
    font-size: 13px;
  }

  .stages {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .stage {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .stage-label {
    font-size: 12px;
    color: #737373;
    text-align: center;
  }

  .stage-area {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    height: 200px;
    border: 1px solid #e2e2e2;
    border-radius: 12px;
    padding: 24px;
  }

  .target {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    background: #dbeafe;
    border: 1px solid #93c5fd;
  }

  .controls {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  button {
    padding: 8px 16px;
    border-radius: 8px;
    border: 1px solid #d4d4d4;
    background: #f5f5f5;
    color: #171717;
    cursor: pointer;
    font-family: monospace;
    font-size: 13px;
  }

  button:hover {
    background: #e5e5e5;
  }

  .log {
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-height: 300px;
    overflow-y: auto;
    padding: 16px;
    background: #f5f5f5;
    border-radius: 8px;
    border: 1px solid #e2e2e2;
  }

  .entry {
    color: #737373;
    white-space: pre;
  }

  .entry:first-child {
    color: #171717;
  }
</style>
