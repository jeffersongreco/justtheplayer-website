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

### Architecture Reference

All principles, patterns, conventions, and the conformance checklist live in `packages/Svelte Model View Architecture/Architecture.md`. Read that file before creating or modifying any MV package.

## Testing

- **Style:** Classical TDD (Detroit School) — no mocks unless absolutely necessary; test real behavior through the public API.

### Behavioral Specifications

- Specs describe **only behaviors** — what the system does, not how it's built.
- No technology names, implementation details, class/method names, or naming conventions.
- Focus on: states, transitions, lifecycle, edge cases, and invariants in plain language.
- Reference example: `packages/attention-requester/src/lib/Docs/Test Spec.md`.

### UI Tests (components, visual interactions, DOM-dependent behavior)

- **No simulation libraries** (no Testing Library, no simulated clicks/events).
- Instead, provide a **manual testing checklist** describing exactly what a human should do and verify.
- Add **logging/console output** so the tester can observe internal state without having to describe everything — they only need to report what diverges from expected behavior.

### Non-UI Tests (Models, pure logic, functions with expected outputs)

- **Fully automated** — standard unit tests with assertions.
- Test through the public API of the unit (e.g., Model methods and derived state).
- Covers: state transitions, computed values, edge cases, error handling.

## Code Style

- Write code, comments, variable names, and commits in **English**
- Respond in **English** (architecture notes in the repo are in Portuguese — that's fine, match language when editing those files)
