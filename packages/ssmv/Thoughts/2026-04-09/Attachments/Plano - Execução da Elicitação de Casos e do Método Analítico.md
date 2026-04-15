# Plano de Execução da Elicitação de Casos e do Método Analítico

## 1. Objetivo metodológico

Executar, em ordem investigativa, a **Elicitação de Casos Paradigmáticos por reconhecimento intersubjetivo** e o **Método Analítico de Investigação para rachar o truísmo**, de modo a produzir um arquivo final que exponha, com rigor filosófico, quais são os **motivos** pelos quais o truísmo não é seguido na prática da engenharia de software.

Aqui, "motivos" não significará meramente causas sociológicas, desculpas retóricas ou temas recorrentes. O termo designará fatores que, em casos concretos, são tratados pelos praticantes como:

- condições de derrota genuína da obrigação;
- racionalizações post-hoc que apenas simulam derrotá-la;
- fatores mistos que exigem decomposição adicional antes da formulação de princípios.

O alvo da etapa não é provar o truísmo nem negá-lo. É identificar, com base em casos reconhecíveis por praticantes competentes, **onde o assentimento ao truísmo muda de força normativa na prática**, e por quê.

## 2. Truísmo de partida e problema a ser explicado

O truísmo já delimitado em `Etapa 1 Consolidada` pode ser tomado, para fins desta execução, na seguinte forma operacional:

> quando houver interação humana relevante com software, a forma do sistema deve ser definida de modo a oferecer a melhor experiência de interação possível dentro do conjunto de alternativas realmente viáveis, mantendo a autoridade rastreável ao humano relevante, e não à conveniência local da implementação.

O fenômeno a explicar é: **por que agentes que assentem a esse truísmo repetidamente aceitam, justificam ou reproduzem decisões nas quais a implementação ou seus constrangimentos locais adquirem autoridade de fato sobre a forma?**

## 3. Produto terminal visado

O produto desta execução deve ser um arquivo analítico, distinto deste plano, cuja função será expor os "motivos" em forma normativamente útil para a etapa de construção de princípios.

O nome de trabalho recomendado para esse artefato final é `Catálogo de Condições de Derrota e Racionalizações.md`, porque ele já fixa com precisão o tipo de material que a etapa deve entregar.

Esse arquivo final deverá conter, para cada motivo identificado:

1. um ou mais casos paradigmáticos que o ancoram;
2. o ponto exato de limiar em que o julgamento muda;
3. o tipo de justificativa envolvida:
   conflito normativo genuíno (`N`) ou racionalização (`R`);
4. sua estabilidade ou instabilidade posicional;
5. o par de comprometimentos em tensão que ele revela;
6. o trabalho filosófico exigido do princípio posterior:
   arbitrar, qualificar, desarmar ou tornar procedimentalmente inadmissível o motivo.

O arquivo final não deve ser organizado por temas como "prazo", "legado" ou "API ruim", mas por **estrutura normativa dos motivos**.

## 4. Regras metodológicas invioláveis

- Não partir de princípios abstratos, slogans ou opiniões gerais.
- Não perguntar se UX/DX "deveria ser prioridade".
- Trabalhar apenas com **casos concretos, reconhecíveis e suficientemente específicos**.
- Catalogar os casos pela **estrutura do julgamento** que evocam, não pelo assunto superficial.
- Distinguir rigorosamente:
  restrição real que reduz o espaço do possível;
  fator sob controle do decisor;
  justificativa genuína;
  racionalização posicional;
  mera descrição causal.
- Preservar, em todos os casos, a diferença entre:
  quem decide;
  quem implementa;
  quem sofre os custos da forma;
  em que regime isso ocorre: `runtime` ou `build-time`.

## 5. Comunidade epistêmica relevante

O corpus deve ser formado por **praticantes competentes que reconheçam os casos por experiência sedimentada**, e cuja autoridade epistêmica derive de terem ocupado, ao longo da prática, **ambos os lados da relação**:

- lado do decisor;
- lado do afetado.

Em termos concretos do domínio, isso deve significar, sempre que possível:

- ter definido a forma de alguma superfície de uso e também ter consumido superfície definida por outrem;
- ter atuado em `runtime` e em `build-time`, ou ao menos ter visibilidade direta dos dois regimes e de sua continuidade normativa.

Isso é necessário porque o objetivo não é coletar preferências setoriais, mas captar julgamentos com aptidão para o **teste de inversão posicional**.

A limitação simétrica do método deve ser declarada desde o início: casos que nunca chegaram a ser narrados, ou cujos afetados não tinham voz, repertório ou posição para reconhecê-los como problema, tenderão a ficar fora do corpus.

## 6. Critérios de entrada de casos no corpus

Um caso só entra na análise se satisfizer simultaneamente os critérios abaixo, que visam garantir não apenas reconhecimento intersubjetivo, mas **validade empírica contemporânea, densidade operacional e resistência a distorções narrativas**.

### 6.1. Critério de reconhecimento

O caso deve ser do tipo:

- "já passei por isso";
- "isso acontece o tempo todo";
- "já vi essa decisão sendo tomada";
- "já tive que conviver com isso como usuário ou dev".

Casos apenas imagináveis, hipotéticos ou construídos por extrapolação não são admitidos.

Além disso, o reconhecimento deve ser:

- **não dependente de explicação longa**;
- **imediato para praticantes experientes**;
- **independente de alinhamento ideológico ou preferência técnica**.

### 6.2. Critério de especificidade

O caso deve ser descrito com detalhe suficiente para fixar:

- qual superfície de uso está em disputa;
- quem é o decisor;
- quem é o afetado;
- qual alternativa superior parecia disponível;
- qual fator foi invocado para não adotá-la.

Descrições genéricas do tipo “apps são confusos” ou “APIs ruins” são insuficientes.

### 6.3. Critério de posicionamento

O mesmo caso deve poder ser descrito:

- da posição do decisor;
- da posição do afetado;

sem alteração dos fatos materiais.

### 6.4. Critério de atualidade operacional

O caso deve refletir práticas, ferramentas e constrangimentos **efetivamente presentes no ecossistema contemporâneo (aprox. 2024–2026)**.

Devem ser excluídos:

- problemas típicos de gerações anteriores de tooling que já não são estruturalmente relevantes;
- limitações técnicas que deixaram de ser restrições reais;
- padrões de decisão que não são mais praticados em escala significativa.

Teste prático:

> Um praticante ativo hoje reconheceria esse caso como algo que ainda ocorre com frequência relevante?

### 6.5. Critério de recorrência estrutural

O caso não pode ser:

- um incidente isolado;
- um erro idiossincrático de equipe;
- uma falha atribuível apenas à incompetência individual.

O caso deve representar uma **classe recorrente de decisão**, ainda que exemplificado por um episódio concreto.

Indicadores válidos:

- aparece em múltiplos contextos independentes;
- é relatado por diferentes praticantes;
- emerge em diferentes stacks ou organizações.

### 6.6. Critério de não-caricatura

O caso não pode depender de:

- exagero retórico;
- simplificação irreal;
- agentes obviamente incompetentes;
- condições artificialmente extremas.

Casos devem refletir decisões tomadas por **praticantes competentes sob pressões plausíveis**.

Teste prático:

> Um engenheiro experiente poderia ter tomado essa decisão sem parecer irracional ou negligente?

### 6.7. Critério de reversibilidade plausível

Deve ser possível apontar, de forma concreta, **uma alternativa melhor que era plausível no momento da decisão**, mesmo que mais custosa.

Casos em que:

- não havia alternativa real;
- ou todas as alternativas eram igualmente ruins;

não servem para análise de derrota do truísmo, pois não há escolha normativa significativa.

### 6.8. Critério de densidade causal mínima

O caso deve conter **encadeamento causal suficiente** para sustentar análise normativa.

Devem estar presentes:

- uma decisão identificável;
- um fator invocado;
- uma consequência na forma do sistema.

Casos que dependem de inferências vagas ou múltiplas lacunas explicativas devem ser descartados.

### 6.9. Critério de independência narrativa

O caso deve permanecer válido quando:

- descrito de forma mais neutra;
- privado de linguagem retórica;
- separado de julgamento prévio.

Se a força do caso depende do modo como ele é contado (e não dos fatos), ele não é admissível.

### 6.10. Critério de fricção real

O caso deve envolver **custo real para o afetado**, e não apenas:

- preferência estética;
- desacordo de estilo;
- micro-otimizações irrelevantes.

Esse custo pode ser:

- aumento de esforço;
- perda de previsibilidade;
- erro induzido;
- tempo adicional;
- perda de controle ou compreensão.

Sem fricção real, não há tensão normativa suficiente.

### 6.11. Critério de granularidade decisional mínima

O caso deve capturar **uma única decisão local de forma**, e não um conjunto agregado de decisões.

Devem ser evitados casos que envolvam:

- múltiplas decisões acopladas;
- efeitos sistêmicos amplos;
- dinâmicas organizacionais complexas;
- interações entre múltiplos subsistemas.

O caso deve ser redutível a algo do tipo:

> "neste ponto específico, entre A e B, escolheu-se X em vez de Y"

Teste prático:

> É possível variar uma única condição mantendo todo o resto constante?

Casos que não permitem isolamento de variável devem ser descartados ou decompostos.

A decisão local deve ser expressável como uma variação direta em:

- lógica de controle;
- estrutura de dados;
- contrato de interface;
- comportamento de execução;
- feedback imediato ao usuário.

Casos cuja variação exige redefinição de fluxo de produto completo devem ser descartados ou decompostos.

### 6.12. Anti-amplificação

Casos não devem depender de:

- escala (milhões de usuários, plataformas globais);
- impacto financeiro significativo;
- cenários extremos ou de alta visibilidade.

Casos ideais são aqueles que:

- ocorrem dezenas de vezes por semana;
- aparecem em código comum;
- não seriam reportados como "problema" formal, mas são reconhecidos imediatamente.

Exemplo paradigmático do nível de granularidade esperado:

> Um método é nomeado de forma que reflete a estrutura interna da implementação, e não o modelo mental do desenvolvedor que o utiliza, exigindo tradução mental entre intenção e uso.

Esse tipo de caso:

- ocorre em nível local;
- envolve uma única decisão;
- permite variação controlada (renomear, mudar parâmetros, alterar defaults);
- mantém a tensão normativa clara sob inversão posicional.

Todos os casos gerados devem ser comparáveis a este em termos de granularidade e manipulabilidade analítica.

### 6.13. Critério de atribuibilidade à implementação

O caso deve depender de uma decisão que:

- é tomada diretamente por quem implementa o sistema; ou
- é inevitavelmente resolvida no momento da implementação, mesmo que tenha sido especificada externamente.

Devem ser excluídos casos cuja forma seja primariamente determinada por:

- decisões de priorização (PM);
- decisões de escopo funcional;
- decisões puramente visuais ou de identidade (design);
- políticas de negócio.

Teste prático:

> É possível alterar significativamente esse caso modificando apenas o código, sem necessidade de redefinir o produto ou a estratégia?

Se não, o caso não é admissível.

Casos devem ser excluídos quando:

- a decisão central é "ter ou não ter" uma funcionalidade;
- a decisão central é "qual funcionalidade priorizar";
- a decisão central é puramente estética (cor, branding, estilo visual);
- a decisão central depende de alinhamento entre stakeholders não técnicos.

O foco deve ser sempre "como algo é implementado", não "se algo deve existir".

## 7. Unidade de catalogação

A unidade básica de trabalho não será "tema", mas **caso paradigmático com estrutura de reconhecimento classificável**.

Cada caso deverá ser fichado com, no mínimo, os seguintes campos:

| Campo | Conteúdo exigido |
|---|---|
| ID | Identificador estável do caso |
| Regime | `runtime`, `build-time` ou `ambos` |
| Superfície de uso | tela, fluxo, API, módulo, contrato, erro, tooling, internals tornados objeto de uso, etc. |
| Decisor | quem fixou ou preservou a forma |
| Afetado | quem arcou com a adaptação, custo ou opacidade |
| Descrição específica | caso concreto reconhecível |
| Alternativa superior aparente | o que parecia melhor para o humano relevante |
| Fator invocado | o que foi usado para não seguir o truísmo |
| Julgamento inicial | `R1`, `R2` ou `R3` |
| Tipo de justificativa | `N`, `R` ou indeterminado |
| Estabilidade posicional | estável, instável ou parcial |
| Observação sobre controle | o fator estava ou não sob controle do decisor? |

Os casos devem, preferencialmente, ocorrer em **pontos locais de contato**, tais como:

- nome de função, método ou propriedade;
- assinatura de função;
- shape de objeto ou payload;
- mensagem de erro;
- ordem de parâmetros;
- defaults e valores implícitos;
- estrutura de retorno;
- affordances imediatas de UI (botão, label, feedback direto).

Devem ser evitados, na geração inicial:

- fluxos completos de produto;
- estratégias de monetização;
- políticas de plataforma;
- decisões arquiteturais amplas.

## 8. Sequência de execução

## Fase 1. Delimitação, geração e montagem do corpus

Objetivo: constituir um conjunto inicial de casos paradigmáticos reconhecíveis por praticantes competentes.

Operações:

1. Definir, em termos defensáveis, quem conta como praticante competente para o reconhecimento intersubjetivo relevante.
2. Declarar explicitamente a limitação do corpus: ele captura casos sedimentados pela prática coletiva, não todos os casos possíveis ou todos os afetados reais.
3. Gerar entre 12 e 20 casos concretos de **baixa complexidade estrutural**, cada um envolvendo:
  - uma única decisão local; uma única superfície de contato; no máximo um fator invocado inicialmente.
  - Cada caso deve poder ser descrito em 1 a 3 frases.
  - Se um caso exigir mais de uma decisão para ser compreendido, ele deve ser decomposto em múltiplos casos menores.
4. Reunir casos de `runtime`, de `build-time` e, quando possível, da fronteira entre ambos.
5. Gerar casos de `runtime` que emergem de decisões de implementação, tais como:
  - como o sistema responde a uma ação inválida;
  - como estados intermediários são tratados;
  - como erros são comunicados;
  - como defaults são definidos;
  - como entradas são interpretadas;
  - como feedback é sincronizado com ações do usuário.
5. Garantir presença de casos em que o praticante reconheça claramente:
   "isso estava errado, sem desculpa";
   e casos em que diga:
   "era o que dava para fazer".
6. Excluir descrições genéricas que não permitam reconstruir a tensão normativa.

Famílias mínimas de caso a cobrir:

| Domínio | Exemplos de tensão |
|---|---|
| Superfície de produto (`runtime`) | fluxo de uso moldado pela sequência técnica de implementação, e não pela tarefa do usuário |
| API pública (`build-time`) | API desenhada para facilitar a implementação interna, não o caso de uso do consumidor |
| Módulo ou componente (`build-time`) | interface que expressa a conveniência do autor, não a do mantenedor futuro |
| Mensagens de erro e feedback (`ambos`) | superfície que revela estado interno sem orientar a ação do humano |
| Composição entre entidades (`build-time`) | forma final determinada por decisões intermediárias sem rastreabilidade ao uso |
| Legado e inércia (`ambos`) | "o legado não deixa" sem exame suficiente de alternativas |
| Prazo e recurso (`ambos`) | "não havia tempo" sem distinção entre restrição genuína e conveniência |

Produto da fase:

- parágrafo metodológico que justifique o corpus e sua autoridade epistêmica;
- lista inicial de casos específicos aptos à classificação.

## Fase 2. Catalogação por estrutura de reconhecimento

Objetivo: classificar cada caso segundo o tipo de resposta normativa que ele evoca.

Cada caso deve ser posicionado na Dimensão 1:

- `R1`: sem justificativa oferecida;
- `R2`: justificativa tentada, mas instável;
- `R3`: justificativa oferecida com conforto.

Quando houver justificativa (`R2` ou `R3`), classificar também:

- `N`: conflito normativo genuíno;
- `R`: racionalização post-hoc;
- `I`: ainda indeterminado.

E, separadamente:

- `Estável`: o julgamento se mantém com inversão de posição;
- `Instável`: o julgamento muda com inversão de posição;
- `Parcial`: parte da justificativa sobrevive, parte colapsa.

Produto da fase:

- matriz inicial de casos classificados por estrutura de reconhecimento.

Os casos metodologicamente mais valiosos para a etapa seguinte tendem a estar em `R2` e `R3`, porque são os casos em que existe justificativa a ser analisada, refinada ou desmontada.

## Fase 3. Coleta de pares de julgamento não-teórico

Objetivo: formar pares analiticamente úteis do tipo:

- "não havia desculpa";
- "era o que dava para fazer".

O par deve ser construído, sempre que possível, com casos cuja estrutura seja próxima, para que a mudança de julgamento não seja confundida com mudança completa de fenômeno.

Pergunta orientadora da fase:

> Em que caso semelhante o praticante abandona a condenação e passa a aceitar a derrota prática do truísmo?

Produto da fase:

- pares de julgamento prontos para o teste de limiar.

## Fase 4. Threshold probing

Objetivo: identificar o ponto em que o julgamento muda e, com isso, revelar o fator tratado como normativamente relevante.

Procedimento:

1. Escolher um caso-base com condenação relativamente firme.
2. Variar uma única condição por vez.
3. Registrar precisamente o ponto em que o julgamento migra de `R1` para `R2` ou `R3`, ou de `R2` para `R3`.

As variações devem seguir isolamento de variáveis. As primeiras famílias de variação a testar, à luz de `Etapa 1 Consolidada`, são:

- tempo adicional real ou inexistente;
- existência de alternativa técnica superior não explorada;
- grau de conhecimento do decisor sobre o impacto no afetado;
- existência ou inexistência de canal de feedback do afetado;
- custo de refatoração em código de outra equipe;
- veto institucional ou de gestão;
- requisito real de segurança, privacidade, integridade ou regulação;
- legado apenas incômodo versus compromisso realmente vinculante;
- opacidade entre decisão e consequência;
- distância temporal entre decisor presente e afetado futuro;
- difusão de responsabilidade entre equipes;
- acúmulo incremental de pequenas decisões versus decisão única e explícita;
- default de ferramenta, hábito local ou conveniência de implementação;
- previsões especulativas de escala ou complexidade;
- diferença entre custo inevitável e custo simplesmente transferido ao afetado.

Essa lista é orientadora, não exaustiva. Se o corpus revelar novas famílias de variação filosoficamente relevantes, elas devem ser incorporadas sem forçar redução prematura aos tipos já previstos.

Produto da fase:

- mapa de limiares por caso;
- primeira lista de fatores candidatos a "motivos".

## Fase 5. Diagnóstico do estatuto dos motivos

Objetivo: determinar se cada fator identificado é:

- condição de derrota genuína;
- racionalização;
- fator misto que exige decomposição.

Perguntas diagnósticas obrigatórias para cada motivo:

1. O fator reduz realmente o conjunto de alternativas viáveis, ou apenas torna uma delas menos conveniente para o decisor?
2. O fator é sustentado pelo praticante como comprometimento normativo independente, inclusive quando não o beneficia?
3. O fator sobreviveria ao teste posicional?
4. O fator vale igualmente em `runtime` e `build-time`, ou depende de uma assimetria não declarada entre UX e DX?
5. O fator altera a obrigação, ou apenas obscurece sua violação?

Heurísticas centrais desta fase:

- Se o fator está **fora do controle do decisor** e é sustentado independentemente, ele é candidato a conflito normativo genuíno.
- Se o fator está **sob controle do decisor**, ou só aparece quando o próprio decisor busca se eximir, ele é candidato forte a racionalização.
- Se parte do fator é restrição real e parte é conveniência local, ele deve ser decomposto antes de qualquer conclusão.

Testes adicionais de genuinidade a aplicar nesta fase:

- Se a decisão tivesse produzido boa UX/DX por acidente, o praticante ainda invocaria esse mesmo fator como normativamente relevante?
- O fator continua sendo tratado como relevante quando o praticante é descrito do lado do afetado, e não do lado do decisor?

Produto da fase:

- tipologia provisória dos motivos por estatuto normativo.

## Fase 6. Teste de inversão posicional

Objetivo: verificar se o motivo permanece aceitável quando os mesmos fatos são redescritos do lado oposto da relação.

Procedimento:

1. Reapresentar o mesmo caso do ponto de vista do afetado.
2. Manter invariáveis todos os fatos materiais.
3. Observar se a justificativa:
   permanece;
   enfraquece;
   desaparece.

Regra de interpretação:

- Se a justificativa colapsa quando a posição é invertida, ela não conta como condição de derrota genuína.
- Se ela sobrevive à inversão, permanece candidata a conflito normativo genuíno.
- Se sobrevive apenas parcialmente, o motivo precisa ser repartido em componentes distintos.

Produto da fase:

- classificação final da estabilidade posicional de cada motivo.

## Fase 7. Formulação dos pares de comprometimento em tensão

Objetivo: transformar cada motivo em um par analítico do tipo `C1/C2`, para mostrar exatamente como o truísmo é esvaziado.

Estrutura a preencher para cada par:

| Campo | Conteúdo |
|---|---|
| Caso | descrição específica e reconhecível |
| Comprometimento 1 | assentimento ao truísmo |
| Comprometimento 2 | assentimento à justificativa que derrota ou aparenta derrotar o truísmo |
| Fator de tensão | o que muda entre os dois julgamentos |
| Estatuto do fator | `N`, `R` ou misto |
| Estabilidade | estável, instável ou parcial |
| Trabalho exigido do princípio | arbitrar, qualificar, rejeitar ou proceduralizar |

Produto da fase:

- matriz dos pares de comprometimento em tensão.

## Fase 8. Conversão dos motivos em alvos de ataque normativo

Objetivo: explicitar como cada motivo deverá ser tratado na etapa posterior de formulação de princípios.

Regra de conversão:

- Motivo `N` estável:
  o princípio terá de **conciliar ou arbitrar** entre compromissos normativos genuínos.
- Motivo `R`:
  o princípio terá de **desarmar a racionalização**, mostrando por que ela não derrota a obrigação.
- Motivo misto:
  o princípio terá de **separar a parte restritiva real da parte racionalizante**.
- Motivo ligado a opacidade, atribuição ou temporalidade:
  o princípio poderá ter de impor **exigências procedimentais** de visibilidade, rastreabilidade, exposição do afetado e exame de alternativas.

Aqui estará o ponto metodologicamente decisivo: os "motivos" não serão o princípio ainda, mas **o objeto preciso que o princípio futuro deverá enfrentar**.

Produto da fase:

- lista final de alvos normativos para a etapa de construção de princípios.

## 9. Estrutura recomendada do arquivo final sobre os motivos

O arquivo final resultante da execução deste plano deve seguir, preferencialmente, esta ordem:

### 9.1. Nota metodológica curta

- por que o corpus de reconhecimento intersubjetivo conta como evidência filosófica;
- quem compõe a comunidade de praticantes relevante;
- quais são as limitações do método.

### 9.2. Exposição do corpus

- critérios de entrada;
- regimes cobertos;
- número e tipo de casos paradigmáticos usados.

### 9.3. Matriz resumida dos casos

- tabela com ID, regime, estrutura de reconhecimento, tipo de justificativa e estabilidade posicional.

### 9.4. Lista analítica dos motivos

Para cada motivo:

1. formulação curta;
2. casos-âncora;
3. limiar em que aparece;
4. estatuto normativo;
5. teste posicional;
6. implicação para a força do truísmo;
7. alvo normativo correspondente.

### 9.5. Separação entre três classes de motivo

- motivos que realmente derrotam a obrigação;
- motivos que apenas racionalizam sua derrota;
- motivos cuja ambiguidade ainda exige nova análise.

### 9.6. Conclusão metodológica

- o truísmo não é falso;
- ele racha porque convive com comprometimentos concorrentes ou pseudo-derrotadores;
- sem explicitação dos motivos, qualquer princípio posterior ficará subarticulado.

## 10. Relação com a Etapa 1 e as etapas seguintes

| Este plano produz | Que alimenta |
|---|---|
| catálogo de condições de derrota genuínas | defesa de `C6`, porque testa a distinção entre restrição com peso deliberativo e autoridade normativa |
| catálogo de racionalizações | formulação do princípio central, porque explicita quais fatores o princípio deverá derrotar |
| pares de comprometimento em tensão | defesa de `C2` e `C3`, porque mostra quando ônus evitáveis e transferência de custo exigem justificação |
| limiares empíricos | defesa de `C4`, porque evidencia o papel normativo da visibilidade entre decisão e consequência |
| cobertura de `runtime` e `build-time` | defesa de `C7`, porque testa a unidade do espaço normativo entre UX e DX |

## 11. Ordem de execução recomendada

As fases `1` e `2` podem ser executadas na mesma sessão de trabalho, porque a geração do corpus e sua primeira catalogação são interdependentes.

As fases `2` a `6` devem ser tratadas como um ciclo analítico iterável:

- a catalogação pode revelar falta de casos e exigir retorno à geração do corpus;
- o threshold probing pode revelar variáveis ainda não previstas e exigir nova rodada de variação;
- o teste posicional pode reclassificar fatores inicialmente tratados como genuínos.

A formulação final dos pares de comprometimento e a conversão dos motivos em alvos normativos só devem ser estabilizadas quando esse ciclo estiver suficientemente depurado.

Sempre que possível, cada fase deve deixar um arquivo próprio ou uma seção autônoma já redigida antes da passagem à seguinte, para preservar rastreabilidade metodológica e reduzir perda de trabalho analítico em caso de interrupção.

## 12. Critérios de suficiência do trabalho

O trabalho só estará metodologicamente maduro quando:

- nenhum motivo constar do arquivo final sem caso específico que o ancore;
- nenhum motivo for tratado como normativo sem sobreviver ao teste de inversão posicional ou a justificativa equivalente;
- nenhuma racionalização for mantida apenas por familiaridade prática ou apelo retórico;
- a distinção entre **restrição** e **autoridade** permanecer intacta;
- houver cobertura suficiente para mostrar que o problema atravessa `runtime` e `build-time`;
- cada motivo já aparecer acompanhado do tipo de resposta normativa que exigirá depois.

## 13. Fórmula operacional do resultado esperado

Ao final da execução, o arquivo produzido deve permitir afirmar algo desta forma:

> O truísmo deixa de guiar a prática não por falta de assentimento, mas porque, em casos paradigmáticos, os praticantes tratam certos fatores como derrotadores da obrigação. Alguns desses fatores são conflitos normativos genuínos; outros são racionalizações posicionais; outros misturam restrição real e conveniência local. A tarefa dos princípios normativos seguintes será, respectivamente, arbitrar os primeiros, desarmar os segundos e decompor os terceiros.

Essa é a forma correta de transformar a elicitação e o método analítico em material utilizável para a próxima etapa do artigo.
