# Princípio Central — Versão Categórica

> **Status.** P0' — versão categórica de P0. Extensão conservadora confirmada (STEP 5 + STEP 6).
> **Antecedente.** `Princípio Central — Versão Refinada.md` (P0).
> **Insumos de construção.** `01-` a `06-` nesta pasta; `Etapa 1 Consolidada.md` §6.7–§6.8; `Catálogo de Condições de Derrota e Racionalizações.md` §4.
> **Uso pretendido.** Documento autocontido. Um leitor instruído deve conseguir, com este documento e seu caso específico: (1) determinar se o princípio se aplica, (2) identificar qual componente ou cláusula governa, (3) determinar o que o princípio exige. O catálogo M01–M14 e os casos C01–C20 são instâncias ilustrativas que confirmam os conceitos; não são a fonte de sua definição nem são exaustivos.

---

## §1 — Infraestrutura Conceitual

Esta seção define os termos que o princípio usa. A precisão do princípio vem destas definições, não da enumeração de casos. Cada definição é por gênero e diferença.

### 1.1 Termos de base

**Superfície de uso.** A forma do artefato acessível à categoria de uso relevante — o conjunto de estruturas, nomes, comportamentos e estados que o afetado pode operar, interpretar ou integrar diretamente. A forma interna do artefato — que a categoria de uso não acessa diretamente — não é superfície. *(Etapa 1 §6.2–§6.4)*

**Afetado.** A categoria de uso humano que interage diretamente com a superfície em questão para realizar seus propósitos legítimos com o artefato. Em runtime: quem opera o produto. Em build-time: quem integra, consome ou mantém a superfície técnica. Ambos são afetados no sentido normativo relevante. *(Etapa 1 §6.5–§6.6)*

**Decisor.** Quem quer que tome decisões que afetam a forma da superfície — individual, equipe ou processo. O sujeito da obrigação. *(Etapa 1 §5.3)*

**Experiência de interação.** O perfil de exigências e facilidades que uma superfície impõe à categoria de uso na realização de seus propósitos legítimos. Suas dimensões incluem: capacidade (o afetado consegue realizar seu propósito?), compreensibilidade, esforço, previsibilidade, feedback, consistência, relevância. *(Etapa 1 §6.7)*

**Melhor possível.** Superlativo comparativo ao longo das dimensões da experiência de interação, dentro do conjunto de alternativas não excluídas por fatores fora do controle do decisor. *(Etapa 1 §6.8)*

**Critério de violação.** Uma alternativa factível superior preterida em favor de fator controlável pelo decisor. *(Etapa 1 §6.8)*

---

### 1.2 Conceitos do componente negativo

**C1 — Externalidade decisor→afetado**

*Gênero:* Distribuição assimétrica de custos e benefícios entre decisor e afetado resultante de decisão unilateral do decisor sobre a superfície.

*Diferença:* O decisor captura o benefício — conveniência operacional, economia de esforço, adequação a ferramentas de sua escolha, coerência de princípios técnicos operando no nível interno — enquanto o afetado arca com o custo de interagir com uma superfície não projetada segundo as suas operações.

*Condição de aplicação:* Um fator F é externalidade iff: (a) o decisor captura benefício ao adotar a forma F; (b) o afetado arca com o custo correspondente; (c) a força normativa que F reivindica como razão derrotadora deriva desta distribuição assimétrica — não de exigência da relação do afetado com a superfície.

*Nota sobre a condição (c):* O mero coexistir de benefício do decisor não é suficiente. C1 opera quando o benefício próprio é a força invocada. Se o decisor invoca uma razão diferente (ex.: indistinguibilidade funcional), C1 não dispara pela coexistência do benefício.

---

**C2 — Ilusão de neutralidade técnica**

*Gênero:* Apresentação de um julgamento formado a partir de uma posição específica como se fosse propriedade objetiva, necessária ou perspectiva-neutra do sistema ou do espaço de alternativas.

*Diferença:* O julgamento é formado a partir da posição do decisor *dentro* da implementação e não transfere para a posição do afetado *fora* dela — tal que um observador na posição do afetado, sem acesso ao interior, não chegaria ao mesmo julgamento sobre a superfície ou sobre as alternativas disponíveis.

*Duas formas de manifestação:*
- **Forma de propriedade:** "Esta propriedade da superfície (ordem, nome, estrutura) é a natural / lógica / óbvia." O predicado é indexado ao interior; o afetado experimenta arbitrariedade onde o decisor experimenta necessidade.
- **Forma de restrição:** "Não existe alternativa que satisfaça minha preocupação legítima E a obrigação P0+." A exclusividade é indexada ao interior: de fora — com amplitude posicional — alternativas coexistentes são visíveis.

*Nota sobre a relação com as cláusulas:* C2/forma-de-restrição estabelece a presunção de que a dicotomia é falsa. CL-A/Forma 3 especifica o procedimento pelo qual o decisor pode refutar essa presunção.

---

### 1.3 Conceitos das cláusulas

**CL-A — Cláusula de Demonstração Positiva**

*Gênero:* Regra de distribuição do ônus da prova em conflito normativo: um resultado-default aplica-se salvo demonstração positiva em contrário, por parte de quem reivindica a exceção.

*Diferença:* Quando o decisor reivindica exceção a um resultado-default de P0, a exceção não se estabelece por mera invocação: requer demonstração positiva — específica e pública — de condição ligada à estrutura de ação do afetado ou ao espaço real de alternativas.

*Quatro formas operacionais:*

| Forma | O decisor invoca... | Demonstração positiva exigida |
|---|---|---|
| **F1 — Indistinguibilidade funcional** | Equivalência entre superfícies concorrentes | Que as formas são indistinguíveis na estrutura de ação do afetado |
| **F2 — Compliance específica** | Requisito externo como determinante da forma | Apontamento do requisito específico que determina *aquela* forma; P0+ aplica-se ao restante |
| **F3 — Coexistência examinada** | Que sua preocupação legítima exclui a obrigação | Exame formal: busca documentada por alternativas que atendam ambos os lados |
| **F4 — Caminho de refinamento** | Ignorância real da intenção do consumidor como razão para default | Que o caminho de refinamento permanece aberto para especificação posterior |

---

**CL-B — Cláusula de Restauração de Simetria**

*Gênero:* Regra procedural aplicada quando a força de uma invocação depende de informação cuja visibilidade a posição interna do decisor torna assimétrica em relação ao afetado.

*Diferença:* Quando o decisor invoca um estado estável (adiamento, custo alegado, forma herdada) cuja legitimidade depende de informação que apenas sua posição interna torna inspecionável, a invocação tem peso normativo apenas se o decisor instituir procedimento rastreável que restaure simetria — tornando o invisível inspecionável fora da sua posição.

*Três formas operacionais:*

| Forma | O decisor invoca... | Informação oculta | Procedimento de restauração |
|---|---|---|---|
| **F1 — Plano visível** | Adiamento de adequação | Se o adiamento tem plano real ou é racionalização | Caminho explícito de customização com prazo de revisão visível |
| **F2 — Custo visível** | Custo/risco não medido da mudança | O custo real da não-mudança para o afetado | Retorno rastreável do custo real ao decisor (mensuração, log, relatório periódico) |
| **F3 — Endosso visível** | Preservação de forma herdada | Se o decisor atual endossa a forma ou apenas a herda | Teste contrafactual de troca de autor: sustentar a decisão sob o pressuposto de ser o autor original |

---

### 1.4 Nota sobre independência dos eixos interno/exposto

A forma interna do artefato (tipos, estruturas de dados, dependências, modelo de execução) e a forma exposta na superfície de uso são normativamente independentes. Custos ou restrições que se aplicam à forma interna não transferem sua força normativa para a forma exposta.

*Fundamento:* A forma interna é, por definição, invisível ao afetado. Portanto, nenhuma restrição sobre a forma interna é normativa para a superfície de uso, que é o único ponto em que a relação do afetado com o artefato se realiza. Invocar custo ou restrição interna como razão para a forma exposta é externalidade (C1): o decisor captura o benefício interno e externaliza o custo da forma exposta para o afetado.

---

## §2 — Princípio Reformulado (P0')

### Componente Positivo (P0+)

> Toda superfície de uso deve ser definida de modo a oferecer ao afetado a **melhor experiência de interação possível** dentro do conjunto de alternativas realmente viáveis. Estruturas, nomenclaturas, fluxos e estados internos da implementação não constituem critério normativo para essa definição.

A obrigação é *pro tanto*: pode ser qualificada por restrições genuínas fora do controle do decisor. O ônus recai sobre quem se afasta: o decisor deve justificar por que a alternativa ótima para o afetado não foi adotada.

### Componente Negativo (P0−')

**Não constituem razão derrotadora da obrigação expressa em P0+:**

**(C1) Fatores que invocam externalidade decisor→afetado:** aqueles cuja força normativa deriva de o decisor capturar o benefício da forma adotada enquanto o afetado arca com o custo de interagir com uma superfície não projetada segundo as suas operações.

**(C2) Fatores que invocam ilusão de neutralidade técnica:** aqueles cuja força normativa depende de o decisor apresentar como propriedade objetiva, necessária ou perspectiva-neutra — da superfície ou do espaço de alternativas — um julgamento indexado à sua posição dentro da implementação, que não se sustenta como objetivo examinado da posição do afetado.

### Cláusulas Categóricas

**(CL-A) Cláusula de Demonstração Positiva.** Quando o decisor reivindica exceção a um resultado-default de P0', a exceção se estabelece somente mediante demonstração positiva — específica e pública — da condição invocada, conforme a forma operacional aplicável (F1: indistinguibilidade funcional; F2: compliance específica; F3: coexistência examinada; F4: caminho de refinamento). A mera invocação não estabelece a exceção; o ônus é do decisor.

**(CL-B) Cláusula de Restauração de Simetria.** Quando o decisor invoca um estado estável cuja legitimidade depende de informação oculta pela assimetria de posição, a invocação tem peso normativo apenas mediante procedimento rastreável que restaure simetria informacional, conforme a forma operacional aplicável (F1: plano visível; F2: custo visível; F3: endosso visível). Sem o procedimento, a invocação é racionalização.

### Articulação dos componentes

P0+ estabelece a obrigação. P0−' identifica o que não a derrota, operando sobre a *natureza do fator* invocado. CL-A e CL-B operam sobre o *ônus da prova* e a *simetria informacional*, especificando as condições de escape ou as exigências procedurais quando exceções são reivindicadas.

Um fator pode ser simultaneamente externalidade (C1) e ilusão (C2): ambos os mecanismos operam, e qualquer um é suficiente para desqualificar o fator como razão derrotadora. A coexistência dos mecanismos é informação sobre a estrutura do caso, não uma indeterminação do princípio.

---

## §3 — Instâncias Ilustrativas

Os exemplos abaixo mostram como os conceitos do §1 se manifestam em situações concretas. São instâncias que *confirmam* os conceitos; não são a *fonte* de sua definição. O leitor deve usar os conceitos para analisar casos novos — incluindo casos ausentes deste conjunto — sem consultar a taxonomia do catálogo.

### C1 — Externalidade decisor→afetado

**Do catálogo.** Quando o decisor mantém o default produzido por uma ferramenta sem examinar alternativas (M01): captura a conveniência de não examinar; o afetado arca com superfície ditada pela ferramenta. Quando o decisor expõe uma estrutura interna compartilhada como superfície unificada (M11): captura a economia de reutilização; o afetado arca com a ausência de superfície projetada para suas operações.

**Fora do catálogo.** Uma equipe expõe no payload de erro da API os códigos do sistema interno de observabilidade (ex.: `ERR_POOL_07`) porque elimina uma camada de tradução. A equipe captura a conveniência de debugging direto; o consumidor da API arca com erros sem semântica para seu domínio.

### C2 — Ilusão de neutralidade técnica

**Do catálogo — forma de propriedade.** Quando o decisor justifica a ordem dos campos ou a nomenclatura das operações como "a sequência natural" (M06): "natural" significa natural para quem processa internamente; o afetado experimenta uma sequência que serve à máquina, não à sua tarefa.

**Do catálogo — forma de restrição.** Quando o decisor apresenta uma preocupação legítima como mutuamente exclusiva com a obrigação (M03): a exclusividade parece necessária de dentro; com amplitude posicional, alternativas coexistentes são visíveis.

**Fora do catálogo.** Uma biblioteca de processamento expõe funções com assinatura `(schema, options, data)` e descreve essa ordem como "a única lógica: o schema define como interpretar os dados, então vem primeiro". A "lógica" é indexada ao pipeline interno de processamento; quem usa a biblioteca tem `data` e quer aplicar `schema` — a ordem natural de uso é inversa.

### CL-A — Demonstração Positiva

**Do catálogo — F1.** Arbitragem entre superfície útil (mapeada a ações do afetado) e superfície rica (tipada para o sistema): a forma útil prevalece por default; inversão exige demonstração positiva de indistinguibilidade funcional na estrutura de ação do afetado (M08).

**Do catálogo — F3.** Antes de aceitar uma preocupação legítima como derrotadora, o decisor deve examinar formalmente se existe alternativa que a atenda sem comprometer P0+ (M03).

**Fora do catálogo — F2.** Uma equipe invoca GDPR como razão para uma superfície não-informativa. Sob CL-A/F2: deve apontar o artigo específico que determina aquela forma. O que o regulamento não determina permanece sob P0+.

### CL-B — Restauração de Simetria

**Do catálogo — F2.** O decisor invoca "alto risco de mudança" sem medição (M13). Sob CL-B/F2: deve instituir retorno rastreável do custo real da não-mudança — log de incidentes causados pela forma atual, relatório periódico disponível.

**Do catálogo — F3.** O decisor preserva forma herdada de outro autor (M14). Sob CL-B/F3: deve sustentar a decisão sob o contrafactual de ser o autor original. Se a resposta for "eu teria feito diferente", a invocação não se sustenta.

**Fora do catálogo — F1.** Uma equipe adia migração para design system por dois anos invocando "50 telas para refatorar". Sob CL-B/F1: o adiamento tem peso normativo apenas com plano explícito (faseamento por telas, datas) com prazo visível de revisão.

---

## §4 — Apêndice: Tabela de Subsunção M01–M14

| Motivo | Conceito(s) subsumente(s) | Forma operacional |
|---|---|---|
| M01 — Default de tooling | C1 | — |
| M02 — Compliance como obrigação | CL-A | F2 — Compliance específica |
| M03 — Falsa dicotomia | C2/forma-de-restrição + CL-A | F3 — Coexistência examinada |
| M04 — Encapsulamento nominal | C1 | — |
| M05 — Ambiguidade semântica genuína | CL-A | F4 — Caminho de refinamento |
| M06 — Fluxo de controle "natural" | C2/forma-de-propriedade + C1 (parcial) | — |
| M07 — Custo sintático de taxonomia | Infraestrutura (§1.4) + C1 | — |
| M08 — Ausência de mapeamento modos de falha | CL-A | F1 — Indistinguibilidade funcional |
| M09 — Reuso + custo de refatoração | CL-B | F1 — Plano visível |
| M10 — Consistência/atomicidade sem transação | C1 + C2 (parcial) | — |
| M11 — Compartilhamento interno | C1 | — |
| M12 — Custo de migração externa | CL-B | F1 — Plano visível |
| M13 — Custo/risco alegado não medido | CL-B | F2 — Custo visível |
| M14 — Familiaridade com autor original | CL-B | F3 — Endosso visível |

*Nota:* M07 não constitui cláusula separada. A independência dos eixos interno/exposto (A08) é consequência da definição de superfície (§1.1) + C1 (§1.2): forma interna não é superfície; invocar custo interno para a forma exposta é externalidade.

---

## §5 — Apêndice: Rastro de Equivalência com P0

### Demonstração de extensão conservadora

**Definição.** P0' é extensão conservadora de P0 sobre o domínio C01–C20 se: para todo caso C do domínio, o veredito de P0' coincide com o veredito de P0.

**Equivalência de componentes:**

| Componente P0 | Equivalente em P0' | Método de equivalência |
|---|---|---|
| N1–N6 (razões não-derrotadoras) | C1 + C2 | Todos os seis N subsumem sob C1 ou C2 sem resíduo (STEP 2–3) |
| Cláusula-Q/A07 | CL-A/F4 | Mesma condição procedimental (caminho de refinamento aberto) |
| Cláusula-Q/A08 | §1.4 + C1 | Absorvida pela infraestrutura: independência de eixos é consequência de definição de superfície + C1 |
| Cláusula-P1/A09, A14 | CL-A/F1 | Mesmo resultado-default + mesma condição de inversão |
| Cláusula-P2/A12 | CL-B/F1 | Mesma exigência de plano explícito com prazo |
| Cláusula-P3/A10 | CL-B/F2 | Mesma exigência de retorno rastreável do custo |
| Cláusula-P4/A11 | CL-B/F3 | Mesma exigência de endosso contrafactual |
| Cláusula-P5/A13 | CL-A/F2 | Mesma exigência de apontamento específico |
| Cláusula-A1/A15 | CL-A/F3 | Mesma exigência de exame formal de coexistência |
| P0+ (tríade "significativo, reconhecível, acionável") | P0+ (formulação-semente + §1.1) | Restauração da formulação-semente: tríade não satisfazia condições de Carnap; semente restaurada com infraestrutura de §6.7–§6.8 já disponível (STEP 1) |

**Confirmação empírica:**

Casos R3 (C09, C11, C13, C17, C19): todos os vereditos coincidem (STEP 6 §1). Casos novos N1, N2, N3: plausibilidade forte, coincidentes (STEP 6 §2). Zero super-inclusão detectada; caso de fronteira F1 mostra distinção correta entre C1 e CL-A quando benefício coexiste com reivindicação de indistinguibilidade (STEP 6 §3).

### Status epistêmico

P0' não é refundação do princípio; é generalização do nível enumerativo (mapeamento 1:1 com motivos do catálogo) para o nível categórico (conceitos aplicáveis por amplitude posicional a casos novos). A generalização foi feita *depois* dos testes — metodologicamente defensável porque: (i) generalização é monotônica para cobertura; (ii) os testes de precisão (STEP 6) verificam que não há super-inclusão. O equilíbrio reflexivo amplo avalia o estado final do princípio, não o caminho que levou a ele.

**Os motivos M01–M14 e os casos C01–C20 são instâncias representativas** que ilustram os conceitos e confirmam sua aplicabilidade. A definição dos conceitos (§1) vem da conceituação — não da indução sobre o catálogo. O catálogo não é exaustivo; os conceitos são aplicáveis a qualquer caso que instancie os mecanismos identificados.
