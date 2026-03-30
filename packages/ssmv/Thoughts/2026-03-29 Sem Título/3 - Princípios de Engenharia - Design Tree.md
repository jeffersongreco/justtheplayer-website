# Princípios de Engenharia — Design Tree

> Terceira camada na sequência UseDD → Restrições de Domínio → Princípios de Engenharia. Parte das liberdades que as camadas anteriores deixam em aberto — tanto as explicitamente registradas (G1–G7 da árvore de domínio) quanto preocupações universais de engenharia que aquelas camadas não abordam — e escolhe princípios que as constrangem.
>
> Esta árvore não prescreve uma arquitetura. Produz restrições adicionais que reduzem o espaço de arquiteturas possíveis neste domínio, eliminando as que satisfazem UseDD e as restrições de domínio mas ainda permitem código frágil, acoplado, ou intratável.
>
> Termos herdados conforme os glossários de UseDD e Restrições de Domínio: entidade, porta, decisor, executor, uso, usuário, cadeia de autoridade, porta UX, porta DX.

---

## Nó Raiz

**Observação:** Um sistema pode satisfazer todas as restrições de UseDD e todas as derivações de domínio e ainda ser código ruim. UseDD constrange a direção de autoridade e a separação decisão/execução. O domínio constrange os fatos da plataforma e as relações mínimas entre entidades. Nenhum dos dois constrange:

- Se entidades dependem de abstrações ou de implementações concretas
- Se estado é consistente ou espalhado
- Se preocupações estão coesas ou fragmentadas
- Se o sistema tolera mudança ou quebra com cada requisito novo
- Se entidades são verificáveis em isolado
- Se a cadeia de autoridade é curta ou desnecessariamente longa
- Se efeitos colaterais estão contidos ou difusos
- Se executores recebem instruções completas ou consultam outros durante a execução

Esses são problemas universais de engenharia de software. Não emergem do domínio — emergem do ato de construir software em qualquer domínio. As camadas anteriores não os abordam porque são meta-princípio e análise de domínio, não engenharia. Esta camada escolhe princípios que os abordam.

---

## L — Liberdades: o que está em aberto

### L.h — Liberdades herdadas (domínio-específicas, G1–G7)

> Registradas na árvore de Restrições de Domínio. Resumo:

- **G1** — Template e script: uma entidade ou duas?
- **G2** — Quantas entidades de cada lado (decisor/executor)?
- **G3** — Estado co-localizado com decisão ou separado?
- **G4** — Ambas as portas servidas pela mesma entidade decisora ou por entidades diferentes?
- **G5** — Coleta de eventos: mesma entidade que escreve na DOM ou separada?
- **G6** — Mecanismo de comunicação entre decisora e executora
- **G7** — O script é decisor, tradutor, ou ambos?

### L.u — Liberdades universais (não abordadas pelas camadas anteriores)

> Preocupações de engenharia de software que surgem em qualquer sistema, independentemente de domínio. UseDD + domínio são silenciosos sobre todas elas.

#### L.u1 — Consistência de estado

Quantas entidades podem deter o mesmo fato? UseDD diz que mudanças de estado são decisões (e portanto do decisor), mas não diz se o mesmo fato pode ser armazenado em mais de uma entidade simultaneamente.

#### L.u2 — Direção de dependência

UseDD constrange a direção de *autoridade* (decisor → executor). Não constrange a direção de *dependência de código*. Um executor pode depender de uma implementação concreta do decisor ou de uma abstração. UseDD é agnóstico.

#### L.u3 — Coesão interna

UseDD separa decisão de execução, mas não constrange se decisões do mesmo assunto ficam juntas ou espalhadas. Duas entidades decisoras podem dividir decisões do mesmo domínio entre si sem violar UseDD — desde que em cada par a autoridade seja clara.

#### L.u4 — Tolerância a mudança

UseDD define portas antes da implementação. Não define se portas são projetadas para acomodar evolução (novos casos, novos consumidores) ou apenas o caso atual.

#### L.u5 — Verificabilidade

UseDD L2.4 diz "a spec é o critério de correção". Não diz como a conformidade é verificada mecanicamente. Uma arquitetura pode satisfazer UseDD e ter entidades que só são verificáveis pelo sistema inteiro integrado — nenhuma verificação em isolado possível.

#### L.u6 — Contenção de efeitos colaterais

UseDD separa decisor (sem DOM) de executor (com DOM). Mas dentro do lado executor, efeitos colaterais (timers, network, animações) podem estar misturados com lógica de tradução sem que UseDD diga nada. "Tocar na DOM é execução" — mas nem toda execução tem a mesma natureza ou razão de mudança.

#### L.u7 — Fluxo de informação entre entidades do mesmo nível

UseDD constrange a relação vertical (decisor→executor). É silencioso sobre se entidades do mesmo nível — dois executores, por exemplo — podem trocar informação entre si, criar dependências mútuas, ou compartilhar estado.

#### L.u8 — Granularidade de fronteiras

UseDD diz "entidades". Não diz onde traçar a fronteira entre uma entidade e outra quando múltiplas responsabilidades do mesmo nível coexistem. Dois executores com razões de mudança diferentes podem ser a mesma entidade sob UseDD.

#### L.u9 — Complexidade da cadeia

UseDD L2.6 diz "cadeia finita e acíclica". Não constrange o comprimento. Uma cadeia de cinco elos intermediários entre o humano e a DOM satisfaz UseDD mas pode ser desnecessariamente complexa.

#### L.u10 — Instruções completas vs. consultas

UseDD diz que o decisor define a porta e o executor implementa. Não diz se o executor recebe instruções completas (tudo que precisa para agir) ou se consulta o decisor para obter mais informação durante a execução. Ambos satisfazem UseDD, mas têm propriedades de acoplamento radicalmente diferentes.

---

## P — Princípios escolhidos

> Cada nó é um princípio de engenharia escolhido para constringir liberdades identificadas. A escolha entre princípios é uma decisão — alternativas existem, e o racional explica por que este princípio e não outro.

---

### P1 — Fonte de verdade única (Single Source of Truth — SSOT)

**Decisão:** Cada fato do sistema tem exatamente uma entidade que o detém de forma canônica. Todas as outras entidades que precisam desse fato o obtêm — direta ou indiretamente — dessa fonte.

**Constrange:** L.u1 (consistência de estado), L.u7 (fluxo horizontal — se cada fato tem uma fonte, entidades no mesmo nível não precisam sincronizar estado entre si).

**Alternativas:**
- Estado replicado com sincronização eventual: cada entidade mantém uma cópia e um mecanismo garante convergência.
- Estado implícito derivado de eventos: nenhuma entidade detém estado; cada uma reconstrói o que precisa a partir de um log de eventos.

**Racional:** Replicação com sincronização é solução de sistemas distribuídos — introduz complexidade (conflitos, convergência) que não se justifica dentro de um componente UI que roda em um único thread. Estado derivado de eventos (event sourcing) é poderoso mas muda a natureza do modelo mental — o desenvolvedor precisa pensar em termos de sequência de eventos, não de estado atual, o que aumenta o custo cognitivo sem benefício proporcional neste domínio.

SSOT é compatível com UseDD por um caminho diferente: UseDD diz "mudanças de estado são decisões do decisor". SSOT diz "cada fato tem uma fonte canônica". Se ambos são aplicados, o decisor é a fonte canônica do estado que ele governa — as duas restrições reforçam-se mutuamente sem contradição.

**Habilita / Constrange:**
- Constrange qualquer fato do sistema a ter uma e somente uma fonte canônica.
- Elimina a necessidade de sincronização entre entidades.
- Combinado com UseDD (mudança de estado é decisão do decisor), constrange estado mutável a viver na entidade decisora ou sob controle explícito dela.
- Não constrange se a fonte canônica é uma entidade dedicada a estado ou uma entidade que também faz outras coisas. *(liberdade remanescente)*

---

### P2 — Inversão de dependência (Dependency Inversion — DIP)

**Decisão:** Entidades dependem de abstrações (contratos, portas), nunca de implementações concretas de outras entidades.

**Constrange:** L.u2 (direção de dependência), L.u5 (verificabilidade — se a dependência é uma abstração, um stub satisfaz o contrato para fins de teste).

**Alternativas:**
- Dependência direta de implementações concretas, com testes de integração como mecanismo de verificação.
- Dependência direta com injeção de dependência para testes (mecanismo de DI sem inversão conceitual — os módulos ainda "sabem" do tipo concreto, apenas recebem a instância de fora).

**Racional:** Dependência direta de implementações amarra entidades ao mecanismo interno de outra entidade. Quando a implementação muda, o dependente quebra — mesmo que o comportamento externo não tenha mudado. DI sem inversão atenua o problema no teste mas não no design: o módulo que conhece o tipo concreto depende de toda a superfície da implementação, não apenas do contrato.

UseDD já define portas entre decisor e executor. DIP estende essa ideia: a porta não é apenas a interface entre decisor e executor — é a *única coisa* que o executor conhece do decisor. O executor depende da porta, não da entidade que a implementa. UseDD já fazia isso da perspectiva de autoridade; DIP faz da perspectiva de dependência de código: o executor também não conhece a implementação do decisor, e o decisor não conhece a implementação do executor.

**Habilita / Constrange:**
- Constrange toda dependência entre entidades a passar por uma abstração.
- Habilita substituição: qualquer implementação que satisfaz a abstração é válida — para testes (stubs), para evolução (nova implementação), ou para composição (múltiplos consumidores do mesmo contrato).
- Habilita verificação em isolado: cada entidade pode ser testada contra stubs que satisfazem os contratos de que ela depende.
- Não constrange a forma da abstração (interface, tipo, protocolo, contrato implícito). *(liberdade remanescente)*
- Não constrange quem define a abstração — UseDD já respondeu: o decisor define a porta. DIP apenas reforça que a porta é a *única* dependência.

---

### P3 — Responsabilidade única (Single Responsibility Principle — SRP)

**Decisão:** Cada entidade tem uma e somente uma razão de mudança. Se uma entidade muda por dois motivos independentes, ela é candidata a separação.

**Constrange:** L.u8 (granularidade de fronteiras), L.u6 (contenção de efeitos — efeitos colaterais de naturezas diferentes são razões de mudança diferentes), G5 (coleta de eventos vs escrita na DOM — se mudam por razões diferentes, são entidades diferentes).

**Alternativas:**
- Separação por conveniência: entidades são divididas quando ficam grandes demais, não por critério de responsabilidade.
- Separação por UseDD apenas: decisor e executor são separados, mas dentro de cada nível a organização é livre.

**Racional:** UseDD separa por *nível de responsabilidade* (decisor/executor). SRP separa por *razão de mudança* — uma dimensão ortogonal. Dois executores podem mudar por razões independentes: um muda quando o padrão de interação muda (teclado vs mouse), outro muda quando a API do framework muda (Svelte 5 vs 6). Sem SRP, ambos viveriam na mesma entidade executora. SRP os separa — não porque UseDD o exige, mas porque a mudança em um não deveria forçar recompilação, reteste, ou risco de regressão no outro.

A separação por conveniência (tamanho) é heurística fraca — um arquivo de 500 linhas com uma razão de mudança é mais coeso que dois de 50 com razões misturadas.

**Habilita / Constrange:**
- Constrange cada entidade a ter exatamente uma razão de mudança.
- Combinado com UseDD, produz separação em duas dimensões: nível (decisor/executor) × razão de mudança. Uma entidade é definida pela interseção: "executor que muda quando a interação muda" é diferente de "executor que muda quando a API do framework muda".
- Parcialmente constrange G1, G2, G5: se template e script mudam por razões diferentes, são entidades diferentes (G1); se executores têm razões de mudança distintas, são entidades separadas (G2, G5).
- Não constrange a materialização da separação — se entidades separadas logicamente vivem em arquivos separados, seções de um arquivo, ou módulos de um pacote. *(liberdade remanescente — pertence a convenções)*

---

### P4 — Coesão: cada domínio de decisão tem um responsável completo

**Decisão:** Decisões que pertencem ao mesmo domínio vivem juntas, em uma única entidade. Uma decisão de domínio não pode estar parcialmente em uma entidade e parcialmente em outra.

**Constrange:** L.u3 (coesão interna), G7 parcialmente (se apresentação é um domínio de decisão, todas as decisões de apresentação vivem em uma entidade — o script não decide "metade" e outra entidade "a outra metade").

**Alternativas:**
- Decisões espalhadas com coordenação: múltiplas entidades contribuem decisões ao mesmo domínio, e uma coordenadora resolve conflitos.
- Decisões espalhadas sem coordenação: cada entidade decide sua parte, e a consistência emerge (ou não) da composição.

**Racional:** Se duas entidades decidem sobre o mesmo domínio, a pergunta "quem decide X?" não tem resposta única — mesmo que em cada *par* a autoridade seja clara (como UseDD exige). O risco concreto é *shotgun surgery*: mudar uma regra do domínio exige modificar múltiplas entidades. Isso não viola UseDD (cada par ainda tem um decisor), mas produz código frágil.

Coordenação explícita é possível mas transfere o problema: a coordenadora agora é o decisor real, e as "decisoras" originais são executoras parciais disfarçadas. Se isso é o caso, a coesão indica que a coordenadora deveria absorver a decisão — não delegá-la em pedaços.

**Habilita / Constrange:**
- Constrange cada domínio de decisão a ter um e somente um responsável.
- Combinado com SRP (P3): uma entidade tem uma razão de mudança, e essa razão de mudança corresponde a um domínio completo. A entidade não decide "metade" de um domínio.
- Torna diagnóstico de violação: se mudar uma regra de negócio exige alterar mais de uma entidade decisora, a coesão foi violada.
- Não constrange quantos domínios existem ou como defini-los. *(liberdade remanescente — a definição de fronteiras entre domínios é escolha de design)*

---

### P5 — Abertura para extensão, fechamento para modificação (Open/Closed — OCP)

**Decisão:** Portas são projetadas para acomodar variação previsível sem exigir modificação da entidade que as define.

**Constrange:** L.u4 (tolerância a mudança), G4 parcialmente (se as portas são extensíveis, a estrutura interna pode evoluir sem mudar a interface com os humanos).

**Alternativas:**
- YAGNI estrito: portas são projetadas apenas para o caso atual. Quando um novo caso surge, a porta é modificada.
- Genericidade total: portas são projetadas para máxima flexibilidade, independentemente de previsibilidade.

**Racional:** YAGNI estrito minimiza trabalho inicial mas maximiza custo de mudança: cada novo caso exige modificar a porta, o que propaga mudanças para todos os consumidores. Genericidade total minimiza mudança futura mas maximiza trabalho inicial e complexidade para o caso atual — e frequentemente erra o alvo, porque genericidade sem informação de domínio é adivinhação.

A heurística deste princípio não é nem "nunca generalize" nem "sempre generalize" — é **"generalize quando o conhecimento do domínio torna a variação futura previsível com confiança razoável"**. Essa confiança vem do domínio, não de especulação técnica. Se o domínio de animações UI tem historicamente uma variedade de padrões (bounce, shake, fade, pulse...), é previsível com confiança que um consumidor precisará de um padrão que não existe hoje. A porta deve acomodar isso desde a v1. Se não há evidência de domínio para prever variação, não se generaliza.

**Habilita / Constrange:**
- Constrange portas a serem extensíveis quando o domínio fornece evidência de variação futura.
- Constrange o mecanismo de extensão a ser por composição (nova implementação que satisfaz o contrato), não por modificação da porta existente.
- Habilita evolução sem breaking changes — novos consumidores compõem, consumidores existentes não quebram.
- Não constrange a forma do contrato extensível (genéricos, protocolos, interfaces, tipo union). *(liberdade remanescente)*
- O critério de "confiança razoável" baseado em conhecimento de domínio é heurístico — não tem formulação formal. *(liberdade remanescente — requer julgamento do arquiteto)*

---

### P6 — Instrução completa (Tell, Don't Ask)

**Decisão:** O decisor fornece ao executor toda a informação necessária para agir. O executor não consulta o decisor (nem qualquer outra entidade) durante a execução para obter informação adicional.

**Constrange:** L.u10 (instruções completas vs consultas), L.u7 (fluxo horizontal — se o executor recebe instruções completas, não precisa consultar peers).

**Alternativas:**
- Ask: o executor recebe uma referência ao decisor e consulta o que precisa quando precisa.
- Híbrido: instruções parciais com callback para obter mais.

**Racional:** Se o executor consulta o decisor durante a execução, o executor *decide quando* e *decide o quê* consultar. Essas micro-decisões contaminam o executor com conhecimento sobre a estrutura do decisor — ele precisa saber que o decisor tem determinadas propriedades para poder consultá-las. Isso cria acoplamento estrutural: mudanças na organização interna do decisor quebram o executor.

UseDD diz "a porta é definida pelo decisor". Se o executor consulta o decisor por fora da porta, a porta deixa de ser o contrato completo — é uma fachada parcial, e a dependência real é a estrutura interna do decisor. Tell Don't Ask garante que a porta é o contrato *completo*: tudo que o executor precisa está na instrução. O executor é *estruturalmente incapaz* de saber mais do que a instrução contém.

**Habilita / Constrange:**
- Constrange o executor a operar apenas com a informação recebida na instrução.
- Elimina acoplamento do executor à estrutura interna do decisor.
- Combinado com DIP (P2): o executor depende da abstração (porta) e recebe instruções completas via essa porta. Não conhece a implementação do decisor nem consulta nada fora da porta.
- Combinado com SSOT (P1): se o executor não consulta estado de lugar nenhum, não há risco de consultar uma fonte não-canônica.
- Não constrange o formato da instrução (objeto, tupla, tipo enumerado, dados serializados). *(liberdade remanescente)*

---

### P7 — Simplicidade estrutural (princípio da menor cadeia suficiente)

**Decisão:** O número de entidades e elos na cadeia de autoridade é o mínimo necessário para satisfazer todas as restrições acima. Entidades e elos que não servem a uma restrição específica não são adicionados.

**Constrange:** L.u9 (complexidade da cadeia), G2 parcialmente (o número de entidades é determinado pelas restrições, não por antecipação).

**Alternativas:**
- Adicionar entidades preventivamente: criar camadas de abstração "para o caso de" precisar.
- Deixar a cadeia crescer organicamente: adicionar entidades conforme surgem necessidades, sem avaliar se a adição é necessária.

**Racional:** Cada entidade na cadeia é uma junção que precisa ser mantida, testada, e compreendida. Uma cadeia com cinco elos onde três são necessários tem dois elos de overhead — não violam nenhuma restrição, mas cada um aumenta o custo de manutenção e a distância entre o humano e a DOM.

O princípio não é minimização agressiva — é *suficiência*. Se SRP (P3) exige duas entidades executoras porque têm razões de mudança diferentes, ambas são necessárias. Se uma terceira executora existe "para simetria" ou "para o caso de", ela viola este princípio.

**Habilita / Constrange:**
- Constrange a criação de entidades a ser justificável por uma restrição (de UseDD, domínio, ou engenharia).
- Constrange a cadeia de autoridade ao mínimo de elos que satisfaz todas as restrições.
- Previne *astronaut architecture* — complexidade que não serve a nenhuma restrição identificada.
- Não constrange se a contagem mínima é calculada antecipadamente (design up-front) ou descoberta iterativamente (refatoração). *(liberdade remanescente)*

---

## C — Consequências da combinação dos princípios

> As restrições abaixo não são princípios adicionais — são propriedades que emergem da aplicação simultânea dos princípios acima combinados com UseDD e as restrições de domínio. São verificáveis e servem como diagnóstico: se uma propriedade não é satisfeita, pelo menos um princípio foi violado.

---

### C1 — Módulos testáveis em isolado (por construção)

**Origem:** P2 (DIP) + P6 (Tell Don't Ask)

**Propriedade:** Cada entidade depende apenas de abstrações (P2) e recebe instruções completas (P6). Portanto, qualquer entidade pode ser testada substituindo suas dependências por stubs que satisfazem as abstrações. Não é necessário integrar para testar.

**Diagnóstico:** Se uma entidade só pode ser testada com o sistema integrado, ela depende de implementação concreta (viola P2) ou consulta outra entidade durante execução (viola P6).

---

### C2 — Módulos independentes entre peers (por construção)

**Origem:** P1 (SSOT) + P2 (DIP) + P6 (Tell Don't Ask)

**Propriedade:** Entidades no mesmo nível (ex: dois executores do mesmo decisor) não compartilham estado (P1 — fonte única sob o decisor), não dependem de implementações concretas uma da outra (P2), e não se consultam (P6 — recebem instruções completas do decisor). Portanto, são *estruturalmente incapazes* de ter acoplamento acidental entre si — não por disciplina, mas por construção.

**Diagnóstico:** Se um executor precisa mudar quando outro executor muda, ou se compartilham estado mutável, uma das restrições acima foi violada.

---

### C3 — Mudanças localizadas

**Origem:** P3 (SRP) + P4 (Coesão) + P5 (OCP)

**Propriedade:** Cada razão de mudança vive em uma entidade (P3), cada domínio de decisão é completo em uma entidade (P4), e portas acomodam variação previsível (P5). Portanto, uma mudança de requisito afeta — na maioria dos casos — uma única entidade. O restante do sistema permanece inalterado.

**Diagnóstico:** Se mudar um requisito exige alterar múltiplas entidades, ou SRP foi violado (razão de mudança em mais de uma entidade), ou coesão foi violada (domínio espalhado), ou OCP foi violado (porta que não acomoda a variação).

---

### C4 — Tradutores justificáveis

**Origem:** P7 (simplicidade) + P3 (SRP) + P4 (coesão) + UseDD L2.3 (vocabulário da porta determinado pelo decisor)

**Pressuposto:** A análise abaixo pressupõe que a porta do decisor está corretamente orientada — definida na linguagem do decisor, não na do executor (UseDD L2.3). Inversão de porta é um problema anterior e independente: uma porta definida na linguagem do executor pode manifestar-se *com* um intermediário desnecessário (que compensa a distância de vocabulário) ou *sem* nenhum intermediário (o decisor fala diretamente a linguagem do executor, eliminando a tradução que uma porta corretamente orientada teria demandado). Se a porta está invertida, o diagnóstico correto é corrigir a porta — não avaliar a legitimidade do intermediário.

**Propriedade:** P7 exige que toda entidade na cadeia seja justificada por uma restrição. Dado que a porta está corretamente orientada (pressuposto acima), um intermediário entre decisor e executor só é justificado em dois casos:

**(a) Lacuna de vocabulário inevitável.** O executor não pode consumir a porta do decisor diretamente porque existe uma distância entre o vocabulário do decisor e o que o executor é capaz de processar. Essa distância pode ter duas origens:

- **Limitação externa:** O executor é uma entidade fora do poder do arquiteto. Exemplo: o browser emite eventos em coordenadas de pixel; o decisor define sua porta em intenções de domínio ("iniciar arrasto", "mover para posição"). O browser não pode ser reescrito para falar a língua do decisor. Da mesma forma, um mecanismo de template puramente declarativo pode ser incapaz de expressar lógica imperativa que a porta do decisor exige.

- **Consequência dos próprios princípios:** Ambos os lados estão sob o poder do arquiteto, mas os princípios criam a lacuna. O decisor define a porta na sua linguagem (UseDD L2.3) e não sabe da existência do executor (P2 — depende de abstrações, não de implementações concretas). O executor opera em vocabulário de execução (DOM, apresentação). Nenhum dos dois *deveria* acomodar o vocabulário do outro — o decisor porque perderia a orientação da porta, o executor porque absorveria decisões de domínio. A lacuna é legítima: é produzida pela aplicação correta dos princípios, não por acidente de design.

Em ambos os sub-casos, a tradução é trabalho que não pode ser eliminado sem violar uma restrição.

**(b) Domínio de decisão próprio.** O intermediário não apenas reformata — adiciona regras que a entidade decisora original não forneceu (ex: regras de apresentação que transformam estado de domínio em instruções visuais). Nesse caso, a entidade não é de fato um tradutor — é um decisor de um domínio distinto, que ocupa o papel de decisor no par com o executor final e de executor no par com o decisor original. P3 justifica sua existência (razão de mudança própria), e P4 constrange que esse domínio de decisão seja completo nela — não parcialmente aqui e parcialmente na entidade decisora original.

**O caso ilegítimo:** Se nem (a) nem (b) se aplicam — não há lacuna de vocabulário inevitável e o intermediário não adiciona decisões próprias — o intermediário não tem justificativa (viola P7).

**Diagnóstico:** Para cada intermediário na cadeia, duas perguntas: (1) Existe lacuna de vocabulário inevitável entre a porta do decisor e o que o executor pode processar — seja por limitação externa, seja por consequência dos princípios? Se sim → caso (a), legítimo. (2) O intermediário adiciona decisões com razão de mudança própria e domínio completo? Se sim → caso (b), legítimo — mas a entidade é um decisor, não um tradutor. Se ambas são "não" → o intermediário viola P7 e deve ser removido.

---

### C5 — Estado mutável concentrado no decisor

**Origem:** P1 (SSOT) + UseDD (mudança de estado é decisão)

**Propriedade:** SSOT exige fonte canônica por fato. UseDD exige que mudanças de estado sejam decisões do decisor. Juntos, constrangem estado mutável a residir na entidade decisora ou sob controle explícito dela. Executores não detêm estado próprio além do necessário para a mecânica da execução (ex: referência a um elemento DOM que o executor manipula).

**Diagnóstico:** Se um executor mantém estado que influencia o comportamento do sistema (não apenas a mecânica da execução), SSOT ou a separação decisão/execução foi violada.

---

## G — Graus de liberdade remanescentes

> Escolhas que esta camada não faz. Uma camada posterior (convenções, arquitetura) precisa resolvê-las, mas os princípios acima não determinam a resposta.

---

### G.e1 — Materialização das fronteiras

**Origem:** P3 constrange *o que* separar (razão de mudança), não *como* materializar a separação.

**Grau de liberdade:** Entidades logicamente separadas vivem em arquivos separados, seções nomeadas de um arquivo, módulos de um pacote, ou outra organização física?

---

### G.e2 — Forma das abstrações

**Origem:** P2 constrange que dependências passem por abstrações, não qual forma a abstração toma.

**Grau de liberdade:** A abstração é uma interface formal (TypeScript interface), um tipo estrutural, um protocolo, um contrato implícito por convenção?

---

### G.e3 — Formato das instruções

**Origem:** P6 constrange que instruções sejam completas, não como são estruturadas.

**Grau de liberdade:** A instrução é um objeto tipado, uma enumeração, dados serializados, parâmetros posicionais?

---

### G.e4 — Nomenclatura das entidades

Nenhum princípio constrange como entidades são nomeadas. "Model", "View", "Controller", "Coordinator", "Interaction", "Handler" — são rótulos que pertencem a convenções.

---

### G.e5 — Mecanismo de comunicação

**Origem:** Nenhum princípio desta camada constrange o mecanismo pelo qual decisor e executor se comunicam (G6 herdado). Reatividade, chamadas imperativas, ou combinação dos dois — todos são compatíveis com os princípios escolhidos, desde que a direção de autoridade esteja correta (UseDD) e as instruções sejam completas (P6).

---

### G.e6 — Resolução específica dos Gs herdados

Os princípios desta camada *restringem* G1–G7 mas não os resolvem completamente:

- **G1 (template e script):** SRP (P3) parcialmente constrange — se têm razões de mudança diferentes, são entidades diferentes. Mas se têm a mesma razão de mudança, a escolha permanece aberta.
- **G2 (quantas entidades):** P7 constrange ao mínimo necessário. O número exato depende de quantas razões de mudança distintas existem no sistema concreto.
- **G3 (estado co-localizado):** SSOT (P1) + UseDD constrangem estado a ter fonte canônica sob controle do decisor. Se estado *vive na mesma entidade* que a lógica de decisão ou em entidade dedicada, permanece aberto.
- **G4 (portas servidas por mesma entidade):** Depende de quantos domínios de decisão existem (P4). Se as duas portas — UX e DX — correspondem a domínios de decisão diferentes, são entidades diferentes. Se ao mesmo domínio, podem ser a mesma.
- **G5 (coleta de eventos vs escrita):** SRP (P3) constrange: se mudam por razões diferentes, entidades diferentes. Caso contrário, aberto.
- **G6 (mecanismo de comunicação):** Nenhum princípio constrange o mecanismo. *(→ G.e5)*
- **G7 (script como decisor/tradutor):** P4 (coesão) constrange: se o script adiciona decisões de apresentação, ele é decisor de um domínio — e esse domínio deve ser completo nele (P4). Se é puro tradutor, é executor. A escolha de qual caminho seguir permanece aberta.

---

### G.e7 — Critério de confiança para generalização

**Origem:** P5 constrange que portas sejam extensíveis quando o domínio fornece evidência. O *quanto* de evidência é "suficiente" é julgamento do arquiteto, não regra formal.

---

### G.e8 — Processo de verificação

P2 e P6 habilitam testes em isolado (C1). Mas *como* testar — automatizado vs manual, granularidade dos testes, ferramentas, o que constitui cobertura suficiente — não é constrangido pelos princípios desta camada.

---

### G.e9 — Vocabulário das portas internas

UseDD diz "a porta é definida pelo decisor na linguagem do decisor". Os princípios de engenharia não acrescentam restrição sobre qual *tipo* de linguagem o decisor usa para suas portas internas. O decisor pode usar vocabulário de negócio, vocabulário de apresentação, ou vocabulário misto. A escolha de separar vocabulários (negócio para o decisor, apresentação para o executor) é uma decisão de design que os princípios habilitam mas não exigem.
