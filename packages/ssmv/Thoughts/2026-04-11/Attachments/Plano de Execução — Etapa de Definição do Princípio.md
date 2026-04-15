# Plano de Execução — Etapa de Definição do Princípio

> **Insumo metodológico.** [`Attachments/Etapa de Definição do Princípio — Da Etapa 3 ao Princípio Formulado.md`](Attachments/Etapa%20de%20Defini%C3%A7%C3%A3o%20do%20Princ%C3%ADpio%20%E2%80%94%20Da%20Etapa%203%20ao%20Princ%C3%ADpio%20Formulado.md)
> **Insumo material.** [`../2026-04-09/Catálogo de Condições de Derrota e Racionalizações.md`](../2026-04-09/Cat%C3%A1logo%20de%20Condi%C3%A7%C3%B5es%20de%20Derrota%20e%20Racionaliza%C3%A7%C3%B5es.md)
> **Status.** Plano (não execução).

---

## 0. Objetivo e produto final

Converter o catálogo da Etapa 3 — 20 casos paradigmáticos, 14 motivos diagnosticados, 15 alvos normativos (A01–A15), 3 consolidações (C1/C2/C3) + 5 alvos irredutíveis — no **princípio normativo central** do artigo, em conformidade com o procedimento Rawls/Scanlon/Thomson/Daniels descrito no insumo metodológico.

**Produto final:** arquivo `Princípio Central — Versão Refinada.md`, contendo restrições formais, princípio refinado, rastro de iterações e cobertura caso-a-caso.

**Fora desta etapa (não embaralhar):** comparação com teorias rivais; tratamento de objeções; estilização final do artigo.

---

## 1. Convenções de execução

- Cada sub-etapa entrega um **arquivo intermediário próprio**, numerado (`01-…`, `02-…`, …). Nada de inline no chat.
- Iterações sobre o princípio são **versionadas** (`P0`, `P1`, `P2`, …) e **nunca sobrescritas** — cada versão é arquivo separado para preservar o rastro exigido pelo equilíbrio reflexivo.
- Toda decisão de arquitetura é registrada com justificação curta (1–2 parágrafos) no próprio arquivo da versão.
- Toda iteração `5→4` ou `6→4` produz um **diff documentado**: o que mudou, qual restrição/falha disparou a mudança.
- Pausa obrigatória entre Steps. Não encadear automaticamente: o autor confirma a passagem.

---

## 2. Pré-condições

Antes de iniciar o Step 1, verificar:

1. O catálogo está congelado — não haverá alteração de §4 ou §5 durante a execução desta etapa.
2. O autor aceita o pressuposto §1.1 do catálogo (reconhecimento intersubjetivo como evidência) como teoria de fundo a ser preservada pelo princípio. Se não aceita, o equilíbrio reflexivo amplo (Step 4) ficará comprometido.
3. O autor decide previamente se rejeita alguma das cinco restrições formais de Rawls (*A Theory of Justice*, §23: generalidade, universalidade, publicidade, ordenamento, finalidade); registrar as rejeições com motivo.

---

## STEP 0 — Preparação do material de trabalho

**Procedimento.**

1. Reler o insumo metodológico inteiro (uma vez, sem produzir comentário ainda).
2. Reler §3, §4 e §5 do catálogo.
3. Produzir duas tabelas de trabalho:
   - `00a-casos-classificados.md` — 20 casos com `D1` (`R1`/`R2`/`R3`), regime, família e fator-chave; reordenados pelo eixo `D1` para acelerar o uso na Rodada 5.1.
   - `00b-alvos-mapeados.md` — os 15 alvos `A01–A15`, cada um com motivo de origem (`M…`), classe (`R puro`, `R estrutural-procedimental`, `misto`, `N puro`, `fora de escopo`) e consolidação (`C1`/`C2`/`C3` ou irredutível).

**Exit.** Tabelas existem e estão consistentes com o catálogo. Nenhum trabalho normativo foi feito ainda.

---

## STEP 1 — Transição da Etapa 3 (Restrições Formais ao Princípio)

> Esta é a operação que o insumo metodológico exige seja **separada da formulação**. É onde o trabalho rigoroso começa.

### 1.1 Recodificar os motivos como restrições

Para cada uma das cinco famílias de exigência enunciadas no insumo metodológico, escrever a restrição correspondente como proposição da forma **"qualquer princípio candidato P deve…"**:

- **`Restrição-DESARMAR (C1).`** P deve desarmar `M01, M03, M04, M06, M10, M11` mostrando, para cada um, *por que não conta como razão*. (Não basta proibir.)
- **`Restrição-QUALIFICAR-INTERNO (M05/M07).`** P deve distinguir, dentro de `M05` e `M07`, o componente `N` que sobrevive do componente `R` que colapsa.
- **`Restrição-PROCEDURALIZAR (M13, M14, M08).`** P deve especificar a **condição procedimental** sob a qual a norma se aplica. Não basta enunciá-la.
- **`Restrição-EXCEÇÃO-ESTREITA (M02).`** P deve preservar a exceção genuína de `M02` sem deixar essa exceção servir de rota de fuga retórica.
- **`Restrição-ATRAVESSADORA (runtime/build-time).`** P deve atravessar `runtime` e `build-time` sem colapsar a distinção e sem depender de assimetria não declarada entre UX e DX.

### 1.2 Adicionar restrições rawlsianas formais

Listar quais das cinco restrições de Rawls (§23) são incorporadas, e registrar com motivo curto qualquer rejeição.

### 1.3 Restrição de cobertura do orçamento filosófico

P deve cobrir as 3 consolidações (`C1`, `C2`, `C3`) e os 5 alvos irredutíveis (`A05`, `A09`, `A10`, `A11`, `A15`). Esta restrição é a métrica de **completude mínima**.

### 1.4 Deliverable

- `01-restricoes-formais.md` — lista numerada (`R-01…R-NN`).
- **Exit.** Lista revisada e fechada. O autor confirma que qualquer princípio candidato deve passar por todas elas para ser sequer avaliado na Etapa 5.

---

## STEP 2 — Etapa 4: Formulação do Princípio Candidato Mínimo `P0`

> "Mínimo" é técnico: o princípio deve cobrir o orçamento sem cobrir mais que o necessário.

### 2.1 Componente positivo

Reescrever o truísmo como norma — versão mais simples possível. **Sem qualificações ainda.** Enuncia *o que o decisor deve fazer ao definir uma superfície*. Limite informal: 1–3 frases.

### 2.2 Componente negativo

Lista enxuta dos pseudo-derrotadores que devem ser **explicitamente desarmados** (`C1`: `M01, M03, M04, M06, M10, M11`). Para cada um, frase única na forma "*X não conta como razão derrotadora porque…*". Esta bipartição é estrutural, não estilística — ver §27 do insumo metodológico.

### 2.3 Decisão de arquitetura

Decidir entre:

- **(a)** Princípio central (positivo + negativo) **+ cláusulas anexas**.
- **(b)** Princípio único super-articulado.

Default recomendado pelo insumo metodológico: **(a)**. Registrar a decisão com 1 parágrafo de justificação. Esta decisão tem consequências diretas para o teste da Etapa 5 — uma reabertura aqui é cara.

### 2.4 Esboço das cláusulas (somente se arquitetura (a))

Distribuir os alvos restantes em cláusulas, na seguinte estrutura tentativa (extraída do insumo metodológico §96):

```
Princípio central (positivo + negativo)
  ├── Cláusula de qualificação para mistos        (A07, A08)
  ├── Cláusula procedimental — demonstração positiva de indistinguibilidade   (A14, sustenta A09)
  ├── Cláusula procedimental — plano gradual contra petrificação              (A12)
  ├── Cláusula procedimental — retorno do custo real da não-mudança           (A10)
  ├── Cláusula procedimental — teste de troca de autor                        (A11)
  ├── Cláusula procedimental — demonstração positiva de compliance            (A13, exceção M02)
  └── Cláusula auxiliar — exame formal de coexistência                        (A15)
```

`A05` (atomicidade sem transação apontável) e `A09` (arbitragem útil × rica) são alvos irredutíveis que precisam de tratamento explícito — decidir se entram como sub-cláusulas do componente negativo ou como princípios auxiliares.

### 2.5 Verificação cruzada com restrições formais

Antes de fechar `P0`, percorrer a lista do `01-restricoes-formais.md` e marcar, para cada restrição, *como `P0` a satisfaz*. Restrição não satisfeita ⇒ retornar a 2.1/2.2/2.4 antes de avançar.

### 2.6 Deliverable

- `02-principio-P0.md` — princípio candidato mínimo + tabela de cobertura das restrições.
- **Exit.** Inspeção formal: `P0` satisfaz todas as restrições do Step 1. Nenhuma cláusula prometida no §2.4 está vazia.

---

## STEP 3 — Etapa 5: Teste por Casos (núcleo iterativo)

> **Esta é a primeira iteração obrigatória do procedimento.** O objetivo não é confirmação: é tentativa de falsificação.

### 3.1 Rodada 5.1 — Teste contra os casos `R1` (âncoras de condenação firme)

**Casos** (do catálogo §3): `C01, C03, C04, C05, C07, C12, C16, C18`.

**Procedimento.** Para cada caso:

1. Aplicar `P_atual`.
2. Registrar: condena? sem qualificação? hesita? qual restrição/cláusula explica.
3. Se houver hesitação, identificar se a falha está no **componente positivo** (núcleo fraco) ou no **componente negativo** (pseudo-derrotador insuficientemente desarmado).

**Critério de saída.** `P_atual` condena os 8 casos sem qualificação. Falha aqui ⇒ retornar ao Step 2 e reformular o **componente positivo** ou o **componente negativo**, gerando `P1` (novo arquivo).

**Deliverable.** `03-rodada-5-1-R1.md`.

### 3.2 Rodada 5.2 — Teste contra os casos `R2`/`R3` (analiticamente central)

**Casos R2** (`R` instável): `C02, C06, C08, C10, C14, C15, C20`.
**Casos R3** (`R` com conforto, indeterminado a priori): `C09, C11, C13, C17, C19`.

**Procedimento.** Para cada caso:

1. Aplicar `P_atual`.
2. Registrar resultado obtido (condena puro / condena parcial / preserva componente `N` / não decide).
3. Comparar com resultado esperado pelo catálogo §5 (M correspondente, classe `R puro` / `misto` / `N puro`).
4. Marcar convergência: total / parcial / divergência.

**Critérios de falha.**

- **Super-inclusão.** `P_atual` condena `M08` (caso C03 na variação V4 do catálogo) junto com os `R puros` ⇒ as cláusulas qualificadoras estão fracas. Reformular cláusulas (`A07/A08/A14`).
- **Sub-inclusão.** `P_atual` preserva `M03` (`C09`/`C17`) junto com `M08` ⇒ o componente negativo está omisso. Reformular `R-DESARMAR`.
- **Divergência por motivo misto.** `P_atual` não distingue componente `N` de componente `R` em `M05`, `M07`, `M09`, `M12` ⇒ a cláusula de qualificação está mal calibrada.

**Deliverable.** `04-rodada-5-2-R2-R3.md`.

### 3.3 Rodada 5.3 — Casos novos não cobertos pelo corpus

> O insumo metodológico exige 2–3 casos novos. Esta é a única defesa contra um princípio super-ajustado ao corpus.

**Construir três casos novos**, cada um pensado para estressar uma fronteira distinta do princípio:

1. **Caso `runtime` puro** fora das famílias do corpus (não produto, não erro) — testa atravessamento.
2. **Caso `build-time` combinado** que mistura duas famílias (ex.: composição + legado) — testa interação entre cláusulas.
3. **Caso de fronteira `N puro` × `misto`** — situa-se entre `M08` (único `N` puro) e `M07` (misto com componente `N` quanto a tipos): testa se a cláusula de demonstração positiva é estreita o suficiente.

**Procedimento.** Para cada caso novo, aplicar `P_atual` e registrar a intuição produzida. Critério de saída: nenhuma intuição é manifestamente implausível para um praticante competente do tipo descrito em §1.2 do catálogo.

**Deliverable.** `05-rodada-5-3-casos-novos.md`.

### 3.4 Iteração 5↔4

- Cada falha em 5.1, 5.2 ou 5.3 dispara retorno ao Step 2.
- Cada nova versão do princípio é arquivo próprio: `02-principio-P1.md`, `02-principio-P2.md`, …
- Cada nova versão começa com a tabela de **diff** em relação à anterior: o que mudou + qual rodada/caso disparou.
- **Limite operacional.** Se após 4 versões (`P0…P3`) o princípio ainda falhar estruturalmente em 5.1, escalar ao autor: a falha provavelmente é na própria escolha de truísmo, não no princípio. Registrar e parar a iteração.

### 3.5 Deliverable consolidado

- `06-principio-Pn-pos-testes.md` — versão estável após convergência das três rodadas, com índice de iterações.

---

## STEP 4 — Etapa 6: Equilíbrio Reflexivo Amplo

> Procedimento rawlsiano formal, na variante de **Daniels** (*wide reflective equilibrium*), exigida porque o catálogo já contém intuições de segunda ordem (Fase 6 — inversão posicional).

### 4.1 Coerência estreita

Verificar coerência de `Pn` com cada um dos 20 casos individuais e com o catálogo §5. Procurar contradições latentes — não apenas falhas operacionais já vistas na Etapa 5.

**Deliverable.** `07-coerencia-estreita.md`.

### 4.2 Coerência ampla — teorias de fundo

A teoria de fundo relevante é §1.1 do catálogo: **reconhecimento intersubjetivo de praticantes competentes como evidência filosófica**. Verificar:

1. As cláusulas procedimentais (`A10`, `A11`, `A14`) pressupõem uma noção de "verificabilidade pelo afetado". `Pn` precisa ser coerente com essa noção — não apenas usá-la implicitamente.
2. A "amplitude posicional" (§1.2 do catálogo) é a base da autoridade epistêmica usada nos testes. `Pn` não pode conter cláusula que pressuponha um tipo de praticante incompatível com essa base.
3. A "ação do usuário" (mencionada explicitamente no insumo metodológico §100) precisa ser articulada pelo componente positivo se for pressuposta por `A14`. Se não for, `A14` está suspensa no ar — sinal de incoerência de fundo.

**Deliverable.** `08-coerencia-ampla.md`.

### 4.3 Decisão de arquitetura final

Confirmar ou revisar a decisão tomada em 2.3. Produzir o diagrama final do princípio (versão definitiva da árvore central + cláusulas).

### 4.4 Iteração 6↔4

- Se a coerência ampla revelar incoerência de fundo, retornar ao Step 2 e gerar `P_{n+1}`.
- Re-executar Steps 3 e 4 em sequência. **Esta segunda iteração é menos frequente que a 5↔4, mas obrigatória sempre que o equilíbrio revelar incoerência.**
- Limite operacional: se a iteração 6↔4 for disparada mais de duas vezes, escalar ao autor — provavelmente a teoria de fundo precisa ser reformulada antes do princípio.

### 4.5 Deliverable final

- `09-principio-refinado-final.md` — versão final do princípio + apêndice com rastro de versões `P0…Pn` (1 linha por versão indicando o que mudou e por quê).

---

## STEP 5 — Empacotamento

### 5.1 Documento integrador

Reunir os deliverables num único arquivo `Princípio Central — Versão Refinada.md`:

- §1 Restrições formais (de `01`).
- §2 Princípio refinado final (de `09`).
- §3 Apêndice — rastro de iterações (`P0…Pn` com diffs).
- §4 Apêndice — cobertura caso-a-caso (resumo de `03`, `04`, `05`).

### 5.2 Exclusões explícitas (registrar no documento integrador)

Sob título "Nota sobre o que esta etapa **não** faz" (paráfrase do §131 do insumo metodológico):

- Comparação com teorias rivais — Etapa subsequente.
- Tratamento de objeções — Etapa subsequente.
- Apresentação prosaica do princípio para o leitor — estilização final do artigo.

---

## 6. Critérios de qualidade global (checklist final)

- [ ] Toda restrição formal do `01-restricoes-formais.md` é demonstravelmente satisfeita pelo princípio final.
- [ ] Toda iteração `5↔4` e `6↔4` está rastreada em arquivo próprio, com diff explícito e disparador identificado.
- [ ] Nenhum dos 14 motivos do catálogo (M01–M14) ficou sem tratamento explícito no princípio final.
- [ ] As 3 consolidações (`C1`, `C2`, `C3`) e os 5 alvos irredutíveis (`A05`, `A09`, `A10`, `A11`, `A15`) estão integralmente cobertos.
- [ ] A bipartição **componente positivo / componente negativo** foi mantida — não embaralhada.
- [ ] A teoria de fundo §1.1 do catálogo é explicitamente coerente com o princípio final.
- [ ] O princípio final atravessa `runtime` e `build-time` sem colapsar a distinção (verificável nos casos R1+R2 de cada regime).
- [ ] Os 3 casos novos da Rodada 5.3 produzem intuições plausíveis.

---

## 7. Riscos e mitigação

| Risco | Como aparece | Mitigação |
|---|---|---|
| **Super-inclusão** | `Pn` condena `M08` junto com `R` puros | Detectada na Rodada 5.2 (super-inclusão); reformular cláusulas qualificadoras (`A07/A08/A14`) |
| **Sub-inclusão** | `Pn` preserva `M03` junto com `M08` | Detectada nas Rodadas 5.1 + 5.2; reformular componente negativo |
| **Incoerência de fundo** | `A14` pressupõe noção que o positivo não articula | Detectada na Rodada 6.2; reformular componente positivo |
| **Scope creep** | Começar a responder objeções/teorias rivais | §5.2 do empacotamento explicita as exclusões; revisar antes de fechar Step 5 |
| **Petrificação iterativa** | Loop indefinido `5↔4` ou `6↔4` | Limites operacionais: ≤4 versões antes de escalar em 5↔4; ≤2 disparos antes de escalar em 6↔4 |
| **Super-ajuste ao corpus** | Princípio passa nos 20 casos mas falha em casos novos | Rodada 5.3 é a defesa; se ela falhar, qualificação adicional, não rejeição |
| **Decisão de arquitetura precipitada** | Escolher (a) ou (b) em 2.3 sem registro de motivo | Exigir 1 parágrafo de justificação no arquivo `02-principio-P0.md`; revisitada em 4.3 |

---

## 8. Mapa visual do procedimento

```
STEP 0  Preparação
   ↓
STEP 1  Transição → restrições formais (R-01…R-NN)
   ↓
STEP 2  Etapa 4 → P0 (positivo + negativo + cláusulas)
   ↓
STEP 3  Etapa 5 → testes
   ├── 5.1 R1     ─┐
   ├── 5.2 R2/R3   ├─ falha → STEP 2 (P1, P2…)
   └── 5.3 novos  ─┘
   ↓
STEP 4  Etapa 6 → equilíbrio reflexivo amplo
   ├── 4.1 estreita
   ├── 4.2 ampla   ── incoerência de fundo → STEP 2 (P_{n+1}) → STEP 3 → STEP 4
   └── 4.3 arquitetura final
   ↓
STEP 5  Empacotamento → Princípio Central — Versão Refinada.md
```
