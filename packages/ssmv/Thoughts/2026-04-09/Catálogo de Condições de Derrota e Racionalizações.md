# Catálogo de Condições de Derrota e Racionalizações

> Arquivo final da execução do `Plano - Execução da Elicitação de Casos e do Método Analítico.md`.
> Consolida Fases 1 a 8 em forma normativamente utilizável para a etapa de construção de princípios.
> Organizado conforme §9 do plano.

---

## 1. Nota metodológica

### 1.1. Por que o corpus de reconhecimento intersubjetivo conta como evidência filosófica

Este catálogo repousa sobre um corpus constituído pelo método de **elicitação de casos paradigmáticos por reconhecimento intersubjetivo**. Os casos não foram coletados por entrevistas nem derivados de princípios abstratos: foram gerados a partir da experiência sedimentada pela prática coletiva de engenharia de software — o conjunto de situações que praticantes competentes reconhecem imediatamente como familiares, sem necessidade de explicação longa ou contexto adicional.

A autoridade epistêmica do corpus repousa em um pressuposto declarado: **o reconhecimento convergente por praticantes competentes, em condições de reflexão, conta como evidência filosófica de que o fenômeno existe e tem a estrutura que aparenta ter.** Não é prova estatística; é o equivalente filosófico dos *considered judgments* de Rawls — julgamentos feitos por pessoas com experiência relevante que convergem sem coordenação prévia.

### 1.2. Comunidade epistêmica relevante

Os praticantes competentes são aqueles cuja autoridade epistêmica deriva de terem ocupado, ao longo da prática, **ambos os lados da relação**:

- ter definido a forma de alguma superfície de uso **e** ter consumido superfície definida por outrem;
- ter atuado em `runtime` **e** em `build-time`, ou ao menos ter visibilidade direta de ambos os regimes e de sua continuidade normativa.

O critério não é cargo nem senioridade, mas **amplitude posicional**: a aptidão para o teste de inversão posicional (Fase 6) depende de ter experimentado o lado do decisor e o lado do afetado dentro de um mesmo tipo de decisão.

### 1.3. Limitações declaradas do método

O corpus capta casos **sedimentados pela prática coletiva narrada**. Isso implica duas limitações estruturais que este catálogo não remove:

1. **Viés de sobrevivência narrativa.** Casos que nunca chegaram a ser narrados — porque o afetado não tinha voz, não reconhecia o problema como problema, ou não ocupava posição de onde pudesse reportá-lo — tendem a estar ausentes do corpus.
2. **Viés de articulação.** Casos que exigem repertório técnico sofisticado para serem reconhecidos podem estar sub-representados em corpora baseados em reconhecimento intersubjetivo amplo.

Estas limitações não invalidam o método: precisam apenas estar declaradas para que o corpus não seja tratado como exaustivo, e para que os alvos normativos derivados dele não sejam tratados como cobrindo todo o fenômeno.

O documento auxiliar *Reclamações Comuns (2024–2026)* foi usado como instrumento de elucidação de padrões recorrentes, **não como critério de delimitação ou de exaustão do corpus**. Nenhum caso foi incluído só por corresponder a uma de suas categorias; nenhum foi excluído por não constar nele.

---

## 2. Exposição do corpus

### 2.1. Critérios de entrada aplicados

Todos os casos satisfazem simultaneamente os treze critérios definidos em §6.1–6.13 do plano:

1. **Reconhecimento** — "já passei por isso", imediato para praticantes experientes.
2. **Especificidade** — superfície, decisor, afetado, alternativa e fator identificados.
3. **Posicionamento** — descritível dos dois lados sem alteração dos fatos materiais.
4. **Atualidade operacional** — práticas efetivamente presentes em 2024–2026.
5. **Recorrência estrutural** — classe recorrente de decisão, não incidente isolado.
6. **Não-caricatura** — praticantes competentes sob pressões plausíveis.
7. **Reversibilidade plausível** — alternativa superior concreta e factível no momento da decisão.
8. **Densidade causal mínima** — decisão → fator → consequência.
9. **Independência narrativa** — fatos sustentam-se sem retórica.
10. **Fricção real** — custo concreto para o afetado.
11. **Granularidade decisional mínima** — uma única decisão local.
12. **Anti-amplificação** — código comum, escala cotidiana.
13. **Atribuibilidade à implementação** — alterável modificando apenas o código.

### 2.2. Regimes cobertos

| Regime        | Casos                                          |
|---------------|------------------------------------------------|
| `runtime`     | C04, C06, C10, C12, C16                        |
| `build-time`  | C01, C02, C05, C07, C09, C11, C13, C15, C18    |
| `ambos`       | C03, C08, C14, C17, C19, C20                   |

Os três regimes estão representados, incluindo fronteira entre eles — condição necessária para testar em §9.4 se a força do truísmo atravessa `runtime` e `build-time` ou depende de uma assimetria não declarada entre UX e DX.

### 2.3. Famílias de tensão cobertas

| Família                             | Casos                  |
|-------------------------------------|------------------------|
| Superfície de produto (`runtime`)   | C04, C06, C10, C12, C16 |
| API pública (`build-time`)          | C02, C05, C09, C11     |
| Módulo ou componente (`build-time`) | C01, C07, C13, C18     |
| Mensagens de erro e feedback (`ambos`) | C03, C14            |
| Composição entre entidades (`build-time`) | C15, C17         |
| Legado e inércia (`ambos`)          | C19                    |
| Prazo e recurso (`ambos`)           | C08, C20               |

### 2.4. Número e tipo de casos paradigmáticos

- 20 casos paradigmáticos gerados e catalogados (C01–C20);
- distribuídos entre condenação firme (`R1`), justificativa instável (`R2`) e justificativa oferecida com conforto (`R3`);
- selecionados para permitir variação controlada de uma única condição por vez no *threshold probing* (Fase 4).

---

## 3. Matriz resumida dos casos

Legenda:
- **D1**: posição no gradiente de justificação — `R1` (sem desculpa), `R2` (instável), `R3` (oferecida com conforto).
- **D2**: tipo de justificativa quando houver — `N` (conflito normativo genuíno), `R` (racionalização), `I` (indeterminado a priori).
- **D3**: estabilidade posicional — `estável`, `instável` ou `parcial`.

| ID  | Regime   | Família   | D1 | D2 | D3       | Superfície        | Fator-chave |
|-----|----------|-----------|----|----|----------|-------------------|-------------|
| C01 | build    | módulo    | R1 | —  | estável  | nome de método    | nome reflete implementação |
| C02 | build    | API       | R2 | R  | instável | assinatura        | flag com efeito colateral oculto |
| C03 | ambos    | erro      | R1 | —  | estável  | mensagem de erro  | gerada pelo motor interno |
| C04 | runtime  | produto   | R1 | —  | estável  | empty state       | vocabulário do modelo de dados |
| C05 | build    | API       | R1 | —  | estável  | assinatura        | ordem segue processamento interno |
| C06 | runtime  | produto   | R2 | R  | instável | formulário        | transação atômica por simplicidade |
| C07 | build    | módulo    | R1 | —  | estável  | tipo de retorno   | objeto interno reusado como retorno |
| C08 | ambos    | prazo     | R2 | R  | instável | default           | sentinel falsy por conveniência |
| C09 | build    | API       | R3 | I  | parcial  | fluxo de init     | separação por testabilidade |
| C10 | runtime  | produto   | R2 | R  | instável | botão             | rótulo genérico do componente |
| C11 | build    | API       | R3 | I  | parcial  | padrão de invocação | assincronia "reflete a realidade" |
| C12 | runtime  | produto   | R1 | —  | estável  | date picker       | `new Date()` como default trivial |
| C13 | build    | módulo    | R3 | I  | parcial  | definição de tipo | auto-geração a partir do schema |
| C14 | ambos    | erro      | R2 | R  | instável | tipo de erro      | erro genérico por simplicidade |
| C15 | build    | composição| R2 | R  | instável | definição de tipo | fronteira pública/interna não mantida |
| C16 | runtime  | produto   | R1 | —  | estável  | lista             | ordem ditada pelo `ORDER BY` |
| C17 | ambos    | composição| R3 | I  | parcial  | configuração      | separação de responsabilidades interna |
| C18 | build    | módulo    | R1 | —  | estável  | nomes de função   | sem convenção; cada autor nomeou |
| C19 | ambos    | legado    | R3 | I  | parcial  | módulo            | "funciona, risco de regressão" |
| C20 | ambos    | prazo     | R2 | R  | instável | threshold         | "não havia tempo" |

> Os casos em `R1` convergem sobre a ausência de justificativa; são os âncoras do polo "sem desculpa".
> Os casos em `R2` e `R3` concentram o material analítico útil, porque é neles que há **justificativa a ser testada**.

---

## 4. Lista analítica dos motivos

Esta é a lista dos fatores que os praticantes tratam, em pelo menos algum caso, como capazes de derrotar — ou aparentemente derrotar — a obrigação do truísmo. Cada motivo foi submetido ao ciclo das Fases 4–6 (variação controlada → diagnóstico de estatuto → inversão posicional) e convertido em alvo normativo na Fase 8.

Para cada motivo: **formulação curta**, **casos-âncora**, **limiar em que aparece**, **estatuto normativo pós-inversão**, **resultado do teste posicional**, **implicação para a força do truísmo** e **alvo normativo correspondente**.

---

### M01 — Default de tooling sem exame de alternativas

- **Formulação curta.** "Foi o que a ferramenta fez por nós; não examinei alternativas."
- **Casos-âncora.** C13 (auto-geração de tipos a partir do schema); aparece residualmente em C01, C04, C07.
- **Limiar.** O motivo só sobrevive enquanto o praticante não é confrontado com a alternativa trivial de gerar tipos *de domínio* em vez de espelhos do schema. Ao surgir essa alternativa, o fator colapsa.
- **Estatuto pós-Fase 6.** `R` puro — desaparece sob inversão.
- **Teste posicional.** Do lado do consumidor do tipo, o apelo ao default não se sustenta: "eu teria preferido um tipo de domínio mesmo que custasse mais ao autor."
- **Implicação para o truísmo.** O truísmo não é derrotado; apenas é *não-exercido* porque o decisor não examinou seu espaço de alternativas.
- **Alvo normativo (A01).** Desarmar "default de tooling como pseudo-restrição" — o princípio posterior deve tratar conveniência de ferramenta como insuficiente para derrotar a obrigação, exigindo exame explícito de alternativas.

### M02 — Compliance / auditoria como obrigação vinculante

- **Formulação curta.** "A forma é imposta por regulação, compliance ou auditoria externa."
- **Casos-âncora.** Nenhum caso do corpus ancora isso como motivo genuíno; aparece como invocação retórica em C08, C14, C20.
- **Limiar.** O fator só é genuíno quando a restrição regulatória **efetivamente** reduz o espaço de alternativas viáveis *e* é rastreável a um texto normativo específico.
- **Estatuto pós-Fase 6.** **Fora do escopo do truísmo**, mas com risco de mascaramento.
- **Teste posicional.** Do lado do afetado, a invocação de compliance sem texto normativo específico é imediatamente reconhecida como cortina: "mostre o requisito exato."
- **Implicação para o truísmo.** O truísmo não se aplica a decisões cuja forma é genuinamente determinada por regulação. Aplica-se integralmente ao que sobrar.
- **Alvo normativo (A13).** Proceduralizar **demonstração positiva de compliance**: a exceção só vale quando acompanhada de apontamento específico ao requisito externo.

### M03 — Falsa dicotomia entre preocupação legítima e conforto

- **Formulação curta.** "Ou resolvo a preocupação técnica legítima, ou ofereço a superfície boa — não dá para ter os dois."
- **Casos-âncora.** C09 (separação de init por testabilidade), C17 (separação de responsabilidades como bloqueio de customização).
- **Limiar.** O motivo aparece quando o praticante reduz um par de comprometimentos coexistentes ("quero testar" / "quero superfície boa") a uma escolha forçada. Colapsa quando a Fase 4 mostra que há um desenho que satisfaz ambos.
- **Estatuto pós-Fase 6.** `R` puro — desaparece sob inversão.
- **Teste posicional.** Do lado do consumidor, a falsa dicotomia é percebida imediatamente: "ninguém me pediu para escolher; você é que escolheu por mim."
- **Implicação para o truísmo.** O truísmo não é derrotado; é *esvaziado* por uma formulação do problema que elimina artificialmente sua alternativa.
- **Alvo normativo (A02 + A15).** Desarmar a falsa dicotomia; exigir **exame formal de coexistência** antes que qualquer preocupação legítima seja aceita como derrotadora da obrigação.

### M04 — Encapsulamento interno como transferência de custo

- **Formulação curta.** "É um detalhe interno; encapsulei; não precisa aparecer na superfície."
- **Casos-âncora.** C17 (configuração de responsabilidades internas exposta ao consumidor), ressoando com C07.
- **Limiar.** O motivo sobrevive enquanto o encapsulamento for argumentado do lado do decisor. Colapsa quando se mostra que o custo que o encapsulamento "escondeu" de fato foi transferido ao consumidor, que agora precisa conhecer o interno para usar a superfície.
- **Estatuto pós-Fase 6.** `R` puro — desaparece sob inversão.
- **Teste posicional.** O afetado reconhece o movimento como o oposto de encapsulamento: "o interno foi reificado na minha superfície de uso."
- **Implicação para o truísmo.** O truísmo é violado, não derrotado: o encapsulamento é nominal, não real.
- **Alvo normativo (A03).** Desarmar "encapsulamento como omissão reificada" — o princípio posterior deve exigir que qualquer encapsulamento alegado seja verificável pela ausência de obrigação interpretativa do lado do consumidor.

### M05 — Ambiguidade semântica genuína entre camadas

- **Formulação curta.** "Existe uma ambiguidade real entre o que a camada interna representa e o que o consumidor espera dela; preciso recomendar um default mesmo quando não sei o que ele quer."
- **Casos-âncora.** Resíduo semântico de C17 (após decomposição em M04 + M05).
- **Limiar.** A parte genuína aparece quando a escolha de default é coerente com a ignorância real do decisor sobre a intenção do consumidor *e* reserva ao consumidor a possibilidade de refinamento.
- **Estatuto pós-Fase 6.** **Misto** — `N` parcial sobrevive; componente `R` colapsa.
- **Teste posicional.** Parcial: o afetado reconhece a legitimidade de escolher default, mas rejeita a ausência de caminho para refinamento.
- **Implicação para o truísmo.** O truísmo é **reescrito**, não derrotado: a obrigação permanece, mas especializada a "melhor forma dado o que se pode saber no momento".
- **Alvo normativo (A07).** Qualificar: reconhecer que ambiguidade semântica genuína reescreve a obrigação, sem aceitar que a ambiguidade sirva de licença para fechar o caminho de refinamento.

### M06 — Fluxo de controle da implementação como "restrição natural"

- **Formulação curta.** "A ordem/estrutura da superfície segue o fluxo natural da implementação."
- **Casos-âncora.** C05 (ordem de parâmetros), C12 (`new Date()` como default), C16 (`ORDER BY` como ordem da lista).
- **Limiar.** O motivo depende do uso de "natural" como marcador de inexaminado. Colapsa quando se nomeia o que é "natural": um hábito de ferramenta, uma conveniência de código, uma ausência de tradução para o modelo mental do consumidor.
- **Estatuto pós-Fase 6.** `R` puro — desaparece sob inversão.
- **Teste posicional.** Do lado do afetado, "natural" vira "aleatório": "a ordem é inesperada; nada nela corresponde ao meu modelo mental."
- **Implicação para o truísmo.** O truísmo não é derrotado: o fator é **confusão entre "mais barato para mim" e "único possível"**.
- **Alvo normativo (A04).** Desarmar "`natural`" como marcador de confusão — o princípio posterior deve tratar "natural" como sintoma a ser explicitado antes de ser aceito como razão.

### M07 — Custo sintático de expressar taxonomia refinada

- **Formulação curta.** "Expressar uma taxonomia rica de erros/estados custa muita cerimônia de tipos; é mais simples usar um tipo genérico."
- **Casos-âncora.** C03 e C14 lidos em linguagens pobres em tipos.
- **Limiar.** A parte `N` aparece onde o sistema de tipos de fato impõe ônus sintático alto para diferenciar categorias de erro. Colapsa a parte `R` quando o custo é usado para justificar *a forma da mensagem apresentada ao consumidor*, que é um eixo independente.
- **Estatuto pós-Fase 6.** **Misto** — `N` parcial (quanto aos tipos) + `R` parcial (quanto à mensagem).
- **Teste posicional.** Parcial: o afetado aceita o custo sintático dos tipos, mas não a transferência desse custo à mensagem de erro visível.
- **Implicação para o truísmo.** O truísmo não é derrotado; precisa ser **particionado** por eixo (forma interna × forma exposta).
- **Alvo normativo (A08).** Qualificar: o custo sintático justifica a ausência de *tipos ricos*, não a forma da *mensagem* que chega ao humano.

### M08 — Ausência de mapeamento entre modos de falha e ações do usuário

- **Formulação curta.** "Uma mensagem de erro mais precisa ou mais rica não altera o curso de ação disponível ao usuário, e ainda pode violar outras obrigações (opacidade, segurança)."
- **Casos-âncora.** C03 na variação V4 da Fase 4, onde se testa indistinguibilidade funcional entre duas formas possíveis.
- **Limiar.** O motivo só sobrevive quando o decisor pode **demonstrar** que as duas formas são indistinguíveis na estrutura de ação do afetado.
- **Estatuto pós-Fase 6.** `N` puro, **estreito**, com cláusula procedimental.
- **Teste posicional.** Sobrevive *apenas* sob a cláusula: se o afetado não puder verificar a indistinguibilidade, o motivo colapsa para racionalização.
- **Implicação para o truísmo.** É a única **sobrevivência positiva** no corpus: um caso em que o truísmo entra em conflito com outro comprometimento normativo interno (evitar sobrecarga cognitiva, preservar opacidade legítima), e precisa ser arbitrado em vez de derrotado.
- **Alvo normativo (A09 + A14).** Arbitrar entre *superfície útil* e *superfície rica* sob cláusula de **demonstração positiva de indistinguibilidade**.

### M09 — Reuso de componente compartilhado combinado com custo de refatoração

- **Formulação curta.** "Este componente é compartilhado; mudar a forma aqui exigiria refatorar todos os consumidores."
- **Casos-âncora.** C04 nas variações V3+V4 da Fase 4 (componente de empty state não aceita `label` configurável).
- **Limiar.** A parte restritiva sobrevive apenas para a janela de decisão imediata. A ausência de *plano gradual* para introduzir customização converte a restrição parcial em racionalização estável.
- **Estatuto pós-Fase 6.** **Misto** — componente `M09-isolado` colapsa em Fase 4 V2 (`R` puro); componente `M09-combinado` é restrição parcial, mas só para a primeira decisão.
- **Teste posicional.** Parcial: o afetado reconhece o custo de migração como real, mas não aceita que isso justifique preservar *permanentemente* a forma ruim.
- **Implicação para o truísmo.** O truísmo sobrevive no longo prazo; o que é aceito é um **adiamento**, não uma derrota.
- **Alvo normativo (A12).** Qualificar a parte restritiva; proceduralizar via **plano gradual contra petrificação** — o princípio posterior deve exigir que a decisão de não-mudar imediata seja acompanhada de um caminho explícito de customização.

### M10 — "Consistência" / "atomicidade" como nome para ausência de lógica

- **Formulação curta.** "Aceitamos/rejeitamos em bloco por consistência; uma transação atômica cobre o caso."
- **Casos-âncora.** C06 (formulário atômico), C16 (ordem ditada por `ORDER BY`).
- **Limiar.** O motivo só sobrevive quando o praticante pode apontar uma transação, invariante ou consistência *efetivamente* requerida. Colapsa quando "consistência" é usada como rótulo retórico para ausência de lógica.
- **Estatuto pós-Fase 6.** `R` puro — desaparece sob inversão.
- **Teste posicional.** Do lado do afetado, "consistência" sem transação apontável é reconhecida como rigidez arbitrária.
- **Implicação para o truísmo.** O truísmo é violado por uma **racionalização terminológica**.
- **Alvo normativo (A05).** Desarmar "consistência/atomicidade" quando não há transação apontável — o princípio posterior deve tratar o termo como retórico até que a transação seja exibida.

### M11 — Compartilhamento interno como razão para fundir superfícies externas

- **Formulação curta.** "Como o componente interno é o mesmo, a superfície externa também deve ser única."
- **Casos-âncora.** C18 (nomes de função sem convenção), C02 em variação V4 (flag que funde comportamentos distintos).
- **Limiar.** O motivo depende de confundir *implementação compartilhada* com *uso compartilhado*. Colapsa quando se mostra que o custo da fusão é inteiramente transferido ao consumidor, que passa a lidar com uma superfície menos expressiva.
- **Estatuto pós-Fase 6.** `R` puro — desaparece sob inversão.
- **Teste posicional.** O afetado rejeita imediatamente: "o fato de você reusar internamente não me obriga a usar externamente a mesma porta."
- **Implicação para o truísmo.** O truísmo não é derrotado; é violado por **confusão de níveis** entre implementação e uso.
- **Alvo normativo (A06).** Desarmar "simplicidade interna ≠ simplicidade externa".

### M12 — Custo de migração externa de consumidores fora do controle

- **Formulação curta.** "Consumidores externos usam esta forma; migrá-los está fora do meu controle."
- **Casos-âncora.** C18 e C02 em variações com consumidores externos não migráveis.
- **Limiar.** A parte restritiva aparece quando o decisor efetivamente não controla os consumidores. A parte `R` aparece quando a ausência de *caminho novo compatível* é tratada como consequência da restrição, e não como decisão local de omissão.
- **Estatuto pós-Fase 6.** **Misto** — restrição parcial + `R` por omissão de caminho compatível.
- **Teste posicional.** Parcial: o afetado aceita que migrar externo é custoso, mas não aceita a omissão de um caminho novo.
- **Implicação para o truísmo.** O truísmo sobrevive, mas **especializado**: obriga, no mínimo, a construir um caminho alternativo, ainda que o antigo permaneça.
- **Alvo normativo (A12).** Proceduralizar **plano gradual contra petrificação** — mesma estrutura de resposta que M09.

### M13 — Custo/risco alegado em vez de medido

- **Formulação curta.** "Mudar custa muito" / "há risco de regressão" — invocados sem contabilização.
- **Casos-âncora.** C20 (prazo), C19 (workaround preservado) nas variações V1–V3.
- **Limiar.** O motivo depende de que o custo da *não-mudança* não retorne ao decisor como informação. Colapsa a cada rodada em que se pede contabilização.
- **Estatuto pós-Fase 6.** `R` **estrutural-procedimental**. Não é `R` por má-fé do decisor individual; é `R` sustentada pela **assimetria de atenção decisor↔afetado**. A forma da informação disponível mantém a racionalização estável sem intenção racionalizante explícita.
- **Teste posicional.** Decisivo — do lado do afetado, que absorve o custo real, o fator é imediatamente reconhecido como injustificado.
- **Implicação para o truísmo.** O truísmo não é derrotado pelo conteúdo do fator; é **obscurecido estruturalmente** por ausência de retorno do custo real ao decisor.
- **Alvo normativo (A10).** Proceduralizar **retorno do custo real da não-mudança ao decisor** — o princípio posterior deve exigir visibilidade, rastreabilidade e retorno periódico desse custo.

### M14 — Familiaridade com o autor original como substituto de avaliação

- **Formulação curta.** "Conheço quem escreveu isso; confio; deixa como está."
- **Caso-âncora.** C19 no cenário Fase 4 V4 (preservação de workaround com leniência por autoria conhecida).
- **Limiar.** O motivo sobrevive apenas enquanto não se aplica o **teste de troca de autor** (T-d da Fase 5). Colapsa no instante em que se pergunta: "você aplicaria o mesmo critério se este código viesse de outra equipe, ou de alguém que já saiu?"
- **Estatuto pós-Fase 6.** `R` por **viés posicional**. O colapso é puro.
- **Teste posicional.** Desaparece sob inversão.
- **Implicação para o truísmo.** O truísmo não é derrotado; é *desviado* por uma assimetria afetiva/epistêmica do decisor.
- **Alvo normativo (A11).** Proceduralizar **teste de troca de autor** como obrigação ao avaliar preservação de forma herdada.

### Motivo atravessador — Petrificação como forma universal de `R` por omissão de procedimento

- **Formulação curta.** Sempre que houver uma restrição parcial legítima adjacente a uma forma reconhecida como ruim, a **ausência de plano gradual** converte a restrição em petrificação.
- **Motivos cobertos.** M09-b, M12-b, e qualquer análogo futuro com a mesma estrutura.
- **Estatuto pós-Fase 6.** `R` por omissão de procedimento — parcial.
- **Implicação para o truísmo.** O truísmo sobrevive no longo prazo sempre que houver plano gradual. A ausência do plano não é consequência da restrição: é decisão local independente.
- **Alvo normativo (A12).** Mesma procedimentalização de plano gradual que aparece em M09 e M12 — o princípio posterior pode enunciar A12 uma única vez e cobri-los todos.

---

## 5. Separação entre as três classes de motivo

A conclusão operacional da execução das Fases 1–8 é a distribuição a seguir. Nenhum motivo mudou de estatuto no teste posicional (Fase 6) em relação ao diagnóstico da Fase 5 — o que significa que o diagnóstico foi suficientemente robusto dentro dos limites do corpus.

### 5.1. Motivos que realmente derrotam a obrigação (sobrevivem sob inversão)

- **M08** — Ausência de mapeamento entre modos de falha e ações do usuário.
  - Único `N` puro do corpus. Conflito *interno* ao próprio truísmo (superfície útil × superfície rica).
  - Sobrevive **apenas sob cláusula procedimental** de demonstração positiva de indistinguibilidade (A14).
  - Trabalho do princípio posterior: **arbitrar** (A09) + **proceduralizar** (A14).

### 5.2. Motivos que apenas racionalizam a derrota (colapsam sob inversão)

`R` puros, que desaparecem inteiramente no teste posicional:

- **M01** — default de tooling sem exame de alternativas → **A01**.
- **M03** — falsa dicotomia preocupação × conforto → **A02 + A15**.
- **M04** — encapsulamento como omissão reificada → **A03**.
- **M06** — fluxo de controle como "restrição natural" → **A04**.
- **M10** — consistência/atomicidade sem transação apontável → **A05**.
- **M11** — compartilhamento interno como razão para fundir externas → **A06**.

`R` estrutural-procedimental — colapsam sob inversão, mas sustentados pela estrutura informacional ou por viés posicional do decisor:

- **M13** — custo/risco alegado em vez de medido → **A10**.
- **M14** — familiaridade com o autor original como substituto de avaliação → **A11**.

Para estes dois últimos, o princípio posterior precisa ser **procedimental**, porque o colapso argumentativo é insuficiente: a racionalização é reproduzida pela forma da informação disponível, não pela intenção do decisor.

### 5.3. Motivos cuja ambiguidade exige decomposição

Mistos — cada um decomposto em componente que sobrevive e componente que colapsa, com a decomposição corroborada pelo afetado:

- **M05** — ambiguidade semântica genuína entre camadas → `N` parcial (A07) + `R` residual.
- **M07** — custo sintático de taxonomia refinada → `N` parcial quanto aos tipos (A08) + `R` parcial quanto à mensagem.
- **M09** — reuso de componente + custo de refatoração → restrição parcial imediata + `R` por petrificação (A12).
- **M12** — custo de migração externa → restrição parcial + `R` por omissão de caminho (A12).

### 5.4. Fora do escopo do truísmo

- **M02** — compliance/auditoria como obrigação vinculante.
  - O truísmo não se aplica à parte genuinamente determinada por requisito externo verificável. O que sobrar está integralmente sob o truísmo.
  - O princípio posterior deve apenas proceduralizar a **demonstração positiva de compliance** (A13) para evitar mascaramento.

### 5.5. Orçamento filosófico mínimo

O conjunto que o princípio posterior tem de enfrentar diretamente é redutível a:

- **três consolidações** — C1 (desarmamento de `R` puros: A01–A06), C2 (qualificação + demonstração positiva: A07, A08, A13, A14), C3 (plano gradual contra petrificação: A12);
- **cinco alvos irredutíveis** — A05 (atomicidade sem transação), A09 (arbitragem útil × rica), A10 (retorno do custo real), A11 (teste de troca de autor), A15 (exame formal de coexistência).

Este é o escopo mínimo operacional da etapa seguinte de construção de princípios.

---

## 6. Conclusão metodológica

O trabalho das Fases 1–8 permite afirmar, de modo ancorado em casos paradigmáticos reconhecíveis por praticantes competentes e sobreviventes à inversão posicional, a seguinte conclusão:

> O truísmo deixa de guiar a prática **não por falta de assentimento**, mas porque, em casos paradigmáticos, os praticantes tratam certos fatores como derrotadores da obrigação. Dos quatorze motivos identificados no corpus:
>
> - **apenas um** sobrevive como conflito normativo genuíno, e assim mesmo sob cláusula procedimental estreita (M08);
> - **oito** colapsam integralmente sob inversão posicional como racionalizações (seis puras, duas estrutural-procedimentais);
> - **quatro** são mistos, exigindo decomposição em componente restritivo legítimo e componente racionalizante;
> - **um** está fora do escopo do truísmo mas exige proceduralização contra mascaramento.
>
> A tarefa dos princípios normativos seguintes será, respectivamente, **arbitrar** M08 (com cláusula de demonstração), **desarmar** os `R` puros, **proceduralizar** os `R` estrutural-procedimentais, **decompor** os mistos e **proceduralizar a exceção** de compliance.

Três conclusões complementares se impõem:

1. **O truísmo não é falso.** Das vinte situações paradigmáticas, em nenhuma ele foi genuinamente contradito: ou foi não-exercido por exame insuficiente de alternativas, ou foi violado por confusão de níveis, ou foi obscurecido por assimetria informacional, ou entrou em conflito interno consigo mesmo (M08). Em todos os casos, a obrigação persiste.

2. **Ele racha porque convive com comprometimentos concorrentes ou pseudo-derrotadores.** A estabilidade de muitas racionalizações — especialmente M13 e M14 — não vem de sua força argumentativa, que é nula sob inversão, mas da **estrutura informacional** em que a prática ocorre. Isso é o que torna a procedimentalização necessária: não basta argumentar, é preciso alterar as condições em que os motivos permanecem plausíveis.

3. **Sem explicitação dos motivos, qualquer princípio posterior ficará subarticulado.** Este catálogo fornece o objeto preciso que o princípio futuro deverá enfrentar: não "UX/DX como prioridade abstrata", mas os quatorze motivos aqui identificados, cada um com seu estatuto, sua estabilidade posicional, seu alvo normativo e sua implicação para a força do truísmo.

---

## 7. Relação com a Etapa 1 e com as próximas etapas

Em relação às etapas anteriores e posteriores do artigo, este catálogo:

| Produto deste catálogo                            | Alimenta                                                                 |
|---------------------------------------------------|--------------------------------------------------------------------------|
| M08 como único `N` puro estreito                  | Defesa de `C6` — distinção entre restrição com peso deliberativo e autoridade normativa |
| Lista de racionalizações A01–A06                  | Formulação do princípio central — fatores que o princípio deve derrotar  |
| Pares de comprometimento em tensão (Fase 7)       | Defesa de `C2` e `C3` — ônus evitáveis e transferência de custo exigem justificação |
| Limiares empíricos e A10, A11                     | Defesa de `C4` — papel normativo da visibilidade entre decisão e consequência |
| Cobertura de `runtime` e `build-time`             | Defesa de `C7` — unidade do espaço normativo entre UX e DX              |
| Orçamento filosófico mínimo (3 consolidações + 5 alvos) | Escopo operacional da etapa de construção de princípios           |

A etapa imediatamente seguinte — formulação do princípio central — deve tomar como entrada esta lista de quinze alvos (A01–A15), consolidados em C1/C2/C3 e irredutíveis, e produzir formulações que executem o trabalho aqui descrito: arbitrar, desarmar, qualificar, decompor e proceduralizar.
