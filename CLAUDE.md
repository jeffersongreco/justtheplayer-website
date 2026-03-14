# Project: Just The Player — Website

Static marketing site built with **SvelteKit** + **Svelte 5**, deployed to **Cloudflare Pages**.

## Stack & Tooling

- **Runtime / Package Manager:** Bun (never npm/pnpm/node)
- **Framework:** SvelteKit (static adapter for Cloudflare Pages)
- **Linter:** Biome (`biome.jsonc`)
- **Build system:** Turborepo (`turbo.json`)
- **Language:** TypeScript

## MV Architecture (Model–View for Svelte 5)

This project is developing a custom **Model–View architecture** inspired by modern Swift/SwiftUI, leveraging Svelte 5 runes. The architecture lives in `src/lib/` as self-contained packages.

### Reference Packages

The two main packages built under this architecture (Attention Requester is the most refined):

| Package | Path | Purpose |
|---|---|---|
| **Attention Requester** | `src/lib/Attention Requester/` | Animates elements via WAAPI to draw user attention (bounce, shake, etc.) |
| **Movable** | `src/lib/Movable/` | Makes elements draggable within a bounded area with collision detection |

Both are used together in `src/lib/Pages/Home/Components/HomeHero.svelte`.

### Architecture Notes

Detailed architecture docs live in `src/lib/Arch Svelte Model View/` (the canonical reference). The Attention Requester also has notes at `src/lib/Attention Requester/Docs/Arch Notes.md`.

### Core Principles

1. **Model as Single Source of Truth** — Business logic and state live exclusively in the Model (`*Model.svelte.ts`). Controllers never make decisions; they execute orders.
2. **`$state` private + `$derived` public** — Mutable fields use JS private (`#field = $state()`). Public surface is always `readonly field = $derived(this.#field)`.
3. **Typed intents over booleans** — When state resolves to qualitatively different behaviors, the Model exposes a discriminated union (e.g., `PauseIntent`) instead of a boolean.
4. **Dumb Views** — `.svelte` components only render state and capture user intent. No business logic. Views translate Model semantics to presentation names (e.g., `model.isFinished` → `isBouncingRight`).
5. **Controller = Integrity Manager** — Owns the element's lifecycle, DOM state, and structural validation. Persistent, lives as long as the component.
6. **Interaction = Hardware Adapter** — Translates raw input (pointer events, keyboard) into commands for the Controller. Pluggable and replaceable.
7. **Fail-Safe philosophy (Apple/Cocoa style)** — Auto-correct bad environments (e.g., force `position: relative`), warn via `console.warn`, never crash.

### Component API Patterns

- **Dot notation exports** — `Movable.Root`, `Movable.Item`, `AttentionRequester`
- **`asChild` polymorphism** — Mutually exclusive with `children` via TypeScript union + `never`. Enables Inversion of Control to avoid wrapper hell.
- **`display: contents`** — Used for behavior-only wrappers that need no layout box. The Controller resolves the real target lazily via `wrapper.children[0]`.
- **`bind:this` for imperative API** — Components export methods (e.g., `request()`, `cancel()`), accessed via `bind:this`. No `ref` prop pattern.
- **Parameters belong to the imperative call** — Animation config is passed to `request(animation)`, not as component props.
- **Svelte Context for DI** — `<Root>` components create Model instances and inject them via context. `PackageName.get()` (or `.use()`) retrieves the model anywhere in the subtree.
- **Snippets for ephemeral state** — States like `isMoving`, `isDragging` are passed back to the consumer via snippet parameters.

### Animation Conventions (WAAPI)

- Animations are **data objects**, not behavior — declare `name`, `duration`, `keyframes`, `onInterrupt`, etc.
- `keyframes` can be a function `(el: HTMLElement) => Keyframe[]` for context-dependent animations.
- Loop contract is a discriminated union: `ARAnimationLoop` requires `loop: true` + `interval`; `ARAnimationOneShot` forbids `interval`.
- `fill: 'none'` is mandatory — prevents residual state.
- `will-change` is managed by the Controller (promote before cycle, release on finish).
- CSS `translate` property is used in WAAPI keyframes to avoid clashing with `transform` used by positioning systems.

### File Naming Convention

Files are prefixed with the package domain name for namespace safety and Cmd+P discoverability:

```
AttentionRequesterModel.svelte.ts   — Model (state + business logic)
AttentionRequesterController.svelte.ts — Controller (DOM lifecycle + execution)
AttentionRequester.svelte            — View (component)
types.ts                             — Types and interfaces
index.ts                             — Public API exports
```

## Code Style

- Write code, comments, variable names, and commits in **English**
- Respond in **English** (architecture notes in the repo are in Portuguese — that's fine, match language when editing those files)
