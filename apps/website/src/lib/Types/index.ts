import type { Action } from "svelte/action";

export type Ref<T = undefined> = Action<HTMLElement, T>;
