# Dev Pages (§12)

> Parte da [Svelte Model View Architecture](Architecture.md).

---

### Dev Page Dedicada por Package

Cada package tem uma dev page dedicada (não Storybook) servida pelo Vite diretamente. A dev page é Svelte puro — sem DSL, sem framework de stories, sem configuração de addon.

### Estrutura

```
packages/<package>/
├── src/dev/
│   ├── main.ts          ← Entry point
│   └── App.svelte       ← Dev page principal
├── index.html           ← HTML shell
└── vite.config.ts       ← Vite dev server
```

### O que a Dev Page Deve Conter

1. **Cenários visuais** — cada variante/estado renderizado e identificado com label
2. **Controles interativos** — botões/inputs que chamam toda a API pública
3. **Log panel** — eventos timestamped para rastrear comportamento
4. **State inspector** — exibição dos valores atuais do Model (isActive, isPaused, etc.)

### Alias no Root `package.json`

Cada dev page deve ter um alias correspondente no root `package.json` (ex: `dev:ar`, `dev:movable`).

### Smoke Test como Definition of Done

Antes de completar uma feature ou fix, o último passo é: rodar a dev page, executar os cenários, verificar visualmente. A dev page é a especificação visual de referência.

---

### Modo Guided QA

**Conceito**: A dev page é o script de QA, não apenas um sandbox. Ela conhece o plano de teste, conduz o testador passo a passo, captura automaticamente o que pode ser capturado. O testador só relata o que a máquina não vê.

Coexiste com o modo livre (sandbox de exploração). Modo livre = desenvolvimento; Guided QA = smoke test.

---

#### Anatomia de um Step

```ts
type QAStep = {
  title: string;           // "Step 3 of 7: Cancel mid-animation"
  instruction: string;     // Plain language — what the human must do/observe
  trigger?: () => void;    // Auto-runs on step entry (no button), or called by button
  triggerLabel?: string;   // Button label if trigger is interactive
  expectedLogs: string[];  // Markers the log panel will show automatically
  humanChecklist: string[]; // Only what logs cannot capture
};
```

Regras:
- `title`: numerado literalmente "Step N of T: short name"
- `instruction`: linguagem simples, sem nomes de classes/métodos
- `trigger` sem `triggerLabel`: dispara automaticamente na entrada do step (ação do sistema, sem botão exibido)
- `trigger` + `triggerLabel`: exibido como botão inline, habilitado apenas no step atual
- Botão "Next →" aparece apenas após o trigger disparar (ou imediatamente se não houver trigger)
- Steps passados ocultos/desabilitados; steps futuros ainda não visíveis

---

#### Convenção de Log Estruturado

```
[AR][step:2] request() called
[AR][step:2] idle → animating
```

Formato: `[<Package>][step:<n>] <event>`. Emitido por `qaLog(n, event)` em `App.svelte` — não no package em si (o package não sabe que está sendo testado). `qaLog` escreve tanto no log panel da página quanto em `console.log`.

---

#### Human Reports vs. DevTools MCP

| DevTools MCP captura automaticamente | Apenas o humano |
|---|---|
| Sequência de eventos, timing (`[Xms]`) | Suavidade / trepidação da animação |
| Transições de estado (idle → animating) | Artefatos visuais (z-index, clipping, cor) |
| Erros e warnings | Sensação subjetiva ("parece estranho?") |

Os logs são lidos automaticamente via DevTools MCP — o autor reporta apenas divergências visuais.

---

#### Padrão de Implementação Svelte 5

```svelte
<script lang="ts">
  import type { QAStep } from './qa-types.js';

  let mode = $state<'free' | 'guided'>('free');
  let currentStep = $state(0);
  let triggerFired = $state(false);
  let logs = $state<string[]>([]);

  const steps: QAStep[] = [
    {
      title: 'Step 1 of 3: Initial state',
      instruction: 'Verify the element is visible and in its resting position.',
      expectedLogs: ['[AR][step:1] idle'],
      humanChecklist: ['Element is fully visible', 'No animation artifacts'],
    },
    // ...
  ];

  const step = $derived(steps[currentStep]);

  function qaLog(n: number, event: string) {
    const msg = `[AR][step:${n}] ${event}`;
    logs = [...logs, msg];
    console.log(msg);
  }

  function advance() {
    triggerFired = false;
    currentStep += 1;
  }

  $effect(() => {
    if (mode === 'guided' && step?.trigger && !step.triggerLabel) {
      step.trigger();
      triggerFired = true;
    }
  });
</script>

<div class="mode-toggle">
  <button onclick={() => { mode = 'free'; }}>Free</button>
  <button onclick={() => { mode = 'guided'; currentStep = 0; }}>Guided QA</button>
</div>

{#if mode === 'guided' && step}
  <div class="qa-step">
    <h2>{step.title}</h2>
    <p>{step.instruction}</p>

    {#if step.trigger && step.triggerLabel}
      <button disabled={triggerFired} onclick={() => { step.trigger!(); triggerFired = true; }}>
        {step.triggerLabel}
      </button>
    {/if}

    {#if !step.trigger || triggerFired}
      <ul>
        {#each step.humanChecklist as item}
          <li>{item}</li>
        {/each}
      </ul>
      <button onclick={advance} disabled={currentStep >= steps.length - 1}>Next →</button>
    {/if}
  </div>
{/if}
```

**Mode toggle**: `mode: 'free' | 'guided'` — default `'free'` para desenvolvimento diário; mudar para `'guided'` antes de fechar uma feature.
