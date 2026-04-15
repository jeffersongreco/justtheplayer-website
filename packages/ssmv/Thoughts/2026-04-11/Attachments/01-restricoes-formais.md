# 01 — Restrições Formais ao Princípio

> Deliverable do STEP 1 do Plano de Execução.
> **Propósito.** Enunciar as condições que qualquer princípio candidato P deve satisfazer *antes* de ser avaliado nos testes da Etapa 5. Este passo é separado da formulação — a lista fecha aqui; nenhuma restrição é adicionada depois de iniciado o STEP 2.
> **Fontes.** Catálogo §4–§5 (restrições derivadas do material); Rawls, *A Theory of Justice*, §23, pp. 130–136 (restrições formais).

---

## Bloco A — Restrições derivadas do catálogo

### R-01 — DESARMAR-C1

**Proposição.** Qualquer P candidato deve **desarmar** os seguintes motivos como candidatos a derrotar a obrigação do truísmo: M01 (default de tooling), M03 (falsa dicotomia), M04 (encapsulamento nominal), M06 (fluxo de controle como "natural"), M10 (consistência/atomicidade sem transação), M11 (compartilhamento interno como fusão externa). O desarmamento exige mostrar, para cada motivo, *por que não conta como razão* — não basta proibir ou declarar inadequação.

**Motivos cobertos.** M01, M03, M04, M06, M10, M11 (todos R puros).
**Alvos correspondentes.** A01, A02, A03, A04, A05*, A06.
**Nota A05.** A05 tem status dual (C1 e irredutível): o desarmamento de M10 exige o teste específico de "transação apontável", que não é subsumível numa fórmula genérica — ver também R-14.

---

### R-02 — QUALIFICAR-INTERNO-M05

**Proposição.** Qualquer P candidato deve, para o caso de ambiguidade semântica genuína entre camadas (M05), distinguir:
- o **componente N** que sobrevive: legitimidade de escolher default dado ignorância real da intenção do consumidor;
- o **componente R** que colapsa: ausência de caminho para refinamento pelo consumidor.

O princípio não pode colapsar M05 inteiro em N puro (super-inclusão) nem tratá-lo como R puro (sub-exclusão da genuína ambiguidade).

**Alvo correspondente.** A07.

---

### R-03 — QUALIFICAR-INTERNO-M07

**Proposição.** Qualquer P candidato deve, para o custo sintático de taxonomia refinada (M07), distinguir:
- o **eixo dos tipos internos**, onde o custo sintático é componente N legítimo (tipos ricos podem ser dispensados);
- o **eixo da mensagem exposta ao humano**, onde o custo sintático é R (os dois eixos são independentes; o custo interno não autoriza a forma da mensagem externa).

O princípio não pode colapsar ambos os eixos sob uma única autorização.

**Alvo correspondente.** A08.

---

### R-04 — PROCEDURALIZAR-M13

**Proposição.** Qualquer P candidato deve, para a invocação de custo/risco sem medição (M13), especificar a **condição procedimental** sob a qual o motivo poderia ter peso: retorno visível e rastreável do custo real da não-mudança ao decisor. Enunciar a norma sem essa condição deixa M13 estável como racionalização estrutural — o colapso argumentativo não altera a assimetria informacional que o sustenta.

**Alvo correspondente.** A10.

---

### R-05 — PROCEDURALIZAR-M14

**Proposição.** Qualquer P candidato deve, para a familiaridade com o autor original como substituto de avaliação (M14), especificar a **condição procedimental** que o colapsa: o teste de troca de autor. O princípio não pode apenas afirmar que M14 é viés posicional — precisa tornar o teste operacionalizável para o decisor.

**Alvo correspondente.** A11.

---

### R-06 — PROCEDURALIZAR-M08

**Proposição.** Qualquer P candidato deve, para o conflito normativo genuíno de M08 (ausência de mapeamento entre modos de falha e ações do usuário), especificar a **condição procedimental estreita** sob a qual o conflito é genuíno: demonstração positiva de que as duas formas são indistinguíveis na estrutura de ação do afetado. Sem essa demonstração, M08 colapsa para racionalização — não há conflito normativo, apenas ausência de esforço.

**Alvos correspondentes.** A09, A14.

---

### R-07 — EXCEÇÃO-ESTREITA-M02

**Proposição.** Qualquer P candidato deve preservar a exceção de M02 (compliance/auditoria como obrigação vinculante) **sem deixar que essa exceção sirva de rota de fuga retórica**:
- a exceção é válida somente mediante demonstração positiva de compliance (apontamento específico ao requisito externo, não invocação genérica);
- o princípio se aplica integralmente ao que não for genuinamente determinado pelo requisito externo.

**Alvo correspondente.** A13.

---

### R-08 — ATRAVESSADORA

**Proposição.** Qualquer P candidato deve ser formulado de modo a **atravessar** os regimes `runtime` e `build-time` sem:
(a) colapsar a distinção entre os dois regimes;
(b) depender de assimetria não declarada entre UX (`runtime`) e DX (`build-time`).

Se o princípio funcionar apenas em um dos regimes, ou se exigir uma assimetria não fundamentada, a restrição não é satisfeita.

**Fundamento.** §2.2 do catálogo: os três regimes estão representados no corpus, inclusive a fronteira entre eles — a restrição atravessadora é necessária para que o princípio não seja esvaziado por um argumento de assimetria UX/DX.

---

## Bloco B — Restrições rawlsianas formais (Rawls, §23)

As cinco restrições de Rawls são incorporadas sem rejeição. Justificativa de cada incorporação a seguir.

### R-09 — GENERALIDADE

**Proposição.** Qualquer P candidato deve ser enunciado em termos gerais — sem referência a indivíduos, papéis nomeados, linguagens de programação específicas ou implementações particulares. A formulação não pode depender de propriedades acidentais de casos particulares do corpus.

**Incorporação.** Direta: o artigo visa a uma norma que transcende implementações específicas. Casos do corpus são *evidência*, não *especificação* do princípio.

---

### R-10 — UNIVERSALIDADE

**Proposição.** Qualquer P candidato deve poder ser seguido por **qualquer decisor que define uma superfície de uso** — no corpus, tanto em `runtime` quanto em `build-time` — como base de raciocínio prático. O princípio não pode exigir posição especial, informação privilegiada ou papel específico para ser aplicável.

**Incorporação.** Necessária para coerência com §1.2 do catálogo: a amplitude posicional é o critério de autoridade epistêmica, não o cargo. O princípio não pode pressupor um tipo de praticante incompatível com esse critério.

---

### R-11 — PUBLICIDADE

**Proposição.** Qualquer P candidato deve poder ser publicamente reconhecido e invocado: um decisor deve ser capaz de citá-lo como justificativa pública de sua decisão; um afetado deve ser capaz de invocá-lo como base de crítica. O princípio não pode funcionar apenas como critério privado ou interno de avaliação.

**Incorporação.** Direta e conectada à procedimentalização: as cláusulas procedimentais (A10, A11, A13, A14) só têm força normativa se forem publicamente exigíveis — o afetado precisa poder cobrar o procedimento.

---

### R-12 — ORDENAMENTO

**Proposição.** Qualquer P candidato deve, quando o componente positivo e uma cláusula qualificadora colidirem, **indicar qual prevalece ou especificar o procedimento para resolver o conflito**. A resolução não pode ser deixada ao arbítrio do decisor sem critério explícito.

**Incorporação.** Necessária dado o corpus: M08 é o único caso de conflito interno genuíno (superfície útil × superfície rica). O princípio precisa arbitrá-lo (A09), não apenas declará-lo como tensão.

---

### R-13 — FINALIDADE

**Proposição.** Qualquer P candidato deve funcionar como **instância final de apelação** nos raciocínios práticos sobre definição de superfície cobertos pelo corpus. Não pode depender de outro princípio externo ao artigo para resolver os casos incluídos nos testes das Rodadas 5.1–5.3.

**Incorporação.** Direta: a finalidade delimita o escopo do artigo e previne *scope creep* em direção a teorias rivais (Etapas posteriores).

---

## Bloco C — Restrição de cobertura mínima

### R-14 — COBERTURA MÍNIMA

**Proposição.** Qualquer P candidato deve cobrir, demonstravelmente, o orçamento filosófico mínimo do catálogo:

| Item a cobrir | Descrição |
|---|---|
| C1 | Desarmamento de R puros: A01, A02, A03, A04, A05, A06 |
| C2 | Qualificação e demonstração positiva: A07, A08, A13, A14 |
| C3 | Plano gradual contra petrificação: A12 |
| A05 (irredutível) | Atomicidade sem transação apontável — teste específico |
| A09 (irredutível) | Arbitragem útil × rica |
| A10 (irredutível) | Retorno do custo real da não-mudança |
| A11 (irredutível) | Teste de troca de autor |
| A15 (irredutível) | Exame formal de coexistência |

**Operacionalização.** A cobertura é verificada por mapeamento explícito na tabela de cobertura do arquivo `02-principio-P0.md`: para cada alvo, indicar qual cláusula do princípio o satisfaz. Alvo sem cláusula correspondente = restrição não satisfeita.

---

## Sumário: lista fechada de restrições

| ID   | Nome                     | Bloco | Alvos cobertos         |
|------|--------------------------|-------|------------------------|
| R-01 | DESARMAR-C1              | A     | A01–A06                |
| R-02 | QUALIFICAR-INTERNO-M05   | A     | A07                    |
| R-03 | QUALIFICAR-INTERNO-M07   | A     | A08                    |
| R-04 | PROCEDURALIZAR-M13       | A     | A10                    |
| R-05 | PROCEDURALIZAR-M14       | A     | A11                    |
| R-06 | PROCEDURALIZAR-M08       | A     | A09, A14               |
| R-07 | EXCEÇÃO-ESTREITA-M02     | A     | A13                    |
| R-08 | ATRAVESSADORA            | A     | —                      |
| R-09 | GENERALIDADE (Rawls)     | B     | —                      |
| R-10 | UNIVERSALIDADE (Rawls)   | B     | —                      |
| R-11 | PUBLICIDADE (Rawls)      | B     | —                      |
| R-12 | ORDENAMENTO (Rawls)      | B     | —                      |
| R-13 | FINALIDADE (Rawls)       | B     | —                      |
| R-14 | COBERTURA MÍNIMA         | C     | C1, C2, C3, irredutíveis |

**Total: 14 restrições.** Esta lista está fechada. Qualquer princípio candidato que não satisfaça alguma delas não é sequer avaliado nas Rodadas 5.1–5.3.

---

## Nota de arquitetura

As restrições rawlsianas (R-09 a R-13) não são redundantes com as restrições do catálogo (R-01 a R-08): elas operam em nível diferente. R-01 a R-08 dizem *o que* o princípio deve cobrir; R-09 a R-13 dizem *como* o princípio deve ser enunciado para ser válido como princípio. A distinção é necessária para que o teste da Etapa 5 possa atacar o núcleo separadamente das qualificações — exatamente a estratégia de Scanlon (referência do insumo metodológico) ao formular seu princípio contratualista em versão mínima antes de adicionar qualificações.
