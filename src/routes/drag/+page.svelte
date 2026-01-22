<script lang="ts">
  import { Movable } from "$lib/Movable";
</script>

<main>
  <h1>Movable</h1>

  <!-- The boundary for the movable context -->
  <div class="canvas">
    <Movable.Context>
      <!-- Sensor -->
      <Movable.Sensor id="sensor-1">
        {#snippet children({ sensor, isOver })}
          <div
            use:sensor
            class="sensor"
            style:background={isOver ? '#d1fae5' : '#f3f4f6'}
            style:border-color={isOver ? '#059669' : '#d1d5db'}
          >
            Sensor
          </div>
        {/snippet}
      </Movable.Sensor>

      <!-- Item: Percentage Position -->
      <Movable.Item initialX="10%" initialY="10%">
        {#snippet children({ isMoving, isFocused })}
          <div class="item" class:moving={isMoving} class:focused={isFocused}>
            Item
          </div>
        {/snippet}
      </Movable.Item>

      <!-- EXAMPLE: The Floating Ghost -->
      <Movable.Item initialX="80%" initialY="80%">
        {#snippet children()}
          <div class="ghost">👻</div>
        {/snippet}
      </Movable.Item>
    </Movable.Context>
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

  .sensor {
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

  .item.focused,
  .moving {
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
