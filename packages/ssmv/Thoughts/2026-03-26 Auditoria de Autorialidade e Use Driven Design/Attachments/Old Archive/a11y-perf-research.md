# Accessibility & Performance Testing Research

Research conducted March 2026. Sources at bottom.

---

## Part 1: Accessibility

### 1. Solo Dev vs. Team — The Realistic Gap

**What teams have that solo devs don't:**
- Dedicated QA running screen reader testing across a matrix (NVDA+Firefox, VoiceOver+Safari, JAWS+Chrome, TalkBack+Android)
- User testing sessions with people who have actual disabilities
- Accessibility specialists who know WCAG deeply and can audit subjective criteria (cognitive load, reading order, comprehensibility)
- Budget for third-party audits (Deque, Level Access, etc.)

**What a solo dev CAN realistically do:**
- Automated scanning (axe-core, Lighthouse, Svelte compiler warnings)
- Keyboard-only navigation testing (yourself)
- Single screen reader testing (VoiceOver on macOS — it's free and right there)
- `prefers-reduced-motion` and `prefers-color-scheme` testing
- Color contrast checking (browser DevTools or axe)

**The honest gap:** You can get to ~70-80% of what a team achieves. The remaining 20-30% is cross-screen-reader matrix testing, cognitive accessibility, and real user testing with disabled people. That last piece is fundamentally impossible to replicate solo.

### 2. Automated A11y Tools — What They Actually Catch

**The 57% number — context matters:**
- Deque's 2021 study: axe-core catches **57% of total accessibility issues by volume** across 2,000+ audits, 13,000+ pages, ~300,000 issues.
- The older "20-30%" figure measures something different: percentage of **WCAG Success Criteria** that can be fully tested automatically.
- Both numbers are correct — they measure different things. 57% = issues found by count. 20-30% = SC covered completely.
- Important caveat: this is Deque studying their own tool. Independent estimates from other sources tend toward 30-50%.

**What automated tools CANNOT catch:**
| Category | Example |
|---|---|
| **Focus management** | Focus not moving to modal on open, focus trap missing |
| **Reading/tab order** | Visually logical but DOM order is wrong |
| **Screen reader announcements** | Live region updates missing or poorly worded |
| **Cognitive accessibility** | Confusing language, unclear error messages, information overload |
| **Keyboard traps** | Can tab in but can't tab out |
| **Dynamic content** | SPA route changes not announced, loading states invisible |
| **Context-dependent ARIA** | `aria-label` present but text is meaningless |
| **Color as sole indicator** | Error shown only by red border, no icon/text |
| **Touch target size** | Buttons too small on mobile (WCAG 2.5.8) |
| **Interaction patterns** | Custom widget doesn't follow ARIA Authoring Practices |

### 3. The A11y Linter Question — Can Any Tool Catch Everything?

**No. This is fundamentally impossible.** Here's why:

Many WCAG criteria require **human judgment** (e.g., "Is this alt text actually descriptive?" "Is this error message understandable?"). A linter can check if `alt` exists; it cannot check if `alt="image"` is meaningful.

**Tool coverage layered together:**

| Tool | What it catches | When it runs |
|---|---|---|
| **Svelte compiler warnings** | Missing `alt`, invalid ARIA roles, bad attribute combos, non-interactive element handlers | Build time (static analysis) |
| **eslint-plugin-jsx-a11y / svelte equivalents** | Similar to compiler but sometimes catches different patterns | Lint time |
| **axe-core** (via Playwright, Storybook, or browser) | Color contrast, missing labels, invalid ARIA, duplicate IDs, many more runtime issues | Runtime (needs rendered DOM) |
| **Lighthouse a11y audit** | Subset of axe-core rules + some extras | Runtime |
| **Pa11y** | Uses axe-core or HTML_CodeSniffer under the hood | Runtime |
| **WAVE** | Visual overlay of issues, similar coverage to axe | Runtime |
| **IBM Equal Access Checker** | Additional rules beyond axe, particularly around ARIA patterns | Runtime |

**All combined still miss ~40-50% of real issues.** The gap is: screen reader behavior, keyboard interaction flows, focus management, cognitive concerns, and anything requiring human judgment.

**Svelte-specific gaps (from Geoff Rich's analysis):**
- CSS issues (color contrast, focus visibility) — compiler can't see CSS
- Dynamic values — if attribute value comes from a variable, compiler can't validate it
- Cross-component relationships — compiler only sees one component at a time
- Runtime behavior — anything that depends on user interaction or JS state

### 4. Animation/Interaction Library A11y Requirements

**Must-have for any animation library:**

#### prefers-reduced-motion
- Detect via `matchMedia('(prefers-reduced-motion: reduce)')`
- Provide reduced or removed alternatives for every animation
- **Decision framework** (from GSAP's guide):
  - Is the animation **triggering**? (large movements, flashing, x/y sweeps) → Remove entirely
  - Is the animation **decorative**? → Remove entirely
  - Is the animation **functional**? (progress bar, spatial context) → Simplify (e.g., crossfade instead of slide)

#### Focus management
- Focus indicators must remain visible during animations
- After animation completes (e.g., modal open), focus must move to the new content
- After animation dismisses content, focus must return to the trigger element
- Moving elements must not cause focus to be lost or hidden

#### Screen reader announcements
- Use `aria-live` regions for state changes that animations represent
- `aria-live="polite"` for non-urgent updates
- `aria-live="assertive"` sparingly, for critical state changes

#### Drag-and-drop (reference: dnd-kit)
dnd-kit is the gold standard for accessible DnD. It provides:
- **Keyboard sensor**: Space/Enter to pick up, arrow keys to move, Space/Enter to drop, Escape to cancel
- **ARIA attributes**: `aria-grabbed`, `aria-dropeffect`, `aria-roledescription`, `aria-describedby` for instructions
- **Live regions**: Real-time screen reader announcements for drag start, over target, drop, cancel
- **Customizable announcements**: You tailor the screen reader text to your app's context

**What major libraries do:**
| Library | prefers-reduced-motion | Keyboard alt | Screen reader | Focus mgmt |
|---|---|---|---|---|
| **GSAP** | `gsap.matchMedia()` integration, explicit reduce/remove guidance | N/A (not interactive) | SplitText has `aria` option + screenreader-only duplicate pattern | N/A |
| **Framer Motion / Motion** | `ReducedMotion` config on `MotionConfig`, auto-disables transforms | N/A (not interactive) | No built-in | No built-in |
| **dnd-kit** | Not built-in (you implement) | Full keyboard sensor | Full ARIA + live regions | Managed focus on activator |

### 5. Practical A11y Strategy for a Solo Dev (Minimum Viable)

**Catches ~80% of issues. Ordered by effort-to-impact ratio:**

1. **Svelte compiler warnings** — FREE, already on. Don't disable them. Fix every one.

2. **axe-core in dev** — Install `@axe-core/playwright` or use the axe DevTools browser extension. Run it on every page/state during development. **~15 min setup, catches the most automated issues.**

3. **Keyboard-only testing** — Unplug your mouse. Tab through your entire app. Check:
   - Can you reach everything?
   - Can you activate everything?
   - Is focus visible at all times?
   - Can you escape from every modal/overlay?
   - Does focus order make sense?
   - **~10 min per page, catches the highest-severity issues that automation misses.**

4. **VoiceOver spot-check** — Cmd+F5 on macOS. Navigate your key flows. Listen for:
   - Are interactive elements announced with their role?
   - Do buttons/links have meaningful labels?
   - Are state changes announced?
   - **~15 min per key flow. You only have one screen reader — that's fine for a solo dev.**

5. **prefers-reduced-motion** — Toggle it in System Settings (or DevTools) and verify every animation responds.

6. **Color contrast** — axe-core catches most of this, but spot-check any custom colors with DevTools contrast checker.

7. **Lighthouse a11y audit in CI** — Run on every deploy. Set a minimum score (aim for 95+, understand that 100 doesn't mean accessible).

**What you're consciously skipping (and that's OK for now):**
- Cross-screen-reader testing (NVDA, JAWS, TalkBack)
- User testing with disabled people
- Cognitive accessibility review
- Mobile screen reader testing

---

## Part 2: Performance

### 1. Defining "Acceptable" Performance

**Metrics that matter for a component library:**

| Metric | What it means | Target |
|---|---|---|
| **Bundle size (gzipped)** | Download cost for users | <10KB for a single component, <25KB for a full library |
| **Runtime perf (frame rate)** | Smoothness of animations | Sustained 60fps (16.67ms per frame) |
| **Main thread blocking** | Long tasks that cause jank | No single task >50ms (Long Task threshold) |
| **Memory** | Leak-free, reasonable allocation | No growth over repeated mount/unmount cycles |
| **Paint/layout thrashing** | Unnecessary reflows | Zero forced synchronous layouts |
| **Time to Interactive impact** | How much the library delays page readiness | Minimal — defer non-critical animations |

**Industry benchmarks for animation libraries:**
| Library | Bundle size (gzipped) |
|---|---|
| GSAP core | ~23 KB |
| Framer Motion / Motion | ~32 KB |
| Web Animations API (WAAPI) | 0 KB (built into browser) |

**What's "too slow" for animation:**
- Any frame taking >16.67ms = dropped frame at 60fps
- 2-3 dropped frames in a row = perceptible jank
- Animation at <30fps = clearly broken
- GSAP maintains 60fps even with complex sequences; Framer Motion drops to ~45fps with many simultaneous animations

### 2. How to Measure Performance

**During development:**
- **Chrome DevTools Performance panel** — Record a trace, look for long tasks, layout shifts, dropped frames
- **`performance.mark()` / `performance.measure()`** — Instrument your animation start/end, measure actual duration vs. expected
- **`PerformanceObserver`** for Long Tasks — Detect any task >50ms automatically
- **requestAnimationFrame-based monitoring** — Count actual frames rendered per second during animation
- **DevTools "Rendering" tab** — Enable "Frame Rendering Stats" overlay for real-time FPS

**For bundle size:**
- **`size-limit`** by Andrey Sitnik — Set a budget in bytes, fails CI if exceeded
- **`bundlephobia.com`** — Check dependency cost before adding
- **Import cost VS Code extension** — See size inline while coding

**In CI:**
- **Lighthouse CI** — Track performance score, set budgets for scripts/images/total size
- **`size-limit`** — Enforce bundle size budgets per PR

### 3. Integrating Performance into Tests/CI

**Realistic for a solo dev:**

#### Bundle size (highly automatable)
```json
// package.json
{
  "size-limit": [
    { "path": "dist/index.js", "limit": "10 KB" }
  ]
}
```
Run `size-limit` in CI. If bundle grows past budget, build fails. This is the single highest-value perf check.

#### Lighthouse CI (automatable but noisy)
- Run on every deploy to a preview URL
- Set assertion thresholds (e.g., performance score >= 90)
- Caveat: scores fluctuate ~5-10 points between runs. Use median of 3+ runs.

#### Custom perf benchmarks in Vitest (partially realistic)
- You CAN benchmark pure computation (model updates, state transitions) with `vitest bench`
- You CANNOT meaningfully benchmark actual animation frame rates in a test runner — there's no real rendering pipeline
- Animation smoothness is inherently visual and runtime-dependent

#### The honest answer for animation perf testing:
**Automated perf testing for animations is similar to visual testing — it's largely manual.** You can automate bundle size and avoid regressions in computational cost, but actual frame rate and visual smoothness require running on a real device and observing with DevTools.

### 4. What Major Libraries Do for Performance Testing

**GSAP:**
- No public automated perf test suite
- Relies on internal benchmarking and their own rendering engine that bypasses browser limitations
- GPU acceleration via `transform` and `opacity` by default
- Internal render throttling and animation queue management

**Framer Motion / Motion:**
- Optimizes by only re-rendering components that change
- Hardware-accelerated animations via `transform`/`opacity`
- No public perf benchmark suite

**dnd-kit:**
- No public perf benchmarks
- Performance through architecture: minimal re-renders via React context optimization

**Common theme:** None of these libraries have public automated performance test suites for animation smoothness. They all rely on architectural decisions (GPU acceleration, minimal re-renders) and manual DevTools profiling.

### 5. The Frame Budget Question

**The 16.67ms budget (60fps):**

How libraries stay within budget:
1. **Use only compositor-friendly properties** — `transform` and `opacity` don't trigger layout or paint, they run on the GPU compositor thread
2. **Avoid layout thrashing** — Batch reads before writes, never interleave `getBoundingClientRect()` with style changes
3. **Use `requestAnimationFrame`** — Sync with the browser's paint cycle instead of `setTimeout`/`setInterval`
4. **WAAPI (Web Animations API)** — Runs on the compositor thread entirely, JS main thread isn't involved at all during animation. This is what your Attention Requester uses, and it's the best possible approach for frame budget compliance.

**Is this testable automatically?**
- **Bundle size / computational overhead:** Yes (size-limit, vitest bench)
- **Actual frame rate during animation:** Not reliably in CI. Requires a real browser with GPU. Chrome DevTools Performance panel or `PerformanceObserver` in a real page are the only reliable methods.
- **You can set up a smoke test:** Run animation in Playwright, use `performance.getEntries()` to check no long tasks occurred. But this is a proxy, not a direct frame rate measurement.

**Your advantage with WAAPI:** Since the Attention Requester uses the Web Animations API, the animations run on the compositor thread. The main thread frame budget is essentially irrelevant for the animation itself — only your JS setup code (creating the animation, calculating keyframes) needs to stay fast. This is much easier to test: just benchmark the setup function.

---

## Key Takeaways for Your Project

### Accessibility
1. Your WAAPI-based Attention Requester needs: `prefers-reduced-motion` support, and if it triggers visible state changes, `aria-live` announcements.
2. Your Movable (drag) component needs: keyboard alternative (arrow keys), ARIA attributes (`aria-grabbed`, `aria-roledescription`), live region announcements for position changes. dnd-kit is the reference implementation.
3. Svelte's compiler warnings are a good foundation but miss CSS issues, dynamic values, and cross-component relationships.
4. Aim for the 5-step manual testing process (compiler warnings + axe-core + keyboard testing + VoiceOver + reduced motion toggle).

### Performance
1. **size-limit** in CI is the single highest-value automated check. Set it up.
2. WAAPI gives you a huge performance advantage — compositor-thread animations mean your JS frame budget concern is only about setup code.
3. Don't try to automate frame rate testing in CI — it's not reliable. Use DevTools manually.
4. Benchmark your Model/Controller setup functions with `vitest bench` if you want automated perf regression detection.

---

## Sources

### Accessibility
- [Deque: Automated Testing Identifies 57% of Issues (2021 study)](https://www.deque.com/blog/automated-testing-study-identifies-57-percent-of-digital-accessibility-issues/)
- [What Svelte's accessibility warnings won't tell you — Geoff Rich](https://geoffrich.net/posts/svelte-a11y-limits/)
- [dnd-kit Accessibility Guide](https://docs.dndkit.com/guides/accessibility)
- [GSAP Accessible Animation Guide](https://gsap.com/resources/a11y/)
- [Motion (Framer Motion) React Accessibility Docs](https://motion.dev/docs/react-accessibility)
- [The A11Y Project Checklist](https://www.a11yproject.com/checklist/)
- [David Mello: Implementing a Minimum Accessibility Test Plan](https://www.davidmello.com/implementing-a-minimum-accessibility-test-plan/)
- [Designing Solo: Navigating A11Y Project's Checklist with Automation](https://medium.com/civicactions/designing-solo-navigating-a11y-projects-checklist-with-automation-4fcc0ed18dbc)
- [Why Automated Accessibility Testing Isn't Enough — b13](https://b13.com/blog/why-automated-accessibility-testing-isnt-enough)
- [Web Accessibility in 2025: EAA Compliance & Modern Testing Tools](https://alisoueidan.com/blog/web-accessibility-in-2025-european-accessibility-act-modern-testing-tools-and-strategic-implementation)
- [Svelte Accessibility Warnings Docs](https://svelte.dev/docs/accessibility-warnings)

### Performance
- [Sentry: Frontend JavaScript Performance Testing](https://blog.sentry.io/frontend-javascript-performance-testing/)
- [Semaphore: Framer Motion vs GSAP](https://semaphore.io/blog/react-framer-motion-gsap)
- [UAV Development: Comparing Framer Motion and GSAP Performance](https://blog.uavdevelopment.io/blogs/comparing-the-performance-of-framer-motion-and-gsap-animations-in-next-js)
- [Google: Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [web.dev: Incorporate Performance Budgets into Build Tools](https://web.dev/articles/incorporate-performance-budgets-into-your-build-tools)
- [js-framework-benchmark](https://github.com/krausest/js-framework-benchmark)
- [size-limit](https://github.com/ai/size-limit)
