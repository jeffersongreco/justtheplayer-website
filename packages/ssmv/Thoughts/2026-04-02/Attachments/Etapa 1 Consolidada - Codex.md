# Identificação e Delimitação do Problema Normativo

## 1. A questão bruta

No desenvolvimento de software, é recorrente que a forma do sistema acabe sendo ditada pelo que, no momento da decisão acredita-se ser, mais conveniente para implementar, integrar, ou manter. O efeito familiar é duplo: o usuário do produto adapta seu comportamento ao sistema, e o desenvolvedor adapta seu trabalho ao sistema, muitas vezes mais do que o sistema se adapta a eles.

Em linguagem ordinária, isso aparece como "software ruim", "UX ruim", "DX ruim", "dívida técnica", "falta de design", "o legado não deixa" ou "era o que dava para fazer". Essas fórmulas capturam algo real, mas o capturam de modo misturado.

A formulação bruta do problema é esta:

> Quando a forma de um artefato de software precisa ser fixada, é justificável que ela seja determinada principalmente pela implementação e por seus constrangimentos locais, ou deveria permanecer subordinada ao humano que o usa?

## 2. Por que a questão é filosoficamente problemática

A pergunta bruta não pode ser discutida diretamente porque muda de sentido conforme o ponto em que é pressionada.

**2.1. Ela mistura descrição, avaliação, causalidade e solução.** Expressões ordinárias como "software ruim" ou "o legado não deixa" embaralham quatro coisas distintas: a descrição de um fenômeno, um juízo de valor sobre ele, uma hipótese sobre sua causa e uma sugestão de remédio. Sem separar essas camadas, o alvo da análise se move continuamente.

**2.2. "Autoridade" é ambígua.** Pode significar autoridade causal, autoridade normativa ou autoridade prática. O fenômeno motivador é causal: decisões técnicas e seus constrangimentos passam a determinar a forma. A tese a ser avaliada é normativa: se isso deveria ocorrer. Se esses sentidos não forem apartados, o argumento oscila sem controle.

**2.3. "Forma" unifica fenômenos heterogêneos.** A forma relevante do software pode envolver interface pública, comportamento observável, constrangimentos impostos ao consumidor, superfícies técnicas de integração e estrutura interna tornada objeto de uso humano. Sem decomposição, não se sabe sobre o que exatamente recai a autoridade.

**2.4. "Humano que usa" é subdeterminado.** Há pelo menos dois casos centrais de uso direto: o humano que interage com o produto em runtime e o humano que interage com o código em build-time. Eles podem coincidir na mesma pessoa ou divergir em interesses. A questão bruta não diz qual humano está em jogo nem como tratar conflitos.

**2.5. A pergunta cruza níveis diferentes de análise.** Há um nível conceitual, que precisa estabilizar termos como `software`, `interação`, `restrição` e `uso`; um nível empírico, sobre frequência, visibilidade e evitabilidade do fenômeno; e um nível normativo, sobre quem deve ter precedência quando há tensão. Se esses níveis forem fundidos, a discussão cai ora em sociologia do desenvolvimento, ora em semântica, ora em ética aplicada, sem reconhecer a mudança.

**2.6. O papel das restrições reais é deixado indeterminado.** Tempo, custo, legados, ferramentas, plataformas, segurança, interoperabilidade e limites cognitivos existem. A questão não é se existem, mas se sua existência basta para lhes conceder autoridade sobre a forma. Sem essa distinção, a análise colapsa ou em fatalismo técnico, ou em voluntarismo moral.

**2.7. A formulação inicial parece auto-respondível.** Perguntada abstratamente como "humano ou implementação?", a resposta "humano" parece trivial. Isso é sinal de formulação ruim. A disputa real não é entre pessoa e máquina em abstrato, mas entre autoridade humana e conveniência local da implementação dentro de um espaço de alternativas restringido por fatos reais.

**2.8. Há compromissos valorativos operando sem declaração.** Termos como "constrangimento", "adaptação silenciosa", "ônus", "negligência" ou "retroalimentação" não são descrições neutras. Eles já pressupõem que certos efeitos sobre humanos contam normativamente contra uma decisão. Esses compromissos precisam ser assumidos, defendidos ou bracketed, não herdados sem exame.

## 3. Desagregação: mapa de questões embutidas

| # | Subquestão | Tipo | Status nesta análise |
|---|---|---|---|
| Q1 | O que contam, neste contexto, como `software`, `comportamento`, `superfície de uso`, `interação`, `autoridade` e `restrição`? | Conceitual | **Tratada** como instrumento de estabilização |
| Q2 | Quem conta como humano relevante, e como os casos centrais de runtime e build-time emergem dessa definição? | Conceitual / de escopo | **Tratada** para fixar o alvo da questão |
| Q3 | O fenômeno existe na prática: a implementação adquire autoridade de fato e o humano adapta-se ao sistema mais do que o sistema a ele? | Empírica-descritiva | **Assumida**; pressuposta, não provada estatisticamente |
| Q4 | UX e DX pertencem ao mesmo espaço normativo relevante ou apenas se parecem por analogia? | De unificação | **Subsidiária**; precisa ser defendida porque a tese quer ser una |
| Q5 | Quando conveniência de implementação, restrições reais e uso humano entram em tensão, quem deve ter autoridade sobre a forma? | Normativa de primeira ordem | **Central**; esta é a questão principal |
| Q6 | Restrições reais alteram o que é requerido? Se sim, como? | De limites | **Subsidiária**; tratada como teste da tese central |
| Q7 | A reivindicação vale apenas para a interface do produto ou também para APIs, internals e toda a cadeia de composição? | De escopo estrutural | **Subsidiária**; a ser defendida nas etapas seguintes |
| Q8 | Como tratar conflitos entre humanos relevantes diferentes quando a melhor experiência para um piora a de outro? | De priorização | **Reconhecida**, mas **não resolvida** nesta etapa |

**Questão selecionada:** Q5. As demais entram apenas na medida em que estabilizam, testam ou delimitam a pergunta principal.

## 4. Tipo de questão normativa

Esta é uma questão de **primeira ordem normativa**, aplicada ao design de software. Ela pergunta qual polo deve ter autoridade sobre a forma do sistema quando conveniência de implementação, restrições reais e uso humano entram em tensão.

Ela **não é metaética**: não pergunta o que significa, em geral, o termo "deve", nem se existem fatos normativos em domínios técnicos. Ela **não é puramente conceitual**: usa clarificação conceitual como ferramenta, mas não se esgota nela. Ela **não é uma investigação empírica exaustiva**: parte de um fenômeno reconhecível por praticantes competentes, sem exigir nesta etapa demonstração estatística abrangente de sua frequência.

Como questão normativa aplicada, ela parte de compromissos de arranque que precisam ser distinguidos pelo seu status:

| # | Compromisso | Status |
|---|---|---|
| C1 | A experiência humana é critério normativamente relevante em decisões técnicas | **Assumido** |
| C2 | Impor ônus humanos evitáveis ou opacos conta contra a decisão que os produz | **A defender** |
| C3 | Transferir custo do decisor para o afetado exige justificação | **A defender** |
| C4 | Visibilidade entre decisão e consequência é um bem normativo | **A defender** |
| C5 | Competência para antecipar experiência humana é virtude profissional relevante | **Assumido** |
| C6 | Restrições reais têm peso deliberativo, mas não autoridade normativa própria | **A defender** |
| C7 | Usuário do produto e desenvolvedor pertencem ao mesmo espaço normativo | **A defender** |

C1 e C5 são pressupostos de abertura do problema: rejeitá-los dissolve a própria inteligibilidade normativa do fenômeno. C2, C3, C4, C6 e C7 exigirão defesa substantiva nas etapas seguintes.

Duas premissas de moldura organizam o problema desde já:

- `P0`: software, no sentido relevante desta análise, é artefato cuja razão de existir é entrar em relações de uso humano. Trata-se de uma premissa classificatória de escopo, não de uma tese metaética geral.
- `P1`: em cada relação de uso, a autoridade é tratada como direcional e assimétrica. Onde houver aparência de simetria, a análise a decompõe em relações distintas em vez de atribuir autoridade conjunta indiferenciada.

## 5. Formulação-semente e decomposição formal

A intuição normativa de partida pode ser enunciada assim:

> Um software será criado; se um humano irá interagir com ele no futuro, ele deve ser feito para proporcionar a melhor experiência de interação possível para esse humano.

Essa formulação contém, em estado comprimido, a arquitetura do problema:

| Elemento | Trecho | Papel |
|---|---|---|
| Contexto | "Um software será criado" | Situa a obrigação no momento da decisão e da feitura |
| Condição | "se um humano irá interagir com ele no futuro" | Ativa a obrigação e a orienta por interação futura |
| Operador normativo | "deve ser feito" | Localiza a obrigação no ato de projetar, não no artefato pronto |
| Alvo | "para proporcionar a melhor experiência de interação possível" | Introduz o standard normativo e o qualificador de factibilidade |
| Indexação | "para esse humano" | Vincula a avaliação ao humano específico afetado, não a um usuário abstrato |

O sujeito do "deve" não é o software depois de pronto, mas quem decide sua forma: desenvolvedor, arquiteto, designer, mantenedor, ou qualquer agente que configure superfícies e comportamento relevantes. A obrigação é futura e distributiva: ela se aciona porque haverá interação humana, e se aplica a cada humano que vier a interagir, embora o critério para resolver conflitos entre humanos diferentes permaneça em aberto. Para software no sentido relevante desta análise, essa condição tende a ser satisfeita ao menos pelo desenvolvedor futuro, ainda que nenhum usuário final esteja imediatamente em vista.

## 6. Clarificação conceitual

### 6.1. Software

Software, no sentido relevante desta análise, é um artefato técnico composto de código e produzido intencionalmente para entrar em relações de uso humano. Ele não se reduz a executáveis finais. Abrange aplicações, bibliotecas, APIs, módulos, funções, componentes e qualquer outra granularidade em que alguma forma do artefato venha a ser operada, interpretada, integrada, modificada ou mantida por um humano.

Essa definição tem uma consequência de escopo. Se não houver qualquer horizonte de interação humana direta com alguma forma do artefato, ele cai fora do domínio normativo aqui analisado. Isso não nega que tal código possa existir; apenas significa que ele não é "software", no sentido relevante para a presente questão, porque lhe falta a relação de uso que torna inteligível o problema normativo.

Assim, `P0` ganha conteúdo preciso: dizer que software existe para servir um humano não é inserir um slogan moral externo, mas classificar o tipo de artefato que está sendo avaliado. O vínculo com o humano é constitutivo do domínio, não acidental.

### 6.2. Comportamento

Comportamento é o conjunto de respostas observáveis do sistema a entradas, estados e transições. Inclui o que o sistema faz, deixa de fazer, permite, impede, sinaliza e preserva sob condições relevantes de uso.

Em runtime, comportamento aparece como estados, fluxos, feedbacks, erros, transições e resultados observáveis do produto em funcionamento. Em build-time, aparece também como efeitos de superfícies técnicas: contratos aceitos ou rejeitados, falhas, mensagens, previsibilidade de integração e consequências de mudança. Comportamento, portanto, não é só "o que roda"; é aquilo que o artefato manifesta de modo observável nas relações humanas de uso.

### 6.3. Superfície de uso

Superfície de uso é qualquer forma do software com a qual um humano pode interagir diretamente para produzir, observar, interpretar, configurar, modificar, operar ou manter comportamento.

Em runtime, são superfícies de uso, por exemplo, telas, comandos, fluxos de navegação, estados observáveis e mecanismos de feedback. Em build-time, são superfícies de uso, por exemplo, APIs públicas, tipos, contratos, mensagens de erro, convenções, pontos de extensão e formas internas do código que se tornam objeto de leitura, escrita, composição, depuração e manutenção.

Nem toda estrutura interna do software é, por si só, uma superfície de uso. Ela só entra no campo normativo relevante quando passa a integrar a relação direta entre uma forma do sistema e um humano. Nesse sentido, a superfície de uso é a "porta" relevante do artefato: o ponto em que sua forma entra em relação direta com um humano.

### 6.4. Interação

Interação é a relação em que um humano atua diretamente sobre uma superfície de uso e, por meio dela, recebe, interpreta, produz, modifica, opera ou mantém comportamento.

Os modos centrais de interação são usar, consumir e manter. Usa-se o produto; consome-se uma API ou um componente; mantém-se código, configuração ou comportamento existente. Nos três casos, o humano encontra uma superfície cujas propriedades facilitam ou dificultam sua ação e compreensão.

Interação, no sentido relevante, não inclui qualquer efeito causal remoto do software sobre pessoas. Não conta como interação ser apenas afetado indiretamente por uma infraestrutura escondida; nesse caso, a superfície relevante é outra. Tampouco conta como interação decidir sobre um software sem engajar com sua superfície; decidir sobre representações, relatórios ou abstrações organizacionais não equivale a interagir com o artefato correspondente.

### 6.5. Runtime e build-time

Runtime e build-time são os dois regimes fundamentais de interação humana com software.

**Runtime** é o regime em que o software é operado como produto em funcionamento. Aqui, o humano interage com superfícies voltadas à execução efetiva do sistema: navega estados, fornece entradas, interpreta feedbacks, lê saídas e busca fins práticos de uso.

**Build-time** é o regime em que o software é lido, escrito, configurado, integrado, testado, depurado, estendido ou mantido. Aqui, a interação humana não é com o produto em operação, mas com as superfícies pelas quais o software se deixa construir, compreender e modificar.

A distinção importa porque impede uma falsa redução da normatividade a UX superficial. DX não é um caso metafórico de uso; é interação direta com superfícies de uso em outro regime da mesma cadeia normativa.

### 6.6. Humano relevante

Humano relevante é todo humano para quem o software, por meio de uma superfície de uso, produz diretamente efeitos de ação, compreensão, esforço ou resposta que a decisão de design correspondente pode melhorar, piorar, facilitar, dificultar ou tornar mais inteligíveis.

A ordem de dependência é importante. Não há uma instância externa que primeiro decide se alguém "entra" no campo de avaliação. O inverso é o correto: porque o software lhe produz diretamente esses efeitos por meio de uma superfície de uso, esse humano já pertence ao campo de avaliação da decisão que molda essa superfície e o comportamento por ela mediado.

Da combinação entre essa definição e os dois regimes fundamentais emergem os dois casos centrais da análise:

- quando a interação direta ocorre com superfícies em runtime, o humano relevante é o usuário do produto;
- quando a interação direta ocorre com superfícies em build-time, o humano relevante é o desenvolvedor.

Esses dois casos não são escolhas arbitrárias introduzidas de fora. Eles são os enquadramentos recorrentes gerados pela própria estrutura do problema.

Casos de fronteira seguem a mesma lógica:

- o mesmo humano pode instanciar os dois papéis em momentos diferentes; isso produz duas relações de uso, não uma exceção à distinção;
- humanos futuros contam plenamente, inclusive o próprio autor do código em um momento posterior;
- operadores, administradores, auditores e mantenedores de infraestrutura contam quando interagem diretamente com painéis, CLIs, interfaces de log, contratos ou superfícies análogas; quando não há interação direta, eles aparecem apenas como mediações;
- PMs, designers, gestores, investidores e outros stakeholders institucionais não se tornam raízes de autoridade apenas por sua posição. Eles contam, quando contam, como mediadores, proxies ou especificadores de relações concretas de uso humano.

### 6.7. Experiência de interação

Experiência de interação é o perfil de exigências e facilidades que uma superfície de uso e o comportamento por ela mediado impõem ao humano que a usa na realização de seu propósito legítimo com o artefato.

Ela não é sentimento subjetivo puro, embora inclua aspectos subjetivos. Também não é propriedade objetiva do artefato isolado. Ela é relacional: as propriedades da superfície enquanto afetam este humano em sua capacidade de usar, compreender, operar, integrar ou manter o software.

Suas dimensões não formam uma lista fechada. A catalogação completa pertence às disciplinas hoje nomeadas UX e DX. Para esta análise, basta estabilizar exemplos representativos:

| Dimensão | Pergunta orientadora | Exemplo em runtime | Exemplo em build-time |
|---|---|---|---|
| Capacidade | O que o humano consegue fazer? | Funções acessíveis no produto | Operações disponíveis na API ou no módulo |
| Compreensibilidade | O que o humano consegue entender? | Interface revela estado e efeitos | Assinatura, tipos e contratos revelam intenção |
| Esforço | Quanto investimento cognitivo ou temporal é exigido? | Passos, cliques, carga cognitiva | Boilerplate, configuração, custo de leitura |
| Previsibilidade | O comportamento confirma expectativas legítimas? | Fluxos consistentes, sem surpresas arbitrárias | Integração estável, mudanças inteligíveis |
| Feedback e recuperabilidade | O sistema sinaliza o que ocorre e permite corrigir rumos? | Mensagens claras, retorno após erro | Falhas explicativas, depuração e reversão viáveis |
| Consistência | Partes distintas exigem adaptação coerente ou arbitrária? | Padrões uniformes de interação | Convenções e contratos coerentes entre módulos |
| Relevância | A superfície atende à necessidade humana real? | Resolve o problema certo | A API encaixa no caso de uso efetivo |

Outras dimensões podem ser normativamente relevantes: propensão a erro, qualidade do feedback em contextos específicos, custo de adaptação, recuperabilidade após falha, entre outras. O ponto filosófico não é congelar uma taxonomia definitiva, mas tornar claro que a experiência é multidimensional e que o mesmo espaço estrutural vale para UX e DX, ainda que o conteúdo empírico das dimensões varie entre os dois regimes.

Isso também fornece um critério de unificação para "constrangimento". Constrangimento relevante é qualquer propriedade da superfície de uso ou do comportamento por ela mediado que degrade uma ou mais dimensões da experiência de interação para o humano específico em questão. Impossibilidade degrada capacidade; opacidade degrada compreensibilidade; custo evitável degrada esforço; inconsistência degrada previsibilidade; feedback fraco degrada recuperabilidade.

### 6.8. "Melhor possível"

O sintagma "melhor possível" decompõe-se em dois componentes.

**"Possível"** delimita o conjunto de alternativas comparáveis. Uma alternativa só sai desse conjunto quando é excluída por fatores fora do controle do decisor e normativamente vinculantes no caso. Exemplos paradigmáticos são: impossibilidade lógica ou técnica do medium, limites do estado da arte, requisitos legais ou regulatórios, exigências de segurança, privacidade ou integridade, interoperabilidade necessária, compromissos anteriores legitimamente vinculantes que o decisor presente não pode unilateralmente rever, e recursos genuinamente insuficientes para aquela alternativa.

Em contrapartida, não reduzem o espaço do possível fatores que permanecem sob controle do decisor: conveniência local da implementação, hábito, inércia não examinada do legado, defaults de ferramenta, desconhecimento por omissão de investigação, presunções especulativas de escala, ou simples indisposição para explorar alternativas. Esses fatores podem explicar uma decisão; não a convertem em inevitável.

**"Melhor"** é o superlativo dentro do espaço assim delimitado. Entre as alternativas não excluídas por fatores fora do controle do decisor, conta como melhor aquela que oferece ao humano relevante a experiência de interação mais favorável nas dimensões que importam para aquele caso. "Melhor" não significa perfeição absoluta, nem threshold mínimo de aceitabilidade, nem soma simples de métricas. Trata-se de um juízo prático comparativo dentro de um conjunto real de opções.

Daí seguem duas consequências. Primeiro, restrições reais podem reduzir o espaço das alternativas, mas não escolhem por si só a alternativa correta; restrição não é autoridade. Segundo, quando a alternativa ideal é eliminada por uma restrição genuína, a obrigação não desaparece: ela se desloca para a melhor alternativa remanescente. O ônus argumentativo recai sobre quem se afasta da alternativa que melhor serve o humano dentro do espaço ainda disponível.

## 7. O explanandum

O fenômeno a ser explicado e avaliado é este:

> No desenvolvimento de software, decisões técnicas e seus constrangimentos locais passam, com frequência, a adquirir autoridade de fato sobre a forma do sistema em lugar do humano relevante, de modo que o humano se adapta ao software mais do que o software a ele.

Esse explanandum não é "software ruim" em geral. Não é "falta de usabilidade", nem "dívida técnica", nem "arquitetura ruim", nem mero descompasso entre intenção e execução. O alvo é mais específico: um padrão recorrente de transferência, deslocamento ou obscurecimento de autoridade na definição da forma.

Os traços recorrentes desse fenômeno, assumidos aqui mas não provados nesta etapa, são:

- a adaptação do humano ao sistema é frequente e muitas vezes silenciosa;
- o feedback entre decisão e consequência costuma ser fraco, tardio ou opaco;
- quem decide frequentemente está menos exposto às consequências do que quem as sofre;
- o construtor futuro sofre os efeitos das decisões do construtor presente;
- o fenômeno pode emergir por acúmulo de decisões localmente razoáveis, sem culpado individual identificável;
- a experiência humana muitas vezes sequer entra no campo explícito de consideração da decisão técnica.

## 8. A questão reformulada

Com a substância conceitual anterior incorporada, a questão torna-se:

> Quando a forma de cada entidade de software precisa ser fixada sob restrições reais, é justificável que a implementação ou seus constrangimentos locais adquiram autoridade sobre essa forma, ou as decisões de design devem ser estruturadas de modo que a autoridade permaneça com quem usa diretamente as superfícies relevantes e remonte, por uma cadeia contínua de relações de uso, ao humano que nelas interagirá em runtime ou build-time, exigindo que essas superfícies e o comportamento por elas mediado ofereçam, entre as alternativas não excluídas por fatores fora do controle do decisor, a melhor experiência de interação possível?

Essa versão deixa de ser trivial porque especifica quatro pontos fortes ao mesmo tempo: o alvo é a forma de cada entidade, não apenas a borda do produto; a autoridade deve ser rastreável ao humano por uma cadeia contínua, não apenas invocada retoricamente; runtime e build-time pertencem ao mesmo espaço normativo; e "possível" já não significa "o que foi mais conveniente fazer", mas o que restou depois de descontados os limites genuínos do caso.

## 9. Concessão ao oponente

No movimento à Thomson de caridade máxima ao oponente, a análise concede desde já as premissas mais favoráveis à posição contrária:

1. Restrições são reais e pervasivas. Nem toda decisão pode otimizar para o humano sem custo; tempo, tecnologia, recursos, segurança e competências limitam o que pode ser feito.
2. Conhecimento de implementação é valioso. Quem constrói o sistema detém informação que o usuário do produto ou o mantenedor futuro nem sempre possuem, e essa informação pode melhorar decisões de forma.
3. Servir melhor o humano tem custo. Antecipar uso, manter vocabulário de superfície, preservar inteligibilidade e sustentar a cadeia de autoridade consome recursos.
4. O fenômeno nem sempre é grave. Em muitos casos, a adaptação do humano ao sistema é barata, aceitável ou praticamente imperceptível.

Mesmo concedendo tudo isso, a questão permanece intacta: dessas concessões segue-se que a implementação deva ter autoridade sobre a forma, ou segue-se apenas que o conjunto de alternativas factíveis é mais estreito do que uma formulação ingênua supunha?

## 10. Condições de contorno

### 10.1. Dentro do escopo

- relações de autoridade no design de software, do nível do produto ao nível de APIs, módulos e internals que entram em relação direta de uso humano;
- os dois regimes fundamentais de interação, runtime e build-time, tratados dentro do mesmo espaço normativo;
- a normatividade que emerge da classificação do software como artefato para uso humano, e não de uma ética geral independente do domínio;
- humanos que interagem diretamente com superfícies de uso, com ênfase nos dois casos centrais: usuário do produto e desenvolvedor;
- a reivindicação estrutural de que a autoridade sobre a forma deve permanecer rastreável, ao longo da composição do sistema, ao humano cujo uso lhe dá relevância normativa;
- decisões de design enquanto objetos de avaliação normativa, inclusive quando o fenômeno emerge sem culpado individual.

### 10.2. Fora do escopo (bracketed)

- metaética geral sobre a natureza de fatos normativos em domínios técnicos;
- prova empírica exaustiva da frequência do fenômeno;
- genealogia histórica de TDD, API-first, DIP ou práticas afins;
- teoria geral de governança organizacional e de quem "manda" em times ou empresas;
- avaliação comparativa de stacks, linguagens, frameworks ou arquiteturas específicas;
- imputação de culpa moral individual a desenvolvedores, times ou gestores;
- stakeholders meramente institucionais, quando não especificam ou mediam uma relação concreta de uso humano direto;
- casos em que o "humano" em pauta é um agente hostil ou abusivo, os quais entram primariamente como problema de segurança, não como destinatários imediatos da experiência a maximizar.

## 11. Teste de refutabilidade

A tese em formação só está filosoficamente bem delimitada se pudermos dizer o que a derrubaria. Ela seria refutada, por exemplo, se fosse demonstrado que:

**11.1. A autoridade da implementação serve igualmente bem ou melhor de modo não acidental.** Se houver um mecanismo estrutural pelo qual formas definidas primariamente pela implementação servem ao humano tão bem quanto, ou melhor do que, formas subordinadas ao uso, a transferência de autoridade perde sua força crítica.

**11.2. A cadeia é intraçável mesmo em princípio.** Se, em sistemas de software reais, a autoridade sobre a forma não puder ser rastreada ao humano nem mesmo idealmente, a tese exigirá algo impossível. Nesse caso, o problema não é apenas prático, mas conceitual.

**11.3. UX e DX não compartilham estrutura normativa suficiente.** Se for mostrado que interação em runtime e interação em build-time pertencem a domínios normativos incomensuráveis, a pretensão de um princípio único colapsa.

**11.4. Restrições possuem autoridade normativa própria.** Se restrições técnicas, econômicas ou institucionais não apenas reduzirem o conjunto de alternativas, mas também puderem determinar legitimamente a forma por si mesmas, a distinção entre peso deliberativo e autoridade desaparece.

**11.5. A assimetria entre decisor, executor e afetado é conceitualmente inadequada.** Se o domínio for tal que não faça sentido distinguir quem decide, quem implementa e quem arca com os custos de interação, a atribuição direcional de autoridade perde seu suporte analítico.

## 12. Riscos e pontos cegos

**12.1. "Constrangimento" ainda pode ocultar heterogeneidade excessiva.** A presente consolidação unifica impossibilidade, dificuldade, opacidade e custo por referência à degradação de dimensões da experiência de interação. Isso torna o conceito mais disciplinado do que na formulação inicial, mas não prova ainda que uma única categoria explicativa baste para todos os casos difíceis. **Decisão necessária:** estabelecer, nas etapas seguintes, se a unificação dimensional é suficiente ou se certas classes de constrangimento exigem tratamento separado.

**12.2. A tese ainda corre risco de trivialização por racionalização retrospectiva.** Sem um critério disciplinado para identificar quando uma alternativa factível superior foi preterida, quase qualquer decisão pode ser reinterpretada como estando "a serviço de algum humano". A distinção entre servir genuinamente e apenas racionalizar continua vulnerável. **Decisão necessária:** formular um teste que diferencie justificação real de acomodação ex post; um candidato natural é a precedência da superfície de uso sobre a implementação, mas isso ainda precisa ser defendido.

**12.3. O status de `P0` permanece discutível.** Tratar software como artefato para uso humano é uma premissa classificatória forte. Casos experimentais, autotélicos ou orientados a formas não usuais de autonomia podem pressioná-la. O presente documento responde a isso por delimitação de escopo, não por vitória filosófica final. **Decisão necessária:** escolher entre defender `P0` de modo mais robusto ou manter explicitamente a análise restrita ao domínio que `P0` recorta.

**12.4. Os dois casos centrais de humano relevante podem não esgotar toda a fenomenologia relevante.** Usuário do produto e desenvolvedor cobrem o eixo principal do problema, mas operadores, administradores, auditores, mantenedores de infraestrutura e outras figuras de uso direto podem exigir discriminações adicionais. **Decisão necessária:** determinar quando esses casos são apenas variantes dos dois regimes fundamentais e quando pedem tratamento autônomo.

**12.5. O modelo pressupõe deliberação justificável onde pode haver hábito, inércia e racionalização.** O vocabulário de dever, justificação e autoridade pressupõe que decisões de design possam ser tratadas como atos imputáveis a decisores. Na prática, muita decisão emerge por defaults, rotinas, atalhos cognitivos e adaptação institucional. **Decisão necessária:** explicitar se a tese é apenas um padrão de avaliação normativa de resultados, ou também um modelo exequível de deliberação técnica sob condições reais.

## 13. O que permanece em aberto

As etapas seguintes ainda terão de resolver, pelo menos, o seguinte:

1. defender substantivamente os compromissos `C2`, `C3`, `C4`, `C6` e `C7`, hoje apenas declarados;
2. mostrar por que a autoridade deve seguir a relação de uso, e não a conveniência local da implementação;
3. defender a tese forte da cadeia contínua de autoridade ao longo da composição do sistema e em todas as granularidades relevantes;
4. justificar a precedência da superfície de uso sobre a implementação, isto é, por que a implementação deve ser corrigida pela "porta" em vez de a porta ser silenciosamente absorvida pela implementação;
5. estabelecer um critério para conflitos entre humanos relevantes diferentes, inclusive entre runtime e build-time;
6. explicitar como comparar e ponderar dimensões da experiência quando elas entram em trade-off;
7. oferecer um método para verificar, antes ou depois da implementação, que a alternativa escolhida era realmente a melhor possível dentro do espaço factível;
8. esclarecer os casos-limite de restrições legítimas, compromissos herdados, mediadores, proxies e humanos de fronteira sem dissolver a unidade do princípio.
