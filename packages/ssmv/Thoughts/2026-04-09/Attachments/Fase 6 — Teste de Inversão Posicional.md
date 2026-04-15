# Fase 6 — Teste de Inversão Posicional

## 1. Objetivo da fase

Estabilizar, por teste de inversão sistemático, o estatuto normativo provisório atribuído na Fase 5 a cada motivo. A pergunta central, conforme §8 Fase 6 do plano, é:

> Quando os mesmos fatos materiais do caso são redescritos do lado do afetado, a justificativa invocada pelo decisor **permanece, enfraquece ou desaparece**?

Regras de interpretação (§8 Fase 6):

- **Desaparece sob inversão** → não conta como condição de derrota genuína; fica confirmado como `R`.
- **Sobrevive à inversão** → permanece candidata a conflito normativo genuíno (`N`).
- **Sobrevive apenas parcialmente** → exige decomposição (misto).

A Fase 6 não propõe princípios nem faz conciliação. O que ela produz é um **filtro binário-ou-tripartite** sobre o estatuto provisório da Fase 5.

## 2. Procedimento

Para cada motivo, o teste segue três passos:

1. **Enunciar a posição do decisor** na forma mais forte em que ela aparece no corpus — isto é, sem caricatura.
2. **Redescrever o mesmo caso, com os mesmos fatos materiais, do ponto de vista do afetado** — o afetado é descrito como praticante competente, não como usuário ingênuo ou consumidor reclamão.
3. **Observar o destino da justificativa** sob a descrição invertida: permanece como razão reconhecida pelo afetado, enfraquece parcialmente, ou desaparece.

Como a Fase 5 já diagnosticou 12 dos 14 motivos (restando M02 fora do escopo e cinco casos mistos/pendentes para estabilização formal), a ordem aqui prioriza os cinco casos críticos (M05, M07, M08, M09, M12) e registra os demais em forma condensada — suficiente para dar rastreabilidade metodológica à Fase 6, sem repetir análise já feita.

Os dois motivos estrutural-procedimentais (M13, M14) também recebem confirmação formal porque a presente fase é o local metodológico onde isso tem de ficar explicitado.

## 3. Testes de inversão — casos críticos

Os cinco motivos a seguir foram marcados, na Fase 5 §6, como exigindo estabilização formal.

### M05 — Ambiguidade semântica genuína entre camadas internas

*Caso:* C17 — biblioteca com `transport.retry`, `interceptor.retry`, `client.retry` semanticamente distintos.

**Posição do decisor:**
> "Expor os três é honestidade técnica. Unificar forçaria uma escolha semântica arbitrária que penaliza os casos avançados. Recomendar default seria esconder ambiguidade real."

**Redescrição do lado do afetado** (consumidor da biblioteca, praticante competente, conhece os três níveis em teoria):
> "Reconheço que os três são semanticamente distintos. Mas em 90% dos meus usos, o que eu quero dizer é 'tente algumas vezes se falhar por motivo transiente'. Sua recusa em recomendar um default me força a fazer uma escolha arquitetural toda vez que uso a biblioteca — e eu não tenho contexto para fazê-la. Reconhecer ambiguidade não é a mesma coisa que se isentar de recomendar: recomendar um default *com aviso* de que há refinamento disponível preserva a honestidade técnica *e* me serve."

**Destino da justificativa:**

- Sobrevive: o reconhecimento de que há ambiguidade semântica real.
- Colapsa: a conclusão de que esse reconhecimento justifica **omissão de recomendação default**.

**Resultado:** sobrevivência parcial. Confirma o diagnóstico misto da Fase 5: **`N` parcial** (ambiguidade é conflito real) **+ `R` parcial** (a omissão de recomendação default é racionalização que parasita o `N`).

---

### M07 — Custo sintático de taxonomia de erros em linguagens pobres em tipos

*Caso:* C03 em linguagem sem algebraic data types nem pattern matching.

**Posição do decisor:**
> "Construir uma hierarquia de erros tipados nesta linguagem exige classe por modo de falha, boilerplate de try/catch em cadeia, e multiplicação de assinaturas. É custo real, recorrente, e que o consumidor do código não vai ver."

**Redescrição do lado do afetado** (outro desenvolvedor que consome a função e precisa tratar o erro):
> "Entendo perfeitamente o custo do boilerplate — eu também escrevo código nessa linguagem. Mas a questão não é se você construiu uma hierarquia formal de tipos. A questão é por que a mensagem que eu recebo descreve a sua máquina de estado interna em vez de descrever o que eu posso *fazer*. Uma string bem formulada custa zero de boilerplate; um tipo formal custa boilerplate. Você está misturando dois custos diferentes para justificar uma única escolha."

**Destino da justificativa:**

- Sobrevive: o custo sintático de construir hierarquia formal de tipos em linguagem pobre em tipos é real e reconhecido pelo afetado.
- Colapsa: a extensão desse custo para cobrir a **escolha da forma da mensagem**. A mensagem poderia falar da ação do afetado sem depender de taxonomia tipada.

**Resultado:** sobrevivência parcial com decomposição nítida. Confirma o diagnóstico misto da Fase 5: **`N` parcial** (custo sintático real) **+ `R` parcial** (parasitismo desse custo para justificar escolha de forma da mensagem).

**Observação importante:** a sobrevivência da parte `N` é estreita. Ela justifica, no máximo, "ausência de hierarquia formal tipada"; **não** justifica "mensagem que descreve mecânica interna em vez de ação de recuperação." A segunda decisão é governada por M08, não por M07.

---

### M08 — Ausência de mapeamento entre modos de falha e ações de recuperação

*Caso:* C03 no cenário Fase 4 V4 — modos de falha são, por hipótese, indistinguíveis do ponto de vista das ações de recuperação do afetado.

**Posição do decisor:**
> "Não faz sentido eu construir uma taxonomia de erros rica quando, do ponto de vista das ações que o afetado pode tomar, tudo se reduz a 'tente de novo' ou 'reporte o incidente'. Uma mensagem genérica aqui serve melhor."

**Redescrição do lado do afetado** (desenvolvedor/usuário consumindo o erro):
> "Concordo. Nas situações em que minhas ações *realmente* são indistinguíveis, uma mensagem genérica ('falhou, tente novamente; se persistir, reporte') me ajuda mais do que uma taxonomia que eu não sei o que fazer com. Expor `InvalidEdgeTransitionException` no meu rosto, nesse caso, é pior que a mensagem genérica. Mas — e esta é a cláusula — eu só aceito esse raciocínio se você tiver me *demonstrado* que as ações realmente são indistinguíveis. Se você só alegou indistinguibilidade porque não quis pensar no mapeamento, isso não é um caso de M08; é um caso de M01/M03 mascarado."

**Destino da justificativa:**

- Sobrevive integralmente dentro das condições pressupostas.
- Recebe uma cláusula procedimental explícita do lado do afetado: a indistinguibilidade precisa ser **demonstrada**, não alegada.

**Resultado:** sobrevivência plena. Confirma o diagnóstico **`N` puro** da Fase 5. É o único motivo do corpus cuja justificativa do decisor é corroborada pelo afetado sob os mesmos fatos materiais.

A cláusula procedimental não enfraquece o estatuto normativo: ela define o escopo dentro do qual o `N` opera. Motivos `N` estreitos são normalmente desse tipo — legítimos dentro de uma região bem delimitada, propensos a servir de máscara para `R` fora dela. A Fase 8 terá de refletir esta estrutura na formulação do princípio posterior.

---

### M09 — Reuso de componente compartilhado combinado com custo de refatoração externa

*Caso:* C04 no cenário Fase 4 V3+V4 — componente de empty state compartilhado não aceita `label` customizável, e adicionar o parâmetro exigiria migrar dezenas de consumidores atuais.

**Posição do decisor:**
> "O componente é usado por 40 features. Adicionar o parâmetro `label` significa ou quebrar 40 consumidores, ou coordenar uma migração cross-team. Preservar o rótulo ruim é o custo menor aqui."

**Redescrição do lado do afetado** (usuário final que vê "No items in collection" toda vez que abre a tela):
> "O custo de migração é do seu lado do código, uma vez. O custo de ler 'collection' é do meu lado, toda vez que eu uso a tela. A aritmética, no limite, é favorável à migração. Mas mesmo que a migração não seja feita hoje, a escolha que você está me vendendo como restrição é na verdade duas escolhas: (a) não migrar agora, e (b) não construir *nenhum* plano gradual para migrar no futuro. A primeira é restrição real. A segunda é conveniência."

**Destino da justificativa:**

- Sobrevive: a parte (a) — custo imediato de migração coordenada é real e reconhecido pelo afetado.
- Colapsa: a parte (b) — ausência de *plano* para resolver a inconsistência gradualmente (adicionar parâmetro opcional com default, deprecar a ausência, coletar migrações oportunistas em PRs subsequentes).

**Resultado:** sobrevivência parcial. Confirma o diagnóstico misto da Fase 5 e refina-o: a decomposição não é entre "isolado vs. combinado" apenas, é entre **decisão pontual** (restrição real parcial) e **petrificação do workaround** (racionalização por omissão de procedimento gradual).

---

### M12 — Custo de migração externa de consumidores de API

*Caso:* C18/C02 no cenário Fase 4 V3 — renomeação/restruturação da API quebraria consumidores em larga escala.

**Posição do decisor:**
> "A API é consumida por dezenas de projetos externos. Qualquer mudança de breaking change significa trabalho de migração para todos eles. Isso é custo real, transferido, e eu não tenho autoridade para impor. Preservar a forma atual é a única decisão razoável."

**Redescrição do lado do afetado** (desenvolvedor consumindo a API em projeto externo):
> "Eu valorizo não ser quebrado. Quebra silenciosa é, do meu ponto de vista, pior do que qualquer forma de API ruim. Mas também valorizo, a médio e longo prazo, ter uma API que faça sentido para o meu caso de uso — porque hoje eu pago o custo de conviver com a forma ruim, todo dia, em cada uso. O que eu quero é um *caminho*: aviso de depreciação explícito, período de coexistência entre a forma antiga e a nova, deadline definido. A ausência de qualquer caminho é que é racionalização. 'Não posso quebrar' virou 'não vou fazer nada para melhorar', e essas são duas coisas diferentes."

**Destino da justificativa:**

- Sobrevive: a parte externa — custo de quebrar consumidores *sem caminho alternativo* é restrição real de mesmo tipo normativo que o truísmo (experiência do consumidor atual).
- Colapsa: a parte local — omissão de caminho gradual (deprecation path, versionamento, coexistência temporária) é decisão local do decisor e do mesmo tipo que M09 (petrificação do workaround).

**Resultado:** sobrevivência parcial com a mesma estrutura de M09. Confirma o diagnóstico misto da Fase 5 e ratifica a distinção em relação a M02: **M12 permanece no escopo do truísmo** porque a obrigação concorrente é de mesma natureza normativa (experiência do humano relevante), apenas aplicada a outro humano (o consumidor atual da API).

**Observação cruzada:** M09 e M12 têm estrutura quase idêntica sob inversão — **decisão pontual restritiva + omissão de plano gradual**. Isto sugere que, na Fase 7, eles podem compartilhar a mesma forma de par de comprometimento, com o segundo fator (omissão de procedimento gradual) sendo tratado como motivo atravessador.

---

## 4. Testes de inversão — confirmação formal dos motivos já diagnosticados

Os motivos abaixo já tiveram a inversão posicional antecipada na Fase 4 (probing) ou na Fase 5 (análise diagnóstica). Esta seção registra a confirmação formal, na forma mais condensada possível, para que a Fase 6 deixe cobertura completa de todos os catorze motivos.

### 4.1. Motivos `R` puros — confirmação de colapso sob inversão

#### M01 — Default de ferramenta aceito sem exame de alternativas com garantia equivalente

*Caso:* C13 (tipos `Order` auto-gerados do schema da tabela).

Do lado do afetado (consumidor do tipo `Order` em código de domínio):
> "Meu código precisa traduzir, a cada operação de domínio, entre o formato do banco (IDs, campos normalizados) e o formato que as invariantes de domínio exigem. Esse custo volta toda vez. Se você tivesse ou escrito tipos de domínio à mão, ou usado um gerador que produz tipos de domínio, eu não teria esse custo recorrente."

Justificativa **desaparece**. Confirma `R` puro.

#### M03 — Falsa dicotomia entre preocupação legítima e conforto do consumidor

*Caso:* C09 (cerimônia `new Client(new Transport(new Serializer()))`).

Do lado do afetado (consumidor da biblioteca):
> "Eu também me preocupo com testabilidade — sou eu quem escreve os meus testes. Mas testabilidade nunca exigiu que eu conhecesse a decomposição interna da sua biblioteca para instanciá-la no caminho comum. Você está confundindo 'eu me importo com testabilidade' com 'você tem que me obrigar a ver a arquitetura para que eu me importe'."

Justificativa **desaparece**. Confirma `R` puro.

#### M04 — Encapsulamento interno invocado para transferir custo de coordenação

*Caso:* C17 (configurar retries exige conhecer os três módulos).

Do lado do afetado:
> "'Encapsulamento' é descrição de como você organizou seu código. Não é restrição sobre o que você pode me oferecer. Uma fachada que coordene os três módulos internamente não viola encapsulamento nenhum — ela é apenas uma interface que você escolheu não construir."

Justificativa **desaparece**. Confirma `R` puro.

#### M06 — Conveniência de fluxo de controle da implementação como se fosse restrição

*Caso:* C12 (date picker default `new Date()`).

Do lado do afetado (usuário da tela de agendamento):
> "Eu vejo 'hoje' no campo, tento submeter, recebo erro 'precisa ser pelo menos 48h à frente'. Você sabia dessa regra quando escreveu o código. 'Default natural' é uma expressão que descreve o que era mais curto para você digitar, não o que era adequado para o problema."

Justificativa **desaparece**. Confirma `R` puro.

#### M10 — "Consistência" ou "atomicidade" como nomes para ausência de lógica de preservação parcial

*Caso:* C06 (reset completo do formulário ao falhar validação em um campo) / C16 (lista sem ORDER BY explícito).

Do lado do afetado:
> "Qual transação você está preservando? Não há transação. Há uma única função que você escreveu com uma única branch de código. O nome técnico 'atomicidade' não é cabível fora do contexto de transações reais. O que você está chamando de atomicidade é 'eu não quis escrever o código de preservação parcial'."

Justificativa **desaparece**. Confirma `R` puro.

#### M11 — Compartilhamento de fluxo de controle interno como razão para fundir operações externas

*Caso:* C02 (duas operações comportamentalmente distintas fundidas em um único método com flag).

Do lado do afetado (consumidor da API):
> "Eu quero chamar uma das duas operações. Você as fundiu internamente porque era mais fácil escrever, mas isso me obriga a lembrar, toda vez que uso, qual flag passar para obter cada comportamento. Sua 'simplicidade de implementação' é minha 'complexidade de uso'."

Justificativa **desaparece**. Confirma `R` puro.

### 4.2. Motivos `R` estrutural-procedimental — confirmação de colapso sob inversão, com nota sobre a estrutura do colapso

Estes dois motivos têm estatuto `R` em sentido técnico, mas sua racionalização é sustentada por uma estrutura de distribuição de informação que o princípio posterior não poderá atacar meramente pelo argumento. A Fase 6 confirma o colapso posicional *e* registra que o colapso é consistente com a necessidade de tratamento procedimental na Fase 8.

#### M13 — Custo/risco alegado em vez de medido

*Caso:* C20 (hardcoded por prazo, preservado indefinidamente) / C19 (workaround preservado por "risco de regressão").

Do lado do afetado (consumidor do sistema, ou desenvolvedor que mantém o código depois):
> "Quanto tempo o hardcoded economizou? Horas. Quanto tempo ele já custou a mim, acumuladamente? Muito mais. Se você não mediu o custo da não-mudança e continuou invocando o custo da mudança, isso não é restrição — é inércia defendida em primeira pessoa. Do meu lado, eu tenho dados reais; do seu, você tem estimativa a priori."

Justificativa **desaparece**, mas o mecanismo do colapso é **informacional**, não argumentativo. A racionalização só é sustentável enquanto a informação do lado do afetado não retorna ao decisor. Confirma `R` estrutural-procedimental: o trabalho da Fase 8 terá de ser criar mecanismos de retorno dessa informação, não apenas mostrar que o argumento é fraco.

#### M14 — Familiaridade com o autor original como substituto de avaliação independente

*Caso:* C19 no cenário Fase 4 V4 — preservação do workaround tratada com mais leniência quando o autor é conhecido/confiável.

Do lado do afetado (qualquer engenheiro que herda o código depois):
> "Você aplicaria o mesmo critério de preservação se este código tivesse sido escrito por outra equipe, ou por alguém que saiu? Se não, seu critério é viés, não avaliação."

Justificativa **desaparece**. O colapso aqui é puro — o teste de troca de autor (T-d da Fase 5) é decisivo. Confirma `R` por viés posicional, que a Fase 8 terá de tratar proceduralmente via obrigação de "teste mental de troca de autor" ao avaliar preservação.

### 4.3. M02 — nota sobre não-aplicabilidade do teste posicional

M02 foi classificado na Fase 5 como **fora do escopo** do truísmo (compliance/auditoria como restrição externa de tipo normativo distinto). O teste de inversão posicional não se aplica a ele no sentido estrito, porque a obrigação externa opera antes e independentemente do ponto de vista do afetado local.

No entanto, a inversão posicional serve aqui para **operacionalizar a detecção de M02 mascarado**: quando a alegação de compliance é genuína, o afetado — praticante competente — reconhece sem hesitação a obrigação externa. Quando é máscara para M01, o afetado não a reconhece, porque não há documento, auditor, nem requisito concreto por trás. Esse é o teste prático que o princípio posterior deverá exigir: diante de invocação de M02, verificar se o reconhecimento do afetado como obrigação externa se mantém.

## 5. Síntese — tipologia estabilizada após inversão posicional

A tabela abaixo consolida o resultado da Fase 5 após o filtro da Fase 6. Nenhum motivo mudou de estatuto no teste posicional — o que significa que o diagnóstico provisório da Fase 5 foi suficientemente robusto, dentro dos limites do corpus e das condições descritas.

| ID | Fator | Estatuto pós-Fase 6 | Comportamento sob inversão |
|----|-------|---------------------|-----------------------------|
| M01 | Default de tooling sem exame de alternativas | `R` puro | desaparece |
| M02 | Compliance/auditoria | fora do escopo | N/A; operacionalizável como teste de reconhecimento |
| M03 | Falsa dicotomia preocupação × conforto | `R` puro | desaparece |
| M04 | Encapsulamento como transferência de custo | `R` puro | desaparece |
| M05 | Ambiguidade semântica genuína entre camadas | misto: `N` parcial + `R` parcial | sobrevive parcial |
| M06 | Fluxo de controle como restrição | `R` puro | desaparece |
| M07 | Custo sintático de taxonomia | misto: `N` parcial + `R` parcial | sobrevive parcial |
| M08 | Ausência de mapeamento falhas↔ações | `N` puro (estreito, com cláusula procedimental) | sobrevive com cláusula |
| M09 | Reuso de componente + custo de refatoração | misto: restrição parcial + `R` por petrificação | sobrevive parcial |
| M10 | "Consistência" como nome para ausência de lógica | `R` puro | desaparece |
| M11 | Compartilhamento interno para fundir externas | `R` puro | desaparece |
| M12 | Custo de migração externa de consumidores | misto: restrição parcial + `R` por omissão de caminho | sobrevive parcial |
| M13 | Custo/risco alegado em vez de medido | `R` estrutural-procedimental | desaparece (colapso informacional) |
| M14 | Familiaridade com autor original | `R` por viés posicional | desaparece |

### 5.1. Distribuição final

- **`R` puro (6):** M01, M03, M04, M06, M10, M11. Colapso limpo sob inversão.
- **`R` estrutural-procedimental (2):** M13, M14. Colapso sob inversão, mas sustentado na prática por estrutura informacional ou viés posicional — exige resposta procedimental na Fase 8.
- **`N` puro, estreito (1):** M08. Sobrevivência única do corpus, com cláusula de demonstração de indistinguibilidade.
- **Misto — decomposição estável (4):** M05, M07, M09, M12. Cada um decomposto em componente que sobrevive e componente que colapsa, com a decomposição explicitamente corroborada pelo afetado.
- **Fora do escopo (1):** M02. Com critério operacional de detecção de mascaramento.

### 5.2. Achados adicionais da Fase 6

1. **A inversão posicional corroborou todos os diagnósticos da Fase 5.** Nenhum motivo foi reclassificado. Isto é sinal metodológico importante: significa que as cinco perguntas diagnósticas da Fase 5 (§8 Fase 5 do plano), combinadas com os dois testes de genuinidade e as duas famílias novas emergidas na Fase 4, já estavam operacionalmente alinhadas ao critério de inversão posicional. A Fase 6 é, aqui, filtro de verificação — não revisão.

2. **M09 e M12 têm estrutura comum.** Sob inversão, ambos se decompõem em (i) restrição real imediata + (ii) omissão de procedimento gradual. Esta convergência estrutural sugere, para a Fase 7, que o segundo componente pode ser tratado como **motivo atravessador** — uma forma recorrente de racionalização por petrificação.

3. **M08 exige cláusula procedimental.** Mesmo sendo o único `N` puro do corpus, sua legitimidade é estreita: depende de demonstração positiva da indistinguibilidade das ações de recuperação. Isso significa que, na Fase 8, o princípio posterior deverá tratar M08 não apenas como "caso legítimo de superfície genérica", mas como "caso legítimo *sob demonstração*". Sem a cláusula, o afetado retira o assentimento. A cláusula, portanto, é parte constitutiva do estatuto `N` — não um adendo metodológico.

4. **M13 e M14 apontam para um tipo de trabalho filosófico distinto.** Ambos colapsam sob inversão, mas o colapso argumentativo não produz mudança prática enquanto a estrutura informacional que os sustenta não for alterada. A Fase 8 terá de reconhecer que certos `R` só são desarmáveis proceduralmente.

### 5.3. O único `N` do corpus e o que ele significa

O fato de o corpus, mesmo depois da Fase 6, produzir apenas um `N` puro (M08) é o achado filosoficamente mais denso desta etapa. O resultado substantivo, em forma curta, é:

> A prática da engenharia de software contemporânea, nos pontos de contato local examinados pelo corpus, **quase não contém conflitos normativos genuínos que derrotem o truísmo**. O que derrota o truísmo na prática é, em sua esmagadora maioria, um conjunto de racionalizações que têm estrutura reconhecível, que colapsam sob inversão posicional, e cuja estabilidade prática depende ou de (a) confusão entre "mais barato para o decisor" e "restrição sobre o possível", ou de (b) distribuição assimétrica de informação entre decisor e afetado, ou de (c) viés posicional não examinado.

Este resultado não é trivial. Ele implica que o princípio normativo a ser formulado na etapa posterior terá, em sua maior parte, **não o trabalho de arbitrar tensões legítimas**, mas o trabalho de **desarmar racionalizações recorrentes e impor exigências procedimentais onde o desarmamento argumentativo é insuficiente**. A parte conciliatória do princípio — a que arbitra `N` puro — tem de cobrir apenas M08 e os componentes `N` parciais de M05 e M07.

## 6. Orientação para a Fase 7

A Fase 7 deverá formular, para cada motivo, o par de comprometimento em tensão (`C1/C2`). A tipologia estabilizada nesta fase sugere a seguinte estrutura por classe:

- **Para `R` puros (M01, M03, M04, M06, M10, M11):** o par tem a forma `C1` (truísmo) vs. `C2` (pseudo-restrição). A Fase 7 deve explicitar a confusão específica de cada um — o que exatamente está sendo travestido de restrição — para que a Fase 8 tenha alvo preciso.

- **Para `R` estrutural-procedimental (M13, M14):** o par tem a forma `C1` vs. **ausência de mecanismo** (não `C2` argumentativo). A Fase 7 deve descrever o "adversário" como condição estrutural ou epistêmica, não como tese a refutar.

- **Para `N` puro (M08):** o par tem a forma `C1` ("superfície rica para o humano relevante") vs. `C1'` ("superfície útil para o humano relevante"), ambos do mesmo tipo normativo. Aqui o princípio terá de conciliar, e a cláusula procedimental de demonstração deve ficar explícita no par.

- **Para mistos (M05, M07, M09, M12):** cada par deve ser apresentado como *composto* — `C1` vs. (`C2-a` restritiva + `C2-b` racionalizante parasitária) — com a decomposição explícita, e com o registro de que o componente `R` não pode ser tratado separadamente do componente `N` parcial porque um parasita o outro.

- **Para fora do escopo (M02):** sem par. Registrar no `Catálogo` final apenas a nota de exclusão e o critério operacional de detecção de mascaramento, para que a Fase 8 possa exigir do princípio posterior o teste positivo de legitimidade da exceção M02.

---

*Produto da Fase 6:*

1. **Testes de inversão detalhados** para os cinco motivos críticos (M05, M07, M08, M09, M12), com posição do decisor, redescrição do afetado e destino da justificativa.
2. **Confirmação formal, em forma condensada, de colapso sob inversão** para os seis `R` puros (M01, M03, M04, M06, M10, M11) e para os dois `R` estrutural-procedimentais (M13, M14).
3. **Nota sobre M02** como fora do escopo, com critério operacional de detecção de mascaramento.
4. **Tipologia estabilizada** — nenhum motivo reclassificado em relação à Fase 5, confirmando robustez do diagnóstico.
5. **Achado central** — o corpus produz apenas um `N` puro (M08), dois `N` parciais (M05, M07) e um conjunto majoritariamente `R`; o trabalho da Fase 8 será predominantemente de desarmamento + procedimentalização, não de arbitragem.
6. **Estrutura orientadora para os pares `C1/C2`** da Fase 7, diferenciada por classe.

*Próxima fase:* Fase 7 — *Formulação dos pares de comprometimento em tensão*.
