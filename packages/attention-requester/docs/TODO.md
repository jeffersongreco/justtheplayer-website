**Fazer:**

- [ ] Verificar se o target fallback não é um erro, se esse mecanismo deveria mesmo existir.
- [ ] Pensar em Motion sensitivity. Ideia atual de forma de chamar a atenção sem animar o componente: um tooltip aparecendo sem animação. (Verificar o que o macOS faz nesse caso).
- [ ] Escrever o README que explica o que é, quais os comportamentos, como usar, etc. Tudo próprio para IA.
- [ ] **registry.json** — shadcn-style machine-readable install manifest per package

**Talvez:**

- [ ] Definir se o componente assumirá a responsabilidade de ter uma fila de chamadas. Por hora o consumidor é responsável por chamar o concelamento e a próxima chamada, chamadas consecutivas durante uma animação em curso são ignoradas atualmente.
