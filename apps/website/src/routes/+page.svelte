<!-- <script lang="ts">
  import "./page.css";
  import ImacMockup from "$lib/components/ImacMockup.svelte";
  import FloatingCursor from "$lib/components/FloatingCursor.svelte";
  import Footer from "$lib/components/Footer.svelte";

  let dragging = $state(false);
  let position = $state({ x: 0, y: 0 });
  let startPos = { x: 0, y: 0 };
  let isOverScreen = $state(true);
  let hasDraggedOut = $state(false);
  let hasReturned = $state(false);

  // Estado do Player
  let isMuted = $state(true);
  let curtainVisible = $state(true);

  // Referências DOM
  let screenArea: HTMLDivElement | undefined = $state();
  let cursorElement: HTMLDivElement | undefined = $state();
  let videoContainer: any = $state();

  // --- Lógica do Mux Player ---

  function handlePlayerReady() {
    if (!videoContainer) return;

    // Lógica de Legenda baseada no Locale
    const userLang = navigator.language.split("-")[0]; // ex: 'pt-BR' -> 'pt'
    const tracks = Array.from(videoContainer.textTracks) as TextTrack[];

    // Tenta achar a exata
    const targetTrack = tracks.find(
      (track) => track.kind === "subtitles" && track.language === userLang
    );

    if (targetTrack) {
      targetTrack.mode = "showing";
    } else {
      // Fallback (opcional, ex: inglês)
      const fallback = tracks.find((t) => t.language === "en");
      if (fallback) fallback.mode = "showing";
    }

    // 2. Tentar Autoplay Seguro (Recomendação Mux)
    attemptAutoplay();
  }

  function attemptAutoplay() {
    if (!videoContainer) return;

    // Retorna uma Promise. Se o navegador bloquear, cai no catch.
    videoContainer
      .play()
      .then(() => {
        console.log("Autoplay started successfully");
      })
      .catch((error: any) => {
        console.warn("Autoplay prevented by browser:", error);
        // Aqui você poderia mostrar um botão "Play" grande na tela
        // se o autoplay falhasse, mas como o vídeo está 'muted',
        // a chance de erro é mínima.
      });
  }

  function handlePlayerPlaying() {
    // Só removemos a cortina quando o play realmente acontece
    setTimeout(() => {
      curtainVisible = false;
    }, 500);
  }

  // 3. Função de Toggle Mute (Ligada ao botão)
  function toggleMute() {
    if (!videoContainer) return;

    // Inverte o estado atual
    if (videoContainer.muted) {
      videoContainer.muted = false;
      isMuted = false;
    } else {
      videoContainer.muted = true;
      isMuted = true;
    }
  }

  // --- Fim da Lógica do Player ---

  function handleMouseDown(e: MouseEvent) {
    dragging = true;
    startPos = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    e.preventDefault(); // Prevent text selection
  }

  function handleMouseMove(e: MouseEvent) {
    if (!dragging) return;

    const halfWidth = window.innerWidth / 2;
    const halfHeight = window.innerHeight / 2;
    const cursorHalfW = 141 / 2;
    const cursorHalfH = 175 / 2;

    // Clamp position to keep cursor within viewport
    position.x = Math.max(
      -halfWidth + cursorHalfW,
      Math.min(halfWidth - cursorHalfW, e.clientX - startPos.x)
    );
    position.y = Math.max(
      -halfHeight + cursorHalfH,
      Math.min(halfHeight - cursorHalfH, e.clientY - startPos.y)
    );

    checkScreenOverlap();
  }

  function handleMouseUp() {
    dragging = false;
  }

  function checkScreenOverlap() {
    if (!screenArea || !cursorElement) return;

    const screenRect = screenArea.getBoundingClientRect();
    const cursorRect = cursorElement.getBoundingClientRect();

    // Check if the center of the cursor is within the screen area
    const cursorCenterX = cursorRect.left + cursorRect.width / 2;
    const cursorCenterY = cursorRect.top + cursorRect.height / 2;

    isOverScreen =
      cursorCenterX >= screenRect.left &&
      cursorCenterX <= screenRect.right &&
      cursorCenterY >= screenRect.top &&
      cursorCenterY <= screenRect.bottom;

    if (!isOverScreen && !hasDraggedOut) {
      hasDraggedOut = true;
    }

    if (isOverScreen && hasDraggedOut && !hasReturned) {
      hasReturned = true;
    }
  }

  $effect(() => {
    checkScreenOverlap();
  });
</script>

<svelte:window onmousemove={handleMouseMove} onmouseup={handleMouseUp} />

<svelte:head>
  <title>Just the player - Extension for YouTube™</title>
</svelte:head>

<main>
  <div class="layout">
    <ImacMockup
      {isOverScreen}
      bind:screenArea
      bind:videoContainer
      onPlayerReady={handlePlayerReady}
      onPlayerPlaying={handlePlayerPlaying}
    />

    <Footer {hasReturned} {toggleMute} />

    <FloatingCursor
      {position}
      {dragging}
      {hasReturned}
      bind:element={cursorElement}
      onmousedown={handleMouseDown}
    />
  </div>
</main>

<div popover id="modal" class="modal">
  <div class="column">
    <p class="heading">“Disparada” (Stampede)</p>
    <p>The Elvis Moment of the "Viola Caipira":</p>
    <p>
      Much like Elvis Presley forced a segregated white America to respect Blues
      in the 1950s, the song “Disparada” forced the Brazilian cultural elite of
      1966 to confront the music of the country’s deep interior.
    </p>
  </div>
  <div class="column">
    <p>The "Viola":</p>
    <p>
      To an American observer, the "viola caipira" might visually resemble a
      standard acoustic guitar, but its soul is primordial. It carries the DNA
      of the fusion between Portuguese viola and native indigenous
      rhythms—making it, in many ways, the deepest musical root of the land.
      While the Afro-Brazilian beats of Samba dominate the coast and Bossa Nova
      reflects a jazz-flavored urban elite, the viola speaks for the vast
      interior: the colossal heart of the continent-sized country where the
      foundational identity of Brazil was truly forged.
    </p>
    <p>The "Caipira":</p>
    <p>
      Until that moment, the "viola" was viewed with the same urban disdain
      often directed at the banjo or Appalachian folk music in the United
      States: it was dismissed as backward, restricted to "caipira" (rural) life
      and excluded from high culture. The university elite and festival
      musicians lived in a bubble of Bossa Nova, believing themselves to be the
      vanguard. In reality, they had become isolated from the masses of the
      Brazilian people.
    </p>
  </div>
  <div class="column">
    <p>Second MPB Festival, 1996:</p>
    <p>
      Taking the stage at the Festival wielding a "viola caipira" was not an act
      of folklore; it was an act of aesthetic guerrilla warfare. The "viola"
      player Heraldo do Monte elevated the instrument from mere accompaniment to
      protagonist, challenging the complexity of the festival orchestras with
      the raw, piercing sound of the "sertão" (Brazilian hinterlands). The
      genius of “Disparada” lies in using the epic structure of "modas de
      viola"—comparable to narrative folk ballads—to tell a story of revolution.
      The lyrics describe a cowboy who stops being cattle to become the master
      of his own destiny. It was a direct, thinly veiled metaphor against the
      military dictatorship governing Brazil at the time.
    </p>
  </div>
  <div class="column">
    <p>What to Watch in the Video:</p>
    <p>
      Pay close attention to the visceral performance by singer Jair Rodrigues.
      As you watch, I invite you to notice a fascinating historical detail: the
      sharp contrast between the crowd, vibrating and singing the chorus as an
      anthem of liberation, and the grim expressions of the military officers
      and censors in the audience. They perceived that this previously despised
      folk instrument was striking a visceral chord with the masses—a resonance
      so deep that it moves listeners to tears even without knowledge of its
      coded message. This raw power explains why the song remains a sacred
      anthem in the Sertanejo genre today, achieving a universality that neither
      the electric guitars nor the sophisticated detachment of Bossa Nova could
      match at the time.
    </p>
    <p>
      The undeniable proof of this resonance occurred that very night. The
      festival jury had originally intended to award the first prize solely to
      Chico Buarque’s “A Banda,” a charming, nostalgic march. However, the
      audience’s fervor for “Disparada” was so overwhelming that it forced the
      organizers’ hand. In an unprecedented decision driven by the people’s
      voice, the result was altered to a historic tie, splitting the
      championship between the two songs.
    </p>
  </div>
</div>

<!-- CREDITS: Footage of singer Jair
    Rodrigues performing “Disparada” (Stampede)—written by Geraldo Vandré and
    Théo de Barros—during the finale of the Second Brazilian Popular Music
    Festival, originally broadcast by TV Record in 1966. This audiovisual
    recording was accessed via a third-party digital archive. The English
    lyrical translation is credited to David Treece, as published in the liner
    notes of the album The São Paulo Tapes (2010), by Monica Vasconcelos. -->
-->
