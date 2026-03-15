# Memo — Controller Reactivity: Template Routing vs. Direct Observation

> Date: 2026-03-15
> Ref: `TODO.md`, `Architecture.md` §3

---

## The Prerequisite Question: State-Observation vs. Command-Dispatch

Before asking *where* the Model→Controller bridge lives (template vs. Controller internals), there's a prior question the memo originally skipped: **what kind of bridge is it?**

Two fundamentally different communication paradigms exist for Model→Controller:

### Paradigm 1: State-Observation (Pull / Reactive)

The Controller **observes** Model state and reacts to changes. The Model doesn't know the Controller exists — it just exposes state. Someone (template or Controller itself) watches that state and derives side effects.

```ts
// Controller watches isPaused and reacts
$effect(() => {
  if (this.#model.isPaused) this.#pauseAnimation();
  else this.#resumeAnimation();
});
```

**Names in the literature:** Observer pattern, reactive binding, pull-based communication, KVO (Key-Value Observing in Apple's world).

**Characteristics:**
- Model is completely decoupled — it doesn't even know side effects happen
- Communication is implicit: a state change is not an "order", it's a fact that someone interprets
- Multiple observers can react to the same state independently
- The Controller must derive *intent* from state — `isPaused` went from `false` to `true`, so I should pause. But what if the Controller wasn't observing when the state changed? What if the initial value is already `true`?

### Paradigm 2: Command-Dispatch (Push / Imperative)

The Model **tells** the Controller what to do via explicit method calls. The Model knows (or some mediator knows) that a Controller exists and needs to be commanded.

```ts
// Model (or mediator) explicitly commands the Controller
controller.pause();
controller.resume();
controller.playback(animation, interval);
```

**Names in the literature:** Command pattern, message passing, delegation, push-based communication, target-action (Apple's UIKit pattern).

**Characteristics:**
- Communication is explicit: each method call is a discrete order with clear semantics
- No ambiguity about intent — `pause()` means "pause now", not "the state is paused, figure out what to do"
- The Controller doesn't need to derive meaning from state transitions
- But: requires someone to *issue* the commands — the Model, the template, or a mediator

### Why This Matters Before the Rest of the Memo

The entire memo below discusses **where** the `$effect` bridge lives — template or Controller. But both Options A and B assume Paradigm 1 (state-observation). The Controller watches `isPaused` / `pauseIntent` / `isActive` and derives what to do.

Under Paradigm 2, the question changes entirely. There's no `$effect` bridge at all. The Model (or View) calls `controller.pause()` directly when the business decision is made. The "where does the observation live?" question dissolves — because there's no observation.

### What Apple Does: Swift 6 / SwiftUI

SwiftUI is built entirely on **Paradigm 1 — state-observation**. The `@Observable` macro (Observation framework, Swift 5.9+) makes any class's properties automatically observable. Views re-render when observed state changes. For side effects, SwiftUI provides `.onChange(of:)` and `.task` — both are state-observation triggers for imperative work.

Critically: **SwiftUI has no Controller at all.** Side effects that would live in a Controller are handled by:
- `.onChange(of: model.isPaused)` — observe state, run imperative code (equivalent to template `$effect`)
- `.task` — async work tied to view lifecycle
- The Model itself calling services directly

Apple's pre-SwiftUI world (UIKit) used **Paradigm 2 — delegation and target-action.** A button sends `#selector(playTapped)` to its target. `UITableViewDelegate` receives explicit method calls. The transition from UIKit to SwiftUI was, in part, a transition from command-dispatch to state-observation.

This architecture explicitly draws from the SwiftUI side of Apple's world (§0: "inspired by Swift/SwiftUI modern"). That would suggest Paradigm 1 is the natural fit. But the architecture also introduces a Controller — which SwiftUI doesn't have — and defines it as an "agent that obeys orders" (§3). **"Orders" is command-dispatch language applied to a state-observation system.** This is the deeper tension.

### Case-by-Case or Universal Pattern?

Should all Model→Controller pairs use the same paradigm, or should it vary?

**Argument for universal (state-observation):** Consistency. One mental model. The architecture already uses state-observation everywhere else (Views observe Model via `$derived`, template `$effect` bridges state to side effects). Making Controllers observe too is the natural extension.

**Argument for universal (command-dispatch):** Clarity. "The Model says `playback()`" is unambiguous. No derived intent, no edge cases with initial state, no "what if the observer missed the transition." The Controller's API reads like a list of capabilities.

**Argument for case-by-case:** Movable is already event-driven (Paradigm 2 via Interaction callbacks). Attention Requester is state-driven (Paradigm 1 via `isActive`/`pauseIntent`). Forcing one paradigm on both would be artificial.

**The hybrid reality:** Even in the current Attention Requester, it's already a mix. `pauseIntent` is state-observation (the Controller reads a typed intent from Model state), but `request(animation)` is command-dispatch (the View calls a Model method which eventually triggers the Controller). Purity may not be achievable or desirable.

### Recommendation on this Prerequisite

**State-observation (Paradigm 1) should be the default**, for three reasons:

1. **Alignment with SwiftUI's philosophy.** The architecture's stated inspiration is SwiftUI, which is fully observation-based. Following the same paradigm means the "same mental model" promise (§0) holds.

2. **The typed intent pattern already resolves the ambiguity problem.** Raw booleans (`isPaused`) are ambiguous — the Controller must infer intent. But `pauseIntent: { action: 'freeze' } | { action: 'resume', interval }` is as explicit as a command. State-observation with typed intents gives the clarity benefits of command-dispatch without the coupling.

3. **Event-driven packages (Movable) aren't an exception — they're a degenerate case.** In Movable, the "state" being observed is external events (pointer down, move, up), not Model state. The Controller doesn't observe the Model because the Model doesn't drive the Controller — the user does, through the Interaction. This isn't Paradigm 2; it's a different relationship entirely (Interaction→Controller, not Model→Controller).

Command-dispatch (`controller.pause()`) should be reserved for cases where an external caller (not the Model) needs to trigger Controller behavior — e.g., if a parent component needs to force-stop an animation. This is the imperative API surface (§5: `bind:this`), not the internal Model→Controller channel.

With this prerequisite settled, the rest of the memo's discussion (where the `$effect` bridge lives) proceeds under a clear assumption: **Model→Controller communication is state-observation with typed intents.**

**Update:** State-observation is adopted universally for the Model→Controller relationship. The existence of consumer-facing imperative APIs like `request(animation)` does not violate this — those are external inputs from the consumer to the Model, not Model→Controller communication.

---

## The Second Prerequisite: Interaction→Controller or Interaction→Model→Controller?

With state-observation established as the universal Model→Controller paradigm, a second structural question emerges — one that the Movable package makes unavoidable: **should the Interaction talk to the Controller at all?**

### The Current Movable Data Flow

The Interaction currently acts as a **bilateral coordinator**, talking to both Model and Controller in parallel:

```
Interaction → Model    (beginMove, updatePosition, endMove)
Interaction → Controller (moveTo, markAsUserMoved, promoteLayer, demoteLayer)
```

Concretely:

```ts
// MovableDragInteraction.ts — onStart (line 28)
controller.markAsUserMoved();     // → Controller
controller.promoteLayer();        // → Controller
model.beginMove(e, node, id, group); // → Model

// onMove (line 15)
const { x, y } = model.updatePosition(e); // → Model computes position
controller.moveTo(x, y);                   // → Controller applies to DOM

// onEnd (line 46)
model.endMove();          // → Model
controller.demoteLayer(); // → Controller
```

The Interaction asks the Model to compute the new position, then *hands* that result to the Controller. The Model computes but doesn't own the result as state. The Controller stores it locally (`currentX`, `currentY`) and applies it to the DOM. This creates **split ownership**: the Model knows the business constraints (limits, clamping, collisions), but the Controller holds the actual position.

### Option A: Keep Interaction→Controller (Status Quo)

The Interaction coordinates both sides. The Controller receives direct commands from the Interaction for DOM concerns.

**Pros:**
- Direct `moveTo()` calls during 60fps drag are zero-overhead — no reactive observation layer in the hot path
- The Controller's `moveTo()` feeds a `requestAnimationFrame` loop that batches visual updates; injecting reactivity here would add a scheduling layer on top of an existing scheduling layer
- The Interaction already knows *when* DOM operations should happen (promote on pointer enter, demote on pointer leave) — routing through the Model would mean encoding presentation timing in business logic

**Cons:**
- The Interaction becomes a coordinator with knowledge of *two* systems — violating its stated responsibility as a pure "hardware translator" (§4)
- `markAsUserMoved()` is arguably business logic (it controls the Smart Anchor behavior — virgin vs. dirty state), yet it's a Controller method called by the Interaction, bypassing the Model entirely
- The Controller exposes a `MovableItemControllerInteractionAPI` with 6 members — this is a coupling surface between Interaction and Controller that the architecture doesn't account for
- Split position ownership: the Model computes position (`updatePosition` returns `{x, y}`) but the Controller stores it (`currentX`, `currentY`). Neither fully owns the position

### Option B: Interaction→Model→Controller (State-Observation Chain)

The Interaction talks **only** to the Model. The Model owns all state — including the computed position. The Controller observes Model state and reacts.

```
Interaction → Model (beginMove, updatePosition, endMove)
                ↓ state changes
             Controller observes (position, isDragging, layer intent)
```

Under this pattern:

```ts
// Interaction — only talks to Model
const onStart = (e: PointerEvent) => {
  model.beginMove(e, node, id, group);
};
const onMove = (e: PointerEvent) => {
  model.updatePosition(e); // Model stores position internally
};
const onEnd = (e: PointerEvent) => {
  model.endMove();
};

// Controller — observes Model
$effect(() => {
  const pos = this.#model.position; // reactive
  if (pos) this.#applyTransform(pos.x, pos.y);
});
$effect(() => {
  if (this.#model.isDragging) this.#promoteLayer();
  else this.#demoteLayer();
});
```

**Pros:**
- The Interaction becomes a true hardware translator — it only says "the user did X" to the Model, never touches DOM concerns
- Position ownership is unified: the Model computes, stores, and exposes it; the Controller reads and renders
- `markAsUserMoved` (Smart Anchor) moves to the Model where it belongs — it's a business state transition, not a DOM concern
- The Controller has zero coupling to the Interaction — it doesn't even know the Interaction exists
- Consistent with the universal state-observation decision: the Controller observes the Model, period
- The Interaction→Model→Controller chain mirrors the architecture's information flow: hardware → business logic → DOM

**Cons:**
- **Performance in the hot path.** During a 60fps drag, each `pointermove` event triggers: (1) Model state mutation, (2) Svelte reactive notification, (3) `$effect` execution, (4) Controller applies transform. Today it's: (1) Model computes, (2) Controller applies. The reactive layer adds overhead in the tightest loop
- **Reactive scheduling vs. rAF scheduling.** The Controller already batches DOM writes via `requestAnimationFrame`. If the Controller uses `$effect` to observe position, the effect runs synchronously on state change (Svelte 5 microtask scheduling), then the Controller queues a rAF. The two scheduling systems (Svelte's reactivity and the Controller's rAF) overlap. The alternative — doing the DOM write inside the `$effect` without rAF — risks layout thrashing if multiple state changes fire in the same frame
- **The `rootNode` and `node` problem.** The Controller needs `HTMLElement` references that the Model shouldn't own. Currently the Interaction passes `node` directly. Under Option B, the Model receives the node in `beginMove()` and exposes it — but a Model holding DOM references contradicts its nature as a "mathematically pure" unit (§4)

### What Apple Does

**UIKit (pre-SwiftUI):** `UIGestureRecognizer` → target-action → `UIViewController` → Model update → View update. The gesture recognizer talks to the ViewController (which is both Controller and View coordinator). The ViewController updates the Model. The View observes. This is effectively **Interaction→Controller→Model**, with the Controller as mediator — the *opposite* of what Option B proposes.

**SwiftUI:** `DragGesture` → `.onChanged { value in model.position = ... }` → View observes `model.position` → re-render. The gesture handler updates the Model directly. The View observes. There is no Controller. This is **Interaction→Model→View**.

**SwiftUI with explicit animation control (closer to our case):**

```swift
struct DraggableView: View {
    @State private var position = CGPoint.zero

    var body: some View {
        Circle()
            .position(position)
            .gesture(
                DragGesture()
                    .onChanged { value in
                        position = value.location // Model state update
                    }
            )
    }
}
```

The pattern is unambiguous: **the gesture updates the Model (state), the View observes the state and renders.** There's no intermediary that receives coordinates and applies them to the DOM — SwiftUI's rendering engine handles that automatically via state observation.

The critical difference: SwiftUI's rendering engine is *itself* the Controller. When `position` changes, SwiftUI diffs the view tree and applies the DOM-equivalent update. This is **Interaction→Model→[implicit Controller]** — exactly Option B, with the Controller being the framework's rendering pipeline.

In our architecture, the Controller is explicit because Svelte doesn't provide the same level of automatic DOM management for imperative operations (WAAPI, `transform`, `will-change`). But the *information flow* should match: the Interaction informs the Model, the Controller observes.

### The Performance Question, Honestly Examined

The obvious objection is performance. A 60fps drag means ~16ms per frame. Does adding a reactive layer break the budget?

**What actually happens under Option B:**
1. `pointermove` fires → Interaction calls `model.updatePosition(e)`
2. Model mutates `this.#position = { x, y }` (a `$state` signal)
3. Svelte's reactivity schedules the dependent `$effect` (microtask, effectively synchronous within the same event handler)
4. The `$effect` in the Controller fires, reads `model.position`, calls `requestAnimationFrame` to batch the DOM write
5. Next frame: DOM write happens

**What happens today:**
1. `pointermove` fires → Interaction calls `model.updatePosition(e)`, gets `{x, y}` back
2. Interaction calls `controller.moveTo(x, y)`
3. Controller sets `isDirty = true`, stores pending values
4. Next frame (already-running rAF loop): DOM write happens

The difference is steps 2-3: a reactive signal + `$effect` execution vs. a direct function call. In practice, Svelte 5's signal system is nanosecond-scale for a single dependency. The real cost would be if the `$effect` triggered *other* reactive consumers or caused unnecessary re-renders.

**Mitigation:** The Controller's `$effect` should be the *only* observer of `model.position` during drag. If the template also reads `model.position` (for a HUD or debug display), Svelte's fine-grained reactivity ensures each consumer is notified independently — the Controller's `$effect` doesn't re-render the template. This is a non-issue in practice.

**The rAF overlap:** Under Option B, the Controller can still use rAF internally. The `$effect` fires synchronously, marks the position as dirty, and the existing rAF loop picks it up. The two systems coexist without conflict — the `$effect` is the *trigger*, rAF is the *batcher*. This is no different from how the Attention Requester Controller would work under the state-observation pattern.

### The `node` Problem: What Belongs in the Model?

Currently `model.beginMove(e, node, id, group)` receives an `HTMLElement` — the Model needs it for `getBoundingClientRect()` and limit calculations. This is already a compromise: the Model holds a DOM reference.

Under Option B this doesn't get worse — the Model already receives `node`. What changes is that `markAsUserMoved` moves to the Model (where it belongs as business state), and the Controller no longer exposes an `InteractionAPI` (since the Interaction never talks to it).

The `rootNode` is already `$state` on the Model (line 30 of `MovableModel.svelte.ts`). The Model holding DOM references for measurement purposes is a pragmatic choice — these are **read-only measurement inputs**, not DOM manipulation. The Model reads geometry from the DOM the same way it would read sensor data from any external source. The Controller is the only one that *writes* to the DOM.

### Recommendation

**Option B (Interaction→Model→Controller) should be the standard**, for consistency and correctness:

1. **It completes the state-observation chain.** The universal decision says Model→Controller is state-observation. If the Interaction bypasses the Model and commands the Controller directly, we have two communication channels: Interaction→Controller (command-dispatch) and Model→Controller (state-observation). This is exactly the kind of inconsistency the prerequisite section was designed to prevent.

2. **It fixes the split ownership.** Position is a domain concept — it's bounded, clamped, and drives collision detection. The Model already computes it. It should also own it as state, not return it as a value for someone else to store.

3. **It restores the Interaction's role.** The architecture defines the Interaction as a "hardware translator" (§4). A translator says "the user moved to coordinates X,Y." It doesn't say "Controller, apply this transform" and "also promote the GPU layer." Under Option B, the Interaction becomes what §4 promises: a pure adapter between hardware events and Model commands.

4. **Apple's pattern confirms it.** SwiftUI's gesture → state → rendering pipeline is exactly Interaction→Model→Controller. The explicit Controller is our adaptation for imperative DOM work that Svelte can't do declaratively, but the information flow should match.

5. **The performance cost is negligible.** One reactive signal per pointer event, in a system already built on reactive signals, is not a bottleneck.

### What This Means for `MovableItemControllerInteractionAPI`

Under Option B, this interface disappears entirely. The Controller doesn't expose an API to the Interaction because the Interaction doesn't know the Controller exists. The Controller's only input is Model state. Its only output is DOM manipulation.

The Controller still needs `node` and `rootNode` — but it gets `rootNode` from the Model (which already stores it) and `node` at construction time (as it does today).

### Caveat: Hover Layer Promotion

The current Interaction promotes/demotes the GPU layer on `pointerenter`/`pointerleave` — a pure visual optimization unrelated to business state. Under strict Option B, this would need to flow through the Model (`model.hover(id)` / `model.unhover(id)`), which feels like encoding a rendering optimization in business logic.

**Resolution:** Hover-driven layer promotion is a **Controller concern triggered by DOM events**, not by Model state. The Controller can observe pointer events on its own element for this purpose — the same way it observes `ResizeObserver`. The Interaction's role is to translate *user intent* (drag), not *browser hints* (hover for GPU promotion). The Controller can handle hover layer management directly without involving either the Model or the Interaction.

---

## The Question

In the Attention Requester, the Svelte template acts as a wiring hub between Model and Controller:

```svelte
<!-- AttentionRequester.svelte (lines 25–28) -->
$effect(() => controller?.syncActive(model.isActive));
$effect(() => controller?.syncPauseIntent(model.pauseIntent));
```

The Controller already holds a private reference to the Model (`this.#model`). Could it observe Model state directly — using `$effect` internally — eliminating the template as intermediary? And should this be an architectural decision, not just a local refactor?

---

## Current State Across Packages

| Package | Template `$effect` routing? | Controller has `#model` ref? | Controller reads Model directly? |
|---|---|---|---|
| **Attention Requester** | Yes — 2 effects route `isActive` and `pauseIntent` | Yes | Yes — reads `animation`, `isPaused`, `isActive` inside `#startCycle()` |
| **Movable** | No — Controller is created in an action, no template effects | Yes | Yes — all interaction is event-driven (drag callbacks), not reactive observation |

The discrepancy exists because the two packages have fundamentally different interaction patterns:

- **Movable** is **event-driven**: drag start → move → end. The Controller is called directly during events. No reactive observation needed.
- **Attention Requester** is **state-driven**: Model state changes (active, paused, intent) and the Controller must react. Someone must observe — the question is *where*.

---

## Option A: Keep Template as Wiring Hub (Status Quo)

The template `$effect` blocks explicitly show how Model state flows to Controller methods.

**Pros:**
- Wiring is visible and declarative in one place — the template reads like a "connection diagram"
- Aligns with Svelte's design philosophy: effects belong in components, not utility classes
- The Controller remains a pure imperative executor — it doesn't "watch" anything, it gets told
- Lifecycle is trivially managed: effects die with the component, no cleanup concerns

**Cons:**
- Template accumulates wiring boilerplate that isn't about rendering or user intent — violates the View's two stated responsibilities (§1: render state, capture intent)
- As packages grow in complexity, the template becomes cluttered with plumbing `$effect` blocks that aren't about the DOM
- The Controller already reads the Model directly in several places (`#startCycle` reads `model.animation`, `model.isPaused`, `model.isActive`) — the "pure executor" boundary is already porous

---

## Option B: Controller Observes Model Directly

The Controller uses `$effect` internally (viable — the file is `.svelte.ts`) to react to Model state changes. The template no longer routes between the two.

```ts
// Hypothetical: inside AttentionRequesterController constructor
$effect(() => {
  if (this.#model.isActive && !this.#anim) {
    this.#startCycle();
  }
});

$effect(() => {
  this.#handlePauseIntent(this.#model.pauseIntent);
});
```

**Pros:**
- Template is cleaner — only rendering and intent capture, true to §1
- Controller becomes self-contained: given a Model and a DOM element, it knows what to do
- Eliminates the "sync method" pattern (`syncActive`, `syncPauseIntent`) — the Controller just *reacts*
- The Movable package already works this way conceptually (Controller acts autonomously once created)
- Scales better: adding new reactive wiring doesn't touch the template

**Cons:**
- The Controller is no longer a purely passive executor — it becomes a reactive observer
- `$effect` in a class constructor requires the instance to be created within a reactive ownership context (component or `$effect.root`), or effects won't auto-cleanup. Currently this is satisfied because the Controller is instantiated inside a component `$effect`, but it's an implicit contract
- Makes the wiring invisible — a developer reading the template won't see how Model and Controller communicate
- Debugging reactive chains across files (template → Model → Controller) is harder than seeing explicit `$effect` blocks in one place

---

## The Architectural Tension

The architecture defines the Controller as an **"agent of the Model that obeys its orders"** (§3). The question is: what does "obedience" look like in a reactive system?

### Interpretation 1: Obedience = Passivity
The Controller is passive — it does nothing until explicitly called. The template (or some orchestrator) watches Model state and tells the Controller what to do. The Controller never initiates action on its own.

This is the current Attention Requester pattern. The `sync` methods are the "orders."

### Interpretation 2: Obedience = Self-Governance Within Orders
The Controller is given a mandate — "you serve this Model" — and autonomously reacts to the Model's state within that mandate. It still never *decides* business logic (the Model does), but it *observes and executes* without needing a middleman.

This is closer to how a real "agent" works. A secretary doesn't need the boss to tap their shoulder every time a directive appears on the board — they watch the board themselves.

### Interpretation 3: Hybrid
The Controller observes Model state directly for its **core operational loop** (the things it always needs to react to), but the template can still pass through one-off signals or prop-derived state (like the `paused` prop routing to `model.pause()`).

---

## The Svelte-Specific Consideration

Svelte 5's reactivity model is built around **ownership**: effects created within a component's lifecycle are automatically cleaned up when the component is destroyed. This is a powerful guarantee that eliminates a whole class of memory leak bugs.

When a Controller creates `$effect` in its constructor, it inherits the ownership of whoever instantiated it. If the Controller is created inside a component's `$effect` or `onMount`, the ownership chain is preserved. But this is an **implicit contract** — nothing in the Controller's type signature communicates "I must be instantiated within a reactive context."

Possible mitigations:
- Document the constraint clearly
- Use `$effect.root` explicitly and return a cleanup function (making ownership explicit, but losing automatic cleanup)
- Accept the implicit contract as a convention — it's already the case for any `.svelte.ts` class that uses runes

The `.svelte.ts` extension was *designed* for this — classes that participate in Svelte's reactive system. Using `$effect` inside a Controller isn't fighting Svelte; it's using the tool as intended. The question is whether it fits the *architecture's* intent.

---

## A Third Perspective: What About `$derived`?

There may be a middle path that avoids `$effect` entirely in the Controller. Instead of the Controller *reacting* to Model state changes (which requires effects), the Controller could expose derived computations that the template consumes.

But this doesn't apply here — the Controller's job is to perform **side effects** (start animations, pause WAAPI, clear timeouts). Side effects require `$effect` by definition. `$derived` is for pure computations.

The real question is: who owns the `$effect` that bridges "Model state changed" → "Controller performs side effect"?

---

## The Third Prerequisite: Controller Lifecycle and Reactive Ownership

With the two prior decisions settled — state-observation is universal, Interaction→Model→Controller is the standard — the original question (where does the `$effect` bridge live?) has a forced answer: **inside the Controller**. The Controller must observe the Model directly. There's no alternative left.

But this introduces a concrete Svelte-specific problem that the earlier analysis flagged as a "manageable concern" without fully working through it: **reactive ownership and cleanup**.

### The Problem

Svelte 5's `$effect` relies on **ownership**: effects created within a component's reactive scope are automatically cleaned up when the component is destroyed. When a Controller uses `$effect` internally, it needs to be instantiated within a reactive ownership context — otherwise the effects become orphaned and leak.

The two reference packages instantiate Controllers in fundamentally different ways:

**Attention Requester (self-contained):**

```svelte
<!-- AttentionRequester.svelte -->
$effect(() => {
  if (!el) return;
  controller = new AttentionRequesterController(el, model);
  return () => controller?.destroy();
});
```

The Controller is created inside a `$effect` → it inherits the component's reactive scope → any `$effect` inside the Controller constructor would be auto-cleaned. But the Controller also has an explicit `destroy()` method that cancels WAAPI animations and clears timeouts — side effects that Svelte's ownership system doesn't know about.

**Movable (Context-based):**

```svelte
<!-- MovableItem.svelte -->
const item: Action<HTMLElement> = (node) => {
  const controller = createMovableItemController(node, model, id, initialPosition, group);
  return { destroy: controller.destroy };
};
```

The Controller is created inside a **Svelte action** (`use:item`). Actions are imperative callbacks — they execute during DOM mount, **not within a reactive ownership context**. If `createMovableItemController` creates `$effect` internally, those effects have **no owner** and will **never be cleaned up**. This is a hard memory leak.

### The Divergence

| | Attention Requester | Movable |
|---|---|---|
| **Instantiation context** | `$effect` block (reactive scope) | Svelte action (imperative, no reactive scope) |
| **Reactive ownership** | ✓ Inherited from component | ✗ None |
| **`$effect` inside Controller would...** | Auto-cleanup on component destroy | Leak — never cleaned up |
| **Current cleanup** | `$effect` return callback → `destroy()` | Action return → `destroy()` |
| **Controller form** | Class (`new AttentionRequesterController`) | Factory function (`createMovableItemController`) |

The Movable pattern is fundamentally incompatible with "Controller observes Model via `$effect`" unless the instantiation site changes.

### Option 1: Move Movable's Controller Out of the Action

Instantiate the Controller inside the component's `<script>` (in a `$effect` block), not inside the action. The action still provides the `node`, but the Controller is created in a reactive context.

```svelte
<!-- Hypothetical MovableItem.svelte -->
let node = $state<HTMLElement | null>(null);
let controller = $state<MovableItemController | null>(null);

$effect(() => {
  if (!node) return;
  controller = new MovableItemController(node, model, id, initialPosition, group);
  return () => controller?.destroy();
});

const item: Action<HTMLElement> = (n) => { node = n; };
```

**Pros:**
- Reactive ownership ✓ — `$effect` inside Controller auto-cleanups
- Consistent with Attention Requester's pattern
- The action becomes a pure node-capture mechanism, not a lifecycle owner

**Cons:**
- Adds indirection: action captures node → `$state` change → `$effect` fires → Controller created. Today: action fires → Controller created. One step vs. three
- The action's `destroy()` return was a natural cleanup point; now cleanup is split between the `$effect` return (for reactive cleanup) and the Controller's `destroy()` (for imperative cleanup like rAF, ResizeObserver)
- Every Context-based component would need this same boilerplate pattern

### Option 2: Use `$effect.root` Inside the Controller

The Controller explicitly creates an effect root and manages its own cleanup:

```ts
// Inside Controller constructor
this.#cleanupEffects = $effect.root(() => {
  $effect(() => {
    const pos = this.#model.position;
    if (pos) this.#applyTransform(pos.x, pos.y);
  });
  $effect(() => {
    if (this.#model.isDragging) this.#promoteLayer();
    else this.#demoteLayer();
  });
});

// In destroy()
destroy() {
  this.#cleanupEffects();
  // ... other cleanup
}
```

**Pros:**
- Works regardless of instantiation context — action, `$effect`, `onMount`, anywhere
- The Controller fully owns its lifecycle — no implicit contracts about where it must be created
- The existing `destroy()` pattern already exists in both packages; this just adds effect cleanup to it
- No changes needed to how components instantiate Controllers

**Cons:**
- Loses Svelte's automatic ownership chain — if `destroy()` isn't called, effects leak
- But: `destroy()` not being called is already a bug today (it would leak WAAPI animations, timeouts, ResizeObservers). This doesn't introduce a new failure mode — it adds effects to an existing cleanup list

### Option 3: Standardize on `$effect`-Based Instantiation (Unify Both Patterns)

Mandate that all Controllers are created inside a `$effect` block in the component `<script>`. The Svelte action is used only to capture the node reference. Both self-contained and Context-based packages follow the same pattern.

```svelte
<!-- Universal pattern -->
let node = $state<HTMLElement | null>(null);

$effect(() => {
  if (!node) return;
  const ctrl = new SomeController(node, model);
  return () => ctrl.destroy();
});

<!-- Action just captures the node -->
const action: Action = (n) => { node = n; return {}; };
```

**Pros:**
- One pattern for all packages — no divergence
- Reactive ownership guaranteed — `$effect` inside Controller auto-cleanups
- `destroy()` handles only imperative cleanup (WAAPI, rAF, observers); reactive cleanup is automatic
- The template's `$effect` block is minimal — one effect per Controller, not one per state property

**Cons:**
- Forces Movable to change its instantiation pattern
- The action loses its role as lifecycle owner — it becomes a glorified `bind:this` alternative
- Two-step initialization: node captured → effect fires → Controller created. A frame may pass between node mount and Controller creation (though in practice, `$effect` runs synchronously in the same microtask)

### What Apple Does

SwiftUI doesn't have this problem because it doesn't have explicit Controllers. But the lifecycle management of observable objects is instructive:

- **`@State`**: The view owns the state. Created when the view first appears, destroyed when it disappears. Automatic lifecycle.
- **`@StateObject`**: Like `@State` but for reference types (classes). The view creates and owns the object. SwiftUI guarantees it's created exactly once and destroyed when the view is removed. This is the closest analogue to "Controller owned by component."
- **`@ObservedObject`**: The view does NOT own the object — it just observes it. Lifecycle is managed by whoever creates it. If the creator dies, the object must be cleaned up explicitly.
- **`@Environment`**: Injected from a parent view. The parent owns it; children observe it.

The pattern: **the creator owns the lifecycle**. SwiftUI enforces this with property wrappers that encode ownership semantics in the type system. `@StateObject` says "I create and own this." `@ObservedObject` says "someone else owns this, I just watch."

In our architecture:
- The **component** (View) is the natural owner of the Controller — it creates it and destroys it when unmounting
- This is `@StateObject` semantics: the component creates the Controller, owns its lifecycle, and Svelte's reactive system handles cleanup of effects created within the component's scope

`$effect.root` is closer to `@ObservedObject` — the Controller manages its own effects, but someone else must call `destroy()`. It works, but the ownership is manual and implicit.

### Recommendation

**Option 3 (standardize on `$effect`-based instantiation)**, combined with `$effect.root` as a fallback for edge cases.

The reasoning:

1. **One pattern for all packages.** Both self-contained (Attention Requester) and Context-based (Movable) components create Controllers the same way: `$effect` block in the `<script>`, with the action reduced to a node-capture mechanism. This eliminates the current divergence where one package uses `$effect` and the other uses actions for lifecycle.

2. **Reactive ownership by default.** When the Controller is created inside a `$effect`, any `$effect` it creates internally inherits the component's scope. Svelte handles cleanup automatically. The Controller's `destroy()` method handles only imperative resources (WAAPI animations, timeouts, rAF, ResizeObservers) — things Svelte's reactive system can't know about.

3. **`$effect.root` as documented escape hatch.** If a Controller must be created outside a reactive context (e.g., dynamically created Controllers, or future use cases where the instantiation site can't be a `$effect`), the Controller may use `$effect.root` internally. The convention: if the Controller uses `$effect.root`, its `destroy()` method is **mandatory**, and calling code must guarantee cleanup. This mirrors `@ObservedObject` vs. `@StateObject` — the ownership contract is explicit.

4. **The action's new role is honest.** Currently, the Movable action pretends to own the Controller's lifecycle (it returns `{ destroy: controller.destroy }`). But if the Controller has internal `$effect`s, the action *can't* own their lifecycle — it's outside the reactive system. Reducing the action to a node-capture mechanism is more honest about what it actually controls.

5. **The "one extra frame" concern is a non-issue.** Svelte 5's `$effect` runs synchronously during component initialization. When the action captures `node` and assigns it to a `$state` variable, the dependent `$effect` fires in the same microtask. There is no visible frame where the node exists but the Controller doesn't.

### The Standard Pattern

```svelte
<!-- Standard Controller instantiation — all packages -->
<script lang="ts">
  let node = $state<HTMLElement | null>(null);

  $effect(() => {
    if (!node) return;
    const controller = new SomeController(node, model);
    return () => controller.destroy();
  });

  // Action captures the node, nothing more
  const action: Action = (n) => { node = n; return {}; };
</script>
```

The Controller internally:

```ts
// SomeController.svelte.ts
export class SomeController {
  constructor(node: HTMLElement, model: SomeModel) {
    // These $effects inherit the component's reactive scope
    $effect(() => {
      // observe model, perform side effects
    });
  }

  destroy() {
    // Imperative cleanup only: WAAPI, rAF, ResizeObserver, timeouts
    // Reactive cleanup ($effect) is automatic via ownership
  }
}
```

### Caveat: `destroy()` Remains Necessary

Even with automatic reactive cleanup, Controllers perform imperative side effects that `$effect` teardown doesn't cover:
- WAAPI animations (`animation.cancel()`)
- `requestAnimationFrame` loops (`cancelAnimationFrame`)
- `ResizeObserver` (`observer.disconnect()`)
- `setTimeout` / `setInterval` (`clearTimeout`)

These require explicit cleanup in `destroy()`. The `$effect` return callback in the component ensures `destroy()` is always called on unmount. The reactive effects are cleaned up by Svelte's ownership system; the imperative resources are cleaned up by `destroy()`. Two systems, non-overlapping responsibilities.

### Prop→Model Routing Stays in the Template

As noted in the earlier analysis: routing external inputs (props) to the Model is a View responsibility. `$effect(() => paused ? model.pause() : model.resume())` correctly belongs in the template — it translates a View-level concern (a prop) into a Model action. The only `$effect` blocks that move out of the template are **Model→Controller** bridges. **Prop→Model** bridges stay.

### As an Architectural Decision

> **Controllers are `.svelte.ts` classes that observe Model state directly via `$effect`.** They are instantiated inside a `$effect` block in the component `<script>`, which guarantees reactive ownership and automatic cleanup of internal effects. The Svelte action is used solely to capture the `HTMLElement` reference; it does not own the Controller's lifecycle.
>
> The Controller's `destroy()` method handles imperative cleanup (WAAPI, rAF, observers, timers). Reactive cleanup is automatic.
>
> The template `<script>` contains only: (1) a `$effect` that bridges props to the Model, (2) a `$effect` that creates and destroys the Controller, and (3) the action for node capture. No `$effect` in the template routes Model state to the Controller — the Controller handles that internally.
>
> If a Controller must be created outside a reactive context, it uses `$effect.root` internally and documents the mandatory `destroy()` call. This is the exception, not the default.

---

## Conclusions and Architectural Directives

This memo explored three layered questions. Each produced a decision and a directive to be added to Architecture.md.

---

### Conclusion 1: State-Observation is the Universal Model→Controller Paradigm

**Decision:** All Model→Controller communication follows the state-observation paradigm (pull/reactive). The Controller observes Model state and reacts. The Model never calls Controller methods and has no knowledge that Controllers exist.

**Primary motivation:** Keeping the Model agnostic of Controllers. The Model is pure business logic — it exposes state and typed intents. It doesn't know who's watching, how many observers exist, or what they do with the information. This is the same contract SwiftUI's `@Observable` follows: the Model publishes facts, it doesn't issue commands.

**Directive:**

> **§3 — Model→Controller Communication**
>
> The Model communicates with Controllers exclusively through state-observation. The Model exposes reactive state and typed intents (`$state`, `$derived`); the Controller observes and reacts via `$effect`. The Model never holds references to Controllers, never calls Controller methods, and has no knowledge of their existence.
>
> Consumer-facing imperative APIs (e.g., `request(animation)` via `bind:this`) are external inputs from the consumer to the Model — they do not constitute Model→Controller communication.
>
> Command-dispatch (`controller.doSomething()`) is reserved exclusively for the consumer's imperative API surface (§5), not for internal Model→Controller flow.

---

### Conclusion 2: Interaction→Model→Controller is the Standard Data Flow

**Decision:** The Interaction talks only to the Model. The Controller observes Model state. The Interaction never communicates with the Controller directly.

**Primary motivation:** Respecting the existing architectural rules. The Model owns all state (§2) — position, drag state, collision state. The Controller is commanded by the Model, not by the Interaction (§3). The Interaction is a pure hardware translator (§4) — it says "the user did X", it doesn't coordinate DOM operations. Allowing the Interaction to talk to the Controller creates a second communication channel that bypasses the Model, violating all three rules simultaneously.

**Directive:**

> **§4 — Interaction Data Flow**
>
> The Interaction communicates exclusively with the Model. It translates hardware events (pointer, keyboard, touch) into Model method calls (`model.beginMove()`, `model.updatePosition()`, `model.endMove()`). It never holds a reference to the Controller and never calls Controller methods.
>
> The Controller observes the resulting Model state changes and applies them to the DOM. The data flow is always: **Interaction → Model → Controller**.
>
> DOM-level concerns that are not user intent (e.g., GPU layer promotion on hover, cursor style changes) are the Controller's own responsibility. The Controller may observe DOM events directly on its element for these purposes, the same way it observes `ResizeObserver`. These are not Interaction concerns.

---

### Conclusion 3: The Component Owns the Controller's Lifecycle

**Decision:** Controllers are `.svelte.ts` classes that use `$effect` internally to observe Model state. They are instantiated inside a `$effect` block in the component `<script>`, which provides reactive ownership. The Svelte action is used solely to capture the `HTMLElement` reference. The component guarantees cleanup on unmount.

**Primary motivation:** Keeping the template clean — the View should render state and capture intent (§1), not route plumbing between Model and Controller. Making the Controller a reactive `.svelte.ts` class that observes the Model internally moves all wiring out of the template. This raises the lifecycle question: who creates and destroys the Controller? Since there is no app delegate or centralized lifecycle manager — everything is a component, including Context providers — the answer is universal: **the component that creates the Controller owns its lifecycle**. When the component unmounts, it destroys the Controller, cleaning up both reactive effects (automatic via Svelte's ownership) and imperative resources (explicit via `destroy()`).

**Directive:**

> **§3 — Controller Lifecycle and Reactive Ownership**
>
> Controllers are `.svelte.ts` classes. They observe Model state directly via `$effect` in their constructor. They are always instantiated inside a `$effect` block in the component `<script>`:
>
> ```svelte
> let node = $state<HTMLElement | null>(null);
>
> $effect(() => {
>   if (!node) return;
>   const controller = new SomeController(node, model);
>   return () => controller.destroy();
> });
>
> const action: Action = (n) => { node = n; return {}; };
> ```
>
> This pattern is universal — self-contained components and Context-based components follow the same structure. The `$effect` block provides reactive ownership: any `$effect` created inside the Controller inherits the component's scope and is automatically cleaned up on unmount.
>
> The Controller's `destroy()` method handles imperative cleanup only: WAAPI animations, `requestAnimationFrame`, `ResizeObserver`, timers. Reactive cleanup is automatic.
>
> The Svelte action captures the `HTMLElement` reference. It does not own the Controller's lifecycle.
>
> **The rule:** the component that creates the Controller is responsible for ensuring nothing leaks when it unmounts. No exceptions — this applies equally to self-contained Modifiers, Context-based Items, and any future package.
>
> **Escape hatch:** If a Controller must be created outside a reactive context, it uses `$effect.root` internally and its `destroy()` call is mandatory. This is the exception, not the default.

---

### Summary Table

| Question | Decision | Key Motivation |
|---|---|---|
| How does Model talk to Controller? | State-observation (universal) | Model stays agnostic of Controllers |
| How does Interaction flow? | Interaction→Model→Controller | Respects existing rules: Model owns state, Controller obeys Model, Interaction just translates |
| Who owns the Controller's lifecycle? | The component that creates it | Everything is a component; `$effect` provides reactive ownership; `destroy()` handles imperative cleanup |
