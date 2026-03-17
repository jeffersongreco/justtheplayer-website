# UI Testing Research for Animation & Interaction Libraries

Research conducted March 2026. Focused on automated testing of WAAPI animations, drag-and-drop, and visual effects.

---

## 1. Animation Testing (WAAPI)

### What works
- **State machine testing (started/paused/finished):** Fully automatable. WAAPI's `Animation` object exposes `.playState`, `.currentTime`, `.finished` promise. You can assert these in unit tests without a browser.
- **Computed style assertions in Playwright:** Use `page.waitForFunction()` with `getComputedStyle()` to verify CSS property values mid-animation (e.g., `opacity > 0.99`). Works well for fade, slide, scale.
- **Disabling animations for screenshots:** Playwright's `toHaveScreenshot({ animations: 'disabled' })` fast-forwards finite animations to their end state and cancels infinite ones.

### What doesn't work well
- **Testing that a bounce "looks like a bounce"**: No automated tool can verify aesthetic quality. You can only verify keyframe values, timing, and final state — not whether the easing curve "feels" right.
- **Sub-pixel rendering:** Computed values during animation are interpolated by the browser and vary across OS/GPU. Exact pixel assertions are brittle.
- **jsdom limitations:** WAAPI is not implemented in jsdom. Any WAAPI test that touches actual animation objects needs a real browser (Playwright, Vitest Browser Mode, or Storybook test runner).

### Practical approach
```
// Playwright: verify animation reached end state
await page.waitForFunction(() => {
  const el = document.querySelector('.bounce-target');
  return parseFloat(getComputedStyle(el).opacity) > 0.99;
});

// Playwright: verify transform at end
await expect(locator).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
```

---

## 2. Drag-and-Drop Testing

### Playwright capabilities
- **`locator.dragTo(target)`**: Simulates hover → mousedown → mousemove → mouseup sequence. Works for simple drag scenarios.
- **Manual mouse control**: `mouse.down()`, `mouse.move(x, y, { steps: 10 })`, `mouse.up()` — needed for testing collision detection, boundary constraints, incremental position updates.
- **Important limitation**: Playwright's mouse API fires mouse events only, NOT pointer events. If your drag implementation listens to `pointermove`/`pointerdown`, you may need workarounds.

### Known gaps
- **HTML5 Drag API vs. pointer events**: Many modern libraries (including dnd-kit) use pointer events, not the HTML5 drag API. Playwright doesn't natively dispatch pointer events through its mouse API — you may need `page.dispatchEvent()`.
- **Framework-specific handlers**: React/Svelte libraries that use synthetic event systems or custom drag handlers often don't respond correctly to Playwright's built-in `dragTo()`.
- **Touch events**: Playwright's touch simulation is limited. For mobile drag testing, real device testing or careful `touchstart`/`touchmove`/`touchend` dispatch is needed.
- **Multiple mouse moves required**: Some frameworks need at least 2 `mousemove` events to trigger `dragover`. Single-step drags often fail silently.

### What dnd-kit does
dnd-kit uses **Cypress E2E tests running against Storybook**. No separate dev server needed for CI — Storybook serves as both documentation and test harness.

---

## 3. Visual Regression Testing

### Tool comparison

| Tool | Approach | Free tier | Paid starts at | Animation handling | False positive strategy |
|------|----------|-----------|----------------|-------------------|------------------------|
| **Playwright built-in** | `toHaveScreenshot()` | Free (OSS) | N/A | `animations: 'disabled'` fast-forwards to end | Pixel threshold config; OS-dependent baselines are a pain |
| **Chromatic** | Storybook-native | 5,000 snapshots/mo | $179/mo | Pauses CSS/SVG animations at last frame by default; JS animations need `play()` to settle | Smart diffing, TurboSnap (only re-tests changed stories) |
| **Percy** | Cross-browser, page-level | 5,000 snapshots/mo | ~$199/mo | Requires manual stabilization or `percy-specific-snapshot-stabilization` | AI Review Agent (2025) reduces false positives by 40%; OCR for text shifts |
| **Applitools** | AI-powered "Visual AI" | Trial only | ~$969/mo | Configurable wait before capture | AI classifies diffs as layout/content/color; highest accuracy but most expensive |
| **Lost Pixel** | OSS, self-hostable | Free (OSS) | N/A | Manual stabilization | Pixel threshold; no AI |

### Key considerations
- **OS dependency problem**: Playwright screenshots taken on macOS differ from Linux CI. You must either generate baselines in CI or use Docker locally to match CI environments.
- **CI time cost**: Chromatic/Percy add 2-10 minutes per PR depending on snapshot count. Applitools is similar. Playwright local screenshots are faster but require consistent environments.
- **Animation timing for screenshots**: All tools recommend either (a) disabling animations before capture, or (b) waiting for animations to complete. Chromatic does this automatically for CSS animations. For JS/WAAPI animations, you need to ensure animations settle before capture.

### Chromatic animation handling (detailed)
- CSS animations: paused at last frame by default (`pauseAnimationAtEnd: true`)
- CSS transitions: paused
- SVG animations (SMIL): paused
- Videos: paused at frame 0
- JS/WAAPI animations: **NOT automatically paused** — you must use Storybook's `play()` function to trigger and wait for them, or use `chromatic.delay` to add wait time
- GIF animations: cannot be paused (use `chromatic.pauseAnimationAtEnd: false` and accept potential flakiness, or replace with static images in test stories)

---

## 4. Playwright Component Testing

### Current state (2025-2026)
- Still marked **experimental** (`@playwright/experimental-ct-svelte`)
- Svelte support exists but is not actively promoted by either Playwright or Svelte teams
- Works by running components in a real browser while test logic runs in Node.js

### Recommended alternative: Vitest Browser Mode
- **Official Svelte recommendation** as of Svelte 5 docs
- `vitest-browser-svelte` package (requires Vitest 4.0+)
- Runs tests in a real browser via Playwright or WebDriverIO under the hood
- Full support for Svelte 5 runes, reactive state, real DOM, real CSS, real layout
- Automatic assertion retries even across component re-renders
- Has access to real browser APIs (ResizeObserver, IntersectionObserver, WAAPI) that jsdom lacks

### Verdict
For this project, **Vitest Browser Mode** is the better path than Playwright experimental component testing. It's more mature for Svelte 5 and officially supported.

---

## 5. Testing Pyramid for UI-Heavy Libraries

### Industry consensus

```
                    /  Manual QA  \          ← Aesthetics, "feel", UX
                   / Visual Regr.  \         ← Layout, rendering, cross-browser
                  /  Integration    \        ← Component interactions, event flows
                 /   Unit Tests      \       ← State machines, models, pure logic
                /____________________\
```

- **Unit tests (largest layer)**: Test the Model/Controller logic — state machines, computed values, animation config resolution, boundary calculations. These are fast, deterministic, and high-value.
- **Integration tests (medium layer)**: Test that the Model drives the View correctly — e.g., when model says "animating", the component applies the right class/style. Vitest Browser Mode is ideal here.
- **Visual regression (thin layer)**: Catch rendering regressions across PRs. Use Chromatic or Playwright screenshots for critical stories. Keep the number of visual test stories small.
- **Manual QA (thin layer)**: Essential for animation "feel", timing aesthetics, drag UX smoothness. Cannot be automated. Use a testing checklist with logging output.

### Key insight
The testing pyramid INVERTS the intuition for animation libraries. Most people think "it's visual, so we need visual tests." In reality:
- 70% of bugs are in **logic** (wrong state transitions, incorrect config merging, race conditions) — caught by unit tests
- 20% are in **integration** (model state not reflected in DOM correctly) — caught by browser integration tests
- 10% are **visual** (wrong easing, off-by-one-pixel, cross-browser rendering) — caught by visual regression + manual QA

---

## 6. AI-Powered Visual Testing

### Current landscape (2025-2026)
- **Applitools Visual AI**: Most mature. Uses trained CV models to classify diffs (layout shift vs. content change vs. rendering noise). High accuracy, but expensive ($969+/mo).
- **Percy AI Review Agent** (launched late 2025): Draws bounding boxes around meaningful changes, provides human-readable summaries. Claims 3x faster review, 40% fewer false positives to review.
- **CloudQA AI agents**: Autonomous agents that understand UI aesthetics — can flag accessibility issues, contrast failures, brand guideline violations.
- **Vision Language Models (VLMs)**: Emerging approach where LLMs with vision capabilities (GPT-4V, Claude) evaluate screenshots. Still experimental for CI — primarily used for occasional audits.

### Practical assessment
- **For CI**: Applitools and Percy's AI features are practical today. They run within existing visual regression pipelines and add AI as a filter layer.
- **For VLM-based testing**: Token costs are still too high for per-commit CI ($0.01-0.05 per screenshot analysis with GPT-4V). More practical for weekly/release audits or when investigating specific regressions.
- **Accuracy**: AI-powered tools dramatically reduce false positives from anti-aliasing, font rendering, and sub-pixel differences. This is their primary value.

---

## 7. Storybook + Interaction Testing

### How play() works
1. Story renders the component with initial props
2. `play()` function runs after render — uses Testing Library's `userEvent` API to simulate clicks, drags, typing
3. Assertions run inside `play()` using `@storybook/test` (Jest-compatible `expect`)
4. Test runner (Jest + Playwright) executes all stories' play functions in parallel

### Viability for animation/drag testing
- **Animations**: You can trigger animations in `play()` and assert final state. But you cannot easily assert mid-animation values because `play()` runs in the browser and Testing Library doesn't have built-in animation-aware waiters.
- **Drag**: Testing Library's `userEvent` supports drag simulation, but it fires synthetic events that may not match real pointer event sequences. Complex drag scenarios (collision detection, boundaries) are unreliable.
- **Best use**: Storybook interaction tests are best for **component state testing** (click → state changes → UI updates) rather than **animation/drag behavior testing**.

### Storybook + Chromatic combo
The real power is combining:
- `play()` to set up component state (e.g., trigger animation, then wait for it to finish)
- Chromatic to snapshot the result visually
- This gives you automated visual regression testing of post-animation states

---

## 8. Specific Testing Challenges

### Timing-dependent behavior (300ms animations)
- **Don't use `setTimeout`/`sleep` in tests** — flaky and slow
- **Playwright**: Use `waitForFunction()` polling computed styles, or `animation.finished` promise via `page.evaluate()`
- **Vitest Browser Mode**: Can directly access WAAPI's `animation.finished` promise
- **Chromatic**: Automatically pauses CSS animations; for JS animations, use `chromatic.delay` (milliseconds to wait before snapshot)

### Sub-pixel rendering differences
- Different GPU, OS, and browser versions render anti-aliasing and sub-pixel text differently
- **Playwright screenshots**: Use `maxDiffPixelRatio` or `maxDiffPixels` threshold (e.g., `toHaveScreenshot({ maxDiffPixelRatio: 0.01 })`)
- **Chromatic/Percy**: Handle this internally with smart diffing algorithms
- **Best practice**: Generate baselines in the same environment as CI (Docker containers)

### Drag with collision detection and boundaries
- Requires step-by-step mouse moves: `mouse.move(x, y, { steps: 20 })` to generate enough events for collision detection to fire
- Test boundary constraints by attempting to drag past bounds and asserting element stays within
- Test collision by dragging into occupied space and asserting rejection/snap-back behavior
- These tests are inherently integration-level — they need real DOM layout

### CSS transforms and computed styles during animation
- `getComputedStyle()` returns the **animated value** during WAAPI animations (not the base style)
- For transforms, the computed value is a `matrix()` or `matrix3d()` string — you need to parse it
- `element.getAnimations()` returns active Animation objects with `.currentTime`, `.playState`, `.effect.getComputedTiming()`
- Playwright can access these via `page.evaluate()` — this is the most reliable way to inspect animation state

---

## 9. What Well-Known Libraries Actually Do

### Framer Motion / Motion
- **Test approach**: Extensive automated tests using Jest + React Testing Library in jsdom
- **Animation testing**: Tests assert on rendered output and callback invocations, NOT on visual animation quality
- **Key limitation**: jsdom doesn't implement WAAPI, so motion components are effectively tested with animations mocked/instant. The team relies on visual inspection for animation aesthetics.
- **Community pain**: Open issue #1690 requesting official mocks — the library doesn't provide them. Users must write brittle custom mocks.
- **No visual regression tests** in the public repo

### GSAP
- **GSAP's own team admits**: "I've never seen any good [automated test suites] for animation. It's a completely different beast than typical JavaScript where you can just test the input/output of various methods. Animation involves sooooo many other factors, browser differences, etc."
- **Internal testing**: GSAP has internal tests for their engine (timing accuracy, property interpolation) but these are unit tests on the animation math, not visual tests
- **User-side**: No official testing utilities or mocks provided

### dnd-kit
- **Cypress E2E tests** running against Storybook stories
- Tests real drag interactions in a real browser
- No unit tests for drag behavior (it's inherently DOM-dependent)
- Storybook serves double duty: documentation + test harness

### @use-gesture
- Unit tests for gesture state machine logic (velocity, direction, movement calculations)
- Integration tests that simulate event sequences
- No visual regression tests

### SortableJS
- Minimal automated tests
- Relies heavily on manual testing and community bug reports
- Has Cypress tests for basic sort operations

---

## 10. Recommendations for This Project

Based on this research, here's what makes sense for the Attention Requester and Movable packages:

### Already doing right
- Classical TDD on the Model layer (unit tests for state machines, config resolution)
- Manual testing checklists for UI behavior
- Logging/console output for manual testers

### Worth adding (ordered by ROI)

1. **Vitest Browser Mode tests** for integration testing
   - Test that Model state changes produce correct DOM effects
   - Can use real WAAPI to verify animation.playState, animation.finished
   - Can use real mouse events for basic drag testing
   - Replaces jsdom limitations without full E2E overhead

2. **Storybook stories** as living documentation + test harness
   - Each animation variant gets a story
   - Each drag scenario gets a story
   - `play()` functions for basic interaction testing
   - These stories become the basis for visual regression if you later add Chromatic

3. **Playwright E2E tests** for critical paths only
   - Test the full bounce animation lifecycle (trigger → animating → finished)
   - Test drag boundaries and collision detection with step-by-step mouse moves
   - Keep these few and focused — they're slow

4. **Visual regression** (optional, add later)
   - Free tier of Chromatic (5,000 snapshots/mo) or Playwright screenshots in CI
   - Only for the most critical visual states (resting, mid-animation, post-animation)
   - Requires consistent CI environment (Docker)

### Not worth doing
- Testing animation aesthetics automatically (how a bounce "looks")
- Per-pixel assertions on mid-animation frames
- AI visual testing (cost not justified for a small library)
- Mocking WAAPI in jsdom (fragile, incomplete — just use Vitest Browser Mode)
