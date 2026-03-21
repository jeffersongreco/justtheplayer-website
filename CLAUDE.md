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

### Claude Git Workflow

**Branch first, always.** Before making any code changes, create and checkout the appropriate branch. Never start editing files while still on `dev` or `main`.

**Workflow:**
1. Determine the branch name based on the task type (`feat/`, `fix/`, `chore/`)
2. Create and checkout the branch from `dev`
3. Only then start making changes and committing

**Multiple commits per PR are normal.** Each commit represents one logical boundary (one behavior + tests passing). Never squash, amend, or rebase to collapse commits. If a commit needs correction, make a new fix commit.

**Prohibited operations:**
- `git rebase -i` (interactive rebase)
- `git reset --hard`
- `git push --force` / `--force-with-lease`
- `git commit --amend` (on already-pushed commits)
- Squash merge on GitHub

These destroy history and break CalVer commit counting.

## Svelte Code Quality (MCP Plugin)

This project uses the **official Svelte MCP server**. It **must** be used whenever working with `.svelte` or `.svelte.ts`/`.svelte.js` files:

1. **Writing/editing Svelte code** — after writing or modifying a component or module, run `svelte-autofixer` on the final code to catch issues before delivering it. Fix any reported problems and re-run until clean.
2. **Looking up Svelte/SvelteKit docs** — when you need documentation on runes, lifecycle, routing, or any Svelte/SvelteKit API, use `list-sections` first to find relevant sections, then `get-documentation` to fetch them. Prefer this over relying on training data alone.
3. **Svelte file editor agent** — when creating or editing `.svelte` files, prefer using the `svelte:svelte-file-editor` agent, which integrates documentation lookup and autofixer validation automatically.

## Svelte Code Quality (Official Svelte MCP Plugin)

This project has the **official Svelte MCP server** installed. It **must** be used whenever working with `.svelte` or `.svelte.ts`/`.svelte.js` files.

### Tools (MCP)

| Tool | When to use |
|---|---|
| `list-sections` | **First step** for any doc lookup — lists all Svelte 5 / SvelteKit sections with use-case keywords |
| `get-documentation` | Fetch full content for sections found via `list-sections`. Prefer this over training data for APIs, runes, routing, etc. |
| `svelte-autofixer` | **After writing/editing** any Svelte component or module — validates code and returns fix suggestions. Re-run until clean. |
| `playground-link` | Generate a Svelte playground link for code snippets (only when code is NOT written to a file) |

### Skills

| Skill | When to use |
|---|---|
| `svelte:svelte-code-writer` | When creating, editing, or analyzing any `.svelte` / `.svelte.ts` / `.svelte.js` file — provides doc lookup and code analysis |
| `svelte:svelte-core-bestpractices` | When writing or reviewing Svelte code — covers reactivity, event handling, styling, library integration |

### Agent

| Agent | When to use |
|---|---|
| `svelte:svelte-file-editor` | **Preferred agent** for creating/editing `.svelte` and `.svelte.ts`/`.svelte.js` files — integrates documentation fetch and autofixer validation automatically |

### Workflow

1. When creating or editing Svelte files, use the `svelte-file-editor` agent when possible — it handles doc lookup and validation in one step.
2. If working outside the agent, always run `svelte-autofixer` on the final code before delivering. Fix issues and re-run until clean.
3. For documentation needs, call `list-sections` → `get-documentation` instead of relying solely on training data.

## Code Style

- Write code, comments, variable names, and commits in **English**
- Respond in **English** (architecture notes in the repo are in Portuguese — that's fine, match language when editing those files)
