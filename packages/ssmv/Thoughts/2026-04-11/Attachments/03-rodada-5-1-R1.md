# 03 — Rodada 5.1: Teste contra os Casos R1

> Deliverable do STEP 3.1 do Plano de Execução.
> **Propósito.** Aplicar P0 (de `02-principio-P0.md`) aos 8 casos de condenação firme (R1). Objetivo: falsificação, não confirmação.
> **Critério de saída.** P0 condena todos os 8 casos sem qualificação. Hesitação em qualquer caso dispara retorno ao Step 2.
> **Princípio aplicado.** P0 (versão única — nenhuma iteração disparada antes desta rodada).

---

## Método de aplicação

Para cada caso:
1. Identificar a superfície em disputa e o motivo primário.
2. Aplicar P0+ diretamente: a superfície satisfaz "significativo, reconhecível e acionável pelo afetado"?
3. Se o decisor invocaria um pseudo-derrotador, verificar se P0− o desarma.
4. Registrar: **condena / hesita / preserva** + cláusula responsável.

Notas de hesitação, quando presentes, são registradas explicitamente — mesmo se a hesitação for resolvida sem reformulação.

---

## Casos R1

---

### C01 — Nome de método que reflete implementação
**Regime.** build. **Família.** módulo. **Motivo primário.** M06.
**Superfície.** Nome de método público de módulo.
**Fator-chave.** O nome escolhido reflete o fluxo de execução interno ("processItem", "handleIncoming", etc.) — o que é "natural" para o decisor na posição de autor do módulo.

**Aplicação de P0+.** A superfície (nome do método) deve ser definida em função do que é significativo, reconhecível e acionável pelo consumidor do módulo. O nome que reflete o fluxo interno não é, em geral, reconhecível como significativo pelo consumidor: o consumidor encontra a operação pelo seu propósito (o que ela faz do seu ponto de vista), não pelo mecanismo interno de processamento.

**Pseudo-derrotador potencial.** M06: "essa nomenclatura é natural — reflete como o sistema realmente funciona."

**Aplicação de P0− N4.** A "naturalidade" percebida pelo decisor é a ordem de processamento interno e a semântica do modelo de dados — exatamente o que N4 desidentifica como razão derrotadora. O marcador "natural" sem qualificação posicional é evidência de confusão de perspectivas.

**Resultado.** **CONDENA. Sem qualificação.**
**Cláusula responsável.** P0+ (critério direto: nome não orienta o consumidor pelo que é acionável para ele) + P0− N4 (desarmamento do pseudo-derrotador M06).

---

### C03 — Mensagem de erro gerada pelo motor interno
**Regime.** ambos. **Família.** erro. **Motivo primário.** M07.
**Superfície.** Mensagem de erro exposta ao consumidor/usuário.
**Fator-chave.** A mensagem é o output direto do motor interno — gerada sem mediação para o afetado.

**Nota de escopo.** C03 tem variação V4, na qual aparece M08 (indistinguibilidade funcional). Esta rodada aplica P0 ao **caso padrão** de C03 (sem V4). A variação V4 será examinada na Rodada 5.2, onde M08 é testável como critério de super-inclusão.

**Aplicação de P0+.** A mensagem de erro (superfície) deve ser definida em função do que é significativo, reconhecível e acionável pelo afetado. Uma mensagem gerada mecanicamente pelo motor interno não satisfaz esse critério: ela reflete o estado interno do sistema, não o que o afetado precisa saber para agir.

**Pseudo-derrotador potencial.** M07: "formatar a mensagem exigiria tipos de erro ricos — custo sintático elevado."

**Aplicação de Cláusula-Q (A08).** O custo sintático de tipos ricos justifica a forma *interna* (como o erro é representado no código), não a mensagem *exposta* ao afetado. Os dois eixos são independentes: o decisor pode reduzir o custo interno sem por isso fixar a forma da mensagem exposta. O custo interno não transfere obrigação ao afetado.

**Resultado.** **CONDENA. Sem qualificação** (para o caso padrão).
**Cláusula responsável.** P0+ (mensagem não orientada ao afetado) + Cláusula-Q/A08 (eixos internos e expostos são independentes — custo interno não autoriza a forma da mensagem).

**Flag para Rodada 5.2.** Variação V4 de C03 é o único caso onde M08 é operacionalizável como critério de super-inclusão. Verificar na Rodada 5.2 se Cláusula-P1 (A14) mantém C03-V4 como indeterminado, em vez de condená-lo junto com o caso padrão.

---

### C04 — Empty state com vocabulário do modelo de dados
**Regime.** runtime. **Família.** produto. **Motivo primário.** M06.
**Superfície.** Mensagem de empty state em tela de produto.
**Fator-chave.** O texto usa vocabulário do modelo de dados ("Nenhum registro encontrado", "Lista vazia", "Entidade inexistente") — natural para o decisor que projeta no schema, opaco para o usuário final.

**Aplicação de P0+.** A mensagem de empty state deve ser significativa, reconhecível e acionável pelo usuário. "Registro" e "entidade" são termos do modelo de dados do decisor. O usuário não age sobre "registros" — age sobre o que o produto representa para ele (tarefas, pedidos, mensagens, etc.).

**Pseudo-derrotador potencial.** M06: "os termos refletem o que o sistema realmente armazena."

**Aplicação de P0− N4.** O que o sistema "realmente armazena" é a nomenclatura do modelo interno. P0− N4 desidentifica explicitamente "vocabulário do modelo de dados" como critério normativo. O marcador de naturalidade aqui é posicional: é natural para quem escreveu o schema, não para quem usa o produto.

**Resultado.** **CONDENA. Sem qualificação.**
**Cláusula responsável.** P0+ + P0− N4.

---

### C05 — Assinatura de API com ordem de parâmetros seguindo processamento interno
**Regime.** build. **Família.** API. **Motivo primário.** M06.
**Superfície.** Ordem dos parâmetros na assinatura de função/método.
**Fator-chave.** A ordem reflete a sequência de operações do pipeline interno (primeiro o que é processado primeiro), não o que é conceitualmente central para o consumidor.

**Aplicação de P0+.** A assinatura (superfície) deve ser definida em função do que é significativo e acionável pelo consumidor. Para o consumidor, a ordem "natural" é aquela que coloca os parâmetros mais obrigatórios/centrais primeiro, ou que corresponde à ordem em que ele *pensa sobre a operação* — não a ordem em que o pipeline interno os consome.

**Pseudo-derrotador potencial.** M06: "a ordem segue o fluxo natural de processamento."

**Aplicação de P0− N4.** O fluxo de processamento interno é a sequência de operações do decisor, não a estrutura de ação do consumidor. N4 desidentifica "fluxo de controle como natural" como razão derrotadora.

**Resultado.** **CONDENA. Sem qualificação.**
**Cláusula responsável.** P0+ + P0− N4.

---

### C07 — Tipo de retorno que é objeto interno reusado
**Regime.** build. **Família.** módulo. **Motivo primário.** M11.
**Superfície.** Tipo de retorno de função/método público.
**Fator-chave.** O tipo de retorno é um objeto interno (struct/interface) que o decisor já utiliza em outro lugar — reusado por conveniência, não projetado para o consumidor.

**Aplicação de P0+.** O tipo de retorno (superfície) deve ser definido em função do que é significativo e acionável pelo consumidor. Um objeto interno reusado expõe ao consumidor a estrutura de dados interna do módulo — campos irrelevantes, nomenclatura opaca, acoplamento implícito com detalhes de implementação.

**Pseudo-derrotador potencial.** M11: "reutilizar o tipo interno simplifica o código — evita duplicação."

**Aplicação de P0− N6.** A reutilização interna não altera o critério normativo. O consumidor encontra a superfície como ela é — não como o decisor a reutiliza internamente. A conveniência do decisor não transfere obrigação ao consumidor. N6 desidentifica esse motivo.

**Resultado.** **CONDENA. Sem qualificação.**
**Cláusula responsável.** P0+ + P0− N6.

---

### C12 — Date picker com `new Date()` como default
**Regime.** runtime. **Família.** produto. **Motivo primário.** M06.
**Superfície.** Valor default de um seletor de datas.
**Fator-chave.** O default `new Date()` (hoje) é uma escolha trivial de implementação — o valor mais simples de obter no código, não necessariamente o valor que é significativo para o usuário.

**Aplicação de P0+.** O default do seletor (superfície) deve ser significativo, reconhecível e acionável pelo afetado. Em muitos contextos — agendamento futuro, datas de nascimento, períodos históricos — "hoje" não é um ponto de partida significativo para o usuário. O default `new Date()` é escolhido pela conveniência do decisor, não pela estrutura de ação do afetado.

**Nota de qualificação tentada.** Poder-se-ia argumentar que em alguns contextos "hoje" *é* o default significativo (ex.: adicionar um evento ao calendário). Esse argumento não é M06 — seria uma justificativa genuína baseada no contexto do afetado. O caso C12 é classificado como R1 porque o fator-chave é exatamente "default trivial" — a escolha de `new Date()` não foi motivada pelo contexto do afetado, mas pela trivialidade da implementação. P0 condena a motivação, não o valor em abstrato.

**Pseudo-derrotador potencial.** M06: "`new Date()` é o valor mais natural para uma data."

**Aplicação de P0− N4.** "Natural" aqui é o que é trivialmente disponível no contexto de implementação. Não é evidência de que seja o ponto de partida natural para o afetado.

**Resultado.** **CONDENA. Sem qualificação.**
**Cláusula responsável.** P0+ + P0− N4.

**Nota de calibração.** A hesitação acima ("em alguns contextos 'hoje' é genuíno") é resolvida pelo fator-chave do caso: C12 é definido como "default trivial". Se o caso fosse redefinido com motivação genuína no contexto do afetado, seria um caso distinto — não C12. A hesitação não é falha de P0; é sensibilidade correta ao fator-chave.

---

### C16 — Lista com ordem ditada pelo `ORDER BY`
**Regime.** runtime. **Família.** produto. **Motivo primário.** M06 + M10.
**Superfície.** Ordem de exibição de uma lista.
**Fator-chave.** A ordem segue o `ORDER BY` da query SQL — a ordem de recuperação do banco, não uma ordem significativa para o usuário.

**Aplicação de P0+.** A ordem de exibição (superfície) deve ser definida em função do que é significativo, reconhecível e acionável pelo afetado. A ordem do `ORDER BY` é a convenção de recuperação de dados do decisor — pode ou não coincidir com o que é significativo para o usuário (data de criação, relevância, progresso, etc.).

**Pseudo-derrotador 1.** M06: "a ordem é a ordem natural — como os dados estão armazenados."

**Aplicação de P0− N4.** A "ordem natural" do banco é a ordem de armazenamento/recuperação do sistema. Não é evidência de que seja a ordem significativa para o afetado.

**Pseudo-derrotador 2.** M10: "alterar a ordem quebraria a consistência dos dados exibidos."

**Aplicação de P0− N5.** Consistência/atomicidade sem transação apontável não conta como razão derrotadora. Não há transação que vincule causalmente a ordem do `ORDER BY` à estrutura de ação do afetado. A invocação de "consistência" aqui é racionalização estrutural: a ordem pode ser alterada sem comprometer nenhuma transação identificável do ponto de vista do afetado.

**Resultado.** **CONDENA. Sem qualificação.**
**Cláusula responsável.** P0+ + P0− N4 (M06) + P0− N5 (M10).

---

### C18 — Nomes de função sem convenção (cada autor nomeou à sua forma)
**Regime.** build. **Família.** módulo. **Motivo primário.** M11.
**Superfície.** Nomes de funções públicas do módulo.
**Fator-chave.** Os nomes refletem a convenção pessoal de cada autor — a estrutura interna de quem escreveu, não uma projeção sobre o consumidor do módulo.

**Aplicação de P0+.** Os nomes das funções (superfície) devem ser definidos em função do que é significativo, reconhecível e acionável pelo consumidor. Nomes ad hoc baseados em convenções pessoais dos autores são por definição não projetados para o consumidor — são projetados para o autor.

**Pseudo-derrotador potencial.** M11 (implícito): "cada nome faz sentido para quem o escreveu; a inconsistência é consequência inevitável da autoria distribuída."

**Aplicação de P0− N6.** A reutilização/convenção interna de cada autor não conta como critério normativo. O consumidor encontra a superfície como ela é — não tem acesso à convenção pessoal de nenhum autor. A conveniência interna do decisor (aqui: cada autor) não altera a obrigação de P0+.

**Resultado.** **CONDENA. Sem qualificação.**
**Cláusula responsável.** P0+ + P0− N6.

---

## Sumário da Rodada 5.1

| Caso | Regime | Motivo | Resultado | Cláusulas |
|------|--------|--------|-----------|-----------|
| C01  | build  | M06    | CONDENA   | P0+ + N4  |
| C03  | ambos  | M07    | CONDENA   | P0+ + Cláusula-Q/A08 |
| C04  | runtime | M06   | CONDENA   | P0+ + N4  |
| C05  | build  | M06    | CONDENA   | P0+ + N4  |
| C07  | build  | M11    | CONDENA   | P0+ + N6  |
| C12  | runtime | M06   | CONDENA   | P0+ + N4  |
| C16  | runtime | M06+M10 | CONDENA | P0+ + N4 + N5 |
| C18  | build  | M11    | CONDENA   | P0+ + N6  |

**8/8 casos condenados sem qualificação.**

---

## Análise de cobertura dos pseudo-derrotadores usados

| Cláusula de P0− | Casos que a acionaram |
|-----------------|----------------------|
| N4 (M06)        | C01, C04, C05, C12, C16 |
| N5 (M10)        | C16 |
| N6 (M11)        | C07, C18 |
| Cláusula-Q/A08  | C03 |

**Cláusulas não acionadas nesta rodada:** N1 (M01), N2 (M03), N3 (M04).
**Observação.** A ausência de N1/N2/N3 nesta rodada é esperada: os casos R1 do corpus não incluem M01/M03/M04 como motivo primário em R1 (ver `00a-casos-classificados.md`). O teste de N1/N2/N3 ocorre na Rodada 5.2 (R2/R3) onde esses motivos aparecem.

---

## Hesitações registradas e resolução

**C12 — Hesitação sobre "hoje como default genuíno".** A hesitação foi resolvida pelo fator-chave do caso: C12 é definido como motivado pela trivialidade de implementação, não pelo contexto do afetado. A hesitação é sensibilidade adequada à distinção entre casos — não sinal de fraqueza de P0.

**C03 — Flag para Rodada 5.2.** A variação V4 de C03 (onde M08 é ativável) não foi avaliada nesta rodada. Sua avaliação pertence à Rodada 5.2 como teste de super-inclusão: Cláusula-P1 (A14) deve preservar C03-V4 como indeterminado, não condená-lo junto com o caso padrão.

---

## Exit check

- [x] 8/8 casos R1 condenados sem qualificação.
- [x] Nenhuma hesitação não resolvida registrada.
- [x] Nenhuma reformulação de P0 disparada.
- [x] Flag para Rodada 5.2 (C03-V4) registrada explicitamente.

**P0 passa Rodada 5.1. Avança para STEP 3.2 — Rodada 5.2.**
