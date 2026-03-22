# @headless-uai/attention-requester

Headless Svelte 5 component that animates HTML elements using the Web Animations API (WAAPI) to draw user attention. Supports one-shot and looping animations, pause/resume with configurable interrupt strategies, reduced-motion preference, and full lifecycle cleanup.

## Quick Start

```svelte
<script lang="ts">
  import { AttentionRequester, PhysicsBounce } from "@headless-uai/attention-requester";

  let attention: AttentionRequester;
</script>

<AttentionRequester bind:this={attention}>
  <div class="target">Look at me!</div>
</AttentionRequester>

<button onclick={() => attention.request(PhysicsBounce())}>
  Bounce
</button>
```

## Component API

### `<AttentionRequester>`

A wrapper component that manages animation lifecycle on its child element. Renders with `display: contents` — no extra DOM nodes.

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `paused` | `boolean` | `false` | Pauses/resumes the active animation |
| `children` | `Snippet<[{ isAnimating: boolean }]>` | — | Default slot — wraps the target element |
| `asChild` | `Snippet<[{ attach, isAnimating }]>` | — | Extractable pattern — you control which element to attach to |

Use **either** `children` or `asChild`, not both.

#### Methods (via `bind:this`)

| Method | Signature | Description |
|---|---|---|
| `request` | `(animation, reducedMotionAnimation?) => void` | Start an animation. Optionally provide a fallback for reduced-motion users. |
| `cancel` | `() => void` | Gracefully stop — current cycle finishes, then returns to idle. |

### Rendering Modes

**Children mode** — wraps the target element directly:

```svelte
<AttentionRequester bind:this={attention}>
  {#snippet children({ isAnimating })}
    <div class:active={isAnimating}>Target</div>
  {/snippet}
</AttentionRequester>
```

**asChild mode** — you control attachment (useful for integration with other components):

```svelte
<AttentionRequester bind:this={attention}>
  {#snippet asChild({ attach, isAnimating })}
    <div use:attach>Target</div>
  {/snippet}
</AttentionRequester>
```

## Animations

Animations are **data-driven** — the component is animation-agnostic. Each animation is a self-contained description carrying its own name, duration, keyframes, loop behavior, and interrupt strategy.

### Built-in Factories

#### `PhysicsBounce(config?)`

Single elastic bounce with physics-inspired easing (7 keyframes, ~1000ms default).

#### `DoubleBounce(config?)`

Two bounces where the second has 66% amplitude of the first (6 keyframes, ~2000ms default).

### Bounce Config

Both factories accept the same configuration:

```ts
interface BounceConfig {
  direction?: BounceDirection;  // default: "up"
  distance?: number;            // pixels, default: 100
  duration?: number;            // ms, default: 1000 (PhysicsBounce) / 2000 (DoubleBounce)
  onInterrupt?: "resume" | "discard";  // default: "resume"
  loop?: boolean;               // default: false
  restDuration?: number;        // ms between cycles when loop=true, default: 3000
}
```

#### Direction

A cardinal string or a custom 3-axis vector:

```ts
type BounceDirection =
  | "up" | "down" | "left" | "right" | "forward" | "backward"
  | { x?: number; y?: number; z?: number };
```

### One-Shot vs Loop

```ts
// One-shot — plays once, returns to idle
PhysicsBounce({ direction: "up", distance: 80 })

// Loop — plays, waits 3s, repeats until cancelled
PhysicsBounce({ direction: "up", distance: 80, loop: true })

// Loop with custom rest interval
PhysicsBounce({ loop: true, restDuration: 5000 })
```

### Custom Animations

You can create your own animation by conforming to the `ARAnimationOneShot` or `ARAnimationLoop` interface:

```ts
import type { ARAnimationOneShot } from "@headless-uai/attention-requester";

const shake: ARAnimationOneShot = {
  name: "shake",
  duration: 500,
  keyframes: [
    { translate: "0px 0px", offset: 0 },
    { translate: "-10px 0px", offset: 0.25 },
    { translate: "10px 0px", offset: 0.5 },
    { translate: "-10px 0px", offset: 0.75 },
    { translate: "0px 0px", offset: 1 },
  ],
};

attention.request(shake);
```

The `keyframes` property can also be a function `(el: HTMLElement) => Keyframe[]` that reads the element's current position — useful for animations that adapt to dynamic layouts.

## Interrupt Strategies

When the component is paused mid-animation, the interrupt strategy determines what happens on resume:

### `"resume"` (default)

Freezes the animation in place. On resume, continues from where it stopped.

### `"discard"`

Freezes the element at its current computed position, cancels the animation internally. On resume, waits the rest interval, then starts a fresh cycle from the element's current position.

**Use `"discard"` for draggable or repositionable elements** — it adapts to position changes that happen while paused.

```ts
PhysicsBounce({ direction: "up", loop: true, onInterrupt: "discard" })
```

## Reduced Motion

The component respects `prefers-reduced-motion: reduce` automatically.

- **No fallback provided**: `request()` is silently suppressed — the component stays idle.
- **Fallback provided**: the fallback animation plays instead of the primary one.

```ts
const primary = PhysicsBounce({ distance: 100 });
const subtle = PhysicsBounce({ distance: 10, duration: 2000 });

attention.request(primary, subtle);
```

Reduced-motion preference is tracked dynamically. If the preference changes while the component is idle, the next `request()` picks the appropriate animation. An already-running animation is never interrupted by a preference change.

## Real-World Example

Integration with `@headless-uai/movable` — a draggable cursor that bounces when idle and pauses while being dragged:

```svelte
<script lang="ts">
  import { AttentionRequester, PhysicsBounce } from "@headless-uai/attention-requester";
  import { Movable } from "@headless-uai/movable";
  import { onMount } from "svelte";

  let attention: AttentionRequester;
  const animation = PhysicsBounce({
    direction: "up",
    loop: true,
    onInterrupt: "discard",
  });

  onMount(() => {
    const timeout = setTimeout(() => attention.request(animation), 4000);
    return () => clearTimeout(timeout);
  });
</script>

<Movable.Root>
  {#snippet asChild({ root })}
    <div use:root class="container">
      <Movable.Item initialPosition={{ x: "50%", y: "50%" }}>
        {#snippet children({ isMoving })}
          <AttentionRequester bind:this={attention} paused={isMoving}>
            <div class="cursor">👆</div>
          </AttentionRequester>
        {/snippet}
      </Movable.Item>
    </div>
  {/snippet}
</Movable.Root>
```

Key points:
- `paused={isMoving}` — animation pauses while the user drags
- `onInterrupt: "discard"` — after drag ends, animation restarts from the new position
- `loop: true` — continuous idle bounce until cancelled

## Behavioral Guarantees

- **Single animation**: at most one animation active on the target element at any time
- **Timer hygiene**: all handles cleared on cancellation and component destruction
- **Idempotent cancel/pause**: safe to call multiple times
- **State consistency**: `isAnimating` always reflects actual animation state
- **Independent instances**: multiple `<AttentionRequester>` components on the same page do not interfere with each other
- **Re-entrancy safe**: calling `request()` while animating does not crash
- **Graceful cancellation**: `cancel()` lets the current cycle finish before stopping

## Exported Types

```ts
// Animation types
ARAnimationConfig
ARAnimationLoop
ARAnimationOneShot
AttentionRequesterAnimation
AttentionInterruptBehavior    // "resume" | "discard"

// Bounce config types
BounceConfig
BounceConfigLoop
BounceConfigOneShot
BounceDirection
CardinalDirection
ThreeAxisDirection
ResolvedBounceParams

// Component types
AttentionRequester            // bind:this type (request, cancel)
AttentionRequesterProps
```

## Utility Functions

| Function | Signature | Description |
|---|---|---|
| `normalizeDirection` | `(dir: BounceDirection) => ThreeAxisDirection` | Converts a cardinal string or partial vector into a full `{ x, y, z }` vector |
| `makeTranslate` | `(x, y, z) => string` | Builds a CSS `translate` value string (`"Xpx Ypx Zpx"`) |
| `readCurrentTranslate` | `(el: HTMLElement) => { cx, cy, cz }` | Reads the element's current computed translate values |

These are useful when authoring custom animations that need to read or compose translate values.

## Architecture

Built on the **Model–View** pattern for Svelte 5:

| Layer | File | Responsibility |
|---|---|---|
| **Model** | `AttentionRequesterModel.svelte.ts` | State machine (`$state`, `$derived`) — isActive, isPaused, cancelled, reduced-motion |
| **View** | `AttentionRequesterModifier.svelte` | Svelte component — renders children, exposes `request`/`cancel`, declares `$effect` reactivity |
| **Coordinator** | `AttentionRequesterCoordinator.svelte.ts` | WAAPI lifecycle — playback, pause/resume strategies, cycle intervals, cleanup |

The component is fully headless — it applies no styles and adds no visible DOM nodes (`display: contents`).
