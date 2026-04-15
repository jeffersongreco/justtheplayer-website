# STEP 5 — Princípio Reformulado (P0') e Verificação de Subsunção

> **Insumos.** `01-revisao-P0-positivo.md`, `02-invariantes-negativo.md`, `03-conceitos-negativo.md`, `04-conceitos-clausulas.md`; `Catálogo de Condições de Derrota e Racionalizações.md` §4.
> **Método.** Subsunção (Kant, A132/B171; Alexy, cap. 4) + extensão conservadora (Shoenfield, §4.6): todo veredito produzido por P0 deve ser produzido por P0' via subsunção formal sob componentes ou cláusulas categóricas.
> **Objetivo.** (1) Compor P0'. (2) Demonstrar que M01–M14 subsumem sob P0'. (3) Demonstrar que A01–A15 são cobertos.

---

## 1. P0' — Princípio Central, Versão Categórica

### §1. Componente Positivo (P0+)

> Toda superfície de uso deve ser definida de modo a oferecer ao afetado a **melhor experiência de interação possível** dentro do conjunto de alternativas realmente viáveis. Estruturas, nomenclaturas, fluxos e estados internos da implementação não constituem critério normativo para essa definição.

**Infraestrutura conceitual** (incorporada por referência):
- "Possível" = alternativas não excluídas por fatores fora do controle do decisor (Etapa 1 §6.8).
- "Melhor" = superlativo comparativo ao longo das dimensões de §6.7 (capacidade, compreensibilidade, esforço, previsibilidade, feedback, consistência, relevância).
- "Afetado" = categoria de uso que interage diretamente com a superfície em questão, no regime correspondente — runtime ou build-time (§6.5–§6.6).
- "Superfície de uso" = forma do artefato acessível à categoria de uso; a forma interna é, por definição, não-superfície (§6.2–§6.4).
- **Critério de violação** = alternativa factível superior preterida em favor de fator controlável pelo decisor.

### §2. Componente Negativo (P0−')

**Não constituem razão derrotadora da obrigação expressa em P0+:**

**C1 — Externalidade decisor→afetado.** Fatores cuja força normativa deriva de uma distribuição assimétrica em que o decisor captura o benefício da forma adotada — conveniência operacional, economia de esforço, adequação a ferramentas de sua escolha, coerência de princípios técnicos operando no nível interno — e o afetado arca com o custo de interagir com uma superfície não projetada segundo as suas operações.

**C2 — Ilusão de neutralidade técnica.** Fatores cuja força normativa depende de o decisor apresentar como propriedade objetiva, necessária ou perspectiva-neutra — da superfície ou do espaço de alternativas — um julgamento indexado à sua posição dentro da implementação, que não se sustenta como objetivo examinado da posição do afetado. Duas formas: *de propriedade* (a superfície "é" natural/lógica/óbvia); *de restrição* (não "existe" alternativa que atenda ambos os lados).

### §3. Cláusulas Categóricas

**CL-A — Cláusula de Demonstração Positiva.** Quando o decisor reivindica exceção a um resultado-default de P0, a exceção se estabelece somente mediante demonstração positiva — específica e pública — da condição invocada. Quatro formas operacionais: (1) indistinguibilidade funcional na estrutura de ação do afetado; (2) apontamento específico de requisito de compliance externa; (3) exame formal de coexistência; (4) manutenção do caminho de refinamento.

**CL-B — Cláusula de Restauração de Simetria.** Quando o decisor invoca um estado estável cuja legitimidade depende de informação oculta pela assimetria de posição, a invocação tem peso normativo apenas mediante procedimento rastreável que restaure simetria informacional. Três formas operacionais: (1) plano explícito com prazo visível; (2) retorno rastreável do custo real da não-mudança; (3) teste contrafactual de troca de autor.

---

## 2. Tabela de subsunção: M01–M14 sob P0'

| Motivo | Descrição (Catálogo §4) | Subsume sob | Inferência de subsunção |
|---|---|---|---|
| **M01** | Default de tooling sem exame de alternativas | **C1** | O decisor captura a conveniência de não examinar alternativas (benefício); o afetado arca com a forma ditada pelo default (custo). A força invocada — "a ferramenta decidiu" — deriva inteiramente da relação decisor-ferramenta, sem qualquer apoio na relação afetado-superfície. Externalidade. |
| **M02** | Compliance como obrigação vinculante | **CL-A/Forma 2** | M02 reivindica uma exceção ao resultado-default de P0+ (aplicação integral). A exceção só se estabelece mediante apontamento específico ao requisito externo que determina *aquela* forma da superfície. O não-apontado cai sob P0+. |
| **M03** | Falsa dicotomia preocupação × conforto | **C2/forma-de-restrição + CL-A/Forma 3** | Substantivamente: a exclusividade da dicotomia é ilusão de neutralidade sobre o espaço de alternativas — indexada à perspectiva interna do decisor. Proceduralmente: para refutar a presunção substantiva, CL-A/Forma 3 exige exame formal de coexistência. |
| **M04** | Encapsulamento como transferência de custo | **C1** | O critério de encapsulamento é escolha arquitetural do decisor (benefício: coerência interna); o afetado arca com uma fronteira que não mapeia suas operações (custo). Força invocada deriva da relação decisor-arquitetura. Externalidade. |
| **M05** | Ambiguidade semântica genuína entre camadas | **CL-A/Forma 4** | M05 contém componente N legítimo: sob ignorância real da intenção do consumidor, o decisor pode adotar default — *se* o caminho de refinamento permanecer aberto. A condição é a demonstração positiva da Forma 4. |
| **M06** | Fluxo de controle como "restrição natural" | **C2/forma-de-propriedade + C1 (parcial)** | Primariamente: "natural" é predicado indexado à posição interna do decisor; da posição do afetado, a sequência é arbitrária. Secundariamente: manter a ordem interna é capturar a conveniência de não redesenhar — externalidade. |
| **M07** | Custo sintático de taxonomia refinada | **Infraestrutura (independência de eixos) + C1** | O custo sintático legitimamente restringe a *forma interna*; não é superfície e fica fora do escopo de P0+. Invocá-lo para a *forma exposta* é externalidade: o decisor captura o alívio sintático interno (benefício); o afetado arca com a mensagem inadequada (custo). A08 é consequência da definição de superfície (interno não é superfície) + C1. |
| **M08** | Ausência de mapeamento modos de falha → ações | **CL-A/Forma 1** | M08 é o único N genuíno estreito: sobrevive sob demonstração positiva de indistinguibilidade funcional na estrutura de ação do afetado. Sem demonstração, a forma útil prevalece (default A09 preservado). |
| **M09** | Reuso + custo de refatoração | **CL-B/Forma 1** | M09 invoca um estado estável (não-refatoração) cuja legitimidade depende de o adiamento ter plano real. CL-B/Forma 1 exige caminho explícito de customização com prazo visível. Sem plano, é racionalização. |
| **M10** | Consistência/atomicidade sem transação apontável | **C1 (com reforço de C2)** | Consistência e atomicidade operam no nível do modelo interno do decisor; sem transação apontável nas operações do afetado, o decisor captura a coerência do modelo (benefício) e externaliza o agrupamento inadequado (custo) — externalidade. Adicionalmente, invocar "consistência exige" como neutra é ilusão de neutralidade técnica (forma de propriedade). |
| **M11** | Compartilhamento interno como razão para fundir superfícies | **C1** | O decisor captura a economia de reutilização (benefício); o afetado arca com a ausência de superfície dedicada projetada para suas operações (custo). Externalidade direta. |
| **M12** | Custo de migração externa | **CL-B/Forma 1** | Mesma estrutura de M09: estado estável (não-migração) cuja legitimidade depende de plano real. CL-B/Forma 1 aplica-se sem modificação. |
| **M13** | Custo/risco alegado em vez de medido | **CL-B/Forma 2** | M13 invoca um estado estável (não-mudança) cuja justificação depende de informação (o custo real) que a posição do decisor oculta do afetado. CL-B/Forma 2 exige retorno rastreável desse custo. |
| **M14** | Familiaridade com autor original | **CL-B/Forma 3** | M14 invoca um estado estável (preservação) cuja justificação depende de informação (se o decisor atual endossa a forma ou apenas a herda). CL-B/Forma 3 exige teste contrafactual de troca de autor. |

**Resultado da subsunção:** 14/14. Todo motivo do catálogo é subsumível sob exatamente um (ou uma combinação específica) dos componentes e cláusulas de P0'.

---

## 3. Tabela de cobertura: A01–A15 por P0'

| Alvo | Descrição (Catálogo §4) | Coberto por | Tipo de cobertura |
|---|---|---|---|
| **A01** | Desarmar default de tooling | C1 | Substantivo (externalidade); via M01 |
| **A02** | Desarmar falsa dicotomia | C2/forma-de-restrição | Substantivo (ilusão sobre espaço de alternativas); via M03 |
| **A03** | Desarmar encapsulamento como omissão | C1 | Substantivo (externalidade); via M04 |
| **A04** | Desarmar "natural" como marcador de confusão | C2/forma-de-propriedade | Substantivo (ilusão sobre propriedade); via M06 |
| **A05** | Desarmar consistência/atomicidade sem transação | C1 | Substantivo (externalidade); via M10 |
| **A06** | Desarmar simplicidade interna ≠ externa | C1 | Substantivo (externalidade); via M11 |
| **A07** | Qualificar ambiguidade semântica sem fechar refinamento | CL-A/Forma 4 | Procedural (demonstração positiva do caminho de refinamento) |
| **A08** | Qualificar independência interno/exposto | Infraestrutura (§1 — definição de superfície) + C1 | Substantivo; absorvido pela infraestrutura conceitual |
| **A09** | Arbitrar útil × rica (default) | CL-A/Forma 1 (resultado-default) | Procedural (útil prevalece salvo demonstração positiva) |
| **A10** | Proceduralizar retorno do custo real | CL-B/Forma 2 | Procedural (restauração de simetria informacional sobre custo) |
| **A11** | Proceduralizar teste de troca de autor | CL-B/Forma 3 | Procedural (restauração de simetria sobre endosso atual) |
| **A12** | Proceduralizar plano gradual | CL-B/Forma 1 | Procedural (restauração de simetria sobre plano) |
| **A13** | Proceduralizar demonstração positiva de compliance | CL-A/Forma 2 | Procedural (demonstração positiva de requisito específico) |
| **A14** | Proceduralizar demonstração positiva de indistinguibilidade | CL-A/Forma 1 | Procedural (demonstração positiva de indistinguibilidade funcional) |
| **A15** | Exame formal de coexistência | CL-A/Forma 3 | Procedural (demonstração positiva por exame de alternativas) |

**Resultado da cobertura:** 15/15. Todo alvo normativo é coberto demonstravelmente.

---

## 4. Condições de cobertura mínima (R-14)

| Consolidação | Cobertura em P0' |
|---|---|
| **C1 — Desarmamento de R puros (A01–A06)** | Componente negativo (C1 + C2). Seis alvos cobertos via subsunção de M01, M03, M04, M06, M10, M11. ✓ |
| **C2 — Qualificação e demonstração positiva (A07, A08, A13, A14)** | CL-A (Formas 1, 2, 4) + Infraestrutura para A08. ✓ |
| **C3 — Plano gradual contra petrificação (A12)** | CL-B/Forma 1. ✓ |
| **A05 (irredutível)** | C1; a condição "sem transação apontável" fica explícita pela ausência de fundamento na relação afetado-superfície. ✓ |
| **A09 (irredutível)** | CL-A/Forma 1 (resultado-default). ✓ |
| **A10 (irredutível)** | CL-B/Forma 2. ✓ |
| **A11 (irredutível)** | CL-B/Forma 3. ✓ |
| **A15 (irredutível)** | CL-A/Forma 3. ✓ |

**Orçamento filosófico integralmente coberto por P0'.**

---

## 5. Verificação das restrições formais (Bloco A, B, C)

| R | Verificação |
|---|---|
| R-01 DESARMAR-C1 | ✓ — C1 + C2 subsumem M01, M03, M04, M06, M10, M11; os seis falham pela ausência de fundamento na relação afetado-superfície |
| R-02 QUALIFICAR-INTERNO-M05 | ✓ — CL-A/Forma 4 preserva o N legítimo e especifica a condição de legitimidade |
| R-03 QUALIFICAR-INTERNO-M07 | ✓ — infraestrutura (independência de eixos) + C1 articulam a separação |
| R-04 PROCEDURALIZAR-M13 | ✓ — CL-B/Forma 2 |
| R-05 PROCEDURALIZAR-M14 | ✓ — CL-B/Forma 3 |
| R-06 PROCEDURALIZAR-M08 | ✓ — CL-A/Forma 1 |
| R-07 EXCEÇÃO-ESTREITA-M02 | ✓ — CL-A/Forma 2 exige apontamento específico |
| R-08 ATRAVESSADORA | ✓ — P0' é formulado em termos de decisor/afetado/superfície, que valem em runtime e build-time (cf. §6.5–§6.6 da Etapa 1) |
| R-09 GENERALIDADE | ✓ — P0' não nomeia ferramentas, linguagens, implementações; opera no nível categórico |
| R-10 UNIVERSALIDADE | ✓ — aplicável por qualquer decisor que define superfície |
| R-11 PUBLICIDADE | ✓ — CL-A e CL-B exigem demonstração/procedimento público; citável e invocável |
| R-12 ORDENAMENTO | ✓ — conflito positivo × negativo resolve-se por resultado-default explícito + CL-A; ordem não arbitrária |
| R-13 FINALIDADE | ✓ — princípio é instância final no escopo coberto (preservado de P0) |
| R-14 COBERTURA MÍNIMA | ✓ — verificado no §4 |

---

## 6. Extensão conservadora (teste de equivalência de veredito com P0)

A extensão conservadora exige que para todo caso C do domínio de P0 (C01–C20), o veredito produzido por P0' coincida com o veredito produzido por P0.

**Mapeamento formal decidor→afetado:**
- Todo motivo que P0 trata como N1–N6 é agora subsumido sob C1 ou C2, que entregam o mesmo veredito (não conta como razão derrotadora).
- Toda cláusula de P0 é agora uma forma operacional de CL-A ou CL-B, que entrega o mesmo veredito (exceção exige demonstração específica; estado estável exige restauração de simetria).
- Q-A08 é absorvida pela infraestrutura; o veredito correspondente (independência de eixos, forma exposta governada por P0+) é produzido pela definição de superfície + C1 aplicado ao caso.

**Conclusão formal:** P0' é extensão conservadora de P0 sobre o domínio C01–C20 por construção. A verificação empírica de *precisão* (ausência de super-inclusão) pertence ao Step 6.

---

## 7. Exit

- **P0' composto.**
- **14/14 motivos subsumem** sob componentes ou cláusulas categóricas (§2).
- **15/15 alvos cobertos** (§3).
- **R-01 a R-14 verificadas** (§5).
- **Extensão conservadora demonstrada por construção** (§6).

Pronto para Step 6 — testes empíricos de precisão sobre R3 (C09, C11, C13, C17, C19), casos novos (N1, N2, N3 da rodada 5.3) e um caso de fronteira adicional.
