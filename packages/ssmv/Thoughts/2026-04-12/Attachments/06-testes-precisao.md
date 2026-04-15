# STEP 6 — Testes de Precisão (Super-inclusão)

> **Insumos.** `05-principio-P0-prime.md` (P0'); `Princípio Central — Versão Refinada.md` §4 (vereditos de P0 sobre R3 e novos).
> **Método.** Equilíbrio reflexivo — teste de precisão (Rawls, TJ §§4,9): verificar que P0' não condena o que P0 corretamente preservou.
> **Objetivo.** Confirmar extensão conservadora: zero super-inclusão. Forma: aplicar P0' a casos R3, novos e um caso de fronteira; comparar com veredito de P0.

---

## 1. Casos R3 — teste de super-inclusão

Os casos R3 são aqueles cujo veredito não é "condenação limpa" — incluem preservação condicional, não-decisão ou resultado nuançado. São os mais sensíveis à super-inclusão: uma generalização ampla demais poderia condenar o que P0 preservou.

### C09 — M03 (Falsa dicotomia)

**Veredito de P0:** NÃO DECIDE — N2 colapsa a dicotomia; Cláusula-A1 exige exame formal de coexistência antes de qualquer resultado.

**Aplicação de P0':**

*Componente negativo:* M03 é falsa dicotomia — C2/forma-de-restrição identifica a exclusividade como julgamento indexado à perspectiva interna do decisor. A força "minha preocupação genuína X exclui servir o afetado" é presumida falsa (perspectiva interna ≠ perspectiva objetiva sobre alternativas).

*Cláusula:* CL-A/Forma 3 governa. A presunção de falsidade é refutável: se o decisor realizar exame formal de coexistência e documentar a busca por alternativas que atendam ambos os lados, a presunção pode ser revertida.

*P0' veredito:* NÃO DECIDE — a presunção de falsidade suspende o veredito; CL-A/Forma 3 exige exame formal antes de qualquer resultado.

**Comparação:** Idêntico a P0. ✓ Zero super-inclusão.

---

### C11 — M05 (Ambiguidade semântica genuína)

**Veredito de P0:** PRESERVA N (condicional) — A07: o caminho de refinamento deve permanecer aberto.

**Aplicação de P0':**

*Estrutura do caso:* M05 apresenta ambiguidade semântica genuína entre camadas — o decisor não conhece, na decisão, a intenção real do consumidor. Isso é componente N legítimo: a ignorância real reescreve a obrigação.

*Cláusula:* CL-A/Forma 4 governa. O decisor pode adotar default sob ignorância real, com uma condição de demonstração positiva: o caminho de refinamento deve permanecer aberto para que o afetado especifique posteriormente sua intenção.

*P0' veredito:* PRESERVA N condicionalmente (caminho de refinamento aberto).

**Comparação:** Idêntico a P0. ✓ Zero super-inclusão. P0' não sobre-condena o componente N legítimo.

---

### C13 — M01 (Default de tooling)

**Veredito de P0:** CONDENA PASSIVIDADE / verifica P0+ — N1 colapsa "a ferramenta decidiu"; o decisor deve verificar o output e aplicar P0+.

**Aplicação de P0':**

*Componente negativo:* M01 é externalidade (C1): o decisor captura a conveniência de não examinar o output da ferramenta; o afetado arca com a superfície determinada pelo default. Força "a ferramenta decidiu" deriva da relação decisor-ferramenta, sem fundamento na relação afetado-superfície.

*Resultado:* C1 derrota M01 como razão derrotadora. O decisor deve verificar o output e aplicar P0+ ao que produz.

*P0' veredito:* CONDENA PASSIVIDADE — C1 colapsa a justificativa; P0+ aplica-se ao output.

**Comparação:** Idêntico a P0. ✓ Zero super-inclusão.

---

### C17 — M03 + M04 + M05 (composição)

**Veredito de P0:** CONDENA R (M03 e M04); PRESERVA N-M05 (condicional sob Cláusula-Q + A1).

**Aplicação de P0':**

*Componente M03:* C2/forma-de-restrição (dicotomia indexada) + CL-A/Forma 3 (exame de coexistência exigido). Sem exame, M03 é racionalização.

*Componente M04:* C1 (externalidade). O critério de encapsulamento é escolha arquitetural do decisor; o afetado arca com a fronteira. M04 é racionalização.

*Componente M05:* CL-A/Forma 4. Ambiguidade semântica genuína → N legítimo, preservado condicionalmente com caminho de refinamento aberto.

*P0' veredito:* CONDENA R (componentes M03 e M04 colapsam sob C1 + C2); PRESERVA N-M05 condicionalmente (CL-A/Forma 4).

**Comparação:** Idêntico a P0. ✓ A decomposição categórica reproduz exatamente a separação que P0 fazia com N2 + N3 + Cláusula-Q.

---

### C19 — M13 + M14 (composição)

**Veredito de P0:** CONDENA RACIONALIZAÇÃO / N residual sobrevive se P0+ satisfeito — P3 + P4 colapsam; verificação de P0+ sobre o que resta.

**Aplicação de P0':**

*Componente M13:* CL-B/Forma 2. Invocação de custo/risco não medido. Estado estável (não-mudança) cuja legitimidade depende do custo real, informação oculta ao afetado. Sem retorno rastreável: racionalização.

*Componente M14:* CL-B/Forma 3. Preservação de forma herdada. Sem teste de troca de autor: a forma é mantida passivamente, não endossada ativamente.

*P0' veredito:* CONDENA RACIONALIZAÇÃO (ambos os componentes colapsam sob CL-B sem restauração de simetria). Se N residual houver, aplica-se P0+ ao que resta.

**Comparação:** Idêntico a P0. ✓ Zero super-inclusão. P0' não over-condena além do que P0 já condenava.

---

## 2. Casos novos (rodada 5.3) — verificação de plausibilidade

### N1 — Runtime (feedback de operação em fila)

**Veredito de P0:** CONDENA — "Texto de fila não é progresso para o usuário."

**Aplicação de P0':**

O caso: superfície de runtime exibe estado interno de fila de processamento (ex.: "item #4371 enfileirado") como feedback ao usuário, em vez de informação sobre o progresso da sua operação.

*P0+:* A superfície deve oferecer ao afetado a melhor experiência de interação possível. Exibir estado interno de fila não mapeia às dimensões de §6.7: o afetado não consegue usar a informação de fila como feedback sobre o que lhe interessa (previsibilidade, relevância comprometidos).

*C1:* O decisor captura a conveniência de expor o estado interno diretamente (sem transformação); o afetado arca com informação que não serve suas operações.

*P0' veredito:* CONDENA — P0+ não satisfeito; C1 confirma ausência de fundamento na relação afetado-superfície.

**Plausibilidade:** Forte — a intuição "texto de fila ≠ progresso para o usuário" é instância direta de C1 (externalidade de estado interno). ✓

---

### N2 — Build combinado (composição + legado)

**Veredito de P0:** CONDENA (fachada como descrita) — "Migração sem plano é petrificação."

**Aplicação de P0':**

O caso: equipe mantém fachada legada sem plano de migração, invocando custo de migração dos consumidores externos.

*CL-B/Forma 1:* A invocação do estado estável (não-migração) tem peso normativo apenas com plano explícito de customização e prazo visível. A ausência do plano transforma o adiamento em racionalização.

*P0' veredito:* CONDENA (ausência de plano = racionalização; CL-B/Forma 1 não satisfeita).

**Plausibilidade:** Forte — migração sem plano visível é o caso paradigmático de CL-B/Forma 1. ✓

---

### N3 — M08 × M07 (demonstração positiva cruzada)

**Veredito de P0:** FORMA RICA (mapeada a ações do afetado) PREVALECE — "Provavelmente não usa ≠ não pode agir diferente."

**Aplicação de P0':**

O caso: o decisor quer usar tipos sintáticos simplificados (M07: custo sintático de taxonomia refinada) e argumenta que "os consumidores provavelmente não vão precisar do mapeamento detalhado de erros para ações" (tentativa de invocar indistinguibilidade funcional — M08).

*Infraestrutura + C1 sobre M07:* O custo sintático interno justifica a forma interna; não transfere para a forma exposta. Invocar M07 para a superfície é externalidade.

*CL-A/Forma 1 sobre M08:* A exceção "formas são indistinguíveis" requer demonstração positiva de indistinguibilidade funcional na estrutura de ação do afetado. "Provavelmente não vai usar" é afirmação probabilística sobre frequência de uso, não demonstração de indistinguibilidade estrutural: a distinção existe e é acessível quando o afetado precisa agir diferentemente.

*P0' veredito:* FORMA MAPEADA ÀS AÇÕES DO AFETADO PREVALECE — CL-A/Forma 1 não satisfeita; M07 colapsa sob infraestrutura + C1.

**Comparação:** Idêntico a P0. ✓ Zero super-inclusão.

---

## 3. Caso de fronteira (F1) — estresse entre C1 e CL-A/Forma 1

Este caso foi construído para estressar a fronteira entre a condenação por C1 (externalidade direta) e a arbitragem por CL-A/Forma 1 (onde escape via demonstração positiva existe). O teste crítico: P0' consegue distinguir entre "benefício do decisor como força invocada" (→ C1 condena sem escape) e "benefício do decisor como facto coexistente com reivindicação de indistinguibilidade" (→ CL-A governa, com escape)?

**Descrição do caso F1:** Uma equipe expõe endpoint único genérico `POST /recursos {tipo, carga}` em vez de `POST /usuarios` e `POST /pedidos`. Dois elementos coexistem: (a) a escolha economiza manutenção arquitetural (benefício do decisor — facto), e (b) a equipe argumenta "o consumidor só precisa definir o campo tipo; funcionalmente idêntico" (reivindicação de indistinguibilidade).

**Questão de fronteira:** C1 deve disparar por causa do benefício arquitetural coexistente? Ou CL-A/Forma 1 governa porque a reivindicação invocada é de indistinguibilidade?

**Aplicação de P0':**

*C1, condição (c):* A condição (c) exige que a força normativa *reivindicada* derive da distribuição assimétrica — não que o benefício coexista. Neste caso, a força reivindicada é indistinguibilidade funcional, não conveniência. O benefício arquitetural é facto concorrente, não o fundamento normativo invocado. C1 não dispara.

*Regra de articulação (§5 do STEP 5):* C1 opera sobre a natureza do fator invocado; CL-A opera sobre o ônus da prova quando exceção é reivindicada. Quando o decisor invoca indistinguibilidade, CL-A/Forma 1 governa — independentemente de benefício coexistente.

*CL-A/Forma 1:* A equipe deve demonstrar positivamente que `POST /recursos {tipo}` e `POST /usuarios / POST /pedidos` são funcionalmente indistinguíveis na estrutura de ação dos consumidores. Se a demonstração for feita: a exceção se estabelece, e o benefício arquitetural é irrelevante para a análise. Se não for feita: o resultado-default aplica-se (P0+ exige a forma que melhor mapeia às operações do afetado).

*P0' veredito:* CL-A/Forma 1 governa. C1 não condena por mera coexistência de benefício. O resultado depende da qualidade da demonstração positiva, não da presença do benefício.

**Análise de absurdo:** O resultado não é absurdo — preserva a distinção entre (a) fator invocado como benefício próprio (→ C1 condena) e (b) fator invocado como indistinguibilidade com benefício coexistente (→ CL-A arbitra). Isso é exatamente a distinção normativa que importa: o princípio não pune o decisor por ter benefício coexistente; pune o decisor que *funda* sua razão derrotadora no benefício próprio.

**Zero super-inclusão:** P0' não sobre-condena F1. C1 só opera quando o benefício próprio É a força normativa invocada. ✓

---

## 4. Resultado consolidado

| Caso | Veredito P0 | Veredito P0' | Coincidência | Super-inclusão? |
|---|---|---|---|---|
| C09 (M03) | Não decide / exame CL-A | Não decide / exame CL-A/F3 | ✓ | Não |
| C11 (M05) | Preserva N (condicional) | Preserva N / CL-A/F4 (condicional) | ✓ | Não |
| C13 (M01) | Condena passividade | Condena passividade / C1 | ✓ | Não |
| C17 (M03+M04+M05) | Condena R, preserva N-M05 | Condena R / C1+C2; preserva N / CL-A/F4 | ✓ | Não |
| C19 (M13+M14) | Condena racionalização | Condena racionalização / CL-B | ✓ | Não |
| N1 (runtime) | Condena | Condena / P0+ + C1 | ✓ (plausível) | Não |
| N2 (build) | Condena | Condena / CL-B/F1 | ✓ (plausível) | Não |
| N3 (M08×M07) | Forma mapeada prevalece | Forma mapeada prevalece / CL-A/F1 | ✓ (plausível) | Não |
| F1 (fronteira C1×CL-A) | — | CL-A/F1 governa; C1 não sobre-condena | — | Não |

---

## 5. Exit

**Zero super-inclusão detectada.**

P0' reproduz os vereditos de P0 em todos os casos R3 (5/5) e nos casos novos (3/3 com plausibilidade forte). O caso de fronteira F1 demonstra que P0' distingue corretamente entre "benefício como força invocada" (→ C1) e "benefício como facto coexistente com reivindicação legítima" (→ CL-A arbitra), sem sobre-condenar.

**P0' é extensão conservadora de P0 confirmada**: extensão por construção (STEP 5 §6) + zero super-inclusão empiricamente verificada (este step).

Pronto para STEP 7 — empacotamento em `Princípio Central — Versão Categórica.md`.
