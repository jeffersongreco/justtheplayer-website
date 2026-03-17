<script lang="ts">
  import type { AttentionRequester as AttentionRequesterType } from "../lib";
  import {
    AttentionRequester,
    DoubleBounce,
    PhysicsBounce,
  } from "../lib";
  import { onMount } from "svelte";

  // biome-ignore lint/suspicious/noUnassignedVariables: assigned via bind:this before onMount
  let attentionDiscard: AttentionRequesterType;
  // biome-ignore lint/suspicious/noUnassignedVariables: assigned via bind:this before onMount
  let attentionResume: AttentionRequesterType;

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
  let discardAnimating = $state(false);
  let resumeAnimating = $state(false);
  let reducedMotion = $state(false);
  let log = $state<string[]>([]);

  $effect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion = mql.matches;
    const onChange = (e: MediaQueryListEvent) => { reducedMotion = e.matches; };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  });

  function addLog(msg: string) {
    const time = performance.now().toFixed(1);
    log = [`[${time}ms] ${msg}`, ...log].slice(0, 30);
  }

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
        <AttentionRequester bind:this={attentionDiscard} {paused}>
          {#snippet children({ isAnimating })}
            {@const _ = (discardAnimating = isAnimating)}
            <div class="target"></div>
          {/snippet}
        </AttentionRequester>
      </div>
    </div>

    <div class="stage">
      <span class="stage-label">resume</span>
      <div class="stage-area">
        <AttentionRequester bind:this={attentionResume} {paused}>
          {#snippet children({ isAnimating })}
            {@const _ = (resumeAnimating = isAnimating)}
            <div class="target"></div>
          {/snippet}
        </AttentionRequester>
      </div>
    </div>
  </div>

  <div class="inspectors">
    <div class="inspector">
      <span class="inspector-title">discard — state</span>
      <div class="inspector-row"><span>isAnimating</span><span class="val">{discardAnimating}</span></div>
      <div class="inspector-row"><span>isPaused</span><span class="val">{paused}</span></div>
      <div class="inspector-row"><span>animation</span><span class="val">{animationDiscard.name}</span></div>
      <div class="inspector-row"><span>interrupt</span><span class="val">discard ({animationDiscard.interval}ms)</span></div>
      <div class="inspector-row"><span>reducedMotion</span><span class="val">{reducedMotion}</span></div>
    </div>
    <div class="inspector">
      <span class="inspector-title">resume — state</span>
      <div class="inspector-row"><span>isAnimating</span><span class="val">{resumeAnimating}</span></div>
      <div class="inspector-row"><span>isPaused</span><span class="val">{paused}</span></div>
      <div class="inspector-row"><span>animation</span><span class="val">{animationResume.name}</span></div>
      <div class="inspector-row"><span>interrupt</span><span class="val">resume</span></div>
      <div class="inspector-row"><span>reducedMotion</span><span class="val">{reducedMotion}</span></div>
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
    {#each log as entry}
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

  .inspectors {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .inspector {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 12px;
    background: #fafafa;
    border: 1px solid #e2e2e2;
    border-radius: 8px;
  }

  .inspector-title {
    font-size: 11px;
    color: #a3a3a3;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 4px;
  }

  .inspector-row {
    display: flex;
    justify-content: space-between;
  }

  .inspector-row span:first-child {
    color: #737373;
  }

  .val {
    color: #171717;
    font-weight: 600;
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
