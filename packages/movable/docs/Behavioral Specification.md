# Movable — Behavioral Specification

---

## 1. Purpose

Movable is a component that makes elements draggable within a bounded area. It supports pointer-driven drag, boundary clamping, collision detection with drop zones, group-based filtering, smart anchor behavior on resize, and multi-item isolation.

---

## 2. Idle State

- Each draggable element starts at a declared initial position within the bounded area.
- The initial position may be expressed as an absolute value or a percentage of the bounded area's dimensions.
- While idle, the element is stationary and visually indicates it can be grabbed (e.g., cursor change on hover).
- No drag state is active. No drop zone is highlighted.

---

## 3. Drag Lifecycle

### 3.1 Begin

- A drag begins when the user presses the primary pointer button on a draggable element.
- Non-primary buttons (right-click, middle-click) do not initiate a drag.
- On drag start:
  - The element captures the pointer so all subsequent pointer events are directed to it, even if the pointer leaves its bounds.
  - The element's visual state changes to indicate it is being dragged (e.g., cursor changes from "grab" to "grabbing").
  - The system records the current position and pointer coordinates as the drag origin.
  - The boundaries are calculated from the bounded area's current dimensions minus the element's dimensions.

### 3.2 Move

- While dragging, the element follows the pointer.
- Position is computed as the drag origin offset plus the pointer delta since drag start.
- The position is clamped to the calculated boundaries (see §4).
- Drop zone collision detection runs on every move (see §5).
- Visual updates are batched to the next animation frame — not applied synchronously on every pointer event.

### 3.3 End

- A drag ends when the user releases the pointer or the pointer interaction is cancelled.
- On drag end:
  - The pointer capture is released.
  - The element's visual state returns to idle (cursor reverts to "grab").
  - If the element was over a compatible drop zone at the moment of release, the drop zone's callback fires.
  - The drag state is cleared.

### 3.4 Animation Pausing

- While an element is being dragged, all CSS animations on its descendant elements are paused.
- When the drag ends, animations resume.

---

## 4. Boundary Clamping

- A draggable element is always constrained within its bounded area.
- The element cannot be dragged beyond the edges of the bounded area.
- Boundaries are computed as: the bounded area's dimensions minus the element's dimensions, ensuring the element's full visual extent stays within bounds.
- If the bounded area is resized while a drag is not active, the element's position is recalculated (see §7 Smart Anchor).

---

## 5. Collision Detection

### 5.1 Overlap Detection

- During a drag, the system continuously checks whether the dragged element overlaps any registered drop zone.
- Two rectangles overlap when their horizontal and vertical extents both intersect (axis-aligned bounding box test).
- At most one drop zone is reported as "active" at a time (first match wins).

### 5.2 Group Filtering

- Each draggable element may belong to one or more groups.
- Each drop zone may declare which groups it accepts.
- A collision is only reported if:
  - The drop zone accepts all groups (empty accepts list), **or**
  - At least one of the dragged element's groups matches one of the drop zone's accepted groups.
- If no group match exists, the overlap is ignored — the drop zone is not activated.

### 5.3 Drop Callback

- When a drag ends and a compatible drop zone was active at that moment, the drop zone's callback fires.
- The callback fires exactly once per successful drop.
- If no drop zone was active, no callback fires.

---

## 6. Sensor Registration

### 6.1 Lifecycle

- A drop zone registers itself with the system when it mounts, providing its bounding rectangle and accepted groups.
- A drop zone unregisters itself when it is destroyed.

### 6.2 Accepts Filter

- The accepts list is set at registration time.
- An empty accepts list means the drop zone accepts elements from any group.

---

## 7. Smart Anchor

The system uses two positioning strategies depending on whether the user has interacted with the element:

### 7.1 Virgin State (percentage-responsive)

- Before the user has ever dragged the element, it is in "virgin" state.
- In virgin state, on bounded area resize, the initial position is re-resolved from the declared value.
- If the initial position is a percentage, the element repositions proportionally to the new dimensions.
- If the initial position is absolute, it stays at that absolute value (but still subject to boundary clamping).

### 7.2 Dirty State (pixel-clamped)

- Once the user drags the element even once, it transitions to "dirty" state permanently.
- In dirty state, on bounded area resize, the element's absolute pixel position is clamped to the new boundaries.
- The element never reverts to percentage-based positioning after being dragged.
- This prevents the element from "jumping" to a percentage-resolved position after the user deliberately placed it somewhere.

---

## 8. Multi-Item Isolation

- Multiple draggable elements may exist within the same bounded area.
- Only one element may be actively dragged at a time.
- Starting a drag on one element does not affect the position or state of other elements.
- Each element independently tracks its own virgin/dirty state and position.

---

## 9. Position Resolution

### 9.1 Supported Formats

- **Percentage** (e.g., "50%"): resolved as a fraction of the bounded area's corresponding dimension.
- **Pixels** (e.g., "120px"): used as an absolute offset.
- **Bare number** (e.g., 120): used as an absolute pixel offset.

### 9.2 Invalid Values

- Non-finite numbers (NaN, Infinity) fall back to zero with a warning.
- Unparseable strings fall back to zero with a warning.
- Types that are neither string nor number fall back to zero with a warning.

---

## 10. Bounded Area

### 10.1 Coordinate System

- The bounded area establishes the coordinate system for all draggable elements within it.
- The bounded area must be a positioned element (not static). If it is static, the system auto-corrects it to relative and warns.

### 10.2 No Bounded Area

- If no bounded area is registered, drag operations are silently ignored — the element does not move.

### 10.3 Zero-Size Bounded Area

- If the bounded area has zero width and zero height, initial position resolution is skipped until the bounded area acquires a non-zero size.

---

## 11. Structural Validation

- Each draggable element must be a direct layout child of the bounded area (no intermediate positioned elements between them).
- If an intermediate positioned element is detected, an error is reported.
- This ensures the coordinate system is not distorted by nested positioning contexts.

---

## 12. Focus & Keyboard

- Each draggable element is focusable via keyboard navigation.
- The element exposes whether it has keyboard focus (focus-visible state).
- Focus outlines are suppressed by default (visual styling is left to the consumer).

### 12.1 Keyboard Grab

- Pressing Enter or Space on a focused draggable element begins a keyboard move ("grab").
- Pressing Enter, Space, or Escape while grabbed ends the keyboard move ("release").
- Grabbing an element via keyboard activates the same state as a pointer drag: the element becomes the active item, and all visual indicators (cursor, will-change, ARIA) update accordingly.

### 12.2 Keyboard Movement

- While grabbed, Arrow keys move the element in discrete steps (default 10px, configurable via `stepSize` prop).
- Each arrow key press moves in one axis only: Left/Right for horizontal, Up/Down for vertical.
- Position is clamped to the bounded area's limits on each step (same as pointer drag).
- Collision detection runs on each step (same as pointer drag).
- Visual updates are batched to the next animation frame (same as pointer drag).

### 12.3 Interaction Isolation

- Keyboard and pointer interactions share the same active-item state on the Model.
- The single-active-drag invariant holds across input methods: grabbing via keyboard while another item is pointer-dragged (or vice versa) replaces the active item.
- Arrow keys without a prior grab do not move the element — normal browser scroll behavior is preserved.

### 12.4 ARIA

- Each draggable element has `aria-roledescription="draggable"`.
- The `aria-grabbed` attribute reflects whether the element is currently being moved (either via pointer or keyboard).

---

## 13. Behavioral Invariants

1. **Single active drag**: at most one element may be dragged at a time within a bounded area.
2. **Boundary integrity**: a dragged element's position is always within the bounded area's limits.
3. **Pointer capture**: during a drag, all pointer events are captured by the dragging element, preventing interference from other elements.
4. **Clean destruction**: when a draggable element or bounded area is destroyed, all observers, listeners, and animation frames are cleaned up. No callbacks fire after destruction.
5. **Idempotent end**: ending a drag when no drag is active is safe and has no side effects.
6. **Frame-batched updates**: position changes during drag are applied once per animation frame, not on every pointer event.
