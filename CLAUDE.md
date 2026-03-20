# Project: Just The Player — Website

Static marketing site built with **SvelteKit** + **Svelte 5**, deployed to **Cloudflare Pages**.

## Stack & Tooling

- **Runtime / Package Manager:** Bun (never npm/pnpm/node)
- **Framework:** SvelteKit (static adapter for Cloudflare Pages)
- **Linter:** Biome (`biome.jsonc`)
- **Build system:** Turborepo (`turbo.json`)
- **Language:** TypeScript

## Dev Scripts

Every package/app with a `dev` script must have a corresponding shortcut in the **root** `package.json` so it can be run from the repo root without `cd`:

```
"dev:<alias>": "turbo dev --filter=<package-name>"
```

Current aliases:

| Alias | Package | Command |
|---|---|---|
| `dev` | All | `bun run dev` |
| `dev:website` | `@just-the-player/website` | `bun run dev:website` |
| `dev:ar` | `@headless-uai/attention-requester` | `bun run dev:ar` |

When creating a new package that has a `dev` script, always add a `dev:<alias>` entry to the root `package.json`.

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

Core principles, patterns, and conventions live in `packages/Svelte Model View Architecture/Architecture.md` (§0–§9). Operational concerns are in separate files: [Testing](packages/Svelte%20Model%20View%20Architecture/Testing.md) (§10), [Logging](packages/Svelte%20Model%20View%20Architecture/Logging.md) (§11), [Dev Pages](packages/Svelte%20Model%20View%20Architecture/Dev%20Pages.md) (§12), [Accessibility](packages/Svelte%20Model%20View%20Architecture/Accessibility.md) (§13), [Conformance Checklist](packages/Svelte%20Model%20View%20Architecture/Checklist.md) (§14), and [Git Conventions](packages/Svelte%20Model%20View%20Architecture/Git%20Conventions.md) (§15). Read Architecture.md before creating or modifying any MV package.

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

## Commit Policy

- **Every commit must contain working code** — code that builds, passes all automated tests, and has been through all applicable reviews (CodeRabbit, manual smoke test) with no remaining issues to fix.
- Never commit partial, broken, or "will fix later" code. If something isn't ready, keep it in the working tree until it is.
- The review–fix cycle (tests → smoke test → `/coderabbit:review` → fix findings → re-test) must complete fully **before** committing.

### Commit Message Format

```
<type>(<scope>): <description>
```

- **Types:** `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `perf`, `a11y`
- **Scopes:** `attention-requester`, `movable`, `arch`, `ci` (new package → new scope, always `kebab-case`)
- Full rules and examples in [Git Conventions](packages/Svelte%20Model%20View%20Architecture/Git%20Conventions.md) (§15)

### Branch Naming

- `feat/<package>/<short-desc>` — new features
- `fix/<package>/<short-desc>` — bug fixes
- `chore/<short-desc>` — non-functional (CI, docs, tooling)
- Always branch for package source code changes; optional for docs-only on `dev`

## Code Style

- Write code, comments, variable names, and commits in **English**
- Respond in **English** (architecture notes in the repo are in Portuguese — that's fine, match language when editing those files)
