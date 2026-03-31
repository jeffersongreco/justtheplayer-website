# Avaliação de MV para Transporte — Design Tree

> Árvore invertida: múltiplos nós iniciais (cada um testa MV contra uma camada de restrições) convergem a um nó final com veredicto. A pergunta é: "MV, a arquitetura padrão Apple (Observation framework + SwiftUI), é transportável para o domínio de componentes UI reativos com estado em Svelte?"
>
> **Definição de MV sob avaliação:** A arquitetura praticada atualmente no ecossistema Apple: Model (classe/struct @Observable com estado e lógica de transição) + View (struct SwiftUI declarativa que observa o Model diretamente). Duas entidades, sem intermediário (sem ViewModel, Controller, ou Presenter). A View lê estado do Model e chama seus métodos para ações. O framework (SwiftUI + Observation) provê tracking automático, gestos declarativos, animação declarativa, e integração de acessibilidade.

---

## MV — Mapeamento de entidades para termos das árvores anteriores

Antes de testar, é necessário mapear MV ao vocabulário das Design Trees:

| MV (Apple) | Termo UseDD | Papel |
|---|---|---|
| Model | Decisor | Detém estado, define transições, governa lógica de domínio |
| View | Executor | Apresenta estado na tela, coleta interação, toca na DOM/UIKit |
| Observation framework | Infraestrutura de reatividade | Propaga mudanças de estado do Model para a View |
| SwiftUI | Mecanismo do executor | Provê template declarativo, gesture system, animation API |

---

## V1 — MV vs UseDD

### V1.1 — Direção de autoridade (L1.1)

**Teste:** Em MV, quem define a porta?

O Model define a porta: expõe propriedades e métodos. A View implementa essa porta — consome propriedades para apresentar e chama métodos para comunicar ações. A direção de autoridade é Model → View.

**Resultado:** ✓ Compatível.

### V1.2 — Separação de nível de responsabilidade (L2.1)

**Teste:** O Model decide sem executar? A View executa sem decidir?

O Model detém estado e define transições — decide. Não toca em UI. A View declara como o estado é apresentado — executa. Não define transições.

**Resultado:** ✓ Compatível.

### V1.3 — Cadeia de autoridade (L2.5, L2.6)

**Teste:** A cadeia traça de volta ao humano?

Humano (usuário) → porta UX → View → percepção e interação.
Humano (desenvolvedor) → porta DX → Model API → configuração e composição.
Model → View → DOM/UIKit. Cadeia finita, acíclica, raiz no humano.

**Resultado:** ✓ Compatível.

### V1.4 — Vocabulário da porta (L2.3)

**Teste:** A porta é expressa na linguagem do decisor?

O Model expõe propriedades em vocabulário de domínio (`isActive`, `position`, `phase`). A View consome esse vocabulário. O Model não fala linguagem de apresentação.

**Resultado:** ✓ Compatível.

### V1.5 — Especificação como critério de correção (L2.4)

**Teste:** A implementação é verificável contra a especificação?

O Model pode ser testado contra a porta DX (interface técnica). A View pode ser verificada contra a porta UX (comportamento percebido). MV não impede verificação.

**Resultado:** ✓ Compatível.

### Veredicto V1

**MV é compatível com UseDD. Nenhuma tensão identificada.** O princípio de Model-como-decisor e View-como-executor satisfaz todos os nós de UseDD.

---

## V2 — MV vs Restrições de Domínio

### V2.1 — Tocar na DOM é execução (D1.1)

**Teste:** Quem toca na DOM em MV?

A View. O Model nunca toca na DOM. A View é executora, o Model é decisor.

**Resultado:** ✓ Compatível.

### V2.2 — Duas portas externas (D1.3)

**Teste:** MV suporta as duas portas?

Porta UX: expressa como comportamento percebido pelo usuário — implementada pela View. Porta DX: expressa como interface técnica para o desenvolvedor — implementada pelo Model (API pública). MV naturalmente mapeia uma porta para cada entidade.

**Resultado:** ✓ Compatível.

### V2.3 — Reatividade não origina autoridade (D2.4)

**Teste:** A reatividade em MV origina decisões?

Observation framework propaga mudanças de estado do Model para a View. O Model decide quando e como o estado muda; a reatividade transmite. Se o Model muda `isActive` para `true`, a reatividade faz a View refletir — mas quem decidiu foi o Model.

**Resultado:** ✓ Compatível.

### V2.4 — Interpretar interação é decisão (D1.2)

**Teste:** Quem interpreta interações em MV?

**Em Apple:** SwiftUI provê um sistema declarativo de gestos (`.onTapGesture`, `.gesture(DragGesture())`, `.onKeyPress`). A View *declara* que tipo de gesto escuta, e o framework interpreta os eventos brutos (coordenadas, thresholds, estado do gesto) internamente. A interpretação é feita por *entidades de infraestrutura* do framework — o gesture recognizer, o hit testing system — não pela View nem pelo Model. A View recebe gestos já interpretados.

**Na web/Svelte:** O browser provê eventos brutos (`pointermove`, `keydown`, coordenadas em pixels). Não há sistema de gestos declarativo comparável. Interações complexas — distinguir click de drag, calcular posição relativa a um container, aplicar thresholds — exigem código imperativo que *interpreta* eventos brutos em intenções de domínio. Esse código precisa de uma entidade — mas essa entidade não precisa ser a View nem o Model. Ela pode ser uma entidade de infraestrutura externa (uma biblioteca), exatamente como o gesture recognizer do SwiftUI é uma entidade de infraestrutura externa à View.

A diferença entre Apple e Svelte não é que MV em Apple tem menos entidades — é que a entidade de interpretação de interação vem **pronta** no SwiftUI e precisa ser **fornecida** no Svelte. MV como arquitetura não absorve essa entidade na View em nenhuma das duas plataformas.

**Resultado:** ✓ Compatível. A interpretação de interação é responsabilidade de uma entidade de infraestrutura, não da View. Em Apple ela existe no framework; em Svelte precisa ser fornecida como biblioteca. Isso não é uma questão de arquitetura MV — é uma questão de ecossistema.

### V2.5 — Script e template: três relações (D1.4)

**Teste:** MV resolve as três relações identificadas em D1.4?

Em Apple, não existe a distinção script/template — SwiftUI é um único mecanismo declarativo com escapes imperativos pontuais. No browser/Svelte, a View é composta de template (declarativo) e script (imperativo). MV não endereça a relação script→template (D1.4 relação 3) porque em Apple essa relação não existe da mesma forma.

**Resultado:** Neutro. MV não resolve G7 (papel do script) e não precisa — G7 é uma questão de organização interna da View, abaixo do nível que MV prescreve. MV diz "View é executor"; como a View internamente distribui trabalho entre script e template é decisão de convenção, não de arquitetura.

### Veredicto V2

**MV é compatível com todas as restrições de domínio testadas (D1.1, D1.3, D2.4, D1.2).** A interpretação de interação (D1.2) é responsabilidade de entidades de infraestrutura que existem em ambas as plataformas — no SwiftUI como módulos do framework, no Svelte como bibliotecas a serem fornecidas. A relação script/template (D1.4/G7) é abaixo do nível de MV.

---

## V3 — MV vs Princípios de Engenharia

### V3.1 — SSOT (P1)

**Teste:** O Model é fonte canônica?

O Model detém todo o estado de domínio. A View não mantém estado próprio além de estado efêmero de UI (scroll position, focus). O Model é a fonte canônica.

**Resultado:** ✓ Compatível.

### V3.2 — Coesão (P4)

**Teste:** Cada domínio de decisão tem um responsável completo?

O Model detém todo o domínio de lógica de negócio. A View não toma decisões de negócio. O domínio de decisão é completo no Model.

**Resultado:** ✓ Compatível.

### V3.3 — Simplicidade (P7)

**Teste:** A cadeia tem o mínimo de entidades necessário?

Duas entidades: Model e View. É o mínimo que D2.1 (Restrições de Domínio) permite: pelo menos uma decisora, pelo menos uma executora. MV está no limite inferior.

**Resultado:** ✓ Compatível — *se* o mínimo for suficiente. Se outras restrições exigirem mais entidades, P7 não é violado por adicioná-las (P7 exige o mínimo *necessário*, não o mínimo absoluto).

### V3.4 — SRP (P3)

**Teste:** Cada entidade tem uma razão de mudança?

**Model:** Muda quando a lógica de negócio muda. Uma razão de mudança. ✓

**View em Apple:** Muda quando a apresentação muda. Gestos, animações, e acessibilidade são entidades de infraestrutura do SwiftUI — módulos separados que a View *usa*, não código que a View *contém*. A View do desenvolvedor é declarativa. Uma razão de mudança. ✓

**View em Svelte:** Muda quando a apresentação muda. Gestos, animações, e acessibilidade são igualmente entidades separadas — com a diferença de que em Svelte precisam ser fornecidas como biblioteca em vez de virem embutidas no framework. Se o desenvolvedor coloca esse código *dentro* da View, a View acumula razões de mudança — mas isso é um erro de implementação, não uma consequência de MV. MV prescreve que a View é executor de apresentação; trabalho de interpretação de interação, animação imperativa, e gestão de acessibilidade pertence a outras entidades, em ambas as plataformas.

**Resultado:** ✓ Compatível. O Model satisfaz P3. A View satisfaz P3 em ambas as plataformas — desde que entidades de infraestrutura (gestos, animação, a11y) existam como módulos separados. A diferença entre Apple e Svelte não é arquitetural (MV) — é de ecossistema (SwiftUI provê essas entidades; Svelte demanda uma biblioteca).

### V3.5 — DIP (P2)

**Teste:** Entidades dependem de abstrações ou de implementações concretas?

Em MV, a View depende do *tipo concreto* do Model — não de um protocolo/interface formal. A View chama `model.increment()` e lê `model.count` para projetar na tela. Formalmente, isso viola DIP: não há abstração intermediária entre View e Model.

Porém, há uma distinção relevante entre dois níveis de abstração:

1. **Abstração de tipo** (protocolo/interface): desacopla *qual* objeto é usado. MV não pratica isso — a View conhece o tipo concreto.
2. **Abstração de comportamento** (encapsulamento): esconde *como* funciona internamente. MV pratica isso — a View chama `model.increment()` sem saber a implementação. Os métodos públicos do Model *são* abstrações, mesmo sem interface formal.

A Apple sacrifica DIP formal (abstração de tipo) conscientemente: o Observation framework (`@Observable`) depende de tipos concretos para tracking automático de reatividade. Usar protocolos (`any Protocol`) quebra a reatividade. O trade-off é explícito: reatividade automática em troca de acoplamento ao tipo concreto.

O que seria violação real de DIP: a View acessando internals do Model (`model.count += 1`, `model.networkService.sync()`). O que MV pratica: a View chama métodos semânticos e lê propriedades expostas — depende do *contrato comportamental*, não da implementação. O enforcement desse contrato é por convenção (métodos públicos), não por compilador (protocolo). É DIP informal.

**Resultado:** ⚠ Trade-off explícito. MV pratica DIP informal (abstração de comportamento) mas não DIP formal (abstração de tipo). A Apple faz essa escolha conscientemente por incompatibilidade entre protocolos e Observation framework. É uma decisão pragmática — não uma falha arquitetural — com risco conhecido: sem enforcement de compilador, a disciplina depende do desenvolvedor.

### V3.6 — Tell Don't Ask (P6)

**Teste:** O executor recebe instruções completas ou consulta o decisor?

Tell Don't Ask diz: "diga a um objeto o que fazer, não pergunte seu estado para decidir por ele." O princípio se aplica a **decisões de negócio** — a View não deve ler estado do Model para tomar decisões que pertencem ao Model.

Em MV state-driven, a View participa de dois fluxos:

1. **View → Model (ações):** A View chama métodos semânticos no Model: `model.increment()`, `model.startDrag(at: position)`. A View diz ao Model o que fazer sem perguntar estado para decidir. Isso *é* Tell clássico. ✓

2. **Model → View (projeção):** A View lê estado do Model para projetar na tela: `Text("\(model.count)")`, `{model.count}`. A View está "lendo" estado — mas não para tomar decisões de negócio. Está projetando estado em pixels, que é exatamente sua responsabilidade como executor de apresentação. Ler estado para projetar não é Ask — é a View cumprindo sua função.

O que seria violação de P6:
```
// ❌ View lendo estado para tomar decisão de negócio (Ask)
if model.count >= 10 { model.reset() }

// ✓ View delegando decisão ao Model (Tell)
model.increment()  // Model sabe quando resetar
```

**Resultado:** ✓ Compatível. MV state-driven pratica Tell para decisões de negócio (View chama ações semânticas) e projeção para apresentação (View lê estado para exibir). A projeção de estado não viola P6 porque P6 constrange decisões, não renderização.

### V3.7 — OCP (P5)

**Teste:** Portas acomodam variação previsível?

MV não prescreve a forma das portas — isso é decisão do Model. P5 é testável no nível da implementação concreta, não no nível do padrão arquitetural.

**Resultado:** Neutro. P5 não é constrangido nem violado por MV como padrão.

### Veredicto V3

**MV é compatível com P1 (SSOT), P3 (SRP), P4 (coesão), P5 (OCP — neutro), P6 (Tell Don't Ask), P7 (simplicidade). Trade-off explícito em P2 (DIP — abstração comportamental sem enforcement formal).** O trade-off com P2 é uma decisão pragmática da Apple, consciente e com risco conhecido. Não é uma incompatibilidade arquitetural — é uma escolha de enforcement que pode ser resolvida de formas diferentes em cada plataforma.

---

## V4 — MV vs Mecanismos Obrigatórios de Svelte

> Svelte impõe mecanismos que não são negociáveis. Não são "convenções" escolhidas pelo desenvolvedor — são regras do framework. A avaliação testa se MV funciona *dentro* dessas regras.

### V4.1 — Componentes `.svelte` = template + script em um arquivo

**Fato Svelte:** Um componente é um arquivo `.svelte` que contém `<script>`, markup (template), e `<style>`. O script e o template coexistem no mesmo arquivo, no mesmo escopo.

**Impacto em MV:** A View em MV mapearia para um componente `.svelte`. O Model mapearia para um módulo `.svelte.ts` (runes funcionam fora de componentes) ou `.ts` (lógica pura). Esse mapeamento é direto — Model e View em arquivos separados.

**Resultado:** ✓ Compatível. A separação Model/View em arquivos distintos é possível.

### V4.2 — Runes como mecanismo de reatividade

**Fato Svelte:** `$state`, `$derived`, `$effect` são os primitivos de reatividade. São compilados pelo Svelte e funcionam em `.svelte` e `.svelte.ts`. Não são opcionais — são o mecanismo padrão.

**Impacto em MV:** O Model usa `$state` e `$derived` para estado reativo. A View consome esse estado no template. Runes cumprem o papel do Observation framework: propagam mudanças do Model para a View. A direção de propagação é idêntica.

**Resultado:** ✓ Compatível. Runes são análogas ao Observation framework.

### V4.3 — Actions (`use:`) para DOM imperativo

**Fato Svelte:** Actions são a forma idiomática de Svelte para código imperativo que manipula um elemento DOM. Recebem o elemento e retornam lifecycle hooks.

**Impacto em MV:** Trabalho imperativo na DOM (WAAPI, listeners, focus management) pode viver em actions. Actions são *invocadas* pelo template — o template delega trabalho DOM a elas. São o mecanismo de Svelte para entidades de infraestrutura imperativa: o equivalente funcional de como SwiftUI delega gestos ao gesture recognizer.

**Resultado:** ✓ Compatível. Actions são o mecanismo pelo qual a View delega trabalho imperativo a entidades de infraestrutura, mantendo a View declarativa.

### V4.4 — Infraestrutura de UI: SwiftUI como framework + biblioteca vs Svelte como framework

**Fato Svelte:** Svelte não provê reconhecimento de gestos, API de animação declarativa comparável a `withAnimation`, nem integração de acessibilidade além de atributos HTML padrão. `svelte/animate` e `svelte/transition` cobrem casos simples; interações complexas (drag, multi-touch) e animações imperativas (WAAPI) exigem código do desenvolvedor.

**Impacto em MV:** SwiftUI é simultaneamente um **framework** (mecanismo de componentes, reatividade, rendering) e uma **biblioteca de UI** (gesture recognizers, animation API, accessibility API, navigation). Svelte é um framework — provê os mecanismos — mas não é uma biblioteca de UI comparável.

Em Apple, as entidades de infraestrutura (gesture recognizer, animation system) existem como módulos do SwiftUI. A View não contém esse código — *declara* que usa esses módulos. Em Svelte, essas entidades não existem embutidas. Precisam ser fornecidas como bibliotecas externas. Mas em ambos os casos, as entidades são **externas à View** — não fazem parte da arquitetura MV.

A diferença entre as plataformas não é a quantidade de entidades nem a forma de MV — é se as entidades de infraestrutura vêm pré-construídas ou precisam ser construídas.

**Resultado:** ✓ Compatível com MV. A ausência de infraestrutura de UI em Svelte é uma questão de ecossistema, não de arquitetura. MV funciona da mesma forma em ambas as plataformas — a View é declarativa e delega trabalho imperativo a entidades de infraestrutura. O que muda é se essas entidades precisam ser providas pelo desenvolvedor (via biblioteca) ou vêm com o framework.

### Veredicto V4

**Os mecanismos de Svelte (componentes, runes, actions) são compatíveis com MV. A infraestrutura ausente (gestos, animação, a11y) é uma questão de ecossistema separada da avaliação arquitetural.** Svelte provê os primitivos para que MV funcione; a necessidade de uma biblioteca de UI é uma consequência de Svelte ser framework sem ser biblioteca, não de MV ser incompatível.

---

## V5 — MV vs Ciclo de Vida (criação, posse, destruição)

> Faltava na avaliação original. Arquitetura define entidades, responsabilidades e relações — e ciclo de vida (quem cria, quem possui, quem destrói) é parte de "relações".

### V5.1 — Quem cria o Model?

**Em Apple:** A View *declara* dependência via property wrappers (`@State var model = CounterModel()`). SwiftUI instancia, retém e destrói. A View não executa criação imperativa — declara que precisa. O framework (composition root) gerencia a mecânica.

**Em Svelte:** O componente executa criação imperativa no `<script>` (`const model = new Model()`), ou recebe o Model via props (`let { model } = $props()`), ou obtém via context (`getContext('model')`).

**Resultado:** ✓ Compatível. Em ambas as plataformas, existem mecanismos para criação local (escopo do componente), injeção por ancestral (Environment / Context), e passagem explícita (props). A diferença é que Apple torna a composição declarativa (property wrappers) e Svelte a torna imperativa (código no script). É diferença de ergonomia, não de arquitetura.

### V5.2 — Quem possui o Model? (lifetime ownership)

**Em Apple:** O Model vive enquanto a View que o declara via `@State` vive. Se a View desaparece, o Model é destruído. Se o Model é compartilhado via `@Environment`, ele outlives Views individuais — o ancestral que o forneceu é o owner.

**Em Svelte:** O escopo do componente funciona como lifetime scope. `const model = new Model()` no script vive enquanto o componente estiver montado — `$effect` pode ser usado para cleanup. Se o Model é provido via `setContext`, outlives componentes filhos — o ancestral é o owner. Se o Model é importado de um módulo `.svelte.ts`, é efetivamente singleton.

**Resultado:** ✓ Compatível. Os padrões de ownership mapeiam: escopo local (State / script), compartilhado por ancestral (Environment / Context), singleton (module-level). Svelte é mais explícito sobre lifecycle management, mas os padrões são os mesmos.

### V5.3 — Criação como decisão: tensão com UseDD?

**Teste:** Se a View cria o Model, a View está tomando uma decisão — o que violaria a separação decisor/executor?

Criar uma instância é uma decisão de **composição** (construction time), não de **negócio** (runtime). São domínios de autoridade diferentes, em fases temporais diferentes:

- **Composição:** "Esta View precisa de um Model do tipo X." → Quem instancia decide que a entidade existe.
- **Negócio:** "O que acontece quando o usuário clica?" → O Model decide durante a operação.

A View pode ter autoridade sobre *se o Model existe* sem ter autoridade sobre *o que o Model faz*. UseDD constrange a direção de autoridade em cada par — e o par criador→criado é diferente do par decisor→executor em runtime. Uma vez criado, o Model é o decisor; quem o instanciou não controla o que ele faz.

**Resultado:** ✓ Sem tensão. Composição e operação são domínios de autoridade distintos. A View que instancia o Model não viola UseDD — assim como uma fábrica que cria um gerente não tem autoridade sobre as decisões do gerente.

### V5.4 — Wiring: quem conecta Model a View?

**Em Apple:** SwiftUI é o composition root implícito. Property wrappers (@State, @Environment) declaram dependências; o framework resolve injeção, scoping e propagação de reatividade.

**Em Svelte:** Não há composition root implícito. O desenvolvedor conecta Model a View explicitamente: instanciando no script, passando via props, ou compartilhando via Context. Runes ($state, $derived) resolvem a propagação de reatividade, mas o wiring é manual.

**Resultado:** ✓ Compatível. O wiring funciona em ambas as plataformas. A diferença é automação: Apple tem um composition root implícito (SwiftUI), Svelte exige composição explícita. Novamente, é diferença de ergonomia de ecossistema — SwiftUI como framework + biblioteca provê mais automação do que Svelte como framework.

### Veredicto V5

**MV é compatível com Svelte no aspecto de ciclo de vida.** Criação, posse, destruição e wiring mapeiam para mecanismos existentes de Svelte (escopo de componente, props, Context, runes). A diferença entre plataformas é o grau de automação: SwiftUI provê composição declarativa via property wrappers; Svelte exige composição imperativa no script. Essa diferença segue o mesmo padrão identificado em V4.4 — é uma questão de infraestrutura de ecossistema, não de compatibilidade arquitetural.

---

## R — Resultado: MV é transportável para Svelte?

### Consolidação

| Camada | Resultado |
|---|---|
| UseDD (V1) | ✓ Compatível — nenhuma tensão |
| Restrições de Domínio (V2) | ✓ Compatível — D1.2 resolvido por entidades de infraestrutura externas à View |
| Princípios de Engenharia (V3) | ✓ Compatível — trade-off explícito em P2 (DIP informal) |
| Mecanismos de Svelte (V4) | ✓ Compatível — mecanismos mapeiam, infraestrutura de UI é questão de ecossistema |
| Ciclo de Vida (V5) | ✓ Compatível — criação, posse e wiring mapeiam para mecanismos de Svelte |

### O único trade-off

**P2 (DIP):** MV pratica abstração de comportamento (métodos semânticos) sem abstração de tipo formal (protocolo/interface). A Apple faz essa escolha conscientemente por incompatibilidade entre protocolos e Observation framework. O risco é enforcement por convenção em vez de enforcement por compilador. Esse trade-off pode ser resolvido de formas diferentes em cada plataforma — em Svelte, runes não têm a mesma incompatibilidade com interfaces TypeScript que @Observable tem com protocolos Swift, o que abre a possibilidade de DIP formal sem sacrificar reatividade.

### O que não é questão de MV

A diferença entre desenvolver com SwiftUI e com Svelte não é arquitetural — é de **ecossistema**. SwiftUI é framework + biblioteca de UI (gesture recognizers, animation API, accessibility API). Svelte é framework sem biblioteca de UI comparável. As entidades de infraestrutura (interpretação de gestos, animação imperativa, gestão de acessibilidade) existem em ambas as plataformas — em Apple vêm embutidas, em Svelte precisam ser fornecidas. Essa necessidade é independente de MV: qualquer arquitetura em Svelte precisaria dessas entidades.

### Veredicto

**Resposta: Sim.**

MV — Model como decisor único, View como executor declarativo, reatividade como mecanismo de propagação — é transportável para Svelte. Satisfaz UseDD, as restrições de domínio, e os princípios de engenharia. O transporte não requer adaptação da arquitetura — requer:

1. **Uma biblioteca de UI para Svelte** que forneça as entidades de infraestrutura que SwiftUI inclui (gestos, animação, a11y). Isso não é uma adaptação de MV — é preenchimento de uma lacuna do ecossistema.
2. **Decisão sobre DIP formal:** avaliar se em Svelte o trade-off da Apple (DIP informal) faz sentido ou se interfaces TypeScript permitem DIP formal sem sacrificar reatividade.
