# TODO

## Arquiteture Docs

- [ ] Atualizar para deixar claro que a prática de TDD é a defendida no Extreme Programming com etapas Red, Green, Refactor. Verificar se o workflow atual já contempla isso.

## `packages/`

- [ ] Estudar a adoção de "interfaces" (A Philosophy of Software Design by John Ousterhout) para que não seja necessário ler código para entender o funcionamento do sistema, somente essas interfaces são necessárias (se não me engano as documentações da Apple seguem isso, só tem protocolos e tipos nos docs). Leitura de código se torna necessária somente para desenvolvimento do próprio pacote. Conceitos: Graybox modules, Deep Modules.
- [ ] Documentação nos arquivos para melhorar o conteúdo dos popups nas IDEs
- [ ] Expandir os testes para nível paranóico, ter certeza que nenhum caso, mesmo raro, tenha sido omitido
- [ ] **registry.json** — shadcn-style machine-readable install manifest per package

### `packages/Svelte Model View Architecture/`



### `packages/attention-requester/`



### `packages/movable/`

- [ ] Scroolar a tela durante o movimento se os limites estiverem além de área visível da página.
- [ ] Melhorar a movimentação por teclado para ser suave e com movimento diagonal, como em games (se a implementação for simples - não é uma feature, é uma comformação de a11y).
- [ ] Resolver o checklist de a11y.
- [ ] Depois das atualizações de Movable, atualizar o exemplo que usa ele no README do attention-requester
