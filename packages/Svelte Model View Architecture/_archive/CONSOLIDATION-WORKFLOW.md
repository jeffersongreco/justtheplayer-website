# Workflow: Consolidating the MV Architecture Reference

## Goal

Merge the 4 draft files (`IDEA.md`, `Arch Notes.md`, `Arquitetura de Componentes e API.md`, `Rascunho.md`) into a single canonical reference document that:

1. Is easy to consult when building or reviewing UI packages
2. Can be continuously refined as new packages are created
3. Serves as a quality checklist for evaluating existing packages

## Current State Analysis

| File | Content | Unique Value |
|---|---|---|
| `IDEA.md` | Philosophical motivation (7 lines) | The "why" — Swift mental model, modularity goals, TDD presupposition |
| `Arch Notes.md` | 6 structured sections + pending decisions appendix | Best-organized structure; pending decisions have concrete examples (PauseIntent, lazy target resolution) |
| `Arquitetura de Componentes e API.md` | Identical copy of Arch Notes.md | None — can be deleted |
| `Rascunho.md` | Verbose narrative + book outline | Movable-specific details (Physics, Performance, UX), richer explanations of asChild and Interaction |

## Steps

### Step 1 — Define the document structure

Create the target file `Architecture.md` with the final section outline. Sections should be organized by **architectural role** (not by package). Proposed structure:

```
0. Philosophy & Motivation (from IDEA.md)
1. Views
2. Model & State
3. Controller
4. Interaction
5. Component API & DX Patterns
   - Dot Notation
   - asChild / Polymorphism
   - bind:this / Imperative API
   - Snippets for ephemeral state
   - Context as DI
6. Animations & WAAPI
7. Fail-Safe Philosophy
8. Physics, Geometry & Performance (from Rascunho.md unique content)
9. File Naming Convention
10. Conformance Checklist (new — for package quality evaluation)
```

Write only the skeleton with section headers and one-line descriptions. No content yet.

**Pause — review structure before proceeding.**

### Step 2 — Populate sections 0–4 (core architecture)

For each section, merge content from all sources:
- Start with `Arch Notes.md` as the base (best structured)
- Integrate the pending decisions from the appendix into their target sections
- Add the philosophical "why" from `IDEA.md` into section 0
- Add Rascunho.md's richer explanations where they add clarity (not verbosity)

Keep the language in **Portuguese** (matching the existing files).

**Pause — review before proceeding.**

### Step 3 — Populate sections 5–9 (patterns & cross-cutting)

- Section 5 (API & DX): merge from Arch Notes sections 3–4 + Rascunho.md's DX section
- Section 6 (Animations): from Arch Notes pending decisions ("Nova seção: Animações Plugáveis" + "Nova seção: Web Animations API")
- Section 7 (Fail-Safe): from Arch Notes section 6
- Section 8 (Physics/Performance): unique to Rascunho.md — extract and condense
- Section 9 (File Naming): from CLAUDE.md's existing convention

**Pause — review before proceeding.**

### Step 4 — Create the Conformance Checklist (section 10)

This is the **new section** that makes the document actionable for quality evaluation. Convert each architectural principle into a yes/no checklist item. Example:

```markdown
## 10. Conformance Checklist

Use this checklist to evaluate whether a UI package follows the MV architecture.

### Model
- [ ] All business logic lives in the Model — Controller has zero decision-making
- [ ] Mutable state uses `#field = $state()` (JS private, not convention)
- [ ] Public state uses `readonly field = $derived(this.#field)`
- [ ] Qualitatively different behaviors use discriminated unions, not booleans

### Controller
- [ ] Controller never makes business decisions — only executes Model orders
- [ ] Target element is resolved lazily (`wrapper.children[0]`), not at construction
- [ ] `will-change` is promoted before animation and released on finish

### View
- [ ] Zero business logic — only renders state and captures user intent
- [ ] Uses presentation-local names (not Model domain names)
- [ ] Ephemeral state passed via snippet parameters

### API Surface
- [ ] Exports use dot notation (`Package.Root`, `Package.Item`)
- [ ] Imperative API via `bind:this` with exported methods
- [ ] Configuration passed at call site, not as component props
- [ ] `asChild` available with union + `never` typing

### Resilience
- [ ] Auto-corrects hostile environments (e.g., missing `position: relative`)
- [ ] Errors are `console.warn`, never crashes
```

**Pause — review before proceeding.**

### Step 5 — Clean up and finalize

1. Review the complete `Architecture.md` for internal contradictions or gaps
2. Delete `Arquitetura de Componentes e API.md` (exact duplicate of Arch Notes)
3. Move `Arch Notes.md`, `Rascunho.md`, and `IDEA.md` to an `_archive/` subfolder (don't delete yet — keep for reference until confident)
4. Update `CLAUDE.md` to point to the new `Architecture.md` as the canonical reference
5. Update `src/lib/Attention Requester/Docs/Arch Notes.md` reference if it points to the old files

### Step 6 — Establish the continuous improvement loop

Add a section at the top of `Architecture.md`:

```markdown
> **Living Document:** This architecture evolves as new packages are built.
> When creating a new package, run through the Conformance Checklist (§10).
> If a pattern is missing or a new principle emerges, add it here and update the checklist.
> After any update, review existing packages against the new checklist items.
```

This creates the feedback loop:
- New package → checklist reveals gaps → update doc → re-evaluate existing packages

---

## Execution Notes

- Each step should be done in a separate conversation turn (wait for review)
- Intermediate results are written to files, not kept in chat
- The document language stays in Portuguese (matching the drafts)
- The Conformance Checklist can be in English if preferred (since CLAUDE.md is in English)
