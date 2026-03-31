# Memo — CI com Isolamento por Pacote e Filtragem por Tipo de Diff

**Date:** 2026-03-20
**Subject:** Estratégias para um CI mais inteligente: affected-only, exclusão de docs, e isolamento real de pacotes
**Audience:** Jefferson (project owner)

---

## 1. Estado Atual e o Problema Central

O CI atual resolve _onde_ — checa só `packages/**`, ignora o website. Mas não resolve _o quê_ — quando qualquer arquivo dentro de `packages/**` muda, **todos** os pacotes rodam todas as checagens. Dois problemas concretos disso:

1. Um `README.md` editado em `attention-requester` dispara lint, type check, tests e build de _ambos_ os pacotes.
2. Não há separação de sinal: se `movable` tem falha, a saída do CI mistura com o resultado de `attention-requester`.

> **Urgente, fora de escopo do memo:** `ci.yml` tem **conflitos de merge não resolvidos** (`<<<<<<< HEAD` em três lugares). O workflow não executa em estado atual. Resolver antes de qualquer evolução de CI.

---

## 2. As Três Dimensões do Problema

### 2.1 Affected-Only: rodar só o que mudou

**O que existe nativamente no Turbo:**

```bash
# Compara contra o commit anterior
turbo test --filter=[HEAD^1]

# Compara contra a branch base (correto para pull_request)
turbo test --filter=[origin/dev...HEAD]
```

O Turbo já entende o grafo de tarefas: se `movable` depende de alguma coisa que `attention-requester` exporta, mudar `attention-requester` dispara `movable` também. Isso é o comportamento certo — não queremos "só o pacote literal que mudou", mas "o pacote que mudou **mais seus dependentes**".

**Problema com `HEAD^1` em pull_request:** No evento `pull_request` do GitHub Actions, o checkout está num merge commit sintético. `HEAD^1` aponta para o HEAD do PR, não para a base. O filtro correto é:

```yaml
- run: bunx turbo test --filter=[origin/${{ github.base_ref }}...HEAD]
```

**Blind spot:** O Turbo usa **hashing de arquivos**, não git diff, para detectar mudanças. Se você altera um arquivo e reverte, o Turbo não detecta mudança (hash igual). Isso é uma vantagem — mas significa que o `--filter` afeta _quais tarefas rodam_, não o que o git considera "mudado". As duas coisas são diferentes e podem divergir em edge cases (cherry-picks, amends publicados).

### 2.2 Doc-Only: não disparar checagens de código para diff puro de documentação

**Abordagem A — `paths-ignore` no trigger (nativo, simples):**

```yaml
on:
  pull_request:
    paths:
      - "packages/**/src/**"
      - "packages/**/package.json"
      - "turbo.json"
      - "biome.jsonc"
      - "bun.lock"
    # Não inclui *.md, Docs/**, CHANGELOG.md
```

Isso resolve o caso mais comum: PR que só toca docs não dispara o workflow. **Mas tem um comportamento contra-intuitivo importante:** se um PR toca tanto `src/` quanto `README.md`, o workflow _roda normalmente_ — e está certo, o código mudou.

**Abordagem B — job condicional via `dorny/paths-filter`:**

```yaml
jobs:
  detect:
    runs-on: ubuntu-latest
    outputs:
      code: ${{ steps.filter.outputs.code }}
    steps:
      - uses: dorny/paths-filter@v3
        id: filter
        with:
          filters: |
            code:
              - 'packages/**/src/**'
              - 'packages/**/package.json'

  test:
    needs: detect
    if: needs.detect.outputs.code == 'true'
    # ...
```

**Avaliação:** `dorny/paths-filter` é uma action de terceiro com dependência transitiva. Para um projeto cujos pacotes são distribuídos como código-fonte (shadcn model), supply chain é uma preocupação real. Pesar esse risco contra a conveniência.

**Recomendação:** Comece pela Abordagem A. É nativa, sem dependências, e cobre 95% dos casos. A Abordagem B só faz sentido se você precisar de lógica condicional _dentro_ do workflow (não só para disparar ou não disparar).

**Blind spot sobre "docs são inocentes":** Nem todo diff de documentação é inócuo para código. Exemplos:
- Alterar `Architecture.md` pode implicar mudanças de contrato que o código não reflete ainda.
- Alterar `CHANGELOG.md` deveria ter gerado um commit de código junto.
- Alterar `.size-limit.json` dentro de `packages/attention-requester/` **não** é doc — mas está em `packages/` e seria ignorado se o filtro só cobrir `src/`.

O filtro deve ser sobre **o que aciona checks de código**, não sobre "tipo de arquivo". A pergunta certa é: "esse arquivo, se alterado, pode introduzir uma regressão de código?" Resposta sim → inclui no `paths`.

### 2.3 Isolamento Real: cada pacote como unidade independente

**O que "mais isolado" pode significar:**

| Nível | O que é | Custo |
|---|---|---|
| **L1** (atual) | Um workflow, todos os pacotes juntos | ✅ Zero overhead |
| **L2** | Um workflow, jobs paralelos por pacote | ⚠️ +30–60s overhead por job |
| **L3** | Workflows separados por pacote | ⚠️ Mais YAML, mais complexidade |
| **L4** | Matrix dinâmica: detecta afetados, gera jobs | 🔴 Complexo, difícil de debugar |

**L2 — jobs paralelos por pacote (recomendado próximo passo):**

```yaml
jobs:
  test-attention-requester:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: bun install --frozen-lockfile
      - run: bunx turbo test:coverage --filter=@headless-uai/attention-requester

  test-movable:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: bun install --frozen-lockfile
      - run: bunx turbo test:coverage --filter=@headless-uai/movable
```

**Vantagens:**
- Falhas são imediatamente atribuíveis: "attention-requester / Test failed"
- Pacotes rodam em paralelo em runners separados (mais rápido no total)
- Thresholds de cobertura podem ser diferentes por pacote

**Desvantagens:**
- `bun install` roda duas vezes — use caching de dependências para mitigar
- Cada job tem ~30–60s de overhead de boot (spinner, setup-bun, etc.)
- Manutenção: adicionar um pacote exige adicionar jobs manualmente (ou implementar matrix dinâmica)

**Sobre matrix dinâmica (L4):** É possível gerar a matrix de forma dinâmica — um job "detect" faz `turbo ls --filter=[origin/dev...HEAD]`, produz JSON, e o próximo job usa `fromJson()`. Mas isso exige que o output seja válido para matrix (sem caracteres especiais nos nomes), e qualquer falha no job "detect" bloqueia tudo. Para 2–3 pacotes, o custo de manutenção supera o benefício.

---

## 3. Blind Spots Que Você Provavelmente Não Está Considerando

### 3.1 Turbo Remote Cache é uma alternativa ao affected-only

Se o Turbo Remote Cache estiver configurado (gratuito para open source via Vercel), rodar todos os pacotes pode ser tão rápido quanto rodar só os afetados — porque os pacotes não-modificados têm cache hit e completam em milissegundos.

Custo: configurar `TURBO_TOKEN` e `TURBO_TEAM` como GitHub Actions secrets, e um `turbo.json` com `"remoteCache": {}`. Benefício: zero complexidade de affected detection — o Turbo cuida disso internamente, inclusive localmente.

**Essa pode ser a resposta certa para o monorepo em vez de toda a lógica de filtragem.**

### 3.2 Isolamento de jobs tem um custo oculto: sinal de integração perdido

Se `attention-requester` e `movable` passam cada um nos seus jobs, mas a página de preview do website quebra porque os dois juntos têm conflito de CSS custom properties — você só descobre no smoke test manual. O isolamento por pacote não substitui um job de integração leve (e.g., "o website ainda builda?").

### 3.3 O `paths` filter atual já é mais fino do que parece

O atual `paths: ["packages/**", "turbo.json", ...]` já exclui mudanças no `src/routes/` do website, arquivos de configuração raiz sem relação com pacotes, etc. O que ele _não_ exclui é `packages/**/Docs/**` e `packages/**/*.md`. Esse é o único ajuste necessário para cobrir o caso de "diff de doc não dispara CI" — e cabe em 3 linhas no trigger.

### 3.4 Jobs por pacote requerem estratégia de concurrency separada

O workflow atual tem:
```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

Isso cancela toda a run anterior do workflow se um novo push chega. Com jobs por pacote e concurrency separada por job, um novo push pode deixar jobs "zumbis" do run anterior rodando em paralelo com o novo. É necessário alinhar a estratégia de concurrency ao novo modelo.

### 3.5 Conflito de merge em `ci.yml` — o workflow está quebrado agora

Linhas 106–111 e 117–216 têm markers de conflito. O GitHub Actions ignora arquivos YAML inválidos silenciosamente — o CI simplesmente não roda, sem erro visível na PR. Verificar se os checks estão realmente executando ou apenas sendo ignorados.

---

## 4. Recomendação em Fases

### Imediato (antes de qualquer outra coisa)

Resolver o conflito de merge em `ci.yml`. Escolher entre as duas versões do job `size-pr` (a versão com `andresz1/size-limit-action` é mais simples; a versão manual tem mais controle).

### Fase A — Filtragem de docs (baixo esforço, alto ganho)

Trocar o `paths` do trigger de `"packages/**"` para listar explicitamente os caminhos de _código_:

```yaml
paths:
  - "packages/**/src/**"
  - "packages/**/package.json"
  - "packages/**/*.json"   # .size-limit.json, tsconfig, etc.
  - "turbo.json"
  - "biome.jsonc"
  - "bun.lock"
```

Isso faz com que `packages/**/Docs/**`, `packages/**/*.md`, e `packages/**/README.md` não disparem CI.

### Fase B — Affected-only via Turbo filter

Substituir `--filter='./packages/*'` por `--filter=[origin/${{ github.base_ref }}...HEAD]` em todos os jobs de PR. Para push direto em `dev`, usar `--filter=[HEAD^1]`.

```yaml
- run: bunx turbo test:coverage --filter=[origin/${{ github.base_ref }}...HEAD]
  if: github.event_name == 'pull_request'

- run: bunx turbo test:coverage --filter=[HEAD^1]
  if: github.event_name == 'push'
```

**Alternativa a avaliar antes:** configurar Turbo Remote Cache. Se o cache resolver o problema de velocidade, a complexidade de affected-only deixa de ser necessária.

### Fase C — Jobs por pacote (quando justificado)

Dividir cada job (`lint`, `test`, `build`) em variantes por pacote somente quando:
- O monorepo tiver ≥ 3 pacotes ativos
- Os tempos de CI estiverem acima de 5 minutos
- A atribuição de falhas estiver gerando confusão real

Antes desse ponto, a separação por job é otimização prematura.

---

## 5. Matriz de Decisão

| Problema | Solução simples | Solução robusta | Recomendação |
|---|---|---|---|
| Doc diffs disparam CI | Ajustar `paths` no trigger | `dorny/paths-filter` por job | Ajustar `paths` |
| Todos os pacotes rodam sempre | `--filter=[base...HEAD]` | Turbo Remote Cache | Avaliar cache primeiro |
| Falhas não atribuíveis | Jobs por pacote | Matrix dinâmica | Jobs por pacote (só se ≥3 pkgs) |

---

*End of memo.*
