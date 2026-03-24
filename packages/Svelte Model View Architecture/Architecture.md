# Svelte Model View Architecture

> **Documento Vivo:** Esta arquitetura evolui a cada novo pacote criado.
> Ao criar um novo pacote, execute o [Checklist de Conformidade (§14)](Checklist.md).
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

- **Responsabilidade única é imperativo.** Cada unidade faz uma coisa. O Movable tem uma Interaction que lida com a observação de eventos do usuário — essa lógica não vive dentro do Coordinator.
- **Tudo é plugável e agnóstico sempre que possível.** O Attention Requester é agnóstico de qual animação irá receber. O Coordinator do Movable é agnóstico de qual Interaction irá receber.
- **TDD não é arquitetura, mas é pressuposto como prática a ser adotada junto com ela.** A prática de TDD segue o ciclo **Red → Green → Refactor** do Extreme Programming: escrever um teste que falha (Red), escrever o mínimo de código para fazê-lo passar (Green), e refatorar mantendo todos os testes verdes (Refactor). Testes clássicos (Detroit School), sem mocks desnecessários, testando comportamento real pela API pública.

### Não é MVC

Há Coordinator, mas **não é MVC**. O nome vem diretamente do `UIViewRepresentable.Coordinator` do SwiftUI — o objeto que faz bridge entre o mundo declarativo (SwiftUI) e o imperativo (UIKit/AppKit). O Coordinator desta arquitetura faz o mesmo papel: bridge entre o Model declarativo e o DOM imperativo. Ele não decide — ele obedece.

- O **Model** sabe as regras de negócio. O Coordinator não.
- O **Coordinator** sabe manipular o DOM (ou outro sistema externo). O Model não.
- O Coordinator é um **agente do Model**, que obedece suas ordens — não um "mediador" como no MVC clássico.

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

### Separação Script / Template

Toda **regra de apresentação** — derivações, mapeamentos, condicionais — vive no `<script>`. O template contém apenas:
1. **Markup estrutural** — a hierarquia de elementos HTML
2. **Bindings reativos** — a ponte de comunicação entre script e template

Os bindings não contêm regras; são canais que transportam decisões já tomadas no script para o markup. A regra vive no `$derived`; o binding apenas entrega o resultado:

```svelte
<script>
  // A regra vive aqui — é lógica de apresentação no script
  const isBouncingRight = $derived(model.step === 1)
</script>

<!-- O template só recebe o resultado via binding — sem regras -->
<div class:isBouncingRight>...</div>
```

O `class:isBouncingRight` não é uma regra — é um canal. A *decisão* de que `step === 1` significa "quicando para a direita" já foi tomada no script. O template apenas reflete essa decisão no DOM.

**O que é regra (vive no script):**
- Derivações: `const isVisible = $derived(model.count > 0)`
- Mapeamentos: `const variant = $derived(model.step === 1 ? 'bounce' : 'idle')`
- Qualquer expressão condicional que interpreta o estado do Model

**O que é estrutura (vive no template):**
- Hierarquia de elementos: `<div>`, `<section>`, `<span>`
- Bindings reativos que conectam script ao DOM: `class:isVisible`, `{@attach handle.modifier}`
- Renderização condicional de **estrutura**: `{#if showPanel}` (quando a presença/ausência de um bloco de HTML é a decisão, não uma regra sobre um atributo)

A distinção é sutil mas importante: o template decide **o quê** existe no DOM (estrutura), o script decide **como** cada elemento se apresenta (regras). O binding é o mensageiro entre os dois.

---

## 2. Model e Estado

### Fonte Única da Verdade

Os Models contêm tanto o **estado** da aplicação quanto as **regras de negócio** que modificam esse estado. O Model é o único lugar onde regras de negócio vivem. O Coordinator nunca toma decisões — ele executa ordens.


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
// ❌ Boolean — o Coordinator precisa inferir o que fazer
readonly isPaused = $derived(...)

// ✅ Intenção tipada — o Coordinator recebe a ordem completa
readonly pauseIntent = $derived<PauseIntent>(...)
// PauseIntent = { action: 'freeze' } | { action: 'resume', interval: number } | { action: 'discard' }
```

O Coordinator recebe a ordem completa, incluindo parâmetros (`interval`), sem precisar inferir nada.

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
| Estado declarado com `$state.raw` | ❌ Não — `$state.raw` armazena o objeto puro, sem Proxy |
| Passagem para biblioteca externa que não espera Proxy | ✅ Sim (apenas para `$state`, não `$state.raw`) |
| `structuredClone`, `JSON.stringify` em classes | ✅ Sim (apenas para `$state`, não `$state.raw`) |
| IndexedDB, Web Workers, serialização | ✅ Sim (apenas para `$state`, não `$state.raw`) |
| `console.log` para debug | ✅ Recomendado (ou usar `$inspect`) |
| Comparação de identidade com `===` | ✅ Necessário (apenas para `$state`, não `$state.raw`) |

**Regra crítica — nunca usar snapshot dentro de derivações:**

```ts
// ❌ ERRADO — o snapshot é estático, $derived nunca vai reatualizar
let intent = $derived($state.snapshot(animation).intent);

// ✅ CORRETO — lê diretamente do Proxy; reativo
let intent = $derived(animation.intent);
```

**Regra prática:** Use `$state.snapshot()` sempre que precisar passar estado reativo para **fora** do contexto reativo do Svelte. **Não use** dentro de derivações, effects ou do template — nesses contextos o Proxy deve ser lido diretamente.

### `$state.raw` para Objetos Imutáveis por Design

Objetos que são **substituídos por inteiro** (nunca mutados internamente) devem usar `$state.raw` em vez de `$state`. `$state.raw` fornece reatividade de reassignment sem criar um Proxy profundo — eliminando overhead desnecessário para objetos grandes ou complexos que jamais serão mutados campo a campo.

```ts
// ❌ $state cria Proxy profundo — overhead sem benefício se o objeto nunca é mutado
#animation = $state<ARAnimation | null>(null);

// ✅ $state.raw — reativo no reassignment, sem Proxy
#animation = $state.raw<ARAnimation | null>(null);
```

**Quando usar `$state.raw`:**
- Objetos de configuração declarados pelo consumidor e passados ao Model (animações, keyframes, opções)
- Dados imutáveis recebidos de APIs externas
- Qualquer estado onde a atualização é sempre por **substituição completa**, nunca por mutação de propriedades internas

**Quando NÃO usar:** estado que precisa de reatividade granular (mutação de propriedades individuais como `model.x = 10`). Nesses casos, `$state` com Proxy profundo é necessário.

**Relação com `$state.snapshot()`:** `$state.raw` armazena o objeto puro — sem Proxy. Portanto, `$state.snapshot()` é **desnecessário** para valores declarados com `$state.raw`. Snapshot existe para extrair um POJO de um Proxy reativo; se não há Proxy, não há o que extrair.

### Delegação: Serviços e Utils

**"Serviço"** é o termo interno para classes que orbitam o Model — recebem ordens dele ou interagem com ambientes externos, ouvindo e trazendo informações de volta para o Model. Os serviços atuais da arquitetura são:

- **Coordinators** — gerenciam o ciclo de vida e integridade do elemento no DOM (§3)
- **Interactions** — traduzem eventos de hardware em comandos para o Model (§4)

**"Util"** é uma extração de lógica pura — matemática, cálculos, funções auxiliares — que não tem estado próprio nem interage com o ambiente. Exemplos:
- Extrair a lógica de cálculo de colisão do Model para um módulo de geometria
- Funções reutilizáveis entre pacotes (ex: clamping, interpolação)

A distinção: um Serviço tem **ciclo de vida e dependências**; um Util é uma **função pura sem side effects**.

---

## 3. Coordinator

### O Gerente de Integridade

O Coordinator é o **dono da existência do elemento no espaço**. Ele é persistente — vive enquanto o componente existir.

**Responsabilidades:**
- Manter o estado local do DOM (`x`, `y`, dimensões)
- Gerenciar o ciclo de vida (iniciação e destruição)
- Fazer atualizações quando receber notificações do ambiente (`ResizeObserver`)
- Garantir a integridade estrutural (validar se o pai é o Context correto)

**O que o Coordinator NÃO faz:**
- Tomar decisões de negócio
- Decidir comportamento com base em estado — ele recebe intenções tipadas do Model e faz `switch`

### Resolução Direta do Alvo

O Coordinator recebe o elemento diretamente via `{@attach}` — não há wrapper intermediário. O elemento passado ao Coordinator é o próprio elemento-alvo, eliminando a necessidade de resolução indireta via `wrapper.children[0]`.

### Reatividade no Componente

Se uma variável como `coordinator` ou `el` precisa disparar `$effect`, ela **deve** ser declarada com `$state`. Declarar sem `$state` cria uma dependência silenciosa que nunca reexecuta.

### Comunicação Model→Coordinator

Toda comunicação Model→Coordinator segue o paradigma de **observação de estado** (state-observation). O Coordinator observa o estado reativo do Model (`$state`, `$derived`) e reage via `$effect`. O Model nunca mantém referências a Coordinators, nunca chama métodos de Coordinators e não tem conhecimento da existência deles.

O Model expõe fatos — estado e intenções tipadas. O Coordinator interpreta esses fatos e executa side effects no DOM. Múltiplos Coordinators podem observar o mesmo Model independentemente.

APIs imperativas expostas ao consumidor (ex: `request(animation)` via `bind:this`) são inputs externos do consumidor para o Model — não constituem comunicação Model→Coordinator. Command-dispatch direto (`coordinator.fazerAlgo()`) é reservado exclusivamente para a API imperativa do consumidor (§5), nunca para o fluxo interno Model→Coordinator.

### Ciclo de Vida e Ownership Reativo

Coordinators são classes `.svelte.ts` que observam o estado do Model diretamente via `$effect` no seu construtor. São sempre instanciados via `{@attach ...}` no template do componente:

```svelte
<div {@attach (el) => {
  const coordinator = new SomeCoordinator(el, model);
  return () => coordinator.destroy();
}}>...</div>
```

Este padrão é universal — componentes autocontidos e componentes baseados em Context seguem a mesma estrutura. O attachment é totalmente reativo: se `model` mudar, a função re-executa (destruindo o Coordinator anterior e criando um novo). O cleanup retornado é chamado automaticamente no unmount ou na re-execução.

> **`{@attach ...}` sobre `use:action`:** A partir do Svelte 5.29, `{@attach ...}` é a API oficial para associar lógica a elementos DOM. Ao contrário de `use:action`, attachments são totalmente reativos — re-executam quando suas dependências mudam. O padrão anterior com `use:action` + `$state<HTMLElement | null>` + `$effect` para captura de node é substituído por uma única expressão `{@attach}` que unifica captura do elemento e ciclo de vida do Coordinator no mesmo lugar, eliminando o estado intermediário.

O método `destroy()` do Coordinator trata apenas cleanup imperativo: animações WAAPI, `requestAnimationFrame`, `ResizeObserver`, timers. O cleanup reativo dos `$effect` internos é automático via ownership do Svelte.

**Regra:** O componente que cria o Coordinator é responsável por garantir que nada vaze quando ele desmontar. Sem exceções.

**Escape hatch:** Se um Coordinator precisar ser criado fora de um contexto reativo, ele usa `$effect.root` internamente e o `destroy()` é obrigatório. Esta é a exceção, não o padrão.

O bloco `<script>` contém apenas: (1) instanciação do Model via factory, (2) regras de apresentação como `$derived`, e (3) `$effect` que roteia props para o Model. O ciclo de vida do Coordinator é declarado no template via `{@attach}`. Nenhum `$effect` no `<script>` roteia estado do Model para o Coordinator — o Coordinator trata disso internamente.

### Gerenciamento de Lifetime: `$effect` como Structured Concurrency

JavaScript no browser é single-threaded — não existe concorrência real. O problema que o Swift Structured Concurrency resolve — garantir que trabalho assíncrono não vaza além do seu escopo de vida — existe em JS, mas é resolvido por um mecanismo diferente.

Para esta arquitetura, **`$effect` + cleanup é o equivalente funcional e suficiente**. A garantia é a mesma:

| Swift Structured Concurrency | Svelte `$effect` + cleanup |
|---|---|
| `Task` cancellation ao sair do escopo | `return () => destroy()` no `$effect` |
| Trabalho não sobrevive ao seu contexto | Observers/animações não sobrevivem ao unmount |
| Hierarquia de cancelamento automática | Cadeia de cleanup composta em `$effect`s aninhados |

Para uma lib de componentes, a regra é simples: **nenhum trabalho assíncrono iniciado por um Coordinator sobrevive ao seu unmount**. O `$effect` cleanup enforça isso automaticamente — não é uma limitação do ecossistema, é o padrão correto e completo para este contexto.

### Disciplina de Primitivos Reativos

`$effect` é um escape hatch — os próprios docs do Svelte descrevem assim. Toda ocorrência no código de aplicação precisa ser justificável por uma de duas razões:

1. **Side effect de DOM** — algo que deve acontecer *depois* das atualizações do DOM (animação, foco, medição).
2. **Sincronização com sistema externo** — integração com algo fora do grafo reativo do Svelte (WebSocket, WAAPI, `ResizeObserver`, `requestAnimationFrame`).

Se um `$effect` está sendo usado para *derivar* ou *sincronizar estado*, a lógica pertence a `$derived` ou `$derived.by`.

#### `untrack()`

`untrack(fn)` impede que leituras de `$state` dentro de `fn` sejam registradas como dependências do `$effect` ou `$derived` envolvente. É uma API oficial do Svelte — não uma gambiarra.

```ts
import { untrack } from 'svelte';

$effect(() => {
  // re-executa quando `data` muda, NÃO quando `time` muda
  save(data, { timestamp: untrack(() => time) });
});
```

**Quando é correto:** quando se precisa de um *snapshot* de um valor no momento em que o effect executa, mas mudanças nesse valor não devem re-disparar o effect.

**Quando é sinal de problema:** se o valor envolto em `untrack` logicamente *deveria* disparar uma re-execução, a estrutura do grafo reativo está errada. `untrack` quebra uma dependência que genuinamente não se quer — não suprime re-runs inconvenientes.

**Regra:** toda chamada a `untrack` merece um comentário explicando *por que* o valor não deve ser uma dependência. Sem o comentário, leitores futuros não conseguem distinguir design intencional de supressão acidental.

#### `$effect.root`

Cria um escopo reativo **não rastreado, sem auto-cleanup**. Retorna uma função `destroy()` que deve ser chamada manualmente.

```ts
const destroy = $effect.root(() => {
  $effect(() => { /* trabalho reativo */ });
  return () => { /* cleanup */ };
});
```

É o mecanismo correto quando efeitos precisam existir **fora do ciclo de vida de um componente** — por exemplo, dentro de um Model ou Coordinator instanciado como classe. Permite que effects sejam criados fora da fase de inicialização do componente.

**Obrigação de ciclo de vida:** como não há auto-cleanup, o `destroy()` retornado deve ser chamado no método `destroy()` do objeto dono. Esquecer é um memory leak — subscriptions reativas continuam ativas, referências ao DOM são mantidas. Tratar como obrigação de primeira classe, não detalhe de implementação.

#### Efeitos Aninhados

Svelte permite `$effect` dentro de outro `$effect`, desde que o effect filho seja criado enquanto o pai está executando. O ciclo de vida do filho é **atrelado ao pai**: o filho é destruído e recriado toda vez que o pai re-executa.

Isso é legítimo, mas tem custo oculto: se o pai tem dependências de granularidade grossa e o setup do filho é custoso (cria listeners, inicia animações, aloca recursos), o custo de reconstrução é pago em cada re-execução do pai. Preferir narrowing das dependências do pai ou elevar o effect filho para um escopo mais estável.

**Anti-padrão:** pai e filho lendo/escrevendo a mesma dependência cria ciclos de atualização infinitos.

---

## 4. Interaction

### O Adaptador de Hardware

A Interaction é puramente um **tradutor de hardware**. Ela não sabe sobre coordenadas CSS, porcentagens ou redimensionamento de janela. Ela só sabe que "o mouse desceu", "o mouse moveu" ou "o dedo levantou".

**Responsabilidade:** Capturar a intenção física do usuário e traduzi-la em **informações** para o Model. Ela fornece ao Model os dados que ele precisa para atualizar seu estado interno.

**Natureza:** Plugável e substituível. Hoje existe uma `DragInteraction` (Mouse/Touch). Amanhã pode-se plugar uma `KeyboardInteraction` (setas do teclado) no **mesmo** Model, sem alterar uma linha da lógica de posicionamento ou renderização.

### Relacionamento entre os Três Módulos

> A Interaction traduz input de hardware em informações no formato que o Model espera (o protocolo da Interaction). O Model recebe essas informações e atualiza seu estado interno conforme suas regras de negócio. O Coordinator observa o estado do Model e aplica as mudanças ao DOM. Nenhum módulo fala diretamente com os outros dois — o Model é a única ponte entre Interaction e Coordinator.

O ponto crítico: a Interaction fornece **informações** (não comandos), o Model **atualiza estado** (não a Interaction), e o Coordinator **observa** (não recebe). O fluxo não é de chamadas — é de dados.

### Barreira Sanitária

Em vez de misturar lógica imperativa (DOM) com declarativa (Model), a Interaction cria uma barreira sanitária. É por causa dessa camada que:
- O **Model** permanece matematicamente puro (testável sem DOM)
- A **View** permanece semanticamente limpa
- Toda a "sujeira" de `addEventListener`, `requestAnimationFrame` e `getBoundingClientRect` vive e morre isolada na Interaction

### Assinaturas Agnósticas de Método

O Model nunca deve ter parâmetros que identifiquem a fonte de input (coordenadas de ponteiro, teclas pressionadas, etc.). Se um método do Model recebe `pointerX` ou `keyCode`, ele está acoplado ao hardware — o que contradiz o papel da Interaction como barreira sanitária.

A Interaction é responsável por transformar dados de hardware em dados agnósticos (posições absolutas, deltas, flags) antes de passá-los ao Model. O Model recebe apenas o *resultado semântico* dessa transformação, nunca o input bruto.

```ts
// ❌ Acoplado ao hardware — o Model sabe que existe um ponteiro
model.updatePosition(event.clientX, event.clientY)

// ✅ Agnóstico — a Interaction já transformou os dados brutos
model.changed({ x: 320, y: 180 })
```

> **Nota:** os nomes de métodos acima são pseudo-código ilustrativo — não refletem a API de nenhum pacote específico.

### Fluxo de Dados

A Interaction comunica-se exclusivamente com o Model. Traduz eventos de hardware (pointer, keyboard, touch) em chamadas de método no Model — por exemplo, sinalizando início, atualização e fim de uma interação. Nunca mantém referência ao Coordinator e nunca chama métodos do Coordinator.

O Coordinator observa as mudanças de estado resultantes no Model e aplica-as ao DOM. O fluxo de dados é sempre: **Interaction → Model → Coordinator**.

Concerns de DOM que não são intenção do usuário (ex: promoção de GPU layer no hover, mudanças de cursor) são responsabilidade do próprio Coordinator. O Coordinator pode observar eventos DOM diretamente no seu elemento para esses fins, da mesma forma que observa `ResizeObserver`. Estes não são concerns da Interaction.

### Integração Reativa com `createSubscriber`

`createSubscriber` (de `svelte/reactivity`) é a API idiomática do Svelte para integrar fontes externas de eventos no grafo reativo. É o encaixe semântico perfeito para a camada Interaction — permite que getters de estado derivado de eventos externos (pointer, keyboard, `ResizeObserver`, `IntersectionObserver`, WebSocket) participem do sistema reativo **sem precisar de `$effect` explícito** para registrar/desregistrar listeners.

```ts
// Pseudo-código ilustrativo — demonstra o padrão, não a implementação real.
import { createSubscriber } from 'svelte/reactivity';

class SomeInteraction {
  #isActive = $state(false);

  #subscribe = createSubscriber((update) => {
    const onStart = () => { this.#isActive = true; update(); };
    const onEnd = () => { this.#isActive = false; update(); };
    window.addEventListener('pointerdown', onStart);
    window.addEventListener('pointerup', onEnd);
    return () => {
      window.removeEventListener('pointerdown', onStart);
      window.removeEventListener('pointerup', onEnd);
    };
  });

  get isActive() {
    this.#subscribe(); // torna o getter reativo
    return this.#isActive;
  }
}
```

A integração com sistemas externos fica declarativa e o teardown é automático quando nenhum effect lê o getter. Interactions que hoje dependem de `$effect.root` ou `addEventListener` explícito para setup/teardown de listeners podem ser simplificadas com `createSubscriber`, tornando o código mais idiomático e a natureza plugável da Interaction mais evidente.

### Diferenciação: Coordinator vs. Interaction

| | Coordinator | Interaction |
|---|---|---|
| **Papel** | Gerente de integridade | Tradutor de hardware |
| **Sabe sobre** | DOM, CSS, coordenadas, ciclo de vida | Eventos brutos (pointer, keyboard) |
| **Natureza** | Persistente (vive com o componente) | Plugável (substituível sem refatorar) |
| **Exemplo** | `MovableItemCoordinator` | `MovableDragInteraction` |

### Contratos de Interface: A Porta, não a Chave

Quando a Interaction é plugável, o contrato tipado deve ser **definido pelo consumidor da interface — não pelo fornecedor**. O Model declara o que ele precisa; as implementações se conformam a isso.

```ts
// Pseudo-código ilustrativo — não reflete a API real de nenhum pacote.
// O contrato vive no módulo do pacote — definido pelo que o Model precisa.
// O Model define e implementa esta interface; as Interactions a recebem como parâmetro.
interface MovableInteraction {
  began(point: Point): void   // Interaction chama → Model executa
  changed(point: Point): void // Interaction chama → Model executa
  ended(): void               // Interaction chama → Model executa
}
```

`DragInteraction` e `KeyboardInteraction` **conformam-se a** `MovableInteraction` — recebem o protocolo como parâmetro e chamam seus métodos para comunicar informações ao Model. O Model é quem *implementa* (provê) a interface; as Interactions são quem a *consomem*. A interface não sabe que essas classes existem, nem precisa. Cada pacote define sua própria interface de Interaction, mínima e local ao módulo que a consome. Não existe um tipo global `Interaction` compartilhado entre pacotes — isso criaria acoplamento desnecessário e forçaria interfaces mais genéricas do que o necessário.

**Analogia Swift:** protocols são definidos pelo *consumidor* — `protocol MovableInteraction` vive no módulo `Movable`, não no módulo `DragInteraction`. A conformação é retroativa: `DragInteraction` pode ser escrita sem saber que `MovableModel` existe.

---

## 5. API de Componentes e Padrões de DX

### Flat Named Exports

Famílias de componentes são exportadas como named exports individuais, seguindo o padrão `[Domain][Role]` (ex: `MovableContext`, `MovableItem`, `MovableSensor`). Cada export tem um nome autocontido que comunica tanto o pacote quanto sua função.

```ts
import { MovableContext, MovableItem, MovableSensor } from '$lib/Movable'
```

### Modifiers como Factories (View Modifiers)

Modifiers são **sempre factory functions** — nunca componentes wrapper. A factory retorna um handle com `.modifier` e propriedades reativas de estado. O consumidor aplica `{@attach handle.modifier}` diretamente no seu elemento, sem nenhuma camada intermediária no DOM.

Este é o equivalente de um **View Modifier do SwiftUI** (como `.draggable()`): concede superpoderes ao elemento sem alterar a árvore de componentes.

```svelte
<script>
  const item = MovableItem()
</script>

<div {@attach item.modifier}>
  Conteúdo movível
</div>
```

**Vantagens sobre wrappers:**
- **Zero overhead de componente** — não existe instância de componente, mount/destroy separado, nem elemento intermediário no DOM
- **Sem impacto no layout** — o elemento do consumidor é o próprio alvo; não há wrapper `display: contents` que possa interferir com CSS selectors, flexbox gaps, ou grid
- **Composição natural** — múltiplos modifiers no mesmo elemento são aplicados com múltiplos `{@attach}`, sem aninhamento artificial:

```svelte
<div {@attach item.modifier} {@attach attention.modifier}>
  Conteúdo com múltiplas capacidades
</div>
```

### API Imperativa via Handle

A factory retorna um handle com métodos imperativos e estado reativo. O consumidor interage diretamente com o handle no `<script>` — sem necessidade de `bind:this`.

```svelte
<script>
  const attention = AttentionRequester()

  function onClick() {
    attention.request(bounceAnimation)
  }
</script>

<div {@attach attention.modifier} onclick={onClick}>...</div>
```

O handle é o único ponto de interação entre o consumidor e o Modifier. Ele expõe:
- **Métodos imperativos** para ações que variam entre chamadas (ex: `request(animation)`, `cancel()`)
- **Estado reativo derivado** para a View consumir (ex: `attention.isAnimating`, `item.isMoving`)

O estado reativo do handle é consumido no `<script>` da View como qualquer outro estado — via `$derived` para regras de apresentação, com bindings no template apenas como ponte:

```svelte
<script>
  const item = MovableItem()
  const isActive = $derived(item.isMoving)
</script>

<div {@attach item.modifier} class:isActive>...</div>
```

### Context como Fronteiras Lógicas

O provedor de contexto (ex: `<MovableContext>`) não renderiza nenhuma tag HTML própria. Sua única função é demarcar um limite na árvore de componentes onde uma instância específica do Model passa a existir. O nome segue o padrão `[Domain]Context` — "Context" comunica influência ambiental: os filhos se adaptam ao contexto em que existem.

- **Injeção de Dependência Natural:** Qualquer View dentro dessa fronteira (não importa a profundidade no DOM) pode consumir o estado via `MovableContext.use()`, eliminando prop drilling.
- **Isolamento:** Permite ecossistemas totalmente isolados na mesma página (ex: painel esquerdo e painel direito que não interferem).
- Atalhos de contexto (ex: `MovableContext.use()`) permitem que componentes independentes (como um HUD) leiam o estado sem cascata de props.

> **`createContext` sobre `setContext`/`getContext` direto:** A implementação de contexto deve usar `createContext` do Svelte em vez de `setContext`/`getContext` com chave manual. `createContext` elimina a possibilidade de colisão de chaves e garante inferência de tipo sem cast.
>
> ```ts
> // context.svelte.ts — pseudo-código ilustrativo
> import { createContext } from 'svelte';
> export const [getDomainContext, setDomainContext] = createContext<DomainModel>();
> ```
>
> O padrão de DX permanece o mesmo — `MovableContext.use()` continua sendo o atalho público. A diferença é que a infraestrutura por baixo usa `createContext` para type safety nativa e eliminação de chaves manuais.

### Design Declarativo: Context como Componente, Modifier como Factory

**Context providers** são componentes `.svelte` — a escolha é intencional:

- **Alinhamento mental:** A hierarquia visual no código reflete a hierarquia de comportamentos. O desenvolvedor vê imediatamente que "tudo dentro desta tag compartilha as mesmas regras físicas".
- **Delegação de ciclo de vida:** O desenvolvedor não precisa se preocupar com `onMount`, `onDestroy` ou memory leaks. Quando o componente é removido da tela (por um `{#if}`, por exemplo), ele desconecta ResizeObservers, limpa instâncias do Model, remove event listeners e libera memória automaticamente.
- **Componente como fronteira:** Demarca onde uma instância do Model passa a existir na árvore.

**Modifiers** são factory functions — a escolha também é intencional:

- **Zero overhead de componente:** Factories não criam instâncias de componente nem elementos no DOM. O ciclo de vida é gerido pelo `{@attach}` no elemento do consumidor.
- **Composição sem aninhamento:** Múltiplos modifiers no mesmo elemento são aplicados lado a lado, sem wrappers aninhados que complicam CSS e debug.
- **Estado acessível no script:** O handle retornado pela factory expõe estado reativo diretamente no `<script>`, onde as regras de apresentação vivem — alinhado com a separação script/template (§1).

---

## 6. Animações e Web Animations API

### Animações são Dados, não Comportamento

O componente é agnóstico de animações. Uma animação declara `name`, `duration`, `keyframes`, `loop`, `interval` e `onInterrupt` — nada mais. O componente cuida do *quando*; a animação cuida do *como*. Como objetos de animação são imutáveis por design (declarados pelo consumidor e passados ao Model por substituição completa), devem ser armazenados com `$state.raw` (§2) para evitar o overhead de Proxy profundo.

### WAAPI sobre CSS Animations

`animation.pause()` e `animation.currentTime` tornam requisitos como pausa exata e retomada operações de uma linha — frágeis com CSS puro. O engine é o mesmo; a diferença é controle imperativo vs. declarativo.

### Keyframes como Funções

Quando uma animação precisa de contexto do elemento no momento do disparo (posição atual, dimensões), `keyframes` é declarado como `(el: HTMLElement) => Keyframe[]`. O Coordinator invoca a função imediatamente antes de `element.animate()`. Isso permite animações que partem do estado atual do elemento — necessário para o modo `discard`.

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

### Três Camadas de Strictness

A postura defensiva segue a detectabilidade do erro:

| Camada | Postura | Exemplos |
|---|---|---|
| **Contrato de API (detectável em compile time)** | Strict — erro de tipo, não compila | Props com tipo errado, interface de Interaction incompleta, Model sem Context injetado |
| **Configuração visual/CSS (runtime, controlável pelo usuário)** | Resiliente — `console.warn` + fallback | `duration` negativo, `keyframes` vazio, pai sem `position: relative` |
| **Invariante interno (nunca deveria acontecer)** | Strict — `throw` com mensagem clara | Estado interno inconsistente indicando bug da lib, não erro do consumidor |

A filosofia Apple pós-Swift 6: *"Se TypeScript consegue detectar em compile time, não se deve transformar em `console.warn` em runtime."* O consumidor que configurar a API incorretamente deve receber um erro de tipo — não um warning obscuro em produção.

As seções abaixo descrevem a postura resiliente da camada intermediária — que continua válida para configuração visual e CSS.

---

Ao contrário da postura de "Falha Rápida" comum na web, a arquitetura adota a filosofia **Apple/Cocoa de Resiliência Silenciosa** para a camada de configuração visual:

### Auto-Correção

O sistema assume que o ambiente pode ser hostil (CSS mal configurado, pai estático). Em vez de falhar, detecta erros e aplica correções em tempo de execução:
- Forçar `position: relative` no Context quando ausente
- Aplicar *clamping* quando o layout encolhe e o item ficaria fora dos limites

### Avisos Educativos

O erro não é suprimido, mas transformado em DX. Um `console.warn` explica o problema, mas o software continua funcionando no modo "Best Effort". Nunca `throw new Error` que derrube a renderização da árvore Svelte.

### Prioridade

A **continuidade da experiência do usuário final** está acima da pureza técnica da configuração do desenvolvedor. O software não deve "crashar" por detalhes de CSS.

### Contenção Estrutural com `<svelte:boundary>`

`<svelte:boundary>` (Svelte 5.3+) é o mecanismo oficial de error boundary. Captura erros durante renderização e em efeitos, renderizando UI alternativa via snippet `failed` ou chamando `onerror` para logging.

A filosofia Fail-Safe descrita acima opera *dentro* dos componentes (lógica defensiva, guards, auto-correção). `<svelte:boundary>` adiciona uma camada de contenção *em torno* dos componentes — se um Modifier, Coordinator ou Context lançar um erro inesperado em produção, o boundary impede que a árvore inteira desmonte. Isso **complementa**, não substitui, a lógica defensiva interna.

**Diretriz:** Envolver os componentes Modifier/Context de cada package num `<svelte:boundary>` no nível da aplicação consumidora. O snippet `failed` pode renderizar o conteúdo filho sem os superpoderes do Modifier — **degradação graciosa real**:

```svelte
<svelte:boundary onerror={(error) => console.warn('[Movable]', error)}>
  {#snippet failed()}
    <!-- Conteúdo renderizado sem capacidades do Modifier -->
    <div>Conteúdo sem superpoderes</div>
  {/snippet}
  <div {@attach item.modifier}>
    Conteúdo movível
  </div>
</svelte:boundary>
```

O package não impõe o boundary internamente — a decisão de *onde* colocar a fronteira de contenção é do consumidor, alinhada com a estratégia de degradação graciosa da aplicação.

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

### Propriedades Compositor-Friendly

Animações devem usar exclusivamente propriedades que rodam no compositor thread do browser: `translate`, `transform`, `opacity`, `scale`, `rotate`, `filter`. Nunca animar propriedades que trigam layout: `width`, `height`, `top`, `left`, `margin`, `padding`. Essa decisão arquitetural é mais impactante que qualquer otimização de runtime.

Para drag/posicionamento (Movable), mover elementos via `translate` ou `transform: translate()`, nunca `top`/`left`.

### Bundle Size

Cada package deve ter um budget de bundle size monitorado via `size-limit`. É o teste automatizado de performance com maior ROI — impede imports acidentais de dependências pesadas e tree-shaking quebrado.

### Benchmarks de Runtime

`vitest bench` é usado para detectar **regressões relativas** entre commits no Model e Utils (tempo de instanciação, ciclo de vida completo). Não é gate de CI (performance absoluta varia por máquina), é comparativo.

Frame rate e jank são verificados manualmente via DevTools Performance panel — não são automatizáveis em CI de forma confiável. Quando disponível, o Chrome DevTools MCP deve ser usado para automatizar coleta de métricas.

### Isolamento de Animações (Anti-Transform Clash)

O Modifier invisível controlado pelo JS lida com as coordenadas (física via `transform`), enquanto o conteúdo interno lida com animações decorativas (via propriedade CSS `translate`). As duas não conflitam.

---

## 9. Convenção de Nomenclatura de Arquivos

### Prefixo de Domínio

Arquivos são prefixados com o nome do domínio do pacote para namespace safety e discoverability via Cmd+P:

```
AttentionRequesterModel.svelte.ts       — Model (estado + lógica de negócio)
AttentionRequesterCoordinator.svelte.ts — Coordinator (ciclo de vida DOM + execução)
AttentionRequester.svelte.ts            — Factory function (cria handle com .modifier e estado reativo)
AttentionRequester.types.ts             — Types e interfaces
index.ts                                — API pública (exports)
```

> **`index.ts` é a exceção:** O bundler resolve `index.ts` automaticamente ao importar um diretório. Renomear para `[domain].index.ts` quebraria essa resolução. O path já desambigua (`Movable/index.ts` vs `AttentionRequester/index.ts`).

### Semântica de Capacidade

Nomes baseados no **domínio e capacidade** (ex: `Movable` — domínio do espaço 2D e geometria), não em APIs legadas da web (ex: `Draggable` — atrelado à API Drag and Drop / DataTransfer).

---

## Documentos Relacionados

| Documento | Seção | Conteúdo |
|---|---|---|
| [Testing](Testing.md) | §10 | Behavioral specs, granularidade de testes, pure function extraction, CodeRabbit workflow |
| [Logging](Logging.md) | §11 | Níveis de log, namespacing, eliminação em produção, instrumentação |
| [Dev Pages](Dev%20Pages.md) | §12 | Estrutura de dev pages, conteúdo obrigatório, aliases, smoke test |
| [Accessibility](Accessibility.md) | §13 | Requisitos por tipo de package, processo de verificação em 5 steps |
| [Checklist](Checklist.md) | §14 | Checklist de conformidade unificado (auditoria single-pass) |
| [Git Conventions](Git%20Conventions.md) | §15 | Convenções de commit, branch naming, CalVer |
| [Interfaces](Interfaces.md) | §16 | Interface.md como contrato público do consumidor, estrutura obrigatória, naming |
