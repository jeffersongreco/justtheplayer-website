# UseDD Design Tree — Revisão Filosófica

> Revisão analítica da Design Tree de Use Driven Design, conduzida nas cinco
> dimensões: análise conceitual, estrutura lógica, ontologia, epistemologia e
> normatividade.

---

## 1. Glossário Crítico

### Entidade

**Definição proposta:** X é uma entidade sse X é um participante de uma relação de uso — isto é, X pode ocupar o papel de decisor ou executor em pelo menos um par.

**Contra-exemplo:** Um arquivo de configuração `.env` participa de uma relação de uso? Ele é "usado" pelo runtime, mas não tem porta no sentido da árvore — não há decisor que defina o contrato de como `.env` é consumido (o formato é convencional, não decidido por uma entidade-decisora específica). Pela definição, ele seria uma entidade; pelo espírito da árvore, parece ser infraestrutura. Mas a definição de infraestrutura (L2.10) exige que a entidade "faça sentido independentemente de qualquer entidade" — um `.env` específico do produto não satisfaz esse critério.

**Diagnóstico:** O termo é *vago*. A neutralidade quanto a granularidade é apresentada como virtude, mas impede a discriminação entre participantes genuínos da cadeia e artefatos passivos que são consumidos sem porta explícita. Falta um critério de *entrada*: o que qualifica algo como participante de uma relação de uso, em oposição a mero insumo?

---

### Porta

**Definição proposta:** X é uma porta sse X é um contrato que (a) define como uma entidade é usada, (b) é definido pela entidade que usa (o decisor), e (c) precede a implementação da entidade usada.

**Contra-exemplo:** Uma variável de estado interna que um Model expõe via getter. O consumidor do Model não *definiu* esse getter — o getter emergiu da decomposição interna. O consumidor definiu *o que espera observar* (a porta comportamental), mas a forma concreta do getter é uma decisão do executor (quem implementa o Model). A porta aqui se bifurca: há uma porta-expectativa (do decisor) e uma porta-interface (do executor), e a árvore as trata como a mesma coisa até L3.2, onde finalmente distingue "porta de correção" e "porta de consumo".

**Diagnóstico:** O termo é *ambíguo*. Até L3.2, "porta" oscila entre dois sentidos: (1) expectativa comportamental definida pelo decisor, e (2) interface concreta oferecida pelo executor. L3.2 resolve parcialmente com a distinção correção/consumo, mas o glossário inicial não registra essa dualidade — o leitor opera com um conceito unificado durante L1 e L2 inteiros.

---

### Decisor / Executor

**Definição proposta:** Em um par (A, B), A é decisor sse A define a porta de B; B é executor sse B implementa o que a porta exige.

**Contra-exemplo:** Um desenvolvedor escreve um componente C que consome uma biblioteca L. O desenvolvedor *escolheu* L e *adaptou* C para a API de L. Quem é o decisor? O desenvolvedor decidiu usar L, mas a porta de L foi definida pelos autores de L, não pelo desenvolvedor. O desenvolvedor é decisor em relação a C, mas executor em relação à API de L. A árvore resolve isto via L2.10 (infraestrutura), mas o ponto é que *no ato de consumir*, o desenvolvedor é simultaneamente decisor (escolhe) e executor (adapta-se). A separação só é limpa após a classificação como infraestrutura.

**Diagnóstico:** O par decisor/executor é *operacionalmente limpo* dentro da cadeia, mas depende de L2.10 para resolver casos de fronteira com o mundo externo. Sem L2.10, o par é indeterminado para relações com APIs externas. Isso não é um defeito — é uma dependência que deveria ser declarada no glossário.

---

### Uso

**Definição proposta:** X usa Y sse X é decisor e Y é executor na relação entre eles.

**Contra-exemplo:** Um sistema de logging é "usado" por toda a aplicação, mas nenhuma entidade individual *define a porta* do logger — ele é consumido como é. Pela definição, isso não é "uso" no sentido técnico da árvore. Novamente, L2.10 resolve (infraestrutura), mas o termo "uso" no glossário é mais restrito do que o uso comum da palavra — e essa restrição não é sinalizada.

**Diagnóstico:** O termo tem *polissemia controlada*: o sentido técnico (relação assimétrica com decisor) diverge do sentido ordinário (qualquer consumo). A árvore reconhece isso ("'Uso' nomeia essa relação em qualquer granularidade"), mas subestima o risco de que o leitor importe o sentido ordinário.

---

### Usuário

**Definição proposta:** X é um usuário sse X é humano e participa diretamente de uma relação de uso com o sistema.

**Contra-exemplo:** Um testador QA é humano e interage diretamente com o sistema em runtime. Ele é "usuário do produto"? Sua interação é instrumental (verificar, não usar para o fim pretendido). A definição não distingue uso instrumental de uso finalístico.

**Diagnóstico:** O termo é *subdeterminado*. A restrição a "exatamente dois" humanos (usuário do produto + desenvolvedor) é estipulativa e funcional, mas o critério para ser um desses dois não exclui papéis instrumentais (QA, suporte técnico operando o sistema, administradores de sistema).

---

### Cadeia de autoridade

**Definição proposta:** X é uma cadeia de autoridade sse X é uma sequência finita e acíclica de relações decisor→executor, com raiz em um humano.

**Contra-exemplo:** Duas cadeias paralelas podem divergir do mesmo humano e convergir na mesma entidade executora (um componente usado por dois contextos diferentes, cada um com porta distinta). A definição fala de "sequência", sugerindo linearidade — mas a estrutura real é um DAG (grafo acíclico direcionado), não uma cadeia linear.

**Diagnóstico:** O termo "cadeia" é *enganoso*. A estrutura é de fato um DAG. Uma entidade pode ter múltiplos decisores (cada um definindo uma porta diferente para um aspecto diferente). A árvore não trata explicitamente esse caso — L2.7 exige decisor único *por par*, mas uma entidade pode participar de múltiplos pares, cada um com um decisor diferente.

---

### Infraestrutura

**Definição proposta:** X é infraestrutura sse a forma de X faz sentido independentemente de qualquer entidade específica do produto.

**Contra-exemplo:** Um wrapper tipado sobre `fetch` que adiciona headers de autenticação específicos do produto. Ele "faz sentido" como wrapper genérico (infraestrutura), mas sua forma concreta é determinada pelo produto (cadeia). O critério "faz sentido independentemente" admite graus — poucas entidades são puramente independentes ou puramente dependentes.

**Diagnóstico:** O critério é *vago* no sentido clássico — admite casos de fronteira (wrappers parcialmente genéricos, adapters que são quase infraestrutura) sem procedimento de resolução. L2.10 reconhece que "a fronteira é dinâmica", o que é honesto mas insuficiente como critério operacional.

**Onde uma solução é necessária:**

1. **"Entidade"** precisa de um critério de entrada que distinga participantes genuínos de artefatos passivos, ou a árvore deve declarar que tudo é entidade (e lidar com as consequências para infraestrutura).
2. **"Porta"** precisa que a dualidade expectativa/interface seja registrada desde o glossário, não apenas em L3.2.
3. **"Cadeia de autoridade"** precisa ser renomeada ou redefinida para acomodar a topologia real (DAG), ou a árvore deve argumentar que a linearidade é intencional e lidar com convergências.
4. **"Infraestrutura"** precisa de um procedimento de resolução para casos de fronteira, ou a árvore deve aceitar que a classificação é por julgamento (e declarar isso explicitamente).
5. **"Usuário"** precisa de um critério que exclua papéis instrumentais, ou a árvore deve argumentar que QA/suporte são instâncias de um dos dois humanos reconhecidos.

---

## 2. Mapa de Problemas Lógicos

### 2.1 Consistência

**C1 — Tensão entre L2.1 e L2.10.** L2.1 exige que toda entidade tenha nível único de responsabilidade. L2.10 retira infraestrutura da cadeia, colocando-a sob autoridade direta do "humano desenvolvedor". Mas o humano desenvolvedor é simultaneamente decisor da infraestrutura *e* decisor/executor em relações dentro da cadeia. L2.1 não se aplica a humanos? A árvore não declara essa exceção. Se o humano é modelado como entidade (o que P0 e L2.5 implicam), L2.1 deveria se aplicar a ele — e ele viola a separação de níveis ao ser decisor em múltiplos contextos com responsabilidades mistas (decidir infraestrutura + decidir produto).

**Localização:** L2.1 vs. L2.10, com implicação para L2.5 e L2.9.

**C2 — L2.6 como teorema: derivação incompleta.** A árvore afirma que L2.6 é derivável de L1.1 + L2.1 + L2.2 + L2.5. L1.1 exclui ciclos em pares; L2.2 estende para todas as escalas; L2.1 garante que a decomposição resolve ambiguidades. Mas a exclusão de ciclos indiretos (A→B→C→A) requer algo mais: que a relação "decide para" seja transitiva e antissimétrica. L1.1 garante antissimetria local (no par), e L2.2 garante uniformidade — mas transitividade não é declarada. Se A decide para B e B decide para C, A decide para C? A árvore não diz. A derivação depende de um pressuposto não declarado sobre a composição de relações de autoridade.

**Localização:** L2.6, nota sobre derivação.

**C3 — L2.7 como teorema: mesma lacuna.** L2.7 afirma derivabilidade de L1.1 + L2.1, mas a derivação depende de que "nível de responsabilidade" seja univocamente determinável *antes* de saber quem é decisor — o que é circular. L2.1 diz "separe níveis para que L1.1 funcione"; L2.7 diz "L1.1 + L2.1 implicam decisor único". Mas o critério para *quando* separar é a ambiguidade na direção da porta — que só é detectável se L2.7 já for esperado. A relação entre L2.1 e L2.7 é de co-dependência, não de derivação unidirecional.

**Localização:** L2.7, nota sobre derivação. Relação circular com L2.1.

### 2.2 Tipo de relação

**R1 — Nó Raiz → L1 não é mereológico.** A relação entre o Nó Raiz e L1.1/L1.2 não é parte-todo. É uma relação de *decomposição analítica*: o princípio "quem usa define a forma" é decomposto em dois eixos independentes (direção + sequência). Cada eixo é uma *dimensão* do princípio, não uma *parte* dele. A relação é dimensional, não mereológica.

**R2 — L1 → L2 é dedutiva, não mereológica.** Os nós L2 são apresentados como "consequências dos eixos", o que é uma relação de *derivação lógica*. Cada L2.n segue dos axiomas L1 — a relação é inferencial.

**R3 — L2 → L3 é de *realização prática*.** L3 descreve como executar o que L2 restringe. A relação é de operacionalização ou instanciação, não de composição.

**Diagnóstico:** A árvore usa uma única notação (pai→filho) para três tipos de relação distintos. Isso não invalida a estrutura, mas obscurece a natureza de cada transição.

### 2.3 Completude

**G1 — Ausência de tratamento de conflito entre decisores.** Se uma entidade participa de múltiplos pares com decisores diferentes, L2.7 garante decisor único *por par* — mas não há mecanismo para resolver conflitos quando dois decisores impõem exigências contraditórias sobre a mesma entidade. A árvore assume que a decomposição (L2.1) resolve isso, mas não explicita como.

**G2 — Ausência de critério de granularidade.** L2.2 diz que o princípio se aplica em todas as escalas, mas não oferece critério para *quando parar* a decomposição. Quando uma entidade é simples o suficiente para não precisar de uma porta explícita? A ausência de um critério de parada torna L2.2 potencialmente geradora de regressão na prática.

**G3 — Ausência de tratamento de evolução temporal.** A árvore trata portas como precedendo implementação (L1.2), mas não aborda revisão de portas ao longo do tempo. L2.4 menciona que "se a implementação não consegue satisfazer a porta, retorna-se à fase de especificação" — mas não há tratamento de como a cadeia de autoridade é afetada quando uma porta intermediária muda. Cascata de mudanças na cadeia é um problema real não endereçado.

**G4 — Ausência de operacionalização da "confirmação de satisfação".** L2.3 exige que a porta seja escrita no vocabulário em que o decisor pode "confirmar satisfação". Mas o que conta como confirmação? Confirmação é binária (satisfaz/não satisfaz) ou gradual? É formal (teste automatizado) ou informal (inspeção humana)? O critério de confirmação não é ele mesmo especificado.

### 2.4 Pressupostos ocultos

**A1 — Composicionalidade da autoridade.** A árvore assume que a relação de autoridade é composicional: se A tem autoridade sobre B e B sobre C, então A tem autoridade indireta sobre C. Isso não é declarado, mas é necessário para que L2.5 e L2.6 funcionem.

**A2 — Determinismo da decomposição.** L2.1 e L2.7 assumem que toda ambiguidade de direção pode ser resolvida por decomposição — isto é, que existe sempre uma decomposição que produz pares com decisor único. Isso é um pressuposto existencial não demonstrado.

**A3 — Irredutibilidade do humano.** P0 e L2.5 tratam o humano como ponto terminal da cadeia — o humano não precisa, ele mesmo, de justificação para suas decisões. Isso é um comprometimento filosófico forte (antropocentrismo axiomático) que funciona bem para design de software, mas deveria ser declarado como tal.

**A4 — Independência dos eixos.** L1 decompõe o princípio em direção (L1.1) e sequência (L1.2) como eixos independentes. Mas a sequência depende da direção: "o uso precede a implementação" só faz sentido se já se sabe *quem* usa (direção). A independência é assimétrica — L1.2 depende de L1.1, mas não o contrário.

**Onde uma solução é necessária:**

1. **C1:** A árvore precisa declarar se L2.1 se aplica ao humano ou explicitar por que o humano é exceção.
2. **C2/C3:** As derivações de L2.6 e L2.7 precisam de transitividade declarada (C2) e resolução da circularidade L2.1↔L2.7 (C3).
3. **G1:** É necessário um mecanismo de resolução de conflitos entre decisores para a mesma entidade.
4. **G2:** É necessário um critério de parada para decomposição.
5. **G3:** A árvore precisa endereçar cascata de mudanças quando portas intermediárias são revisadas.
6. **A4:** A dependência de L1.2 em L1.1 deve ser declarada, ou a independência deve ser argumentada.

---

## 3. Inventário Ontológico

| Entidade | Tipo ontológico | Critério de identidade | Essencial / Acidental | Diagnóstico |
|---|---|---|---|---|
| **Entidade** | Tipo (tipo-de-tipos) | Participa de relação de uso | Essencial: participação em pelo menos um par | Subdeterminado — sem critério de entrada (ver §1) |
| **Porta** | Artefato abstrato | Identidade pela tríade: decisor + executor + conteúdo do contrato | Essencial: definida pelo decisor, precede implementação; Acidental: formato (prosa, tipos, etc.) | Ambiguidade expectativa/interface não resolvida até L3.2 |
| **Decisor** | Papel (role) em relação | Identidade relacional: X é decisor de Y neste par | Essencial: define a porta; Acidental: natureza (humano, arquivo, módulo) | Operacionalmente limpo dentro da cadeia |
| **Executor** | Papel (role) em relação | Identidade relacional: X implementa a porta definida por Y | Essencial: satisfaz a porta; Acidental: como satisfaz | Operacionalmente limpo dentro da cadeia |
| **Uso** | Relação binária assimétrica | Identidade pelo par ordenado (decisor, executor) | Essencial: assimetria, direção fixa; Acidental: granularidade | Polissemia com sentido ordinário |
| **Usuário** | Entidade natural (humano) com papel | Identidade: humano + interação direta com o sistema | Essencial: humano, direto; Acidental: identidade pessoal | Subdeterminado para papéis instrumentais |
| **Cadeia de autoridade** | Estrutura (sequência/grafo) | Identidade pelo conjunto ordenado de relações de uso | Essencial: finitude, aciclicidade, raiz humana; Acidental: comprimento, topologia | "Cadeia" sugere linearidade; topologia real é DAG |
| **Infraestrutura** | Classe de entidades | Identidade negativa: não pertence à cadeia do produto | Essencial: independência do produto; Acidental: natureza (util, API externa) | Critério de fronteira vago |
| **P0 (premissa)** | Proposição analítica | Identidade pelo conteúdo proposicional | Essencial: caráter analítico (pela definição de artefato) | Comprometimento filosófico forte — ver abaixo |
| **Humano** | Entidade natural, ponto terminal | Identidade por ser agente com capacidade de decisão | Essencial: agência, capacidade de confirmação | Irredutibilidade assumida (A3) |

### Comprometimentos ontológicos problemáticos

**O1 — Status ontológico de P0.** A árvore afirma que P0 é analítica ("está contida na definição de 'artefato'"). Isso é defensável, mas carrega um comprometimento forte: a definição de "artefato" já inclui a teleologia (feito *para* alguém). Nem toda tradição filosófica aceita que artefatos são constitutivamente teleológicos — para um fisicalista eliminativo, um artefato é um arranjo material, e o "para" é projetado pelo observador. A árvore deveria declarar que opera dentro de uma ontologia teleológica de artefatos, não assumir que essa é a única opção.

**O2 — Porta como entidade versus porta como propriedade.** A porta é tratada ora como entidade independente (é "produzida antes", L1.2), ora como propriedade da relação de uso (é "o contrato" entre decisor e executor). Se é entidade, precisa de critério de identidade próprio e condições de persistência. Se é propriedade relacional, não deveria ser "produzida" — propriedades não são produzidas, são instanciadas. A árvore não decide.

**O3 — Reificação de papéis.** Decisor e executor são papéis em uma relação, não entidades. Mas a árvore frequentemente trata-os como se tivessem existência independente da relação ("quem decide não executa", L2.1). Isso é coerente se interpretado como restrição sobre atribuição de papéis, mas a formulação sugere propriedades intrínsecas das entidades.

**Onde uma solução é necessária:**

1. **O1:** A árvore precisa declarar sua ontologia de artefatos como comprometimento, não como fato analítico auto-evidente.
2. **O2:** A porta precisa de um status ontológico definido: entidade ou propriedade relacional. A escolha tem consequências para como "portas são produzidas" faz sentido.
3. **O3:** A árvore precisa esclarecer se L2.1 é uma restrição sobre atribuição de papéis (nenhuma entidade *deve* ocupar ambos os papéis no mesmo par) ou uma afirmação sobre propriedades intrínsecas (entidades *são* decisoras ou executoras por natureza).

---

## 4. Avaliação Epistêmica

| Nó | Base epistêmica | Status | Peso na estrutura | Adequação |
|---|---|---|---|---|
| **P0** | Definição estipulativa + apelo à analiticidade | Axioma declarado | Fundacional — toda a árvore depende | Adequado como axioma *se* a ontologia teleológica for declarada; atualmente apresentado como mais forte do que é |
| **Nó Raiz** | Derivação de P0 + intuição de design | Princípio derivado, parcialmente axiomático | Fundacional | Adequado — a derivação é transparente |
| **L1.1 (Direção)** | Axioma declarado | Axioma | Alto — determina a assimetria de toda relação | Adequado — reconhecido explicitamente como axioma. Raro e louvável |
| **L1.2 (Sequência)** | Derivação de L1.1 + Nó Raiz | Consequência lógica | Alto — determina a ordem de trabalho | Dependência em L1.1 não declarada (ver A4) |
| **L2.1 (Separação)** | Derivação de L1.1 | Consequência lógica | Alto — habilita determinismo | Co-dependência com L2.7 (ver C3) |
| **L2.2 (Uniformidade)** | Intuição de design + apelo à coerência | Axioma disfarçado de consequência | Alto — habilita L2.5, L2.6 | O argumento ("um princípio que muda de forma entre escalas não é um princípio") é retórico, não demonstrativo. É um comprometimento metodológico apresentado como necessidade lógica |
| **L2.3 (Vocabulário)** | Derivação de L1.2 + pragmatismo | Consequência lógica com componente pragmático | Médio | Adequado — a inferência é sólida |
| **L2.4 (Critério)** | Derivação de Nó Raiz | Consequência lógica | Alto — determina o que conta como correto | Adequado |
| **L2.5 (Raiz humana)** | Derivação de L2.2 + P0 | Consequência lógica | Alto | Adequado *se* L2.2 for aceito |
| **L2.6 (Finitude)** | Declarado como teorema | Teorema (com lacuna — ver C2) | Médio (pedagógico) | Derivação incompleta |
| **L2.7 (Decisor único)** | Declarado como teorema | Teorema (com circularidade — ver C3) | Alto | Derivação circular |
| **L2.8 (Humano como critério)** | Derivação de L2.4 + L2.5 | Consequência lógica | Alto | Adequado — derivação limpa |
| **L2.9 (Dois humanos)** | Análise conceitual + estipulação | Misto: análise + decisão de design | Alto — constrange L3 | A restrição a *exatamente dois* é estipulativa; a análise que a sustenta é convincente mas não exaustiva |
| **L2.10 (Infraestrutura)** | Pragmatismo + reconhecimento de fronteira | Decisão de design pragmática | Médio | Critério operacional vago (ver §1) |
| **L3 (Prática)** | Operacionalização de L1+L2 | Prescrição prática derivada | Execução | Adequado como operacionalização; depende da solidez de L1+L2 |

**Onde uma solução é necessária:**

1. **L2.2:** O status epistêmico precisa ser honesto — é um axioma metodológico, não uma consequência lógica. O argumento retórico que o sustenta precisa ser substituído por um racional que admita sua natureza estipulativa.
2. **L2.6 e L2.7:** As derivações precisam ser completadas ou os nós devem ser reclassificados como axiomas adicionais.
3. **L2.9:** O argumento para "exatamente dois" precisa endereçar papéis instrumentais (QA, ops, suporte) ou declarar explicitamente que os exclui e por quê.

---

## 5. Mapa Normativo

### Padrão de "bom design" pressuposto

A árvore pressupõe um padrão de bom design que pode ser articulado assim:

> **Design é bom na medida em que a forma de cada artefato é determinada, rastreável e justificável a partir do humano que o usa.**

Esse padrão combina três valores:

1. **Determinação** — cada relação tem direção clara (L1.1, L2.7).
2. **Rastreabilidade** — toda decisão traça de volta ao humano (L2.5, L2.6).
3. **Primazia do humano** — o humano é critério último (L2.8).

### Consistência interna do padrão

O padrão é **internamente consistente** ao longo da árvore. Cada nó reforça os três valores sem contradizê-los. L3 operacionaliza o padrão sem distorcê-lo. Este é um ponto forte da árvore.

### Conflitos com padrões legítimos alternativos

**N1 — Emergência como valor de design.** Algumas tradições (design generativo, arquitetura emergente em XP/Agile) valorizam que a forma *emerja* da interação entre implementação e uso, sem que nenhum lado tenha autoridade a priori. UseDD exclui essa possibilidade por construção (L1.1 + L1.2). A exclusão é consistente com os axiomas, mas deveria ser declarada como *trade-off*, não como consequência da definição de artefato. Há artefatos bem-sucedidos cuja forma emergiu sem especificação prévia.

**N2 — Pragmatismo técnico.** Padrões pragmáticos (YAGNI, "working software over comprehensive documentation") podem entrar em conflito com L1.2 (a porta precede a implementação) e L3 (sequência de especificação). O UseDD trata a porta como leve ("não é documentação"), mas ainda assim exige sua produção *antes* da implementação. Em contextos de alta incerteza, especificar antes pode ser mais custoso do que experimentar e depois especificar — e isso não é necessariamente "inversão de autoridade", é gestão de risco epistêmico.

**N3 — Design centrado em constraints técnicos.** Em domínios com fortes restrições técnicas (sistemas embarcados, real-time, hardware), a forma do artefato é frequentemente determinada pelas limitações do executor, não pelas expectativas do decisor. L2.8 reconhece que constrangimentos técnicos existem e que o fluxo é "retornar à especificação" — mas não endereça o caso em que as limitações técnicas são tão severas que a porta precisa ser *derivada* das capacidades do executor, não *imposta* pelo decisor. Nesses domínios, a direção de autoridade é genuinamente bidirecional em certas dimensões.

**N4 — Autonomia do executor como valor.** Em organizações de engenharia maduras, executores (times de implementação) frequentemente têm autonomia deliberada sobre *como* e, parcialmente, sobre *o quê* — não por falha na cadeia de autoridade, mas por reconhecimento de que o executor tem informação que o decisor não tem. UseDD acomoda o "como" (implementação livre), mas L2.7 exclui que o executor influencie o "o quê" — e em muitos contextos, isso é uma perda, não um ganho.

**Onde uma solução é necessária:**

1. **N1:** A árvore precisa declarar a exclusão de design emergente como trade-off consciente, não como consequência analítica.
2. **N2:** A árvore precisa endereçar o caso em que especificação prévia é epistemicamente mais custosa do que experimentação seguida de especificação — e argumentar por que isso é, ainda assim, "inversão de autoridade" e não "gestão de incerteza".
3. **N3:** A árvore precisa endereçar domínios constraint-driven onde a porta é derivada das capacidades do executor, ou delimitar explicitamente o escopo de aplicabilidade de UseDD.
4. **N4:** A árvore precisa distinguir influência do executor sobre o "o quê" (que L2.7 exclui) de informação do executor que o decisor incorpora ao definir a porta (que é compatível com UseDD). Sem essa distinção, a árvore parece excluir práticas legítimas.
