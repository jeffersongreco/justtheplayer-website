- O autor quer iniciar um desenvolvimento usando HXDD (chamando uma Skill({ skill: "hxdd-init" }))
  - A primeira coisa que ele faz é informar ao agente o que ele quer desenvolver
  - (a) Ele tem só uma *pasta* vazia
    - Por algum motivo e irá informar no prompt de chamada da Skill
  - (b) Ele tem uma pasta com um arquivo "Idea.md" (ou "IDEA.md", ou "Raw Idea.md", ou "Docs/Raw Idea.md") dentro
    - O informe está dentro desse arquivo
  - *pasta:* Pode ser a raiz ou pode ser uma pasta dentro de um monorepo
- O que o agente precisa fazer é o setup inicial dessa pasta fazendo:
  - Coletar a ideia, independente do estado da *pasta*, e entregar a pasta no estado:
    ```
    <package>/
    ├─ .hxdd/
    │ └─ state.json       # Estado do progresso
    │ └─ settings.json    # Nome do pacote e idioma dos documentos
    └─ Docs/
      └─ Raw Idea.md      # Contendo o informe/ideia ipsis literis
    ```
  - Isso deve ser completamente feito com o Haiku, sem o autor precisar trocar de modelo
