# Attention Requester — Architecture Conformance Audit

> **Data:** 2026-03-14
> **Referência:** `packages/Svelte Model View Architecture/Architecture.md` §10

---

## Resultado do Checklist

### Model (§2)

- [x] Toda lógica de negócio vive no Model — Controller tem zero tomada de decisão
- [x] Estado mutável usa `#field = $state()` (privado nativo JS, não convenção)
- [x] Estado público usa `readonly field = $derived(this.#field)`
- [x] Usa `$state.snapshot()` apenas ao passar estado para fora do contexto reativo; nunca dentro de `$derived`, `$effect` ou template
  - **`animation`** é exposto via `$derived(this.#animation)` — retorna proxy reativo lido em contexto reativo (Controller, `$effect`). Correto per §2: o Proxy é o mecanismo de reatividade e deve ser lido diretamente nesses contextos.
- [ ] Comportamentos qualitativamente diferentes usam union discriminada, não boolean
  - `pauseIntent` conflata dois eixos independentes: estado de pausa (freeze/play — boolean, sem branching qualitativo) e estratégia de interrupção (resume/discard — qualitativamente diferente, union discriminada correta). A correção é separar em: `isPaused` (boolean, mantém) + `interruptResolution` (union discriminada, substitui `pauseIntent`). Ver Update Plan step 2.
- [x] Sem singletons globais — instância interna (autocontido)
- [x] Lógica complexa extraída para Serviços (Controller)
- [x] Variantes com contratos incompatíveis usam unions discriminadas (ARAnimationLoop vs ARAnimationOneShot)

### Controller (§3)

- [x] Nunca toma decisões de negócio — faz `switch` em `pauseIntent`
- [x] Elemento-alvo resolvido de forma lazy (`wrapper.children[0]`), não na construção
- [x] `will-change` não é gerenciado imperativamente — WAAPI promove camadas automaticamente
  - Correto per §6/§8: com `element.animate()`, o browser já sabe que o elemento será animado e promove a camada automaticamente. Gestão imperativa seria redundante.
- [x] Variáveis que disparam `$effect` declaradas com `$state` (no componente: `el` e `controller`)
- [x] Gerencia ciclo de vida: `destroy()` limpa animação e timers

### Interaction (§4) — N/A

Componente não recebe input de hardware direto.

### View (§1)

- [x] Zero lógica de negócio
- [x] Lógica de apresentação permitida
- [N/A] Nomes de apresentação locais — é um Modifier, não uma View consumidora
- [ ] **Estado efêmero passado via parâmetros de snippet**
  - ❌ Nem `children` nem `asChild` expõem estado efêmero. O snippet `children` não recebe parâmetros. `asChild` recebe apenas `{ action }`. Falta pelo menos `isAnimating` em ambos os caminhos. Casos de uso: dim/highlight de UI durante animação, exibir botão "cancel" condicional, desabilitar interações no elemento enquanto anima.

### API Surface (§5)

- [x] Exports usam flat named exports com padrão `[Domain][Role]`
- [x] API imperativa via `bind:this` com métodos exportados (`request`, `cancel`)
- [x] Tipo da instância exportado com o mesmo nome do componente (`AttentionRequester`)
- [x] Parâmetros que variam entre chamadas pertencem à chamada imperativa (`request(animation)`)
- [x] `asChild` disponível com tipagem union + `never` para exclusividade com `children`
- [ ] **Estado efêmero acessível via snippet em ambos os caminhos**
  - ❌ Mesmo problema da View acima. `isAnimating` deveria ser exposto.
- [x] `display: contents` como padrão para Modifier
- [N/A] Restrição `asChild` com componente Svelte como filho direto
- [N/A] Context (componente autocontido)
- [x] Componente `.svelte` delega ciclo de vida automaticamente

### Animações (§6)

- [x] Animações são objetos de dados (nome, duração, keyframes, loop, onInterrupt)
- [x] WAAPI preferida sobre CSS animations
- [x] `fill: 'none'` obrigatório — presente em `#startCycle()`
- [x] `will-change` não é gerenciado imperativamente — WAAPI promove camadas automaticamente
  - Correto per §6: gestão imperativa desnecessária com WAAPI.
- [x] Propriedade CSS `translate` usada em keyframes (animações de bounce usam `translate`)
- [x] Contratos tipados como unions discriminadas (loop vs one-shot)

### Resiliência (§7)

- [x] Auto-corrige ambientes hostis — `#resolveTarget()` faz fallback para `this.#wrapper` se `children[0]` não existir
- [ ] **Erros são `console.warn` educativo, nunca crash**
  - ⚠️ `request()` sem animação é impedido pela tipagem (parâmetro obrigatório na API pública). Porém `#resolveTarget()` resolvendo para o wrapper por falta de filho pode acontecer em runtime e deveria emitir `console.warn` educativo ("no child element found, animating wrapper instead").
- [x] Continuidade da UX do usuário final priorizada sobre pureza técnica

### Performance (§8) — Parcialmente aplicável

- [N/A] Sistema de coordenadas unificado (AABB)
- [N/A] Delta absoluto
- [N/A] Renderização desacoplada via rAF
- [x] `will-change` não gerenciado imperativamente — WAAPI promove automaticamente
  - Correto per §8: com WAAPI o browser gerencia promoção de camada ao receber `element.animate()`.
- [N/A] `setPointerCapture`
- [x] Animações de posição (`transform`) e decorativas (`translate`) não conflitam

### Nomenclatura (§9)

- [ ] Arquivos prefixados com nome do domínio do pacote
  - ❌ `types.ts` deveria ser `AttentionRequester.types.ts`
- [ ] Sufixos seguem convenção
  - ❌ `AttentionRequester.svelte` deveria ser `AttentionRequesterModifier.svelte` (§9 usa exatamente este exemplo)
- [x] Nomes baseados em capacidade/domínio, não em APIs legadas da web

---

## Resumo de Não-Conformidades

| # | Severidade | Seção | Descrição |
|---|------------|-------|-----------|
| ~~1~~ | ~~Alta~~ | ~~§3, §6, §8~~ | ~~`will-change` não é gerenciado pelo Controller~~ — ✅ Resolvido: regra atualizada, WAAPI promove camadas automaticamente |
| 2 | Média | §2 | Separar `pauseIntent` em dois eixos: `isPaused` (boolean, mantém) + `interruptResolution` (union discriminada, novo) |
| 3 | Média | §1, §5 | Estado efêmero (`isAnimating`) não exposto nos snippets |
| ~~4~~ | ~~Baixa~~ | ~~§2~~ | ~~`animation` derived expõe proxy reativo em vez de snapshot~~ — ✅ Resolvido: regra atualizada, proxy é correto em contexto reativo |
| 5 | Baixa | §7 | `console.warn` ausente para fallback de `#resolveTarget()` (tipagem já impede os outros cenários) |
| 6 | Baixa | §9 | `types.ts` → `AttentionRequester.types.ts` |
| 7 | Baixa | §9 | `AttentionRequester.svelte` → `AttentionRequesterModifier.svelte` |
