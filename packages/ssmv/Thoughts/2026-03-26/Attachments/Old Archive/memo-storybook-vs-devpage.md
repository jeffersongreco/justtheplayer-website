# Memo: Storybook vs. Dev Page Dedicada (no contexto de geração por IA)

## The Question

Storybook ou dev page dedicada (como a que já existe no attention-requester)? Considerando que a dev page será construída/iterada com IA.

## Short Answer

**Dev page dedicada é a escolha certa para este projeto.** Storybook introduz uma camada de abstração, configuração e manutenção que não se paga para libraries de animação/drag. E no cenário onde a IA gera a dev page, a vantagem do Storybook (UI pronta) desaparece — a IA gera a UI igualmente.

---

## 1. O que cada um realmente é

### Storybook

Um **app separado** que monta seus componentes em isolamento. Você escreve "stories" — declarações de quais props/estados renderizar:

```typescript
// AttentionRequester.stories.ts
export const Bouncing: Story = {
  args: { animation: bounce, paused: false },
};
export const Paused: Story = {
  args: { animation: bounce, paused: true },
};
```

O Storybook fornece: chrome UI com sidebar, controles de props (knobs), viewport switching, addon ecosystem (a11y, visual regression, etc.).

### Dev Page Dedicada

Uma **página HTML/Svelte normal** dentro do package, servida pelo Vite diretamente. Você escreve o layout, controles e logging como código normal:

```svelte
<!-- O que vocês já têm em src/dev/App.svelte -->
<AttentionRequester bind:this={ref} {paused}>
  <div class="target"></div>
</AttentionRequester>
<button onclick={() => ref.request(animation)}>request()</button>
```

Sem framework de stories, sem configuração de addon. É só uma página Svelte.

---

## 2. Comparação direta

| Aspecto | Storybook | Dev Page |
|---|---|---|
| **Setup inicial** | Pesado: `@storybook/svelte-vite`, config, main.ts, preview.ts, addons | Zero: `index.html` + `App.svelte` + `vite.config.ts` (já têm) |
| **Dependências adicionais** | ~80-120 packages (storybook + addons) | 0 |
| **Build time** | Tem seu próprio build; competem por CI time | Usa o Vite que já existe |
| **Formato de stories** | CSF (Component Story Format) — DSL própria | Svelte normal — linguagem que já usam |
| **Controles de props** | Addon Controls auto-gera knobs a partir de types | Você escreve botões/inputs (ou a IA escreve) |
| **Isolamento de estado** | Cada story é uma instância isolada | Você organiza como quiser |
| **Hot reload** | Sim, mas passa pelo Storybook bundler | Vite direto — mais rápido |
| **Documentação visual** | Sidebar navegável, auto-gerada | Você organiza a página |
| **Addon ecosystem** | a11y, viewport, visual regression, etc. | Você implementa o que precisa |
| **Manutenção contínua** | Storybook major updates (frequentes) quebram configs; addons compatibilidade | Zero manutenção externa |
| **Turborepo integration** | Config extra para build/serve separado | Já integrado via `dev:ar` |

### Custo real do Storybook para Svelte 5

Este ponto merece destaque:

1. **Svelte 5 + Storybook = edge case.** O suporte oficial existe (`@storybook/svelte-vite`), mas Svelte 5 com runes, `$effect`, e a nova reatividade ainda é relativamente novo no ecossistema Storybook. Bugs e incompatibilidades são esperados.

2. **CSF (Component Story Format) é redundante para Svelte.** Em React, CSF faz sentido porque montar componentes programaticamente é verboso. Em Svelte, você monta componentes com... Svelte. Uma story é literalmente um `<Component {...args} />`. O CSF adiciona uma camada de indireção sem ganho real.

3. **Storybook major versions.** Storybook 7 → 8 foi uma migração significativa. A cada 12-18 meses, há breaking changes que exigem atualização de configs e addons. Para um projeto com 2-5 packages, esse custo de manutenção não se justifica.

---

## 3. O fator IA muda a equação

Este é o argumento decisivo.

### A principal vantagem do Storybook é UI "grátis"

Storybook fornece: sidebar navegável, controles auto-gerados, viewport switching, theme toggle. Sem Storybook, você *teria* que construir isso manualmente.

**Mas com IA construindo a dev page, essa vantagem desaparece.**

A IA gera uma dev page com controles, logging, layout organizado, e interatividade em minutos. E o resultado é **código Svelte normal** — sem DSL, sem config, sem abstração extra. Qualquer mudança futura (novo controle, novo cenário, novo log) é um prompt, não uma pesquisa na documentação de addons.

### Storybook tem atrito com IA

| Ação com IA | Dev Page | Storybook |
|---|---|---|
| "Adicione um cenário de drag com collision" | IA adiciona Svelte no App.svelte | IA precisa saber CSF + decorators + addon args |
| "Adicione logging de estado" | IA escreve Svelte normal | IA precisa entender addon Actions ou custom decorators |
| "Mostre o estado interno do Model" | IA adiciona `{model.isActive}` no template | IA precisa de decorator custom ou addon |
| "Teste com viewport mobile" | IA adiciona media query ou resize handle | IA precisa saber do addon viewport |
| "Adicione controle de timing" | IA adiciona `<input type="range">` | IA precisa de argType config |

**A IA é mais eficiente gerando código direto do que navegando abstrações de framework.** Cada camada de indireção (CSF, decorators, addons) é contexto extra que a IA precisa manter, e uma fonte a mais de erros sutis.

### Dev page = contexto mínimo para a IA

A dev page do attention-requester é **197 linhas de Svelte puro**. A IA entende 100% disso sem documentação externa. Para gerar ou modificar, precisa de:
- Conhecimento de Svelte (já tem)
- API pública do componente (imports do `../lib`)
- HTML/CSS (universal)

Para fazer o equivalente em Storybook, a IA precisa de tudo acima **mais**:
- CSF format e suas convenções
- Storybook decorators
- ArgTypes e Controls API
- Addon-specific APIs
- Interação entre preview.ts, main.ts, e stories

**Menos contexto = menos tokens = menos erros = iteração mais rápida.**

---

## 4. Onde o Storybook genuinamente ganha (e alternativas)

### 4a. Catálogo navegável de componentes

**Storybook:** Sidebar automática com todos os componentes e suas variantes.

**Dev page alternativa:** Uma página index que lista todos os packages com links para suas dev pages. Simples de fazer, e cada package já tem seu próprio `bun run dev:ar`, `bun run dev:movable`, etc.

### 4b. Documentação visual para stakeholders

**Storybook:** Deploy público com UI profissional para designers, PMs, QA revisarem.

**Dev page alternativa:** Se precisar, deploy a dev page como uma rota do site (`/dev/ar`). Ou simplesmente não — stakeholders para uma library de animação provavelmente são outros devs que podem rodar `bun run dev:ar` localmente.

### 4c. Addon de acessibilidade (a11y)

**Storybook:** `@storybook/addon-a11y` roda axe-core automaticamente em cada story.

**Dev page alternativa:** Chrome DevTools Lighthouse/Accessibility audit sob demanda. Ou `axe-core` importado direto na dev page — são 3 linhas.

### 4d. Visual regression (Chromatic)

**Storybook:** Chromatic integra nativamente para screenshot testing.

**Dev page alternativa:** Já decidimos no memo anterior que visual regression não se justifica para este tipo de library. Este addon não é argumento.

### 4e. Interaction testing (play functions)

**Storybook:** `@storybook/test` permite scripts de interação dentro das stories.

**Dev page alternativa:** Já decidimos que testes automatizados de UI não serão feitos agora. E quando forem, será via Vitest Browser Mode, não Storybook play functions.

---

## 5. O formato ideal da dev page para @headless-uai

Baseado no que já existe e no que seria mais útil:

### Estrutura por package

```
packages/attention-requester/
├── src/dev/
│   ├── main.ts              ← Entry point (já existe)
│   ├── App.svelte            ← Dev page principal (já existe)
│   └── scenarios/            ← Cenários isolados (futuro)
│       ├── BasicBounce.svelte
│       ├── PauseResume.svelte
│       └── Stress.svelte
├── index.html                ← HTML shell (já existe)
└── vite.config.ts            ← Vite dev server (já existe)
```

### O que a dev page deve ter

1. **Cenários visuais** — cada variante/estado renderizado e identificado com label (já têm: "discard" e "resume")
2. **Controles interativos** — botões que chamam a API pública (já têm: request, pause, cancel)
3. **Log panel** — eventos timestamped para rastrear comportamento (já têm: `addLog()`)
4. **State inspector** — exibição dos valores atuais do Model (isActive, isPaused, animation.name)

O que já existe no `App.svelte` cobre os itens 1-3. Falta apenas o state inspector, que é trivial — a IA adiciona com um prompt.

### Padrão para novos packages

Quando criar um novo package @headless-uai, a IA deve gerar:
- `index.html` + `vite.config.ts` + `src/dev/main.ts` (boilerplate mínimo — copiar do attention-requester)
- `src/dev/App.svelte` com cenários relevantes, controles para toda a API pública, e log panel
- Entrada `dev:<alias>` no root `package.json`

---

## 6. Blind Spots & Things to Consider

1. **A dev page É a especificação visual.** Quando a IA gera um cenário que mostra "bounce com pause e resume", ela está implicitamente criando uma referência visual do comportamento esperado. Se no futuro quiser visual regression, a dev page é o ponto de partida natural — não precisa de Storybook para isso.

2. **Storybook Vitest plugin.** Storybook 8.x tem integração experimental com Vitest para testar stories como unit tests. Se no futuro vocês adotarem Vitest Browser Mode, esse poderia ser um argumento para Storybook. Mas o "se" tem muitas condições: Svelte 5 support maduro + runes compatibility + plugin stable. Hoje, essas condições não estão atendidas.

3. **A principal armadilha da dev page é ela ficar desatualizada.** Se a API do componente muda e a dev page não acompanha, ela se torna mentirosa. Mitigação: a dev page vive dentro do package e é mantida junto com o código. E como a IA gera/atualiza rapidamente, o custo de manutenção é baixo.

4. **Considere um "smoke test humano" como parte do Definition of Done.** Quando completar uma feature ou fix, o último passo antes do commit é: `bun run dev:ar`, executar os cenários da dev page, verificar visualmente. Se isso virar hábito (e a dev page for boa o suficiente), substitui 90% do que Storybook ofereceria.

5. **Se algum dia houver 10+ packages @headless-uai**, talvez valha uma dev page index que agregue todos numa interface navegável. Isso não é Storybook — é uma página Svelte com `<iframe>` ou imports dinâmicos. Mas esse dia está longe.

---

## Recommendation Summary

| Decisão | Escolha | Rationale |
|---|---|---|
| Storybook? | **Não** | Overhead de setup, manutenção, e abstração não se paga; Svelte 5 support ainda imaduro |
| Dev page dedicada? | **Sim** (já têm) | Zero dependências, Svelte puro, iteração rápida com IA |
| Formato da dev page? | Cenários + controles + log + state inspector | Cobre 95% do que Storybook daria |
| IA + Storybook vs IA + dev page? | **IA + dev page vence** | Menos contexto, menos abstração, menos tokens, menos erros |
| Catálogo cross-package? | Não agora; futuramente uma index page | Só justifica com 10+ packages |
| Documentação para stakeholders? | `bun run dev:ar` local | Consumidores são devs, não designers/PMs |

%% Dev page dedicada. O como delas vamos pensar depois. %%
