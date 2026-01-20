<!-- +page.svelte -->
<script lang="ts">
  import { dragManager } from "$lib/Draggable/DragManager";
  import { dragModel } from "$lib/Draggable/DragModel.svelte";
  import DropTarget from "$lib/Draggable/DropTarget.svelte";

  let status = $state("Idle");
</script>

<div class="demo-stage">
  <h1>Robust Drag Free (MV Architecture)</h1>
  <p>Status: {status}</p>
  <p>Coordinates: {Math.round(dragModel.x)}, {Math.round(dragModel.y)}</p>

  <div class="boundary">
    <!-- Draggable Element -->
    <div use:dragManager class="draggable-box">Drag Me</div>

    <!-- Targets -->
    <div class="targets-container">
      <DropTarget id="zone-1" onDrop={() => status = "Dropped in Zone 1"}>
        {#snippet children({ isOver, targetAction })}
          <div use:targetAction class="target" class:active={isOver}>
            {isOver ? "Release!" : "Zone 1"}
          </div>
        {/snippet}
      </DropTarget>

      <DropTarget id="zone-2" onDrop={() => status = "Dropped in Zone 2"}>
        {#snippet children({ isOver, targetAction })}
          <div use:targetAction class="target" class:active={isOver}>
            {isOver ? "Release!" : "Zone 2"}
          </div>
        {/snippet}
      </DropTarget>
    </div>
  </div>
</div>

<style>
  :global(body) {
    font-family: system-ui, -apple-system, sans-serif;
    background: #222;
    color: #eee;
    height: 100vh;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .demo-stage {
    text-align: center;
    width: 100%;
    max-width: 800px;
  }

  .boundary {
    position: relative; /* Essential for Model's offset calculations */
    width: 100%;
    height: 500px;
    background: #333;
    border-radius: 12px;
    margin-top: 20px;
    overflow: hidden;
    border: 1px solid #444;
  }

  .draggable-box {
    width: 100px;
    height: 100px;
    background: linear-gradient(135deg, #ff6b6b, #ee5253);
    color: white;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    /* Note: Manager handles position:absolute and z-index */
  }

  .targets-container {
    position: absolute;
    bottom: 50px;
    width: 100%;
    display: flex;
    justify-content: space-around;
    pointer-events: none; /* Let clicks pass through empty space */
  }

  .target {
    width: 150px;
    height: 150px;
    border: 2px dashed #666;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #888;
    font-weight: 600;
    transition: all 0.2s ease;
    pointer-events: auto; /* Re-enable pointer events for the box */
  }

  .target.active {
    background: rgba(46, 204, 113, 0.2);
    border-color: #2ecc71;
    color: #2ecc71;
    transform: scale(1.05);
  }
</style>
