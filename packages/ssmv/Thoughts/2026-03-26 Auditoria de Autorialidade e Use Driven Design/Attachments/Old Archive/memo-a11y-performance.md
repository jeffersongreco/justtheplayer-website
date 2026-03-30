# Memo: Acessibilidade (a11y) e Performance Testing

## The Questions

1. Um dev solo consegue entregar o mesmo rigor de a11y que um time?
2. Existe um "linter de a11y" que acusa todos os casos?
3. Performance: como definir o que é aceitável? Como medir? Como integrar a testes?

---

# Part 1: Acessibilidade

## 1. O que ferramentas automatizadas realmente pegam

### O número real

O axe-core (a engine por trás de quase todas as ferramentas de a11y — Lighthouse, Deque, Chrome DevTools audit) **detecta ~57% dos problemas de acessibilidade por volume** (estudo Deque 2021, 300K issues em 13K páginas).

Um número mais conservador circula frequentemente: "20-30%". Esse mede outra coisa — a porcentagem de **WCAG Success Criteria** que podem ser *completamente* verificados de forma automatizada. Ambos os números são válidos, medem dimensões diferentes.

### O que ferramentas automatizadas PEGAM bem

| Categoria | Exemplo | Ferramenta |
|---|---|---|
| Contraste de cor | Texto com contraste < 4.5:1 | axe-core, Lighthouse |
| Atributos ARIA inválidos | `aria-label` em elemento que não aceita | axe-core, Svelte compiler |
| Imagens sem alt | `<img>` sem `alt` attribute | axe-core, Svelte compiler |
| Heading hierarchy | `<h3>` sem `<h2>` anterior | axe-core |
| Form labels | `<input>` sem `<label>` associado | axe-core, Svelte compiler |
| Landmark structure | Conteúdo fora de `<main>`, `<nav>`, etc. | axe-core |
| Language attribute | `<html>` sem `lang` | axe-core |

### O que ferramentas automatizadas NÃO PEGAM

Aqui está o gap que nenhuma ferramenta fecha — e é grande:

| Categoria | Exemplo | Por que não automatiza |
|---|---|---|
| **Ordem de foco** | Tab navega em ordem ilógica | Depende de contexto visual/semântico |
| **Screen reader announcements** | VoiceOver anuncia "button" mas não diz o que faz | Requer ouvir o output do leitor |
| **Keyboard operability** | Drag-and-drop não funciona sem mouse | Requer testar fluxo completo |
| **Significado do alt text** | `alt="imagem"` vs. `alt="gráfico mostrando crescimento de 40%"` | Requer compreensão semântica |
| **Cognitive load** | Animação distrai do conteúdo principal | Subjetivo, requer julgamento humano |
| **Touch target size** | Botão tem 44px mas fica apertado ao lado de outro | Contextual |
| **Motion sensitivity** | Animação respeita `prefers-reduced-motion`? | Pode ser automatizado caso a caso, mas a *adequação* da alternativa é subjetiva |
| **Live region timing** | `aria-live` anuncia cedo demais / tarde demais | Depende do fluxo do usuário |

### Conclusão sobre ferramentas

**Não existe e não pode existir um "linter que pega todos os casos".** Acessibilidade é parcialmente sobre regras (automatizáveis) e parcialmente sobre experiência humana (não automatizável). É como pedir um linter que garanta que seu texto é compreensível — as regras de gramática são verificáveis, mas a clareza não é.

---

## 2. Solo dev vs. time — o gap real

### O que times grandes fazem que um solo dev não faz

| Prática | Time grande | Solo dev | Impacto real |
|---|---|---|---|
| Teste com usuários reais com deficiência | ✅ Regular | ❌ Impraticável | Alto — é o teste definitivo |
| Matriz de screen readers (NVDA, JAWS, VoiceOver, TalkBack) | ✅ Cobertura completa | ⚠️ Testa 1-2 | Médio — browsers convergem, mas há diferenças |
| QA dedicado de a11y | ✅ Pessoa especializada | ❌ Você mesmo | Médio — atenção dividida |
| Audit WCAG formal (conformance report) | ✅ Profissional certificado | ❌ Custo proibitivo | Baixo para library; alto para produto final |
| Automated testing em CI (axe + Lighthouse) | ✅ Pipeline completo | ✅ Viável | Mesma capacidade |

### A boa notícia para component libraries

**Uma component library tem escopo muito menor que um app completo.** Você não está acessibilizando 200 páginas — está acessibilizando 2-5 componentes com APIs bem definidas. O que importa:

1. **O componente não quebra a acessibilidade do app consumidor.** Não rouba foco, não esconde conteúdo, não cria traps de teclado.
2. **O componente fornece os hooks necessários.** ARIA attributes expostos, keyboard handlers expostos, motion respeitada.
3. **O componente tem alternativas keyboard para interações mouse-only.** Especialmente drag-and-drop.

Um solo dev pode atingir rigor profissional nisso. Não é a mesma coisa que acessibilizar um e-commerce com 500 fluxos.

---

## 3. O que packages de animação/drag especificamente precisam

### Animação (Attention Requester e similares)

| Requisito | Prioridade | Como implementar |
|---|---|---|
| `prefers-reduced-motion` | **Crítico** | Media query que desabilita ou simplifica animação |
| Animação não bloqueia interação | **Crítico** | Não desabilitar botões/links durante animação |
| `aria-live` para mudanças de estado visíveis | Médio | Se a animação comunica informação (ex: "novo item"), anunciar via live region |
| Não causar seizures (flash < 3/segundo) | **Crítico** | WCAG 2.3.1 — nenhuma animação deve piscar > 3Hz |
| Duração razoável | Médio | Animações muito longas (>5s) podem ser desconfortáveis |

### Drag (Movable e similares)

| Requisito | Prioridade | Como implementar |
|---|---|---|
| **Alternativa via teclado** | **Crítico** | Arrow keys para mover, Enter/Space para agarrar/soltar |
| ARIA roles e attributes | **Crítico** | `role="application"`, `aria-grabbed`, `aria-dropeffect` (legacy) ou `aria-roledescription` |
| Anúncio de posição | Alto | Live region: "Item movido para posição 3 de 5" |
| Instruções visíveis | Alto | "Use arrow keys to move, Enter to confirm" |
| Focus visible durante drag | **Crítico** | Outline claro no item sendo arrastado via teclado |

### Referência: o que dnd-kit faz

dnd-kit é o padrão ouro em a11y para drag-and-drop:
- Keyboard sensor completo (arrows + modifiers para step size)
- `aria-roledescription="sortable"` em cada item
- Live region announcements automáticos: "Item picked up", "Item moved to position 3", "Item dropped"
- Screen reader instructions customizáveis
- Focus management automático

**Isso é o benchmark a atingir para o Movable.** Não é trivial, mas é um escopo definido e documentado.

---

## 4. Processo prático de a11y para solo dev

### Os 5 passos que cobrem ~80% dos problemas

```
Passo 1: Svelte compiler warnings (automático, já ativo)
         → Pega atributos ARIA inválidos, missing alt, missing labels
         → Custo: zero — já acontece no build

Passo 2: axe-core na dev page (uma vez por package)
         → Importar axe-core na dev page, rodar audit, verificar resultados
         → Pega: contraste, landmarks, heading hierarchy, ARIA válido
         → Custo: 3 linhas de código + 2 minutos por audit

Passo 3: Keyboard-only testing (manual, 5 minutos)
         → Desligar mouse, Tab por toda a dev page
         → Perguntas: consigo chegar em tudo? A ordem faz sentido?
           Consigo operar drag com teclado? Vejo onde está o foco?
         → Custo: 5 min por package

Passo 4: VoiceOver spot-check (manual, 5 minutos)
         → Cmd+F5 no Mac, navegar pelo componente
         → Perguntas: o leitor anuncia o que é cada coisa?
           Ações de animação/drag são comunicadas?
           Há informação visual que não é anunciada?
         → Custo: 5 min por package (você já tem o Mac)

Passo 5: Toggle prefers-reduced-motion (manual, 1 minuto)
         → System Preferences → Accessibility → Display → Reduce Motion
         → Ou: DevTools → Rendering → Emulate prefers-reduced-motion
         → Pergunta: a animação desaparece ou simplifica adequadamente?
         → Custo: 1 min
```

**Total: ~15 minutos por package, uma vez por feature significativa.**

### Quando rodar esses passos

- **Passo 1:** Contínuo (automático)
- **Passos 2-5:** Como parte do "smoke test humano" na dev page (memo anterior: Definition of Done)
- **Passo 4 (VoiceOver):** Pelo menos uma vez por package e quando mudar API pública

---

# Part 2: Performance

## 5. O que medir — e o que é "aceitável"

### As métricas que importam para uma component library

| Métrica | O que mede | Threshold aceitável | Como medir |
|---|---|---|---|
| **Bundle size** (minified + gzip) | Quanto peso o consumidor paga | < 5KB para um componente de UI; < 10KB para algo com lógica complexa | `size-limit`, bundlephobia |
| **Setup time** | Quanto tempo leva para instanciar o componente | < 1ms para criação + config | `performance.mark()` / `vitest bench` |
| **Frame drops durante animação** | Jank visual | 0 dropped frames em 60fps (16.67ms budget) | DevTools Performance panel |
| **Memory** | Leaks ao criar/destruir instâncias | Sem crescimento após N ciclos create/destroy | DevTools Memory panel / heap snapshots |
| **Long Tasks** | JS que bloqueia > 50ms | Zero long tasks durante animação | PerformanceObserver |

### Por que WAAPI é uma vantagem enorme

Animações via Web Animations API rodam no **compositor thread** do browser — **fora** da main thread JS. Isso significa:

```
Seu código JS                  Browser compositor
─────────────                  ──────────────────
model.request()     ────►      (nada a fazer)
controller.start()  ────►      el.animate() registra animação
(JS thread livre)              (compositor roda a animação)
                               (60fps sem JS envolvido)
(callback finish)  ◄────       animação terminou
model.onCycleFinished()
```

O **frame budget de 16ms não se aplica à animação em si** — só ao seu código de setup/teardown. E setup é tipicamente < 0.5ms. Isso é radicalmente diferente de animações feitas com `requestAnimationFrame` (que *competem* com JS pelo frame budget).

**Tradução prática:** Se vocês usam WAAPI + propriedades que rodam no compositor (`transform`, `opacity`, `translate`), o risco de jank é quase zero. O que pode causar jank: animar propriedades que trigam layout (`width`, `height`, `top`, `left`).

### O que as libraries famosas fazem (ou não fazem)

| Library | Performance tests automatizados? | O que fazem |
|---|---|---|
| **GSAP** | ❌ Não públicos | Profiling manual, focus em GPU acceleration |
| **Framer Motion** | ❌ Não | Bundle size tracking, architectural decisions (compositor-friendly) |
| **dnd-kit** | ❌ Não | Virtualization support, manual profiling |
| **Svelte** | ✅ Benchmarks (js-framework-benchmark) | Mas testa o framework, não componentes individuais |

**Nenhuma library de animação publica testes automatizados de frame rate.** Todas dependem de decisões arquiteturais (compositor-thread, GPU-friendly properties) + profiling manual.

---

## 6. O que automatizar e o que medir manualmente

### Automatizável — integrar ao CI

#### Bundle size com `size-limit`

A ferramenta de maior valor por menor esforço:

```json
// package.json do attention-requester
{
  "size-limit": [
    {
      "path": "dist/index.js",
      "limit": "3 KB"
    }
  ]
}
```

- Roda em CI, falha se o bundle ultrapassar o limite
- Custo zero de manutenção após setup
- Catch de imports acidentais de libs pesadas, tree-shaking quebrado, código duplicado

#### Benchmarks de setup com `vitest bench`

```typescript
import { bench, describe } from 'vitest';

describe('AttentionRequesterModel', () => {
  bench('instantiation', () => {
    new AttentionRequesterModel();
  });

  bench('configure + request', () => {
    const m = new AttentionRequesterModel();
    m.configure(bounceAnimation);
    m.request();
  });

  bench('full lifecycle (request → finish)', () => {
    const m = new AttentionRequesterModel();
    m.configure(bounceAnimation);
    m.request();
    m.onCycleFinished();
  });
});
```

- Não testa "é rápido o suficiente" (subjetivo) — testa "não ficou mais lento" (regressão)
- Útil para detectar regressões acidentais ao refatorar
- `vitest bench` gera ops/sec, e pode ser comparado entre runs

### Não automatizável — medir manualmente

#### Frame rate e jank

- DevTools → Performance → Record → interagir com animação → analisar
- Procurar: frames > 16ms, long tasks (barras vermelhas), layout thrashing
- **Quando:** Uma vez por package, e quando mudar keyframes ou propriedades animadas

#### Memory leaks

- DevTools → Memory → Heap snapshot
- Ciclo: criar componente → animar → destruir → repetir 100x → snapshot
- **Quando:** Uma vez por package, e quando mudar lógica de lifecycle/destroy

#### Real-device performance

- Testar num device low-end (ou Chrome DevTools → Performance → CPU 4x slowdown)
- **Quando:** Antes de release major

---

## 7. Propriedades compositor-friendly — a decisão arquitetural que mais importa

Mais importante que qualquer métrica ou benchmark é **quais CSS properties as animações usam**:

| Propriedade | Thread | Layout trigger | Segura para animar? |
|---|---|---|---|
| `transform` | Compositor | ❌ Não | ✅ Sim — ideal |
| `translate` | Compositor | ❌ Não | ✅ Sim — ideal |
| `opacity` | Compositor | ❌ Não | ✅ Sim |
| `scale` | Compositor | ❌ Não | ✅ Sim |
| `rotate` | Compositor | ❌ Não | ✅ Sim |
| `filter` | Compositor* | ❌ Não | ✅ Sim (maioria dos browsers) |
| `width` / `height` | Main thread | ✅ Sim | ❌ Evitar |
| `top` / `left` | Main thread | ✅ Sim | ❌ Evitar |
| `margin` / `padding` | Main thread | ✅ Sim | ❌ Evitar |
| `border` | Main thread | ✅ Sim | ❌ Evitar |

**O attention-requester já usa `translate` — está correto.** Isso garante que a animação roda no compositor thread independente de quão pesada a main thread esteja.

**Para o Movable:** o drag deve mover via `translate` ou `transform: translate()`, nunca `top`/`left`. Essa decisão arquitetural vale mais que qualquer benchmark.

---

## 8. Blind Spots & Things to Consider

1. **a11y de animação tem uma dimensão que ninguém testa: vestibular disorders.** `prefers-reduced-motion` é o mínimo. Mas algumas pessoas são afetadas por *direção* do movimento (vertical pior que horizontal), *distância* (grandes deslocamentos piores), e *frequência* (loops rápidos piores). Não existe spec para isso — é domain knowledge que você acumula lendo sobre motion sensitivity. Para libraries de animação, considere documentar "motion intensity" de cada animação preset para que consumidores possam tomar decisões informadas.

2. **O axe-core na dev page pode ser mais que um check manual.** Você pode fazer um assertion automático:

   ```typescript
   // Na dev page, em modo dev:
   import axe from 'axe-core';
   const results = await axe.run();
   if (results.violations.length > 0) {
     console.error('a11y violations:', results.violations);
   }
   ```

   Roda toda vez que a dev page carrega → feedback instantâneo → zero esforço contínuo.

3. **`size-limit` é o teste automatizado de maior ROI que vocês não têm.** Setup: 5 minutos. Valor: impede que um `import lodash` acidental ou tree-shaking quebrado passe despercebido. Faça isso antes de qualquer benchmark de runtime.

4. **Para o Movable, a11y de drag é uma feature, não um afterthought.** O suporte a keyboard drag (Arrow keys para mover, Enter/Space para grab/release) precisa ser pensado na arquitetura do Model desde o início — não é algo que se adiciona depois. O Model precisa ter states para `grabbed` e métodos como `moveByStep(direction)`. Se isso não estiver no Behavioral Spec, deve ser adicionado.

5. **`vitest bench` não é para gates de CI (pass/fail) — é para comparação.** Performance absoluta varia por máquina. Use bench para detectar *regressões relativas* entre commits, não para definir thresholds absolutos. `size-limit` sim é um gate.

6. **Não confie apenas no Lighthouse score.** Lighthouse roda num throttled CPU que não representa nenhum device real. Use-o como smoke test, não como benchmark. O Performance panel com CPU 4x slowdown é mais representativo para testar animações.

---

## Recommendation Summary

### Acessibilidade

| Decisão | Escolha | Rationale |
|---|---|---|
| Solo dev = menor rigor? | **Não necessariamente** | Escopo de library é pequeno; 5-step process cobre ~80% |
| Existe linter completo? | **Não e não pode existir** | ~57% automatizável (axe-core); resto requer julgamento humano |
| Ferramenta principal? | **axe-core na dev page** | Feedback instantâneo, zero custo contínuo |
| Para animação? | **`prefers-reduced-motion` é obrigatório** | Crítico; uma media query, zero overhead |
| Para drag? | **Keyboard alternative é obrigatória** | Pensar no Model desde o início; dnd-kit como referência |
| Quando testar? | **Como parte do smoke test na dev page** | 15 min por package por feature |

### Performance

| Decisão | Escolha | Rationale |
|---|---|---|
| Métrica mais importante? | **Bundle size** | Impacta todo consumidor, todo page load |
| Automação em CI? | **`size-limit`** | 5 min de setup, maior ROI |
| Benchmark de runtime? | **`vitest bench` para regressão** | Não gate, mas comparativo entre commits |
| Frame rate? | **Manual com DevTools** | Não automatizável em CI de forma confiável |
| Decisão arquitetural? | **Compositor-friendly properties only** | `translate`/`transform`/`opacity` — mais valioso que qualquer benchmark |
| Propriedades no Movable? | **`translate`, nunca `top`/`left`** | Decisão que define performance ceiling |

%% Todas recomendações. Apenas com o detalhe de que for possível ouvir do DevTools usando o MCP do Chrome devtools, deve ser feito assim para reduzir as etapas manuais (Isso vale para os logs também). %%
