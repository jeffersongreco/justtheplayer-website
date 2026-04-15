# 09 — Princípio Refinado Final (STEP 4.3)

> Deliverable do STEP 4.3 do Plano de Execução.
> **Propósito.** Confirmar a decisão de arquitetura tomada no STEP 2; produzir o diagrama final do princípio; incorporar as anotações do STEP 4.2 (AN-1, AN-2, AN-3); registrar o rastro de versões.
> **Resultado.** P0 = versão final. Nenhuma iteração disparada em nenhum dos quatro STEPs anteriores. Arquitetura (a) confirmada.

---

## §1 — Confirmação da decisão de arquitetura

**Decisão original (STEP 2, §3).** Arquitetura (a): princípio central (P0+/P0−) com cláusulas anexas.

**Revisão após equilíbrio reflexivo amplo.**

Dois resultados do STEP 4 reforçam a escolha de (a) sobre (b):

1. **As cláusulas têm fundamentos teóricos distintos.** O STEP 4.2 mostrou que cada cláusula procedimental deriva de um mecanismo de bloqueio diferente (assimetria informacional, viés posicional, ambiguidade semântica genuína, etc.), identificado analiticamente no catálogo. Uma formulação monolítica teria de absorver esses fundamentos distintos num único enunciado, produzindo ou vagueza ou sintaxe intratável.

2. **A modularidade foi a condição de testabilidade.** O STEP 3 testou o núcleo (P0+/P0−) independentemente das qualificações — estratégia que só é possível se os dois são estruturalmente separáveis. Uma formulação super-articulada torna o teste de falsificação impossível: qualquer falha pode ser absorvida por alguma subcláusula, sem que o núcleo seja atacado diretamente.

**Decisão confirmada: arquitetura (a).**

---

## §2 — Notas explicativas incorporadas das verificações do STEP 4

Três anotações derivadas do STEP 4.2, incorporadas como clarificações do princípio sem reformulação de P0:

**AN-1 — Continuidade entre P0+ e Cláusula-P1.**
O critério "acionável" em P0+ pressupõe a existência de uma estrutura de ação identificável para o afetado. Cláusula-P1/A14 operacionaliza esse pressuposto para o caso de arbitragem entre superfícies concorrentes. Não há descontinuidade: A14 especifica o critério de "acionável" para o caso comparativo. O método de identificação da estrutura de ação em cada caso é o reconhecimento intersubjetivo por praticantes com amplitude posicional (§1.1 do catálogo).

**AN-2 — Unidade das Cláusulas-P2 e P3 sob "petrificação por assimetria procedural."**
Cláusula-P2 (plano gradual) e Cláusula-P3 (retorno do custo real) são instrumentos distintos para o mesmo fenômeno: petrificação sustentada por assimetria de informação entre decisor e afetado. Cada cláusula ataca o mecanismo específico que torna a petrificação estável em seu contexto — promessa implícita não verificável (P2) ou ausência de retorno do custo ao decisor (P3). A pluralidade é analiticamente justificada pelo diagnóstico do catálogo §6.

**AN-3 — Fundamento da independência dos eixos interno/exposto (A08).**
A afirmação de que os critérios normativos para a forma interna e a forma exposta são "sempre independentes" não é empírica — é estrutural. O afetado só encontra o eixo exposto; a forma interna é, por definição, invisível a ele. Portanto, nenhuma restrição sobre a forma interna é normativa para a forma exposta. A08 deriva dessa assimetria estrutural da relação decisor/afetado, não de uma contingência sobre sistemas de tipos.

---

## §3 — Princípio Refinado Final

### Componente Positivo

> Toda superfície de uso deve ser definida em função do que é significativo, reconhecível e acionável pelo afetado. Estruturas, nomenclaturas, fluxos e estados internos da implementação não constituem critério normativo para essa definição.

*Nota AN-1.* "Acionável" pressupõe que existe uma estrutura de ação do afetado identificável caso a caso. Cláusula-P1/A14 operacionaliza esse pressuposto para o caso de arbitragem entre superfícies concorrentes.

### Componente Negativo

Os seguintes fatores **não constituem razão derrotadora** da obrigação expressa no componente positivo:

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

---

## §4 — Rastro de versões

| Versão | Disparado por | Mudança | Status |
|--------|---------------|---------|--------|
| P0 | — | Formulação inicial (STEP 2) | **Versão final** |

Nenhuma versão P1, P2, … foi produzida.

- STEP 3 (3 rodadas, 28 casos): zero falhas. P0 não alterado.
- STEP 4.1 (coerência estreita, 20 casos): zero contradições latentes. P0 não alterado.
- STEP 4.2 (coerência ampla, 3 verificações + 3 OCs): zero incoerências de fundo. P0 não alterado. Três anotações incorporadas como notas explicativas (AN-1, AN-2, AN-3).

---

## §5 — Cobertura do orçamento filosófico

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

## §6 — Conclusão do STEP 4

P0 é a versão final do princípio. O equilíbrio reflexivo amplo (STEP 4.1 + 4.2 + 4.3) confirmou estabilidade sem disparar nenhuma iteração. A arquitetura (a) é confirmada.

Avança para STEP 5 — Empacotamento → `Princípio Central — Versão Refinada.md`.
