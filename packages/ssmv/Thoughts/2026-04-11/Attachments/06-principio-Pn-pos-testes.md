# 06 — Princípio Pn Pós-Testes (Versão Estável após Convergência)

> Deliverable do STEP 3.5 do Plano de Execução.
> **Propósito.** Versão estável do princípio após convergência das Rodadas 5.1, 5.2 e 5.3. Inclui índice de iterações.
> **Resultado da convergência.** Pn = P0 — nenhuma iteração foi disparada. P0 é a versão final das rodadas de teste.

---

## Índice de iterações

| Versão | Disparado por | O que mudou | Status |
|--------|---------------|-------------|--------|
| P0     | —             | Formulação inicial (STEP 2) | **Versão final pós-testes** |

Nenhuma versão P1, P2, … foi produzida. As três rodadas de teste não revelaram falha estrutural em P0.

---

## Princípio Estável — P0

### Componente Positivo (P0+)

> Toda superfície de uso deve ser definida em função do que é significativo, reconhecível e acionável pelo afetado. Estruturas, nomenclaturas, fluxos e estados internos da implementação não constituem critério normativo para essa definição.

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
P0+ / P0−
  │
  ├── Cláusula-Q  (Qualificação para casos mistos)
  │     A07: ambiguidade semântica genuína entre camadas reescreve a obrigação —
  │           o decisor pode adotar default dado ignorância real da intenção do
  │           consumidor, desde que o caminho de refinamento permaneça aberto
  │     A08: custo sintático de tipos ricos justifica a forma interna; não justifica
  │           a mensagem/tipo exposto — os dois eixos são independentes
  │
  ├── Cláusula-P1 (Demonstração positiva de indistinguibilidade funcional)
  │     A14: sustenta A09 — a superfície útil prevalece a menos que o decisor
  │           demonstre positivamente que as duas formas são indistinguíveis na
  │           estrutura de ação do afetado
  │     A09: arbitragem útil × rica — resultado padrão: superfície útil; inversão
  │           somente sob demonstração positiva de A14
  │
  ├── Cláusula-P2 (Plano gradual contra petrificação)
  │     A12: adiamento de adequação ao afetado só tem peso normativo se acompanhado
  │           de caminho explícito de customização com prazo de revisão visível —
  │           sem caminho explícito, o adiamento é racionalização
  │
  ├── Cláusula-P3 (Retorno do custo real da não-mudança)
  │     A10: invocação de custo/risco sem medição só tem peso normativo se
  │           acompanhada de retorno visível e rastreável do custo real da
  │           não-mudança ao decisor
  │
  ├── Cláusula-P4 (Teste de troca de autor)
  │     A11: preservação de forma herdada só é admissível se o decisor sustenta a
  │           decisão sob o pressuposto de que o autor original é outro
  │
  ├── Cláusula-P5 (Demonstração positiva de compliance)
  │     A13: exceção de M02 válida somente mediante apontamento específico ao
  │           requisito externo que determina a forma da superfície; P0+ aplica-se
  │           integralmente ao que não for assim determinado
  │
  └── Cláusula-A1 (Exame formal de coexistência)
        A15: antes que preocupação legítima seja aceita como razão derrotadora, o
              decisor deve examinar formalmente se existe alternativa que atenda
              a preocupação sem comprometer a obrigação de P0+
```

---

## Evidência de estabilidade (referências aos arquivos de teste)

### Rodada 5.1 — `03-rodada-5-1-R1.md`

8/8 casos R1 condenados sem qualificação.

| Padrão aplicado | Casos | Cláusula |
|-----------------|-------|----------|
| M06 puro | C01, C04, C05, C12 | P0+ + N4 |
| M11 (reuso interno) | C07, C18 | P0+ + N6 |
| M06 + M10 | C16 | P0+ + N4 + N5 |
| M07 (erro/motor) | C03 | P0+ + Cláusula-Q/A08 |

### Rodada 5.2 — `04-rodada-5-2-R2-R3.md`

7/7 casos R2 condenados (convergência total). 5/5 casos R3 com resultado correto.

| Teste de falha | Resultado |
|----------------|-----------|
| Super-inclusão (C03-V4 condenado junto com C03-padrão?) | PASSOU |
| Sub-inclusão (M03 preservado junto com M08?) | PASSOU |
| Divergência por motivo misto (M05, M07, M12) | PASSOU |

### Rodada 5.3 — `05-rodada-5-3-casos-novos.md`

3/3 casos novos com intuições fortemente plausíveis.

| Fronteira | Teste | Resultado |
|-----------|-------|-----------|
| runtime fora do corpus | R-ATRAVESSADORA | PASSOU |
| Interação de cláusulas (N6+P4+P2) | Coerência entre cláusulas | PASSOU |
| M08 × M07 (demonstração positiva) | Estreiteza de Cláusula-P1 | PASSOU |

---

## Status de cobertura das restrições formais (R-01–R-14)

Cobertura verificada no STEP 2 (`02-principio-P0.md`, §5) e confirmada pelos testes:

| R-ID | Status pós-testes |
|------|-------------------|
| R-01 DESARMAR-C1 | ✓ — N1–N6 aplicados em 15 casos (R1+R2) sem falha |
| R-02 QUALIFICAR-INTERNO-M05 | ✓ — Cláusula-Q/A07 calibrada em C11, C17 |
| R-03 QUALIFICAR-INTERNO-M07 | ✓ — Cláusula-Q/A08 calibrada em C03, C14, N3 |
| R-04 PROCEDURALIZAR-M13 | ✓ — Cláusula-P3 aplicada em C20, C19 |
| R-05 PROCEDURALIZAR-M14 | ✓ — Cláusula-P4 aplicada em C19, N2 |
| R-06 PROCEDURALIZAR-M08 | ✓ — Cláusula-P1 estreita: C03-V4 preservado; N3 confirmado |
| R-07 EXCEÇÃO-ESTREITA-M02 | ✓ — Cláusula-P5 não acionada nos testes (sem caso M02 no R2/R3); cobertura formal intacta |
| R-08 ATRAVESSADORA | ✓ — N1 (runtime novo) e C09/C17 (build) confirmados |
| R-09 GENERALIDADE | ✓ — N1 (família nova) sem reformulação |
| R-10 UNIVERSALIDADE | ✓ — aplicado por praticante genérico em todos os casos |
| R-11 PUBLICIDADE | ✓ — cláusulas procedimentais publicamente exigíveis nos testes |
| R-12 ORDENAMENTO | ✓ — Cláusula-P1 arbitra útil × rica em N3 sem ambiguidade |
| R-13 FINALIDADE | ✓ *(confirmado empiricamente nas 3 rodadas — nenhum caso exigiu princípio externo)* |
| R-14 COBERTURA MÍNIMA | ✓ — todos os alvos cobertos; verificação herdada do STEP 2 |

**R-13 removido do flag "(a verificar)": confirmado empiricamente pelos testes.**

---

## Conclusão do STEP 3

P0 é a versão estável. Avança para STEP 4 — Equilíbrio Reflexivo Amplo.

- STEP 4.1: coerência estreita → `07-coerencia-estreita.md`
- STEP 4.2: coerência ampla (teorias de fundo) → `08-coerencia-ampla.md`
- STEP 4.3: decisão de arquitetura final → `09-principio-refinado-final.md`
