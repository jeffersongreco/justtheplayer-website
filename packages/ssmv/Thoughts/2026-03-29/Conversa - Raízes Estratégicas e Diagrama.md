# Conversa: Raízes Estratégicas — Escolha de Svelte e Transporte de MV

**Contexto:** Duas decisões que antecedem e são independentes da sequência UseDD → Restrições de Domínio → Princípios de Engenharia. Não derivam dos princípios — são raízes estratégicas que alimentam a árvore por caminhos diferentes.

---

## 1. Mensagem do autor

### Raiz A — Transporte de MV em vez de arquitetura aberta

Assumindo que "software web com interface de usuário não tem uma arquitetura padrão ouro como software Apple tem o MV (Observation framework + SwiftUI); e os padrões mais consistentes são apenas: fluxo de dados unidirecional, separação de lógica de negócio da UI, componentes como unidade de composição", eu escolho em vez de fazer uma auditoria aberta de arquiteturas compatíveis, primeiro verificar se MV é compatível para transportá-la (que é o padrão Apple) para Svelte e assim usar uma "arquitetura padrão". Acredito que seria melhor o transporte do que a adoção de uma arquitetura que não é padrão em nenhum dos dois.

### Raiz B — Escolha de Svelte

Pessoalmente não gosto de React, por percepção, não julgamento técnico, acho uma complicação e uma massa cheia de débito técnico e que cresceu para o nativo sem nem ser bom na web, enquanto o Svelte gera uma experiência de fazer web vanilla de forma mais fácil e com resultado muito bom, além de estar sob a tutela de um criador que constrange o seu crescimento a seguir uma filosofia e um cuidado. E sou a favor da existência de um opiniativo que te obriga a fazer bem feito em detrimento de uma liberdade que deixa a qualidade se perder, humanos não são formigas, liberdade faz emergir bagunça, liderança faz emergir ordem.

---

## 2. Natureza dos dois nós

Os três arquivos existentes (UseDD, Restrições de Domínio, Princípios de Engenharia) formam uma **derivação vertical descendente**: cada camada parte das liberdades da anterior e as constrange. A sequência responde à pergunta *"que restrições qualquer arquitetura neste domínio deve satisfazer?"*

Os dois novos nós não são camadas dessa sequência — são **raízes laterais** que respondem perguntas diferentes:

- **Raiz B (Svelte)** responde: *"em que plataforma construímos?"* — é uma escolha de ferramenta, motivada por preferência e filosofia, que alimenta os fatos de domínio.
- **Raiz A (Transporte de MV)** responde: *"que arquitetura candidatamos?"* — é uma estratégia de busca, motivada pela ausência de padrão ouro na web e pela existência de um na Apple, que produz uma hipótese a ser validada contra todas as restrições.

---

## 3. Diagrama: como os nós tocam a Design Tree

```
RAÍZES ESTRATÉGICAS                     DERIVAÇÃO VERTICAL
(decisões independentes)                (restrições descendentes)


                                        ┌─────────────────────┐
                                        │       UseDD         │
                                        │  (meta-princípio)   │
                                        └─────────┬───────────┘
                                                  │
                                                  │ constrange
                                                  ▼
┌──────────────────────┐   alimenta     ┌─────────────────────┐
│   Raiz B: Svelte     │──────────────▶ │ Restrições Domínio  │
│                      │   fatos de     │ (F1–F4, D1–D3,      │
│ • Plataforma/        │   domínio      │  G1–G7)             │
│   ferramenta         │                └─────────┬───────────┘
│ • Filosofia:         │                          │
│   opiniativo >       │                          │ constrange
│   liberdade          │                          ▼
│                      │                ┌─────────────────────┐
│                      │                │ Princípios Eng.     │
│                      │                │ (P1–P7, C1–C5,      │
│                      │                │  G.e1–G.e9)         │
│                      │                └─────────┬───────────┘
│                      │                          │
│                      │   idiomas                │ constrange
│                      │──────────────▶           ▼
│                      │   de Svelte    ┌─────────────────────┐
└──────────────────────┘                │    Convenções       │
                                        │  (camada futura)    │
                                        └─────────┬───────────┘
                                                  │
                                                  │ constrange
                                                  ▼
┌──────────────────────┐  candidata     ┌─────────────────────┐
│ Raiz A: Transporte   │──────────────▶ │    Arquitetura      │
│ de MV                │  a validar     │   resultante        │
│                      │  contra todas  │                     │
│ • Hipótese: MV Apple │  as restrições │ MV transportada     │
│   é transportável    │               ◀┤ para Svelte,        │
│   para Svelte        │                │ validada contra     │
│ • Melhor transportar │                │ UseDD + Domínio +   │
│   padrão do que      │                │ Eng. + Convenções   │
│   adotar sem-padrão  │                └─────────────────────┘
└──────────────────────┘
```

### Legenda das relações

| De | Para | Relação | O que transporta |
|---|---|---|---|
| **UseDD** | Restrições de Domínio | Constrange | Princípios de autoridade, separação decisor/executor, cadeia de autoridade |
| **Restrições de Domínio** | Princípios de Engenharia | Constrange | Fatos derivados (DOM é execução, duas portas, etc.) + graus de liberdade G1–G7 |
| **Princípios de Engenharia** | Convenções | Constrange | Princípios P1–P7 + graus de liberdade G.e1–G.e9 |
| **Convenções** | Arquitetura resultante | Constrange | Materialização das fronteiras, nomenclatura, organização física |
| **Raiz B (Svelte)** | Restrições de Domínio | Alimenta fatos | F3 (reatividade = runes de Svelte), F4 (template/script = `.svelte`) |
| **Raiz B (Svelte)** | Convenções | Alimenta idiomas | Padrões de escrita Svelte, TypeScript, organização de arquivos `.svelte` |
| **Raiz A (MV)** | Arquitetura resultante | Candidata hipótese | MV como arquitetura a ser testada contra todas as restrições acumuladas |

### Por que MV entra no final, não no início

MV não é premissa — é candidata. As três Design Trees (UseDD, Domínio, Engenharia) constroem restrições *sem saber que MV existe*. MV chega no final como hipótese: "essa arquitetura satisfaz todas as restrições?". Se sim, é adotada. Se não, ou é adaptada ou descartada.

Isso é intencional: se MV fosse premissa, as restrições seriam reverse-engineered para justificá-la (exatamente o viés identificado na conversa de Restrições de Domínio, seção 8). A sequência correta é restrições primeiro, candidata depois.

### Por que Svelte entra cedo mas MV entra tarde

Svelte é **fato de domínio** — está além do poder dentro do projeto (já foi escolhido). Seus mecanismos (runes, `.svelte`, template declarativo, script imperativo) são fatos que constrangem o espaço de soluções. Entram em F3/F4 porque toda derivação posterior depende deles.

MV é **escolha arquitetural** — está sob o poder do arquiteto. Poderia ser descartada e outra arquitetura escolhida. Não é fato — é hipótese. Se entrasse cedo, contaminaria as derivações com sua forma específica.

A distinção: Svelte determina *em que campo se joga*; MV é *uma jogada candidata dentro desse campo*.

---

## 4. Correção: assimetria de infraestrutura não é questão de MV

**Mensagem do autor:** Não é como se a MV não tivesse outras entidades. A infraestrutura existir pronta para ser declarada na View, não faz ela ser parte da View. Ainda são módulos "extra". Nesse ponto, a diferença entre MV em SwiftUI e em Svelte não é a quantidade de entidades. SwiftUI é também uma biblioteca de UI, Svelte é só um framework e, você considerou a parte biblioteca na comparação. O veredicto não é um MV com entidades a mais em Svelte, o veredicto é que são compatíveis e, outro assunto, além da arquitetura, se mostra necessária uma biblioteca que forneça essa infraestrutura pronta para o desenvolvimento em Svelte ficar mais parecido com o SwiftUI.

### Análise

O autor identifica um erro de atribuição: a avaliação original atribuía a MV a responsabilidade por entidades de infraestrutura (gesture recognizer, animation API) que em Apple são módulos do *SwiftUI como biblioteca*, não da *arquitetura MV*. O gesture recognizer do SwiftUI não é "parte da View" — é uma entidade separada que a View declara usar. Da mesma forma, em Svelte, essas entidades seriam módulos de biblioteca que a View declara usar via actions.

A consequência é que a contagem de entidades é a mesma em ambas as plataformas: Model + View + entidades de infraestrutura. O que difere é se as entidades de infraestrutura vêm pré-construídas (SwiftUI = framework + biblioteca) ou precisam ser fornecidas (Svelte = framework sem biblioteca comparável).

Isso muda o veredicto de "sim, com adaptação" para "sim" — e separa a questão da biblioteca como um assunto independente da compatibilidade arquitetural.

---

## 5. Correção: Tell Don't Ask e DIP no MV state-driven

**Mensagem do autor:** Forneceu análise detalhada (formato Q&A) sobre como MV state-driven da Apple se relaciona com P6 (Tell Don't Ask) e P2 (DIP).

### Tell Don't Ask (P6)

A avaliação original afirmava que MV pratica Ask (a View lê estado do Model). A correção distingue dois fluxos:

1. **View → Model (ações):** A View chama métodos semânticos (`model.increment()`). Isso *é* Tell — a View diz ao Model o que fazer sem perguntar estado para decidir.
2. **Model → View (projeção):** A View lê estado para projetar em pixels (`Text("\(model.count)")`). Isso *não é* Ask no sentido de P6 — a View não está tomando decisões de negócio baseada no estado. Está cumprindo sua responsabilidade como executor de apresentação.

P6 constrange decisões de negócio, não renderização. A View que lê estado para exibir está executando, não decidindo. A View que leria estado para tomar decisão de negócio (`if model.count >= 10 { model.reset() }`) estaria violando P6.

### DIP (P2)

A avaliação original afirmava que MV viola DIP. A correção distingue dois níveis de abstração:

1. **Abstração de tipo** (protocolo/interface): MV não pratica — a View conhece o tipo concreto do Model.
2. **Abstração de comportamento** (encapsulamento via métodos): MV pratica — a View chama `model.increment()` sem conhecer a implementação.

A Apple sacrifica DIP formal (abstração de tipo) conscientemente porque `@Observable` não funciona bem com protocolos Swift. O trade-off é explícito: reatividade automática em troca de enforcement por convenção em vez de enforcement por compilador.

Nota relevante para o transporte: em Svelte/TypeScript, essa incompatibilidade entre interfaces e reatividade pode não existir — runes podem funcionar com interfaces TypeScript, abrindo a possibilidade de DIP formal sem sacrificar reatividade.

---

## 6. Design Tree atualizada

A Design Tree de Avaliação de MV (`4 - Avaliação de MV - Design Tree.md`) foi atualizada para refletir ambas as correções. Mudanças:

- **V2.4** (D1.2): de ⚠ Tensão para ✓ Compatível — interpretação de interação é entidade de infraestrutura externa à View em ambas as plataformas.
- **V2.5** (D1.4/G7): de ⚠ Tensão para Neutro — relação script/template é abaixo do nível de MV.
- **V3.4** (P3/SRP): de ⚠ Tensão para ✓ Compatível — View tem uma razão de mudança em ambas as plataformas, com infraestrutura em módulos separados.
- **V3.5** (P2/DIP): de ⚠ Tensão para ⚠ Trade-off explícito — DIP informal (abstração de comportamento) é escolha consciente da Apple.
- **V3.6** (P6/Tell Don't Ask): de ⚠ Tensão para ✓ Compatível — View pratica Tell para decisões, projeção de estado não é Ask.
- **V4.3** (Actions): atualizado para refletir actions como mecanismo de delegação a entidades de infraestrutura.
- **V4.4**: renomeado e reescrito — a diferença é SwiftUI como framework+biblioteca vs Svelte como framework.
- **R (Veredicto)**: de "Sim, com adaptação" para **"Sim"** — MV é compatível; necessidade de biblioteca de UI é questão separada.

---

## 7. Lacuna: ciclo de vida, criação de instâncias e posse

**Mensagem do autor:** A árvore só trata do consumo dos módulos, mas não de seus ciclos de vida, criação de instâncias, posse, etc. Isso não faz parte do escopo de arquitetura?

### Análise

Sim, faz. Arquitetura define entidades, responsabilidades e relações. Ciclo de vida — quem cria, quem possui, quem destrói — é parte de "relações". Quem cria quem estabelece uma direção de dependência. Quem possui quem estabelece uma responsabilidade. A árvore avalia como Model e View *interagem em runtime* mas é silenciosa sobre como *nascem, são conectadas, e morrem*.

### O que MV diz sobre ciclo de vida em Apple

MV na Apple lida com ciclo de vida via property wrappers de SwiftUI:

| Mecanismo | Semântica | Quem decide criação | Quem gerencia lifetime |
|---|---|---|---|
| `@State` | View declara que possui um Model | A View declara; SwiftUI cria e retém | SwiftUI — vive enquanto a View vive |
| `@Environment` | Model é provido por um ancestral | O ancestral decide; SwiftUI injeta | O ancestral — outlives Views individuais |
| `@Bindable` / prop | Model é passado de fora | O pai decide; View recebe | O pai — View não controla lifetime |

Observação crucial: em todos os casos, a View **declara** dependência — não executa criação imperativa. `@State var model = CounterModel()` parece uma criação imperativa, mas é uma declaração: "eu preciso de um CounterModel; SwiftUI, gerencie isso para mim." A criação real é responsabilidade do framework.

Isso é o mesmo padrão que a infraestrutura (seção 4): SwiftUI absorve a mecânica de ciclo de vida, assim como absorve a mecânica de gestos. A View não "decide" criar — declara que precisa. O framework executa.

### Ciclo de vida em termos de UseDD

Criar uma instância é uma decisão — alguém decide *quando* e *com que configuração* uma entidade nasce. Mas é uma decisão de **composição**, não de **negócio**:

- **Decisão de negócio** (runtime): "o que acontece quando o usuário clica?" → pertence ao Model.
- **Decisão de composição** (construction time): "esta View precisa de um Model do tipo X" → pertence ao **composition root**.

São domínios de autoridade diferentes que operam em fases temporais diferentes. A View pode ter autoridade sobre *se o Model existe* (declaração de dependência) sem ter autoridade sobre *o que o Model faz* (lógica de negócio). UseDD constrange a direção de autoridade em cada par — e o par criador→criado é diferente do par decisor→executor em runtime.

Em Apple, o composition root é SwiftUI — é o framework que, a partir das declarações (@State, @Environment), instancia, injeta e destrói. A View é declarante, não criadora.

### Mapeamento para Svelte

| Apple | Svelte | Equivalente? |
|---|---|---|
| `@State var model = Model()` | `const model = new Model()` no `<script>` | Parcial — em Svelte a criação é imperativa, não declarativa. O componente cria, não declara. |
| `@Environment(\.model)` | `getContext('model')` | Parcial — mecanismo similar (injeção por ancestral), mais manual. |
| Prop passado pelo pai | `let { model } = $props()` | ✓ Equivalente direto. |
| SwiftUI gerencia lifetime | Svelte destrói o que o componente cria quando o componente desmonta | ✓ Escopo de componente funciona como lifetime scope. |

A principal diferença: em Svelte, `const model = new Model()` no script é uma **criação imperativa dentro do executor**. A View está *executando* a criação, não *declarando* dependência. Isso é mais acoplado do que a declaração em Apple, mas não viola UseDD — a criação é mecânica de composição, não decisão de negócio. O Model, uma vez criado, é o decisor. Quem o instanciou não tem autoridade sobre o que ele faz.

### Tensão ou compatibilidade?

Ciclo de vida em MV é compatível com Svelte. Os mecanismos mapeiam (escopo de componente, props, context). A diferença é que SwiftUI torna a composição *declarativa* (property wrappers) e Svelte a torna *imperativa* (código no script). Mas essa diferença é de ergonomia, não de arquitetura — assim como a diferença de infraestrutura (seção 4).

Uma tensão genuína existiria se a criação imperativa contaminasse a View com decisões de negócio — ex: `const model = new Model(someComputedConfig)` onde a View computa a configuração. Isso seria a View tomando decisões de composição complexas. Mas isso não é intrínseco a MV — é um erro de implementação.

### Conclusão

A árvore deveria cobrir ciclo de vida. A avaliação será adicionada como V5 na Design Tree. O resultado antecipado é ✓ Compatível — mesma conclusão, mesma razão: MV é compatível, SwiftUI torna a mecânica mais declarativa/automática, Svelte a torna mais manual/imperativa, mas a diferença é ergonomia de ecossistema, não incompatibilidade arquitetural.
