# STEP 2 — Invariantes do Componente Negativo

> **Insumos.** `Princípio Central — Versão Refinada.md` §2 (N1–N6); `Etapa 1 Consolidada.md` §6.7–§6.8.
> **Método.** Abstração por invariância (Nozick, *Invariances*, cap. 2): dados N1–N6 variando em conteúdo concreto, identificar a propriedade constante quando os detalhes mudam.
> **Pergunta condutora.** Para cada N: *de onde vem a força normativa que o agente invoca ao usar esse fator como razão derrotadora?*

---

## 1. Tabela de fontes de força normativa

| N | Motivo | Justificativa enunciada pelo agente | Fonte da força normativa invocada |
|---|---|---|---|
| N1 | M01 — default de tooling | "A ferramenta produziu essa forma; não foi decisão minha" | A ferramenta — escolhida e configurada pelo decisor — produz um default que o decisor não precisou de examinar ou substituir |
| N2 | M03 — falsa dicotomia | "Minha preocupação legítima X é incompatível com servir o afetado" | A exclusividade da dicotomia — apresentada como restrição real, mas derivada do enquadramento do decisor dentro da implementação, onde apenas certas soluções são visíveis |
| N3 | M04 — encapsulamento nominal | "Isso é um detalhe encapsulado; o critério de encapsulamento decide a forma" | O critério de encapsulamento — uma decisão arquitetural do decisor, operando segundo seus objetivos de organização interna |
| N4 | M06 — fluxo de controle como "natural" | "Essa ordem/nomenclatura é a natural; segue a estrutura do sistema" | O sentido de "naturalidade" do decisor — formado pela sua posição dentro da implementação, familiaridade com o modelo de dados e a sequência de processamento |
| N5 | M10 — consistência/atomicidade sem transação apontável | "Consistência/atomicidade exige esse agrupamento" | Um princípio técnico (consistência, atomicidade) que opera no nível do modelo de dados interno, não no nível das operações do afetado sobre a superfície |
| N6 | M11 — compartilhamento interno como fusão de superfícies | "Já temos essa estrutura; o afetado pode usar o que temos" | A economia de reutilização — benefício que o decisor internaliza ao não projetar uma superfície dedicada |

---

## 2. Identificação da invariante

### 2.1. O que varia entre N1–N6

O conteúdo concreto é heterogêneo: tool defaults, dicotomias falsas, critérios de encapsulamento, naturalidade percebida, princípios de consistência, reutilização interna. Cada N invoca um tipo diferente de fator.

### 2.2. O que permanece constante

Em todos os seis casos, o fator invocado como razão derrotadora **tem sua força normativa enraizada exclusivamente na relação do decisor com a implementação**:

- N1: na escolha e configuração de ferramenta pelo decisor
- N2: no enquadramento do decisor de sua própria preocupação como excludente — perspectiva disponível somente de dentro
- N3: na decisão arquitetural do decisor sobre o critério de encapsulamento
- N4: na perspectiva interna do decisor sobre o que é "natural" no sistema
- N5: no princípio técnico que governa o modelo de dados interno do decisor
- N6: na conveniência operacional do decisor ao reutilizar estrutura interna

Em nenhum dos seis casos a força invocada tem qualquer raiz na relação do afetado com a superfície. O afetado é deslocado da posição de fundamento normativo pela posição do decisor dentro da implementação.

Essa é a **invariante estrutural**: a posição do decisor *dentro* da implementação — suas escolhas, sua perspectiva, seus princípios técnicos operando internamente, sua conveniência — gera a força que o agente invoca, sem apoio na relação do afetado com a superfície.

### 2.3. Assimetria estrutural subjacente

A invariante emerge de uma assimetria de posição:

- O **decisor** está *dentro* da implementação: vê o sistema a partir de suas estruturas internas, ferramentas, modelos de dados, dependências.
- O **afetado** está *fora* da implementação: interage apenas com a superfície; a forma interna é, por definição, invisível a ele (cf. AN-3 da Versão Refinada).

Quando o decisor invoca a sua perspectiva interna como autoridade sobre a forma da superfície, ele desloca a sede da autoridade normativa de onde ela deveria residir (a relação do afetado com a superfície) para onde ela não deveria residir (a sua relação com o interior). Esse deslocamento é o que todos os N têm em comum.

---

## 3. Proposição candidata

> **Não conta como razão derrotadora da obrigação expressa em P0+ todo fator cuja força normativa derive exclusivamente da relação do decisor com a implementação — suas escolhas de ferramenta, decisões arquiteturais, perspectiva técnica interna, princípios técnicos operando no nível interno, ou conveniência operacional — sem qualquer fundamento na relação do afetado com a superfície.**

---

## 4. Teste de subsunção da proposição candidata contra N1–N6

| N | O fator subsume sob a proposição candidata? | Demonstração |
|---|---|---|
| N1 | **Sim, sem resíduo** | A ferramenta e seu default são escolha e responsabilidade do decisor. A força "a ferramenta decidiu" deriva inteiramente dessa relação do decisor com sua ferramenta; nenhuma parte dela apoia-se em algo que o afetado possa invocar sobre a superfície. |
| N2 | **Sim, sem resíduo** | A exclusividade da dicotomia é uma representação do decisor sobre o espaço de alternativas — disponível somente para quem está dentro. A existência de alternativas que atendem à preocupação legítima *e* à obrigação P0+ desfaz a força invocada. O que resta como "força" é apenas a perspectiva interna do decisor, não uma restrição genuína sobre o afetado. *(Nota: a preocupação em si pode ser legítima; o que subsume é apenas a parte que invoca a exclusividade.)* |
| N3 | **Sim, sem resíduo** | O critério de encapsulamento é uma decisão arquitetural do decisor. Sua força como razão normativa sobre a forma exposta deriva inteiramente dessa decisão interna. O afetado não vê a estrutura interna, logo não tem relação normativa com o critério de encapsulamento. |
| N4 | **Sim, sem resíduo** | "Natural" é indexado à perspectiva do decisor como alguém que habita o interior do sistema. A sequência de processamento, a nomenclatura do modelo de dados, a ordem das operações — esses são fatos sobre a implementação, não fatos sobre o que é natural para o afetado na superfície. |
| N5 | **Sim, sem resíduo** | Consistência e atomicidade são princípios técnicos que operam no modelo de dados ou de execução interno. Sem uma transação apontável — uma operação reconhecível pelo afetado que vincule causalmente os elementos — o princípio não tem fundamento na relação do afetado com a superfície. A força invocada é inteiramente interna. |
| N6 | **Sim, sem resíduo** | A economia de reutilização é capturada pelo decisor; o custo da ausência de uma superfície dedicada é externalizado para o afetado. A força normativa vem da conveniência operacional interna do decisor. |

**Resultado:** todos os seis subsumem sob a proposição candidata sem resíduo.

---

## 5. Unicidade ou pluralidade de invariantes

### 5.1. Hipótese de pluralidade

Poder-se-ia argumentar que N2 é diferente dos demais: enquanto N1, N3, N4, N5, N6 são casos em que o fator invoca diretamente a perspectiva interna, N2 envolve uma *representação epistêmica* sobre o espaço de alternativas (a dicotomia falsa).

### 5.2. Por que a unicidade se sustenta

A distinção não justifica uma segunda invariante porque o que desqualifica N2 como razão derrotadora é *também* sua ancoragem exclusiva na perspectiva interna do decisor: a dicotomia parece real somente de dentro. Se o decisor adotasse a perspectiva do afetado — que avalia a superfície pelo que ela exige, não pelo que a implementação permite — a exclusividade colapsaria imediatamente. O mecanismo de desarmamento é o mesmo dos outros N: mostrar que a força invocada não tem fundamento na relação do afetado com a superfície.

A diferença entre N2 e os demais é de *modo de manifestação* (argumentativa vs. direta), não de *natureza da invariante*.

### 5.3. Conclusão

**Uma única invariante.** A proposição candidata é suficiente para subsumir N1–N6. A pluralidade de modos de manifestação — tooling, encapsulamento, naturalidade, princípio técnico, reutilização, falsa restrição — pertence ao Step 3 (conceituação das categorias), não à identificação da invariante.

---

## 6. Nota para o Step 3

A invariante é estruturalmente simples: *posição do decisor dentro da implementação vs. posição do afetado fora dela*. Mas ela tem sub-espécies estruturais que o Step 3 precisará articular:

- **Externalidade de custo:** o decisor captura benefício (conveniência, economia, facilidade) e externaliza custo (adaptação imposta, ônus de interação) — N1, N3, N5, N6
- **Perspectiva indexada:** o que é "natural", "óbvio" ou "obrigatório" do ponto de vista interno não o é do ponto de vista externo — N4, N2 (parcialmente)
- **Falsa restrição:** a representação do espaço de alternativas é distorcida pela perspectiva interna — N2 (dominantemente)

Essas sub-espécies não são invariantes independentes — são modos pelos quais a invariante única se manifesta. O trabalho do Step 3 é defini-las por gênero e diferença para que o princípio possa operá-las categoricamente.

---

## 7. Exit

**Invariante identificada e testada.** Uma única invariante: a força normativa do fator deriva exclusivamente da relação do decisor com a implementação, sem fundamento na relação do afetado com a superfície. Todos os seis N subsumem sem resíduo. A pluralidade de manifestações estruturais (externalidade, perspectiva indexada, falsa restrição) é insumo para o Step 3.
