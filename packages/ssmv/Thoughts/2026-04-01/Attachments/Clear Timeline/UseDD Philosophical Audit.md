# UseDD — Auditoria Filosófica do "Porquê"

> Revisão analítica da fundamentação de Use Driven Design: razão de existir, premissas, lógica interna, interação com o meio, e aplicação prática.

---

## §1 — A Razão de Existir

UseDD faz uma afirmação descritiva e uma normativa:

- **Descritiva:** A inversão de autoridade (implementação dita a forma; o humano se adapta) foi normalizada na prática de software.
- **Normativa:** Essa inversão é um erro — e deve ser corrigida sistematicamente.

A afirmação descritiva é verificável e bem sustentada pelo exemplo do PM/dev no Explanation.md: o custo social de defender o humano é maior que o custo de ceder à implementação. Isso é evidência de normalização, não de correção.

A afirmação normativa, porém, precisa de uma premissa que a sustente. UseDD a fornece implicitamente:

> **Premissa fundacional (P0):** Software é um artefato cuja razão de existir é servir um humano.

Essa premissa é analítica — está contida na definição de "artefato". Um artefato sem usuário final humano não é software; é um processo natural ou um acidente. P0 não é controversa, mas precisa ser explicitada porque toda a cadeia normativa depende dela.

**Observação:** P0 é mais forte do que parece. Ela não diz "software deveria servir humanos" (ought). Ela diz "software que não serve humanos não é software no sentido relevante" (is). A normatividade de UseDD não vem de um dever moral externo — vem da definição do objeto. Isso evita a falácia is-ought de maneira elegante: não é "humanos devem mandar" mas "se ninguém manda, o artefato não tem razão de existir, logo não é um artefato".

---

## §2 — As Premissas

Além de P0, UseDD opera com premissas que podem ser reconstruídas:

**P1 — Autoridade é direcional.** Em qualquer relação de uso, exatamente um lado define a forma e o outro a satisfaz. Não existe uso simétrico.

**P2 — Autoridade é transitiva.** Se A define a porta de B, e B define a porta de C, então a autoridade de A alcança C — ainda que indiretamente.

**P3 — A cadeia de autoridade é finita.** Não existe regressão infinita de decisores.

**P4 — A especificação precede a implementação.** A descrição do uso é produzida antes da entidade que o satisfaz.

### Avaliação das premissas

**P1** é a mais forte e a mais vulnerável. UseDD reconhece isso e dedica L2.7 a defendê-la. A defesa é: se duas entidades parecem ter autoridade mútua em dimensões diferentes, a solução é separar as dimensões em entidades distintas. Isso é logicamente válido, mas tem um custo: P1 não é uma descoberta sobre o mundo — é uma **decisão de modelagem**. UseDD escolhe modelar relações de uso como assimétricas e, quando encontra simetria aparente, a dissolve por decomposição. Isso não é uma fraqueza — é uma escolha consciente de framework. Mas deve ser reconhecida como tal: P1 é um axioma, não um teorema.

**P2** é derivável de P1 + P0: se cada elo da cadeia tem um decisor, e a cadeia termina no humano (por P0 + P3), então a autoridade é transitiva por construção. P2 não é uma premissa independente — é uma consequência.

**P3** é sustentada por P1 (assimetria exclui ciclos) e P0 (o humano é a raiz, logo a cadeia é finita). P3 também não é independente.

**P4** é genuinamente independente. UseDD poderia funcionar com direção correta (P1) mas sem exigência de sequência temporal. P4 adiciona uma restrição operacional: não basta que o decisor tenha autoridade — ele deve exercê-la antes que o executor comece. A justificativa é pragmática: sem P4, a especificação degenera em documentação post-hoc, que descreve em vez de constranger. Essa justificativa é sólida, mas P4 é o ponto onde UseDD passa de meta-princípio a método. Isso não é um problema — é uma fronteira que vale explicitar.

**Resumo:** UseDD tem duas premissas genuinamente independentes (P0 e P1), uma premissa operacional (P4), e duas consequências que se apresentam como premissas (P2 e P3). A estrutura lógica é mais enxuta do que parece.

---

## §3 — Lógica Interna

A Design Tree apresenta uma estrutura de nós onde nós-pai habilitam ou constrangem nós-filho. A questão é: essa estrutura é logicamente consistente?

### 3.1 — Teste de circularidade

O risco mais comum em sistemas axiomáticos é circularidade: A justifica B, B justifica A.

Mapeando as dependências:
- L1.1 (direção) → exige L2.1 (separação de nível) e habilita L2.2 (uniformidade)
- L1.2 (sequência) → constrange L2.3 (vocabulário) e habilita L2.4 (spec como critério)
- L2.1 + L2.2 → habilitam L2.5 (humano como origem) e L2.6 (finitude)
- L2.4 + L2.5 → habilitam L2.8 (humano como critério último)
- L2.7 (decisor único) ← derivado de L1.1 + L2.1

**Resultado:** Não há circularidade. O grafo de dependências é um DAG (directed acyclic graph) com duas raízes (L1.1 e L1.2) e um sumidouro (L2.8). A estrutura é limpa.

### 3.2 — Teste de redundância

L2.6 (cadeia finita e acíclica) é derivável de L1.1 + L2.1 + L2.2 + L2.5. O documento reconhece isso no próprio racional. L2.6 é um teorema, não um axioma. Mantê-lo como nó explícito é uma escolha pedagógica, não lógica. Isso é aceitável desde que não se confunda com axioma.

L2.7 (decisor único por par) é igualmente derivável de L1.1 + L2.1. Mesmo caso.

### 3.3 — Teste de completude

A pergunta aqui é: existem consequências importantes de P0 + P1 + P4 que o sistema não captura?

**Lacuna identificada: Conflito entre humanos.** P0 diz que a cadeia termina no humano. Mas qual humano? Em qualquer sistema real, múltiplos humanos têm autoridade sobre diferentes aspectos. UseDD trata "o humano" como uma entidade singular. Isso funciona como princípio (a cadeia tem uma raiz humana), mas não resolve o problema prático de conflitos entre humanos com autoridade legítima sobre o mesmo artefato.

Essa não é uma falha lógica — é uma **fronteira de escopo**. UseDD governa a relação entre entidades na cadeia; a resolução de conflitos entre raízes é um problema de governança, não de arquitetura. Mas vale explicitar essa fronteira: UseDD assume que "o humano" na raiz da cadeia já fez suas escolhas. O princípio começa onde a decisão humana termina.

**Lacuna identificada: Entidades que servem múltiplos decisores.** Um módulo pode ser usado por dois decisores diferentes com expectativas diferentes. UseDD implica que cada relação de uso tem sua própria porta — logo, o módulo tem duas portas, não uma. Isso é consistente com o framework, mas o documento não o torna explícito. Na prática, isso significa que a "forma" de uma entidade é a união de todas as portas que ela serve, e cada porta é definida pelo seu respectivo decisor. Isso é logicamente sólido, mas merece um nó ou uma observação na Design Tree.

---

## §4 — Interação com o Meio

UseDD não existe no vácuo. Ele interage com práticas estabelecidas e precisa ser avaliado nesse contexto.

### 4.1 — Relação com TDD, API-first, DIP

O Explanation.md antecipa a objeção: "UseDD é só TDD + API-first + DIP com outro nome."

A resposta é precisa: UseDD não é a soma dessas práticas — é o princípio que explica **por que** elas existem e **quando** elas falham. TDD pode ser praticado com testes que validam implementação em vez de uso (testes frágeis). API-first pode ser praticado com APIs definidas pelo implementador em vez do consumidor. DIP pode ser aplicado mecanicamente (invertendo dependências sem inverter autoridade). Em cada caso, a prática existe mas o princípio está ausente.

UseDD funciona como **critério de avaliação** dessas práticas: uma instância de TDD/API-first/DIP que não satisfaz UseDD está usando a forma sem o conteúdo.

### 4.2 — O argumento da impraticabilidade

O Explanation.md trata bem: restrições reais não invalidam UseDD porque UseDD não ignora restrições — ele constrange a **resposta** a restrições. A resposta correta a "não conseguimos implementar a spec" não é "mudamos a spec para refletir o que conseguimos", mas "dentro dessa limitação, qual a melhor forma de servir o humano?".

Isso é filosoficamente sólido. A distinção é entre:
- **Revisão da spec por impossibilidade:** legítima — a spec é atualizada com a mesma autoridade que a criou (o decisor).
- **Absorção da divergência pela implementação:** ilegítima — a implementação usurpa autoridade que não tem.

A fronteira entre as duas é: **quem decide?** Se o decisor revisa a spec, UseDD está sendo seguido. Se a implementação silenciosamente diverge, UseDD foi violado. Esse critério é claro e operacional.

### 4.3 — O argumento da empatia (DX)

O Explanation.md faz um movimento inteligente: lembra que desenvolvedores são humanos também. Quando um dev consome uma API, ele é o humano na raiz daquela cadeia de autoridade. UseDD não é altruísmo em direção ao "usuário final" — é auto-interesse racional de qualquer humano que consome software.

Esse argumento é forte porque dissolve a dicotomia aparente entre "servir o usuário" e "servir o desenvolvedor". Em UseDD, não há dicotomia: cada relação de uso tem seu próprio humano, e cada humano merece que sua cadeia de autoridade seja respeitada.

---

## §5 — Pontos que Merecem Refinamento

### 5.1 — Explicitar P0

A premissa fundacional ("software é um artefato para humanos") está implícita. Torná-la explícita na Design Tree — como um nó acima do Nó Raiz, ou como uma premissa declarada — fortaleceria a fundamentação. Sem P0 explícita, o Nó Raiz ("quem usa define a forma") parece ser o ponto de partida, mas ele já pressupõe que existe um "quem usa" que importa. P0 é o que faz esse "quem usa" importar.

### 5.2 — Explicitar a fronteira com governança

UseDD assume uma raiz humana singular. Em sistemas com múltiplos stakeholders, a definição de quem é "o humano" em cada cadeia é um problema de governança que UseDD não resolve — e não precisa resolver, desde que reconheça essa fronteira. Uma nota na Design Tree esclarecendo que "o humano" é o papel, não a pessoa, e que a resolução de conflitos entre humanos é anterior a UseDD, evitaria objeções que confundem o princípio com teoria de gestão.

### 5.3 — Portas múltiplas

Uma entidade que serve dois decisores tem duas portas. Isso é consistente com o framework mas não está explicitado. Explicitar evitaria a objeção: "e se dois consumidores querem coisas diferentes?" — a resposta é: cada um define sua porta, e a entidade deve satisfazer ambas.

### 5.4 — A natureza de P1

P1 (assimetria de autoridade) é um axioma, não um teorema. O documento a apresenta como consequência natural, mas ela é uma **escolha de modelagem**. Reconhecer isso não enfraquece UseDD — fortalece, porque torna a fundamentação honesta. Axiomas explícitos são mais fortes do que axiomas disfarçados de observações.

---

## §6 — Veredito

**Razão de existir:** Sólida. A normalização da inversão de autoridade é observável e documentada. UseDD oferece um framework para diagnosticá-la e corrigi-la.

**Premissas:** Duas premissas genuínas (P0, P1), uma operacional (P4), e duas consequências (P2, P3). Estrutura mais enxuta do que aparenta. P0 precisa ser explicitada; P1 precisa ser reconhecida como axioma.

**Lógica interna:** Consistente. DAG sem ciclos, sem contradições. Dois nós (L2.6, L2.7) são teoremas apresentados como axiomas — aceitável pedagogicamente, mas vale anotar.

**Interação com o meio:** Bem posicionada. UseDD não compete com TDD/API-first/DIP — funciona como critério de avaliação. O tratamento de restrições práticas e o argumento da DX são filosoficamente sólidos.

**Lacunas:** Fronteira com governança (múltiplos humanos) e portas múltiplas (múltiplos decisores) não são falhas — são fronteiras de escopo que merecem ser explicitadas.

**Conclusão:** UseDD é logicamente válido em toda sua extensão. As melhorias sugeridas são de explicitação, não de correção.


---

## §7 — Revisão do Autor

### 7.1 — Sobre "Lacuna identificada: Conflito entre humanos"

**Autor:** Os humanos são os que interagem diretamente com o sistema, e eles são dois (o usuário do produto e o desenvolvedor do produto), esses são os que interagem com o sistema de forma que pode ser chamada de "uso". Usuários interagem em runtime, dando input e recebendo outputs computados. Desenvolvedores interagem em build, escrevendo código novo que usa o existente e dando manutenção no código existente. Product Managers são proxies do usuário final. A empresa dona do produto não interage com ele diretamente: a interação de desenvolvimento passa pelos desenvolvedores e a relação comercial passa pelo usuário final. E entre esses dois humanos que "usam diretamente", eles não têm hierarquia de importância, mas têm de prioridade (a spec da porta do usuário é feita antes da spec da porta do desenvolvedor).

**Avaliação:** Fecha a lacuna. O movimento é preciso em três pontos:

1. **Enumeração fechada.** "Quais humanos?" deixa de ser uma questão aberta — são exatamente dois, identificáveis pelo tipo de interação (runtime vs. build-time). Isso elimina a regressão que a versão anterior deixava em aberto ("múltiplos stakeholders").

2. **Eliminação de intermediários.** PMs como proxies e empresa como entidade mediada não são novas raízes de autoridade — são canais. Isso é consistente com L2.5: a cadeia traça de volta ao humano que *usa*, não ao humano que *gerencia*.

3. **Prioridade sem hierarquia.** A distinção entre hierarquia de importância e prioridade de sequência é filosoficamente relevante. Hierarquia implicaria que o usuário "vale mais" que o desenvolvedor — uma afirmação normativa que UseDD não precisa fazer. Prioridade de sequência é uma consequência estrutural de L1.2: a porta do usuário é especificada primeiro porque o produto existe para o usuário; a porta do desenvolvedor é especificada depois porque o código existe para implementar aquela porta. Não é que o desenvolvedor importa menos — é que sua porta é constrangida pela do usuário, assim como a implementação é constrangida pela spec. A relação é de sequência lógica, não de valor.

**Recomendação:** Esse esclarecimento merece um nó na Design Tree, possivelmente como L2.9 ou como observação em L2.5, porque responde a uma objeção previsível e a resposta é derivável do framework existente.

---

### 7.2 — Sobre "Lacuna identificada: Entidades que servem múltiplos decisores"

**Autor:** O caso mais provável é o de utils/helpers que são reutilizados em vários módulos. Não há como eles satisfazerem várias portas diferentes. A saída para não torná-los exceções à regra da forma das portas é colocá-los para fora da cadeia, junto da infraestrutura externa (como a API do browser). E submeter suas portas só ao uso pelo humano desenvolvedor, não ao uso de um módulo decisor específico.

**Avaliação:** Fecha a lacuna. O argumento opera por reclassificação — e a reclassificação é legítima:

1. **Critério de pertencimento à cadeia.** A cadeia de autoridade governa entidades cuja forma é determinada por relações de uso *específicas do produto*. Utils/helpers não têm essa especificidade — são usados transversalmente, sem que nenhum módulo individual defina sua porta. Portanto, não pertencem à cadeia.

2. **Analogia com infraestrutura externa.** A API do browser não participa da cadeia de autoridade de um produto — ela existe independentemente dele, e seus consumidores a usam tal como ela é. Utils internas ocupam a mesma posição estrutural: são infraestrutura cujas portas são definidas pelo desenvolvedor-enquanto-humano, não por um módulo-enquanto-decisor.

3. **A regra se mantém intacta.** Dentro da cadeia, cada par tem exatamente um decisor. Fora da cadeia, a infraestrutura tem suas portas definidas pelo humano desenvolvedor diretamente. Não há exceção — há uma fronteira entre o que está dentro e o que está fora da cadeia.

**Um ponto de atenção:** a fronteira entre "infraestrutura interna" e "módulo do produto" precisa ser nítida na prática. Se um util começa a ter sua forma ditada por um módulo específico, ele deixou de ser infraestrutura e entrou na cadeia — e nesse momento, precisa de um decisor único. O critério operacional seria: se a forma da entidade só faz sentido no contexto de um módulo específico, ela pertence à cadeia; se faz sentido independentemente de qualquer módulo, é infraestrutura.

---

### 7.3 — Sobre "§4.1 — Relação com TDD, API-first, DIP"

**Autor:** Em "é o princípio que explica **por que** elas existem" há uma mentira. Não há essa vinculação, nem precedente temporal. O autor não tenta revelar um "porquê" implícito que existe em princípios de outros autores, além de que o máximo que acertaria seria a preocupação com o humano desenvolvedor (são princípios de engenharia de software, não de design de produto).

**Avaliação:** Correção aceita. O erro é duplo:

1. **Erro de atribuição causal.** Afirmar que UseDD explica "por que" TDD/API-first/DIP existem é uma afirmação histórica falsa. Essas práticas têm genealogias próprias (Kent Beck, Alistair Cockburn, Robert Martin) e motivações que não passam por UseDD. Atribuir-lhes uma fundamentação que seus autores não formularam é projeção retroativa, não análise.

2. **Erro de escopo.** TDD, API-first e DIP são princípios de engenharia de software. Sua preocupação é com o humano *desenvolvedor* — código testável, APIs consumíveis, dependências gerenciáveis. Elas não formulam nenhuma afirmação sobre o humano *usuário do produto*. UseDD, ao contrário, abrange ambos os humanos. A sobreposição existe apenas na dimensão do desenvolvedor, e é parcial.

**O que §4.1 deveria dizer:** UseDD não explica por que essas práticas existem. UseDD e essas práticas compartilham superfície na dimensão do desenvolvedor, mas a contribuição distintiva de UseDD — a cadeia de autoridade contínua do usuário final ao código — é algo que nenhuma delas formula. UseDD pode funcionar como critério de avaliação de instâncias dessas práticas (diagnosticando quando a forma foi seguida mas a direção de autoridade foi invertida), mas isso é uso como ferramenta analítica, não reivindicação de fundação.

---

## §8 — Refinamentos (revisado)

> Versão revisada de §5, incorporando as resoluções de §7.

### 8.1 — Explicitar P0

A premissa fundacional ("software é um artefato para humanos") está implícita. Torná-la explícita na Design Tree — como um nó acima do Nó Raiz, ou como uma premissa declarada — fortaleceria a fundamentação. Sem P0 explícita, o Nó Raiz ("quem usa define a forma") parece ser o ponto de partida, mas ele já pressupõe que existe um "quem usa" que importa. P0 é o que faz esse "quem usa" importar.

### 8.2 — A natureza de P1

P1 (assimetria de autoridade) é um axioma, não um teorema. O documento a apresenta como consequência natural, mas ela é uma **escolha de modelagem**. Reconhecer isso não enfraquece UseDD — fortalece, porque torna a fundamentação honesta. Axiomas explícitos são mais fortes do que axiomas disfarçados de observações.

### 8.3 — Os dois humanos

A Design Tree deve explicitar que os humanos que "usam" diretamente o sistema são exatamente dois: o **usuário do produto** (runtime) e o **desenvolvedor** (build-time). Todos os demais papéis são mediados (PMs são proxies do usuário; a empresa é mediada por ambos). Entre os dois não há hierarquia de importância, mas há prioridade de sequência: a spec da porta do usuário precede a da porta do desenvolvedor — consequência direta de L1.2. Esse esclarecimento previne a objeção "qual humano?" sem introduzir nenhum conceito novo.

### 8.4 — Infraestrutura dentro e fora da cadeia

A Design Tree deve explicitar a fronteira entre entidades que pertencem à cadeia de autoridade e entidades que são infraestrutura. Utils/helpers internos e APIs externas (browser, runtime) não participam da cadeia — suas portas são definidas pelo humano desenvolvedor diretamente, não por um módulo-decisor. O critério operacional: se a forma da entidade só faz sentido no contexto de um módulo específico do produto, ela pertence à cadeia; se faz sentido independentemente de qualquer módulo, é infraestrutura.

### 8.5 — Corrigir §4.1 (relação com TDD/API-first/DIP)

A formulação atual ("é o princípio que explica por que elas existem") é falsa. UseDD não tem precedência causal nem temporal sobre essas práticas. A formulação correta: UseDD compartilha superfície com elas na dimensão do desenvolvedor, mas sua contribuição distintiva — a cadeia de autoridade contínua do usuário final ao código — é exclusiva. UseDD pode servir como critério de avaliação de instâncias dessas práticas, mas não como sua fundação.

---

## §9 — Veredito (revisado)

> Versão revisada de §6, incorporando as resoluções de §7.

**Razão de existir:** Sólida. A normalização da inversão de autoridade é observável e documentada. UseDD oferece um framework para diagnosticá-la e corrigi-la.

**Premissas:** Duas premissas genuínas (P0, P1), uma operacional (P4), e duas consequências que se apresentam como premissas (P2, P3). Estrutura mais enxuta do que aparenta. P0 precisa ser explicitada; P1 precisa ser reconhecida como axioma.

**Lógica interna:** Consistente. DAG sem ciclos, sem contradições. Dois nós (L2.6, L2.7) são teoremas apresentados como axiomas — aceitável pedagogicamente, mas vale anotar. As questões inicialmente identificadas como lacunas — "múltiplos humanos" e "múltiplos decisores" — foram resolvidas dentro do próprio framework (§7.1 e §7.2), confirmando que o sistema é mais completo do que a primeira análise sugeriu.

**Interação com o meio:** UseDD não compete com TDD/API-first/DIP e não pretende explicar por que existem. Compartilha superfície na dimensão do desenvolvedor, mas sua contribuição distintiva — a cadeia de autoridade contínua do usuário final ao código — é exclusiva. O tratamento de restrições práticas e o argumento da DX são filosoficamente sólidos.

**Conclusão:** UseDD é logicamente válido em toda sua extensão. Não foram encontradas lacunas lógicas — as duas questões levantadas no teste de completude (§3.3) são resolvíveis internamente. As melhorias pendentes são de explicitação (P0, natureza axiomática de P1, os dois humanos, fronteira da cadeia com infraestrutura) e de correção factual (§4.1), não de revisão lógica.


---

## §10 — De Meta-Princípio a Princípio: A Prática de Especificação

**Autor:** UseDD já está cruzando o escopo de "meta" ao ter consigo práticas. Vamos assumir o novo escopo de princípio (sem "meta") e agregar a seguinte prática:

1. Tudo começa com o primeiro spec — o que tem sua forma definida pelo humano usuário do produto.
2. De acordo com o padrão de design e arquitetura do projeto, sabe-se qual será o módulo que espelha essa spec em regras de negócio.
3. Então é feita a segunda spec, com forma para o humano desenvolvedor. Essa será a interface pública desse módulo.
4. UseDD recomenda que agora seja adotado TDD para a execução da implementação desse módulo. As duas specs são suficientes para escrever testes.
5. Para os módulos que vêm em seguida na cadeia, é feita a interface deles, com forma ditada pelo módulo decisor que os usará e, com essa interface mais um stub do decisor, é possível aplicar TDD.
6. Essas interfaces/specs são specs e não documentação — no sentido temporal e na responsabilidade de constranger a implementação. Mas como a implementação irá respeitá-las, não haverá necessidade de um documento novo no final: a spec já serve para quem for usar saber o que faz e como é usado.

### Avaliação

A transição de meta-princípio a princípio é justificada. UseDD já contém P4 (a especificação precede a implementação), L2.3 (vocabulário da porta determinado pelo decisor) e L2.4 (a spec é o critério de correção). Esses nós não são apenas restrições abstratas — eles implicam uma sequência de trabalho. Explicitar essa sequência é tornar operacional o que já estava latente, não expandir o escopo indevidamente.

A prática proposta é consistente com o framework em seis pontos:

1. **A primeira spec tem forma para o humano usuário.** Consequência direta de L2.3 + §7.1: a porta do usuário é especificada primeiro (prioridade de sequência), em vocabulário que o usuário (ou seu proxy) pode confirmar. Essa spec descreve *o que o sistema faz* em termos de comportamento observável — estados, transições, invariantes, edge cases — sem referência a como é construído.

2. **A segunda spec tem forma para o humano desenvolvedor.** Consequência de L2.3 aplicado ao segundo humano: o desenvolvedor que vai consumir o módulo precisa de uma porta em vocabulário técnico — a interface pública. Essa spec descreve *como o módulo é usado* — superfície pública, modos de uso, contratos, responsabilidades do consumidor — sem ditar a estrutura interna.

3. **TDD é adotado com as duas specs como base.** A primeira spec fornece *o que* testar (comportamentos esperados). A segunda spec fornece *como* exercitar (a interface pública pela qual os testes interagem com o módulo). Juntas, são suficientes para escrever testes antes da implementação. UseDD não reivindica fundação sobre TDD (cf. §7.3) — ele recomenda TDD como prática de execução, sabendo que as specs que UseDD produz são compatíveis com o que TDD consome.

4. **Módulos subsequentes têm suas portas ditadas pelo módulo decisor.** Consequência de L1.1: o módulo que usa define a forma do que é usado. A interface de um módulo interno não é autodeterminada — é constrangida pela necessidade do decisor que o consumirá. Com essa interface definida e um stub do decisor, TDD é aplicável na mesma lógica.

5. **Specs são specs, não documentação.** A distinção é temporal e funcional (L1.2 + L2.4): specs precedem e constrangem a implementação; documentação descreve o que já existe. Mas como a implementação é obrigada a satisfazer a spec (L2.4), a spec permanece verdadeira após a implementação — e portanto serve como referência para quem for consumir o módulo. Não há necessidade de um documento separado porque a spec nunca foi "superada" pela implementação. Ela continua sendo a autoridade.

6. **A sequência espelha a cadeia de autoridade.** Humano usuário → spec comportamental → módulo raiz → spec de interface → implementação → módulos internos → suas interfaces → suas implementações. Cada passo é uma relação decisor→executor, e a ordem de produção segue a ordem de autoridade. Não é um acidente — é UseDD aplicado como sequência de trabalho.

### As duas specs no Attention Requester (descrição agnóstica)

Os docs existentes em `attention-requester/docs/` exemplificam as duas primeiras specs da prática:

**Spec 1 — Behavioral Specification** (porta para o humano usuário do produto)

Descreve o que o sistema faz do ponto de vista de quem observa seu comportamento, sem nenhuma referência a como é construído.

O vocabulário é o do comportamento observável: "o componente está animando", "o ciclo termina", "a animação congela". Nenhum nome de classe, método, tipo ou tecnologia aparece. O humano (ou seu proxy) pode ler essa spec e confirmar se o que vê corresponde ao que está descrito.

**Spec 2 — Interface** (porta para o humano desenvolvedor)

Descreve como o módulo é usado do ponto de vista de quem vai consumi-lo em código.

O vocabulário é técnico: tipos, assinaturas, snippets de código. Mas a organização é por *uso*, não por *estrutura interna*. O desenvolvedor não precisa saber como o módulo funciona por dentro — só como usá-lo. A spec contém a declaração explícita de que se a implementação diverge do documento, a implementação está errada (L2.4 operacionalizado).

### Relação entre as duas specs

A primeira spec é o critério de *correção* — o módulo está certo se faz o que ela descreve. A segunda spec é o critério de *consumo* — o módulo é usado como ela descreve. As duas não se contradizem porque a segunda é constrangida pela primeira: a interface expõe os controles necessários para que os comportamentos da primeira spec sejam realizáveis pelo consumidor. A primeira responde "o que faz?"; a segunda responde "como uso?".


---

## §11 — Conflito entre "spec" e "porta", tensão entre "entidade" e "módulo"

**Autor:** Na nova versão da árvore há um conflito entre "spec" e "porta", e uma tensão entre "entidade" e "módulo". Devem ser resolvidos.

### 11.1 — Conflito: spec vs. porta

**Avaliação:** O conflito é real e estrutural, não cosmético.

O glossário define **porta** como "o contrato que define como uma entidade é usada" e **spec** como "especificação que precede e constrange a implementação". A sobreposição é evidente: ambas descrevem "o que o decisor espera do executor". Mas são a mesma coisa?

Não. A distinção é de nível:

- **Porta** é o conceito abstrato — a relação de contrato entre decisor e executor. Toda relação de uso tem uma porta, mesmo que ninguém a tenha escrito num documento. A porta existe como relação estrutural.
- **Spec** é a materialização da porta — o artefato concreto (documento, arquivo de tipos, interface) que captura a porta antes da implementação. A spec é o que L1.2 exige: a porta tornada explícita e anterior.

O problema na árvore é que essa distinção não está feita. "Porta" aparece em L1–L2 como o conceito central. "Spec" aparece em L3 como se fosse um conceito novo. Mas L3 não introduz nada novo — ele operacionaliza a porta. A spec *é* a porta materializada. Sem essa ligação explícita, o leitor tem dois vocabulários para o que parece ser a mesma coisa, e não sabe qual usar quando.

**Resolução:** A porta é o conceito; a spec é sua materialização. O glossário deve tornar essa relação explícita: a entrada de "porta" deve mencionar que quando a porta é materializada como artefato concreto (documento, interface, tipo), ela é chamada de spec. A entrada de "spec" deve mencionar que toda spec é a materialização de uma porta. L3 passa a ser lido como "a prática de materializar portas", não como uma camada nova.

Consequência adicional: L2.4 ("a especificação é o critério de correção") ganha coerência retroativa — ele já falava de specs antes de L3 existir, mas usando o termo "especificação" sem que o glossário o definisse. Com a resolução, L2.4 fala da materialização da porta, e L3 formaliza quando e como essa materialização acontece.

### 11.2 — Tensão: entidade vs. módulo

**Avaliação:** A tensão é real e tem causa identificável.

"Entidade" é definida como neutra em relação à granularidade — qualquer participante. L1 e L2 usam "entidade" consistentemente. Mas L2.9, L2.10 e L3 introduzem "módulo" como unidade recorrente: "módulo raiz", "módulo-decisor", "módulos subsequentes", "módulo específico do produto". O leitor que leu o glossário esperava um princípio agnóstico de granularidade; ao chegar em L3, encontra um princípio que parece ser sobre módulos.

A causa é que L3 opera em uma granularidade específica: a prática de especificação descreve como construir *um* produto de software, e nessa escala, a entidade concreta é o módulo. L3 não contradiz L2.2 (uniformidade entre granularidades) — ele instancia o princípio em uma granularidade. Mas o texto não sinaliza isso. "Módulo" aparece como se fosse sinônimo de "entidade", quando na verdade é uma instância de entidade em uma escala particular.

O problema é agravado por L2.10: "se a forma da entidade só faz sentido no contexto de um módulo específico do produto" — aqui, "entidade" e "módulo" coexistem na mesma frase em papéis diferentes, e a relação entre os dois não está declarada.

**Resolução:** Duas opções:

**Opção A — Manter "entidade" como termo do princípio e "módulo" como instância na prática.** L3 abre com uma nota: "Neste nível, a entidade concreta é o módulo de software. O princípio permanece agnóstico de granularidade (L2.2); a prática o instancia na escala de módulos." L2.10 usa "entidade" consistentemente e reserva "módulo" para quando se refere especificamente a módulos do produto.

**Opção B — Reconhecer que o princípio opera em dois registros.** L1–L2 usam "entidade" (registro abstrato). L3 usa "módulo" (registro concreto). O glossário adiciona "módulo" como "a instância de entidade na granularidade de código-fonte — o nível em que a prática de especificação opera". Isso é mais honesto: UseDD *é* agnóstico de granularidade no princípio, mas sua prática de especificação *não é* — ela é específica para módulos.

**Recomendação:** Opção B. A opção A força "entidade" em contextos onde "módulo" é o que se quer dizer, criando abstração onde não há ambiguidade. A opção B permite que cada nível use o termo preciso e torna a relação entre eles explícita.

---

## §12 — Revisão do Autor sobre §11

### 12.1 — Sobre "módulo"

**Autor:** Você se alienou tomando os exemplos por todo. Em UseDD não há regra de granularidade constrangida a módulos — uma função também tem porta (seu naming, suas props). E uma diretriz que passo agora: sempre preferir regras universais, exceções somente em último caso. Foi sob essa predileção que se adotou "entidade" para englobar tanto humanos quanto código, tendo assim o mesmo termo para todas as granularidades.

**Avaliação:** Correção aceita. O erro é de escopo e de método:

1. **Erro de escopo.** Tomei os exemplos de L3 (que mencionam módulos porque exemplificam uma prática em escala de módulos) como evidência de que L3 *é sobre* módulos. Não é. L3 descreve uma sequência de especificação que se aplica em qualquer granularidade: uma função tem porta (nome, parâmetros, retorno), um componente tem porta (props, slots, API pública), um sistema inteiro tem porta (endpoints, contratos). "Módulo" apareceu nos exemplos, não nas regras. As regras de L3 são: spec do usuário primeiro, spec do desenvolvedor depois, TDD com ambas, portas de entidades subsequentes ditadas pelo decisor. Nenhuma dessas regras menciona "módulo" como requisito — todas operam com "entidade".

2. **Erro de método.** Propus duas opções e recomendei a que introduzia um segundo termo ("módulo" como registro concreto). Isso viola a diretriz correta: regras universais, exceções em último caso. "Entidade" já é o termo universal que cobre todas as granularidades — humanos, módulos, funções, sistemas. Introduzir "módulo" como termo do glossário seria criar uma exceção desnecessária. Onde L3 diz "módulo", deveria dizer "entidade" — e os exemplos concretos (que podem mencionar módulos, funções, componentes) ficam como ilustrações, não como definições.

3. **A resolução correta.** L3 usa "entidade" uniformemente. Onde os exemplos mencionarem granularidades específicas, mencionam como exemplos, não como termos do princípio. O glossário não ganha entrada para "módulo". A uniformidade de "entidade" se mantém intacta de L1 a L3. A tensão que identifiquei em §11.2 não era do princípio — era da redação da árvore, que usou exemplos onde deveria ter usado o termo geral.

### 12.2 — Sobre "spec"

**Autor:** "Spec" não é menos abstrato que "porta" — você forçou isso para defender a existência do termo. No geral, mesmo com recomendações de práticas, o princípio ainda é agnóstico de arquiteturas e linguagens, logo ele sempre será abstrato.

**Avaliação:** Correção aceita. O erro é de caracterização:

1. **Erro de caracterização.** Apresentei "spec" como materialização concreta (documento, arquivo de tipos) em oposição a "porta" como conceito abstrato. Isso criou uma hierarquia falsa: porta = abstrato, spec = concreto. Mas "spec" é tão abstrato quanto "porta" — UseDD não prescreve que a spec seja um documento Markdown, um arquivo `.d.ts`, ou qualquer formato particular. "Spec" nomeia a entidade que precede e constrange a implementação, em qualquer formato e qualquer granularidade. Uma spec pode ser um tipo TypeScript, um documento em prosa — o princípio não distingue. Forçar "spec" como "materialização" foi projetar concretude onde o princípio não a exige.

2. **A questão real.** Se "spec" e "porta" são ambos abstratos e ambos nomeiam "o que o decisor espera do executor", por que dois termos? A resposta é que eles nomeiam dimensões diferentes da mesma coisa:

   - **Porta** é o conceito relacional — existe em virtude de haver uma relação de uso. A porta é *de* uma relação entre duas entidades.
   - **Spec** é o conceito temporal — existe em virtude de L1.2 (a descrição do uso precede a implementação). A spec é a porta *enquanto anterior à implementação*.

   Não são dois níveis de abstração. São duas lentes sobre o mesmo objeto: a porta vista pela estrutura (quem define para quem) e a porta vista pela sequência (quando é definida em relação à implementação). Toda spec é uma porta. Toda porta, quando UseDD é seguido, é especificada antes — logo, é uma spec.

3. **A resolução correta.** O glossário não precisa de dois termos independentes com definições separadas. Precisa de um termo — **porta** — com a observação de que L1.2 constrange toda porta a ser especificada antes da implementação, e que "spec" (ou "especificação") é o nome da porta nesse papel temporal. Não é um conceito novo; é a porta vista pelo eixo da sequência. Isso elimina o conflito sem perder nenhuma capacidade expressiva: onde o texto fala de relação estrutural, usa "porta"; onde fala de precedência temporal, usa "spec" ou "especificação"; ambos referem o mesmo objeto.

### 12.3 — Diretriz registrada

A diretriz do autor — **sempre preferir regras universais, exceções somente em último caso** — é a razão pela qual "entidade" existe como termo único para todas as granularidades e pela qual "porta" deve permanecer como conceito unificado (com "spec" como lente temporal, não como termo concorrente). Essa diretriz é aplicável a toda revisão futura da Design Tree: se a resolução proposta introduz um termo novo ou uma distinção de nível, verificar primeiro se o termo existente já cobre o caso. Se cobre, não duplicar.

---

## §13 — Decisão final sobre "spec"

**Autor:** Não considero a diferença temporal suficiente para justificar termos diferentes. Vamos continuar só com "porta".

**Avaliação:** Aceito. A distinção temporal que propus em §12.2 (porta = lente estrutural, spec = lente temporal) é analiticamente válida, mas validade analítica não é suficiente para justificar um segundo termo. O critério do autor é pragmático e consistente com a diretriz de §12.3: se "porta" já cobre o objeto, introduzir "spec" é duplicação sem ganho. A dimensão temporal não desaparece — ela está capturada por L1.2 ("a porta precede a implementação"). Não precisa de um nome próprio.

**Consequência para a Design Tree:** Remover "Spec" do glossário. Substituir todas as ocorrências de "spec" por "porta" (ou "especificação da porta" onde a referência temporal for relevante ao contexto). L3 passa a falar de "porta do usuário do produto", "porta do desenvolvedor", sem introduzir vocabulário novo.
