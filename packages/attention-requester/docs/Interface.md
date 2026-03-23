# Attention Requester — Interface

> Referência autoritativa da superfície pública de `@headless-uai/attention-requester`.
> Se a implementação diverge deste documento, a implementação está errada.
> Ver também: [Behavioral Specification](Behavioral%20Specification.md)

---

## Descrição

`<AttentionRequester>` anima um elemento HTML para chamar atenção do usuário — bounce, shake, pulse, ou qualquer animação customizada. O componente é headless: não adiciona nós visíveis ao DOM nem aplica estilos (`display: contents`). O consumidor decide _quando_ animar, _qual_ animação usar e _quando_ parar. O componente cuida de playback, pause/resume, loop, reduced-motion e cleanup.

---

## Superfície Pública

Tudo que o consumidor pode importar de `@headless-uai/attention-requester`:

```ts
// Componente
AttentionRequester                        // Svelte component
AttentionRequester.request()              // via bind:this
AttentionRequester.cancel()               // via bind:this

// Props
paused?: boolean
children: Snippet<[{ isAnimating }]>
asChild: Snippet<[{ attach, isAnimating }]>

// Fábricas de animação
PhysicsBounce(config?)
DoubleBounce(config?)

// Tipos
AttentionRequester                        // bind:this type
AttentionRequesterProps
ARAnimationConfig
ARAnimationLoop
ARAnimationOneShot
AttentionRequesterAnimation
AttentionInterruptBehavior
BounceConfig
BounceConfigLoop
BounceConfigOneShot
BounceDirection
```

---

## Índice por Comportamento

1. [Renderizando o componente](#1-renderizando-o-componente)
2. [Disparando uma animação](#2-disparando-uma-animação)
3. [Parando uma animação](#3-parando-uma-animação)
4. [Pausando e retomando](#4-pausando-e-retomando)
5. [Reagindo ao estado de animação](#5-reagindo-ao-estado-de-animação)
6. [Escolhendo ou criando animações](#6-escolhendo-ou-criando-animações)
7. [Suportando reduced motion](#7-suportando-reduced-motion)
8. [Usando com elementos reposicionáveis](#8-usando-com-elementos-reposicionáveis)
9. [Responsabilidades do consumidor](#9-responsabilidades-do-consumidor)

---

## 1. Renderizando o componente

O consumidor renderiza `<AttentionRequester>` de duas formas. Deve usar uma ou outra.

### Modo `children`

O componente envolve o conteúdo em wrapper `<div style="display:contents">` e anexa a animação automaticamente a ele.

```svelte
<AttentionRequester bind:this={attention}>
  {#snippet children({ isAnimating })}
    <div class:active={isAnimating}>Alvo</div>
  {/snippet}
</AttentionRequester>
```

```ts
children: Snippet<[{ isAnimating: boolean }]>
```

### Modo `asChild`

O consumidor decide qual elemento recebe a animação aplicando `attach` como Svelte action. Nenhum wrapper é criado.

```svelte
<AttentionRequester bind:this={attention}>
  {#snippet asChild({ attach, isAnimating })}
    <div use:attach class:active={isAnimating}>Alvo</div>
  {/snippet}
</AttentionRequester>
```

```ts
asChild: Snippet<[{
  attach: (el: HTMLElement) => (() => void) | undefined;
  isAnimating: boolean;
}]>
```

---

## 2. Disparando uma animação

O consumidor chama `request()` via `bind:this`. O componente não decide quando animar.

```ts
request: (
  animation: AttentionRequesterAnimation,
  reducedMotionAnimation?: AttentionRequesterAnimation
) => void
```

```svelte
<script lang="ts">
  import type { AttentionRequester } from "@headless-uai/attention-requester";
  let attention: AttentionRequester;
</script>

<AttentionRequester bind:this={attention}>
  <!-- ... -->
</AttentionRequester>

<button onclick={() => attention.request(PhysicsBounce())}>Animar</button>
```

- **Chamado durante animação ativa:** a chamada é silenciosamente ignorada (no-op). O componente não oferece fila de requisições nem substitui a animação em andamento. Se o consumidor precisa de enfileiramento, substituição, ou qualquer lógica de prioridade, deve implementá-la externamente antes de chamar `request()`.
- Seguro chamar a qualquer momento após montagem.

Comportamentos das animações:

- **One-shot:** toca uma vez, volta para idle.
- **Loop:** toca, espera o intervalo de descanso declarado, repete — até `cancel()` ou destruição do componente.

---

## 3. Parando uma animação

O consumidor chama `cancel()` via `bind:this`. O componente não auto-cancela.

```ts
cancel: () => void
```

O cancelamento é graceful: o ciclo atual termina normalmente, depois o loop não continua. O componente retorna para idle. Não interrompe abruptamente no meio da animação.

- `cancel()` quando idle: no-op.
- `cancel()` múltiplas vezes: seguro (idempotente).
- `cancel()` enquanto pausado: respeita a **estratégia de interrupção** ativa — o ciclo termina no resume, depois para.

---

## 4. Pausando e retomando

O consumidor controla pausa via prop `paused`. O componente expõe `paused` mas não sabe quando o usuário está interagindo — o consumidor faz o bind para o estado relevante (ex: `paused={isMoving}` durante drag).

```ts
paused?: boolean // default: false
```

Setar `paused` para `true` congela a animação visualmente. Setar de volta para `false` retoma conforme a **estratégia de interrupção** declarada pela animação (campo `onInterrupt`). A estratégia é por-animação, não por-componente.

- Pausar quando idle: no-op.
- Toggle rápido de pausa: seguro — nunca causa animações duplicadas ou timers vazados.

### Estratégia `"resume"` (default)

Congela a animação no lugar. Ao retomar, continua de onde parou.

### Estratégia `"discard"`

Congela o elemento na posição computada atual e descarta o ciclo interrompido. Ao retomar, espera o intervalo de descanso, depois inicia um ciclo novo a partir da posição **atual** do elemento.

Ver [§8 — Usando com elementos reposicionáveis](#8-usando-com-elementos-reposicionáveis) para o caso de uso principal de `"discard"`.

---

## 5. Reagindo ao estado de animação

Ambos os modos de renderização expõem `isAnimating` como parâmetro do snippet.

```ts
isAnimating: boolean
```

`true` enquanto um ciclo de animação está ativo — **inclusive enquanto pausado**. Uma animação pausada ainda é considerada ativa; o elemento está congelado no meio do movimento mas não terminou nem foi cancelado. `false` quando idle (após completion, cancelamento, ou durante intervalos de descanso entre ciclos de loop).

O consumidor usa `isAnimating` para decisões de apresentação — aplicar estilos, renderizar variantes, reagir a mudanças.

---

## 6. Escolhendo ou criando animações

Animações são data-driven — o componente é animation-agnostic. O consumidor escolhe qual animação usar e pode trocar a cada chamada sem reconfigurar o componente.

### Animações built-in

#### `PhysicsBounce(config?)`

Bounce único com easing inspirado em arremesso e gravidade. Duração default: 1000ms.

```ts
PhysicsBounce()
PhysicsBounce({ direction: "up", distance: 80 })
PhysicsBounce({ loop: true })
PhysicsBounce({ loop: true, restDuration: 5000 })
```

#### `DoubleBounce(config?)`

Dois bounces onde o segundo tem 66% da amplitude do primeiro. Duração default: 2000ms.

```ts
DoubleBounce({ direction: "left", distance: 50 })
DoubleBounce({ loop: true, restDuration: 2000 })
```

#### Configuração dos bounces

Ambas as animações aceitam a mesma shape de config:

| Campo | Tipo | Default | Descrição |
|---|---|---|---|
| `direction` | `BounceDirection` | `"up"` | Direção do movimento — string cardinal ou vetor 3-eixos |
| `distance` | `number` | `100` | Deslocamento em pixels |
| `duration` | `number` | `1000` / `2000` | Duração do ciclo em ms |
| `onInterrupt` | `"resume" \| "discard"` | `"resume"` | Estratégia de interrupção ao pausar |
| `loop` | `boolean` | `false` | Se a animação repete em loop |
| `restDuration` | `number` | `3000` | Intervalo entre ciclos (só quando `loop: true`) |

#### Direção

```ts
type BounceDirection =
  | "up" | "down" | "left" | "right" | "forward" | "backward"
  | { x?: number; y?: number; z?: number };
```

Strings cardinais mapeiam para vetores unitários (ex: `"up"` → `{ x: 0, y: -1, z: 0 }`). Vetores customizados permitem movimento diagonal ou composto.

### Animações customizadas

O consumidor cria animações próprias conformando a `ARAnimationOneShot` ou `ARAnimationLoop`:

```ts
interface ARAnimationConfig {
  name: string;
  duration: number;
  keyframes: Keyframe[] | ((el: HTMLElement) => Keyframe[]);
  onInterrupt?: "resume" | "discard";
}

// One-shot — loop ausente ou false
interface ARAnimationOneShot extends ARAnimationConfig {
  loop?: false;
}

// Loop — loop obrigatoriamente true, interval obrigatório
interface ARAnimationLoop extends ARAnimationConfig {
  loop: true;
  interval: number;  // duração do descanso entre ciclos, em ms
}
```

Os dois tipos formam uma **discriminated union** via `loop`. O TypeScript garante que `loop: true` exige `interval` — é impossível compilar uma animação com `loop: true` sem declarar o intervalo, e impossível que um `ARAnimationOneShot` receba `loop: true`.

Quando `keyframes` é uma função, recebe o elemento alvo e retorna keyframes dinamicamente — útil para animações que leem a posição atual do elemento para adaptar a layouts dinâmicos.

#### Exemplo: keyframes estáticos

```ts
const shake: ARAnimationOneShot = {
  name: "shake",
  duration: 500,
  keyframes: [
    { translate: "0px 0px", offset: 0 },
    { translate: "-10px 0px", offset: 0.25 },
    { translate: "10px 0px", offset: 0.5 },
    { translate: "-10px 0px", offset: 0.75 },
    { translate: "0px 0px", offset: 1 },
  ],
};

attention.request(shake);
```

#### Exemplo: keyframes como função

A função recebe o elemento e pode ler sua posição atual para construir keyframes relativos. As fábricas built-in (`PhysicsBounce`, `DoubleBounce`) usam essa abordagem internamente.

```ts
import {
  readCurrentTranslate,
  makeTranslate,
};

const adaptiveBounce: ARAnimationOneShot = {
  name: "adaptive-bounce",
  duration: 800,
  keyframes: (el) => {
    const { cx, cy, cz } = readCurrentTranslate(el);
    return [
      { translate: makeTranslate(cx, cy, cz), offset: 0, easing: "ease-out" },
      { translate: makeTranslate(cx, cy - 60, cz), offset: 0.4, easing: "ease-in" },
      { translate: makeTranslate(cx, cy, cz), offset: 1, easing: "ease-out" },
    ];
  },
};
```

---

## 7. Suportando reduced motion

O componente rastreia `prefers-reduced-motion: reduce` automaticamente e dinamicamente. O consumidor não precisa gerenciar essa detecção — mas precisa decidir se fornece uma animação alternativa.

| Cenário | Comportamento |
|---|---|
| Reduced motion ativo, sem fallback | `request()` é suprimido — componente permanece idle |
| Reduced motion ativo, com fallback | Animação fallback toca no lugar da primária |
| Reduced motion alternado enquanto idle | Próximo `request()` escolhe a animação apropriada |
| Reduced motion ativado durante animação | Ciclo atual termina normalmente; loop não continua |

O consumidor fornece o fallback como segundo argumento de `request()`:

```ts
const primary = PhysicsBounce({ distance: 100 });
const subtle = PhysicsBounce({ distance: 10, duration: 2000 });

attention.request(primary, subtle);
```

---

## 8. Usando com elementos reposicionáveis

Quando o elemento alvo pode mudar de posição enquanto a animação está pausada (ex: elementos draggable), o consumidor deve usar a estratégia `"discard"`. Isso garante que ao retomar, a animação reinicia a partir da posição **atual** do elemento — em vez de pular de volta para um ponto de partida obsoleto.

```svelte
<script lang="ts">
  import { AttentionRequester, PhysicsBounce } from "@headless-uai/attention-requester";
  import { Movable } from "@headless-uai/movable";
  import { onMount } from "svelte";

  let attention: AttentionRequester;
  const animation = PhysicsBounce({
    direction: "up",
    loop: true,
    onInterrupt: "discard",
  });

  onMount(() => {
    const timeout = setTimeout(() => attention.request(animation), 4000);
    return () => clearTimeout(timeout);
  });
</script>

<Movable.Root>
  {#snippet asChild({ root })}
    <div use:root class="container">
      <Movable.Item initialPosition={{ x: "50%", y: "50%" }}>
        {#snippet children({ isMoving })}
          <AttentionRequester bind:this={attention} paused={isMoving}>
            <div class="cursor">👆</div>
          </AttentionRequester>
        {/snippet}
      </Movable.Item>
    </div>
  {/snippet}
</Movable.Root>
```

O padrão chave:

- `paused={isMoving}` — animação pausa enquanto o consumidor arrasta.
- `onInterrupt: "discard"` — ao soltar, a animação reinicia da nova posição.

---

## 9. Responsabilidades do consumidor

O componente deliberadamente não faz o seguinte — são responsabilidades do consumidor:

- **Disparar animações.** O componente não decide quando animar. O consumidor chama `request()` no momento apropriado.
- **Cancelar animações.** O componente não auto-cancela. O consumidor chama `cancel()` quando a animação deve parar.
- **Pausar durante interações.** O componente expõe `paused` mas não sabe quando o usuário está interagindo. O consumidor faz o bind para o estado relevante.
- **Estilizar visualmente.** O componente é headless — não aplica estilos no filho. O consumidor estiliza o filho e pode usar `isAnimating` para apresentação condicional.
- **Escolher a animação.** O componente é animation-agnostic. O consumidor seleciona qual animação tocar e configura seus parâmetros.
- **Fornecer fallbacks de reduced motion.** O componente suprime a animação quando reduced motion está ativo mas não fornece fallback padrão. O consumidor decide se passa uma animação alternativa.
