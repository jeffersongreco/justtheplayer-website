<script lang="ts">
  import Draggable from "$lib/Sensor/Draggable.svelte";
  import { DragModel } from "$lib/Sensor/DragModel.svelte";

  const model = new DragModel("50%", "50%");
</script>

<div class="demo-stage">
  <h1>Tutorial Interativo</h1>
  <p>
    Tutorial status:
    {model.isTutorialFinished ? 'Tutorial Completo!' : 'Aguardando ação...'}
  </p>
  <p>
    Position status:
    {model.isIntersecting ? 'Sobre o sensor' : 'Fora do sensor'}
  </p>

  <div class="boundary">
    <div use:model.target class="sensor-area">SENSOR</div>

    <Draggable model={model}>Drag Me</Draggable>
  </div>
</div>

<style>
  :global(body) {
    font-family: system-ui, sans-serif;
    background: #222;
    color: #eee;
    padding: 2rem;
  }

  .boundary {
    position: relative;
    width: 100%;
    max-width: 600px;
    height: 400px;
    background: #333;
    border-radius: 12px;
    margin-top: 20px;
    overflow: hidden;
  }

  .sensor-area {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120px;
    height: 120px;
    border: 2px dashed #666;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #888;
    font-weight: bold;
    pointer-events: none; /* Deixa o click passar se necessário */
  }
</style>
