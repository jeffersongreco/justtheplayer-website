import type { Snippet } from "svelte";
import type { Action } from "svelte/action";

export type AttentionInterruptBehavior = "resume" | "discard";

export type InterruptResolution =
  | { strategy: "resume" }
  | { strategy: "discard"; interval: number };

export interface ARAnimationConfig {
  name: string;
  duration: number;
  keyframes: Keyframe[] | ((el: HTMLElement) => Keyframe[]);
  onInterrupt?: AttentionInterruptBehavior; // padrão: 'resume'
}

export interface ARAnimationLoop extends ARAnimationConfig {
  loop: true;
  interval: number;
}

export interface ARAnimationOneShot extends ARAnimationConfig {
  loop?: false;
}

export type AttentionRequesterAnimation = ARAnimationLoop | ARAnimationOneShot;

export interface AttentionRequester {
  request: (animation: AttentionRequesterAnimation) => void;
  cancel: () => void;
}

export type AttentionRequesterProps = {
  paused?: boolean;
} & (
  | { children: Snippet<[{ isAnimating: boolean }]>; asChild?: never }
  | { asChild: Snippet<[{ action: Action; isAnimating: boolean }]>; children?: never }
);
