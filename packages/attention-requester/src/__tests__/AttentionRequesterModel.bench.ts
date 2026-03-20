import { bench, describe } from "vitest";
import type {
  ARAnimationLoop,
  ARAnimationOneShot,
} from "../lib/AttentionRequester.types";
import { AttentionRequesterModel } from "../lib/AttentionRequesterModel.svelte";

function oneShot(): ARAnimationOneShot {
  return {
    name: "bounce",
    duration: 300,
    keyframes: [{ translate: "0 -8px" }, { translate: "0 0" }],
  };
}

function looping(): ARAnimationLoop {
  return {
    name: "pulse",
    duration: 300,
    loop: true,
    interval: 500,
    keyframes: [{ translate: "0 -8px" }, { translate: "0 0" }],
  };
}

describe("Model throughput", () => {
  bench("request → onCycleFinished (one-shot cycle)", () => {
    const model = new AttentionRequesterModel();
    model.configure(oneShot());
    model.request();
    model.onCycleFinished();
  });

  bench("request → onCycleFinished (loop, 3 cycles + cancel)", () => {
    const model = new AttentionRequesterModel();
    model.configure(looping());
    model.request();
    model.onCycleFinished();
    model.onCycleFinished();
    model.onCycleFinished();
    model.cancel();
    model.onCycleFinished();
  });

  bench("pause → resume round-trip", () => {
    const model = new AttentionRequesterModel();
    model.configure(oneShot());
    model.request();
    model.pause();
    model.resume();
  });

  bench("configure with animation swap", () => {
    const model = new AttentionRequesterModel();
    const a = oneShot();
    const b = looping();
    model.configure(a);
    model.configure(b);
    model.configure(a);
  });
});
