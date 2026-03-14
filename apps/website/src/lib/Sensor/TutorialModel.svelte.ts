// TutorialModel.svelte.ts
import type { DragModel } from "./DragModel.svelte";

export type AnimationType = "none" | "anim-right" | "anim-homing";
const CONFIG = { LONG_PAUSE: 3000, SHORT_PAUSE: 20, LOOPS_BEFORE_REST: 2 };

export class TutorialModel {
  currentAnimation = $state<AnimationType>("none");
  angle = $state(0);
  private dragModel: DragModel;
  private timer: number | undefined;
  private loopCounter = 0;
  private isActive = false;

  // Estado: false = Fase 1 (Sair), true = Fase 2 (Voltar)
  private hasLeftSensor = false;

  constructor(dragModel: DragModel) {
    this.dragModel = dragModel;
    $effect(() => {
      this.handlePhysicsChange();
    });
  }

  notifyAnimationComplete() {
    this.currentAnimation = "none";
    this.loopCounter++;
    const isLongRest = this.loopCounter >= CONFIG.LOOPS_BEFORE_REST;
    const delay = isLongRest ? CONFIG.LONG_PAUSE : CONFIG.SHORT_PAUSE;
    this.scheduleNext(delay);
  }

  private handlePhysicsChange() {
    // Se o tutorial já foi concluído, para qualquer timer pendente e ignora atualizações.
    if (this.dragModel.isTutorialFinished) {
      this.stop();
      return;
    }

    // 1. Se estiver arrastando: Pausa o tutorial e monitora o progresso
    if (this.dragModel.isDragging) {
      this.stop();

      // MUDANÇA CRÍTICA: Só marcamos que saiu do sensor SE estiver arrastando.
      // Isso ignora o estado 'false' falso-positivo da inicialização.
      if (!this.dragModel.isIntersecting) {
        this.hasLeftSensor = true;
      }
      return;
    }

    // 2. Se soltou: Decide qual animação mostrar
    const targetHint = this.determineTargetHint();

    if (targetHint === "none") {
      this.stop();
      return;
    }

    if (targetHint === "anim-homing") {
      this.updateHomingVector();
    }

    // 3. Se precisa animar e não está ativo, inicia o loop
    if (!this.isActive) {
      this.isActive = true;
      this.scheduleNext(CONFIG.LONG_PAUSE);
    }
  }

  private updateHomingVector() {
    const centers = this.dragModel.getCenters();
    if (centers) {
      const dx = centers.target.x - centers.drag.x;
      const dy = centers.target.y - centers.drag.y;
      this.angle = Math.atan2(dy, dx); // Retorna radianos para o CSS usar com cos/sin
    }
  }

  private scheduleNext(delay: number) {
    this.clearTimer();
    this.timer = setTimeout(() => {
      if (!this.isActive || this.dragModel.isDragging) return;
      if (this.loopCounter >= CONFIG.LOOPS_BEFORE_REST) this.loopCounter = 0;

      // Atualiza a animação baseada no estado atual
      this.currentAnimation = this.determineTargetHint();
    }, delay);
  }

  private determineTargetHint(): AnimationType {
    // Fase 1: Ainda não saiu (Pede para Sair -> Direita)
    if (!this.hasLeftSensor) {
      if (this.dragModel.isIntersecting) {
        return "anim-right";
      }
      return "none";
    }

    // Fase 2: Já saiu (Pede para Voltar -> Homing)
    if (this.hasLeftSensor) {
      if (!this.dragModel.isIntersecting) {
        return "anim-homing";
      }

      this.dragModel.isTutorialFinished = true;

      return "none";
    }

    return "none";
  }

  private stop() {
    this.isActive = false;
    this.currentAnimation = "none";
    this.clearTimer();
    this.loopCounter = 0;
  }

  private clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
  }
}
