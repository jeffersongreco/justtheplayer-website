# Memo — Movable: De Wrapper Components para `{@attach}` Direto

> Data: 2026-03-23
> Status: Proposta de refatoração
> Escopo: API pública, Context/Item/Sensor, consumidores

---

## 1. Contexto e Motivação

O memo anterior (Attention Requester) argumentou que um **Behavioral Modifier** não precisa de componente wrapper — factory + `{@attach}` basta. A conclusão era que o Movable, por ser **Structural** (provê Context, coordena múltiplos filhos), precisava de componentes.

Isso é parcialmente verdade. O Movable **coordena múltiplos participantes** (root, items, sensors) e **compartilha estado** entre eles. Mas o mecanismo usado para isso — Svelte Context via componentes wrapper com snippets — não é o único caminho. Funções factory podem receber o contexto compartilhado **explicitamente como argumento**, eliminando a necessidade de componentes wrapper, Svelte Context e snippet nesting.

**O argumento central:** os três componentes (Context, Item, Sensor) existem apenas para:
1. Criar/consumir Svelte Context (passar o Model implicitamente)
2. Renderizar o `{@attach}` no elemento do consumidor
3. Expor estado reativo via snippet parameters

Os três são **boilerplate de mediação** — nenhum renderiza UI própria, nenhum precisa de lifecycle de componente, nenhum precisa de hierarquia DOM. Se o consumidor receber o contexto explicitamente, os componentes são desnecessários.

---

## 2. API Atual vs. API Proposta

### Hoje — Componentes com Svelte Context + Snippets

```svelte
<script lang="ts">
  import { Movable } from "@headless-uai/movable";
</script>

<Movable.Context>
  {#snippet asChild({ attach, context })}
    <div {@attach attach} class="canvas">

      <Movable.Sensor accepts={["ghost"]}>
        {#snippet asChild({ attach: attachSensor, isOver })}
          <div {@attach attachSensor} class="sensor" class:active={isOver}>
            Sensor
          </div>
        {/snippet}
      </Movable.Sensor>

      <Movable.Item initialPosition={{ x: "50%", y: "50%" }}>
        {#snippet children({ isMoving, isFocused })}
          <div class:moving={isMoving} class:focused={isFocused}>
            Item
          </div>
        {/snippet}
      </Movable.Item>

    </div>
  {/snippet}
</Movable.Context>
```

**Problemas:**
- **Snippet nesting de 3 níveis** — Context → Sensor → template, Context → Item → template. O template real fica indentado 6+ níveis
- **Renomeação de `attach`** — `Movable.Sensor` dentro de `Movable.Context` força `{ attach: attachSensor }` para evitar shadowing. Friction desnecessária
- **Svelte Context implícito** — Item e Sensor dependem de estarem na árvore de componentes sob Context. Se o consumidor mover um Item para outro arquivo/componente, precisa garantir que Context está acima. Dependência invisível
- **3 instâncias de componente** para algo que não renderiza nada. Cada uma com lifecycle, snapshot, etc.
- **`Movable.get()`** existe só porque Svelte Context é posicional — sem componentes wrapper, o consumidor já tem a referência direta

### Proposta — Factory Functions com Contexto Explícito

```svelte
<script lang="ts">
  import { movableContext, movableItem, movableSensor } from "@headless-uai/movable";

  const context = movableContext();
  const item = movableItem(context, { initialPosition: { x: "50%", y: "50%" } });
  const sensor = movableSensor(context, { accepts: ["ghost"] });
</script>

<div {@attach context.attach} class="canvas">

  <div {@attach sensor.attach} class="sensor" class:active={sensor.isOver}>
    Sensor
  </div>

  <div {@attach item.attach} class:moving={item.isMoving} class:focused={item.isFocused}>
    Item
  </div>

</div>
```

**Ganhos:**
- **Zero snippet nesting** — template flat, legível, sem indentação forçada
- **Zero renomeação** — cada factory retorna seu próprio `.attach`, sem conflito de nomes
- **Dependência explícita** — `movableItem(context, ...)` declara que precisa do contexto. Sem magic, sem posição na árvore
- **Zero instâncias de componente** — zero custo de lifecycle
- **`Movable.get()` desnecessário** — o consumidor já tem `context` como variável
- **Estado reativo acessível em qualquer lugar** — `item.isMoving` no template, no script, em `$effect`, sem precisar estar dentro de um snippet

---

## 3. Forma da Nova API Pública

```ts
// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

function movableContext(): MovableContextHandle;

interface MovableContextHandle {
  /** Attach action — aplica no elemento root (deve ter position: relative) */
  readonly attach: (el: HTMLElement) => (() => void);

  /** ID do item sendo arrastado, ou null */
  readonly activeItemID: string | null;

  /** Verifica se o item ativo está sobre o sensor com o dado ID */
  isOverSensor(id: string): boolean;
}

// ---------------------------------------------------------------------------
// Item
// ---------------------------------------------------------------------------

interface MovableItemOptions {
  id?: string;
  initialPosition?: MovableItemPosition;
  group?: MovableGroup;
  stepSize?: number;
  tabindex?: number;
}

function movableItem(
  context: MovableContextHandle,
  options?: MovableItemOptions
): MovableItemHandle;

interface MovableItemHandle {
  /** Attach action — aplica no elemento draggable */
  readonly attach: (el: HTMLElement) => (() => void);

  /** true enquanto este item está sendo arrastado */
  readonly isMoving: boolean;

  /** true quando o elemento tem :focus-visible */
  readonly isFocused: boolean;
}

// ---------------------------------------------------------------------------
// Sensor
// ---------------------------------------------------------------------------

interface MovableSensorOptions {
  id?: string;
  accepts?: MovableGroup;
  onDrop?: () => void;
}

function movableSensor(
  context: MovableContextHandle,
  options?: MovableSensorOptions
): MovableSensorHandle;

interface MovableSensorHandle {
  /** Attach action — aplica no elemento da drop zone */
  readonly attach: (el: HTMLElement) => (() => void);

  /** true enquanto o item ativo está sobre este sensor */
  readonly isOver: boolean;
}
```

**Exports atualizados:**
```ts
// Antes
export const Movable = {
  Context: MovableContext,
  Item: MovableItem,
  Sensor: MovableSensor,
  get: getMovableQuery,
};

// Depois
export { movableContext, movableItem, movableSensor };

// Mantidos (sem mudança)
export type {
  MovableItemPosition,
  MovableGroup,
  PositionValue,
  MovableContextHandle,
  MovableItemHandle,
  MovableSensorHandle,
};
```

---

## 4. Onde Vai Cada Responsabilidade

Hoje, responsabilidades estão espalhadas entre componente e coordinator. Com factories, o componente desaparece e suas responsabilidades migram:

### 4.1 Context

| Responsabilidade | Hoje (componente) | Proposta (factory) |
|---|---|---|
| Criar MovableModel | `MovableContext.svelte` | `movableContext()` |
| Registrar no Svelte Context | `setMovableContext(model)` | **Removido** — contexto é passado explicitamente |
| Criar MovableContextQuery | `MovableContext.svelte` | Handle **é** a query (mesma interface) |
| Instanciar ContextCoordinator | Função `attach` no componente | Função `attach` na factory |

A factory `movableContext()` cria o Model e retorna a handle. O `attach` na handle instancia o `MovableContextCoordinator` — mesma lógica de hoje, sem componente intermediário.

### 4.2 Item

| Responsabilidade | Hoje (componente) | Proposta (factory) |
|---|---|---|
| Ler Model do Svelte Context | `getMovableContext()` | Recebe via `context` arg (internamente extrai Model) |
| `isMoving` derivado | `$derived` no componente | `$derived` na factory / getter reativo na handle |
| `isFocused` + focus/blur handlers | Estado + handlers no componente | **Migra para o ItemCoordinator** |
| Wrapper div com styles/ARIA | Modo `children` do componente | **Removido** — consumidor fornece seu elemento |
| CSS `.movable` (display, outline, animation-pause) | `<style>` no componente | **Migra para o ItemCoordinator** (via `el.style`) ou consumidor |

**Decisão importante:** `isFocused` e os handlers `onfocus`/`onblur` vivem hoje no componente mas são DOM concerns — pertencem ao Coordinator. O ItemCoordinator já manipula `el` diretamente (cursor, will-change, ARIA). Adicionar `focusin`/`focusout` listeners lá é natural.

**CSS de `.movable`:** O Coordinator já aplica `position: absolute`, `cursor`, `touch-action`, `user-select` via `el.style`. Os estilos restantes (`.movable:focus { outline: none }`, `[data-moving] :global(*) { animation-play-state: paused }`) são decisions do componente wrapper que devem migrar para o Coordinator (ele já seta `data-moving`) ou virar responsabilidade do consumidor.

### 4.3 Sensor

| Responsabilidade | Hoje (componente) | Proposta (factory) |
|---|---|---|
| Ler Model do Svelte Context | `getMovableContext()` | Recebe via `context` arg |
| Registrar sensor no Model | Função `attach` no componente | Função `attach` na factory |
| `isOver` derivado | `$derived` no componente | Getter reativo na handle |
| `onDrop` callback | `$effect` no componente | `$effect` na factory |

O Sensor é o caso mais simples — quase nenhuma lógica no componente, a factory é praticamente uma transcrição 1:1.

---

## 5. Impacto na Implementação Interna

### O que muda

| Arquivo | Mudança |
|---|---|
| `MovableContext.svelte` | **Removido** |
| `MovableItem.svelte` | **Removido** |
| `MovableSensor.svelte` | **Removido** |
| `movableContext.svelte.ts` | **Novo** — factory para Context |
| `movableItem.svelte.ts` | **Novo** — factory para Item (absorve lógica de focus/CSS do componente) |
| `movableSensor.svelte.ts` | **Novo** — factory para Sensor |
| `MovableModel.svelte.ts` | **Atualizado** — remove `createContext`/`setMovableContext`/`getMovableContext` |
| `Movable.types.ts` | **Atualizado** — remove Props types, adiciona Handle interfaces |
| `index.ts` | **Atualizado** — exporta factories em vez de namespace object |

### O que NÃO muda

- **MovableModel** — mesma state machine, mesmos métodos, mesmos testes
- **MovableContextCoordinator** — mesmo setup de root, a11y elements
- **MovableItemCoordinator** — mesmo lifecycle, interactions, rAF, collision detection
- **MovableDragInteraction** — mesmo handler de pointer events
- **MovableKeyboardInteraction** — mesmo handler de keyboard
- **Geometry** — mesmas utils
- **Testes do Model** — 100% intactos

### Mudanças no ItemCoordinator

O ItemCoordinator ganha duas responsabilidades que hoje estão no componente:

```ts
// Novo: focus tracking (antes era no MovableItem.svelte)
el.addEventListener("focusin", (e) => {
  if (e.target instanceof HTMLElement) {
    this.#isFocused = e.target.matches(":focus-visible");
  }
});
el.addEventListener("focusout", () => {
  this.#isFocused = false;
});

// Novo: suppress focus ring (antes era CSS no componente)
// O Coordinator já manipula el.style — adicionar outline: "none" é natural
```

`isFocused` vira um `$state` reativo no Coordinator, exposto via getter na handle.

---

## 6. Migração dos Consumidores

### HomeHero.svelte

```svelte
<!-- Antes -->
<script lang="ts">
  import { Movable } from "@headless-uai/movable";
</script>

<Movable.Context>
  {#snippet asChild({ attach, context })}
    <div {@attach attach} class="hero z-stack">
      <div class:isCursorOutScreen={!context.isOverSensor("home-screen-sensor")}>
        ...
      </div>
      <Movable.Item initialPosition={{ x: "50%", y: "50%" }}>
        {#snippet children({isMoving})}
          <div {@attach attention.attach}>
            <Cursor />
          </div>
        {/snippet}
      </Movable.Item>
    </div>
  {/snippet}
</Movable.Context>
```

```svelte
<!-- Depois -->
<script lang="ts">
  import { movableContext, movableItem } from "@headless-uai/movable";

  const context = movableContext();
  const cursor = movableItem(context, { initialPosition: { x: "50%", y: "50%" } });
</script>

<div {@attach context.attach} class="hero z-stack">
  <div class:isCursorOutScreen={!context.isOverSensor("home-screen-sensor")}>
    ...
  </div>
  <div {@attach cursor.attach} {@attach attention.attach}>
    <Cursor />
  </div>
</div>
```

**Diferenças notáveis:**
- 3 níveis de indentação a menos (sem snippet nesting)
- `context` é uma variável no script, não um snippet parameter
- `isMoving` acessível como `cursor.isMoving` em qualquer lugar, não só dentro do snippet
- Dois `{@attach}` no mesmo elemento (Movable + Attention Requester) — Svelte 5 suporta múltiplos `{@attach}` no mesmo elemento

### Dev page (drag/+page.svelte)

```svelte
<!-- Antes -->
<Movable.Context>
  {#snippet asChild({ attach })}
    <div {@attach attach} class="canvas">
      <Movable.Sensor accepts={["ghost"]}>
        {#snippet asChild({ attach: attachSensor, isOver })}
          <div {@attach attachSensor} class="sensor" class:active={isOver}>Sensor</div>
        {/snippet}
      </Movable.Sensor>

      <Movable.Item initialPosition={{ x: "10%", y: "10%" }}>
        {#snippet children({ isMoving, isFocused })}
          <div class="item" class:moving={isMoving} class:focused={isFocused}>Item</div>
        {/snippet}
      </Movable.Item>

      <Movable.Item initialPosition={{ x: "80%", y: "80%" }} group={["ghost"]}>
        {#snippet children()}
          <div class="ghost">👻</div>
        {/snippet}
      </Movable.Item>
    </div>
  {/snippet}
</Movable.Context>
```

```svelte
<!-- Depois -->
<script lang="ts">
  import { movableContext, movableItem, movableSensor } from "@headless-uai/movable";

  const context = movableContext();
  const item1 = movableItem(context, { initialPosition: { x: "10%", y: "10%" } });
  const item2 = movableItem(context, { initialPosition: { x: "80%", y: "80%" }, group: ["ghost"] });
  const sensor = movableSensor(context, { accepts: ["ghost"] });
</script>

<main>
  <h1>Movable</h1>

  <div {@attach context.attach} class="canvas">
    <div {@attach sensor.attach} class="sensor" class:active={sensor.isOver}>Sensor</div>

    <div {@attach item1.attach} class="item" class:moving={item1.isMoving} class:focused={item1.isFocused}>
      Item
    </div>

    <div {@attach item2.attach} class="ghost">👻</div>
  </div>
</main>
```

**Redução dramática:** de 35 linhas de template para 14. Zero snippets. Flat structure.

---

## 7. Blind Spots e Decisões Prévias

### 7.1 Svelte Context desaparece — e o `Movable.get()`?

`Movable.get()` hoje usa `getMovableContext()` (Svelte Context) para acessar a query de qualquer componente descendente. Sem Svelte Context, isso não funciona.

**Análise:** `Movable.get()` existe para compensar a limitação de que snippet parameters só são acessíveis dentro do snippet. Com factories, o consumidor já tem `context` como variável de escopo — pode passá-la a qualquer child component como prop, ou usar Svelte Context do próprio consumidor se precisar de deep passing. O framework do Movable não precisa impor o mecanismo de distribuição.

**Decisão:** Remover `Movable.get()`. Se o consumidor precisa passar `context` para subcomponentes, ele decide como (prop, Svelte Context, module state). Isso é responsabilidade da aplicação, não do package.

### 7.2 Contexto explícito é verbose?

Cada `movableItem()` e `movableSensor()` recebe `context` como primeiro argumento. Com muitos items/sensors, isso repete.

**Análise:** Na prática:
- HomeHero tem 1 item, 0 sensors → 1 call com `context`
- Dev page tem 2 items, 1 sensor → 3 calls com `context`
- Cenários reais raramente excedem 5-10 participantes

A repetição de `context` é mínima e o ganho de explicitude compensa. Comparar com o snippet nesting que elimina.

**Alternativa considerada e descartada:** `context.item(opts)` / `context.sensor(opts)` — builder pattern. Funciona mas acopla a handle de Context com conhecimento de Item e Sensor. Factories separadas mantêm cada unidade independente.

### 7.3 Múltiplos `{@attach}` no mesmo elemento

HomeHero aplica Movable Item + Attention Requester no mesmo `<div>`. Com componentes wrapper, cada um envolvia o elemento separadamente. Com `{@attach}`, ambos são aplicados no mesmo elemento:

```svelte
<div {@attach cursor.attach} {@attach attention.attach}>
```

**Svelte 5 suporta múltiplos `{@attach}` no mesmo elemento.** Cada action recebe o mesmo `el` e retorna seu próprio cleanup. Não há conflito — são compostos ortogonalmente.

**Isso é estritamente melhor** que o wrapper approach, onde a hierarquia de wrappers criava nesting desnecessário e potenciais problemas de CSS containment.

### 7.4 `isFocused` migra para o Coordinator — isso viola a separação Model/Coordinator?

Hoje `isFocused` é estado do componente (view layer). Mover para o Coordinator parece misturar concerns.

**Análise:** `isFocused` é um **estado derivado do DOM** (`:focus-visible`) — é intrinsecamente um concern de Coordinator. O componente só o hospedava porque era o único lugar com acesso ao `el` e ao template. Com a factory, o Coordinator — que já gerencia focus ring suppression, ARIA attributes, e cursor style — é o local natural.

`isFocused` **não pertence ao Model** (não é estado de negócio) e **não pertencia ao componente** (era acidental). Coordinator é o lugar certo.

### 7.5 CSS do componente Item — quem aplica?

O `MovableItem.svelte` tem CSS scoped:
```css
.movable { display: flex; width: max-content; height: max-content; }
.movable:focus { outline: none; }
.movable[data-moving="true"] :global(*) { animation-play-state: paused !important; }
```

Sem componente, CSS scoped não existe. Opções:

1. **Coordinator aplica via `el.style`** — `display: flex`, `width: max-content`, etc.
2. **Consumidor decide** — o framework não impõe layout styles
3. **Misto** — Coordinator aplica styles necessários para funcionamento (já faz: `position: absolute`, `cursor`, `touch-action`), consumidor aplica styles de apresentação

**Decisão:** Opção 3. O Coordinator aplica:
- `outline: none` (focus ring suppression — já é policy do package, documentada em feedback_movable_focus_ring.md)
- `data-moving` attribute (já setado pelo Coordinator)

O consumidor aplica:
- `display`, `width`, `height` — são decisões de layout
- `animation-play-state: paused` via `[data-moving="true"]` — o consumidor opta in se quiser esse behavior

Isso é mais flexível que forçar `display: flex; width: max-content` em todos os items.

### 7.6 CSS do componente Sensor — mesma questão

```css
.sensor { display: flex; width: max-content; height: max-content; }
```

**Decisão:** Removido. O Sensor não precisa de nenhum style obrigatório. O consumidor estiliza como quiser.

### 7.7 E o namespace object `Movable`?

Hoje a API é `Movable.Context`, `Movable.Item`, `Movable.Sensor`. Isso existe porque componentes são values e podem ser agrupados em um objeto.

Com factories, a API vira named imports: `movableContext`, `movableItem`, `movableSensor`. O namespace desaparece, mas o prefixo `movable` mantém o agrupamento semântico.

**Alternativa:** manter um namespace: `Movable.context()`, `Movable.item()`, `Movable.sensor()`. Funciona, mas é menos idiomático para tree-shaking e para a convenção de imports nomeados.

**Decisão:** Named imports. Alinhado com a convenção estabelecida pelo Attention Requester (`attentionRequester()`).

### 7.8 Breaking change — versioning

Mesma situação do Attention Requester: **breaking change na API pública**. O namespace `Movable` com componentes deixa de existir. Major version bump obrigatório.

Consumidores internos: HomeHero.svelte + dev page. Impacto controlado.

### 7.9 Item precisa de `tabindex` e `role="button"` — quem aplica?

Hoje o componente wrapper aplica `role="button"` e `tabindex` no div wrapper. O Coordinator aplica `aria-roledescription="draggable"` e `aria-pressed`. Sem componente, o consumidor teria que lembrar de colocar `role="button"` e `tabindex`?

**Decisão:** O Coordinator deve aplicar ambos (`role="button"` e `tabindex`), já que são requisitos de acessibilidade do draggable — não são opcionais. O Coordinator já aplica `aria-roledescription` e `aria-describedby`, então adicionar `role` e `tabindex` é consistente.

O `tabindex` pode vir das options da factory (default `0`), aplicado pelo Coordinator via `el.setAttribute`.

---

## 8. Sequência de Implementação Sugerida

1. **Criar `movableContext.svelte.ts`** — factory que instancia Model, retorna handle com `attach`, `activeItemID`, `isOverSensor`
2. **Criar `movableItem.svelte.ts`** — factory que recebe context handle + options, retorna handle com `attach`, `isMoving`, `isFocused`
3. **Atualizar `MovableItemCoordinator`** — absorver `isFocused` tracking (focusin/focusout) e focus ring suppression
4. **Criar `movableSensor.svelte.ts`** — factory que recebe context handle + options, retorna handle com `attach`, `isOver`
5. **Atualizar `MovableModel.svelte.ts`** — remover `createContext`/`setMovableContext`/`getMovableContext`
6. **Atualizar `Movable.types.ts`** — remover Props types, adicionar Handle interfaces
7. **Atualizar `index.ts`** — exportar factories, remover namespace object
8. **Migrar HomeHero.svelte** — componentes → factories + `{@attach}`
9. **Migrar dev page** — idem
10. **Remover `MovableContext.svelte`, `MovableItem.svelte`, `MovableSensor.svelte`**
11. **Atualizar Interface.md / docs** — nova API contract
12. **Rodar testes** — Model tests devem passar sem mudança
13. **Smoke test** — drag, keyboard, sensor collision, a11y announcements

---

## 9. Svelte Context: Oferecer ou Não?

A §7.1 decidiu remover `Movable.get()` e o Svelte Context. Mas essa decisão merece análise mais profunda — o Svelte Context resolve um problema real (distribuição de estado sem prop drilling), e removê-lo transfere esse problema para o consumidor.

### 9.1 O que o Svelte Context custa?

Quase nada. `setContext` e `getContext` são operações em `Map` durante a inicialização do componente. Zero custo em runtime após o setup. Zero overhead reativo — é um ponteiro estático para o Model.

O custo real do Svelte Context **nunca foi de performance** — é de **acoplamento posicional**. O consumidor precisa garantir que Item e Sensor estejam na árvore de componentes abaixo de Context. Isso é uma restrição invisível: funciona quando respeitada, falha silenciosamente (ou com erro críptico) quando violada.

### 9.2 Cenário: Item em outro componente

Com Svelte Context (hoje):

```svelte
<!-- Parent.svelte -->
<Movable.Context>
  {#snippet asChild({ attach })}
    <div {@attach attach}>
      <ChildA />  <!-- Funciona: está na árvore sob Context -->
      <ChildB />  <!-- Funciona: idem -->
    </div>
  {/snippet}
</Movable.Context>

<!-- ChildA.svelte -->
<Movable.Item>  <!-- getContext() encontra o Model automaticamente -->
  ...
</Movable.Item>
```

Sem Svelte Context (proposta pura):

```svelte
<!-- Parent.svelte -->
<script>
  const context = movableContext();
  const item = movableItem(context);
</script>
<div {@attach context.attach}>
  <!-- item.attach precisa chegar em ChildA... como? -->
  <ChildA attach={item.attach} isMoving={item.isMoving} />
</div>
```

Funciona, mas o consumidor agora faz prop drilling manual. Se ChildA for raso (1 nível), é trivial. Se o item estiver 3+ componentes abaixo, vira um pipe de props por toda a cadeia.

### 9.3 Cenário: Item em contexto diferente do DOM parent

Este cenário **não é possível** com Svelte Context — `getContext()` sempre lê do ancestor mais próximo na árvore de componentes. Se o Item está sob Context A no DOM, ele lê Context A. Não tem como fazê-lo pertencer a Context B.

Com contexto explícito:

```svelte
<script>
  const contextA = movableContext();
  const contextB = movableContext();

  // Item visualmente dentro de contextA, mas logicamente pertence a contextB
  const item = movableItem(contextB);
</script>

<div {@attach contextA.attach}>
  <div {@attach item.attach}>  <!-- DOM está em A, lógica está em B -->
    ...
  </div>
</div>
```

Isso **funciona** com contexto explícito e **é impossível** com Svelte Context. Porém: é um cenário real? Para o Movable, provavelmente não — o Item precisa estar dentro do root DOM do Context (o Coordinator valida `offsetParent`). Se o elemento está visualmente no container A, precisa logicamente pertencer a A para que clamping e collision detection façam sentido.

**Veredicto:** cross-context é uma capacidade teórica que o Movable não pode explorar na prática — as constraints de DOM (position: absolute relativo ao root, boundary clamping) impedem.

### 9.4 A abordagem híbrida: Svelte Context como conveniência, argumento explícito como override

A factory `movableContext()` é chamada no `<script>` de um componente Svelte — ou seja, durante a inicialização do componente. `setContext()` funciona nesse momento. Da mesma forma, `movableItem()` é chamada durante init — `getContext()` funciona.

Isso abre uma terceira via:

```ts
// movableContext() sempre seta Svelte Context internamente
function movableContext(): MovableContextHandle {
  const model = new MovableModel();
  setContext(MOVABLE_KEY, model);
  // ... retorna handle
}

// movableItem() aceita context opcional — se não passar, lê do Svelte Context
function movableItem(
  contextOrOptions?: MovableContextHandle | MovableItemOptions,
  options?: MovableItemOptions
): MovableItemHandle {
  // Se primeiro arg é handle, usa. Senão, lê do Svelte Context.
  const model = isHandle(contextOrOptions)
    ? contextOrOptions[INTERNAL_MODEL]
    : getContext(MOVABLE_KEY);
  // ...
}
```

**API resultante:**

```svelte
<!-- Caso simples: Svelte Context automático (sem passar context) -->
<script>
  const context = movableContext();
  const item = movableItem({ initialPosition: { x: "50%", y: "50%" } });
  const sensor = movableSensor({ accepts: ["ghost"] });
</script>

<div {@attach context.attach}>
  <div {@attach sensor.attach}>Sensor</div>
  <div {@attach item.attach}>Item</div>
</div>
```

```svelte
<!-- Caso avançado: child component lê Context automaticamente -->
<!-- Parent.svelte -->
<script>
  const context = movableContext();
</script>
<div {@attach context.attach}>
  <DraggableChild />
</div>

<!-- DraggableChild.svelte -->
<script>
  // Funciona! getContext() encontra o Model setado pelo parent
  const item = movableItem({ initialPosition: { x: "10%", y: "10%" } });
</script>
<div {@attach item.attach}>Child item</div>
```

```svelte
<!-- Caso explícito: override quando necessário -->
<script>
  const contextA = movableContext();
  const contextB = movableContext();
  const item = movableItem(contextB, { initialPosition: { x: "50%", y: "50%" } });
</script>
```

### 9.5 Trade-offs das três abordagens

| | Sem Svelte Context | Com Svelte Context (só) | Híbrida |
|---|---|---|---|
| Caso simples (tudo no mesmo componente) | `movableItem(ctx, opts)` — 1 arg extra | Não é viável sem componentes | `movableItem(opts)` — zero boilerplate |
| Item em child component | Prop drilling manual | Auto-discovery via Context | Auto-discovery via Context |
| Cross-context (teórico) | Possível | Impossível | Possível via override explícito |
| `Movable.get()` necessário | Não — variável direta | Sim — para acessar fora do snippet | Não — mas pode existir como convenience |
| Testabilidade | Explícita — fácil de mockar | Posicional — precisa de componente wrapper no teste | Ambos — testa com arg explícito, usa Context em prod |
| API surface | Simples — sempre explícito | Simples — sempre implícito | Maior — dois caminhos |
| Footgun | Nenhum | Item fora da árvore falha silenciosamente | Item fora da árvore **e** sem arg explícito falha |

### 9.6 Análise: o peso de sempre ter Svelte Context

O Svelte Context tem **zero custo de runtime** — é literalmente um `Map.set()` e `Map.get()`. Não há re-render, não há subscription, não há tracking reativo. O Model já existe; o Context é apenas um ponteiro para ele.

O custo é **conceitual**: uma factory que internamente chama `setContext` esconde um side-effect. O consumidor chama `movableContext()` e, sem saber, registra um valor na árvore de componentes. Isso é magia? Sim — mas é a **mesma magia** que todo Svelte Context usa (stores, router, i18n). O idiom é familiar.

O custo de **não** ter Svelte Context é **transferência de complexidade**: o package fica mais puro, mas o consumidor que precisa distribuir items por múltiplos componentes agora implementa seu próprio mecanismo. O package exporta complexidade que antes absorvia.

### 9.7 Recomendação

**Abordagem híbrida.** Razões:

1. **O caso comum fica mais simples** — `movableItem(opts)` sem precisar passar context quando tudo está no mesmo componente ou em descendentes diretos

2. **O caso avançado continua possível** — `movableItem(ctx, opts)` para cenários onde o arg explícito é necessário (testes, composition patterns incomuns)

3. **Zero custo de ter o Context** — `setContext` é uma operação trivial. Não pagar nada para ter a opção é melhor que forçar o consumidor a reinventar distribuição

4. **Consistência com o ecossistema Svelte** — libraries como Melt UI, Bits UI, e o próprio SvelteKit usam Context extensivamente. Remover Context para "pureza" vai contra o idiom da plataforma

5. **Erro explícito** — se `movableItem()` não recebe argumento e não encontra Context, pode lançar um erro claro: `"movableItem() requires either a MovableContextHandle argument or must be called inside a component that called movableContext()"`. Melhor que falhar silenciosamente

**O que muda na proposta original:**
- `movableContext()` chama `setContext()` internamente — side-effect intencional
- `movableItem()` e `movableSensor()` aceitam context como **primeiro argumento opcional** — se omitido, lêem do Svelte Context
- `Movable.get()` pode ser removido mesmo assim — `movableContext()` já retorna a handle com `activeItemID` e `isOverSensor`

**O que NÃO muda:**
- Factories em vez de componentes
- `{@attach}` em vez de snippet nesting
- Zero instâncias Svelte
- Template flat

---

## 10. Resumo

| Aspecto | Antes | Depois |
|---|---|---|
| Unidades na API | 3 componentes + 1 query fn | 3 factory functions |
| Instâncias Svelte | 3 (Context + Item + Sensor) | 0 |
| Snippet nesting | 2-3 níveis | 0 |
| Svelte Context | Sim (implícito) | Não — contexto explícito via argumento |
| `Movable.get()` | Necessário | Desnecessário — variável direta |
| Rename de `attach` | Sim (conflito no snippet) | Não — cada factory tem seu `.attach` |
| Template do consumidor | 35 linhas (dev page) | 14 linhas |
| Model / Coordinators / Interactions | Intactos | Intactos |
| Testes do Model | Intactos | Intactos |
| Breaking change | — | Sim (major bump) |
