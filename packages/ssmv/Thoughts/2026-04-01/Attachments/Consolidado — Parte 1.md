# Consolidado — Matéria Prima para Análise Normativa de UseDD

> Este documento consolida, em versão final, todo o material necessário para conduzir uma análise normativa em filosofia analítica em defesa de Use Driven Design. Substitui a necessidade de consultar os documentos-fonte individuais.

---

## I. UseDD — Estrutura Formal (Design Tree v2)

> Mapa causal de decisões de design: cada nó é uma escolha feita entre alternativas, com racional explícito. Nós-pai constrangem ou habilitam nós-filho.
> Escopo: o princípio e sua prática de especificação.

### Glossário

- **Entidade** — Qualquer participante de uma relação de uso. Pode ser um humano, um arquivo-fonte, um módulo, um sistema inteiro. Neutro em relação à granularidade.
- **Porta** — O contrato que define como uma entidade é usada. Definida pela entidade que usa (decisor), não pela que é usada (executor). Quando L1.2 é seguido, toda porta é especificada antes da implementação — não há termo separado para isso ("spec" foi eliminado; a diferença temporal não justifica termo novo).
- **Decisor** — A entidade que, em um par, toma decisões e define a porta. Decidir é sua responsabilidade; executar, não.
- **Executor** — A entidade que implementa o que o decisor definiu. Executar é sua responsabilidade; decidir, não.
- **Uso** — A relação entre decisor e executor, em qualquer granularidade. Não implica que o decisor seja humano.
- **Usuário** — Reservado ao humano. Os que "usam" diretamente o sistema são exatamente dois: o **usuário do produto** (runtime: input e outputs) e o **desenvolvedor** (build-time: código). PMs são proxies do usuário do produto; a empresa é mediada por ambos.
- **Cadeia de autoridade** — Sequência de relações decisor→executor que conecta qualquer entidade ao humano. Finita, acíclica, raiz única.
- **Infraestrutura** — Entidades fora da cadeia de autoridade do produto. Utils, helpers internos e APIs externas cujas portas são definidas pelo humano desenvolvedor diretamente. Critério: se a forma só faz sentido no contexto de uma entidade específica do produto, pertence à cadeia; se faz sentido independentemente, é infraestrutura. A fronteira é dinâmica.

### Premissa Fundacional — P0

Software é um artefato cuja razão de existir é servir um humano. P0 é analítica — contida na definição de "artefato". Não diz "deveria servir humanos" (ought), diz "software que não serve humanos não é software no sentido relevante" (is). A normatividade de UseDD vem da definição do objeto, não de um dever moral externo.

### Nó Raiz

**Decisão:** Quem usa define a forma do que é usado, e essa forma precede a implementação.

**Alternativas rejeitadas:** (a) Direção invertida: implementação define o que é exposto, uso se adapta. (b) Sequência invertida: uso documentado depois, como descrição do que foi construído.

**Racional:** Se uso é consequência da implementação, a entidade foi construída para si, não para quem a usa — direção invertida. Se uso é documentado depois, descreve em vez de constranger — sequência invertida.

### L1 — Os Dois Eixos

**L1.1 — Direção: quem pensa, usa.** O lado que usa toma decisões; o lado que é usado executa. A assimetria de autoridade em cada par (P1) é um **axioma** — escolha de modelagem, não descoberta empírica. Simetria aparente é dissolvida por decomposição. Axiomas declarados são mais fortes que axiomas disfarçados de observações. Habilita: identificação unívoca do decisor em qualquer par. Exige: nível único de responsabilidade (→L2.1), uniformidade entre granularidades (→L2.2), decisor único por par (→L2.7).

**L1.2 — Sequência: o uso precede a implementação.** A porta é produzida antes da implementação. Documentação posterior descreve; especificação anterior constrange — papéis opostos. Constrange: vocabulário do decisor (→L2.3), verificabilidade (→L2.4), revisão explícita (nunca absorção silenciosa).

### L2 — Consequências dos Eixos

**L2.1 — Separação de nível de responsabilidade.** Quem decide não executa; quem executa não decide. Não é princípio externo — deriva da necessidade de L1.1 funcionar. Ambiguidade na direção da porta diagnostica violação.

**L2.2 — Uniformidade entre granularidades.** O princípio vale identicamente em todas as escalas. Um princípio que muda de forma entre escalas é um conjunto de regras ad hoc.

**L2.3 — O vocabulário da porta é determinado pelo decisor.** A porta é expressa na linguagem em que o decisor confirma satisfação. Humano → prosa. Código → tipos. Forçar formalidade onde o decisor não pode processá-la é teatro.

**L2.4 — A porta é o critério de correção da implementação.** Implementação correta sse satisfaz a porta. Um teste que passa mas contradiz a porta está errado. A porta responde "quem testa os testes?". Divergência obriga retorno à fase de especificação: "dentro dessa limitação, qual a melhor forma de servir o humano?" — nunca "vamos agradar o código". (→L2.8)

**L2.5 — O humano é a única origem da cadeia.** Toda autoridade traça de volta ao humano. Galho onde a ponta é implementação = violação.

**L2.6 — Cadeia finita e acíclica.** (Teorema pedagógico, derivável de L1.1+L2.1+L2.2+L2.5.) Dependências mútuas diagnosticam violação.

**L2.7 — Decisor único por par.** (Teorema pedagógico, derivável de L1.1+L2.1.) Autoridade mista → separar dimensões em entidades distintas.

**L2.8 — O humano é o critério último de correção.** (Derivado de L2.4+L2.5.) Divergência resolvida em favor do humano, sempre. Fecha a cadeia: humano é origem (L2.5) e destino (L2.8).

**L2.9 — Os dois humanos e sua prioridade.** Usuário do produto (runtime) e desenvolvedor (build-time). Sem hierarquia de importância, com prioridade de sequência: porta do usuário primeiro, porta do desenvolvedor depois. Consequência de L1.2. A relação é de sequência lógica, não de valor.

**L2.10 — Fronteira da cadeia com infraestrutura.** Entidades transversais sem decisor específico do produto ficam fora da cadeia. Suas portas são do humano desenvolvedor diretamente. Não são exceções ao princípio — estão fora do escopo da cadeia.

### L3 — Prática de Especificação

L1.2, L2.3, L2.4 e L2.9 juntos determinam uma ordem de produção:

1. **Porta do usuário do produto.** Comportamento observável — estados, transições, invariantes, edge cases — sem referência a implementação. (L2.3+L2.9)
2. **Identificação da entidade raiz** conforme arquitetura do projeto.
3. **Porta do desenvolvedor.** Superfície pública, modos de uso, contratos — vocabulário técnico, organizado por uso, não por estrutura interna. (L2.3+L2.9)
4. **TDD com as duas portas.** A primeira fornece *o que* testar; a segunda, *como* exercitar. UseDD recomenda TDD, não reivindica fundação sobre ele.
5. **Entidades subsequentes.** Porta ditada pela entidade-decisora. Com porta + stub do decisor, TDD é aplicável.
6. **Portas não são documentação.** Precedem e constrangem. Mas como a implementação as satisfaz (L2.4), permanecem verdadeiras depois — servem como referência sem documento separado.

**Relação entre as duas portas:** A primeira é critério de correção ("o que faz?"); a segunda é critério de consumo ("como uso?"). A segunda é constrangida pela primeira. A sequência espelha a cadeia de autoridade: humano → porta comportamental → entidade raiz → porta de interface → implementação → entidades internas → portas → implementações.

---

## II. Auditoria Filosófica — Vereditos Finais

### Estrutura de premissas

- **P0** (fundacional): Software é artefato para humanos. Analítica.
- **P1** (axiomática): Autoridade é direcional e assimétrica em cada par. Escolha de modelagem.
- **P4** (operacional): A porta precede a implementação. Independente — é onde UseDD passa de princípio abstrato a princípio com prática.
- **P2** (transitiva) e **P3** (finitude): Deriváveis de P0+P1. Não são premissas independentes.

Estrutura mais enxuta do que aparenta: duas premissas genuínas, uma operacional, duas consequências.

### Lógica interna

Consistente. O grafo de dependências é um DAG com duas raízes (L1.1, L1.2) e um sumidouro (L2.8). Sem circularidade, sem contradição. L2.6 e L2.7 são teoremas anotados como pedagógicos. Teste de completude: as duas lacunas iniciais (múltiplos humanos, múltiplos decisores) foram resolvidas dentro do framework (L2.9 e L2.10), confirmando que o sistema é mais completo do que a primeira análise sugeriu.

### Interação com o meio

UseDD não compete com TDD/API-first/DIP e não pretende explicar por que existem (essas práticas têm genealogias próprias). Compartilha superfície na dimensão do desenvolvedor. Sua contribuição distintiva — cadeia de autoridade contínua do usuário final ao código — é exclusiva. UseDD pode servir como critério de avaliação de instâncias dessas práticas (diagnosticando inversão de autoridade).

O tratamento de restrições é sólido: revisão da porta por impossibilidade (decisor revisa) é legítima; absorção pela implementação (implementação usurpa) é ilegítima. Critério: quem decide?

O argumento da DX dissolve a dicotomia "servir usuário vs. servir desenvolvedor": cada relação de uso tem seu humano; cada humano merece cadeia de autoridade respeitada.

### Classificação

UseDD é um **princípio de design** (não meta-princípio, desde que incorporou L3). Relacional e sequencial: não descreve propriedade de artefato isolado, mas relação entre dois + ordem de estabelecimento. Da mesma categoria que SRP, DIP — mas com dimensão relacional que os diferencia.

### Vocabulário unificado

Decisão final: só "porta" e "entidade" em todas as regras. "Spec" eliminado (diferença temporal não justifica termo novo). "Módulo" eliminado das regras (usado em exemplos, não em definições — preferência por regras universais, exceções em último caso).

---

## III. Explanandum — Identificação do Fenômeno

> Etapa 1 (Beaney): registrar o fenômeno antes de teoria. Critério: reconhecível por engenheiro competente que nunca ouviu falar de UseDD.

### Fenômeno primário

Decisões técnicas sistematicamente produzem constrangimentos sobre o que humanos podem fazer, querer ou entender dentro de um sistema. A direção predominante é assimétrica: o humano adapta-se ao sistema com mais frequência do que o inverso. Quem constrói é também um humano constrangido por suas próprias decisões futuras.

Os praticantes divergem sobre se essa assimetria é inevitável, aceitável ou falha. Essa divergência é parte do fenômeno — evidência de tensão normativa não resolvida.

### Manifestações

**2.1 — Constrangimento técnico→humano.** Decisões em vocabulário técnico produzem efeitos em vocabulário experiencial; o segundo não estava presente na decisão. Divergência: se é evitável ou constitutivo.

**2.2 — Adaptação silenciosa.** Humano contorna, evita, reinterpreta. Invisível porque bem-sucedida. Hesitação: fronteira entre complexidade inerente e imposta.

**2.3 — Assimetria retroalimentada.** Quem decide está menos exposto às consequências. Feedback fraco, atrasado ou inexistente. Divergência: solução organizacional vs. técnica.

**2.4 — Construtor como constrangido.** O dev no momento da decisão se percebe como agente, não como paciente futuro. "Dívida técnica" é um nome parcial para isso.

**2.5 — Negligência sem culpado.** Acumulação de decisões localmente razoáveis, sem intenção individual. Divergência: solução estrutural vs. cultural.

**2.6 — "Bom o suficiente".** Quem arbitra trade-offs? Quais dimensões são negociáveis? Hesitação: fronteira entre "não dá tempo" legítimo e desculpa.

**2.7 — Gradiente de competência.** Designer programando: tensão mínima. Dev sem formação em design: tensão máxima. Em times: pendular conforme gerência prioriza design ou implementação — o pêndulo desloca a tensão, não a resolve. A separação de papéis pode ter consolidado a mentalidade que produz o constrangimento — inclusive em devs solo.

**2.8 — Delegação sem aquisição.** Devs delegando design a IA sem critério para avaliar. Devs aplicando processo de engenharia como se fosse suficiente para design de produto. Engenharia responde "está correto/testado/entregue" mas não "serve a quem usa/faz sentido/resolve o problema certo".

**2.9 — DX como preocupação tardia.** A experiência do construtor só passou a ser nomeada como problema quando produziu efeitos mensuráveis. Hesitação: se DX é o mesmo que UX aplicado a outro público ou algo estruturalmente diferente.

**2.10 — Constrangimento invisível.** O enquadramento habitual do trabalho não apresenta experiência humana como variável. Presente na formação, ferramentas, métricas e estrutura organizacional. Divergência: maioria justificável por restrições reais, ou maioria produzida pela moldura?

**2.11 — Presunção de escala.** Mitigação descartada em contextos pequenos antes de ser tentada. Divergência: questão de recurso ou de atenção?

### Fenômenos subsidiários

**3.1 — "Uso"** cobre relações heterogêneas (consumo, interação, dependência) sem distingui-las. Hesitação: se "usar" é a mesma coisa quando sujeito é humano e quando é código.

**3.2 — "Forma"** nomeia a estrutura de constrangimentos imposta, mas sem análise. Hesitação: objetiva ou contextual?

### Mapa de hesitações

| Hesitação | Sente | Não articula |
|---|---|---|
| Complexidade inerente vs. imposta | "Parte é culpa nossa" | O critério de separação |
| Legítimo vs. desculpa | "Às vezes é real, às vezes é preguiça" | A fronteira |
| Mesmo fenômeno vs. distintos | "Dev sofre como user" | Se a estrutura é a mesma |
| Uso humano vs. técnico | "Humano 'usa' app; módulo 'usa' módulo" | Se é a mesma relação |
| Forma boa vs. adequada | "Objetivamente ruim" vs. "depende" | Status normativo |
| Processo vs. cultura | "Processo melhor" vs. "pensar diferente" | Relação entre os dois |
| Quem arbitra | "Alguém precisa decidir" | Por que o direito não é auto-evidente |
| Pessoa vs. estrutura | "Devs com visão ampla" vs. "processos que compensem" | Onde reside a causa |
| Moldura invisível | "Não ignorei — não apareceu" | Se a maioria é escolhida ou produzida |
| Escala como pré-requisito | "Coisa de empresa grande" | Se é recurso ou atenção |
| DX como UX | "Experiência do dev é experiência do usuário" | Se a relação é do mesmo tipo |
| Delegação vs. aquisição | "IA faz o design pra mim" | Se substitui a competência |
| Herança da separação | "Nunca foi meu trabalho" | Se resolveu ou consolidou |

---

## IV. Decomposição do Explanandum

> Etapa 2 (Beaney): decompor o explanandum revelando camadas, estrutura, relações e pressupostos.

### Camadas identificadas

- **Factual:** presente. Afirmações sobre decisões técnicas, efeitos sobre humanos, padrões organizacionais, feedback, formação, IA, DX, divergências.
- **Valorativa:** presente, mas não declarada. Opera via seleção lexical ("constrangimento", "negligência"), enquadramento organizador (experiência humana como fenômeno central), e formato das divergências (valores já reconhecidos pelos praticantes).
- **Prescritiva:** ausente. Nenhum imperativo formulado.

### Decomposição factual

**Pressupostos primitivos (modo regressivo):**
1. "Decisão técnica" é categoria identificável.
2. "Experiência humana" é domínio coerente e distinto do técnico.
3. Causalidade opera de decisões para constrangimentos.
4. Assimetria temporal entre decisão e consequência.
5. "Praticantes" formam comunidade com observações compartilhadas.
6. Feedback pode falhar em retornar ao decisor.

**Elementos mínimos (modo resolutivo):**
- F1–F4: Decisões técnicas produzem efeitos sobre humanos; incluem impossibilidade, dificuldade, confusão, custo; vocabulário experiencial ausente na decisão; direção predominante humano→sistema.
- F5–F8: Adaptação silenciosa, separação decisor/afetado, feedback fraco, retroalimentação da assimetria.
- F9–F10: Construtor como constrangido futuro, percepção de agente no momento da decisão.
- F11–F12: Emergência sem intenção, ausência de intenção não elimina constrangimento.
- F13–F15: Gradiente de competência, separação de papéis consolida mentalidade, efeito persiste sem a separação.
- F16–F19: Delegação sem critério, engenharia ≠ design de produto, enquadramento exclui experiência, presunção de escala.
- F20–F21: "Uso" e "forma" como vocabulário instável.

**Problemas de analisabilidade (modo transformativo):**
1. "Constrangimento" unifica fenômenos categorialmente distintos (impossibilidade binária, dificuldade gradual, confusão epistêmica, custo temporal). Se legítimo, o critério de unificação precisa ser declarado.
2. "Assimetria predominante" sem critério de mensuração — inverificável na forma atual. Reformulação: "adaptação humana ao sistema é mais frequente, visível e documentável do que a inversa."
3. "Vocabulário ausente" é ambíguo entre três leituras: (a) acessível mas não invocado, (b) não representável nas ferramentas, (c) não adquirido como competência. Cada uma implica diagnóstico e intervenção diferentes.

### Decomposição valorativa

**Pressupostos primitivos:**
1. Experiência humana tem peso normativo.
2. Constrangimento não justificado é prima facie indesejável (inversão do ônus: problemático até que se justifique).
3. Invisibilidade agrava (impede contestação e negociação).

**Juízos elementares:**
- V1: Experiência humana importa — decisões podem errar sobre ela.
- V2: Constrangimento requer justificação (ônus sobre quem constrange).
- V3: Adaptação silenciosa é custo, não competência.
- V4: Falha de feedback impede contestação.
- V5: Competência para antecipar experiência é virtude profissional.
- V6: Delegação sem aquisição ≠ competência.

**Problema central:** a camada nega sua própria presença. O documento se apresenta como pré-teórico mas carrega compromissos de valor no enquadramento. A camada valorativa opera sem controle porque não é reconhecida. Reformulação necessária: declarar que o explanandum é organizado em torno do compromisso de que experiência humana tem peso normativo e constrangimentos são prima facie problemáticos.

### Passagem factual→valorativa

Não justificada explicitamente. Realizada por meios retóricos: "constrangimento" (normativo disfarçado de descritivo), "silenciosa" (factual com implicação valorativa), "retroalimentação" (conotação de patologia). A passagem importa compromissos de valor sem declará-los. A análise normativa construída sobre este explanandum herdará esses compromissos — deve examiná-los.

### Pressupostos não declarados (inventário consolidado)

| # | Pressuposto | Tipo | Efeito da ausência |
|---|---|---|---|
| P1 | Experiência humana é critério relevante | Valor | Norma inválida — restam descrições de mecânica |
| P2 | Constrangimento é prima facie indesejável | Valor | Norma inválida — recorrência não marca problema |
| P3 | Transferir custo a quem não decide exige justificação | Valor | Norma enfraquecida |
| P4 | Assimetria decisor/afetado tem peso normativo | Valor | Norma enfraquecida |
| P5 | Usuário e desenvolvedor pertencem ao mesmo espaço normativo | Valor | Norma incompleta |
| P6 | Parcela relevante é evitável/mitigável | Empírico | Norma enfraquecida |
| P7 | Visibilidade entre decisão e consequência melhora qualidade normativa | Valor | Norma enfraquecida |
| P8 | Competência de design não é substituída por processo/IA | Empírico | Norma enfraquecida |
| P9 | Restrições não legitimam por si sós qualquer constrangimento | Valor | Norma incompleta |
| P10 | Domínios técnico e experiencial são distintos | Filosófico | Fenômeno central desaparece |
| P11 | "Constrangimento" nomeia fenômeno unificado | Classificatório | Explanandum descreve vários problemas |
| P12 | Falha de feedback é estrutural, não apenas prática | Conceitual/Empírico | Fenômeno se reduz a problema de engenharia |
| P13 | Observação pré-teórica é possível | Epistemológico | Status do explanandum muda |
| P14 | Leitor compartilha compromisso valorativo | Pragmático | Alcance da norma limitado |
| P15 | Adaptação silenciosa oculta custo | Empírico/Valor | Adaptação seria cenário ideal, não problema |
| P16 | Competência e atenção são separáveis de recursos | Empírico | Norma se torna "invista mais" |

---

## V. Casos de Objeção e Alinhamento

**Caso 1 — "UseDD é basicamente TDD + API-first + DIP."**
Alinhamento: UseDD não explica por que essas práticas existem (têm genealogias próprias). Compartilha superfície na dimensão do desenvolvedor. A contribuição distintiva — cadeia de autoridade contínua do usuário ao código — é exclusiva. UseDD pode funcionar como critério de avaliação dessas práticas, não como fundação.

**Caso 2 — "É para priorizar o humano em vez do computador/legado/framework."**
Alinhamento: O problema não está nas limitações reais. A inversão existe no dia 1. Foi normalizada: PM faz pitch de feature para dev aceitar; dev é "pragmático", PM é "sem pé no chão". A inversão tem org chart, processo e cultura de profissionalismo.

**Caso 3 — "Impraticável, bonito só no papel."**
Alinhamento: Restrições são reais e não ignoradas. Mas a porta não muda para acomodar implementação conveniente — é atualizada respeitando a cadeia: "dentro dessa limitação, qual a melhor forma de servir o humano?" Revisão por impossibilidade (decisor revisa) é legítima. Absorção pela implementação é ilegítima.

**Caso 4 — "Praticável, mas não empatizei."**
Alinhamento: O usuário do produto não é o único humano. Desenvolvedores que consomem APIs são humanos com autoridade. Abandonar UseDD é deixar de cuidar do próprio eu futuro. UseDD atua em cada fronteira de entidade, não só na fronteira do sistema.

---

## VI. Enquadramento Retórico (estilo Uncle Bob)

Pontos-chave para argumentação intuitiva:

- "PM que precisa vender feature para dev" é evidência de inversão institucionalizada. O representante do humano precisa convencer o construtor — e o construtor que recusa é chamado de pragmático.
- "Se a spec muda para combinar com o código, o código tem autoridade." Isso é a inversão. Não dramática, não maliciosa — silenciosa.
- A pergunta nunca é "o que conseguimos construir dadas as restrições?" — é "dadas as restrições, qual a melhor forma de servir esse humano?" Parecem similares, não são. A primeira tem o sistema no centro; a segunda, o humano.
- "O humano" não é só o usuário final. Quem chama a API, compõe com o componente, lê a assinatura da função às 23h — são humanos. Frequentemente o próprio dev, seis meses depois, em outro branch.
- UseDD não vive só na fronteira do sistema. Vive em cada fronteira de entidade, porque em cada uma há um humano do lado que chama.
- Boa DX não é cortesia — é o princípio aplicado consistentemente.

---

## VII. Método — Identificação e Delimitação do Problema Normativo

> Etapa 1 da tradição analítica: formular a questão com precisão antes de tudo.

### Subdecisões da delimitação

**1. Tipo de questão normativa.** Distinguir: primeiro ordem ("É errado X?"), metaética ("O que significa 'errado'?"), aplicada ("Deve o Estado X?"), conceitual ("O que conta como X?"). Confundi-las perde coerência. Declarar explicitamente qual é.

**2. Desagregar a questão composta.** Questões reais embutem várias distintas — conceitual, empírica, distributiva, deontológica, etc. Paper analítico escolhe uma e explicita as outras como deixadas de lado. (Frances Kamm: "question map" antes de qualquer argumento.)

**3. Especificar o explanandum com precisão cirúrgica.** Pode ser julgamento particular, princípio geral, instituição/prática ou conceito normativo. O erro típico é "the target keeps moving" (Thomson): reformular a tese cada vez que surge objeção. Escrever em uma única frase.

**4. Condições de contorno.** Pressupostos empíricos, metaéticos, escopo de aplicação, o que está bracketed. Scanlon em *What We Owe to Each Other* como modelo: páginas iniciais sobre o que a teoria não pretende cobrir.

### Estrutura de abertura (padrão MIT/NYU/Oxford/ANU)

1. Apresentar questão bruta.
2. Mostrar por que é filosoficamente problemática.
3. Reformular com precisão.
4. Justificar os recortes.
5. Sinalizar estrutura do argumento.

### Teste de precisão

Se não consegue descrever cenário que refutaria a tese, ela não está delimitada o suficiente para ser tese filosófica.

### Exemplo canônico

Thomson em *A Defense of Abortion*: bracketa se feto é pessoa, assume que é, e pergunta se mesmo assim aborto é sempre impermissível. O movimento (assumir premissa mais favorável ao oponente) é exemplo máximo de delimitação bem-feita.

---

## VIII. Contexto de Origem

UseDD surgiu da prática de um desenvolvedor solo que é simultaneamente PM e SE. A formalização não foi epifania epistêmica — foi consequência de não haver handoff entre papéis. Quando não há PM que "entrega" a spec, o dev precisa produzi-la explicitamente ou ela não existe. Isso resolve um problema sub-documentado: como um desenvolvedor solo mantém rigor de especificação sem organização distribuindo o trabalho entre papéis.

A SSMV (Svelte Model View) é a primeira instância de UseDD como arquitetura. UseDD fundamenta a SSMV mas não é a SSMV. As propriedades de UseDD são reais independentemente da origem.

### Autorialidade

Conceitos com baixa autorialidade (consolidados na literatura): contract-first, information hiding (Parnas 1972), Design by Contract (Meyer 1986), Red-Green-Refactor (Beck), Functional Core/Imperative Shell (Bernhardt 2012).

Conceitos com alta autorialidade (sem precedente preciso): a cadeia de autoridade contínua do usuário ao código como princípio de design; a separação formal de portas por tipo de humano (UX vs. DX); Behavioral Spec como artefato autônomo (não seção de PRD); user stories descrevendo o desenvolvedor (transposição de JTBD ao design de API).

O mais próximo na literatura é Spec-Driven Development (sequência, autoridade, verificabilidade). BDD é segundo — mas colapsa spec e teste. Nenhum separa explicitamente audiência do spec da audiência da interface, nem afirma que essa separação é o mecanismo de design centrado em humanos.
