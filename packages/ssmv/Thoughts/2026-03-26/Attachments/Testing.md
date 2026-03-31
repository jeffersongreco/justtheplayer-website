# Testes (§10)

> Parte da [Svelte Model View Architecture](Architecture.md).

---

### TDD: Red → Green → Refactor

A prática de TDD segue o ciclo do Extreme Programming:

1. **Red** — Escrever um teste que falha. O teste é derivado do Behavioral Spec e descreve um comportamento que ainda não existe na implementação.
2. **Green** — Escrever o mínimo de código necessário para fazer o teste passar. Nada além do que o teste exige.
3. **Refactor** — Com todos os testes verdes, refatorar o código para melhorar clareza, eliminar duplicação e respeitar os padrões da arquitetura — sem alterar comportamento.

O ciclo se repete para cada comportamento descrito no Spec. O ritmo é granular: um teste por vez, não um bloco de testes seguido de um bloco de implementação. A disciplina de Green mínimo evita over-engineering; o passo de Refactor garante que o código não acumula débito técnico entre ciclos.

### Spec de Comportamento Exaustivo

O Behavioral Spec é a fundação de tudo — tanto os testes automatizados quanto a implementação do Model são derivados dele. **O Spec deve ser exaustivo:** todo estado, transição, edge case e invariante deve estar descrito antes da implementação. Um Spec com gaps produz Models com gaps e testes que não cobrem o que deveriam.

O Model é a fonte única da verdade; se os testes do Model passam mas o comportamento está errado, o bug está no Coordinator ou na View — a arquitetura dá isolamento de falhas de graça.

### Granularidade: testar por camada

| Camada | Estratégia | Rationale |
|---|---|---|
| Model (estado puro) | Testes automatizados — um arquivo por Model | Lógica pura, sem dependências, rápido, preciso |
| Coordinator (orquestrador DOM) | Testes automatizados com JSDOM (classes, atributos, ARIA, focus, live regions, `getAnimations()`); Playwright para layout computado e timing preciso de WAAPI | Testável em isolamento via `$state` stub — não precisa do Model real, só da sua interface |
| Interaction (hardware translator) | Testes automatizados — evento sintético + stub tipado pela interface do Model | Só o lado Model é contratual; o lado DOM é contrato com o browser |
| View (componente Svelte) | Checklist visual na dev page | Qualidade subjetiva, rendering, animações reais |
| Integração Model ↔ Coordinator | Playwright ou checklist visual na dev page | Pipeline completo; requer runtime real |
| Utils / pure functions | Testes automatizados | 100% testável, sem side effects |

O checklist manual na dev page fica reservado para julgamentos genuinamente subjetivos: "a animação parece natural?", "o bounce tem o peso certo?". Tudo que tem resposta binária (tem ou não tem, está certo ou errado) é automatizável.

### Um arquivo de teste por módulo

Cada módulo tem seu próprio arquivo de teste: `[Domain]Model.test.ts`, `[Domain]Coordinator.test.ts`, `[Domain][Type]Interaction.test.ts`, `[domain].utils.test.ts`. Isso mantém a rastreabilidade direta entre módulo e seus contratos verificados, e torna falhas de CI imediatamente localizáveis: se `MovableCoordinator.test.ts` falha, o problema está no Coordinator.

### Testes de Coordinator e Interaction como specs legíveis

Coordinator e Interaction não têm Behavioral Spec formal. Seus testes bem escritos servem como specs: cada teste nomeia uma transição de estado (Coordinator) ou um evento de hardware (Interaction) e descreve o resultado esperado. Lidos em sequência, os testes de um Coordinator descrevem completamente seu contrato reativo.

### Organização dos Testes por Seção do Spec

Os testes devem ser organizados por seção do Behavioral Spec (ex: `§2.1 Idle → Animating`, `§2.3 Cancellation`), não por módulo ou método. Isso permite que uma falha aponte diretamente para qual contrato comportamental quebrou — diagnóstico superior a separar por implementação.

### Extrair Pure Functions para Ganhar Testabilidade

Sempre que uma lógica puder ser extraída como pure function (sem side effects, sem estado, sem DOM), deve-se fazer essa extração. Isso converte código que só seria verificável manualmente (dentro do Coordinator ou Interaction) em código testável automaticamente. Exemplos: cálculos de colisão, boundary clamping, interpolação, resolução de coordenadas.

### Testes Automatizados de UI

Testes automatizados de UI (Vitest Browser Mode, Playwright Component Testing, visual regression) **não são considerados para nenhum pacote no momento**. O ROI é baixo para libraries de animação e interação — as libraries de referência da indústria (GSAP, Framer Motion, dnd-kit) também não os utilizam. A verificação visual é feita via dev pages dedicadas (§12).

### Categorização de Testes por Tags

Testes são categorizados com tags para permitir filtragem em CI e clareza de escopo:

| Tag | Escopo | Roda em CI? |
|---|---|---|
| `unit` | Lógica pura isolada — Model, Utils, funções puras | ✅ Sempre (pipeline rápido) |
| `integration` | Múltiplas camadas juntas | ✅ Sempre (pipeline rápido) |
| `benchmark` | `vitest bench` — comparativo de performance relativa entre commits | ❌ Separado do pipeline principal |
| `slow` | Testes com timers reais ou animações | ❌ Opcional / pipeline lento |

A separação `unit`/`integration` vs. `benchmark` já existe implicitamente na tooling (`vitest` vs. `vitest bench`). Formalizar com tags permite filtrar dentro do mesmo runner e documenta a intenção de cada suite — o CI rápido roda apenas `unit` e `integration`; `benchmark` e `slow` são executados sob demanda ou num pipeline separado.

### Code Review Automatizado (CodeRabbit)

Após os testes automatizados passarem e o smoke test visual na dev page ser concluído com confirmação do autor, o último gate antes do PR é o **code review via CodeRabbit** no terminal. O review é executado pelo Claude Code usando o plugin CodeRabbit (`/coderabbit:review`) — sem review automático no GitHub. Quando o PR é aberto, todo o código já foi revisado localmente e está pronto para merge.

**Workflow:**
1. Testes automatizados passam
2. **Guided QA na dev page**: Ativar o Guided QA Mode, executar todos os steps em sequência, confirmar o `humanChecklist` de cada step. Os logs são lidos automaticamente via DevTools MCP — o autor reporta apenas divergências visuais.
3. Claude Code executa `/coderabbit:review` no terminal
4. Findings são analisados e corrigidos localmente antes de abrir o PR

**O que o CodeRabbit verifica que complementa os testes:**
- Violações arquiteturais que testes de Model não capturam (ex: Coordinator tomando decisões de negócio, View com lógica de domínio)
- Code quality: encapsulamento, naming, tipagem, patterns inconsistentes com a arquitetura
- Regressões sutis em APIs públicas (`index.ts` exports, Props types)
- Segurança e edge cases não cobertos pelo Behavioral Spec

**Configuração:** Nenhum `.coderabbit.yaml` no momento. Se for observado que o CodeRabbit não absorve as regras arquiteturais do projeto, um `.coderabbit.yaml` com `path_instructions` será introduzido.
