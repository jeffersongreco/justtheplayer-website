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
        {#snippet children({ isDragging, isFocused })}
          <div
            class="item"
            class:dragging={isDragging}
            class:focused={isFocused}
          >
            Item
          </div>
        {/snippet}
      </Draggable>

      <!-- EXAMPLE: The Floating Ghost -->
      <Draggable x="80%" y="80%">
        {#snippet children()}
          <div class="ghost">👻</div>
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

    display: flex;
    align-items: center;
    justify-content: center;

    transition:
      transform 0.1s,
      box-shadow 0.1s;
  }

  .item.focused {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  .dragging {
    opacity: 0.9;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    z-index: 50;
  }

  .ghost {
    font-size: 80px;
    animation: float 3s ease-in-out infinite;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px) rotate(5deg);
    }
    50% {
      transform: translateY(-30px) rotate(-5deg);
    }
  }
</style>
