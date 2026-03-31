# Memo — CI Pipeline Review

**Date:** 2026-03-17
**Subject:** Gap analysis of the current quality pipeline, with proactive recommendations
**Audience:** Jefferson (project owner)

---

## 1. Current State Summary

The project has **zero automated CI/CD** — no GitHub Actions workflows exist. The quality pipeline is entirely manual and documentation-driven:

```
Write code → Run tests (vitest) → Smoke test (dev page) → CodeRabbit review → Fix → Commit → PR
```

This works for a solo developer, but it depends entirely on discipline. Nothing *enforces* the workflow — a bad commit can land on `dev` if you skip a step.

---

## 2. Known Gaps (Your List, Expanded)

### 2.1 Missing STATUS File

**Problem:** There's no machine-readable record of where each package stands in its quality lifecycle. The closest thing is `Plan — Architecture Compliance.md` for Attention Requester, but it's a plan, not a status tracker.

**Recommendation:** Create a `STATUS.md` (or `STATUS.json` for tooling) per package:

```yaml
# packages/attention-requester/STATUS.yaml
package: "@headless-uai/attention-requester"
version: 0.1.0
checklist:
  behavioral_spec: complete      # §14.1
  model_tests: complete          # §14.2
  dev_page: complete             # §14.3
  guided_qa: partial             # §14.4 — missing state inspector
  a11y_audit: not_started        # §14.5
  size_limit: not_configured     # §14.6
  benchmarks: not_configured     # §14.7
  coderabbit_review: pass        # §14.8
  smoke_test: pass               # §14.9
last_updated: 2026-03-17
```

**Why YAML over Markdown:** It can be parsed by CI scripts, pre-commit hooks, or a future dashboard. Markdown is for humans; status tracking needs to be queryable.

**Blind spot you might not have considered:** STATUS should also track **which version of the checklist** it was evaluated against. If you add a new checklist item (say, §14.10 for security audit), all packages should show `not_evaluated` for that item until re-audited.

### 2.2 Git Rules — Vague and Gappy

**What exists:**
- PRs target `dev`; `main` is production-only (per memory)
- "Every commit must contain working code" (per CLAUDE.md)
- No branch naming convention
- No commit message convention
- No tags
- No rules for *when* to branch or *when* to commit

**Recommended Git Policy:**

#### Branch Strategy
| Branch | Purpose | Merges from | Merges to |
|--------|---------|-------------|-----------|
| `main` | Production releases only | `dev` (via PR) | — |
| `dev` | Integration branch | `feat/*`, `fix/*` | `main` |
| `feat/<package>/<short-desc>` | New features | — | `dev` |
| `fix/<package>/<short-desc>` | Bug fixes | — | `dev` |
| `chore/<short-desc>` | Non-functional (CI, docs, tooling) | — | `dev` |

#### Commit Convention

Since you want commit-count-based versioning (see §2.3), conventional commits become critical — they're the input to changelog generation:

```
<type>(<scope>): <description>

Types: feat, fix, refactor, test, docs, chore, perf, a11y
Scope: package name (attention-requester, movable, website, arch)
```

Examples:
```
feat(attention-requester): add prefers-reduced-motion support
fix(movable): clamp position on container resize
chore(ci): add GitHub Actions lint workflow
```

#### When to Branch
- **Always** for work that touches package source code (`src/lib/`)
- **Optional** for documentation-only changes on `dev`
- **Never commit directly to `main`** — always via PR from `dev`

#### When to Commit
- At each **logical boundary**: one behavior implemented + its tests passing
- After completing a full review–fix cycle (tests → smoke → CodeRabbit → all clear)
- **Never** mid-implementation ("WIP" commits are banned by your own policy)

**Blind spot:** You have no **branch protection rules** on GitHub. Even with perfect discipline, a force-push to `main` or `dev` could destroy history. Set up:
- Require PR reviews before merge (even if you're the only reviewer — CodeRabbit counts)
- Require status checks to pass (once CI exists)
- Disable force-push on `main` and `dev`
- Require linear history (rebase merge only) — cleaner for commit-count versioning

### 2.3 Versioning — Commit-Count Based, shadcn Distribution

**Your intent:** Version number changes on every commit, has 3 trailing digits, distributed as copied source (not npm dependency).

**Recommended scheme: CalVer + commit count**

```
YYYY.MM.<commit-count>
```

Example: `2026.03.047` — released March 2026, 47th commit to the package.

**Why this over SemVer:**
- SemVer (major.minor.patch) implies API compatibility promises. Since consumers get a **source copy** (shadcn model), they're already forking — semver signals are misleading.
- CalVer communicates freshness ("how old is my copy?"), which is what shadcn consumers actually care about.
- The commit count gives granularity within a month.

**How to compute automatically:**
```bash
# Count commits that touch the package
git rev-list --count HEAD -- packages/attention-requester/
```

This can live in a `version.ts` generated at build time, or in `STATUS.yaml`.

**Blind spots:**

1. **Changelog is essential for shadcn distribution.** npm consumers get `npm diff` to see what changed between versions. Your consumers get *nothing* — they copied the code months ago and now want to update. You need a `CHANGELOG.md` per package that describes what changed between versions, ideally with migration notes. Conventional commits make this auto-generatable.

2. **No lockstep versioning.** Each package should version independently (Attention Requester is at v47, Movable at v12). Monorepo-wide version numbers hide which packages actually changed.

3. **Consider a `registry.json` manifest** (like shadcn does). This file describes what files to copy, dependencies, and the current version. It's the machine-readable install instruction for your consumers.

### 2.4 Accessibility Testing — Automation Gaps

**What the architecture defines (Checklist §14, 5-step process):**
1. Svelte compiler a11y warnings (automated — `svelte-check`)
2. axe-core audit (automatable — not automated)
3. Keyboard navigation (manual)
4. Screen reader / VoiceOver (manual)
5. `prefers-reduced-motion` (manual, but could be partially automated)

**What's actually running:** Only step 1, implicitly via `svelte-check` in the `check` script.

**Recommendation:**

| Step | Automation | When |
|------|-----------|------|
| 1. Svelte a11y warnings | `svelte-check` (already in `check` script) | Every commit (CI) |
| 2. axe-core | `@axe-core/cli` or Playwright + axe | Every commit (CI) — run against dev page |
| 3. Keyboard nav | Manual checklist in Guided QA | Before release, and when code touches View/Controller |
| 4. VoiceOver | Manual checklist | Before release only |
| 5. Reduced motion | Automated: Playwright with `prefers-reduced-motion: reduce` | Every commit (CI) for packages with animation |

**Blind spot:** Your dev pages are the perfect target for automated a11y scans. A CI job can:
1. Start the dev server (`bun run dev:ar`)
2. Run axe-core against `localhost:5173`
3. Fail if any critical/serious violations are found

This is low-effort, high-value — and it catches regressions between releases.

---

## 3. Things You Don't Know You Don't Know

### 3.1 No Pre-Commit Hooks

You have no `husky`, `lefthook`, or `git hooks` setup. Your entire quality gate relies on remembering to run things. A minimal pre-commit hook should:

```bash
# .husky/pre-commit (or lefthook equivalent)
bun run lint --staged    # Biome on staged files only
bun run check            # svelte-check (catches type errors + a11y warnings)
```

This is the **cheapest safety net** you can add. It turns "every commit must contain working code" from a policy into an enforcement.

**Recommendation:** Use **lefthook** over husky — it's faster, has no npm postinstall footprint, and supports partial file linting natively. Bun-friendly.

### 3.2 No Build Verification in Pipeline

`turbo build` is defined but never runs automatically. A broken build can exist on `dev` without anyone knowing. CI should run `turbo build` on every PR — scoped to packages only.

### 3.3 No Size Regression Protection

`size-limit` is in the Attention Requester `package.json` dependencies but **not configured** (no `.size-limit.json` or `size-limit` key in `package.json`). For a headless UI library distributed as source, bundle size is a key selling point. CI should:
- Run `size-limit` on every PR
- Comment on the PR with the delta (size-limit has a GitHub Action for this)

### 3.4 No Test Coverage Tracking

Tests exist but there's no coverage reporting. You don't need 100% coverage, but you need to know **if coverage drops**. A simple `vitest --coverage` in CI with a threshold (e.g., 80% for Models) catches regressions.

### 3.5 Dependency Security

No `bun audit` or equivalent runs anywhere. For a library that consumers copy into their projects, shipping a vulnerability is especially bad — they won't get an automatic fix via `npm update`.

### 3.6 No Release Process

You have versioning ideas but no release workflow. For shadcn-style distribution, a release means:
1. Bump version in `STATUS.yaml` / `version.ts`
2. Generate/update `CHANGELOG.md`
3. Tag the commit: `git tag attention-requester@2026.03.047`
4. Merge `dev` → `main` via PR
5. (Optional) Update `registry.json` for consumers

This should be a documented runbook, and eventually a `release` script.

### 3.7 No Monorepo Dependency Graph Validation

Turborepo handles build ordering, but nothing validates that package dependencies are correctly declared. If Movable accidentally imports from Attention Requester without declaring the dependency, Turbo won't know to build AR first. Tools like `syncpack` or `manypkg` catch this.

### 3.8 PR Template

No `.github/pull_request_template.md` exists. A template that includes:
- [ ] Tests pass (`bun run test`)
- [ ] Smoke test completed
- [ ] CodeRabbit review clean
- [ ] STATUS.yaml updated
- [ ] CHANGELOG.md updated (if releasing)

...turns your quality gate into a visible checklist on every PR.

### 3.9 Scope Awareness — Packages ≠ Website

The website (Cloudflare Pages app) lives in this monorepo only for convenience — it's a consumer app that doubles as a live test bed for the architecture. The packages (`attention-requester`, `movable`, and future ones) are the actual product. They will migrate to their own repository once they reach stable, complete versions.

**All CI/CD must be scoped to packages only.** The website has its own deploy pipeline (Cloudflare Pages) and should not gate package quality. Turbo filters (`--filter=./packages/*`) make this straightforward.

---

## 4. Proposed CI Architecture

> **Scope:** All pipelines target **packages only** (`packages/*`). The website app is excluded — it shares the monorepo temporarily and has its own Cloudflare Pages deploy. When packages migrate to their own repo, these workflows move with them unchanged.

### Phase 1 — Safety Net (immediate, low effort)

```
PR opened/updated → GitHub Actions:
  ├── bun install
  ├── turbo lint   --filter='./packages/*'   (Biome)
  ├── turbo check  --filter='./packages/*'   (svelte-check + types + a11y warnings)
  ├── turbo test   --filter='./packages/*'   (Vitest)
  └── turbo build  --filter='./packages/*'   (verify it compiles)
```

Plus: lefthook pre-commit hook for lint + check locally (also package-scoped).

### Phase 2 — Quality Gates (next iteration)

```
PR opened/updated → GitHub Actions:
  ├── Phase 1 jobs
  ├── size-limit per package (comment on PR with delta)
  ├── axe-core against package dev pages
  └── coverage report per package (fail if below threshold)
```

Plus: PR template, branch protection rules, STATUS.yaml per package.

### Phase 3 — Release Automation (when ready to ship)

```
Manual trigger or dev→main merge:
  ├── Compute version from commit count (per package)
  ├── Generate CHANGELOG.md (per package)
  ├── Update STATUS.yaml
  ├── Create git tag (e.g. attention-requester@2026.03.047)
  └── Update registry.json (for shadcn-style consumers)
```

---

## 5. Priority Matrix

| Item | Impact | Effort | Do When |
|------|--------|--------|---------|
| Pre-commit hooks (lefthook) | High | Low | Now |
| GitHub Actions Phase 1 | High | Low | Now |
| Branch protection rules | High | Trivial | Now |
| PR template | Medium | Trivial | Now |
| STATUS.yaml spec | High | Medium | This week |
| Git convention doc | Medium | Low | This week |
| Versioning scheme decision | High | Low | This week (just decide) |
| size-limit config | Medium | Low | Next PR to AR |
| axe-core in CI | Medium | Medium | Phase 2 |
| Coverage tracking | Low | Low | Phase 2 |
| CHANGELOG generation | High | Medium | Before first release |
| Release runbook | High | Medium | Before first release |
| registry.json | Medium | High | When shadcn distribution starts |

---

## 6. Implementation Status

Items marked with ✅ were implemented in the `dev` branch. Items marked with ⬜ are still pending.

### Done

- ✅ **Pre-commit hooks (lefthook)** — lint, check, test on pre-commit; build on pre-push (package-scoped)
- ✅ **GitHub Actions Phase 1** — CI workflow with lint, check, test+coverage, build, size jobs (path-filtered to `packages/**`)
- ✅ **PR template** — `.github/pull_request_template.md` with quality gate checklist
- ✅ **STATUS.yaml per package** — machine-readable status for attention-requester and movable
- ✅ **Git convention doc (§15)** — branch naming, commit format, versioning scheme, documented in Architecture
- ✅ **size-limit config** — attention-requester (6kB), movable (10kB), with CI job
- ✅ **Coverage tracking** — vitest v8 provider scoped to `*Model.svelte.ts`, 80% thresholds on AR
- ✅ **Biome upgrade** — 2.3.8 → 2.4.7 with ultracite 7.3.2, all lint issues fixed

### Pending

- [Do] **Branch protection rules** — require PR reviews, status checks, disable force-push on `main`/`dev`, require linear history
- ✅ **axe-core in CI** — automated a11y audit against package dev pages
- [Do] **CHANGELOG generation** — per-package, auto-generated from conventional commits
- [Do] **Release runbook** — documented process for version bump, tag, changelog, merge to `main`
- [Do] **Versioning automation** — `version.ts` generated at build time from `git rev-list --count`
- ⬜ **registry.json** — shadcn-style machine-readable install manifest per package
- [Do] **Dependency security** — `bun audit` or equivalent in CI
- ⬜ **Monorepo dependency validation** — `syncpack` or `manypkg` to catch undeclared cross-package imports
- [Do] **Size-limit PR comments** — GitHub Action to comment delta on PRs (currently only fails/passes)

---

*End of memo.*
