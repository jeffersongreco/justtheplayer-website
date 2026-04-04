# Etapa 1 - Identificação e Delimitação do Problema Normativo

## 1. Questão bruta

No desenvolvimento de software, é recorrente que a forma do sistema acabe sendo ditada pelo que é mais conveniente para implementar, integrar, testar ou manter localmente. O resultado é familiar: o usuário do produto adapta seu comportamento ao sistema, e o desenvolvedor adapta seu trabalho ao codebase, com frequência maior do que o sistema se adapta a eles.

Em linguagem ordinária, isso costuma aparecer como "software ruim", "UX ruim", "DX ruim", "dívida técnica", "falta de design", "o legado não deixa" ou "era o que dava para fazer". O problema dessas formulações é que elas misturam, sem distinguir, descrição de fenômeno, juízo de valor, hipótese causal e proposta de solução.

Se a questão permanecer nesse estado bruto, o alvo se move o tempo todo. Ora parece ser um problema de qualidade de produto, ora de arquitetura, ora de processo, ora de cultura, ora de competência individual, ora de escassez de recursos. Antes de defender qualquer princípio, é preciso fixar exatamente qual dessas coisas está em disputa.

## 2. Por que a questão é filosoficamente problemática

A dificuldade central é que a pergunta ordinária embute várias perguntas diferentes.

Primeiro, ela mistura um problema descritivo com um problema normativo. Uma coisa é dizer que decisões técnicas frequentemente constrangem humanos e que o feedback costuma ser fraco ou tardio. Outra é dizer que isso conta contra a decisão e exige justificação.

Segundo, ela mistura níveis distintos de análise. Há pelo menos um nível conceitual, sobre o que conta como "uso", "forma", "autoridade", "restrição" e "implementação"; um nível empírico, sobre frequência, visibilidade e evitabilidade do fenômeno; e um nível normativo, sobre quem deve ter precedência quando há conflito.

Terceiro, ela mistura domínios que podem ou não pertencer ao mesmo campo normativo. O caso do usuário do produto parece, à primeira vista, diferente do caso do desenvolvedor que usa o código. Se isso não for explicitado, a análise ora falará de UX, ora de DX, sem mostrar por que ambos deveriam ser tratados sob o mesmo princípio.

Quarto, ela deixa indeterminado o papel das restrições reais. Tempo, custo, legados, ferramentas, plataformas e limites cognitivos existem. A questão não é se existem, mas se sua existência basta para lhes conceder autoridade sobre a forma do sistema. Sem essa distinção, a análise colapsa em fatalismo técnico ou em voluntarismo moral.

## 3. Tipo de questão

Esta é uma questão de primeira ordem normativa aplicada ao design de software. Ela pergunta qual lado deve ter autoridade sobre a forma do sistema quando há conflito entre conveniência de implementação e atendimento ao humano que usa.

Ela não é primariamente metaética. A análise pode recorrer a esclarecimentos conceituais auxiliares, mas não pretende resolver aqui questões gerais sobre a natureza dos fatos normativos ou o significado último de termos morais.

Também não é uma investigação empírica exaustiva. Ela depende de um fenômeno reconhecível por praticantes competentes, mas não exige, nesta etapa, demonstração estatística abrangente de sua frequência.

## 4. Mapa da questão composta

A questão bruta contém pelo menos cinco subquestões:

1. Uma subquestão conceitual: o que contam, neste contexto, como "humano que usa", "forma", "autoridade", "porta", "implementação" e "restrição"?
2. Uma subquestão empírica: com que frequência a adaptação ocorre do humano para o sistema, em que condições ela fica invisível e como fatores como competência, feedback, estrutura organizacional e escala a modulam?
3. Uma subquestão de escopo: o problema vale apenas para a interface do produto ou também para internals, APIs e código usado por desenvolvedores?
4. Uma subquestão de unificação: UX e DX pertencem ao mesmo campo normativo relevante ou são fenômenos apenas analogamente parecidos?
5. Uma subquestão propriamente normativa: quando implementação e humano entram em tensão, quem deve ter autoridade sobre a forma?

Esta análise tratará a quinta como questão central. As demais entram apenas na medida em que forem necessárias para estabilizar o alvo da pergunta principal.

## 5. Reformulação precisa da questão

Formulação curta:

> É justificável que, em software, a implementação ou seus constrangimentos locais adquiram autoridade sobre a forma do sistema em lugar do humano que o usa?

Formulação mais técnica, já orientada ao debate que virá:

> Decisões de design em software devem ser estruturadas de modo que a autoridade sobre a forma de cada entidade permaneça com quem a usa e remonte, em última instância, ao humano?

A primeira frase fixa o problema. A segunda antecipa a forma provável da tese, mas ainda não a assume como verdadeira.

## 6. Explanandum

O explanandum desta análise é o seguinte:

> No desenvolvimento de software, decisões técnicas frequentemente passam a constranger o que humanos podem fazer, entender ou manter; na prática, o humano adapta-se ao sistema mais do que o sistema ao humano.

Esse fenômeno inclui dois casos diretamente relevantes:

- o usuário do produto, que sofre ou se beneficia da forma do sistema em runtime;
- o desenvolvedor, que sofre ou se beneficia da forma do código em build-time.

O alvo, portanto, não é "software ruim" em geral. O alvo é um padrão recorrente de inversão, obscurecimento ou deslocamento de autoridade na definição da forma.

## 7. Delimitação substantiva

Para evitar que a tese mude de alvo, a análise fará quatro recortes explícitos.

Primeiro, concede-se desde o início que restrições técnicas, econômicas e temporais são reais. O ponto em disputa não é sua existência, mas seu estatuto normativo. Elas podem ter peso deliberativo sem por isso se tornarem a origem legítima da forma.

Segundo, a análise trata de relações de autoridade no design de software, do nível de produto ao nível interno do código. Não está limitada a UX superficial nem reduzida a arquitetura interna isolada da experiência humana.

Terceiro, a análise pressupõe apenas o mínimo necessário para se mover: que experiência humana é normativamente relevante na avaliação de decisões técnicas e que transferir custo do decisor para o afetado exige algum tipo de justificação. A defesa completa desses compromissos pertence a etapas posteriores.

Quarto, o problema não será formulado como disputa psicológica entre intenções individuais boas ou ruins. O fenômeno pode emergir por acúmulo de decisões localmente razoáveis, sem culpado individual, e ainda assim permanecer um problema normativo.

## 8. O que fica bracketed

Ficam fora de escopo nesta etapa:

- metaética geral;
- história causal de TDD, API-first, DIP ou práticas afins;
- prova empírica exaustiva da frequência do fenômeno;
- teoria geral de governança entre stakeholders;
- avaliação de stacks, linguagens ou arquiteturas específicas;
- imputação de culpa moral individual a times ou desenvolvedores.

Também fica bracketed, por ora, o debate completo sobre se UX e DX são estritamente o mesmo fenômeno. Nesta etapa, basta fixar que ambos pertencem ao campo de preocupação da análise e que a tese futura terá de justificar essa unificação, se quiser mantê-la.

## 9. O que a análise futura terá de defender

Se esta formulação do problema estiver correta, a análise normativa posterior terá de defender pelo menos o seguinte:

1. que software, enquanto artefato, remete normativamente ao humano que serve;
2. que a autoridade sobre a forma deve seguir a relação de uso, e não a conveniência local da implementação;
3. que restrições reais limitam soluções, mas não adquirem autoridade própria por esse fato;
4. que o caso do usuário do produto e o do desenvolvedor podem ser tratados sob um mesmo campo normativo relevante;
5. que a implementação deve ser corrigida pela porta, e não a porta absorvida silenciosamente pela implementação.

## 10. Condições de refutação

Esta etapa só está bem delimitada se for possível dizer o que contaria contra a tese. Contariam contra ela, por exemplo:

1. mostrar que a forma definida pela implementação serve tão bem quanto, ou melhor do que, a forma definida pelo uso, de modo não acidental e normativamente suficiente;
2. mostrar que a autoridade sobre a forma não pode ser rastreada ao humano nem mesmo em princípio;
3. mostrar que UX e DX não compartilham estrutura normativa suficiente para serem tratados conjuntamente;
4. mostrar que restrições técnicas possuem autoridade própria, e não apenas peso dentro da deliberação humana;
5. mostrar que a distinção entre decisor e executor é conceitualmente inadequada para o domínio que a tese pretende cobrir.

Se nenhum cenário desse tipo puder sequer ser descrito, a tese ainda não estará filosoficamente delimitada.

## 11. Resultado da etapa

O problema normativo, agora delimitado, não é se software pode ter defeitos, nem se restrições existem, nem se práticas atuais às vezes funcionam. O problema é este:

> quando a forma do sistema precisa ser fixada sob restrições reais, é justificável que a autoridade passe da relação de uso para a implementação, ou a forma deve continuar subordinada ao humano que usa, direta ou indiretamente, em toda a cadeia?

As etapas seguintes podem avançar a partir daqui sem trocar de alvo: primeiro, decompor o explanandum e seus pressupostos; depois, avaliar se UseDD oferece a melhor resposta normativa para esse problema.
