# Interfaces (§16)

> Parte da [Svelte Model View Architecture](Architecture.md).
> Referencia também: [Testing](Testing.md) · [Checklist](Checklist.md)

Este documento cobre dois níveis de interface:

1. **Interface de pacote** — o contrato entre o pacote e quem o usa como bloco de UI. Vive em `Interface.md`. É o que um consumidor lê.
2. **Interfaces de módulo** — os contratos entre os módulos internos do pacote (Model, Coordinator, Interaction). Vivem em tipos TypeScript e arquivos de tipos separados por módulo. São o que um contribuidor usa.

---

## O que é `Interface.md`

Cada pacote UI tem um arquivo `Interface.md` — a referência autoritativa de como um **consumidor de componente** usa o pacote. É o único documento que ele precisa ler. Não é gerado, não é derivado do código: é escrito primeiro, e a implementação satisfaz o que ele descreve.

A regra central: se a implementação diverge de `Interface.md`, a implementação está errada.

---

## Dois Tipos de Consumidor

| Tipo | Quem é | Lê |
|---|---|---|
| **Consumidor de componente** | Usa o componente como bloco de UI | `Interface.md` |
| **Contribuidor** | Cria ou estende pacotes no repositório | `Architecture.md` + código-fonte |

`Interface.md` é escrito exclusivamente para consumidores de componente. Ele nunca menciona Model, Coordinator, Interaction, ou qualquer detalhe de arquitetura interna. O consumidor não precisa saber como o pacote funciona por dentro — só o que ele faz, como usá-lo, e o que é responsabilidade dele como caller.

---

## Posição no Fluxo de Desenvolvimento

```
1. Behavioral Specification.md   — o que o sistema faz (sem tecnologia)
2. Interface.md                  — como o consumidor usa (tipos + prosa)
3. Implementação                 — satisfaz os dois documentos (TDD)
4. Checklist.md                  — auditoria de conformidade antes do commit
```

`Interface.md` é a ponte entre a spec comportamental e a implementação: transforma os comportamentos definidos na spec em um contrato de uso concreto para o consumidor. Se durante a implementação o contrato se mostrar impraticável, revisa-se `Interface.md` — nunca a spec comportamental.

Escrever a interface antes da implementação também é um exercício de design: força a decisão explícita sobre o que é público antes que o código dite a resposta por acidente.

---

## Tom e Linguagem

`Interface.md` é um documento interno — uma diretriz operacional, não um README público. O consumidor é referenciado em terceira pessoa ("o consumidor chama", "o componente expõe"). Linguagem direta, sem introduções genéricas, sem marketing.

---

## Estrutura Obrigatória

### 1. Descrição

Um parágrafo em linguagem direta: o que o componente faz, em que contexto faz sentido usá-lo, qual problema ele resolve para o consumidor.

### 2. Superfície Pública (overview)

Imediatamente após a descrição: lista completa de tudo que o consumidor pode importar e usar — componentes, métodos, props, snippets, fábricas, tipos. Sem descrição, sem prosa — apenas o overview da superfície exportada. O objetivo é dar ao consumidor uma visão instantânea do que existe antes de mergulhar nos detalhes.

### 3. Índice por Comportamento

O índice organiza por **comportamento e uso**, não por tipo técnico (props, methods, types). Cada entrada é quase uma "user story" onde o ator é o consumidor:

- "Renderizando o componente"
- "Disparando uma animação"
- "Reagindo ao estado de animação"

Não: "Props", "Methods", "Types". O consumidor pensa em _o que quer fazer_, não em _que tipo de API é_.

### 4. Seções de comportamento

Cada seção do índice é expandida com:

#### Props e snippets

Cada prop e snippet com:
- Tipo (em TypeScript)
- Prosa descrevendo o comportamento — não apenas o tipo
- Valor padrão quando relevante

#### Métodos públicos

Métodos expostos via `bind:this` ou via context, com:
- Assinatura
- Quando é seguro chamar
- Comportamento em chamadas fora do momento esperado (no-op? erro? efeito colateral?)
- Invariantes relevantes

#### Estado observável

Estado que o consumidor pode precisar ler para tomar decisões de apresentação — como aplicar estilos, renderizar variantes, ou reagir a mudanças — pertence à interface pública.

**Regra:** estado é público se o consumidor tem razão legítima para lê-lo. Estado consumido apenas internamente pelos módulos do pacote não pertence à interface.

Exemplo: `isMoving`, `isFocused`, `isOver` pertencem à interface do Movable — o consumidor precisa deles para estilizar filhos. Métodos como `began()`, `changed()`, `ended()` são contratos internos entre Model e Interaction — jamais pertencem à interface do consumidor.

### 5. Responsabilidades do consumidor

Efeitos e comportamentos que são responsabilidade do caller — não do pacote — devem ser declarados explicitamente. O consumidor não pode inferir o que o pacote deliberadamente não faz.

Exemplos:
- "O componente não gerencia focus ring. O consumidor deve aplicar o estilo visual de foco via `data-moving`."
- "O componente não controla quando `request()` é chamado. O consumidor decide o momento."

---

## Convenção de Naming: Direcionalidade de Props vs. Estado

Nomes de props e estado observável seguem uma convenção de **direcionalidade** que comunica a direção do fluxo de dados:

| Forma | Direção | Uso |
|---|---|---|
| `paused`, `disabled`, `hidden` | **Entrada** (consumidor → componente) | Prop que o consumidor passa para controlar o componente. Adjetivo puro, sem prefixo. |
| `isAnimating`, `isMoving`, `isFocused` | **Saída** (componente → consumidor) | Estado observável read-only que o componente expõe. Prefixo `is*` sinaliza leitura. |

O prefixo `is*` é **reservado** para estado de saída. Uma prop de entrada nunca usa `is*` — mesmo que represente um boolean. Se o consumidor passa um valor para controlar comportamento, o nome é o adjetivo direto (`paused`, não `isPaused`). Se o componente expõe um estado que o consumidor pode ler mas não setar, o nome carrega `is*` (`isAnimating`, não `animating`).

Essa convenção torna a direção do fluxo legível na assinatura do componente sem precisar consultar documentação.

---

## O que `Interface.md` Nunca Inclui

- Nomes de classes internas (Model, Coordinator, Interaction, Service)
- Detalhes de implementação (como o estado é armazenado, como os eventos são capturados)
- Terminologia de arquitetura MV
- Instruções para contribuidores — isso vai em `Architecture.md`

---

---

## Interfaces de Módulo

### O Model define todos os contratos inter-módulo

O Model não tem apenas sua própria interface pública — ele declara a interface de todos os módulos que o servem. Coordinator e Interaction não definem o que oferecem; eles implementam contra o que o Model declarou precisar. O Model é a fonte de verdade para todos os contratos internos do pacote.

Isso significa que as interfaces inter-módulo vivem junto aos tipos do Model, em `[Domain].internal-types.ts` — não em arquivos dos módulos que as implementam.

---

### Interface do Coordinator

O Coordinator é uma classe com métodos DOM explícitos e um `$effect` que os chama automaticamente quando o Model muda de estado. O `$effect` é o mecanismo de ativação — não é a interface. A interface são os métodos.

```ts
// Em [Domain].internal-types.ts
export interface SomeCoordinator {
  startAnimation(el: Element, animation: Animation): void
  pauseAnimation(): void
  resumeAnimation(): void
  cancelAnimation(el: Element): void
}
```

A implementação satisfaz essa interface e usa `$effect` para fazer o dispatch:

```ts
class SomeCoordinatorImpl implements SomeCoordinator {
  constructor(private model: SomeModel, private el: Element) {
    $effect(() => {
      if (model.isAnimating) this.startAnimation(el, model.currentAnimation)
      else this.cancelAnimation(el)
    })
  }

  startAnimation(el: Element, animation: Animation) { /* ... */ }
  cancelAnimation(el: Element) { /* ... */ }
}
```

Ter a interface tipada significa que o Coordinator pode ser testado em isolamento: basta criar um `$state` stub com a forma do Model e observar os efeitos DOM.

---

### Interface da Interaction

O contrato da Interaction é definido pelo Model, não pela Interaction. O Model declara o que ele expõe para ser chamado por Interactions — os métodos que representam as transições de estado que eventos de hardware podem provocar, mais qualquer estado que a Interaction precise ler para fazer seu trabalho:

```ts
// Em [Domain].internal-types.ts — definido pelo Model, consumido pelas Interactions
export interface SomeDomainInteraction {
  readonly activeItemID: string | null
  began(id: string, position: Position): void
  changed(x: number, y: number): void
  ended(): void
}
```

O Model implementa essa interface. As Interactions recebem um `SomeDomainInteraction` e chamam seus métodos — elas não definem o protocolo, elas o respeitam.

O lado DOM da Interaction (escutar eventos do browser) é um contrato com terceiro: o browser garante que `pointerdown` dispara quando o usuário pressiona. Esse lado não tem interface testável — a única falha possível é de setup ("não estava ouvindo o evento"). O lado Model é o único contrato relevante para testes.

---

### Onde os contratos inter-módulo vivem

| Tipo | Arquivo | Exportado? |
|---|---|---|
| Interface do consumidor de pacote | `Interface.md` + JSDoc em `[Domain].types.ts` | Sim — via `index.ts` |
| Tipos públicos do consumidor | `[Domain].types.ts` | Sim — via `index.ts` |
| Contratos entre Model, Coordinator e Interaction | `[Domain].internal-types.ts` | Não — uso interno apenas |

`[Domain].internal-types.ts` nunca é exportado pelo `index.ts`. Consumidores de pacote não têm razão para importar contratos inter-módulo. Contribuidores importam diretamente do arquivo.

---

### Testes de Coordinator e Interaction como specs legíveis

Coordinator e Interaction não têm Behavioral Spec formal. Seus testes bem escritos **são** lidos como specs. Um teste de Coordinator nomeia uma transição de estado e descreve o efeito DOM esperado; um teste de Interaction nomeia um evento e descreve a chamada de Model resultante. Qualquer contribuidor lendo os arquivos de teste entende o contrato do módulo sem precisar abrir a implementação.

A diferença em relação ao Behavioral Spec do Model é de formalidade e sequência: o Spec do Model é escrito antes da implementação e serve como documento de design. Para Coordinator e Interaction, os testes cumprem os dois papéis — são spec e verificação ao mesmo tempo.

---

## O que `Interface.md` Garante

**Superfície de exportação:** `index.ts` exporta somente o que aparece em `Interface.md`. Adicionar uma nova exportação exige atualizar o documento primeiro — a decisão é explícita, não acidental.

**Sincronismo com JSDoc:** Os tipos públicos expostos no pacote têm JSDoc que espelha a prosa de `Interface.md`. Tipos e documentação se mantêm em sincronia.

**Auditabilidade:** Em qualquer PR que altere a API pública do pacote, `Interface.md` deve ser atualizado junto. Se `Interface.md` não mudou, a superfície pública não mudou.
