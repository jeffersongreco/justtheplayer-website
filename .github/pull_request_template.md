## Summary

<!-- What changed and why -->

## Quality Gate

- [ ] Automated tests pass (`bun run test`)
- [ ] Smoke test on dev page completed (Guided QA if available)
- [ ] CodeRabbit review clean (`/coderabbit:review`)
- [ ] `STATUS.yaml` updated for affected packages

## Checklist

- [ ] No new `console.warn`/`console.error` in production paths (use `DEV` from `esm-env` guard)
- [ ] Public API (`index.ts` exports) unchanged — or breaking change documented below
- [ ] Accessibility not regressed (if touching View/Controller)

## Breaking Changes

<!-- Remove this section if none -->

N/A
