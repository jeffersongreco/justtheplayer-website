# 00a — Casos Classificados (ordenados por D1)

> Tabela de trabalho para o STEP 3 (Rodadas 5.1, 5.2, 5.3).
> Fonte: §3 do Catálogo de Condições de Derrota e Racionalizações.
> Reordenado pelo eixo D1 para acelerar uso na Rodada 5.1.

---

## R1 — Âncoras de Condenação Firme (sem justificativa)

Casos a serem condenados sem qualificação na Rodada 5.1.

| ID  | Regime  | Família   | Motivo Principal | Superfície         | Fator-chave                              |
|-----|---------|-----------|------------------|--------------------|------------------------------------------|
| C01 | build   | módulo    | M06              | nome de método     | nome reflete implementação               |
| C03 | ambos   | erro      | M07              | mensagem de erro   | gerada pelo motor interno                |
| C04 | runtime | produto   | M06              | empty state        | vocabulário do modelo de dados           |
| C05 | build   | API       | M06              | assinatura         | ordem segue processamento interno        |
| C07 | build   | módulo    | M11              | tipo de retorno    | objeto interno reusado como retorno      |
| C12 | runtime | produto   | M06              | date picker        | `new Date()` como default trivial        |
| C16 | runtime | produto   | M06 + M10        | lista              | ordem ditada pelo `ORDER BY`             |
| C18 | build   | módulo    | M11              | nomes de função    | sem convenção; cada autor nomeou         |

> **Nota C03.** M07 é o motivo primário; M08 só aparece na variação V4 (indistinguibilidade funcional). C03 é o único caso onde M08 é testável — isso será relevante na Rodada 5.2 (critério de super-inclusão).

---

## R2 — Justificativa Instável (D2 = R)

Casos onde a justificativa é oferecida e colapsa. Analiticamente críticos para Rodada 5.2.

| ID  | Regime  | Família    | Motivo Principal | Superfície          | Fator-chave                              |
|-----|---------|------------|------------------|---------------------|------------------------------------------|
| C02 | build   | API        | M11 + M12        | assinatura          | flag com efeito colateral oculto         |
| C06 | runtime | produto    | M10              | formulário          | transação atômica por simplicidade       |
| C08 | ambos   | prazo      | M06              | default             | sentinel falsy por conveniência          |
| C10 | runtime | produto    | M01 + M06        | botão               | rótulo genérico do componente            |
| C14 | ambos   | erro       | M07              | tipo de erro        | erro genérico por simplicidade           |
| C15 | build   | composição | M11 + M12        | definição de tipo   | fronteira pública/interna não mantida    |
| C20 | ambos   | prazo      | M13              | threshold           | "não havia tempo"                        |

---

## R3 — Justificativa com Conforto (D2 = I, indeterminado a priori)

Casos onde o resultado esperado não é decidido antes de aplicar P. Analiticamente centrais para calibrar a fronteira N puro × misto.

| ID  | Regime  | Família    | Motivo Principal | Superfície            | Fator-chave                              |
|-----|---------|------------|------------------|-----------------------|------------------------------------------|
| C09 | build   | API        | M03              | fluxo de init         | separação por testabilidade              |
| C11 | build   | API        | M05              | padrão de invocação   | assincronia "reflete a realidade"        |
| C13 | build   | módulo     | M01              | definição de tipo     | auto-geração a partir do schema          |
| C17 | ambos   | composição | M03 + M04 + M05  | configuração          | separação de responsabilidades interna   |
| C19 | ambos   | legado     | M13 + M14        | módulo                | "funciona, risco de regressão"           |

---

## Distribuição por regime

| Regime    | R1        | R2              | R3              |
|-----------|-----------|-----------------|-----------------|
| `runtime` | C04, C12, C16 | C06, C10    | —               |
| `build`   | C01, C05, C07, C18 | C02, C15 | C09, C11, C13  |
| `ambos`   | C03       | C08, C14, C20   | C17, C19        |

> Os regimes `runtime` e `build` estão representados nos três níveis de D1 — condição necessária para o teste de atravessamento R-ATRAVESSADORA (STEP 1).
