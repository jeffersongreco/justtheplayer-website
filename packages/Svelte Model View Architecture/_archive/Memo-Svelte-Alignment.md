# Memo: Alinhamento da Arquitetura MV com o Svelte

> **Objetivo:** Avaliar (1) o que na arquitetura vai contra as recomendações do Svelte e (2) o que o Svelte oferece que poderia melhorar a arquitetura e ainda não está sendo usado.
>
> **Fontes:** documentação oficial via Svelte MCP (seções `@attach`, `use:`, `context`, `svelte-attachments`, `svelte-boundary`, `svelte-reactivity`, `best-practices`).

---

## 1. O que vai contra as recomendações do Svelte

### 1.1 `use:action` para captura de elemento — substituído por `{@attach ...}`

**Onde na arquitetura:** §3 (Controller), padrão canônico de captura do `HTMLElement`:

```svelte
const action: Action = (n) => { node = n; return {}; };
```

**O que o Svelte diz:**

> "In Svelte 5.29 and newer, consider using attachments instead, as they are more flexible and composable."

`{@attach ...}` é a substituta oficial de `use:`. A diferença crítica é reatividade: `use:action` **só roda uma vez** — o argumento não re-executa a action se mudar. Attachments são totalmente reativos: `{@attach foo(bar)}` re-executa quando `foo` ou `bar` mudam.

**Impacto para a arquitetura:** o uso atual de `use:` para *captura de node* é um caso simples sem argumento — não há bug, mas a API está deprecada conceitualmente. O padrão de ciclo de vida do Controller (§3) precisa ser revisitado: `{@attach ...}` pode assumir tanto a captura do node quanto a criação/destruição do Controller no mesmo lugar, eliminando a variável `$state<HTMLElement | null>` e o `$effect` que observa ela.

```svelte
<!-- Padrão atual (use:) -->
let node = $state<HTMLElement | null>(null);
$effect(() => {
  if (!node) return;
  const ctrl = new SomeController(node, model);
  return () => ctrl.destroy();
});
<div use:action>...</div>

<!-- Padrão sugerido (@attach) -->
<div {@attach (el) => {
  const ctrl = new SomeController(el, model);
  return () => ctrl.destroy();
}}>...</div>
```

O padrão com `{@attach ...}` é mais idiomático, mais direto, e elimina o estado intermediário `node`.

---

### 1.2 `setContext`/`getContext` diretamente — substituídos por `createContext`

**Onde na arquitetura:** §2 e §5 descrevem o uso de Svelte Context para ecossistemas multi-componente (`MovableContext.use()`), mas não especificam qual API usar.

**O que o Svelte diz:**

> "As an alternative to using `setContext` and `getContext` directly, you can use them via `createContext`. This gives you type safety and makes it unnecessary to use a key."

```ts
// context.ts
export const [getMovableContext, setMovableContext] = createContext<MovableModel>();
```

**Impacto para a arquitetura:** a arquitetura já expõe `MovableContext.use()` como atalho — isso é o padrão certo. O que falta é que a implementação por baixo use `createContext` em vez de `setContext`/`getContext` com chave manual. `createContext` elimina a possibilidade de colisão de chaves e garante inferência de tipo sem cast.

---

## 2. O que o Svelte oferece que não está sendo usado

### 2.1 `createSubscriber` — feito exatamente para a camada Interaction

**Onde na arquitetura:** §4 (Interaction), que traduz eventos de hardware em comandos para o Model via `addEventListener`.

**O que o Svelte oferece (`svelte/reactivity`):**

> "Returns a `subscribe` function that integrates external event-based systems with Svelte's reactivity. Particularly useful for integrating with web APIs like `MediaQuery`, `IntersectionObserver`, or WebSocket."

`createSubscriber` é a API oficial para fazer com que fontes externas de eventos (pointer, keyboard, ResizeObserver) participem do grafo reativo do Svelte **sem precisar de `$effect`**. Em vez de um `$effect` que registra listeners no construtor do Controller/Interaction, um getter do Model poderia ser reativo a eventos externos por natureza.

**Por que isso importa:** a arquitetura descreve o Interaction como "plugável e substituível" (§4). `createSubscriber` é a forma idiomática do Svelte de criar exatamente esse tipo de fonte de reatividade. Isso poderia simplificar Interactions que hoje dependem de `$effect.root` ou `addEventListener` explícito.

**Exemplo de aplicação:**

```ts
// DragInteraction.svelte.ts
import { createSubscriber } from 'svelte/reactivity';

class DragInteraction {
  #isDragging = $state(false);

  #subscribe = createSubscriber((update) => {
    const onPointerDown = () => { this.#isDragging = true; update(); };
    window.addEventListener('pointerdown', onPointerDown);
    return () => window.removeEventListener('pointerdown', onPointerDown);
  });

  get isDragging() {
    this.#subscribe(); // torna o getter reativo
    return this.#isDragging;
  }
}
```

A integração com sistemas externos fica declarativa, o teardown é automático quando nenhum effect lê o getter.

---

### 2.2 `<svelte:boundary>` — implementação nativa da Filosofia Fail-Safe

**Onde na arquitetura:** §7 (Filosofia Fail-Safe) prescreve resiliência silenciosa: `console.warn` em vez de `throw`, correção em runtime, continuidade da UX.

**O que o Svelte oferece:**

`<svelte:boundary>` (disponível desde 5.3.0) é o mecanismo oficial de error boundary do Svelte. Captura erros durante renderização e em efeitos, e permite renderizar UI alternativa via snippet `failed` ou chamar `onerror` para logging.

**Por que isso importa:** a arquitetura implementa fail-safe *dentro* dos componentes (lógica defensiva, guards). `<svelte:boundary>` adiciona uma camada de contenção *em torno* dos componentes — se um Modifier ou Context lançar um erro inesperado em produção, o boundary impede que a árvore inteira desmonte. Isso complementa, não substitui, a filosofia atual.

**Recomendação:** envolver os componentes Modifier/Context de cada package num `<svelte:boundary>` no nível da aplicação (ou do `HomeHero`, por exemplo). O snippet `failed` pode renderizar o conteúdo filho sem os superpoderes do Modifier — degradação graciosa real.

---

### 2.3 `$state.raw` — para objetos grandes imutáveis por design

**Onde na arquitetura:** §2 descreve o uso de `$state` para estado reativo no Model. §6 descreve animações como objetos de dados (`keyframes`, `duration`, etc.).

**O que o Svelte diz:**

> "In cases where you're dealing with large objects that are only ever reassigned (rather than mutated), use `$state.raw` instead."

**Por que isso importa:** objetos de animação (`ARAnimation`, `ARAnimationLoop`) são declarados pelo consumidor e passados ao Model. Se armazenados como `$state({...})`, o Svelte cria um Proxy profundo — overhead desnecessário se o objeto nunca é mutado, apenas substituído por inteiro. `$state.raw` daria a reatividade de reassignment sem o custo do Proxy.

---

## Resumo Executivo

| # | Tipo | Tema | Severidade |
|---|---|---|---|
| 1.1 | Conflito | `use:action` deprecado → migrar para `{@attach ...}` | Alta — API descontinuada, padrão central da arquitetura |
| 1.2 | Conflito | `setContext`/`getContext` direto → usar `createContext` | Média — funciona, mas sem type safety nativa |
| 2.1 | Gap | `createSubscriber` não usado na camada Interaction | Alta — encaixe semântico perfeito, simplifica o padrão |
| 2.2 | Gap | `<svelte:boundary>` não usado para Fail-Safe | Média — complementa §7 com contenção estrutural |
| 2.3 | Gap | `$state.raw` não considerado para objetos de animação | Baixa — otimização de performance, não comportamento |

**Decisão prioritária:** a migração de `use:action` → `{@attach ...}` (1.1) muda o padrão canônico do Controller (§3) e deve ser discutida antes de criar novos packages. Todos os outros pontos podem ser adotados incrementalmente.
