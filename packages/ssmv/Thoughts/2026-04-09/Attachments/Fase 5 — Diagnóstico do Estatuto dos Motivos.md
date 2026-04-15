# Fase 5 — Diagnóstico do Estatuto dos Motivos

## 1. Objetivo da fase

Para cada um dos quatorze fatores candidatos extraídos na Fase 4 (§4), determinar se ele é:

- **`N`** — condição de derrota genuína (conflito normativo real);
- **`R`** — racionalização post-hoc (fator que apenas simula derrotar a obrigação);
- **misto** — fator parcialmente restritivo e parcialmente racionalizante, que exige decomposição antes da formulação de princípios;
- **fora do escopo** — fator que, embora relevante, indica que o caso saiu do território que o truísmo se propõe a cobrir (isto é, deixa de ser "implementação impondo forma ao humano" e passa a ser "restrição externa vinculante").

## 2. Procedimento

Para cada motivo, aplicam-se as **cinco perguntas diagnósticas obrigatórias** (§8 Fase 5 do plano):

1. O fator reduz realmente o conjunto de alternativas viáveis, ou apenas torna uma delas menos conveniente para o decisor?
2. O fator é sustentado pelo praticante como comprometimento normativo independente, inclusive quando não o beneficia?
3. O fator sobreviveria ao teste posicional?
4. O fator vale igualmente em `runtime` e `build-time`, ou depende de uma assimetria não declarada entre UX e DX?
5. O fator altera a obrigação, ou apenas obscurece sua violação?

E os **dois testes adicionais de genuinidade**:

- **T-a.** Se a decisão tivesse produzido boa UX/DX por acidente, o praticante ainda invocaria esse mesmo fator como normativamente relevante?
- **T-b.** O fator continua sendo tratado como relevante quando o praticante é descrito do lado do afetado, e não do lado do decisor?

Além disso, dois testes emergidos na Fase 4 (§5), incorporados aqui:

- **T-c.** *Exame de coexistência:* o fator pressupõe uma disjunção entre duas preocupações que, sob exame, não é genuína?
- **T-d.** *Identidade do autor original:* o fator sobreviveria se o código preservado tivesse sido escrito por outra equipe?

O diagnóstico provisório aqui será refinado pela Fase 6 (teste de inversão posicional sistemático). Já se antecipa algum resultado posicional porque o probing da Fase 4 tocou o tema — mas o peso final do diagnóstico posicional fica reservado à próxima fase.

O formato de registro por motivo é: resposta curta às cinco perguntas + testes aplicáveis + veredicto provisório + trabalho filosófico esperado na Fase 8.

---

## 3. Diagnóstico motivo a motivo

### M01 — Default de ferramenta aceito sem exame de alternativas com garantia equivalente

*Caso-âncora:* C13 (tipos `Order` auto-gerados espelhando schema da tabela).

1. **Viabilidade.** Não reduz. Há geradores que produzem tipos de domínio com a mesma garantia de consistência (Fase 4 V2).
2. **Comprometimento independente.** Não é sustentado. O praticante não defende "defaults de tooling devem prevalecer sobre modelo de domínio" como princípio.
3. **Teste posicional.** Colapsa. Como consumidor do tipo, o praticante rejeita sem hesitação.
4. **Regime.** Uniforme — é conveniência de tooling, idêntica em `runtime` e `build-time`.
5. **Altera ou obscurece.** Apenas obscurece. O default da ferramenta substitui a decisão, fazendo a violação parecer "assim é o padrão."
- **T-a.** Não. Se o tipo tivesse saído bom por acidente, o fator não seria invocado.
- **T-b.** Não. Como afetado, colapsa.

**Veredicto provisório:** **`R`**. Racionalização pura, sustentada por inércia de tooling.
**Trabalho exigido na Fase 8:** desarmar a racionalização mostrando que o default da ferramenta não é restrição — é escolha renovada a cada uso sem exame.

---

### M02 — Consistência exigida externamente (compliance, auditoria) como obrigação vinculante

*Caso-âncora:* P1 / V4 (consistência campo-a-campo banco↔código como requisito regulatório).

1. **Viabilidade.** Sim, reduz genuinamente — compliance é restrição externa real.
2. **Comprometimento independente.** Sim, sobrevive ao teste de imparcialidade do praticante.
3. **Teste posicional.** Sobrevive mesmo do lado do afetado.
4. **Regime.** Opera em ambos.
5. **Altera ou obscurece.** Altera — é derrota genuína da forma local, mas pela imposição de uma obrigação normativamente distinta.
- **T-a.** Sim — o fator sobrevive mesmo quando a forma final é aceitável.
- **T-b.** Sim.

**Veredicto provisório:** **fora do escopo**. O motivo é genuíno enquanto restrição, mas **não é motivo no sentido deste trabalho**: ele não opera dentro do território do truísmo. O truísmo pressupõe que o espaço das alternativas viáveis esteja determinado pelo que está sob controle de quem implementa; compliance é restrição externa vinculante que reshape esse espaço *antes* que o truísmo se aplique.

**Risco a monitorar:** M02 frequentemente aparece como *capa* de M01. Casos em que "compliance" é alegado sem que exista requisito real de auditoria devem ser reclassificados como M01 (racionalização com verniz regulatório). A distinção operacional é verificável: existe documento de requisito externo? O auditor efetivamente examina o campo alegado?
**Trabalho exigido na Fase 8:** o princípio posterior deverá reconhecer M02 como exceção legítima *e*, simultaneamente, exigir procedimento de distinção entre M02 genuíno e M01 mascarado como M02.

---

### M03 — Falsa dicotomia entre preocupação legítima e conforto do consumidor

*Caso-âncora:* C09 (cerimônia de três camadas justificada por "testabilidade/extensibilidade").

1. **Viabilidade.** Não reduz. `Client.default()` ou `createClient({ ... })` satisfaz ambas as preocupações.
2. **Comprometimento independente.** Não. Não há comprometimento com "cerimônia é virtude."
3. **Teste posicional.** Colapsa.
4. **Regime.** Uniforme.
5. **Altera ou obscurece.** Obscurece. A justificativa depende de uma premissa oculta — de que as preocupações são mutuamente excludentes — que a análise de coexistência dissolve.
- **T-a.** Não.
- **T-c.** *Decisivo.* O fator sobrevive apenas enquanto o espaço de coexistência não é examinado.

**Veredicto provisório:** **`R`**. Racionalização por omissão de exame do espaço "e/ou."
**Trabalho exigido na Fase 8:** desarmar a racionalização *e* impor exigência procedimental de exame explícito de coexistência antes de invocar qualquer preocupação legítima como justificativa de cerimônia.

---

### M04 — Encapsulamento interno invocado para transferir custo de coordenação

*Caso-âncora:* C17 (três módulos internos expostos porque "o encapsulamento não permite opção unificada").

1. **Viabilidade.** Não reduz. A fachada é construtível em escala de horas (Fase 4 V1).
2. **Comprometimento independente.** Não.
3. **Teste posicional.** Colapsa. O afetado rejeita.
4. **Regime.** Build-time (com efeitos que podem atingir runtime quando o consumidor interno é outro componente).
5. **Altera ou obscurece.** Obscurece. "Encapsulamento" aqui é descrição do estado presente, não restrição sobre o possível.
- **T-a.** Não.
- **T-b.** Não.

**Veredicto provisório:** **`R`**. Racionalização baseada em confusão entre estado atual do código e espaço de alternativas.
**Trabalho exigido na Fase 8:** desarmar, mostrando que "encapsulamento" só é restrição quando há obstáculo concreto à construção de fachada, e não meramente ausência de fachada.

---

### M05 — Ambiguidade semântica genuína entre camadas internas

*Caso-âncora:* C17 resíduo (os três tipos de "retry" em transport/interceptor/client são semanticamente distintos).

1. **Viabilidade.** Reduz *parcialmente* — há decisão real de design sobre qual semântica privilegiar.
2. **Comprometimento independente.** Sim, parcial: o próprio afetado reconhece que a ambiguidade existe.
3. **Teste posicional.** Sobrevive parcialmente. O que *não* sobrevive é a conclusão de que a ambiguidade justifica *expor os três*; sobrevive apenas a conclusão de que *alguma decisão precisa ser explicitamente tomada*.
4. **Regime.** Build-time.
5. **Altera ou obscurece.** Altera parcialmente a forma da obrigação — não a derrota, mas a reescreve como "escolha recomendação default + ofereça refinamento", em vez de "unifique a qualquer custo."
- **T-a.** Sim em parte — mesmo com forma boa por acidente, o praticante reconhece a ambiguidade subjacente.
- **T-b.** Sim em parte.

**Veredicto provisório:** **misto — predominantemente `N` parcial**. A ambiguidade é conflito normativo real, mas estreito: ela muda a forma da obrigação, não a derrota. A obrigação residual é "fornecer recomendação default para o caso comum, sem esconder a ambiguidade do caso avançado."
**Trabalho exigido na Fase 8:** conciliar/arbitrar — o princípio posterior deverá formalizar que reconhecimento de ambiguidade não isenta o decisor da obrigação de recomendar um default.

---

### M06 — Conveniência de fluxo de controle da implementação como se fosse restrição

*Caso-âncora:* C12 (date picker default `new Date()`).

1. **Viabilidade.** Não reduz. A alternativa custa minutos.
2. **Comprometimento independente.** Não.
3. **Teste posicional.** Colapsa.
4. **Regime.** Runtime.
5. **Altera ou obscurece.** Obscurece. "Fluxo de controle natural" é descrição do caminho mais curto da implementação, não do espaço de alternativas viáveis.
- **T-a.** Não.
- **T-b.** Não.

**Veredicto provisório:** **`R`**. Racionalização por confusão entre "mais barato para o decisor" e "restrição sobre o possível."
**Trabalho exigido na Fase 8:** desarmar, com ênfase no exame sistemático de variações triviais do mesmo fluxo.

---

### M07 — Custo sintático de taxonomia de erros em linguagens pobres em tipos

*Caso-âncora:* C03 em linguagem sem ADTs/pattern-matching (Fase 4 V1).

1. **Viabilidade.** Reduz parcialmente — há custo real de boilerplate, especialmente se a taxonomia é extensa e recorrente.
2. **Comprometimento independente.** Sim, dentro do escopo relevante. O próprio afetado reconhece que o custo existe.
3. **Teste posicional.** Parcial. O afetado reconhece o custo *mas também* insiste que a distinção importa quando há ações de recuperação distintas — ou seja, a sobrevivência posicional depende do acoplamento com M08.
4. **Regime.** **Assimétrico.** O custo sintático recai sobre o implementador (build-time); o benefício da taxonomia recai sobre o afetado (runtime). Esta é a assimetria crítica de que a pergunta 4 trata.
5. **Altera ou obscurece.** Altera parcialmente — mas só justifica *ausência de taxonomia formal*, não justifica *mensagens que descrevem mecânica interna*. A racionalização começa quando o custo sintático é estendido para cobrir a escolha da mensagem em si.
- **T-a.** Parcialmente — se saísse bom por acidente, o custo sintático ainda seria real em casos futuros, mas não seria invocado no caso presente.
- **T-b.** Parcial.

**Veredicto provisório:** **misto — parte `N` parcial, parte `R`**. Em linguagens modernas o motivo colapsa para `R` integral. Em linguagens pobres em tipos, há componente `N` parcial (custo de taxonomia estruturada) *e* componente `R` (estender esse custo para justificar que a mensagem exibe a mecânica interna em vez da ação do afetado).
**Trabalho exigido na Fase 8:** decompor — reconhecer o custo sintático como restrição parcial, mas impedir que ele contamine a decisão de *forma da mensagem*, que é governada por M08.

---

### M08 — Ausência de mapeamento entre modos de falha e ações de recuperação

*Caso-âncora:* C03 quando os modos de falha são indistinguíveis do ponto de vista do afetado (Fase 4 V4).

1. **Viabilidade.** Reduz. Se as ações do afetado são indistinguíveis, não há taxonomia acionável a construir.
2. **Comprometimento independente.** Sim — sobrevive inclusive quando o praticante é o afetado.
3. **Teste posicional.** Sobrevive.
4. **Regime.** Ambos.
5. **Altera ou obscurece.** Altera genuinamente. A melhor experiência para um afetado cujas ações não se distinguem pode ser precisamente a mensagem genérica. O conflito é entre "superfície rica" e "superfície útil."
- **T-a.** Sim — mesmo com forma boa por acidente, o fator ainda seria invocado como descrição correta do caso.
- **T-b.** Sim.

**Veredicto provisório:** **`N`**. Conflito normativo genuíno, mas estreito: só opera quando as ações do afetado *realmente* são indistinguíveis. É o candidato mais forte do corpus a conflito normativo interno do próprio truísmo, porque os dois lados da tensão são ambos "melhor experiência para o humano relevante" — apenas sob descrições diferentes do que conta como melhor.
**Trabalho exigido na Fase 8:** conciliar — o princípio posterior deverá reconhecer que, quando as ações de recuperação são provadamente indistinguíveis, a superfície genérica não viola o truísmo, mas *exige* demonstração dessa indistinguibilidade (não mera alegação).

---

### M09 — Reuso de componente compartilhado combinado com custo de refatoração externa

*Caso-âncora:* C04 em cenário Fase 4 V3+V4 (componente não aceita `label`, refatoração exigiria migração coordenada).

1. **Viabilidade.** Parcial. Refatorar dezenas de consumidores é trabalho real, mas não intransponível.
2. **Comprometimento independente.** Sim, parcial — mesmo como afetado o praticante reconhece que migração em massa tem custo.
3. **Teste posicional.** Parcial — o afetado reconhece o custo, mas ainda sustenta que deixar permanentemente rótulo ruim é conveniência, não restrição.
4. **Regime.** Build-time.
5. **Altera ou obscurece.** Altera parcialmente — mas apenas na janela de decisão imediata. A decisão de *não construir gradualmente caminho de customização* volta a ser conveniência.
- **T-a.** Parcialmente.
- **T-b.** Parcial.

**Veredicto provisório:** **misto — `R` isolado, restrição parcial quando combinado**. Decomposição:
- M09-isolado (reuso sem custo de refatoração) = `R` pura (colapsa em Fase 4 V2).
- M09-combinado (reuso + custo de migração externa) = restrição parcial, mas apenas para a decisão imediata; não cobre a omissão de plano gradual de customização.

**Trabalho exigido na Fase 8:** decompor e, para a parte restritiva, exigir procedimento de plano gradual (anti-petrificação do workaround).

---

### M10 — "Consistência" ou "atomicidade" como nomes para ausência de lógica de preservação parcial

*Caso-âncora:* C16/C06 em contexto sem transação real multi-campo (Fase 4 V5).

1. **Viabilidade.** Não reduz — em volumes realistas, preservação parcial custa poucas linhas de código.
2. **Comprometimento independente.** Não.
3. **Teste posicional.** Colapsa.
4. **Regime.** Runtime.
5. **Altera ou obscurece.** Obscurece. "Consistência" é usada como nome técnico para ocultar ausência de lógica.
- **T-a.** Não.
- **T-b.** Não.

**Veredicto provisório:** **`R`**. Racionalização terminológica — o uso de palavras técnicas ("consistência", "atomicidade") fora de seu escopo técnico específico (transações genuínas) para emprestar autoridade a uma decisão de conveniência.
**Trabalho exigido na Fase 8:** desarmar, com exigência explícita de que invocações de "consistência/atomicidade" apontem a transação concreta que preservam.

---

### M11 — Compartilhamento de fluxo de controle interno como razão para fundir operações externas

*Caso-âncora:* C18/C02 em cenário Fase 4 V4+V5 (dois comportamentos fundidos em flag por compartilhamento interno).

1. **Viabilidade.** Não reduz.
2. **Comprometimento independente.** Não. Colapsa instantaneamente em V5 (inversão).
3. **Teste posicional.** Colapsa.
4. **Regime.** Build-time com efeitos externos.
5. **Altera ou obscurece.** Obscurece.
- **T-a.** Não.
- **T-b.** Não.

**Veredicto provisório:** **`R`**. Racionalização por transferência da estrutura interna à superfície externa.
**Trabalho exigido na Fase 8:** desarmar, com ênfase na distinção entre "simplicidade de implementação" e "simplicidade de uso."

---

### M12 — Custo de migração externa de consumidores de API

*Caso-âncora:* C18/C02 em cenário Fase 4 V3 (renomeação quebra consumidores em larga escala).

1. **Viabilidade.** Reduz. Quebrar consumidores em massa é custo real transferido.
2. **Comprometimento independente.** Sim — o praticante reconhece o custo inclusive quando é o consumidor de outra API.
3. **Teste posicional.** Sobrevive.
4. **Regime.** Build-time.
5. **Altera ou obscurece.** Altera genuinamente — mas de forma condicional.

**Questão de escopo** (paralela a M02): o custo de migração externa é **parcialmente externo** ao decisor (ele não controla o tamanho do ecossistema), mas a **decisão de não fornecer caminho de depreciação** é local. O truísmo opera sobre a parte local.

- **T-a.** Parcial.
- **T-b.** Sim, para a parte externa; não, para a parte de ausência de caminho de migração.

**Veredicto provisório:** **misto**. Decomposição:
- Custo de migração em massa *sem caminho alternativo* = restrição real (parte externa ao decisor).
- Ausência de caminho de depreciação gradual (alias, deprecation warning, coexistência temporária) = `R` (sob controle local).

**Diferença em relação a M02:** M02 aponta para fora do escopo do truísmo porque a obrigação concorrente é de outro tipo normativo (regulação). M12 permanece no escopo porque a obrigação concorrente é de mesma natureza — "melhor experiência para o humano relevante", aplicada a consumidores já existentes — e porque a parte local da decisão (construir ou não construir o caminho gradual) é exatamente o tipo de decisão que o truísmo governa.

**Trabalho exigido na Fase 8:** decompor, e para a parte local exigir procedimentalmente caminhos de depreciação quando a superfície original é reconhecida como ruim.

---

### M13 — Custo/risco alegado em vez de medido, mantido por assimetria de atenção decisor↔afetado

*Caso-âncora:* C20 (prazo) e C19 (workaround preservado) nas variações Fase 4 V1–V3.

1. **Viabilidade.** Não reduz. É alegação; colapsa sob contabilização ou exame de maturidade.
2. **Comprometimento independente.** Não. O praticante não sustenta "custos alegados contam mais que custos medidos" como princípio.
3. **Teste posicional.** Colapsa.
4. **Regime.** Ambos.
5. **Altera ou obscurece.** Obscurece **sistemicamente**. A violação permanece invisível porque o custo da não-mudança não retorna ao decisor como informação.
- **T-a.** Não.
- **T-b.** Decisivo — do lado do afetado, que absorve o custo real, o fator é imediatamente reconhecido como injustificado.

**Veredicto provisório:** **`R` com dimensão estrutural-procedimental**. Este não é `R` por má-fé do decisor individual; é `R` sustentada pela estrutura de distribuição da informação. O problema é que a assimetria de atenção torna a racionalização estável *sem* intenção racionalizante explícita.
**Trabalho exigido na Fase 8:** **procedimental**. O princípio posterior deverá exigir visibilidade, rastreabilidade e retorno periódico do custo real ao decisor, para que a racionalização perca a estabilidade estrutural de que hoje se beneficia.

---

### M14 — Familiaridade com o autor original como substituto de avaliação independente

*Caso-âncora:* C19 na variação Fase 4 V4 (confiança depende de quem escreveu o workaround).

1. **Viabilidade.** Não reduz.
2. **Comprometimento independente.** Não.
3. **Teste posicional.** Colapsa (T-d é justamente o teste crítico).
4. **Regime.** Ambos.
5. **Altera ou obscurece.** Obscurece por viés.
- **T-a.** Não.
- **T-b.** Colapsa.
- **T-d.** *Decisivo.* Se o código preservado tivesse sido escrito por outra equipe, a preservação seria imediatamente questionada.

**Veredicto provisório:** **`R` — viés posicional**. É uma racionalização específica, diferente das anteriores: não se baseia em premissa falsa sobre o espaço de alternativas, mas em atalho epistêmico (confiança em "nós mesmos" como substituto de avaliação).
**Trabalho exigido na Fase 8:** **procedimental**. Exigir que avaliações de preservação de código aceitem teste mental de "se outro autor tivesse escrito isto, eu preservaria?" como critério mínimo de isenção do viés.

---

## 4. Síntese — tipologia provisória dos motivos

| ID | Fator | Estatuto provisório | Grupo original | Observação |
|----|-------|---------------------|----------------|------------|
| M01 | Default de ferramenta sem exame de alternativas | `R` | A | Racionalização por inércia |
| M02 | Compliance/auditoria como obrigação vinculante | **Fora do escopo** | B | Restrição externa; o truísmo não se aplica |
| M03 | Falsa dicotomia preocupação legítima × conforto | `R` | A | Falha de exame de coexistência |
| M04 | Encapsulamento interno como transferência de custo | `R` | A | Confusão entre estado atual e possível |
| M05 | Ambiguidade semântica entre camadas internas | **Misto — predominantemente `N` parcial** | C | Reescreve, não derrota, a obrigação |
| M06 | Fluxo de controle da implementação como restrição | `R` | A | Confusão "mais barato" × "único possível" |
| M07 | Custo sintático de taxonomia de erros | **Misto — `N` parcial + `R`** | B | Assimetria UX/DX real; parte excede seu escopo |
| M08 | Ausência de mapeamento falhas↔ações | `N` | C | Conflito interno do próprio truísmo |
| M09 | Reuso de componente + custo de refatoração | **Misto — `R` isolado, parcial combinado** | A/B | Exige plano gradual |
| M10 | "Consistência" como nome para ausência de lógica | `R` | A | Racionalização terminológica |
| M11 | Compartilhamento interno como razão para fundir | `R` | A | Confusão implementação × uso |
| M12 | Custo de migração externa de consumidores | **Misto — parte local `R`, parte externa restrição** | B | No escopo, diferente de M02 |
| M13 | Custo/risco alegado em vez de medido | **`R` estrutural-procedimental** | D | Exige visibilidade procedimental |
| M14 | Familiaridade com o autor original | **`R` — viés posicional** | D | Exige T-d procedimental |

### 4.1. Distribuição por classe

- **`R` puro** (6): M01, M03, M04, M06, M10, M11.
- **`R` com dimensão procedimental** (2): M13, M14.
- **`N` puro** (1): M08.
- **Misto** (4): M05 (N parcial), M07 (N parcial + R), M09 (R isolado + parcial combinado), M12 (R local + restrição externa parcial).
- **Fora do escopo** (1): M02.

### 4.2. Primeiras observações estruturais

- O corpus **não sustenta uma maioria de conflitos normativos genuínos**. Apenas M08 é `N` puro, e ele é estreito (requer indistinguibilidade real das ações de recuperação). Isto confirma a hipótese metodológica do plano: o truísmo não racha por conflito legítimo, racha porque convive com racionalizações.
- **Todos os motivos do Grupo A colapsaram para `R` puro**, como previsto na Fase 4 §6. Isto valida o critério de pré-agrupamento usado.
- **O Grupo B foi majoritariamente decomposto** (M07 e M12 são mistos; M02 saiu do escopo). Dos três candidatos iniciais a "restrição real", nenhum sobreviveu como restrição pura *e* dentro do escopo do truísmo.
- **O Grupo C confirmou-se como núcleo mais forte de `N`**, mas apenas parcialmente: M05 é `N` parcial, M08 é `N` puro mas estreito.
- **O Grupo D (M13, M14) não se resolve pelas cinco perguntas clássicas**. Ambos são `R` em sentido técnico, mas a força da racionalização é *estrutural*, não individual. Eles exigem resposta procedimental (Fase 8), não argumentativa.

### 4.3. Achado central da fase

O diagnóstico confirma o que o plano antecipava em §13: **os motivos pelos quais o truísmo é violado são majoritariamente racionalizações**, com um núcleo pequeno de conflitos normativos genuínos e um conjunto intermediário de fatores mistos que exigem decomposição. A distribuição 6 R puro / 2 R procedimental / 1 N puro / 4 mistos / 1 fora do escopo tem implicação direta para a Fase 8: o princípio posterior terá mais trabalho de **desarmamento** do que de **conciliação**, e parte não-trivial do seu peso será **procedimental** (M13, M14, e as dimensões procedimentais de M09 e M12).

---

## 5. Resolução da questão M02/M12 aberta na Fase 4

A Fase 4 §6 deixou em aberto se M02 (compliance) e M12 (custo de migração externa) seriam motivos legítimos no sentido deste trabalho ou se sinalizariam saída do escopo do truísmo. A Fase 5 responde:

- **M02 sai do escopo.** Compliance é restrição externa de natureza normativa distinta (regulatória), que reshape o espaço de alternativas viáveis *antes* da aplicação do truísmo. O truísmo opera sobre o que está "sob controle de quem implementa" (§4 do plano); compliance legítima não está.

- **M12 permanece no escopo como motivo misto.** O custo de quebrar consumidores existentes é parcialmente externo (tamanho do ecossistema), mas a escolha de *não construir caminho de depreciação* é local e do mesmo tipo normativo que o truísmo governa. M12 se decompõe em parte-externa (restrição real) e parte-local (racionalização por omissão de procedimento gradual).

A diferença decisiva é que M02 invoca obrigação de tipo normativo distinto, enquanto M12 invoca obrigação do mesmo tipo (experiência do humano relevante) aplicada a outro humano relevante (consumidor atual da API). O truísmo tem recursos para lidar com M12; não tem e nem precisa ter recursos para lidar com M02.

**Observação anti-mascaramento:** conforme anotado em M02, é previsível que alegações de "compliance" sejam invocadas em casos que na verdade são M01. O princípio posterior deverá incluir, como exigência procedimental da exceção M02, a demonstração positiva da obrigação regulatória concreta. Sem essa demonstração, a alegação reverte para M01.

---

## 6. Questões que permanecem para a Fase 6

A Fase 6 (teste de inversão posicional sistemático) precisa estabilizar:

1. **M05 (ambiguidade semântica interna):** confirmar se sobrevive à inversão na forma "preciso recomendar default, mas reservo ao consumidor a possibilidade de refinamento." Se sim, é `N` parcial estável. Se não, regride para `R`.
2. **M07 (custo sintático de taxonomia):** confirmar se a componente `N` parcial sobrevive à inversão em linguagens pobres em tipos, ou se o afetado rejeita integralmente o custo transferido, o que colapsaria o motivo para `R` mesmo nessas linguagens.
3. **M08 (ausência de mapeamento falhas↔ações):** confirmar que é estável sob inversão, consolidando-o como único `N` puro do corpus.
4. **M09 e M12 (componentes mistas):** testar se a decomposição proposta aqui (isolado vs. combinado; parte local vs. parte externa) é preservada sob inversão posicional ou se precisa ser refinada.

Os motivos `R` puro (M01, M03, M04, M06, M10, M11) não precisam de teste adicional — a Fase 4 já antecipou a inversão posicional para eles. A Fase 6 apenas confirmará formalmente.

Os motivos `R` estrutural-procedimental (M13, M14) também não precisam de teste posicional adicional, porque sua condição `R` foi estabelecida justamente pelo colapso posicional. A Fase 6 os registrará como baseline.

---

## 7. Orientação para a Fase 7

Com o diagnóstico provisório em mãos, a Fase 7 deve formular os pares de comprometimento em tensão (`C1/C2`) para cada motivo, atentando aos seguintes recortes:

- Para os motivos `R` puros, a tensão é **aparente**: `C1` (truísmo) vs. `C2` (racionalização travestida de restrição). O trabalho de Fase 7 é explicitar a racionalização em linguagem direta, para que o desarmamento da Fase 8 tenha alvo preciso.
- Para os motivos mistos, a tensão é **composta**: `C1` vs. (`C2-a` restritiva + `C2-b` racionalizante), com `C2-b` parasitando `C2-a`. A decomposição deve ser registrada no par.
- Para M08 (`N` puro), a tensão é **real**: `C1` ("melhor experiência como superfície rica") vs. `C1'` ("melhor experiência como superfície útil"), com ambos os lados sustentando o mesmo comprometimento normativo sob descrições concorrentes. Este é o único par genuinamente conciliatório do corpus.
- Para os motivos procedimentais (M13, M14), a tensão não é argumentativa: `C1` vs. uma **estrutura de invisibilidade** que mantém `C2` estável sem defesa explícita. O par deverá refletir isso — o adversário não é uma tese, é uma ausência sistemática de informação.
- Para M02 (fora do escopo), não haverá par no produto final do trabalho, mas deverá haver nota explicativa no `Catálogo` final sobre por que foi excluído.

---

*Produto da Fase 5:*

1. **Diagnóstico provisório** dos 14 motivos candidatos com aplicação das cinco perguntas obrigatórias, dos dois testes adicionais de genuinidade e dos dois testes emergidos na Fase 4 (coexistência e identidade do autor).
2. **Tipologia provisória** por estatuto normativo: 6 `R` puros, 2 `R` procedimentais, 1 `N` puro, 4 mistos, 1 fora do escopo.
3. **Resolução** da questão M02/M12 aberta na Fase 4.
4. **Lista explícita** de motivos que ainda demandam estabilização formal na Fase 6 (M05, M07, M08, M09, M12).
5. **Orientação de formato** para os pares de comprometimento da Fase 7.

*Próxima fase:* Fase 6 — *Teste de inversão posicional sistemático*.
