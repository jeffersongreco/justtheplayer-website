# Logging (§11)

> Parte da [Svelte Model View Architecture](Architecture.md).

---

### Logs são Infraestrutura, não Ferramenta Temporária

Logs ficam **permanentemente** no código-fonte. Nunca se adiciona e remove logs manualmente para diagnosticar um bug — os logs relevantes já devem estar lá.

### Eliminação em Produção

Logs de debug são guardados por `import.meta.env.DEV` — o Vite substitui em build time e o minifier elimina o bloco inteiro. Zero bytes no bundle de produção, zero custo.

```ts
if (import.meta.env.DEV) {
  console.debug('[AR:Model] State transition', { from: 'idle', to: 'animating' });
}
```

### Níveis e Visibilidade

| Nível | Quando usar | Presente em produção? |
|---|---|---|
| `console.debug` | Transições de estado, lifecycle, dados de configuração | ❌ Eliminado |
| `console.warn` | Uso incorreto da API, fallbacks aplicados, auto-correções (§7) | ✅ Sempre |
| `console.error` | Falhas inesperadas | ✅ Sempre |

### Namespacing

Todos os logs usam prefixo `[Package:Layer]` para filtragem no DevTools (ex: `[AR:Model]`, `[AR:Controller]`, `[Movable:Interaction]`).

### Onde Logar

- **Sim:** Transições de estado, lifecycle (mount/destroy/configure), warnings de uso incorreto, interrupt resolution aplicada
- **Nunca:** Dentro de animation frame callbacks, per-tick, event handlers de alta frequência (scroll, mousemove)

### Sem Biblioteca Externa

Para component libraries, `import.meta.env.DEV` + prefixos string é suficiente. Bibliotecas de logging não se justificam pelo overhead de dependência e bundle size.

### Instrumentação de Animações

Para timing e profiling de animações, preferir `performance.mark()` / `performance.measure()` e `Animation.id` (WAAPI) em vez de `console.log`. Estes aparecem nativamente nos painéis Performance e Animations do DevTools.

### DevTools MCP

Quando disponível, o Chrome DevTools MCP deve ser usado para consumir logs e métricas diretamente, reduzindo etapas manuais de verificação.
