# Memo: Module Interfaces as Primary Documentation

**Context:** Evaluating Ousterhout's "Deep Modules" principle and the concept of Graybox modules — where the interface alone is sufficient to understand the system, and implementation reading is reserved for contributors.

---

## The Claim

A well-designed module should be documentable entirely through its public surface: types, interfaces, and prose contracts. A consumer should never need to open implementation files to understand what a package does, how to use it, or what to expect. This is how Apple documents its frameworks — the protocol and its method signatures *are* the documentation. If you need to read the source to know the behavior, the interface is either incomplete or leaky.

---

## Ousterhout's Vocabulary

- **Deep module:** Simple interface, rich implementation. The interface hides most of the complexity.
- **Shallow module:** Interface complexity is proportional (or worse, superior) to the value provided. Each abstraction adds cognitive overhead without simplifying the caller.
- **Information hiding:** Decisions that don't need to be known by callers should be invisible — not just unexported, but non-apparent from the interface's shape.

The goal isn't brevity for its own sake. It's that reading the interface tells you *everything you need to use the system correctly* — invariants, lifecycle, preconditions, legal call sequences.

---

## Current State: Package-by-Package

### AttentionRequester

The conceptual consumer surface is already small:

```ts
// The consumer interface — already exists as a type:
interface AttentionRequester {
  cancel: () => void
  request: (animation: AttentionRequesterAnimation, reducedMotionAnimation?: AttentionRequesterAnimation) => void
}

// Animation factories:
PhysicsBounce(config: BounceConfig): AttentionRequesterAnimation
DoubleBounce(config: DoubleBounceConfig): AttentionRequesterAnimation
```

**Problem:** `index.ts` also exports `makeTranslate`, `normalizeDirection`, `readCurrentTranslate`, `AttentionRequesterCoordinator`, and `AttentionRequesterModel`. These are implementation units. A consumer who reads the index sees six concepts when they need two (`AttentionRequester` + animation factories). The interface is *accidentally wide* — everything that happens to exist was exported.

**Verdict:** Shallow by accident. The deep interface is there; it's just buried.

---

### Movable

The component surface is clean:

```ts
<MovableContext>     → provides context
<MovableItem>        → movable unit
<MovableSensor>      → drop zone
```

**Problem:** `MovableContextState` exposes `model: MovableModel` to the consumer. `MovableModel` has `began()`, `changed()`, `ended()`, `registerSensor()`, `unregisterSensor()` — these are the Interaction protocol, internal contracts between Model and hardware layers. A consumer will never call `began()`. But they can. And they'll wonder if they should.

Additionally, `MovableModel` has three public DOM references: `rootEl`, `liveRegionEl`, `instructionsId`. These are Coordinator-facing plumbing, not consumer state. Exposing them to consumers leaks the implementation layer.

`MovableInteraction` exists and is correctly scoped — but it's mixed into the same `Movable.types.d.ts` file as consumer-facing types, so the consumer can't tell which half of the file applies to them.

**Verdict:** The Interaction protocol bleeds into the consumer surface. The module is not shallow by accident — there's structural coupling causing the leak.

---

## The Blind Spots

### 1. `.d.ts` is not an interface — it's a compilation artifact

The TypeScript declaration files are generated from *what was exported*, not from *what was intended for consumers*. They're a mirror, not a design. Treating them as the interface means the interface is defined by accident.

A genuine interface is written first, as a contract — then the implementation satisfies it. The current order is inverted.

### 2. Types tell *what*, JSDoc tells *when*

Even a perfectly typed surface is an incomplete interface without prose. Types tell you the shape of inputs and outputs. JSDoc tells you the lifecycle (`request()` has no effect if already animating — true or false?), preconditions (`cancel()` is a no-op if idle — safe to call?), and invariants. Apple's protocol docs are types + prose together. Neither alone is sufficient.

Currently there is no JSDoc on the public surface of either package.

### 3. Two consumer types, one surface

There are exactly two consumer types:
- **Component consumer:** uses the component as a UI building block — knows nothing about MV, nothing about Model or Coordinator, only what the component does, what props it accepts, and what effects it has. If they want to write a custom animation for private use, that's still component consumer territory.
- **Contributor:** builds new packages or extends existing ones inside the repo — needs Model/Coordinator/Interaction and reads Architecture.md.

The `Interface.md` is scoped to component consumers only. Architecture.md serves contributors. These are different documents for different readers. Conflating them produces the current situation where everything gets exported because "someone might need it."

### 4. The prerequisite decision: should `MovableModel` be a public type at all?

`MovableContextState.model` exposes the full model to consumers. The question is: *what does a consumer do with it?* If the answer is "reads `activeItemID` or `activeItemGroup` to drive external behavior," then a stripped `MovableState` read-only interface should exist instead. If the answer is "nothing the component surface doesn't already cover," then the model should not be in `MovableContextState` at all.

This is a design decision, not a cosmetic one — and it needs to be made before any interface document can be written for Movable.

---

## What Adoption Would Look Like

### Phase 1 — Curate the export surface

Each package gets an explicit `index.ts` that is the *intended* surface, not a re-export of everything. For AttentionRequester this is a small change. For Movable it requires resolving the model exposure question first.

### Phase 2 — Write the interface as a document

A file per package, not generated — handwritten as the authoritative reference:

**`packages/attention-requester/Interface.md`**
```
## AttentionRequester

Animates an element to draw user attention. Attach it to the element,
then call request() with an animation. Cancel at any time. Supports
pausing, loop animations, and reduced motion variants.

Methods:
  request(animation, reducedMotionAnimation?) — starts animation.
    No-op if the same animation is already active.
    If a different animation is active, interrupt resolution determines behavior.
  cancel() — stops the current animation immediately. No-op if idle.

Props:
  paused: boolean — suspends animation without cancelling it.
```

This document is the source of truth. If the implementation diverges, the implementation is wrong.

### Phase 3 — Enforce surface conformance

The interface document drives what `index.ts` exports. A PR that adds a new export requires updating the interface document as a conscious act — the export is justified by the interface, not the other way around.

---

## Effort and Risk

| Package | Effort | Main Risk |
|---|---|---|
| AttentionRequester | Low — stop exporting helpers, add JSDoc | None; purely additive except for helper removal |
| Movable | Medium — resolve model exposure question, split consumer vs. Interaction types, add JSDoc | Model API change affects consumers |

The helper removal in AttentionRequester is technically a breaking change (semver). In practice, `makeTranslate` etc. should never have been part of the consumer API — but this needs a minor version bump.

---

## Final Recommendation

Adopt `Interface.md` as a first-class document in the package lifecycle, written exclusively for component consumers and authored before implementation begins.

**Scope of Interface.md:**
- What the component does (one paragraph, plain language)
- Props and snippets with prose description — not just types
- Any public methods exposed via `bind:this` or context, with lifecycle notes (when they're safe to call, what happens if called at the wrong time)
- Observable effects that are the consumer's responsibility (e.g., "the component does not manage focus — the consumer must provide a visible focus indicator via `data-moving`")
- Nothing about Model, Coordinator, Interaction, or internal architecture

**What it enforces:**
- `index.ts` exports only what appears in `Interface.md` — new exports require the interface document to be updated first, making the decision explicit
- JSDoc on public types mirrors the prose in `Interface.md` — types and documentation stay in sync

**For the existing packages:**

*AttentionRequester:* Low-effort. Write `Interface.md`, narrow `index.ts` to match (remove helpers and internal classes), add JSDoc to the `AttentionRequester` type.

*Movable:* Resolve the `MovableModel` exposure question first — decide whether consumer-visible state from the model belongs in the component surface or not. Once decided, write `Interface.md` from that answer. The Interaction protocol types should be moved out of `Movable.types.d.ts` into a contributor-facing file.

Neither package is far from this standard.

---

## When to Write Interface.md

**Proposal: immediately after `Behavioral Specification.md`, before any implementation.**

The relationship between the two documents:

| Document | Audience | Language | Perspective |
|---|---|---|---|
| `Behavioral Specification.md` | All (implementation-agnostic) | Behavioral, no technology | What the system *does* |
| `Interface.md` | Component consumers only | Types + prose | How a consumer *uses* it |

The Behavioral Spec describes behaviors from the system's point of view ("when idle, a request activates the animation"). `Interface.md` translates those behaviors into a usage contract from the consumer's point of view ("call `request()` to start — no-op if the same animation is already active; if a different animation is active, the configured interrupt resolution applies").

Writing `Interface.md` before implementation also satisfies Ousterhout's "design it twice" discipline: the interface is a design decision that should be deliberate, not a residue of what got exported during development.

**Proposed workflow position:**

```
1. Behavioral Specification.md   — what the system does (no technology)
2. Interface.md                  — how a component consumer uses it (types + prose)
3. Implementation                — satisfies both documents (TDD)
4. Checklist.md conformance      — architecture audit before commit
```

`Interface.md` is the bridge: it takes the behavioral spec and makes it concrete for the consumer, without committing to any implementation detail. If during implementation you discover the interface doesn't map cleanly to the behavior, you revisit the interface — not the behavior.
