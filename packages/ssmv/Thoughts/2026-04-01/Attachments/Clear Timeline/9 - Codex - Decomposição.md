# Passo 2 - Decomposição

## 1. Verificação de camadas

- **Camada factual**: **presente**. O explanandum contém afirmações recorrentes sobre decisões técnicas, efeitos sobre usuários e construtores, padrões organizacionais, feedback, formação, IA, DX e divergências estáveis entre praticantes.
- **Camada valorativa**: **presente**. O texto depende de valorações ao tratar certos estados de coisas como "constrangimento", "falha", "negligência", "transferência de custo", "bom o suficiente" e ao pressupor que a experiência humana conta normativamente.
- **Camada prescritiva**: **ausente**. O explanandum descreve disputas sobre o que poderia ser feito, mas não formula ele próprio um imperativo substantivo estável sobre o que fazer, evitar ou preferir.

## 2. Decomposição interna

### 2.1. Camada factual

**Modo regressivo**

A camada factual pressupõe, em nível mais básico, que existe um domínio reconhecível de práticas chamado desenvolvimento de software; que nele há agentes humanos situados em papéis distinguíveis ou sobrepostos; que decisões técnicas produzem artefatos relativamente estáveis no tempo; que tais artefatos alteram o espaço de ação, compreensão e esforço dos humanos que com eles interagem; que esses efeitos podem aparecer tardiamente; e que a circulação de informação entre decisão e consequência é frequentemente imperfeita. Pressupõe ainda que competência, estrutura organizacional, ferramentas, linguagem profissional e escala de recursos modulam a intensidade desses efeitos, e que praticantes ordinários conseguem reconhecer a recorrência do padrão mesmo sem teoria unificada.

**Modo resolutivo**

A camada factual se resolve nas seguintes unidades mínimas:

1. Há decisões técnicas identificáveis.
2. Essas decisões fixam formas técnicas relativamente duráveis.
3. Formas técnicas alteram possibilidades de ação, compreensão e manutenção para humanos.
4. O efeito pode recair sobre usuários, sobre outros desenvolvedores ou sobre o próprio desenvolvedor em momento posterior.
5. O ônus costuma aparecer depois da decisão, não no instante dela.
6. A adaptação costuma ocorrer mais do humano para o sistema do que do sistema para o humano.
7. Parte relevante desse ônus permanece invisível porque o humano aprende a contornar o problema.
8. Quem decide e quem sofre a consequência costumam estar separados por papel, tempo ou hierarquia.
9. Feedback sobre a consequência costuma ser fraco, tardio ou inexistente.
10. Competência de design, separação de papéis, processos, ferramentas, IA e recursos organizacionais alteram o grau do fenômeno.
11. Os praticantes reconhecem a recorrência do padrão, mas divergem sobre evitabilidade, responsabilidade, critério de aceitabilidade e locus da solução.
12. Fenômenos subsidiários como "uso" e "forma" aparecem como vocabulário ordinário ainda não estabilizado conceitualmente.

**Modo transformativo**

Na forma atual, a camada factual é analisável, mas mistura descrição empírica com vocabulário já carregado de avaliação. Reformulação rigorosa:

> Em engenharia de software, escolhas técnicas recorrentes modificam o conjunto de ações disponíveis, os custos cognitivos e as condições de inteligibilidade para agentes humanos que interagem com artefatos de software, inclusive os próprios autores em momentos posteriores. Esses efeitos tendem a ser distribuídos assimetricamente entre decisores e afetados, tornam-se visíveis com atraso, são frequentemente subobservados por adaptação bem-sucedida, e variam conforme estrutura de feedback, distribuição de competências, separação organizacional de papéis, enquadramento profissional e disponibilidade de recursos. A prática reconhece a recorrência desse padrão, mas não converge sobre sua evitabilidade, sua imputação causal ou seus limites de aceitabilidade.

Preservado na transformação: a recorrência do fenômeno, a relação entre decisão técnica e efeito humano, a assimetria, a defasagem temporal, os moduladores contextuais e a divergência prática. Descartado na transformação: termos que já condensam juízo ou imputação, como "negligência", "falha", "preguiça", "indiferença", "bom produto" e formulações personificadas demais para operar como predicados factuais estritos.

### 2.2. Camada valorativa

**Modo regressivo**

A camada valorativa pressupõe compromissos mais básicos: que a experiência humana tem relevância normativa na avaliação de decisões técnicas; que impor ônus evitáveis ou não suficientemente justificados a humanos conta negativamente; que há peso normativo na assimetria entre quem decide e quem suporta a consequência; que invisibilidade de custo e ausência de feedback importam porque reduzem antecipação, contestação e responsabilidade; que competência para antecipar experiência humana é um bem prático; e que trade-offs só fazem sentido normativo se houver algum critério para dizer quando um constrangimento é aceitável.

**Modo resolutivo**

A camada valorativa se resolve nos seguintes juízos elementares:

1. É normativamente relevante que decisões técnicas constranjam humanos.
2. É prima facie negativo quando o humano precisa adaptar-se ao sistema de modo evitável.
3. É prima facie negativo transferir custo do decisor para o afetado sem tornar essa transferência visível.
4. É positivo que decisão e consequência estejam mais próximas ou mais visíveis uma à outra.
5. É negativo que a experiência humana fique fora do campo de consideração da engenharia por hábito, formação ou estrutura.
6. É positivo possuir ou incorporar competência capaz de antecipar experiência; é suspeito substituir essa competência por processo ou ferramenta sem critério próprio de avaliação.
7. Restrições de tempo, custo e capacidade podem ter peso justificatório, mas não recebem peso automático ou ilimitado.
8. A situação do usuário final e a do desenvolvedor futuro são tratadas como suficientemente aparentadas para entrarem no mesmo campo de preocupação normativa.

**Modo transformativo**

Na forma atual, a camada valorativa é analisável, mas sua valência está dispersa em termos ordinários e metáforas práticas. Reformulação rigorosa:

> O explanandum atribui peso normativo prima facie negativo a estados de coisas em que decisões técnicas impõem ônus humanos evitáveis, pouco visíveis ou insuficientemente representados no momento da decisão, sobretudo quando tais ônus recaem sobre agentes diferentes daqueles que decidiram. Correlativamente, atribui peso positivo a arranjos, competências e enquadramentos que tornem esses ônus antecipáveis, visíveis e deliberáveis.

Preservado na transformação: a centralidade normativa da experiência humana, a crítica à transferência opaca de custo, a relevância da assimetria e a valorização de visibilidade, competência e deliberação. Descartado na transformação: rótulos moralizados sem critério explícito, como "negligência", "preguiça", "desculpa", "bom produto" e qualquer imputação específica de culpa, porque excedem o valor mínimo necessário para manter a orientação normativa do texto.

## 3. Análise das relações

### 3.1. Da factual para a valorativa

A passagem não está plenamente justificada no explanandum. O texto apresenta fatos sobre recorrência, assimetria, atraso, invisibilidade, separação de papéis e disputa prática; em seguida, trata esses fatos como "constrangimento", "custo", "falha", "negligência", "tensão" ou matéria de mitigação, sem declarar a ponte normativa que autoriza essa mudança de estatuto.

O ponto exato de vulnerabilidade aparece quando se passa de enunciados como "o humano se adapta ao sistema com mais frequência do que o sistema ao humano", "a adaptação é silenciosa e subnotificada" e "quem decide está menos exposto às consequências" para enunciados como "há transferência de custo", "há falha", "há negligência" ou "há um problema normativo a ser tratado". A ponte ausente é algo do tipo: "ônus humanos evitáveis, especialmente quando recaem sobre quem não decide, são prima facie indesejáveis". Sem essa ponte declarada, a passagem do descritivo ao valorativo comete precisamente o salto mooreano do que é para o que vale.

### 3.2. Ausência de relação com camada prescritiva

Como a camada prescritiva não foi confirmada, não há passagem valorativa-para-prescritiva a diagnosticar. A implicação é precisa: o explanandum consegue estabilizar um campo de preocupação normativa, mas ainda não formula uma norma operativa; ele revela um problema carregado de valor sem ainda dizer qual conduta deve segui-lo.

## 4. Inventário de pressupostos não declarados

1. **A experiência humana é critério relevante para avaliar decisões técnicas.** Opera na ponte entre camada factual e valorativa. Sua ausência torna a norma **inválida** enquanto diagnóstico normativo, porque restariam apenas descrições de funcionamento técnico-social. É um **compromisso de valor**.
2. **Ônus humanos evitáveis contam contra a decisão que os produz.** Opera na ponte entre camada factual e valorativa. Sua ausência torna a norma **inválida**, porque a recorrência do constrangimento não bastaria para marcá-lo como problema. É um **compromisso de valor**.
3. **Transferir custo de adaptação para quem não decide exige justificação adicional.** Opera entre as camadas factual e valorativa. Sua ausência torna a norma **enfraquecida**, porque a assimetria poderia ser lida apenas como distribuição funcional de trabalho. É um **compromisso de valor**.
4. **A assimetria entre decisor e afetado tem peso normativo independente.** Opera entre as camadas factual e valorativa. Sua ausência torna a norma **enfraquecida**, porque o texto perderia um de seus principais marcadores de gravidade. É um **compromisso de valor**.
5. **Usuário final e desenvolvedor futuro pertencem ao mesmo espaço relevante de consideração normativa.** Opera na camada valorativa. Sua ausência torna a norma **incompleta**, porque a extensão do diagnóstico de UX para DX deixaria de ser sustentada. É um **compromisso de valor**.
6. **Uma parcela relevante do constrangimento descrito é evitável ou mitigável.** Opera entre a camada factual e a valorativa. Sua ausência torna a norma **enfraquecida**, porque a crítica se dissolveria em fatalismo tecnológico ou organizacional. É algo que pode ser **fundamentado empiricamente**.
7. **Maior visibilidade entre decisão e consequência melhora a qualidade normativa da decisão.** Opera na camada valorativa. Sua ausência torna a norma **enfraquecida**, porque o peso dado a feedback, antecipação e moldura perderia sustentação. É um **compromisso de valor**.
8. **Competência de design não é substituída automaticamente por processo de engenharia ou por geração via IA.** Opera na camada valorativa. Sua ausência torna a norma **enfraquecida**, porque os diagnósticos sobre delegação sem aquisição e suficiência processual perderiam objeto. É algo que pode ser **fundamentado empiricamente**.
9. **Restrições de tempo, custo e capacidade não legitimam por si sós qualquer constrangimento humano.** Opera na camada valorativa. Sua ausência torna a norma **incompleta**, porque a distinção entre razão legítima e racionalização posterior deixaria de ser inteligível. É um **compromisso de valor**.
