# Identificação do Explanandum

> Etapa 1 do método de análise normativa (Beaney): registrar o fenômeno
> tal como se manifesta na prática ordinária, antes de qualquer teoria.
> Este documento é ausculta — mapa de sintomas, não explicação.
>
> Critério de adequação: o documento deve ser reconhecível por um
> engenheiro de software competente que nunca ouviu falar de UseDD.

---

## 0. Nota metodológica

O que se segue não é uma análise conceitual. É um inventário de como um
fenômeno se manifesta na prática de desenvolvimento de software — onde
produz clareza, onde tropeça, onde os praticantes hesitam ou divergem.

O risco principal desta etapa é construir o explanandum de forma a
confirmar a teoria que se quer propor. Se o fenômeno descrito aqui só
fizer sentido à luz de uma teoria particular, a descrição falhou. Um
explanandum bem feito pode surpreender o próprio filósofo.

A disciplina é: descrever o que qualquer praticante reconheceria, sem
importar vocabulário que pressuponha uma explicação.

---

## 1. O fenômeno primário

No desenvolvimento de software, decisões técnicas sistematicamente
produzem constrangimentos sobre o que humanos podem fazer, querer ou
entender dentro de um sistema.

Esse constrangimento tem causas diversas — limitações genuínas de
tecnologia, escolhas de custo, negligência, indiferença a quem usa, ou
subordinação deliberada da experiência humana a outros objetivos como
velocidade de entrega ou conveniência de quem constrói.

O fenômeno não se restringe à relação entre quem constrói e quem usa:
quem constrói é também um humano cuja experiência futura será
constrangida pelas decisões técnicas que toma agora, de modo que a mesma
assimetria que afeta o usuário pode afetar o próprio construtor —
frequentemente sem que ele o antecipe no momento da decisão.

A direção predominante do constrangimento é assimétrica: o humano que
usa adapta-se ao sistema com mais frequência do que o sistema é adaptado
ao humano que usa.

Os praticantes divergem sobre se essa assimetria é inevitável, aceitável
ou uma falha com responsável identificável. Essa divergência é parte do
fenômeno — não ruído a ser eliminado, mas evidência de que a tensão
carrega uma dimensão normativa que permanece não resolvida na prática.

---

## 2. Manifestações observáveis

As seções seguintes registram onde e como o fenômeno se manifesta na
prática ordinária de engenharia de software. Cada manifestação é
descrita como algo que um praticante reconheceria sem precisar de
vocabulário teórico.

### 2.1. O constrangimento técnico que se torna constrangimento humano

Um desenvolvedor escolhe uma estrutura de dados, um formato de API, um
modelo de navegação. Essa escolha resolve um problema técnico. Semanas
ou meses depois, um humano — o próprio desenvolvedor ou outro — descobre
que a escolha técnica tornou certas experiências impossíveis, difíceis
ou confusas.

O que se observa não é acidente isolado. É padrão recorrente: decisões
tomadas em um vocabulário (técnico, estrutural) produzem efeitos em
outro vocabulário (experiencial, comportamental), e o segundo
vocabulário não estava presente no momento da decisão.

**Onde os praticantes concordam:** isso acontece. É comum. Tem custo
real.

**Onde divergem:** sobre se é evitável. Alguns consideram que a
distância entre os dois vocabulários é redutível com disciplina; outros,
que é constitutiva da atividade e só pode ser gerida, nunca eliminada.

### 2.2. A adaptação silenciosa

Quando o sistema não se ajusta ao humano, o humano se ajusta ao sistema.
Essa adaptação é frequentemente silenciosa — não é registrada como
decisão, não aparece em logs, não gera tickets. O humano aprende a
contornar, evitar, reinterpretar. A adaptação é invisível precisamente
porque é bem-sucedida: o humano consegue operar o sistema, portanto o
problema "não existe".

**Onde os praticantes concordam:** a adaptação acontece e é
subnotificada.

**Onde divergem:** sobre se a adaptação é custo ou competência. Para
alguns, aprender a usar um sistema complexo é parte legítima do
trabalho; para outros, toda adaptação que poderia ter sido evitada por
uma decisão técnica diferente é uma transferência de custo — do
construtor para quem usa.

**Onde hesitam:** na fronteira entre complexidade inerente (o domínio é
complexo e o sistema reflete essa complexidade) e complexidade imposta
(o sistema é mais complexo do que o domínio exige). A maioria dos
praticantes reconhece que essa fronteira existe, mas poucos conseguem
articular um critério para localizá-la.

### 2.3. A assimetria que se retroalimenta

O humano que constrói o sistema é, com frequência, o humano menos
afetado por suas decisões. Quem define a API não a consome diariamente.
Quem escolhe o modelo de dados não opera o formulário que o reflete.
Quem decide a arquitetura não mantém o código que ela constrange.

A assimetria se retroalimenta: quem decide está menos exposto às
consequências; quem é exposto às consequências não decide. Quanto mais
camadas entre a decisão e a consequência, mais estável a assimetria se
torna — não porque alguém a proteja, mas porque a informação sobre a
consequência não retorna a quem decidiu.

**Onde os praticantes concordam:** o feedback entre decisão e
consequência é tipicamente fraco, atrasado ou inexistente.

**Onde divergem:** sobre se a solução é organizacional (aproximar quem
decide de quem sofre a consequência) ou técnica (construir artefatos
que tornem a consequência visível antes da decisão ser irreversível).

### 2.4. O construtor como humano constrangido

O fenômeno não se esgota na relação construtor–usuário. O desenvolvedor
que escreve código hoje é o humano que manterá esse código amanhã. Suas
decisões técnicas constrangem sua própria experiência futura.

Essa dimensão é frequentemente subestimada porque o desenvolvedor, no
momento da decisão, se percebe como agente (quem escolhe), não como
paciente (quem será constrangido). A mesma pessoa ocupa os dois papéis,
mas em momentos distintos — e o segundo momento é sistematicamente
subrepresentado no primeiro.

**Onde os praticantes concordam:** "dívida técnica" é o nome que dão a
uma das formas desse constrangimento — o reconhecimento de que decisões
passadas produziram constrangimentos sobre o trabalho presente.

**Onde divergem:** sobre o alcance. Para alguns, o constrangimento do
construtor-futuro é essencialmente o mesmo fenômeno que o
constrangimento do usuário — diferindo apenas na proximidade da decisão.
Para outros, são fenômenos distintos, porque o construtor tem poder de
revisar suas próprias decisões de um modo que o usuário não tem.

### 2.5. A negligência sem culpado

Em muitos casos, nenhuma pessoa individual decidiu ignorar a experiência
humana. O constrangimento emergiu da acumulação de decisões localmente
razoáveis — cada uma justificável no seu contexto, nenhuma pensada em
relação ao efeito cumulativo sobre quem usa.

O praticante reconhece esse padrão quando diz coisas como "ninguém
planejou que ficasse assim" ou "cada decisão fazia sentido na hora".
A ausência de intenção não elimina o constrangimento — apenas torna
difícil identificar onde intervir.

**Onde os praticantes concordam:** a negligência sistêmica é real e
não se resolve atribuindo culpa.

**Onde divergem:** sobre se a solução é estrutural (mudar o processo
para que o efeito cumulativo se torne visível) ou cultural (cultivar
uma mentalidade diferente em quem constrói). A maioria suspeita que é
ambas, mas não sabe articular a relação entre as duas.

### 2.6. A disputa sobre "bom o suficiente"

Na prática, nenhum sistema elimina completamente o constrangimento
sobre o humano. Todo projeto opera sob restrições de tempo, orçamento,
conhecimento e capacidade técnica. O fenômeno se agudiza quando os
praticantes precisam decidir onde o constrangimento é aceitável e onde
não é.

**Onde os praticantes concordam:** trade-offs são inevitáveis.

**Onde divergem:** sobre quem deveria arbitrar esses trade-offs, sobre
quais dimensões da experiência humana são negociáveis, e sobre se a
própria pergunta "é bom o suficiente?" deveria ser respondida por quem
constrói, por quem usa, ou por alguma forma de mediação entre ambos.

**Onde hesitam:** na relação entre custo econômico e constrangimento
humano. A maioria dos praticantes sente que "não temos tempo" é às
vezes uma razão legítima e às vezes uma desculpa — mas a fronteira
entre as duas é difícil de articular com precisão.

### 2.7. O gradiente de competência

A intensidade do fenômeno varia de forma observável conforme o perfil
de quem constrói. Quando quem programa é também alguém com formação
ampla em design — entendido aqui não como disciplina estética, mas como
a competência de antecipar experiência, organizar interação, gerir
complexidade para quem usa — a tensão se atenua. Essa pessoa carrega
internamente os dois vocabulários (o técnico e o experiencial) e opera
com menos distância entre decisão e consequência.

No extremo oposto, quando quem programa não tem qualquer formação ou
sensibilidade para a experiência de quem vai usar — nem para
usabilidade, nem para organização de informação, nem para antecipar o
efeito de uma escolha técnica sobre quem interage com o resultado — a
tensão atinge sua forma mais aguda. As decisões técnicas são tomadas
inteiramente dentro do vocabulário técnico, e o constrangimento sobre o
humano que usa é produzido sem sequer ser percebido como
constrangimento.

Em times, a intensidade é pendular. Quando há conflito entre quem
projeta a experiência (designers, product managers, pesquisadores de
UX) e quem implementa, a resolução depende de para qual lado a
gerência inclina. Se a gerência prioriza sistematicamente o time de
implementação, o fenômeno se agudiza — as decisões técnicas absorvem o
que deveria ser tratado como constrangimento negociável. Se prioriza o
time de design, a tensão diminui naquela dimensão, mas pode se
deslocar: o constrangimento sobre o desenvolvedor (prazos
impraticáveis, especificações que ignoram limitações técnicas reais)
aumenta. O pêndulo não resolve a tensão — desloca-a.

**Onde os praticantes concordam:** perfil e competência de quem
constrói afetam a qualidade da experiência resultante. Isso é tratado
como óbvio.

**Onde divergem:** sobre se a solução é formar desenvolvedores com
competências mais amplas, ou separar explicitamente os papéis e criar
processos de mediação entre eles. A segunda posição é, historicamente,
o padrão estabelecido — a divisão entre quem projeta a experiência e
quem implementa é a resposta organizacional dominante ao problema. Cada
posição implica uma visão diferente sobre onde reside a causa do
constrangimento — na pessoa ou na estrutura.

A própria separação de papéis, porém, pode ter um efeito colateral
observável: ao institucionalizar que "design é responsabilidade de
outra pessoa", a divisão libera o desenvolvedor de tratar a experiência
humana como parte do seu trabalho. Esse efeito persiste mesmo quando a
estrutura organizacional desaparece. Desenvolvedores que constroem
software sozinhos — projetos pessoais, indie, freelance — frequentemente
operam com zero consideração de design, não por decisão deliberada, mas
porque foram formados e trabalharam em contextos onde essa competência
pertencia a outro papel. A separação de papéis, criada para mitigar a
tensão, pode ter consolidado a mentalidade que a produz.

### 2.8. A delegação sem aquisição

Uma manifestação recente e observável: desenvolvedores que delegam
decisões de design a ferramentas de inteligência artificial em vez de
desenvolverem eles próprios a competência de projetar experiência. A IA
produz interfaces, organiza informação, sugere fluxos — e o
desenvolvedor aceita o resultado sem critério próprio para avaliá-lo,
porque o critério pertence a uma competência que nunca adquiriu.

Fenômeno adjacente e estruturalmente semelhante: desenvolvedores que
aplicam processos de engenharia de software (sprints, tickets, CI/CD,
cobertura de testes) à construção de produtos, como se o processo de
engenharia fosse suficiente para produzir um bom produto. O processo de
engenharia responde "está correto?", "está testado?", "está entregue?"
— mas não responde "serve a quem usa?", "faz sentido?", "resolve o
problema certo?". Essas últimas perguntas pertencem ao design de
produto, uma competência distinta que não é suprida pelo rigor
processual da engenharia.

**Onde os praticantes concordam:** ferramentas (incluindo IA) podem
acelerar trabalho de design. Processos de engenharia são necessários.

**Onde divergem:** sobre se delegar design a uma ferramenta sem ter
critério próprio é produtivo ou perigoso. Sobre se processos de
engenharia são suficientes para construir bons produtos ou se há uma
lacuna que só competência de design preenche.

**Onde hesitam:** sobre se a resistência a aprender design é preguiça,
identidade profissional ("não sou designer"), ou consequência da mesma
separação de papéis que tornou a competência "de outra pessoa".

### 2.9. A experiência do construtor como preocupação tardia (DX)

A noção de que a experiência de quem constrói software merece atenção
deliberada — frequentemente nomeada "Developer Experience" ou DX — é
recente na história da engenharia de software. Durante décadas, o foco
esteve na experiência de quem usa o produto final; a experiência de
quem programa era tratada como condição de trabalho, não como dimensão
de design.

O surgimento tardio de DX como preocupação explícita é, ele próprio,
um sintoma do fenômeno: a tensão entre decisões técnicas e experiência
humana existia para o construtor desde sempre, mas não era nomeada
como problema — era aceita como parte inevitável do ofício. Só quando
a acumulação de constrangimentos sobre o desenvolvedor começou a
produzir efeitos mensuráveis (rotatividade, erros, lentidão,
resistência a mudança) é que a experiência do construtor passou a ser
tratada como algo que pode ser melhorado por decisões de design.

**Onde os praticantes concordam:** DX importa e melhora produtividade.

**Onde hesitam:** sobre se DX é o mesmo fenômeno que UX aplicado a
outro público, ou se é algo estruturalmente diferente. A linguagem
("experiência do desenvolvedor") sugere simetria com "experiência do
usuário", mas muitos praticantes sentem que a relação do desenvolvedor
com o código não é do mesmo tipo que a relação do usuário com o
produto — sem conseguir precisar a diferença.

### 2.10. O constrangimento que não se percebe como constrangimento

Em muitos contextos, a assimetria entre decisão técnica e experiência
humana não é percebida como problema — nem mesmo como escolha. É o modo
padrão de operar. O desenvolvedor não decide ignorar a experiência de
quem usa; ele simplesmente não a inclui no espaço de consideração
porque o enquadramento habitual do trabalho não a apresenta como
variável relevante.

Isso é distinto da negligência descrita em §2.5. Lá, decisões
localmente razoáveis se acumulam sem intenção de prejudicar. Aqui, o
próprio enquadramento do que conta como "decisão de engenharia" exclui
a experiência humana do campo de visão. O desenvolvedor não falhou em
considerar algo que sabia ser relevante — operou dentro de uma moldura
que não apresenta esse algo como parte do trabalho.

A moldura não é idiossincrática. Está presente na formação (cursos de
engenharia de software que tratam experiência humana como disciplina
separada), nas ferramentas (que medem correção funcional mas não
adequação experiencial), nas métricas de sucesso (cobertura de testes,
tempo de build, velocidade de entrega — raramente satisfação de quem
usa ou de quem mantém), e na estrutura organizacional (times separados
para "produto" e "engenharia", como se fossem domínios independentes).

**Onde os praticantes concordam:** quando o constrangimento é apontado
retroativamente, a maioria reconhece que ele existia e que não foi
percebido.

**Onde divergem:** sobre o status desses casos. Para alguns, a maioria
das decisões que constrangem a experiência humana é genuinamente
justificável — restrições reais de tempo, orçamento e conhecimento
impõem limites que não são negligência. Para outros, a maioria é
produzida por essa moldura estrutural, e a justificativa por restrições
é frequentemente racionalização posterior — o constrangimento não foi
escolhido após pesar alternativas, mas produzido por um modo de
operar que nem sequer apresentou alternativas. A proporção entre os
dois casos é disputada, e a disputa é difícil de resolver porque quem
opera dentro da moldura não tem acesso fácil à pergunta "eu teria
decidido diferente se a experiência humana estivesse no meu campo de
visão?".

### 2.11. A presunção de escala

Muitos praticantes assumem que mitigar a tensão entre decisão técnica e
experiência humana requer recursos que só grandes organizações possuem:
times dedicados de design, pesquisadores de UX, product managers,
ciclos longos de iteração, orçamento para prototipação e teste com
usuários.

Essa presunção tem consequências práticas. Em equipes pequenas, projetos
individuais ou contextos com recursos limitados, a mitigação do
constrangimento é frequentemente descartada antes de ser tentada — não
porque foi avaliada como impraticável naquele contexto, mas porque é
percebida como pertencente a uma categoria de preocupação que "não é
para nós".

**Onde os praticantes concordam:** grandes organizações têm mais
capacidade de investir na experiência humana.

**Onde divergem:** sobre se a mitigação é fundamentalmente uma questão
de recurso ou de atenção. Para alguns, o constrangimento só é
redutível com investimento proporcional — pesquisa, testes,
especialistas. Para outros, a maior parte do constrangimento evitável
é produzido não por falta de recurso, mas por falta de enquadramento
— e mudar o enquadramento não requer orçamento adicional, requer uma
forma diferente de tomar decisões que já estão sendo tomadas.

**Onde hesitam:** sobre se é possível mitigar a tensão sem
especialistas. A maioria sente que "pensar no usuário" é algo que
qualquer desenvolvedor pode fazer, mas também sente que o resultado
de um desenvolvedor "pensando no usuário" é sistematicamente inferior
ao de um designer treinado — e não sabe como reconciliar as duas
intuições.

---

## 3. Fenômenos subsidiários

Os fenômenos abaixo não são o explanandum em si, mas aparecem
recorrentemente quando o fenômeno primário se manifesta. Eles são
subsidiários — dependem do fenômeno primário para existir, mas o
fenômeno primário não depende deles.

### 3.1. A questão do "uso"

Os praticantes falam constantemente em "usar" — usar uma biblioteca,
usar uma API, usar o sistema, usar o código de outra pessoa. O termo é
ubíquo, mas o que ele nomeia varia amplamente: às vezes é consumo
passivo (chamar uma função), às vezes é interação ativa (operar uma
interface), às vezes é dependência estrutural (herdar de uma classe).

O que os praticantes parecem reconhecer com a palavra "uso" é uma
relação em que uma parte depende de outra e essa dependência constrange
o que a parte dependente pode fazer. Mas a palavra não distingue entre
os tipos de dependência nem entre os graus de constrangimento.

**Onde hesitam:** sobre se "usar" é a mesma coisa quando o sujeito é
um humano e quando o sujeito é um módulo de código. A linguagem
cotidiana os trata como instâncias do mesmo verbo; a intuição de muitos
praticantes resiste a essa equiparação sem conseguir articular por quê.

### 3.2. A questão da "forma"

Quando um praticante diz que uma API "tem uma forma ruim" ou que a
"forma do componente não serve", está apontando para algo que não é
exatamente funcionalidade (pode funcionar corretamente) nem exatamente
estética (não é questão de beleza). "Forma" parece nomear a estrutura
de constrangimentos que uma decisão técnica impõe sobre quem interage
com o resultado.

**Onde hesitam:** sobre se "forma" é objetiva (mensurável por métricas
de usabilidade, acoplamento, coesão) ou dependente de contexto (a
mesma forma pode ser boa para quem constrói e ruim para quem usa, ou
boa para um tipo de uso e ruim para outro). A maioria aceita que é
contextual, mas isso torna difícil argumentar que uma forma é
"errada" — e muitos praticantes sentem que em certos casos a forma é
genuinamente errada, não apenas inadequada para um contexto particular.

---

## 4. Mapa das hesitações

As hesitações dos praticantes são sintomas de fronteiras conceituais
não resolvidas. Este mapa não propõe resoluções — registra onde a
prática emperra.

| Hesitação | O que o praticante sente | O que não consegue articular |
|---|---|---|
| **Complexidade inerente vs. imposta** | "Nem toda complexidade é culpa nossa, mas parte é" | O critério que separa uma da outra |
| **Legítimo vs. desculpa** | "Às vezes 'não dá tempo' é real, às vezes é preguiça" | A fronteira entre restrição genuína e acomodação |
| **Mesmo fenômeno vs. fenômenos distintos** | "O dev sofre com código ruim assim como o user sofre com UX ruim" | Se a estrutura do constrangimento é a mesma nos dois casos |
| **Uso humano vs. uso técnico** | "Um humano 'usa' um app; um módulo 'usa' outro módulo" | Se é o mesmo tipo de relação ou apenas a mesma palavra |
| **Forma boa vs. forma adequada** | "Essa API é objetivamente ruim" vs. "depende do contexto" | O status normativo de juízos sobre forma |
| **Processo vs. cultura** | "Precisamos de um processo melhor" vs. "precisamos pensar diferente" | A relação entre estrutura e disposição |
| **Quem arbitra** | "Alguém precisa decidir o que é aceitável" | Por que o direito de arbitrar não é auto-evidente |
| **Pessoa vs. estrutura** | "Precisamos de devs com visão mais ampla" vs. "precisamos de processos que compensem" | Se o constrangimento reside no perfil de quem constrói ou na organização do trabalho |
| **Moldura invisível** | "Eu não ignorei — simplesmente não apareceu como variável" | Se a maioria dos constrangimentos é escolhida ou produzida por um enquadramento que não apresenta alternativas |
| **Escala como pré-requisito** | "Isso é coisa de empresa grande" | Se mitigar a tensão é questão de recurso ou de atenção — e se a distinção é real |
| **DX como UX** | "Experiência do dev é experiência do usuário, só que do outro lado" | Se a relação do construtor com o código é do mesmo tipo que a relação do usuário com o produto |
| **Delegação vs. aquisição** | "A IA faz o design pra mim" / "O processo de eng já cobre" | Se delegar ou processar substitui a competência de projetar experiência |
| **Herança da separação** | "Nunca foi meu trabalho pensar nisso" | Se a separação de papéis resolveu o problema ou consolidou a mentalidade que o produz |

---

## 5. O que este documento não faz

1. **Não explica o fenômeno.** Não oferece causas, mecanismos ou
   teorias. A explicação é trabalho de etapas posteriores.

2. **Não propõe solução.** Não sugere que o fenômeno deva ser resolvido
   de uma forma particular, nem que seja resolvível em geral.

3. **Não define termos.** "Uso", "forma", "constrangimento" são usados
   no sentido ordinário — o sentido que um praticante reconheceria sem
   definição técnica. Definições precisas são trabalho de etapas
   posteriores.

4. **Não hierarquiza as manifestações.** As manifestações em §2 não
   estão em ordem de importância. A hierarquização depende de uma teoria
   sobre o que é mais fundamental — e este documento é anterior a
   qualquer teoria.
