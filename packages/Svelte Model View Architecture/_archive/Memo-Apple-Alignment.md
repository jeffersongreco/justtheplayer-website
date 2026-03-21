# Memo: Alinhamento da Arquitetura MV com o Desenvolvimento Apple Moderno

> **Objetivo:** Avaliar se um engenheiro Apple sênior (Swift 6, SwiftUI + Observation, Swift Testing, MV moderno) olharia para esta arquitetura e veria pensamento de design familiar — ou estranhamentos que denunciariam tradução superficial.
>
> **Escopo Apple:** exclusivamente a prática atual — Swift 6, `@Observable` (Observation framework), SwiftUI com MV direto (sem MVVM), Swift Testing (`@Test`, `#expect`), structured concurrency (`@MainActor`, actors), protocols com opaque types (`some View`).

---

## 1. O que está muito bem traduzido

### 1.1 MV sem ViewModel — decisão arquitetural correta

A arquitetura declara explicitamente que é **MV, não MVC nem MVVM** (§0). Isso é exatamente a postura da Apple pós-WWDC 2023: SwiftUI observa o Model diretamente via `@Observable`, sem camada intermediária de ViewModel. O ViewModel era um artefato de UIKit (onde a View não podia observar estado diretamente) — com SwiftUI + Observation, ele é overhead sem função.

A arquitetura traduz isso com fidelidade: a View lê `$derived` do Model, o Model muta `$state` internamente. Não há camada mediadora. **Um engenheiro Apple reconheceria isso imediatamente.**

### 1.2 `$state` privado + `$derived` público = `@Observable` com access control

O padrão canônico da arquitetura (§2):

```ts
class ExampleModel {
  #count = $state(0)
  readonly count = $derived(this.#count)
}
```

É a tradução estruturalmente exata do padrão Swift moderno:

```swift
@Observable
class ExampleModel {
  private(set) var count = 0

  func increment() { count += 1 }
}
```

Em Swift, `@Observable` faz o compilador sintetizar tracking automático — quem lê `count` numa View é rastreado automaticamente. Em Svelte, `$state` + `$derived` faz o mesmo papel manualmente. A diferença é mecânica (macro do compilador vs. rune explícita), não conceitual. O encapsulamento com campo privado mutável + API pública read-only é idiomático em ambos os mundos.

**Nuance que demonstra profundidade:** a arquitetura usa `#count` (private nativo do JS) em vez de `_count` (convenção). Em Swift, `private` e `private(set)` são do compilador. Usar o mecanismo real da linguagem em vez de convenção é exatamente o que um engenheiro Apple esperaria.

### 1.3 Intenções Tipadas = Enums com Associated Values

O padrão de `PauseIntent` (§2):

```ts
type PauseIntent = { action: 'freeze' } | { action: 'resume', interval: number } | { action: 'discard' }
```

É a tradução direta de:

```swift
enum PauseIntent {
  case freeze
  case resume(interval: TimeInterval)
  case discard
}
```

O Controller faz `switch` nessas intenções — exatamente como uma View em SwiftUI faria `switch` num enum para decidir o que renderizar. A arquitetura não usa booleans para estado discriminado, que é um code smell tão reconhecido na Apple que o compilador Swift exige `switch` exaustivo em enums. **Isso é pensamento nativo, não tradução superficial.**

### 1.4 Views como "tradutoras" de apresentação

A View traduz estado do Model para vocabulário visual (§1):

```ts
const isBouncingRight = $derived(model.step === 1)
```

Em SwiftUI, a mesma disciplina:

```swift
var body: some View {
  let isBouncingRight = model.step == 1
  // ...
}
```

A View nunca muta o Model, apenas lê e interpreta. A distinção entre "lógica de apresentação" (View decide que `step === 1` é "quicando") e "lógica de negócio" (Model decide quando transicionar) está articulada de forma que um engenheiro Apple reconheceria como `body` computation — puro, derivado, sem side effects.

### 1.5 Animações como dados, não comportamento

§6 declara: *"O componente é agnóstico de animações. Uma animação declara `name`, `duration`, `keyframes`, `loop`, `interval` e `onInterrupt` — nada mais."*

Em SwiftUI, `Animation` é exatamente isso — um valor (`Animation.spring(duration: 0.5)`) que descreve *como*, não *quando*. O componente (View) decide *quando* aplicar:

```swift
withAnimation(.spring(duration: 0.5)) { model.step = 2 }
```

A separação entre a declaração da animação (dado) e a execução (Controller/View) é o mesmo princípio. O fato de a arquitetura usar WAAPI em vez das animações declarativas do Svelte (`transition:`, `animate:`) é coerente com a inspiração Apple: SwiftUI dá controle imperativo quando necessário (`withAnimation` é imperativo, `Animation` é dado).

### 1.6 `init` distintos via unions discriminadas + overloads

§6 descreve o padrão de "emular `init` distintos do Swift" com unions discriminadas para tipos e overloads de função nas fábricas. Isso é uma tradução honesta de:

```swift
struct ARAnimation {
  // init para loop
  init(name: String, keyframes: [Keyframe], loop: Bool, interval: TimeInterval) { ... }
  // init para one-shot
  init(name: String, keyframes: [Keyframe]) { ... }
}
```

TypeScript não tem overloads de construtor como Swift, então a arquitetura usa a ferramenta correta da linguagem (unions + factory functions) para enforçar o mesmo contrato em compile time. **A intenção é reconhecível; a implementação respeita as limitações de TypeScript sem inventar abstrações desnecessárias.**

### 1.7 Sem singletons globais = SwiftUI Environment por design

§2 repudia singletons globais e usa Svelte Context para injeção na árvore. Em SwiftUI, `@Environment` e `.environment()` fazem exatamente isso — estado é injetado na hierarquia de Views, não vive em singletons. O isolamento (múltiplas instâncias coexistindo sem conflito) é o mesmo princípio. **A recusa explícita de singletons é idiomática Apple.**

---

## 2. O que um engenheiro Apple estranharia

### 2.1 O Controller não existe em SwiftUI moderno

**Este é o ponto mais delicado.**

Em SwiftUI moderno, não existe Controller. O papel do "Controller" (§3) — ciclo de vida do DOM, `ResizeObserver`, animações WAAPI — não tem equivalente direto porque SwiftUI abstrai isso. O `body` da View é recomputado; o framework cuida do diffing e aplicação no UIKit/AppKit por baixo.

O equivalente mais próximo é o `Coordinator` de `UIViewRepresentable` — a bridge que gerencia um `UIView` imperativo dentro de SwiftUI declarativo. E essa é exatamente a função do Controller na arquitetura: bridge entre o Model declarativo e o DOM imperativo.

**Mas o nome "Controller" carrega peso.** Um engenheiro Apple vai ler "Controller" e pensar MVC (UIKit legado). A arquitetura já antecipa isso (§0: *"Há Controller, mas não é MVC"*), mas a justificativa poderia ser mais forte. O Coordinator do `UIViewRepresentable` é uma analogia precisa que reforçaria que o Controller não decide — ele faz bridge.

**Veredicto:** o conceito é correto e necessário (o DOM é imperativo, alguém precisa fazer bridge). O nome pode causar confusão inicial, mas a documentação já esclarece. Um engenheiro Apple atento entenderia após ler §3.

%% Mudaremos o nome do `Controller` para `Coordinator` %%

> **Resposta:** Decisão registrada. O rename impacta §3 do Architecture.md (extenso uso de "Controller"), os nomes de arquivo (`AttentionRequesterController.svelte.ts` → `AttentionRequesterCoordinator.svelte.ts`), e o Checklist (§14). A analogia com `UIViewRepresentable.Coordinator` deve entrar explicitamente em §3 como justificativa canônica: o Coordinator faz bridge entre o Model declarativo e o DOM imperativo — não decide, não coordena lógica de negócio, só faz a ponte para a API imperative da plataforma.

### 2.2 Fail-Safe vs. Swift 6 strict concurrency

§7 adota "Resiliência Silenciosa" estilo Cocoa/Objective-C — nunca crashar, `console.warn` em vez de `throw`.

Isso é filosofia *clássica* da Apple (NSError, `nil` messaging em Objective-C). Mas o Swift moderno foi na direção **oposta** em certas áreas:

- Swift 6 strict concurrency **rejeita** data races em compile time — não degrada, não avisa, **não compila**.
- `@MainActor` isolation — erros de thread não são "best effort", são erros de tipo.
- Swift Testing usa `#expect` com mensagens claras em vez de falhas silenciosas.

A Apple **ainda** preserva resiliência na UX (apps não devem crashar para o usuário), mas a camada de **desenvolvimento** é cada vez mais strict — erros são capturados em compile time, não tolerados em runtime.

**Sugestão:** a filosofia de §7 é correta para o **usuário final** (CSS mal configurado não deve derrubar a UI). Mas para o **desenvolvedor consumidor** do package, erros de integração (Model sem Context, tipos errados) poderiam ter uma postura mais strict — warnings educativos com fallback são bons para CSS; erros de tipo que não compilam são melhores para API mal-usada. A Apple pós-Swift-6 diria: *"Se é detectável em compile time, não deve ser um warning em runtime."*

%% Expandir isso aqui para diretrizes claras de quando aplicar cada abordagem, adotando a postura mais strict que obriga o consumidor a setar e configurar os componentes da maneira correta. Colocar no documento adequado ou novo. %%

> **Resposta:** A diretriz que emerge naturalmente é: o nível de strictness segue a detectabilidade em compile time. Três camadas:
>
> | Camada | Postura | Exemplos |
> |---|---|---|
> | **Contrato de API (compile time)** | Strict — erro de tipo, não compila | Model sem Context injetado, props com tipo errado, interface de Interaction incompleta |
> | **Configuração visual/CSS (runtime, controlável pelo usuário)** | Resiliente — `console.warn` + fallback | `duration` negativo, `keyframes` vazio, cor inválida |
> | **Invariante interno da lib (nunca deveria acontecer)** | Strict — `throw` com mensagem clara | Estado interno inconsistente que indica bug da lib, não erro do consumidor |
>
> A Apple pós-Swift 6 diria: *"Se TypeScript consegue detectar em compile time, não deve se tornar um `console.warn` em runtime."* O consumidor que configurar errado não deve ver um warning obscuro — deve não compilar.
>
> **Destino:** Isso pertence ao Architecture.md §7 (Resiliência), substituindo a filosofia única por esta tabela de três camadas. Não requer documento novo — é um refinamento de §7.

### 2.3 Interaction como classe separada — Swift usaria protocols

A camada Interaction (§4) é descrita como "plugável e substituível". Em Swift, isso seria modelado com um protocol:

```swift
protocol Interaction {
  func began(at point: CGPoint)
  func changed(to point: CGPoint)
  func ended()
}

class DragInteraction: Interaction { ... }
class KeyboardInteraction: Interaction { ... }
```

O Model receberia `any Interaction` (ou `some Interaction` se genérico), não uma classe concreta. A plugabilidade seria garantida pelo compilador, não por convenção.

Em TypeScript, o equivalente é uma interface:

```ts
interface Interaction {
  began(point: Point): void
  changed(point: Point): void
  ended(): void
}
```

**Estranhamento:** a arquitetura descreve plugabilidade como princípio (§0: *"Tudo é plugável e agnóstico"*), mas não formaliza com interfaces/protocols explícitas. Um engenheiro Apple esperaria ver o contrato tipado, não apenas a intenção documentada. Se `DragInteraction` e `KeyboardInteraction` são substituíveis, o Model deveria depender de `Interaction` (interface), não de uma implementação concreta.

%% Correto, mas não criar um tipo `Interaction` universal, fazer caso a caso partindo do principio de escrever o contrato da "porta" não da "chave" (e.g., a interface Interaction de Movable é definida para ele, o que ele espera de uma Interaction para funcionar e não o contrário - Movable se adequando a um tipo genérico Interaction) %%

> **Resposta:** Princípio correto e importante. Em Swift, isso se chama *role-specific protocols* — você não cria `Interaction` genérico; você define o que `MovableModel` precisa para funcionar:
>
> ```swift
> // Swift: o protocolo é definido pelo consumidor, não pelo fornecedor
> protocol MovableInteraction {
>   func began(at: CGPoint)
>   func changed(to: CGPoint)
>   func ended()
> }
> ```
>
> O equivalente TypeScript:
>
> ```ts
> // A interface vive no módulo Movable, não num módulo Interaction global
> interface MovableInteraction {
>   began(point: Point): void
>   changed(point: Point): void
>   ended(): void
> }
> ```
>
> `DragInteraction` e `KeyboardInteraction` *implementam* `MovableInteraction` — mas a interface não sabe disso, e nem precisa. `AttentionRequesterModel` pode ter uma `AttentionRequesterInteraction` completamente diferente ou nenhuma. Cada contrato é mínimo, local, e definido pelo que a "porta" precisa — não pelo que a "chave" quer oferecer. Documentar isso em §4 com o exemplo concreto do Movable.

### 2.4 Componentes como contratos vs. value types

§5 defende que Context e Modifiers são componentes `.svelte` (não funções TS) para alinhar hierarquia visual com hierarquia de comportamentos. Isso é análogo a SwiftUI, onde Modifiers são **Views que envolvem outras Views** (`ModifiedContent<Content, Modifier>`).

Mas em SwiftUI, Views são **structs** (value types). A reconstrução é barata e sem side effects. Em Svelte, componentes são **instâncias com ciclo de vida** (mount, destroy). Isso cria uma diferença fundamental: o Modifier em Svelte carrega peso de lifecycle que o Modifier em SwiftUI não carrega.

Não é um erro — é uma diferença de plataforma que a arquitetura já mitiga com `display: contents` (§5). Mas um engenheiro Apple notaria que o custo de um Modifier-como-componente em Svelte não é zero como em SwiftUI.

%% Há uma forma de fazer com custo zero? Essa forma seria idiomática e com pouco setup? %%

> **Resposta:** Sim, e é a resposta mais idiomática do Svelte 5: **`@attach`** (attachments, ex-actions).
>
> Para Modifiers que afetam apenas o elemento host sem precisar injetar contexto ou envolver filhos, `@attach` é literalmente custo zero — não cria instância de componente, não tem lifecycle de mount/destroy separado, não adiciona nó ao DOM. É uma função que recebe o elemento e retorna `{ destroy() }`:
>
> ```ts
> // Modifier comportamental — custo zero, sem componente
> function withBoundsClamp(el: HTMLElement) {
>   // setup ResizeObserver, etc.
>   return { destroy() { /* cleanup */ } }
> }
> ```
>
> ```svelte
> <div @attach={withBoundsClamp}>...</div>
> ```
>
> A distinção que emerge:
>
> | Tipo de Modifier | Implementação | Custo |
> |---|---|---|
> | Comportamental (só afeta o host) | `@attach` / action | Zero — sem instância, sem lifecycle |
> | Estrutural (envolve filhos ou provê Context) | Componente `.svelte` com `display: contents` | Mínimo — lifecycle, sem custo de DOM |
>
> Para este projeto, a maioria dos Modifiers envolve filhos (precisam de `<slot>` / snippets para funcionar como wrappers visuais na hierarquia). Esses precisam ser componentes. Mas Modifiers puramente comportamentais — que só modificam o elemento sem envolver filhos — deveriam usar `@attach`. A arquitetura já usa `@attach` no Attention Requester; a extensão natural é formalizar esse como o padrão para Modifiers sem filhos em §5.

---

## 3. O que falta da perspectiva Apple

### 3.1 Structured Concurrency → nenhum equivalente explícito

Swift 6 resolve coordenação de trabalho assíncrono com `Task`, `TaskGroup`, `async let`, `@MainActor`. A arquitetura lida com assincronicidade (animações WAAPI, `requestAnimationFrame`, `ResizeObserver`) de forma ad hoc — cada Controller/Interaction gerencia seus próprios callbacks.

Não existe um padrão equivalente a "todo trabalho imperativo roda num contexto estruturado com cancelamento automático". O `$effect` com cleanup é o mais próximo, mas não é structured concurrency — é reactive teardown.

**Sugestão:** documentar explicitamente que o `$effect` cleanup chain (§3) é o equivalente funcional do structured concurrency para este contexto. A combinação `$effect` + `return () => destroy()` garante que nenhum trabalho assíncrono sobrevive ao componente — que é a mesma garantia que `Task` cancellation dá em Swift.

%% E há concorrência em Svelte + TS? Ou esse ponto será sempre limitado? E é uma lib de componentes, não um app... %%

> **Resposta:** JavaScript no browser é single-threaded — não existe concorrência real (Web Workers existem mas são out of scope para uma lib de componentes). Isso significa que o problema que Swift's structured concurrency resolve — garantir que trabalho assíncrono não vaza além do seu escopo de vida — *existe em JS*, mas é resolvido de forma diferente.
>
> Para esta lib, o ponto de §3.1 deveria ser reframeado: não é uma *ausência de structured concurrency*, é que **o `$effect` cleanup chain é a solução idiomática e suficiente para este contexto**. Eles resolvem o mesmo problema:
>
> | Swift Structured Concurrency | Svelte `$effect` + cleanup |
> |---|---|
> | `Task` cancellation ao sair do escopo | `return () => destroy()` no `$effect` |
> | Trabalho não sobrevive ao seu contexto | Observers/animações não sobrevivem ao unmount |
> | Hierarquia de cancelamento automática | Cadeia de cleanup composta em `$effect`s aninhados |
>
> A garantia é a mesma: nenhum trabalho assíncrono (ResizeObserver, WAAPI, rAF) sobrevive ao componente que o iniciou. Para uma lib de componentes, isso é tudo que é necessário. A seção deveria ser reescrita para afirmar isso positivamente — `$effect` cleanup é o padrão correto e completo, não um substituto inferior.

### 3.2 Protocol conformance formal — "plugável" precisa de contrato

Já mencionado em 2.3, mas vale reforçar: a arquitetura declara plugabilidade como princípio fundacional, mas não define interfaces formais para os pontos de extensão. Em Swift, o engenheiro definiria:

- `protocol Animation` (o contrato que §6 descreve informalmente)
- `protocol Interaction` (o contrato que §4 descreve informalmente)
- `protocol Controller` (se houver Controllers substituíveis)

TypeScript tem o ferramental (`interface`, generics, conditional types). O fato de a arquitetura já usar unions discriminadas para animações mostra fluência — o próximo passo natural seria formalizar os contratos de plugabilidade com interfaces.

### 3.3 Testing: Swift Testing tem `@Test` + traits — a arquitetura não menciona trait-based testing

Swift Testing usa traits para categorizar e filtrar testes:

```swift
@Test(.tags(.slow), .timeLimit(.minutes(1)))
func animationLoop() { ... }
```

A arquitetura (§10, Testing.md) prescreve Detroit School TDD com boa granularidade, mas não menciona categorização formal de testes (unit vs. integration vs. performance). Em um codebase com benchmarks `vitest bench` (§8) e testes unitários `vitest`, uma estrutura de tags/traits ajudaria a separar o que roda em CI rápido do que é comparativo.

%% Vamos adotar %%

> **Resposta:** Adotado. Tags padrão sugeridas para este projeto: `unit` (lógica pura, Models), `integration` (múltiplas camadas juntas), `benchmark` (vitest bench), `slow` (testes com timers reais ou animações). A separação `unit` vs. `benchmark` já existe implicitamente na tooling (`vitest` vs. `vitest bench`); formalizar com tags permite filtrar em CI — rodando apenas `unit` + `integration` no pipeline rápido e `benchmark` separado. Documentar as tags padrão e o critério de classificação em Testing.md (§10).

---

## Resumo: "Risada ou respeito?"

| Área | Veredicto |
|---|---|
| MV sem ViewModel | Respeito — é exatamente a postura pós-WWDC 2023 |
| `$state` privado + `$derived` público | Respeito — tradução precisa de `@Observable` com access control |
| Intenções Tipadas (unions) | Respeito — é enum com associated values, pensamento nativo |
| Views "burras" e tradutoras | Respeito — `body` computation puro, sem side effects |
| Animações como dados | Respeito — separação `Animation` (dado) vs. execução (Controller/View) |
| Sem singletons / Context como Environment | Respeito — idiomático Apple |
| `init` distintos via overloads | Respeito — adaptação honesta às limitações de TypeScript |
| Controller como nome | Estranhamento inicial — mas a explicação em §3 resolve |
| Fail-Safe como filosofia única | Estranhamento — Apple pós-Swift 6 é strict em compile time, resiliente só em UX |
| Plugabilidade sem protocols/interfaces | Estranhamento — o princípio está certo, falta o contrato formal |
| Structured concurrency | Ausente — o `$effect` cleanup faz o papel, mas não está documentado como tal |
| Test traits/categorização | Ausente — baixa prioridade, mas seria natural para a maturidade do projeto |

**Veredicto geral:** Um engenheiro Apple sênior reconheceria decisões de design pensadas, não tradução superficial. Os pontos fortes (MV direto, encapsulamento, unions discriminadas, animações como dados) demonstram que a inspiração é no *pensamento* por trás do SwiftUI/Observation, não na sintaxe. Os estranhamentos (Controller como nome, fail-safe unificado, falta de protocols formais) são pontos de refinamento, não erros de fundação. **Respeito com notas — não risada.**
