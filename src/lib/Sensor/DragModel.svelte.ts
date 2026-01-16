// DragModel.svelte.ts

type ConfigPos = number | string;

export class DragModel {
  // --- Estado Público ---
  x = $state(0);
  y = $state(0);
  isDragging = $state(false);
  isIntersecting = $state(false);

  isTutorialFinished = $state(false);

  // --- Referências e Configuração ---
  private node: HTMLElement | null = null;
  private targetNode: HTMLElement | null = null;
  private initX: ConfigPos;
  private initY: ConfigPos;

  // --- Cache de Geometria (Snapshots) ---
  private limits = {
    minX: Number.NEGATIVE_INFINITY,
    maxX: Number.POSITIVE_INFINITY,
    minY: Number.NEGATIVE_INFINITY,
    maxY: Number.POSITIVE_INFINITY,
  };
  private dragStart = { x: 0, y: 0, mouseX: 0, mouseY: 0 };
  private dims = { w: 0, h: 0, offsetX: 0, offsetY: 0 };
  private targetRect = { left: 0, right: 0, top: 0, bottom: 0 };

  constructor(x: ConfigPos = 0, y: ConfigPos = 0) {
    this.initX = x;
    this.initY = y;
  }

  // Retorna o ponto central absoluto do elemento arrastável e do alvo
  getCenters() {
    if (!(this.node && this.targetNode)) return null;

    const r1 = this.node.getBoundingClientRect();
    const r2 = this.targetNode.getBoundingClientRect();

    return {
      drag: { x: r1.left + r1.width / 2, y: r1.top + r1.height / 2 },
      target: { x: r2.left + r2.width / 2, y: r2.top + r2.height / 2 },
    };
  }

  // --- Actions (Svelte) ---

  source = (node: HTMLElement) => {
    this.node = node;
    this.setupStyle(node);

    // Correção de Layout: Usa ResizeObserver para esperar o pai ter tamanho
    // antes de calcular porcentagens (evita o bug de começar em 0,0)
    const parent = node.parentElement;
    let resizeObserver: ResizeObserver | null = null;

    if (parent) {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
            this.resolveInitialPosition();
            // Desconecta após o primeiro cálculo válido para economizar recursos
            resizeObserver?.disconnect();
          }
        }
      });
      resizeObserver.observe(parent);
    }

    const onDown = (e: PointerEvent) => this.startDrag(e);
    node.addEventListener("pointerdown", onDown);

    return {
      destroy: () => {
        node.removeEventListener("pointerdown", onDown);
        resizeObserver?.disconnect();
      },
    };
  };

  target = (node: HTMLElement) => {
    this.targetNode = node;
    return { destroy: () => (this.targetNode = null) };
  };

  // --- Lógica de Input (Controller) ---

  private startDrag(e: PointerEvent) {
    if (e.button !== 0 || !this.node) return;

    // 1. Correção de Freeze-Frame (Transferência de Offset Visual -> Lógico)
    // Isso captura a posição visual da animação no momento do clique e atualiza o X/Y base
    const visualChild = this.node.firstElementChild as HTMLElement;
    if (visualChild) {
      const wrapperRect = this.node.getBoundingClientRect();
      const visualRect = visualChild.getBoundingClientRect();
      this.x += visualRect.left - wrapperRect.left;
      this.y += visualRect.top - wrapperRect.top;

      // Aplica imediatamente para evitar flash visual
      this.node.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`;
    }

    // 2. Setup do Arraste
    this.isDragging = true;
    this.node.setPointerCapture(e.pointerId);
    this.node.style.cursor = "grabbing";
    this.node.style.zIndex = "50";

    // 3. Captura geometria e inicia listeners
    this.captureSnapshots(e);
    this.addListeners();
  }

  private captureSnapshots(e: PointerEvent) {
    if (!(this.node && this.node.parentElement)) return;

    const parent = this.node.parentElement;
    const nodeRect = this.node.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    // Snapshot: Onde tudo começou
    this.dragStart = {
      x: this.x,
      y: this.y,
      mouseX: e.clientX,
      mouseY: e.clientY,
    };

    // Cache de dimensões
    this.dims = {
      w: nodeRect.width,
      h: nodeRect.height,
      offsetX: nodeRect.left - e.clientX,
      offsetY: nodeRect.top - e.clientY,
    };

    // Define Limites (Boundaries) baseados no tamanho do pai
    this.limits = {
      minX: this.x - (nodeRect.left - parentRect.left),
      maxX: this.x + (parentRect.right - nodeRect.right),
      minY: this.y - (nodeRect.top - parentRect.top),
      maxY: this.y + (parentRect.bottom - nodeRect.bottom),
    };

    // Snapshot: Geometria do Alvo (se existir)
    if (this.targetNode) {
      const tr = this.targetNode.getBoundingClientRect();
      this.targetRect = {
        left: tr.left,
        right: tr.right,
        top: tr.top,
        bottom: tr.bottom,
      };
    }
  }

  private addListeners() {
    window.addEventListener("pointermove", this.onMove);
    window.addEventListener("pointerup", this.onUp);
    window.addEventListener("pointercancel", this.onUp);
  }

  private onMove = (e: PointerEvent) => {
    if (!this.isDragging) return;
    if (e.cancelable) e.preventDefault();

    const deltaX = e.clientX - this.dragStart.mouseX;
    const deltaY = e.clientY - this.dragStart.mouseY;

    this.updatePosition(this.dragStart.x + deltaX, this.dragStart.y + deltaY);
  };

  private onUp = (e: PointerEvent) => {
    this.isDragging = false;

    if (this.node) {
      this.node.style.cursor = "grab";
      this.node.style.zIndex = "10";
      this.node.releasePointerCapture(e.pointerId);
    }

    window.removeEventListener("pointermove", this.onMove);
    window.removeEventListener("pointerup", this.onUp);
    window.removeEventListener("pointercancel", this.onUp);
  };

  // --- Lógica Física ---

  updatePosition(newX: number, newY: number) {
    // 1. Aplica restrições (Clamp)
    this.x = Physics.clamp(newX, this.limits.minX, this.limits.maxX);
    this.y = Physics.clamp(newY, this.limits.minY, this.limits.maxY);

    // 2. Atualiza DOM
    if (this.node) {
      this.node.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`;
    }

    // 3. Checa colisão
    if (this.targetNode) {
      this.checkCollision();
    }
  }

  private checkCollision() {
    // Projeta o retângulo atual baseado na posição do mouse e offsets iniciais
    // (Evita ler o DOM durante o movimento para manter 60fps)
    const projectedRect = {
      x:
        this.dragStart.mouseX + (this.x - this.dragStart.x) + this.dims.offsetX,
      y:
        this.dragStart.mouseY + (this.y - this.dragStart.y) + this.dims.offsetY,
      w: this.dims.w,
      h: this.dims.h,
    };

    const hit = Physics.checkIntersection(projectedRect, this.targetRect);
    if (this.isIntersecting !== hit) this.isIntersecting = hit;
  }

  // --- Helpers de Inicialização ---

  private setupStyle(node: HTMLElement) {
    Object.assign(node.style, {
      touchAction: "none",
      userSelect: "none",
      position: "absolute",
      willChange: "transform",
      cursor: "grab",
      zIndex: "100",
    });
  }

  private resolveInitialPosition() {
    if (!(this.node && this.node.parentElement)) {
      return;
    }
    const p = this.node.parentElement;

    this.x = Physics.toPixels(this.initX, p.clientWidth);
    this.y = Physics.toPixels(this.initY, p.clientHeight);

    this.node.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`;

    // --- CORREÇÃO ADICIONADA: Checagem Inicial de Colisão ---
    // Precisamos saber se nasceu colidindo para o tutorial funcionar
    // Usamos um setTimeout(0) para garantir que o DOM (Target) já esteja montado e posicionado
    setTimeout(() => {
      if (this.node && this.targetNode) {
        const r1 = this.node.getBoundingClientRect();
        const r2 = this.targetNode.getBoundingClientRect();

        // Converte para o formato que a Physics espera
        const obj = { x: r1.left, y: r1.top, w: r1.width, h: r1.height };
        const target = {
          left: r2.left,
          right: r2.right,
          top: r2.top,
          bottom: r2.bottom,
        };

        this.isIntersecting = Physics.checkIntersection(obj, target);
      }
    }, 0);
  }
}

// --- Physics Engine (Pura / Stateless) ---
export const Physics = {
  toPixels(value: number | string, containerSize: number): number {
    if (typeof value === "number") {
      return value;
    }
    if (typeof value === "string" && value.endsWith("%")) {
      return (Number.parseFloat(value) / 100) * containerSize;
    }
    return 0;
  },

  clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(value, max));
  },

  checkIntersection(
    r1: { x: number; y: number; w: number; h: number },
    r2: { left: number; right: number; top: number; bottom: number }
  ): boolean {
    return (
      r1.x < r2.right &&
      r1.x + r1.w > r2.left &&
      r1.y < r2.bottom &&
      r1.y + r1.h > r2.top
    );
  },
};
