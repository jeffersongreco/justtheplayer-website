# 07 — Coerência Estreita (STEP 4.1)

> Deliverable do STEP 4.1 do Plano de Execução.
> **Propósito.** Verificar coerência de P0 com cada um dos 20 casos individuais e com o catálogo §5. Procurar contradições latentes — não apenas falhas operacionais já vistas no STEP 3.
> **Princípio examinado.** P0 (versão estável pós-testes — `06-principio-Pn-pos-testes.md`).
> **Método.** (1) Mapear padrões cross-case e testar se produzem veredictos normativamente inconsistentes. (2) Inventariar coerência caso a caso. (3) Registrar observações de coerência que não são contradições mas merecem explicitação para o STEP 4.2.

---

## §1 — Padrões cross-case examinados

A busca por contradições latentes parte de seis padrões de tensão potencial:

| Padrão | Descrição | Casos examinados |
|--------|-----------|-----------------|
| P-A | Mesmo motivo, veredictos divergentes sem distinção principiada | M06 (C01/C04/C05/C08/C12/C16), M11 (C07/C15/C18), M07 (C03/C14), M13 (C19/C20), M03 (C09/C17) |
| P-B | Mesma família de superfície, regimes distintos — veredicto muda sem justificativa | Casos "ambos": C03, C08, C17, C19 |
| P-C | Cláusulas aplicadas ao mesmo motivo em casos distintos — interação incoerente | Cláusula-P2 em C02/C15 vs ausência em C19; Cláusula-Q em C03 vs C11 |
| P-D | N component sobrevive em uns e colapsa em outros sem distinção principiada | M07 (N colapsa) vs M05 (N sobrevive) — ambos mistos |
| P-E | Ordenamento de cláusulas produz resultado diferente em casos multi-cláusula | C02, C15, C16, C17, C19 |
| P-F | O conceito de "afetado" opera de modo assimétrico entre build e runtime | Todos os casos de ambos os regimes |

---

## §2 — Exame de cada padrão

---

### P-A — Mesmo motivo, veredictos divergentes

#### M06 (N4): C01, C04, C05, C08, C12, C16 condenados; C11, C13 distinguidos

C11 e C13 não invocam M06 como motivo primário. M06 puro (naturalidade do decisor) é condenado em todos os seis casos sem exceção. C11 usa M05 (ambiguidade semântica), não M06. C13 usa M01 (default de tooling). Não há caso onde M06 puro sobreviva. **Sem contradição.**

#### M07 (Cláusula-Q/A08): C03 e C14 — ambos condenados

Mesmo mecanismo: Cláusula-Q/A08 separa eixo interno (legítimo) do eixo exposto (não justificado). Ambos condenados pela mesma cláusula. **Sem contradição.**

#### M13 (Cláusula-P3): C20 condenado diretamente; C19 condena a racionalização mas preserva N residual

**Tensão potencial.** M13 produz condenação direta em C20 mas resultado condicional em C19. É inconsistência?

Não. A diferença é de objeto:

- **C20:** O threshold *em si* é a superfície. P0+ falha diretamente: um default de implementação não escolhido para o contexto do afetado não é "significativo e acionável" para ele. Cláusula-P3 adiciona ao colapsar o argumento "não havia tempo" — mas o veredicto viria de P0+ mesmo sem a cláusula.
- **C19:** A *interface do módulo* pode ou não satisfazer P0+ independentemente da motivação. M13+M14 são invocados para racionalizar a *não-avaliação* — e é isso que colapsa (Cláusulas-P3 e P4 eliminam as racionalizações). O N residual é: se a interface satisfaz P0+, ela não está em falha. P0 condena o bloqueio da avaliação, não a adequação em abstrato.

Estruturalmente: em C20, P0+ falha para a superfície; em C19, P0+ é inconclusivo sem verificação. As cláusulas fazem trabalho diferente nos dois casos porque o ponto de falha é diferente. **Sem contradição.**

#### M03 (N2 + Cláusula-A1): C09 e C17

Em ambos, N2 colapsa o componente R de M03 (a dicotomia é falsa). Em ambos, Cláusula-A1 exige exame de coexistência antes de decidir. Os dois casos recebem o mesmo tratamento de M03. Em C17, M04 e M05 coocorrem — N3 colapsa M04; N component de M05 sobrevive condicionalmente via Cláusula-Q/A07. Não há inconsistência na aplicação de M03. **Sem contradição.**

---

### P-B — Mesma superfície, regime "ambos" — veredicto muda?

Casos com regime declarado "ambos": C03, C08, C17, C19.

| Caso | Regime | Veredicto runtime | Veredicto build |
|------|--------|-------------------|-----------------|
| C03  | ambos | CONDENA | CONDENA |
| C08  | ambos | CONDENA | CONDENA |
| C17  | ambos | CONDENA R, PRESERVA N-M05 | CONDENA R, PRESERVA N-M05 |
| C19  | ambos | CONDENA RACIONALIZAÇÃO / preserva se P0+ satisfeito | idem |

Em todos os casos "ambos", P0 produz o mesmo veredicto em ambos os regimes. A regra que condena M06 no runtime (C04, C12) é a mesma que condena M06 no build (C01, C05). R-ATRAVESSADORA confirmada para os casos individuais. **Sem contradição.**

---

### P-C — Cláusula-P2 aplicada em C02/C15, ausente em C19

**Tensão potencial.** C02 e C15 invocam Cláusula-P2 explicitamente ("depois" sem plano = petrificação racionalizada). C19 também é um caso de manutenção indefinida sem plano de migração — por que Cláusula-P2 não é acionada?

**Resolução.** Cláusula-P2 é projetada para casos onde o decisor *promete remediação futura* sem caminho explícito (M09, M12 — "vamos refatorar depois"). Em C19, a justificativa não é de remediação prometida, mas de adequação presente ("funciona, risco de regressão"). O decisor não está prometendo mudar — está argumentando que não deve mudar. Por isso, as cláusulas relevantes são P3 (retorno do custo da não-mudança) e P4 (teste de troca de autor), não P2.

**Observação de coerência OC-1.** Cláusula-P2 implica petrificação por promessa não cumprida; Cláusula-P3 implica petrificação por assimetria informacional. São formas distintas do mesmo fenômeno — petrificação. Não há sobreposição incoerente: cada cláusula ataca o mecanismo específico da justificativa. **Sem contradição; observação registrada para STEP 4.2.**

---

### P-D — N component sobrevive em M05 mas não em M07 (ambos mistos)

**Tensão potencial.** M05 e M07 são classificados como "misto (N parcial)" na tabela de alvos. No entanto, em M07 (C03, C14), o N component sobrevive apenas na *forma interna*, não na *superfície exposta*. Em M05 (C11, C17), o N component pode sobreviver na *superfície exposta* condicionalmente. Por que a diferença?

**Resolução.** A diferença está no que o N component afirma:

- **M07 (custo sintático de tipos ricos):** O N legítimo é "formas internas mais simples são justificadas pelo custo sintático." Isso é verdade — mas irrelevante para a superfície exposta. Os dois eixos são independentes (A08). O N component de M07 *nunca* sustenta a forma exposta; sustenta apenas a forma interna.
- **M05 (ambiguidade semântica genuína):** O N legítimo é "a ambiguidade é real e o consumidor precisa lidar com ela" — por ex., se a operação é genuinamente assíncrona e o consumidor precisa tratar timeouts. Aqui o N component *pode* sustentar a forma exposta, porque a natureza da operação é relevante para a estrutura de ação do afetado.

A diferença é estrutural: M07 produz N component restrito à implementação interna; M05 pode produzir N component relevante à superfície exposta. Ambas as cláusulas Q/A07 e Q/A08 refletem essa distinção. **Sem contradição.**

**Observação de coerência OC-2.** A distinção entre "N interno" (M07) e "N de superfície" (M05) não está articulada explicitamente em P0+ ou P0−. Está implícita nas cláusulas. Registrar para verificação em STEP 4.2 (coerência ampla): A08 pressupõe que os dois eixos (interno/exposto) são sempre independentes — isso é uma afirmação de fundo sobre a relação entre representação interna e superfície, que merece verificação teórica.

---

### P-E — Ordenamento de cláusulas em casos multi-cláusula

Casos com múltiplas cláusulas aplicadas:

| Caso | Cláusulas aplicadas | Ordem importa? |
|------|---------------------|---------------|
| C02 | N6, Cláusula-P2 | Não: cada cláusula colapsa uma justificativa distinta |
| C15 | N6, Cláusula-P2 | Idem |
| C16 | N4, N5/A05 | Não: M06 e M10 são motivos distintos |
| C17 | N2, N3, Cláusula-Q/A07, Cláusula-A1 | Não: N2 e N3 colapsam R components; Q/A07 e A1 tratam o N |
| C19 | Cláusula-P3, Cláusula-P4 | Não: cada cláusula ataca uma justificativa distinta |
| N2 (5.3) | N6, Cláusula-P4, Cláusula-P2 | Não: cláusulas aditivas e independentes |

Em todos os casos multi-cláusula, as cláusulas operam sobre *justificativas distintas* — não competem pela mesma justificativa. A ordem de aplicação não afeta o resultado. R-12 (ordenamento) confirmado para todos os casos. **Sem contradição.**

---

### P-F — Conceito de "afetado" entre build e runtime

**Tensão potencial.** P0+ usa "afetado" como termo genérico. No build-time, o afetado é um desenvolvedor-consumidor da API/módulo. No runtime, é um usuário final. Os critérios "significativo, reconhecível e acionável" têm o mesmo sentido nos dois contextos?

**Verificação.** Os três critérios de P0+ são relacionais — definem "em função do afetado", não absolutamente. Portanto:

- "Significativo": o que o conteúdo da superfície significa *para o afetado específico* em seu contexto de ação.
- "Reconhecível": o que corresponde ao modelo mental e vocabulário *do afetado específico*.
- "Acionável": o que permite ao afetado agir corretamente *em sua estrutura de ação*.

Para desenvolvedor-consumidor (build): "acionável" = pode usar a API corretamente, inferir contratos, escrever código que funciona.
Para usuário final (runtime): "acionável" = pode decidir o que fazer, entender o estado, executar a ação pretendida.

A estrutura é paralela, não idêntica. P0+ não colapsa a distinção — aplica o mesmo esquema relacional a cada afetado. Esta é a fonte do poder atravessador de P0 (R-08, R-09).

**Observação de coerência OC-3.** P0+ não articula explicitamente "estrutura de ação do afetado" — esse conceito aparece no mecanismo de Cláusula-P1 (A14: "indistinguíveis na estrutura de ação do afetado") mas não no componente positivo. O positivo usa apenas "significativo, reconhecível e acionável." Se "acionável" pressupõe "estrutura de ação", esse pressuposto está implícito em P0+ mas explícito apenas em A14. Registrar para STEP 4.2 (incoerência potencial de fundo).

---

## §3 — Inventário caso a caso

Verificação rápida de cada um dos 20 casos: veredicto coerente com P0, sem contradição latente?

| ID | Veredicto STEP 3 | Coerência com P0 | Observação |
|----|-----------------|-----------------|------------|
| C01 | CONDENA (M06/N4) | ✓ | — |
| C02 | CONDENA (M11+M12/N6+P2) | ✓ | — |
| C03 | CONDENA (M07/Q-A08) | ✓ | V4 preservada sob A14 — distinguida corretamente |
| C04 | CONDENA (M06/N4) | ✓ | — |
| C05 | CONDENA (M06/N4) | ✓ | — |
| C06 | CONDENA (M10/N5-A05) | ✓ | — |
| C07 | CONDENA (M11/N6) | ✓ | — |
| C08 | CONDENA (M06/N4) | ✓ | — |
| C09 | NÃO DECIDE / aguarda A1 | ✓ | Correto: M03 colapsa; N depende de exame |
| C10 | CONDENA (M01+M06/N1+N4) | ✓ | — |
| C11 | PRESERVA N (M05/Q-A07) | ✓ | N sobrevive na superfície exposta — ver OC-2 |
| C12 | CONDENA (M06/N4) | ✓ | Condena motivação (trivial), não valor em abstrato |
| C13 | CONDENA PASSIVIDADE / verifica P0+ | ✓ | N1 condena excusa; P0+ é o critério do output |
| C14 | CONDENA (M07/Q-A08) | ✓ | Consistente com C03 (mesmo mecanismo) |
| C15 | CONDENA (M11+M12/N6+P2) | ✓ | Consistente com C02 |
| C16 | CONDENA (M06+M10/N4+N5) | ✓ | Dois pseudo-derrotadores independentes |
| C17 | CONDENA R / PRESERVA N-M05 | ✓ | Três motivos tratados separadamente sem conflito |
| C18 | CONDENA (M11/N6) | ✓ | — |
| C19 | CONDENA RACIONALIZAÇÃO / preserva se P0+ satisfeito | ✓ | Distinção principiada de C20 — ver §2/P-A |
| C20 | CONDENA (M13/P3) | ✓ | P0+ falha diretamente; P3 reforça |

**20/20 casos: coerência confirmada. Nenhum veredicto contradiz outro.**

---

## §4 — Observações de coerência registradas

As seguintes observações não são contradições, mas apontam pressupostos implícitos que o STEP 4.2 deve verificar:

**OC-1 — Petrificação como fenômeno unificado (Cláusulas-P2 e P3)**
Cláusula-P2 (petrificação por promessa não cumprida — M09/M12) e Cláusula-P3 (petrificação por assimetria informacional — M13) atacam mecanismos distintos do mesmo fenômeno. A teoria de fundo deve acomodar essa pluralidade sem torná-la ad hoc.

**OC-2 — N interno vs N de superfície (M07 × M05)**
M07 produz N component restrito à forma interna (nunca sustenta a superfície exposta). M05 pode produzir N component que sustenta a superfície exposta. A distinção é real e principiada — mas repousa sobre a afirmação de que os eixos interno/exposto são "sempre independentes" (A08). Isso é uma tese de fundo: em que condições os dois eixos poderiam *não* ser independentes? STEP 4.2 deve verificar se a teoria de fundo §1.1 do catálogo sustenta essa independência como regra geral.

**OC-3 — "Acionável" pressupõe "estrutura de ação" (P0+ → A14)**
P0+ usa "acionável" sem definir "estrutura de ação." Cláusula-P1/A14 usa "estrutura de ação do afetado" como critério procedimental de indistinguibilidade. Se "acionável" em P0+ não pressupõe "estrutura de ação," A14 está suspensa no ar — opera sobre um conceito mais preciso do que o componente positivo articula. STEP 4.2 deve verificar se o componente positivo precisa ser refinado para articular explicitamente esse pressuposto.

---

## §5 — Resultado do STEP 4.1

**Nenhuma contradição latente encontrada.**

- 20/20 casos com veredictos coerentes entre si e com P0.
- Ordenamento de cláusulas irrelevante em todos os casos multi-cláusula (R-12 confirmado).
- Propriedade atravessadora confirmada para todos os casos "ambos" (R-08 confirmado para casos individuais).
- Tratamento de "afetado" uniforme e estruturalmente paralelo nos dois regimes (R-09/R-10 confirmados).

**Três observações de coerência** (OC-1, OC-2, OC-3) registradas para o STEP 4.2 — coerência ampla. Nenhuma exige reformulação de P0; todas identificam pressupostos implícitos que a teoria de fundo §1.1 do catálogo deve acomodar.

---

## Conclusão do STEP 4.1

P0 é estável na coerência estreita. As três observações de coerência constituem a agenda do STEP 4.2.

- STEP 4.2: coerência ampla (teorias de fundo) → `08-coerencia-ampla.md`
- STEP 4.3: decisão de arquitetura final → `09-principio-refinado-final.md`
