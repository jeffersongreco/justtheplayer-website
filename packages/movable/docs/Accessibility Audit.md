# Accessibility Audit — Movable

> Gap analysis against the architecture's accessibility checklist (§13).
> Implementation is deferred — this document identifies what needs to be done.

---

## Current State

The movable package supports pointer-based drag interactions only. There is no keyboard alternative, no ARIA roles for drag-and-drop, and no reduced-motion handling.

---

## Gap Analysis

### 1. Keyboard Alternative

**Status:** Missing

The Behavioral Specification (§12) defines keyboard-based movement: Tab to focus, Enter/Space to grab, Arrow keys to move in steps, Escape to cancel. None of this is implemented.

**What needs to happen:**
- Model needs `grabbed` state and `moveByStep(direction)` method
- A keyboard Interaction class that translates keydown events into Model commands
- Step size should be configurable (default: a reasonable increment, e.g. 10px)
- The Item Coordinator must react to `grabbed` state the same way it reacts to `activeItemID`

### 2. ARIA Roles and Attributes

**Status:** Missing

**What needs to happen:**
- Items should have `role="application"` or `role="button"` with `aria-roledescription="draggable"`
- `aria-grabbed` attribute reflecting grab state (true/false)
- `aria-dropeffect` on sensors when an item is being dragged
- `aria-describedby` linking to instructions for keyboard users

### 3. Focus Management

**Status:** Partial

The Item component has `tabindex` and focus/blur handlers, but:
- No `aria-live` announcements for position changes
- Focus ring is suppressed via CSS (`outline: none`) without a visible alternative during keyboard drag
- No focus trap prevention verified

**What needs to happen:**
- Visible focus indicator during keyboard grab
- `aria-live="assertive"` region announcing position changes and sensor proximity
- Ensure focus is not trapped — Tab should always escape the drag context

### 4. Reduced Motion

**Status:** Missing

No `prefers-reduced-motion` handling exists.

**What needs to happen:**
- The ghost emoji's CSS float animation should respect `prefers-reduced-motion`
- Any future transition animations on drag should be suppressible
- The Coordinator should check the media query and skip non-essential animations

### 5. Animation Safety

**Status:** Partial (by design)

- No animations flash > 3Hz (drag is continuous, not flashing)
- Animation does not block interaction (drag is the interaction itself)
- The `animation-play-state: paused` rule on `[data-dragging="true"]` correctly pauses child animations during drag

---

## Priority Order

1. **Keyboard alternative** — highest impact, required for basic accessibility
2. **ARIA roles and attributes** — needed for screen reader users
3. **Reduced motion** — needed for vestibular sensitivity
4. **Focus management improvements** — refinement of existing partial support
5. **aria-live announcements** — enhanced screen reader experience

---

## Checklist Process (§13)

When implementing, run the 5-step a11y process:
1. Svelte warnings (compile-time)
2. axe-core automated scan
3. Keyboard-only navigation test
4. VoiceOver manual test
5. Reduced-motion emulation test
