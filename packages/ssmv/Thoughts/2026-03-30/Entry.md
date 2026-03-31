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
* `Use Driven Design - Design Tree.md` é a nova versão da Design Tree, incorporando todas as resoluções da auditoria. Diferenças em relação à versão de 2026-03-26:
  * Premissa Fundacional (P0) explicitada acima do Nó Raiz.
  * L1.1 anota a natureza axiomática de P1.
  * L2.4 renomeado: "A porta é o critério de correção da implementação".
  * L2.6 e L2.7 anotados como teoremas pedagógicos.
  * L2.9 (os dois humanos e sua prioridade) e L2.10 (fronteira com infraestrutura) adicionados.
  * L3 (prática de especificação) adicionado com a sequência de trabalho derivada do princípio.
  * Glossário expandido com Infraestrutura e detalhamento dos dois humanos em Usuário.
  * Vocabulário unificado: só "porta" e "entidade" em todas as regras.
* `Uncle Bob Style Explanation.md` é um documento pré-existente, não produzido nesta sessão.
