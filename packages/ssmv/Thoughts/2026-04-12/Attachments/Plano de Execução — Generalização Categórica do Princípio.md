# Plano de Execução — Generalização Categórica do Princípio

> **Insumo diagnóstico.** [`The diagnosis of Princípio Central.md`](The%20diagnosis%20of%20Princípio%20Central.md)
> **Insumo material.** [`Princípio Central — Versão Refinada.md`](../Princípio%20Central%20—%20Versão%20Refinada.md), [`../../2026-04-02/Etapa 1 Consolidada.md`](../../2026-04-02/Etapa%201%20Consolidada.md)
> **Status.** Plano (não execução).

---

## 0. Objetivo e produto final

Reformular o princípio P0 — componente positivo, componente negativo e cláusulas — elevando-o do nível de especificação enumerativa (mapeamento 1:1 com o catálogo) ao nível categórico, pelo mesmo método que a formulação-semente empregou: **conceituação de termos**. O princípio resultante deve ser aplicável por um leitor instruído a casos ausentes do catálogo, sem consultar a taxonomia M01–M14.

**Produto final:** arquivo `Princípio Central — Versão Categórica.md`, contendo o princípio reformulado, a infraestrutura conceitual que o sustenta, e o rastro de equivalência com P0.

**Fora desta etapa:** revisão do catálogo; revisão das restrições formais; comparação com teorias rivais; tratamento de objeções; estilização para o artigo.

---

## 1. Métodos canônicos empregados

Esta seção declara os métodos filosóficos que governam cada operação do plano. Nenhum passo do plano é arbitrário; cada um instancia um procedimento reconhecido na tradição analítica.

### 1.1. Explicação (Carnap)

> Carnap, *Logical Foundations of Probability* (1950), §2–§3.

**O que é.** Substituir um conceito pré-sistemático (o *explicandum*) por um conceito preciso (o *explicatum*), satisfazendo quatro condições: (a) **similaridade** ao explicandum, (b) **exatidão** da definição, (c) **fecundidade** — o explicatum permite inferências que o explicandum não permitia, (d) **simplicidade** — tão simples quanto (a)–(c) permitam.

**Como se aplica aqui.** Os motivos M01–M14 e os alvos A01–A15 são explicanda: conceitos pré-sistemáticos extraídos dos casos. A tarefa é produzir explicata — conceitos definidos com precisão no nível categórico — que satisfaçam as quatro condições de Carnap. A formulação-semente já operou por esse método (§6.1–§6.8 da Etapa 1); o plano retoma o mesmo procedimento para o componente negativo e as cláusulas.

**Onde aparece.** Steps 2, 3 e 4.

### 1.2. Abstração por invariância

> Nozick, *Invariances* (2001), cap. 2; na filosofia da ciência, o princípio de que leis devem ser formuladas em termos de propriedades invariantes sob transformações relevantes.

**O que é.** Dadas múltiplas instâncias que variam em detalhes superficiais, identificar a propriedade que permanece constante quando os detalhes mudam. Formular a norma em termos dessa invariante.

**Como se aplica aqui.** Os motivos M01, M03, M04, M06, M10, M11 variam em conteúdo concreto (tooling, encapsulamento, fluxo de controle…) mas compartilham uma estrutura: a força normativa invocada deriva da relação do decisor com a implementação, não da relação do afetado com a superfície. A invariante é essa estrutura; a formulação categórica a enuncia.

**Onde aparece.** Step 2.

### 1.3. Definição por gênero e diferença

> Aristóteles, *Tópicos* I.5, 101b38; procedimento padrão em filosofia analítica para introduzir categorias.

**O que é.** Definir uma categoria enunciando (a) o gênero — a classe mais ampla a que pertence — e (b) a diferença — o traço que a distingue das demais espécies do mesmo gênero.

**Como se aplica aqui.** As categorias que organizarão o componente negativo e as cláusulas (externalidade, akrasia, assimetria informacional, etc.) devem ser definidas por gênero e diferença, não por extensão. Exemplo: "externalidade decisor→afetado" = gênero: *distribuição assimétrica de custos entre agentes*; diferença: *o custo externalizado é o de interação futura com a superfície de uso*.

**Onde aparece.** Steps 3 e 4.

### 1.4. Subsunção

> Kant, *Crítica da Razão Pura*, A132/B171 (o juízo como faculdade de subsumir o particular sob o universal); em filosofia do direito, Alexy, *A Theory of Legal Argumentation* (1978), cap. 4.

**O que é.** Mostrar que um particular cai sob um universal — que um caso concreto é instância de uma categoria geral. A operação inversa da abstração: abstração sobe dos casos à categoria; subsunção desce da categoria ao caso.

**Como se aplica aqui.** Depois de formular as categorias, cada motivo do catálogo (M01–M14) deve ser subsumível sob exatamente uma categoria, e a subsunção deve ser demonstrável (não apenas plausível). Isso é o que garante que a generalização não perdeu cobertura.

**Onde aparece.** Step 5 (verificação de cobertura).

### 1.5. Equilíbrio reflexivo — teste de precisão

> Rawls, *A Theory of Justice* (1971), §§4, 9; Daniels, "Wide Reflective Equilibrium and Theory Acceptance in Ethics" (1979).

**O que é.** Verificar que o princípio está em equilíbrio com os juízos considerados. Na variante de precisão: verificar que o princípio *não* condena o que deveria preservar (super-inclusão).

**Como se aplica aqui.** A generalização é monotônica para cobertura (se P0 cobre C, P0' ⊇ P0 cobre C), mas *não* para precisão. Os casos R3 e os casos novos da rodada 5.3 precisam ser re-testados. Se P0' sobre-condena, a categoria é ampla demais naquele ponto.

**Onde aparece.** Step 6.

### 1.6. Extensão conservadora

> Lógica matemática: uma extensão T' de uma teoria T é conservadora se T' não prova nenhum enunciado na linguagem de T que T já não provasse. Shoenfield, *Mathematical Logic* (1967), §4.6.

**O que é.** Garantir que a reformulação não altera os vereditos nos casos já cobertos — ela estende o alcance do princípio a casos novos sem mudar os resultados nos casos antigos.

**Como se aplica aqui.** P0' deve ser extensão conservadora de P0 sobre o domínio C1–C20: para todo caso já testado, P0' produz o mesmo veredito que P0. Isso é verificado pela subsunção (Step 5) e pelos testes de precisão (Step 6). Se ambos passam, a equivalência está demonstrada.

**Onde aparece.** Step 5 + Step 6 conjuntamente.

---

## 2. Convenções de execução

- Cada step entrega um **arquivo intermediário próprio**, numerado (`01-…`, `02-…`, …).
- Pausa obrigatória entre steps — o autor confirma a passagem.
- Toda decisão é registrada com justificação curta no próprio arquivo do step.
- A infraestrutura conceitual produzida nos Steps 3–4 é cumulativa: cada step pode usar os conceitos definidos nos anteriores.
- Os motivos e casos do catálogo são tratados como **instâncias representativas**, nunca como lista exaustiva. A generalização deve cobri-los, mas não se limitar a eles.

---

## STEP 1 — Revisão do componente positivo (P0+)

### Objetivo

Decidir entre duas opções para P0+:

**(a)** Restaurar a formulação-semente — "melhor experiência de interação possível" — com a infraestrutura conceitual de §6.7 e §6.8 da Etapa 1 já pronta.

**(b)** Manter a tríade "significativo, reconhecível, acionável" — mas produzir defesa explícita de que ela é equivalente ou superior à formulação-semente, mostrando que as dimensões não nomeadas (previsibilidade, feedback, esforço, consistência) são demonstravelmente cobertas ou explicitamente bracketed.

### Procedimento

1. Listar as dimensões da experiência de interação enumeradas em §6.7 da Etapa 1.
2. Para cada dimensão, verificar se a tríade "significativo, reconhecível, acionável" a cobre, e documentar como.
3. Se houver dimensão não coberta e não bracketável, a opção (b) falha e a escolha é (a).
4. Se todas forem cobertas, registrar a defesa e escolher (b).
5. Em qualquer caso, registrar a decisão com justificação de 1–2 parágrafos.

**Método canônico.** Explicação (§1.1): a tríade, se mantida, precisa satisfazer as quatro condições de Carnap em relação ao explicandum "melhor experiência de interação possível".

### Deliverable

- `01-revisao-P0-positivo.md` — decisão + justificação + tabela de cobertura dimensional.
- **Exit.** P0+ fixado. A formulação escolhida é registrada e não será reaberta nos steps seguintes.

---

## STEP 2 — Identificação das invariantes do componente negativo

### Objetivo

Examinar N1–N6 e identificar a propriedade (ou propriedades) invariante(s) que os unifica(m), abstraindo dos detalhes concretos de cada motivo.

### Procedimento

1. Para cada N (N1–N6), enunciar em uma frase: *de onde vem a força normativa que o agente invoca ao usar este fator como razão derrotadora?*
2. Registrar as respostas numa tabela.
3. Identificar o que é constante nessas respostas — a invariante.
4. Formular a invariante como proposição candidata: "não conta como razão derrotadora todo fator cuja força normativa [invariante]."
5. Testar a proposição candidata contra os seis N: cada um deve ser subsumível sem resíduo.
6. Se houver resíduo (um N que não cai sob a invariante), decidir: a invariante precisa ser ampliada, ou aquele N pertence a uma segunda invariante distinta?

**Método canônico.** Abstração por invariância (§1.2).

### Deliverable

- `02-invariantes-negativo.md` — tabela + invariante(s) + teste de subsunção + decisão sobre unicidade ou pluralidade.
- **Exit.** A(s) invariante(s) do componente negativo está(ão) identificada(s) e testada(s) contra N1–N6.

---

## STEP 3 — Conceituação das categorias do componente negativo

### Objetivo

Definir com rigor os conceitos categóricos que organizarão o componente negativo — os explicata que substituirão os explicanda N1–N6.

### Procedimento

1. Para cada invariante identificada no Step 2, produzir uma **definição por gênero e diferença** (§1.3).
2. Verificar as quatro condições de Carnap (§1.1) para cada explicatum:
   - *Similaridade*: o explicatum é reconhecivelmente "sobre a mesma coisa" que os N que subsume?
   - *Exatidão*: a definição é precisa o suficiente para que um leitor instruído determine, para um caso novo, se o fator cai ou não sob ela?
   - *Fecundidade*: o explicatum permite inferências que a lista N1–N6 não permitia — em particular, a aplicação a casos ausentes do catálogo?
   - *Simplicidade*: o explicatum é tão simples quanto as três condições acima permitem?
3. Se uma condição não é satisfeita, revisar a definição antes de avançar.
4. Produzir, para cada conceito definido, 2–3 instâncias ilustrativas extraídas do catálogo (M01–M14) e 1 instância hipotética fora do catálogo — para mostrar que o conceito se estende além dos casos observados.

**Nota metodológica.** O nível de abstração a atingir é aquele em que a filosofia moral e a teoria da ação já possuem vocabulário reconhecível — externalidades, akrasia, assimetria informacional, ilusão de neutralidade, coordenação intertemporal, etc. Os exemplos oferecidos no diagnóstico são representativos desse nível; não são a taxonomia final. O trabalho deste step é determinar quais categorias desse tipo são necessárias e suficientes — e defini-las com o mesmo rigor de §6.1–§6.8 da Etapa 1.

### Deliverable

- `03-conceitos-negativo.md` — definições por gênero e diferença + verificação das condições de Carnap + instâncias ilustrativas.
- **Exit.** Os conceitos estão definidos e testados. A infraestrutura conceitual para o componente negativo está pronta.

---

## STEP 4 — Conceituação e redução das cláusulas

### Objetivo

Aplicar o mesmo procedimento do Step 3 às cláusulas (Cláusula-Q, P1, P2, P3, P4, P5, A1), identificando convergências que permitam reduzir o número de cláusulas sem perda de cobertura.

### Procedimento

1. Para cada cláusula atual, enunciar em uma frase: *qual é o tipo de situação que esta cláusula governa?*
2. Registrar numa tabela e procurar convergências — cláusulas que governam o mesmo tipo de situação sob variações de detalhe.
   - Hipótese a testar (derivada do diagnóstico): P2, P3 e P4 podem ser variantes do mesmo fenômeno — assimetria temporal ou informacional entre decisor e afetado, resultando em petrificação.
   - Hipótese a testar: Cláusula-Q e Cláusula-P1 podem convergir sob uma categoria de "casos mistos onde a separação do componente N legítimo exige demonstração positiva."
3. Para cada convergência encontrada: propor uma cláusula unificada e definir o conceito central por gênero e diferença (§1.3).
4. Verificar as quatro condições de Carnap (§1.1) para cada conceito-cláusula.
5. Para cada cláusula que *não* converge com nenhuma outra: mantê-la, mas reformulá-la em termos categóricos (tipo de situação, não motivo específico).
6. Produzir instâncias ilustrativas como no Step 3.

### Deliverable

- `04-conceitos-clausulas.md` — tabela de convergência + cláusulas reformuladas + definições + instâncias ilustrativas.
- **Exit.** O número de cláusulas está reduzido (ou justificadamente mantido). Cada cláusula está formulada em termos categóricos com conceitos definidos.

---

## STEP 5 — Montagem e verificação de cobertura (subsunção)

### Objetivo

Montar o princípio reformulado P0' e verificar que todo motivo do catálogo (M01–M14) é subsumível sob algum componente ou cláusula de P0'.

### Procedimento

1. Compor P0' integrando: P0+ revisado (Step 1) + componente negativo categórico (Steps 2–3) + cláusulas categóricas (Step 4).
2. Para cada M01–M14, demonstrar a subsunção: identificar sob qual conceito categórico o motivo cai e enunciar a inferência.
3. Para cada alvo A01–A15, verificar que P0' o cobre demonstravelmente.
4. Registrar qualquer motivo ou alvo que não é subsumível. Se houver: a generalização perdeu cobertura — retornar ao Step 2 ou 3 para ajustar o conceito.

**Método canônico.** Subsunção (§1.4) + extensão conservadora (§1.6).

### Deliverable

- `05-principio-P0-prime.md` — princípio reformulado + tabela de subsunção M01–M14 + tabela de cobertura A01–A15.
- **Exit.** Todo motivo e alvo do catálogo são subsumíveis. Cobertura equivalente a P0 demonstrada.

---

## STEP 6 — Testes de precisão (super-inclusão)

### Objetivo

Verificar que P0' não condena o que P0 corretamente preservou. Essa é a única verificação empírica necessária — os testes de cobertura são dispensados por monotonicidade (§1.6).

### Procedimento

1. **Casos R3** (C09, C11, C13, C17, C19): aplicar P0' a cada um. Registrar o veredito e comparar com o veredito de P0. Divergência = super-inclusão.
2. **Casos novos** (N1, N2, N3 da rodada 5.3): aplicar P0' a cada um. Registrar o veredito e verificar plausibilidade.
3. **Caso de fronteira adicional**: construir 1 caso novo projetado para estressar a generalização — uma situação que caia na fronteira entre duas categorias do componente negativo. Aplicar P0' e verificar que o resultado não é absurdo.
4. Se super-inclusão for detectada: identificar qual conceito categórico é amplo demais e retornar ao Step 3 ou 4 para estreitá-lo. Não estreitar o princípio inteiro.

**Método canônico.** Equilíbrio reflexivo — teste de precisão (§1.5).

### Deliverable

- `06-testes-precisao.md` — tabela de vereditos R3 + novos + fronteira + comparação com P0 + resultado.
- **Exit.** Zero super-inclusão. P0' é extensão conservadora de P0 confirmada.

---

## STEP 7 — Empacotamento

### Procedimento

1. Reunir os deliverables num único arquivo `Princípio Central — Versão Categórica.md`:
   - §1 — Infraestrutura conceitual (definições por gênero e diferença dos conceitos categóricos).
   - §2 — Princípio reformulado (P0+, componente negativo categórico, cláusulas categóricas).
   - §3 — Instâncias ilustrativas (motivos do catálogo como exemplos, não como definições).
   - §4 — Apêndice: tabela de subsunção (M01–M14 → conceitos categóricos).
   - §5 — Apêndice: rastro de equivalência com P0 (demonstração de extensão conservadora).
2. Registrar explicitamente: os motivos M01–M14 e os casos C01–C20 são instâncias representativas que ilustram as categorias, não a fonte da definição das categorias. A definição vem da conceituação (§1); os casos confirmam, não constituem.

### Deliverable

- `Princípio Central — Versão Categórica.md`.
- **Exit.** Documento autocontido, aplicável sem consulta ao catálogo.

---

## 3. Riscos e mitigação

| Risco | Como aparece | Mitigação |
|---|---|---|
| **Sobre-abstração** | Categorias tão gerais que perdem poder discriminatório; tudo cai sob tudo | Condições de Carnap — exatidão e fecundidade impõem limites; teste de precisão (Step 6) detecta o problema empiricamente |
| **Repetição do erro enumerativo** | Produzir N categorias em vez de 6 motivos, mas com o mesmo mapeamento 1:1 | Teste: cada categoria deve subsumir ≥2 motivos do catálogo E ser aplicável a ≥1 caso hipotético fora do catálogo; se não, a abstração não ocorreu |
| **Perda de cobertura** | Generalização tão estreita que um motivo do catálogo não é subsumível | Step 5 detecta explicitamente; retorno ao Step 2 ou 3 |
| **Super-inclusão** | P0' condena caso que P0 corretamente preservou | Step 6 detecta; estreitar o conceito específico, não o princípio inteiro |
| **Falsa convergência de cláusulas** | Cláusulas unificadas perdem a distinção normativa real entre situações diferentes | Step 4.3: verificar que a cláusula unificada produz o veredito correto em cada caso que as cláusulas originais governavam separadamente |
| **Arbitrariedade na escolha de categorias** | Categorias parecem ad hoc em vez de motivadas pela tradição filosófica | §1.3 exige definição por gênero e diferença; §1.1 exige as quatro condições de Carnap; o nível de abstração é ancorado em vocabulário já reconhecido pela filosofia moral e teoria da ação |

---

## 4. Mapa visual do procedimento

```
STEP 1  Revisão de P0+
   ↓
STEP 2  Invariantes do negativo (abstração)
   ↓
STEP 3  Conceituação do negativo (definições por gênero/diferença)
   ↓
STEP 4  Conceituação e redução das cláusulas
   ↓
STEP 5  Montagem + verificação de cobertura (subsunção)
   │       falha → STEP 2 ou 3
   ↓
STEP 6  Testes de precisão (super-inclusão)
   │       falha → STEP 3 ou 4
   ↓
STEP 7  Empacotamento → Princípio Central — Versão Categórica.md
```
