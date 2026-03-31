# TODO

## Arquiteture Docs

- [ ] Adicionar diretriz de padrão de escrita dos Coordinators, dentro de cada função as ações devem ser agrupadas por tipo: assessibilidade, data tags, animação, ...

## `packages/`

- [ ] **registry.json** — shadcn-style machine-readable install manifest per package

### `packages/Svelte Model View Architecture/`



### `packages/attention-requester/`



### `packages/movable/`

- [ ] Scroolar a tela durante o movimento se os limites estiverem além de área visível da página.
- [ ] Melhorar a movimentação por teclado para ser suave e com movimento diagonal, como em games. Velocidade linear, definir a velocidade ideal para o default.


---

# Notes

- Arquitetura Hexagonal (Ports and Adapters) + DDD + Alta granularidade (São hexágonos por módulo, não por pacote. Os Adapters também são considerados domínios).

Na documentação Coordinator e Interaction estão sendo chamados de serviços, mudar para adaptadores.


# Use Driven Design

* Quem é o usuário e quem é usado, não é sobre fluxo de dados é sobre quem pensa. O humano pensa, ele usa o sistema. O Model pensa (regras de negócio), ele usa o Coordinator. O script pensa (regras de apresentação), ele usa o template.
* Quem dita a implementação é o uso que o usuário espera do artefato. O uso esperado é definido antes da implementação, em vez do contrário. O uso é uma diretriz para a implementação e não uma consequência dela.
* No nível de código (dentro da arq. hexagonal), primeiro é definida a porta e depois o adapter. E quem manda como será a porta é quem tem regras em seu domínio, não quem é só executor (Coordinator), nem quem é só coletor de informações (Interaction).

# Pra coluna

- Para atrair a atenção, usar a preguiça de documentar. "Ei, e se eu te falar que não tenho preguiça de documentar meu código? Sorte sua, eu tenho. Mas e se eu te falar que é porque eu não preciso documentar? Qual ferramenta você usa pra automatizar? Não é isso, é que quando eu escrevo meu código, a documentação já existe. Como assim, como documenta sem o código? Poisé, eu faço documentação antes e deixa eu te explicar como:"
- Usar o seguinte caso para mostrar como meu background de designer de interfaces não me deixa esquecer dos humanos, enquando um programador costuma esquecer: "Eu solicitei um algorítimo de agendamento de horários que marca consultas e consegue remanejar; o dev me perguntou se era mesmo necessário ter isso no produto, porque agenda dá muito trabalho; eu, como aquele que pensa no humano, solicitei a feature justamente por dar trabalho, o sistema existe para atender ao humano, se eu faço o um sistema o qual o humano tem trabalho ao usar ele, estou fazendo algo que não tem porque existir; ele esqueceu quem serve a quem, esqueceu que o computador serve ao humano e nunca o contrário."
- Fazer uma narrativa que atraí os devs preguiçosos no começo e de propósito, para depois de deixar eles achando que aprenderam um "hack de produtividade" ouvirem sobre como são preguiçosos e que o motivo real é obrigar eles a não esquecer que trabalham para humanos e não para códigos.
- Como o Model responde a Spec que responde ao Humano, a regra de "quem pensa manda" garante que a cadeia de autoridade sempre seja uma linha que leva ao humano, sem nenhum galho onde a ponta é a implementação. E então porque "Use" e não "User Driven", porque a regra se aplica em qualquer granularidade (O Model é um arquivo-fonte e não um "usuário" — salvamos esse termo a humanos).
- DRAFT passa da crônica/ensaio para neurociência, aqui a transição será para princípio de engenharia de software estilo Uncle Bob explicando cada princípio do SOLID. E deve ter uma proporção balanceada de narrativa, o objetivo primário é tornar o princípio UseDD conhecido e, mais imperativo, compreendido em completude e com clareza, nesse a narrativa é apenas para apelo inicial e deixar a leitura interessante, mas não o gênero do texto inteiro, o resultado deve ser "quase" publicável pela O'Relly.
