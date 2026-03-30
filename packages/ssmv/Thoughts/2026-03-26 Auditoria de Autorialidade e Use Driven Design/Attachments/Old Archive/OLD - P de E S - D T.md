# Princípios de Engenharia Aplicados (Svelte) — Design Tree

> Nível 3 na sequência UseDD → Restrições de Domínio → **Princípios de Engenharia** → Convenções e Arquitetura.
>
> UseDD constrange a direção de autoridade. As restrições de domínio (nível 2) constrangem o que está além do poder no browser e derivam o mínimo que qualquer arquitetura neste domínio deve satisfazer. Mas esses dois níveis juntos deixam liberdade demais — é possível escrever código ruim, frágil, acoplado e difícil de manter que ainda respeita UseDD e satisfaz o domínio. Esta árvore escolhe quais princípios de engenharia de software aplicar para eliminar essa fragilidade.
>
> Os princípios não são inventados — são formulações existentes e reconhecidas. O que esta árvore faz é escolhê-los, justificar por que são necessários neste contexto, e registrar como cada um constrange o espaço de design.
>
> **Entradas:** Design Tree de Restrições de Domínio (nível 2) — seus nós D, G, e as análises das seções 9–12 da conversa que a acompanha.

---

## Princípios escolhidos

| Sigla | Princípio | Formulação canônica |
|---|---|---|
| SoC | Separation of Concerns | Cada módulo trata de um assunto; assuntos diferentes vivem em módulos diferentes |
| SRP | Single Responsibility Principle | Uma entidade tem uma — e apenas uma — razão de mudança |
| DIP | Dependency Inversion Principle | Módulos de alto nível não dependem de módulos de baixo nível; ambos dependem de abstrações |
| SSOT | Single Source of Truth | Cada fato tem uma — e apenas uma — fonte canônica |
| OCP | Open/Closed Principle | Aberto para extensão, fechado para modificação |
| TDA | Tell Don't Ask | O emissor envia a ordem completa; o receptor não consulta estado para decidir o que fazer |
| Coesão | Alta Coesão | Dados e comportamento sobre os mesmos dados pertencem à mesma entidade |

---

## E1 — Negócio e apresentação são preocupações distintas

**Problema que resolve:** UseDD separa decisão de execução, mas não diz quantos *domínios de decisão* existem. O nível 2 identifica que o script pode ser decisor, tradutor, ou ambos (G7), e que template e script podem ser a mesma entidade ou duas (G1). Sem constrangimento adicional, alguém pode colocar regras de negócio e regras de apresentação na mesma entidade — e se uma mudança visual exigir mudança na lógica de domínio, o sistema é frágil.

**Princípio:** Separation of Concerns (SoC)

**Decisão:** Regras de negócio (estado, transições, significado de eventos) e regras de apresentação (como estado se torna visual) são preocupações distintas com razões de mudança diferentes. A entidade que decide regras de negócio fala vocabulário de negócio. A entidade que decide apresentação fala vocabulário de apresentação.

**Alternativas rejeitadas:**
- Vocabulário único: a entidade decisora de negócio fornece saída já em linguagem de apresentação (`cssClass: "active"` em vez de `isActive: true`). Rejeitada porque acopla decisão de domínio ao mecanismo de renderização — uma mudança visual exige mudança na entidade de domínio.
- Sem separação: a mesma entidade decide negócio e apresentação. Rejeitada porque duas razões de mudança na mesma entidade — o domínio de negócio e o design visual — produzem fragilidade.

**Racional:** Se a entidade que decide regras de negócio também fala linguagem visual, trocar um framework CSS ou mudar abordagem de estilização propaga mudança para dentro das regras de domínio. A separação de vocabulários isola: regras de negócio mudam quando o domínio muda; regras de apresentação mudam quando o design muda.

**Consequência:**
- Existe uma lacuna de vocabulário entre a entidade decisora de negócio e o mecanismo de apresentação.
- Essa lacuna demanda tradução — alguém transforma `isActive` em instrução visual.
- A entidade que faz essa tradução *adiciona informação* (a regra de mapeamento). Pelo critério de UseDD, ela é decisora nessa relação — decisora de apresentação.
- Isso informa G7 e G1 do nível 2: o script, ao traduzir estado de domínio em linguagem visual, é decisor de apresentação;  script e template estão em níveis diferentes (decisor e executor), não em nível paralelo.

---

## E2 — Estado e decisões sobre ele pertencem à mesma entidade

**Problema que resolve:** UseDD separa decisão de execução e o nível 2 nota que estado é informação, não responsabilidade (D2.2) — co-localizar estado e lógica de transição ou separá-los é livre (G3). Sem constrangimento, estado pode ficar em uma entidade passiva e lógica de transição em outra. Isso dificulta responder "quem é responsável por este estado?" e pode permitir que múltiplas entidades alterem o mesmo estado com regras conflitantes.

**Princípio:** SSOT + Alta Coesão

**Decisão:** A entidade que define *quando* e *para qual valor* o estado muda é a mesma que o detém. Estado e lógica de transição são co-localizados.

**Alternativas rejeitadas:**
- Store passivo + lógica externa: uma entidade armazena, outra consulta e decide transições. Rejeitada porque a pergunta "quem é responsável por este estado?" passa a ter duas respostas — viola SSOT. Qualquer mudança na estrutura do estado exige mudança em ambas as entidades — viola Coesão.

**Racional:** Co-localizar elimina a ambiguidade: a entidade que detém o estado *é* a que decide como ele muda. Ler estado é livre; alterar estado requer autorização dessa entidade. Isso reforça UseDD por um caminho diferente: se mudar estado é decidir uma transição (seção 10.1 da conversa), então acesso de escrita ao estado é poder de decisão — e entidades executoras, por definição, não decidem.

**Consequência:**
- A entidade decisora de domínio detém estado e define transições.
- Nenhuma outra entidade tem acesso de escrita ao estado.
- Leitura é livre — entidades executoras precisam ler estado para executar suas ordens.

---

## E3 — Cada razão de mudança distinta produz uma entidade separada

**Problema que resolve:** UseDD exige pelo menos uma entidade decisora e uma executora (D2.1). O nível 2 deixa livre quantas entidades ficam de cada lado (G2) e se coleta de eventos e escrita na DOM são a mesma entidade (G5). Sem constrangimento, é possível ter um único executor que coleta eventos, manipula DOM, e coordena animações. Quando uma dessas responsabilidades muda, a entidade inteira precisa ser compreendida e testada de novo.

**Princípio:** SRP

**Decisão:** Dentro do mesmo nível de responsabilidade (decisor ou executor), cada razão de mudança distinta produz uma entidade separada.

**Alternativas rejeitadas:**
- Executor monolítico: uma entidade executora faz tudo que toca na DOM. Rejeitada porque razões de mudança distintas (padrão de interação muda vs. API do browser evolui vs. design de animação muda) se entrelaçam — uma mudança em uma preocupação risca todas.
- Separação apenas conceitual: uma entidade com separação interna por convenção (seções, comentários). Rejeitada porque depende de disciplina e tende a erodir.

**Racional:** No lado executor, existem pelo menos três razões de mudança identificáveis no domínio: coleta e normalização de eventos (muda quando o padrão de interação muda), coordenação entre estado e DOM (muda quando a API do browser ou framework evolui), e decisão de apresentação (muda quando o design muda — já separada por E1). SRP diz: se mudam por razões diferentes, são entidades diferentes.

**Consequência:**
- O lado executor tem múltiplas entidades, cada uma com uma razão de mudança.
- Coleta de eventos e coordenação de DOM são entidades separadas.
- O princípio diz *que* a separação existe. *Como* ela se materializa (arquivo, módulo, namespace) é decisão posterior.

---

## E4 — Entidades dependem de contratos, não de implementações concretas

**Problema que resolve:** UseDD define quem declara a porta. O nível 2 não constrange se entidades se conhecem (G10) nem se cada entidade pode ser verificada isoladamente (G8 — seção 7 da conversa). Sem constrangimento, uma entidade executora pode importar e depender diretamente de outra executora — e uma mudança em uma quebra a outra.

**Princípio:** DIP

**Decisão:** Cada entidade depende do contrato (porta) declarado pela entidade decisora. Nenhuma entidade depende de outra entidade concreta. Um stub que satisfaz o contrato é suficiente para verificar qualquer entidade em isolamento.

**Alternativas rejeitadas:**
- Dependência direta: uma entidade executora importa outra e chama métodos nela. Rejeitada porque cria acoplamento concreto — mudança interna em uma propaga quebra para a outra.
- Sem isolamento: verificação apenas com todas as entidades juntas. Rejeitada como estratégia principal porque não isola a origem de falhas.

**Racional:** DIP classicamente isola domínio de infraestrutura (escala de sistema). Aqui a aplicação é mais granular: isola entidades *internas* de um componente UI. A mecânica é a mesma (depender da abstração), mas a escala é diferente. Ports and Adapters (Cockburn 2005) é a formulação mais próxima, mas foi concebida para fronteiras de sistema, não de módulos internos.

**Consequência:**
- Cada entidade executora conhece apenas a porta definida pelo decisor — não conhece outras executoras. Independência entre entidades no mesmo nível é consequência, não regra adicional.
- Qualquer entidade pode ser verificada com um stub que satisfaz a porta.
- A independência é *estrutural*, não disciplinar — entidades são incapazes de acoplamento acidental porque o contrato é a única dependência visível.

---

## E5 — Decisões do mesmo domínio pertencem à mesma entidade

**Problema que resolve:** E1 separa vocabulários e cria a lacuna que demanda um decisor de apresentação. Mas essa separação abre um risco (seção 10.2 da conversa): que a tradução entre vocabulários *adicione* decisões do mesmo domínio a entidades diferentes. Se uma entidade decide `isActive` e outra decide `if isActive and isMobile then compact`, a regra completa ("quando ativo e mobile, compactar") está partida — nenhuma entidade a detém por completo.

**Princípio:** Alta Coesão + SoC (consequência de E1)

**Decisão:** Todas as decisões de um mesmo domínio pertencem à mesma entidade. Se negócio e apresentação são domínios separados (E1), então regras de negócio completas pertencem à entidade de negócio e regras de apresentação completas pertencem à entidade de apresentação. A tradução entre elas é mecânica, não decisória.

**Alternativas rejeitadas:**
- Decisões espalhadas: a entidade de domínio decide parte, a entidade de apresentação decide o resto com base em estado de domínio. Rejeitada porque produz *shotgun surgery* (Fowler) — uma mudança na regra exige alteração em duas entidades.

**Racional:** A lacuna de vocabulário de E1 é saudável quando a tradução é mecânica (mapeamento direto). Se torna problema quando a tradução adiciona lógica que combina estado de negócio com regras de apresentação sem que nenhuma entidade detenha a regra completa.

**Consequência:**
- A entidade de negócio expõe estado no vocabulário dela. A entidade de apresentação consome e aplica suas regras.
- Teste de fronteira: "se o design mudar e o negócio não, qual entidade precisa mudar?" Se a resposta inclui a entidade de negócio, há vazamento.
- A tradução entre vocabulários é mapeamento direto — se requer lógica combinatória, essa lógica é decisão de apresentação e pertence à entidade de apresentação.

---

## E6 — Executores recebem ordens completas

**Problema que resolve:** UseDD constrange a direção de autoridade (decisor → executor) mas não como a comunicação acontece (G6). Sem constrangimento, um executor pode interpreta estado para decidir o que fazer — o que inverte a autoridade de fato: o executor lê, interpreta, e decide como agir.

**Princípio:** Tell Don't Ask (TDA)

**Decisão:** O executor recebe a instrução completa do decisor. Não consulta estado extra para decidir o que executar — a decisão já está na ordem recebida.

**Alternativas rejeitadas:**
- Executor consulta estado: o executor combina estados e decide o que executar. Rejeitada porque inverte a direção de autoridade — o executor estaria decidindo com base em interpretação própria de estado lido.
- Ordens parciais com negociação: o decisor envia intenção parcial, o executor pede detalhes. Rejeitada porque cria protocolo bidirecional que dificulta rastrear a cadeia de autoridade.

**Racional:** TDA (Fowler) diz "diga ao objeto o que fazer, não pergunte seu estado para decidir por ele". A aplicação aqui vai além: o contrato do decisor carrega a instrução completa — tudo o que o executor precisa para agir sem consultar nada. Isso torna a incapacidade de consulta *estrutural*, não apenas disciplinar — o executor não consulta porque o contrato já é suficiente.

**Consequência:**
- A comunicação decisor→executor é unidirecional.
- O mecanismo (reatividade, chamada imperativa, ou combinação) é livre desde que entregue ordens completas. Constrange G6 parcialmente.
- Executores com razões de mudança diferentes recebem contratos diferentes — reforça E3.

---

## E7 — Estado mutável pertence exclusivamente à entidade decisora

**Problema que resolve:** UseDD é silencioso sobre relações horizontais (seção 9 da conversa). O nível 2 não constrange se executores compartilham estado ou se comunicam entre si. Sem constrangimento, dois executores podem compartilhar acesso de escrita ao mesmo estado — e "quem decide as transições?" perde resposta clara.

**Princípio:** SSOT (interseção com UseDD — seção 10.1 da conversa)

**Decisão:** O estado do componente tem uma fonte canônica — a entidade decisora. Nenhuma entidade executora detém estado mutável que influencie comportamento.

**Alternativas rejeitadas:**
- Estado local em executores: um executor mantém uma flag que outro consulta. Rejeitada porque cria estado disperso (SSOT violado) e dá ao executor poder de decisão implícito.
- Estado compartilhado entre executores: dois executores escrevem no mesmo dado. Rejeitada porque "quem decide as transições?" não tem resposta — ambiguidade de autoridade.

**Racional:** UseDD diz que mudar estado é decidir uma transição (seção 10.1). SSOT diz que cada fato tem uma fonte canônica. A interseção: estado mutável pertence à entidade que decide suas transições. Dar a um executor acesso de escrita é dar poder de decisão implícito. Esses dois princípios, vindos de tradições diferentes (autoridade de design e normalização de dados), convergem para a mesma regra.

**Consequência:**
- Executores podem ter estado de implementação efêmero (ex: um ID de requestAnimationFrame) mas não estado que influencie comportamento do componente.
- Comunicação horizontal entre executores via estado compartilhado é impossível — não há estado compartilhável fora do decisor.
- Se dois executores precisam coordenar-se, a coordenação passa pelo decisor: um notifica, o decisor decide, e instrui o outro.

---

## E8 — Portas genéricas quando o domínio torna a extensão previsível

**Problema que resolve:** UseDD diz que a porta é definida antes da implementação (L1.2) mas não diz quão genérica ela deve ser (G11 — seção 7 da conversa). Sem constrangimento, é válido tanto projetar portas estreitas (ajustadas ao primeiro consumidor) quanto genéricas (antecipando variações). A escolha entre as duas afeta profundamente o custo de evolução da API.

**Princípio:** OCP + heurística de domínio

**Decisão:** Portas são genéricas desde o início quando o domínio torna razoável prever a necessidade de extensão. A generalização não é especulativa — é informada por conhecimento do domínio.

**Alternativas rejeitadas:**
- YAGNI estrito: portas ajustadas ao primeiro consumidor; generalizar só quando demandado. Rejeitada porque em certos domínios a necessidade de variação é previsível com confiança alta, e uma porta estreita força refatoração da API pública — custo desproporcional.
- Generalização especulativa: portas genéricas para todo caso imaginável. Rejeitada porque generalização sem evidência é custo sem retorno.

**Racional:** OCP diz "aberto para extensão, fechado para modificação" mas não diz *quando* projetar para extensão. YAGNI diz "não agora". A heurística aqui é: "agora, se o domínio dá confiança razoável de que a extensão será necessária". O critério não é "consigo imaginar?" — é "o domínio torna provável?". O mecanismo de extensão é contrato tipado, não herança.

**Consequência:**
- Portas previsíveis pelo domínio são genéricas desde a v1.
- Portas sem evidência começam estreitas.
- O mecanismo é contrato tipado que qualquer implementação pode satisfazer.

**Autorialidade:** Moderada a alta. OCP cobre o mecanismo; YAGNI cobre a cautela. A heurística de *quando* generalizar — confiança baseada em conhecimento do domínio, nem antecipação cega nem espera passiva — não tem formulação precisa na literatura. Merece formulação própria.

---

## Resumo: o que esta árvore constrange

| Liberdade (entrada) | Constrangida por | Resultado |
|---|---|---|
| G7 — Papel do script | E1 (SoC) | Decisor de apresentação: adiciona regras de mapeamento visual |
| G1 — Template e script: mesma entidade? | E1 (SoC) | Entidades de níveis diferentes (decisor e executor) |
| G3 — Estado co-localizado com decisão? | E2 (SSOT + Coesão) | Co-localizado na entidade decisora |
| G2 — Quantas entidades de cada lado? | E3 (SRP) | Múltiplas, uma por razão de mudança |
| G5 — Coleta de eventos: mesma entidade? | E3 (SRP) | Separada — razão de mudança distinta |
| G8 — Testabilidade com stubs | E4 (DIP) | Entidades dependem de contratos, verificáveis com stubs |
| G10 — Independência entre siblings | E4 (DIP) | Consequência: dependem só da porta do decisor |
| Scattered logic (risco de E1) | E5 (Coesão) | Decisões do mesmo domínio na mesma entidade |
| G6 — Mecanismo de comunicação | E6 (TDA) — parcial | Qualquer mecanismo que entregue ordens completas |
| G12 — SRP dentro do mesmo nível | E3 + E6 | Razões de mudança distintas + ordens completas |
| Comunicação horizontal | E7 (SSOT × UseDD) | Estado mutável exclusivo do decisor; coordenação via decisor |
| G11 — Genericidade de portas | E8 (OCP + heurística) | Genéricas quando o domínio prevê extensão |

---

## Graus de liberdade restantes

> Escolhas que UseDD + Domínio + Princípios de Engenharia juntos não determinam. Demandam constrangimento posterior.

### G4' — Ambas as portas servidas pela mesma entidade decisora?

Nenhum princípio aplicado nesta árvore força que porta UX e porta DX apontem para a mesma entidade ou para entidades diferentes. SRP perguntaria "mudam por razões diferentes?" — mas a resposta é ambígua: a porta UX muda quando expectativas do usuário mudam; a porta DX muda quando necessidades do desenvolvedor mudam. Isso poderia justificar duas decisoras — ou uma, se a mesma entidade serve ambos com o mesmo estado.

### G6' — Mecanismo específico de comunicação

E6 constrange que a comunicação entrega ordens completas. Não constrange *qual* mecanismo: reatividade do framework, chamadas imperativas, ou combinação.

### G9' — Materialização da separação

E3 diz que a separação por razão de mudança existe. Não diz *como* ela se materializa — arquivo, módulo, namespace, seção de código.

### G1' — Quantos domínios de decisão existem?

E1 identifica negócio e apresentação como dois domínios. Pode haver mais — validação, acessibilidade, animação. Esta árvore não constrange quantos domínios de decisão existem nem se cada um tem sua própria entidade decisora ou se vários são servidos pela mesma. O princípio (SoC) diz que preocupações diferentes devem ser separadas — mas *quais* são as preocupações distintas em cada componente concreto é decisão de design.

### G13 — Grau de separação formal entre níveis dentro da mesma entidade

E1 e E3 dizem que decisão e execução são separadas e que razões de mudança distintas produzem entidades distintas. Mas se por alguma razão duas responsabilidades coabitam a mesma entidade (ex: o script que é decisor de apresentação e também manipula DOM imperativamente — D2.3), a separação *dentro* da entidade precisa ser formalizada de alguma forma. Os princípios dizem que a mistura silenciosa é violação — não dizem qual mecanismo de separação usar.

---

---

Na sequência UseDD → Restrições de Domínio → **Princípios de Engenharia** → Convenções e Arquitetura: Escreva agora em um novo arquivo a design tree de Princípios de Engenharia. Esclareço: não é um esforço de justificar a SSMV, é um esforço de descer as camadas de forma imparcial, indentificando quais liberdades sobram em cada uma e demandam constragimento na próxima. Cada árvore é um trabalho com coesão em si mesma, não com a próxima etapa. Uma árvore pode citar as etapas anteriores, nunca as seguintes. Essa etapa não deve saber da existência de SSMV, só sabe que UseDD deixa muita liberdade para fazer sitemas/código ruim que ainda respeitam seus princípios, logo outros princípios são necessários e ela escolhe quais são. Adendo: Não presuponha que a lista de graus de liberdade existente é exaustiva, ela foi feita para ser sobre aplicação nesse domínio específico e por tal, pode estar omitindo liberdades que são de preocupação geral/ampla/universais de engenharia de software.
