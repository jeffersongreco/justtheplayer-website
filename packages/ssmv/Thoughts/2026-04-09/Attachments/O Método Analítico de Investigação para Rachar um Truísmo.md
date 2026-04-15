## O Método Analítico de Investigação para Rachar um Truísmo

### O que é um truísmo filosoficamente

Um truísmo não é uma verdade trivial — é uma proposição que goza de **assentimento universal sem que seus comprometimentos sejam examinados**. O trabalho filosófico não é provar o truísmo (todos já concordam) nem refutá-lo (ninguém vai discordar da superfície). É **revelar a estrutura normativa que ele pressupõe** — e então mostrar onde essa estrutura entra em tensão com outros comprometimentos que as mesmas pessoas também têm.

No seu caso: *"software deve ser feito para o humano que o usa"* é o truísmo. Ninguém discorda. O problema filosófico é que as mesmas pessoas que assentem a isso regularmente fazem ou justificam o oposto. Isso não é hipocrisia — é sinal de que há **comprometimentos normativos conflitantes operando simultaneamente**, e que o truísmo ainda não foi suficientemente articulado para resolver a tensão.

---

## A Ordem de Investigação (não de escrita)

### Fase 1 — Elicitação de Julgamentos Não-Teóricos

O ponto de partida não é um caso construído pelo pesquisador. É a **coleta de julgamentos espontâneos** que praticantes competentes do domínio fazem sobre situações concretas.

O método é perguntar sobre situações específicas, não sobre princípios. Nunca: *"você acha que UX deveria ser prioridade?"* — isso acessa o truísmo diretamente e obtém o assentimento vazio. Sempre: *"nessa situação concreta, o que foi feito estava certo?"*

O que se coleta são **pares de julgamento**:
- Situações em que o praticante diz *"isso estava errado, não havia desculpa"*
- Situações em que o mesmo praticante diz *"isso era o que dava para fazer"* ou *"era inevitável"* ou *"o contexto não permitia outra coisa"*

O pesquisador não julga ainda. Registra os dois tipos sem hierarquizá-los.

---

### Fase 2 — Busca do Limiar (*Threshold Probing*)

Esta é a fase central para o seu objetivo específico. O método é **variar sistematicamente as condições de uma situação concreta até que o julgamento do praticante mude** — do tom *"não havia desculpa"* para o tom *"era o que dava para fazer"*.

O momento em que o julgamento muda é o limiar. Esse limiar não é um fato psicológico sobre o praticante — é um **dado filosófico sobre quais fatores ele trata como normativamente relevantes**, mesmo sem saber articulá-los como princípio.

A variação não é aleatória. Segue uma lógica de **isolamento de variáveis**:

```
Situação base: [caso concreto de software com UX/DX ruim]
Variação 1: mesmo resultado, mas o time tinha mais tempo
            → o julgamento muda?
Variação 2: mesmo resultado, mas o time não tinha mais tempo
            mas havia uma alternativa técnica não explorada
            → o julgamento muda?
Variação 3: a alternativa técnica existia mas exigiria
            refatorar código de outra equipe
            → o julgamento muda?
Variação 4: a refatoração foi proposta e vetada por gestão
            → o julgamento muda?
```

Cada ponto em que o julgamento muda revela um fator que o praticante está tratando como **condição de derrota** da obrigação normativa. A coleção desses fatores é o material bruto da análise.

---

### Fase 3 — Diagnóstico das Condições de Derrota

O pesquisador examina os limiares coletados na Fase 2 e pergunta: **o que os fatores que derrotam a obrigação têm em comum?**

Hipóteses típicas neste estágio:
- São sempre fatores de **agência** (alguém vetou, alguém não decidiu)?
- São sempre fatores de **visibilidade** (o custo era opaco, o afetado não era conhecido)?
- São sempre fatores de **atribuição** (a responsabilidade estava difusa entre equipes)?
- São sempre fatores de **temporalidade** (a decisão foi tomada antes de o problema ser visível)?

O que o pesquisador está procurando é se as condições de derrota são **genuinamente normativas** (isto é, realmente alteram a obrigação) ou se são **racionalizações post-hoc** de uma obrigação que permanece intacta.

Essa distinção é o núcleo filosófico do problema. Se as condições de derrota são genuínas, o truísmo precisa ser qualificado. Se são racionalizações, o truísmo é mais forte do que parece — e o que está em jogo é explicar por que ele é sistematicamente violado apesar de permanecer válido.

---

### Fase 4 — Construção do Conflito de Comprometimentos

Com os limiares mapeados, o pesquisador constrói os **pares de comprometimento em tensão**. A estrutura não é "intuição A vs. intuição B" sobre casos diferentes — é o mesmo agente sustentando simultaneamente:

```
Comprometimento 1: "software deve ser feito para o humano que o usa"
                   [assentimento ao truísmo]

Comprometimento 2: "quando [condição X], era o que dava para fazer"
                   [assentimento à condição de derrota]

Tensão: C1 e C2 só são compatíveis se existir um princípio P que
        especifique quando X genuinamente derrota a obrigação de C1.
        Mas P não está articulado. Na ausência de P, C2 pode ser
        invocado para qualquer X, esvaziando C1.
```

Este é o ponto em que o truísmo racha: não porque alguém o negou, mas porque **o mesmo agente que o afirma também afirma comprometimentos que, sem articulação adicional, o esvaziam**.

---

### Fase 5 — Teste de Universalidade dos Candidatos a Princípio

O pesquisador formula hipóteses de princípios que poderiam resolver a tensão — especificando quando X genuinamente derrota a obrigação — e então testa se esses princípios são **aplicados uniformemente** pelo praticante.

O teste crítico: o praticante aplica o mesmo critério quando está do lado do **decisor** e quando está do lado do **afetado**?

Se um desenvolvedor diz *"o prazo justifica a API ruim"* quando é o responsável pela API, mas diz *"não tem desculpa"* quando é o consumidor dela, o critério não é normativo — é posicional. Isso é um dado filosófico importante: revela que a condição de derrota invocada não é genuinamente reconhecida como tal pelo praticante, apenas usada convenientemente.

---

### O que este método produz

Ao final das cinco fases, o pesquisador tem:

1. **Os limiares empíricos** — onde o julgamento muda e por quê
2. **Os candidatos a condição de derrota genuína** — fatores que o praticante aplica consistentemente independentemente de posição
3. **Os candidatos a racionalização** — fatores que o praticante aplica apenas quando é o decisor
4. **A estrutura do conflito de comprometimentos** — o par C1/C2 e a ausência do princípio P que os reconciliaria
5. **O diagnóstico do truísmo** — ele não racha porque é falso, mas porque não está articulado o suficiente para resistir às racionalizações que operam no mesmo espaço normativo
