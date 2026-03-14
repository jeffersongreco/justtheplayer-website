### Arquitetura de Componentes e API (DX)

**Visões (Views) e Nomenclatura**
* **Tudo é View:** Não há distinção arquitetural entre "Páginas" e "Componentes". Todos são tratados estruturalmente como Views.
* **Views são "Burras" (Dumb Views):** Elas não tomam decisões de negócio. Sua única responsabilidade é renderizar o estado e capturar a intenção do usuário.
* **Nomes Agnósticos na UI:** As Views usam nomenclaturas internas estritamente ligadas à apresentação (ex: `isHeroSubtle`, `isBouncingRight`), nunca jargões de negócio. A View atua como "tradutora", mapeando a verdade do Model (`model.isFinished`) para seu próprio idioma visual.

**Models, Serviços e Injeção de Dependência**

* **Models como Fonte da Verdade:** Os Models contêm tanto o estado da aplicação quanto as regras de negócio que modificam esse estado.
* **Sem Singletons Globais:** A arquitetura repudia *singletons* globais na memória. Instâncias de Models são criadas e injetadas na árvore de componentes utilizando Svelte Contexts (ex: `<Movable.Root>`), garantindo isolamento (múltiplas instâncias podem coexistir sem conflito).
* **Estados Públicos via `$derived`:** Propriedades expostas pelo Model para as Views são definidas como sinais cacheados (`$derived`), garantindo uma API de leitura estável, performática e reativa.
* **Delegação para Serviços/Interactions:** Quando uma regra de negócio é muito complexa, extensa ou interage com elementos externos (como a ponte com eventos de hardware do mouse/teclado), ela é extraída do componente para um "Serviço". Serviços recebem nomes baseados no seu caso de uso (ex: `MovableDragInteraction` para lidar com os *pointer events* físicos).

**Padrão Polimórfico (`asChild`): Abertura Progressiva**

* O padrão `asChild` resolve o maior dilema no design de bibliotecas de UI: o conflito entre a facilidade de uso (não ter que escrever *boilerplate*) e o controle absoluto do DOM. Ele permite que o componente seja "camaleônico", oferecendo dois caminhos estruturais:

​	**1. O Caminho Padrão (O Shell Seguro)**
​	Se o desenvolvedor apenas injetar conteúdo, o componente renderiza um invólucro padrão (um `<div>` invisível). Esse Shell assume o trabalho sujo: já vem com acessibilidade (`role`, `tabindex`), gerencia estilos vitais sob o capô e lida com a física do sistema. É a rota "Plug and Play", perfeita para 80% dos casos rápidos.

​	**2. A Rota de Fuga (Inversão de Controle via `asChild`)**
​	Em layouts complexos — como malhas de CSS Grid, *Flexbox* restritos ou quando matrizes de `transform` entram em conflito —, um `<div>` extra forçado pela biblioteca quebraria o design (o clássico "Wrapper Hell"). 
Ao usar o *snippet* `asChild`, o componente "desiste" de renderizar sua própria tag HTML. Em vez disso, ele passa suas capacidades internas (ações brutas como `use:item` e estados reativos como `isDragging`) de volta para o usuário. A View do usuário **absorve** a lógica da biblioteca na sua própria tag.

* **O Benefício Arquitetural**
  Isso garante a regra de ouro das bibliotecas modernas (como Radix UI): **"Seja invisível por padrão, mas saia da frente quando requisitado"**. O `asChild` garante que a biblioteca jamais entre em guerra com o CSS do desenvolvedor, fundindo regras de negócio complexas a uma marcação HTML semanticamente pura.

**Design de API e Experiência do Desenvolvedor (DX)**
* **Design Declarativo (Padrão Radix / React Aria):** A API prioriza componentes declarativos (ex: `<Movable.Item>`) que encapsulam a complexidade. Ações brutas do Svelte (`use:action`) são mantidas sob o capô, expostas apenas como rotas de escape.
* **Dot Notation Exports:** Famílias de componentes são exportadas sob um namespace unificado (ex: `<Movable.Root>`, `<Movable.Item>`, `<Movable.Sensor>`). Isso melhora drasticamente o autocompletar na IDE e deixa claro a qual ecossistema o componente pertence.
* **Padrão Polimórfico (`asChild`):** Os componentes fornecem um "Shell" (invólucro HTML) seguro por padrão, mas oferecem um *snippet* `asChild` para Inversão de Controle. Isso permite que o usuário anexe a lógica da biblioteca diretamente em suas próprias tags HTML, evitando a poluição do DOM com `<div>` extras.
* **Wrappers "Invisíveis" (Zero Styling):** Quando o componente fornece um Shell, ele não opina no visual. Não possui cor, borda ou dimensões fixas (usa `display: flex; width: max-content; height: max-content`). O tamanho e a estética pertencem 100% aos `children` que o usuário passar.
* **Shells Invisíveis como "Modificadores Lógicos" (Modelo SwiftUI):** 
  A biblioteca não utiliza *wrappers* tradicionais. Um *wrapper* comum cria uma hierarquia estrutural (uma "caixa dentro de outra caixa"), o que frequentemente quebra layouts CSS (Flexbox/Grid). Aqui, os Shells devem ser encarados com o mesmo modelo mental dos **View Modifiers do SwiftUI** (como `.draggable()`), mas atuando na injeção de *lógica* em vez de *estilo*. 
  * **Sintaxe vs. Realidade:** O fato de uma View ser escrita "dentro" do componente (ex: `<Movable.Item> <MinhaView /> </Movable.Item>`) é apenas uma exigência sintática do Svelte/HTML. Na prática, não existe a relação de aprisionamento. 
  * **Superpoderes:** O Shell atua como um "fantasma estrutural" que concede superpoderes à View (física de movimento, captura de ponteiro, observação de redimensionamento e estados como `isDragging`). A View não está "dentro" do Shell; ela **absorve** as capacidades do Shell, mantendo 100% do controle sobre suas próprias dimensões, cores e comportamento visual.
* **Injeção de Estado via Snippets:** Estados efêmeros cruciais da UI (como `isDragging`, `isFocused`, `isOver`) são passados diretamente de volta para o usuário através dos parâmetros do *snippet*, permitindo estilização dinâmica sem que o usuário precise instanciar variáveis no bloco `<script>`.
* **Acesso Profundo sem Prop-Drilling (Context Hooks):** A biblioteca exporta atalhos de contexto (ex: `Movable.use()`) para que componentes independentes (como um HUD isolado) possam ler o estado global daquela árvore sem precisarem receber as informações via propriedades em cascata.

* **Contextos como Fronteiras Lógicas (O Fim do Prop Drilling):**
  Assim como os Shells invisíveis, o provedor de contexto (ex: `<Movable.Root>`) utiliza uma sintaxe de encapsulamento no código (`<Root> ... </Root>`), o que pode passar a falsa impressão de que ele é um elemento estrutural ou uma "caixa" no layout. Na realidade, ele é estritamente uma **fronteira lógica invisível**.
  * **Bolha de Estado:** Ele não renderiza nenhuma tag HTML própria. Sua única função é demarcar um limite na árvore de componentes onde uma instância específica do Model passa a existir e estar disponível. 
  * **Injeção de Dependência Natural:** Qualquer View que esteja declarada geograficamente dentro desse limite (não importa quão profunda na árvore do DOM) ganha a capacidade de consumir o estado daquele Model (via `Movable.use()`), eliminando completamente a necessidade de *prop drilling* (passar variáveis de pai para filho infinitamente). Isso permite criar ecossistemas totalmente isolados na mesma página (ex: um painel esquerdo e um painel direito que não interferem um no outro).

* **A Escolha pelo Design Declarativo (O Porquê do `.svelte`):**
  A decisão de transformar a injeção de Contexto (`<Movable.Root>`) e as interações físicas (`<Movable.Item>`, `<Movable.Sensor>`) em **componentes `.svelte`** (em vez de expor apenas funções puras em TypeScript para uso no `<script>`) é o coração do design declarativo moderno.
  * **Alinhamento Mental:** Em UI, a hierarquia visual importa. Quando um desenvolvedor bate o olho na estrutura HTML, ele imediatamente compreende que "tudo que está dentro desta tag compartilha as mesmas regras físicas". A árvore do código reflete perfeitamente a árvore de comportamentos.
  * **Delegação de Ciclo de Vida:** Ao usar componentes `.svelte` declarativos, o desenvolvedor não precisa se preocupar com `onMount`, `onDestroy` ou vazamentos de memória (memory leaks). Quando o `<Movable.Root>` ou o `<Movable.Item>` é removido da tela pelo Svelte (por um `{#if}`, por exemplo), o componente se encarrega de desconectar os *ResizeObservers*, limpar as instâncias do Model, remover os *event listeners* do DOM e liberar a memória automaticamente.
  * **O Componente como Contrato:** O componente `.svelte` atua como um contrato claro. Ele recebe intenções (ex: `initialPosition="50%"`) e devolve reatividade (ex: `isDragging`), encapsulando toda a sujeira da manipulação direta do DOM, interações de hardware e matemática, deixando a View do usuário puramente focada na estética.

* **Resiliência e Auto-Correção (Fail-Safe):** A API é defensiva. Em vez de lançar erros fatais (`throw new Error`) que derrubam a renderização da árvore Svelte, os componentes validam a estrutura do DOM do usuário (ex: checar se falta `position: relative`). Se algo estiver errado, eles aplicam auto-correções silenciosas ou, no máximo, emitem um `console.warn` educativo.

**A Camada "Controller/Interaction" como Ponte (Imperativo vs. Declarativo)**

* Em frameworks reativos, existe uma tensão constante entre o mundo **Declarativo** (O Estado/Model: "O item está na posição X") e o mundo **Imperativo** (O Hardware/DOM: "O mouse moveu 10 pixels", "O elemento redimensionou"). Muitas arquiteturas tentam misturar isso dentro do Componente ou do Model. A sua arquitetura cria uma entidade distinta: a **Interaction** (ex: `MovableInteraction.ts`).

  * **Não é um Controller tradicional:** O Controller no MVC clássico decide "o que mostrar". A Interaction decide "como traduzir física em estado".

  * **O Tradutor de Realidades:** A responsabilidade única da Interaction é ouvir o "ruído" do mundo real (eventos de ponteiro de alta frequência, redimensionamentos de janela, *render loops* do navegador) e destilar isso em sinais puros para o Model.

  * **Isolamento de Sujeira:** É por causa dessa camada que o seu Model permanece matematicamente puro (testável sem DOM) e sua View permanece semanticamente limpa. Toda a "sujeira" de `addEventListener`, `requestAnimationFrame` e `getBoundingClientRect` vive e morre isolada na Interaction.


Você tem toda razão. Na minha explicação anterior, eu acabei fundindo os conceitos para simplificar, mas como no nosso código nós *fisicamente separamos* os arquivos (`MovableItemController.ts` e `MovableDragInteraction.ts`), a documentação precisa refletir essa distinção com precisão cirúrgica.

Eles não são a mesma coisa. Na verdade, a separação entre eles é o que permite que sua biblioteca cresça (ex: adicionar suporte a Teclado) sem virar um espaguete de código.

Aqui está a definição corrigida e separada para a sua documentação:

**Diferenciação: Controller vs. Interaction**

* **O Controller (`MovableItemController`): O Gerente de Integridade**
  * **Papel:** É o dono da existência do elemento no espaço. Ele mantém o estado local (`currentX`, `currentY`), gerencia o ciclo de vida (iniciação e destruição), observa o ambiente (ResizeObserver) e garante a integridade estrutural (valida se o pai é o Root correto).
  * **Responsabilidade:** "Eu sei onde estou, sei qual é o meu tamanho e sei como me desenhar na tela de forma performática (rAF loop)."
  * **Natureza:** Persistente. Ele vive enquanto o componente existir.

* **A Interaction (`MovableDragInteraction`): O Adaptador de Input**
  * **Papel:** É puramente um tradutor de hardware. Ela não sabe sobre coordenadas CSS, porcentagens ou redimensionamento de janela. Ela só sabe que "o mouse desceu", "o mouse moveu" ou "o dedo levantou".
  * **Responsabilidade:** Capturar a intenção física do usuário e traduzi-la em comandos para o Controller. Ela diz ao Controller: *"O usuário quer mover para a direita"*.
  * **Natureza:** Pluggable/Substituível. Hoje você tem uma `DragInteraction` (Mouse/Touch). Amanhã você pode plugar uma `KeyboardInteraction` (Setas do teclado) no **mesmo** Controller, sem alterar uma linha da lógica de posicionamento ou renderização.

**Filosofia "Fail-Safe" (Resiliência Silenciosa)**

* A maioria das bibliotecas de desenvolvimento web adota uma postura de "Falha Rápida": se o desenvolvedor esquecer um `position: relative`, a biblioteca quebra ou o item voa para fora da tela, forçando o dev a ler a documentação. A sua arquitetura adota a filosofia **"Apple/Cocoa" de Resiliência**:

  * **Auto-Correção:** O sistema assume que o ambiente pode ser hostil (CSS mal configurado, pai estático). Em vez de falhar, a `MovableInteraction` detecta o erro e aplica correções em tempo de execução (ex: forçar `position: relative` no Root ou usar *clamping* quando o layout encolhe).

  * **Avisos Educativos:** O erro não é suprimido, mas transformado em DX. Um `console.warn` explica o problema, mas o software continua funcionando da melhor forma possível ("Best Effort").

  * **Intenção Arquitetural:** Isso define que a biblioteca prioriza a **continuidade da experiência do usuário final** acima da pureza técnica da configuração do desenvolvedor. O software não deve "crashar" por causa de um detalhe de CSS.


### Nomenclatura e Semântica (Padrão Apple)
* **Semântica de Capacidade (Movable vs Draggable):** Escolha de nomes baseados no domínio do espaço 2D e geometria (`Movable`) em vez de verbos atrelados a APIs legadas da web (`Drag and Drop` / DataTransfer).
* **Nomes descritivos na Raiz:** Arquivos e classes carregam o nome do domínio (ex: `MovableModel.ts`, `MovableItem.svelte`) para facilitar a busca (Cmd+P) e garantir segurança de namespace, mesmo que sejam exportados de forma limpa na API pública.
* **Separação de Controller e Interaction:** 
  * `Controller`: Gerencia o ciclo de vida, layout no DOM, e validações estruturais.
  * `Interaction`: Funciona como um adaptador de input (ex: Mouse, Touch, ou futuro Teclado), focado apenas em ouvir o hardware e avisar o Controller/Model.

### Gerenciamento de Estado (Svelte 5)
* **`$derived` como API Pública:** Estados expostos pelo Model para as Views são definidos como runas `$derived` (sinais cacheados) em vez de *Getters* tradicionais. Isso garante uma API estável e evita recálculos custosos em múltiplos componentes lendo a mesma propriedade.
* **Separação entre Domínio e Apresentação:** O Model usa nomes de domínio estritos (`step`, `isFinished`). A View faz a tradução para nomes de apresentação agnósticos (ex: `isBouncing = $derived(model.step === 1)`). O Model jamais sabe que uma animação ou cursor existe.

### Física, Matemática e Geometria
* **Cálculo de Delta Absoluto:** Movimentos são calculados baseados na diferença entre o clique inicial (`dragStart`) e a posição atual do ponteiro, eliminando a "deriva" (*drift*) e o acúmulo de erros de ponto flutuante gerados por `event.movementX/Y`.
* **Sistema de Coordenadas Cartesiano Único:** Padronização matemática usando `x, y, width, height` (AABB - Axis-Aligned Bounding Box) em todo o software, referenciado sempre a partir do `Movable.Root`, ignorando a árvore DOM intermediária.
* **Colisão por Projeção (Phantom Rect):** A detecção de colisão não verifica onde o cursor do mouse está, mas sim projeta matematicamente onde as bordas do elemento estarão e verifica a interseção com os *Targets*.
* **Smart Anchor (Responsividade de Estado Duplo):** 
  * *Estado Virgem:* Se a tela redimensionar antes do usuário interagir, o item recalcula sua posição percentual mantendo-se responsivo como CSS puro.
  * *Estado Sujo:* Se o usuário já moveu o item, a posição vira absoluta (pixels), mas aplica-se um *clamp* (restrição matemática) para garantir que ele não seja engolido se a janela diminuir.

### Performance e Hardware
* **Decoupling de Renderização (rAF):** O processamento lógico (alta frequência do mouse, até 1000Hz) foi separado da renderização do DOM. O estilo visual (`transform`) só é atualizado sincronizado com a taxa de atualização do monitor via `requestAnimationFrame`.
* **Gestão Inteligente de VRAM (GPU):** A propriedade `will-change: transform` não fica ativa o tempo todo. Ela é adicionada antecipadamente no `pointerenter` (hover) para garantir zero latência, e removida no `pointerleave` ou `onEnd` para evitar o esgotamento de memória de vídeo (VRAM) em telas com muitos itens.
* **Captura de Ponteiro (Pointer Capture):** Uso de `setPointerCapture` para garantir que eventos de movimento e soltura não se percam caso o usuário mova o mouse rápido demais para fora do elemento ou da janela do navegador.

### UI / UX (Experiência do Usuário Final)
* **Isolamento de Animações (Anti-Transform Clash):** Solucionada a briga pelo controle do CSS `transform`. O "Shell" invisível controlado pelo JS lida com as coordenadas (Física), enquanto o conteúdo interno lida com animações flutuantes (Decoração).
* **Congelamento Automático (`animation-play-state: paused`):** Uso estratégico de `:global(*)` atrelado a um `data-dragging` no Shell para congelar animações CSS instantaneamente quando o item é agarrado, fazendo com que ele pareça "sólido" na mão do usuário (suprimindo linters como o Biome.js em prol da DX de "Zero Configuração").
* **Delegação Visual de Acessibilidade:** O Shell nativo cuida de ser focável por teclado (`role="button"`, `tabindex="0"`), mas o `outline` nativo do navegador é removido. O estado `isFocused` é passado para o *child* para que o design system do usuário renderize o anel de foco de forma customizada e harmoniosa.











---















# Arquitetura do Sistema Movable: Um Estudo de Caso em Design de UI Resiliente

## Parte I: Fundamentos e Filosofia
**Capítulo 1: O Paradigma da Invisibilidade**
*   1.1. A filosofia "Apple-like": Fluidez, Segurança e Semântica.
*   1.2. A Regra do Fail-Safe: Por que o software nunca deve "crashar" por CSS incorreto.
*   1.3. MVC no Frontend Moderno: Revisitando Model-View-Controller na era da Reatividade Fina.

## Parte II: A Camada de Apresentação (View)
**Capítulo 2: O Componente como Contrato Declarativo**
*   2.1. Views "Burras" (Dumb Views): Análise de `MovableItem.svelte` e a ausência de lógica de negócios.
*   2.2. O Padrão de Shell Invisível: Modificadores lógicos vs. Wrappers estruturais.
*   2.3. Fronteiras Lógicas: O papel do `MovableRoot.svelte` como demarcação de contexto, não de layout.

**Capítulo 3: Polimorfismo e Inversão de Controle**
*   3.1. O Dilema Velocidade vs. Controle.
*   3.2. Implementando o Padrão `asChild`: A anatomia dos *snippets* no Svelte 5.
*   3.3. Estudo de Caso: Resolvendo conflitos de `z-stack` e Grid Layout no `HomeHero` via injeção de slots.

## Parte III: O Domínio e a Verdade (Model)
**Capítulo 4: Gestão de Estado Centralizada**
*   4.1. O Model como Fonte Única da Verdade: Dissecando `MovableModel.svelte.ts`.
*   4.2. Runas e Reatividade Fina: O uso de `$state` e `$derived` para APIs públicas estáveis.
*   4.3. Semântica de Domínio vs. Semântica de Apresentação: Por que o Model expõe `step` e a View consome `isBouncing`.

**Capítulo 5: Física e Geometria**
*   5.1. O Sistema de Coordenadas Unificado (Cartesiano AABB).
*   5.2. Detecção de Colisão Funcional: O desacoplamento entre o evento de input e o cálculo matemático.
*   5.3. A Estratégia de "Smart Anchor": Resolvendo posições relativas e absolutas em layouts responsivos.

## Parte IV: A Fronteira Imperativa (Controller & Interaction)
**Capítulo 6: O Controller como Gerente de Integridade**
*   6.1. Ciclo de Vida e DOM: O papel de `MovableItemController.ts`.
*   6.2. Validação Estrutural: Detectando e corrigindo erros de `offsetParent` em tempo de execução.
*   6.3. O Loop de Renderização: Desacoplando Lógica (Input) de Pintura (rAF) para performance em 60fps.

**Capítulo 7: Abstração de Hardware (Interaction)**
*   7.1. Isolando a "Sujeira" do Mundo Real: `MovableDragInteraction.ts`.
*   7.2. Pointer Capture e Cursor Management: Garantindo a continuidade da UX.
*   7.3. Preparando para o Futuro: Como a arquitetura aceita `KeyboardInteraction` sem refatorar o Controller.

## Parte V: Padrões Transversais e DX
**Capítulo 8: Design de API e Ergonomia**
*   8.1. *Dot Notation Exports*: Organização de namespace e descoberta de API.
*   8.2. Hooks de Contexto: O padrão `Movable.use()` para acesso profundo sem *prop drilling*.
*   8.3. Tipagem Defensiva: O uso de TypeScript para guiar a implementação correta dos *snippets*.

**Apêndice A: Glossário Arquitetural**
*   Definições canônicas de *Shell*, *Interaction*, *Controller* e *Sensor* no contexto do Movable.