# Fase 4 — Threshold Probing

## 1. Objetivo da fase

Identificar, para cada par de julgamento formado na Fase 3, **o ponto exato em que o julgamento do praticante migra** — de `R1` para `R2`/`R3`, ou de `R2` para `R3` — e, com isso, tornar visível o fator que ele está tratando como normativamente relevante mesmo sem articulá-lo como princípio.

A pergunta operacional da fase, conforme §8 Fase 4 do plano, é:

> Variando uma única condição por vez, em que ponto o julgamento firme de "não havia desculpa" passa a admitir "era o que dava para fazer" — e o que essa condição tem de distintivo?

O produto visado é duplo:

1. **Mapa de limiares por par** — onde, concretamente, o julgamento muda.
2. **Primeira lista de fatores candidatos a "motivos"** — os fatores que ocupam esses limiares, ainda sem diagnóstico de estatuto normativo (isso virá na Fase 5).

## 2. Procedimento de probing

### 2.1. Direção de variação por tipo de par

Os pares da Fase 3 admitem três regimes de probing distintos:

- **Pares R1↔R3-I (P1, P2, P3)** — *subtração progressiva*. Toma-se o polo R3 (cujo praticante já ofereceu uma justificativa confortável) e remove-se, uma a uma, as condições que sustentam o fator invocado, observando em que ponto a justificativa colapsa.

- **Pares R1↔R2-R (P4, P5, P6, P7, P8)** — *adição progressiva*. Toma-se o polo R1 (cujo praticante condena sem reservas) e adiciona-se, uma a uma, condições que tornam o caso progressivamente mais parecido com o polo R2, observando em que ponto (se em algum) o praticante passa a aceitar alguma forma de justificativa.

- **Par R2↔R3 (P9)** — *medição de densidade*. Como ambos os polos já oferecem justificativa, o probing varia **quanto o custo alegado é efetivamente medido** versus **quanto é apenas alegado**, observando o ponto em que a justificativa colapsa sob exame.

### 2.2. Famílias de variação utilizadas

Conforme §8 Fase 4 do plano, as famílias disponíveis são:

- tempo adicional (real/inexistente);
- alternativa técnica superior (explorada/não explorada);
- conhecimento do decisor sobre impacto no afetado;
- existência de canal de feedback do afetado;
- custo de refatoração em código de outra equipe;
- veto institucional ou de gestão;
- requisito real de segurança, privacidade, integridade ou regulação;
- legado apenas incômodo versus compromisso vinculante;
- opacidade entre decisão e consequência;
- distância temporal entre decisor presente e afetado futuro;
- difusão de responsabilidade entre equipes;
- acúmulo incremental versus decisão única;
- default de ferramenta, hábito local ou conveniência de implementação;
- previsões especulativas de escala/complexidade;
- diferença entre custo inevitável e custo transferido ao afetado.

Nem todas se aplicam a todos os pares. Para cada par, selecionaram-se as três a cinco famílias mais informativas, evitando variação mecânica.

### 2.3. Critério de localização do limiar

Um limiar é o ponto em que a condição variada, e apenas ela, basta para que o praticante deixe de sustentar o julgamento anterior. A unidade de registro é:

> "no caso base, o praticante diz X; ao se variar apenas a condição C, ele passa a dizer Y."

Quando a variação **não** muda o julgamento, isso também é registrado: a insensibilidade do julgamento a uma condição candidata é, em si, um dado filosófico.

### 2.4. Formato de registro por par

Cada par recebe cinco seções:

1. **Caso-base** — polo inicial do probing.
2. **Sequência de variações** — variações ordenadas, cada uma isolando uma família.
3. **Limiar** — onde o julgamento migra.
4. **Variações que *não* movem o julgamento** — contra-evidências úteis.
5. **Fator candidato refinado** — formulação mais precisa que a oferecida na Fase 3.

---

## 3. Mapa de limiares

### P1 — Estrutura da implementação imposta ao contrato público

**Caso-base (polo R3-I):** C13 — definição de tipo `Order` espelha diretamente o schema da tabela `orders` porque é auto-gerada por tooling que lê o banco.

**Sequência de variações (subtração):**

- **V1.** *Remover o default de ferramenta.* Supor que o tooling de auto-geração não existe e o praticante precisaria escrever os tipos manualmente. → Julgamento migra imediatamente para R1: sem o tooling, a escolha de espelhar o schema é indistinguível do caso C01 (nome ditado pela implementação).
- **V2.** *Manter o tooling, mas mostrar alternativa técnica equivalente em garantia.* Apresentar um gerador capaz de produzir tipo de domínio (não espelho do schema) com a mesma garantia de consistência banco↔código. → Julgamento migra para R2: o praticante passa a reconhecer que a auto-geração era instrumento, não comprometimento.
- **V3.** *Manter tooling, remover a consistência como comprometimento.* Supor que a divergência banco↔código não gere nenhum incidente em prática conhecida. → Julgamento migra para R1: sem a ameaça de drift, o tooling é mera conveniência.
- **V4.** *Tornar a consistência um requisito regulatório.* Supor que exista obrigação de auditoria campo-a-campo entre banco e código por razões de compliance. → Julgamento permanece em R3 — e aqui o praticante sustenta a justificativa mesmo quando descrito do lado do afetado.

**Limiar:** o julgamento colapsa na **V2** (alternativa técnica equivalente em garantia) — porque este é o ponto em que o fator invocado perde seu caráter de restrição e revela-se como preferência por um instrumento específico. Mas sobrevive em **V4**, onde a consistência vira obrigação externa.

**Variações que não movem o julgamento:**

- Aumento de tempo disponível: indiferente. O tempo não é a restrição invocada.
- Canal de feedback do consumidor do tipo: indiferente enquanto o argumento de consistência estiver ativo.

**Fator candidato refinado:** *"default de ferramenta aceito sem exame de alternativas com garantia equivalente"*, com um sub-componente ocasional de *"consistência como obrigação externa vinculante"*.

---

### P2 — Sequência/cerimônia ditada pela arquitetura interna

**Caso-base (polo R3-I):** C09 — biblioteca exige `new Client(new Transport(new Serializer()))` porque as camadas foram separadas para testabilidade e extensibilidade.

**Sequência de variações (subtração):**

- **V1.** *Mostrar que um ponto de entrada simples pode coexistir com as camadas.* Apresentar o padrão `Client.default()` ou `createClient({ ... })` que internamente compõe as mesmas três camadas, preservando a capacidade de substituição em testes. → Julgamento migra para R1: o praticante reconhece que a dicotomia entre "cerimônia exposta" e "testabilidade" era falsa.
- **V2.** *Remover a testabilidade como comprometimento.* Supor que o consumidor nunca testa com mocks. → Julgamento migra para R1: sem testabilidade, a cerimônia vira pura exposição de implementação.
- **V3.** *Tornar a extensibilidade genuinamente requerida.* Supor que múltiplos transports e serializers sejam efetivamente trocados por consumidores conhecidos do mesmo ecossistema. → Julgamento permanece em R2 (não R3): o praticante concede extensibilidade como preocupação legítima, mas ainda aceita que haja um caminho rápido para o caso comum.
- **V4.** *Remover a hipótese de que o caminho rápido é construtível.* Supor que a linguagem/framework impeça sobrecarga de construtores ou `factory methods`. → Julgamento permanece em R3 — mas este cenário é artificial no ecossistema 2024–2026.

**Limiar:** o julgamento colapsa em **V1**, que é a variação mais barata e mais reveladora. A justificativa depende da premissa oculta de que "testável" e "amigável" são mutuamente excludentes; exposta a coexistência, a premissa se dissolve.

**Variações que não movem o julgamento:**

- Tempo adicional: irrelevante. O fator invocado não era tempo, era arquitetura.
- Custo de refatoração de outra equipe: irrelevante neste caso isolado.

**Fator candidato refinado:** *"falsa dicotomia entre preocupação legítima (testabilidade, extensibilidade) e conforto do consumidor, sustentada pela ausência de exame do espaço de coexistência"*.

---

### P3 — Fronteira interno/público não mantida

**Caso-base (polo R3-I):** C17 — configurar retries exige conhecer os três módulos internos (`transport`, `interceptor`, `client`) porque o encapsulamento interno "impede" uma opção unificada `{ retry: 3 }`.

**Sequência de variações (subtração):**

- **V1.** *Propor uma fachada que coordene os três módulos sem violar suas fronteiras.* A fachada traduz `{ retry: 3 }` em chamadas aos três módulos internamente. → Julgamento migra para R1: o "encapsulamento" era descrição do estado presente do código, não restrição sobre o que é possível fazer com ele.
- **V2.** *Manter o argumento de encapsulamento e mostrar que a tradução envolve escolha semântica real.* Supor que "retry = 3" tenha significados diferentes em cada camada (transport retransmite pacotes, interceptor reenvia requisição, client refaz chamada inteira) e que a fachada teria que escolher um. → Julgamento permanece em R2: o praticante agora concede que há uma decisão de design a ser tomada, mas ainda reconhece que deixar a decisão ao consumidor sem nenhuma recomendação é pior.
- **V3.** *Tornar a ambiguidade semântica intratável.* Supor que os três "retries" sejam incomparáveis e que qualquer síntese perca informação relevante para depuração. → Julgamento permanece em R3 — mas, mesmo aqui, o praticante tipicamente aceita que uma opção `{ retry: { transport: 3, interceptor: 0, client: 1 } }` é superior a expor os três módulos brutos.
- **V4.** *Mover a posição do praticante para o lado do afetado.* Apresentar o caso do ponto de vista de quem consome a biblioteca. → Mesmo em V3, o julgamento se enfraquece: o afetado sustenta que "alguma recomendação default é melhor que nenhuma."

**Limiar:** o julgamento colapsa em **V1** para o caso comum. A sobrevivência em V3 é parcial e instável sob inversão posicional.

**Variações que não movem o julgamento:**

- Tempo adicional: irrelevante. Fazer a fachada é trabalho trivial de um dia.
- Veto institucional: irrelevante neste recorte.

**Fator candidato refinado:** *"encapsulamento interno invocado para transferir ao consumidor o custo de coordenação entre módulos, sem exame de se a coordenação é semanticamente ambígua ou apenas não-feita"*.

---

### P4 — Defaults ditados pela conveniência de implementação

**Caso-base (polo R1):** C12 — date picker default para `new Date()` (hoje) mesmo em contextos onde hoje nunca é uma data válida (agendamento para o futuro, reserva mínima de 48h, etc.).

**Sequência de variações (adição, tentando reproduzir o fator de C08):**

- **V1.** *Adicionar: a próxima data disponível exige chamada assíncrona ao backend (regras de disponibilidade).* → Julgamento migra para R2: o praticante concede que um default síncrono é estruturalmente mais simples, embora ainda ache que mostrar "selecione uma data" vazio seria melhor que hoje.
- **V2.** *Adicionar: o componente é de terceiros e não aceita "sem default".* → Julgamento migra para R2 fraco: o praticante passa a aceitar que o default foi herdado, não escolhido.
- **V3.** *Adicionar: o cálculo da próxima data válida exige coordenação entre múltiplos módulos (fuso, feriados, regra de negócio).* → Julgamento migra para R2 estável: existe um custo real de implementação.
- **V4.** *Remover todas as adições anteriores: a alternativa melhor exige apenas trocar `new Date()` por `new Date(Date.now() + 2*24*3600*1000)`.* → Julgamento retorna a R1 imediatamente.

**Limiar:** o julgamento migra na **V1** (default síncrono como contingência estrutural). Reproduz-se exatamente o mesmo fator que opera em C08 ("fluxo de controle natural"). Mas o limiar é frágil: basta mostrar que o fluxo de controle natural admite uma variação trivial para que a justificativa recue.

**Variações que não movem o julgamento:**

- Tempo adicional: irrelevante. A alternativa custa minutos.
- Canal de feedback: relevante apenas para Fase 5, não muda o julgamento sobre a forma em si.

**Fator candidato refinado:** *"conveniência de fluxo de controle da implementação invocada como se fosse restrição, sustentada pela ausência de exame de variações triviais do mesmo fluxo"*.

---

### P5 — Superfície de erro descreve a mecânica interna

**Caso-base (polo R1):** C03 — mensagem de erro é literalmente `"State transition from DRAFT to PUBLISHED failed: invalid edge"`.

**Sequência de variações (adição, tentando reproduzir o fator de C14):**

- **V1.** *Adicionar: definir um tipo de erro de domínio exige boilerplate significativo (linguagem sem algebraic data types, sem pattern matching).* → Julgamento migra para R2: o praticante concede que o custo sintático de uma hierarquia de erros é não-trivial.
- **V2.** *Adicionar: a mesma mensagem aparece em uma linguagem moderna com erros tipados baratos (Rust, TypeScript, Kotlin).* → Julgamento retorna imediatamente a R1: o custo sintático era a única justificativa.
- **V3.** *Adicionar: os modos de falha são genuinamente múltiplos, com ações de recuperação distintas.* → Julgamento se mantém em R1, porque agora a ausência da taxonomia é ainda mais injustificada — é justamente o que o afetado precisaria.
- **V4.** *Adicionar: os modos de falha são indistinguíveis em termos de ação de recuperação do afetado.* → Julgamento migra para R2: não há mapeamento para construir, e a mensagem genérica deixa de ser escolha evitável para se tornar reflexo de uma ambiguidade real.

**Limiar:** a justificativa aparece em **V1** (custo sintático) e em **V4** (ação de recuperação única). Em ambos, o fator só é genuíno sob o ângulo do afetado: se, para o afetado, a distinção entre modos de falha é acionável, o custo sintático não pode ser invocado. Se para ele não é acionável, a própria distinção perde relevância.

**Variações que não movem o julgamento:**

- Tempo adicional: irrelevante isoladamente (o boilerplate recorre em cada novo erro, não é one-shot).
- Veto institucional: improvável para esta decisão local.

**Fator candidato refinado:** *"custo sintático de taxonomia de erros como substituto para a ausência de mapeamento entre modos de falha e ações de recuperação do afetado"*.

---

### P6 — Rotulação reflete o sistema, não a ação

**Caso-base (polo R1):** C04 — empty state exibe `"No items in collection"` usando o nome da entidade do modelo de dados.

**Sequência de variações (adição, tentando reproduzir o fator de C10):**

- **V1.** *Adicionar: a mensagem vem de um componente genérico de empty state compartilhado.* → Julgamento migra para R2: o componente recebeu o rótulo "Collection" porque o consumidor (o feature) passou o nome da entidade.
- **V2.** *Mostrar que o componente aceita um parâmetro `label` customizado.* → Julgamento retorna imediatamente a R1: o componente não impunha nada.
- **V3.** *Supor que o componente, por decisão arquitetural antiga, não aceita customização de rótulo.* → Julgamento migra para R2 estável. Mas neste ponto surge uma variação secundária crítica.
- **V4.** *Perguntar: o praticante alteraria o componente para aceitar o parâmetro?* Se sim em minutos, a justificativa de V3 colapsa. Se a alteração exigir migração coordenada de dezenas de consumidores atuais do componente, a justificativa de V3 sobrevive.

**Limiar:** o julgamento migra em **V1** e se estabiliza em **V3**, mas apenas condicionalmente à resposta de **V4**. Isto é: a "reutilização de componente" só funciona como fator quando combinada com *custo de refatoração em código de outra equipe* — sozinha, ela colapsa em segundos.

**Variações que não movem o julgamento:**

- Tempo adicional isolado: irrelevante se o custo de refatoração estiver presente; o tempo aqui é apenas proxy.
- Opacidade: o praticante normalmente sabe que o rótulo é ruim; não é um caso de invisibilidade.

**Fator candidato refinado:** *"reuso de componente compartilhado como pretexto para não customizar, sustentado apenas quando combinado com custo real de refatoração em consumidores existentes"*. Isolado, o reuso não basta.

---

### P7 — Comportamento runtime herda estrutura interna

**Caso-base (polo R1):** C16 — lista de resultados exibida na ordem em que o banco retorna (tipicamente ordem de inserção por ID), sem `ORDER BY` explícito.

**Sequência de variações (adição, tentando reproduzir o fator de C06):**

- **V1.** *Adicionar: ordenação explícita exige novo índice no banco com custo mensurável.* → Julgamento migra para R2: existe um trade-off real entre performance e previsibilidade de ordem.
- **V2.** *Mostrar que o volume de dados torna o índice irrelevante (centenas de registros).* → Julgamento retorna a R1.
- **V3.** *Adicionar: a ordem por inserção é, de fato, o que o domínio pede (ex.: feed cronológico).* → O caso sai do território de C16 e passa a ser um caso legítimo de alinhamento entre forma e intenção. Não é mais o mesmo fenômeno.
- **V4.** *Adicionar: preservar campos válidos do formulário (análogo a C06) comprometeria a consistência transacional.* → Julgamento migra para R2: consistência é comprometimento sustentado.
- **V5.** *Mostrar que a validação é por campo (como em C06) e não há transação envolvida.* → Julgamento retorna a R1: "consistência" era nome para "atomicidade da função de reset".

**Limiar:** em **V1** aparece uma justificativa genuína (custo de índice), mas ela desaparece em **V2** para qualquer volume realista. Em **V4**, "consistência de estado" só se sustenta enquanto não se pergunta se há, de fato, uma transação multi-campo a preservar. Ambos os limiares são posicionalmente frágeis.

**Variações que não movem o julgamento:**

- Tempo adicional: irrelevante. Custo de uma linha de código.
- Veto institucional: improvável.

**Fator candidato refinado:** *"apelo à 'consistência' ou 'atomicidade' como nomes para a ausência de lógica de preservação parcial, sem exame de se há, concretamente, uma transação a preservar"*.

---

### P8 — Assinatura/nomeação sem disciplina de API

**Caso-base (polo R1):** C18 — `getUser`, `fetchOrders`, `retrieveProducts` convivem no mesmo módulo sem razão distintiva.

**Sequência de variações (adição, tentando reproduzir o fator de C02):**

- **V1.** *Adicionar: os três nomes vêm de três submódulos historicamente escritos por autores diferentes.* → Julgamento migra para R2 fraco: há explicação histórica.
- **V2.** *Mostrar que um único PR de renomeação resolve, sem quebrar consumidores externos.* → Julgamento retorna a R1.
- **V3.** *Mostrar que a renomeação quebra consumidores externos em larga escala.* → Julgamento migra para R2 estável, mas agora com o fator *"custo de migração externa"*, que é diferente do fator original.
- **V4.** *Adicionar: dois comportamentos compartilham fluxo de controle interno (análogo a C02).* → Julgamento migra para R2: o praticante concede que havia uma "simplicidade de implementação" ao fundi-los.
- **V5.** *Perguntar ao praticante se ele aceitaria consumir uma API em que dois comportamentos independentes fossem fundidos em um flag apenas porque "quem implementou achou mais simples."* → O praticante rejeita sem hesitação. O fator de **V4** colapsa sob inversão posicional.

**Limiar:** o julgamento migra em **V1** e **V4**, mas **V5** é o dado filosoficamente decisivo: a inversão posicional dissolve o fator em V4 quase instantaneamente. V3 (custo de migração externa) é a única sobrevivente e é uma variação de família diferente.

**Variações que não movem o julgamento:**

- Tempo adicional: irrelevante isoladamente.
- Canal de feedback: parcialmente relevante; quando há feedback, V1 colapsa mais rápido.

**Fator candidato refinado:** *"compartilhamento de fluxo de controle interno invocado para fundir operações externamente distintas, posicionalmente instável"*. Um fator adjacente e diferente: *"custo de migração externa de consumidores"*, que é candidato a restrição real.

---

### P9 — Preservação do suboptimal por custo/risco alegado

**Caso-base (par inteiro):** C20 (R2-R, hardcoded por prazo) e C19 (R3-I, workaround preservado).

Este par não recebe variação de adição ou subtração. O probing aqui é de **densidade de exame**: o quanto o fator alegado é examinado versus meramente enunciado.

**Sequência de variações (medição de densidade):**

- **V1.** *Para C20: exigir contabilização concreta do custo alegado.* "Quanto tempo o hardcoded economizou?" Resposta típica: "umas horas." "Quanto tempo o workaround acumulou de custo no afetado desde então?" Resposta típica: dezenas a centenas de horas. → A justificativa "prazo" colapsa assim que a comparação é feita.
- **V2.** *Para C20: perguntar se a decisão foi revisada depois do prazo.* Resposta típica: não. → Revela que "prazo" foi o fator de entrada, não o fator de sustentação: a forma sobreviveu por inércia, não por pressão temporal contínua.
- **V3.** *Para C19: exigir exame da maturidade da API nativa disponível.* "A API nova é estável há quanto tempo?" "Quantos bugs conhecidos ela tem em comparação com o workaround?" → Tipicamente, a resposta revela que o exame nunca foi feito: o "risco de regressão" é estimativa a priori, não medição a posteriori.
- **V4.** *Para C19: perguntar se o praticante confiaria na mesma lógica de preservação se o autor original tivesse sido outra equipe.* → Julgamento enfraquece significativamente: o conforto de C19 está ancorado em familiaridade com o autor do workaround, não em avaliação independente.

**Limiares:**

- **C20** colapsa em **V1** (contabilização). A justificativa é fina — mal sobrevive ao primeiro cálculo.
- **C19** colapsa em **V3** (exame de maturidade) de forma gradual. Mais resistente que C20, porque o "risco" invocado é especulativo e, portanto, mais difícil de refutar com dados. A resistência, no entanto, é inversamente proporcional à disponibilidade de evidência — não à força normativa do fator.

**Variações que não movem o julgamento:**

- Tempo adicional disponível hoje: em C19, oferecer tempo não é suficiente porque o fator invocado é risco, não esforço.
- Veto institucional: irrelevante em ambos; não há proibição externa à mudança.

**Fator candidato refinado:** *"custo/risco alegado em vez de medido, sustentado pela assimetria de atenção entre decisor e afetado — o decisor sente o custo hipotético da mudança em primeira pessoa; o afetado absorve o custo real da não-mudança sem que esse custo retorne ao decisor como informação"*.

---

## 4. Primeira lista de fatores candidatos a "motivos"

Extraindo dos nove limiares acima, o corpus gera a seguinte primeira lista — ainda sem diagnóstico de estatuto normativo (N, R, ou misto), que será produzido na Fase 5:

| ID | Fator candidato | Pares de origem | Tipo de limiar |
|----|-----------------|-----------------|----------------|
| M01 | default de ferramenta aceito sem exame de alternativas com garantia equivalente | P1 | colapso sob alternativa técnica existente |
| M02 | consistência exigida externamente (compliance, auditoria) como obrigação vinculante | P1 (resíduo) | sobrevive à subtração |
| M03 | falsa dicotomia entre preocupação legítima e conforto do consumidor | P2 | colapso sob demonstração de coexistência |
| M04 | encapsulamento interno invocado para transferir custo de coordenação | P3 | colapso sob demonstração de fachada factível |
| M05 | ambiguidade semântica genuína entre camadas internas | P3 (resíduo) | sobrevive parcialmente, instável sob inversão |
| M06 | conveniência de fluxo de controle da implementação como se fosse restrição | P4 | colapso sob exame de variação trivial do fluxo |
| M07 | custo sintático de taxonomia de erros em linguagens pobres em tipos | P5 | colapso em linguagens modernas |
| M08 | ausência de mapeamento entre modos de falha e ações de recuperação | P5 (genuíno se o afetado tem ações distintas) | sobrevive do ângulo do afetado |
| M09 | reuso de componente compartilhado combinado com custo de refatoração externa | P6 | só sobrevive em combinação; isolado colapsa |
| M10 | "consistência" ou "atomicidade" como nomes para ausência de lógica de preservação parcial | P7 | colapso sob exame da natureza da transação |
| M11 | compartilhamento de fluxo de controle interno como razão para fundir operações externas | P8 | colapso sob inversão posicional |
| M12 | custo de migração externa de consumidores de API | P8 (adjacente) | candidato a restrição real |
| M13 | custo/risco alegado em vez de medido, mantido por assimetria de atenção decisor↔afetado | P9 | colapso sob contabilização e exame de maturidade |
| M14 | familiaridade com o autor original como substituto de avaliação independente | P9 (C19) | colapso sob inversão do autor |

Quatorze fatores candidatos, agrupáveis em quatro grandes agrupamentos estruturais:

- **Grupo A — Falsas restrições** (M01, M03, M04, M06, M09-isolado, M10, M11): fatores que se apresentam como limitação do espaço viável mas colapsam quando uma alternativa trivial ou já existente é examinada.
- **Grupo B — Restrições reais parcialmente absorvidas pelo afetado** (M02, M07, M12): fatores que sobrevivem à subtração, mas cujo peso normativo depende do regime de uso e do volume real de consumidores.
- **Grupo C — Conflitos internos do truísmo** (M05, M08): fatores onde o próprio afetado tem comprometimentos conflitantes e o decisor não pode resolver sozinho — candidatos a conflito normativo genuíno.
- **Grupo D — Fatores epistêmicos e posicionais** (M13, M14): fatores que não são sobre restrição, mas sobre como a informação flui (ou não flui) entre decisor e afetado.

Esta pré-classificação é **provisória**. A Fase 5 aplicará as perguntas diagnósticas obrigatórias (§8 Fase 5 do plano) a cada motivo e a Fase 6 aplicará o teste de inversão posicional como filtro. Só após essas duas fases é que o estatuto final (`N`, `R`, misto) poderá ser fixado.

---

## 5. Observações sobre variáveis não previstas

Duas famílias de variação **emergiram durante o probing** e não estavam explicitamente previstas entre as quinze famílias listadas em §8 Fase 4 do plano. Elas devem ser incorporadas antes da Fase 5:

### 5.1. Coexistência / espaço de "e/ou"

Em **P2** e **P3**, o fator decisivo não foi nenhuma das quinze famílias clássicas, mas a **demonstração de coexistência**: mostrar que duas preocupações aparentemente opostas (testabilidade × amigabilidade; encapsulamento × opção unificada) podem ser simultaneamente satisfeitas. O que move o julgamento não é a remoção de uma preocupação nem a adição de tempo, mas a revelação de que a disjunção era falsa.

Esta família — *"exame do espaço de coexistência entre preocupações aparentemente excludentes"* — é filosoficamente análoga à distinção entre "restrição" e "escolha de framing": o praticante tratava como mutuamente exclusivas coisas que não são. A presença ou ausência desse exame é um fator independente e deve ser adicionada ao repertório de variação.

### 5.2. Posição epistêmica entre autor original e autor atual

Em **P9** (C19), o fator decisivo foi a **identidade do autor do código preservado**. O praticante trata um workaround escrito por ele mesmo (ou por alguém em quem confia) com mais leniência do que trataria o mesmo workaround escrito por um estranho. Isto não é nenhuma das quinze famílias — é uma **família nova de viés posicional**, adjacente ao teste de inversão posicional mas distinta dele: não é "e se eu fosse o afetado" mas "e se o decisor original tivesse sido outro".

Ambas as famílias serão incorporadas à Fase 5 como dimensões adicionais de interrogação.

---

## 6. Orientação para a Fase 5

A Fase 5 deve tomar a lista de 14 motivos candidatos e aplicar, para cada um, as cinco perguntas diagnósticas obrigatórias (§8 Fase 5 do plano):

1. o fator reduz o conjunto de alternativas viáveis ou apenas torna uma delas menos conveniente?
2. é sustentado pelo praticante como comprometimento normativo independente, mesmo quando não o beneficia?
3. sobrevive ao teste posicional (Fase 6)?
4. vale igualmente em `runtime` e `build-time`?
5. altera a obrigação ou apenas obscurece sua violação?

O agrupamento provisório (A/B/C/D) da §4 sugere as seguintes expectativas para a Fase 5:

- **Grupo A** (M01, M03, M04, M06, M09-isolado, M10, M11) deve resolver-se majoritariamente como `R` (racionalizações), porque todos os seus limiares colapsaram sob exame trivial de alternativas.
- **Grupo B** (M02, M07, M12) contém candidatos mistos: parte é restrição real (compliance, linguagem, migração externa), parte é conveniência empacotada. A Fase 5 deverá decompô-los.
- **Grupo C** (M05, M08) contém os candidatos mais fortes a `N` (conflitos normativos genuínos), porque são fatores onde o próprio afetado tem comprometimentos conflitantes.
- **Grupo D** (M13, M14) não se resolve pelas perguntas normativas clássicas, porque são epistêmico-posicionais. Eles exigirão tratamento diferenciado na Fase 8, tipicamente via exigências procedimentais (visibilidade, rastreabilidade, exposição do afetado, exame de alternativas).

Também será necessário decidir, já na Fase 5, se **M02** e **M12** são motivos legítimos no sentido deste trabalho ou se apenas sinalizam que o caso original saiu do alcance da tese — isto é, deixa de ser "implementação impondo forma ao humano" e vira "restrição externa vinculante". Essa distinção é crucial porque não faz parte do escopo do truísmo resolver restrições externas legítimas; o truísmo opera no espaço do que está **sob controle de quem implementa**.

---

*Produto da Fase 4:*

1. **Mapa de limiares** para os nove pares (§3), com direção de probing, variações aplicadas, ponto de colapso da justificativa e variações insensíveis.
2. **Primeira lista de 14 fatores candidatos a motivos** (§4), pré-agrupados em quatro estruturas (A/B/C/D).
3. **Duas famílias de variação novas** (§5), incorporadas ao método: coexistência de preocupações e identidade do autor original.

*Próxima fase:* Fase 5 — *Diagnóstico do estatuto dos motivos*.
