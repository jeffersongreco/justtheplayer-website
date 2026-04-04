# 2026-03-26

* `Conversa: Auditoria de Autorialidade e Use Driven Design.md` é onde surge o vislumbre do princípio (antes da mensagem que propõe uma formalização) e o esclarecimento final para uma escrita da primeira versão de UseDD.
* O nome "Use" veio em uma epifania durante a noite e ele, por sua vez, organizou o pensamento que resultou na proposta de formalização citada no ponto anterior.
* `Review — UDD Design Tree Logic.md` resultou em `1 - Use Driven Design - Design Tree.md`.

# 2026-03-30

* `UseDD Explanation.md` contém quatro casos de objeção/alinhamento para UseDD, escritos pelo autor como material de apoio à formalização.
* `UseDD Philosophical Audit.md` é uma auditoria filosófica (filosofia analítica) do "porquê" de UseDD: razão de existir, premissas, lógica interna, interação com o meio, e aplicação prática. O formato é de diálogo — o filósofo escreve a análise, o autor corrige com notas inline, e o filósofo responde em seções de revisão sem sobrescrever o original. As principais resoluções:
  * P0 (software é artefato para humanos) estava implícita e deve ser explicitada.
  * P1 (assimetria de autoridade) é axioma, não teorema — reconhecido como escolha de modelagem.
  * Os dois humanos que usam diretamente: usuário do produto (runtime) e desenvolvedor (build-time). Prioridade de sequência, não de valor.
  * Infraestrutura (utils, APIs externas) fica fora da cadeia de autoridade — portas definidas pelo humano desenvolvedor diretamente.
  * A relação com TDD/API-first/DIP foi corrigida: UseDD não explica por que existem, compartilha superfície na dimensão do desenvolvedor, pode servir como critério de avaliação.
  * UseDD passou de meta-princípio a princípio ao agregar a prática de especificação (L3).
  * "Spec" foi eliminado como termo — só "porta" (a diferença temporal não justifica termo novo).
  * "Módulo" foi eliminado como termo das regras — só "entidade" (regras universais, exceções em último caso).
* `6 - Use Driven Design - Design Tree v2` é a nova versão da Design Tree, incorporando todas as resoluções da auditoria. Diferenças em relação à versão de 2026-03-26:
  * Premissa Fundacional (P0) explicitada acima do Nó Raiz.
  * L1.1 anota a natureza axiomática de P1.
  * L2.4 renomeado: "A porta é o critério de correção da implementação".
  * L2.6 e L2.7 anotados como teoremas pedagógicos.
  * L2.9 (os dois humanos e sua prioridade) e L2.10 (fronteira com infraestrutura) adicionados.
  * L3 (prática de especificação) adicionado com a sequência de trabalho derivada do princípio.
  * Glossário expandido com Infraestrutura e detalhamento dos dois humanos em Usuário.
  * Vocabulário unificado: só "porta" e "entidade" em todas as regras.
* `Uncle Bob Style Explanation.md` é um documento pré-existente, não produzido nesta sessão.

### 2026-03-31

Primeira versão do explanandum resultado do `Prompt Design Tree to Explanandum.md`, em `8 - Explanandum - Identificação do Fenômeno.md`.

### 2026-04-01

**Solicitação do autor:**

> Adicione sobre os cenários em que o fenômeno é mais ou menos agudo: o
> menos de todos é um designer programando, o mais de todos é um dev sem
> conhecimento de design (entenda por design a competência ampla desde
> UI/UX, até gerenciar projetos e ter bom gosto estético e
> criatividade), e é pendular em times a depender se nos conflitos a
> gerência vai priorizar o time de design (PM, UX) ou o time de
> desenvolvimento. Também sobre DX ser algo novo em engenharia de
> software. E, se for cabível mantendo a neutralidade, salientar a
> questão sobre a maioria dos casos serem justificáveis, ou a maioria
> ser causada por uma mentalidade que está posta estruturalmente de forma
> a nem ser percebida. Também sobre a questão de participantes
> acreditarem que só grande empresas com recursos, tempo e times serem
> capazes de mitigar essa tensão.

**O que foi alterado:**

- Adicionadas quatro manifestações a §2: gradiente de competência
  (§2.7), DX como preocupação tardia (§2.8), constrangimento
  estruturalmente invisível (§2.9), presunção de escala (§2.10).
- Adicionadas quatro linhas correspondentes ao mapa de hesitações (§4):
  pessoa vs. estrutura, moldura invisível, escala como pré-requisito,
  DX como UX.

**Solicitação do autor:**

> Em "2.7", "Onde divergem": "separar explicitamente os papéis e criar
> processos de mediação entre eles" é o status quo que vinha sendo
> padrão. E talvez desnude mais uma manifestação, essa separação pode
> ser causa de devs, mesmo agora que é comum software sendo feito por
> pessoas sozinhas, continuarem com zero design em mente. E coisa que
> creio ser manifestação separada: devs delegando design para IA em vez
> de estudarem design; devs que estão usando processos de engenharia de
> software para fazer produtos, em vez de aprenderem design de produto.

**Alterações:**

- §2.7 "Onde divergem": reconhecido que a separação de papéis é o
  status quo histórico; adicionado parágrafo sobre como essa separação
  pode ter consolidado a mentalidade que a tensão produz — inclusive em
  devs solo.
- Nova manifestação §2.8 (delegação sem aquisição): devs delegando
  design a IA sem critério para avaliar o resultado; devs aplicando
  processo de engenharia como se fosse suficiente para design de
  produto.
- Renumeração: antigas §2.8–2.10 → §2.9–2.11.
- Duas linhas adicionadas ao mapa de hesitações (§4): delegação vs.
  aquisição, herança da separação.

### 2026-04-01

2 análises do explanandum, resultado do `Prompt Explanandum to Decomposição`, em `9 - Claude - Decomposição.md` e `9 - Codex - Decomposição.md`.
