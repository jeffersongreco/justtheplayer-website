# Conversa: Auditoria de Autorialidade e Use Driven Design

**Contexto:** Análise da Svelte Model View Architecture (SSMV) a partir dos documentos `Architecture.md`, `Design Tree.md`, `Interfaces.md` e `Testing.md`, anexados no início da conversa.

---

## 1. Memorando de auditoria de autorialidade

**Usuário:** Escreva um memorando auditando o grau de atoralidade dessa arquitetura de software. O objetivo é identificar o que é novo e precisa de mais explicação sem citações e o que está descrevendo algo que já existe e poderia explicar menos e citar mais. A análise não deve ser em busca de algo existente que contemple a arquitetura inteira, sim assunto a assunto. A busca não só atrás de outra iniciativa de arquitetura com o mesmo objetivo, mas também em conceitos, práticas, paradigmas, etc. da literatura da engenharia de software.

**Assistente:** *(Memorando produzido como documento .docx — ver arquivo `auditoria_atoralidade.docx`)*

Resumo das conclusões:

**Conceitos com baixa autorialidade** (consolidados na literatura — citar mais, explicar menos):
- Contract-first / Interface.md como fonte de verdade
- Information hiding — o que Interface.md nunca inclui (Parnas, 1972)
- Responsabilidades do consumidor (Design by Contract, Meyer, 1986)
- Red–Green–Refactor (Kent Beck, TDD canônico)
- Model puro / Coordinator imperativo (Functional Core/Imperative Shell, Bernhardt, 2012)

**Conceitos com alta autorialidade** (sem precedente preciso — explicar mais):
- O Model como autoridade sobre todos os contratos inter-módulo
- Convenção `is*`/adjetivo para direcionalidade de props
- Spec de Coordinator e Interaction vivendo nos testes
- Guided QA Mode

---

## 2. Comparação com práticas existentes

**Usuário:** Sobre "1. Interface.md como contrato primário de pacote UI", qual/quais dos seguintes é mais igual à SSMV? (Informação extra: O spec de comportamento visa prever a UX e o interface tenta prever a DX, somados garantem que antes de "agradar um computador", o sistema irá agradar os humanos que usarão ele — além de definir claramente como verificar se o sistema está funcionando)
- Spec-Driven Development
- Behavior-Driven Development
- Test-Driven Development
- Specification by Example
- Design by Contract
- Protocol-Oriented Programming

**Assistente:** Análise candidato a candidato:

- **TDD** — descarta imediatamente. O artefato central é o teste, não a spec. A sequência é diferente.
- **Design by Contract** — cobre a mecânica de pré/pós-condição mas não a separação de audiências nem a ideia de UX como artefato primário. Correspondência parcial.
- **Protocol-Oriented Programming** — técnica de organização de tipos, não metodologia de desenvolvimento.
- **Specification by Example** — semelhança na intenção, divergente no mecanismo: SbE colapsa spec e teste no mesmo artefato.
- **BDD** — análogo ao Behavioral Spec na separação comportamento/implementação, mas colapsa spec e teste (feature files executáveis).
- **Spec-Driven Development** — o mais próximo. A sequência, a relação de autoridade (spec é fonte de verdade), e a verificabilidade estão alinhados.

**Conclusão:** Spec-Driven Development é o mais próximo. BDD é o segundo — mas com divergência estrutural importante. A informação extra (spec prevê UX, interface prevê DX, juntos garantem que o sistema agrada humanos antes do computador) é o ponto onde a SSMV é mais original do que qualquer candidato: nenhum deles separa explicitamente a audiência do spec da audiência da interface nem afirma que essa separação é o mecanismo pelo qual o design centrado em humanos é garantido estruturalmente.

---

## 3. BDD e SbE juntam spec e teste — ou só dividem por papel?

**Usuário:** Nos citados como "se parecem, mas juntam spec e teste no mesmo artefato", será que a diferença não está só em quais documentos são de PM e quais são de SE? Porque para escrever os testes, eles precisam saber antes o que testar e qual a API do módulo, mesmo que oralmente, algo análogo a um "Behavioral Spec" sempre é pensado, é um passo meio obrigatório que só não está sendo considerado por eles como passo pertencente ao desenvolvimento (mas anterior ao seu início), não?

**Assistente:** Essa observação é precisa. Em BDD e SbE, o "Behavioral Spec" existe — emerge nas conversas de Example Mapping, nos Three Amigos meetings, nos workshops de Gojko Adzic. A diferença não é que BDD não tem esse passo — é que BDD não o trata como artefato de desenvolvimento com status formal.

O que muda quando o Behavioral Spec vira artefato formal:

1. **A spec pode estar errada independentemente dos testes.** Se o Spec é oral ou implícito, o único registro do comportamento esperado são os testes. Na SSMV, o Spec é o árbitro: um teste que passa mas contradiz o Spec está errado.
2. **A spec pode ser revisada sem tocar nos testes.** Em BDD, revisar o feature file *é* revisar o teste.
3. **A spec pode ser lida por quem não vai escrever testes.** Em BDD, Gherkin tenta isso mas a pressão de executabilidade puxa a linguagem para o técnico.

O que você está identificando é que BDD e SbE têm um **passo implícito de PM** que não conta como desenvolvimento — e a SSMV o formaliza e o traz para dentro do ciclo.

---

## 4. Contexto solo como origem da formalização

**Usuário:** Se eu te falar que não foi uma epifania epistêmica sobre a importância do spec, mas só uma consequência de eu trabalhar sozinho desde a ideia até o deploy, o que muda na sua conclusão?

**Assistente:** Muda bastante. Se a formalização surgiu porque você *é* o PM e o SE ao mesmo tempo, então a SSMV não é uma tese sobre upstream quality — é uma solução pragmática para um problema específico: quando não há handoff entre papéis, o artefato que normalmente seria "entregue" pelo PM precisa ser produzido explicitamente pelo dev, senão não existe em lugar nenhum.

Isso na verdade **aumenta** a autorialidade em um sentido diferente: a maioria das metodologias foi projetada para times. A SSMV resolve o problema de como um desenvolvedor solo mantém rigor de especificação sem uma organização que distribua esse trabalho entre papéis — problema real e sub-documentado na literatura.

O que não muda: a diferença estrutural em relação a BDD e SbE continua de pé, só a justificativa muda. As propriedades são reais independentemente da origem.

---

## 5. Revisão: as duas justificativas são verdadeiras

**Usuário:** 1. Ambas as justificativas são verdadeiras, eu acredito sim que deve ser elevada a importância do spec (porque o que importa é agradar humanos e funcionar é entregar o que o humano espera através de uma boa experiência e não "ter testes passando", além de upstream quality e, outra coisa, sem formalizar a spec quem testa os testes?)
2. E qual a autorialidade de ter o spec de comportamento como um artefato e não como uma seção (user-stories) dentro de um PRD? E a autorialidade de "user-stories" descrevendo o desenvolvedor usando o componente/sistema?

**Assistente:**

**Behavioral Spec como artefato autônomo vs. seção de PRD:** PRDs são artefatos de *produto* — o comportamento aparece subordinado a contexto de mercado e priorização de roadmap. Separar o Behavioral Spec como artefato próprio libera o documento de negociar entre precisão técnica e acessibilidade. A autorialidade é baixa como *ideia* (specs formais existem em métodos formais há décadas) mas moderada como *prática* no contexto de componentes UI, onde o padrão da indústria é o PRD com user stories.

**User stories descrevendo o desenvolvedor:** Alta autorialidade. User stories foram criadas para o usuário final do produto. Aplicá-las ao desenvolvedor que consome um componente é uma transposição não-óbvia: o critério de completude muda de "o usuário consegue completar a tarefa" para "o desenvolvedor consegue usar a API sem consultar o código-fonte". A organização de Interface.md por intenção do consumidor ("renderizando o componente", "disparando uma animação") em vez de por taxonomia técnica ("props", "methods") tem paralelo em **Jobs to be Done** (Christensen) — mas JTBD nunca foi aplicado ao design de documentação de API de componente UI.

---

## 6. O amarre do Markdown em prosa

**Usuário:** Concordo com a citação a JTBD. Amarre isso tudo com a resposta de por que Markdown em prosa: lembrar que engenharia de software já foi escrever cartões de papel, código é a execução e não o design/arquitetura/engenharia, o Markdown em prosa é o resultado documentado de um humano fazendo system thinking (e isso não é estrito a desenvolvimento de software).

**Assistente:**

Engenharia de software começou em cartões perfurados. Em cada transição tecnológica, houve pressão para que o artefato de design fosse executável ou processável por máquina. O efeito colateral foi que o pensamento passou a ser moldado pela ferramenta.

Markdown em prosa resiste a isso — não porque seja primitivo, mas porque é o formato mínimo que preserva a propriedade essencial: **é um humano fazendo system thinking e registrando o resultado em linguagem humana.**

O formato *é* parte do princípio. Contract-first em OpenAPI é machine-readable por design — a autoridade da spec vem da sua processabilidade. Na SSMV, a autoridade da spec vem da sua legibilidade humana. Um schema gerado por ferramenta descreve o que foi implementado, não o que foi projetado.

**A linhagem intelectual correta:** O cartão de papel é a evidência de que engenharia de software sempre soube que design e execução são artefatos diferentes. Em algum momento essa separação colapsou: o código virou o único artefato que "conta". A SSMV não inventa uma separação nova — restaura uma separação que existia e foi perdida, com uma precisão que não existia antes: dois documentos, para duas audiências, sobre dois tipos de humano que o sistema precisa agradar. O Behavioral Spec agrada quem usa o produto. Interface.md agrada quem constrói com o componente. O código agrada o computador. A sequência não é acidental — é a ordem correta de prioridade.

---

## 7. Proposta de formalização: Use Driven Design

**Usuário:**

```
# Use Driven Design

* Quem é o usuário e quem é usado, não é sobre fluxo de dados é sobre quem pensa.
  O humano pensa, ele usa o sistema. O Model pensa (regras de negócio), ele usa o
  Coordinator. O script pensa (regras de apresentação), ele usa o template.

* Quem dita a implementação é o uso que o usuário espera do artefato. O uso esperado
  é definido antes da implementação, em vez do contrário. O uso é uma diretriz para
  a implementação e não uma consequência dela.

* No nível de código (dentro da arq. hexagonal), primeiro é definida a porta e depois
  o adapter. E quem manda como será a porta é quem tem regras em seu domínio, não quem
  é só executor (Coordinator), nem quem é só coletor de informações (Interaction).
```

**Assistente:**

**"Quem pensa, usa"** — o mais original dos três e o mais arriscado de formalizar. Funciona nos exemplos dados mas precisa de um critério claro para "pensar".

**"O uso esperado é definido antes da implementação"** — a parte mais forte. É onde Behavioral Spec + Interface.md vivem como princípio. "Use Driven" captura isso melhor do que qualquer dos candidatos comparados.

**A analogia com hexagonal** — precisa e útil, mas introduz uma tensão: hexagonal foi criada para isolar domínio de infraestrutura; na SSMV a motivação é preservação de autoridade de quem pensa sobre quem executa. Vale deixar claro que a analogia é estrutural, não de propósito.

**O que está faltando:** o princípio ainda não captura a separação de audiências. "Use Driven" descreve quem define a interface, mas não para quem o artefato é escrito. Os dois artefatos (Behavioral Spec e Interface.md) existem porque os dois usuários são humanos diferentes com expectativas diferentes.

---

## 8. Refinamentos ao princípio

**Usuário:**
- Sobre o critério de "quem pensa": ele se apoia em um pressuposto omitido, a separação de responsabilidades — "nível único de responsabilidade": se um artefato é executor, ele não toma decisões e, se toma decisões, não executa. Isso está presente na regra que obriga o Model a dar sempre a ordem completa (Intenções Tipadas) para o Coordinator poder ser só executor. "Quem pensa" é quem está no nível de tomador de decisões.
- Sobre "O que está faltando": "Use Driven" se propõe a ser uma regra que se aplica a todas as granularidades desde o macro humano→sistema até o micro Model→Coordinator. A confusão se dá porque no caso da DX a porta ainda é uma API, já no caso da UX a porta é o produto pronto. A UX quebra o padrão que se segue até a DX de que uma porta é uma API.

**Assistente:**

**SRP como "nível único de responsabilidade"** resolve o critério de "quem pensa" de forma limpa e verificável: se o Coordinator tomou uma decisão, violou SRP, portanto a arquitetura está errada, portanto a porta foi definida pelo lado errado. As Intenções Tipadas são o enforcement desse princípio.

**Sobre UX "quebrar o padrão":** a porta da UX *é* uma API — só escrita em linguagem de comportamento observável em vez de TypeScript. O Behavioral Spec é a definição da porta entre o humano e o sistema. O produto pronto é o adapter que satisfaz essa porta. O que muda não é a estrutura — é o vocabulário da porta e a natureza do adapter. O padrão é uniforme em todas as granularidades.

O Markdown em prosa não é uma escolha de formato: é o formato correto para uma porta cujo contrato só pode ser verificado por percepção humana. Isso unifica os três níveis sem casos especiais e explica por que os dois artefatos existem e são diferentes — não são dois tipos de documento por preferência, são **dois vocabulários de porta para dois tipos de adapter**.

O segundo bullet pode ser mais preciso: a porta é sempre definida pelo lado que pensa, **em um vocabulário adequado ao adapter que irá satisfazê-la**. TypeScript quando o adapter é código. Prosa quando o adapter é avaliado por humano.

---

## 9. Use Driven Design — classificação

**Usuário:** E Use Driven Design é padrão de design, é arquitetura, é paradigma, ...?

**Assistente:**

É um **meta-princípio de design** — uma regra sobre como derivar outros princípios e decisões de design.

- **Padrão de design** (GoF/arquitetural): solução recorrente para problema recorrente. UDD não descreve uma solução — descreve um critério para avaliar e derivar soluções.
- **Paradigma**: visão de mundo que determina quais perguntas são legítimas. UDD não é amplo o suficiente e não pretende substituir a forma de pensar computação.
- **Arquitetura**: descreve estrutura de um sistema específico. UDD pode *fundamentar* uma arquitetura (como fundamenta a SSMV), mas ele mesmo não é uma.
- **Princípio**: é o que ele é — e na hierarquia de princípios, é um **meta-princípio** porque não diz "faça X" mas "para qualquer decisão de design, determine primeiro quem usa quem, e deixe quem usa ditar a forma da porta".

É da mesma categoria que SRP, DIP, Tell Don't Ask — não são padrões aplicáveis, são critérios que geram decisões corretas quando aplicados consistentemente.

A diferença em relação aos princípios SOLID: UDD é **relacional e sequencial**. Não descreve uma propriedade de um artefato isolado, mas a relação entre dois artefatos e a ordem em que essa relação deve ser estabelecida. Isso o aproxima de DIP — mas DIP fala de direção de dependência em código, enquanto UDD fala de direção de autoridade no design, antes do código existir.

---

## 10. Use Driven Design — Design Tree

**Usuário:** Model, Coordinator, Behavioral Spec e Interface.md, citar eles descreve mais do que o meta-princípio, adiciona coisas que são de uma camada diferente. Isso dito, me dê a design tree do UseDD, somente em escopo o meta-princípio, e sem verbosidade (uma frase só por nó da árvore), meu objetivo é enxergar as causalidades e dependências.

**Assistente:**

```md
Preciso ver o formato da Design Tree antes de produzir.Agora tenho o formato exato. Produzo a árvore.

---

# Design Tree — Use Driven Design

> Mapa causal de decisões de design: cada nó é uma escolha feita entre alternativas, com racional explícito. Nós-pai constrangem ou habilitam nós-filho.
> Escopo: o meta-princípio apenas — sem referência a implementações específicas.

---

## Nó Raiz

**Decisão:** Quem usa define a forma do que é usado, e essa definição precede a implementação.

**Alternativas:** A implementação define o que é exposto; o uso se adapta ao que existe.

**Racional:** Se o uso é uma consequência da implementação, o artefato foi construído para o executor, não para o usuário — a direção de autoridade está invertida.

**Habilita / Constrange:**
- Habilita identificar, para qualquer relação entre artefatos, qual dos dois é o usuário.
- Constrange a definição da interface a ser feita antes da implementação, sempre.
- Constrange o critério de correção da implementação: ela satisfaz o uso esperado, não o contrário.

---

## L1 — Os Dois Eixos do Princípio

### L1.1 — Direção: quem pensa, usa

**Decisão:** O usuário é sempre o lado que toma decisões; o usado é sempre o lado que executa.

**Alternativas:** A relação de uso é determinada por conveniência técnica ou fluxo de dados.

**Racional:** Fluxo de dados e direção de autoridade são dimensões independentes — dados podem fluir em qualquer direção sem determinar quem manda na forma da porta.

**Habilita / Constrange:**
- Habilita identificar univocamente, em qualquer par de artefatos, quem define a interface.
- Constrange a identificação a depender de separação de responsabilidades: quem executa não decide; quem decide não executa. *(→ L2.1)*
- Habilita aplicar o princípio em qualquer granularidade, do macro ao micro. *(→ L2.2)*

---

### L1.2 — Sequência: o uso precede a implementação

**Decisão:** O artefato que descreve o uso esperado é produzido antes do artefato que o satisfaz.

**Alternativas:** O uso é documentado depois, como descrição do que foi construído.

**Racional:** Documentação posterior descreve a implementação; especificação anterior constrange a implementação — são papéis opostos com consequências opostas para quem tem autoridade.

**Habilita / Constrange:**
- Constrange o artefato de uso a ser escrito em vocabulário do usuário, não do executor. *(→ L2.3)*
- Habilita que a implementação seja verificável: ela satisfaz ou não o que foi especificado. *(→ L2.4)*
- Constrange revisões: se a especificação se mostrar impraticável, ela é revisada — nunca silenciosamente absorvida pela implementação.

---

## L2 — Consequências dos Eixos

### L2.1 — Separação de responsabilidades como pré-condição

**Decisão:** O princípio só é aplicável onde responsabilidades estão separadas em nível único.

**Alternativas:** Aplicar UDD a artefatos que misturam decisão e execução.

**Racional:** Sem nível único de responsabilidade, a pergunta "quem pensa?" não tem resposta determinística — e sem essa resposta, a direção da porta é arbitrária.

**Habilita / Constrange:**
- Torna UDD um verificador de separação de responsabilidades: se a direção da porta é ambígua, SRP foi violado.

---

### L2.2 — Uniformidade entre granularidades

**Decisão:** O princípio se aplica identicamente em todas as escalas — da relação humano/sistema até a relação entre dois módulos internos.

**Alternativas:** O princípio se aplica apenas no nível macro (produto) ou apenas no nível micro (código).

**Racional:** Um princípio que muda de forma entre escalas não é um meta-princípio — é um conjunto de regras ad hoc com superfície em comum.

**Habilita / Constrange:**
- Constrange o vocabulário da porta a variar por escala, mas não a estrutura: quem pensa define a porta, quem executa implementa o adapter. *(→ L2.3)*

---

### L2.3 — O vocabulário da porta é determinado pelo adapter

**Decisão:** A porta é expressa na linguagem adequada para verificar que o adapter a satisfaz.

**Alternativas:** A porta é sempre expressa no mesmo vocabulário independente da natureza do adapter.

**Racional:** Se o adapter é verificado por máquina, a porta pode ser formal; se o adapter é verificado por percepção humana, a porta precisa ser legível por humanos — forçar formalidade onde ela não pode ser executada é teatro, não contrato.

**Habilita / Constrange:**
- Explica por que portas para adapters humanos são escritas em prosa: não é preferência, é a consequência do critério de verificação.
- Constrange o formato da especificação ao critério de verificação do adapter, não à preferência do especificador.

---

### L2.4 — A especificação é o critério de correção da implementação

**Decisão:** A implementação está correta se e somente se satisfaz a especificação; divergência é erro da implementação.

**Alternativas:** Divergência entre spec e implementação é resolvida atualizando a spec para refletir o que foi construído.

**Racional:** Se a spec pode ser corrigida para concordar com a implementação, a implementação tem autoridade — e o princípio foi invertido.

**Habilita / Constrange:**
- Torna a especificação auditável independentemente dos testes: um teste que passa mas contradiz a spec está errado.
- Constrange a pergunta "quem testa os testes?" a ter resposta: a especificação.
```

---

## 11. Revisão da Design Tree — lacunas identificadas

**Usuário:** Sob a luz da seguinte nota:

> Como o Model responde a Spec que responde ao Humano, a regra de "quem pensa manda" garante que a cadeia de autoridade sempre seja uma linha que leva ao humano, sem nenhum galho onde a ponta é a implementação. E então porque "Use" e não "User Driven", porque a regra se aplica em qualquer granularidade (O Model é um arquivo-fonte e não um "usuário" — salvamos esse termo a humanos).

A Design Tree presente na seção 10 pode ter ou precisa de atualizações? Só responda, sem iniciar edições.

**Assistente:** A Design Tree captura os eixos principais (L1.1 direção, L1.2 sequência, L2.2 uniformidade entre granularidades) mas está incompleta em dois pontos introduzidos pela nota:

**1. A cadeia de autoridade como linha sem galhos** — L2.2 afirma que o princípio se aplica identicamente em todas as escalas, mas não extrai a consequência estrutural: quando aplicado uniformemente, o resultado é sempre uma cadeia de autoridade sem galhos onde a ponta é a implementação. O humano é o único ponto de origem. Essa consequência de L2.2 + L1.1 merece um nó próprio.

**2. Distinção entre "uso" e "usuário"** — L1.1 usa "usuário" para o lado que toma decisões em qualquer par de artefatos, o que conflate o papel estrutural de definidor com a entidade humana. A nota introduz um critério de vocabulário: "uso" nomeia a relação em qualquer granularidade; "usuário" é reservado ao humano. Sem isso, L1.1 cria ambiguidade que o próprio princípio precisa evitar.

A árvore precisa de atualizações. Não são correções de erro — são uma consequência e um critério de vocabulário que estão implícitos nos nós existentes mas que merecem registro explícito.

---

## 12. Formulação precisa: cadeia de autoridade e distinção uso/usuário

**Usuário:** Na resposta acima as descrições contêm imprecisões e contradições — dê a escrita correta e clara de cada ideia.

**Assistente:**

**Cadeia de autoridade:**

Ao aplicar "quem pensa manda" em todas as granularidades, a relação de autoridade sempre pode ser rastreada de qualquer artefato de volta ao humano. Não existe artefato cuja forma seja determinada por outro artefato de implementação sem que esse artefato de implementação trace sua própria autoridade de volta ao humano. O humano é o único ponto de origem — a cadeia não tem origens alternativas.

**"Uso" vs "usuário":**

"Uso" nomeia a relação: em qualquer par de artefatos, o lado que pensa define a porta do lado que executa. Essa relação é chamada de uso independente de o artefato pensante ser um humano ou um arquivo-fonte como um Model.

"Usuário" é reservado ao humano — não é reaproveitado para artefatos intermediários.

O princípio se chama "Use Driven" e não "User Driven" precisamente porque o que é generalizado entre granularidades é a *relação de uso*, não a *entidade usuário*. Chamar um Model de "usuário" do Coordinator confundiria os dois conceitos: um Model é um artefato de implementação que ocupa o papel de definidor em uma relação de uso específica — não um agente com intenções próprias como um humano.

---

## 13. Use Driven Design — Design Tree (revisada)

**Usuário:** Escreva a Design Tree atualizada com base nas formulações da seção 12.

**Assistente:**

```md
# Design Tree — Use Driven Design

> Mapa causal de decisões de design: cada nó é uma escolha feita entre alternativas, com racional explícito. Nós-pai constrangem ou habilitam nós-filho.
> Escopo: o meta-princípio apenas — sem referência a implementações específicas.

---

## Nó Raiz

**Decisão:** Quem usa define a forma do que é usado, e essa definição precede a implementação.

**Alternativas:** A implementação define o que é exposto; o uso se adapta ao que existe.

**Racional:** Se o uso é uma consequência da implementação, o artefato foi construído para o executor, não para quem usa — a direção de autoridade está invertida.

**Habilita / Constrange:**
- Habilita identificar, para qualquer relação entre artefatos, qual dos dois é o definidor.
- Constrange a definição da interface a ser feita antes da implementação, sempre.
- Constrange o critério de correção da implementação: ela satisfaz o uso esperado, não o contrário.

---

## L1 — Os Dois Eixos do Princípio

### L1.1 — Direção: quem pensa, usa

**Decisão:** O lado que usa é sempre o lado que toma decisões; o lado que é usado é sempre o lado que executa. "Uso" nomeia essa relação em qualquer granularidade — "usuário" é reservado ao humano.

**Alternativas:** A relação de uso é determinada por conveniência técnica ou fluxo de dados; "usuário" e "lado que usa" são intercambiáveis.

**Racional:** Fluxo de dados e direção de autoridade são dimensões independentes — dados podem fluir em qualquer direção sem determinar quem manda na forma da porta. Usar "usuário" para artefatos intermediários confundiria o papel estrutural de definidor com a entidade humana que origina toda a cadeia de autoridade.

**Habilita / Constrange:**
- Habilita identificar univocamente, em qualquer par de artefatos, quem define a interface.
- Constrange a identificação a depender de separação de responsabilidades: quem executa não decide; quem decide não executa. *(→ L2.1)*
- Habilita aplicar o princípio em qualquer granularidade, do macro ao micro. *(→ L2.2)*

---

### L1.2 — Sequência: o uso precede a implementação

**Decisão:** O artefato que descreve o uso esperado é produzido antes do artefato que o satisfaz.

**Alternativas:** O uso é documentado depois, como descrição do que foi construído.

**Racional:** Documentação posterior descreve a implementação; especificação anterior constrange a implementação — são papéis opostos com consequências opostas para quem tem autoridade.

**Habilita / Constrange:**
- Constrange o artefato de uso a ser escrito em vocabulário do lado que usa, não do executor. *(→ L2.3)*
- Habilita que a implementação seja verificável: ela satisfaz ou não o que foi especificado. *(→ L2.4)*
- Constrange revisões: se a especificação se mostrar impraticável, ela é revisada — nunca silenciosamente absorvida pela implementação.

---

## L2 — Consequências dos Eixos

### L2.1 — Separação de responsabilidades como pré-condição

**Decisão:** O princípio só é aplicável onde responsabilidades estão separadas em nível único.

**Alternativas:** Aplicar UDD a artefatos que misturam decisão e execução.

**Racional:** Sem nível único de responsabilidade, a pergunta "quem pensa?" não tem resposta determinística — e sem essa resposta, a direção da porta é arbitrária.

**Habilita / Constrange:**
- Torna UDD um verificador de separação de responsabilidades: se a direção da porta é ambígua, SRP foi violado.

---

### L2.2 — Uniformidade entre granularidades

**Decisão:** O princípio se aplica identicamente em todas as escalas — da relação humano/sistema até a relação entre dois artefatos internos.

**Alternativas:** O princípio se aplica apenas no nível macro (produto) ou apenas no nível micro (código).

**Racional:** Um princípio que muda de forma entre escalas não é um meta-princípio — é um conjunto de regras ad hoc com superfície em comum.

**Habilita / Constrange:**
- Constrange o vocabulário da porta a variar por escala, mas não a estrutura: quem pensa define a porta, quem executa implementa o adapter. *(→ L2.3)*
- Habilita L2.5: aplicado uniformemente, garante que o humano seja a única origem de toda cadeia de autoridade.

---

### L2.3 — O vocabulário da porta é determinado pelo adapter

**Decisão:** A porta é expressa na linguagem adequada para verificar que o adapter a satisfaz.

**Alternativas:** A porta é sempre expressa no mesmo vocabulário independente da natureza do adapter.

**Racional:** Se o adapter é verificado por máquina, a porta pode ser formal; se o adapter é verificado por percepção humana, a porta precisa ser legível por humanos — forçar formalidade onde ela não pode ser executada é teatro, não contrato.

**Habilita / Constrange:**
- Explica por que portas para adapters humanos são escritas em prosa: não é preferência, é a consequência do critério de verificação.
- Constrange o formato da especificação ao critério de verificação do adapter, não à preferência do especificador.

---

### L2.4 — A especificação é o critério de correção da implementação

**Decisão:** A implementação está correta se e somente se satisfaz a especificação; divergência é erro da implementação.

**Alternativas:** Divergência entre spec e implementação é resolvida atualizando a spec para refletir o que foi construído.

**Racional:** Se a spec pode ser corrigida para concordar com a implementação, a implementação tem autoridade — e o princípio foi invertido.

**Habilita / Constrange:**
- Torna a especificação auditável independentemente dos testes: um teste que passa mas contradiz a spec está errado.
- Constrange a pergunta "quem testa os testes?" a ter resposta: a especificação.

---

### L2.5 — O humano é a única origem da cadeia de autoridade

**Decisão:** A relação de autoridade deve poder ser rastreada de qualquer artefato de volta ao humano.

**Alternativas:** A autoridade pode ter múltiplas origens — um artefato de implementação pode ser fonte de autoridade para outro sem que essa cadeia trace de volta ao humano.

**Racional:** Se existe um artefato cuja forma é determinada por outro artefato de implementação sem que esse segundo trace sua própria autoridade de volta ao humano, existe um galho na cadeia onde a ponta é a implementação — o princípio foi violado nesse galho.

**Habilita / Constrange:**
- Constrange qualquer decisão de design a ser verificável: para toda porta definida no sistema, existe um caminho de autoridade que leva ao humano.
- Torna a pergunta "para quem este artefato existe?" sempre respondível — e a resposta correta sempre traça de volta ao humano.
```
