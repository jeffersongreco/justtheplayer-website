# Memo — Attention Requester: De Wrapper Component para `{@attach}` Direto

> Data: 2026-03-23
> Status: Proposta de refatoração
> Escopo: API pública, Modifier, consumidores

---

## 1. Contexto e Motivação

A Architecture.md (§5) já define a distinção entre Modifiers **comportamentais** e **estruturais**:

| Tipo | Precisa de filhos? | Implementação | Custo |
|---|---|---|---|
| **Comportamental** — apenas afeta o elemento host | Não | `{@attach}` (action) | Zero — sem instância de componente |
| **Estrutural** — envolve filhos ou provê Context | Sim | Componente `.svelte` com `display: contents` | Mínimo — lifecycle, sem custo de DOM |

O Attention Requester hoje é implementado como **Structural Modifier** — um componente `.svelte` com `children`/`asChild` snippets que envolve o elemento alvo. Porém ele é, na essência, um **Behavioral Modifier**: não provê Context, não renderiza filhos compostos, não precisa de hierarquia. Ele só precisa de uma referência ao elemento DOM para operar.

**A implementação contradiz a própria arquitetura.**

---

## 2. API Atual vs. API Proposta

### Hoje — Wrapper Component

```svelte
<!-- Modo children (wrapper automático) -->
<AttentionRequester bind:this={attention} paused={isMoving}>
  <Cursor />
</AttentionRequester>

<!-- Modo asChild (delegation via use:attach) -->
<AttentionRequester bind:this={attention}>
  {#snippet asChild({ attach, isAnimating })}
    <div use:attach class:active={isAnimating}>Alvo</div>
  {/snippet}
</AttentionRequester>
```

**Problemas:**
- O componente cria um `<div style="display:contents">` invisível no DOM (modo `children`) — sem necessidade
- Duas formas de renderizar (`children` vs `asChild`) para algo que deveria ter uma só
- `bind:this` + componente wrapper para obter `request()` e `cancel()` — acoplamento desnecessário
- A complexidade de `AttentionRequesterProps` (union discriminada com 4 campos) existe para resolver um problema que não precisa existir

### Proposta — `{@attach}` Direto

```svelte
<script lang="ts">
  import { attentionRequester, PhysicsBounce } from "@headless-uai/attention-requester";

  const attention = attentionRequester();
  // attention.request(animation)
  // attention.cancel()
  // attention.isAnimating  (reativo)
  // attention.paused = true/false  (reativo)
</script>

<div {@attach attention.attach}>
  <Cursor />
</div>
```

**Ganhos:**
- Zero componentes wrapper — zero custo de instância Svelte
- Zero nós extras no DOM
- API unificada — uma única forma de usar
- `paused` vira propriedade reativa do objeto, não prop de componente
- `request()` e `cancel()` chamados diretamente no objeto, sem `bind:this`
- `isAnimating` acessível como getter reativo, sem precisar de snippet parameter

---

## 3. Forma da Nova API Pública

```ts
// Factory function (não classe — não faz sentido instanciar com `new`)
function attentionRequester(): AttentionRequesterHandle;

interface AttentionRequesterHandle {
  /** Attach action para usar com {@attach} */
  readonly attach: (el: HTMLElement) => (() => void);

  /** Triggers animation. No-op se já animando. */
  request(
    animation: AttentionRequesterAnimation,
    reducedMotionAnimation?: AttentionRequesterAnimation
  ): void;

  /** Graceful cancel — ciclo atual termina, loop para. */
  cancel(): void;

  /** true enquanto animação ativa (inclusive pausada). */
  readonly isAnimating: boolean;

  /** Controla pausa/resume. Reativo. */
  paused: boolean;
}
```

**Exports atualizados:**
```ts
// Antes
export { default as AttentionRequester } from "./AttentionRequesterModifier.svelte";

// Depois
export { attentionRequester } from "./attentionRequester.svelte.ts";

// Mantidos (sem mudança)
export { PhysicsBounce, DoubleBounce } from "./animations/...";
export type { AttentionRequesterAnimation, ... } from "./AttentionRequester.types.ts";
```

---

## 4. Impacto na Implementação Interna

### O que muda

| Arquivo | Mudança |
|---|---|
| `AttentionRequesterModifier.svelte` | **Removido** — não existe mais componente |
| `attentionRequester.svelte.ts` | **Novo** — factory function que cria Model, Coordinator, e expõe a handle |
| `AttentionRequesterModel.svelte.ts` | **Sem mudança** — continua sendo a state machine pura |
| `AttentionRequesterCoordinator.svelte.ts` | **Sem mudança** — continua recebendo `(el, model)` |
| `AttentionRequester.types.ts` | **Atualizado** — remove `AttentionRequesterProps`, adiciona `AttentionRequesterHandle` |
| `index.ts` | **Atualizado** — troca export do componente pela factory |

### O que NÃO muda

- **Model** — mesma state machine, mesmos métodos, mesmos testes
- **Coordinator** — mesmo ciclo de vida, mesma integração WAAPI
- **Animações** — mesmas factories, mesmos tipos
- **Behavioral Specification** — mesmos comportamentos, mesma semântica
- **Testes do Model** — 100% intactos (não dependem da view layer)

---

## 5. Migração dos Consumidores

### HomeHero.svelte (único consumidor ativo)

```svelte
<!-- Antes -->
<AttentionRequester bind:this={attention} paused={isMoving}>
  <Cursor />
</AttentionRequester>

<!-- Depois -->
<div {@attach attention.attach}>
  <Cursor />
</div>
```

```ts
// Antes
let attention: AttentionRequester;

// Depois
const attention = attentionRequester();
```

E no `$effect` ou reatividade que controla `paused`:

```ts
// Antes: prop binding
// paused={isMoving}  ← no template

// Depois: atribuição reativa
$effect(() => { attention.paused = isMoving; });
// Ou: attention.paused direto no handler
```

### Dev page (attention/+page.svelte)

Mesma migração — substituir componente wrapper por `{@attach}` + factory.

---

## 6. Blind Spots e Decisões Prévias

### 6.1 `paused` como prop vs. propriedade — trade-off de DX

A prop `paused={isMoving}` é **declarativa** — o consumidor não precisa de `$effect`. A propriedade `attention.paused = isMoving` dentro de um `$effect` é **imperativa**. Isso é um downgrade de DX?

**Análise:** Na verdade, não. O consumidor já precisa criar o objeto `attention` e chamar `attention.request()` imperativamente. O modelo mental já é imperativo. Adicionar `.paused = valor` é coerente. E o `$effect` é idêntico ao que o Modifier fazia internamente — só muda de endereço.

**Alternativa:** A factory poderia aceitar uma opção `paused` como `$state` passado por referência. Mas isso introduz complexidade de API sem ganho real — `$effect` é a forma idiomática do Svelte 5 para sincronizar estado externo.

### 6.2 `isAnimating` — como o consumidor reage?

Hoje, `isAnimating` chega via snippet parameter. Com a nova API, é um getter reativo na handle:

```svelte
<!-- Hoje -->
{#snippet children({ isAnimating })}
  <div class:active={isAnimating}>...</div>
{/snippet}

<!-- Proposta -->
<div class:active={attention.isAnimating}>...</div>
```

**Isso é estritamente melhor.** O consumidor acessa `attention.isAnimating` em qualquer lugar do template ou script — não precisa estar dentro de um snippet. Mais flexível, mais simples.

### 6.3 E se no futuro o Attention Requester precisar de Context?

Se futuramente precisar prover Context (ex: múltiplos elementos animados coordenados), a factory pode evoluir para retornar um objeto que provê Context via `setContext`/`getContext` — sem precisar voltar a ser componente. O Svelte 5 permite `setContext` em qualquer `$effect.root`. Mas isso é um cenário hipotético — hoje não há caso de uso.

### 6.4 O Movable segue o mesmo caminho?

**Não.** O Movable é genuinamente **Structural** — ele provê `Context` (`Movable.Root` → `Movable.Item`), coordena múltiplos filhos, e precisa de hierarquia de componentes. `{@attach}` não substitui Context hierarchy.

Porém, se houverem outros packages na mesma situação do Attention Requester (behavioral-only, sem Context), eles devem seguir o mesmo padrão de factory + `{@attach}`.

### 6.5 Breaking change — versioning

Esta é uma **breaking change na API pública**. O componente `<AttentionRequester>` deixa de existir. Requer bump de major version segundo semver. Consumidores precisam atualizar imports e template.

Como o único consumidor é interno (HomeHero.svelte + dev page), o impacto é controlado. Mas se o package já tiver consumidores externos, o changelog deve ser explícito.

### 6.6 Questão de enquadramento: o problema deveria existir?

O wrapper component pattern para o Attention Requester provavelmente surgiu por **inércia arquitetural** — o Movable usa wrapper, então o AR seguiu o mesmo padrão. Mas a Architecture.md já prevê que Behavioral Modifiers devem usar `{@attach}`. O problema não é "como migrar" — é que a implementação original deveria ter sido uma action desde o início.

**Isso não é refatoração — é correção de conformidade arquitetural.**

---

## 7. Sequência de Implementação Sugerida

1. **Criar `attentionRequester.svelte.ts`** — factory function que instancia Model, retorna handle com `attach`, `request`, `cancel`, `isAnimating`, `paused`
2. **Atualizar types** — adicionar `AttentionRequesterHandle`, deprecar `AttentionRequesterProps`
3. **Atualizar `index.ts`** — trocar export do componente pela factory
4. **Migrar HomeHero.svelte** — wrapper → `{@attach}`
5. **Migrar dev page** — idem
6. **Remover `AttentionRequesterModifier.svelte`**
7. **Atualizar Interface.md** — nova API contract
8. **Atualizar Behavioral Specification** se necessário (provavelmente não — comportamentos são os mesmos)
9. **Rodar testes** — Model tests devem passar sem mudança
10. **Smoke test** — verificar visualmente que animação funciona igual

---

## 8. Resumo

| Aspecto | Antes | Depois |
|---|---|---|
| Tipo de Modifier | Structural (componente) | Behavioral (action) |
| Nós no DOM | 1 `<div>` extra (mode children) | Zero |
| Formas de usar | 2 (children / asChild) | 1 ({@attach}) |
| Instância Svelte | Sim | Não |
| `bind:this` necessário | Sim | Não |
| Testes do Model | Intactos | Intactos |
| Breaking change | — | Sim (major bump) |
