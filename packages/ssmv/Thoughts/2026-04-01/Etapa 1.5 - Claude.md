# Etapa 1.5 — Clarificação Conceitual

> Complemento à Etapa 1. Formaliza os conceitos que a delimitação deixou em aberto: o que é software no sentido relevante, quem são os humanos, o que é experiência de interação, o que é "melhor possível", e como tudo isso sustenta P0 e unifica UX/DX. Sem essa clarificação, a Etapa 2 operaria sobre termos ambíguos.

---

## 1. A formulação-semente

> Um software será criado; se um humano irá interagir com ele no futuro, ele deve ser feito para proporcionar a melhor experiência de interação possível para esse humano.

Essa frase contém cinco conceitos operativos, um operador normativo e uma estrutura condicional. A análise a seguir decompõe cada um, define-o com precisão, resolve as ambiguidades herdadas da Etapa 1, e identifica o que a formulação resolve e o que ainda não resolve.

---

## 2. Decomposição formal

| Elemento | Trecho | Papel |
|---|---|---|
| Contexto | "Um software será criado" | Situa a obrigação no momento da criação — decisões estão sendo tomadas |
| Condição | "se um humano irá interagir com ele no futuro" | Ativa a obrigação; indexa ao humano específico |
| Operador normativo | "deve ser feito" | A obrigação recai sobre o ato de fazer, não sobre o artefato depois de pronto |
| Alvo | "para proporcionar a melhor experiência de interação possível" | O standard normativo + qualificador de factibilidade |
| Indexação | "para esse humano" | A experiência é avaliada do ponto de vista do humano específico, não em abstrato |

---

## 3. Conceito: Software

### Definição operativa

Software, no sentido relevante para esta análise, é qualquer artefato composto de código que será executado ou consumido, em qualquer granularidade onde há um humano que interage com sua superfície.

Isso cobre: aplicações, bibliotecas, APIs, módulos, funções, componentes. Não cobre: código que nenhum humano jamais verá ou usará (se tal coisa existir, está fora do escopo por não satisfazer a condição da formulação).

### Relação com P0

P0 afirma: "software é artefato cuja razão de existir é servir um humano." A formulação-semente operacionaliza P0: o que significa "servir" é proporcionar a melhor experiência de interação possível para cada humano que interage. "Servir" deixa de ser vago — tem conteúdo: diz respeito à experiência na superfície de contato entre humano e artefato.

### Sobre a analiticidade

A formulação preserva o caráter analítico de P0 mas o torna mais transparente. Não diz "software deveria servir humanos" (ought externo). Diz: se o artefato terá interação humana, essa interação tem propriedades que podem ser melhores ou piores; a obrigação é otimizar essas propriedades. A normatividade vem da definição de "criar um artefato para interação humana" — quem cria algo para ser usado por humanos e ignora a experiência desse uso contradiz o propósito declarado do próprio ato.

Para software que não terá interação humana (se existir), a formulação não se pronuncia — a condição não se satisfaz. Isso resolve o risco 11.3 da Etapa 1 sem precisar defender que todo software serve humanos.

---

## 4. Conceito: Humano

### Quem satisfaz a condição "irá interagir"

Humano, no sentido relevante, é qualquer pessoa que engajará diretamente com uma superfície do artefato. "Diretamente" significa: o humano interage com a superfície do artefato, não com uma representação ou relato sobre ele.

Os dois humanos primários identificados por UseDD são:

| Humano | Modo de interação | Quando |
|---|---|---|
| **Usuário do produto** | Usa o sistema: inputa, navega, lê outputs, experimenta comportamento | Runtime |
| **Desenvolvedor** | Usa o código: lê, chama APIs, compõe, testa, depura, mantém | Build-time |

### Por que exatamente dois

A distinção não é por papel organizacional, mas por **superfície de contato**. O software tem duas superfícies fundamentais: a interface de uso (o que o produto expõe) e a interface de código (o que o código expõe). Cada superfície tem um humano que interage com ela. Outros papéis (PM, designer, gerente) não interagem diretamente com nenhuma dessas superfícies — interagem com representações (wireframes, documentos, dashboards), que são eles mesmos artefatos com suas próprias superfícies e seus próprios humanos.

### Casos de fronteira

**O mesmo humano em dois papéis.** Um desenvolvedor solo é simultaneamente usuário do produto e desenvolvedor. A formulação aplica-se a cada interação independentemente — quando usa o produto, é usuário do produto; quando lê o código, é desenvolvedor. São duas instâncias da condição, não uma.

**Humanos futuros.** "Irá interagir no futuro" cobre o desenvolvedor que lerá o código daqui a seis meses — inclusive o próprio autor. Ele é um humano que irá interagir; sua experiência importa. O gap temporal entre decisão e interação não elimina a obrigação; apenas torna-a mais difícil de cumprir (o decisor precisa antecipar).

**Operadores, administradores, auditores.** Se interagem diretamente com uma superfície do software (painel de controle, CLI de deploy, interface de logs), são humanos no sentido relevante — a formulação cobre. Se interagem por mediação (leem relatórios gerados por outros), a mediação é o artefato relevante, não o software original.

### Resolução de C7 (UX e DX no mesmo espaço normativo)

A formulação não distingue entre tipos de humano na condição — diz "um humano", não "o usuário final". Se o desenvolvedor irá interagir com o código, a obrigação se aplica com a mesma estrutura. UX e DX não são o mesmo fenômeno, mas são instâncias da mesma relação normativa: humano interage com superfície de artefato, e a experiência nessa superfície deve ser a melhor possível.

A unificação não é por identidade de conteúdo (UX ≠ DX), mas por identidade de estrutura normativa: nos dois casos, há um humano, uma superfície, e uma experiência que pode ser melhor ou pior.

---

## 5. Conceito: Interação

### Definição

Interação é a relação em que um humano engaja com a superfície de um artefato de software.

### Modos de interação

| Modo | Exemplos | Superfície |
|---|---|---|
| **Usar** | Executar, navegar, inputar, ler output | Interface do produto |
| **Consumir** | Chamar API, importar módulo, compor componentes | Interface do código (pública) |
| **Manter** | Ler, depurar, modificar, estender | Interface do código (interna) |

Todos os três modos são interações no sentido relevante. Em todos, o humano encontra uma superfície cujas propriedades afetam sua experiência.

### O que não é interação no sentido relevante

- **Ser afetado indiretamente.** Um usuário que sofre com lentidão causada por um banco de dados não interage com o banco — interage com o produto. A superfície relevante é a do produto, não a do banco. (O banco tem seus próprios humanos: os desenvolvedores que interagem com sua API.)
- **Decidir sobre, sem engajar com.** Um CTO que decide adotar um framework não está interagindo com o framework até que o use. A decisão meta-nível opera sobre representações, não sobre a superfície.

Essa delimitação resolve uma potencial inflação do conceito: "interação" não é qualquer relação causal com o software, é engajamento com uma superfície.

---

## 6. Conceito: Experiência de interação

### Definição

A experiência de interação é o conjunto de propriedades da superfície de um artefato tal como impactam a capacidade do humano de realizar seu propósito com o artefato.

Não é sentimento subjetivo puro (embora o inclua). Não é propriedade objetiva do artefato isolado (depende do humano específico). É a interface entre os dois: as propriedades da superfície *na medida em que* afetam *este* humano.

### Dimensões (exemplos representativos)

A experiência de interação possui múltiplas dimensões. Identificar e catalogar exaustivamente essas dimensões é uma análise que pertence à área atualmente nomeada UX (e suas vertentes como DX) — não é objeto desta etapa. Contudo, para tornar o conceito operável, seguem exemplos representativos de dimensões que essa experiência pode ter:

| Dimensão | O que responde | Exemplo UX | Exemplo DX |
|---|---|---|---|
| **Capacidade** | O que o humano consegue fazer? | Funções acessíveis no produto | Operações disponíveis na API |
| **Compreensibilidade** | O que o humano consegue entender? | Interface revela seu estado | Assinatura revela sua intenção |
| **Esforço** | Quanto o humano precisa investir? | Passos, cliques, carga cognitiva | Boilerplate, edge cases, configuração |
| **Previsibilidade** | O artefato se comporta como o humano espera? | Comportamento consistente | Contrato cumprido, sem surpresas |
| **Relevância** | O artefato endereça a necessidade real do humano? | Resolve o problema certo | API encaixa no caso de uso real |

Esses exemplos não esgotam o espaço dimensional — outras dimensões relevantes podem existir e sua identificação completa é competência da disciplina de UX/DX. O que importa para esta análise é a estrutura: a experiência de interação é multidimensional, as mesmas dimensões (quaisquer que sejam) aplicam-se tanto a UX quanto a DX — o conteúdo muda (botões vs. funções), a estrutura não. Isso confirma C7 por via concreta: são dimensões da interação humano-artefato, não exclusivas de um tipo de humano.

### O que isso resolve

O risco 11.1 da Etapa 1 (constrangimento como categoria unificada) encontra aqui seu critério de unificação: "constrangimento" é qualquer propriedade da superfície que degrada uma ou mais dimensões da experiência de interação para o humano. A impossibilidade degrada capacidade; a dificuldade degrada esforço; a confusão degrada compreensibilidade; o custo temporal degrada esforço. Esses são exemplos — outras degradações em outras dimensões são possíveis. O que unifica "constrangimento" como categoria é o espaço dimensional da experiência, não a enumeração de formas específicas de degradação.

---

## 7. Conceito: Melhor possível

### Decomposição em dois componentes

**"Possível"** é o qualificador de factibilidade. Define o espaço de alternativas sobre o qual "melhor" opera. Uma alternativa é excluída desse espaço apenas por fatores que estão fora do controle do decisor — fatores que ele não pode superar por decisão, vontade ou diligência. Exemplos: o medium não suporta (impossibilidade técnica), os recursos são genuinamente insuficientes (restrição de recurso), o estado da arte não sabe como (limite de conhecimento).

A definição tem um corolário direto: qualquer fator que esteja sob o controle do decisor — sua preferência, sua inércia, sua atenção, sua disposição de investigar — **não** exclui alternativas do espaço factível. Se o decisor não levantou alternativas por falta de diligência, essas alternativas não se tornam "impossíveis" — permanecem no espaço factível. Se o decisor prefere uma alternativa por conveniência de implementação, a alternativa preterida não se torna "infactível" — permanece disponível.

Em resumo: "possível" é definido pela fronteira entre o que o decisor pode controlar e o que não pode. Tudo aquilo dentro do seu controle permanece no espaço de alternativas; tudo aquilo fora do seu controle pode legitimamente reduzir esse espaço.

**"Melhor"** é o superlativo dentro do espaço factível assim definido. Entre todas as alternativas que não foram excluídas por fatores fora do controle do decisor, a que proporciona a experiência mais favorável ao humano nas dimensões da experiência de interação. Não é "aceitável" nem "suficiente" — é o máximo atingível dentro desse espaço.

### Ilustrações da fronteira

Do conceito acima decorrem naturalmente dois grupos:

**Fatores que excluem alternativas (fora do controle do decisor):**

| Tipo de restrição | Natureza | Efeito |
|---|---|---|
| **Impossibilidade técnica** | O medium não suporta | Elimina a alternativa do espaço factível |
| **Restrição de recurso** | Tempo, dinheiro, pessoas genuinamente insuficientes para *esta* alternativa | Elimina a alternativa do espaço factível |
| **Limite de conhecimento** | O estado da arte não sabe como | Elimina a alternativa do espaço factível |

**Fatores que não excluem alternativas (sob o controle do decisor):**

| O que parece limitar | Por que não exclui |
|---|---|
| **Conveniência de implementação** | Preferência do executor — está sob seu controle |
| **Hábito** | Inércia — está sob seu controle mudar |
| **Desconhecimento por omissão** | Falta de diligência do decisor, não limite do estado da arte — investigar está sob seu controle |
| **Presunção de escala** | Hipótese não testada — verificar está sob seu controle |

Esses grupos não são listas adicionais ao conceito — são consequências diretas da definição. A distinção central permanece: **restrições que estão fora do controle do decisor reduzem o espaço de alternativas; fatores sob seu controle não o reduzem e não transferem autoridade sobre qual alternativa é escolhida.** Dentro do que é possível, o critério de escolha é sempre a experiência do humano.

### Consequências

1. "Melhor possível" é um standard de direção, não de threshold. Não pergunta "passou de um mínimo aceitável?" — pergunta "existe alternativa que o decisor poderia ter adotado (i.e., não excluída por fatores fora do seu controle) e que sirva melhor este humano?"

2. Quando uma restrição genuína (fora do controle do decisor) elimina a alternativa ideal, a obrigação não desaparece — desloca-se para a melhor alternativa restante. A pergunta passa de "como servir o humano?" para "dado este limite real, qual a melhor forma *ainda disponível* de servir este humano?" A mudança é no conjunto de opções, não no critério de seleção.

3. Isso resolve o risco 11.2 da Etapa 1 (trivialidade). "Servir o humano" não é vago — é mensurável: a experiência nas suas múltiplas dimensões, para o humano específico, entre as alternativas factíveis. A formulação tem critério de demarcação: uma decisão que preteriu alternativa factível superior (na experiência do humano) por um fator sob o controle do decisor viola o princípio. Uma decisão que escolheu a melhor alternativa factível, mesmo que imperfeita, satisfaz o princípio.

---

## 8. A estrutura condicional: "se... no futuro"

### Função lógica

A condição "se um humano irá interagir" faz três coisas:

**8.1 — Torna a obrigação condicional, não categórica.** A fonte da obrigação é a perspectiva de interação humana, não uma propriedade intrínseca do código. Código que nenhum humano jamais verá, usará ou manterá (se existir) fica fora do escopo — a condição não se satisfaz.

**8.2 — É futura.** "Irá interagir" coloca a obrigação no momento da decisão de design — antes da interação acontecer. O decisor deve antecipar. O gap temporal entre decisão e consequência não elimina a obrigação; é a razão pela qual a obrigação existe (sem gap, não haveria risco de negligenciar a experiência futura).

**8.3 — É trivialmente satisfeita para software sob P0.** Todo software no sentido relevante terá pelo menos um humano que interage: o desenvolvedor. A condição é portanto universalmente satisfeita para o domínio desta análise. Mas a forma condicional é preferível à afirmação categórica porque fundamenta a obrigação num fato contingente (haverá interação) e não numa metafísica (código tem deveres).

### Multiplicidade

A formulação diz "um humano" — singular. Mas na prática, múltiplos humanos irão interagir. A leitura correta é distributiva: **para cada humano** que irá interagir, a obrigação se aplica. O software deve proporcionar a melhor experiência possível *para cada um*.

### Conflito entre humanos

Quando a melhor experiência para o humano A é incompatível com a melhor experiência para o humano B, a formulação-semente sozinha não resolve. A formulação é distributiva ("para cada humano"), mas não prescreve um critério de priorização quando as obrigações distribuídas entram em conflito.

Esse é um **ponto em aberto** que requer resolução em etapas posteriores: qual é o critério de sequência ou prioridade quando otimizar a experiência para um humano constrange o espaço de otimização para outro?

---

## 9. O operador normativo: "deve"

"Deve ser feito" coloca a obrigação no ato de criação. Não é uma propriedade que o artefato tem ou não tem — é uma obrigação do agente que decide.

Isso tem uma consequência importante: o sujeito da obrigação não é o software, é o decisor. Quem quer que tome decisões que afetam a forma do artefato — o desenvolvedor, o arquiteto, o designer — carrega a obrigação. Se a decisão for tomada por inércia, hábito ou por default do framework, a obrigação não desaparece — foi negligenciada.

A obrigação é **pro tanto** (não absoluta). Pode ser sobreposta por restrições genuínas. Mas o ônus é de quem deixa de cumprir: precisa justificar por que a alternativa que melhor servia o humano não foi a adotada. Essa inversão do ônus é central: o default não é "qualquer decisão é permissível até que se prove problemática" — o default é "a decisão deve otimizar para o humano, e desvios precisam de justificação."

---

## 10. Reformulação com precisão

A formulação-semente, após análise, admite uma versão mais precisa:

> **Para cada humano que irá interagir com um artefato de software, o artefato deve ser feito para proporcionar, entre as alternativas não excluídas por fatores fora do controle do decisor, a experiência de interação que melhor atende esse humano nas múltiplas dimensões dessa experiência.**

Essa versão:
- torna a multiplicidade explícita ("para cada humano");
- especifica o que "possível" significa (alternativas não excluídas por fatores fora do controle do decisor — tornando a distinção entre restrição legítima e conveniência emergente do conceito);
- especifica o que "melhor" significa (a experiência mais favorável nas dimensões da interação, sem prescrever uma lista fechada dessas dimensões);
- não acrescenta complexidade desnecessária à formulação-semente — apenas desfaz ambiguidades.

**Pontos que a reformulação não resolve** (remetidos a etapas posteriores):
- Critério de priorização quando a otimização para um humano conflita com a de outro (§8);
- Método de verificação empírica do standard (§12.4);
- Ponderação entre dimensões conflitantes (§12.5).

---

## 11. Mapa de resoluções

| Conceito aberto na Etapa 1 | Onde foi resolvido | Como |
|---|---|---|
| P0 — "servir um humano" era vago | §3 | Operacionalizado: proporcionar a melhor experiência de interação possível |
| 2.1 — "Autoridade" ambígua | §9 | Clarificado: obrigação normativa do decisor, não autoridade causal |
| 2.2 — "Forma" unifica fenômenos | §6 | Decomposta em dimensões da experiência de interação (exemplos representativos, não lista fechada) |
| 2.3 — Multiplicidade de humanos | §4, §8 | Dois humanos primários; formulação distributiva; **critério de priorização em conflito permanece em aberto** |
| 2.4 — Questão auto-respondível | §7 | A versão não-trivial é sobre o que constrange o "possível" — a distinção entre restrição legítima e conveniência emerge da definição (fronteira do controle do decisor) |
| C7 — UX/DX mesmo espaço | §4, §6 | Mesma estrutura normativa: humano + superfície + dimensões da experiência |
| 11.1 — "Constrangimento" unificado | §6 | Critério: degradação de dimensões num espaço dimensional comum (não enumeração fechada) |
| 11.2 — Trivialidade potencial | §7 | Critério de demarcação: alternativa factível superior preterida por fator sob o controle do decisor |
| 11.3 — Analiticidade de P0 | §3 | Condicional preserva analiticidade; software sem interação humana fica fora do escopo |
| C6 — Restrições não têm autoridade | §7 | Restrições fora do controle do decisor reduzem alternativas; fatores sob seu controle não transferem autoridade |

---

## 12. O que ainda não está resolvido

**12.1 — Defesa dos compromissos C2, C3, C4.** A formulação assume que ônus opacos contam contra a decisão (C2), que transferir custo exige justificação (C3), e que visibilidade é normativa (C4). Esses compromissos receberam conteúdo mais preciso (→ dimensões, factibilidade, ônus de justificação), mas não foram *defendidos*. A defesa é tarefa da Etapa 3.

**12.2 — A cadeia de autoridade.** A formulação-semente trata cada interação humano-artefato como unidade isolada. Mas software real é composto: módulos dependem de módulos, e decisões em um ponto afetam a experiência em outros. Resta em aberto se a obrigação formulada aqui requer alguma propriedade estrutural sobre como as decisões se conectam ao longo da cadeia de composição — e, em caso afirmativo, qual é essa propriedade e como se defende.

**12.3 — Precedência temporal.** "Deve ser feito" implica que a obrigação é no momento da criação. Mas UseDD faz uma reivindicação mais forte: a porta *precede* a implementação. A formulação-semente é compatível com essa sequência mas não a exige. A defesa da precedência é tarefa da Etapa 3.

**12.4 — Verificação empírica de "melhor possível".** O standard é claro conceitualmente, mas como o decisor sabe que escolheu a melhor alternativa factível? A formulação estabelece o critério (melhor experiência entre alternativas não excluídas por fatores fora do controle), mas não oferece um método de verificação. Resta em aberto: qual é o procedimento pelo qual o decisor pode verificar, antes ou depois da implementação, que sua escolha satisfaz o standard?

**12.5 — Peso relativo das dimensões.** As dimensões da experiência de interação podem conflitar entre si (por exemplo, mais capacidade pode exigir mais esforço). A formulação não prescreve como ponderar essas dimensões quando entram em conflito. Resta em aberto: quem define os pesos e com base em que critério?

---

## Log de revisões

### Revisão 1 — 2026-04-02

**Versão anterior continha:**

- §6: As cinco dimensões (capacidade, compreensibilidade, esforço, previsibilidade, relevância) eram apresentadas como lista completa e definitiva, com a frase "As mesmas cinco dimensões aplicam-se a UX e DX".
- §7: A definição de "melhor" usava a frase "não há alternativa conhecida que sirva melhor o humano e que tenha sido preterida sem justificação". As tabelas "O que constrange o possível" e "O que não constrange o possível" eram apresentadas como condições adicionais ao conceito, não como consequências dele.
- §8 "Conflito entre humanos": Citava UseDD (L2.9) diretamente e apresentava a regra de sequência (usuário primeiro, desenvolvedor depois) como resolução.
- §12.2: Citava UseDD e "a porta" como resposta à cadeia de autoridade.
- §12.4: Citava UseDD e "a porta" como método de verificação empírica, incluindo análise de circularidade sobre a porta.
- §12.5: Citava UseDD como fonte da resposta sobre pesos relativos.
- §10: A reformulação mencionava "nas dimensões de capacidade, compreensibilidade, esforço, previsibilidade e relevância" e "atendendo primeiro o usuário do produto e, dentro desses constrangimentos, o desenvolvedor".
- §11: Referências a "cinco dimensões", "sequência por L2.9", e "preterida por conveniência" como formulações fixas.

**Solicitação exata de correção:**

> * Em "6. Conceito: Experiência de interação", "Dimensões": Não estabeleça elas como lista completa, mas como alguns itens representativos de uma lista maior que é de competência da área atualmente nomeada UX e propor uma lista completa seria uma análise outra, essa análise não se propõe a isso. E atualizar o restante do documento onde as dimensões são citadas.
> * Em "7. Conceito: Melhor possível", "Decomposição em dois componentes", "Melhor", "não há alternativa conhecida que sirva melhor": o uso de "conhecida" deixa aberto o conceito ao se permitir argumentar que se alguém estava com preguiça e não dedicou tempo para levantar todas alternativas, as alternativas que ele não levantou eram não conhecidas por ele, assim, mesmo com preguiça ele estaria escolhendo a "melhor" nessa definição. Melhore a definição para que "O que constrange o possível" e "O que não constrange o possível" sejam emergentes do conceito e não condições adicionadas posteriormente.
> * Reformule "Conflito entre humanos" para não citar UseDD, se não for possível como emergência dos conceitos desse documento, apenas marque como ponto em aberto para as próximas etapas. Faça o mesmo para "12.2 — A cadeia de autoridade", "12.4 — Verificação empírica de 'melhor possível'" e "12.5 — Peso relativo das dimensões".
> * Atualize "10" e "11" a luz das alterações feitas.
