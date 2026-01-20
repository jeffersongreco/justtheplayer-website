<script>
  import Draggable from "$lib/Draggable/Draggable.svelte";
  import DragRoot from "$lib/Draggable/DragRoot.svelte";
  import DropTarget from "$lib/Draggable/DropTarget.svelte";
</script>

<div class="app-container">
  <!-- AREA 1: ISOLATED -->
  <div class="panel">
    <h2>Left Brain</h2>
    <DragRoot>
      <div class="boundary">
        <Draggable id="item-1" x="50%" y="50%">
          {#snippet children({ dragAction, isDragging })}
            <div use:dragAction class="box" class:dragging={isDragging}>
              Item 1
            </div>
          {/snippet}
        </Draggable>

        <DropTarget id="zone-1" onDrop={() => console.log('Dropped in 1')}>
          {#snippet children({ targetAction, isOver })}
            <div use:targetAction class="target" class:active={isOver}>
              Zone 1
            </div>
          {/snippet}
        </DropTarget>
      </div>
    </DragRoot>
  </div>

  <!-- AREA 2: ISOLATED -->
  <div class="panel">
    <h2>Right Brain</h2>
    <DragRoot>
      <div class="boundary">
        <Draggable id="item-2" x={20} y={20}>
          {#snippet children({ dragAction, isDragging })}
            <div use:dragAction class="box blue" class:dragging={isDragging}>
              Item 2
            </div>
          {/snippet}
        </Draggable>

        <DropTarget id="zone-2" onDrop={() => console.log('Dropped in 2')}>
          {#snippet children({ targetAction, isOver })}
            <div use:targetAction class="target" class:active={isOver}>
              Zone 2
            </div>
          {/snippet}
        </DropTarget>
      </div>
    </DragRoot>
  </div>
</div>

<style>
  .app-container {
    display: flex;
    gap: 2rem;
    padding: 2rem;
  }
  .panel {
    flex: 1;
  }
  .boundary {
    position: relative;
    height: 300px;
    background: #f0f0f0;
    border: 1px solid #ccc;
    overflow: hidden;
  }
  .box {
    width: 60px;
    height: 60px;
    background: tomato;
    display: grid;
    place-items: center;
    position: absolute; /* Manager handles this, but good practice to set defaults */
  }
  .box.blue {
    background: royalblue;
  }
  .target {
    width: 100px;
    height: 100px;
    border: 2px dashed #999;
    margin: 100px auto;
    display: grid;
    place-items: center;
  }
  .active {
    background: rgba(0, 255, 0, 0.2);
    border-color: green;
  }
</style>
