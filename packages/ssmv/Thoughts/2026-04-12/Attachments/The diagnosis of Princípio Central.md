# Diagnóstico do Princípio Central — Versão Refinada

> **Origem.** Conversa de 2026-04-12 entre o autor e um assistente no papel de filósofo analítico metodológico.
> **Insumos.** `Etapa 1 Consolidada.md`, `Plano de Execução — Etapa de Definição do Princípio.md`, `Princípio Central — Versão Refinada.md`.

---

## Log da conversa

1. **Autor** apresentou a queixa: o processo de execução e seu resultado trataram a lista de casos como exaustiva quando deveria ser representativa; o princípio e suas cláusulas ficaram específicos, descrevendo casos em vez de categorias de casos.

2. **Assistente** leu os três insumos e fez perguntas de clarificação:
   - O componente positivo (P0+) também é problemático ou só o negativo e as cláusulas?
   - O núcleo da objeção é que o princípio deveria cobrir casos futuros descrevendo o *tipo de coisa* que não conta como razão derrotadora, em vez de listar cada coisa encontrada nos 20 casos?
   - A suspeita se estende ao processo — zero iterações é sintoma de super-ajuste?

3. **Autor** respondeu:
   - O problema é no componente negativo e nas cláusulas (esses são narrow). Mas P0+ também tem uma questão: por que "significant, recognizable, and actionable" substituiu "melhor experiência de uso" sem defesa da superioridade dessa troca?
   - Sim, quer um princípio categórico e atemporal.
   - Possivelmente o processo super-ajustou, mas prefere não refazer tudo — pergunta se é defensável generalizar *depois* dos testes em vez de *antes*.

4. **Assistente** fez segunda rodada de perguntas:
   - Em P0+: a preocupação é (a) a tríade ser subconjunto, (b) ser interpretação não defendida, ou (c) ambas? → **(c) ambas.**
   - Sobre o timing: confirmou a distinção generalizar-então-testar vs. testar-então-generalizar. → **Sim, é isso.**
   - Sobre o formato: menos formulações, boas no sentido de que o leitor tendo a formulação e seu caso específico consiga conceber facilmente como ela se aplica.

5. **Autor** acrescentou um ajuste final antes de pedir o registro: o princípio pode tanto ser mais categórico quanto ter menos cláusulas operando pelo **mesmo método da formulação-semente** — conceituação de termos. Foi isso que permitiu à semente dizer "melhor possível" sem perder precisão; o mesmo método deveria ter sido carregado para o princípio final.

6. **Autor** especificou o nível de abstração desejado para as categorias do princípio: os motivos do catálogo deveriam ser organizados sob categorias do tipo que a filosofia moral e a teoria da ação já reconhecem — como *akrasia coletiva*, *externalidade decisor→afetado*, *ilusão de neutralidade técnica*, *problema de coordenação intertemporal*. Esse é o nível em que o princípio deveria operar: categorias que um leitor instruído reconhece imediatamente e consegue aplicar ao seu caso sem consultar o catálogo. De bônus, esse nível torna visível que o princípio *reconhece as causas estruturais do descumprimento*, não apenas lista comportamentos proibidos. Exemplos representativos oferecidos pelo autor (não uma taxonomia fechada):
   - **Externalidade decisor→afetado**: o decisor internaliza o custo de implementação mas externaliza o custo de interação futura.
   - **Coordenação intertemporal**: construtor atual e mantenedor futuro não são o mesmo agente; não há mecanismo que alinhe interesses.
   - **Ilusão de neutralidade técnica**: a crença de que "decisões técnicas são neutras" esconde o juízo normativo já embutido.
   - **Akrasia coletiva**: todos reconhecem o princípio mas, sob pressão, agem contra o próprio juízo considerado.

---

## Diagnóstico

### O que aconteceu

O processo cometeu o que em metodologia normativa se chama **especificação enumerativa**: tratou cada motivo do catálogo como exigindo sua própria cláusula dedicada no princípio, produzindo um mapeamento 1:1 (M01 → N1, M03 → N2, …, M08 → Cláusula-P1, etc.). O resultado é um princípio que funciona como tabela de consulta indexada por entradas do catálogo, não como norma que um leitor poderia aplicar a um caso novo.

Isso aconteceu porque nenhum passo do plano de execução exigiu **abstração antes da formulação**. O Step 2 diz "distribuir os alvos restantes em cláusulas" — um exercício de distribuição, não de generalização. Não há momento em que o processo pergunte: *o que M01, M03, M04, M06, M10 e M11 têm em comum tal que uma única formulação cubra todos eles e qualquer caso futuro do mesmo tipo?*

A restrição rawlsiana R-09 (GENERALIDADE) foi satisfeita apenas superficialmente. O princípio evita nomear linguagens ou ferramentas específicas — mas ainda nomeia *tipos específicos* de conveniência do decisor (defaults de tooling, encapsulamento nominal, fluxo de controle como "natural", etc.) em vez de caracterizar a propriedade geral que torna *qualquer* fator desse tipo uma não-razão-derrotadora. Generalidade no sentido de Rawls exige formulação em termos de propriedades gerais, não uma lista finita de tipos específicos.

O mesmo vale para as cláusulas. Cada uma está amarrada a um motivo ou alvo específico (Cláusula-P2 → M09/M12, Cláusula-P3 → M13, Cláusula-P4 → M14). Um leitor que encontre uma situação ausente do catálogo não tem como determinar qual cláusula se aplica sem antes classificar sua situação na taxonomia do catálogo — o que derrota o propósito de um princípio.

### O que aconteceu com P0+

A Etapa 1 construiu cuidadosamente "melhor experiência de interação possível" com uma decomposição explícita:

- **"Possível"** = alternativas não excluídas por fatores fora do controle do decisor (§6.8).
- **"Melhor"** = superlativo comparativo dentro desse espaço, ao longo de múltiplas dimensões: capacidade, compreensibilidade, esforço, previsibilidade, feedback, consistência, relevância (§6.7).
- **Critério de violação** = alternativa factível superior preterida por fator controlável pelo decisor (§6.8).

O princípio substituiu silenciosamente esse standard pela tríade "significativo, reconhecível e acionável", que:

**(a)** pode não cobrir todas as dimensões de §6.7 — onde estão previsibilidade? feedback? redução de esforço? consistência?

**(b)** nunca foi defendida como operacionalização equivalente ou superior à formulação-semente.

A tríade parece indutivamente extraída do que os 20 casos estressaram, em vez de deduzida do framework normativo que a Etapa 1 estabeleceu.

### O método perdido

A observação decisiva do autor é que o problema não é apenas de nível de generalidade — é de **método**. A formulação-semente consegue dizer "melhor possível" com total precisão porque opera pelo método de **conceituação de termos**: cada palavra da semente está sustentada por uma definição cuidadosa (§6.1–§6.8). A precisão não vem da formulação ser verbosa ou listar casos; vem da **infraestrutura conceitual** que sustenta cada termo.

O plano de execução abandonou esse método. Em vez de definir conceitos no nível correto de generalidade e depois usá-los em formulações compactas — como a semente fez —, o processo distribuiu os casos em cláusulas dedicadas e deixou cada cláusula carregar sua própria especificidade. A precisão passou a vir da **enumeração**, não da **conceituação**.

Isso significa que a correção não é simplesmente "colapsar N1–N6 numa frase genérica". É **retomar o método da semente**:

1. Identificar os conceitos que operam no componente negativo e nas cláusulas no nível correto de generalidade.
2. Defini-los com o mesmo rigor com que §6.1–§6.8 definiram os conceitos da semente.
3. Formular o componente negativo e as cláusulas usando esses conceitos — de modo compacto, como a semente.
4. Deixar as definições conceituais fazerem o trabalho de precisão, não a enumeração de motivos.

O resultado: o princípio teria menos cláusulas, cada uma formulada em termos gerais mas precisos, e os motivos específicos do catálogo (M01, M03, etc.) se tornariam **instâncias ilustrativas** que ajudam o leitor a ver como o conceito se manifesta em situações concretas — não a definição da cláusula em si.

### O nível de abstração correto

O autor especificou qual é o nível de generalidade que as categorias do princípio deveriam atingir: o nível em que a filosofia moral e a teoria da ação já possuem vocabulário reconhecível — *externalidades*, *akrasia*, *coordenação intertemporal*, *ilusão de neutralidade*. Esse não é um nível inventado ad hoc para este princípio; são categorias que qualquer leitor instruído reconhece e consegue aplicar ao seu próprio caso sem consultar o catálogo de origem.

Esse nível traz dois ganhos simultâneos:

1. **Aplicabilidade imediata.** O leitor que encontra um caso novo não precisa classificá-lo na taxonomia M01–M14; precisa apenas reconhecer qual dinâmica estrutural está operando — "aqui o decisor externaliza o custo para o afetado", "aqui há akrasia coletiva sob pressão de prazo" — e o princípio já lhe diz o que exige.

2. **Diagnóstico visível.** O princípio passa a *reconhecer as causas estruturais do descumprimento*, não apenas listar comportamentos proibidos. Isso o torna mais forte normativamente: ele não diz apenas "isso não conta como razão derrotadora"; diz *por que* praticantes que concordam com ele acabam não o seguindo, e ao nomear a dinâmica, desarma a racionalização antes que ela se forme.

Exemplos representativos desse nível — oferecidos como ilustração do tipo de categoria, não como taxonomia fechada a ser adotada sem exame:

- **Externalidade decisor→afetado**: o decisor internaliza o custo de implementação mas externaliza o custo de interação futura para usuários ou devs downstream. Clássico *moral hazard* em artefatos.
- **Coordenação intertemporal**: construtor atual e mantenedor futuro não são o mesmo agente; não há mecanismo de preço ou contrato que alinhe interesses.
- **Ilusão de neutralidade técnica**: a crença (falsa) de que "decisões técnicas são neutras" esconde o juízo normativo já embutido na escolha.
- **Akrasia coletiva**: todos reconhecem o princípio mas, sob pressão de prazo ou escassez, agem contra o próprio juízo considerado.

Esses exemplos são representativos, não exaustivos. O trabalho de conceituação que a reformulação exige é justamente identificar quais categorias desse tipo são necessárias e suficientes para organizar o espaço dos motivos — sem pressupor que estas quatro sejam a lista final. O erro a evitar é o mesmo que causou o problema original: tratar uma lista representativa como se fosse exaustiva.

---

## O que o resultado esperado parece

**P0+ (componente positivo):** Deveria preservar o standard normativo da formulação-semente ("melhor experiência de interação possível" com a decomposição de §6.8), ou argumentar explicitamente por que uma operacionalização diferente é superior — mostrando que cobre o mesmo terreno sem perda. Se a tríade "significativo, reconhecível, acionável" for mantida, precisa ser defendida como equivalente, e as dimensões omitidas (previsibilidade, feedback, esforço, consistência) precisam ser demonstravelmente cobertas ou explicitamente bracketed com justificação.

**P0− (componente negativo):** Em vez de seis razões-não-derrotadoras específicas, deveria identificar a **propriedade geral** que torna um fator não-derrotador, sustentada por definição conceitual precisa. Os atuais N1–N6 compartilham algo: são todos fatores cuja força normativa deriva da relação do decisor com a implementação, não da relação do afetado com a superfície. Uma formulação categórica enunciaria *isso* — e os motivos específicos (M01, M03, M04, M06, M10, M11) se tornariam instâncias ilustrativas. As categorias usadas para organizar os motivos devem operar no nível em que a filosofia moral e a teoria da ação já possuem vocabulário reconhecível — externalidades, akrasia, ilusão de neutralidade, coordenação intertemporal — de modo que o leitor reconheça a dinâmica estrutural em jogo e consiga aplicá-la ao seu caso sem consultar o catálogo. O princípio ganha com isso um segundo papel: além de enunciar o que não conta como razão derrotadora, ele *diagnostica por que* praticantes que concordam com ele acabam descumprindo-o.

**Cláusulas:** Deveriam ser formuladas no nível em que um leitor com um caso novo possa determinar qual cláusula se aplica reconhecendo um *tipo de situação* — definido conceitualmente — em vez de precisar mapear seu caso para um dos 20 do catálogo. O número de cláusulas seria menor; a precisão viria das definições conceituais que as sustentam. As cláusulas que hoje são procedimentais (P2, P3, P4) podem convergir se o conceito subjacente for definido no nível correto — por exemplo, se todas instanciam variantes do mesmo problema de assimetria informacional ou temporal entre decisor e afetado.

**Teste de qualidade:** Um praticante encontrando um caso *ausente do catálogo* deveria ser capaz de ler o princípio e determinar, sem orientação adicional: (1) se o princípio se aplica, (2) qual componente ou cláusula governa, e (3) o que o princípio exige.

---

## A questão metodológica: testar-então-generalizar

Esse caminho é defensável — com uma condição.

**O argumento central:** Se P0 cobre cada caso C1–C20, e P0' é uma generalização de P0 tal que toda instância de P0 é também instância de P0', então P0' cobre C1–C20 *a fortiori*. Generalização é **monotônica para cobertura**: uma formulação mais geral não pode perder casos que uma mais específica já cobria.

Mas generalização **não é monotônica para precisão**. P0' pode agora *também* condenar casos que P0 corretamente preservou — os casos R3 (C09, C11, C13, C17, C19) e os casos novos da rodada 5.3, onde o princípio precisa *não* condenar ou produzir resultados nuançados. Esse é o risco de super-inclusão.

**O procedimento:**

1. Reformular P0 → P0' no nível categórico (positivo, negativo e cláusulas), usando o método de conceituação de termos.
2. **Pular** a re-execução dos testes de cobertura (rodadas 5.1 e 5.2-R2) — passam por monotonicidade.
3. **Re-executar apenas os testes de precisão**: os casos R3 (rodada 5.2) e os casos novos (rodada 5.3), verificando que P0' não sobre-condena.
4. Se P0' passa na precisão, é reformulação legítima.
5. Se P0' falha na precisão, a generalização foi ampla demais num ponto específico — estreitar aquele ponto, não o princípio inteiro.

**Por que é defensável:** O equilíbrio reflexivo amplo não se importa com o *caminho* até o princípio final — se importa com o *estado final*: se o princípio está em equilíbrio com os juízos considerados e as teorias de fundo. Se a generalização foi feita antes ou depois dos testes é metodologicamente irrelevante, desde que o princípio final passe tanto em cobertura quanto em precisão.

**A condição:** A generalização deve ser **conservadora** — o mínimo salto de nível-de-caso para nível-de-categoria que alcance generalidade genuína sem expandir o escopo do princípio além do que os casos e a teoria de fundo (§1.1 do catálogo) justificam. E deve operar pelo mesmo método que tornou a semente precisa: conceituação de termos, não invenção de novas categorias ad hoc.

---

## Exclusões

Este diagnóstico **não faz**:

- Reformulação do princípio — pertence a etapa posterior.
- Revisão do catálogo ou das restrições formais — são insumos, não alvos.
- Juízo sobre o conteúdo substantivo da tese — o diagnóstico é metodológico.
