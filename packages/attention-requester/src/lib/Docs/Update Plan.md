# Attention Requester — Plano de Atualização Arquitetural

> **Ref:** `Docs/Architecture Conformance Audit.md`, `Memo controller reactivity.md`
> **Criado:** 2026-03-14
> **Atualizado:** 2026-03-15

---

## Progresso

| Step | Descrição | Status |
|------|-----------|--------|
| ~~1~~ | ~~Gestão de `will-change` no Controller~~ | ⏭️ Pulado — regra atualizada |
| 2 | Adaptar testes para nova API do Model | ⬜ Pendente |
| 3 | Separar eixos pause vs interrupt no Model | ⬜ Pendente |
| 4 | Controller observa Model diretamente | ⬜ Pendente |
| ~~5~~ | ~~Snapshot de `animation` derived~~ | ⏭️ Pulado — regra atualizada |
| 6 | Expor estado efêmero nos snippets | ⬜ Pendente |
| 7 | `console.warn` educativo para fallback de `#resolveTarget()` | ⬜ Pendente |
| 8 | Renomear `types.ts` | ⬜ Pendente |
| 9 | Renomear `AttentionRequester.svelte` | ⬜ Pendente |
| 10 | Atualizar imports, index.ts e testes | ⬜ Pendente |
| 11 | Atualizar consumidores (`HomeHero.svelte` etc.) | ⬜ Pendente |

**Legenda:** ⬜ Pendente · 🔄 Em progresso · ✅ Concluído · ⏭️ Pulado

---

## Steps

### ~~Step 1 — Gestão de `will-change` no Controller~~

**Status:** ⏭️ Pulado
**Motivo:** A regra de `will-change` foi atualizada na arquitetura (§6, §8). Com WAAPI (`element.animate()`), o browser já sabe que o elemento será animado e promove a camada automaticamente. Gestão imperativa de `will-change` seria redundante. Não há não-conformidade.

---

### Step 2 — Adaptar testes para nova API do Model (TDD)

**Severidade:** Alta — pré-requisito para qualquer mudança de código
**Referência:** §2 — Intenções Tipadas sobre Booleans
**Princípio:** Nenhuma mudança de código deve ser feita antes de existir um teste confiável para validá-la.

O Model vai mudar sua API pública: `pauseIntent` será removido e substituído por `interruptResolution`. Os testes automatizados atuais referenciam `pauseIntent` — devem ser adaptados ANTES de tocar no código, garantindo que a refatoração do Step 3 seja validável.

**O que fazer em `__tests__/AttentionRequesterModel.test.ts`:**

1. **§3.1 (Resume Strategy):** O teste "pauseIntent reflects 'resume' after resume with default strategy" (linha 170) deve ser adaptado:
   - Remover asserção em `model.pauseIntent`
   - Adicionar asserção: `expect(model.interruptResolution).toEqual({ strategy: 'resume' })`
   - O teste "pauseIntent is 'freeze' while paused" (linha 177) deve ser **removido** — `isPaused === true` já é testado no mesmo describe e `interruptResolution` não muda semanticamente durante pause (a resolução é sobre o que acontece ao retomar, não sobre o estado paused)

2. **§3.2 (Discard Strategy):** Todos os testes que assertam `model.pauseIntent` com `action: 'discard'` devem ser adaptados:
   - `{ action: 'discard', interval: 500 }` → `{ strategy: 'discard', interval: 500 }`
   - `{ action: 'discard', interval: 1000 }` → `{ strategy: 'discard', interval: 1000 }`
   - `{ action: 'discard', interval: 0 }` → `{ strategy: 'discard', interval: 0 }`
   - Propriedade: `model.interruptResolution` em vez de `model.pauseIntent`
   - Nota: estas asserções devem ser feitas **sem** precisar de pause/resume — `interruptResolution` é derivado da animação configurada, independente do estado de pause

3. **§4 (Pluggable Animations):** O teste "default interruption strategy is 'resume' when not specified" (linha 291) deve ser adaptado:
   - `model.pauseIntent` → `model.interruptResolution`
   - `{ action: 'resume' }` → `{ strategy: 'resume' }`

**Após este step:** Os testes falham (propriedade `interruptResolution` não existe ainda). Isso é esperado — é TDD. O Step 3 faz o código passar.

**Escopo:** `__tests__/AttentionRequesterModel.test.ts`

---

### Step 3 — Separar eixos pause vs interrupt no Model

**Severidade:** Média
**Referência:** §2 — Intenções Tipadas sobre Booleans
**Validação:** Os testes do Step 2 devem passar após este step.

O atual `pauseIntent` conflata dois eixos independentes: o estado de pausa (freeze/play) e a estratégia de interrupção (resume/discard). O boolean `isPaused` não é redundante — é a representação correta do eixo de pausa. O que deve mudar é a eliminação de `pauseIntent` e a extração da regra de negócio de interrupção para uma derivação própria.

**O que fazer no Model (`AttentionRequesterModel.svelte.ts`):**
- Manter `readonly isPaused = $derived(this.#paused)` — representa o eixo de pausa (boolean simples, sem branching qualitativo)
- Remover `readonly pauseIntent` e `#resolvePauseIntent()`
- Criar novo tipo `InterruptResolution`:
  ```ts
  type InterruptResolution =
    | { strategy: "resume" }
    | { strategy: "discard"; interval: number }
  ```
- Criar nova derivação:
  ```ts
  readonly interruptResolution = $derived<InterruptResolution>(
    this.#resolveInterruptResolution()
  );

  #resolveInterruptResolution(): InterruptResolution {
    const anim = this.#animation;
    if (!anim || anim.onInterrupt !== "discard") {
      return { strategy: "resume" };
    }
    const interval = anim.loop ? anim.interval : 0;
    return { strategy: "discard", interval };
  }
  ```
- A regra de negócio (interval é `anim.interval` para loops, `0` para one-shot) permanece no Model

**O que fazer nos tipos (`types.ts`):**
- Remover tipo `PauseIntent`
- Adicionar tipo `InterruptResolution`

**O que fazer no Controller (`AttentionRequesterController.svelte.ts`) — adaptação temporária:**
- Adaptar `syncPauseIntent` para usar `isPaused` + `interruptResolution` temporariamente
- Esta adaptação será substituída no Step 4 quando o Controller passar a observar o Model diretamente

**O que fazer no componente (`AttentionRequester.svelte`) — adaptação temporária:**
- Adaptar os `$effect`s de roteamento para usar `isPaused` + `interruptResolution`
- Estes `$effect`s serão removidos no Step 4

**Validação:** `bun test` — os testes do Step 2 devem passar.

**Escopo:** `AttentionRequesterModel.svelte.ts`, `AttentionRequesterController.svelte.ts`, `AttentionRequester.svelte`, `types.ts`

---

### Step 4 — Controller observa Model diretamente

**Severidade:** Alta (decisão arquitetural)
**Referência:** Architecture.md §3 — Comunicação Model→Controller, Ciclo de Vida e Ownership Reativo
**Origem:** `Memo controller reactivity.md` — Conclusões 1 e 3

Decisão arquitetural: o Controller observa o estado do Model diretamente via `$effect` internos. O template não roteia estado entre Model e Controller.

**O que fazer no Controller (`AttentionRequesterController.svelte.ts`):**
- Remover os métodos públicos `syncActive()` e `syncPauseIntent()` (ou equivalentes do Step 3)
- Adicionar `$effect` no construtor que observa:
  - `model.isActive` — quando se torna `true` e não há animação em curso, inicia ciclo
  - `model.isPaused` — quando `true`, pausa a animação WAAPI; quando `false`, aplica a resolução de interrupção
  - `model.interruptResolution` — determina o que fazer ao retomar (resume vs discard)
- Os `$effect` herdam o ownership reativo do componente (o Controller é instanciado dentro de um `$effect` no `<script>`)
- `destroy()` continua tratando cleanup imperativo (WAAPI, timers, rAF)

**O que fazer no componente (`AttentionRequester.svelte`):**
- Remover os `$effect`s de roteamento Model→Controller:
  ```diff
  - $effect(() => { controller?.syncActive(model.isActive); });
  - $effect(() => controller?.syncPauseIntent(model.pauseIntent));
  ```
- Manter apenas:
  1. `$effect` que roteia prop `paused` para o Model
  2. `$effect` que cria/destrói o Controller
  3. A action para captura do node
- O template final deve seguir o padrão universal de Architecture.md §3

**Padrão esperado do template:**
```svelte
$effect(() => (paused ? model.pause() : model.resume()));

$effect(() => {
  if (!el) return;
  controller = new AttentionRequesterController(el, model);
  return () => controller?.destroy();
});

const action: Action = (node) => { el = node; return {}; };
```

**Validação:**
- `bun test` — testes automatizados do Model continuam passando (nenhuma mudança no Model)
- Checklist manual de UI:
  - [ ] Animação one-shot: dispara, completa, retorna a idle
  - [ ] Animação loop: dispara, repete com intervalo, cancela gracefully
  - [ ] Pause (resume strategy): congela no meio, retoma do mesmo ponto
  - [ ] Pause (discard strategy): congela, ao retomar descarta e reinicia após intervalo
  - [ ] Re-entrancy: `request()` durante animação não causa crash ou duplicação
  - [ ] Destroy: remover componente do DOM durante animação não causa leak ou erro

**Escopo:** `AttentionRequesterController.svelte.ts`, `AttentionRequester.svelte`

---

### ~~Step 5 — Snapshot de `animation` derived~~

**Status:** ⏭️ Pulado
**Motivo:** A regra sobre `$state.snapshot()` foi clarificada na arquitetura (§2). O Proxy reativo é o mecanismo correto de leitura em contexto reativo (`$derived`, `$effect`, template). `animation` é lido pelo Controller em contexto reativo — expor o proxy diretamente é o comportamento correto. Não há não-conformidade.

---

### Step 6 — Expor estado efêmero nos snippets

**Severidade:** Média
**Referência:** §1, §5 — Injeção de Estado via Snippets

O componente não passa estado efêmero para o consumidor. O snippet `children` não recebe parâmetros e `asChild` recebe apenas `{ action }`.

**Casos de uso:** dim/highlight de UI durante animação, exibir botão "cancel" condicional, desabilitar interações no elemento enquanto anima.

**O que fazer:**
- Adicionar `isAnimating: boolean` como parâmetro do snippet `children`
- Adicionar `isAnimating: boolean` ao objeto já passado no snippet `asChild` (ficaria `{ action, isAnimating }`)
- Atualizar os tipos em `AttentionRequesterProps`:
  - `children: Snippet<[{ isAnimating: boolean }]>`
  - `asChild: Snippet<[{ action: Action; isAnimating: boolean }]>`
- Derivar `isAnimating` a partir de `model.isActive` no componente

**Escopo:** `AttentionRequester.svelte`, `types.ts`, consumidores

---

### Step 7 — `console.warn` educativo para fallback de `#resolveTarget()`

**Severidade:** Baixa
**Referência:** §7 — Avisos Educativos

A tipagem já impede `request()` sem animação (parâmetro obrigatório na API pública). O único cenário que pode ocorrer em runtime é `#resolveTarget()` fazendo fallback para o wrapper quando `children[0]` não existe.

**O que fazer:**
- Em `#resolveTarget()`: se `wrapper.children[0]` não existe e faz fallback para `wrapper`, emitir `console.warn`
- Estilo: `[AttentionRequester] No child element found — animating the wrapper instead. Wrap your content inside the <AttentionRequester> component.`

**Escopo:** `AttentionRequesterController.svelte.ts`

---

### Step 8 — Renomear `types.ts` → `AttentionRequester.types.ts`

**Severidade:** Baixa
**Referência:** §9

**O que fazer:**
- Renomear `src/lib/types.ts` → `src/lib/AttentionRequester.types.ts`
- Atualizar todos os imports que referenciam `./types`

**Escopo:** Todos os arquivos do pacote que importam de `./types`

---

### Step 9 — Renomear `AttentionRequester.svelte` → `AttentionRequesterModifier.svelte`

**Severidade:** Baixa
**Referência:** §9

A arquitetura usa explicitamente `AttentionRequesterModifier.svelte` como exemplo em §9. O componente atua como um View Modifier.

**O que fazer:**
- Renomear `src/lib/AttentionRequester.svelte` → `src/lib/AttentionRequesterModifier.svelte`
- O export público em `index.ts` **continua como `AttentionRequester`** (é o nome de domínio, não o nome do arquivo)
- Atualizar o import em `index.ts`

**Escopo:** `AttentionRequester.svelte` (rename), `index.ts`

---

### Step 10 — Atualizar imports, index.ts e testes

**Severidade:** Mecânica
**Referência:** Consequência dos steps 3, 8 e 9

**O que fazer:**
- Varrer todos os imports internos do pacote após os renames dos steps 8–9
- Atualizar `index.ts` para apontar para os novos nomes de arquivo
- Atualizar imports de `PauseIntent` → `InterruptResolution` (step 3)
- Verificar se os testes em `__tests__/` importam corretamente
- Rodar `bun run check` e `bun test` para validar

**Escopo:** Todo o pacote

---

### Step 11 — Atualizar consumidores

**Severidade:** Mecânica
**Referência:** Consequência dos steps 3 e 6

**O que fazer:**
- Buscar todos os usos de `<AttentionRequester>` no projeto (ex: `HomeHero.svelte`)
- Adaptar o snippet `children` para receber o novo parâmetro `{ isAnimating }` se necessário (ou ignorá-lo — snippets Svelte permitem parâmetros opcionais)
- Verificar se nenhum consumidor importava `PauseIntent` ou usava `pauseIntent` diretamente

**Escopo:** `src/lib/Pages/Home/Components/HomeHero.svelte` e quaisquer outros consumidores
