// @vitest-environment jsdom

import axe from "axe-core";
import { mount, unmount } from "svelte";
import { afterEach, describe, expect, it, vi } from "vitest";
import A11yFixture from "./fixtures/A11yFixture.svelte";

// ---------------------------------------------------------------------------
// jsdom lacks matchMedia — stub it so the component can mount.
// This is not a behavioral mock: jsdom simply doesn't implement this API.
// ---------------------------------------------------------------------------
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// ---------------------------------------------------------------------------
// jsdom lacks Element.animate (WAAPI) — stub it so the controller doesn't throw.
// axe-core only inspects the DOM tree, not running animations.
// ---------------------------------------------------------------------------
Element.prototype.animate = vi.fn().mockReturnValue({
  finished: Promise.resolve(),
  cancel: vi.fn(),
  pause: vi.fn(),
  play: vi.fn(),
  onfinish: null,
});

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------
let container: HTMLDivElement;
let component: Record<string, unknown>;

function mountFixture() {
  container = document.createElement("div");
  document.body.appendChild(container);
  component = mount(A11yFixture, { target: container });
}

afterEach(() => {
  if (component) {
    unmount(component);
  }
  container?.remove();
});

function formatViolations(violations: axe.Result[]): string {
  return violations
    .map(
      (v) =>
        `[${v.impact}] ${v.id}: ${v.description}\n` +
        `  Help: ${v.helpUrl}\n` +
        v.nodes.map((n) => `  → ${n.html}\n    ${n.failureSummary}`).join("\n")
    )
    .join("\n\n");
}

// ---------------------------------------------------------------------------
// axe-core configuration
// ---------------------------------------------------------------------------
// Rules that require a real browser and cannot run in jsdom:
//   - color-contrast: needs canvas for font metrics / computed styles
const AXE_OPTIONS: axe.RunOptions = {
  rules: {
    "color-contrast": { enabled: false },
  },
};

// ===========================================================================
// axe-core audit — children mode (default)
// ===========================================================================

describe("Attention Requester — axe-core audit", {
  tags: ["integration"],
}, () => {
  it("children mode: no accessibility violations", async () => {
    mountFixture();

    const results = await axe.run(container, AXE_OPTIONS);

    expect(
      results.violations,
      `axe-core found violations:\n\n${formatViolations(results.violations)}`
    ).toEqual([]);
  });

  it("children mode: no serious incomplete checks", async () => {
    mountFixture();

    const results = await axe.run(container, AXE_OPTIONS);

    const serious = results.incomplete.filter(
      (r) => r.impact === "critical" || r.impact === "serious"
    );

    expect(
      serious,
      `axe-core flagged serious incomplete checks:\n\n${formatViolations(serious)}`
    ).toEqual([]);
  });
});
