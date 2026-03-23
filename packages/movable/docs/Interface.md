# Movable — Interface

> Referência autoritativa da superfície pública de `@headless-uai/movable`.
> Se a implementação diverge deste documento, a implementação está errada.
> Ver também: [Behavioral Specification](Behavioral%20Specification.md)

---

## Descrição

`Movable` torna elementos arrastáveis dentro de uma área delimitada. O sistema é headless: não adiciona estilos visuais nem controla layout — o consumidor decide como renderizar e estilizar cada elemento. Suporta arrasto por ponteiro e teclado, clamping automático de limites, detecção de colisão com zonas de soltura, filtragem por grupo, posicionamento responsivo com Smart Anchor, e múltiplos itens independentes. Três subcomponentes compõem a API: `Context` (área delimitada), `Item` (elemento arrastável), e `Sensor` (zona de soltura).

---

## Superfície Pública

Tudo que o consumidor pode importar de `@headless-uai/movable`:

```ts
// Namespace
Movable.Context                          // Svelte component — área delimitada
Movable.Item                             // Svelte component — elemento arrastável
Movable.Sensor                           // Svelte component — zona de soltura
Movable.get()                            // query do contexto (dentro da sub-árvore)

// Props — Context
asChild: Snippet<[{ attach, context }]>
children: Snippet<[{ context }]>

// Props — Item
id?: string
initialPosition?: MovableItemPosition
group?: MovableGroup
stepSize?: number
tabindex?: number
asChild: Snippet<[{ attach, isMoving, isFocused }]>
children: Snippet<[{ isMoving, isFocused }]>

// Props — Sensor
id?: string
accepts?: MovableGroup
onDrop?: () => void
asChild: Snippet<[{ attach, isOver }]>
children: Snippet<[{ isOver }]>

// Tipos
MovableContextQuery
MovableContextProps
MovableContextState
MovableItemProps
MovableItemState
MovableSensorProps
MovableSensorState
MovableItemPosition
MovableGroup
PositionValue
```

---

## Índice por Comportamento

1. [Estabelecendo a área delimitada](#1-estabelecendo-a-área-delimitada)
2. [Renderizando elementos arrastáveis](#2-renderizando-elementos-arrastáveis)
3. [Arrastando com ponteiro](#3-arrastando-com-ponteiro)
4. [Movendo com teclado](#4-movendo-com-teclado)
5. [Definindo a posição inicial](#5-definindo-a-posição-inicial)
6. [Usando grupos e zonas de soltura](#6-usando-grupos-e-zonas-de-soltura)
7. [Reagindo ao estado de arrasto](#7-reagindo-ao-estado-de-arrasto)
8. [Consultando estado do contexto](#8-consultando-estado-do-contexto)
9. [Redimensionamento e Smart Anchor](#9-redimensionamento-e-smart-anchor)
10. [Acessibilidade](#10-acessibilidade)
11. [Responsabilidades do consumidor](#11-responsabilidades-do-consumidor)

---

## 1. Estabelecendo a área delimitada

O consumidor renderiza `<Movable.Context>` como raiz. Todo `Item` e `Sensor` deve estar dentro de um `Context`. O elemento raiz funciona como área delimitada — nenhum item pode ser arrastado para além dos seus limites.

### Modo `children`

O componente envolve o conteúdo em wrapper `<div style="display:contents">` e configura a área automaticamente.

```svelte
<Movable.Context>
  {#snippet children({ context })}
    <div class="area">
      <!-- itens e sensores aqui -->
    </div>
  {/snippet}
</Movable.Context>
```

```ts
children: Snippet<[{ context: MovableContextQuery }]>
```

### Modo `asChild`

O consumidor decide qual elemento é a área delimitada aplicando `attach` como action. Nenhum wrapper é criado.

```svelte
<Movable.Context>
  {#snippet asChild({ attach, context })}
    <div {@attach attach} class="area">
      <!-- itens e sensores aqui -->
    </div>
  {/snippet}
</Movable.Context>
```

```ts
asChild: Snippet<[{
  attach: (el: HTMLElement) => (() => void) | undefined;
  context: MovableContextQuery;
}]>
```

O elemento que recebe `attach` deve ser posicionado (`relative`, `absolute`, ou `fixed`). Se for `static`, o sistema corrige automaticamente para `relative` com um aviso no console.

---

## 2. Renderizando elementos arrastáveis

O consumidor renderiza `<Movable.Item>` dentro de um `Context`. Cada item é um elemento independente que pode ser arrastado.

### Modo `children`

O componente cria um wrapper `<div>` com `display: flex`, `width/height: max-content`, e role/tabindex configurados. O item é focável por padrão.

```svelte
<Movable.Item>
  {#snippet children({ isMoving, isFocused })}
    <div class:dragging={isMoving}>Arraste-me</div>
  {/snippet}
</Movable.Item>
```

```ts
children: Snippet<[{
  isMoving: boolean;
  isFocused: boolean;
}]>
```

### Modo `asChild`

O consumidor decide qual elemento é arrastável aplicando `attach`.

```svelte
<Movable.Item id="cursor" initialPosition={{ x: "50%", y: "50%" }}>
  {#snippet asChild({ attach, isMoving, isFocused })}
    <div {@attach attach} class:dragging={isMoving}>Arraste-me</div>
  {/snippet}
</Movable.Item>
```

```ts
asChild: Snippet<[{
  attach: (el: HTMLElement) => (() => void) | undefined;
  isMoving: boolean;
  isFocused: boolean;
}]>
```

### Props de configuração

| Prop | Tipo | Default | Descrição |
|---|---|---|---|
| `id` | `string` | UUID gerado | Identificador único do item dentro do contexto |
| `initialPosition` | `MovableItemPosition` | `{ x: "50%", y: "50%" }` | Posição inicial dentro da área delimitada |
| `group` | `MovableGroup` | `[]` | Grupos aos quais o item pertence (para filtragem de sensores) |
| `stepSize` | `number` | `10` | Deslocamento em pixels por tecla de seta (modo teclado) |
| `tabindex` | `number` | `0` | Ordem de tabulação do elemento |

### Animações pausadas durante arrasto

Enquanto um item está sendo arrastado, todas as animações CSS nos seus elementos descendentes são pausadas automaticamente (`animation-play-state: paused`). Ao soltar, as animações retomam.

---

## 3. Arrastando com ponteiro

O arrasto inicia quando o consumidor pressiona o botão primário do ponteiro sobre um item. Botões secundários (direito, meio) são ignorados.

Durante o arrasto:
- O ponteiro é capturado pelo elemento — eventos continuam mesmo se o cursor sair da área.
- A posição do item segue o ponteiro, clamped aos limites da área delimitada.
- Atualizações visuais são agrupadas por frame de animação — não há repaint a cada evento de ponteiro.
- Se sensores estão presentes, detecção de colisão roda a cada movimento (ver [§6](#6-usando-grupos-e-zonas-de-soltura)).

O arrasto termina ao soltar o botão ou quando a interação é cancelada pelo sistema.

Apenas um item pode ser arrastado por vez. Iniciar arrasto em um item enquanto outro está ativo encerra o arrasto anterior.

---

## 4. Movendo com teclado

Cada item é focável via Tab. O fluxo de interação por teclado:

1. **Foco:** Tab navega até o item. O item expõe `isFocused` quando recebe foco via teclado (`:focus-visible`).
2. **Grab:** Enter ou Space inicia o modo de movimento. O item entra no mesmo estado de "arrastando" que o ponteiro.
3. **Movimento:** Setas movem o item em passos discretos (`stepSize`, default 10px). Cada tecla move em um eixo apenas (horizontal ou vertical). A posição é clamped aos limites. Colisão com sensores é verificada a cada passo.
4. **Release:** Enter, Space, ou Escape encerra o movimento.

Setas sem grab prévio não movem o item — o scroll normal do browser é preservado.

---

## 5. Definindo a posição inicial

O consumidor define a posição inicial via prop `initialPosition`:

```ts
type PositionValue = number | `${number}px` | `${number}%`;

type MovableItemPosition = {
  x: PositionValue;
  y: PositionValue;
};
```

### Formatos suportados

| Formato | Exemplo | Comportamento |
|---|---|---|
| Porcentagem | `"50%"` | Resolvida como fração da dimensão correspondente da área delimitada |
| Pixels (string) | `"120px"` | Offset absoluto em pixels |
| Número | `120` | Offset absoluto em pixels |

### Valores inválidos

Números não-finitos (`NaN`, `Infinity`), strings não-parseáveis, ou tipos que não são `string` nem `number` são substituídos por zero com um aviso no console.

---

## 6. Usando grupos e zonas de soltura

O consumidor renderiza `<Movable.Sensor>` dentro de um `Context` para criar zonas de soltura.

### Renderização

Modo `children` cria um wrapper `<div>` com `display: flex`, `width/height: max-content`:

```svelte
<Movable.Sensor id="drop-zone" onDrop={() => console.log("dropped!")}>
  {#snippet children({ isOver })}
    <div class:highlight={isOver}>Solte aqui</div>
  {/snippet}
</Movable.Sensor>
```

Modo `asChild` delega ao consumidor:

```svelte
<Movable.Sensor id="drop-zone" accepts={["draggable"]} onDrop={handleDrop}>
  {#snippet asChild({ attach, isOver })}
    <div {@attach attach} class:highlight={isOver}>Solte aqui</div>
  {/snippet}
</Movable.Sensor>
```

### Props

| Prop | Tipo | Default | Descrição |
|---|---|---|---|
| `id` | `string` | UUID gerado | Identificador único do sensor |
| `accepts` | `MovableGroup` | `[]` | Grupos aceitos — lista vazia aceita qualquer grupo |
| `onDrop` | `() => void` | — | Callback disparado uma vez quando um item compatível é solto sobre o sensor |

### Filtragem por grupo

```ts
type MovableGroup = string[];
```

Cada item pode pertencer a um ou mais grupos (prop `group`). Cada sensor declara quais grupos aceita (prop `accepts`). A colisão só é reportada se:

- O sensor aceita todos os grupos (lista `accepts` vazia), **ou**
- Pelo menos um grupo do item corresponde a um grupo aceito pelo sensor.

### Estado observável

```ts
isOver: boolean
```

`true` quando o item arrastado está sobre o sensor e passa no filtro de grupo. Apenas um sensor pode estar ativo por vez.

### Callback `onDrop`

O callback dispara exatamente uma vez quando o arrasto termina com o item sobre um sensor compatível. Se nenhum sensor compatível estiver ativo no momento do release, nenhum callback dispara.

---

## 7. Reagindo ao estado de arrasto

Ambos os modos de renderização expõem estado observável nos snippets:

### `Movable.Item`

```ts
isMoving: boolean   // true enquanto o item está sendo arrastado (ponteiro ou teclado)
isFocused: boolean  // true quando o item tem foco via teclado (:focus-visible)
```

No modo `children`, o wrapper default recebe o atributo `data-moving` automaticamente — útil para estilização via CSS:

```css
[data-moving="true"] {
  cursor: grabbing;
}
```

### `Movable.Sensor`

```ts
isOver: boolean     // true quando um item compatível está sobre o sensor
```

No modo `children`, o wrapper default recebe o atributo `data-over`.

O consumidor usa esses estados para decisões de apresentação — aplicar estilos, renderizar variantes, ou controlar componentes filhos (ex: pausar animações durante arrasto).

---

## 8. Consultando estado do contexto

O consumidor pode consultar o estado do contexto de duas formas:

### Via snippet do Context

Os snippets `asChild` e `children` expõem um objeto `context`:

```svelte
<Movable.Context>
  {#snippet asChild({ attach, context })}
    <div {@attach attach}>
      {#if context.isOverSensor("sensor-id")}
        <p>Item sobre o sensor!</p>
      {/if}
    </div>
  {/snippet}
</Movable.Context>
```

### Via `Movable.get()`

Componentes dentro da sub-árvore de um `Context` podem obter o mesmo objeto via `Movable.get()`:

```svelte
<script lang="ts">
  import { Movable } from "@headless-uai/movable";
  const context = Movable.get();
</script>

<div class:active={context.isOverSensor("drop-zone")}>
  <!-- ... -->
</div>
```

### Interface do objeto de consulta

```ts
interface MovableContextQuery {
  /** Verifica se um item arrastado está sobre o sensor com o ID fornecido. */
  isOverSensor(id: string): boolean;
  /** ID do item atualmente sendo arrastado, ou null se nenhum arrasto está ativo. */
  readonly activeItemID: string | null;
}
```

---

## 9. Redimensionamento e Smart Anchor

O sistema usa duas estratégias de posicionamento dependendo de se o usuário já interagiu com o item:

### Estado virgem (antes do primeiro arrasto)

- A posição inicial é re-resolvida quando a área delimitada é redimensionada.
- Posições em porcentagem reposicionam proporcionalmente às novas dimensões.
- Posições absolutas mantêm o valor absoluto (sujeitas a clamping).

### Estado sujo (após o primeiro arrasto)

- A posição absoluta em pixels é clamped aos novos limites.
- O item nunca reverte para posicionamento por porcentagem após ser arrastado.
- Isso evita que o item "salte" para uma posição resolvida por porcentagem depois que o usuário o colocou deliberadamente em outro lugar.

A transição de virgem para sujo é permanente e ocorre no primeiro arrasto.

---

## 10. Acessibilidade

O sistema provê uma base de acessibilidade automática:

- Cada item recebe `aria-roledescription="draggable"`.
- O atributo `aria-grabbed` reflete se o item está sendo movido (ponteiro ou teclado).
- Um live region anuncia automaticamente eventos de grab, release, e proximidade de sensores.
- Instruções de teclado são associadas via `aria-describedby`.

O consumidor é responsável pelo estilo visual de foco (ver [§11](#11-responsabilidades-do-consumidor)).

---

## 11. Responsabilidades do consumidor

O sistema deliberadamente não faz o seguinte — são responsabilidades do consumidor:

- **Estilizar o foco visual.** O sistema suprime o focus ring default. O consumidor deve aplicar seu próprio estilo de foco usando `isFocused` do snippet ou o atributo `data-moving` no CSS. Exemplo: `[data-moving="false"]:focus-visible { outline: 2px solid blue; }`.
- **Estilizar o estado de arrasto.** O sistema é headless — não aplica estilos visuais. O consumidor usa `isMoving`, `isFocused`, e `isOver` para apresentação condicional.
- **Posicionar a área delimitada.** O elemento raiz deve ter `position: relative`, `absolute`, ou `fixed`. Se for `static`, o sistema corrige para `relative` com aviso — mas o consumidor deve declarar explicitamente.
- **Manter itens como filhos diretos do layout.** Itens devem ser filhos diretos da área delimitada sem elementos posicionados intermediários. Elementos intermediários posicionados distorcem o sistema de coordenadas e causam erro.
- **Reagir a drops.** O sistema detecta colisão e dispara `onDrop`, mas o que acontece após o drop é responsabilidade do consumidor (remover item, alterar estado, etc.).
- **Coordenar com animações.** Quando o item alvo tem animações que devem pausar durante arrasto, o consumidor pode usar `isMoving` para controlar componentes de animação (ex: `paused={isMoving}` no `AttentionRequester`). Animações CSS nos descendentes são pausadas automaticamente.
