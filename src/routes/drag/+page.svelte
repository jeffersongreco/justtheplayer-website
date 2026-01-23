<script lang="ts">
  import { Movable } from "$lib/Movable";
</script>

<main>
  <h1>Movable</h1>

  <Movable.Root>
    {#snippet asChild()}
      <div class="canvas">
        <Movable.Sensor accepts={["ghost"]}>
          {#snippet asChild({ sensor, isOver })}
            <div use:sensor class="sensor" class:active={isOver}>Sensor</div>
          {/snippet}
        </Movable.Sensor>

        <Movable.Item initialPosition={{ x: "10%", y: "10%" }}>
          {#snippet children({ isMoving, isFocused })}
            <div class="item" class:moving={isMoving} class:focused={isFocused}>
              Item
            </div>
          {/snippet}
        </Movable.Item>

        <Movable.Item
          initialPosition={{ x: "80%", y: "80%" }}
          group={["ghost"]}
        >
          {#snippet children()}
            <div class="ghost">👻</div>
          {/snippet}
        </Movable.Item>
      </div>
    {/snippet}
  </Movable.Root>
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
    background: #f3f4f6;
  }

  .sensor.active {
    background: #d1fae5;
    border-color: #059669;
    color: #065f46;
  }

  .item {
    width: 80px;
    height: 80px;
    background: #93c5fd;
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
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }

  .item.moving {
    opacity: 0.9;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    z-index: 50;
  }

  .ghost {
    font-size: 80px;
    cursor: grab;
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
