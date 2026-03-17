import type {
  ARAnimationLoop,
  ARAnimationOneShot,
  AttentionInterruptBehavior,
  AttentionRequesterAnimation,
} from "../AttentionRequester.types";

interface ARAnimationParams {
  name: string;
  duration: number;
  keyframes: Keyframe[] | ((el: HTMLElement) => Keyframe[]);
  onInterrupt?: AttentionInterruptBehavior;
}

interface ARAnimationLoopParams extends ARAnimationParams {
  loop: true;
  interval: number;
}

interface ARAnimationOneShotParams extends ARAnimationParams {
  loop?: false;
}

export type ARAnimationFactoryParams =
  | ARAnimationLoopParams
  | ARAnimationOneShotParams;

export function createARAnimation(
  params: ARAnimationLoopParams
): ARAnimationLoop;
export function createARAnimation(
  params: ARAnimationOneShotParams
): ARAnimationOneShot;
export function createARAnimation(
  params: ARAnimationFactoryParams
): AttentionRequesterAnimation {
  const onInterrupt = params.onInterrupt ?? "resume";

  if (params.loop) {
    return {
      name: params.name,
      duration: params.duration,
      loop: true,
      interval: params.interval,
      onInterrupt,
      keyframes: params.keyframes,
    } satisfies ARAnimationLoop;
  }

  return {
    name: params.name,
    duration: params.duration,
    onInterrupt,
    keyframes: params.keyframes,
  } satisfies ARAnimationOneShot;
}
