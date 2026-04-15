# 00b — Alvos Normativos Mapeados (A01–A15)

> Tabela de trabalho para os STEPS 1 e 2.
> Fonte: §4 e §5 do Catálogo de Condições de Derrota e Racionalizações.
> Cada alvo: motivo de origem, classe normativa, consolidação e formulação operacional.

---

## Legenda de classes

| Classe                    | Significado                                                              |
|---------------------------|--------------------------------------------------------------------------|
| `R puro`                  | Desaparece inteiramente sob inversão posicional                          |
| `R estrutural-procedimental` | Colapsa sob inversão, mas sustentado por assimetria informacional ou viés posicional do decisor |
| `Misto`                   | Componente N sobrevive; componente R colapsa — exige decomposição         |
| `N puro`                  | Sobrevive sob inversão, apenas sob cláusula procedimental estreita        |
| `Fora de escopo`          | O truísmo não se aplica à parte regulada, mas exige proceduralização contra mascaramento |

---

## Tabela principal

| ID  | Motivo(s) | Classe                    | Consolidação        | Formulação operacional                                                                            |
|-----|-----------|---------------------------|---------------------|---------------------------------------------------------------------------------------------------|
| A01 | M01       | R puro                    | C1                  | Desarmar "default de tooling como pseudo-restrição" — exigir exame explícito de alternativas      |
| A02 | M03       | R puro                    | C1                  | Desarmar a falsa dicotomia preocupação legítima × conforto do afetado                             |
| A03 | M04       | R puro                    | C1                  | Desarmar "encapsulamento como omissão reificada" — verificabilidade pelo lado do consumidor        |
| A04 | M06       | R puro                    | C1                  | Desarmar "`natural`" como marcador de confusão — explicitar o que o "natural" esconde             |
| A05 | M10       | R puro                    | C1 / irredutível    | Desarmar "consistência/atomicidade" quando não há transação apontável                             |
| A06 | M11       | R puro                    | C1                  | Desarmar "simplicidade interna ≠ simplicidade externa" — confusão de níveis                       |
| A07 | M05       | Misto (N parcial)         | C2                  | Qualificar: ambiguidade semântica genuína reescreve a obrigação, sem fechar o caminho de refinamento |
| A08 | M07       | Misto (N parcial)         | C2                  | Qualificar: custo sintático de tipos ricos justifica a forma *interna*, não a mensagem *exposta*  |
| A09 | M08       | N puro (estreito)         | Irredutível         | Arbitrar entre superfície útil × superfície rica — sob cláusula de demonstração de indistinguibilidade |
| A10 | M13       | R estrutural-procedimental | Irredutível        | Proceduralizar retorno do custo real da não-mudança ao decisor (visibilidade + rastreabilidade)   |
| A11 | M14       | R estrutural-procedimental | Irredutível        | Proceduralizar teste de troca de autor ao avaliar preservação de forma herdada                    |
| A12 | M09, M12, atravessador | Misto (restrição parcial + R por petrificação) | C3 | Proceduralizar plano gradual contra petrificação — adiamento com caminho explícito de customização |
| A13 | M02       | Fora de escopo            | C2                  | Proceduralizar demonstração positiva de compliance — exceção só vale com apontamento ao requisito externo específico |
| A14 | M08       | N puro (estreito)         | C2                  | Proceduralizar demonstração positiva de indistinguibilidade funcional (sustenta A09)              |
| A15 | M03       | R puro                    | Irredutível         | Proceduralizar exame formal de coexistência antes que preocupação legítima seja aceita como derrotadora |

---

## Agrupamento por consolidação

### C1 — Desarmamento de R puros (A01–A06)

A01, A02, A03, A04, A05*, A06

> (*) A05 tem status dual — pertence ao grupo C1 pela classe do motivo (M10 = R puro), mas é irredutível por exigir um teste procedimental específico (apontar a transação) que não é subsumível numa fórmula única de desarmamento.

### C2 — Qualificação e demonstração positiva (A07, A08, A13, A14)

A07, A08, A13, A14

> A13 está aqui porque "demonstração positiva de compliance" é estruturalmente análoga a A14 — ambas exigem prova positiva de uma condição, não apenas a invocação do motivo.

### C3 — Plano gradual contra petrificação (A12)

A12

> Cobre M09, M12 e o motivo atravessador (ausência de plano gradual como forma universal de R por omissão de procedimento).

### Irredutíveis — exigem tratamento explícito no princípio (A05, A09, A10, A11, A15)

| ID  | Natureza da irredutibilidade                                                        |
|-----|-------------------------------------------------------------------------------------|
| A05 | Disarming de "consistência/atomicidade" requer teste específico (transação apontável) que não se subsume a uma fórmula genérica de C1 |
| A09 | Arbitragem genuína entre dois comprometimentos normativos internos — não é desarmamento, não é qualificação |
| A10 | Requer alteração da estrutura informacional do decisor, não apenas argumento — o componente procedimental é insubstituível |
| A11 | Requer um teste de posicionamento específico (troca de autor) — não é subsumível em nenhuma cláusula geral |
| A15 | Exame de coexistência é mais que desarmar M03 (A02) — é uma obrigação de varredura prévia do espaço de soluções, separada do desarmamento |

---

## Distribuição por trabalho exigido do princípio

| Trabalho exigido        | Alvos                    |
|-------------------------|--------------------------|
| **Desarmar**            | A01, A02, A03, A04, A05, A06 |
| **Qualificar**          | A07, A08                 |
| **Arbitrar**            | A09                      |
| **Proceduralizar**      | A10, A11, A12, A13, A14, A15 |
