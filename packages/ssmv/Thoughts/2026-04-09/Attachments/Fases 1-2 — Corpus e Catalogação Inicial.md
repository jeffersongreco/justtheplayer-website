# Fases 1–2 — Corpus de Casos Paradigmáticos e Catalogação Inicial

## 1. Nota metodológica

### 1.1. Justificativa do corpus e sua autoridade epistêmica

Este corpus é constituído pelo método de **elicitação de casos paradigmáticos por reconhecimento intersubjetivo**. Os casos não foram coletados por entrevistas nem derivados de princípios abstratos. Foram gerados a partir da experiência sedimentada pela prática coletiva de engenharia de software — isto é, do conjunto de situações que praticantes competentes reconhecem imediatamente como familiares, sem necessidade de explicação longa ou contexto adicional.

A autoridade epistêmica do corpus repousa em um pressuposto declarado: **o reconhecimento convergente por praticantes competentes, em condições de reflexão, conta como evidência filosófica de que o fenômeno existe e tem a estrutura que aparenta ter.** Não é prova estatística; é o equivalente filosófico dos *considered judgments* de Rawls — julgamentos feitos por pessoas com experiência relevante que convergem sem coordenação prévia.

### 1.2. Comunidade epistêmica

Os praticantes relevantes para o reconhecimento intersubjetivo são aqueles cuja autoridade epistêmica deriva de terem ocupado, ao longo da prática, **ambos os lados da relação**:

- ter definido a forma de alguma superfície de uso **e** ter consumido superfície definida por outrem;
- ter atuado em runtime **e** em build-time, ou ao menos ter visibilidade direta de ambos os regimes e de sua continuidade normativa.

O critério não é cargo nem senioridade, mas **amplitude posicional**: a aptidão para o teste de inversão posicional depende de ter experimentado o lado do decisor e o lado do afetado.

### 1.3. Limitações declaradas

O corpus capta casos **sedimentados pela prática coletiva narrada**. Isso implica duas limitações estruturais:

1. **Viés de sobrevivência narrativa.** Casos que nunca chegaram a ser narrados — por exemplo, porque o afetado não tinha voz, não reconhecia o problema como problema, ou não ocupava posição de onde pudesse reportá-lo — tendem a estar ausentes.

2. **Viés de articulação.** Casos que exigem repertório técnico sofisticado para serem reconhecidos podem estar sub-representados em corpora baseados em reconhecimento intersubjetivo amplo. A comunidade epistêmica relevante mitiga isso, mas não elimina.

Estas limitações não invalidam o método; precisam apenas ser declaradas para que o corpus não seja tratado como exaustivo.

### 1.4. Papel do instrumento auxiliar

O documento *Reclamações Comuns (2024–2026)* foi usado como instrumento de **elucidação e explicitação de padrões de caso**, não como critério de delimitação ou exaustão do corpus. Suas dimensões (carga cognitiva, feedback, transparência, controle, estabilidade) serviram para verificar se o corpus cobria padrões recorrentes reconhecíveis. Nenhum caso foi incluído apenas por corresponder a uma categoria do instrumento; nenhum caso foi excluído por não constar nele.

## 2. Critérios de entrada aplicados

Todos os casos satisfazem simultaneamente os treze critérios definidos no plano de execução (§6.1–6.13):

1. **Reconhecimento** — tipo "já passei por isso", imediato para praticantes experientes
2. **Especificidade** — superfície, decisor, afetado, alternativa e fator identificados
3. **Posicionamento** — descritível de ambos os lados sem alteração dos fatos
4. **Atualidade operacional** — práticas efetivamente presentes em 2024–2026
5. **Recorrência estrutural** — classe recorrente, não incidente isolado
6. **Não-caricatura** — praticantes competentes sob pressões plausíveis
7. **Reversibilidade plausível** — alternativa superior concreta e factível
8. **Densidade causal mínima** — decisão → fator → consequência
9. **Independência narrativa** — fatos sustentam-se sem retórica
10. **Fricção real** — custo concreto para o afetado
11. **Granularidade decisional mínima** — uma única decisão local
12. **Anti-amplificação** — código comum, escala cotidiana
13. **Atribuibilidade à implementação** — alterável modificando apenas o código

## 3. Regimes cobertos

| Regime | Casos |
|--------|-------|
| Runtime | C04, C06, C10, C12, C16 |
| Build-time | C01, C02, C05, C07, C09, C11, C13, C15, C18 |
| Ambos | C03, C08, C14, C17, C19, C20 |

## 4. Famílias de tensão cobertas

| Família | Casos |
|---------|-------|
| Superfície de produto (runtime) | C04, C06, C10, C12, C16 |
| API pública (build-time) | C02, C05, C09, C11 |
| Módulo ou componente (build-time) | C01, C07, C13, C18 |
| Mensagens de erro e feedback (ambos) | C03, C14 |
| Composição entre entidades (build-time) | C15, C17 |
| Legado e inércia (ambos) | C19 |
| Prazo e recurso (ambos) | C08, C20 |

---

## 5. Corpus de casos paradigmáticos

---

### C01 — Nome de método reflete implementação, não intenção de uso

**Regime:** build-time
**Superfície de uso:** nome de método público
**Decisor:** autor do módulo
**Afetado:** consumidor da API

**Descrição:** Um método público é nomeado `processQueueItems()` quando o que o consumidor busca é `sendPendingNotifications()`. O nome expõe o mecanismo interno (processamento de fila) em vez da intenção de uso (enviar notificações pendentes). O consumidor precisa conhecer a arquitetura interna para localizar o método correto.

**Alternativa superior aparente:** Nomear o método pela operação que o consumidor reconhece — `sendPendingNotifications()` — e tratar a fila como detalhe interno.

**Fator invocado:** O nome surgiu naturalmente durante a implementação e refletia o que o código de fato fazia internamente.

---

### C02 — Parâmetro booleano com efeito colateral não declarado

**Regime:** build-time
**Superfície de uso:** assinatura de função

**Decisor:** autor da função
**Afetado:** consumidor da função

**Descrição:** Uma função aceita `validate: boolean`, onde `false` não apenas desativa a validação mas também altera silenciosamente o formato do retorno. O consumidor precisa ler a implementação para descobrir que `validate: false` muda mais do que o nome sugere.

**Alternativa superior aparente:** Separar as duas operações em funções distintas, ou tornar explícitos os dois efeitos em parâmetros independentes.

**Fator invocado:** Os dois comportamentos estavam implementados no mesmo fluxo de controle e era mais simples expô-los com um único flag.

---

### C03 — Mensagem de erro expõe estado interno sem orientar ação

**Regime:** ambos
**Superfície de uso:** mensagem de erro

**Decisor:** autor da biblioteca
**Afetado:** consumidor (build-time) e, indiretamente, usuário final (runtime)

**Descrição:** Uma biblioteca lança `Error: state machine transition invalid: IDLE → PROCESSING requires READY` quando a ação do consumidor foi simplesmente chamar `.start()` antes de `.configure()`. A mensagem descreve o grafo de estados interno em vez de orientar o consumidor: "chame `configure()` antes de `start()`".

**Alternativa superior aparente:** Mensagem que descreva a ação corretiva do ponto de vista do consumidor, não o estado interno que foi violado.

**Fator invocado:** A mensagem foi gerada automaticamente pelo motor de estados, que descreve transições em seus próprios termos.

---

### C04 — Estado vazio usa vocabulário do modelo de dados, não do usuário

**Regime:** runtime
**Superfície de uso:** tela de estado vazio (empty state)

**Decisor:** implementador da tela
**Afetado:** usuário do produto

**Descrição:** Uma tela de estado vazio exibe "No items in collection" quando a tarefa do usuário era "encontrar compras recentes." O rótulo reflete o modelo de dados (`items`, `collection`) em vez do modelo mental do usuário (`compras`, `pedidos`). O usuário precisa traduzir entre sua intenção e o vocabulário do sistema.

**Alternativa superior aparente:** Usar vocabulário do domínio do usuário: "Você ainda não tem compras" ou "Nenhum pedido encontrado."

**Fator invocado:** O componente de estado vazio era genérico e recebia o nome da entidade diretamente do modelo de dados.

---

### C05 — Ordem de parâmetros segue sequência de processamento interno

**Regime:** build-time
**Superfície de uso:** assinatura de função

**Decisor:** autor da função
**Afetado:** consumidor da função

**Descrição:** Uma função `createUser(role, permissions, name, email)` ordena parâmetros pela sequência em que a implementação os processa (role → verificação de permissões → armazenamento de nome e email), não pelo modelo mental do consumidor (name, email, role, permissions). Cada chamador precisa lembrar ou consultar a ordem não-intuitiva.

**Alternativa superior aparente:** Ordenar por relevância para o consumidor (`name, email, role, permissions`), ou aceitar um objeto nomeado que elimine a dependência de ordem.

**Fator invocado:** A ordem "fazia sentido" durante a implementação porque seguia o fluxo interno de processamento.

---

### C06 — Erro de validação limpa formulário inteiro

**Regime:** runtime
**Superfície de uso:** comportamento de formulário após erro

**Decisor:** implementador do formulário
**Afetado:** usuário do produto

**Descrição:** Após um erro de validação no último campo de um formulário, todos os campos são limpos e o usuário precisa re-preencher tudo. A implementação processa o formulário como transação atômica que reverte inteiramente em caso de falha, em vez de preservar as entradas válidas e sinalizar apenas o campo problemático.

**Alternativa superior aparente:** Preservar os valores já preenchidos corretamente e marcar apenas o campo com erro, permitindo correção pontual.

**Fator invocado:** O modelo de transação atômica era mais simples de implementar e garantia consistência de estado sem lógica de preservação parcial.

---

### C07 — Tipo de retorno inclui campos internos irrelevantes para o consumidor

**Regime:** build-time
**Superfície de uso:** shape de retorno / definição de tipo

**Decisor:** autor do módulo
**Afetado:** consumidor da API

**Descrição:** Uma função retorna `{ data, metadata, _internal }`, onde `_internal` contém dados de bookkeeping da implementação que o consumidor jamais precisa. O consumidor deve desestruturar ao redor de um campo irrelevante, e a definição de tipo está poluída com detalhes internos. A shape foi desenhada para a conveniência do produtor.

**Alternativa superior aparente:** Retornar apenas `{ data, metadata }` e manter `_internal` em escopo privado da implementação.

**Fator invocado:** O objeto de retorno era o mesmo objeto usado internamente, e criar um tipo de retorno separado "era trabalho adicional."

---

### C08 — Valor default otimizado para a implementação, não para o uso

**Regime:** ambos
**Superfície de uso:** default de configuração

**Decisor:** autor da biblioteca/módulo
**Afetado:** consumidor (build-time) e usuário final (runtime)

**Descrição:** Um timeout de requisição default para `0` (significando "sem timeout") porque a implementação trata `0` como sentinel falsy para "pular verificação de timeout." Para o usuário final, isso produz requisições que travam indefinidamente. Para o consumidor desenvolvedor, significa que todo uso requer configuração explícita de timeout. O default razoável seria uma duração finita (e.g., 30 segundos).

**Alternativa superior aparente:** Default de 30 segundos (ou outra duração finita razoável), com opção explícita para desabilitar timeout quando necessário.

**Fator invocado:** `0` simplificava o fluxo de controle da implementação e era o valor falsy natural para a checagem condicional.

---

### C09 — API exige cerimônia que só a implementação necessita

**Regime:** build-time
**Superfície de uso:** fluxo de inicialização da API

**Decisor:** autor da biblioteca
**Afetado:** consumidor da API

**Descrição:** Para fazer uma requisição HTTP simples, a biblioteca exige que o consumidor instancie um client, configure um transport e defina um serializer — mesmo quando os defaults são adequados para 90% dos casos de uso. A sequência de setup espelha a arquitetura interna (camada de transporte → camada de serialização → fachada do client) em vez de fornecer um ponto de entrada para o caso de uso comum.

**Alternativa superior aparente:** Oferecer uma função ou método de entrada única para o caso comum (`library.get(url)`) e preservar a API granular para casos que genuinamente precisam de configuração fina.

**Fator invocado:** A separação em camadas era necessária para testabilidade e extensibilidade da biblioteca.

---

### C10 — Botões de confirmação usam rótulos genéricos em ação destrutiva

**Regime:** runtime
**Superfície de uso:** rótulos de botão em diálogo de confirmação

**Decisor:** implementador do diálogo
**Afetado:** usuário do produto

**Descrição:** Um diálogo perguntando "Descartar alterações não salvas?" oferece os botões "OK" e "Cancelar." "OK" significa "sim, descartar" — mas o usuário precisa mapear mentalmente "OK" a uma ação destrutiva. Os rótulos refletem a API genérica do componente de diálogo (que sempre usa OK/Cancelar) em vez da semântica da ação específica.

**Alternativa superior aparente:** Rotular os botões com a ação concreta: "Descartar" e "Continuar editando."

**Fator invocado:** O componente de diálogo era reutilizável e já vinha com os rótulos padrão; customizá-los exigiria passar parâmetros adicionais.

---

### C11 — API de callbacks quando o modelo mental do consumidor é sequencial

**Regime:** build-time
**Superfície de uso:** contrato de API (padrão de invocação)

**Decisor:** autor da biblioteca
**Afetado:** consumidor da API

**Descrição:** Uma operação que conceitualmente procede em passos lineares (ler → validar → gravar) é exposta como callbacks aninhados porque a implementação é internamente assíncrona. O consumidor é forçado a raciocinar sobre ordem de execução mesmo quando, da sua perspectiva, a operação é sequencial. Encapsular em promises ou fornecer uma API sequencial era possível mas exigiria trabalho adicional de implementação.

**Alternativa superior aparente:** Expor a operação como async/await ou como pipeline sequencial, ocultando a assincronia interna quando ela não é semanticamente relevante para o consumidor.

**Fator invocado:** A operação é genuinamente assíncrona internamente; expô-la assim "reflete a realidade" do que acontece.

---

### C12 — Date picker default para hoje quando o uso comum é data futura

**Regime:** runtime
**Superfície de uso:** estado inicial de seletor de data

**Decisor:** implementador do componente
**Afetado:** usuário do produto

**Descrição:** Um seletor de data para agendamento/reserva abre com a data de hoje como default, obrigando o usuário a navegar para frente toda vez. A implementação inicializa o seletor com `new Date()`. Abrir na próxima data disponível ou na janela mais comum de agendamento era viável mas exigiria consultar dados de disponibilidade.

**Alternativa superior aparente:** Inicializar o seletor na próxima data disponível, ou ao menos no próximo dia útil, com base nos dados já acessíveis ao sistema.

**Fator invocado:** `new Date()` era o default trivial e não exigia lógica adicional.

---

### C13 — Definição de tipo espelha schema do banco, não modelo de domínio

**Regime:** build-time
**Superfície de uso:** definição de tipo / interface

**Decisor:** autor do módulo de dados
**Afetado:** consumidor da API / mantenedor

**Descrição:** Uma interface TypeScript expõe `created_at: string`, `updated_at: string`, `is_deleted: boolean`, `fk_org_id: number` diretamente do schema do banco de dados. O consumidor trabalha com conceitos de domínio (data de criação como `Date`, organização como relação, soft-deletion filtrado por padrão). A shape foi gerada ou transcrita do banco, não desenhada para o domínio do consumidor.

**Alternativa superior aparente:** Interface de domínio com `createdAt: Date`, `organization: Organization`, sem exposição de flags internos como `is_deleted` e `fk_org_id`.

**Fator invocado:** Os tipos são auto-gerados a partir do schema para manter consistência e evitar divergência entre banco e código.

---

### C14 — Modos de falha distintos colapsados em erro genérico

**Regime:** ambos
**Superfície de uso:** tipo de erro / mensagem de erro

**Decisor:** autor da função/módulo
**Afetado:** consumidor (build-time) e usuário final (runtime)

**Descrição:** Uma função pode falhar por: (a) rede indisponível, (b) autenticação expirada, ou (c) entrada inválida. Ela lança um genérico `OperationFailedError` para os três casos. O consumidor (desenvolvedor) não consegue distinguir entre "tentar de novo," "re-autenticar" ou "corrigir a entrada" sem inspecionar logs internos. O usuário final vê uma mensagem genérica igualmente inútil.

**Alternativa superior aparente:** Erros tipados distintos (`NetworkError`, `AuthExpiredError`, `ValidationError`) com mensagens que orientem a ação de recuperação.

**Fator invocado:** Um único tipo de erro era mais simples de implementar e evitava a necessidade de definir uma hierarquia de exceções.

---

### C15 — Método interno vazado na definição de tipo pública

**Regime:** build-time
**Superfície de uso:** definição de tipo pública (type definitions)

**Decisor:** autor da biblioteca
**Afetado:** consumidor da biblioteca

**Descrição:** Um método interno da biblioteca é exposto nas definições de tipo publicadas. Quando o autor refatora os internals, a assinatura do método muda. Consumidores que dependiam do método exposto (porque a API oficial não cobria seu caso de uso) quebram no que foi publicado como atualização patch. A conveniência de não manter uma fronteira explícita entre superfície pública e internals causou a quebra.

**Alternativa superior aparente:** Marcar explicitamente a fronteira entre API pública e internals na definição de tipos, usando mecanismos disponíveis da linguagem (exports seletivos, `@internal`, tipos opacos).

**Fator invocado:** Manter a fronteira de tipos "era overhead adicional" e "ninguém deveria estar usando métodos internos."

---

### C16 — Ordem de exibição reflete índice do banco, não relevância para o usuário

**Regime:** runtime
**Superfície de uso:** ordem de itens em lista de resultados

**Decisor:** implementador da consulta/tela
**Afetado:** usuário do produto

**Descrição:** Uma lista de resultados de busca é exibida em ordem crescente de ID (ordem de inserção no banco) em vez de por relevância ou recência. A implementação consulta sem `ORDER BY` explícito, herdando o default do banco, porque adicionar ordenação e potencialmente um novo índice era trabalho adicional.

**Alternativa superior aparente:** Ordenar por relevância, recência ou outro critério que corresponda à expectativa do usuário na tarefa de busca.

**Fator invocado:** A consulta sem ordenação era a mais simples e rápida de implementar; "o usuário pode reordenar manualmente."

---

### C17 — Configuração exige conhecimento da arquitetura interna

**Regime:** ambos
**Superfície de uso:** API de configuração

**Decisor:** autor da biblioteca/framework
**Afetado:** consumidor (build-time) e, indiretamente, usuário final (runtime)

**Descrição:** Para alterar um único comportamento (e.g., "retentar requisições falhadas"), o consumidor deve configurar três módulos separados (transport, interceptor e client) porque a lógica de retry atravessa as fronteiras internas dos módulos da implementação. Uma única opção `{ retry: 3 }` no client de nível superior era viável mas exigiria que os módulos se comunicassem internamente.

**Alternativa superior aparente:** Opção de configuração no nível do client (`{ retry: 3 }`) que propaga internamente para os módulos relevantes.

**Fator invocado:** A separação de responsabilidades entre os módulos internos é importante para a arquitetura; expor uma opção unificada "quebraria o encapsulamento interno."

---

### C18 — Nomeação inconsistente entre funções relacionadas

**Regime:** build-time
**Superfície de uso:** nomes de funções públicas

**Decisor:** autores dos módulos (plural, ao longo do tempo)
**Afetado:** consumidor da API

**Descrição:** Operações relacionadas usam nomeação inconsistente: `getUser()`, `fetchOrders()`, `retrieveProducts()`, `loadCategories()`. Cada função foi implementada por um autor diferente ou em momento diferente, e cada um escolheu o sinônimo que lhe pareceu natural. O consumidor precisa memorizar qual verbo acompanha qual substantivo sem ganhar nenhuma distinção semântica da variação.

**Alternativa superior aparente:** Convenção uniforme (e.g., todas `get*`) para operações do mesmo tipo, definida antes da implementação ou aplicada por refatoração.

**Fator invocado:** Cada autor "nomeou do jeito que fazia sentido na hora"; não havia convenção definida e "funciona igual."

---

### C19 — Workaround preservado porque "funciona" apesar de alternativa nativa disponível

**Regime:** ambos
**Superfície de uso:** implementação de módulo

**Decisor:** mantenedor atual do módulo
**Afetado:** consumidor do módulo e mantenedor futuro

**Descrição:** Um módulo usa um workaround de parsing manual de strings que foi introduzido quando a plataforma não tinha API nativa para a tarefa. A API nativa está disponível há dois anos, simplificaria a implementação e melhoraria o tratamento de erros para o consumidor. O workaround é preservado porque "funciona e mudar arrisca regressão," sem avaliação efetiva da maturidade da API nativa nem do custo de manutenção acumulado do workaround.

**Alternativa superior aparente:** Migrar para a API nativa da plataforma, com testes de regressão que verifiquem paridade de comportamento.

**Fator invocado:** "Funciona, não está quebrado, mudar introduz risco de regressão."

---

### C20 — Valor hardcoded em vez de configurável por prazo alegado

**Regime:** ambos
**Superfície de uso:** comportamento de módulo / threshold de funcionalidade

**Decisor:** implementador original
**Afetado:** consumidores subsequentes e usuário final

**Descrição:** O threshold de comportamento de uma funcionalidade (e.g., número máximo de retentativas, duração de cache) foi hardcoded com um valor escolhido durante a implementação inicial sob pressão de prazo. O valor era adequado para o caso de uso original mas é inadequado para consumidores subsequentes. Torná-lo configurável era viável e teria custado aproximadamente uma hora a mais. "Não havia tempo" é invocado, mas a hora economizada já custou muitas horas de workarounds a jusante.

**Alternativa superior aparente:** Expor o threshold como parâmetro configurável com o valor original como default.

**Fator invocado:** "Não havia tempo para fazer direito; era entregar ou não entregar."

---

## 6. Catalogação por estrutura de reconhecimento (Fase 2)

### 6.1. Dimensão 1 — Gradiente de justificação

| Posição | Descrição | Casos |
|---------|-----------|-------|
| **R1** — Sem justificativa oferecida | "Estava errado, sem desculpa." | C01, C03, C04, C05, C07, C12, C16, C18 |
| **R2** — Justificativa tentada, instável | "Não sei se havia saída." | C02, C06, C08, C10, C14, C15, C20 |
| **R3** — Justificativa oferecida com conforto | "Era o que dava; o contexto não permitia." | C09, C11, C13, C17, C19 |

### 6.2. Dimensão 2 — Tipo da justificativa (apenas R2 e R3)

| Tipo | Descrição | Casos |
|------|-----------|-------|
| **N** — Conflito normativo genuíno | Comprometimento normativo independente que compete com o truísmo | (nenhum caso é inequivocamente N nesta catalogação inicial) |
| **R** — Racionalização post-hoc | Fator construído para justificar decisão já tomada | C02, C06, C08, C10, C14, C15, C20 |
| **I** — Indeterminado | Exige decomposição adicional antes de classificação | C09, C11, C13, C17, C19 |

**Nota sobre a ausência de tipo N puro.** Nenhum caso no corpus foi classificado como inequivocamente N nesta fase inicial. Isso não significa que conflitos normativos genuínos não existam — significa que, nos casos catalogados, os cinco classificados como I (C09, C11, C13, C17, C19) são os candidatos mais fortes a conterem componentes N, mas cada um deles também contém componentes que parecem racionalizantes. O threshold probing (Fase 4) e o diagnóstico de estatuto (Fase 5) deverão decompor esses casos mistos.

### 6.3. Dimensão 3 — Estabilidade posicional

| Estabilidade | Descrição | Casos |
|--------------|-----------|-------|
| **Estável** | Julgamento não muda com inversão de posição | C01, C03, C04, C05, C07, C12, C16, C18 |
| **Instável** | Julgamento muda com inversão | C02, C06, C08, C10, C14, C15, C16, C20 |
| **Parcial** | Parte da justificativa sobrevive, parte colapsa | C09, C11, C13, C17, C19 |

**Nota sobre a correlação entre dimensões.** Na catalogação inicial, há uma correlação forte entre R1 e estabilidade, e entre R2-tipo-R e instabilidade. Isso é esperado: onde não há justificativa oferecida, a condenação tende a ser estável; onde a justificativa é racionalização, ela tende a colapsar sob inversão posicional. Os casos parciais (todos I na Dimensão 2) são os mais valiosos analiticamente, porque é neles que o threshold probing revelará onde a linha entre N e R realmente passa.

## 7. Matriz resumida

| ID | Regime | Família | D1 | D2 | D3 | Superfície | Fator-chave |
|----|--------|---------|----|----|-----|------------|-------------|
| C01 | build | módulo | R1 | — | estável | nome de método | nome reflete implementação |
| C02 | build | API | R2 | R | instável | assinatura | flag com efeito colateral oculto |
| C03 | ambos | erro | R1 | — | estável | mensagem de erro | mensagem gerada pelo motor interno |
| C04 | runtime | produto | R1 | — | estável | empty state | vocabulário do modelo de dados |
| C05 | build | API | R1 | — | estável | assinatura | ordem segue processamento interno |
| C06 | runtime | produto | R2 | R | instável | formulário | transação atômica por simplicidade |
| C07 | build | módulo | R1 | — | estável | tipo de retorno | objeto interno reusado como retorno |
| C08 | ambos | prazo | R2 | R | instável | default | sentinel falsy por conveniência |
| C09 | build | API | R3 | I | parcial | fluxo de init | separação por testabilidade |
| C10 | runtime | produto | R2 | R | instável | botão | rótulo genérico do componente |
| C11 | build | API | R3 | I | parcial | padrão de invocação | assincronia "reflete a realidade" |
| C12 | runtime | produto | R1 | — | estável | date picker | `new Date()` como default trivial |
| C13 | build | módulo | R3 | I | parcial | definição de tipo | auto-geração a partir do schema |
| C14 | ambos | erro | R2 | R | instável | tipo de erro | erro genérico por simplicidade |
| C15 | build | composição | R2 | R | instável | definição de tipo | fronteira pública/interna não mantida |
| C16 | runtime | produto | R1 | — | estável | lista de resultados | query sem ORDER BY |
| C17 | ambos | composição | R3 | I | parcial | configuração | separação de responsabilidades interna |
| C18 | build | módulo | R1 | — | estável | nomes de função | sem convenção, cada autor nomeou |
| C19 | ambos | legado | R3 | I | parcial | módulo | "funciona, risco de regressão" |
| C20 | ambos | prazo | R2 | R | instável | threshold | "não havia tempo" |

## 8. Observações preliminares sobre o corpus

### 8.1. Distribuição por gradiente

- **R1 (8 casos):** casos de violação "limpa" do truísmo, sem justificativa oferecida. Úteis como ponto de partida para pares de julgamento (Fase 3), porque estabelecem a baseline de condenação.
- **R2 (7 casos):** casos em que a justificativa é tentada mas instável. São o principal material para o threshold probing, porque o limiar de mudança de julgamento está próximo e visível.
- **R3 (5 casos):** casos em que a justificativa é oferecida com conforto. São os mais importantes para o diagnóstico de estatuto (Fase 5), porque é neles que se decidirá se há conflito normativo genuíno ou racionalização sofisticada.

### 8.2. Os cinco casos indeterminados

C09, C11, C13, C17 e C19 compartilham uma estrutura: em todos eles, o fator invocado faz referência a um comprometimento que o praticante também sustenta em outros contextos (testabilidade, fidelidade semântica, consistência de dados, separação de responsabilidades, estabilidade de código). A questão aberta é se esse comprometimento genuinamente compete com o truísmo no caso específico ou se é invocado *apenas* quando permite ao decisor não arcar com o custo de oferecer melhor experiência ao consumidor.

O threshold probing (Fase 4) deverá variar precisamente essa condição: se o comprometimento invocado for removido (e.g., se a testabilidade puder ser alcançada sem impor cerimônia ao consumidor), o julgamento muda? Se sim, o comprometimento era condição necessária; se não, era pretexto.

### 8.3. Presença dos dois lados do reconhecimento

O corpus inclui casos em que o praticante reconhece claramente:
- **"Estava errado, sem desculpa"** — C01, C03, C04, C05, C07, C12, C16, C18
- **"Era o que dava para fazer"** — C09, C11, C13, C17, C19

E, crucialmente, um conjunto intermediário (C02, C06, C08, C10, C14, C15, C20) em que o praticante *tenta* justificar mas não sustenta a justificativa com conforto — é aqui que a tensão normativa é mais visível e o trabalho filosófico mais produtivo.

---

*Produto da Fase 1:* nota metodológica + corpus de 20 casos.
*Produto da Fase 2:* matriz de catalogação por estrutura de reconhecimento em três dimensões.

*Próxima fase:* Fase 3 — Coleta de pares de julgamento não-teórico.
