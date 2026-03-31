# Mapeamento de Convenções — Apple MV vs Svelte MV

> Camada entre Princípios de Engenharia e Arquitetura resultante. Parte dos graus de liberdade remanescentes (G.e1–G.e9 da árvore de engenharia, G1–G7 parcialmente resolvidos, e idiomas de Svelte da Raiz B) e mapeia como cada um é resolvido em Apple vs como deveria ser resolvido em Svelte.
>
> **Objetivo:** Para cada convenção, determinar se é **transportável** (padronizar com Apple), **adaptável** (mesmo princípio, mecanismo diferente), ou **nova** (sem equivalente em Apple — exclusiva de Svelte).
>
> **Premissa:** MV é transportável (veredicto da árvore 4: Sim). O que esta camada resolve não é *se* MV funciona em Svelte, mas *como materializar* MV em Svelte — quais convenções manter, quais adaptar, quais criar.

---

## Estrutura

Cada nó segue o formato:

- **Liberdade:** Qual grau de liberdade resolve
- **Apple:** Como Apple/SwiftUI resolve
- **Svelte:** Como Svelte pode ou deve resolver
- **Classificação:** Transportável | Adaptável | Nova
- **Decisão:** O que padronizar

---

## M1 — Materialização de entidades em arquivos (G.e1)

**Liberdade:** Entidades logicamente separadas vivem em arquivos separados, seções de um arquivo, ou módulos de um pacote?

### Apple

- **Model:** Um arquivo `.swift` por Model. Classe ou struct marcada `@Observable`. Nome do arquivo = nome do tipo (`CounterModel.swift`).
- **View:** Um arquivo `.swift` por View. Struct que conforma a `View`. Nome do arquivo = nome da View (`CounterView.swift`).
- **Relação:** Model e View em arquivos separados, no mesmo pacote/feature.

### Svelte

- **Model:** Um arquivo `.svelte.ts` por Model. Classe ou função que usa `$state`/`$derived`. Runes funcionam em `.svelte.ts` (compiladas pelo Svelte).
- **View:** Um arquivo `.svelte` por View. Componente com `<script>` + template + `<style>`.
- **Relação:** Model e View em arquivos separados, no mesmo diretório/pacote.

### Classificação: Transportável

A convenção "um arquivo por entidade, Model e View separados" mapeia diretamente. A extensão muda (`.swift` → `.svelte.ts` / `.svelte`), mas a estrutura é idêntica.

### Decisão

- Model → arquivo `.svelte.ts` (para acesso a runes) ou `.ts` (se lógica pura sem reatividade).
- View → arquivo `.svelte`.
- Um arquivo por entidade. Sem exceções.

---

## M2 — Forma das abstrações (G.e2)

**Liberdade:** A abstração entre entidades é uma interface formal, tipo estrutural, protocolo, ou contrato implícito?

### Apple

- **Prática:** Contrato implícito por convenção. O Model expõe propriedades e métodos públicos; a View os consome. Não há `protocol` formal entre Model e View — `@Observable` exige tipos concretos.
- **Enforcement:** Por revisão de código e disciplina do desenvolvedor.
- **Trade-off:** DIP informal (V3.5 da árvore de avaliação). Apple sacrifica DIP formal por compatibilidade com Observation framework.

### Svelte

- **Possibilidade:** TypeScript `interface` pode descrever o contrato do Model. Runes (`$state`, `$derived`) não têm incompatibilidade com interfaces — diferente de `@Observable` com protocolos Swift.
- **Oportunidade:** DIP formal é possível sem sacrificar reatividade.

### Classificação: Adaptável

O princípio (abstração entre Model e View) é o mesmo. O mecanismo pode ser **melhor** em Svelte — interfaces TypeScript permitem enforcement por compilador que Apple não consegue com `@Observable`.

### Decisão

- O Model expõe uma interface TypeScript que define seu contrato público.
- A View depende da interface, não do tipo concreto.
- A interface é definida pelo Model (UseDD: decisor define a porta).
- Verificação: o compilador TypeScript enforça — não depende de disciplina.

**Diferença com Apple:** Formal onde Apple é informal. Melhoria, não adaptação por necessidade.

---

## M3 — Estado e reatividade (G3, G6, G.e5)

**Liberdade:** Estado co-localizado com decisão ou separado? Mecanismo de comunicação entre decisor e executor?

### Apple

- **Estado:** Co-localizado no Model. `@Observable class CounterModel { var count = 0 }`. O Model detém estado e define transições.
- **Reatividade:** Observation framework (`@Observable`) faz tracking automático. A View que lê `model.count` re-renderiza quando `count` muda. Sem declaração explícita de dependência.
- **Comunicação Model→View:** Reativa (Observation). A View observa, o Model não sabe que é observado.
- **Comunicação View→Model:** Imperativa (chamada de método). `model.increment()`.

### Svelte

- **Estado:** Co-localizado no Model. `class CounterModel { count = $state(0) }`. O Model detém estado reativo e define transições.
- **Reatividade:** Runes (`$state`, `$derived`). O compilador Svelte gera o tracking. A View que lê `model.count` no template re-renderiza quando `count` muda.
- **Comunicação Model→View:** Reativa (runes). Mesma direção e semântica.
- **Comunicação View→Model:** Imperativa (chamada de método). `model.increment()`. Idêntico.

### Classificação: Transportável

Estado co-localizado com decisão, reatividade como mecanismo de propagação, e comunicação bidirecional (reativa Model→View, imperativa View→Model) são idênticos. O primitivo muda (`@Observable` → `$state`), mas a convenção é a mesma.

### Decisão

- Estado vive no Model, co-localizado com lógica de transição.
- Model usa `$state` e `$derived` para estado reativo.
- View consome estado no template (reativo) e chama métodos para ações (imperativo).
- Model não sabe da existência da View — não tem imports, callbacks, ou referências a ela.

---

## M4 — Papel do script no componente Svelte (G7, G1)

**Liberdade:** O script é decisor de apresentação, tradutor, ou executor? Template e script são uma entidade ou duas?

### Apple

- **Não existe distinção.** SwiftUI tem um único mecanismo declarativo — o `body` da View é código Swift que declara UI. Não há "script" separado de "template". Escapes imperativos (`.onAppear`, `.task`) existem mas são pontuais.
- G7 e G1 não se aplicam: em Apple, não há duas entidades dentro da View.

### Svelte

- **Existem dois mecanismos distintos** no mesmo componente: `<script>` (imperativo) e template (declarativo).
- O `<script>` pode:
  1. Instanciar o Model e conectá-lo ao template (composição/wiring)
  2. Derivar valores de apresentação a partir do estado do Model (decisão de apresentação)
  3. Manipular DOM diretamente via actions delegadas (execução via delegação)
- O template:
  1. Projeta estado na DOM (execução declarativa)
  2. Declara event handlers que chamam o Model (ponte para Tell)

### Classificação: Nova

Apple não tem esta convenção porque não tem o problema. Svelte precisa resolver G7 explicitamente.

### Decisão

O script do componente `.svelte` é **compositor e tradutor**, nunca decisor de domínio:

1. **Compositor:** Instancia o Model, obtém dependências (props, context), conecta Model ao template. Decisão de composição (construction time), não de negócio (V5.3).
2. **Tradutor de apresentação:** Pode derivar valores de apresentação a partir do estado do Model (`$derived`). Ex: `const cssClass = $derived(model.isActive ? "active" : "")`. Essa regra de apresentação é decisão — mas é decisão de **apresentação**, não de **domínio de negócio**. O script é decisor de apresentação, o template é executor de apresentação.
3. **Não executor de DOM:** O script não manipula DOM diretamente. Manipulação imperativa é delegada a entidades de infraestrutura (actions, via `use:`).

**Resolução de G7:** O script é decisor de apresentação + compositor. O template é executor de apresentação. São duas entidades lógicas no mesmo arquivo (G1: uma entidade View composta de duas partes com papéis distintos).

**Resolução de G1:** Template e script são uma entidade View (mesmo arquivo `.svelte`), com separação interna de papel. Não são entidades separadas — são partes de um executor composto, onde o script adiciona regras de apresentação que o template não pode expressar (lógica condicional, derivações, transformações).

**Fronteira UseDD:** O script NÃO decide lógica de negócio. Se um `if` no script depende de lógica de domínio, essa lógica pertence ao Model. O script só consome o resultado.

---

## M5 — Ciclo de vida e ownership (V5, G.e5)

**Liberdade:** Quem cria o Model? Quem possui? Quem conecta?

### Apple

- **Criação:** Declarativa via property wrappers. `@State var model = CounterModel()` — a View declara, SwiftUI gerencia.
- **Compartilhamento:** `@Environment` (injeção por ancestral), props (passagem explícita).
- **Lifetime:** SwiftUI gerencia. O Model vive enquanto a View owner vive.

### Svelte

- **Criação:** Imperativa no script. `const model = new CounterModel()` — o componente cria.
- **Compartilhamento:** `getContext()` (injeção por ancestral), `$props()` (passagem explícita).
- **Lifetime:** Escopo do componente. O Model é garbage-collected quando o componente desmonta. `$effect` para cleanup explícito se necessário.

### Classificação: Adaptável

Os padrões de ownership são os mesmos (local, compartilhado, injetado). O mecanismo é mais explícito/imperativo em Svelte.

### Decisão

Três padrões de ownership, análogos aos de Apple:

| Padrão | Apple | Svelte | Quando usar |
|---|---|---|---|
| **Owner local** | `@State var model = Model()` | `const model = new Model()` no script | O componente é dono exclusivo |
| **Injeção por ancestral** | `@Environment(\.model) var model` | `const model = getContext<Model>('model')` | Model compartilhado na árvore de componentes |
| **Passagem explícita** | Prop no init da View | `let { model } = $props()` | Pai decide qual Model o filho usa |

- O owner é quem cria. Quem cria decide lifetime.
- O Model nunca é criado por mais de um componente (SSOT de instância).

---

## M6 — Entidades de infraestrutura (G2, G5, G.e1, G.e6)

**Liberdade:** Quantas entidades de cada lado? Coleta de eventos separada? Materialização?

### Apple

- **Gestos:** Entidades do SwiftUI. `.onTapGesture { }`, `.gesture(DragGesture())`. A View declara, o framework interpreta.
- **Animação:** `withAnimation { }`, `.animation()`. A View declara, o framework executa.
- **Acessibilidade:** `.accessibilityLabel()`, `.accessibilityHint()`. Declarativo.
- **Materialização:** Módulos internos do SwiftUI. O desenvolvedor não vê a entidade — só a declaração.

### Svelte

- **Gestos:** Não existem embutidos. Precisam ser fornecidos como bibliotecas. Entidades que interpretam eventos brutos (pointermove, keydown) e produzem intenções de domínio.
- **Animação:** `svelte/transition` e `svelte/animate` para casos simples. WAAPI para animações complexas. Entidades que controlam animação imperativa.
- **Acessibilidade:** Atributos HTML padrão (`aria-*`, `role`). Sem abstração de alto nível como SwiftUI.
- **Materialização:** Bibliotecas em arquivos `.svelte.ts` ou `.ts`, consumidas via Svelte actions (`use:`).

### Classificação: Adaptável (mecanismo) + Nova (conteúdo)

A convenção "infraestrutura como entidades separadas da View" é transportável. O conteúdo dessas entidades (o que elas fazem) precisa ser construído — é a "biblioteca de UI" mencionada no veredicto da árvore 4.

### Decisão

- Entidades de infraestrutura são módulos separados da View (SRP — P3).
- Em Svelte, materializam-se como:
  - **Actions** (`use:`) para código imperativo na DOM (animação, gesture recognition, focus management).
  - **Módulos `.svelte.ts`** para lógica reativa de infraestrutura (gesture state machines, animation coordination).
  - **Módulos `.ts`** para lógica pura de infraestrutura (cálculos de colisão, interpolação).
- A View declara que usa essas entidades — não contém seu código.
- Cada entidade de infraestrutura tem uma razão de mudança (P3) e porta própria.

---

## M7 — Nomenclatura das entidades (G.e4)

**Liberdade:** Como entidades são nomeadas?

### Apple

| Entidade | Nome canônico | Exemplo |
|---|---|---|
| Decisor de domínio | Model | `CounterModel` |
| Executor de apresentação | View | `CounterView` |
| Infraestrutura | (nome do módulo do framework) | `DragGesture`, `Animation` |

### Svelte

Não há convenção estabelecida. Precisa ser definida.

### Classificação: Transportável (Model, View) + Nova (infraestrutura)

### Decisão

| Entidade | Nome | Arquivo | Exemplo |
|---|---|---|---|
| Decisor de domínio | Model | `<Nome>.model.svelte.ts` | `Counter.model.svelte.ts` |
| Executor de apresentação | View (componente) | `<Nome>.svelte` | `Counter.svelte` |
| Infraestrutura imperativa | (nome descritivo) + action | `<nome>.action.ts` | `draggable.action.ts` |
| Infraestrutura reativa | (nome descritivo) + coordinator | `<nome>.coordinator.svelte.ts` | `animation.coordinator.svelte.ts` |
| Infraestrutura pura | (nome descritivo) | `<nome>.ts` | `collision.ts` |
| Interface do Model | (nome) + interface | `<Nome>.interface.ts` | `Counter.interface.ts` |

---

## M8 — Formato das instruções e portas (G.e3, G.e9)

**Liberdade:** Qual formato das instruções? Qual vocabulário das portas internas?

### Apple

- **Porta DX:** Initializer da View + propriedades do Model. O desenvolvedor vê: `CounterView()` ou `CounterView(model: myModel)`.
- **Porta Model→View:** Propriedades reativas do Model. O desenvolvedor não "instrui" a View — a View observa e reage.
- **Porta View→Model:** Chamadas de métodos semânticos. `model.increment()`, `model.startDrag(at: position)`.
- **Vocabulário:** Domínio de negócio no Model, domínio de apresentação na View.

### Svelte

- **Porta DX:** Props do componente. `<Counter />` ou `<Counter model={myModel} />`.
- **Porta Model→View:** Estado reativo do Model (runes). O template consome e reage.
- **Porta View→Model:** Chamadas de métodos. `model.increment()`, `model.startDrag(position)`.
- **Vocabulário:** Mesma separação possível.

### Classificação: Transportável

As portas e seus vocabulários mapeiam diretamente. O formato das instruções (propriedades reativas + métodos semânticos) é idêntico.

### Decisão

- **Porta DX:** Props do componente Svelte.
- **Porta Model→View:** Propriedades reativas do Model (`$state`, `$derived`). O Model não sabe da View.
- **Porta View→Model:** Métodos semânticos do Model. A View chama, não decide.
- **Vocabulário:** Model fala linguagem de domínio. View fala linguagem de apresentação. Script traduz quando necessário (M4).

---

## M9 — Verificação (G.e8)

**Liberdade:** Como verificar conformidade? Automatizado vs manual? Granularidade?

### Apple

- **Model:** Testes unitários automatizados. Model é classe/struct pura — instanciável, testável sem UI.
- **View:** SwiftUI Previews para inspeção visual. XCTest com ViewInspector para testes programáticos (limitado). UI Tests para integração.
- **Prática:** Model é exaustivamente testado. View é inspecionada visualmente.

### Svelte

- **Model:** Testes unitários automatizados. Model é classe/módulo `.svelte.ts` — instanciável, testável sem componente.
- **View:** Sem simulação (CLAUDE.md: "no Testing Library, no simulated clicks"). Checklist manual + logging.
- **Infraestrutura:** Testes unitários para lógica pura. Testes com JSDOM para DOM interactions.

### Classificação: Transportável (Model) + Adaptável (View)

O princípio (Model testável automaticamente, View verificável por inspeção) é o mesmo. O mecanismo para Views difere por decisão do projeto (sem simulação).

### Decisão

| Entidade | Verificação | Detalhe |
|---|---|---|
| **Model** | Automatizada | Testes unitários via Bun test. Cobertura de estado, transições, edge cases. |
| **View** | Manual + logging | Checklist de comportamento observável. Console output para estado interno. |
| **Infraestrutura (pura)** | Automatizada | Testes unitários para cálculos, transformações. |
| **Infraestrutura (DOM)** | JSDOM + manual | Testes com JSDOM para lifecycle de actions. Smoke test manual para comportamento visual. |

---

## M10 — Critério de generalização (G.e7)

**Liberdade:** Quando generalizar portas? Quanto de evidência é suficiente?

### Apple

- **Prática:** Apple generaliza com base em padrões históricos da plataforma. SwiftUI modifier chains são extensíveis por construção. A cultura é "composável desde o início".
- **Exemplo:** `.font()`, `.foregroundColor()` são genéricos — aceitam qualquer valor do tipo correspondente, não apenas um subconjunto.

### Svelte

- Sem convenção de plataforma. Depende do desenvolvedor.

### Classificação: Transportável (princípio) + Nova (calibração)

### Decisão

Aplicar P5 (OCP) com a heurística da árvore de engenharia:

- **Generalizar quando:** O domínio de UI tem evidência histórica de variação (tipos de animação, tipos de gesto, estratégias de layout). Portas de infraestrutura devem acomodar variação desde a v1.
- **Não generalizar quando:** Não há evidência de variação. Uma porta que serve um caso serve um caso. YAGNI até que o domínio indique o contrário.
- **Calibração:** O catálogo de padrões observados no domínio (SwiftUI como referência) é evidência válida. Se SwiftUI oferece 10 tipos de animação, é previsível que a biblioteca Svelte precisará de extensibilidade para tipos de animação.

---

## Resumo: Classificação por Tipo

### Transportável (padronizar com Apple)

| Conv. | O quê |
|---|---|
| M1 | Um arquivo por entidade, Model e View separados |
| M3 | Estado co-localizado com decisão, reatividade como propagação |
| M5 | Três padrões de ownership (local, injetado, passado) |
| M8 | Formato das portas (props, estado reativo, métodos semânticos) |
| M9 | Model automatizado, View manual |
| M10 | Generalizar quando domínio evidencia variação |

### Adaptável (mesmo princípio, mecanismo diferente)

| Conv. | O quê | Diferença |
|---|---|---|
| M2 | Abstração entre Model e View | Formal (TypeScript interface) onde Apple é informal |
| M5 | Ownership | Imperativo (script) onde Apple é declarativo (property wrappers) |
| M6 | Entidades de infraestrutura | Actions + módulos onde Apple é modifiers do framework |
| M9 | Verificação de View | Checklist manual onde Apple usa Previews |

### Nova (sem equivalente em Apple)

| Conv. | O quê | Por quê |
|---|---|---|
| M4 | Papel do script | Apple não tem script/template split |
| M6 | Conteúdo das entidades de infraestrutura | Apple fornece pronto; Svelte precisa construir |
| M7 | Nomenclatura de arquivos e entidades | Svelte não tem convenção estabelecida |
