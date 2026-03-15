# Svelte Model View Architecture

> **Documento Vivo:** Esta arquitetura evolui a cada novo pacote criado.
> Ao criar um novo pacote, execute o Checklist de Conformidade (§10).
> Se um padrão estiver ausente ou um novo princípio surgir, adicione-o aqui e atualize o checklist.
> Após qualquer atualização, reavalie os pacotes existentes contra os novos itens.

> **Protocolo de edição:** Durante o desenvolvimento, decisões arquiteturais relevantes para este documento podem ser sinalizadas, mas alterações só devem ser escritas aqui sob ordem explícita do autor.

---

## 0. Filosofia e Motivação

A arquitetura é **MV** (Model–View), inspirada no paradigma adotado pelo Swift/SwiftUI moderno.

- As **Views** e a **composição de componentes** são declarativas — o desenvolvedor descreve *o quê*, não *como*.
- O **Model** é imperativo na gestão interna de estado — muta campos diretamente (`this.#field = newValue`), sem indireções como reducers, actions ou stores. O estado muda por chamadas de método, não por dispatch de eventos.

### Porquê

A motivação central é que um desenvolvedor Apple — ou que goste de desenvolver com Swift/SwiftUI — possa manter o **mesmo modelo mental** de arquitetura, design e naming ao trabalhar em projetos web. Acreditamos que essa base produz simultaneamente boa DX e boa UX, num sistema altamente modular, com módulos pequenos e testáveis, lógicas independentes e boa separação de responsabilidades.

### Princípios Fundacionais

- **Responsabilidade única é imperativo.** Cada unidade faz uma coisa. O Movable tem uma Interaction que lida com a observação de eventos do usuário — essa lógica não vive dentro do Controller.
- **Tudo é plugável e agnóstico sempre que possível.** O Attention Requester é agnóstico de qual animação irá receber. O Controller do Movable é agnóstico de qual Interaction irá receber.
- **TDD não é arquitetura, mas é pressuposto como prática a ser adotada junto com ela.** Testes clássicos (Detroit School), sem mocks desnecessários, testando comportamento real pela API pública.

### Não é MVC

Há Controller, mas **não é MVC**. Aqui o Controller é apenas uma "refatoração" para manter o Model abstrato:
- O **Model** sabe as regras de negócio. O Controller não.
- O **Controller** sabe manipular o DOM (ou outro sistema externo). O Model não.
- O Controller é um **agente do Model**, que obedece suas ordens — não um "mediador" como no MVC clássico.

---

## 1. Views

### Tudo é View

Não há distinção arquitetural entre "Páginas" e "Componentes". Todos são tratados estruturalmente como Views.

### Views são "Burras" (Dumb Views)

Views não tomam decisões de negócio. Sua única responsabilidade é:
1. **Renderizar** o estado vindo do Model
2. **Capturar** a intenção do usuário (cliques, gestos, inputs)

### Nomenclatura Agnóstica

As Views usam nomes internos estritamente ligados à **apresentação** (ex: `isHeroSubtle`, `isBouncingRight`), nunca jargões de negócio ou domínio. A View atua como "tradutora", mapeando a verdade do Model para seu próprio idioma visual:

```ts
// A View traduz — o Model não sabe que "bouncing" existe
const isBouncingRight = $derived(model.step === 1)
```

O Model expõe `step` e `isFinished`. A View decide que `step === 1` significa "quicando para a direita". Isso é **lógica de apresentação**, não lógica de negócio — a View não altera o estado nem decide regras do domínio; ela apenas mapeia um valor semântico do Model para uma representação visual. A distinção:

- **Lógica de negócio** (Model): decidir *quando* e *para qual* step transicionar, sob quais condições.
- **Lógica de apresentação** (View): decidir que `step === 1` se traduz em "quicando para a direita" visualmente.

A View consome o estado como somente-leitura e o interpreta para fins visuais. Ela não toma decisões que afetam o domínio.

---

## 2. Model e Estado

### Fonte Única da Verdade

Os Models contêm tanto o **estado** da aplicação quanto as **regras de negócio** que modificam esse estado. O Model é o único lugar onde regras de negócio vivem. O Controller nunca toma decisões — ele executa ordens.


### Encapsulamento de Estado

**`$state` privado + `$derived` público** é o padrão canônico:

```ts
class ExampleModel {
  // Mutável — privado nativo do JS, não convenção com underscore
  #count = $state(0)

  // Imutável de fora, reativo de dentro
  readonly count = $derived(this.#count)
}
```

Mudar a implementação interna nunca quebra consumidores externos.

### Intenções Tipadas sobre Booleans

Quando um estado pode resultar em **comportamentos qualitativamente diferentes**, o Model expõe uma **union discriminada** em vez de um boolean:

```ts
// ❌ Boolean — o Controller precisa inferir o que fazer
readonly isPaused = $derived(...)

// ✅ Intenção tipada — o Controller recebe a ordem completa
readonly pauseIntent = $derived<PauseIntent>(...)
// PauseIntent = { action: 'freeze' } | { action: 'resume', interval: number } | { action: 'discard' }
```

O Controller recebe a ordem completa, incluindo parâmetros (`interval`), sem precisar inferir nada.

### Sem Singletons Globais

A arquitetura repudia singletons globais na memória. Para **ecossistemas multi-componente** (onde vários componentes precisam compartilhar estado — ex: `MovableContext` + `MovableItem` + `MovableSensor`), instâncias de Models são criadas e injetadas na árvore via **Svelte Context**, garantindo isolamento — múltiplas instâncias podem coexistir sem conflito.

Componentes **autocontidos** (que não precisam de comunicação entre partes — ex: `AttentionRequester`) não precisam de Context. O Model vive internamente no próprio componente.

### Estados Públicos via `$derived`

Propriedades expostas pelo Model para as Views são definidas como `$derived` (sinais cacheados), não getters tradicionais. Isso garante uma API de leitura estável, performática e reativa, evitando recálculos custosos quando múltiplos componentes leem a mesma propriedade.

**Proxies e `$state.snapshot()`:** Objetos declarados com `$state` no Svelte 5 são **Proxies reativos**, não objetos comuns. Dentro do contexto reativo (templates, `$derived`, `$effect`), o Proxy funciona perfeitamente e **deve ser lido diretamente** — é ele que garante a reatividade. O problema surge quando esse Proxy é passado para código que **não espera um Proxy**: bibliotecas externas, APIs nativas do browser, serialização, ou comparações de identidade.

`$state.snapshot()` retorna uma **cópia estática e plana** do estado — um POJO sem rastros do sistema reativo. É uma ferramenta oficial com uso bem definido, não uma gambiarra.

**Quando usar `$state.snapshot()`:**

| Contexto | Usar snapshot? |
|---|---|
| Leitura reativa no template ou `$effect` | ❌ Não — o Proxy é o mecanismo de reatividade |
| Derivações com `$derived` | ❌ Não — o Proxy é o que torna a derivação reativa |
| Passagem para biblioteca externa que não espera Proxy | ✅ Sim |
| `structuredClone`, `JSON.stringify` em classes | ✅ Sim |
| IndexedDB, Web Workers, serialização | ✅ Sim |
| `console.log` para debug | ✅ Recomendado (ou usar `$inspect`) |
| Comparação de identidade com `===` | ✅ Necessário |

**Regra crítica — nunca usar snapshot dentro de derivações:**

```ts
// ❌ ERRADO — o snapshot é estático, $derived nunca vai reatualizar
let intent = $derived($state.snapshot(animation).intent);

// ✅ CORRETO — lê diretamente do Proxy; reativo
let intent = $derived(animation.intent);
```

**Regra prática:** Use `$state.snapshot()` sempre que precisar passar estado reativo para **fora** do contexto reativo do Svelte. **Não use** dentro de derivações, effects ou do template — nesses contextos o Proxy deve ser lido diretamente.

### Delegação: Serviços e Utils

**"Serviço"** é o termo interno para classes que orbitam o Model — recebem ordens dele ou interagem com ambientes externos, ouvindo e trazendo informações de volta para o Model. Os serviços atuais da arquitetura são:

- **Controllers** — gerenciam o ciclo de vida e integridade do elemento no DOM (§3)
- **Interactions** — traduzem eventos de hardware em comandos para o Model (§4)

**"Util"** é uma extração de lógica pura — matemática, cálculos, funções auxiliares — que não tem estado próprio nem interage com o ambiente. Exemplos:
- Extrair a lógica de cálculo de colisão do Model para um módulo de geometria
- Funções reutilizáveis entre pacotes (ex: clamping, interpolação)

A distinção: um Serviço tem **ciclo de vida e dependências**; um Util é uma **função pura sem side effects**.

---

## 3. Controller

### O Gerente de Integridade

O Controller é o **dono da existência do elemento no espaço**. Ele é persistente — vive enquanto o componente existir.

**Responsabilidades:**
- Manter o estado local do DOM (`x`, `y`, dimensões)
- Gerenciar o ciclo de vida (iniciação e destruição)
- Fazer atualizações quando receber notificações do ambiente (`ResizeObserver`)
- Garantir a integridade estrutural (validar se o pai é o Context correto)

**O que o Controller NÃO faz:**
- Tomar decisões de negócio
- Decidir comportamento com base em estado — ele recebe intenções tipadas do Model e faz `switch`

### Resolução Lazy do Alvo

O wrapper do componente pode ser `display: contents` — sem caixa de layout. O Controller **não anima o wrapper**; anima `wrapper.children[0]`. A resolução é feita na **primeira operação**, não na construção, porque o slot pode não estar populado no momento em que o Controller é instanciado.

### Reatividade no Componente

Se uma variável como `controller` ou `el` precisa disparar `$effect`, ela **deve** ser declarada com `$state`. Declarar sem `$state` cria uma dependência silenciosa que nunca reexecuta.

### Comunicação Model→Controller

Toda comunicação Model→Controller segue o paradigma de **observação de estado** (state-observation). O Controller observa o estado reativo do Model (`$state`, `$derived`) e reage via `$effect`. O Model nunca mantém referências a Controllers, nunca chama métodos de Controllers e não tem conhecimento da existência deles.

O Model expõe fatos — estado e intenções tipadas. O Controller interpreta esses fatos e executa side effects no DOM. Múltiplos Controllers podem observar o mesmo Model independentemente.

APIs imperativas expostas ao consumidor (ex: `request(animation)` via `bind:this`) são inputs externos do consumidor para o Model — não constituem comunicação Model→Controller. Command-dispatch direto (`controller.fazerAlgo()`) é reservado exclusivamente para a API imperativa do consumidor (§5), nunca para o fluxo interno Model→Controller.

### Ciclo de Vida e Ownership Reativo

Controllers são classes `.svelte.ts` que observam o estado do Model diretamente via `$effect` no seu construtor. São sempre instanciados dentro de um bloco `$effect` no `<script>` do componente:

```svelte
let node = $state<HTMLElement | null>(null);

$effect(() => {
  if (!node) return;
  const controller = new SomeController(node, model);
  return () => controller.destroy();
});

const action: Action = (n) => { node = n; return {}; };
```

Este padrão é universal — componentes autocontidos e componentes baseados em Context seguem a mesma estrutura. O bloco `$effect` garante ownership reativo: qualquer `$effect` criado internamente pelo Controller herda o escopo do componente e é limpo automaticamente no unmount.

O método `destroy()` do Controller trata apenas cleanup imperativo: animações WAAPI, `requestAnimationFrame`, `ResizeObserver`, timers. O cleanup reativo dos `$effect` internos é automático via ownership do Svelte.

A Svelte action captura a referência ao `HTMLElement`. Ela **não** é dona do ciclo de vida do Controller.

**Regra:** O componente que cria o Controller é responsável por garantir que nada vaze quando ele desmontar. Sem exceções.

**Escape hatch:** Se um Controller precisar ser criado fora de um contexto reativo, ele usa `$effect.root` internamente e o `destroy()` é obrigatório. Esta é a exceção, não o padrão.

O template `<script>` contém apenas: (1) `$effect` que roteia props para o Model, (2) `$effect` que cria e destrói o Controller, (3) a action para captura do node. Nenhum `$effect` no template roteia estado do Model para o Controller — o Controller trata disso internamente.

---

## 4. Interaction

### O Adaptador de Hardware

A Interaction é puramente um **tradutor de hardware**. Ela não sabe sobre coordenadas CSS, porcentagens ou redimensionamento de janela. Ela só sabe que "o mouse desceu", "o mouse moveu" ou "o dedo levantou".

**Responsabilidade:** Capturar a intenção física do usuário e traduzi-la em **comandos** para o Model. Ela diz ao Model: *"O usuário quer mover para a direita"*.

**Natureza:** Plugável e substituível. Hoje existe uma `DragInteraction` (Mouse/Touch). Amanhã pode-se plugar uma `KeyboardInteraction` (setas do teclado) no **mesmo** Model, sem alterar uma linha da lógica de posicionamento ou renderização.

### Barreira Sanitária

Em vez de misturar lógica imperativa (DOM) com declarativa (Model), a Interaction cria uma barreira sanitária. É por causa dessa camada que:
- O **Model** permanece matematicamente puro (testável sem DOM)
- A **View** permanece semanticamente limpa
- Toda a "sujeira" de `addEventListener`, `requestAnimationFrame` e `getBoundingClientRect` vive e morre isolada na Interaction

### Fluxo de Dados

A Interaction comunica-se exclusivamente com o Model. Traduz eventos de hardware (pointer, keyboard, touch) em chamadas de método no Model (`model.beginMove()`, `model.updatePosition()`, `model.endMove()`). Nunca mantém referência ao Controller e nunca chama métodos do Controller.

O Controller observa as mudanças de estado resultantes no Model e aplica-as ao DOM. O fluxo de dados é sempre: **Interaction → Model → Controller**.

Concerns de DOM que não são intenção do usuário (ex: promoção de GPU layer no hover, mudanças de cursor) são responsabilidade do próprio Controller. O Controller pode observar eventos DOM diretamente no seu elemento para esses fins, da mesma forma que observa `ResizeObserver`. Estes não são concerns da Interaction.

### Diferenciação: Controller vs. Interaction

| | Controller | Interaction |
|---|---|---|
| **Papel** | Gerente de integridade | Tradutor de hardware |
| **Sabe sobre** | DOM, CSS, coordenadas, ciclo de vida | Eventos brutos (pointer, keyboard) |
| **Natureza** | Persistente (vive com o componente) | Plugável (substituível sem refatorar) |
| **Exemplo** | `MovableItemController` | `MovableDragInteraction` |

---

## 5. API de Componentes e Padrões de DX

### Flat Named Exports

Famílias de componentes são exportadas como named exports individuais, seguindo o padrão `[Domain][Role]` (ex: `MovableContext`, `MovableItem`, `MovableSensor`). Cada componente tem um nome autocontido que comunica tanto o pacote quanto sua função.

```ts
import { MovableContext, MovableItem, MovableSensor } from '$lib/Movable'
```

### Modifiers (View Modifiers)

O Modifier fornecido pelo componente não é uma "caixa" — é o equivalente de um **View Modifier do SwiftUI** (como `.draggable()`) aplicado via sintaxe de componente. Ele concede superpoderes (física, captura, observação) à View filha sem aprisioná-la visualmente.

- **`display: contents` por padrão:** O Modifier é invisível no layout — não afeta CSS selectors nem a estrutura visual do filho. O desenvolvedor pode escrever CSS como se o Modifier não existisse. Modifiers que precisam de uma caixa de layout real (ex: ponto de ancoragem com `position: relative`, `overflow: hidden`) devem explicitamente optar por `display: flex; width: max-content` e documentar o motivo.
- **Sintaxe vs. Realidade:** O fato de uma View ser escrita "dentro" do componente (ex: `<MovableItem> <MinhaView /> </MovableItem>`) é exigência sintática do Svelte/HTML. Na prática, não existe relação de aprisionamento — a View **absorve** as capacidades do Modifier.

### Padrão Polimórfico (`asChild`): Abertura Progressiva

O padrão `asChild` resolve o dilema fundamental da DX: **Velocidade vs. Controle**.

**Caminho 1 — O Modifier Seguro (padrão):**
Se o desenvolvedor apenas injetar conteúdo, o componente renderiza um invólucro padrão (um `<div>` com `display: contents`). Esse Modifier assume acessibilidade (`role`, `tabindex`), estilos vitais e física. Rota "Plug and Play" para 80% dos casos. Estados efêmeros (`isDragging`, `isMoving`) são acessíveis via parâmetros do snippet `children`.

**Caminho 2 — Inversão de Controle (`asChild`):**
Em layouts onde até mesmo um `<div>` com `display: contents` quebra o design, `asChild` permite que o componente "desista" de renderizar sua própria tag HTML e passe suas capacidades (ações e estados reativos) para a tag do usuário via snippet. Estados efêmeros são igualmente acessíveis neste caminho.

> **Regra de ouro:** *"Use `asChild` apenas quando precisar eliminar o wrapper do DOM."* Ambos os caminhos são **sempre oferecidos** — a API é consistente entre todos os Modifiers. Porém o design com `display: contents` como padrão faz com que `asChild` seja raramente necessário — é um escape hatch de último recurso, não uma escolha rotineira.

**Restrição:** Quando o filho direto é um **componente Svelte** (não um elemento HTML nativo), `use:action` não pode ser aplicado a ele — actions só funcionam em elementos DOM. Nesse caso, o wrapper do Modifier é obrigatório e `asChild` não é viável.

**Tipagem de exclusividade:** `children` e `asChild` não podem coexistir. A exclusividade é uma propriedade do tipo, não validação runtime:

```ts
type Props =
  | { children: Snippet; asChild?: never }
  | { asChild: Snippet<[...]>; children?: never }
```

### API Imperativa via `bind:this`

Componentes exportam métodos diretamente e o pai acessa via `bind:this`. Segue a intuição de `element.animate()` e `input.focus()` — imperativo, direto, sem abstração inventada.

```svelte
<AttentionRequester bind:this={requester} />

<script>
  requester.request(bounceAnimation)
</script>
```

O tipo da instância é exportado com o mesmo nome do componente (`AttentionRequester`).

**Props vs. parâmetros da chamada imperativa:** A decisão é caso a caso. Configurações que **variam entre chamadas** pertencem à chamada imperativa (ex: `request(animation)` — o mesmo componente pode receber animações diferentes em chamadas sucessivas). Configurações que são **fixas para a instância** podem ser props normais.

### Injeção de Estado via Snippets

Estados efêmeros (`isDragging`, `isFocused`, `isOver`) são passados de volta para o usuário via parâmetros do snippet, eliminando a necessidade de variáveis de controle no `<script>`.

### Context como Fronteiras Lógicas

O provedor de contexto (ex: `<MovableContext>`) não renderiza nenhuma tag HTML própria. Sua única função é demarcar um limite na árvore de componentes onde uma instância específica do Model passa a existir. O nome segue o padrão `[Domain]Context` — "Context" comunica influência ambiental: os filhos se adaptam ao contexto em que existem.

- **Injeção de Dependência Natural:** Qualquer View dentro dessa fronteira (não importa a profundidade no DOM) pode consumir o estado via `MovableContext.use()`, eliminando prop drilling.
- **Isolamento:** Permite ecossistemas totalmente isolados na mesma página (ex: painel esquerdo e painel direito que não interferem).
- Atalhos de contexto (ex: `MovableContext.use()`) permitem que componentes independentes (como um HUD) leiam o estado sem cascata de props.

### Design Declarativo como Contrato

A escolha de transformar Context e Modifiers em **componentes `.svelte`** (em vez de funções puras em TypeScript) é intencional:

- **Alinhamento mental:** A hierarquia visual no código reflete a hierarquia de comportamentos. O desenvolvedor vê imediatamente que "tudo dentro desta tag compartilha as mesmas regras físicas".
- **Delegação de ciclo de vida:** O desenvolvedor não precisa se preocupar com `onMount`, `onDestroy` ou memory leaks. Quando o componente é removido da tela (por um `{#if}`, por exemplo), ele desconecta ResizeObservers, limpa instâncias do Model, remove event listeners e libera memória automaticamente.
- **Componente como contrato:** Recebe intenções (ex: `initialPosition="50%"`) e devolve reatividade (ex: `isDragging`), encapsulando toda a manipulação direta do DOM.

---

## 6. Animações e Web Animations API

### Animações são Dados, não Comportamento

O componente é agnóstico de animações. Uma animação declara `name`, `duration`, `keyframes`, `loop`, `interval` e `onInterrupt` — nada mais. O componente cuida do *quando*; a animação cuida do *como*.

### WAAPI sobre CSS Animations

`animation.pause()` e `animation.currentTime` tornam requisitos como pausa exata e retomada operações de uma linha — frágeis com CSS puro. O engine é o mesmo; a diferença é controle imperativo vs. declarativo.

### Keyframes como Funções

Quando uma animação precisa de contexto do elemento no momento do disparo (posição atual, dimensões), `keyframes` é declarado como `(el: HTMLElement) => Keyframe[]`. O Controller invoca a função imediatamente antes de `element.animate()`. Isso permite animações que partem do estado atual do elemento — necessário para o modo `discard`.

### Contrato de Loop Tipado

O contrato de loop é uma union discriminada:
- `ARAnimationLoop` exige `loop: true` e `interval: number`
- `ARAnimationOneShot` proíbe `interval`

TypeScript enforça o contrato na criação, não em runtime.

### Emulação de `init` Distintos (Padrão Swift)

Quando um tipo tem variantes com contratos incompatíveis (parâmetros obrigatórios em uma, proibidos em outra), o padrão é usar **unions discriminadas** para os tipos e **overloads de função** nas fábricas. Cada overload retorna o tipo correto baseado nos parâmetros recebidos — emulando os `init` distintos do Swift, onde o compilador garante que apenas combinações válidas são construíveis.

### `onInterrupt` Pertence à Animação

É uma propriedade do contrato de movimento — `resume` para elementos com posição fixa (Dock), `discard` para elementos flutuantes (Movable). O componente não sabe qual modo está ativo; o Model lê e decide.

### Regras Obrigatórias

- **`fill: 'none'`** — Impede estado residual da animação no elemento após o ciclo terminar. O elemento retorna à posição CSS base automaticamente.
- **`will-change` não é gerenciado imperativamente** — Ao usar WAAPI com `element.animate()`, o browser já sabe que o elemento será animado e promove a camada automaticamente. Adicionar e remover `will-change` no entorno de cada animação é trabalho redundante sem benefício. Em casos excepcionais (elementos muito pesados com animação de duração/delay zero e problema de performance medido), considere `will-change` em CSS estático na classe do elemento — nunca via JavaScript imperativo.
- **Propriedade CSS `translate` separada de `transform`** — Usar `translate` nos keyframes da WAAPI não interfere com `transform: translate3d()` usado por sistemas de posicionamento. As duas propriedades coexistem e se compõem. Isso é intencional.

---

## 7. Filosofia Fail-Safe

Ao contrário da postura de "Falha Rápida" comum na web, a arquitetura adota a filosofia **Apple/Cocoa de Resiliência Silenciosa**:

### Auto-Correção

O sistema assume que o ambiente pode ser hostil (CSS mal configurado, pai estático). Em vez de falhar, detecta erros e aplica correções em tempo de execução:
- Forçar `position: relative` no Context quando ausente
- Aplicar *clamping* quando o layout encolhe e o item ficaria fora dos limites

### Avisos Educativos

O erro não é suprimido, mas transformado em DX. Um `console.warn` explica o problema, mas o software continua funcionando no modo "Best Effort". Nunca `throw new Error` que derrube a renderização da árvore Svelte.

### Prioridade

A **continuidade da experiência do usuário final** está acima da pureza técnica da configuração do desenvolvedor. O software não deve "crashar" por detalhes de CSS.

---

## 8. Física, Geometria e Performance

### Sistema de Coordenadas

- **Cartesiano Único (AABB):** Padronização usando `x, y, width, height` (Axis-Aligned Bounding Box) em todo o software, referenciado sempre a partir do `MovableContext`, ignorando a árvore DOM intermediária.
- **Delta Absoluto:** Movimentos calculados pela diferença entre o clique inicial (`dragStart`) e a posição atual do ponteiro, eliminando drift e acúmulo de erros de ponto flutuante de `event.movementX/Y`.

### Colisão por Projeção (Phantom Rect)

A detecção de colisão não verifica onde o cursor do mouse está, mas projeta matematicamente onde as **bordas do elemento** estarão e verifica a interseção com os Targets.

### Smart Anchor (Responsividade de Estado Duplo)

- **Estado Virgem:** Se a tela redimensionar antes do usuário interagir, o item recalcula sua posição percentual mantendo-se responsivo como CSS puro.
- **Estado Sujo:** Se o usuário já moveu o item, a posição vira absoluta (pixels), mas aplica-se um *clamp* para garantir que ele não seja engolido se a janela diminuir.

### Desacoplamento de Renderização (rAF)

O processamento lógico (alta frequência do mouse, até 1000Hz) é separado da renderização do DOM. O estilo visual (`transform`) só é atualizado sincronizado com a taxa de atualização do monitor via `requestAnimationFrame`.

### VRAM e `will-change`

Com WAAPI, o browser gerencia a promoção de camada automaticamente ao receber `element.animate()` com propriedades de composição (`transform`, `opacity`). Não é necessário adicionar nem remover `will-change` imperativamente — o browser reconhece a intenção de animação e aplica aceleração de hardware por conta própria. Para sistemas baseados em manipulação direta de estilo (ex: `requestAnimationFrame` + atribuição de `transform`), onde o browser não tem como saber que o elemento será animado, `will-change` pode ser adicionado em CSS estático para elementos que animam com frequência.

### Pointer Capture

Uso de `setPointerCapture` para garantir que eventos de movimento e soltura não se percam caso o usuário mova o mouse rápido demais para fora do elemento ou da janela do navegador.

### Isolamento de Animações (Anti-Transform Clash)

O Modifier invisível controlado pelo JS lida com as coordenadas (física via `transform`), enquanto o conteúdo interno lida com animações decorativas (via propriedade CSS `translate`). As duas não conflitam.

---

## 9. Convenção de Nomenclatura de Arquivos

### Prefixo de Domínio

Arquivos são prefixados com o nome do domínio do pacote para namespace safety e discoverability via Cmd+P:

```
AttentionRequesterModel.svelte.ts      — Model (estado + lógica de negócio)
AttentionRequesterController.svelte.ts — Controller (ciclo de vida DOM + execução)
AttentionRequesterModifier.svelte      — Modifier (View Modifier — concede capacidades ao filho)
AttentionRequester.types.ts            — Types e interfaces
index.ts                               — API pública (exports)
```

> **`index.ts` é a exceção:** O bundler resolve `index.ts` automaticamente ao importar um diretório. Renomear para `[domain].index.ts` quebraria essa resolução. O path já desambigua (`Movable/index.ts` vs `AttentionRequester/index.ts`).

### Semântica de Capacidade

Nomes baseados no **domínio e capacidade** (ex: `Movable` — domínio do espaço 2D e geometria), não em APIs legadas da web (ex: `Draggable` — atrelado à API Drag and Drop / DataTransfer).

---

## 10. Checklist de Conformidade

Use este checklist para avaliar se um pacote UI segue a arquitetura MV. Nem todos os itens se aplicam a todos os pacotes — marque **N/A** quando o item não for relevante (ex: Interaction não existe em componentes sem input de hardware).

### Model (§2)
- [ ] Toda lógica de negócio vive no Model — Controller tem zero tomada de decisão
- [ ] Estado mutável usa `#field = $state()` (privado nativo JS, não convenção)
- [ ] Estado público usa `readonly field = $derived(this.#field)`
- [ ] Usa `$state.snapshot()` apenas ao passar estado para fora do contexto reativo (libs externas, serialização, `===`); nunca dentro de `$derived`, `$effect` ou template
- [ ] Comportamentos qualitativamente diferentes usam union discriminada, não boolean
- [ ] Sem singletons globais — instâncias injetadas via Context (multi-componente) ou internas (autocontido)
- [ ] Lógica complexa ou externa extraída para Serviços (Controller, Interaction) ou Utils (funções puras)
- [ ] Variantes com contratos incompatíveis usam unions discriminadas + overloads de fábrica (emulação de `init` distintos do Swift)

### Controller (§3)
- [ ] Nunca toma decisões de negócio — apenas executa ordens do Model
- [ ] Elemento-alvo resolvido de forma lazy (`wrapper.children[0]`), não na construção
- [ ] `will-change` não é gerenciado imperativamente — WAAPI promove camadas automaticamente
- [ ] Variáveis que disparam `$effect` declaradas com `$state`
- [ ] Gerencia ciclo de vida: cleanup de observers e listeners na destruição
- [ ] Comunicação Model→Controller é por observação de estado (`$effect`), nunca command-dispatch interno
- [ ] Instanciado dentro de `$effect` no `<script>` do componente (ownership reativo garantido)
- [ ] Nenhum `$effect` no template roteia estado do Model para o Controller — o Controller observa o Model internamente
- [ ] `destroy()` trata apenas cleanup imperativo (WAAPI, rAF, observers, timers); cleanup reativo é automático

### Interaction (§4)
- [ ] Responsabilidade única: traduzir hardware em comandos para o Model
- [ ] Comunica-se exclusivamente com o Model — nunca referencia ou chama o Controller
- [ ] Fluxo de dados: Interaction → Model → Controller
- [ ] Plugável — pode ser substituída sem alterar Controller ou Model
- [ ] Não sabe sobre CSS, coordenadas ou renderização
- [ ] Toda "sujeira" imperativa (`addEventListener`, `rAF`, `getBoundingClientRect`) isolada aqui

### View (§1)
- [ ] Zero lógica de negócio — apenas renderiza estado e captura intenção do usuário
- [ ] Lógica de apresentação (mapear estado do Model para nomes visuais) é permitida e esperada
- [ ] Usa nomes de apresentação locais, não nomes de domínio do Model
- [ ] Estado efêmero passado via parâmetros de snippet

### API Surface (§5)
- [ ] Exports usam flat named exports com padrão `[Domain][Role]` (ex: `MovableContext`, `MovableItem`)
- [ ] API imperativa via `bind:this` com métodos exportados (não prop `ref`)
- [ ] Tipo da instância exportado com o mesmo nome do componente
- [ ] Parâmetros que variam entre chamadas pertencem à chamada imperativa; fixos por instância podem ser props
- [ ] `asChild` disponível com tipagem union + `never` para exclusividade com `children` — usado apenas como escape hatch de layout, não para acesso a estado
- [ ] Estado efêmero acessível via snippet em ambos os caminhos (`children` e `asChild`)
- [ ] `display: contents` como padrão para Modifiers; `flex + max-content` apenas quando necessário (documentar motivo)
- [ ] Restrição `asChild`: não viável quando filho direto é componente Svelte (actions exigem elemento DOM)
- [ ] Context (`[Domain]Context`) usado como fronteira lógica invisível (sem tag HTML) em ecossistemas multi-componente
- [ ] Componentes `.svelte` delegam ciclo de vida automaticamente (cleanup de observers, listeners, Model)

### Animações (§6) — quando aplicável
- [ ] Animações são objetos de dados (nome, duração, keyframes, loop, onInterrupt), não comportamento
- [ ] WAAPI preferida sobre CSS animations para componentes com estado
- [ ] `fill: 'none'` obrigatório — sem estado residual
- [ ] `will-change` não é gerenciado imperativamente pelo Controller — WAAPI promove camadas automaticamente; CSS estático apenas se houver problema de performance medido
- [ ] Propriedade CSS `translate` usada em keyframes (não `transform`) para evitar clash com posicionamento
- [ ] Contratos tipados como unions discriminadas (ex: loop vs one-shot)

### Resiliência (§7)
- [ ] Auto-corrige ambientes hostis (ex: `position: relative` ausente no Context)
- [ ] Erros são `console.warn` educativo, nunca crash (`throw`)
- [ ] Continuidade da UX do usuário final priorizada sobre pureza técnica

### Performance (§8) — quando aplicável
- [ ] Sistema de coordenadas unificado (AABB) referenciado ao Context
- [ ] Delta absoluto para movimentos (sem `movementX/Y`)
- [ ] Renderização desacoplada via `requestAnimationFrame`
- [ ] `will-change` não gerenciado imperativamente — para WAAPI o browser promove automaticamente; para `rAF` + estilo direto, CSS estático se necessário
- [ ] `setPointerCapture` para continuidade em movimentos rápidos
- [ ] Animações de posição (`transform`) e decorativas (`translate`) não conflitam

### Nomenclatura (§9)
- [ ] Arquivos prefixados com nome do domínio do pacote
- [ ] Sufixos seguem convenção: `Model.svelte.ts`, `Controller.svelte.ts`, `Modifier.svelte`, `[domain].types.ts`, `index.ts`
- [ ] Nomes baseados em capacidade/domínio, não em APIs legadas da web
