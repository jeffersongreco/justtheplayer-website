# Memo: Test Granularity — Per-Module vs. Package-Level

## The Question

Should there be individual test suites for each module (Model, Controller, communication between them), so a failing test points directly to the broken layer — or is that over-engineering?

## Short Answer

**Per-module tests for pure-logic modules: yes, do it. Per-module tests for DOM-dependent modules: no — your architecture already solves the diagnostic problem.**

## Analysis

### What you already have works well

The current `AttentionRequesterModel.test.ts` is a textbook example of the right approach: it tests a pure state machine through its public API, covers all transitions and edge cases, and needs zero mocks. If any of these tests fail, you know *exactly* where the bug is — it's in the Model.

### Why Controller tests would be counterproductive

The Controller (`AttentionRequesterController`) depends on:
- `HTMLElement` and DOM children
- Web Animations API (`el.animate()`)
- Svelte 5 `$effect()` reactivity
- `setTimeout` for loop intervals

Testing it in isolation would require mocking all of that. This directly violates the project's Classical TDD (Detroit School) principle — no mocks unless absolutely necessary. And mocking WAAPI + `$effect` isn't "necessary," it's papering over the fact that the Controller is fundamentally a DOM orchestrator. That's what manual testing checklists are for.

### The MV separation is already your diagnostic tool

This is the key insight people miss about well-separated architectures: **the architecture itself provides fault isolation**.

If Model tests pass but the animation behaves incorrectly:
- The bug is in the Controller (wrong WAAPI usage, timing, DOM targeting) or the View (wrong binding, wrong element structure).
- You don't need a Controller test suite to know this — you already know it by elimination.

If Model tests fail:
- The bug is in the state machine logic. The test name tells you which transition broke.

Adding Controller unit tests would mostly test that "mocked DOM calls were called in the right order" — which tells you nothing about whether the animation actually *works*. That's the classic mock trap.

### Where more granular tests *would* help

If the package grows to have multiple pure-logic modules (e.g., a separate animation resolver, a timing calculator, a queue manager), each should get its own test file. The rule is simple:

> **If it's pure logic (no DOM, no framework, no side effects) → automated unit test per module.**
> **If it touches the DOM or framework runtime → manual testing checklist.**

### Communication / integration tests?

Testing Model ↔ Controller communication is essentially an integration test that needs a real DOM + real Svelte runtime. This falls squarely into "UI test" territory per the project's own testing rules → manual checklist, not automated.

If you find yourself wanting to test that "when Model transitions to active, Controller starts the animation," ask: *what would the test actually assert?* It would need to observe a real `Animation` object on a real DOM element — at that point you're not unit testing, you're running the app. Better to codify that as a manual test step.

## Blind Spots & Things to Consider

1. **The real risk isn't missing Controller tests — it's missing Model coverage.** The Model is the single source of truth. If it has gaps (untested edge cases, missing invariants), no amount of Controller testing will save you. Invest in exhaustive Model specs first. %% Colocar isso como regra na arquitetura, o Spec de comportamento deve ser exaustivo para que tanto os testes como o Model em si sejam implementados sem gaps. %%

2. **As you add more packages under MV architecture, the "test the Model, manually verify the rest" pattern should scale.** But watch for a category of bugs that neither catches: **timing and ordering issues** where the Model state is correct but the Controller applies it at the wrong moment. These are inherently hard to test automatically and are best caught with careful manual QA + console logging.

3. **One thing you might be undervaluing:** the existing test file already names its sections after spec sections (§2.1, §2.2, etc.). This is extremely powerful for diagnostics — a failure in `§2.3 Cancellation` tells you exactly which behavioral contract broke. This is arguably *better* localization than having separate files per module, because it maps to *behavior* rather than *implementation*. %% Documentar isso também, manter os testes organizados por seção do Spec é uma prática recomendada para facilitar a manutenção e o diagnóstico. %%

4. **If the codebase eventually has shared utilities between packages** (e.g., a common state machine base class, shared animation helpers), those become prime candidates for their own test suites. But don't create them preemptively.

## Recommendation

| Module Type | Test Strategy | Rationale |
|---|---|---|
| Model (pure state) | Automated unit tests, one file per Model | Pure logic, no dependencies, fast, precise |
| Controller (DOM orchestrator) | Manual testing checklist | DOM + framework dependent, mocks would be brittle and misleading |
| View (Svelte component) | Manual testing checklist | Same as Controller |
| Model ↔ Controller integration | Manual testing checklist + console logging | Needs real runtime; automated version would be an E2E test |
| Shared pure utilities | Automated unit tests | Same logic as Model |

**Bottom line:** You're not under-testing — you're testing the right thing (the Model) at the right granularity. Adding Controller tests would feel productive but would mostly generate maintenance burden and false confidence. The architecture gives you fault isolation for free; trust it.
