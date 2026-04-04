# UseDD - Base Consolidada para Análise Normativa

## Finalidade

Este documento consolida, em versão final, o material relevante para uma futura Análise Normativa em Filosofia Analítica em defesa de UseDD. O foco é só o que ajuda a:

- identificar o problema normativo;
- formular o explanandum;
- fixar a tese de UseDD;
- explicitar premissas, escopo, distinções e objeções centrais.

---

## Delimitação da análise

### Tipo de questão

A questão central é de primeira ordem normativa aplicada ao design de software:

> quando há conflito entre conveniência da implementação e atendimento ao humano que usa, qual lado deve ter autoridade sobre a forma do sistema?

Ela usa análise conceitual auxiliar, mas não é primariamente metaética.

### Explanandum a ser explicado/justificado

O alvo não é "software ruim" em geral. O alvo é este fenômeno:

> no desenvolvimento de software, decisões técnicas frequentemente passam a constranger o que humanos podem fazer, entender ou manter; na prática, o humano adapta-se ao sistema mais do que o sistema ao humano.

O fenômeno inclui tanto UX quanto DX, porque o desenvolvedor também é humano na cadeia de uso.

### Escopo

A análise é sobre relações de autoridade no design de software, do nível produto ao nível interno do código.

### Fora de escopo

- Metaética geral.
- História causal de TDD, API-first, DIP etc.
- Teoria de gestão ou governança entre stakeholders em geral.
- Prova empírica exaustiva sobre frequência do fenômeno.
- Julgamento de qualquer stack, linguagem ou arquitetura específica.

---

## Explanandum consolidado

### Fenômeno primário

Em software, escolhas técnicas moldam possibilidades, custos cognitivos e condições de inteligibilidade para humanos que interagem com o artefato. Esses efeitos costumam aparecer depois da decisão, com feedback fraco, e recaem mais sobre quem usa do que sobre quem decidiu.

### Traços recorrentes

- A adaptação do humano ao sistema é frequente e muitas vezes silenciosa.
- Quem decide costuma estar menos exposto às consequências do que quem as sofre.
- O construtor futuro pode sofrer o efeito das decisões do construtor presente.
- O efeito pode emergir sem culpado individual, por acúmulo de decisões localmente razoáveis.
- A experiência humana muitas vezes nem entra no campo de consideração da decisão técnica.

### Modulações importantes

- O fenômeno é menos agudo quando quem programa também possui competência ampla de design.
- É mais agudo quando quem programa não possui repertório para antecipar experiência humana.
- Em times, a tensão oscila conforme a autoridade prática pende para design/produto ou para implementação.
- A separação histórica entre papéis pode ter mitigado conflitos locais, mas também consolidado a mentalidade de que design "é trabalho de outra pessoa", inclusive em devs solo.
- Há manifestação recente de delegação sem aquisição: usar IA ou processo de engenharia como substituto de competência de design.
- A preocupação explícita com DX é tardia, o que sugere que o mesmo fenômeno incidia sobre o desenvolvedor muito antes de ser nomeado.
- Existe presunção recorrente de que mitigar essa tensão exige escala e recursos de empresa grande.

### Hesitações práticas que a teoria precisará enfrentar

- complexidade inerente vs. complexidade imposta;
- restrição legítima vs. racionalização posterior;
- mesmo fenômeno em UX e DX vs. fenômenos distintos;
- pessoa vs. estrutura;
- processo vs. cultura;
- atenção vs. recurso;
- delegação vs. aquisição de competência.

---

## Núcleo normativo mínimo já pressuposto

O material converge nestes compromissos, que precisam ser assumidos ou defendidos:

- experiência humana é critério normativamente relevante em decisões técnicas;
- impor ônus humanos evitáveis ou opacos conta contra a decisão que os produz;
- transferir custo do decisor para o afetado exige justificação;
- visibilidade entre decisão e consequência é um bem normativo;
- competência para antecipar experiência humana é virtude profissional relevante;
- processo, ferramenta ou IA não substituem automaticamente essa competência;
- restrições reais têm peso, mas não autoridade própria.

Sem esses compromissos, o fenômeno vira mecânica neutra, não problema normativo.

---

## Formulação consolidada de UseDD

### Tese central

UseDD sustenta que toda decisão de design em software deve traçar sua autoridade de volta a um humano. Quando isso não ocorre, o sistema está sendo moldado por si mesmo, pela implementação ou por seus constrangimentos locais.

### Premissa fundacional

**P0:** software é um artefato cuja razão de existir é servir um humano.

Essa premissa é tratada como analítica: sem humano a servir, não há software no sentido relevante para o princípio.

### Princípio raiz

> quem usa define a forma do que é usado, e essa forma precede a implementação.

As duas inversões rejeitadas são:

- direção invertida: a implementação passa a definir o uso;
- sequência invertida: a "spec" vira documentação posterior do que foi construído.

### Estrutura conceitual final

- **Entidade**: qualquer participante de uma relação de uso, em qualquer granularidade.
- **Porta**: contrato que define como uma entidade é usada.
- **Decisor**: entidade que define a porta.
- **Executor**: entidade que satisfaz a porta.
- **Uso**: relação decisor → executor.
- **Usuário**: termo reservado ao humano.
- **Cadeia de autoridade**: sequência de relações de uso que remonta ao humano.
- **Infraestrutura**: o que não pertence à cadeia do produto; suas portas são definidas diretamente pelo humano desenvolvedor.

### Eixos do princípio

**Direção:** quem pensa, usa; quem executa, não define.

**Sequência:** a porta vem antes da implementação e a constrange.

### Consequências finais

- cada par tem um decisor único;
- misturar decisão e execução produz ambiguidade de autoridade;
- a regra vale em todas as granularidades;
- o vocabulário da porta é determinado por quem precisa confirmar sua satisfação;
- a porta é o critério de correção da implementação;
- se a implementação diverge, volta-se à porta; não se concede autoridade ao código;
- a cadeia é finita e acíclica;
- toda autoridade deve remontar ao humano;
- o humano é o critério último de correção.

### Natureza de P1

A assimetria por par não é descoberta empírica; é axioma de modelagem. UseDD escolhe tratar relações de uso como assimétricas e resolver aparente simetria por decomposição.

---

## Os dois humanos

Os humanos que usam diretamente o sistema são exatamente dois:

- **usuário do produto**: interage em runtime;
- **desenvolvedor**: interage em build-time.

Não há hierarquia de valor entre eles. Há prioridade de sequência:

1. primeiro a porta do usuário do produto;
2. depois a porta do desenvolvedor;
3. depois as demais portas internas.

Papéis como PM funcionam como mediação ou proxy, não como nova raiz de autoridade.

---

## Fronteira com infraestrutura

Nem tudo no codebase pertence à cadeia de autoridade do produto.

Utils/helpers transversais e APIs externas contam como infraestrutura quando sua forma não é ditada por uma entidade específica do produto. Nesse caso, sua porta é definida diretamente pelo humano desenvolvedor.

Critério prático:

- se a forma só faz sentido no contexto de uma entidade específica do produto, está na cadeia;
- se faz sentido independentemente dela, é infraestrutura.

---

## Prática implicada por UseDD

UseDD deixou de ser só meta-princípio porque incorpora uma prática mínima de especificação:

1. definir a porta do usuário do produto em vocabulário de comportamento observável;
2. identificar a entidade que espelha essa porta nas regras do sistema;
3. definir a porta do desenvolvedor para essa entidade;
4. implementar usando essas portas como autoridade;
5. aplicar a mesma lógica às entidades seguintes da cadeia;
6. usar TDD como prática compatível de execução, não como fundamento de UseDD.

As portas não são documentação posterior. Elas precedem, constrangem e continuam válidas depois da implementação porque a implementação deve satisfazê-las.

---

## Relação com práticas existentes

UseDD não explica historicamente por que TDD, API-first ou DIP existem.

A relação correta é:

- compartilha superfície com elas na dimensão do desenvolvedor;
- não se reduz a elas;
- pode avaliá-las.

Uma prática pode parecer formalmente correta e ainda violar UseDD se a autoridade real estiver do lado da implementação.

Diferença distintiva de UseDD:

> a cadeia de autoridade é contínua do usuário final ao código, sem romper no desenvolvedor e sem entregar a autoridade final à implementação.

---

## Objeções centrais e respostas consolidadas

### "Isso é só TDD/API-first/DIP"

Não. Essas práticas podem existir com autoridade invertida. UseDD pergunta de onde vem a autoridade da forma.

### "Restrições reais tornam o princípio impraticável"

Restrições são insumo da decisão, não autoridade. A pergunta correta não é "o que cabe implementar?", mas "dadas as restrições, qual é a melhor forma ainda disponível de servir o humano?".

### "O princípio vale para UX, não para internals"

Também vale para internals, porque sempre há um humano do lado que usa, inclusive o desenvolvedor futuro.

### "Mitigar isso exige empresa grande"

Grandes empresas têm mais recursos, mas parte relevante do problema parece depender de enquadramento e atenção, não apenas de escala.

### "Separar design de engenharia resolve"

Pode aliviar conflitos locais, mas também pode consolidar a ideia de que experiência humana não é parte do trabalho do desenvolvedor.

### "IA ou processo já suprem design"

IA e processo podem ajudar, mas não substituem o critério humano capaz de julgar se a solução realmente serve quem usa.

---

## Formulação do problema normativo para a análise futura

Versão curta:

> é justificável que, em software, a implementação ou seus constrangimentos locais adquiram autoridade sobre a forma do sistema em lugar do humano que o usa?

Versão já orientada por UseDD:

> decisões de design em software devem ser estruturadas de modo que a autoridade sobre a forma de cada entidade permaneça com quem a usa e remonte, em última instância, ao humano?

### O que a futura análise terá de defender

- que P0 é aceitável;
- que a autoridade deve seguir a relação de uso, não conveniência técnica;
- que restrições não autorizam inverter a cadeia;
- que UX e DX pertencem ao mesmo campo normativo relevante;
- que a porta, e não a implementação, é o critério de correção;
- que isso continua válido em todas as granularidades relevantes.

### O que contaria contra a tese

- mostrar que a forma definida pela implementação serve tão bem ou melhor ao humano de modo não acidental;
- mostrar que a cadeia de autoridade não pode, nem mesmo em princípio, ser rastreada ao humano;
- mostrar que UX e DX não compartilham estrutura normativa suficiente para o princípio unificá-las;
- mostrar que restrições técnicas têm autoridade própria, e não apenas peso deliberativo.

---

## Síntese final

O material converge para um quadro simples:

1. Há um fenômeno recorrente de inversão ou obscurecimento de autoridade no design de software.
2. Esse fenômeno afeta tanto quem usa o produto quanto quem usa o código.
3. UseDD responde afirmando que a forma deve ser ditada por quem usa, antes da implementação.
4. A autoridade deve compor uma cadeia contínua até o humano.
5. Restrições podem limitar soluções, mas não substituir o humano como critério último.

Se a análise normativa futura conseguir justificar esse quadro, terá defendido o núcleo de UseDD.
