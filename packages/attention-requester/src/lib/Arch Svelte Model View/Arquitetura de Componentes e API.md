# Notas Internas: Arquitetura de Componentes e API (DX)

*Este documento consolida as decisões arquiteturais da bibliotec. Ele serve como guia de princípios para futuras implementações, garantindo a consistência com a filosofia Apple/Radix/Svelte 5 adotada.*

---

## 1. Visões (Views) e Nomenclatura

*   **Tudo é View:** Não há distinção arquitetural entre "Páginas" e "Componentes". Todos são tratados estruturalmente como Views.
*   **Views são "Burras" (Dumb Views):** Elas não tomam decisões de negócio. Sua única responsabilidade é renderizar o estado e capturar a intenção do usuário.
*   **Nomes Agnósticos na UI:** As Views usam nomenclaturas internas estritamente ligadas à apresentação (ex: `isHeroSubtle`, `isBouncingRight`), nunca jargões de negócio. A View atua como "tradutora", mapeando a verdade do Model (`model.isFinished`) para seu próprio idioma visual.

---

## 2. Models, Serviços e Injeção de Dependência

*   **Models como Fonte da Verdade:** Os Models contêm tanto o estado da aplicação quanto as regras de negócio que modificam esse estado.
*   **Sem Singletons Globais:** A arquitetura repudia *singletons* globais na memória. Instâncias de Models são criadas e injetadas na árvore de componentes utilizando Svelte Contexts (ex: `<Movable.Root>`), garantindo isolamento (múltiplas instâncias podem coexistir sem conflito).
*   **Estados Públicos via `$derived`:** Propriedades expostas pelo Model para as Views são definidas como sinais cacheados (`$derived`), garantindo uma API de leitura estável, performática e reativa.
*   **Delegação para Serviços/Interactions:** Quando uma regra de negócio é muito complexa, extensa ou interage com elementos externos (como a ponte com eventos de hardware do mouse/teclado), ela é extraída do componente para um "Serviço". Serviços recebem nomes baseados no seu caso de uso (ex: `MovableDragInteraction` para lidar com os *pointer events* físicos).

---

## 3. Padrão Polimórfico (`asChild`): Abertura Progressiva

O padrão `asChild` resolve o dilema fundamental da DX: **Velocidade vs. Controle**.

### Caminho 1: O Padrão (Shell Seguro)
Se o desenvolvedor apenas injetar conteúdo, o componente renderiza um invólucro padrão (um `<div>` invisível).
*   **Função:** Assume o trabalho sujo: acessibilidade (`role`, `tabindex`), estilos vitais e física.
*   **Uso:** Rota "Plug and Play", ideal para 80% dos casos rápidos.

### Caminho 2: A Rota de Fuga (Inversão de Controle)
Permite que o componente "desista" de renderizar sua própria tag HTML e passe seus poderes (ações brutas e estados) para a tag do usuário via *snippet*.
*   **Função:** Evita conflitos de layout (Wrapper Hell) em grids complexos ou SVGs.
*   **Benefício Arquitetural:** Garante a regra de ouro: *"Seja invisível por padrão, mas saia da frente quando requisitado"*.

---

## 4. Design de API e Experiência do Desenvolvedor (DX)

*   **Design Declarativo:** Prioriza componentes declarativos (ex: `<Movable.Item>`) que encapsulam a complexidade. Ações brutas (`use:action`) são detalhes de implementação expostos apenas como rotas de escape.
*   **Dot Notation Exports:** Componentes exportados sob um namespace unificado (ex: `<Movable.Root>`, `<Movable.Item>`) para melhor autocompletar e clareza semântica.
*   **Wrappers "Invisíveis" (Zero Styling):** O Shell fornecido não opina no visual. Usa `display: flex; width: max-content`, deixando que o conteúdo filho dite o tamanho e a estética.
*   **Shells como "Modificadores Lógicos":** O Shell não deve ser visto como uma "caixa", mas como um **View Modifier do SwiftUI** (ex: `.draggable()`) aplicado via sintaxe de componente. Ele concede superpoderes (física, captura) à View filha sem aprisioná-la visualmente.
*   **Injeção de Estado via Snippets:** Estados efêmeros (`isDragging`, `isFocused`) são passados de volta para o usuário via parâmetros do snippet, eliminando a necessidade de variáveis de controle no `<script>`.
*   **Acesso Profundo (Context Hooks):** Atalhos como `Movable.use()` permitem que componentes isolados (ex: HUD) leiam o estado global sem *prop drilling*.
*   **Contextos como Fronteiras Lógicas:** O `<Movable.Root>` não é um elemento visual, mas uma demarcação na árvore onde o Model passa a existir. Qualquer View declarada dentro dessa fronteira (geograficamente no código) pode consumir o estado.
*   **Ciclo de Vida Delegado:** Componentes `.svelte` gerenciam automaticamente a conexão/desconexão de *observers* e *listeners*, prevenindo vazamentos de memória.

---

## 5. Arquitetura Interna: A Camada de Interação

Em vez de misturar lógica imperativa (DOM) com declarativa (Model), criamos uma barreira sanitária: **Interaction**.

### Diferenciação: Controller vs. Interaction

*   **O Controller (`MovableItemController`): O Gerente de Integridade**
    *   **Papel:** Dono da existência do elemento no espaço.
    *   **Responsabilidade:** Mantém o estado local (`x`, `y`), gerencia o ciclo de vida, observa redimensionamentos e garante a integridade estrutural (valida o pai). Sabe "onde está" e "como se desenhar".
    *   **Natureza:** Persistente. Vive enquanto o componente existir.

*   **A Interaction (`MovableDragInteraction`): O Adaptador de Input**
    *   **Papel:** Tradutor de hardware. Não sabe sobre CSS ou coordenadas.
    *   **Responsabilidade:** Ouve o ruído do mundo real (mouse down, move) e traduz em comandos de intenção para o Controller ("mover para direita").
    *   **Natureza:** Pluggable. Permite trocar Mouse por Teclado sem alterar a lógica do Controller.

> **Resumo:** A **Interaction** dirige, o **Controller** é o veículo, e o **Model** é o mapa.

---

## 6. Filosofia "Fail-Safe" (Resiliência Silenciosa)

Ao contrário da postura de "Falha Rápida" comum na web, adotamos a filosofia **"Apple/Cocoa"**:

1.  **Auto-Correção:** O sistema assume que o ambiente pode ser hostil (ex: CSS mal configurado). A `Interaction` detecta erros e aplica correções em tempo de execução (ex: forçar `position: relative` no Root ou *clamping* ao redimensionar).
2.  **Avisos Educativos:** Erros viram avisos no console (`console.warn`) explicando o problema, mas o software continua funcionando no modo "Best Effort".
3.  **Prioridade:** A continuidade da experiência do usuário final está acima da pureza técnica da configuração do desenvolvedor. O software não deve "crashar" por detalhes de CSS.

---

## Decisões a adicionar ao documento

------

### Para a seção 2 (Models)

**`$state` privado + `$derived` público é o padrão de encapsulamento de estado.** Campos mutáveis são declarados com `#campo = $state()` (privados nativos do JS, não convenção). A superfície pública é sempre `readonly campo = $derived(this.#campo)` — imutável de fora, reativa de dentro. Mudar a implementação interna nunca quebra consumidores externos.

**O Model é o único lugar onde regras de negócio vivem.** O Controller nunca toma decisões — ele executa ordens. Uma violação concreta que foi corrigida: o Controller lia `animation.onInterrupt` e decidia o comportamento. A correção foi mover essa lógica para um `$derived` no Model (`pauseIntent`) que retorna uma intenção tipada (`freeze | resume | discard`). O Controller faz switch na intenção sem saber como ela foi resolvida.

**Intenções tipadas em vez de booleans.** Quando um estado pode resultar em comportamentos qualitativamente diferentes, o Model expõe uma union discriminada (`PauseIntent`) em vez de um boolean. O Controller recebe a ordem completa, incluindo parâmetros (`interval`), sem precisar inferir nada.

------

### Para a seção 5 (Controller)

**O Controller resolve o alvo real de forma lazy.** O wrapper do componente pode ser `display: contents` — sem caixa de layout. O Controller não anima o wrapper; anima `wrapper.children[0]`. A resolução é feita na primeira operação, não na construção, porque o slot pode não estar populado no momento em que o Controller é instanciado.

**`$state` no componente para variáveis que o Controller depende.** Se uma variável como `controller` ou `el` precisa disparar `$effect`, ela deve ser declarada com `$state`. Declarar sem `$state` cria uma dependência silenciosa que nunca reexecuta.

------

### Nova seção: Animações Plugáveis

**Animações são objetos de dados, não comportamento.** O componente é agnóstico de animações. Uma animação declara `name`, `duration`, `keyframes`, `loop`, `interval` e `onInterrupt` — nada mais. O componente cuida do *quando*; a animação cuida do *como*.

**Keyframes podem ser funções.** Quando uma animação precisa de contexto do elemento no momento do disparo (posição atual, dimensões), `keyframes` é declarado como `(el: HTMLElement) => Keyframe[]`. O Controller invoca a função imediatamente antes de `element.animate()`. Isso permite animações que partem do estado atual do elemento — necessário para o modo `discard`.

**O contrato de loop é tipado como union discriminada.** `ARAnimationLoop` exige `loop: true` e `interval: number`. `ARAnimationOneShot` proíbe `interval`. TypeScript enforça o contrato na criação da animação, não em runtime. Fábricas de animação (como `PhysicsBounce`) usam overloads para retornar o tipo correto baseado nos parâmetros — emulando os `init` distintos do Swift.

**`onInterrupt` pertence à animação, não ao componente.** É uma propriedade do contrato de movimento — `resume` para elementos com posição fixa (Dock), `discard` para elementos flutuantes (Movable). O componente não sabe qual modo está ativo; o Model lê e decide.

------

### Para a seção 4 (DX)

**`bind:this` com métodos exportados é o padrão de API imperativa.** Em vez de uma prop `ref` com `$bindable` (padrão React transplantado), componentes Svelte 5 exportam funções diretamente e o pai acessa via `bind:this`. Segue a intuição de `element.animate()` e `input.focus()` — imperativo, direto, sem abstração inventada. O tipo da instância é exportado com o mesmo nome do componente (`AttentionRequester`).

**Parâmetros de configuração pertencem à chamada imperativa, não às props.** `animation` e `loop` saíram das props e foram para `request(animation)`. O componente não tem opinião sobre o movimento até o momento do comando — o mesmo item pode receber animações diferentes em chamadas sucessivas sem reconfiguração.

------

### Para a seção 3 (asChild)

**`display: contents` é o wrapper correto para componentes de comportamento puro.** Componentes sem semântica própria (que só concedem superpoderes ao filho) usam `display: contents`. O wrapper `flex + max-content` é reservado para casos onde o wrapper precisa ser um ponto de ancoragem real (`position: relative`, `overflow: hidden`). A distinção é: o wrapper precisa *existir* no layout, ou só precisa *existir* no DOM?

**Props mutuamente exclusivas são tipadas com union + `never`.** `children` e `asChild` não podem coexistir. A exclusividade é uma propriedade do tipo, não uma validação de runtime: `{ children: Snippet; asChild?: never } | { asChild: Snippet<[...]>; children?: never }`.

------

### Nova seção: Web Animations API

**WAAPI é preferida sobre CSS animations para componentes com estado.** `animation.pause()` e `animation.currentTime` tornam requisitos como pausa exata e retomada operações de uma linha — frágeis com CSS puro. O engine é o mesmo; a diferença é controle imperativo vs. declarativo.

**`fill: 'none'` é obrigatório.** Impede estado residual da animação no elemento após o ciclo terminar. O elemento retorna à posição CSS base automaticamente.

**`will-change` é gerenciado pelo Controller, não pelo CSS.** Setar `will-change` estaticamente desperdiça memória de GPU em elementos que ficam idle a maior parte do tempo. O Controller promove antes do ciclo e libera no `finish`.

**A propriedade CSS `translate` é separada de `transform`.** Usar `translate` nos keyframes da WAAPI não interfere com `transform: translate3d()` usado por sistemas de posicionamento como o Movable — as duas propriedades coexistem e se compõem. Isso é intencional e deve ser mantido.