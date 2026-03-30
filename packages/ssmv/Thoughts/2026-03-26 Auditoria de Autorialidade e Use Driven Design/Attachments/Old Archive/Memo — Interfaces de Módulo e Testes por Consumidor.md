# Memo: Interfaces de Módulo e Testes por Consumidor

**Contexto:** A arquitetura MV define interfaces formais no nível de _pacote_ (`Interface.md`, §16) e estratégias de teste por camada (`Testing.md`, §10). Mas nenhum dos dois documentos trata a interface de cada _módulo interno_ como um contrato próprio, derivado de quem consome aquele módulo. Este memo explora o que muda quando essa lógica é aplicada consistentemente em toda a hierarquia.

---

## O Princípio

A regra do §16 é: **toda exportação pública é uma promessa ao consumidor, e `Interface.md` é a autoridade sobre o que foi prometido**. A implementação satisfaz a interface; se divergem, a implementação está errada.

A mesma lógica se aplica dentro do pacote, módulo a módulo. Cada módulo tem exatamente um consumidor primário. Esse consumidor define o que o módulo deve fazer — não o que o módulo faz por coincidência de implementação. A interface do módulo é o que o consumidor pode _observar e depender_, não o que o módulo _expõe acidentalmente_.

---

## Mapeamento de Consumidores por Módulo

| Módulo | Consumidor primário | Natureza da interface |
|---|---|---|
| **Model** | Coordinator + View (leem estado); Interactions (chamam métodos) | Máquina de estados: métodos de transição + estado reativo |
| **Coordinator** | Model (mudanças de estado ativam o Coordinator) | Contrato reativo: (transição de estado → efeito DOM esperado) |
| **Interactions** | DOM (eventos de entrada) + Model (métodos chamados de saída) | Dois lados: handler de evento de entrada; chamador de método de saída |
| **Utils / Helpers** | Qualquer módulo que os chama | Função pura: (input → output) sem surpresas |

A diferença em relação ao estado atual: o Coordinator não é "a camada de DOM que não tem interface testável". Ele tem uma interface precisa — mas ela é reativa, não imperativa. "Quando o consumidor muta `model.isAnimating` para `true`, o Coordinator inicia a animação WAAPI no `el`" é uma afirmação de interface tão verificável quanto "quando `request()` é chamado, a animação começa".

---

## O que muda na prática, por módulo

### Model

Sem mudança estrutural. O Model já é testado por contrato via testes automatizados derivados do Behavioral Spec. O que pode melhorar é a consciência explícita de que _o Coordinator é um consumidor_ tanto quanto a View — o que implica que estado interno que o Coordinator precisa deve ser parte da interface do Model, não um vazamento acidental.

### Coordinator

A mudança mais significativa. Hoje o Coordinator tem checklist manual — mas esse checklist é escrito por memória/intuição, não derivado de um contrato documentado.

A proposta: o Coordinator tem um "Contrato Reativo" — uma tabela de (pré-condição de estado → efeito esperado no DOM). Por exemplo:

| Pré-condição | Efeito esperado |
|---|---|
| `isAnimating` muda de `false` → `true` | A animação WAAPI começa no elemento alvo |
| `paused` muda de `false` → `true` enquanto animando | A animação pausa sem cancelar |
| `isAnimating` muda de `true` → `false` por `cancel()` | A animação é interrompida; o elemento retorna ao estado neutro |

O checklist da dev page passa a ser _derivado_ desse contrato — exatamente como os testes automatizados do Model são derivados do Behavioral Spec. A relação é análoga; só a forma de verificação difere (humano na dev page em vez de runner automático).

### Interactions

A Interaction tem dois lados e, portanto, dois consumidores:

1. **Lado de entrada:** o DOM entrega eventos (`pointerdown`, `pointermove`, etc.). A interface aqui é: "dado este evento com estas propriedades, qual transição de Model é chamada?"
2. **Lado de saída:** o Model recebe as chamadas. Esse lado _já é testado indiretamente_ quando o Model é testado — se `model.began()` produz a transição correta, o lado de saída da Interaction está correto, desde que ela chame o método certo.

O gap está no **lado de entrada**: nenhum documento descreve o que a Interaction faz com cada evento. Se a Interaction chama `began()` quando deveria chamar `changed()`, os testes do Model passam, o efeito no Coordinator é errado, e o diagnóstico é difícil porque a falha aparece "longe" do bug.

Documentar o lado de entrada da Interaction (mesmo que só como checklist manual da dev page) fecha esse gap de diagnóstico.

### Utils / Helpers

Sem mudança. Utils são pure functions; seus consumidores são diretos; testes automatizados já são a estratégia correta. O único ajuste é de consciência: Utils também têm interfaces — e se um Utils tem um contrato que vale documentar (precondições, invariantes), esse contrato pertence ao arquivo ou ao JSDoc, não fica implícito no nome da função.

---

## Pontos Cegos

### 1. A linha entre "interface de módulo" e "duplicar o Behavioral Spec"

O Behavioral Spec já descreve o que o sistema faz. Um contrato de Coordinator que lista as mesmas transições pode parecer redundante. A distinção crítica: o Behavioral Spec descreve comportamento **sem atribuir responsabilidade**; o contrato do Coordinator descreve **quais comportamentos ele especificamente implementa**. Um é sobre o sistema; o outro é sobre divisão de trabalho.

Sem essa distinção clara, os contratos de módulo se tornam duplicatas — e duplicatas ficam desincronizadas.

### 2. A interface do Coordinator não tem forma tipada

Model interfaces existem como tipos TypeScript. Utils existem como assinaturas de função. O contrato reativo do Coordinator não tem equivalente natural em TypeScript — não há como tipar "quando `$state.x` muda para `true`, isso acontece". As opções são:

- Tabela markdown no arquivo do Coordinator (ou em um `Coordinator.md` interno)
- Tags de comentário estruturadas no código (`// Contract: isAnimating → ...`)
- O checklist da dev page _é_ o contrato (a dev page formaliza o que o módulo promete)

Essa é uma **decisão de design a ser tomada antes de implementar** qualquer contrato de Coordinator. A forma que a documentação toma afeta onde a verdade vive e quem a atualiza.

### 3. Interactions com dois consumidores: qual tem prioridade no contrato?

Se a Interaction cobre dois lados, um contrato único pode ser ambíguo. A pergunta prática: quando um teste falha (manual ou automatizado), como o desenvolvedor sabe se o bug está no lado de entrada (event → call) ou no lado de saída (call → Model)?

Uma Interaction com contrato explícito nos dois lados torna esse diagnóstico direto. Sem isso, Interactions continuam sendo "caixa cinza" — sabe-se o que entra e o que sai do pacote, mas não onde dentro da Interaction uma falha pode estar.

### 4. Granularidade: Utils de uma linha não precisam de contrato formal

Aplicar contratos de módulo a todo Utils seria over-engineering. A heurística relevante: um Utils precisa de contrato explícito quando tem precondições não-óbvias, comportamento em edge cases, ou quando múltiplos módulos dependem dele de formas que podem divergir. Funções triviais não precisam de documentação além do nome e tipo.

O risco é o inverso: assumir que todo Utils é trivial e descobrir tarde que um tem invariantes implícitas que ninguém documentou.

---

## Decisões Prerequisito

Antes de adotar esse padrão formalmente, três decisões precisam ser tomadas:

**1. Onde vive o contrato do Coordinator?**
Opções: arquivo markdown interno, comentários estruturados no código, ou a dev page _é_ o contrato. Cada opção tem trade-offs de manutenção e visibilidade.

**2. O contrato da Interaction é um documento separado ou parte do contrato do Coordinator?**
Como Interaction → Model → Coordinator é uma pipeline, pode fazer sentido descrever o contrato como um fluxo contínuo em vez de três contratos separados. Mas fluxos contínuos são mais difíceis de auditar por módulo.

**3. O checklist da dev page deve ser explicitamente derivado dos contratos de módulo?**
Hoje o checklist é ad hoc. Se os contratos de Coordinator e Interaction existirem como documentos, o checklist pode ser gerado (ou pelo menos organizado) por eles — igual ao modelo "Behavioral Spec → testes automatizados" aplicado à verificação manual.

---

## Relação com §10 (Testing.md)

Testing.md já diz: "se os testes do Model passam mas o comportamento está errado, o bug está no Coordinator ou na View — a arquitetura dá isolamento de falhas de graça." Esse isolamento pressupõe que o Coordinator tem um contrato implícito que o desenvolvedor conhece. O que este memo propõe é tornar esse contrato explícito — o que melhora o isolamento de falhas de ad hoc para sistemático.

A mudança em Testing.md seria pequena: a estratégia de teste do Coordinator deixa de ser "checklist da dev page" genérico e passa a ser "checklist derivado do Contrato Reativo do Coordinator". O mesmo runner, a mesma dev page — mas com rastreabilidade do que está sendo verificado e por quê.

---

## Resumo da Recomendação

Adotar o princípio "cada módulo tem um consumidor e, portanto, uma interface" como regra arquitetural explícita. Isso não requer criar documentação para todos os módulos imediatamente — requer que, ao criar ou alterar um módulo, a primeira pergunta seja: **quem consome isso e o que eles dependem?**

A formalização prática em ordem de impacto:

1. **Coordinator:** documentar o Contrato Reativo (tabela de estado → efeito DOM) como fonte do checklist da dev page
2. **Interactions:** documentar o lado de entrada (evento → chamada de Model) para fechar o gap de diagnóstico
3. **Utils:** adicionar JSDoc com precondições e invariantes quando não triviais
4. **Model:** sem mudança — já é o módulo mais bem documentado pela sua natureza de máquina de estados

Nenhuma dessas formalizações muda a _arquitetura_. Elas mudam o processo de desenvolvimento: de "escrever código e verificar manualmente" para "declarar o contrato, implementar contra ele, e verificar que o contrato está sendo cumprido".


---

## Alinhamento:

O meu modelo mental é o seguinte:

1. Vou criar um modifier porque quero o seguinte comportamento em um elemento. Eu escrevo todos os "sub-compartamentos". -> Isso se torna os requisitos para definição do Model.
2. Penso como será a DX do modifier, qual o setup, quais configs obrigatórias e opcionais, etc. -> Isso vira o Interface do Model.
3. Os testes do Model são sobre "todas as vezes que um consumidor usa a Interface do Model acontece a mudança de estado esperada?".
4. O comportamento demanda manipulação da de DOM, então um Coordinator precisa existir. Eu já sei qual manipulação de DOM é necessária e quando. -> Daqui sai o Interface do Coordinator, o consumidor (Model) quando entra em determinado estado, espera que determinada manipulação aconteça. **Aqui está o detalhe:** o Coordinador não é algo diferente por ser state-driven, ele é uma classe como qualquer outra, com funções, só que ele tem um `$effect` dentro que vai executar essas funções automaticamente (o consumidor não precisa imperativamente executar elas e nem passar as props, que ele também automaticamente sabe observando o Model), então ele pode ter um `interface SomeCoordinator` com todas as suas funções (funções com suas props).
5. Os testes do Coordinator são sobre "quando o consumidor estiver nesse estado essa função é automaticamente executada e a tarefa dela é concluída corretamente?" (Os testes podem testar o Coordinador de forma isolada dando os sinais que o Model daria)
6. O Interaction também tem seu contrato do lado que fica entre ele e o Model. O lado entre ele e DOM é considerado comunicação com sistema de terceiros, você espera que sempre que o usuário clicar em um botão, o browser vai efetuar o evento sem falhar. Assim não há o caso "O Interaction recebeu informação errada", só o caso "ele não fez nada, porque não estava ouvindo o evento".

---

## Formalização Técnica

### Princípio fundamental: o Model define todos os contratos inter-módulo

O Model não tem apenas sua própria interface — ele define a interface de todos os módulos que o servem. Quem vai receber inputs do usuário (Interactions) e quem vai executar efeitos DOM (Coordinators) implementam contra contratos que o Model declara. Os outros módulos não definem o que oferecem; eles definem o que o Model precisa que eles ofereçam.

O Movable já aplica isso: `MovableInteraction` vive em `Movable.internal-types.ts`, lado a lado com os tipos do Model. É o Model dizendo "aqui está minha superfície como vista por uma Interaction". A `MovableDragInteraction` e a `MovableKeyboardInteraction` recebem esse tipo e chamam seus métodos — elas não definem o protocolo, elas o respeitam.

---

### Model: a interface pública é um tipo TypeScript, os testes são sobre ela

O passo 2 do modelo mental — "penso como será a DX do modifier" — resulta em um tipo exportado:

```ts
interface SomeModel {
  // Estado observável (saída — prefixo is*)
  readonly isAnimating: boolean
  readonly isPaused: boolean

  // Métodos (entrada — o que o consumidor pode comandar)
  request(animation: Animation, reducedMotion?: Animation): void
  cancel(): void
}
```

Os testes do Model verificam exatamente essa superfície:

```ts
const model = new SomeModelImpl(config)

model.request(bounce)
expect(model.isAnimating).toBe(true)

model.cancel()
expect(model.isAnimating).toBe(false)
```

Nenhum teste atravessa implementação interna. Campos privados e helpers são invisíveis para o teste.

---

### Coordinator: a interface são os métodos; o `$effect` é detalhe de ativação

O ponto 4 do modelo mental resolve o blind spot central do memo: o Coordinator não é uma exceção arquitetural sem forma tipada — ele é uma classe com funções, e a interface são essas funções.

```ts
interface SomeCoordinator {
  startAnimation(el: Element, animation: Animation): void
  pauseAnimation(): void
  resumeAnimation(): void
  cancelAnimation(el: Element): void
}
```

A implementação usa `$effect` para chamar esses métodos automaticamente quando o Model muda de estado — mas o `$effect` é o mecanismo de ativação, não a interface. A analogia: um event listener não é a função que ele chama; a função é o contrato.

```ts
class SomeCoordinatorImpl implements SomeCoordinator {
  constructor(private model: SomeModel, private el: Element) {
    $effect(() => {
      if (model.isAnimating) this.startAnimation(el, model.currentAnimation)
      else this.cancelAnimation(el)
    })
  }

  startAnimation(el: Element, animation: Animation) { /* WAAPI aqui */ }
  cancelAnimation(el: Element) { /* ... */ }
}
```

#### Testes do Coordinator com DOM (JSDOM + Playwright)

O Coordinator é testável com DOM real — basta criar um `$state` stub com a forma do Model e observar os efeitos no elemento:

```ts
const fakeModel = $state<SomeModel>({
  isAnimating: false,
  isPaused: false,
  request() {},
  cancel() {},
})

const el = document.createElement('div')
document.body.appendChild(el)
const coordinator = new SomeCoordinatorImpl(fakeModel, el)

fakeModel.isAnimating = true

// Tudo isso é verificável em JSDOM:
expect(el.classList.contains('is-animating')).toBe(true)
expect(el.getAttribute('aria-busy')).toBe('true')
expect(el.getAnimations().length).toBeGreaterThan(0)
expect(el.getAnimations()[0].id).toBe('bounce') // ID na animação para assertar qual é

// Live region disparou?
const liveRegion = document.querySelector('[aria-live]')
expect(liveRegion?.textContent).toContain('animating')

// Focus state após tab:
el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }))
expect(document.activeElement).toBe(el)
```

O JSDOM cobre a vasta maioria dos efeitos DOM: classes, atributos, ARIA, live regions, focus, estrutura de elementos (presença/ausência de nós), e `getAnimations()` no nível básico. **Tudo que puder ser automatizado, deve ser.** A fronteira do JSDOM só aparece em efeitos que dependem de layout computado (geometria real, scroll) ou timing preciso de WAAPI — esses vão para Playwright.

#### Três níveis de verificação, com clareza de onde vai cada coisa

| Nível | O que verifica | Ferramenta | Quem executa |
|---|---|---|---|
| **DOM automatizado** | Classes, atributos, ARIA, focus, live regions, presença de elementos, ID de animação | Vitest + JSDOM | CI |
| **Browser automatizado** | Layout real, timing de animação, CSS computed, interações gestuais | Playwright | CI (pipeline lento) |
| **Visual manual** | Qualidade subjetiva: suavidade, feel, aparência correta | Dev page | Humano |

O checklist manual fica reservado para o que é genuinamente subjetivo — "a animação parece natural?", "o bounce tem o peso certo?". Tudo que tem resposta binária (tem ou não tem, está certo ou errado) é automatizável.

---

### Interaction: interface exportada, contrato definido pelo Model

**Correção ao memo original:** a Interaction tem interface exportada, e ela é definida pelo Model. O Movable já exemplifica: `MovableInteraction` (em `Movable.internal-types.ts`) é o protocolo que o Model declara e as Interactions implementam contra. A interface lista exatamente as funções que as Interactions chamam no Model:

```ts
// Definido pelo Model, em internal-types — não pelas Interactions
export interface MovableInteraction {
  readonly activeItemID: string | null
  began(id: string, group: MovableGroup, position: MovePosition, limits: MoveLimits, rect: ItemRect): void
  changed(x: number, y: number): MovePosition
  ended(): void
  readonly rootEl: HTMLElement | null
}
```

`MovableDragInteraction` e `MovableKeyboardInteraction` recebem um `MovableInteraction` (o Model) e chamam `began`, `changed`, `ended` sobre ele. Elas não definem o que oferecem — elas respeitam o que o Model declarou precisar.

O lado DOM da Interaction (escutar eventos do browser) é um contrato com terceiro: o browser garante que `pointerdown` dispara quando o usuário pressiona. A única falha possível aqui é de setup ("não estava ouvindo"), não de contrato. Portanto:

- **Lado DOM → Model** (o único testável): dado este evento, os métodos corretos do Model são chamados com os argumentos corretos?

```ts
// O Model é o stub, não a Interaction
const fakeModel: MovableInteraction = {
  activeItemID: null,
  activePosition: { x: 0, y: 0 },
  began: vi.fn(),
  changed: vi.fn(),
  ended: vi.fn(),
  rootEl: document.createElement('div'),
}

const interaction = new MovableDragInteraction(fakeModel)
interaction.attach(someElement)

someElement.dispatchEvent(new PointerEvent('pointerdown', { clientX: 10, clientY: 20, bubbles: true }))

expect(fakeModel.began).toHaveBeenCalledWith(
  someElement.id,
  expectedGroup,
  { x: 10, y: 20 },
  expectedLimits,
  expectedRect,
)
```

O stub aqui usa a `MovableInteraction` que o Model define — o mesmo tipo. Os testes da Interaction e os testes do Model compartilham a mesma fonte de verdade contratual.

---

### Testes como specs legíveis para Coordinator e Interaction

Coordinator e Interaction não têm Behavioral Spec formal — e não precisam. Quando os testes são bem escritos, eles **são** lidos como specs. Um teste de Coordinator bem nomeado descreve uma transição de estado e o efeito DOM esperado:

```
"quando isAnimating muda de false para true
  → startAnimation é chamado
  → o elemento recebe a classe 'is-animating'
  → getAnimations() retorna uma animação com id 'bounce'"
```

Um teste de Interaction descreve o mapeamento de evento para chamada de Model:

```
"quando pointerdown ocorre sobre o item
  → began é chamado com o id, grupo, posição e limites corretos"
```

Qualquer pessoa lendo os arquivos de teste entende o contrato do módulo sem precisar abrir a implementação. A diferença em relação ao Behavioral Spec do Model é apenas de formalidade: o Model tem um documento separado porque o Spec é escrito antes da implementação e serve também como referência de design. Para Coordinator e Interaction, os testes cumprem os dois papéis — são ao mesmo tempo a especificação e a verificação.

---

### Fechamento dos Blind Spots do Memo

| Blind spot original | Status após alinhamento |
|---|---|
| "Coordinator não tem forma tipada" | **Fechado.** A interface são os métodos DOM. O `$effect` é ativação, não contrato. |
| "Onde vive o contrato do Coordinator?" | **Fechado.** Como `interface SomeCoordinator` em TypeScript, junto aos tipos internos do pacote. |
| "Testes de Coordinator requerem DOM real e são frágeis" | **Fechado.** JSDOM cobre a maioria; Playwright cobre o restante. O checklist manual fica só com julgamentos subjetivos. |
| "Interactions têm dois consumidores, qual tem prioridade?" | **Fechado.** Lado DOM é contrato com o browser (confiado). Lado Model é o único contrato relevante, testável com stub tipado pela `MovableInteraction`. |
| "Duplicar o Behavioral Spec" | **Fechado.** Cada nível responde perguntas diferentes: Spec = o quê (sistema, sem tecnologia); Model interface = como usar (consumidor); Coordinator/Interaction interfaces = responsabilidade de cada módulo (contribuidor). |
| "Quem define os contratos inter-módulo?" | **Fechado.** O Model. Ele declara o que precisa de Interactions e do que Coordinators devem fazer. Os outros módulos implementam contra esses contratos, não ao contrário. |
