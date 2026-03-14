# Attention Requester — Behavioral Specification

---

## 1. Purpose

Attention Requester is a component that animates a target HTML element using to draw user attention (bounce, shake, pulse a gradient stroke, etc.). It supports one-shot and looping animations, pause/resume with differect interruption strategies, and cancellation.

---

## 2. State & Lifecycle

### 2.1 Idle → Animating

- The component starts in an idle state with no animations.
- Calling the component to animate transitions from idle to animating.
- The animation cycle begins: animation plays on the target element.
- The component is considered "animating" while the animation is running.

### 2.2 Cycle Completion

- **One-shot**: after the animation finishes, the component returns to idle.
- **Loop**: after each cycle finishes, the component waits some interval, then starts a new cycle. This repeats until the component is called to stop or the component is destroyed.

### 2.3 Cancellation

- When called to stop the component do a graceful stop: the current animation cycle finishes normally, then the loop does not continue. It does not abruptly abort mid-animation.
- After the final cycle completes, the component returns to idle.
- When called to stop during idle, nothing happens.

### 2.4 Re-entrancy

- Calling the component to animate during an animation, even the last cicle finishing after a call to stop: behavior is implementation-defined, but should not crash.

### 2.5 Destruction

- If the component is destroyed while an animation is running, all animations and pending timers must be cleaned up. No callbacks or restarts should fire after destruction.

---

## 3. Pause / Resume

Call the component to pause freezes the animation. Setting it back to animate resumes. The exact behavior depends on two strategies:

### 3.1 resume strategy (default)

- **Pause**: the animation is frozen in place.
- **Resume**: the animation continues from where it was paused.

### 3.2 reset strategy

- **Pause**: the animation is frozen in place.
- **Resume**: keeps frozen in place waiting the animation's interval duration, a new cycle starts from the element's current position that is now the new starting point.
- This strategy is designed for elements whose position may change externally (e.g., draggable elements). By reseting and restarting, the animation adapts to the element's new position.

### 3.3 Edge Cases

- Pausing when idle: **no-op** — there's nothing to pause.
- Pausing then cancelling: respect the Pause / Resume two strategies.
- Rapidly toggling pause: should not cause duplicate animations or leaked timers.

---

## 4. Pluggable Animations

The component is animation-agnostic — it does not define or decide how the element moves. Instead, the animation is provided by the caller at the moment it requests attention.

### 4.1 Animation as Data

- An animation is a self-contained description: it carries its own name, duration, visual keyframes, and (for looping animations) a rest interval between cycles.
- The component receives this description and plays it. It never modifies or interprets the visual content of the animation.

### 4.2 Loop Contract

- The animation itself declares whether it should loop or play once.
- A **looping animation** must also specify its rest interval — the pause between consecutive cycles. The component honors this interval as-is.
- A **one-shot animation** plays exactly once and has no interval.
- The component does not decide loop vs. one-shot; it follows what the animation declares.

### 4.3 Interruption Strategy

- Each calling to animate may declare how the component should behave when paused (its interruption strategy). If none is declared, the component defaults to the **resume** strategy (see §3).

### 4.4 Swappability

- Because animations are provided per-request, the caller can use a different animation each time without reconfiguring the component.
- The component must work correctly regardless of which animation is provided — no animation-specific assumptions.

---

## 5. Behavioral Invariants

These are properties that must hold at **all times**, regardless of state:

1. **Single animation**: at most one animation should be active on the target element at any time. No stacking of animations.
2. **Timer hygiene**: all timing handles must be cleared on cancellation and destruction. No orphaned timers.
3. **Idempotent cancel**: calling to stop multiple times must be safe.
4. **Idempotent pause**: calling to pause when already paused must be safe.
5. **State consistency**: the component's state must always be internally consistent — it should not report being animating when no animation is running, or idle when one is.

---

## 6. Context & Composition

- Tests that involve multiple instances should verify they don't interfere with each other.
- Multiple Attention Requester instances on the same page must operate independently.
