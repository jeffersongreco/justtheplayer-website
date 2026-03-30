# Conversa: Princípios de Engenharia — de UseDD + Domínio a Restrições de Engenharia

**Contexto:** Terceira camada na sequência UseDD → Restrições de Domínio → Princípios de Engenharia → Convenções e Arquitetura. Esta Design Tree parte das liberdades que UseDD + Restrições de Domínio deixam em aberto — tanto as domínio-específicas (G1–G7) quanto preocupações universais de engenharia — e escolhe princípios que as constrangem, sem prescrever uma arquitetura.

---

## 1. Mensagem do autor

Na sequência UseDD → Restrições de Domínio → **Princípios de Engenharia** → Convenções e Arquitetura: Escreva agora em um novo arquivo a design tree de Princípios de Engenharia. Esclareço: não é um esforço de justificar a SSMV, é um esforço de descer as camadas de forma imparcial, identificando quais liberdades sobram em cada uma e demandam constrangimento na próxima. Cada árvore é um trabalho com coesão em si mesma, não com a próxima etapa. Uma árvore pode citar as etapas anteriores, nunca as seguintes. Essa etapa não deve saber da existência de SSMV, só sabe que UseDD deixa muita liberdade para fazer sistemas/código ruim que ainda respeitam seus princípios, logo outros princípios são necessários e ela escolhe quais são.

Adendo: Não presuponha que a lista de graus de liberdade existente é exaustiva, ela foi feita para ser sobre aplicação nesse domínio específico e por tal, pode estar omitindo liberdades que são de preocupação geral/ampla/universais de engenharia de software.

---

## 2. Análise de contexto

### O que as camadas anteriores estabelecem

**UseDD** (meta-princípio) constrange:
- Direção de autoridade: quem usa define a porta, quem é usado implementa.
- Sequência: uso precede implementação.
- Separação de nível de responsabilidade: quem decide não executa, quem executa não decide.
- Cadeia de autoridade: finita, acíclica, com raiz no humano.
- Vocabulário da porta determinado pelo decisor.
- Especificação como critério de correção.

**Restrições de Domínio** (UseDD aplicado a componentes UI reativos com estado) constrange:
- Tocar na DOM é execução (D1.1).
- Coletar interação é execução; interpretar é decisão (D1.2).
- Duas portas externas: UX (comportamental, para o usuário) e DX (técnica, para o desenvolvedor) (D1.3).
- Pelo menos uma entidade decisora sem DOM e pelo menos uma executora com DOM (D2.1).
- Estado é informação, não responsabilidade — UseDD não constrange co-localização (D2.2).
- Reatividade propaga, não origina autoridade (D2.4).

### O que as camadas anteriores deixam em aberto

**Domínio-específicas (G1–G7):** Template/script como uma ou duas entidades, número de entidades, co-localização de estado, portas servidas por mesma entidade ou diferentes, coleta de eventos separada ou não, mecanismo de comunicação, papel do script.

**Universais (não abordadas):** A lista G1–G7 foi construída a partir da aplicação de UseDD ao domínio. Mas preocupações universais de engenharia de software — consistência de estado, direção de dependência, coesão, tolerância a mudança, verificabilidade, contenção de efeitos colaterais, fluxo horizontal entre peers, granularidade de fronteiras, complexidade da cadeia, instruções completas vs consultas — não são abordadas por nenhuma das duas camadas anteriores. UseDD é silencioso sobre todas elas porque não é um princípio de engenharia — é um meta-princípio sobre direção de autoridade.

### A observação central

Um sistema pode satisfazer todas as restrições de UseDD e todas as derivações de domínio e ainda ser código ruim. UseDD garante que a autoridade flui na direção certa; não garante que o código seja testável, manutenível, ou tolerante a mudança. Princípios de engenharia são necessários para preencher essa lacuna.

---

## 3. Design Tree — Princípios de Engenharia

*(Produzida e entregue como arquivo separado: `3 - Princípios de Engenharia - Design Tree.md`)*

### Estrutura da árvore

A árvore segue esta organização:

**L — Liberdades:** Cataloga o que está em aberto, em duas categorias:
- L.h — Liberdades herdadas domínio-específicas (G1–G7)
- L.u — Liberdades universais de engenharia (L.u1–L.u10), identificadas independentemente da lista G existente

**P — Princípios escolhidos:** Sete princípios, cada um com decisão, alternativas, racional, e mapa de o que constrange:
- P1 — Fonte de verdade única (SSOT) → constrange L.u1, L.u7
- P2 — Inversão de dependência (DIP) → constrange L.u2, L.u5
- P3 — Responsabilidade única (SRP) → constrange L.u8, L.u6, G5
- P4 — Coesão: domínio de decisão completo → constrange L.u3, G7
- P5 — Abertura para extensão (OCP) com heurística de domínio → constrange L.u4, G4
- P6 — Instrução completa (Tell Don't Ask) → constrange L.u10, L.u7
- P7 — Simplicidade estrutural (menor cadeia suficiente) → constrange L.u9, G2

**C — Consequências:** Cinco propriedades emergentes da combinação dos princípios:
- C1 — Módulos testáveis em isolado (por construção)
- C2 — Módulos independentes entre peers (por construção)
- C3 — Mudanças localizadas
- C4 — Tradutores justificáveis
- C5 — Estado mutável concentrado no decisor

**G — Graus de liberdade remanescentes:** Nove liberdades que esta camada não resolve — materialização das fronteiras, forma das abstrações, formato das instruções, nomenclatura, mecanismo de comunicação, resolução final dos Gs herdados, critério de confiança para generalização, processo de verificação, vocabulário das portas internas.

### Decisões de design da árvore

**Por que identificar L.u1–L.u10 além de G1–G7:** O autor observou corretamente que a lista G1–G7 foi construída a partir de UseDD aplicado ao domínio — é domínio-específica. Preocupações universais como consistência de estado, verificabilidade, e tolerância a mudança não emergem da análise de domínio — emergem do ato de construir software. Omiti-las significaria que a árvore só constrangiria liberdades domínio-específicas e deixaria todas as fragilidades universais de engenharia intocadas.

**Por que esses sete princípios e não outros:** Cada princípio foi escolhido porque constrange pelo menos uma liberdade identificada que, se deixada aberta, permite um defeito específico (estado inconsistente, acoplamento, fragilidade a mudança, etc.). Princípios que não constrangem nenhuma liberdade desta camada — como Interface Segregation ou Law of Demeter — foram considerados mas são deriváveis da combinação de P2 + P6, ou pertencem a convenções.

**Por que consequências (C) são listadas separadamente:** As consequências não são princípios adicionais — são propriedades verificáveis que emergem da combinação. Servem como diagnóstico: se C2 (independência entre peers) não é satisfeita, a causa é violação de P1, P2, ou P6. Separar princípios de consequências evita a ilusão de que são decisões independentes.
