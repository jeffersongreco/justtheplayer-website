# Identificação e Delimitação do Problema Normativo

## 1. A questão bruta

No desenvolvimento de software, é recorrente que a forma do sistema acabe sendo ditada pelo que é mais conveniente para implementar, integrar, testar ou manter localmente. O resultado familiar é duplo: o usuário do produto adapta seu comportamento ao sistema, e o desenvolvedor adapta seu trabalho ao codebase, muitas vezes mais do que o sistema se adapta a eles. A direção predominante da relação é esta: o humano adapta-se ao sistema mais do que o inverso.

Em linguagem ordinária, isso aparece como "software ruim", "UX ruim", "DX ruim", "dívida técnica", "falta de design", "o legado não deixa" ou "era o que dava para fazer". Essas fórmulas capturam algo real, mas misturam, sem distinguir, descrição de fenômeno, juízo de valor, hipótese causal e proposta de solução. Enquanto a questão permanece nesse estado bruto, o alvo se desloca entre problema de produto, arquitetura, processo, cultura, competência ou escassez de recursos.

A formulação bruta da questão é esta:

> Quando a forma de um artefato de software precisa ser fixada, quem deveria ter autoridade sobre ela: a implementação e seus constrangimentos locais, ou o humano que o usa?

Antes de defender qualquer princípio, é preciso fixar que tipo de autoridade, que forma e que humano estão em disputa.

## 2. Por que a questão é filosoficamente problemática

A pergunta, como formulada, carrega ambiguidades suficientes para impedir análise direta.

**2.1. Ela mistura descrição, avaliação, causalidade e solução.** Expressões ordinárias como "software ruim" ou "o legado não deixa" embaralham quatro coisas distintas: a descrição de um fenômeno, um juízo de valor sobre ele, uma hipótese sobre sua causa e uma sugestão de remédio. Além disso, confundem a afirmação empírica de que a implementação de fato adquire autoridade com a afirmação normativa de que isso conta contra a decisão e exige justificação. Se o fenômeno não existe, a norma é ociosa; se existe, mas não é problemático, a norma é infundada.

**2.2. "Autoridade" é ambígua.** Pode significar autoridade causal, autoridade normativa ou autoridade prática. O fenômeno motivador é causal: decisões técnicas e seus constrangimentos passam a determinar a forma. A tese a ser avaliada é normativa: se isso deveria ocorrer. Se esses sentidos não forem apartados, o argumento oscila sem controle.

**2.3. "Forma" unifica fenômenos heterogêneos.** A forma relevante do software pode envolver interface pública, comportamento observável, constrangimentos impostos ao consumidor, superfícies técnicas de integração e estrutura interna tornada objeto de uso humano. Sem decomposição, não se sabe sobre o que exatamente recai a autoridade.

**2.4. "Humano que usa" é subdeterminado.** Há pelo menos dois casos centrais de uso direto: o humano que interage com o produto em runtime e o humano que interage com o código em build-time. Eles podem coincidir na mesma pessoa ou divergir em interesses. A questão bruta não diz qual humano está em jogo, como tratar conflitos entre eles, nem se runtime e build-time pertencem ao mesmo espaço normativo.

**2.5. A pergunta cruza níveis diferentes de análise.** Há um nível conceitual, que precisa estabilizar termos como `software`, `interação`, `restrição` e `uso`; um nível empírico, sobre frequência, visibilidade e evitabilidade do fenômeno; e um nível normativo, sobre quem deve ter precedência quando há tensão. Se esses níveis forem fundidos, a discussão cai ora em sociologia do desenvolvimento, ora em semântica, ora em ética aplicada, sem reconhecer a mudança.

**2.6. O papel das restrições reais é deixado indeterminado.** Tempo, custo, legados, ferramentas, plataformas, segurança, interoperabilidade e limites cognitivos existem. A questão não é se existem, mas se sua existência basta para lhes conceder autoridade sobre a forma. Sem essa distinção, a análise colapsa ou em fatalismo técnico, ou em voluntarismo moral.

**2.7. A formulação inicial parece auto-respondível.** Perguntada abstratamente como "humano ou implementação?", a resposta "humano" parece trivial. Isso é sinal de formulação ruim. A disputa real não é entre pessoa e máquina em abstrato, mas entre autoridade humana e conveniência local da implementação dentro de um espaço de alternativas restringido por fatos reais.

**2.8. Há compromissos valorativos operando sem declaração.** Termos como "constrangimento", "adaptação silenciosa", "ônus", "negligência" ou "retroalimentação" não são descrições neutras. Eles já pressupõem que certos efeitos sobre humanos contam normativamente contra uma decisão. A passagem do factual ao valorativo ocorre sem declaração explícita: o juízo já entra embutido no vocabulário. Esses compromissos precisam ser assumidos, defendidos ou bracketed, não herdados sem exame.

## 3. Desagregação: mapa de questões embutidas

Antes de argumentar, convém decompor a pergunta composta nas subquestões que a tornam tratável:

| # | Subquestão | Tipo | Status nesta análise |
|---|---|---|---|
| Q1 | O que contam, neste contexto, como `software`, `comportamento`, `superfície de uso`, `interação`, `autoridade` e `restrição`? | Conceitual | **Tratada** como instrumento de estabilização |
| Q2 | Quais categorias de humano relevante contam, e como os casos centrais de runtime e build-time emergem dessa definição? | Conceitual / de escopo | **Tratada** para fixar o alvo da questão |
| Q3 | O fenômeno existe na prática: a implementação adquire autoridade de fato sobre a forma e, em que condições, a adaptação do humano se torna silenciosa, opaca ou normalizada? | Empírica-descritiva | **Assumida**; pressuposta, não provada estatisticamente |
| Q4 | UX e DX pertencem ao mesmo espaço normativo relevante ou apenas se parecem por analogia? | De unificação | **Subsidiária**; precisa ser defendida porque a tese quer ser una |
| Q5 | Quando conveniência de implementação, restrições reais e uso humano entram em tensão, quem deve ter autoridade sobre a forma? | Normativa de primeira ordem | **Central**; esta é a questão principal |
| Q6 | Restrições reais alteram o que é requerido? Se sim, como? | De limites | **Subsidiária**; tratada como teste da tese central |
| Q7 | A reivindicação vale apenas para a interface do produto ou também para APIs, internals e toda a cadeia de composição? | De escopo estrutural | **Subsidiária**; a ser defendida nas etapas seguintes |
| Q8 | Como agregar diferenças entre indivíduos de uma mesma categoria de uso e como ponderar exaustivamente dimensões da experiência no interior dessa categoria? | UX/DX aplicada | **Bracketed**; fora do escopo desta análise |

**Questão selecionada:** Q5. Q1 e Q2 estabilizam os termos; Q3 é assumida como pano de fundo empírico; Q4, Q6 e Q7 delimitam, testam ou complicam a resposta à pergunta central; Q8 fica bracketed por pertencer à disciplina aplicada de UX/DX, não à tese normativa aqui formulada.

## 4. Tipo de questão normativa

Esta é uma questão de **primeira ordem normativa**, aplicada ao design de software. Ela pergunta qual polo deve ter autoridade sobre a forma do sistema quando conveniência de implementação, restrições reais e uso humano entram em tensão.

- **Não é metaética**: não pergunta o que significa, em geral, o termo "deve", nem se existem fatos normativos em domínios técnicos.
- **Não é puramente conceitual**: usa clarificação conceitual como ferramenta, mas não se esgota nela.
- **Não é uma investigação empírica exaustiva**: parte de um fenômeno reconhecível por praticantes competentes, sem exigir nesta etapa demonstração estatística abrangente de sua frequência.

A análise usa clarificação conceitual como instrumento e evidência empírica como pressuposto, mas o alvo é um juízo normativo: dada a existência do fenômeno, onde deveria residir a autoridade sobre a forma?

A tese, portanto, é um **padrão normativo de avaliação** de decisões e formas de software, não um modelo psicológico, sociológico ou organizacional de como agentes realmente deliberam.

## 5. Formulação-semente e decomposição formal

### 5.1. A formulação-semente

A intuição normativa de partida pode ser enunciada assim:

> Um software será criado; se um humano irá interagir com ele no futuro, ele deve ser feito para proporcionar a melhor experiência de interação possível para esse humano.

Em forma mais precisa:

> Se `S` é um software a ser criado, e se existe ao menos uma categoria de uso humano `H` para a qual `S` oferecerá alguma superfície de uso por meio da qual seu comportamento poderá ser diretamente operado, interpretado, mantido ou experimentado, então as superfícies de uso e o comportamento de `S` devem ser escolhidos de modo a oferecer a `H` a melhor experiência de interação possível dentro do conjunto de alternativas realmente viáveis.

### 5.2. Decomposição dos elementos

| Elemento | Trecho | Papel |
|---|---|---|
| Contexto | "Um software será criado" | Situa a obrigação no momento da criação, quando as decisões ainda estão sendo tomadas |
| Condição | "se um humano irá interagir com ele no futuro" | Ativa a obrigação e a orienta por uma categoria de uso futura e relevante |
| Operador normativo | "deve ser feito" | Localiza a obrigação no ato de projetar e fazer, não no artefato pronto |
| Alvo | "para proporcionar a melhor experiência de interação possível" | Introduz o standard normativo e o qualificador de factibilidade |
| Indexação | "para esse humano" | Vincula a avaliação à categoria de uso diretamente afetada, não a um usuário abstrato ou a um indivíduo isolado |

### 5.3. O operador normativo: "deve"

"Deve ser feito" coloca a obrigação no ato de criação. O sujeito da obrigação não é o software, é o decisor: quem quer que tome decisões que afetam a forma do artefato. Se a decisão for tomada por inércia, hábito ou por default do framework, a obrigação não desaparece; foi negligenciada.

A obrigação é **pro tanto** (não absoluta). Pode ser sobreposta por restrições genuínas. Mas o ônus é de quem deixa de cumprir: precisa justificar por que a alternativa que melhor servia o humano não foi a adotada. Essa inversão do ônus é central: o default não é "qualquer decisão é permissível até que se prove problemática"; o default é "a decisão deve otimizar para o humano, e desvios precisam de justificação".

### 5.4. A estrutura condicional: "se... no futuro"

A condição "se um humano irá interagir" faz quatro coisas:

**Torna a obrigação condicional, não categórica.** A fonte da obrigação é a perspectiva de interação humana, não uma propriedade intrínseca do código. Código que nenhum humano jamais verá, usará ou manterá, se existir, fica fora do escopo; a condição não se satisfaz.

**É futura.** "Irá interagir" coloca a obrigação no momento da decisão de design, antes da interação acontecer. O decisor deve antecipar. O gap temporal entre decisão e consequência não elimina a obrigação; é a razão pela qual a obrigação existe.

**É trivialmente satisfeita para software relevante.** Todo software no sentido desta análise (→ §6.1) terá pelo menos um humano que interage: o desenvolvedor. A condição é, portanto, universalmente satisfeita para o domínio em questão. A forma condicional, porém, continua preferível à afirmação categórica porque fundamenta a obrigação num fato contingente, não numa metafísica.

**Admite leitura categorial, não individualizante.** A formulação usa o singular gramatical, mas o nível normativo relevante não é o de cada indivíduo tomado isoladamente. "Usuário do produto" e "desenvolvedor" funcionam aqui como categorias de uso: as decisões respondem às superfícies usadas por essas categorias, não a cada pessoa particular uma por vez. A agregação entre indivíduos dentro de uma mesma categoria pertence à prática de UX/DX, não à tese normativa desta análise.

## 6. Clarificação conceitual

A formulação-semente contém conceitos que a questão bruta (§1) usou sem estabilizar. Sem clarificá-los, o argumento oscila entre sentidos diferentes dos mesmos termos. Esta seção fixa o vocabulário mínimo necessário.

### 6.1. Software

**Artefato.** Neste contexto, um artefato é algo produzido intencionalmente para entrar em uma prática de uso. Não é apenas uma coisa que existe; é uma coisa feita para ser usada, operada, modificada, integrada ou mantida por alguém.

**Software.** Software, no sentido relevante desta análise, é um artefato técnico cujas formas estruturam possibilidades de ação, compreensão e manutenção ao longo do tempo, em qualquer granularidade em que um humano interaja com sua superfície. Ele não se reduz a executáveis finais. Abrange aplicações, bibliotecas, APIs, módulos, funções, componentes e qualquer outra granularidade em que alguma forma do artefato venha a ser operada, interpretada, integrada, modificada ou mantida por um humano.

Essa definição tem uma consequência de escopo. Se não houver qualquer horizonte de interação humana direta com alguma forma do artefato, ele cai fora do domínio normativo aqui analisado. Isso não nega que tal código possa existir; apenas significa que ele não é "software", no sentido relevante para a presente questão, porque lhe falta a relação de uso que torna inteligível o problema normativo.

**Relação com `P0`.** A premissa fundacional `P0` (→ §10.3) afirma que software é artefato cuja razão de existir é entrar em relações de uso humano. Dizer isso não é inserir um slogan moral externo, mas classificar o tipo de artefato que está sendo avaliado. A forma condicional da formulação-semente preserva esse status classificatório: se não houver interação humana, o caso fica fora do escopo; a análise não precisa afirmar um dever metaético de que "todo código deve servir humanos".

### 6.2. Comportamento

Comportamento é o conjunto de respostas observáveis do sistema a entradas, estados e transições. Inclui o que o sistema faz, deixa de fazer, permite, impede, sinaliza e preserva sob condições relevantes de uso.

Em runtime, comportamento aparece como estados, fluxos, feedbacks, erros, transições e resultados observáveis do produto em funcionamento. Em build-time, aparece também como efeitos de superfícies técnicas: contratos aceitos ou rejeitados, falhas, mensagens, previsibilidade de integração e consequências de mudança. Comportamento, portanto, não é só "o que roda"; é aquilo que o artefato manifesta de modo observável nas relações humanas de uso.

### 6.3. Superfície de uso

Superfície de uso é qualquer forma do software com a qual um humano pode interagir diretamente para produzir, observar, interpretar, configurar, modificar, operar ou manter comportamento.

Em runtime, são superfícies de uso, por exemplo, telas, comandos, fluxos de navegação, estados observáveis e mecanismos de feedback. Em build-time, são superfícies de uso, por exemplo, APIs públicas, tipos, contratos, mensagens de erro, convenções, pontos de extensão e formas internas do código que se tornam objeto de leitura, escrita, composição, depuração e manutenção.

Nem toda estrutura interna do software é, por si só, uma superfície de uso. Ela só entra no campo normativo relevante quando passa a integrar a relação direta entre uma forma do sistema e um humano. Nesse sentido, a superfície de uso é a porta relevante do artefato: o ponto em que sua forma entra em relação direta com um humano.

### 6.4. Interação

Interação é a relação em que um humano atua diretamente sobre uma superfície de uso e, por meio dela, recebe, interpreta, produz, modifica, opera ou mantém comportamento.

Os modos centrais de interação são três:

- **usar**: operar o produto em funcionamento;
- **consumir**: integrar APIs, módulos ou componentes;
- **manter**: ler, depurar, modificar, estender ou configurar comportamento existente.

Nos três casos, o humano encontra uma superfície cujas propriedades facilitam ou dificultam sua ação e compreensão.

Interação, no sentido relevante, não inclui qualquer efeito causal remoto do software sobre pessoas. Um usuário afetado por lentidão causada por um banco de dados não interage com o banco; interage com o produto. A superfície relevante, nesse caso, é a do produto, não a do banco. Tampouco conta como interação decidir sobre um software sem engajar com sua superfície; nesse caso, opera-se sobre representações, relatórios ou abstrações organizacionais, não sobre o artefato correspondente.

### 6.5. Runtime e build-time

Runtime e build-time são os dois regimes fundamentais de interação humana com software.

**Runtime** é o regime em que o software é operado como produto em funcionamento. Aqui, o humano interage com superfícies voltadas à execução efetiva do sistema: navega estados, fornece entradas, interpreta feedbacks, lê saídas e busca fins práticos de uso.

**Build-time** é o regime em que o software é lido, escrito, configurado, integrado, testado, depurado, estendido ou mantido. Aqui, a interação humana não é com o produto em operação, mas com as superfícies pelas quais o software se deixa construir, compreender e modificar.

A distinção importa porque impede uma falsa redução da normatividade a UX superficial. DX não é um caso metafórico de uso; é interação direta com superfícies de uso em outro regime da mesma estrutura normativa.

### 6.6. Humano relevante

**Definição.** Humano relevante é, no plano empírico, todo humano para quem o software, por meio de uma superfície de uso, produz diretamente efeitos de ação, compreensão, esforço ou resposta que a decisão de design correspondente pode melhorar, piorar, facilitar, dificultar ou tornar mais inteligíveis. No plano normativo desta tese, porém, esses humanos são tratados por **categorias de uso**, não como uma coleção de indivíduos avaliados separadamente.

A ordem de dependência é importante. Não há uma instância externa que primeiro decide se alguém entra no campo de avaliação. O inverso é o correto: porque o software lhe produz diretamente esses efeitos por meio de uma superfície de uso, esse humano já pertence ao campo de avaliação da decisão que molda essa superfície e o comportamento por ela mediado.

Da combinação entre essa definição e os dois regimes fundamentais emergem os dois casos centrais da análise:

- quando a interação direta ocorre com superfícies em runtime, o humano relevante é o usuário do produto;
- quando a interação direta ocorre com superfícies em build-time, o humano relevante é o desenvolvedor.

Esses dois casos não são escolhas arbitrárias introduzidas de fora. Eles são os enquadramentos recorrentes gerados pela própria estrutura do problema e funcionam como categorias normativas de uso.

Casos de fronteira seguem a mesma lógica:

- o mesmo humano pode instanciar os dois papéis em momentos diferentes; isso produz duas relações de uso, não uma exceção à distinção;
- humanos futuros contam plenamente, inclusive o próprio autor do código em um momento posterior;
- operadores, administradores, auditores e mantenedores de infraestrutura contam quando interagem diretamente com painéis, CLIs, interfaces de log, contratos ou superfícies análogas; quando não há interação direta, aparecem apenas como mediações;
- PMs, designers, gestores, investidores e outros stakeholders institucionais não se tornam raízes de autoridade apenas por sua posição; quando contam, contam como mediadores, proxies ou especificadores de relações concretas de uso humano.

Dizer que UX e DX pertencem ao mesmo espaço normativo não significa dizer que são idênticos em conteúdo. Significa que, nos dois casos, há uma categoria de uso humano, uma superfície de uso, uma experiência que pode ser melhor ou pior e a mesma pergunta sobre autoridade. O que muda é o regime, o vocabulário da superfície e o tipo de tarefa humana; isso não basta para separar UX e DX em domínios normativos independentes.

### 6.7. Experiência de interação

Experiência de interação é o perfil de exigências e facilidades que uma superfície de uso e o comportamento por ela mediado impõem à categoria de uso que a utiliza na realização de seu propósito legítimo com o artefato.

Ela não é sentimento subjetivo puro, embora inclua aspectos subjetivos. Também não é propriedade objetiva do artefato isolado. Ela é relacional: as propriedades da superfície enquanto afetam essa categoria de uso em sua capacidade de usar, compreender, operar, integrar ou manter o software.

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

Outras dimensões podem ser normativamente relevantes: propensão a erro, custo de adaptação, recuperabilidade após falha, entre outras. O ponto filosófico não é congelar uma taxonomia definitiva, mas tornar claro que a experiência é multidimensional e que o mesmo espaço estrutural vale para UX e DX, ainda que o conteúdo empírico das dimensões varie entre os dois regimes. O catálogo exaustivo dessas dimensões, bem como sua operacionalização fina, pertence à disciplina aplicada de UX/DX e fica fora do escopo desta tese.

"Boa experiência" não significa experiência "agradável" em sentido superficial. Significa experiência ajustada ao uso humano legítimo, com o mínimo de ônus evitável e o máximo de inteligibilidade viável no caso.

Isso também fornece um critério de unificação para "constrangimento". Constrangimento relevante é qualquer propriedade da superfície de uso ou do comportamento por ela mediado que degrade uma ou mais dimensões da experiência de interação para a categoria de uso relevante na superfície em questão. A unificação é normativa-funcional, não ontológica: impossibilidade, dificuldade, opacidade, custo ou inconsistência podem ser fenômenos causais distintos, mas pertencem ao mesmo problema porque exercem a mesma função normativa de piorar a relação de uso humano. Impossibilidade degrada capacidade; opacidade degrada compreensibilidade; custo evitável degrada esforço; inconsistência degrada previsibilidade; feedback fraco degrada recuperabilidade.

### 6.8. "Melhor possível"

O sintagma "melhor possível" decompõe-se em dois componentes.

**"Possível"** delimita o conjunto de alternativas comparáveis. Uma alternativa só sai desse conjunto quando é excluída por fatores fora do controle do decisor e normativamente vinculantes no caso. Exemplos paradigmáticos são: impossibilidade lógica ou técnica do medium, limites do estado da arte, requisitos legais ou regulatórios, exigências de segurança, privacidade ou integridade, interoperabilidade necessária, compromissos anteriores legitimamente vinculantes que o decisor presente não pode unilateralmente rever, e recursos genuinamente insuficientes para aquela alternativa.

Disso segue um corolário direto: fatores que permanecem sob controle do decisor não reduzem o espaço do possível. Conveniência local da implementação, hábito, inércia não examinada do legado, defaults de ferramenta, falta de diligência investigativa, presunções especulativas de escala ou simples indisposição para explorar alternativas podem explicar uma decisão; não a convertem em inevitável.

Daí a distinção central entre **restrição** e **autoridade**. Restrição é o fato que reduz o conjunto de alternativas disponíveis. Autoridade é o critério que decide qual alternativa deve ser escolhida dentre as disponíveis. Uma restrição pode eliminar opções; ela não escolhe, por si só, a melhor configuração de superfícies de uso e comportamento.

**"Melhor"** é o superlativo dentro do espaço assim delimitado. Entre as alternativas não excluídas por fatores fora do controle do decisor, conta como melhor aquela que oferece à categoria de uso relevante a experiência de interação mais favorável nas dimensões que importam para aquele caso. "Melhor" não significa perfeição absoluta, nem threshold mínimo de aceitabilidade, nem soma simples de métricas. Trata-se de um juízo prático comparativo dentro de um conjunto real de opções.

Daí seguem três consequências:

1. "Melhor possível" é um standard de direção, não de threshold: pergunta se havia alternativa factível superior, não se um mínimo aceitável foi atingido.
2. Quando uma restrição genuína elimina a alternativa ideal, a obrigação não desaparece; ela se desloca para a melhor alternativa remanescente.
3. A formulação tem critério de demarcação: se uma alternativa factível superior foi preterida por um fator sob o controle do decisor, o princípio foi violado; se a melhor alternativa factível foi escolhida, ainda que imperfeita, o princípio foi satisfeito. Em forma compacta: **violação = alternativa factível superior + preterição por fator controlável pelo decisor**.

## 7. O explanandum

O fenômeno a ser explicado e avaliado é este:

> No desenvolvimento de software, decisões técnicas adquirem autoridade de fato sobre a forma do sistema em lugar do humano que o usa.

Esse explanandum não é "software ruim" em geral. Não é "falta de usabilidade", nem "dívida técnica", nem "arquitetura ruim". O alvo é mais específico: um padrão recorrente de inversão, obscurecimento ou deslocamento de autoridade na definição da forma.

O fenômeno inclui dois casos diretamente relevantes:

- o usuário do produto, que sofre ou se beneficia da forma do sistema em runtime;
- o desenvolvedor, que sofre ou se beneficia da forma do código em build-time.

O que torna esse explanandum um problema normativo, e não apenas mecânica técnica, é a presença de compromissos de valor tornados explícitos em §10.4.

Os traços recorrentes desse fenômeno, assumidos aqui mas não provados nesta etapa, são:

- a adaptação do humano ao sistema é frequente e muitas vezes silenciosa;
- o feedback entre decisão e consequência costuma ser fraco, tardio ou opaco;
- quem decide frequentemente está menos exposto às consequências do que quem as sofre;
- o construtor futuro sofre os efeitos das decisões do construtor presente;
- o fenômeno pode emergir por acúmulo de decisões localmente razoáveis, sem culpado individual identificável;
- a experiência humana muitas vezes sequer entra no campo explícito de consideração da decisão técnica.

## 8. A questão reformulada

Com a substância conceitual anterior incorporada, a questão torna-se:

> É justificável que, em software, a implementação ou seus constrangimentos locais adquiram autoridade sobre a forma do sistema em lugar do humano que o usa?

Em termos técnicos, isso equivale a perguntar se, para cada categoria de uso que interaja diretamente com uma superfície relevante, essa superfície e o comportamento por ela mediado devem ser definidos de modo a oferecer, entre as alternativas não excluídas por fatores fora do controle do decisor, a melhor experiência de interação possível, mantendo a autoridade rastreável à categoria de uso relevante ao longo das entidades do sistema.

Essa versão deixa de ser trivial porque especifica ao mesmo tempo: o que conta como humano relevante, o que conta como superfície de uso, o que "possível" significa, o que "melhor" significa e em que sentido a autoridade deve permanecer com o humano em vez de ser deslocada para a conveniência local da implementação.

## 9. Concessão ao oponente

Para testar a tese em sua forma mais forte, a análise concede desde já as premissas mais favoráveis à posição contrária:

1. **Restrições são reais e pervasivas.** Nem toda decisão pode otimizar para o humano sem custo; tempo, tecnologia, recursos, segurança e competências limitam o que pode ser feito. O ponto em disputa não é a existência de restrições, mas seu estatuto normativo.
2. **Conhecimento de implementação é valioso.** Quem constrói o sistema detém informação que o usuário do produto ou o mantenedor futuro nem sempre possuem, e essa informação pode melhorar decisões de forma.
3. **Servir melhor o humano tem custo.** Antecipar uso, manter vocabulário de superfície, preservar inteligibilidade e sustentar a cadeia de autoridade consome recursos.
4. **O fenômeno nem sempre é grave.** Em muitos casos, a adaptação do humano ao sistema é barata, aceitável ou praticamente imperceptível.
5. **O fenômeno não exige culpado individual.** Ele pode emergir por acúmulo de decisões localmente razoáveis, sem intenção maliciosa de nenhum agente individual.

Mesmo concedendo tudo isso, a questão permanece intacta: dessas concessões segue-se que a implementação deva ter autoridade sobre a forma, ou segue-se apenas que o conjunto de alternativas factíveis é mais estreito do que uma formulação ingênua supunha?

A tese a ser defendida nas etapas seguintes sustenta que custos reais mudam o que é factível, não quem decide. Isso ainda precisa ser argumentado; por ora, fica explicitado como o ponto exato da disputa.

## 10. Condições de contorno

### 10.1. Dentro do escopo

- relações de autoridade no design de software, do nível do produto ao nível de APIs, módulos e internals que entram em relação direta de uso humano;
- os dois regimes fundamentais de interação, runtime e build-time, tratados dentro do mesmo espaço normativo;
- a normatividade que emerge da classificação do software como artefato para uso humano, e não de uma ética geral independente do domínio;
- categorias de uso que interagem diretamente com superfícies de uso, com ênfase nos dois casos centrais: usuário do produto e desenvolvedor;
- a experiência de interação como critério normativo multidimensional;
- a distinção entre restrição, que reduz alternativas, e autoridade, que decide entre alternativas;
- a reivindicação estrutural de que a autoridade sobre a forma deve permanecer rastreável, ao longo da composição do sistema, à categoria de uso cujo contato com a superfície lhe dá relevância normativa.

### 10.2. Fora do escopo (bracketed)

| Item | Razão |
|---|---|
| Metaética geral sobre a natureza de fatos normativos em domínios técnicos | A análise a pressupõe, mas não a defende |
| Prova empírica exaustiva da frequência do fenômeno | O fenômeno é assumido com base em reconhecimento por praticantes competentes |
| Genealogia histórica de TDD, API-first, DIP ou práticas afins | Compartilham superfície com a tese, não sua fundação |
| Teoria geral de governança organizacional e de quem "manda" em times ou empresas | A questão é sobre autoridade de design, não sobre comando institucional |
| Psicologia, sociologia ou teoria organizacional da deliberação técnica real | A tese avalia decisões e formas; não modela como agentes efetivamente deliberam |
| Avaliação comparativa de stacks, linguagens, frameworks ou arquiteturas específicas | O princípio é agnóstico em relação a tecnologia específica |
| Imputação de culpa moral individual a desenvolvedores, times ou gestores | O fenômeno pode emergir sem culpado individual |
| Stakeholders meramente institucionais, quando não especificam ou mediam uma relação concreta de uso humano direto | Não são raízes de autoridade por si mesmos |
| Casos adversariais, punitivos ou dissuasórios em que a piora deliberada da experiência recai sobre agente hostil, abusivo ou adversarial | Entram primariamente como problema de segurança ou contenção, não como caso simples de experiência a maximizar |
| Agregação entre indivíduos particulares dentro de uma mesma categoria de uso | Pertence à prática de UX/DX, pesquisa, segmentação e decisão de produto, não à tese normativa aqui formulada |
| Catálogo exaustivo de dimensões da experiência | Pertence à disciplina de UX/DX, não a esta análise normativa |
| Regra geral de ponderação fina entre dimensões da experiência | Pertence à disciplina de UX/DX e aos métodos aplicados de avaliação, não ao núcleo conceitual da tese |

Em contraste, casos em que a experiência de uma categoria de uso legítima, ou dos humanos que a instanciam, é deliberadamente piorada, ou explicitamente tratada como irrelevante, permanecem **dentro** do escopo: não são exceções ao princípio, mas casos paradigmáticos de sua violação.

### 10.3. Premissas fundacionais

**`P0`: software, no sentido relevante desta análise, é artefato cuja razão de existir é entrar em relações de uso humano.** Trata-se de uma premissa classificatória de escopo, com pretensão analítica dentro do domínio recortado. Ela não afirma que todo código, em qualquer sentido possível, tenha um dever moral externo de servir humanos; afirma que, para esta análise, só há software normativamente relevante quando há relação de uso humano a ser avaliada. A forma condicional da formulação-semente preserva esse ponto: sem interação humana, o caso fica fora do escopo. Casos experimentais, autotélicos ou orientados a formas não usuais de autonomia não refutam `P0`; apenas ficam fora do domínio que `P0` recorta.

**`P1`: em cada relação de uso, a autoridade é tratada como direcional e assimétrica.** Trata-se de uma escolha de modelagem, não de uma descoberta empírica. Onde houver aparência de simetria, a análise a decompõe em relações distintas em vez de atribuir autoridade conjunta indiferenciada.

### 10.4. Compromissos normativos declarados

Como o material que motiva a análise já traz juízos de valor embutidos (→ §2.8), eles precisam ser declarados pelo seu status:

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

## 11. Teste de refutabilidade

A tese em formação só está filosoficamente bem delimitada se pudermos dizer o que a derrubaria. Ela seria refutada, por exemplo, se fosse demonstrado que:

**11.1. A autoridade da implementação serve igualmente bem ou melhor de modo não acidental.** Se houver um mecanismo estrutural pelo qual formas definidas primariamente pela implementação servem ao humano tão bem quanto, ou melhor do que, formas subordinadas ao uso, a transferência de autoridade perde sua força crítica.

**11.2. A cadeia é intraçável mesmo em princípio.** Se, em sistemas de software reais, a autoridade sobre a forma não puder ser rastreada ao humano nem mesmo idealmente, a tese exigirá algo impossível. Nesse caso, o problema não é apenas prático, mas conceitual.

**11.3. UX e DX não compartilham estrutura normativa suficiente.** Se for mostrado que interação em runtime e interação em build-time pertencem a domínios normativos incomensuráveis, a pretensão de um princípio único colapsa.

**11.4. Restrições possuem autoridade normativa própria.** Se restrições técnicas, econômicas ou institucionais não apenas reduzirem o conjunto de alternativas, mas também puderem determinar legitimamente a forma por si mesmas, a distinção entre peso deliberativo e autoridade desaparece.

**11.5. A assimetria entre decisor, executor e afetado é conceitualmente inadequada.** Se o domínio for tal que não faça sentido distinguir quem decide, quem implementa e quem arca com os custos de interação, a atribuição direcional de autoridade perde seu suporte analítico.

Esses cinco cenários bastam para mostrar que a tese é genuinamente refutável. Se nada desse tipo pudesse sequer ser descrito, a tese ainda não estaria filosoficamente delimitada.

## 12. O que permanece em aberto

As etapas seguintes ainda terão de resolver, pelo menos, o seguinte:

1. defender substantivamente os compromissos `C2`, `C3` e `C4`;
2. defender `C6` e `C7`, isto é, a distinção entre restrição e autoridade e a unificação normativa entre UX e DX;
3. mostrar por que a autoridade deve permanecer rastreável ao longo da cadeia de composição do sistema e em todas as granularidades relevantes;
4. esclarecer a precedência temporal e estrutural entre experiência de uso e implementação, isto é, por que a implementação deve ser corrigida pela superfície de uso e não o contrário;
5. oferecer um método para verificar, antes ou depois da implementação, que a alternativa escolhida era realmente a melhor possível dentro do espaço factível;
6. mostrar que a tese aqui delimitada é a melhor formulação do problema, e não apenas uma formulação possível.
