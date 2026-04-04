**Caso:** Uma pessoa olha o UseDD e entende que ele basicamente te diz para usar TDD, API-first, DIP.

**Alinhamento:** Você focou na relação entre dois módulos, omitiu a regra da cadeia de autoridade sempre chegando ao humano, essa regra é a razão de existir de UseDD, sua formalização não é para revelar um princípio implícito que perpassa TDD, API-first, DIP, etc., é para reforçar que software é feito para humanos e esse valor deve estar sempre presente e acima de todos outros

**Caso:** A pessoa agora entende que é para priorizar o humano em vez de o computador, o código legado, o framework, a database.

**Alinhamento:** O problema não está nas limitações reais de desenvolviemtno de software. A inversão de prioridade existe mesmo no dia 1 de desenvolvimento de um sistema novo. A quebra dessa cadeia de autoridade foi normalizada a ponto de um PM precisar fazer um pitch de uma feature, sempre que ela for minimamente complexa, para o dev aceitar implementá-la e, o dev nem será visto como preguiçoso, ele será o pragmático que pensa em orçamento e deadline, enquanto o PM é um designer sem pé no chão.

**Caso:** A pessoa entendeu completamente, mas achou impraticável, bonito só no papel.

**Alinhamento:** Não é utópico, nem ingênuo, esclarecer que restrições não são ignoradas. Mas em um caso que elas existem, ainda assim uma spec não vai mudar para se adequar à implementação conveniente ou apressada, a spec será atualizada respeitando a cadeia de autoridade: dentro dessa limitação de recursos, qual a melhor forma de agradar o humano? — nunca "vamos deixar o humano insatisfeito e é o que é, porque o código terá que ser assim"

**Caso:** A pessoa viu que é praticável sim, mas não empatizou.

**Alinhamento:** O usuário final do produto não é o único humano, os desenvolvedores que irão consumir a API ou compor com os componentes são, também, humanos com autoridade. Quando você lembra disso, lembra que ao abandonar o UseDD, você está deixando de cuidar do seu eu do futuro. UseDD não atua só na fronteira do sistema, mas em cada módulo, e quando você se preocupa com o humano, a DX de cada interface/API é melhor para você mesmo também.
