# Frontend Logging Best Practices — Research (March 2026)

Research for instrumenting the Attention Requester package with developer-friendly logging that is zero-cost in production.

---

## 1. Performance Impact of console.log

### The Cost is Real (but Contextual)

- **Synchronous I/O**: `console.log` is synchronous — it blocks the main thread while serializing and outputting data.
- **Serialization overhead**: Complex objects must be converted to displayable strings. Logging a large object or deep structure is significantly more expensive than logging a primitive.
- **Benchmark**: A loop summing 10M numbers takes ~13ms without logging. Adding `console.log` on every iteration: **~27 seconds** (2000x slower). Logging every 100th iteration: ~314ms. The cost is proportional to call frequency, not mere presence.
- **When DevTools is closed**: Modern browsers (Chrome, Firefox) optimize console calls when DevTools is not open — the serialization still happens, but rendering does not. The cost is reduced but not zero.
- **Key takeaway**: A few dozen log calls per user interaction are negligible. Hundreds of calls per animation frame (e.g., logging inside a WAAPI `onframe` callback) would be catastrophic. The concern for this project is **animation-hot-path logging**, not general app logging.

### Compiled-Out vs. Left-in-but-Disabled

- **Compiled out (dead code elimination)**: Zero runtime cost. The code literally does not exist in the production bundle.
- **Left in but gated by a runtime boolean** (`if (DEBUG) log(...)`): Near-zero cost — a single boolean check per call site. The arguments are never evaluated if the branch is not taken. This is acceptable even in hot paths.
- **Left in with a library that checks log level internally** (e.g., `loglevel`): Minimal overhead — one function call + one level comparison. Arguments are still evaluated, though, so `log.debug("state:", expensiveSerialize())` would still pay the serialization cost even when disabled. Avoid expensive expressions in log arguments unless wrapped in a level guard.

---

## 2. Log Levels and Filtering

### Standard Levels (from most to least verbose)

| Level | Purpose | Browser console method |
|-------|---------|----------------------|
| `trace` | Granular step-by-step (animation frames, state machine transitions) | `console.trace` / `console.debug` |
| `debug` | Developer-interesting events (animation started, element bound) | `console.debug` |
| `info` | Notable lifecycle events (controller initialized, config applied) | `console.info` |
| `warn` | Recoverable issues (fallback used, deprecated option) | `console.warn` |
| `error` | Failures (animation failed, element not found) | `console.error` |

### Filtering Patterns

1. **Runtime level threshold**: Set a minimum level (e.g., `warn`), and all calls below it are no-ops. Libraries like `loglevel` default to `warn` in production.
2. **Namespace filtering** (the `debug` package pattern): Each logger instance has a namespace (e.g., `ar:controller`, `ar:animation:bounce`). Enable/disable via a pattern string: `ar:*` enables all, `ar:controller,-ar:animation:*` enables controller but not animations.
3. **Build-time elimination**: The most aggressive — debug/trace calls are removed entirely from the production bundle.

---

## 3. Build-Time Removal Strategies

### Strategy A: Vite's `import.meta.env.DEV` (Recommended for this project)

Vite statically replaces `import.meta.env.DEV` with `true` in dev and `false` in production. Code inside `if (import.meta.env.DEV)` blocks is then dead-code-eliminated by the minifier.

```ts
if (import.meta.env.DEV) {
  console.log('[AR] Animation started:', animationName);
}
```

**Pros**: Zero config, works out of the box with Vite/SvelteKit, zero production cost, tree-shakes perfectly.
**Cons**: Verbose if used on every log call. Better to wrap in a utility.

### Strategy B: esbuild `drop` option

```ts
// vite.config.ts
export default defineConfig({
  esbuild: {
    drop: ['console', 'debugger'],  // drops ALL console.* calls
  },
});
```

**Pros**: One line of config, removes everything.
**Cons**: Removes `console.error` and `console.warn` too — usually undesirable. No granularity.

### Strategy C: esbuild `pure` option

```ts
// vite.config.ts
export default defineConfig({
  esbuild: {
    pure: ['console.log', 'console.debug', 'console.trace'],
  },
});
```

**Pros**: Selective — keeps `console.warn` and `console.error`. Marks specified calls as side-effect-free so the minifier removes them.
**Cons**: Only works on direct `console.method()` calls — does NOT work on wrapper functions (e.g., `logger.debug()`). Also, if log arguments have side effects (function calls), those side effects are preserved even though the console call is removed.

### Strategy D: esbuild `dropLabels` (newer approach)

```ts
// vite.config.ts
export default defineConfig({
  esbuild: {
    dropLabels: ['DEV'],
  },
});

// In source code:
DEV: console.log('[AR] state transition:', oldState, '->', newState);
DEV: {
  console.log('[AR] detailed debug info');
  console.log('[AR] animation config:', config);
}
```

**Pros**: Works with wrapper functions. Explicit — you label exactly what should be dropped. Works reliably with esbuild.
**Cons**: Unusual JavaScript syntax (labeled statements). Might confuse developers unfamiliar with it.

### Strategy E: Terser (if switching from esbuild)

```ts
// vite.config.ts
export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        pure_funcs: ['console.log', 'console.debug'],
      },
    },
  },
});
```

**Pros**: Very mature, well-understood. `pure_funcs` is granular.
**Cons**: Terser is significantly slower than esbuild. Vite defaults to esbuild for minification and switching adds build time.

### Recommendation for This Project

**Use Strategy A (`import.meta.env.DEV`) combined with a thin wrapper function.** This gives:
- Zero-config production removal (Vite handles it)
- Works with any wrapper function (not limited to direct `console.*` calls)
- Explicit — developers can see exactly what's dev-only
- No build config changes needed

If verbosity of the `if` guard bothers you, Strategy D (`dropLabels`) is a clean alternative that works with wrapper functions.

---

## 4. Logging Libraries Comparison

### `debug` (npm: debug, ~77M weekly downloads)

- **Size**: ~4KB minified
- **Pattern**: Namespace-based. Create loggers per module: `debug('ar:controller')`, `debug('ar:animation:bounce')`.
- **Enabling**: In browser, set `localStorage.debug = 'ar:*'` to enable all AR namespaces. Supports wildcards and exclusions (`ar:*,-ar:animation:*`).
- **Output**: Uses `console.debug` in browsers. Adds colorized namespace prefixes and timing deltas between calls.
- **Browser behavior**: In Chromium, output only shows when "Verbose" log level is enabled in DevTools.
- **Pros**: Battle-tested (56K+ dependents), excellent namespace filtering, zero output when disabled (function is a no-op), great for "leave logs in code permanently" pattern.
- **Cons**: No built-in log levels (it's debug-or-nothing per namespace). Not tree-shakeable in production — the library code and log call sites remain in the bundle even when disabled. You need build-time removal for zero production cost.

### `loglevel` (npm: loglevel, ~12M weekly downloads)

- **Size**: ~1.4KB minified + gzipped
- **Pattern**: Level-based. `log.debug(...)`, `log.info(...)`, `log.warn(...)`, `log.error(...)`.
- **Enabling**: `log.setLevel('warn')` — all calls below warn become no-ops. Can be changed at runtime (even from DevTools console).
- **Output**: Directly calls bound `console` methods — preserves original stack traces and file/line references.
- **Pros**: Tiny, zero dependencies, TypeScript types included, preserves stack traces (unlike wrappers that lose call site info), plugin API for custom formatting.
- **Cons**: No namespace filtering (all-or-nothing per level). No built-in production stripping — disabled levels are cheap (one boolean check) but not free.

### `consola` (npm: consola, by UnJS)

- **Size**: ~5KB minified
- **Pattern**: Level-based with reporters. `consola.debug(...)`, `consola.info(...)`, etc.
- **Enabling**: `consola.level = 3` (numeric levels).
- **Pros**: Beautiful formatted output, works in Node and browser, supports custom reporters, integrates with UnJS ecosystem.
- **Cons**: Heavier than needed for a focused UI component library. More suited to full applications.

### `pino` (browser build)

- **Size**: ~3KB for browser build
- **Pattern**: Structured JSON logging with levels.
- **Pros**: Extremely fast in Node (but this advantage doesn't apply in browser). Structured logs are great for log aggregation services.
- **Cons**: Overkill for browser-only component library logging. The browser build is a thin wrapper.

### Rolling Your Own (Recommended for this project)

For a self-contained UI component library like Attention Requester, a custom ~20-line utility is likely the best fit:

```ts
// logger.ts
const createLogger = (namespace: string) => {
  const prefix = `[${namespace}]`;

  return {
    debug: (...args: unknown[]) => {
      if (import.meta.env.DEV) console.debug(prefix, ...args);
    },
    info: (...args: unknown[]) => {
      if (import.meta.env.DEV) console.info(prefix, ...args);
    },
    warn: (...args: unknown[]) => console.warn(prefix, ...args),
    error: (...args: unknown[]) => console.error(prefix, ...args),
  };
};

// Usage:
const log = createLogger('AR:Controller');
log.debug('Animation started', { name, element }); // stripped in production
log.warn('Element not found, using fallback');       // kept in production
```

**Pros**: Zero dependencies, exact behavior you want, tree-shakes perfectly via `import.meta.env.DEV`, trivial to maintain, preserves warn/error in production.
**Cons**: No runtime namespace filtering (but you get build-time elimination which is better for production anyway).

---

## 5. The "Leave Logs in Code Permanently" Pattern

### Philosophy

Mature projects treat debug logs as **permanent documentation of runtime behavior**, not temporary debugging aids. Logs are:
- Written once, stay forever in source
- Compiled out of production builds (zero cost)
- Selectively enabled during development for the subsystem you're investigating

### How `debug` Implements This

1. Each module creates a namespaced logger: `const dbg = debug('ar:animation:bounce')`
2. Developers sprinkle `dbg('keyframe %d applied', idx)` throughout the code
3. In production: no output (but code is still present unless build-stripped)
4. In development: set `localStorage.debug = 'ar:animation:*'` in browser DevTools console, reload, and see only animation logs
5. The namespace hierarchy (`ar:animation:bounce`, `ar:controller`, `ar:model`) lets you zoom in on specific subsystems

### How to Get Zero Production Cost

The `debug` package itself does NOT tree-shake out. To get truly zero-cost production:

**Option 1**: Wrap in `import.meta.env.DEV` guard:
```ts
if (import.meta.env.DEV) {
  dbg('animation state:', state);
}
```

**Option 2**: Use esbuild `dropLabels`:
```ts
DEV: dbg('animation state:', state);
```

**Option 3**: Custom wrapper (see section 4) that inlines the DEV check.

**Option 4**: Use Vite's `define` to replace debug with a no-op in production:
```ts
// vite.config.ts
export default defineConfig({
  define: {
    'import.meta.env.DEV': mode !== 'production',
  },
});
```
(Vite already does this by default, so wrapping with `import.meta.env.DEV` is the simplest path.)

---

## 6. SvelteKit + Vite Specifics

### `import.meta.env.DEV` — The First-Class Solution

- Vite replaces `import.meta.env.DEV` with `false` at build time in production mode
- The minifier (esbuild) then eliminates the dead `if (false) { ... }` block
- This works in `.ts`, `.js`, and `.svelte` files — anywhere Vite processes
- **SvelteKit** uses Vite under the hood, so this works identically

### Vite `define` Option

```ts
// vite.config.ts
export default defineConfig({
  define: {
    __DEV__: JSON.stringify(mode !== 'production'),
  },
});
```

Creates a custom compile-time constant. Useful if you want a shorter identifier than `import.meta.env.DEV`. The replacement and dead-code elimination work the same way.

### Combining with SvelteKit's Adapter-Static

Since this project deploys to Cloudflare Pages via `adapter-static`, the build is a standard Vite production build. All the above strategies (env.DEV, esbuild drop/pure, terser) work normally. No SSR-specific considerations for logging.

### Svelte 5 Runes Consideration

In Svelte 5 with runes, `$derived` and `$effect` run reactively. Logging inside these should be done carefully:
- Logging inside `$effect` is fine for debugging (the effect runs when dependencies change)
- Avoid logging inside `$derived` in production — it runs on every dependency change and adds overhead
- Wrap any `$derived`/`$effect` logging in `import.meta.env.DEV` guards

---

## 7. Logging for Animation State Machines / WAAPI

### What to Log

For an animation orchestrator like Attention Requester, the most valuable log points are:

1. **State transitions**: `idle -> playing -> finished` (the most useful for debugging)
2. **Animation creation**: What WAAPI keyframes and options were computed
3. **Element binding**: When an element is registered/deregistered with the controller
4. **Timing anomalies**: Animation cancelled unexpectedly, element removed mid-animation
5. **Configuration applied**: What options resolved after defaults/overrides

### What NOT to Log

- Per-frame data (use Chrome DevTools Performance panel or Animation inspector instead)
- WAAPI internal state that's already visible in DevTools Animations tab

### Chrome DevTools Animation Inspector

Chrome and Edge have a built-in **Animations panel** (DevTools > More tools > Animations) that:
- Records all WAAPI animations in real-time
- Shows timeline, easing curves, and keyframes visually
- Allows scrubbing/slowing/replaying animations
- Displays animation names (set via `animation.id = 'bounce'`)

**Best practice**: Always set `animation.id` on WAAPI `Animation` objects. This makes them identifiable in the Animations panel without any logging code.

### Recommended Instrumentation Pattern

```ts
// In AttentionRequesterController
const log = createLogger('AR:Controller');

startAnimation(name: string) {
  log.debug('Starting animation', { name, element: this.element?.tagName });

  const animation = element.animate(keyframes, options);
  animation.id = `ar-${name}`; // Shows in DevTools Animations panel

  animation.onfinish = () => {
    log.debug('Animation finished', { name });
    this.state = 'idle';
  };

  animation.oncancel = () => {
    log.warn('Animation cancelled unexpectedly', { name });
    this.state = 'idle';
  };
}
```

### Performance Panel Integration

For complex animation debugging, `performance.mark()` and `performance.measure()` are superior to console logging:

```ts
if (import.meta.env.DEV) {
  performance.mark('ar-animation-start');
}
// ... animation runs ...
if (import.meta.env.DEV) {
  performance.mark('ar-animation-end');
  performance.measure('AR Animation', 'ar-animation-start', 'ar-animation-end');
}
```

These marks show up in Chrome DevTools Performance recordings without any console noise.

---

## Summary / Recommendation for Attention Requester

| Aspect | Recommendation |
|--------|---------------|
| **Library** | Roll your own (~20 lines). No external dependency needed. |
| **Production stripping** | `import.meta.env.DEV` guards — zero config, zero cost |
| **Log levels** | `debug` and `warn`/`error` minimum. Debug is dev-only, warn/error persist. |
| **Namespaces** | Prefix-based: `[AR:Controller]`, `[AR:Animation:Bounce]`, `[AR:Model]` |
| **WAAPI debugging** | Set `animation.id` for DevTools Animations panel. Use `performance.mark()` for timing. |
| **Svelte 5** | Guard logs in `$effect`/`$derived` with `import.meta.env.DEV` |
