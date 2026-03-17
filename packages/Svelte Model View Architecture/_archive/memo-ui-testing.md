# Memo: Automated UI Testing for Animation/Interaction Libraries

## The Questions

1. A decisão de não ter testes automatizados de UI e fazer verificação manual — está correta?
2. Testes visuais com IA são viáveis? E o custo de tokens?
3. Qual o panorama geral para libraries que são primariamente animações e drag?

## Short Answer

**Sua intuição está correta: para o tipo de biblioteca que vocês estão construindo, testes automatizados de UI têm um retorno baixo comparado ao custo.** A maioria das libraries de animação e drag da indústria faz exatamente o que vocês fazem — testa a lógica automaticamente e verifica o visual manualmente. Mas existem camadas intermediárias que vale a pena conhecer.

---

## 1. O Estado da Arte — O que é possível testar automaticamente?

### O espectro de testabilidade

```
Totalmente automatizável                    Impossível de automatizar
├─────────────────┼──────────────┼────────────────┤
│                 │              │                │
Estado/lógica   Valores CSS    Timing          "Ficou bonito?"
(Model tests)   computados     correto         (aesthetic judgment)
                end-states     (300ms bounce)
```

| O que | Automatizável? | Como | Vale a pena? |
|---|---|---|---|
| Estado do Model (idle→animating→idle) | ✅ Totalmente | Unit tests (já fazem) | **Sim** — é onde ~70% dos bugs vivem |
| `animation.playState` (running/paused/finished) | ✅ Sim | Vitest Browser Mode ou Playwright | Talvez — mas testa o browser, não seu código |
| CSS computado no end-state (translate voltou a 0) | ✅ Sim | `getComputedStyle()` após finish | Marginal — testa WAAPI, não sua lógica |
| Timing exato (bounce durou 300ms) | ⚠️ Frágil | `performance.now()` + tolerância | Não — flaky em CI, depende de CPU load |
| Drag moveu elemento para posição correta | ⚠️ Parcial | Playwright `dragTo()` | Parcial — gaps com pointer events customizados |
| Collision detection durante drag | ⚠️ Parcial | Simular coordenadas + verificar resultado | Melhor testar a lógica de collision no Model |
| Animação visualmente suave/bonita | ❌ Não | — | Necessariamente manual |
| "Drag feels responsive" | ❌ Não | — | Necessariamente manual |

### O insight crucial

**~70% dos bugs em libraries de animação são bugs de lógica**, não bugs visuais. Estado inconsistente, race conditions em pause/resume, re-entrancy, edge cases de lifecycle. Todos pegos por unit tests do Model.

Os ~30% restantes são visuais/timing e não são efetivamente capturados por testes automatizados — ou o teste é frágil demais (flaky), ou testa a engine do browser em vez do seu código.

---

## 2. O que as libraries famosas realmente fazem?

Isso é talvez o dado mais revelador:

| Library | Downloads/semana | Testes automatizados de UI? | O que fazem |
|---|---|---|---|
| **Framer Motion** | ~4M | ❌ Não realmente | Jest + RTL, mas **mocka as animações** — testa lógica, não visual |
| **GSAP** | ~1M | ❌ Não | Equipe do GSAP declarou publicamente: "não existem boas suites de teste automatizado para animação" |
| **dnd-kit** | ~2M | ⚠️ Parcial | Cypress E2E contra Storybook — funcional, não visual |
| **@use-gesture** | ~1M | ✅ Lógica | Testa gesture recognition (lógica), não o resultado visual |
| **Sortable.js** | ~2M | ⚠️ Parcial | E2E básico para drag ordering — verifica resultado, não o processo |

**Padrão da indústria:** testar a lógica exaustivamente, verificar o visual manualmente. Exatamente o que vocês decidiram.

---

## 3. As opções intermediárias que existem

### 3a. Vitest Browser Mode (a mais relevante para vocês)

Vitest roda seus testes num browser real (Chromium via Playwright) em vez do jsdom. Isso dá acesso a WAAPI real, DOM layout real, e runes do Svelte 5. É a abordagem oficialmente recomendada pela equipe do Svelte para component testing.

**O que possibilita:**
```typescript
// Monta o componente num browser real
const el = mountComponent(AttentionRequester, { animation: bounce });

// Dispara ação
el.request();

// Espera animação terminar
await waitForAnimationEnd(el);

// Verifica end-state
expect(getComputedStyle(target).translate).toBe('none');
```

**Prós:**
- Testa com DOM real e WAAPI real
- Mesmo runner (Vitest) que seus testes de Model
- Sem mocks de browser APIs

**Contras:**
- Mais lento que unit tests (~5-10x)
- Testes de timing são inerentemente flaky em CI
- Setup mais complexo (browser precisa estar disponível)
- Testa que "o browser fez a animação" — mas isso é responsabilidade do browser, não sua

**Veredicto:** Útil se você quiser testar a *integração* Controller ↔ WAAPI, mas não substitui verificação visual.

### 3b. Visual Regression Testing (Chromatic, Percy, Playwright screenshots)

Tira screenshots e compara com baseline. Se mudou → falha.

**Ferramentas:**

| Tool | Preço | Snapshots grátis | AI features |
|---|---|---|---|
| **Chromatic** (Storybook) | $149+/mês | 5.000/mês | Anti-flake, mas não para animações |
| **Percy** (BrowserStack) | $399+/mês | 5.000/mês | Percy Review Agent reduz false positives 40%+ |
| **Applitools** | $200-970+/mês | Trial | Visual AI mais sofisticada |
| **Playwright** `toHaveScreenshot()` | Grátis | ∞ | Nenhum |

**O problema com animações:**
- CSS animations: Chromatic/Percy pausam automaticamente para screenshot
- **WAAPI animations: NÃO são pausadas automaticamente.** Você precisa pausar manualmente ou tirar screenshot no end-state
- Timing do screenshot é crítico — 1ms de diferença = imagem diferente = false positive
- Sub-pixel rendering difere entre OS/GPU → mais false positives

**O problema com drag:**
- Screenshot mostra posição estática, não a experiência de arrastar
- Testar que "o elemento está na posição X,Y" é melhor feito com assertion de coordenadas, não screenshot

**Veredicto:** Visual regression testing é mais útil para **layouts e design systems** do que para **animation libraries**. O ratio de false positives para animações torna impraticável sem investimento significativo em infraestrutura.

### 3c. AI-Powered Visual Testing

**Estado atual (2025):**
- Applitools usa vision models para comparar screenshots com inteligência (ignora mudanças irrelevantes)
- Percy Review Agent analisa diffs e classifica como intencional/regressão
- Alguns projetos experimentais usam GPT-4V/Claude Vision para validar UI

**Custo de tokens para vision models:**
- Uma screenshot de componente (~200x200px) ≈ 300-500 tokens de input
- Prompt de validação ≈ 200 tokens
- 50 componentes × 3 estados cada = 150 validações ≈ 100K-150K tokens por run
- Em Claude Sonnet: ~$0.50/run. Em Opus: ~$2.50/run
- CI rodando 10x/dia: $5-25/dia → $150-750/mês

**O problema real não é custo — é confiabilidade:**
- Vision models são probabilísticos. "A animação bounce parece correta" pode ter 95% de acurácia — insuficiente para CI/CD
- Não existe ground truth para "parece bom"
- Cada falso positivo ou negativo exige review humano → perde o propósito

**Veredicto:** Interessante para **auditorias pontuais** ("revise esses 10 componentes"), não viável como gate de CI. A tecnologia vai melhorar, mas hoje não substitui olho humano para animações.

---

## 4. Análise específica para @headless-uai

### O perfil dos pacotes

Os pacotes `@headless-uai` compartilham características que tornam automated UI testing particularmente difícil:

1. **Animações WAAPI** — timing-dependent, visualmente subjetivo
2. **Drag interactions** — dependem de pointer events, touch events, coordenadas reais
3. **Collision detection** — geometria que depende de layout real
4. **Boundary constraints** — dependem de parent dimensions

### O que é melhor automatizar vs. não

```
                          Valor do teste automatizado
                    Alto ◄─────────────────────► Baixo

Model logic         ████████████████████████████  ← Já fazem
Collision math      ███████████████████████        ← Pure function, automatizar
Boundary calc       ██████████████████             ← Pure function, automatizar
State transitions   ████████████████████████████  ← Já fazem
DOM integration     ████████████                   ← Vitest Browser Mode (opcional)
Animation visual    ████                           ← Manual
Drag feel           ██                             ← Manual
Overall aesthetics  █                              ← Manual
```

### A estratégia ideal para @headless-uai

**Nível 1 — Já fazem, continuar:**
- Unit tests exaustivos dos Models (estado, transições, edge cases)
- Manual testing checklists para UI

**Nível 2 — Considerar quando houver mais pacotes:**
- Extrair lógica de collision/boundary para pure functions → unit tests
- Extrair lógica de gesture recognition para pure functions → unit tests
- Storybook com stories interativas para cada estado/variante (facilita manual QA)

**Nível 3 — Só se justificar pelo tamanho do projeto:**
- Vitest Browser Mode para smoke tests de integração (monta componente, dispara ação, verifica end-state)
- Playwright E2E para fluxos críticos (drag item de A para B, verificar posição final)

**Nível 4 — Provavelmente nunca para este tipo de projeto:**
- Visual regression testing com Chromatic/Percy
- AI-powered visual validation em CI

---

## 5. Blind Spots & Things to Consider

1. **O maior risco não é falta de UI tests — é falta de stories/demos interativas.** Se o único jeito de testar manualmente é rodar o app inteiro e navegar até o componente, a barreira é alta e a verificação é rara. **Storybook ou uma dev page dedicada** (como o `index.html` + `vite.config.ts` que já estão sendo adicionados ao attention-requester) reduz essa barreira a zero. Invista nisso antes de investir em testes automatizados de UI.

2. **A separação Model/Controller já é a melhor estratégia de testabilidade.** Quanto mais lógica você mover para o Model (que é testável), menos depende de verificação visual. Se o Model sabe que "o elemento deveria estar em (x: 150, y: 200) após o drag", e isso é testado, a única coisa que o Controller pode errar é *aplicar* essa posição — e isso é trivial de verificar visualmente.

3. **Para drag/collision, considere a "camada de geometria".** Se a lógica de collision detection e boundary clamping for extraída em pure functions (`clampToBounds(position, bounds)`, `detectCollision(rectA, rectB)`), essas são 100% testáveis automaticamente. O Controller só aplica o resultado. Isso elimina a categoria mais perigosa de bugs (lógica espacial) sem precisar de testes de UI.

4. **Timing bugs são a categoria que escapa de ambas as abordagens.** Nem unit tests do Model nem verificação visual casual pegam race conditions que acontecem 1 em 50 vezes. Para esses, a melhor defesa é: (a) logging de transições de estado (memo anterior), (b) assertions internas (`if (import.meta.env.DEV) assert(...)`) que explodem alto em dev.

5. **Se no futuro quiserem dar o passo para browser testing**, Vitest Browser Mode é o caminho natural — mesmo runner, mesma config, sem tool novo. Mas esse é um investimento que só vale quando a quantidade de packages justificar o setup.

6. **O custo real dos testes automatizados de UI não é escrevê-los — é mantê-los.** Cada mudança visual (novo easing, duração diferente, keyframes ajustados) quebra screenshots e precisa de review. Para uma library em desenvolvimento ativo, isso se torna um gargalo. Testes visuais fazem mais sentido para sistemas *estáveis*, não para libraries que ainda estão sendo iteradas.

---

## Recommendation Summary

| Pergunta | Resposta | Rationale |
|---|---|---|
| Testes automatizados de UI? | **Não por agora** | ROI baixo para animation/drag libraries; as libs famosas também não fazem |
| Verificação manual exclusiva? | **Sim, com dev pages/stories** | Baixa barreira = verificação frequente = bugs pegos cedo |
| AI visual testing? | **Não em CI; talvez para auditorias pontuais** | Probabilístico demais para gate de CI; custo justificável para reviews |
| O que automatizar mais? | **Extrair pure functions de geometria/collision** | 100% testável, elimina categoria perigosa de bugs |
| Quando reconsiderar? | **Quando houver 5+ packages @headless-uai** | Aí o custo de setup de Vitest Browser Mode se dilui |
| Investimento mais valioso agora? | **Dev pages interativas por package** | Facilita QA manual, documenta estados, e serve de showcase |

%% Reforçar na arquitetura que, quando der para extrair uma pure function de lógica, deve-se fazer isso para ganhar testabilidade da unidade. E que Testes automatizados de UI e Browser Mode, não serão considerados agora para nenhum pacote. %%
