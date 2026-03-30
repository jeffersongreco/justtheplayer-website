# Acessibilidade (§13)

> Parte da [Svelte Model View Architecture](Architecture.md).

---

### Requisitos por Tipo de Package

#### Packages de Animação (Attention Requester e similares)

| Requisito | Prioridade |
|---|---|
| Respeitar `prefers-reduced-motion` (desabilitar ou simplificar animação) | **Obrigatório** |
| Animação não bloqueia interação (não desabilitar botões/links durante animação) | **Obrigatório** |
| Nenhuma animação pisca > 3Hz (WCAG 2.3.1 — risco de convulsão) | **Obrigatório** |
| `aria-live` para mudanças de estado que comunicam informação | Recomendado |

#### Packages de Drag/Interação (Movable e similares)

| Requisito | Prioridade |
|---|---|
| **Alternativa completa via teclado** (Arrow keys para mover, Enter/Space para agarrar/soltar) | **Obrigatório** |
| ARIA roles e attributes (`aria-roledescription`, estados de drag) | **Obrigatório** |
| Anúncio de posição via live region ("Item movido para posição 3 de 5") | **Obrigatório** |
| Instruções visíveis para uso via teclado | Recomendado |
| Focus visible durante drag via teclado | **Obrigatório** |

**Nota:** Para packages de drag, a acessibilidade via teclado é uma **feature arquitetural** — o Model deve ter estados (`grabbed`) e métodos (`moveByStep(direction)`) desde o Behavioral Spec. Não é algo que se adiciona depois. Referência: dnd-kit.

### Processo de Verificação (5 Steps)

Executar como parte do smoke test na dev page:

1. **Svelte compiler warnings** — automático, já ativo no build
2. **axe-core na dev page** — importar e rodar audit; feedback instantâneo
3. **Keyboard-only testing** — desligar mouse, Tab por toda a page, verificar foco e operabilidade
4. **VoiceOver spot-check** — Cmd+F5, navegar pelo componente, verificar anúncios
5. **Toggle `prefers-reduced-motion`** — DevTools → Rendering → Emulate, verificar adaptação

**DevTools MCP:** Quando disponível, usar o Chrome DevTools MCP para automatizar passos de auditoria (axe-core, Lighthouse a11y) e reduzir verificação manual.
