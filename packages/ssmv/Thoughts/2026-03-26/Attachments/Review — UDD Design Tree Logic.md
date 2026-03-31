# Conversa: Review da Design Tree do Use Driven Design

**Contexto:** Revisão lógica da Design Tree do Use Driven Design (seção 13 de "Conversa: Auditoria de Autorialidade e Use Driven Design"), seguida de correções com base nos esclarecimentos do autor.

---

## 1. Revisão inicial — estrutura e hierarquia

A árvore é um DAG (grafo acíclico dirigido) apresentado como árvore:

```
Root (direção + sequência)
├── L1.1 Direção ("quem pensa, usa")
│   ├── L2.1 Separação de nível de responsabilidade como pré-condição
│   ├── L2.2 Uniformidade entre granularidades
│   │   └── L2.5 Humano como única origem (também depende de L1.1)
│   └── (dependência cruzada para L2.3)
└── L1.2 Sequência ("uso precede implementação")
    ├── L2.3 Vocabulário da porta determinado pelo lado que usa (também depende de L2.2)
    └── L2.4 Especificação como critério de correção
```

**Root → L1: correto.** O nó raiz empacota duas afirmações independentes — *quem* define a porta e *quando* a definição acontece. L1.1 e L1.2 as separam de forma limpa. São eixos genuinamente independentes: é possível ter direção sem sequência (o lado certo define, mas após a implementação — uma spec post-hoc) ou sequência sem direção (uma spec escrita antes, mas pelo executor sobre o que planeja construir — um design doc). A raiz afirma ambos juntos; L1 decompõe corretamente.

**L1.1 → L2.1: derivação válida.** Se o princípio exige identificar "quem pensa" em qualquer par, e essa identificação precisa ser determinística, então artefatos com responsabilidades mistas tornam a pergunta irrespondível.

**L1.1 → L2.2: válido, mas sub-declarado.** A conexão é que "quem pensa, usa" é uma regra relacional sobre *qualquer* par de artefatos. L2.2 afirma que isso vale em todas as escalas. A derivação funciona, mas L2.2 faz duplo serviço: é tanto consequência da generalidade de L1.1 quanto um *compromisso adicional* de que o princípio não enfraquece nem muda de forma entre escalas. A parte do "compromisso adicional" não é totalmente derivada de L1.1 — é parcialmente uma decisão de design de rejeitar regras dependentes de escala.

**L2.2 + L1.1 → L2.5: válido.** Se autoridade flui de decisor para executor em toda granularidade (L1.1 aplicado uniformemente via L2.2), então encadear essas relações produz uma cadeia de origem única. A derivação está correta. Ver §3 para uma assunção oculta.

**L1.2 → L2.3: válido, mas com escrita insuficiente.** L1.2 diz que a spec vem primeiro e é escrita no vocabulário do lado que usa. L2.2 diz que o princípio é uniforme entre escalas. Juntos implicam que o vocabulário deve *variar* por escala (porque escalas diferentes têm "lados que usam" diferentes com linguagens diferentes). L2.3 afirma que a porta é expressa "na linguagem adequada para verificar que [o executor] a satisfaz" — o que soa como um novo critério. Mas o que "verificar" significa aqui é: o artefato só funciona se faz o que o lado que usa espera — pode compilar, executar, e passar testes, mas se não satisfaz a expectativa do lado que usa, não está funcionando. Ou seja, a "verificação" é inerente à relação de uso: quem usa confirma se o artefato satisfaz ou não. Não é uma premissa nova, é consequência de L1.2 + L2.2. A escrita original não deixava isso claro.

**L1.2 → L2.4: válido.** Se a spec precede e constrange a implementação, então divergência é erro de implementação. A alternativa (atualizar a spec para coincidir com a implementação) inverteria a sequência, contradizendo L1.2. Derivação limpa.

---

## 2. Problemas de coerência

### 2.1 — L2.1: não é SRP externo, é derivação interna

A revisão inicial identificou risco de circularidade: UDD precisaria de SRP para funcionar, e ao mesmo tempo usaria ambiguidade de direção para detectar violações de SRP.

**Esclarecimento do autor:** O que a árvore chama de "separação de responsabilidades" não é o SRP do Clean Architecture — é uma definição interna, melhor nomeada como "separação de nível de responsabilidade" (quem decide não executa; quem executa não decide). Ela não é externa nem anterior a UDD: ela *deriva* da necessidade de L1.1 ter uma resposta determinística para "quem pensa neste par". Se a resposta for ambígua, a separação de níveis está violada — o que torna a detecção uma consequência natural, não uma circularidade.

**Correção necessária:** L2.1 deve ser reescrito como requisito derivado de L1.1 (não como pré-condição importada), usando o termo "separação de nível de responsabilidade" em vez de "SRP".

### 2.2 — As "alternativas" da Raiz são assimétricas

A alternativa da raiz aborda apenas a inversão de *direção* ("a implementação define o que é exposto; o uso se adapta ao que existe"). A inversão de *sequência* não é nomeada como alternativa. Um nó raiz completo deveria reconhecer ambas as alternativas rejeitadas:
- Direção invertida: o executor define a porta.
- Sequência invertida: a spec é escrita após a implementação (documentação, não especificação).

### 2.3 — L2.3: terminologia incorreta importada da Arquitetura Hexagonal

O título original era "O vocabulário da porta é determinado **pelo adapter**". O termo "adapter" vem da Arquitetura Hexagonal, onde o sistema é um domínio e os adapters fazem ponte entre o domínio e coisas externas. Mas em UDD a regra se aplica em granularidades diferentes — o que torna a importação do termo uma fonte de erros.

**Esclarecimento do autor:** O modelo mental correto é: há entidades, e entidades têm portas. Entidades são do tipo *decisor* ou *executor*. Cada porta de uma entidade é definida pela outra entidade que a usa. Não há necessidade de um terceiro termo — "decisor", "executor", e "porta" são suficientes.

O termo "entidade" substitui "artefato" em toda a árvore. "Artefato" sugere algo produzido, um objeto inerte — não serve igualmente para um arquivo-fonte e para um humano. "Entidade" é neutro o suficiente para nomear qualquer participante de uma relação de uso, independente da granularidade.

**Correção necessária:** Remover toda referência a "adapter". Usar "entidade executora" onde antes dizia "adapter". Substituir "artefato" por "entidade" em toda a árvore. A porta é definida pelo decisor, implementada pelo executor. O vocabulário da porta é aquele em que o decisor consegue confirmar que o executor satisfaz a porta.

---

## 3. Assunções ocultas que precisam virar nós explícitos

### 3.1 — Cadeia de autoridade finita e acíclica

L2.5 afirma que autoridade pode ser rastreada de qualquer artefato de volta ao humano. Isso requer duas assunções:
1. **Cadeia finita** — não há regressão infinita de "quem pensa para o pensador".
2. **Cadeia acíclica** — artefato A não define a porta de B enquanto B define a porta de A.

Ambas são plausíveis (o humano é um terminador natural, e ciclos violariam o eixo de direção), mas devem ser explícitas. Acyclicidade em particular pode ser violada na prática (dependências mútuas entre módulos).

### 3.2 — Um único decisor por par

L1.1 assume que para qualquer par de artefatos, exatamente um lado pensa e o outro executa. Sistemas reais têm pares onde ambos os lados tomam decisões em dimensões diferentes (ex.: um Model define *o quê* o Coordinator faz, mas o Coordinator decide *quando* executar em resposta a eventos de ciclo de vida). A árvore não aborda como resolver pares com autoridade mista. L2.1 (separação de nível de responsabilidade) lida parcialmente com isso ao exigir separação, mas precisa ser explícito que pares com autoridade mista indicam violação.

---

## 4. Completude

### 4.1 — Divergência entre spec e implementação: retorno à fase de spec

L1.2 menciona de passagem que "se a especificação se mostrar impraticável, ela é revisada — nunca silenciosamente absorvida pela implementação." A revisão inicial sugeriu um nó de "protocolo de revisão de spec".

**Esclarecimento do autor:** O princípio não impõe um nível de rigor — cada time/projeto decide o nível de complexidade aceito antes de repensar a spec. O que é imperativo é que a spec nunca é ignorada na implementação. Se não dá para implementar o que ela pede, volta-se à fase de spec e pensa-se em uma nova forma de bem atender o humano dentro das limitações do time/projeto. É sempre "pensar em uma forma diferente de agradar o humano", nunca "nisto, vamos agradar o código".

**Correção necessária:** L2.4 deve tornar explícito que divergência obriga retorno à fase de spec com foco no humano — não um protocolo formal, mas uma regra imperativa de que a implementação nunca absorve a divergência.

### 4.2 — Relação entre L2.4 e L2.5: o humano como critério último

L2.4 diz que a spec é o critério de correção. L2.5 diz que autoridade traça de volta ao humano. Juntos implicam: *o humano é o critério último de correção*. Este é o núcleo filosófico do princípio e atualmente está apenas implícito na combinação de dois nós-folha. Merece um nó explícito ou pelo menos referência cruzada.

---

## 5. Resumo das correções

| # | Nó | Correção |
|---|---|---|
| 1 | Raiz | Adicionar alternativa de sequência invertida |
| 2 | L2.1 | Renomear para "separação de nível de responsabilidade"; reescrever como requisito derivado de L1.1, não como pré-condição externa |
| 3 | L2.3 | Remover "adapter"; reescrever título e decisão usando "entidade executora" e "porta" |
| 4 | L2.3 | Clarificar que o vocabulário da porta é determinado pela capacidade do decisor de confirmar satisfação, não por um "método de verificação" externo |
| 5 | L2.4 | Adicionar: divergência obriga retorno à fase de spec com foco no humano, nunca absorção pela implementação |
| 6 | Novo L2.6 | Cadeia de autoridade finita e acíclica (derivado de L1.1 + L2.2) |
| 7 | Novo L2.7 | Decisor único por par — pares com autoridade mista indicam violação de L2.1 (derivado de L1.1 + L2.1) |
| 8 | Novo L2.8 ou cross-ref | O humano como critério último de correção (derivado de L2.4 + L2.5) |

---

## 6. Design Tree — Use Driven Design (corrigida)

> Mapa causal de decisões de design: cada nó é uma escolha feita entre alternativas, com racional explícito. Nós-pai constrangem ou habilitam nós-filho.
> Escopo: o meta-princípio apenas — sem referência a implementações específicas.

---

### Glossário

- **Entidade** — Qualquer participante de uma relação de uso. Pode ser um humano, um arquivo-fonte, um módulo, um sistema inteiro. O termo é neutro em relação à granularidade.
- **Porta** — O contrato que define como uma entidade é usada. Toda entidade usada por outra tem uma porta. A porta é definida pela entidade que usa (o decisor), não pela entidade que é usada (o executor).
- **Decisor** — A entidade que, em um par, toma decisões. O decisor define a porta da entidade que usa. Decidir é sua responsabilidade; executar, não.
- **Executor** — A entidade que, em um par, implementa o que o decisor definiu através da porta. Executar é sua responsabilidade; decidir, não.
- **Uso** — A relação entre decisor e executor. Nomeia a relação em qualquer granularidade. Não implica que o decisor seja um humano — um arquivo-fonte pode ocupar o papel de decisor em uma relação com outro arquivo-fonte.
- **Usuário** — Reservado ao humano. Nunca reaproveitado para entidades intermediárias. A cadeia de autoridade sempre começa em um usuário.
- **Cadeia de autoridade** — A sequência de relações de uso que conecta qualquer entidade de volta ao humano. Cada elo é uma relação decisor→executor. A cadeia é finita, acíclica, e tem exatamente uma raiz: o humano.

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
- Consequência emergente: ambiguidade na direção da porta é diagnóstico de que a separação de níveis foi violada — UDD funciona como verificador.

---

#### L2.2 — Uniformidade entre granularidades

**Decisão:** O princípio se aplica identicamente em todas as escalas — da relação humano/sistema até a relação entre duas entidades internas.

**Alternativas:** O princípio se aplica apenas no nível macro (produto) ou apenas no nível micro (código).

**Racional:** Um princípio que muda de forma entre escalas não é um meta-princípio — é um conjunto de regras ad hoc com superfície em comum.

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

#### L2.4 — A especificação é o critério de correção da implementação

**Decisão:** A implementação está correta se e somente se satisfaz a especificação; divergência é erro da implementação.

**Alternativas:** Divergência entre spec e implementação é resolvida atualizando a spec para refletir o que foi construído.

**Racional:** Se a spec pode ser corrigida para concordar com a implementação, a implementação tem autoridade — e o princípio foi invertido.

**Habilita / Constrange:**
- Torna a especificação auditável independentemente dos testes: um teste que passa mas contradiz a spec está errado.
- Constrange a pergunta "quem testa os testes?" a ter resposta: a especificação.
- Se a implementação não consegue satisfazer a spec, o fluxo obrigatório é retornar à fase de especificação e encontrar uma nova forma de atender o humano dentro das limitações do time/projeto — nunca absorver a divergência na implementação. *(→ L2.8)*

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

**Habilita / Constrange:**
- Torna dependências mútuas entre entidades um diagnóstico de violação arquitetural.
- Garante que toda cadeia de autoridade tem exatamente uma raiz (o humano) e nenhum ciclo.

---

#### L2.7 — Decisor único por par

**Decisão:** Em qualquer par de entidades, exatamente uma é o decisor e a outra é o executor.

**Alternativas:** Ambas as entidades podem tomar decisões em dimensões diferentes, com a direção de autoridade variando por dimensão.

**Racional:** L1.1 requer uma resposta determinística para "quem pensa neste par". Se ambos os lados decidem em dimensões diferentes, a resposta depende de qual dimensão se examina — a direção da porta torna-se ambígua. L2.1 exige nível único de responsabilidade precisamente para evitar isso. Se na prática duas entidades parecem ter autoridade mútua em dimensões diferentes, L2.1 foi violado: as dimensões devem ser separadas em entidades distintas até que cada par tenha um decisor único.

**Habilita / Constrange:**
- Torna pares com autoridade mista um diagnóstico de violação de L2.1.
- Constrange o design a separar dimensões de decisão em entidades distintas, nunca a resolver ambiguidade aceitando autoridade bidirecional.

---

#### L2.8 — O humano é o critério último de correção

**Decisão:** Toda divergência entre especificação e implementação deve ser resolvida em favor do humano.

**Alternativas:** Divergência pode ser resolvida em favor da implementação quando constrangimentos técnicos a tornam impraticável, ou em favor de equilíbrio entre necessidades humanas e técnicas.

**Racional:** L2.4 estabelece que a spec é o critério de correção. L2.5 estabelece que toda autoridade traça de volta ao humano. Juntos, implicam que o humano — não o código, não os testes, não as limitações técnicas — é o critério último. Quando a implementação não consegue satisfazer a spec, o fluxo correto é retornar à fase de especificação e encontrar uma nova forma de atender o humano dentro das limitações existentes. "Pensar em uma forma diferente de agradar o humano" — nunca "nisto, vamos agradar o código".

**Habilita / Constrange:**
- Fecha a cadeia de autoridade: o humano é origem (L2.5) e destino (L2.8) de toda decisão de design.
- Torna "a quem esta entidade serve?" a pergunta última de qualquer revisão — e a resposta é sempre o humano.
