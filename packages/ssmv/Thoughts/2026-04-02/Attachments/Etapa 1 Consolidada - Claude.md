# Identificação e Delimitação do Problema Normativo

> Primeira etapa da análise normativa: delimitar o problema com precisão antes de argumentar. Segue o padrão de análise em filosofia analítica (MIT/NYU/Oxford/ANU). Integra e consolida as análises independentes da Etapa 1 (delimitação) e da Etapa 1.5 (clarificação conceitual) em um único documento.

---

## 1. A questão bruta

No desenvolvimento de software, é recorrente que a forma do sistema acabe sendo ditada pelo que é mais conveniente para implementar, integrar, testar ou manter localmente. O resultado é familiar: o usuário do produto adapta seu comportamento ao sistema, e o desenvolvedor adapta seu trabalho ao codebase, com frequência maior do que o sistema se adapta a eles. A direção predominante dessa relação é: o humano adapta-se ao sistema mais do que o inverso.

Em linguagem ordinária, isso costuma aparecer como "software ruim", "UX ruim", "DX ruim", "dívida técnica", "falta de design", "o legado não deixa" ou "era o que dava para fazer". O problema dessas formulações é que misturam, sem distinguir, descrição de fenômeno, juízo de valor, hipótese causal e proposta de solução. Se a questão permanecer nesse estado bruto, o alvo se move o tempo todo — ora parece ser um problema de qualidade de produto, ora de arquitetura, ora de processo, ora de cultura, ora de competência individual, ora de escassez de recursos.

A questão bruta, antes de qualquer refinamento:

> Quem deveria ter autoridade sobre a forma de um artefato de software — o humano que usa ou a implementação que executa?

Antes de defender qualquer princípio, é preciso fixar exatamente qual dessas coisas está em disputa.

---

## 2. Por que a questão é filosoficamente problemática

A pergunta, como formulada, carrega pelo menos oito ambiguidades que a tornam inadequada para análise direta.

**2.1 — "Autoridade" é ambígua.** Pode significar autoridade causal (quem de fato determina), autoridade normativa (quem deveria determinar), ou autoridade prática (quem tem condições de determinar). A questão transita entre as três sem distingui-las. A reivindicação que se pretende defender é normativa — quem *deveria* — mas a evidência que a motiva é causal — quem de fato determina.

**2.2 — "Forma" unifica fenômenos distintos.** A forma de uma entidade de software inclui: sua interface pública, seu comportamento observável, seus constrangimentos sobre o consumidor, e sua estrutura interna. Autoridade sobre qual desses aspectos? O princípio precisa ser claro sobre o que conta como "forma" no sentido relevante.

**2.3 — "Humano que usa" pressupõe unicidade e obscurece conflitos de domínio.** Há pelo menos dois humanos que usam diretamente: o usuário do produto (runtime) e o desenvolvedor (build-time). Esses humanos podem ter interesses conflitantes. A questão não distingue qual humano, nem como resolver conflitos entre eles. Além disso, não explicita se o caso do produto e o caso do código pertencem ao mesmo campo normativo — se não pertencerem, a análise ora falará de UX, ora de DX, sem justificar por que ambos devem ser tratados sob o mesmo princípio.

**2.4 — A questão mistura descrição e norma.** Uma coisa é dizer que decisões técnicas frequentemente constrangem humanos e que o feedback costuma ser fraco ou tardio. Outra é dizer que isso conta contra a decisão e exige justificação. A questão pressupõe que a implementação de fato adquire autoridade — uma afirmação empírica — e simultaneamente julga isso como problemático — uma afirmação normativa. Se o fenômeno empírico não existe, a norma é ociosa; se existe mas não é problemático, a norma é infundada.

**2.5 — A questão mistura níveis de análise.** Há pelo menos um nível conceitual (o que conta como "uso", "forma", "autoridade", "restrição"), um nível empírico (frequência, visibilidade e evitabilidade do fenômeno), e um nível normativo (quem deve ter precedência quando há conflito). A questão transita entre esses níveis sem distingui-los.

**2.6 — A questão parece auto-respondível.** Formulada como "quem deveria ter autoridade — o humano ou a implementação?", a resposta "o humano" parece trivialmente correta. Isso é sinal de que a questão não está suficientemente precisa. A versão não-trivial precisa identificar exatamente onde está a disputa genuína.

**2.7 — Há compromissos de valor não declarados.** A seleção lexical do material que motiva a pergunta — "constrangimento", "negligência", "adaptação silenciosa" — carrega juízos de valor apresentados como descrição. A passagem do factual ao valorativo é realizada por meios retóricos: "constrangimento" (normativo disfarçado de descritivo), "silenciosa" (factual com implicação valorativa), "retroalimentação" (conotação de patologia). A camada valorativa opera sem controle porque não é reconhecida. A análise normativa que se construir sobre esse material herda esses compromissos e precisa examiná-los, não absorvê-los silenciosamente.

**2.8 — O papel das restrições permanece indeterminado.** Tempo, custo, legados, ferramentas, plataformas e limites cognitivos existem. A questão não é se existem, mas se sua existência basta para lhes conceder autoridade sobre a forma do sistema. Sem essa distinção, a análise colapsa em fatalismo técnico ("não há nada a fazer, restrições ditam tudo") ou em voluntarismo moral ("restrições são irrelevantes, o humano manda").

---

## 3. Desagregação: mapa de questões embutidas

Seguindo o método de Frances Kamm — produzir um *question map* antes de qualquer argumento — a questão composta se decompõe em pelo menos seis questões distintas:

| # | Questão | Tipo | Status nesta análise |
|---|---|---|---|
| Q1 | O que são "autoridade", "forma", "uso", "superfície", "interação" e "restrição" no contexto de design de software? | Conceitual | **Tratada** — §6 estabiliza os conceitos operativos |
| Q2 | A implementação de fato adquire autoridade sobre a forma na prática corrente? Em que condições a adaptação fica invisível e como fatores como competência, feedback e escala a modulam? | Empírica-descritiva | **Assumida** — o fenômeno é pressuposto com base em reconhecimento por praticantes competentes, não provado estatisticamente |
| Q3 | Quando há conflito, o humano que usa deveria ter autoridade sobre a forma? | Normativa de primeira ordem | **Central** — esta é a questão que a análise responde |
| Q4 | Essa reivindicação vale uniformemente em todas as granularidades? | De escopo | **Subsidiária** — tratada como consequência da resposta a Q3 |
| Q5 | UX e DX pertencem ao mesmo espaço normativo? | De unificação | **Subsidiária** — precisa ser defendida para que o princípio seja único |
| Q6 | Restrições reais alteram a reivindicação normativa? | De limites | **Subsidiária** — tratada como caso de teste da resposta a Q3 |

**Questão selecionada: Q3.** As demais são tratadas na medida em que servem a Q3 ou são pressupostas por ela. Q1 é instrumento (→ §6); Q2 é assumida; Q4, Q5 e Q6 são consequências a defender em etapas subsequentes.

---

## 4. Tipo de questão normativa

A questão central é de **primeira ordem normativa**, aplicada ao domínio do design de software. Ela pergunta qual lado deve ter autoridade sobre a forma do sistema quando há conflito entre conveniência de implementação e atendimento ao humano que usa.

- **Não é metaética** — não pergunta o que significa "deveria" ou se existem fatos normativos sobre design. A análise pode recorrer a esclarecimentos conceituais auxiliares, mas não pretende resolver questões gerais sobre a natureza dos fatos normativos.
- **Não é puramente conceitual** — não pergunta apenas o que "autoridade" significa, embora precise dessa clarificação como ferramenta.
- **Não é empírica** — não pergunta se a inversão ocorre (assume que sim), mas se é normativamente problemática. Depende de um fenômeno reconhecível, mas não exige demonstração estatística.

A questão usa análise conceitual como instrumento (definir "autoridade", "forma", "uso", "superfície") e evidência empírica como pressuposto (o fenômeno existe), mas o alvo é um julgamento normativo: *dada* a existência do fenômeno, *deveria* a autoridade residir no humano?

Nos termos do padrão de Princeton: *"This is a first-order normative question applied to software design. I bracket metaethical questions about the nature of normative facts in technical domains, and empirical questions about the frequency of the phenomenon."*

---

## 5. Formulação-semente e decomposição formal

### 5.1. A formulação-semente

A intuição normativa a ser formalizada, em linguagem ordinária:

> Um software será criado; se um humano irá interagir com ele no futuro, ele deve ser feito para proporcionar a melhor experiência de interação possível para esse humano.

Em forma mais precisa:

> Se `S` é um software a ser criado, e se existe ao menos um humano `h` para o qual `S` oferecerá alguma superfície de uso por meio da qual seu comportamento poderá ser diretamente operado, interpretado, mantido ou experimentado, então as superfícies de uso e o comportamento de `S` devem ser escolhidos de modo a oferecer a `h` a melhor experiência de interação possível dentro do conjunto de alternativas realmente viáveis.

### 5.2. Decomposição dos elementos

| Elemento | Trecho | Papel |
|---|---|---|
| Contexto | "Um software será criado" | Situa a obrigação no momento da criação — decisões estão sendo tomadas |
| Condição | "se um humano irá interagir com ele no futuro" | Ativa a obrigação; indexa ao humano específico |
| Operador normativo | "deve ser feito" | A obrigação recai sobre o ato de fazer, não sobre o artefato depois de pronto |
| Alvo | "para proporcionar a melhor experiência de interação possível" | O standard normativo + qualificador de factibilidade |
| Indexação | "para esse humano" | A experiência é avaliada do ponto de vista do humano específico, não em abstrato |

### 5.3. A estrutura condicional: "se... no futuro"

A condição "se um humano irá interagir" faz três coisas:

**Torna a obrigação condicional, não categórica.** A fonte da obrigação é a perspectiva de interação humana, não uma propriedade intrínseca do código. Código que nenhum humano jamais verá, usará ou manterá (se existir) fica fora do escopo — a condição não se satisfaz.

**É futura.** "Irá interagir" coloca a obrigação no momento da decisão de design — antes da interação acontecer. O decisor deve antecipar. O gap temporal entre decisão e consequência não elimina a obrigação; é a razão pela qual a obrigação existe (sem gap, não haveria risco de negligenciar a experiência futura).

**É trivialmente satisfeita para software relevante.** Todo software no sentido desta análise (→ §6.1) terá pelo menos um humano que interage: o desenvolvedor. A condição é portanto universalmente satisfeita para o domínio em questão. Mas a forma condicional é preferível à afirmação categórica porque fundamenta a obrigação num fato contingente (haverá interação) e não numa metafísica (código tem deveres).

**Leitura distributiva.** A formulação diz "um humano" — singular. Mas na prática, múltiplos humanos irão interagir. A leitura correta é distributiva: **para cada humano** que irá interagir, a obrigação se aplica.

### 5.4. O operador normativo: "deve"

"Deve ser feito" coloca a obrigação no ato de criação. O sujeito da obrigação não é o software, é o decisor — quem quer que tome decisões que afetam a forma do artefato. Se a decisão for tomada por inércia, hábito ou por default do framework, a obrigação não desaparece — foi negligenciada.

A obrigação é **pro tanto** (não absoluta). Pode ser sobreposta por restrições genuínas. Mas o ônus é de quem deixa de cumprir: precisa justificar por que a alternativa que melhor servia o humano não foi a adotada. Essa inversão do ônus é central: o default não é "qualquer decisão é permissível até que se prove problemática" — o default é "a decisão deve otimizar para o humano, e desvios precisam de justificação."

---

## 6. Clarificação conceitual

A formulação-semente contém conceitos que a questão bruta (§1) usou sem estabilizar. Sem clarificá-los, o argumento oscila entre sentidos diferentes dos mesmos termos. Esta seção fixa o vocabulário mínimo necessário.

### 6.1. Software

**Artefato.** Neste contexto, um artefato é algo produzido intencionalmente para entrar em uma prática de uso. Não é apenas uma coisa que existe — é uma coisa feita para ser usada, operada, modificada ou integrada por alguém.

**Software.** Software, no sentido relevante, é um artefato técnico cujas formas estruturam possibilidades de ação, compreensão e manutenção ao longo do tempo, em qualquer granularidade onde há um humano que interage com sua superfície. Isso cobre: aplicações, bibliotecas, APIs, módulos, funções, componentes. Não cobre: código que nenhum humano jamais verá ou usará (se tal coisa existir, está fora do escopo por não satisfazer a condição da formulação-semente).

**Relação com P0.** A premissa fundacional P0 (→ §10.3) afirma: "software é artefato cuja razão de existir é servir um humano." Dizer isso não é slogan moral nem tese psicológica sobre a intenção subjetiva do autor. É classificação teleológica do objeto: software pertence a uma prática humana de uso; sua avaliação normativa depende da relação que estabelece com humanos que o usam; sem ao menos um humano para o qual o artefato ofereça alguma superfície de uso, não há software no sentido normativamente relevante para esta análise.

A formulação-semente operacionaliza P0: o que significa "servir" é proporcionar a melhor experiência de interação possível para cada humano que interage. "Servir" deixa de ser vago — tem conteúdo: diz respeito à experiência na superfície de contato entre humano e artefato. A normatividade vem da definição de "criar um artefato para interação humana" — quem cria algo para ser usado por humanos e ignora a experiência desse uso contradiz o propósito declarado do próprio ato.

A forma condicional da formulação-semente (→ §5.3) preserva o caráter analítico de P0: não diz "software deveria servir humanos" (ought externo); diz "se o artefato terá interação humana, essa interação tem propriedades que podem ser melhores ou piores; a obrigação é otimizar essas propriedades." Para software que não terá interação humana (se existir), a formulação não se pronuncia — a condição não se satisfaz.

### 6.2. Comportamento

Comportamento é o conjunto de respostas observáveis do sistema a entradas, estados e transições. Inclui o que o sistema faz, deixa de fazer, permite, impede, sinaliza e preserva sob condições relevantes de uso.

Em interações voltadas ao funcionamento do produto, comportamento aparece como estados, fluxos, feedbacks, erros, transições e resultados observáveis. Em interações voltadas à construção e manutenção do sistema, comportamento aparece também como efeitos de superfícies técnicas: contratos aceitos ou rejeitados, falhas, mensagens, previsibilidade de integração e consequências de mudança.

### 6.3. Superfície de uso

Superfície de uso é qualquer forma do software com a qual um humano pode interagir diretamente para produzir, observar, interpretar, configurar, modificar, operar ou manter comportamento.

São exemplos: telas, comandos e fluxos observáveis de operação em runtime; APIs públicas, tipos, contratos, mensagens de erro, convenções e pontos de extensão em build-time.

Nem toda estrutura interna do software é, por si só, uma superfície de uso. Ela se torna relevante como tal quando entra efetivamente na relação direta entre uma forma do sistema e um humano.

### 6.4. Interação

Interação é a relação na qual um humano atua diretamente sobre uma superfície de uso e, por meio dela, recebe, interpreta, produz, modifica, opera ou mantém comportamento.

**Delimitação positiva — modos de interação:**

| Modo | Exemplos | Superfície |
|---|---|---|
| **Usar** | Executar, navegar, inputar, ler output | Interface do produto |
| **Consumir** | Chamar API, importar módulo, compor componentes | Interface do código (pública) |
| **Manter** | Ler, depurar, modificar, estender | Interface do código (interna) |

Todos os três modos são interações no sentido relevante. Em todos, o humano encontra uma superfície cujas propriedades afetam sua experiência.

**Delimitação negativa — o que não é interação no sentido relevante:**

- **Ser afetado indiretamente.** Um usuário que sofre com lentidão causada por um banco de dados não interage com o banco — interage com o produto. A superfície relevante é a do produto, não a do banco. (O banco tem seus próprios humanos: os desenvolvedores que interagem com sua API.)
- **Decidir sobre, sem engajar com.** Um CTO que decide adotar um framework não está interagindo com o framework até que o use. A decisão meta-nível opera sobre representações, não sobre a superfície.
- **Efeito social ou organizacional.** Nem todo efeito social do software conta como interação com o software.

Essa delimitação evita inflação do conceito: "interação" não é qualquer relação causal com o software, é engajamento direto com uma superfície de uso.

### 6.5. Runtime e build-time

**Runtime** é o regime em que o software está sendo operado para realizar o comportamento do produto em uso. A interação humana se dá com superfícies voltadas à execução do sistema enquanto sistema em funcionamento — o humano interage para obter efeitos práticos do produto: executar tarefas, navegar estados, interpretar feedback e alcançar fins de uso.

**Build-time** é o regime em que o software é lido, escrito, configurado, integrado, testado, depurado, estendido ou mantido por humanos responsáveis por sua construção e evolução. A interação humana não é com o produto em operação, mas com as superfícies pelas quais o software se deixa construir, compreender e modificar.

O software relevante para esta análise inclui, portanto: comportamento em runtime; superfícies de uso em runtime; superfícies de uso em build-time; e formas internas que entram em relação direta de uso humano em build-time.

### 6.6. Humano relevante

**Definição.** Humano relevante é todo humano para o qual o software, por meio de uma superfície de uso, produz diretamente efeitos de ação, compreensão, esforço ou resposta que a decisão de design correspondente pode melhorar, piorar, facilitar, dificultar ou tornar mais inteligíveis.

A ordem causal é importante: não é uma instância externa que primeiro decide se esse humano entra no campo de avaliação. A ordem correta é a inversa: *porque* o software lhe produz diretamente esses efeitos por meio de uma superfície de uso, esse humano *já pertence* ao campo de avaliação da decisão que molda essa superfície e o comportamento por ela mediado. A expressão "decisão de design correspondente" apenas marca que a relevância é local à relação específica que cada decisão efetivamente molda — não indica arbitrariedade.

**Casos centrais que emergem da definição.** Dada a distinção entre runtime e build-time (§6.5):

- Quando a interação direta ocorre com superfícies de uso em runtime, o humano relevante é o **usuário do produto**.
- Quando a interação direta ocorre com superfícies de uso em build-time, o humano relevante é o **desenvolvedor**.

Esses dois não aparecem como escolhas arbitrárias introduzidas de fora. São os dois enquadramentos básicos que resultam da combinação entre a definição de humano relevante, a definição de superfície de uso e a distinção entre runtime e build-time.

**Casos de fronteira:**

- *O mesmo humano em dois papéis.* Um desenvolvedor solo é simultaneamente usuário do produto e desenvolvedor. A formulação aplica-se a cada interação independentemente — quando usa o produto, é usuário do produto; quando lê o código, é desenvolvedor. São duas instâncias da condição, não uma.
- *Humanos futuros.* "Irá interagir no futuro" cobre o desenvolvedor que lerá o código daqui a seis meses — inclusive o próprio autor. O gap temporal entre decisão e interação não elimina a obrigação; apenas torna-a mais difícil de cumprir (o decisor precisa antecipar).
- *Operadores, administradores, auditores.* Se interagem diretamente com uma superfície do software (painel de controle, CLI de deploy, interface de logs), são humanos relevantes — a definição cobre. Se interagem por mediação (leem relatórios gerados por outros), a mediação é o artefato relevante, não o software original.

**Papéis mediados.** Papéis como PM, designer, pesquisador ou suporte não criam um terceiro tipo básico de humano relevante. Quando importam para a análise, importam porque representam, mediam ou informam algum dos dois casos centrais.

**UX e DX no mesmo espaço normativo.** Dizer que UX e DX pertencem ao mesmo espaço normativo não significa dizer que são idênticos em conteúdo. Significa que ambos são instâncias da mesma relação normativa: há um humano, uma superfície de uso, uma experiência que pode ser melhor ou pior, e a pergunta é se a forma da superfície e do comportamento por ela mediado serve ao humano que a usa. Nos dois casos, o ônus imposto ao humano pode ser mais ou menos justificável; a conveniência da implementação pode ou não usurpar autoridade; a avaliação relevante pergunta se a superfície serve ao uso humano legítimo. O que muda é o regime (runtime ou build-time), o vocabulário da superfície (comportamental ou técnico), e o tipo de tarefa humana — diferenças que não bastam para separar os dois em domínios normativos independentes. A unificação não é por identidade de conteúdo (UX ≠ DX), mas por identidade de estrutura normativa.

### 6.7. Experiência de interação

**Definição.** Experiência de interação é o perfil total de exigências e facilidades que uma superfície de uso e o comportamento por ela mediado impõem ao humano que a usa. Não é sentimento subjetivo puro (embora o inclua). Não é propriedade objetiva do artefato isolado (depende do humano específico). É a interface entre os dois: as propriedades da superfície *na medida em que* afetam *este* humano em sua capacidade de realizar seu propósito com o artefato.

**Dimensões (exemplos representativos, não lista fechada).** Identificar e catalogar exaustivamente as dimensões da experiência de interação é uma análise que pertence à área atualmente nomeada UX (e suas vertentes como DX) — não é objeto desta análise. Contudo, para tornar o conceito operável, seguem exemplos representativos:

| Dimensão | O que responde | Exemplo UX | Exemplo DX |
|---|---|---|---|
| **Capacidade** | O que o humano consegue fazer? | Funções acessíveis no produto | Operações disponíveis na API |
| **Compreensibilidade** | O que o humano consegue entender? | Interface revela seu estado | Assinatura revela sua intenção |
| **Esforço** | Quanto o humano precisa investir? | Passos, cliques, carga cognitiva | Boilerplate, edge cases, configuração |
| **Previsibilidade** | O artefato se comporta como o humano espera? | Comportamento consistente | Contrato cumprido, sem surpresas |
| **Relevância** | O artefato endereça a necessidade real do humano? | Resolve o problema certo | API encaixa no caso de uso real |

Esses exemplos não esgotam o espaço dimensional — outras dimensões relevantes (qualidade do feedback, recuperabilidade após erro, consistência entre partes da interação, propensão a erro, custo temporal, grau de adaptação arbitrária exigida do humano) podem existir e sua identificação completa é competência da disciplina de UX/DX. O que importa para esta análise é a estrutura: a experiência de interação é multidimensional, e as mesmas dimensões estruturais — quaisquer que sejam — aplicam-se tanto a UX quanto a DX (o conteúdo muda, a estrutura não).

"Boa experiência" não quer dizer "agradável" em sentido superficial. Quer dizer "ajustada ao uso humano legítimo com o mínimo de ônus evitável e o máximo de inteligibilidade viável."

**Resolução de "constrangimento" como categoria unificada.** "Constrangimento" é qualquer propriedade da superfície que degrada uma ou mais dimensões da experiência de interação para o humano. A impossibilidade degrada capacidade; a dificuldade degrada esforço; a confusão degrada compreensibilidade; o custo temporal degrada esforço. Outras degradações em outras dimensões são possíveis. O que unifica "constrangimento" como categoria é o espaço dimensional da experiência, não a enumeração de formas específicas de degradação.

### 6.8. "Melhor possível"

A formulação-semente pede "a melhor experiência de interação possível." Essa expressão decompõe-se em dois componentes com papéis distintos.

**"Possível"** é o qualificador de factibilidade. Define o espaço de alternativas sobre o qual "melhor" opera. Uma alternativa é excluída desse espaço apenas por fatores que estão **fora do controle do decisor** — fatores que ele não pode superar por decisão, vontade ou diligência. Exemplos: o medium não suporta (impossibilidade técnica); os recursos são genuinamente insuficientes (restrição de recurso); o estado da arte não sabe como (limite de conhecimento); leis, regulações ou compromissos de segurança o impedem; dependências externas e interoperabilidade necessária; compromissos anteriores já legitimamente assumidos.

A definição tem um corolário direto: qualquer fator que esteja **sob o controle do decisor** — sua preferência, sua inércia, sua atenção, sua disposição de investigar — **não** exclui alternativas do espaço factível. Se o decisor não levantou alternativas por falta de diligência, essas alternativas não se tornam "impossíveis" — permanecem no espaço factível. Se o decisor prefere uma alternativa por conveniência de implementação, a alternativa preterida não se torna "infactível" — permanece disponível. Em resumo: "possível" é definido pela fronteira entre o que o decisor pode controlar e o que não pode. Tudo aquilo dentro do seu controle permanece no espaço de alternativas; tudo aquilo fora do seu controle pode legitimamente reduzir esse espaço.

É crucial, portanto, distinguir **restrição** (fato fora do controle do decisor que reduz o conjunto de alternativas disponíveis) de **autoridade** (critério que decide qual alternativa deve ser escolhida dentre as disponíveis). Uma restrição pode eliminar opções. Ela não escolhe, por si só, a melhor configuração de superfícies de uso e comportamento.

Nem toda dificuldade conta como restrição legítima. Fatores que frequentemente aparecem como "restrições" mas que estão sob o controle do decisor — "sempre fizemos assim", "a biblioteca não ajuda", "o código atual não permite", "é mais simples para implementar deste jeito" — só contam como restrições normativamente relevantes quando são explicitados como fatos reais do caso e reavaliados pela autoridade humana pertinente. Sem isso, são candidatos a racionalização posterior.

**"Melhor"** é o superlativo dentro do espaço factível assim definido. Designa superioridade entre alternativas, não perfeição absoluta. Entre todas as alternativas que não foram excluídas por fatores fora do controle do decisor, a que proporciona a experiência mais favorável ao humano nas dimensões da experiência de interação. Não é "aceitável" nem "suficiente" — é o máximo atingível dentro desse espaço.

"Melhor" não é soma simples de métricas. A experiência é multidimensional. Em muitos casos, haverá comparação clara; em outros, haverá trade-off entre dimensões diferentes. Por isso, "melhor" deve ser lido como juízo prático comparativo orientado por uso humano, não como cálculo fechado por pontuação.

Uma alternativa não pode contar como "a melhor" se sua superioridade depende apenas de conveniência local da implementação, hábito da equipe, inércia do legado não examinada, limitação da ferramenta tomada como destino, ou deslocamento silencioso de custo para o humano que usa. Esses fatores podem pesar na deliberação. Sozinhos, porém, não bastam para converter uma pior experiência humana em melhor decisão normativa.

**Consequências:**

1. "Melhor possível" é um standard de **direção**, não de threshold. Não pergunta "passou de um mínimo aceitável?" — pergunta "existe alternativa que o decisor poderia ter adotado e que sirva melhor este humano?"

2. Quando uma restrição genuína elimina a alternativa ideal, a obrigação não desaparece — desloca-se para a melhor alternativa restante. A pergunta passa de "como servir o humano?" para "dado este limite real, qual a melhor forma *ainda disponível* de servir este humano?" A mudança é no conjunto de opções, não no critério de seleção.

3. "Servir o humano" não é vago — a formulação tem critério de demarcação: uma decisão que preteriu alternativa factível superior (na experiência do humano) por um fator sob o controle do decisor viola o princípio. Uma decisão que escolheu a melhor alternativa factível, mesmo que imperfeita, satisfaz o princípio.

---

## 7. O explanandum

Seguindo a exigência de Oxford — uma única frase, sem subordinadas, defendível oralmente antes de qualquer outra coisa:

> **No desenvolvimento de software, decisões técnicas adquirem autoridade de fato sobre a forma do sistema em lugar do humano que o usa.**

O explanandum **não é** "software ruim" em geral. Não é "falta de usabilidade". Não é "dívida técnica". É especificamente um padrão recorrente de **inversão, obscurecimento ou deslocamento de autoridade** na definição da forma: a implementação, seus constrangimentos ou suas conveniências passam a determinar a forma — e o humano (usuário do produto ou desenvolvedor) adapta-se.

O fenômeno inclui dois casos diretamente relevantes:

- o usuário do produto, que sofre ou se beneficia da forma do sistema em runtime;
- o desenvolvedor, que sofre ou se beneficia da forma do código em build-time.

O que torna esse explanandum um problema normativo (e não apenas mecânica técnica) é a presença de compromissos de valor (→ §10.4). O material que motiva a análise carrega esses compromissos sem declará-los; esta análise os declara explicitamente.

### Traços recorrentes do fenômeno (assumidos, não provados)

- A adaptação do humano ao sistema é frequente e muitas vezes silenciosa.
- Quem decide costuma estar menos exposto às consequências do que quem as sofre.
- O construtor futuro sofre o efeito das decisões do construtor presente.
- O efeito emerge sem culpado individual, por acúmulo de decisões localmente razoáveis.
- A experiência humana muitas vezes nem entra no campo de consideração da decisão técnica.

O problema, portanto, não será formulado como disputa psicológica entre intenções individuais boas ou ruins. O fenômeno pode emergir por acúmulo de decisões localmente razoáveis, sem intenção maliciosa de nenhum agente individual, e ainda assim permanecer um problema normativo.

---

## 8. A questão reformulada

Com a substância conceitual de §6 incorporada, a questão admite formulação técnica precisa.

**Versão curta:**

> É justificável que, em software, a implementação ou seus constrangimentos locais adquiram autoridade sobre a forma do sistema em lugar do humano que o usa?

**Versão técnica:**

> Para cada humano que irá interagir diretamente com uma superfície de uso de um artefato de software, essa superfície e o comportamento por ela mediado devem ser definidos de modo a proporcionar, entre as alternativas não excluídas por fatores fora do controle do decisor, a experiência de interação que melhor atende esse humano nas dimensões dessa experiência. Essa autoridade deve remontar, em cada entidade do sistema, ao humano que a usa, através de uma cadeia ininterrupta de relações de uso — sem que conveniência de implementação, hábito ou qualquer outro fator sob o controle do decisor adquira autoridade normativa sobre a forma em lugar do humano.

Essa formulação é:
- **precisa** o suficiente para ser refutável (→ §11);
- **escopo-delimitada** o suficiente para ser tratável (→ §10);
- **não-trivial** porque especifica o que "possível" significa (a fronteira do controle do decisor), o que "melhor" significa (superlativo no espaço de alternativas factíveis, multidimensional), e inclui "cadeia ininterrupta" e "cada entidade" — reivindicações fortes sobre escopo e continuidade, não apenas sobre a fronteira do sistema.

---

## 9. Concessão ao oponente

Seguindo o método de Thomson em *A Defense of Abortion* — assumir a premissa mais favorável ao oponente e ainda assim argumentar — esta análise concede, para fins do argumento:

1. **Restrições são reais e pervasivas.** Nem toda decisão pode otimizar para o humano. Restrições de tempo, tecnologia, competência e recursos limitam as soluções disponíveis. O ponto em disputa não é a existência de restrições, mas seu estatuto normativo: elas podem ter peso deliberativo sem por isso se tornarem a origem legítima da forma.

2. **Conhecimento de implementação é valioso.** O construtor possui informação que o humano que usa não tem, e essa informação pode melhorar decisões de forma.

3. **Servir o humano tem custo.** Especificar antes de implementar, manter vocabulário do decisor, respeitar a experiência — são atividades que consomem recursos.

4. **O fenômeno nem sempre é grave.** Em muitos casos, a adaptação do humano ao sistema é aceitável, barata ou imperceptível.

5. **Ninguém precisa ser individualmente culpado.** O fenômeno pode emergir por acúmulo de decisões localmente razoáveis, sem intenção maliciosa de nenhum agente individual.

A questão que resta, mesmo após essas concessões: **segue-se daí que a implementação deveria ter autoridade sobre a forma?**

A tese a ser defendida nas etapas subsequentes sustenta que não — que restrições limitam soluções mas não transferem autoridade. Custos reais mudam o que é factível, não quem decide. A análise subsequente precisa defender essa distinção.

---

## 10. Condições de contorno

### 10.1. Dentro do escopo

- Relações de autoridade no design de software, do nível produto ao nível interno do código.
- A normatividade derivada da definição funcional do artefato (P0), não de uma ética geral.
- Os dois humanos diretamente envolvidos: usuário do produto (runtime) e desenvolvedor (build-time).
- A experiência de interação como critério normativo multidimensional.
- A distinção entre restrição (reduz alternativas) e autoridade (decide entre alternativas).

### 10.2. Fora do escopo (bracketed)

| Item | Razão |
|---|---|
| Metaética geral | A análise opera dentro de cognitivismo normativo para domínios técnicos, sem defendê-lo |
| Frequência empírica do fenômeno | Assumido com base em reconhecimento por praticantes competentes; não provado estatisticamente |
| Genealogia de TDD, API-first, DIP | Compartilham superfície com a tese, não fundação |
| Governança organizacional | A questão é sobre autoridade de design, não sobre quem manda em um time |
| Julgamento de stacks ou linguagens | O princípio é agnóstico em relação a tecnologia específica |
| Stakeholders mediados | PM, empresa, investidores são proxies ou mediações, não raízes de autoridade |
| Imputação de culpa moral individual | O fenômeno pode emergir sem culpado individual |
| Catálogo exaustivo de dimensões da experiência | Pertence à disciplina de UX/DX, não a esta análise normativa |

### 10.3. Premissas fundacionais

**P0 — Software é artefato cuja razão de existir é servir um humano.**

Tratada como **analítica** — contida na definição de "artefato" (→ §6.1). Não afirma "software deveria servir humanos" (ought); afirma "software que não serve humanos não é software no sentido relevante para o princípio" (is). A normatividade vem da definição do objeto, não de um dever moral externo. A forma condicional da formulação-semente (→ §5.3) preserva a analiticidade: software sem interação humana fica fora do escopo — a condição não se satisfaz.

**Risco:** se P0 é genuinamente analítica ou se contrabandeia um compromisso normativo é questão metaética que esta análise bracketa. Para quem rejeita P0, o argumento não começa — e isso é um limite honesto, não uma falha.

**P1 — Em cada par de uso, a autoridade é direcional e assimétrica.**

**Escolha de modelagem**, não descoberta empírica. Tratar relações de uso como assimétricas e resolver aparente simetria por decomposição é uma decisão deliberada. Axiomas declarados são mais fortes que axiomas disfarçados de observações — a honestidade sobre o status de P1 é uma virtude do framework, não uma fraqueza.

### 10.4. Compromissos normativos declarados

O material que motiva esta análise carrega compromissos de valor que operam no enquadramento do explanandum. A passagem do factual ao valorativo no material original é realizada por meios retóricos (→ §2.7). Em vez de herdar esses compromissos silenciosamente, esta análise os declara como premissas que devem ser assumidas ou defendidas:

| # | Compromisso | Status |
|---|---|---|
| C1 | Experiência humana é critério normativamente relevante em decisões técnicas | **Assumido** — sem ele, o fenômeno é mecânica neutra, não problema normativo |
| C2 | Impor ônus humanos evitáveis ou opacos conta contra a decisão que os produz | **A defender** |
| C3 | Transferir custo do decisor para o afetado exige justificação | **A defender** |
| C4 | Visibilidade entre decisão e consequência é um bem normativo | **A defender** |
| C5 | Competência para antecipar experiência humana é virtude profissional relevante | **Assumido** |
| C6 | Restrições reais têm peso deliberativo, mas não autoridade normativa própria | **A defender** — central para a tese |
| C7 | Usuário do produto e desenvolvedor pertencem ao mesmo espaço normativo | **A defender** — necessário para unificação do princípio |

C1 e C5 são assumidos porque rejeitá-los dissolve o problema (não há fenômeno normativo a tratar). C2, C3, C4, C6 e C7 precisam de defesa nas etapas subsequentes — são o núcleo do trabalho argumentativo.

---

## 11. Teste de refutabilidade

A tese seria refutada se fosse demonstrado que:

**11.1 — Autoridade da implementação serve igualmente bem.** Se a forma definida pela implementação servir ao humano tão bem ou melhor — e isso ocorrer *não acidentalmente* (por razão estrutural, não por sorte) — então a reivindicação de que a autoridade deve residir no humano perde força. A qualificação "não acidentalmente" é essencial: sucessos pontuais não refutam; um mecanismo que garanta isso, sim.

**11.2 — A cadeia é intraçável.** Se for demonstrado que a autoridade não pode, mesmo em princípio, ser rastreada ao humano em sistemas de software reais — que a complexidade ou a natureza do medium impede a cadeia — então a tese prescreve algo impossível. (*Ought implies can.*)

**11.3 — UX e DX são normativamente incomensuráveis.** Se for demonstrado que a relação de uso do produto e a relação de uso do código não compartilham estrutura normativa suficiente para que um princípio único as cubra, a tese perde sua reivindicação de unificação e se fragmenta em dois princípios sem conexão.

**11.4 — Restrições possuem autoridade normativa própria.** Se for demonstrado que restrições técnicas não são apenas insumo deliberativo mas possuem autoridade legítima para determinar a forma — isto é, que "não dá pra fazer" implica "não deveria ser assim" — então a hierarquia da tese (humano acima de restrição) colapsa.

**11.5 — A distinção decisor/executor é conceitualmente inadequada.** Se for demonstrado que a distinção entre quem decide e quem executa não pode ser mantida para o domínio que a tese pretende cobrir — por exemplo, porque no software os papéis são estruturalmente inseparáveis — então a tese perde o sujeito da obrigação.

Esses cinco cenários são suficientemente concretos para que a tese seja genuinamente refutável — passa no teste de delimitação. Se nenhum cenário desse tipo puder sequer ser descrito, a tese ainda não estaria filosoficamente delimitada.

---

## 12. Riscos e pontos cegos

**12.1 — "Constrangimento" como categoria unificada.** O material usa "constrangimento" para cobrir fenômenos categorialmente distintos: impossibilidade (binária), dificuldade (gradual), confusão (epistêmica), custo (temporal). Se essa unificação for ilegítima, o explanandum descreve vários problemas, não um. *Resolução parcial:* §6.7 oferece o espaço dimensional da experiência de interação como critério de unificação. A análise subsequente precisa confirmar que esse critério é robusto.

**12.2 — Trivialidade potencial.** Se "servir o humano" for definido de forma suficientemente ampla, qualquer decisão técnica pode ser reinterpretada como servindo algum humano de alguma forma. *Resolução parcial:* §6.8 oferece critério de demarcação — alternativa factível superior preterida por fator sob o controle do decisor. A análise subsequente precisa testar esse critério contra casos limítrofes.

**12.3 — Analiticidade de P0.** A afirmação de que P0 é analítica pode ser contestada: artefatos podem ter propósitos que não são servir humanos (arte autotélica, software experimental, IA autônoma). *Resolução parcial:* §5.3 e §6.1 preservam a forma condicional — software sem interação humana fica fora do escopo. O limite é honesto: "para software no sentido de P0, o princípio vale; para outros sentidos de software, a análise não se pronuncia."

**12.4 — Exaustividade dos dois humanos.** O framework reconhece dois humanos diretos (usuário do produto, desenvolvedor). Mas e operadores, administradores, auditores? *Resolução parcial:* §6.6 trata-os como cobertos pela definição geral quando interagem diretamente com uma superfície de uso, e como mediações quando não interagem. Resta verificar se essa resolução cobre todos os casos relevantes.

**12.5 — Presunção de deliberador racional.** A análise pressupõe que decisões de design são feitas por agentes que deliberam. Haidt (*The Righteous Mind*, 2012) e Greene (*Moral Tribes*, 2013) mostram que julgamentos humanos frequentemente são intuitivos e racionalizados depois. Se decisões de design seguem o mesmo padrão, a prescrição "trace a autoridade ao humano" pode ser mais difícil de implementar do que a tese sugere. *Decisão:* bracketed — o princípio prescreve uma norma, não descreve um processo cognitivo. A objeção é de implementação, não de validade.

---

## 13. O que permanece em aberto

**13.1 — Defesa dos compromissos C2, C3, C4.** A formulação assume que ônus opacos contam contra a decisão, que transferir custo exige justificação, e que visibilidade é normativa. Esses compromissos receberam conteúdo mais preciso (dimensões, factibilidade, ônus de justificação) mas não foram *defendidos*.

**13.2 — A cadeia de autoridade.** A formulação trata cada interação humano-artefato como unidade. Mas software real é composto: módulos dependem de módulos, e decisões em um ponto afetam a experiência em outros. Resta em aberto se a obrigação formulada aqui requer alguma propriedade estrutural sobre como as decisões se conectam ao longo da cadeia de composição — e, em caso afirmativo, qual é essa propriedade e como se defende.

**13.3 — Precedência temporal.** "Deve ser feito" implica que a obrigação é no momento da criação. Resta em aberto se a formulação exige uma sequência específica (definir a experiência antes de implementar) ou apenas que a experiência seja o critério de avaliação, independente da ordem.

**13.4 — Conflito entre humanos relevantes.** A formulação é distributiva ("para cada humano"), mas não prescreve um critério de priorização quando a otimização da experiência para um humano constrange o espaço de otimização para outro. Qual é o critério de sequência ou prioridade nesses casos?

**13.5 — Ponderação entre dimensões.** As dimensões da experiência de interação podem conflitar entre si (por exemplo, mais capacidade pode exigir mais esforço). A formulação não prescreve como ponderar essas dimensões quando entram em conflito. Quem define os pesos e com base em que critério?

**13.6 — Verificação empírica de "melhor possível".** O standard é claro conceitualmente, mas como o decisor sabe que escolheu a melhor alternativa factível? A formulação estabelece o critério, mas não oferece um método de verificação.

**13.7 — Demonstração de que a tese é a melhor formulação.** Resta demonstrar, em detalhe, que a formulação aqui delimitada é a melhor resposta normativa para o problema identificado — e não apenas uma resposta possível.

**13.8 — Relação implementação-porta.** A análise futura terá de defender que a implementação deve ser corrigida pela especificação de uso, e não a especificação absorvida silenciosamente pela implementação. Essa reivindicação é consequência esperada da formulação, mas ainda não foi derivada.

---

## Apêndice A — Notas de proveniência

Este documento consolida quatro análises independentes. A tabela abaixo registra, para cada seção, a origem predominante das formulações utilizadas. "Claude" e "Codex" referem-se aos dois analistas; "1.5" indica material da etapa de clarificação conceitual.

| Seção | Proveniência predominante |
|---|---|
| §1 | Codex (abertura prática, rótulos) + Claude (questão direcional) |
| §2 | Claude (estrutura 2.1–2.6) expandida com Codex (2.5 níveis, 2.8 restrições) |
| §3 | Claude (tabela Q1–Q6) com detalhe empírico de Codex em Q2 |
| §4 | Claude (classificação, bracket Princeton) |
| §5.1–5.2 | Claude 1.5 (decomposição formal) + Codex 1.5 (versão semi-formal) |
| §5.3–5.4 | Claude 1.5 (condicional, operador normativo) |
| §6.1 | Codex 1.5 (estrutura artefato→software) + Claude 1.5 (P0, analiticidade) |
| §6.2 | Codex 1.5 (contribuição exclusiva) |
| §6.3 | Codex 1.5 (definição e exemplos) |
| §6.4 | Codex 1.5 (definição) + Claude 1.5 (modos tabela, delimitação negativa) |
| §6.5 | Codex 1.5 (definições estabilizadas) |
| §6.6 | Codex 1.5 (definição emergente, ordem causal) + Claude 1.5 (casos de fronteira) + ambos (UX/DX) |
| §6.7 | Claude 1.5 (definição, dimensões como exemplos) + Codex 1.5 (lista expandida, fórmula "boa experiência") |
| §6.8 | Claude 1.5 (fronteira do controle do decisor) + Codex 1.5 (comparativo, falsos constrangimentos, restrição ≠ autoridade) |
| §7 | Claude (especificação cirúrgica, traços) + Codex (tríade inversão/obscurecimento/deslocamento) |
| §8 | Formulação nova integrando: Codex (versão curta), Claude (cadeia ininterrupta), Claude 1.5 (reformulação pós-conceitual), Codex 1.5 (regra consolidada) |
| §9 | Claude (método Thomson, concessões 1–4) + Codex (formulação estatuto normativo) + Codex (concessão 5, acúmulo sem culpado) |
| §10.1–10.2 | Claude (tabela bracketed, escopo) + Codex (recortes, itens adicionais) |
| §10.3 | Claude (P0, P1 com análise de status) |
| §10.4 | Claude (contribuição exclusiva — C1–C7) |
| §11 | Claude (cenários 11.1–11.4) + Codex (cenário 11.5 decisor/executor) |
| §12 | Claude (contribuição exclusiva — 5 riscos) com resoluções parciais da Etapa 1.5 |
| §13 | Integração: Claude 1.5 (13.1–13.6) + Codex (13.7 melhor formulação, 13.8 implementação-porta) |
