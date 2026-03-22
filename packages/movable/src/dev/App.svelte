<script lang="ts">
  import { untrack } from "svelte";
  import { Movable } from "../lib";
  import type { QAStep, QASuite } from "./qa-types.js";

  let log = $state<string[]>([]);

  // Guided QA state
  let mode = $state<"free" | "guided">("free");
  let selectedSuiteIndex = $state<number | null>(null);
  let currentStep = $state(0);
  let triggerFired = $state(false);

  function addLog(msg: string) {
    const time = performance.now().toFixed(1);
    log = [`[${time}ms] ${msg}`, ...log].slice(0, 30);
  }

  function qaLog(n: number, event: string) {
    const msg = `[Movable][step:${n}] ${event}`;
    addLog(msg);
    console.log(msg);
  }

  const suites: QASuite[] = [
    {
      id: "drag-lifecycle",
      title: "Drag Lifecycle",
      description:
        "Tests pointer-down, drag movement, clamping, and pointer-up on a single item.",
      steps: [
        {
          title: "Step 1 of 4: Initial state",
          instruction:
            "Verify the blue item is visible inside the canvas at approximately 10% from the top-left.",
          trigger: () => qaLog(1, "state: idle"),
          expectedLogs: ["[Movable][step:1] state: idle"],
          humanChecklist: [
            "Blue item is visible inside the canvas",
            "Item shows cursor: grab on hover",
            "No console errors",
          ],
        },
        {
          title: "Step 2 of 4: Start drag",
          instruction:
            "Click and hold the blue item. Verify cursor changes to grabbing and the item follows the pointer.",
          expectedLogs: [],
          humanChecklist: [
            "Cursor changes to grabbing on pointer-down",
            "Item follows pointer smoothly with no jank",
            "Item is visually promoted (will-change: transform)",
          ],
        },
        {
          title: "Step 3 of 4: Boundary clamping",
          instruction:
            "While dragging, move the pointer outside the canvas boundaries (top, bottom, left, right).",
          expectedLogs: [],
          humanChecklist: [
            "Item stops at canvas edges — does not escape",
            "All four boundaries clamp correctly",
            "Item snaps back inside if pointer re-enters canvas",
          ],
        },
        {
          title: "Step 4 of 4: Release",
          instruction:
            "Release the pointer. Verify the item stays at its last drag position.",
          expectedLogs: [],
          humanChecklist: [
            "Item remains at drop position",
            "Cursor returns to grab",
            "No layout shift or jump on release",
          ],
        },
      ],
    },
    {
      id: "sensor-interaction",
      title: "Sensor Interaction",
      description:
        "Tests collision detection between a draggable ghost item and a sensor zone.",
      steps: [
        {
          title: "Step 1 of 3: Initial state",
          instruction:
            "Verify the ghost emoji item and the dashed sensor zone are both visible.",
          trigger: () => qaLog(1, "state: idle, sensor visible"),
          expectedLogs: ["[Movable][step:1] state: idle, sensor visible"],
          humanChecklist: [
            "Ghost emoji is visible at bottom-right area",
            "Dashed sensor zone is visible at center",
            "Sensor shows 'Sensor' label and is not highlighted",
          ],
        },
        {
          title: "Step 2 of 3: Drag ghost over sensor",
          instruction:
            "Drag the ghost emoji over the sensor zone. Verify the sensor highlights.",
          expectedLogs: [],
          humanChecklist: [
            "Sensor highlights (green background) when ghost overlaps",
            "Highlight appears as soon as ghost enters sensor area",
            "Highlight disappears when ghost leaves sensor area",
          ],
        },
        {
          title: "Step 3 of 3: Drop on sensor",
          instruction: "Drop the ghost emoji inside the sensor zone.",
          expectedLogs: [],
          humanChecklist: [
            "Sensor detects the drop (highlight was active at release)",
            "Ghost stays at drop position",
            "No errors in console",
          ],
        },
      ],
    },
    {
      id: "smart-anchor",
      title: "Smart Anchor",
      description:
        "Tests that items reposition correctly on container resize before and after user drag.",
      steps: [
        {
          title: "Step 1 of 3: Initial position",
          instruction:
            "Verify the blue item is at approximately 10% from top-left of the canvas.",
          trigger: () => qaLog(1, "checking initial position"),
          expectedLogs: ["[Movable][step:1] checking initial position"],
          humanChecklist: [
            "Blue item is at roughly 10% from top and 10% from left",
            "Ghost emoji is at roughly 80% from top and 80% from left",
          ],
        },
        {
          title: "Step 2 of 3: Resize before drag",
          instruction:
            "Resize the browser window. Verify items reposition proportionally (smart anchor).",
          expectedLogs: [],
          humanChecklist: [
            "Items maintain their relative position (percentage-based)",
            "Items stay within canvas bounds after resize",
            "No visual glitch during resize",
          ],
        },
        {
          title: "Step 3 of 3: Resize after drag",
          instruction:
            "Drag the blue item to a new position, then resize the browser window.",
          expectedLogs: [],
          humanChecklist: [
            "After drag, item stays at absolute position (not re-resolved to %)",
            "On resize, item is clamped to stay within bounds if needed",
            "No jump to original percentage position",
          ],
        },
      ],
    },
    {
      id: "keyboard-interaction",
      title: "Keyboard Interaction",
      description:
        "Tests keyboard-driven movement: focus, grab/release, arrow key steps, and boundary clamping.",
      steps: [
        {
          title: "Step 1 of 6: Focus via Tab",
          instruction:
            "Press Tab until the blue item receives focus. Verify the focus ring appears.",
          trigger: () => qaLog(1, "state: idle, awaiting focus"),
          expectedLogs: ["[Movable][step:1] state: idle, awaiting focus"],
          humanChecklist: [
            "Blue item receives focus via Tab",
            "Focus ring (outline) is visible on the item",
            "No visual change to position — item stays still",
          ],
        },
        {
          title: "Step 2 of 6: Grab with Enter",
          instruction:
            "With the blue item focused, press Enter. Verify the item enters grabbed state.",
          expectedLogs: [],
          humanChecklist: [
            "data-moving attribute becomes 'true'",
            "Cursor changes to grabbing",
            "aria-grabbed attribute becomes 'true'",
            "Item visual indicates grabbed state (shadow, opacity)",
          ],
        },
        {
          title: "Step 3 of 6: Arrow key movement",
          instruction:
            "Press Arrow keys (Up, Down, Left, Right) repeatedly. Verify the item moves in 10px steps.",
          expectedLogs: [],
          humanChecklist: [
            "ArrowRight moves item right ~10px per press",
            "ArrowLeft moves item left ~10px per press",
            "ArrowDown moves item down ~10px per press",
            "ArrowUp moves item up ~10px per press",
            "Movement is smooth with no jank",
          ],
        },
        {
          title: "Step 4 of 6: Boundary clamping via keyboard",
          instruction:
            "Keep pressing an Arrow key until the item reaches the canvas edge.",
          expectedLogs: [],
          humanChecklist: [
            "Item stops at canvas edge — does not escape bounds",
            "Subsequent presses in the same direction have no effect",
            "Movement in other directions still works",
          ],
        },
        {
          title: "Step 5 of 6: Release with Escape",
          instruction:
            "Press Escape to release the item. Verify it returns to idle state.",
          expectedLogs: [],
          humanChecklist: [
            "Item stays at its last keyboard-moved position",
            "Cursor returns to grab",
            "aria-grabbed returns to 'false'",
            "data-moving returns to 'false'",
          ],
        },
        {
          title: "Step 6 of 6: Grab with Space, release with Space",
          instruction:
            "Press Space to grab, move with arrows, then press Space again to release.",
          expectedLogs: [],
          humanChecklist: [
            "Space toggles grab on (same as Enter)",
            "Arrow keys move while grabbed",
            "Space toggles grab off (same as Enter/Escape)",
            "Pointer drag still works after keyboard release",
          ],
        },
      ],
    },
  ];

  const suite = $derived(
    selectedSuiteIndex === null ? null : suites[selectedSuiteIndex]
  );
  const step = $derived(suite ? suite.steps[currentStep] : null);

  function startGuidedMode() {
    log = [];
    selectedSuiteIndex = null;
    currentStep = 0;
    triggerFired = false;
    mode = "guided";
  }

  function selectSuite(index: number) {
    currentStep = 0;
    triggerFired = false;
    selectedSuiteIndex = index;
  }

  function advance() {
    triggerFired = false;
    currentStep += 1;
  }

  // Auto-trigger steps that have no triggerLabel
  $effect(() => {
    if (mode === "guided" && step?.trigger && !step.triggerLabel) {
      untrack(() => {
        // biome-ignore lint/style/noNonNullAssertion: guarded by step?.trigger check above
        step.trigger!();
        triggerFired = true;
      });
    }
  });
</script>

<div class="test-page">
  <h1 class="page-title">Movable — Dev</h1>

  <div class="mode-toggle">
    <button
      type="button"
      class:active={mode === "free"}
      onclick={() => { mode = "free"; }}
    >
      Free
    </button>
    <button
      type="button"
      class:active={mode === "guided"}
      onclick={startGuidedMode}
    >
      Guided QA
    </button>
  </div>

  <div class="stage">
    <Movable.Context>
      {#snippet asChild({ attach })}
        <div {@attach attach} class="canvas">
          <Movable.Sensor accepts={["ghost"]}>
            {#snippet asChild({ attach: attachSensor, isOver })}
              <div {@attach attachSensor} class="sensor" class:active={isOver}>
                Sensor
              </div>
            {/snippet}
          </Movable.Sensor>

          <Movable.Item initialPosition={{ x: "10%", y: "10%" }}>
            {#snippet children({ isMoving, isFocused })}
              <div
                class="item"
                class:moving={isMoving}
                class:focused={isFocused}
              >
                Item
              </div>
            {/snippet}
          </Movable.Item>

          <Movable.Item
            initialPosition={{ x: "80%", y: "80%" }}
            group={["ghost"]}
          >
            {#snippet children()}
              <div class="ghost">👻</div>
            {/snippet}
          </Movable.Item>
        </div>
      {/snippet}
    </Movable.Context>
  </div>

  {#if mode === "free"}
    <div class="controls">
      <button type="button" onclick={() => (log = [])}>clear log</button>
    </div>
  {/if}

  {#if mode === "guided" && selectedSuiteIndex === null}
    <div class="suite-selector">
      <h2 class="suite-selector-title">Select test suite</h2>
      <div class="suite-list">
        {#each suites as s, i (s.id)}
          <button
            type="button"
            class="suite-card"
            onclick={() => selectSuite(i)}
          >
            <span class="suite-card-title">{s.title}</span>
            <span class="suite-card-desc">{s.description}</span>
          </button>
        {/each}
      </div>
    </div>
  {/if}

  {#if mode === "guided" && suite && step}
    <div class="qa-step">
      <div class="qa-suite-name">{suite.title}</div>
      <h2 class="qa-title">{step.title}</h2>
      <p class="qa-instruction">{step.instruction}</p>

      {#if step.trigger && step.triggerLabel}
        <button
          type="button"
          class="qa-trigger"
          disabled={triggerFired}
          onclick={() => { step?.trigger?.(); triggerFired = true; }}
        >
          {step.triggerLabel}
        </button>
      {/if}

      {#if !step.trigger || triggerFired}
        <ul class="qa-checklist">
          {#each step.humanChecklist as item, idx (idx)}
            <li>{item}</li>
          {/each}
        </ul>
        <div class="qa-actions">
          {#if currentStep < suite.steps.length - 1}
            <button type="button" class="qa-next" onclick={advance}>
              Next
            </button>
          {:else}
            <button
              type="button"
              class="qa-done-btn"
              onclick={() => { selectedSuiteIndex = null; }}
            >
              Done — Back to suites
            </button>
          {/if}
        </div>
      {/if}
    </div>
  {/if}

  <div class="log">
    {#each log as entry (entry)}
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

  .page-title {
    margin: 0;
    font-size: 18px;
  }

  .mode-toggle {
    display: flex;
    gap: 8px;
  }

  .mode-toggle button.active {
    color: #fff;
    background: #171717;
    border-color: #171717;
  }

  .stage {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .canvas {
    position: relative;
    width: 100%;
    max-width: 600px;
    height: 400px;
    overflow: hidden;
    border: 1px solid #ccc;
    border-radius: 8px;
  }

  .sensor {
    position: absolute;
    top: 50%;
    left: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 150px;
    height: 150px;
    font-weight: 500;
    color: #374151;
    background: #f3f4f6;
    border: 2px dashed #d1d5db;
    border-radius: 12px;
    transform: translate(-50%, -50%);
    transition: all 0.2s;
  }

  .sensor.active {
    color: #065f46;
    background: #d1fae5;
    border-color: #059669;
  }

  .item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    font-weight: bold;
    color: #1e3a8a;
    background: #93c5fd;
    border-radius: 8px;
    transition:
      transform 0.1s,
      box-shadow 0.1s;
  }

  .item.focused {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }

  .item.moving {
    z-index: 50;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    opacity: 0.9;
  }

  .ghost {
    font-size: 80px;
  }

  @media (prefers-reduced-motion: no-preference) {
    .ghost {
      animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
      0%,
      100% {
        transform: translateY(0px) rotate(5deg);
      }
      50% {
        transform: translateY(-30px) rotate(-5deg);
      }
    }
  }

  button {
    padding: 8px 16px;
    font-family: monospace;
    font-size: 13px;
    color: #171717;
    cursor: pointer;
    background: #f5f5f5;
    border: 1px solid #d4d4d4;
    border-radius: 8px;
  }

  button:hover:not(:disabled) {
    background: #e5e5e5;
  }

  button:disabled {
    cursor: default;
    opacity: 0.4;
  }

  button:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }

  .controls {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .suite-selector {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .suite-selector-title {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    color: #171717;
  }

  .suite-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .suite-card {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;
    padding: 14px 16px;
    text-align: left;
  }

  .suite-card-title {
    font-weight: 700;
    color: #171717;
  }

  .suite-card-desc {
    font-size: 12px;
    color: #737373;
  }

  .qa-step {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 20px;
    background: #fafafa;
    border: 1px solid #e2e2e2;
    border-radius: 8px;
  }

  .qa-suite-name {
    font-size: 11px;
    color: #a3a3a3;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .qa-title {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    color: #171717;
  }

  .qa-instruction {
    margin: 0;
    line-height: 1.5;
    color: #404040;
  }

  .qa-trigger {
    align-self: flex-start;
  }

  .qa-checklist {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding-left: 20px;
    margin: 0;
    color: #404040;
  }

  .qa-actions {
    display: flex;
    gap: 8px;
  }

  .qa-next,
  .qa-done-btn {
    align-self: flex-start;
  }

  .log {
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-height: 300px;
    padding: 16px;
    overflow-y: auto;
    background: #f5f5f5;
    border: 1px solid #e2e2e2;
    border-radius: 8px;
  }

  .entry {
    color: #737373;
    white-space: pre;
  }

  .entry:first-child {
    color: #171717;
  }
</style>
