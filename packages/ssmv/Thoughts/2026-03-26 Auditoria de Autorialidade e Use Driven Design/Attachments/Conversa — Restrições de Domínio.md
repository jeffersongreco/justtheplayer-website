# Conversa: Restrições de Domínio — de UseDD a Componentes UI Reativos com Estado

**Contexto:** Camada intermediária entre o meta-princípio Use Driven Design e uma arquitetura concreta. O domínio é componentes UI reativos com estado no browser. Esta Design Tree parte do que está além do nosso poder e, aplicando UseDD, deriva as definições que qualquer arquitetura neste domínio deve satisfazer — sem prescrever uma arquitetura específica.

---

## 1. Mensagem do autor

O que vem imediatamente abaixo de UseDD não é ainda a SSMV. É a aplicação de UseDD ao domínio específico de componentes UI reativos com estado. Esse domínio poderia produzir arquiteturas diferentes da SSMV e ainda satisfazer UseDD. Em uma sequência princípio → restrições de domínio → arquitetura resultante, já definimos o princípio (UseDD). Esqueça que já existe a SSMV (arquitetura resultante) e escreva a Design Tree das restrições de domínio, que parte do que está além do poder e chega às definições (e.g., o browser está além do poder, alguma entidade terá que trabalhar na DOM, se quem executa não decide, uma manipulação de DOM pede duas entidades, etc.)

---

## 2. Primeira versão da Design Tree

*(Produzida e entregue — continha os nós F1–F3, D1.1–D1.3, D2.1–D2.4, D3.1.)*

---

## 3. Revisão do autor

- Em D2.1, UseDD realmente constrange estado e decisões a estarem na mesma entidade, ou o resultado foi enviesado?
- O nó D2.2 é mesmo necessário?
- O nó D2.3 não é redundante?
- Em D3.1, não fica claro se a cadeia descrita está dizendo que as duas portas são da mesma Entidade Decisora ou de uma Entidade para cada.
- Também não é citado nada sobre apresentação versus lógica ("HTML vs JS"). Ou se UseDD constrange que a entidade que toca na DOM e a entidade que coleta eventos na DOM sejam duas distintas, ou se pode ser a mesma.
- Podem haver outras omissões e vieses não identificados.

---

## 4. Análise dos pontos

**D2.1 — estado e decisões na mesma entidade: viés confirmado.** UseDD constrange decisão e execução a entidades separadas. Não constrange estado (informação) e lógica de decisão (transições) a co-localizarem. Um banco de dados armazena estado sem decidir; uma função pura decide sem armazenar. A derivação saltou de "decisões precisam de entidade sem DOM" para "estado = decisões" sem justificativa. Isso é a forma da SSMV (Model = estado + lógica) vazando para a árvore de restrições.

**D2.2 — redundante.** "Mínimo duas entidades" é consequência direta de D1.1 + D1.2: se DOM é execução e decisões precisam de outra entidade, o mínimo de duas já está dito. D2.2 não adiciona informação — é resumo, não derivação.

**D2.3 — redundante.** D1.3 já diz "duas portas externas, definidas antes da implementação". D2.3 reafirma com fraseado ligeiramente diferente.

**D3.1 — ambíguo.** A cadeia mostrava "Entidade decisora" no singular para ambas as portas, sugerindo que uma única entidade serve ambos os humanos. UseDD não constrange isso — é possível que as duas portas apontem para a mesma entidade decisora, ou para entidades diferentes, ou para um grafo mais complexo. A árvore deve registrar isso como grau de liberdade.

**Apresentação vs. lógica — omissão.** No domínio web existe uma divisão fundamental entre template/markup (declarativo, descreve estrutura DOM) e script (imperativo, manipula DOM e executa lógica). Ambos tocam na DOM — ambos são execução em termos de UseDD. A árvore não abordava se UseDD os força a ser entidades separadas ou permite que sejam a mesma. Da mesma forma, coleta de eventos e escrita na DOM são ambas execução — UseDD não força separação dentro do mesmo nível de responsabilidade, mas também não força unificação.

**Viés adicional identificado:** A árvore implicitamente assumia uma-decisora-uma-executora como estrutura "natural" — essa é a forma da SSMV, não uma restrição de UseDD. UseDD constrange o limite decisão/execução mas não quantas entidades ficam de cada lado.

---

## 5. Design Tree — Restrições de Domínio (corrigida)

> Aplicação de Use Driven Design ao domínio de componentes UI reativos com estado no browser. Cada nó parte de fatos do domínio ou de derivações anteriores e aplica UseDD para chegar a restrições que qualquer arquitetura neste domínio deve satisfazer.
>
> Termos conforme o glossário de UseDD: entidade, porta, decisor, executor, uso, usuário, cadeia de autoridade.

---

### F — Fatos: o que está além do nosso poder

#### F1 — O browser controla a DOM e o event loop

**Fato:** A DOM é a única interface entre o código e o que o humano vê. Eventos do browser são a única interface entre o que o humano faz e o código. Não podemos redesenhar nem contornar nenhum dos dois.

**Implicação:** Qualquer entidade que apresenta UI ao humano ou recebe interação do humano precisa, em algum momento, tocar na DOM.

---

#### F2 — Dois humanos distintos usam o componente

**Fato:** O usuário final usa o produto — vê, interage, forma expectativas sobre comportamento. O desenvolvedor usa a API do componente — importa, configura, compõe, forma expectativas sobre interface.

**Implicação:** São dois decisores com vocabulários e critérios de satisfação diferentes. UseDD L2.3 exige que cada porta seja expressa na linguagem em que seu decisor confirma satisfação.

---

#### F3 — O framework fornece reatividade como infraestrutura

**Fato:** O framework (Svelte, React, etc.) oferece um mecanismo de reatividade — signals, runes, observables — que propaga mudanças de estado para a DOM. Nós escolhemos o framework, mas não controlamos seus primitivos de reatividade.

**Implicação:** Reatividade é uma ferramenta disponível, não uma entidade com autoridade. Ela pode ser usada por entidades, mas não origina decisões.

---

#### F4 — No domínio web, apresentação e lógica usam mecanismos distintos

**Fato:** Template/markup (HTML, Svelte markup) declara estrutura DOM de forma declarativa. Script (JavaScript) manipula DOM e executa lógica de forma imperativa. São mecanismos diferentes — um descreve, o outro comanda — mas ambos tocam na DOM.

**Implicação:** Qualquer arquitetura neste domínio precisa decidir como distribuir trabalho entre esses dois mecanismos. O fato de ambos existirem não determina quantas entidades são necessárias — apenas que o domínio oferece dois caminhos de execução para a DOM.

---

### D1 — Derivações de primeiro nível

#### D1.1 — Trabalhar na DOM é execução

**Derivação:** Ler um atributo, escrever no DOM, adicionar um listener, aplicar um estilo — são atos de cumprir ordens. A entidade que faz isso está executando, não decidindo.

**Premissas:** F1 (DOM é a interface obrigatória) + UseDD L2.1 (quem executa não decide; quem decide não executa).

**Racional:** "Colocar X na tela" é uma instrução — alguém disse o quê, e a DOM recebe. A entidade que coloca não é a que decidiu o quê. Se ela decidisse, estaria misturando decisão e execução — UseDD L2.1 seria violado.

**Constrange:**
- Toda entidade que toca na DOM é, nessa relação, executora.
- A decisão sobre o que mostrar, quando mostrar, e como reagir a mudanças precisa viver em outra entidade. *(→ D2.1)*

---

#### D1.2 — Coletar interação é execução; interpretar interação é decisão

**Derivação:** Capturar um evento da DOM (click, keydown, pointermove) requer acesso à DOM — é execução. Determinar o que esse evento significa no domínio do componente ("o usuário quer mover o elemento", "o usuário quer disparar a animação") é decisão.

**Premissas:** F1 (eventos vêm do browser via DOM) + UseDD L2.1 + UseDD L2.7 (decisor único por par).

**Racional:** O evento bruto (MouseEvent em x=342, y=187) não carrega semântica de domínio. Transformá-lo em intenção ("mover para a posição relativa ao container") exige regras que pertencem ao decisor. Se a entidade que coleta o evento também o interpreta, ela mistura execução e decisão.

**Constrange:**
- A entidade que coleta eventos da DOM não é a que decide o que eles significam.
- A interpretação semântica pertence a uma entidade decisora. *(→ D2.1)*

---

#### D1.3 — O componente tem duas portas externas

**Derivação:** O componente precisa de uma porta UX (para o usuário final) e uma porta DX (para o desenvolvedor). As duas são definidas antes da implementação (UseDD L1.2), em vocabulários diferentes (UseDD L2.3).

**Premissas:** F2 (dois humanos) + UseDD L2.3 (vocabulário da porta determinado pelo decisor) + UseDD L1.2 (uso precede implementação).

**Racional:** O usuário final confirma satisfação percebendo comportamento — a porta UX precisa ser expressa em linguagem comportamental, verificável por percepção humana. O desenvolvedor confirma satisfação usando a API — a porta DX precisa ser expressa em linguagem técnica, verificável por código. Usar um único vocabulário para ambos forçaria um dos decisores a operar em linguagem que não é a sua.

**Constrange:**
- A porta UX é uma especificação comportamental em prosa.
- A porta DX é uma especificação de interface em linguagem técnica.
- Ambas precedem a implementação — são especificações, não documentações.
- A implementação está correta somente se satisfaz ambas as portas (UseDD L2.4). Divergência com qualquer uma é erro de implementação.

---

#### D1.4 — Script e template têm três relações possíveis, não uma

**Derivação:** F4 identifica dois mecanismos (template declarativo, script imperativo). Mas esses mecanismos não operam apenas em paralelo — em frameworks reativos, o padrão dominante é script fornecendo dados que o template consome para declarar estrutura DOM. Isso produz três relações distintas:

1. **Template → DOM:** O template declara estrutura DOM. Tocar na DOM é execução (D1.1). O template é executor da DOM.
2. **Script → DOM:** O script manipula a DOM imperativamente (ex: `el.classList.add(x)`, WAAPI). Tocar na DOM é execução (D1.1). O script é executor da DOM.
3. **Script → Template:** O script fornece dados (estado, valores computados) que o template consome para declarar estrutura DOM. Mas a natureza dessa relação depende de o script estar adicionando informação própria ou apenas traduzindo uma decisão de outra entidade. Se o script mapeia `isActive` para `class: "active"` (regra de apresentação que não estava na entidade decisora), ele está decidindo. Se a entidade decisora já disse `cssClass: "active"` e o script só repassa, ele é um tradutor — execução, não decisão. *(→ G7)*

**Premissas:** F4 (dois mecanismos no domínio web) + D1.1 (tocar na DOM é execução) + UseDD L1.1 (quem pensa, usa).

**Racional:** Tratar script e template como "ambos executores paralelos da DOM" cobre apenas as relações 1 e 2, ignorando a relação 3, que é a mais comum. Em `<div class={x}>`, o template não decidiu que a classe é `x` — alguma entidade decidiu, e o template traduziu essa decisão em DOM. A questão é se o script *é* essa entidade decisora ou se ele apenas repassa uma decisão vinda de outra entidade. Ambas as descrições — "o script observa estado e decide o que o template faz" e "o script só traduz a decisão em linguagem de template" — podem ser verdadeiras para o mesmo código, dependendo de se o script adicionou informação ou só reformatou.

**Constrange:**
- Decisões de domínio não pertencem ao template — o template traduz decisões em DOM independentemente de quem as tomou.
- O script pode ser decisor do template (se adiciona regras de apresentação), ou tradutor/executor (se apenas repassa decisões de outra entidade). Isso não é constrangido pelo domínio — é escolha arquitetural. *(→ G7)*
- O script também pode ser executor da DOM (quando a manipula diretamente), o que levanta a questão de papel duplo. *(→ D2.3)*
- UseDD não constrange se template e script são a mesma entidade ou entidades diferentes quando ambos são executores paralelos da DOM. *(→ G1)*

---

### D2 — Derivações de segundo nível

#### D2.1 — Decisões de domínio precisam de uma entidade sem acesso direto à DOM

**Derivação:** Se toda entidade que toca na DOM é executora (D1.1), e se interpretar interações é decisão (D1.2), então as decisões de domínio — o que mostrar, como reagir, o que significa cada evento — precisam de pelo menos uma entidade que não toca na DOM.

**Premissas:** D1.1 (DOM é execução) + D1.2 (interpretação é decisão).

**Racional:** UseDD L2.1 exige separação de nível de responsabilidade. Se a entidade que decide o que mostrar também manipula a DOM, ela mistura decisão e execução. A separação mínima é: pelo menos uma entidade dedicada a decisões de domínio, separada de qualquer entidade que toca na DOM.

**Constrange:**
- Pelo menos uma entidade decisora sem acesso direto à DOM.
- Pelo menos uma entidade executora que toca na DOM.
- UseDD não constrange quantas entidades ficam de cada lado — uma decisora e uma executora é o mínimo, mas múltiplas de cada lado são possíveis. *(→ G2)*

---

#### D2.2 — Estado é informação, não responsabilidade

**Derivação:** Estado (dados, flags, fase de animação, posição) é informação necessária para tomar decisões. Mas armazenar informação e tomar decisões com base nela são atos diferentes. UseDD não constrange a co-localização de estado e lógica de decisão na mesma entidade.

**Premissas:** D2.1 (decisões precisam de entidade sem DOM) + UseDD L2.1 (separação de nível de responsabilidade).

**Racional:** Um banco de dados armazena estado sem decidir. Uma função pura decide sem armazenar. É possível que a entidade que detém estado seja a mesma que toma decisões (co-localização), ou que sejam entidades separadas (uma armazena, outra consulta e decide). Ambas as opções satisfazem UseDD — a restrição é que decisões e execução na DOM sejam separadas, não que estado e decisão estejam juntos.

**Constrange:**
- Uma arquitetura pode co-localizar estado e decisão na mesma entidade (ex: um objeto com estado e métodos de transição) ou separá-los (ex: um store passivo + uma entidade que define transições).
- O que UseDD proíbe é: estado vivendo na entidade que manipula a DOM e sendo alterado por ela sem autorização de uma entidade decisora. *(→ G3)*

---

#### D2.3 — O script pode ocupar múltiplos níveis de responsabilidade

**Derivação:** D1.4 identifica que o script participa de até três relações: executor da DOM (manipulação direta), possível decisor do template (se adiciona regras de apresentação), e possível executor de outra entidade decisora (se apenas traduz). Se o script ocupa mais de um nível de responsabilidade na mesma entidade, UseDD L2.1 exige que essa mistura seja resolvida.

**Premissas:** D1.4 (três relações possíveis do script) + UseDD L2.1 (separação de nível de responsabilidade).

**Racional:** Um script que faz `el.animate(...)` está executando na DOM. O mesmo script que faz `let x = $state("active")` pode estar decidindo (se a regra de apresentação é dele) ou traduzindo (se a entidade decisora já definiu o que mostrar e o script só reformata). Se esses papéis vivem na mesma entidade sem separação formal, a pergunta "o script é decisor ou executor?" não tem resposta determinística — e UseDD L2.1 diz que isso indica violação. Mas se o script é *apenas* tradutor/executor em todas as suas relações, não há mistura de níveis — a tensão só existe se o script de fato decide em alguma relação.

**Constrange:**
- Uma arquitetura neste domínio precisa definir o papel do script em cada relação — se é decisor, tradutor, ou executor — e garantir que a resposta seja determinística. *(→ G7)*
- Se o script decide em alguma relação e executa em outra, as duas relações devem ser formalmente distinguíveis ou separadas em entidades distintas.

---

#### D2.4 — Reatividade serve a execução, não origina autoridade

**Derivação:** A reatividade do framework é o mecanismo pelo qual decisões chegam à DOM. Reatividade transmite autoridade — não a origina.

**Premissas:** F3 (framework fornece reatividade) + D2.1 (decisões de domínio vivem fora da DOM) + UseDD L2.5 (humano é a única origem da cadeia de autoridade).

**Racional:** Se a reatividade originasse autoridade, existiria um galho na cadeia que terminaria no framework — não no humano. A reatividade é como eletricidade numa fábrica: habilita a operação das máquinas, mas quem decide o que produzir é o gerente, não a rede elétrica. Uma mudança de estado que "acontece" por efeito colateral da reatividade, sem que uma entidade decisora a tenha autorizado, é uma violação da cadeia de autoridade.

**Constrange:**
- Reatividade propaga decisões, não as inicia.
- Efeitos reativos que alteram estado sem autorização explícita de uma entidade decisora indicam que a cadeia de autoridade foi rompida.

---

### D3 — Cadeia de autoridade

#### D3.1 — Toda entidade interna traça autoridade de volta ao humano

**Derivação:** A cadeia de autoridade neste domínio segue a estrutura:

```
Humano (usuário) → Porta UX  ──┐
                               ├─→ Entidade(s) decisora(s) → Entidade(s)
                               |   executora(s) → DOM
Humano (desenvol.) → Porta DX ─┘
```

As duas portas convergem para o interior do componente, mas UseDD não constrange se ambas apontam para a mesma entidade decisora, para entidades decisoras diferentes, ou para um grafo mais complexo. *(→ G4)*

**Premissas:** D2.1 (separação decisão/execução) + D1.3 (duas portas) + D2.4 (reatividade não origina) + UseDD L2.5 (humano é única origem) + UseDD L2.6 (cadeia finita e acíclica).

**Racional:** Nenhuma entidade interna existe para si mesma. UseDD não constrange o número de elos na cadeia — pode haver entidades intermediárias que são decisoras de uma entidade e executoras de outra (ex: um script que traduz decisões de estado em linguagem de template). O que é imperativo é que pelo menos uma entidade decisora satisfaça diretamente uma porta definida por humanos, e que toda entidade intermediária trace autoridade de volta a essa porta. A cadeia é finita (termina no humano), acíclica (autoridade flui em uma direção), e sem galhos onde a ponta é a implementação.

**Constrange:**
- Para qualquer entidade do componente, a pergunta "a quem esta entidade serve?" deve ser respondível traçando de volta ao humano.
- Uma entidade que não traça de volta a nenhum dos dois humanos (usuário ou desenvolvedor) não tem razão de existir.

---

### G — Graus de liberdade: o que UseDD não constrange neste domínio

> Os nós abaixo registram escolhas que qualquer arquitetura neste domínio precisa fazer, mas que não são determinadas pela combinação de UseDD com os fatos do domínio. Arquiteturas diferentes podem fazer escolhas diferentes em cada grau de liberdade e ainda satisfazer todas as restrições acima.

---

#### G1 — Template e script: uma entidade ou duas?

**Origem:** D1.4

**Grau de liberdade:** Template e script são ambos capazes de tocar na DOM (execução). Mas a relação entre eles não é necessariamente de pares paralelos — o script pode fornecer dados ao template (relação script→template), o que levanta a questão de G7 (o script é decisor ou tradutor nessa relação?). Independentemente da resposta a G7, UseDD não constrange se template e script devem ser tratados como uma entidade ou duas *quando ambos operam como executores*.

**Opções:**
- Uma entidade executora que usa ambos os mecanismos (template para estrutura declarativa, script para manipulação imperativa da DOM).
- Duas entidades executoras separadas: uma para apresentação declarativa, outra para manipulação imperativa.
- Se G7 resolve que o script é decisor de apresentação, a relação script→template não é entre pares — é entre um decisor e um executor. Nesse caso, a pergunta de G1 se aplica apenas à relação em que ambos tocam na DOM em paralelo (relações 1 e 2 de D1.4), não à relação 3.

**O que importa para UseDD:** A resposta depende de como G7 é resolvido. Se o script é puramente executor/tradutor, ele e o template estão no mesmo nível e a escolha é livre. Se o script é decisor do template, eles já são entidades em níveis diferentes — a "mesma entidade ou duas?" só se aplica ao subconjunto de relações onde ambos são executores.

---

#### G2 — Quantas entidades de cada lado?

**Origem:** D2.1

**Grau de liberdade:** UseDD exige pelo menos uma entidade decisora e pelo menos uma executora. Não constrange o número total de entidades de cada lado.

**Opções:**
- Uma decisora, uma executora (mínimo).
- Uma decisora, múltiplas executoras (ex: uma para apresentação, outra para animação, outra para coleta de eventos).
- Múltiplas decisoras, uma executora (ex: uma para lógica de estado, outra para regras de validação).
- Qualquer combinação, desde que toda decisora trace de volta ao humano e toda executora trace de volta a uma decisora.

---

#### G3 — Estado co-localizado com decisão ou separado?

**Origem:** D2.2

**Grau de liberdade:** UseDD não constrange se a entidade que armazena estado é a mesma que define transições.

**Opções:**
- Co-localização: uma entidade detém estado e define como ele muda (um objeto com propriedades e métodos).
- Separação: uma entidade passiva armazena estado, outra consulta e define transições.

**O que importa para UseDD:** Estado nunca é alterado por uma entidade executora por conta própria. Qualquer mudança de estado traça de volta a uma decisão.

---

#### G4 — Ambas as portas servidas pela mesma entidade decisora ou por entidades diferentes?

**Origem:** D3.1

**Grau de liberdade:** A porta UX e a porta DX convergem para o interior do componente. UseDD não constrange se ambas apontam para a mesma entidade decisora.

**Opções:**
- Uma entidade decisora que satisfaz ambas as portas.
- Uma entidade decisora para cada porta.
- Uma entidade decisora que satisfaz a porta UX e delega aspectos da porta DX a outra, ou vice-versa.

**O que importa para UseDD:** Cada porta é definida pelo humano que a usa, não pela entidade interna que a implementa. A estrutura interna serve as portas — não o contrário.

---

#### G5 — Coleta de eventos: mesma entidade que escreve na DOM ou separada?

**Origem:** D1.2 + D1.4

**Grau de liberdade:** Coletar eventos e escrever na DOM são ambos execução que toca na DOM. UseDD não constrange se devem ser a mesma entidade ou entidades diferentes.

**Opções:**
- Uma entidade executora que faz ambas as coisas (escuta eventos e atualiza DOM).
- Entidades separadas: uma coleta eventos e os repassa à decisora, outra recebe ordens da decisora e atualiza a DOM.

**O que importa para UseDD:** Em qualquer caso, a entidade que coleta eventos não os interpreta — a semântica do evento pertence a uma decisora (D1.2).

---

#### G6 — Mecanismo de comunicação entre decisora e executora

**Origem:** D2.1 + D2.4

**Grau de liberdade:** UseDD constrange a direção da autoridade (decisora → executora) mas não o mecanismo pelo qual a comunicação acontece.

**Opções:**
- Reatividade do framework (a decisora expõe estado reativo, a executora consome e reflete na DOM).
- Chamadas imperativas (a decisora emite comandos, a executora os executa).
- Combinação dos dois (estado reativo para fluxo contínuo, comandos imperativos para ações pontuais).

**O que importa para UseDD:** O mecanismo não altera a cadeia de autoridade. Reatividade propaga, não origina (D2.4). Comandos imperativos devem vir da decisora, não de efeitos colaterais.

---

#### G7 — O script é decisor, tradutor, ou ambos?

**Origem:** D1.4 + D2.3

**Grau de liberdade:** O script participa de múltiplas relações. Sua natureza em cada uma não é constrangida pelo domínio — é escolha arquitetural. Há duas perguntas a resolver:

**Pergunta 1: Na relação script→template, o script é decisor ou tradutor?**
- **Decisor:** O script adiciona informação que a entidade decisora de domínio não forneceu. Ex: a entidade decisora diz `isActive: true`, o script transforma em `class: "active"` — a regra de apresentação é do script.
- **Tradutor (executor):** O script repassa decisões de outra entidade sem adicionar informação. Ex: a entidade decisora já diz `cssClass: "active"`, o script alimenta o template — é execução, como um tradutor que traduz ordens sem decidir o conteúdo.
- **Nota:** Ambas as descrições podem ser verdadeiras para o mesmo código, dependendo de onde se traça a fronteira entre "decisão de apresentação" e "tradução mecânica". A diferença não é heurística — é sobre se a regra que transforma estado de domínio em instrução de apresentação é atribuída ao script como responsabilidade própria ou à entidade decisora como parte de sua saída.

**Pergunta 2: Se o script decide em alguma relação e executa em outra, como resolver a mistura de níveis?**

**Opções:**
- O script é puramente tradutor/executor — toda decisão (inclusive apresentação) vem de outra entidade. Não há mistura de níveis.
- O script é decisor de apresentação — tem regras próprias sobre como traduzir estado em visual. Neste caso, se também executa na DOM diretamente, a mistura de níveis precisa ser resolvida:
  - Separar em duas entidades: uma que decide apresentação, outra que executa na DOM.
  - Formalizar a separação dentro de uma entidade (convenções, seções explícitas).
  - Eliminar a manipulação direta de DOM do script (toda apresentação vai pelo template).

**O que importa para UseDD:** A resposta a "o script é decisor ou executor?" deve ser determinística para cada relação. UseDD não diz qual opção escolher — apenas que a escolha deve ser feita e que a mistura silenciosa de níveis é violação.

---

## 6. O que UseDD + domínio ainda não constrangem

**Mensagem do autor:**

UseDD sozinho ainda não constrange a arquitetura a ser a SSMV, noto que falta o que tange:
- Cada módulo é feito de forma que não precisa saber da existência dos outros, assim pode ser testado em isolado ou com um stub.
- As portas são "genéricas" desde a v1, não só por intercambialidade, mas também para casos com das animações que é razoável prever o caso de uso que demande uma diferente (então não espera que alguém precise de uma diferente e reclame que a API não permite isso e demande uma refatoração...)
- UseDD sozinho não constrange a separação de responsabilidade clássica, só a de "nível de responsabilidade (decisor, executor)"
- E as outras coisas dessa seara, que resultam em bastante granularidade de módulos (interaction e coordinator não precisam ser módulos separados pelo UseDD sozinho) e em módulos completamente independentes, testáveis em isolado, intercambiáveis, etc.

Qual é o nível de autorialidade aqui? É preciso nomear um novo princípio, ou nessa seara os princípios existentes já dizem o mesmo, sem alterações? Mesmo nos casos onde os princípios existentes cobrem, se eu citar eles sem explicar que estou aplicando "isso, não aquilo, não é 100% igual, ..." causará confusão no leitor?

*(Duas respostas de sessões anteriores foram anexadas para consolidação.)*

---

## 7. Graus de liberdade adicionais e análise de autorialidade

### Gs que faltam

A árvore até aqui (G1–G7) cobre os graus de liberdade que surgem da aplicação de UseDD ao domínio. Mas há uma segunda camada de escolhas que UseDD + domínio *juntos* não constrangem — e que a SSMV resolve usando princípios existentes em aplicações específicas. São elas:

---

#### G8 — Isolamento entre módulos: testabilidade com stubs

**Origem:** D2.1 (separação decisão/execução) — mas UseDD só exige a separação, não que ela produza módulos testáveis em isolado.

**Grau de liberdade:** UseDD constrange que a entidade decisora e a executora sejam separadas. Não constrange se essa separação produz módulos que podem ser testados com stubs — isso requer que o módulo dependa de uma abstração (porta), não de uma implementação concreta. UseDD define *quem* define a porta, mas não que a porta seja a *única* dependência entre módulos.

**O que preenche esse grau:** Dependency Inversion (DIP) aplicado internamente — o módulo depende do contrato declarado pelo decisor, e um stub satisfaz esse contrato para fins de teste. Ports and Adapters de Cockburn (2005) é a formulação mais próxima, mas foi criada para isolar domínio de infraestrutura externa. A SSMV aplica o mesmo padrão entre módulos internos do mesmo pacote, numa granularidade muito menor. Citar Hexagonal sem essa contextualização fará o leitor pensar em camadas de aplicação, não em módulos de componente.

**Autorialidade:** Baixa como princípio (DIP + Ports and Adapters cobrem). Moderada como aplicação — a transposição para módulos internos de componente UI precisa ser dita explicitamente.

---

#### G9 — Granularidade: responsabilidade → fronteira de módulo

**Origem:** D2.1 + D2.3 — UseDD exige separação de nível de responsabilidade, mas não que cada responsabilidade mapeie para um arquivo/módulo separado.

**Grau de liberdade:** Interaction e Coordinator poderiam ser o mesmo módulo executor sob UseDD — ambos são executores, e UseDD não força separação *dentro* do mesmo nível. A decisão de separá-los em módulos distintos vem de SRP clássico ("razões de mudança distintas") aplicado até a granularidade de arquivo.

**O que preenche esse grau:** SRP — mas estendido além da aplicação usual. SRP normalmente para na classe ou função. Aplicá-lo como critério de separação física de arquivos é uma decisão adicional que os princípios existentes não prescrevem. Não é um princípio novo — é uma intensidade de aplicação que precisa ser justificada.

**Autorialidade:** Baixa como princípio (SRP cobre). Moderada como intensidade — a extensão até granularidade de arquivo em componentes UI não tem precedente preciso na literatura.

---

#### G10 — Independência entre módulos no mesmo nível

**Origem:** D2.1 — UseDD constrange a direção vertical (decisor→executor) mas não a relação horizontal.

**Grau de liberdade:** UseDD não constrange se módulos no mesmo nível (ex: dois executores) conhecem a existência um do outro. Coordinator e Interaction poderiam comunicar-se diretamente sob UseDD — nada na cadeia de autoridade proíbe isso. A decisão de que nenhum módulo sabe da existência dos outros é uma propriedade adicional.

**O que preenche esse grau:** A combinação de DIP (cada módulo depende apenas do contrato do decisor) com a consequência de UseDD (o decisor define todas as portas, então os executores não precisam se conhecer — suas instruções vêm completas do decisor). A independência não é um princípio novo — é uma propriedade emergente da aplicação simultânea de UseDD + DIP + SRP até granularidade de módulo.

**Autorialidade:** Baixa como conceito (é consequência de princípios existentes). O que é autoral é a observação de que a combinação produz módulos *estruturalmente incapazes* de ter acoplamento acidental — não por disciplina, mas por construção.

---

#### G11 — Genericidade de portas: antecipação por conhecimento de domínio

**Origem:** D1.3 (portas externas definidas antes da implementação) — mas UseDD diz que a porta é definida pelo lado que usa, não quão genérica ela deve ser.

**Grau de liberdade:** UseDD diz "o uso esperado é definido antes da implementação". Não diz se o uso esperado é o caso atual apenas ou se inclui casos futuros previsíveis. Uma porta ajustada ao primeiro consumidor satisfaz UseDD. Uma porta genérica desde a v1 também satisfaz. A escolha entre as duas não é constrangida.

**O que preenche esse grau:** Open/Closed Principle (aberto para extensão, fechado para modificação) é o princípio mais próximo. Mas OCP é frequentemente ensinado via herança, e aqui o mecanismo é contratos tipados que qualquer implementação pode satisfazer. Além disso, a heurística de *quando* generalizar ("o domínio torna razoável prever a necessidade") não tem formulação precisa na literatura. YAGNI diz "não generalize antes de precisar". A SSMV diz "generalize quando o domínio torna a necessidade futura previsível com confiança razoável".

**Autorialidade:** Moderada a alta. OCP cobre o *mecanismo* (porta genérica que aceita extensão). A *heurística* de quando aplicar — confiança baseada em conhecimento do domínio, não em antecipação arbitrária — é autoral. Citá-la como YAGNI invertido criaria mais confusão do que clareza. Merece uma formulação própria.

---

#### G12 — SRP clássico dentro do mesmo nível de responsabilidade

**Origem:** UseDD L2.1 define "nível único de responsabilidade" como decisor/executor. Não implica SRP clássico ("uma razão de mudança").

**Grau de liberdade:** Dois executores com razões de mudança diferentes (ex: Interaction muda quando o padrão de interação muda, Coordinator muda quando a API do framework muda) poderiam ser a mesma entidade sob UseDD — ambos são executores. A separação por razão de mudança é uma restrição adicional.

**O que preenche esse grau:** SRP clássico, mas numa variante mais estrita: não "uma razão de mudança" genérica, mas "ou decide ou executa, e dentro de cada nível, cada razão de mudança é um módulo". Tell Don't Ask (Fowler) é a formulação operacional mais próxima — o executor não consulta estado para decidir, recebe a ordem completa. A SSMV aplica isso de forma mais estrita: o executor não só não consulta — ele é *estruturalmente incapaz* de consultar, porque o contrato que recebe já é a ordem completa (Intenções Tipadas).

**Autorialidade:** Baixa como princípio (SRP + Tell Don't Ask cobrem). A intensidade de aplicação — levar a separação até cada módulo ser incapaz de acoplamento — é uma consequência da combinação, não um princípio novo.

---

### Análise consolidada de autorialidade

Nenhum dos conceitos dessa seara requer um novo princípio. Todos são cobertos por princípios existentes: DIP, Ports and Adapters, SRP, OCP, Tell Don't Ask. Mas em quase todos os casos, a aplicação tem uma especificidade que torna a citação direta perigosa:

| Princípio citável | Onde a SSMV diverge da aplicação usual | Risco de confusão se citado sem contextualização |
|---|---|---|
| Ports and Adapters | Aplicado entre módulos internos de um componente, não entre domínio e infraestrutura | Alto — o leitor vai assumir a topologia hexagonal clássica |
| DIP | A motivação não é gestão de dependências, é autoridade de design (UseDD) | Médio — a mecânica é a mesma, a justificativa é diferente |
| SRP | Estendido até granularidade de arquivo, não só classe/função | Baixo — mas a extensão precisa ser dita |
| OCP | Mecanismo é contrato tipado, não herança | Médio — OCP é frequentemente ensinado via herança |
| Tell Don't Ask | Aplicado de forma mais estrita: o executor é *estruturalmente incapaz* de consultar | Baixo — é uma intensificação, não uma mudança |

**O que é genuinamente autoral:**

1. **A heurística de generalização por conhecimento de domínio** (G11) — não tem precedente preciso. YAGNI, OCP, e "design for change" não capturam o critério de confiança baseada em domínio. Merece formulação própria.

2. **A propriedade emergente da combinação** — que UseDD + DIP + SRP até granularidade de arquivo produz módulos *estruturalmente incapazes* de acoplamento acidental, por construção e não por disciplina. Nenhum princípio individual descreve essa propriedade. Não é um princípio novo — é uma frase que nomeia o resultado e cita os mecanismos que o produzem.

**Regra para citações:** Cada princípio citado precisa de uma **frase de aplicação** — não "usamos DIP" mas "usamos DIP desta forma específica, que produz esta consequência". O leitor que conhece o original vai entender a variação; o que não conhece vai ter o suficiente para seguir.

---

## 8. Viés da lista: os Gs vieram do domínio ou da SSMV?

**Mensagem do autor:** A lista foi baseada na SSMV existente. Uma lista feita sem viés, sem saber que a SSMV existe, ainda traria esses Gs como liberdades que PRECISAM de constrangimento em uma "futura" arquitetura?

---

### Resposta

Não. A maioria dos G8–G12 foi reverse-engineered a partir da SSMV. Uma pessoa aplicando UseDD + restrições de domínio sem conhecer a SSMV não chegaria naturalmente a todos eles como "lacunas que preciso preencher". Analisando um a um:

**G11 (genericidade de portas) — sim, emergeria naturalmente.** O momento em que UseDD manda "defina a porta antes da implementação", o arquiteto senta para escrever a porta e imediatamente enfrenta a pergunta: "projeto para o caso atual ou para os casos que o domínio torna previsíveis?" Essa é uma tensão real que nasce do ato de definir portas. Qualquer pessoa neste domínio a encontraria.

**G10 (independência entre siblings) — parcialmente.** Quando D2.1 diz "pelo menos uma decisora, pelo menos uma executora" e G2 abre a possibilidade de múltiplas executoras, a pergunta "como as executoras se relacionam entre si?" surge naturalmente para quem pensa em relações. UseDD constrange a relação vertical (decisor→executor) mas é silencioso sobre a horizontal — e o silêncio de um meta-princípio relacional sobre uma categoria inteira de relações é uma lacuna que um pensador rigoroso notaria. Mas é provável que muitos arquitetos simplesmente deixassem executores comunicarem-se livremente sem perceber isso como uma escolha que merece ser explicitada.

**G8 (isolamento / testabilidade com stubs) — não, a menos que o arquiteto já valorize testabilidade.** UseDD L2.4 diz "a spec é o critério de correção", o que implica necessidade de verificação. Mas o *mecanismo* de verificação (testes isolados com stubs, testes de integração, verificação manual) é uma preocupação de engenharia de software geral, não algo que UseDD + domínio force a confrontar. Uma pessoa que não pensa em testabilidade isolada construiria uma arquitetura válida sob UseDD sem jamais considerar G8.

**G9 (granularidade: responsabilidade → arquivo) — não.** UseDD diz "entidades separadas". Não diz "arquivos separados". A decisão de mapear cada responsabilidade para um arquivo/módulo distinto é uma prática de organização de código que vem de SRP clássico estendido — não de UseDD nem do domínio. Uma pessoa começando do zero poderia ter uma entidade decisora e uma executora no mesmo arquivo com separação lógica e satisfazer todas as restrições.

**G12 (SRP clássico dentro do mesmo nível) — não.** UseDD diz "quem decide não executa". Não diz "executores com razões de mudança diferentes devem ser entidades separadas". A separação entre Interaction e Coordinator como módulos distintos é uma consequência de aplicar SRP clássico *por cima* de UseDD — não algo que UseDD ou o domínio forcem.

---

### O que isso significa para a árvore

G8–G12 não pertencem à seção G da Design Tree de restrições de domínio. Eles vivem em camadas diferentes: princípios de engenharia e convenções, aplicados *sobre* o resultado de UseDD + domínio para produzir uma arquitetura concreta. Colocá-los na seção G cria a ilusão de que são lacunas naturais de UseDD + domínio — quando na verdade são escolhas informadas pela SSMV retroprojetadas na árvore.

A árvore de restrições de domínio deveria conter apenas G1–G7. Os demais pertencem a camadas posteriores na sequência:

```
UseDD (meta-princípio)
  → Restrições de Domínio (UseDD aplicado ao domínio — esta árvore, G1–G7)
    → Princípios de Engenharia aplicados (DIP, SRP, OCP, Tell Don't Ask — onde G8-G12 vivem)
      → Convenções (organização de arquivos, nomenclatura, padrões de escrita — onde G9 vive)
        → SSMV (arquitetura resultante)
```

A distinção entre as duas camadas intermediárias: princípios de engenharia são *por quê* separar (razões de mudança distintas, testabilidade, extensibilidade); convenções são *como* materializar a separação (um arquivo por módulo, nomenclatura de arquivos, estrutura de diretórios). G9 (responsabilidade → fronteira de arquivo) não é SRP — SRP diz "separe responsabilidades", G9 diz "essa separação é física, um arquivo cada". É uma convenção que operacionaliza o princípio.

---

## 9. Relações horizontais, cadeias longas e outros silêncios de UseDD

**Mensagem do autor:** Criar regras para as relações horizontais (e.g., a relação entre os diferentes executores que servem o mesmo decisor), e cadeias com mais elos (e.g., um script só tradutor que é por isso um executor, pode existir, dado que isso seria uma cadeia de dois executores?) e outras relações que o atual UseDD não constrange... Essas regras devem ser adicionadas ao UseDD ou são todas regras de Princípios de Engenharia de Software?

---

### Resposta: UseDD não é incompleto — os silêncios são deriváveis

Os casos levantados parecem lacunas, mas as respostas são deriváveis da aplicação consistente dos nós existentes. UseDD não precisa de novas regras — precisa de clarificações que tornem explícito o que já está implícito.

---

#### Relações horizontais (executores do mesmo decisor)

Se executor A e executor B se comunicam, essa comunicação *é* uma relação de uso — e UseDD já se aplica a ela: L1.1 pergunta "quem pensa neste par?" Se A instrui B, A é o decisor nesse par. Se nenhum instrui o outro, não há relação de uso — e UseDD é corretamente silencioso, porque é um princípio relacional que só fala de pares em relação de uso.

A decisão de se executores *devem* ou *não devem* comunicar-se entre si é sobre acoplamento — é princípio de engenharia (baixo acoplamento, alta coesão), não sobre direção de autoridade. UseDD não proíbe nem obriga comunicação horizontal. O que proíbe é que, se a comunicação existir, a direção de autoridade seja ambígua.

---

#### Cadeias com mais elos (tradutor entre decisor e DOM)

Dois cenários:

**O tradutor adiciona informação** (regras de apresentação que a entidade decisora não forneceu). Neste caso, na relação tradutor→DOM, o tradutor é o lado que pensa — é decisor do próximo elo. E na relação decisor→tradutor, o tradutor é executor. Isso é válido: UseDD L2.2 (uniformidade entre granularidades) permite que a mesma entidade ocupe papéis diferentes em pares diferentes. O que importa é que em *cada par* a resposta a "quem pensa?" seja determinística. Não é uma cadeia de dois executores — é um executor que é também decisor em outro par.

**O tradutor não adiciona informação** (apenas reformata, como um pipe). Neste caso, o tradutor não é uma entidade no sentido de UseDD — é infraestrutura. Assim como reatividade propaga sem originar autoridade (D2.4 desta árvore), um pipe que reformata sem decidir é mecanismo de transmissão, não elo na cadeia de autoridade. UseDD L2.5 diz que toda entidade na cadeia traça autoridade de volta ao humano — mas um pipe não tem autoridade própria para traçar.

**O critério de distinção:** se retirar a entidade da cadeia obrigaria a entidade anterior a fazer o trabalho de reformatação, a entidade *existe* como executor (alguém precisa fazer a tradução). Mas "existir como executor" e "adicionar informação de decisão" são coisas diferentes. Um executor que traduz formato sem escolher conteúdo é executor — não decisor do próximo elo. A cadeia fica: Decisor → Executor-Tradutor → DOM. O tradutor é executor do decisor, e sua "relação" com a DOM não é de uso — é de implementação interna (ele toca na DOM como parte de executar a ordem do decisor).

Isso resolve o caso do script-tradutor: ele não cria um segundo elo decisor→executor. Ele é um executor que, como parte da sua execução, toca na DOM. Não há cadeia de dois executores — há um executor com um mecanismo de execução (a DOM).

---

#### Múltiplos executores do mesmo decisor

UseDD se aplica a cada par independentemente. Se o decisor define portas para executor A e executor B, são duas relações de uso separadas. A relação *entre* A e B é horizontal — coberta pelo primeiro caso acima (ou é uma relação de uso e UseDD se aplica, ou não é e UseDD é corretamente silencioso).

---

#### Comprimento da cadeia

UseDD L2.5 (humano é única origem) e L2.6 (cadeia finita e acíclica) constrangem a *estrutura* — não o *tamanho*. Isso é correto: um meta-princípio sobre direção de autoridade não deve prescrever quantos elos são permitidos. A decisão de manter cadeias curtas é sobre simplicidade e manutenibilidade — princípios de engenharia.

---

### O que UseDD precisa: clarificações, não regras novas

Nenhum dos casos requer uma regra nova. Mas três coisas estão implícitas e merecem ser explícitas na Design Tree de UseDD:

1. **UseDD é escopo de pares em relação de uso.** Entidades que não se usam mutuamente não são constrangidas por UseDD — e isso é correto, não uma lacuna. (Clarificação de L1.1.)

2. **Uma entidade pode ocupar papéis diferentes em pares diferentes.** Executor em um par, decisor em outro. O que importa é que em cada par a resposta a "quem pensa?" seja determinística. (Derivável de L2.2, mas merece menção explícita.)

3. **Uma entidade que não adiciona informação é infraestrutura, não elo na cadeia.** Assim como reatividade (transmite sem originar), um pipe/tradutor mecânico não é uma entidade com autoridade própria. O teste: se retirar o pipe obriga outra entidade a fazer a tradução, o pipe *existe* — mas como executor, não como decisor do próximo elo. (Extensão de D2.4 da árvore de domínio, mas o princípio é geral e pertence a UseDD.)

---

## 10. Perguntas sobre horizontalidade, tradutores e pipes

**Mensagem do autor:** Quatro perguntas sobre os pontos da seção 9.

**Sobre relações horizontais:** A regra de executores não conversarem existe em SSMV para satisfazer a regra de ter só uma fonte de verdade, ter estado em um módulo só. Estado em um módulo só é "gosto" de MV, ou é princípio de engenharia de software? Outra, mudar estado é tomar uma decisão? Se for, isso proíbe executores de mudarem estado e por consequência eles não podem mais se comunicar? Ou ainda há casos de comunicação que não envolvem estado?

**Sobre o tradutor que adiciona informação:** Mas isso não pode possibilitar um caso onde decisões de mesmo domínio estão espalhadas em mais de um módulo? Além desse caso de exemplo onde são decisões de domínios diferentes.

**Sobre o tradutor que não adiciona informação:** Mas então UseDD deve tratar da existência de Pipes, além de Entidades e Portas?

**Sobre o critério de distinção:** Os tradutores existentes vem da regra de que views burras usam linguagem de apresentação + módulos não sabem da existência da DOM usam linguagem de negócio. E essas regras são claramente princípios de engenharia de software, não preocupação do UseDD, certo?

---

### Análise

#### 1. Fonte de verdade única: princípio ou gosto?

Há duas perguntas encapsuladas aqui, e é produtivo separá-las.

**"Estado em um módulo só" é princípio de engenharia ou gosto de MV?**

É princípio de engenharia. Single Source of Truth (SSOT) é formulação reconhecida e independente de padrão arquitetural — aparece em bancos de dados (normalização), em sistemas distribuídos (log de eventos como fonte canônica), em frontend (stores centralizados). MV não inventou SSOT; *usa* SSOT. Portanto, não é gosto — é princípio existente que MV aplica.

Mas "estado em um módulo só" é a formulação SSMV de SSOT, não SSOT em estado puro. SSOT diz "cada fato tem uma fonte canônica". A SSMV traduz isso como "o Model é a única entidade que detém estado do componente". Essa tradução é uma *aplicação* do princípio ao contexto da arquitetura — pertence à camada de princípios de engenharia aplicados (nível 3 na sequência), não a UseDD.

**"Mudar estado é tomar uma decisão?"**

Sim, no sentido de UseDD. Uma mudança de estado é uma transição — alguém definiu *quando* e *para qual valor* a transição acontece. Esse "alguém" é o lado que pensa, o decisor. Se um executor pudesse mudar estado por conta própria, ele estaria decidindo quando e como o estado muda — violação de L1.1 (quem usa define, quem executa não decide).

**Consequência: isso proíbe executores de mudarem estado?**

UseDD proíbe executores de *decidirem* mudanças de estado. Um executor pode *efetuar* uma mudança de estado como parte da execução de uma ordem do decisor — como um executor que escreve na DOM efetua uma mudança visual sem ter decidido qual. A distinção é entre originar a decisão de mudar e executar a mecânica da mudança.

**E a comunicação horizontal?**

Se dois executores se comunicam, UseDD pergunta "quem pensa neste par?" (seção 9). Se a comunicação é apenas troca de dados sem decisão (um notifica o outro de um fato), é infraestrutura — não relação de uso. Se a comunicação envolve um executor instruindo o outro, o primeiro está decidindo — e se ele está decidindo, ou ele não é puramente executor, ou a "comunicação" é na verdade uma cadeia decisor→executor que deveria ser formalizada.

Mas há um caso intermediário: dois executores que compartilham acesso ao mesmo estado. Se ambos podem ler e escrever o mesmo estado, não há clareza sobre quem decide as transições. SSOT resolve isso — uma fonte canônica, um decisor desse estado. Não é UseDD que proíbe executores de compartilharem estado — é SSOT. Mas UseDD *reforça* a conclusão: se estado é informação e transições são decisões, então a entidade que define transições é decisora, e dar acesso de escrita a um executor é dar a ele poder de decisão implícito.

**Resumo:** UseDD não formula SSOT, mas é *compatível* com ele e leva à mesma conclusão por um caminho diferente (autoridade de decisão em vez de normalização de dados). A regra de que executores não compartilham estado mutável é a *interseção* de UseDD + SSOT — reforçada por ambos. A proibição de comunicação horizontal na SSMV é a consequência prática dessa interseção aplicada com DIP (executores dependem apenas da porta do decisor, não se conhecem).

---

#### 2. Decisões do mesmo domínio espalhadas em mais de um módulo

Sim, isso é possível — e é exatamente o risco.

Se o tradutor adiciona informação, ele é decisor do próximo elo. Mas se a informação que adiciona é *do mesmo domínio* que a decisão original, temos duas entidades tomando decisões sobre o mesmo assunto. Exemplo concreto: o Model decide `isActive: true`, e o script decide `if isActive and isMobile then class = "active-compact"`. A regra `isMobile → compact` é uma decisão de apresentação que leva em conta estado de negócio — é do mesmo domínio ou de um diferente?

A resposta depende de como o arquiteto *define* as fronteiras de domínio. UseDD não constrange onde traçar a fronteira entre "domínio de negócio" e "domínio de apresentação" — essa é uma decisão de design. O que UseDD constrange é que, *dentro de cada par*, a autoridade seja clara.

O risco real não é que decisões estejam em dois módulos — é que a *mesma decisão* esteja parcialmente em dois módulos sem que nenhum a detenha por completo. Se o Model diz `isActive` e o script adiciona `isMobile → compact`, a regra completa é "quando ativo e mobile, compactar". Quem detém essa regra? Nenhum dos dois, sozinho.

Isso é o que a engenharia de software chama de *scattered logic* ou *shotgun surgery* (Martin Fowler) — e é exatamente o que princípios como SRP e alta coesão resolvem. UseDD não proíbe decisões espalhadas do mesmo domínio — ele proíbe ambiguidade de autoridade em cada par. A proibição de espalhar decisões do mesmo domínio é princípio de engenharia (coesão), não UseDD.

**Implicação para a árvore:** O caso de tradutores que adicionam informação *do mesmo domínio* é um risco que UseDD não cobre. A mitigação pertence à camada de princípios de engenharia aplicados — especificamente, coesão + a regra de que cada domínio de decisão tem um decisor claro.

---

#### 3. UseDD deve tratar da existência de Pipes?

Não como conceito de primeira classe.

A clarificação 3 da seção 9 já diz: "uma entidade que não adiciona informação é infraestrutura, não elo na cadeia." Isso é suficiente. Pipes, formatadores mecânicos, camadas de serialização — todos são infraestrutura que existe para viabilizar a comunicação entre entidades, não para participar da cadeia de autoridade.

UseDD precisa reconhecer que infraestrutura existe *entre* entidades — mas não precisa categorizá-la como conceito próprio no glossário. A razão: se UseDD adicionar "Pipe" ao vocabulário (Entidade, Porta, Pipe), cria-se a ilusão de que pipes são participantes do design. Eles não são — são consequência de implementação. O glossário de UseDD trata de participantes com autoridade; infraestrutura sem autoridade é corretamente ausente do glossário.

O que a clarificação 3 faz é dar ao leitor o *teste*: se remove a coisa e outra entidade precisa fazer o trabalho → é executor (entidade). Se remove e a comunicação ainda funciona (só piora em formato) → é infraestrutura. Esse teste é suficiente sem adicionar um conceito ao vocabulário.

**Resumo:** UseDD deve *mencionar* que infraestrutura sem autoridade existe e não é elo na cadeia — e a clarificação 3 faz isso. Não deve promover infraestrutura a conceito de primeira classe.

---

#### 4. Tradutores existentes como consequência de princípios de engenharia

Correto. Os tradutores na SSMV existem por causa de duas regras:

1. **Views burras usam linguagem de apresentação** — a view recebe instruções visuais, não estado de negócio. Não sabe o que `isActive` significa; sabe que deve aplicar `class: "active"`.
2. **Módulos de decisão não sabem da existência da DOM** — o Model fala em termos de estado de domínio, não em termos de CSS classes ou atributos HTML.

Essas duas regras criam uma *lacuna de vocabulário* entre o decisor (fala negócio) e o executor (fala apresentação). O tradutor existe para preencher essa lacuna — traduz de um vocabulário para outro.

Ambas as regras são princípios de engenharia de software:
- A primeira é uma aplicação de *Separation of Concerns* (apresentação não sabe de negócio).
- A segunda é uma aplicação de *DIP* (o módulo de decisão não depende da infraestrutura de renderização).

UseDD não formula nenhuma delas. UseDD diz "quem usa define a porta" — mas não diz que a porta deve ser em vocabulário de apresentação ou de negócio. Essa é uma decisão de design informada por princípios de engenharia.

**Implicação para a sequência de cinco níveis:** A existência de tradutores na SSMV é consequência do nível 3 (princípios de engenharia aplicados), não do nível 1 (UseDD) ou nível 2 (restrições de domínio). UseDD + domínio admitem uma arquitetura sem tradutores — onde o decisor já fala a linguagem do executor. A decisão de *não* fazer isso é sobre qualidade de separação, não sobre autoridade.

---

## 11. A porta é de quem? Tradutor como sintoma de porta invertida

**Mensagem do autor:** Se quem decide a porta é sempre o decisor e está precisando de um tradutor para o decisor falar com o executor, isso não quer dizer que a porta foi feita para o executor e não para o decisor? No caso Interaction→Model, o Interaction é considerado executor e não pipe porque o browser está fora do poder, então é uma tarefa mesmo traduzir ele para a porta que agrada o Model e não o browser. Mas no caso script→template, o template ainda está sob o poder e é passível de ter uma porta que agrada o Model, não? Assim um script decisor tem decisões de apresentação, mas um script pipe só cheira mal, não?

---

### Análise

Essa pergunta desenterra algo fundamental sobre quando um tradutor é legítimo e quando é sintoma de um design invertido. Vamos separar os dois casos.

#### Caso 1: Interaction→Model — tradutor legítimo

O browser é uma entidade externa fora do poder. Ele emite eventos no vocabulário dele (`mousemove`, `pointerdown`, coordenadas em pixels). O Model define a porta no vocabulário *dele* (intenções de domínio: `startDrag`, `moveTo(position)`). Há uma lacuna de vocabulário real e *inevitável* — o browser não pode ser reescrito para falar a língua do Model.

O Interaction existe para fazer essa tradução. Ele não é pipe (é tarefa real: interpretar coordenadas, aplicar thresholds, distinguir click de drag). É executor do Model — executa a ordem implícita "observe o browser e me diga o que está acontecendo em termos que eu entendo". A tradução é *trabalho*, não reformatação mecânica.

E crucialmente: a porta do Model é definida pelo Model (o decisor). O Interaction se adapta à porta do Model, não o contrário. A direção de autoridade está correta.

#### Caso 2: script→template — a pergunta que expõe o cheiro

O template *está* sob o poder do arquiteto. Diferente do browser, o template pode ser projetado para aceitar qualquer vocabulário. Se o Model diz `isActive: true` e o template pudesse consumir `isActive` diretamente e traduzir para `class="active"` no próprio markup (que é exatamente o que templates fazem — `class:active={isActive}` em Svelte), por que existe uma entidade intermediária traduzindo?

A pergunta do autor aplica UseDD com precisão: **quem define a porta é o decisor.** Se o Model é o decisor e o template é o executor, a porta deveria ser definida pelo Model no vocabulário do Model. O template, como executor sob o poder do arquiteto, deveria ser capaz de consumir essa porta diretamente.

Se um script intermediário existe *apenas* para reformatar `isActive` em `class: "active"` — sem adicionar nenhuma decisão que o template não pudesse fazer declarativamente — então sim, é pipe. E não pipe legítimo (como infraestrutura de serialização), mas pipe que existe porque a porta foi desenhada para o executor em vez de para o decisor. A porta está invertida.

#### Quando o script intermediário é legítimo

Há um caso onde o script intermediário *não* cheira mal: quando a tradução envolve lógica que o template não é capaz de expressar. Se o template é puramente declarativo e a transformação requer lógica imperativa (ex: calcular posições de layout, combinar múltiplos estados em uma decisão composta), o template *não pode* consumir a porta do Model diretamente — não por design invertido, mas por limitação do mecanismo.

Nesse caso, o script intermediário é legítimo pelo mesmo motivo que o Interaction: o executor final (template) tem uma limitação real que exige tradução. Mas a limitação é do *mecanismo de template*, não do browser externo. É uma limitação de expressividade, não de poder.

#### O critério refinado

A pergunta do autor leva a um teste mais preciso do que "adiciona informação ou não":

1. **O executor final pode consumir a porta do decisor diretamente?**
   - Se **não** (limitação real — browser externo, mecanismo declarativo insuficiente): tradutor legítimo. É trabalho necessário.
   - Se **sim** (o executor está sob o poder e é capaz): o tradutor é sintoma de porta invertida. A porta foi desenhada na linguagem do executor, não do decisor, e o tradutor existe para compensar a inversão.

2. **A inversão é intencional?**
   - Pode ser. Princípios de engenharia podem *escolher* que o Model não fale linguagem de apresentação (Separation of Concerns) e que a view não fale linguagem de negócio (DIP). Essa escolha *cria deliberadamente* a lacuna de vocabulário e *demanda* um tradutor.
   - Mas essa é uma decisão de engenharia, não de UseDD. UseDD, aplicado em estado puro, diria: "o Model define a porta, o template consome — se o template é capaz, não há razão para intermediário."

#### Implicação para a SSMV

O Coordinator na SSMV faz exatamente esse papel de script intermediário. Parte do seu trabalho é tradução legítima (lógica imperativa que o template não expressa — animações WAAPI, manipulação de focus). Mas parte pode ser tradução que o template *poderia* fazer declarativamente.

O teste para cada tradução no Coordinator é: "se eu movesse essa lógica para o template (como binding, expressão reativa, ou diretiva), o template consumiria a porta do Model diretamente?" Se sim, o Coordinator está fazendo trabalho de pipe — e a porta do Model provavelmente foi desenhada mais abstrata do que precisava ser, forçando uma tradução que o template poderia evitar.

Isso não invalida o Coordinator como módulo — ele faz trabalho legítimo *também*. Mas separa o que nele é *trabalho* do que é *compensação de design*.

#### Resumo

| Caso | Executor pode consumir a porta diretamente? | Tradutor é... | Pertence a... |
|---|---|---|---|
| Interaction→Model | Não (browser é externo) | Trabalho legítimo | UseDD + domínio |
| Script→template (lógica imperativa) | Não (template é declarativo) | Trabalho legítimo | Restrição de mecanismo |
| Script→template (reformatação que template faria) | Sim | Sintoma de porta invertida | Decisão de engenharia (Separation of Concerns) |

O cheiro que o autor identificou é real: um script que só reformata quando o template poderia consumir diretamente é evidência de que a porta não está definida pelo decisor para si mesmo — está definida pelo decisor *pensando no executor final*, com um intermediário compensando a distância. UseDD em estado puro não demandaria esse intermediário. Princípios de engenharia podem justificá-lo — mas a justificativa pertence ao nível 3, não ao nível 1.

---

## 12. Onde ficam as restrições de domínio Apple (Swift/SwiftUI/UIKit)?

**Mensagem do autor:** Qual a melhor posição para colocar as restrições de domínio de Apple (Swift/SwiftUI/UIKit) na sequência de cinco níveis?

---

### Análise

O nível 2 é onde o domínio entra — e "domínio" inclui a plataforma de execução. Apple (Swift/SwiftUI/UIKit) e Browser (DOM/template/script) são **duas árvores de nível 2 lado a lado**, não uma dentro da outra.

```
UseDD (meta-princípio)
  ├─ Restrições de Domínio: Browser (DOM, template/script, dois mecanismos)
  │    → Princípios de Engenharia aplicados
  │      → Convenções
  │        → SSMV-Svelte
  │
  └─ Restrições de Domínio: Apple (Swift/SwiftUI/UIKit, view declarativa, ...)
       → Princípios de Engenharia aplicados
         → Convenções
           → SSMV-Apple
```

**Por que paralelas, não aninhadas ou compartilhadas:**

- O nível 1 (UseDD) é agnóstico de plataforma — fala de entidades, portas, decisores, executores. Aplica-se identicamente a ambos.
- O nível 2 é "fatos além do poder + UseDD aplicado a eles". A DOM do browser e o UIKit/SwiftUI da Apple são *fatos diferentes* além do poder. Produzem nós F diferentes, nós D diferentes, e potencialmente nós G diferentes.
- O nível 3 (princípios de engenharia) vai *sobrepor-se em grande parte* — DIP, SRP, SSOT aplicam-se a ambos. Mas as *aplicações específicas* podem diferir porque as restrições de domínio diferem (ex: o `body` de SwiftUI é puramente declarativo sem escape imperativo como o `<script>` de Svelte, então a análise de três relações de D1.4 fica muito diferente).
- O nível 4 (convenções) vai divergir significativamente — organização de arquivos, nomenclatura, idiomas de Swift vs TypeScript.

**O que as duas árvores compartilham vs. onde divergem:**

| Nível | Compartilhado? | Por quê |
|---|---|---|
| 1 — UseDD | Idêntico | Meta-princípio agnóstico de plataforma |
| 2 — Restrições de domínio | Parcialmente — ambos têm "UI reativa com estado" mas os mecanismos da plataforma diferem | DOM vs UIKit/SwiftUI são ambientes de execução diferentes |
| 3 — Princípios de engenharia | Majoritariamente compartilhados (mesmos princípios) mas aplicados de forma diferente | Mesmo DIP, mas "o que conta como infraestrutura" difere |
| 4 — Convenções | Majoritariamente divergentes | Swift vs TypeScript, estruturas de arquivo, idiomas de plataforma |
| 5 — Arquitetura | Convergem de volta como SSMV | Mesma arquitetura conceitual, materialização específica por plataforma |

**Propriedade estrutural:** Os níveis 1 e 5 convergem (mesmo princípio, mesma arquitetura), mas os níveis 2–4 bifurcam e se reúnem. Isso é o que faz a SSMV uma arquitetura *portável* em vez de específica de plataforma — é a mesma resposta derivada por caminhos específicos de plataforma diferentes.
