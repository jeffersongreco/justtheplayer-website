# 02 — Princípio Candidato Mínimo P0

> Deliverable do STEP 2 do Plano de Execução.
> **Propósito.** Formular o princípio candidato mínimo que satisfaz todas as restrições de `01-restricoes-formais.md`. "Mínimo" é técnico: cobre o orçamento filosófico sem cobrir mais que o necessário.
> **Versão.** P0 (primeira formulação; nenhuma iteração disparada ainda).

---

## §1 — Componente Positivo

**P0+**

> Toda superfície de uso deve ser definida em função do que é significativo, reconhecível e acionável pelo afetado. Estruturas, nomenclaturas, fluxos e estados internos da implementação não constituem critério normativo para essa definição.

*Nota de formulação.* O truísmo-base é: "o decisor deve definir a superfície de uso orientado ao afetado, não à implementação." A reescrita acima não adiciona conteúdo — apenas articula o que o truísmo pressupõe: que o critério normativo é o afetado, e que a implementação é normalmente inerte nessa função. A expressão "significativo, reconhecível e acionável" é a operacionalização mínima de "orientado ao afetado" — impõe três condições que o componente procedimental das cláusulas pode verificar.

---

## §2 — Componente Negativo (Desarmamento de C1)

**P0−**

Os seguintes fatores não constituem razão derrotadora da obrigação expressa em P0+:

**N1 — M01 (default de tooling)**
O default produzido por uma ferramenta não conta como razão derrotadora porque a escolha da ferramenta e de sua configuração é uma decisão do decisor, não uma restrição imposta ao afetado. O que o tooling produz por omissão reflete a convenção da ferramenta — não o que é significativo, reconhecível ou acionável pelo afetado.

**N2 — M03 (falsa dicotomia)**
A apresentação de uma preocupação legítima do decisor como excludente do interesse do afetado não conta como razão derrotadora porque a exclusividade é falsa: a preocupação legítima pode ser atendida de múltiplas formas, e a forma que o afetado encontra permanece sujeita à obrigação de P0+. A preocupação legítima pode pesar na escolha entre alternativas igualmente adequadas ao afetado — não pode eliminar a obrigação. (Ver também Cláusula-A1.)

**N3 — M04 (encapsulamento nominal)**
O encapsulamento não conta como razão derrotadora porque o critério de encapsulamento — o que está "dentro" do módulo — é estabelecido pelo decisor, não pelo afetado. Invocar encapsulamento para justificar a forma da superfície é tratar como restrição externa aquilo que é decisão interna, replicando a assimetria que P0+ pretende corrigir.

**N4 — M06 (fluxo de controle como "natural")**
A naturalidade percebida pelo decisor não conta como razão derrotadora porque o que é natural para o decisor — a ordem de processamento interno, a sequência de operações, a nomenclatura do modelo de dados — não é necessariamente reconhecível como natural para o afetado. O marcador "natural" sem qualificação posicional é evidência de confusão de perspectivas, não de adequação ao afetado.

**N5 — M10 (consistência/atomicidade sem transação apontável)**
A invocação de consistência ou atomicidade não conta como razão derrotadora sem uma transação apontável — uma operação identificável que vincule causalmente os elementos agrupados do ponto de vista do afetado. Sem transação apontável, a invocação de atomicidade é racionalização estrutural sem substância técnica. *(Sub-cláusula A05: o critério de verificação é apontar a transação específica; ausência de transação apontável é condição suficiente para o desarmamento.)*

**N6 — M11 (compartilhamento interno como fusão de superfícies)**
A reutilização interna de uma estrutura não conta como razão derrotadora para expô-la como superfície porque a conveniência interna do decisor não altera o critério normativo. O afetado encontra a superfície tal como é — não como o decisor a reutiliza internamente.

---

## §3 — Decisão de Arquitetura

**Decisão: Arquitetura (a) — Princípio central (P0+/P0−) com cláusulas anexas.**

**Justificação.** O orçamento filosófico do catálogo compreende 3 consolidações (C1, C2, C3) e 5 alvos irredutíveis (A05, A09, A10, A11, A15). Comprimir esse orçamento num único enunciado super-articulado produziria ou vagueza (cobertura nominal sem critério operacional) ou monstrismo sintático (extensão que torna o princípio inaplicável na prática). A separação em cláusulas permite que os testes da Etapa 5 ataquem o núcleo (P0+/P0−) independentemente das qualificações — exatamente a estratégia de Scanlon ao formular o princípio contratualista em versão mínima antes de adicionar qualificações (*"Contractualism and Utilitarianism"*, 1982, pp. 110–117). Esta decisão será revisitada na Etapa 6, §4.3 do plano.

---

## §4 — Esboço das Cláusulas

```
P0+ (componente positivo)
P0− (componente negativo — N1 a N6, com sub-cláusula A05 em N5)
  │
  ├── Cláusula-Q  (Qualificação para casos mistos)
  │     A07: ambiguidade semântica genuína entre camadas reescreve a obrigação — o decisor
  │           pode adotar default dado ignorância real da intenção do consumidor, desde que
  │           o caminho de refinamento pelo consumidor permaneça aberto
  │     A08: custo sintático de tipos ricos justifica a forma *interna*; não justifica a
  │           mensagem exposta ao afetado — os dois eixos são independentes
  │
  ├── Cláusula-P1 (Demonstração positiva de indistinguibilidade funcional)
  │     A14: sustenta A09 — a superfície útil prevalece a menos que o decisor demonstre
  │           positivamente que as duas formas são indistinguíveis na estrutura de ação
  │           do afetado (o que a ação do afetado é capaz de distinguir operacionalmente)
  │     A09: arbitragem útil × rica — resultado padrão: superfície útil; inversão somente
  │           sob demonstração positiva de A14; sem essa demonstração, M08 não é conflito
  │           normativo genuíno, é ausência de esforço
  │
  ├── Cláusula-P2 (Plano gradual contra petrificação)
  │     A12: o adiamento de adequação ao afetado só tem peso normativo se acompanhado de
  │           caminho explícito de customização com prazo de revisão visível — sem caminho
  │           explícito, o adiamento é racionalização (M09, M12 e o motivo atravessador)
  │
  ├── Cláusula-P3 (Retorno do custo real da não-mudança)
  │     A10: a invocação de custo ou risco sem medição só tem peso normativo se acompanhada
  │           de retorno visível e rastreável do custo real da não-mudança ao decisor —
  │           sem esse retorno, M13 é racionalização estrutural sustentada por assimetria
  │           informacional, não razão genuína
  │
  ├── Cláusula-P4 (Teste de troca de autor)
  │     A11: a preservação de forma herdada só é admissível se o decisor consegue sustentar
  │           a decisão sob o pressuposto de que o autor original é outro — o teste colapsa
  │           M14 (familiaridade com o autor como substituto de avaliação)
  │
  ├── Cláusula-P5 (Demonstração positiva de compliance)
  │     A13: a exceção de M02 (compliance/auditoria como obrigação vinculante) é válida
  │           somente mediante apontamento específico ao requisito externo que determina a
  │           forma da superfície; P0+ aplica-se integralmente ao que não for assim
  │           determinado pelo requisito externo
  │
  └── Cláusula-A1 (Exame formal de coexistência)
        A15: antes que uma preocupação legítima seja aceita como razão derrotadora, o decisor
              deve examinar formalmente se existe alternativa que atenda a preocupação sem
              comprometer a obrigação de P0+ — esta cláusula é anterior e mais ampla que N2,
              pois exige varredura do espaço de soluções, não apenas rejeição da dicotomia
```

**Nota sobre A05.** A sub-cláusula em N5 incorpora o conteúdo de A05 sem cláusula própria. A05 será promovido a cláusula separada apenas se os testes revelarem que a fusão com N5 produz ambiguidade operacional.

**Nota sobre A09.** A09 não é cláusula isolada — é o resultado do mecanismo introduzido por Cláusula-P1 (A14). A arbitragem está embutida na estrutura: sem demonstração de A14, superfície útil prevalece; com demonstração, o decisor tem espaço normativo para a superfície rica.

---

## §5 — Verificação Cruzada com Restrições Formais (R-01–R-14)

| R-ID | Nome | Satisfeito por | Status |
|------|------|----------------|--------|
| R-01 | DESARMAR-C1 | P0− (N1–N6): cada motivo desarmado com cláusula "porque" explicitando por que não conta como razão | ✓ |
| R-02 | QUALIFICAR-INTERNO-M05 | Cláusula-Q, item A07 — distingue N (default legítimo dado ignorância real) de R (fechar o caminho de refinamento) | ✓ |
| R-03 | QUALIFICAR-INTERNO-M07 | Cláusula-Q, item A08 — eixo interno (custo sintático de tipos) e eixo externo (mensagem exposta) são independentes | ✓ |
| R-04 | PROCEDURALIZAR-M13 | Cláusula-P3 (A10): condição procedimental = retorno visível e rastreável do custo real da não-mudança ao decisor | ✓ |
| R-05 | PROCEDURALIZAR-M14 | Cláusula-P4 (A11): condição procedimental = teste de troca de autor operacionalizado | ✓ |
| R-06 | PROCEDURALIZAR-M08 | Cláusula-P1 (A14): condição procedimental estreita = demonstração positiva de indistinguibilidade na estrutura de ação do afetado | ✓ |
| R-07 | EXCEÇÃO-ESTREITA-M02 | Cláusula-P5 (A13): apontamento específico ao requisito externo; P0+ aplica-se ao que não for determinado por ele | ✓ |
| R-08 | ATRAVESSADORA | P0+ usa "superfície de uso" e "afetado" sem referência a regime; P0− não pressupõe assimetria UX/DX; Cláusula-Q atravessa build-time (A08) e runtime (A07) | ✓ |
| R-09 | GENERALIDADE (Rawls) | P0+ e P0− não referenciam linguagens, papéis nomeados, ferramentas específicas ou implementações particulares | ✓ |
| R-10 | UNIVERSALIDADE (Rawls) | P0+ é aplicável por qualquer decisor que define uma superfície em runtime ou build-time, sem exigir posição especial ou informação privilegiada | ✓ |
| R-11 | PUBLICIDADE (Rawls) | As cláusulas procedimentais são exigíveis publicamente: o afetado pode invocar Cláusula-P3, P4, P5 e Cláusula-A1 como base de crítica | ✓ |
| R-12 | ORDENAMENTO (Rawls) | Cláusula-P1 especifica o procedimento de arbitragem útil × rica: superfície útil por padrão; inversão somente sob demonstração positiva de A14 | ✓ |
| R-13 | FINALIDADE (Rawls) | P0 + cláusulas cobrem todos os casos das Rodadas 5.1–5.3 sem depender de princípio externo ao artigo | ✓ *(a verificar na Etapa 5)* |
| R-14 | COBERTURA MÍNIMA | Ver tabela abaixo | ✓ |

### Tabela de cobertura mínima (R-14)

| Item | Descrição | Cláusula em P0 |
|------|-----------|----------------|
| C1 | Desarmamento de R puros: A01, A02, A03, A04, A05, A06 | P0− (N1–N6); A05 como sub-cláusula de N5 |
| C2 | Qualificação e demonstração positiva: A07, A08, A13, A14 | Cláusula-Q (A07, A08); Cláusula-P5 (A13); Cláusula-P1 (A14) |
| C3 | Plano gradual contra petrificação: A12 | Cláusula-P2 |
| A05 (irredutível) | Atomicidade sem transação apontável — teste específico | Sub-cláusula de N5 (critério: apontar a transação) |
| A09 (irredutível) | Arbitragem útil × rica | Cláusula-P1 (resultado padrão + inversão sob A14) |
| A10 (irredutível) | Retorno do custo real da não-mudança | Cláusula-P3 |
| A11 (irredutível) | Teste de troca de autor | Cláusula-P4 |
| A15 (irredutível) | Exame formal de coexistência | Cláusula-A1 |

**Resultado da verificação cruzada:** Todas as 14 restrições satisfeitas. R-13 recebe flag "(a verificar na Etapa 5)" — finalidade só é verificável empiricamente nos testes de caso. P0 avança para o Step 3.

---

## Nota de versão

P0 é a primeira formulação. Nenhuma iteração foi disparada. Se os testes do Step 3 revelarem falhas, a próxima versão será `02-principio-P1.md` com tabela de diff explicitando o que mudou e qual rodada/caso disparou a mudança.
