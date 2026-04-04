# Etapa 1 — Identificação e Delimitação do Problema Normativo

> Execução da primeira etapa da análise normativa em filosofia analítica em defesa de UseDD. Segue o padrão MIT/NYU/Oxford/ANU: formular a questão com precisão antes de tudo. Produzido a partir da matéria prima consolidada (Partes 1 e 2).

---

## 1. A questão bruta

O desenvolvimento de software produz, rotineiramente, artefatos cuja forma constrange o que humanos podem fazer, entender ou manter. A direção predominante dessa relação é: o humano adapta-se ao sistema mais do que o inverso. UseDD propõe que essa direção deveria ser invertida — ou, mais precisamente, que a autoridade sobre a forma de cada entidade no sistema deveria residir no humano que a usa.

A questão bruta:

> Quem deveria ter autoridade sobre a forma de um artefato de software — o humano que usa ou a implementação que executa?

---

## 2. Por que a questão é filosoficamente problemática

A pergunta, como formulada, carrega pelo menos seis ambiguidades que a tornam inadequada para análise direta.

**2.1 — "Autoridade" é ambígua.** Pode significar autoridade causal (quem de fato determina), autoridade normativa (quem deveria determinar), ou autoridade prática (quem tem condições de determinar). A questão transita entre as três sem distingui-las. UseDD faz uma afirmação normativa — quem *deveria* — mas a evidência que a motiva é causal — quem de fato determina.

**2.2 — "Forma" unifica fenômenos distintos.** A forma de uma entidade de software inclui: sua interface pública, seu comportamento observável, seus constrangimentos sobre o consumidor, e sua estrutura interna. Autoridade sobre qual desses aspectos? O princípio precisa ser claro sobre o que conta como "forma" no sentido relevante.

**2.3 — "Humano que usa" pressupõe unicidade.** Mas há pelo menos dois humanos que usam diretamente: o usuário do produto (runtime) e o desenvolvedor (build-time). Esses humanos podem ter interesses conflitantes. A questão, como formulada, não distingue qual humano, nem como resolver conflitos entre eles.

**2.4 — A questão parece auto-respondível.** Formulada como "quem deveria ter autoridade — o humano ou a implementação?", a resposta "o humano" parece trivialmente correta. Isso é sinal de que a questão não está suficientemente precisa. A versão não-trivial precisa identificar exatamente onde está a disputa genuína.

**2.5 — Há uma reivindicação empírica embutida.** A questão pressupõe que a implementação de fato adquire autoridade. Isso é uma afirmação sobre o que ocorre na prática, não sobre o que deveria ocorrer. Se o fenômeno não existe, a norma é ociosa.

**2.6 — Há compromissos de valor não declarados.** A seleção lexical do material — "constrangimento", "negligência", "adaptação silenciosa" — carrega juízos de valor apresentados como descrição. A camada valorativa opera sem controle porque não é reconhecida. A análise normativa que se construir sobre esse material herda esses compromissos e precisa examiná-los, não absorvê-los silenciosamente.

---

## 3. Desagregação: o mapa de questões embutidas

Seguindo o método de Frances Kamm — produzir um *question map* antes de qualquer argumento — a questão composta se decompõe em pelo menos seis questões distintas:

| # | Questão | Tipo | Status nesta análise |
|---|---|---|---|
| Q1 | O que é "autoridade sobre a forma" no contexto de design de software? | Conceitual | **Tratada** como instrumento — necessária para que a tese seja precisa |
| Q2 | A implementação de fato adquire autoridade sobre a forma na prática corrente? | Empírica-descritiva | **Assumida** — o fenômeno é pressuposto, não provado |
| Q3 | Quando há conflito, o humano que usa deveria ter autoridade sobre a forma? | Normativa de primeira ordem | **Central** — esta é a questão que a análise responde |
| Q4 | Essa reivindicação vale uniformemente em todas as granularidades? | De escopo | **Subsidiária** — tratada como consequência da resposta a Q3 |
| Q5 | UX e DX pertencem ao mesmo espaço normativo? | De unificação | **Subsidiária** — precisa ser defendida para que o princípio seja único |
| Q6 | Restrições reais alteram a reivindicação normativa? | De limites | **Subsidiária** — tratada como caso de teste da resposta a Q3 |

**Questão selecionada: Q3.** As demais são tratadas na medida em que servem a Q3 ou são pressupostas por ela. Q1 é instrumento; Q2 é assumida; Q4, Q5 e Q6 são consequências a defender.

---

## 4. Tipo de questão normativa

A questão central é de **primeira ordem normativa**, aplicada ao domínio do design de software.

- **Não é metaética** — não pergunta o que significa "deveria" ou se existem fatos normativos sobre design.
- **Não é puramente conceitual** — não pergunta apenas o que "autoridade" significa, embora precise dessa clarificação como ferramenta.
- **Não é empírica** — não pergunta se a inversão ocorre (assume que sim), mas se é normativamente problemática.

A questão usa análise conceitual como instrumento (definir "autoridade", "forma", "uso", "cadeia"), mas o alvo é um julgamento normativo: *dada* a existência do fenômeno, *deveria* a autoridade residir no humano?

Nos termos do padrão de Princeton: *"This is a first-order normative question applied to software design. I bracket metaethical questions about the nature of normative facts in technical domains, and empirical questions about the frequency of the phenomenon."*

---

## 5. O explanandum — especificação cirúrgica

Seguindo a exigência de Oxford — uma única frase, sem subordinadas, defendível oralmente antes de qualquer outra coisa:

> **No desenvolvimento de software, decisões técnicas adquirem autoridade de fato sobre a forma do sistema em lugar do humano que o usa.**

O explanandum **não é** "software ruim" em geral. Não é "falta de usabilidade". Não é "dívida técnica". É especificamente o fenômeno de **transferência de autoridade**: a implementação, seus constrangimentos ou suas conveniências passam a determinar a forma — e o humano (usuário ou desenvolvedor) adapta-se.

O que torna esse explanandum um problema normativo (e não apenas mecânica técnica) é a presença de compromissos de valor. O material original os carrega sem declará-los; esta análise os declara explicitamente (→ §8).

### Traços recorrentes do fenômeno (assumidos, não provados)

- A adaptação do humano ao sistema é frequente e muitas vezes silenciosa.
- Quem decide costuma estar menos exposto às consequências do que quem as sofre.
- O construtor futuro sofre o efeito das decisões do construtor presente.
- O efeito emerge sem culpado individual, por acúmulo de decisões localmente razoáveis.
- A experiência humana muitas vezes nem entra no campo de consideração da decisão técnica.

---

## 6. A questão reformulada

Versão técnica, que será tratada nas etapas subsequentes:

> **Dado que software é artefato cuja razão de existir é servir um humano (P0 assumida), e dado que decisões técnicas de fato constrangem o que humanos podem fazer com o artefato (fenômeno assumido): é normativamente requerido que a autoridade sobre a forma de cada entidade trace de volta ao humano que a usa, através de uma cadeia ininterrupta de relações de uso?**

Essa formulação é:
- **precisa** o suficiente para ser refutável (→ §10);
- **escopo-delimitada** o suficiente para ser tratável (→ §9);
- **não-trivial** porque inclui "cadeia ininterrupta" e "cada entidade" — reivindicações fortes sobre escopo e continuidade, não apenas sobre a fronteira do sistema.

---

## 7. Concessão ao oponente (movimento à Thomson)

Seguindo o método de Thomson em *A Defense of Abortion* — assumir a premissa mais favorável ao oponente e ainda assim argumentar — esta análise concede, para fins do argumento:

1. **Restrições são reais e pervasivas.** Nem toda decisão pode otimizar para o humano. Restrições de tempo, tecnologia, competência e recursos limitam as soluções disponíveis.

2. **Conhecimento de implementação é valioso.** O construtor possui informação que o humano que usa não tem, e essa informação pode melhorar decisões de forma.

3. **Servir o humano tem custo.** Especificar antes de implementar, manter vocabulário do decisor, respeitar a cadeia — são atividades que consomem recursos.

4. **O fenômeno nem sempre é grave.** Em muitos casos, a adaptação do humano ao sistema é aceitável, barata ou imperceptível.

A questão que resta, mesmo após essas concessões: **segue-se daí que a implementação deveria ter autoridade sobre a forma?**

UseDD sustenta que não — que restrições limitam soluções mas não transferem autoridade. Custos reais mudam o que é factível, não quem decide. A análise subsequente precisa defender essa distinção.

---

## 8. Compromissos normativos declarados

O material consolidado carrega compromissos de valor que operam no enquadramento do explanandum. A passagem do factual ao valorativo no material original é realizada por meios retóricos: "constrangimento" (normativo disfarçado de descritivo), "silenciosa" (factual com implicação valorativa), "retroalimentação" (conotação de patologia).

Em vez de herdar esses compromissos silenciosamente, esta análise os declara como premissas que devem ser assumidas ou defendidas:

| # | Compromisso | Status |
|---|---|---|
| C1 | Experiência humana é critério normativamente relevante em decisões técnicas | **Assumido** — sem ele, o fenômeno é mecânica neutra, não problema normativo |
| C2 | Impor ônus humanos evitáveis ou opacos conta contra a decisão que os produz | **A defender** |
| C3 | Transferir custo do decisor para o afetado exige justificação | **A defender** |
| C4 | Visibilidade entre decisão e consequência é um bem normativo | **A defender** |
| C5 | Competência para antecipar experiência humana é virtude profissional relevante | **Assumido** |
| C6 | Restrições reais têm peso deliberativo, mas não autoridade normativa própria | **A defender** — central para UseDD |
| C7 | Usuário do produto e desenvolvedor pertencem ao mesmo espaço normativo | **A defender** — necessário para unificação do princípio |

C1 e C5 são assumidos porque rejeitá-los dissolve o problema (não há fenômeno normativo a tratar). C2, C3, C4, C6 e C7 precisam de defesa nas etapas subsequentes — são o núcleo do trabalho argumentativo.

---

## 9. Condições de contorno

### Dentro do escopo

- Relações de autoridade no design de software, do nível produto ao nível interno do código.
- A normatividade derivada da definição funcional do artefato (P0), não de uma ética geral.
- Os dois humanos diretamente envolvidos: usuário do produto (runtime) e desenvolvedor (build-time).
- A reivindicação de que a cadeia de autoridade deve ser contínua e remontar ao humano.

### Fora do escopo (bracketed)

| Item | Razão |
|---|---|
| Metaética geral | A análise opera dentro de cognitivismo normativo para domínios técnicos, sem defendê-lo |
| Frequência empírica do fenômeno | Assumido com base em reconhecimento por praticantes competentes; não provado estatisticamente |
| Genealogia de TDD, API-first, DIP | UseDD não explica por que existem; compartilha superfície, não fundação |
| Governança organizacional | A questão é sobre autoridade de design, não sobre quem manda em um time |
| Julgamento de stacks ou linguagens | O princípio é agnóstico em relação a tecnologia específica |
| Stakeholders mediados | PM, empresa, investidores são proxies ou mediações, não raízes de autoridade |

### Premissa fundacional — P0

**Software é artefato cuja razão de existir é servir um humano.**

Tratada como **analítica** — contida na definição de "artefato". Não afirma "software deveria servir humanos" (ought); afirma "software que não serve humanos não é software no sentido relevante para o princípio" (is). A normatividade de UseDD vem da definição do objeto, não de um dever moral externo.

**Risco:** se P0 é genuinamente analítica ou se contrabandeia um compromisso normativo é questão metaética que esta análise bracketa. Para quem rejeita P0, o argumento não começa — e isso é um limite honesto, não uma falha.

### Premissa axiomática — P1

**Em cada par de uso, a autoridade é direcional e assimétrica.**

**Escolha de modelagem**, não descoberta empírica. UseDD escolhe tratar relações de uso como assimétricas e resolver aparente simetria por decomposição. Axiomas declarados são mais fortes que axiomas disfarçados de observações — a honestidade sobre o status de P1 é uma virtude do framework, não uma fraqueza.

---

## 10. Teste de refutabilidade

A tese de UseDD seria refutada se fosse demonstrado que:

**10.1 — Autoridade da implementação serve igualmente bem.** Se a forma definida pela implementação servir ao humano tão bem ou melhor — e isso ocorrer *não acidentalmente* (por razão estrutural, não por sorte) — então a reivindicação de que a autoridade deve residir no humano perde força. A qualificação "não acidentalmente" é essencial: sucessos pontuais não refutam; um mecanismo que garanta isso, sim.

**10.2 — A cadeia é intraçável.** Se for demonstrado que a autoridade não pode, mesmo em princípio, ser rastreada ao humano em sistemas de software reais — que a complexidade ou a natureza do medium impede a cadeia — então UseDD prescreve algo impossível. (Ought implies can.)

**10.3 — UX e DX são normativamente incomensuráveis.** Se for demonstrado que a relação de uso do produto e a relação de uso do código não compartilham estrutura normativa suficiente para que um princípio único as cubra, UseDD perde sua reivindicação de unificação e se fragmenta em dois princípios sem conexão.

**10.4 — Restrições possuem autoridade normativa própria.** Se for demonstrado que restrições técnicas não são apenas insumo deliberativo mas possuem autoridade legítima para determinar a forma — isto é, que "não dá pra fazer" implica "não deveria ser assim" — então a hierarquia de UseDD (humano acima de restrição) colapsa.

Esses quatro cenários são suficientemente concretos para que a tese seja genuinamente refutável — passa no teste de delimitação.

---

## 11. Riscos e pontos cegos identificados

**11.1 — "Constrangimento" como categoria unificada.** O material usa "constrangimento" para cobrir fenômenos categorialmente distintos: impossibilidade (binária), dificuldade (gradual), confusão (epistêmica), custo (temporal). Se essa unificação for ilegítima, o explanandum descreve vários problemas, não um — e o princípio pode valer para alguns mas não outros. *Decisão necessária:* a análise subsequente deve declarar o critério de unificação ou tratar as categorias separadamente.

**11.2 — Trivialidade potencial.** Se "servir o humano" for definido de forma suficientemente ampla, qualquer decisão técnica pode ser reinterpretada como servindo algum humano de alguma forma. A tese precisa de um critério de demarcação entre servir genuinamente e racionalizar. *Candidato:* a relação decisor→executor e a precedência temporal (porta antes de implementação) funcionam como esse critério — mas precisam de defesa.

**11.3 — Analiticidade de P0.** A afirmação de que P0 é analítica pode ser contestada: artefatos podem ter propósitos que não são servir humanos (arte autotélica, software experimental, IA autônoma). Se P0 não é analítica, a normatividade de UseDD precisa de outra fundação. *Decisão:* limite honesto do escopo — "para software no sentido de P0, o princípio vale; para outros sentidos de software, a análise não se pronuncia."

**11.4 — Exaustividade dos dois humanos.** O framework reconhece dois humanos diretos (usuário do produto, desenvolvedor). Mas e operadores, administradores, auditores? São proxies, mediações, ou humanos com autoridade própria? *Decisão:* tratados como mediações cujas portas são do desenvolvedor, salvo argumento específico em contrário.

**11.5 — Presunção de deliberador racional.** A análise pressupõe que decisões de design são feitas por agentes que deliberam. Haidt (*The Righteous Mind*, 2012) e Greene (*Moral Tribes*, 2013) mostram que julgamentos humanos frequentemente são intuitivos e racionalizados depois. Se decisões de design seguem o mesmo padrão, a prescrição "trace a autoridade ao humano" pode ser mais difícil de implementar do que o princípio sugere. *Decisão:* bracketed — o princípio prescreve uma norma, não descreve um processo cognitivo. A objeção é de implementação, não de validade.

---

## 12. Estrutura do argumento subsequente

Com base nesta delimitação, as etapas seguintes deverão:

**Etapa 2 — Análise conceitual.** Definir com precisão: autoridade, forma, uso, cadeia, porta. Resolver as ambiguidades identificadas em §2. Responder a Q1.

**Etapa 3 — Defesa da tese central.** Argumentar que, dado P0 e P1, a autoridade sobre a forma deveria residir no humano (Q3). Defender C2, C3, C4, C6 e C7. Tratar as concessões ao oponente (§7) como casos de teste.

**Etapa 4 — Extensão e escopo.** Mostrar que a tese se estende a todas as granularidades (Q4), que UX e DX pertencem ao mesmo espaço normativo (Q5), e que restrições limitam mas não transferem autoridade (Q6).

**Etapa 5 — Objeções e respostas.** Tratar os quatro cenários de refutação (§10), os casos de objeção conhecidos, e os riscos identificados (§11).

**Etapa 6 — Equilíbrio reflexivo.** Testar a coerência entre a tese, suas consequências e os juízos particulares que engenheiros competentes compartilham. Ajustar onde necessário.
