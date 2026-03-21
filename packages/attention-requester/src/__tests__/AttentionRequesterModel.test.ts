import { describe, expect, it } from "vitest";
import type {
  ARAnimationLoop,
  ARAnimationOneShot,
  AttentionRequesterAnimation,
} from "../lib/AttentionRequester.types";
import {
  AttentionRequesterModel,
  resolveInterruptResolution,
} from "../lib/AttentionRequesterModel.svelte";

// ---------------------------------------------------------------------------
// Test helpers — animation factories
// ---------------------------------------------------------------------------

function oneShot(overrides?: Partial<ARAnimationOneShot>): ARAnimationOneShot {
  return {
    name: "bounce",
    duration: 300,
    keyframes: [{ translate: "0 -8px" }, { translate: "0 0" }],
    ...overrides,
  };
}

function looping(overrides?: Partial<ARAnimationLoop>): ARAnimationLoop {
  return {
    name: "pulse",
    duration: 300,
    loop: true,
    interval: 500,
    keyframes: [{ translate: "0 -8px" }, { translate: "0 0" }],
    ...overrides,
  };
}

/** Configure + request in a single helper */
function requestAnimation(
  model: AttentionRequesterModel,
  animation: AttentionRequesterAnimation
) {
  model.configure(animation);
  model.request();
}

// ===========================================================================
// §2.1 Idle → Animating
// ===========================================================================

describe("§2.1 Idle → Animating", { tags: ["unit"] }, () => {
  it("starts idle: isActive is false, isPaused is false", () => {
    const model = new AttentionRequesterModel();
    expect(model.isActive).toBe(false);
    expect(model.isPaused).toBe(false);
  });

  it("request() transitions to animating", () => {
    const model = new AttentionRequesterModel();
    requestAnimation(model, oneShot());
    expect(model.isActive).toBe(true);
  });
});

// ===========================================================================
// §2.2 Cycle Completion
// ===========================================================================

describe("§2.2 Cycle Completion", { tags: ["unit"] }, () => {
  it("one-shot: onCycleFinished returns to idle", () => {
    const model = new AttentionRequesterModel();
    requestAnimation(model, oneShot());
    model.onCycleFinished();
    expect(model.isActive).toBe(false);
  });

  it("loop: onCycleFinished keeps animating", () => {
    const model = new AttentionRequesterModel();
    requestAnimation(model, looping());
    model.onCycleFinished();
    expect(model.isActive).toBe(true);
  });

  it("loop: multiple cycles keep animating", () => {
    const model = new AttentionRequesterModel();
    requestAnimation(model, looping());
    model.onCycleFinished();
    model.onCycleFinished();
    model.onCycleFinished();
    expect(model.isActive).toBe(true);
  });
});

// ===========================================================================
// §2.3 Cancellation
// ===========================================================================

describe("§2.3 Cancellation", { tags: ["unit"] }, () => {
  it("cancel sets graceful stop: still active until cycle finishes", () => {
    const model = new AttentionRequesterModel();
    requestAnimation(model, looping());
    model.cancel();
    expect(model.isActive).toBe(true);
  });

  it("after cancel, onCycleFinished returns to idle", () => {
    const model = new AttentionRequesterModel();
    requestAnimation(model, looping());
    model.cancel();
    model.onCycleFinished();
    expect(model.isActive).toBe(false);
  });

  it("cancel during idle: no-op, no error", () => {
    const model = new AttentionRequesterModel();
    expect(() => model.cancel()).not.toThrow();
    expect(model.isActive).toBe(false);
  });

  it("cancel is idempotent: multiple calls safe", () => {
    const model = new AttentionRequesterModel();
    requestAnimation(model, looping());
    model.cancel();
    model.cancel();
    model.cancel();
    expect(model.isActive).toBe(true);
    model.onCycleFinished();
    expect(model.isActive).toBe(false);
  });
});

// ===========================================================================
// §2.4 Re-entrancy
// ===========================================================================

describe("§2.4 Re-entrancy", { tags: ["unit"] }, () => {
  it("request() while already active does not crash", () => {
    const model = new AttentionRequesterModel();
    requestAnimation(model, oneShot());
    expect(() => requestAnimation(model, oneShot())).not.toThrow();
    expect(model.isActive).toBe(true);
  });

  it("request() after cancel but before cycle ends does not crash", () => {
    const model = new AttentionRequesterModel();
    requestAnimation(model, looping());
    model.cancel();
    expect(() => requestAnimation(model, oneShot())).not.toThrow();
  });
});

// ===========================================================================
// §3.1 Pause/Resume — Resume Strategy (default)
// ===========================================================================

describe("§3.1 Pause/Resume — Resume Strategy", { tags: ["unit"] }, () => {
  it("pause() sets isPaused to true, stays active", () => {
    const model = new AttentionRequesterModel();
    requestAnimation(model, oneShot());
    model.pause();
    expect(model.isPaused).toBe(true);
    expect(model.isActive).toBe(true);
  });

  it("resume() clears isPaused", () => {
    const model = new AttentionRequesterModel();
    requestAnimation(model, oneShot());
    model.pause();
    model.resume();
    expect(model.isPaused).toBe(false);
  });

  it('interruptResolution reflects "resume" with default strategy', () => {
    const model = new AttentionRequesterModel();
    requestAnimation(model, oneShot());
    expect(model.interruptResolution).toEqual({ strategy: "resume" });
  });
});

// ===========================================================================
// §3.2 Pause/Resume — Discard Strategy
// ===========================================================================

describe("§3.2 Pause/Resume — Discard Strategy", { tags: ["unit"] }, () => {
  it('interruptResolution reflects "discard" with discard strategy', () => {
    const model = new AttentionRequesterModel();
    requestAnimation(model, looping({ onInterrupt: "discard" }));
    expect(model.interruptResolution).toEqual({
      strategy: "discard",
      interval: 500,
    });
  });

  it("discard strategy includes interval from the animation", () => {
    const model = new AttentionRequesterModel();
    requestAnimation(
      model,
      looping({ onInterrupt: "discard", interval: 1000 })
    );
    expect(model.interruptResolution).toEqual({
      strategy: "discard",
      interval: 1000,
    });
  });

  it("discard strategy with one-shot has interval 0", () => {
    const model = new AttentionRequesterModel();
    requestAnimation(model, oneShot({ onInterrupt: "discard" }));
    expect(model.interruptResolution).toEqual({
      strategy: "discard",
      interval: 0,
    });
  });
});

// ===========================================================================
// §3.3 Pause Edge Cases
// ===========================================================================

describe("§3.3 Pause Edge Cases", { tags: ["unit"] }, () => {
  it("pause when idle: no-op", () => {
    const model = new AttentionRequesterModel();
    model.pause();
    expect(model.isPaused).toBe(false);
  });

  it("pause is idempotent: multiple pauses safe", () => {
    const model = new AttentionRequesterModel();
    requestAnimation(model, oneShot());
    model.pause();
    model.pause();
    model.pause();
    expect(model.isPaused).toBe(true);
  });

  it("resume when not paused: safe, no error", () => {
    const model = new AttentionRequesterModel();
    expect(() => model.resume()).not.toThrow();
    expect(model.isPaused).toBe(false);
  });

  it("pause then cancel: finishes gracefully", () => {
    const model = new AttentionRequesterModel();
    requestAnimation(model, looping());
    model.pause();
    model.cancel();
    model.resume();
    model.onCycleFinished();
    expect(model.isActive).toBe(false);
    expect(model.isPaused).toBe(false);
  });
});

// ===========================================================================
// §4 Pluggable Animations
// ===========================================================================

describe("§4 Pluggable Animations", { tags: ["unit"] }, () => {
  it("animation data is stored as-is from configure()", () => {
    const model = new AttentionRequesterModel();
    const anim = oneShot();
    model.configure(anim);
    expect(model.animation).toBe(anim);
  });

  it("different animations can be used on successive requests", () => {
    const model = new AttentionRequesterModel();
    const bounce = oneShot({ name: "bounce" });
    const shake = oneShot({ name: "shake" });

    requestAnimation(model, bounce);
    expect(model.animation?.name).toBe("bounce");
    model.onCycleFinished();

    requestAnimation(model, shake);
    expect(model.animation?.name).toBe("shake");
  });

  it("loop vs one-shot is declared by the animation, not the component", () => {
    const model = new AttentionRequesterModel();

    requestAnimation(model, oneShot());
    model.onCycleFinished();
    expect(model.isActive).toBe(false);

    requestAnimation(model, looping());
    model.onCycleFinished();
    expect(model.isActive).toBe(true);
  });

  it('default interruption strategy is "resume" when not specified', () => {
    const model = new AttentionRequesterModel();
    requestAnimation(model, oneShot()); // no onInterrupt
    expect(model.interruptResolution).toEqual({ strategy: "resume" });
  });
});

// ===========================================================================
// §5 Behavioral Invariants
// ===========================================================================

describe("§5 Behavioral Invariants", { tags: ["unit"] }, () => {
  it("state consistency: isActive matches actual state through transitions", () => {
    const model = new AttentionRequesterModel();
    expect(model.isActive).toBe(false);

    requestAnimation(model, oneShot());
    expect(model.isActive).toBe(true);

    model.onCycleFinished();
    expect(model.isActive).toBe(false);
  });

  it("no stacking: second request() does not create parallel state", () => {
    const model = new AttentionRequesterModel();
    requestAnimation(model, oneShot());
    requestAnimation(model, oneShot());
    // Only one active animation
    expect(model.isActive).toBe(true);
    model.onCycleFinished();
    expect(model.isActive).toBe(false);
  });
});

// ===========================================================================
// §7 Reduced Motion
// ===========================================================================

describe("§7.1 Reduced Motion Suppresses Animation", { tags: ["unit"] }, () => {
  it("request() is a no-op when reduced motion is active and no alternative provided", () => {
    const model = new AttentionRequesterModel();
    model.setReducedMotion(true);
    requestAnimation(model, oneShot());
    expect(model.isActive).toBe(false);
  });

  it("reduced motion does not affect state when idle", () => {
    const model = new AttentionRequesterModel();
    model.setReducedMotion(true);
    expect(model.isActive).toBe(false);
    expect(model.isPaused).toBe(false);
  });

  it("request() plays the reduced-motion alternative when provided", () => {
    const model = new AttentionRequesterModel();
    model.setReducedMotion(true);
    const primary = oneShot({ name: "bounce" });
    const reduced = oneShot({ name: "fade", duration: 200 });
    model.configure(primary, reduced);
    model.request();
    expect(model.isActive).toBe(true);
    expect(model.animation?.name).toBe("fade");
  });

  it("uses primary animation when reduced motion is inactive even if alternative provided", () => {
    const model = new AttentionRequesterModel();
    model.setReducedMotion(false);
    const primary = oneShot({ name: "bounce" });
    const reduced = oneShot({ name: "fade" });
    model.configure(primary, reduced);
    model.request();
    expect(model.isActive).toBe(true);
    expect(model.animation?.name).toBe("bounce");
  });

  it("reduced-motion alternative respects loop/one-shot contract", () => {
    const model = new AttentionRequesterModel();
    model.setReducedMotion(true);
    const primary = looping({ name: "bounce-loop" });
    const reduced = oneShot({ name: "fade-once" });
    model.configure(primary, reduced);
    model.request();
    model.onCycleFinished();
    expect(model.isActive).toBe(false);
  });

  it("interruptResolution reflects the reduced-motion animation when active", () => {
    const model = new AttentionRequesterModel();
    model.setReducedMotion(true);
    const primary = looping({ onInterrupt: "discard", interval: 500 });
    const reduced = oneShot({ name: "fade", onInterrupt: "resume" });
    model.configure(primary, reduced);
    expect(model.interruptResolution).toEqual({ strategy: "resume" });
  });
});

describe("§7.2 Reduced Motion Dynamic Changes", { tags: ["unit"] }, () => {
  it("activating reduced motion suppresses future requests without alternative", () => {
    const model = new AttentionRequesterModel();
    requestAnimation(model, oneShot());
    model.onCycleFinished();

    model.setReducedMotion(true);
    requestAnimation(model, oneShot());
    expect(model.isActive).toBe(false);
  });

  it("deactivating reduced motion allows requests again", () => {
    const model = new AttentionRequesterModel();
    model.setReducedMotion(true);
    requestAnimation(model, oneShot());
    expect(model.isActive).toBe(false);

    model.setReducedMotion(false);
    requestAnimation(model, oneShot());
    expect(model.isActive).toBe(true);
  });

  it("activating reduced motion switches to alternative for future requests", () => {
    const model = new AttentionRequesterModel();
    const primary = oneShot({ name: "bounce" });
    const reduced = oneShot({ name: "fade" });
    model.configure(primary, reduced);
    model.request();
    model.onCycleFinished();

    model.setReducedMotion(true);
    model.request();
    expect(model.isActive).toBe(true);
    expect(model.animation?.name).toBe("fade");
  });

  it("deactivating reduced motion switches back to primary", () => {
    const model = new AttentionRequesterModel();
    const primary = oneShot({ name: "bounce" });
    const reduced = oneShot({ name: "fade" });
    model.configure(primary, reduced);

    model.setReducedMotion(true);
    expect(model.animation?.name).toBe("fade");

    model.setReducedMotion(false);
    expect(model.animation?.name).toBe("bounce");
  });
});

describe("§7.3 Reduced Motion Does Not Affect Active Animation", {
  tags: ["unit"],
}, () => {
  it("active animation continues when reduced motion is enabled", () => {
    const model = new AttentionRequesterModel();
    requestAnimation(model, oneShot());
    expect(model.isActive).toBe(true);

    model.setReducedMotion(true);
    expect(model.isActive).toBe(true);
  });

  it("active looping animation finishes cycle normally", () => {
    const model = new AttentionRequesterModel();
    requestAnimation(model, looping());
    model.setReducedMotion(true);

    model.onCycleFinished();
    // Loop continues because the animation was already active
    expect(model.isActive).toBe(true);
  });
});

// ===========================================================================
// §6 Multiple Instances
// ===========================================================================

describe("§6 Multiple Instances", { tags: ["unit"] }, () => {
  it("two models operate independently", () => {
    const a = new AttentionRequesterModel();
    const b = new AttentionRequesterModel();

    requestAnimation(a, oneShot());
    expect(a.isActive).toBe(true);
    expect(b.isActive).toBe(false);

    requestAnimation(b, looping());
    expect(a.isActive).toBe(true);
    expect(b.isActive).toBe(true);
  });

  it("cancelling one does not affect the other", () => {
    const a = new AttentionRequesterModel();
    const b = new AttentionRequesterModel();

    requestAnimation(a, looping());
    requestAnimation(b, looping());

    a.cancel();
    a.onCycleFinished();

    expect(a.isActive).toBe(false);
    expect(b.isActive).toBe(true);
  });
});

// ===========================================================================
// resolveInterruptResolution (pure function)
// ===========================================================================

describe("resolveInterruptResolution", { tags: ["unit"] }, () => {
  it("returns resume when animation is null", () => {
    expect(resolveInterruptResolution(null)).toEqual({ strategy: "resume" });
  });

  it("returns resume when no onInterrupt is specified", () => {
    expect(resolveInterruptResolution(oneShot())).toEqual({
      strategy: "resume",
    });
  });

  it('returns resume when onInterrupt is "resume"', () => {
    expect(
      resolveInterruptResolution(oneShot({ onInterrupt: "resume" }))
    ).toEqual({ strategy: "resume" });
  });

  it("returns discard with interval for looping animation", () => {
    expect(
      resolveInterruptResolution(
        looping({ onInterrupt: "discard", interval: 800 })
      )
    ).toEqual({
      strategy: "discard",
      interval: 800,
    });
  });

  it("returns discard with interval 0 for one-shot animation", () => {
    expect(
      resolveInterruptResolution(oneShot({ onInterrupt: "discard" }))
    ).toEqual({
      strategy: "discard",
      interval: 0,
    });
  });
});
