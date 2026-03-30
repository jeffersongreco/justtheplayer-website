# Conversa: Mapeamento de Convenções — Apple MV vs Svelte MV

**Contexto:** Camada entre Princípios de Engenharia e Arquitetura resultante. Partindo do veredicto "Sim" da avaliação de MV (árvore 4), esta conversa mapeia as diferenças de convenções entre Apple MV e Svelte MV para definir o que padronizar e o que adaptar.

---

## 1. Mensagem do autor

Mapear as diferenças de convenções para ser capaz de definir o que padronizar e o que manter diferente.

---

## 2. Análise de contexto

### O que alimenta esta camada

Três fontes convergem:

1. **Graus de liberdade da engenharia (G.e1–G.e9):** Materialização de fronteiras, forma das abstrações, formato das instruções, nomenclatura, mecanismo de comunicação, resolução dos Gs herdados, critério de generalização, processo de verificação, vocabulário das portas internas.

2. **Idiomas de Svelte (Raiz B):** Runes, componentes `.svelte`, actions (`use:`), Context API, `.svelte.ts` modules, props system, template declarativo + script imperativo.

3. **Apple MV como referência:** Conventions established by Apple's MV practice — how they resolve the same freedoms using `@Observable`, SwiftUI, property wrappers, and the Observation framework.

### O que esta camada produz

Para cada grau de liberdade, uma classificação:
- **Transportável:** Apple's convention maps directly to Svelte. Standardize.
- **Adaptável:** Same principle, different mechanism. The convention is preserved at the principle level but materialized differently due to platform constraints or opportunities.
- **Nova:** No Apple equivalent. A convention unique to Svelte that needs to be created from the principles.

---

## 3. Design Tree

*(Produzida e entregue como arquivo separado: `5 - Mapeamento de Convenções - Design Tree.md`)*

### Estrutura

10 nós de mapeamento (M1–M10), cada um resolvendo um ou mais graus de liberdade:

| Nó | Resolve | Classificação |
|---|---|---|
| M1 — Materialização em arquivos | G.e1 | Transportável |
| M2 — Forma das abstrações | G.e2 | Adaptável (melhoria) |
| M3 — Estado e reatividade | G3, G6, G.e5 | Transportável |
| M4 — Papel do script | G7, G1 | Nova |
| M5 — Ciclo de vida e ownership | V5 | Adaptável |
| M6 — Entidades de infraestrutura | G2, G5, G.e1, G.e6 | Adaptável + Nova |
| M7 — Nomenclatura | G.e4 | Transportável + Nova |
| M8 — Formato das portas | G.e3, G.e9 | Transportável |
| M9 — Verificação | G.e8 | Transportável + Adaptável |
| M10 — Critério de generalização | G.e7 | Transportável |

### Principais descobertas

**M2 (Abstração formal) é uma melhoria sobre Apple.** A incompatibilidade entre `@Observable` e protocolos Swift força Apple a usar DIP informal. Svelte/TypeScript não tem essa limitação — interfaces funcionam com runes. A convenção pode ser *melhor* que a de Apple.

**M4 (Papel do script) é a única convenção genuinamente nova.** Apple não tem o problema script/template. A resolução proposta: script é compositor + decisor de apresentação, template é executor de apresentação. O script nunca decide lógica de negócio.

**M6 (Infraestrutura) tem dois aspectos.** O princípio (entidades separadas da View) é transportável. O conteúdo (as bibliotecas em si) precisa ser construído — é a "biblioteca de UI para Svelte" mencionada no veredicto.
