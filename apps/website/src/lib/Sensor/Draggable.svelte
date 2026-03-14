<script lang="ts">
  import "./Motion.css";
  import type { DragModel } from "./DragModel.svelte";
  import { TutorialModel } from "./TutorialModel.svelte";

  let {
    model,
    children,
    class: className = "",
  }: {
    model: DragModel;
    children?: import("svelte").Snippet;
    class?: string;
  } = $props();
  const tutorial = new TutorialModel(model);
</script>

<div
  use:model.source
  class="draggable-wrapper"
  role="button"
  tabindex="0"
  aria-grabbed={model.isDragging}
>
  <div
    class="draggable-visual {className}"
    style="--target-angle: {tutorial.angle}rad"
    class:motion-throw-right={tutorial.currentAnimation === 'anim-right'}
    class:motion-homing={tutorial.currentAnimation === 'anim-homing'}
    onanimationend={() => tutorial.notifyAnimationComplete()}
  >
    {@render children?.()}
  </div>
</div>

<style>
  /* CSS ESTRUTURAL
     Apenas o necessário para o componente existir no espaço.
     Zero keyframes. Zero magic numbers de física.
  */

  .draggable-wrapper {
    display: inline-flex;
    vertical-align: top;
    /* Isola o contexto de empilhamento para evitar problemas de z-index */
    isolation: isolate;
  }

  .draggable-visual {
    display: flex;
    will-change: transform;
    /* A transição visual (filter/scale) é local, pois é específica deste componente */
    transition: filter 0.2s cubic-bezier(0.2, 0, 0.2, 1);
  }

  /* Estado de "Pegando" (Interaction State) */
  :global(.draggable-wrapper[aria-grabbed="true"]).draggable-visual {
    /* Override importante para cancelar a física global */
    animation: none !important;
    transform: none !important;

    /* Feedback visual tátil */
    filter: brightness(1.1) scale(1.05);
    cursor: grabbing;
  }
</style>
