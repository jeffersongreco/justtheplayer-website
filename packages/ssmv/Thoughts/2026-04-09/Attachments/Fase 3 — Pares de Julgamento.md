# Fase 3 — Coleta de Pares de Julgamento Não-Teórico

## 1. Objetivo da fase

Formar pares analiticamente úteis do tipo:

- "não havia desculpa" ↔ "era o que dava para fazer"

de modo a preparar o material para o *threshold probing* da Fase 4. Cada par deve ser construído com **casos estruturalmente próximos**, para que a mudança de julgamento observada entre os dois polos do par não seja confundida com mudança completa de fenômeno — e sim com a ativação de um fator específico que o praticante trata como normativamente relevante.

Pergunta orientadora da fase, conforme §8 Fase 3 do plano:

> Em que caso semelhante o praticante abandona a condenação e passa a aceitar a derrota prática do truísmo?

## 2. Método de pareamento

### 2.1. Princípios de formação dos pares

Cada par contém dois casos do corpus da Fase 1 (`Fases 1-2 — Corpus e Catalogação Inicial.md`, §5) selecionados por **proximidade estrutural** — isto é, por compartilharem:

- a mesma família de tensão (quando possível);
- o mesmo tipo de superfície de uso ou superfície estruturalmente análoga;
- o mesmo padrão geral de decisão (nome, assinatura, default, mensagem, etc.);
- a mesma direção do desvio em relação ao truísmo (forma ditada pela implementação em vez de pelo humano relevante).

O que **difere** entre os dois polos do par é:

- a posição no gradiente da Dimensão 1 (tipicamente R1 ↔ R3, ou R1 ↔ R2, com um par R2 ↔ R3 incluído onde a migração é informativa);
- o fator invocado para justificar a forma no polo mais brando.

### 2.2. Uso pretendido dos pares na Fase 4

Cada par será o ponto de entrada de uma rodada de *threshold probing*. O procedimento da Fase 4 tomará o polo R1 como **caso-base com condenação firme** e variará as condições até reproduzir o fator invocado pelo polo mais brando, observando em que ponto o julgamento migra. Alternativamente, tomará o polo R3 e removerá progressivamente o fator invocado, observando quando a justificativa colapsa.

Este segundo procedimento é o mais produtivo para os cinco casos indeterminados (C09, C11, C13, C17, C19), porque neles o trabalho filosófico central é saber se o fator invocado é condição necessária (conflito normativo genuíno) ou pretexto (racionalização).

### 2.3. Cobertura visada

Os nove pares abaixo cobrem:

- os 5 casos R3-I (cada um pareado com um caso R1 estruturalmente próximo ou com outro R3);
- os 7 casos R2-R (cada um pareado com um caso R1 ou com outro R2/R3 estruturalmente próximo);
- os 8 casos R1 (usados como base de condenação firme em pelo menos um par).

Todas as 7 famílias de tensão declaradas no plano (§8 Fase 1) aparecem em pelo menos um par.

---

## 3. Pares de julgamento

---

### Par P1 — Estrutura da implementação imposta ao contrato público

**Polo "sem desculpa":** C01 (R1, estável) — nome de método reflete a implementação interna
**Polo "era o que dava":** C13 (R3-I, parcial) — definição de tipo espelha o schema do banco

**Estrutura comum:** em ambos os casos, a forma pública (nome em C01, shape de tipo em C13) é determinada diretamente por um artefato da implementação (o mecanismo interno em C01, o schema do banco em C13), sem tradução para o modelo mental do consumidor. Em ambos, a alternativa melhor é explícita e conhecida (nomear pela intenção de uso; definir tipo de domínio).

**O que muda entre os polos:** em C01, nenhum fator é invocado — o praticante concorda que havia uma alternativa trivial. Em C13, o praticante invoca **auto-geração de tipos a partir do schema** como comprometimento sustentado (evitar divergência entre banco e código).

**Fator candidato a motivo:** "consistência garantida por tooling impede intervenção manual na forma."

**Pergunta para a Fase 4:** se a auto-geração fosse capaz de produzir um tipo de domínio (e não um espelho do schema), o praticante ainda invocaria o mesmo fator? Se sim, o fator era genuíno; se não, ele era instrumental ao conforto de não arcar com o custo da tradução.

---

### Par P2 — Sequência/cerimônia ditada pela arquitetura interna

**Polo "sem desculpa":** C05 (R1, estável) — ordem de parâmetros segue sequência de processamento interno
**Polo "era o que dava":** C09 (R3-I, parcial) — API exige cerimônia de inicialização (client + transport + serializer)

**Estrutura comum:** em ambos, a sequência que o consumidor deve reproduzir espelha a sequência interna da implementação (ordem de processamento em C05, ordem de composição de camadas em C09). Em ambos, a alternativa melhor é conhecida e implementável (reordenar por relevância / aceitar objeto nomeado em C05; ponto de entrada único para o caso comum em C09).

**O que muda entre os polos:** em C05, nenhum fator é invocado além de "fazia sentido para quem implementou." Em C09, o praticante invoca **testabilidade e extensibilidade** como comprometimentos sustentados.

**Fator candidato a motivo:** "separação em camadas é necessária para testabilidade/extensibilidade da biblioteca."

**Pergunta para a Fase 4:** se fosse possível preservar a separação em camadas **e** oferecer um ponto de entrada simples para o caso comum (ambos coexistindo), o praticante ainda sustentaria a cerimônia como necessária? Se não, o fator invocado era incompatibilidade aparente, não incompatibilidade real — isto é, a testabilidade não estava em conflito com a superfície amigável; apenas torná-las coexistir era trabalho adicional do autor.

---

### Par P3 — Fronteira interno/público não mantida

**Polo "sem desculpa":** C07 (R1, estável) — tipo de retorno inclui campo `_internal` irrelevante para o consumidor
**Polo "era o que dava":** C17 (R3-I, parcial) — configuração exige conhecimento dos módulos internos (transport, interceptor, client)

**Estrutura comum:** em ambos, a estrutura interna da implementação atravessa a fronteira que a separaria do consumidor — em C07 como poluição do tipo de retorno, em C17 como atravessamento de fronteiras pela API de configuração. Em ambos, o consumidor é forçado a raciocinar sobre divisões que existem apenas porque a implementação assim está organizada.

**O que muda entre os polos:** em C07, o fator invocado é trivialmente fraco ("criar tipo separado era trabalho adicional"). Em C17, o praticante invoca **separação de responsabilidades entre módulos internos** como comprometimento arquitetural sustentado.

**Fator candidato a motivo:** "o encapsulamento interno impede a exposição de uma opção unificada."

**Pergunta para a Fase 4:** se a opção unificada (`{ retry: 3 }`) pudesse existir sem quebrar o encapsulamento interno — por exemplo, como fachada que coordena os três módulos sem violar suas fronteiras —, o praticante ainda invocaria o encapsulamento? Se não, o encapsulamento estava sendo usado para justificar a transferência do custo de coordenação ao consumidor.

---

### Par P4 — Defaults ditados pela conveniência de implementação

**Polo "sem desculpa":** C12 (R1, estável) — date picker default para hoje (`new Date()`)
**Polo "era o que dava":** C08 (R2-R, instável) — timeout default `0` como sentinel falsy

**Estrutura comum:** em ambos, o valor default foi escolhido pela facilidade de implementação (o construtor trivial em C12, o valor falsy natural em C08), sem consideração pela consequência no uso. Em ambos, existia um default melhor conhecido e factível (próxima data disponível em C12; duração finita razoável em C08).

**O que muda entre os polos:** em C12, nenhum fator substantivo é invocado — o default trivial "não exigia lógica adicional." Em C08, o praticante invoca **simplificação do fluxo de controle** e **convenção de sentinel falsy** como justificativas.

**Fator candidato a motivo:** "o default deve seguir a semântica natural do fluxo de controle da implementação."

**Pergunta para a Fase 4:** se a simplificação do fluxo de controle tivesse, por acidente, resultado em um default razoável para o consumidor (e.g., `30` em vez de `0`), o praticante invocaria o fluxo de controle como razão? Se não, o fluxo de controle era racionalização retroativa de um acidente desfavorável.

---

### Par P5 — Superfície de erro descreve a mecânica interna em vez da ação do afetado

**Polo "sem desculpa":** C03 (R1, estável) — mensagem de erro descreve transição interna do state machine
**Polo "era o que dava":** C14 (R2-R, instável) — modos de falha distintos colapsados em erro genérico

**Estrutura comum:** em ambos, a superfície de erro é ditada pela estrutura interna da implementação, não pela necessidade do afetado. Em C03, o erro descreve *demais* (expõe o grafo de estados). Em C14, o erro descreve *de menos* (colapsa modos que exigiriam ações distintas). Em ambos, o afetado não recebe orientação para ação.

**O que muda entre os polos:** em C03, nenhum fator é invocado além de "o motor de estados gera automaticamente." Em C14, o praticante invoca **simplicidade de não definir hierarquia de exceções** como justificativa.

**Fator candidato a motivo:** "a estrutura de exceções deve seguir a simplicidade da implementação, não a taxonomia de ações de recuperação do afetado."

**Pergunta para a Fase 4:** se definir erros tipados fosse trivial (e.g., se a linguagem ou o framework oferecesse açúcar sintático sem custo), o praticante ainda invocaria simplicidade? A resposta determina se o fator era restrição real ou preferência por não arcar com o custo do mapeamento entre modos de falha e ações de recuperação.

---

### Par P6 — Rotulação reflete o sistema, não a ação

**Polo "sem desculpa":** C04 (R1, estável) — empty state usa vocabulário do modelo de dados ("No items in collection")
**Polo "era o que dava":** C10 (R2-R, instável) — botões genéricos "OK"/"Cancelar" em ação destrutiva

**Estrutura comum:** em ambos, o rótulo exibido ao usuário reflete a estrutura que o sistema usa internamente — o modelo de dados em C04, o componente de diálogo reutilizável em C10 — e não a tarefa que o usuário está executando. Em ambos, existia uma alternativa melhor conhecida e trivial (vocabulário do domínio; rótulos de ação concreta).

**O que muda entre os polos:** em C04, nenhum fator substantivo é invocado — o componente genérico recebeu o nome da entidade diretamente. Em C10, o praticante invoca **reutilização do componente de diálogo** como justificativa.

**Fator candidato a motivo:** "a reutilização de componentes impõe rótulos genéricos no caso particular."

**Pergunta para a Fase 4:** se o componente de diálogo aceitasse rótulos customizados como parâmetro simples (o que na maioria dos sistemas modernos é trivial), o praticante ainda invocaria a reutilização? Se não, o "componente não permite" era descrição conveniente de uma customização que simplesmente não foi feita.

---

### Par P7 — Comportamento runtime herda estrutura interna sem mediação

**Polo "sem desculpa":** C16 (R1, estável) — lista de resultados em ordem de ID do banco (sem `ORDER BY`)
**Polo "era o que dava":** C06 (R2-R, instável) — formulário limpa todos os campos em erro de validação

**Estrutura comum:** em ambos, um comportamento que o usuário observa em runtime é consequência direta de uma decisão estrutural interna que não foi mediada pela tarefa do usuário. Em C16, a ordem de iteração do banco aparece na tela. Em C06, a atomicidade da transação aparece no formulário. Em ambos, a alternativa melhor era factível (ordenação explícita; preservação dos campos válidos).

**O que muda entre os polos:** em C16, nenhum fator substantivo é invocado além de "o usuário pode reordenar manualmente." Em C06, o praticante invoca **simplicidade do modelo de transação atômica** e **garantia de consistência de estado**.

**Fator candidato a motivo:** "a consistência de estado exige tratamento atômico do formulário, mesmo ao custo do re-preenchimento."

**Pergunta para a Fase 4:** se preservar campos válidos não comprometesse a consistência (o que é trivialmente o caso quando a validação é por campo e não global), o praticante ainda invocaria consistência? O colapso da justificativa mostra que "consistência" estava sendo usada para cobrir a preferência por não implementar lógica de preservação parcial.

---

### Par P8 — Assinatura/nomeação sem disciplina de API

**Polo "sem desculpa":** C18 (R1, estável) — nomeação inconsistente entre funções relacionadas (`getUser`, `fetchOrders`, `retrieveProducts`)
**Polo "era o que dava":** C02 (R2-R, instável) — parâmetro booleano com efeito colateral não declarado

**Estrutura comum:** em ambos, a assinatura da API foi formada sem disciplina de contrato — cada autor (ou cada autor em cada momento) escolheu o que parecia natural no instante da implementação. Em C18, isso produziu inconsistência lexical sem ganho semântico. Em C02, produziu uma assinatura cuja semântica real excede a declarada. Em ambos, a alternativa era conhecida (convenção uniforme; separar operações).

**O que muda entre os polos:** em C18, nenhum fator é invocado além de "não havia convenção." Em C02, o praticante invoca **"os dois comportamentos estavam no mesmo fluxo de controle"** como justificativa.

**Fator candidato a motivo:** "comportamentos que compartilham fluxo de controle interno devem compartilhar ponto de entrada externo."

**Pergunta para a Fase 4:** o praticante aplicaria o mesmo princípio em contexto inverso — isto é, aceitaria receber uma API em que dois comportamentos independentes foram fundidos em um flag apenas porque quem implementou achou mais simples? A resposta esperada é negativa, revelando a instabilidade posicional do fator.

---

### Par P9 — Preservação do suboptimal por custo/risco alegado

**Polo "tentou justificar":** C20 (R2-R, instável) — valor hardcoded por prazo alegado
**Polo "era o que dava":** C19 (R3-I, parcial) — workaround preservado porque "funciona"

**Estrutura comum:** em ambos, o praticante preserva uma forma suboptimal invocando um fator de custo/risco — "não havia tempo" em C20, "mudar arrisca regressão" em C19. Em ambos, existia uma alternativa conhecida e factível (tornar configurável; migrar para API nativa). Em ambos, o custo da não-mudança já foi absorvido pelo afetado em quantidade significativa ao longo do tempo.

**O que muda entre os polos:** este é o único par composto por dois casos já no território da justificativa (R2 ↔ R3). O interesse analítico do par está em mapear a **densificação** da racionalização: C20 oferece a justificativa mais fina ("prazo"), rapidamente colapsável sob inversão posicional; C19 oferece a justificativa mais densa ("risco de regressão em algo que funciona"), que resiste mais.

**Fator candidato a motivo:** "o custo/risco de mudar a forma atual derrota a obrigação de oferecer a melhor forma."

**Pergunta para a Fase 4:** a Fase 4 deve variar, para este par, o grau em que o custo é *avaliado* vs. meramente *alegado*. O critério é: o praticante sustenta o fator quando o custo é efetivamente medido e mostrado inferior ao custo acumulado da não-mudança? Em C20, "uma hora economizada" versus "muitas horas de workaround" é o ponto de colapso. Em C19, "dois anos de API madura disponível" sem exame de maturidade é o ponto de colapso.

---

## 4. Matriz resumida dos pares

| Par | Polo R1/R2 (condenação) | Polo R2/R3 (justificativa) | Família | Fator candidato |
|-----|--------------------------|------------------------------|---------|-----------------|
| P1 | C01 (R1) nome de método | C13 (R3-I) tipo espelha schema | módulo / contrato | auto-geração por tooling |
| P2 | C05 (R1) ordem de parâmetros | C09 (R3-I) cerimônia de inicialização | API pública | testabilidade/extensibilidade |
| P3 | C07 (R1) campos internos no retorno | C17 (R3-I) config atravessa módulos | módulo / composição | separação de responsabilidades |
| P4 | C12 (R1) default trivial `new Date()` | C08 (R2-R) timeout default `0` | produto / prazo | fluxo de controle natural |
| P5 | C03 (R1) erro expõe transição | C14 (R2-R) erros colapsados | erro e feedback | simplicidade de hierarquia |
| P6 | C04 (R1) vocabulário do modelo | C10 (R2-R) rótulos genéricos | produto | reutilização de componente |
| P7 | C16 (R1) ordem por ID do banco | C06 (R2-R) formulário atômico | produto | consistência de estado |
| P8 | C18 (R1) nomeação inconsistente | C02 (R2-R) flag com efeito oculto | API pública | fluxo compartilhado |
| P9 | C20 (R2-R) hardcoded por prazo | C19 (R3-I) workaround preservado | legado e prazo | custo/risco de mudar |

## 5. Orientação para a Fase 4

Cada par acima define um eixo de variação natural para o *threshold probing*:

- **Pares P1–P3** (R1↔R3-I): o procedimento deve **subtrair progressivamente** o fator invocado no polo R3 e observar quando o julgamento migra na direção do polo R1. São os pares mais valiosos para decidir se os cinco casos indeterminados contêm componentes N genuínos ou se são racionalizações sofisticadas.

- **Pares P4–P8** (R1↔R2-R): o procedimento deve **adicionar progressivamente** variações ao caso-base R1 até reproduzir o fator invocado em R2, observando em que ponto (se em algum) o praticante abandona a condenação firme. A expectativa é que o ponto de migração revele um fator que, sob inversão posicional (Fase 6), colapsará.

- **Par P9** (R2↔R3): o procedimento deve **medir a densidade** da justificativa — a diferença entre "fator meramente alegado" e "fator efetivamente examinado". Este par é o teste de estabilidade do argumento de custo/risco.

A Fase 4 deverá, para cada par, registrar: (i) o ponto exato de mudança do julgamento quando ele ocorrer, (ii) a nova primeira lista de fatores candidatos a "motivos", e (iii) eventuais variáveis não previstas neste plano que surjam durante a variação.

---

*Produto da Fase 3:* nove pares de julgamento estruturalmente próximos, cobrindo todas as famílias de tensão, prontos para *threshold probing* na Fase 4.

*Próxima fase:* Fase 4 — *Threshold probing*.
