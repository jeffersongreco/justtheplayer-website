# STEP 3 — Conceituação das Categorias do Componente Negativo

> **Insumo.** `02-invariantes-negativo.md` — invariante única + três sub-espécies estruturais identificadas.
> **Método.** Definição por gênero e diferença (Aristóteles, *Tópicos* I.5) + verificação das quatro condições de Carnap (§1.1 do Plano) para cada explicatum.
> **Objetivo.** Substituir os explicanda N1–N6 por explicata categóricos: conceitos definidos com precisão, aplicáveis a casos ausentes do catálogo, que operam no nível em que a filosofia moral e a teoria da ação já possuem vocabulário reconhecível.

---

## 1. Estrutura da seção

O STEP 2 identificou três sub-espécies estruturais da invariante:
- (i) **Externalidade de custo** — N1, N3, N5, N6
- (ii) **Perspectiva indexada** — N4, N2 (parcialmente)
- (iii) **Falsa restrição** — N2 (dominantemente)

A primeira decisão deste step é determinar se (ii) e (iii) justificam categorias separadas ou convergem sob um único conceito.

### 1.1. Convergência de (ii) e (iii): Ilusão de Neutralidade Técnica

**Argumento de unificação.** Em N4, o decisor apresenta a "naturalidade" do fluxo de controle como propriedade objetiva da superfície, quando ela é indexada à sua perspectiva interna. Em N2, o decisor apresenta a "exclusividade" da dicotomia como restrição objetiva do espaço de alternativas, quando ela é indexada à sua perspectiva interna. O mecanismo é idêntico: um julgamento formado de dentro é apresentado como se valesse de fora.

A diferença é de objeto do julgamento — *uma propriedade da superfície* (N4) vs. *uma propriedade do espaço de alternativas* (N2) — não de tipo de ilusão. Ambos são casos em que o decisor não distingue entre "é assim de dentro" e "é assim de fora".

**Conclusão:** (ii) e (iii) convergem sob um único conceito — **Ilusão de Neutralidade Técnica** — com duas formas de manifestação reconhecidas.

**Estrutura resultante: dois conceitos categóricos.**

---

## 2. Conceito C1 — Externalidade Decisor→Afetado

### 2.1. Definição por gênero e diferença

**Gênero:** Distribuição assimétrica de custos e benefícios entre dois agentes resultante de uma decisão unilateral de um deles sobre uma superfície partilhada.

**Diferença:** O agente que decide (o decisor) captura o benefício — conveniência operacional, economia de esforço, adequação a ferramentas ou princípios técnicos de sua escolha — enquanto o agente que usa (o afetado) arca com o custo: interagir com uma superfície cujas propriedades foram determinadas pela relação do decisor com a implementação, não pela relação do afetado com a superfície.

### 2.2. Definição formal

> **Externalidade decisor→afetado:** Um fator F invoca externalidade iff:
>
> (a) o decisor captura um benefício ao adotar a forma F da superfície — benefício definido relativamente à sua posição dentro da implementação (conveniência, economia, coerência interna, adequação a ferramenta);
>
> (b) o afetado arca com o custo correspondente — custo definido relativamente à sua posição fora da implementação (superfície que não mapeia suas operações, esforço de adaptação, perda de recognoscibilidade);
>
> (c) a força normativa que F reivindica como razão derrotadora deriva da distribuição (a)+(b) — não de uma exigência da relação do afetado com a superfície.

*Condição (c) é a condição de relevância:* não basta que haja assimetria de posição entre decisor e afetado; a assimetria precisa ser a fonte da força reivindicada pelo fator.

### 2.3. Verificação das condições de Carnap

| Condição | Verificação |
|---|---|
| **Similaridade** | O conceito é reconhecivelmente "sobre a mesma coisa" que N1, N3, N5, N6: em todos os casos, o decisor obtém algo (conveniência, coerência, economia) e o afetado paga o preço correspondente (superfície não projetada para suas operações). ✓ |
| **Exatidão** | A definição tripartite (a+b+c) é operacionalizável: dado um fator F e um caso, o leitor pode identificar (a) qual é o benefício capturado, (b) qual é o custo externalizado, e (c) se a força de F deriva dessa assimetria ou de outro fundamento. ✓ |
| **Fecundidade** | Permite aplicação a casos fora do catálogo: o leitor não precisa de M01–M14 para reconhecer que um fator externaliza custo. Ver §2.5. ✓ |
| **Simplicidade** | A definição usa um conceito estabelecido na filosofia moral e economia (externalidade/moral hazard); o refinamento específico (→ interação com superfície de uso) é o mínimo necessário para precisão. ✓ |

### 2.4. Instâncias ilustrativas do catálogo

**N1 — M01 (default de tooling):**
Benefício capturado: o decisor não precisa revisar ou configurar o output da ferramenta. Custo externalizado: o afetado interage com uma superfície cuja forma foi ditada pelo default da ferramenta, não pelas suas operações. Condição (c): a força invocada ("a ferramenta produziu assim") deriva da conveniência de não intervir — externalidade direta.

**N3 — M04 (encapsulamento nominal):**
Benefício capturado: o decisor mantém a coerência do critério de encapsulamento que ele estabeleceu. Custo externalizado: a fronteira que o afetado encontra na superfície serve à organização interna do decisor, não às operações do afetado. Condição (c): a força invocada ("encapsulamento exige isso") deriva do benefício de preservar a arquitetura interna — externalidade.

**N5 — M10 (consistência sem transação apontável):**
Benefício capturado: o decisor preserva a integridade do modelo de dados interno. Custo externalizado: o afetado opera sobre uma superfície agrupada segundo consistência do modelo, não segundo as transações reconhecíveis nas suas operações. Condição (c): a força invocada ("consistência exige") deriva de um princípio técnico interno sem correspondência nas operações do afetado — externalidade.

**N6 — M11 (compartilhamento interno como fusão de superfícies):**
Benefício capturado: o decisor economiza o esforço de projetar uma superfície dedicada. Custo externalizado: o afetado usa uma superfície projetada para servir aos propósitos internos do decisor, não aos seus. Condição (c): a força invocada ("já temos isso") é literalmente a economia do decisor — externalidade direta.

### 2.5. Instância hipotética (fora do catálogo)

**Caso: Códigos de erro de monitoramento como resposta pública de API.**
Uma equipe expõe no payload de erro da API os códigos internos do seu sistema de observabilidade (ex.: `ERR_DB_CONN_POOL_EXHAUSTED_07`) porque isso elimina uma camada de tradução e facilita o debugging interno.

- Benefício capturado (decisor): eliminação de trabalho de tradução + debugging mais direto na produção.
- Custo externalizado (afetado — consumidor da API): recebe um código sem semântica para o seu domínio; precisa consultar documentação interna do fornecedor para tratá-lo.
- Condição (c): a força do fator ("esses são os erros reais do sistema") deriva da conveniência interna de debugging, não de qualquer exigência da relação do consumidor com a API.

→ O conceito se aplica diretamente, sem consulta ao catálogo.

---

## 3. Conceito C2 — Ilusão de Neutralidade Técnica

### 3.1. Definição por gênero e diferença

**Gênero:** Apresentação de um julgamento formado a partir de uma posição específica como se fosse uma propriedade objetiva, necessária ou perspectiva-neutra do sistema ou do espaço de alternativas.

**Diferença:** O julgamento é formado a partir da posição do decisor *dentro* da implementação — onde a estrutura interna, o modelo de dados, as dependências e as ferramentas são visíveis e familiares — e não transfere para a posição do afetado *fora* da implementação, de onde apenas a superfície é acessível. A apresentação como objetiva oculta essa indexação de perspectiva.

### 3.2. Definição formal

> **Ilusão de neutralidade técnica:** Um fator F envolve ilusão de neutralidade iff:
>
> (a) o decisor apresenta F como instância de uma propriedade objetiva, necessária ou perspectiva-neutra — uma propriedade que deveria valer independentemente de quem observa;
>
> (b) a propriedade invocada é, na realidade, indexada à posição do decisor dentro da implementação — tal que um observador na posição do afetado, sem acesso ao interior, não chegaria ao mesmo julgamento sobre a superfície;
>
> (c) a força normativa que F reivindica como razão derrotadora depende da propriedade ser objetiva; se a indexação for reconhecida, a força colapsa.

### 3.3. Duas formas de manifestação

A ilusão pode operar sobre dois tipos de objeto:

**Forma de propriedade** *(N4)*: "Esta propriedade da superfície é X" (natural, lógica, óbvia).
O predicado X é indexado: "natural" significa natural *para quem processa internamente*, não para quem usa a superfície. O afetado experimenta arbitrariedade onde o decisor experimenta necessidade.

**Forma de restrição** *(N2)*: "Não existe alternativa que satisfaça minha preocupação E a obrigação P0+".
A exclusividade da dicotomia é indexada: de dentro da implementação, a solução que atende à preocupação do decisor *e* à obrigação é invisível (não está entre as alternativas que o decisor considera). De fora — da perspectiva do afetado, ou de um observador com amplitude posicional — alternativas existem.

### 3.4. Verificação das condições de Carnap

| Condição | Verificação |
|---|---|
| **Similaridade** | O conceito é reconhecivelmente "sobre a mesma coisa" que N4 e N2: em ambos, o decisor trata como objetivo algo que é perspectiva-indexado. ✓ |
| **Exatidão** | A condição de aplicação é testável: dado F, o leitor pergunta — "um observador na posição do afetado, sem acesso ao interior, chegaria ao mesmo julgamento?" Se não, a ilusão está presente. ✓ |
| **Fecundidade** | Permite aplicação a casos não visíveis no catálogo: qualquer caso em que o decisor apresente como neutro ou necessário um julgamento formado de dentro cai sob o conceito. Ver §3.6. ✓ |
| **Simplicidade** | A distinção de "duas formas" é necessária para cobrir N4 e N2 sem artificialidade — e é suficiente. Não há sobrespecificação. ✓ |

### 3.5. Instâncias ilustrativas do catálogo

**N4 — M06 (fluxo de controle como "natural") — Forma de propriedade:**
O decisor apresenta a sequência de operações (ou a nomenclatura do modelo de dados) como "a ordem lógica". A lógica invocada é a do pipeline interno de processamento — visível de dentro, opaca de fora. O afetado experimenta uma sequência que serve à máquina, não à sua tarefa. A "naturalidade" colapsa ao sair do interior.

**N2 — M03 (falsa dicotomia) — Forma de restrição:**
O decisor apresenta "atendo minha preocupação OU sirvo o afetado" como dilema necessário. A exclusividade é produto da perspectiva interna, que só vê soluções dentro das restrições que o decisor já assumiu. Cláusula-A1 (exame formal de coexistência) opera precisamente sobre isso: antes de aceitar a dicotomia como necessária, o decisor deve demonstrar que nenhuma alternativa coexiste — demonstração que, quando feita, geralmente revela a alternativa.

### 3.6. Instância hipotética (fora do catálogo)

**Caso: Ordem de argumentos "natural" em API de processamento de dados.**
Uma biblioteca de transformação de dados expõe funções com assinatura `(schema, options, data)`, porque "o schema define como interpretar os dados, então vem primeiro". A equipe apresenta essa ordem como "a lógica correta".

Da perspectiva do decisor: faz sentido — schema precede a interpretação. Da perspectiva do consumidor da biblioteca (afetado): ele tem `data`, quer aplicar `schema`, `options` são acessórias. A ordem "natural" é `(data, schema, options)` ou `(data, options?)` com schema inferido.

A "lógica" invocada é indexada ao pipeline interno de processamento, não ao fluxo de trabalho do consumidor. Ilusão de neutralidade técnica — forma de propriedade — sem consulta ao catálogo.

---

## 4. Relação entre C1 e C2: sobreposição legítima

C1 e C2 não são mutuamente exclusivos. Um fator pode envolver simultaneamente:

- **Externalidade** (o decisor captura benefício, o afetado arca com custo) e
- **Ilusão de neutralidade** (a externalidade é apresentada como necessidade objetiva, não como escolha do decisor).

**N4 como caso de sobreposição:** O decisor captura o benefício de não redesenhar a interface (externalidade — C1) e apresenta a forma resultante como "natural" (ilusão — C2). A sobreposição não é um problema para o princípio: um fator que invoca qualquer um dos mecanismos falha como razão derrotadora. A coexistência é informação sobre a estrutura do caso, não uma indeterminação do princípio.

---

## 5. Síntese: os dois conceitos categóricos

| Conceito | Pergunta de identificação | N que subsume |
|---|---|---|
| **C1 — Externalidade decisor→afetado** | "Quem captura o benefício da forma adotada e quem arca com o custo de interagir com ela?" | N1, N3, N5, N6 (e N4 parcialmente) |
| **C2 — Ilusão de neutralidade técnica** | "O decisor está apresentando como objetiva/necessária uma propriedade que só é visível de dentro?" | N2, N4 (e N5 parcialmente) |

**Cobertura:** Todo N subsume sob C1 ou C2 (ou ambos) sem resíduo.

---

## 6. Formulação categórica do componente negativo (rascunho para Step 5)

Com C1 e C2 definidos, o componente negativo pode ser formulado categoricamente:

> **Não constituem razão derrotadora da obrigação expressa em P0+:**
>
> **(C1)** Fatores cujo único fundamento normativo é uma externalidade decisor→afetado: o decisor captura o benefício da forma adotada — seja por conveniência operacional, economia de esforço, adequação a ferramentas de sua escolha ou coerência de princípios técnicos operando no nível interno — enquanto o afetado arca com o custo de interagir com uma superfície não projetada segundo as suas operações.
>
> **(C2)** Fatores cujo único fundamento normativo é uma ilusão de neutralidade técnica: o decisor apresenta como propriedade objetiva, necessária ou perspectiva-neutra da superfície ou do espaço de alternativas um julgamento indexado à sua posição dentro da implementação — julgamento que, se examinado da posição do afetado, não se sustenta como objetivo.

*Nota:* A formulação diz "único fundamento": se o fator tiver, além do mecanismo C1 ou C2, um fundamento na relação do afetado com a superfície, esse fundamento sobrevive e precisa ser avaliado separadamente. Os mecanismos C1/C2 são suficientes para desqualificar a parte do fator que deles depende; não desqualificam automaticamente componentes legítimos que possam coexistir no mesmo fator (cf. Cláusula-Q para casos mistos M05, M07 em P0).

---

## 7. Exit

**Dois conceitos categóricos definidos, testados e com instâncias ilustrativas:**

- **C1 — Externalidade decisor→afetado:** distribuição assimétrica onde o decisor captura benefício e o afetado arca com custo de interação. Subsume N1, N3, N5, N6 (e N4 parcialmente).
- **C2 — Ilusão de neutralidade técnica:** julgamento perspectiva-indexado apresentado como objetivo ou necessário. Subsume N2, N4 (e N5 parcialmente).

Todos os seis N1–N6 subsumem sob C1 ou C2 sem resíduo. As condições de Carnap são satisfeitas para ambos. A infraestrutura conceitual para o componente negativo está pronta para o Step 5 (montagem).

O Step 4 aplicará o mesmo método às cláusulas.
