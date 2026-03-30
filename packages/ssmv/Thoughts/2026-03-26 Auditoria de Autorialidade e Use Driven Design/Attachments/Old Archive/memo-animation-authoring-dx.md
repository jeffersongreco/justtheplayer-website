# Memo: Animation Authoring DX — Blind Spot Analysis

**Context:** Evaluating the current developer experience for creating a new animation compatible with `attention-requester`, abstracted to the general problem of "authoring content that must conform to a package's rules."

---

## The Problem in Abstract

This is the **Content Conformance** problem: a package defines a contract, and external (or future) developers must produce artifacts that satisfy it. Every mature ecosystem has a pattern for this. The question is: does ours guide the author, or does it just hope they read the right files?

---

## What Three Ecosystems Do Differently

### Apple (SwiftUI)

```swift
struct MyAnimation: CustomAnimation {
    // The compiler tells you exactly what to implement.
    func animate<V: VectorArithmetic>(value: V, time: Double, context: AnimationContext<V>) -> V? { ... }
}
```

**Key insight:** The protocol IS the documentation. You declare conformance, and the compiler becomes your guide — red squiggles until you've fulfilled every requirement. Discovery is autocomplete on the protocol type.

### Svelte (built-in transitions)

```ts
function myTransition(node: HTMLElement, params: any): TransitionConfig {
    return { duration: 300, css: (t) => `opacity: ${t}` };
}
```

**Key insight:** The contract is a single function signature. No factory, no helper, no directory convention. You write a function that returns the right shape. The type `TransitionConfig` guides you. Done.

### Web Platform (WAAPI)

```ts
element.animate(keyframes, { duration: 300 });
```

**Key insight:** The platform doesn't wrap its primitives. Keyframes are keyframes. Options are options. No abstraction layer between intent and execution.

---

## Blind Spots in the Current Design

### 1. The Factory Obscures the Contract

A developer wanting to create a new animation encounters `createARAnimation()` — a function that accepts params and returns a typed object. But the params interface (`ARAnimationFactoryParams`) is internal to `createARAnimation.ts`, not exported from the public types.

**The actual contract** is just `ARAnimationLoop | ARAnimationOneShot` — plain data objects. A developer could skip `createARAnimation` entirely and return `{ name, duration, keyframes, loop: true, interval: 1000, onInterrupt: "resume" }`. The factory adds no validation, no transformation, no logic beyond defaulting `onInterrupt` to `"resume"`.

**Blind spot:** The factory creates the illusion of a required ceremony when the contract is actually trivial. In Apple terms, it's like requiring `AnimationFactory.create(...)` instead of just conforming to the protocol.

**Question to resolve:** Does `createARAnimation` earn its existence? If it's just defaulting one field, `satisfies` on a plain object does the same job with better discoverability.

### 2. `defineBounceAnimation` Conflates Reuse with Authoring

This is a **shared implementation helper** for bounce-family animations. But its existence sends a confusing signal: "Is this how you create animations?" A new developer sees:

- `createARAnimation` — low-level factory
- `defineBounceAnimation` — high-level factory that wraps the low-level factory
- Both are in `Animations/` alongside the actual animations

**Blind spot:** There's no visible distinction between "this is the authoring API" and "this is an internal reuse pattern for one family of animations." The two bounce variants (`DoubleBounce`, `PhysicsBounce`) use `defineBounceAnimation`, which might lead someone creating a `Shake` animation to think they need a `defineShakeAnimation` too.

**In Apple terms:** This is like shipping `UIViewControllerAnimatedTransitioning` (the protocol) alongside `UISpringTimingParameters` (a convenience for one style) in the same folder with no indication of which is foundational vs. optional.

### 3. No Type-Guided Authoring Path

The contract is discoverable by reading `AttentionRequester.types.ts`, but nothing in the system points you there. Compare:

| Ecosystem | "I want to create a new animation" → What guides me? |
|---|---|
| **Apple** | Declare `: CustomAnimation`, compiler fills in the blanks |
| **Svelte** | Write `(node, params) => TransitionConfig`, type error if wrong shape |
| **WAAPI** | `element.animate()` — the function signature IS the docs |
| **Current AR** | Read existing code, notice `createARAnimation`, copy the pattern |

**Blind spot:** The system relies entirely on **convention mimicry** — "look at DoubleBounce and do something similar." This is the weakest form of guidance because:
- It doesn't distinguish essential structure from incidental choices
- Naming conventions (`{Name}ARAnimation.ts`) are invisible unless you notice the pattern
- The directory structure (`Animations/{Name}/{Name}ARAnimation.ts`) is convention, not enforced

### 4. The Name Field is Unvalidated

Each animation has a `name: string` (e.g., `"double-bounce-up-100"`). Nothing prevents duplicates, nothing enforces the naming convention, and the name is composed at runtime from config values — meaning two differently-configured instances of the same factory produce different names.

**Question to resolve:** What is `name` for? If it's for debugging/logging, a generated ID suffices. If it's for identity/deduplication, it needs validation. Currently it's neither — it's a string that exists because someone thought it might be useful.

### 5. No Discoverability at the Consumption Site

```ts
import { DoubleBounce, PhysicsBounce } from "@headless-uai/attention-requester";

request(DoubleBounce({ direction: "up" }));
```

As a consumer, how do I know what animations exist? I read `index.ts` exports or documentation. Compare:

- **SwiftUI:** `.bounce`, `.spring`, `.easeInOut` — autocomplete on `Animation` shows everything
- **Svelte:** `transition:fly`, `transition:fade` — directive shows available options
- **CSS:** `animation-name` references `@keyframes` — defined in the same scope

**Blind spot:** Named exports from a barrel file is the standard JS approach, but it provides zero categorization. Are `DoubleBounce` and `PhysicsBounce` different animations or variants of the same family? The names suggest a relationship but the API treats them as independent.

### 6. The Abstraction Level Mismatch

The consumer-facing API (`DoubleBounce({ direction: "up", loop: true })`) is well-designed — declarative, configurable, clean. But the **authoring** API (the experience of creating `DoubleBounce` itself) operates at a completely different abstraction level: raw WAAPI keyframes, `getComputedStyle`, `translate` string parsing.

**This is fine for the current team**, but it means the authoring API is fundamentally a different audience than the consumption API. The code doesn't acknowledge this gap.

**In Apple terms:** It's like if creating a `CustomAnimation` required you to manually interpolate `CATransform3D` matrices while consuming one was just `.bounce`. The abstraction cliff is steep.

---

## The Abstract Pattern: Guided Conformance

Zooming out from animations specifically, the core question is:

> **When your package accepts pluggable content that must follow rules, how does the system guide authors toward correctness?**

The spectrum from weakest to strongest:

| Level | Mechanism | Current AR |
|---|---|---|
| 0. **Convention** | "Look at existing examples" | ✅ Primary mechanism |
| 1. **Types** | Interface/type that authors `satisfies` | ⚠️ Types exist but factory obscures them |
| 2. **Factories** | Function that enforces shape + defaults | ✅ `createARAnimation` (minimal value-add) |
| 3. **Templates** | Scaffolding / generator / snippet | ❌ None |
| 4. **Protocol + Compiler** | Declare conformance, get guided | ❌ Not leveraged (TS can do this with `satisfies`) |
| 5. **Validation** | Runtime checks that conformance is correct | ❌ None (name collisions, missing fields not caught) |

The current system operates at levels 0-1 when it could easily reach 2-4 with minimal changes.

---

## Questions for Decision

1. **Who is the animation author?** If it's always you (the package maintainer), convention mimicry is fine. If external devs will author animations, the DX needs to be intentional.

%% External devs must be able to author their own animations. %%

2. **Should `createARAnimation` exist?** It defaults one field. A `satisfies ARAnimationOneShot` on a plain object literal gives better type guidance with zero abstraction.

%% No. %%

3. **Should `defineBounceAnimation` be the pattern or an exception?** If it's the pattern, it needs documentation. If it's a one-off reuse helper, it should be clearly marked as internal.

%% Nem excessão, vamos definir que não há famílias de animações. %%

4. **What is the `name` field for?** Its purpose determines whether it needs validation, generation, or removal.

%% For logging. %%

5. **Is there a "Shake" or "Pulse" family coming?** If yes, the authoring pattern needs to be defined now before a second family establishes a conflicting convention.

%% Yes. New ones will came. %%

---

## Final Recommendation

### The Target: Svelte-Style Authoring

The answers above converge on one design: **an animation is a function that returns a plain object.** No factory, no family hierarchy, no ceremony. The type system guides the author. Period.

```ts
// This is the entire authoring API.
// A dev writes a function. The function returns a typed object. Done.
import type { AttentionRequesterAnimation } from "@headless-uai/attention-requester";

export function Shake(config?: { intensity?: number }): AttentionRequesterAnimation {
    const intensity = config?.intensity ?? 5;
    return {
        name: "shake",
        duration: 500,
        keyframes: [
            { translate: `${-intensity}px 0 0` },
            { translate: `${intensity}px 0 0` },
            { translate: `${-intensity}px 0 0` },
            { translate: "0 0 0" },
        ],
    } satisfies AttentionRequesterAnimation;
}
```

That's the Svelte transition model. That's the WAAPI model. That's what a web dev already knows.

### What Changes

| Action | Why |
|---|---|
| **Remove `createARAnimation`** | It defaults one field. Move the default into the Model/Coordinator (where `onInterrupt` is consumed). The authoring API becomes zero-dependency. |
| **Dissolve `defineBounceAnimation`** | No families. `DoubleBounce` and `PhysicsBounce` become self-contained functions that each inline their own direction/distance logic. Shared utilities (`normalizeDirection`, `makeTranslate`) can stay as exported helpers — they're useful, not ceremonial. |
| **Export types as the primary authoring contract** | `ARAnimationOneShot`, `ARAnimationLoop`, and `AttentionRequesterAnimation` become the documented entry point. A dev reads the type, writes a function that returns it, uses `satisfies` for compile-time guidance. |
| **Make `name` optional, auto-generate if absent** | Since it's for logging only, the Model can fallback to `"unnamed-animation"` or generate from a counter. Authors *can* name their animation for better logs, but it's not required. |
| **Keep shared utilities, mark them as helpers** | `normalizeDirection`, `makeTranslate`, `Vector3D`, `CardinalDirection` — these are genuinely useful for anyone writing translate-based animations. Export them from a `helpers` or `utils` path, not from the animation barrel. |

### The Authoring Story Becomes

1. Import the type: `import type { AttentionRequesterAnimation } from "..."`
2. Write a function that returns it
3. Use `satisfies` — the compiler guides you
4. That's it. No factory to learn, no directory convention to follow, no family to extend.

### What This Looks Like from Each Perspective

**Svelte dev:** "Oh, it's like writing a custom transition. I know this."

**Apple dev:** "It's a protocol conformance — I declare the shape, the system consumes it."

**Web dev:** "It's just WAAPI keyframes in a typed wrapper. I can write this in 10 lines."

### Risk: Dissolving `defineBounceAnimation`

The two bounce animations share ~40 lines of logic (direction normalization, `getComputedStyle` reading, name composition). Inlining this into each animation adds duplication. **Mitigation:** keep `normalizeDirection` and `makeTranslate` as exported utility functions. The 5 lines of `getComputedStyle` → parse `translate` can be a third helper (`readCurrentTranslate(el): Vector3D`). The animations use these helpers directly — no wrapping factory.

### Prerequisite Decision

Before implementing: **should `onInterrupt` default live in the type (`onInterrupt?: "resume"`) or in the consumer (Model/Coordinator)?** Currently `createARAnimation` sets the default. If removed, the default must move somewhere. Recommendation: **Model/Coordinator** — it's a behavioral default of the system, not of the animation definition. The animation type keeps `onInterrupt` optional, and the consumer treats `undefined` as `"resume"`.
