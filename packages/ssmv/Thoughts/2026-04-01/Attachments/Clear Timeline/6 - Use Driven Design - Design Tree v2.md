# Use Driven Design — Design Tree

> Mapa causal de decisões de design: cada nó é uma escolha feita entre alternativas, com racional explícito. Nós-pai constrangem ou habilitam nós-filho.
> Escopo: o princípio e sua prática de especificação.

---

### Glossário

- **Entidade** — Qualquer participante de uma relação de uso. Pode ser um humano, um arquivo-fonte, um módulo, um sistema inteiro. O termo é neutro em relação à granularidade.
- **Porta** — O contrato que define como uma entidade é usada. Toda entidade usada por outra tem uma porta. A porta é definida pela entidade que usa (o decisor), não pela entidade que é usada (o executor).
- **Decisor** — A entidade que, em um par, toma decisões. O decisor define a porta da entidade que usa. Decidir é sua responsabilidade; executar, não.
- **Executor** — A entidade que, em um par, implementa o que o decisor definiu através da porta. Executar é sua responsabilidade; decidir, não.
- **Uso** — A relação entre decisor e executor. Nomeia a relação em qualquer granularidade. Não implica que o decisor seja um humano — um arquivo-fonte pode ocupar o papel de decisor em uma relação com outro arquivo-fonte.
- **Usuário** — Reservado ao humano. Nunca reaproveitado para entidades intermediárias. A cadeia de autoridade sempre começa em um usuário. Os humanos que "usam" diretamente o sistema são exatamente dois: o **usuário do produto** (interage em runtime, dando input e recebendo outputs) e o **desenvolvedor** (interage em build-time, escrevendo e mantendo código). Todos os demais papéis são mediados — PMs são proxies do usuário do produto; a empresa é mediada por ambos.
- **Cadeia de autoridade** — A sequência de relações de uso que conecta qualquer entidade de volta ao humano. Cada elo é uma relação decisor→executor. A cadeia é finita, acíclica, e tem exatamente uma raiz: o humano.
- **Infraestrutura** — Entidades que não participam da cadeia de autoridade do produto. Utils/helpers internos e APIs externas (browser, runtime) são infraestrutura — suas portas são definidas pelo humano desenvolvedor diretamente, não por uma entidade-decisora. Critério operacional: se a forma da entidade só faz sentido no contexto de uma entidade específica do produto, ela pertence à cadeia; se faz sentido independentemente de qualquer entidade, é infraestrutura.

---

### Premissa Fundacional — P0

**Premissa:** Software é um artefato cuja razão de existir é servir um humano.

**Natureza:** P0 é analítica — está contida na definição de "artefato". Um artefato sem usuário final humano não é software; é um processo natural ou um acidente. P0 não diz "software deveria servir humanos" (ought). Diz "software que não serve humanos não é software no sentido relevante" (is). A normatividade de UseDD não vem de um dever moral externo — vem da definição do objeto.

**Papel na árvore:** P0 é o que faz o "quem usa" do Nó Raiz importar. Sem P0 explícita, o Nó Raiz ("quem usa define a forma") parece ser o ponto de partida, mas ele já pressupõe que existe um "quem usa" cuja satisfação é relevante.

---

### Nó Raiz

**Decisão:** Quem usa define a forma do que é usado, e essa forma precede a implementação.

**Alternativas:**
- Direção invertida: a implementação define o que é exposto; o uso se adapta ao que existe.
- Sequência invertida: o uso é documentado depois, como descrição do que foi construído.

**Racional:** Se o uso é consequência da implementação, a entidade foi construída para si própria, não para quem a usa — a direção de autoridade está invertida. Se o uso é documentado depois, descreve a implementação em vez de constrangê-la — a sequência de autoridade está invertida.

**Habilita / Constrange:**
- Habilita identificar, para qualquer relação entre entidades, qual das duas é a definidora.
- Constrange a definição da porta a ser feita antes da implementação, sempre.
- Constrange o critério de correção da implementação: ela satisfaz o uso esperado, não o contrário.

---

### L1 — Os Dois Eixos do Princípio

#### L1.1 — Direção: quem pensa, usa

**Decisão:** O lado que usa é sempre o lado que toma decisões; o lado que é usado é sempre o lado que executa. "Uso" nomeia essa relação em qualquer granularidade — "usuário" é reservado ao humano.

**Alternativas:** A relação de uso é determinada por conveniência técnica ou fluxo de dados; "usuário" e "lado que usa" são intercambiáveis.

**Racional:** Fluxo de dados e direção de autoridade são dimensões independentes — dados podem fluir em qualquer direção sem determinar quem manda na forma da porta. Usar "usuário" para entidades intermediárias confundiria o papel estrutural de definidor com a entidade humana que origina toda a cadeia de autoridade.

**Natureza axiomática:** A assimetria de autoridade em cada par (P1) é um **axioma** — uma escolha de modelagem, não uma descoberta empírica. UseDD escolhe modelar relações de uso como assimétricas e, quando encontra simetria aparente, a dissolve por decomposição (→ L2.1, L2.7). Reconhecer P1 como axioma não enfraquece o princípio — fortalece, porque torna a fundamentação explícita. Axiomas declarados são mais fortes do que axiomas disfarçados de observações.

**Habilita / Constrange:**
- Habilita identificar univocamente, em qualquer par de entidades, quem define a porta.
- Exige que entidades tenham nível único de responsabilidade para que a identificação seja determinística. *(→ L2.1)*
- Habilita aplicar o princípio em qualquer granularidade, do macro ao micro. *(→ L2.2)*
- Exige que cada par de entidades tenha exatamente um decisor. *(→ L2.7)*

---

#### L1.2 — Sequência: o uso precede a implementação

**Decisão:** A entidade que descreve o uso esperado é produzida antes da entidade que o satisfaz.

**Alternativas:** O uso é documentado depois, como descrição do que foi construído.

**Racional:** Documentação posterior descreve a implementação; especificação anterior constrange a implementação — são papéis opostos com consequências opostas para quem tem autoridade.

**Habilita / Constrange:**
- Constrange a entidade de uso a ser escrita em vocabulário do lado que usa, não do executor. *(→ L2.3)*
- Habilita que a implementação seja verificável: ela satisfaz ou não o que foi especificado. *(→ L2.4)*
- Constrange revisões: se a especificação se mostrar impraticável, ela é revisada explicitamente — nunca silenciosamente absorvida pela implementação. *(→ L2.4)*

---

### L2 — Consequências dos Eixos

#### L2.1 — Separação de nível de responsabilidade

**Decisão:** Entidades devem ter nível único de responsabilidade: quem decide não executa; quem executa não decide.

**Alternativas:** Permitir entidades que misturam decisão e execução.

**Racional:** L1.1 exige identificar "quem pensa" em qualquer par de entidades. Se uma entidade mistura decisão e execução, a pergunta não tem resposta determinística — e sem essa resposta, a direção da porta é arbitrária. A separação de nível de responsabilidade não é um princípio externo importado: ela deriva diretamente da necessidade de L1.1 funcionar.

**Habilita / Constrange:**
- Torna a direção da porta determinística em qualquer par.
- Consequência emergente: ambiguidade na direção da porta é diagnóstico de que a separação de níveis foi violada — UseDD funciona como verificador.

---

#### L2.2 — Uniformidade entre granularidades

**Decisão:** O princípio se aplica identicamente em todas as escalas — da relação humano/sistema até a relação entre duas entidades internas.

**Alternativas:** O princípio se aplica apenas no nível macro (produto) ou apenas no nível micro (código).

**Racional:** Um princípio que muda de forma entre escalas não é um princípio — é um conjunto de regras ad hoc com superfície em comum.

**Habilita / Constrange:**
- Constrange o vocabulário da porta a variar por escala, mas não a estrutura: o decisor define a porta, o executor a implementa. *(→ L2.3)*
- Habilita L2.5: aplicado uniformemente, garante que o humano seja a única origem de toda cadeia de autoridade.
- Habilita L2.6: aplicado uniformemente, a cadeia de autoridade é necessariamente finita e acíclica.

---

#### L2.3 — O vocabulário da porta é determinado pelo decisor

**Decisão:** A porta é expressa na linguagem em que o lado que usa consegue confirmar que a entidade executora a satisfaz.

**Alternativas:** A porta é sempre expressa no mesmo vocabulário independente da escala ou da natureza da entidade executora.

**Racional:** Uma entidade executora só está funcionando se faz o que o decisor espera — pode compilar, executar e passar testes, mas se não satisfaz a expectativa do lado que usa, não está funcionando. O vocabulário da porta precisa ser aquele em que o decisor é capaz de confirmar satisfação. Se o decisor é uma entidade de código, a porta pode ser formal (TypeScript, tipos). Se o decisor é um humano, a porta precisa ser legível por humanos — forçar formalidade onde o decisor não pode processá-la é teatro, não contrato.

**Habilita / Constrange:**
- Explica por que portas para humanos são escritas em prosa: não é preferência, é consequência de quem precisa confirmar satisfação.
- Constrange o formato da especificação à capacidade de confirmação do decisor, não à preferência do especificador.

---

#### L2.4 — A porta é o critério de correção da implementação

**Decisão:** A implementação está correta se e somente se satisfaz a porta; divergência é erro da implementação.

**Alternativas:** Divergência entre porta e implementação é resolvida atualizando a porta para refletir o que foi construído.

**Racional:** Se a porta pode ser corrigida para concordar com a implementação, a implementação tem autoridade — e o princípio foi invertido.

**Habilita / Constrange:**
- Torna a porta auditável independentemente dos testes: um teste que passa mas contradiz a porta está errado.
- Constrange a pergunta "quem testa os testes?" a ter resposta: a porta.
- Se a implementação não consegue satisfazer a porta, o fluxo obrigatório é retornar à fase de especificação e encontrar uma nova forma de atender o humano dentro das limitações do time/projeto — nunca absorver a divergência na implementação. *(→ L2.8)*

---

#### L2.5 — O humano é a única origem da cadeia de autoridade

**Decisão:** A relação de autoridade deve poder ser rastreada de qualquer entidade de volta ao humano.

**Alternativas:** A autoridade pode ter múltiplas origens — uma entidade de implementação pode ser fonte de autoridade para outra sem que essa cadeia trace de volta ao humano.

**Racional:** Se existe uma entidade cuja forma é determinada por outra entidade executora sem que essa segunda trace sua própria autoridade de volta ao humano, existe um galho na cadeia onde a ponta é a implementação — o princípio foi violado nesse galho.

**Habilita / Constrange:**
- Constrange qualquer decisão de design a ser verificável: para toda porta definida no sistema, existe um caminho de autoridade que leva ao humano.
- Torna a pergunta "para quem esta entidade existe?" sempre respondível — e a resposta correta sempre traça de volta ao humano.
- Habilita L2.8: combinado com L2.4, o humano é o critério último de correção.

---

#### L2.6 — A cadeia de autoridade é finita e acíclica

**Decisão:** A cadeia de autoridade tem um número finito de elos e não contém ciclos.

**Alternativas:** A cadeia pode ter ciclos (A define a porta de B e B define a porta de A) ou regressão infinita.

**Racional:** L1.1 estabelece que em cada par, um lado pensa e o outro executa — uma relação assimétrica que exclui ciclos por construção. L2.2 garante que essa regra vale em todas as granularidades, o que exclui ciclos "indiretos" (A→B→C→A). L2.5 garante que a cadeia termina no humano, o que exclui regressão infinita. Dependências mútuas entre entidades indicam que a separação de níveis (L2.1) foi violada.

**Nota:** L2.6 é um teorema derivável de L1.1 + L2.1 + L2.2 + L2.5, não um axioma independente. Sua presença como nó explícito é pedagógica: torna o resultado acessível sem exigir que o leitor reconstrua a derivação.

**Habilita / Constrange:**
- Torna dependências mútuas entre entidades um diagnóstico de violação arquitetural.
- Garante que toda cadeia de autoridade tem exatamente uma raiz (o humano) e nenhum ciclo.

---

#### L2.7 — Decisor único por par

**Decisão:** Em qualquer par de entidades, exatamente uma é o decisor e a outra é o executor.

**Alternativas:** Ambas as entidades podem tomar decisões em dimensões diferentes, com a direção de autoridade variando por dimensão.

**Racional:** L1.1 requer uma resposta determinística para "quem pensa neste par". Se ambos os lados decidem em dimensões diferentes, a resposta depende de qual dimensão se examina — a direção da porta torna-se ambígua. L2.1 exige nível único de responsabilidade precisamente para evitar isso. Se na prática duas entidades parecem ter autoridade mútua em dimensões diferentes, L2.1 foi violado: as dimensões devem ser separadas em entidades distintas até que cada par tenha um decisor único.

**Nota:** L2.7 é um teorema derivável de L1.1 + L2.1, não um axioma independente. Sua presença como nó explícito é pedagógica.

**Habilita / Constrange:**
- Torna pares com autoridade mista um diagnóstico de violação de L2.1.
- Constrange o design a separar dimensões de decisão em entidades distintas, nunca a resolver ambiguidade aceitando autoridade bidirecional.

---

#### L2.8 — O humano é o critério último de correção

**Decisão:** Toda divergência entre especificação e implementação deve ser resolvida em favor do humano.

**Alternativas:** Divergência pode ser resolvida em favor da implementação quando constrangimentos técnicos a tornam impraticável, ou em favor de equilíbrio entre necessidades humanas e técnicas.

**Racional:** L2.4 estabelece que a porta é o critério de correção. L2.5 estabelece que toda autoridade traça de volta ao humano. Juntos, implicam que o humano — não o código, não os testes, não as limitações técnicas — é o critério último. Quando a implementação não consegue satisfazer a porta, o fluxo correto é retornar à fase de especificação e encontrar uma nova forma de atender o humano dentro das limitações existentes. "Pensar em uma forma diferente de agradar o humano" — nunca "nisto, vamos agradar o código".

**Habilita / Constrange:**
- Fecha a cadeia de autoridade: o humano é origem (L2.5) e destino (L2.8) de toda decisão de design.
- Torna "a quem esta entidade serve?" a pergunta última de qualquer revisão — e a resposta é sempre o humano.

---

#### L2.9 — Os dois humanos e sua prioridade

**Decisão:** Os humanos que "usam" diretamente o sistema são exatamente dois: o **usuário do produto** (runtime) e o **desenvolvedor** (build-time). Entre eles não há hierarquia de importância, mas há prioridade de sequência: a porta do usuário do produto precede a porta do desenvolvedor.

**Alternativas:** "O humano" é tratado como entidade singular sem distinção; ou a hierarquia entre humanos é de importância (um "vale mais" que o outro).

**Racional:** O usuário do produto interage em runtime, dando input e recebendo outputs computados. O desenvolvedor interage em build-time, escrevendo código novo que usa o existente e dando manutenção no código existente. Esses são os únicos dois tipos de interação que podem ser chamados de "uso" direto. Todos os demais papéis são mediados: PMs são proxies do usuário do produto; a empresa é mediada por ambos. A prioridade de sequência — não de valor — é consequência direta de L1.2: a porta do usuário do produto é especificada primeiro porque o produto existe para ele; a porta do desenvolvedor é especificada depois porque o código existe para implementar aquela porta. A relação é de sequência lógica, não de hierarquia.

**Habilita / Constrange:**
- Fecha a questão "qual humano?" sem introduzir conceitos novos — a resposta é derivável do framework.
- Constrange a ordem de especificação: porta do usuário do produto primeiro, porta do desenvolvedor depois. *(→ L3)*
- Impede que "priorizar o humano" seja confundido com "priorizar o usuário final em detrimento do desenvolvedor" — ambos são humanos com autoridade legítima.

---

#### L2.10 — Fronteira da cadeia com infraestrutura

**Decisão:** Entidades cuja forma não é determinada por relações de uso específicas do produto não participam da cadeia de autoridade. Suas portas são definidas pelo humano desenvolvedor diretamente.

**Alternativas:** Toda entidade no codebase pertence à cadeia de autoridade e precisa de uma entidade-decisora.

**Racional:** Utils/helpers internos e APIs externas (browser, runtime) são usados transversalmente, sem que nenhuma entidade individual do produto defina sua porta. Forçá-los na cadeia criaria decisores artificiais. A solução é reconhecer que essas entidades ocupam a mesma posição estrutural que infraestrutura externa: existem independentemente do produto, e seus consumidores as usam tal como são.

**Critério operacional:** Se a forma da entidade só faz sentido no contexto de uma entidade específica do produto, ela pertence à cadeia. Se faz sentido independentemente de qualquer entidade, é infraestrutura.

**Ponto de atenção:** A fronteira é dinâmica. Se um util começa a ter sua forma ditada por uma entidade específica, ele deixou de ser infraestrutura e entrou na cadeia — e nesse momento, precisa de um decisor único.

**Habilita / Constrange:**
- Mantém a regra de decisor único intacta: dentro da cadeia, cada par tem exatamente um decisor; fora da cadeia, a infraestrutura tem suas portas definidas pelo humano desenvolvedor.
- Impede que entidades transversais sejam tratadas como exceções ao princípio — não são exceções, estão fora do escopo da cadeia.

---

### L3 — Prática de Especificação

> UseDD implica uma sequência de trabalho. L1.2 (sequência), L2.3 (vocabulário da porta), L2.4 (porta como critério) e L2.9 (os dois humanos e sua prioridade) não são apenas restrições abstratas — juntos, determinam uma ordem de produção. Este nível explicita essa ordem.

#### L3.1 — A sequência de especificação

1. **Porta do usuário do produto.** A primeira porta tem forma para o humano que usará o produto em runtime. É escrita em vocabulário de comportamento observável — estados, transições, invariantes, edge cases — sem referência a como é construído. O humano (ou seu proxy) pode lê-la e confirmar se o que observa corresponde ao descrito. *(Consequência de L2.3 + L2.9)*

2. **Identificação da entidade raiz.** De acordo com o padrão de design e arquitetura do projeto, identifica-se qual entidade espelha essa porta em regras de negócio. A entidade não é inventada pela porta — ela é determinada pela arquitetura do projeto.

3. **Porta do desenvolvedor.** A segunda porta tem forma para o humano que consumirá a entidade em código. Descreve a superfície pública — modos de uso, contratos, responsabilidades do consumidor — em vocabulário técnico, organizado por *uso*, não por estrutura interna. *(Consequência de L2.3 + L2.9)*

4. **TDD com as duas portas como base.** A primeira porta fornece *o que* testar (comportamentos esperados). A segunda fornece *como* exercitar (a interface pública pela qual os testes interagem com a entidade). Juntas, são suficientes para escrever testes antes da implementação. UseDD não reivindica fundação sobre TDD — recomenda-o como prática de execução compatível com as portas que produz.

5. **Entidades subsequentes.** Para cada entidade seguinte na cadeia, sua porta é definida pela entidade-decisora que a usará. Com essa porta e um stub do decisor, TDD é aplicável na mesma lógica. *(Consequência de L1.1)*

6. **Portas não são documentação.** A distinção é temporal e funcional: portas precedem e constrangem a implementação; documentação descreve o que já existe. Mas como a implementação é obrigada a satisfazer a porta (L2.4), a porta permanece verdadeira após a implementação — e portanto serve como referência para quem for consumir a entidade. Não há necessidade de um documento separado. *(Consequência de L1.2 + L2.4)*

#### L3.2 — Relação entre as duas portas

A primeira porta é o critério de **correção** — a entidade está certa se faz o que ela descreve. A segunda porta é o critério de **consumo** — a entidade é usada como ela descreve. As duas não se contradizem porque a segunda é constrangida pela primeira: a interface expõe os controles necessários para que os comportamentos da primeira porta sejam realizáveis pelo consumidor. A primeira responde "o que faz?"; a segunda responde "como uso?".

#### L3.3 — A sequência espelha a cadeia de autoridade

Humano usuário → porta comportamental → entidade raiz → porta de interface → implementação → entidades internas → suas portas → suas implementações. Cada passo é uma relação decisor→executor, e a ordem de produção segue a ordem de autoridade.
