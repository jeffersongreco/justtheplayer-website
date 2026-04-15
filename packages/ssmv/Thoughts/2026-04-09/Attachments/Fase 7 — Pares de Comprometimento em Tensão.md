# Fase 7 — Formulação dos Pares de Comprometimento em Tensão

## 1. Objetivo da fase

Transformar cada motivo diagnosticado e estabilizado (Fases 5 e 6) em um **par analítico `C1/C2`** que mostre, com precisão, como o truísmo é esvaziado no caso correspondente. O objetivo, conforme §8 Fase 7 do plano, não é provar ou refutar o truísmo: é **explicitar a estrutura do conflito** entre o assentimento ao truísmo e o assentimento ao fator que aparenta derrotá-lo, para que a Fase 8 possa especificar o trabalho normativo exigido do princípio posterior.

A Fase 7 é, metodologicamente, o ponto em que o corpus deixa de produzir diagnósticos e começa a produzir **material utilizável pela etapa seguinte do artigo** — isto é, alvos concretos que o princípio futuro deverá enfrentar.

## 2. Estrutura dos pares

Conforme §8 Fase 7 do plano, cada par contém:

| Campo | Conteúdo |
|---|---|
| **Caso** | descrição específica e reconhecível do caso-âncora |
| **Comprometimento 1 (C1)** | assentimento ao truísmo na forma em que o praticante o sustenta |
| **Comprometimento 2 (C2)** | assentimento à justificativa que derrota ou aparenta derrotar o truísmo |
| **Fator de tensão** | o que muda entre os dois julgamentos; o "ponto de virada" |
| **Estatuto do fator** | `N`, `R` ou misto (resultado estabilizado pela Fase 6) |
| **Estabilidade** | estável, instável ou parcial, sob inversão posicional |
| **Trabalho exigido do princípio** | arbitrar, qualificar, desarmar ou proceduralizar |

A orientação herdada de §6 da Fase 6 modula o formato do par por classe de motivo:

- Para motivos `R` puros: `C2` é **pseudo-restrição** explícita, a ser desarmada por desarmamento argumentativo.
- Para motivos `R` estrutural-procedimentais: `C2` é, em rigor, **ausência de mecanismo** (não tese), e o trabalho do princípio é procedimental.
- Para motivo `N` puro (M08): o par tem a forma `C1` vs. `C1'`, dois comprometimentos do mesmo tipo normativo sob descrições concorrentes do que conta como "melhor experiência."
- Para motivos mistos: `C2` é **composto** — parte restritiva real + parte racionalizante parasitária — e a decomposição fica explícita no par.

A notação dos componentes mistos segue `C2-a` (componente restritivo real) / `C2-b` (componente parasitário), conforme já estabelecido na Fase 5.

---

## 3. Os pares

### Par M01 — Default de tooling aceito sem exame de alternativas

| Campo | Conteúdo |
|---|---|
| **Caso** | C13 — definição de tipo `Order` espelha o schema da tabela `orders` porque é auto-gerada pelo tooling padrão do projeto, que lê o banco e emite os tipos. |
| **C1** | "A forma dos tipos de domínio deve servir ao código que os consome — código que expressa invariantes, agregados e operações de domínio." |
| **C2** | "O tooling de auto-geração é o default do projeto; aceitá-lo preserva consistência banco↔código sem trabalho manual." |
| **Fator de tensão** | O default da ferramenta é tratado como restrição sobre o espaço de alternativas, quando há geradores com garantia equivalente de consistência que produzem tipo de domínio em vez de espelho do schema. |
| **Estatuto** | `R` puro |
| **Estabilidade** | instável — colapsa imediatamente sob inversão posicional |
| **Trabalho do princípio** | **desarmar**: mostrar que defaults de tooling não constituem restrição sobre o viável quando alternativas com mesma garantia existem. |

**Leitura do par:** o mesmo praticante que sustenta C1 em abstrato invoca C2 como se este derrotasse C1 — sem articular o princípio `P` que especificaria *quando* um default de tooling efetivamente derrota a obrigação de C1. Na ausência de `P`, C2 pode ser invocado para qualquer default de qualquer ferramenta, esvaziando C1 por inércia.

---

### Par M02 — Compliance/auditoria (fora do escopo)

Não se formula par para M02. Conforme estabelecido nas Fases 5 e 6, M02 sinaliza saída do escopo do truísmo: trata-se de restrição externa vinculante de tipo normativo distinto (regulatório), não de conveniência local da implementação.

**Nota a incluir no `Catálogo` final:** o motivo M02 é reconhecido como exceção legítima ao truísmo, mas essa exceção exige, procedimentalmente, **demonstração positiva** da obrigação externa concreta (documento de compliance, auditor efetivo, requisito regulatório rastreável). Sem essa demonstração, a invocação de M02 reverte para M01 (default de tooling ou hábito local travestido de compliance). Esta nota cumpre a função que, para os demais motivos, é cumprida pelo par.

---

### Par M03 — Falsa dicotomia entre preocupação legítima e conforto do consumidor

| Campo | Conteúdo |
|---|---|
| **Caso** | C09 — biblioteca exige `new Client(new Transport(new Serializer()))` porque "as camadas foram separadas para testabilidade e extensibilidade." |
| **C1** | "A biblioteca deve servir ao consumidor — no caminho comum, ser instanciável sem exigir conhecimento de decomposição interna." |
| **C2** | "Testabilidade e extensibilidade exigem que as três camadas sejam explicitamente compostas pelo consumidor." |
| **Fator de tensão** | A suposição de que testabilidade/extensibilidade e conforto do consumidor são mutuamente exclusivos — suposição que colapsa tão logo se demonstra que `Client.default()` ou `createClient({...})` satisfaz ambas. |
| **Estatuto** | `R` puro |
| **Estabilidade** | instável |
| **Trabalho do princípio** | **desarmar** + **exigir procedimentalmente exame de coexistência**: antes de invocar qualquer preocupação legítima como razão para impor cerimônia, o decisor deve examinar se o espaço de coexistência entre a preocupação e o conforto do consumidor foi considerado. |

**Leitura do par:** este é um caso em que a racionalização não nega C1, mas o *redescreve* como conflitante com uma preocupação legítima (C2) que, sob exame, não conflita de fato. O trabalho do princípio posterior é obrigar o exame antes que a disjunção seja aceita como restrição.

---

### Par M04 — Encapsulamento interno como transferência de custo de coordenação

| Campo | Conteúdo |
|---|---|
| **Caso** | C17 — configurar retries exige conhecer os três módulos internos (`transport`, `interceptor`, `client`) porque "o encapsulamento não permite uma opção unificada `{ retry: 3 }`." |
| **C1** | "A API pública deve servir ao consumidor; coordenação entre módulos internos é responsabilidade do autor da biblioteca, não do consumidor." |
| **C2** | "O encapsulamento interno dos três módulos impede que uma opção unificada seja oferecida." |
| **Fator de tensão** | Confusão entre *estado atual do código* (não há fachada) e *espaço de alternativas viáveis* (a fachada é construtível). "Encapsulamento" é usado como descrição reificada de uma omissão. |
| **Estatuto** | `R` puro |
| **Estabilidade** | instável |
| **Trabalho do princípio** | **desarmar**: o princípio posterior deverá impedir que "encapsulamento" seja invocado como restrição sem demonstração de obstáculo concreto à construção de fachada. |

**Leitura do par:** o par M04 é estruturalmente similar a M01 — ambos dependem de tratar como restrição algo que é apenas escolha local não-feita. A diferença é o nome da racionalização ("default de tooling" vs. "encapsulamento"); o mecanismo é o mesmo.

---

### Par M05 — Ambiguidade semântica genuína entre camadas internas *(misto)*

| Campo | Conteúdo |
|---|---|
| **Caso** | C17 resíduo — `transport.retry`, `interceptor.retry` e `client.retry` têm semânticas distintas (reenvio de pacote, reenvio de requisição, refacimento de chamada) e qualquer unificação envolve escolha semântica real. |
| **C1** | "A forma da API deve servir ao consumidor, incluindo o caminho comum." |
| **C2-a** (restritiva) | "Há ambiguidade semântica genuína entre as três camadas; qualquer default unificado privilegia uma semântica sobre as outras e pode enganar o consumidor avançado." |
| **C2-b** (parasitária) | "Logo, a forma correta é expor as três opções e deixar a escolha ao consumidor." |
| **Fator de tensão** | A transição de C2-a (reconhecimento legítimo de ambiguidade) para C2-b (omissão de recomendação). A ambiguidade real do domínio é usada como cobertura para omissão de decisão de design. |
| **Estatuto** | misto — `N` parcial (C2-a) + `R` parcial (C2-b) |
| **Estabilidade** | parcial — C2-a sobrevive à inversão; C2-b colapsa. |
| **Trabalho do princípio** | **qualificar** (C2-a): reconhecer a ambiguidade como condição legítima de restrição da forma da obrigação. **Desarmar** (C2-b): mostrar que reconhecer ambiguidade **não isenta** o decisor da obrigação de recomendar um default para o caso comum, com aviso explícito de refinamento disponível. |

**Leitura do par:** M05 é o tipo de caso em que o diagnóstico ingênuo seria "é `R` porque a recomendação default é viável" ou "é `N` porque a ambiguidade é real." Ambos errariam. O trabalho filosófico correto é reconhecer que o fator genuíno (C2-a) hospeda uma racionalização parasitária (C2-b), e que o princípio posterior tem de separá-los. A decomposição **não é cosmética**: sem ela, o `R` parasita o `N` e se torna inatacável.

---

### Par M06 — Fluxo de controle da implementação como se fosse restrição

| Campo | Conteúdo |
|---|---|
| **Caso** | C12 — date picker com default `new Date()` (hoje), mesmo em telas onde "hoje" é sabidamente inválido (reserva mínima de 48h, agendamento futuro etc.). |
| **C1** | "A forma do campo deve servir ao usuário da tela; o default deve ser uma data válida para o contexto." |
| **C2** | "`new Date()` é o default natural do fluxo de controle da implementação." |
| **Fator de tensão** | Confusão entre *mais curto para digitar* (uma linha, `new Date()`) e *único possível* (implicitamente sustentado pela escolha do termo "natural"). |
| **Estatuto** | `R` puro |
| **Estabilidade** | instável |
| **Trabalho do princípio** | **desarmar**: o princípio posterior deverá distinguir, com rigor, entre "caminho mais curto para o decisor" e "restrição sobre o espaço de alternativas viáveis", e impedir que o primeiro seja invocado como se fosse o segundo. |

**Leitura do par:** M06 é o `R` mais transparente do corpus — o colapso sob inversão é imediato e o decisor normalmente reconhece, após o exame, que o "natural" era uma escolha. A transparência do colapso, aqui, não reduz o valor do motivo: M06 é **altamente recorrente** e pouco reconhecido enquanto ocorre.

---

### Par M07 — Custo sintático de taxonomia de erros *(misto)*

| Campo | Conteúdo |
|---|---|
| **Caso** | C03 — mensagem de erro `"State transition from DRAFT to PUBLISHED failed: invalid edge"` em linguagem sem ADTs/pattern-matching; construir hierarquia formal de erros exige boilerplate recorrente. |
| **C1** | "A forma do erro deve servir ao afetado — quem precisa tomar uma ação em resposta." |
| **C2-a** (restritiva) | "Em linguagens pobres em tipos, construir uma hierarquia formal de erros é custo sintático real e recorrente." |
| **C2-b** (parasitária) | "Logo, a mensagem pode descrever a máquina de estado interna." |
| **Fator de tensão** | A transição de C2-a (custo sintático real para taxonomia tipada) para C2-b (parasitismo desse custo para cobrir também a **escolha da forma da mensagem**, que é governada por uma decisão distinta — M08). |
| **Estatuto** | misto — `N` parcial (C2-a) + `R` parcial (C2-b) |
| **Estabilidade** | parcial — C2-a sobrevive; C2-b colapsa instantaneamente. |
| **Trabalho do princípio** | **qualificar** (C2-a): reconhecer que linguagens pobres em tipos impõem custo sintático real sobre taxonomias formais. **Desarmar** (C2-b): impedir que esse custo contamine a decisão sobre forma da mensagem, que é independente de taxonomia tipada e governada por M08. |

**Leitura do par:** M07 é estruturalmente idêntico a M05 — um fator parcialmente genuíno hospedando uma racionalização parasitária — mas o núcleo genuíno aqui é mais estreito e o parasitismo é mais fácil de explicitar: construir uma string bem formulada custa zero de boilerplate, então o custo sintático de tipos não pode justificar a escolha de forma da string.

---

### Par M08 — Ausência de mapeamento entre modos de falha e ações de recuperação *(único `N` puro)*

| Campo | Conteúdo |
|---|---|
| **Caso** | C03 no cenário Fase 4 V4 — modos de falha são, por hipótese demonstrada, indistinguíveis do ponto de vista das ações de recuperação disponíveis ao afetado. |
| **C1** | "A forma do erro deve servir ao afetado — a melhor experiência é a superfície **útil**." |
| **C1′** | "A forma do erro deve servir ao afetado — a melhor experiência é a superfície **rica**, que não esconde distinções reais da situação." |
| **Fator de tensão** | Descrições concorrentes, dentro do mesmo comprometimento normativo, do que conta como "melhor experiência" quando as distinções internas não se traduzem em ações distinguíveis pelo afetado. |
| **Estatuto** | `N` puro, estreito |
| **Estabilidade** | estável dentro da cláusula procedimental de demonstração; fora dela, reverte a `R`. |
| **Trabalho do princípio** | **arbitrar/conciliar** os dois ramos de C1 + **proceduralizar a cláusula**: reconhecer M08 como exceção legítima apenas quando a indistinguibilidade das ações de recuperação tiver sido **positivamente demonstrada**, não meramente alegada. |

**Leitura do par:** M08 é o único caso em que o truísmo encontra, no corpus, um conflito normativo interno genuíno. É conflito não porque haja dois princípios diferentes em jogo, mas porque o único princípio — "melhor experiência para o humano relevante" — admite duas descrições legítimas do que conta como melhor, e essas descrições apontam para formas distintas quando as ações do afetado são indistinguíveis. O princípio posterior não deve eliminar a tensão; deve arbitrá-la, reconhecendo que a superfície genérica é legítima **sob demonstração** e ilegítima **sob alegação**. A cláusula procedimental é parte constitutiva do estatuto `N`.

---

### Par M09 — Reuso de componente compartilhado + custo de refatoração externa *(misto)*

| Campo | Conteúdo |
|---|---|
| **Caso** | C04 no cenário Fase 4 V3+V4 — componente de empty state compartilhado não aceita `label` customizável; adicionar o parâmetro exigiria migrar ~40 consumidores atuais. |
| **C1** | "A forma do empty state deve servir ao usuário da tela." |
| **C2-a** (restritiva) | "Migrar coordenadamente ~40 consumidores atuais para a nova API do componente é custo real imediato, transferido entre equipes." |
| **C2-b** (parasitária) | "Logo, a forma ruim é preservada indefinidamente, sem plano de resolução gradual." |
| **Fator de tensão** | A transição de C2-a (restrição pontual real) para C2-b (**petrificação do workaround por omissão de procedimento gradual**). A decisão de *não migrar agora* é defensável; a decisão de *não construir caminho para migrar nunca* não é. |
| **Estatuto** | misto — restrição parcial (C2-a) + `R` por petrificação (C2-b) |
| **Estabilidade** | parcial |
| **Trabalho do princípio** | **qualificar** (C2-a): reconhecer custo imediato de migração cross-team como razão legítima para não-atuar-agora. **Proceduralizar** (C2-b): impor obrigação de existência de plano gradual (parâmetro opcional com default, deprecação, coleta oportunista de migrações) quando o workaround é reconhecido como forma ruim. |

**Leitura do par:** M09 introduz um tipo específico de racionalização: a **petrificação por omissão de procedimento**. A ausência de migração imediata é defensável; a ausência de *qualquer mecanismo* de melhoria futura é `R`. O trabalho do princípio não é argumentativo contra o custo, é procedimental contra a omissão.

---

### Par M10 — "Consistência" ou "atomicidade" como nomes para ausência de lógica de preservação parcial

| Campo | Conteúdo |
|---|---|
| **Caso** | C06 (formulário resetado por completo ao falhar validação em um único campo) / C16 (lista exibida sem `ORDER BY` explícito). |
| **C1** | "A forma da resposta do sistema deve servir ao usuário; campos válidos preservados, ordem previsível." |
| **C2** | "Consistência/atomicidade exigem que o reset seja total / que a ordem seja a do banco." |
| **Fator de tensão** | Uso de termos técnicos ("atomicidade", "consistência") fora de seu escopo técnico específico (transações genuínas, restrições de integridade declarativas), emprestando a esses termos autoridade normativa que não lhes cabe no caso concreto. |
| **Estatuto** | `R` puro |
| **Estabilidade** | instável |
| **Trabalho do princípio** | **desarmar** + **exigência procedimental de apontamento**: invocações de "consistência" ou "atomicidade" devem ser acompanhadas da identificação concreta da transação que preservam. Sem isso, a invocação é terminológica e reverte para M06. |

**Leitura do par:** M10 é uma racionalização **de vocabulário**. A palavra técnica transfere para a decisão uma autoridade que ela não possui no caso em exame. A defesa do princípio posterior é exigir que o vocabulário técnico seja aplicado dentro de seu escopo técnico.

---

### Par M11 — Compartilhamento de fluxo de controle interno como razão para fundir operações externas

| Campo | Conteúdo |
|---|---|
| **Caso** | C18/C02 — dois comportamentos externamente distintos são fundidos em um único método com flag porque "internamente compartilham fluxo de controle." |
| **C1** | "A forma externa da API deve refletir a distinção do uso, não a estrutura interna." |
| **C2** | "Os comportamentos compartilham fluxo de controle interno, e fundi-los simplifica a implementação." |
| **Fator de tensão** | Transferência da estrutura interna à superfície externa. "Simplicidade de implementação" é tratada como se fosse critério normativo aplicável à forma da API, quando é critério aplicável apenas à estrutura interna. |
| **Estatuto** | `R` puro |
| **Estabilidade** | instável — colapsa instantaneamente sob inversão posicional. |
| **Trabalho do princípio** | **desarmar**: distinguir com rigor entre "simplicidade de implementação" e "simplicidade de uso", e impedir que a primeira seja invocada como razão para decisões sobre a segunda. |

**Leitura do par:** M11 é, com M06, o motivo mais cristalino do corpus — o colapso posicional é imediato, a confusão é simples e de vocabulário. O valor do par não está em sua sutileza, mas em sua **recorrência**: M11 ocorre toda vez que a conveniência do autor é carregada, sem exame, para a superfície do consumidor.

---

### Par M12 — Custo de migração externa de consumidores de API *(misto, paralelo estrutural a M09)*

| Campo | Conteúdo |
|---|---|
| **Caso** | C18/C02 no cenário Fase 4 V3 — renomeação/restruturação quebraria consumidores externos em larga escala. |
| **C1** | "A forma da API deve servir tanto aos consumidores atuais quanto aos futuros." |
| **C2-a** (restritiva) | "Quebrar em massa os consumidores atuais é custo real transferido, do mesmo tipo normativo que C1 — é experiência ruim para o humano relevante atual." |
| **C2-b** (parasitária) | "Logo, a forma ruim é preservada indefinidamente, sem aviso de depreciação, sem período de coexistência, sem deadline." |
| **Fator de tensão** | A transição de C2-a (restrição real sobre decisão imediata) para C2-b (**petrificação por omissão de procedimento gradual**, estruturalmente idêntica a M09). |
| **Estatuto** | misto — restrição parcial (C2-a) + `R` por omissão de caminho (C2-b) |
| **Estabilidade** | parcial |
| **Trabalho do princípio** | **qualificar** (C2-a): reconhecer custo de quebra em massa como razão legítima para não-atuar-agora. **Proceduralizar** (C2-b): impor existência de caminho gradual (deprecation path, coexistência temporária versionada, deadline público) quando a forma original é reconhecida como ruim. |

**Leitura do par:** M12 é **estruturalmente idêntico** a M09 — reconhecimento de custo imediato real + racionalização por omissão de procedimento gradual. A diferença é apenas a localização: M09 é intra-organização (componente compartilhado), M12 é inter-organização (consumidores externos). A identidade estrutural é registrada aqui e explorada na §4 deste arquivo sob o nome "petrificação por omissão de procedimento gradual".

---

### Par M13 — Custo/risco alegado em vez de medido *(R estrutural-procedimental)*

| Campo | Conteúdo |
|---|---|
| **Caso** | C20 (hardcoded preservado indefinidamente por "prazo") / C19 (workaround preservado por "risco de regressão"). |
| **C1** | "A forma do sistema deve servir ao afetado, incluindo ao longo do tempo." |
| **"C2"** | **Ausência de mecanismo** de retorno do custo real da não-mudança ao decisor. Não é tese a ser sustentada; é condição informacional que dispensa sustentação. |
| **Fator de tensão** | Assimetria de atenção entre decisor e afetado: o decisor sente o custo hipotético da mudança em primeira pessoa; o afetado absorve o custo real da não-mudança sem que esse custo retorne ao decisor como informação. A racionalização é estável **porque a informação não circula**, não porque o argumento seja bom. |
| **Estatuto** | `R` estrutural-procedimental |
| **Estabilidade** | instável argumentativamente (colapsa em segundos sob contabilização), mas **estável estruturalmente** enquanto o mecanismo informacional não for imposto. |
| **Trabalho do princípio** | **proceduralizar**: impor mecanismos de visibilidade (custo da não-mudança mensurável), rastreabilidade (quem aceitou a preservação e com que base), e retorno periódico (revisão obrigatória da preservação em intervalo definido). O desarmamento argumentativo é insuficiente porque o argumento não é o que sustenta o motivo. |

**Leitura do par:** M13 é o caso mais filosoficamente revelador do corpus, porque expõe a **diferença entre um `R` que se sustenta por argumento fraco e um `R` que se sustenta por ausência de exame**. O princípio posterior não pode atacar M13 mostrando que "prazo" ou "risco" são argumentos fracos — todo mundo já sabe que são, inclusive o decisor. O princípio tem de atacá-lo criando a condição estrutural em que a fraqueza argumentativa se traduz em mudança prática: fazer o custo real da não-mudança retornar ao decisor.

---

### Par M14 — Familiaridade com o autor original como substituto de avaliação independente *(R por viés posicional)*

| Campo | Conteúdo |
|---|---|
| **Caso** | C19 — workaround legado é preservado porque o praticante atual o reconhece como escrito por alguém em quem confia (ele mesmo, colega conhecido, ex-membro da equipe). |
| **C1** | "A forma do sistema deve ser avaliada contra seu serviço ao afetado, independentemente de quem a escreveu." |
| **"C2"** | **Ausência de mecanismo** de teste mental de troca de autor. Viés epistêmico, não tese. |
| **Fator de tensão** | Identidade do autor original como fator tratado como normativamente relevante sem articulação (e insustentável se articulado). |
| **Estatuto** | `R` por viés posicional |
| **Estabilidade** | instável argumentativamente (colapsa imediatamente sob teste T-d da Fase 5), mas estável na prática enquanto o teste não for exigido. |
| **Trabalho do princípio** | **proceduralizar**: exigir, como condição de avaliação de preservação de código legado, o teste mental explícito "se este código tivesse sido escrito por outra equipe, eu ainda recomendaria preservar?". Como M13, o desarmamento argumentativo é insuficiente — o motivo opera fora do espaço do argumento. |

**Leitura do par:** M14 compartilha com M13 a estrutura de `R` que só é estável por condição não-argumentativa — aqui, por viés posicional. Juntos, M13 e M14 constituem a classe dos **motivos em que o trabalho do princípio é criar condições, não produzir refutações**.

---

## 4. Motivo atravessador — Petrificação por omissão de procedimento gradual

A Fase 6 §5.2 e a Fase 7 (pares M09 e M12) tornaram explícito que M09-b e M12-b compartilham estrutura idêntica: **reconhecimento de custo imediato real + ausência de plano de resolução gradual**. Esta recorrência justifica, metodologicamente, tratar a estrutura como **motivo atravessador** dentro do corpus, mesmo não sendo um dos 14 motivos originalmente isolados.

### 4.1. Formulação do motivo atravessador

**Nome:** petrificação por omissão de procedimento gradual.

**Estrutura:** dada a presença legítima de uma restrição pontual (custo imediato de migração, coordenação cross-team, ou quebra de consumidores externos), o decisor conclui *também* pela ausência de qualquer mecanismo de melhoria futura. A primeira conclusão é defensável; a segunda é racionalização.

**Por que é atravessador:** aparece tanto em M09 (componente compartilhado) quanto em M12 (API consumida externamente), e previsivelmente aparecerá em qualquer caso futuro do corpus em que houver componente `C2-a` legítimo adjacente a forma reconhecida como ruim. A petrificação é um padrão de uso do componente legítimo, não um motivo novo.

**Trabalho exigido do princípio posterior:** **proceduralizar** — o princípio deve exigir que, sempre que um componente restritivo legítimo (`C2-a`) seja invocado para justificar não-atuação imediata, o decisor apresente *também* um plano gradual de melhoria. A ausência de plano gradual converte automaticamente `C2-a` genuíno em cobertura para `R`.

### 4.2. Implicação para a Fase 8

A existência deste motivo atravessador significa que a Fase 8 não terá de formular trabalho procedimental específico para M09 e M12 separadamente. Ela pode formular **uma única exigência procedimental** — a existência de plano gradual — que cobre ambos os casos e qualquer caso futuro estruturalmente análogo. Este é o tipo de consolidação que a Fase 7 torna possível: ao explicitar pares individuais, ela revela padrões que permitem economia de princípios na etapa seguinte.

---

## 5. Matriz resumida dos pares

| ID | Caso-âncora | Estatuto | Estabilidade | Trabalho do princípio |
|----|-------------|----------|--------------|-----------------------|
| M01 | C13 | `R` puro | instável | desarmar |
| M02 | — | fora do escopo | N/A | exceção legítima com demonstração positiva |
| M03 | C09 | `R` puro | instável | desarmar + exigir exame de coexistência |
| M04 | C17 | `R` puro | instável | desarmar |
| M05 | C17 resíduo | misto | parcial | qualificar (C2-a) + desarmar (C2-b) |
| M06 | C12 | `R` puro | instável | desarmar |
| M07 | C03 em linguagem pobre | misto | parcial | qualificar (C2-a) + desarmar (C2-b) |
| M08 | C03 V4 | `N` puro, estreito | estável sob cláusula | arbitrar + proceduralizar cláusula |
| M09 | C04 V3+V4 | misto | parcial | qualificar (C2-a) + proceduralizar (C2-b) |
| M10 | C06 / C16 | `R` puro | instável | desarmar + exigir apontamento da transação |
| M11 | C18 / C02 V4 | `R` puro | instável | desarmar |
| M12 | C18 / C02 V3 | misto | parcial | qualificar (C2-a) + proceduralizar (C2-b) |
| M13 | C20 / C19 | `R` estrutural-procedimental | instável arg., estável estr. | proceduralizar |
| M14 | C19 | `R` por viés posicional | instável arg., estável prat. | proceduralizar |
| atravessador | M09-b + M12-b + análogos futuros | `R` por omissão de procedimento | parcial | proceduralizar (plano gradual) |

---

## 6. Síntese da fase

A Fase 7 cumpriu sua função central: para cada motivo que sobreviveu ao diagnóstico das Fases 5 e 6, ficou explicitado (i) qual é o par `C1/C2` em que o mesmo praticante sustenta comprometimentos conflitantes, (ii) qual é o fator que opera como ponto de virada do conflito, e (iii) qual é o tipo de trabalho que o princípio posterior terá de realizar. Os motivos mistos foram explicitamente decompostos em componentes restritivos reais e componentes racionalizantes parasitários, e o motivo atravessador "petrificação por omissão de procedimento gradual" foi isolado como padrão recorrente.

A forma do resultado tem implicação estrutural para a Fase 8:

- **Desarmar** é o trabalho majoritário (6 motivos `R` puros: M01, M03, M04, M06, M10, M11).
- **Proceduralizar** é o segundo trabalho majoritário, cobrindo 5 motivos: M13, M14 (diretamente), M09, M12 (componente parasitário), e o motivo atravessador. A procedimentalização não é ornamento; é o único trabalho capaz de atacar `R` estrutural.
- **Qualificar** aparece em 3 motivos mistos (M05, M07) e em acoplamento com procedimentalização em M09 e M12.
- **Arbitrar** aparece em exatamente um caso: M08, o único `N` puro do corpus.

Esta distribuição é a forma concreta em que o achado central da Fase 6 — "o truísmo não racha por conflito legítimo; racha por racionalizações de estrutura reconhecível" — se traduz em tarefas para o princípio posterior. Cerca de três quartos do trabalho normativo a ser feito é desarmamento e procedimentalização; a parte conciliatória é proporcionalmente pequena e bem delimitada.

---

*Produto da Fase 7:*

1. **Treze pares `C1/C2`** formulados segundo §8 Fase 7 do plano, com decomposição explícita para os quatro motivos mistos (M05, M07, M09, M12) e estrutura diferenciada para os dois motivos estrutural-procedimentais (M13, M14) e para o único `N` puro (M08).
2. **Nota de exceção** para M02, que não gera par mas é registrado como exceção legítima com exigência procedimental de demonstração positiva.
3. **Motivo atravessador** ("petrificação por omissão de procedimento gradual") isolado a partir da convergência estrutural de M09 e M12, com implicação de consolidação de procedimentalização na Fase 8.
4. **Matriz resumida** dos pares pronta para ingresso na Fase 8 e, posteriormente, no `Catálogo de Condições de Derrota e Racionalizações.md`.
5. **Distribuição do trabalho normativo** a ser realizado pelo princípio posterior: predominância de desarmamento e procedimentalização, com arbitragem concentrada em um único caso.

*Próxima fase:* Fase 8 — *Conversão dos motivos em alvos de ataque normativo*.
