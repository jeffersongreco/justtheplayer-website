<script lang="ts">
  import Cursor from "$lib/Home/Cursor.svelte";
  // import HomeFooter from "$lib/Home/HomeFooter.svelte";
  import { HomeModel } from "$lib/Pages/Home/HomeModel.svelte";
  // import { PlayerModel } from "$lib/Home/PlayerModel.svelte";
  import Draggable from "$lib/Sensor/Draggable.svelte";
  import { DragModel } from "$lib/Sensor/DragModel.svelte";
  import type { Ref } from "$lib/Types";
  import HomeHeadline from "./Components/HomeHeadline.svelte";
  import HomeHero from "./Components/HomeHero.svelte";

  // import ImacMockup from "$lib/Home/ImacMockup.svelte";
  //   // const homeModel = new HomeModel();
  // const playerModel = new PlayerModel();

  const dragModel = new DragModel("50%", "50%");

  let screenRef = $derived(dragModel.target);
  // let isTutorialFinished = $derived(dragModel.isTutorialFinished);
  let isTutorialFinished = $state(false);
  let isCursorOutScreen = $derived(!dragModel.isIntersecting);
  // let isTutorialFinished = true;
  // let isCursorOutScreen = false;
</script>

<main class:isTutorialFinished>
  <button
    style="position: fixed; top: 1rem; left: 1rem; z-index: 9999;"
    onclick={() => (isTutorialFinished = !isTutorialFinished)}
  >
    Toggle Tutorial
  </button>
  <!-- <div class="layout">
    <ImacMockup {dragModel} {playerModel} />

    <HomeFooter {homeModel} {dragModel} {playerModel} />

    <Draggable model={dragModel}>
      <Cursor hasReturned={dragModel.isTutorialFinished} />
    </Draggable>
  </div> -->
  <div class="hero">
    <HomeHero
      {screenRef}
      isHeroCollapsed={isTutorialFinished}
      {isCursorOutScreen}
    />
  </div>

  <div class="headline">
    <div class="headline-content">
      <HomeHeadline />
    </div>
  </div>

  <Draggable model={dragModel}>
    <Cursor hasReturned={dragModel.isTutorialFinished} />
  </Draggable>
</main>

<style>
  main {
    display: grid;
    height: 100vh;
    /* Define explicitamente duas linhas.
           A primeira sempre tenta ocupar o máximo (1fr).
           A segunda transita de colapsada (0fr) para expandida (1fr ou auto). */
    grid-template-rows: 1fr 0fr;
    transition: grid-template-rows 2s ease-out;
    overflow: hidden;
  }

  main.isTutorialFinished {
    /* Usar 1fr 1fr divide o espaço.
           Se você quer que o segundo filho tenha apenas o tamanho do conteúdo,
           devemos inverter a lógica para o conteúdo interno. */
    grid-template-rows: 1fr auto;
  }

  /* O segredo para o "auto" animar suavemente no Grid moderno: */
  .headline {
    display: grid;
    /* Começa com a linha em 0fr */
    grid-template-rows: 0fr;
    transition: grid-template-rows 2s ease-out;
    overflow: hidden;
  }

  main.isTutorialFinished .headline {
    /* Muda para 1fr */
    grid-template-rows: 1fr;
  }

  /* Este elemento interno é OBRIGATÓRIO para dar substância ao 1fr */
  .headline-content {
    min-height: 0;
    visibility: hidden;
    transition: visibility 2s;
  }

  main.isTutorialFinished .headline-content {
    visibility: visible;
  }
</style>
