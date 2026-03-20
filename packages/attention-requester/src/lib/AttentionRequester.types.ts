import type { Snippet } from "svelte";
import type { Action } from "svelte/action";

export type AttentionInterruptBehavior = "resume" | "discard";

export type InterruptResolution =
  | { strategy: "resume" }
  | { strategy: "discard"; interval: number };

export interface ARAnimationConfig {
  duration: number;
  keyframes: Keyframe[] | ((el: HTMLElement) => Keyframe[]);
  name: string;
  onInterrupt?: AttentionInterruptBehavior; // padrão: 'resume'
}

export interface ARAnimationLoop extends ARAnimationConfig {
  interval: number;
  loop: true;
}

export interface ARAnimationOneShot extends ARAnimationConfig {
  loop?: false;
}

export type AttentionRequesterAnimation = ARAnimationLoop | ARAnimationOneShot;

export interface AttentionRequester {
  cancel: () => void;
  request: (animation: AttentionRequesterAnimation) => void;
}

export type AttentionRequesterProps = {
  paused?: boolean;
} & (
  | { children: Snippet<[{ isAnimating: boolean }]>; asChild?: never }
  | {
      asChild: Snippet<[{ action: Action; isAnimating: boolean }]>;
      children?: never;
    }
);
