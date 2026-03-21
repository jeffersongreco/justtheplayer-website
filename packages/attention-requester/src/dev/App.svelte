<script lang="ts">
  import { onMount, untrack } from "svelte";
  import type { AttentionRequester as AttentionRequesterType } from "../lib";
  import { AttentionRequester, DoubleBounce, PhysicsBounce } from "../lib";
  import type { QAStep, QASuite } from "./qa-types.js";

  let attentionDiscard: AttentionRequesterType;
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

  let pausedDiscard = $state(false);
  let pausedResume = $state(false);
  let discardAnimating = $state(false);
  let resumeAnimating = $state(false);
  let reducedMotion = $state(false);
  let log = $state<string[]>([]);

  // Guided QA state
  let mode = $state<"free" | "guided">("free");
  let selectedSuiteIndex = $state<number | null>(null);
  let currentStep = $state(0);
  let triggerFired = $state(false);

  $effect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion = mql.matches;
    const onChange = (e: MediaQueryListEvent) => {
      reducedMotion = e.matches;
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  });

  function addLog(msg: string) {
    const time = performance.now().toFixed(1);
    log = [`[${time}ms] ${msg}`, ...log].slice(0, 30);
  }

  function qaLog(n: number, event: string) {
    const msg = `[AR][step:${n}] ${event}`;
    addLog(msg);
    console.log(msg);
  }

  const suites: QASuite[] = [
    {
      id: "component",
      title: "Component lifecycle",
      description:
        "Tests request, pause, resume, and cancel on a single element (left stage).",
      stages: ["discard"],
      steps: [
        {
          title: "Step 1 of 5: Initial state",
          instruction:
            "Verify the left element is visible and at rest, with no animation running.",
          trigger: () => qaLog(1, "state: idle"),
          expectedLogs: ["[AR][step:1] state: idle"],
          humanChecklist: [
            "Element is fully visible",
            "No animation is running",
            "Element is in its resting position",
          ],
        },
        {
          title: "Step 2 of 5: Request animation",
          instruction:
            "Tap the button to start animation on the left element, then verify it bounces.",
          triggerLabel: "Start animation",
          trigger: () => {
            qaLog(2, "request() called");
            attentionDiscard.request(animationDiscard);
          },
          expectedLogs: ["[AR][step:2] request() called"],
          humanChecklist: [
            "Element is bouncing",
            "Motion is smooth — no jank or stutter",
            "Animation: PhysicsBounce (up, discard)",
          ],
        },
        {
          title: "Step 3 of 5: Pause",
          instruction:
            "Tap Pause and verify the left element freezes mid-animation.",
          triggerLabel: "Pause",
          trigger: () => {
            qaLog(3, "paused = true");
            pausedDiscard = true;
          },
          expectedLogs: ["[AR][step:3] paused = true"],
          humanChecklist: [
            "Element is frozen in place",
            "No movement visible while paused",
          ],
        },
        {
          title: "Step 4 of 5: Resume",
          instruction:
            "Tap Resume and verify the left element continues from where it paused.",
          triggerLabel: "Resume",
          trigger: () => {
            qaLog(4, "paused = false");
            pausedDiscard = false;
          },
          expectedLogs: ["[AR][step:4] paused = false"],
          humanChecklist: [
            "Element resumes bouncing from its paused position",
            "No jump or stutter on resume",
          ],
        },
        {
          title: "Step 5 of 5: Cancel",
          instruction:
            "Tap Cancel and verify the element completes its current cycle, then stops.",
          triggerLabel: "Cancel",
          trigger: () => {
            qaLog(5, "cancel() called");
            attentionDiscard.cancel();
          },
          expectedLogs: ["[AR][step:5] cancel() called"],
          humanChecklist: [
            "Element completes current animation cycle, then returns to idle",
          ],
        },
      ],
    },
    {
      id: "interrupt",
      title: "Interrupt strategies",
      description:
        "Compares discard vs resume interrupt behavior when cancel is called mid-animation.",
      stages: ["discard", "resume"],
      steps: [
        {
          title: "Step 1 of 2: Start both animations",
          instruction:
            "Tap to start both elements bouncing, then observe the difference in animation style.",
          triggerLabel: "Start both",
          trigger: () => {
            qaLog(1, "request() on both");
            attentionDiscard.request(animationDiscard);
            attentionResume.request(animationResume);
          },
          expectedLogs: ["[AR][step:1] request() on both"],
          humanChecklist: [
            "Both elements are bouncing",
            "Left: PhysicsBounce (discard) · Right: DoubleBounce (resume)",
            "Motion is smooth on both",
          ],
        },
        {
          title: "Step 2 of 2: Cancel",
          instruction:
            "Tap Cancel. Both elements complete their current cycle, then stop (graceful cancellation).",
          triggerLabel: "Cancel",
          trigger: () => {
            qaLog(2, "cancel() on both");
            attentionDiscard.cancel();
            attentionResume.cancel();
          },
          expectedLogs: ["[AR][step:2] cancel() on both"],
          humanChecklist: [
            "Both elements complete current animation cycle before stopping",
            "No abrupt interruption — animation finishes naturally",
          ],
        },
      ],
    },
    {
      id: "keyboard-focus",
      title: "Keyboard & Focus",
      description:
        "Verifies keyboard navigation, focus visibility, and interactivity during animation (a11y sections 2 + 5).",
      stages: ["discard"],
      steps: [
        {
          title: "Step 1 of 5: Tab through target content",
          instruction:
            "Press Tab repeatedly to move focus through the interactive elements inside the left target card.",
          expectedLogs: [
            "[a11y:discard] focus → button",
            "[a11y:discard] focus → link",
          ],
          humanChecklist: [
            "Focus ring visible on button, then on link",
            "Tab order matches DOM order (button → link)",
          ],
        },
        {
          title: "Step 2 of 5: Start animation and re-tab",
          instruction:
            "Tap the button below to start the animation, then Tab through the target content again.",
          triggerLabel: "Start animation",
          trigger: () => {
            qaLog(2, "request() called");
            attentionDiscard.request(animationDiscard);
          },
          expectedLogs: [
            "[AR][step:2] request() called",
            "[a11y:discard] focus → button",
          ],
          humanChecklist: [
            "Focus ring still visible on button and link during animation",
            "Tab order not disrupted by the animation",
          ],
        },
        {
          title: "Step 3 of 5: Click button during animation",
          instruction:
            "While the element is animating, click the 'Click me' button inside the target card.",
          expectedLogs: ["[a11y:discard] button clicked"],
          humanChecklist: [
            "Button responds to click during animation",
            "No focus trap — Tab moves past the target normally",
          ],
        },
        {
          title: "Step 4 of 5: Click link during animation",
          instruction:
            "While the element is still animating, click the 'Sample link' inside the target card.",
          expectedLogs: ["[a11y:discard] link clicked"],
          humanChecklist: [
            "Link responds to click during animation",
            "Content is not obscured by the animation",
          ],
        },
        {
          title: "Step 5 of 5: Cancel and verify content",
          instruction:
            "Tap Cancel and verify the content is fully accessible after the animation stops.",
          triggerLabel: "Cancel",
          trigger: () => {
            qaLog(5, "cancel() called");
            attentionDiscard.cancel();
          },
          expectedLogs: ["[AR][step:5] cancel() called"],
          humanChecklist: [
            "Content fully readable after animation stops",
            "No layout shift occurred",
            "Element still interactive (button + link clickable)",
          ],
        },
      ],
    },
    {
      id: "screen-reader",
      title: "Screen Reader (VoiceOver)",
      description:
        "Verifies VoiceOver announces content correctly and animation causes no spurious announcements (a11y section 3).",
      stages: ["discard"],
      steps: [
        {
          title: "Step 1 of 5: Enable VoiceOver",
          instruction: "Press Cmd+F5 to enable VoiceOver.",
          expectedLogs: [],
          humanChecklist: [
            "VoiceOver is active (you hear the VoiceOver cursor)",
          ],
        },
        {
          title: "Step 2 of 5: Navigate to target content",
          instruction:
            "Use VO+Right Arrow to navigate to the animated target area. Move through the button and link inside it.",
          expectedLogs: [],
          humanChecklist: [
            "VoiceOver announces 'Click me, button'",
            "VoiceOver announces 'Sample link, link'",
            "Content text 'Content text' is announced",
          ],
        },
        {
          title: "Step 3 of 5: Start animation and re-navigate",
          instruction:
            "Tap the button below to start the animation, then navigate through the target content again with VoiceOver.",
          triggerLabel: "Start animation",
          trigger: () => {
            qaLog(3, "request() called");
            attentionDiscard.request(animationDiscard);
          },
          expectedLogs: ["[AR][step:3] request() called"],
          humanChecklist: [
            "No spurious announcements caused by the animation",
            "Button and link are still announced correctly",
            "Content text still readable by VoiceOver",
          ],
        },
        {
          title: "Step 4 of 5: Cancel and verify",
          instruction: "Tap Cancel and navigate through the target again.",
          triggerLabel: "Cancel",
          trigger: () => {
            qaLog(4, "cancel() called");
            attentionDiscard.cancel();
          },
          expectedLogs: ["[AR][step:4] cancel() called"],
          humanChecklist: [
            "No spurious announcements on animation stop",
            "Content still announced correctly",
          ],
        },
        {
          title: "Step 5 of 5: Disable VoiceOver",
          instruction: "Press Cmd+F5 to disable VoiceOver.",
          expectedLogs: [],
          humanChecklist: ["VoiceOver is off"],
        },
      ],
    },
    {
      id: "reduced-motion",
      title: "Reduced Motion",
      description:
        "Verifies prefers-reduced-motion is respected: suppression, dynamic toggle, and mid-animation resilience (a11y section 4).",
      stages: ["discard", "resume"],
      steps: [
        {
          title: "Step 1 of 6: Check current setting",
          instruction:
            "Verify the inspector shows the current prefers-reduced-motion value.",
          trigger: () => qaLog(1, `reducedMotion: ${reducedMotion}`),
          expectedLogs: ["[AR][step:1] reducedMotion:"],
          humanChecklist: [
            "Inspector shows the correct reducedMotion value for your system setting",
          ],
        },
        {
          title: "Step 2 of 6: Enable reduced motion",
          instruction:
            "Open DevTools → Rendering tab → set 'Emulate CSS media feature prefers-reduced-motion' to 'reduce'.",
          expectedLogs: [],
          humanChecklist: [
            "Inspector updates to reducedMotion: true without page reload",
          ],
        },
        {
          title: "Step 3 of 6: Request animation (should be suppressed)",
          instruction: "Tap the button below. Neither element should animate.",
          triggerLabel: "Request animation",
          trigger: () => {
            qaLog(3, "request() on both");
            attentionDiscard.request(animationDiscard);
            attentionResume.request(animationResume);
          },
          expectedLogs: ["[AR][step:3] request() on both"],
          humanChecklist: [
            "Neither element animates",
            "Both inspectors show isAnimating: false",
          ],
        },
        {
          title: "Step 4 of 6: Disable reduced motion",
          instruction:
            "In DevTools → Rendering, remove the prefers-reduced-motion emulation (set to 'No emulation').",
          expectedLogs: [],
          humanChecklist: [
            "Inspector updates to reducedMotion: false without page reload",
          ],
        },
        {
          title: "Step 5 of 6: Request animation (should work)",
          instruction:
            "Tap the button below. Both elements should animate normally.",
          triggerLabel: "Request animation",
          trigger: () => {
            qaLog(5, "request() on both");
            attentionDiscard.request(animationDiscard);
            attentionResume.request(animationResume);
          },
          expectedLogs: ["[AR][step:5] request() on both"],
          humanChecklist: ["Both elements animate normally"],
        },
        {
          title: "Step 6 of 6: Mid-animation toggle",
          instruction:
            "While both elements are animating, re-enable reduced motion in DevTools (Rendering → prefers-reduced-motion: reduce).",
          expectedLogs: [],
          humanChecklist: [
            "Running animation is NOT interrupted mid-cycle — current cycle completes",
            "After current cycle finishes, loop does NOT continue (elements return to idle)",
            "Inspector updates to reducedMotion: true",
          ],
        },
      ],
    },
  ];

  const suite = $derived(
    selectedSuiteIndex === null ? null : suites[selectedSuiteIndex]
  );
  const step = $derived(suite ? suite.steps[currentStep] : null);
  const activeStages = $derived(
    mode === "guided" && suite !== null ? suite.stages : []
  );

  function startGuidedMode() {
    pausedDiscard = false;
    pausedResume = false;
    attentionDiscard.cancel();
    attentionResume.cancel();
    log = [];
    selectedSuiteIndex = null;
    currentStep = 0;
    triggerFired = false;
    mode = "guided";
  }

  function selectSuite(index: number) {
    pausedDiscard = false;
    pausedResume = false;
    attentionDiscard.cancel();
    attentionResume.cancel();
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

  <div class="stages">
    <div class="stage" class:stage-active={activeStages.includes("discard")}>
      <span class="stage-label">discard</span>
      <div class="stage-area">
        <AttentionRequester bind:this={attentionDiscard} paused={pausedDiscard}>
          {#snippet children({ isAnimating })}
            {(discardAnimating = isAnimating, '')}
            <div class="target">
              <button
                type="button"
                onclick={() => addLog("[a11y:discard] button clicked")}
                onfocusin={() => addLog("[a11y:discard] focus → button")}
              >
                Click me
              </button>
              <a
                href="#noop"
                onclick={(e) => { e.preventDefault(); addLog("[a11y:discard] link clicked"); }}
                onfocusin={() => addLog("[a11y:discard] focus → link")}
              >
                Sample link
              </a>
              <span>Content text</span>
            </div>
          {/snippet}
        </AttentionRequester>
      </div>
      <div class="inspector">
        <span class="inspector-title">discard — state</span>
        <div class="inspector-row">
          <span>isAnimating</span><span class="val">{discardAnimating}</span>
        </div>
        <div class="inspector-row">
          <span>isPaused</span><span class="val">{pausedDiscard}</span>
        </div>
        <div class="inspector-row">
          <span>animation</span><span class="val">{animationDiscard.name}</span>
        </div>
        <div class="inspector-row">
          <span>interrupt</span
          ><span class="val">discard ({animationDiscard.interval}ms)</span>
        </div>
        <div class="inspector-row">
          <span>reducedMotion</span><span class="val">{reducedMotion}</span>
        </div>
      </div>
    </div>

    <div class="stage" class:stage-active={activeStages.includes("resume")}>
      <span class="stage-label">resume</span>
      <div class="stage-area">
        <AttentionRequester bind:this={attentionResume} paused={pausedResume}>
          {#snippet children({ isAnimating })}
            {(resumeAnimating = isAnimating, '')}
            <div class="target">
              <button
                type="button"
                onclick={() => addLog("[a11y:resume] button clicked")}
                onfocusin={() => addLog("[a11y:resume] focus → button")}
              >
                Click me
              </button>
              <a
                href="#noop"
                onclick={(e) => { e.preventDefault(); addLog("[a11y:resume] link clicked"); }}
                onfocusin={() => addLog("[a11y:resume] focus → link")}
              >
                Sample link
              </a>
              <span>Content text</span>
            </div>
          {/snippet}
        </AttentionRequester>
      </div>
      <div class="inspector">
        <span class="inspector-title">resume — state</span>
        <div class="inspector-row">
          <span>isAnimating</span><span class="val">{resumeAnimating}</span>
        </div>
        <div class="inspector-row">
          <span>isPaused</span><span class="val">{pausedResume}</span>
        </div>
        <div class="inspector-row">
          <span>animation</span><span class="val">{animationResume.name}</span>
        </div>
        <div class="inspector-row">
          <span>interrupt</span><span class="val">resume</span>
        </div>
        <div class="inspector-row">
          <span>reducedMotion</span><span class="val">{reducedMotion}</span>
        </div>
      </div>
    </div>
  </div>

  {#if mode === "free"}
    <div class="controls">
      <button
        type="button"
        onclick={() => {
          addLog("▶ request() on both");
          attentionDiscard.request(animationDiscard);
          attentionResume.request(animationResume);
        }}
      >
        request()
      </button>

      <button
        type="button"
        onclick={() => {
          const next = !pausedDiscard;
          pausedDiscard = next;
          pausedResume = next;
          addLog(`${next ? "⏸" : "▶"} paused = ${next}`);
        }}
      >
        paused: {pausedDiscard}
      </button>

      <button
        type="button"
        onclick={() => {
          addLog("⏹ cancel() on both");
          attentionDiscard.cancel();
          attentionResume.cancel();
        }}
      >
        cancel()
      </button>

      <button type="button" onclick={() => (log = [])}>clear log</button>
    </div>
  {/if}

  {#if mode === "guided" && selectedSuiteIndex === null}
    <div class="suite-selector">
      <h2 class="suite-selector-title">Select test suite</h2>
      <p class="axe-reminder">
        Automated scan (axe-core) is covered by <code>bun run test</code>. Run
        it before starting manual QA.
      </p>
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
              Next →
            </button>
          {:else}
            <button
              type="button"
              class="qa-done-btn"
              onclick={() => { selectedSuiteIndex = null; }}
            >
              Done ✓ — Back to suites
            </button>
          {/if}
        </div>
      {/if}
    </div>
  {/if}

  <div class="log">
    {#each log as entry, idx (idx)}
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

  .mode-toggle {
    display: flex;
    gap: 8px;
  }

  .mode-toggle button.active {
    color: #fff;
    background: #171717;
    border-color: #171717;
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
    transition: opacity 0.2s;
  }

  .stage:not(.stage-active):has(~ .stage-active),
  .stage-active ~ .stage:not(.stage-active) {
    opacity: 0.35;
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
    padding: 24px;
    border: 1px solid #e2e2e2;
    border-radius: 12px;
  }

  .stage-active .stage-area {
    border-color: #93c5fd;
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

  .target {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px 16px;
    background: #dbeafe;
    border: 1px solid #93c5fd;
    border-radius: 8px;
  }

  .target button,
  .target a {
    font-family: monospace;
    font-size: 12px;
  }

  .target a {
    color: #2563eb;
  }

  .target span {
    font-size: 11px;
    color: #404040;
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
    margin-bottom: 4px;
    font-size: 11px;
    color: #a3a3a3;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .inspector-row {
    display: flex;
    justify-content: space-between;
  }

  .inspector-row span:first-child {
    color: #737373;
  }

  .val {
    font-weight: 600;
    color: #171717;
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

  .axe-reminder {
    padding: 10px 14px;
    margin: 0;
    font-size: 12px;
    line-height: 1.5;
    color: #404040;
    background: #fef9c3;
    border: 1px solid #eab308;
    border-radius: 8px;
  }

  .axe-reminder code {
    padding: 2px 5px;
    font-size: 11px;
    background: #fefce8;
    border-radius: 4px;
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
