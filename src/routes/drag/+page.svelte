<script lang="ts">
  import Draggable from "$lib/Draggable/Draggable.svelte";
  import DragRoot from "$lib/Draggable/DragRoot.svelte";
  import DropTarget from "$lib/Draggable/DropTarget.svelte";
</script>

<main>
  <h1>Drag Free</h1>

  <!-- The boundary for the drag context -->
  <div class="canvas">
    <DragRoot>
      <!-- Drop Zone -->
      <DropTarget id="zone-1">
        {#snippet children({ targetAction, isOver })}
          <div
            use:targetAction
            class="zone"
            style:background={isOver ? '#d1fae5' : '#f3f4f6'}
            style:border-color={isOver ? '#059669' : '#d1d5db'}
          >
            {isOver ? 'Release now' : 'Drop here'}
          </div>
        {/snippet}
      </DropTarget>

      <!-- Item: Percentage Position -->
      <Draggable x="10%" y="10%">
        {#snippet children({ dragAction, isDragging })}
          <button use:dragAction class="item" class:dragging={isDragging}>
            Item B
          </button>
        {/snippet}
      </Draggable>
    </DragRoot>
  </div>
</main>

<style>
  :global(body) {
    font-family: system-ui, sans-serif;
    padding: 2rem;
    background: #fff;
    color: #111;
  }

  .canvas {
    /* Essential: Defines the boundary for clamping and positioning */
    position: relative;
    width: 100%;
    max-width: 600px;
    height: 400px;
    border: 1px solid #ccc;
    border-radius: 8px;
    margin-top: 1rem;
    overflow: hidden;
  }

  .zone {
    /* Centered for demo purposes */
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    width: 150px;
    height: 150px;
    border: 2px dashed #d1d5db;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    color: #374151;
    transition: all 0.2s;
  }

  .item {
    width: 80px;
    height: 80px;
    background: #93c5fd;
    border-color: #3b82f6;
    color: #1e3a8a;
    border-radius: 8px;
    cursor: grab;
    font-weight: bold;

    /* Flex to center text */
    display: flex;
    align-items: center;
    justify-content: center;

    /* Smooth visual transition for hover/active states */
    transition:
      transform 0.1s,
      box-shadow 0.1s;
  }

  .item:active {
    cursor: grabbing;
  }

  .dragging {
    opacity: 0.9;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    z-index: 50; /* Bring to front */
  }
</style>
