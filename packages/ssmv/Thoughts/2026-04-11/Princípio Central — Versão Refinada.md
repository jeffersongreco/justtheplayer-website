# Princípio Central — Versão Refinada

> Deliverable do STEP 5 do Plano de Execução — Empacotamento.
> **Fontes.** `01-restricoes-formais.md` (§1), `09-principio-refinado-final.md` (§2), `03–05` (§4).
> **Status.** P0 = versão final. Zero iterações em todos os STEPs. Arquitetura (a) confirmada.

---

## §1 — Restrições Formais (lista fechada)

Qualquer princípio candidato deve satisfazer as 14 restrições abaixo antes de ser avaliado nos testes. Esta lista estava fechada antes do STEP 2 e não foi alterada.

### Bloco A — Derivadas do catálogo

| ID | Nome | Exigência | Alvos |
|----|------|-----------|-------|
| R-01 | DESARMAR-C1 | Desarmar M01, M03, M04, M06, M10, M11 como candidatos a derrotar a obrigação, mostrando *por que não contam* | A01–A06 |
| R-02 | QUALIFICAR-INTERNO-M05 | Distinguir o N legítimo (default sob ignorância real) do R (ausência de caminho de refinamento) | A07 |
| R-03 | QUALIFICAR-INTERNO-M07 | Separar eixo interno (custo sintático = N legítimo) do eixo exposto (custo interno não autoriza a forma exposta) | A08 |
| R-04 | PROCEDURALIZAR-M13 | Especificar a condição procedimental: retorno visível do custo real da não-mudança ao decisor | A10 |
| R-05 | PROCEDURALIZAR-M14 | Especificar o teste de troca de autor como condição operacionalizável de colapso | A11 |
| R-06 | PROCEDURALIZAR-M08 | Exigir demonstração positiva de indistinguibilidade funcional na estrutura de ação do afetado | A09, A14 |
| R-07 | EXCEÇÃO-ESTREITA-M02 | Exceção de compliance válida somente mediante apontamento específico; princípio aplica-se ao restante | A13 |
| R-08 | ATRAVESSADORA | Funcionar em runtime e build-time sem assimetria não fundamentada | — |

### Bloco B — Rawlsianas (Rawls, *A Theory of Justice*, §23)

| ID | Nome | Exigência |
|----|------|-----------|
| R-09 | GENERALIDADE | Enunciado sem referência a indivíduos, linguagens ou implementações particulares |
| R-10 | UNIVERSALIDADE | Aplicável por qualquer decisor que define superfície — sem posição especial ou informação privilegiada |
| R-11 | PUBLICIDADE | Publicamente citável pelo decisor como justificativa; publicamente invocável pelo afetado como crítica |
| R-12 | ORDENAMENTO | Conflito entre componente positivo e cláusula qualificadora resolve-se com critério explícito, não arbítrio |
| R-13 | FINALIDADE | Instância final de apelação nos raciocínios sobre definição de superfície cobertos pelos testes |

### Bloco C — Cobertura mínima

| ID | Nome | Exigência |
|----|------|-----------|
| R-14 | COBERTURA MÍNIMA | Cobrir demonstravelmente: C1 (desarmamento A01–A06), C2 (qualificação A07/A08/A13/A14), C3 (plano gradual A12), irredutíveis A05/A09/A10/A11/A15 |

---

## §2 — Princípio Refinado Final (P0)

### Componente Positivo (P0+)

> Toda superfície de uso deve ser definida em função do que é significativo, reconhecível e acionável pelo afetado. Estruturas, nomenclaturas, fluxos e estados internos da implementação não constituem critério normativo para essa definição.

*Nota AN-1.* "Acionável" pressupõe que existe uma estrutura de ação do afetado identificável caso a caso. Cláusula-P1/A14 operacionaliza esse pressuposto para o caso de arbitragem entre superfícies concorrentes.

### Componente Negativo (P0−)

Os seguintes fatores **não constituem razão derrotadora** da obrigação expressa em P0+:

**N1 — M01 (default de tooling)**
O default produzido por uma ferramenta não conta como razão derrotadora porque a escolha da ferramenta e de sua configuração é decisão do decisor, não restrição imposta ao afetado.

**N2 — M03 (falsa dicotomia)**
A apresentação de uma preocupação legítima do decisor como excludente do interesse do afetado não conta, porque a exclusividade é falsa: a preocupação pode ser atendida de múltiplas formas. (Ver Cláusula-A1.)

**N3 — M04 (encapsulamento nominal)**
O encapsulamento não conta porque o critério de encapsulamento é estabelecido pelo decisor, não pelo afetado.

**N4 — M06 (fluxo de controle como "natural")**
A naturalidade percebida pelo decisor não conta porque o que é natural para o decisor — ordem de processamento, sequência de operações, nomenclatura do modelo de dados — não é necessariamente reconhecível como natural para o afetado.

**N5 — M10 (consistência/atomicidade sem transação apontável)**
A invocação de consistência ou atomicidade não conta sem uma transação apontável — uma operação identificável que vincule causalmente os elementos agrupados do ponto de vista do afetado. *(Sub-cláusula A05: ausência de transação apontável é condição suficiente para o desarmamento.)*

**N6 — M11 (compartilhamento interno como fusão de superfícies)**
A reutilização interna de uma estrutura não conta como razão derrotadora para expô-la como superfície, porque a conveniência do decisor não altera o critério normativo.

### Cláusulas Anexas

```
Componente Positivo / Componente Negativo
  │
  ├── Cláusula-Q  (Qualificação para casos mistos — M05, M07)
  │     A07: ambiguidade semântica genuína entre camadas reescreve a obrigação —
  │           o decisor pode adotar default dado ignorância real da intenção do
  │           consumidor, desde que o caminho de refinamento permaneça aberto
  │     A08: custo sintático de tipos ricos justifica a forma interna; não justifica
  │           a mensagem/tipo expostos — os dois eixos são normativamente independentes
  │           [AN-3: independência deriva da invisibilidade da forma interna para o afetado]
  │
  ├── Cláusula-P1 (Demonstração positiva de indistinguibilidade funcional — M08)
  │     A14: sustenta A09 — a superfície útil prevalece a menos que o decisor
  │           demonstre positivamente que as duas formas são indistinguíveis na
  │           estrutura de ação do afetado
  │           [AN-1: "estrutura de ação" operacionaliza "acionável" do componente positivo]
  │     A09: arbitragem útil × rica — resultado padrão: superfície útil; inversão
  │           somente sob demonstração positiva de A14
  │
  ├── Cláusula-P2 (Plano gradual contra petrificação — M09, M12)
  │     A12: adiamento de adequação ao afetado só tem peso normativo se acompanhado
  │           de caminho explícito de customização com prazo de revisão visível —
  │           sem caminho explícito, o adiamento é racionalização
  │           [AN-2: P2 + P3 são instrumentos distintos do mesmo fenômeno de petrificação]
  │
  ├── Cláusula-P3 (Retorno do custo real da não-mudança — M13)
  │     A10: invocação de custo/risco sem medição só tem peso normativo se
  │           acompanhada de retorno visível e rastreável do custo real da
  │           não-mudança ao decisor
  │           [AN-2: ver Cláusula-P2]
  │
  ├── Cláusula-P4 (Teste de troca de autor — M14)
  │     A11: preservação de forma herdada só é admissível se o decisor sustenta a
  │           decisão sob o pressuposto de que o autor original é outro
  │
  ├── Cláusula-P5 (Demonstração positiva de compliance — M02)
  │     A13: exceção válida somente mediante apontamento específico ao requisito
  │           externo que determina a forma da superfície; componente positivo
  │           aplica-se integralmente ao que não for assim determinado
  │
  └── Cláusula-A1 (Exame formal de coexistência — M03)
        A15: antes que preocupação legítima seja aceita como razão derrotadora, o
              decisor deve examinar formalmente se existe alternativa que a atenda
              sem comprometer a obrigação do componente positivo
```

### Notas explicativas (incorporadas do STEP 4.2)

**AN-1 — Continuidade entre P0+ e Cláusula-P1.**
O critério "acionável" em P0+ pressupõe a existência de uma estrutura de ação identificável para o afetado. Cláusula-P1/A14 operacionaliza esse pressuposto para o caso de arbitragem entre superfícies concorrentes. Não há descontinuidade: A14 especifica o critério de "acionável" para o caso comparativo. O método de identificação da estrutura de ação em cada caso é o reconhecimento intersubjetivo por praticantes com amplitude posicional (§1.1 do catálogo).

**AN-2 — Unidade das Cláusulas-P2 e P3 sob "petrificação por assimetria procedural."**
Cláusula-P2 (plano gradual) e Cláusula-P3 (retorno do custo real) são instrumentos distintos para o mesmo fenômeno: petrificação sustentada por assimetria de informação entre decisor e afetado. Cada cláusula ataca o mecanismo específico que torna a petrificação estável em seu contexto — promessa implícita não verificável (P2) ou ausência de retorno do custo ao decisor (P3). A pluralidade é analiticamente justificada pelo diagnóstico do catálogo §6.

**AN-3 — Fundamento da independência dos eixos interno/exposto (A08).**
A afirmação de que os critérios normativos para a forma interna e a forma exposta são "sempre independentes" não é empírica — é estrutural. O afetado só encontra o eixo exposto; a forma interna é, por definição, invisível a ele. Portanto, nenhuma restrição sobre a forma interna é normativa para a forma exposta. A08 deriva dessa assimetria estrutural da relação decisor/afetado, não de uma contingência sobre sistemas de tipos.

---

## §3 — Apêndice: Rastro de Iterações

| Versão | Disparado por | Mudança | Status |
|--------|---------------|---------|--------|
| P0 | — | Formulação inicial (STEP 2) | **Versão final** |

**Zero iterações.** Nenhuma versão P1, P2, … foi produzida.

| Etapa | Resultado |
|-------|-----------|
| STEP 3 — 3 rodadas, 28 casos | Zero falhas. P0 não alterado. |
| STEP 4.1 — coerência estreita, 20 casos | Zero contradições latentes. P0 não alterado. |
| STEP 4.2 — coerência ampla, 3 verificações + 3 OCs | Zero incoerências de fundo. P0 não alterado. Três anotações incorporadas (AN-1, AN-2, AN-3). |
| STEP 4.3 — decisão de arquitetura | Arquitetura (a) confirmada. P0 = versão final. |

### Cobertura das restrições formais (confirmada pelos testes)

| R-ID | Status |
|------|--------|
| R-01 DESARMAR-C1 | ✓ — N1–N6 aplicados em 15 casos (R1+R2) sem falha |
| R-02 QUALIFICAR-INTERNO-M05 | ✓ — Cláusula-Q/A07 calibrada em C11, C17 |
| R-03 QUALIFICAR-INTERNO-M07 | ✓ — Cláusula-Q/A08 calibrada em C03, C14, N3 |
| R-04 PROCEDURALIZAR-M13 | ✓ — Cláusula-P3 aplicada em C20, C19 |
| R-05 PROCEDURALIZAR-M14 | ✓ — Cláusula-P4 aplicada em C19, N2 |
| R-06 PROCEDURALIZAR-M08 | ✓ — Cláusula-P1 estreita: C03-V4 preservado; N3 confirmado |
| R-07 EXCEÇÃO-ESTREITA-M02 | ✓ — Cláusula-P5 formalmente coberta |
| R-08 ATRAVESSADORA | ✓ — N1 (runtime novo) e C09/C17 (build) confirmados |
| R-09 GENERALIDADE | ✓ — aplicado por praticante genérico em todos os casos |
| R-10 UNIVERSALIDADE | ✓ — aplicado por praticante genérico em todos os casos |
| R-11 PUBLICIDADE | ✓ — cláusulas procedimentais publicamente exigíveis nos testes |
| R-12 ORDENAMENTO | ✓ — Cláusula-P1 arbitra útil × rica em N3 sem ambiguidade |
| R-13 FINALIDADE | ✓ — confirmado empiricamente nas 3 rodadas; nenhum caso exigiu princípio externo |
| R-14 COBERTURA MÍNIMA | ✓ — todos os alvos cobertos (tabela §2 do presente documento) |

### Cobertura do orçamento filosófico

| Item | Cláusula em P0 | Status |
|------|----------------|--------|
| C1 — Desarmamento de R puros (A01–A06) | P0− N1–N6 | ✓ |
| C2 — Qualificação e demonstração positiva (A07, A08, A13, A14) | Cláusula-Q + P1 + P5 | ✓ |
| C3 — Plano gradual contra petrificação (A12) | Cláusula-P2 | ✓ |
| A05 (irredutível) | Sub-cláusula de N5 | ✓ |
| A09 (irredutível) | Cláusula-P1 (resultado padrão de arbitragem) | ✓ |
| A10 (irredutível) | Cláusula-P3 | ✓ |
| A11 (irredutível) | Cláusula-P4 | ✓ |
| A15 (irredutível) | Cláusula-A1 | ✓ |

**Orçamento filosófico integralmente coberto.**

---

## §4 — Apêndice: Cobertura Caso a Caso

### Rodada 5.1 — Casos R1 (condenação firme)

| Caso | Regime | Motivo | Resultado | Cláusulas |
|------|--------|--------|-----------|-----------|
| C01 | build | M06 | CONDENA | P0+ + N4 |
| C03 | ambos | M07 | CONDENA | P0+ + Cláusula-Q/A08 |
| C04 | runtime | M06 | CONDENA | P0+ + N4 |
| C05 | build | M06 | CONDENA | P0+ + N4 |
| C07 | build | M11 | CONDENA | P0+ + N6 |
| C12 | runtime | M06 | CONDENA | P0+ + N4 |
| C16 | runtime | M06+M10 | CONDENA | P0+ + N4 + N5 |
| C18 | build | M11 | CONDENA | P0+ + N6 |

**8/8 condenados sem qualificação.**

### Rodada 5.2 — Casos R2 (justificativa instável)

| Caso | Motivo | Resultado | Cláusulas |
|------|--------|-----------|-----------|
| C02 | M11+M12 | CONDENA PURO | N6 + Cláusula-P2 |
| C06 | M10 | CONDENA PURO | N5/A05 |
| C08 | M06 | CONDENA PURO | N4 |
| C10 | M01+M06 | CONDENA PURO | N1 + N4 |
| C14 | M07 | CONDENA PURO | Cláusula-Q/A08 |
| C15 | M11+M12 | CONDENA PURO | N6 + Cláusula-P2 |
| C20 | M13 | CONDENA PURO | Cláusula-P3 |

**7/7 condenados. Convergência total (D2 = R esperado).**

### Rodada 5.2 — Casos R3 (indeterminado a priori)

| Caso | Motivo | Resultado | Observação |
|------|--------|-----------|------------|
| C09 | M03 | NÃO DECIDE — aguarda exame de coexistência | N2 colapsa dicotomia; Cláusula-A1 exige varredura |
| C11 | M05 | PRESERVA N (condicional) | A07: caminho de refinamento deve estar aberto |
| C13 | M01 | CONDENA PASSIVIDADE / verifica P0+ | N1 colapsa "a ferramenta decidiu"; decisor deve verificar output |
| C17 | M03+M04+M05 | CONDENA R, PRESERVA N-M05 (condicional) | N2/N3 colapsam R; N-M05 sobrevive sob Cláusula-Q + A1 |
| C19 | M13+M14 | CONDENA RACIONALIZAÇÃO / preserva se P0+ satisfeito | P3 + P4 colapsam; N residual sobrevive sob verificação |

**5/5 com resultado correto. Testes de super-inclusão, sub-inclusão e divergência: PASSOU.**

### Rodada 5.3 — Casos Novos (fora do corpus)

| Caso | Fronteira | Resultado | Intuição |
|------|-----------|-----------|----------|
| N1 | runtime fora do corpus (feedback de operação) | CONDENA | "Texto de fila não é progresso para o usuário" |
| N2 | build combinado (composição + legado) | CONDENA (fachada como descrita) | "Migração sem plano é petrificação" |
| N3 | M08 × M07 (demonstração positiva) | FORMA RICA PREVALECE (sem demonstração) | "Provavelmente não usa ≠ não pode agir diferente" |

**3/3 com intuições fortemente plausíveis. R-ATRAVESSADORA confirmada. Cláusula-P1 estreita o suficiente.**

---

## Exclusões explícitas

O presente documento **não inclui** e não pretende incluir:

1. **Teorias rivais.** Nenhuma análise comparativa com frameworks alternativos (e.g., princípios de affordance, heurísticas de Nielsen, contratos formais de API). O princípio foi elaborado como instância final para seu escopo (R-13); comparação com teorias rivais pertence a etapa posterior.

2. **Objeções ao princípio.** Nenhuma seção de objeções/respostas. O equilíbrio reflexivo amplo (STEP 4) verificou coerência interna e compatibilidade com as teorias de fundo do catálogo — não substituiu a interlocução dialética com posições rivais.

3. **Estilização ou prescrições de apresentação.** O princípio governa o que a superfície deve ser para o afetado; não governa convenções de apresentação, nomenclatura de componentes, ou formatação de código. Extensões nessa direção requerem princípios adicionais.
