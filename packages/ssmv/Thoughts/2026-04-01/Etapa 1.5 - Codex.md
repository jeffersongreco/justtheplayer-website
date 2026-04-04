# Etapa 1.5 - Clarificação Conceitual

## 0. Log de revisão

Esta versão substitui uma versão anterior em que:

- os termos `superfícies de uso`, `comportamento`, `runtime` e `build-time` apareciam sem estabilização conceitual própria em `3.2. Software`;
- a seção `4. Quem conta como humano relevante` introduzia `usuário do produto` e `desenvolvedor` antes de fazê-los emergir da definição geral;
- havia uma subseção autônoma para `4.3. Mediadores e proxies`, quando esse ponto deveria aparecer apenas como consequência derivada da definição de humano relevante.

Solicitação de correção recebida:

```text
* "3.2. Software" demanda estabilização de: superfícies de uso, comportamento, runtime e build-time.
* "4. Quem conta como humano relevante" deve ser uma definição da qual emerge que "usuário do produto" e "desenvolvedor"
são os que se enquadram nela, em vez de apresentar esses dois como escolhas arbitrárias e, assim, acabando com a
necessidade de definir "4.3. Mediadores e proxies" e tornando "4.4. Humanos fora do foco normativo imediato" apenas
didático.
* Atualize o restante do documento à luz dessas duas alterações.

Escreva no documento um log documentando que exisitia uma versão anterior com "tal coisa" e o texto exato da minha
solicitação de correção.
```

Solicitação de correção adicional recebida:

```text
* "Humano relevante é todo humano cuja interação direta com uma superfície de uso do software entra no campo de avaliação da decisão de design em questão." em 4.1, não está estabilizada, não define quem decide se o humano entra na decisão. E a causalidade correta é: é por ter interação direta (o software diretamente proporciona uma experiência a esse humano) que ele entra no campo de avaliação.
* Há conceitos sendo usá-dos antes de suas definições serem instanciadas ou emergirem de outras (e.g., `usuário do produto`, `desenvolvedor`, `interação`), corrija isso.

Adicione essa solicitação ao log e a execute
```

## 1. Finalidade

Antes de avançar para a decomposição do explanandum, é preciso estabilizar alguns conceitos que a Etapa 1 deixou apenas indicados. Sem isso, o argumento corre o risco de oscilar entre sentidos diferentes de "software", "humano", "interação", "experiência" e "restrição".

O objetivo desta etapa não é ainda defender UseDD. O objetivo é fixar o vocabulário mínimo que permitirá defender, nas próximas etapas, uma tese estável.

## 2. Formulação de partida

A intuição a ser formalizada é esta:

> Um software será criado; se um humano irá interagir com ele no futuro, ele deve ser feito para proporcionar a melhor experiência de interação possível para esse humano.

Em forma mais precisa:

> Se `S` é um software a ser criado, e se existe ao menos um humano `h` para o qual `S` oferecerá alguma superfície de uso por meio da qual seu comportamento poderá ser diretamente operado, interpretado, mantido ou experimentado, então as superfícies de uso e o comportamento de `S` devem ser escolhidos de modo a oferecer a `h` a melhor experiência de interação possível dentro do conjunto de alternativas realmente viáveis.

Essa formulação ainda exige esclarecimento. Os termos a estabilizar são: `software`, `superfície de uso`, `comportamento`, `runtime`, `build-time`, `humano relevante`, `interagir`, `melhor experiência`, `possível` e `alternativas realmente viáveis`.

## 3. Software como artefato para uso humano

### 3.1. Artefato

Neste contexto, um artefato é algo produzido intencionalmente para entrar em uma prática de uso. Ele não é apenas uma coisa que existe; ele é uma coisa feita para ser usada, interpretada, operada, modificada ou integrada por alguém.

### 3.2. Software

Neste contexto analítico, "software" não significa apenas código executável. Significa um artefato técnico cujas formas estruturam possibilidades de ação, compreensão e manutenção ao longo do tempo.

Para esta análise, `software` abrange pelo menos quatro componentes conceituais que precisam ser mantidos distintos:

- comportamento;
- superfícies de uso;
- runtime;
- build-time.

#### 3.2.1. Comportamento

Comportamento é o conjunto de respostas observáveis do sistema a entradas, estados e transições. Inclui o que o sistema faz, deixa de fazer, permite, impede, sinaliza e preserva sob condições relevantes de uso.

Em interações humanas voltadas ao funcionamento do produto, comportamento aparece como estados, fluxos, feedbacks, erros, transições e resultados observáveis. Em interações humanas voltadas à construção e manutenção do sistema, comportamento aparece também como efeitos de superfícies técnicas: contratos aceitos ou rejeitados, falhas, mensagens, previsibilidade de integração e consequências de mudança.

#### 3.2.2. Superfície de uso

Superfície de uso é qualquer forma do software com a qual um humano pode interagir diretamente para produzir, observar, interpretar, configurar, modificar, operar ou manter comportamento.

São exemplos de superfícies de uso:

- telas, comandos e fluxos observáveis de operação em runtime;
- APIs públicas, tipos, contratos, mensagens de erro, convenções e pontos de extensão em build-time.

Nem toda estrutura interna do software é, por si só, uma superfície de uso. Ela se torna relevante como tal quando entra efetivamente na relação direta entre uma forma do sistema e um humano.

#### 3.2.3. Interação

Interação é a relação na qual um humano atua diretamente sobre uma superfície de uso e, por meio dela, recebe, interpreta, produz, modifica, opera ou mantém comportamento.

Essa definição importa porque evita duas confusões:

- nem todo efeito social ou organizacional do software conta como interação com o software;
- nem toda estrutura interna do software conta como objeto de interação humana relevante.

#### 3.2.4. Runtime

Runtime é o regime em que o software está sendo operado para realizar o comportamento do produto em uso. Aqui a interação humana se dá com superfícies voltadas à execução do sistema enquanto sistema em funcionamento.

Em runtime, o humano interage com o software para obter efeitos práticos do produto: executar tarefas, navegar estados, interpretar feedback e alcançar fins de uso.

#### 3.2.5. Build-time

Build-time é o regime em que o software é lido, escrito, configurado, integrado, testado, depurado, estendido ou mantido por humanos responsáveis por sua construção e evolução.

Em build-time, a interação humana não é com o produto em operação, mas com as superfícies pelas quais o software se deixa construir, compreender e modificar.

Assim, o software relevante para esta análise inclui:

- comportamento em runtime;
- superfícies de uso em runtime;
- superfícies de uso em build-time;
- formas internas que entram em relação direta de uso humano em build-time.

### 3.3. "Razão de existir é servir um humano"

A frase não deve ser lida como slogan moral nem como tese psicológica sobre a intenção subjetiva do autor. Ela deve ser lida como classificação teleológica do objeto.

Dizer que software é um artefato cuja razão de existir é servir um humano significa:

1. que ele pertence a uma prática humana de uso;
2. que sua avaliação normativa depende da relação que estabelece com humanos que o usam;
3. que, sem ao menos um humano para o qual o artefato ofereça alguma superfície de uso em horizonte de uso, manutenção ou operação, não há software no sentido normativamente relevante para esta análise.

Isso não implica que todo software sirva igualmente bem a humanos. Implica apenas que a referência ao humano não é acidental; ela é constitutiva do tipo de artefato que está sendo avaliado.

## 4. Quem conta como humano relevante

### 4.1. Definição

Humano relevante é todo humano para o qual o software, por meio de uma superfície de uso, produz diretamente efeitos de ação, compreensão, esforço ou resposta que a decisão de design correspondente pode melhorar, piorar, facilitar, dificultar ou tornar mais inteligíveis.

Não é uma instância externa que primeiro decide se esse humano entra no campo de avaliação. A ordem correta é a inversa: porque o software lhe produz diretamente esses efeitos por meio de uma superfície de uso, esse humano já pertence ao campo de avaliação da decisão que molda essa superfície e o comportamento por ela mediado.

A expressão "na decisão de design em questão" não indica arbitrariedade. Ela apenas marca que a relevância é local à relação específica que cada decisão efetivamente molda.

Cada parte da definição importa:

- `humano`: o portador dos efeitos humanos que a decisão pode melhorar ou piorar;
- `produz diretamente`: a conexão relevante não é indireta, remota ou meramente institucional;
- `efeitos diretos da interação`: o software afeta esse humano por meio da relação definida em `3.2.3`, e não apenas por consequências sociais distantes;
- `decisão de design correspondente`: cada decisão responde apenas pela parte desses efeitos humanos que ela realmente configura.

### 4.2. Casos centrais que emergem da definição

Dada a distinção anterior entre os dois regimes fundamentais de interação humana com software, seguem-se dois casos centrais de humano relevante.

Quando a interação direta ocorre com superfícies de uso em runtime, o humano relevante é o usuário do produto.

Quando a interação direta ocorre com superfícies de uso em build-time, o humano relevante é o desenvolvedor.

Assim, `usuário do produto` e `desenvolvedor` não aparecem como escolhas arbitrárias introduzidas de fora. Eles são os dois enquadramentos básicos que resultam da combinação entre:

- a definição de humano relevante;
- a definição de superfície de uso;
- a distinção entre runtime e build-time.

Papéis como PM, designer, pesquisador ou suporte não criam um terceiro tipo básico de humano relevante. Quando importam para a análise, importam porque representam, mediam ou informam algum desses dois casos centrais.

### 4.3. Casos didáticos fora do foco normativo imediato

Nem todo humano causalmente relacionado ao sistema é um humano relevante para toda decisão.

Ficam fora da definição central, a menos que uma decisão específica os transforme em usuários diretos de uma superfície de uso:

- humanos apenas indiretamente afetados, quando a decisão em análise não recai sobre sua interação com alguma superfície de uso do sistema;
- agentes hostis ou abusivos, que entram como parte do problema de segurança, não como destinatários da experiência a ser maximizada;
- stakeholders institucionais abstratos, quando não estão especificando uma relação concreta de uso humano.

Esta subseção é apenas didática. Sua função é evitar sobregeneralização da definição anterior.

## 5. Exemplos de interação nos dois regimes

A definição de `3.2.3` pode ser explicitada, nos dois regimes, da seguinte forma:

Em runtime, isso inclui:

- inputs;
- outputs;
- navegação;
- interpretação de estados, feedbacks e erros.

Em build-time, isso inclui:

- ler e escrever código;
- chamar APIs;
- configurar superfícies públicas;
- interpretar tipos, contratos, falhas e mensagens;
- depurar, estender e manter comportamento existente.

Portanto, DX não é um caso metafórico de uso. É interação direta com superfícies de uso em outro regime da mesma cadeia.

## 6. O que é "experiência de interação"

Experiência de interação não significa prazer subjetivo isolado, nem design visual agradável apenas. Significa o perfil total de exigências e facilidades que uma superfície de uso e o comportamento por ela mediado impõem ao humano que a usa.

Essa experiência inclui, entre outras dimensões:

- capacidade de cumprir a tarefa legítima pretendida;
- inteligibilidade do que o sistema faz e exige;
- previsibilidade de comportamento;
- custo cognitivo;
- custo temporal;
- propensão a erro;
- qualidade do feedback;
- recuperabilidade após erro;
- consistência entre partes da interação;
- grau de adaptação arbitrária exigida do humano.

Assim, "boa experiência" não quer dizer "agradável" em sentido superficial. Quer dizer "ajustada ao uso humano legítimo com o mínimo de ônus evitável e o máximo de inteligibilidade viável".

## 7. O que significa "melhor experiência"

### 7.1. "Melhor" é termo comparativo

"Melhor experiência" não designa perfeição absoluta. Designa superioridade entre alternativas.

Dadas duas alternativas `A` e `B` para a mesma relação de uso, `A` oferece experiência melhor do que `B` para um humano relevante quando, tudo o que for normativamente mais importante mantido constante, `A`:

- permite atingir o fim legítimo com menos atrito arbitrário;
- exige menos compensação cognitiva desnecessária;
- torna a superfície de uso e o comportamento implicado mais inteligíveis;
- melhora previsibilidade, feedback e recuperação;
- não sacrifica, sem razão suficiente, dimensões de maior peso normativo.

### 7.2. "Melhor" não é soma simples de métricas

Não há aqui compromisso com uma métrica única ou escalar. A experiência é multidimensional. Em muitos casos, haverá comparação clara; em outros, haverá trade-off entre dimensões diferentes.

Por isso, "melhor" deve ser lido como juízo prático comparativo orientado por uso humano, não como cálculo fechado por pontuação.

### 7.3. O que exclui uma alternativa do posto de "melhor"

Uma alternativa não pode contar como "a melhor" se sua superioridade depende apenas de:

- conveniência local da implementação;
- hábito da equipe;
- inércia do legado não examinada;
- limitação da ferramenta tomada como destino;
- deslocamento silencioso de custo para o humano que usa.

Esses fatores podem pesar na deliberação. Sozinhos, porém, não bastam para converter uma pior experiência humana em melhor decisão normativa.

## 8. O que significa "o melhor possível"

### 8.1. Possível não é o mesmo que imaginável

"Possível" significa viável sob condições reais de projeto. Não significa qualquer solução concebível em abstração.

O conjunto do possível é delimitado pelo conjunto de alternativas realmente viáveis à luz de:

- leis lógicas e limitações físicas;
- requisitos legais e regulatórios;
- compromissos de segurança, privacidade e integridade;
- dependências externas e interoperabilidade necessária;
- recursos finitos de tempo, dinheiro e pessoal;
- capacidades humanas reais de compreensão e operação;
- compromissos anteriores já legitimamente assumidos.

### 8.2. Restrições não são autoridade

É crucial distinguir duas coisas:

- restrição: fato que reduz o conjunto de alternativas disponíveis;
- autoridade: critério que decide qual alternativa deve ser escolhida dentre as disponíveis.

Uma restrição pode eliminar opções. Ela não escolhe, por si só, a melhor configuração de superfícies de uso e comportamento. Quem escolhe continua sendo a instância normativa relevante, isto é, o humano cujo uso está em questão ou a cadeia de autoridade que remonta a ele.

### 8.3. Nem toda dificuldade conta como restrição legítima

Há fatores que frequentemente aparecem como "restrições", mas que precisam ser tratados com desconfiança analítica:

- "sempre fizemos assim";
- "a biblioteca não ajuda";
- "o código atual não permite";
- "o prazo não comporta refatoração";
- "é mais simples para implementar deste jeito".

Esses fatores só contam como restrições normativamente relevantes quando são explicitados como fatos reais do caso e reavaliados pela autoridade humana pertinente. Sem isso, são apenas candidatos a racionalização posterior.

## 9. Por que UX e DX pertencem ao mesmo espaço normativo

Dizer que UX e DX pertencem ao mesmo espaço normativo não significa dizer que são idênticos em conteúdo. Significa dizer que ambos são casos do mesmo tipo de pergunta:

> como a forma de uma superfície de uso e do comportamento que ela medeia deve ser escolhida quando um humano irá interagir diretamente com ela?

Eles pertencem ao mesmo espaço normativo porque, em ambos os casos:

- há um humano em interação direta com uma superfície de uso do sistema;
- a superfície de uso e o comportamento por ela mediado podem facilitar ou dificultar sua ação e compreensão;
- o ônus imposto ao humano pode ser mais ou menos justificável;
- a conveniência da implementação pode ou não usurpar autoridade;
- a avaliação relevante pergunta se a superfície de uso e o comportamento correspondente servem ao uso humano legítimo.

O que muda entre UX e DX é:

- o regime da interação: runtime ou build-time;
- o vocabulário dominante da porta: comportamental ou técnico;
- o tipo de tarefa humana em jogo.

Essas diferenças não bastam para separar os dois casos em domínios normativos independentes. Elas apenas mostram que o mesmo princípio precisa ser expresso em vocabulários diferentes.

## 10. Regra consolidada

Com os conceitos acima estabilizados, a formulação de partida pode ser reescrita assim:

> Software, no sentido relevante desta análise, é um artefato técnico feito para entrar em relações de uso humano. Sempre que uma superfície de uso do sistema for objeto de interação direta de um humano relevante, essa superfície e o comportamento por ela mediado devem ser definidos de modo a oferecer a melhor experiência de interação possível para esse humano, isto é, a melhor experiência disponível dentro do conjunto de alternativas realmente viáveis e sem conceder autoridade normativa autônoma à mera conveniência da implementação.

## 11. Consequências imediatas para a análise futura

Da formalização acima seguem cinco consequências imediatas:

1. a referência ao humano deixa de ser intuitiva e passa a ser estrutural;
2. UX e DX podem ser tratados conjuntamente sem colapsar suas diferenças;
3. "melhor experiência" deixa de significar gosto, estética ou conforto superficial;
4. "melhor possível" deixa de significar perfeição e passa a significar melhor alternativa viável;
5. restrições reais podem limitar o espaço de decisão, mas não podem ocupar o lugar da autoridade.

## 12. O que permanece em aberto

Esta etapa não resolve ainda:

- como comparar conflitos entre humanos relevantes diferentes;
- como pesar dimensões distintas da experiência quando entram em trade-off;
- qual fundamento normativo último justifica priorizar experiência humana;
- como demonstrar, em detalhe, que a cadeia de autoridade de UseDD é a melhor formulação desse quadro.

Ela apenas remove ambiguidade conceitual suficiente para que a próxima etapa possa avançar com alvo estável.
