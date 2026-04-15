# 04 — Rodada 5.2: Teste contra os Casos R2/R3

> Deliverable do STEP 3.2 do Plano de Execução.
> **Propósito.** Aplicar P0 aos casos R2 (justificativa instável) e R3 (indeterminado a priori). Objetivo: detectar super-inclusão, sub-inclusão e divergência por motivo misto.
> **Critérios de falha:**
> - **Super-inclusão:** P0 condena M08 (C03-V4) junto com os R puros → cláusulas Q/A08/A14 fracas.
> - **Sub-inclusão:** P0 preserva M03 (C09/C17) junto com M08 → componente negativo omisso.
> - **Divergência por misto:** P0 não distingue N de R em M05, M07, M09, M12 → cláusula de qualificação mal calibrada.
> **Princípio aplicado.** P0 (versão única — nenhuma iteração disparada).

---

## Método de aplicação

Para cada caso:
1. Aplicar P0.
2. Registrar resultado: **condena puro / condena parcial / preserva N / não decide (aguarda procedimento)**.
3. Comparar com resultado esperado pelo catálogo §5 (classe do motivo: R puro / misto / N puro).
4. Marcar convergência: **total / parcial / divergência**.

Ao final: executar os três testes de falha explicitamente (super-inclusão, sub-inclusão, divergência por misto).

---

## Casos R2 — Justificativa Instável (D2 = R esperado)

---

### C02 — Assinatura com flag de efeito colateral oculto
**Regime.** build. **Família.** API. **Motivos.** M11 + M12.
**Superfície.** Parâmetro flag em assinatura cujo efeito secundário não é expresso na assinatura.
**Justificativa oferecida.** "A flag centraliza múltiplas preocupações num único parâmetro — é mais eficiente. Vamos separar depois."

**Aplicação de P0+.** Uma superfície com efeito colateral não-expresso não é "acionável pelo afetado": o consumidor não pode prever o comportamento a partir da assinatura. P0+ exige que a superfície seja definida em função do que é *reconhecível e acionável* — um efeito colateral oculto viola o reconhecível diretamente.

**P0− N6 (M11).** A conveniência de centralizar internamente não conta como critério normativo. O consumidor encontra a superfície como ela é.

**Cláusula-P2 (A12).** "Vamos separar depois" só tem peso normativo com caminho explícito de customização e prazo de revisão visível. Sem isso, é racionalização de petrificação.

**Resultado.** **CONDENA PURO.** Ambas as justificativas colapsam: N6 desarma M11; Cláusula-P2 desarma M12.
**Convergência.** TOTAL (D2 = R esperado).

---

### C06 — Formulário com atomicidade por simplicidade
**Regime.** runtime. **Família.** produto. **Motivo.** M10.
**Superfície.** Formulário que exige todos os campos preenchidos antes de qualquer salvamento parcial.
**Justificativa oferecida.** "Todos os campos formam uma transação atômica — não faz sentido salvar parcialmente."

**Aplicação de P0+.** O agrupamento do formulário (superfície) deve ser definido pelo que é significativo e acionável para o usuário. O usuário pode ter legítimo interesse em salvar rascunhos, pausar e retomar.

**P0− N5 + Sub-cláusula A05.** Atomicidade sem transação apontável não conta. O teste: o decisor consegue apontar uma transação específica que vincule causalmente esses campos do ponto de vista do usuário? Se a resposta é "é mais simples implementar assim", não há transação apontável — há conveniência de implementação. A ausência de transação apontável é condição suficiente para o desarmamento.

**Resultado.** **CONDENA PURO.** N5/A05 desarmam M10: a atomicidade invocada é simplicidade de implementação, não transação genuína da perspectiva do afetado.
**Convergência.** TOTAL (D2 = R esperado).

---

### C08 — Default como sentinel falsy por conveniência
**Regime.** ambos. **Família.** prazo. **Motivo.** M06.
**Superfície.** Valor default (0, "", false, null) escolhido por ser trivialmente disponível no código.
**Justificativa oferecida.** "Zero/null é o valor natural para 'vazio' nesse contexto."

**Aplicação de P0+.** O default (superfície) deve ser significativo e reconhecível pelo afetado. Sentinels falsy são convenções de programação — significativos para o decisor no contexto de implementação, não necessariamente para o consumidor da superfície.

**P0− N4 (M06).** A "naturalidade" do sentinel no contexto de implementação não é evidência de que é o ponto de partida natural para o afetado. N4 exige qualificação posicional: natural *para quem?* Sem qualificação, é confusão de perspectivas.

**Resultado.** **CONDENA PURO.** N4 desarma M06.
**Convergência.** TOTAL (D2 = R esperado).

---

### C10 — Rótulo de botão gerado pelo default do componente
**Regime.** runtime. **Família.** produto. **Motivos.** M01 + M06.
**Superfície.** Rótulo de botão ("Submit", "OK", nome genérico do componente).
**Justificativa oferecida.** "É o rótulo padrão da biblioteca de componentes."

**Aplicação de P0+.** O rótulo (superfície) deve ser significativo e acionável para o usuário. Um rótulo genérico não descreve o que a ação faz no contexto do usuário — não é acionável no sentido de orientar a decisão do usuário sobre se deve ou não executar a ação.

**P0− N1 (M01).** A escolha da biblioteca e de sua configuração é do decisor, não restrição imposta ao afetado. O default da ferramenta não conta como razão derrotadora.

**P0− N4 (M06).** O rótulo "natural" do componente reflete a convenção da ferramenta, não o que é significativo para o usuário.

**Resultado.** **CONDENA PURO.** N1 e N4 aplicam-se conjuntamente.
**Convergência.** TOTAL (D2 = R esperado).

---

### C14 — Tipo de erro genérico por simplicidade
**Regime.** ambos. **Família.** erro. **Motivo.** M07.
**Superfície.** Tipo/classificação de erro genérica (ex.: `Error` sem especificidade).
**Justificativa oferecida.** "Definir tipos de erro específicos para cada caso adicionaria complexidade — um tipo genérico é suficiente."

**Aplicação de P0+.** O tipo de erro (superfície) deve ser acionável pelo afetado: ele precisa saber o que o erro significa e como reagir. Um tipo genérico não fornece essa informação.

**Cláusula-Q / A08.** M07 é um motivo misto: o custo sintático de tipos ricos é legítimo para a forma *interna* do código, mas não justifica a *mensagem/tipo expostos*. Os dois eixos são independentes. A simplificação interna não transfere obrigação ao afetado.

**Observação.** Diferença entre C14 e C03: C03 expõe a mensagem gerada pelo motor (sem nenhuma mediação); C14 invoca explicitamente o custo de tipos ricos como justificativa. Cláusula-Q resolve ambos pelo mesmo mecanismo (eixos independentes), mas a justificativa oferecida em C14 é o R component típico de M07.

**Resultado.** **CONDENA PURO** (para o R component invocado). Cláusula-Q/A08 colapsa a justificativa: custo interno não justifica forma exposta.
**Convergência.** TOTAL (D2 = R esperado).

---

### C15 — Definição de tipo com fronteira pública/interna não mantida
**Regime.** build. **Família.** composição. **Motivos.** M11 + M12.
**Superfície.** Tipo exportado que inclui campos internos de implementação.
**Justificativa oferecida.** "O mesmo tipo é usado internamente — criar um tipo de saída separado duplicaria código. Refatoramos depois."

**Aplicação de P0+.** O tipo exportado (superfície) deve ser significativo e acionável pelo consumidor. Campos internos expostos criam acoplamento implícito: o consumidor passa a depender de detalhes que podem mudar.

**P0− N6 (M11).** A reutilização interna não altera o critério normativo.

**Cláusula-P2 (A12).** "Refatoramos depois" sem caminho explícito + prazo de revisão visível = petrificação racionalizada.

**Resultado.** **CONDENA PURO.** N6 e Cláusula-P2 colapsam ambas as justificativas.
**Convergência.** TOTAL (D2 = R esperado).

---

### C20 — Threshold deixado no default por falta de tempo
**Regime.** ambos. **Família.** prazo. **Motivo.** M13.
**Superfície.** Valor de threshold/parâmetro mantido no default de implementação.
**Justificativa oferecida.** "Não havia tempo para pesquisar o valor correto — o default é aceitável por enquanto."

**Aplicação de P0+.** O threshold (superfície) deve ser definido em função do que é acionável para o afetado. Um default de implementação não escolhido para o contexto do afetado não satisfaz esse critério.

**Cláusula-P3 (A10).** A invocação de custo/risco sem medição só tem peso normativo acompanhada de retorno visível e rastreável do custo real da *não-mudança* ao decisor. Sem esse retorno, M13 é racionalização estrutural sustentada por assimetria informacional. "Não havia tempo" não inclui o custo de manter o threshold errado — é argumentação assimétrica.

**Resultado.** **CONDENA PURO.** Cláusula-P3 colapsa M13: ausência de retorno do custo da não-mudança é condição suficiente.
**Convergência.** TOTAL (D2 = R esperado).

---

## Casos R3 — Justificativa com Conforto (D2 = I, indeterminado a priori)

---

### C09 — Fluxo de init separado por testabilidade
**Regime.** build. **Família.** API. **Motivo.** M03.
**Superfície.** API de inicialização dividida em etapas separadas.
**Justificativa oferecida.** "A separação é necessária para testar cada etapa isoladamente — unificar comprometeria a testabilidade."

**Aplicação de P0+.** A superfície (fluxo de init) deve ser significativa e acionável para o consumidor da API. A separação pode ser genuinamente significativa para o consumidor (ex.: ele precisa injetar configurações entre as etapas) ou pode ser um artefato das necessidades de teste do decisor.

**P0− N2 (M03).** A dicotomia "testabilidade *vs.* experiência do consumidor" colapsa: são preocupações que podem coexistir. N2 não elimina a preocupação com testabilidade — elimina a apresentação dela como excludente do interesse do consumidor.

**Cláusula-A1 (A15).** Antes de aceitar testabilidade como razão derrotadora, o decisor deve examinar formalmente se existe alternativa que a satisfaça sem comprometer P0+. Ex.: seam interno de teste que não afeta a superfície pública; API unificada com hook de teste opcional.

**P0 não decide sozinho.** O resultado depende do exame de coexistência de Cláusula-A1:
- Se existe alternativa que satisfaz testabilidade sem expor a separação ao consumidor → P0 condena a forma atual.
- Se a separação é genuinamente significativa para o consumidor (ele precisa das etapas) → P0+ é satisfeito e a separação é legítima.

**Resultado.** **NÃO DECIDE (aguarda exame de coexistência).** N2 colapsa a dicotomia; Cláusula-A1 exige varredura antes de aceitar testabilidade como derrotadora. O componente N (testabilidade genuína) sobrevive condicionalmente.
**Convergência.** TOTAL (D2 = I esperado — procedimento exigido antes da decisão).

---

### C11 — Padrão de invocação assíncrono "reflete a realidade"
**Regime.** build. **Família.** API. **Motivo.** M05.
**Superfície.** API que exige async/await porque "a operação subjacente é assíncrona."
**Justificativa oferecida.** "A operação é genuinamente assíncrona — expor isso na API é honesto."

**Aplicação de Cláusula-Q / A07.** M05 é misto: há genuína ambiguidade semântica entre camadas. O componente N legítimo: se a operação é genuinamente assíncrona do ponto de vista do consumidor (ele precisa lidar com a assincronicidade: timeouts, race conditions, cancelamentos), a API assíncrona reflete o que é significativo para ele. O componente R: se a assincronicidade é um detalhe de implementação que pode ser abstraído (ex.: o consumidor não precisa lidar com ela), expô-la é impor vocabulário interno.

**P0 via Cláusula-Q.** A ambiguidade genuína entre camadas reescreve a obrigação: o decisor pode adotar o padrão assíncrono dado ignorância real de se o consumidor precisa lidar com a assincronicidade, *desde que o caminho de refinamento pelo consumidor permaneça aberto* (ex.: versão síncrona disponível, ou wrapper fornecido).

**Resultado.** **PRESERVA COMPONENTE N** condicionalmente. Se a assincronicidade é genuína e o consumidor precisa tratá-la, P0+ é satisfeito. Se é artefato interno, Cláusula-Q exige que o caminho de refinamento esteja aberto. P0 não condena automaticamente.
**Convergência.** TOTAL (D2 = I — misto, N sobrevive sob condição).

---

### C13 — Definição de tipo auto-gerada do schema
**Regime.** build. **Família.** módulo. **Motivo.** M01.
**Superfície.** Tipos exportados gerados automaticamente a partir do schema de banco de dados.
**Justificativa oferecida.** "O schema é a fonte autoritativa — gerar os tipos a partir dele garante consistência."

**P0− N1.** A escolha do gerador e de sua configuração é do decisor. O output do tooling não conta como razão derrotadora automática. N1 desarma M01 como *desculpa passiva* ("a ferramenta decidiu") — não condena a auto-geração per se.

**Aplicação de P0+.** A questão é: os tipos gerados são significativos, reconhecíveis e acionáveis para o consumidor?
- Se o schema é projetado como contrato público (consumidor e produtor acordam sobre ele), os tipos gerados podem satisfazer P0+ diretamente.
- Se o schema é design interno do banco (normalização, tipos de storage, campos de infraestrutura), os tipos gerados expõem estrutura interna — P0+ não é satisfeito.

**P0 resolve o que resolve.** N1 condena a *passividade* ("a ferramenta decidiu"); P0+ exige que o decisor verifique se o output é adequado ao consumidor. A auto-geração é um meio; a adequação ao consumidor é o critério.

**Resultado.** **CONDENA A PASSIVIDADE, NÃO A AUTO-GERAÇÃO.** O decisor não pode invocar "é auto-gerado" como escudo; deve verificar se o output satisfaz P0+. Se satisfaz: legítimo. Se não: deve intervir (filtrar, mapear, sobrescrever).
**Convergência.** TOTAL (D2 = I — indeterminado, depende de verificação).

---

### C17 — Configuração que reflete separação de responsabilidades interna
**Regime.** ambos. **Família.** composição. **Motivos.** M03 + M04 + M05.
**Superfície.** API de configuração dividida em múltiplos objetos/namespaces seguindo a separação interna de módulos.
**Justificativa oferecida.** "A separação reflete responsabilidades distintas — unificar confundiria os consumidores."

**Aplicação composta de P0−.**

*N2 (M03):* A dicotomia "SoC interno *vs.* experiência do consumidor" colapsa. SoC pode ser satisfeito internamente sem expor a separação ao consumidor.

*N3 (M04):* O critério de encapsulamento (o que está "dentro" de cada módulo) é estabelecido pelo decisor. Invocar a fronteira de módulo para justificar a forma da superfície é tratar como restrição externa o que é decisão interna.

*Cláusula-Q / A07 (M05):* Se há genuína ambiguidade sobre se o consumidor precisa ou quer a separação (ex.: pode querer configurar módulos independentemente), o N component de M05 sobrevive sob condição de que o caminho de configuração unificada permaneça aberto.

*Cláusula-A1 (A15):* Antes de aceitar M03/M04 como derrotadores, o decisor deve examinar se existe API que satisfaça SoC internamente sem impô-lo ao consumidor.

**Resultado.** **CONDENA OS COMPONENTES R (M03, M04), PRESERVA O EXAME DE N (M05).** Os pseudo-derrotadores colapsam; o N component de M05 (ambiguidade genuína sobre preferência do consumidor) sobrevive condicionalmente sob Cláusula-Q e Cláusula-A1.
**Convergência.** TOTAL (D2 = I — os R components colapsam; N component sobrevive sob procedimento).

---

### C19 — Módulo legado mantido porque "funciona, risco de regressão"
**Regime.** ambos. **Família.** legado. **Motivos.** M13 + M14.
**Superfície.** Interface de módulo mantida sem revisão.
**Justificativa oferecida.** "O módulo funciona. Alterar introduz risco de regressão — o autor original entendeu os porquês."

**Cláusula-P3 (A10).** A invocação de risco/custo sem medição exige retorno visível e rastreável do custo real da *não-mudança*: o custo de manter uma interface inadequada ao consumidor acumula silenciosamente (acoplamento, workarounds, erros de uso). Sem esse retorno, o argumento de risco é assimétrico — visível num sentido, invisível no outro.

**Cláusula-P4 (A11).** A preservação baseada em "o autor original entendeu os porquês" só é admissível se o decisor sustenta a decisão sob o pressuposto de que o autor original é outro — o teste de troca de autor. Se a defesa da interface depende de quem a escreveu, e não de o que ela faz para o consumidor, colapsa.

**Componente N residual.** "O módulo funciona" — se a interface atual genuinamente satisfaz P0+ (é significativa, reconhecível e acionável para o consumidor), então não há obrigação de mudança. P0 não condena interfaces estáveis que são adequadas; condena a racionalização que bloqueia a avaliação.

**Resultado.** **CONDENA A RACIONALIZAÇÃO, PRESERVA A INTERFACE SE ELA SATISFAZ P0+.** Cláusulas-P3 e P4 colapsam as justificativas de custo e autoria; o N residual ("funciona e é adequado ao consumidor") sobrevive se verificado diretamente por P0+.
**Convergência.** TOTAL (D2 = I — depende de verificação; as racionalizações colapsam).

---

## Teste de Super-inclusão: C03-V4

**Variação V4 de C03.** A mensagem de erro genuinamente não pode ser melhorada porque as duas formas (técnica vs. orientada ao usuário) são funcionalmente indistinguíveis na estrutura de ação do afetado: o afetado não pode agir diferente com base em qualquer forma da mensagem (ex.: erro irrecuperável, cujo único ação disponível é "reportar").

**Aplicação de Cláusula-P1 (A14).** A superfície útil prevalece *a menos que* o decisor demonstre positivamente que as duas formas são indistinguíveis na estrutura de ação do afetado. Com demonstração positiva (neste caso: o afetado não pode agir diferente independentemente da mensagem), M08 é genuíno e o decisor tem espaço normativo para a forma que não esforça.

**Resultado para C03-V4.** **INDETERMINATE — aguarda demonstração positiva de A14.** P0 *não* condena C03-V4 junto com o caso padrão de C03. Se a demonstração é fornecida, a variação é preservada. Se não é fornecida, a superfície útil prevalece por padrão.

**Teste de super-inclusão: PASSOU.** P0 distingue corretamente C03-padrão (condenado) de C03-V4 (indeterminado sob demonstração). As cláusulas Q/A08/A14 estão calibradas.

---

## Teste de Sub-inclusão

**Pergunta.** P0 preserva M03 (C09, C17) junto com M08?

**Verificação.**
- C09 (M03): N2 colapsa a dicotomia; Cláusula-A1 exige varredura. P0 *não preserva M03* — condena o componente R e exige exame do N. M03 não sobrevive como derrotador em nenhum dos dois casos.
- C17 (M03 + M04 + M05): idem — N2 e N3 colapsam os componentes R; apenas o N component genuíno de M05 sobrevive sob condição.
- M08 (C03-V4): sobrevive apenas sob demonstração positiva de A14.

P0 distingue corretamente M03 (R puro — componente R sempre colapsa) de M08 (N puro estreito — sobrevive sob demonstração).

**Teste de sub-inclusão: PASSOU.**

---

## Teste de Divergência por Motivo Misto

| Motivo | Caso(s) | N component sobrevive? | R component colapsa? | Cláusula |
|--------|---------|------------------------|----------------------|----------|
| M05    | C11, C17 | Sim — sob condição (caminho de refinamento aberto) | Sim — impor sem condição | Cláusula-Q/A07 |
| M07    | C03, C14 | Sim — custo interno legítimo | Sim — não justifica forma exposta | Cláusula-Q/A08 |
| M09    | (via C17, C19) | Sim — adiamento com plano explícito | Sim — adiamento sem plano | Cláusula-P2 |
| M12    | C02, C15 | Sim — plano com prazo visível | Sim — "depois" sem caminho | Cláusula-P2 |

**Resultado.** Em todos os casos mistos, P0 distingue corretamente N de R. A cláusula de qualificação (Q/A07, Q/A08) e as cláusulas procedimentais (P2, P3, P4) estão bem calibradas.

**Teste de divergência por misto: PASSOU.**

---

## Sumário da Rodada 5.2

### Casos R2

| Caso | Motivo | Resultado P0 | Esperado | Convergência |
|------|--------|--------------|----------|--------------|
| C02  | M11+M12 | CONDENA PURO | R | TOTAL |
| C06  | M10 | CONDENA PURO | R | TOTAL |
| C08  | M06 | CONDENA PURO | R | TOTAL |
| C10  | M01+M06 | CONDENA PURO | R | TOTAL |
| C14  | M07 | CONDENA PURO | R | TOTAL |
| C15  | M11+M12 | CONDENA PURO | R | TOTAL |
| C20  | M13 | CONDENA PURO | R | TOTAL |

### Casos R3

| Caso | Motivo | Resultado P0 | Esperado | Convergência |
|------|--------|--------------|----------|--------------|
| C09  | M03 | NÃO DECIDE (exame de coexistência) | I | TOTAL |
| C11  | M05 | PRESERVA N (condicional) | I/misto | TOTAL |
| C13  | M01 | CONDENA PASSIVIDADE / VERIFICA P0+ | I | TOTAL |
| C17  | M03+M04+M05 | CONDENA R, PRESERVA N-M05 (condicional) | I/misto | TOTAL |
| C19  | M13+M14 | CONDENA RACIONALIZAÇÃO / PRESERVA SE P0+ SATISFEITO | I | TOTAL |

### Testes de falha

| Teste | Status |
|-------|--------|
| Super-inclusão (C03-V4 condenado junto com C03-padrão?) | PASSOU — P0 distingue corretamente |
| Sub-inclusão (M03 preservado junto com M08?) | PASSOU — M03 colapsa; M08 sobrevive sob demonstração |
| Divergência por misto (N/R indistinguíveis?) | PASSOU — todas as cláusulas calibradas corretamente |

---

## Exit check

- [x] 7/7 casos R2 condenados (convergência total com D2 = R esperado).
- [x] 5/5 casos R3 com resultado correto (convergência total com D2 = I esperado).
- [x] Teste de super-inclusão: PASSOU.
- [x] Teste de sub-inclusão: PASSOU.
- [x] Teste de divergência por misto: PASSOU.
- [x] Nenhuma reformulação de P0 disparada.

**P0 passa Rodada 5.2. Avança para STEP 3.3 — Rodada 5.3 (casos novos).**
