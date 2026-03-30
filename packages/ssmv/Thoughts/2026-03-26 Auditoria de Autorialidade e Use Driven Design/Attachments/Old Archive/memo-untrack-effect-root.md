# Memo — `untrack()`, `$effect.root`, and Effect Nesting

> Date: 2026-03-20
> Ref: Svelte 5 official docs (verified via MCP), `Architecture.md` §3–§4

---

## The Question

Three related primitives keep appearing in the codebase and in decisions about the MV architecture: `untrack()`, `$effect.root`, and nested `$effect`. The question is: are these correct tools in context, or are they workarounds for a design that's fighting the reactive model?

Short answer: all three are **legitimate, first-class APIs** — but each one is a sharp edge. Using them correctly requires understanding exactly what problem each one solves and what it signals when you reach for it.

---

## 1. `untrack()`

### What it does

`untrack(fn)` runs `fn` and **prevents any `$state` reads inside it from being recorded as dependencies** of the surrounding `$effect` or `$derived`. The return value is whatever `fn` returns.

```ts
import { untrack } from 'svelte';

$effect(() => {
  // re-runs when `data` changes, NOT when `time` changes
  save(data, {
    timestamp: untrack(() => time)
  });
});
```

### Is it a workaround?

**No — it is the intended API for "read without subscribing".** The docs describe it as the correct tool for this pattern. It is also the documented escape valve when writing to `$state` inside an `$effect` creates an infinite loop (reading and immediately writing the same value).

### When it's correct

- You need a *snapshot* of a value at the moment an effect runs, but changes to that value should not re-trigger the effect.
- You're computing something inside a `$derived` that needs to sample a value without creating a dependency chain.

### When it's a smell

If you find yourself calling `untrack()` on a value that *logically should drive* the computation, that's a signal the reactive graph has been structured wrong. `untrack` is for **breaking a dependency you genuinely don't want**, not for suppressing re-runs you find inconvenient.

A frequent use of `untrack` across the codebase is worth reviewing: each call should have a clear reason why the value intentionally should not be a dependency.

### `untrack` inside `$derived`

This is also valid and documented. Same semantics: reads inside `untrack` don't register as dependencies of the `$derived` computation. Use it when the derived value depends on *some* reactive state but must sample *other* state without recomputing whenever that state changes.

---

## 2. `$effect.root`

### What it does

Creates a **non-tracked scope** that does not auto-cleanup. You get back a `destroy()` function that you must call manually.

```ts
const destroy = $effect.root(() => {
  $effect(() => {
    // reactive work here
  });

  return () => {
    // cleanup logic
  };
});

// at some later point:
destroy();
```

### Key properties

| Property | Behavior |
|---|---|
| Lifetime | **Manual** — does not tie to any component lifecycle |
| Tracking context | Creates a root; nested `$effect` calls are allowed inside it |
| Can be called outside component init | **Yes** — this is one of its primary use cases |
| Auto-cleanup | **No** — you are responsible for calling `destroy()` |

### When it's correct

- You need effects in a **non-component context**: a Model class, a singleton service, a store that lives outside any particular component.
- You need effects to **outlive** the component that created them (or be created before one exists).
- You want **manual control** over when the reactive scope is torn down — e.g., tied to a business lifecycle (session start/end) rather than component mount/unmount.

### The hard edge: lifetime leaks

Because `$effect.root` does not auto-cleanup, forgetting to call `destroy()` is a real leak — subscriptions stay alive, DOM references may be held, the reactive graph keeps running. This is the same class of bug as forgetting to call `removeEventListener`.

In MV architecture, if a Model uses `$effect.root` internally (e.g., to observe other state), the Model's `destroy()` method must call the root's destroy function. This must be treated as a first-class lifecycle obligation, not an afterthought.

### When it's a smell

If `$effect.root` is used to work around a Svelte warning about "effect created outside of component initialization" and the real solution would be to restructure where the effect lives — that's a smell. But if the effect genuinely belongs outside a component (e.g., in a Model), `$effect.root` is the right answer.

---

## 3. Nesting `$effect` Inside Another `$effect`

### Is it allowed?

**Yes, explicitly.** The docs state:

> You can use `$effect` anywhere, not just at the top level of a component, **as long as it is called while a parent effect is running**.

### Lifecycle semantics

The nested effect is **destroyed and re-created every time the parent effect re-runs**. This means:

- The nested effect's teardown function runs before the parent re-runs.
- A fresh nested effect is created after the parent re-runs.

This is logically clean but can be expensive if the parent effect re-runs frequently, because the nested effect is fully reconstructed each time — including any setup work inside it.

### When it's correct

- The nested effect's existence is *conditional* on some state in the parent — it should only run when the parent's reactive dependencies are in a certain state.
- You want to scope a reactive subscription or side-effect to a particular reactive context.

### When it's a smell

If parent and nested effects both re-run on the same dependency and one writes state that triggers the other, you are at risk of an update cycle. The docs explicitly warn against this pattern.

Also: if the nested effect's setup is expensive (e.g., creates DOM listeners, starts animations, allocates resources), and the parent effect re-runs on coarse-grained state changes, you will pay full reconstruction cost on every parent re-run. Prefer narrowing the parent effect's dependencies or pulling the nested effect up to a scope where it can run more stably.

---

## 4. `$effect.tracking()`

Returns `true` inside an effect or template expression, `false` otherwise. Intended for building reactive *primitives and utilities* (like `createSubscriber`) — not for general application code.

**Rule of thumb:** if you find yourself calling `$effect.tracking()` in a Model or Controller, that is almost certainly wrong. It is a tool for library authors, not consumers.

---

## Cross-Cutting Observations for MV Architecture

### Where these primitives belong in the MV layers

| Primitive | View (`.svelte`) | Model (`.svelte.ts`) | Controller |
|---|---|---|---|
| `$effect` | OK — for DOM side effects | Via `$effect.root` only | Via `$effect.root` or template routing |
| `untrack()` | OK when justified | OK when justified | OK when justified |
| `$effect.root` | Rarely needed | Correct for Model-owned reactive work | Correct for Controller-owned reactive work |
| `$effect.tracking()` | Almost never | Never | Never |
| Nested `$effect` | Allowed; watch re-run cost | Allowed inside a root | Allowed inside a root |

### The core tension

Svelte's reactive model rewards writing code *as* state and derivations. `$effect` is explicitly an escape hatch — the docs say so. Every `$effect` in application code should be justified by one of two reasons:

1. **DOM side effect** — something that must happen after the DOM updates (animation, focus management, measurement).
2. **External system sync** — integrating with something outside Svelte's reactive graph (WebSocket, localStorage, a third-party library).

If an `$effect` is being used to *derive* or *synchronize state*, that is almost always a sign that the logic belongs in `$derived` or `$derived.by`.

### The `untrack` corollary

Every `untrack()` call deserves a comment explaining *why* the value should not be a dependency. Without it, future readers (including you, six months from now) cannot tell whether it is intentional design or an accidental suppression of a legitimate re-run.

---

## Decision Checklist

When you encounter or write `untrack`, `$effect.root`, or nested `$effect`:

- [ ] Can this be expressed as `$derived` or `$derived.by` instead? If yes, prefer that.
- [ ] Does `untrack` wrap a value that *genuinely* shouldn't trigger a re-run? If the value logically drives the computation, remove the `untrack` and fix the upstream design.
- [ ] Does `$effect.root` have a corresponding `destroy()` call in the owning object's cleanup lifecycle?
- [ ] Is the nested `$effect` inside a parent that re-runs frequently? If so, assess reconstruction cost.
- [ ] Is `$effect.tracking()` used outside of a utility/library context? If so, remove it.
