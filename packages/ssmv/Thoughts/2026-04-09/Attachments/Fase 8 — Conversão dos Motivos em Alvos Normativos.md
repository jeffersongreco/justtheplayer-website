# Fase 8 — Conversão dos Motivos em Alvos de Ataque Normativo

## 1. Objetivo da fase

Converter cada motivo diagnosticado (Fases 5–6) e formulado como par em tensão (Fase 7) em um **alvo normativo preciso** — isto é, uma tarefa concreta que o princípio posterior, a ser formulado na etapa seguinte do artigo, terá de executar.

A Fase 8 não formula o princípio. Ela fixa, para cada motivo, **o objeto preciso que o princípio futuro deverá enfrentar** (§8 Fase 8 do plano). O produto final é a lista de alvos — específicos, acionáveis, classificados por tipo de trabalho normativo, e reduzidos por consolidação horizontal quando múltiplos motivos exigem a mesma estrutura de resposta.

Ao final da fase, a etapa seguinte do trabalho poderá tomar a lista de alvos como **carta de tarefas** do princípio: cada alvo é um problema que o princípio posterior terá de resolver ou justificadamente deixar de resolver.

## 2. Regras de conversão

Conforme §8 Fase 8 do plano:

| Tipo de motivo | Trabalho do princípio |
|---|---|
| `N` estável | **arbitrar** ou **conciliar** entre comprometimentos normativos genuínos |
| `R` | **desarmar** a racionalização, mostrando por que ela não derrota a obrigação |
| misto | **separar** a parte restritiva real da parte racionalizante (qualificar + desarmar/proceduralizar) |
| ligado a opacidade, atribuição, temporalidade ou viés | **proceduralizar**: impor exigências de visibilidade, rastreabilidade, exposição do afetado, exame de alternativas |

A essas regras, a Fase 8 adiciona duas observações derivadas das fases anteriores:

1. **Consolidação horizontal é metodologicamente permitida e desejável.** Quando múltiplos motivos demandam a mesma estrutura de resposta (p. ex., cláusula de demonstração positiva, exame de coexistência, plano gradual), um único alvo consolidado serve a todos os motivos correspondentes. A §4 desta fase explicita essas consolidações.

2. **A Fase 8 pode registrar alvos sem formulá-los como princípios.** Conforme o plano (§8 Fase 8): *"os 'motivos' não serão o princípio ainda, mas o objeto preciso que o princípio futuro deverá enfrentar."* A linguagem dos alvos é, portanto, **prescritiva sobre o que o princípio posterior deve executar**, não prescritiva sobre como ele deve ser formulado.

## 3. Alvos específicos motivo a motivo

Esta seção lista um alvo por motivo, com identificador `A##`, nome curto, formulação da tarefa normativa, e referência cruzada ao par de Fase 7 e ao trabalho indicado.

### 3.1. Alvos de desarmamento (motivos `R` puros)

#### A01 — Desarmamento de "default de tooling como restrição"

*Referência:* M01 (Par da Fase 7).

**Tarefa do princípio:** estabelecer que **defaults de tooling não constituem restrição sobre o espaço de alternativas viáveis** quando ferramentas alternativas com garantia equivalente existem. O princípio deve recusar "assim foi gerado" como razão, exigindo que a escolha do gerador seja tratada como decisão renovada a cada uso.

**Formulação operacional do alvo:** diante de uma forma ditada por um default de tooling, o princípio deve permitir ao afetado recusar a forma sem ter de refutar o tooling — basta demonstrar a existência de alternativa com garantia equivalente.

---

#### A02 — Desarmamento de "falsa dicotomia entre preocupação legítima e conforto"

*Referência:* M03.

**Tarefa do princípio:** impedir a invocação de preocupação legítima (testabilidade, extensibilidade, modularidade) como razão para impor cerimônia ao consumidor, **sem exame prévio do espaço de coexistência** entre a preocupação e o conforto. A disjunção tem de ser demonstrada, não pressuposta.

**Formulação operacional do alvo:** qualquer invocação de preocupação legítima como razão contra o conforto do consumidor precisa carregar consigo uma demonstração de que as duas não podem coexistir na forma em questão. Sem a demonstração, a invocação não tem peso normativo.

---

#### A03 — Desarmamento de "encapsulamento como transferência de custo"

*Referência:* M04.

**Tarefa do princípio:** distinguir rigorosamente entre (i) encapsulamento como obstáculo concreto à construção de fachada e (ii) encapsulamento como descrição reificada de uma omissão. Apenas (i) conta como restrição sobre o possível.

**Formulação operacional do alvo:** "encapsulamento impede X" só tem peso normativo quando acompanhado de demonstração do obstáculo *concreto* à construção do caminho que forneceria X. Enquanto o obstáculo não é exibido, "encapsulamento" descreve o estado presente do código, não restrição sobre o viável.

---

#### A04 — Desarmamento de "fluxo de controle natural como restrição"

*Referência:* M06.

**Tarefa do princípio:** distinguir, com rigor vocabular, entre *caminho mais curto para o decisor escrever* e *único caminho viável*. O adjetivo "natural" aplicado a defaults ou fluxos de controle é **suspeito por construção** — frequentemente marca a confusão acima.

**Formulação operacional do alvo:** diante da palavra "natural" aplicada a uma forma, o princípio deve exigir que se explicite a quem essa forma é natural e por qual critério. Tipicamente é natural ao decisor em primeira pessoa, não ao problema nem ao afetado.

---

#### A05 — Desarmamento de "consistência/atomicidade como racionalização terminológica"

*Referência:* M10.

**Tarefa do princípio:** exigir que invocações de **"consistência"** ou **"atomicidade"** apontem positivamente a transação concreta, a invariante declarativa ou a restrição de integridade que preservam. Sem o apontamento, a invocação é terminológica — empresta autoridade técnica a uma decisão de conveniência — e reverte para M06.

**Formulação operacional do alvo:** ao receber invocação de "atomicidade" ou "consistência", o princípio pergunta: *qual transação?* ou *qual invariante?*. Se a resposta não identifica uma transação ou invariante existente e concreta, a invocação é rejeitada.

---

#### A06 — Desarmamento de "compartilhamento interno como razão para fundir operações externas"

*Referência:* M11.

**Tarefa do princípio:** estabelecer que **simplicidade de implementação** e **simplicidade de uso** são critérios normativos distintos, aplicáveis a objetos distintos (estrutura interna vs. superfície externa). A primeira não fundamenta decisões sobre a segunda.

**Formulação operacional do alvo:** diante de uma decisão sobre forma externa justificada por conveniência interna, o princípio exige redescrição da decisão do ponto de vista do consumidor da forma. Se a redescrição não preserva a razão invocada, a razão é de outro tipo e não se aplica à decisão.

---

### 3.2. Alvos de qualificação (componentes `N` parciais de mistos)

#### A07 — Qualificação de "ambiguidade semântica genuína entre camadas"

*Referência:* M05-a (componente restritivo do par misto M05).

**Tarefa do princípio:** reconhecer que **ambiguidade semântica real entre camadas internas** é restrição legítima sobre a forma da obrigação — mas *reescreve* a obrigação, não a derrota. A obrigação residual, sob ambiguidade reconhecida, é "recomendar um default para o caso comum + permitir refinamento explícito para o caso avançado + explicitar que há ambiguidade."

**Formulação operacional do alvo:** o princípio distingue três níveis dentro de um caso de ambiguidade:
1. o que conta como restrição legítima — reconhecer que há decisão de design não trivial;
2. o que *não* conta como restrição — a conclusão de que nenhuma recomendação deve ser oferecida;
3. o que o decisor ainda deve ao consumidor — default, refinamento, aviso.

---

#### A08 — Qualificação de "custo sintático de taxonomia de erros em linguagens pobres em tipos"

*Referência:* M07-a (componente restritivo do par misto M07).

**Tarefa do princípio:** reconhecer que linguagens pobres em tipos impõem **custo sintático real** sobre taxonomias formais de erro, e que esse custo justifica — no máximo — *ausência de hierarquia tipada formal*. O custo sintático **não** justifica forma de mensagem que descreve mecânica interna; essa decisão é governada por A09 (M08) e independe de taxonomia tipada.

**Formulação operacional do alvo:** o princípio separa, com clareza, duas decisões que frequentemente aparecem unidas: (i) *construir ou não uma hierarquia tipada formal* (governada por M07-a, pode ser legítimo não construir) e (ii) *que forma dar à string da mensagem* (governada por M08, não depende de tipos).

---

### 3.3. Alvo de arbitragem (único `N` puro do corpus)

#### A09 — Arbitragem de "superfície útil vs. superfície rica"

*Referência:* M08.

**Tarefa do princípio:** conciliar os dois ramos de "melhor experiência para o humano relevante" — *superfície útil* (mensagem que orienta a ação) e *superfície rica* (que não esconde distinções reais do sistema) — reconhecendo que, quando as ações de recuperação disponíveis ao afetado são **positivamente demonstradas como indistinguíveis**, a superfície genérica não viola a obrigação.

A cláusula procedimental ("positivamente demonstradas") é **parte constitutiva** do estatuto `N`, não anexo. Sem a cláusula, o motivo M08 reverte a `R`. Com ela, o motivo é o único conflito normativo interno genuíno que o corpus sustenta.

**Formulação operacional do alvo:**
- quando as ações de recuperação do afetado são distintas: o princípio favorece a superfície rica, ainda que custosa (rejeita M07-b, M01-mascarado, etc.);
- quando as ações são, sob demonstração positiva, indistinguíveis: o princípio favorece a superfície genérica e **considera a decisão normativamente encerrada** — a superfície genérica aqui é a forma certa, não concessão;
- a cláusula de demonstração é ela mesma exigível: sem demonstração, reverte ao primeiro ramo.

**Observação sobre o estatuto:** A09 é o único alvo do tipo "arbitragem" em todo o corpus. A singularidade não o fragiliza — ao contrário, a escassez de `N` puro é o achado substantivo da análise.

---

### 3.4. Alvos de procedimentalização

Os alvos a seguir atacam motivos cuja estabilidade prática não depende de argumento, mas de condições informacionais, epistêmicas ou institucionais. O princípio posterior não pode atacá-los por refutação; tem de criar as condições em que sua fraqueza argumentativa se traduz em mudança prática.

#### A10 — Procedimentalização de "custo/risco alegado em vez de medido"

*Referência:* M13.

**Tarefa do princípio:** impor mecanismos que façam o **custo real da não-mudança retornar ao decisor** como informação. O princípio deve exigir três condições complementares sobre qualquer decisão de preservar forma reconhecida como ruim por alegação de custo ou risco de mudança:

1. **Visibilidade**: o custo da forma atual deve ser mensurável e efetivamente medido (não apenas mensurável em princípio).
2. **Rastreabilidade**: deve ser identificável quem aceitou a preservação e com que base empírica.
3. **Retorno periódico**: a preservação deve ser revisada em intervalo explicitamente definido, com reavaliação contra a medição atualizada do custo.

Sem essas três condições, a alegação de "prazo" ou "risco" não sustenta preservação indefinida.

**Formulação operacional do alvo:** a preservação da forma ruim só é normativamente legítima enquanto as três condições estiverem ativas. A queda de qualquer uma converte a preservação em `R` pura e o princípio recupera a obrigação original.

---

#### A11 — Procedimentalização de "familiaridade com o autor original como substituto de avaliação"

*Referência:* M14.

**Tarefa do princípio:** exigir, como condição de avaliação de preservação de código legado, o **teste mental explícito de troca de autor**: *"se este código tivesse sido escrito por outra equipe, ou por alguém que eu não conheço, eu ainda recomendaria preservar?"*. Resposta negativa revela viés posicional e invalida a decisão de preservar.

Como proteção procedimental alternativa para casos em que o teste mental é insuficiente, o princípio pode exigir **avaliação de preservação por praticante não-familiar** com o autor original.

**Formulação operacional do alvo:** a avaliação de preservação é válida apenas quando aprovada sob o teste de troca de autor. Falha no teste reverte ao caminho normativo padrão — ou seja, a obrigação de examinar substituição do código.

---

#### A12 — Procedimentalização de "petrificação por omissão de plano gradual" *(motivo atravessador)*

*Referência:* M09-b, M12-b, e o motivo atravessador isolado na Fase 7 §4.

**Tarefa do princípio:** estabelecer que, sempre que um componente restritivo legítimo (`C2-a`) seja invocado para justificar não-atuação imediata sobre uma forma reconhecida como ruim, o decisor tem obrigação adicional de apresentar **também um plano gradual** de melhoria futura. A ausência de plano converte automaticamente `C2-a` genuíno em cobertura para `R`.

Mínimos constitutivos do plano gradual:

- **Caminho**: como a forma atual será substituída pela forma melhor (parâmetro opcional com default, coexistência temporária, deprecation, versionamento).
- **Marcos**: pontos verificáveis de avanço (número de consumidores migrados, versões marcadas, prazos).
- **Deadline**: horizonte além do qual a forma atual deixa de ser aceitável.
- **Reversão**: condição explícita em que o plano pode ser revisto, sem virar cláusula de escape indefinida.

**Formulação operacional do alvo:** este alvo cobre, por consolidação, o componente parasitário de M09 e M12 e é aplicável a qualquer caso futuro estruturalmente análogo. Ele é o primeiro exemplo, na fase, de **consolidação horizontal**: um único alvo para múltiplos motivos com a mesma estrutura de resposta.

---

#### A13 — Procedimentalização da cláusula M02: demonstração positiva de obrigação externa

*Referência:* M02 (fora do escopo; tratamento procedimental da exceção).

**Tarefa do princípio:** exigir, diante de invocação de compliance, auditoria, regulação ou qualquer obrigação externa análoga como razão para preservar forma ruim, **demonstração positiva da obrigação externa concreta**. Elementos da demonstração:

- documento identificável do requisito externo;
- identificação do agente que o impõe (auditor, regulador, legal);
- mapeamento do requisito à forma específica em questão (por que *esta* forma e não outra equivalente).

Sem essa demonstração, a alegação de M02 reverte para M01 — default de tooling ou hábito local travestido de compliance.

**Formulação operacional do alvo:** o princípio trata M02 como **exceção nomeada e condicional**, não como exceção geral. A condicionalidade é justamente o que separa exceção legítima (fora do escopo do truísmo) de mascaramento (dentro do escopo, atacável).

---

#### A14 — Procedimentalização da cláusula de M08: demonstração positiva de indistinguibilidade

*Referência:* M08 (complemento procedimental do alvo A09).

**Tarefa do princípio:** exigir, para que a superfície genérica seja considerada legítima sob A09, **demonstração positiva** de que as ações de recuperação disponíveis ao afetado são indistinguíveis. Elementos da demonstração:

- enumeração das ações efetivamente disponíveis ao afetado em cada modo de falha;
- verificação de que nenhuma informação adicional permitiria ação diferente;
- revisão quando a superfície ou as ações mudam.

Sem essa demonstração, a "indistinguibilidade" é alegação — e reverte para M01/M03 (pseudo-restrição por omissão de exame).

**Observação cruzada:** A13 e A14 têm a mesma estrutura operacional — "exceção legítima sob demonstração positiva, mascaramento sem demonstração" — e podem ser vistas como instâncias de uma **forma canônica de exceção** que o princípio posterior terá de adotar como padrão. Ver §4.2.

---

#### A15 — Procedimentalização do exame de coexistência

*Referência:* M03 (complemento procedimental do alvo A02) + casos estruturalmente análogos.

**Tarefa do princípio:** estabelecer que, antes de qualquer invocação de preocupação legítima como razão contra conforto do consumidor, o decisor deve ter **examinado explicitamente** o espaço de coexistência entre as duas preocupações. O exame é procedimental: registro de alternativas consideradas, razões de rejeição, e demonstração de que a disjunção é real.

**Formulação operacional do alvo:** este alvo é consolidável com A02 (desarmamento de M03), mas merece registro separado porque a exigência do exame é *formal* — o princípio posterior pode especificar a forma do registro, não apenas declarar que o exame tem de ocorrer.

---

## 4. Consolidações horizontais

A análise motivo a motivo da §3 revela três estruturas de resposta que atravessam múltiplos motivos e podem ser tratadas como **padrões normativos consolidados** pelo princípio posterior. Esta seção explicita as consolidações.

### 4.1. Consolidação 1 — Distinção entre critério para o decisor e critério para o afetado

**Motivos cobertos:** M01, M04, M06, M11 (toda a classe de `R` puros que opera por confusão entre "mais barato/curto/conveniente para quem decide" e "único caminho viável").

**Alvo consolidado:** o princípio posterior deve adotar, como **ferramenta operacional básica**, a distinção entre critério aplicável ao decisor e critério aplicável ao afetado, e deve impedir que o primeiro seja invocado como se fosse o segundo. A palavra-chave "natural" — e suas variantes ("óbvio", "direto", "padrão") — deve ser tratada como **gatilho de exame**: sempre que aparece justificando uma decisão sobre a forma da superfície, o princípio exige redescrição da decisão do ponto de vista do consumidor da superfície.

Esta consolidação não substitui A01, A03, A04, A06 — ela os unifica sob um critério operacional único, permitindo que o princípio posterior tenha uma ferramenta genérica em vez de quatro regras específicas.

### 4.2. Consolidação 2 — Forma canônica de exceção legítima: "legítima sob demonstração, máscara sem demonstração"

**Motivos cobertos:** M02 (compliance), M05-a (ambiguidade semântica), M07-a (custo sintático), M08 (indistinguibilidade de ações), M09-a e M12-a (custo de migração imediato).

**Alvo consolidado:** o princípio posterior deve adotar, como **forma canônica** de tratamento de exceção, a estrutura:

> *exceção é legítima sob demonstração positiva de sua condição constitutiva; é máscara sem essa demonstração.*

Esta forma canônica tem três vantagens:

1. **Evita regras ad hoc.** Em vez de formular uma exceção diferente para cada motivo, o princípio reutiliza a mesma estrutura.
2. **Desarma mascaramento de maneira uniforme.** Qualquer exceção invocada sem demonstração reverte para seu motivo `R` mais próximo (M01, M03, M06), que já tem alvos de desarmamento.
3. **Corresponde à estrutura real dos motivos mistos do corpus.** Todos os mistos se decompõem exatamente nessa forma: `C2-a` é a exceção legítima sob demonstração; `C2-b` é o mascaramento sem demonstração.

A consolidação significa que A07, A08, A13, A14 — aparentemente quatro alvos distintos — são na verdade **quatro instâncias da mesma estrutura normativa**. O princípio posterior formulará a estrutura uma vez e a aplicará a cada instância.

### 4.3. Consolidação 3 — Petrificação como forma universal de `R` por omissão de procedimento

**Motivos cobertos:** M09-b, M12-b, e o motivo atravessador já isolado na Fase 7 §4.

**Alvo consolidado:** já formulado diretamente como A12. A consolidação aqui é apenas registro do escopo: sempre que houver componente restritivo legítimo adjacente a forma reconhecida como ruim, a ausência de plano gradual é motivo atravessador e A12 se aplica. O princípio posterior pode enunciar A12 uma única vez e esperar que ele cubra qualquer caso futuro com essa estrutura.

### 4.4. Ganho de consolidação

A consolidação reduz os 15 alvos da §3 ao seguinte núcleo operacional:

| Consolidação | Alvos originais cobertos | O que resta como tarefa específica |
|---|---|---|
| C1 — critério decisor vs. afetado | A01, A03, A04, A06, parte de A02 | nada — toda a classe se reduz a C1 |
| C2 — exceção canônica "legítima sob demonstração" | A07, A08, A13, A14, e componentes-a de A11, A12 adjacentes | formulação do teste "sob demonstração" |
| C3 — petrificação por omissão de plano | A12 consolidado | os mínimos constitutivos do plano |
| Alvos irredutíveis | A05 (vocabulário), A09 (único `N` puro), A10 (retorno de custo), A11 (troca de autor), A15 (exame de coexistência formal) | tratamento individual |

Isto é, o princípio posterior precisa formular **três estruturas consolidadas** (C1, C2, C3) e **cinco alvos irredutíveis** (A05, A09, A10, A11, A15). Este é o orçamento filosófico mínimo que o corpus suporta.

---

## 5. Perfil do princípio demandado

A distribuição dos alvos por tipo de trabalho normativo permite caracterizar, com precisão, **o tipo de princípio que o corpus demanda**. Isto não é ainda o princípio — é a descrição da forma que ele terá de assumir.

### 5.1. Perfil operacional

O princípio posterior terá de ser, ao mesmo tempo:

- **Predominantemente desarmador**: mais de um terço dos alvos (A01, A02, A03, A04, A05, A06) são desarmamento de racionalizações de confusão categorial. O princípio precisa ser capaz de rejeitar razões mal-formuladas, não apenas aprovar ou reprovar decisões.

- **Fortemente procedimental**: cinco alvos (A10, A11, A12, A13, A14) e duas consolidações (C2, C3) são procedimentais. O princípio não se reduz a um enunciado; ele tem de prescrever procedimentos.

- **Raramente conciliatório**: exatamente um alvo (A09) demanda arbitragem entre comprometimentos normativos genuínos. A conciliação é pequena, bem delimitada e condicional à cláusula procedimental A14.

- **Capaz de operar sob decomposição**: o princípio tem de saber tratar mistos — aceitar parte e rejeitar parte do mesmo fator — sem colapsar para "aceita tudo" ou "rejeita tudo". Os alvos A07, A08, A09 (com cláusula), A10–A12 dependem dessa capacidade.

### 5.2. Critérios negativos — o que o princípio *não* pode ser

O perfil operacional implica restrições sobre formas que o princípio posterior não pode adotar:

- **Não pode ser regra simples do tipo "sempre priorize UX/DX"** — isto seria o truísmo de volta, sem qualificação, incapaz de tratar M05, M07, M08, M09, M12, M02.
- **Não pode ser regra simples do tipo "decida caso a caso"** — isto esvaziaria o trabalho de Fases 5–7 e deixaria todos os motivos `R` intactos.
- **Não pode ser exclusivamente argumentativo** — isto deixaria M13 e M14 (os `R` estrutural-procedimentais) sem ataque efetivo.
- **Não pode ser exclusivamente procedimental** — isto transformaria o princípio em burocracia, incapaz de dizer que algumas razões são *erradas*, não apenas *mal apresentadas*.
- **Não pode ser hierárquico rígido** — isto quebraria em M08, o único caso em que o próprio princípio apresenta dois ramos legítimos.

### 5.3. O que o princípio tem de entregar

Em forma condensada, o princípio posterior tem de ser capaz de produzir, diante de qualquer decisão candidata ao corpus:

1. uma **classificação** da razão invocada (pseudo-restrição, exceção sob demonstração, conflito normativo real, ou omissão procedimental);
2. uma **tarefa normativa correspondente** (desarmar, qualificar, arbitrar, ou proceduralizar);
3. uma **exigência procedimental ativa** (medição, rastreamento, plano gradual, exame de coexistência, teste de troca de autor, demonstração positiva) quando a classificação demandar;
4. uma **recuperação da obrigação original** (o truísmo) quando nenhuma das exceções canônicas se sustenta.

Cada um desses quatro elementos corresponde a um dos tipos de alvo desta fase. O princípio, por construção, é o instrumento que executa os alvos — não o enunciado que os substitui.

---

## 6. Lista final consolidada dos alvos

| ID | Nome curto | Motivo de origem | Tipo | Consolidação |
|----|------------|-------------------|------|--------------|
| A01 | default de tooling como pseudo-restrição | M01 | desarmamento | C1 |
| A02 | falsa dicotomia preocupação × conforto | M03 | desarmamento | C1 + A15 |
| A03 | encapsulamento como omissão reificada | M04 | desarmamento | C1 |
| A04 | "natural" como marcador de confusão | M06 | desarmamento | C1 |
| A05 | consistência/atomicidade sem transação | M10 | desarmamento | irredutível |
| A06 | simplicidade interna ≠ simplicidade externa | M11 | desarmamento | C1 |
| A07 | ambiguidade semântica reescreve obrigação | M05-a | qualificação | C2 |
| A08 | custo sintático justifica ausência de tipos, não forma da mensagem | M07-a | qualificação | C2 |
| A09 | superfície útil × superfície rica sob indistinguibilidade demonstrada | M08 | arbitragem | irredutível (+ A14) |
| A10 | retorno do custo real da não-mudança ao decisor | M13 | procedimentalização | irredutível |
| A11 | teste de troca de autor | M14 | procedimentalização | irredutível |
| A12 | plano gradual contra petrificação | M09-b, M12-b, atravessador | procedimentalização | C3 |
| A13 | demonstração positiva de compliance | M02 (exceção) | procedimentalização | C2 |
| A14 | demonstração positiva de indistinguibilidade | M08 (cláusula de A09) | procedimentalização | C2 |
| A15 | exame formal de coexistência | M03 (complemento de A02) | procedimentalização | irredutível |

**Orçamento filosófico mínimo:** 3 consolidações (C1, C2, C3) + 5 alvos irredutíveis (A05, A09, A10, A11, A15). Este é o conjunto que o princípio posterior tem de enfrentar diretamente.

---

## 7. Checklist para a formulação do princípio posterior

Para que o princípio posterior seja considerado **metodologicamente suficiente** em relação ao corpus desta análise, ele terá de satisfazer os seguintes itens. A etapa seguinte do artigo pode usar este checklist como critério de suficiência formal.

### 7.1. Cobertura de alvos

- [ ] O princípio formula **C1** (distinção operacional entre critério decisor e critério afetado) e a aplica a A01, A03, A04, A06.
- [ ] O princípio formula **C2** (forma canônica "legítima sob demonstração positiva") e a aplica a A07, A08, A13, A14 (e, como fundo estrutural, aos componentes-a de mistos).
- [ ] O princípio formula **C3** (exigência de plano gradual contra petrificação) e a aplica a A12.
- [ ] O princípio trata **A05** (apontamento concreto de transação/invariante em invocações de "consistência"/"atomicidade").
- [ ] O princípio trata **A09** como único caso genuíno de arbitragem, com explicitação dos dois ramos ("superfície útil" vs. "superfície rica") e da cláusula procedimental de indistinguibilidade.
- [ ] O princípio trata **A10** (visibilidade + rastreabilidade + retorno periódico sobre preservação alegada por custo/risco).
- [ ] O princípio trata **A11** (teste de troca de autor como condição de avaliação de preservação).
- [ ] O princípio trata **A15** (exame formal de coexistência como exigência procedimental separada de A02).

### 7.2. Critérios negativos satisfeitos

- [ ] Não é redução do truísmo sem qualificação.
- [ ] Não é "decida caso a caso" disfarçado.
- [ ] Não é exclusivamente argumentativo (cobre M13, M14).
- [ ] Não é exclusivamente procedimental (cobre A01–A06).
- [ ] Não é hierarquia rígida que bloqueia A09.

### 7.3. Condições de suficiência herdadas de §12 do plano

- [ ] Nenhum alvo sem caso específico que o ancore. *(Esta fase preserva a ancoragem por referência cruzada aos casos das Fases 1–2.)*
- [ ] Nenhum motivo tratado como `N` sem sobreviver a T-b / T-c / T-d e à inversão posicional. *(M08 é o único `N`, e sobrevive com cláusula constitutiva.)*
- [ ] Nenhuma racionalização mantida por familiaridade ou retórica. *(A11 ataca exatamente esse caso.)*
- [ ] Distinção entre **restrição** e **autoridade** preservada. *(A consolidação C2 formaliza essa distinção como forma canônica de exceção.)*
- [ ] Cobertura suficiente para mostrar que o problema atravessa `runtime` e `build-time`. *(O corpus cobre ambos; os alvos não dependem de regime.)*
- [ ] Cada motivo aparece acompanhado do tipo de resposta normativa que exige. *(Cumprido integralmente nesta fase.)*

---

*Produto da Fase 8:*

1. **15 alvos específicos** (A01–A15), um por motivo (exceto M02, que recebe A13 como tratamento de exceção) e com acoplamentos explícitos para componentes-a e componentes-b de mistos.
2. **Três consolidações horizontais** (C1, C2, C3) que reduzem a superfície de trabalho do princípio posterior a um núcleo mínimo.
3. **Perfil operacional e critérios negativos** do princípio demandado pelo corpus.
4. **Lista final unificada** dos alvos com referência cruzada a motivo, tipo e consolidação.
5. **Checklist** de suficiência para a formulação do princípio na etapa seguinte do artigo, herdando as condições de §12 do plano.

*Próxima etapa:* montagem do arquivo final `Catálogo de Condições de Derrota e Racionalizações.md`, conforme §9 do plano.
