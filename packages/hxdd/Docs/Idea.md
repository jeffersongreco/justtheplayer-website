# HXDD — Human Experiece Driven Development

## Passos

### Primeiro Passo — Raw Idea

1. O autor descreve o que pretende criar, com todos detalhes que ele já pensou
2. O agente começa a documentação criando `Docs/Raw Idea.md` com a descrição fornecida ipsis literis

### Segundo Passo — Idea

1. O agente identifica na descrição o que afeta o uso em *runtime* e, se existir, então `/grill` o autor para (se não existir, pula para it. 3):
  - Chegar a um entendimento mútuo garantido das intenções e objetivo, incluíndo as nuances
  - Trazer para a conversa pontos que o autor ainda não mencionou, princípalmente possíveis pontos cegos (por falta de conhecimento, olhar estreito, omição de preocupações que normalmente se mostram só no futuro do desenvolvimento, etc.)
2. O agente documenta essa versão mais completa da ideia (em *runtime*) em `Docs/Idea - Product User.md`
3. O agente identifica o que em `Docs/Raw Idea.md` afeta o uso em *build-time* e faz o mesmo que it. 1, agora para esse uso.
4. O mesmo que it. 2, agora em `Docs/Idea - Developer User.md`

#### Notas

- `/grill` deve ser uma versão do seguinte:
  ```
  ---
  name: grill-me
  description: Interview the user relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree. Use when user wants to stress-test a plan, get grilled on their design, or mentions "grill me".
  ---
  
  Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.
  
  Ask the questions one at a time.
  
  If a question can be answered by exploring the codebase, explore the codebase instead.
  ```
- Essa versão deve saber que o escopo é "comportamental", "o que" e "quando", não o "como" técnico.

### Terceiro Passo — User-story maps (Behavioral Specification)

- Exemplos em `packages/movable/docs/Behavioral Specification.md` e `packages/attention-requester/docs/Behavioral Specification.md`
- Artigo referência sobre User-story maps em `https://www.nngroup.com/articles/user-story-mapping/`
- Objetivo, adquitir do artigo a lógica de mapeamento e somar ela ao objetivo (de contranger o autor a respeitar o princípio citado na última nota), resultando em um padrão robusto de escrita desse documento.

### Quarto Passo — Restrições (Technical Specification)

- Qual plataforma, framework, etc.
- Restrições reais (além do controle do autor) e declaradas (o autor escolheu entre alternativas e justificou a escolha)

### Quinto Passo — Sem nome

### Notas

- O HXDD se baseia no princípio com descrição iniciada em `packages/ssmv/Thoughts/2026-04-02/Etapa 1 Consolidada.md` e continuada em `packages/ssmv/Thoughts/2026-04-12/Princípio Central — Versão Categórica.md`
- Por isso, parte para entender a ideia do ponto de vista dos usuários e não de requisitos técnicos (PRD tradicional, Spec tradicional), assim fazendo o autor formular primeiro a *melhor experiência*, para em passos futuros (Quarto Passo) formular a *melhor possível*. Sem a *melhor* antes, o autor não tomaria nota do que as restrições técnicas contrangeram, não tendo assim clareza sobre a diferença entre *melhor* e *melhor possível*.
- O Quinto Passo será a especificação que será a fonte de verdade a quem os testes e implementações respeitarão e seguirão.
