<script lang="ts">
  import "../../routes/page.css";
  import HomeFooter from "$lib/Home/HomeFooter.svelte";
  import { HomeModel } from "$lib/Home/HomeModel.svelte";
  import { DragModel } from "$lib/Sensor/DragModel.svelte";
  import { PlayerModel } from "$lib/Home/PlayerModel.svelte";
  import Draggable from "$lib/Sensor/Draggable.svelte";
  import Cursor from "$lib/Home/Cursor.svelte";
  import ImacMockup from "$lib/Home/ImacMockup.svelte";

  const dragModel = new DragModel("50%", "50%");
  const homeModel = new HomeModel();
  const playerModel = new PlayerModel();
</script>

<main>
  <div class="layout">
    <ImacMockup {dragModel} {playerModel} />

    <HomeFooter {homeModel} {dragModel} {playerModel} />

    <Draggable model={dragModel}>
      <Cursor hasReturned={dragModel.isTutorialFinished} />
    </Draggable>
  </div>
</main>
