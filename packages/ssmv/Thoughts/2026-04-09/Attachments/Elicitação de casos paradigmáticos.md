## O Método: Fenomenologia do Praticante como Fonte de Dados

O que você está descrevendo tem um nome preciso na metodologia analítica: **elicitação de casos paradigmáticos por reconhecimento intersubjetivo**. É o método usado quando o pesquisador não tem acesso a sujeitos de pesquisa mas tem acesso a um corpus de experiência compartilhada — e quer usá-lo com rigor filosófico em vez de anedoticamente.

A legitimidade do método repousa em um pressuposto epistemológico que precisa ser declarado no artigo: **o reconhecimento universal por praticantes competentes conta como evidência de que o fenômeno existe e tem a estrutura que parece ter**. Não é prova estatística — é o equivalente filosófico do que Rawls chamou de *considered judgments*: julgamentos feitos por pessoas com experiência relevante, em condições de reflexão, que convergem sem coordenação prévia.

---

## As Fases do Método

### Fase 1 — Delimitação do Corpus de Reconhecimento

O pesquisador precisa especificar, com precisão, **qual comunidade de praticantes** tem autoridade para o reconhecimento intersubjetivo relevante. Isso não é óbvio e precisa ser defendido.

O ponto metodológico importante: **a autoridade epistêmica não vem de cargo ou senioridade, mas de ter ocupado ambos os lados da relação** — decisor e afetado. Um praticante que só ocupou um lado tem julgamentos válidos mas parciais.

---

### Fase 2 — Catalogação por Estrutura de Reconhecimento, não por Conteúdo

O erro mais comum nesta fase é catalogar casos por **tema** (casos de API ruim, casos de prazo, casos de legado). A catalogação correta é por **estrutura de reconhecimento** — pelo tipo de resposta que o caso evoca no praticante.

### Dimensão 1 — Gradiente de Justificação (o *quanto* o praticante justifica)

Mantém a progressão linear, mas agora com três posições limpas:

**R1 — Sem justificativa oferecida**
*"Estava errado, não havia desculpa."*
O praticante reconhece a violação do truísmo e não mobiliza nenhum fator em defesa do decisor.

**R2 — Justificativa tentada, mas instável**
*"Não sei bem se havia saída."*
O praticante tenta oferecer uma justificativa mas não consegue sustentá-la com conforto. Há desconforto residual que não se resolve. Este é o limiar — o caso em que a tensão está mais visível.

**R3 — Justificativa oferecida com conforto**
*"Era o que dava para fazer, o contexto não permitia outra coisa."*
O praticante oferece uma justificativa e a sustenta sem desconforto aparente. A obrigação é tratada como derrotada.

---

### Dimensão 2 — Tipo da Justificativa (o *que* o praticante invoca em R2 e R3)

Esta dimensão só se aplica onde há justificativa — R2 e R3. É ortogonal ao gradiente.

**Tipo N — Conflito Normativo Genuíno**
O praticante invoca um comprometimento normativo distinto que ele também sustenta independentemente, e que genuinamente compete com o truísmo naquele caso.

Exemplos: *"havia um risco de segurança que tornava a solução mais simples perigosa"*, *"o contrato com o cliente especificava aquele comportamento"*, *"o prazo era uma restrição real imposta por regulação, não por conveniência"*.

O teste de genuinidade: o praticante invocaria esse mesmo comprometimento em outros contextos, mesmo quando ele não o beneficia? Se sim, é normativo. A tensão aqui é real — o princípio precisará arbitrar entre normas que coexistem legitimamente.

**Tipo R — Racionalização Post-Hoc**
O praticante invoca um fator que não é sustentado como comprometimento normativo independente — é construído para justificar a decisão já tomada, e não seria invocado se a decisão tivesse ido na outra direção.

Exemplos: *"era o que dava para fazer"* sem especificação do que impedia a alternativa, *"o time não tinha capacidade"* quando a capacidade nunca foi avaliada, *"o usuário se acostuma"* como previsão normativa não fundamentada.

O teste de genuinidade: se a decisão tivesse produzido boa UX/DX por acidente, o praticante ainda invocaria esse fator como relevante? Se não, era racionalização.

---

### Dimensão 3 — Estabilidade Posicional (independente das outras duas)

**Estável:** o julgamento do praticante sobre o caso não muda quando ele ocupa o lado oposto da relação. A justificativa em R3-N, por exemplo, é sustentada tanto quando o praticante é o decisor quanto quando é o afetado.

**Instável:** o julgamento muda com a posição. O praticante que está em R3 quando é decisor migra para R1 quando é afetado — com os mesmos fatos. Isso não é dado sobre *onde* ele está no gradiente, mas sobre a *confiabilidade* do julgamento como dado filosófico.

---

### Como as três dimensões trabalham juntas

```
Caso catalogado
      │
      ├── Dimensão 1: onde está no gradiente?
      │     R1 / R2 / R3
      │
      ├── Dimensão 2: se R2 ou R3, qual o tipo da justificativa?
      │     N (conflito normativo genuíno)
      │     R (racionalização post-hoc)
      │
      └── Dimensão 3: o julgamento é posicionalmente estável?
            Estável / Instável
```

Os casos mais valiosos para o conflict mapping são os que ficam em **R2 ou R3** na Dimensão 1, porque só nesses casos há justificativa a examinar. Dentro desses, a distinção N/R da Dimensão 2 determina o *tipo de trabalho filosófico* que o princípio precisará fazer:

- Casos **R2-N ou R3-N estáveis** → o princípio precisa arbitrar entre normas genuínas em conflito
- Casos **R3-R** → o princípio precisa mostrar por que a racionalização não derrota a obrigação
- Casos **instáveis** → revelam que a justificativa invocada não é normativa — são evidência de racionalização independentemente do conteúdo declarado

---

### Fase 3 — O Critério de Seleção dos Casos Catalogados

Para entrar no corpus filosófico, um caso precisa satisfazer três critérios simultaneamente:

**Critério de reconhecimento:** o caso deve ser do tipo *"já passei por isso"* ou *"sempre ouço isso"* — não *"consigo imaginar que isso aconteça"*. A diferença é que o primeiro acessa experiência sedimentada, o segundo acessa apenas capacidade de simulação. Para fins de elicitação de intuições de praticantes, só o primeiro conta.

**Critério de especificidade:** o caso deve ser específico o suficiente para que o praticante saiba *exatamente* qual situação está sendo descrita — não uma categoria genérica. *"A API foi desenhada para facilitar a implementação interna, não o uso externo"* é específico. *"A API era ruim"* não é — não acessa nenhuma intuição particular.

**Critério de posicionamento:** o caso deve ser descritível tanto da perspectiva do decisor quanto da perspectiva do afetado, sem alterar os fatos. Se a descrição só funciona de um lado, o caso está enviesado e não serve para elicitar a tensão.

---

### Fase 4 — Teste de Consistência Posicional

Para cada caso no gradiente, o pesquisador aplica o **teste de inversão posicional**: o caso é redescrito com o pesquisador/praticante ocupando o lado oposto da relação, mantendo todos os fatos inalterados.

Se a justificativa que era aceitável no polo do decisor deixa de ser aceitável no polo do afetado — com os mesmos fatos — então ela não é uma condição de derrota genuína. É uma racionalização posicional.

Casos que **não sobrevivem** ao teste de inversão posicional são os mais importantes para o conflito de comprometimentos: são eles que mostram que o truísmo é afirmado e violado pelo mesmo agente, com plena identificação de ambos os lados.

---

### Fase 5 — Formulação dos Pares de Comprometimento em Tensão

O produto final desta fase investigativa — que depois alimentará a escrita — é a lista de pares de comprometimento em tensão, cada um ancorado em casos com reconhecimento intersubjetivo verificável:

```
Par [n]:
  Caso: [descrição específica, reconhecível por praticantes]
  Estrutura de reconhecimento: [R1 / R2 / R3 / R4]
  Comprometimento 1: [o que o praticante afirma sobre o caso]
  Comprometimento 2: [o que o mesmo praticante afirma quando
                      a posição é invertida ou a variável X muda]
  Fator de tensão: [o que muda entre C1 e C2 que não está
                    articulado como princípio]
  Sobrevive ao teste posicional?: [sim / não / parcialmente]
```

---

### O que este método produz que entrevistas não produzem

A diferença não é de validade — é de **tipo de dado**. Entrevistas produzem julgamentos individuais em contexto elicitado. O método de catalogação por reconhecimento intersubjetivo produz **julgamentos sedimentados pela prática coletiva** — casos que sobreviveram tempo suficiente para se tornarem referências compartilhadas sem coordenação.

Filosoficamente, esses casos têm uma vantagem específica: eles já passaram por um filtro de relevância que o pesquisador não controla. Se um caso é universalmente reconhecido por praticantes de contextos diferentes, isso é evidência de que ele captura algo estrutural sobre o domínio — não um acidente local.

A desvantagem simétrica: o pesquisador não controla o viés de seleção dos casos que se tornaram canônicos. Casos que nunca chegaram a ser narrados — talvez porque o afetado não tinha voz ou não reconhecia o problema como problema — estão ausentes do corpus. Isso precisa ser declarado como limitação no artigo.
