# 05 — Rodada 5.3: Casos Novos (Fora do Corpus)

> Deliverable do STEP 3.3 do Plano de Execução.
> **Propósito.** Construir 3 casos novos que estressem fronteiras distintas de P0. Defesa contra super-ajuste ao corpus.
> **Critério de saída.** Nenhuma intuição produzida é manifestamente implausível para um praticante competente (§1.2 do catálogo).
> **Princípio aplicado.** P0 (versão única — nenhuma iteração disparada).

---

## Requisitos dos casos

| Caso | Fronteira estressada | Função no teste |
|------|---------------------|-----------------|
| N1   | runtime fora das famílias do corpus (não produto, não erro) | Teste de atravessamento — R-ATRAVESSADORA |
| N2   | build-time combinado (composição + legado) | Teste de interação entre cláusulas |
| N3   | N puro × misto (M08 vs. M07) | Teste de estreiteza de Cláusula-P1 (A14) |

---

## N1 — Texto de notificação de progresso (runtime, família: feedback de operação)

### Descrição do caso

**Regime.** runtime. **Família nova.** feedback de operação (não produto, não erro).
**Superfície.** Texto de indicador de progresso durante operação longa (upload, processamento, sincronização).
**Situação.** O texto exibido ao usuário reflete a nomenclatura interna do sistema de filas: `"Processing batch 3 of 7 (job queue: 4 pending — worker #2)"`. O decisor justifica: "O texto é gerado pelo sistema de filas — reflete o que está realmente acontecendo."
**Motivo primário.** M06 (vocabulário do modelo interno de processamento como "natural").

### Fronteira estressada

Este caso força P0 a funcionar fora das famílias conhecidas do corpus (produto, erro, API, módulo). A família "feedback de operação" não aparece em nenhum dos 20 casos. Se P0 falhar aqui, o problema é de generalidade (R-GENERALIDADE), não de cobertura de motivo — pois M06 já está cobertem em R1.

### Aplicação de P0

**P0+.** A superfície de progresso deve ser significativa, reconhecível e acionável pelo usuário. O que é acionável para o usuário num indicador de progresso? Principalmente: (a) quanto falta, (b) se o processo está andando normalmente, (c) se há algo que ele precisa fazer. "Batch 3 of 7, worker #2, job queue 4 pending" não responde a nenhuma dessas perguntas de forma reconhecível — é vocabulário do scheduler interno.

**P0− N4 (M06).** "O texto reflete o que realmente está acontecendo" é o marcador de naturalidade posicionada no decisor (o desenvolvedor que projeta no sistema de filas). O que "realmente acontece" do ponto de vista do sistema interno não é o que é reconhecível para o usuário. N4 desarma.

**Resultado.** **CONDENA.** P0+ exige que o progresso seja expresso em termos reconhecíveis para o usuário: "Enviando seus arquivos — 3 de 7 concluídos" ou "Quase pronto, cerca de 2 minutos restantes." N4 colapsa a justificativa.

### Verificação da intuição

**Intuição produzida:** "Textos de progresso que usam terminologia de sistema de filas são inadequados para usuários — o indicador deveria dizer o que o usuário precisa saber, não o que o sistema está fazendo internamente."

**Plausibilidade.** Fortemente plausível para qualquer praticante competente. A distinção entre "estado do sistema" e "informação acionável para o usuário" é reconhecida como prática fundamental de UX. A intuição não surpreende — isso valida que P0 não está produzindo nada contraintuitivo neste novo domínio.

**Função do teste.** P0 atravessa a família nova sem dificuldade e sem reformulação — o mesmo mecanismo (P0+ + N4) que funcionou nos casos de produto runtime (C04, C12) funciona aqui. R-ATRAVESSADORA confirmada para runtime.

---

## N2 — Interface de fachada legado-novo (build-time, composição + legado)

### Descrição do caso

**Regime.** build-time. **Família.** composição + legado (combinação não presente no corpus).
**Superfície.** Tipo de fachada exportado que combina uma interface nova (subsistema refatorado) com uma interface legada (subsistema ainda não migrado). A fachada mistura convenções: o subsistema novo usa propriedades nomeadas de forma orientada ao consumidor (`{ userId, permissions }`) enquanto o subsistema legado ainda expõe propriedades internas (`{ usr_id, perm_flags, _internal_role_cache }`).
**Situação.** O decisor justifica: (a) "A fachada é a forma mais eficiente de combinar os dois subsistemas internamente" (M11), (b) "O módulo legado foi projetado com cuidado — mexer no tipo exposto é arriscado" (M14), (c) "Estamos migrando progressivamente — isso é parte do plano" (M09, sem plano explícito).
**Motivos.** M11 + M14 + M09.

### Fronteira estressada

Este caso força a interação simultânea de três cláusulas: P0− N6 (M11), Cláusula-P4 (M14), Cláusula-P2 (M09). O corpus não tem caso onde os três motivos coocorrem com justificativas distintas. A questão: as cláusulas interagem coerentemente, ou produzem conflito interno em P0?

### Aplicação de P0

**P0+.** A fachada (superfície) deve ser significativa, reconhecível e acionável pelo consumidor. Uma fachada que expõe `_internal_role_cache` junto de `userId` não é reconhecível: o consumidor encontra campos que não deveria usar, sem indicação de quais são públicos e quais são artefatos de implementação.

**P0− N6 (M11).** A conveniência de combinar internamente os dois subsistemas não conta como critério normativo. O consumidor encontra a fachada como ela é.

**Cláusula-P4 (A11).** "O módulo legado foi projetado com cuidado — mexer é arriscado." O teste de troca de autor: o decisor sustentaria essa decisão se o módulo legado tivesse sido escrito por outra equipe, sem acesso ao contexto original? Se a defesa depende de *quem* escreveu (familiaridade com o autor), e não de *o que a fachada faz para o consumidor*, a justificativa colapsa.

**Cláusula-P2 (A12).** "Estamos migrando progressivamente" só tem peso normativo com caminho explícito de customização (qual campo legado desaparece quando, qual interface nova substitui o quê) e prazo de revisão visível. Sem isso, a migração progressiva é racionalização de petrificação — o subsistema legado nunca é migrado porque o "plano" não existe de fato.

**Componente N residual.** Há um N residual genuíno: uma fachada transitória *pode* ser a forma correta de ajudar o consumidor a migrar progressivamente *se* (a) o consumidor realmente precisa acessar ambos os subsistemas durante a transição, *e* (b) a fachada é projetada para o consumidor (campos nomeados para ele, sem _internal vazados), *e* (c) o plano de migração é explícito e visível. Nenhuma das três condições está satisfeita no caso como descrito.

**Resultado.** **CONDENA A FACHADA COMO DESCRITA.** N6 colapsa M11; Cláusula-P4 colapsa M14; Cláusula-P2 colapsa M09. O N residual (fachada transitória legítima) não está presente porque as condições não são satisfeitas.

**Interação entre cláusulas.** As três cláusulas não conflitam entre si: cada uma ataca uma justificativa distinta. A aplicação é sequencial e independente — não há conflito de ordenamento (R-ORDENAMENTO não é acionado aqui porque não há tensão entre cláusulas, apenas aplicação independente).

### Verificação da intuição

**Intuição produzida:** "Uma fachada que vaza campos internos do módulo legado não serve ao consumidor — seja qual for a conveniência interna ou o plano futuro. Se há migração, o plano precisa existir de fato, não apenas como intenção."

**Plausibilidade.** Fortemente plausível. Praticantes competentes reconhecem que "estamos migrando" sem plano visível é uma forma clássica de petrificação. A distinção entre fachada transitória legítima (com plano) e petrificação racionalizada (sem plano) é um julgamento que praticantes fazem rotineiramente.

**Função do teste.** As três cláusulas interagem coerentemente — sem conflito interno. P0 lida com o caso combinado sem reformulação. A interação entre cláusulas é aditiva, não conflitante.

---

## N3 — Tipo de retorno: resultado simplificado vs. discriminado (build-time, fronteira M08 × M07)

### Descrição do caso

**Regime.** build-time. **Família.** API.
**Superfície.** Tipo de retorno de uma função que pode falhar de três formas distintas: `NetworkError`, `ValidationError`, `AuthError`.
**Forma simplificada.** `Result<T, Error>` — um tipo genérico de erro.
**Forma rica.** `Result<T, NetworkError | ValidationError | AuthError>` — união discriminada.
**Situação.** O decisor escolhe a forma simplificada e justifica: "O consumidor provavelmente não distingue os tipos de erro — vai exibir uma mensagem genérica de qualquer forma. Definir três tipos distintos aumenta o custo sintático sem ganho real."
**Motivos invocados.** M07 (custo sintático de tipos ricos) + alegação implícita de M08 (indistinguibilidade funcional).

### Fronteira estressada

Este é o caso mais delicado da rodada. A justificativa combina o componente N legítimo de M07 (custo sintático é real) com a alegação de M08 (indistinguibilidade funcional). A questão: Cláusula-P1 (A14) é estreita o suficiente para impedir que "o consumidor provavelmente não distingue" seja tratado como demonstração positiva de indistinguibilidade?

### Aplicação de P0

**Cláusula-Q / A08 (M07).** O custo sintático dos tipos ricos é legítimo para a forma *interna* — o decisor pode usar representações mais simples internamente. Mas não justifica a forma *exposta*: os dois eixos são independentes. Isso elimina M07 como razão para simplificar o tipo exportado.

**Cláusula-P1 / A14 (M08).** A forma útil (discriminada) prevalece *a menos que* o decisor demonstre *positivamente* que as duas formas são indistinguíveis na estrutura de ação do consumidor.

**O que é demonstração positiva?** Demonstrar que o consumidor, com `NetworkError | ValidationError | AuthError`, *não pode agir diferente* do que com `Error` genérico. Para isso, é necessário mostrar que:
- Nenhuma ação do consumidor depende de distinguir `NetworkError` de `ValidationError`.
- Ex.: o consumidor *sempre* exibe a mesma mensagem, *nunca* tenta retry seletivo, *nunca* redireciona para login em `AuthError`.

**O que é insuficiente?** "O consumidor provavelmente não distingue" é estimativa probabilística, não demonstração positiva. Introduz viés posicional: o decisor projeta no comportamento do consumidor sem verificar a estrutura de ação real.

**Estrutura de ação real para os três tipos:**
- `NetworkError` → consumidor pode implementar retry automático.
- `ValidationError` → consumidor pode destacar campos inválidos no formulário.
- `AuthError` → consumidor pode redirecionar para login sem exibir mensagem de erro genérica.

Essas são ações *distintas* e *possíveis*. A demonstração positiva de indistinguibilidade exigiria mostrar que nenhuma delas é parte da estrutura de ação deste consumidor específico — o que "provavelmente não distingue" não demonstra.

**Resultado.** **SEM DEMONSTRAÇÃO POSITIVA → FORMA RICA PREVALECE.** Cláusula-Q/A08 elimina M07 como justificativa para a forma exposta. Cláusula-P1/A14 impede que a estimativa probabilística seja tratada como demonstração. A forma discriminada é a superfície exigida por P0, a menos que o decisor produza demonstração real de indistinguibilidade para este consumidor específico.

### Verificação da intuição

**Intuição produzida:** "Se o consumidor *pode* agir diferente dependendo do tipo de erro — e geralmente pode — o tipo simplificado priva o consumidor de informação acionável. 'Provavelmente não vai usar' não é razão suficiente para retirar a informação. O ônus está em demonstrar que ele genuinamente não pode agir diferente, não em supor que não vai querer."

**Plausibilidade.** Fortemente plausível. Praticantes competentes reconhecem a distinção entre "o consumidor provavelmente não vai usar tipos discriminados" (estimativa do decisor sobre comportamento do consumidor) e "o consumidor não pode agir diferente dada a distinção" (demonstração sobre a estrutura de ação). A primeira é paternalismo informacional; a segunda é genuíno M08.

**Função do teste.** Cláusula-P1 é estreita o suficiente: "provavelmente não distingue" não passa. O mecanismo de demonstração positiva funciona como filtro. P0 não super-inclui (não condena M08 genuíno junto com M07) nem sub-inclui (não preserva M07 como se fosse M08). A fronteira está calibrada.

---

## Sumário da Rodada 5.3

| Caso | Fronteira | Resultado P0 | Intuição | Plausibilidade |
|------|-----------|--------------|----------|----------------|
| N1   | runtime fora do corpus (feedback de operação) | CONDENA | "Texto de fila não é progresso para o usuário" | Fortemente plausível |
| N2   | build combinado (composição + legado) | CONDENA (fachada como descrita) | "Migração sem plano é petrificação" | Fortemente plausível |
| N3   | N puro × misto (M08 vs. M07) | FORMA RICA PREVALECE (sem demonstração positiva) | "Provavelmente não usa ≠ não pode agir diferente" | Fortemente plausível |

### Análise de cobertura de fronteiras

| Teste | Resultado |
|-------|-----------|
| R-ATRAVESSADORA (runtime fora do corpus) | PASSOU — P0 funciona na família nova sem reformulação |
| Interação de cláusulas (N6 + P4 + P2 simultaneamente) | PASSOU — cláusulas aditivas, sem conflito interno |
| Estreiteza de Cláusula-P1 (A14) | PASSOU — estimativa probabilística não passa como demonstração |

---

## Exit check

- [x] 3 casos novos construídos, cada um estressando fronteira distinta.
- [x] Nenhuma intuição manifestamente implausível para praticante competente.
- [x] R-ATRAVESSADORA confirmada para runtime (N1).
- [x] Interação entre cláusulas coerente (N2).
- [x] Cláusula-P1 estreita o suficiente (N3).
- [x] Nenhuma reformulação de P0 disparada.

**P0 passa Rodada 5.3. As três rodadas de testes estão concluídas sem iteração.**

---

## Nota de convergência das três rodadas

Após Rodadas 5.1, 5.2 e 5.3:
- **0 iterações disparadas** (P0 permanece na versão inicial).
- **28 casos totais** avaliados (20 do corpus + 3 novos + C03-V4 como variação).
- **Nenhuma falha não resolvida** registrada.

P0 avança para STEP 4 — Equilíbrio Reflexivo Amplo (`07-coerencia-estreita.md` e `08-coerencia-ampla.md`).
