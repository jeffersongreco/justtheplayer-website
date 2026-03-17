# Audit: Impacto das Novas Regras da Arquitetura nos Packages

Novas seções adicionadas: §10 (Testes), §11 (Logging), §12 (Dev Pages), §13 (Acessibilidade), e adições a §8 (Performance).

---

## Impacta Ambos os Packages

| Regra | Seção | O que auditar |
|---|---|---|
| Logs de debug permanentes com `import.meta.env.DEV` | §11 | Nenhum dos dois tem logging estruturado — adicionar logs de transição de estado no Model e lifecycle no Controller |
| Prefixo `[Package:Layer]` em todos os logs | §11 | Definir e aplicar namespaces (`[AR:Model]`, `[AR:Controller]`, `[Movable:Model]`, etc.) |
| `console.warn` existentes devem ser mantidos; novos para auto-correções | §11 | Revisar `console.warn` existentes — manter e padronizar prefixo |
| `performance.mark()` / `Animation.id` para instrumentação | §11 | Nenhum dos dois usa — adicionar onde relevante |
| Dev page com log panel + state inspector | §12 | AR tem log panel mas falta state inspector; Movable precisa de ambos verificados |
| Alias `dev:<name>` no root package.json | §12 | AR já tem `dev:ar`; verificar Movable |
| Smoke test visual como Definition of Done | §12 | Adotar como prática — não é mudança de código |
| `prefers-reduced-motion` | §13 | Nenhum dos dois implementa — **ação obrigatória** |
| Nenhuma animação > 3Hz flash | §13 | Auditar keyframes existentes |
| Processo de 5 steps (axe-core, keyboard, VoiceOver, reduced-motion) | §13 | Executar pela primeira vez em ambos |
| Bundle size com `size-limit` | §8 | Nenhum dos dois tem — configurar |
| Benchmarks com `vitest bench` | §8 | Nenhum dos dois tem — criar benchmarks do Model |
| Propriedades compositor-friendly only | §8 | Auditar todos os keyframes e estilos manipulados por JS |
| Pure functions extraídas com testes próprios | §10 | Identificar lógica extraível em ambos |
| Sem biblioteca de logging externa | §11 | Já é o caso — manter |

---

## Impacta Apenas Attention Requester

| Regra | Seção | O que auditar |
|---|---|---|
| Behavioral Spec exaustivo antes da implementação | §10 | Já tem Test Spec — verificar se cobre todos os edge cases do estado atual |
| Testes organizados por seção do Spec | §10 | **Já conforme** — usa `§2.1`, `§2.3`, etc. |
| Um arquivo de teste por Model | §10 | **Já conforme** — `AttentionRequesterModel.test.ts` |
| State inspector na dev page | §12 | Falta — adicionar exibição de `isActive`, `isPaused`, `animation.name`, `interruptResolution` |
| `Animation.id` nos objetos WAAPI | §11 | Controller cria `el.animate()` sem `id` — adicionar (ex: `id: 'ar-bounce'`) |
| `prefers-reduced-motion` na animação | §13 | **Não implementado** — precisa de media query ou check no Model/Controller para desabilitar/simplificar |
| Animação não bloqueia interação | §13 | Verificar que nenhum elemento pai/irmão é desabilitado durante animação |
| Logs de transição no Model | §11 | Adicionar: idle→animating, animating→idle, cancel, pause, resume |
| Logs de lifecycle no Controller | §11 | Adicionar: startCycle, interruptResolution applied, destroy |

---

## Impacta Apenas Movable

| Regra | Seção | O que auditar |
|---|---|---|
| **Alternativa completa via teclado** | §13 | **Não implementado** — requer: `KeyboardInteraction` plugável, estados `grabbed`/`moveByStep(direction)` no Model, keybindings (Arrow + Enter/Space) |
| ARIA roles e attributes para drag | §13 | **Não implementado** — adicionar `aria-roledescription`, estados de drag |
| Anúncio de posição via `aria-live` | §13 | **Não implementado** — live region com posição/estado |
| Instruções visíveis para keyboard drag | §13 | **Não implementado** — texto ou tooltip |
| Focus visible durante keyboard drag | §13 | Verificar outline no item durante operação de teclado |
| Drag via `translate`, nunca `top`/`left` | §8 | Auditar — verificar que posicionamento usa `transform: translate()` e não `top`/`left` |
| Delta absoluto para movimentos | §8 | Auditar — verificar se usa `movementX/Y` (proibido) |
| Pure functions de collision/boundary | §10 | Identificar lógica de collision detection e boundary clamping — extrair para Utils com testes |
| Logs na Interaction | §11 | Adicionar: drag start, drag move (throttled), drag end, keyboard commands |
| Behavioral Spec com keyboard drag | §10 | **Spec precisa ser atualizado** — estados `grabbed`, `moveByStep`, e fluxo de keyboard devem estar no Spec antes da implementação |

---

## Prioridades Sugeridas

### P0 — Obrigatório (a11y e fundação)
1. `prefers-reduced-motion` em ambos os packages
2. Keyboard alternative no Movable (feature arquitetural — precisa de Spec update primeiro)
3. ARIA para Movable
4. `size-limit` em ambos

### P1 — Alto valor / baixo esforço
5. Logging estruturado em ambos (Model + Controller)
6. State inspector na dev page do AR
7. `Animation.id` no Controller do AR
8. axe-core na dev page de ambos

### P2 — Melhoria contínua
9. `vitest bench` para Models
10. `performance.mark()` para instrumentação
11. Pure function extraction (collision/boundary no Movable)
12. Processo de 5 steps executado pela primeira vez
