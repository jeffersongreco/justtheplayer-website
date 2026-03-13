import type { Snippet } from "svelte";
import type { Action } from "svelte/action";

export type AttentionInterruptBehavior = "resume" | "discard";

export type PauseIntent =
  | { action: "freeze" } // isPaused virou true — congela
  | { action: "resume" } // resume normal
  | { action: "discard"; interval: number }; // descarta e aguarda intervalo

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
  | { children: Snippet; asChild?: never }
  | { asChild: Snippet<[{ action: Action }]>; children?: never }
);
