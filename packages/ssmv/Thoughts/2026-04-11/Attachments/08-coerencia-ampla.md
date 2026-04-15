# 08 — Coerência Ampla (STEP 4.2)

> Deliverable do STEP 4.2 do Plano de Execução.
> **Propósito.** Verificar coerência de P0 com a teoria de fundo do catálogo (§1.1 e §1.2). Três verificações obrigatórias pelo plano + três observações de coerência herdadas do STEP 4.1 (OC-1, OC-2, OC-3).
> **Teoria de fundo relevante.** §1.1: reconhecimento intersubjetivo de praticantes competentes como evidência filosófica. §1.2: amplitude posicional como base da autoridade epistêmica.
> **Critério de falha.** Incoerência de fundo → retorno ao STEP 2 e geração de P_{n+1}.

---

## §1 — Teoria de fundo declarada

**§1.1 — Reconhecimento intersubjetivo como evidência filosófica.**
O corpus do catálogo repousa sobre o pressuposto de que o *reconhecimento convergente por praticantes competentes, em condições de reflexão, conta como evidência filosófica* de que um fenômeno existe e tem a estrutura que aparenta ter. É o equivalente filosófico dos *considered judgments* de Rawls.

**§1.2 — Amplitude posicional como critério da comunidade epistêmica.**
Os praticantes competentes são aqueles que ocuparam *ambos* os lados da relação: ter definido superfícies e ter consumido superfícies definidas por outros; ter atuado em runtime e em build-time, ou ter visibilidade direta de ambos. A aptidão para o teste de inversão posicional (Fase 6 do catálogo) depende dessa amplitude.

**Consequência para P0.** P0 é construído sobre esse corpus. As cláusulas procedimentais de P0 herdam a autoridade epistêmica desse framework. Se qualquer cláusula pressupuser uma noção incompatível com §1.1 ou um tipo de praticante incompatível com §1.2, P0 está incoerente com sua própria base.

---

## §2 — Verificação 1: Verificabilidade pelo afetado (A10, A11, A14)

As três cláusulas procedimentais que o plano exige verificar explicitamente:

---

### Cláusula-P3 / A10 — Retorno do custo real da não-mudança

**Pressuposto implícito.** A cláusula requer que o decisor tenha acesso a informação que o afetado tem mas que estruturalmente não retorna ao decisor: o custo de absorver uma interface inadequada.

**Coerência com §1.1.** O reconhecimento intersubjetivo valida esse pressuposto: praticantes competentes com amplitude posicional reconhecem imediatamente a assimetria — do lado do afetado, o custo é visível; do lado do decisor, fica obscuro por ausência de retorno. A cláusula não exige que o afetado demonstre o custo diretamente; exige que o decisor se posicione para *receber* essa informação.

**Coerência com §1.2.** A amplitude posicional de §1.2 é precisamente o que A10 operacionaliza procedimentalmente: a cláusula obriga o decisor a simular ou observar o que um praticante com amplitude posicional veria. Não há incompatibilidade.

**Resultado.** ✓ — A10 é coerente com a teoria de fundo.

---

### Cláusula-P4 / A11 — Teste de troca de autor

**Pressuposto implícito.** A cláusula requer que o decisor consiga sustentar a decisão sob o pressuposto de que o autor original é outro — um praticante sem familiaridade afetiva com o código.

**Coerência com §1.1.** O teste de inversão posicional da Fase 6 do catálogo é estruturalmente idêntico: o praticante competente deve reconhecer a decisão como válida mesmo ocupando o lado do afetado. A11 não introduz um novo tipo de evidência — operacionaliza o mesmo teste posicional que sustenta o corpus inteiro.

**Coerência com §1.2.** O critério de amplitude posicional (§1.2) é a base exata do teste: a troca de autor é um mecanismo para neutralizar o viés posicional que surge quando o decisor *é também* o autor — posição que contradiz a amplitude requerida pelo praticante competente. A11 não pressupõe praticante incompatível; pressupõe o mesmo praticante com amplitude, agora aplicado deliberadamente ao caso em questão.

**Resultado.** ✓ — A11 é coerente com a teoria de fundo.

---

### Cláusula-P1 / A14 — Demonstração positiva de indistinguibilidade funcional

**Pressuposto implícito.** A cláusula requer demonstrar que o afetado não pode agir diferente dados dois modos de apresentação distintos — o que pressupõe (a) que existe uma estrutura de ação identificável para o afetado, e (b) que essa estrutura é verificável.

**Coerência com §1.1.** A verificabilidade de A14 é mediada pelo mesmo reconhecimento intersubjetivo: "o afetado pode agir diferente dado X vs. Y" é exatamente o tipo de questão que praticantes competentes com amplitude posicional conseguem responder — tendo ocupado o lado do afetado, eles reconhecem quais distinções são operacionalmente relevantes. A demonstração positiva de A14 é, portanto, uma exigência de que o decisor produza evidência do tipo §1.1 — não uma exigência de prova formal de outro tipo.

**Coerência com §1.2.** A amplitude posicional de §1.2 é condição de possibilidade da demonstração: um praticante que nunca ocupou o lado do afetado não tem como produzir a evidência que A14 exige.

**Resultado.** ✓ — A14 é coerente com a teoria de fundo.

---

## §3 — Verificação 2: Amplitude posicional — tipo de praticante compatível

**Pergunta.** Alguma cláusula de P0 pressupõe um tipo de praticante *incompatível* com a amplitude posicional de §1.2?

**Exame cláusula a cláusula:**

| Cláusula | Tipo de praticante pressuposto | Compatível com §1.2? |
|----------|-------------------------------|----------------------|
| P0+/P0− (núcleo) | Decisor que define superfície + afetado que a consome | ✓ — é a relação central de §1.2 |
| N1–N6 | Decisor submetido ao teste posicional | ✓ — o teste posicional *é* §1.2 aplicado |
| Cláusula-Q (A07, A08) | Decisor com ignorância real da intenção do consumidor | ✓ — praticante que ainda não ocupou plenamente o lado do afetado naquele caso; cláusula preserva caminho de refinamento |
| Cláusula-P1 (A14) | Decisor capaz de avaliar a estrutura de ação do afetado | ✓ — exige amplitude posicional como condição de possibilidade |
| Cláusula-P2 (A12) | Decisor capaz de produzir plano com prazo visível | ✓ — não exige posição especial; exige procedimento público |
| Cláusula-P3 (A10) | Decisor com acesso ao custo da não-mudança | ✓ — a cláusula *produz* a condição de amplitude, não a pressupõe como já dada |
| Cláusula-P4 (A11) | Decisor que simula ausência de familiaridade autoral | ✓ — operacionalização direta de §1.2 |
| Cláusula-P5 (A13) | Decisor com acesso ao texto normativo | ✓ — não exige posição especial |
| Cláusula-A1 (A15) | Decisor capaz de varrer alternativas antes de aceitar derrotador | ✓ — não exige posição especial; exige procedimento |

**Nenhuma cláusula pressupõe praticante incompatível com §1.2.** Na verdade, o padrão inverso: as cláusulas procedimentais (P3, P4 especialmente) *produzem* ou *requerem* a amplitude posicional como condição de aplicação, reforçando §1.2 em vez de contradizê-lo.

**Resultado.** ✓ — Verificação 2 completa. Sem incompatibilidade.

---

## §4 — Verificação 3: OC-3 — "Acionável" em P0+ e "estrutura de ação" em A14

**O problema.** P0+ usa "acionável" como terceiro critério sem definir "estrutura de ação." A14 usa "estrutura de ação do afetado" como critério procedimental de indistinguibilidade. Se os dois conceitos não forem contínuos, A14 está suspensa no ar.

**Análise.**

"Acionável" em P0+ significa: a superfície permite ao afetado agir — decidir, operar, interpretar e reagir corretamente no contexto de seus objetivos. É um critério relacional: o que é acionável depende do que o afetado pode fazer.

"Estrutura de ação do afetado" em A14 é uma instância mais precisa do mesmo conceito: o conjunto específico de ações que o afetado pode executar diferencialmente dado o conteúdo da superfície. A14 pede demonstração de que duas formas são *indistinguíveis* nessa estrutura — ou seja, que nenhuma ação disponível ao afetado é sensível à distinção entre as duas formas.

Relação entre os dois: "acionável" (P0+) é o critério geral; "estrutura de ação" (A14) é a operacionalização desse critério para o caso de arbitragem entre superfícies concorrentes. P0+ pergunta "a superfície habilita ação do afetado?"; A14 pergunta "a distinção entre superfícies A e B é relevante para quais ações?".

**A continuidade é real.** A14 não pressupõe um conceito independente de "ação" — pressupõe o mesmo conceito de "acionável" que P0+ já contém, aplicado ao caso específico de comparação. Não há suspensão no ar: A14 operacionaliza P0+ para o caso de M08.

**Grounding em §1.1.** Ambos os conceitos ("acionável" e "estrutura de ação") são operacionalizados pelo mesmo mecanismo epistêmico: o reconhecimento intersubjetivo por praticantes competentes. A pergunta "o afetado pode agir diferente dado X vs. Y?" é respondida pelo mesmo corpus de reconhecimento que responde "a superfície X é acionável?". Não é necessário definir "estrutura de ação" a priori — o framework de §1.1 provê o método de identificação caso a caso.

**Necessidade de reformulação de P0+?** Não. A continuidade conceitual entre P0+ e A14 é real e grounded em §1.1. Tornar o pressuposto explícito em P0+ seria defensável estilisticamente, mas não é necessário para eliminar incoerência — porque não há incoerência, apenas pressuposição implícita que §1.1 resolve. A reformulação seria cosmética, não substantiva.

**Decisão:** O pressuposto de OC-3 será anotado como nota explicativa no STEP 4.3 (arquitetura final) — não dispara reformulação de P0.

**Resultado.** ✓ — OC-3 resolve-se sem incoerência de fundo. Anotação registrada para STEP 4.3.

---

## §5 — OC-1: Petrificação como fenômeno unificado

**A questão.** Cláusula-P2 (M09/M12) e Cláusula-P3 (M13) atacam mecanismos distintos do mesmo fenômeno — petrificação. A teoria de fundo deve acomodar essa pluralidade sem torná-la ad hoc.

**Análise.** O catálogo §5.3 e §4 já diagnostica a diferença:
- M09/M12: restrição parcial legítima + ausência de plano de remediação → petrificação por promessa tácita não cumprida.
- M13: custo/risco alegado sem contabilização → petrificação por assimetria informacional estrutural.

O catálogo §6 unifica as duas sob o mesmo diagnóstico: "A estabilidade de muitas racionalizações não vem de sua força argumentativa, mas da **estrutura informacional** em que a prática ocorre." Isso é o que torna a procedimentalização necessária em ambos os casos — não basta o argumento, é preciso alterar as condições informacionais.

**Unificação.** O fenômeno comum é: uma restrição real (custo de migração / custo de mudança) é usada para bloquear *indefinidamente* a adequação ao afetado, por mecanismo de informação assimétrica ou promessa não verificável. As duas cláusulas respondem ao mesmo fenômeno com instrumentos diferentes porque os mecanismos de bloqueio são estruturalmente diferentes — mas derivam do mesmo diagnóstico de §6 do catálogo.

**Resultado.** ✓ — OC-1 resolve-se sem ad hoc. A pluralidade de cláusulas é justificada pela pluralidade de mecanismos de petrificação, unificados pela diagnose do catálogo.

---

## §6 — OC-2: Independência dos eixos interno/exposto (A08)

**A questão.** A08 afirma que os eixos interno (forma de representação no código) e exposto (mensagem/tipo que o afetado encontra) são "sempre independentes." Essa afirmação é muito forte? Existe caso em que os dois eixos não são independentes?

**Análise.**

A afirmação de independência é *normativa*, não descritiva. A08 não diz que os dois eixos *de fato* variam independentemente na prática — diz que os *critérios normativos* para cada eixo são independentes. Em outras palavras: o fato de que a forma interna é X não implica que a forma exposta deva ser X.

A base desta afirmação em §1.1: o afetado *somente encontra a superfície exposta*. A forma interna é, por definição, invisível ao afetado. Portanto, do ponto de vista do afetado (e de qualquer praticante com amplitude posicional que ocupa seu lado), o custo sintático interno é irrelevante — o critério normativo para a superfície exposta é definido pelo que é acionável, reconhecível e significativo para o afetado, independentemente do que está acontecendo internamente.

**Poderia haver um caso em que a forma interna necessariamente determina a forma exposta?** Apenas se a superfície exposta *fosse idêntica à implementação interna* — mas nesse caso, não há decisão de design de superfície; há apenas exposição direta da implementação, que é precisamente o que P0+ condena.

A independência de A08 não é uma afirmação empírica contestável — é uma decorrência da distinção entre decisor (que vê ambos os eixos) e afetado (que vê apenas o eixo exposto).

**Resultado.** ✓ — OC-2 resolve-se. A independência de A08 é grounded em §1.1 e na estrutura assimétrica da relação decisor/afetado.

---

## §7 — Resultado do STEP 4.2

**Nenhuma incoerência de fundo encontrada.**

| Verificação | Resultado |
|-------------|-----------|
| A10 — verificabilidade pelo afetado | ✓ — coerente com §1.1/§1.2 |
| A11 — amplitude posicional operacionalizada | ✓ — operacionalização direta de §1.2 |
| A14 — estrutura de ação verificável | ✓ — grounded em §1.1 |
| Amplitude posicional — nenhuma cláusula incompatível | ✓ — 9/9 cláusulas compatíveis |
| OC-3 — "acionável" e "estrutura de ação" | ✓ — contínuos, ambos grounded em §1.1; sem reformulação necessária |
| OC-1 — petrificação plural | ✓ — pluralidade justificada pelo catálogo §6 |
| OC-2 — independência dos eixos | ✓ — decorrência da assimetria decisor/afetado |

**Iteração 6↔4: NÃO ACIONADA.** P0 é coerente com a teoria de fundo §1.1/§1.2.

---

## §8 — Anotações para o STEP 4.3

Três anotações a serem incorporadas na arquitetura final (`09-principio-refinado-final.md`), sem disparar reformulação de P0:

**AN-1 (de OC-3).** O critério "acionável" em P0+ pressupõe a existência de uma estrutura de ação identificável para o afetado. A14 operacionaliza esse pressuposto para o caso de arbitragem entre superfícies concorrentes. A continuidade conceitual entre P0+ e Cláusula-P1 é real: A14 não introduz um conceito externo, mas especifica o critério de "acionável" para o caso comparativo. O framework de §1.1 provê o método de identificação da estrutura de ação caso a caso.

**AN-2 (de OC-1).** As Cláusulas-P2 e P3 são instrumentos procedimentais distintos para o mesmo fenômeno (petrificação), derivados do diagnóstico do catálogo §6. Sua pluralidade não é ad hoc — cada cláusula ataca o mecanismo específico de bloqueio informacional que torna a petrificação estável. Podem ser apresentadas no artigo como exemplificações de um padrão geral de "petrificação por assimetria procedural."

**AN-3 (de OC-2).** A independência normativa dos eixos interno/exposto (A08) é uma decorrência da estrutura assimétrica da relação decisor/afetado — não uma afirmação empírica sobre variação de fato. O afetado só encontra o eixo exposto; portanto, os critérios normativos para esse eixo são determinados exclusivamente pela perspectiva do afetado. Essa assimetria estrutural é o fundamento de A08 e pode ser articulada explicitamente no artigo como justificação da cláusula.

---

## Conclusão do STEP 4.2

P0 é coerente com a teoria de fundo §1.1/§1.2 em todos os pontos verificados. A iteração 6↔4 não é acionada. Três anotações (AN-1, AN-2, AN-3) passam para o STEP 4.3.

- STEP 4.3: decisão de arquitetura final → `09-principio-refinado-final.md`
