# Memo — Migração de Linting: Biome → ESLint + Prettier para Svelte

**Date:** 2026-03-20
**Subject:** Avaliar troca de Biome/Ultracite por ESLint + Prettier com configs do `sv` para suporte completo a `.svelte`
**Audience:** Jefferson (project owner)

---

## 1. Reframing da Pergunta

A questão colocada foi: "trocar Biome por ESLint + Prettier, usando configs do `svelte-add`". Antes de responder, vale nomear o problema raiz que motivou essa pergunta:

> **Biome tem suporte incompleto a `.svelte` — false positives acumulam, autofix está desabilitado, workarounds com `biome-ignore` são manuais.**

Esse é o problema real. A pergunta sobre qual ferramenta usar é uma solução proposta. Este memo avalia se é a solução certa — e o que mais você não está considerando.

---

## 2. Correção: `svelte-add` vs `sv`

O `svelte-add` era um projeto da comunidade para scaffolding de integrações em SvelteKit. Em 2024, o time oficial do Svelte lançou o `sv` (`@sveltejs/cli`), que absorveu o `svelte-add`.

Hoje o caminho oficial é:

```bash
bunx sv add eslint prettier
```

Isso gera uma config com `eslint-plugin-svelte`, `typescript-eslint`, e `prettier-plugin-svelte`. **Se a referência na tarefa era "svelte-add", o projeto não existe mais como entidade separada — o equivalente atual é `sv add`.**

---

## 3. O Que `eslint-plugin-svelte` Faz que Biome Não Faz

### 3.1 Parsing nativo do compilador Svelte

`eslint-plugin-svelte` usa o parser oficial do Svelte (`svelte/compiler`) para gerar a AST. Biome usa seu próprio parser, que tenta inferir a estrutura de `.svelte` sem entender a semântica do compilador.

Consequência prática:

| Capacidade | Biome | eslint-plugin-svelte |
|---|---|---|
| Lint do bloco `<script>` | ✅ | ✅ |
| Lint do template (`{#if}`, `{#each}`, snippets) | ⚠️ Parcial | ✅ Completo |
| Regras Svelte-específicas (`svelte/valid-compile`, `svelte/no-at-html-tags`) | ❌ | ✅ |
| Entender runes (`$state`, `$derived`, `$effect`) no template | ❌ Falsos positivos | ✅ |
| Formatting do bloco `<style>` | ⚠️ | ✅ via prettier-plugin-svelte |

### 3.2 Regras Svelte-específicas que não existem no Biome

- `svelte/no-unused-svelte-ignore` — detecta `<!-- svelte-ignore -->` desnecessários
- `svelte/valid-compile` — reproduz diagnósticos do compilador como lint errors
- `svelte/no-reactive-literals` — padrão Svelte 4 que não faz sentido em Svelte 5
- `svelte/require-each-key` — obrigatoriedade de `:key` em `{#each}`
- `svelte/no-at-html-tags` — XSS prevention no uso de `{@html}`

---

## 4. O Que `svelte-check` Já Faz (e o Overlap)

Antes de assumir que precisamos de ESLint para ter "lint completo de Svelte", é importante entender o que `svelte-check` já entrega:

- **Type checking** dentro de `.svelte` (TypeScript via Language Server)
- **Diagnósticos do compilador** (erros de sintaxe, props mal tipadas)
- **A11y warnings** (via `svelte/a11y-*` rules embutidas no compilador)

`eslint-plugin-svelte` **não é um type checker** — ele não substitui o `svelte-check`, e `svelte-check` não substitui o `eslint-plugin-svelte`. São complementares:

- `svelte-check` → type safety + compiler diagnostics
- `eslint-plugin-svelte` → code style, padrões Svelte, lint de template

**O projeto já roda `svelte-check` no CI** (via `turbo check`). A pergunta é se o lint de template e as regras Svelte-específicas valem a migração.

---

## 5. As Três Estratégias Disponíveis

### Estratégia A — Migração Total: ESLint + Prettier para todos os arquivos

Substituir Biome inteiramente. ESLint para TS/JS/Svelte, Prettier para formatting.

**Prós:**
- Toolchain unificado
- Suporte completo a `.svelte` com parser nativo
- Configuração via `sv add eslint prettier` — é o que o time do Svelte usa internamente

**Contras:**
- ESLint + Prettier são ordens de magnitude mais lentos que Biome
- Monorepo com Turborepo: tempo de CI aumenta visivelmente
- Dois binários, mais dependências, mais config files
- `@typescript-eslint` tem curva de configuração maior
- Ultracite não tem equivalente — a opinionated config vai embora, é necessário montar regras manualmente

---

### Estratégia B — Híbrido: Biome para TS/JS, ESLint para .svelte

Manter Biome para todos os arquivos não-Svelte, adicionar ESLint + `eslint-plugin-svelte` **apenas** para `.svelte`. Biome configurado para **ignorar** `.svelte` completamente (sem lint, sem format). Prettier com `prettier-plugin-svelte` apenas para `.svelte`.

**Prós:**
- Biome mantém velocidade para TS/JS
- `.svelte` tem suporte nativo real
- Sem conflitos de formatter (cada ferramenta faz seu conjunto de arquivos)

**Contras:**
- Dois configs de lint separados (carga cognitiva, risco de inconsistência)
- Regras diferentes por tipo de arquivo — pode haver divergências (ex: convenção de import em TS vs Svelte)
- Curva de configuração: alinhar ESLint flat config com o que Biome já impõe em TS/JS

**Armadilha crítica:** Se Biome e Prettier ficarem ativos ao mesmo tempo **para qualquer arquivo em comum**, eles vão conflitar no formatting. É obrigatório que sejam mutuamente exclusivos por tipo de arquivo. Isso é configurável mas requer atenção.

---

### Estratégia C — Melhorar o Setup Atual do Biome

Aceitar as limitações do Biome para `.svelte` como estado de longo prazo e reduzir o atrito dos workarounds.

**O que melhoraria:**
- Auditoria dos `biome-ignore` existentes: quais são false positives vs problemas reais?
- Configurar regras desabilitadas somente onde necessário (não globalmente para todos os `.svelte`)
- Manter `ultracite check` (não `fix`) como padrão documentado

**O que não melhora:** As regras Svelte-específicas listadas na §3.2 simplesmente não existem no Biome. Se você quiser `svelte/valid-compile` ou `svelte/require-each-key`, precisa de `eslint-plugin-svelte`.

**Quando faz sentido:** Se a principal dor é false positives (não ausência de regras Svelte-específicas), essa estratégia resolve sem migração.

---

## 6. Sobre Oxlint — Esclarecimento

A nota original compara Oxlint: "Oxlint já faz linting only their `<script>` blocks". Isso é importante de nomear:

1. **Oxlint é um linter, não um formatter.** Não substitui Prettier nem a parte de formatting do Biome.
2. **Oxlint e Biome não são a mesma coisa.** Biome = linter + formatter. Oxlint = linter só.
3. **"Linting only `<script>` blocks" é uma limitação, não uma feature.** É exatamente o mesmo problema do Biome — nenhum dos dois lê o template Svelte via parser nativo. `eslint-plugin-svelte` é diferente porque usa o Svelte compiler AST.
4. **Oxlint é projetado para rodar ao lado do ESLint**, não em substituição. O modelo deles é: Oxlint para as 500+ regras mais comuns (rápido), ESLint para regras de plugin que Oxlint não implementa. Não faz sentido comparar com Biome na questão Svelte.

---

## 7. O Roadmap do Biome para Svelte

Biome tem trabalhado em melhorias para `.svelte`, mas há uma limitação arquitetural: Biome usa seu próprio parser e não tem intenção de usar o compilador Svelte como parser (isso quebraria o modelo de um único binário). O suporte vai melhorar, mas nunca terá a fidelidade do `eslint-plugin-svelte` — que literalmente executa o compilador.

Se a decisão for "esperar o Biome ficar melhor", essa é uma opção válida, mas sem prazo claro.

---

## 8. Blind Spots

### 8.1 A pergunta "só `.svelte` ou todos os arquivos?" já pressupõe a migração

A pergunta "aplico ESLint só para `.svelte` ou para todos?" assume que vai migrar. A pergunta anterior é: **qual é a dor concreta atual?**

- **Se a dor é:** false positives em `.svelte` que geram `biome-ignore` desnecessários → Estratégia C (auditoria + melhoria de config) pode resolver sem migração.
- **Se a dor é:** ausência de regras como `svelte/valid-compile` que preveniriam bugs reais → Estratégia B (ESLint só para `.svelte`) resolve.
- **Se a dor é:** friction geral com a toolchain → Estratégia A (migração completa) faz mais sentido.

**Nomear a dor antes de escolher a solução.**

### 8.2 `sv add eslint prettier` não é apenas config — gera uma baseline opinionada

O output de `sv add eslint` inclui `eslint.config.js` com flat config, `@typescript-eslint/eslint-plugin`, regras de `eslint-plugin-svelte`, e integração com Prettier. É uma boa baseline, mas **não é opinionada no mesmo nível que Ultracite**. Vai ser necessário adicionar regras para cobrir o que Biome/Ultracite impõe hoje (ex: no barrel files, naming conventions, etc.).

### 8.3 Impacto no Turborepo / CI

- Adicionar ESLint ao pipeline de lint muda o hash de tarefas no Turbo (invalida cache existente)
- ESLint não tem cache nativo tão rápido quanto Biome (Biome é multi-thread via Rust; ESLint é single-thread Node)
- Para mitigar: `eslint --cache` com `.eslintcache` versionado no `.gitignore`, e incluir `--cache` no comando do Turbo

### 8.4 Biome formata `.svelte` com CSS — isso pode ser perdido na migração

O `biome.jsonc` atual tem CSS formatter habilitado para `.svelte`:

```json
"css": { "formatter": { "enabled": true } }
```

`prettier-plugin-svelte` também formata `<style>` blocks — mas a configuração não é idêntica. Uma migração pode mudar silenciosamente o estilo de CSS dentro de `.svelte`. Verificar e alinhar configs antes de aplicar.

### 8.5 A Ultracite tem uma config `ultracite/svelte` — você já está usando o melhor que o Biome oferece para Svelte

O setup atual já usa `"extends": ["ultracite/core", "ultracite/svelte"]`. A Ultracite já fez o trabalho de configurar as melhores práticas disponíveis no Biome para `.svelte`. As limitações que existem não são por falta de configuração — são limitações do parser do Biome. Trocar por ESLint não é "melhor config", é "parser diferente".

---

## 9. Recomendação

### Passo 0 — Nomear a dor real

Antes de implementar qualquer coisa: auditar os `biome-ignore` existentes em `.svelte` e listar as categorias:
- **False positives** (regra OK, parser não entendeu Svelte) → podem virar `biome-ignore` documentados ou config per-rule
- **Regras ausentes** (algo que deveria ser detectado mas não está) → lista quais regras Svelte-específicas fazem falta concretamente

Se a lista de regras ausentes for vazia ou irrelevante para os padrões do projeto, a migração não adiciona valor de segurança — é apenas conveniência.

### Passo 1 (se migrar for a decisão) — Estratégia B: ESLint só para `.svelte`

1. Instalar `eslint`, `eslint-plugin-svelte`, `@typescript-eslint/eslint-plugin`, `prettier`, `prettier-plugin-svelte`
2. Criar `eslint.config.js` com `files: ['**/*.svelte']` — ESLint não toca TS/JS
3. Configurar Biome para `"ignore": ["**/*.svelte"]` — Biome não toca Svelte
4. Criar `.prettierrc` com `prettier-plugin-svelte`, aplicável apenas a `.svelte`
5. Adicionar script de lint separado: `lint:svelte` via ESLint, mantendo `lint` via Biome
6. Integrar ambos no `turbo.json` como steps separados (cacheáveis independentemente)

### Passo 2 (opcional, se a Estratégia B provar seu valor) — Avaliar migração total

Se após 30 dias a Estratégia B estiver funcionando bem e o friction de dois toolchains for baixo, avaliar Estratégia A. Caso contrário, o híbrido é o estado final adequado.

---

## 10. Matriz de Decisão

| Cenário | Recomendação |
|---|---|
| Dor = false positives acumulando em `.svelte` | Auditar biome-ignore + Estratégia C |
| Dor = falta de regras Svelte-específicas relevantes | Estratégia B (ESLint só para `.svelte`) |
| Dor = friction geral com Biome, equipe prefere ESLint | Estratégia A (migração total) |
| Dor = formatting de `.svelte` inconsistente | Prettier-plugin-svelte + Biome com `"ignore": ["**/*.svelte"]` |
| Não há dor concreta, apenas "recomendação oficial" | Não migrar agora — o overhead não justifica |

---

*End of memo.*
