# Checklist de Conformidade (§14)

> Parte da [Svelte Model View Architecture](Architecture.md).
> Referencia também: [Testing](Testing.md) · [Logging](Logging.md) · [Dev Pages](Dev%20Pages.md) · [Accessibility](Accessibility.md)

---

Use este checklist para avaliar se um pacote UI segue a arquitetura MV. Nem todos os itens se aplicam a todos os pacotes — marque **N/A** quando o item não for relevante (ex: Interaction não existe em componentes sem input de hardware).

### Model (§2)
- [ ] Toda lógica de negócio vive no Model — Controller tem zero tomada de decisão
- [ ] Estado mutável usa `#field = $state()` (privado nativo JS, não convenção)
- [ ] Estado público usa `readonly field = $derived(this.#field)`
- [ ] Usa `$state.snapshot()` apenas ao passar estado para fora do contexto reativo (libs externas, serialização, `===`); nunca dentro de `$derived`, `$effect` ou template
- [ ] Comportamentos qualitativamente diferentes usam union discriminada, não boolean
- [ ] Sem singletons globais — instâncias injetadas via Context (multi-componente) ou internas (autocontido)
- [ ] Lógica complexa ou externa extraída para Serviços (Controller, Interaction) ou Utils (funções puras)
- [ ] Variantes com contratos incompatíveis usam unions discriminadas + overloads de fábrica (emulação de `init` distintos do Swift)

### Controller (§3)
- [ ] Nunca toma decisões de negócio — apenas executa ordens do Model
- [ ] Elemento-alvo resolvido de forma lazy (`wrapper.children[0]`), não na construção
- [ ] `will-change` não é gerenciado imperativamente — WAAPI promove camadas automaticamente
- [ ] Variáveis que disparam `$effect` declaradas com `$state`
- [ ] Gerencia ciclo de vida: cleanup de observers e listeners na destruição
- [ ] Comunicação Model→Controller é por observação de estado (`$effect`), nunca command-dispatch interno
- [ ] Instanciado dentro de `$effect` no `<script>` do componente (ownership reativo garantido)
- [ ] Nenhum `$effect` no template roteia estado do Model para o Controller — o Controller observa o Model internamente
- [ ] `destroy()` trata apenas cleanup imperativo (WAAPI, rAF, observers, timers); cleanup reativo é automático
- [ ] Primitivos reativos justificados: todo `$effect` é side effect de DOM ou sync com sistema externo (nunca derivação de estado); `untrack()` tem comentário explicando por que o valor não é dependência; `$effect.root` tem `destroy()` chamado no método `destroy()` do objeto dono; efeitos aninhados não criam ciclos de leitura/escrita na mesma dependência

### Interaction (§4)
- [ ] Responsabilidade única: traduzir hardware em comandos para o Model
- [ ] Comunica-se exclusivamente com o Model — nunca referencia ou chama o Controller
- [ ] Fluxo de dados: Interaction → Model → Controller
- [ ] Plugável — pode ser substituída sem alterar Controller ou Model
- [ ] Não sabe sobre CSS, coordenadas ou renderização
- [ ] Toda "sujeira" imperativa (`addEventListener`, `rAF`, `getBoundingClientRect`) isolada aqui

### View (§1)
- [ ] Zero lógica de negócio — apenas renderiza estado e captura intenção do usuário
- [ ] Lógica de apresentação (mapear estado do Model para nomes visuais) é permitida e esperada
- [ ] Usa nomes de apresentação locais, não nomes de domínio do Model
- [ ] Estado efêmero passado via parâmetros de snippet

### API Surface (§5)
- [ ] Exports usam flat named exports com padrão `[Domain][Role]` (ex: `MovableContext`, `MovableItem`)
- [ ] API imperativa via `bind:this` com métodos exportados (não prop `ref`)
- [ ] Tipo da instância exportado com o mesmo nome do componente
- [ ] Parâmetros que variam entre chamadas pertencem à chamada imperativa; fixos por instância podem ser props
- [ ] `asChild` disponível com tipagem union + `never` para exclusividade com `children` — usado apenas como escape hatch de layout, não para acesso a estado
- [ ] Estado efêmero acessível via snippet em ambos os caminhos (`children` e `asChild`)
- [ ] `display: contents` como padrão para Modifiers; `flex + max-content` apenas quando necessário (documentar motivo)
- [ ] Restrição `asChild`: não viável quando filho direto é componente Svelte (actions exigem elemento DOM)
- [ ] Context (`[Domain]Context`) usado como fronteira lógica invisível (sem tag HTML) em ecossistemas multi-componente
- [ ] Componentes `.svelte` delegam ciclo de vida automaticamente (cleanup de observers, listeners, Model)

### Animações (§6) — quando aplicável
- [ ] Animações são objetos de dados (nome, duração, keyframes, loop, onInterrupt), não comportamento
- [ ] WAAPI preferida sobre CSS animations para componentes com estado
- [ ] `fill: 'none'` obrigatório — sem estado residual
- [ ] `will-change` não é gerenciado imperativamente pelo Controller — WAAPI promove camadas automaticamente; CSS estático apenas se houver problema de performance medido
- [ ] Propriedade CSS `translate` usada em keyframes (não `transform`) para evitar clash com posicionamento
- [ ] Contratos tipados como unions discriminadas (ex: loop vs one-shot)

### Resiliência (§7)
- [ ] Auto-corrige ambientes hostis (ex: `position: relative` ausente no Context)
- [ ] Erros são `console.warn` educativo, nunca crash (`throw`)
- [ ] Continuidade da UX do usuário final priorizada sobre pureza técnica

### Performance (§8) — quando aplicável
- [ ] Sistema de coordenadas unificado (AABB) referenciado ao Context
- [ ] Delta absoluto para movimentos (sem `movementX/Y`)
- [ ] Renderização desacoplada via `requestAnimationFrame`
- [ ] `will-change` não gerenciado imperativamente — para WAAPI o browser promove automaticamente; para `rAF` + estilo direto, CSS estático se necessário
- [ ] `setPointerCapture` para continuidade em movimentos rápidos
- [ ] Animações de posição (`transform`) e decorativas (`translate`) não conflitam

### Nomenclatura (§9)
- [ ] Arquivos prefixados com nome do domínio do pacote
- [ ] Sufixos seguem convenção: `Model.svelte.ts`, `Controller.svelte.ts`, `Modifier.svelte`, `[domain].types.ts`, `index.ts`
- [ ] Nomes baseados em capacidade/domínio, não em APIs legadas da web

### Testes (§10)
- [ ] Behavioral Spec exaustivo: todo estado, transição, edge case e invariante descrito antes da implementação
- [ ] Testes automatizados do Model organizados por seção do Spec (ex: `§2.1`, `§2.3`)
- [ ] Um arquivo de teste por Model
- [ ] Pure functions extraídas de Controllers/Interactions com testes automatizados próprios
- [ ] Zero testes automatizados de UI — verificação visual via dev page
- [ ] Code review via CodeRabbit (`/coderabbit:review`) executado no terminal antes de abrir o PR

### Logging (§11)
- [ ] Logs de debug permanentes no código, guardados por `DEV` do `esm-env`
- [ ] `console.warn` para uso incorreto da API e auto-correções (sempre presente)
- [ ] `console.error` para falhas inesperadas (sempre presente)
- [ ] Prefixo `[Package:Layer]` em todos os logs
- [ ] Nenhum log dentro de animation frame callbacks ou event handlers de alta frequência
- [ ] `performance.mark()` / `Animation.id` para instrumentação de animações (não `console.log`)
- [ ] Sem biblioteca de logging externa

### Dev Pages (§12)
- [ ] Dev page dedicada com `index.html` + `vite.config.ts` + `src/dev/`
- [ ] Cenários visuais com labels, controles para API pública, log panel, state inspector
- [ ] Alias `dev:<name>` no root `package.json`
- [ ] Smoke test visual como último passo antes de completar feature/fix

#### Guided QA (§12)
- [ ] Steps definidos como array de `QAStep` com todos os campos obrigatórios
- [ ] Cada step tem título numerado, instrução em linguagem simples, `expectedLogs` e `humanChecklist`
- [ ] Disclosure progressiva: controls de steps futuros não acessíveis antes do "Next →"
- [ ] `qaLog(step, event)` emite para `console.log` E para o log panel com prefixo `[Package][step:N]`
- [ ] `humanChecklist` contém apenas itens não capturáveis por logs (qualidade visual, subjetivo)
- [ ] Modo livre e Guided QA coexistem via toggle na mesma dev page

### Acessibilidade (§13)
- [ ] `prefers-reduced-motion` respeitado (animação desabilitada ou simplificada)
- [ ] Nenhuma animação pisca > 3Hz
- [ ] Animação não bloqueia interação
- [ ] Alternativa completa via teclado para interações de drag/mouse (quando aplicável)
- [ ] ARIA roles e attributes para drag (quando aplicável)
- [ ] Anúncio de estado via `aria-live` (quando aplicável)
- [ ] Processo de 5 steps executado: Svelte warnings → axe-core → keyboard-only → VoiceOver → reduced-motion

### Performance (§8) — adições
- [ ] Animações usam exclusivamente propriedades compositor-friendly (`translate`, `transform`, `opacity`, `scale`, `rotate`)
- [ ] Drag/posicionamento via `translate` ou `transform: translate()`, nunca `top`/`left`
- [ ] Bundle size monitorado via `size-limit`
- [ ] Benchmarks de Model/Utils via `vitest bench` para detectar regressões
