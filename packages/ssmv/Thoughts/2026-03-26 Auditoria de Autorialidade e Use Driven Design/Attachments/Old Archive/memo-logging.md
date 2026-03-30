# Memo: Logging Strategy for MV Architecture Packages

## The Questions

1. Logs demais impactam performance — quanto?
2. Ficar adicionando e tirando logs manualmente a cada bug?
3. Tem como deixar logs fixos no código, ativos só em dev, e zero em produção?
4. Quais são as boas práticas da indústria?

## Short Answer

**Sim, existe um padrão maduro e amplamente usado: logs ficam permanentemente no código-fonte, são eliminados automaticamente em produção pelo build, e em dev você controla quais ver.** Você nunca mais adiciona/remove logs — eles fazem parte do código como qualquer outra linha.

---

## 1. Performance: Quanto `console.log` custa de verdade?

### O custo real

`console.log` é **síncrono** — bloqueia a thread principal enquanto serializa e envia o dado para o DevTools. Em benchmarks, um loop com log por iteração é ~2000x mais lento que sem.

**Mas o contexto importa:**
- Algumas dezenas de logs por interação do usuário? **Imperceptível.**
- Logs dentro de `requestAnimationFrame`, event handlers de alta frequência (scroll, mousemove), ou callbacks de Animation? **Catastrófico.** Cada log compete com o frame budget de 16ms.

### A regra prática

| Onde | Log seguro? |
|---|---|
| Transições de estado (request, cancel, pause) | ✅ Sim — acontecem raramente |
| Lifecycle (mount, destroy, configure) | ✅ Sim — uma vez por instância |
| Dentro de animation frame / finish callback | ⚠️ Com cuidado — apenas erros |
| Per-frame ou per-tick | ❌ Nunca |

**Conclusão:** O impacto de performance não vem de *ter* logs, vem de *onde* eles executam. Logs em transições de estado são gratuitos na prática.

---

## 2. O padrão "Never Remove Logs" — como funciona

A prática madura é: **logs são infraestrutura permanente do código, não ferramenta temporária de debug.**

### O conceito de Log Levels

```
error  →  Algo quebrou, precisa de atenção imediata
warn   →  Algo inesperado mas o sistema se recuperou
info   →  Evento significativo de lifecycle/estado
debug  →  Detalhe interno útil para diagnóstico
trace  →  Tudo, máximo detalhe (raramente usado)
```

Cada nível inclui todos acima dele. Se você ativa `debug`, vê debug + info + warn + error.

### Como isso funciona na prática

```typescript
// Estes logs ficam PERMANENTEMENTE no código-fonte:
logger.debug('[AR:Model] State transition', { from: 'idle', to: 'animating' });
logger.debug('[AR:Controller] Starting cycle', { animation: config.name });
logger.warn('[AR:Controller] No child element found — animating wrapper');
logger.error('[AR:Controller] Animation failed', { error });
```

- **Em produção:** `debug` e `info` são eliminados pelo build. Literalmente não existem no bundle. Zero custo.
- **Em desenvolvimento:** Todos os níveis ativos, ou você filtra por namespace no console.
- **Em debug de produção:** `warn` e `error` continuam presentes e visíveis.

---

## 3. Como eliminar logs em produção (Vite/SvelteKit)

Existem **três abordagens**, da mais simples à mais sofisticada. Para o projeto atual, a primeira é suficiente.

### Abordagem A: `import.meta.env.DEV` (recomendada para vocês)

Vite substitui `import.meta.env.DEV` por `true` em dev e `false` em produção **em tempo de build**. O minifier (esbuild) então elimina o branch morto — dead code elimination.

```typescript
if (import.meta.env.DEV) {
  console.log('[AR:Model] State transition', { from, to });
}
```

**Em produção, o bloco inteiro desaparece do bundle.** Zero bytes, zero custo.

**Prós:**
- Zero dependências, zero config
- Funciona nativamente com Vite/SvelteKit
- Garantia de eliminação pelo build system (não é otimização opcional)

**Contras:**
- Verboso se usado centenas de vezes (cada log precisa do `if`)
- Sem namespaces nativos (você resolve com prefixos string: `[AR:Model]`)

### Abordagem B: Micro-utilitário próprio (~20 linhas)

Encapsula o padrão acima num helper tipado:

```typescript
// lib/logger.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

function createLogger(namespace: string) {
  const prefix = `[${namespace}]`;
  return {
    debug: (...args: unknown[]) => {
      if (import.meta.env.DEV) console.debug(prefix, ...args);
    },
    info: (...args: unknown[]) => {
      if (import.meta.env.DEV) console.info(prefix, ...args);
    },
    warn: (...args: unknown[]) => console.warn(prefix, ...args),
    error: (...args: unknown[]) => console.error(prefix, ...args),
  };
}

// Usage:
const log = createLogger('AR:Model');
log.debug('State transition', { from: 'idle', to: 'animating' });
log.warn('Unexpected re-entrancy during cancel');
```

**Prós:**
- Limpo, DRY, tipado
- Namespaces automáticos
- `warn`/`error` sempre presentes; `debug`/`info` eliminados em prod

**Contras:**
- O minifier *pode* não eliminar as chamadas a `debug()` se não conseguir provar que são pure. Solução: marcar com `/*#__PURE__*/` ou usar a Abordagem C.

### Abordagem C: `esbuild.drop` no Vite config

```typescript
// vite.config.ts
export default defineConfig({
  esbuild: {
    drop: ['console'],        // Remove TODOS os console.*
    // Ou mais cirúrgico:
    pure: ['console.debug', 'console.log'],  // Remove só debug/log
  },
});
```

**Prós:**
- Funciona com `console.log` direto, sem wrappers
- 100% garantido pelo build

**Contras:**
- `drop: ['console']` remove *todos* os console, incluindo warn/error que você pode querer em prod
- `pure: [...]` é mais cirúrgico mas precisa que cada chamada não tenha side effects

### Recomendação para o projeto

**Comece com a Abordagem A** (`import.meta.env.DEV` direto). Se/quando a quantidade de logs justificar, evolua para a **Abordagem B** (micro-utilitário). A Abordagem C é backup se precisar de eliminação mais agressiva.

---

## 4. Bibliotecas populares — e por que provavelmente não precisam de nenhuma

### `debug` (77M downloads/semana)
- O padrão de facto para Node.js e browser
- Filtragem por namespace via `localStorage.debug = 'ar:*'`
- Não faz tree-shaking bem — toda a lib vai pro bundle mesmo se desabilitada

### `loglevel` (1.4KB gzip)
- Minimalista, API de níveis (debug/info/warn/error)
- Persistência de nível configurado via localStorage
- Sem namespaces nativos

### `consola` (by UnJS)
- Output formatado e bonito, reporters customizáveis
- Mais voltada para server/CLI do que browser

### `pino` (browser build)
- Logging estruturado (JSON), ótimo para observability
- Overkill para component libraries

### Veredicto

Para **uma component library self-contained** como o Attention Requester, **nenhuma biblioteca externa se justifica**:

1. Vocês não precisam de logging estruturado (não enviam logs para um serviço)
2. O bundle size importa (é uma lib que outros consomem)
3. `import.meta.env.DEV` + prefixos string dá 95% do valor com 0 bytes de overhead
4. Se precisar de mais, 20 linhas de utilitário próprio cobrem os 5% restantes

Bibliotecas como `debug` fazem sentido em **aplicações** com dezenas de módulos onde a filtragem por namespace em runtime é essencial. Para packages isolados, é dependência desnecessária.

---

## 5. O que logar em cada camada MV

### Model (pure state)

```
debug  Transições de estado: idle→animating, animating→idle
debug  Dados recebidos no configure(): animation name, loop, strategy
warn   Re-entrância: request() chamado enquanto já ativo
warn   Operação ignorada: cancel() em idle, pause() em idle
```

Estes logs são valiosos porque o Model é onde a lógica de decisão vive. Se o comportamento está errado, os logs do Model mostram *o que o sistema decidiu fazer* vs. o que deveria.

### Controller (DOM orchestrator)

```
debug  Início/fim de ciclo de animação
debug  Interrupt resolution aplicada (resume/discard)
debug  Elemento alvo resolvido (child vs. wrapper)
warn   Nenhum child element encontrado (já existe esse warn)
error  Falha inesperada na animação
```

Logs do Controller mostram *o que foi executado*. Combinados com os do Model, você tem o fluxo completo: "Model decidiu X → Controller executou Y".

### View (Svelte component)

```
debug  Mount/unmount do componente
debug  Props recebidas/alteradas
```

Minimal — a View deve ter pouca lógica, portanto poucos logs.

---

## 6. Filtragem no DevTools (sem biblioteca)

Mesmo sem lib, o Chrome DevTools já oferece filtragem poderosa:

- **Por nível:** Os botões Verbose/Info/Warnings/Errors no console filtram `console.debug`/`console.info`/`console.warn`/`console.error`
- **Por texto:** O campo de filtro aceita texto e regex: digitar `[AR:Model]` mostra só logs do Model
- **Negação:** `-[AR:Controller]` esconde logs do Controller
- **Por URL/source:** Pode filtrar por arquivo de origem

Ou seja, se seus logs usam prefixos consistentes como `[AR:Model]`, `[AR:Controller]`, `[AR:View]`, você já tem filtragem por namespace de graça.

---

## Blind Spots & Things to Consider

1. **`import.meta.env.DEV` é do Vite, não do TypeScript.** Se alguém consumir o pacote fora de um ambiente Vite (raro, mas possível), os guards não funcionam. Para libraries publicadas no npm, considere compilar a lib com os logs já removidos, ou usar `process.env.NODE_ENV` que é mais universal.

2. **Logs são documentação executável.** Um `log.debug('State transition', { from, to })` num Model comunica para quem lê o código: "esta é uma transição de estado significativa." Não subestime esse valor — logs bem posicionados tornam o código mais legível, não menos.

3. **O `console.warn` que já existe no Controller** (linha 36: "No child element found") é um excelente exemplo do padrão correto: é um warning que deve existir em produção porque indica uso incorreto da API pelo consumidor.

4. **Performance.mark() e performance.measure()** são alternativas superiores para medir timing de animações. Em vez de logar "animation started" / "animation ended" e calcular na cabeça, use a Performance API — os resultados aparecem no Performance tab do DevTools com timeline visual. Considere isso para o Controller.

5. **`Animation.id`** — a Web Animations API permite setar um `id` em cada Animation object. O Chrome Animations panel usa esse id para identificar animações. Setar `this.#anim.id = 'ar-bounce'` é uma forma de "log" que vive no DevTools nativamente, sem custo de console.

6. **Risco de log noise em dev.** Se todos os packages logam em debug, o console fica ilegível. Defina um padrão de namespacing desde já (e.g., `[PackageName:Layer]`) para que a filtragem funcione quando houver múltiplos packages.

---

## Recommendation Summary

| Decision | Choice | Rationale |
|---|---|---|
| Logs permanentes no código? | **Sim** | Infraestrutura, não ferramenta temporária |
| Remoção em produção? | `import.meta.env.DEV` guard | Zero config, nativo do Vite, tree-shaken |
| Biblioteca externa? | **Não** | Overhead injustificável para component library |
| Níveis? | debug + warn + error | debug eliminado em prod; warn/error sempre |
| Filtragem em dev? | Prefixos `[Package:Layer]` + DevTools filter | Sem lib, funcionalidade nativa do Chrome |
| Onde logar? | Transições de estado, lifecycle, warnings de uso incorreto | Nunca per-frame ou dentro de animation callbacks |
| Timing de animação? | `performance.mark()` + `Animation.id` | Superior a console.log para esse caso de uso |

%% Consolidar essas decisões na arquitetura, seguiremos como está na tabela acima. %%
