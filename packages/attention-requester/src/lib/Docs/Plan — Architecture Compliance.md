# Plan: Attention Requester — Architecture Compliance Update

Based on the audit of new architecture rules (§8, §10, §11, §12, §13) against the current state of the package.

---

## Current State Summary

| Area | Status |
|------|--------|
| Model state/transitions | Complete — 4 state vars, 4 derived, full lifecycle |
| Controller lifecycle | Complete — dual `$effect`, WAAPI management, interrupt strategies |
| Tests | Comprehensive — 30+ cases organized by spec section (§2–§6) |
| Logging | Minimal — 1 `console.warn` in Controller, no structured logging |
| Dev page | Good — log panel + interactive controls, but no state inspector |
| `prefers-reduced-motion` | **Not implemented** |
| `Animation.id` | **Not used** — whole Animation object stored |
| `size-limit` / `vitest bench` | **Not configured** |

---

## Steps

### Step 1 — `prefers-reduced-motion` (§13) — P0

**What:** When the user has `prefers-reduced-motion: reduce` enabled, the animation should either not run or be drastically simplified (e.g., a single subtle opacity fade instead of bouncing).

**Where to implement:**
- **Model:** Add a `reducedMotion` reactive state (read from `matchMedia`). When active, `request()` either no-ops or switches to a minimal animation.
- **Controller:** Alternatively, the Controller could intercept before calling `el.animate()` and substitute keyframes. The Model approach is cleaner because it keeps the decision in the state layer.

**Design decision needed:** Should reduced-motion completely skip animation, or use a subtle fallback (e.g., opacity pulse)? The architecture says "offer a non-animated alternative" — recommend a subtle opacity pulse as fallback.

%% No futuro irá existir uma "chamada de atenção alternativa", agora nada deve acontecer se está em reduce. %%

**Test Spec update:** Add a §7 section for reduced-motion behavior.

**Estimated scope:** Model + Controller changes, new test cases, spec update.

---

### Step 2 — `size-limit` configuration (§8) — P0

**What:** Add bundle size tracking to prevent accidental size regressions.

**Where:**
- Add `size-limit` and `@size-limit/preset-small-lib` to devDependencies
- Add `.size-limit.json` config targeting the package entry point
- Add `"size"` script to `package.json`

**Scope:** Config-only, no code changes.

---

### Step 3 — Structured logging in Model (§11) — P1

**What:** Add debug-only logs for all state transitions using `import.meta.env.DEV` guard.

**Prefix:** `[AR:Model]`

**Transitions to log:**
- `idle → animating` (on `request()`)
- `animating → idle` (on cycle finished, no loop / cancelled)
- `cancel` requested
- `pause` / `resume`
- `configure` (animation changed)

**Pattern:**
```ts
if (import.meta.env.DEV) console.log("[AR:Model] idle → animating");
```

**Scope:** ~6 log lines in Model methods. No production impact (tree-shaken).

---

### Step 4 — Structured logging in Controller (§11) — P1

**What:** Add debug-only lifecycle logs.

**Prefix:** `[AR:Controller]`

**Events to log:**
- `startCycle` (with animation name if available)
- `interruptResolution applied` (strategy name)
- `destroy`
- Element fallback warning (already exists — standardize prefix to `[AR:Controller]`)

**Scope:** ~4 log lines + prefix update on existing warn.

---

### Step 5 — `Animation.id` on WAAPI objects (§11) — P1

**What:** When creating the WAAPI animation via `el.animate()`, pass an `id` in the options for DevTools identification.

**Where:** Controller's `#startCycle()` method, in the `el.animate(keyframes, options)` call.

**Value:** `id: 'ar-<animation-name>'` (e.g., `'ar-physics-bounce'`).

**Scope:** 1 line change.

---

### Step 6 — State inspector in dev page (§12) — P1

**What:** Add a reactive panel to the dev page showing live model state.

**State to display:**
- `isActive` (boolean)
- `isPaused` (boolean)
- `animation.name` (string)
- `interruptResolution` (strategy + interval if discard)

**Where:** `src/dev/App.svelte` — add a section above or beside the log panel.

**Scope:** ~30 lines of Svelte markup.

---

### Step 7 — Audit existing keyframes for compositor-friendly properties (§8) — P1

**What:** Verify all animation keyframes use only compositor-friendly CSS properties (`transform`, `opacity`). No `top`, `left`, `width`, `height`, `margin`, etc.

**Where:** `src/lib/Animations/` — audit `PhysicsBounce`, `DoubleBounce`, and `defineBounceAnimation`.

**Scope:** Audit only — fix if violations found.

---

### Step 8 — Animation doesn't block interaction (§13) — P1

**What:** Verify that no element is disabled, has `pointer-events: none`, or otherwise blocks interaction during animation.

**Scope:** Audit only — the current implementation doesn't appear to block interaction, but confirm.

---

### Step 9 — Audit flash rate < 3Hz (§13) — P1

**What:** Verify no animation produces flashing content faster than 3 times per second.

**Where:** Check keyframe timing in `PhysicsBounce` and `DoubleBounce`.

**Scope:** Audit only.

---

### Step 10 — `vitest bench` for Model (§8) — P2

**What:** Add benchmark tests measuring Model operation throughput.

**Benchmarks:**
- `request()` → `onCycleFinished()` cycle (throughput)
- `pause()` / `resume()` round-trip
- `configure()` with animation swap

**Where:** New file `src/lib/__tests__/AttentionRequesterModel.bench.ts`.

**Scope:** New file + script in package.json.

---

### Step 11 — `performance.mark()` instrumentation (§11) — P2

**What:** Add performance marks for key events behind `import.meta.env.DEV`.

**Marks:**
- `ar:cycle-start`
- `ar:cycle-end`
- `ar:interrupt-resolution`

**Scope:** ~3 lines in Controller.

---

### Step 12 — Pure function extraction (§10) — P2

**What:** Identify and extract pure logic from Model/Controller into testable utils.

**Candidates:**
- Interrupt resolution decision logic (given state → strategy)
- Keyframe computation helpers (already partially extracted in Animations)

**Scope:** Refactor + new test file if extracted.

---

### Step 13 — Run 5-step a11y process (§13) — P2

**What:** Execute the full accessibility audit on the dev page:
1. axe-core automated scan
2. Keyboard navigation test
3. VoiceOver screen reader test
4. `prefers-reduced-motion` verification (after Step 1)
5. Visual review

**Scope:** Manual process — document results.

%% Os componentes precisam ser auditados, não a dev page. %%

---

## Execution Order

```
P0 (foundation):    Step 1 → Step 2
P1 (high value):    Step 3 → Step 4 → Step 5 → Step 6 → Steps 7-9 (audits)
P2 (continuous):    Step 10 → Step 11 → Step 12 → Step 13
```

Steps 1–2 are prerequisites. Steps 3–6 can be done in any order. Steps 7–9 are quick audits. Steps 10–13 are lower priority improvements.

---

## Items Already Conformant (no action needed)

- ✅ Behavioral Spec exists (§10) %% Checar se ele já é exaustivo o suficiente para cobrir os casos de uso. %%
- ✅ Tests organized by spec section (§10) %% Atualizar testes se Spec for atualizado. %%
- ✅ One test file per Model (§10)
- ✅ No external logging library (§11)
- ✅ `dev:ar` alias in root package.json (§12)
