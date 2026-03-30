# Memo — Open Architectural Decisions

> Date: 2026-03-14
> Ref: `TODO.md`, `Architecture.md`

This memo expands on each open item from `TODO.md`, describing the tension behind each decision and the options on the table.

---

## 1. Polymorphism: When to offer `asChild`

**The question:** Should every Shell always expose both paths (`children` and `asChild`)? Or should some Shells — those whose wrapper adds nothing to the DOM — offer only `asChild`?

**The tension:** The current type system enforces mutual exclusivity between the two paths via a union with `never`. This works well when both paths are meaningful. But for a Shell that is purely behavioral (e.g., `display: contents`, no layout box), the `children` path creates a wrapper that has no reason to exist. Offering it might mislead the developer into thinking the wrapper does something.

**Options:**
- **Always both.** Consistency — every Shell has the same API surface. The developer always knows what to expect.
- **Only `asChild` when the wrapper is a no-op.** Honest API — if the wrapper does nothing, don't pretend it's a choice. But this creates inconsistency across Shells.
- **Both, but document which path is recommended per Shell.** Middle ground — the API is uniform, but docs guide the developer toward the right choice.

**On always-`asChild`, even when a wrapper is needed:**

It's viable in principle — the Shell would always delegate rendering to the child, and when it needs a structural wrapper (e.g., for `position: relative`), it injects one internally, invisible to the consumer's API. The consumer always writes `asChild` and never thinks about wrappers.

The trade-off: this hides the wrapper from the developer. If the Shell silently injects a `<div>` for structural reasons, the developer doesn't see it in their template but it exists in the DOM — which can still break CSS selectors and layout assumptions. It also raises a question of honesty: is a hidden wrapper better or worse than an explicit one the developer chose?

However, there's a harder constraint — see §5 below: when the child is a Svelte component (not an HTML element), `use:action` can't be forwarded to it, so `asChild` alone isn't always sufficient.

---

## 2. Dot Notation

**The question:** Should dot notation (`Movable.Root`, `Movable.Item`) remain the standard for multi-component packages?

**The tension:** Dot notation is a Radix UI convention, not an Apple/SwiftUI one. The architecture's stated goal is that an Apple developer should feel at home. In SwiftUI, modifiers are chained (`.draggable()`, `.onTapGesture {}`), and environment values use a different injection mechanism — neither maps to dot notation. However, Svelte's component model doesn't support method chaining on components, making SwiftUI's syntax impossible to replicate. Dot notation is arguably the closest Svelte idiom for expressing "these components belong to the same family."

**Options:**
- **Keep dot notation.** It's the best Svelte has to offer for namespaced component families. The architecture already uses it, and it works well with IDE autocompletion.
- **Drop it in favor of flat named exports.** Closer to how SwiftUI feels (each thing has its own name), but loses the visual grouping.

**Without dot notation — flat named exports example:**

```svelte
<!-- Dot notation (current) -->
<Movable.Root>
  <Movable.Item initialPosition={{ x: '50%', y: '50%' }}>
    <MyCard />
  </Movable.Item>
  <Movable.Sensor />
</Movable.Root>

<!-- Flat named exports -->
<MovableRoot>
  <MovableItem initialPosition={{ x: '50%', y: '50%' }}>
    <MyCard />
  </MovableItem>
  <MovableSensor />
</MovableRoot>
```

The import would change from:

```ts
// Dot notation
import { Movable } from '$lib/Movable'

// Flat
import { MovableRoot, MovableItem, MovableSensor } from '$lib/Movable'
```

The flat style reads more like SwiftUI (each thing has a self-contained name), but loses the visual grouping that makes it immediately obvious these components belong together. With dot notation, typing `Movable.` triggers autocomplete showing all members — flat exports require the developer to remember or guess the names.

**Leaning toward flat exports.** Additional argument: Item should be usable independently of Sensor (or have a standalone version), which is easier to express with flat exports — you just don't import `MovableSensor`. With dot notation, `Movable.Item` visually implies `Movable.Sensor` is always part of the picture.

**The Root naming question:** In dot notation, `Root` works because the namespace provides context (`Movable.Root`). In flat exports, `MovableRoot` is unambiguous but verbose. Options:

- **`MovableRoot`** — Explicit. No ambiguity. Follows the same `[Domain][Role]` pattern as `MovableItem`.
- **`Movable`** — Shorter. The "root" is implied by being the package's primary export. But this conflicts with using `Movable` as a general namespace, and it's unclear that it's a context provider, not a modifier.
- **`MovableProvider`** — Clarifies the role (context provider, no DOM output). But "Provider" is a React term, not SwiftUI.
- **`MovableArea`** — Semantic: describes *what it represents* (the draggable area) rather than its technical role. But not every Root maps to an "area."

If the pattern is flat exports with `[Domain][Role]`, then `MovableRoot` is the most consistent choice — the word "Root" still communicates "this is the top-level boundary" without needing a namespace prefix to make sense. The naming rule would be: **the context provider is always `[Domain]Root`**.

**Decision: `[Domain]Context`.** The context provider is always named `[Domain]Context` (e.g., `MovableContext`, `ButtonContext`). "Context" communicates ambient influence — children adapt to their environment — and its wrong presumptions are shallow implementation-detail mismatches, not category-level errors.

---

## 3. File Typing for Shells

**The question:** Shells are the equivalent of SwiftUI View Modifiers, but their files look identical to regular View files (`.svelte`). How should they be distinguished?

**The tension:** A developer scanning the file tree sees `AttentionRequester.svelte` and `MovableItem.svelte` — both are `.svelte` files, but none is a View. Without a naming or typing distinction, the architectural role of each file is invisible at the filesystem level.

**Options:**
- **Add a suffix convention** (e.g., `MovableItemShell.svelte`). Explicit, but adds a naming concept that doesn't exist in Svelte's ecosystem.
- **Use a folder convention** (e.g., `Shells/` subdirectory). Groups them physically, but breaks the flat-file convention from §9.
- **Accept the ambiguity.** The Architecture doc defines what a Shell is; developers learn the distinction. The file extension doesn't need to encode the architectural role.

**Decision: a suffix will be added.** The open question is the name itself — "Shell" doesn't feel right.

Candidates to consider, mapped against the SwiftUI analogy (View Modifier):

| Name | Analogy | Pros | Cons |
|---|---|---|---|
| `Modifier` | Direct SwiftUI term | Instantly clear to Apple devs | Svelte community might confuse with CSS modifiers or BEM |
| `Enhancer` | "Enhances" the child with capabilities | Neutral, descriptive | Not a term from any established framework |
| `Wrapper` | Literal description | Honest about what it does in the DOM | Too generic; implies visual containment |
| `Behavior` | Describes what it grants | Focuses on the purpose, not the mechanism | Could be confused with JS behavior patterns |
| `Modifier` + dot notation | e.g., `Movable.Modifier` | Aligns with SwiftUI `.modifier()` | Verbose in template |

The name should communicate: *"This component grants capabilities to its child without imposing visual opinions."*

**Decision: the term is `Modifier`.** Files will use the suffix convention: `AttentionRequesterModifier.svelte`, `MovableItemModifier.svelte`. This aligns with the SwiftUI mental model (View Modifier) and makes the architectural role visible at the filesystem level.

Updated naming convention (§9):

```
AttentionRequesterModel.svelte.ts      — Model
AttentionRequesterController.svelte.ts — Controller
AttentionRequesterModifier.svelte      — Modifier (was "Shell")
AttentionRequester.types.ts            — Types
index.ts                               — Public API
```

---

## 4. Types File Naming

**The question:** Should type files be `[domain].types.ts` (e.g., `AttentionRequester.types.ts`) or just `types.ts`?

**The tension:** The domain prefix convention (§9) exists for Cmd+P discoverability — typing "AttentionRequester" reveals all related files. A plain `types.ts` breaks this: pressing Cmd+P and typing "types" shows every package's types file with no disambiguation. On the other hand, `types.ts` is conventional and minimal, and each package already lives in its own directory, so the path provides disambiguation.

**Options:**
- **`[domain].types.ts`.** Consistent with §9. Cmd+P friendly. Slightly verbose.
- **`types.ts`.** Conventional. Relies on the directory path for context. Breaks Cmd+P pattern.

**Decision: types files use domain prefix** (`AttentionRequester.types.ts`).

**On `index.ts`:** The case for `index.ts` is different from `types.ts`. An `index.ts` is a module entry point — it's resolved by the bundler when you import a directory (`import { ... } from '$lib/Movable'`). Renaming it to `Movable.index.ts` would break this convention, because bundlers and Node resolution don't look for `[name].index.ts` — they look for `index.ts` (or `index.js`).

So the pragmatic answer: **`index.ts` stays as `index.ts`**. It's the one file where the domain prefix would fight against tooling rather than help it. The path already disambiguates (`Movable/index.ts` vs `AttentionRequester/index.ts`), and you rarely Cmd+P for an index file — you navigate to it via the directory.

**Confirmed: `index.ts` stays as `index.ts`.** Bundler resolution depends on this exact filename. No domain prefix.

---

## 5. Shell Wrapper Strategy

**The question:** Should Shells render a wrapper element by default, use `asChild` by default, or always render a wrapper even when adding `asChild`?

**The tension:** This is the practical consequence of decisions #1 and #6. A wrapper element can break CSS layouts (Wrapper Hell), but some Shells need a real DOM node to function (e.g., as a positioning anchor with `position: relative`, or to clip overflow). Additionally, Shells that expose ephemeral state via Snippets (`isDragging`, `isMoving`) need the snippet to be on *something* — if there's no wrapper, the snippet parameters must flow through the `asChild` path, which complicates the API.

**Options:**
- **Wrapper by default, `asChild` as escape hatch.** Simplest DX for the common case. Wrapper Hell for complex layouts.
- **`asChild` by default, wrapper only when behavior requires it.** Cleanest DOM, but the default path is the more complex API (snippet parameters, action forwarding).
- **Always `asChild`, even when a wrapper is added internally.** The Shell always delegates rendering to the child, but may inject an internal wrapper for structural needs. This decouples the developer's concern (layout) from the Shell's concern (behavior).

**Key constraint recalled:** When the child is a Svelte component (not a native HTML element), `use:action` can't be applied to it — actions only work on DOM elements. This means `asChild` can't work when the direct child is a component, because the Shell has no element to attach its action to. The wrapper is mandatory in that case.

**On separating `asChild` from snippet state access:**

Yes, it's viable to decouple them. The two concerns are:
1. **Layout control** (`asChild`) — the developer wants to avoid a wrapper element because it breaks their CSS.
2. **State access** (`isDragging`, `isMoving`) — the developer wants to react to ephemeral state.

These don't have to be tied together. The Shell could expose ephemeral state through both paths:
- **`children` path (wrapper):** State via snippet parameters on the wrapper's slot — `{#snippet children(isDragging)}`.
- **`asChild` path (no wrapper):** State via the same snippet parameters — `{#snippet asChild(isDragging, action)}`.

In both cases the developer gets the state. The only reason to choose `asChild` is layout, not state access. This simplifies the mental model: *"Use `asChild` only when you need to eliminate the wrapper from the DOM."*

**Decision adopted:** *"Use `asChild` only when you need to eliminate the wrapper from the DOM."* Ephemeral state is available through both paths — `asChild` is purely a layout escape hatch, not a state access mechanism.

---

## 6. Shell Display Rule

**The question:** What should be the default `display` value for Shell wrappers — `contents` or `flex` with `width: max-content`?

**The tension:** Architecture.md §5 already describes both options and their use cases, but doesn't declare a default. `display: contents` makes the Shell invisible in layout — ideal for behavior-only Shells that shouldn't affect the child's positioning. `flex + max-content` creates a real layout box — needed when the Shell must serve as an anchor point (e.g., `position: relative` context). The problem: choosing the wrong default means either layout breakage (if `flex` is default but unnecessary) or missing anchor behavior (if `contents` is default but a box is needed).

**Options:**
- **`display: contents` as default.** Most Shells are behavior-only, so invisibility is the right default. Shells that need a box explicitly opt in.
- **`flex + max-content` as default.** Safer — a real box never breaks behavior that needs an anchor. But it can break the consumer's layout unexpectedly.
- **No universal default.** Each Shell declares its own display based on its needs. Document the decision criteria instead of a blanket rule.

**Decision: a single default must exist** — requiring documentation lookup per Shell defeats the purpose of a convention.

**The mental model question:** What does a developer assume when they wrap their element in a Shell, without reading docs?

- **Assumption A: "It's invisible."** The developer writes CSS selectors as if the Shell doesn't exist. If the Shell actually renders a `<div>`, selectors like `.parent > .child` break silently. The developer is surprised.
- **Assumption B: "It's a real element."** The developer accounts for the Shell in their CSS. If the Shell uses `display: contents`, nothing breaks — it just doesn't affect layout. The developer is not surprised, just mildly over-cautious.

Assumption A is more dangerous: silent breakage. Assumption B is more conservative: no breakage, minor redundancy.

This suggests **`display: contents` as the default is safer for developer expectations**, because:
- If the developer assumes it's invisible and it is → correct.
- If the developer assumes it's a real element and it's `contents` → their extra CSS selector specificity is harmless.
- If the default were `flex + max-content` and the developer assumes it's invisible → layout breaks.

Shells that need a real box (positioning anchor, overflow clip) would explicitly opt in to `flex + max-content` and document why.

**Decision: `display: contents` is the default.** Modifiers that need a real layout box (`flex + max-content`) must explicitly opt in and document why (e.g., positioning anchor, overflow clipping).

---

## Summary of Decisions Made

| # | Topic | Decision |
|---|---|---|
| 2 | Exports | **Decided:** Flat named exports, `[Domain][Role]`. Context provider = `[Domain]Context` |
| 3 | Modifier naming | **Decided:** suffix is `Modifier` (replaces "Shell") |
| 4 | Types file naming | **Decided:** `[domain].types.ts`; `index.ts` stays as-is |
| 5 | Wrapper strategy | **Decided:** `asChild` is only for layout escape; state available on both paths |
| 6 | Display rule | **Decided:** `display: contents` default; `flex + max-content` opt-in with docs |

| 1 | Polymorphism | **Decided:** Both paths always offered. `asChild` exists as last-resort escape hatch — the default wrapper (`display: contents`) is designed to make it rarely necessary |
