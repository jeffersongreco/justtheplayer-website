# Restrições de Domínio - Design Tree

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
