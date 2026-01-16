// src/lib/Home/PlayerModel.svelte.ts
import type MuxPlayerElement from "@mux/mux-player";

export class PlayerModel {
  // --- Estado Reativo ---
  isMuted = $state(true);
  isPlaying = $state(false);

  // Referência ao elemento do DOM (controlado via bind no componente)
  element = $state<MuxPlayerElement | null>(null);

  // --- Ações ---

  toggleMute() {
    if (!this.element) return;

    // Inverte o estado e aplica ao elemento
    const newState = !this.isMuted;
    this.element.muted = newState;
    this.isMuted = newState;
  }

  // Chamado quando o player carrega os metadados (tracks, duração, etc)
  setup() {
    if (!this.element) return;
    this.setupCaptions();
    this.attemptAutoplay();
  }

  // Chamado quando o evento 'playing' dispara
  notifyPlaying() {
    // Pequeno delay para garantir que não haja flash de frame preto
    setTimeout(() => {
      this.isPlaying = true;
    }, 500);
  }

  // --- Lógica Interna (Privada) ---

  private setupCaptions() {
    if (!this.element) return;

    const userLang = navigator.language.split("-")[0];
    const tracks = Array.from(this.element.textTracks || []);

    // Desabilita tudo primeiro
    tracks.forEach((t) => (t.mode = "disabled"));

    // Tenta achar a track da língua do usuário
    const targetTrack = tracks.find(
      (track) => track.kind === "subtitles" && track.language === userLang
    );

    if (targetTrack) {
      targetTrack.mode = "showing";
    } else {
      // Fallback para inglês
      const fallback = tracks.find((t) => t.language === "en");
      if (fallback) fallback.mode = "showing";
    }
  }

  private attemptAutoplay() {
    if (!this.element) return;

    // Tenta tocar. Como começa mudo, a chance de sucesso é alta.
    this.element
      .play()
      .then(() => {
        console.log("Autoplay started successfully");
      })
      .catch((error) => {
        console.warn("Autoplay prevented by browser:", error);
      });
  }
}
